// src/repositories/user.repository.js
const UserDAO = require('../dao/models/user.dao');

class UserRepository {
  async getAll() {
    return await UserDAO.findAll();
  }

  async getById(id) {
    return await UserDAO.findById(id);
  }

  async getByEmail(email) {
    return await UserDAO.findByEmail(email);
  }

  async createUser(userData) {
    return await UserDAO.create(userData);
  }

  async updateUser(id, data) {
    return await UserDAO.update(id, data);
  }

  async deleteUser(id) {
    return await UserDAO.remove(id); // DAO tiene 'remove'
  }

  async updatePassword(id, newHashedPassword) {
    return await UserDAO.updatePassword(id, newHashedPassword); // DAO tiene updatePassword
  }
}

module.exports = new UserRepository();
