import { CardComponent, spawnCardEntity } from './CardComponent';
import { useEffect } from 'react';
import { TASK_LIST, newPuzzle } from '../data/tasks';
import { usePick, useGameState, useUIState, useStackProduct } from '../state/';
import { tweenPosition, animationHandler } from '../animation';
import { DraggableCard } from './DraggableCard';

function NextButton() {
  const taskSolved = useUIState(state => state.taskSolved)
  const currentTask = useGameState(state => state.currentTask)
  return (
    <>
      <button
        className={`absolute text-white rounded-lg ${
          taskSolved
            ? 'bg-blue-600 hover:bg-blue-500'
            : 'bg-gray-400'
        }`}
        style={{ left: 800, top: 160, width: 150, height: 60, fontSize: 24 }}
        onClick={() => { if (taskSolved) TASK_LIST[currentTask].loadTask() }}
        disabled={!taskSolved}
      >
        Next
      </button>
      <span
        className="absolute"
        style={{ left: 800, top: 240, width: 150, height: 60, fontSize: 32 }}
      >
        {taskSolved ? 'Solved!' : ''}
      </span>
    </>
  )
}


/**
 * Stacks matrices from right to left (reverse of internal representation)
 */
export function MatrixStack() {
  const stack = useUIState((state) => state.matrixStack);
  const setTaskSolved = useUIState(state => state.setTaskSolved);
  const taskSolved = useUIState(state => state.taskSolved);
  const targetCard = useGameState((state) => state.targetCard);
  const fixedLHS = useGameState(state => state.fixedLHS);
  const currentTask = useGameState(state => state.currentTask);
  const resultCard = useStackProduct();
  const incrementTask = useGameState(state => state.incrementTask);
  const dropZone = useUIState(state => state.dropZone);

  // Max distance between cards
  const maxGap = 180;
  // Rightmost x of the cards
  const startX = 480;
  // Y position of the stack
  const topY = 300;

  // Position the stack cards
  useEffect(() => {
    if (!taskSolved && TASK_LIST[currentTask]?.checkSolution
      && TASK_LIST[currentTask].checkSolution()) {
      incrementTask(currentTask);
      setTaskSolved(true);
      newPuzzle();
    }
    // Distance between cards
    const cardGap = Math.min(startX / (fixedLHS.length + stack.length || 1), maxGap);
    // Rightmost x of the stack cards
    const stackStartX = startX - cardGap * fixedLHS.length;

    stack.forEach((card, i) => {
      animationHandler.playAnimation(
        tweenPosition({ id: card.id, toX: stackStartX - i * cardGap, toY: topY, duration: 300 })
      );
    });
    fixedLHS.forEach((card, i) => {
      animationHandler.playAnimation(
        tweenPosition({ id: card.id, toX: startX - i * cardGap, toY: topY, duration: 300 })
      );
    });
  }, [fixedLHS, stack]);

  // Spawn and position the result card
  useEffect(() => {
    spawnCardEntity(resultCard, 740, 300);
  }, [resultCard]);

  // Spawn and position the target card
  useEffect(() => {
    spawnCardEntity(targetCard, 740, 550);
  }, [targetCard]);

  const topStackCard = stack[stack.length - 1];

  return (
    <>
      <NextButton />

      {/* Drop zone */}
      <div style={{
        position: 'absolute',
        left: 0, top: 300, width: 500, height: 200,
        backgroundColor: dropZone == 'stack' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        transition: 'background-color 0.1s',
        pointerEvents: 'none',
      }} />

      {/* Stack of cards */}
      {fixedLHS.map((card) => (
        <CardComponent key={card.id} card={card} fixed />
      ))}

      {stack.map((card) => (
        card.id === topStackCard?.id
          ? <DraggableCard key={card.id} card={card} origin="stack" />
          : <CardComponent key={card.id} card={card} fixed />
      ))}

      {/* Equals sign */}
      <div style={{ position: 'absolute', left: 680, top: topY + 30 }}>
        <p className='text-[80px]'>=</p>
      </div>

      {/* Result and target */}
      <CardComponent card={resultCard} color='#5850b5' fixed />
      <CardComponent card={targetCard} color='#b32d41' fixed />
    </>
  );
}