import { ROOMS } from '../data/data';

export function updateRooms() {
  return JSON.stringify({
    type: 'update_room',
    data: JSON.stringify(ROOMS),
    id: 0,
  });
}
