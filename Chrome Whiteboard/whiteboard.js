initGlowboard();

function initGlowboard() {
    let glowBoard = buildGlowboard();
    setBoardStyle(glowBoard);
    addCanvasListeners(glowBoard.canvas, glowBoard.ctx);
}

function buildGlowboard() {
    let board = document.createElement("div");

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    let optionsDiv = buildOptionsDiv(canvas, ctx);

    //Attach everything together
    document.body.appendChild(board);
    board.appendChild(optionsDiv);
    board.appendChild(canvas);

    return {
        board: board,
        optionsDiv: optionsDiv,
        canvas: canvas,
        ctx: ctx
    };
}

function buildOptionsDiv(canvas, ctx) {
    let boardEnabled = true;

    //Add stuff to whiteboard popup
    let optionsDiv = document.createElement("div");
    let toggleButton = document.createElement("button");
    let eraseButton = document.createElement("button");

    //Create board toggle
    toggleButton.innerHTML = "Toggle";
    toggleButton.addEventListener("click", function() {
        if (boardEnabled) {
            canvas.style.visibility = "hidden";
            canvas.style.height = "0px";
        } else {
            canvas.style.visibility = "visible";
            canvas.style.height = "";
        }
        boardEnabled = !boardEnabled;
    });

    //Create erase button
    eraseButton.innerHTML = "Erase All";
    eraseButton.addEventListener("click", function() {
        ctx.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);
    });

    //Add everything to options
    optionsDiv.appendChild(toggleButton);
    optionsDiv.appendChild(eraseButton);

    return optionsDiv;
}

function setBoardStyle(glowBoard) {
    glowBoard.optionsDiv.style.position = "fixed";
    glowBoard.optionsDiv.style.height = "100px";

    glowBoard.board.style.display = "block";
    glowBoard.board.style.overflow = "auto";
    glowBoard.board.style.position = "absolute";
    glowBoard.board.style.top = "0px";
    glowBoard.board.style.zIndex = "10000";

    glowBoard.canvas.setAttribute("width", document.body.clientWidth);
    glowBoard.canvas.setAttribute("height", document.body.clientHeight);
    glowBoard.canvas.style.backgroundColor = "#FFFFFF66";
    glowBoard.canvas.style.zIndex = "10000";
}

function addCanvasListeners(canvas, ctx) {
    //Checks for whether to draw or not, where mouse position is
    mousedown = false;
    lastX = 0;
    lastY = 0;

    canvas.addEventListener("mousedown", function(e) {
        mousedown = true;
        lastX = e.clientX - canvas.getBoundingClientRect().x;
        lastY = e.clientY - canvas.getBoundingClientRect().y;
    });

    canvas.addEventListener("mouseup", function(e) {
        mousedown = false;
    });

    canvas.addEventListener("mousemove", function(e) {
        //While mouse down, draw a line from the previous mouse position to the current one
        if (mousedown) {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(e.clientX - canvas.getBoundingClientRect().x, e.clientY - canvas.getBoundingClientRect().y);
            ctx.stroke();

            //Update previous position
            lastX = e.clientX - canvas.getBoundingClientRect().x;
            lastY = e.clientY - canvas.getBoundingClientRect().y;
        }
    });
}