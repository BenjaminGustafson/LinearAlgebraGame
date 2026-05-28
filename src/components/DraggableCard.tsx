import { CardComponent } from "./CardComponent";
import { type Card } from "../types/Card";
import { useUIState } from "../state";
import { tweenPosition } from "../animation";

export function DraggableCard({ card, index }: { card: Card; index: number }) {
  const scale = useUIState(state => state.scale);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const entity = useUIState.getState().entities['card' + card.id];
    if (!entity) return;

    const startCardX = entity.x;
    const startCardY = entity.y;
    const startClientX = e.clientX;
    const startClientY = e.clientY;

    const onMouseMove = (e: MouseEvent) => {
      const x = startCardX + (e.clientX - startClientX) / scale;
      const y = startCardY + (e.clientY - startClientY) / scale;
      useUIState.getState().setPosition('card' + card.id, x, y);
    };

    const onMouseUp = (e: MouseEvent) => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    
      const x = startCardX + (e.clientX - startClientX) / scale;
      const y = startCardY + (e.clientY - startClientY) / scale;
    
      // Drop card on stack
      if (x >= 0 && x <= 500 && y >= 300 && y <= 500) {
        useUIState.getState().playCard(index);
      }
      // Return card to hand
      else {
        tweenPosition('card' + card.id, startCardX, startCardY, 200);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div onMouseDown={onMouseDown} style={{ cursor: 'grab' }}>
      <CardComponent card={card} />
    </div>
  );
}