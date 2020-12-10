import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentTemplate } from '../models/environment-template';
import { buildConfiguration } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentTemplateService {
  private environmentTemplates: EnvironmentTemplate[] = [];

  constructor(private http: HttpClient) {
    this.fetchEnvironmentTemplates().subscribe();
  }

  getEnvironmentTemplates(): EnvironmentTemplate[] {
    return this.environmentTemplates;
  }

  private fetchEnvironmentTemplates(): Observable<EnvironmentTemplate[]> {
    const url = `${buildConfiguration.apiUrl}/environment_templates`;
    return this.http.get<EnvironmentTemplate[]>(url).pipe(
      map((resp) => {
        console.log('fetchEnvironmentTemplates got', resp);
        this.environmentTemplates = resp;
        return this.environmentTemplates;
      })
    );
  }

}
