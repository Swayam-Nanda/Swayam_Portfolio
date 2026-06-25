class DataTexture extends Texture {
  constructor(data, width, height, format, type, filter = null) {
    (super(),
      format && (this.format = format),
      (this.width = width),
      (this.height = height),
      (this.data = data),
      (this.minFilter = this.magFilter = filter || Texture.NEAREST),
      (this.generateMipmaps = !1),
      (this.type = type || Texture.FLOAT),
      (this.isDataTexture = !0),
      (this.destroyDataAfterUpload = !1));
  }
  uploadAsync() {
    return Texture.renderer.uploadAsync(this);
  }
}
class Texture3D extends Texture {
  constructor(image, width, height, depth, format, type, filter = null) {
    (super(),
      (this.format = format || Texture.RGBAFormat),
      (this.width = width),
      (this.height = height),
      (this.depth = depth),
      (this.image = image),
      (this.minFilter = this.magFilter = filter || Texture.LINEAR),
      (this.wrapS = this.wrapT = this.wrapR = Texture.CLAMP_TO_EDGE),
      (this.generateMipmaps = !1),
      (this.type = type || Texture.FLOAT),
      (this.isTexture3D = !0));
  }
}
((Texture.NEAREST = "texture_nearest"),
  (Texture.CLAMP_TO_EDGE = "texture_clamp"),
  (Texture.REPEAT = "texture_repeat"),
  (Texture.MIRROR_REPEAT = "texture_mirror_repeat"),
  (Texture.LINEAR = "texture_linear"),
  (Texture.LINEAR_MIPMAP = "texture_linear_mip"),
  (Texture.LINEAR_MIPMAP_NEAREST = "texture_linear_mip_nearest"),
  (Texture.NEAREST_MIPMAP = "texture_nearest_mip"),
  (Texture.RFormat = "texture_rFormat"),
  (Texture.RGFormat = "texture_rgFormat"),
  (Texture.RGBFormat = "texture_rgbFormat"),
  (Texture.RGBAFormat = "texture_rgbaFormat"),
  (Texture.UNSIGNED_BYTE = "texture_unsigned_byte"),
  (Texture.DEPTH = "texture_depth"),
  (Texture.FLOAT = "texture_float"),
  (Texture.HALF_FLOAT = "texture_half_float"),
  (Texture.UNSIGNED_INTEGER = "texture_unsigned_integer"),
  (Texture.INTEGER = "texture_integer"),
  Module(function GLSLOptimizer() {
    this.exports = function (code) {
      return (function unrollLoops(string) {
        return string.replace(
          /#pragma unroll_loop[\s]+?for \(int i \= (\d+)\; i < (\d+)\; i\+\+\) \{([\s\S]+?)(?=\})\}/g,
          function replace(match, start, end, snippet) {
            let unroll = "";
            for (let i = parseInt(start); i < parseInt(end); i++)
              unroll += snippet.replace(/\[i\]/g, "[" + i + "]");
            return unroll;
          },
        );
      })(code);
    };
  }),
  Module(function GLTypes() {
    function getFormat(texture) {
      let _gl = Renderer.context,
        integer =
          texture.type === Texture.UNSIGNED_INTEGER ||
          texture.type === Texture.INTEGER;
      switch (texture.format) {
        case Texture.RGBAFormat:
          return integer ? _gl.RGBA_INTEGER : _gl.RGBA;
        case Texture.RGBFormat:
          return integer ? _gl.RGB_INTEGER : _gl.RGB;
        case Texture.RGFormat:
          return integer ? _gl.RG_INTEGER : _gl.RG;
        case Texture.RFormat:
          return integer ? _gl.RED_INTEGER : _gl.RED;
      }
    }
    function getInternalFormat(texture) {
      let _gl = Renderer.context;
      if (Renderer.type !== Renderer.WEBGL2)
        return texture.format === Texture.RGBAFormat ? _gl.RGBA : _gl.RGB;
      switch (texture.format) {
        case Texture.RGBAFormat:
          switch (texture.type) {
            case Texture.FLOAT:
              return _gl.RGBA32F;
            case Texture.HALF_FLOAT:
              return _gl.RGBA16F;
            case Texture.UNSIGNED_INTEGER:
              return _gl.RGBA32UI;
            case Texture.INTEGER:
              return _gl.RGBA32I;
            case Texture.UNSIGNED_BYTE:
              return _gl.RGBA8;
          }
          break;
        case Texture.RGBFormat:
          switch (texture.type) {
            case Texture.FLOAT:
              return _gl.RGB32F;
            case Texture.HALF_FLOAT:
              return _gl.RGB16F;
            case Texture.UNSIGNED_INTEGER:
              return _gl.RGB32UI;
            case Texture.INTEGER:
              return _gl.RGB32I;
            case Texture.UNSIGNED_BYTE:
              return _gl.RGB8;
          }
          break;
        case Texture.RGFormat:
          switch (texture.type) {
            case Texture.FLOAT:
              return _gl.RG32F;
            case Texture.HALF_FLOAT:
              return _gl.RG16F;
            case Texture.UNSIGNED_INTEGER:
              return _gl.RG32UI;
            case Texture.INTEGER:
              return _gl.RG32I;
            case Texture.UNSIGNED_BYTE:
              return _gl.RG8;
          }
          break;
        case Texture.RFormat:
          switch (texture.type) {
            case Texture.FLOAT:
              return _gl.R32F;
            case Texture.HALF_FLOAT:
              return _gl.R16F;
            case Texture.UNSIGNED_INTEGER:
              return _gl.R32UI;
            case Texture.INTEGER:
              return _gl.R32I;
            case Texture.UNSIGNED_BYTE:
              return _gl.R8;
          }
      }
    }
    function getType(texture) {
      let _gl = Renderer.context;
      switch (texture.type) {
        case Texture.FLOAT:
          return _gl.FLOAT;
        case Texture.HALF_FLOAT:
          return Renderer.type == Renderer.WEBGL2
            ? _gl.HALF_FLOAT
            : Renderer.extensions.halfFloat.HALF_FLOAT_OES;
        case Texture.UNSIGNED_INTEGER:
          return _gl.UNSIGNED_INT;
        case Texture.INTEGER:
          return _gl.INT;
        default:
          return _gl.UNSIGNED_BYTE;
      }
    }
    this.exports = {
      getFormat: getFormat,
      getInternalFormat: getInternalFormat,
      getProperty: function getProperty(property) {
        let _gl = Renderer.context;
        switch (property) {
          case Texture.NEAREST:
            return _gl.NEAREST;
          case Texture.LINEAR:
            return _gl.LINEAR;
          case Texture.LINEAR_MIPMAP:
            return _gl.LINEAR_MIPMAP_LINEAR;
          case Texture.NEAREST_MIPMAP:
            return _gl.NEAREST_MIPMAP_LINEAR;
          case Texture.LINEAR_MIPMAP_NEAREST:
            return _gl.LINEAR_MIPMAP_NEAREST;
          case Texture.CLAMP_TO_EDGE:
            return _gl.CLAMP_TO_EDGE;
          case Texture.REPEAT:
            return _gl.REPEAT;
          case Texture.MIRROR_REPEAT:
            return _gl.MIRRORED_REPEAT;
        }
      },
      getType: getType,
      getFloatParams: function getFloatParams(texture) {
        return {
          internalformat: getInternalFormat(texture),
          format: getFormat(texture),
          type: getType(texture),
        };
      },
      getGLTypeForTypedArray: function getGLTypeForTypedArray(typedArray) {
        let _gl = Renderer.context;
        return typedArray instanceof Float32Array
          ? _gl.FLOAT
          : typedArray instanceof Int32Array
            ? _gl.INT
            : typedArray instanceof Uint32Array
              ? _gl.UNSIGNED_INT
              : typedArray instanceof Int16Array
                ? _gl.SHORT
                : typedArray instanceof Uint16Array
                  ? _gl.UNSIGNED_SHORT
                  : typedArray instanceof Int8Array
                    ? _gl.BYTE
                    : typedArray instanceof Uint8Array ||
                        typedArray instanceof Uint8ClampedArray
                      ? _gl.UNSIGNED_BYTE
                      : _gl.FLOAT;
      },
    };
  }),
  Class(function MatrixWasm() {
    const _this = this;
    let registry, wasmExports;
    window.FinalizationRegistry &&
      (registry = new FinalizationRegistry((heldValue) => {
        wasmExports.free_matrix(heldValue.ptr);
      }));
    let promise = Promise.create();
    (async function loadWasm() {
      try {
        const bytes = Uint8Array.from(
            atob(
              "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",
            ),
            (c) => c.charCodeAt(0),
          ),
          module = await WebAssembly.compile(bytes),
          memory = new WebAssembly.Memory({ initial: 5 });
        const moduleImports = {
            env: {
              memory: memory,
              emscripten_resize_heap: function emscripten_resize_heap(newSize) {
                const currentPages = memory.buffer.byteLength / 65536,
                  requiredPages = Math.ceil(newSize / 65536);
                if (!(requiredPages > currentPages)) return !1;
                {
                  const pagesToGrow = requiredPages - currentPages;
                  try {
                    return (
                      memory.grow(pagesToGrow),
                      (function onMemoryGrowth(newBuffer) {
                        (console.log("Memory grew!"),
                          (currentBuffer = newBuffer));
                      })(memory.buffer),
                      !0
                    );
                  } catch (error) {
                    return (console.error("Failed to resize heap:", error), !1);
                  }
                }
              },
            },
          },
          instance = await WebAssembly.instantiate(module, moduleImports);
        let currentBuffer = memory.buffer;
        return instance.exports;
      } catch (e) {}
    })().then((exports) => {
      (promise.resolve(),
        exports &&
          ((wasmExports = exports),
          (_this.multiply = function (a, b, c) {
            (a.elements.ptr || _this.allocate(a),
              b.elements.ptr || _this.allocate(b),
              c.elements.ptr || _this.allocate(c),
              wasmExports.multiply_matrices(
                a.elements.ptr,
                b.elements.ptr,
                c.elements.ptr,
              ));
          }),
          (_this.getInverse = function (out, m) {
            (out.elements.ptr || _this.allocate(out),
              m.elements.ptr || _this.allocate(m),
              wasmExports.getInverse(out.elements.ptr, m.elements.ptr));
          })));
    });
    const _identity = new Float32Array([
      1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
    ]);
    ((_this.allocate = function (ref) {
      if (ref.elements?.ptr) return;
      if (!wasmExports)
        return void (ref.elements || (ref.elements = _identity.slice()));
      const ptr = wasmExports.allocate_matrix(),
        elements = new Float32Array(wasmExports.memory.buffer, ptr, 16);
      (elements.set(ref.elements || _identity, 0),
        (elements.ptr = ptr),
        (ref.elements = elements),
        registry?.register(ref, ref.elements));
    }),
      (_this.ready = function () {
        return promise;
      }));
  }, "static"),
  Module(function ShaderCode() {
    let textureExpression = /texture(2D|Cube)?(\w+)?\s*\(/g;
    function removeUBO(code, name) {
      let uniforms = code.split(`uniform ${name} {`)[1];
      ((uniforms = uniforms.split("};")[0]),
        (uniforms = uniforms.split("\n")),
        uniforms.forEach((u) => {
          (u = u.trim()).length && (code = code.replace(u, "uniform " + u));
        }));
      let split = code.split(`uniform ${name} {`);
      return (
        (split[1] = split[1].replace("};", "")),
        (code = (code = split.join("")).replace(`uniform ${name} {`, ""))
      );
    }
    this.exports = {
      convertWebGL1: function convertWebGL1(code, type) {
        return (
          (code = (code = code.replace("#version 300 es", "")).replace(
            "out vec4 FragColor;",
            "",
          )).includes("samplerExternalOES") &&
            (code = code.replace("samplerExternalOES", "sampler2D")),
          (code = code.replace(
            textureExpression,
            function (match, samplerType, suffix = "", offset, origCode) {
              if (!samplerType) {
                let name = origCode
                  .substring(offset + match.length)
                  .split(",", 1)[0]
                  ?.trim();
                (name &&
                  (samplerType = new RegExp(`sampler(\\w+)\\s+${name}`).exec(
                    origCode,
                  )?.[1]),
                  samplerType || (samplerType = "2D"));
              }
              if (
                (suffix.endsWith("EXT") && (suffix = suffix.slice(0, -3)),
                "vs" === type && ["Lod", "ProjLod"].includes(suffix))
              )
                return `texture${samplerType}${suffix}(`;
              if (["Lod", "Grad", "ProjLod", "ProjGrad"].includes(suffix)) {
                if (Renderer.extensions.lod)
                  return `texture${samplerType}${suffix}EXT(`;
                suffix.endsWith("Lod") && (suffix = suffix.slice(0, -3));
              }
              return `texture${samplerType}${suffix}(`;
            },
          )).includes("uniform global {") && (code = removeUBO(code, "global")),
          code.includes("uniform ubo {") && (code = removeUBO(code, "ubo")),
          code.includes("uniform lights {") &&
            (code = removeUBO(code, "lights")),
          code
        );
      },
      convertWebGL2: function convertWebGL2(code, type) {
        return (
          !(code = (code =
            "vs" == type
              ? (code = code.replace(/attribute/g, "in")).replace(
                  /varying/g,
                  "out",
                )
              : code.replace(/varying/g, "in")).replace(
            textureExpression,
            function (match, samplerType, suffix = "") {
              return (
                suffix.endsWith("EXT") && (suffix = suffix.slice(0, -3)),
                `texture${suffix}(`
              );
            },
          )).includes("samplerExternalOES") ||
            ("android" == Device.system.os && window.AURA) ||
            (code = code.replace("samplerExternalOES", "sampler2D")),
          Renderer.UBO
            ? (code.includes("uniform global {") &&
                (code = code.replace(
                  "uniform global",
                  "layout(std140) uniform global",
                )),
              code.includes("uniform ubo {") &&
                (code = code.replace(
                  "uniform ubo",
                  "layout(std140) uniform ubo",
                )),
              Lighting.UBO
                ? code.includes("uniform lights {") &&
                  (code = code.replace(
                    "uniform lights",
                    "layout(std140) uniform lights",
                  ))
                : code.includes("uniform lights {") &&
                  (code = removeUBO(code, "lights")))
            : (code.includes("uniform global {") &&
                (code = removeUBO(code, "global")),
              code.includes("uniform ubo {") && (code = removeUBO(code, "ubo")),
              code.includes("uniform lights {") &&
                (code = removeUBO(code, "lights"))),
          code
        );
      },
    };
  }));
class UBO {
  constructor(location, gl = Renderer.context) {
    ((this.gl = gl), (this.arrays = []));
    for (let i = 0; i < 30; i++) this.arrays.push([]);
    ((this.arrayIndex = 0),
      (this.objects = []),
      (this.location = location),
      (this.data = null),
      (this.lastUpdate = 0));
  }
  _getSize(uniform) {
    let obj = uniform.value;
    return Array.isArray(obj)
      ? uniform.components
        ? (obj.length / uniform.components) * 16
        : 16 * obj.length
      : obj instanceof Vector2
        ? 8
        : obj instanceof Vector3 ||
            obj instanceof Vector4 ||
            obj instanceof Color
          ? 16
          : obj instanceof Matrix4
            ? 64
            : obj instanceof Matrix3
              ? 48
              : obj instanceof Quaternion
                ? 16
                : 4;
  }
  _getValues(uniform) {
    let obj = uniform.value;
    return Array.isArray(obj)
      ? obj
      : obj instanceof Vector2
        ? this._array(obj.x, obj.y)
        : obj instanceof Vector3
          ? this._array(obj.x, obj.y, obj.z)
          : obj instanceof Matrix4 || obj instanceof Matrix3
            ? obj.elements
            : obj instanceof Color
              ? this._array(obj.r, obj.g, obj.b)
              : obj instanceof Quaternion
                ? this._array(obj.x, obj.y, obj.z, obj.w)
                : this._array(obj);
  }
  _array() {
    this.arrayIndex++ >= this.arrays.length - 1 && (this.arrayIndex = 0);
    let array = this.arrays[this.arrayIndex];
    return ((array.length = 0), array.push.apply(array, arguments), array);
  }
  clear() {
    for (let i = 0; i < this.arrays.length; i++) this.arrays[i].length = 0;
  }
  calculate() {
    let len = this.objects.length,
      chunk = 16,
      tsize = 0,
      offset = 0,
      size = 0;
    for (let i = 0; i < len; i++) {
      let obj = this.objects[i];
      ((size = this._getSize(obj)),
        (tsize = chunk - size),
        tsize < 0 && chunk < 16
          ? ((offset += chunk),
            i > 0 && (this.objects[i - 1].chunkLen += chunk),
            (chunk = 16))
          : (tsize < 0 && 16 == chunk) ||
            (0 == tsize ? (chunk = 16) : (chunk -= size)),
        (obj.offset = offset / 4),
        (obj.chunkLen = size / 4),
        (obj.dataLen = size / 4),
        (offset += size));
    }
    return (
      offset % 16 != 0 &&
        ((this.objects[this.objects.length - 1].chunkLen += chunk / 4),
        (offset += chunk)),
      offset / 4
    );
  }
  compileData() {
    let i,
      array = this._array(),
      len = this.calculate();
    for (i = 0; i < len; i++) array[i] = 0;
    for (i = 0; i < this.objects.length; i++) {
      let obj = this.objects[i],
        values = this._getValues(obj);
      for (let j = 0; j < values.length; j++) array[obj.offset + j] = values[j];
    }
    return array;
  }
  upload() {
    if (this.data) return;
    let gl = Renderer.context,
      array = this.compileData();
    array.length &&
      ((this.data = new Float32Array(array)),
      (this.buffer = gl.createBuffer()),
      gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer),
      gl.bufferData(gl.UNIFORM_BUFFER, this.data, gl.DYNAMIC_DRAW),
      gl.bindBuffer(gl.UNIFORM_BUFFER, null),
      gl.bindBufferBase(gl.UNIFORM_BUFFER, this.location, this.buffer));
  }
  bind(program, name) {
    (this.data || this.upload(), this.needsUpdate && this.update());
    let location,
      gl = Renderer.context;
    ((location =
      program == this.lastProgram &&
      name == this.lastName &&
      void 0 !== this.lastLocation
        ? this.lastLocation
        : gl.getUniformBlockIndex(program, name)),
      location > 99999 ||
        -1 == location ||
        (gl.uniformBlockBinding(program, location, this.location),
        gl.bindBufferBase(gl.UNIFORM_BUFFER, this.location, this.buffer),
        (this.lastProgram = program),
        (this.lastName = name),
        (this.lastLocation = location)));
  }
  update() {
    if ((this.data || this.upload(), !this.data)) return;
    let gl = Renderer.context,
      array = this.compileData();
    (array.length != this.data.length &&
      ((this.data = new Float32Array(array)), this.upload()),
      this.data.set(array),
      gl.bindBuffer(gl.UNIFORM_BUFFER, this.buffer),
      gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.data),
      gl.bindBuffer(gl.UNIFORM_BUFFER, null),
      (this.needsUpdate = !1));
  }
  unbind() {}
  push() {
    if (this.data) throw "Can't modify UBO after initial upload!";
    for (let i = 0; i < arguments.length; i++) this.objects.push(arguments[i]);
  }
  destroy() {
    this.gl.deleteBuffer(this.buffer);
  }
}
class VAO {
  constructor(gl) {
    ((this.gl = gl),
      (this.WEBGL2 = Renderer.type == Renderer.WEBGL2),
      this.WEBGL2
        ? (this.vao = gl.createVertexArray())
        : (this.vao = Renderer.extensions.VAO.createVertexArrayOES()));
  }
  bind() {
    const gl = this.gl;
    this.WEBGL2
      ? gl.bindVertexArray(this.vao)
      : Renderer.extensions.VAO.bindVertexArrayOES(this.vao);
  }
  unbind() {
    const gl = this.gl;
    this.WEBGL2
      ? gl.bindVertexArray(null)
      : Renderer.extensions.VAO.bindVertexArrayOES(null);
  }
  destroy() {
    const gl = this.gl;
    (this.WEBGL2
      ? gl.deleteVertexArray(this.vao)
      : Renderer.extensions.VAO.deleteVertexArrayOES(this.vao),
      (this.vao = null));
  }
}
class BoxGeometry extends Geometry {
  constructor(
    width = 1,
    height = 1,
    depth = 1,
    widthSegments = 1,
    heightSegments = 1,
    depthSegments = 1,
  ) {
    (super(),
      (widthSegments = Math.floor(widthSegments)),
      (heightSegments = Math.floor(heightSegments)),
      (depthSegments = Math.floor(depthSegments)));
    let indices = [],
      vertices = [],
      normals = [],
      uvs = [],
      numberOfVertices = 0;
    function buildPlane(
      u,
      v,
      w,
      udir,
      vdir,
      width,
      height,
      depth,
      gridX,
      gridY,
      materialIndex,
    ) {
      let ix,
        iy,
        segmentWidth = width / gridX,
        segmentHeight = height / gridY,
        widthHalf = width / 2,
        heightHalf = height / 2,
        depthHalf = depth / 2,
        gridX1 = gridX + 1,
        gridY1 = gridY + 1,
        vertexCounter = 0,
        vector = new Vector3();
      for (iy = 0; iy < gridY1; iy++) {
        let y = iy * segmentHeight - heightHalf;
        for (ix = 0; ix < gridX1; ix++) {
          let x = ix * segmentWidth - widthHalf;
          ((vector[u] = x * udir),
            (vector[v] = y * vdir),
            (vector[w] = depthHalf),
            vertices.push(vector.x, vector.y, vector.z),
            (vector[u] = 0),
            (vector[v] = 0),
            (vector[w] = depth > 0 ? 1 : -1),
            normals.push(vector.x, vector.y, vector.z),
            uvs.push(ix / gridX),
            uvs.push(1 - iy / gridY),
            (vertexCounter += 1));
        }
      }
      for (iy = 0; iy < gridY; iy++)
        for (ix = 0; ix < gridX; ix++) {
          let a = numberOfVertices + ix + gridX1 * iy,
            b = numberOfVertices + ix + gridX1 * (iy + 1),
            c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1),
            d = numberOfVertices + (ix + 1) + gridX1 * iy;
          (indices.push(a, b, d), indices.push(b, c, d));
        }
      numberOfVertices += vertexCounter;
    }
    (buildPlane(
      "z",
      "y",
      "x",
      -1,
      -1,
      depth,
      height,
      width,
      depthSegments,
      heightSegments,
      0,
    ),
      buildPlane(
        "z",
        "y",
        "x",
        1,
        -1,
        depth,
        height,
        -width,
        depthSegments,
        heightSegments,
        1,
      ),
      buildPlane(
        "x",
        "z",
        "y",
        1,
        1,
        width,
        depth,
        height,
        widthSegments,
        depthSegments,
        2,
      ),
      buildPlane(
        "x",
        "z",
        "y",
        1,
        -1,
        width,
        depth,
        -height,
        widthSegments,
        depthSegments,
        3,
      ),
      buildPlane(
        "x",
        "y",
        "z",
        1,
        -1,
        width,
        height,
        depth,
        widthSegments,
        heightSegments,
        4,
      ),
      buildPlane(
        "x",
        "y",
        "z",
        -1,
        -1,
        width,
        height,
        -depth,
        widthSegments,
        heightSegments,
        5,
      ),
      (this.index = new (
        Geometry.arrayNeedsUint32(indices) ? Uint32Array : Uint16Array
      )(indices)),
      this.addAttribute(
        "position",
        new GeometryAttribute(new Float32Array(vertices), 3),
      ),
      this.addAttribute(
        "normal",
        new GeometryAttribute(new Float32Array(normals), 3),
      ),
      this.addAttribute("uv", new GeometryAttribute(new Float32Array(uvs), 2)));
  }
}
class CircleGeometry extends Geometry {
  constructor(
    radius = 1,
    segments = 8,
    thetaStart = 0,
    thetaLength = 2 * Math.PI,
  ) {
    super();
    var i,
      s,
      indices = [],
      vertices = [],
      normals = [],
      uvs = [],
      vertex = new Vector3(),
      uv = new Vector2();
    for (
      vertices.push(0, 0, 0),
        normals.push(0, 0, 1),
        uvs.push(0.5, 0.5),
        s = 0,
        i = 3;
      s <= segments;
      s++, i += 3
    ) {
      var segment = thetaStart + (s / segments) * thetaLength;
      ((vertex.x = radius * Math.cos(segment)),
        (vertex.y = radius * Math.sin(segment)),
        vertices.push(vertex.x, vertex.y, vertex.z),
        normals.push(0, 0, 1),
        (uv.x = (vertices[i] / radius + 1) / 2),
        (uv.y = (vertices[i + 1] / radius + 1) / 2),
        uvs.push(uv.x, uv.y));
    }
    for (i = 1; i <= segments; i++) indices.push(i, i + 1, 0);
    ((this.index = new (
      Geometry.arrayNeedsUint32(indices) ? Uint32Array : Uint16Array
    )(indices)),
      this.addAttribute(
        "position",
        new GeometryAttribute(new Float32Array(vertices), 3),
      ),
      this.addAttribute(
        "normal",
        new GeometryAttribute(new Float32Array(normals), 3),
      ),
      this.addAttribute("uv", new GeometryAttribute(new Float32Array(uvs), 2)));
  }
}
class CylinderGeometry extends Geometry {
  constructor(
    radiusTop = 1,
    radiusBottom = 1,
    height = 1,
    radialSegments = 8,
    heightSegments = 1,
    openEnded = !1,
    thetaStart = 0,
    thetaLength = 2 * Math.PI,
    planarMapping = !1,
  ) {
    (super(),
      (radialSegments = Math.floor(radialSegments)),
      (heightSegments = Math.floor(heightSegments)));
    let indices = [],
      vertices = [],
      normals = [],
      uvs = [],
      index = 0,
      indexArray = [],
      halfHeight = height / 2;
    function generateCap(top) {
      let x,
        centerIndexStart,
        centerIndexEnd,
        uv = new Vector2(),
        vertex = new Vector3(),
        radius = !0 === top ? radiusTop : radiusBottom,
        sign = !0 === top ? 1 : -1,
        signV = planarMapping ? 1 : sign;
      for (centerIndexStart = index, x = 1; x <= radialSegments; x++)
        (vertices.push(0, halfHeight * sign, 0),
          normals.push(0, sign, 0),
          uvs.push(0.5, 0.5),
          index++);
      for (centerIndexEnd = index, x = 0; x <= radialSegments; x++) {
        let theta = (x / radialSegments) * thetaLength + thetaStart,
          cosTheta = Math.cos(theta),
          sinTheta = Math.sin(theta);
        ((vertex.x = radius * sinTheta),
          (vertex.y = halfHeight * sign),
          (vertex.z = radius * cosTheta),
          vertices.push(vertex.x, vertex.y, vertex.z),
          normals.push(0, sign, 0),
          (uv.x = 0.5 * cosTheta + 0.5),
          (uv.y = 0.5 * sinTheta * signV + 0.5),
          uvs.push(uv.x, uv.y),
          index++);
      }
      for (x = 0; x < radialSegments; x++) {
        let c = centerIndexStart + x,
          i = centerIndexEnd + x;
        !0 === top ? indices.push(i, i + 1, c) : indices.push(i + 1, i, c);
      }
    }
    (!(function generateTorso() {
      let x,
        y,
        uv = new Vector2(),
        normal = new Vector3(),
        vertex = new Vector3(),
        slope = (radiusBottom - radiusTop) / height;
      for (y = 0; y <= heightSegments; y++) {
        let indexRow = [],
          v = y / heightSegments,
          radius = v * (radiusBottom - radiusTop) + radiusTop;
        for (x = 0; x <= radialSegments; x++) {
          let u = x / radialSegments,
            theta = u * thetaLength + thetaStart,
            sinTheta = Math.sin(theta),
            cosTheta = Math.cos(theta);
          ((vertex.x = radius * sinTheta),
            (vertex.y = -v * height + halfHeight),
            (vertex.z = radius * cosTheta),
            vertices.push(vertex.x, vertex.y, vertex.z),
            normal.set(sinTheta, slope, cosTheta).normalize(),
            normals.push(normal.x, normal.y, normal.z),
            planarMapping
              ? ((uv.x = 0.5 * cosTheta + 0.5),
                (uv.y = 0.5 * sinTheta + 0.5),
                uvs.push(uv.x, uv.y))
              : uvs.push(u, 1 - v),
            indexRow.push(index++));
        }
        indexArray.push(indexRow);
      }
      for (x = 0; x < radialSegments; x++)
        for (y = 0; y < heightSegments; y++) {
          let a = indexArray[y][x],
            b = indexArray[y + 1][x],
            c = indexArray[y + 1][x + 1],
            d = indexArray[y][x + 1];
          (indices.push(a, b, d), indices.push(b, c, d));
        }
    })(),
      !1 === openEnded &&
        (radiusTop > 0 && generateCap(!0), radiusBottom > 0 && generateCap(!1)),
      (this.index = new (
        Geometry.arrayNeedsUint32(indices) ? Uint32Array : Uint16Array
      )(indices)),
      this.addAttribute(
        "position",
        new GeometryAttribute(new Float32Array(vertices), 3),
      ),
      this.addAttribute(
        "normal",
        new GeometryAttribute(new Float32Array(normals), 3),
      ),
      this.addAttribute("uv", new GeometryAttribute(new Float32Array(uvs), 2)));
  }
}
class ConeGeometry extends CylinderGeometry {
  constructor(
    radius,
    height,
    radialSegments,
    heightSegments,
    openEnded,
    thetaStart,
    thetaLength,
  ) {
    super(
      0,
      radius,
      height,
      radialSegments,
      heightSegments,
      openEnded,
      thetaStart,
      thetaLength,
    );
  }
}
class PlaneGeometry extends Geometry {
  constructor(width = 1, height = 1, widthSegments = 1, heightSegments = 1) {
    super();
    let ix,
      iy,
      width_half = width / 2,
      height_half = height / 2,
      gridX = Math.floor(widthSegments) || 1,
      gridY = Math.floor(heightSegments) || 1,
      gridX1 = gridX + 1,
      gridY1 = gridY + 1,
      segment_width = width / gridX,
      segment_height = height / gridY,
      indices = [],
      vertices = [],
      normals = [],
      uvs = [];
    for (iy = 0; iy < gridY1; iy++) {
      let y = iy * segment_height - height_half;
      for (ix = 0; ix < gridX1; ix++) {
        let x = ix * segment_width - width_half;
        (vertices.push(x, -y, 0),
          normals.push(0, 0, 1),
          uvs.push(ix / gridX),
          uvs.push(1 - iy / gridY));
      }
    }
    for (iy = 0; iy < gridY; iy++)
      for (ix = 0; ix < gridX; ix++) {
        let a = ix + gridX1 * iy,
          b = ix + gridX1 * (iy + 1),
          c = ix + 1 + gridX1 * (iy + 1),
          d = ix + 1 + gridX1 * iy;
        (indices.push(a, b, d), indices.push(b, c, d));
      }
    ((this.index = new (
      Geometry.arrayNeedsUint32(indices) ? Uint32Array : Uint16Array
    )(indices)),
      this.addAttribute(
        "position",
        new GeometryAttribute(new Float32Array(vertices), 3),
      ),
      this.addAttribute(
        "normal",
        new GeometryAttribute(new Float32Array(normals), 3),
      ),
      this.addAttribute("uv", new GeometryAttribute(new Float32Array(uvs), 2)));
  }
}
class PolyhedronGeometry extends Geometry {
  constructor(vertices, indices = [], radius = 1, detail = 0) {
    super();
    let vertexBuffer = [],
      uvBuffer = [];
    function subdivideFace(a, b, c, detail) {
      var i,
        j,
        cols = Math.pow(2, detail),
        v = [];
      for (i = 0; i <= cols; i++) {
        v[i] = [];
        var aj = a.clone().lerp(c, i / cols),
          bj = b.clone().lerp(c, i / cols),
          rows = cols - i;
        for (j = 0; j <= rows; j++)
          v[i][j] = 0 === j && i === cols ? aj : aj.clone().lerp(bj, j / rows);
      }
      for (i = 0; i < cols; i++)
        for (j = 0; j < 2 * (cols - i) - 1; j++) {
          var k = Math.floor(j / 2);
          j % 2 == 0
            ? (pushVertex(v[i][k + 1]),
              pushVertex(v[i + 1][k]),
              pushVertex(v[i][k]))
            : (pushVertex(v[i][k + 1]),
              pushVertex(v[i + 1][k + 1]),
              pushVertex(v[i + 1][k]));
        }
    }
    function pushVertex(vertex) {
      vertexBuffer.push(vertex.x, vertex.y, vertex.z);
    }
    function getVertexByIndex(index, vertex) {
      let stride = 3 * index;
      ((vertex.x = vertices[stride + 0]),
        (vertex.y = vertices[stride + 1]),
        (vertex.z = vertices[stride + 2]));
    }
    function correctUV(uv, stride, vector, azimuth) {
      (azimuth < 0 && 1 === uv.x && (uvBuffer[stride] = uv.x - 1),
        0 === vector.x &&
          0 === vector.z &&
          (uvBuffer[stride] = azimuth / 2 / Math.PI + 0.5));
    }
    function azimuth(vector) {
      return Math.atan2(vector.z, -vector.x);
    }
    (!(function subdivide(detail) {
      let a = new Vector3(),
        b = new Vector3(),
        c = new Vector3();
      for (let i = 0; i < indices.length; i += 3)
        (getVertexByIndex(indices[i + 0], a),
          getVertexByIndex(indices[i + 1], b),
          getVertexByIndex(indices[i + 2], c),
          subdivideFace(a, b, c, detail));
    })(detail),
      (function appplyRadius(radius) {
        for (var vertex = new Vector3(), i = 0; i < vertexBuffer.length; i += 3)
          ((vertex.x = vertexBuffer[i + 0]),
            (vertex.y = vertexBuffer[i + 1]),
            (vertex.z = vertexBuffer[i + 2]),
            vertex.normalize().multiplyScalar(radius),
            (vertexBuffer[i + 0] = vertex.x),
            (vertexBuffer[i + 1] = vertex.y),
            (vertexBuffer[i + 2] = vertex.z));
      })(radius),
      (function generateUVs() {
        let vertex = new Vector3();
        for (let i = 0; i < vertexBuffer.length; i += 3) {
          ((vertex.x = vertexBuffer[i + 0]),
            (vertex.y = vertexBuffer[i + 1]),
            (vertex.z = vertexBuffer[i + 2]));
          let u = azimuth(vertex) / 2 / Math.PI + 0.5,
            v =
              ((vector = vertex),
              Math.atan2(
                -vector.y,
                Math.sqrt(vector.x * vector.x + vector.z * vector.z),
              ) /
                Math.PI +
                0.5);
          uvBuffer.push(u, 1 - v);
        }
        var vector;
        ((function correctUVs() {
          let a = new Vector3(),
            b = new Vector3(),
            c = new Vector3(),
            centroid = new Vector3(),
            uvA = new Vector2(),
            uvB = new Vector2(),
            uvC = new Vector2();
          for (let i = 0, j = 0; i < vertexBuffer.length; i += 9, j += 6) {
            (a.set(
              vertexBuffer[i + 0],
              vertexBuffer[i + 1],
              vertexBuffer[i + 2],
            ),
              b.set(
                vertexBuffer[i + 3],
                vertexBuffer[i + 4],
                vertexBuffer[i + 5],
              ),
              c.set(
                vertexBuffer[i + 6],
                vertexBuffer[i + 7],
                vertexBuffer[i + 8],
              ),
              uvA.set(uvBuffer[j + 0], uvBuffer[j + 1]),
              uvB.set(uvBuffer[j + 2], uvBuffer[j + 3]),
              uvC.set(uvBuffer[j + 4], uvBuffer[j + 5]),
              centroid.copy(a).add(b).add(c).divideScalar(3));
            let azi = azimuth(centroid);
            (correctUV(uvA, j + 0, a, azi),
              correctUV(uvB, j + 2, b, azi),
              correctUV(uvC, j + 4, c, azi));
          }
        })(),
          (function correctSeam() {
            for (let i = 0; i < uvBuffer.length; i += 6) {
              let x0 = uvBuffer[i + 0],
                x1 = uvBuffer[i + 2],
                x2 = uvBuffer[i + 4],
                max = Math.max(x0, x1, x2),
                min = Math.min(x0, x1, x2);
              max > 0.9 &&
                min < 0.1 &&
                (x0 < 0.2 && (uvBuffer[i + 0] += 1),
                x1 < 0.2 && (uvBuffer[i + 2] += 1),
                x2 < 0.2 && (uvBuffer[i + 4] += 1));
            }
          })());
      })(),
      this.addAttribute(
        "position",
        new GeometryAttribute(new Float32Array(vertexBuffer), 3),
      ),
      this.addAttribute(
        "normal",
        new GeometryAttribute(new Float32Array(vertexBuffer.slice()), 3),
      ),
      this.addAttribute(
        "uv",
        new GeometryAttribute(new Float32Array(uvBuffer), 2),
      ),
      0 === detail ? this.computeVertexNormals() : this.normalizeNormals());
  }
}
class IcosahedronGeometry extends PolyhedronGeometry {
  constructor(radius, detail) {
    let t = (1 + Math.sqrt(5)) / 2;
    super(
      [
        -1,
        t,
        0,
        1,
        t,
        0,
        -1,
        -t,
        0,
        1,
        -t,
        0,
        0,
        -1,
        t,
        0,
        1,
        t,
        0,
        -1,
        -t,
        0,
        1,
        -t,
        t,
        0,
        -1,
        t,
        0,
        1,
        -t,
        0,
        -1,
        -t,
        0,
        1,
      ],
      [
        0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11,
        10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9,
        4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1,
      ],
      radius,
      detail,
    );
  }
}
class OctahedronGeometry extends PolyhedronGeometry {
  constructor(radius = 1, detail = 0) {
    (super(
      [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1],
      [0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2],
      radius,
      detail,
    ),
      (this.type = "OctahedronGeometry"),
      (this.parameters = { radius: radius, detail: detail }));
  }
}
OctahedronGeometry.fromJSON = function (data) {
  return new OctahedronGeometry(data.radius, data.detail);
};
class RingGeometry extends Geometry {
  constructor(
    innerRadius = 0.5,
    outerRadius = 1,
    thetaSegments = 8,
    phiSegments = 1,
    thetaStart = 0,
    thetaLength = 2 * Math.PI,
  ) {
    super();
    var segment,
      j,
      i,
      indices = [],
      vertices = [],
      normals = [],
      uvs = [],
      radius = innerRadius,
      radiusStep = (outerRadius - innerRadius) / phiSegments,
      vertex = new Vector3(),
      uv = new Vector2();
    for (j = 0; j <= phiSegments; j++) {
      for (i = 0; i <= thetaSegments; i++)
        ((segment = thetaStart + (i / thetaSegments) * thetaLength),
          (vertex.x = radius * Math.cos(segment)),
          (vertex.y = radius * Math.sin(segment)),
          vertices.push(vertex.x, vertex.y, vertex.z),
          normals.push(0, 0, 1),
          (uv.x = (vertex.x / outerRadius + 1) / 2),
          (uv.y = (vertex.y / outerRadius + 1) / 2),
          uvs.push(uv.x, uv.y));
      radius += radiusStep;
    }
    for (j = 0; j < phiSegments; j++) {
      var thetaSegmentLevel = j * (thetaSegments + 1);
      for (i = 0; i < thetaSegments; i++) {
        var a = (segment = i + thetaSegmentLevel),
          b = segment + thetaSegments + 1,
          c = segment + thetaSegments + 2,
          d = segment + 1;
        (indices.push(a, b, d), indices.push(b, c, d));
      }
    }
    ((this.index = new (
      Geometry.arrayNeedsUint32(indices) ? Uint32Array : Uint16Array
    )(indices)),
      this.addAttribute(
        "position",
        new GeometryAttribute(new Float32Array(vertices), 3),
      ),
      this.addAttribute(
        "normal",
        new GeometryAttribute(new Float32Array(normals), 3),
      ),
      this.addAttribute("uv", new GeometryAttribute(new Float32Array(uvs), 2)));
  }
}
class SphereGeometry extends Geometry {
  constructor(
    radius = 1,
    widthSegments = 8,
    heightSegments = 6,
    phiStart = 0,
    phiLength = 2 * Math.PI,
    thetaStart = 0,
    thetaLength = Math.PI,
  ) {
    (super(),
      (widthSegments = Math.max(3, Math.floor(widthSegments))),
      (heightSegments = Math.max(2, Math.floor(heightSegments))));
    let ix,
      iy,
      thetaEnd = thetaStart + thetaLength,
      index = 0,
      grid = [],
      vertex = new Vector3(),
      normal = new Vector3(),
      indices = [],
      vertices = [],
      normals = [],
      uvs = [];
    for (iy = 0; iy <= heightSegments; iy++) {
      let verticesRow = [],
        v = iy / heightSegments;
      for (ix = 0; ix <= widthSegments; ix++) {
        let u = ix / widthSegments;
        ((vertex.x =
          -radius *
          Math.cos(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength)),
          (vertex.y = radius * Math.cos(thetaStart + v * thetaLength)),
          (vertex.z =
            radius *
            Math.sin(phiStart + u * phiLength) *
            Math.sin(thetaStart + v * thetaLength)),
          vertices.push(vertex.x, vertex.y, vertex.z),
          normal.set(vertex.x, vertex.y, vertex.z).normalize(),
          normals.push(normal.x, normal.y, normal.z),
          uvs.push(u, 1 - v),
          verticesRow.push(index++));
      }
      grid.push(verticesRow);
    }
    for (iy = 0; iy < heightSegments; iy++)
      for (ix = 0; ix < widthSegments; ix++) {
        let a = grid[iy][ix + 1],
          b = grid[iy][ix],
          c = grid[iy + 1][ix],
          d = grid[iy + 1][ix + 1];
        ((0 !== iy || thetaStart > 0) && indices.push(a, b, d),
          (iy !== heightSegments - 1 || thetaEnd < Math.PI) &&
            indices.push(b, c, d));
      }
    ((this.index = new (
      Geometry.arrayNeedsUint32(indices) ? Uint32Array : Uint16Array
    )(indices)),
      this.addAttribute(
        "position",
        new GeometryAttribute(new Float32Array(vertices), 3),
      ),
      this.addAttribute(
        "normal",
        new GeometryAttribute(new Float32Array(normals), 3),
      ),
      this.addAttribute("uv", new GeometryAttribute(new Float32Array(uvs), 2)));
  }
}
class TorusKnotGeometry extends Geometry {
  constructor(
    radius = 1,
    tube = 0.4,
    tubularSegments = 64,
    radialSegments = 8,
    p = 2,
    q = 3,
  ) {
    super();
    let i,
      j,
      indices = [],
      vertices = [],
      normals = [],
      uvs = [],
      vertex = new Vector3(),
      normal = new Vector3(),
      P1 = new Vector3(),
      P2 = new Vector3(),
      B = new Vector3(),
      T = new Vector3(),
      N = new Vector3();
    for (i = 0; i <= tubularSegments; ++i) {
      let u = (i / tubularSegments) * p * Math.PI * 2;
      for (
        calculatePositionOnCurve(u, p, q, radius, P1),
          calculatePositionOnCurve(u + 0.01, p, q, radius, P2),
          T.subVectors(P2, P1),
          N.addVectors(P2, P1),
          B.crossVectors(T, N),
          N.crossVectors(B, T),
          B.normalize(),
          N.normalize(),
          j = 0;
        j <= radialSegments;
        ++j
      ) {
        let v = (j / radialSegments) * Math.PI * 2,
          cx = -tube * Math.cos(v),
          cy = tube * Math.sin(v);
        ((vertex.x = P1.x + (cx * N.x + cy * B.x)),
          (vertex.y = P1.y + (cx * N.y + cy * B.y)),
          (vertex.z = P1.z + (cx * N.z + cy * B.z)),
          vertices.push(vertex.x, vertex.y, vertex.z),
          normal.subVectors(vertex, P1).normalize(),
          normals.push(normal.x, normal.y, normal.z),
          uvs.push(i / tubularSegments),
          uvs.push(j / radialSegments));
      }
    }
    for (j = 1; j <= tubularSegments; j++)
      for (i = 1; i <= radialSegments; i++) {
        let a = (radialSegments + 1) * (j - 1) + (i - 1),
          b = (radialSegments + 1) * j + (i - 1),
          c = (radialSegments + 1) * j + i,
          d = (radialSegments + 1) * (j - 1) + i;
        (indices.push(a, b, d), indices.push(b, c, d));
      }
    function calculatePositionOnCurve(u, p, q, radius, position) {
      let cu = Math.cos(u),
        su = Math.sin(u),
        quOverP = (q / p) * u,
        cs = Math.cos(quOverP);
      ((position.x = radius * (2 + cs) * 0.5 * cu),
        (position.y = radius * (2 + cs) * su * 0.5),
        (position.z = radius * Math.sin(quOverP) * 0.5));
    }
    ((this.index = new (
      Geometry.arrayNeedsUint32(indices) ? Uint32Array : Uint16Array
    )(indices)),
      this.addAttribute(
        "position",
        new GeometryAttribute(new Float32Array(vertices), 3),
      ),
      this.addAttribute(
        "normal",
        new GeometryAttribute(new Float32Array(normals), 3),
      ),
      this.addAttribute("uv", new GeometryAttribute(new Float32Array(uvs), 2)));
  }
}
(Class(
  function Interaction3D(_camera) {
    Inherit(this, Component);
    const _this = this;
    let _hover, _click;
    var _lastOnUpdate,
      _maximumVRHitDistance,
      _v3 = new Vector3(),
      _plane = new Plane(),
      _input = {},
      _cacheHits = [],
      _enabled = !0;
    ((_this.ID = Utils.timestamp()), (_camera = _camera || World.CAMERA));
    var _ray = _this.initClass(Raycaster, _camera),
      _meshes = [],
      _test = [],
      _event = {};
    const PROHIBITED_ELEMENTS = ["hit", "prevent_interaction3d"];
    function checkIfProhibited(element) {
      let el = element;
      for (; el; ) {
        if (el.classList)
          for (let i = 0; i < PROHIBITED_ELEMENTS.length; i++)
            if (el.classList.contains(PROHIBITED_ELEMENTS[i])) return !0;
        el = el.parentNode;
      }
      return !1;
    }
    function parseMeshes(meshes) {
      Array.isArray(meshes) || (meshes = [meshes]);
      let output = [];
      return (
        meshes.forEach(function checkMesh(obj) {
          if (obj.isOcclusionMesh) return;
          (obj.hitArea || obj.hitMesh) &&
            (obj = (function initHitMesh(obj) {
              obj.hitMesh || (obj.hitMesh = new Mesh(obj.hitArea));
              return (
                obj.add(obj.hitMesh),
                (obj = obj.hitMesh),
                (obj.isHitMesh = !0),
                (obj.shader.neverRender = !0),
                obj
              );
            })(obj));
          "boolean" == typeof obj.isHitMesh
            ? ((obj.mouseEnabled = function (visible) {
                visible
                  ? ~_meshes.indexOf(obj) || _meshes.push(obj)
                  : _meshes.remove(obj);
              }),
              output.push(obj))
            : output.push(obj);
          obj.children.length && obj.children.forEach(checkMesh);
        }),
        output
      );
    }
    function testObjects() {
      _test.length = 0;
      for (let i = _meshes.length - 1; i > -1; i--) {
        let obj = _meshes[i];
        obj.determineVisible() && _test.push(obj);
      }
      return _test;
    }
    function start(e) {
      if ("2d" == _input.type) {
        let element = document.elementFromPoint(
          Math.clamp(e.x || 0, 0, Stage.width),
          Math.clamp(e.y || 0, 0, Stage.height),
        );
        if ((element && checkIfProhibited(element)) || GLUI.HIT) return;
      }
      if (!_enabled) return;
      let hit = move(e);
      ("3d" == _input.type && _this.events.fire(Interaction3D.EXTERNAL_PRESS),
        hit
          ? ((_click = hit.object), (_click.time = Render.TIME))
          : (_click = null));
    }
    function moveHand(e) {
      if (!_enabled) return;
      _cacheHits.length = 0;
      for (let i = 0; i < _input.obj.length; i++) {
        let obj = _input.obj[i];
        _v3.set(0, 0, -1).applyQuaternion(obj.quaternion);
        let hit = _ray.checkFromValues(testObjects(), obj.position, _v3)[0];
        hit && _cacheHits.push(hit);
      }
      _cacheHits.sort((a, b) => a.distance - b.distance);
      let hit = _cacheHits[0];
      if (
        ((hit && hit.object == _lastOnUpdate) ||
          (_lastOnUpdate &&
            _lastOnUpdate.onMissUpdate &&
            _lastOnUpdate.onMissUpdate(),
          (_lastOnUpdate = null)),
        hit)
      ) {
        let mesh = hit.object;
        if (mesh.onHitUpdate)
          return (
            (hit.usingFinger = !0),
            (_lastOnUpdate = mesh),
            mesh.onHitUpdate(hit),
            !1
          );
        !mesh._debounceFingerClick ||
        Render.TIME - mesh._debounceFingerClick > 1e3
          ? hit.distance < 0.01
            ? ((_click = mesh),
              triggerClick(mesh, hit),
              (mesh._debounceFingerClick = Render.TIME))
            : _hover || ((_hover = mesh), triggerHover("over", mesh, hit))
          : _hover && (triggerHover("out", _hover), (_hover = null));
      } else _hover && (triggerHover("out", _hover), (_hover = null));
    }
    function move(e) {
      if ("2d" == _input.type) {
        let element = document.elementFromPoint(
          Math.clamp(e.x || 0, 0, Stage.width),
          Math.clamp(e.y || 0, 0, Stage.height),
        );
        if (element && checkIfProhibited(element)) return;
      }
      if (!_enabled) return void Interaction3D.requestCursor("auto", _this);
      let hit;
      if (
        ("2d" == _input.type
          ? (hit = _ray.checkHit(
              testObjects(),
              _input.position,
              _input.rect || Stage,
            )[0])
          : (_input.obj.hideBeam(),
            _v3
              .set(0, 0, -1)
              .applyQuaternion(_input.obj.group.getWorldQuaternion()),
            (hit = _ray.checkFromValues(
              testObjects(),
              _input.obj.group.getWorldPosition(),
              _v3,
            )[0])),
        (hit && hit.object == _lastOnUpdate) ||
          (_lastOnUpdate &&
            _lastOnUpdate.onMissUpdate &&
            _lastOnUpdate.onMissUpdate(),
          (_lastOnUpdate = null)),
        hit)
      ) {
        _this.intersecting = !0;
        let mesh = hit.object;
        if ("3d" == _input.type) {
          let max = _maximumVRHitDistance || Interaction3D.maximumVRHitDistance;
          if (
            ("number" == typeof mesh.maximumVRHitDistance &&
              mesh.maximumVRHitDistance > 0 &&
              (max = mesh.maximumVRHitDistance),
            mesh.onHitUpdate && hit.distance > max)
          )
            return !1;
          (_input.obj.showBeam(),
            _input.obj.setHitPosition && _input.obj.setHitPosition(hit));
        }
        return mesh.onHitUpdate
          ? (mesh.onHitUpdate(hit), (_lastOnUpdate = mesh), !1)
          : (_hover !== mesh
              ? (_hover && triggerHover("out", _hover, hit),
                (_hover = mesh),
                triggerHover("over", _hover, hit),
                _hover.__clickCallback
                  ? Interaction3D.requestCursor("pointer", _this)
                  : Interaction3D.requestCursor("auto", _this))
              : (function triggerMove(mesh, hit) {
                  ((_event.action = "move"),
                    (_event.mesh = mesh),
                    (_event.hit = hit),
                    _this.events.fire(Interaction3D.MOVE, _event, !0),
                    mesh["__moveCallback" + _this.ID] &&
                      mesh["__moveCallback" + _this.ID](_event));
                })(_hover, hit),
            hit);
      }
      return (
        (_this.intersecting = !1),
        end(),
        _input.obj &&
          _input.obj.setHitPosition &&
          _input.obj.setHitPosition(!1),
        !1
      );
    }
    function end() {
      _hover &&
        (triggerHover("out", _hover, null),
        (_hover = null),
        Interaction3D.requestCursor(_this.cursor, _this));
    }
    function click(e) {
      if (
        ("3d" == _input.type &&
          _this.events.fire(Interaction3D.EXTERNAL_RELEASE),
        !_this.enabled)
      )
        return;
      if (!_click) return;
      let hit,
        element = document.elementFromPoint(
          Math.clamp(e.x || 0, 0, Stage.width),
          Math.clamp(e.y || 0, 0, Stage.height),
        );
      if (!element || !checkIfProhibited(element)) {
        if ("2d" == _input.type) {
          if (GLUI.HIT) return;
          hit = _ray.checkHit(testObjects(), _input.position, _input.rect)[0];
        } else
          (_v3
            .set(0, 0, -1)
            .applyQuaternion(_input.obj.group.getWorldQuaternion()),
            (hit = _ray.checkFromValues(
              testObjects(),
              _input.obj.group.getWorldPosition(),
              _v3,
            )[0]));
        (hit && hit.object === _click && triggerClick(_click, hit),
          (_click = null));
      }
    }
    function triggerHover(action, mesh, hit) {
      ((_event.action = action),
        (_event.mesh = mesh),
        (_event.hit = hit),
        _this.events.fire(Interaction3D.HOVER, _event, !0),
        _hover.__hoverCallback && _hover.__hoverCallback(_event));
    }
    function triggerClick(mesh, hit) {
      ((_event.action = "click"),
        (_event.mesh = mesh),
        (_event.hit = hit),
        _this.events.fire(Interaction3D.CLICK, _event, !0),
        _click.__clickCallback && _click.__clickCallback(_event));
    }
    function vrInputButton(e) {
      "trigger" == e.label && (e.pressed ? start(e) : click(e));
    }
    ((this.cursor = "auto"),
      (_ray.testVisibility = !0),
      this.set("camera", (c) => {
        _ray.camera = c;
      }),
      (this.add = function (meshes, hover, click, move, seo) {
        let seoRoot;
        (Array.isArray(meshes) || (meshes = parseMeshes(meshes)),
          move && "function" != typeof move && ((seo = move), (move = null)),
          seo && seo.root && ((seoRoot = seo.root), (seo = seo.seo)),
          meshes.forEach((mesh, i) => {
            if (seo)
              try {
                ((mesh._divFocus = (_) =>
                  hover({ action: "over", seo: !0, mesh: mesh })),
                  (mesh._divBlur = (_) =>
                    hover({ action: "out", seo: !0, mesh: mesh })),
                  (mesh._divSelect = (_) =>
                    click({ action: "click", seo: !0, mesh: mesh })));
                let {
                  url: url,
                  label: label,
                  ...options
                } = Array.isArray(seo) ? seo[i] : seo;
                (GLSEO.objectNode(mesh, seoRoot),
                  mesh.seo.aLink(url, label, options));
              } catch (e) {
                Hydra.LOCAL &&
                  console.warn("Could not add SEO to Interaction3D meshes", e);
              }
            ((mesh.hitDestroy = (_) => _meshes.remove(mesh)),
              hover && (mesh.__hoverCallback = hover),
              click && (mesh.__clickCallback = click),
              move && (mesh["__moveCallback" + _this.ID] = move),
              _meshes.push(mesh));
          }));
      }),
      (this.remove = function (meshes) {
        (Array.isArray(meshes) || (meshes = parseMeshes(meshes)),
          meshes.forEach((mesh) => {
            (mesh === _hover &&
              ((_hover = null),
              Interaction3D.requestCursor(_this.cursor, _this)),
              mesh.seo && mesh.seo.unlink());
            for (let i = _meshes.length - 1; i >= 0; i--)
              mesh === _meshes[i] && _meshes.splice(i, 1);
          }));
      }),
      this.set("testVisibility", (v) => (_ray.testVisibility = v)),
      this.set("input", (obj) => {
        (_input &&
          _input.obj &&
          (_input.obj.isVrController &&
            _this.events.unsub(_input.obj, VRInput.BUTTON, vrInputButton),
          _input.obj.setHitPosition && _input.obj.setHitPosition(!1),
          _input.obj.hideBeam && _input.obj.hideBeam()),
          ((_input = {}).obj = obj),
          (_input.position = obj.group ? obj.group.position : obj),
          (_input.quaternion = obj.group ? obj.group.quaternion : null),
          (_input.type =
            "number" == typeof _input.position.z || Array.isArray(obj)
              ? "3d"
              : "2d"),
          (_input.rect = obj.rect),
          "3d" == _input.type
            ? (new Vector3(), new Vector3())
            : (new Vector2(), new Vector2()),
          obj == Mouse
            ? (function addHandlers() {
                (_this.events.sub(Mouse.input, Interaction.START, start),
                  Device.mobile &&
                    _this.events.sub(Mouse.input, Interaction.END, end),
                  _this.events.sub(Mouse.input, Interaction.MOVE, move),
                  _this.events.sub(Mouse.input, Interaction.CLICK, click));
              })()
            : (!(function removeHandlers() {
                (_this.events.unsub(Mouse.input, Interaction.START, start),
                  Device.mobile &&
                    _this.events.unsub(Mouse.input, Interaction.END, end),
                  _this.events.unsub(Mouse.input, Interaction.MOVE, move),
                  _this.events.unsub(Mouse.input, Interaction.CLICK, click));
              })(),
              Array.isArray(obj)
                ? (_this.startRender(moveHand), _this.stopRender(move))
                : (_this.events.sub(obj, VRInput.BUTTON, vrInputButton),
                  _this.startRender(move),
                  _this.stopRender(moveHand))));
      }),
      this.get("input", (_) => _input),
      this.get("enabled", (_) => _enabled),
      this.set("enabled", (v) => {
        (_enabled = v) ||
          (_hover && triggerHover("out", _hover, null),
          (_hover = null),
          _input &&
            _input.obj &&
            (_input.obj.setHitPosition && _input.obj.setHitPosition(!1),
            _input.obj.hideBeam && _input.obj.hideBeam()));
      }),
      (this.checkObjectHit = function (object, mouse, rect = Stage) {
        return _ray.checkHit(object, mouse, rect)[0];
      }),
      (this.checkObjectFromValues = function (object, origin, direction) {
        return _ray.checkFromValues(object, origin, direction)[0];
      }),
      (this.getObjectHitLocalCoords = function (
        v,
        object,
        mouse,
        rect = Stage,
      ) {
        let hit = _this.checkObjectHit(object, mouse, rect);
        return hit
          ? (v.copy(hit.point), hit.object.worldToLocal(v))
          : (_plane.normal
              .set(0, 0, 1)
              .applyQuaternion(object.getWorldQuaternion()),
            (_plane.constant = -object.getWorldPosition().dot(_plane.normal)),
            _ray.ray.intersectPlane(_plane, v),
            object.worldToLocal(v));
      }),
      this.get("maximumVRHitDistance", () => _maximumVRHitDistance),
      this.set("maximumVRHitDistance", (value) => {
        value
          ? "number" == typeof value &&
            value > 0 &&
            (_maximumVRHitDistance = value)
          : (_maximumVRHitDistance = void 0);
      }));
  },
  () => {
    ((Interaction3D.HOVER = "interaction3d_hover"),
      (Interaction3D.CLICK = "interaction3d_click"),
      (Interaction3D.MOVE = "interaction3d_move"),
      (Interaction3D.EXTERNAL_PRESS = "interaction3d_ext_press"),
      (Interaction3D.EXTERNAL_RELEASE = "interaction3d_ext_release"));
    var _cursorObj,
      _map = new Map(),
      _input = Mouse,
      _maximumVRHitDistance = 5;
    ((Interaction3D.find = function (camera) {
      if (((camera = camera.camera || camera), !_map.has(camera))) {
        let interaction = new Interaction3D(camera);
        ((interaction.input = _input), _map.set(camera, interaction));
      }
      return _map.get(camera);
    }),
      (Interaction3D.useInput = function (obj) {
        if (_input != obj) {
          for (let [camera, interaction] of _map) interaction.input = obj;
          _input = obj;
        }
      }),
      (Interaction3D.requestCursor = function (cursor, obj) {
        (obj.forceCursor && (cursor = obj.forceCursor),
          "pointer" == cursor && ((_cursorObj = obj), Stage.cursor(cursor)),
          "auto" == cursor &&
            _cursorObj == obj &&
            (Stage.cursor(cursor), (_cursorObj = null)));
      }),
      Object.defineProperty(Interaction3D, "maximumVRHitDistance", {
        get: () => _maximumVRHitDistance,
        set(value) {
          value
            ? "number" == typeof value &&
              value > 0 &&
              (_maximumVRHitDistance = value)
            : (_maximumVRHitDistance = 5);
        },
      }));
  },
),
  Class(function Lighting() {
    Inherit(this, Component);
    const _this = this;
    var _activeScene,
      _scenes = {};
    function loop() {
      if ((decomposeLights(_activeScene.lights), _this.UBO)) {
        let shader = _activeScene.shaders.start();
        shader &&
          (updateArrays(shader),
          _activeScene.ubo.created
            ? _activeScene.ubo.update()
            : createUBO(shader.uniforms));
      } else {
        let shader = _activeScene.shaders.start();
        for (; shader; )
          (updateArrays(shader), (shader = _activeScene.shaders.next()));
      }
    }
    function createUBO(uniforms) {
      uniforms.lightPos &&
        ((_activeScene.ubo.created = !0),
        _activeScene.ubo.push(uniforms.lightPos),
        _activeScene.ubo.push(uniforms.lightColor),
        _activeScene.ubo.push(uniforms.lightData),
        _activeScene.ubo.push(uniforms.lightData2),
        _activeScene.ubo.push(uniforms.lightData3),
        _activeScene.ubo.push(uniforms.lightProperties),
        _activeScene.ubo.upload());
    }
    function decomposeLights(lights) {
      for (let i = lights.length - 1; i > -1; i--) {
        let light = lights[i];
        (light._decomposedTime && Render.TIME - light._decomposedTime < 8) ||
          ((light._decomposedTime = Render.TIME),
          light._parent || light.updateMatrixWorld(),
          light._world || (light._world = new Vector3()),
          light.lockToLocal
            ? light._world.copy(light.position)
            : light.getWorldPosition(light._world));
      }
    }
    function updateArrays(shader) {
      let lighting = shader.__lighting;
      ((lighting.position.length = 0),
        (lighting.color.length = 0),
        (lighting.data.length = 0),
        (lighting.data2.length = 0),
        (lighting.data3.length = 0),
        (lighting.properties.length = 0));
      for (let i = 0; i < _activeScene.lights.length; i++) {
        let light = _activeScene.lights[i];
        (light._world || decomposeLights(_activeScene.lights),
          lighting.position.push(
            light._world.x,
            light._world.y,
            light._world.z,
            0,
          ),
          lighting.color.push(light.color.r, light.color.g, light.color.b, 0),
          lighting.data.push(
            light.data.x,
            light.data.y,
            light.data.z,
            light.data.w,
          ),
          lighting.data2.push(
            light.data2.x,
            light.data2.y,
            light.data2.z,
            light.data2.w,
          ),
          lighting.data3.push(
            light.data3.x,
            light.data3.y,
            light.data3.z,
            light.data3.w,
          ),
          lighting.properties.push(
            light.properties.x,
            light.properties.y,
            light.properties.z,
            light.properties.w,
          ));
      }
    }
    function findParentScene(obj3d) {
      if (!obj3d) return _activeScene;
      if (obj3d._lightingData) return obj3d._lightingData;
      let scene,
        p = obj3d._parent;
      for (; p; )
        (p instanceof Scene && p._lightingData && (scene = p._lightingData),
          (p = p._parent));
      return (scene || (scene = _activeScene), scene);
    }
    ((this.fallbackAreaToPoint = !1),
      (this.scenes = _scenes),
      (async function () {
        (await Hydra.ready(),
          _this.createScene("default"),
          _this.useScene("default"));
      })(),
      (this.createScene = function (name, scene) {
        if (_scenes[name]) return this;
        let obj = {
          lights: [],
          renderShadows: [],
          ubo: new (window.Metal ? MetalUBO : UBO)(2),
          shaders: new LinkedList(),
          name: name,
        };
        return (
          scene && (scene._lightingData = obj),
          (_scenes[name] = obj),
          this
        );
      }),
      (this.useScene = function (name) {
        if (!(_activeScene = _scenes[name])) throw `Scene ${name} not found`;
        return (loop(), this);
      }),
      (this.destroyScene = function (name) {
        delete _scenes[name];
      }),
      (this.push = this.add =
        function (light) {
          ((_this.UBO =
            Renderer.UBO &&
            !(window.AURA || RenderManager.type == RenderManager.WEBVR)),
            window.Metal && (_this.UBO = !0));
          let scene = findParentScene(light);
          (scene.lights.push(light),
            light.isAreaLight && (scene.hasAreaLight = !0),
            _this.startedLoop ||
              ((_this.startedLoop = !0),
              RenderManager.type == RenderManager.WEBVR
                ? _this.startRender(loop, World.NUKE)
                : Render.onDrawFrame(loop)));
        }),
      (this.remove = function (light) {
        _activeScene.lights.remove(light);
      }),
      (this.getLighting = function (shader, force) {
        if (shader.__lighting && !force) return shader.__lighting;
        let scene = findParentScene(shader.mesh);
        (scene.shaders.push(shader),
          window.AreaLightUtil &&
            scene.hasAreaLight &&
            AreaLightUtil.append(shader));
        let lighting = (shader.__lighting = {
          position: [],
          color: [],
          data: [],
          data2: [],
          data3: [],
          properties: [],
        });
        if (!scene.lights.length) return shader.__lighting;
        let lightUBO = _this.UBO;
        return (
          (shader.uniforms.lightPos = {
            type: "v4v",
            value: lighting.position,
            ignoreUIL: !0,
            lightUBO: lightUBO,
            components: 4,
            metalIgnore: !0,
          }),
          (shader.uniforms.lightColor = {
            type: "v4v",
            value: lighting.color,
            ignoreUIL: !0,
            lightUBO: lightUBO,
            components: 4,
            metalIgnore: !0,
          }),
          (shader.uniforms.lightData = {
            type: "v4v",
            value: lighting.data,
            ignoreUIL: !0,
            lightUBO: lightUBO,
            components: 4,
            metalIgnore: !0,
          }),
          (shader.uniforms.lightData2 = {
            type: "v4v",
            value: lighting.data2,
            ignoreUIL: !0,
            lightUBO: lightUBO,
            components: 4,
            metalIgnore: !0,
          }),
          (shader.uniforms.lightData3 = {
            type: "v4v",
            value: lighting.data3,
            ignoreUIL: !0,
            lightUBO: lightUBO,
            components: 4,
            metalIgnore: !0,
          }),
          (shader.uniforms.lightProperties = {
            type: "v4v",
            value: lighting.properties,
            ignoreUIL: !0,
            lightUBO: lightUBO,
            components: 4,
            metalIgnore: !0,
          }),
          updateArrays(shader),
          _this.UBO && !_activeScene.ubo.created && createUBO(shader.uniforms),
          shader.__lighting
        );
      }),
      (this.destroyShader = function (shader) {
        findParentScene(shader.mesh);
        _activeScene.shaders.remove(shader);
      }),
      (this.sort = function (callback) {
        _activeScene.lights.sort(callback);
      }),
      (this.addToShadowGroup = function (light) {
        findParentScene(light).renderShadows.push(light);
      }),
      (this.removeFromShadowGroup = function (light) {
        findParentScene(light);
        _activeScene.renderShadows.remove(light);
      }),
      (this.getShadowLights = function () {
        return _activeScene.renderShadows;
      }),
      (this.getShadowCount = function () {
        return _activeScene.renderShadows.length;
      }),
      (this.initShadowShader = function (object, mesh) {
        let scene,
          shader = object.shader || object;
        if (shader.mesh) {
          let p = shader.mesh._parent;
          for (; p; )
            (p instanceof Scene && p._lightingData && (scene = p._lightingData),
              (p = p._parent));
        }
        if (
          (scene || (scene = _activeScene),
          !World.RENDERER.shadows || 0 == scene.renderShadows.length)
        )
          return "";
        shader._gl || shader.upload();
        let vsName = shader.vsName,
          fsName = "ShadowDepth";
        (shader.customShadowShader && (fsName = shader.customShadowShader),
          (shader.shadow = new Shader(vsName, fsName, {
            receiveLight: shader.receiveLight,
            UILPrefix: shader.UILPrefix,
            precision: "high",
            customCompile: vsName + " " + fsName,
          })),
          shader.vertexShader &&
            (shader.shadow.vertexShader = shader.vertexShader),
          shader.restoreVS && (shader.shadow.vertexShader = shader.restoreVS),
          shader.customCompile &&
            (shader.shadow.customCompile = shader.customCompile + "_shadow"),
          shader.defines &&
            ((shader.shadow.defines = shader.defines),
            shader.shadow.resetProgram()),
          (shader.shadow.lights = shader.lights),
          (shader.shadow.isShadow = !0),
          shader.copyUniformsTo(shader.shadow, !0),
          shader.shadow.upload());
      }),
      (this.getShadowUniforms = function (shader) {
        let scene;
        if (shader.mesh) {
          let p = shader.mesh._parent;
          for (; p; )
            (p instanceof Scene && p._lightingData && (scene = p._lightingData),
              (p = p._parent));
        }
        return (
          scene || (scene = _activeScene),
          World.RENDERER.shadows && 0 != scene.renderShadows.length
            ? [
                `\n#define SHADOW_MAPS ${scene.renderShadows.length}`,
                World.RENDERER.shadows == Renderer.SHADOWS_LOW
                  ? "#define SHADOWS_LOW"
                  : "",
                World.RENDERER.shadows == Renderer.SHADOWS_MED
                  ? "#define SHADOWS_MED"
                  : "",
                World.RENDERER.shadows == Renderer.SHADOWS_HIGH
                  ? "#define SHADOWS_HIGH"
                  : "",
                `uniform sampler2D shadowMap[${scene.renderShadows.length}];`,
                `uniform mat4 shadowMatrix[${scene.renderShadows.length}];`,
                `uniform vec3 shadowLightPos[${scene.renderShadows.length}];`,
                `uniform float shadowSize[${scene.renderShadows.length}];`,
              ].join("\n")
            : ""
        );
      }),
      (this.bindUBO = function (shader) {
        _activeScene.ubo.created && _activeScene.ubo.bind(shader, "lights");
      }),
      (this.fallbackAreaToPointTest = function () {
        return _this.fallbackAreaToPoint;
      }),
      this.get("activeScene", (_) => _activeScene),
      (this.renderShadowsAllowLight = function (object, light) {
        if (!object._renderShadowsAllowLights) {
          let allowed = new WeakMap();
          object._renderShadowsAllowLights = allowed;
          let prevOnBeforeRenderShadow = object.onBeforeRenderShadow;
          object.onBeforeRenderShadow = function (renderLight) {
            let result =
              prevOnBeforeRenderShadow &&
              prevOnBeforeRenderShadow.apply(this, arguments);
            return !allowed.has(renderLight) || result;
          };
        }
        object._renderShadowsAllowLights.set(light.light || light, !0);
      }));
  }, "static"));
class Shadow {
  constructor(light) {
    ((this.light = light),
      (this.camera = new PerspectiveCamera(60, 1, 0.1, 50)),
      (this.target = new Vector3()),
      (this.rt = new RenderTarget(1024, 1024)),
      this.rt.createDepthTexture(),
      (this.enabled = !0),
      (this._size = 1024),
      (this._fov = 60),
      (this._far = 50),
      (this._near = 0.1),
      light.add(this.camera));
  }
  destroy() {
    this.rt.destroy();
  }
  set fov(value) {
    ((this._fov = value),
      (this.camera.fov = value),
      this.camera.updateProjectionMatrix(),
      -1 == value &&
        (this.camera = new OrthographicCamera(-5, 5, 5, -5, 0.1, 50)));
  }
  get fov() {
    return this._fov;
  }
  set area(value) {
    ((this._area = value),
      (this.camera.left = -value),
      (this.camera.right = value),
      (this.camera.top = value),
      (this.camera.bottom = -value),
      this.camera.updateProjectionMatrix());
  }
  get area() {
    return this._area;
  }
  set far(value) {
    ((this._far = value),
      (this.camera.far = value),
      this.camera.updateProjectionMatrix());
  }
  get far() {
    return this._far;
  }
  set near(value) {
    ((this._near = value),
      (this.camera.near = value),
      this.camera.updateProjectionMatrix());
  }
  get near() {
    return this._near;
  }
  set size(value) {
    ((this._size = value), this.rt.setSize(value, value));
  }
  get size() {
    return this._size;
  }
}
class Box2 {
  constructor(min, max) {
    ((this.min = void 0 !== min ? min : new Vector2(1 / 0, 1 / 0)),
      (this.max = void 0 !== max ? max : new Vector2(-1 / 0, -1 / 0)));
  }
  set(min, max) {
    return (this.min.copy(min), this.max.copy(max), this);
  }
  setFromPoints(points) {
    this.makeEmpty();
    for (let i = 0, il = points.length; i < il; i++)
      this.expandByPoint(points[i]);
    return this;
  }
  setFromCenterAndSize(center, size) {
    let v1 = this.V1 || new Vector2();
    this.V1 = v1;
    let halfSize = v1.copy(size).multiplyScalar(0.5);
    return (
      this.min.copy(center).sub(halfSize),
      this.max.copy(center).add(halfSize),
      this
    );
  }
  clone() {
    return new Box2().copy(this);
  }
  copy(box) {
    return (this.min.copy(box.min), this.max.copy(box.max), this);
  }
  makeEmpty() {
    return (
      (this.min.x = this.min.y = 1 / 0),
      (this.max.x = this.max.y = -1 / 0),
      this
    );
  }
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y;
  }
  getCenter(target) {
    return this.isEmpty()
      ? target.set(0, 0)
      : target.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(target) {
    return this.isEmpty()
      ? target.set(0, 0)
      : target.subVectors(this.max, this.min);
  }
  expandByPoint(point) {
    return (this.min.min(point), this.max.max(point), this);
  }
  expandByVector(vector) {
    return (this.min.sub(vector), this.max.add(vector), this);
  }
  expandByScalar(scalar) {
    return (this.min.addScalar(-scalar), this.max.addScalar(scalar), this);
  }
  containsPoint(point) {
    return !(
      point.x < this.min.x ||
      point.x > this.max.x ||
      point.y < this.min.y ||
      point.y > this.max.y
    );
  }
  containsBox(box) {
    return (
      this.min.x <= box.min.x &&
      box.max.x <= this.max.x &&
      this.min.y <= box.min.y &&
      box.max.y <= this.max.y
    );
  }
  getParameter(point, target) {
    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
    );
  }
  intersectsBox(box) {
    return !(
      box.max.x < this.min.x ||
      box.min.x > this.max.x ||
      box.max.y < this.min.y ||
      box.min.y > this.max.y
    );
  }
  clampPoint(point, target) {
    return target.copy(point).clamp(this.min, this.max);
  }
  distanceToPoint(point) {
    let v1 = this.V1 || new Vector2();
    return (
      (this.V1 = v1),
      v1.copy(point).clamp(this.min, this.max).sub(point).length()
    );
  }
  intersect(box) {
    return (this.min.max(box.min), this.max.min(box.max), this);
  }
  union(box) {
    return (this.min.min(box.min), this.max.max(box.max), this);
  }
  translate(offset) {
    return (this.min.add(offset), this.max.add(offset), this);
  }
  equals(box) {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
}
class Box3 {
  constructor(min, max) {
    ((this.min = void 0 !== min ? min : new Vector3(1 / 0, 1 / 0, 1 / 0)),
      (this.max = void 0 !== max ? max : new Vector3(-1 / 0, -1 / 0, -1 / 0)));
  }
  set(min, max) {
    return (this.min.copy(min), this.max.copy(max), this);
  }
  setFromArray(array) {
    let minX = 1 / 0,
      minY = 1 / 0,
      minZ = 1 / 0,
      maxX = -1 / 0,
      maxY = -1 / 0,
      maxZ = -1 / 0;
    for (let i = 0, l = array.length; i < l; i += 3) {
      let x = array[i],
        y = array[i + 1],
        z = array[i + 2];
      (x < minX && (minX = x),
        y < minY && (minY = y),
        z < minZ && (minZ = z),
        x > maxX && (maxX = x),
        y > maxY && (maxY = y),
        z > maxZ && (maxZ = z));
    }
    return (
      this.min.set(minX, minY, minZ),
      this.max.set(maxX, maxY, maxZ),
      this
    );
  }
  setFromBufferAttribute(attribute) {
    let minX = 1 / 0,
      minY = 1 / 0,
      minZ = 1 / 0,
      maxX = -1 / 0,
      maxY = -1 / 0,
      maxZ = -1 / 0;
    for (let i = 0, l = attribute.count; i < l; i++) {
      let x = attribute.array[3 * i + 0],
        y = attribute.array[3 * i + 1],
        z = attribute.array[3 * i + 2];
      (x < minX && (minX = x),
        y < minY && (minY = y),
        z < minZ && (minZ = z),
        x > maxX && (maxX = x),
        y > maxY && (maxY = y),
        z > maxZ && (maxZ = z));
    }
    return (
      this.min.set(minX, minY, minZ),
      this.max.set(maxX, maxY, maxZ),
      this
    );
  }
  setFromPoints(points) {
    this.makeEmpty();
    for (let i = 0, il = points.length; i < il; i++)
      this.expandByPoint(points[i]);
    return this;
  }
  setFromCenterAndSize(center, size) {
    let v1 = this.V1 || new Vector3();
    this.V1 = v1;
    let halfSize = v1.copy(size).multiplyScalar(0.5);
    return (
      this.min.copy(center).sub(halfSize),
      this.max.copy(center).add(halfSize),
      this
    );
  }
  setFromObject(object) {
    return (this.makeEmpty(), this.expandByObject(object));
  }
  clone() {
    return new Box3().copy(this);
  }
  copy(box) {
    return (this.min.copy(box.min), this.max.copy(box.max), this);
  }
  makeEmpty() {
    return (
      (this.min.x = this.min.y = this.min.z = 1 / 0),
      (this.max.x = this.max.y = this.max.z = -1 / 0),
      this
    );
  }
  isEmpty() {
    return (
      this.max.x < this.min.x ||
      this.max.y < this.min.y ||
      this.max.z < this.min.z
    );
  }
  getCenter(target) {
    return this.isEmpty()
      ? target.set(0, 0, 0)
      : target.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(target) {
    return this.isEmpty()
      ? target.set(0, 0, 0)
      : target.subVectors(this.max, this.min);
  }
  expandByPoint(point) {
    return (this.min.min(point), this.max.max(point), this);
  }
  expandByVector(vector) {
    return (this.min.sub(vector), this.max.add(vector), this);
  }
  expandByScalar(scalar) {
    return (this.min.addScalar(-scalar), this.max.addScalar(scalar), this);
  }
  expandByObject(object, local, onlyvisible) {
    let scope,
      i,
      l,
      v1 = this.V1 || new Vector3();
    return (
      (this.V1 = v1),
      (scope = this),
      object.updateMatrixWorld(!0),
      object.traverse((node) => {
        if (onlyvisible && !node.visible) return;
        if (node.isGizmo) return;
        let geometry = node.geometry;
        if (!geometry) return;
        let attribute = geometry.attributes.position;
        if (void 0 !== attribute)
          for (i = 0, l = attribute.count; i < l; i++)
            (v1
              .fromBufferAttribute(attribute, i)
              .applyMatrix4(local ? node.matrix : node.matrixWorld),
              scope.expandByPoint(v1));
      }),
      this
    );
  }
  containsPoint(point) {
    return !(
      point.x < this.min.x ||
      point.x > this.max.x ||
      point.y < this.min.y ||
      point.y > this.max.y ||
      point.z < this.min.z ||
      point.z > this.max.z
    );
  }
  containsBox(box) {
    return (
      this.min.x <= box.min.x &&
      box.max.x <= this.max.x &&
      this.min.y <= box.min.y &&
      box.max.y <= this.max.y &&
      this.min.z <= box.min.z &&
      box.max.z <= this.max.z
    );
  }
  getParameter(point, target) {
    return target.set(
      (point.x - this.min.x) / (this.max.x - this.min.x),
      (point.y - this.min.y) / (this.max.y - this.min.y),
      (point.z - this.min.z) / (this.max.z - this.min.z),
    );
  }
  intersectsBox(box) {
    return !(
      box.max.x < this.min.x ||
      box.min.x > this.max.x ||
      box.max.y < this.min.y ||
      box.min.y > this.max.y ||
      box.max.z < this.min.z ||
      box.min.z > this.max.z
    );
  }
  intersectsSphere(sphere) {
    let closestPoint = this.V1 || new Vector3();
    return (
      (this.V1 = closestPoint),
      this.clampPoint(sphere.center, closestPoint),
      closestPoint.distanceToSquared(sphere.center) <=
        sphere.radius * sphere.radius
    );
  }
  intersectsPlane(plane) {
    let min, max;
    return (
      plane.normal.x > 0
        ? ((min = plane.normal.x * this.min.x),
          (max = plane.normal.x * this.max.x))
        : ((min = plane.normal.x * this.max.x),
          (max = plane.normal.x * this.min.x)),
      plane.normal.y > 0
        ? ((min += plane.normal.y * this.min.y),
          (max += plane.normal.y * this.max.y))
        : ((min += plane.normal.y * this.max.y),
          (max += plane.normal.y * this.min.y)),
      plane.normal.z > 0
        ? ((min += plane.normal.z * this.min.z),
          (max += plane.normal.z * this.max.z))
        : ((min += plane.normal.z * this.max.z),
          (max += plane.normal.z * this.min.z)),
      min <= plane.constant && max >= plane.constant
    );
  }
  intersectsTriangle(triangle) {
    let v0 = this.V0 || new Vector3();
    this.V0 = v0;
    let v1 = this.V1 || new Vector3();
    this.V1 = v1;
    let v2 = this.V2 || new Vector3();
    this.V2 = v2;
    let f0 = this.F0 || new Vector3();
    this.F0 = f0;
    let f1 = this.F1 || new Vector3();
    this.F1 = f1;
    let f2 = this.F2 || new Vector3();
    this.F2 = f2;
    let testAxis = this.V3 || new Vector3();
    this.V3 = testAxis;
    let center = this.V4 || new Vector3();
    this.V4 = center;
    let extents = this.V5 || new Vector3();
    this.V5 = extents;
    let triangleNormal = this.V6 || new Vector3();
    function satForAxes(axes) {
      let i, j;
      for (i = 0, j = axes.length - 3; i <= j; i += 3) {
        testAxis.fromArray(axes, i);
        let r =
            extents.x * Math.abs(testAxis.x) +
            extents.y * Math.abs(testAxis.y) +
            extents.z * Math.abs(testAxis.z),
          p0 = v0.dot(testAxis),
          p1 = v1.dot(testAxis),
          p2 = v2.dot(testAxis);
        if (Math.max(-Math.max(p0, p1, p2), Math.min(p0, p1, p2)) > r)
          return !1;
      }
      return !0;
    }
    if (((this.V6 = triangleNormal), this.isEmpty())) return !1;
    (this.getCenter(center),
      extents.subVectors(this.max, center),
      v0.subVectors(triangle.a, center),
      v1.subVectors(triangle.b, center),
      v2.subVectors(triangle.c, center),
      f0.subVectors(v1, v0),
      f1.subVectors(v2, v1),
      f2.subVectors(v0, v2));
    let axes = [
      0,
      -f0.z,
      f0.y,
      0,
      -f1.z,
      f1.y,
      0,
      -f2.z,
      f2.y,
      f0.z,
      0,
      -f0.x,
      f1.z,
      0,
      -f1.x,
      f2.z,
      0,
      -f2.x,
      -f0.y,
      f0.x,
      0,
      -f1.y,
      f1.x,
      0,
      -f2.y,
      f2.x,
      0,
    ];
    return (
      !!satForAxes(axes) &&
      ((axes = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
      !!satForAxes(axes) &&
        (triangleNormal.crossVectors(f0, f1),
        (axes = [triangleNormal.x, triangleNormal.y, triangleNormal.z]),
        satForAxes(axes)))
    );
  }
  clampPoint(point, target) {
    return target.copy(point).clamp(this.min, this.max);
  }
  distanceToPoint(point) {
    let v1 = this.V1 || new Vector3();
    return (
      (this.V1 = v1),
      v1.copy(point).clamp(this.min, this.max).sub(point).length()
    );
  }
  getBoundingSphere(target = new Sphere()) {
    let v1 = this.V1 || new Vector3();
    return (
      (this.V1 = v1),
      this.getCenter(target.center),
      (target.radius = 0.5 * this.getSize(v1).length()),
      target
    );
  }
  intersect(box) {
    return (
      this.min.max(box.min),
      this.max.min(box.max),
      this.isEmpty() && this.makeEmpty(),
      this
    );
  }
  union(box) {
    return (this.min.min(box.min), this.max.max(box.max), this);
  }
  applyMatrix4(matrix) {
    if (this.isEmpty()) return this;
    let m = matrix.elements,
      xax = m[0] * this.min.x,
      xay = m[1] * this.min.x,
      xaz = m[2] * this.min.x,
      xbx = m[0] * this.max.x,
      xby = m[1] * this.max.x,
      xbz = m[2] * this.max.x,
      yax = m[4] * this.min.y,
      yay = m[5] * this.min.y,
      yaz = m[6] * this.min.y,
      ybx = m[4] * this.max.y,
      yby = m[5] * this.max.y,
      ybz = m[6] * this.max.y,
      zax = m[8] * this.min.z,
      zay = m[9] * this.min.z,
      zaz = m[10] * this.min.z,
      zbx = m[8] * this.max.z,
      zby = m[9] * this.max.z,
      zbz = m[10] * this.max.z;
    return (
      (this.min.x =
        Math.min(xax, xbx) + Math.min(yax, ybx) + Math.min(zax, zbx) + m[12]),
      (this.min.y =
        Math.min(xay, xby) + Math.min(yay, yby) + Math.min(zay, zby) + m[13]),
      (this.min.z =
        Math.min(xaz, xbz) + Math.min(yaz, ybz) + Math.min(zaz, zbz) + m[14]),
      (this.max.x =
        Math.max(xax, xbx) + Math.max(yax, ybx) + Math.max(zax, zbx) + m[12]),
      (this.max.y =
        Math.max(xay, xby) + Math.max(yay, yby) + Math.max(zay, zby) + m[13]),
      (this.max.z =
        Math.max(xaz, xbz) + Math.max(yaz, ybz) + Math.max(zaz, zbz) + m[14]),
      this
    );
  }
  translate(offset) {
    return (this.min.add(offset), this.max.add(offset), this);
  }
  equals(box) {
    return box.min.equals(this.min) && box.max.equals(this.max);
  }
  setFromBufferAttribute(attribute) {
    let minX = 1 / 0,
      minY = 1 / 0,
      minZ = 1 / 0,
      maxX = -1 / 0,
      maxY = -1 / 0,
      maxZ = -1 / 0;
    for (let i = 0, l = attribute.count; i < l; i++) {
      let x = attribute.array[3 * i + 0],
        y = attribute.array[3 * i + 1],
        z = attribute.array[3 * i + 2];
      (x < minX && (minX = x),
        y < minY && (minY = y),
        z < minZ && (minZ = z),
        x > maxX && (maxX = x),
        y > maxY && (maxY = y),
        z > maxZ && (maxZ = z));
    }
    return (
      this.min.set(minX, minY, minZ),
      this.max.set(maxX, maxY, maxZ),
      this
    );
  }
}
