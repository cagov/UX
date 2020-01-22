export default function createHTML(myObstructions) {
  let obstructionMap = new Map();
  myObstructions.forEach( (obs) => {
    let obsKey = `${obs.lcs.location.begin.beginRoute} affecting flow ${obs.lcs.location.travelFlowDirection}`;
    if(obstructionMap.get(obsKey)) {
      let theseObstructions = obstructionMap.get(obsKey);
      theseObstructions.push(obs);
      obstructionMap.set(obsKey, theseObstructions)
    } else {
      obstructionMap.set(obsKey, [obs])
    }
  })
  
  let majorhtml = '<h2 class="mt-20">Road conditions for your trip</h2>';
  obstructionMap.forEach( (obstructionArray, key, map) => {
    console.log(myObstructions);
    let foundMajor = false;
    let internalHTML = '';
    obstructionArray.forEach( (obs) => {
      if(obs.lcs.closure.isCHINReportable == "true") {
        internalHTML += `<tr>
          <td>${obs.lcs.closure.typeOfWork}</td>
          <td>near ${obs.lcs.location.begin.beginNearbyPlace}</td>
          <td>Lanes closed: ${obs.lcs.closure.lanesClosed}</td>
        </tr>`
        foundMajor = true;
      } else {
        // skip these non chin reportable ones
      }
    })

    if(internalHTML != '') {
      majorhtml += `<h3>${key}</h3>
      <table class="table">
      <tr>
        <th>Road condition</th><th>Landmark</th><th>Description</th>
        </tr>
        ${internalHTML}
      </table>`;
    }
  })
  return majorhtml;
}