var inherits = require("inherits");


module.exports = Attribute;


function Attribute(context, name, location) {
    this.name = name;
    this.location = location;
    this.context = context;
}

Attribute.extend = function(child) {
    return inherits(child, this);
};

Attribute.prototype.set = function( /* value, force */ ) {
    return this;
};
