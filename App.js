//https://www.geoapify.com/tutorial/how-to-implement-geocoding-javascript-tutorial

navigator.geolocation.getCurrentPosition(
  function (position) {
    // console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude]

    var map = L.map('map').setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker(coords).addTo(map)
      .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      .openPopup();

    console.log(map);
    map.on('click', function (mapEvent) {
      console.log(mapEvent)
      const lat = mapEvent.latlng.lat
      const lng = mapEvent.latlng.lng
      L.marker([lat, lng]).addTo(map)
        .bindPopup('Workout')
        .openPopup();

      // accesiblity marker
      var marker = L.marker([latitude, longitude],
        { alt: 'Kyiv' }).addTo(map) // "Kyiv" is the accessible name of this marker
        .bindPopup('');



    });



  },
  function () {
    alert("Could not get postion.");
  }
)

let myAPIKey = "eed0b2168abd4f9f9f8d578ead73caf7";

// display found address
function geocodeAddress() {
  const address = document.getElementById("address").value;
  if (!address || address.length < 3) {
    document.getElementById("status").textContent = "The address string is too short. Enter at least three symbols";
    return;
  }

  const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${myAPIKey}`;

  // call Geocoding API - https://www.geoapify.com/geocoding-api/
  fetch(geocodingUrl).then(result => result.json())
    .then(featureCollection => {
      if (featureCollection.features.length === 0) {
        document.getElementById("status").textContent = "The address is not found";
        return;
      }

      const foundAddress = featureCollection.features[0];
      document.getElementById("name").value = foundAddress.properties.name || '';
      document.getElementById("house-number").value = foundAddress.properties.housenumber || '';
      document.getElementById("street").value = foundAddress.properties.street || '';
      document.getElementById("postcode").value = foundAddress.properties.postcode || '';
      document.getElementById("city").value = foundAddress.properties.city || '';
      document.getElementById("state").value = foundAddress.properties.state || '';
      document.getElementById("country").value = foundAddress.properties.country || '';

      document.getElementById("status").textContent = `Found address: ${foundAddress.properties.formatted}`;
    });


// Marker to save the position of found address
let marker;
  // remove the previously added marker
  if (marker) {
    marker.remove();
  }

  fetch(geocodingUrl).then(result => result.json())
    .then(featureCollection => {



      // add a new marker and adjust the map view
      marker = L.marker(new L.LatLng(foundAddress.properties.lat, foundAddress.properties.lon)).addTo(map);
      map.panTo(new L.LatLng(foundAddress.properties.lat, foundAddress.properties.lon));
    });

}