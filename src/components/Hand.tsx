import { useUIState } from '../state/ui/UIState.tsx';
import { CardComponent } from './CardComponent.tsx';
import type { Card } from '../types/Card.tsx'
import { useState, useMemo, useEffect } from 'react';
import { tweenPosition, animationHandler } from '../animation'
import { DraggableCard } from './DraggableCard.tsx';
import { CARD_WIDTH } from './CardComponent.tsx';
import { priorityAnim } from '../animation/Tween.tsx';

// Max space for the hand
const MAX_HAND_WIDTH = 800;
// Max distance btw cards
const MAX_STEP = CARD_WIDTH - 8;
// Dist btw cards
const START_Y = 850;
// Maximum degrees of rotation 
const MAX_ROTATION = 8;
// Pixels of arc
const ARC_DEPTH = 20;


function calcHandPosition (handLength: number){
  const step = handLength > 1 ? Math.min(MAX_STEP, MAX_HAND_WIDTH / (handLength - 1)) : 0;
  const totalWidth = handLength > 1 ? step * (handLength - 1) : CARD_WIDTH;
  const startX = (1920 - totalWidth - CARD_WIDTH) / 2;
  return {step, startX}
}

export function positionInHand(index: number, handLength: number) {
  const {step, startX} = calcHandPosition(handLength)
  const centerIndex = (handLength - 1) / 2;
  const t = handLength > 1 ? (index - centerIndex) / centerIndex : 0;

  return {
    x: startX + index * step,
    y: START_Y + t * t * ARC_DEPTH,
    rotation: t * MAX_ROTATION,
  };
}

export function handIndexFromX(x: number, handLength: number): number {
  const {step, startX} = calcHandPosition(handLength)

  return Math.max(0, Math.min(handLength - 1, Math.round((x - startX) / step)));
}

/**
 * Sets the position of the cards in the hand 
 */
export function Hand() {
  const hand = useUIState((state) => state.hand);
  const handLayout = useUIState((state) => state.handLayout)
  const draggedCardId = useUIState((state) => state.draggedCardId);
  const hoveredCardId = useUIState((state) => state.hoveredCardId)

  useEffect(() => {
    hand.forEach((card, i) => {
      if (card.id === draggedCardId) return;
      var { x, y, rotation } = positionInHand(i, hand.length);

      if (card.id === hoveredCardId) {
        y = START_Y
        useUIState.getState().setRotation(card.id, 0)
        rotation = 0
        useUIState.getState().setZIndex(card.id, 1000)
      }else {
        useUIState.getState().setZIndex(card.id, 100+i)
      }

      animationHandler.playAnimation(
        priorityAnim(
          tweenPosition({ id: card.id, toX: x, toY: y, duration: 100, toR: rotation }),
          card.id
        ),
        card.id
      )
    });
  }, [hand, hoveredCardId]);

  return (
    <>
      {hand.map((card) => (
        <DraggableCard key={card.id} card={card} origin="hand" />
      ))}
    </>
  );
}