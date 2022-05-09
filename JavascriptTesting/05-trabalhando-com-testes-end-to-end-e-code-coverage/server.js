const http = require('http');
const { Api } = require('./Api');

const api = new Api();

const server = http.createServer(api.handle)
  .listen(3000, () => {
    console.log('Server running on port 3000');
  });

module.exports = { server };