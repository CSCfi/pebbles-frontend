import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remainingDaysDisplay'
})
export class RemainingDaysDisplayPipe implements PipeTransform {

  transform(timestamp: number | null): string {
    if (!timestamp) {
      return '-';
    }
    const eventUtfTimestamp = new Date(timestamp * 1000).getTime();
    const todayUtfTimestamp = new Date().getTime();
    const offsetTimestamp = eventUtfTimestamp - todayUtfTimestamp;
    if (offsetTimestamp < 0) {
      return 'Expired';
    }
    const oneDayDuration = 1000 * 60 * 60 * 24;
    const days = Math.floor(offsetTimestamp / oneDayDuration);
    return (days > 1 ? `${days} days` : days === 1 ? '1 day' : '0 days')  + ' left';
  }
}
