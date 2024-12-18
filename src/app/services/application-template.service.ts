import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationTemplate } from '../models/application-template';
import { buildConfiguration } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplicationTemplateService {
  private applicationTemplates: ApplicationTemplate[] = [];

  constructor(private http: HttpClient) {
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
