import { calcTileType } from '../js/utils';

test.each([
  ['top-left border', 0, 3, 'top-left'],
  ['top border', 1, 3, 'top'],
  ['top-rigth border', 2, 3, 'top-right'],
  ['left border', 3, 3, 'left'],
  ['centre position', 4, 3, 'center'],
  ['right border', 5, 3, 'right'],
  ['bottom-left border', 6, 3, 'bottom-left'],
  ['bottom border', 7, 3, 'bottom'],
  ['bottom-rigth border', 8, 3, 'bottom-right'],
])('testing position %s with %i index in %j boar size', (_, index, boardSize, answer) => {
  const result = calcTileType(index, boardSize);

  expect(result).toBe(answer);
});
