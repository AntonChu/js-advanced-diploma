import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level, 'Swordsman');
    this.attack = 40;
    this.defence = 10;
    this.player = 'player';
    this.tripRadius = 4;
    this.attackRadius = 1;
  }
}
