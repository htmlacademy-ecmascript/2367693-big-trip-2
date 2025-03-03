import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EventFormView from '../view/event-form-view.js';
import EventPointView from '../view/event-point-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripPresenter {
  constructor(container) {
    this.container = container;
  }

  init() {
    // Рендерим фильтры
    const filtersComponent = new FiltersView();
    render(filtersComponent, this.container, RenderPosition.BEFOREEND);

    // Рендерим сортировку
    const sortComponent = new SortView();
    render(sortComponent, this.container, RenderPosition.BEFOREEND);

    // Контейнер для списка событий
    const eventsList = document.createElement('ul');
    eventsList.classList.add('trip-events__list');
    this.container.appendChild(eventsList);

    // Рендерим форму редактирования первой в списке
    const eventFormComponent = new EventFormView();
    render(eventFormComponent, eventsList, RenderPosition.AFTERBEGIN);

    // Рендерим 3 точки маршрута
    for (let i = 0; i < 3; i++) {
      const eventPointComponent = new EventPointView({
        date: '2025-03-18',
        dateFormatted: 'MAR 18',
        type: 'taxi',
        title: 'Taxi Amsterdam',
        startTime: '2025-03-18T10:30',
        startTimeFormatted: '10:30',
        endTime: '2025-03-18T11:00',
        endTimeFormatted: '11:00',
        duration: '30M',
        price: 20
      });
      render(eventPointComponent, eventsList, RenderPosition.BEFOREEND);
    }
  }
}
