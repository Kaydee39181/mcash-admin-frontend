import axios from 'axios';
import { removeToken } from "./utils/localStorage";

import { logoutUser } from './Redux/requests/userRequest';

export default {
  setupInterceptors: (store, history) => {
// console.log()
      axios.interceptors.response.use(response => {
          if(response.data.responseCode==="02"){
            removeToken()
            window.location.replace('/')   
         }
        return response;
      }, error => {
      return Promise.reject(error);
    });
  },
};