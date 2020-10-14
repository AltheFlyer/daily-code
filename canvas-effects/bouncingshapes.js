let canvas = document.getElementById("display");
let ctx = canvas.getContext("2d");

class BouncingCircle {
    constructor(x, y, r, vx, vy) {
        this.x = x;
        this.y = y;
        this.radius = r;
    
        this.vx = vx;
        this.vy = vy;
        this.minX = 0;
        this.maxX = 1000;
        this.minY = 0;
        this.maxY = 600;
    }

    setXBoundaries = function(min, max) {
        this.minX = min;
        this.maxX = max;
    }

    setYBoundaries = function(min, max) {
        this.minY = min;
        this.maxY = max;
    }

    move = function(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    }

    collide = function() {
        if (this.y - this.radius < this.minY && this.vy < 0) {
            this.vy *= -1;
            this.y -= (this.minY - this.y + this.radius) * 2;
        } else if (this.y + this.radius > this.maxY && this.vy > 0) {
            this.vy *= -1;
            this.y += (this.y + this.radius - this.maxY) * 2;
        }

        if (this.x + this.radius < this.minX && this.vx < 0) {
            this.x += (this.maxX - this.minX + 2 * this.radius);
        } else if (this.x - this.radius > this.maxX && this.vx > 0) {
            this.x -= (this.maxX - this.minX + 2 * this.radius);
        }
    }

    draw = function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
    }
}

class BouncingPolygon extends BouncingCircle {
    constructor(x, y, r, vx, vy, an, ar, sides) {
        super(x, y, r, vx, vy);
        this.angle = an;
        this.angularVelocity = ar;
        this.sides = sides;
    }

    move = function(delta) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
        this.angle += this.angularVelocity * delta;
    }

    draw = function(ctx) {
        /*
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        */

        /*
        for (let i = 0; i < this.sides; i++) {
            ctx.beginPath();
            ctx.arc(this.x + Math.cos(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius, this.y + Math.sin(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        */
        
        ctx.beginPath();
        ctx.moveTo(this.x + Math.cos(this.angle + (Math.PI * 2)/this.sides) * this.radius, this.y + Math.sin(this.angle + (Math.PI * 2)/this.sides) * this.radius)
        for (let i = 0; i <= this.sides; i++) {
            ctx.lineTo(this.x + Math.cos(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius, this.y + Math.sin(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius);
        }
        ctx.stroke();
    }

    collide = function() {
        if (this.vy < 0) {
            let x = undefined;
            let lowestY = undefined;
            for (let i = 0; i < this.sides; i++) {
                if (lowestY  == undefined || this.y + Math.sin(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius < lowestY) {
                    x = this.x + Math.cos(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius;
                    lowestY = this.y + Math.sin(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius;
                }
            }
            if (lowestY < this.minY) {
                this.vy *= -1;
                this.y -= (this.minY - lowestY) * 2;
            }
        } else if (this.vy > 0) {
            let x = undefined;
            let highestY = undefined;
            for (let i = 0; i < this.sides; i++) {
                if (highestY  == undefined || this.y + Math.sin(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius > highestY) {
                    x = this.x + Math.cos(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius;
                    highestY = this.y + Math.sin(this.angle + (Math.PI * 2 * i)/this.sides) * this.radius;
                }
            }
            if (highestY > this.maxY) {
                this.vy *= -1;
                this.y += (highestY - this.maxY) * 2;
            }
        }

        if (this.x + this.radius < this.minX && this.vx < 0) {
            this.x += (this.maxX - this.minX + 2 * this.radius);
        } else if (this.x - this.radius > this.maxX && this.vx > 0) {
            this.x -= (this.maxX - this.minX + 2 * this.radius);
        }
    }
}


let shapes = [];

for (let i = 0; i < 100; i++) {
    let theta = 0;
    if (Math.random() < 0.5) {
        theta = Math.random() * Math.PI/8 - Math.PI/16  + Math.PI / 4;
    } else {
        theta = Math.random() * Math.PI/8 - Math.PI/16  - Math.PI / 4;
    }
    let velocity = Math.random() * 100 + 100;
    let radius = Math.random() * 20 + 10;
    if (Math.random() < 0.2) {
        shapes.push(new BouncingCircle(Math.random() * 1000, Math.random() * 300 + 150, radius, Math.cos(theta) * velocity, Math.sin(theta) * velocity));
    } else {
        shapes.push(new BouncingPolygon(Math.random() * 1000, Math.random() * 300 + 150, radius, Math.cos(theta) * velocity, Math.sin(theta) * velocity, Math.random() * Math.PI * 2, Math.PI / 2, Math.floor(Math.random() * 4) + 3));
    }
}

let lastFrame = undefined;
ctx.strokeStyle = "#888888";
ctx.fillStyle = "black";
function draw(time) {
    ctx.clearRect(0, 0, 1000, 600);

    if (lastFrame == undefined) {
        lastFrame = time;
    }
    let frame = Math.min((time - lastFrame)/1000, 0.5);
    lastFrame = time;

    shapes.forEach((shape) => {
        shape.draw(ctx);
        shape.move(frame);
        shape.collide()
    });

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);