// src/components/AuthModal.tsx
import React, { useState } from 'react';
import { loginUser, registerUser, getUserProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { X } from 'lucide-react';

const AuthModal = () => {
  const { login } = useAuth();
  const { closeModal } = useModal();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [closing, setClosing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = isLogin
        ? await loginUser(username, password)
        : await registerUser(username, password);

      if (data.access_token) {
        const profile = await getUserProfile(data.access_token);
        login(data.access_token, profile.id);
        handleClose();
      } else {
        setError(data.msg || 'Something went wrong');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      closeModal();
    }, 300); // match duration-300
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <form onSubmit={handleSubmit} className="relative bg-zinc-900 text-white p-8 rounded-lg shadow-lg w-96 z-50">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 text-white hover:text-red-400"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Log In' : 'Sign Up'}
        </h2>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border border-gray-600 bg-zinc-800 text-white rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-600 bg-zinc-800 text-white rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
        >
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-400 hover:underline"
          >
            {isLogin ? 'Need to sign up?' : 'Already have an account? Log in'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthModal;
