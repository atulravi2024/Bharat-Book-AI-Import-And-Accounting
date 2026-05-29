import React from 'react';

interface HorizontalScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  scrollStep?: number;
}

export const HorizontalScrollArea: React.FC<HorizontalScrollAreaProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`overflow-x-auto custom-scrollbar w-full ${className}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {children}
    </div>
  );
};
