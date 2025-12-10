import http from 'k6/http';
import { check } from 'k6';
import { getBaseUrl } from './getBaseUrl.js';

export function login(username, password) {
    const url = `${getBaseUrl()}/auth/login`;
    const payload = JSON.stringify({ 
        login: username, 
        senha: password 
    });
    const params = { 
        headers: { 'Content-Type': 'application/json' } 
    };
    
    const res = http.post(url, payload, params);
    
    check(res, { 
        'login status 200': (r) => r.status === 200,
        'token retornado': (r) => r.json('token') !== null
    });
    
    const token = res.json('token');
    return token;
}
