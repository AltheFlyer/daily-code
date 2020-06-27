let canvas = document.getElementById("display");
let ctx = canvas.getContext("2d");

let RotatingCircle = function(angle, angularVelocity, radius) {
    this.angle = angle;
    this.angularVelocity = angularVelocity;
    this.radius = radius;
}

let mousePos = {
    x: 0,
    y: 0
}

let circles = [];
circles.push(new RotatingCircle(0, Math.PI * 2, 10));
circles.push(new RotatingCircle(0, Math.PI * 1.3, 30));
circles.push(new RotatingCircle(0, Math.PI * 0.7, 16));

ctx.fillStyle ="#000000";
let lastTime = Date.now();

let draw = function() {
    ctx.clearRect(0, 0, 1000, 1000);
    let now = Date.now();
    let delta = (now - lastTime)/1000;
    lastTime = now;
    circles.forEach((circle) => {
        circle.angle += circle.angularVelocity * delta;

        ctx.beginPath();
        ctx.arc(mousePos.x + Math.cos(circle.angle) * circle.radius, mousePos.y + Math.sin(circle.angle) * circle.radius, circle.radius, 0, Math.PI * 2);
        ctx.stroke();
    });

    requestAnimationFrame(draw);
}

draw();



canvas.addEventListener("mousemove", function(e) {
    let rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;
});