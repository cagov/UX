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

addListeners();