window.addEventListener('load', start);

var input1 = null;
var input2 = null;
var input3 = null;

function start(){
    input1 = document.querySelector("#input1");
    input2 = document.querySelector("#input2");
    input3 = document.querySelector("#input3");

    input1.addEventListener("change", getInputId);
    input2.addEventListener("change", getInputId);
    input3.addEventListener("change", getInputId);
    changeDivColor();
}

function getInputId(event){
    console.log(event);
    var inputId = event.path[0].id;
    console.log(inputId);
    var number = 0;
    if(inputId === "input1"){
        number = 1;
    }else if(inputId === "input2"){
        number = 2;
    }else if(inputId === "input3"){
        number = 3;
    }else{
        return -1;
    }
    changeLabelNumber(number);
    changeDivColor();
}

function changeLabelNumber(number){
    var inputx = document.querySelector("#input" + number);
    var labelx = document.querySelector("#readonly" + number);
    labelx.value = inputx.value; 
}

function changeDivColor(){
    var red = input1.value;
    var green = input2.value;
    var blue = input3.value;
    var rgb = "rgb(" + red + "," + green + "," + blue + ")";
    document.querySelector(".color-output").style.backgroundColor = rgb;
}