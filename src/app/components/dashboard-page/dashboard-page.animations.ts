import { trigger, state, style, transition, animate } from '@angular/animations';

export const onSideNavChange = trigger('onSideNavChange', [
  state('true',
    style({
      'min-width': '250px'
    })
  ),
  state('false',
    style({
      'min-width': '60px'
    })
  ),
  transition('true => false', animate('10ms ease-in')),
  transition('false => true', animate('10ms ease-in')),
]);

export const onMainContentChange = trigger('onMainContentChange', [
  state('true',
    style({
      'margin-left': '250px'
    })
  ),
  state('false',
    style({
      'margin-left': '80px'
    })
  ),
  transition('true => false', animate('10ms ease-in')),
  transition('false => true', animate('10ms ease-in')),
]);
