const fs = require('fs');

let zippys = JSON.parse(fs.readFileSync('./zips.json','utf8'));

let allZips = new Map()
let uniqueZipArray = [];

zippys.forEach( (item) => {
  for(var key in item) {
    let exists = allZips.get(key);
    if(!exists) {
      allZips.set(key,[item[key]])
    } else {
      let newArray = [...exists,...[item[key]]]
      allZips.set(key,newArray)
    }
  }
})

let allZipJson = [];


allZips.forEach( (value, key) => {
  uniqueZipArray.push(key)
  let zipObj = {};
  zipObj[key] =  value;
  allZipJson.push(zipObj)
})


console.log(uniqueZipArray.length)
fs.writeFileSync('./unique-zips.json',JSON.stringify(allZipJson),'utf8')
console.log(JSON.stringify(allZipJson))

