import { useUIState, useStackProduct } from '../stores/UIState';
import { CardComponent } from './Card';
import { useGameState } from '../stores/GameState';
import { useEffect } from 'react';
import { TASK_LIST, newPuzzle } from '../data/tasks';
import { usePick } from '../stores/util';


function NextButton() {
  const taskSolved = useUIState(state => state.taskSolved)
  const currentTask = useGameState(state => state.currentTask)

  return (
    <>
        <button
      className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
      style={{ left: 800, top: 160, width: 150, height: 60, fontSize: 24 }}
      onClick={() => { TASK_LIST[currentTask].loadTask() }}
    >
      Next
    </button>
    <span
      className="absolute text-green"
      style={{ left: 800, top: 260, width: 150, height: 60, fontSize: 24 }}
    >
      {taskSolved ? 'Solved!' : ''}
    </span>
    </>
  )
}

function PlayedStack() {

}

function FixedStack () {

}

/**
 * Stacks matrices from right to left (reverse of internal representation)
 */
export function MatrixStack() {
  //const gameState = usePick(useGameState, ['newSeed']);

  const stack = useUIState((state) => state.matrixStack);
  const setTaskSolved = useUIState(state => state.setTaskSolved)
  const taskSolved = useUIState(state => state.taskSolved)
  const targetCard = useGameState((state) => state.targetCard);
  const fixedLHS = useGameState(state => state.fixedLHS);
  const currentTask = useGameState(state => state.currentTask); 
  const resultCard = useStackProduct()
  const newSeed = useGameState(state => state.newSeed)

  const maxGap = 180;
  const startX = 480;
  var cardGap = Math.min(startX/(fixedLHS.length+stack.length), maxGap);
  const topY = 300;
  const stackStartX = startX - cardGap * fixedLHS.length;

  targetCard.name = 'Target'
  resultCard.name = 'Result'

  useEffect(() => {
    cardGap = Math.min(startX/(fixedLHS.length+stack.length), maxGap);
    if (!taskSolved && TASK_LIST[currentTask]?.checkSolution 
        && TASK_LIST[currentTask].checkSolution()){
      console.log('SOLVED!')
      setTaskSolved(true);
      newPuzzle()
      console.log(useGameState.getState().seed)
      //gameState.newSeed();
    }
    
  }, [fixedLHS, stack])


  return (
    <>
      <NextButton/>
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

      {/* Equals sign */}
      <div
      style={{ position: 'absolute', left: 680, top: topY+30 }}
      >
      <p className='text-[80px]'>=</p>
      </div>
      {/* Result card */}
      <div
        style={{ position: 'absolute', left: 740, top: topY }}
      >
        <CardComponent card={resultCard} color='#5850b5' fixed/>
      </div>
      {/* Target card */}
      <div
        style={{ position: 'absolute', left: 740, top: topY+250 }}
      >
        <CardComponent card={targetCard} color='#b32d41' fixed/>
      </div>
    </>
  );
}
