let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let outputText = document.getElementById("output");

let canvasX = canvas.width;
let canvasY = canvas.height;

let selectors = setCanvasSelectors(canvas);

selectors.push(new Draggable(100, 100));

selectors[0].x.input.roundTo(25).clamp(100, 200);
selectors[0].x.output.add(-100).multiply(1/25);
selectors[0].y.input.roundTo(25).clamp(100, 200);
selectors[0].y.output.add(-100).multiply(1/25);

selectors.push(new Draggable(300, 300));
selectors[1].x.input.roundTo(25).clamp(300, 500);
selectors[1].y.input.clamp(300, 500);

console.log(selectors);

ctx.fillStyle = "black";

function draw() {
    ctx.clearRect(0, 0, canvasX, canvasY);
    outputText.innerHTML = "";
    selectors.forEach(e => {
        e.draw(ctx);
        outputText.innerHTML += JSON.stringify(e.get());
    });

    requestAnimationFrame(draw);
}

draw();