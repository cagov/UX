const fetch = require('node-fetch');
const fs = require('fs');

let roadMap = new Map();

async function getData(url) {

  const response = await fetch(url);
  const json = await response.json();
  json.data.forEach( (item) => {
    let routeName = item.lcs.location.begin.beginRoute;
    if(roadMap.get(routeName)) {
      let conditionsSoFar = roadMap.get(routeName);
      conditionsSoFar.push(item);
      roadMap.set(routeName,conditionsSoFar);
    } else {
      roadMap.set(routeName,[item]);
    }
  })

  return('parsed '+url)
}

async function retrieveAll() {
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d3/lcs/lcsStatusD03.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d1/lcs/lcsStatusD01.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d2/lcs/lcsStatusD02.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d4/lcs/lcsStatusD04.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d5/lcs/lcsStatusD05.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d6/lcs/lcsStatusD06.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d7/lcs/lcsStatusD07.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d8/lcs/lcsStatusD08.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d9/lcs/lcsStatusD09.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d10/lcs/lcsStatusD10.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d11/lcs/lcsStatusD11.json');
  console.log(logInfo)
  logInfo = await getData('http://cwwp2.dot.ca.gov/data/d12/lcs/lcsStatusD12.json');
  console.log(logInfo)

  console.log('going to write all files now')
  roadMap.forEach( (value, key, map) => {
    let fileData = [];
    let incidents = roadMap.get(key);
    incidents.forEach( (inc) => {
      fileData.push(inc)
    })
    let outputFileName = '../data/'+key+'.json';
    fs.writeFileSync(outputFileName, JSON.stringify(fileData),'utf8')
    console.log('wrote '+outputFileName)
  })
}
retrieveAll();


/*
  need to match bounding box of trip on each road to incident list on that route
*/
// -------------- initial validation
/*
  have to refesh those every 5 minutes
  on aws
*/
// --------------- ^ goals for today --------------
/*
  add autocomplete
  create pwa
  install and launch locally with icons and splash screen
*/
/*
  split file by direction of travel too
  optimization: limit data stored for each incident
*/
/*
  need to handle determining initial district, maybe by county mapping and between district travel
*/
// SMS notifications
// animated trip drawing line on map and shows flip book of cameras on way
// push notifictions