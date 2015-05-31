var Uniform = require("./uniform");


var NativeInt32Array = typeof(Int32Array) !== "undefined" ? Int32Array : Array;


module.exports = Uniform1i;


function Uniform1i(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? NaN : new NativeInt32Array(size);
}
Uniform.extend(Uniform1i);

Uniform1i.prototype.set = function(value, force) {
    var context = this.context;

    if (this.size === 1) {
        if (force || context.__programForce || this.value !== value) {
            context.gl.uniform1i(this.location, value);
            this.value = value;
        }
    } else {
        context.gl.uniform1iv(this.location, value);
    }

    return this;
};
