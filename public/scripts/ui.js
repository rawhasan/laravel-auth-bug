const trainMenu = document.querySelector('#primary-bar-nav-train-route');
const stationMenu = document.querySelector('#primary-bar-nav-station-schedule');
const transitMenu = document.querySelector('#primary-bar-nav-transit');

const trainForm = document.querySelector('#train-form');
const scheduleForm = document.querySelector('#schedule-form');
const transitForm = document.querySelector('#transit-form');

// const navItems = document.querySelectorAll('.nav-item');

// const burger = document.querySelector('.burger');
// const primaryBar = document.querySelector('.primary-bar'); // <div>
const displayBar = document.querySelector('.display-bar'); // <div>


const trainSelect = document.querySelector('#train-select');
const trainDataList = document.querySelector('#train-data-list');

const stationSelect = document.querySelector('#station-select');
const stationDataList = document.querySelector('#station-data-list');

const originSelect = document.querySelector('#origin-select');
const destinationSelect = document.querySelector('#destination-select');

const primaryDisplay = document.querySelector('#primary-display');

const btnPrevStation = document.querySelector('#prev-station');
// const btnCurrentStation = document.querySelector('#current-station');
const btnNextStation = document.querySelector('#next-station');

trainForm.addEventListener('submit', trainFormSubmit);
scheduleForm.addEventListener('submit', scheduleFormSubmit);
transitForm.addEventListener('submit', transitFormSubmit);

// add the slide button on the display bar
const slideButtonHTML = `<div class="slide-button" onClick="slideButtonClick()"></div>`;

// btnPrevStation.addEventListener('click', showPreviousStation);
// btnCurrentStation.addEventListener('click', showCurrentStation);
// btnNextStation.addEventListener('click', showNextStation);

// slide the nav sidebar
// burger.addEventListener('click', () => {
//   // toggle nav
//   primaryBar.classList.toggle('primary-bar-active');
//   // displayBar.classList.toggle('display-bar-active');

//   // burger animation
//   burger.classList.toggle('toggle');
// }); 





// display the forms according to the selection by the user
trainMenu.addEventListener('click', trainFormClick);

function trainFormClick(e) {
  navItems[0].classList.add('active');
  navItems[1].classList.remove('active');
  navItems[2].classList.remove('active');
  
  trainForm.style.display = 'flex';
  scheduleForm.style.display = 'none';
  transitForm.style.display = 'none';
}

stationMenu.addEventListener('click', (e) => {
  navItems[0].classList.remove('active');
  navItems[1].classList.add('active');
  navItems[2].classList.remove('active');

  trainForm.style.display = 'none';
  scheduleForm.style.display = 'flex';
  transitForm.style.display = 'none';
});

transitMenu.addEventListener('click', (e) => {
  navItems[0].classList.remove('active');
  navItems[1].classList.remove('active');
  navItems[2].classList.add('active');

  trainForm.style.display = 'none';
  scheduleForm.style.display = 'none';
  transitForm.style.display = 'flex';
});


// navSlide();



// form submission to show train route
function trainFormSubmit(e) {
  e.preventDefault();

  // get the selected train by the user from the data list
  let trainSelected = trainSelect.value;
  if ((trainSelected == '') || (trainSelected == currentTrain.train)) return;

  const trainName = document.querySelector("#train-data-list option[value='" + trainSelected + "']").dataset.train;

  generateTrainRoute(trainName);
  // showCurrentStation();

  // add the slide button
  displayBar.innerHTML += slideButtonHTML;
  
  // hide the right sidebar
  primaryBar.classList.remove('primary-bar-active');
  burger.classList.remove('toggle');
    
  // show the station markers on the train route
  mapRouteStations(trainRoute);

  // draw the train route lines including the non-stopping stations
  let trainLine = currentTrain.line;
  if (trainLine) drawRouteLines(trainLine);
  
  e.target.reset();
}



// form submission to show station time table
function scheduleFormSubmit(e) {
  e.preventDefault();

  const stationSelected = stationSelect.value;
  if (stationSelected == '') return;

  const stationName = document.querySelector("#station-data-list option[value='" + stationSelected + "']").dataset.station;

  // display a marker on the station location
  mapScheduleStation(stationName);

  displayBar.innerHTML = getStationSchedule(stationName);
  displayBar.innerHTML += slideButtonHTML;

  hidePrimaryShowDisplayBar();

  e.target.reset();
}



// form submission to show transit between origin and destination station
function transitFormSubmit(e) {
  e.preventDefault();

  let originSelected = originSelect.value;
  let destinationSelected = destinationSelect.value;

  if (originSelected == '' || destinationSelected == '' || originSelected == destinationSelected) return;

  let origin = document.querySelector("#station-data-list option[value='" + originSelected + "']").dataset.station;  
  let destination = document.querySelector("#station-data-list option[value='" + destinationSelected + "']").dataset.station;

  displayBar.innerHTML = getTransitInfo(origin, destination)['transit'];
  displayBar.innerHTML += getTransitInfo(origin, destination)['return'];
  displayBar.innerHTML += slideButtonHTML;

  mapTransit(origin, destination);
  hidePrimaryShowDisplayBar();

  e.target.reset();
}


// click even handler at the slide button on the display bar
function slideButtonClick() {
  if (displayBar.classList.contains('display-bar-active')) {
    displayBar.classList.remove('display-bar-active');
  }
}


// load the values on the form upon app load
document.addEventListener('DOMContentLoaded', () => {
  let trainNames = [];
  let trainNamesSorted = [];
  let trainNameOptions = '';
  let stationNames = [];
  let stationNameOptions = '';

  // show only the train form at the primary bar on load
  trainFormClick();

  // load placeholder texts for the input boxes for mobile view only
  if (window.matchMedia('screen and (max-width: 700px)').matches) {
    trainSelect.setAttribute('placeholder', 'Enter or select a train');
    stationSelect.setAttribute('placeholder', 'Enter or select a station');
    originSelect.setAttribute('placeholder', 'Enter or select the origin station');
    destinationSelect.setAttribute('placeholder', 'Enter or select the destination station');
  }

  // load all the running trains and stations from data to select elements
  trains.forEach(train => {
    if (train.running == 'Yes') {
      trainNames.push({short_name: train.train, full_name: train.name, train_no_up: train.train_no_up, train_no_down: train.train_no_down});
      train.route.forEach(stationObj => !stationNames.includes(stationObj.station) ? stationNames.push(stationObj.station) : '');
    }
  });

  // sort the train names
  trainNamesSorted = trainNames.sort((a, b) => {
    if (a.full_name > b.full_name) return 1;
    else if (a.full_name < b.full_name) return -1;
    else return 0;
  });

  // load the sorted train names on the select element
  trainNamesSorted.forEach(train => {
    trainNameOptions += `<option data-train="${train.short_name}" value="${train.full_name} (${train.train_no_up}, ${train.train_no_down})"></option>`; 
  });

  trainDataList.innerHTML = trainNameOptions;

  // load the sorted station names on the datalist element
  stationNames = stationNames.sort();
  stationNames.forEach(stationName => {
    stationNameOptions += `<option data-station="${stationName}" value="${stationName} Station"></option>`;
  });

  stationDataList.innerHTML = stationNameOptions;
  originSelect.innerHTML = stationNameOptions;
  destinationSelect.innerHTML = stationNameOptions;
}); // end of DOMContentLoaded event



// function for the next station button in popup window
function showNextStation() {
  // do nothing if no train is selected to show route
  if (!currentTrain) return;

  stationItirator++;
  if (stationItirator >= trainRoute.length) stationItirator = 0;

  let stationDetails = getStationDetails(stationItirator);
  markersArray[stationItirator].bindPopup(stationDetails).openPopup();
}



// function for the previous station button in popup window
function showPreviousStation() {
   // do nothing if no train is selected to show route
   if (!currentTrain) return;

   stationItirator--;
   if (stationItirator < 0) stationItirator = trainRoute.length - 1;
 
   let stationDetails = getStationDetails(stationItirator);
   markersArray[stationItirator].bindPopup(stationDetails).openPopup();
}



// function for the current station button
function showCurrentStationSchedule() {
  // do nothing if no train is selected to show route
  if (!currentTrain) return;

  const stationName = trainRoute[stationItirator].station;

  displayBar.innerHTML = getStationSchedule(stationName);
  displayBar.innerHTML += slideButtonHTML;

  showDisplayBar();
}



// ****************
// helper functions

function hidePrimaryShowDisplayBar() {
  // show the display bar if not visible
  showDisplayBar();

  // hide the right sidebar
  primaryBar.classList.remove('primary-bar-active');
  burger.classList.remove('toggle');
}


// show the display bar if not visible
function showDisplayBar() {
  if (!displayBar.classList.contains('display-bar-active')) {
    displayBar.classList.add('display-bar-active');
  }
}



