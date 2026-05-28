import { useUIState } from "../state";

export function GameEntity({ id, children, className, style }: {
  id: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const entity = useUIState(state => state.entities[id]);
  if (!entity) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: entity.x,
        top: entity.y,
        transform: `rotate(${entity.rotation}deg)`,
        zIndex: entity.zIndex ?? 0,
        ...style, // allow overrides
      }}
      className={className}
    >
      {children}
    </div>
  );
}