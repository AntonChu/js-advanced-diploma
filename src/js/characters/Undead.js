import Character from '../Character';

export default class Undead extends Character {
  constructor(level) {
    super(level, 'Undead');
    this.attack = 40;
    this.defence = 10;
    this.player = 'enemy';
    this.tripRadius = 4;
    this.attackRadius = 1;
  }
}
