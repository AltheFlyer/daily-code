let canvas = document.getElementById("noise-1");
let ctx = canvas.getContext("2d");

let controlPoints = [];
let numPoints = 10;
let divider = 20;

Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
}

function getSquareDistance(x, y, vector) {
    return (y - vector.y) * (y - vector.y) + (x - vector.x) * (x - vector.x);
}

function randomizePoints() {
    controlPoints = [];
    /*
    controlPoints.push(new Vector2(33, 33));
    controlPoints.push(new Vector2(166, 33));
    controlPoints.push(new Vector2(33, 166));
    controlPoints.push(new Vector2(166, 166));
    controlPoints.push(new Vector2(66, 166));
    */

    for (let i = 0; i < numPoints; i++) {
        controlPoints.push(new Vector2(Math.random() * 600, Math.random() * 600));
    }
}

function draw() {
    for (let y = 0; y < 600; y++) {
        for (let x = 0; x < 600; x++) {
            let minSquareDist = Infinity;
            for(let i = 0; i < controlPoints.length; i++) {
                let d = getSquareDistance(x, y, controlPoints[i]) 
                if (minSquareDist > d) {
                    minSquareDist = d;
                }
            }
            minSquareDist /= divider;
            ctx.fillStyle = "rgb(" + minSquareDist + "," + minSquareDist + "," + minSquareDist + ")";
            ctx.fillRect(x, y, 1, 1);
        }
    }
}

randomizePoints();
draw();



let randomButton = document.getElementById("random-button");

let distanceScaler = document.getElementById("distance-scaler");

randomButton.addEventListener("click", function() {
    randomizePoints();
    draw();
});


distanceScaler.addEventListener("change", function() {
    numPoints = parseInt(distanceScaler.value);
    let current = controlPoints.length;
    if (numPoints > controlPoints.length) {
        for (let i = current; i < numPoints; i++) {
            controlPoints.push(new Vector2(Math.random() * 600, Math.random() * 600));
        }
    } else if (numPoints < controlPoints.length) {
        controlPoints.splice(0, numPoints);
    }

    draw();
})

let divideScaler = document.getElementById("division-scaler");

divideScaler.addEventListener("change", function() {
    divider = parseInt(divideScaler.value);
    draw();
});