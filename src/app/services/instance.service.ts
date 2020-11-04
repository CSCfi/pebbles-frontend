import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(
    private http: HttpClient,
    private desktopNotificationService: DesktopNotificationService
    ) {
    this.fetchInstances();
    this.setPollingInterval(30000);
  }

  ngOnDestroy(): void {
    if (this.interval !== 0) {
      clearInterval(this.interval);
    }
  }

  getInstances(): Instance[] {
    return this.instances;
  }

  fetchInstances(): Observable<Instance[]> {
    const url = `${buildConfiguration.apiUrl}/instances`;

    return this.http.get<Instance[]>(url).pipe(
      map(resp => {
        this.instances = resp;
        console.log('fetchInstances got ' + resp);

        let nonRunning = false;
        for (const inst of this.instances) {
          if (inst.state !== InstanceStates.Running) {
            nonRunning = true;
            break;
          }
        }
        if (nonRunning) {
          this.setPollingInterval(4000);
        } else if (!nonRunning) {
          this.setPollingInterval(30000);
        }
        this.desktopNotificationService.notifyInstanceLifetime(this.instances);
        return this.instances;
      })
    );
  }

  createInstance(environmentId: string): Observable<Instance> {
    const url = `${buildConfiguration.apiUrl}/instances`;

    return this.http.post<Instance>(url, {environment: environmentId}).pipe(
      tap(resp => {
        // push the new instance directly to state and trigger a full refresh later
        const newInstance = new Instance(resp.id, resp.name, resp.environment_id, resp.state, '');
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
    if (this.interval){
      clearInterval(this.interval);
    }
  }

  private setPollingInterval(intervalMs: number) {
    console.log('setting polling rate to ' + intervalMs);
    if (this.interval){
      clearInterval(this.interval);
    }
    this.interval = window.setInterval(() => {
      this.fetchInstances().subscribe();
    }, intervalMs);
  }
}
