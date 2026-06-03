import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Faq } from 'src/app/models/faq';
import { buildConfiguration } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private http = inject(HttpClient);


  private faqs: Faq[] = [];

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
