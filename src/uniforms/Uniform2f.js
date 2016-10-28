var vec2 = require("@nathanfaucett/vec2"),
    Uniform = require("./Uniform");


var NativeFloat32Array = typeof(Float32Array) !== "undefined" ? Float32Array : Array;


module.exports = Uniform2f;


function Uniform2f(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? vec2.create(NaN, NaN) : new NativeFloat32Array(size * 2);
}
Uniform.extend(Uniform2f);

Uniform2f.prototype.set = function(value, force) {
    var context = this.context;

    if (this.size === 1) {
        if (force || context.__programForce || vec2.notEqual(this.value, value)) {
            context.gl.uniform2f(this.location, value[0], value[1]);
            vec2.copy(this.value, value);
        }
    } else {
        context.gl.uniform2fv(this.location, value);
    }

    return this;
};
