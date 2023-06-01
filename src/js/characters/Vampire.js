import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'Vampire');
    this.attack = 25;
    this.defence = 25;
    this.player = 'enemy';
    this.tripRadius = 2;
    this.attackRadius = 2;
  }
}
