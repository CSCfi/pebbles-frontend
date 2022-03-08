// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MockInterceptor } from '../app/interceptors/mock.interceptor';

export const buildConfiguration = {
  production: false,
  // api url does not matter, calls are intercepted by mock interceptor
  apiUrl: 'http://mock-service/api/v1'
};

export const ENVIRONMENT_SPECIFIC_PROVIDERS = [
  {provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true},
];

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
