mapboxgl.accessToken = 'pk.eyJ1IjoiYWFyb25oYW5zIiwiYSI6ImNqNGs4cms1ZzBocXkyd3FzZGs3a3VtamYifQ.HQjFfVzwwxwCmGr2nvnvSA';
var map = new mapboxgl.Map({
  container: 'mapid',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-121.500665, 38.583843],
  zoom: 12,
  pitch: 58.5,
  bearing: -120.8
});

function getGeo() {
  var startPos;

  var geoSuccess = function (position) {
    // Do magic with location
    startPos = position;
    document.querySelector('.js-location-display').innerHTML = "Food banks near you";
    reorient([position.coords.longitude, position.coords.latitude])
  };
  var geoError = function (error) {
    switch (error.code) {
      case error.TIMEOUT:
        // The user didn't accept the callout
        console.log('the use did not accept geolocate permission')
        break;
    }
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};
getGeo();

function reorient(position) {
  map.flyTo({
    center: position,
    essential: false // this animation is not considered essential with respect to prefers-reduced-motion
  });
  displaySortedResults({ type: 'Feature', geometry: { coordinates: position } }, window.foodLocations)
}

fetch('foods.json')
.then( function(resp) { return resp.json() })
.then(function (data) {
  window.foodLocations = data;
  console.log('got some food')
  displaySortedResults({ type: 'Feature', geometry: { coordinates: [-121.489987, 38.574024] } }, data)
})

map.on('load', function() {
  mapInteractions();
});
  
function mapInteractions() {
  if(!window.foodLocations) {
    setTimeout(mapInteractions, 300);
  } else {
    setupMapInteractions();
  }
}

function setupMapInteractions() {
  map.loadImage("marker.png", function (error, image) {
    if (error) throw error;
    map.addImage("custom-marker", image);

    map.addLayer(
      {
        'id': 'foods',
        'type': 'symbol',
        'source': {
          'type': 'geojson',
          'data': window.foodLocations,
        },
        'layout': {
          'icon-image': 'custom-marker',
          'icon-size': 0.075,
          'icon-allow-overlap': true
        }
      }
    );
    // When a click event occurs on a feature in the foods layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on('click', 'foods', function (e) {
      var coordinates = e.features[0].geometry.coordinates.slice();
      var item = e.features[0];
      var food = item.properties;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`${food.title}<br>
          ${food.address}<br>
            ${food.address2}<br>
          <a href="${food.website}" target="_blank">Visit ${food.title}'s website</a><br>
          ${food.phone}<br>
          <a href="geo:${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}" onclick="mapsSelector(${item.geometry.coordinates[1]},${item.geometry.coordinates[0]})" target="_blank"class="btn btn-primary">Get directions</a>`)
        .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the foods layer.
    map.on('mouseenter', 'foods', function () {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'foods', function () {
      map.getCanvas().style.cursor = '';
    });
  })
}

function displaySortedResults(coords, data) {
  if(!data) {
    setTimeout(function() {
      displaySortedResults(coords, window.foodLocations);
    }, 300)
  } else {
    // sort all the results based on proximity to coords
    var sortedLocs = data.features.sort(function (a, b) {
      return haversine(coords, a, { format: 'geojson', unit: 'mile' }) - haversine(coords, b, { format: 'geojson', unit: 'mile' })
    })
    var outputLocs = [];
    for (var i = 0; i < 9; i++) {
      var food = sortedLocs[i];
      if (food) {
        food.properties.distance = haversine(coords, food, { format: 'geojson', unit: 'mile' });
        outputLocs.push(food);
      }
    }
    var html = `<ul class="pl-0 card-set">
      ${outputLocs.map( function(item, itemindx) {
        var food = item.properties
        var displayClass = '';
        if(itemindx > 2) {
          displayClass = 'd-none';
        }
        var showMore = '';
        if(itemindx == 2) {
          showMore = `<li class="card mb-20 js-expand-link">
            <div class="card-body">
              <p>
                <a href="#" onclick="showAll()">Show more &raquo; &raquo;</a>
              </p>
            </div>
          </li>`;
        }
        return `<li class="card mb-20 ${displayClass}">
          <div class="card-body">
            <p>${food.distance.toFixed(2)} miles away</p>
            <p>${food.title}</p>
            <p>${food.address}<br>
              ${food.address2}<br>
            <a href="${food.website}" target="_blank">Visit ${food.title}'s website</a><br>
            <p>${food.phone}</p>
            <a href="geo:${item.geometry.coordinates[1]},${item.geometry.coordinates[0]}" onclick="mapsSelector(${item.geometry.coordinates[1]},${item.geometry.coordinates[0]})" target="_blank"class="btn btn-primary">Get directions</a>

            <!--<p>Hours: 
            Monday to Friday
            8 a.m.–5 p.m.</p>-->
          </div>
        </li>${showMore}`;
      }).join(' ')}
    </ul>`;
    document.querySelector('.js-nearest-results').innerHTML = html;
  }
}

function showAll() {
  event.preventDefault();
  document.querySelectorAll('.card-set li.d-none').forEach( function(item) {
    item.classList.remove('d-none');
  })
  document.querySelector('.js-expand-link').style.display = 'none';
}

function mapsSelector(lat,lon) {
  event.preventDefault();
  if ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPad") != -1) || (navigator.platform.indexOf("iPod") != -1)) {
      window.open(`maps://maps.apple.com/maps?daddr=${lat},${lon}`);
  } else {
    window.open(`https://maps.google.com/maps?daddr=${lat},${lon}`);
  }
}
/*
// This section was how I did autocomplete but it was irresponsible and crashed iOS
var urls = ['../mw/just-cities.json', '../mw/unique-zips.json']
Promise.all(urls.map(function (u) {
  return fetch(u);
}))
.then( function(responses) {
  Promise.all(responses.map(function (res) {
    return res.json();
  }))
}).then( function(jsons) {
  // handle search autocomplete
  var uniqueZipArray = [];
  var zipMap = new Map();

  jsons[1].forEach( function(item) {
    for(var key in item) {
      uniqueZipArray.push(key)
      zipMap.set(key, item[key])
    }
  })

  var cityNames = new Map();
  jsons[0].forEach( function(item) {
    cityNames.set(item.replace(', CA', '').toLowerCase(), item)
  })
  document.querySelector('.city-search').dataset.list = [...jsons[0], ...uniqueZipArray];

  new Awesomplete('input[data-multiple]', {
    filter: function(text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
    },

    item: function(text, input) {
      document.querySelector('.invalid-feedback').style.display = 'none';
      return Awesomplete.ITEM(text, input.match(/[^,]*$/)[0]);
    },

    replace: function(text) {
      var before = this.input.value.match(/^.+,\s*|/)[0];
      var finalval = before + text;
      this.input.value = finalval;
      var cabb = '-124.409591,32.534156,-114.131211,42.009518';
      var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${finalval}.json?bbox=${cabb}&access_token=${mapboxgl.accessToken}`;
      fetch(url)
      .then(function(resp) { return resp.json() })
      .then(function (data) {
        document.querySelector('.js-location-display').innerHTML = "Food banks near "+finalval;
        reorient(data.features[0].center);
      })
    }
  });

  document.querySelector('.js-food-lookup').addEventListener('submit',function(event) {
    event.preventDefault();
    document.querySelector('.invalid-feedback').style.display = 'none';
    var val = this.querySelector('input').value;
    var cabb = '-124.409591,32.534156,-114.131211,42.009518';
    var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${val}.json?bbox=${cabb}&access_token=${mapboxgl.accessToken}`;
    fetch(url)
    .then( function(resp) { return resp.json() })
    .then(function (data) {
      document.querySelector('.js-location-display').innerHTML = "Food banks near "+val;
      if(data.features.length > 0) {
        reorient(data.features[0].center);
      } else {
        document.querySelector('.invalid-feedback').style.display = 'block';
      }
    })
  })
})
*/