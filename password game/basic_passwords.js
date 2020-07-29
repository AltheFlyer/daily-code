let submitButton = document.getElementById("submit-button");
let submission = document.getElementById("password-submission");


let conditionHolder = document.getElementById("conditions");

let conditions = [];

conditionHolder.querySelectorAll("li").forEach(element => {
    let req = element.getAttribute("req");
    
    switch (req) {
        case "upper":
            conditions.push(new PasswordCondition(hasUpper, element));
            break;
        case "lower":
            conditions.push(new PasswordCondition(hasLower, element));
            break;
        case "digit":
            conditions.push(new PasswordCondition(hasDigit, element));
            break;
        case "special":
            conditions.push(new PasswordCondition(hasSpecial, element));
            break;
        case "length":
            let min = parseInt(element.getAttribute("min"));
            let max = parseInt(element.getAttribute("max"));

            conditions.push(new PasswordCondition(
                function(string) {
                    return fitLength(string, min, max);
                }, element));
            break;
    }
});


submitButton.addEventListener("click", function() {
    let password = submission["password"].value;
    
    let pass = true;

    conditions.forEach(element => {
        if (element.check(password)) {
            element.textComponent.style.color = "green";
        } else {
            element.textComponent.style.color = "red";
            pass = false;
        }
    });

    if (pass) {
        document.getElementById("result").innerHTML = "Password fulfills requirements";
    } else {
        document.getElementById("result").innerHTML = "Password fails requirements";
    }
});