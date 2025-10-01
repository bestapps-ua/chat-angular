export class PemUtils {
  static async exportKeyAsPEM(key: CryptoKey, type: 'PUBLIC' | 'PRIVATE'): Promise<string> {
    const exported = await window.crypto.subtle.exportKey(
      type === 'PUBLIC' ? 'spki' : 'pkcs8',
      key
    );
    const uint = new Uint8Array(exported);
    const exportedAsString = btoa(String.fromCharCode.apply(null, Array.from(uint)));
    return `-----BEGIN ${type} KEY-----\n${exportedAsString.match(/.{1,64}/g)?.join('\n')}\n-----END ${type} KEY-----`;
  }

  static async importPublicKeyFromPEM(pem: string): Promise<CryptoKey> {
    const pemHeader = '-----BEGIN PUBLIC KEY-----';
    const pemFooter = '-----END PUBLIC KEY-----';
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length)
      .replace(/\n/g, '');
    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

    return window.crypto.subtle.importKey(
      'spki',
      binaryDer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false, // Not extractable, as it's a public key from external source
      ['encrypt']
    );
  }

  static async importPrivateKeyFromPEM(pem: string): Promise<CryptoKey> {
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length)
      .replace(/\n/g, '');
    const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

    return window.crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['decrypt']
    );
  }

  static async importSymmetricKeyFromRaw(rawKeyBuffer: ArrayBuffer): Promise<CryptoKey> {
    return window.crypto.subtle.importKey(
      'raw',
      rawKeyBuffer,
      { name: 'AES-GCM', length: 256 },
      true, // Extractable if needed for further encryption (e.g., self-healing for new devices)
      ['encrypt', 'decrypt']
    );
  }
}
