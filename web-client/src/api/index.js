// libs
import { create } from 'apisauce';

export const api = create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});
