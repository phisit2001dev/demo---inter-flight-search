// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  useHash: false,
  firstPage: '/home',
  serverUrl: 'http://127.0.0.1:8080/api/v1/',
  contextPath: 'http://127.0.0.1:4200/',
  manualUrl: 'https://ioc.png-iapi.net/ioc-manual/',
  historyUrl: 'https://ioc.png-iapi.net/ioc-history/',
  crossCheckKey: 'Authorization',
  keyProfile: 'profile',
  dateFormat: 'dd/MM/yyyy',
  columnMenu: 3,
  autocomplete: {
    limit: 10,
    fillAtLeast: 3,
    debounceTime: 500, // Milliseconds
  },
  // oauth 2 config
  authen: {
    authorizeUrl: 'http://127.0.0.1:8081/oauth2/authorize',
    tokenUrl: 'http://127.0.0.1:8081/oauth2/token',
    redirectUri: 'http://127.0.0.1:4200?p=home',
    clientId: 'client-43763dca287',
    secret: 'f5f13e88',
  },
  intervalAlert: 30000
};
