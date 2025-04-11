import TripPresenter from './presenter/trip-presenter.js';
import TripEventModel from './model/trip-event-model.js';
import { points } from './mock/trip-event-mock.js';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const tripEventModel = new TripEventModel();
window.tripEventModel = tripEventModel;
const tripPresenter = new TripPresenter(tripEventModel, tripMainElement, tripEventsElement);

// Подписываем `Presenter` на момент загрузки данных
tripEventModel.setOnDataLoaded(() => {
  tripPresenter.init();
});

// Загружаем данные (Presenter сам запустится после загрузки)
tripEventModel.setPoints(points);
