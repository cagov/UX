let urls = ['wage-data.json','just-cities.json', 'unique-zips.json']
Promise.all(urls.map(u=>fetch(u))).then(responses =>
  Promise.all(responses.map(res => res.json()))
).then(jsons => {
  // display HTML of add city wages
  let wageJson = jsons[0].MinimumWage[0]['2020-01-01T08:00:00'];
  let html = buildDisplay(jsons[0]);
  document.querySelector('.display-wage-by-city').innerHTML = html;

  // handle search autocomplete
  let uniqueZipArray = [];
  let zipMap = new Map();

  jsons[2].forEach( (item) => {
    for(var key in item) {
      uniqueZipArray.push(key)
      zipMap.set(key, item[key])
    }
  })
  document.querySelector('.city-search').dataset.list = [...jsons[1], ...uniqueZipArray];
  new Awesomplete('input[data-multiple]', {
    filter: function(text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },
  
    item: function(text, input) {
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },
  
    replace: function(text) {
      var before = this.input.value.match(/^.+,\s*|/)[0];
      let finalval = before + text;
      this.input.value = finalval;
      findWageMatch(finalval, wageJson, zipMap);
    }
  });

  document.querySelector('.js-wage-lookup').addEventListener('click',(event) => {
    event.preventDefault();
    let location = document.getElementById('location-query').value;
    findWageMatch(location, wageJson, zipMap);
  })
  
})

function findWageMatch(city, wageJson, zipMap) {
  // if there are any letters this is not a zip code
  let wageData = [ { "25 or fewer": "12" }, { "26 or more": "13" } ]
  if(city.match(/[a-zA-Z]+/g)) {
    wageJson.forEach( (item) => {
      if(item.name == city) {
        wageData = item.wage;
      }
    })
    document.getElementById('answer').innerHTML = doubleTemplate(city, wageData);  
  } else {
    // no letters, try to find a match in zipMap
    let foundZip = zipMap.get(city);
    if(foundZip) {
      let html = '';
      foundZip.forEach( (aCity) => {
        console.log('looking up '+aCity);
        wageData = [ { "25 or fewer": "12" }, { "26 or more": "13" } ];
        let match = false;
        wageJson.forEach( (item) => {
          if(item.name == aCity) {
            wageData = item.wage;
            match = true;
            // creating multiple rows of html results if zip code crosses multiple cities
            html += doubleTemplate(aCity, wageData);
          }
        })
        if(!match) {
          html += doubleTemplate(aCity, wageData);
        }
      })
      document.getElementById('answer').innerHTML = html;
    }
  }
}

function doubleTemplate(location, wageData) {
  return `
    <h4>The minimum wage in ${location}, CA is:</h4>
    <table class="table">
      <thead>
        <tr>
          ${(function() {
            let output = '';
            if(wageData.length > 1) {
              output = `
                ${wageData.map( (wageitem) => {
                  let label = '';
                  for(var key in wageitem) {
                    label = key;
                  }
                  return `<th scope="col">Employers with ${label} employees</th>`
                }).join(' ')}`;
            }
            return output
          })()}
        </tr>
      </thead>
      <tbody>
        <tr>
          ${wageData.map( (wageitem) => {
            let wageVal = '';
            for(var key in wageitem) {
              wageVal = wageitem[key];
            }
            return `<td>$${wageVal}/hour</td>`;
          }).join(' ')}
        </tr>
      </tbody>
    </table>`
}

function buildDisplay(wageJson) {
  return `
    ${wageJson.MinimumWage.map(function(date) {
      let label = '';
      let cityWages = '';
      for(var key in date) {
        label = key;
        cityWages = date[key];
      }
      var options = { year: 'numeric', month: 'long', day: 'numeric' };
      return `


        <cwds-accordion>
          <div class="card">
            <div class="card-header py-20" id="heading${label}">
              <button class="btn" type="button" aria-expanded="false">
                ${new Date(label).toLocaleDateString('en-US', options)}
              </button>
            </div>
            <div class="card-container collapsed" aria-labelledby="heading${label}">
              <div class="card-body">
                <table class="table">
                <thead>
                    <th scope="col">Place</th>
                    <th scope="col">Rate</th>
                  </tr>
                </thead>
                <tbody>
                ${cityWages.map(function(city) {
                  return ` <tr>
                    <td>${city.name}</td>
                    <td>
                      ${(function() {
                        let wageData = city.wage;
                        let output = '';
                        if(city.wage[0].everybody && city.wage[0].everybody.match(/[a-zA-Z]+/g)) {
                          output = `<p>${city.wage[0].everybody}</p>`;
                        } else {
                          output = `<p>$${city.wage[0].everybody}/hour</p>`;
                        }
                        if(wageData.length > 1) {
                          output = `
                            ${wageData.map( (wageitem) => {
                              let label = '';
                              let value = '0'
                              for(var key in wageitem) {
                                value = wageitem[key];
                                label = key;
                              }
                              if((value).match(/[a-zA-Z]+/g)) {
                                return `<p>${value}</p>`
                              } else {
                                return `<p>$${value}/hour for employers with ${label} employees</p>`
                              }
                            }).join(' ')}`;
                        }
                        return output
                      })()}
                    </td>
                  </tr>`;
                }).join(' ')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </cwds-accordion>`
    }).join(' ')}
  `
}