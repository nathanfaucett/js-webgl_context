var isArray = require("@nathanfaucett/is_array"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined"),
    mathf = require("@nathanfaucett/mathf"),
    enums = require("./enums/index");


var WebGLTexturePrototype,
    textureType = enums.textureType,
    filterMode = enums.filterMode;


module.exports = WebGLTexture;


function WebGLTexture(context, texture) {
    var _this = this;

    this.context = context;
    this.texture = texture;

    this.isCubeMap = false;
    this.needsCompile = true;
    this.glTexture = null;

    this.__format = null;
    this.__type = null;
    this.__wrap = null;
    this.__isPOT = false;

    texture.on("update", function() {
        _this.needsCompile = true;
    });
}
WebGLTexturePrototype = WebGLTexture.prototype;

WebGLTexturePrototype.destroy = function() {

    if (this.glTexture) {
        this.context.gl.deleteTexture(this.glTexture);
        this.glTexture = null;
        this.needsCompile = true;
    }

    return this;
};

WebGLTexturePrototype.getIsPOT = function() {
    var texture;

    if (this.needsCompile) {
        texture = this.texture;
        return (this.__isPOT = mathf.isPowerOfTwo(texture.width) && mathf.isPowerOfTwo(texture.height));
    } else {
        return this.__isPOT;
    }

};

WebGLTexturePrototype.getWidth = function() {
    return this.texture.width;
};

WebGLTexturePrototype.getHeight = function() {
    return this.texture.height;
};

WebGLTexturePrototype.getFormat = function() {
    if (this.needsCompile) {
        return (this.__format = getFormat(this.context.gl, this.texture.format));
    } else {
        return this.__format;
    }
};

WebGLTexturePrototype.getType = function() {
    if (this.needsCompile) {
        return (this.__type = getType(this.context, this.texture.type));
    } else {
        return this.__type;
    }
};

WebGLTexturePrototype.getWrap = function() {
    if (this.needsCompile) {
        if (this.__isPOT) {
            return (this.__wrap = getWrap(this.context.gl, this.texture.wrap));
        } else {
            return (this.__wrap = this.context.gl.CLAMP_TO_EDGE);
        }
    } else {
        return this.__wrap;
    }
};

WebGLTexturePrototype.getGLTexture = function() {
    if (this.needsCompile === false) {
        return this.glTexture;
    } else {
        return WebGLTexture_getGLTexture(this);
    }
};

function WebGLTexture_getGLTexture(_this) {
    var texture = _this.texture,

        context = _this.context,
        gl = context.gl,

        glTexture = _this.glTexture || (_this.glTexture = gl.createTexture()),

        image = texture.data,
        notNull = !isNullOrUndefined(image),
        isCubeMap = isArray(image),

        width = texture.width,
        height = texture.height,
        isPOT = _this.getIsPOT(),

        generateMipmap = texture.generateMipmap,
        flipY = texture.flipY,
        premultiplyAlpha = texture.premultiplyAlpha,
        anisotropy = texture.anisotropy,
        filter = texture.filter,

        format = _this.getFormat(),
        wrap = _this.getWrap(),
        type = _this.getType(),

        TFA = (anisotropy > 0) && context.getExtension("EXT_texture_filter_anisotropic"),
        TEXTURE_TYPE = isCubeMap ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D,
        minFilter, magFilter, images, i, il;

    if (TFA) {
        anisotropy = mathf.clamp(anisotropy, 1, context.__maxAnisotropy);
    }

    if (notNull) {
        if (isCubeMap) {
            images = [];
            i = -1;
            il = image.length - 1;

            while (i++ < il) {
                images[i] = context.clampMaxSize(image[i], isCubeMap);
            }
        } else {
            image = context.clampMaxSize(image, false);
        }
    }

    if (filter === filterMode.NONE) {
        magFilter = gl.NEAREST;
        minFilter = isPOT && generateMipmap ? gl.LINEAR_MIPMAP_NEAREST : gl.NEAREST;
    } else { //filterMode.LINEAR
        magFilter = gl.LINEAR;
        minFilter = isPOT && generateMipmap ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR;
    }

    gl.bindTexture(TEXTURE_TYPE, glTexture);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultiplyAlpha ? 1 : 0);

    if (notNull) {
        if (isCubeMap) {
            i = images.length;
            while (i--) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, format, format, type, images[i]);
            }
        } else {
            gl.texImage2D(TEXTURE_TYPE, 0, format, format, type, image);
        }
    } else {
        if (isCubeMap) {
            i = image.length;
            while (i--) {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, format, width, height, 0, format, type, null);
            }
        } else {
            if (type === textureType.DEPTH_COMPONENT) {
                gl.texImage2D(TEXTURE_TYPE, 0, type, width, height, 0, type, gl.UNSIGNED_SHORT, null);
            } else {
                gl.texImage2D(TEXTURE_TYPE, 0, format, width, height, 0, format, type, null);
            }
        }
    }

    gl.texParameteri(TEXTURE_TYPE, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.texParameteri(TEXTURE_TYPE, gl.TEXTURE_MIN_FILTER, minFilter);

    gl.texParameteri(TEXTURE_TYPE, gl.TEXTURE_WRAP_S, wrap);
    gl.texParameteri(TEXTURE_TYPE, gl.TEXTURE_WRAP_T, wrap);

    if (TFA) {
        gl.texParameterf(TEXTURE_TYPE, TFA.TEXTURE_MAX_ANISOTROPY_EXT, anisotropy);
    }
    if (generateMipmap && isPOT) {
        gl.generateMipmap(TEXTURE_TYPE);
    }

    _this.isCubeMap = isCubeMap;
    _this.needsCompile = false;

    gl.bindTexture(TEXTURE_TYPE, null);

    return glTexture;
}

function getFormat(gl, format) {
    switch (format) {
        case gl.RGB:
            return gl.RGB;
        case gl.ALPHA:
            return gl.ALPHA;
        case gl.LUMINANCE:
            return gl.LUMINANCE;
        case gl.LUMINANCE_ALPHA:
            return gl.LUMINANCE_ALPHA;
        default:
            return gl.RGBA;
    }
}

function getType(context, type) {
    var gl = context.gl;

    if (
        (type === textureType.FLOAT && !context.getExtension("OES_texture_float")) ||
        (type === textureType.DEPTH_COMPONENT && !context.getExtension("WEBGL_depth_texture"))
    ) {
        type = textureType.UNSIGNED_BYTE;
    }

    switch (type) {
        case gl.FLOAT:
            return gl.FLOAT;
        case gl.DEPTH_COMPONENT:
            return gl.DEPTH_COMPONENT;
        case gl.UNSIGNED_SHORT:
            return gl.UNSIGNED_SHORT;
        case gl.UNSIGNED_SHORT_5_6_5:
            return gl.UNSIGNED_SHORT_5_6_5;
        case gl.UNSIGNED_SHORT_4_4_4_4:
            return gl.UNSIGNED_SHORT_4_4_4_4;
        case gl.UNSIGNED_SHORT_5_5_5_1:
            return gl.UNSIGNED_SHORT_5_5_5_1;
        default:
            return gl.UNSIGNED_BYTE;
    }
}

function getWrap(gl, wrap) {
    switch (wrap) {
        case gl.REPEAT:
            return gl.REPEAT;
        case gl.MIRRORED_REPEAT:
            return gl.MIRRORED_REPEAT;
        default:
            return gl.CLAMP_TO_EDGE;
    }
}
