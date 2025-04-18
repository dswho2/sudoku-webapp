// src/hooks/useUsername.ts
import { useEffect, useState } from 'react';
import { getUserProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const useUsername = () => {
  const { token } = useAuth();
  const [username, setUsername] = useState('Guest');

  useEffect(() => {
    const fetchUsername = async () => {
      if (token) {
        try {
          const data = await getUserProfile(token);
          if (data?.msg?.startsWith('Hello')) {
            const extracted = data.msg.replace('Hello ', '');
            setUsername(extracted);
          }
        } catch {
          setUsername('Guest');
        }
      } else {
        setUsername('Guest');
      }
    };

    fetchUsername();
  }, [token]);

  return username;
};

export default useUsername;