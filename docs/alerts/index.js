import getCounties from "./counties.js";

const counties = getCounties();

let countyNames = [];
counties.forEach(county => {
  countyNames.push(county.name);
});
// put all county names on awesomplete
document.querySelector(".city-search").dataset.list = countyNames;

new Awesomplete("input[data-multiple]", {
  filter: function(text, input) {
    return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
  },

  item: function(text, input) {
    document.querySelector(".invalid-feedback").style.display = "none";
    return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
  },

  replace: function(text) {
    var before = this.input.value.match(/^.+,\s*|/)[0];
    var finalval = before + text;
    this.input.value = finalval;
    let templateString = document.querySelector("#card-template").innerHTML;

    function templateHTML() {
      let chosenCounty;
      counties.forEach(county => {
        if (county.name.toLowerCase() == finalval.toLowerCase()) {
          chosenCounty = county;
        }
      });
      let county = chosenCounty.name;
      let url = chosenCounty.url;

      return     templateString = `<li class="card mb-20  border-0">
        <div class="card-body bg-light">
          <a class="action-link" href="${url}">
            ${county}
          </a>
        </div>
      </li>`;;
    }
    document.querySelector(".js-county-alert").innerHTML = templateHTML();
  }
});

document
  .querySelector(".js-food-lookup")
  .addEventListener("submit", function(event) {
    event.preventDefault();
    document.querySelector(".invalid-feedback").style.display = "none";
    var val = this.querySelector("input").value;
    var cabb = "-124.409591,32.534156,-114.131211,42.009518";
    var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?bbox=${cabb}&access_token=${mapboxgl.accessToken}`;
    fetch(url)
      .then(function(resp) {
        return resp.json();
      })
      .then(function(data) {
        document.querySelector(".js-location-display").innerHTML =
          "Food banks near " + val;
        if (data.features.length > 0) {
          reorient(data.features[0].center);
        } else {
          document.querySelector(".invalid-feedback").style.display = "block";
        }
      });
  });

// trigger card display on selection
// on submit also do lookup
// display error if not found
