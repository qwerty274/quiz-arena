export const API_BASE_URL = import.meta.env.PROD 
  ? "" 
  : "http://localhost:4000";

export const API_URL = `${API_BASE_URL}/api/auth`;
