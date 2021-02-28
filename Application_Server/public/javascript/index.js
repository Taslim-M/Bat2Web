let map;
var allMarkers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.3026511, lng: 55.4818249 },
        zoom: 8,
    });

    const marker = new google.maps.Marker({
        position: { lat: 25.30265, lng: 55.48183 },
        map: map,
    });

    const contentString =
        '<div id="content">' +
            '<h3 id="firstHeading" class="firstHeading">'+parsed_incidents[0].bat_species+'</h3>' +
                '<div id="bodyContent">' +
                '<b>Time: </b>' + parsed_incidents[0].time + 
                '</br><b>Latitude: </b>' + parsed_incidents[0].latitude + 
                '</br><b>Longitude: </b>' + parsed_incidents[0].longitude + 
                "</div>" +
        "</div>";

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
    });
    marker.addListener("click", () => {
        infowindow.open(map, marker);
    });

}