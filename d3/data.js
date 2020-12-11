

function graph() {
    let data = [2621738, 1578408, 1956033, 2396218, 2993906, 3685657, 4499733, 4732602,
        4021347, 2999211, 1944382, 1075774, 501975, 205043, 77595, 
        28205, 10343, 4151, 1660, 1622];

    let div = d3.create("div");
    div.html("Hello world!");

    x = d3.scaleLinear()
        .domain([0, d3.max(data)])
        .range([0, 400])

    div.selectAll("div")
        .data(data)
        .join("div")
        .style("background", "steelblue")
        .style("width", d=> `${x(d)}px`)
        .style("margin", "2px")
        .style("padding", "2px")
        .style("text-align", "right")
        .style("color", "white")
        .style("box-sizing", "border-box")
        .style("font-family", "Segoe UI")
        .text(d => d)
        .join("div")
        .text(d => d);

    return div.node();
}

document.body.append(graph());