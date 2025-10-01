import {Injectable} from '@angular/core';
import {BehaviorSubject, filter, from, Observable, of, take, tap, throwError, timeout} from 'rxjs';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CryptoService} from '../../crypto/services/crypto.service';
import {
  EncryptedMessagePayload,
  EncryptedSymmetricKey
} from '../../crypto/interfaces/crypto.interface';
import {AuthService} from '../../auth/services/auth.service';
import {ChatRoomsService} from '../../chat-room/services/chat-rooms.service';
import {ApiService} from '../../../shared/services/api.service';
import {ChatMessageRequestPayload} from '../interfaces/chat-message.interface';
import {ApiCursorListInterface} from '../../../shared/interfaces/api-cursor-list.interface';
import {ChatRoomKeyInterface} from '../../chat-room/interfaces/chat-room-key.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private apiUrl = 'chat/messages'; // Adjust to your NestJS backend URL
  private readonly _messages = new BehaviorSubject<EncryptedMessagePayload[]>([]);
  public readonly messages$ = this._messages.asObservable();

  constructor(
    private http: HttpClient,
    private cryptoService: CryptoService,
    private authService: AuthService,
    private apiService: ApiService,
    private chatRoomsService: ChatRoomsService,
  ) {
  }


  sendMessage(conversationId: string, messageText: string, recipientUserIds: string[]): Observable<any> {
    return from(this.sendMessageAsync(conversationId, messageText, recipientUserIds));
  }

  private async sendMessageAsync(conversationId: string, messageText: string, recipientUserIds: string[]): Promise<any> {
    try {
      const currentUserId = this.authService.getCurrentUserId();
      if (!currentUserId) {
        throw new Error('User not authenticated.');
      }

      const allParticipantIds = [...new Set([...recipientUserIds, currentUserId])];

      // Get required data concurrently
      const [userPrivateKey, messageKey, publicKeysData] = await Promise.all([
        firstValueFrom(this.authService.userPrivateKey$.pipe(filter(pk => !!pk), take(1), timeout(5000))),
        firstValueFrom(this.cryptoService.generateMessageKey()),
        firstValueFrom(this.chatRoomsService.getRoomPublicKeys(conversationId))
      ]);
      if (!userPrivateKey) {
        throw new Error('Private key not loaded.');
      }

      if (!publicKeysData) {
        throw new Error('publicKeysData key not loaded.');
      }

      const publicKeysMap = new Map(publicKeysData.map(p => [p.uid, p.publicKey]));
      const encryptionPromises: Promise<EncryptedSymmetricKey>[] = [];

      // Encrypt messageKey for each participant
      for (const participantId of allParticipantIds) {
        const participantPublicKeyPEM = publicKeysMap.get(participantId);
        if (!participantPublicKeyPEM) {
          console.warn(`Public key for participant ${participantId} not found.`);
          continue; // Skip if public key not available
        }

        encryptionPromises.push(
          firstValueFrom(this.cryptoService.importPublicKey(participantPublicKeyPEM))
            .then(pk => firstValueFrom(this.cryptoService.encryptMessageKeyForRecipient(messageKey, pk)))
            .then(encryptedKey => ({userId: participantId, key: encryptedKey}))
        );
      }

      const encryptedSymmetricKeys = await Promise.all(encryptionPromises);
      const encryptedContent = await firstValueFrom(this.cryptoService.encryptContent(messageText, messageKey));

      const encryptedPayload: ChatMessageRequestPayload = {
        roomUid: conversationId,
        message: encryptedContent,
        encryptedSymmetricKeys,
        type: 'text',
      };

      const result = await firstValueFrom(this.apiService.callPost(this.apiUrl, encryptedPayload));
      console.log('Message sent successfully!');
      return result;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send encrypted message.');
    }
  }

  getMessages(conversationId: string): Observable<string[]> {
    return from(this.getMessagesAsync(conversationId));
  }

  private async getMessagesAsync(conversationId: string): Promise<string[]> {
    try {

      const currentUserId = this.authService.getCurrentUserId();
      console.log('Conversation ID: ', conversationId, currentUserId);
      if (!currentUserId) {
        throw new Error('User not authenticated.');
      }
      console.log('aaa');
      // Wait for both data and private key
      const [data, userPrivateKey] = await Promise.all([
        firstValueFrom(this.apiService.callGet<ApiCursorListInterface>(`${this.apiUrl}/room/${conversationId}`)),
        firstValueFrom(this.authService.userPrivateKey$.pipe(tap(data => {console.log(data)}), filter(pk => !!pk), take(1)))
      ]);
      console.log('bbb');
      const decryptionPromises: Promise<string>[] = [];

      for (const msg of data.items) {
        // Find the encrypted symmetric key for the current user from the message
        const userEncryptedSymmetricKey = msg.encryptedSymmetricKeys?.find((k: EncryptedSymmetricKey) => k.userId === currentUserId);

        if (userEncryptedSymmetricKey && userPrivateKey) {
          console.log('Found encrypted key for user:', userEncryptedSymmetricKey);
          decryptionPromises.push(
            this.decryptSingleMessage(msg.encryptedContent, userEncryptedSymmetricKey.key, userPrivateKey, msg.uid)
          );
        } else {
          console.warn(`No encrypted symmetric key found for user ${currentUserId} in message ${msg.uid}`);
          decryptionPromises.push(Promise.resolve('[No Key For User]'));
        }
      }

      const decryptedMsgs = await Promise.all(decryptionPromises);
      console.log('zzz',decryptedMsgs);
      this._messages.next(decryptedMsgs as any); // Update BehaviorSubject
      return decryptedMsgs;
    } catch (error) {
      console.error('Error fetching or decrypting messages:', error);
      throw new Error('Failed to load conversation messages.');
    }
  }

  private async decryptSingleMessage(encryptedContent: any, publicKey: any, userPrivateKey: any, msgUid: string): Promise<string> {
    try {
      const messageKey = await firstValueFrom(this.cryptoService.decryptMessageKey(publicKey, userPrivateKey));
      return await firstValueFrom(this.cryptoService.decryptContent(encryptedContent, messageKey));
    } catch (err) {
      console.error(`Failed to decrypt message ${msgUid}:`, err);
      return '[Decryption Failed]';
    }
  }

  handleIncomingEncryptedMessage(encryptedMessage: EncryptedMessagePayload): void {
    this.handleIncomingEncryptedMessageAsync(encryptedMessage);
  }

  private async handleIncomingEncryptedMessageAsync(encryptedMessage: EncryptedMessagePayload): Promise<void> {
    try {
      const currentUserId = this.authService.getCurrentUserId();

      if (!currentUserId || !encryptedMessage) {
        console.warn('Cannot process incoming message: missing user or message data.');
        return;
      }

      const userEncryptedSymmetricKey = encryptedMessage.encryptedSymmetricKeys.find(k => k.userId === currentUserId);

      if (userEncryptedSymmetricKey) {
        const userPrivateKey = await firstValueFrom(
          this.authService.userPrivateKey$.pipe(
            filter(pk => !!pk), // Ensure private key is loaded
            take(1)
          )
        );

        const messageKey = await firstValueFrom(
          this.cryptoService.decryptMessageKey(userEncryptedSymmetricKey.key, userPrivateKey)
        );

        const decryptedText = await firstValueFrom(
          this.cryptoService.decryptContent(encryptedMessage.encryptedContent, messageKey)
        );

        console.log('New decrypted message:', decryptedText);
        const currentMessages = this._messages.getValue();
        this._messages.next([...currentMessages, {...encryptedMessage, decryptedContent: decryptedText}]); // Add decrypted content for display
      } else {
        console.warn('Incoming message has no key for current user, cannot decrypt.');
      }
    } catch (err) {
      console.error(`Failed to decrypt incoming message ${encryptedMessage.uid}:`, err);
      const currentMessages = this._messages.getValue();
      this._messages.next([...currentMessages, {...encryptedMessage, decryptedContent: '[Decryption Failed]'}]);
    }
  }
}
