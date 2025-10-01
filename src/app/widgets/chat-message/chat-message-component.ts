import {Component, inject, Input, OnInit} from '@angular/core';
import {ErrorFormMessageComponent} from '../error/form-message/error-form-message.component';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Textarea} from 'primeng/textarea';
import {Button} from 'primeng/button';
import {AuthActions} from '../../entities/store/auth/auth.actions';
import {Store} from '@ngrx/store';
import {AppState} from '../../entities/store';
import {ChatMessagesActions} from '../../entities/store/chat-messages/chat-messages.actions';
import {selectSelectedChatRoom} from '../../entities/store/chat-rooms/chat-rooms.selectors';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {ChatRoomInterface} from '../../features/chat-room/interfaces/chat-room.interface';

@Component({
  selector: 'app-chat-message',
  imports: [
    ErrorFormMessageComponent,
    ReactiveFormsModule,
    Textarea,
    Button
  ],
  templateUrl: './chat-message-component.html',
  styleUrl: './chat-message-component.css'
})
export class ChatMessageComponent implements OnInit {
  form!: FormGroup;

  private store = inject(Store<AppState>);
  public validationMessages: any = {
    message: [
      //{type: 'required', message: 'Email is required.'},
    ],
  };
  @Input() chatRoom!: ChatRoomInterface;

  ngOnInit(): void {
    this.form = new FormGroup({
      message: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      return this.form.markAllAsTouched();
    }

    const message: string = this.form.value.message;
    this.store.dispatch(ChatMessagesActions.create({chatRoom: this.chatRoom, message}));

  }
}
