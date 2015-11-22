var WebGLBufferPrototype;


module.exports = WebGLBuffer;


function WebGLBuffer(context) {

    this.context = context;

    this.stride = 0;
    this.type = null;
    this.draw = null;
    this.length = null;
    this.glBuffer = null;
    this.needsCompile = true;
}
WebGLBufferPrototype = WebGLBuffer.prototype;

WebGLBufferPrototype.destroy = function() {

    if (this.glBuffer) {
        this.context.gl.deleteBuffer(this.glBuffer);
        this.glBuffer = null;
        this.needsCompile = true;
    }

    return this;
};

WebGLBufferPrototype.compile = function(type, array, stride, draw) {
    var gl = this.context.gl,
        glBuffer = this.glBuffer || (this.glBuffer = gl.createBuffer());

    gl.bindBuffer(type, glBuffer);
    gl.bufferData(type, array, draw);

    this.type = type;
    this.stride = stride || 0;
    this.draw = draw;
    this.length = array.length;

    this.needsCompile = false;

    return this;
};
