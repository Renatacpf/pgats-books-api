const request = require('supertest');
const { expect } = require('chai');

describe('External HTTP API', () => {
  // Antes de rodar, a API deve estar rodando em http://localhost:4010
  const baseUrl = 'http://localhost:4010';
  it('deve autenticar e acessar rota protegida', async () => {
    const res = await request(baseUrl)
      .post('/auth/login')
      .send({ login: 'admin', senha: 'admin' });
    expect(res.status).to.equal(200);
    const token = res.body.token;
    const res2 = await request(baseUrl)
      .get('/books')
      .set('Authorization', `Bearer ${token}`);
    expect(res2.status).to.equal(200);
  });
});
