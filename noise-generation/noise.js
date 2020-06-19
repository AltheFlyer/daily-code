let canvas1 = document.getElementById("noise-1");
let ctx1 = canvas1.getContext("2d");

let gridpoints = [];

//Step 1: generate vectors
for (let i = 0; i < 13; i++) {
    let row = [];
    for (let j = 0; j < 13; j++) {
        let theta = Math.random() * 2 * Math.PI;
        row.push(new Vector2(Math.cos(theta), Math.sin(theta)));
    }
    gridpoints.push(row);
}

//Step 2: Find values at points

function getDotFromPoint(px, py, x, y, vector) {
    let distance = new Vector2(px - x, py - y);

    return distance.dot(vector.x, vector.y);
}

function lerp(a, b, w) {
    return (1.0 - w) * a + w * b;
}

function smooth(x) {
    if (x < 0) {
        return 0;
    } else if (x > 1) {
        return 1;
    }
    return x * x * (3.0 - (2.0 * x));
}

function getPointValue(x, y) {
    let left = parseInt(x/50);
    let top = parseInt(y/50);

    let dx = x/50.0 - left;
    let dy = y/50.0 - top;

    let dp0 = getDotFromPoint(x, y, left * 50, top * 50, gridpoints[left][top]);
    let dp1 = getDotFromPoint(x, y, left * 50 + 50, top * 50, gridpoints[left + 1][top]);
    let dp2 = getDotFromPoint(x, y, left * 50, top * 50 + 50, gridpoints[left][top + 1]);
    let dp3 = getDotFromPoint(x, y, left * 50 + 50, top * 50 + 50, gridpoints[left + 1][top + 1]);

    let a = lerp(dp0, dp1, dx);
    let b = lerp(dp2, dp3, dx);

    return lerp(a, b, dy);
}

for (let y = 0; y < 200; y ++) {
    for (let x = 0; x < 200; x++) {
        let a = getPointValue(x, y);
        //console.log(a);
        a *= 10.0;
        if (a < 0) {
            ctx1.strokeStyle = "rgba(" + -a + "," + 0 + "," + 0 + "," + 255 + ")";
        } else {
            ctx1.strokeStyle = "rgba(" + 0 + "," + a + "," + 0 + "," + 255 + ")";
        }
        ctx1.strokeRect(x, y, 1, 1);
    }
}


function Vector2(x, y) {
    this.x = x;
    this.y = y;

    this.dot = function(x1, y1) {
        return x * x1 + y * y1;
    }
}