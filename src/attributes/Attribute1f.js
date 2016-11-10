var Attribute = require("./Attribute");


module.exports = Attribute1f;


function Attribute1f(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute1f);

Attribute1f.prototype.set = function(buffer, offset, force) {
    var context = this.context,
        gl = context.gl;

    context.setAttribPointer(this.location, 1, gl.FLOAT, buffer.stride, offset, context.setArrayBuffer(buffer) || force);
    return this;
};