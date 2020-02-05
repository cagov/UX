export default async function getLatLon(place) {
  let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=pk.eyJ1IjoiYWxwaGEtY2EtZ292IiwiYSI6ImNrNTZ5em1qMDA4ZWkzbG1yMDg4OXJyaDIifQ.GleKGsZsaOcmxfsYUR9bTg`


  let response = await fetch(url)
  .then((response) => response.json())
  .then((json) => {
    if(json.features[0].center) {
      return {"status": "200", center: json.features[0].center};
    } else {
      return {"status": "error", "message": "Please enter a valid city or zip code, such as San Francisco or 95818"}
    }  
  })
  .catch((error) => {
    console.log('fail')
    console.log(error)
    return {"status": "error", "message": "Please enter a valid city or zip code, such as San Francisco or 95818"}
  });
  return response;
}
