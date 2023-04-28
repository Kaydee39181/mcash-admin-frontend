import axios from 'axios';

export const onAuthenticate = payload => {
  const URL = `YOUR_URL`;
  return axios(URL, {
    method: 'POST/GET',
    headers: {
      'content-type': 'application/json', // whatever you want
    },
    data: payload,
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};