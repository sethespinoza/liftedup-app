import axios from 'axios';

// all API requests go to FastAPI backend
const API = axios.create({
    baseURL: 'http://localhost:8000'
});

// auto attach the token to every request if logged in
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;