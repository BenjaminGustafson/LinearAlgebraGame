import { useUIState } from '../stores/UIState';
import { CardComponent } from './Card';

export function Hand() {
  const hand = useUIState((state) => state.hand);
  const playCard = useUIState((state) => state.playCard);

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
            style={{ position: 'absolute', left: x, top: startY }}
            onClick={() => playCard(i)}
          >
            <CardComponent card={card} />
          </div>
        );
      })}
    </>
  );
}