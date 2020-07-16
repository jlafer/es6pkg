import {curry} from 'ramda';
import {corsResponse} from './index';

const checkKeyInObj = curry((msg, obj, key) => {
  const value = obj[key];
  if (! value) {
    const message = `${key} ${msg}`;
    throw {statusCode: 400, message};
  }
  return value;
});

export const checkEnvVariable = checkKeyInObj('environment variable not set');
export const checkParameter = checkKeyInObj('event parameter not passed');

const verifyRequiredKeysInObj = curry((checkFn, keys, obj) => {
  const res = {};
  keys.forEach(key => {
    res[key] = checkFn(obj, key);
  });
  return res;
});

export const verifyRequiredVars = verifyRequiredKeysInObj(checkEnvVariable);
export const verifyRequiredParams = verifyRequiredKeysInObj(checkParameter);

/*
  NOTE: the returned function does not use async/await do to conflict between
    babel/rollup and async functions when nested
  TODO check for configuration changes that will address this 
*/
export function trycatch(opts) {
  const {tryer, catcher, vars, params} = opts;

  return function(context, event, callback) {
    const response = corsResponse();
    response.appendHeader('Content-Type', 'application/json');
    try {
      verifyRequiredVars(vars, context);
      verifyRequiredParams(params, event);
      tryer(context, event)
      .then((result) => {
        response.setStatusCode(200);
        response.setBody(result);
        callback(null, response);
      })
    }
    catch (err) {
      const result = catcher(context, event, err);
      console.log('trycatch:', result);
      const statusCode = result.statusCode || err.statusCode || 200;
      response.setStatusCode(statusCode);
      response.setBody(result);
      callback(err, response);
    }
  };
};
