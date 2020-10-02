import { trigger, state, style, transition, animate } from '@angular/animations';

export const onNavTextChange = trigger('onNavTextChange', [
  state('true',
    style({
      display : 'inline',
      opacity : '1',
    })
  ),
  state('false',
    style({
      display : 'none',
      opacity : '1',
    })
  ),
  transition('true => false', animate('0ms')),
  transition('false => true', animate('1000ms')),
]);
