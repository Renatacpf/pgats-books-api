const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const authController = require('../../../src/controller/authController');
const authService = require('../../../src/service/authService');

describe('authController', () => {
  afterEach(() => sinon.restore());
  it('deve retornar token válido', () => {
    const req = { body: { login: 'admin', senha: 'admin' } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    sinon.stub(authService, 'login').returns({ token: 'abc' });
    authController.login(req, res);
    expect(res.json.calledWith({ token: 'abc' })).to.be.true;
  });
  it('deve retornar 401 se login inválido', () => {
    const req = { body: { login: 'admin', senha: 'errado' } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    sinon.stub(authService, 'login').returns(null);
    authController.login(req, res);
    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWithMatch({ error: sinon.match.string })).to.be.true;
  });
});
