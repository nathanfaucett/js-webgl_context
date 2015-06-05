var Attribute = require("./Attribute");


module.exports = Attribute4i;


function Attribute4i(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute4i);

Attribute4i.prototype.set = function(buffer, offset, force) {
    var context = this.context,
        gl = context.gl;

    context.setAttribPointer(this.location, 4, gl.FLOAT, buffer.stride, offset, context.setArrayBuffer(buffer) || force);
    return this;
};
