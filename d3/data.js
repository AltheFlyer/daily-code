function barGraph(data) {
    //variables for size of bars and graph
    let barHeight = 30;
    let width = 500;
    let height = data.length * barHeight + 100;
    let margin = {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
    }
    let innerWidth = width - margin.left - margin.right;
    let innerHeight = height - margin.top - margin.bottom;

    //The graph object as an svg element
    let svg = d3.create("svg");
    svg.attr('height', height)
        .attr('width', width);
    let maxValue = 5000000;//d3.max(data, d => parseInt(d.volume));

    //Linear scaling function
    xScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([0, innerWidth]);
    
    //Create set of labels for y axis
    let labels = []
    data.forEach(element => {
        labels.push(element.speed_bin);
    });
    
    //Y axis labeller function
    yScale = d3.scaleBand()
        .domain(labels)
        .range([0, barHeight * labels.length])
    
    //Put graph inside group element
    let group = svg.append("g")
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('width', innerWidth)
        .attr('height', innerHeight);
 
    //Add x axis
    group.append('g')
    .call(d3.axisBottom(xScale)
        .ticks(5)
        .tickSize(-innerHeight))
    .attr('transform', `translate(0, ${innerHeight})`)
    .append('text')
        .text('Net Volume')
        .attr('x', innerWidth/2)
        .attr('y', 30)
        .attr('fill', 'black')
        .attr('style', 'color: black');

    //Add y axis, remove default ticks
    group.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('.domain, .tick line')
            .remove()
            
    //Add bars to graph
    group.selectAll("rect").data(data)
        .enter().append('rect')
        .attr('y', d => yScale(d.speed_bin))
        .attr('width', d => xScale(d.volume))
        .attr('height', barHeight);///1.2);

    //Add title
    group.append('text')
        .attr('y', -10)
        .attr('style', 'font-family: sans-serif; font-size: 24px')
        .text("Speed of vehicles in school zones");

    return svg.node();
}

function getLinearModel(xData, yData) {
    let meanX = d3.mean(xData);
    let meanY = d3.mean(yData);
    let num = 0;
    let denom = 0;
    for (let i = 0, len = xData.length; i < len; i++) {
        num += (xData[i] - meanX) * (yData[i] - meanY);
        denom += (xData[i] - meanX) * (xData[i] - meanX)
    }
    let coefficient = num/denom;
    let devs = d3.deviation(yData)/d3.deviation(xData);
    let intercept = meanY - coefficient * devs * meanX;
    return {
        slope: coefficient * devs,
        intercept: intercept
    }
}

function scatterPlot(data) {
    let width = 500;
    let height = 500;
    let margin = {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
    }
    let innerWidth = width - margin.left - margin.right;
    let innerHeight = height - margin.top - margin.bottom;

    svg = d3.create('svg')
        .attr('width', width)
        .attr('height', height);
    console.log(data);

    let group = svg.append('g')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    let xScale = d3.scaleLinear()
        .domain([0, 20])
        .range([0, innerWidth]);

    console.log(d3.min(data, d=>parseFloat(d.average_travel_time)));
    console.log(d3.max(data, d=>parseFloat(d.average_travel_time)));
    console.log(data[0].month.substring(0, 3));

    let yScale = d3.scaleLinear()
        .domain([0, 24])
        .range([innerHeight, 0]);

    group.append('g')
        .attr('class', 'gridline')
        .call(d3.axisBottom(xScale)
            .tickSize(-innerHeight))
        .attr('transform', `translate(0, ${innerHeight})`)
        .append('text')
            .text('Baseline travel time')
            .attr('fill', 'black')
            .attr('x', innerWidth/2)
            .attr('y', 30);
    
    group.append('g')
        .attr('class', 'gridline')
        .call(d3.axisLeft(yScale)
            .tickSize(-innerWidth))
        .append('text')
            .text("Average travel time")
            .attr('fill', 'black')
            .attr('transform', `rotate(-90, -40, ${innerHeight/2})`)
            .attr('x', 0)
            .attr('y',innerHeight/2);
    
    group.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cx', d => xScale(d.baseline_travel_time))
        .attr('cy', d => yScale(d.average_travel_time))
        .attr('r', 2)
        .attr('style', 'fill: #88888855');
    
    group.append('text')
        .attr('y', -10)
        .attr('style', 'font-family: sans-serif; font-size: 24px')
        .text("Travel time of vehicles in Toronto");
    
    let xArr = [];
    let yArr = [];
    for (let i = 0; i < data.length; i++) {
        xArr.push(data[i].baseline_travel_time);
        yArr.push(data[i].average_travel_time);
    }

    let model = getLinearModel(xArr, yArr);

    group.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(model.intercept))
        .attr('x2', xScale(20))
        .attr('y2', yScale(model.slope * 20))
        .attr('stroke', 'black');

    let xMean = d3.mean(xArr);
    let yMean = d3.mean(yArr);
    
    group.append('line')
        .attr('x1', xScale(xMean))
        .attr('y1', 0)
        .attr('x2', xScale(xMean))
        .attr('y2', innerHeight)
        .attr('stroke', 'black');
    
    group.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(yMean))
        .attr('x2', innerWidth)
        .attr('y2', yScale(yMean))
        .attr('stroke', 'black');

    return svg.node();
}

function linePlot(data) {
    //Only take data from June
    //Modify dates to account for timezone badness
    //Makes it line up with the axis properly
    let newData = []
    for (let i = 0; i < data.length; i++) {
        //data[i]["Date/Time"] = new Date(data[i]["Date/Time"]).setHours(0);
        let d = new Date(data[i]["Date/Time"]);
        d.setTime( d.getTime() + d.getTimezoneOffset()*60*1000 );
        if (d.getMonth() == 6) {
            data[i]["Date/Time"] = d;
            newData.push(data[i]);
        }
    }

    data = newData;
    console.log(newData);
    let width = 600;
    let height = 600;
    let margin = {
        top: 50,
        bottom:50,
        right: 50,
        left: 50
    }

    let innerWidth = width - margin.left - margin.right;
    let innerHeight = height - margin.top - margin.bottom;

    let xScale = d3.scaleTime()
                    //Datetime is ??? so it will scale to the day before this
                    .domain([new Date("2020-07-02"), new Date("2020-07-31")])
                    .range([0, innerWidth])
                    .nice();
    
    let yScale = d3.scaleLinear()
                    //.domain(d3.extent(data, d => parseInt(d["Max Temp (°C)"])))
                    .domain([d3.min(data, d=>parseFloat(d["Min Temp (°C)"])), d3.max(data, d=>parseFloat(d["Max Temp (°C)"]))])
                    .range([innerHeight, 0])
                    .nice();

    let svg = d3.create('svg')
                    .attr('width', width)
                    .attr('height', height);

    let group = svg.append('g')
                    .attr('width', innerWidth)
                    .attr('height', innerHeight)
                    .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    group.append('g')
        .call(d3.axisBottom(xScale)
            .ticks(d3.timeDay, "%d"))
        .attr('transform', `translate(0, ${innerHeight})`);
    
        
    group.append('g')
        .call(d3.axisLeft(yScale));
    
    let maxArea = d3.area()
                    .curve(d3.curveNatural)
                    .x0(d => xScale(d["Date/Time"]))
                    .x1(d => xScale(d["Date/Time"]))
                    .y0(d => yScale(parseFloat(d["Mean Temp (°C)"])))
                    .y1(d => yScale(parseFloat(d["Max Temp (°C)"])));
    let meanLine = d3.line()
                    .curve(d3.curveNatural)
                    .x(d => xScale(d["Date/Time"]))
                    .y(d => yScale(parseFloat(d["Mean Temp (°C)"])));
    let minArea = d3.area()
                    .curve(d3.curveNatural)
                    .x0(d => xScale(d["Date/Time"]))
                    .x1(d => xScale(d["Date/Time"]))
                    .y0(d => yScale(parseFloat(d["Mean Temp (°C)"])))
                    .y1(d => yScale(parseFloat(d["Min Temp (°C)"])));


    group.append('path')
        .attr('d', maxArea(data))
        .attr('fill', '#fc5647')
        //.attr('stroke', 'red');
    
    
    group.append('path')
        .attr('d', minArea(data))
        .attr('fill', '#4287f5')
        //.attr('stroke', 'blue');
    
    group.append('path')
        .attr('d', meanLine(data))
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
    /*
    group.selectAll('circle')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => xScale(new Date(d["Date/Time"])))
        .attr('cy', d => yScale(parseInt(d["Max Temp (°C)"])))
        .attr('r', 4);
    */

    group.append('text')
        .text('Mean temperature in June')
        .attr('style', 'font: 24px sans-serif')
        .attr('y', -10);


    return svg.node();
}

d3.csv("data.csv").then(data => {
    document.body.append(barGraph(data));
    d3.csv("bluetooth-travel-time-summary.csv").then(data => {
        document.body.append(scatterPlot(data));
        d3.csv("en_climate_daily_ON_2020.csv").then(data => document.body.append(linePlot(data)));
    });
});