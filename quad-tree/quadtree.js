"use strict";

let canvas = document.getElementById("main-canvas");
let ctx = canvas.getContext("2d");

const CAPACITY = 5;
const MAX_DEPTH = 3;

let Rectangle = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.collides = function(rect) {
        let leftBetween = this.x > rect.x && this.x < rect.x + rect.w;
        let rightBetween = this.x + this.w > rect.x && this.x + this.w < rect.x + rect.w;

        let topBetween = this.y > rect.y && this.y < rect.y + rect.h;
        let botBetween = this.y + this.h > rect.y && this.y + this.h < rect.y + rect.h;
 
        return (leftBetween || rightBetween) && (topBetween || botBetween);
    }
}

let Velocity = function(vx, vy) {
    this.x = vx;
    this.y = vy;
}

let Quadtree = function(depth, x, y, w, h) {
    this.objects = [];
    this.children = [];
    this.depth = depth;

    this.capacity = CAPACITY;
    this.maxDepth = MAX_DEPTH;

    this.rect = new Rectangle(x, y, w, h);

    this.split = function() {
        this.children.push(new Quadtree(this.depth + 1, this.rect.x + this.rect.w/2, this.rect.y, this.rect.w/2, this.rect.h/2));
        this.children.push(new Quadtree(this.depth + 1, this.rect.x, this.rect.y, this.rect.w/2, this.rect.h/2));
        this.children.push(new Quadtree(this.depth + 1, this.rect.x, this.rect.y + this.rect.h/2, this.rect.w/2, this.rect.h/2));
        this.children.push(new Quadtree(this.depth + 1, this.rect.x + this.rect.w/2, this.rect.y + this.rect.h/2, this.rect.w/2, this.rect.h/2));
    }

    this.clear = function() {
        this.objects = [];
        this.children = [];
    }

    this.getChildIndex = function(rect) {
        let output = -1;

        let fitInTop = rect.y > this.rect.y && rect.y + rect.h < this.rect.y + this.rect.h / 2;
        let fitInBottom = rect.y > this.rect.y + this.rect.h / 2 && rect.y < this.rect.y + this.rect.h;

        let fitInLeft = rect.x > this.rect.x && rect.x + rect.w < this.rect.x + this.rect.w / 2;
        let fitInRight = rect.x > this.rect.x + this.rect.w / 2 && rect.x + rect.w < this.rect.x + this.rect.w;

        if (fitInTop) {
            if (fitInLeft) {
                return 1;
            } else if (fitInRight) {
                return 0;
            }
        } else if (fitInBottom) {
            if (fitInLeft) {
                return 2;
            } else if (fitInRight) {
                return 3;
            }
        }

        return output;
    }

    this.insert = function(rect) {
        if (this.children.length > 0) {
            let index = this.getChildIndex(rect);
            if (index != -1) {
                this.children[index].insert(rect);
                return;
            }
        }
        
        this.objects.push(rect)

        if (this.objects.length > this.capacity && this.depth < this.maxDepth) {
            if (this.children.length == 0) {
                this.split();
            }
            
            for (let i = 0; i < this.objects.length; i++) {
                let index = this.getChildIndex(this.objects[i]);
                if (index != -1) {
                    this.children[index].insert(this.objects.splice(i, 1)[0]);
                    i--;
                }
            }
        }
    }

    this.getCollidable = function(rect) {
        let output = [];
        let index = this.getChildIndex(rect);
        if (index != -1 && this.children.length != 0) {
            let childSet = this.children[index].getCollidable(rect);
            for (let i = 0; i < childSet.length; i++) {
                output.push(childSet[i]);
            }
        }

        for (let i = 0; i < this.objects.length; i++) {
            output.push(this.objects[i]);
        }
        return output;
    }

    this.draw = function(ctx) {
        if (this.children.length != 0) {
            ctx.beginPath();
            ctx.moveTo(this.rect.x + this.rect.w/2, this.rect.y);
            ctx.lineTo(this.rect.x + this.rect.w/2, this.rect.y + this.rect.h);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(this.rect.x, this.rect.y + this.rect.h/2, );
            ctx.lineTo(this.rect.x + this.rect.w, this.rect.y + this.rect.h/2);
            ctx.stroke();

            for (let i = 0; i < this.children.length; i++) {
                this.children[i].draw(ctx);
            }
        }
    }

    this.getCount = function() {
        let out = this.objects.length;
        if (this.children.length != 0) {
            for (let i = 0; i < this.children.length; i++) {
                out += this.children[i].getCount();
            }
        }
        return out;
    }
}

let tree = new Quadtree(0, 0, 0, 600, 600);
let rectangles = [];
let velocities = [];

for (let i = 0; i < 2500; i++) {
    rectangles.push(new Rectangle(Math.random() * 550 + 25, Math.random() * 550 + 25, 5.0, 5.0));
    tree.insert(rectangles[i]);
    velocities.push(new Velocity(Math.random() * 100 - 50, Math.random() * 100 - 50));
}


let lastTime = Date.now();

function draw() {

    tree.clear();
    
    for (let i = 0; i < rectangles.length; i++) {
        tree.insert(rectangles[i]);
    }

    let overlap = [];
    let delta = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();
    ctx.clearRect(0, 0, 600, 600);

    ctx.fillStyle = "#ff000044";
    console.log(delta);
    
    for (let i = 0; i < rectangles.length; i++) {
        rectangles[i].x += velocities[i].x * delta;
        rectangles[i].y += velocities[i].y * delta;
        if (rectangles[i].x < 0) {
            rectangles[i].x = 0;
            velocities[i].x *= -1;
        }
        if (rectangles[i].x + rectangles[i].w > 600) {
            rectangles[i].x = 600 - rectangles[i].w;
            velocities[i].x *= -1;
        }

        if (rectangles[i].y < 0) {
            rectangles[i].y = 0;
            velocities[i].y *= -1;
        }
        if (rectangles[i].y + rectangles[i].h > 600) {
            rectangles[i].y = 600 - rectangles[i].h;
            velocities[i].y *= -1;
        }
    }
    
    for (let i = 0; i < rectangles.length; i++) {
        ctx.fillRect(rectangles[i].x, rectangles[i].y, rectangles[i].w, rectangles[i].h);
        let collidable = tree.getCollidable(rectangles[i]);
        for (let j = 0; j < collidable.length; j++) {
            if (collidable[j] != rectangles[i] && collidable[j].collides(rectangles[i])) {
                overlap.push(rectangles[i]);
                overlap.push(collidable[j]);
                j = collidable.length;
            }
        }
    }

    ctx.strokeStyle = "#000000";
    for (let i = 0; i < overlap.length; i++) {
        ctx.strokeRect(overlap[i].x, overlap[i].y, overlap[i].w, overlap[i].h);
    }
    tree.draw(ctx);
    requestAnimationFrame(draw);
}

draw();


