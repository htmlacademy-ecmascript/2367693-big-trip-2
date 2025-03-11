import TripFiltersView from '../view/trip-filters-view.js';
import SortView from '../view/sort-view.js';
import EventFormView from '../view/event-form-view.js';
import EventPointView from '../view/event-point-view.js';
import TripInfoView from '../view/trip-info-view.js';
import TripEventsView from '../view/trip-events-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripPresenter {
  constructor(tripEventModel, tripMainElement, tripEventsElement) {
    this.tripEventModel = tripEventModel;
    this.tripMainElement = tripMainElement;
    this.tripEventsElement = tripEventsElement;
  }

  init() {
    const tripEvents = this.tripEventModel.getTripEvents();
    const destinations = this.tripEventModel.getDestinations();

    //  Получаем маршрут и стоимость
    const { title, dates } = this.tripEventModel.getRouteInfo();
    const totalPrice = this.tripEventModel.getTotalPrice();

    //  Корректное формирование заголовка маршрута
    let tripTitle;
    if (tripEvents.length > 3) {
      const sortedEvents = [...tripEvents].sort((a, b) => a.startTime - b.startTime);
      const startCity = destinations.find((dest) => dest.id === sortedEvents[0].destinationId)?.name || 'Unknown';
      const endCity = destinations.find((dest) => dest.id === sortedEvents[sortedEvents.length - 1].destinationId)?.name || 'Unknown';
      tripTitle = `${startCity} — ... — ${endCity}`;
    } else if (tripEvents.length > 0) {
      tripTitle = title;
    } else {
      tripTitle = 'No destinations';
    }

    //  Рендерим TripInfoView в trip-main
    const tripInfoComponent = new TripInfoView(tripTitle, dates, totalPrice);
    render(tripInfoComponent, this.tripMainElement, RenderPosition.AFTERBEGIN);

    //  Находим контейнер для фильтров
    const tripControlsElement = document.querySelector('.trip-controls__filters');

    //  Фильтры рендерятся в trip-controls
    render(new TripFiltersView(), tripControlsElement, RenderPosition.BEFOREEND);

    //  Сортировка рендерится после заголовком Trip events
    render(new SortView(), this.tripEventsElement, RenderPosition.BEFOREEND);

    //  Список рендерится после сортировки
    render(new TripEventsView(), this.tripEventsElement, RenderPosition.BEFOREEND);

    //  Используем появившийся <ul class="trip-events__list">
    const eventsList = this.tripEventsElement.querySelector('.trip-events__list');

    //  Форма редактирования первой точки маршрута
    if (tripEvents.length > 0) {
      const firstTripEvent = tripEvents[0];
      const eventFormItem = document.createElement('li');
      eventFormItem.classList.add('trip-events__item');

      //  Извлекаем офферы и destination для первой точки маршрута
      const destination = destinations.find((dest) => dest.id === firstTripEvent.destinationId) || { name: '', description: '', pictures: [] };
      const offers = firstTripEvent.offers || [];

      //  Передаём destination и офферы в EventFormView
      eventFormItem.append(new EventFormView({ mode: 'edit', offers, destination }).getElement());

      render(eventFormItem, eventsList, RenderPosition.AFTERBEGIN);
    }

    //  Рендерим точки маршрута
    tripEvents.forEach((tripEvent) => {
      const destination = destinations.find((dest) => dest.id === tripEvent.destinationId) || { name: 'Unknown', pictures: [] };
      const offers = tripEvent.offers || [];
      const isFavorite = tripEvent.isFavorite ?? false;

      render(new EventPointView({ ...tripEvent, destination, offers, isFavorite }).getElement(), eventsList, RenderPosition.BEFOREEND);
    });
  }
}
