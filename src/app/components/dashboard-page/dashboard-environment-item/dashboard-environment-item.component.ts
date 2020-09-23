import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { DOCUMENT } from '@angular/common';
// import { Router } from '@angular/router';
import { Environment } from 'src/app/models/environment';
import { InstanceStates } from 'src/app/models/instance';

// import { InstanceService } from 'src/app/services/instance.service';

@Component({
  selector: 'app-dashboard-environment-item',
  templateUrl: './dashboard-environment-item.component.html',
  styleUrls: ['./dashboard-environment-item.component.scss']
})
export class DashboardEnvironmentItemComponent implements OnInit {

  @Input() environment: Environment;
  @Output() startEnvironmentEvent = new EventEmitter<Environment>();
  @Output() openEnvironmentInBrowserEvent = new EventEmitter<Environment>();
  @Output() stopEnvironmentEvent = new EventEmitter<Environment>();

  ngOnInit(): void {
    // console.log(`--------- env ${ this.environment.id } --------`);
  }

  getThumbnail(): string {
    // Dummy
    if (this.environment.thumbnail) {
      return `assets/images/environment-item-thumb-${this.environment.thumbnail}.png`;
    } else {
      return '';
    }
  }

  getCapitals(): string {
    // Dummy
    return 'DL';
  }

  // ---- Instance
  // ----------------------------------------

  emitStartEnvironment(): void {
    this.startEnvironmentEvent.emit(this.environment);
  }

  emitOpenEnvironmentInBrowser(): void {
    this.openEnvironmentInBrowserEvent.emit(this.environment);
  }

  emitStopEnvironment(): void {
    this.stopEnvironmentEvent.emit(this.environment);
  }

  actionsVisible(environment: Environment) {
    return environment.instance && environment.instance.state !== InstanceStates.Deleted;
  }
}
