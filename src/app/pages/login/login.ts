import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ErrorFormMessageComponent} from '../../widgets/error/form-message/error-form-message.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../entities/store';
import {AuthActions} from '../../entities/store/auth/auth.actions';
import {Observable} from 'rxjs';
import {selectAuthError, selectAuthToken} from '../../entities/store/auth/auth.selectors';
import {AsyncPipe} from '@angular/common';
import {ErrorMessage} from '../../widgets/error/message/error-message';
import appRoutes from '../../shared/routes/routes';
import {Router, RouterLink} from '@angular/router';
import Routes from '../../shared/routes/routes';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    ErrorFormMessageComponent,
    AsyncPipe,
    ErrorMessage,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  form!: FormGroup;

  public validationMessages: any = {
    email: [
      {type: 'required', message: 'Email is required.'},
      {type: 'email', message: 'Email must be a valid email address.'},
    ],
    password: [
      {type: 'required', message: 'Password is required.'},
      {type: 'minLength', message: 'Password must be at least 6 characters.'},
    ]
  };

  private store = inject(Store<AppState>);
  router: Router = inject(Router);
  readonly appRoutes = Routes;

  error$: Observable<string | null> = this.store.select(selectAuthError);

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return this.form.markAllAsTouched();
    }
    this.store.dispatch(AuthActions.login({email: this.form.value.email, password: this.form.value.password}));
  }

}
