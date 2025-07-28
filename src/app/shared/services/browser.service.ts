import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  public platformId: Object;
  public isBrowser: boolean;
  private document: Document;

  constructor() {
    this.platformId = inject(PLATFORM_ID);
    this.document = inject(DOCUMENT);
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  isIOS() {
    let userAgent = navigator.userAgent.toLowerCase();
    return /ipad|iphone|ipod|macintosh/.test(userAgent);
  }
}
