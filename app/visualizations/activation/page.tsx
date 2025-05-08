'use client'
import { ActivationVisualizer } from '@/components/ui/activation-visualizer'

export default function ActivationVisualizerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Neural Network Activation Functions</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Interactive visualization of common neural network activation functions and their derivatives.
        Hover over the graph to see function values and derivatives at any point.
      </p>
      <div className="w-full max-w-4xl mx-auto">
        <ActivationVisualizer />
      </div>
    </div>
  )
} 