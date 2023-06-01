import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level, 'Magician');
    this.attack = 10;
    this.defence = 40;
    this.player = 'player';
    this.tripRadius = 1;
    this.attackRadius = 4;
  }
}
