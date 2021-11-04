let users = require('../mocks/users');

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
    const { body } = request;

    const lastUserId = users[users.length - 1].id;
    const newUser = {
      id: lastUserId + 1,
      name: body.name
    }

    users.push(newUser);

    response.send(200, newUser);
  },

  updateUser (request, response) {
    let { id } = request.params;
    const { name } = request.body;

    id = Number(id);

    const userFound = users.find((user) => user.id === id);

    if (userFound) {
      users = users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            name
          };
        }

        return user;
      })

      return response.send(200, { id, name });
    }

    response.send(400, { errro: 'User not found' });
  },

  deleteUser (request, response) {
    let { id } = request.params;
    id = Number(id);

    const userFound = users.find((user) => user.id === id);

    if (userFound) {
      users = users.filter((user) => user.id !== id)

      return response.send(200, { ok: true });
    }

    response.send(400, { errro: 'User not found' });
  }
}