import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DynamicDialogComponent, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ChatRoomInterface} from '../../features/chat-room/interfaces/chat-room.interface';
import {DialogEventService} from '../../shared/services/dialog-event.service';
import {Subject, takeUntil} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {ErrorFormMessageComponent} from '../error/form-message/error-form-message.component';
import {ErrorMessage} from '../error/message/error-message';
import {RouterLink} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../../entities/store';
import {AuthActions} from '../../entities/store/auth/auth.actions';
import {ChatRoomsActions} from '../../entities/store/chat-rooms/chat-rooms.actions';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-chat-create',
  imports: [
    AsyncPipe,
    ErrorFormMessageComponent,
    ErrorMessage,
    ReactiveFormsModule,
    InputText,
  ],
  templateUrl: './chat-create-component.html',
  styleUrl: './chat-create-component.css'
})
export class ChatCreateComponent implements OnInit, OnDestroy {
  ref: DynamicDialogRef = inject(DynamicDialogRef);
  instance: DynamicDialogComponent | undefined;

  dialogEventService: DialogEventService = inject(DialogEventService);

  private destroy$ = new Subject<void>();

  data: any;

  form!: FormGroup;

  public validationMessages: any = {
    name: [
      {type: 'required', message: 'Name is required.'},
      {type: 'minLength', message: 'Name must be at least 6 characters.'},
    ]
  };

  private store = inject(Store<AppState>);

  ngOnInit() {
    if (this.instance && this.instance.data) {
      this.data = this.instance.data;
    }

    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    this.dialogEventService.save$.pipe(
      takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSave();
      });

    this.dialogEventService.close$.pipe(
      takeUntil(this.destroy$))
      .subscribe(() => {
        this.ref.close();
      });

    this.dialogEventService.success$.pipe(
      takeUntil(this.destroy$))
      .subscribe(() => {
        this.ref.close();
      });
  }

  onSave() {
    if (!this.form.valid) {
      this.dialogEventService.emitNotValid()
      return this.form.markAllAsTouched();
    }
    const formData = this.form.value;
    this.store.dispatch(ChatRoomsActions.create({name: formData.name}));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.onSave();
  }
}
