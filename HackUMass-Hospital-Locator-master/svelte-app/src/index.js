let map;

var displayPosition = document.getElementById("map");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(initMap);
  }
  else {
    displayPosition.innerHTML = "Geolocation is not supported by this browser";
  }
}

function showPosition(position) {

}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}
