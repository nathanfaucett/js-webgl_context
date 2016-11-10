module.exports = {
    BOOL: require("./Uniform1b"),
    INT: require("./Uniform1i"),
    FLOAT: require("./Uniform1f"),

    BOOL_VEC2: require("./Uniform2i"),
    BOOL_VEC3: require("./Uniform3i"),
    BOOL_VEC4: require("./Uniform4i"),

    INT_VEC2: require("./Uniform2i"),
    INT_VEC3: require("./Uniform3i"),
    INT_VEC4: require("./Uniform4i"),

    FLOAT_VEC2: require("./Uniform2f"),
    FLOAT_VEC3: require("./Uniform3f"),
    FLOAT_VEC4: require("./Uniform4f"),

    FLOAT_MAT2: require("./UniformMatrix2fv"),
    FLOAT_MAT3: require("./UniformMatrix3fv"),
    FLOAT_MAT4: require("./UniformMatrix4fv"),

    SAMPLER_2D: require("./UniformTexture"),
    SAMPLER_CUBE: require("./UniformTextureCube")
};