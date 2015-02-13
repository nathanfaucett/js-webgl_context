var Attribute = require("./attribute");


module.exports = Attribute2i;


function Attribute2i(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute2i);

Attribute2i.prototype.set = function(value, stride, offset) {
    var context = this.context,
        gl = context.gl,
        location = this.location;

    if (location !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, value);
        context.enableAttribute(location);
        gl.vertexAttribPointer(location, 2, gl.FLOAT, gl.FALSE, stride, offset);
    }

    return this;
};
