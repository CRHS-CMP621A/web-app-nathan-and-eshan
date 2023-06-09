//https://www.geoapify.com/tutorial/how-to-implement-geocoding-javascript-tutorial

let map;
let markers = [];
let Remove = document.querySelector(".remove");

class Marker {
  constructor(lat, lng, addressStr) {
    this.lat = lat;
    this.lng = lng;
    this.addressStr = addressStr;
  }
}

navigator.geolocation.getCurrentPosition(
  function (position) {
    // console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coords = [latitude, longitude];

    map = L.map("map").setView(coords, 13);

    // if (localStorage.length > 0) { //APAULS
    if (localStorage.getItem("markers") !== null) {
      //APAULS
      markers = JSON.parse(localStorage.getItem("markers"));
      console.log(markers); //APAULS

      for (let markerInfo of markers) {
        console.log(markerInfo);

        L.marker([markerInfo.lat, markerInfo.lng])
          .addTo(map)
          .bindPopup(markerInfo.addressStr)
          .openPopup();
      }
    }

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    console.log(map);
    map.on("click", function (mapEvent) {
      console.log(mapEvent);
      const lat = mapEvent.latlng.lat;
      const lng = mapEvent.latlng.lng;
    });
  },
  function () {
    alert("Could not get postion.");
  }
);

let myAPIKey = "eed0b2168abd4f9f9f8d578ead73caf7";

// display found address
function geocodeAddress() {
  const address = document.getElementById("address").value;
  if (!address || address.length < 3) {
    document.getElementById("status").textContent =
      "The address string is too short. Enter at least three symbols";
    return;
  }

  const geocodingUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    address
  )}&apiKey=${myAPIKey}`;

  // call Geocoding API - https://www.geoapify.com/geocoding-api/
  fetch(geocodingUrl)
    .then((result) => result.json())
    .then((featureCollection) => {
      console.log(featureCollection);
      if (featureCollection.features.length === 0) {
        document.getElementById("status").textContent =
          "The address is not found";
        return;
      }

      const foundAddress = featureCollection.features[0];
      document.getElementById("name").value =
        foundAddress.properties.name || "";
      document.getElementById("house-number").value =
        foundAddress.properties.housenumber || "";
      document.getElementById("street").value =
        foundAddress.properties.street || "";
      document.getElementById("postcode").value =
        foundAddress.properties.postcode || "";
      document.getElementById("city").value =
        foundAddress.properties.city || "";
      document.getElementById("state").value =
        foundAddress.properties.state || "";
      document.getElementById("country").value =
        foundAddress.properties.country || "";

      const lat = foundAddress.properties.lat;
      const lng = foundAddress.properties.lon;
      const addressStr =
        foundAddress.properties.housenumber +
        " " +
        foundAddress.properties.street;
      const markerInfo = new Marker(lat, lng, addressStr);
      markers.push(markerInfo);

      localStorage.setItem("markers", JSON.stringify(markers));

      L.marker([lat, lng])
        .addTo(map)

        .bindPopup(markerInfo.addressStr)
        .openPopup();

      document.getElementById(
        "status"
      ).textContent = `Found address: ${foundAddress.properties.formatted}`;
    });
}
function Remove_marker() {
  localStorage.clear();
}

Remove.addEventListener("click", Remove_marker);
