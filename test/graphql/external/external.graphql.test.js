const request = require('supertest');
const { expect } = require('chai');

describe('External GraphQL API', () => {
  // Antes de rodar, a API deve estar rodando em http://localhost:4010
  const baseUrl = 'http://localhost:4010';
  it('deve autenticar e acessar books (GraphQL)', async () => {
    const res = await request(baseUrl)
      .post('/graphql')
      .send({ query: 'mutation { login(login: "admin", senha: "admin") { token } }' });
    expect(res.body.data.login.token).to.be.a('string');
    const token = res.body.data.login.token;
    const res2 = await request(baseUrl)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: '{ books { id titulo } }' });
    expect(res2.body.data.books).to.be.an('array');
  });
});
