import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={`bg-white rounded-sm p-4 border border-gray-200 shadow-sm transition-shadow group ${className}`}>
      {children}
    </div>
  );
};

export default Card;