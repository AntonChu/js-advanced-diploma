import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'Vampire');
    this.attack = 10;
    this.defence = 40;
  }
}
