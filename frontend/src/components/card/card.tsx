import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div
      {...props}
      className={`bg-white rounded-sm p-4 border border-gray-200 shadow-sm transition-shadow group ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;