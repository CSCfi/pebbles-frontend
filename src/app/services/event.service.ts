import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Workspace } from "../models/workspace";

export enum LoginStatusChange {
  login,
  logout
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // subject for changes in workspace related data.
  public workspaceDataUpdate$ = new BehaviorSubject<string>(null);
  public workspacesDataUpdate$ = new BehaviorSubject<Workspace[]>(null);
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
