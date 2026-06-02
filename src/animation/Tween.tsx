import { useUIState } from "../state";
import { type Animation, animationHandler } from "./AnimationHandler";


/**
 * 
 * Releases noInput on animation finish
 */
export function priorityAnim(anim:Animation, id:string):Animation{
  return {
    duration: anim.duration,
    update: (t) =>{
      anim.update(t)
      if (t >= 1){
        useUIState.getState().setFreezeTransform(id, false)
      }
    }
  }
}

export function tweenPosition({id, toX, toY, duration, toR=0}:
  {id: string, toX: number, toY: number, duration: number, toR?:number}
): Animation {
  const entity = useUIState.getState().entities[id];
  if (!entity) return {duration: 0, update: ()=>{}}
    
  const startX = entity.x;
  const startY = entity.y;
  const startR = entity.rotation;

  if (startX == toX && startY == toY && startR == toR){
    return {duration: 0, update: ()=>{}}
  }

  const update = (t: number) => {
    const eased = t < 0.5 ? 2*t*t : -1 + (4 - 2*t) * t;
    const x = startX + (toX - startX) * eased
    const y = startY + (toY - startY) * eased
    useUIState.getState().setPosition(id,x,y)
    useUIState.getState().setRotation(id,startR + (toR - startR) * eased);
  }

  return {
    duration,
    update
  }
}