let radialMenus = document.querySelectorAll(".radial-menu");
let children = []


start();

function start() {
    radialMenus = document.querySelectorAll(".radial-menu");

    document.querySelectorAll(".radial-child").forEach(function(child) {
        child.style.visibility = "hidden";
    });

    radialMenus.forEach(function(radialMenu) {
        let c = radialMenu.querySelectorAll(".radial-child");
        //let children = radialMenu.children;
        children = [];
        c.forEach(function(child) {
            if (child.parentElement === radialMenu) {
                children.push(child);
            }
        });

        let deltaAngle = (Math.PI * 2) / children.length;

        let angle = 0;

        let mainHeight = 40;
        let gap = 5;
        let time = 0.1;
        children.forEach(function(child) {
            let childHeight = 20
            let c = Math.cos(angle);
            let s = Math.sin(angle);
            child.style.transitionDelay = time + "s";
            child.style.left = c * (gap + mainHeight / 2 + childHeight / 2) + childHeight / 2 + "vmin";
            child.style.top = s * (gap + mainHeight / 2 + childHeight / 2) + childHeight / 2 + "vmin";
            child.style.visibility = "visible";
            angle += deltaAngle;
            time += 0.1;
            if (child.querySelectorAll(".radial-child").length > 0) {
                child.addEventListener("click", promote);
            }
        });
    });
}

function promote(event) {
    let child = event.currentTarget;
    let main = child.parentElement;

    child.style.zIndex = 0;
    child.style.transitionDelay = "0s";
    child.style.left = 0;
    child.style.top = 0;
    child.style.height = "40vmin";
    child.style.width = "40vmin";
    child.style.backgroundColor = "#cccccc";
    child.style.fontSize = "100%";

    children.forEach(function(c) {
        if (c != child) {
            console.log(c);
            c.style.transitionDelay = "0s";
            c.style.left = "10vmin";
            c.style.top = "10vmin";
        }
    })

    setTimeout(function() {
        child.removeEventListener("click", promote);
        child.className = "radial-menu";
        child.classList.add("circle");
        child.style.zIndex = 10;
        child.style = "";
        main.className="";
        //main.className = "hidden-radial-menu";
        start();
    }, 700);
}

function generateTranslation(x, y) {
    return "translate(" + x + "vmin, " + y + "vmin)";
}