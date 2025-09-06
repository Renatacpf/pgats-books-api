const authService = require('../service/authService');

function authMiddleware(req, res, next) {
  if (req.path.startsWith('/auth/login') || req.path.startsWith('/docs') || req.path.startsWith('/graphql')) {
    return next();
  }
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token ausente' });
  }
  const token = auth.split(' ')[1];
  const payload = authService.verify(token);
  if (!payload) {
    return res.status(401).json({ error: 'Token inválido' });
  }
  req.user = payload;
  next();
}

module.exports = { authMiddleware };
