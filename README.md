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

const configureApi = pipe(setBaseUrl, addBearerToken('my-jwt-token'), addHeader('X-My-Header', 'foo'));
const myApiConfig = configureApi('https://my-api.com');

const myApiClient = makeApi(myApiConfig, 'form');

const bird = {species: 'Owl', name: 'Hootie'};
const result = await myApiClient('/animals', 'post', bird);
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
### makeApi(baseConfig, encoding)
This function is not curried and is used to create the API client.
```
makeApi :: (object, string) -> object
```
```javascript
  const myApiClient = makeApi(myApiConfig, 'form');

  const bird = {species: 'Owl', name: 'Hootie'};
  const result = await myApiClient('/animals', 'post', bird);
```

## Miscellaneous Functions
The library provides a collection of miscellaneous functions that are useful when writing Twilio serverless functions.

### checkEnvVariable(env, name)
This function validates the presence of, and returns, the value of an environment variable. If a variable with the `name` parameter is undefined, the function throws an Error indicating as much. In the context of a Twilio Serverless function, variables are typically obtained from the `context` object parameter of the handler function.
```
checkEnvVariable :: (object, string) -> string
```
```javascript
  const API_KEY = checkEnvVariable(context, 'API_KEY');
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
