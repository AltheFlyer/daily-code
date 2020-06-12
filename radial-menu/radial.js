let directChildren = [];


let origMenu = {};
let menu = {};
let wrapper = {};

saveMenu();


function saveMenu() {
    origMenu = document.querySelector(".radial-menu");
    menu = document.querySelector(".radial-menu");
    menu.style = "";
    wrapper = document.querySelector(".radial-wrapper");

    let children = menu.querySelectorAll(".radial-child");
    directChildren = [];

    children.forEach(function(child) {
        child.style = "";
        if (child.parentElement === menu) {
            directChildren.push(child);
        } else {
            child.style.visibility = "hidden";
        }
    });

    displayChildren(directChildren);
}

function displayChildren(dc) {
    let deltaAngle = (Math.PI * 2) / dc.length;

    let angle = 0;

    let mainHeight = 40;
    let gap = 5;
    let time = 0.1;

    dc.forEach(function(child) {
        let childHeight = 20;
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        child.style.transitionDuration = "0.7s";
        child.style.transitionDelay = time + "s";
        child.style.left = c * (gap + mainHeight / 2 + childHeight / 2) + childHeight / 2 + "vmin";
        child.style.top = s * (gap + mainHeight / 2 + childHeight / 2) + childHeight / 2 + "vmin";

        child.style.visibility = "";

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
            c.style.left = "10vmin";
            c.style.top = "10vmin";
        }
    });

    setTimeout(function() {
        menu = mainTarget.cloneNode(true);
        menu.removeEventListener("click", promote);
        wrapper.innerHTML = "";
        menu.style = "";
        menu.className = "circle radial-menu";

        wrapper.appendChild(menu);

        directChildren = [];
        menu.querySelectorAll(".radial-child").forEach(function(c) {
            if (c.parentElement == menu) {
                directChildren.push(c);
            }
        });

        //Force a recalculation for the position of elements
        //Prevents animation from being cut
        wrapper.offsetWidth;
        displayChildren(directChildren);
    }, 700);
}