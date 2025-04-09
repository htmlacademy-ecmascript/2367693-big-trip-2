import TripFiltersView from '../view/trip-filters-view.js';
import SortView from '../view/sort-view.js';
import EventFormView from '../view/event-form-view.js';
import EventPointView from '../view/event-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripEventsView from '../view/trip-events-view.js';
import { render, replace, RenderPosition } from '../framework/render.js';
import dayjs from 'dayjs';

export default class TripPresenter {
  #currentFormComponent = null; // Текущее состояние формы

  constructor(tripEventModel, tripMainElement, tripEventsElement) {
    this.tripEventModel = tripEventModel;
    this.tripMainElement = tripMainElement;
    this.tripEventsElement = tripEventsElement;
  }

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
    const tripEventsListComponent = new TripEventsView();
    render(tripEventsListComponent, this.tripEventsElement, RenderPosition.BEFOREEND);

    const destinations = this.tripEventModel.getDestinations();
    const allOffers = this.tripEventModel.getOffers();

    for (const event of tripEvents) {
      const enrichedEvent = this.enrichEventForPoint(event);
      const eventPointComponent = new EventPointView(enrichedEvent);
      const eventFormComponent = new EventFormView({
        mode: 'edit',
        event,
        offers: allOffers,
        destinations,
      });

      const replaceFormToPoint = () => {
        const formElement = eventFormComponent.element;
        if (formElement && formElement.parentElement) {
          replace(eventPointComponent, eventFormComponent);
        }
        this.#currentFormComponent = null;
      };

      eventPointComponent.setEditClickHandler(() => {
        // Закрываем предыдущую форму, если она была
        if (this.#currentFormComponent) {
          const prevFormElement = this.#currentFormComponent.element;
          if (prevFormElement && prevFormElement.parentElement) {
            replace(this.#currentFormComponent._pointComponent, this.#currentFormComponent);
          }
        }

        replace(eventFormComponent, eventPointComponent);
        this.#currentFormComponent = eventFormComponent;
        eventFormComponent._pointComponent = eventPointComponent; // сохраняем ссылку для замены назад

        const escKeyDownHandler = (evt) => {
          if (evt.key === 'Escape') {
            evt.preventDefault();
            replaceFormToPoint();
            document.removeEventListener('keydown', escKeyDownHandler);
          }
        };

        document.addEventListener('keydown', escKeyDownHandler);

        eventFormComponent.setCloseClickHandler(() => {
          replaceFormToPoint();
          document.removeEventListener('keydown', escKeyDownHandler);
        });

        eventFormComponent.setFormSubmitHandler(() => {
          replaceFormToPoint();
          document.removeEventListener('keydown', escKeyDownHandler);
        });
      });

      render(eventPointComponent, tripEventsListComponent.element, RenderPosition.BEFOREEND);
    }
  }
}
