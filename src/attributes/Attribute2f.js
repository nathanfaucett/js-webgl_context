var Attribute = require("./Attribute");


module.exports = Attribute2f;


function Attribute2f(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute2f);

Attribute2f.prototype.set = function(buffer, offset, force) {
    var context = this.context,
        gl = context.gl;

    context.setAttribPointer(this.location, 2, gl.FLOAT, buffer.stride, offset, context.setArrayBuffer(buffer) || force);
    return this;
};