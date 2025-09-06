
const { expect } = require('chai');
const resolvers = require('../../../src/graphql/resolvers');

describe('GraphQL Controller (unit)', () => {
	it('deve autenticar e retornar token', () => {
		const result = resolvers.Mutation.login(null, { login: 'admin', senha: 'admin' });
		expect(result).to.have.property('token').that.is.a('string');
	});

	it('deve listar livros', () => {
		const context = { user: { login: 'admin', nome: 'Administrador', idade: 35, sexo: 'F' } };
		const result = resolvers.Query.books(null, null, context);
		expect(result).to.be.an('array');
		expect(result.length).to.be.gte(0);
	});

	it('deve retornar dados do usuário autenticado', () => {
		const context = { user: { login: 'admin', nome: 'Administrador', idade: 35, sexo: 'F' } };
		const result = resolvers.Query.me(null, null, context);
		expect(result).to.deep.equal({ login: 'admin', nome: 'Administrador', idade: 35, sexo: 'F' });
	});
});
