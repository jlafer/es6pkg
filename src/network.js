const querystring = require('querystring');
const axios = require('axios');
import {curry} from 'ramda';

export function configureApi(baseURL) {
  return {baseURL, headers: {}};
}

export const addBasicCredentials = curry((username, password, config) => {
  return {...config,
    auth: {username, password}
  };
})

export const addBearerToken = curry((token, config) => {
  const headers = {...config.headers, Authorization: `Bearer ${token}`};
  return {...config, headers};
})

export const addHeader = curry((key, value, config) => {
  const headers = {...config.headers, [key]: value};
  return {...config, headers};
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
    const encodedData = (encoding === 'form')
      ? querystring.stringify(data)
      : data;
    const config = {...baseConfig,
      url, method, headers
    };
    if (data)
      config.data = encodedData;
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
