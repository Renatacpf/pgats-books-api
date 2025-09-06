const userService = require('../service/userService');

exports.me = (req, res) => {
  const user = userService.getById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  const { login, nome, idade, sexo } = user;
  res.json({ login, nome, idade, sexo });
};
