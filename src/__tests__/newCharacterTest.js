import Character from '../js/Character';

test('the creation new exemlars of Character is fotbidden', () => {
  expect(() => { Character(1, 'Bowman'); }).toThrowError();
});
