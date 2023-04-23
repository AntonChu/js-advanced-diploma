import GameController from "../js/GameController";
import GamePlay from "../js/GamePlay";

test("checking of correct hero's info", () => {
  GamePlay.heroes = {1: {level: 1, attack: 10, defence: 40, health: 50, type: 'Magician'}};
  const answer = '🎖1 ⚔10 🛡40 ❤50';
  const index = 1;
  const gameController = new GameController(GamePlay);

  expect(gameController.showInfo(index)).toBe(answer);
});
// если этого теста нет то покрытие кода тестами ~ 100%, а с ним сильно меньше