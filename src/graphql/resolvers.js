const userModel = require('../model/user');
const bookModel = require('../model/book');
const authService = require('../service/authService');

module.exports = {
  Query: {
    me: (_, __, { user }) => user ? {
      login: user.login,
      nome: user.nome,
      idade: user.idade,
      sexo: user.sexo
    } : null,
    books: (_, __, { user }) => user ? bookModel.getAll() : [],
    book: (_, { id }, { user }) => user ? bookModel.getById(id) : null,
  },
  Mutation: {
    login: (_, { login, senha }) => {
      const result = authService.login(login, senha);
      if (!result) throw new Error('Login ou senha inválidos');
      return result;
    },
    createBook: (_, { titulo, autor, ano }, { user }) => {
      if (!user) throw new Error('Não autenticado');
      return bookModel.create({ titulo, autor, ano });
    },
    updateBook: (_, { id, titulo, autor, ano }, { user }) => {
      if (!user) throw new Error('Não autenticado');
      return bookModel.update(id, { titulo, autor, ano });
    },
    deleteBook: (_, { id }, { user }) => {
      if (!user) throw new Error('Não autenticado');
      return bookModel.remove(id);
    },
  },
};
