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

    let medical_info = []

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

    function device_positions(){
        const latitude = 40.70390
        const longitude = -73.98670
        return [latitude, longitude]
    }

    async function generate_recommendations(){
        const pos = await device_positions()
        const device_coordinates = {
            'latitude': pos[0].toString(),
            'longitude': pos[1].toString(),
        }
        
        const nearby_med_arr = await get_nearby_medical_centers(device_coordinates)
        console.log(nearby_med_arr) 
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
        console.log(medical_info)       


    }

    function floatToStr(num){
        return num.toString().indexOf('.')
    }

</script>


<main>
    <button on:click = {generate_recommendations}>Click to initiate call</button>
    { #if medical_info.length == 0}
        <h1>There will be info here</h1>
    { :else }
        <ul>
            { #each medical_info as med_rec (med_rec.id)}
            <li>{med_rec.name}</li>
            {/each}
        </ul>
    { /if }
</main>