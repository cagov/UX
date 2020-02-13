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

  let waterButton = document.querySelector('.js-water-lookup');
  
  waterButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Loading...`;
  document.querySelector('.system-data').style.display = 'none';

  // make call to endpoint to find system
  fetch(`https://api.alpha.ca.gov/WaterSystem?lat=${item.result.center[1]}&lon=${item.result.center[0]}`)
  .then((response) => {
    return response.json();
  })
  .then((systemData) => {
    console.log(systemData);
    let system = systemData[0];
    if(systemData.length > 0) {
      if(systemData.length > 1) {
        system = systemData[systemData.length - 1]
      }

      let systemId = system.properties.pwsid;
      let website_blurb = '';
      let website_blurb_1 = '';
      if(system.properties.systemData && system.properties.systemData.meta && system.properties.systemData.meta.website) {
        let website = system.properties.systemData.meta.website;
        if(website.indexOf('http') < 0) {
          website = 'http://'+website;
        }
        website_blurb_1 = ` Your water system has the most detailed information about your water quality. <a href="${website}" target="_self">Visit your water system</a>`;
      }
      let systemInfo = `<h3>How we decide if your water is safe</h3>
      <i class="ca-gov-icon-medical-heart text-danger lead float-left pr-2"></i>
      <h4>Health</h4>
      <p>Our scientists watch out for chemicals and bacteria that could be harmful to human health.</p>
      <i class="ca-gov-icon-eye text-success float-left pr-2 align-text-top h2 m-0 p-0 mt-n1"></i>
      <h4>Taste, look, and smell</h4>
      <p>We also track chemicals and bacteria that could change the way your water tastes, looks, or smells. </p>`;
      document.querySelector('.system-info').innerHTML = systemInfo;
  
      fetch(`https://api.alpha.ca.gov/WaterSystemHistory?systemId=${systemId}`)
      .then((response) => {
        return response.json();
      })
      .then((history) => {
        // create map of latest violation for 
        let analyteMap = new Map();
        history.forEach( (violation) => {
          let lastMatch = analyteMap.get(violation.ANALYTE_NAME);
          if(lastMatch) {
            if(lastMatch.VIOL_END_DATE < violation.VIOL_END_DATE) {
              analyteMap.set(violation.ANALYTE_NAME,violation);
            }
          } else {
            analyteMap.set(violation.ANALYTE_NAME,violation)
          }
        })

        resultsOutput = `<h2>Not safe to drink</h2>
        <p>Your water does not meet California’s safety standards. We found these contaminants in your water: </p>`;
        

        console.log(history)
        analyteMap.forEach( (analyte) => {
          console.log(analyte)
          resultsOutput += `<div class="card border-dark mb-3">
            <div class="card-body row">
              <div class="col flex">
                <div class="bold display-4 text-center">${(analyte.RESULT / analyte.MCL_VALUE) * 100}<sup>%</sup></div>
                <p class="font-weight-light text-center">over the legal limit</p>
              </div>
              <div class="water-label">
              <h5 class="card-title display-5">${analyte.ANALYTE_NAME}</h5>
                <div class="progress">
                  <div class="progress-bar progress-bar-striped bg-danger progress-bar-animated w-100" aria-hidden="true"></div>
                </div>
              </div>
            </div>
				  </div>`
          // RESULT_UOM == MCL_UOM
        })
        document.querySelector('.system-status').innerHTML = resultsOutput;
        cleanup();
      })
      .catch((error) => {
        console.error('Error 2:', error);
        document.querySelector('.system-status').innerHTML = `<h2>Safe to drink</h2>
        <p>Your tap water meets California safety standards. We check your water when it leaves your treatment system,
          but not after it goes through pipes to get to you. ${website_blurb}</p>
          <h3 class="card-title">Where your water comes from</h3>
          <h4 class="card-subtitle mb-2">${system.properties.name[0].toUpperCase()}${system.properties.name.substr(1,system.properties.name.length).toLowerCase()}</h4>
       
          <h4 class="card-subtitle mb-2">${system.properties.systemData['State Water System Type']}</h4>
          <p class="card-text">You belong to a ${system.properties.systemData['State Water System Type']} water system. These are city, county, regulated utilities,
            regional water systems, and small water companies and districts where people live. </p>
          <!--<p>Water source: ${system.properties.systemData['Primary Water Source Type']}</p>-->
          <p>Population served: ${system.properties.d_population_count.toLocaleString()}</p>`
        cleanup();
      });
    
    } else {
      document.querySelector('.system-status').innerHTML = `<div class="invalid-feedback error1 alert alert-warning" style="display: block;">Sorry, we couldn't find a water system for that location</div>`;
      document.querySelector('.system-info').innerHTML = '';
      cleanup();
    }

  })
  .catch((error) => {
    console.error('Error:', error);
    cleanup();
  });

  function cleanup() {
    waterButton.innerHTML = `Check your water quality`;
    document.querySelector('.system-data').style.display = 'block';
  }

})

document.getElementById('geocoder').appendChild(window.geocoder.onAdd(map));

