import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level, 'Daemon');
    this.attack = 10;
    this.defence = 40;
    this.player = 'enemy';
    this.tripRadius = 1;
    this.attackRadius = 4;
  }
}
