/* eslint-disable @typescript-eslint/naming-convention */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
//
export const environment = {
  production: false,
  url: 'https://luckystd.com/',
  // url: "http://localhost/web/",
  // url: 'http://192.168.1.10/web/',
  socket: {
    // url: 'http://45.76.184.82',
    url: 'http://localhost:5001',
    options: {
      path: '/socket_chat',
    },
  },
  socket_crash: {
    url: 'http://localhost:5002',
    // url: 'http://45.76.184.82',
    options: {
      path: '/socket_crash',
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
