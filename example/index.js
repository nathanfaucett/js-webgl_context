var WebGLContext = require("../src/index");


var canvas = document.getElementById("canvas"),
    context = new WebGLContext();


context.setCanvas(canvas);
global.context = context;


var program = context.createProgram();

program.compile(
    [
        "uniform mat4 projection;",
        "uniform mat4 modelView;",

        "attribute vec3 position;",

        "void main(void) {",
        "    gl_Position = projection * modelView * vec4(position, 1.0);",
        "}"
    ].join("\n"),
    [
        "void main(void) {",
        "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);",
        "}"
    ].join("\n")
);

console.log(program);
