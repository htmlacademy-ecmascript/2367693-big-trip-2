import TripPresenter from './presenter/trip-presenter.js';
import TripEventModel from './model/trip-event-model.js';
import TripEventsView from './view/trip-events-view.js';
import { render, RenderPosition } from './render.js';

const tripMainElement = document.querySelector('.trip-events');
const tripEventModel = new TripEventModel();

const tripEventsView = new TripEventsView(); // Новый компонент списка событий
render(tripEventsView, tripMainElement, RenderPosition.BEFOREEND); //  Рендер списка маршрутов

const tripPresenter = new TripPresenter(tripEventsView.getElement(), tripEventModel); // Передаем список в презентер
tripPresenter.init();
