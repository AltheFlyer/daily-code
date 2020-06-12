let directChildren = [];


let origMenu = {};
let menu = {};
let wrapper = {};

saveMenu();


function saveMenu() {
    origMenu = document.querySelector(".radial-menu");
    menu = document.querySelector(".radial-menu");
    wrapper = document.querySelector(".radial-wrapper");

    let children = menu.querySelectorAll(".radial-child");

    directChildren = [];

    children.forEach(function(child) {
        if (child.parentElement === menu) {
            directChildren.push(child);
        } else {
            //child.style.visibility = "hidden";
            //child.style.display = "none";
        }
    });

    displayChildren(directChildren);
}

function displayChildren(directChildren) {
    let deltaAngle = (Math.PI * 2) / directChildren.length;

    let angle = 0;

    let mainHeight = 40;
    let gap = 5;
    let time = 0.1;

    directChildren.forEach(function(child) {
        console.log(child);
        let childHeight = 20;
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        child.style.transitionDuration = "10s";
        child.style.visibility = "visible";
        child.style.transitionDelay = time + "s";
        child.style.left = c * (gap + mainHeight / 2 + childHeight / 2) + childHeight / 2 + "vmin";
        child.style.top = s * (gap + mainHeight / 2 + childHeight / 2) + childHeight / 2 + "vmin";

        child.style.display = "";
        angle += deltaAngle;
        time += 0.1;
        if (child.querySelectorAll(".radial-child").length > 0) {
            child.addEventListener("click", promote);
        }
    });
}

function promote(event) {
    let mainTarget = event.currentTarget;

    mainTarget.style = "";
    mainTarget.style.zIndex = 0;
    mainTarget.style.transitionDelay = "0s";
    mainTarget.style.left = 0;
    mainTarget.style.top = 0;
    mainTarget.style.height = "40vmin";
    mainTarget.style.width = "40vmin";
    mainTarget.style.backgroundColor = "#cccccc";
    mainTarget.style.fontSize = "100%";

    directChildren.forEach(function(c) {
        if (c != mainTarget) {
            c.style = "";
            c.style.transitionDelay = "0s";
            c.style.left = "10vmin";
            c.style.top = "10vmin";
        }
    })

    setTimeout(function() {
        menu = mainTarget;
        mainTarget.removeEventListener("click", promote);
        wrapper.innerHTML = "";
        wrapper.appendChild(mainTarget);
        mainTarget.style = "";
        mainTarget.className = "circle radial-menu";

        let children = mainTarget.querySelectorAll(".radial-child");
        directChildren = [];
    
        children.forEach(function(c) {
            if (c.parentElement === mainTarget) {
                directChildren.push(c);
                c.style.transitionDuration = "5s";
                c.style.visibility = "visible";
                c.style.display = "";
            }
        });

        displayChildren(directChildren);

    }, 5000);
}

function generateTranslation(x, y) {
    return "translate(" + x + "vmin, " + y + "vmin)";
}