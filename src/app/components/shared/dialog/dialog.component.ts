import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface DialogSelectOption {
  value: string | number;
  viewValue: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  standalone: false
})
export class DialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<DialogComponent>>(MatDialogRef);
  data = inject<{
    dialogTitle?: string;
    dialogContent: string;
    dialogClipboard?: string;
    dialogSelectOptions?: DialogSelectOption[];
    dialogSelectPlaceholder?: string;
    dialogActions: string[];
    dialogConfig?: {
      titleAlign?: string;
      contentAlign?: string;
      // when set, Confirm runs this and the dialog stays open until it resolves
      confirmAction?: () => Observable<unknown>;
    };
  }>(MAT_DIALOG_DATA);


  @Input() dialogTitle: string;
  @Input() dialogContent: string;

  public selectOptionForm: FormGroup<{
    selectedValue: FormControl<string | null>
  }>;

  config = {
    titleAlign: 'center',
    contentAlign: 'center',
  };

  public isConfirmPending = false;

  ngOnInit(): void {
    if (this.data?.dialogConfig) {
      Object.assign(this.config, this.data.dialogConfig);
    }
    if (this.data.dialogSelectOptions?.length > 0) {
      this.selectOptionForm = new FormGroup({
        selectedValue: new FormControl('', {nonNullable: true, validators: [Validators.required]})
      });
    }
  }

  isFormReady(): boolean {
    if (this.data.dialogSelectOptions?.length > 0) {
      return !this.selectOptionForm.controls.selectedValue.invalid;
    } else {
      return true;
    }
  }

  onConfirm(): void {
    const confirmAction = this.data.dialogConfig?.confirmAction;
    if (!confirmAction) {
      this.dialogRef.close(true);
      return;
    }
    // block the exits while the action runs; only success closes the dialog
    this.isConfirmPending = true;
    this.dialogRef.disableClose = true;
    confirmAction().subscribe({
      next: () => this.dialogRef.close(true),
      error: () => {
        this.isConfirmPending = false;
        this.dialogRef.disableClose = false;
      }
    });
  }

  onSubmit(): void {
    if (this.data.dialogSelectOptions?.length > 0 && this.selectOptionForm.valid) {
      this.dialogRef.close(this.selectOptionForm.value.selectedValue)
    } else {
      this.dialogRef.close(true);
    }
  }
}
