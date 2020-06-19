let matrix3 = {
    getIdentity: function() {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
    },
    getTranslation: function(tx, ty) {
        return [
            [1, 0, 0],
            [0, 1, 0],
            [tx, ty, 1]
        ];
    },
    getRotation: function(theta) {
        let c = Math.cos(theta);
        let s = Math.sin(theta);
        return [
            [c, -s, 0],
            [s, c, 0],
            [0, 0, 1]
        ];
    },
    getScaling: function(sx, sy) {
        return [
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1]
        ]
    },
    //Just do the normal matrix multiplication but swap order of matrices
    multiply: function(ma, mb) {
        let b = mb;
        let a = ma;
        let output = [];
        for (let y = 0; y < 3; y++) {
            let row = [];
            for (let x = 0; x < 3; x++) {
                let sum = 0;
                for (let d = 0; d < 3; d++) {
                    sum += a[y][d] * b[d][x];
                }
                row.push(sum);
            }
            output.push(row);
        }
        return output;
    },
    toGL: function(mat) {
        let output = [];
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                output.push(mat[y][x]);
            }
        }
        return output;
    }
}

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
let matrixLocation = gl.getUniformLocation(program, "u_matrix");
let colorLocation = gl.getAttribLocation(program, "a_color");

let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

let positions = [
    0, 250,
    0, 350,
    600, 250,
    600, 250,
    0, 350,
    600, 350,
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

/*Transformations*/
let translation = [0, 0];
let rotation = 0;
let scale = [1, 1];
/*Transformations*/


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
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    
    let matrix = matrix3.getIdentity();
    matrix = matrix3.multiply(matrix, matrix3.getScaling(scale[0], scale[1]));
    matrix = matrix3.multiply(matrix, matrix3.getRotation(rotation));
    matrix = matrix3.multiply(matrix, matrix3.getTranslation(translation[0], translation[1]));

    gl.uniformMatrix3fv(matrixLocation, false, matrix3.toGL(matrix));

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(draw);
}

draw();

