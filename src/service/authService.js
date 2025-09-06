const jwt = require('jsonwebtoken');
const userModel = require('../model/user');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

module.exports = {
  login: (login, senha) => {
    const user = userModel.findByLogin(login);
    if (!user || !userModel.validatePassword(user, senha)) return null;
    const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '1h' });
    return { token };
  },
  verify: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
};
