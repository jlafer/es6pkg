import {pipe} from 'ramda';
import {
  configureApi, addBasicCredentials, addBearerToken, addHeader
} from './index'

const baseURL = 'https://my-api.com';
const baseConfig = {baseURL, headers: {}};

test("configureApi returns obj with baseURL", () => {
  expect(configureApi(baseURL)).toEqual(baseConfig);
});
test("addBasicCredentials returns baseConfig with basic credentials", () => {
  const config = pipe(configureApi, addBasicCredentials('foo', 'bar'));
  expect(config(baseURL)).toEqual({...baseConfig,
    auth: {
      username: 'foo',
      password: 'bar'
    }
  });
});
test("addBearerToken returns baseConfig with Bearer credentials", () => {
  const config = pipe(configureApi, addBearerToken('foo'));
  expect(config(baseURL)).toEqual({...baseConfig,
    headers: {...baseConfig.headers,
      Authorization: 'Bearer foo'
    }
  });
});
test("addHeader returns baseConfig with custom header", () => {
  const config = pipe(configureApi, addHeader('foo', 'bar'));
  expect(config(baseURL)).toEqual({...baseConfig,
    headers: {...baseConfig.headers,
      foo: 'bar'
    }
  });
});
