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
  // subject for changes in environment data. event content is 'all'
  public environmentDataUpdate$: Subject<string> = new Subject();

  // subject for tapping to login/logout events
  public loginStatus$: Subject<LoginStatusChange> = new Subject();

  constructor() {
  }
}
