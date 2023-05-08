import themes from "./themes";
import PositionedCharacter from "./PositionedCharacter";
import GamePlay from "./GamePlay";
import Bowman from "./characters/Bowman";
import Swordsman from "./characters/Swordsman";
import Magician from "./characters/Magician";
import Vampire from "./characters/Vampire";
import Undead from "./characters/Undead";
import Daemon from "./characters/Daemon";
import { characterGenerator, generateTeam } from "./generators";

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.drawCharacters();
    // TODO: add event listeners to gamePlay events
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    const container = this.gamePlay.cells[index].children;

    if (
      container.length > 0 &&
      (container[0].classList.contains("Swordsman") ||
        container[0].classList.contains("Magician") ||
        container[0].classList.contains("Bowman"))
    ) {
      this.gamePlay.deselectCell(index);
      this.gamePlay.selectCell(index);
      this.availableAction(index);
    } else {
      this.gamePlay.deselectCell(index);
      const condition = this.gamePlay.cells.find(el => el.classList.contains('selected'));
      if (!condition) {
        GamePlay.showError("Choose your team character!");
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.gamePlay.cells[index].children.length > 0) {
      this.gamePlay.showCellTooltip(this.showInfo(index), index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }

  drawCharacters() {
    const availableTeams = [
      [Bowman, Swordsman, Magician],
      [Vampire, Undead, Daemon],
    ];
    const positions = [
      [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
      [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63],
    ];
    const configuration = [
      { team: availableTeams[0], positions: positions[0] },
      { team: availableTeams[1], positions: positions[1] },
    ];
    const maxLevel = 3;
    const teamCapacity = 3;
    const finalTeamPosition = [];

    for (const item of configuration) {
      const team = generateTeam(item.team, maxLevel, teamCapacity).characters;
      const teamPositions = item.positions;
      for (const item of team) {
        const finalCharacterPosition =
          teamPositions[Math.floor(Math.random() * teamPositions.length)];
        finalTeamPosition.push(
          new PositionedCharacter(item, finalCharacterPosition)
        );
        teamPositions.splice(
          teamPositions.findIndex((el) => el === finalCharacterPosition),
          1
        );
      }
    }
    this.gamePlay.redrawPositions(finalTeamPosition);
  }

  // эту функцию создал я, добавляет все методы в массивы, которые выполнит обработчик при наведении
  addActions() {
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellClickListener(this.onCellClick);
  }

  // передает сообщение в gamePlay.showCellTooltip
  showInfo(index) {
    const level = String.fromCodePoint(0x1f396);
    const attack = String.fromCodePoint(0x2694);
    const defence = String.fromCodePoint(0x1f6e1);
    const health = String.fromCodePoint(0x2764);
    const hero = this.gamePlay.heroes.find(el => el.position === index).character;

    return (
      level +
      hero.level +
      " " +
      attack +
      hero.attack +
      " " +
      defence +
      hero.defence +
      " " +
      health +
      hero.health
    );
  }

  availableAction(index) {
    const oportunity = {
      Bowman: { attack: 2, distance: 2 },
      Swordsman: { attack: 1, distance: 4 },
      Magician: { attack: 4, distance: 1 },
    };
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
    const selectedHeroClass = this.gamePlay.cells[index].children[0].classList;
    const targetRaw = map.findIndex((el) => el.includes(index));
    const targetColumn = map[targetRaw].findIndex((el) => el === index);
    let selectedHero;

    if (selectedHeroClass.contains("Bowman")) {
      selectedHero = oportunity["Bowman"];
    } else if (selectedHeroClass.contains("Swordsman")) {
      selectedHero = oportunity["Swordsman"];
    } else {
      selectedHero = oportunity["Magician"];
    }

    let arrTeam = this.gamePlay.cells.filter((el) => el.hasChildNodes());
    arrTeam = arrTeam.filter(
      (el) =>
        el.children[0].classList.contains("Swordsman") ||
        el.children[0].classList.contains("Bowman") ||
        el.children[0].classList.contains("Magician")
    );
    arrTeam = arrTeam.filter((el) => !el.classList.contains("selected"));
    const arrMove = this.defineCells(
      selectedHero.distance,
      map,
      targetRaw,
      targetColumn
    );
     
    arrMove.forEach((el) => el.onclick = () => {
      this.gamePlay.heroes = this.gamePlay.heroes.map(el => {
        
        if(el.position === index) {
          const newPosition = this.gamePlay.cells.findIndex(item => item.classList.contains('selected-green'));
          return new PositionedCharacter(el.character, newPosition)
        } else {
          return el;
        }
      })
      this.gamePlay.redrawPositions(this.gamePlay.heroes);
      this.gamePlay.deselectCell(index);
    });
  
    const arrAttack = this.defineCells(
      selectedHero.attack,
      map,
      targetRaw,
      targetColumn
    ).filter(el => {
      return (
      el.hasChildNodes() && (
      el.children[0].classList.contains("Zombie") ||
      el.children[0].classList.contains("Undead") ||
      el.children[0].classList.contains("Daemon")));
    });

    arrAttack.forEach((el) => el.onclick = () => {
      
    });

    this.gamePlay.cells.forEach((el) => el.onmouseenter = (event) => {
      const hasEnemy = event.target.hasChildNodes() && (
        event.target.children[0].classList.contains("Zombie") ||
        event.target.children[0].classList.contains("Undead") ||
        event.target.children[0].classList.contains("Daemon")
      );
      const target = event.target;

      if (arrTeam.includes(target)) {
        this.gamePlay.setCursor('pointer');
      } else if (arrMove.includes(target) && target.children.length === 0) {
        this.gamePlay.setCursor('pointer');
        this.gamePlay.selectCell(this.gamePlay.cells.indexOf(target), 'green');
      } else if (arrAttack.includes(target) &&
        target.children.length !== 0 && hasEnemy) {
        this.gamePlay.setCursor(`crosshair`);
        this.gamePlay.selectCell(this.gamePlay.selectCell(this.gamePlay.cells.indexOf(target), 'red'));
      } else {
        this.gamePlay.setCursor('not-allowed');
        el.onclick = () => {
          GamePlay.showError("There aren't available actions!");
        }
      }
    });
  }

  defineCells(distance, map, targetRaw, targetColumn) {
    const newArr = [];

    for (let item of map) {
      const indexRaw = map.findIndex((el) => el === item);
      if (indexRaw === targetRaw) {
        let zeroRaw = [];
        for (let i = -distance; i <= distance; i++) {
          if (targetColumn + i < 0 || targetColumn + i > 7) {
            continue;
          }
          zeroRaw.push(item[targetColumn + i]);
        }
        zeroRaw = zeroRaw.filter((_, index) => index !== targetColumn);
        newArr.push(...zeroRaw);
        continue;
      }

      for (let i = 1; i <= distance; i++) {
        if (indexRaw - targetRaw === -i || indexRaw - targetRaw === i) {
          item = item.filter((_, index) =>
            index === targetColumn ||
            index === targetColumn - i ||
            index === targetColumn + i
          );
          newArr.push(...item);
        }
      }
    }

    return newArr.map((el) => this.gamePlay.cells[el]);
  }
}
