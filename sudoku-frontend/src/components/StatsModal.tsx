// src/components/StatsModal.tsx

import React, { useEffect, useState } from 'react';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { getStats } from '../api/auth';
import { formatTime } from './utils/formatTime';
import { X } from 'lucide-react';

const StatsModal = () => {
  const { modal, closeModal, closing } = useModal();
  const { token } = useAuth();
  const [stats, setStats] = useState<null | {
    username: string;
    games_played: number;
    fastest_time: number | null;
    average_time: number | null;
  }>(null);

  useEffect(() => {
    if (modal === 'stats' && token) {
      getStats(token).then(setStats).catch(() => setStats(null));
    }
  }, [modal, token]);

  if (modal !== 'stats') return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className="relative bg-zinc-900 text-white p-6 rounded-lg shadow-lg w-80">
        <button onClick={closeModal} className="absolute top-3 right-3 text-white hover:text-red-400">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">Your Stats</h2>
        {token && stats ? (
          <div className="space-y-2 text-sm">
            <p><strong>Username:</strong> {stats.username}</p>
            <p><strong>Games Played:</strong> {stats.games_played}</p>
            <p><strong>Fastest</strong>: {formatTime(stats.fastest_time)}</p>
            <p><strong>Average Time:</strong> {formatTime(stats.average_time) ?? 'N/A'}s</p>
          </div>
        ) : (
          <div className="text-center text-sm">
            You are in <strong>Guest Mode</strong>. Log in to see your stats.
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsModal;
