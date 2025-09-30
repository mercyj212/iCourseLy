import axios from "axios";

const api = axios.create({ 
    baseURL: "http://localhost:5000/api",   
    
    //https://icoursely-api-2.onrender.com/api,   http://localhost:5000/api/auth/login
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;