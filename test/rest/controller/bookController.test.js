const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const bookController = require('../../../src/controller/bookController');
const bookService = require('../../../src/service/bookService');

describe('bookController', () => {
  afterEach(() => sinon.restore());
  it('deve criar livro', () => {
    const req = { body: { titulo: 'A', autor: 'B', ano: 2020 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    sinon.stub(bookService, 'create').returns({ id: 1, ...req.body });
    bookController.create(req, res);
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWithMatch({ titulo: 'A' })).to.be.true;
  });
  it('deve retornar 400 se faltar campo', () => {
    const req = { body: { titulo: '', autor: '', ano: null } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    bookController.create(req, res);
    expect(res.status.calledWith(400)).to.be.true;
  });
  it('deve listar livros', () => {
    const req = {};
    const res = { json: sinon.spy() };
    sinon.stub(bookService, 'getAll').returns([{ id: 1 }]);
    bookController.getAll(req, res);
    expect(res.json.calledWith([{ id: 1 }])).to.be.true;
  });
  it('deve buscar livro por id', () => {
    const req = { params: { id: 1 } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    sinon.stub(bookService, 'getById').returns({ id: 1 });
    bookController.getById(req, res);
    expect(res.json.calledWith({ id: 1 })).to.be.true;
  });
  it('deve retornar 404 se livro não existe', () => {
    const req = { params: { id: 2 } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    sinon.stub(bookService, 'getById').returns(null);
    bookController.getById(req, res);
    expect(res.status.calledWith(404)).to.be.true;
  });
});
