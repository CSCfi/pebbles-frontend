import { Pipe, PipeTransform } from '@angular/core';
import { Utilities } from '../utilities';

@Pipe({
  name: 'remainingDaysDisplay'
})
export class RemainingDaysDisplayPipe implements PipeTransform {

  transform(timestamp: number | null): string {
    if (!timestamp) {
      return '-';
    }
    const eventUtfTimestamp = new Date(timestamp * 1000).getTime();

    const offsetTimestamp = Utilities.getTimeGap(eventUtfTimestamp, 'second')
    if (offsetTimestamp < 0) {
      return 'Expired';
    }
    const days = Utilities.getTimeGap(eventUtfTimestamp, 'day')
    return (days > 1 ? `${days} days` : days === 1 ? '1 day' : '0 days')  + ' left';
  }
}
