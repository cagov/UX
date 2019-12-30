// read sfbay.json
// put it into geojson format
// append to foods.jsopn
let fs = require('fs')

let sfbay = JSON.parse(fs.readFileSync('../sfbay.json','utf8'));

let features = [];
sfbay.forEach( (item) => {
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
      "website": item.permalink,
      "address": item.address,
      "address2": `${item.city}, ${item.state} ${item.zip}`,
      "phone": item.phone,
      "description": item.description
    }
  }
  features.push(obj);
})

fs.writeFileSync('sfbay.json',JSON.stringify(features),'utf8')