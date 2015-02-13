var mat4 = require("mat4"),
    requestAnimationFrame = require("request_animation_frame"),
    WebGLContext = require("../src/index");


var canvas = document.getElementById("canvas"),
    context = new WebGLContext(),
    gl;


context.setCanvas(canvas);

gl = context.gl;
context.setViewport(0, 0, canvas.width, canvas.height);

var program = context.createProgram();

program.compile(
    [
        "uniform mat4 projection;",
        "uniform mat4 modelView;",

        "attribute vec3 position;",

        "varying vec3 vColor;",

        "void main(void) {",
        "    vec4 mvPosition = modelView * vec4(position, 1.0);",
        "    vColor = mvPosition.xyz;",
        "    gl_Position = projection * mvPosition;",
        "}"
    ].join("\n"), [
        "varying vec3 vColor;",

        "void main(void) {",
        "    gl_FragColor = vec4(vColor, 1.0);",
        "}"
    ].join("\n")
);

var buffer = context.createBuffer();
buffer.compile(gl.ARRAY_BUFFER, new Float32Array([
    1, 1, 0, -1, 1, 0,
    1, -1, 0, -1, -1, 0
]), 0, gl.STATIC_DRAW);

var triangleBuffer = context.createBuffer();
triangleBuffer.compile(gl.ARRAY_BUFFER, new Float32Array([
    0, 1, 0, -1, -1, 0,
    1, -1, 0
]), 0, gl.STATIC_DRAW);

var perspectiveMatrix = mat4.perspective(mat4.create(), 45, canvas.width / canvas.height, 0.1, 1024),
    modelView = mat4.create(),
    camera = [0, 0, -5];

function renderBox(ms) {
    camera[0] = Math.sin(ms * 0.001) * 2;
    camera[1] = 0;

    context.setProgram(program);

    mat4.setPosition(modelView, camera);

    program.attributes.get("position").set(buffer, 0);

    program.uniforms.get("projection").set(perspectiveMatrix);
    program.uniforms.get("modelView").set(modelView);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function renderTriangle(ms) {
    camera[0] = 0;
    camera[1] = Math.sin(ms * 0.001) * 2;

    context.setProgram(program);

    mat4.setPosition(modelView, camera);

    program.attributes.get("position").set(triangleBuffer, 0);

    program.uniforms.get("projection").set(perspectiveMatrix);
    program.uniforms.get("modelView").set(modelView);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}

(function render(ms) {

    context.clearCanvas();

    renderBox(ms);
    renderTriangle(ms);

    requestAnimationFrame(render, canvas);
}());
