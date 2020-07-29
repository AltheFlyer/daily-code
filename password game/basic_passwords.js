let submitButton = document.getElementById("submit-button");
let submission = document.getElementById("password-submission");


submitButton.addEventListener("click", function() {
    let password = submission["password"].value;
    console.log(password);
    let lower = hasLower(password);
    let upper = hasUpper(password);
    let digit = hasDigit(password);
    let special = hasSpecial(password);
    let length = fitLength(password, 8, 16);
    if (!lower) {
        document.getElementById("lower").style.color = "red";
    } else {
        document.getElementById("lower").style.color = "green";
    }
    if (!upper) {
        document.getElementById("upper").style.color = "red";
    } else {
        document.getElementById("upper").style.color = "green";
    }
    if (!digit) {
        document.getElementById("digit").style.color = "red";
    } else {
        document.getElementById("digit").style.color = "green";
    }
    if (!special) {
        document.getElementById("special").style.color = "red";
    } else {
        document.getElementById("special").style.color = "green";
    }
    if (!length) {
        document.getElementById("length").style.color = "red";
    } else {
        document.getElementById("length").style.color = "green";
    }

    if (lower && upper && digit && special && length) {
        document.getElementById("result").innerHTML = "Password fulfills requirements";
    } else {
        document.getElementById("result").innerHTML = "Password fails requirements";
    }
});