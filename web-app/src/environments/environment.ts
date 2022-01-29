// This configuration is for "dev-local" profile
// it assumes that the backend mock server is
// running and listening on localhost:1337,
// and the traffic is forwarded by proxy-dev-local.conf.json

export const environment = {
  production: false,
  apiBaseUrl: '',
  wsUrl: `${getWsProtocol()}://${window.location.hostname}:${window.location.port}/ws-proxy`
};

function getWsProtocol() {
  return window.location.protocol === "http:" ? "ws" : "wss";
}
