export const environment = {
  production: false,
  base_url: '/',
  api_url: getApiUrl()
  //base_url: 'http://localhost:50597'
  //  base_url : 'http://176.42.6.113:24322'
  // base_url : 'http://10.0.0.241:24322'
};

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
  url = url + ':61952'; //düzeltilecek.
  //console.log('API URL = ', url);
  return url;
}
