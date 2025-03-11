import TripPresenter from './presenter/trip-presenter.js';
import TripEventModel from './model/trip-event-model.js';


const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const tripEventModel = new TripEventModel();

const tripPresenter = new TripPresenter(tripEventModel, tripMainElement, tripEventsElement);
tripPresenter.init();
