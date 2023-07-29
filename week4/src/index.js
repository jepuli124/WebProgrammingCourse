//import "./styles.css"; ":D?"


if(document.readyState !== "loading") { 
  createElements();
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function() {
      createElements();
      initializeCode();
  })
}

function createElements(){ //Didn't fix anything but I didn't want to reverse this change
  const container = document.getElementById("container");

  let form = document.createElement("form");
  form.id = "info";
  let input = document.createElement("input");
  input.type = "text";
  input.id = "input-show";
  let butto = document.createElement("button");
  butto.id = "submit-data";
  butto.innerHTML = "data";
  form.appendChild(input);
  form.appendChild(butto);
  container.appendChild(form);
}

function initializeCode(){
 
  const button = document.getElementById("submit-data");
  const info = document.getElementById("info");
  
  

  button.addEventListener("click", function() {
    let dataSrc = document.getElementById("input-show");
    console.log(dataSrc.value);
    fetchData(dataSrc.value);
  })

  info.addEventListener("submit", function(){
    event.preventDefault();
  })

}

function updateSchedule(data){
  let body = document.getElementById("body");
  console.log(data);
  
  data.forEach(element => {
    let outerDiv = document.createElement("div");
    let image = document.createElement("img");
    let div = document.createElement("div");
    let header = document.createElement("h1");
    let paragraph = document.createElement("p");
    try {
      image.src = element.show.image.medium;
    } catch (TypeError) {
      console.log("no image")
    }
    
    header.innerHTML = element.show.name;
    paragraph.innerHTML = element.show.summary;
    outerDiv.className = "show-data";
    div.className = "show-info";

    body.appendChild(image);
    div.appendChild(header);
    div.appendChild(paragraph);
    outerDiv.appendChild(div);
    body.appendChild(outerDiv);
  });
  

  
}

function fetchData(text){
  fetch('https://api.tvmaze.com/search/shows?q='+ text)
  .then(response => response.json())
  .then(data => {
    updateSchedule(data);
    });


}
