export interface LocalStorageInterface {
  getItem(key: string): string  | null;
  setItem(key: string, value: string): string | null;
  removeItem(key: string): void;
}
