import { CardComponent, CARD_WIDTH } from "./CardComponent";
import { type Card } from "../types/Card";
import { useUIState } from "../state";
import { tweenPosition, animationHandler } from "../animation";
import { GameEntity } from "./GameEntity";
import { useState } from "react";
import { type DropZone } from "../state/ui/HandSlice";
import { useRef, useEffect } from "react";
import { audioManager } from '../audio/AudioManager';
import { handIndexFromX } from "./Hand";
import { STACK_ZONE } from "./MatrixStack";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseOverRef = useRef(false);

  // Scale up cards on mouse over
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!cardRef.current) return;
      

      const topElement = document.elementFromPoint(e.clientX, e.clientY);
      const isOver = cardRef.current === topElement || cardRef.current.contains(topElement);

      if (isOver && !mouseOverRef.current) {
        mouseOverRef.current = true;
        audioManager.play('click1', {pitch: 6*(Math.random()-0.5), volume:0.5})
        
        animationHandler.playAnimation({
          duration: 100,
          update: (t) => {
            useUIState.getState().setEntityScale(card.id, 1 + 0.25 * t);
          }
        });
        useUIState.getState().setRotation(card.id, 0);
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
    const cardEl = document.getElementById(card.id);
    const entity = useUIState.getState().entities[card.id];
    if (!entity) return;

    audioManager.play('card-slide-1', {pitch: 6*(Math.random()-0.5)})

    useUIState.getState().setDraggedCardId(card.id)

    const startCardX = entity.x;
    const startCardY = entity.y;
    const startCardR = entity.rotation;
    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const onMouseMove = (e: MouseEvent) => {
      const scale = useUIState.getState().scale
      const x = startCardX + (e.clientX - startClientX) / scale;
      const y = startCardY + (e.clientY - startClientY) / scale;
      useUIState.getState().setPosition(card.id, x, y);
      useUIState.getState().setZIndex(card.id,1000);
      
      const cardRect = cardEl?.getBoundingClientRect();
      if (!cardRect) return

      const { x: offsetX, y: offsetY } = useUIState.getState().containerOffset;

      const cardLeft   = (cardRect.left   - offsetX) / scale;
      const cardTop    = (cardRect.top    - offsetY) / scale;
      const cardRight  = (cardRect.right  - offsetX) / scale;
      const cardBottom = (cardRect.bottom - offsetY) / scale;

      if (cardLeft < STACK_ZONE.left + STACK_ZONE.width 
        && cardRight > STACK_ZONE.left 
        && cardTop < STACK_ZONE.top + STACK_ZONE.height
        && cardBottom > STACK_ZONE.top 
      ){
        if (useUIState.getState().dropZone != 'stack'){
          useUIState.getState().setDropZone('stack')
        }
      } else {
        if (useUIState.getState().dropZone != 'hand')
          useUIState.getState().setDropZone('hand')
      }

      if (useUIState.getState().dropZone == 'hand'){
        const x = useUIState.getState().entities[card.id].x
        const i = handIndexFromX(x, useUIState.getState().hand.length)
        const oldI = useUIState.getState().hand.findIndex(c => c.id === card.id)
        if (oldI !== i){
          useUIState.getState().insertCardToHand(card, i);
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      useUIState.getState().setDraggedCardId(null)
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    
      const scale = useUIState.getState().scale
      const x = startCardX + (e.clientX - startClientX) / scale;
      const y = startCardY + (e.clientY - startClientY) / scale;
    
      // TODO: the logic here is just, if something changes drop zone move it from one to the other
      // So really what we need is a unified uiState function that moves a card from one drop zone to another
      switch (useUIState.getState().dropZone) {
        case 'stack':
          if (origin == 'hand'){
            useUIState.getState().playCard(card);
            useUIState.getState().setEntityScale(card.id, 1);
          }else if (origin == 'stack'){
            
          }
          break
        case 'hand':
          if (origin == 'stack'){
            useUIState.getState().removeCardFromStack(card)
          }else if (origin == 'hand'){

          }
          const x = useUIState.getState().entities[card.id].x
          const i = handIndexFromX(x, useUIState.getState().hand.length)
          useUIState.getState().insertCardToHand(card, i);
          break
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <>
    <div onMouseDown={onMouseDown}
         ref={cardRef}
         className="no-cursor-change"
         style={{userSelect: 'none',  cursor: 'grab' }}
    >
      <CardComponent card={card} />
    </div>
    </>
  );
}

