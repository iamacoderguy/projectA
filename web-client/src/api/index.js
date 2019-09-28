import { create } from 'apisauce';

export const api = params =>
  create({
    baseURL: 'http://localhost:3000/api',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'x-auth-token': `${params} `,
    },
    timeout: 30000,
  });
