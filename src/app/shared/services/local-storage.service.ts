import {inject, Injectable} from '@angular/core';
import {LocalStorageInterface} from '../interfaces/local-storage.interface';
import {BrowserService} from './browser.service';

class ServerStorage implements LocalStorageInterface {
  data = new Map();

  getItem(key: string) {
    return this.data.get(key);
  }

  setItem(key: string, value: string) {
    this.data.set(key, value);
    return this.getItem(key);
  }

  removeItem(key: string) {
    this.data.delete(key);
  }
}


class WebStorage implements LocalStorageInterface {
  getItem(key: string) {
    return localStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
    return this.getItem(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements LocalStorageInterface {
  service!: LocalStorageInterface;
  browserService: BrowserService = inject(BrowserService);

  constructor() {
    this.service = this.browserService.isBrowser ? new WebStorage() : new ServerStorage();
  }

  getItem(key: string): string | null {
    return this.service.getItem(key);
  }

  setItem(key: string, value: string): string | null {
    return this.service.setItem(key, value);
  }

  removeItem(key: string) {
    this.service.removeItem(key);
  }
}
