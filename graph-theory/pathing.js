let canvas = document.getElementById("main");
let ctx = canvas.getContext("2d");


let mapWidth = 30;
let mapHeight = 30;
let boxWidth = canvas.width/mapWidth;
let boxHeight = canvas.height/mapHeight;
let map = [];

let Tile = function() {
    this.distance = -1;
    this.isSolid = false;

    this.reset = function() {
        this.distance = -1;
    }
}

for (let y = 0; y < mapHeight; y++) {
    let row = [];
    for (let x = 0; x < mapWidth; x++) {
        row.push(new Tile());
    }
    map.push(row);
}

console.log(map);


ctx.strokeStyle = "#000000";
let draw = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            ctx.fillStyle = "#55555500";
            if (map[x][y].isSolid) {
                ctx.fillRect(x * boxWidth, y * boxHeight, boxWidth, boxHeight);
            } else {
                ctx.strokeRect(x * boxWidth, y * boxHeight, boxWidth, boxHeight);
            }

            if (map[x][y].distance > -1) {
                ctx.fillStyle ="rgba(0, 0, " + Math.min(255, (10 * map[x][y].distance)) + ")";
                ctx.fillRect(x * boxWidth, y * boxHeight, boxWidth, boxHeight);
            }
        }
    }
}

draw();

let bfs = function(startX, startY, endX, endY) {
    let queue = [];
    queue.push({x: startX, y: startY});
    map[startX][startY].distance = 0;

    while (queue.length > 0) {
        let currentSpace = queue.shift();
        let x = currentSpace.x;
        let y = currentSpace.y;

        if (x > 0 && map[x - 1][y].distance == -1) {
            queue.push({x: x - 1, y: y});
            map[x - 1][y].distance = map[x][y].distance + 1;
            if (x - 1 == endX && y == endY)
                break;
        }
        if (y > 0 && map[x][y - 1].distance == -1) {
            queue.push({x: x, y: y - 1});
            map[x][y - 1].distance = map[x][y].distance + 1;
            if (x == endX && y - 1 == endY)
                break;
        }
        if (x < mapWidth - 1 && map[x + 1][y].distance == -1) {
            queue.push({x: x + 1, y: y});
            map[x + 1][y].distance = map[x][y].distance + 1;
            if (x + 1== endX && y == endY)
                break;
        }
        if (y < mapHeight - 1 && map[x][y + 1].distance == -1) {
            queue.push({x: x, y: y + 1});
            map[x][y + 1].distance = map[x][y].distance + 1;
            if (x == endX && y + 1 == endY)
                break;
        }
        draw();
    }
    console.log(map[endX][endY].distance);
}


bfs(0, 0, 10, 10);

canvas.addEventListener("click", function(e) {
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    let gridX = parseInt(x/boxWidth);
    let gridY = parseInt(y/boxHeight);

    map[gridX][gridY].isSolid = !map[gridX][gridY].isSolid;
    draw();
});