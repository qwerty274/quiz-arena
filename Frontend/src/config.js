// For local network testing, we use the current hostname to connect to the backend.
// This allows other devices (phones, tablets) on the same Wi-Fi to reach the server.
const getBackendUrl = () => {
  if (import.meta.env.PROD) {
    return ""; // Relative URL for production (same port)
  }
  
  // In development, if we're accessing via an IP address (like 192.168.x.x), 
  // use that same IP for the backend. Fallback to localhost.
  const hostname = window.location.hostname;
  return `http://${hostname}:4000`;
};

export const API_BASE_URL = getBackendUrl();
export const API_URL = `${API_BASE_URL}/api/auth`;
