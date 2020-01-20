export default async function getLatLon(place) {
  let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=pk.eyJ1IjoiYWxwaGEtY2EtZ292IiwiYSI6ImNrNTZ5em1qMDA4ZWkzbG1yMDg4OXJyaDIifQ.GleKGsZsaOcmxfsYUR9bTg`

  let center = '';
  const response = await fetch(url);
  const json = await response.json();
  center = json.features[0].center;
  
  return center;
}
