import axios from "axios";

const api = axios.create({
  baseURL: "/api", // no localhost needed — backend serves frontend
});

export default api;
