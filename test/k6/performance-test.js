import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(90)<=500', 'p(95)<=800'],
    http_req_failed: ['rate<0.01']
  }
};

export default function() {
  let responseLogin = ''; 

  group('Fazendo login', function() {
    responseLogin = http.post(
        'http://localhost:4010/auth/login', 
        JSON.stringify({ 
            login: 'admin', 
            senha: 'admin' 
        }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
    });
  })

  group('Criando um novo livro', function() { 
    let responseBook = http.post(
        'http://localhost:4010/books', 
        JSON.stringify({ 
            titulo: 'Livro de Teste K6', 
            autor: 'Autor Teste',
            isbn: '978-1234567890',
            ano: 2024,
            categoria: 'Teste'
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${responseLogin.json('token')}`
            }
    });

    check(responseBook, {
        'status deve ser igual a 201': (r) => r.status === 201
    });
  })

  group('Simulando o pensamento do usuário', function() {
    sleep(1); // User Think Time
  })
}