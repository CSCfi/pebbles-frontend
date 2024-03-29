import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {AccountService} from '../../../services/account.service';

@Component({
  selector: 'app-main-workspace-quota-form',
  templateUrl: './main-workspace-quota-form.component.html',
  styleUrls: ['./main-workspace-quota-form.component.scss']
})
export class MainWorkspaceQuotaFormComponent implements OnInit {

  public workspaceQuotaForm: UntypedFormGroup;
  get isMinusActive(): boolean {
    return this.workspaceQuotaForm.controls.newValue.value !== 0;
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<MainWorkspaceQuotaFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      userId: string,
      email: string,
      workspaceCount: number,
      workspaceQuota: number
    },
    private accountService: AccountService
  ) {}

  errorHandling = (control: string, error: string) => {
    return this.workspaceQuotaForm.controls[control].hasError(error);
  }

  ngOnInit(): void {
    this.initReactiveForm();
    this.workspaceQuotaForm.controls.newValue.setValue(this.data.workspaceQuota);
  }

  initReactiveForm(): void {
    this.workspaceQuotaForm = this.formBuilder.group({
      newValue: ['', [Validators.required, Validators.min(0)]],
    });
  }

  changeQuotas(count: number) {
    this.workspaceQuotaForm.controls.newValue.setValue(this.workspaceQuotaForm.controls.newValue.value + count);
  }

  updateQuotas() {
    this.accountService.updateWorkspaceQuotas(
      this.data.userId, this.workspaceQuotaForm.controls.newValue.value).subscribe(user => {
        this.data.workspaceQuota = user.workspace_quota;
    });
  }
}
