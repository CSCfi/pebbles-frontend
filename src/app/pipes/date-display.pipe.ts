import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDisplay'
})
export class DateDisplayPipe implements PipeTransform {

  transform(timestamp: number|null, user_type?: string): string {
    if (!timestamp) {
      return '-';
    }

    const dateOfTimestamp = new Date(timestamp * 1000);
    const today = new Date();
    function pad(n) {return n < 10 ? '0' + n : n; }
    let displayDate = pad(dateOfTimestamp.getFullYear())
                  + '-' + pad(dateOfTimestamp.getMonth() + 1)
                  + '-' + dateOfTimestamp.getDate();

    if ( today.getTime() - dateOfTimestamp.getTime() < 172800000) {
      if ( dateOfTimestamp.getUTCDate() === today.getDate()) {
        displayDate = 'Today: '
          + pad(dateOfTimestamp.getUTCHours())
          + ':' + pad(dateOfTimestamp.getUTCMinutes())
          + ':' + pad(dateOfTimestamp.getUTCSeconds());
      } else if ( today.getDate() - dateOfTimestamp.getUTCDate() === 1) {
        displayDate = 'Yesterday: '
          + pad(dateOfTimestamp.getUTCHours())
          + ':' + pad(dateOfTimestamp.getUTCMinutes())
          + ':' + pad(dateOfTimestamp.getUTCSeconds());
      }
    }

    return displayDate;
  }

}
