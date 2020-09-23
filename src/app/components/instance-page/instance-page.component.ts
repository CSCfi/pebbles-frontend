import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Instance, InstanceStates } from 'src/app/models/instance';
import { InstanceService } from 'src/app/services/instance.service';

@Component({
  selector: 'app-instance-page',
  templateUrl: './instance-page.component.html',
  styleUrls: ['./instance-page.component.scss']
})

export class InstancePageComponent implements OnInit, OnDestroy {

  instances: Instance[];
  targetInstance: Instance;
  redirectUrl: string;
  iframeSrc: SafeResourceUrl;
  instanceId: string;
  private interval;
  instanceStates = InstanceStates;

  constructor(
    private route: ActivatedRoute,
    private instanceService: InstanceService,
    public sanitizer: DomSanitizer
  ) {
    this.instanceId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    // setup a timer to check the instance state/progress
    this.interval = setInterval(() => {
      this.checkInstanceStatus();
    }, 1000);
    // we are running in a new window, so we need to trigger instanceService
    this.instanceService.fetchInstances().toPromise().then(() => console.log('instances fetched'));
  }

  ngOnDestroy(): void {
    // clean the interval
    if (this.interval !== 0) {
      clearInterval(this.interval);
    }
  }

  checkInstanceStatus(): void {
    // instance service refreshes the instances asynchronously, we can simply get the fresh ones
    this.targetInstance = this.instanceService.getInstances().find((instance) => {
      return (instance.id === this.instanceId);
    });
    if (!this.targetInstance) {
      console.log('instance ' + this.instanceId + ' not found');
      return;
    }
    console.log(this.targetInstance.state);

    // if our instance state is 'running', proceed to redirection
    if (this.targetInstance.state === InstanceStates.Running ) {
      clearInterval(this.interval);
      this.interval = 0;
      // ---- Chose way between (redirect|iFrame) to display an instance
      this.redirectToInstance(this.targetInstance);
      // this.frameInstance(this.targetInstance);
    }
  }

  redirectToInstance(instance: Instance): void {
    this.redirectUrl = instance.instance_data.endpoints[0].access;
    console.log('redirecting to instance content at ' + this.redirectUrl);
    window.open(this.redirectUrl, '_self');
  }

  frameInstance(instance: Instance): void {
    // ---- To use iframe in Angular, it asks DomSanitizer helping preventing Cross Site Scripting Security bugs
    this.iframeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(instance.instance_data.endpoints[0].access);
    console.log('Overwrites iframe.src by' + this.iframeSrc);
  }
}
