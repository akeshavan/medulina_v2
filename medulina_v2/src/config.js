// The auth_url, redirect, and client_id change depending on window.location.host
// also all the url's change if its

const host = window.location.host;
let apiHome = '';
let REDIRECT = '';
let clientId = '';
let authUrl = '';

switch (host) {
  case 'test.medulina.com': {
    apiHome = 'https://testapi.medulina.com';
    REDIRECT = 'test.medulina.com';
    clientId = '7a33c7349ef2968b7480';
    authUrl = `${apiHome}/api/authenticate/test/github/`;
    break;
  }
  case 'medulina.com': {
    apiHome = 'https://api.medulina.com';
    REDIRECT = 'medulina.com';
    clientId = 'd0dee0089411bc5134ae';
    authUrl = `${apiHome}/api/authenticate/dg/github/`;
    break;
  }
  default: {
    apiHome = 'https://testapi.medulina.com';
    REDIRECT = 'localhost:8080';
    clientId = 'f586bf4498f82125fc48';
    authUrl = `${apiHome}/api/authenticate/dg/githublocal/`;
  }
}

export default {
  auth_url: authUrl,
  player_url: `${apiHome}/api/v1/user/`,
  score_url: `${apiHome}/api/v1/score/`,
  client_id: clientId,
  image_url: `${apiHome}/api/v1/image/`,
  edit_url: `${apiHome}/api/v1/mask`,
  edit_token: 'NnrP65CXaSnZ0aLPZ8Ox64d0pDlSKS0R8wpymwLr',
  REDIRECT, // '50a4075c.ngrok.io', // 'localhost:8080',
  // note: keep the /#/ in the github redirect, but not in this redirect.
  // also no http: or https:// in the redirect
  anonymous_url: `${apiHome}/api/anonymous`, // https://api.medulina.com/api/anonymous',
  consent_url: `${apiHome}/api/consent`,
  apiHome,
};
