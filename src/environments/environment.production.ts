// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: true,
  useHash: true,
  firstPage: '/home',
  serverUrl: 'https://csc.png-iapi.net/csc-api-dev/api/v1/',
  contextPath: 'https://csc.png-iapi.net/csc-dev/#/',
  manualUrl: 'https://csc.png-iapi.net/csc-manual/',
  historyUrl: 'https://csc.png-iapi.net/csc-history/',
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
    authorizeUrl: 'https://csc.png-iapi.net/csc-auth-dev/oauth2/authorize',
    tokenUrl: 'https://csc.png-iapi.net/csc-auth-dev/oauth2/token',
    redirectUri: 'https://csc.png-iapi.net/csc-dev?p=home',
    clientId: 'client-csc-dev',
    secret: '9664c4d7',
  }

};

