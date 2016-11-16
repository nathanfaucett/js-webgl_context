var mathf = require("@nathanfaucett/mathf"),

    isNull = require("@nathanfaucett/is_null"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined"),

    environment = require("@nathanfaucett/environment"),
    EventEmitter = require("@nathanfaucett/event_emitter"),
    eventListener = require("@nathanfaucett/event_listener"),
    color = require("@nathanfaucett/color"),

    enums = require("./enums"),
    WebGLBuffer = require("./WebGLBuffer"),
    WebGLTexture = require("./WebGLTexture"),
    WebGLFrameBuffer = require("./WebGLFrameBuffer"),
    WebGLProgram = require("./WebGLProgram");


var NativeUint8Array = typeof(Uint8Array) !== "undefined" ? Uint8Array : Array,
    cullFace = enums.cullFace,
    blending = enums.blending,
    depth = enums.depth,
    WebGLContextPrototype;


module.exports = WebGLContext;


WebGLContext.enums = enums;
WebGLContext.WebGLTexture = WebGLTexture;
WebGLContext.WebGLProgram = WebGLProgram;


function WebGLContext() {

    EventEmitter.call(this);

    this.gl = null;
    this.canvas = null;

    this.__attributes = {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        stencil: true
    };

    this.__textures = {};
    this.__framebuffers = {};

    this.__precision = null;
    this.__extensions = {};

    this.__maxAnisotropy = null;
    this.__maxTextures = null;
    this.__maxVertexTextures = null;
    this.__maxTextureSize = null;
    this.__maxCubeTextureSize = null;
    this.__maxRenderBufferSize = null;

    this.__maxUniforms = null;
    this.__maxVaryings = null;
    this.__maxAttributes = null;

    this.__enabledAttributes = null;

    this.__viewportX = null;
    this.__viewportY = null;
    this.__viewportWidth = null;
    this.__viewportHeight = null;

    this.__clearColor = color.create();
    this.__clearAlpha = null;

    this.__blending = null;
    this.__blendingDisabled = null;
    this.__cullFace = null;
    this.__cullFaceDisabled = null;
    this.__depthFunc = null;
    this.__depthTestDisabled = null;
    this.__depthWrite = null;
    this.__lineWidth = null;

    this.__program = null;
    this.__programForce = null;

    this.__textureIndex = null;
    this.__activeIndex = null;
    this.__activeTexture = null;

    this.__arrayBuffer = null;
    this.__elementArrayBuffer = null;

    this.__framebuffer = null;

    this.__handlerContextLost = null;
    this.__handlerContextRestored = null;
}
EventEmitter.extend(WebGLContext);
WebGLContextPrototype = WebGLContext.prototype;

WebGLContextPrototype.setAttributes = function(attributes) {

    getAttributes(this.__attributes, attributes);

    if (this.gl) {
        WebGLContext_getGLContext(this);
    }

    return this;
};

WebGLContextPrototype.setCanvas = function(canvas, attributes) {
    var _this = this,
        thisCanvas = this.canvas;

    if (thisCanvas) {
        if (thisCanvas !== canvas) {
            eventListener.off(thisCanvas, "webglcontextlost", this.__handlerContextLost);
            eventListener.off(thisCanvas, "webglcontextrestored", this.__handlerContextRestored);
        } else {
            return this;
        }
    }

    getAttributes(this.__attributes, attributes);
    this.canvas = canvas;

    this.__handlerContextLost = this.__handlerContextLost || function handlerContextLost(e) {
        handleWebGLContextContextLost(_this, e);
    };
    this.__handlerContextRestored = this.__handlerContextRestored || function handlerContextRestored(e) {
        handleWebGLContextContextRestored(_this, e);
    };

    eventListener.on(canvas, "webglcontextlost", this.__handlerContextLost);
    eventListener.on(canvas, "webglcontextrestored", this.__handlerContextRestored);

    WebGLContext_getGLContext(this);

    return this;
};

WebGLContextPrototype.clearGL = function() {

    this.gl = null;

    this.__textures = {};

    this.__precision = null;
    this.__extensions = {};

    this.__maxAnisotropy = null;
    this.__maxTextures = null;
    this.__maxVertexTextures = null;
    this.__maxTextureSize = null;
    this.__maxCubeTextureSize = null;
    this.__maxRenderBufferSize = null;

    this.__maxUniforms = null;
    this.__maxVaryings = null;
    this.__maxAttributes = null;

    this.__enabledAttributes = null;

    this.__viewportX = null;
    this.__viewportY = null;
    this.__viewportWidth = null;
    this.__viewportHeight = null;

    color.set(this.__clearColor, 0, 0, 0);
    this.__clearAlpha = null;

    this.__blending = null;
    this.__blendingDisabled = true;
    this.__cullFace = null;
    this.__cullFaceDisabled = true;
    this.__depthFunc = null;
    this.__depthTestDisabled = true;
    this.__depthWrite = null;
    this.__lineWidth = null;

    this.__program = null;
    this.__programForce = null;

    this.__textureIndex = null;
    this.__activeIndex = null;
    this.__activeTexture = null;

    this.__arrayBuffer = null;
    this.__elementArrayBuffer = null;

    this.__framebuffer = null;

    return this;
};

WebGLContextPrototype.resetGL = function() {

    this.__textures = {};

    this.__viewportX = null;
    this.__viewportY = null;
    this.__viewportWidth = null;
    this.__viewportHeight = null;

    this.__clearAlpha = null;

    this.__blending = null;
    this.__blendingDisabled = true;
    this.__cullFace = null;
    this.__cullFaceDisabled = true;
    this.__depthFunc = null;
    this.__depthTestDisabled = true;
    this.__depthWrite = null;
    this.__lineWidth = null;

    this.__program = null;
    this.__programForce = null;

    this.__textureIndex = null;
    this.__activeIndex = null;
    this.__activeTexture = null;

    this.__arrayBuffer = null;
    this.__elementArrayBuffer = null;

    this.__framebuffer = null;

    this.disableAttributes();
    this.setViewport(0, 0, 1, 1);
    this.setDepthWrite(true);
    this.setLineWidth(1);
    this.setDepthFunc(depth.LESS);
    this.setCullFace(cullFace.BACK);
    this.setBlending(blending.DEFAULT);
    this.setClearColor(color.set(this.__clearColor, 0, 0, 0), 1);
    this.setProgram(null);
    this.clearCanvas();

    return this;
};

WebGLContextPrototype.clampMaxSize = function(image, isCubeMap) {
    var maxSize = isCubeMap ? this.__maxCubeTextureSize : this.__maxTextureSize,
        maxDim, newWidth, newHeight, canvas, ctx;

    if (!image || (image.height <= maxSize && image.width <= maxSize)) {
        return image;
    } else {
        maxDim = 1 / mathf.max(image.width, image.height);
        newWidth = (image.width * maxSize * maxDim) | 0;
        newHeight = (image.height * maxSize * maxDim) | 0;
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, newWidth, newHeight);

        return canvas;
    }
};

WebGLContextPrototype.setProgram = function(program, force) {
    if (this.__program !== program || force) {
        this.__program = program;
        this.__programForce = true;

        if (program) {
            this.gl.useProgram(program.glProgram);
        } else {
            this.gl.useProgram(null);
        }
    } else {
        if (this.__textureIndex !== 0 || this.__activeIndex !== -1) {
            this.__programForce = true;
        } else {
            this.__programForce = false;
        }
    }

    this.__textureIndex = 0;
    this.__activeIndex = -1;

    return this;
};

WebGLContextPrototype.setTexture = function(location, texture, force) {
    var gl = this.gl,
        webglTexture = this.createTexture(texture),
        index = this.__textureIndex++,
        needsUpdate = this.__activeIndex !== index;

    this.__activeIndex = index;

    if (this.__activeTexture !== webglTexture || force) {
        this.__activeTexture = webglTexture;

        if (needsUpdate || this.__programForce || force) {
            gl.activeTexture(gl.TEXTURE0 + index);
            gl.uniform1i(location, index);
        }

        if (webglTexture.isCubeMap) {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, webglTexture.getGLTexture());
        } else {
            gl.bindTexture(gl.TEXTURE_2D, webglTexture.getGLTexture());
        }

        return true;
    } else {
        return false;
    }
};

WebGLContextPrototype.setFrameBuffer = function(framebuffer, force) {
    var gl = this.gl,
        webglFrameBuffer = this.createFrameBuffer(framebuffer),
        glFrameBuffer, webglTexture;

    if (this.__framebuffer !== webglFrameBuffer || force) {
        this.__framebuffer = webglFrameBuffer;

        webglTexture = this.createTexture(framebuffer.texture);
        glFrameBuffer = webglFrameBuffer.getGLFrameBuffer();

        gl.bindFramebuffer(gl.FRAMEBUFFER, glFrameBuffer);
        gl.viewport(0, 0, webglTexture.getWidth(), webglTexture.getHeight());

        if (webglFrameBuffer.isCubeMap) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X + framebuffer.activeCubeFace, webglTexture.getGLTexture(), 0);
        }

        return true;
    } else {
        return false;
    }
};

WebGLContextPrototype.clearFrameBuffer = function() {
    var gl = this.gl,
        webglFrameBuffer = this.__framebuffer;

    if (!isNull(webglFrameBuffer)) {
        this.__framebuffer = null;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(this.__viewportX, this.__viewportY, this.__viewportWidth, this.__viewportHeight);

        return true;
    } else {
        return false;
    }
};

WebGLContextPrototype.setArrayBuffer = function(buffer, force) {
    var gl = this.gl;

    if (this.__arrayBuffer !== buffer || force) {
        this.disableAttributes();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.glBuffer);
        this.__arrayBuffer = buffer;
        return true;
    } else {
        return false;
    }
};

WebGLContextPrototype.setElementArrayBuffer = function(buffer, force) {
    var gl = this.gl;

    if (this.__elementArrayBuffer !== buffer || force) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.glBuffer);
        this.__elementArrayBuffer = buffer;
        return true;
    } else {
        return false;
    }
};

WebGLContextPrototype.setAttribPointer = function(location, itemSize, type, stride, offset, force) {
    var gl = this.gl;

    if (this.enableAttribute(location) || force) {
        gl.vertexAttribPointer(location, itemSize, type, gl.FALSE, stride, offset);
        return true;
    } else {
        return false;
    }
};

WebGLContextPrototype.createProgram = function() {
    return new WebGLProgram(this);
};

WebGLContextPrototype.createTexture = function(texture) {
    var textures = this.__textures;
    return textures[texture.__id] || (textures[texture.__id] = new WebGLTexture(this, texture));
};

WebGLContextPrototype.getTexture = function(texture) {
    return this.__textures[texture.__id];
};

WebGLContextPrototype.createFrameBuffer = function(framebuffer) {
    var framebuffers = this.__framebuffers;
    return framebuffers[framebuffer.__id] || (framebuffers[framebuffer.__id] = new WebGLFrameBuffer(this, framebuffer));
};

WebGLContextPrototype.getFrameBuffer = function(framebuffer) {
    return this.__framebuffers[framebuffer.__id];
};

WebGLContextPrototype.createBuffer = function() {
    return new WebGLBuffer(this);
};

WebGLContextPrototype.deleteProgram = function(program) {
    if (program) {
        program.destroy();
    }
    return this;
};

WebGLContextPrototype.deleteTexture = function(texture) {
    var webglTexture = this.getTexture(texture);

    if (webglTexture) {
        webglTexture.destroy();
    }

    return this;
};

WebGLContextPrototype.deleteBuffer = function(buffer) {
    if (buffer) {
        buffer.destroy();
    }
    return this;
};

WebGLContextPrototype.deleteFrameBuffer = function(frameBuffer) {
    var webglFrameBuffer = this.getFrameBuffer(frameBuffer);

    if (webglFrameBuffer) {
        webglFrameBuffer.destroy();
    }

    return this;
};

WebGLContextPrototype.setViewport = function(x, y, width, height) {
    x = x || 0;
    y = y || 0;
    width = width || 1;
    height = height || 1;

    if (
        this.__viewportX !== x ||
        this.__viewportY !== y ||
        this.__viewportWidth !== width ||
        this.__viewportHeight !== height
    ) {
        this.__viewportX = x;
        this.__viewportY = y;
        this.__viewportWidth = width;
        this.__viewportHeight = height;

        this.gl.viewport(x, y, width, height);
    }

    return this;
};

WebGLContextPrototype.setDepthWrite = function(depthWrite) {

    if (this.__depthWrite !== depthWrite) {
        this.__depthWrite = depthWrite;
        this.gl.depthMask(depthWrite);
    }

    return this;
};

WebGLContextPrototype.setLineWidth = function(width) {

    if (this.__lineWidth !== width) {
        this.__lineWidth = width;
        this.gl.lineWidth(width);
    }

    return this;
};

WebGLContextPrototype.setDepthFunc = function(depthFunc) {
    var gl = this.gl;

    if (this.__depthFunc !== depthFunc) {
        switch (depthFunc) {
            case depth.NEVER:
                if (this.__depthTestDisabled) {
                    gl.enable(gl.DEPTH_TEST);
                }
                gl.depthFunc(gl.NEVER);
                break;
            case depth.LESS:
                if (this.__depthTestDisabled) {
                    gl.enable(gl.DEPTH_TEST);
                }
                gl.depthFunc(gl.LESS);
                break;
            case depth.EQUAL:
                if (this.__depthTestDisabled) {
                    gl.enable(gl.DEPTH_TEST);
                }
                gl.depthFunc(gl.EQUAL);
                break;
            case depth.LEQUAL:
                if (this.__depthTestDisabled) {
                    gl.enable(gl.DEPTH_TEST);
                }
                gl.depthFunc(gl.LEQUAL);
                break;
            case depth.GREATER:
                if (this.__depthTestDisabled) {
                    gl.enable(gl.DEPTH_TEST);
                }
                gl.depthFunc(gl.GREATER);
                break;
            case depth.NOTEQUAL:
                if (this.__depthTestDisabled) {
                    gl.enable(gl.DEPTH_TEST);
                }
                gl.depthFunc(gl.NOTEQUAL);
                break;
            case depth.GEQUAL:
                if (this.__depthTestDisabled) {
                    gl.enable(gl.DEPTH_TEST);
                }
                gl.depthFunc(gl.GEQUAL);
                break;
            case depth.ALWAYS:
                if (this.__depthTestDisabled) {
                    gl.enable(gl.DEPTH_TEST);
                }
                gl.depthFunc(gl.ALWAYS);
                break;
            default:
                this.__depthTestDisabled = true;
                this.__depthFunc = depth.NONE;
                gl.disable(gl.DEPTH_TEST);
                return this;
        }

        this.__depthTestDisabled = false;
        this.__depthFunc = depthFunc;
    }

    return this;
};

WebGLContextPrototype.setCullFace = function(value) {
    var gl = this.gl;

    if (this.__cullFace !== value) {
        switch (value) {
            case cullFace.BACK:
                if (this.__cullFaceDisabled) {
                    gl.enable(gl.CULL_FACE);
                }
                gl.cullFace(gl.BACK);
                break;
            case cullFace.FRONT:
                if (this.__cullFaceDisabled) {
                    gl.enable(gl.CULL_FACE);
                }
                gl.cullFace(gl.FRONT);
                break;
            case cullFace.FRONT_AND_BACK:
                if (this.__cullFaceDisabled) {
                    gl.enable(gl.CULL_FACE);
                }
                gl.cullFace(gl.FRONT_AND_BACK);
                break;
            default:
                this.__cullFaceDisabled = true;
                this.__cullFace = cullFace.NONE;
                gl.disable(gl.CULL_FACE);
                return this;
        }

        this.__cullFaceDisabled = false;
        this.__cullFace = value;
    }

    return this;
};

WebGLContextPrototype.setBlending = function(value) {
    var gl = this.gl;

    if (this.__blending !== value) {
        switch (value) {
            case blending.ADDITIVE:
                if (this.__blendingDisabled) {
                    gl.enable(gl.BLEND);
                }
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                break;
            case blending.SUBTRACTIVE:
                if (this.__blendingDisabled) {
                    gl.enable(gl.BLEND);
                }
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
                break;
            case blending.MULTIPLY:
                if (this.__blendingDisabled) {
                    gl.enable(gl.BLEND);
                }
                gl.blendEquation(gl.FUNC_ADD);
                gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
                break;
            case blending.DEFAULT:
                if (this.__blendingDisabled) {
                    gl.enable(gl.BLEND);
                }
                gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                break;
            default:
                gl.disable(gl.BLEND);
                this.__blendingDisabled = true;
                this.__blending = blending.NONE;
                return this;
        }

        this.__blendingDisabled = false;
        this.__blending = value;
    }

    return this;
};

WebGLContextPrototype.setClearColor = function(clearColor, alpha) {
    alpha = alpha || 1;

    if (color.notEquals(this.__clearColor, clearColor) || alpha !== this.__clearAlpha) {

        color.copy(this.__clearColor, clearColor);
        this.__clearAlpha = alpha;

        this.gl.clearColor(clearColor[0], clearColor[1], clearColor[2], alpha);
    }

    return this;
};

WebGLContextPrototype.scissor = function(x, y, width, height) {
    this.gl.scissor(x, y, width, height);
    return this;
};

WebGLContextPrototype.clearCanvas = function(color, depth, stencil) {
    var gl = this.gl,
        bits = 0;

    if (color !== false) {
        bits |= gl.COLOR_BUFFER_BIT;
    }
    if (depth !== false) {
        bits |= gl.DEPTH_BUFFER_BIT;
    }
    if (stencil !== false) {
        bits |= gl.STENCIL_BUFFER_BIT;
    }

    gl.clear(bits);

    return this;
};

WebGLContextPrototype.clearColor = function() {
    var gl = this.gl;

    gl.clear(gl.COLOR_BUFFER_BIT);
    return this;
};

WebGLContextPrototype.clearDepth = function() {
    var gl = this.gl;

    gl.clear(gl.DEPTH_BUFFER_BIT);
    return this;
};

WebGLContextPrototype.clearStencil = function() {
    var gl = this.gl;

    gl.clear(gl.STENCIL_BUFFER_BIT);
    return this;
};

WebGLContextPrototype.enableAttribute = function(attribute) {
    var enabledAttributes = this.__enabledAttributes;

    if (enabledAttributes[attribute] === 0) {
        this.gl.enableVertexAttribArray(attribute);
        enabledAttributes[attribute] = 1;
        return true;
    } else {
        return false;
    }
};

WebGLContextPrototype.disableAttribute = function(attribute) {
    var enabledAttributes = this.__enabledAttributes;

    if (enabledAttributes[attribute] === 1) {
        this.gl.disableVertexAttribArray(attribute);
        enabledAttributes[attribute] = 0;
        return true;
    } else {
        return false;
    }
};

WebGLContextPrototype.disableAttributes = function() {
    var gl = this.gl,
        i = this.__maxAttributes,
        enabledAttributes = this.__enabledAttributes;

    while (i--) {
        if (enabledAttributes[i] === 1) {
            gl.disableVertexAttribArray(i);
            enabledAttributes[i] = 0;
        }
    }

    return this;
};

var getExtension_lowerPrefixes = ["webkit", "moz", "o", "ms"],
    getExtension_upperPrefixes = ["WEBKIT", "MOZ", "O", "MS"];

WebGLContextPrototype.getExtension = function(name, throwError) {
    var gl = this.gl,
        extensions = this.__extensions || (this.__extensions = {}),
        extension = extensions[name] || (extensions[name] = gl.getExtension(name)),
        i;

    if (isNullOrUndefined(extension)) {
        i = getExtension_upperPrefixes.length;

        while (i--) {
            if (!isNullOrUndefined(extension = gl.getExtension(getExtension_upperPrefixes[i] + "_" + name))) {
                extensions[name] = extension;
                break;
            }
        }
    }
    if (isNullOrUndefined(extension)) {
        i = getExtension_lowerPrefixes.length;

        while (i--) {
            if (!isNullOrUndefined(extension = gl.getExtension(getExtension_lowerPrefixes[i] + name))) {
                extensions[name] = extension;
                break;
            }
        }
    }

    if (isNullOrUndefined(extension)) {
        if (throwError) {
            throw new Error("WebGLContext.getExtension: could not get Extension " + name);
        } else {
            return null;
        }
    } else {
        return extension;
    }
};


function getAttributes(attributes, options) {
    options = options || {};

    attributes.alpha = !isNullOrUndefined(options.alpha) ? !!options.alpha : attributes.alpha;
    attributes.antialias = !isNullOrUndefined(options.antialias) ? !!options.antialias : attributes.antialias;
    attributes.depth = !isNullOrUndefined(options.depth) ? !!options.depth : attributes.depth;
    attributes.premultipliedAlpha = !isNullOrUndefined(options.premultipliedAlpha) ? !!options.premultipliedAlpha : attributes.premultipliedAlpha;
    attributes.preserveDrawingBuffer = !isNullOrUndefined(options.preserveDrawingBuffer) ? !!options.preserveDrawingBuffer : attributes.preserveDrawingBuffer;
    attributes.stencil = !isNullOrUndefined(options.stencil) ? !!options.stencil : attributes.stencil;

    return attributes;
}

function handleWebGLContextContextLost(_this, e) {
    e.preventDefault();
    _this.clearGL();
    _this.emit("webglcontextlost", e);
}

function handleWebGLContextContextRestored(_this, e) {
    e.preventDefault();
    WebGLContext_getGLContext(_this);
    _this.emit("webglcontextrestored", e);
}

function WebGLContext_getGLContext(_this) {
    var gl;

    if (!isNullOrUndefined(_this.gl)) {
        _this.clearGL();
    }

    gl = getWebGLContext(_this.canvas, _this.__attributes);

    if (isNullOrUndefined(gl)) {
        _this.emit("webglcontextcreationfailed");
    } else {
        _this.emit("webglcontextcreation");

        if (!gl.getShaderPrecisionFormat) {
            gl.getShaderPrecisionFormat = getShaderPrecisionFormat;
        }

        _this.gl = gl;
        getGPUInfo(_this);
        _this.resetGL();
    }
}

function getShaderPrecisionFormat() {
    return {
        rangeMin: 1,
        rangeMax: 1,
        precision: 1
    };
}

function getGPUInfo(_this) {
    var gl = _this.gl,

        VERTEX_SHADER = gl.VERTEX_SHADER,
        FRAGMENT_SHADER = gl.FRAGMENT_SHADER,
        HIGH_FLOAT = gl.HIGH_FLOAT,
        MEDIUM_FLOAT = gl.MEDIUM_FLOAT,

        EXT_tfa = _this.getExtension("EXT_texture_filter_anisotropic"),

        vsHighpFloat = gl.getShaderPrecisionFormat(VERTEX_SHADER, HIGH_FLOAT),
        vsMediumpFloat = gl.getShaderPrecisionFormat(VERTEX_SHADER, MEDIUM_FLOAT),

        fsHighpFloat = gl.getShaderPrecisionFormat(FRAGMENT_SHADER, HIGH_FLOAT),
        fsMediumpFloat = gl.getShaderPrecisionFormat(FRAGMENT_SHADER, MEDIUM_FLOAT),

        highpAvailable = vsHighpFloat.precision > 0 && fsHighpFloat.precision > 0,
        mediumpAvailable = vsMediumpFloat.precision > 0 && fsMediumpFloat.precision > 0,

        precision = "highp";

    if (!highpAvailable || environment.mobile) {
        if (mediumpAvailable) {
            precision = "mediump";
        } else {
            precision = "lowp";
        }
    }

    _this.__precision = precision;
    _this.__maxAnisotropy = EXT_tfa ? gl.getParameter(EXT_tfa.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;
    _this.__maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    _this.__maxVertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    _this.__maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    _this.__maxCubeTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
    _this.__maxRenderBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);

    _this.__maxUniforms = mathf.max(
        gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS), gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)
    ) * 4;
    _this.__maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS) * 4;
    _this.__maxAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

    _this.__enabledAttributes = new NativeUint8Array(_this.__maxAttributes);
}

var getWebGLContext_webglNames = ["3d", "moz-webgl", "experimental-webgl", "webkit-3d", "webgl"],
    getWebGLContext_webglAttributes = {
        alpha: true,
        antialias: true,
        depth: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        stencil: true
    };

function getWebGLContext(canvas, attributes) {
    var webglNames = getWebGLContext_webglNames,
        webglAttributes = getWebGLContext_webglAttributes,
        i = webglNames.length,
        gl, key;

    attributes = attributes || {};

    for (key in webglAttributes) {
        if (isNullOrUndefined(attributes[key])) {
            attributes[key] = webglAttributes[key];
        }
    }

    while (i--) {
        try {
            gl = canvas.getContext(webglNames[i], attributes);
            if (gl) {
                return gl;
            }
        } catch (e) {}
    }

    if (!gl) {
        throw new Error("WebGLContext: could not get a WebGL Context");
    }

    return gl;
}