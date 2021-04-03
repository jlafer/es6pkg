import {checkEnvVariable,
} from './index';

const env = {
  foo: 'bar'
};
test("checkEnvVariable returns value when var is in env", () => {
  expect(checkEnvVariable(env, 'foo')).toEqual('bar');
});
