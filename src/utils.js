// Получает случайный элемент из массива
export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Получает случайное число в диапазоне
export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
