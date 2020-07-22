const map = L.map('map').setView([23, 90], 6);
let markersLayer = new L.FeatureGroup();
let markersArray = [];
let markersLocation = [];
let popup = L.popup({keepInView: true});

const stationIcon = L.icon({
  iconUrl: './assets/icons/pin-station.svg',
  shadowUrl: './assets/icons/pin-station-shadow.svg',

  iconSize:     [40, 40], // size of the icon
  shadowSize:   [50, 50], // size of the shadow
  iconAnchor:   [20, 40], // point of the icon which will correspond to marker's location
  shadowAnchor: [10, 30],  // the same for the shadow
  popupAnchor:  [0, -40] // point from which the popup should open relative to the iconAnchor
});

// development api key. need to change before deploying
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 16,
    id: 'mapbox/outdoors-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicmF3aGFzYW4iLCJhIjoiY2tjdWNpZDZmMTE4czJxcDR4cWRvZnN6YiJ9.x7CSqT1d7MwHS3mhixjS-Q'
}).addTo(map);

// show user location upon loading the app
displayUserLocation();


// display user location on the map
function displayUserLocation() {
  map.locate({setView: true, maxZoom: 8});

  function onLocationFound(e) {
    var radius = e.accuracy;

    // L.circle(e.latlng, radius).addTo(map);
    L.circle(e.latlng, 200).addTo(map);
  }

  function onLocationError(e) {
    alert(e.message);
  }

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);
}



// display startion markers from the provided object with the locations
// expects the global trainRoute {}
function mapRouteStations(locationArray) { 
  let markerIndex = 0; 

  // remove all the existing markers from the map
  markersLayer.clearLayers();
  markersArray = [];
  markersLocation = [];

  // itirate the global trainRoute {} passed as argument (? - use the trainRoute {} directly)
  if (locationArray.length > 0) {
    locationArray.forEach(loc => {
      
      let marker = L.marker({lat: loc.location.lat, lon: loc.location.lng}, {
        icon: stationIcon,
        title: loc.station + ' Station',
        station: loc.station,
        index: markerIndex,
        riseOnHover: true
      });

      markerIndex++;

      marker.on('click', routeMarkerOnClick);
      markersLayer.addLayer(marker);
      markersArray.push(marker);
      markersLocation.push([loc.location.lat, loc.location.lng]);
    });

    // drawLines(markersLocation); // drawing lines before the Lines object integration
    markersLayer.addTo(map);

    fitMapView();
  }
}



// handle marker click from the train route display
function routeMarkerOnClick(e) {
  let station = e.target.options.station;
  let index = e.target.options.index;

  popup = e.target.getPopup();

  let stationDetails = getStationDetails(index);
  stationItirator = index;

  if (!popup) e.target.bindPopup(stationDetails).openPopup(); 
}





// display the marker of the station currently showing the schedule for
// open a popup and fit the map bounds
function mapScheduleStation(station) {
  // remove all the existing markers from the map
  markersLayer.clearLayers();
  mapStation(station);
  // map.panTo(mapStation(station));

  fitMapView(8);
  // map.panTo(loc);
}





// display the transit map between the origin and destination station
// draw lines between them and open popups on both stations
function mapTransit(originStation, destinationStation) {
  let origin = stations.find(loc => loc.station == originStation);
  let destination = stations.find(loc => loc.station == destinationStation);

  if (!origin || !destination) return;

  markersLayer.clearLayers();

  let originLocation = mapStation(originStation);
  let destinationLocation = mapStation(destinationStation);

  drawLines([originLocation, destinationLocation]);
  // map.fitBounds(markersLayer.getBounds());

  fitMapView(8);
}






// ****************
// helper functions

// display a single station on the map
// expects the short name of the station
function mapStation(station, openAllPopup = false) { 
  let matchedStation = stations.find(loc => loc.station == station);
  
  if (matchedStation) {
    let loc = matchedStation.location; 

    let marker = L.marker({lat: loc.lat, lon: loc.lng}, {
      icon: stationIcon,
      title: matchedStation.station + ' Station',
      station: loc.station,
      riseOnHover: true
    });

    marker.on('click', () => showDisplayBar());

    markersLayer.addLayer(marker);
    markersLayer.addTo(map);

    marker.bindPopup(`<h3 class="info-window">${matchedStation.station} Station</h3>`,
      { autoClose: openAllPopup }).openPopup();
  }

  return matchedStation.location;
}



function drawRouteLines(line) {
  let linesArray = [];
  let routeLines = lines.find(matchedLine => matchedLine.line == line);
  
  if (routeLines) {
    let routeLinesArray = routeLines.route;
    if (routeLinesArray) {
      console.log(routeLinesArray);

      routeLinesArray.forEach(rl => {
        linesArray.push(stations.find(st => st.station == rl).location);
      })

      console.log(linesArray);
      drawLines(linesArray);
    }
  }
}



// draw lines between the locations provided in an array
function drawLines(locationArray) {
  // use color from CSS Variable for the line color of the markers
  let cssColor = getComputedStyle(document.body).getPropertyValue('--tertiary');

  // dotted line to connect the station markers
  let lines = L.polyline(locationArray, {
    color: cssColor,
    weight: 6,
    opacity: 0.7,
    dashArray: '5, 10'
  });

  markersLayer.addLayer(lines);
}



// fit the map view to accommodate all the markers
function fitMapView(zoom = 9) {
  map.fitBounds(markersLayer.getBounds());
  map.setMaxZoom(zoom);
  
  // if (window.matchMedia('screen and (max-width: 700px)').matches) {
  //   map.setZoom(7);
  // } else {
  //   map.setZoom(8);
  // }
}