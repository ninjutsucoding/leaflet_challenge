//create map layer 
let myMap = L.map("map", {  
    center: [ 50 , -100 ],
    zoom: 5
});

//create tile layer 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//create link 
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson "

//create function to get marker size based off earthquake magnitude 
function getMarkerSize(magnitude) {
    return magnitude * 3; // Adjust the multiplier as needed
}

//create function to get marker color based off earthquake depth
function getColor(depth) {
    if (depth < 10) { return '#00FF00'; // green for shallow earthquake
    } else if (depth < 30) { return '#FFFF00'; // Yellow for moderate eq
    } else if (depth < 50) { return '#FFA500'; // Orange for depth < 50 km
    } else { return 'FF0000';}   // red for very deep eq
}

// connect to geojson api using d3
d3.json(link).then(function(data) {
    L.geoJson(data, {

        // describe how each earthquake will be represented on the map 
        pointToLayer: function(feature) {
            var lng = feature.geometry.coordinates[0]; // Longitude
            var lat = feature.geometry.coordinates[1]; // Latitude
            var depth = feature.geometry.coordinates[2]; // Depth

            //create the circle marker and the designated lat and lng for each earthquake 
            return L.circleMarker([lat, lng], {
                radius: getMarkerSize(feature.properties.mag), // Size based on magnitude
                fillColor: getColor(depth), // Color based on depth
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.5
            });
        },

        // create pop up for each point that provides the magnitude and depth of earthquake 
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + " km");
        }
     //add Geojson layer to map    
    }).addTo(myMap);
});