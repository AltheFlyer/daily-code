function hasLower(string) {
    return new RegExp("[a-z]").test(string);
}

function hasUpper(string) {
    return new RegExp("[A-Z]").test(string);
}

function hasDigit(string) {
    return new RegExp("[0-9]").test(string);
}

function hasSpecial(string) {
    return new RegExp("[^A-Za-z0-9 ]").test(string);
}

function fitLength(string, min=0, max=-1) {
    return string.length >= min && (max > -1 ? string.length <= max:true);
}

function onlyStars(string) {
    return new RegExp("^\\*+$").test(string);
}

function hasZalgo(string) {
    return new RegExp("[\u0300–\u036F\u1AB0–\u1AFF\u1DC0–\u1DFF\u20D0–\u20FF\uFE20–\uFE2F]").test(string);
}

/*
module.exports = {
    hasLower:hasLower,
    hasUpper:hasUpper,
    hasDigit:hasDigit,
    hasSpecial: hasSpecial,
    fitLength:fitLength,

    onlyStars: onlyStars,
    hasZalgo: hasZalgo
}
*/

let PasswordCondition = function(checkFunction, textComponent) {
    this.textComponent = textComponent;
    this.checkFunction = checkFunction;
    this.check = function(string) {
        return this.checkFunction(string);
    };
}