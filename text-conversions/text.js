let textInputElement = document.getElementById("input");
let textOutputElement = document.getElementById("output");

textInputElement.value = "";
textOutputElement.value = "";

let aestheticButton = document.getElementById("aesthetic-button");
let memecaseButton = document.getElementById("memecase-button");

aestheticButton.addEventListener("click", function() {
    let input = textInputElement.value;
    textOutputElement.value = input.split("").join(" ");
});

memecaseButton.addEventListener("click", function() {
    let input = textInputElement.value;
    let output = "";
    for (let i = 0; i < input.length; i+= 2) {
        output += input.charAt(i).toUpperCase();
        output += input.charAt(i + 1).toLowerCase();
    }
    textOutputElement.value = output;
});