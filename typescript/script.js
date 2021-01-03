var ConwayBoard = /** @class */ (function () {
    function ConwayBoard(width, height) {
        this.surrounding = [[-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]];
        this.tileSize = 20;
        this.width = width;
        this.height = height;
        this.board = [];
        //Generate Conway board cells
        for (var y = 0; y < height; y++) {
            var row = [];
            for (var x = 0; x < width; x++) {
                row.push('dead');
            }
            this.board.push(row);
        }
        this.turns = 0;
    }
    //Gets the number of 'alive' tiles surrounding a tile with a position (x, y)
    ConwayBoard.prototype.getSurrounding = function (x, y) {
        var _this = this;
        var around = 0;
        //For every possible surrounding tile, check if it exists in the board
        //Then add to counter, if it is alive
        this.surrounding.forEach(function (s) {
            var dx = s[0], dy = s[1];
            if (x + dx >= 0 && x + dx < _this.width && y + dy >= 0 && y + dy < _this.height) {
                if (_this.board[y + dy][x + dx] === 'alive') {
                    around++;
                }
            }
        });
        return around;
    };
    //Runs a step of the Conway simulation
    //All dead tiles with 3 living neighbours will become alive
    //All alive tiles with 2-3 living neighbours will remain alive, otherwise they will die
    //All inactive tiles remain inactive
    //All steps happen simultaneously
    //Turn counter increments after this function is done
    ConwayBoard.prototype.step = function () {
        //Declare new board for the output of the next step
        var newBoard = [];
        for (var y = 0; y < this.height; y++) {
            //Generate by row
            var newRow = [];
            for (var x = 0; x < this.width; x++) {
                var around = 0;
                switch (this.board[y][x]) {
                    case 'alive':
                        around = this.getSurrounding(x, y);
                        if (around == 2 || around == 3) {
                            newRow.push('alive');
                        }
                        else {
                            newRow.push('dead');
                        }
                        break;
                    case 'dead':
                        around = this.getSurrounding(x, y);
                        if (around == 3) {
                            newRow.push('alive');
                        }
                        else {
                            newRow.push('dead');
                        }
                        break;
                    case 'inactive':
                        newRow.push('inactive');
                        break;
                }
            }
            newBoard.push(newRow);
        }
        this.board = newBoard;
        this.turns += 1;
    };
    //Draws the Conway board on a canvas given its 2d rendering context
    ConwayBoard.prototype.draw = function (ctx) {
        var tileSize = this.tileSize;
        //Draw tiles
        ctx.fillStyle = "black";
        for (var y = 0; y < 25; y++) {
            ctx.beginPath();
            ctx.moveTo(y * tileSize, 0);
            ctx.lineTo(y * tileSize, 500);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, y * tileSize);
            ctx.lineTo(500, y * tileSize);
            ctx.stroke();
            for (var x = 0; x < 25; x++) {
                if (this.board[y][x] == 'alive') {
                    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }
        ctx.beginPath();
        ctx.moveTo(500, 0);
        ctx.lineTo(500, 500);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 500);
        ctx.lineTo(500, 500);
        ctx.stroke();
    };
    //Clears the board, setting all tiles to 'dead', and resetting the turn to 0
    ConwayBoard.prototype.clear = function () {
        this.board = [];
        //Generate Conway board cells
        for (var y = 0; y < this.height; y++) {
            var row = [];
            for (var x = 0; x < this.width; x++) {
                row.push('dead');
            }
            this.board.push(row);
        }
        this.turns = 0;
    };
    return ConwayBoard;
}());
//Gets the (x, y) position of the mouse relative to a canvas element
//Coordinates are measured with (0, 0) at the top left of the element
function getCanvasPosition(canvas, e) {
    return {
        x: e.clientX - canvas.getBoundingClientRect().x,
        y: e.clientY - canvas.getBoundingClientRect().y
    };
}
var canvas = document.getElementById('main-canvas');
var ctx = canvas.getContext('2d');
var turnCounter = document.getElementById('turn-counter');
var conwayGame = new ConwayBoard(25, 25);
var animationFunction = 0;
var isRunning = false;
//Draw the initial board when page loads
conwayGame.draw(ctx);
//When a canvas square is clicked, toggle whether a cell is alive or dead
canvas.addEventListener('click', function (e) {
    var point = getCanvasPosition(canvas, e);
    var x = Math.floor(point.x / conwayGame.tileSize);
    var y = Math.floor(point.y / conwayGame.tileSize);
    if (conwayGame.board[y][x] == 'alive') {
        conwayGame.board[y][x] = 'dead';
    }
    else {
        conwayGame.board[y][x] = 'alive';
    }
    ;
    ctx.clearRect(0, 0, 500, 500);
    conwayGame.draw(ctx);
});
//When the toggle (appears as Start/Continue/Stop) button is pressed, either start or stop the simulation
//Toggle button text changes to reflect the new action
//The interval that controls the simulation is stored in animationFunction
var togglebutton = document.getElementById('toggle-button');
togglebutton.addEventListener('click', function () {
    if (isRunning) {
        if (conwayGame.turns == 0) {
            togglebutton.innerHTML = "Start";
        }
        else {
            togglebutton.innerHTML = "Continue";
        }
        isRunning = false;
        clearTimeout(animationFunction);
    }
    else {
        togglebutton.innerHTML = "Stop";
        isRunning = true;
        animationFunction = setInterval(function () {
            conwayGame.step();
            turnCounter.innerHTML = conwayGame.turns.toString();
            ctx.clearRect(0, 0, 500, 500);
            conwayGame.draw(ctx);
        }, 500);
    }
});
//Moves the simulation forward one step
var stepButton = document.getElementById('step-button');
stepButton.addEventListener('click', function () {
    conwayGame.step();
    turnCounter.innerHTML = conwayGame.turns.toString();
    ctx.clearRect(0, 0, 500, 500);
    conwayGame.draw(ctx);
});
//Clears the board of the simulation, setting all cells to 'dead'
var clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', function () {
    conwayGame.clear();
    turnCounter.innerHTML = conwayGame.turns.toString();
    if (!isRunning) {
        togglebutton.innerHTML = "Start";
    }
    ctx.clearRect(0, 0, 500, 500);
    conwayGame.draw(ctx);
});
