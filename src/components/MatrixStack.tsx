import { useUIState } from '../stores/UIState';
import { CardComponent } from './Card';
import { useGameState } from '../stores/GameState';

/**
 * Stacks matrices from right to left (reverse of internal representation)
 */
export function MatrixStack() {
  const stack = useUIState((state) => state.matrixStack);
  const targetCard = useGameState((state) => state.targetCard);

  const cardGap = 116;
  const startX = 1000;

  return (
    <>
      {stack.map((card, i) => {
        const x = startX - i * (cardGap);
        return (
          <div
            style={{ position: 'absolute', left: x, top: 120 }}
          >
            <CardComponent card={card} />
          </div>
        );
      })}
      <div
      style={{ position: 'absolute', left: 1120, top: 100 }}
      >
      <p className='text-[80px]'>=</p>
      </div>
      <div
        style={{ position: 'absolute', left: 1200, top: 120 }}
      >
        <CardComponent card={targetCard} />
      </div>
    </>
  );
}
