var mat4 = require("mat4"),
    requestAnimationFrame = require("request_animation_frame"),
    WebGLContext = require("../src/index");


var canvas = document.getElementById("canvas"),
    context = new WebGLContext(),
    gl;

function loadImage(src, callback) {
    var image = new Image(),
        texture = {
            __id: src,
            data: image,
            on: function() {}
        };

    image.onload = function() {
        texture.width = image.width;
        texture.height = image.height;
        callback();
    };

    image.src = src;

    return texture;
}

var count = 2;

function check() {
    if (--count === 0) {
        render();
    }
}
var textureA = loadImage("a.jpg", check);
var textureB = loadImage("b.jpg", check);

global.context = context;
context.setCanvas(canvas);
gl = context.gl;
context.setViewport(0, 0, canvas.width, canvas.height);

var programA = context.createProgram();
programA.compile(
    [
        "uniform mat4 projection;",
        "uniform mat4 modelView;",

        "attribute vec3 position;",
        "attribute vec2 uv;",

        "varying vec2 vUv;",

        "void main(void) {",
        "    vUv = uv;",
        "    gl_Position = projection * modelView * vec4(position, 1.0);",
        "}"
    ].join("\n"), [
        "uniform sampler2D texture;",

        "varying vec2 vUv;",

        "void main(void) {",
        "    gl_FragColor = texture2D(texture, vec2(vUv.s, vUv.t));",
        "}"
    ].join("\n")
);

var programB = context.createProgram();
programB.compile(
    [
        "uniform mat4 projection;",
        "uniform mat4 modelView;",

        "attribute vec3 position;",
        "attribute vec2 uv;",

        "varying vec2 vUv;",

        "void main(void) {",
        "    vUv = uv;",
        "    gl_Position = projection * modelView * vec4(position, 1.0);",
        "}"
    ].join("\n"), [
        "uniform sampler2D texture;",
        "uniform sampler2D texture1;",

        "varying vec2 vUv;",

        "void main(void) {",
        "    gl_FragColor = texture2D(texture, vec2(vUv.s, vUv.t)) * texture2D(texture1, vec2(vUv.s, vUv.t));",
        "}"
    ].join("\n")
);

var buffer = context.createBuffer();
buffer.compile(gl.ARRAY_BUFFER, new Float32Array([
    1, 1, 0, 0, 0, -1, 1, 0, 1, 0,
    1, -1, 0, 0, 1, -1, -1, 0, 1, 1
]), 20, gl.STATIC_DRAW);

var triangleBuffer = context.createBuffer();
triangleBuffer.compile(gl.ARRAY_BUFFER, new Float32Array([
    0, 1, 0, 0.5, 1.5, -1, -1, 0, -0.5, 0,
    1, -1, 0, 1.5, 0
]), 20, gl.STATIC_DRAW);

var perspectiveMatrix = mat4.perspective(mat4.create(), 45, canvas.width / canvas.height, 0.1, 1024),
    modelView = mat4.create(),
    camera = [0, 0, -5];

function renderBox(ms) {
    camera[0] = Math.sin(ms * 0.001) * 2;
    camera[1] = 0;

    context.setProgram(programA);

    mat4.setPosition(modelView, camera);

    programA.attributes.get("position").set(buffer, 0);
    programA.attributes.get("uv").set(buffer, 12);

    programA.uniforms.get("projection").set(perspectiveMatrix);
    programA.uniforms.get("modelView").set(modelView);
    programA.uniforms.get("texture").set(textureA);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function renderTriangle(ms) {
    camera[0] = 0;
    camera[1] = Math.sin(ms * 0.001) * 2;

    context.setProgram(programB);

    mat4.setPosition(modelView, camera);

    programB.attributes.get("position").set(triangleBuffer, 0);
    programB.attributes.get("uv").set(triangleBuffer, 12);

    programB.uniforms.get("projection").set(perspectiveMatrix);
    programB.uniforms.get("modelView").set(modelView);
    programB.uniforms.get("texture").set(textureB);
    programB.uniforms.get("texture1").set(textureA);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);
}

var color = [0, 0, 0];

function render(ms) {

    color[0] = Math.sin(ms * 0.00001);
    color[1] = Math.cos(ms * 0.0001);
    color[2] = Math.sin(ms * 0.001);

    context.setClearColor(color);
    context.clearCanvas();

    renderBox(ms);
    renderTriangle(ms);

    requestAnimationFrame(render, canvas);
}
