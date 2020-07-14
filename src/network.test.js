import {pipe} from 'ramda';
import {
  setBaseUrl, addBasicCredentials, addBearerToken, addTokenAsData, addHeader,
  makeConfig
} from './index'

const baseURL = 'https://my-api.com';
const baseConfig = {
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
};

test("setBaseUrl returns obj with baseURL", () => {
  expect(setBaseUrl(baseURL)).toEqual(baseConfig);
});
test("addBasicCredentials returns baseConfig with basic credentials", () => {
  const configureApi = pipe(setBaseUrl, addBasicCredentials('foo', 'bar'));
  expect(configureApi(baseURL)).toEqual({
    ...baseConfig,
    auth: {
      username: 'foo',
      password: 'bar'
    }
  });
});
test("addBearerToken returns baseConfig with Bearer credentials", () => {
  const configureApi = pipe(setBaseUrl, addBearerToken('foo'));
  expect(configureApi(baseURL)).toEqual({
    ...baseConfig,
    headers: {
      ...baseConfig.headers,
      Authorization: 'Bearer foo'
    }
  });
});
test("addHeader returns baseConfig with custom header", () => {
  const configureApi = pipe(setBaseUrl, addHeader('foo', 'bar'));
  expect(configureApi(baseURL)).toEqual({
    ...baseConfig,
    headers: {
      ...baseConfig.headers,
      foo: 'bar'
    }
  });
});
test("addTokenAsData returns baseConfig with token in data", () => {
  const configureApi = pipe(setBaseUrl, addTokenAsData('foo'));
  expect(configureApi(baseURL)).toEqual({
    ...baseConfig,
    data: {
      ...baseConfig.data,
      Token: 'foo'
    }
  });
});
test("makeConfig returns proper config", () => {
  const configureApi = pipe(setBaseUrl, addTokenAsData('foo'));
  const config = configureApi(baseURL);
  const data = {species: 'Owl'};
  expect(makeConfig(config, '/animals', 'post', data)).toEqual({
    ...baseConfig,
    baseURL,
    data: {
      ...baseConfig.data,
      Token: 'foo',
      species: 'Owl'
    },
    method: 'post',
    url: '/animals'
  });
});
