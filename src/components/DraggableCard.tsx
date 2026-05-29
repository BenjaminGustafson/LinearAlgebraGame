import { CardComponent, CARD_WIDTH } from "./CardComponent";
import { type Card } from "../types/Card";
import { useUIState } from "../state";
import { tweenPosition, animationHandler } from "../animation";
import { GameEntity } from "./GameEntity";
import { useState } from "react";
import { type DropZone } from "../state/ui/HandSlice";
import { useRef, useEffect } from "react";
import { audioManager } from '../audio/AudioManager';

/**
 * 
 * Desired behavior:
 * 
 * - When a card is picked up, its rotation smoothly goes to zero.
 * 
 * - When a card is dropped over the hand, it goes in between cards according to
 *  x value of the center of the cards
 * 
 * - 
 * 
 */
export function DraggableCard({ card, origin }: { card: Card, origin: DropZone }) {
  const scale = useUIState(state => state.scale);
  const hand = useUIState(state => state.hand)
  const insertCardToHand = useUIState(state => state.insertCardToHand)
  const setDraggedCardId = useUIState(state => state.setDraggedCardId)
  const entities = useUIState(state => state.entities)

  const cardRef = useRef<HTMLDivElement>(null);
  const mouseOverRef = useRef(false);

  // Scale up cards on mouse over
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;

      const topElement = document.elementFromPoint(e.clientX, e.clientY);
      const isOver = cardRef.current === topElement || cardRef.current.contains(topElement);

      if (isOver && !mouseOverRef.current) {
        mouseOverRef.current = true;
        audioManager.play('click1', {pitch: 6*(Math.random()-0.5)})
        
        animationHandler.playAnimation({
          duration: 100,
          update: (t) => {
            useUIState.getState().setEntityScale(card.id, 1 + 0.25 * t);
          }
        });
        useUIState.getState().setZIndex(card.id, 1000);
      } else if (!isOver && mouseOverRef.current) {
        mouseOverRef.current = false;
        animationHandler.playAnimation({
          duration: 100,
          update: (t) => {
            useUIState.getState().setEntityScale(card.id, 1 + 0.25 * (1-t));
          }
        });
        useUIState.getState().setZIndex(card.id, 100);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const entity = useUIState.getState().entities[card.id];
    if (!entity) return;

    setDraggedCardId(card.id)

    const startCardX = entity.x;
    const startCardY = entity.y;
    const startCardR = entity.rotation;
    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const onMouseMove = (e: MouseEvent) => {
      const x = startCardX + (e.clientX - startClientX) / scale;
      const y = startCardY + (e.clientY - startClientY) / scale;
      useUIState.getState().setPosition(card.id, x, y);
      useUIState.getState().setZIndex(card.id,1000);

      setOverStack(x >= 0 && x <= 500 && y >= 300 && y <= 500)
      if (overStack){
        // Highlight drop region
      }else {
        for (let i = 0; i < hand.length; i++){
          const card = hand[i]
          const entity = entities[card.id]
          if (entity.x+100 < x){
            insertCardToHand(card, i)
            break
          }
        }
      }

    };

    const onMouseUp = (e: MouseEvent) => {
      setDraggedCardId(null)
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    
      const x = startCardX + (e.clientX - startClientX) / scale;
      const y = startCardY + (e.clientY - startClientY) / scale;
    
      // Drop card on stack
      if (overStack) {
        useUIState.getState().playCard(card);
      }
      // Return card to hand
      else {
        animationHandler.playAnimation(
          tweenPosition({id:card.id, toX:startCardX, toY:startCardY, toR:startCardR, duration:200}));
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <>
    <div onMouseDown={onMouseDown}
         ref={cardRef}
         style={{ cursor: 'grab' }}
    >
      <CardComponent card={card} />
    </div>
    </>
  );
}

