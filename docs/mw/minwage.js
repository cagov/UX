let wageJson = [];
fetch('wage-data.json')
  .then((resp) => resp.json())
  .then(function(data) {
    wageJson = data.MinimumWage[0]['2020-01-01T08:00:00'];
    let html = buildDisplay(data);
    document.querySelector('.display-wage-by-city').innerHTML = html;
  }
)

fetch('just-cities.json')
  .then((resp) => resp.json())
  .then(function(data) {
    // put these into the data-list
    document.querySelector('.city-search').dataset.list = data;
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
        findWageMatch(finalval);
      }
    });
  }
)

function findWageMatch(city) {
  let match = false;
  let wageData = [ { "25 or fewer": "12" }, { "26 or more": "13" } ]
  console.log(wageJson)
  wageJson.forEach( (item) => {
    if(item.name == city) {
      match = true;
      wageData = item.wage;
    }
  })
  document.getElementById('answer').innerHTML = doubleTemplate(city, wageData);
}

document.querySelector('.js-wage-lookup').addEventListener('click',(event) => {
  event.preventDefault();
  let location = document.getElementById('location-query').value;
  findWageMatch(location);
})

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
          <p>${new Date(label).toLocaleDateString('en-US', options)}</p>
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
                  if(!parseFloat(city.wage[0].everybody)) {
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
                        if(!parseFloat(value)) {
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
        </table>`
    }).join(' ')}
  `
}