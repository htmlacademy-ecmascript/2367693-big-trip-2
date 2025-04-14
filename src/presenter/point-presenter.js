import { render, replace } from '../framework/render.js';
import EventPointView from '../view/event-point-view.js';
import EventFormView from '../view/event-form-view.js';
import { EventFormMode } from '../const.js';

export default class PointPresenter {
  #point = null;
  #destinations = [];
  #offersByType = [];
  #container = null;
  #changeData = null;
  #onModeChange = null;

  #pointComponent = null;
  #formComponent = null;
  #isFormOpen = false;

  constructor(container, destinations, offersByType, changeData, onModeChange) {
    this.#container = container;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#changeData = changeData;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#pointComponent = new EventPointView(this.#point, this.#destinations, this.#offersByType);
    this.#setPointHandlers();
    this.#renderPoint();
  }

  update(point) {
    const wasFormOpen = this.#isFormOpen;
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    this.#pointComponent = new EventPointView(this.#point, this.#destinations, this.#offersByType);
    this.#setPointHandlers();

    if (wasFormOpen) {
      this.#replacePointToForm();
    } else if (prevPointComponent.element?.isConnected) {
      replace(this.#pointComponent, prevPointComponent);
    } else {
      this.#renderPoint();
    }

    prevPointComponent.removeElement();
    this.#formComponent?.removeElement();
  }

  resetView() {
    if (this.#isFormOpen) {
      this.#closeForm();
    }
  }

  destroy() {
    this.#pointComponent?.element.remove();
    this.#pointComponent?.removeElement();

    this.#formComponent?.element.remove();
    this.#formComponent?.removeElement();

    this.#removeEscHandler();
  }

  #renderPoint() {
    render(this.#pointComponent, this.#container);
  }

  #replacePointToForm() {
    if (!this.#pointComponent?.element?.parentElement) {
      this.#renderPoint();
      return;
    }

    this.#formComponent = new EventFormView({
      event: this.#point,
      mode: EventFormMode.EDIT,
      destinations: this.#destinations,
      offers: this.#offersByType
    });

    this.#formComponent.setCloseClickHandler(this.#closeForm);
    this.#formComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#formComponent.setFormResetHandler(this.#closeForm);

    this.#isFormOpen = true;
    replace(this.#formComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #replaceFormToPoint() {
    if (this.#formComponent?.element?.parentElement) {
      replace(this.#pointComponent, this.#formComponent);
      this.#isFormOpen = false;
    }
  }

  #closeForm = () => {
    this.#replaceFormToPoint();
    this.#removeEscHandler();
  };

  #handleFormSubmit = () => {
    const selectedOfferIds = Array.from(
      this.#formComponent.element.querySelectorAll('.event__offer-checkbox:checked')
    ).map((input) => input.id.replace('event-offer-', ''));

    this.#changeData({
      id: this.#point.id,
      offers: selectedOfferIds
    });

    this.#closeForm();
  };

  #setPointHandlers() {
    this.#pointComponent.setEditClickHandler(() => {
      this.#onModeChange();
      this.#replacePointToForm();
    });

    this.#pointComponent.setFavoriteClickHandler(() => {
      this.#changeData({
        ...this.#point,
        isFavorite: !this.#point.isFavorite
      });
    });
  }

  #removeEscHandler() {
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeForm();
    }
  };
}
