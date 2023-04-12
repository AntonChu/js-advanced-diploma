import themes from './themes';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Vampire from './characters/Vampire';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import { characterGenerator, generateTeam } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi(themes.prairie);
    this.drawCharacters();
    // TODO: add event listeners to gamePlay events
    
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
    this.gamePlay.onCellClick()
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }

  drawCharacters() {
    const availableTeams = [[Bowman, Swordsman, Magician], [Vampire, Undead, Daemon]];
    const positions = [
      [0, 1, 8, 9, 16, 17, 24, 25, 32, 33, 40, 41, 48, 49, 56, 57],
      [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63],
    ];
    availableTeams.forEach((item, index) => this.drawTeam(item, positions[index]));
  }

  drawTeam(availableTeam, position) {
    const maxLevel = 3;
    const teamCapacity = 3;
    const finalTeamPosition = [];
    const teamPositions = position.map((i) => i);
    const team = generateTeam(availableTeam, maxLevel, teamCapacity).characters;
    for (const item of team) {
      const finalCharacterPosition = teamPositions[Math.floor(Math.random() * teamPositions.length)];
      finalTeamPosition.push(new PositionedCharacter(item, finalCharacterPosition));
      teamPositions.splice(teamPositions.findIndex((el) => el === finalCharacterPosition), 1);
    }
    this.gamePlay.redrawPositions(finalTeamPosition);
  }

  showInfo() {
    this.gamePlay.addCellEnterListener(this.onCellEnter)
  }

}
