mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25oYW5zIiwiYSI6ImNqNGs4cms1ZzBocXkyd3FzZGs3a3VtamYifQ.HQjFfVzwwxwCmGr2nvnvSA';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-79.4512, 43.6568],
  zoom: 13
});

window.geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  placeholder: ' ',
  bbox: [-124.409591, 32.534156, -114.131211, 42.009518],
  mapboxgl: mapboxgl
}).on('result',async function(item) {
  console.log(item.result.center);

  // make call to endpoint to find system
  fetch(`https://api.alpha.ca.gov/WaterSystem?lat=${item.result.center[1]}&lon=${item.result.center[0]}`)
  .then((response) => {
    return response.json();
  })
  .then((systemData) => {
    console.log(systemData);
    let system = systemData[0];
    if(systemData.length > 1) {
      system = systemData[systemData.length - 1]
    }
    let systemId = system.properties.pwsid;
    let systemInfo = `<h2>${system.properties.name}</h2>
    <p>Water source: ${system.properties.systemData['Primary Water Source Type']}</p>
    <p>Population served: ${system.properties.d_population_count}</p>`;
    document.querySelector('.system-info').innerHTML = systemInfo;

    fetch(`https://api.alpha.ca.gov/WaterSystemHistory?systemId=${systemId}`)
    .then((response) => {
      return response.json();
    })
    .then((history) => {
      document.querySelector('.system-status').innerHTML = `<h1>NOT SAFE</h1>`
      console.log(history)
    })
    .catch((error) => {
      console.error('Error 2:', error);
      document.querySelector('.system-status').innerHTML = `<h1>SAFE</h1>`
    });
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  // wait with spinner

})

document.getElementById('geocoder').appendChild(window.geocoder.onAdd(map));

