// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import * as firebase from 'firebase';

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDb6y4Fd4Itr1nxHBvxrVLX57so8yZUO0Y',
    authDomain: 'booking-606db.firebaseapp.com',
    databaseURL: 'https://booking-606db.firebaseio.com',
    projectId: 'booking-606db',
    storageBucket: '',
    messagingSenderId: '180280011076',
    appId: '1:180280011076:web:8a8c14422802011e'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
