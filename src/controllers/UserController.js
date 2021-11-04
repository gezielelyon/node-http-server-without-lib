const users = require('../mocks/users');

module.exports = {
  listUsers (request, response) {
    const { order } = request.query;

    const sortedUsers = users.sort((before, current) => {
      if (order === 'desc') {
        return before.id < current.id ? 1 : -1;
      }

      return before.id > current.id ? 1 : -1;
    })

    response.send(200, sortedUsers)
  },

  getUserById (request, response) {
    const { id } = request.params;

    const userIdFound = users.find((user) => user.id == id);

    if (userIdFound) {
      return response.send(200, userIdFound );
    }

    response.send(400, 'User not found');
  },

  createUser (request, response) {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      body = JSON.parse(body);

      const lastUserId = users[users.length - 1].id;

      const newUser = {
        id: lastUserId + 1,
        name: body.name
      }

      users.push(newUser);

      response.send(200, newUser)
    });
  }
}