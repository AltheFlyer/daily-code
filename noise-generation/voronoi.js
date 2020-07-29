let canvas = document.getElementById("noise-1");
let ctx = canvas.getContext("2d");

let controlPoints = [];
let numPoints = 10;

Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
    this.color = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")";
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
            let closestPoint = controlPoints[0];
            for(let i = 0; i < controlPoints.length; i++) {
                let d = getSquareDistance(x, y, controlPoints[i]) 
                if (minSquareDist > d) {
                    minSquareDist = d;
                    closestPoint = controlPoints[i];
                }
            }

            ctx.fillStyle = closestPoint.color;
            ctx.fillRect(x, y, 1, 1);
        }
    }

    ctx.fillStyle = "black";
    for(let i = 0; i < controlPoints.length; i++) {
        ctx.beginPath();
        ctx.arc(controlPoints[i].x, controlPoints[i].y, 3, 0, Math.PI * 2);
        ctx.fill();
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
});


selectedPoint = {};

canvas.addEventListener("mousedown", function(e) {
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
    for(let i = 0; i < controlPoints.length; i++) {
        let x = mouseX - controlPoints[i].x;
        let y = mouseY - controlPoints[i].y;
        if (x * x + y * y < 100) {
            selectedPoint = controlPoints[i];
        }
    }
});

canvas.addEventListener("mouseup", function() {
    selectedPoint = {};
});

canvas.addEventListener("mousemove", function(e) {
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
    if (selectedPoint != {}) {
        selectedPoint.x = mouseX;
        selectedPoint.y = mouseY;
        draw();
    }
})