import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lifeTimeDisplay',
  standalone: false
})
export class LifeTimeDisplayPipe implements PipeTransform {

  transform(sec: string | number): string {
    if (typeof sec === 'string') {
      sec = Number(sec);
    }
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec - (hours * 3600)) / 60);
    const seconds = sec - (hours * 3600) - (minutes * 60);
    return (hours > 0 ? `${ hours }h` : '') + (minutes > 0 ? `${ minutes }m` : '') + (seconds > 0 ? `${ seconds }s` : '');
  }
}
