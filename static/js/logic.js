// Initialize the map
var myMap = L.map("map").setView([37.09, -95.71], 5); // Centered on the US

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
}).addTo(myMap);

// Define the URL for the GeoJSON data
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine the color based on depth
function getColor(depth) {
    return depth > 90 ? "#ff0000" :  // Red for depths greater than 90
           depth > 70 ? "#ff3300" :  // Dark orange
           depth > 50 ? "#ff6600" :  // Orange
           depth > 30 ? "#ff9900" :  // Light orange
           depth > 10 ? "#ccff00" :  // Light green
                        "#00ff00";  // Green for shallow depths
}


// Fetch the GeoJSON data
d3.json(url).then(data => {
    // Create a GeoJSON layer and add it to the map
    L.geoJSON(data, {
        onEachFeature: function (feature, layer) {
            // Add popups
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2] + " m");
        },
        pointToLayer: function (feature, latlng) {
            var magnitude = feature.properties.mag;
            var depth = feature.geometry.coordinates[2];
            
            return L.circleMarker(latlng, {
                radius: magnitude * 2,
                fillColor: getColor(depth), 
                color: "black", 
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
        
    }).addTo(myMap);
}).catch(error => console.error("Error fetching the GeoJSON data: ", error));

// Create a legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Depth intervals
    let depths = [-10, 10, 30, 50, 70, 90];
    let colors = [
        "#00ff00",
        "#ccff00",
        "#ff9900",
        "#ff6600",
        "#ff3300", 
        "#ff0000" 
    ];

    // Loop through the depth intervals and add color bar 
    for (let i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<div style="display: flex; align-items: center;">' +
            '<i style="background:' + colors[i] + '; width: 20px; height: 20px; margin-right: 5px;"></i> ' +
            depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+") +
            '</div>';
    }

    return div;
};

// Add the legend to the map
legend.addTo(myMap);

