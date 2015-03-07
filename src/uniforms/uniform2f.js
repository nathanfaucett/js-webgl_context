var vec2 = require("vec2"),
    Uniform = require("./uniform");


module.exports = Uniform2f;


function Uniform2f(context, name, location, size) {
    Uniform.call(this, context, name, location, size);
    this.value = size === 1 ? vec2.create(NaN, NaN) : null;
}
Uniform.extend(Uniform2f);

Uniform2f.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce) {
        if (this.size === 1) {
            if (vec2.notEqual(this.value, value)) {
                context.gl.uniform2f(this.location, value[0], value[1]);
                vec2.copy(this.value, value);
            }
        } else {
            context.gl.uniform2fv(this.location, value);
        }
    }

    return this;
};
