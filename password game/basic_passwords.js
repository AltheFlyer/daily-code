//Search for these within the page
let submitButton = document.getElementById("submit-button");
let submission = document.getElementById("password-submission");
let conditionHolder = document.getElementById("conditions");

//Sets the text for a condition description, if none is present
function tryAutoText(conditionElement, text) {
    //I assume the pipe notation means always prioritize text within the element...
    //...unless there is none, in which case the text is falsy?
    conditionElement.innerHTML = conditionElement.innerHTML || text;
}

//Generate the set of password conditions
let conditions = [];

//Expect some kind of list of passwords, possibly with some (hopefully) appropriate text
conditionHolder.querySelectorAll("li").forEach(element => {
    let req = element.getAttribute("req");
    switch (req) {
        case "upper":
            conditions.push(new PasswordCondition(hasUpper, element));
            tryAutoText(element, "Has uppercase letters [A-Z]");
            break;
        case "lower":
            conditions.push(new PasswordCondition(hasLower, element));
            tryAutoText(element, "Has lowercase letters [a-z]");
            break;
        case "digit":
            conditions.push(new PasswordCondition(hasDigit, element));
            tryAutoText(element, "Has numbers [0-9]");
            break;
        case "special":
            conditions.push(new PasswordCondition(hasSpecial, element));
            tryAutoText(element, "Has special characters ([]~*-`\", etc)");
            break;
        case "length":
            //This is a special case since the check function needs two numbers as well
            //Fortunately, these are constants so we can generate a function to capture this
            let min = parseInt(element.getAttribute("min")) || 0;
            let max = parseInt(element.getAttribute("max")) || -1;

            conditions.push(new PasswordCondition(
                function(string) {
                    return fitLength(string, min, max);
                }, element));
            if (max > -1) {
                if (min > 0) {
                    tryAutoText(element, "Has at least " + min + " characters and at most " + max + " characters.");
                } else {
                    tryAutoText(element, "Has at most " + max + " characters.");
                }
            } else {    
                tryAutoText(element, "Has at least " + min + " characters.");
            }
            break;
            
    }
});


submitButton.addEventListener("click", function() {
    let password = submission["password"].value;
    let pass = true;

    //Check for the success of each condition, and apply styling as needed
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