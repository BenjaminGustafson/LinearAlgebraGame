import { useUIStore } from '../stores/UIStore';
import { CardComponent } from './Card';

export function Hand() {
  const hand = useUIStore((state) => state.hand);
  const playCard = useUIStore((state) => state.playCard);

  const cardWidth = 200;
  const cardGap = 16;
  const totalWidth = hand.length * cardWidth + (hand.length - 1) * cardGap;
  const startX = (1920 - totalWidth) / 2;
  const startY = 900

  return (
    <>
      {hand.map((card, i) => {
        const x = startX + i * (cardWidth + cardGap);
        return (
          <div
            key={card.id}
            style={{ position: 'absolute', left: x, top: startY }}
            onDoubleClick={() => playCard(card.id)}
          >
            <CardComponent card={card} />
          </div>
        );
      })}
    </>
  );
}