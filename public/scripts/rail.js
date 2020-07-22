let trainRoute = [];
let currentTrain = '';
let stationItirator = 0;
let stationTimeTable = [];
const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeRegex = "^([0-1][0-9]|2[0-3]):([0-5][0-9])$";



// ***********************************
// train route display functionalities

// main function to generate the route of a train
// expects the short name of any train from data
function generateTrainRoute(trainShortName) {
  trainRoute = [];
  stationItirator = 0;

  // get the train {} to show route 
  currentTrain = trains.find(train => (train.train == trainShortName) && (train.running == 'Yes'));
  if (!currentTrain) return;

  const currentTrainRoute = currentTrain.route;

  // get the route stations of the train {}
  currentTrainRoute.forEach(niddleStationObj => {
    const matchedStationObj = stations.filter(matchingStation => {
      return matchingStation.station == niddleStationObj.station;
    });

    // construct the train route {}
    trainRoute.push({...niddleStationObj, ...matchedStationObj[0]});
  });
} 



// generate details of any station on the train route for displaying
// expects index of the station from the current train route
function getStationDetails(stationIndex) {
  let currentStation = trainRoute[stationIndex];
  let sameDayOff = true;

  // check day off for both direction of the train
  if (currentTrain.day_off_up !== currentTrain.day_off_down) sameDayOff = false;
  
  // generate the header (train name, starting and ending station)
  let stationInfo = `<div class="info-window"><div class="current-train ${currentTrain.rack_type.toLowerCase()}"><h3>${currentTrain.name}</h3>
    <h5>${trainRoute[0].station} - ${trainRoute[trainRoute.length - 1].station}</h5></div>
    <div class="current-station"><h4>${currentStation.station} Station</h4>`;
  
  // hide down-time for the ending station
  if (stationIndex !== (trainRoute.length - 1)) {
    stationInfo += `<div class="train"><span class="time">${currentStation.up}</span> <span class="train-no">${currentTrain.train_no_up}</span> &nbsp; ${trainRoute[trainRoute.length - 1].station}${!sameDayOff && dayOfWeek.includes(currentTrain.day_off_up) ? ' (' + currentTrain.day_off_up + ' Off)' : ''}</div>`;
  }

  // hide down-time for the starting station
  if (stationIndex !== 0) {
    stationInfo += `<div class="train"><span class="time">${currentStation.down}</span> <span class="train-no">${currentTrain.train_no_down}</span> &nbsp; ${trainRoute[0].station} ${!sameDayOff && dayOfWeek.includes(currentTrain.day_off_down) ? '(' + currentTrain.day_off_down + ' Off)' : ''}</div>`;
  }

  if (sameDayOff)
    stationInfo += `<div class="day-off"><h4>Day Off:</h4> ${currentTrain.day_off_up}</div></div>`;

  // show class & food information if available
  let classes = currentTrain.class_available;
  let food = currentTrain.food_available;

  // add the class information of the train
  if (getAvailableFacilities(classes)) 
    stationInfo += getAvailableFacilities(classes, '<div class="train-classes"><h4>Classes on the Train</h4>');
  
  // add the food information of the train  
  if (getAvailableFacilities(food)) stationInfo += getAvailableFacilities(food, '<div class="train-food"><h4>Food on the Train</h4>');

  stationInfo += `
    <div class="info-controls">
      <button id="info-prev-station" onClick="showPreviousStation()"><</button>
      <button id="info-station-schedule" onClick="showCurrentStationSchedule()">Station Schedule</button>
      <button id="info-next-station" onClick=showNextStation()>></button>
    </div>
  `
  stationInfo += `</div>`

  return stationInfo;
} 



// return the facilities of a train if available
// expects an array of facilities as parameter
function getAvailableFacilities(facilities, description = '') {
  return facilities.length == 0 ? false : `${description}<p>${facilities.join(', ')}</p></div>`;
}

// end of the train route display functionalities
// **********************************************







// ******************************************
// station schedule display functionalities

// display the schedule of any given station, grouped and sorted by destination
// expects the short name of the station
function getStationSchedule(niddleStation) {
  const stationSchedule = [];
  let endStation = false;

  // insert advert space
  let ungroupedDepartures = createAdvertHTML('advert-infobar-route');
  ungroupedDepartures += '<div class="ungrouped">';

  // get the station photo
  let niddleStationImage = getStationImagePath(niddleStation);
  
  let heading =`<div class="station-schedule bar-info"><div class="header" style="background-image: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.95)), url(${niddleStationImage});"><h3>${niddleStation} Station</h3><h5>Train Schedule</h5></div>`;

  // add div for the photo credit of the station
  heading += getPhotoCredit(niddleStation);
  
  // find all trains including the niddle station & currently running
  const matchedTrains = trains.filter(matchedTrain => {
    return matchedTrain.route.find(singleStation => (singleStation.station == niddleStation) && (matchedTrain.running == 'Yes'));
  });

  // no train found for the station
  if (matchedTrains.length == 0) return false; 

  // one or more train forund for the station
  matchedTrains.forEach(train => {
    const matchedStation = train.route.find(singleStation => singleStation.station == niddleStation);

    const upStation = train.route[train.route.length - 1].station;
    const downStation = train.route[0].station;

    // check if the matched station is any end station for sorting
    if (matchedStation.station == upStation || matchedStation.station == downStation) 
      endStation = true; 

    // add up station only if not the same as the niddle station
    // and filter out the no-stop stations
    if (upStation !== niddleStation && matchedStation.up.match(timeRegex)) {
      stationSchedule.push({time: matchedStation.up, destination: upStation, train_no: train.train_no_up, train_name: train.name, day_off: train.day_off_up}); // ?
    }

    // add down station only if not the same as the niddle station
    // and filter out the no-stop stations
    if (downStation !== niddleStation && matchedStation.down.match(timeRegex)) {
      stationSchedule.push({time: matchedStation.down, destination: downStation, train_no: train.train_no_down, train_name: train.name, day_off: train.day_off_down});
    }
  });

  let groupedSchedule = scheduleGroupedSorted(stationSchedule);
  
  if (groupedSchedule) {
    // insert advert space
    return heading + createAdvertHTML('advert-infobar-route') 
      + generateSortedSchedule(groupedSchedule) + '</div>';

  } else {
    stationSchedule.forEach(departure => {
      ungroupedDepartures += `<div class="train"><span class="time">${departure.time}</span> &nbsp; ${departure.destination}<br/><span class="train-no">${departure.train_no}</span> &nbsp; ${departure.train_name} ${dayOfWeek.includes(departure.day_off) ? '(' + departure.day_off + ' Off)' : '' }</div>`;
    });

    ungroupedDepartures += '</div>'
    
    // displayBar.innerHTML = heading + ungroupedDepartures + '</div>';
    return heading + ungroupedDepartures + '</div>';
  }
} // end of function



// group and sort schedule for the stations
// expects the array of time-table object generated from the train routes primarily
function scheduleGroupedSorted(stationSchedule) {
  const newSchedule = [];
  const addedStations = [];
  let filteredDestinations;
  let foundGroup = false;

  // sort the schedule by time primarily
  if (stationSchedule.length > 1) {
    stationSchedule.sort((a, b) => {
      if (a.time > b.time) return 1;
      else if (a.time < b.time) return -1;
      else return 0;
    });
  }

  // grouping by destinations
  for (let i = 0; i < stationSchedule.length; i++) {
    let currentDestination = stationSchedule[i].destination;

    // add unique stations on a temporry array
    if (!addedStations.includes(currentDestination)) {
      filteredDestinations = stationSchedule.filter(filteredDestination => {
        return filteredDestination.destination == currentDestination;
      });
      
      addedStations.push(currentDestination);
      
      // for multime matching destination, push all of them 
      // directly in the array with the destination as the key.
      // push all single matching destinations under the 'other' key.
      if (filteredDestinations.length > 1) { 
        newSchedule.push({group: currentDestination, departures: filteredDestinations}); 
        foundGroup = true;
      } else {
        let otherGroup = newSchedule.find(currentGroup => currentGroup.group === 'Other');

        if (otherGroup) {
          otherGroup.departures.push(filteredDestinations[0]); 
        } else {
          newSchedule.push({group: 'Other', departures: [filteredDestinations[0]]}); 
        }
      }
    }
  }

  // (?-1) Bug - Group sorting is not working for some stations (Kopotakha)
  // console.log('Before group sorting', newSchedule);

  // finally sort the destination groups and push 'Other' to the bottom
  let newSortedTimeTable = newSchedule.sort((a, b) => {  
    if (a.group > b.group) return 1;
    else if (a.group < b.group) return -1;
    else return 0;
  });

  // push the other group to the end
  newSortedTimeTable = newSortedTimeTable.sort((a, b) => {
    if (a.group.toLowerCase == 'other') return 1;
    else if (b.group.toLowerCase == 'other') return 1;
  });

  if (foundGroup) return newSortedTimeTable;
  else return false;
} // end of function



function generateSortedSchedule(schedule) {
  let formattedSchedule = '';

  schedule.forEach(currentGroup => {
    // generate the group names
    let destination = currentGroup.group;

    if (destination !== 'Other') {
        formattedSchedule += `<div class="group"><h4>${destination}</h4>`;
    } else {
      formattedSchedule += `<div class="group"><h4>${destination} Destinations</h4>`;
    }

    // generate the departures
    currentGroup.departures.forEach(dest => { 
      if (destination !== 'Other') { 
        formattedSchedule += `<div class="train"><span class="time">${dest.time}</span> <span class="train-no">${dest.train_no}</span> &nbsp; ${dest.train_name} ${dayOfWeek.includes(dest.day_off) ? '(' + dest.day_off + ' Off)' : '' }</div>`;

      } else {
        formattedSchedule += `<div class="train"><span class="time">${dest.time}</span> &nbsp; ${dest.destination}<br /><span class="train-no">${dest.train_no}</span> &nbsp; ${dest.train_name} ${dayOfWeek.includes(dest.day_off) ? '(' + dest.day_off + ' Off)' : '' }</div>`;
      }
    });

    formattedSchedule += '</div>';

  });

  return formattedSchedule;
}

// end of the station schedule display functionalities
// ***************************************************






// ***********************************
// transit suggestion functionalities

// return HTML output of transit and return trains for origin and destination station
// expects the short name of the origin and destination station
function getTransitInfo(origin, destination) {

  let transitHTML = [];
  
  let originStationImage = getStationImagePath(origin);
  let destinationStationImage = getStationImagePath(destination);

  let matchedCurrentStations = [];
  let transitTrains = [];
  let returnTrains = [];
  let singleTrainMatched = false;

  let matchedTransit = `<div class="transit-info bar-info"><div class="header" style="background-image: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.95)), url(${originStationImage});"><h3>${origin}-${destination}</h3><h5>Available Trains</h5></div>`;

  // add the station photo credit and advert div with the origin station
  matchedTransit += getPhotoCredit(origin) + createAdvertHTML('advert-infobar-transit') + `<div class="ungrouped">`;
  
  let matchedReturn = `<div class="transit-info bar-info"><div class="header" style="background-image: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.95)), url(${destinationStationImage});"><h3>${destination}-${origin}</h3><h5>Available Trains</h5></div>`;

  // add the station photo credit and advert div with the return station
  matchedReturn += getPhotoCredit(destination) + createAdvertHTML('advert-infobar-return') + `<div class="ungrouped">`;

  trains.forEach(train => {
    matchedCurrentStations = train.route.filter(matchedStation => 
      matchedStation.station == origin || matchedStation.station == destination);

    if (matchedCurrentStations.length == 2) {
      let routeDirection = '', returnDirection = '';
      let routeTemp = [], returnTemp = [];
      let routeTrainNo = 'train_no_';
      let returnTrainNo = 'train_no_';

      let originTemp = matchedCurrentStations.find(stationObj => stationObj.station == origin);
      let destTemp = matchedCurrentStations.find(stationObj => stationObj.station == destination);

      // possible bug in comparison - need to compare both up and down
      if (originTemp.up < destTemp.up) {
        routeDirection = 'up';
        returnDirection = 'down';
      } else {
        routeDirection = 'down';
        returnDirection = 'up';
      }

      routeTrainNo += routeDirection;
      returnTrainNo += returnDirection;

      // filter out the stations with 'No Stop' in any direction
      if (originTemp[routeDirection].match(timeRegex) && destTemp[routeDirection].match(timeRegex)) {
        routeTemp.push({train_no: train[routeTrainNo], train_name: train.name, origin_station: originTemp.station, origin_time: originTemp[routeDirection], destination_station: destTemp.station, destination_time: destTemp[routeDirection], day_off: train.day_off});

        transitTrains.push(routeTemp[0]);
        singleTrainMatched = true;
      }

      if (destTemp[returnDirection].match(timeRegex) && originTemp[returnDirection].match(timeRegex)) {
        returnTemp.push({train_no: train[returnTrainNo], train_name: train.name, origin_station: destTemp.station, origin_time: destTemp[returnDirection], destination_station: originTemp.station, destination_time: originTemp[returnDirection], day_off: train.day_off});

        returnTrains.push(returnTemp[0]);
        singleTrainMatched = true;
      }
    
    } else {
      // bug: unexpected log output (bbsetu-biman bandar)
      console.log('Single train did not match. Looking for multiple train match...!')
    }
    
  });

  // sort the train schedules based of origin station time
  transitTrains = sortObject(transitTrains, 'origin_time');
  returnTrains = sortObject(returnTrains, 'origin_time');

  // display both of the scredules
  if (singleTrainMatched) {

    transitTrains.forEach(transitTrain => {
      matchedTransit += `<div class="train"><span class="train-no">${transitTrain.train_no}</span> ${transitTrain.train_name} ${dayOfWeek.includes(transitTrain.day_off) ? ' (' + transitTrain.day_off + ' Off)' : '' }<br/><span class="time">${transitTrain.origin_time}</span> ${transitTrain.origin_station}<br/><span class="time">${transitTrain.destination_time}</span> ${transitTrain.destination_station} </div>`;
    });

    returnTrains.forEach(returnTrain => {
      matchedReturn += `<div class="train"><span class="train-no">${returnTrain.train_no}</span> ${returnTrain.train_name} ${dayOfWeek.includes(returnTrain.day_off) ? ' (' + returnTrain.day_off + ' Off)' : '' }<br/><span class="time">${returnTrain.origin_time}</span> ${returnTrain.origin_station}<br/><span class="time">${returnTrain.destination_time}</span> ${returnTrain.destination_station} </div>`;
    });

    transitHTML['transit'] = matchedTransit + `</div>`;
    transitHTML['return'] = matchedReturn + `</div>`;
  
  } else {
    transitHTML['transit'] = matchedTransit + '<div class="ungrouped">Sorry, no train matched for this transit!</div>' + `</div>`;
    transitHTML['return'] = matchedReturn + '<div class="ungrouped">Sorry, no train matched for this transit!</div>' + `</div>`;
  }

  return transitHTML; 
}






// ****************
// helper functions

// sort any object based on the provided property and order
function sortObject(obj, property, order = 'assending') {
  if (order == 'assending') {
    return obj.sort((a,b) => {
      if (a[property] > b[property]) return 1;
      else if (a[property] < b[property]) return -1;
      else return 0;
    });
  } else {
    return obj.sort((a,b) => {
      if (a[property] < b[property]) return -1;
      else if (a[property] > b[property]) return 1;
      else return 0;
    });
  }
}



// generate the path of the station image from the station name
// expects a station full name e.g, "Biman Bandar Station" or "Biman Bandar"
function getStationImagePath(station) {

  let imagePath = station.toLowerCase().replace(/ station/gi, '').replace(/ /gi, '-');
  imagePath = './assets/station-images/' + imagePath + '.jpg';

  return fileExists(imagePath) ? imagePath : './assets/station-images/station.jpg';
}



// generate the photo credit for a given station
function getPhotoCredit(station) {
  let photoCredit = stations.find(st => st.station == station).photo_credit;

  if (photoCredit) {
    return `<div class="station-photo-credit">&copy; Photo Credit: ${photoCredit}</div>`;
  } else {
    return `<div class="station-photo-credit blank">Have a photo of this station? Send us via our Facebook page and get credit here.</div>`;
  }
}



// generate advert space
function createAdvertHTML(id, size="320px x 80px") {
  return `<div id="${id}" class="advert-space">
<div class="sponsor">Sponsor this space</div>
<div class="description">Place your ad here and support this site</div>
<div class="size">(${size})</div>
</div>`;
}



// bug: improve the function to avoid the synchronus warning in the console
// check if a file exists in the server
function fileExists(url)
{
    let http = new XMLHttpRequest();

    http.open('HEAD', url, false);
    http.send();

    return http.status != 404;
}
