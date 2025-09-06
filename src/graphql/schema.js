const { gql } = require('apollo-server-express');

module.exports = gql`
  """
  Usuário autenticado
  """
  type User {
    login: String!
    nome: String!
    idade: Int!
    sexo: String!
  }

  """
  Livro do catálogo
  """
  type Book {
    id: ID!
    titulo: String!
    autor: String!
    ano: Int!
  }

  """
  Token JWT de autenticação
  """
  type Token {
    token: String!
  }

  type Query {
    """Usuário autenticado"""
    me: User
    """Lista todos os livros"""
    books: [Book!]!
    """Consulta detalhes de um livro"""
    book(id: ID!): Book
  }

  type Mutation {
    """Autentica e retorna token JWT"""
    login(login: String!, senha: String!): Token
    """Cria um novo livro"""
    createBook(titulo: String!, autor: String!, ano: Int!): Book
    """Atualiza um livro"""
    updateBook(id: ID!, titulo: String, autor: String, ano: Int): Book
    """Remove um livro"""
    deleteBook(id: ID!): Boolean
  }

# Exemplos de queries e mutations:
#
# query {
#   me { login }
#   books { id titulo autor ano }
#   book(id: 1) { id titulo autor ano }
# }
#
# mutation {
#   login(login: "admin", senha: "admin") { token }
#   createBook(titulo: "Livro", autor: "Autor", ano: 2020) { id titulo }
#   updateBook(id: 1, titulo: "Novo Titulo") { id titulo }
#   deleteBook(id: 1)
# }
`;
