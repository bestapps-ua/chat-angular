import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, filter, from, Observable, of, switchMap, take, tap, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CryptoService} from '../../crypto/services/crypto.service';
import {KeyStorageService} from '../../crypto/services/key-storage.service';
import {EncryptedMessagePayload, EncryptedSymmetricKey} from '../../crypto/interfaces/crypto.interface';
import {catchError, map} from 'rxjs/operators';
import {AuthService} from '../../auth/services/auth.service';
import {UserService} from '../../user/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private apiUrl = '/api/messages'; // Adjust to your NestJS backend URL
  private readonly _messages = new BehaviorSubject<EncryptedMessagePayload[]>([]);
  public readonly messages$ = this._messages.asObservable();

  constructor(
    private http: HttpClient,
    private cryptoService: CryptoService,
    private keyStorageService: KeyStorageService,
    private userService: UserService,
    private authService: AuthService,
  ) {
  }


  sendMessage(conversationId: string, messageText: string, recipientUserIds: string[]): Observable<any> {
    const currentUserId = this.authService.getCurrentUserId();
    if (!currentUserId) {
      return throwError(() => new Error('User not authenticated.'));
    }

    const userPrivateKey$ = this.authService.userPrivateKey$; // An Observable holding the CryptoKey

    const allParticipantIds = [...new Set([...recipientUserIds, currentUserId])];
    const publicKeys$ = this.userService.getPublicKeysForConversation(conversationId);

    return combineLatest([userPrivateKey$, this.cryptoService.generateMessageKey(), publicKeys$]).pipe(
      switchMap(([userPrivateKey, messageKey, publicKeysData]) => {
        if (!userPrivateKey) {
          return throwError(() => new Error('Private key not loaded.'));
        }

        if (!publicKeysData) {
          return throwError(() => new Error('publicKeysData key not loaded.'));
        }

        const publicKeysMap = new Map(publicKeysData.map(p => [p._id, p.publicKey]));
        const encryptionPromises: Promise<EncryptedSymmetricKey>[] = [];

        // Encrypt messageKey for each participant
        for (const participantId of allParticipantIds) {
          const participantPublicKeyPEM = publicKeysMap.get(participantId);
          if (!participantPublicKeyPEM) {
            console.warn(`Public key for participant ${participantId} not found.`);
            continue; // Skip if public key not available
          }
          encryptionPromises.push(
            this.cryptoService.importPublicKey(participantPublicKeyPEM).pipe(
              switchMap(pk => this.cryptoService.encryptMessageKeyForRecipient(messageKey, pk)),
              map(encryptedKey => ({userId: participantId, key: encryptedKey}))
            ).toPromise() as Promise<EncryptedSymmetricKey> // Cast due to Promise.all
          );
        }

        return from(Promise.all(encryptionPromises)).pipe(
          switchMap(encryptedSymmetricKeys =>
            this.cryptoService.encryptContent(messageText, messageKey).pipe(
              map(encryptedContent => ({
                conversation: conversationId,
                sender: currentUserId,
                encryptedContent: encryptedContent,
                encryptedSymmetricKeys: encryptedSymmetricKeys,
                type: 'text',
              } as EncryptedMessagePayload))
            )
          )
        );
      }),
      switchMap((encryptedPayload: EncryptedMessagePayload) => {
        return this.http.post(this.apiUrl, encryptedPayload); // Send to NestJS backend
      }),
      tap(() => console.log('Message sent successfully!')),
      catchError(error => {
        console.error('Error sending message:', error);
        return throwError(() => new Error('Failed to send encrypted message.'));
      })
    );
  }

  getAndDecryptConversationMessages(conversationId: string): Observable<string[]> {
    const currentUserId = this.authService.getCurrentUserId();
    const userPrivateKey$ = this.authService.userPrivateKey$;
    if (!currentUserId) {
      return throwError(() => new Error('User not authenticated.'));
    }

    return combineLatest([
      this.http.get<EncryptedMessagePayload[]>(`${this.apiUrl}/conversation/${conversationId}`),
      userPrivateKey$,
    ]).pipe(
      filter(([_, privateKey]) => !!privateKey),
      take(1),
      switchMap(([encryptedMessages, userPrivateKey]) => {
        const decryptionPromises: Observable<string>[] = [];

        for (const msg of encryptedMessages) {
          const userEncryptedSymmetricKey = msg.encryptedSymmetricKeys.find(k => k.userId === currentUserId);

          if (userEncryptedSymmetricKey && userPrivateKey) {
            decryptionPromises.push(
              this.cryptoService.decryptMessageKey(userEncryptedSymmetricKey.key, userPrivateKey).pipe(
                switchMap(messageKey => this.cryptoService.decryptContent(msg.encryptedContent, messageKey)),
                catchError(err => {
                  console.error(`Failed to decrypt message ${msg.uid}:`, err);
                  return of('[Decryption Failed]'); // Return a placeholder if decryption fails
                })
              )
            );
          } else {
            decryptionPromises.push(of('[No Key For User]')); // Or handle as an error
          }
        }
        return combineLatest(decryptionPromises);
      }),
      tap(decryptedMsgs => this._messages.next(decryptedMsgs as any)), // Update BehaviorSubject
      catchError(error => {
        console.error('Error fetching or decrypting messages:', error);
        return throwError(() => new Error('Failed to load conversation messages.'));
      })
    );
  }

  handleIncomingEncryptedMessage(encryptedMessage: EncryptedMessagePayload): void {
    const currentUserId = this.authService.getCurrentUserId();
    const userPrivateKey$ = this.authService.userPrivateKey$;

    if (!currentUserId || !encryptedMessage) {
      console.warn('Cannot process incoming message: missing user or message data.');
      return;
    }


    const userEncryptedSymmetricKey = encryptedMessage.encryptedSymmetricKeys.find(k => k.userId === currentUserId);

    if (userEncryptedSymmetricKey) {
      userPrivateKey$.pipe(
        filter(pk => !!pk), // Ensure private key is loaded
        take(1),
        switchMap(userPrivateKey => this.cryptoService.decryptMessageKey(userEncryptedSymmetricKey.key, userPrivateKey)),
        switchMap(messageKey => this.cryptoService.decryptContent(encryptedMessage.encryptedContent, messageKey)),
        catchError(err => {
          console.error(`Failed to decrypt incoming message ${encryptedMessage.uid}:`, err);
          return of('[Decryption Failed]');
        })
      ).subscribe(decryptedText => {
        console.log('New decrypted message:', decryptedText);
        const currentMessages = this._messages.getValue();
        this._messages.next([...currentMessages, {...encryptedMessage, decryptedContent: decryptedText}]); // Add decrypted content for display
      });
    } else {
      console.warn('Incoming message has no key for current user, cannot decrypt.');
    }


  }
}
