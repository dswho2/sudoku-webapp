// src/api/hint.ts

import { API } from '../constants';

export const getHint = async (board: (number | undefined)[][], token?: string) => {
  const response = await fetch(`${API}/hint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ board })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch hint');
  }

  const data = await response.json();
  return data.hint;
};