import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateDisplay'
})
export class DateDisplayPipe implements PipeTransform {

  transform(timestamp: number | null): string {
    if (!timestamp) {
      return '-';
    }

    const eventDate = new Date(timestamp * 1000);
    const todayDate = new Date();
    const yesterdayDate = new Date(new Date().setDate(todayDate.getDate() - 1));

    function pad(n) {
      return n < 10 ? '0' + n : n;
    }

    // use human friendly notation with more detail for today and yesterday
    if (eventDate.toLocaleDateString() === todayDate.toLocaleDateString()) {
      return 'Today '
        + pad(eventDate.getHours())
        + ':' + pad(eventDate.getMinutes());
    } else if (eventDate.toLocaleDateString() === yesterdayDate.toLocaleDateString()) {
      return 'Yesterday '
        + pad(eventDate.getHours())
        + ':' + pad(eventDate.getMinutes());
    } else {
      // ---- to display date like ISO But in local time
      return eventDate.getFullYear()
        + '-' + pad(eventDate.getMonth() + 1)
        + '-' + pad(eventDate.getDate());
    }
  }
}
