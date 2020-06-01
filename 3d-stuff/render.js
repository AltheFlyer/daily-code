/*START INITIALIZATION*/ 
let canvas = document.getElementById("screen");
let gl = canvas.getContext("webgl");


let vertexShaderSource = document.getElementById("vertex-shader").text;

let fragmentShaderSource = document.getElementById("fragment-shader").text;

function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}


let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

let program = createProgram(gl, vertexShader, fragmentShader);
let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
let colorLocation = gl.getAttribLocation(program, "a_color");

let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

let positions = [
    110, 200,
    280, 200,
    110, 300,
    110, 300,
    280, 200,
    280, 300,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


let colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0, 0, 1,
    0, 0, 0, 1,
    0, 0, 0, 1,
    0, 0, 0, 1,
    0, 0, 0, 1,
    0, 0, 0, 1,
]), gl.STATIC_DRAW);

/*END INITIALIZATION*/

function draw() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    /*
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 1,
        0, 0, 0, 1,
    ]), gl.STATIC_DRAW);
    */
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);


    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, positions.length/2);

    requestAnimationFrame(draw);
}

draw();