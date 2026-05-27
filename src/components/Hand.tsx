import { useUIState } from '../state/ui/UIState.tsx';
import { CardComponent } from './CardComponent.tsx';
import type { Card } from '../types/Card.tsx'
import { useState, useMemo, useEffect } from 'react';

/**
 * Drag and drop cards
 * 
 * Card is picked up:
 * - its z value comes to the top
 * - its size is increased
 * - a hard-edged drop shadow is drawn
 * - its rotation is proportional to the x-velocity (moving to the right means rotated clockwise)
 * - its position follows the mouse but does not exceed a maximum velocity
 * 
 * Card is dropped:
 * - there is a default drop zone that handles if the card is not dropped over any of the other zones
 * - the drop zone is responsible for assigning a new home to the card
 *    when the card is dropped it moves quickly to its home position
 * - the receiving drop zone handles what happens when it gets a card. (e.g. it adds it to a stack, deletes it, etc.)
 * 
 * Components:
 * Draggable wraps components that can be dragged, in our case the only thing we drag are cards
 * - Draggable keeps track of the offset where the card was picked up
 * 
 * Physical wraps components that move with velocity. only cards in our case
 * - Physical components are told where to go, x,y,rotation, but they decide how they get there
 * - Once they arrive at desired location, they stay fixed in place. I.e. they keep track of whether they are in an animation or not
 * - Draggable interacts with physical by saying go to the mouse location
 * - Physical handles x,y,rotation, and the velocity of all of these values
 * 
 * Droppable wraps components that have drop zones
 * - In our case we have the hand (default zone) and the stack, in the future we might have a trash can
 * - 
 * 
 * DragAndDropHandler wraps all droppable components
 * - This is so that Draggable objects can tell the handler that they are being dropped, and the handler
 * can relay that message to the appropriate drop object
 * 
 * The Hand:
 * - default drop zone
 * - cards can be reordered
 * - while a card is held over the drop zone (not over the stack), a gap appears in the hand where the card would go if it is dropped,
 *     based on the x-value of the card. when the dragged card moves from index i to i+1, we move the current card at i+1 to i, and likewise for moving left
 * - cards are arranged in the hand according to a slight curve, so that they fan out
 *    the hand has a center and a maximum width. in pixels the curve is given by an equation like -curve_height(x_dist_from_center/max_width)^2
 *    then the rotation of the cards is set to the 
 * 
 * The Stack:
 * - has a limited drop zone
 * - if a card is dropped over the zone, it goes on top of the stack
 * - only the top card of the stack is draggable, the stack cannot be reordered
 *  
 */

function DraggableCard({ card, x, y, rotation, onDragStart, isAnyDragging }: {
  card: Card;
  x: number;
  y: number;
  rotation: number;
  onDragStart: (id: number, clientX: number, clientY: number) => void;
  isAnyDragging: boolean;
}) {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    transform: `rotate(${rotation}deg)`,
    transition: isAnyDragging
      ? 'left 0.15s ease, top 0.15s ease'
      : 'left 0.15s ease, top 0.15s ease, transform 0.3s ease',
    cursor: 'grab',
    transformOrigin: 'bottom center',
    zIndex: 1000,
  };

  return (
    <div
      style={style}
      onPointerDown={(e) => {
        e.preventDefault();
        onDragStart(card.id, e.clientX, e.clientY);
      }}
    >
      <CardComponent card={card} hidden={false} fixed={false} />
    </div>
  );
}

export function Hand() {
  const hand = useUIState((state) => state.hand);
  const playCard = useUIState((state) => state.playCard);
  const reorderHand = useUIState((state) => state.reorderHand);
  const scale = useUIState((state) => state.scale);

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

  const [dragging, setDragging] = useState<{
    id: number;
    index: number;
    x: number;
    y: number;
    startClientX: number;
    startClientY: number;
    startCardX: number;
    startCardY: number;
  } | null>(null);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const displayOrder = useMemo(() => {
    if (dragging === null || hoverIndex === null) return hand.map((_, i) => i);
    const indices = hand.map((_, i) => i);
    const [dragged] = indices.splice(dragging.index, 1);
    indices.splice(hoverIndex, 0, dragged);
    return indices;
  }, [hand.length, dragging?.index, hoverIndex]);

  function handleDragStart(id: number, clientX: number, clientY: number) {
    const index = hand.findIndex((c) => c.id === id);
    const t = hand.length > 1 ? (index - centerIndex) / centerIndex : 0;
    const cardX = startX + index * step;
    const cardY = startY + t * t * arcDepth;
    setDragging({ id, index, x: clientX, y: clientY, startClientX: clientX, startClientY: clientY, startCardX: cardX, startCardY: cardY });
    setHoverIndex(index);
  }

  useEffect(() => {
    if (!dragging) return;

    function onPointerMove(e: PointerEvent) {
      setDragging((d) => d ? { ...d, x: e.clientX, y: e.clientY } : null);

      const gameX = e.clientX / scale;
      const newHoverIndex = hand.reduce((closest, _, i) => {
        const displayIndex = displayOrder.indexOf(i);
        const cardCenterX = startX + displayIndex * step + cardWidth / 2;
        const dist = Math.abs(gameX - cardCenterX);
        return dist < closest.dist ? { index: i, dist } : closest;
      }, { index: dragging.index, dist: Infinity }).index;

      setHoverIndex(newHoverIndex);
    }

    function onPointerUp(e: PointerEvent) {
      const dx = e.clientX - dragging.startClientX;
      const dy = e.clientY - dragging.startClientY;
      const moved = Math.sqrt(dx * dx + dy * dy) > 8;

      if (moved && hoverIndex !== null && hoverIndex !== dragging.index) {
        reorderHand(dragging.index, hoverIndex);
      } else if (!moved) {
        const index = hand.findIndex((c) => c.id === dragging.id);
        playCard(index);
      }

      setDragging(null);
      setHoverIndex(null);
    }

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [dragging, hoverIndex, scale]);

  return (
    <>
      {displayOrder.map((originalIndex, displayIndex) => {
        const card = hand[originalIndex];
        const t = hand.length > 1 ? (displayIndex - centerIndex) / centerIndex : 0;
        const isDragging = dragging?.id === card.id;

        const x = isDragging
          ? dragging.startCardX + (dragging.x - dragging.startClientX) / scale
          : startX + displayIndex * step;
        const y = isDragging
          ? dragging.startCardY + (dragging.y - dragging.startClientY) / scale
          : startY + t * t * arcDepth;
        const rotation = isDragging ? 0 : t * maxRotation;

        return (
          <DraggableCard
            key={card.id}
            card={card}
            x={x}
            y={y}
            rotation={rotation}
            onDragStart={handleDragStart}
            isAnyDragging={dragging !== null}
          />
        );
      })}
    </>
  );
}