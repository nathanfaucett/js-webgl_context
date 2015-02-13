var inherits = require("inherits");


module.exports = Uniform;


function Uniform(context, name, location) {
    this.name = name;
    this.location = location;
    this.context = context;
    this.value = null;
}

Uniform.extend = function(child) {
    return inherits(child, this);
};

Uniform.prototype.set = function( /* value, force */ ) {
    return this;
};
