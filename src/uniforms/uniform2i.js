var vec2 = require("vec2"),
    Uniform = require("./uniform");


var NativeInt32Array = typeof(Int32Array) !== "undefined" ? Int32Array : Array;


module.exports = Uniform2i;


function Uniform2i(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? vec2.create(NaN, NaN) : new NativeInt32Array(size * 2);
}
Uniform.extend(Uniform2i);

Uniform2i.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce) {
        if (this.size === 1) {
            if (vec2.notEqual(this.value, value)) {
                context.gl.uniform2i(this.location, value[0], value[1]);
                vec2.copy(this.value, value);
            }
        } else {
            context.gl.uniform2iv(this.location, value);
        }
    }

    return this;
};
