// src/api/auth.ts
const API = "http://localhost:5000";

export const loginUser = async (username: string, password: string) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return res.json();
};

export const registerUser = async (username: string, password: string) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return res.json();
};

export const getUserProfile = async (token: string) => {
  const res = await fetch(`${API}/protected`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};