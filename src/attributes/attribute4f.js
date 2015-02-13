var Attribute = require("./attribute");


module.exports = Attribute4f;


function Attribute4f(context, name, location) {
    Attribute.call(this, context, name, location);
}
Attribute.extend(Attribute4f);

Attribute4f.prototype.set = function(value, stride, offset) {
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
