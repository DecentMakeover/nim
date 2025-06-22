'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Define TransformerConfig type, similar to page.tsx
type TransformerConfig = {
  numLayers: number;
  numHeads: number;
  modelDimension: number; // Added for completeness, though not directly used in current D3 viz
  feedForwardDim: number; // Added for completeness
};

type TransformerArchitectureProps = {
  tokens: string[];
  config: TransformerConfig; // Changed from numLayers, numHeads
  currentStep: number;
};

export default function TransformerArchitecture({
  tokens,
  config, // Changed here
  currentStep,
}: TransformerArchitectureProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Destructure from config for use in the component
  const { numLayers, numHeads } = config;

  useEffect(() => {
    if (!svgRef.current || !tokens.length) return;

    const svgElement = svgRef.current;
    const parentWidth = svgElement.parentElement?.clientWidth || 1000;
    const height = 700; // Increased height for more detail
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const innerWidth = parentWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    d3.select(svgElement).selectAll('*').remove();

    const svg = d3.select(svgElement)
      .attr('width', parentWidth)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Colors
    const tokenColor = '#e0f2fe'; // Light blue
    const tokenStrokeColor = '#7dd3fc';
    const encoderBgColor = '#f0fdf4'; // Light green
    const encoderStrokeColor = '#86efac';
    const mhaColor = '#ede9fe'; // Light purple
    const ffnColor = '#fef3c7'; // Light yellow
    const addNormColor = '#fee2e2'; // Light red
    const textColor = '#374151'; // Dark gray
    const arrowColor = '#9ca3af'; // Medium gray

    // --- Arrowhead Definition ---
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', arrowColor);

    // --- Input Tokens ---
    const tokenWidth = 70;
    const tokenHeight = 30;
    const tokenPadding = 10;
    const totalTokenWidth = tokens.length * (tokenWidth + tokenPadding) - tokenPadding;
    const tokenStartX = (innerWidth - totalTokenWidth) / 2;
    const tokenY = 0;

    const tokenGroup = svg.append('g').attr('class', 'tokens');
    tokens.forEach((token, i) => {
      const x = tokenStartX + i * (tokenWidth + tokenPadding);
      tokenGroup.append('rect')
        .attr('x', x)
        .attr('y', tokenY)
        .attr('width', tokenWidth)
        .attr('height', tokenHeight)
        .attr('rx', 4)
        .attr('fill', tokenColor)
        .attr('stroke', tokenStrokeColor);
      tokenGroup.append('text')
        .attr('x', x + tokenWidth / 2)
        .attr('y', tokenY + tokenHeight / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', textColor)
        .text(token);
    });

    // --- Encoder Stack ---
    const encoderLayerWidth = innerWidth * 0.8;
    const encoderLayerHeight = 100;
    const encoderLayerSpacingY = 40;
    const encoderStartX = (innerWidth - encoderLayerWidth) / 2;
    let currentY = tokenY + tokenHeight + 50;

    // Connection from Tokens to First Encoder
    if (numLayers > 0) {
        svg.append('path')
            .attr('d', `M${innerWidth / 2} ${tokenY + tokenHeight} L${innerWidth / 2} ${currentY - 10}`)
            .attr('stroke', arrowColor)
            .attr('stroke-width', 1.5)
            .attr('marker-end', 'url(#arrowhead)');
    }

    for (let i = 0; i < numLayers; i++) {
      const layerY = currentY + i * (encoderLayerHeight + encoderLayerSpacingY);
      const layerGroup = svg.append('g')
        .attr('class', `encoder-layer-${i}`)
        .attr('transform', `translate(${encoderStartX}, ${layerY})`);

      // Layer background
      layerGroup.append('rect')
        .attr('width', encoderLayerWidth)
        .attr('height', encoderLayerHeight)
        .attr('rx', 8)
        .attr('fill', encoderBgColor)
        .attr('stroke', encoderStrokeColor);
      layerGroup.append('text')
        .attr('x', 10)
        .attr('y', -8)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', textColor)
        .text(`Encoder Layer ${i + 1}`);

      // Sub-components
      const componentHeight = 35;
      const componentPadding = 10;
      const mhaWidth = encoderLayerWidth * 0.4;
      const addNormWidth = encoderLayerWidth * 0.2;
      const ffnWidth = encoderLayerWidth * 0.4;
      
      const componentY = (encoderLayerHeight - componentHeight) / 2;
      let currentX = componentPadding;

      // 1. Multi-Head Attention
      layerGroup.append('rect')
        .attr('x', currentX)
        .attr('y', componentY)
        .attr('width', mhaWidth)
        .attr('height', componentHeight)
        .attr('rx', 4)
        .attr('fill', mhaColor);
      layerGroup.append('text')
        .attr('x', currentX + mhaWidth / 2)
        .attr('y', componentY + componentHeight / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', textColor)
        .text(`Multi-Head Attention (${numHeads} heads)`);
      currentX += mhaWidth;

      // Arrow
      layerGroup.append('path')
        .attr('d', `M${currentX} ${componentY + componentHeight/2} L${currentX + componentPadding} ${componentY + componentHeight/2}`)
        .attr('stroke', arrowColor)
        .attr('stroke-width', 1.5)
        .attr('marker-end', 'url(#arrowhead)');
      currentX += componentPadding;

      // 2. Add & Norm
      layerGroup.append('rect')
        .attr('x', currentX)
        .attr('y', componentY)
        .attr('width', addNormWidth)
        .attr('height', componentHeight)
        .attr('rx', 4)
        .attr('fill', addNormColor);
      layerGroup.append('text')
        .attr('x', currentX + addNormWidth / 2)
        .attr('y', componentY + componentHeight / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', textColor)
        .text('Add & Norm');
      currentX += addNormWidth;

      // Arrow
      layerGroup.append('path')
      .attr('d', `M${currentX} ${componentY + componentHeight/2} L${currentX + componentPadding} ${componentY + componentHeight/2}`)
        .attr('stroke', arrowColor)
        .attr('stroke-width', 1.5)
        .attr('marker-end', 'url(#arrowhead)');
      currentX += componentPadding;

      // 3. Feed Forward
      layerGroup.append('rect')
        .attr('x', currentX)
        .attr('y', componentY)
        .attr('width', ffnWidth)
        .attr('height', componentHeight)
        .attr('rx', 4)
        .attr('fill', ffnColor);
      layerGroup.append('text')
        .attr('x', currentX + ffnWidth / 2)
        .attr('y', componentY + componentHeight / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', textColor)
        .text('Feed Forward');
      currentX += ffnWidth;
      
      // Arrow
      layerGroup.append('path')
        .attr('d', `M${currentX} ${componentY + componentHeight/2} L${currentX + componentPadding} ${componentY + componentHeight/2}`)
        .attr('stroke', arrowColor)
        .attr('stroke-width', 1.5)
        .attr('marker-end', 'url(#arrowhead)');
      currentX += componentPadding;

      // 4. Add & Norm (Final one, leads out of layer or to next layer's MHA)
      layerGroup.append('rect')
        .attr('x', currentX)
        .attr('y', componentY)
        .attr('width', addNormWidth)
        .attr('height', componentHeight)
        .attr('rx', 4)
        .attr('fill', addNormColor);
      layerGroup.append('text')
        .attr('x', currentX + addNormWidth / 2)
        .attr('y', componentY + componentHeight / 2 + 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', textColor)
        .text('Add & Norm');

      // Inter-layer connection
      if (i < numLayers - 1) {
        svg.append('path')
          .attr('d', `M${encoderStartX + encoderLayerWidth / 2} ${layerY + encoderLayerHeight} 
                       L${encoderStartX + encoderLayerWidth / 2} ${layerY + encoderLayerHeight + encoderLayerSpacingY -10}`)
          .attr('stroke', arrowColor)
          .attr('stroke-width', 1.5)
          .attr('marker-end', 'url(#arrowhead)');
      }
    }
    
    // Adjust SVG height based on content
    const finalHeight = currentY + numLayers * (encoderLayerHeight + encoderLayerSpacingY) + margin.bottom;
    d3.select(svgElement).attr('height', Math.max(height, finalHeight));
    svgElement.setAttribute('viewBox', `0 0 ${parentWidth} ${Math.max(height, finalHeight)}`);

  }, [tokens, config, currentStep, svgRef.current?.parentElement?.clientWidth]); // Add parentWidth to dependency array

  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
      <svg 
        ref={svgRef} 
        className="w-full min-h-[700px]"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
