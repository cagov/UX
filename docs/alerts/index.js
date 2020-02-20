import getCounties from "./counties.js";

const counties = getCounties();

let countyNames = [];
counties.forEach(county => {
  countyNames.push(county.name);
});
// put all county names on awesomplete
// document.querySelector(".city-search").dataset.list = countyNames;

fetch('json/unique-zips-slim.json')
.then((response) => {
  return response.json();
})
.then((uniqueZipJson) => {
  let awesompleteList = [...countyNames, ...uniqueZipJson]

  new Awesomplete("input[data-multiple]", {
    list: awesompleteList,
    filter: function(text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },
  
    item: function(text, input) {
      document.querySelector(".invalid-feedback").style.display = "none";
      document.querySelector('.city-search').classList.remove('is-invalid')
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },
  
    replace: function(text) {
      var before = this.input.value.match(/^.+,\s*|/)[0];
      var finalval = before + text;
      this.input.value = finalval;
      console.log('hello')
      console.log(finalval)
      templateHTML(finalval);
    }
  });
});

document
  .querySelector(".js-alert-lookup")
  .addEventListener("submit", function(event) {
    event.preventDefault();
    document.querySelector(".invalid-feedback").style.display = "none";
    document.querySelector('.city-search').classList.remove('is-invalid')
    var finalval = this.querySelector("input").value;
    console.log('hello 2')
    console.log(finalval)
    templateHTML(finalval);
  });

function templateHTML(inputval) {
  console.log('here we are: '+inputval)
  
  if(inputval.match(/^\d+$/)) {
    // we are dealing with a zip code
    fetch('https://api.alpha.ca.gov/countyfromzip/'+inputval)
    .then((response) => {
      return response.json();
    })
    .then((myzip) => {
      console.log(myzip)
      console.log(myzip.county)
      lookupSuccess(myzip.county)
    })
    .catch((e) => {
      lookupFail();
    });
  } else {
    lookupSuccess(inputval)
  }
}

function lookupSuccess(inputval) {
  let chosenCounty;
  counties.forEach(county => {
    if (county.name.toLowerCase() == inputval.toLowerCase()) {
      chosenCounty = county;
    }
  });
  console.log(chosenCounty)
  if(!chosenCounty) {
    lookupFail()
  } else {
    let county = chosenCounty.name;
    let url = chosenCounty.url;
    document.querySelector(".js-county-alert").innerHTML = `<li class="card mb-20  border-0">
      <div class="card-body bg-light">
        <a class="action-link" href="${url}">
          Sign up for ${county} alerts
        </a>
      </div>
    </li>`;
  }
}

function lookupFail() {
  document.querySelector(".invalid-feedback").style.display = "block";
}
