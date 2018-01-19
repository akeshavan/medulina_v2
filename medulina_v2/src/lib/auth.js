import store from 'store';
import axios from 'axios';
import chai from 'chai';
import config from '../config';

/* eslint no-underscore-dangle: ["error", { "allow": ["_items", "_meta", "_links", "_id"] }] */
/* eslint no-prototype-builtins: 1 */


window.store = store;
// CREDITS: http://www.gethugames.in/2012/04/authentication-and-authorization-for-google-apis-in-javascript-popup-window-tutorial.html

// credits: http://www.netlobo.com/url_query_string_javascript.html
function gup(url, name, win, callback) {
  // const n = name.replace(/[[]/, '[').replace(/[]]/, ']');
  const regexS = `[?&]${name}=([^&#]*)`;
  const regex = new RegExp(regexS);
  const results = regex.exec(url);
  // console.log('gup', results);
  if (results != null) {
    win.close();
    callback(results[1]);
  }
  return '';
}

/* function authenticateAgainstServer(code, callback) {
  const url = joinPath(config.authUrl, code);
  axios.get(url).then((resp) => {
    store.set('token', resp.data.token);
    callback(resp.data.token, null);
  }).catch((e) => {
    callback(null, e);
    store.clearAll();
  });
} */


// Thanks: https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
function serialize(obj) {
  const str = [];
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i += 1) {
    const p = keys[i];
    if (obj.hasOwnProperty(p)) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
    }
  }
  return str.join('&');
}

function dressCode(c, params) {
  // dress up our code w/ other parts
  let code = c;
  // console.log('code params', params);
  const p = {};

  if (params.consent) {
    // code = `${code}?has_consented=true`;
    p.has_consented = true;
  }
  if (params.nickname) {
    // code = `${code}&nickname=${params.nickname}`;
    p.nickname = params.nickname;
  }
  if (params.send_emails) {
    // code = `${code}&use_email=true`;
    p.use_email = true;
  }
  if (params.use_profile_pic) {
    // code = `${code}&use_profile_pic=true`;
    p.use_profile_pic = true;
  }
  if (params.transfer_token && params.transfer_user_id) {
    // console.log('CODE IS', code)
    // code = `${code}&transfer_token=${params.transfer_token}
    // &transfer_user_id=${params.transfer_user_id}`;
    p.transfer_token = params.transfer_token;
    p.transfer_user_id = params.transfer_user_id;
  }
  code = `${code}?${serialize(p)}`;
  // console.log('the code is', code);
  return code;
}

function authenticateAgainstServer(token, params, callback) {
  const code = dressCode(token, params);
  const url = config.auth_url + code;
  console.log('authenticating against', url);
  axios.get(url).then((resp) => {
    // console.log('the response from the medulina server is', resp);
    chai.assert.isDefined(resp.data.token);
    chai.assert.isNotNull(resp.data.token);
    // console.log('token is', resp.data.token);
    store.set('token', resp.data.token);
    store.set('user_id', resp.data.user_id);
    console.log('AUTH RESP', resp.data);
    callback(resp.data.token);
  }).catch((e) => {
    // console.log('authenticateErr', e);
    callback(null, e);
    store.clearAll();
  });
}

function getGithubCode(_url, REDIRECT, params, callback) {
  const win = window.open(_url, 'windowname1', 'width=800, height=600');

  const pollTimer = window.setInterval(() => {
    try {
      if (win.document.URL.indexOf(REDIRECT) !== -1) {
        window.clearInterval(pollTimer);
        const url = win.document.URL;
        // console.log('url', url);
        gup(url, 'code', win, (code) => {
          authenticateAgainstServer(code, params, callback);
        });
      }
    } catch (e) {
      // empty
    }
  }, 100);
}


export default {
  login(params, callback) {
    const url = `https://github.com/login/oauth/authorize?client_id=${config.client_id}`;
    getGithubCode(url, config.REDIRECT, params, callback);
  },

  getToken() {
    return { token: store.get('token'), user_id: store.get('user_id') };
  },

  logout() {
    // console.log('TODO: clear store so we log out')
    store.clearAll();
  },
};
