import { useUIState, useStackProduct } from '../stores/UIState';
import { CardComponent } from './Card';
import { useGameState } from '../stores/GameState';

/**
 * Stacks matrices from right to left (reverse of internal representation)
 */
export function MatrixStack() {
  const stack = useUIState((state) => state.matrixStack);
  const fixedLHS = useGameState(state => state.fixedLHS);
  const targetCard = useGameState((state) => state.targetCard);
  const showResultNotTarget = useUIState( state => state.showResultNotTarget)
  const resultCard = useStackProduct()

  const cardGap = 180;
  const startX = 480;
  const topY = 400;
  const stackStartX = startX - cardGap * fixedLHS.length;

  return (
    <>
      {fixedLHS.map((card, i) => {
        const x = startX - i * (cardGap);
        return (
          <div
            style={{ position: 'absolute', left: x, top: topY }}
          >
            <CardComponent card={card} fixed />
          </div>
        );
      })}

      {stack.map((card, i) => {
        const x = stackStartX - i * (cardGap);
        return (
          <div
            style={{ position: 'absolute', left: x, top: topY }}
          >
            <CardComponent card={card} />
          </div>
        );
      })}

      {/* RHS Fixed target/result matrix */}
      <div
      style={{ position: 'absolute', left: 680, top: topY+30 }}
      >
      <p className='text-[80px]'>=</p>
      </div>
      <div
        style={{ position: 'absolute', left: 740, top: topY }}
      >
        <CardComponent card={showResultNotTarget ? resultCard : targetCard} fixed/>
      </div>
    </>
  );
}
