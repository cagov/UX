import getLatLon from './js/getlatlon.js';
import getDirections from './js/getdirections.js';
import getSteps from './js/getsteps.js';
import getObstructions from './js/getobstructions.js';

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
      let html = '<ul>';
      stepMap.forEach( (value, key, map) => {
        html += `<li>${key}</li>`;
      })
      html += "</ul>";  
      document.querySelector('.highways').innerHTML = html
  
      getObstructions(stepMap, { startCoords, endCoords }, function(myObstructions) {
        let majorhtml = '<ul>'
        let minorhtml = '<ul>'
        console.log(myObstructions);
        let foundMajor = false;
        let foundMinor = false;
        myObstructions.forEach( (obs) => {
          if(obs.lcs.closure.isCHINReportable == "true") {
            majorhtml += `<li>${obs.lcs.closure.facility}: ${obs.lcs.closure.typeOfWork}<br>
            closing: ${obs.lcs.closure.lanesClosed}<br>
            on ${obs.lcs.location.begin.beginRoute} affecting flow ${obs.lcs.location.travelFlowDirection}<br>
            near ${obs.lcs.location.begin.beginNearbyPlace}</li>`
            foundMajor = true;
          } else {
            minorhtml += `<li>${obs.lcs.closure.facility}: ${obs.lcs.closure.typeOfWork}<br>
            lanes closed: ${obs.lcs.closure.lanesClosed}<br>
            on ${obs.lcs.location.begin.beginRoute} affecting flow ${obs.lcs.location.travelFlowDirection}<br>
            near ${obs.lcs.location.begin.beginNearbyPlace}</li>`
            foundMinor = true;
          }
        })
        if(!foundMajor) {
          majorhtml += '<li>No major obstructions found</li>'
        }
        if(!foundMinor) {
          majorhtml += '<li>No minor obstructions found</li>'
        }
        minorhtml += '</ul>';
        majorhtml += '</ul>';
        document.querySelector('.obstructions-major').innerHTML = majorhtml;
        document.querySelector('.obstructions-minor').innerHTML = minorhtml;
      });
    });
  })
}

addListeners();