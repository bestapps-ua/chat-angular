import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as idb from 'idb-keyval';
import {PemUtils} from '../utils/pem.utils';

@Injectable({
  providedIn: 'root',
})
export class KeyStorageService {
  private readonly PRIVATE_KEY_STORE = 'encrypted_private_keys';

  constructor() { }

  // Derives a symmetric key from a user's password using PBKDF2
  private async deriveKeyFromPassword(password: string): Promise<CryptoKey> {
    const salt = new TextEncoder().encode('YOUR_APP_STATIC_SALT_OR_BETTER_PER_USER_SALT'); // Use a proper salt
    const passwordBuffer = new TextEncoder().encode(password);
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Encrypts a plaintext string with a symmetric key
  private async encryptStringWithKey(plaintext: string, key: CryptoKey): Promise<string> {
    const iv = window.crypto.getRandomValues(new Uint8Array(16)); // AES-GCM IV
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoded
    );
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return btoa(String.fromCharCode.apply(null, Array.from(combined)));
  }

  // Decrypts a base64 encoded string with a symmetric key
  private async decryptStringWithKey(encryptedBase64: string, key: CryptoKey): Promise<string> {
    const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
    const iv = combined.slice(0, 16);
    const ciphertext = combined.slice(16);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  }

  // Saves the PEM-encoded private key, encrypted with a password-derived key
  saveEncryptedPrivateKey(userId: string, privateKeyPem: string, password: string): Observable<void> {
    return from(this.deriveKeyFromPassword(password)).pipe(
      switchMap(encryptionKey => this.encryptStringWithKey(privateKeyPem, encryptionKey)),
      switchMap(encryptedPem => idb.set(`${this.PRIVATE_KEY_STORE}_${userId}`, encryptedPem)),
      catchError(error => {
        console.error('Error saving encrypted private key:', error);
        return throwError(() => new Error('Could not save private key securely.'));
      })
    );
  }

  // Loads and decrypts the private key using the password
  loadAndDecryptPrivateKey(userId: string, password: string): Observable<CryptoKey> {
    return from(idb.get(`${this.PRIVATE_KEY_STORE}_${userId}`)).pipe(
      switchMap(encryptedPem => {
        if (!encryptedPem) {
          return throwError(() => new Error('Encrypted private key not found for user.'));
        }
        return from(this.deriveKeyFromPassword(password)).pipe(
          switchMap(encryptionKey => this.decryptStringWithKey(encryptedPem, encryptionKey)),
          switchMap(decryptedPem => PemUtils.importPrivateKeyFromPEM(decryptedPem))
        );
      }),
      catchError(error => {
        console.error('Error loading or decrypting private key:', error);
        return throwError(() => new Error('Invalid password or key not found.'));
      })
    );
  }

  // ... other methods like deleteKey, etc.
}
