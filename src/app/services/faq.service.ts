import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { buildConfiguration } from '../../environments/environment';
import { Faq } from 'src/app/models/faq';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  private faqs: Faq[] = [];

  constructor(
    private http: HttpClient
  ) {
  }

  getFaqs(): Faq[] {
    return this.faqs;
  }

  fetchFaqs(): Observable<Faq[]> {
    const url = `${buildConfiguration.apiUrl}/help`;
    return this.http.get<Faq[]>(url).pipe(
      map(resp => {
        this.faqs = JSON.parse(JSON.stringify(resp));
        return resp;
      })
    );
  }
}
