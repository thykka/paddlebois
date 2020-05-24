const Config = {
  hostname: '127.0.0.1',
  serverPort: 8443,
  keyFile: './key.pem',
  certFile: './cert.pem',
  certPass: 'PaddleBois1', // TODO: use dotenv
  wsServerPort: 8444,
};

// make WS connection details available for client
const serverPort = Config.serverPort;
const hostname = Config.hostname;

export { serverPort, hostname };

export default Config;
