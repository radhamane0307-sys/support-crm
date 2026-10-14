import axios from "axios";

const API = axios.create({
  baseURL: "https://support-crm-backend-hspw.onrender.com/api",
});

export default API;