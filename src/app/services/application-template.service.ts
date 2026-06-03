import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buildConfiguration } from '../../environments/environment';
import { ApplicationTemplate } from '../models/application-template';

@Injectable({
  providedIn: 'root'
})
export class ApplicationTemplateService {
  private http = inject(HttpClient);

  private applicationTemplates: ApplicationTemplate[] = [];

  constructor() {
    this.fetchApplicationTemplates().subscribe();
  }

  getApplicationTemplates(): ApplicationTemplate[] {
    return this.applicationTemplates;
  }

  fetchApplicationTemplates(): Observable<ApplicationTemplate[]> {
    const url = `${buildConfiguration.apiUrl}/application_templates`;
    return this.http.get<ApplicationTemplate[]>(url).pipe(
      map((resp) => {
        this.applicationTemplates = resp;
        return this.applicationTemplates;
      })
    );
  }

}
