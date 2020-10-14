let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let outputText = document.getElementById("output");

let canvasX = canvas.width;
let canvasY = canvas.height;

let selectors = setCanvasSelectors(canvas);

selectors.push(new Draggable(100, 100));

selectors[0].x.input.add(12).roundTo(25).clamp(100, 200);
selectors[0].x.output.add(-100).multiply(1/25);
selectors[0].y.input.add(12).roundTo(25).clamp(100, 200);
selectors[0].y.output.add(-100).multiply(1/25);

selectors.push(new Draggable(300, 300));
selectors[1].x.input.add(12).roundTo(25).clamp(300, 500);
selectors[1].y.input.clamp(300, 500);

console.log(selectors);

ctx.fillStyle = "black";

function draw() {
    ctx.clearRect(0, 0, canvasX, canvasY);
    
    ctx.fillStyle = "rgb(200, 200, 200)";
    for (let x = 100; x <= 200; x += 25) {
        for (let y = 100; y <= 200; y += 25) {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let x = 300; x <= 500; x += 25) {
        ctx.beginPath();
        ctx.arc(x, 300, 2, 0, Math.PI, true);
        //ctx.moveTo(x - 5, 500);
        ctx.arc(x, 500, 2, Math.PI, Math.PI * 2, true);
        //ctx.moveTo(x + 5, 300);
        ctx.fill();
    }

    ctx.fillStyle = "black";
    outputText.innerHTML = "";
    selectors.forEach(e => {
        e.draw(ctx);
        outputText.innerHTML += JSON.stringify(e.get());
    });

    requestAnimationFrame(draw);
}

draw();