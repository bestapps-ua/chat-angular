export interface KeyPairPEM {
  publicKey: string;  // PEM-encoded SPKI public key
  privateKey: string; // PEM-encoded PKCS#8 private key (encrypted for storage)
}

export interface EncryptedSymmetricKey {
  userId: string;     // MongoDB ObjectId as string
  key: string;        // Base64 encoded, RSA-OAEP encrypted symmetric message key
}

export interface EncryptedMessagePayload {
  uid: string;
  conversation: string;         // MongoDB ObjectId of conversation
  sender: string;               // MongoDB ObjectId of sender
  encryptedContent: string;     // Base64 encoded combined IV+ciphertext
  encryptedSymmetricKeys: EncryptedSymmetricKey[];
  decryptedContent: string;
  type: string;
}

// For internal use, when keys are in CryptoKey format
export interface InternalKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}
