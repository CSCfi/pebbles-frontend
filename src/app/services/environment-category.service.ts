import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentCategory } from '../models/environment-category';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentCategoryService {

  private BASE_URL = 'http://localhost/api/v1';
  private categories: EnvironmentCategory[] = [];

  constructor(private http: HttpClient) {
    this.fetchCategories().subscribe();
  }

  getCategories(): EnvironmentCategory[] {
    return this.categories;
  }

  fetchCategories(): Observable<EnvironmentCategory[]> {
    const url = `${this.BASE_URL}/environment_categories`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.get<EnvironmentCategory[]>(url, httpOptions).pipe(
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
