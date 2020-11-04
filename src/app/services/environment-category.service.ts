import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentCategory } from '../models/environment-category';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentCategoryService {

  private categories: EnvironmentCategory[] = [];

  constructor(private http: HttpClient) {
    this.fetchCategories().subscribe();
  }

  getCategories(): EnvironmentCategory[] {
    return this.categories;
  }

  fetchCategories(): Observable<EnvironmentCategory[]> {
    const url = `${buildConfiguration.apiUrl}/environment_categories`;
    return this.http.get<EnvironmentCategory[]>(url).pipe(
      map((resp) => {
        // ---- Ask to have id field in DB
        this.categories = resp.map( cat => {
          if (!cat.id) {
            cat.id = Math.random().toString(36).substring(2, 8);
          }
          return cat;
        });
        this.categories = [new EnvironmentCategory('1', 0, 'All', [], 'all', true)];
        this.categories = this.categories.concat(resp);
        return this.categories;
      })
    );
  }

  getCategoryById(catalogId: string) {
    return this.categories.find( cat => cat.id === catalogId );
  }
}
