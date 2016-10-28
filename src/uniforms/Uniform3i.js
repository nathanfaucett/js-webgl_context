var vec3 = require("@nathanfaucett/vec3"),
    Uniform = require("./Uniform");


var NativeInt32Array = typeof(Int32Array) !== "undefined" ? Int32Array : Array;


module.exports = Uniform3i;


function Uniform3i(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? vec3.create(NaN, NaN, NaN) : new NativeInt32Array(size * 3);
}
Uniform.extend(Uniform3i);

Uniform3i.prototype.set = function(value, force) {
    var context = this.context;

    if (this.size === 1) {
        if (force || context.__programForce || vec3.notEqual(this.value, value)) {
            context.gl.uniform3i(this.location, value[0], value[1], value[2]);
            vec3.copy(this.value, value);
        }
    } else {
        context.gl.uniform3iv(this.location, value);
    }

    return this;
};
