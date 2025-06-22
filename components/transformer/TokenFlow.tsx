'use client';

import React from 'react';

type TokenFlowProps = {
  tokens: string[];
  currentStep: number;
};

const TokenFlow: React.FC<TokenFlowProps> = ({ tokens, currentStep }) => {
  return (
    <div className="p-4 border border-dashed rounded-md min-h-[400px] flex items-center justify-center">
      <p className="text-muted-foreground">
        Token Flow Visualization (Tokens: {tokens.length}, Step: {currentStep})
      </p>
    </div>
  );
};

export default TokenFlow;
