let assert = require("assert");
let p = require("../password_check");

describe('Simple Regex', function() {
    describe("lower", function() {
        let tests = [
            {args: "a", expect: true},
            {args: "A", expect: false},
            {args: "Aa", expect: true},
            {args: "1a1", expect: true},
            {args: "QWERTYUIOPASDFGHJKLZXCVBNM", expect: false},
            {args: "1234567890[];',./`", expect: false},
            {args: "a3rfgtuh409i*(*($#@#$", expect: true},
            {args: "", expect: false},
        ];

        it ('should return true if input string contains lowercase letters, false otherwise', function() {
            (tests).forEach(test => {
                assert.equal(p.hasLower(test.args), test.expect);
            });
        });
    });
    describe("upper", function() {
        let tests = [
            {args: "A", expect: true},
            {args: "a", expect: false},
            {args: "Aa", expect: true},
            {args: "", expect: false},
            {args: "AbCdE", expect: true},
            {args: "1234567890[];',./`", expect: false},
            {args: "a3rfgtuh409i*(*($#@#$", expect: false},
        ];
        
        it ('detects uppercase letters', function() {
            (tests).forEach(test => {   
                assert.equal(p.hasUpper(test.args), test.expect);
            });
        });
    });
    describe("digit", function() {
        let tests = [
            {args: "1", expect: true},
            {args: "123456789", expect: true},
            {args: "1adascascasc", expect: true},
            {args: "", expect: false},
            {args: "][-=`]';.;'[ewo", expect: false},
        ];
        
        it ('detects digits', function() {
            (tests).forEach(test => {   
                assert.equal(p.hasDigit(test.args), test.expect);
            });
        });
    });
    describe("special", function() {
        let tests = [
            {args: "a", expect: false},
            {args: "*", expect: true},
            {args: "_", expect: true},
            {args: "     ", expect: false},
            {args: "", expect: false},
            {args: "adcvhrfo23123ASASDwkfeowje&", expect: true},
            {args: "1-2", expect: true},
        ];
        it ('detects special characters', function() {
            (tests).forEach(test => {   
                assert.equal(p.hasSpecial(test.args), test.expect);
            });
        });
    });
});

describe("String Tests", function() {
    describe("length", function() {
        let minTests = [
            {args: ["asd", 1], expect: true},
            {args: ["asd", 3], expect: true},
            {args: ["asd", 4], expect: false},
        ];
        let fullTests = [
            {args: ["asd", 1, 3], expect: true},
            {args: ["asd", 1, 10], expect: true},
            {args: ["asd", 1, 2], expect: false},
            {args: ["asd", 2, 3], expect: true},
            {args: ["asd", 4, 5], expect: false},
        ];
        it ('checks min string length', function() {
            minTests.forEach(test => {
                assert.equal(p.fitLength(test.args[0], test.args[1]), test.expect);
            });
        });
        it ('checks min and max string length', function() {
            fullTests.forEach(test => {
                assert.equal(p.fitLength(test.args[0], test.args[1], test.args[2]), test.expect);
            });
        });
    });
});

describe("Weird Regex", function() {
    describe("only stars", function() {
        let tests = [
            {args: "*", expect: true},
            {args: "***", expect: true},
            {args: "", expect: false},
            {args: "a*", expect: false},
            {args: "******|**", expect: false},
            {args: "********a", expect: false},
        ];
        it ('only returns true when the string is all stars', function() {
            tests.forEach(test => {
                assert.equal(p.onlyStars(test.args), test.expect);
            });
        });
    });
});

/*
describe("Regex Range", function() {
    describe("Direct Output", function() {
        let minTests = [
            {args: ["", 0], expect: "{0,}"},
            {args: ["", 3], expect: "{3,}"},
            {args: ["", 523], expect: "{523,}"},
        ];
        let minMaxTests = [
            {args: ["", 0, 2], expect: "{0,2}"},
            {args: ["", 3, 7], expect: "{3,7}"},
            {args: ["", 523, 1235], expect: "{523,1235}"},     
        ];
        let fullTests = [
            {args: ["h", 0, 2], expect: "h{0,2}"},
            {args: ["[0-9]", 3, 7], expect: "[0-9]{3,7}"},
            {args: ["[\d*]", 523, 1235], expect: "[\d*]{523,1235}"},     
        ];
        it ('returns expected regex strings when only given min', function() {
            (minTests).forEach(test => {
                assert.equal(p.regRange(test.args[0], test.args[1]), test.expect);
            });
        });
        it ('returns expected regex strings when given min and max', function() {
            (minMaxTests).forEach(test => {
                assert.equal(p.regRange(test.args[0], test.args[1], test.args[2]), test.expect);
            });
        });
        it ('returns expected regex strings when given min and max, and a string to append to', function() {
            (fullTests).forEach(test => {
                assert.equal(p.regRange(test.args[0], test.args[1], test.args[2]), test.expect);
            });
        });
    });
    describe("Integration Testing", function() {
        let minTests = [
            {args: ["123", 0], expect: true},
            {args: ["123", 3], expect: true},
            {args: ["123", 4], expect: false},
            {args: ["123", 2], expect: true},
        ];
        let fullTests = [
            {args: ["123", 1, 3], expect: true},
            {args: ["123", 1, 4], expect: true},
            {args: ["123", 1, 2], expect: false},
            {args: ["123", 2, 3], expect: true},
            {args: ["123", 3, 3], expect: true},
            {args: ["123", 4, 5], expect: false},
        ];

        it ('should work in detecting a minimum number of digits', function() {
            minTests.forEach(test => {
                assert.equal(p.hasDigit(test.args[0], test.args[1]), test.expect);
            });
        });

            fullTests.forEach(test => {
                it ('should work in detecting a range of digits', function() {
                assert.equal(p.hasDigit(test.args[0], test.args[1], test.args[2]), test.expect);
            });
        });
    });
});
*/