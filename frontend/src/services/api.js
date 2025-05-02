import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api", // your backend URL
    withCredentials: true, // for cookies (JWT)
});

export default api;
