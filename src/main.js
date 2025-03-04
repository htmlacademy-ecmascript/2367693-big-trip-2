import TripPresenter from './presenter/trip-presenter.js';

const tripMainElement = document.querySelector('.trip-events');

const tripPresenter = new TripPresenter(tripMainElement);
tripPresenter.init();
