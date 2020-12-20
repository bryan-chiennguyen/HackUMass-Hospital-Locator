<script>
  let container;
  let map;
  let zoom = 15;
  let center = { lat: 42.3601, lng: -71.0589 };

  import { onMount } from "svelte";

  onMount(async () => {
    map = new google.maps.Map(container, {
      zoom,
      center,
    });
    let infoWindow = new google.maps.InfoWindow();
    const locationButton = document.createElement("button");


    locationButton.textContent = "Jump to My Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
    locationButton.addEventListener("click", () => {
      // Try HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            map.setCenter(pos);2
          },
          () => {
            handleLocationError(true, infoWindow, map.getCenter());
          }
        );
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    });
  });


</script>

<style>
  .full-screen {
    width: 100%;
    height: 100vh;
  }
</style>

<div id ="map" class="full-screen" bind:this={container} />
