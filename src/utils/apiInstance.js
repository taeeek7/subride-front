import axios from "axios";

const getBaseUrl = (serviceName) => {
  switch (serviceName) {
    case "member":
      return "http://localhost:18080";
    case "recommend":
      return "http://localhost:18081";
    case "mysub":
      return "http://localhost:18082";
    case "mygrp":
      return "http://localhost:18083";
    case "transfer":
      return "http://localhost:18084";

    default:
      throw new Error(`Invalid service name: ${serviceName}`);
  }
};

const api = (serviceName) => {
  const API_BASE_URL = getBaseUrl(serviceName);

  const apiInstance = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
      "Content-type": "application/json",
    },
  });

  apiInstance.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return apiInstance;
};

export default api;
