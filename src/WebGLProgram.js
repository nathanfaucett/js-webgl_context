var isArray = require("is_array"),
    FastHash = require("fast_hash"),

    enums = require("./enums/index"),
    uniforms = require("./uniforms/index"),
    attributes = require("./attributes/index");


var reUniformName = /[^\[]+/;


module.exports = WebGLProgram;


function WebGLProgram(context) {

    this.context = context;

    this.floatPrecision = context.__precision;
    this.intPrecision = context.__precision;

    this.uniforms = new FastHash("name");
    this.attributes = new FastHash("name");

    this.needsCompile = true;
    this.glProgram = null;
}

WebGLProgram.prototype.compile = function(vertex, fragment) {
    var context = this.context,
        floatPrecision = this.floatPrecision,
        intPrecision = this.intPrecision,
        uniforms = this.uniforms,
        attributes = this.attributes,
        gl = context.gl,
        glProgram = this.glProgram;

    if (glProgram) {
        uniforms.clear();
        attributes.clear();
        gl.deleteProgram(glProgram);
    }

    glProgram = this.glProgram = createProgram(
        gl,
        prependPrecision(floatPrecision, intPrecision, vertex),
        prependPrecision(floatPrecision, intPrecision, fragment)
    );

    parseUniforms(gl, context, glProgram, uniforms);
    parseAttributes(gl, context, glProgram, attributes);

    this.needsCompile = false;

    return this;
};

function parseUniforms(gl, context, glProgram, hash) {
    var length = gl.getProgramParameter(glProgram, gl.ACTIVE_UNIFORMS),
        glValues = enums.glValues,
        i = -1,
        il = length - 1,
        uniform, name, location;

    while (i++ < il) {
        uniform = gl.getActiveUniform(glProgram, i);
        name = reUniformName.exec(uniform.name)[0];
        location = gl.getUniformLocation(glProgram, name);
        hash.add(new uniforms[glValues[uniform.type]](context, name, location, uniform.size));
    }
}

function parseAttributes(gl, context, glProgram, hash) {
    var length = gl.getProgramParameter(glProgram, gl.ACTIVE_ATTRIBUTES),
        glValues = enums.glValues,
        i = -1,
        il = length - 1,
        attribute, name, location;

    while (i++ < il) {
        attribute = gl.getActiveAttrib(glProgram, i);
        name = attribute.name;
        location = gl.getAttribLocation(glProgram, name);
        hash.add(new attributes[glValues[attribute.type]](context, name, location));
    }
}

function prependPrecision(floatPrecision, intPrecision, shader) {
    return "precision " + floatPrecision + " float;\nprecision " + intPrecision + " int;\n" + shader;
}

function createProgram(gl, vertex, fragment) {
    var program = gl.createProgram(),
        shader, i, il, programInfoLog;

    vertex = isArray(vertex) ? vertex : [vertex];
    fragment = isArray(fragment) ? fragment : [fragment];

    i = -1;
    il = vertex.length - 1;
    while (i++ < il) {
        shader = createShader(gl, vertex[i], gl.VERTEX_SHADER);
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
    }

    i = -1;
    il = fragment.length - 1;
    while (i++ < il) {
        shader = createShader(gl, fragment[i], gl.FRAGMENT_SHADER);
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
    }

    gl.linkProgram(program);
    gl.validateProgram(program);
    gl.useProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        programInfoLog = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error("createProgram: problem compiling Program " + programInfoLog);
    }

    return program;
}

function createShader(gl, source, type) {
    var shader = gl.createShader(type),
        shaderInfoLog;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        shaderInfoLog = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("createShader: problem compiling shader " + shaderInfoLog);
    }

    return shader;
}
