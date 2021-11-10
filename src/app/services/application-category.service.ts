import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApplicationCategory } from '../models/application-category';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buildConfiguration } from '../../environments/environment';

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
        // add static category 'All' with id '1'
        this.categories = [new ApplicationCategory('1', 0, 'All', [], 'all', true)];
        // generate IDs if missing
        this.categories = this.categories.concat(resp.map(cat => {
          if (!cat.id) {
            cat.id = Math.random().toString(36).substring(2, 8);
          }
          return cat;
        }));
        return this.categories;
      })
    );
  }

  getCategoryById(catalogId: string) {
    return this.categories?.find( cat => cat.id === catalogId );
  }
}
