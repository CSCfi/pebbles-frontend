import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from 'src/app/services/environment.service';
import { Environment } from '../../../models/environment';

@Component({
  selector: 'app-dashboard-environment',
  templateUrl: './dashboard-environment.component.html',
  styleUrls: ['./dashboard-environment.component.scss']
})
export class DashboardEnvironmentComponent implements OnInit {

  constructor(private environmentService: EnvironmentService) {
  }

  ngOnInit(): void {
    this.environmentService.fetchEnvironments().subscribe();
  }

  getEnvironments(): Environment[] {
    return this.environmentService.getEnvironments();
  }
}
