import { useUIStore } from '../stores/UIStore';
import { CardComponent } from './Card';

/**
 * Stacks matrices from right to left (reverse of internal representation)
 */
export function MatrixStack() {
    const stack = useUIStore((state) => state.matrixStack);
  
    const cardWidth = 100;// TODO magic number
    const cardGap = 16;
    const startX = 1000;
  
    return (
      <>
        {stack.map((card, i) => {
          const x = startX - i * (cardWidth + cardGap);
          return (
            <div
              key={card.id}
              style={{ position: 'absolute', left: x, top: 120 }}
            >
              <CardComponent card={card} />
            </div>
          );
        })}
      </>
    );
  }
  