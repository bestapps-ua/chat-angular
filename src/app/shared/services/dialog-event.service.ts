import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogEventService {
  private saveSubject = new Subject<void>();

  save$ = this.saveSubject.asObservable();

  private closeSubject = new Subject<void>();

  close$ = this.closeSubject.asObservable();

  private errorSubject = new Subject<void>();

  error$ = this.errorSubject.asObservable();

  private notValidSubject = new Subject<void>();

  notValid$ = this.notValidSubject.asObservable();

  private successSubject = new Subject<void>();

  success$ = this.successSubject.asObservable();

  emitSave() {
    this.saveSubject.next();
  }

  emitClose() {
    this.closeSubject.next();
  }

  emitError(error: any) {
    this.errorSubject.next(error);
  }

  emitNotValid() {
    this.notValidSubject.next();
  }

  emitSuccess() {
    this.successSubject.next();
  }
}
