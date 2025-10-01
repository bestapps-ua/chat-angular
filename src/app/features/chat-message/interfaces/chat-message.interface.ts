import {UserInterface} from '../../user/interfaces/user.interface';
import {EncryptedSymmetricKey} from '../../crypto/interfaces/crypto.interface';

export interface ChatMessageInterface {
  uid: string;
  message: string;
  owner: UserInterface;
  selected: ChatMessageInterface[];
}


export interface ChatMessageRequestPayload {
  roomUid: string;         // MongoDB ObjectId of conversation
  message: string;     // Base64 encoded combined IV+ciphertext
  encryptedSymmetricKeys: EncryptedSymmetricKey[];
  type: string;
}
