import { useUIState } from '../state/ui/UIState.tsx';
import { CardComponent } from './CardComponent.tsx';
import type { Card } from '../types/Card.tsx'
import { useState, useMemo, useEffect } from 'react';

/**
 * Sets the position of the cards in the hand 
 */
export function Hand() {
  const hand = useUIState((state) => state.hand);

  const cardWidth = 200;
  // Max space for the hand
  const maxWidth = 800;
  // Max distance btw cards
  const maxStep = cardWidth - 8;
  // Dist btw cards
  const step = hand.length > 1 ? Math.min(maxStep, maxWidth / (hand.length - 1)) : 0;
  // Actual width of hand
  const totalWidth = hand.length > 1 ? step * (hand.length - 1) : cardWidth;
  // Position hand in middle of screen
  const startX = (1920 - totalWidth) / 2;
  const startY = 860;
  // Maximum degree of rotation 
  const maxRotation = 8;
  // Pixels of arc
  const arcDepth = 20;
  

  useEffect(() => {
    hand.forEach((card, i) => {
      const centerIndex = (hand.length-1) / 2;
      // parameter t in [-1,1] with t=0 at centerIndex
      const t = hand.length > 1 ? (i - centerIndex) / centerIndex : 0;
      const x = startX + i * step;
      const y = startY + t * t * arcDepth;
      const rotation = t*maxRotation;
      // instant for now, tween later
      useUIState.getState().setPosition('card' + card.id, x, y);
      useUIState.getState().setRotation('card' + card.id, rotation)
    });
  }, [hand]);

  return (
    <>
      {hand.map(card => (
        <CardComponent key={card.id} card={card} />
      ))}
    </>
  );
}