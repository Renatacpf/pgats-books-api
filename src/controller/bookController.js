const bookService = require('../service/bookService');

exports.create = (req, res) => {
  const { titulo, autor, ano } = req.body;
  if (!titulo || !autor || !ano) return res.status(400).json({ error: 'Campos obrigatórios' });
  const book = bookService.create({ titulo, autor, ano });
  res.status(201).json(book);
};

exports.getAll = (req, res) => {
  res.json(bookService.getAll());
};

exports.getById = (req, res) => {
  const book = bookService.getById(req.params.id);
  if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
  res.json(book);
};

exports.update = (req, res) => {
  const book = bookService.update(req.params.id, req.body);
  if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
  res.json(book);
};

exports.remove = (req, res) => {
  const ok = bookService.remove(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Livro não encontrado' });
  res.status(204).end();
};
