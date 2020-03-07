// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

function getApiUrl(): string
{      
  /*
  let url =  'http://localhost:50597';
  if (window.location.origin == "http://localhost:4200") {url = "http://localhost:50597";}
  if (window.location.origin == "http://localhost:4201") {url = "http://localhost:24322";}
  if (window.location.origin == "http://10.0.0.241:4200") {url = "http://10.0.0.241:24322";}
  if (window.location.origin == "http://10.0.0.241:4201") {url = "http://10.0.0.241:24322";}
  if (window.location.origin == "http://176.42.6.113:4201") {url = "http://176.42.6.113:24322";}
  // console.log('Gelen URL = ', url);
  //url = environment.base_url;
  */
  // console.log('window.location.host= ', location.protocol + '://' + window.location.host);
  let url = location.protocol + '//' + location.hostname;
  //if (location.port != '') url = url + ':' + location.port;
  //url = url + '/awa';
  url = url + ':61952';
  return url;
}

export const environment = {
  production: false,
  base_url: '',
  api_url: getApiUrl()
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
