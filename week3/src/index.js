//import "./styles.css";


if(document.readyState !== "loading") { //täysin kävelletty source koodista
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function() {
      initializeCode();
  })
}

function initializeCode(){
  fetchDataStat();
  const button = document.getElementById("button");

  button.addEventListener("click", function() {
    //fetchData();
  })

  /*del.addEventListener("click", function() {
    deleteTable();
    console.log("Table deleted")
  })

  info.addEventListener("submit", function(){
    event.preventDefault();
  })*/

}

function updateTable(data, data2){
  let tbody = document.getElementById("tablebody");
  
  for (let counter = 0; counter < data.dataset.value.length; counter++) {
    var row = tbody.insertRow(-1);
    var slot1 = row.insertCell(0);
    var slot2 = row.insertCell(1);
    var slot3 = row.insertCell(2);
    var slot4 = row.insertCell(3);
    
    if(data2.dataset.value[counter] > 0.45 * data.dataset.value[counter]){
      row.className = "employed";
    }else if(data2.dataset.value[counter] < 0.25 * data.dataset.value[counter]){
      row.className = "unemployed";
    }else if(table.rows.length % 2 == 1){
      row.className = "even"; //className from https://stackoverflow.com/questions/9109762/adding-css-class-to-a-dynamically-created-row-using-java-script
    } else {
      row.className = "odd";
    }
    slot2.innerText = data.dataset.value[counter];
    slot1.innerText = Object.values(data.dataset.dimension.Alue.category.label)[counter];  // object.values from https://bobbyhadz.com/blog/javascript-get-value-of-object-by-index
    slot3.innerText = data2.dataset.value[counter];
    slot4.innerText = Math.round((data2.dataset.value[counter]/data.dataset.value[counter])*10000)/100;
  };
  
}

function fetchDataStat(){
  let memory;
  fetch('https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff')
  .then(response => response.json())
  .then(data => {
    memory = data;
    fetch('https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065')
    .then(response => response.json())
    .then(data => {
    updateTable(memory, data);
    });
  });


}

function deleteTable(){
  let table = document.getElementById("table");   
  var rowsAmount = table.rows.length;
  for(let counter = 1; counter < rowsAmount; counter++){
    table.deleteRow(-1);
  }
  
}