<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"><!-- minimum-scale=1.0 added to hide overflow-x on mobile -->
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css" type="text/css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
   integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
   crossorigin=""/>

  <title>GeoRail Bangladesh - Railway info on a Google Map</title>
</head>
<body>
  <nav>
    <div class="logo">
      <h4><a href="/"><span>Geo</span><span>Rail</span> <span>| Bangladesh</span></a></h4>
    </div>

    <div class="burger">
      <div class="line1"></div>
      <div class="line2"></div>
      <div class="line3"></div>
    </div>
  </nav>

  <div id="map"></div>

  <!-- right side bar -->
  <div class="primary-bar bar">
    <div id="primary-bar-nav">
      <div id="primary-bar-nav-train-route">
        <div class="nav-item active"><img src="./assets/icons/station.svg" alt=""><span>Train</span></div>
      </div>
      <div id="primary-bar-nav-station-schedule">
        <div class="nav-item"><img src="./assets/icons/station.svg" alt=""><span>Station</span></div>
      </div>
      <div id="primary-bar-nav-transit">
        <div class="nav-item"><img src="./assets/icons/station.svg" alt=""><span>Transit</span></div>
      </div>
    </div>

    <form id="train-form">
      <label for="train-select">Select Train:</label>
      <input list="train-data-list" id="train-select" name="train-select" />
      <datalist id="train-data-list">
        <option data-train="Train Data" value="Test Train">
      </datalist>
      <button type="submit">Show Route</button>
    </form>

    <form id="schedule-form">
      <label for="station-select">Select Station:</label>
      <input list="station-data-list" id="station-select" name="station-select" />
      <datalist id="station-data-list">
        <option data-station="Station Data" value="Test Station">
      </datalist>
      <button type="submit">Show Schedule</button>
    </form>

    <form id="transit-form">
      <div>
        <label for="origin-select">Origin Station:</label>
        <input list="station-data-list" id="origin-select" name="origin-select" />
      </div>

      <div>
        <label for="destination-select">Destination Station:</label>
        <input list="station-data-list" id="destination-select" name="destination-select" />
      </div>

      <button type="submit">Show Transits</button>
    </form>

    @include('layouts.auth-user')
  </div>  
  <!-- end of right side bar -->

  <!-- left side bar -->
  <div class="display-bar bar">
    <div class="slide-icon"></div>
  </div>  
  <!-- end of left side bar -->

  <!-- <div class="branding logo">
    <h4><span>Geo</span><span>Rail</span> <span>| Bangladesh</span></h4>
  </div> -->

  <script src="./scripts/menu.js" type="text/javascript"></script>
  <script src="./scripts/ui.js" type="text/javascript"></script>
  <script src="./scripts/data.js" type="text/javascript"></script>
  <script src="./scripts/rail.js" type="text/javascript"></script>
  
  <!-- Make sure you put this AFTER Leaflet's CSS -->
  <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
   integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
   crossorigin=""></script>

  <script src="./scripts/map-osm.js" type="text/javascript"></script>
</body>
</html>