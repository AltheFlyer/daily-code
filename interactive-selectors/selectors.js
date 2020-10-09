class Modifier {
    constructor() {
        this.modifiers = [];
    };

    modify(v) {
        this.modifiers.forEach(mod => {
            v = mod(v);
        });
        return v;
    };

    clamp(low, high) {
        this.modifiers.push(function(v) {
            return Math.min(Math.max(v, low), high);
        });
        return this;
    };

    add(adder) {
        this.modifiers.push(function(v) {
            return v + adder;
        });
        return this;
    };

    multiply(mult) {
        this.modifiers.push(function(v) {
            return v * mult;
        });
        return this;
    };

    constant(c) {
        this.modifiers.push(function(v) {
            return c;
        });
        return this;
    };

    roundTo(rounder) {
        this.modifiers.push(function(v) {
            return Math.floor(v/rounder) * rounder;
        });
        return this;
    }
}

class SelectableNumber {
    constructor(value) {
        this.value = value;
        this.input = new Modifier();
        this.output = new Modifier();
    };

    get = function() {
        return this.output.modify(this.value);
    };

    set = function(v) {
        this.value = this.input.modify(v);
    };
}

class Draggable {
    constructor(x, y) {
        this.x = new SelectableNumber(x);
        this.y = new SelectableNumber(y);

        this.xPos = this.x.value;
        this.yPos = this.y.value;

        this.selected = false;
        this.rad = 10;

        return this;
    }

    get = function() {
        return {
            x: this.x.get(), 
            y: this.y.get()
        };
    };

    set = function(value) {
        this.x.set(value.x);
        this.y.set(value.y);

        this.xPos = this.x.value;
        this.yPos = this.y.value;
    };

    draw = function(ctx) {

        ctx.beginPath();
        ctx.arc(this.xPos, this.yPos, this.rad, 0, 2 * Math.PI);
        ctx.fill();
    };

    select = function(mouse) {
        if ((mouse.x - this.xPos) * (mouse.x - this.xPos) + (mouse.y - this.yPos) * (mouse.y - this.yPos) <= this.rad * this.rad) {
            this.selected = true;
        }
    };

    deselect = function(mouse) {
        this.selected = false;
    };

    drag = function(mouse) {
        if (this.selected) {
            this.set(mouse);
        }
    };
}

function setCanvasSelectors(canvas) {
    let selectors = [];
    let mdown = false;

    function getMouse(e) {
        return {
            x: e.clientX - canvas.getBoundingClientRect().x,
            y: e.clientY - canvas.getBoundingClientRect().y,
        }
    }

    canvas.addEventListener("mousedown", function(e) {
        let mouse = getMouse(e);
        mdown = true;
        selectors.forEach(s => {
            s.select(mouse);
        });
    });

    canvas.addEventListener("mouseup", function(e) {
        let mouse = getMouse(e);
        mdown = false;
        selectors.forEach(s => {
            s.deselect(mouse);
        });
    });
    
    canvas.addEventListener("mousemove", function(e) {
        if (mdown) {
            let mouse = getMouse(e);
            selectors.forEach(s => {
                s.drag(mouse);
            });
        }
    });

    return selectors;
}