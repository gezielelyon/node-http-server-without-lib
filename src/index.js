const http = require('http');
const { URL } = require('url');

const routes = require('./routes');

const server = http.createServer(async (request, response) => {
  const parsedURL = new URL(`http://locahost:3333${request.url}`);

  console.log(`Endpoint: ${parsedURL.pathname}, Method: ${request.method}`);

  let { pathname } = parsedURL;
  let id = null;

  const splitEndpoint = pathname.split('/').filter(Boolean);

  if (splitEndpoint.length > 1) {
    pathname = `/${splitEndpoint[0]}/:id`;
    id = splitEndpoint[1]
  }

  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname  && routeObj.method == request.method
  ))

  if (route) {
    request.query = Object.fromEntries(parsedURL.searchParams);
    request.params = { id };

    response.send = (statusCode, body) => {
      response.writeHead(statusCode, { 'content-type': 'text/html' });
      return response.end(JSON.stringify(body));
    }

    route.handler(request, response);
  }else {
    response.writeHead(404, { 'content-type': 'text/html' });
    return response.end(`Cannot ${request.method} ${parsedURL.pathname}`);
  }
})

server.listen(3333, () => {
  console.log('Server started on port 3333 🚀');
})
