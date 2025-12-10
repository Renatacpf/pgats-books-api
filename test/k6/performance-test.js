import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { getBaseUrl } from './helpers/getBaseUrl.js';
import { login } from './helpers/login.js';
import { randomISBN, randomYear } from './helpers/randomData.js';
import faker from 'k6/x/faker';

const users = new SharedArray('users', function () {
    return JSON.parse(open('./data/users.test.data.json'));
});

const createBookTrend = new Trend('create_book_duration');

export let options = {
    thresholds: {
        http_req_duration: ['p(95)<5000'], // 95% das requests devem ser < 5s
    },
    stages: [
        { duration: '5s', target: 10 }, // Ramp up
        { duration: '20s', target: 10 }, // Average
        { duration: '5s', target: 20 }, // Spike
        { duration: '5s', target: 20 }, // Spike
        { duration: '5s', target: 10 }, // Average
        { duration: '5s', target: 0 }, // Ramp down
    ],
};

export default function () {
    const user = users[(__VU - 1) % users.length];
    let token = null;

    group('Login', function () {
        token = login(user.login, user.senha);
    });

    group('Criar Livro', function () {
        const url = `${getBaseUrl()}/books`;
        const payload = JSON.stringify({
            titulo: faker.book.title(),
            autor: faker.book.author(),
            isbn: randomISBN(),
            ano: randomYear(),
            categoria: faker.book.genre()
        });
        const params = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };
        const start = Date.now();
        const res = http.post(url, payload, params);
        const duration = Date.now() - start;
        createBookTrend.add(duration);
        check(res, { 'criar livro status 201': (r) => r.status === 201 });
    });

    group('Listar Livros', function () {
        const url = `${getBaseUrl()}/books`;
        const params = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        };
        const res = http.get(url, params);
        check(res, { 'listar livros status 200': (r) => r.status === 200 });
    });

    sleep(1);
}
