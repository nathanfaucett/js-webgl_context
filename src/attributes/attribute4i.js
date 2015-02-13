var Attribute = require("./attribute");


module.exports = Attribute4i;


function Attribute4i(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute4i);

Attribute4i.prototype.set = function(value, stride, offset) {
    var context = this.context,
        gl = context.gl,
        location = this.location;

    if (location !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, value);
        context.enableAttribute(location);
        gl.vertexAttribPointer(location, 4, gl.FLOAT, gl.FALSE, stride, offset);
    }

    return this;
};
