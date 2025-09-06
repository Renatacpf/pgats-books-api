const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const userController = require('../../../src/controller/userController');
const userService = require('../../../src/service/userService');

describe('userController', () => {
  afterEach(() => sinon.restore());
  it('deve retornar dados do usuário', () => {
    const req = { user: { id: 1 } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    sinon.stub(userService, 'getById').returns({ login: 'admin', nome: 'Administrador', idade: 35, sexo: 'F' });
    userController.me(req, res);
    expect(res.json.calledWith({ login: 'admin', nome: 'Administrador', idade: 35, sexo: 'F' })).to.be.true;
  });
  it('deve retornar 404 se usuário não existe', () => {
    const req = { user: { id: 2 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    sinon.stub(userService, 'getById').returns(null);
    userController.me(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });
});
