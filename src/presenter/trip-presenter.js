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

  // 🔹 Для формы: передаёт offers как id, а allOffers — с флагами
  enrichEventForForm(event) {
    const allOffers = this.tripEventModel.getOffersByType(event.type);
    const selectedOfferIds = event.offers || [];

    const allOffersWithSelection = allOffers.map((offer) => ({
      ...offer,
      isSelected: selectedOfferIds.includes(offer.id),
    }));

    return {
      ...event,
      allOffers: allOffersWithSelection,
    };
  }

  // 🔹 Для поинтов: преобразует offers в офферы с флагом isSelected
  enrichEventForPoint(event) {
    const allOffers = this.tripEventModel.getOffersByType(event.type);
    const selectedOfferIds = event.offers || [];

    const selectedOffers = allOffers
      .filter((offer) => selectedOfferIds.includes(offer.id))
      .map((offer) => ({
        ...offer,
        isSelected: true,
      }));

    return {
      ...event,
      offers: selectedOffers,
    };
  }

  init() {
    let tripEvents = this.tripEventModel.getPoints();

    if (tripEvents.length === 0) {
      return;
    }

    tripEvents = tripEvents.sort((a, b) => a.dateFrom - b.dateFrom);

    const routeTitle = tripEvents.map((event) => event.destination.name).join(' — ');
    const startDate = dayjs(tripEvents[0].dateFrom).format('DD MMM');
    const endDate = dayjs(tripEvents[tripEvents.length - 1].dateTo).format('DD MMM');
    const tripDates = `${startDate} — ${endDate}`;
    const totalPrice = this.tripEventModel.getTotalPrice();

    const tripInfoComponent = new TripInfoView(routeTitle, tripDates, totalPrice);
    render(tripInfoComponent, this.tripMainElement, RenderPosition.AFTERBEGIN);

    const tripControlsElement = document.querySelector('.trip-controls__filters');
    render(new TripFiltersView(), tripControlsElement, RenderPosition.BEFOREEND);

    render(new SortView(), this.tripEventsElement, RenderPosition.BEFOREEND);
    render(new TripEventsView(), this.tripEventsElement, RenderPosition.BEFOREEND);

    const eventsList = this.tripEventsElement.querySelector('.trip-events__list');

    // Форма — enrich для allOffers
    const firstEvent = this.enrichEventForForm(tripEvents[0]);
    const eventTypes = this.tripEventModel.getOfferTypes(); //типы событий

    const eventFormItem = document.createElement('li');
    eventFormItem.classList.add('trip-events__item');
    eventFormItem.append(
      new EventFormView({
        mode: 'edit',
        event: firstEvent,
        eventTypes, //передаём в форму
      }).getElement()
    );
    render(eventFormItem, eventsList, RenderPosition.AFTERBEGIN);

    //Остальные точки — enrich offers для рендера
    tripEvents.forEach((tripEvent) => {
      const enrichedEvent = this.enrichEventForPoint(tripEvent);
      render(new EventPointView(enrichedEvent).getElement(), eventsList, RenderPosition.BEFOREEND);
    });
  }
}
