
interface GameObjectProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function GameObject({ id, children, className, style }: GameObjectProps) {
  const entity = useGameStore(state => state.entities[id]);
  if (!entity) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: entity.x,
        top: entity.y,
        ...style, // allow overrides
      }}
      className={className}
    >
      {children}
    </div>
  );
}