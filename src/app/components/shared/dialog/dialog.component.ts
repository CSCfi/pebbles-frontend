import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from "@angular/forms";

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

  @Input() dialogTitle: string;
  @Input() dialogContent: string;
  @Input() dialog: any; // ---- TODO: Check we need it or not

  public selectOptionForm: FormGroup<{
    selectedValue: FormControl<string | null>
  }>;

  config = {
    titleAlign: 'center',
    contentAlign: 'center',
  };

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      dialogTitle?: string,
      dialogContent: string,
      dialogClipboard?: string,
      dialogSelectOptions?: DialogSelectOption[],
      dialogSelectPlaceholder?: string,
      dialogActions: string[],
      dialogConfig?: {
        titleAlign?: string,
        contentAlign?: string
      }
    }
  ) {
    if (data.dialogConfig) {
      Object.assign(this.config, data.dialogConfig);
    }
  }

  ngOnInit(): void {
    if (this.data.dialogSelectOptions?.length > 0) {
      this.selectOptionForm = new FormGroup({
        selectedValue: new FormControl('', {nonNullable: false, validators: [Validators.required]})
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
    if (this.data.dialogSelectOptions && this.selectOptionForm.valid) {
      // this.dialogRef.close(this.selectOptionForm.controls.selectedValue.value);
      this.dialogRef.close(this.selectOptionForm.value.selectedValue)
    } else {
      this.dialogRef.close(true);
    }
  }
}
