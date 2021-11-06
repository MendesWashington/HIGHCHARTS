import axios from "axios";

const api = axios.create({
  baseURL: "https://api.appsupply.ml/",
});

export default api;
