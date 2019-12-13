const fs = require('fs');

let geojson = JSON.parse(fs.readFileSync('./cities.json','utf8'));

let list = [
  { "name": "City of Berkeley", "wage": [ { "everybody": "15.35" } ] },
  { "name": "City of Cupertino", "wage": [ { "everybody": "15.35" } ] },
  { "name": "City of El Cerrito", "wage": [ { "everybody": "15.37" } ] },
  { "name": "Emeryville", "wage": [ { "everybody": "16.42" } ] },
  { "name": "Los Altos", "wage": [ { "everybody": "15.40" } ] },
  { "name": "Milpitas", "wage": [ { "everybody": "15.00" } ] },
  { "name": "Mountain View", "wage": [ { "everybody": "16.05" } ] },
  { "name": "Oakland", "wage": [ { "everybody": "14.14" } ] },
  { "name": "Palo Alto", "wage": [ { "everybody": "15.40" } ] },
  { "name": "San Diego", "wage": [ { "everybody": "13.00" } ] },
  { "name": "San Francisco", "wage": [ { "everybody": "15.59" } ] },
  { "name": "San Jose", "wage": [ { "everybody": "15.25" } ] },
  { "name": "San Mateo", "wage": [ { "everybody": "15.38" } ] },
  { "name": "Santa Clara", "wage": [ { "everybody": "15.40" } ] },
  { "name": "Sunnyvale", "wage": [ { "everybody": "16.05" }]  },
  { "name": "Alameda", "wage": [ { "everybody": "15"  }] },
  { "name": "Belmont", "wage": [ { "everybody": "15"  }] },
  { "name": "Daly City", "wage": [ { "everybody": "13.75" } ] },
  { "name": "Fremont", "wage": [ { "25 or fewer": "13.50" }, { "26 or more": "15" } ] },
  { "name": "Los Angeles (City)", "wage": [ { "25 or fewer": "14.25", "26 or more": "15" } ] },
  { "name": "Los Angeles County", "wage" : [ { "25 or fewer": "14.25" }, { "26 or more": "15" } ] },
  { "name": "Malibu", "wage": [ { "25 or fewer": "14.25" }, { "26 or more": "15" } ] },
  { "name": "Menlo Park", "wage": [ { "everybody": "15.00" } ] },
  { "name": "Novato", "wage": [ { "100+ employees": "15" }, {"26-99 employees": "14"}, {"1-25 employees": "13"} ] },
  { "name": "Pasadena", "wage": [ { "25 or fewer": "14.25", "26 or more": "15" } ] },
  { "name": "Petaluma", "wage": [ { "25 or fewer": "14" }, { "26 or more": "15" } ] },
  { "name": "Redwood City", "wage": [ { "everybody": "15.38" } ] },
  { "name": "Richmond", "wage": [ { "everybody": "15.00" } ] },
  { "name": "San Leandro", "wage": [ { "everybody": "15.00" } ] },
  { "name": "Santa Monica", "wage": [ { "25 or fewer": "14.25"}, {"26 or more": "15" } ] },
  { "name": "Santa Rosa", "wage": [ { "25 or fewer": "14" }, { "26 or more": "15" } ] },
  { "name": "Sonoma", "wage": [ { "25 or fewer": "12.50", "26 or more": "13.50" } ] },
  { "name": "South San Francisco", "wage": [ { "everybody": "15.00" } ] } ]

let newGeoJson = {"type": "FeatureCollection", "features": []}

geojson.features.forEach( (item) => {
  list.forEach( (city) => {
    if(item.properties.name == city.name+', CA') {
      console.log(item.properties.name);

      let wageVal = 0;
      for(var key in city.wage[0]) {
        wageVal = city.wage[0][key];
      }
      let num = (parseFloat(wageVal) - 10) * 20;
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