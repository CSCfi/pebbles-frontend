import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buildConfiguration } from '../../environments/environment';
import { ApplicationCategory } from '../models/application-category';

@Injectable({
  providedIn: 'root'
})
export class ApplicationCategoryService {

  private categories: ApplicationCategory[] = [];

  constructor(
    private http: HttpClient
  ) {
  }

  getCategories(): ApplicationCategory[] {
    return this.categories;
  }

  fetchCategories(): Observable<ApplicationCategory[]> {
    const url = `${buildConfiguration.apiUrl}/application_categories`;
    return this.http.get<ApplicationCategory[]>(url).pipe(
      map((resp) => {
        // add static category 'All'
        this.categories = [new ApplicationCategory('All', []), ...resp];
        return this.categories;
      })
    );
  }

  get isInitialized(): boolean {
    return this.categories.length > 0;
  }
}
