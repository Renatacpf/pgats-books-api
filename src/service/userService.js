const userModel = require('../model/user');

module.exports = {
  getById: (id) => userModel.getById(id)
};
