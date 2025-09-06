const authService = require('../service/authService');

exports.login = (req, res) => {
  const { login, senha } = req.body;
  const result = authService.login(login, senha);
  if (!result) return res.status(401).json({ error: 'Login ou senha inválidos' });
  res.json(result);
};
