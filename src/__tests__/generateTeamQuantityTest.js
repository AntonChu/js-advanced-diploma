import Bowman from "../js/characters/Bowman";
import Swordsman from '../js/characters/Swordsman';
import Magician from '../js/characters/Magician';
import { generateTeam } from '../js/generators';

test('checking of correction amount characters is returned by TEAM generator', () => {
    const allowedTypes = [Bowman, Swordsman, Magician];
    const maxLevel = 3;
    const capacity = 5;
    let team = generateTeam(allowedTypes, maxLevel, capacity).characters;
    
    expect(team.length).toBe(capacity);
});
