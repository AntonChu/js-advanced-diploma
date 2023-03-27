import Bowman from '../js/characters/Bowman';
import Swordsman from '../js/characters/Swordsman';
import Magician from '../js/characters/Magician';
import Undead from '../js/characters/Undead';
import Vampire from '../js/characters/Vampire';
import Daemon from '../js/characters/Daemon';

test.each([
  ['checking characteristic of first level Bowman', (() => [new Bowman(1).attack, new Bowman(1).defence])(), [25, 25]],
  ['checking characteristic of first level Swordsman', (() => [new Swordsman(1).attack, new Swordsman(1).defence])(), [40, 10]],
  ['checking characteristic of first level Magician', (() => [new Magician(1).attack, new Magician(1).defence])(), [10, 40]],
  ['checking characteristic of first level Vampire', (() => [new Vampire(1).attack, new Vampire(1).defence])(), [25, 25]],
  ['checking characteristic of first level Undead', (() => [new Undead(1).attack, new Undead(1).defence])(), [40, 10]],
  ['checking characteristic of first level Daemon', (() => [new Daemon(1).attack, new Daemon(1).defence])(), [10, 40]],
])('test case %s', (_, exemplar, expected) => {
  expect(exemplar).toEqual(expected);
});
