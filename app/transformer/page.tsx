'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dynamically import the TransformerArchitecture component with SSR disabled
const TransformerArchitecture = dynamic(
  () => import('@/components/transformer/TransformerArchitecture'),
  { ssr: false }
);

// Import new placeholder components
const AttentionMatrix = dynamic(() => import('@/components/transformer/AttentionMatrix'), { ssr: false });
const TokenFlow = dynamic(() => import('@/components/transformer/TokenFlow'), { ssr: false });

type TransformerConfig = {
  numLayers: number;
  numHeads: number;
  modelDimension: number;
  feedForwardDim: number;
};

export default function TransformerVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<TransformerConfig>({
    numLayers: 6,
    numHeads: 8,
    modelDimension: 512,
    feedForwardDim: 2048,
  });
  
  const [inputText, setInputText] = useState('The quick brown fox jumps over the lazy dog');
  const tokens = inputText.split(' ');
  
  const animationRef = useRef<number>();
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const animate = () => {
      setCurrentStep(prev => (prev + 1) % 100);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Transformer Architecture Visualizer</h1>
        
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button onClick={togglePlay} variant="default" size="sm">
              {isPlaying ? <Pause size={16} className="mr-2" /> : <Play size={16} className="mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={reset} variant="outline" size="sm">
              <RotateCcw size={16} className="mr-2" />
              Reset
            </Button>
            <Button 
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost" 
              size="sm"
              className="ml-auto"
            >
              <Settings size={16} className="mr-1" />
              {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
          
          {showSettings && (
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Input Text</label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layers: {config.numLayers}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={config.numLayers}
                    onChange={(e) => setConfig({...config, numLayers: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attention Heads: {config.numHeads}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    value={config.numHeads}
                    onChange={(e) => setConfig({...config, numHeads: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Visualization using Tabs */}
        <Tabs defaultValue="architecture" className="bg-white rounded-xl shadow-md p-6">
          <TabsList className="mb-4">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="attention">Attention Maps</TabsTrigger>
            <TabsTrigger value="flow">Token Flow</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture">
            <TransformerArchitecture 
              tokens={tokens} 
              config={config} 
              currentStep={currentStep} 
            />
          </TabsContent>
          <TabsContent value="attention">
            <AttentionMatrix 
              tokens={tokens} 
              numHeads={config.numHeads} 
              currentStep={currentStep} 
            />
          </TabsContent>
          <TabsContent value="flow">
            <TokenFlow 
              tokens={tokens} 
              currentStep={currentStep} 
            />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
