// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
<<<<<<< HEAD
  production: false,
  baseUrl: 'http://localhost:4500',
  baseHref: '/',
  websocket: 'ws://localhost:8081'
=======
    production: false,
    baseUrl: 'http://localhost:4500',
    baseHref: '/',
    websocket: 'wss://space-sim-server.onrender.com', // ← Changement ici

    // websocket: 'ws://localhost:8081',
>>>>>>> 4ed3e92086a86513a081020eb7f6a2f3b4dca0a8
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
