let canvas = document.getElementById("main-canvas");
let ctx = canvas.getContext("2d");

let Point = function(x, y) {
    this.x = x;
    this.y = y;
}

let points = [
    new Point(200, 200),
    new Point(200, 400),
    new Point(400, 200),
    new Point(400, 400),
    new Point(270, 260),
    new Point(350, 300),
    new Point(290, 340),
];

draw();

let shiftPress = false;
let currentDrawFunction = () => {};


document.addEventListener("keydown", function(event) {
    if (event.key == "Shift") {
        shiftPress = true;
    }
});

document.addEventListener("keyup", function(event) {
    if (event.key == "Shift") {
        shiftPress = false;
    }
})

canvas.addEventListener("mousedown", function(event) {
    let x = event.x - canvas.getBoundingClientRect().x;
    let y = event.y - canvas.getBoundingClientRect().y;

    if (!shiftPress) {
        points.push(new Point(x, y));
        draw();
    } else {
        event.preventDefault();
        for (let i = 0, len = points.length; i < len; i++) {
            if ((y - points[i].y) * (y - points[i].y) + (x - points[i].x) * (x - points[i].x) < 25) {
                points.splice(i, 1);
                len--;
            }
        }
        draw();
    }
});

function draw() {
    ctx.clearRect(0, 0, 600, 600);

    ctx.fillStyle = "#000000";

    points.forEach(function(p) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    let hull = grahamscan(points);
    if (hull != null) {
        ctx.beginPath();
        ctx.moveTo(hull[0].x, hull[0].y);
        hull.forEach(function(p) {
            ctx.lineTo(p.x, p.y);
        });
        ctx.lineTo(hull[0].x, hull[0].y);
        ctx.stroke();

        ctx.fillStyle = "#FF0000";
        hull.forEach(function(p) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

function grahamscan(points) {
    //Find lowest point
    let lowestPoint = new Point(Infinity, Infinity);
    points.forEach(p => {
        if (p.y < lowestPoint.y) {
            lowestPoint = p;
        } else if (p.y == lowestPoint.y && p.x < lowestPoint.x) {
            lowestPoint = p;
        }
    });

    let pSet = [];

    points.forEach(function(p) {
        if (p != lowestPoint) {
            pSet.push(p);
        }
    })

    //Sort remaining pSet by angle
    pSet.sort(function(a, b) {
        let aAngle = Math.atan2((a.y-lowestPoint.y), (a.x-lowestPoint.x));
        let bAngle = Math.atan2((b.y-lowestPoint.y), (b.x-lowestPoint.x));
        if (aAngle < bAngle) {
            return -1;
        } else if (aAngle > bAngle) {
            return 1;
        } 
        return 0;
    });

    //Remove duplicate angles, keep only furthest
    for (let i = 1, len = pSet.length; i < len; i++) {
        if (getAngle(lowestPoint, pSet[i - 1]) == getAngle(lowestPoint, pSet[i])) {
            if (((pSet[i - 1].y - lowestPoint.y) * (pSet[i - 1].y - lowestPoint.y) + (pSet[i - 1].x - lowestPoint.x) * (pSet[i - 1].x - lowestPoint.x)) >
            ((pSet[i].y - lowestPoint.y) * (pSet[i].y - lowestPoint.y) + (pSet[i].x - lowestPoint.x) * (pSet[i].x - lowestPoint.x))) {
                pSet.splice(i, 1);
            } else {
                pSet.splice(i - 1, 1);
            }
            len--;
        }
    }

    if (pSet.length == 2) {
        pSet.push(lowestPoint);
        return pSet;
    }
    if (pSet.length < 3) {
        return null;
    }

    let pointStack = pSet.splice(0, 3);

    if (getAngle(pointStack[pointStack.length - 3], pointStack[pointStack.length - 2]) > 
    getAngle(pointStack[pointStack.length - 2], pointStack[pointStack.length - 1])) {
        pointStack.splice(pointStack.length - 2, 1);
    }

    while (pSet.length > 0) {
        pointStack.push(pSet.splice(0, 1)[0]);
        while (pointStack.length >= 3 && getAngle(pointStack[pointStack.length - 3], pointStack[pointStack.length - 2]) > getAngle(pointStack[pointStack.length - 2], pointStack[pointStack.length - 1])) {
            pointStack.splice(pointStack.length - 2, 1);
        } 
    }

    pointStack.push(lowestPoint);

    return pointStack;
}

//Get the angle from point A to point B
function getAngle(pointA, pointB) {
    let x = Math.atan2((pointB.y-pointA.y), (pointB.x-pointA.x));
    if (x < 0) {
        x += Math.PI * 2;
    }
    return x;
}
