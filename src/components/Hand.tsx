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
  const maxWidth = 800;
  const maxStep = cardWidth - 8;
  const step = hand.length > 1 ? Math.min(maxStep, maxWidth / (hand.length - 1)) : 0;
  const totalWidth = hand.length > 1 ? step * (hand.length - 1) : cardWidth;
  const startX = (1920 - totalWidth) / 2;
  const startY = 860;
  const maxRotation = 8;
  const arcDepth = 20;
  const centerIndex = (hand.length - 1) / 2;

  useEffect(() => {
    hand.forEach((card, displayIndex) => {
      const t = hand.length > 1 ? (displayIndex - centerIndex) / centerIndex : 0;
      const x = startX + displayIndex * step;
      const y = startY + t * t * arcDepth;
      // instant for now, tween later
      useUIState.getState().setPosition('card' + card.id, x, y);
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