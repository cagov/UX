import getLatLon from './js/getlatlon.js';
import getDirections from './js/getdirections.js';
import getSteps from './js/getsteps.js';
import getObstructions from './js/getobstructions.js';
import createHTML from './js/obstruction-html.js';

export default function addListeners() {
  document.querySelector('.destinationButton').addEventListener('click', async function(event) {
    event.preventDefault();
    readDestination();
  })
  
  document.querySelector('.startButton').addEventListener('click', async function(event) {
    event.preventDefault();
    let findDest = await readDestination();
    console.log(findDest)
    let endPlace = document.querySelector('#geocoderStart input').value;
    let startCoords = await getLatLon(endPlace);
    let errorSelector = document.querySelector('.error2');
    if(startCoords.status != '200') {
      errorSelector.innerHTML = startCoords.message;
      errorSelector.style.display = 'block'
    } else {
      hideErrors()
      window.startCoords = startCoords.center;
      document.querySelector('#geocoderStart input').value = startCoords.place_name;
      if(!isThatInCali(window.startCoords)) {
        errorSelector.innerHTML = "Location not found in California";
        errorSelector.style.display = 'block'
      }
    }
    areWeDoneYet()
  })

  function areWeDoneYet() {
    console.log('going to get steps')
    // need to check if within CA bbox
    if(window.endCoords && window.startCoords) {
      console.log('got spots')
      console.log(window.startCoords)
      console.log(window.startCoords)
      getDirections(`coordinates=${window.startCoords};${window.endCoords}&steps=true&banner_instructions=true`)
      .then((data) => {
        let stepMap = getSteps(data);  
        console.log(stepMap)
        let coords = { startCoords: window.startCoords, endCoords: window.endCoords }
        console.log(coords)
        getObstructions(stepMap, coords, function(myObstructions) {
          console.log('hello there')
          console.log(myObstructions)
          console.log('those are my obs')
          let obstructionHTML = createHTML(myObstructions, window.startCoords, window.endCoords);
          console.log('here')
          console.log(obstructionHTML)
          document.querySelector('.obstructions-major').innerHTML = obstructionHTML;
        });
      });  
    }
  }
}

addListeners();

function isThatInCali(coords) {
  let lat = coords[1];
  let lon = coords[0];
  // Cali bbox = xmin, ymin, xmax, ymax
  // -124.409591	32.534156	-114.131211	42.009518
  let caliYMin = 32.534156;
  let caliYMax = 42.009518;
  let caliXMin = -124.409591;
  let caliXMax = -114.131211;
  if(lat > caliYMin && lat < caliYMax && lon > caliXMin && lon < caliXMax) {
    return true;
  } else {
    return false;
  }
}

async function readDestination() {
  console.log('looking up destination')
  let myPlace = document.querySelector('#geocoder input').value;
  let endCoords = await getLatLon(myPlace);
  let errorSelector = document.querySelector('.error1');
  if(endCoords.status != '200') {
    errorSelector.innerHTML = endCoords.message;
    errorSelector.style.display = 'block'
  } else {
    hideErrors()
    window.endCoords = endCoords.center;
    document.querySelector('#geocoder input').value = endCoords.place_name;
    if(!isThatInCali(window.endCoords)) {
      errorSelector.innerHTML = "Location not found in California";
      errorSelector.style.display = 'block'
    }
  }
  return 'done';
}

function hideErrors() {
  document.querySelector('.error1').style.display = 'none';
  document.querySelector('.error2').style.display = 'none';
}
mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25oYW5zIiwiYSI6ImNqNGs4cms1ZzBocXkyd3FzZGs3a3VtamYifQ.HQjFfVzwwxwCmGr2nvnvSA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-79.4512, 43.6568],
  zoom: 13
});
  
window.geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  placeholder: ' ',
  bbox: [-124.409591, 32.534156, -114.131211, 42.009518],
  mapboxgl: mapboxgl
}).on('result',async function(item) {
  window.endCoords = item.result.center;
  hideErrors()
  if(window.startCoords) {
    displayObs();
  } else {
    window.geocoderStart.clear();
  }
})
   
document.getElementById('geocoder').appendChild(window.geocoder.onAdd(map));

window.geocoderStart = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  placeholder: ' ',
  bbox: [-124.409591, 32.534156, -114.131211, 42.009518],
  mapboxgl: mapboxgl
}).on('result',async function(item) {
  let findDest = await readDestination();
  console.log(findDest)
  window.startCoords = item.result.center;
  hideErrors()
  displayObs();
})

document.getElementById('geocoderStart').appendChild(window.geocoderStart.onAdd(map));

function displayObs() {
  getDirections(`coordinates=${window.startCoords};${window.endCoords}&steps=true&banner_instructions=true`)
  .then((data) => {
    let stepMap = getSteps(data);

    console.log('steps received are')
    console.log(stepMap)

    getObstructions(stepMap, { startCoords: window.startCoords, endCoords: window.endCoords }, function(myObstructions) {
      console.log('obstructions are:')
      console.log(myObstructions)
      document.querySelector('.obstructions-major').innerHTML = createHTML(myObstructions, window.startCoords, window.endCoords);
    });
  });
}
