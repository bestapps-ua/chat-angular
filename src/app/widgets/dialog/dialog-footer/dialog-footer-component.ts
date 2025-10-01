import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Button} from 'primeng/button';
import {DialogButtonInterface} from '../../../shared/interfaces/dialog-button.interface';
import {DialogEventService} from '../../../shared/services/dialog-event.service';
import {Observable, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-dialog-footer',
  imports: [
    Button
  ],
  templateUrl: './dialog-footer-component.html',
  styleUrl: './dialog-footer-component.css'
})
export class DialogFooterComponent implements OnInit, OnDestroy {

  active: boolean = true;
  ref: DynamicDialogRef = inject(DynamicDialogRef);
  dialogEventService: DialogEventService = inject(DialogEventService);

  config: DynamicDialogConfig = inject(DynamicDialogConfig);

  buttons: DialogButtonInterface[] = [
    {label: 'Close', icon: 'pi pi-times', styleClass: 'p-button-secondary', action: 'close'},
  ];

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.buttons = this.config.data.buttons || this.buttons;

    this.onEvent(this.dialogEventService.notValid$);
    this.onEvent(this.dialogEventService.error$);
  }

  onEvent(obs: Observable<any>) {
    return obs.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.active = true;
    });
  }

  onButtonClick(action: string) {
    this.active = false;

    if (action === 'save') {
      this.dialogEventService.emitSave();
    }

    if (action === 'close') {
      this.dialogEventService.emitClose();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
