<!-- TODO:
    Writing: we need to do a few things:
        First, get the location from device
        Then, find all health/ hospitals within a certain radius (along with their locations)
        Then, use the API for distance and time estimates to find the nearest hospital from device
        Finally, display the name and location of the nearest to Google maps
    
    To do that, what do we need to do?
    Sign up
    Read the radar docs to see it is possible to do the steps
    Read the svelte docs to code it up
-->


<script>
import { select_option } from "svelte/internal";


    let user_position = {}
    let medical_info = []
    let call_state = "unused"

    function mark_map(name, location){
        var myLatlng = new google.maps.LatLng(location.latitude,location.longitude);
        var mapOptions = {
        zoom: 14,
        center: myLatlng
        }

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            title: name,
        });
        // To add the marker to the map, call setMap();
        marker.setMap(map);
    }

    function test_mark(name, location){
        const a = document.getElementById("map")
        console.log(a)
    }



    async function calculate_distance(device_position, destination){
        const distance_headers = new Headers();
        distance_headers.append('Authorization', process.env.TEST_CLIENT);

        const res = await fetch('https://api.radar.io/v1/route/distance?origin=' 
        + device_position.latitude +',' + device_position.longitude 
        + '&destination=' + destination.latitude +',' + destination.longitude + 
        '&modes=foot,bike,car&units=imperial', {
                method: 'GET',
                headers: distance_headers,
            })      

        const json = await res.json()
        const foot_numbers = {
            'distance': json.routes.foot.distance.text,
            'time': json.routes.foot.duration.text,
        }
        const bike_numbers = {
            'distance': json.routes.bike.distance.text,
            'time': json.routes.bike.duration.text,
        }
        const car_numbers = {
            'distance': json.routes.car.distance.text,
            'time': json.routes.car.duration.text,
        }
        const distances_and_time = {
            'foot': foot_numbers,
            'bike': bike_numbers,
            'car': car_numbers,
        }
        return distances_and_time
    }

    async function reverse_destination_info(destination){
        const auto_headers = new Headers();
        auto_headers.append('Authorization', process.env.TEST_CLIENT);
        const res = await fetch("https://api.radar.io/v1/geocode/reverse?coordinates="
        + destination.latitude + "," + destination.longitude, {
                method: 'GET',
                headers: auto_headers,
            })
        const json = await res.json()
        const place_address = json.addresses[0].formattedAddress
        return place_address
    }

    async function get_nearby_medical_centers(location){
        const find_headers = new Headers();
        find_headers.append('Authorization', process.env.TEST_CLIENT);
        const res = await fetch('https://api.radar.io/v1/search/places?categories=' 
        + 'emergency-room&near=' + location.latitude +',' + location.longitude + 
        '&radius=10000&limit=6', {
                method: 'GET',
                headers: find_headers,
            })
            
        const json = await res.json()
        return json.places
    }

    async function device_positions(){
        if (navigator.geolocation) {
        const a = navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              'latitude': position.coords.latitude,
              'longitude': position.coords.longitude,
            };
            console.log(position)
            user_position = position
            console.log(user_position)
          }
        );
        } 
    }

    async function generate_recommendations(){
        call_state = "calling"
        if (navigator.geolocation) {
        const a = navigator.geolocation.getCurrentPosition(
          async (position) => {
            const pos = {
              'latitude': position.coords.latitude,
              'longitude': position.coords.longitude,
            };
            // this is where
            const device_coordinates = {
            'latitude': pos.latitude.toString(),
            'longitude': pos.longitude.toString(),
            }
            
            const nearby_med_arr = await get_nearby_medical_centers(device_coordinates)
            const nearby_info = []
            for (const med of nearby_med_arr) {
                let representative_obj = {
                    'id': '',
                    'position': {},
                    'name': '',
                    'address': '',
                    'travel': {}
                }
                // console.log(med)
                representative_obj.id = med._id
                representative_obj.position = {
                    'latitude': med.location.coordinates[1], 
                    'longitude': med.location.coordinates[0],
                }
                representative_obj.name = med.name
                const destination = await reverse_destination_info(representative_obj.position)
                representative_obj.address = destination
                const distances = await calculate_distance(device_coordinates, representative_obj.position)
                representative_obj.travel = distances
                console.log(representative_obj)
                nearby_info.push(representative_obj)
            }

            medical_info = nearby_info 
            call_state = "done"
        }
        );
        } else {
            call_state = "bad connection"
        }
      
    }
</script>


<main>
    <div class = "p-4">


    { #if call_state == "unused"}
    <div>
        <h2 class=""> Emergency Locator. </h2>
        <p class="lead" style = "font-size: 18px">Need to locate the closest hospital(s) in your area? You've come to the right app.</p>
        <a class="btn btn-outline-primary" role="button" on:click = {generate_recommendations}>Locate now</a>
    </div>
    { :else if call_state === "calling"}
    <p class="lead" style = "font-size: 18px">Loading...</p>
    { :else if call_state == "done"}
            { #each medical_info as med_rec (med_rec.id)}
            <div class="card border-info w-75 w-25 card-self-built">
                <div class="card-body">
                  <h5 class="card-title">{med_rec.name}</h5>
                  <p class="card-text">Address: {med_rec.address}</p>
                  <p class = "card-text" style = "font-size: 14px;">
                    Modes of transport: <br>
                    Foot - {med_rec.travel.foot.distance} - {med_rec.travel.foot.time} <br>
                    Bike - {med_rec.travel.bike.distance} - {med_rec.travel.bike.time} <br>
                    Car - {med_rec.travel.car.distance} - {med_rec.travel.car.time}
                    </p>
                  <a class="btn btn-outline-info" on:click =  {mark_map(med_rec.name, med_rec.position)}>Directions</a>
                </div>
              </div>
            {/each}
    { /if }
    </div>
</main>

<style>
.card-self-built{
    background-color: beige;
    margin: 0 auto;
}
</style>