import axios from "axios";

const API_URL = "https://throughout-hostel-emphasis-warming.trycloudflare.com/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,

});

export default api;