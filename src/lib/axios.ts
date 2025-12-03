import axios from "axios";
import { isTokenExpired } from "../helpers";
import { refreshToken } from "../services/UsersAPI";
import type { ResponseAuthentication } from "../types";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
      if (error) {
          prom.reject(error);
      } else {
          prom.resolve(token);
      }
  });

  failedQueue = [];
};

api.interceptors.request.use( async config => {
    
  let token = localStorage.getItem("accessToken");

  if (token !== null) {
    // Agregar token actualizado al request
    config.headers["Authorization"] = `Bearer ${token}`;
    return config   
  }

  return config;
  
});


api.interceptors.response.use((response) => {
  return response
}, (error) => {
  
  const originalRequest = error.config

  if (error.response.status === 401 && !originalRequest._retry) {
    
    if (isRefreshing) {
      return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
      })
      .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return api(originalRequest);
      })
      .catch(err => {
          return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return new Promise(function(resolve, reject) {
      
        api
            .post('/auth/refresh')
            .then(({ data }) => {
                
                localStorage.setItem("accessToken", data.token);

                api.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
                originalRequest.headers['Authorization'] = 'Bearer ' + data.token;
                processQueue(null, data.token);
                resolve(api(originalRequest));
            })
            .catch(err => {
              processQueue(err, null);
              // store.dispatch(showMessage({ message: 'Expired Token' }));
              
              reject(err);
            })
            .then(() => {
                isRefreshing = false;
            });
    });

  }

  return Promise.reject(error)

})





export default api


