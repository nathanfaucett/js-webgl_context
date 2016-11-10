var Uniform = require("./Uniform");


var NativeFloat32Array = typeof(Float32Array) !== "undefined" ? Float32Array : Array;


module.exports = Uniform1f;


function Uniform1f(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? NaN : new NativeFloat32Array(size);
}
Uniform.extend(Uniform1f);

Uniform1f.prototype.set = function(value, force) {
    var context = this.context;

    if (this.size === 1) {
        if (force || context.__programForce || this.value !== value) {
            context.gl.uniform1f(this.location, value);
            this.value = value;
        }
    } else {
        context.gl.uniform1fv(this.location, value);
    }

    return this;
};