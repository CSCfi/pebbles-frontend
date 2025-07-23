import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum LoginStatusChange {
  login,
  logout
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // subject for changes in workspace data. event content is either workspace id or 'all'
  public workspaceDataUpdate$: Subject<string> = new Subject();
  // subject for changes in workspace data. event content is workspace id
  public workspaceMemberDataUpdate$: Subject<string> = new Subject();
  // subject for changes in application data. event content is 'all'
  public applicationDataUpdate$: Subject<string> = new Subject();
  // subject for changes in custom image data. event content is 'all'
  public customImageDataUpdate$: Subject<string> = new Subject();
  // subject for changes in user-list data. event content is 'all'
  public userDataUpdate$: Subject<string> = new Subject();
  // subject for tapping to login/logout events
  public loginStatus$: Subject<LoginStatusChange> = new Subject();
  // subject for shake events
  public uiEffect$: Subject<boolean> = new Subject();

  constructor() {
  }
}
