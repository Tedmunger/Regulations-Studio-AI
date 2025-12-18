import React from 'react';
import { TrafficLightStatus } from '../types';

interface BadgeProps {
  status: TrafficLightStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  switch (status) {
    case 'Critical':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
          Critical
        </span>
      );
    case 'Opportunity':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
           <span className="w-1.5 h-1.5 rounded-full bg-yellow-600"></span>
          Opportunity
        </span>
      );
    case 'FYI':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
           <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
          FYI
        </span>
      );
    default:
      return null;
  }
};

export default Badge;