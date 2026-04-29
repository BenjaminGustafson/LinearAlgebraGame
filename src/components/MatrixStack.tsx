import { useUIState, useStackProduct } from '../stores/UIState';
import { CardComponent } from './Card';
import { useGameState } from '../stores/GameState';
import { useEffect } from 'react';

/**
 * Stacks matrices from right to left (reverse of internal representation)
 */
export function MatrixStack() {
  const stack = useUIState((state) => state.matrixStack);
  const fixedLHS = useGameState(state => state.fixedLHS);
  const targetCard = useGameState((state) => state.targetCard);
  const showResultNotTarget = useUIState( state => state.showResultNotTarget)
  const resultCard = useStackProduct()

  const maxGap = 180;
  const startX = 480;
  var cardGap = Math.min(startX/(fixedLHS.length+stack.length), maxGap);
  const topY = 300;
  const stackStartX = startX - cardGap * fixedLHS.length;

  targetCard.name = 'Target'
  resultCard.name = 'Result'

  useEffect(() => {
    cardGap = Math.min(startX/(fixedLHS.length+stack.length), maxGap);
  }, [fixedLHS, stack])


  return (
    <>
      {
      fixedLHS.map((card, i) => {
        const x = startX - i * (cardGap)
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
        <CardComponent card={resultCard} color='#5850b5' fixed/>
      </div>

      <div
        style={{ position: 'absolute', left: 740, top: topY+250 }}
      >
        <CardComponent card={targetCard} color='#b32d41' fixed/>
      </div>
    </>
  );
}
