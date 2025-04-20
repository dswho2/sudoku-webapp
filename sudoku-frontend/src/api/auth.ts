// src/api/auth.ts

import { API } from '../constants'

export const loginUser = async (username: string, password: string) => {
    const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
};

export const registerUser = async (username: string, password: string) => {
    const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
};

export const getUserProfile = async (token: string) => {
    const res = await fetch(`${API}/protected`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      const error = await res.text();
      console.error('Protected route error:', error);
      throw new Error('Failed to fetch profile');
    }
    
    return res.json();
};

export const getStats = async (token: string) => {
  const res = await fetch(`${API}/get_stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  });

  if (!res.ok) throw new Error('Failed to get stats');
  return res.json();
};
