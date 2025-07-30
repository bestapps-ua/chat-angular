
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {InternalKeyPair} from '../interfaces/crypto.interface';
import {PemUtils} from '../utils/pem.utils';


@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  constructor() { }

  // Generates a new RSA-OAEP key pair for a user
  generateUserKeyPair(): Observable<InternalKeyPair> {
    return from(window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true, // Key is extractable
      ['encrypt', 'decrypt']
    )).pipe(
      catchError(error => {
        console.error('Error generating user key pair:', error);
        return throwError(() => new Error('Failed to generate user keys.'));
      })
    );
  }

  // Exports a CryptoKey to PEM format
  exportKeyToPem(key: CryptoKey, type: 'PUBLIC' | 'PRIVATE'): Observable<string> {
    return from(PemUtils.exportKeyAsPEM(key, type)).pipe(
      catchError(error => {
        console.error(`Error exporting ${type} key to PEM:`, error);
        return throwError(() => new Error(`Failed to export ${type} key.`));
      })
    );
  }

  // Imports a public key from PEM string
  importPublicKey(pem: string): Observable<CryptoKey> {
    return from(PemUtils.importPublicKeyFromPEM(pem)).pipe(
      catchError(error => {
        console.error('Error importing public key from PEM:', error);
        return throwError(() => new Error('Failed to import public key.'));
      })
    );
  }

  // Imports a private key from PEM string (for internal use after decryption from storage)
  importPrivateKey(pem: string): Observable<CryptoKey> {
    return from(PemUtils.importPrivateKeyFromPEM(pem)).pipe(
      catchError(error => {
        console.error('Error importing private key from PEM:', error);
        return throwError(() => new Error('Failed to import private key.'));
      })
    );
  }

  // Generates a new symmetric AES-GCM key for a message
  generateMessageKey(): Observable<CryptoKey> {
    return from(window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    )).pipe(
      catchError(error => {
        console.error('Error generating message key:', error);
        return throwError(() => new Error('Failed to generate message key.'));
      })
    );
  }

  // Encrypts plaintext message content with a symmetric AES-GCM key
  encryptContent(plaintext: string, messageKey: CryptoKey): Observable<string> {
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const encoded = new TextEncoder().encode(plaintext);

    return from(window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      },
      messageKey,
      encoded
    )).pipe(
      map(ciphertext => {
        const combined = new Uint8Array(iv.length + ciphertext.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(ciphertext), iv.length);
        return btoa(String.fromCharCode.apply(null, Array.from(combined)));
      }),
      catchError(error => {
        console.error('Error encrypting content:', error);
        return throwError(() => new Error('Failed to encrypt message content.'));
      })
    );
  }

  // Decrypts base64 encoded encrypted content with a symmetric AES-GCM key
  decryptContent(encryptedBase64: string, messageKey: CryptoKey): Observable<string> {
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv = combined.slice(0, 16);
    const ciphertext = combined.slice(16);

    return from(window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tagLength: 128,
      },
      messageKey,
      ciphertext
    )).pipe(
      map(decrypted => new TextDecoder().decode(decrypted)),
      catchError(error => {
        console.error('Error decrypting content:', error);
        return throwError(() => new Error('Failed to decrypt message content.'));
      })
    );
  }

  // Encrypts a symmetric message key with a recipient's public key (RSA-OAEP)
  encryptMessageKeyForRecipient(messageKey: CryptoKey, recipientPublicKey: CryptoKey): Observable<string> {
    return from(window.crypto.subtle.exportKey('raw', messageKey)).pipe(
      switchMap(rawMessageKey => window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        recipientPublicKey,
        rawMessageKey
      )),
      map(encryptedKeyBuffer => btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(encryptedKeyBuffer))))),
      catchError(error => {
        console.error('Error encrypting message key for recipient:', error);
        return throwError(() => new Error('Failed to encrypt message key for recipient.'));
      })
    );
  }

  // Decrypts an encrypted symmetric message key using the user's private key
  decryptMessageKey(encryptedKeyBase64: string, userPrivateKey: CryptoKey): Observable<CryptoKey> {
    const encryptedKeyBuffer = Uint8Array.from(atob(encryptedKeyBase64), c => c.charCodeAt(0));

    return from(window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      userPrivateKey,
      encryptedKeyBuffer
    )).pipe(
      switchMap(rawMessageKeyBuffer => PemUtils.importSymmetricKeyFromRaw(rawMessageKeyBuffer)),
      catchError(error => {
        console.error('Error decrypting message key:', error);
        return throwError(() => new Error('Failed to decrypt message key.'));
      })
    );
  }
}
