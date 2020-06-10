let radialMenus = document.querySelectorAll(".radial-menu");

start();

function start() {
    radialMenus = document.querySelectorAll(".radial-menu");

    document.querySelectorAll(".radial-child").forEach(function(child) {
        child.style.visibility = "hidden";
    });

    radialMenus.forEach(function(radialMenu) {
        let c = radialMenu.querySelectorAll(".radial-child");
        //let children = radialMenu.children;
        let children = [];
        c.forEach(function(child) {
            if (child.parentElement === radialMenu) {
                children.push(child);
            }
        });

        console.log(children);
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
            child.style.transform = generateTranslation(c * (gap + mainHeight / 2 + childHeight / 2), s * (gap + mainHeight / 2 + childHeight / 2));        
            child.style.visibility = "visible";
            angle += deltaAngle;
            time += 0.1;
            child.addEventListener("click", promote);
        });
    });
}

function promote(event) {
    let child = event.currentTarget;
    let main = child.parentElement;

    child.style.transitionDelay = "0s";
    child.style.transform = "translate(0, 0)";
    child.style.left = 0;
    child.style.top = 0;
    child.style.height = "40vmin";
    child.style.width = "40vmin";


    console.log("A");
    setTimeout(function() {
        child.removeEventListener("click", promote);
        child.className = "radial-menu";
        main.className = "";
        child.style.top = "";
        child.style.left = "";
        child.style.margin = "auto";
        console.log("K");
        start();
    }, 1000);
    console.log("B");
}

function generateTranslation(x, y) {
    return "translate(" + x + "vmin, " + y + "vmin)";
}