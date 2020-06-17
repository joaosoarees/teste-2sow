import axios from 'axios';

// configura o axios para que possamos trabalhar com o db.json
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

export default api;