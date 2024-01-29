import http from "k6/http";
import { sleep } from 'k6';

export const options = {
    vus: 2,
    duration: '30s',
    noConnectionReuse: true,
}

export default async function() {
    const url = 'http://localhost:8080';
    healthCheck(url)    
}

async function healthCheck(url) {
    const res = await http.get(url + '/actuator/health');
    return res.json();
}

async function callClient(url) {
    const payload = JSON.stringify({
        'propA': 'a',
        'propB': 'b',
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const res = await http.post(url + '/call-client', payload, params);
    return res.json().uuid
}