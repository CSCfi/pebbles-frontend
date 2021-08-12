import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  public workspaceUpdate$: Subject<string> = new Subject();
  public environmentUpdate$: Subject<string> = new Subject();

  constructor() {
  }
}
