import {HttpErrorResponse} from '@angular/common/http';
import {of} from 'rxjs';

export function getErrorMessage(error: any) {
  let message = 'Internal error';
  console.log(error);
  let err = error;
  if (err instanceof HttpErrorResponse) {
    if (err.status != 0) {
      message = err.statusText;
    }
  } else {
    message = err?.error.message || err;
  }
  return message;
}
