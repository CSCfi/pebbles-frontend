import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    this.dialogRef.close(true);
  }

  onSubmit(): void {
    if (this.data.dialogSelectOptions?.length > 0 && this.selectOptionForm.valid) {
      this.dialogRef.close(this.selectOptionForm.value.selectedValue)
    } else {
      this.dialogRef.close(true);
    }
  }
}
