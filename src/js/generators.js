import Team from './Team';
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const availableLevels = [...Array(maxLevel)].map((_, index) => index + 1);
  const availableTypes = allowedTypes.map((i) => i);
  while (true) {
    const heroNumber = Math.floor(Math.random() * availableTypes.length);
    const heroLevel = availableLevels[Math.floor(Math.random() * availableLevels.length)];
    yield new (allowedTypes[heroNumber])(heroLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в
 * команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const heroes = [];
  for (let i = 0; i < characterCount; i++) {
    const hero = characterGenerator(allowedTypes, maxLevel).next().value;
    heroes.push(hero);
  }
  return new Team(heroes);
}
