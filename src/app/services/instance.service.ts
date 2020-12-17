import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DesktopNotificationService } from 'src/app/services/desktop-notification.service';

import { Instance, InstanceStates } from 'src/app/models/instance';
import { buildConfiguration } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class InstanceService implements OnDestroy {


  private instances: Instance[] = [];
  private interval = 0;
  private intervalValue = -1;

  constructor(
    private http: HttpClient,
    private desktopNotificationService: DesktopNotificationService
  ) {
    this.fetchInstances();
    this.setPollingInterval(60 * 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  getInstances(): Instance[] {
    return this.instances;
  }

  getInstance(id: string) {
    return this.instances.find(x => x.id === id);
  }

  getInstanceByEnvironmentId(envId: string) {
    return this.instances.find(i => i.environment_id === envId);
  }

  fetchInstance(id: string): Observable<Instance> {
    const url = `${buildConfiguration.apiUrl}/instances/${id}`;

    return this.http.get<Instance>(url).pipe(
      map(resp => {
        console.log('fetchInstance() got ', resp);
        return resp;
      })
    );
  }

  fetchInstances(): Observable<Instance[]> {
    const url = `${buildConfiguration.apiUrl}/instances`;

    return this.http.get<Instance[]>(url).pipe(
      map(resp => {
        this.instances = resp;
        console.log('fetchInstances got', resp);

        let nonRunning = false;
        for (const inst of this.instances) {
          if (inst.state !== InstanceStates.Running) {
            nonRunning = true;
            break;
          }
        }
        if (nonRunning) {
          this.setPollingInterval(4 * 1000);
        } else if (!nonRunning) {
          this.setPollingInterval(60 * 1000);
        }
        this.desktopNotificationService.notifyInstanceLifetime(this.instances);
        return this.instances;
      })
    );
  }

  createInstance(environmentId: string): Observable<Instance> {
    const url = `${buildConfiguration.apiUrl}/instances`;

    return this.http.post<Instance>(url, {environment: environmentId}).pipe(
      tap(newInstance => {
        // push the new instance directly to state and trigger a full refresh later
        console.log('created instance ' + newInstance.name);
        this.instances.push(newInstance);
        this.fetchInstances().subscribe();
      }));
  }

  deleteInstance(instanceId: string): Observable<Instance> {
    const url = `${buildConfiguration.apiUrl}/instances/${instanceId}`;
    return this.http.delete<Instance>(url).pipe(tap(resp => {
      console.log(resp);
      this.fetchInstances().subscribe();
    }));
  }

  clearPollingInterval() {
    // console.log('---- stop polling');
    if (this.interval) {
      clearInterval(this.interval);
      this.intervalValue = -1;
    }
  }

  private setPollingInterval(intervalMs: number) {
    // check if the value is already set
    if (this.intervalValue === intervalMs) {
      return;
    }
    console.log('setting polling rate to ' + intervalMs);

    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = window.setInterval(() => {
      this.fetchInstances().subscribe();
    }, intervalMs);
    this.intervalValue = intervalMs;
  }

}
