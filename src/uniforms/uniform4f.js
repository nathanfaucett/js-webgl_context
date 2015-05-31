var vec4 = require("vec4"),
    Uniform = require("./uniform");


var NativeFloat32Array = typeof(Float32Array) !== "undefined" ? Float32Array : Array;


module.exports = Uniform4f;


function Uniform4f(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? vec4.create(NaN, NaN, NaN, NaN) : new NativeFloat32Array(size * 4);
}
Uniform.extend(Uniform4f);

Uniform4f.prototype.set = function(value, force) {
    var context = this.context;

    if (this.size === 1) {
        if (force || context.__programForce || vec4.notEqual(this.value, value)) {
            context.gl.uniform4f(this.location, value[0], value[1], value[2], value[3]);
            vec4.copy(this.value, value);
        }
    } else {
        context.gl.uniform4fv(this.location, value);
    }

    return this;
};
