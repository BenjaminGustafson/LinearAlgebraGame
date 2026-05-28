import { useUIState } from "../state";


interface GameEntityProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GameEntity({ id, children, className, style }: GameEntityProps) {
  const entity = useUIState(state => state.entities[id]);
  if (!entity) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: entity.x,
        top: entity.y,
        transform: entity.rotation ? `rotate(${entity.rotation}deg)` : undefined,
        zIndex: entity.zIndex ?? 0,
        ...style, // allow overrides
      }}
      className={className}
    >
      {children}
    </div>
  );
}