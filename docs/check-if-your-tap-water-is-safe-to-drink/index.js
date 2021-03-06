import gotSystem from "./got-system.js";
import getParameterByName from './getparams.js';

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWFyb25oYW5zIiwiYSI6ImNqNGs4cms1ZzBocXkyd3FzZGs3a3VtamYifQ.HQjFfVzwwxwCmGr2nvnvSA";
var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-79.4512, 43.6568],
  zoom: 13
});

// look for pwsid in url, should also have location

window.geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  placeholder: " ",
  bbox: [-124.409591, 32.534156, -114.131211, 42.009518],
  mapboxgl: mapboxgl
}).on("result", async function(item) {
  let waterButton = document.querySelector(".js-water-lookup");

  waterButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  document.querySelector(".system-data").style.display = "none";

  // make call to endpoint to find system
  fetch(
    `https://api.alpha.ca.gov/WaterSystem?lat=${item.result.center[1]}&lon=${item.result.center[0]}`
  )
    .then(response => {
      return response.json();
    })
    .then(systemData => {
      gotSystem(systemData);
    })
    .catch(error => {
      console.error("Error:", error);
      waterButton.innerHTML = `Check your water`;
      document.querySelector(".system-data").style.display = "block";
    });
});

if(getParameterByName('systemId')) {
  console.log('getting system data')
  let url = `https://api.alpha.ca.gov/WaterSystem?systemId=${getParameterByName('systemId')}`
  console.log(url)
  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(systemData => {
      console.log(systemData)
      gotSystem(systemData);
      document.querySelector(".system-data").style.display = "block";
    })
    .catch(error => {
    });
}

document.getElementById("geocoder").appendChild(window.geocoder.onAdd(map));