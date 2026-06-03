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

    // ---- Match highlighting is DISABLED for now. Injecting <mark> via a whole-string replace
    // ---- corrupts HTML already in the value (e.g. main-help wraps FAQ text in <span>, so searching a
    // ---- letter that occurs in a tag name — a, p, s, n — breaks the markup). To re-enable, uncomment
    // ---- the pattern + the replace below AND make highlighting touch text nodes only, not tags.
    // const highlightPattern = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

    // ---- Create a deep copy without destroying the original object.
    const filteredResults = JSON.parse(JSON.stringify(objects)).filter(obj => {
      let isMatch = false;

      targetFieldNames.forEach(name => {
        const content = obj[name];
        if (typeof content === 'string') {
          if (Utilities.cleanText(content).indexOf(searchTerm) > -1) {
            isMatch = true;
            // ---- Add highlight tags (disabled — see note above)
            // obj[name] = content.replace(highlightPattern, (match) => `<mark>${match}</mark>`);
          }
        } else if (Array.isArray(content)) {
          // ---- Match array fields (e.g. labels) element-wise; no highlight (rendered as chips, not innerHTML)
          if (content.some(item => typeof item === 'string' && Utilities.cleanText(item).indexOf(searchTerm) > -1)) {
            isMatch = true;
          }
        }
      });

      return isMatch;
    });

    return filteredResults;
  }
}
