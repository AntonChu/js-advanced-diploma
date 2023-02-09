import Bowman from "../js/characters/Bowman";

test('the creation new exemlars of Bowman is available', () => {
    const hero = new Bowman(1);
    
    expect(hero.type).toBe('Bowman')
});
