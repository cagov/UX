let fs = require('fs')

let la = JSON.parse(fs.readFileSync('./la.json','utf8'));
/*
"id": "2675",
*/
let features = [];
let laMap = new Map();
la.forEach( (item) => {
  laMap.set(item.id,item);
})
laMap.forEach( (item) => {
  let obj = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [
        parseFloat(item.lng),
        parseFloat(item.lat)
      ]
    },
    "properties": {
      "title": item.store,
      "address": item.address,
      "address2": `${item.city}, ${item.state} ${item.zip}`,
      "phone": item.phone,
      "description": item.fax
    }
  }
  features.push(obj);
})

fs.writeFileSync('la-fixed.json',JSON.stringify(features),'utf8')