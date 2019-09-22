import { api } from './index';
import { create } from 'apisauce';

export const putPath = dataRequest =>
  api()
    .put('/files/path', { path: JSON.stringify(dataRequest) })
    .then(response => response)
    .catch(error => error);

export const connectServer = params => {
  api(params)
    .post('/auth/connect')
    .then(response => {
      console.log('response', response);
      return response;
    })
    .catch(error => error);
};
