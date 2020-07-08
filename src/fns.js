export function corsResponse() {
  let response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  response.appendHeader("Access-Control-Allow-Headers", "Authorization,Content-Type,Accept");
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

export function checkEnvVariable(env, name) {
  const value = env[name];
  if (! value) {
    const msg = `${name} env variable not set`;
    throw new Error(msg);
  }
  return value;
}
