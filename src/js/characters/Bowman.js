import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'Bowman');
    this.attack = 25;
    this.defence = 25;
    this.player = 'player';
    this.tripRadius = 2;
    this.attackRadius = 2;
  }
}
