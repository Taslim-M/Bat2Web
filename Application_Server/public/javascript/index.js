let map;
var allMarkers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 25.3026511, lng: 55.4818249 },
        zoom: 8,
    });

    clearAllMarkers();
    console.log(parsed_incidents[0].bat_species);
    console.log(parsed_incidents[0].latitude);

    for (var incid of parsed_incidents){
        console.log(incid.latitude);

        const marker = new google.maps.Marker({
            position: { lat: incid.latitude, lng: incid.longitude },
            map: map,
        });
    
        const contentString =
            '<div id="content">' +
                '<h3 id="firstHeading" class="firstHeading">'+ incid.bat_species+'</h3>' +
                    '<div id="bodyContent">' +
                    '<b>Time: </b>' + incid.time + 
                    '</br><b>Latitude: </b>' + incid.latitude + 
                    '</br><b>Longitude: </b>' + incid.longitude + 
                    "</div>" +
            "</div>";
    
        const infowindow = new google.maps.InfoWindow({
            content: contentString,
        });
        marker.addListener("click", () => {
            infowindow.open(map, marker);
        });

        allMarkers.push(marker);
    
    }

}

function clearAllMarkers(){
    for (var mk in allMarkers) {
        mk.setMap(null);
    }
    allMarkers = [];
}