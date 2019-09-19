import { api } from './index';

export const putPath = () =>
  api
    .put('/files/path')
    .then(response => response)
    .catch(error => error);

export const connectServer = pin => {
  console.log('pin', pin);
  api
    // .setHeaders({
    //   'x-auth-token': `${pin}`,
    // })
    .post('/auth/connect')
    .then(response => response)
    .catch(error => error);
};
