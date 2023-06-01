export default class GameState {
  static from(object) {
    // TODO: create object
    const {
      level,
      teams,
      motion,
      scores,
    } = object;
    return new GameState(level, teams, motion, scores);
  }

  constructor(level, teams, motion, scores) {
    this.level = level;
    this.teams = teams;
    this.motion = motion;
    this.scores = scores || 0;
    this.availableSteps = null;
    this.availableAttack = null;
    this.selectedHero = null;
  }

  clear() {
    this.availableSteps = null;
    this.availableAttack = null;
    this.selectedHero = null;
  }

  removeHero(index) {
    this.teams = this.teams.filter((member) => member.position !== index);
  }

  addScores() {
    const sum = this.teams.reduce((acc, member) => {
      if (member.character.player === 'player') {
        return acc + member.character.health;
      }
      return acc;
    }, 0);
    this.scores += sum;
  }
}
