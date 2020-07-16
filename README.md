# jlafer-twilio-runtime-util

This is a library of utility functions for use with the Twilio Flex Serverless runtime platform.

## Installation

npm install --save jlafer-twilio-runtime-util

## Network Functions
The library provides a collection of functions -- most of them curried -- for constructing API clients that support various schemes for encoding parameters, authenticating and authorizing requests, as well as specifying HTTP methods and the content-type of responses.

While the functions can be used in an imperative manner, they've been designed to support a functional programming style. So the suggested usage might look something like this:
```javascript
import {pipe} from 'ramda';
import {setBaseUrl, addBearerToken, addHeader, makeApi} from './index'

const configureApi = pipe(
  setBaseUrl,
  addBearerToken('my-jwt-token'),
  addHeader('X-My-Header', 'foo'),
  setEncoding('form')
);
const myApiConfig = configureApi('https://my-api.com');

const bird = {species: 'Owl', name: 'Hootie'};
const result = await callApi(myApiConfig, '/animals', 'post', bird);
``` 

### setBaseUrl(url)
This function is not curried and can be used to start a function composition. It returns a cofiguration object that is then passed to other helper functions, which enhance the configuration and then pass it along.
```
setBaseUrl :: string -> object
```
```javascript
  setBaseUrl('https://my-api.com');
```
### addBasicCredentials(username, password, config)
This curried function adds Basic authentication credentials to the API client configuration.
```
addBasicCredentials :: (string, string) -> object -> object
```
```javascript
  const newConfig = addBasicCredentials('my-username', 'my-password', config);
```
### addBearerToken(token, config)
This curried function adds a Bearer token to the API client configuration.
```
addBearerToken :: string -> object -> object
```
```javascript
  const newConfig = addBearerToken('my-bearer-token', config);
```
### addFlexToken(manager, config)
This curried function adds a Twilio Flex access token to the API client configuration. This is useful when calling Twilio APIs in a secure manner. For convenience, it takes as an argument a Flex `manager` object, from which it obtains the current Flex token value.
```
addFlexToken :: string -> object -> object
```
```javascript
  const newConfig = addFlexToken(manager, config);
```
### addTokenAsData(token, config)
This curried function adds a JWT access token to the API client configuration. The resulting API client will pass the token to the API endpoint in the `Token` key inside the parameters or JSON body of the request. This is useful when calling certain APIs, such as those from Twilio, in a secure manner.
```
addTokenAsData :: string -> object -> object
```
```javascript
  const newConfig = addTokenAsData('my-flex-token', config);
```
### addHeader(key, value, config)
This curried function adds an HTTP header to the API client configuration.
```
addHeader :: (string, string) -> object -> object
```
```javascript
  const newConfig = addHeader('X-My-Header', 'foo', config);
```
### setEncoding(encoding, config)
This curried function adds a `Content-type` header to the request and ensures that the data is sent with the proper encoding. By default, the data is treated as `json` and the `Content-type` header is set to `application/json`. Call this function with `encoding` set to `form` to set the content type to `application/x-www-form-urlencoded`.
```
setEncoding :: string -> object -> object
```
```javascript
  setEncoding('form', config);
```
### callApi(config, url, method, data)
This function is not curried and is used to call an API with the configuration created using the other helper functions.
```
callApi :: (object, string) -> object
```
```javascript
  const result = await callApi(config, '/animals', 'post', bird);
```
### corsResponse()
This function returns a `Twilio.Response` with all the HTTP headers needed for allowing cross-site requests, such as those from a Flex domain. Note that it sets the `Access-Control-Allow-Origin` header to `*` and you may need something more secure.
```
corsResponse :: () -> object
```
```javascript
  const response = corsResponse();
```
### sendCorsResponse(format, body)
This function returns a `Twilio.Response` containing the data from `body` using the format specified in `format`. The response has all the HTTP headers needed for allowing cross-site requests. The `format` parameter can be `json` or `text` and the `body` should contain any data to be returned to the client. Note that it sets the `Access-Control-Allow-Origin` header to `*` and you may need something more secure.
```
sendCorsResponse :: (string, any) -> object
```
```javascript
  const response = sendCorsResponse('json', myResponseData);
```
## Miscellaneous Functions
The library provides a collection of miscellaneous functions that are useful when writing Twilio serverless functions.

### trycatch({tryer, catcher, vars, params})
This HOF returns a function that executes the `tryer` function within a `try` block. If an exception is raised, it calls the `catcher` function. Prior to calling the `tryer` function, it verifies the environment variables specified by the `vars` property and the event parameters specified by the `params` property. Both the `vars` and `params` properties are arrays of strings. For both success and failure, the returned function creates a `Twilio.Response` with the required CORS headers and sends the response to the caller of the serverless function.

Both the `tryer` and `catcher` functions should return a JavaScript object, which will be used in the HTTP response. The content-type is set to `application/json`.

Here are the signatures of the two function parameters:
```
tryer :: (context, event) -> Promise(object)
```
```
catcher :: (context, event, error) -> object
```
For proper error reporting, the catcher function should return an object with (at least) the keys, `statusCode` and `message`. Errors are displayed in the serverless console and returned to the client (although right now, the Serverless platform returns a `500` HTTP status code and does not return the `response` content).
```
trycatch :: (object) -> function
```
Here is an example showing the use of `trycatch`.
```javascript
const {trycatch} = require('jlafer-twilio-runtime-util');
const {myApiCaller} = require('my-cool-lib');

async function fetchOrder(context, event) {
  const {ORDERS_API, API_KEY, API_SECRET} = context;
  const {OrderNumber} = event;
  console.log(`getOrder: order number = ${OrderNumber}`);
  return myApiCaller(ORDERS_API, API_KEY, API_SECRET, `order=${OrderNumber}`);
};

function catcher(context, event, err) {
  console.log('catcher: err:', err);
  return {message: `getOrder: caught ERROR -> ${err.message} <- for order ${event.number}`};
};

exports.handler = function(context, event, callback) {
  const handler = trycatch({
    tryer: fetchOrder,
    catcher: catcher,
    vars: ['ORDERS_API', 'API_KEY', 'API_SECRET'],
    params: ['OrderNumber']
  });
  handler(context, event, callback);
};
```
### verifyRequiredParams(names, context)
This function validates the presence of, and returns, the value of the function parameters specified by the first parameter, which is an array of parameter names. If any of the specified parameters is undefined, the function throws an Error indicating as much. In the context of a Twilio Serverless function, parameters are obtained from the `event` object parameter of the handler function.
```
verifyRequiredParams :: ([string], object) -> object
```
```javascript
  const params = verifyRequiredParams(['CallSid', 'Customer', 'ChannelName'], event);
```
### verifyRequiredVars(names, context)
This function validates the presence of, and returns, the value of the environment variables specified by the first parameter, which is an array of variable names. If any of the specified variables is undefined, the function throws an Error indicating as much. In the context of a Twilio Serverless function, variables are typically obtained from the `context` object parameter of the handler function.
```
verifyRequiredVars :: ([string], object) -> object
```
```javascript
  const vars = verifyRequiredVars(['API_KEY', 'API_SECRET', 'SYNC_SID'], context);
```
### checkEnvVariable(env, name)
This function validates the presence of, and returns, the value of an environment variable. If a variable with the `name` parameter is undefined, the function throws an Error indicating as much. In the context of a Twilio Serverless function, variables are typically obtained from the `context` object parameter of the handler function.
```
checkEnvVariable :: (object, string) -> string
```
```javascript
  const API_KEY = checkEnvVariable(context, 'API_KEY');
```
### checkParameter(event, name)
This function validates the presence of, and returns, the value of an `event` parameter. If a parameter with the `name` parameter is undefined, the function throws an Error indicating as much. In the context of a Twilio Serverless function, parameters are obtained from the `event` object parameter of the handler function.
```
checkParameter :: (object, string) -> string
```
```javascript
  const API_KEY = checkParameter(event, 'CallSid');
```
