import { useUIState } from "../state";

export function GameEntity({ id, children }: { id: string; children: React.ReactNode }) {
  const entity = useUIState(state => state.entities[id]);
  if (!entity) return null;

  return (
    <div style={{
      position: 'absolute',
      left: entity.x - entity.width / 2,
      top: entity.y - entity.height / 2,
      width: entity.width,
      height: entity.height,
      transform: entity.rotation ? `rotate(${entity.rotation}deg)` : undefined,
      zIndex: entity.zIndex ?? 0,
    }}>
      {children}
    </div>
  );
}