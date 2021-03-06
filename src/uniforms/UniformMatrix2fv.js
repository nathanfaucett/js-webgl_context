var mat2 = require("@nathanfaucett/mat2"),
    Uniform = require("./Uniform");


var NativeFloat32Array = typeof(Float32Array) !== "undefined" ? Float32Array : Array;


module.exports = UniformMatrix2fv;


function UniformMatrix2fv(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? mat2.create(NaN, NaN, NaN, NaN) : new NativeFloat32Array(size * 4);
}
Uniform.extend(UniformMatrix2fv);

UniformMatrix2fv.prototype.set = function(value, force) {
    var context = this.context;

    if (this.size === 1) {
        if (force || context.__programForce || mat2.notEquals(this.value, value)) {
            context.gl.uniformMatrix2fv(this.location, false, value);
            mat2.copy(this.value, value);
        }
    } else {
        context.gl.uniformMatrix2fv(this.location, false, value);
    }

    return this;
};