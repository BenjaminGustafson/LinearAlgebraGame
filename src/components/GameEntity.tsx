import { useUIState } from "../state";

export function GameEntity({ id, children }: { id: string; children: React.ReactNode }) {
  const entity = useUIState(state => state.entities[id]);
  if (!entity) return null;

  return (
    <div style={{
      position: 'absolute',
      left: entity.x,
      top: entity.y,
      transform: `rotate(${entity.rotation}deg) scale(${entity.scale})`,
      zIndex: entity.zIndex ?? 0,
    }}>
      {children}
    </div>
  );
}