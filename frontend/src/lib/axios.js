import axios from "axios";

export const axiosInstance = axios.create({

  // Just making a common api send point
  // if mode=development then push the request to "http://localhost:3000/api"  else to "/api"
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
  withCredentials: true,
});

