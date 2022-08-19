import { Injectable } from '@angular/core';
import { Utilities } from '../utilities';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor() { }

  filterByText(objects: any[], searchTerm: string, targetFields: string[]): any[] {
    searchTerm = Utilities.cleanText(searchTerm);
    if (searchTerm === '') {
      return objects;
    } else {
      objects = objects.filter(obj => {
        let isMatch = false;

        targetFields.forEach( field => {
          if(field === 'labels') {
            if (obj.labels.indexOf(searchTerm) > -1) {
              isMatch = true;
            }
          } else {
            const content = obj[field];
            if (Utilities.cleanText(content).indexOf(searchTerm) > -1) {
              // ---- Deactivate highlighting
              // obj[field] = content.replace(new RegExp(searchTerm, 'gi'), (match) => `<mark>${match}</mark>`);
              isMatch = true;
            }
          }
        });

        if (isMatch) {
          return obj;
        }
      });
    }
    return objects;
  }

}
