let books = [
  { id: 1, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', ano: 1954 },
  { id: 2, titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano: 1899 },
  { id: 3, titulo: '1984', autor: 'George Orwell', ano: 1949 }
];
let nextId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;

module.exports = {
  getAll: () => books,
  getById: (id) => books.find(b => b.id === Number(id)),
  create: (data) => {
    const book = { id: nextId++, ...data };
    books.push(book);
    return book;
  },
  update: (id, data) => {
    const idx = books.findIndex(b => b.id === Number(id));
    if (idx === -1) return null;
    books[idx] = { ...books[idx], ...data };
    return books[idx];
  },
  remove: (id) => {
    const idx = books.findIndex(b => b.id === Number(id));
    if (idx === -1) return false;
    books.splice(idx, 1);
    return true;
  },
  reset: () => { books = []; nextId = 1; }
};
