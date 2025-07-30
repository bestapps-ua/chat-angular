import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {ErrorFormMessageComponent} from "../../widgets/error/form-message/error-form-message.component";
import {ErrorMessage} from "../../widgets/error/message/error-message";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Store} from '@ngrx/store';
import {AppState} from '../../entities/store';
import {Observable} from 'rxjs';
import {selectAuthError} from '../../entities/store/auth/auth.selectors';
import {AuthActions} from '../../entities/store/auth/auth.actions';
import {Router, RouterLink} from '@angular/router';
import appRoutes from '../../shared/routes/routes';
import Routes from '../../shared/routes/routes';

@Component({
  selector: 'app-register',
  imports: [
    AsyncPipe,
    ErrorFormMessageComponent,
    ErrorMessage,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit{
  form!: FormGroup;

  public validationMessages: any = {
    email: [
      {type: 'required', message: 'Email is required.'},
      {type: 'email', message: 'Email must be a valid email address.'},
    ],
    username: [
      {type: 'required', message: 'Username is required.'},
      {type: 'minLength', message: 'Password must be at least 4 characters.'},
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
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return this.form.markAllAsTouched();
    }
    this.store.dispatch(AuthActions.register({
      email: this.form.value.email,
      username: this.form.value.username,
      password: this.form.value.password,
    }));
  }


}
