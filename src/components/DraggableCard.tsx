import { CardComponent } from "./CardComponent";
import { type Card } from "../types/Card";
import { useUIState } from "../state";
import { tweenPosition, animationHandler } from "../animation";
import { GameEntity } from "./GameEntity";
import { useState } from "react";

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
export function DraggableCard({ card }: { card: Card }) {
  const scale = useUIState(state => state.scale);
  const hand = useUIState(state => state.hand)
  const insertCardToHand = useUIState(state => state.insertCardToHand)
  const setDraggedCardId = useUIState(state => state.setDraggedCardId)
  const entities = useUIState(state => state.entities)
  const removeCardFromHand = useUIState(state => state.removeCardFromHand)

  const [overStack, setOverStack] = useState(false)

  // mouse over brings card forward

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
    <div onMouseDown={onMouseDown} style={{ cursor: 'grab' }}>
      <CardComponent card={card} />
    </div>
    </>
  );
}

