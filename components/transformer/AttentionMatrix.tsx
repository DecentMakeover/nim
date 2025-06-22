'use client';

import React from 'react';

type AttentionMatrixProps = {
  tokens: string[];
  numHeads: number;
  currentStep: number;
};

const AttentionMatrix: React.FC<AttentionMatrixProps> = ({ tokens, numHeads, currentStep }) => {
  return (
    <div className="p-4 border border-dashed rounded-md min-h-[400px] flex items-center justify-center">
      <p className="text-muted-foreground">
        Attention Matrix Visualization (Tokens: {tokens.length}, Heads: {numHeads}, Step: {currentStep})
      </p>
    </div>
  );
};

export default AttentionMatrix;
