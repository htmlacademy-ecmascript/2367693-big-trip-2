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

    this.#pointComponent = new EventPointView(this.#point, this.#destinations);

    this.#pointComponent.setEditClickHandler(() => {
      this.#onModeChange();
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    this.#pointComponent.setFavoriteClickHandler(() => {
      const updatedPoint = {
        ...this.#point,
        isFavorite: !this.#point.isFavorite,
        offers: this.#point.offers?.map((o) => typeof o === 'object' ? o.id : o) ?? []
      };

      this.#changeData(updatedPoint);
    });

    this.#renderPoint();
  }

  update(point) {
    const wasFormOpen = this.#isFormOpen;
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    this.#pointComponent = new EventPointView(this.#point, this.#destinations);

    this.#pointComponent.setEditClickHandler(() => {
      this.#onModeChange();
      this.#replacePointToForm();
      document.addEventListener('keydown', this.#onEscKeyDown);
    });

    this.#pointComponent.setFavoriteClickHandler(() => {
      const updatedPoint = {
        ...this.#point,
        isFavorite: !this.#point.isFavorite,
        offers: this.#point.offers?.map((o) => typeof o === 'object' ? o.id : o) ?? []
      };

      this.#changeData(updatedPoint);
    });

    if (wasFormOpen) {
      this.#replacePointToForm(); // пересоздаём форму, если была открыта
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
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  }

  destroy() {
    if (this.#pointComponent) {
      this.#pointComponent.element.remove();
      this.#pointComponent.removeElement();
    }

    if (this.#formComponent) {
      this.#formComponent.element.remove();
      this.#formComponent.removeElement();
    }

    document.removeEventListener('keydown', this.#onEscKeyDown);
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

    this.#formComponent.setCloseClickHandler(() => {
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    this.#formComponent.setFormSubmitHandler(() => {
      const selectedOfferIds = Array.from(
        this.#formComponent.element.querySelectorAll('.event__offer-checkbox:checked')
      ).map((input) => input.id.replace('event-offer-', ''));

      const updated = {
        ...this.#point,
        offers: selectedOfferIds
      };

      this.#changeData(updated);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    });

    this.#isFormOpen = true;
    replace(this.#formComponent, this.#pointComponent);
  }

  #replaceFormToPoint() {
    if (this.#formComponent?.element?.parentElement) {
      replace(this.#pointComponent, this.#formComponent);
      this.#isFormOpen = false;
    }
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };
}
