import axios from 'axios';

const API_URL = 'http://localhost:8080/productos';

export const getProductos = (page = 0, size = 6) => {
  return axios.get(`${API_URL}?page=${page}&size=${size}`);
};