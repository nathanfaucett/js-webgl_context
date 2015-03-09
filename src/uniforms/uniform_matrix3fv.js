var mat3 = require("mat3"),
    Uniform = require("./uniform");


var NativeFloat32Array = typeof(Float32Array) !== "undefined" ? Float32Array : Array;


module.exports = UniformMatrix3fv;


function UniformMatrix3fv(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? mat3.create(
        NaN, NaN, NaN,
        NaN, NaN, NaN,
        NaN, NaN, NaN
    ) : new NativeFloat32Array(size * 9);
}
Uniform.extend(UniformMatrix3fv);

UniformMatrix3fv.prototype.set = function(value, force) {
    var context = this.context;

    if (this.size === 1) {
        if (force || context.__programForce) {
            if (mat3.notEqual(this.value, value)) {
                context.gl.uniformMatrix3fv(this.location, false, value);
                mat3.copy(this.value, value);
            }
        }
    } else {
        context.gl.uniformMatrix3fv(this.location, false, value);
    }

    return this;
};
