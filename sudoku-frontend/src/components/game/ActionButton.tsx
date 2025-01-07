// components/game/ActionButton.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
}

const ActionButton = ({ icon: Icon, selected, onClick }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-10 h-10 flex items-center justify-center
        ${selected ? 'border border-black bg-gray-700' : ''}
        hover:bg-gray-700
      `}
    >
      <Icon size={20} />
    </button>
  );
};

export default ActionButton;