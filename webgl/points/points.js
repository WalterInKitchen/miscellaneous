
const VSHADER_SOURCE =
    `attribute vec4 a_position;\n
void main(){\n 
    gl_Position=a_position; \n
    gl_PointSize=10.0;\n
}`;

const FSHADER_SOURCE =
    `precision mediump float;\n
    uniform vec4 u_pointColor;\n
void main(){\n \
gl_FragColor=u_pointColor;\n \
}`;

const points = [];
main();
function main() {
    console.log('locad points');
    const canvas = document.getElementById('webgl');
    const gl = canvas.getContext('webgl');
    const program = initShader(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    initBackgroud(gl);
    canvas.onmousedown = function (ev) {
        initBackgroud(gl);
        const point = translateWebGlPoint(ev, canvas);
        points.push(point);
        drawPoints(gl, points, program);
    };
}

function drawPoints(gl, points = [], program) {
    const position = gl.getAttribLocation(program, 'a_position');
    const colorLocation = gl.getUniformLocation(program, 'u_pointColor');
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        console.log('draw', point);
        const color = getZoneColor(point);
        gl.vertexAttrib3f(position, point.x, point.y, 0.0);
        gl.uniform4f(colorLocation, color.r, color.g, color.b, color.a);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
function getZoneColor(point) {
    var color = {
        r: 0.0,
        g: 0.0,
        b: 1.0,
        a: 1.0
    };
    if (point.x < 0) {
        color.r = 1.0;
    }
    if (point.y < 0) {
        color.g = 1.0;
    }
    return color;
}

function translateWebGlPoint(ev, canvas) {
    const rect = canvas.getBoundingClientRect();
    const x = ((ev.clientX - rect.x) - rect.width / 2) / (rect.width / 2);
    const y = (rect.height / 2 - (ev.clientY - rect.y)) / (rect.height / 2);
    return { x: x, y: y };
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

function initBackgroud(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}