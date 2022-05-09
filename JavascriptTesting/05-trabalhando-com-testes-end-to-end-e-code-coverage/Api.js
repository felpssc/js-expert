const http = require('http');

const DEFAULT_USER = {
  username: 'admin',
  password: 'admin'
}

const routes = {
  '/contact:get': (req, res) => {
    res.write('Contact us page');
    return res.end();
  },

  '/login:post': async (req, res) => {
    
    for await (const data of req) {
      const user = JSON.parse(data);
      
      if(user.username !== DEFAULT_USER.username || user.password !== DEFAULT_USER.password) {
        res.writeHead(401);
        return res.end();
      }
    }
    
    res.write('Login successful');
    return res.end();
  },

  default: (req, res) => {
    res.write('Hello World');
    return res.end();
  }
};

class Api {
  async handle(request, response) {

    const { url, method } = request;
    const routeKey = `${url}:${method.toLowerCase()}`;

    const chosen = routes[routeKey] || routes.default;

    response.writeHead(200, { 'Content-Type': 'text/html' });

    return chosen(request, response);
  }
}

module.exports = { Api };