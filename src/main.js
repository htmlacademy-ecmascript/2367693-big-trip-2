import TripPresenter from './presenter/trip-presenter.js';
import TripEventModel from './model/trip-event-model.js';

const tripMainElement = document.querySelector('.trip-events');
const tripEventModel = new TripEventModel();

const tripPresenter = new TripPresenter(tripMainElement, tripEventModel);
tripPresenter.init();
