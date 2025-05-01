// src/components/game/VictoryScreen.tsx
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { useNavigate } from 'react-router-dom';
import { API } from '../../constants';

interface VictoryScreenProps {
  time: string;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ time }) => {
  const { token } = useAuth();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const seconds = React.useMemo(() => {
    const [min, sec] = time.split(':').map(Number);
    return min * 60 + sec;
  }, [time]);

  useEffect(() => {
    const updateStats = async () => {
      if (!token) return;
      try {
        await fetch(`${API}/update_stats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ time_seconds: seconds }),
        });
      } catch (err) {
        console.error('Failed to update stats:', err);
      }
    };
    updateStats();
  }, [token, seconds]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Prevent click outside from closing modal or affecting background */}
      <div
        className="bg-zinc-900 text-white rounded-xl p-6 shadow-lg w-96 text-center border border-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-green-400 mb-2">Victory!</h2>
        <p className="text-lg text-gray-300 mb-4">You solved the puzzle!</p>

        <div className="bg-zinc-800 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-400">Completion Time</p>
          <p className="text-2xl font-semibold text-white">{time}</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => openModal('difficulty')}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded transition"
          >
            New Game
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-zinc-700 hover:bg-zinc-600 text-white font-medium py-2 px-6 rounded transition"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;
