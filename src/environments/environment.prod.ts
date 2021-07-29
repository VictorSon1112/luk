/* eslint-disable @typescript-eslint/naming-convention */
export const environment = {
  production: true,
  // url: 'http://192.168.1.199/price/web/'
  url: 'https://galaxy.luckystd.com/',
  socket: {
    url: 'http://45.76.184.82',
    options: {
      path: '/socket_chat',
    },
  },
  socket_crash: {
    url: 'http://45.76.184.82',
    options: {
      path: '/socket_crash',
    },
  },
};
