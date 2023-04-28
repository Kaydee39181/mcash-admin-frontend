export const saveToken = data => window.localStorage.setItem('data', data);
export const getToken = () => window.localStorage.getItem('data') || '';
export const removeToken = () => {
  window.localStorage.removeItem('data');
  window.localStorage.removeItem('user');
};