let wageJson = [
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
  { "name": "South San Francisco", "wage": [ { "everybody": "15.00" } ] } 
]
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
function findWageMatch(city) {
  let match = false;
  let wageData = [ { "25 or fewer": "12" }, { "26 or more": "13" } ]
  wageJson.forEach( (item) => {
    if(item.name == city) {
      match = true;
      wageData = item.wage;
    }
  })
  document.getElementById('answer').innerHTML = doubleTemplate(city, wageData);
  document.querySelector('.additional-wage-info').style.display = 'block';
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
            return `<td><h3>$${wageVal}/hour</h3></td>`;
          }).join(' ')}
        </tr>
      </tbody>
    </table>`
}