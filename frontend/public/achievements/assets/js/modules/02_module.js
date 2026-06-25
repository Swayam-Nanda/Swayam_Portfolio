class Geometry {
  constructor() {
    ((this.attributes = Geometry.createAttributes(this)),
      (this.drawRange = { start: 0, end: 0 }),
      (this.boundingBox = null),
      (this.boundingSphere = null),
      (this.index = null),
      (this.maxInstancedCount = void 0),
      (this.keepAlive = !1),
      (this.id = Utils.timestamp()));
  }
  draw(mesh, shader, isQuery = !1) {
    Geometry.renderer.draw(this, mesh, shader, isQuery);
  }
  upload(mesh, shader) {
    Geometry.renderer.upload(this, mesh, shader);
  }
  destroy(mesh) {
    this.keepAlive || Geometry.renderer.destroy(this, mesh);
  }
  addAttribute(name, attribute) {
    (attribute.meshPerAttribute >= 1 &&
      ((this.isInstanced = !0), (this.maxInstancedCount = attribute.count)),
      (this.attributes[name] = attribute));
  }
  setIndex(attribute) {
    this.index = attribute.array || attribute;
  }
  toNonIndexed() {
    let geometry2 = new Geometry(),
      indices = this.index,
      attributes = this.attributes;
    for (let name in attributes) {
      let attribute = attributes[name],
        array = attribute.array,
        itemSize = attribute.itemSize,
        array2 = new array.constructor(indices.length * itemSize),
        index = 0,
        index2 = 0;
      for (let i = 0, l = indices.length; i < l; i++) {
        index = indices[i] * itemSize;
        for (let j = 0; j < itemSize; j++) array2[index2++] = array[index++];
      }
      geometry2.addAttribute(name, new GeometryAttribute(array2, itemSize));
    }
    return geometry2;
  }
  normalizeNormals() {
    let vector = this._V1 || new Vector3();
    this._V1 = vector;
    let x,
      y,
      z,
      normals = this.attributes.normal;
    for (let i = 0, il = normals.count; i < il; i++)
      ((x = 3 * i + 0),
        (y = 3 * i + 1),
        (z = 3 * i + 2),
        (vector.x = normals.array[x]),
        (vector.y = normals.array[y]),
        (vector.z = normals.array[z]),
        vector.normalize(),
        (normals.array[x] = vector.x),
        (normals.array[y] = vector.y),
        (normals.array[z] = vector.z));
  }
  computeFaceNormals() {
    let cb = new Vector3(),
      ab = new Vector3();
    for (let f = 0, fl = this.faces.length; f < fl; f++) {
      let face = this.faces[f],
        vA = this.vertices[face.a],
        vB = this.vertices[face.b],
        vC = this.vertices[face.c];
      (cb.subVectors(vC, vB),
        ab.subVectors(vA, vB),
        cb.cross(ab),
        cb.normalize(),
        face.normal.copy(cb));
    }
  }

  computeVertexNormals() {
    let index = this.index,
      attributes = this.attributes,
      groups = this.groups || [];
    if (attributes.position) {
      let positions = attributes.position.array;
      if (void 0 === attributes.normal)
        this.addAttribute(
          "normal",
          new GeometryAttribute(new Float32Array(positions.length), 3),
        );
      else {
        let array = attributes.normal.array;
        for (let i = 0, il = array.length; i < il; i++) array[i] = 0;
      }
      let vA,
        vB,
        vC,
        normals = attributes.normal.array,
        pA = new Vector3(),
        pB = new Vector3(),
        pC = new Vector3(),
        cb = new Vector3(),
        ab = new Vector3();
      if (index) {
        let indices = index.array;
        0 === groups.length && this.addGroup(0, indices.length);
        for (let j = 0, jl = groups.length; j < jl; ++j) {
          let group = groups[j],
            start = group.start;
          for (let i = start, il = start + group.count; i < il; i += 3)
            ((vA = 3 * indices[i + 0]),
              (vB = 3 * indices[i + 1]),
              (vC = 3 * indices[i + 2]),
              pA.fromArray(positions, vA),
              pB.fromArray(positions, vB),
              pC.fromArray(positions, vC),
              cb.subVectors(pC, pB),
              ab.subVectors(pA, pB),
              cb.cross(ab),
              (normals[vA] += cb.x),
              (normals[vA + 1] += cb.y),
              (normals[vA + 2] += cb.z),
              (normals[vB] += cb.x),
              (normals[vB + 1] += cb.y),
              (normals[vB + 2] += cb.z),
              (normals[vC] += cb.x),
              (normals[vC + 1] += cb.y),
              (normals[vC + 2] += cb.z));
        }
      } else
        for (let i = 0, il = positions.length; i < il; i += 9)
          (pA.fromArray(positions, i),
            pB.fromArray(positions, i + 3),
            pC.fromArray(positions, i + 6),
            cb.subVectors(pC, pB),
            ab.subVectors(pA, pB),
            cb.cross(ab),
            (normals[i] = cb.x),
            (normals[i + 1] = cb.y),
            (normals[i + 2] = cb.z),
            (normals[i + 3] = cb.x),
            (normals[i + 4] = cb.y),
            (normals[i + 5] = cb.z),
            (normals[i + 6] = cb.x),
            (normals[i + 7] = cb.y),
            (normals[i + 8] = cb.z));
      (this.normalizeNormals(), (attributes.normal.needsUpdate = !0));
    }
  }
  computeBoundingBox() {
    this.boundingBox || (this.boundingBox = new Box3());
    let position = this.attributes.position;
    position
      ? this.boundingBox.setFromBufferAttribute(position)
      : this.boundingBox.makeEmpty();
  }
  computeBoundingSphere() {
    let box = new Box3(),
      vector = new Vector3();
    this.boundingSphere || (this.boundingSphere = new Sphere());
    let position = this.attributes.position;
    if (position) {
      let center = this.boundingSphere.center;
      (box.setFromBufferAttribute(position), box.getCenter(center));
      let maxRadiusSq = 0;
      for (let i = 0, il = position.count; i < il; i++)
        ((vector.x = position.array[3 * i + 0]),
          (vector.y = position.array[3 * i + 1]),
          (vector.z = position.array[3 * i + 2]),
          (maxRadiusSq = Math.max(
            maxRadiusSq,
            center.distanceToSquared(vector),
          )));
      ((this.boundingSphere.radius = Math.sqrt(maxRadiusSq)),
        isNaN(this.boundingSphere.radius) &&
          console.error(
            "Bounding Sphere came up NaN, broken position buffer.",
            this,
          ));
    }
  }
  merge(geometry) {
    let Float32ArrayConcat = (first, second) => {
        let firstLength = first.length,
          result = new Float32Array(firstLength + second.length);
        return (result.set(first), result.set(second, firstLength), result);
      },
      attributes = this.attributes;
    if (this.index) {
      let indices = geometry.index,
        offset = attributes.position.count;
      for (let i = 0, il = indices.length; i < il; i++)
        indices[i] = offset + indices[i];
      this.index = ((first, second) => {
        let firstLength = first.length,
          result = new (
            Geometry.arrayNeedsUint32(second) ? Uint32Array : Uint16Array
          )(firstLength + second.length);
        return (result.set(first), result.set(second, firstLength), result);
      })(this.index, indices);
    }
    for (let key in attributes)
      void 0 !== geometry.attributes[key] &&
        ((attributes[key].array = Float32ArrayConcat(
          attributes[key].array,
          geometry.attributes[key].array,
        )),
        (attributes[key].count =
          attributes[key].array.length / attributes[key].itemSize));
    return this;
  }
  clone(noCopy) {
    return new Geometry().copy(this, noCopy);
  }
  copy(source, noCopy) {
    ((this.index = null),
      (this.boundingBox = null),
      (this.boundingSphere = null),
      (this.index = source.index));
    let attributes = source.attributes;
    for (let name in attributes)
      this.addAttribute(name, attributes[name].clone(noCopy));
    let boundingBox = source.boundingBox;
    boundingBox &&
      boundingBox.clone &&
      (this.boundingBox = boundingBox.clone());
    let boundingSphere = source.boundingSphere;
    return (
      boundingSphere &&
        boundingSphere.clone &&
        (this.boundingSphere = boundingSphere.clone()),
      this
    );
  }
  center() {
    let offset = new Vector3();
    return (
      this.computeBoundingBox(),
      this.boundingBox.getCenter(offset).negate(),
      this.applyMatrix(
        new Matrix4().makeTranslation(offset.x, offset.y, offset.z),
      ),
      this
    );
  }
  applyMatrix(matrix) {
    let position = this.attributes.position;
    position &&
      (matrix.applyToBufferAttribute(position), (position.needsUpdate = !0));
    let normal = this.attributes.normal;
    if (normal) {
      (new Matrix3().getNormalMatrix(matrix).applyToBufferAttribute(normal),
        (normal.needsUpdate = !0));
    }
    return (
      this.boundingBox && this.computeBoundingBox(),
      this.boundingSphere && this.computeBoundingSphere(),
      this
    );
  }
  scale(x, y, z) {
    this.applyMatrix(new Matrix4().makeScale(x, y, z));
  }
  setFromPoints(points) {
    let position = [];
    for (let i = 0, l = points.length; i < l; i++) {
      let point = points[i];
      position.push(point.x, point.y, point.z || 0);
    }
    return (
      this.addAttribute(
        "position",
        new GeometryAttribute(new Float32Array(position), 3),
      ),
      this
    );
  }
  instanceFrom(geom) {
    return geom.clone();
  }
  uploadBuffersAsync() {
    return Geometry.renderer.uploadBuffersAsync(this);
  }
  toJSON() {
    let props = {};
    this.index && (props.index = Array.from(this.index));
    for (let key in this.attributes)
      props[key] = Array.from(this.attributes[key].array);
    return JSON.stringify(props);
  }
}
class GeometryAttribute {
  constructor(_array, _itemSize, _meshPerAttribute, _dynamic = !1) {
    ((this.array = _array),
      (this.itemSize = _itemSize),
      (this.count = void 0 !== _array ? _array.length / _itemSize : 0),
      (this.dynamic = _dynamic),
      (this.updateRange = { offset: 0, count: -1 }),
      (this.meshPerAttribute = _meshPerAttribute));
  }
  setArray(array) {
    let newCount = void 0 !== array ? array.length / this.itemSize : 0;
    (newCount != this.count && (this.needsNewBuffer = !0),
      (this.array = array),
      (this.count = newCount),
      (this.needsUpdate = !0));
  }
  clone(noCopy) {
    return noCopy
      ? this
      : new GeometryAttribute(
          new Float32Array(this.array),
          this.itemSize,
          this.meshPerAttribute,
        );
  }
  getX(index) {
    return this.array[index * this.itemSize];
  }
  setX(index, x) {
    return ((this.array[index * this.itemSize] = x), this);
  }
  getY(index) {
    return this.array[index * this.itemSize + 1];
  }
  setY(index, y) {
    return ((this.array[index * this.itemSize + 1] = y), this);
  }
  getZ(index) {
    return this.array[index * this.itemSize + 2];
  }
  setZ(index, z) {
    return ((this.array[index * this.itemSize + 2] = z), this);
  }
  getW(index) {
    return this.array[index * this.itemSize + 3];
  }
  setW(index, w) {
    return ((this.array[index * this.itemSize + 3] = w), this);
  }
  setXY(index, x, y) {
    return (
      (index *= this.itemSize),
      (this.array[index + 0] = x),
      (this.array[index + 1] = y),
      this
    );
  }
  setXYZ(index, x, y, z) {
    return (
      (index *= this.itemSize),
      (this.array[index + 0] = x),
      (this.array[index + 1] = y),
      (this.array[index + 2] = z),
      this
    );
  }
  setXYZW(index, x, y, z, w) {
    return (
      (index *= this.itemSize),
      (this.array[index + 0] = x),
      (this.array[index + 1] = y),
      (this.array[index + 2] = z),
      (this.array[index + 3] = w),
      this
    );
  }
}
class InterleavedBuffer {
  constructor(array, stride) {
    ((this.array = array),
      (this.stride = stride),
      (this.count = array ? array.length / stride : 0),
      (this.isInterleaved = !0),
      (this.needsUpdate = !1),
      (this.dynamic = !1),
      (this.updateRange = { offset: 0, count: -1 }));
  }
}
class InterleavedGeometryAttribute {
  constructor(interleavedBuffer, itemSize, offset) {
    ((this.data = interleavedBuffer),
      (this.itemSize = itemSize),
      (this.offset = offset),
      (this.isInterleaved = !0));
  }
}
class Group extends Base3D {
  constructor() {
    (super(), (this.isGroup = !0), (this._occlusionMesh = null));
  }
  generateOcclusionMesh() {
    this._bbVertices = [];
    for (let i = 0; i < 8; i++) this._bbVertices.push(new Vector3());
    if (!this.occlusionCulled) {
      this.occlusionCulled = !0;
      let occShader = new Shader("OcclusionMaterial", {
        bbMin: { value: new Vector3(0, 0, 0) },
        bbMax: { value: new Vector3(1, 1, 1) },
      });
      occShader.wireframe = !0;
      let _occlusionMesh = new Mesh(World.BOX, occShader);
      ((_occlusionMesh.occlusionCulled = !0),
        (_occlusionMesh._occlusionGroup = this),
        (_occlusionMesh.renderOrder = -1e3),
        (_occlusionMesh.hideByOcclusion = !0),
        (_occlusionMesh._occlusionMesh.renderOrder = 1e3),
        this.add(_occlusionMesh),
        (this._occlusionMesh = _occlusionMesh),
        (this.bb = new Box3()));
    }
  }
  updateOcclusionBoundingBox() {
    this.bb.makeEmpty();
    const _this = this;
    (_this.children.forEach((child) => {
      if (void 0 === child._occlusionGroup) {
        child.updateOcclusionMesh();
        let bb = child._geometry.boundingBox,
          m = bb.min,
          M = bb.max;
        (_this._bbVertices[0].set(m.x, m.y, m.z),
          _this._bbVertices[1].set(m.x, m.y, M.z),
          _this._bbVertices[2].set(m.x, M.y, m.z),
          _this._bbVertices[3].set(M.x, m.y, m.z),
          _this._bbVertices[4].set(M.x, M.y, m.z),
          _this._bbVertices[5].set(M.x, m.y, M.z),
          _this._bbVertices[6].set(m.x, M.y, M.z),
          _this._bbVertices[7].set(M.x, M.y, M.z),
          _this._bbVertices.forEach((vertex) => {
            (vertex.applyMatrix4(child.matrix),
              (_this.bb.min.x = Math.min(_this.bb.min.x, vertex.x)),
              (_this.bb.min.y = Math.min(_this.bb.min.y, vertex.y)),
              (_this.bb.min.z = Math.min(_this.bb.min.z, vertex.z)),
              (_this.bb.max.x = Math.max(_this.bb.max.x, vertex.x)),
              (_this.bb.max.y = Math.max(_this.bb.max.y, vertex.y)),
              (_this.bb.max.z = Math.max(_this.bb.max.z, vertex.z)));
          }));
      }
    }),
      this._occlusionMesh?.shader?.set("bbMin", this.bb.min),
      this._occlusionMesh?.shader?.set("bbMax", this.bb.max),
      this._occlusionMesh?._occlusionMesh?.shader?.set(
        "bbMin",
        this.bb.min.add(new Vector3(-0.01, -0.01, -0.01)),
      ),
      this._occlusionMesh?._occlusionMesh?.shader?.set(
        "bbMax",
        this.bb.max.add(new Vector3(0.01, 0.01, 0.01)),
      ),
      this._occlusionMesh.position.copy(
        this.bb.max.clone().add(this.bb.min).multiplyScalar(0.5),
      ));
  }
  updateOcclusionVisibility(doHide) {
    this.children.forEach((child) => {
      void 0 === child._occlusionGroup && (child.hideByOcclusion = doHide);
    });
  }
}
class BaseLight extends Base3D {
  constructor(color = 16777215, intensity = 1, distance = 9999) {
    (super(),
      (this.color = new Color(color)),
      (this.data = new Vector4()),
      (this.data2 = new Vector4()),
      (this.data3 = new Vector4()),
      (this.properties = new Vector4(intensity, distance, 0, 0)));
  }
  destroy() {
    this.shadow &&
      (Lighting.removeFromShadowGroup(this), this.shadow.destroy());
  }
  prepareRender() {
    (this.shadow.camera.position.copy(this.position),
      this.shadow.camera.lookAt(this.shadow.target));
  }
  set castShadow(bool) {
    (this.shadow || bool) &&
      (this.shadow || (this.shadow = new Shadow(this)),
      (this.shadow.enabled = bool),
      this.silentShadow ||
        (bool
          ? Lighting.addToShadowGroup(this)
          : Lighting.removeFromShadowGroup(this)));
  }
  set intensity(v) {
    this.properties.x = v;
  }
  get intensity() {
    return this.properties.x;
  }
  set distance(v) {
    this.properties.y = v;
  }
  get distance() {
    return this.properties.y;
  }
  set bounce(v) {
    this.properties.z = v;
  }
  get bounce() {
    return this.properties.z;
  }
}
class Line extends Base3D {
  constructor(geometry, shader) {
    (super(),
      (this.geometry = geometry),
      (this.shader = shader),
      (this.isLine = !0),
      (this.id = Renderer.ID++));
  }
  clone() {
    return new Line(this.geometry, this.shader).copy(this);
  }
}
class Mesh extends Base3D {
  constructor(geometry, shader, isQuery = !1) {
    (super(),
      shader || window.THREAD || (shader = new Shader("TestMaterial")),
      (this._geometry = geometry),
      (this._shader = shader && shader.shader ? shader.shader : shader),
      (this.isMesh = !0));
    if (
      ((this.occlusionMesh = null),
      !isQuery && !window.THREAD && Renderer.useOcclusionQuery)
    ) {
      let occShader = new Shader("OcclusionMaterial", {
        bbMin: { value: new Vector3() },
        bbMax: { value: new Vector3() },
      });
      occShader.side = Shader.DOUBLE_SIDE;
      let _occlusionMesh = new Mesh(World.BOX, occShader, !0);
      ((_occlusionMesh.occlusionCulled = !1),
        (_occlusionMesh.doNotProject = !0),
        (_occlusionMesh._queryMesh = this),
        (_occlusionMesh.isOcclusionMesh = !0),
        this.add(_occlusionMesh),
        (this._occlusionMesh = _occlusionMesh),
        (this._occlusionDirty = !0));
    }
    ((this.id = Utils.timestamp()), shader && (this._shader.mesh = this));
  }
  clone() {
    return new Mesh(this._geometry, this.shader).copy(this);
  }
  set geometry(g) {
    (Geometry.renderer.resetMeshGeom(this), (this._geometry = g));
  }
  get geometry() {
    return this._geometry;
  }
  set shader(shader) {
    this._shader = shader && shader.shader ? shader.shader : shader;
  }
  get shader() {
    return this._shader;
  }
  isInsideOf(mesh) {
    return (
      this.box3 || (this.box3 = new Box3()),
      this.box3.setFromObject(this),
      mesh.isMeshInside(this)
    );
  }
  isMeshInside(mesh) {
    return (
      this.box3 || (this.box3 = new Box3()),
      this.box3.setFromObject(this),
      mesh.box3.intersectsBox(this.box3)
    );
  }
  updateOcclusionMesh(force) {
    if (
      this.occlusionCulled &&
      !Renderer.useOcclusionQuery &&
      (this._occlusionDirty || force)
    ) {
      this._geometry.computeBoundingBox();
      let bb = this._geometry.boundingBox;
      (this._occlusionMesh?.shader?.set(
        "bbMin",
        bb.min.add(new Vector3(-0.01, -0.01, -0.01)),
      ),
        this._occlusionMesh?.shader?.set(
          "bbMax",
          bb.max.add(new Vector3(0.01, 0.01, 0.01)),
        ),
        (this._occlusionMesh.renderOrder = this.renderOrder + 1e3),
        (this._occlusionDirty = !1));
    }
  }
}
class Points extends Base3D {
  constructor(geometry, shader) {
    (super(),
      (this._geometry = geometry),
      (this.shader = shader),
      (this.isPoints = !0),
      (this.id = Renderer.ID++),
      shader && (this.shader.mesh = this));
  }
  clone() {
    return new Points(this._geometry, this.shader).copy(this);
  }
  set geometry(g) {
    (Geometry.renderer.resetMeshGeom(this), (this._geometry = g));
  }
  get geometry() {
    return this._geometry;
  }
}
class Scene extends Base3D {
  constructor() {
    (super(),
      (this.autoUpdate = !0),
      (this.toRender = [[], []]),
      (this._displayNeedsUpdate = !0),
      (this.isScene = !0),
      (this.changes = []));
  }
  set displayNeedsUpdate(v) {
    (!0 === v && this.changes.forEach((cb) => cb()),
      (this._displayNeedsUpdate = v));
  }
  get displayNeedsUpdate() {
    return this._displayNeedsUpdate;
  }
  bindSceneChange(cb) {
    this.changes.push(cb);
  }
}
(Class(function FBORendererWebGL(_gl) {
  const WEBGL2 = Renderer.type == Renderer.WEBGL2;
  let _maxSamples = WEBGL2 && _gl.getParameter(_gl.MAX_SAMPLES);
  const {
    getFormat: getFormat,
    getInternalFormat: getInternalFormat,
    getProperty: getProperty,
    getType: getType,
    getFloatParams: getFloatParams,
  } = require("GLTypes");
  function prepareTexture(texture) {
    ((texture._gl = _gl.createTexture()),
      _gl.bindTexture(_gl.TEXTURE_2D, texture._gl),
      _gl.texParameteri(
        _gl.TEXTURE_2D,
        _gl.TEXTURE_WRAP_S,
        getProperty(texture.wrapS),
      ),
      _gl.texParameteri(
        _gl.TEXTURE_2D,
        _gl.TEXTURE_WRAP_T,
        getProperty(texture.wrapT),
      ),
      _gl.texParameteri(
        _gl.TEXTURE_2D,
        _gl.TEXTURE_MAG_FILTER,
        getProperty(texture.magFilter),
      ),
      _gl.texParameteri(
        _gl.TEXTURE_2D,
        _gl.TEXTURE_MIN_FILTER,
        getProperty(texture.minFilter),
      ),
      (texture.needsUpdate = !1));
  }
  function texImageDB(rt, texture) {
    if (texture.type.includes("float")) {
      let {
        internalformat: internalformat,
        format: format,
        type: type,
      } = getFloatParams(texture);
      _gl.texImage2D(
        _gl.TEXTURE_2D,
        0,
        internalformat,
        rt.width,
        rt.height,
        0,
        format,
        type,
        null,
      );
    } else
      _gl.texImage2D(
        _gl.TEXTURE_2D,
        0,
        getFormat(texture),
        rt.width,
        rt.height,
        0,
        getFormat(texture),
        getType(texture),
        null,
      );
    _gl.bindTexture(_gl.TEXTURE_2D, null);
  }
  function getRenderBufferInternalFormat(texture) {
    return texture.type.includes("float")
      ? getFloatParams(texture).internalformat
      : getInternalFormat(texture);
  }
  ((this.upload = function (rt) {
    if (!rt._gl) {
      if (rt.cube)
        return (function uploadCube(rt) {
          ((rt._gl = _gl.createFramebuffer()),
            _gl.bindFramebuffer(_gl.FRAMEBUFFER, rt._gl));
          let texture = rt.texture;
          ((texture._gl = _gl.createTexture()),
            (texture.cube = !0),
            (texture.needsUpdate = !1),
            _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, texture._gl));
          for (let i = 0; i < 6; i++)
            _gl.texImage2D(
              _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
              0,
              getFormat(texture),
              rt.width,
              rt.height,
              0,
              getFormat(texture),
              _gl.UNSIGNED_BYTE,
              null,
            );
          (_gl.texParameteri(
            _gl.TEXTURE_CUBE_MAP,
            _gl.TEXTURE_WRAP_S,
            getProperty(texture.wrapS),
          ),
            _gl.texParameteri(
              _gl.TEXTURE_CUBE_MAP,
              _gl.TEXTURE_WRAP_T,
              getProperty(texture.wrapT),
            ),
            _gl.texParameteri(
              _gl.TEXTURE_CUBE_MAP,
              _gl.TEXTURE_MAG_FILTER,
              getProperty(texture.magFilter),
            ),
            _gl.texParameteri(
              _gl.TEXTURE_CUBE_MAP,
              _gl.TEXTURE_MIN_FILTER,
              getProperty(texture.minFilter),
            ),
            (rt._depthBuffer = _gl.createRenderbuffer()),
            _gl.bindRenderbuffer(_gl.RENDERBUFFER, rt._depthBuffer),
            _gl.renderbufferStorage(
              _gl.RENDERBUFFER,
              _gl.DEPTH_COMPONENT16,
              rt.width,
              rt.height,
            ),
            _gl.framebufferRenderbuffer(
              _gl.FRAMEBUFFER,
              _gl.DEPTH_ATTACHMENT,
              _gl.RENDERBUFFER,
              rt._depthBuffer,
            ),
            _gl.bindFramebuffer(_gl.FRAMEBUFFER, null),
            _gl.bindTexture(_gl.TEXTURE_2D, null),
            _gl.bindRenderbuffer(_gl.RENDERBUFFER, null));
        })(rt);
      if (rt.texture.isTexture3D)
        return (function upload3DTexture(rt) {
          rt.texture.upload();
          let colorAttachments = [];
          ((rt._gl = _gl.createFramebuffer()),
            _gl.bindFramebuffer(_gl.FRAMEBUFFER, rt._gl));
          for (let i = 0; i < rt.indices.length; i++) {
            let key = "COLOR_ATTACHMENT" + i;
            (colorAttachments.push(_gl[key]),
              _gl.framebufferTextureLayer(
                _gl.FRAMEBUFFER,
                _gl[key],
                rt.texture._gl,
                0,
                rt.indices[i],
              ));
          }
          (_gl.drawBuffers(colorAttachments),
            _gl.bindFramebuffer(_gl.FRAMEBUFFER, null));
        })(rt);
      if (((rt._gl = _gl.createFramebuffer()), !rt.depth && !rt.disableDepth))
        if (
          ((rt._depthBuffer = _gl.createRenderbuffer()),
          _gl.bindRenderbuffer(_gl.RENDERBUFFER, rt._depthBuffer),
          rt.internalMultisample)
        ) {
          let samples = Math.min(_maxSamples, rt._samplesAmount);
          _gl.renderbufferStorageMultisample(
            _gl.RENDERBUFFER,
            samples,
            rt.stencil ? _gl.DEPTH24_STENCIL8 : _gl.DEPTH_COMPONENT24,
            rt.width,
            rt.height,
          );
        } else
          _gl.renderbufferStorage(
            _gl.RENDERBUFFER,
            rt.stencil
              ? WEBGL2
                ? _gl.DEPTH24_STENCIL8
                : _gl.DEPTH_STENCIL
              : WEBGL2
                ? _gl.DEPTH_COMPONENT24
                : _gl.DEPTH_COMPONENT16,
            rt.width,
            rt.height,
          );
      if (
        (RenderCount.add(
          `fbo_${Math.round(rt.width)}x${Math.round(rt.height)}`,
          rt,
        ),
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, rt._gl),
        rt.multi)
      )
        if (WEBGL2) {
          let colorAttachments = [];
          for (let i = 0; i < rt.attachments.length; i++) {
            let key = "COLOR_ATTACHMENT" + i,
              texture = rt.attachments[i];
            (colorAttachments.push(_gl[key]),
              prepareTexture(texture),
              texImageDB(rt, texture),
              _gl.framebufferTexture2D(
                _gl.FRAMEBUFFER,
                _gl[key],
                _gl.TEXTURE_2D,
                texture._gl,
                0,
              ),
              rt.multisample &&
                i > 0 &&
                ((texture._blitFramebuffer = _gl.createFramebuffer()),
                _gl.bindFramebuffer(_gl.FRAMEBUFFER, texture._blitFramebuffer),
                _gl.framebufferTexture2D(
                  _gl.FRAMEBUFFER,
                  _gl.COLOR_ATTACHMENT0,
                  _gl.TEXTURE_2D,
                  texture._gl,
                  0,
                )));
          }
          _gl.drawBuffers(colorAttachments);
        } else {
          let ext = Renderer.extensions.drawBuffers,
            colorAttachments = [];
          for (let i = 0; i < rt.attachments.length; i++) {
            let key = "COLOR_ATTACHMENT" + i + "_WEBGL",
              texture = rt.attachments[i];
            (colorAttachments.push(ext[key]),
              prepareTexture(texture),
              texImageDB(rt, texture),
              _gl.framebufferTexture2D(
                _gl.FRAMEBUFFER,
                ext[key],
                _gl.TEXTURE_2D,
                texture._gl,
                0,
              ));
          }
          ext.drawBuffersWEBGL(colorAttachments);
        }
      else if (rt.internalMultisample) {
        let samples = Math.min(_maxSamples, rt._samplesAmount);
        if (rt.parent.multi) {
          let colorAttachments = [],
            attachments = rt.parent.attachments;
          for (let i = 0; i < attachments.length; i++) {
            let key = "COLOR_ATTACHMENT" + i,
              texture = attachments[i];
            (colorAttachments.push(_gl[key]),
              (texture._colorBuffer = _gl.createRenderbuffer()),
              _gl.bindRenderbuffer(_gl.RENDERBUFFER, texture._colorBuffer),
              _gl.renderbufferStorageMultisample(
                _gl.RENDERBUFFER,
                samples,
                getRenderBufferInternalFormat(texture),
                rt.width,
                rt.height,
              ),
              _gl.framebufferRenderbuffer(
                _gl.FRAMEBUFFER,
                _gl[key],
                _gl.RENDERBUFFER,
                texture._colorBuffer,
              ),
              _gl.bindRenderbuffer(_gl.RENDERBUFFER, null));
          }
          _gl.drawBuffers(colorAttachments);
        } else
          ((rt._colorBuffer = _gl.createRenderbuffer()),
            _gl.bindRenderbuffer(_gl.RENDERBUFFER, rt._colorBuffer),
            _gl.renderbufferStorageMultisample(
              _gl.RENDERBUFFER,
              samples,
              getRenderBufferInternalFormat(rt.texture),
              rt.width,
              rt.height,
            ),
            _gl.framebufferRenderbuffer(
              _gl.FRAMEBUFFER,
              _gl.COLOR_ATTACHMENT0,
              _gl.RENDERBUFFER,
              rt._colorBuffer,
            ));
      } else {
        if ((prepareTexture(rt.texture), rt.texture.type.includes("float"))) {
          let {
            internalformat: internalformat,
            format: format,
            type: type,
          } = getFloatParams(rt.texture);
          _gl.texImage2D(
            _gl.TEXTURE_2D,
            0,
            internalformat,
            rt.width,
            rt.height,
            0,
            format,
            type,
            null,
          );
        } else
          _gl.texImage2D(
            _gl.TEXTURE_2D,
            0,
            getFormat(rt.texture),
            rt.width,
            rt.height,
            0,
            getFormat(rt.texture),
            getType(rt.texture),
            null,
          );
        _gl.framebufferTexture2D(
          _gl.FRAMEBUFFER,
          _gl.COLOR_ATTACHMENT0,
          _gl.TEXTURE_2D,
          rt.texture._gl,
          0,
        );
      }
      if (rt.depth) {
        prepareTexture(rt.depth);
        let iformat = rt.stencil
            ? WEBGL2
              ? _gl.DEPTH24_STENCIL8
              : _gl.DEPTH_STENCIL
            : WEBGL2
              ? _gl.DEPTH_COMPONENT24
              : _gl.DEPTH_COMPONENT,
          type = rt.stencil
            ? WEBGL2
              ? _gl.UNSIGNED_INT_24_8
              : Renderer.extensions.depthTextures.UNSIGNED_INT_24_8_WEBGL
            : _gl.UNSIGNED_INT;
        (_gl.texImage2D(
          _gl.TEXTURE_2D,
          0,
          iformat,
          rt.width,
          rt.height,
          0,
          rt.stencil ? _gl.DEPTH_STENCIL : _gl.DEPTH_COMPONENT,
          type,
          null,
        ),
          _gl.framebufferTexture2D(
            _gl.FRAMEBUFFER,
            rt.stencil ? _gl.DEPTH_STENCIL_ATTACHMENT : _gl.DEPTH_ATTACHMENT,
            _gl.TEXTURE_2D,
            rt.depth._gl,
            0,
          ));
      } else
        rt.disableDepth ||
          (rt.internalMultisample,
          _gl.framebufferRenderbuffer(
            _gl.FRAMEBUFFER,
            rt.stencil ? _gl.DEPTH_STENCIL_ATTACHMENT : _gl.DEPTH_ATTACHMENT,
            _gl.RENDERBUFFER,
            rt._depthBuffer,
          ));
      (_gl.bindFramebuffer(_gl.FRAMEBUFFER, null),
        _gl.bindTexture(_gl.TEXTURE_2D, null),
        _gl.bindRenderbuffer(_gl.RENDERBUFFER, null));
    }
  }),
    (this.bind = function (rt) {
      (rt._gl || this.upload(rt),
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, rt._gl),
        rt.cube &&
          _gl.framebufferTexture2D(
            _gl.FRAMEBUFFER,
            _gl.COLOR_ATTACHMENT0,
            _gl.TEXTURE_CUBE_MAP_POSITIVE_X + rt.activeFace,
            rt.texture._gl,
            0,
          ),
        rt.scissor &&
          (_gl.enable(_gl.SCISSOR_TEST),
          _gl.scissor(
            rt.scissor.x,
            rt.scissor.y,
            rt.scissor.width,
            rt.scissor.height,
          )),
        _gl.viewport(rt.viewport.x, rt.viewport.y, rt.width, rt.height),
        rt.customViewport &&
          _gl.viewport(
            rt.customViewport.x,
            rt.customViewport.y,
            rt.customViewport.z,
            rt.customViewport.w,
          ),
        Renderer.instance.autoClear &&
          (_gl.clearColor(
            Renderer.CLEAR[0],
            Renderer.CLEAR[1],
            Renderer.CLEAR[2],
            Renderer.CLEAR[3],
          ),
          rt.sharedRenderbuffer
            ? rt.clearDepth
              ? _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT)
              : _gl.clear(_gl.COLOR_BUFFER_BIT)
            : _gl.clear(
                _gl.COLOR_BUFFER_BIT |
                  _gl.DEPTH_BUFFER_BIT |
                  _gl.STENCIL_BUFFER_BIT,
              )));
    }),
    (this.unbind = function (rt) {
      (rt.scissor && _gl.disable(_gl.SCISSOR_TEST),
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null));
    }),
    (this.resize = function (rt) {
      if (rt.texture._gl && rt._gl) {
        if ((_gl.bindFramebuffer(_gl.FRAMEBUFFER, rt._gl), rt.multi))
          for (let i = 0; i < rt.attachments.length; i++) {
            let texture = rt.attachments[i];
            if (
              (_gl.bindTexture(_gl.TEXTURE_2D, texture._gl),
              texture.type.includes("float"))
            ) {
              let {
                internalformat: internalformat,
                format: format,
                type: type,
              } = getFloatParams(texture);
              _gl.texImage2D(
                _gl.TEXTURE_2D,
                0,
                internalformat,
                rt.width,
                rt.height,
                0,
                format,
                type,
                null,
              );
            } else
              _gl.texImage2D(
                _gl.TEXTURE_2D,
                0,
                getFormat(texture),
                rt.width,
                rt.height,
                0,
                getFormat(texture),
                getType(texture),
                null,
              );
          }
        else if (rt.internalMultisample) {
          let samples = Math.min(_maxSamples, rt._samplesAmount);
          if (rt.parent.multi) {
            let attachments = rt.parent.attachments;
            for (let i = 0; i < attachments.length; i++) {
              let texture = attachments[i];
              (_gl.bindRenderbuffer(_gl.RENDERBUFFER, texture._colorBuffer),
                _gl.renderbufferStorageMultisample(
                  _gl.RENDERBUFFER,
                  samples,
                  getRenderBufferInternalFormat(texture),
                  rt.width,
                  rt.height,
                ),
                _gl.bindRenderbuffer(_gl.RENDERBUFFER, null));
            }
          } else
            (_gl.bindRenderbuffer(_gl.RENDERBUFFER, rt._colorBuffer),
              _gl.renderbufferStorageMultisample(
                _gl.RENDERBUFFER,
                samples,
                getRenderBufferInternalFormat(rt.texture),
                rt.width,
                rt.height,
              ),
              _gl.framebufferRenderbuffer(
                _gl.FRAMEBUFFER,
                _gl.COLOR_ATTACHMENT0,
                _gl.RENDERBUFFER,
                rt._colorBuffer,
              ));
        } else if (
          (_gl.bindTexture(_gl.TEXTURE_2D, rt.texture._gl),
          rt.texture.type.includes("float"))
        ) {
          let {
            internalformat: internalformat,
            format: format,
            type: type,
          } = getFloatParams(rt.texture);
          _gl.texImage2D(
            _gl.TEXTURE_2D,
            0,
            internalformat,
            rt.width,
            rt.height,
            0,
            format,
            type,
            null,
          );
        } else
          _gl.texImage2D(
            _gl.TEXTURE_2D,
            0,
            getFormat(rt.texture),
            rt.width,
            rt.height,
            0,
            getFormat(rt.texture),
            getType(rt.texture),
            null,
          );
        if (rt.depth) {
          _gl.bindTexture(_gl.TEXTURE_2D, rt.depth._gl);
          let iformat = rt.stencil
              ? WEBGL2
                ? _gl.DEPTH24_STENCIL8
                : _gl.DEPTH_STENCIL
              : WEBGL2
                ? _gl.DEPTH_COMPONENT24
                : _gl.DEPTH_COMPONENT,
            type = rt.stencil
              ? WEBGL2
                ? _gl.UNSIGNED_INT_24_8
                : Renderer.extensions.depthTextures.UNSIGNED_INT_24_8_WEBGL
              : _gl.UNSIGNED_INT;
          (_gl.texImage2D(
            _gl.TEXTURE_2D,
            0,
            iformat,
            rt.width,
            rt.height,
            0,
            rt.stencil ? _gl.DEPTH_STENCIL : _gl.DEPTH_COMPONENT,
            type,
            null,
          ),
            _gl.framebufferTexture2D(
              _gl.FRAMEBUFFER,
              rt.stencil ? _gl.DEPTH_STENCIL_ATTACHMENT : _gl.DEPTH_ATTACHMENT,
              _gl.TEXTURE_2D,
              rt.depth._gl,
              0,
            ));
        } else if (!rt.disableDepth)
          if (
            (_gl.bindRenderbuffer(_gl.RENDERBUFFER, rt._depthBuffer),
            rt.internalMultisample)
          ) {
            let samples = Math.min(_maxSamples, rt._samplesAmount);
            _gl.renderbufferStorageMultisample(
              _gl.RENDERBUFFER,
              samples,
              rt.stencil ? _gl.DEPTH24_STENCIL8 : _gl.DEPTH_COMPONENT24,
              rt.width,
              rt.height,
            );
          } else
            _gl.renderbufferStorage(
              _gl.RENDERBUFFER,
              rt.stencil
                ? WEBGL2
                  ? _gl.DEPTH24_STENCIL8
                  : _gl.DEPTH_STENCIL
                : WEBGL2
                  ? _gl.DEPTH_COMPONENT24
                  : _gl.DEPTH_COMPONENT16,
              rt.width,
              rt.height,
            );
        (_gl.bindTexture(_gl.TEXTURE_2D, null),
          _gl.bindFramebuffer(_gl.FRAMEBUFFER, null),
          _gl.bindRenderbuffer(_gl.RENDERBUFFER, null));
      }
    }),
    (this.destroy = function (rt) {
      (_gl.deleteFramebuffer(rt._gl),
        rt._depthBuffer && _gl.deleteRenderbuffer(rt._depthBuffer),
        Texture.renderer.destroy(rt.texture),
        RenderCount.remove(
          `fbo_${Math.round(rt.width)}x${Math.round(rt.height)}`,
        ),
        rt.multi &&
          rt.attachments.forEach((t) => {
            (t._colorBuffer && _gl.deleteRenderbuffer(t._colorBuffer),
              t._blitFramebuffer && _gl.deleteFramebuffer(t._blitFramebuffer),
              Texture.renderer.destroy(t));
          }),
        (rt._gl = null));
    }));
}),
  Class(function GeometryRendererWebGL(_gl) {
    var _cache = {},
      _isDebbugingShader = Utils.query("displayShaderError");
    const WEBGL2 = Renderer.type == Renderer.WEBGL2,
      { getGLTypeForTypedArray: getGLTypeForTypedArray } = require("GLTypes");
    function updateBuffer(attrib) {
      if (!attrib._gl) return;
      ((attrib.needsUpdate = !1),
        _gl.bindBuffer(_gl.ARRAY_BUFFER, attrib._gl.buffer),
        RenderStats.update("BufferUpdates"));
      let array = attrib.array,
        updateRange = attrib.updateRange;
      if (-1 === updateRange.count)
        attrib.needsNewBuffer
          ? (_gl.bufferData(_gl.ARRAY_BUFFER, attrib.array, _gl.DYNAMIC_DRAW),
            (attrib.needsNewBuffer = !1))
          : _gl.bufferSubData(_gl.ARRAY_BUFFER, 0, array);
      else if (Array.isArray(updateRange)) {
        for (let i = updateRange.length - 1; i > -1; i--) {
          let { offset: offset, count: count } = updateRange[i];
          _gl.bufferSubData(
            _gl.ARRAY_BUFFER,
            offset * array.BYTES_PER_ELEMENT,
            array.subarray(offset, offset + count),
          );
        }
        updateRange.length = 0;
      } else
        _gl.bufferSubData(
          _gl.ARRAY_BUFFER,
          updateRange.offset * array.BYTES_PER_ELEMENT,
          array.subarray(
            updateRange.offset,
            updateRange.offset + updateRange.count,
          ),
        );
      _gl.bindBuffer(_gl.ARRAY_BUFFER, null);
    }
    function renderingCount(count, mode, instanceCount = 1) {
      if (RenderStats.active)
        switch (mode) {
          case _gl.TRIANGLES:
            RenderStats.update("Triangles", instanceCount * (count / 3));
            break;
          case _gl.LINES:
            RenderStats.update("Lines", instanceCount * (count / 2));
            break;
          case _gl.LINE_STRIP:
            RenderStats.update("LineStrip", instanceCount * (count - 1));
            break;
          case _gl.LINE_LOOP:
            RenderStats.update("LineLoop", instanceCount * count);
            break;
          case _gl.POINTS:
            RenderStats.update("Points", instanceCount * count);
        }
    }
    ((this.draw = function (geom, mesh, shader, isQuery) {
      ((geom._gl && !geom.needsUpdate && mesh._gl && mesh._gl.geomInit) ||
        this.upload(geom, mesh, shader),
        RenderStats.active &&
          RenderStats.update(
            "DrawCalls",
            1,
            shader.vsName + "|" + shader.fsName,
            mesh,
          ));
      for (let i = geom._attributeKeys.length - 1; i > -1; i--) {
        let key = geom._attributeKeys[i],
          attrib = geom._attributeValues[i];
        ((mesh._gl.program == shader._gl.program && void 0 !== mesh._gl[key]) ||
          (mesh._gl[key] = _gl.getAttribLocation(shader._gl.program, key)),
          -1 !== mesh._gl[key] &&
            (attrib.isInterleaved && attrib.data.needsUpdate
              ? updateBuffer(attrib.data)
              : (attrib.needsUpdate || attrib.dynamic) &&
                updateBuffer(attrib)));
      }
      if (((mesh._gl.program = shader._gl.program), geom.indexNeedsUpdate)) {
        if (
          ((geom._gl.indexType =
            geom.index instanceof Uint16Array
              ? _gl.UNSIGNED_SHORT
              : _gl.UNSIGNED_INT),
          _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geom._gl.index),
          geom.indexUpdateRange)
        ) {
          let updateRange = geom.indexUpdateRange;
          _gl.bufferSubData(
            _gl.ELEMENT_ARRAY_BUFFER,
            updateRange.offset * geom.index.BYTES_PER_ELEMENT,
            geom.index.subarray(
              updateRange.offset,
              updateRange.offset + updateRange.count,
            ),
          );
        } else
          _gl.bufferData(_gl.ELEMENT_ARRAY_BUFFER, geom.index, _gl.STATIC_DRAW);
        (_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null),
          (geom.indexNeedsUpdate = !1));
      }
      mesh._gl.vao.bind();
      let mode = mesh._gl.mode;
      mode ||
        (mesh._gl.mode = mode =
          (function getMode(mesh, shader) {
            return mesh.isPoints
              ? _gl.POINTS
              : mesh.isLine
                ? _gl.LINE_STRIP
                : shader.wireframe
                  ? _gl.LINES
                  : _gl.TRIANGLES;
          })(mesh, shader));
      let drawStart = geom.drawRange.start || 0,
        drawEnd =
          geom.drawRange.end ||
          (geom.index ? geom.index.length : geom.attributes.position.count);
      if (
        (geom.index &&
          (drawStart *= geom._gl.indexType === _gl.UNSIGNED_SHORT ? 2 : 4),
        isQuery && WEBGL2)
      ) {
        let queryMesh = mesh._queryMesh;
        void 0 !== queryMesh._gl &&
          (queryMesh._gl.queryInProgress &&
            _gl.getQueryParameter(
              queryMesh._gl.query,
              _gl.QUERY_RESULT_AVAILABLE,
            ) &&
            ((queryMesh._gl.occluded = !_gl.getQueryParameter(
              queryMesh._gl.query,
              _gl.QUERY_RESULT,
            )),
            (queryMesh._gl.queryInProgress = !1)),
          queryMesh._gl.queryInProgress ||
            (_gl.beginQuery(
              _gl.ANY_SAMPLES_PASSED_CONSERVATIVE,
              queryMesh._gl.query,
            ),
            _gl.colorMask(!1, !1, !1, !1),
            _gl.depthMask(!1),
            geom.index
              ? (_gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geom._gl.index),
                _gl.drawElements(mode, drawEnd, geom._gl.indexType, drawStart))
              : _gl.drawArrays(mode, drawStart, drawEnd),
            _gl.colorMask(!0, !0, !0, !0),
            _gl.depthMask(!0),
            _gl.endQuery(_gl.ANY_SAMPLES_PASSED_CONSERVATIVE),
            (queryMesh._gl.queryInProgress = !0)));
      } else {
        if (geom.isInstanced) {
          let maxInstancedCount = mesh.maxInstancedCount
            ? Math.min(mesh.maxInstancedCount, geom.maxInstancedCount)
            : geom.maxInstancedCount;
          (shader.maxInstancedCount &&
            (maxInstancedCount = Math.min(
              maxInstancedCount || 9999,
              shader.maxInstancedCount,
            )),
            WEBGL2
              ? geom.index
                ? _gl.drawElementsInstanced(
                    mode,
                    drawEnd,
                    geom._gl.indexType,
                    drawStart,
                    maxInstancedCount,
                  )
                : _gl.drawArraysInstanced(
                    mode,
                    drawStart,
                    drawEnd,
                    maxInstancedCount,
                  )
              : geom.index
                ? Renderer.extensions.instancedArrays.drawElementsInstancedANGLE(
                    mode,
                    drawEnd,
                    geom._gl.indexType,
                    drawStart,
                    maxInstancedCount,
                  )
                : Renderer.extensions.instancedArrays.drawArraysInstancedANGLE(
                    mode,
                    drawStart,
                    drawEnd,
                    maxInstancedCount,
                  ),
            renderingCount(
              geom.index ? geom.index.length : drawEnd,
              mode,
              maxInstancedCount,
            ));
        } else
          mesh.hideByOcclusion ||
            (geom.index
              ? _gl.drawElements(mode, drawEnd, geom._gl.indexType, drawStart)
              : _gl.drawArrays(mode, drawStart, drawEnd),
            renderingCount(geom.index ? geom.index.length : drawEnd, mode, 1));
        (_isDebbugingShader &&
          _gl.getError() != _gl.NO_ERROR &&
          console.log(mesh, shader),
          mesh._gl.vao.unbind(),
          WEBGL2 &&
            RenderMonitor.active &&
            shader?.renderTimeQuery?.endTest?.());
      }
    }),
      (this.upload = function (geom, mesh, shader, hotload) {
        if (!mesh) return;
        (geom._gl || (geom._gl = { id: Utils.timestamp() }),
          mesh._gl || (mesh._gl = {}),
          (mesh._gl.geomInit = !0),
          (geom.uploaded = !0),
          !mesh.isOcclusionMesh &&
            WEBGL2 &&
            ((mesh._gl.query = _gl.createQuery()),
            (mesh._gl.queryInProgress = !1),
            (mesh._gl.occluded = !1)));
        const KEY = `${geom._gl.id}_${shader._gl._id}`;
        let cached = _cache[KEY];
        if (cached && !hotload)
          return (
            cached.count++,
            (mesh._gl.vao = cached.vao),
            void (mesh._gl.lookup = KEY)
          );
        (Utils.query("debugUpload") &&
          console.log("?debugUpload – upload geometry", geom),
          RenderCount.add("geometry"),
          mesh._gl.vao && mesh._gl.vao.destroy(),
          (mesh._gl.vao = new VAO(_gl)),
          geom.distributeBufferData || RenderCount.add("geom_upload", geom));
        for (let i = geom._attributeKeys.length - 1; i > -1; i--) {
          let key = geom._attributeKeys[i],
            attrib = geom._attributeValues[i],
            location =
              (mesh._gl.program === shader._gl.program && mesh._gl[key]) ||
              _gl.getAttribLocation(shader._gl.program, key);
          if (((mesh._gl[key] = location), attrib._gl)) continue;
          attrib._gl = {};
          let { array: array, dynamic: dynamic } = attrib;
          (attrib.isInterleaved &&
            (attrib.data._gl || (attrib.data._gl = attrib._gl),
            (attrib._gl = attrib.data._gl),
            (array = attrib.data.array),
            (dynamic = attrib.data.dynamic)),
            attrib._gl.buffer ||
              ((attrib._gl.buffer = _gl.createBuffer()),
              (attrib._gl.bufferUploaded = !geom.distributeBufferData),
              _gl.bindBuffer(_gl.ARRAY_BUFFER, attrib._gl.buffer),
              _gl.bufferData(
                _gl.ARRAY_BUFFER,
                geom.distributeBufferData
                  ? array.length * array.BYTES_PER_ELEMENT
                  : array,
                dynamic ? _gl.DYNAMIC_DRAW : _gl.STATIC_DRAW,
              ),
              _gl.bindBuffer(_gl.ARRAY_BUFFER, null)),
            (attrib.needsUpdate = !1));
        }
        (geom.index &&
          (geom._gl.index ||
            ((geom._gl.index = _gl.createBuffer()),
            (geom._gl.indexType =
              geom.index instanceof Uint16Array
                ? _gl.UNSIGNED_SHORT
                : _gl.UNSIGNED_INT),
            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geom._gl.index),
            _gl.bufferData(
              _gl.ELEMENT_ARRAY_BUFFER,
              geom.index,
              _gl.STATIC_DRAW,
            ),
            _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, null))),
          mesh._gl.vao.bind());
        for (let i = geom._attributeKeys.length - 1; i > -1; i--) {
          let key = geom._attributeKeys[i],
            attrib = geom._attributeValues[i],
            location = mesh._gl[key];
          if (-1 == location) continue;
          let stride = 0,
            offset = 0;
          if (attrib.isInterleaved) {
            let bytes = attrib.data.array.BYTES_PER_ELEMENT;
            ((stride = attrib.data.stride * bytes),
              (offset = attrib.offset * bytes));
          }
          (_gl.bindBuffer(_gl.ARRAY_BUFFER, attrib._gl.buffer),
            attrib.array instanceof Float32Array
              ? _gl.vertexAttribPointer(
                  location,
                  attrib.itemSize,
                  _gl.FLOAT,
                  !1,
                  stride,
                  offset,
                )
              : _gl.vertexAttribIPointer(
                  location,
                  attrib.itemSize,
                  getGLTypeForTypedArray(attrib.array),
                  !1,
                  stride,
                  offset,
                ),
            _gl.enableVertexAttribArray(location),
            geom.isInstanced &&
              (WEBGL2
                ? _gl.vertexAttribDivisor(location, attrib.meshPerAttribute)
                : Renderer.extensions.instancedArrays.vertexAttribDivisorANGLE(
                    location,
                    attrib.meshPerAttribute,
                  )));
        }
        (geom.index && _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, geom._gl.index),
          mesh._gl.vao.unbind(),
          (_cache[KEY] = { count: 1, vao: mesh._gl.vao }));
      }),
      (this.destroy = function (geom, mesh) {
        for (let i = geom._attributeKeys.length - 1; i > -1; i--) {
          geom._attributeKeys[i];
          let attrib = geom._attributeValues[i];
          attrib._gl &&
            (_gl.deleteBuffer(attrib._gl.buffer), (attrib._gl = null));
        }
        if (
          (geom._gl?.index && _gl.deleteBuffer(geom._gl.index),
          RenderCount.remove("geometry"),
          mesh && mesh._gl && mesh._gl.vao)
        ) {
          let cache = _cache[mesh._gl.lookup];
          (cache
            ? (cache.count--,
              0 == cache.count &&
                (cache.vao.destroy(), delete _cache[mesh._gl.lookup]))
            : mesh._gl.vao.destroy(),
            delete mesh._gl.vao);
        }
        delete geom._gl;
      }),
      (this.resetMeshGeom = function (mesh) {
        mesh._gl && (mesh._gl.geomInit = !1);
      }),
      (this.uploadBuffersAsync = async function (geom) {
        if (geom._gl && geom._gl.uploadedAsync) return;
        let upload = (attrib) => {
            let array = attrib.array,
              buffer = attrib._gl.buffer,
              promise = Promise.create(),
              amt = 4,
              match = !1;
            for (; !match; ) (amt--, array.length % amt == 0 && (match = !0));
            let chunk = array.length / amt,
              i = 0,
              worker = new Render.Worker(function uploadBuffersAsync() {
                let offset = i * chunk,
                  subarray = array.subarray(offset, offset + chunk);
                if (!attrib._gl) return (worker.stop(), promise.resolve());
                (subarray.length &&
                  (_gl.bindBuffer(_gl.ARRAY_BUFFER, buffer),
                  _gl.bufferSubData(
                    _gl.ARRAY_BUFFER,
                    offset * array.BYTES_PER_ELEMENT,
                    subarray,
                  ),
                  _gl.bindBuffer(_gl.ARRAY_BUFFER, null)),
                  ++i == amt && (promise.resolve(), worker.stop()));
              });
            return promise;
          },
          uploaded = !1;
        for (let i = geom._attributeKeys.length - 1; i > -1; i--) {
          geom._attributeKeys[i];
          let attrib = geom._attributeValues[i];
          if (!attrib._gl) {
            geom.distributeBufferData = !0;
            let { array: array, dynamic: dynamic } = attrib;
            ((attrib._gl = {}),
              attrib.isInterleaved &&
                (attrib.data._gl || (attrib.data._gl = attrib._gl),
                (attrib._gl = attrib.data._gl),
                (array = attrib.data.array),
                (dynamic = attrib.data.dynamic)),
              attrib._gl.buffer ||
                ((attrib._gl.buffer = _gl.createBuffer()),
                (attrib._gl.bufferUploaded = !geom.distributeBufferData),
                attrib.array.length &&
                  (_gl.bindBuffer(_gl.ARRAY_BUFFER, attrib._gl.buffer),
                  _gl.bufferData(
                    _gl.ARRAY_BUFFER,
                    array.length * array.BYTES_PER_ELEMENT,
                    dynamic ? _gl.DYNAMIC_DRAW : _gl.STATIC_DRAW,
                  ),
                  _gl.bindBuffer(_gl.ARRAY_BUFFER, null))),
              (attrib.needsUpdate = !1),
              (geom.needsUpdate = !0));
          }
          attrib._gl.bufferUploaded ||
            ((attrib._gl.bufferUploaded = !0),
            (uploaded = !0),
            await upload(attrib),
            (attrib.needsUpdate = !1));
        }
        ((geom._gl.uploadedAsync = !0),
          uploaded && RenderCount.add("geom_uploadAsync", geom));
      }));
  }),
  Class(function ShaderRendererWebGL(_gl) {
    const _this = this;
    var _pool = {},
      _programID = 0,
      _cached = {},
      _uboCache = {};
    const PROFILER = !!window.OptimizationProfiler,
      WEBGL2 = Renderer.type == Renderer.WEBGL2,
      GLOBAL_UNIFORMS = [
        "normalMatrix",
        "modelMatrix",
        "modelViewMatrix",
        "projectionMatrix",
        "viewMatrix",
        "cameraPosition",
        "cameraQuaternion",
        "resolution",
        "time",
        "shadowMatrix",
        "shadowLightPos",
        "shadowSize",
      ],
      DEPTH_FUNC_KEYS = {
        [Shader.DEPTH_FUNC_NEVER]: "NEVER",
        [Shader.DEPTH_FUNC_LESS]: "LESS",
        [Shader.DEPTH_FUNC_EQUAL]: "EQUAL",
        [Shader.DEPTH_FUNC_LEQUAL]: "LEQUAL",
        [Shader.DEPTH_FUNC_GREATER]: "GREATER",
        [Shader.DEPTH_FUNC_NOTEQUAL]: "NOTEQUAL",
        [Shader.DEPTH_FUNC_GEQUAL]: "GEQUAL",
        [Shader.DEPTH_FUNC_ALWAYS]: "ALWAYS",
      };
    function toTypedArray(uni) {
      uni.value;
      return (
        uni._gl || (uni._gl = {}),
        uni._gl.array && uni._gl.array.length == uni.value.length
          ? uni._gl.array.set(uni.value)
          : (uni._gl.array = new Float32Array(uni.value)),
        uni._gl.array
      );
    }
    function createShader(str, type, name = "Shader") {
      let shader = _gl.createShader(type);
      return (
        void 0 !== window.SPECTOR &&
          (shader.__SPECTOR_Metadata = { name: name }),
        _gl.shaderSource(shader, str),
        _gl.compileShader(shader),
        Hydra.LOCAL &&
          (_gl.getShaderParameter(shader, _gl.COMPILE_STATUS) ||
            (!(function logPrettyShaderError(shader) {
              const shaderSrc = _gl
                  .getShaderSource(shader)
                  .split("\n")
                  .map((line, index) => `${index}: ${line}`),
                shaderLog = _gl.getShaderInfoLog(shader),
                splitShader = shaderLog.split("\n"),
                dedupe = {},
                lineNumbers = splitShader
                  .map((line) =>
                    parseFloat(line.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1")),
                  )
                  .filter((n) => !(!n || dedupe[n]) && ((dedupe[n] = !0), !0)),
                logArgs = [""];
              lineNumbers.forEach((number) => {
                ((shaderSrc[number - 1] = `%c${shaderSrc[number - 1]}%c`),
                  logArgs.push(
                    "background: #FF0000; color:#FFFFFF; font-size: 10px",
                    "font-size: 10px",
                  ));
              });
              const fragmentSourceToLog = shaderSrc.join("\n");
              ((logArgs[0] = fragmentSourceToLog),
                console.error(shaderLog),
                console.groupCollapsed("click to view full shader code"),
                console.warn(...logArgs),
                console.groupEnd());
            })(shader),
            _gl.deleteShader(shader))),
        shader
      );
    }
    function createProgram(shader) {
      (shader.vertexShader || Shader.runPreProcess(shader),
        _this.multiViewOverride && _this.multiViewOverride(shader));
      let vsCode = shader.onBeforeCompile(shader.vertexShader, "vs"),
        fsCode = shader.onBeforeCompile(shader.fragmentShader, "fs");
      (PROFILER &&
        OptimizationProfiler.active &&
        ([vsCode, fsCode] = OptimizationProfiler.override(
          shader,
          vsCode,
          fsCode,
        )),
        RenderCount.add("shader", shader));
      let vs = createShader(
          vsCode,
          _gl.VERTEX_SHADER,
          `${shader.vsName} - ${shader.UILPrefix}`,
        ),
        fs = createShader(
          fsCode,
          _gl.FRAGMENT_SHADER,
          `${shader.fsName} - ${shader.UILPrefix}`,
        );
      Hydra.LOCAL &&
        window.GLSLLinter &&
        GLSLLinter.lint(shader, vsCode, fsCode);
      let program = _gl.createProgram();
      return (
        _gl.attachShader(program, vs),
        _gl.attachShader(program, fs),
        _gl.linkProgram(program),
        Hydra.LOCAL &&
          (_gl.getProgramParameter(program, _gl.LINK_STATUS) ||
            (console.warn(`Shader: ${shader.vsName} | ${shader.vsName}`),
            console.error(
              `Could not compile WebGL program. ${shader.vsName} ${shader.fsName} \n\n` +
                _gl.getProgramInfoLog(program),
            ))),
        _gl.deleteShader(vs),
        _gl.deleteShader(fs),
        program
      );
    }
    function setupShaders(shader) {
      for (let i = shader._uniformKeys.length - 1; i > -1; i--) {
        let key = shader._uniformKeys[i],
          uniform = shader._uniformValues[i];
        if (void 0 === shader._gl[key] && uniform)
          if (uniform.ubo)
            if (WEBGL2) {
              if (
                (_uboCache[shader.UILPrefix] &&
                  !shader.ubo &&
                  (shader.ubo = _uboCache[shader.UILPrefix]),
                _uboCache[shader.UILPrefix])
              ) {
                shader._gl[key] = "U";
                continue;
              }
              (shader.ubo || (shader.ubo = new UBO(1, _gl)),
                shader.ubo.push(uniform),
                (shader._gl[key] = "U"));
            } else
              shader._gl[key] = _gl.getUniformLocation(shader._gl.program, key);
          else
            WEBGL2 && uniform.lightUBO
              ? ((shader._gl[key] = "U"), (shader.uboLight = !0))
              : (shader._gl[key] = _gl.getUniformLocation(
                  shader._gl.program,
                  key,
                ));
      }
      (shader.ubo &&
        !_uboCache[shader.UILPrefix] &&
        (_uboCache[shader.UILPrefix] = shader.ubo),
        shader._gl.setupGlobals ||
          ((shader._gl.setupGlobals = !0),
          GLOBAL_UNIFORMS.forEach((key) => {
            shader._gl[key] = _gl.getUniformLocation(shader._gl.program, key);
          })),
        shader.uboLight &&
          _gl.getUniformBlockIndex(shader._gl.program, "lights"),
        WEBGL2 && _gl.getUniformBlockIndex(shader._gl.program, "global"));
    }
    function uniformTextureArray(uni, uLoc, shader) {
      let array = shader._gl.texArray || [];
      ((array.length = 0), (shader._gl.texArray = array));
      for (let i = 0; i < uni.value.length; i++) {
        array.push(shader._gl.texIndex);
        let texture = uni.value[i];
        (!1 === texture.loaded && (texture = Utils3D.getEmptyTexture()),
          (void 0 === texture._gl || texture.needsReupload) &&
            Texture.renderer.upload(texture),
          _gl.activeTexture(_gl["TEXTURE" + shader._gl.texIndex++]),
          _gl.bindTexture(_gl.TEXTURE_2D, texture._gl));
      }
      _gl.uniform1iv(uLoc, array);
    }
    ((this.upload = function (shader) {
      if (
        (PROFILER &&
          OptimizationProfiler.active &&
          OptimizationProfiler.setupShader(shader),
        !shader._gl)
      ) {
        shader._gl = {};
        let key = `${shader.vsName}_${shader.fsName}_${shader.customCompile}`,
          cached = _pool[key];
        cached
          ? ((shader._gl.program = cached.program),
            (shader._gl._id = cached.id),
            shader.onBeforePrecompilePromise.resolve(),
            cached.count++,
            Hydra.LOCAL && _pool[key].references.push(shader))
          : ((shader._gl.program = createProgram(shader)),
            (shader._gl._id = _programID++),
            (_pool[key] = {
              count: 1,
              program: shader._gl.program,
              id: shader._gl._id,
            }),
            Shader.registerPreProcess(shader),
            Hydra.LOCAL && (_pool[key].references = [shader]));
      }
      (setupShaders(shader),
        shader.ubo && shader.ubo.upload(),
        (Renderer.type == Renderer.WEBGL1 && FXLayer.exists) ||
          (shader.vertexShader = shader.fragmentShader = ""));
    }),
      (this.findCachedProgram = function (shader) {
        let key = `${shader.vsName}_${shader.fsName}_${shader.customCompile}`,
          cached = _pool[key];
        return (
          !!cached &&
          ((shader._gl = {}),
          (shader._gl.program = cached.program),
          (shader._gl._id = cached.id),
          shader.onBeforePrecompilePromise.resolve(),
          _uboCache[shader.UILPrefix] && (shader.ubo = shader.UILPrefix),
          cached.count++,
          Hydra.LOCAL && _pool[key].references.push(shader),
          !0)
        );
      }),
      (this.draw = function (shader) {
        (void 0 === shader._gl && this.upload(shader),
          WEBGL2 &&
            RenderMonitor.active &&
            !shader.renderTimeQuery &&
            (shader.renderTimeQuery = RenderMonitor.createQuery(_gl, shader)),
          WEBGL2 &&
            RenderMonitor.active &&
            shader.renderTimeQuery?.beginTest?.(),
          (shader._gl.texIndex = 0),
          shader._gl.program != _cached.program &&
            (_gl.useProgram(shader._gl.program),
            (_cached.program = shader._gl.program)),
          shader.ubo && shader.ubo.bind(shader._gl.program, "ubo"),
          shader.uboLight && Lighting.bindUBO(shader._gl.program));
        for (let i = shader._uniformKeys.length - 1; i > -1; i--) {
          let key = shader._uniformKeys[i],
            uni = shader._uniformValues[i];
          if (!uni) continue;
          let uLoc = shader._gl[key];
          if (
            (void 0 === uLoc &&
              (setupShaders(shader), (uLoc = shader._gl[key])),
            null !== uLoc && -1 !== uLoc && "U" !== uLoc)
          ) {
            if (
              (null === uni.value && (uni.value = Utils3D.getEmptyTexture()),
              Hydra.LOCAL && void 0 === uni.value)
            )
              throw `Uniform ${key} value is undefined. | ${shader.vsName} ${shader.fsName}`;
            switch (
              (uni.type ||
                (uni.type =
                  "string" == typeof (uniform = uni).type
                    ? uniform.type
                    : "boolean" == typeof uniform.value
                      ? "b"
                      : null === uniform.value ||
                          uniform.value instanceof Texture ||
                          uniform.value.texture ||
                          (uniform.value.rt && uniform.value.rt.texture)
                        ? "t"
                        : uniform.value instanceof Vector2
                          ? "v2"
                          : uniform.value instanceof Vector3 ||
                              uniform.value instanceof Vector3D
                            ? "v3"
                            : uniform.value instanceof Vector4
                              ? "v4"
                              : uniform.value instanceof Matrix4
                                ? "m4"
                                : uniform.value instanceof Matrix3
                                  ? "m3"
                                  : uniform.value instanceof Color
                                    ? "c"
                                    : uniform.value instanceof Quaternion
                                      ? "q"
                                      : Array.isArray(uniform.value) &&
                                          uniform.value[0] instanceof Texture
                                        ? "tv"
                                        : "f"),
              uni.type)
            ) {
              case "f":
                _gl.uniform1f(uLoc, uni.value);
                break;
              case "i":
                _gl.uniform1i(uLoc, Math.floor(uni.value));
                break;
              case "b":
                _gl.uniform1i(uLoc, uni.value);
                break;
              case "v2":
                _gl.uniform2f(uLoc, uni.value.x, uni.value.y);
                break;
              case "v3":
                _gl.uniform3f(uLoc, uni.value.x, uni.value.y, uni.value.z);
                break;
              case "c":
                _gl.uniform3f(uLoc, uni.value.r, uni.value.g, uni.value.b);
                break;
              case "q":
              case "v4":
                _gl.uniform4f(
                  uLoc,
                  uni.value.x,
                  uni.value.y,
                  uni.value.z,
                  uni.value.w,
                );
                break;
              case "v3v":
                _gl.uniform3fv(uLoc, toTypedArray(uni));
                break;
              case "v4v":
                _gl.uniform4fv(uLoc, toTypedArray(uni));
                break;
              case "v2v":
                _gl.uniform2fv(uLoc, toTypedArray(uni));
                break;
              case "fv":
                _gl.uniform1fv(uLoc, toTypedArray(uni));
                break;
              case "m4":
                _gl.uniformMatrix4fv(uLoc, !1, uni.value.elements);
                break;
              case "m3":
                _gl.uniformMatrix3fv(uLoc, !1, uni.value.elements);
                break;
              case "tv":
                uniformTextureArray(uni, uLoc, shader);
                break;
              case "t":
                let texture = uni.value;
                (texture.isTexture ||
                  (uni.value.rt &&
                    (texture =
                      uni.value.rt.overrideTexture || uni.value.rt.texture),
                  uni.value.texture && (texture = uni.value.texture)),
                  !1 === texture.loaded &&
                    (texture = Utils3D.getEmptyTexture()));
                let texIndex = shader._gl.texIndex++;
                (uni.value.vrRT &&
                  ((shader._gl.vrRT = !0), (uni.value._glTexIndex = texIndex)),
                  Texture.renderer.draw(texture, uLoc, key, texIndex));
            }
          }
        }
        var uniform;
        if (!shader.glCustomState) {
          if (shader.polygonOffset) {
            let key =
              shader.polygonOffsetFactor + "_" + shader.polygonOffsetUnits;
            (_cached.polygonOffset != key &&
              (_gl.enable(_gl.POLYGON_OFFSET_FILL),
              _gl.polygonOffset(
                shader.polygonOffsetFactor,
                shader.polygonOffsetUnits,
              )),
              (_cached.polygonOffset = key));
          } else
            (_cached.polygonOffset && _gl.disable(_gl.POLYGON_OFFSET_FILL),
              (_cached.polygonOffset = !1));
          if (
            (shader.transparent || shader.opacity
              ? (_cached.transparent || _gl.enable(_gl.BLEND),
                (_cached.transparent = !0))
              : (_cached.transparent && _gl.disable(_gl.BLEND),
                (_cached.transparent = !1)),
            _cached.blending != shader.blending)
          ) {
            switch (shader.blending) {
              case Shader.ADDITIVE_BLENDING:
                (_gl.blendEquation(_gl.FUNC_ADD),
                  _gl.blendFunc(_gl.SRC_ALPHA, _gl.ONE));
                break;
              case Shader.PREMULTIPLIED_ALPHA_BLENDING:
                (_gl.blendEquation(_gl.FUNC_ADD),
                  _gl.blendFunc(_gl.ONE, _gl.ONE_MINUS_SRC_ALPHA));
                break;
              case Shader.REVERSE_PREMULTIPLIED_ALPHA_BLENDING:
                (_gl.blendEquation(_gl.FUNC_ADD),
                  _gl.blendFunc(_gl.ONE_MINUS_DST_ALPHA, _gl.ONE));
                break;
              case Shader.ADDITIVE_COLOR_ALPHA:
                (_gl.blendEquation(_gl.FUNC_ADD),
                  _gl.blendFunc(_gl.ONE, _gl.ONE));
                break;
              case Shader.MAX:
                (_gl.blendEquation(
                  WEBGL2 ? _gl.MAX : Renderer.extensions.minMax.MAX_EXT,
                ),
                  _gl.blendFunc(_gl.ONE, _gl.ONE));
                break;
              case Shader.MIN:
                (_gl.blendEquation(
                  WEBGL2 ? _gl.MIN : Renderer.extensions.minMax.MIN_EXT,
                ),
                  _gl.blendFunc(_gl.ONE, _gl.ONE));
                break;
              default:
                (_gl.blendEquationSeparate(_gl.FUNC_ADD, _gl.FUNC_ADD),
                  _gl.blendFuncSeparate(
                    _gl.SRC_ALPHA,
                    _gl.ONE_MINUS_SRC_ALPHA,
                    _gl.ONE,
                    _gl.ONE_MINUS_SRC_ALPHA,
                  ));
            }
            _cached.blending = shader.blending;
          }
          shader.depthTest
            ? (_cached.depthTest || _gl.enable(_gl.DEPTH_TEST),
              (_cached.depthTest = !0))
            : (_cached.depthTest && _gl.disable(_gl.DEPTH_TEST),
              (_cached.depthTest = !1));
          let depthFunc =
            _gl[DEPTH_FUNC_KEYS[shader.depthFunc || Shader.DEPTH_FUNC_LESS]];
          if (
            (_cached.depthFunc !== depthFunc &&
              (_gl.depthFunc(depthFunc), (_cached.depthFunc = depthFunc)),
            shader.stencilTest)
          )
            if (
              (_cached.stencilTest || _gl.enable(_gl.STENCIL_TEST),
              (_cached.stencilTest = !0),
              shader.stencilMask)
            )
              (_gl.stencilFunc(_gl.ALWAYS, 1, 255),
                _gl.stencilOp(_gl.KEEP, _gl.KEEP, _gl.REPLACE),
                _gl.stencilMask(255),
                _gl.colorMask(!1, !1, !1, !1),
                _gl.disable(_gl.DEPTH_TEST));
            else {
              (_gl.colorMask(!0, !0, !0, !0), _gl.enable(_gl.DEPTH_TEST));
              let mode = "inside";
              (_gl.stencilFunc(
                "inside" == mode ? _gl.EQUAL : _gl.NOTEQUAL,
                1,
                255,
              ),
                _gl.stencilOp(_gl.KEEP, _gl.KEEP, _gl.KEEP));
            }
          else
            (_cached.stencilTest && _gl.disable(_gl.STENCIL_TEST),
              (_cached.stencilTest = !1));
          switch (shader.side) {
            case Shader.BACK_SIDE:
              _cached.side != Shader.BACK_SIDE &&
                (_gl.enable(_gl.CULL_FACE),
                _gl.cullFace(_gl.FRONT),
                (_cached.side = Shader.BACK_SIDE));
              break;
            case Shader.DOUBLE_SIDE:
              _cached.side != Shader.DOUBLE_SIDE &&
                (_gl.disable(_gl.CULL_FACE),
                (_cached.side = Shader.DOUBLE_SIDE));
              break;
            default:
              _cached.side != Shader.FRONT_SIDE &&
                (_gl.enable(_gl.CULL_FACE),
                _gl.cullFace(_gl.BACK),
                (_cached.side = Shader.FRONT_SIDE));
          }
          if (
            (_cached.depthMask != shader.depthWrite &&
              (_gl.depthMask(!!shader.depthWrite),
              (_cached.depthMask = shader.depthWrite)),
            shader.colorMask && shader.colorMask.push)
          )
            _gl.colorMask(
              shader.colorMask[0] || !1,
              shader.colorMask[1] || !1,
              shader.colorMask[2] || !1,
              shader.colorMask[3] || !1,
            );
          else
            switch (shader.colorMask) {
              case Shader.COLOR_MASK_NONE:
                _cached.colorMask != shader.colorMask &&
                  (_gl.colorMask(!0, !0, !0, !0),
                  (_cached.colorMask = shader.colorMask));
                break;
              case Shader.COLOR_MASK_RGB:
                _cached.colorMask != shader.colorMask &&
                  (_gl.colorMask(!1, !1, !1, !0),
                  (_cached.colorMask = shader.colorMask));
                break;
              case Shader.COLOR_MASK_RGBA:
                _cached.colorMask != shader.colorMask &&
                  (_gl.colorMask(!1, !1, !1, !1),
                  (_cached.colorMask = shader.colorMask));
            }
        }
        if (shader.customState)
          for (let i = 0; i < shader.customState.length; i++) {
            let obj = shader.customState[i];
            _gl[obj.fn].apply(_gl, obj.params);
          }
      }),
      (this.destroy = function (shader) {
        (delete shader._gl, shader.ubo && shader.ubo.destroy());
      }),
      (this.appendUniform = function (shader, key, value, hint) {
        let loc = shader._gl[key];
        if (
          (void 0 === loc &&
            (loc = loc = _gl.getUniformLocation(shader._gl.program, key)),
          null !== loc)
        )
          if (value.isMatrix4) _gl.uniformMatrix4fv(loc, !1, value.elements);
          else if (value.isMatrix3)
            _gl.uniformMatrix3fv(loc, !1, value.elements);
          else if (value.isVector4)
            _gl.uniform4f(loc, value.x, value.y, value.z, value.w);
          else if (value.isQuaternion)
            _gl.uniform4f(loc, value.x, value.y, value.z, value.w);
          else if (value.isVector3)
            _gl.uniform3f(loc, value.x, value.y, value.z);
          else if (value.isVector2) _gl.uniform2f(loc, value.x, value.y);
          else if (value instanceof Float32Array)
            switch (hint) {
              case "matrix":
                _gl.uniformMatrix4fv(loc, !1, value);
                break;
              case "float":
                _gl.uniform1fv(loc, value);
                break;
              case "vec3":
                _gl.uniform3fv(loc, value);
            }
          else if (Array.isArray(value)) {
            let array = shader._gl.texArray || [];
            ((array.length = 0), (shader._gl.texArray = array));
            for (let i = 0; i < value.length; i++)
              (array.push(shader._gl.texIndex),
                _gl.activeTexture(_gl["TEXTURE" + shader._gl.texIndex++]),
                _gl.bindTexture(_gl.TEXTURE_2D, value[i]._gl));
            _gl.uniform1iv(loc, array);
          } else _gl.uniform1f(loc, value);
      }),
      (this.resetState = function () {
        (_cached.depthMask || (_gl.depthMask(!0), (_cached.depthMask = !0)),
          _cached.depthTest || _gl.enable(_gl.DEPTH_TEST),
          (_cached.depthTest = !0),
          _cached.depthFunc !== _gl.LESS && _gl.depthFunc(_gl.LESS),
          (_cached.depthFunc = _gl.LESS),
          _cached.colorMask != Shader.COLOR_MASK_NONE &&
            (_gl.colorMask(!0, !0, !0, !0),
            (_cached.colorMask = Shader.COLOR_MASK_NONE)),
          (_cached.program = null));
      }),
      (this.clearState = function () {
        _cached = {};
      }),
      (this.hotReload = function (file) {
        file = file.split(".")[0].trim();
        for (let key in _pool)
          if (
            key.includes(file) &&
            !["|instance", "|Line3D", "|MergedLine"].find((part) =>
              key.includes(part),
            )
          ) {
            let obj = _pool[key],
              rootShader = obj.references[0];
            for (let i = 0; i < obj.references.length; i++) {
              let shader = obj.references[i];
              (0 === i
                ? ((shader.restoreFS = shader.restoreVS = null),
                  shader.resetProgram(),
                  (shader._gl = {}),
                  (shader._gl.program = createProgram(shader)),
                  (shader._gl._id = _programID++),
                  (obj.program = shader._gl.program),
                  (obj.id = shader._gl._id))
                : (shader.destroy(),
                  (shader.restoreFS = rootShader.restoreFS),
                  (shader.restoreVS = rootShader.restoreVS),
                  (shader.vertexShader = rootShader.vertexShader),
                  (shader.fragmentShader = rootShader.fragmentShader),
                  (shader._gl = {}),
                  (shader._gl.program = obj.program),
                  (shader._gl._id = obj.id)),
                setupShaders(rootShader));
            }
          }
      }),
      (this.hotReloadClearProgram = function (id) {
        for (let key in _pool) key.includes(id) && delete _pool[key];
      }));
  }),
  Class(function TextureRendererWebGL(_gl) {
    const _this = this;
    var _state = {};
    const FLOAT_DATA = new Float32Array([0, 0, 0, 0]),
      UINT_DATA = new Uint32Array([0, 0, 0, 0]),
      INT_DATA = new Int32Array([0, 0, 0, 0]),
      DATA = new Uint8Array([0, 0, 0, 0]),
      {
        getFormat: getFormat,
        getProperty: getProperty,
        getType: getType,
        getFloatParams: getFloatParams,
        getInternalFormat: getInternalFormat,
      } = require("GLTypes");
    function setTextureParams(texture, textureType = _gl.TEXTURE_2D) {
      let format = getFormat(texture),
        internalFormat = getInternalFormat(texture),
        type = getType(texture),
        data = DATA;
      switch (texture.type) {
        case Texture.FLOAT:
          data = FLOAT_DATA;
          break;
        case Texture.UNSIGNED_INTEGER:
          data = UINT_DATA;
          break;
        case Texture.INTEGER:
          data = INT_DATA;
          break;
        case Texture.HALF_FLOAT:
          data = null;
      }
      (textureType != _gl.TEXTURE_2D ||
        texture.compressed ||
        _gl.texImage2D(
          textureType,
          0,
          internalFormat,
          1,
          1,
          0,
          format,
          type,
          data,
        ),
        _gl.texParameteri(
          textureType,
          _gl.TEXTURE_WRAP_S,
          getProperty(texture.wrapS),
        ),
        _gl.texParameteri(
          textureType,
          _gl.TEXTURE_WRAP_T,
          getProperty(texture.wrapT),
        ),
        _gl.texParameteri(
          textureType,
          _gl.TEXTURE_MAG_FILTER,
          getProperty(texture.magFilter),
        ),
        _gl.texParameteri(
          textureType,
          _gl.TEXTURE_MIN_FILTER,
          getProperty(texture.minFilter),
        ),
        texture.data || texture.format != Texture.RGBAFormat
          ? 1 == _state.premultiply &&
            (_gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
            (_state.premultiply = !1))
          : !1 === texture.premultiplyAlpha
            ? (_gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
              (_state.premultiply = !1))
            : (_gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0),
              (_state.premultiply = !0)),
        texture.anisotropy > 1 &&
          _gl.texParameterf(
            textureType,
            Renderer.extensions.anisotropy.TEXTURE_MAX_ANISOTROPY_EXT,
            texture.anisotropy,
          ));
    }
    function updateDynamic(texture) {
      if (texture.isDataTexture) {
        if (
          (!0 === texture.flipY
            ? _state.flipY ||
              (_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, !0),
              (_state.flipY = !0))
            : _state.flipY &&
              (_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, !1),
              (_state.flipY = !1)),
          _state.premultiply &&
            (_gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
            (_state.premultiply = !1)),
          !texture.glFormat)
        ) {
          let {
            internalformat: internalformat,
            format: format,
            type: type,
          } = getFloatParams(texture);
          ((texture.iformat = internalformat),
            (texture.glFormat = format),
            (texture.glType = type));
        }
        _gl.texSubImage2D(
          _gl.TEXTURE_2D,
          0,
          0,
          0,
          texture.width,
          texture.height,
          texture.glFormat,
          texture.glType,
          texture.data,
        );
      } else {
        (_state.flipY ||
          (_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, !0), (_state.flipY = !0)),
          texture.format == Texture.RGBAFormat
            ? !1 === texture.premultiplyAlpha
              ? (_gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
                (_state.premultiply = !1))
              : (_gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0),
                (_state.premultiply = !0))
            : _state.premultiply &&
              (_gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
              (_state.premultiply = !1)),
          texture.glFormat || (texture.glFormat = getFormat(texture)));
        try {
          _gl.texImage2D(
            _gl.TEXTURE_2D,
            0,
            texture.glFormat,
            texture.glFormat,
            getType(texture),
            texture.image,
          );
        } catch (e) {}
      }
    }
    ((this.draw = function (texture, loc, key, id) {
      if (
        ((void 0 === texture._gl || texture.needsReupload) &&
          this.upload(texture),
        _gl.activeTexture(_gl[`TEXTURE${id}`]),
        texture.cube)
      )
        _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, texture._gl);
      else if (texture.isTexture3D)
        _gl.bindTexture(_gl.TEXTURE_3D, texture._gl);
      else {
        let texType = texture.EXT_OES
          ? _gl.TEXTURE_EXTERNAL_OES
          : _gl.TEXTURE_2D;
        _gl.bindTexture(texType, texture._gl);
      }
      (_gl.uniform1i(loc, id),
        (texture.dynamic || texture.needsUpdate) && updateDynamic(texture),
        (texture.needsUpdate = !1));
    }),
      (this.upload = function (texture) {
        if (texture._gl && !texture.needsReupload && !texture.needsUpdate)
          return;
        let format = getFormat(texture);
        if (
          (Utils.query("debugUpload") &&
            console.log("?debugUpload – upload texture", texture),
          texture.cube)
        ) {
          if (texture.compressed) {
            if (1 !== texture.cube.length)
              throw "Compressed cube texture requires 1 file with 6 faces";
          } else if (6 !== texture.cube.length)
            throw "Cube texture requires 6 images";
          return (function uploadCube(texture) {
            if (void 0 === texture._gl) {
              ((texture._gl = _gl.createTexture()),
                _gl.bindTexture(_gl.TEXTURE_CUBE_MAP, texture._gl));
              let needsFlipY = !0 === texture.flipY;
              (needsFlipY !== !!_state.flipY &&
                (_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, needsFlipY),
                (_state.flipY = needsFlipY)),
                setTextureParams(texture, _gl.TEXTURE_CUBE_MAP));
            }
            let format = getFormat(texture);
            if (texture.compressed) {
              let image = texture.cube[0];
              for (let i = 0; i < image.compressedData.length; i++) {
                let size = image.sizes[i],
                  data = image.compressedData[i],
                  faceLength = data.length / 6;
                for (let j = 0; j < 6; j++)
                  if (image.uncompressed) {
                    let view = new Uint8Array(
                      data.buffer,
                      j * faceLength,
                      faceLength,
                    );
                    _gl.texImage2D(
                      _gl.TEXTURE_CUBE_MAP_POSITIVE_X + j,
                      i,
                      _gl.RGBA,
                      size.width,
                      size.height,
                      0,
                      _gl.RGBA,
                      _gl.UNSIGNED_BYTE,
                      view,
                    );
                  } else {
                    let view = new DataView(
                      data.buffer,
                      j * faceLength,
                      faceLength,
                    );
                    _gl.compressedTexImage2D(
                      _gl.TEXTURE_CUBE_MAP_POSITIVE_X + j,
                      i,
                      image.gliFormat,
                      size.width || size,
                      size.height || size,
                      0,
                      view,
                    );
                  }
              }
            } else {
              for (let i = 0; i < 6; i++)
                _gl.texImage2D(
                  _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
                  0,
                  format,
                  format,
                  getType(texture),
                  texture.cube[i],
                );
              _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP);
            }
            ((texture.needsUpdate = texture.needsReupload = !1),
              texture.onUpdate && texture.onUpdate());
          })(texture);
        }
        if (texture.isTexture3D)
          return (function uploadTexture3D(texture) {
            if (void 0 === texture._gl) {
              let format = getFormat(texture),
                internalFormat = getInternalFormat(texture),
                type = getType(texture);
              ((texture._gl = _gl.createTexture()),
                _gl.bindTexture(_gl.TEXTURE_3D, texture._gl),
                _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, !1),
                _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
                _gl.texParameteri(
                  _gl.TEXTURE_3D,
                  _gl.TEXTURE_WRAP_S,
                  getProperty(texture.wrapS),
                ),
                _gl.texParameteri(
                  _gl.TEXTURE_3D,
                  _gl.TEXTURE_WRAP_T,
                  getProperty(texture.wrapT),
                ),
                _gl.texParameteri(
                  _gl.TEXTURE_3D,
                  _gl.TEXTURE_WRAP_R,
                  getProperty(texture.wrapR),
                ),
                _gl.texParameteri(
                  _gl.TEXTURE_3D,
                  _gl.TEXTURE_MAG_FILTER,
                  getProperty(texture.magFilter),
                ),
                _gl.texParameteri(
                  _gl.TEXTURE_3D,
                  _gl.TEXTURE_MIN_FILTER,
                  getProperty(texture.minFilter),
                ),
                _gl.texImage3D(
                  _gl.TEXTURE_3D,
                  0,
                  internalFormat,
                  texture.width,
                  texture.height,
                  texture.depth,
                  0,
                  format,
                  type,
                  texture.image,
                ),
                (texture.needsUpdate = texture.needsReupload = !1),
                texture.onUpdate && texture.onUpdate());
            }
          })(texture);
        let texType = texture.EXT_OES
          ? _gl.TEXTURE_EXTERNAL_OES
          : _gl.TEXTURE_2D;
        if (
          (void 0 === texture._gl
            ? ((texture._gl = _gl.createTexture()),
              RenderCount.add("texture"),
              _gl.bindTexture(texType, texture._gl),
              setTextureParams(texture, texType))
            : _gl.bindTexture(texType, texture._gl),
          texture.isDataTexture ||
            (texture.type && texture.type.includes("float")))
        ) {
          (!0 === texture.flipY
            ? _state.flipY ||
              (_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, !0),
              (_state.flipY = !0))
            : _state.flipY &&
              (_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, !1),
              (_state.flipY = !1)),
            _gl.pixelStorei(_gl.UNPACK_ALIGNMENT, 1));
          let {
            internalformat: internalformat,
            format: format,
            type: type,
          } = getFloatParams(texture);
          if ("ie" === Device.system.browser)
            try {
              _gl.texImage2D(
                _gl.TEXTURE_2D,
                0,
                internalformat,
                texture.width,
                texture.height,
                0,
                format,
                type,
                texture.distributeTextureData ? null : texture.data,
              );
            } catch (e) {
              console.log(e);
            }
          else
            _gl.texImage2D(
              _gl.TEXTURE_2D,
              0,
              internalformat,
              texture.width,
              texture.height,
              0,
              format,
              type,
              texture.distributeTextureData ? null : texture.data,
            );
          texture.destroyDataAfterUpload &&
            ((texture.data = null),
            delete texture.data,
            texture.onDataDestroyed?.());
        } else {
          let needsFlipY = !texture.compressed && !1 !== texture.flipY;
          if (
            (needsFlipY !== !!_state.flipY &&
              (_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, needsFlipY),
              (_state.flipY = needsFlipY)),
            texture.image && texture.compressed)
          ) {
            let data = texture.image.compressedData;
            for (let i = 0; i < data.length; i++) {
              let size = texture.image.sizes[i];
              texture.image.uncompressed
                ? _gl.texImage2D(
                    _gl.TEXTURE_2D,
                    i,
                    _gl.RGBA,
                    size.width,
                    size.height,
                    0,
                    _gl.RGBA,
                    _gl.UNSIGNED_BYTE,
                    data[i],
                  )
                : _gl.compressedTexImage2D(
                    _gl.TEXTURE_2D,
                    i,
                    texture.image.gliFormat,
                    size.width || size,
                    size.height || size,
                    0,
                    data[i],
                  );
            }
            data.length = 0;
          } else if (
            texture.image &&
            !(texture.image instanceof HTMLVideoElement)
          )
            try {
              _gl.texImage2D(
                _gl.TEXTURE_2D,
                0,
                format,
                format,
                getType(texture),
                texture.image,
              );
            } catch (e) {
              console.log("error loading texture", e, texture.image);
            }
          texture.distributeTextureData ||
            RenderCount.add("tex_upload", texture);
        }
        ((texture.image || texture.data) &&
          texture.generateMipmaps &&
          !texture.compressed &&
          _gl.generateMipmap(_gl.TEXTURE_2D),
          (texture.needsUpdate = texture.needsReupload = !1),
          texture.onUpdate && texture.onUpdate());
      }),
      (this.manualUpdateDynamic = function (texture) {
        ((void 0 === texture._gl || texture.needsReupload) &&
          this.upload(texture),
          _gl.bindTexture(_gl.TEXTURE_2D, texture._gl),
          updateDynamic(texture));
      }),
      (this.uploadAsync = function (texture) {
        let { format: format, type: type } = getFloatParams(texture);
        if (texture._uploadAsyncPromise) return texture._uploadAsyncPromise;
        ((texture._uploadAsyncPromise = Promise.create()),
          RenderCount.add("tex_uploadAsync", texture),
          texture._gl ||
            ((texture.distributeTextureData = !0), _this.upload(texture)));
        let pixelsPerChunk = texture.height / 4,
          dataPerChunk = texture.data.length / 4,
          i = 0,
          worker = new Render.Worker(function workerUploadAsync() {
            let pixelOffset = pixelsPerChunk * i,
              dataOffset = dataPerChunk * i,
              subarray = texture.data.subarray(
                dataOffset,
                dataOffset + dataPerChunk,
              );
            (!0 === texture.flipY
              ? _state.flipY ||
                (_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, !0),
                (_state.flipY = !0))
              : _state.flipY &&
                (_gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, !1),
                (_state.flipY = !1)),
              _gl.bindTexture(_gl.TEXTURE_2D, texture._gl),
              _gl.texSubImage2D(
                _gl.TEXTURE_2D,
                0,
                0,
                pixelOffset,
                texture.width,
                pixelsPerChunk,
                format,
                type,
                subarray,
              ),
              _gl.bindTexture(_gl.TEXTURE_2D, null),
              4 == ++i &&
                (worker.stop(), texture._uploadAsyncPromise.resolve()));
          });
        return texture._uploadAsyncPromise;
      }),
      (this.destroy = function (texture) {
        (texture._gl &&
          (_gl.deleteTexture(texture._gl),
          RenderCount.remove("texture"),
          RenderCount.add("tex_destroy", texture)),
          texture.data && ((texture.data = null), delete texture.data),
          delete texture._gl);
      }));
  }));
class RenderTarget {
  constructor(width, height, options = {}) {
    ((this.width = width),
      (this.height = height),
      (this.options = options),
      (this.viewport = new Vector2(0, 0)),
      void 0 === options.minFilter && (options.minFilter = Texture.LINEAR),
      (this.stencil = "boolean" == typeof options.stencil && options.stencil),
      options.sharedRenderbuffer &&
        ((this.sharedRenderbuffer = !0),
        (this.clearDepth =
          "boolean" != typeof options.clearDepth || options.clearDepth),
        (this._depthBuffer = options.sharedRenderbuffer.rt._depthBuffer)),
      (this.texture = new Texture(null)),
      (this.texture.generateMipmaps = options.generateMipmaps),
      (this.texture.rt = this),
      (this.texture.width = width),
      (this.texture.height = height),
      (this.texture.minFilter = options.minFilter || Texture.LINEAR),
      (this.texture.magFilter = options.magFilter || Texture.LINEAR),
      (this.texture.wrapS = options.wrapS || Texture.CLAMP_TO_EDGE),
      (this.texture.wrapT = options.wrapT || Texture.CLAMP_TO_EDGE),
      (this.texture.format = options.format || Texture.RGBFormat),
      options.type && (this.texture.type = options.type),
      options.multisample &&
        (Renderer.type
          ? Renderer.type == Renderer.WEBGL2
          : Device.graphics.webgl.webgl2) &&
        ((options.multisample = !1),
        (this.multisample = !0),
        (this._rtMultisample = new RenderTarget(width, height, options)),
        (this._rtMultisample.internalMultisample = !0),
        (this._rtMultisample.parent = this),
        (this._rtMultisample._samplesAmount =
          void 0 === options.samplesAmount ? 100 : options.samplesAmount)),
      (this.isRT = !0));
  }
  setSize(width, height) {
    ((this.width = width),
      (this.height = height),
      (this.texture.width = width),
      (this.texture.height = height),
      this.viewport.set(0, 0),
      RenderTarget.renderer.resize(this),
      !this.multisample ||
        (this._rtMultisample.width === width &&
          this._rtMultisample.height === height) ||
        (this._rtMultisample.destroy(),
        (this._rtMultisample = new RenderTarget(width, height, this.options)),
        (this._rtMultisample.internalMultisample = !0),
        (this._rtMultisample.parent = this),
        (this._rtMultisample._samplesAmount =
          void 0 === this.options.samplesAmount
            ? 100
            : this.options.samplesAmount)));
  }
  clone() {
    return new RenderTarget(this.width, this.height, { ...this.options }).copy(
      this,
    );
  }
  copy(source) {
    ((this.width = source.width), (this.height = source.height));
    let options = { ...this.options };
    return (
      (this.options = options),
      this.viewport.copy(source.viewport),
      (this.stencil = source.stencil),
      source.sharedRenderbuffer &&
        ((this.sharedRenderbuffer = !0),
        (this.clearDepth = source.clearDepth),
        (this._depthBuffer = source._depthBuffer)),
      (this.texture = source.texture.clone()),
      source.multisample &&
        ((options.multisample = !1),
        (this.multisample = !0),
        (this._rtMultisample = new RenderTarget(
          this.width,
          this.height,
          options,
        )),
        (this._rtMultisample.internalMultisample = !0),
        (this._rtMultisample.parent = this),
        (this._rtMultisample._samplesAmount =
          source._rtMultisample._samplesAmount)),
      this
    );
  }
  createDepthTexture() {
    return (
      (this.depth = new Texture(null)),
      (this.depth.generateMipmaps = !1),
      (this.depth.minFilter = Texture.NEAREST),
      (this.depth.magFilter = Texture.NEAREST),
      (this.depth.wrapS = Texture.CLAMP_TO_EDGE),
      (this.depth.wrapT = Texture.CLAMP_TO_EDGE),
      this._gl && RenderTarget.renderer.destroy(this),
      this.depth
    );
  }
  destroy() {
    RenderTarget.renderer.destroy(this);
  }
  upload() {
    (this._gl || RenderTarget.renderer.upload(this),
      this._rtMultisample && this._rtMultisample.upload());
  }
}
class MultiRenderTarget extends RenderTarget {
  constructor(width, height, options = {}) {
    (super(width, height, options),
      (this.multi = !0),
      (this.attachments = [this.texture]));
  }
}
class CubeRenderTarget extends RenderTarget {
  constructor(width, height, options = {}) {
    (super(width, height, options), (this.activeFace = 0), (this.cube = !0));
  }
}
(Class(
  function Shader(
    _vertexShader,
    _fragmentShader,
    _params,
    _onBeforeBuild,
    _postfix,
  ) {
    "object" == typeof _vertexShader &&
      ((_fragmentShader = _vertexShader.uniforms),
      (_vertexShader = _vertexShader.name));
    const _this = this;
    ((this.uniforms = Shader.createUniforms(this)),
      (this.side = Shader.FRONT_SIDE),
      (this.blending = Shader.NORMAL_BLENDING),
      (this.colorMask = Shader.COLOR_MASK_NONE),
      (this.polygonOffset = !1),
      (this.polygonOffsetFactor = 0),
      (this.polygonOffsetUnits = 1),
      (this.depthTest = !0),
      (this.depthWrite = !0),
      (this.ssReflections = _params?.ssReflections || !1),
      (this.depthFunc = Shader.DEPTH_FUNC_LESS),
      (this.stencilTest = !1),
      (this.stencilMask = !1),
      (this.wireframe = !1),
      (this.transparent = !1),
      (this.visible = !0),
      (this.persists = !1),
      (this.precision = "high"),
      (this.customCompile = _params?.customCompile || ""),
      (this.onBeforePrecompilePromise = Promise.create()),
      "string" != typeof _fragmentShader &&
        ((_params = _fragmentShader), (_fragmentShader = _vertexShader)),
      (_params = _params || {}),
      (_this.vsParam = _vertexShader),
      (_this.fsParam = _fragmentShader),
      (_this.params = _params),
      (_this.onBeforeBuild = _onBeforeBuild),
      (_this.vsName = _vertexShader),
      (_this.fsName = (_fragmentShader || _vertexShader) + (_postfix || "")),
      _params.vsName &&
        ((_this.vsName = _params.vsName), delete _params.vsName),
      _params.precision && (_this.precision = _params.precision),
      _params.receiveShadow &&
        ((_this.receiveLight = !0),
        World.RENDERER.shadows && (_this.precision = "high")));
    let vs = _vertexShader,
      fs = _fragmentShader;
    (_params.uilFrom &&
      ((vs = _params.uilFrom), (fs = _params.uilFrom), delete _params.uilFrom),
      (_this.UILPrefix =
        _params.UILPrefix ||
        `${vs}/${fs}/${_params.unique ? _params.unique + "/" : ""}`),
      Shader.parseParams(_params, _this),
      Shader.renderer.findCachedProgram(_this) ||
        Shader.hasAlreadyPreProcessed(_this) ||
        Shader.runPreProcess(_this));
  },
  (_) => {
    function getLightingCode(_this) {
      if (
        (!_this.receiveShadow &&
          Shader.shouldReceiveShadow(_this) &&
          (_this.receiveShadow = !0),
        !_this.receiveLight || _this.isShadow)
      )
        return "";
      let numLights = Lighting.getLighting(_this).position.length / 4;
      return 0 == numLights
        ? Lighting.getShadowUniforms(_this)
        : [
            `#define NUM_LIGHTS ${numLights}`,
            "uniform lights {",
            `vec4 lightPos[${numLights}];`,
            `vec4 lightColor[${numLights}];`,
            `vec4 lightData[${numLights}];`,
            `vec4 lightData2[${numLights}];`,
            `vec4 lightData3[${numLights}];`,
            `vec4 lightProperties[${numLights}];`,
            "};",
          ].join("\n") + Lighting.getShadowUniforms(_this);
    }
    function setupssReflections(code, type, _this) {
      if ("vs" == type) {
        if (!code.includes("vec3 pos = position;"))
          throw `Shader ${_this.vsName} needs to have "vec3 pos = position;" in order for dynamic merging to work`;
        let vsDeferred =
            "\n            vPosDeferred = modelViewMatrix * vec4(pos, 1.);\n            vNormalDeferred = normalMatrix * normal;\n            vST = uv;\n            ",
          main = code.split("vec3 pos = position;");
        ((main[1] = "\n" + vsDeferred + main[1]),
          (code = main.join("vec3 pos = position;")));
      }
      return code;
    }
    ((Shader.FRONT_SIDE = "shader_front_side"),
      (Shader.BACK_SIDE = "shader_back_side"),
      (Shader.DOUBLE_SIDE = "shader_double_side"),
      (Shader.DOUBLE_SIDE_TRANSPARENCY = "shader_double_side_trasparency"),
      (Shader.ADDITIVE_BLENDING = "shader_additive_blending"),
      (Shader.NORMAL_BLENDING = "shader_normal_blending"),
      (Shader.PREMULTIPLIED_ALPHA_BLENDING =
        "shader_premultiplied_alpha_blending"),
      (Shader.ADDITIVE_COLOR_ALPHA = "shader_additive_color_alpha"),
      (Shader.REVERSE_PREMULTIPLIED_ALPHA_BLENDING =
        "shader_reverse_premultiplied_alpha_blending"),
      (Shader.MAX = "shader_max"),
      (Shader.MIN = "shader_min"),
      (Shader.CUSTOM_DEPTH = "shader_custom_depth"),
      (Shader.COLOR_MASK_RGB = "shader_colormask_rgb"),
      (Shader.COLOR_MASK_RGBA = "shader_colormask_rgba"),
      (Shader.COLOR_MASK_NONE = "shader_colormask_none"),
      (Shader.DEPTH_FUNC_NEVER = "shader_depth_func_never"),
      (Shader.DEPTH_FUNC_LESS = "shader_depth_func_less"),
      (Shader.DEPTH_FUNC_EQUAL = "shader_depth_func_equal"),
      (Shader.DEPTH_FUNC_LEQUAL = "shader_depth_func_lequal"),
      (Shader.DEPTH_FUNC_GREATER = "shader_depth_func_greater"),
      (Shader.DEPTH_FUNC_NOTEQUAL = "shader_depth_func_notequal"),
      (Shader.DEPTH_FUNC_GEQUAL = "shader_depth_func_gequal"),
      (Shader.DEPTH_FUNC_ALWAYS = "shader_depth_func_always"),
      (Shader.parseParams = function (_params, _this) {
        for (let key in _params)
          if ("receiveShadow" == key) _this.receiveShadow = _params[key];
          else if ("receiveLight" == key) _this.receiveLight = _params[key];
          else if (_params[key] && void 0 !== _params[key].value)
            window.UILStorage && UILStorage.hasData()
              ? ((_this.uniforms[key] =
                  UILStorage.parse(_this.UILPrefix + key, _params[key].value) ||
                  _params[key]),
                _params[key].ubo && (_this.uniforms[key].ubo = !0))
              : (_this.uniforms[key] = _params[key]);
          else {
            if ("unique" == key) continue;
            _this[key] = _params[key];
          }
      }),
      (Shader.runPreProcess = function (shader) {
        if (
          ((shader.vertexShader = Shader.process(
            Shaders.getShader(shader.vsParam + ".vs"),
            "vs",
            shader,
            shader.onBeforeBuild,
          )),
          (shader.fragmentShader = Shader.process(
            Shaders.getShader(shader.fsParam + ".fs"),
            "fs",
            shader,
            shader.onBeforeBuild,
          )),
          shader.vertexShader.includes("//js") && !window[shader.vsName])
        ) {
          let code = shader.vertexShader.split("\n"),
            adders = [];
          (code.forEach((line) => {
            if (line.includes("//js")) {
              let name = line.split(" ")[2].replace(";", ""),
                value = line.split("//js ")[1].replace(";", "");
              adders.push((obj) => {
                obj[name] = { value: eval(value) };
              });
            } else if (line.includes("sampler2D")) {
              let name = line.split(" ")[2].replace(";", "");
              if (name.includes("sampler")) return;
              adders.push((obj) => {
                ((obj[name] = { value: null }),
                  line.includes("repeat") &&
                    (obj[name].getTexture = Utils3D.getRepeatTexture));
              });
            }
          }),
            (window[shader.vsName] = function (_mesh, _shader) {
              let uniforms = {};
              (adders.forEach((addTo) => addTo(uniforms)),
                _shader.addUniforms(uniforms));
            }));
        }
      }),
      (Shader.process = function (code, type, _this, _onBeforeBuild) {
        const WEBGL2 = Renderer.type == Renderer.WEBGL2;
        if (!code)
          throw "No shader found! " + _this.vsName + " | " + _this.fsName;
        const externalOES =
            code.includes("samplerExternalOES") &&
            window.AURA &&
            "android" == Device.system.os,
          standardDeriv = !WEBGL2 && code.includes(["fwidth", "dFdx", "dFdy"]),
          drawBuffers =
            !WEBGL2 &&
            code.includes(["gl_FragData", "#drawbuffer"]) &&
            window.World &&
            World.NUKE.useDrawBuffers;
        let levelOfDetail =
          !WEBGL2 &&
          code.includes([
            "textureGrad",
            "textureProjGrad",
            "texture2DGrad",
            "textureCubeGrad",
            "texture2DProjGrad",
          ]);
        levelOfDetail ||
          WEBGL2 ||
          "fs" !== type ||
          (levelOfDetail = code.includes([
            "textureLod",
            "texture2DLod",
            "textureCubeLod",
            "texture2DProjLod",
          ]));
        const layoutsDefined = code.includes("layout") || _this.ssReflections;
        let header;
        if (
          ((header =
            "vs" == type
              ? [
                  "#version 300 es",
                  externalOES
                    ? "#extension GL_OES_EGL_image_external_essl3 : require"
                    : "",
                  levelOfDetail
                    ? "#extension GL_EXT_shader_texture_lod : enable"
                    : "",
                  `precision ${_this.precision}p float;`,
                  `precision ${_this.precision}p int;`,
                  WEBGL2 ? `precision ${_this.precision}p sampler3D;` : "",
                  WEBGL2 ? `precision ${_this.precision}p usampler2D;` : "",
                  WEBGL2 ? `precision ${_this.precision}p isampler2D;` : "",
                  "attribute vec2 uv;",
                  "attribute vec3 position;",
                  "attribute vec3 normal;",
                  "uniform mat3 normalMatrix;",
                  "uniform mat4 modelMatrix;",
                  "uniform mat4 modelViewMatrix;",
                  "uniform global {",
                  "mat4 projectionMatrix;",
                  "mat4 viewMatrix;",
                  "vec3 cameraPosition;",
                  "vec4 cameraQuaternion;",
                  "vec2 resolution;",
                  "float time;",
                  "float timeScale;",
                  "};",
                ].join("\n")
              : [
                  "#version 300 es",
                  externalOES
                    ? "#extension GL_OES_EGL_image_external_essl3 : require"
                    : "",
                  standardDeriv
                    ? "#extension GL_OES_standard_derivatives : enable"
                    : "",
                  drawBuffers ? "#extension GL_EXT_draw_buffers : require" : "",
                  levelOfDetail
                    ? "#extension GL_EXT_shader_texture_lod : enable"
                    : "",
                  `precision ${_this.precision}p float;`,
                  `precision ${_this.precision}p int;`,
                  WEBGL2 ? `precision ${_this.precision}p sampler3D;` : "",
                  WEBGL2 ? `precision ${_this.precision}p usampler2D;` : "",
                  WEBGL2 ? `precision ${_this.precision}p isampler2D;` : "",
                  "uniform mat3 normalMatrix;",
                  "uniform mat4 modelMatrix;",
                  "uniform mat4 modelViewMatrix;",
                  "uniform global {",
                  "mat4 projectionMatrix;",
                  "mat4 viewMatrix;",
                  "vec3 cameraPosition;",
                  "vec4 cameraQuaternion;",
                  "vec2 resolution;",
                  "float time;",
                  "float timeScale;",
                  "};",
                  layoutsDefined ? "" : "out vec4 FragColor;",
                ].join("\n")),
          (header += "\n__ACTIVE_THEORY_LIGHTS__\n\n"),
          window.AURA && (header += "#define AURA\n"),
          _this.defines &&
            _this.defines.forEach(
              (d) => (header += `#define ${d.toUpperCase()}\n`),
            ),
          _onBeforeBuild && (code = _onBeforeBuild(code, type)),
          _this.ssReflections)
        ) {
          let GIVaryings = [
            "uniform float ssReflectivity;",
            "uniform float ssIORrefl;",
            "uniform float ssRougness;",
            "uniform float ssgiIntensity;",
            "uniform sampler2D tReflectivity;",
            "uniform sampler2D tRoughness;",
            "varying vec4 vPosDeferred;",
            "varying vec3 vNormalDeferred;",
            "varying vec2 vST;",
          ].join("\n");
          header += GIVaryings;
        }
        let split = code.split("\n");
        for (let i = split.length - 1; i > -1; i--) {
          let line = split[i];
          if (line.includes("uniform sampler2D")) {
            let name = line.split("sampler2D ")[1].replace(";", "").trim();
            _this.uniforms[name] || (_this.uniforms[name] = { value: null });
          }
        }
        if (((code = header + code), _this.ssReflections && "fs" == type)) {
          let buffersDeferred =
              "\n            float ssReflectionMap = texture(tReflectivity, vST).r;\n            float ssRougnessMap = texture(tRoughness, vST).r;\n            #drawbuffer PositionLayer gl_FragColor = vPosDeferred;\n            #drawbuffer NormalsLayer gl_FragColor = vec4(vNormalDeferred, 1.);\n            #drawbuffer ReflectivityLayer gl_FragColor = vec4(ssIORrefl, ssReflectivity * ssReflectionMap, ssRougness * ssRougnessMap, ssgiIntensity);\n            ",
            main = code.split("main() {");
          ((main[1] = "\n" + buffersDeferred + main[1]),
            (code = main.join("main() {")));
        }
        return code;
      }));
    const prototype = Shader.prototype;
    ((prototype.copyUniformsTo = function (shader, linked, ignore) {
      for (let key in this.uniforms)
        void 0 !== this.uniforms[key] &&
          ((ignore && ignore.includes?.(key)) ||
            (shader.uniforms[key] = linked
              ? this.uniforms[key]
              : {
                  type: this.uniforms[key].type,
                  value: this.uniforms[key].value,
                }));
    }),
      (prototype.replicateUniformsTo = function (shader) {
        ((shader.uniforms = this.uniforms),
          (shader._uniformKeys = this._uniformKeys),
          (shader._uniformValues = this._uniformValues));
      }),
      (prototype.addUniforms = function (uniforms) {
        uniforms.UILPrefix &&
          ((this.UILPrefix = uniforms.UILPrefix), delete uniforms.UILPrefix);
        for (let key in uniforms)
          (this.hotReloading && this.uniforms[key]) ||
            (this.uniforms[key] = uniforms[key]);
      }),
      (prototype.draw = function (mesh, geom) {
        (this.receiveLight && !this.__lighting && Lighting.getLighting(this),
          Shader.renderer.draw(this, mesh, geom));
      }),
      (prototype.upload = function (mesh, geom) {
        (!this.receiveShadow &&
          Shader.shouldReceiveShadow(this) &&
          (this.receiveShadow = !0),
          Shader.renderer.upload(this, mesh, geom),
          this.receiveShadow &&
            !this.shadow &&
            Lighting.initShadowShader(this, mesh));
      }),
      (prototype.destroy = function () {
        (this.persists ||
          (Shader.renderer.destroy(this), this.shadow && this.shadow.destroy()),
          this.receiveLight && Lighting.destroyShader(this));
      }),
      (prototype.onBeforeCompile = function (code, type) {
        const WEBGL2 = Renderer.type == Renderer.WEBGL2;
        "}" != (code = code.trim())[code.length - 1] && (code += "\n}");
        let p = this.mesh,
          scene = World.SCENE;
        for (; p; ) (p instanceof Scene && (scene = p), (p = p._parent));
        (scene.nuke && scene.nuke.onBeforeShaderCompile
          ? scene.nuke.onBeforeShaderCompile(this.mesh)
          : this.onBeforePrecompilePromise.resolve(),
          this.receiveShadow && (this.receiveLight = !0));
        let varyings = [],
          uniforms = [];
        (this.ssReflections && (code = setupssReflections(code, type, this)),
          (code = code.split("\n")).forEach((line, index) => {
            ("fs" == type &&
              line.includes("#drawbuffer") &&
              (line.includes("#drawbuffer Color")
                ? (code[index] = line.replace("#drawbuffer Color", ""))
                : (code[index] = "")),
              line.includes("varying") && varyings.push(line.trim()),
              line.includes("uniform") && uniforms.push(line.trim()));
          }),
          (code = code.join("\n")));
        const process = function (array) {
          let replace,
            counts = [];
          (array.forEach((value) => {
            let count = 0;
            (array.forEach((v2) => {
              value == v2 && count++;
            }),
              count > 1 &&
                (replace || (replace = []),
                replace.includes(value) ||
                  (replace.push(value), counts.push(count))));
          }),
            replace &&
              replace.forEach((value, i) => {
                let count = counts[i];
                for (let j = 0; j < count - 1; j++) {
                  let index = code.lastIndexOf(value);
                  code =
                    code.substring(0, index) +
                    code.substring(index + value.length);
                }
              }));
        };
        (process(varyings),
          process(uniforms),
          "fs" == type &&
            (WEBGL2
              ? code.includes("gl_FragColor") &&
                (code = code.replace(/gl_FragColor/g, "FragColor"))
              : code.includes("#applyShadow") &&
                (code = code.replace("#applyShadow", ""))),
          (code = code.replace(
            "__ACTIVE_THEORY_LIGHTS__",
            getLightingCode(this),
          )),
          "fs" == type &&
            code.includes("SHADOW_MAPS") &&
            (code = require("GLSLOptimizer")(
              code.replaceAll("SHADOW_COUNT", Lighting.getShadowCount(this)),
            )),
          this.preCompile && (code = this.preCompile(code, type)));
        let converter = require("ShaderCode");
        return (code = WEBGL2
          ? converter.convertWebGL2(code, type)
          : converter.convertWebGL1(code, type));
      }),
      (prototype.set = function (key, value, ref) {
        let _this = ref || this;
        return _this.uniforms[key]
          ? (void 0 !== value &&
              (TweenManager.clearTween(_this.uniforms[key]),
              (_this.uniforms[key].value = value),
              _this.ubo && (_this.ubo.needsUpdate = !0)),
            _this.uniforms[key].value)
          : console.warn(`No key ${key} found on shader`, _this);
      }),
      (prototype.get = function (key, ref) {
        let _this = ref || this;
        return _this.uniforms[key] && _this.uniforms[key].value;
      }),
      (prototype.tween = function (
        key,
        value,
        time,
        ease,
        delay,
        callback,
        update,
        scaledTime,
      ) {
        return "number" == typeof value
          ? tween(
              this.uniforms[key],
              { value: value },
              time,
              ease,
              delay,
              callback,
              update,
              null,
              scaledTime,
            )
          : tween(
              this.uniforms[key].value,
              value,
              time,
              ease,
              delay,
              callback,
              update,
              null,
              scaledTime,
            );
      }),
      (prototype.clone = function (noShadows, postfix) {
        const _this = this;
        noShadows && (_this.params.receiveShadow = !1);
        let shader = new Shader(
          _this.vsParam,
          _this.fsParam,
          _this.params,
          null,
          postfix,
        );
        for (let key in _this)
          key.includes(["vsName", "fsName", "uniforms", "_uniform", "_gl"]) ||
            "function" == typeof _this[key] ||
            (shader[key] = _this[key]);
        for (let key in _this.uniforms)
          shader.uniforms[key] = {
            type: _this.uniforms[key].type,
            value: _this.uniforms[key].value,
          };
        return shader;
      }),
      (prototype.resetProgram = function () {
        (this.destroy(),
          (this.vertexShader =
            this.restoreVS ||
            Shader.process(
              Shaders.getShader(this.vsName + ".vs"),
              "vs",
              this,
              this.onBeforeBuild,
            )),
          (this.fragmentShader =
            this.restoreFS ||
            Shader.process(
              Shaders.getShader(this.fsName + ".fs"),
              "fs",
              this,
              this.onBeforeBuild,
            )));
      }));
    var _shaderShadowMap = {},
      _emptyShadowMap;
    Object.defineProperty(prototype, "receiveShadow", {
      set: function (v) {
        ((_shaderShadowMap[this.vsName + "_" + this.fsName] = v),
          (this._receiveShadow = v),
          v &&
            !this.uniforms.shadowMap &&
            (_emptyShadowMap || (_emptyShadowMap = [Utils3D.getEmptyTexture()]),
            (this.uniforms.shadowMap = { value: _emptyShadowMap })));
      },
      get: function () {
        return this._receiveShadow;
      },
    });
    let shaders = {};
    ((Shader.hasAlreadyPreProcessed = function (shader) {
      let key =
        shader.vsName + "_" + shader.vsName + "_" + shader.customCompile;
      return shaders[key];
    }),
      (Shader.registerPreProcess = function (shader) {
        let key =
          shader.vsName + "_" + shader.vsName + "_" + shader.customCompile;
        shaders[key] = !0;
      }),
      (Shader.shouldReceiveShadow = function (shader) {
        return _shaderShadowMap[shader.vsName + "_" + shader.fsName];
      }));
  },
),
  (Shader.createUniforms = function (shader) {
    let uniforms = {},
      handler = {
        set(target, property, value) {
          ((target[property] = value),
            (shader._uniformKeys.length = 0),
            (shader._uniformValues.length = 0));
          for (let key in uniforms)
            (shader._uniformKeys.push(key),
              shader._uniformValues.push(uniforms[key]));
          return !0;
        },
      };
    return (
      (shader._uniformValues = []),
      (shader._uniformKeys = []),
      new Proxy(uniforms, handler)
    );
  }),
  Class(function ShaderVariants(_params = {}) {
    const _this = this;
    var _target,
      _destination,
      _map = {};
    const LERP = _params.lerp || 0.07;
    function generate(key, shaderOrUniforms) {
      let uniforms,
        prefix =
          shaderOrUniforms.UILPrefix?.split("/")[0] ||
          _this.parent.uilInput?.prefix ||
          Utils.getConstructorName(_this.parent);
      ((prefix += "_shaderVariants_" + key),
        (uniforms =
          Array.isArray(shaderOrUniforms) || shaderOrUniforms.uniforms
            ? shaderOrUniforms.uniforms
            : shaderOrUniforms));
      let newUniforms = {};
      for (let key in uniforms) {
        let uni = uniforms[key];
        ("string" == typeof uni.value && (uni.value = Number(uni.value)),
          uni.ignoreVariants ||
            uni.ignoreUIL ||
            (newUniforms[key] = uniforms[key]));
      }
      let uilFolder = _this.parent.uilFolder;
      return (
        uilFolder || (uilFolder = shaderOrUniforms.mesh?.__uilGroup),
        [newUniforms, prefix, uilFolder]
      );
    }
    (_this.parent.startRender(function loop() {
      _destination && ShaderUIL.lerpShader(_destination, _target, LERP);
    }),
      (_this.parent.createShaderOverride = function createShaderOverride(
        key,
        inUniforms,
        active,
      ) {
        if (inUniforms.uniforms)
          throw "Using an entire shader for createShaderOverride is not what you want. Just pass in the uniforms that are meant to be overriden.";
        let [uniforms, prefix, uilFolder] = generate(key, inUniforms),
          shader = ShaderUIL.createOverride(
            prefix,
            uniforms,
            null,
            null,
            !active,
          );
        (ShaderUIL.add(shader, uilFolder).setLabel(`Shader: ${key}`),
          active &&
            _this.parent.startRender((_) => {
              ShaderUIL.lerpShader(shader, uniforms, 1);
            }));
      }),
      (_this.parent.createShaderVariant = function createShaderVariant(
        key,
        shaderOrUniforms,
      ) {
        let [uniforms, prefix, uilFolder] = generate(key, shaderOrUniforms),
          shader = ShaderUIL.createOverride(prefix, uniforms, null, null, !0);
        (ShaderUIL.add(shader, uilFolder).setLabel(`Shader: ${key}`),
          (_map[key] = shader),
          _target || (_target = shader),
          _destination ||
            (_destination = ShaderUIL.createOverride(
              "OverrideDestination" + Utils.uuid(),
              uniforms,
              null,
              null,
            )));
      }),
      (_this.parent.setShaderVariant = function setShaderVariant(key) {
        if (!(_target = _map[key])) throw `No Shader variant ${key}`;
      }));
  }));
class Texture {
  constructor(img) {
    ((this.magFilter = Texture.LINEAR),
      (this.minFilter = Texture.LINEAR_MIPMAP),
      (this.format = Texture.RGBAFormat),
      (this.wrapS = this.wrapT = Texture.CLAMP_TO_EDGE),
      (this._image = img),
      (this.needsUpdate = !0),
      (this.generateMipmaps = !0),
      (this.anisotropy = 1),
      (this.type = Texture.UNSIGNED_BYTE),
      (this.isTexture = !0),
      img && img.onCreateTexture && img.onCreateTexture(this));
  }
  set image(img) {
    ((this._image = img),
      img && img.onCreateTexture && img.onCreateTexture(this));
  }
  get image() {
    return this._image;
  }
  upload() {
    this._gl || Texture.renderer.upload(this);
  }
  destroy() {
    (Texture.renderer.destroy(this), (this._image = null));
  }
  clone() {
    let texture = new Texture(this.img);
    return (
      (texture.format = this.format),
      (texture.type = this.type),
      (texture.anisotropy = this.anisotropy),
      (texture.wrapS = this.wrapS),
      (texture.wrapT = this.wrapT),
      (texture.generateMipmaps = this.generateMipmaps),
      (texture.minFilter = this.minFilter),
      (texture.magFilter = this.magFilter),
      texture
    );
  }
}
