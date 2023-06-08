//import "./styles.css";

/*
function helloWorld(){
  let ftext = document.getElementById("ftext");

  console.log("hello world");

  ftext.innerText = "My notebook";
  
}

function addData(){
  let list = document.getElementById("listofdata");
  const area = document.getElementById("textarea");
  partOfList = document.createElement("li");
  partOfList.innerText = area.value;
  list.appendChild(partOfList);

} */ // Toimi XAMPP serveril mut codeGrade said "not defined"

if(document.readyState !== "loading") {
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function() {
      initializeCode();
  })
}

function initializeCode() {
  const myButton = document.getElementById("my-button");
  const addData = document.getElementById("add-data");

  myButton.addEventListener("click", function() {
    let ftext = document.getElementById("ftext");

    console.log("hello world");
  
    ftext.innerText = "My notebook";

  })

  addData.addEventListener("click", function() {
    let list = document.getElementById("listofdata");
    const area = document.getElementById("textarea");
    partOfList = document.createElement("li");
    partOfList.innerText = area.value;
    list.appendChild(partOfList);

  })

}
