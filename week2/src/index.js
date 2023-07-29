//import "./styles.css";


if(document.readyState !== "loading") { //täysin kävelletty source koodista
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function() {
      initializeCode();
  })
}

function initializeCode(){
  const myButton = document.getElementById("submit-data");
  const del = document.getElementById("empty-table");
  const info = document.getElementById("info");

  myButton.addEventListener("click", function() {
    updateTable();
    console.log("info recieved")
  })

  del.addEventListener("click", function() {
    deleteTable();
    console.log("Table deleted")
  })

  info.addEventListener("submit", function(){
    event.preventDefault();
  })

}

function updateTable(){
  let table = document.getElementById("table");
  let form = document.getElementById("info");
  let username = document.getElementById("input-username");
  let email = document.getElementById("input-email");
  let address = document.getElementById("input-address");
  let admin = document.getElementById("input-admin");
  let inputImage = document.getElementById("input-image");
  let image = document.createElement("img");
  if(inputImage.files[0]){
    image.src = URL.createObjectURL(inputImage.files[0]);
    console.log("image detected");
  }
  image.alt = "image";

    //epic code from w3schools
  var found = 0;
  for (let counter = 0; counter < table.rows.length; counter++) {
    if(table.rows[counter].cells[0].innerText == username.value){
        var row = table.rows[counter];
        var nameCell = row.cells[0];
        var emailCell = row.cells[1];
        var addressCell = row.cells[2];
        var adminCell = row.cells[3];
        var pictureCell = row.cells[4];
        found = 1;
    }
  } 
  if (found == 0){
    var row = table.insertRow(-1);
    var nameCell = row.insertCell(0);
    var emailCell = row.insertCell(1);
    var addressCell = row.insertCell(2);
    var adminCell = row.insertCell(3);
    var pictureCell = row.insertCell(4);
  }

  nameCell.innerHTML = username.value;
  emailCell.innerHTML = email.value;
  addressCell.innerHTML = address.value;
  image.height = 64;
  image.width = 64;
  if(pictureCell.childElementCount >= 1){
    pictureCell.children[0].remove();
    pictureCell.appendChild(image);
  }else{
    pictureCell.appendChild(image);
  }
  
  if(admin.checked == true){
      adminCell.innerText = "yes";
    }
  else{
      adminCell.innerText = "no";
    }
}

function deleteTable(){
  let table = document.getElementById("table");  //https://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table 
  var rowsAmount = table.rows.length;
  for(let counter = 1; counter < rowsAmount; counter++){
    table.deleteRow(-1);
  }
  
}