import {pipe} from 'ramda';
import {
  setBaseUrl, addBasicCredentials, addBearerToken, addTokenAsData, addHeader
} from './index'

const baseURL = 'https://my-api.com';
const baseConfig = {baseURL};

test("setBaseUrl returns obj with baseURL", () => {
  expect(setBaseUrl(baseURL)).toEqual(baseConfig);
});
test("addBasicCredentials returns baseConfig with basic credentials", () => {
  const configureApi = pipe(setBaseUrl, addBasicCredentials('foo', 'bar'));
  expect(configureApi(baseURL)).toEqual({...baseConfig,
    auth: {
      username: 'foo',
      password: 'bar'
    }
  });
});
test("addBearerToken returns baseConfig with Bearer credentials", () => {
  const configureApi = pipe(setBaseUrl, addBearerToken('foo'));
  expect(configureApi(baseURL)).toEqual({...baseConfig,
    headers: {...baseConfig.headers,
      Authorization: 'Bearer foo'
    }
  });
});
test("addHeader returns baseConfig with custom header", () => {
  const configureApi = pipe(setBaseUrl, addHeader('foo', 'bar'));
  expect(configureApi(baseURL)).toEqual({...baseConfig,
    headers: {...baseConfig.headers,
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
