import getGeo from './getgeo.js';
import getParameterByName from './getparams.js';
// getGeo();

function displaySortedResults(query) {
  fetch(`https://api.alpha.ca.gov/HomelessShelters/?q=${query}`)
    .then(response => response.json())
    .then(data => {
      
      const results = document.querySelector(".js-nearest-results")
      const template = document.getElementById("result-template")

      document.querySelector(".data-match").innerHTML=data.match.match
      document.querySelector(".js-location-display").classList.remove('d-none');
      
      for (const row of data.results) {
        const addresscombo = `${row.address}, ${row.city}, ${row.state} ${row.zipcode}`

        const node = template.content.cloneNode(true)
        node.querySelector(".data-name").innerHTML=row.name
        node.querySelector(".data-address").innerHTML=addresscombo
        node.querySelector(".data-description").innerHTML=row.description
        const phone = node.querySelector(".data-phone")
        phone.href=`tel:${row.phone}`
        phone.innerText=row.phone
        node.querySelector(".data-more").href=row.url
        node.querySelector(".data-map-google").href = `https://maps.google.com/?q=${addresscombo}`
        node.querySelector(".data-map-apple").href = `https://maps.apple.com/?q=${addresscombo}`
        node.querySelector(".data-distance").innerHTML=row.location.distance 

        results.appendChild(node)
      }
  })
  .catch((e) => {
    console.log(e)
    document.getElementById("div-fail").classList.remove("d-none")
  })  
}

let query = getParameterByName("q");
if(query) {
  displaySortedResults(query);
}

document.querySelector('.js-lookup').addEventListener('submit',function(event) {
  event.preventDefault();
  document.querySelector('.invalid-feedback').style.display = 'none';
  var val = this.querySelector('input').value;
  displaySortedResults(val);
})