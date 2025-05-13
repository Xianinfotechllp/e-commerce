
import axios from "axios";

const instance = axios.create({
  baseURL: "https://e-commerce-4jpl.onrender.com/api", 
  withCredentials: true,
});

export default instance;
