import store from 'store';
import axios from 'axios';
import config from '../config';

/* eslint no-underscore-dangle: ["error", { "allow": ["_items", "_meta", "_links", "_id"] }] */

window.store = store;
// CREDITS: http://www.gethugames.in/2012/04/authentication-and-authorization-for-google-apis-in-javascript-popup-window-tutorial.html

// credits: http://www.netlobo.com/url_query_string_javascript.html
function gup(url, name, win, callback) {
  // const n = name.replace(/[[]/, '[').replace(/[]]/, ']');
  const regexS = `[?&]${name}=([^&#]*)`;
  const regex = new RegExp(regexS);
  const results = regex.exec(url);

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

function dressCode(c) {
  // dress up our code w/ other parts
  let code = c;
  if (store.get('consent')) {
    code = `${code}?has_consented=true`;
  }
  if (store.get('nickname')) {
    code = `${code}&nickname=${store.get('nickname')}`;
  }
  if (store.get('email')) {
    code = `${code}&use_email=true`;
  }
  if (store.get('profile_pic')) {
    code = `${code}&use_profile_pic=true`;
  }
  if (store.get('transfer_token') && store.get('transfer_user_id')) {
    // console.log('CODE IS', code)
    code = `${code}&transfer_token=${store.get('transfer_token')}&transfer_user_id=${store.get('transfer_user_id')}`;
  }
  return code;
}

function authenticateAgainstServer(token, callback) {
  const code = dressCode(token);
  const url = config.auth_url + code;
  axios.get(url).then((resp) => {
    // console.log('the response from the medulina server is', resp)
    store.set('token', resp.data.token);
    callback(resp.data.token);
  }).catch((e) => {
    callback(null, e);
    store.clearAll();
  });
}

function getGithubCode(_url, REDIRECT, callback) {
  const win = window.open(_url, 'windowname1', 'width=800, height=600');

  const pollTimer = window.setInterval(() => {
    try {
      if (win.document.URL.indexOf(REDIRECT) !== -1) {
        window.clearInterval(pollTimer);
        const url = win.document.URL;
        gup(url, 'code', win, (code) => {
          authenticateAgainstServer(code, callback);
        });
      }
    } catch (e) {
      // empty
    }
  }, 100);
}


function getMedulinaUserInfo() {
  const token = store.get('token');
  const url = `${config.player_url}?where=token%3D%3D%22${token}%22`;
  return axios.get(url); /* .then((resp) => {
    console.log('got medulina user info:', resp)
    if (callback != null){
      callback(resp.data)
    }

  }) */
}

export default {
  login(_url, REDIRECT, callback) {
    getGithubCode(_url, REDIRECT, callback);
  },

  hasToken() {
    // console.log('TODO: check if authenticated')
    if (store.get('token') == null) {
      return false;
    }
    // TODO: THIS SUCKS
    // console.log('we found a token. is it expired?')
    getMedulinaUserInfo(store.get('token')).then((resp) => {
      if (resp.data._items.length > 0) {
        return true;
      }
      store.clearAll();
      return false;
    });
    // console.log('we found a token. is it expired?', Promise.resolve(res))
    return true;
  },

  logout() {
    // console.log('TODO: clear store so we log out')
    store.clearAll();
  },

  authenticateAgainstServer,
  getMedulinaUserInfo,
};
