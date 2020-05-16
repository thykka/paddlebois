const Config = {
  serverPort: 8443,
  keyFile: './key.pem',
  certFile: './cert.pem',
  certPass: 'PaddleBois1', // TODO: use dotenv
  wsServerPort: 8444,
};

// make WS port available for client
const serverPort = Config.serverPort;
export { serverPort };

export default Config;
