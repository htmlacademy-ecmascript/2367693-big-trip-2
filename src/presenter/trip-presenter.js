import TripFiltersView from '../view/trip-filters-view.js';
import SortView from '../view/sort-view.js';
import EventFormView from '../view/event-form-view.js';
import EventPointView from '../view/event-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripEventsView from '../view/trip-events-view.js';
import NoPointsView from '../view/no-points-view.js';
import { render, replace, RenderPosition } from '../framework/render.js';
import { filterTypeToCallback } from '../const.js';

export default class TripPresenter {
  #currentFormComponent = null;

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
    const currentFilterType = 'everything';

    const tripPoints = this.tripEventModel.getPoints();
    const filteredPoints = tripPoints.filter(filterTypeToCallback[currentFilterType]);

    const tripControlsElement = document.querySelector('.trip-controls__filters');
    const filters = this.tripEventModel.getFilters(currentFilterType);
    render(new TripFiltersView(filters), tripControlsElement, RenderPosition.BEFOREEND);

    if (filteredPoints.length === 0) {
      render(new NoPointsView(currentFilterType), this.tripEventsElement, RenderPosition.BEFOREEND);
      return;
    }

    const sortedPoints = filteredPoints.sort((a, b) => a.dateFrom - b.dateFrom);

    const destinations = this.tripEventModel.getDestinations();
    const totalPrice = this.tripEventModel.getTotalPrice();

    const tripInfoComponent = new TripInfoView(sortedPoints, destinations, totalPrice);
    render(tripInfoComponent, this.tripMainElement, RenderPosition.AFTERBEGIN);

    render(new SortView(), this.tripEventsElement, RenderPosition.BEFOREEND);
    const tripEventsListComponent = new TripEventsView();
    render(tripEventsListComponent, this.tripEventsElement, RenderPosition.BEFOREEND);

    const allOffers = this.tripEventModel.getOffers();

    for (const event of sortedPoints) {
      const enrichedEvent = this.enrichEventForPoint(event);
      const eventPointComponent = new EventPointView(enrichedEvent, destinations);
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
        if (this.#currentFormComponent) {
          const prevFormElement = this.#currentFormComponent.element;
          if (prevFormElement && prevFormElement.parentElement) {
            replace(this.#currentFormComponent._pointComponent, this.#currentFormComponent);
          }
        }

        replace(eventFormComponent, eventPointComponent);
        this.#currentFormComponent = eventFormComponent;
        eventFormComponent._pointComponent = eventPointComponent;

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
