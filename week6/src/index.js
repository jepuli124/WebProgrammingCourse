import { Chart } from "./frappe-charts/dist/frappe-charts.min.esm.js"
console.log("v 1.4.3")

let jsonBody = {
    "query": [
        {
            "code": "Vuosi",
            "selection": {
                "filter": "item",
                "values": [
                    "2000",
                    "2001",
                    "2002",
                    "2003",
                    "2004",
                    "2005",
                    "2006",
                    "2007",
                    "2008",
                    "2009",
                    "2010",
                    "2011",
                    "2012",
                    "2013",
                    "2014",
                    "2015",
                    "2016",
                    "2017",
                    "2018",
                    "2019",
                    "2020",
                    "2021"
                ]
            }
        },
        {
            "code": "Alue",
            "selection": {
                "filter": "item",
                "values": [
                    "SSS"
                ]
            }
        },
        {
            "code": "Tiedot",
            "selection": {
                "filter": "item",
                "values": [
                    "vaesto"
                ]
            }
        }
    ],
    "response": {
        "format": "json-stat2"
    }
}

function createChartData (labels, datasets){
    var fulldata = {
        labels: labels,
            datasets: [
            {
                name: "yes", type: "line",
                values: datasets
            }
        ]
    }
    return fulldata
}


const createData = async (jsonBody) => {
    let data = await fetchDataPOST("https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px");
    let data2 = await fetchDataGET("https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px");
    console.log(data);
    console.log(data2);
    const labels = [];
    const datasets = [];
    for(var counter = 2000; counter <= 2021; counter++ ){
        labels[counter - 2000] = counter;
    }
    for(var counter = 0; counter <= 21; counter++ ){
        datasets[counter] = data.value[counter];
    }
    //console.log(labels);
    console.log(datasets);
    return createChartData(labels, datasets);
    
}

const createChart = (fulldata) => {
    let rm = document.getElementById("chart");
    rm.remove();
    let div = document.createElement("div");
    div.setAttribute("id","chart");
    let body = document.getElementById("body");
    body.appendChild(div);
  
  let chart = new Chart("#chart", {
    title: "title",
    data: fulldata,
    height: 450,
    type: 'line',
    colors: ["#eb5146"]
  })

  return chart;

}

const addPointChart = (chart, fulldata) => {
    let mean = 0;
    for (let index = 0; index < fulldata.datasets[0].values.length-1; index++) {
        mean += fulldata.datasets[0].values[index+1]-fulldata.datasets[0].values[index];
    }
    mean = mean/fulldata.datasets[0].values.length;
    mean += fulldata.datasets[0].values[fulldata.datasets[0].values.length-1];
    fulldata.datasets[0].values[fulldata.datasets[0].values.length] = mean;

    
    fulldata.labels.push(fulldata.labels[fulldata.labels.length-1] + 1);
    chart = createChart(fulldata);

    return chart, fulldata;
}

const updateChart = async (text, chart, fulldata) => {
    let data = await fetchDataPOST("https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px");
    /*let data2 = await fetchDataGET("https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px");
    let indexCounter;
    for(var counter = 0; counter <= data2.variables[1].values.length; counter++ ){
        if(data2.variables[1].values[0].toLowerCase() == text.toLowerCase()){
            indexCounter = counter;
        }
      }*/

    return chart, fulldata;
}

const fetchDataPOST = async (url) => {
    const response = await fetch(url, 
      {
         method: "POST",
         headers: {"content-type": "application/json"},
         body: JSON.stringify(jsonBody)
        })
    if(!response.ok){ 
        console.log("no response (post)");
        return null; }
    const data = await response.json();
    return data;
}

const fetchDataGET = async (url) => {
    const response = await fetch(url, 
      {
         method: "GET",
         headers: {"content-type": "application/json"},
        })
    if(!response.ok){ return null; }
    const data = await response.json();
    return data;
}

let form = document.getElementById("input");
let addData = document.getElementById("add-data");
let textfield = document.getElementById("input-area");

console.log(jsonBody);

var fulldata = await createData(jsonBody);
/*
console.log(fulldata);
var chart = createChart(fulldata);

addData.addEventListener("click", function (chart){
    chart, fulldata = addPointChart(chart, fulldata);
    console.log(fulldata);
})

form.addEventListener("submit", async function () {
    event.preventDefault();
    jsonBody.query[1].selection.values = textfield.value.toUpperCase();
    console.log(jsonBody.query[1].selection.values);
    fulldata = await createData(jsonBody);
    chart = createChart(fulldata);
})*/



