import TripFiltersView from '../view/trip-filters-view.js';
import SortView from '../view/sort-view.js';
import EventFormView from '../view/event-form-view.js';
import EventPointView from '../view/event-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripEventsView from '../view/trip-events-view.js';
import { render, RenderPosition } from '../render.js';
import dayjs from 'dayjs';

export default class TripPresenter {
  constructor(tripEventModel, tripMainElement, tripEventsElement) {
    this.tripEventModel = tripEventModel;
    this.tripMainElement = tripMainElement;
    this.tripEventsElement = tripEventsElement;
  }

  init() {
    const tripEvents = this.tripEventModel.getPoints();

    const routeTitle = tripEvents.length > 0
      ? tripEvents.sort((a, b) => a.dateFrom - b.dateFrom).map((event) => event.destination?.name || 'Unknown').join(' — ')
      : 'No destinations';

    const startDate = tripEvents.length > 0
      ? dayjs(tripEvents.reduce((min, event) => event.dateFrom < min ? event.dateFrom : min, tripEvents[0].dateFrom)).format('DD MMM')
      : null;

    const endDate = tripEvents.length > 0
      ? dayjs(tripEvents.reduce((max, event) => event.dateTo > max ? event.dateTo : max, tripEvents[0].dateTo)).format('DD MMM')
      : null;

    const tripDates = startDate && endDate ? `${startDate} — ${endDate}` : '';
    const totalPrice = this.tripEventModel.getTotalPrice();

    const tripInfoComponent = new TripInfoView(routeTitle, tripDates, totalPrice);
    render(tripInfoComponent, this.tripMainElement, RenderPosition.AFTERBEGIN);

    const tripControlsElement = document.querySelector('.trip-controls__filters');
    render(new TripFiltersView(), tripControlsElement, RenderPosition.BEFOREEND);

    render(new SortView(), this.tripEventsElement, RenderPosition.BEFOREEND);
    render(new TripEventsView(), this.tripEventsElement, RenderPosition.BEFOREEND);

    const eventsList = this.tripEventsElement.querySelector('.trip-events__list');

    const eventFormItem = document.createElement('li');
    eventFormItem.classList.add('trip-events__item');

    const firstTripEvent = tripEvents.length > 0 ? JSON.parse(JSON.stringify(tripEvents[0])) : null;

    const firstTripOffers = firstTripEvent ? this.tripEventModel.getOffersByType(firstTripEvent.type)
      ?.map((offer) => ({
        ...offer,
        isSelected: Array.isArray(firstTripEvent.offers) &&
          firstTripEvent.offers.some((id) => String(id).trim() === String(offer.id).trim())
      })) || [] : [];

    eventFormItem.append(
      new EventFormView({
        mode: 'edit',
        offers: firstTripOffers,
        destination: firstTripEvent?.destination || { name: 'Unknown', pictures: [] },
        dateFrom: firstTripEvent?.dateFrom || dayjs().toISOString(),
        dateTo: firstTripEvent?.dateTo || dayjs().add(1, 'day').toISOString(),
        availableDestinations: this.tripEventModel.destinations,
        availableTypes: this.tripEventModel.getOfferTypes()
      }).getElement()
    );
    render(eventFormItem, eventsList, RenderPosition.AFTERBEGIN);

    tripEvents.forEach((tripEvent) => {
      const rawOffers = this.tripEventModel.getOffersByType(tripEvent.type);
      const offers = Array.isArray(rawOffers)
        ? rawOffers.map((tripOffer) => ({
          ...tripOffer,
          isSelected: tripEvent.offers.map((eventOffer) => String(eventOffer.id)).includes(String(tripOffer.id).trim())
        }))
        : [];

      render(new EventPointView({ ...tripEvent, destination: tripEvent.destination, offers }).getElement(), eventsList, RenderPosition.BEFOREEND);
    });
  }
}
