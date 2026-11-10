function initReciclaMap() {
  const mapElement = document.querySelector("#map");
  if (!mapElement || !window.RECICLA_PLACES) return;

  const validPlaces = window.RECICLA_PLACES.filter(
    (place) => place.latitude !== null && place.longitude !== null
  );

  const defaultCenter = { lat: -14.235, lng: -51.9253 };

  const map = new google.maps.Map(mapElement, {
    center: validPlaces.length
      ? { lat: Number(validPlaces[0].latitude), lng: Number(validPlaces[0].longitude) }
      : defaultCenter,
    zoom: validPlaces.length ? 13 : 4,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      { featureType: "poi", stylers: [{ visibility: "off" }] },
    ],
  });

  const bounds = new google.maps.LatLngBounds();
  const markers = new Map();

  validPlaces.forEach((place) => {
    const position = {
      lat: Number(place.latitude),
      lng: Number(place.longitude),
    };

    const marker = new google.maps.Marker({
      position,
      map,
      title: place.name,
      animation: google.maps.Animation.DROP,
    });

    const items = (place.itemsList || [])
      .map((item) => `<span>${item}</span>`)
      .join("");

    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${position.lat},${position.lng}`;

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div class="map-info">
          <strong>${escapeHtml(place.name)}</strong>
          <p>${escapeHtml(place.address)}${place.address2 ? ", " + escapeHtml(place.address2) : ""}</p>
          <p>${escapeHtml(place.city)} — ${escapeHtml(place.state)}</p>
          <div class="map-info-items">${items}</div>
          <a href="${mapsUrl}" target="_blank" rel="noopener">Abrir rota no Google Maps →</a>
        </div>
      `,
    });

    marker.addListener("click", () => infoWindow.open({ anchor: marker, map }));
    markers.set(String(place.id), marker);
    bounds.extend(position);
  });

  if (validPlaces.length > 1) {
    map.fitBounds(bounds);
  }

  document.querySelectorAll(".map-place").forEach((button) => {
    button.addEventListener("click", () => {
      const marker = markers.get(button.dataset.placeId);
      if (!marker) {
        alert("Este ponto ainda não possui uma localização geográfica.");
        return;
      }

      map.setZoom(16);
      map.panTo(marker.getPosition());
      google.maps.event.trigger(marker, "click");
    });
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
