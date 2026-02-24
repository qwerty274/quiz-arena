const API_URL = "http://localhost:4000/api/auth";

// SIGNUP
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  return res.json();
};

// LOGIN
export const loginUser = async (
  email: string,
  password: string
) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

// PROTECTED ROUTE
export const getProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};
