type CellState = 'alive' | 'dead' | 'inactive';

class ConwayBoard {
    width: number;
    height: number;
    board: CellState[][];
    turns: number;
    surrounding: number[][] = [[-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0]];
    tileSize: number = 20;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.board = [];
        //Generate Conway board cells
        for (let y = 0; y < height; y++) {
            let row = [];
            for (let x = 0; x < width; x++) {
                row.push('dead');
            }
            this.board.push(row);
        }
        this.turns = 0;
    }

    //Gets the number of 'alive' tiles surrounding a tile with a position (x, y)
    getSurrounding(x: number, y : number): number {
        let around: number = 0;
        //For every possible surrounding tile, check if it exists in the board
        //Then add to counter, if it is alive
        this.surrounding.forEach(s => {
            let [dx, dy] = s;
            if (x + dx >= 0 && x + dx < this.width && y + dy >= 0 && y + dy < this.height) {
                if (this.board[y + dy][x + dx] === 'alive') {
                    around++;
                }
            }
        });
        return around;
    }

    //Runs a step of the Conway simulation
    //All dead tiles with 3 living neighbours will become alive
    //All alive tiles with 2-3 living neighbours will remain alive, otherwise they will die
    //All inactive tiles remain inactive
    //All steps happen simultaneously
    //Turn counter increments after this function is done
    step(): void {
        //Declare new board for the output of the next step
        let newBoard: CellState[][] = [];

        for (let y = 0; y < this.height; y++) {
            //Generate by row
            let newRow: CellState[] = [];
            for (let x = 0; x < this.width; x++) {
                let around: number = 0;
                switch (this.board[y][x]) {
                    case 'alive':
                        around = this.getSurrounding(x, y);
                        if (around == 2 || around == 3) {
                            newRow.push('alive');
                        } else {
                            newRow.push('dead');
                        }  
                        break;
                    case 'dead':
                        around = this.getSurrounding(x, y);
                        if (around == 3) {
                            newRow.push('alive');
                        } else {
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
    }

    //Draws the Conway board on a canvas given its 2d rendering context
    draw(ctx: CanvasRenderingContext2D): void {
        let tileSize = this.tileSize;
        //Draw tiles
        ctx.fillStyle = "black";
        for (let y = 0; y < 25; y++) {
            ctx.beginPath();
            ctx.moveTo(y * tileSize, 0);
            ctx.lineTo(y * tileSize, 500);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, y * tileSize);
            ctx.lineTo(500, y * tileSize);
            ctx.stroke();
            for (let x = 0; x < 25; x++) {
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
    }

    //Clears the board, setting all tiles to 'dead', and resetting the turn to 0
    clear(): void {
        this.board = [];
        //Generate Conway board cells
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                row.push('dead');
            }
            this.board.push(row);
        }
        this.turns = 0;
    }
}

interface Point {
    x: number;
    y: number;
}

//Gets the (x, y) position of the mouse relative to a canvas element
//Coordinates are measured with (0, 0) at the top left of the element
function getCanvasPosition(canvas: HTMLCanvasElement, e: MouseEvent): Point {
    return {
        x: e.clientX - canvas.getBoundingClientRect().x,
        y: e.clientY - canvas.getBoundingClientRect().y,
    }
}

let canvas: HTMLCanvasElement = document.getElementById('main-canvas') as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D = canvas.getContext('2d');

let turnCounter: HTMLSpanElement = document.getElementById('turn-counter') as HTMLSpanElement;

let conwayGame: ConwayBoard = new ConwayBoard(25, 25);
let animationFunction: number = 0;
let isRunning: boolean = false;

//Draw the initial board when page loads
conwayGame.draw(ctx);

//When a canvas square is clicked, toggle whether a cell is alive or dead
canvas.addEventListener('click', (e) => {
    let point: Point = getCanvasPosition(canvas, e);
    let x = Math.floor(point.x/conwayGame.tileSize);
    let y = Math.floor(point.y/conwayGame.tileSize);

    if (conwayGame.board[y][x] == 'alive') {
        conwayGame.board[y][x] = 'dead';
    } else {
        conwayGame.board[y][x] = 'alive';
    };

    ctx.clearRect(0, 0, 500, 500);
    conwayGame.draw(ctx);
});

//When the toggle (appears as Start/Continue/Stop) button is pressed, either start or stop the simulation
//Toggle button text changes to reflect the new action
//The interval that controls the simulation is stored in animationFunction
let togglebutton: HTMLButtonElement = document.getElementById('toggle-button') as HTMLButtonElement;
togglebutton.addEventListener('click', () => {
    if (isRunning) {
        if (conwayGame.turns == 0) {
            togglebutton.innerHTML = "Start";
        } else {
            togglebutton.innerHTML = "Continue";
        }
        isRunning = false;
        clearTimeout(animationFunction);
    } else {
        togglebutton.innerHTML = "Stop";
        isRunning = true;
        animationFunction = setInterval(() => {
            conwayGame.step(); 
            turnCounter.innerHTML = conwayGame.turns.toString();

            ctx.clearRect(0, 0, 500, 500);
            conwayGame.draw(ctx)
        }, 500);
    }
});

//Moves the simulation forward one step
let stepButton: HTMLButtonElement = document.getElementById('step-button') as HTMLButtonElement;
stepButton.addEventListener('click', () => {
    conwayGame.step();
    turnCounter.innerHTML = conwayGame.turns.toString();

    ctx.clearRect(0, 0, 500, 500);
    conwayGame.draw(ctx);
});

//Clears the board of the simulation, setting all cells to 'dead'
let clearButton: HTMLButtonElement = document.getElementById('clear-button') as HTMLButtonElement;
clearButton.addEventListener('click', () => {
    conwayGame.clear();
    turnCounter.innerHTML = conwayGame.turns.toString();
    if (!isRunning) {
        togglebutton.innerHTML = "Start";
    }

    ctx.clearRect(0, 0, 500, 500);
    conwayGame.draw(ctx);
});