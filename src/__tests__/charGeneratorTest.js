import Bowman from '../js/characters/Bowman';
import Swordsman from '../js/characters/Swordsman';
import Magician from '../js/characters/Magician';
import { characterGenerator } from '../js/generators';

test('checking of correct generator\'s work', () => {
  const allowedTypes = [Bowman, Swordsman, Magician];
  const maxLevel = 3;
  const casualQuantity = Math.ceil(Math.random() * 10);
  const heroes = [];
  for (let i = 0; i < casualQuantity; i++) {
    heroes.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }

  expect(heroes.length).toBe(casualQuantity);
});
