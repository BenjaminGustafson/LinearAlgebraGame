import { useUIState } from "../state";
import { animationQueue } from "./AnimationQueue";


export function tweenPosition(id: string, toX: number, toY: number, duration: number): void {
  const entity = useUIState.getState().entities[id];
  if (!entity) return
    
  const startX = entity.x;
  const startY = entity.y;

  const update = (t: number) => {
    const eased = t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t;
    useUIState.getState().setPosition(
      id,
      startX + (toX - startX) * eased,
      startY 
      + (toY - startY) * eased,
    );
  }

  animationQueue.enqueue({
    duration,
    update
  })
}