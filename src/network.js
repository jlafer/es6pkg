const querystring = require('querystring');
const axios = require('axios');
import {curry, isEmpty} from 'ramda';

export function corsResponse() {
  let response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export function sendCorsResponse(format, body) {
  const response = corsResponse();
  if (format === "json") {
    response.appendHeader('Content-Type', 'application/json');
    response.setBody(body);
  }
  return response;
}

export function setBaseUrl(baseURL) {
  return {
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  };
}

export const addTokenAsData = curry((Token, config) => {
  const data = {...config.data, Token};
  return {...config, data};
});

export const addFlexToken = curry((manager, config) => {
  const Token = manager.store.getState().flex.session.ssoTokenPayload.token;
  return addTokenAsData(Toekn, config);
});

export const addBasicCredentials = curry((username, password, config) => {
  return {...config,
    auth: {username, password}
  };
});

export const addHeader = curry((key, value, config) => {
  const headers = {...config.headers, [key]: value};
  return {...config, headers};
});

export const addAuthorization = curry((authType, token, config) => {
  return addHeader('Authorization', `${authType} ${token}`, config);
});

export const addBearerToken = curry((token, config) => {
  return addAuthorization('Bearer', token, config);
});

const encodings = {
  json: 'application/json',
  form: 'application/x-www-form-urlencoded'
};

export const setEncoding = curry((encoding, config) => {
  const contentType = encodings[encoding];
  return addHeader('Content-Type', contentType, config);
});

export const makeConfig = (baseConfig, url, method, data) => {
  const config = {...baseConfig, url, method};
  const allData = {...config.data, ...data};
  if (isEmpty(allData))
    return config;
  if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    config.data = querystring.stringify(allData);
    config.headers['Content-length'] = config.data.length;
  }
  else
    config.data = allData;
  return config;
};

export const callApi = (baseConfig, url, method, data) => {
  const config = makeConfig(baseConfig, url, method, data);
  console.log('calling axios with config:', config);
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
