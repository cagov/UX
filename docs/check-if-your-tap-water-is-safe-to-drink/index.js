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
  console.log(item.result.center);

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
      console.log(systemData);
      let system = systemData[0];
      if (systemData.length > 0) {
        if (systemData.length > 1) {
          system = systemData[systemData.length - 1];
        }

        let systemId = system.properties.pwsid;
        let website_blurb = "";
        if (
          system.properties.systemData &&
          system.properties.systemData.meta &&
          system.properties.systemData.meta.website
        ) {
          let website = system.properties.systemData.meta.website;
          if (website.indexOf("http") < 0) {
            website_blurb = `<p><a class="action-link" href="http://${website}">Visit your water system</a></p>`;
          }
          website_blurb_1 = ` Your water system has the most detailed information about your water quality. <a href="${website}" target="_self">Visit your water system</a>`;
        }
        let systemInfo = `<h3>How we check your water safety</h3>
        <h4>Health</h4>
        <p>Our scientists watch out for chemicals and bacteria that could be harmful to human health.</p>
        <h4>Taste, look, and smell</h4>
        <p>We also track chemicals and bacteria that could change the way your water tastes, looks, or smells. </p>`;
        document.querySelector(".system-info").innerHTML = systemInfo;

        fetch(
          `https://api.alpha.ca.gov/WaterSystemHistory?systemId=${systemId}`
        )
          .then(response => {
            return response.json();
          })
          .then(history => {
            if (history.length == 0) {
              console.log("hello");
              displaySafe(website_blurb, system);
              cleanup();
            } else {
              // create map of latest violation for
              let analyteMap = new Map();
              history.forEach(violation => {
                let lastMatch = analyteMap.get(violation.ANALYTE_NAME);
                if (lastMatch) {
                  if (lastMatch.VIOL_END_DATE < violation.VIOL_END_DATE) {
                    analyteMap.set(violation.ANALYTE_NAME, violation);
                  }
                } else {
                  analyteMap.set(violation.ANALYTE_NAME, violation);
                }
              });

              resultsOutput = `<h2>Not safe to drink</h2>
                <p>Your water does not meet California’s safety standards. We found these contaminants in your water: </p>`;

              console.log(history);
              analyteMap.forEach(analyte => {
                console.log(analyte);
                resultsOutput += `<div class="card border-dark mb-3">
              <div class="card-body row">
                ${(function() {
                  if (
                    analyte.ANALYTE_NAME == "GROUNDWATER RULE" ||
                    analyte.ANALYTE_NAME == "SWTR"
                  ) {
                    return `<div class="col flex pr-3">
                      <div class="bold display-4 text-center">
                        <span class="ca-gov-icon-biohazard display-4" aria-hidden="true"></span>
                      </div>
                      <p class="font-weight-light text-center"></p>
                    </div>
                    <div class="water-label">
                      <h5 class="card-title display-5">Microbial pathogens</h5>
                      <div class="progress">
                        <div class="progress-bar progress-bar-striped bg-warning progress-bar-animated w-100" aria-hidden="true"></div>
                      </div>
                    </div>`;
                  } else if (analyte.ANALYTE_NAME == "TURBIDITY") {
                    return `<div class="col flex pr-3">
                        <div class="bold display-4 text-center">
                          <span class="ca-gov-icon-biohazard display-4" aria-hidden="true"></span>
                        </div>
                        <p class="font-weight-light text-center"></p>
                      </div>
                      <div class="water-label">
                        <h5 class="card-title display-5">Particles that make the water look cloudy or hazy</h5>
                        <div class="progress">                        
                          <div class="progress-bar progress-bar-striped bg-warning progress-bar-animated w-100" aria-hidden="true"></div>
                        </div>
                      </div>`;
                  } else {
                    return `<div class="col flex">
                      <div class="bold display-4 text-center">${(analyte.RESULT /
                        analyte.MCL_VALUE) *
                        100}<sup>%</sup></div>
                      <p class="font-weight-light text-center">of the legal limit</p>
                    </div>
                    <div class="water-label">
                      <h5 class="card-title display-5">${
                        analyte.ANALYTE_NAME
                      }</h5>
                      <div class="progress">
                        <div class="progress-bar progress-bar-striped bg-warning progress-bar-animated" aria-hidden="true" aria-valuenow="10" style="width: ${(100 / (analyte.RESULT /
                            analyte.MCL_VALUE))}%"></div>
                        <div class="progress-bar progress-bar-striped bg-dark progress-bar-animated" aria-hidden="true" style="width: 1%;"><span class="limit">legal limit</span></div>
                        <div class="progress-bar progress-bar-striped bg-danger progress-bar-animated" aria-hidden="true" style="width: ${(((analyte.RESULT /
                              analyte.MCL_VALUE) *
                              100) - 100) / ((analyte.RESULT /
                                analyte.MCL_VALUE) *
                                100) * 100}%" ></div>
                      </div>
                    </div>`;
                  }
                })()}
              </div>
            </div>${getSystemHTML(website_blurb, system)}`;
              });
              document.querySelector(
                ".system-status"
              ).innerHTML = resultsOutput;
              cleanup();
            }
          })
          .catch(error => {
            console.error("Error 2:", error);
            displaySafe(website_blurb, system);
            cleanup();
          });
      } else {
        document.querySelector(
          ".system-status"
        ).innerHTML = `<div class="invalid-feedback error1 alert alert-warning" style="display: block;">Sorry, we couldn't find a water system for that location</div>`;
        document.querySelector(".system-info").innerHTML = "";
        cleanup();
      }
    })
    .catch(error => {
      console.error("Error:", error);
      cleanup();
    });

  function cleanup() {
    waterButton.innerHTML = `Check your water`;
    document.querySelector(".system-data").style.display = "block";
  }
});

document.getElementById("geocoder").appendChild(window.geocoder.onAdd(map));

function displaySafe(website_blurb, system) {
  console.log("here");

  let html = `<h2>Safe to drink</h2>
  <p>Your tap water meets California safety standards. We check your water when it leaves your treatment system,
    but not after it goes through pipes to get to you.</p>
    ${getSystemHTML(website_blurb, system)}`;

  document.querySelector(".system-status").innerHTML = html;
}

function getSystemHTML(website_blurb, system) {
  return `<h3 class="card-title">Where your water comes from</h3>
    <h4 class="card-subtitle mb-2">${system.properties.name[0].toUpperCase()}${system.properties.name
    .substr(1, system.properties.name.length)
    .toLowerCase()}</h4>
    <p class="card-text">Your water system keeps the most detailed information about your water quality. ${website_blurb} </p>`;
}
