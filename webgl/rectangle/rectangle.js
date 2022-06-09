const VSHADER_SOURCE =
    `attribute vec4 a_position;\n
void main(){\n 
    gl_Position=a_position; \n
}`;

const FSHADER_SOURCE =
    `precision mediump float;\n
    uniform vec4 u_pointColor;\n
void main(){\n \
gl_FragColor=u_pointColor;\n \
}`;

main();

function main() {
    const ele = document.getElementById('webgl');
    const gl = ele.getContext('webgl');
    initBackgroud(gl);
    const program = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    ele.onmousedown = function (evt) {
        const point = translateToPoint(ele, evt.clientX, evt.clientY);
        const points = createAroundPoints(point);
        initBackgroud(gl);
        drawTriangle(gl, program, points);
    }
}
function drawTriangle(gl, program, points) {
    const glBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(pos);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, points.length / 2);
}

function createAroundPoints(point) {
    return new Float32Array([
        point.x - 0.2, point.y + 0.2,
        point.x - 0.2, point.y - 0.2,
        point.x + 0.2, point.y + 0.2,
        point.x + 0.2, point.y - 0.2,
    ]);
}

function translateToPoint(ele, axisX, axisY) {
    const rect = ele.getBoundingClientRect();
    const x = ((axisX - rect.x) - ele.width / 2) / (ele.width / 2);
    const y = (ele.height / 2 - (axisY - rect.y)) / (ele.height / 2);
    return {
        x: x,
        y: y
    }
}

function initBackgroud(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function initShader(gl, vs, fs) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs);
    const framentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs);
    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, framentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
    return program;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}
