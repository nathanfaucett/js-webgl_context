var vec3 = require("vec3"),
    Uniform = require("./Uniform");


var NativeFloat32Array = typeof(Float32Array) !== "undefined" ? Float32Array : Array;


module.exports = Uniform3f;


function Uniform3f(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? vec3.create(NaN, NaN, NaN) : new NativeFloat32Array(size * 3);
}
Uniform.extend(Uniform3f);

Uniform3f.prototype.set = function(value, force) {
    var context = this.context;

    if (this.size === 1) {
        if (force || context.__programForce || vec3.notEqual(this.value, value)) {
            context.gl.uniform3f(this.location, value[0], value[1], value[2]);
            vec3.copy(this.value, value);
        }
    } else {
        context.gl.uniform3fv(this.location, value);
    }

    return this;
};
