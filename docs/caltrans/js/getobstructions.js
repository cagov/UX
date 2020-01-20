  /*
    Mapbox directions to Caltrans routes translations:
      I-5 matches exactly to I-5
      CA 99 (mapbox) matches SR-99 (caltrans lcs)
      US 50 (mapbox) matches US-50 (caltrans lcs)
  */

  export default async function getObstructions(stepMap, coords, callback) {
  let finalObstructions = [];
  let routeMap = new Map();
  let routeArr = [];

  stepMap.forEach( (value, key, map) => {
    // example: "Byron Highway CA 4 East" - which splits into three components
    let numParts = value.primary.components.length;
    let parts = value.primary.components;
    let filename = '';
    let direction = '';
    parts.forEach( (part) => {
      if(part.text.indexOf('US ') > -1 || part.text.indexOf('CA ') > -1 || part.text.indexOf('I-') > -1) {
        filename = part.text.replace('US ','US-').replace('CA ','SR-');    
      }
    })
    if(numParts > 1) {
      direction = parts[numParts - 1].text;
    }
    routeMap.set(filename,direction);
    routeArr.push(filename);
  })

  Promise.all(routeArr.map(u=>fetch('./data/'+u+'.json'))).then(responses =>
    Promise.all(responses.map(res => res.json()))
  ).then(jsons => {
    jsons.forEach( (json, index) => {
      let direction = routeMap.get(routeArr[index]);
      parseLCS(json,direction);
    })
    callback(finalObstructions);
  })

  // let response = await fetch('data/D10.SR-4.json');
  // let lcs = await response.json();
  function parseLCS(lcs, direction) {
    console.log('parsing lcs with direction '+direction)
    let possibles = [];
    if(direction) {
      lcs.forEach( (issue) => {
        if(issue.lcs.location.travelFlowDirection.indexOf(direction) > -1) {
          possibles.push(issue);
        }
      })  
    } else {
      possibles = lcs;
    }

    possibles.forEach( (issue) => {
      let lon = issue.lcs.location.begin.beginLongitude;
      let lat = issue.lcs.location.begin.beginLatitude;

      let inPoly = window.geolib.isPointInPolygon({ latitude: lat, longitude: lon }, [
        { latitude: coords.startCoords[1], longitude: coords.startCoords[0] },
        { latitude: coords.endCoords[1], longitude: coords.startCoords[0] },
        { latitude: coords.endCoords[1], longitude: coords.endCoords[0] },
        { latitude: coords.startCoords[1], longitude: coords.endCoords[0] },
      ]);
      /*
      console.log({ latitude: lat, longitude: lon })
      console.log([
        { latitude: coords.startCoords[1], longitude: coords.startCoords[0] },
        { latitude: coords.endCoords[0], longitude: coords.startCoords[0] },
        { latitude: coords.endCoords[0], longitude: coords.endCoords[1] },
        { latitude: coords.startCoords[1], longitude: coords.endCoords[1] },
      ])
      console.log(inPoly)
      */
      if(inPoly) {
        finalObstructions.push(issue);
        console.log('added to poly')
      } else {
        console.log('dropped outside poly')
      }
    })
  }
}

