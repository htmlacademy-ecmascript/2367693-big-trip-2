// Получает случайный элемент из массива
export const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Получает случайное число в диапазоне
export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getOffersByType = (type, offers) => {
  const offerCategory = offers.find((offerGroup) => offerGroup.type.toLowerCase() === type.toLowerCase());
  return offerCategory ? offerCategory.offers : [];
};
