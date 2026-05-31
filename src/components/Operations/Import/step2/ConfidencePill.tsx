import React from 'react';
import { Confidence } from '../../../../app/types';

interface ConfidencePillProps {
  confidence: Confidence;
  compact?: boolean;
}

export const ConfidencePill: React.FC<ConfidencePillProps> = ({ confidence, compact }) => {
  const styles = {
    [Confidence.High]: 'bg-green-50 text-green-700 border-green-200',
    [Confidence.Medium]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    [Confidence.Low]: 'bg-red-50 text-red-700 border-red-200',
  };
  
  if (compact) {
    const dots = {
      [Confidence.High]: 'bg-green-500',
      [Confidence.Medium]: 'bg-yellow-500',
      [Confidence.Low]: 'bg-red-500',
    };
    return (
      <div className="flex items-center px-1" title={`AI Confidence: ${confidence}`}>
        <div className={`w-2 h-2 rounded-full ${dots[confidence]} shadow-sm`} />
      </div>
    );
  }

  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter rounded-full border ${styles[confidence]}`}>
      {confidence}
    </span>
  );
};
