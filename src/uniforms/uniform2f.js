var vec2 = require("vec2"),
    Uniform = require("./uniform");


module.exports = Uniform2f;


function Uniform2f(context, name, location) {
    Uniform.call(this, context, name, location);
    this.value = vec2.create(NaN, NaN);
}
Uniform.extend(Uniform2f);

Uniform2f.prototype.set = function(value, force) {
    var context = this.context;

    if (force || context.__programForce || vec2.notEqual(this.value, value)) {
        context.gl.uniform2f(this.location, value[0], value[1]);
        vec2.copy(this.value, value);
    }

    return this;
};
