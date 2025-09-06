const bcrypt = require('bcryptjs');

const users = [
  { id: 1, login: 'admin', senha: bcrypt.hashSync('admin', 8), nome: 'Administrador', idade: 35, sexo: 'F' },
  { id: 2, login: 'user1', senha: bcrypt.hashSync('senha1', 8), nome: 'João Silva', idade: 28, sexo: 'M' },
  { id: 3, login: 'user2', senha: bcrypt.hashSync('senha2', 8), nome: 'Maria Souza', idade: 31, sexo: 'F' }
];

module.exports = {
  findByLogin: (login) => users.find(u => u.login === login),
  validatePassword: (user, senha) => bcrypt.compareSync(senha, user.senha),
  getById: (id) => users.find(u => u.id === id),
};
