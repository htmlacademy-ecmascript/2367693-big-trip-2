export const adaptToClient = (point) => ({
  ...point,
  type: point.type ?? '',
  destination: point.destination ?? '',
  basePrice: point.basePrice ?? 0,
  dateFrom: point.dateFrom ?? new Date().toISOString(),
  dateTo: point.dateTo ?? new Date().toISOString(),
  isFavorite: point.isFavorite ?? false,
  offers: (point.offers ?? []).map((offer) =>
    typeof offer === 'object' ? offer.id : offer
  )
});

export const adaptToServer = (formState) => ({
  ...formState,
  destination: typeof formState.destination === 'object'
    ? formState.destination.id
    : formState.destination,
  offers: formState.offers.map((offer) =>
    typeof offer === 'object' ? offer.id : offer
  )
});
