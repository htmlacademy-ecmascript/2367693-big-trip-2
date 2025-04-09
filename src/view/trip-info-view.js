import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const createTripInfoTemplate = (points, destinations, totalPrice) => {
  if (points.length === 0) {
    return '';
  }

  const routePoints = points.map((point) => {
    const destination = destinations.find((d) => d.id === point.destination);
    return destination ? destination.name : '';
  });

  const uniqueCities = routePoints.filter((city, i, self) => city && self.indexOf(city) === i);
  const routeTitle = uniqueCities.join(' — ');

  const startDate = dayjs(points[0].dateFrom).format('DD MMM');
  const endDate = dayjs(points[points.length - 1].dateTo).format('DD MMM');
  const tripDates = `${startDate} — ${endDate}`;

  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${routeTitle}</h1>
        <p class="trip-info__dates">${tripDates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>
  `;
};

export default class TripInfoView extends AbstractView {
  #points;
  #destinations;
  #totalPrice;

  constructor(points, destinations, totalPrice) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#totalPrice = totalPrice;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#totalPrice);
  }
}
