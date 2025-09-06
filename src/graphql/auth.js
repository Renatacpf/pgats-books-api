const authService = require('../service/authService');
const userModel = require('../model/user');

function getUserFromToken(token) {
  if (!token) return null;
  const payload = authService.verify(token);
  if (!payload) return null;
  return userModel.getById(payload.id);
}

module.exports = { getUserFromToken };
