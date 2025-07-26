import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ErrorMessage} from '../message/error-message';

@Component({
  selector: 'app-error-form-message',
  templateUrl: './error-form-message.component.html',
  imports: [
    ErrorMessage
  ],
  styleUrls: ['./error-form-message.component.scss']
})
export class ErrorFormMessageComponent {
  @Input() name!: string;
  @Input() form!: FormGroup;
  @Input() validationMessages!: { [key: string]: any };

  error: string = '';

  isError(validationType: string) {
    const formControl = this.form.get(this.name);
    let has = (formControl?.hasError(validationType) && (formControl.dirty || formControl.touched));
    return has;
  }

  hasError(validationType: string) {
    let has = this.isError(validationType);
    if(has) {
      if(this.error === '') {
        this.error = validationType;
      }else if(!this.isError(this.error)) {
        this.error = validationType;
      }
    }

    if(has) {
      if (this.error === validationType) {
        return true;
      }else{
        return false;
      }
    }

    return has;
  }

  messages(name: string) {
    return this.validationMessages[name];
  }
}
