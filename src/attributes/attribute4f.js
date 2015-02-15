var Attribute = require("./attribute");


module.exports = Attribute4f;


function Attribute4f(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute4f);

Attribute4f.prototype.set = function(buffer, offset) {
    var context = this.context,
        gl = context.gl;

    context.setAttribPointer(this.location, 4, gl.FLOAT, buffer.stride, offset, context.setArrayBuffer(buffer));
    return this;
};
