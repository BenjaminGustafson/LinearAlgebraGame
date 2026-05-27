import { useEffect, useRef, useState } from 'react';
import { useUIState, useStackProduct } from './state/ui/UIState';
import { DesmosGraph } from './components/DesmosGraph';
import { MatrixStack } from './components/MatrixStack';
import { Hand } from './components/Hand';
import MatrixBuilder from './components/MatrixBuilder';
import { useGameState } from './state/game/GameState';
import { ToggleButton } from './components/ToggleButton';
import {TaskMenu, checkTaskUnlocks} from './components/TaskMenu';
import { TASK_LIST } from './data/tasks';

function App() {
  const addCardToHand = useUIState((state) => state.addCardToHand);
  const addCardToStack = useUIState((state) => state.addCardToStack);
  const popStack = useUIState((state) => state.popStack);
  const toggleMatrixBuilder = useUIState((state) => state.toggleMatrixBuilder);
  const setFixedLHS = useGameState(state => state.setFixedLHS);
  const toggleSimplify = useUIState(state => state.toggleSimplify);
  const toggleResultTarget = useUIState(state => state.toggleResultTarget);
  const toggleTaskMenu = useUIState(state => state.toggleTaskMenu)
  const currentTask = useGameState(state => state.currentTask); 
  const seed = useGameState(state => state.seed);

  useEffect(()=>{
    if (TASK_LIST[currentTask] && TASK_LIST[currentTask].loadTask)
      TASK_LIST[currentTask].loadTask(seed)
  }, [])



  return (
    <ScaledGameContainer>
      <Hand />
      <MatrixStack />
      
      <div className="absolute text-white text-[48px]" style={{ left: 400, top: 20 }}>
        Skewbert's Matrix Factory
      </div>
      <button
        className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        style={{ left: 100, top: 120, width: 100, height: 60, fontSize: 24 }}
        onClick={() => popStack()}
      >
        Undo
      </button>
      <button
        className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        style={{ left: 1700, top: 900, width: 150, height: 150, fontSize: 24 }}
        onClick={() => { toggleMatrixBuilder() }}
      >
        New Matrix
      </button>
      <button
        className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        style={{ left: 100, top: 900, width: 150, height: 150, fontSize: 24 }}
        onClick={() => { }}
      >
        Matrix Library
      </button>
      <button
        className="absolute bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        style={{ left: 100, top: 50, width: 150, height: 60, fontSize: 24 }}
        onClick={() => { toggleTaskMenu(); checkTaskUnlocks() }}
      >
        Task List
      </button>
      <span
        className="absolute text-green"
        style={{ left: 100, top: 20, fontSize: 24 }}
      >
        Current task : {currentTask+1}. {TASK_LIST[currentTask].title}
      </span>
      
      <div className="absolute"
        style={{ left: 250, top: 150 }}>
          <ToggleButton
            label="Simplify"
            onChange={ () => { toggleSimplify() }}
          />
      </div>

      <DesmosGraph />
      <MatrixBuilder/>
      <TaskMenu />
    </ScaledGameContainer>
  );
}

/**
 * The game has a fixed 16:9 ratio
 */
function ScaledGameContainer({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useUIState((state) => state.scale);
  const setScale = useUIState((state) => state.setScale);

  useEffect(() => {
    const update = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale(Math.min(scaleX, scaleY));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-600 flex items-center justify-center overflow-hidden">
      <div
        ref={containerRef}
        style={{ width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: 'center', flexShrink: 0 }}
        className="bg-gray-500"
      >
        {children}
      </div>
    </div>
  );
}


export default App;