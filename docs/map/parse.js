const fs = require('fs');

let geojson = JSON.parse(fs.readFileSync('./cities.json','utf8'));

let list = [
  { "name": "Berkeley", "wage": "15.35" },
  { "name": "Cupertino", "wage": "15.35" },
  { "name": "El Cerrito", "wage": "15.37" },
  { "name": "Emeryville", "wage": "16.42" },
  { "name": "Los Altos", "wage": "15.40" },
  { "name": "Milpitas", "wage": "15.00" },
  { "name": "Mountain View", "wage": "16.05" },
  { "name": "Oakland", "wage": "14.14" },
  { "name": "Palo Alto", "wage": "15.40" },
  { "name": "San Diego", "wage": "13.00" },
  { "name": "San Francisco", "wage": "15.59" },
  { "name": "San Jose", "wage": "15.25" },
  { "name": "San Mateo", "wage": "15.38" },
  { "name": "Santa Clara", "wage": "15.40" },
  { "name": "Sunnyvale", "wage": "16.05" }
]

let newGeoJson = {"type": "FeatureCollection", "features": []}

geojson.features.forEach( (item) => {
  list.forEach( (city) => {
    if(item.properties.name == city.name+', CA') {
      console.log(item.properties.name);
      let num = (parseFloat(city.wage) - 10) * 20;
      item.properties.wage = (num * num * num * num) / 10000;
      item.properties.color = randomColor();
      newGeoJson.features.push(item)
    }
  })
})

fs.writeFileSync('./less-cities.json',JSON.stringify(newGeoJson,'utf8'))
function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

// recreate file format
// write to new file