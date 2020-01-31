import getLatLon from './js/getlatlon.js';
import getDirections from './js/getdirections.js';
import getSteps from './js/getsteps.js';
import getObstructions from './js/getobstructions.js';
import createHTML from './js/obstruction-html.js';

export default function addListeners() {
  let startCoords, endCoords;

  document.querySelector('.find1').addEventListener('click', async function(event) {
    event.preventDefault();
    let place = document.querySelector('.place1').value;
    startCoords = await getLatLon(place);
    document.querySelector('.start').innerHTML = startCoords;
  })
  
  document.querySelector('.find2').addEventListener('click', async function(event) {
    event.preventDefault();
    let endPlace = document.querySelector('.place2').value;
    endCoords = await getLatLon(endPlace);
    // endCoords = '-119.85251,38.54813'
    document.querySelector('.end').innerHTML = endCoords;
  
    getDirections(`coordinates=${document.querySelector('.start').innerHTML};${document.querySelector('.end').innerHTML}&steps=true&banner_instructions=true`)
    .then((data) => {
      let stepMap = getSteps(data);
  
      getObstructions(stepMap, { startCoords, endCoords }, function(myObstructions) {
        document.querySelector('.obstructions-major').innerHTML = createHTML(myObstructions);
        // document.querySelector('.obstructions-minor').innerHTML = minorhtml;
      });
    });
  })
}

let startCoords, endCoords;

mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25oYW5zIiwiYSI6ImNqNGs4cms1ZzBocXkyd3FzZGs3a3VtamYifQ.HQjFfVzwwxwCmGr2nvnvSA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-79.4512, 43.6568],
  zoom: 13
});
  
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
}).on('result',function(item) {
  document.querySelector('.js-destination-address').innerHTML = `<p class="lead bold mb-0">Destination address:</p>
  ${item.result.place_name}`;
  document.querySelector('.js-destination-address').style.display = 'block';
  endCoords = item.result.center;

  document.querySelector('.js-start-input').style.display = 'block'
})
   
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

var geocoderStart = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
}).on('result',function(item) {
  document.querySelector('.js-starting-address').innerHTML = `<p class="lead bold mb-0">Starting address:</p>
  ${item.result.place_name}`;
  document.querySelector('.js-starting-address').style.display = 'block';
  startCoords = item.result.center;
  displayObs();
})

document.getElementById('geocoderStart').appendChild(geocoderStart.onAdd(map));

function displayObs() {
  getDirections(`coordinates=${startCoords};${endCoords}&steps=true&banner_instructions=true`)
  .then((data) => {
    let stepMap = getSteps(data);

    getObstructions(stepMap, { startCoords, endCoords }, function(myObstructions) {
      document.querySelector('.obstructions-major').innerHTML = createHTML(myObstructions);
      // document.querySelector('.obstructions-minor').innerHTML = minorhtml;
      location.hash = "#obstructions";
    });
  });
}
