export default function createHTML(myObstructions, startCoords, endCoords) {
  let obstructionMap = new Map();
  let incidentMap = new Map();
  myObstructions.forEach( (obs) => {
    if(obs.name && (obs.name.indexOf('CHP Incident') > -1 || obs.name == 'Caltrans Highway Information')) {
      incidentMap.set(`${obs.lat},${obs.lon}`,obs);
    } else {
      let obsKey = `${obs.lcs.location.begin.beginRoute} affecting flow ${obs.lcs.location.travelFlowDirection}`;
      if(obstructionMap.get(obsKey)) {
        let theseObstructions = obstructionMap.get(obsKey);
        theseObstructions.push(obs);
        obstructionMap.set(obsKey, theseObstructions)
      } else {
        obstructionMap.set(obsKey, [obs])
      }  
    }
  })
  
  let majorhtml = '<hr><h2 class="mt-20">Road conditions for your trip</h2>';
  let foundMajor = false;
  obstructionMap.forEach( (obstructionArray, key, map) => {
    let internalHTML = '';
    let uniqueObsMap = new Map();
    obstructionArray.forEach( (obs) => {
      if(!uniqueObsMap.get(obs.lcs.closure.closureID)) {
        uniqueObsMap.set(obs.lcs.closure.closureID,'here')
        if(obs.lcs.closure.isCHINReportable == "true") {
          // console.log(obs);
          // remove duplicates
          internalHTML += `<tr>
            <td>${obs.lcs.closure.typeOfWork}</td>
            <td>near ${obs.lcs.location.begin.beginNearbyPlace}</td>
            <td>Lanes closed: ${obs.lcs.closure.lanesClosed}</td>
          </tr>`
          foundMajor = true;
        } else {
          // skip these non chin reportable ones
        }
      }
    })

    if(internalHTML != '') {
      majorhtml += `<h3>${key}</h3>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th>Road condition</th><th>Landmark</th><th>Description</th>
          </tr>
        </thead>
        ${internalHTML}
      </table>`;
    }
  })
  if(incidentMap.length > 0) {
    majorhtml += '<h2>Incidents in the area</h2>'
  }
  incidentMap.forEach( (item, key, map) => {
    majorhtml += item.description
  })

  if(!foundMajor || myObstructions.length == 0) {
    majorhtml += '<p>No major obstructions on your route</p>'
  }

  function mapsSelector() {
    if((navigator.platform.indexOf("iPhone") != -1) || 
       (navigator.platform.indexOf("iPad") != -1) || 
       (navigator.platform.indexOf("iPod") != -1)) {
      return "maps://maps.google.com/";
    } else {
      return "https://maps.google.com/";
    }
  }

  let directionsUrl = `${mapsSelector()}/maps/dir/?api=1&origin=${document.querySelector('#geocoderStart input').value}&destination=${document.querySelector('#geocoder input').value}`;
  majorhtml += `<p>
    <a href="${directionsUrl}" target="_new" class="btn btn-primary">Get Directions</a>
  </p>`;

  console.log('foun major and returning '+foundMajor)
  console.log(majorhtml)

  return majorhtml;
}