import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-workspace-wizard',
  templateUrl: './dashboard-workspace-wizard.component.html',
  styleUrls: ['./dashboard-workspace-wizard.component.scss']
})
export class DashboardWorkspaceWizardComponent implements OnInit {

  public content = {
    path: 'workspace/wizard',
    title: 'Workspace Wizard'
  };

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
      this.firstFormGroup = this.formBuilder.group({
        firstCtrl: ['', Validators.required]
      });
      this.secondFormGroup = this.formBuilder.group({
        secondCtrl: ['', Validators.required]
      });
  }
}
