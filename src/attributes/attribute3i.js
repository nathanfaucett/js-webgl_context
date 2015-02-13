var Attribute = require("./attribute");


module.exports = Attribute3i;


function Attribute3i(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute3i);

Attribute3i.prototype.set = function(value, stride, offset) {
    var context = this.context,
        gl = context.gl,
        location = this.location;

    if (location !== -1) {
        gl.bindBuffer(gl.ARRAY_BUFFER, value);
        context.enableAttribute(location);
        gl.vertexAttribPointer(location, 3, gl.FLOAT, gl.FALSE, stride, offset);
    }

    return this;
};
