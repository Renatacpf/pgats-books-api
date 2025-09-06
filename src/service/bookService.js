const bookModel = require('../model/book');

module.exports = {
  getAll: () => bookModel.getAll(),
  getById: (id) => bookModel.getById(id),
  create: (data) => bookModel.create(data),
  update: (id, data) => bookModel.update(id, data),
  remove: (id) => bookModel.remove(id),
  reset: () => bookModel.reset()
};
