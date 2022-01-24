import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDisplay'
})
export class DateDisplayPipe implements PipeTransform {

  transform(timestamp: number | null, user_type?: string): string {
    if (!timestamp) {
      return '-';
    }

    const dateOfTimestamp = new Date(timestamp * 1000);
    const today = new Date();

    function pad(n) {
      return n < 10 ? '0' + n : n;
    }

    let displayDate: string;
    // use human friendly notation with more detail for today and yesterday
    if (dateOfTimestamp.getUTCDate() === today.getDate()) {
      displayDate = 'Today: '
        + pad(dateOfTimestamp.getUTCHours())
        + ':' + pad(dateOfTimestamp.getUTCMinutes())
        + ':' + pad(dateOfTimestamp.getUTCSeconds());
    } else if (today.getDate() - dateOfTimestamp.getUTCDate() === 1) {
      displayDate = 'Yesterday: '
        + pad(dateOfTimestamp.getUTCHours())
        + ':' + pad(dateOfTimestamp.getUTCMinutes())
        + ':' + pad(dateOfTimestamp.getUTCSeconds());
    } else {
      displayDate = pad(dateOfTimestamp.getFullYear())
        + '-' + pad(dateOfTimestamp.getMonth() + 1)
        + '-' + pad(dateOfTimestamp.getDate());
    }
    return displayDate;
  }
}
