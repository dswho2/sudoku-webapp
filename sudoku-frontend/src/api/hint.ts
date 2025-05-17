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

  
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 403) {
      throw { message: data.error || 'Failed to fetch hint', status: response.status };
    } else {
      throw new Error(data.error || 'Failed to fetch hint');
    }
  }

  return data.hint;
};