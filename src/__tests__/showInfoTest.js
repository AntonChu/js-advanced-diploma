import GameController from '../js/GameController';
import GamePlay from '../js/GamePlay';
import Swordsman from '../js/characters/Swordsman';
import Bowman from '../js/characters/Bowman';
import Magician from '../js/characters/Magician';
import Undead from '../js/characters/Undead';
import Vampire from '../js/characters/Vampire';
import Daemon from '../js/characters/Daemon';

// если этого теста нет то покрытие кода тестами ~ 100%, а с ним сильно меньше
test.each([
  ['checking of correct hero\'s info Swordsman', { character: new Swordsman(1), position: 1 }, '🎖 1 ⚔ 40 🛡 10 ❤ 50'],
  ['checking of correct hero\'s info Bowman', { character: new Bowman(1), position: 1 }, '🎖 1 ⚔ 25 🛡 25 ❤ 50'],
  ['checking of correct hero\'s info Magician', { character: new Magician(1), position: 1 }, '🎖 1 ⚔ 10 🛡 40 ❤ 50'],
  ['checking of correct hero\'s info Swordsman', { character: new Undead(1), position: 1 }, '🎖 1 ⚔ 40 🛡 10 ❤ 50'],
  ['checking of correct hero\'s info Bowman', { character: new Vampire(1), position: 1 }, '🎖 1 ⚔ 25 🛡 25 ❤ 50'],
  ['checking of correct hero\'s info Magician', { character: new Daemon(1), position: 1 }, '🎖 1 ⚔ 10 🛡 40 ❤ 50'],
])('test case %s', (_, exemplar, expected) => {
  const gameController = new GameController(GamePlay);
  expect(gameController.showInfo(exemplar)).toBe(expected);
});
