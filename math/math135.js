let eeaInput = document.getElementById("eea-input");
let eeaInputs = eeaInput.elements;
let eeaOutputTable = document.getElementById("eea-output-table");
let eeaOutput = document.getElementById("eea-output");

eeaInput.getElementsByTagName("button")[0].addEventListener("click", function(e) {
    reseteeaTable();
    let a = parseInt(eeaInputs["eea-a"].value);
    let b = parseInt(eeaInputs["eea-b"].value);
    let eea = generateEEA(a, b);
    console.log(eea);
    
    for (let i = 0; i < eea.table.length; i++) {
        let row = eeaOutputTable.insertRow(i + 1);
        for (let j = 0; j < 4; j++) {
            let cell = row.insertCell(j);
            cell.innerHTML = eea.table[i][j];
        }
    }

    eeaOutput.innerHTML = "gcd(" + a + ", " + b + ") = " + a + "<br>" + "(" + eea.s + ")(" + a + ") + (" + eea.t + ")(" + b + ")" + " = " + eea.gcd;    

    e.preventDefault();
});

function reseteeaTable() {
    while (eeaOutputTable.rows.length > 1) {
        eeaOutputTable.deleteRow(1);
    }
}

function generateEEA(a, b) {
    let table = [];
    let swapAB = false;
    let negateA = false;
    let negateB = false;
    if (a < 0) {
        negateA = true;
        a *= -1;
    }
    if (b < 0) {
        negateB = true;
        b *= -1;
    }
    if (a < b) {
        let c = a;
        a = b;
        b = c;
        swapAB = true;
    }

    let r = 1;
    let q = 1;

    table.push([1, 0, a, 0]);
    table.push([0, 1, b, 0]);

    let currentRow = 1;
    while (r != 0) {
        currentRow++;
        q = parseInt(a/b);
        r = a - b*q;

        table.push([table[currentRow - 2][0] - q * table[currentRow - 1][0], table[currentRow - 2][1] - q * table[currentRow - 1][1],r, q]);
        
        a = b;
        b = r;
    }

    let s = table[currentRow - 1][0];
    let t = table[currentRow - 1][1];
    if (swapAB) {
        let c = t;
        t = s;
        s = c;
    }
    if (negateA) {
        s *= -1;
    }
    if (negateB) {
        t *= -1;
    }

    return {
        table: table,
        s: s,
        t: t,
        gcd: a
    }
}


let moduloInput = document.getElementById("mod-input");
let moduloA = moduloInput["mod-a"];
let moduloM = moduloInput["mod-m"];
let mathModeCheck = moduloInput["math-mode"];
let moduloOutput = document.getElementById("mod-output");

function updateModulo() {
    let a = parseInt(moduloA.value);
    let m = parseInt(moduloM.value);

    if (a % m || a % m == 0) {
        console.log(mathModeCheck);
        if (a >= 0) {
            moduloOutput.innerHTML = a % m;
        } else {
            moduloOutput.innerHTML = m - (-a) % m;
        }
    } else {
        moduloOutput.innerHTML = "?";
    }
}

moduloA.addEventListener("input", updateModulo);
moduloM.addEventListener("input", updateModulo);
mathModeCheck.addEventListener("input", updateModulo);