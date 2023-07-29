
if(document.readyState !== "loading") { 

  fetchData();
} else {
  document.addEventListener("DOMContentLoaded", function() {
      fetchData();
  })
}

function createMap(data, PIdata, NIdata){
 let map = L.map('map', {
  minZoom: -3
 });


 for (let index = 0; index < data.features.length; index++) {
  const element = data.features[index];
  if(index != 308){
    element.properties.PIdata = PIdata.dataset.value[index+2];
  element.properties.NIdata = NIdata.dataset.value[index+2];
  } else {
    element.properties.PIdata = PIdata.dataset.value[1];
  element.properties.NIdata = NIdata.dataset.value[1];
  }
  
 }


 let geoJson = L.geoJSON(data, {
  onEachFeature: (feature, layer) => { 
    layer.bindTooltip(feature.properties.name);
    layer.bindPopup(feature.properties.PIdata+ " " +feature.properties.NIdata);  
  },
  weight: 2,
  style: getColor
}).addTo(map);
 let layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: "© OpenStreetMap"
 }).addTo(map);
 map.fitBounds(geoJson.getBounds());

}

const getColor = (feature) => {
  let hue = calColor(feature)
  const object = {
    color: "hsl("+hue+",75%,50%)"
  };
  console.log(object.color);
  return ({color: object.color})
}

function calColor(feature){
  let value = ((feature.properties.PIdata/feature.properties.NIdata)**3)*60
  if(value >= 120){ return 120;}
  else{return value};
}

function fetchData(){
  let data1;
  let data2;
  let data3;
  fetch('https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326')
  .then(response => response.json())
  .then(data => {
    data1 = data
    console.log(data);
    fetch('https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f')
    .then(response => response.json())
    .then(data => {
      data2 = data;
      console.log(data);
      fetch('https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e')
      .then(response => response.json())
      .then(data => {
        data3 = data
        console.log(data);
    
        createMap(data1, data2, data3);
        });
      });
    });
}


