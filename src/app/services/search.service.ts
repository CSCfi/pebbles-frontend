import { Injectable } from '@angular/core';
import { Utilities } from '../utilities';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() {
  }

  filterByText(objects: any[], searchTerm: string, targetFieldNames: string[]): any[] {
    searchTerm = Utilities.cleanText(searchTerm);
    if (searchTerm === '') return objects;

    // ---- Create a deep copy without destroying the original object.
    const filteredResults = JSON.parse(JSON.stringify(objects)).filter(obj => {
      let isMatch = false;

      targetFieldNames.forEach(name => {
        const content = obj[name];
        if (content && typeof content === 'string' && Utilities.cleanText(content).indexOf(searchTerm) > -1) {
          isMatch = true;
          // ---- Add highlight tags
          obj[name] = content.replace(new RegExp(searchTerm, 'gi'), (match) => `<mark>${match}</mark>`);
        }
      });

      return isMatch;
    });

    return filteredResults;
  }
}
