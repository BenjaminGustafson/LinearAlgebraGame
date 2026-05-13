import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useUIState } from '../stores/UIState';
import { CardComponent } from './CardComponent.tsx';
import { useState, useMemo, useRef } from 'react';
import type { Card } from '../types/Card.tsx'

function SortableCard({ card, onPlay }: { card: Card; onPlay: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onPlay}>
      <CardComponent card={card} hidden={false} fixed={false} />
    </div>
  );
}
export function Hand() {
  const hand = useUIState((state) => state.hand);
  const playCard = useUIState((state) => state.playCard);
  const reorderHand = useUIState((state) => state.reorderHand);

  const cardWidth = 200;
  const cardGap = 16;
  const totalWidth = hand.length * cardWidth + (hand.length - 1) * cardGap;
  const startX = (1920 - totalWidth) / 2;
  const startY = 860;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = hand.findIndex((c) => c.id === active.id);
    const toIndex = hand.findIndex((c) => c.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      reorderHand(fromIndex, toIndex);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={hand.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
        <div style={{ position: 'absolute', left: startX, top: startY, display: 'flex', gap: cardGap }}>
          {hand.map((card, index) => (
            <SortableCard key={card.id} card={card} onPlay={() => playCard(index)} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}