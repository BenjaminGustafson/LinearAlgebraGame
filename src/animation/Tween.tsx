import { useUIState } from "../state";
import { type Animation, animationHandler } from "./AnimationHandler";


export function tweenPosition({id, toX, toY, duration, toR=0}:
  {id: string, toX: number, toY: number, duration: number, toR?:number}
): Animation {
  const entity = useUIState.getState().entities[id];
  if (!entity) return {duration: 0, update: ()=>{}}
    
  const startX = entity.x;
  const startY = entity.y;
  const startR = entity.rotation;

  const update = (t: number) => {
    const eased = t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t;
    useUIState.getState().setPosition(
      id,
      startX + (toX - startX) * eased,
      startY + (toY - startY) * eased,
    );
    useUIState.getState().setRotation(
      id,
      startR + (toR - startR) * eased,
    );
  }

  return {
    duration,
    update
  }
}