import axios from "axios";

const API_URL = "http://192.168.1.100:8080/api"

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,

});

api.interceptors.request.use(async (config) => {
    
    config.auth = {
        username: "admin",
        password: "admin",
    }
    return config;
});

export default api;