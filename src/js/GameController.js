import themes from './themes';
import cursors from './cursors';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import GameState from './GameState';
import { generateTeam } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = null;
  }

  init() {
    this.newGame();
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // TODO: load saved stated from stateService
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
  }

  onCellClick(index) {
    const hero = this.gameState.teams.find((elem) => elem.position === index);
    if (hero && hero.character.player === 'player') {
      if (this.gameState.selectedHero) {
        this.gamePlay.deselectCell(this.gameState.selectedHero.position);
      }
      this.gamePlay.selectCell(index);
      this.gameState.availableSteps = this.availableAction(hero.character.tripRadius, index);
      this.gameState.availableAttack = this.availableAction(hero.character.attackRadius, index);
      this.gameState.selectedHero = hero;
      return;
    }
    if (this.gameState.selectedHero) {
      if (this.gameState.availableSteps.includes(index) && !hero) {
        this.gamePlay.deselectCell(this.gameState.selectedHero.position);
        this.gameState.selectedHero.position = index;
        this.gamePlay.deselectCell(index);
        this.checkLevel();
      }
      if (hero && hero.character.player === 'enemy' && this.gameState.availableAttack.includes(index)) {
        this.attack(hero.character, this.gameState.selectedHero.character, index, this.gameState.selectedHero.position);
      }
      if (hero && hero.character.player === 'enemy' && !this.gameState.availableAttack.includes(index)) {
        this.gamePlay.showPopup('Враг слишком далеко!');
      }
      return;
    }
    if (!this.gameState.selectedHero) {
      this.gamePlay.showPopup('выберите персонажа своей команды');
    }
  }

  onCellEnter(index) {
    const hero = this.gameState.teams.find((elem) => elem.position === index);
    if (hero) {
      this.gamePlay.showCellTooltip(this.showInfo(hero), index);
    }
    this.activeCursor(hero);
    if (this.gameState.selectedHero) {
      this.activeCursorSelectedHero(index, hero);
    }
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
    if (this.gameState.selectedHero && (this.gameState.selectedHero.position !== index)) {
      this.gamePlay.deselectCell(index);
    }
  }

  newGame() {
    const totalScores = this.gameState ? this.gameState.scores : 0;
    this.gameState = new GameState(1, [], 'player', totalScores);
    this.nextLevel(this.gameState.level);
  }

  saveGame() {
    this.stateService.save(this.gameState);
    this.gamePlay.showPopup('Игра сохранена');
  }

  loadGame() {
    try {
      const load = this.stateService.load();
      if (load) {
        this.gameState = GameState.from(load);
        this.gamePlay.drawUi(Object.values(themes)[this.gameState.level - 1]);
        this.gamePlay.redrawPositions(this.gameState.teams);
      } else {
        this.newGame();
      }
    } catch (error) {
      GameController.clearLocalStorage('state');
      this.gamePlay.showPopup(`Ошибка загрузки: "${error.message}"`);
      this.newGame();
    }
  }

  activeCursor(hero) {
    if (hero) {
      const pointer = hero.character.player === 'player' ? cursors.pointer : cursors.notallowed;
      this.gamePlay.setCursor(pointer);
    } else {
      this.gamePlay.setCursor(cursors.auto);
    }
  }

  activeCursorSelectedHero(index, hero) {
    if (this.gameState.availableSteps.includes(index) && !hero) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    } else if (hero && hero.character.player === 'enemy' && this.gameState.availableAttack.includes(index)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    } else if (hero && hero.character.player === 'player') {
      this.gamePlay.setCursor(cursors.pointer);
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  nextLevel(level) {
    if (level === 1) {
      this.drawCharacters('user');
      this.drawCharacters('enemy');
    }

    if (level > 1 && level < 5) {
      const survived = this.gameState.teams.map((el) => el.character).filter((i) => i.player === 'player');
      this.gameState.teams = [];
      survived.forEach((el) => GameController.levelUp(false, el));
      // + к команде player
      this.drawCharacters('user', survived);
      // новая команда enemy
      this.drawCharacters('enemy');
      this.gamePlay.showPopup(`Уровень ${level} Счет: ${this.gameState.scores}`);
    }

    if (level > 4) {
      // Блокировка поля
      this.gamePlay.cellClickListeners.length = 0;
      this.gamePlay.showPopup(`Победа! Игра окончена. Счет: ${this.gameState.scores}`);
    } else {
      this.gamePlay.drawUi(Object.values(themes)[this.gameState.level - 1]);
      this.gamePlay.redrawPositions(this.gameState.teams);
    }
  }

  static levelUp(isNew, hero) {
    const personage = hero;
    if (isNew) {
      let levelsImprove = personage.level - 1;
      while (levelsImprove) {
        personage.attack = Math.floor(Math.max(personage.attack, personage.attack * (0.6 + personage.health / 100)));
        levelsImprove -= 1;
      }
    } else {
      personage.level += 1;
      personage.health = personage.health + 50 >= 100 ? 100 : personage.health + 50;
      personage.attack = Math.floor(Math.max(personage.attack, personage.attack * (0.6 + personage.health / 100)));
    }
  }

  nextPlayer() {
    this.gameState.motion = (this.gameState.motion === 'player') ? 'enemy' : 'player';
    if (this.gameState.motion === 'enemy') {
      this.computerLogic();
    }
    this.gameState.clear();
  }

  checkLevel() {
    const userPersonage = this.gameState.teams.some((el) => el.character.player === 'player');
    const enemyPersonage = this.gameState.teams.some((el) => el.character.player === 'enemy');
    if (userPersonage && enemyPersonage) {
      this.nextPlayer();
      return;
    }
    if (!enemyPersonage) {
      this.gamePlay.showPopup('enemy lost');
      this.gameState.clear();
      this.gameState.addScores();
      this.nextLevel(this.gameState.level += 1);
    }
    if (!userPersonage) {
      this.gamePlay.showPopup('You lost! Try again!', `Счет: ${this.gameState.scores}`);
    }
  }

  drawCharacters(who, createdCharacters = []) {
    const options = {
      user: {
        team: [Bowman, Swordsman, Magician],
        positions: [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
      },
      enemy: {
        team: [Vampire, Undead, Daemon],
        positions: [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63],
      },
    };
    const maxLevel = 3;
    const teamCapacity = 3;
    const finalTeamPosition = [];
    let team = generateTeam(options[who].team, maxLevel, teamCapacity - createdCharacters.length).characters;
    for (const personage of team) {
      GameController.levelUp(true, personage);
    }
    team = [...team, ...createdCharacters];
    const teamPositions = options[who].positions;
    for (const item of team) {
      const finalCharacterPosition = teamPositions[Math.floor(Math.random() * teamPositions.length)];
      finalTeamPosition.push(new PositionedCharacter(item, finalCharacterPosition));
      teamPositions.splice(teamPositions.findIndex((el) => el === finalCharacterPosition), 1);
    }
    this.gameState.teams.push(...finalTeamPosition);
  }

  showInfo(hero) {
    const {
      level,
      health,
      attack,
      defence,
    } = hero.character;
    return `\u{1F396} ${level} \u{2694} ${attack} \u{1F6E1} ${defence} \u{2764} ${health}`;
  }

  availableAction(distance, index) {
    const map = [
      [0, 1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20, 21, 22, 23],
      [24, 25, 26, 27, 28, 29, 30, 31],
      [32, 33, 34, 35, 36, 37, 38, 39],
      [40, 41, 42, 43, 44, 45, 46, 47],
      [48, 49, 50, 51, 52, 53, 54, 55],
      [56, 57, 58, 59, 60, 61, 62, 63],
    ];
    const targetRaw = map.findIndex((el) => el.includes(index));
    const targetColumn = map[targetRaw].findIndex((el) => el === index);
    const newArr = [];

    for (let item of map) {
      const indexRaw = map.findIndex((el) => el === item);
      if (indexRaw === targetRaw) {
        let zeroRaw = [];
        for (let i = -distance; i <= distance; i++) {
          if (targetColumn + i < 0 || targetColumn + i > 7) {
            continue; // eslint-disable-line
          }
          zeroRaw.push(item[targetColumn + i]);
        }
        zeroRaw = zeroRaw.filter((_, ind) => ind !== index);
        newArr.push(...zeroRaw);
        continue; // eslint-disable-line
      }

      for (let i = 1; i <= distance; i++) {
        if (indexRaw - targetRaw === -i || indexRaw - targetRaw === i) {
          item = item.filter((_, ind) => ind === targetColumn || ind === targetColumn - i || ind === targetColumn + i);
          newArr.push(...item);
        }
      }
    }
    return newArr;
  }

  async attack(attacked, attacker, indexAttacked, indexAttacker) {
    const { attack } = attacker;
    const { defence } = attacked;
    const attackedUnit = attacked;
    // Урон от атаки
    const damage = 2 * Math.round(Math.max((attack - defence, attack * 0.1)));
    attackedUnit.health -= damage;
    // Проверка убит ли герой
    if (attackedUnit.health < 1) {
      this.gameState.removeHero(indexAttacked);
    }
    // Выделяем атакующего и атакуемого героя
    this.gamePlay.selectCell(indexAttacker);
    this.gamePlay.selectCell(indexAttacked, 'red');
    // Обновляем поле
    this.gamePlay.redrawPositions(this.gameState.teams);
    // Чтобы не было выделения ячеек при анимации
    this.gameState.selectedHero = null;
    // Отображаем уровень урона анимацией
    await this.gamePlay.showDamage(indexAttacked, damage);
    // Снимаем выделение с атакующего и атакуемого героя
    this.gamePlay.deselectCell(indexAttacker);
    this.gamePlay.deselectCell(indexAttacked);
    this.checkLevel();
  }

  computerLogic() {
    const { teams } = this.gameState;
    const computerOptions = teams.filter((member) => member.character.player === 'enemy').map((el) => (
      {
        hero: el.character,
        position: el.position,
        attackPosition: this.availableAction(el.character.attackRadius, el.position),
        movePosition: this.availableAction(el.character.tripRadius, el.position),
      }
    ));
    const userOptions = teams.filter((member) => member.character.player === 'player').map((el) => (
      {
        hero: el.character,
        position: el.position,
        health: el.character.health,
      }
    ));
    // Проверяем возможность атаки
    const allUserPositions = userOptions.map((userHero) => userHero.position);
    let whoCanAttack = computerOptions.map((el) => {
      const canAttack = [];
      for (const item of allUserPositions) {
        if (el.attackPosition.includes(item)) {
          const result = {
            predator: el.hero,
            indexPredator: el.position,
            victim: userOptions.find((i) => i.position === item).hero,
            indexVictim: item,
          };
          canAttack.push(result);
        }
      }
      return canAttack;
    });
    let spareWay;
    whoCanAttack = whoCanAttack.filter((el) => el.length > 0);
    //  anyone can't attack?
    if (whoCanAttack.length === 0) {
      // логика хода сначала перебираются все варианты хода самого сильного персонажа откуда он может атаковать юзера
      // если такие варианты есть, то сортируются персонажы юзера по наименьшему здоровью и его и будет атаковать
      const enemy = computerOptions.sort((a, b) => b.hero.attack - a.hero.attack);
      spareWay = enemy[0];
      for (const item of enemy) {
        const arr = [];
        for (const move of item.movePosition) {
          // отбрасываем все занятые клетки
          if (teams.find((el) => el.position === move)) {
            continue; // eslint-disable-line
          }
          //  коллекционируем все варианты ходов откуда персонаж враг может атаковать
          let interArr = this.availableAction(item.hero.attackRadius, move);
          interArr = interArr.filter((el) => userOptions.find((i) => i.position === el));
          interArr = interArr.map((el) => (
            {
              potentialVictimPosition: el,
              victim: userOptions.find((i) => i.position === el).hero,
              predator: item.hero,
              predatorPosition: item.position,
              predatorMove: move,
            }
          ));
          arr.push(...interArr);
        }
        if (arr.length > 0) {
          const finalMove = arr.sort((a, b) => a.victim.health - b.victim.healt)[0];
          teams.find((el) => el.position === finalMove.predatorPosition).position = finalMove.predatorMove;
          this.checkLevel();
          this.gamePlay.redrawPositions(teams);
          return;
        }
      }
      teams.find((el) => el.position === spareWay.position).position = spareWay.movePosition[0];
      this.checkLevel();
      this.gamePlay.redrawPositions(teams);
    } else {
      // логика атаки атакует персонаж с высшим показ. атаки, если может атаковать нескольких, атакует соперника с наименьшим остатком жизни
      const target = whoCanAttack.sort((a, b) => b[0].predator.attack - a[0].predator.attack)[0];
      if (target.length === 1) {
        this.attack(target[0].victim, target[0].predator, target[0].indexVictim, target[0].indexPredator);
      } else {
        const sorted = target.sort((a, b) => a.victim.health - b.victim.health);
        this.attack(sorted[0].victim, sorted[0].predator, sorted[0].indexVictim, sorted[0].indexPredator);
      }
    }
  }
}
