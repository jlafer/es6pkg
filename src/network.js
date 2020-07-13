const querystring = require('querystring');
const axios = require('axios');
import {curry, isEmpty} from 'ramda';

export function setBaseUrl(baseURL) {
  return {baseURL};
}

export const addTokenAsData = curry((Token, config) => {
  const data = {...config.data, Token};
  return {...config, data};
})

export const addFlexToken = curry((manager, config) => {
  const Token = manager.store.getState().flex.session.ssoTokenPayload.token;
  return addTokenAsData(Toekn, config);
})

export const addBasicCredentials = curry((username, password, config) => {
  return {...config,
    auth: {username, password}
  };
})

export const addHeader = curry((key, value, config) => {
  const headers = {...config.headers, [key]: value};
  return {...config, headers};
})

export const addAuthorization = curry((authType, token, config) => {
  return addHeader('Authorization', `${authType} ${token}`, config);
})

export const addBearerToken = curry((token, config) => {
  return addAuthorization('Bearer', token, config);
})

const encodings = {
  json: 'application/json',
  form: 'application/x-www-form-urlencoded'
};

export const makeApi = (baseConfig, encoding) => {
  const contentType = encodings[encoding];

  return (url, method, data) => {
    const headers = {...baseConfig.headers,
      'Content-Type': contentType
    };
    const config = {...baseConfig,
      url, method, headers
    };
    const allData = {...config.data, ...data};
    if (! isEmpty(allData)) {
      config.data = (encoding === 'form')
        ? querystring.stringify(allData)
        : allData;
    }
    //console.log('calling axios with config:', config);

    return axios(config)
    .then(response => response.data)
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.status);
        console.log(error.response.data);
        console.log(error.response.headers);
        throw new Error(error.response);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        throw new Error({error: 'no response received', request: error.request});
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
        throw new Error({error: error.message});
      }
    })
  }
}
