import { WINNERS } from '../data/data';

export function updateWinners() {
  return JSON.stringify({
    type: 'update_winners',
    data: JSON.stringify(WINNERS),
    id: 0,
  });
}
