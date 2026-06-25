class Vector4 {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    ((this.x = x), (this.y = y), (this.z = z), (this.w = w));
  }
  multiplyScalar(s) {
    return ((this.x *= s), (this.y *= s), (this.z *= s), (this.w *= s), this);
  }
  set(x, y, z, w) {
    return ((this.x = x), (this.y = y), (this.z = z), (this.w = w), this);
  }
  copy(v) {
    return (
      (this.x = v.x),
      (this.y = v.y),
      (this.z = v.z),
      (this.w = v.w),
      this
    );
  }
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }
  length() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
    );
  }
  lengthSq() {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  equals(v) {
    return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
  }
  lerp(v, alpha, hz) {
    return (
      (this.x = Math.lerp(v.x, this.x, alpha, hz)),
      (this.y = Math.lerp(v.y, this.y, alpha, hz)),
      (this.z = Math.lerp(v.z, this.z, alpha, hz)),
      (this.w = Math.lerp(v.w, this.w, alpha, hz)),
      this
    );
  }
  applyMatrix4(m) {
    let x = this.x,
      y = this.y,
      z = this.z,
      w = this.w,
      e = m.elements;
    return (
      (this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w),
      (this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w),
      (this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w),
      (this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w),
      this
    );
  }
  toArray(array, offset) {
    return (
      void 0 === array && (array = []),
      void 0 === offset && (offset = 0),
      (array[offset] = this.x),
      (array[offset + 1] = this.y),
      (array[offset + 2] = this.z),
      (array[offset + 3] = this.w),
      array
    );
  }
  fromArray(array, offset) {
    return (
      void 0 === offset && (offset = 0),
      (this.x = Number(array[offset])),
      (this.y = Number(array[offset + 1])),
      (this.z = Number(array[offset + 2])),
      (this.w = Number(array[offset + 3])),
      this
    );
  }
  set width(v) {
    this.z = v;
  }
  set height(v) {
    this.w = v;
  }
  get width() {
    return this.z;
  }
  get height() {
    return this.w;
  }
  clone() {
    return new Vector4(this.x, this.y, this.z, this.w);
  }
}
class Face3 {
  constructor(a, b, c, normal = new Vector3()) {
    ((this.a = a), (this.b = b), (this.c = c), (this.normal = normal));
  }
}
function NoGLPolyfill() {
  ((this.createQuery =
    this.activeTexture =
    this.attachShader =
    this.bindAttribLocation =
    this.bindBuffer =
    this.bindFramebuffer =
    this.bindRenderbuffer =
    this.bindTexture =
    this.blendColor =
    this.blendEquation =
    this.blendEquationSeparate =
    this.blendFunc =
    this.blendFuncSeparate =
    this.bufferData =
    this.bufferSubData =
    this.checkFramebufferStatus =
    this.clear =
    this.clearColor =
    this.clearDepthf =
    this.clearStencil =
    this.colorMask =
    this.compileShader =
    this.compressedTexImage2D =
    this.compressedTexSubImage2D =
    this.copyTexImage2D =
    this.copyTexSubImage2D =
    this.createProgram =
    this.createShader =
    this.cullFace =
    this.deleteBuffers =
    this.deleteFramebuffers =
    this.deleteProgram =
    this.deleteRenderbuffers =
    this.deleteShader =
    this.deleteTextures =
    this.depthFunc =
    this.depthMask =
    this.depthRangef =
    this.detachShader =
    this.disable =
    this.disableVertexAttribArray =
    this.drawArrays =
    this.drawElements =
    this.enable =
    this.enableVertexAttribArray =
    this.finish =
    this.flush =
    this.framebufferRenderbuffer =
    this.framebufferTexture2D =
    this.frontFace =
    this.generateMipmap =
    this.getActiveAttrib =
    this.getActiveUniform =
    this.getAttachedShaders =
    this.getAttribLocation =
    this.getBooleanv =
    this.getBufferParameteriv =
    this.getError =
    this.getFloatv =
    this.getFramebufferAttachmentParameteriv =
    this.getIntegerv =
    this.getProgramiv =
    this.getProgramInfoLog =
    this.getRenderbufferParameteriv =
    this.getShaderiv =
    this.getShaderInfoLog =
    this.getShaderPrecisionFormat =
    this.getShaderSource =
    this.getString =
    this.getTexParameterfv =
    this.getTexParameteriv =
    this.getUniformfv =
    this.getUniformiv =
    this.getUniformLocation =
    this.getVertexAttribfv =
    this.getVertexAttribiv =
    this.getVertexAttribPointerv =
    this.isBuffer =
    this.isEnabled =
    this.isFramebuffer =
    this.isProgram =
    this.isRenderbuffer =
    this.isShader =
    this.isTexture =
    this.lineWidth =
    this.linkProgram =
    this.pixelStorei =
    this.polygonOffset =
    this.readPixels =
    this.releaseShaderCompiler =
    this.renderbufferStorage =
    this.sampleCoverage =
    this.scissor =
    this.shaderBinary =
    this.shaderSource =
    this.stencilFunc =
    this.stencilFuncSeparate =
    this.stencilMask =
    this.stencilMaskSeparate =
    this.stencilOp =
    this.stencilOpSeparate =
    this.texParameterf =
    this.texParameterfv =
    this.texParameteri =
    this.texParameteriv =
    this.texSubImage2D =
    this.uniform1f =
    this.uniform1fv =
    this.uniform1i =
    this.uniform1iv =
    this.uniform2f =
    this.uniform2fv =
    this.uniform2i =
    this.uniform2iv =
    this.uniform3f =
    this.uniform3fv =
    this.uniform3i =
    this.uniform3iv =
    this.uniform4f =
    this.uniform4fv =
    this.uniform4i =
    this.uniform4iv =
    this.uniformMatrix2fv =
    this.uniformMatrix3fv =
    this.uniformMatrix4fv =
    this.useProgram =
    this.validateProgram =
    this.vertexAttrib1f =
    this.vertexAttrib1fv =
    this.vertexAttrib2f =
    this.vertexAttrib2fv =
    this.vertexAttrib3f =
    this.vertexAttrib3fv =
    this.vertexAttrib4f =
    this.vertexAttrib4fv =
    this.vertexAttribPointer =
    this.viewport =
    this.getParameter =
    this.getExtension =
    this.drawElementsInstanced =
    this.drawArraysInstanced =
    this.vertexAttribDivisor =
    this.getUniformBlockIndex =
    this.uniformBlockBinding =
    this.bindBufferBase =
    this.createVertexArray =
    this.bindVertexArray =
    this.deleteVertexArray =
    this.drawBuffers =
    this.blitFramebuffer =
    this.texImage2D =
    this.getContextAttributes =
    this.isContextLost =
    this.clearDepth =
    this.depthRange =
    this.createTexture =
    this.createBuffer =
    this.createFramebuffer =
    this.createRenderbuffer =
    this.deleteTexture =
    this.deleteBuffer =
    this.deleteFramebuffer =
    this.getBufferParameter =
    this.getRenderbufferParameter =
    this.getProgramParameter =
    this.getVertexAttribOffset =
    this.getFramebufferAttachmentParemeter =
    this.getUniform =
    this.getTexParameter =
    this.getShaderParameter =
    this.getSupportedExtensions =
    this.activeTexture =
    this.attachShader =
      (_) => {}),
    (this.getShaderParameter = this.getProgramParameter =
      function () {
        return !0;
      }));
}
(Class(function zUtils3D() {
  function createHelpers() {
    var diff, edge1, edge2, normal, v1, v0;
    ((Ray.prototype.intersectTriangle =
      ((diff = new Vector3()),
      (edge1 = new Vector3()),
      (edge2 = new Vector3()),
      (normal = new Vector3()),
      function intersectTriangle(a, b, c, backfaceCulling, target) {
        (edge1.subVectors(b, a),
          edge2.subVectors(c, a),
          normal.crossVectors(edge1, edge2));
        var sign,
          DdN = this.direction.dot(normal);
        if (DdN > 0) {
          if (backfaceCulling) return null;
          sign = 1;
        } else {
          if (!(DdN < 0)) return null;
          ((sign = -1), (DdN = -DdN));
        }
        diff.subVectors(this.origin, a);
        var DdQxE2 = sign * this.direction.dot(edge2.crossVectors(diff, edge2));
        if (DdQxE2 < 0) return null;
        var DdE1xQ = sign * this.direction.dot(edge1.cross(diff));
        if (DdE1xQ < 0) return null;
        if (DdQxE2 + DdE1xQ > DdN) return null;
        var QdN = -sign * diff.dot(normal);
        return QdN < 0 ? null : this.at(QdN / DdN, target);
      })),
      (Mesh.prototype.raycast = (function () {
        let inverseMatrix = new Matrix4(),
          ray = new Ray(),
          sphere = new Sphere(),
          vA = new Vector3(),
          vB = new Vector3(),
          vC = new Vector3(),
          uvA =
            (new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector3(),
            new Vector2()),
          uvB = new Vector2(),
          uvC = new Vector2(),
          barycoord = new Vector3(),
          intersectionPoint = new Vector3(),
          intersectionPointWorld = new Vector3();
        function checkBufferGeometryIntersection(
          object,
          raycaster,
          ray,
          position,
          uv,
          a,
          b,
          c,
        ) {
          if (
            (vA.fromBufferAttribute(position, a),
            vB.fromBufferAttribute(position, b),
            vC.fromBufferAttribute(position, c),
            object.raycastLimit)
          ) {
            let { radiusSq: radiusSq, position: position } =
              object.raycastLimit;
            if (vA.distanceToSquared(position) > radiusSq) return;
          }
          let intersection = (function checkIntersection(
            object,
            shader,
            raycaster,
            ray,
            pA,
            pB,
            pC,
            point,
          ) {
            let intersect;
            if (
              ((intersect =
                shader.side === Shader.BACK_SIDE
                  ? ray.intersectTriangle(pC, pB, pA, !0, point)
                  : ray.intersectTriangle(
                      pA,
                      pB,
                      pC,
                      shader.side !== Shader.DOUBLE_SIDE,
                      point,
                    )),
              null === intersect)
            )
              return null;
            (intersectionPointWorld.copy(point),
              intersectionPointWorld.applyMatrix4(object.matrixWorld));
            let distance = raycaster.ray.origin.distanceTo(
              intersectionPointWorld,
            );
            return distance < raycaster.near || distance > raycaster.far
              ? null
              : {
                  distance: distance,
                  point: intersectionPointWorld.clone(),
                  object: object,
                };
          })(
            object,
            object.shader,
            raycaster,
            ray,
            vA,
            vB,
            vC,
            intersectionPoint,
          );
          if (intersection) {
            uv &&
              (uvA.fromBufferAttribute(uv, a),
              uvB.fromBufferAttribute(uv, b),
              uvC.fromBufferAttribute(uv, c),
              (intersection.uv = (function uvIntersection(
                point,
                p1,
                p2,
                p3,
                uv1,
                uv2,
                uv3,
              ) {
                return (
                  Triangle.getBarycoord(point, p1, p2, p3, barycoord),
                  uv1.multiplyScalar(barycoord.x),
                  uv2.multiplyScalar(barycoord.y),
                  uv3.multiplyScalar(barycoord.z),
                  uv1.add(uv2).add(uv3),
                  uv1.clone()
                );
              })(intersectionPoint, vA, vB, vC, uvA, uvB, uvC)));
            let face = new Face3(a, b, c);
            (Triangle.getNormal(vA, vB, vC, face.normal),
              (intersection.face = face));
          }
          return intersection;
        }
        return function raycast(raycaster, intersects) {
          let intersection,
            a,
            b,
            c,
            geometry = this.geometry,
            shader = this.shader,
            matrixWorld = this.matrixWorld;
          if (void 0 === shader) return;
          if (
            (null === geometry.boundingSphere &&
              geometry.computeBoundingSphere(),
            0 == this.scale.x)
          )
            return;
          if (this.staticRaycast) {
            if (
              (this.raySphere ||
                ((this.raySphere = new Sphere()),
                this.raySphere.copy(geometry.boundingSphere),
                this.raySphere.applyMatrix4(matrixWorld)),
              this.raycastNeedsUpdate &&
                (this.raySphere.copy(geometry.boundingSphere),
                this.raySphere.applyMatrix4(matrixWorld),
                (this.raycastNeedsUpdate = !1)),
              !1 === raycaster.ray.intersectsSphere(this.raySphere))
            )
              return;
          } else if (
            (sphere.copy(geometry.boundingSphere),
            sphere.applyMatrix4(matrixWorld),
            !1 === raycaster.ray.intersectsSphere(sphere))
          )
            return;
          if (
            (inverseMatrix.getInverse(matrixWorld),
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix),
            null !== geometry.boundingBox &&
              !1 === ray.intersectsBox(geometry.boundingBox))
          )
            return;
          let i,
            l,
            index = geometry.index,
            position = geometry.attributes.position,
            uv = geometry.attributes.uv;
          if (null !== index)
            for (i = 0, l = index.length; i < l; i += 3)
              ((a = index[i]),
                (b = index[i + 1]),
                (c = index[i + 2]),
                (intersection = checkBufferGeometryIntersection(
                  this,
                  raycaster,
                  ray,
                  position,
                  uv,
                  a,
                  b,
                  c,
                )),
                intersection &&
                  ((intersection.faceIndex = Math.floor(i / 3)),
                  intersects.push(intersection)));
          else if (void 0 !== position)
            for (i = 0, l = position.count; i < l; i += 3)
              ((a = i),
                (b = i + 1),
                (c = i + 2),
                (intersection = checkBufferGeometryIntersection(
                  this,
                  raycaster,
                  ray,
                  position,
                  uv,
                  a,
                  b,
                  c,
                )),
                intersection &&
                  ((intersection.faceIndex = Math.floor(i / 3)),
                  intersects.push(intersection)));
        };
      })()),
      (Triangle.prototype.closestPointToPoint = (function () {
        let plane = new Plane(),
          edgeList = [new Line3(), new Line3(), new Line3()],
          projectedPoint = new Vector3(),
          closestPoint = new Vector3();
        return function closestPointToPoint(point, target = new Vector3()) {
          let minDistance = 1 / 0;
          if (
            (plane.setFromCoplanarPoints(this.a, this.b, this.c),
            plane.projectPoint(point, projectedPoint),
            !0 === this.containsPoint(projectedPoint))
          )
            target.copy(projectedPoint);
          else {
            (edgeList[0].set(this.a, this.b),
              edgeList[1].set(this.b, this.c),
              edgeList[2].set(this.c, this.a));
            for (let i = 0; i < edgeList.length; i++) {
              edgeList[i].closestPointToPoint(projectedPoint, !0, closestPoint);
              let distance = projectedPoint.distanceToSquared(closestPoint);
              distance < minDistance &&
                ((minDistance = distance), target.copy(closestPoint));
            }
          }
          return target;
        };
      })()),
      (Points.prototype.raycast = (function () {
        let inverseMatrix = new Matrix4(),
          ray = new Ray(),
          sphere = new Sphere();
        return function raycast(raycaster, intersects) {
          let object = this,
            geometry = this.geometry,
            matrixWorld = this.matrixWorld,
            threshold = raycaster.params.Points.threshold;
          if (
            (null === geometry.boundingSphere &&
              geometry.computeBoundingSphere(),
            sphere.copy(geometry.boundingSphere),
            sphere.applyMatrix4(matrixWorld),
            (sphere.radius += threshold),
            !1 === raycaster.ray.intersectsSphere(sphere))
          )
            return;
          (inverseMatrix.getInverse(matrixWorld),
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix));
          let localThreshold =
              threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3),
            localThresholdSq = localThreshold * localThreshold,
            position = new Vector3(),
            intersectPoint = new Vector3();
          function testPoint(point, index) {
            let rayPointDistanceSq = ray.distanceSqToPoint(point);
            if (rayPointDistanceSq < localThresholdSq) {
              (ray.closestPointToPoint(point, intersectPoint),
                intersectPoint.applyMatrix4(matrixWorld));
              let distance = raycaster.ray.origin.distanceTo(intersectPoint);
              if (distance < raycaster.near || distance > raycaster.far) return;
              intersects.push({
                distance: distance,
                distanceToRay: Math.sqrt(rayPointDistanceSq),
                point: intersectPoint.clone(),
                index: index,
                face: null,
                object: object,
              });
            }
          }
          let index = geometry.index,
            positions = geometry.attributes.position.array;
          if (null !== index) {
            let indices = index.array;
            for (let i = 0, il = indices.length; i < il; i++) {
              let a = indices[i];
              (position.fromArray(positions, 3 * a), testPoint(position, a));
            }
          } else
            for (let i = 0, l = positions.length / 3; i < l; i++)
              (position.fromArray(positions, 3 * i), testPoint(position, i));
        };
      })()),
      Object.assign(Triangle, {
        getNormal:
          ((v0 = new Vector3()),
          function getNormal(a, b, c, target = new Vector3()) {
            (target.subVectors(c, b), v0.subVectors(a, b), target.cross(v0));
            var targetLengthSq = target.lengthSq();
            return targetLengthSq > 0
              ? target.multiplyScalar(1 / Math.sqrt(targetLengthSq))
              : target.set(0, 0, 0);
          }),
        getBarycoord: (function () {
          var v0 = new Vector3(),
            v1 = new Vector3(),
            v2 = new Vector3();
          return function getBarycoord(point, a, b, c, target = new Vector3()) {
            (v0.subVectors(c, a), v1.subVectors(b, a), v2.subVectors(point, a));
            var dot00 = v0.dot(v0),
              dot01 = v0.dot(v1),
              dot02 = v0.dot(v2),
              dot11 = v1.dot(v1),
              dot12 = v1.dot(v2),
              denom = dot00 * dot11 - dot01 * dot01;
            if (0 === denom) return target.set(-2, -1, -1);
            var invDenom = 1 / denom,
              u = (dot11 * dot02 - dot01 * dot12) * invDenom,
              v = (dot00 * dot12 - dot01 * dot02) * invDenom;
            return target.set(1 - u - v, v, u);
          };
        })(),
        getUV: (function () {
          let _v3 = new Vector3();
          return function getUV(point, p1, p2, p3, uv1, uv2, uv3, target) {
            return (
              this.getBarycoord(point, p1, p2, p3, _v3),
              target.set(0, 0),
              target.addScaledVector(uv1, _v3.x),
              target.addScaledVector(uv2, _v3.y),
              target.addScaledVector(uv3, _v3.z),
              target
            );
          };
        })(),
        containsPoint:
          ((v1 = new Vector3()),
          function containsPoint(point, a, b, c) {
            return (
              Triangle.getBarycoord(point, a, b, c, v1),
              v1.x >= 0 && v1.y >= 0 && v1.x + v1.y <= 1
            );
          }),
      }));
  }
  ((Math.euclideanModulo = function (n, m) {
    return ((n % m) + m) % m;
  }),
    (Math.isPowerOf2 = function (w, h) {
      let test = (value) => 0 == (value & (value - 1));
      return test(w) && test(h);
    }),
    (Math.floorPowerOf2 = function (value) {
      return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
    }),
    (Math.ceilPowerOf2 = function (value) {
      return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
    }),
    (this.LOCAL = window.Hydra && Hydra.LOCAL),
    (Geometry.createAttributes = function (geom) {
      let attributes = {},
        handler = {
          set(target, property, value) {
            ((target[property] = value),
              (geom._attributeKeys.length = 0),
              (geom._attributeValues.length = 0));
            for (let key in attributes)
              (geom._attributeKeys.push(key),
                geom._attributeValues.push(attributes[key]));
            return !0;
          },
        };
      return (
        (geom._attributeKeys = []),
        (geom._attributeValues = []),
        new Proxy(attributes, handler)
      );
    }),
    (Geometry.TYPED_ARRAYS = {
      Int8Array: Int8Array,
      Uint8Array: Uint8Array,
      Uint8ClampedArray: Uint8ClampedArray,
      Int16Array: Int16Array,
      Uint16Array: Uint16Array,
      Int32Array: Int32Array,
      Uint32Array: Uint32Array,
      Float32Array: Float32Array,
      Float64Array: Float64Array,
    }),
    (Geometry.arrayNeedsUint32 = function (array) {
      for (let i = array.length - 1; i >= 0; --i)
        if (array[i] > 65535) return !0;
      return !1;
    }),
    (Geometry.TYPES = {
      SphereGeometry: SphereGeometry,
      IcosahedronGeometry: IcosahedronGeometry,
      BoxGeometry: BoxGeometry,
      PlaneGeometry: PlaneGeometry,
      CylinderGeometry: CylinderGeometry,
    }),
    (Matrix4.prototype.isMatrix4 = !0),
    (Matrix3.prototype.isMatrix3 = !0),
    (Vector3.prototype.isVector3 = !0),
    (Vector3D.prototype.isVector3 = !0),
    (Vector2.prototype.isVector2 = !0),
    (CameraBase3D.prototype.isCamera = !0),
    (PerspectiveCamera.prototype.isPerspective = !0),
    (Scene.FRONT_TO_BACK = "sort_front_to_back"),
    (Scene.FRONT_TO_BACK_BOUNDING = "sort_front_to_back_bounding"),
    window.THREAD &&
      (Shader = {
        FRONT_SIDE: "shader_front_side",
        BACK_SIDE: "shader_back_side",
        DOUBLE_SIDE: "shader_double_side",
      }),
    window.MatrixWasm
      ? MatrixWasm.ready().then(createHelpers)
      : createHelpers());
}, "static"),
  Class(function FXLayer(_parentNuke, _type, _preventDrawBuffers = !1) {
    Inherit(this, Component);
    var _nuke,
      _rt,
      _this = this,
      _scene = new Scene(),
      _objects = [],
      _textureIndex = -1,
      _visible = !0,
      _id = Utils.timestamp(),
      _name = Utils.getConstructorName(_this),
      _useDrawBuffers = !_preventDrawBuffers;
    ((this.resolution = 1), (this.enabled = !0), (this.renderShadows = !0));
    const CLEAR_COLOR = [0, 0, 0, 1];
    function resizeHandler() {
      _rt.setSize &&
        _rt.setSize(
          _nuke.stage.width * _this.resolution * _nuke.dpr,
          _nuke.stage.height * _this.resolution * _nuke.dpr,
        );
    }
    if (
      ((FXLayer.exists = !0),
      this.set("visible", (v) => (_this.scene.visible = _visible = v)),
      this.get("visible", (_) => _visible),
      (this.onInvisible = function () {
        _this.scene.visible = !1;
      }),
      (this.onVisible = function () {
        _this.scene.visible = !0;
      }),
      (this.create = function (nuke = World.NUKE, type, rt) {
        if (!nuke) return;
        let format, manualRender, mipmaps;
        ((_useDrawBuffers = nuke.useDrawBuffers),
          type &&
            "object" == typeof type &&
            ("boolean" == typeof type.useDrawBuffers &&
              (_useDrawBuffers = type.useDrawBuffers),
            (format = type.format),
            (manualRender = type.manualRender),
            (mipmaps = type.mipmaps),
            rt || (rt = type.rt),
            (type = type.type)),
          (_this.rtType = type || Texture.UNSIGNED_BYTE),
          (_this.rtFormat = format || Texture.RGBFormat),
          (_this.rtMipmaps = mipmaps),
          ((_this = this).scene = _scene),
          (_nuke = _this.initClass(Nuke, nuke.stage, {
            renderer: nuke.renderer,
            camera: nuke.camera,
            scene: _scene,
            dpr: nuke.dpr,
            useDrawBuffers: !1,
          })),
          (_parentNuke = _this.parent.nuke || nuke),
          (_nuke.parentNuke = _parentNuke),
          (_this.nuke = _nuke),
          (function initRT(rt) {
            if (_useDrawBuffers) {
              let texture = new Texture();
              ((texture.minFilter = Texture.LINEAR),
                (texture.magFilter = Texture.LINEAR),
                (texture.format = Texture.RGBAFormat),
                _this.rtType && (texture.type = _this.rtType),
                _this.rtFormat && (texture.format = _this.rtFormat),
                _this.rtMipmaps
                  ? ((texture.generateMipmaps = !0),
                    (texture.minFilter = texture.magFilter =
                      Texture.LINEAR_MIPMAP))
                  : (texture.generateMipmaps = !1),
                texture.type == Texture.FLOAT &&
                  (texture.format = Texture.RGBAFormat),
                (texture.wrapS = texture.wrapT = Texture.CLAMP_TO_EDGE),
                (texture.fxLayer = _this),
                (_this.textureIndex = _textureIndex =
                  _parentNuke.attachDrawBuffer(texture)),
                (_rt = { texture: texture }));
            } else
              (_this.rtType &&
                _this.rtType == Texture.FLOAT &&
                "ios" == Device.system.os &&
                (_this.rtType = Texture.HALF_FLOAT),
                (_rt =
                  rt ||
                  Utils3D.createRT(
                    Math.round(
                      _nuke.stage.width * _this.resolution * _nuke.dpr,
                    ),
                    Math.round(
                      _nuke.stage.height * _this.resolution * _nuke.dpr,
                    ),
                    _this.rtType,
                    _this.rtFormat,
                  )),
                _this.rtMipmaps
                  ? ((_rt.texture.minFilter = _rt.texture.magFilter =
                      Texture.LINEAR_MIPMAP),
                    (_rt.texture.generateMipmaps = !0))
                  : (_rt.texture.generateMipmaps = !1));
            ((_this.rt = _rt), _this.nuke.setSize(_rt.width, _rt.height));
          })(rt),
          (function addListeners() {
            _this.events.sub(Events.RESIZE, resizeHandler);
          })(),
          manualRender ||
            FXScene.manualRender ||
            _this.startRender((_) => _this.draw(), nuke));
      }),
      (this.addObject = this.add =
        function (object) {
          if (_nuke) {
            if (!_useDrawBuffers) {
              let clone = object.clone();
              for (
                object["clone_" + _id] = clone,
                  _scene.add(clone),
                  _objects.push(object),
                  object.shader &&
                    (function editShader(mesh) {
                      let modifyShader = (shader, name) => {
                          let fs = shader._fragmentShader;
                          if (!fs) return;
                          let marker = "#drawbuffer " + name;
                          if (fs.includes(marker)) {
                            let split = fs.split(marker + " ");
                            fs = split.join("");
                          }
                          for (; fs.includes("#drawbuffer"); ) {
                            fs = fs.split("\n");
                            for (let i = 0; i < fs.length; i++)
                              fs[i].includes("#drawbuffer") && (fs[i] = "");
                            fs = fs.join("\n");
                          }
                          shader.fragmentShader = fs;
                        },
                        applyShadow = (shader, bool) => {
                          let fs = shader.fragmentShader;
                          if (fs) {
                            for (; fs.includes("#applyShadow"); ) {
                              fs = fs.split("\n");
                              for (let i = 0; i < fs.length; i++)
                                bool
                                  ? fs[i].includes("#applyShadow") &&
                                    (fs[i] = fs[i].replace("#applyShadow", ""))
                                  : fs[i].includes("#applyShadow") &&
                                    (fs[i] = "");
                              fs = fs.join("\n");
                            }
                            shader.fragmentShader = fs;
                          }
                        };
                      (mesh.shader._fragmentShader ||
                        (mesh.shader._fragmentShader =
                          mesh.shader.fragmentShader),
                        modifyShader(mesh.shader, "Color"));
                      let shader = mesh.shader.clone(
                        !_this.renderShadows,
                        `-${_this.name || _name}`,
                      );
                      (modifyShader(shader, _this.name || _name),
                        applyShadow(shader, _this.renderShadows),
                        applyShadow(mesh.shader, !0),
                        mesh.shader.copyUniformsTo(shader, !0),
                        (mesh.shader = shader));
                    })(clone);
                clone.children.length;
              )
                clone.remove(clone.children[0]);
              return clone;
            }
            object.shader &&
              object.shader.fragmentShader &&
              (!(function editDBShader(mesh) {
                const WEBGL2 = Renderer.type == Renderer.WEBGL2;
                let modifyMarker = (fs, name, index) => {
                    if (WEBGL2) {
                      if (
                        fs.includes(
                          "layout(location=0) out vec4 reflectionsData",
                        )
                      )
                        return fs;
                      if (!fs.includes(`layout(location=${index})`)) {
                        let mainAt = (fs = fs.replace(
                            "out vec4 FragColor;",
                            "",
                          )).indexOf("void main()"),
                          before = fs.slice(0, mainAt),
                          after = fs.slice(mainAt);
                        fs =
                          before +
                          `layout(location=${index}) out vec4 ${name};\n` +
                          after;
                      }
                    }
                    let marker = "#drawbuffer " + name;
                    if (fs.includes(marker)) {
                      let split = fs.split(marker + " "),
                        finalOut = WEBGL2 ? name : `gl_FragData[${index}]`;
                      for (let i = 1; i < split.length; ++i)
                        split[i] = split[i].replace("gl_FragColor", finalOut);
                      fs = split.join("");
                    }
                    for (; fs.includes("#applyShadow"); ) {
                      fs = fs.split("\n");
                      for (let i = 0; i < fs.length; i++)
                        fs[i].includes("#applyShadow") &&
                          (fs[i] = fs[i].replace("#applyShadow", ""));
                      fs = fs.join("\n");
                    }
                    return fs;
                  },
                  shader = mesh.shader,
                  fs = shader.fragmentShader,
                  name = _this.name || _name;
                ((WEBGL2 && fs.includes("location=0")) ||
                  (fs = modifyMarker(fs, "Color", 0)),
                  (fs = modifyMarker(fs, name, _textureIndex)),
                  (shader.fragmentShader = fs));
              })(object),
              (object.shader._attachmentData = {
                format: _this.rtFormat,
                type: _this.rtType,
                attachments: _parentNuke.attachments,
              }));
          }
        }),
      (this.removeObject = function (object) {
        _nuke &&
          (_scene.remove(object["clone_" + _id]),
          _objects.remove(object),
          delete object["clone_" + _id]);
      }),
      (this.render = this.draw =
        function (stage, camera) {
          if (!_nuke || !_this.enabled || _useDrawBuffers) return;
          if (!_parentNuke.enabled || !_objects.length) return;
          const oldClear = Renderer.CLEAR;
          ((Renderer.CLEAR = CLEAR_COLOR),
            stage &&
              ((_nuke.stage = stage), _this.setSize(stage.width, stage.height)),
            (_nuke.camera = camera || _nuke.parentNuke.camera),
            _this.renderShadows ||
              (_nuke.renderer.overridePreventShadows = !0));
          for (let i = _objects.length - 1; i > -1; i--) {
            let obj = _objects[i],
              clone = obj["clone_" + _id];
            (_this.forceVisible
              ? (clone.visible = !0)
              : (clone.visible = obj.determineVisible()),
              clone.visible &&
                (obj.updateMatrixWorld(),
                obj.ignoreMatrix || Utils3D.decompose(obj, clone)));
          }
          ((_nuke.rtt = _rt),
            _nuke.render(),
            RenderStats.update("FXLayer"),
            (_nuke.renderer.overridePreventShadows = !1),
            (Renderer.CLEAR = oldClear));
        }),
      (this.addPass = function (pass) {
        _nuke && _nuke.add(pass);
      }),
      (this.removePass = function (pass) {
        _nuke && _nuke.remove(pass);
      }),
      (this.setSize = function (width, height) {
        _nuke &&
          ((_rt.width == width && _rt.height == height) ||
            (_this.events.unsub(Events.RESIZE, resizeHandler),
            _rt &&
              _rt.setSize(
                width * _this.resolution * _nuke.dpr,
                height * _this.resolution * _nuke.dpr,
              ),
            _nuke.setSize(
              width * _this.resolution * _nuke.dpr,
              height * _this.resolution * _nuke.dpr,
            )));
      }),
      (this.setDPR = function (dpr) {
        _nuke && ((_nuke.dpr = dpr), resizeHandler());
      }),
      (this.setResolution = function (res) {
        ((_this.resolution = res), resizeHandler());
      }),
      (this.getObjects = function () {
        return _objects;
      }),
      (this.useRT = function (rt) {
        _rt = _this.rt = rt;
      }),
      (this.getName = function () {
        return _this.name || _name;
      }),
      _parentNuke instanceof Nuke && this.create(_parentNuke, _type),
      _parentNuke.isAppState)
    ) {
      let config = _parentNuke;
      (this.create(_this.parent.nuke || config.nuke, config),
        (this.name = config.name));
    }
  }),
  Namespace("FX"),
  Class(function FXScene(_parentNuke, _type, ...rest) {
    Inherit(this, Component);
    var _nuke,
      _rt,
      _rtPool,
      _showManualRenderWarning,
      _this = this,
      _scene = new Scene(),
      _id = Utils.timestamp(),
      _objects = [],
      _renderTime = Render.TIME,
      _visible = !0;
    function resizeHandler() {
      (_rt.setSize &&
        _rt.setSize(
          _nuke.stage.width * _this.resolution * _nuke.dpr,
          _nuke.stage.height * _this.resolution * _nuke.dpr,
        ),
        _this.nuke.setSize(_rt.width, _rt.height),
        (_this.width = _rt.width),
        (_this.height = _rt.height));
    }
    ((this.resolution = 1),
      (this.autoVisible = !0),
      (this.enabled = !0),
      (this.scene = _scene),
      (this.renderShadows = !0),
      this.set("visible", (v) => {
        _this.scene &&
          ((_this.scene.visible = _visible = v),
          _this.onFXSceneVisibility?.(v));
      }),
      this.get("visible", (_) => _visible),
      (this.onInvisible = this.fxInvisible =
        function () {
          (this.scene.visible &&
            ((this.scene.visible = !1), _this.flag("needsOnVisible", !0)),
            _rtPool && _rtPool.putRT(_this.rt));
        }),
      this._bindOnDestroy(function () {
        _rtPool && _rtPool.putRT(_this.rt);
      }),
      (this.onVisible = this.fxVisible =
        function () {
          (_this.flag("needsOnVisible") &&
            ((this.scene.visible = !0), _this.flag("needsOnVisible", !1)),
            _rtPool && (_this.useRT(_rtPool.getRT()), resizeHandler()));
        }),
      (this.create = function (nuke = World.NUKE, rt, options) {
        _this.nuke ||
          (rt instanceof RTPool && (rt = (_rtPool = rt).nullRT),
          nuke instanceof RTPool
            ? ((options = rt),
              (rt = (_rtPool = nuke).nullRT),
              (nuke = World.NUKE))
            : rt && "object" == typeof rt
              ? rt.isRT || ((options = rt), (rt = void 0))
              : !nuke ||
                nuke instanceof Nuke ||
                ((options = nuke), (nuke = World.NUKE)),
          options || (options = {}),
          (_this.rtFormat = options.format || Texture.RGBFormat),
          (_this.rtType = options.type || Texture.UNSIGNED_BYTE),
          (options.vr || options.vrMode) &&
            (_this.vrRT = RenderManager.type == RenderManager.VR),
          options.parentNuke && (nuke = options.parentNuke),
          ((_this = this).scene = _scene),
          (_this.nuke = _nuke =
            _this.initClass(Nuke, nuke.stage, {
              renderer: nuke.renderer,
              camera: nuke.camera,
              scene: _scene,
              dpr: nuke.dpr,
              format: options.format,
              vrRT: _this.vrRT,
              multisample: options.multisample,
              samplesAmount: options.samplesAmount,
            })),
          (_scene.nuke = _nuke),
          (function initRT(rt, options = {}) {
            options.type == Texture.FLOAT &&
              ((options.format = Texture.RGBAFormat),
              "ios" == Device.system.os &&
                ((options.type = Texture.HALF_FLOAT),
                (options.minFilter = Texture.NEAREST),
                (options.magFilter = Texture.NEAREST)));
            const RT =
              _this.nuke.useDrawBuffers && options.multiRenderTarget
                ? MultiRenderTarget
                : RenderTarget;
            ((_this.width = _nuke.stage.width * _this.resolution * _nuke.dpr),
              (_this.height =
                _nuke.stage.height * _this.resolution * _nuke.dpr));
            let magFilter = Texture.LINEAR,
              minFilter = options.mipmaps
                ? Texture.LINEAR_MIPMAP
                : Texture.LINEAR;
            ((_rt =
              rt ||
              new RT(
                _this.width,
                _this.height,
                Object.assign(
                  {
                    minFilter: minFilter,
                    magFilter: magFilter,
                    generateMipmaps: options.mipmaps || !1,
                  },
                  options,
                ),
              )),
              (_nuke.rtt = _this.rt = _rt),
              (_rt.fxscene = _this),
              _this.vrRT && (_rt.vrRT = !0));
          })(rt, options),
          rt
            ? _this.flag("recycle_rt", !0)
            : (function addListeners() {
                _this.events.sub(Events.RESIZE, resizeHandler);
              })(),
          FXScene.onCreate && FXScene.onCreate(_this),
          options.manualRender ||
            _this.manualRender ||
            FXScene.manualRender ||
            (Hydra.LOCAL && (_showManualRenderWarning = !0),
            _this.vrRT
              ? _this.startRender(({ view: view }) => {
                  0 !== view || _this.manualRender || _this.draw();
                }, RenderManager.EYE_RENDER)
              : _this.startRender((_) => {
                  _this.manualRender || _this.draw();
                }, nuke)));
      }),
      (this.onDestroy = this.fxDestroy =
        function () {
          ((_this.scene.deleted = !0),
            _this.flag("recycle_rt")
              ? _rtPool && _rt && _rtPool.putRT(_rt)
              : _rt && _rt.destroy && _rt.destroy());
        }),
      (this.setSize = function (width, height, exact) {
        _nuke &&
          (exact ||
            ((width = width * _this.resolution * _nuke.dpr),
            (height = height * _this.resolution * _nuke.dpr)),
          (_rt.width == width && _rt.height == height) ||
            (_this.events.unsub(Events.RESIZE, resizeHandler),
            (_this.width = width),
            (_this.height = height),
            _rt && _rt.setSize(_this.width, _this.height),
            _nuke.setSize(_this.width, _this.height)));
      }),
      (this.add = this.addObject =
        function (object) {
          if (!object.shader) return;
          if (!object) return console.error("FXScene addObject undefined!");
          let clone = object.clone();
          for (
            object["clone_" + _id] = clone,
              _scene.add(clone),
              _objects.push(object),
              object.shader._attachmentData = {
                format: _this.rtFormat,
                type: _this.rtType,
                attachments: 1,
              };
            clone.children.length;
          )
            clone.remove(clone.children[0]);
          return clone;
        }),
      (this.removeObject = function (object) {
        (_scene.remove(object["clone_" + _id]),
          _objects.remove(object),
          delete object["clone_" + _id]);
      }),
      (this.setScissor = function (x, y, w, h, invert) {
        if (null === x) return void (this.scissor = this.rt.scissor = null);
        let width = _rt.width,
          height = _rt.height;
        (this.scissor || (this.scissor = new Vector4()),
          (this.scissor.x = x * width),
          (this.scissor.y = invert
            ? y * height
            : height - h * height - y * height),
          (this.scissor.width = w * width),
          (this.scissor.height = h * height),
          (this.rt.scissor = this.scissor));
      }),
      (this.render = this.draw =
        function (stage, camera) {
          if (_this.preventRender) return;
          if (_this.isVrWorldMode)
            return void (_this.onBeforeRender && _this.onBeforeRender());
          if (
            !_this.manualRender &&
            Render.TIME - _renderTime < 1e3 / Render.REFRESH_RATE / 2
          )
            return void (
              _showManualRenderWarning &&
              (console.warn(
                `FXScene ${Utils.getConstructorName(_this)} rendering early (${Math.round(Render.TIME - _renderTime, 3)}ms elapsed, expected ~${Math.round(1e3 / Render.REFRESH_RATE, 3)}ms. Set manualRender option if using own render loop.`,
              ),
              (_showManualRenderWarning = !1))
            );
          if (((_renderTime = Render.TIME), _this.isVrSceneMode)) {
            let rt =
                World.NUKE.enabled && World.NUKE.passes.length
                  ? World.NUKE.rttBuffer
                  : void 0,
              autoClear = _nuke.renderer.autoClear;
            return (
              (_nuke.renderer.autoClear = !1),
              _nuke.renderer.clearDepth(rt),
              _this.onBeforeRender && _this.onBeforeRender(),
              _nuke.renderer.render(_scene, _nuke.camera, rt),
              void (_nuke.renderer.autoClear = autoClear)
            );
          }
          (stage &&
            (_this.events.unsub(Events.RESIZE, resizeHandler),
            (_this.nuke.stage = stage),
            _this.setSize(stage.width, stage.height)),
            camera && (_this.nuke.camera = camera));
          let clearColor = null,
            alpha = 1;
          (_this.clearColor &&
            ((clearColor = _nuke.renderer.getClearColor().getHex()),
            _nuke.renderer.setClearColor(_this.clearColor)),
            _this.clearAlpha > -1 &&
              ((alpha = _nuke.renderer.getClearAlpha()),
              _nuke.renderer.setClearAlpha(_this.clearAlpha)),
            _this.renderShadows ||
              (_nuke.renderer.overridePreventShadows = !0));
          for (let i = _objects.length - 1; i > -1; i--) {
            let obj = _objects[i],
              clone = obj["clone_" + _id];
            (_this.forceVisible || obj.cloneVisible
              ? (clone.visible =
                  "boolean" != typeof clone.isVisible || clone.isVisible)
              : (clone.visible = obj.determineVisible()),
              clone.visible &&
                (obj.updateMatrixWorld(!1 === obj.visible || void 0),
                obj.ignoreMatrix ||
                  (Utils3D.decompose(obj, clone),
                  clone.overrideScale &&
                    clone.scale.setScalar(clone.overrideScale))));
          }
          (_this.preventRTDraw ||
            (RenderStats.update("FXScene", 1, _this),
            _this.onBeforeRender && _this.onBeforeRender(),
            (_nuke.rtt = _rt),
            _nuke.render()),
            (_nuke.renderer.overridePreventShadows = !1),
            _this.clearColor && _nuke.renderer.setClearColor(clearColor),
            _this.clearAlpha > -1 &&
              _nuke.renderer.setClearAlpha(_this.clearAlpha),
            RenderManager.fire(_this));
        }),
      (this.setDPR = function (dpr) {
        return _nuke ? ((_nuke.dpr = dpr), resizeHandler(), _this) : _this;
      }),
      (this.addPass = function (pass) {
        _nuke && _nuke.add(pass);
      }),
      (this.removePass = function (pass) {
        _nuke && _nuke.remove(pass);
      }),
      (this.setResolution = function (res) {
        return (
          (_this.resolution = res),
          _rt.vrRT && (_rt.vrRT = res),
          resizeHandler(),
          this
        );
      }),
      (this.useRT = function (rt) {
        ((_rt = _this.rt = rt), _this.vrRT && (rt.vrRT = !0));
      }),
      (this.upload = function () {
        _rt && _rt.upload();
      }),
      (this.useCamera = function (camera) {
        _this.nuke && (_this.nuke.camera = camera.camera || camera);
      }),
      (this.useScene = function (scene) {
        _this.nuke.scene = scene;
      }),
      (this.vrWorldMode = function () {
        ((_this.isVrWorldMode = !0), (_this.group = new Group()));
        for (let i = 0; i < this.scene.children.length; i++)
          this.group.add(this.scene.children[i]);
        ((_scene = _this.scene = _this.group), World.SCENE.add(_this.group));
      }),
      (this.vrSceneMode = function () {
        ((_this.isVrSceneMode = !0),
          (World.NUKE.autoClear = !1),
          (RenderManager.renderer.autoClear = !1));
      }),
      (this.createDepthTexture = function (useRTTBuffer) {
        return (
          _this.depthTexture ||
            (_this.nuke.passes.length || useRTTBuffer
              ? (_this.nuke.rttBuffer.createDepthTexture(),
                (_this.depthTexture = _this.nuke.rttBuffer.depth))
              : (_this.rt.createDepthTexture(),
                (_this.depthTexture = _this.rt.depth))),
          _this.depthTexture
        );
      }),
      _parentNuke instanceof Nuke && this.create(_parentNuke, _type, ...rest));
  }),
  Class(function FXSceneCompositor(_shader, _options = {}) {
    Inherit(this, Object3D);
    const _this = this;
    var _basicShader;
    function decorateShader(shader) {
      shader.addUniforms({
        tFrom: { value: null },
        tTo: { value: null },
        uTransition: { value: 0 },
      });
    }
    function loop() {
      ((_this.mesh.shader =
        _shader.uniforms.uTransition.value > 0 ? _shader : _basicShader),
        _shader.uniforms.uTransition.value >= 1 &&
          ((_this.mesh.shader = _basicShader),
          _basicShader.set("tMap", _shader.get("tTo")),
          _shader.set("uTransition", 0)));
    }
    (!(function initOptions() {
      (null === _options ||
        _options instanceof Texture ||
        _options.texture ||
        (_options.rt && _options.rt.texture)) &&
        (_options = { startTexture: _options });
    })(),
      decorateShader(_shader),
      (function initMesh() {
        let uniforms = { tMap: { value: _options.startTexture || null } };
        (_options.basicShader
          ? (_basicShader = _options.basicShader).addUniforms(uniforms)
          : (_basicShader = _this.initClass(Shader, "ScreenQuad", uniforms)),
          (_this.mesh = new Mesh(World.QUAD, _basicShader)),
          (_this.mesh.frustumCulled = !1),
          _this.add(_this.mesh));
      })(),
      _this.startRender(loop),
      (this.useShader = function (shader) {
        ((_shader = shader), decorateShader(shader));
      }),
      (this.useBasicShader = function (shader) {
        (_basicShader.copyUniformsTo(shader, !0), (_basicShader = shader));
      }),
      (this.swap = function (showTransition) {
        showTransition
          ? (_this.mesh.shader = _shader)
          : (_basicShader.set("tMap", _shader.get("tTo")),
            (_this.mesh.shader = _basicShader),
            _shader.set("tFrom", _basicShader.get("tMap")));
      }),
      this.set("manual", (v) => {
        v ? _this.stopRender(loop) : _this.startRender(loop);
      }),
      (this.transition = async function (texture, time, ease, delay) {
        _this.parent.lock && _this.parent.lock();
        let from = _shader.get("tFrom");
        (_shader.set("tTo", texture),
          (texture.visible = !0),
          from
            ? await _shader.tween("uTransition", 1, time, ease, delay).promise()
            : _shader.set("uTransition", 1),
          from && (from.visible = !1),
          _shader.set("tFrom", texture),
          _this.parent.unlock && _this.parent.unlock());
      }));
  }),
  Class(function FXStencil() {
    Inherit(this, Component);
    const _this = this;
    var _nuke;
    function render() {
      _nuke ||
        (_nuke = (function findNuke() {
          let p = _this.mesh._parent;
          for (; p; ) {
            if (p instanceof Scene) return p.nuke;
            p = p._parent;
          }
        })());
      let autoClear = World.RENDERER.autoClear;
      ((World.RENDERER.autoClear = !1),
        _this.enabled &&
          (_this.onBeforeMaskRendered && _this.onBeforeMaskRendered(),
          World.RENDERER.setupStencilMask(),
          World.RENDERER.render(_this.mask, _nuke.camera, "stencil"),
          _this.onAfterMaskRendered && _this.onAfterMaskRendered(),
          World.RENDERER.setupStencilDraw(_this.mode)),
        World.RENDERER.render(_this.scene, _nuke.camera, "stencil"),
        (World.RENDERER.autoClear = autoClear),
        World.RENDERER.clearStencil());
    }
    ((this.mesh = new Mesh(World.PLANE, Utils3D.getTestShader())),
      (this.scene = new Scene()),
      (this.mask = new Scene()),
      (this.mode = "inside"),
      (this.enabled = !0),
      (_this.mesh.shader.neverRender = !0),
      (_this.mesh.shader.transparent = !0),
      (_this.mesh.renderOrder = 99999),
      (_this.mesh.onBeforeRender = render),
      (this.onDestroy = function () {
        _this.group._parent.remove(_this.mesh);
      }));
  }),
  Class(function FragCompositor() {
    Inherit(this, Component);
    const _this = this;
    this._initCompositor = function (obj) {
      ((_this.shader = _this.initClass(
        Shader,
        obj.shader,
        _this.parent[obj.uniforms.slice(1)],
      )),
        (_this.basicShader = _this.initClass(
          Shader,
          obj.basicShader || "ScreenQuad",
          _this.parent[obj.uniforms.slice(1)],
        )),
        (_this.compositor = _this.initClass(FXSceneCompositor, _this.shader, {
          basicShader: _this.basicShader,
        })),
        RenderManager.type == RenderManager.NORMAL &&
          (obj.scene || World.SCENE).add(_this.compositor.mesh));
    };
  }),
  Class(function BlitPass(_forceNuke) {
    Inherit(this, NukePass);
    ((this.uniforms = {}),
      this.init("BlitPass"),
      _forceNuke || (this.blitFramebuffer = !0));
  }),
  Class(
    function Nuke(_stage, _params) {
      Inherit(this, Component);
      var _width,
        _height,
        _nukeMesh,
        _this = this,
        _finalTexture = { texture: Utils3D.getEmptyTexture() };
      (_params.renderer || console.error("Nuke :: Must define renderer"),
        (_this.stage = _stage),
        (_this.renderer = _params.renderer),
        (_this.camera = _params.camera),
        (_this.scene = _params.scene),
        (_this.rtt = _params.rtt),
        (_this.enabled = 0 != _params.enabled),
        (_this.passes = _params.passes || []),
        (_this.format = _params.format || Texture.RGBFormat),
        (_this.useDrawBuffers =
          !Utils.query("noDrawBuffers") &&
          !Nuke.NO_DRAWBUFFERS &&
          (void 0 !== _params.useDrawBuffers
            ? _params.useDrawBuffers
            : !(Renderer.type != Renderer.WEBGL2 && !window.Metal))));
      var _rttPing,
        _rttPong,
        _rttBuffer,
        _dpr = _params.dpr || 1,
        _drawBuffers = [],
        _enabledPasses = [],
        _multisample = _params.multisample || !1,
        _samplesAmount = _params.samplesAmount || 4;
      function resizeHandler() {
        var width = _this.stage.width * _dpr,
          height = _this.stage.height * _dpr;
        (_rttPing.setSize(width, height),
          _rttPong.setSize(width, height),
          _rttBuffer.setSize(width, height),
          Nuke.renameRT(
            _width,
            _height,
            width,
            height,
            !1,
            1,
            _this.format,
            !1,
            _samplesAmount,
          ),
          Nuke.renameRT(
            _width,
            _height,
            width,
            height,
            !1,
            2,
            _this.format,
            !1,
            _samplesAmount,
          ),
          Nuke.renameRT(
            _width,
            _height,
            width,
            height,
            _this.useDrawBuffers,
            -1,
            _this.format,
            _multisample,
            _samplesAmount,
          ),
          (_width = width),
          (_height = height));
      }
      ((_this.scene.nuke = _this),
        (function initDefaultPass() {
          if (Nuke.defaultPass) return;
          let upload = (Nuke.defaultPass = new BlitPass()).upload;
          Nuke.defaultPass.upload = function () {
            (upload.apply(this, arguments), (Nuke.defaultPass.uploaded = !0));
          };
        })(),
        (function initNuke() {
          let width = _this.stage.width * _dpr,
            height = _this.stage.height * _dpr;
          ((_rttPing = Nuke.getRT(
            width,
            height,
            !1,
            1,
            _this.format,
            !1,
            _samplesAmount,
          )),
            (_rttPong = Nuke.getRT(
              width,
              height,
              !1,
              2,
              _this.format,
              !1,
              _samplesAmount,
            )),
            (_rttBuffer = Nuke.getRT(
              width,
              height,
              _this.useDrawBuffers,
              -1,
              _this.format,
              _multisample,
              _samplesAmount,
            )),
            ((_nukeMesh = new Mesh(World.QUAD, null)).frustumCulled = !1),
            (_nukeMesh.noMatrices = !0),
            (_nukeMesh.transient = !0),
            (_width = width),
            (_height = height),
            _params.vrRT && ((_this.vrRT = !0), (_rttBuffer.vrRT = !0)));
        })(),
        (function addListeners() {
          _this.events.sub(Events.RESIZE, resizeHandler);
        })(),
        (_this.forceResize = resizeHandler),
        (_this.onBeforeShaderCompile = function (obj) {
          if (!obj) return;
          let shader = obj.shader;
          if (
            !(
              shader &&
              shader.fragmentShader &&
              _this.useDrawBuffers &&
              _drawBuffers.length
            )
          )
            return;
          if (shader.fragmentShader.includes("layout(location")) return;
          const WEBGL2 = Renderer.type == Renderer.WEBGL2;
          let matched = !1;
          if (
            (_drawBuffers.forEach((t, i) => {
              let name = t.fxLayer.getName(),
                keyExpr = WEBGL2
                  ? new RegExp(`\\b${name}\\s*=`)
                  : new RegExp(`\\bgl_FragData\\[${i + 1}\\]\\s*=`),
                defaultOutput = t.fxLayer.defaultOutputColor || "vec4(0.0)";
              if (
                ("Color" === defaultOutput && (defaultOutput = "tmpFragColor"),
                !keyExpr.test(shader.fragmentShader) && _this.useDrawBuffers)
              ) {
                let fs = shader.fragmentShader;
                if (!fs.includes(`#drawbuffer ${name} gl_FragColor`)) {
                  let idx = fs.lastIndexOf("}");
                  ((fs =
                    fs.slice(0, idx) +
                    `#drawbuffer ${name} gl_FragColor = ${defaultOutput};\n` +
                    fs.slice(idx)),
                    (shader.fragmentShader = fs));
                }
                (t.fxLayer.add(obj), (matched = !0));
              }
            }),
            !(WEBGL2 ? /\bColor\s*=/ : /\bgl_FragData\[0\]\s*=/).test(
              shader.fragmentShader,
            ))
          ) {
            let fs = shader.fragmentShader;
            if (!fs.includes("layout(location=0) out vec4 reflectionsData")) {
              (WEBGL2 ||
                (fs = "#extension GL_EXT_draw_buffers : require\n" + fs),
                (fs = fs.split("void main() {")),
                (fs = fs[0] + "void main() {\nvec4 tmpFragColor;\n" + fs[1]),
                (fs = fs.replace(/gl_FragColor/g, "tmpFragColor")));
              let idx = fs.lastIndexOf("}");
              fs = matched
                ? WEBGL2
                  ? fs.slice(0, idx) + "Color = tmpFragColor;\n" + fs.slice(idx)
                  : fs.slice(0, idx) +
                    "gl_FragData[0] = tmpFragColor;\n" +
                    fs.slice(idx)
                : fs.slice(0, idx) +
                  "#drawbuffer Color gl_FragColor = tmpFragColor;\n" +
                  fs.slice(idx);
            }
            shader.fragmentShader = fs;
          }
          shader.onBeforePrecompilePromise.resolve();
        }),
        (_this.add = function (pass, index) {
          "number" != typeof index
            ? _this.passes.push(pass)
            : _this.passes.splice(index, 0, pass);
        }),
        (_this.remove = function (pass) {
          "number" == typeof pass
            ? _this.passes.splice(pass)
            : _this.passes.remove(pass);
        }),
        (_this.render = function (directCallback) {
          if (_this.paused) return;
          (RenderStats.update("Nuke"),
            RenderManager.fire(_this),
            _this.events.fire(Nuke.RENDER, _this, !0),
            _this.onBeforeRender && _this.onBeforeRender());
          let count = _this.passes.length;
          _enabledPasses.length = 0;
          for (let i = 0; i < count; i++) {
            let pass = _this.passes[i];
            pass.disabled || _enabledPasses.push(pass);
          }
          if (
            (_this.enabled &&
              0 === _enabledPasses.length &&
              !_this.rtt &&
              (_dpr !== Device.pixelRatio || _multisample) &&
              Nuke.defaultPass &&
              _enabledPasses.push(Nuke.defaultPass),
            !_this.enabled || !_enabledPasses.length)
          ) {
            let autoClear = _this.renderer.autoClear;
            return (
              0 == _this.autoClear && (_this.renderer.autoClear = !1),
              _this.renderer.render(
                _this.scene,
                _this.camera,
                _this.rtt,
                null,
                directCallback,
              ),
              _this.onBeforeProcess && _this.onBeforeProcess(),
              _this.events.fire(Nuke.BEFORE_PASSES, _this, !0),
              _this.events.fire(Nuke.BEFORE_POST_RENDER, _this, !0),
              _this.postRender && _this.postRender(),
              _this.events.fire(Nuke.POST_RENDER, _this, !0),
              void (
                0 == _this.autoClear &&
                ((_this.renderer.autoClear = autoClear),
                _this.renderer.clearColor())
              )
            );
          }
          (RenderStats.update("NukePass", _enabledPasses.length),
            (_this.hasRendered = !0),
            _this.onBeforeProcess && _this.onBeforeProcess());
          let autoClear = _this.renderer.autoClear;
          (0 == _this.autoClear && (_this.renderer.autoClear = !1),
            _this.parent.scissor && (_rttBuffer.scissor = _this.parent.scissor),
            _this.preventNewRender ||
              _this.renderer.render(_this.scene, _this.camera, _rttBuffer),
            0 == _this.autoClear && (_this.renderer.autoClear = autoClear),
            _this.onBeforePasses && _this.onBeforePasses(_rttBuffer));
          let pingPong = !0,
            skipMultisample = _this.rtt && _this.rtt.multisample;
          (skipMultisample && (_this.rtt.multisample = !1),
            (count = _enabledPasses.length),
            _this.events.fire(Nuke.BEFORE_PASSES, _this, !0));
          for (var i = 0; i < count; i++) {
            let shader = _enabledPasses[i].pass,
              inTexture =
                0 === i
                  ? _rttBuffer.texture
                  : pingPong
                    ? _rttPing.texture
                    : _rttPong.texture,
              outTexture = pingPong ? _rttPong : _rttPing;
            (i === count - 1 && (outTexture = _this.rtt),
              (_nukeMesh.shader = shader),
              (_nukeMesh.shader.depthTest = !1),
              (_nukeMesh.shader.depthWrite = !1),
              (_nukeMesh.shader.uniforms.tDiffuse.value = inTexture),
              _this.parent.scissor &&
                (outTexture.scissor = _this.parent.scissor),
              _this.renderer.renderSingle(
                _nukeMesh,
                _this.camera || World.CAMERA,
                outTexture,
                i === count - 1 ? directCallback : null,
              ),
              _enabledPasses[i]?.onRenderCallBack?.(),
              (pingPong = !pingPong),
              outTexture && (_finalTexture.texture = outTexture.texture));
          }
          (skipMultisample && (_this.rtt.multisample = !0),
            _this.events.fire(Nuke.BEFORE_POST_RENDER, _this, !0),
            _this.postRender && _this.postRender(),
            _this.events.fire(Nuke.POST_RENDER, _this, !0),
            0 == _this.autoClear && _this.renderer.clearColor(_rttBuffer));
        }),
        (_this.setSize = function (width, height) {
          (width == _width && height == _height) ||
            ((_width = width),
            (_height = height),
            resizeHandler(),
            _this.events.unsub(Events.RESIZE, resizeHandler));
        }),
        (_this.attachDrawBuffer = function (texture) {
          if (
            (_this.hasRendered &&
              console.warn(
                "Attempt to attach draw buffer after first render! Create FXLayer instance before first render.",
              ),
            _drawBuffers.push(texture),
            _rttBuffer && _rttBuffer.attachments)
          ) {
            _rttBuffer.attachments = [
              _this.rtt && _this.rtt.attachments
                ? _this.rtt.attachments[0]
                : _rttBuffer.attachments[0],
            ];
            for (let i = 0; i < _drawBuffers.length; i++)
              (_rttBuffer.attachments.push(_drawBuffers[i]),
                _this.rtt &&
                  _this.rtt.attachments &&
                  _this.rtt.attachments.push(_drawBuffers[i]));
          }
          return _drawBuffers.length;
        }),
        (_this.upload = function () {
          (_this.passes.length &&
            _this.enabled &&
            (_rttPing.upload(), _rttPong.upload(), _rttBuffer.upload()),
            _rttBuffer.depth && _rttBuffer.depth.upload(),
            _this.rtt && _this.rtt.upload());
        }),
        _this.set("dpr", function (v) {
          ((_dpr = v), resizeHandler());
        }),
        _this.get("dpr", function () {
          return _dpr;
        }),
        _this.get("output", function () {
          return _nukeMesh.shader && _nukeMesh.shader.uniforms
            ? _nukeMesh.shader.uniforms.tDiffuse.value
            : null;
        }),
        _this.get("finalTexture", (_) => _finalTexture),
        _this.get("rttBuffer", function () {
          return _rttBuffer;
        }),
        this.set("rttBuffer", function (v) {
          _rttBuffer = v;
        }),
        _this.get("prevFrameRT", function () {
          return _rttBuffer && _rttBuffer.texture ? _rttBuffer.texture : null;
        }),
        _this.get("nukeScene", function () {
          return _nukeScene;
        }),
        _this.get("ping", function () {
          return _rttPing;
        }),
        _this.get("pong", function () {
          return _rttPong;
        }),
        _this.get("attachments", function () {
          return _rttBuffer.attachments ? _rttBuffer.attachments.length : 0;
        }),
        (_this.disable = function () {
          ((_this.enabled = !1),
            _this.passes.forEach((pass) => {
              pass.enabled = !1;
            }));
        }),
        (this.onDestroy = function () {
          _rttBuffer.destroy();
        }),
        (this.clearMemory = function () {
          (_rttBuffer.destroy(), _rttPing.destroy(), _rttPong.destroy());
        }));
    },
    function () {
      ((Nuke.RENDER = "nuke_render"),
        (Nuke.BEFORE_PASSES = "nuke_before_passes"),
        (Nuke.BEFORE_POST_RENDER = "nuke_before_post_render"),
        (Nuke.POST_RENDER = "nuke_post_render"));
      var _rts = {};
      ((Nuke.getRT = function (
        width,
        height,
        multi,
        index,
        format,
        multisample,
        samplesAmount,
      ) {
        let rt,
          exists =
            _rts[
              `${width}_${height}_${multi}_${index}_${format}_${multisample}_${samplesAmount}`
            ];
        return (
          exists ||
          ((rt = multi
            ? Utils3D.createMultiRT(
                width,
                height,
                void 0,
                format,
                multisample,
                samplesAmount,
              )
            : Utils3D.createRT(
                width,
                height,
                void 0,
                format,
                multisample,
                samplesAmount,
              )),
          Nuke.recyclePingPong &&
            !multi &&
            (_rts[
              `${width}_${height}_${multi}_${index}_${format}_${multisample}_${samplesAmount}`
            ] = rt),
          rt)
        );
      }),
        (Nuke.renameRT = function (
          prevWidth,
          prevHeight,
          width,
          height,
          multi,
          index,
          format,
          multisample,
          samplesAmount,
        ) {
          _rts[
            `${width}_${height}_${multi}_${index}_${format}_${multisample}_${samplesAmount}`
          ] =
            _rts[
              `${prevWidth}_${prevHeight}_${multi}_${index}_${format}_${multisample}_${samplesAmount}`
            ];
        }));
    },
  ),
  Class(function NukePass(_fs, _uniforms, _pass) {
    Inherit(this, Component);
    var _this = this;
    if ("object" == typeof _fs) {
      let shader = _fs.shader;
      ((_uniforms = _fs.uniforms), (_fs = shader));
    }
    ((this.UILPrefix =
      "string" == typeof _fs ? _fs : Utils.getConstructorName(_fs)),
      (this.init = function (fs, vs) {
        if (_this.pass) return;
        _this = this;
        (fs || this.constructor.toString().match(/function ([^\(]+)/)[1],
          Array.isArray(fs) && fs.join(""));
        if (
          ((_this.uniforms = _uniforms || _this.uniforms || {}),
          (_this.uniforms.tDiffuse = { type: "t", value: null, ignoreUIL: !0 }),
          _this.uniforms.unique &&
            (_this.UILPrefix += "_" + _this.uniforms.unique + "_"),
          window.UILStorage)
        )
          for (let key in _this.uniforms)
            "unique" !== key &&
              (_this.uniforms[key] =
                UILStorage.parse(
                  _this.UILPrefix + key,
                  _this.uniforms[key].value,
                ) || _this.uniforms[key]);
        ((_this.pass = _this.initClass(
          Shader,
          vs || "NukePass",
          fs,
          Utils.mergeObject(_this.uniforms, { precision: "high" }),
          (code, type) =>
            "fs" == type
              ? (function prefix(code) {
                  if (!code) throw `No shader ${_fs} found`;
                  let pre = "";
                  return (
                    code.includes("uniform sampler2D tDiffuse") ||
                      ((pre += "uniform sampler2D tDiffuse;\n"),
                      (pre += "varying vec2 vUv;\n")),
                    pre + code
                  );
                })(code)
              : code,
        )),
          (_this.uniforms = _this.pass.uniforms));
      }),
      (this.set = function (key, value) {
        (TweenManager.clearTween(_this.uniforms[key]),
          (_this.uniforms[key].value = value));
      }),
      (this.get = function (key) {
        return void 0 === _this.uniforms[key]
          ? null
          : _this.uniforms[key].value;
      }),
      (this.tween = function (key, value, time, ease, delay, callback, update) {
        return tween(
          _this.uniforms[key],
          { value: value },
          time,
          ease,
          delay,
          callback,
          update,
        );
      }),
      (this.clone = function () {
        return (
          _this.pass || _this.init(_fs),
          new NukePass(null, null, _this.pass.clone())
        );
      }),
      (this.upload = function () {
        _this.pass.upload();
      }),
      (this.addUniforms = function (obj) {
        for (let key in obj) _this.uniforms[key] = obj[key];
      }),
      "string" == typeof _fs
        ? _this.init(_fs)
        : _pass && ((_this.pass = _pass), (_this.uniforms = _pass.uniforms)));
  }),
  Class(
    function Raycaster(_camera) {
      Inherit(this, Component);
      const _this = this;
      let _mouse = new Vector3(),
        _raycaster = new RayManager();
      function ascSort(a, b) {
        return a.distance - b.distance;
      }
      function intersectObject(object, raycaster, intersects, recursive) {
        let obj = object;
        for (; obj && _this.testVisibility; ) {
          if (
            !1 === obj.visible &&
            !obj.forceRayVisible &&
            !1 !== obj.testVisibility
          )
            return;
          obj = obj.parent;
        }
        if (
          object.raycast &&
          (object.raycast(raycaster, intersects), !0 === recursive)
        ) {
          let children = object.children;
          for (let i = 0, l = children.length; i < l; i++)
            intersectObject(children[i], raycaster, intersects, !0);
        }
      }
      function intersect(objects) {
        Array.isArray(objects) || (objects = [objects]);
        let intersects = [];
        return (
          objects.forEach((object) => {
            intersectObject(object, _raycaster, intersects, !1);
          }),
          intersects.sort(ascSort),
          intersects
        );
      }
      ((this.testVisibility = !0),
        this.set("camera", function (camera) {
          _camera = camera;
        }),
        this.set("pointsThreshold", function (value) {
          _raycaster.params.Points.threshold = value;
        }),
        this.get("ray", () => _raycaster.ray),
        (this.checkHit = function (objects, mouse, rect = Stage) {
          return (
            (mouse = mouse || Mouse),
            (_mouse.x = (mouse.x / rect.width) * 2 - 1),
            (_mouse.y = (-mouse.y / rect.height) * 2 + 1),
            _raycaster.setFromCamera(_mouse, _camera),
            intersect(objects)
          );
        }),
        (this.checkFromValues = function (objects, origin, direction) {
          return (
            _raycaster.set(origin, direction, 0, Number.POSITIVE_INFINITY),
            intersect(objects)
          );
        }));
    },
    (_) => {
      var _ray,
        _map = new WeakMap();
      ((Raycaster.checkHit = function (objects, mouse) {
        return (
          _ray || (_ray = new Raycaster(World.CAMERA)),
          _ray.checkHit(objects, mouse)
        );
      }),
        (Raycaster.checkFromValues = function (objects, origin, direction) {
          return (
            _ray || (_ray = new Raycaster(World.CAMERA)),
            _ray.checkFromValues(objects, origin, direction)
          );
        }),
        (Raycaster.find = function (camera) {
          if (!_map.has(camera)) {
            let ray = new Raycaster(camera);
            _map.set(camera, ray);
          }
          return _map.get(camera);
        }));
    },
  ),
  Class(
    function ScreenProjection(_camera) {
      Inherit(this, Component);
      var _v3 = new Vector3(),
        _v32 = new Vector3(),
        _value = new Vector3();
      ((_camera = _camera.camera || _camera),
        this.set("camera", function (v) {
          _camera = v.camera || v;
        }),
        this.get("camera", (_) => _camera),
        (this.unproject = function (mouse, rect = Stage, distance = 1) {
          ("number" == typeof rect && ((distance = rect), (rect = Stage)),
            _v3.set(
              (mouse.x / rect.width) * 2 - 1,
              (-mouse.y / rect.height) * 2 + 1,
              0.5,
            ),
            _v3.unproject(_camera));
          let pos = _camera.getWorldPosition();
          return (
            _v3.sub(pos).normalize().multiplyScalar(distance),
            _value.copy(pos).add(_v3),
            _value
          );
        }),
        (this.project = function (pos, screen) {
          return (
            (screen = screen || Stage),
            pos instanceof Base3D
              ? (pos.updateMatrixWorld(),
                _v32.set(0, 0, 0).setFromMatrixPosition(pos.matrixWorld))
              : _v32.copy(pos),
            _v32.project(_camera),
            (_v32.x = ((_v32.x + 1) / 2) * screen.width),
            (_v32.y = (-(_v32.y - 1) / 2) * screen.height),
            _v32
          );
        }));
    },
    (_) => {
      var _screen,
        _map = new WeakMap();
      ((ScreenProjection.unproject = function (mouse, distance) {
        return (
          _screen || (_screen = new ScreenProjection(World.CAMERA)),
          _screen.unproject(mouse, distance)
        );
      }),
        (ScreenProjection.project = function (pos, screen) {
          return (
            _screen || (_screen = new ScreenProjection(World.CAMERA)),
            _screen.project(pos, screen)
          );
        }),
        (ScreenProjection.find = function (camera) {
          if (!_map.has(camera)) {
            let projection = new ScreenProjection(camera);
            _map.set(camera, projection);
          }
          return _map.get(camera);
        }));
    },
  ),
  Class(function Object3D() {
    Inherit(this, Component);
    var _this = this,
      _visible = !0;
    ((this.__element = !0),
      (this.group = new Group()),
      (this.group.classRef = this),
      (this.add = function (child) {
        this.group.add(child.group || child);
      }),
      (this.remove = function (child) {
        child && this.group.remove(child.group || child);
      }),
      (this.onDestroy = function () {
        ((this.group.deleted = !0),
          (this.group.classRef = null),
          this.group &&
            this.group._parent &&
            this.group._parent.remove(this.group));
      }),
      this.set("visible", (v) => (_this.group.visible = _visible = v)),
      this.get("visible", (_) => _visible));
  }),
  Class(function OrbitTargetHelper() {
    Inherit(this, Object3D);
    const _this = this;
    var _velocity = new (function VelocityTracker(_vector) {
      var Vector = "number" == typeof _vector.z ? Vector3 : Vector2,
        _velocity = new Vector(),
        _last = new Vector();
      ((this.value = _velocity),
        (this.update = function loop(time, delta) {
          (_velocity
            .subVectors(_vector, _last)
            .divideScalar((delta || Render.DELTA) / (1e3 / 60)),
            _last.copy(_vector));
        }));
    })(_this.group.position);
    function set() {
      (_this.flag("needsReset", !1),
        Playground.instance().orbitControls.target.copy(_this.group.position),
        _this.events.unsub(Mouse.input, Interaction.END, set));
    }
    !(async function () {
      Global.PLAYGROUND &&
        (await defer(),
        Playground.instance().orbitControls.target.copy(_this.group.position),
        _this.startRender((_) => {
          (_velocity.update(),
            _velocity.value.length() > 0 &&
              (_this.flag("needsReset", !0),
              _this.events.sub(Mouse.input, Interaction.END, set)));
        }));
    })();
  }),
  Class(function Utils3D() {
    const _this = this;
    var _emptyTexture,
      _q,
      _v3,
      _v3b,
      _v3c,
      _m4,
      _v4,
      _supportsKtx1,
      _textures = {},
      _restorable = {},
      _dominantColors = {};
    function getTexture(key, params, loadTexture) {
      if (!Device.graphics.webgl && !window.AURA) {
        let texture = params.isTexture3D ? new Texture3D() : new Texture();
        return (
          (texture.promise = Promise.resolve()),
          (texture.dimensions = params.isTexture3D
            ? { width: 0, height: 0, depth: 0 }
            : { width: 0, height: 0 }),
          texture
        );
      }
      let restorable = _restorable[key];
      if (
        (restorable &&
          ((restorable = restorable.deref()), delete _restorable[key]),
        restorable)
      )
        restorable.restore();
      else if (_textures[key]) _textures[key].exists++;
      else {
        let texture = params.isTexture3D ? new Texture3D() : new Texture();
        (params.isCubeLUT && (texture.isCubeLUT = !0),
          (texture.exists = 1),
          (texture.loaded = !1),
          (texture.promise = Promise.create()),
          (texture._destroy = texture.destroy),
          (texture.destroy = function (force) {
            (!force && (texture.forcePersist || --texture.exists > 0)) ||
              ((texture.exists ||
                texture._image ||
                texture._gl ||
                _textures[key]) &&
                (delete _textures[key],
                delete _dominantColors[key],
                RenderCount.remove(
                  `tex_${texture?.dimensions?.width}_${texture?.dimensions?.height}`,
                ),
                RenderCount.remove(
                  "tex_" + (texture.compressed ? "compressed" : "uncompressed"),
                ),
                (_restorable[key] = new WeakRef(this)),
                this._destroy()));
          }),
          (_textures[key] = texture),
          !1 === params.premultiplyAlpha && (texture.premultiplyAlpha = !1),
          _this.onTextureCreated && _this.onTextureCreated(texture));
        let doLoadTexture = async () => {
          try {
            (await loadTexture(texture),
              (texture.loaded = !0),
              (texture.needsReupload = !0),
              RenderCount.add(
                `tex_${texture.dimensions.width}_${texture.dimensions.height}`,
              ),
              RenderCount.add(
                "tex_" + (texture.compressed ? "compressed" : "uncompressed"),
              ),
              texture.onload && (texture.onload(), (texture.onload = null)),
              texture.promise.resolve());
          } catch (e) {
            texture.promise.reject(e);
          }
        };
        (doLoadTexture(texture),
          (texture.restore = function () {
            (delete _restorable[key],
              texture.exists++,
              _textures[key] ||
                ((texture.promise = Promise.create()),
                (texture.loaded = texture.needsReupload = !1),
                (_textures[key] = texture),
                texture.dominantColors &&
                  !_dominantColors[key] &&
                  (_dominantColors[key] = texture.dominantColors),
                doLoadTexture(texture)));
          }));
      }
      return _textures[key];
    }
    function loadTextureSource(texture, path, params) {
      let promise = Promise.create();
      return (
        ImageDecoder.decode(path, params)
          .then((imgBmp) => {
            ((imgBmp.crossOrigin = "anonymous"),
              (texture.dimensions = {
                width: imgBmp.width,
                height: imgBmp.height,
              }),
              (texture.loaded = !0),
              (texture.needsReupload = !0),
              texture.compressed &&
                !imgBmp.compressedData &&
                (texture.compressed = !1),
              World.RENDERER.type === Renderer.WEBGL2 ||
                Math.isPowerOf2(imgBmp.width, imgBmp.height) ||
                ((texture.minFilter = Texture.LINEAR),
                (texture.generateMipmaps = !1)),
              promise.resolve(imgBmp));
          })
          .catch((e) => {
            promise.reject(e);
          }),
        promise
      );
    }
    function parseTexturePath(path) {
      if (path.includes("://")) {
        let guard = path.split("://");
        ((guard[1] = guard[1].replace(/\/\//g, "/")),
          (path = guard.join("://")));
      } else path = path.replace(/\/\//g, "/");
      let compressed, compressedIdentifier, cacheBust;
      if (
        (({
          compressed: compressed,
          compressedIdentifier: compressedIdentifier,
          path: path,
        } = parseCompressed(path)),
        window.URLSearchParams)
      ) {
        if (path.includes("?")) {
          let [withoutQuery, query] = path.split("?"),
            params = new URLSearchParams(query);
          for (const [key, value] of params.entries()) {
            let check = key;
            (key.includes("-compressedKtx") &&
              (check = key.substring(0, key.indexOf("-compressedKtx"))),
              Number.isInteger(Number(check)) &&
                Number(check) > 0 &&
                "" === value &&
                (params.delete(key),
                check !== key &&
                  compressed &&
                  (withoutQuery += compressedIdentifier),
                (cacheBust = !0)));
          }
          cacheBust &&
            ((path = withoutQuery),
            (query = params.toString()),
            query && (path += "?" + query));
        }
      } else
        path.includes("?") && ((cacheBust = !0), (path = path.split("?")[0]));
      Hydra.LOCAL || (cacheBust = !1);
      let imgPath = path;
      return (
        cacheBust &&
          (imgPath += (imgPath.includes("?") ? "&" : "?") + Date.now()),
        compressed &&
          !imgPath.includes("compressed") &&
          (imgPath += compressedIdentifier),
        { plainPath: path, imgPath: imgPath, compressed: compressed }
      );
    }
    function parseCompressed(path) {
      let compressedIdentifier = /-compressedKtx2?/.exec(path)?.[0],
        compressed = !1;
      compressedIdentifier &&
        (Utils.query("noKtx") ||
          (compressedIdentifier.endsWith("2")
            ? "undefined" != typeof Ktx2Transcoder && (compressed = "ktx2")
            : (compressed = "ktx1")),
        (path = path.replace(compressedIdentifier, "")));
      let requiresKtx = !1;
      return (
        /\.ktx2(?:\?|#|$)/.test(path) &&
          ((compressed = "ktx2"),
          (compressedIdentifier = ""),
          (requiresKtx = !0)),
        {
          compressed: compressed,
          compressedIdentifier: compressedIdentifier,
          path: path,
          requiresKtx: requiresKtx,
        }
      );
    }
    function splitCubemapPath(url) {
      let path = url.replace(/-compressedKtx2?/, "").split(/[#?]/)[0],
        match = /(\d+)(?!.*\d+)/.exec(path);
      if (!match)
        throw new Error("Cubemap texture path must include a numeric pattern");
      let prefix = url.substring(0, match.index),
        pattern = match[1];
      return {
        prefix: prefix,
        pattern: pattern,
        suffix: url.substring(match.index + pattern.length),
        start: +pattern,
      };
    }
    function getCubemapFacePaths(pathinfo) {
      let padChar,
        {
          prefix: prefix,
          pattern: pattern,
          suffix: suffix,
          start: start,
        } = pathinfo;
      return (
        pattern.length > String(start).length && (padChar = pattern.charAt(0)),
        Array.from(Array(6).keys(), (i) => {
          let n = String(start + i);
          return (
            padChar && (n = n.padStart(pattern.length, padChar)),
            `${prefix}${n}${suffix}`
          );
        })
      );
    }
    async function doFindDominantColors(texOrImageOrPath, numColors) {
      let image;
      if (texOrImageOrPath.isTexture)
        if (texOrImageOrPath.image) {
          if (
            texOrImageOrPath.image.compressedData &&
            0 === texOrImageOrPath.image.compressedData.length
          ) {
            let { path: path, ...params } = texOrImageOrPath.decodeParams;
            ((params.hintUsingPixelData = !0),
              (image = await ImageDecoder.decode(path, params)));
          }
        } else image = texOrImageOrPath.src;
      return (
        (image = image || texOrImageOrPath.image || texOrImageOrPath),
        "string" == typeof image && (image = await Assets.decodeImage(image)),
        ImageDecoder.parseColors(image, numColors)
      );
    }
    ((window.Vec2 = window.Vector2),
      (window.Vec3 = window.Vector3),
      (this.localDebug = window.Hydra && Hydra.LOCAL),
      (async function () {
        await Hydra.ready();
        let threads = Thread.shared(!0);
        for (let i = 0; i < threads.array.length; i++)
          _this.loadEngineOnThread(threads.array[i]);
      })(),
      (this.decompose = function (local, world) {
        (local.decomposeCache ||
          (local.decomposeCache = {
            position: new Vector3(),
            quaternion: new Quaternion(),
            scale: new Vector3(),
          }),
          local.decomposeDirty &&
            (local.matrixWorld.decompose(
              local.decomposeCache.position,
              local.decomposeCache.quaternion,
              local.decomposeCache.scale,
            ),
            (local.decomposeDirty = !1)),
          world.position.copy(local.decomposeCache.position),
          world.quaternion.copy(local.decomposeCache.quaternion),
          world.scale.copy(local.decomposeCache.scale));
      }),
      (this.createDebug = function (size = 1, color) {
        return new Mesh(
          new IcosahedronGeometry(size, 1),
          _this.getTestShader(color),
        );
      }),
      (this.getTestShader = function (color) {
        return color
          ? new Shader("ColorMaterial", {
              color: {
                value: color instanceof Color ? color : new Color(color),
              },
              alpha: { value: 1 },
            })
          : new Shader("TestMaterial");
      }),
      (this.createMultiRT = function (
        width,
        height,
        type,
        format,
        multisample = !1,
        samplesAmount = 4,
      ) {
        let rt = new MultiRenderTarget(width, height, {
          minFilter: Texture.LINEAR,
          magFilter: Texture.LINEAR,
          format: format || Texture.RGBFormat,
          type: type,
          multisample: multisample,
          samplesAmount: samplesAmount,
        });
        return ((rt.texture.generateMipmaps = !1), rt);
      }),
      (this.createRT = function (
        width,
        height,
        type,
        format,
        multisample = !1,
        samplesAmount = 4,
      ) {
        let rt = new RenderTarget(width, height, {
          minFilter: Texture.LINEAR,
          magFilter: Texture.LINEAR,
          format: format || Texture.RGBFormat,
          type: type,
          multisample: multisample,
          samplesAmount: samplesAmount,
        });
        return ((rt.texture.generateMipmaps = !1), rt);
      }),
      (this.getFloatType = function () {
        return "android" == Device.system.os
          ? Texture.FLOAT
          : Texture.HALF_FLOAT;
      }),
      (this.findNuke = function (obj) {
        if (!obj) return;
        let p = obj.parent;
        for (; p; ) {
          if (p.nuke) return p.nuke;
          p = p.parent;
        }
        for (p = obj.parent; p; ) {
          if (p.nuke) return p.nuke;
          p = p.group ? p.group._parent : p.parent || p._parent;
        }
        for (p = obj._parent; p; ) {
          if (p.nuke) return p.nuke;
          p = p._parent;
        }
        return World.NUKE;
      }),
      (this.getTexture = function (path, params = {}) {
        let {
            imgPath: imgPath,
            plainPath: plainPath,
            compressed: compressed,
          } = parseTexturePath(path),
          texture = getTexture(plainPath, params, async (texture) => {
            ((texture.compressed = compressed),
              (texture.format = plainPath.match(/\.jpe?g/)
                ? Texture.RGBFormat
                : Texture.RGBAFormat),
              (texture.src = plainPath),
              (texture.decodeParams = { path: imgPath, ...params }));
            let imgBmp = await loadTextureSource(texture, imgPath, params);
            ((texture.image = imgBmp),
              imgBmp.sizes &&
                1 === imgBmp.sizes.length &&
                (texture.minFilter = Texture.LINEAR),
              (texture.onUpdate = function () {
                (!params.preserveData &&
                  imgBmp.close &&
                  (imgBmp.close(), (texture.image = null)),
                  (texture.onUpdate = null));
              }));
          });
        return (
          texture.promise.then(
            (_) => {
              (params.findDominantColors &&
                "number" === (params.findDominantColors, !1) &&
                (params.findDominantColors = 4),
                params.findDominantColors &&
                  _this.findDominantColors(texture, params.findDominantColors));
            },
            () => {},
          ),
          texture
        );
      }),
      (this.getCubeLUT = function (path, params) {
        let { imgPath: imgPath, plainPath: plainPath } = parseTexturePath(path);
        return (
          (params = { ...params, isTexture3D: !0, isCubeLUT: !0 }),
          getTexture(plainPath, params, async (texture) => {
            let { imgBmp: imgBmp, cubesize: cubesize } =
              await (function loadCubeLUTSource(path, params) {
                let promise = Promise.create(),
                  {
                    compressed: compressed,
                    compressedIdentifier: compressedIdentifier,
                    newpath: newpath,
                    requiresKtx: requiresKtx,
                  } = parseCompressed(path);
                return (
                  compressed
                    ? ImageDecoder.decode(path, params)
                        .then((result) => {
                          promise.resolve({
                            imgBmp: result.compressedData[0],
                            cubesize: result.width,
                          });
                        })
                        .catch((e) => {
                          promise.reject(e);
                        })
                    : ImageDecoder.decodeCubeLUT(path, params).then(
                        (result) => {
                          promise.resolve({
                            imgBmp: result.imgBmp,
                            cubesize: result.cubesize,
                          });
                        },
                      ),
                  promise
                );
              })(imgPath, params);
            ((texture.format = Texture.RGBAFormat),
              (texture.image = imgBmp),
              (texture.src = plainPath),
              (texture.minFilter = texture.magFilter = Texture.LINEAR),
              (texture.type = Texture.UNSIGNED_BYTE),
              (texture.width = texture.height = texture.depth = cubesize),
              (texture.dimensions = {
                width: cubesize,
                height: cubesize,
                depth: cubesize,
              }),
              (texture.generateMipmaps = !1),
              (texture.onUpdate = function () {
                (!params.preserveData &&
                  imgBmp.close &&
                  (imgBmp.close(), (texture.image = null)),
                  (texture.onUpdate = null));
              }));
          })
        );
      }),
      (this.getCubeTexture = function (paths, params = {}) {
        let parsed = (paths = (function getCubePaths(url) {
          if (Array.isArray(url)) return url;
          let {
            compressed: compressed,
            compressedIdentifier: compressedIdentifier,
            path: path,
            requiresKtx: requiresKtx,
          } = parseCompressed(url);
          if (requiresKtx) return [path];
          "ktx1" === compressed &&
            (void 0 === _supportsKtx1 &&
              (_supportsKtx1 = !!(
                Renderer.extensions.s3tc ||
                Renderer.extensions.etc1 ||
                Renderer.extensions.pvrtc ||
                Renderer.extensions.astc
              )),
            _supportsKtx1 || (compressed = !1));
          !compressed &&
            compressedIdentifier &&
            (url = url.replace(compressedIdentifier, ""));
          let info = splitCubemapPath(url);
          if (compressed) return [`${info.prefix}${info.suffix}`];
          return getCubemapFacePaths(info);
        })(paths)).map(parseTexturePath);
        return getTexture(
          `cube:${parsed.map(({ plainPath: plainPath }) => plainPath).join("|")}`,
          params,
          async (texture) => {
            ((texture.cube = await Promise.all(
              parsed.map(
                ({ imgPath: imgPath, compressed: compressed }) => (
                  (texture.compressed = compressed),
                  (texture.format = imgPath.match(/\.jpe?g/)
                    ? Texture.RGBFormat
                    : Texture.RGBAFormat),
                  loadTextureSource(texture, imgPath, params)
                ),
              ),
            )),
              texture.compressed ||
                1 !== texture.cube.length ||
                (texture.cube = [...Array(6).keys()].map(
                  (_) => texture.cube[0],
                )),
              texture.compressed &&
                1 === texture.cube[0].sizes.length &&
                (texture.minFilter = Texture.LINEAR),
              (texture.onUpdate = function () {
                (params.preserveData ||
                  texture.cube.forEach((imgBmp, i) => {
                    imgBmp.close && (imgBmp.close(), (texture.cube[i] = null));
                  }),
                  (texture.onUpdate = null));
              }));
          },
        );
      }),
      (this.splitCubemapPath = splitCubemapPath),
      (this.getCubemapFacePaths = getCubemapFacePaths),
      (this.getLookupTexture = function (path) {
        let texture = _this.getTexture(path);
        return (
          (texture.minFilter = texture.magFilter = Texture.NEAREST),
          (texture.generateMipmaps = !1),
          texture
        );
      }),
      (this.clearTextureCache = function (path, force) {
        if (path) {
          let key = parseTexturePath(path).plainPath,
            cached = _textures[key];
          (cached
            ? (cached.destroy(force),
              delete _textures[key],
              delete _restorable[key])
            : _restorable[key] && delete _restorable[key],
            delete _dominantColors[key]);
        } else {
          for (let key in _textures) _textures[key].destroy(force);
          ((_textures = {}), (_dominantColors = {}));
        }
      }),
      (this.makeDataTexturePowerOf2 = function (texture, itemSize) {
        let [maxDimension, minDimension] = [
          texture.width,
          texture.height,
        ].sort();
        maxDimension = Math.ceilPowerOf2(maxDimension);
        const totalLength = maxDimension * maxDimension * itemSize,
          remainder = [];
        let j;
        for (let i = 0; i < totalLength - texture.data.length; i++)
          ((j = i % texture.data.length), remainder.push(texture.data[j]));
        const totalData = new Float32Array(totalLength);
        (totalData.set(texture.data),
          totalData.set(remainder, texture.data.length),
          (texture.data = totalData),
          (texture.width = texture.height = maxDimension),
          (texture.powerOfTwoScale = minDimension / maxDimension));
      }),
      (this.loadCurve = function (obj) {
        "string" == typeof obj &&
          ((obj = Assets.JSON[obj]).curves = obj.curves[0]);
        let data = obj.curves,
          points = [];
        for (let j = 0; j < data.length; j += 3)
          points.push(new Vector3(data[j + 0], data[j + 1], data[j + 2]));
        if ("undefined" == typeof CatmullRomCurve)
          throw "loadCurve requires curve3d module";
        return new CatmullRomCurve(points);
      }),
      (this.getEmptyTexture = function () {
        return (
          _emptyTexture || (_emptyTexture = new Texture()),
          _emptyTexture
        );
      }),
      (this.getRepeatTexture = function (src, scale) {
        let texture = _this.getTexture(src, scale);
        return (
          texture.promise.then((_) => {
            Math.isPowerOf2(
              texture.dimensions.width,
              texture.dimensions.height,
            ) || console.warn(`getRepeatTexture :: ${src} not power of two!`);
          }),
          (texture.wrapS = texture.wrapT = Texture.REPEAT),
          texture
        );
      }),
      (this.findTexturesByPath = function (path) {
        let array = [];
        for (let key in _textures)
          key.includes(path) && array.push(_textures[key]);
        return array;
      }),
      (this.getHeightFromCamera = function (camera, dist) {
        ((camera = camera.camera || camera),
          dist || (dist = camera.position.length()));
        let fov = camera.fov;
        return 2 * dist * Math.tan(0.5 * Math.radians(fov));
      }),
      (this.getWidthFromCamera = function (camera, dist) {
        camera = camera.camera || camera;
        return _this.getHeightFromCamera(camera, dist) * camera.aspect;
      }),
      (this.getPositionFromCameraSize = function (camera, size) {
        camera = camera.camera || camera;
        let fov = Math.radians(camera.fov);
        return Math.abs(size / Math.sin(fov / 2));
      }),
      (this.loadEngineOnThread = function (thread) {
        ([
          "Base3D",
          "CameraBase3D",
          "Mesh",
          "OrthographicCamera",
          "PerspectiveCamera",
          "Geometry",
          "GeometryAttribute",
          "Points",
          "Scene",
          "BoxGeometry",
          "CylinderGeometry",
          "PlaneGeometry",
          "PolyhedronGeometry",
          "IcosahedronGeometry",
          "SphereGeometry",
          "Box2",
          "Box3",
          "Face3",
          "Color",
          "ColorLAB",
          "ColorHSL",
          "Cylindrical",
          "Euler",
          "Frustum",
          "Line3",
          "Matrix3",
          "Matrix4",
          "Plane",
          "Quaternion",
          "Ray",
          "Sphere",
          "Spherical",
          "Triangle",
          "Vector2",
          "Vector3",
          "Vector4",
          "RayManager",
          "Vector3D",
          "Group",
        ].forEach((name) => {
          thread.importES6Class(name);
        }),
          thread.importCode(
            `Class(${zUtils3D.constructor.toString()}, 'static')`,
          ));
      }),
      (this.billboard = function (mesh, camera = World.CAMERA) {
        (_q || (_q = new Quaternion()),
          _q.copy(camera.quaternion),
          mesh.customRotation && mesh.quaternion.multiply(mesh.customRotation),
          mesh._parent &&
            _q.premultiply(mesh._parent.getWorldQuaternion().inverse()),
          mesh.quaternion.copy(_q));
      }),
      (this.billboardYAxis = function (mesh, camera = World.CAMERA) {
        (_q || (_q = new Quaternion()), _q.copy(camera.quaternion));
        let angle = Math.atan2(_q.y, _q.w) + Math.PI;
        ((angle = -angle),
          _q.set(0, Math.sin(angle), 0, Math.cos(angle)),
          mesh.customRotation && mesh.quaternion.multiply(mesh.customRotation),
          mesh._parent &&
            _q.premultiply(mesh._parent.getWorldQuaternion().inverse()),
          mesh.quaternion.copy(_q));
      }),
      (this.positionInFrontOfCamera = function (
        object,
        distance,
        alpha = 1,
        camera = World.CAMERA,
      ) {
        (_v3 || (_v3 = new Vector3()),
          _v3b || (_v3b = new Vector3()),
          _m4 || (_m4 = new Matrix4()),
          _q || (_q = new Quaternion()));
        let cameraPosition = _v3b,
          cameraQuaternion = _q;
        (camera.updateMatrixWorld(),
          camera.matrixWorld.decompose(cameraPosition, cameraQuaternion, _v3),
          _v3
            .set(0, 0, -distance)
            .applyQuaternion(cameraQuaternion)
            .add(cameraPosition),
          _m4.lookAt(cameraPosition, _v3, object.up),
          _q.setFromRotationMatrix(_m4),
          object.position.lerp(_v3, alpha),
          object.quaternion.slerp(_q, alpha));
      }),
      (this.getSignedQuaternionAngleToPlane = function (
        quaternion,
        direction,
        planeNormal,
        axis,
      ) {
        _v3c || (_v3c = new Vector3());
        let vector = _v3c.copy(direction).applyQuaternion(quaternion);
        return _this.getSignedAngleToPlane(vector, planeNormal, axis);
      }),
      (this.getSignedAngleToPlane = function (vector, planeNormal, axis) {
        (_v3 || (_v3 = new Vector3()), _v3b || (_v3b = new Vector3()));
        let projected = _v3
          .copy(vector)
          .projectOnPlane(planeNormal)
          .normalize();
        if (0 === projected.length()) return Math.PI / 2;
        axis
          ? (vector = _v3b.copy(vector).projectOnPlane(axis).normalize())
          : (axis = _v3b.crossVectors(projected, planeNormal));
        let dot = vector.dot(projected),
          det = axis.dot(projected.cross(vector));
        return Math.atan2(det, dot);
      }),
      (this.getQuad = function () {
        let geom = new Geometry(),
          position = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]),
          uv = new Float32Array([0, 0, 2, 0, 0, 2]);
        return (
          geom.addAttribute("position", new GeometryAttribute(position, 3)),
          geom.addAttribute("uv", new GeometryAttribute(uv, 2)),
          geom
        );
      }),
      (this.findParentCamera = function (group) {
        let parent = group.parent;
        for (; parent; ) {
          if (parent.nuke) return parent.nuke.camera;
          parent = parent.parent;
        }
        return World.CAMERA;
      }),
      (this.cameraIntrinsicsToObject = function (camera, object) {
        ((object.fov = camera.fov),
          (object.aspect = camera.aspect),
          (object.near = camera.near),
          (object.far = camera.far),
          object.p ||
            ((object.p = []), (object.q = []), (object.projectionMatrix = [])),
          camera.getWorldPosition().toArray(object.p),
          camera.getWorldQuaternion().toArray(object.q),
          camera.projectionMatrix.toArray(object.projectionMatrix),
          (object.width = Stage.width),
          (object.height = Stage.height));
      }),
      (this.createFXLayer = function (name, nuke = World.NUKE, options) {
        let layer = new FXLayer(nuke, options);
        return ((layer.name = name), layer);
      }),
      (this.ensureAttributes = function (mesh) {
        const vs = Shaders.getShader(mesh.shader.vsName + ".vs"),
          attrib_regex = /attribute (\w+) (\w+);/g,
          attribs = mesh.geometry.attributes,
          firstCount = attribs[Object.keys(attribs)[0]].count;
        let attrib;
        for (; null !== (attrib = attrib_regex.exec(vs)); ) {
          const name = attrib[2];
          if (name && !attribs[name]) {
            const size = parseInt(attrib[1][attrib[1].length - 1]) || 1;
            (mesh.geometry.addAttribute(
              name,
              new GeometryAttribute(new Float32Array(size * firstCount), size),
            ),
              (mesh.geometry.needsUpdate = !0));
          }
        }
      }),
      (this.findDominantColors = function (texOrImageOrPath, numColors = 4) {
        let path;
        if (
          ((path =
            "string" == typeof texOrImageOrPath
              ? texOrImageOrPath
              : texOrImageOrPath.src ||
                texOrImageOrPath.path ||
                texOrImageOrPath.image?.src ||
                texOrImageOrPath.image?.path),
          !path)
        )
          throw new Error("Couldn’t find image asset path");
        let { plainPath: plainPath } = parseTexturePath(path),
          colors = _dominantColors[plainPath];
        if (colors)
          if (colors.promise) {
            if (colors.numColors >= numColors) return colors.promise;
          } else if (colors.length >= numColors) return colors;
        return (
          (colors = {
            promise: doFindDominantColors(texOrImageOrPath, numColors),
            numColors: numColors,
          }),
          (_dominantColors[plainPath] = colors),
          (async () => {
            try {
              let result = await colors.promise;
              _dominantColors[plainPath] === colors &&
                ((_dominantColors[plainPath] = result),
                texOrImageOrPath.isTexture &&
                  (texOrImageOrPath.dominantColors = result),
                _textures[plainPath] &&
                  (_textures[plainPath].dominantColors = result));
            } catch (e) {
              _dominantColors[plainPath] === colors &&
                delete _dominantColors[plainPath];
            }
          })(),
          colors.promise
        );
      }),
      (this.renderToTexture3D = function (texture, shader) {
        if (void 0 === texture._renderTargets) {
          let depth = texture.depth / 4;
          texture._renderTargets = [];
          let offset = 0;
          for (let i = 0; i < depth; i++) {
            offset = 4 * i;
            let renderTarget = new RenderTarget(texture.width, texture.height);
            ((renderTarget.texture = texture),
              (renderTarget.indices = [
                offset,
                offset + 1,
                offset + 2,
                offset + 3,
              ]),
              texture._renderTargets.push(renderTarget));
          }
          let mesh = new Mesh(World.QUAD, shader);
          texture._meshFor3D = mesh;
        }
        try {
          (_v4 || (_v4 = new Vector4()),
            texture._renderTargets.forEach((rt) => {
              (shader.set("indices", _v4.set(...rt.indices)),
                World.RENDERER.renderSingle(
                  texture._meshFor3D,
                  World.CAMERA,
                  rt,
                ));
            }));
        } catch (e) {
          console.warn(
            "the 3d texture can not be updated correctly, the shader requires the indices uniform to be declared",
          );
        }
      }),
      (this.cloneTransform = function (object, target = new Base3D()) {
        if (!target || !target.position || !target.position.copy)
          throw new Error("Target of cloneTransform must be a Base3D.");
        let group = object.group || object;
        return (
          target.position.copy(group.position),
          target.scale.copy(group.scale),
          target.quaternion.copy(group.quaternion),
          target
        );
      }),
      (this.cloneUniforms = function (object, target = {}) {
        let shader = object.shader || object,
          uniforms = shader.uniforms || shader;
        if (uniforms && !uniforms.group) {
          let origin = {};
          for (let key in uniforms) {
            let value = uniforms[key].value,
              ignoreUIL = uniforms[key].ignoreUIL || null === value;
            (!ignoreUIL && value.clone && (value = value.clone()),
              (origin[key] = {
                type: uniforms[key].type,
                value: value,
                ignoreUIL: ignoreUIL,
              }));
          }
          return Object.assign(target.shader || target, origin);
        }
      }));
  }, "static"),
  window.WebGLRenderingContext &&
    (function () {
      "use strict";
      var e = {};
      function r(r, t) {
        var i;
        ((e[r] = !0),
          void 0 !== t &&
            ((i = t),
            window.console && window.console.error && window.console.error(i)));
      }
      var t = function e(r) {
        var t = r.gl;
        ((this.ext = r),
          (this.isAlive = !0),
          (this.hasBeenBound = !1),
          (this.elementArrayBuffer = null),
          (this.attribs = new Array(r.maxVertexAttribs)));
        for (var i = 0; i < this.attribs.length; i++) {
          var a = new e.VertexAttrib(t);
          this.attribs[i] = a;
        }
        this.maxAttrib = 0;
      };
      (t.VertexAttrib = function (e) {
        ((this.enabled = !1),
          (this.buffer = null),
          (this.size = 4),
          (this.type = e.FLOAT),
          (this.normalized = !1),
          (this.stride = 16),
          (this.offset = 0),
          (this.cached = ""),
          this.recache());
      }).prototype.recache = function () {
        this.cached = [
          this.size,
          this.type,
          this.normalized,
          this.stride,
          this.offset,
        ].join(":");
      };
      var i = function (r) {
        var t,
          i,
          a = this;
        ((this.gl = r),
          (i = (t = r).getError),
          (t.getError = function () {
            do {
              (r = i.apply(t)) != t.NO_ERROR && (e[r] = !0);
            } while (r != t.NO_ERROR);
            for (var r in e) if (e[r]) return (delete e[r], parseInt(r));
            return t.NO_ERROR;
          }));
        var n = (this.original = {
          getParameter: r.getParameter,
          enableVertexAttribArray: r.enableVertexAttribArray,
          disableVertexAttribArray: r.disableVertexAttribArray,
          bindBuffer: r.bindBuffer,
          getVertexAttrib: r.getVertexAttrib,
          vertexAttribPointer: r.vertexAttribPointer,
        });
        ((r.getParameter = function (e) {
          return e == a.VERTEX_ARRAY_BINDING_OES
            ? a.currentVertexArrayObject == a.defaultVertexArrayObject
              ? null
              : a.currentVertexArrayObject
            : n.getParameter.apply(this, arguments);
        }),
          (r.enableVertexAttribArray = function (e) {
            var r = a.currentVertexArrayObject;
            return (
              (r.maxAttrib = Math.max(r.maxAttrib, e)),
              (r.attribs[e].enabled = !0),
              n.enableVertexAttribArray.apply(this, arguments)
            );
          }),
          (r.disableVertexAttribArray = function (e) {
            var r = a.currentVertexArrayObject;
            return (
              (r.maxAttrib = Math.max(r.maxAttrib, e)),
              (r.attribs[e].enabled = !1),
              n.disableVertexAttribArray.apply(this, arguments)
            );
          }),
          (r.bindBuffer = function (e, t) {
            switch (e) {
              case r.ARRAY_BUFFER:
                a.currentArrayBuffer = t;
                break;
              case r.ELEMENT_ARRAY_BUFFER:
                a.currentVertexArrayObject.elementArrayBuffer = t;
            }
            return n.bindBuffer.apply(this, arguments);
          }),
          (r.getVertexAttrib = function (e, t) {
            var i = a.currentVertexArrayObject.attribs[e];
            switch (t) {
              case r.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING:
                return i.buffer;
              case r.VERTEX_ATTRIB_ARRAY_ENABLED:
                return i.enabled;
              case r.VERTEX_ATTRIB_ARRAY_SIZE:
                return i.size;
              case r.VERTEX_ATTRIB_ARRAY_STRIDE:
                return i.stride;
              case r.VERTEX_ATTRIB_ARRAY_TYPE:
                return i.type;
              case r.VERTEX_ATTRIB_ARRAY_NORMALIZED:
                return i.normalized;
              default:
                return n.getVertexAttrib.apply(this, arguments);
            }
          }),
          (r.vertexAttribPointer = function (e, r, t, i, s, A) {
            var o = a.currentVertexArrayObject;
            o.maxAttrib = Math.max(o.maxAttrib, e);
            var c = o.attribs[e];
            return (
              (c.buffer = a.currentArrayBuffer),
              (c.size = r),
              (c.type = t),
              (c.normalized = i),
              (c.stride = s),
              (c.offset = A),
              c.recache(),
              n.vertexAttribPointer.apply(this, arguments)
            );
          }),
          r.instrumentExtension &&
            r.instrumentExtension(this, "OES_vertex_array_object"),
          r.canvas.addEventListener(
            "webglcontextrestored",
            function () {
              (window.console &&
                window.console.log &&
                window.console.log(
                  "OESVertexArrayObject emulation library context restored",
                ),
                a.reset_());
            },
            !0,
          ),
          this.reset_());
      };
      ((i.prototype.VERTEX_ARRAY_BINDING_OES = 34229),
        (i.prototype.reset_ = function () {
          if (void 0 !== this.vertexArrayObjects)
            for (var e = 0; e < this.vertexArrayObjects.length; ++e)
              this.vertexArrayObjects.isAlive = !1;
          var r = this.gl;
          ((this.maxVertexAttribs = r.getParameter(r.MAX_VERTEX_ATTRIBS)),
            (this.defaultVertexArrayObject = new t(this)),
            (this.currentVertexArrayObject = null),
            (this.currentArrayBuffer = null),
            (this.vertexArrayObjects = [this.defaultVertexArrayObject]),
            this.bindVertexArrayOES(null));
        }),
        (i.prototype.createVertexArrayOES = function () {
          var e = new t(this);
          return (this.vertexArrayObjects.push(e), e);
        }),
        (i.prototype.deleteVertexArrayOES = function (e) {
          ((e.isAlive = !1),
            this.vertexArrayObjects.splice(
              this.vertexArrayObjects.indexOf(e),
              1,
            ),
            this.currentVertexArrayObject == e &&
              this.bindVertexArrayOES(null));
        }),
        (i.prototype.isVertexArrayOES = function (e) {
          return !!(e && e instanceof t && e.hasBeenBound && e.ext == this);
        }),
        (i.prototype.bindVertexArrayOES = function (e) {
          var t = this.gl;
          if (!e || e.isAlive) {
            var i = this.original,
              a = this.currentVertexArrayObject;
            ((this.currentVertexArrayObject =
              e || this.defaultVertexArrayObject),
              (this.currentVertexArrayObject.hasBeenBound = !0));
            var n = this.currentVertexArrayObject;
            if (a != n) {
              (a && n.elementArrayBuffer == a.elementArrayBuffer) ||
                i.bindBuffer.call(
                  t,
                  t.ELEMENT_ARRAY_BUFFER,
                  n.elementArrayBuffer,
                );
              for (
                var s = this.currentArrayBuffer,
                  A = Math.max(a ? a.maxAttrib : 0, n.maxAttrib),
                  o = 0;
                o <= A;
                o++
              ) {
                var c = n.attribs[o],
                  b = a ? a.attribs[o] : null;
                if (
                  ((a && c.enabled == b.enabled) ||
                    (c.enabled
                      ? i.enableVertexAttribArray.call(t, o)
                      : i.disableVertexAttribArray.call(t, o)),
                  c.enabled)
                ) {
                  var u = !1;
                  ((a && c.buffer == b.buffer) ||
                    (s != c.buffer &&
                      (i.bindBuffer.call(t, t.ARRAY_BUFFER, c.buffer),
                      (s = c.buffer)),
                    (u = !0)),
                    (u || c.cached != b.cached) &&
                      i.vertexAttribPointer.call(
                        t,
                        o,
                        c.size,
                        c.type,
                        c.normalized,
                        c.stride,
                        c.offset,
                      ));
                }
              }
              this.currentArrayBuffer != s &&
                i.bindBuffer.call(t, t.ARRAY_BUFFER, this.currentArrayBuffer);
            }
          } else
            r(
              t.INVALID_OPERATION,
              "bindVertexArrayOES: attempt to bind deleted arrayObject",
            );
        }),
        (function () {
          var e = WebGLRenderingContext.prototype.getSupportedExtensions;
          WebGLRenderingContext.prototype.getSupportedExtensions = function () {
            var r = e.call(this) || [];
            return (
              r.indexOf("OES_vertex_array_object") < 0 &&
                r.push("OES_vertex_array_object"),
              r
            );
          };
          var r = WebGLRenderingContext.prototype.getExtension;
          WebGLRenderingContext.prototype.getExtension = function (e) {
            return (
              r.call(this, e) ||
              ("OES_vertex_array_object" !== e
                ? null
                : (this.__OESVertexArrayObject ||
                    (console.log("Setup OES_vertex_array_object polyfill"),
                    (this.__OESVertexArrayObject = new i(this))),
                  this.__OESVertexArrayObject))
            );
          };
        })());
    })(),
  Class(function DracoThread() {
    let decoderConfig, decoderPending;
    function onError(opts) {
      opts.message.preloading && console.warn(opts.er);
      let plane = new PlaneGeometry(1, 1).toNonIndexed(),
        buff = [],
        data = {};
      for (let key in plane.attributes)
        ((data[key] = plane.attributes[key].array),
          buff.push(data[key].buffer));
      (computeBounding(data), opts?.resolve(data, opts.id, buff));
    }
    function decodeGeometry(draco, decoder, decoderBuffer, taskConfig) {
      const attributeIDs = taskConfig.attributeIDs,
        attributeTypes = taskConfig.attributeTypes;
      let dracoGeometry, decodingStatus;
      const geometryType = decoder.GetEncodedGeometryType(decoderBuffer);
      if (geometryType === draco.TRIANGULAR_MESH)
        ((dracoGeometry = new draco.Mesh()),
          (decodingStatus = decoder.DecodeBufferToMesh(
            decoderBuffer,
            dracoGeometry,
          )));
      else {
        if (geometryType !== draco.POINT_CLOUD)
          throw new Error("DRACOLoader: Unexpected geometry type.");
        ((dracoGeometry = new draco.PointCloud()),
          (decodingStatus = decoder.DecodeBufferToPointCloud(
            decoderBuffer,
            dracoGeometry,
          )));
      }
      if (!decodingStatus.ok() || 0 === dracoGeometry.ptr)
        throw new Error(
          "DRACOLoader: Decoding failed: " + decodingStatus.error_msg(),
        );
      const geometry = { index: null, attributes: [] };
      for (const attributeName in attributeIDs) {
        const attributeType = attributeTypes[attributeName];
        let attribute, attributeID;
        if (taskConfig.useUniqueIDs)
          ((attributeID = attributeIDs[attributeName]),
            (attribute = decoder.GetAttributeByUniqueId(
              dracoGeometry,
              attributeID,
            )));
        else {
          if (
            ((attributeID = decoder.GetAttributeId(
              dracoGeometry,
              draco[attributeIDs[attributeName]],
            )),
            -1 === attributeID)
          )
            continue;
          attribute = decoder.GetAttribute(dracoGeometry, attributeID);
        }
        geometry.attributes.push(
          decodeAttribute(
            draco,
            decoder,
            dracoGeometry,
            attributeName,
            attributeType,
            attribute,
          ),
        );
      }
      return (
        geometryType === draco.TRIANGULAR_MESH &&
          (geometry.index = decodeIndex(draco, decoder, dracoGeometry)),
        draco.destroy(dracoGeometry),
        geometry
      );
    }
    function decodeIndex(draco, decoder, dracoGeometry) {
      const numIndices = 3 * dracoGeometry.num_faces(),
        byteLength = 4 * numIndices,
        ptr = draco._malloc(byteLength);
      decoder.GetTrianglesUInt32Array(dracoGeometry, byteLength, ptr);
      const index = new Uint32Array(
        draco.HEAPF32.buffer,
        ptr,
        numIndices,
      ).slice();
      return (draco._free(ptr), { array: index, itemSize: 1 });
    }
    function decodeAttribute(
      draco,
      decoder,
      dracoGeometry,
      attributeName,
      attributeType,
      attribute,
    ) {
      const numComponents = attribute.num_components(),
        numValues = dracoGeometry.num_points() * numComponents,
        byteLength = numValues * attributeType.BYTES_PER_ELEMENT,
        dataType = getDracoDataType(draco, attributeType),
        ptr = draco._malloc(byteLength);
      decoder.GetAttributeDataArrayForAllPoints(
        dracoGeometry,
        attribute,
        dataType,
        byteLength,
        ptr,
      );
      const array = new attributeType(
        draco.HEAPF32.buffer,
        ptr,
        numValues,
      ).slice();
      return (
        draco._free(ptr),
        { name: attributeName, array: array, itemSize: numComponents }
      );
    }
    function getDracoDataType(draco, attributeType) {
      switch (attributeType) {
        case Float32Array:
          return draco.DT_FLOAT32;
        case Int8Array:
          return draco.DT_INT8;
        case Int16Array:
          return draco.DT_INT16;
        case Int32Array:
          return draco.DT_INT32;
        case Uint8Array:
          return draco.DT_UINT8;
        case Uint16Array:
          return draco.DT_UINT16;
        case Uint32Array:
          return draco.DT_UINT32;
      }
    }
    ((this.loadDraco = function (e, id) {
      const message = e;
      switch (message.type) {
        case "init":
          ((decoderConfig = message.decoderConfig),
            (decoderPending = new Promise(function (pendingResolve) {
              ((decoderConfig.onModuleLoaded = function (draco) {
                (pendingResolve({ draco: draco }), resolve({}, id));
              }),
                DracoDecoderModule(decoderConfig));
            })));
          break;
        case "decode_buffer_gltf":
          ((dracoBuffer, dataAttrib) => {
            const buffer = dracoBuffer,
              attributeIDs = {},
              attributeTypes = {},
              TYPE_ARRAY = {
                5121: Uint8Array,
                5122: Int16Array,
                5123: Uint16Array,
                5125: Uint32Array,
                5126: Float32Array,
                "image/jpeg": Uint8Array,
                "image/png": Uint8Array,
              };
            dataAttrib.forEach((att) => {
              const name = att.name;
              ((attributeIDs[name] = att.id),
                (attributeTypes[name] = TYPE_ARRAY[att.type]));
            });
            const taskConfig = {
              attributeIDs: attributeIDs,
              attributeTypes: attributeTypes,
              useUniqueIDs: !0,
            };
            decoderPending.then((module) => {
              const draco = module.draco,
                decoder = new draco.Decoder(),
                decoderBuffer = new draco.DecoderBuffer();
              decoderBuffer.Init(new Int8Array(buffer), buffer.byteLength);
              try {
                const geometry = decodeGeometry(
                    draco,
                    decoder,
                    decoderBuffer,
                    taskConfig,
                  ),
                  buffers = geometry.attributes.map(
                    (attr) => attr.array.buffer,
                  );
                geometry.index && buffers.push(geometry.index.array.buffer);
                const response = {};
                (geometry.index && (response.index = geometry.index.array),
                  geometry.attributes.forEach((att) => {
                    ((response[att.name] = att.array),
                      (response[`${att.name}ItemSize`] = att.itemSize));
                  }),
                  response.position && computeBounding(response),
                  resolve(response, id, buffers));
              } catch (error) {
                onError({
                  message: message,
                  er: `Parsing error on Draco file ${message.path}.`,
                  resolve: resolve,
                  id: id,
                });
              } finally {
                (draco.destroy(decoderBuffer), draco.destroy(decoder));
              }
            });
          })(message.buffer, message.dataAttrib);
          break;
        case "decode":
          fetch(message.path)
            .then((res) => {
              if (!res.ok) throw new Error();
              return res.arrayBuffer();
            })
            .then((dracoBuffer) => {
              const decoder = new TextDecoder(),
                jsonSize = parseInt(decoder.decode(dracoBuffer.slice(0, 10))),
                jsonData = JSON.parse(
                  decoder.decode(dracoBuffer.slice(10, 10 + jsonSize)),
                ),
                buffer = dracoBuffer.slice(10 + jsonSize),
                TYPED_ARRAYS = Object.values(Geometry.TYPED_ARRAYS),
                attributeIDs = {},
                attributeTypes = {};
              jsonData.attributes.forEach((att, i) => {
                const name = att[0];
                ((attributeIDs[name] = i),
                  (attributeTypes[name] = TYPED_ARRAYS[att[1]]));
              });
              const taskConfig = {
                  attributeIDs: attributeIDs,
                  attributeTypes: attributeTypes,
                  useUniqueIDs: !0,
                },
                isMesh = 0 === jsonData.type;
              decoderPending.then((module) => {
                const draco = module.draco,
                  decoder = new draco.Decoder(),
                  decoderBuffer = new draco.DecoderBuffer();
                decoderBuffer.Init(new Int8Array(buffer), buffer.byteLength);
                try {
                  const geometry = decodeGeometry(
                      draco,
                      decoder,
                      decoderBuffer,
                      taskConfig,
                    ),
                    buffers = geometry.attributes.map(
                      (attr) => attr.array.buffer,
                    );
                  isMesh &&
                    geometry.index &&
                    buffers.push(geometry.index.array.buffer);
                  const response = {
                    _type: "BufferGeometry",
                    userData: jsonData.userData || {},
                  };
                  ((response.userData.dracoType = jsonData.type),
                    isMesh &&
                      geometry.index &&
                      (response.index = geometry.index.array),
                    geometry.attributes.forEach((att) => {
                      ((response[att.name] = att.array),
                        (response[`${att.name}ItemSize`] = att.itemSize));
                    }),
                    isMesh && response.position && computeBounding(response),
                    resolve(response, id, buffers));
                } catch (error) {
                  onError({
                    message: message,
                    er: `Parsing error on Draco file ${message.path}.`,
                    resolve: resolve,
                    id: id,
                  });
                } finally {
                  (draco.destroy(decoderBuffer), draco.destroy(decoder));
                }
              });
            })
            .catch(() => {
              onError({
                message: message,
                er: `Network error: Draco file (${message.path}) could not be loaded.`,
                resolve: resolve,
                id: id,
              });
            });
      }
    }),
      (this.decodeGeometry = decodeGeometry),
      (this.decodeIndex = decodeIndex),
      (this.decodeAttribute = decodeAttribute),
      (this.getDracoDataType = getDracoDataType),
      (this.onError = onError));
  }, "static"),
  Class(function GLTFLoader() {
    Inherit(this, Component);
    const _this = this,
      TYPE_ARRAY = {
        5121: Uint8Array,
        5122: Int16Array,
        5123: Uint16Array,
        5125: Uint32Array,
        5126: Float32Array,
        "image/jpeg": Uint8Array,
        "image/png": Uint8Array,
      },
      TYPE_SIZE = {
        SCALAR: 1,
        VEC2: 2,
        VEC3: 3,
        VEC4: 4,
        MAT2: 4,
        MAT3: 9,
        MAT4: 16,
      },
      ATTRIBUTES = {
        POSITION: "position",
        NORMAL: "normal",
        TANGENT: "tangent",
        TEXCOORD_0: "uv",
        TEXCOORD_1: "uv2",
        COLOR_0: "color",
        WEIGHTS_0: "skinWeight",
        JOINTS_0: "skinIndex",
      };
    let _sceneLayout, _path, _id;
    new Matrix4();
    _this.textures = null;
    let _dracoLoaded = null;
    ((_this.parse = async function (path, sceneLayout) {
      let name = (path = Assets.getPath(path)).split("/");
      ((name = name[name.length - 1]),
        console.log(name),
        (name = name.split(".")[0]),
        (_id = name),
        (_path = path),
        sceneLayout && (_sceneLayout = _this.initClass(SceneLayout, name)));
      let json,
        binary,
        nodes = null;
      if (String(path).indexOf(".glb") > 0) {
        let data = await _this.loadBinary(_path);
        ((json = data.json), (binary = data.binary));
      }
      String(path).indexOf(".gltf") > 0 &&
        ((json = await fetch(path).then((res) => res.json())),
        (binary = await Promise.all(
          json.buffers.map((buffer) => {
            const uri = this.resolveURI(buffer.uri);
            return fetch(uri).then((res) => res.arrayBuffer());
          }),
        )),
        (binary = binary[0]));
      const desc = json,
        buffers = binary;
      let dracoRequired = !1;
      (desc.extensionsRequired &&
        desc.extensionsRequired.forEach((extension) => {
          "KHR_draco_mesh_compression" === extension && (dracoRequired = !0);
        }),
        dracoRequired &&
          (!(function loadDracoLib() {
            _dracoLoaded = Promise.create();
            const useJS = "object" != typeof WebAssembly,
              libFolder = "~assets/js/lib/_draco/",
              libs = useJS
                ? [`${libFolder}draco_decoder.js`]
                : [
                    `${libFolder}draco_wasm_wrapper.js`,
                    `${libFolder}draco_decoder.wasm`,
                  ];
            Promise.all(
              libs.map((url, i) =>
                fetch(Assets.getPath(url)).then((res) => {
                  if (!res.ok) throw new Error();
                  return 0 === i ? res.text() : res.arrayBuffer();
                }),
              ),
            )
              .then(async (loadedLibs) => {
                Thread.upload(
                  [
                    "function loadDraco() {",
                    "/* draco decoder */",
                    loadedLibs[0],
                    "",
                    "/* worker */",
                    "",
                    "let decoderConfig, decoderPending;",
                    "",
                    DracoThread.onError.toString(),
                    DracoThread.decodeGeometry.toString(),
                    DracoThread.decodeIndex.toString(),
                    DracoThread.decodeAttribute.toString(),
                    DracoThread.getDracoDataType.toString(),
                    "",
                    "return " + DracoThread.loadDraco.toString(),
                    "};",
                  ].join("\n"),
                );
                const pool = Thread.shared(!0).array,
                  decoderConfig = useJS ? {} : { wasmBinary: loadedLibs[1] };
                (pool.forEach((t) =>
                  t.importCode("self.loadDraco = loadDraco();"),
                ),
                  await Promise.all(
                    pool.map((t) =>
                      t.loadDraco({
                        type: "init",
                        decoderConfig: decoderConfig,
                      }),
                    ),
                  ),
                  _dracoLoaded.resolve());
              })
              .catch(() => {
                (console.warn(
                  "Draco libs could not be loaded. Fallback to .json",
                ),
                  _dracoLoaded.reject());
              });
          })(),
          await _dracoLoaded));
      const bufferViews = _this.parseBufferViews(desc, buffers),
        images = await _this.parseImages(desc, bufferViews),
        textures = await _this.parseTextures(desc, images);
      await Promise.all(textures).then((values) => {
        _this.textures = values;
      });
      const materials = await _this.parseMaterials(desc, textures);
      return (
        (meshes = await _this.parseMeshes(desc, bufferViews, materials)),
        (nodes = await _this.parseNodes(desc, meshes)),
        nodes
      );
    }),
      (this.loadBinary = async function (path) {
        let json,
          binary,
          result = Promise.create();
        return (
          fetch(path)
            .then((res) => {
              if (!res.ok) throw new Error();
              return res.arrayBuffer();
            })
            .then(async (gltfBuffer) => {
              const BINARY_EXTENSION_CHUNK_TYPES_JSON = 1313821514,
                BINARY_EXTENSION_CHUNK_TYPES_BIN = 5130562,
                headerView = new DataView(gltfBuffer, 0, 12),
                decoder = new TextDecoder();
              let header_magic = decoder.decode(gltfBuffer.slice(0, 4)),
                header_version = headerView.getUint32(4, !0),
                header_length = headerView.getUint32(8, !0);
              if ("glTF" !== header_magic)
                throw new Error("GLTFLoader: Unsupported glTF-Binary header.");
              if (header_version < 2)
                throw new Error("GLTFLoader: Legacy binary file detected.");
              const chunkContentsLength = header_length - 12,
                chunkView = new DataView(gltfBuffer, 12);
              let chunkIndex = 0,
                _content = null;
              for (; chunkIndex < chunkContentsLength; ) {
                const chunkLength = chunkView.getUint32(chunkIndex, !0);
                chunkIndex += 4;
                const chunkType = chunkView.getUint32(chunkIndex, !0);
                if (
                  ((chunkIndex += 4),
                  chunkType === BINARY_EXTENSION_CHUNK_TYPES_JSON)
                ) {
                  const contentArray = new Uint8Array(
                    gltfBuffer,
                    12 + chunkIndex,
                    chunkLength,
                  );
                  _content = decoder.decode(contentArray);
                } else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES_BIN) {
                  const byteOffset = 12 + chunkIndex;
                  binary = gltfBuffer.slice(
                    byteOffset,
                    byteOffset + chunkLength,
                  );
                }
                chunkIndex += chunkLength;
              }
              if (null === _content)
                throw new Error("GLTFLoader: JSON content not found.");
              ((json = JSON.parse(_content)),
                console.log(json),
                void 0 === json.asset || json.asset.version[0] < 2
                  ? onError &&
                    onError(
                      new Error(
                        "GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.",
                      ),
                    )
                  : result.resolve());
            }),
          await result,
          { json: json, binary: binary }
        );
      }),
      (this.parseBufferViews = function (desc, buffers) {
        if (!desc.bufferViews) return null;
        const bufferViews = desc.bufferViews.map((o) => Object.assign({}, o));
        return (
          desc.accessors.forEach(
            ({ bufferView: i, componentType: componentType }) => {
              i < bufferViews.length &&
                (bufferViews[i].componentType = componentType);
            },
          ),
          bufferViews.forEach(
            (
              {
                byteOffset: byteOffset = 0,
                byteLength: byteLength,
                componentType: componentType,
              },
              i,
            ) => {
              bufferViews[i].data = buffers.slice(
                byteOffset,
                byteOffset + byteLength,
              );
            },
          ),
          bufferViews
        );
      }),
      (this.parseMeshes = function (desc, bufferViews, materials) {
        return desc.meshes
          ? desc.meshes.map(
              ({ name: name, primitives: primitives }, index1) => {
                let shader = Utils3D.getTestShader();
                return (
                  (shader.side = Shader.DOUBLE_SIDE),
                  (primitives = this.parsePrimitives(
                    primitives,
                    desc,
                    bufferViews,
                    materials,
                  ).map(
                    async (
                      {
                        geometry: geometry,
                        materialDefinition: materialDefinition,
                      },
                      index2,
                    ) => {
                      let setupShader = (el) => {
                        if (!materialDefinition) return;
                        let shader = el.shader;
                        (materialDefinition.baseColorTexture &&
                          materialDefinition.baseColorTexture.texture.then(
                            (res) => {
                              (shader.get("tMap") && shader.set("tMap", res),
                                shader.get("tBaseColor") &&
                                  shader.set("tBaseColor", res));
                            },
                          ),
                          materialDefinition.normalTexture &&
                            materialDefinition.normalTexture.texture.then(
                              (res) => {
                                shader.get("tNormal") &&
                                  shader.set("tNormal", res);
                              },
                            ),
                          materialDefinition.metallicRoughnessTexture &&
                            materialDefinition.metallicRoughnessTexture.texture.then(
                              (res) => {
                                shader.get("tMRO") && shader.set("tMRO", res);
                              },
                            ));
                      };
                      if ((await geometry.ready, _sceneLayout)) {
                        let naming = `${_id}_mesh_${index1}_${index2}`;
                        (name && (naming = naming.concat(`_${name}`)),
                          (naming = naming.replace(/ /g, "_")));
                        let mesh =
                          void 0 !== _sceneLayout.exists(naming)
                            ? await _sceneLayout.getLayer(naming)
                            : null;
                        if (mesh) mesh.geometry = geometry;
                        else {
                          let id = await _sceneLayout._createLayer(
                            `${_id}_meshes`,
                            !0,
                          );
                          ((mesh = await _sceneLayout.getLayer(String(id))),
                            (mesh.geometry = geometry),
                            _sceneLayout._rename(id, String(id), naming));
                        }
                        return (setupShader(mesh), mesh);
                      }
                      {
                        let mesh = new Mesh(geometry, shader);
                        return (setupShader(mesh), mesh);
                      }
                    },
                  )),
                  primitives
                );
              },
            )
          : null;
      }),
      (this.parsePrimitives = function (
        primitives,
        desc,
        bufferViews,
        materials,
      ) {
        return primitives.map(
          ({
            attributes: attributes,
            indices: indices,
            material: materialIndex,
            extensions: extensions,
          }) => {
            let materialDefinition = null;
            void 0 !== materialIndex &&
              (materialDefinition = materials[materialIndex]);
            let geometry = new Geometry();
            if (
              ((geometry.ready = Promise.create()),
              extensions && extensions.KHR_draco_mesh_compression)
            ) {
              const attribs = extensions.KHR_draco_mesh_compression.attributes;
              let dataAttrib = [];
              for (let attribute in attributes) {
                let index = attributes[attribute],
                  id = attribs[attribute],
                  { componentType: componentType } = desc.accessors[index];
                dataAttrib.push({
                  name: attribute,
                  id: id,
                  type: componentType,
                });
              }
              const { data: data } =
                bufferViews[extensions.KHR_draco_mesh_compression.bufferView];
              Thread.shared()
                .loadDraco({
                  type: "decode_buffer_gltf",
                  buffer: data,
                  dataAttrib: dataAttrib,
                })
                .then((res) => {
                  for (let att in res) {
                    if (res[att].length > 0 && "index" !== att) {
                      let attributeName = ATTRIBUTES[att],
                        info = new GeometryAttribute(
                          res[att],
                          res[`${att}ItemSize`],
                        );
                      geometry.addAttribute(attributeName, info);
                    }
                    "index" === att && (geometry.index = res[att]);
                  }
                  geometry.ready.resolve();
                });
            } else {
              for (let attr in attributes) {
                let buffer = this.parseAccessor(
                    attributes[attr],
                    desc,
                    bufferViews,
                  ),
                  data = new GeometryAttribute(buffer.data, buffer.size);
                geometry.addAttribute(ATTRIBUTES[attr], data);
              }
              if (void 0 !== indices) {
                let buffer = this.parseAccessor(indices, desc, bufferViews);
                geometry.index = buffer.data;
              }
              geometry.ready.resolve();
            }
            return {
              geometry: geometry,
              materialDefinition: materialDefinition,
            };
          },
        );
      }),
      (this.parseAccessor = function (
        index,
        desc,
        bufferViews,
        _bufferViewIndex = null,
      ) {
        let {
          bufferView: bufferViewIndex,
          byteOffset: byteOffset = 0,
          componentType: componentType,
          normalized: normalized = !1,
          count: count,
          type: type,
          min: min,
          max: max,
        } = desc.accessors[index];
        null !== _bufferViewIndex && (bufferViewIndex = _bufferViewIndex);
        const {
            data: data,
            buffer: buffer,
            byteStride: byteStride = 0,
          } = bufferViews[bufferViewIndex],
          size = TYPE_SIZE[type];
        return {
          data: new (0, TYPE_ARRAY[componentType])(data, byteOffset),
          size: size,
          type: componentType,
          normalized: normalized,
          buffer: buffer,
          stride: byteStride,
          offset: byteOffset,
          count: count,
          min: min,
          max: max,
        };
      }),
      (this.parseNodes = async function (desc, meshes) {
        if (!desc.nodes) return null;
        let nodes = desc.nodes.map(
          async (
            {
              matrix: matrix,
              mesh: meshIndex,
              rotation: rotation,
              scale: scale,
              translation: translation,
              name: name,
            },
            index,
          ) => {
            let node = new Group();
            if (_sceneLayout) {
              let naming = `${_id}_hierarchy_${index}`;
              (name && (naming = naming.concat(`_${name}`)),
                (naming = naming.replace(/ /g, "_")));
              let exists = _sceneLayout.exists(naming);
              if (
                ((node = exists ? await _sceneLayout.getLayer(naming) : null),
                !node)
              ) {
                let ref = await _sceneLayout._createLayer(
                  `${_id}_hierarchy`,
                  !0,
                );
                ((node = await _sceneLayout.getLayer(String(ref))),
                  _sceneLayout._rename(ref, String(ref), naming));
              }
              ((node.geometry = new PlaneGeometry(0, 0, 1, 1)),
                (node._parent = null));
            }
            if ((name && (node.name = name), matrix)) {
              let m = new Matrix4().set(...matrix);
              ((m = m.transpose()),
                node.matrix.copy(m),
                node.matrix.decompose(
                  node.position,
                  node.quaternion,
                  node.scale,
                ));
            } else
              (rotation || scale || translation) &&
                (rotation && node.quaternion.set(...rotation),
                scale && node.scale.set(...scale),
                translation && node.position.set(...translation),
                node.updateMatrix());
            return (
              void 0 !== meshIndex &&
                meshes[meshIndex].forEach(async (mesh) => {
                  mesh.then((res) => {
                    node.add(res);
                  });
                }),
              node
            );
          },
        );
        return (
          await Promise.all(nodes).then((values) => {
            nodes = values;
          }),
          desc.nodes.forEach(({ children: children = [] }, i) => {
            children.forEach((childIndex) => {
              nodes[i].add(nodes[childIndex]);
            });
          }),
          nodes.filter((node) => {
            if (null == node._parent) return node;
          })
        );
      }),
      (this.parseTextures = function (desc, images) {
        return desc.textures
          ? desc.textures.map((textureInfo) =>
              _this.createTexture(desc, images, textureInfo),
            )
          : null;
      }),
      (this.createTexture = async function (
        desc,
        images,
        {
          sampler: samplerIndex,
          source: sourceIndex,
          name: name,
          extensions: extensions,
          extras: extras,
        },
      ) {
        if (void 0 === sourceIndex && extensions)
          return void console.warn("extensions required to load texture");
        const image = images[sourceIndex];
        if (image.texture) return image.texture;
        const sampler =
          void 0 !== samplerIndex ? desc.samplers[samplerIndex] : null;
        let options = {};
        (sampler &&
          ["magFilter", "minFilter", "wrapS", "wrapT"].forEach((prop) => {
            sampler[prop] && (options[prop] = sampler[prop]);
          }),
          await image.ready);
        const texture = new Texture(image);
        return (
          (texture.name = name),
          (texture.flipY = !1),
          (texture.wrapS = texture.wrapT = Texture.REPEAT),
          (image.texture = texture),
          texture
        );
      }),
      (this.parseImages = async function (desc, bufferViews) {
        return desc.images
          ? await Promise.all(
              desc.images.map(
                async ({
                  uri: uri,
                  bufferView: bufferViewIndex,
                  mimeType: mimeType,
                  name: name,
                }) => {
                  if ("image/ktx2" === mimeType)
                    return (
                      console.warn(
                        "image type is ktx2, update the loader to support this type",
                      ),
                      null
                    );
                  const image = new Image();
                  if (((image.name = name), uri))
                    image.src = this.resolveURI(uri);
                  else if (void 0 !== bufferViewIndex) {
                    const { data: data } = bufferViews[bufferViewIndex],
                      blob = new Blob([data], { type: mimeType });
                    image.src = URL.createObjectURL(blob);
                  }
                  return (
                    (image.ready = new Promise((res) => {
                      image.onload = () => res();
                    })),
                    image
                  );
                },
              ),
            )
          : null;
      }),
      (this.resolveURI = function (uri) {
        let dir = _path.split("/");
        return (
          dir.pop(),
          (dir = dir.join("/")),
          "string" != typeof uri || "" === uri
            ? ""
            : (/^https?:\/\//i.test(dir) &&
                /^\//.test(uri) &&
                (dir = dir.replace(/(^https?:\/\/[^\/]+).*/i, "$1")),
              /^(https?:)?\/\//i.test(uri) ||
              /^data:.*,.*$/i.test(uri) ||
              /^blob:.*$/i.test(uri)
                ? uri
                : dir + "/" + uri)
        );
      }),
      (this.parseMaterials = function (desc, textures) {
        return desc.materials
          ? desc.materials.map(
              ({
                name: name,
                extensions: extensions,
                extras: extras,
                pbrMetallicRoughness: pbrMetallicRoughness = {},
                normalTexture: normalTexture,
                occlusionTexture: occlusionTexture,
                emissiveTexture: emissiveTexture,
                emissiveFactor: emissiveFactor = [0, 0, 0],
                alphaMode: alphaMode = "OPAQUE",
                alphaCutoff: alphaCutoff = 0.5,
                doubleSided: doubleSided = !1,
              }) => {
                const {
                  baseColorFactor: baseColorFactor = [1, 1, 1, 1],
                  baseColorTexture: baseColorTexture,
                  metallicFactor: metallicFactor = 1,
                  roughnessFactor: roughnessFactor = 1,
                  metallicRoughnessTexture: metallicRoughnessTexture,
                } = pbrMetallicRoughness;
                return (
                  baseColorTexture &&
                    (baseColorTexture.texture =
                      textures[baseColorTexture.index]),
                  normalTexture &&
                    (normalTexture.texture = textures[normalTexture.index]),
                  metallicRoughnessTexture &&
                    (metallicRoughnessTexture.texture =
                      textures[metallicRoughnessTexture.index]),
                  occlusionTexture &&
                    (occlusionTexture.texture =
                      textures[occlusionTexture.index]),
                  emissiveTexture &&
                    (emissiveTexture.texture = textures[emissiveTexture.index]),
                  {
                    name: name,
                    extensions: extensions,
                    extras: extras,
                    baseColorFactor: baseColorFactor,
                    baseColorTexture: baseColorTexture,
                    metallicFactor: metallicFactor,
                    roughnessFactor: roughnessFactor,
                    metallicRoughnessTexture: metallicRoughnessTexture,
                    normalTexture: normalTexture,
                    occlusionTexture: occlusionTexture,
                    emissiveTexture: emissiveTexture,
                    emissiveFactor: emissiveFactor,
                    alphaMode: alphaMode,
                    alphaCutoff: alphaCutoff,
                    doubleSided: doubleSided,
                  }
                );
              },
            )
          : null;
      }));
  }),
  Class(function GeomThread() {
    Inherit(this, Component);
    const _this = this;
    var _cache = {},
      _cacheWait = {},
      _receive = {},
      _dracoLoaded = null;
    function computeBounding(data) {
      let geom = new Geometry();
      (geom.addAttribute("position", new GeometryAttribute(data.position, 3)),
        data.index && geom.setIndex(data.index),
        geom.computeBoundingBox(),
        geom.computeBoundingSphere(),
        (data.boundingBox = geom.boundingBox),
        (data.boundingSphere = geom.boundingSphere));
    }
    function loadGeometry(e, id) {
      get(e.path)
        .then((data) => {
          let buffers = [];
          if (data.data && data.metadata?.type) {
            let bufferList = { _type: data.metadata.type },
              jsonData = data.data;
            jsonData.index &&
              ((bufferList.index = new Geometry.TYPED_ARRAYS[
                jsonData.index.type
              ](jsonData.index.array)),
              buffers.push(bufferList.index.buffer));
            for (let key in jsonData.attributes) {
              let attrib = jsonData.attributes[key];
              ((bufferList[key] = new Geometry.TYPED_ARRAYS[attrib.type](
                attrib.array,
              )),
                (bufferList[`${key}ItemSize`] = attrib.itemSize),
                buffers.push(bufferList[key].buffer));
            }
            (bufferList.position && computeBounding(bufferList),
              data.userData && (bufferList.userData = data.userData),
              resolve(bufferList, id, buffers));
          } else {
            for (let key in data)
              if ("bones" != key)
                if (Array.isArray(data[key])) {
                  const ArrayType =
                    "index" == key
                      ? Geometry.arrayNeedsUint32(data[key])
                        ? Uint32Array
                        : Uint16Array
                      : Float32Array;
                  ((data[key] = new ArrayType(data[key])),
                    buffers.push(data[key].buffer));
                } else data[key].length > 0 && buffers.push(data[key].buffer);
            (computeBounding(data),
              e.custom && self[e.custom](data),
              resolve(data, id, buffers));
          }
        })
        .catch((er) => {
          e.preloading || console.error(er);
          let plane = new PlaneGeometry(1, 1).toNonIndexed(),
            buffers = [],
            data = {};
          for (let key in plane.attributes)
            ((data[key] = plane.attributes[key].array),
              buffers.push(data[key].buffer));
          (computeBounding(data), resolve(data, id, buffers));
        });
    }
    function geom_useFn(e) {
      (Global.FNS || (Global.FNS = []), Global.FNS.push(e.name));
    }
    function loadDracoLib() {
      _dracoLoaded = Promise.create();
      const useJS = "object" != typeof WebAssembly,
        libFolder = "~assets/js/lib/_draco/",
        libs = useJS
          ? [`${libFolder}draco_decoder.js`]
          : [
              `${libFolder}draco_wasm_wrapper.js`,
              `${libFolder}draco_decoder.wasm`,
            ];
      Promise.all(
        libs.map((url, i) =>
          fetch(Assets.getPath(url)).then((res) => {
            if (!res.ok) throw new Error();
            return 0 === i ? res.text() : res.arrayBuffer();
          }),
        ),
      )
        .then(async (loadedLibs) => {
          Thread.upload(
            [
              "function loadDraco() {",
              "/* draco decoder */",
              loadedLibs[0],
              "",
              "/* worker */",
              "",
              "let decoderConfig, decoderPending;",
              "",
              DracoThread.onError.toString(),
              DracoThread.decodeGeometry.toString(),
              DracoThread.decodeIndex.toString(),
              DracoThread.decodeAttribute.toString(),
              DracoThread.getDracoDataType.toString(),
              "",
              "return " + DracoThread.loadDraco.toString(),
              "};",
            ].join("\n"),
          );
          const pool = Thread.shared(!0).array,
            decoderConfig = useJS ? {} : { wasmBinary: loadedLibs[1] };
          (pool.forEach((t) => t.importCode("self.loadDraco = loadDraco();")),
            await Promise.all(
              pool.map((t) =>
                t.loadDraco({ type: "init", decoderConfig: decoderConfig }),
              ),
            ),
            _dracoLoaded.resolve());
        })
        .catch(() => {
          (console.warn("Draco libs could not be loaded. Fallback to .json"),
            _dracoLoaded.reject());
        });
    }
    function parseGeometry(data, path, custom) {
      let geometry;
      if (custom && _receive[custom]) geometry = _receive[custom](data);
      else {
        let geom = new Geometry();
        if (data._type) {
          for (key in data)
            if ("_type" !== key && !key.endsWith("ItemSize"))
              switch (key) {
                case "userData":
                  geom.userData = data.userData;
                  break;
                case "boundingBox":
                  geom.boundingBox = new Box3(
                    new Vector3().set(
                      data.boundingBox.min.x,
                      data.boundingBox.min.y,
                      data.boundingBox.min.z,
                    ),
                    new Vector3().set(
                      data.boundingBox.max.x,
                      data.boundingBox.max.y,
                      data.boundingBox.max.z,
                    ),
                  );
                  break;
                case "boundingSphere":
                  geom.boundingSphere = new Sphere(
                    new Vector3().set(
                      data.boundingSphere.center.x,
                      data.boundingSphere.center.y,
                      data.boundingSphere.center.z,
                    ),
                    data.boundingSphere.radius,
                  );
                  break;
                case "index":
                  geom.setIndex(data.index);
                  break;
                default:
                  data[`${key}ItemSize`] &&
                    geom.addAttribute(
                      key,
                      new GeometryAttribute(data[key], data[`${key}ItemSize`]),
                    );
              }
        } else
          (geom.addAttribute(
            "position",
            new GeometryAttribute(data.position, 3),
          ),
            geom.addAttribute(
              "normal",
              new GeometryAttribute(data.normal || data.position.length, 3),
            ),
            geom.addAttribute(
              "uv",
              new GeometryAttribute(
                data.uv || (data.position.length / 3) * 2,
                2,
              ),
            ),
            data.uv2 &&
              geom.addAttribute("uv2", new GeometryAttribute(data.uv2, 2)),
            data.vdata &&
              geom.addAttribute("vdata", new GeometryAttribute(data.vdata, 3)),
            data.index && geom.setIndex(data.index),
            data.skinIndex &&
              geom.addAttribute(
                "skinIndex",
                new GeometryAttribute(data.skinIndex, 4),
              ),
            data.skinWeight &&
              geom.addAttribute(
                "skinWeight",
                new GeometryAttribute(data.skinWeight, 4),
              ),
            (data.rig || data.bones) &&
              (geom.bones = (data.rig ? data.rig.bones : data.bones).slice(0)),
            (geom.boundingBox = new Box3(
              new Vector3().set(
                data.boundingBox.min.x,
                data.boundingBox.min.y,
                data.boundingBox.min.z,
              ),
              new Vector3().set(
                data.boundingBox.max.x,
                data.boundingBox.max.y,
                data.boundingBox.max.z,
              ),
            )),
            (geom.boundingSphere = new Sphere(
              new Vector3().set(
                data.boundingSphere.center.x,
                data.boundingSphere.center.y,
                data.boundingSphere.center.z,
              ),
              data.boundingSphere.radius,
            )));
        ((geometry = geom), (geom._src = path));
      }
      if (!geometry.attributes.position)
        throw `GeomThread :: Malformed geometry is missing position data. ${path}`;
      (_this.caching && (_cache[path] = geometry),
        _cacheWait[path]?.resolve(geometry));
    }
    ((this.caching = !0),
      (async function () {
        (await Hydra.ready(),
          Thread.upload(loadGeometry, geom_useFn, computeBounding));
      })(),
      (this.loadGeometry = function (path, custom, preloading) {
        if (!Device.graphics.gpu)
          return Promise.resolve(new PlaneGeometry(1, 1));
        if (_cache[path]) return Promise.resolve(_cache[path]);
        let cacheBust = !1;
        path.includes("?") &&
          ((path = path.split("?")[0]), (cacheBust = "?" + Utils.timestamp()));
        let isBinary = path.endsWith(".bin");
        if (
          (path.includes("http") ||
            (Hydra.LOCAL || (cacheBust = !1),
            path.includes("assets/geometry/") ||
              (path = "assets/geometry/" + path),
            path.includes(".") || (path += ".json"),
            cacheBust && (path += cacheBust)),
          (path = Thread.absolutePath(Assets.getPath(path))),
          _this.caching)
        ) {
          if (_cacheWait[path]) return _cacheWait[path];
          _cacheWait[path] = Promise.create();
        }
        return (
          isBinary
            ? (_dracoLoaded || loadDracoLib(),
              _dracoLoaded
                .then(() => {
                  Thread.shared()
                    .loadDraco({
                      type: "decode",
                      path: path,
                      custom: custom,
                      preloading: preloading,
                    })
                    .then((data) => parseGeometry(data, path, custom));
                })
                .catch(() => {
                  ((path = path.replace(".bin", ".json")),
                    Thread.shared()
                      .loadGeometry({
                        path: path,
                        custom: custom,
                        preloading: preloading,
                      })
                      .then((data) => parseGeometry(data, path, custom)));
                }))
            : Thread.shared()
                .loadGeometry({
                  path: path,
                  custom: custom,
                  preloading: preloading,
                })
                .then((data) => parseGeometry(data, path, custom)),
          _cacheWait[path]
        );
      }),
      (this.removeFromCache = function (path) {
        (path.includes("assets/geometry/") ||
          (path = "assets/geometry/" + path),
          path.includes(".") || (path += ".json"),
          (path = Thread.absolutePath(Assets.getPath(path))),
          delete _cache[path],
          delete _cacheWait[path]);
      }),
      (this.loadDracoLib = function () {
        return (_dracoLoaded || loadDracoLib(), _dracoLoaded);
      }),
      (this.loadSkinnedGeometry = function (path, custom, preloading) {
        return this.loadGeometry(path, custom, preloading);
      }),
      (this.customFunction = function (fn, receive) {
        let name = Thread.upload(fn);
        ((name = name[0]),
          t.geom_useFn({ name: name }),
          (_receive[name] = receive));
      }));
  }, "static"),
  Class(
    function InstanceMesh(_mesh, _shader, _group, _input) {
      Inherit(this, Component);
      const _this = this;
      var _config,
        _frustumCulled = !1,
        _blankShader,
        _instanceGroup;
      function initHotReload() {
        ((_mesh.cacheGeom = _mesh.geometry.clone()),
          _this.events.sub(SceneLayout.HOTLOAD_GEOMETRY, ({ file: file }) => {
            (_mesh.geometry?._src?.includes(file) &&
              GeomThread.loadGeometry(file).then((_) => {
                createInstanceMesh(_config.getFilePath("json"));
              }),
              file.includes(_config.getFilePath("json")) &&
                createInstanceMesh(_config.getFilePath("json")));
          }));
      }
      async function createInstanceMesh(file) {
        if (!file) return;
        let isBinary = file.includes(".bin"),
          data;
        (file.includes("assets/geometry") || (file = `assets/geometry/${file}`),
          isBinary || file.includes(".json") || (file += ".json"),
          _mesh.cacheGeom && (file += "?" + Utils.timestamp()),
          _mesh.instanceMesh && (_mesh.instanceMesh.visible = !1),
          isBinary
            ? (await GeomThread.loadDracoLib(),
              (data = await Thread.shared().loadDraco({
                type: "decode",
                path: Thread.absolutePath(Assets.getPath(file)),
              })))
            : (data = await Thread.shared().parseInstanceMesh({
                url: Thread.absolutePath(Assets.getPath(file)),
              })));
        let isStatic = !_config.get("dynamic");
        if (
          ((_this.batch = _this.initClass(MeshBatch, {
            visibilityCheck: !isStatic,
          })),
          _mesh._parent.add(_this.batch.group),
          (_this.batch.static = isStatic),
          (_this.batch.frustumCulled = _frustumCulled),
          (_this.batch.onMeshCreated = (mesh) => {
            let geom = mesh.geometry;
            for (let key in data) {
              if (
                [
                  "_type",
                  "userData",
                  "offset",
                  "orientation",
                  "scale",
                ].includes(key)
              )
                continue;
              let itemSize = data[`${key}ItemSize`];
              "number" == typeof itemSize &&
                geom.addAttribute(
                  key,
                  new GeometryAttribute(
                    data[key],
                    itemSize,
                    1,
                    _this.batch.useDynamic,
                  ),
                );
            }
            let instances = [];
            for (let i = 0; i < count; i++) instances.push(i);
            (geom.addAttribute(
              "instance",
              new GeometryAttribute(new Float32Array(instances), 1, 1),
            ),
              (_mesh.instanceMesh = mesh),
              mesh.position.copy(_mesh.position),
              mesh.quaternion.copy(_mesh.quaternion),
              mesh.scale.copy(_mesh.scale),
              (mesh.geometry.maxInstancedCount =
                _this.maxInstancedCount * _this.instanceMultiplier),
              _mesh.instanceMeshReady.resolve());
          }),
          !data.offsetItemSize)
        )
          return;
        let count = data.offset.length / data.offsetItemSize;
        for (let i = 0; i < count; ++i) {
          let m = new Mesh(_mesh.cacheGeom || _mesh.geometry, _mesh.shader);
          (m.position.fromArray(data.offset, i * data.offsetItemSize),
            data.orientation &&
              m.quaternion.fromArray(
                data.orientation,
                i * data.orientationItemSize,
              ),
            data.scale && m.scale.fromArray(data.scale, i * data.scaleItemSize),
            (m.renderOrder = _mesh.renderOrder),
            (m.castShadow = _mesh.castShadow),
            (m.frustumCulled = !1),
            (m.renderOrder = _mesh.renderOrder),
            (m.castShadow = _mesh.castShadow),
            (m.receiveLight = _mesh.receiveLight),
            (m.shader.neverRender = !1),
            _this.batch.add(m),
            (m.shader.neverRender = !1),
            (m.shader = _blankShader),
            _instanceGroup.add(m));
        }
        let test = _config.get("test");
        (test && (_this.instanceMultiplier = eval(test)),
          void 0 === _this.maxInstancedCount &&
            (_this.maxInstancedCount = count),
          isStatic &&
            (await _this.batch.staticReady(),
            (_instanceGroup.matrixAutoUpdate = !1)));
      }
      function addHandlers() {
        (_this.events.sub(MeshUIL.UPDATE, handleMeshUpdate),
          Hydra.LOCAL &&
            UIL.global &&
            (_this.events.sub(
              UILGraphNode.TOGGLE_VISIBILITY,
              handleToggleVisibility,
            ),
            _this.events.sub(InputUIL.UPDATE, handleUILUpdate)));
      }
      function handleMeshUpdate({ key: key, prefix: prefix, val: val }) {
        if (
          _mesh.instanceMesh &&
          (prefix = prefix.substring(5)) === _mesh.prefix
        )
          switch (key) {
            case "position":
              _mesh.instanceMesh.position.fromArray(val);
              break;
            case "rotation":
              _mesh.instanceMesh.rotation.fromArray(val);
              break;
            case "scale":
              _mesh.instanceMesh.scale.fromArray(val);
          }
      }
      function handleToggleVisibility({ id: id, visible: visible }) {
        _this.batch &&
          id === _mesh.uilGroup.id &&
          (_this.batch.group.visible = visible);
      }
      function handleUILUpdate(e) {
        _this.batch &&
          e.group === _input &&
          "visible" === e.key &&
          (_this.batch.group.visible = _input.get("visible"));
      }
      ((this.instanceMultiplier = 1),
        (_config = InputUIL.create("im_" + _input.prefix, _group)).addFile(
          "json",
          { relative: "assets/geometry" },
        ),
        _config.add("test"),
        _config.addToggle("dynamic", !1),
        _config.setLabel("Instance"),
        !1 !== _input.get("visible") &&
          ((_this._config = _config),
          ((_blankShader = Utils3D.getTestShader()).visible = !1),
          ((_instanceGroup = new Group()).doNotProject = !0),
          _mesh._parent.add(_instanceGroup),
          _mesh._parent.remove(_mesh),
          (_mesh.visible = !1),
          (_mesh.instanceMeshReady = Promise.create()),
          (_mesh.instanceMeshBeforeReady = Promise.create()),
          createInstanceMesh(_config.getFilePath("json")),
          (_config.onUpdate = (_) => {
            createInstanceMesh(_config.getFilePath("json"));
          }),
          addHandlers(),
          Hydra.LOCAL && initHotReload()),
        (this.applyToShader = function (shader) {
          _this.batch.applyToShader(shader);
        }),
        this.get("frustumCulled", () =>
          _this.batch ? _this.batch.frustumCulled : _frustumCulled,
        ),
        this.set("frustumCulled", async (b) => {
          (_this.batch && (_this.batch.frustumCulled = b),
            (_frustumCulled = b));
        }));
    },
    (_) => {
      Thread.upload(function parseInstanceMesh({ url: url }, id) {
        get(url).then((data) => {
          let bufferList = {},
            buffers = [];
          if (data.data && data.metadata?.type) {
            bufferList._type = data.metadata.type;
            let jsonData = data.data;
            for (let key in jsonData.attributes) {
              let attrib = jsonData.attributes[key];
              ((bufferList[key] = new Geometry.TYPED_ARRAYS[attrib.type](
                attrib.array,
              )),
                (bufferList[`${key}ItemSize`] = attrib.itemSize),
                buffers.push(bufferList[key].buffer));
            }
          } else {
            bufferList._type = "BufferGeometry";
            for (let key in data) {
              let attrib = data[key];
              ((bufferList[key] = new Float32Array(attrib.buffer)),
                (bufferList[`${key}ItemSize`] = attrib.components),
                buffers.push(bufferList[key].buffer));
            }
          }
          resolve(bufferList, id, buffers);
        });
      });
    },
  ),
  Class(
    function MeshBatch(_input, _config) {
      Inherit(this, Object3D);
      const _this = this;
      var _geom,
        _shader,
        _mesh,
        _firstRender,
        _shaderKey,
        _availableIndices,
        _packedData,
        _packedTexture,
        _maxIndices,
        _static = !1,
        _renderOrder = 0,
        _objects = [],
        _offset = [],
        _quaternion = [],
        _scale = [],
        _attributes = {},
        _uniformToAttrib = [],
        _uniformNoAttrib = [],
        _frustumCulled = !0,
        _v1 = new Vector3(),
        _v2 = new Vector3(),
        _q = new Quaternion(),
        _list = new LinkedList();
      async function initFromSceneLayout() {
        let wildcard = _input.get("wildcard");
        if (!wildcard || !wildcard.length) return;
        let groupName = wildcard.split("|")[0],
          group = await _this.parent.getLayer(groupName);
        await _this.wait(group.children, "length");
        let children = [...group.children];
        (children.sort((a, b) => a.renderOrder - b.renderOrder),
          children.forEach((mesh) => _this.add(mesh)),
          wildcard.includes("static") && (_this.static = !0),
          (_this.group.renderOrder = children[0].renderOrder),
          group.add(_this.group));
      }
      function updateShader(shader, castShadow) {
        let prefetchCode = Shaders.getShader(shader.vsName + ".vs");
        ((shader.customCompile = `${shader.vsName}|${shader.fsName}|instance`),
          (shader.castShadow = castShadow),
          shader.resetProgram());
        let cached = MeshBatch.shaders[`${shader.vsName}|${shader.fsName}`];
        if (cached)
          return (
            (shader.fragmentShader = shader.restoreFS = cached.fragment),
            void (shader.vertexShader = shader.restoreVS = cached.vertex)
          );
        let vsSplit = shader.vertexShader.split("__ACTIVE_THEORY_LIGHTS__"),
          fsSplit = shader.fragmentShader.split("__ACTIVE_THEORY_LIGHTS__");
        if (
          !vsSplit[1].includes("vec3 pos = position;") &&
          !vsSplit[1].includes("pos = pos;") &&
          !shader.vertexShader.includes("vec3 transformPosition")
        )
          throw `Shader ${shader.vsName} needs to have "vec3 pos = position;" in order for batching to work`;
        let definitions = [];
        (vsSplit[1].split("\n").forEach((line) => {
          if (line.includes("uniform")) {
            if (line.includes("sampler2D")) return;
            let data = line.split(" "),
              uni = data[2].replace(";", "");
            (function uniformToAttrib(key) {
              key = key.trim();
              for (let i = 0; i < _uniformToAttrib.length; i++) {
                let val = _uniformToAttrib[i];
                if (key.includes(val) || val.includes(key))
                  return !_uniformNoAttrib.includes(key);
              }
              return !1;
            })(uni) &&
              (definitions.push(`${uni} = a_${data[2]}`),
              (vsSplit[1] = vsSplit[1].replace(
                line,
                `attribute ${data[1]} a_${data[2]}\nvarying ${data[1]} ${data[2]}`,
              )),
              (fsSplit[1] = fsSplit[1].replace(
                line,
                `varying ${data[1]} ${data[2]}`,
              )));
          }
        }),
          (vsSplit[1] = vsSplit[1].replace(
            /vec3 pos = position;/g,
            "vec3 pos = transformPosition(position, offset, scale, orientation);",
          )),
          (vsSplit[1] = vsSplit[1].replace(
            /pos = pos;/g,
            "pos = transformPosition(pos, offset, scale, orientation);",
          )),
          (vsSplit[1] = vsSplit[1].replace(
            /vNormal = normalMatrix \* normal;/g,
            "vNormal = normalMatrix * transformNormal(normal, orientation);",
          )),
          (vsSplit[1] = vsSplit[1].replace(
            /vWorldNormal = transpose(inverse(mat3(modelMatrix))) \* normal;/g,
            "vWorldNormal = transpose(inverse(mat3(modelMatrix))) * transformNormal(normal, orientation);",
          )),
          (vsSplit[1] = vsSplit[1].replace(
            /vec3 transformedNormal = normal;/g,
            "vec3 transformedNormal = transformNormal(normal, orientation);",
          )));
        let main = vsSplit[1].split("main() {");
        ((main[1] = "\n" + definitions.join("\n") + main[1]),
          (vsSplit[1] = main.join("main() {")),
          (vsSplit[0] += "#define INSTANCED 1\n"),
          (fsSplit[0] += "#define INSTANCED 1\n"),
          (prefetchCode && prefetchCode.includes("attribute vec3 offset")) ||
            ((vsSplit[0] += "\n"),
            (vsSplit[0] += "attribute float instance;\n"),
            (vsSplit[0] += "attribute vec3 offset;\n"),
            (vsSplit[0] += "attribute vec3 scale;\n"),
            (vsSplit[0] += "attribute vec4 orientation;\n")),
          shader.vertexShader.includes("vec3 transformPosition") ||
            (vsSplit[0] += Shaders.getShader("instance.vs") + "\n"),
          _packedData &&
            (vsSplit[0] +=
              "\n            attribute float batchIndex;\n            uniform vec3 uPackedInfo;\n            uniform sampler2D tPackedTexture;\n            vec2 getPackedUV(float index, float offset) {\n                float pixel = (index*uPackedInfo.x) + offset;\n            \n                float size = uPackedInfo.y;\n                float p0 = pixel / size;\n                float y = floor(p0);\n                float x = p0 - y;\n            \n                vec2 uv = vec2(0.0);\n                uv.x = x;\n                uv.y = y / size;\n                return uv;\n            }\n            \n            vec4 getPackedData(float offset) {\n                return texture2D(tPackedTexture, getPackedUV(batchIndex, offset));\n            }\n            "),
          (vsSplit = vsSplit.join("__ACTIVE_THEORY_LIGHTS__")),
          (fsSplit = fsSplit.join("__ACTIVE_THEORY_LIGHTS__")),
          (shader.vertexShader = shader.restoreVS = vsSplit),
          (shader.fragmentShader = shader.restoreFS = fsSplit),
          (_shaderKey = `${shader.vsName}|${shader.fsName}`),
          (MeshBatch.shaders[_shaderKey] = {
            fragment: shader.fragmentShader,
            vertex: shader.vertexShader,
          }));
      }
      function modifyGeometry(dir) {
        if (!_geom || !_geom.attributes || !_geom.attributes.offset) return;
        let count = _geom.attributes.offset.count + dir;
        ((_offset = new Float32Array(3 * count)),
          (_scale = new Float32Array(3 * count)),
          (_quaternion = new Float32Array(4 * count)),
          _geom.attributes.offset.setArray(new Float32Array(3 * count)),
          _geom.attributes.scale.setArray(new Float32Array(3 * count)),
          _geom.attributes.orientation.setArray(new Float32Array(4 * count)));
        for (let key in _attributes) {
          let components = _geom.attributes[key].itemSize;
          ((_attributes[key] = new Float32Array(count * components)),
            _geom.attributes[key].setArray(
              new Float32Array(count * components),
            ));
        }
        ((_geom.maxInstancedCount = _objects.length), loop());
      }
      function dirty(a, b) {
        for (let i = a.length - 1; i > -1; i--) if (a[i] != b[i]) return !0;
        return !1;
      }
      function prepareMesh(mesh, i) {
        let pos = _v1,
          scale = _v2,
          quaternion = _q;
        if (_config.worldCoords)
          try {
            if (_config.parent > 0)
              switch (_config.parent) {
                case 1:
                  (pos.copy(mesh._parent.position),
                    scale.copy(mesh._parent.scale),
                    quaternion.copy(mesh._parent.quaternion));
                  break;
                case 2:
                  (pos.copy(mesh._parent._parent.position),
                    scale.copy(mesh._parent._parent.scale),
                    quaternion.copy(mesh._parent._parent.quaternion));
              }
            else
              _config.addParentPosition
                ? (pos.copy(mesh.position).add(mesh._parent.position),
                  2 == _config.addParentPosition &&
                    pos.add(mesh._parent._parent.position),
                  scale.copy(mesh.scale),
                  quaternion.copy(mesh.quaternion))
                : (pos.copy(mesh.getWorldPosition()),
                  scale.copy(mesh.getWorldScale()),
                  quaternion.copy(mesh.getWorldQuaternion()));
            _config.bypassVisibilityCheck ||
              mesh.determineVisible() ||
              (scale.x = scale.y = scale.z = 0);
          } catch (e) {
            (pos.copy(mesh.position),
              scale.copy(mesh.scale),
              quaternion.copy(mesh.quaternion));
          }
        else
          (pos.copy(mesh.position),
            scale.copy(mesh.scale),
            quaternion.copy(mesh.quaternion),
            _config.visibilityCheck &&
              !mesh.determineVisible() &&
              scale.setScalar(0));
        mesh.batchOffsetPos && pos.add(mesh.batchOffsetPos);
        let i3 = 3 * i,
          i4 = 4 * i;
        if (
          ((_offset[i3 + 0] = pos.x),
          (_offset[i3 + 1] = pos.y),
          (_offset[i3 + 2] = pos.z),
          (_scale[i3 + 0] = scale.x),
          (_scale[i3 + 1] = scale.y),
          (_scale[i3 + 2] = scale.z),
          (_quaternion[i4 + 0] = quaternion.x),
          (_quaternion[i4 + 1] = quaternion.y),
          (_quaternion[i4 + 2] = quaternion.z),
          (_quaternion[i4 + 3] = quaternion.w),
          mesh.attributes)
        )
          for (let key in mesh.attributes) {
            let attr = mesh.attributes[key],
              value = void 0 === attr.value ? attr : attr.value;
            value instanceof Color
              ? ((_attributes[key][3 * i + 0] = value.r),
                (_attributes[key][3 * i + 1] = value.g),
                (_attributes[key][3 * i + 2] = value.b))
              : value instanceof Vector3
                ? ((_attributes[key][3 * i + 0] = value.x),
                  (_attributes[key][3 * i + 1] = value.y),
                  (_attributes[key][3 * i + 2] = value.z))
                : value instanceof Vector4 || value instanceof Quaternion
                  ? ((_attributes[key][4 * i + 0] = value.x),
                    (_attributes[key][4 * i + 1] = value.y),
                    (_attributes[key][4 * i + 2] = value.z),
                    (_attributes[key][4 * i + 3] = value.w))
                  : value instanceof Vector2
                    ? ((_attributes[key][2 * i + 0] = value.x),
                      (_attributes[key][2 * i + 1] = value.y))
                    : (_attributes[key][i] = value);
          }
        if (_packedTexture) {
          let batchIndex = mesh.batchIndex,
            stride = 4 * _packedTexture.keys;
          for (let key in _packedData) {
            let offset = 4 * _packedData[key],
              value = mesh.packedData[key].value,
              index = batchIndex * stride + offset,
              r = (g = b = a = 1);
            (value instanceof Color
              ? ((r = value.r), (g = value.g), (b = value.b))
              : value instanceof Vector3
                ? ((r = value.x), (g = value.y), (b = value.z))
                : value instanceof Vector4 || value instanceof Quaternion
                  ? ((r = value.x), (g = value.y), (b = value.z), (a = value.w))
                  : value instanceof Vector2
                    ? ((r = value.x), (g = value.y))
                    : (r = value),
              (_packedTexture.data[index + 0] = r),
              (_packedTexture.data[index + 1] = g),
              (_packedTexture.data[index + 2] = b),
              (_packedTexture.data[index + 3] = a));
          }
          _packedTexture.needsUpdate = !0;
        }
      }
      function updateBuffers() {
        if (_mesh) {
          (dirty(_quaternion, _geom.attributes.orientation.array) &&
            (_geom.attributes.orientation.array.set(_quaternion),
            (_geom.attributes.orientation.needsUpdate = !0)),
            dirty(_offset, _geom.attributes.offset.array) &&
              (_geom.attributes.offset.array.set(_offset),
              (_geom.attributes.offset.needsUpdate = !0)),
            dirty(_scale, _geom.attributes.scale.array) &&
              (_geom.attributes.scale.array.set(_scale),
              (_geom.attributes.scale.needsUpdate = !0)));
          for (let key in _attributes)
            dirty(_attributes[key], _geom.attributes[key].array) &&
              (_geom.attributes[key].array.set(_attributes[key]),
              (_geom.attributes[key].needsUpdate = !0));
        } else
          !(function initMesh() {
            if (
              (_geom.addAttribute(
                "offset",
                new GeometryAttribute(
                  new Float32Array(_offset),
                  3,
                  1,
                  _this.useDynamic,
                ),
              ),
              _geom.addAttribute(
                "scale",
                new GeometryAttribute(
                  new Float32Array(_scale),
                  3,
                  1,
                  _this.useDynamic,
                ),
              ),
              _geom.addAttribute(
                "orientation",
                new GeometryAttribute(
                  new Float32Array(_quaternion),
                  4,
                  1,
                  _this.useDynamic,
                ),
              ),
              _frustumCulled)
            ) {
              let box = new Box3();
              (_objects.forEach((mesh) => box.expandByObject(mesh, !0)),
                (_geom.boundingBox = box),
                (_geom.boundingSphere = box.getBoundingSphere()));
            }
            ((_mesh = _this.usePoints
              ? new Points(_geom, _shader)
              : new Mesh(_geom, _shader)),
              (_shader.castShadow || _this.castShadow) &&
                defer((_) => (_mesh.castShadow = !0)),
              (_mesh.asyncPromise = _this.group.asyncPromise),
              _this.group.asyncPromise.resolve(),
              (_this.mesh = _mesh),
              (_this.shader = _mesh.shader),
              (_this.mesh.isMeshBatch = !0),
              _this.group.add(_mesh),
              (_mesh.frustumCulled = _frustumCulled),
              _renderOrder && (_mesh.renderOrder = _renderOrder),
              (_offset = new Float32Array(_offset)),
              (_quaternion = new Float32Array(_quaternion)),
              (_scale = new Float32Array(_scale)));
            for (let key in _attributes) {
              _attributes[key] = new Float32Array(_attributes[key]);
              let components = 1,
                attr = _objects[0].attributes[key],
                value = attr.value || attr;
              (value instanceof Vector3
                ? (components = 3)
                : value instanceof Vector4 || value instanceof Quaternion
                  ? (components = 4)
                  : value instanceof Color
                    ? (components = 3)
                    : value instanceof Vector2 && (components = 2),
                _geom.addAttribute(
                  key,
                  new GeometryAttribute(
                    new Float32Array(_attributes[key]),
                    components,
                    1,
                    _this.useDynamic,
                  ),
                ));
            }
            _this.onMeshCreated && _this.onMeshCreated(_mesh);
          })();
      }
      async function initializeStatic() {
        let wasVisible = _this.group.determineVisible();
        if (
          (await ((_) => {
            let promise = Promise.create(),
              mesh = _list.start(),
              i = 0,
              worker = new Render.Worker((_) => {
                (mesh.updateMatrixWorld(!0),
                  prepareMesh(mesh, i),
                  i++,
                  (mesh = _list.next()),
                  mesh || (worker.stop(), promise.resolve()));
              }, 1);
            return promise;
          })(),
          updateBuffers(),
          wasVisible)
        ) {
          if (_frustumCulled) {
            let box = new Box3();
            (_objects.forEach((mesh) => box.expandByObject(mesh, !0)),
              (_geom.boundingBox = box),
              (_geom.boundingSphere = box.getBoundingSphere()));
          }
          _this.flag("isStaticReady", !0);
        } else
          (await _this.wait(() => _this.group.determineVisible()),
            _static && initializeStatic());
      }
      function loop() {
        _static && _this.stopRender(loop, RenderManager.AFTER_LOOPS);
        let first = !_firstRender;
        _firstRender = !0;
        let i = 0,
          mesh = _list.start();
        for (; mesh; )
          ((!1 !== mesh.batchNeedsUpdate || first) &&
            (first && mesh.updateMatrixWorld(!0), prepareMesh(mesh, i)),
            (mesh = _list.next()),
            i++);
        updateBuffers();
      }
      function firstLoop() {
        (_static || _this.startRender(loop, RenderManager.AFTER_LOOPS), loop());
      }
      ((_this.usePoints = !1),
        (_this.useDynamic = !1),
        (function () {
          if (
            (_input instanceof InputUILConfig ||
              ((_config = _input), (_input = null)),
            (_config = _config || {}),
            _input && _this.parent.ready(!0).then(initFromSceneLayout),
            (_this.group.asyncPromise = Promise.create()),
            Hydra.LOCAL)
          ) {
            let warning = setTimeout(() => {
              console.log(
                "Problem loading instance",
                _this?.parent?._config?.getFilePath?.("json"),
              );
            }, 5e3);
            _this.group.asyncPromise.then(() => {
              clearTimeout(warning);
            });
          }
          Hydra.LOCAL &&
            (function initHotReload() {
              _this.events.sub(
                ShaderUIL.SHADER_UPDATE,
                ({ shader: shader }) => {
                  if (
                    _shader &&
                    _shader.vsName &&
                    shader.includes(_shader.vsName)
                  ) {
                    let newShader = new Shader(_shader.vsName, _shader.fsName);
                    (delete MeshBatch.shaders[
                      `${_shader.vsName}|${_shader.fsName}`
                    ],
                      updateShader(newShader),
                      Shader.renderer.hotReloadClearProgram(_shader.vsName),
                      newShader.upload(_mesh, _geom),
                      _shader._gl && (_shader._gl = newShader._gl),
                      _shader._gpu && (_shader._gpu = newShader._gpu),
                      _shader._metal && (_shader._metal = newShader._metal));
                  }
                },
              );
            })();
        })(),
        (this.add = function (mesh) {
          (_objects.push(mesh),
            _list.push(mesh),
            (mesh.uploadIgnore = !0),
            (mesh.batch = _this),
            _availableIndices &&
              !mesh.batchIndex &&
              ((mesh.batchIndex = _availableIndices.shift()),
              mesh.attributes || (mesh.attributes = {}),
              (mesh.attributes.batchIndex = { value: mesh.batchIndex })));
          let shader = mesh.shader;
          for (let key in shader.uniforms) {
            let uniform = shader.uniforms[key];
            if (
              uniform.value instanceof Color ||
              uniform.value instanceof Vector2 ||
              uniform.value instanceof Vector3 ||
              uniform.value instanceof Vector4 ||
              uniform.value instanceof Quaternion ||
              "number" == typeof uniform.value
            )
              if (uniform.batchUnique || _config.batchUnique)
                (_uniformToAttrib.push(key),
                  mesh.attributes || (mesh.attributes = {}),
                  (mesh.attributes["a_" + key] = uniform));
              else if (
                (_uniformNoAttrib.includes(key) || _uniformNoAttrib.push(key),
                void 0 !== uniform.packedIndex)
              ) {
                if ((_packedData || (_packedData = {}), !_availableIndices))
                  throw "Can't use packedData without first setting .maxIndices";
                (_packedData[key] || (_packedData[key] = uniform.packedIndex),
                  mesh.packedData || (mesh.packedData = {}),
                  (mesh.packedData[key] = uniform));
              }
          }
          (_geom ||
            (function initGeometry(mesh) {
              if (
                ((_geom = new Geometry().instanceFrom(mesh.geometry)),
                (_this.geom = _geom),
                !_shader)
              ) {
                if (
                  (((_shader = mesh.shader.clone()).debug = !0),
                  _this.usePoints || mesh.shader.replicateUniformsTo(_shader),
                  _packedData)
                ) {
                  let total = Object.keys(_packedData).length,
                    pixels = Math.sqrt(_maxIndices * total),
                    size = Math.pow(
                      2,
                      Math.ceil(Math.log(pixels) / Math.log(2)),
                    );
                  (((_packedTexture = new DataTexture(
                    new Float32Array(size * size * 4),
                    size,
                    size,
                    Texture.RGBAFormat,
                    Texture.FLOAT,
                  )).keys = total),
                    _shader.addUniforms({
                      tPackedTexture: { value: _packedTexture },
                      uPackedInfo: {
                        value: new Vector3(total, size, _maxIndices),
                      },
                    }));
                }
                updateShader(_shader, mesh.castShadow);
              }
              if (mesh.attributes)
                for (let key in mesh.attributes) _attributes[key] = [];
              _static && defer(initializeStatic);
            })(mesh),
            _mesh &&
              (modifyGeometry(1),
              _static &&
                console.error("Don't add more meshes to a static MeshBatch")),
            (mesh.shader.neverRender = !0),
            _static ||
              RenderManager.scheduleOne(firstLoop, RenderManager.AFTER_LOOPS));
        }),
        (this.remove = function (mesh) {
          _objects.includes(mesh) &&
            (_objects.remove(mesh),
            _list.remove(mesh),
            mesh.batchIndex > -1 &&
              !mesh.persistBatchIndex &&
              (_availableIndices.push(mesh.batchIndex),
              _availableIndices.sort((a, b) => a - b)),
            modifyGeometry(-1));
        }),
        (this.onDestroy = function () {
          (_this.mesh && _this.mesh.destroy && _this.mesh.destroy(),
            delete MeshBatch.shaders[_shaderKey]);
        }),
        (this.loadFromFile = async function (shader, geomFile, instanceFile) {
          (geomFile.includes("assets/geometry") ||
            (geomFile = "assets/geometry/" + geomFile),
            geomFile.includes(".json") || (geomFile += ".json"),
            instanceFile.includes("assets/geometry") ||
              (instanceFile = "assets/geometry/" + instanceFile),
            instanceFile.includes(".json") || (instanceFile += ".json"));
          let [geom, data] = await Promise.all([
              GeomThread.loadGeometry(Assets.getPath(geomFile)),
              get(Assets.getPath(instanceFile)),
            ]),
            array = [],
            count = data.offset.buffer.length / 3;
          for (let i = 0; i < count; i++) {
            let mesh = new Mesh(geom, shader);
            (mesh.position.fromArray(data.offset.buffer, 3 * i),
              mesh.scale.fromArray(data.scale.buffer, 3 * i),
              mesh.quaternion.fromArray(data.orientation.buffer, 4 * i),
              array.push(mesh),
              _this.add(mesh));
          }
          return (await _this.ready(), array);
        }),
        (this.ready = function () {
          return _this.wait("mesh");
        }),
        (this.staticReady = function () {
          if (_static) return _this.wait("isStaticReady");
        }),
        (this.getMeshByIndex = function (index) {
          return _objects[index];
        }),
        (this.getMeshCount = function () {
          return _objects.length;
        }),
        this.get("static", () => _static),
        this.set("static", (b) => {
          !!b !== _static &&
            ((_static = !!b),
            _objects.length &&
              (_static &&
                console.warn(
                  "For better initialization performance, set meshBatch.static before adding any meshes",
                ),
              _this.stopRender(loop, RenderManager.AFTER_LOOPS),
              RenderManager.scheduleOne(firstLoop, RenderManager.AFTER_LOOPS)));
        }),
        this.set("maxIndices", (value) => {
          if (
            ((_maxIndices = value),
            !(_availableIndices = _config.availableIndices || []).length)
          )
            for (let i = 0; i < value; i++) _availableIndices[i] = i;
        }),
        this.get("attributes", (_) => _attributes),
        this.get("maxIndices", (_) => _maxIndices),
        this.set("renderOrder", (v) => {
          ((_renderOrder = v), _mesh && (_mesh.renderOrder = v));
        }),
        this.get("renderOrder", (_) => _renderOrder),
        this.set("frustumCulled", (b) => {
          ((_frustumCulled = b), _mesh && (_mesh.frustumCulled = b));
        }),
        (this.applyToShader = function (
          shader,
          castShadow = shader.mesh?.castShadow ?? !1,
        ) {
          updateShader(shader, castShadow);
        }),
        (this.upload = async function () {
          (await _this.ready(), _mesh.upload());
        }));
    },
    (_) => {
      MeshBatch.shaders = {};
    },
  ),
  Class(
    function MeshMerge(_input, _dynamic) {
      Inherit(this, Object3D);
      const _this = this;
      var _mesh,
        _geom,
        _texture,
        _shaderKey,
        _meshes = [],
        _pending = [],
        _index = 0;
      function initDynamic() {
        let array = new Float32Array(1024);
        (((_texture = new DataTexture(
          array,
          16,
          16,
          Texture.RGBAFormat,
          Texture.FLOAT,
        )).dynamic = !0),
          (_texture.promise = Promise.resolve()),
          (function updateShader(shader) {
            ((shader.customCompile = `${shader.vsName}|${shader.fsName}|dynamicMerge`),
              shader.addUniforms({ tDynamicMerge: { value: _texture } }));
            let cached = MeshMerge.shaders[`${shader.vsName}|${shader.fsName}`];
            if (cached)
              return (
                (shader.fragmentShader = cached.fragment),
                shader.resetProgram()
              );
            shader.resetProgram();
            let vsSplit = shader.vertexShader.split("__ACTIVE_THEORY_LIGHTS__");
            if (!vsSplit[1].includes("vec3 pos = position;"))
              throw `Shader ${shader.vsName} needs to have "vec3 pos = position;" in order for dynamic merging to work`;
            ((vsSplit[0] += "attribute float mIndex;\n"),
              (vsSplit[0] += "uniform sampler2D tDynamicMerge;\n"),
              (vsSplit[0] += "vec3 offset;\n"),
              (vsSplit[0] += "vec3 scale;\n"),
              (vsSplit[0] += "vec4 orientation;\n"),
              shader.vertexShader.includes("vec3 transformPosition") ||
                (vsSplit[0] += Shaders.getShader("instance.vs") + "\n"));
            ((vsSplit[0] +=
              "\n        vec2 getDMUV(float index, float offset) {\n            float pixel = (index*3.0) + offset;\n        \n            float size = 16.0;\n            float p0 = pixel / size;\n            float y = floor(p0);\n            float x = p0 - y;\n        \n            vec2 uv = vec2(0.0);\n            uv.x = x;\n            uv.y = y / size;\n            return uv;\n        }\n        \n"),
              (vsSplit[1] = vsSplit[1].replace(
                /vec3 pos = position;/g,
                "vec3 pos = transformPosition(position, offset, scale, orientation);",
              )),
              (vsSplit[1] = vsSplit[1].replace(
                /vNormal = normalMatrix \* normal;/g,
                "vNormal = normalMatrix * transformNormal(normal, orientation);",
              )),
              (vsSplit[1] = vsSplit[1].replace(
                /vec3 transformedNormal = normal;/g,
                "vec3 transformedNormal = transformNormal(normal, orientation);",
              )));
            let oso =
                "\n        offset = texture2D(tDynamicMerge, getDMUV(mIndex, 0.0)).xyz;\n        scale = texture2D(tDynamicMerge, getDMUV(mIndex, 1.0)).xyz;\n        orientation = texture2D(tDynamicMerge, getDMUV(mIndex, 2.0));\n        ",
              main = vsSplit[1].split("main() {");
            ((main[1] = "\n" + oso + main[1]),
              (vsSplit[1] = main.join("main() {")),
              (vsSplit = vsSplit.join("__ACTIVE_THEORY_LIGHTS__")),
              (shader.vertexShader = vsSplit),
              (_shaderKey = `${shader.vsName}|${shader.fsName}`),
              (MeshMerge.shaders[_shaderKey] = {
                vertex: shader.vertexShader,
              }));
          })(_mesh.shader));
        let loop = (_) => {
          for (let i = _meshes.length - 1; i > -1; i--) {
            let mesh = _meshes[i],
              index = mesh.mergeIndex;
            ((array[12 * index + 0] = mesh.position.x),
              (array[12 * index + 1] = mesh.position.y),
              (array[12 * index + 2] = mesh.position.z),
              (array[12 * index + 3] = 1),
              (array[12 * index + 4] = mesh.scale.x),
              (array[12 * index + 5] = mesh.scale.y),
              (array[12 * index + 6] = mesh.scale.z),
              (array[12 * index + 7] = 1),
              (array[12 * index + 8] = mesh.quaternion.x),
              (array[12 * index + 9] = mesh.quaternion.y),
              (array[12 * index + 10] = mesh.quaternion.z),
              (array[12 * index + 11] = mesh.quaternion.w));
          }
        };
        (defer(loop), _this.startRender(loop));
      }
      function completeMerge() {
        ((_mesh.geometry = _geom),
          _mesh.asyncPromise.resolve(),
          _this.onMeshCreated && _this.onMeshCreated(_mesh),
          (_this.mesh = _mesh));
      }
      async function initFromSceneLayout() {
        let wildcard = _input.get("wildcard");
        if (!wildcard || !wildcard.length) return;
        let [groupName, dynamic] = wildcard.split("|");
        await _this.parent.loadedAllLayers();
        let group = await _this.parent.getLayer(groupName);
        _dynamic = "dynamic" == dynamic;
        let children = [...group.children];
        (children.sort((a, b) => a.renderOrder - b.renderOrder),
          children.forEach((mesh) => _this.add(mesh)),
          group.add(_this.group),
          MeshMerge.cache[_input.prefix] ||
            (MeshMerge.cache[_input.prefix] = Promise.create()));
      }
      (!(function () {
        if ("object" == typeof _input) {
          if (!1 === _input.get("visible")) return;
          _this.parent.ready().then(initFromSceneLayout);
        } else "boolean" == typeof _input && (_dynamic = _input);
      })(),
        (this.onDestroy = function () {
          (_mesh.destroy(), delete MeshBatch.shaders[_shaderKey]);
        }),
        (this.ready = function () {
          return _this.wait("mesh");
        }),
        (this.add = function (mesh) {
          if (((mesh.uploadIgnore = !0), !mesh.visible)) return;
          if (
            ((mesh.merge = _this),
            mesh.updateMatrixWorld(!0),
            _mesh ||
              (async function initMesh(mesh) {
                if (
                  (((_mesh = new Mesh(World.QUAD, mesh.shader)).asyncPromise =
                    Promise.create()),
                  _this.group.add(_mesh),
                  _input?.get &&
                    ((_mesh.castShadow = _input.get("castShadow")),
                    (_mesh.shader.receiveShadow = _input.get("receiveShadow"))),
                  _dynamic && initDynamic(),
                  _input?.prefix)
                ) {
                  let cached = MeshMerge.cache[_input.prefix];
                  if (cached)
                    return ((_geom = await cached), void completeMerge());
                }
                await defer();
                let data = await Promise.all(_pending),
                  buffers = [];
                data.forEach((obj) => {
                  for (let key in obj)
                    obj[key].buffer && buffers.push(obj[key].buffer);
                });
                let merged = await Thread.shared().meshMergeComplete(
                  { data: data },
                  buffers,
                );
                _geom = new Geometry();
                for (let key in merged)
                  "components" !== key &&
                    _geom.addAttribute(
                      key,
                      new GeometryAttribute(
                        merged[key],
                        merged.components[key],
                      ),
                    );
                (merged.indexBuffer && (_geom.index = merged.indexBuffer),
                  _input?.prefix &&
                    MeshMerge.cache[_input.prefix].resolve(_geom),
                  completeMerge());
              })(mesh),
            _input?.prefix)
          ) {
            if (MeshMerge.cache[_input.prefix])
              return (
                (mesh.visible = !1),
                _meshes.push(mesh),
                void (mesh.mergeIndex = _index++)
              );
          }
          let geom = mesh.geometry;
          if (mesh.attributes)
            for (let key in mesh.attributes) {
              let attr = mesh.attributes[key];
              (attr instanceof Vector4 && (attr.isVector4 = !0),
                attr instanceof Vector3 && (attr.isVector3 = !0),
                attr instanceof Vector2 && (attr.isVector2 = !0),
                attr instanceof Color && (attr.isColor = !0));
            }
          let data = {},
            components = {},
            buffers = [];
          for (let key in geom.attributes)
            ((data[key] = new Float32Array(geom.attributes[key].array)),
              buffers.push(data[key].buffer),
              (components[key] = geom.attributes[key].itemSize));
          (geom.index &&
            ((data.indexBuffer = new Uint32Array(geom.index)),
            buffers.push(data.indexBuffer.buffer)),
            (data.attributes = mesh.attributes),
            (data.components = components),
            (data.matrix =
              "world" == _input
                ? mesh.matrixWorld.elements
                : mesh.matrix.elements),
            _dynamic && (data.matrix = null),
            (data.dynamic = _dynamic),
            (data.index = mesh.mergeIndex = _index++),
            (mesh.visible = !1),
            _meshes.push(mesh),
            _pending.push(Thread.shared().meshMergeTransform(data, buffers)));
        }),
        (this.onDestroy = function () {
          _input?.prefix && delete MeshMerge.cache[_input.prefix];
        }));
    },
    (_) => {
      (Thread.upload(function meshMergeTransform(e, id) {
        let geom = new Geometry();
        for (let key in e)
          !key.includes(["components", "matrix"]) &&
            e[key] instanceof Float32Array &&
            geom.addAttribute(
              key,
              new GeometryAttribute(e[key], e.components[key]),
            );
        if ((e.indexBuffer && (geom.index = e.indexBuffer), e.attributes))
          for (let key in e.attributes) {
            let components = 1,
              attr = e.attributes[key];
            attr.isVector4
              ? (components = 4)
              : attr.isVector3 || attr.isColor
                ? (components = 3)
                : attr.isVector2 && (components = 2);
            let buffer = new Float32Array(
                geom.attributes.position.count * components,
              ),
              step = buffer.length / components;
            for (let i = 0; i < step; i++)
              4 == components
                ? ((buffer[4 * i + 0] = attr.x),
                  (buffer[4 * i + 1] = attr.y),
                  (buffer[4 * i + 2] = attr.z),
                  (buffer[4 * i + 3] = attr.w))
                : 3 == components
                  ? ((buffer[3 * i + 0] = attr.x || attr.r || 0),
                    (buffer[3 * i + 1] = attr.y || attr.g || 0),
                    (buffer[3 * i + 2] = attr.z || attr.b || 0))
                  : 2 == components
                    ? ((buffer[2 * i + 0] = attr.x),
                      (buffer[2 * i + 1] = attr.y))
                    : (buffer[i] = attr);
            geom.addAttribute(key, new GeometryAttribute(buffer, components));
          }
        e.matrix && geom.applyMatrix(new Matrix4().fromArray(e.matrix));
        let indexBuffer = new Float32Array(geom.attributes.position.count);
        for (let i = 0; i < indexBuffer.length; i++) indexBuffer[i] = e.index;
        geom.addAttribute("mIndex", new GeometryAttribute(indexBuffer, 1));
        let data = {},
          buffers = [],
          components = {};
        for (let key in geom.attributes)
          ((data[key] = geom.attributes[key].array),
            (components[key] = geom.attributes[key].itemSize),
            buffers.push(data[key].buffer));
        (geom.index &&
          ((data.indexBuffer = geom.index),
          buffers.push(data.indexBuffer.buffer)),
          (data.components = components),
          resolve(data, id, buffers));
      }),
        Thread.upload(function meshMergeComplete({ data: data }, id) {
          let _geom;
          data.forEach((data) => {
            let geom = new Geometry();
            for (let key in data)
              "components" != key &&
                ("indexBuffer" == key
                  ? (geom.index = data[key])
                  : geom.addAttribute(
                      key,
                      new GeometryAttribute(data[key], data.components[key]),
                    ));
            _geom ? _geom.merge(geom) : (_geom = geom);
          });
          let result = {},
            components = {},
            buffers = [];
          for (let key in _geom.attributes)
            ((result[key] = _geom.attributes[key].array),
              (components[key] = _geom.attributes[key].itemSize),
              buffers.push(result[key].buffer));
          (_geom.index &&
            ((result.indexBuffer = _geom.index),
            buffers.push(result.indexBuffer.buffer)),
            (result.components = components),
            resolve(result, id, buffers));
        }),
        (MeshMerge.shaders = {}),
        (MeshMerge.cache = {}));
    },
  ),
  Class(function OptimizationProfiler() {
    Inherit(this, Component);
    const _this = this;
    var _shaders, _count, _gradientStops, _color;
    function getGradientColor(alpha, ease = "Sine") {
      !(function initGradientColors() {
        (_gradientStops ||
          (_gradientStops = [
            new Color("#28c913"),
            new Color("#ffde0a"),
            new Color("#ff0000"),
          ]),
          _color || (_color = new Color()));
      })();
      let lastIndex = _gradientStops.length - 1,
        index = Math.clamp(alpha) * lastIndex;
      if (index >= lastIndex) return _color.copy(_gradientStops[lastIndex]);
      let stop0 = Math.floor(index);
      return (
        (alpha = TweenManager.Interpolation[ease].InOut(Math.fract(index))),
        _color
          .copy(_gradientStops[stop0])
          .lerp(_gradientStops[stop0 + 1], alpha, !1)
      );
    }
    function getGradientHexString(alpha, ease) {
      return getGradientColor(alpha, ease).getHexString();
    }
    ((this.active =
      Utils.query("optimizationProfiler") ||
      location.hash?.includes("optimizationProfiler")),
      _this.active &&
        ((_shaders = []),
        (_count = Number(
          String(Utils.query("optimizationProfiler")) ||
            location.hash.split("optimizationProfiler=")[1]?.split("&")[0],
        )),
        isNaN(_count) && (_count = null)),
      (this.setupShader = function (shader) {
        shader.addUniforms({
          texDimensions: { value: 0 },
          texelsPerMeter: { value: _count },
        });
        const parse = (_) => {
          for (let key in shader.uniforms) {
            let value = shader.uniforms?.[key]?.value;
            value instanceof Texture &&
              (value.data ||
                (value.dimensions
                  ? (shader.uniforms.texDimensions.value = Math.max(
                      shader.uniforms.texDimensions.value,
                      Math.max(value.dimensions.width, value.dimensions.height),
                    ))
                  : value.promise?.then(parse)));
          }
        };
        (_shaders.push(shader), parse());
      }),
      (this.override = function (shader, vsCode, fsCode) {
        let vs = vsCode,
          fs = fsCode,
          enabled = !!_count,
          mesh = shader?.mesh;
        if (
          ((enabled = enabled && mesh instanceof Mesh),
          (enabled = enabled && mesh.geometry !== World.QUAD),
          (enabled = enabled && fsCode.includes("vUv")),
          enabled)
        )
          try {
            (!(function () {
              ((vs = vs.slice(0, -(vs.length - vs.lastIndexOf("}")))),
                (vs += `vDensityPos = ${vs.includes("vec3 pos ") ? "pos" : "position"};\n`),
                (vs += "}"));
              let split = vs.split("void main");
              ((split[0] += "\n        out vec3 vDensityPos;\n        "),
                (vs = split.join("void main")));
            })(),
              (function () {
                ((fs = fs.slice(0, -(fs.length - fs.lastIndexOf("}")))),
                  (fs += "FragColor = vec4(getDensityColor(), 1.0);\n"),
                  (fs += "}"));
                let split = fs.split("void main");
                ((split[0] +=
                  "\n        #define TEXEL_DENSITY_EPSILON 10e-10\n        uniform float texDimensions;\n        uniform float texelsPerMeter;\n        in vec3 vDensityPos;\n \nfloat MipLevel(vec2 uv)\n{\n  vec2 dx = dFdx(uv);\n  vec2 dy = dFdy(uv);\n  float d = max( dot(dx, dx), dot(dy, dy) );\n \n  float maxRange = pow(2., (10.0 - 1.) * 2.);\n  d = clamp(d, 1., maxRange);\n \n  float mipLevel = 0.5 * log2(d);\n  return floor(mipLevel);\n}\n\nvec3 getDensityColor() {\n    vec2 uv = vUv.xy;\n    \n    float texWidth = texDimensions;\n    float texHeight = texDimensions;\n\n    vec2 ddxUV  = dFdx(uv * texWidth  / texelsPerMeter);\n    vec2 ddyUV  = dFdy(uv * texHeight / texelsPerMeter);\n    vec3 ddxPos = dFdx(vDensityPos);\n    vec3 ddyPos = dFdy(vDensityPos);\n\t\n\t// NOTE(jserrano): check LOD ?\n\t//float mipLevel = MipLevel(uv * texDimensions);\n    //float mipSize  = pow(2., mipLevel);\n    \n    //ddxUV /= mipSize;\n    //ddyUV /= mipSize;\n\n    float uvArea   = length( cross(vec3(ddxUV,0), vec3(ddyUV,0)) );\n    float faceArea = length( cross(ddxPos, ddyPos) );\n\tfloat density  = uvArea / max(10e-10, faceArea);\n    \n    const float lowRatioLimit  = 0.8;\n    const float midRatio       = 1.0;\n    const float highRatioLimit = 1.2;\n    \n    vec3 finalColor = vec3(0);\n    \n\tif (density > lowRatioLimit && density < highRatioLimit)\n\t{\n        vec3 lowDensityColor  = vec3( 1., 1., 1. );\n        vec3 midDensityColor  = vec3( 0., 1., 0. );\n        vec3 highDensityColor = vec3( 0., 0., 0. );\n        \n        vec3 lowColorStep = mix( lowDensityColor, midDensityColor, smoothstep(lowRatioLimit, midRatio, density) );\n        finalColor = mix( lowColorStep, highDensityColor, smoothstep(midRatio, highRatioLimit, density) );\n\t}\n    else if (density > highRatioLimit)\n    {\n        vec3 lowDensityColor  = vec3( 1., 1., 0. );\n        vec3 highDensityColor = vec3( 1., 0., 0. );\n        \n        float ratio = smoothstep(highRatioLimit, 2., density);\n        finalColor = mix( lowDensityColor, highDensityColor, ratio );\n    }\n    else\n    {\n        vec3 lowDensityColor  = vec3( 0., 0., 1. );\n        vec3 highDensityColor = vec3( 0., 1., 1. );\n        \n        float ratio = smoothstep(0., lowRatioLimit, density);\n        finalColor = mix( lowDensityColor, highDensityColor, ratio );\n    }\n\n    return finalColor;\n}\n        "),
                  (fs = split.join("void main")));
              })());
          } catch (e) {
            ((vs = vsCode), (fs = fsCode));
          }
        return [vs, fs];
      }),
      (this.logTextures = function () {
        if (!this.active)
          return void console.log("Add optimizationProfiler in the URL!");
        let map = new Map();
        _shaders?.forEach((shader) => {
          if (!shader._gl) return;
          let sceneLayout,
            uilName = shader.mesh?.uilName;
          if (uilName) {
            let parent = shader.mesh._parent;
            for (; parent; ) {
              if (parent.classRef?.name) {
                sceneLayout = parent.classRef;
                break;
              }
              parent = parent._parent;
            }
          }
          for (let key in shader.uniforms) {
            let value = shader.uniforms?.[key]?.value;
            if (value instanceof Texture && !value.data && value.dimensions) {
              if (!map.has(value)) {
                let size = Math.max(
                  value.dimensions.width,
                  value.dimensions.height,
                );
                map.set(value, { sceneLayouts: {}, shaders: {}, size: size });
              }
              let info = map.get(value);
              (sceneLayout &&
                (info.sceneLayouts[sceneLayout.name] ||
                  (info.sceneLayouts[sceneLayout.name] = {}),
                (info.sceneLayouts[sceneLayout.name][uilName] = !0)),
                info.shaders[shader.fsName] ||
                  (info.shaders[shader.fsName] = {}),
                (info.shaders[shader.fsName][key] = !0));
            }
          }
        });
        let textures = Array.from(map.keys());
        (textures.sort((a, b) => map.get(b).size - map.get(a).size),
          textures.forEach((texture) => {
            let info = map.get(texture),
              sceneLayouts = Object.keys(info.sceneLayouts),
              shaders = Object.keys(info.shaders),
              name = texture.src;
            if (
              (!name &&
                sceneLayouts.length &&
                (name = Object.keys(info.sceneLayouts[sceneLayouts[0]])[0]),
              !name)
            ) {
              let uniforms = Object.keys(info.shaders[shaders[0]]);
              name = `${shaders[0]}/${uniforms[0]}`;
            }
            console.group(name);
            let compressed,
              bgColor = getGradientHexString(
                Math.range(info.size, 512, 1024, 0, 0.5),
                "Cubic",
              );
            ((compressed =
              "ktx2" === texture.compressed
                ? "✅ (ktx2)"
                : texture.compressed
                  ? "⚠️ (ktx1)"
                  : "❌"),
              console.log(
                `%c ${info.size}`,
                `background-color: ${bgColor}; color: #000000;`,
                `Compressed: ${compressed}`,
              ));
            for (let sceneLayout in info.sceneLayouts)
              console.log(
                `${sceneLayout}: ${Object.keys(info.sceneLayouts[sceneLayout]).join(", ")}`,
              );
            for (let shader in info.shaders)
              console.log(
                `${shader}: ${Object.keys(info.shaders[shader]).join(", ")}`,
              );
            console.groupEnd(name);
          }));
      }),
      (this.logVertices = function (sort = !1) {
        if (!_shaders || !_shaders.length) return;
        let total = 0,
          shaders = _shaders
            .filter(
              (shader) =>
                shader._gl &&
                Boolean(shader?.mesh?.geometry) &&
                !(shader?.mesh instanceof Points),
            )
            .map((shader) => ({
              shader: shader,
              count: shader.mesh.geometry.isInstanced
                ? shader.mesh.geometry.attributes.position.count *
                  shader.mesh.geometry.maxInstancedCount
                : shader.mesh.geometry.attributes.position.count,
            }));
        (sort && (shaders = shaders.sort((a, b) => b.count - a.count)),
          shaders.forEach(({ shader: shader, count: count }) => {
            ((total += count),
              console.group(shader.mesh.uilName || shader.fsName),
              shader.mesh.uilName || console.log(shader.mesh),
              console.log(
                `%c ${shader.mesh.geometry.isInstanced ? "Instanced" : ""} Vertices ${count}`,
                `background-color: ${(function bgColor(count) {
                  return getGradientHexString(
                    Math.range(count, 15e3, 3e4, 0, 0.5),
                  );
                })(count)}; color: #000000;`,
              ),
              console.groupEnd());
          }),
          console.log(
            "%c TOTAL VERTICES " + total,
            "background-color: #ff00ff; color: #000000;",
          ));
      }));
  }, "static"),
  Class(function RTPool(
    _type,
    _size = 3,
    _format,
    _multisample = !1,
    _samplesAmount = 4,
  ) {
    Inherit(this, Component);
    const _this = this;
    var _pool,
      _indexed = {};
    ((this.nullRT = Utils3D.createRT(2, 2)), (this.nullRT.setSize = () => {}));
    var _array = [],
      _resizeDisabled = !1;
    function createRT() {
      let rt = Utils3D.createRT(
        Stage.width * World.DPR,
        Stage.height * World.DPR,
        _type,
        _format,
        _multisample,
        _samplesAmount,
      );
      return ((rt.index = _pool.length()), rt);
    }
    function addListeners() {
      _resizeDisabled || _this.events.sub(Events.RESIZE, resizeHandler);
    }
    function resizeHandler() {
      _array.forEach((rt) => {
        rt.setSize(Stage.width * World.DPR, Stage.height * World.DPR);
      });
    }
    (!(function initPool() {
      _pool = new ObjectPool();
      for (let i = 0; i < _size; i++) {
        let rt = createRT();
        (_pool.put(rt), _array.push(rt));
      }
    })(),
      defer(addListeners),
      this.get("array", (_) => _array),
      (this.getRT = function (index) {
        return index
          ? (_indexed[index] || (_indexed[index] = createRT()), _indexed[index])
          : _pool.get() || createRT();
      }),
      (this.putRT = function (rt) {
        (rt.scissor && delete rt.scissor, rt !== _this.nullRT && _pool.put(rt));
      }),
      (this.setSize = function (width, height) {
        (_this.disableResize(),
          _array.forEach((rt) => {
            rt.setSize(width, height);
          }));
      }),
      (this.onDestroy = function () {
        let p = _pool.get();
        for (; p; ) (p.dispose(), (p = _pool.get()));
      }),
      (this.clone = function (
        type = _type,
        size = _size,
        format = _format,
        multisample = _multisample,
        samplesAmount = _samplesAmount,
      ) {
        return new RTPool(type, size, format, multisample, samplesAmount);
      }),
      (this.disableResize = function () {
        ((_resizeDisabled = !0),
          _this.events.unsub(Events.RESIZE, resizeHandler));
      }));
  }, "singleton"),
  Class(function PerformanceAnalyzer() {
    Inherit(this, Component);
    const _this = this;
    var _lowFrame = 0;
    function startRender() {
      _this.startRender(loop);
    }
    function loop() {
      let targetDelta = 1e3 / Render.REFRESH_RATE,
        realDelta = Render.DELTA;
      Math.abs(targetDelta - realDelta) > 2 &&
        ++_lowFrame > 2 * Render.REFRESH_RATE &&
        (_this.stopRender(loop),
        (function reportLowFPS() {
          Dev.postPerfLog({ message: "Unable to meet target framerate" });
        })());
    }
    Hydra.LOCAL &&
      (function init() {
        _this.delayedCall(startRender, 1e4);
      })();
  }, "static"),
  Class(function RenderCount() {
    const _this = this;
    var $container,
      LOG,
      _map = {},
      _display = {};
    ((this.map = _map),
      (async function () {
        (await Hydra.ready(),
          (_this.active = Utils.query("uil") || Utils.query("renderCount")),
          (LOG = _this.active && Utils.query("log")),
          Utils.query("renderCount") &&
            (async function initUIL() {
              (await Hydra.ready(),
                ($container = Stage.create("RenderCount"))
                  .css({
                    width: 175,
                    height: "auto",
                    paddingBottom: 5,
                    bottom: 0,
                    maxHeight: 400,
                    overflowY: "scroll",
                    position: "absolute",
                  })
                  .bg("#111")
                  .setZ(9999999));
            })());
      })(),
      (this.add = function (name, detail, amt = 1) {
        if (_this.active) {
          if (void 0 === _map[name] && ((_map[name] = 0), $container)) {
            let $wrapper = $container.create("wrapper");
            ($wrapper.css({ position: "relative", width: "100%", height: 20 }),
              ($wrapper.label = $wrapper.create("label")),
              $wrapper.label
                .fontStyle("Arial", 12, "#fff")
                .text(name)
                .css({ left: 10, position: "absolute" }),
              ($wrapper.value = $wrapper.create("value")),
              $wrapper.value
                .fontStyle("Arial", 12, "#fff")
                .text(0)
                .css({ right: 10, position: "absolute" }),
              (_display[name] = $wrapper));
          }
          (LOG &&
            (console.groupCollapsed(name),
            detail && console.log(detail),
            console.trace(),
            console.groupEnd()),
            (_map[name] += amt),
            _display[name]?.value?.text?.(_map[name] || "0"));
        }
      }),
      (this.remove = function (name, amt = 1) {
        _this.active &&
          _map[name] &&
          ((_map[name] -= amt),
          _display[name]?.value?.text?.(_map[name] || "0"));
      }));
  }, "static"),
  Class(function RenderMonitor() {
    Inherit(this, Component);
    const _this = this;
    let $container,
      $frameDuration,
      $buttonContainer,
      $queryStats,
      $activeToggle,
      $logButton,
      _paused = !1,
      $queries = [],
      _frameDuration = 0,
      _queries = [],
      _results = {},
      _ticker = 0,
      _prevResults = {},
      _capturingResult = !1;
    const FRAME_INTERVAL = Render.REFRESH_RATE || 60;
    function getToggleLabel() {
      return _paused ? "resume" : "pause";
    }
    function getQueryName(q) {
      return q?.obj?.mesh?.uilName
        ? q?.obj?.fsName + " - " + q?.obj?.mesh?.uilName || "fs name missing"
        : q?.obj?.fsName || "fs name missing";
    }
    function createQueryResult(q) {
      const queryEl = $queryStats.create("query-result");
      queryEl.css({
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "ceter",
      });
      let name = getQueryName(q);
      ("BlitPass" === name && (name = "BlitPass (MSAA?)"),
        (q.obj.__renderstatsname = name),
        (queryEl.name = queryEl.create("shader-name").text(name)),
        queryEl.name.css({
          position: "relative",
          color: "#ffffff",
          fontSize: "14px",
          opacity: 0.85,
        }),
        (queryEl.duration = queryEl.create("render-duration")),
        queryEl.duration.text(
          `${Math.round(q?.duration / q?.resultCount, 2).toFixed(2)} ms`,
        ),
        queryEl.duration.css({
          position: "relative",
          color: "#ffffff",
          fontSize: "14px",
          fontVariant: "tabular-nums",
        }),
        (queryEl.duration = q?.duration),
        (queryEl.queryRef = q?.obj),
        queryEl.interact(
          (e) => {
            queryEl.name.css({ opacity: "over" === e.action ? 1 : 0.85 });
          },
          (_) => logResult(name, q),
        ),
        _capturingResult && logResult(name, q),
        $queries.push(queryEl));
    }
    function captureResults() {
      if (_paused)
        for (let key in _prevResults) {
          const q = _prevResults[key];
          logResult(getQueryName(q), q);
        }
      _capturingResult = !0;
    }
    function logResult(name, q) {
      (console.group(name),
        console.log(q.obj.mesh || q.obj),
        console.log(
          `render duration: ${Math.round(q?.duration / q?.resultCount, 2)}`,
        ),
        console.groupEnd());
    }
    function updateResults(query) {
      const key = "" + (query.id + " " + query.queryObject.fsName);
      (_results.hasOwnProperty(key)
        ? ((_results[key].duration += query.timeElapsed),
          _results[key].resultCount++)
        : (_results[key] = {
            obj: query.queryObject,
            duration: query.timeElapsed,
            resultCount: 1,
          }),
        (query.queryObject.renderTimeQuery = null),
        query.destroy());
    }
    function updateStats() {
      _this.active &&
        (_paused ||
          (_ticker % FRAME_INTERVAL == 0 &&
            (function displayResults() {
              ($queries.forEach(($q) => $q.destroy()), ($queries.length = 0));
              for (let key in _results) _results[key].duration;
              const resultsAsArray = Object.entries(_results);
              (resultsAsArray.sort((a, b) => b[1].duration - a[1].duration),
                (_results = Object.fromEntries(resultsAsArray)));
              for (let key in _results)
                ((_frameDuration +=
                  _results[key].duration / _results[key].resultCount),
                  createQueryResult(_results[key]));
              ($frameDuration?.duration.text(
                `${Math.round(_frameDuration, 2).toFixed(2)} ms`,
              ),
                (_frameDuration = 0),
                (_capturingResult = !1),
                (_prevResults = Object.assign({}, _results)),
                (_results = {}),
                (_queries = []));
            })(),
          _ticker++));
    }
    (!(async function () {
      (await Hydra.ready(),
        (_this.active =
          Utils.query("renderMonitor") || Utils.query("rendermonitor")),
        _this.active &&
          (function initUIL() {
            $container = Stage.create("RenderMonitor");
            const w = Device.mobile ? 375 : 500;
            ($container
              .css({
                position: "fixed",
                width: `${w}px`,
                height: "auto",
                maxHeight: "300px",
                minHeight: "min-content",
                padding: 15,
                bottom: 0,
                left: 0,
                whiteSpace: "no-wrap",
                fontFamily: "Arial",
              })
              .bg("#111")
              .setZ(99999),
              ($buttonContainer = $container.create(
                "render-monitor-button-container",
              )),
              $buttonContainer.css({
                position: "relative",
                width: "min-content",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }),
              ($activeToggle = $buttonContainer.create(
                "render-monitor-active-toggle",
                "button",
              )),
              $activeToggle.text(getToggleLabel()),
              $activeToggle.css({
                position: "relative",
                marginBottom: "15px",
                marginRight: "5px",
                cursor: "pointer",
              }),
              ($activeToggle.div.onclick = () => {
                ((_paused = !_paused), $activeToggle.text(getToggleLabel()));
              }),
              ($logButton = $buttonContainer.create(
                "render-monitor-log",
                "button",
              )),
              $logButton.text("capture results"),
              $logButton.css({
                position: "relative",
                width: "max-content",
                marginBottom: "15px",
                whiteSpace: "no-wrap",
                cursor: "pointer",
              }),
              ($logButton.div.onclick = () => {
                captureResults();
              }),
              ($frameDuration = $container.create("frame-duration")),
              $frameDuration.css({
                position: "relative",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }),
              ($frameDuration.label = $frameDuration
                .create("frame-duration-label")
                .text("Total frame")),
              $frameDuration.label.css({
                position: "relative",
                color: "#ffffff",
                fontSize: "14px",
                paddingRight: "14px",
              }),
              ($frameDuration.duration = $frameDuration
                .create("frame-duration-label")
                .text(_frameDuration)),
              $frameDuration.duration.css({
                position: "relative",
                color: "#ffffff",
                fontSize: "14px",
              }),
              ($queryStats = $container.create("query-stats")),
              $queryStats.css({
                position: "relative",
                maxHeight: "200px",
                overflowY: "scroll",
                paddingBottom: "20px",
              }));
          })(),
        _this.active && (Render.endFrame = updateStats));
    })(),
      this.get("results", (_) => _results),
      this.get("queries", (_) => _queries),
      this.get("frameDuration", (_) => _frameDuration),
      (this.captureResults = captureResults),
      (this.createQuery = function createQuery(gl, obj) {
        return new RenderTimeQuery(gl, obj, updateResults);
      }),
      (this.updateResults = updateResults));
  }, "static"),
  Class(function RenderStats() {
    const _this = this;
    var _trace,
      _filter,
      $container,
      _map = {},
      _display = {};
    function flush() {
      for (let key in _map)
        ((_this.stats[key] = _map[key]),
          _display[key] && _display[key].value.text(_map[key] || "0"),
          (_map[key] = 0));
      _trace = null;
    }
    ((_this.stats = {}),
      (async function () {
        (await Hydra.ready(),
          (_this.active = Utils.query("renderStats")),
          Utils.query("renderStats") &&
            (async function initUIL() {
              if (
                (await Hydra.ready(),
                ($container = Stage.create("RenderStats"))
                  .css({
                    position: "fixed",
                    width: 150,
                    height: "auto",
                    paddingTop: 5,
                  })
                  .bg("#111")
                  .setZ(99999),
                Utils.query("uil"))
              ) {
                const left = RenderCount.active ? 150 : 0;
                $container.css({ bottom: 0, left: left });
              }
            })(),
          (Render.drawFrame = flush));
        let frames = 0,
          prevTime = 0,
          fps = Render.REFRESH_RATE;
        Render.start((_) => {
          ((frames += 1),
            Render.TIME >= prevTime + 1e3 &&
              ((fps = (1e3 * frames) / (Render.TIME - prevTime)),
              (fps = Math.round(fps, fps >= 1 ? 0 : 2)),
              (prevTime = Render.TIME),
              (frames = 0)),
            _this.update("FPS", fps));
        });
      })(),
      (this.update = function (name, amt = 1, detail, detail2) {
        if (Hydra.LOCAL) {
          if (_trace == name) {
            if (_filter && detail) {
              if (
                !(
                  "string" == typeof detail
                    ? detail
                    : Utils.getConstructorName(detail)
                )
                  .toLowerCase()
                  .includes(_filter.toLowerCase())
              )
                return;
            }
            (console.groupCollapsed(name),
              detail &&
                console.log(
                  "string" == typeof detail
                    ? detail
                    : Utils.getConstructorName(detail),
                ),
              detail2 && console.log(detail2),
              console.trace(),
              console.groupEnd());
          }
          if (void 0 === _map[name] && ((_map[name] = 0), $container)) {
            let $wrapper = $container.create("wrapper");
            ($wrapper.css({ position: "relative", width: "100%", height: 20 }),
              ($wrapper.label = $wrapper.create("label")),
              $wrapper.label
                .fontStyle("Arial", 12, "#fff")
                .text(name)
                .css({ left: 10, position: "absolute" }),
              ($wrapper.value = $wrapper.create("value")),
              $wrapper.value
                .fontStyle("Arial", 12, "#fff")
                .text(0)
                .css({ right: 10, position: "absolute" }),
              (_display[name] = $wrapper));
          }
          _map[name] += amt;
        }
      }),
      (this.trace = function (name, filter = null) {
        ((_trace = name), (_filter = filter));
      }),
      (this.log = function () {
        for (let key in _this.stats) console.log(key, _this.stats[key]);
        console.log("----");
      }));
  }, "static"),
  Class(function RenderTimeQuery(_gl, shader, resultavailableCB = () => {}) {
    Inherit(this, Component);
    const _this = this;
    ((_this.durationQuery = null),
      (_this.testInProgress = !1),
      (_this.resultsAvailable = !1),
      (_this.queryEnded = !0),
      (_this.timeElapsed = 0),
      (_this.prevTimeElapsed = 0),
      (_this.inactive = !1),
      (_this.inactivityAttempts = 100));
    const ext = Renderer.extensions.disjointTimerQuery;
    function endDurationQuery() {
      _this.queryEnded ||
        ((_this.queryEnded = !0), _gl.endQuery(ext.TIME_ELAPSED_EXT));
    }
    function checkQueryResults() {
      let available = _gl.getQueryParameter(
          _this.durationQuery,
          _gl.QUERY_RESULT_AVAILABLE,
        ),
        disjoint = _gl.getParameter(ext.GPU_DISJOINT_EXT);
      if (
        ((_this.prevTimeElapsed = _this.timeElapsed), available && !disjoint)
      ) {
        let elapsedTime = _gl.getQueryParameter(
          _this.durationQuery,
          _gl.QUERY_RESULT,
        );
        ((shader.renderDuration = _this.timeElapsed =
          (function timeInMS(res) {
            return Math.round(res / 1e6, 2);
          })(elapsedTime)),
          (_this.resultsAvailable = !0));
      }
      (available || disjoint) && (deleteQueries(), resultavailableCB(_this));
    }
    function deleteQueries() {
      (_gl.deleteQuery(_this.durationQuery), (_this.durationQuery = null));
    }
    (!(async function () {
      (await Hydra.ready(),
        ext
          ? ((_this.queryObject = shader),
            (_this.id = shader.mesh?.id || shader.parent?.__id),
            (shader.renderTimeQuery = _this))
          : console.error("extension not available"));
    })(),
      (this.beginTest = function beginTest() {
        if (spector) {
          const v = Object.values(RenderMonitor.results).find(
              (i) => i.obj === shader,
            ),
            name = v?.obj?.__renderstatsname;
          spector.log(`RenderMonitor:START = ${name}`);
        }
        _this.queryObject &&
          (_this.testInProgress ||
            ((_this.testInProgress = !0),
            (_this.queryEnded = !1),
            (_this.resultsAvailable = !1),
            (_this.resultsReady = Promise.create()),
            _gl.getParameter(ext.GPU_DISJOINT_EXT),
            (function initDrawDurationQuery() {
              _this.durationQuery ||
                ((_this.durationQuery = _gl.createQuery()),
                _gl.beginQuery(ext.TIME_ELAPSED_EXT, _this.durationQuery));
            })()));
      }),
      (this.endTest = function endTest(force = !1) {
        if (spector) {
          const v = Object.values(RenderMonitor.results).find(
              (i) => i.obj === shader,
            ),
            name = v?.obj?.__renderstatsname,
            duration = v?.duration / v?.resultCount;
          spector.log(`RenderMonitor:END = ${name}; duration = ${duration}ms`);
        }
        if (force)
          return (
            (_this.testInProgress = !1),
            endDurationQuery(),
            deleteQueries(),
            void _gl.getParameter(ext.GPU_DISJOINT_EXT)
          );
        _this.durationQuery &&
          _this.testInProgress &&
          (endDurationQuery(), checkQueryResults());
      }),
      (this.deleteQueries = deleteQueries));
  }),
  Class(function RenderTimer() {
    const _this = this;
    var $container,
      _display = {},
      _times = {};
    (!(async function () {
      (await Hydra.ready(),
        (_this.active = Utils.query("renderTimer")),
        _this.active &&
          (async function initUIL() {
            ($container = Stage.create("RenderTimer"))
              .css({
                position: "absolute",
                width: 150,
                height: "auto",
                paddingBottom: 5,
                bottom: 0,
                right: 0,
              })
              .bg("#111")
              .setZ(9999999);
          })());
    })(),
      (this.start = function (name) {
        _times[name] = performance.now();
      }),
      (this.stop = function (name) {
        if (!_display[name] && $container) {
          let $wrapper = $container.create("wrapper");
          ($wrapper.css({ position: "relative", width: "100%", height: 20 }),
            ($wrapper.label = $wrapper.create("label")),
            $wrapper.label
              .fontStyle("Arial", 12, "#fff")
              .text(name)
              .css({ left: 10 }),
            ($wrapper.value = $wrapper.create("value")),
            $wrapper.value
              .fontStyle("Arial", 12, "#fff")
              .text(0)
              .css({ right: 10 }),
            (_display[name] = $wrapper));
        }
        _display[name] &&
          _display[name].value.text(
            (performance.now() - _times[name]).toFixed(3) || "0",
          );
      }));
  }, "static"),
  Class(
    function FBR(_shader) {
      _shader.addUniforms({
        tMatcap: { value: null },
        tMRO: { value: null, getTexture: Utils3D.getRepeatTexture },
        tNormal: { value: null, getTexture: Utils3D.getRepeatTexture },
        uNormalStrength: { value: 1 },
        uLight: { value: new Vector4(1, 1, 1, 1) },
        uColor: { value: new Color() },
      });
    },
    (_) => {
      window.fbr = FBR;
    },
  ),
  Class(function Fluid(_simSize = 128, _dyeSize = 512, _rect = Stage) {
    Inherit(this, Component);
    const _this = this;
    var _fbos = {},
      _scenes = {},
      _tmpVec = new Vector2(),
      _lastSplat = Render.TIME;
    if ("object" == typeof _simSize && _simSize.isAppState) {
      let params = _simSize;
      ((_simSize = params.simSize || 129),
        (_dyeSize = params.dyeSize || 512),
        (_rect = params.rect || Stage));
    }
    const DYE_WIDTH = _dyeSize,
      DYE_HEIGHT = _dyeSize,
      SIM_WIDTH = _simSize,
      SIM_HEIGHT = _simSize,
      config = {
        DENSITY_DISSIPATION: 0.97,
        VELOCITY_DISSIPATION: 0.98,
        PRESSURE_DISSIPATION: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 30,
        DEBUG_MOUSE: !0,
        SPLAT_RADIUS: 0.25,
      };
    function updateParamsHz(param) {
      return 0 == (param = Math.clamp(param))
        ? 0
        : Math.exp(Math.log(param) * Render.HZ_MULTIPLIER);
    }
    function loop() {
      ((_scenes.curl.uniforms.uVelocity.value = _fbos.velocity.read),
        _scenes.curl.render(_fbos.curl.fbo),
        (_scenes.vorticity.uniforms.uVelocity.value = _fbos.velocity.read),
        (_scenes.vorticity.uniforms.uCurl.value = _fbos.curl.fbo),
        (_scenes.vorticity.uniforms.curl.value = config.CURL),
        _scenes.vorticity.render(_fbos.velocity.write),
        _fbos.velocity.swap(),
        (_scenes.divergence.uniforms.uVelocity.value = _fbos.velocity.read),
        _scenes.divergence.render(_fbos.divergence.fbo),
        (_scenes.clear.uniforms.uTexture.value = _fbos.pressure.read),
        (_scenes.clear.uniforms.value.value = updateParamsHz(
          config.PRESSURE_DISSIPATION,
        )),
        _scenes.clear.render(_fbos.pressure.write),
        _fbos.pressure.swap(),
        (_scenes.pressure.uniforms.uDivergence.value = _fbos.divergence.fbo));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++)
        ((_scenes.pressure.uniforms.uPressure.value = _fbos.pressure.read),
          _scenes.pressure.render(_fbos.pressure.write),
          _fbos.pressure.swap());
      ((_scenes.gradientSubtract.uniforms.uPressure.value =
        _fbos.pressure.read),
        (_scenes.gradientSubtract.uniforms.uVelocity.value =
          _fbos.velocity.read),
        _scenes.gradientSubtract.render(_fbos.velocity.write),
        _fbos.velocity.swap(),
        _scenes.advection.uniforms.texelSize.value.set(
          1 / SIM_WIDTH,
          1 / SIM_HEIGHT,
        ),
        (_scenes.advection.uniforms.uVelocity.value = _fbos.velocity.read),
        (_scenes.advection.uniforms.uSource.value = _fbos.velocity.read),
        (_scenes.advection.uniforms.dissipation.value = updateParamsHz(
          config.VELOCITY_DISSIPATION,
        )),
        _scenes.advection.render(_fbos.velocity.write),
        _fbos.velocity.swap(),
        _scenes.advection.uniforms.texelSize.value.set(
          1 / DYE_WIDTH,
          1 / DYE_HEIGHT,
        ),
        (_scenes.advection.uniforms.uVelocity.value = _fbos.velocity.read),
        (_scenes.advection.uniforms.uSource.value = _fbos.density.read),
        (_scenes.advection.uniforms.dissipation.value = updateParamsHz(
          config.DENSITY_DISSIPATION,
        )),
        _scenes.advection.render(_fbos.density.write),
        _fbos.density.swap(),
        (_scenes.display.uniforms.uTexture.value = _fbos.density.read),
        _scenes.display.uniforms.texelSize.value.set(
          1 / _rect.width,
          1 / _rect.height,
        ),
        _scenes.display.render(_this.rt));
    }
    ((this.rt = Utils3D.createRT(_rect.width, _rect.height)),
      (this.fbos = _fbos),
      (this.additiveBlending = !0),
      (_this.rt.disableDepth = !0),
      (function initFBOs() {
        ((_fbos.density = _this.initClass(
          FluidFBO,
          DYE_WIDTH,
          DYE_HEIGHT,
          Texture.LINEAR,
        )),
          (_fbos.velocity = _this.initClass(
            FluidFBO,
            SIM_WIDTH,
            SIM_HEIGHT,
            Texture.LINEAR,
          )),
          (_fbos.divergence = _this.initClass(
            FluidFBO,
            SIM_WIDTH,
            SIM_HEIGHT,
            Texture.NEAREST,
          )),
          (_fbos.curl = _this.initClass(
            FluidFBO,
            SIM_WIDTH,
            SIM_HEIGHT,
            Texture.NEAREST,
          )),
          (_fbos.pressure = _this.initClass(
            FluidFBO,
            SIM_WIDTH,
            SIM_HEIGHT,
            Texture.NEAREST,
          )));
      })(),
      (function initScenes() {
        ((_scenes.curl = _this.initClass(
          FluidScene,
          "fluidBase",
          "curlShader",
          {
            texelSize: { value: new Vector2(1 / SIM_WIDTH, 1 / SIM_HEIGHT) },
            uVelocity: { value: null },
            depthWrite: !1,
          },
        )),
          (_scenes.vorticity = _this.initClass(
            FluidScene,
            "fluidBase",
            "vorticityShader",
            {
              texelSize: { value: new Vector2(1 / SIM_WIDTH, 1 / SIM_HEIGHT) },
              uVelocity: { value: null },
              uCurl: { value: null },
              curl: { value: config.CURL },
              dt: { value: 1 / Render.REFRESH_RATE },
            },
          )),
          (_scenes.divergence = _this.initClass(
            FluidScene,
            "fluidBase",
            "divergenceShader",
            {
              texelSize: { value: new Vector2(1 / SIM_WIDTH, 1 / SIM_HEIGHT) },
              uVelocity: { value: null },
            },
          )),
          (_scenes.clear = _this.initClass(
            FluidScene,
            "fluidBase",
            "clearShader",
            {
              uTexture: { value: null },
              value: { value: config.PRESSURE_DISSIPATION },
            },
          )),
          (_scenes.pressure = _this.initClass(
            FluidScene,
            "fluidBase",
            "pressureShader",
            {
              texelSize: { value: new Vector2(1 / SIM_WIDTH, 1 / SIM_HEIGHT) },
              uPressure: { value: null },
              uDivergence: { value: null },
            },
          )),
          (_scenes.gradientSubtract = _this.initClass(
            FluidScene,
            "fluidBase",
            "gradientSubtractShader",
            {
              texelSize: { value: new Vector2(1 / SIM_WIDTH, 1 / SIM_HEIGHT) },
              uPressure: { value: null },
              uVelocity: { value: null },
            },
          )),
          (_scenes.advection = _this.initClass(
            FluidScene,
            "fluidBase",
            "advectionShader",
            {
              texelSize: { value: new Vector2(1 / SIM_WIDTH, 1 / SIM_HEIGHT) },
              uVelocity: { value: null },
              uSource: { value: null },
              dt: { value: 1 / Render.REFRESH_RATE },
              dissipation: { value: config.VELOCITY_DISSIPATION },
            },
          )),
          (_scenes.display = _this.initClass(
            FluidScene,
            "fluidBase",
            "displayShader",
            {
              texelSize: {
                value: new Vector2(1 / _rect.width, 1 / _rect.height),
              },
              uTexture: { value: null },
            },
          )),
          (_scenes.splat = _this.initClass(
            FluidScene,
            "fluidBase",
            "splatShader",
            {
              uTarget: { value: null },
              aspectRatio: { value: _rect.width / _rect.height },
              point: { value: new Vector2() },
              prevPoint: { value: new Vector2() },
              color: { value: new Vector3() },
              bgColor: { value: new Color("#000000") },
              radius: { value: config.SPLAT_RADIUS / 100 },
              canRender: { value: 0 },
              uAdd: { value: 1 },
            },
          )));
      })(),
      _this.startRender(loop),
      (this.updateConfig = function (key, value) {
        config[key] = value;
      }),
      (this.drawInput = function (
        x,
        y,
        dx,
        dy,
        color,
        radius = config.SPLAT_RADIUS,
        independent,
      ) {
        ((_scenes.splat.uniforms.uTarget.value = _fbos.velocity.read),
          (_scenes.splat.uniforms.radius.value = radius / 200),
          (_scenes.splat.uniforms.aspectRatio.value =
            _rect.width / _rect.height),
          _tmpVec.set(x / _rect.width, 1 - y / _rect.height));
        let now = Render.TIME,
          delta = now - _lastSplat;
        ((_lastSplat = now),
          delta > 50 || independent
            ? _scenes.splat.uniforms.prevPoint.value.copy(_tmpVec)
            : _scenes.splat.uniforms.prevPoint.value.copy(
                _scenes.splat.uniforms.point.value,
              ),
          _scenes.splat.uniforms.point.value.copy(_tmpVec),
          _scenes.splat.uniforms.color.value.set(dx, -dy, 1),
          (_scenes.splat.uniforms.uAdd.value = 1),
          _scenes.splat.render(_fbos.velocity.write),
          _fbos.velocity.swap(),
          (_scenes.splat.uniforms.uTarget.value = _fbos.density.read),
          _scenes.splat.uniforms.color.value.set(color.r, color.g, color.b),
          (_scenes.splat.uniforms.uAdd.value = _this.additiveBlending ? 1 : 0),
          _scenes.splat.render(_fbos.density.write, !0),
          _fbos.density.swap(),
          (_scenes.splat.uniforms.canRender.value = 1));
      }));
  }),
  Class(function FluidFBO(_width, _height, _filter) {
    Inherit(this, Component);
    const _this = this,
      type =
        Device.mobile || Renderer.type != Renderer.WEBGL1
          ? Texture.HALF_FLOAT
          : Texture.FLOAT;
    var _fbo1 = new RenderTarget(_width, _height, {
        minFilter: _filter,
        magFilter: _filter,
        format: Texture.RGBAFormat,
        type: type,
      }),
      _fbo2 = new RenderTarget(_width, _height, {
        minFilter: _filter,
        magFilter: _filter,
        format: Texture.RGBAFormat,
        type: type,
      });
    ((this.fbo = _fbo1),
      (this.uniform = { value: _fbo1 }),
      (_fbo1.disableDepth = !0),
      (_fbo2.disableDepth = !0),
      (_fbo1.generateMipmaps = !1),
      (_fbo2.generateMipmaps = !1),
      (this.swap = function () {
        let temp = _fbo1;
        ((_fbo1 = _fbo2), (_fbo2 = temp), (_this.uniform.value = _fbo1));
      }),
      this.get("read", (_) => _fbo1),
      this.get("write", (_) => _fbo2));
  }),
  Class(function FluidLayer(_input, _group) {
    Inherit(this, Object3D);
    var _fluid,
      _config,
      _this = this;
    (!(function initConfig() {
      ((_this.uilInput = _input),
        (_this.uilGroup = _group),
        (_config = InputUIL.create(_input.prefix + "fluid", _group)).setLabel(
          "Fluid Config",
        ),
        _config.add("dyeSize", 512),
        _config.add("simSize", 128),
        _config.add("velocity", 0.98),
        _config.add("density", 0.97),
        _config.add("pressure", 0.8),
        _config.add("iterations", 5),
        _config.add("curl", 30),
        _config.add("defaultRadius", 25),
        _config.addToggle("debugMouse", !1));
    })(),
      (function initFluid() {
        let rect = Stage,
          wildcard = _input.get("wildcard");
        if (wildcard && wildcard.includes("x")) {
          let split = wildcard.split("x");
          rect = { width: Number(split[0]), height: Number(split[1]) };
        }
        ((_fluid = _this.initClass(
          Fluid,
          _config.getNumber("simSize"),
          _config.getNumber("dyeSize"),
          rect,
        )),
          (_this.rt = _fluid.rt),
          (_this.fbos = _fluid.fbos),
          (_config.onUpdate = (key) => {
            switch (key) {
              case "velocity":
                _fluid.updateConfig(
                  "VELOCITY_DISSIPATION",
                  _config.getNumber(key),
                );
                break;
              case "density":
                _fluid.updateConfig(
                  "DENSITY_DISSIPATION",
                  _config.getNumber(key),
                );
                break;
              case "pressure":
                _fluid.updateConfig(
                  "PRESSURE_DISSIPATION",
                  _config.getNumber(key),
                );
                break;
              case "iterations":
                _fluid.updateConfig(
                  "PRESSURE_ITERATIONS",
                  _config.getNumber(key),
                );
                break;
              case "curl":
                _fluid.updateConfig("CURL", _config.getNumber(key));
                break;
              case "defaultRadius":
                _fluid.updateConfig("SPLAT_RADIUS", _config.getNumber(key));
                break;
              case "debugMouse":
                _fluid.updateConfig("DEBUG_MOUSE", _config.get(key));
            }
          }),
          [
            "velocity",
            "density",
            "pressure",
            "iterations",
            "curl",
            "defaultRadius",
            "debugMouse",
          ].forEach(_config.onUpdate));
      })(),
      (this.initMesh = function initMesh() {
        let shader = _this.initClass(Shader, "ScreenQuad", {
            tMap: { value: _fluid.rt },
          }),
          mesh = new Mesh(World.QUAD, shader);
        (_this.add(mesh), (_this.mesh = mesh));
      }),
      (this.drawInput = _fluid.drawInput),
      this.set("additiveBlending", (v) => (_fluid.additiveBlending = v)),
      (this.applyTo = function (shader) {
        ((shader.uniforms.tFluid = _this.fbos.velocity.uniform),
          (shader.uniforms.tFluidMask = { value: _this }));
      }));
  }),
  Class(function FluidScene(_vs, _fs, _uniforms) {
    Inherit(this, Component);
    const _this = this;
    var _scene = new Scene();
    (!(function () {
      _uniforms.depthWrite = !1;
      let shader = _this.initClass(Shader, _vs, _fs, _uniforms),
        mesh = new Mesh(World.QUAD, shader);
      ((shader.depthWrite = !1),
        (mesh.noMatrices = !0),
        _scene.add(mesh),
        (_this.uniforms = shader.uniforms));
    })(),
      (this.render = function (rt) {
        ((World.RENDERER.autoClear = !1),
          World.RENDERER.renderSingle(_scene.children[0], World.CAMERA, rt),
          (World.RENDERER.autoClear = !0));
      }));
  }),
  Class(function FXAA() {
    Inherit(this, NukePass);
    ((this.uniforms = { tMask: { value: null } }),
      this.init("FXAA", "FXAA"),
      (this.setMask = function (texture) {
        this.uniforms.tMask.value = texture;
      }));
  }),
  Class(function FXScroll(_params = {}) {
    Inherit(this, Object3D);
    const _this = this;
    var $element,
      _transitionShader,
      _renderManager,
      _views = [];
    function loop() {
      _renderManager.render();
      for (let i = _views.length - 1; i > -1; i--) {
        let view = _views[i];
        if (null != view.scrollNormal && view.__scrollCamera) {
          let camera = view.__scrollCamera,
            y = view.__scrollY;
          camera.group.position.y = y * view.scrollNormal;
        }
      }
      let scroll = _renderManager.controller.overallScroll;
      scroll > 0 && (_this.progress = scroll);
    }
    function findRouter() {
      let p = _this.parent;
      for (; p; ) {
        if (p.getState) return p;
        p = p.parent;
      }
    }
    function navigate(view) {
      let route = view.__scrollRoute;
      if (route) findRouter()?.navigate(route);
      else {
        let privateRoute = view.__privateRoute;
        privateRoute &&
          (findRouter()?.replaceState(""),
          AppState.set("Router/state", privateRoute));
      }
    }
    async function initRoute() {
      if (_this.flag("initializing")) return;
      if (
        (_this.flag("initializing", !0, 2e3),
        _views.length || (await _this.wait((_) => !!_views.length)),
        await defer(),
        _this._invisible)
      )
        return;
      let router = findRouter();
      if (((router.virtualRoutes = !0), !router)) return;
      let state = router.getState();
      (AppState.set("Router/state", state),
        state && state.includes("/") && (state = state.split("/")[0]),
        (async function sortAndInitialize(state) {
          let foundFirst = !1,
            sortedViews = [..._views];
          (_params.initializeSort &&
            (sortedViews.forEach((view) => {
              view.__scrollRoute == state &&
                ((view.__initIndex = 0), (foundFirst = view));
            }),
            foundFirst ||
              ((sortedViews[0].__initIndex = 0), (foundFirst = sortedViews[0])),
            sortedViews.forEach((view) => {
              if (null == view.__initIndex) {
                let myIndex = _views.indexOf(view),
                  firstIndex = sortedViews.indexOf(foundFirst);
                view.__initIndex = Math.abs(myIndex - firstIndex);
              }
            }),
            sortedViews.sort((a, b) => a.__initIndex - b.__initIndex)),
            sortedViews.forEach(async (ref, i) => {
              ref.nuke && (await Initializer3D.uploadNuke(ref.nuke));
              const group =
                ref.layout || ref.scene || ref.group || ref.element?.group;
              group &&
                (await Initializer3D.detectUploadAll(group, 0 == i),
                i == sortedViews.length - 1 &&
                  AppState.set("FXScroll/initialized", !0),
                0 == i && AppState.set("FXScroll/firstScene"));
            }));
        })(state));
      for (let i = 0; i < _views.length; i++) {
        let view = _views[i];
        if (view.__scrollRoute == state)
          return void (_renderManager.controller.scroll = view.start + 20);
      }
      navigate(_views[0]);
    }
    function resizeHandler() {
      _transitionShader.set("uRatio", Stage.width / Stage.height);
    }
    function handleViewChange({ view: view }) {
      _this.flag("initializing") ||
        AppState.get("Router/state")?.includes("work/") ||
        navigate(view);
    }
    ((this.views = _views),
      (this.progress = 0),
      (function initHTML() {
        (($element = Stage.create("FXScroll")).css({
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
        }),
          ($element._scrollParent = !0),
          (_this.element = $element));
      })(),
      (function initLogic() {
        ((_transitionShader = _this.initClass(Shader, "FXScrollTransition", {
          tNormal: {
            value: Utils3D.getRepeatTexture(
              "assets/images/pbr/damaged_road_normal.png",
            ),
          },
          tMap1: { value: null },
          tMap2: { value: null },
          uRatio: { value: Stage.width / Stage.height },
          uTransition: { value: 0 },
          uVelocity: { value: 0 },
          uAngle: { value: _params.angle || 0 },
        })),
          (_renderManager = _this.initClass(
            ScrollRenderManager,
            _this,
            _transitionShader,
            {
              container: $element,
              keyboard:
                void 0 === _params.keyboard ||
                "boolean" != typeof _params.keyboard ||
                _params.keyboard,
              smoothScroll: !0,
              pingPong: _params.pingPong || !1,
            },
          )),
          _this.events.sub(
            _renderManager.controller,
            ScrollController.VIEW_CHANGE,
            handleViewChange,
          ));
      })(),
      _this.startRender(loop),
      _this.onResize(resizeHandler),
      (this.onVisible = function () {
        initRoute();
      }),
      (this.scrollTo = function (scroll, time) {
        if (time > 0) {
          let v = { value: _renderManager.controller.scroll };
          tween(
            v,
            { value: scroll?.start ? scroll.start + 20 : scroll },
            time,
            "linear",
          ).onUpdate((_) => {
            _renderManager.controller.scroll = v.value;
          });
        } else
          _renderManager.controller.scroll = scroll?.start
            ? scroll.start + 20
            : scroll;
      }),
      this.get("renderManager", () => _renderManager),
      (this.parent.lockScroll = function () {
        _renderManager.controller.lock();
      }),
      (this.parent.unlockScroll = function () {
        _renderManager.controller.unlock();
      }),
      (this.parent._initFXScroll = async function (list) {
        for (let i = 0; i < list.length; i++) {
          let obj = list[i];
          for (let key in obj) {
            let value = obj[key];
            "$" == value.charAt?.(0) &&
              (await _this.wait(_this.parent, value.slice(1)),
              (obj[key] = _this.parent[value.slice(1)]));
          }
          let view = obj.view;
          view.__scrollElement = $("scrollElement");
          let vh = obj.vh;
          (_params.pageScalar && (vh *= _params.pageScalar),
            view.__scrollElement
              .size("100%", 105 * Number(Math.max(1, vh)) + "vh")
              .css({ position: "absolute" }),
            obj.cameraLayer &&
              view.layout?.getLayer(obj.cameraLayer).then((camera) => {
                view.__scrollCamera = camera;
              }),
            obj.route && (view.__scrollRoute = obj.route),
            obj.privateRoute && (view.__privateRoute = obj.privateRoute),
            obj.cameraMove && (view.__scrollY = Number(obj.cameraMove)),
            _views.push(view),
            $element.add(view.__scrollElement),
            (view.attachElementToScroll = (el) => view.__scrollCamera.add(el)));
        }
        (_renderManager.show(_this), initRoute());
      }));
  }),
  Class(function FXScrollUI() {
    let fxScrollRoot,
      p = this.parent;
    for (; p; )
      (p.scene instanceof Scene && (fxScrollRoot = p), (p = p.parent));
    ((fxScrollRoot.scrollContainer = this.element),
      (this.element.visible = !1));
  }),
  Class(
    function ScrollController(_object, _params) {
      Inherit(this, Component);
      const _this = this;
      var _virtualScroll, _views;
      ((this.position = 0),
        (this.last = 0),
        (this.delta = 0),
        (this.direction = 0),
        (this.index1 = 0),
        (this.index2 = 0),
        (this.progress = 0));
      var _index = 0,
        _bottomScrolled = !1,
        _timer = null,
        _virtualValue = 0,
        _totalHeight = 0;
      function debounceResize() {
        Utils.debounce(resize, 250);
      }
      function removeHandlers() {
        (_this.events.unsub(Events.RESIZE, debounceResize),
          _this.stopRender(loop),
          _this.events.unsub(Keyboard.DOWN, keydown));
      }
      function keydown(e) {
        if (_views)
          switch (e.code) {
            case "Tab":
              !(function handleTabNav() {
                if (_params.virtualScroll && !_this.smoothScroll) return;
                defer(() => {});
              })();
              break;
            case "ArrowUp":
              moveScroll(-0.25 * Stage.height);
              break;
            case "ArrowDown":
              moveScroll(0.25 * Stage.height);
          }
      }
      function moveScroll(s) {
        (_params.keyboard || _params.virtualScroll) &&
          (_params.virtualScroll
            ? (_virtualValue += Math._round(s))
            : (_this.object.div.scrollTop += Math._round(s)));
      }
      async function resize() {
        if (_views && !_this._invisible) {
          if (((_totalHeight = 0), _virtualScroll))
            _views.forEach((view) => {
              view.start = _totalHeight;
              let height = view.height;
              ((view.end = view.start + view.height), (_totalHeight += height));
            });
          else {
            (await defer(),
              _views.forEach(async (view) => {
                let layout = view.__scrollElement;
                (layout.ready && (await layout.ready()),
                  layout.css({ top: _totalHeight }),
                  (view.start = _totalHeight),
                  (layout.start = _totalHeight));
                let height = layout.div.getBoundingClientRect().height;
                ((view.height = height),
                  (layout.height = height),
                  (_totalHeight += height),
                  (view.end = view.start + view.height),
                  layout.parallax && layout.willChange("transform"));
              }));
            __body;
          }
          update();
        }
      }
      function loop() {
        _this.flag("active") &&
          (_virtualScroll
            ? ((_virtualValue += 0.7 * _virtualScroll.delta.y),
              _params.infinite ||
                (_virtualValue = Math.clamp(_virtualValue, 0, _totalHeight)),
              (_this.position = Math.lerp(
                _virtualValue,
                _this.position,
                ScrollController.LERP,
              )))
            : _this.smoothScroll
              ? (_this.position = Math.floor(
                  Math.lerp(
                    _this.object.div.scrollTop,
                    _this.position,
                    ScrollController.LERP,
                  ),
                ))
              : (_this.position = _this.object.div.scrollTop),
          (_this.delta = _this.position - _this.last),
          (_this.last = _this.position),
          (_this.direction = Math.sign(_this.delta)),
          (_this.overallScroll = Math.range(
            (_this.position + Stage.height) / _totalHeight,
            0.03,
            1,
            0,
            1,
            !0,
          )),
          update());
      }
      (!(function initParams() {
        (_params || (_params = {}),
          (_this.object = _object),
          _this.object.overflowScroll({ y: !0 }),
          (_this.smoothScroll = !1 !== _params.smoothScroll));
      })(),
        (function style() {
          _params.virtualScroll ||
            (_this.smoothScroll
              ? _this.object.css({
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  overflowY: "scroll",
                })
              : _this.object.css({ width: "100%" }));
        })(),
        _params.virtualScroll && (_virtualScroll = Scroll.createUnlimited()));
      let _sec = new Array(3);
      function update() {
        if (!_views) return;
        if (_params.infinite)
          return (function updateInfinite() {
            let offset = _views[1].start;
            if (!offset) return;
            let height = _totalHeight,
              prevActiveView = _views[_this.index1];
            (prevActiveView && (prevActiveView.active = !1),
              (_sec[0] = Math.floor(Math.mod(_this.position, height) / offset)),
              (_sec[2] = Math.floor(
                Math.mod(_this.position + Stage.height, height) / offset,
              )),
              (_this.index1 = _sec[0]),
              (_this.index2 = _sec[2]));
            let extraPadding = Stage.height / offset;
            if (
              (1 === extraPadding && (extraPadding = 0),
              (_this.progress = Math.range(
                Math.fract(_this.position / offset),
                extraPadding,
                1,
                0,
                1,
                !0,
              )),
              (_views[_this.index1].active = !0),
              parallax(_views[_this.index1]),
              parallax(_views[_this.index2]),
              _index !== _this.index1)
            ) {
              _index = _this.index1;
              let event = {};
              ((event.index = _index),
                (event.direction = _this.direction),
                (event.view = _views[_index]),
                _this.events.fire(ScrollController.VIEW_CHANGE, event));
            }
          })();
        _this.smoothScroll;
        let prevActiveView = _views[_this.index1];
        prevActiveView && (prevActiveView.active = !1);
        let height = 0;
        for (let i = 0, l = _views.length; i < l; i++) {
          let view = _views[i];
          if (
            ((height += view.height),
            (view.scrollNormal = -1),
            (view.scrollProgress = 0),
            view.scrollContainer && (view.scrollContainer.visible = !1),
            _this.position < height)
          ) {
            ((_this.index1 = i),
              (_this.index2 = i + 1),
              _this.index2 > l - 1 && (_this.index2 = l - 1));
            break;
          }
        }
        let current = Math.max(
          _this.position + Stage.height - _views[_this.index2].start,
          0,
        );
        if (
          ((_this.progress = current / Stage.height),
          (_views[_this.index1].active = !0),
          parallax(_views[_this.index1]),
          parallax(_views[_this.index2]),
          _index !== _this.index1)
        ) {
          _index = _this.index1;
          let event = {};
          ((event.index = _index),
            (event.direction = _this.direction),
            (event.view = _views[_index]),
            _this.events.fire(ScrollController.VIEW_CHANGE, event));
        }
        Math.abs(_totalHeight - Stage.height - _this.position) <
        0.2 * Stage.height
          ? _bottomScrolled ||
            ((_bottomScrolled = !0),
            (_timer = _this.delayedCall(() => {
              let event = {};
              ((event.index = _this.index2),
                (event.direction = 1),
                (event.view = _views[_this.index2]),
                _this.events.fire(ScrollController.BOTTOM, event));
            }, 850)))
          : (_timer && (clearTimeout(_timer), (_timer = null)),
            _bottomScrolled && (_bottomScrolled = !1));
      }
      function parallax(view) {
        let current = 0,
          progress = 0;
        if (_params.infinite) {
          let pos = _this.position + Stage.height - view.start;
          ((current = Math.fract(pos / _totalHeight) * _totalHeight),
            (progress = Math.clamp(
              current / (view.height + Stage.height),
              0,
              1,
            )));
        } else
          ((current = _this.position + Stage.height - view.start),
            (progress = Math.clamp(
              current / (view.height + Stage.height),
              0,
              1,
            )));
        (isNaN(progress) && (progress = 0),
          (view.scrollProgress = progress),
          (view.scrollNormal = Math.range(progress, 0, 1, 1, -1)),
          (view.scrollDirection = _this.direction),
          (view.scrollTransition = _this.progress));
        let layout = view.ui || view,
          currentScroll = _this.scroll;
        if (layout.scrollContainer && progress > 0) {
          let target = view.start - currentScroll;
          if (null != layout.scrollContainer.stickyY)
            if (null != layout.scrollContainer.releaseY) {
              let percent =
                (layout.scrollContainer.releaseY * Stage.height) / view.height;
              if (view.scrollProgress > percent) {
                let pixels = (view.scrollProgress - percent) * view.height;
                target = layout.scrollContainer.stickyY * Stage.height - pixels;
              } else
                target = Math.max(
                  layout.scrollContainer.stickyY * Stage.height,
                  target,
                );
            } else
              target = Math.max(
                layout.scrollContainer.stickyY * Stage.height,
                target,
              );
          ((layout.scrollContainer.y = Math.lerp(
            target,
            layout.scrollContainer.y,
            ScrollController.LERP,
          )),
            layout.scrollContainer.fxScrollSetup
              ? layout.scrollContainer.show()
              : ((layout.scrollContainer.fxScrollSetup = !0),
                (layout.scrollContainer.y = target)),
            layout.scrollContainer.transform &&
              layout.scrollContainer.transform());
        }
      }
      (this.get("totalHeight", () => _totalHeight),
        this.get("scroll", (_) =>
          _params.virtualScroll ? _virtualValue : _this.object.div.scrollTop,
        ),
        this.set("scroll", (s) => {
          _params.virtualScroll
            ? (_virtualValue = Math._round(s))
            : (_this.object.div.scrollTop = Math._round(s));
        }),
        (this.show = function (page) {
          (_this.smoothScroll && _params.virtualScroll,
            page,
            (_views = page.views),
            (_this.scroll = 0),
            (_this.position = 0),
            (_virtualValue = 0),
            resize(),
            (function addHandlers() {
              (_this.events.sub(Events.RESIZE, debounceResize),
                _this.startRender(loop),
                _this.events.sub(Keyboard.DOWN, keydown));
            })(),
            _this.flag("active", !0));
        }),
        (this.hide = function (page) {
          (removeHandlers(), _this.flag("active", !1));
        }),
        (this.lock = function () {
          _params.virtualScroll || _this.object.css({ overflow: "hidden" });
        }),
        (this.unlock = function () {
          _params.virtualScroll || _this.object.css({ overflowY: "scroll" });
        }),
        (this.onDestroy = function () {
          removeHandlers();
        }));
    },
    (_) => {
      ((ScrollController.VIEW_CHANGE = "smooth_view_change"),
        (ScrollController.BOTTOM = "smooth_bottom"),
        (ScrollController.TOP = "smooth_top"),
        (ScrollController.LERP =
          Device.mobile && !Utils.query("roomqr") ? 0.5 : 0.1));
    },
  ),
  Class(function ScrollRenderManager(object, transitionShader, params) {
    Inherit(this, Component);
    const _this = this;
    var _mesh,
      _controller,
      _views,
      _index1 = 0,
      _index2 = 0,
      _renderCount = 0;
    function onScrollControllerViewChange(e) {
      _this.events.fire(_this.VIEW_CHANGE, e);
    }
    function onScrollControllerBottom(e) {
      _this.events.fire(_this.BOTTOM, e);
    }
    function onScrollControllerTop(e) {
      _this.events.fire(_this.TOP, e);
    }
    ((this.VIEW_CHANGE = "ScrollControllerRenderManager_view_change"),
      (this.BOTTOM = "ScrollControllerRenderManager_bottom"),
      (this.TOP = "ScrollControllerRenderManager_top"),
      (this.initialize = function (object, transitionShader, params = {}) {
        (_this.initClass(Shader, "ScreenQuad", { tMap: { value: null } }),
          (_this.transitionShader = transitionShader),
          ((_mesh = new Mesh(
            World.QUAD,
            _this.transitionShader,
          )).frustumCulled = !1),
          object.add(_mesh),
          (_controller = _this.initClass(
            ScrollController,
            params.container,
            params,
          )),
          _this.events.sub(
            _controller,
            ScrollController.VIEW_CHANGE,
            onScrollControllerViewChange,
          ),
          _this.events.sub(
            _controller,
            ScrollController.BOTTOM,
            onScrollControllerBottom,
          ),
          _this.events.sub(
            _controller,
            ScrollController.TOP,
            onScrollControllerTop,
          ),
          (_this.controller = _controller),
          (_this.pingPong = !1 !== params.pingPong));
      }),
      (this.render = function () {
        _views &&
          (_index1 !== _controller.index1 || _index2 !== _controller.index2
            ? (_views[_index1].rt && (_views[_index1].visible = !1),
              _views[_index2].rt && (_views[_index2].visible = !1),
              (_index1 = _controller.index1),
              (_index2 = _controller.index2),
              _views[_index1].rt && (_views[_index1].visible = !0),
              _views[_index2].rt &&
                _controller.progress > 0 &&
                (_views[_index2].visible = !0))
            : (_views[_index1].visible && _views[_index2].visible) ||
              (_views[_index1].rt && (_views[_index1].visible = !0),
              _views[_index2].rt &&
                _controller.progress > 0 &&
                (_views[_index2].visible = !0)),
          _this.transitionShader.set(
            "tMap1",
            _views[_index1].rt ? _views[_index1] : null,
          ),
          _this.transitionShader.set(
            "tMap2",
            _views[_index2].rt ? _views[_index2] : null,
          ),
          _this.transitionShader.set("uTransition", _controller.progress),
          null != _controller.progress &&
            (_views[_index1].setScissor(
              0,
              0,
              1,
              1.3 * Math.range(_controller.progress, 0, 1, 1, 0),
            ),
            _views[_index2].setScissor(
              0,
              0,
              1,
              1.3 * Math.range(_controller.progress, 0, 1, 0, 1),
              !0,
            )),
          _this.pingPong
            ? ((0 === (_renderCount = Math.abs(_renderCount - 1)) ||
                _controller.progress < 0.01) &&
                _views[_index1].rt &&
                _views[_index1].draw(),
              1 === _renderCount &&
                _views[_index2].rt &&
                _controller.progress > 0 &&
                _views[_index2].draw())
            : (_views[_index1].rt && _views[_index1].draw(),
              _index1 !== _index2 &&
                _controller.progress > 0 &&
                _views[_index2].rt &&
                _views[_index2].draw()));
      }),
      (this.show = function (page) {
        (_controller.show(page),
          (_views = page.views).forEach((v) => {
            ((v.manualRender = !0),
              v.scrollContainer && v.scrollContainer.hide(),
              (v.visible = !1));
          }));
      }),
      (this.hide = function (page) {
        _controller.hide(page);
      }),
      object && this.initialize(object, transitionShader, params));
  }),
  Class(function GameCenter() {
    Inherit(this, Component);
    let _socket,
      _coords,
      _this = this,
      _id = Utils.timestamp();
    function getCoords() {
      if (!_this.useCoordinates) return ((_coords = [0, 0]), Promise.resolve());
      let promise = Promise.create();
      return (
        navigator.geolocation.getCurrentPosition(
          (data) => {
            ((_coords = [data.coords.latitude, data.coords.longitude]),
              _this.events.fire(_this.LOCATED),
              promise.resolve());
          },
          (error) => {
            _this.events.fire(_this.LOCATION_ERROR);
          },
        ),
        promise
      );
    }
    function connected() {
      (_this.events.fire(_this.CONNECTED),
        _this.events.sub(_socket, "server_data", handleServerData),
        _this.flag("connected", !0));
    }
    function handleServerData(e) {
      _this.events.fire(_this.SERVER_DATA, e);
    }
    ((this.userData = {}),
      (this.useCoordinates = !1),
      (this.ports = 1),
      (this.maxServerConnections = 900),
      (this.CONNECTED = "gamecenter_connect"),
      (this.DISCONNECTED = "gamecenter_disconnected"),
      (this.LOCATION_ERROR = "gamecenter_location_error"),
      (this.LOCATED = "gamecenter_located"),
      (this.DATA = "gamecenter_data"),
      (this.START_GAME = "gamecenter_start_game"),
      (this.END_GAME = "gamecenter_end_game"),
      (this.LOST_CONNECTION = "gamecenter_lost_connection"),
      (this.SERVER_DATA = "gamecenter_server_data"),
      (this.BROADCAST = "gamecenter_server_data"),
      (this.BLOCKED_ERROR = "gamecenter_blocked_error"),
      (this.connect = async function (server) {
        let port =
            "number" == typeof this.ports
              ? ":" + (7e3 + Math.random(0, this.ports - 1))
              : "",
          connectTime = 0;
        (await (async (_) => {
          let promise = Promise.create();
          if ((_socket && _socket.close(), !(Date.now() - connectTime < 100)))
            return (
              (connectTime = Date.now()),
              (_this.server = server),
              (_socket = new SocketConnection(server + port)),
              (_this.socket = _socket),
              _this.events.sub(_socket, SocketConnection.OPEN, (_) => {
                (promise.resolve(), connected());
              }),
              _this.events.sub(_socket, SocketConnection.BLOCKED, (_) => {
                (_this.events.fire(_this.BLOCKED_ERROR),
                  AppState.set(_this.BLOCKED_ERROR, !0),
                  (_this.BLOCKED = !0));
              }),
              _this.events.sub(_socket, SocketConnection.CLOSE, (_) => {
                _this.BLOCKED ||
                  (_this.flag("connected", !1),
                  _this.events.fire(_this.LOST_CONNECTION, {
                    reconnected: (_) => _this.wait("connected"),
                  }));
              }),
              _this.events.sub(_socket, SocketConnection.ERROR, (_) => {
                _this.BLOCKED ||
                  (_this.flag("connected", !1),
                  _this.events.fire(_this.LOST_CONNECTION, {
                    reconnected: (_) => _this.wait("connected"),
                  }));
              }),
              _this.events.sub(_socket, "broadcast", (e) => {
                (console.log("receive broadcast", e),
                  _this.events.fire(_this.BROADCAST, e));
              }),
              promise
            );
        })(),
          _this.flag("initialized", !0));
      }),
      (this.locateUser = function () {
        getCoords();
      }),
      (this.findRoom = async function (type = "any", config) {
        await _this.wait("initialized");
        let promise = Promise.create(),
          find = function () {
            _this.roundTrip(
              "findAny",
              {
                coords: _coords,
                type: type,
                forceNewRoom: config.forceNewRoom,
              },
              async (data) => {
                let room = new GameCenterRoom(data.id, _socket);
                type.includes("community") && room.communityRoom();
                try {
                  (await room.join(config), promise.resolve(room));
                } catch (e) {
                  promise.reject();
                }
              },
            );
          };
        return (_coords ? find() : getCoords().then(find), promise);
      }),
      (this.joinRoom = async function (id, config, watcher) {
        await _this.wait("initialized");
        try {
          let room = new GameCenterRoom(id, _socket);
          return (
            id.includes("community") && room.communityRoom(),
            await room.join(config, watcher),
            room
          );
        } catch (e) {
          throw "Couldn't join!";
        }
      }),
      (this.watchRoom = async function (id, watcher) {
        await _this.wait("initialized");
        try {
          let room = new GameCenterRoom(id, _socket);
          return (
            id.includes("community") && room.communityRoom(),
            await room.watch(watcher),
            room
          );
        } catch (e) {
          throw "Couldn't join!";
        }
      }),
      (this.findNearby = async function (type = "any") {
        await _this.wait("initialized");
        let promise = Promise.create();
        if (!this.useCoordinates) throw "findNearby requires user coords";
        let find = function () {
          _this.roundTrip(
            "findNearby",
            { coords: _coords, type: type },
            (data) => {
              promise.resolve(data);
            },
          );
        };
        return (_coords ? find() : getCoords().then(find), promise);
      }),
      (this.roundTrip = function (evt, data, callback) {
        let receive = (e) => {
          (_this.events.unsub(_socket, `${evt}_response`, receive),
            callback && callback(e));
        };
        (_this.events.sub(_socket, `${evt}_response`, receive),
          _socket.send(evt, data));
      }),
      (this.sendData = function (data = {}) {
        _socket && ((data.id = _id), _socket.send("server_data", data));
      }),
      (this.broadcast = function (data = {}) {
        _socket.send("broadcast", data);
      }),
      (this.locateServer = function (roomId) {
        let promise = Promise.create();
        return (
          _this.roundTrip("locate_server", { roomId: roomId }, promise.resolve),
          promise
        );
      }),
      (this.getRoomCount = async function (roomId) {
        let promise = Promise.create();
        return (
          _this.roundTrip("roomCount", { roomId: roomId }, promise.resolve),
          promise
        );
      }),
      this.get("coords", (v) => {
        _coords = v;
      }),
      this.get("coords", (_) => _coords));
  }, "static"),
  Class(function GameCenter2() {
    Inherit(this, Component);
    let _socket,
      _coords,
      _this = this,
      _id = Utils.timestamp();
    function getCoords() {
      if (!_this.useCoordinates) return ((_coords = [0, 0]), Promise.resolve());
      let promise = Promise.create();
      return (
        navigator.geolocation.getCurrentPosition(
          (data) => {
            ((_coords = [data.coords.latitude, data.coords.longitude]),
              _this.events.fire(_this.LOCATED),
              promise.resolve());
          },
          (error) => {
            _this.events.fire(_this.LOCATION_ERROR);
          },
        ),
        promise
      );
    }
    function connected() {
      (_this.events.fire(_this.CONNECTED),
        _this.events.sub(_socket, "server_data", handleServerData),
        _this.flag("connected", !0));
    }
    function handleServerData(e) {
      _this.events.fire(_this.SERVER_DATA, e);
    }
    ((this.userData = {}),
      (this.useCoordinates = !1),
      (this.ports = 1),
      (this.maxServerConnections = 900),
      (this.CONNECTED = "gamecenter2_connect"),
      (this.DISCONNECTED = "gamecenter2_disconnected"),
      (this.LOCATION_ERROR = "gamecenter2_location_error"),
      (this.LOCATED = "gamecenter2_located"),
      (this.DATA = "gamecenter2_data"),
      (this.START_GAME = "gamecenter2_start_game"),
      (this.END_GAME = "gamecenter2_end_game"),
      (this.LOST_CONNECTION = "gamecenter2_lost_connection"),
      (this.SERVER_DATA = "gamecenter2_server_data"),
      (this.BROADCAST = "gamecenter2_server_data"),
      (this.BLOCKED_ERROR = "gamecenter2_blocked_error"),
      (this.connect = async function (server) {
        let port =
            "number" == typeof this.ports
              ? ":" + (7100 + Math.random(0, this.ports - 1))
              : "",
          connectTime = 0;
        (await (async (_) => {
          let promise = Promise.create();
          if ((_socket && _socket.close(), !(Date.now() - connectTime < 100)))
            return (
              (connectTime = Date.now()),
              (_this.server = server),
              (_socket = new SocketConnection2(server + port)),
              (_this.socket = _socket),
              _this.events.sub(_socket, SocketConnection2.OPEN, (_) => {
                (promise.resolve(), connected());
              }),
              _this.events.sub(_socket, SocketConnection2.BLOCKED, (_) => {
                (_this.events.fire(_this.BLOCKED_ERROR),
                  AppState.set(_this.BLOCKED_ERROR, !0),
                  (_this.BLOCKED = !0));
              }),
              _this.events.sub(_socket, SocketConnection2.CLOSE, (_) => {
                _this.BLOCKED ||
                  (_this.flag("connected", !1),
                  _this.events.fire(_this.LOST_CONNECTION, {
                    reconnected: (_) => _this.wait("connected"),
                  }));
              }),
              _this.events.sub(_socket, SocketConnection2.ERROR, (_) => {
                _this.BLOCKED ||
                  (_this.flag("connected", !1),
                  _this.events.fire(_this.LOST_CONNECTION, {
                    reconnected: (_) => _this.wait("connected"),
                  }));
              }),
              _this.events.sub(_socket, "broadcast", (e) => {
                (console.log("receive broadcast", e),
                  _this.events.fire(_this.BROADCAST, e));
              }),
              promise
            );
        })(),
          _this.flag("initialized", !0));
      }),
      (this.locateUser = function () {
        getCoords();
      }),
      (this.findRoom = async function (type = "any", config) {
        await _this.wait("initialized");
        let promise = Promise.create(),
          find = function () {
            _this.roundTrip(
              "findAny",
              {
                coords: _coords,
                type: type,
                forceNewRoom: config.forceNewRoom,
              },
              async (data) => {
                let room = new GameCenterRoom2(data.id, _socket);
                type.includes("community") && room.communityRoom();
                try {
                  (await room.join(config), promise.resolve(room));
                } catch (e) {
                  promise.reject();
                }
              },
            );
          };
        return (_coords ? find() : getCoords().then(find), promise);
      }),
      (this.joinRoom = async function (id, config, watcher) {
        await _this.wait("initialized");
        try {
          let room = new GameCenterRoom2(id, _socket);
          return (
            id.includes("community") && room.communityRoom(),
            await room.join(config, watcher),
            room
          );
        } catch (e) {
          throw "Couldn't join!";
        }
      }),
      (this.watchRoom = async function (id, watcher) {
        await _this.wait("initialized");
        try {
          let room = new GameCenterRoom2(id, _socket);
          return (
            id.includes("community") && room.communityRoom(),
            await room.watch(watcher),
            room
          );
        } catch (e) {
          throw "Couldn't join!";
        }
      }),
      (this.findNearby = async function (type = "any") {
        await _this.wait("initialized");
        let promise = Promise.create();
        if (!this.useCoordinates) throw "findNearby requires user coords";
        let find = function () {
          _this.roundTrip(
            "findNearby",
            { coords: _coords, type: type },
            (data) => {
              promise.resolve(data);
            },
          );
        };
        return (_coords ? find() : getCoords().then(find), promise);
      }),
      (this.roundTrip = function (evt, data, callback) {
        let receive = (e) => {
          (_this.events.unsub(_socket, `${evt}_response`, receive),
            callback && callback(e));
        };
        (_this.events.sub(_socket, `${evt}_response`, receive),
          _socket.send(evt, data));
      }),
      (this.sendData = function (data = {}) {
        _socket && ((data.id = _id), _socket.send("server_data", data));
      }),
      (this.broadcast = function (data = {}) {
        _socket.send("broadcast", data);
      }),
      (this.locateServer = function (roomId) {
        let promise = Promise.create();
        return (
          _this.roundTrip("locate_server", { roomId: roomId }, promise.resolve),
          promise
        );
      }),
      (this.getRoomCount = async function (roomId) {
        let promise = Promise.create();
        return (
          _this.roundTrip("roomCount", { roomId: roomId }, promise.resolve),
          promise
        );
      }),
      this.get("coords", (v) => {
        _coords = v;
      }),
      this.get("coords", (_) => _coords));
  }, "static"),
  Class(
    function GameCenterPlayer(_id, _socket, _data, _initiator, _community) {
      Inherit(this, Component);
      var _this = this,
        _evt = { target: _this, id: _id },
        _results = [],
        _messages = {},
        _lastMessage = Render.TIME;
      function sendPing() {
        if (_results.length >= 3) return;
        let message = { _ping: !0 };
        ((message.id = Utils.timestamp()),
          (message.outTime = Date.now()),
          (message.to = _id),
          (message.from = GameCenter.GCID),
          (_messages[message.id] = message),
          _this.emit(message));
      }
      function handlePing(data) {
        if (_messages[data.id]) {
          let difference = Date.now() - data.inTime;
          (_results.unshift(difference),
            (_this.offset = difference),
            _results.length < 3
              ? sendPing()
              : (function calculate() {
                  (_this.flag("ready", !0),
                    _this.events.fire(Events.READY),
                    _results.length > 3 && (_results = _results.slice(0, 3)),
                    _results.sort((a, b) => a - b),
                    (_this.offset = _results[1]));
                })());
        } else ((data.inTime = Date.now()), _this.emit(data));
      }
      function onMessage(data) {
        if (!data.to || data.to == GameCenter.GCID) {
          if (
            ((_this.ping = Render.TIME - _lastMessage),
            (_lastMessage = Render.TIME),
            data._ping)
          )
            return handlePing(data);
          ((_evt.player = _this),
            (_evt.data = data),
            _this.events.fire(GameCenter.DATA, _evt));
        }
      }
      function ready(e) {
        _this.connection.isNull ||
          _this.parent.flag("watcher") ||
          (e.socket && _this.events.fire(GameCenterPlayer.FALLBACK_SOCKET),
          _this.delayedCall(() => {
            sendPing();
          }, 10));
      }
      ((this.connection = _this.initClass(
        _community ? GameCenterNull : GameCenterRTC,
        _id,
        _socket,
        _initiator,
        _this,
      )),
        (this.id = _id),
        (this.data = _data),
        (this.offset = 0),
        (this.ping = 0),
        (function addListeners() {
          _this.connection.isNull ||
            (_this.events.sub(_this.connection, Events.READY, ready),
            _this.events.bubble(_this.connection, Events.ERROR),
            (_this.connection.onMessage = onMessage));
        })(),
        (this.onMessage = onMessage),
        (this.emit = function (data) {
          _this.connection.emit(data.length ? data : JSON.stringify(data));
        }),
        (this.disconnect = function () {
          (_this.connection.close(),
            _this.events.fire(GameCenter.DISCONNECTED));
        }),
        (this.connected = function () {
          return _this.wait("ready");
        }),
        (this.sever = function () {
          _this.videos?.forEach((v) => v.destroy());
        }));
    },
    (_) => {
      ((GameCenterPlayer.UPDATE_DATA = "gcp_update_data"),
        (GameCenterPlayer.FALLBACK_SOCKET = "gcp_fallback_socket"));
    },
  ),
  Class(
    function GameCenterPlayer2(_id, _socket, _data, _initiator, _community) {
      Inherit(this, Component);
      var _this = this,
        _evt = { target: _this, id: _id },
        _results = [],
        _messages = {},
        _lastMessage = Render.TIME;
      function sendPing() {
        if (_results.length >= 3) return;
        let message = { _ping: !0 };
        ((message.id = Utils.timestamp()),
          (message.outTime = Date.now()),
          (message.to = _id),
          (message.from = GameCenter2.GCID),
          (_messages[message.id] = message),
          _this.emit(message));
      }
      function handlePing(data) {
        if (_messages[data.id]) {
          let difference = Date.now() - data.inTime;
          (_results.unshift(difference),
            (_this.offset = difference),
            _results.length < 3
              ? sendPing()
              : (function calculate() {
                  (_this.flag("ready", !0),
                    _this.events.fire(Events.READY),
                    _results.length > 3 && (_results = _results.slice(0, 3)),
                    _results.sort((a, b) => a - b),
                    (_this.offset = _results[1]));
                })());
        } else ((data.inTime = Date.now()), _this.emit(data));
      }
      function onMessage(data) {
        if (!data.to || data.to == GameCenter2.GCID) {
          if (
            ((_this.ping = Render.TIME - _lastMessage),
            (_lastMessage = Render.TIME),
            data._ping)
          )
            return handlePing(data);
          ((_evt.player = _this),
            (_evt.data = data),
            _this.events.fire(GameCenter2.DATA, _evt));
        }
      }
      function ready(e) {
        _this.connection.isNull ||
          _this.parent.flag("watcher") ||
          (e.socket && _this.events.fire(GameCenterPlayer2.FALLBACK_SOCKET),
          _this.delayedCall(() => {
            sendPing();
          }, 10));
      }
      ((this.connection = _this.initClass(
        _community ? GameCenterNull2 : GameCenterRTC2,
        _id,
        _socket,
        _initiator,
        _this,
      )),
        (this.id = _id),
        (this.data = _data),
        (this.offset = 0),
        (this.ping = 0),
        (function addListeners() {
          _this.connection.isNull ||
            (_this.events.sub(_this.connection, Events.READY, ready),
            _this.events.bubble(_this.connection, Events.ERROR),
            (_this.connection.onMessage = onMessage));
        })(),
        (this.onMessage = onMessage),
        (this.emit = function (data) {
          _this.connection.emit(data.length ? data : JSON.stringify(data));
        }),
        (this.disconnect = function () {
          (_this.connection.close(),
            _this.events.fire(GameCenter2.DISCONNECTED));
        }),
        (this.connected = function () {
          return _this.wait("ready");
        }),
        (this.sever = function () {
          _this.videos?.forEach((v) => v.destroy());
        }));
    },
    (_) => {
      ((GameCenterPlayer2.UPDATE_DATA = "gcp2_update_data"),
        (GameCenterPlayer2.FALLBACK_SOCKET = "gcp2_fallback_socket"));
    },
  ),
  Class(function GameCenterUser(_socket, _community) {
    Inherit(this, Component);
    ((this.connection = new (_community ? GameCenterSocket : GameCenterNull)(
      _socket,
    )),
      (this.me = !0),
      (this.data = GameCenter.userData),
      (this.id = GameCenter.GCID),
      (this.disconnect = function () {}));
  }),
  Class(function GameCenterUser2(_socket, _community) {
    Inherit(this, Component);
    ((this.connection = new (_community ? GameCenterSocket2 : GameCenterNull2)(
      _socket,
    )),
      (this.me = !0),
      (this.data = GameCenter2.userData),
      (this.id = GameCenter2.GCID),
      (this.disconnect = function () {}));
  }),
  Class(function GameCenterConnection() {
    Inherit(this, Component);
    ((this.establish = function () {}),
      (this.emit = function () {}),
      (this.wsData = function () {}));
  }),
  Class(function GameCenterConnection2() {
    Inherit(this, Component);
    ((this.establish = function () {}),
      (this.emit = function () {}),
      (this.wsData = function () {}));
  }),
  Class(function GameCenterNull() {
    const prototype = GameCenterNull.prototype;
    void 0 === prototype.establish &&
      ((prototype.isNull = !0),
      (prototype.establish = function () {}),
      (prototype.emit = function () {}),
      (prototype.wsData = function () {}),
      (prototype.close = function () {}));
  }),
  Class(function GameCenterNull2() {
    const prototype = GameCenterNull2.prototype;
    void 0 === prototype.establish &&
      ((prototype.isNull = !0),
      (prototype.establish = function () {}),
      (prototype.emit = function () {}),
      (prototype.wsData = function () {}),
      (prototype.close = function () {}));
  }),
  Class(function GameCenterRTC(_id, _socket, _initiator, _parent) {
    Inherit(this, Component);
    var _peer,
      _data,
      _fallbackSocket,
      _timeout,
      _this = this;
    function fallbackToSocket() {
      (clearTimeout(_timeout),
        _socket.send("ws_data", {
          from: GameCenter.GCID,
          fallbackToSocket: !0,
        }),
        (_fallbackSocket = !0),
        _this.events.fire(Events.READY, { socket: !0 }));
    }
    function sendNegotiation(type, sdp) {
      let data = { to: _id, type: type, sdp: sdp };
      _socket.send("establish_rtc", data);
    }
    function dataMessage(e) {
      _this.onMessage && _this.onMessage(JSON.parse(e.data));
    }
    function dataOpen(e) {
      _this.events.fire(Events.READY);
    }
    function dataClose(e) {
      (clearTimeout(_timeout), _this.events.fire(Events.ERROR, { gcID: _id }));
    }
    function dataError(e) {
      _this.events.fire(Events.ERROR, { gcID: _id });
    }
    (!(function initPeerConnection() {
      ((_peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      })),
        (_timeout = _this.delayedCall(fallbackToSocket, 7e3)),
        (_peer.onicecandidate = (e) => {
          _peer &&
            e &&
            e.candidate &&
            sendNegotiation("candidate", e.candidate);
        }),
        ((_data = _peer.createDataChannel("gamecenter", {
          ordered: !1,
          negotiated: !0,
          id: 7,
        })).onmessage = dataMessage),
        (_data.onopen = dataOpen),
        (_data.onclose = dataClose),
        (_data.onerror = dataError),
        (_peer.ondatachannel = (e) => {
          ((e.channel.onmessage = dataMessage),
            (e.channel.onclose = dataClose),
            (e.channel.onerror = dataError));
        }),
        (_peer.onconnectionstatechange = (e) => {
          switch (_peer.iceConnectionState) {
            case "connected":
              (_this.flag("connected", !0), clearTimeout(_timeout));
              break;
            case "disconnected":
              _this.flag("connected", !1);
          }
        }),
        (_peer.oniceconnectionstatechange = (e) => {
          "failed" == _peer.iceConnectionState && fallbackToSocket();
        }));
    })(),
      _initiator &&
        (async function initConnection() {
          let sdp = await _peer.createOffer();
          (_peer.setLocalDescription(sdp), sendNegotiation("offer", sdp));
        })(),
      (this.establish = function (data) {
        if (_peer)
          switch (data.type) {
            case "candidate":
              !(function processIce(iceCandidate) {
                if (!_this.flag("connected"))
                  try {
                    _peer.addIceCandidate(new RTCIceCandidate(iceCandidate));
                  } catch (e) {
                    _this.events.fire(Events.ERROR, { gcID: _id });
                  }
              })(data.sdp);
              break;
            case "offer":
              !(async function processOffer(offer) {
                if (!_this.flag("connected"))
                  try {
                    await _peer.setRemoteDescription(
                      new RTCSessionDescription(offer),
                    );
                    let sdp = await _peer.createAnswer();
                    (_peer
                      .setLocalDescription(sdp)
                      .catch((e) =>
                        _this.events.fire(Events.ERROR, { gcID: _id }),
                      ),
                      sendNegotiation("answer", sdp));
                  } catch (e) {}
              })(data.sdp);
              break;
            case "answer":
              !(async function processAnswer(answer) {
                if (!_this.flag("connected")) {
                  try {
                    await _peer.setRemoteDescription(
                      new RTCSessionDescription(answer),
                    );
                  } catch (e) {
                    _this.events.fire(Events.ERROR, { gcID: _id });
                  }
                  return !0;
                }
              })(data.sdp);
          }
      }),
      (this.emit = function (data) {
        if (
          ("string" != typeof data && (data = JSON.stringify(data)),
          _fallbackSocket)
        )
          _socket.sendBinary(data);
        else {
          if (_data && "open" != _data.readyState) return;
          try {
            _data && _data.send(data);
          } catch (e) {}
        }
      }),
      (this.wsData = function (data) {
        if (data.fallbackToSocket)
          return ((_fallbackSocket = !0), void _this.events.fire(Events.READY));
        _this.onMessage && _this.onMessage(data);
      }),
      (this.close = function () {
        _peer &&
          (_peer.close(),
          (_peer.onconnectionstatechange = null),
          (_peer.ondatachannel = null),
          (_peer.oniceconnectionstatechange = null),
          (_peer.onicecandidate = null),
          (_peer = null),
          clearTimeout(_timeout));
      }));
  }),
  Class(function GameCenterRTC2(_id, _socket, _initiator, _parent) {
    Inherit(this, Component);
    var _peer,
      _data,
      _fallbackSocket,
      _timeout,
      _this = this;
    function fallbackToSocket() {
      (clearTimeout(_timeout),
        _socket.send("ws_data", {
          from: GameCenter2.GCID,
          fallbackToSocket: !0,
        }),
        (_fallbackSocket = !0),
        _this.events.fire(Events.READY, { socket: !0 }));
    }
    function sendNegotiation(type, sdp) {
      let data = { to: _id, type: type, sdp: sdp };
      _socket.send("establish_rtc", data);
    }
    function dataMessage(e) {
      _this.onMessage && _this.onMessage(JSON.parse(e.data));
    }
    function dataOpen(e) {
      _this.events.fire(Events.READY);
    }
    function dataClose(e) {
      (clearTimeout(_timeout), _this.events.fire(Events.ERROR, { gcID: _id }));
    }
    function dataError(e) {
      _this.events.fire(Events.ERROR, { gcID: _id });
    }
    (!(function initPeerConnection() {
      ((_peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      })),
        (_timeout = _this.delayedCall(fallbackToSocket, 7e3)),
        (_peer.onicecandidate = (e) => {
          _peer &&
            e &&
            e.candidate &&
            sendNegotiation("candidate", e.candidate);
        }),
        ((_data = _peer.createDataChannel("gamecenter", {
          ordered: !1,
          negotiated: !0,
          id: 7,
        })).onmessage = dataMessage),
        (_data.onopen = dataOpen),
        (_data.onclose = dataClose),
        (_data.onerror = dataError),
        (_peer.ondatachannel = (e) => {
          ((e.channel.onmessage = dataMessage),
            (e.channel.onclose = dataClose),
            (e.channel.onerror = dataError));
        }),
        (_peer.onconnectionstatechange = (e) => {
          switch (_peer.iceConnectionState) {
            case "connected":
              (_this.flag("connected", !0), clearTimeout(_timeout));
              break;
            case "disconnected":
              _this.flag("connected", !1);
          }
        }),
        (_peer.oniceconnectionstatechange = (e) => {
          "failed" == _peer.iceConnectionState && fallbackToSocket();
        }));
    })(),
      _initiator &&
        (async function initConnection() {
          let sdp = await _peer.createOffer();
          (_peer.setLocalDescription(sdp), sendNegotiation("offer", sdp));
        })(),
      (this.establish = function (data) {
        if (_peer)
          switch (data.type) {
            case "candidate":
              !(function processIce(iceCandidate) {
                if (!_this.flag("connected"))
                  try {
                    _peer.addIceCandidate(new RTCIceCandidate(iceCandidate));
                  } catch (e) {
                    _this.events.fire(Events.ERROR, { gcID: _id });
                  }
              })(data.sdp);
              break;
            case "offer":
              !(async function processOffer(offer) {
                if (!_this.flag("connected"))
                  try {
                    await _peer.setRemoteDescription(
                      new RTCSessionDescription(offer),
                    );
                    let sdp = await _peer.createAnswer();
                    (_peer
                      .setLocalDescription(sdp)
                      .catch((e) =>
                        _this.events.fire(Events.ERROR, { gcID: _id }),
                      ),
                      sendNegotiation("answer", sdp));
                  } catch (e) {}
              })(data.sdp);
              break;
            case "answer":
              !(async function processAnswer(answer) {
                if (!_this.flag("connected")) {
                  try {
                    await _peer.setRemoteDescription(
                      new RTCSessionDescription(answer),
                    );
                  } catch (e) {
                    _this.events.fire(Events.ERROR, { gcID: _id });
                  }
                  return !0;
                }
              })(data.sdp);
          }
      }),
      (this.emit = function (data) {
        if (
          ("string" != typeof data && (data = JSON.stringify(data)),
          _fallbackSocket)
        )
          _socket.sendBinary(data);
        else {
          if (_data && "open" != _data.readyState) return;
          try {
            _data && _data.send(data);
          } catch (e) {}
        }
      }),
      (this.wsData = function (data) {
        if (data.fallbackToSocket)
          return ((_fallbackSocket = !0), void _this.events.fire(Events.READY));
        _this.onMessage && _this.onMessage(data);
      }),
      (this.close = function () {
        _peer &&
          (_peer.close(),
          (_peer.onconnectionstatechange = null),
          (_peer.ondatachannel = null),
          (_peer.oniceconnectionstatechange = null),
          (_peer.onicecandidate = null),
          (_peer = null),
          clearTimeout(_timeout));
      }));
  }),
  Class(function GameCenterSocket(_socket) {
    Inherit(this, Component);
    this.emit = function (data = {}) {
      _socket.sendBinary(data);
    };
  }),
  Class(function GameCenterSocket2(_socket) {
    Inherit(this, Component);
    this.emit = function (data = {}) {
      _socket.sendBinary(data);
    };
  }),
  Class(
    function GameCenterRoom(_id, _socket) {
      Inherit(this, Component);
      const _this = this;
      var _aliveTimer, _fallbackSocket, _roomConfig;
      ((this.id = _id),
        (this.host = !1),
        (this.players = []),
        (this.socket = _socket));
      var _waiting = {},
        _pending = [],
        _playerMap = new Map(),
        _players = _this.players;
      function handlePlayers(players) {
        let player;
        players.forEach((obj, i) => {
          (obj.id == GameCenter.GCID
            ? (player = new GameCenterUser(_socket, _this.isCommunity))
            : ((player = _playerMap.get(obj.id)),
              player ||
                ((player = createPlayer(obj.id, obj.data)),
                _playerMap.set(obj.id, player))),
            (_players[i] = player));
        });
      }
      function createPlayer(id, data, init) {
        data.data && (data = data.data);
        let player = _this.initClass(
          GameCenterPlayer,
          id,
          _socket,
          data,
          init,
          _this.isCommunity,
        );
        return (
          _this.events.sub(player, GameCenter.DATA, playerData),
          _this.events.sub(player, Events.ERROR, playerDisconnect),
          _this.events.sub(
            player,
            GameCenterPlayer.FALLBACK_SOCKET,
            fallbackSocket,
          ),
          _this.events.sub(player, Events.READY, async () => {
            (await defer(),
              _this.events.fire(GameCenterRoom.PLAYER_READY, {
                player: player,
              }));
          }),
          _waiting[id] && _waiting[id].resolve(player),
          player
        );
      }
      function fallbackSocket() {
        _fallbackSocket = !0;
      }
      function alive() {
        (_socket.send("alive"),
          Render.blurTime > 0 &&
            Date.now() - Render.blurTime >
              (_roomConfig.timeoutDisconnect || 6e6) &&
            (forceDisconnect(), _this.leave && _this.leave()));
      }
      function requestInitialState() {
        if (_this.events)
          try {
            _socket.send("request_state");
          } catch (e) {
            setTimeout(requestInitialState, 50);
          }
      }
      function addListeners() {
        (_this.events.sub(_socket, "player_disconnect", playerDisconnect),
          _this.events.sub(_socket, "become_host", becomeHost),
          _this.events.sub(_socket, "open_connection", openConnection),
          _this.events.sub(_socket, "establish_rtc", establishRTC),
          _this.events.sub(_socket, "ws_data", websocketData),
          _this.events.sub(_socket, "promote_watcher", promoteWatcher),
          _this.events.sub(_socket, "rebroadcast_players", rebroadcastPlayers),
          _this.events.sub(_socket, "start_game", startGame),
          _this.events.sub(_socket, "end_game", endGame),
          _this.events.sub(_socket, "force_disconnect", forceDisconnect),
          _this.events.sub(_socket, "update_user_data", updateUserData),
          _this.events.sub(_socket, "pin", handlePin),
          _this.events.sub(_socket, "unpin", handleUnpin),
          _this.events.sub(GameCenter.LOST_CONNECTION, closeRoom),
          _this.events.sub(_socket, SocketConnection.BINARY, communityData));
      }
      function updateUserData({ data: data }) {
        _players.forEach((player) => {
          player.id == data.gcID &&
            ((player.data = data.data),
            player.data.data && (player.data = player.data.data),
            player.events.fire(GameCenterPlayer.UPDATE_DATA, {
              player: player,
              data: player.data,
            }));
        });
      }
      function forceDisconnect(e) {
        _this.events.fire(GameCenterRoom.ERROR);
      }
      function closeRoom() {
        _this.destroy();
      }
      function startGame(e) {
        (_this.events.fire(GameCenter.START_GAME, e), (_this.playing = !0));
      }
      function endGame(e) {
        (_this.events.fire(GameCenter.END_GAME, e), (_this.playing = !1));
      }
      function establishRTC(e) {
        let found = !1;
        if (
          (_players.forEach((player) => {
            player.id == e.from &&
              ((found = !0), player.connection.establish(e));
          }),
          !found)
        ) {
          let player = createPlayer(e.from, e.data);
          (_players.push(player),
            _playerMap.set(e.gcID, player),
            player.connection.establish(e));
        }
      }
      function playerDisconnect(e) {
        let toRemove;
        (_playerMap.delete(e.gcID),
          _players.forEach((player) => {
            player.id == e.gcID &&
              (player.disconnect(),
              (toRemove = player),
              _this.events.fire(GameCenterRoom.PLAYER_DISCONNECT, {
                player: player,
              }),
              player.destroy());
          }),
          toRemove && _players.remove(toRemove));
      }
      function becomeHost(e) {
        ((_this.host = !0), _this.events.fire(GameCenterRoom.BECOME_HOST));
      }
      function rebroadcastPlayers({ data: data }) {
        data.forEach((obj) => {
          obj.id != GameCenter.GCID &&
            ((obj.gcID = obj.id), openConnection(obj));
        });
      }
      function openConnection(e) {
        if (_playerMap.has(e.gcID)) return;
        let player = createPlayer(e.gcID, e.data, !0);
        (_playerMap.set(e.gcID, player),
          _players.push(player),
          _this.events.fire(GameCenterRoom.PLAYER_JOIN, { player: player }));
      }
      function playerData(e) {
        _this.events.fire(GameCenter.DATA, e);
      }
      function websocketData(e) {
        let player = _playerMap.get(e.from);
        player && player.connection.wsData(e);
      }
      function promoteWatcher() {
        _this.flag("canPromote") &&
          (_this.join(), _this.events.fire(GameCenterRoom.PROMOTED));
      }
      function communityData({ data: data }) {
        _pending.length = 0;
        for (let i = data.length - 1; i > -1; i--) {
          let obj = data[i],
            player = _playerMap.get(obj.from);
          player &&
            !_pending.includes(obj.from) &&
            (player.onMessage(obj), _pending.push(obj.from));
        }
      }
      function handlePin(e) {
        let player;
        (_players.forEach((p) => {
          p.id == e.message.playerId && (player = p);
        }),
          _this.events.fire(GameCenterRoom.PIN, {
            message: e.message,
            player: player,
          }));
      }
      function handleUnpin(e) {
        let player;
        (_players.forEach((p) => {
          p.id == e.message.playerId && (player = p);
        }),
          _this.events.fire(GameCenterRoom.UNPIN, {
            message: e.message,
            player: player,
          }));
      }
      ((this.onDestroy = function () {
        this.leave && this.leave();
      }),
        (this.updateUserData = function (data = GameCenter.userData) {
          ((GameCenter.userData = data),
            GameCenter.GCID &&
              _socket.send("update_user_data", {
                gcID: GameCenter.GCID,
                data: data,
              }));
        }),
        (this.create = function (type, data = {}) {
          ((_this.host = !0),
            GameCenter.roundTrip(
              "create",
              {
                id: _id,
                coords: GameCenter.coords,
                type: type,
                MAX_IN_ROOM: data.maxInRoom,
                TIMEOUT_DISCONNECT: data.timeoutDisconnect,
              },
              _this.join,
            ));
        }),
        (this.join = function (data = {}) {
          if (_this.flag("joined")) return Promise.resolve();
          (_this.flag("joined", !0), _this.flag("watching", !1));
          let promise = Promise.create();
          return (
            (_roomConfig = data).timeoutDisconnect > 0 &&
              (_roomConfig.timeoutDisconnect = Math.max(
                _roomConfig.timeoutDisconnect,
                5e3,
              )),
            GameCenter.roundTrip(
              "join",
              {
                id: _id,
                user: GameCenter.userData,
                MAX_IN_ROOM: data.maxInRoom,
                TIMEOUT_DISCONNECT: data.timeoutDisconnect,
                type: data.type,
              },
              (e) => {
                if (!e.success) return promise.reject();
                (e.host && (_this.host = !0),
                  (GameCenter.GCID = e.myID),
                  handlePlayers(e.players),
                  addListeners(),
                  (_aliveTimer = setInterval(alive, 4e3)),
                  promise.resolve(),
                  setTimeout(requestInitialState, 500));
              },
            ),
            promise
          );
        }),
        (this.watch = function (canPromote) {
          let promise = Promise.create();
          return (
            _this.flag("canPromote", canPromote),
            _this.flag("watching", !0),
            GameCenter.roundTrip(
              "watch",
              { id: _id, user: GameCenter.userData },
              (e) => {
                if (!e.success) return promise.reject();
                ((GameCenter.GCID = e.myID),
                  handlePlayers(e.players),
                  addListeners(),
                  promise.resolve());
              },
            ),
            promise
          );
        }),
        (this.leave = function () {
          ((_this.leave = null),
            clearTimeout(_aliveTimer),
            _this.flag("joined", !1),
            _players.forEach((player) => player.disconnect()),
            GameCenter.roundTrip("leave", {
              id: _id,
              user: GameCenter.userData,
            }),
            _this.destroy());
        }),
        (this.broadcast = function (data) {
          if (_players.length && !_this.flag("watching")) {
            ((data.from = GameCenter.GCID),
              _fallbackSocket ||
                _this.isCommunity ||
                (data = JSON.stringify(data)));
            for (let i = 0; i < _players.length; i++)
              _players[i].connection.emit(data);
          }
        }),
        (this.start = function (data) {
          _this.host && _socket.send("start_game", data);
        }),
        (this.end = function (data) {
          _this.host && _socket.send("end_game", data);
        }),
        (this.pin = function (data, timeInSeconds = 5) {
          ((data.playerId = GameCenter.GCID),
            _socket.send("pin", {
              message: data,
              time: timeInSeconds,
              userData: GameCenter.userData,
              playerId: GameCenter.GCID,
            }));
        }),
        (this.unpin = function (data) {
          ((data.playerId = GameCenter.GCID),
            _socket.send("unpin", {
              playerId: GameCenter.GCID,
              message: data,
            }));
        }),
        (this.communityRoom = function () {
          _this.isCommunity = !0;
        }),
        (this.waitForPlayer = function (id) {
          return _playerMap.has(id)
            ? _playerMap.get(id)
            : ((_waiting[id] = Promise.create()), _waiting[id]);
        }),
        this.get("me", (_) => {
          for (let i = 0; i < _players.length; i++) {
            let player = _players[i];
            if (player.me) return player;
          }
        }),
        this.get("watcher", (_) => _this.flag("watching")));
    },
    () => {
      ((GameCenterRoom.PLAYER_DISCONNECT = "gc_room_player_dc"),
        (GameCenterRoom.BECOME_HOST = "gc_become_host"),
        (GameCenterRoom.PLAYER_JOIN = "gc_player_join"),
        (GameCenterRoom.PLAYER_READY = "gc_player_ready"),
        (GameCenterRoom.PROMOTED = "gc_player_promoted"),
        (GameCenterRoom.ERROR = "gc_room_error"),
        (GameCenterRoom.PIN = "gc_room_pin"),
        (GameCenterRoom.UNPIN = "gc_room_unpin"));
    },
  ),
  Class(
    function GameCenterRoom2(_id, _socket) {
      Inherit(this, Component);
      const _this = this;
      var _aliveTimer, _fallbackSocket, _roomConfig;
      ((this.id = _id),
        (this.host = !1),
        (this.players = []),
        (this.socket = _socket));
      var _waiting = {},
        _pending = [],
        _playerMap = new Map(),
        _players = _this.players;
      function handlePlayers(players) {
        let player;
        players.forEach((obj, i) => {
          (obj.id == GameCenter2.GCID
            ? (player = new GameCenterUser2(_socket, _this.isCommunity))
            : ((player = _playerMap.get(obj.id)),
              player ||
                ((player = createPlayer(obj.id, obj.data)),
                _playerMap.set(obj.id, player))),
            (_players[i] = player));
        });
      }
      function createPlayer(id, data, init) {
        data.data && (data = data.data);
        let player = _this.initClass(
          GameCenterPlayer2,
          id,
          _socket,
          data,
          init,
          _this.isCommunity,
        );
        return (
          _this.events.sub(player, GameCenter2.DATA, playerData),
          _this.events.sub(player, Events.ERROR, playerDisconnect),
          _this.events.sub(
            player,
            GameCenterPlayer2.FALLBACK_SOCKET,
            fallbackSocket,
          ),
          _this.events.sub(player, Events.READY, async () => {
            (await defer(),
              _this.events.fire(GameCenterRoom2.PLAYER_READY, {
                player: player,
              }));
          }),
          _waiting[id] && _waiting[id].resolve(player),
          player
        );
      }
      function fallbackSocket() {
        _fallbackSocket = !0;
      }
      function alive() {
        (_socket.send("alive"),
          Render.blurTime > 0 &&
            Date.now() - Render.blurTime >
              (_roomConfig.timeoutDisconnect || 6e6) &&
            (forceDisconnect(), _this.leave && _this.leave()));
      }
      function requestInitialState() {
        if (_this.events)
          try {
            _socket.send("request_state");
          } catch (e) {
            setTimeout(requestInitialState, 50);
          }
      }
      function addListeners() {
        (_this.events.sub(_socket, "player_disconnect", playerDisconnect),
          _this.events.sub(_socket, "become_host", becomeHost),
          _this.events.sub(_socket, "open_connection", openConnection),
          _this.events.sub(_socket, "establish_rtc", establishRTC),
          _this.events.sub(_socket, "ws_data", websocketData),
          _this.events.sub(_socket, "promote_watcher", promoteWatcher),
          _this.events.sub(_socket, "rebroadcast_players", rebroadcastPlayers),
          _this.events.sub(_socket, "start_game", startGame),
          _this.events.sub(_socket, "end_game", endGame),
          _this.events.sub(_socket, "force_disconnect", forceDisconnect),
          _this.events.sub(_socket, "update_user_data", updateUserData),
          _this.events.sub(_socket, "pin", handlePin),
          _this.events.sub(_socket, "unpin", handleUnpin),
          _this.events.sub(GameCenter2.LOST_CONNECTION, closeRoom),
          _this.events.sub(_socket, SocketConnection2.BINARY, communityData));
      }
      function updateUserData({ data: data }) {
        _players.forEach((player) => {
          player.id == data.gcID &&
            ((player.data = data.data),
            player.data.data && (player.data = player.data.data),
            player.events.fire(GameCenterPlayer2.UPDATE_DATA, {
              player: player,
              data: player.data,
            }));
        });
      }
      function forceDisconnect(e) {
        _this.events.fire(GameCenterRoom2.ERROR);
      }
      function closeRoom() {
        _this.destroy();
      }
      function startGame(e) {
        (_this.events.fire(GameCenter2.START_GAME, e), (_this.playing = !0));
      }
      function endGame(e) {
        (_this.events.fire(GameCenter2.END_GAME, e), (_this.playing = !1));
      }
      function establishRTC(e) {
        let found = !1;
        if (
          (_players.forEach((player) => {
            player.id == e.from &&
              ((found = !0), player.connection.establish(e));
          }),
          !found)
        ) {
          let player = createPlayer(e.from, e.data);
          (_players.push(player),
            _playerMap.set(e.gcID, player),
            player.connection.establish(e));
        }
      }
      function playerDisconnect(e) {
        let toRemove;
        (_playerMap.delete(e.gcID),
          _players.forEach((player) => {
            player.id == e.gcID &&
              (player.disconnect(),
              (toRemove = player),
              _this.events.fire(GameCenterRoom2.PLAYER_DISCONNECT, {
                player: player,
              }),
              player.destroy());
          }),
          toRemove && _players.remove(toRemove));
      }
      function becomeHost(e) {
        ((_this.host = !0), _this.events.fire(GameCenterRoom2.BECOME_HOST));
      }
      function rebroadcastPlayers({ data: data }) {
        data.forEach((obj) => {
          obj.id != GameCenter2.GCID &&
            ((obj.gcID = obj.id), openConnection(obj));
        });
      }
      function openConnection(e) {
        if (_playerMap.has(e.gcID)) return;
        let player = createPlayer(e.gcID, e.data, !0);
        (_playerMap.set(e.gcID, player),
          _players.push(player),
          _this.events.fire(GameCenterRoom2.PLAYER_JOIN, { player: player }));
      }
      function playerData(e) {
        _this.events.fire(GameCenter2.DATA, e);
      }
      function websocketData(e) {
        let player = _playerMap.get(e.from);
        player && player.connection.wsData(e);
      }
      function promoteWatcher() {
        _this.flag("canPromote") &&
          (_this.join(), _this.events.fire(GameCenterRoom2.PROMOTED));
      }
      function communityData({ data: data }) {
        _pending.length = 0;
        for (let i = data.length - 1; i > -1; i--) {
          let obj = data[i],
            player = _playerMap.get(obj.from);
          player &&
            !_pending.includes(obj.from) &&
            (player.onMessage(obj), _pending.push(obj.from));
        }
      }
      function handlePin(e) {
        let player;
        (_players.forEach((p) => {
          p.id == e.message.playerId && (player = p);
        }),
          _this.events.fire(GameCenterRoom2.PIN, {
            message: e.message,
            player: player,
          }));
      }
      function handleUnpin(e) {
        let player;
        (_players.forEach((p) => {
          p.id == e.message.playerId && (player = p);
        }),
          _this.events.fire(GameCenterRoom2.UNPIN, {
            message: e.message,
            player: player,
          }));
      }
      ((this.onDestroy = function () {
        this.leave && this.leave();
      }),
        (this.updateUserData = function (data = GameCenter2.userData) {
          ((GameCenter2.userData = data),
            GameCenter2.GCID &&
              _socket.send("update_user_data", {
                gcID: GameCenter2.GCID,
                data: data,
              }));
        }),
        (this.create = function (type, data = {}) {
          ((_this.host = !0),
            GameCenter2.roundTrip(
              "create",
              {
                id: _id,
                coords: GameCenter2.coords,
                type: type,
                MAX_IN_ROOM: data.maxInRoom,
                TIMEOUT_DISCONNECT: data.timeoutDisconnect,
              },
              _this.join,
            ));
        }),
        (this.join = function (data = {}) {
          if (_this.flag("joined")) return Promise.resolve();
          (_this.flag("joined", !0), _this.flag("watching", !1));
          let promise = Promise.create();
          return (
            (_roomConfig = data).timeoutDisconnect > 0 &&
              (_roomConfig.timeoutDisconnect = Math.max(
                _roomConfig.timeoutDisconnect,
                5e3,
              )),
            GameCenter2.roundTrip(
              "join",
              {
                id: _id,
                user: GameCenter2.userData,
                MAX_IN_ROOM: data.maxInRoom,
                TIMEOUT_DISCONNECT: data.timeoutDisconnect,
                type: data.type,
              },
              (e) => {
                if (!e.success) return promise.reject();
                (e.host && (_this.host = !0),
                  (GameCenter2.GCID = e.myID),
                  handlePlayers(e.players),
                  addListeners(),
                  (_aliveTimer = setInterval(alive, 4e3)),
                  promise.resolve(),
                  setTimeout(requestInitialState, 500));
              },
            ),
            promise
          );
        }),
        (this.watch = function (canPromote) {
          let promise = Promise.create();
          return (
            _this.flag("canPromote", canPromote),
            _this.flag("watching", !0),
            GameCenter2.roundTrip(
              "watch",
              { id: _id, user: GameCenter2.userData },
              (e) => {
                if (!e.success) return promise.reject();
                ((GameCenter2.GCID = e.myID),
                  handlePlayers(e.players),
                  addListeners(),
                  promise.resolve());
              },
            ),
            promise
          );
        }),
        (this.leave = function () {
          ((_this.leave = null),
            clearTimeout(_aliveTimer),
            _this.flag("joined", !1),
            _players.forEach((player) => player.disconnect()),
            GameCenter2.roundTrip("leave", {
              id: _id,
              user: GameCenter2.userData,
            }),
            _this.destroy());
        }),
        (this.broadcast = function (data) {
          if (_players.length && !_this.flag("watching")) {
            ((data.from = GameCenter2.GCID),
              _fallbackSocket ||
                _this.isCommunity ||
                (data = JSON.stringify(data)));
            for (let i = 0; i < _players.length; i++)
              _players[i].connection.emit(data);
          }
        }),
        (this.start = function (data) {
          _this.host && _socket.send("start_game", data);
        }),
        (this.end = function (data) {
          _this.host && _socket.send("end_game", data);
        }),
        (this.pin = function (data, timeInSeconds = 5) {
          ((data.playerId = GameCenter2.GCID),
            _socket.send("pin", {
              message: data,
              time: timeInSeconds,
              userData: GameCenter2.userData,
              playerId: GameCenter2.GCID,
            }));
        }),
        (this.unpin = function (data) {
          ((data.playerId = GameCenter2.GCID),
            _socket.send("unpin", {
              playerId: GameCenter2.GCID,
              message: data,
            }));
        }),
        (this.communityRoom = function () {
          _this.isCommunity = !0;
        }),
        (this.waitForPlayer = function (id) {
          return _playerMap.has(id)
            ? _playerMap.get(id)
            : ((_waiting[id] = Promise.create()), _waiting[id]);
        }),
        this.get("me", (_) => {
          for (let i = 0; i < _players.length; i++) {
            let player = _players[i];
            if (player.me) return player;
          }
        }),
        this.get("watcher", (_) => _this.flag("watching")));
    },
    () => {
      ((GameCenterRoom2.PLAYER_DISCONNECT = "gc_room2_player_dc"),
        (GameCenterRoom2.BECOME_HOST = "gc2_become_host"),
        (GameCenterRoom2.PLAYER_JOIN = "gc2_player_join"),
        (GameCenterRoom2.PLAYER_READY = "gc2_player_ready"),
        (GameCenterRoom2.PROMOTED = "gc2_player_promoted"),
        (GameCenterRoom2.ERROR = "gc2_room_error"),
        (GameCenterRoom2.PIN = "gc2_room_pin"),
        (GameCenterRoom2.UNPIN = "gc2_room_unpin"));
    },
  ),
  Module(function GenerateTube() {
    this.exports = function generate(
      numSides = 8,
      subdivisions = 50,
      openEnded = !1,
    ) {
      let geom = new CylinderGeometry(
        1,
        1,
        1,
        numSides,
        subdivisions,
        openEnded,
      );
      (geom.applyMatrix(new Matrix4().makeRotationZ(Math.PI / 2)),
        require("BufferToVertices").toVertices(geom));
      let tmpVec = new Vector2(),
        xPositions = [],
        angles = [],
        uvs = [],
        vertices = geom.vertices,
        faceVertexUvs = geom.faceVertexUvs[0],
        indices = [];
      geom.faces.forEach((face, i) => {
        let { a: a, b: b, c: c } = face,
          verts = [vertices[a], vertices[b], vertices[c]],
          faceUvs = faceVertexUvs[i];
        verts.forEach((v, j) => {
          tmpVec.set(v.y, v.z).normalize();
          let angle = Math.atan2(tmpVec.y, tmpVec.x);
          (angles.push(angle),
            xPositions.push(v.x),
            uvs.push(faceUvs[j].toArray()),
            indices.push(
              Math.abs(
                Math.round(Math.range(v.x, -0.5, 0.5, 0, subdivisions - 1)),
              ),
            ));
        });
      });
      let posArray = new Float32Array(xPositions),
        angleArray = new Float32Array(angles),
        uvArray = new Float32Array(2 * uvs.length);
      for (let i = 0; i < posArray.length; i++) {
        let [u, v] = uvs[i];
        ((uvArray[2 * i + 0] = u), (uvArray[2 * i + 1] = v));
      }
      let geometry = new Geometry();
      return (
        geometry.addAttribute(
          "position",
          new GeometryAttribute(new Float32Array(3 * posArray.length), 3),
        ),
        geometry.addAttribute("angle", new GeometryAttribute(angleArray, 1)),
        geometry.addAttribute(
          "cIndex",
          new GeometryAttribute(new Float32Array(indices), 1),
        ),
        geometry.addAttribute("tuv", new GeometryAttribute(uvArray, 2)),
        (geometry.indexLookup = indices),
        geom.destroy(),
        geometry
      );
    };
  }),
  Class(function GLA11y() {
    Inherit(this, Element);
    const _this = this;
    var $this,
      _groups = [],
      _links = [];
    function isVisible(group) {
      if (group.__glseoParent) {
        const seoHidden = !!group.__glseoParent.seoHidden,
          hidden = !!group.__glseoParent.hidden;
        return !seoHidden && !hidden;
      }
      return group.seo.enabled && group.determineVisible();
    }
    function isDeleted(group) {
      return group.__glseoParent ? group.__glseoParent.deleted : group.deleted;
    }
    function loop() {
      for (let i = _groups.length - 1; i > -1; i--) {
        let group = _groups[i];
        if (isDeleted(group))
          return ($this.removeChild(group.seo), _groups.splice(i, 1));
        isVisible(group)
          ? (group.seo &&
              group.seo.hidden &&
              ((group.seo.hidden = !1), $this.add(group.seo)),
            (seo = group.seo),
            Array.prototype.slice.call(seo.div.children).forEach((div) => {
              let seo = div.hydraObject,
                group = seo && seo.group;
              if (!seo || !group) return;
              let hidden = !group.determineVisible();
              hidden !== seo.hidden &&
                (hidden ? seo.hide() : seo.show(), (seo.hidden = hidden));
            }))
          : group.seo &&
            !group.seo.hidden &&
            ((group.seo.hidden = !0), $this.removeChild(group.seo, !0));
      }
      var seo;
      for (let i = _links.length - 1; i > -1; i--) {
        let group = _links[i];
        if (isDeleted(group))
          return ($this.removeChild(group.seo), _groups.splice(i, 1));
        isVisible(group)
          ? group.seoHidden &&
            ((group.seoHidden = !1), group.seoDOM.forEach((obj) => obj.show()))
          : group.seoHidden ||
            ((group.seoHidden = !0), group.seoDOM.forEach((obj) => obj.hide()));
      }
    }
    function aLink($object, url, label, options = {}) {
      let seo = $("link", "a");
      return (
        (seo.group = $object.group || $object),
        seo.attr("href", "#" === url ? url : Hydra.absolutePath(url)),
        seo.text(label),
        seo.accessible(),
        (seo.div.onfocus = (_) => $object._divFocus()),
        (seo.div.onblur = (_) => $object._divBlur()),
        (seo.div.onclick = (e) => {
          (e.preventDefault(), $object._divSelect());
        }),
        options.role &&
          (seo.attr("role", options.role),
          (seo.div.onkeydown = (e) => {
            switch (e.key) {
              case " ":
              case "Spacebar":
                (e.preventDefault(), e.stopPropagation(), $object._divSelect());
            }
          })),
        seo
      );
    }
    function findSeoParent($object, $suggestedParent) {
      let parent =
        $suggestedParent ||
        ($object._3d
          ? $object.anchor && $object.anchor._parent
            ? $object.anchor
            : $object.group
          : $object
        )._parent;
      if ($object.parentSeo) {
        let parentSeo = $object.parentSeo;
        parent =
          parentSeo.group && parentSeo.group.seo ? parentSeo.group : parentSeo;
      }
      for (; parent && !parent.seo; )
        if (parent.parentSeo)
          parent = parent.parentSeo.group || parent.parentSeo;
        else {
          if (parent.stageLayoutCapture?.parent?.$gluiObject)
            return findSeoParent(parent.stageLayoutCapture.parent.$gluiObject);
          parent = parent._parent;
        }
      if (parent?.seo) return parent;
    }
    function getInsertBeforeNode($object, parent, sortOrder) {
      let before = null;
      if (!isNaN(sortOrder)) {
        ((sortOrder = +sortOrder), ($object.seo.sortOrder = sortOrder));
        let divs = parent.seo.children();
        for (let i = 0; i < divs.length; ++i) {
          let div = divs[i];
          if (div.hydraObject.sortOrder > sortOrder) {
            before = div;
            break;
          }
        }
      }
      return before;
    }
    function addSortOrderProperty(
      $object,
      parent,
      initialSortOrder = $object.seo.sortOrder,
    ) {
      let sortOrder = initialSortOrder;
      Object.defineProperty($object.seo, "sortOrder", {
        get: () => sortOrder,
        set(nextSortOrder) {
          if (nextSortOrder === sortOrder) return;
          sortOrder = nextSortOrder;
          let before = getInsertBeforeNode($object, parent, sortOrder);
          parent.seo.div.insertBefore($object.seo.div, before);
        },
      });
    }
    (!(async function () {
      ((window.GLSEO = _this),
        await Hydra.ready(),
        (function initHTML() {
          (($this = _this.element).setZ(-1), Stage.add($this));
        })(),
        HydraCSS.style(".GLA11y *", { position: "relative" }));
    })(),
      (this.registerPage = function (group, name) {
        let topLevel = group;
        (!(group =
          group instanceof GLUIObject
            ? group
            : group.group || group.scene || group).determineVisible &&
          group.group &&
          (group.determineVisible = group.group.determineVisible.bind(
            group.group,
          )),
          Global.PLAYGROUND || World.ELEMENT.mouseEnabled(!1),
          (topLevel.seo = group.seo = $(name)),
          (group.seo.hidden = !0),
          (group.seo.enabled = !0));
        let remove = group.seo.remove.bind(group.seo);
        ((group.seo.remove = (_) => {
          (_groups.remove(group), remove());
        }),
          _groups.push(group),
          _this.startRender(loop, 10));
      }),
      (this.setPageH1 = function (group, title) {
        let $h1 = group.seo.h1;
        ($h1 ||
          (($h1 = group.seo.create("title", "h1")),
          (group.seo.h1 = $h1),
          defer(() => {
            let el = $h1.div;
            el.parentNode.insertBefore(el, el.parentNode.firstChild);
          })),
          $h1.text(title));
      }),
      (this.registerPersist = function (group, name) {
        let topLevel = group;
        ((group =
          group instanceof GLUIObject
            ? group
            : group.group || group.scene || group),
          Global.PLAYGROUND || World.ELEMENT.mouseEnabled(!1),
          (topLevel.seo = group.seo = $this.create(name)));
      }),
      (this.link = function ($dom, group) {
        ($dom instanceof HydraObject &&
          ((group = group.group || group.scene || group).seoDOM ||
            (group.seoDOM = []),
          group.seoDOM.push($dom),
          _links.push(group)),
          $dom instanceof GLUIObject && ($dom.seo = group.seo));
      }),
      (this.textNode = function ($text, text, sortOrder) {
        let parent = findSeoParent($text);
        if (parent)
          if ($text.seo) {
            if (
              ($text.seo.text(text),
              $text.seo.accessible(),
              !isNaN(sortOrder) && $text.seo.sortOrder !== +sortOrder)
            ) {
              let before = getInsertBeforeNode($text, parent, sortOrder);
              $text.seo.div.parentNode.insertBefore($text.seo.div, before);
            }
          } else {
            (($text.seo = $("text")),
              ($text.seo.group = $text.group),
              $text.seo.text(text),
              $text.seo.accessible());
            let before = getInsertBeforeNode($text, parent, sortOrder);
            (parent.seo.add($text.seo, before?.hydraObject),
              addSortOrderProperty($text, parent),
              ($text.seo.aLink = function (url, options) {
                let index = Array.prototype.slice
                    .call(parent.seo.div.children)
                    .indexOf($text.seo.div),
                  sortOrder = $text.seo.sortOrder;
                ($text.seo.remove(),
                  ($text.seo = aLink($text, url, text, options)),
                  parent.seo.div.insertBefore(
                    $text.seo.div,
                    parent.seo.div.children[index],
                  ),
                  addSortOrderProperty($text, parent, sortOrder));
              }),
              ($text.seo.unlink = function () {
                (parent.seo.div.removeChild($text.seo.div),
                  ($text.seo.group = null),
                  ($text.seo = null));
              }));
          }
      }),
      (this.bindToPage = function (parent, child, name) {
        ((child.__glseoParent = parent), _this.registerPage(child, name));
      }),
      (this.objectNode = function ($object, $parent) {
        let parent = findSeoParent($object, $parent);
        parent &&
          ($object.seo ||
            (($object.seo = {}),
            ($object.seo.group = $object.group || $object),
            ($object.seo.aLink = function (url, label, options) {
              (($object.seo = aLink($object, url, label, options)),
                parent.seo.div.insertBefore(
                  $object.seo.div,
                  getInsertBeforeNode($object, parent, options?.sortOrder),
                ),
                addSortOrderProperty($object, parent),
                ($object.seo.unlink = function () {
                  (parent.seo.div.removeChild($object.seo.div),
                    ($object.seo.group = null),
                    ($object.seo = null));
                }));
            })));
      }));
  }, "static"),
  Class(function GLScreenProjection(
    _camera = World.CAMERA,
    _target = new Vector2(),
  ) {
    Inherit(this, Object3D);
    var _this = this,
      _projection = new ScreenProjection(_camera),
      _m0 = new Matrix4(),
      _m1 = new Matrix4();
    function loop() {
      (_this.pos.set(_target.x, _target.y),
        _this.pos3D.copy(_projection.unproject(_this.pos)),
        _this.group.updateMatrixWorld(!0),
        _m0.copy(_camera.projectionMatrix),
        _m1.getInverse(_camera.matrixWorld),
        _this.matrix.multiplyMatrices(_m0, _m1),
        _this.uniforms.normalMatrix.value.copy(_camera.matrixWorld),
        _this.uniforms.modelMatrix.value.copy(_this.group.matrixWorld));
    }
    ((this.resolution = new Vector2()),
      (this.pos = new Vector2()),
      (this.pos3D = new Vector3()),
      (this.matrix = new Matrix4()),
      (this.uniforms = {
        projMatrix: { type: "m4", value: this.matrix },
        pos: { type: "v2", value: this.pos },
        pos3D: { type: "v3", value: this.pos3D },
        normalMatrix: { type: "m4", value: new Matrix4() },
        modelMatrix: { type: "m4", value: new Matrix4() },
      }),
      this.set("camera", (v) => {
        ((_camera = v), (_projection.camera = _camera));
      }),
      this.set("target", (v) => {
        _target = v;
      }),
      (this.update = loop),
      (this.start = function () {
        _this.startRender(loop);
      }),
      (this.stop = function () {
        _this.stopRender(loop);
      }));
  }),
  Class(
    function GLText({
      font: font,
      italic: italic = !1,
      bold: bold = !1,
      text: text,
      width: width = 1 / 0,
      align: align = "left",
      size: size = 1,
      direction: direction = "ltr",
      letterSpacing: letterSpacing = 0,
      lineHeight: lineHeight = 1,
      wordSpacing: wordSpacing = 0,
      wordBreak: wordBreak = !1,
      langBreak: langBreak = !1,
      paragraphSpacing: paragraphSpacing = 1,
      indent: indent = 0,
      color: color = new Color("#000000"),
      alpha: alpha = 1,
      shader: shader = "DefaultText",
      customCompile: customCompile = !1,
    }) {
      const _this = this;
      var _override,
        _promise = Promise.create();
      const config = GLText.FONT_CONFIG[font];
      function overrideParams() {
        if (GLText.overrideParams) {
          _override = {
            letterSpacing: letterSpacing,
            size: size,
            wordSpacing: wordSpacing,
            lineHeight: lineHeight,
          };
          let obj = GLText.overrideParams({
            letterSpacing: letterSpacing,
            size: size,
            wordSpacing: wordSpacing,
            lineHeight: lineHeight,
          });
          ((letterSpacing = obj.letterSpacing),
            (size = obj.size),
            (wordSpacing = obj.wordSpacing),
            (lineHeight = obj.lineHeight));
        }
      }
      function resetOverride() {
        _override &&
          ((letterSpacing = _override.letterSpacing),
          (size = _override.size),
          (wordSpacing = _override.wordSpacing),
          (lineHeight = _override.lineHeight));
      }
      (!(function init() {
        (overrideParams(),
          (_this.charLength = text.length),
          (_this.text = new GLTextGeometry({
            font: font,
            italic: italic,
            bold: bold,
            text: text,
            width: width,
            align: align,
            direction: direction,
            wordSpacing: wordSpacing,
            letterSpacing: letterSpacing,
            paragraphSpacing: paragraphSpacing,
            size: size,
            lineHeight: lineHeight,
            wordBreak: wordBreak,
            langBreak: langBreak,
            config: config,
            indent: indent,
          })),
          (_this.string = text),
          resetOverride(),
          _this.text.loaded.then(
            ({
              buffers: buffers,
              texture: texture,
              textureBold: textureBold,
              textureItalic: textureItalic,
              height: height,
              numLines: numLines,
            }) => {
              ((_this.texture = texture),
                bold && (_this.textureBold = textureBold),
                italic && (_this.textureItalic = textureItalic),
                (_this.shader = new Shader(shader, {
                  tMap: { value: _this.texture, ignoreUIL: !0 },
                  tMapBold: {
                    value: _this.textureBold || Utils3D.getEmptyTexture(),
                    ignoreUIL: !0,
                  },
                  tMapItalic: {
                    value: _this.textureItalic || Utils3D.getEmptyTexture(),
                    ignoreUIL: !0,
                  },
                  uColor: { value: color, ignoreUIL: !0 },
                  uAlpha: { value: alpha, ignoreUIL: !0 },
                  transparent: !0,
                  customCompile: Utils.uuid(),
                })),
                _this.onCreateShader && _this.onCreateShader(_this.shader),
                (function createGeometry(buffers) {
                  ((_this.geometry = new Geometry()),
                    _this.geometry.addAttribute(
                      "position",
                      new GeometryAttribute(buffers.position, 3),
                    ),
                    _this.geometry.addAttribute(
                      "uv",
                      new GeometryAttribute(buffers.uv, 2),
                    ),
                    _this.geometry.addAttribute(
                      "local",
                      new GeometryAttribute(buffers.local, 2),
                    ),
                    _this.geometry.addAttribute(
                      "animation",
                      new GeometryAttribute(buffers.animation, 3),
                    ),
                    _this.geometry.addAttribute(
                      "weight",
                      new GeometryAttribute(buffers.weight, 1),
                    ),
                    _this.geometry.setIndex(
                      new GeometryAttribute(buffers.index, 1),
                    ),
                    (_this.geometry.boundingBox = buffers.boundingBox),
                    (_this.geometry.boundingSphere = buffers.boundingSphere),
                    (_this.geometry.letterCount = buffers.letterCount + 1),
                    (_this.geometry.wordCount = buffers.wordCount + 1),
                    (_this.geometry.lineCount = buffers.lineCount + 1));
                })(buffers),
                (_this.mesh = new Mesh(_this.geometry, _this.shader)),
                (_this.height = height),
                _promise.resolve());
            },
          ));
      })(),
        void 0 === font && console.log(font, text),
        (this.destroy = function () {
          _this.mesh && _this.mesh.destroy && _this.mesh.destroy();
        }),
        (this.ready = this.loaded =
          function () {
            return _promise;
          }),
        (this.centerY = function () {
          ((_this.mesh.position.y = 0.5 * _this.height),
            (_this.needsCenterY = !0));
        }),
        (this.bottomY = function () {
          ((_this.mesh.position.y = _this.height), (_this.needsBottomY = !0));
        }),
        (this.resize = function (options) {
          return this.setText(text, options);
        }),
        (this.tweenColor = function (c, time = 300, ease = "easeOutCubic") {
          c && color.tween(c, time, ease);
        }),
        (this.setColor = function (c) {
          c && color.set(c);
        }),
        (this.setText = function (txt, options) {
          if (
            (text != txt ||
              !(function match(options) {
                return (
                  !options ||
                  (options.font == font &&
                    options.italic == italic &&
                    options.bold == bold &&
                    options.width == width &&
                    options.align == align &&
                    options.direction == direction &&
                    !(
                      options.wordSpacing > 0 &&
                      options.wordSpacing != wordSpacing
                    ) &&
                    options.letterSpacing == letterSpacing &&
                    options.paragraphSpacing == paragraphSpacing &&
                    options.size == size &&
                    options.indent == indent &&
                    options.lineHeight == lineHeight &&
                    !(
                      (!0 === options.wordBreak && !options.wordBreak) ||
                      (0 == options.wordBreak && options.wordBreak)
                    ))
                );
              })(options)) &&
            (text = txt)
          )
            return (
              (function setVars(options) {
                ((font = options.font || font),
                  (bold = options.bold || bold),
                  (italic = options.italic || italic),
                  (width = options.width || width),
                  (align = options.align || align),
                  (wordSpacing = options.wordSpacing || wordSpacing),
                  (letterSpacing = options.letterSpacing || letterSpacing),
                  (paragraphSpacing =
                    options.paragraphSpacing || paragraphSpacing),
                  (size = options.size || size),
                  (lineHeight = options.lineHeight || lineHeight),
                  (wordBreak = options.wordBreak || wordBreak),
                  (langBreak = options.langBreak || langBreak),
                  (direction = options.direction || direction),
                  (indent = options.indent || indent));
              })(options || {}),
              overrideParams(),
              (_this.string = text),
              (_this.charLength = text.length),
              (_this.text = new GLTextGeometry({
                font: font,
                italic: italic,
                bold: bold,
                text: text,
                width: width,
                align: align,
                direction: direction,
                wordSpacing: wordSpacing,
                letterSpacing: letterSpacing,
                paragraphSpacing: paragraphSpacing,
                size: size,
                lineHeight: lineHeight,
                wordBreak: wordBreak,
                langBreak: langBreak,
                config: config,
                indent: indent,
              })),
              resetOverride(),
              (_promise = Promise.create()),
              _this.text.loaded.then(({ buffers: buffers, height: height }) => {
                (!(function updateGeometry(buffers) {
                  (_this.geometry.attributes.position.setArray(
                    buffers.position,
                  ),
                    _this.geometry.attributes.uv.setArray(buffers.uv),
                    _this.geometry.attributes.animation.setArray(
                      buffers.animation,
                    ),
                    _this.geometry.attributes.weight.setArray(buffers.weight),
                    (_this.geometry.index = buffers.index),
                    (_this.geometry.indexNeedsUpdate = !0),
                    (_this.geometry.boundingBox = buffers.boundingBox),
                    (_this.geometry.boundingSphere = buffers.boundingSphere),
                    (_this.geometry.letterCount = buffers.letterCount + 1),
                    (_this.geometry.wordCount = buffers.wordCount + 1),
                    (_this.geometry.lineCount = buffers.lineCount + 1));
                })(buffers),
                  (_this.height = height),
                  _this.needsCenterY && _this.centerY(),
                  _this.needsBottomY && _this.bottomY(),
                  _promise.resolve());
              }),
              _promise
            );
        }),
        (this.getData = function () {
          return {
            font: font,
            italic: italic,
            bold: bold,
            text: text,
            width: width,
            align: align,
            direction: direction,
            wordSpacing: wordSpacing,
            letterSpacing: letterSpacing,
            paragraphSpacing: paragraphSpacing,
            size: size,
            lineHeight: lineHeight,
            wordBreak: wordBreak,
            langBreak: langBreak,
            color: color,
            indent: indent,
          };
        }));
    },
    (_) => {
      GLText.FONT_CONFIG = {};
    },
  ),
  Class(
    function GLTextGeometry({
      font: font,
      italic: italic,
      bold: bold,
      text: text,
      width: width = 1 / 0,
      align: align = "left",
      size: size = 1,
      direction: direction = "ltr",
      letterSpacing: letterSpacing = 0,
      paragraphSpacing: paragraphSpacing = 1,
      indent: indent = 0,
      lineHeight: lineHeight = 1.4,
      wordSpacing: wordSpacing = 0,
      wordBreak: wordBreak = !1,
      langBreak: langBreak = !1,
      config: config = {},
    }) {
      let json,
        texture,
        glyphs,
        bJson,
        bTexture,
        bGlyphs,
        iJson,
        iTexture,
        iGlyphs,
        _this = this;
      ((_this.loaded = Promise.create()),
        (_this.fontLoaded = Promise.create()),
        (async function init() {
          (await (async function loadFont() {
            (([json, texture, glyphs] = await GLTextGeometry.loadFont(font)),
              bold &&
                ([bJson, bTexture, bGlyphs] =
                  await GLTextGeometry.loadFont(bold)));
            italic &&
              ([iJson, iTexture, iGlyphs] =
                await GLTextGeometry.loadFont(italic));
            _this.fontLoaded.resolve();
          })(),
            (async function createGeometry() {
              let buffers = await GLTextThread.generate({
                font: font,
                bold: bold,
                italic: italic,
                text: text,
                width: width,
                align: align,
                size: size,
                direction: direction,
                letterSpacing: letterSpacing,
                paragraphSpacing: paragraphSpacing,
                indent: indent,
                lineHeight: lineHeight,
                wordSpacing: wordSpacing,
                wordBreak: wordBreak,
                langBreak: langBreak,
                json: json,
                glyphs: glyphs,
                bJson: bJson,
                bGlyphs: bGlyphs,
                iJson: iJson,
                iGlyphs: iGlyphs,
                config: config,
              });
              ((_this.buffers = buffers),
                (_this.texture = texture),
                (_this.textureBold = bTexture),
                (_this.textureItalic = iTexture),
                (_this.numLines = buffers.lineLength),
                (_this.height = _this.numLines * size * lineHeight),
                _this.onLayout &&
                  _this.onLayout(
                    buffers,
                    texture,
                    _this.height,
                    _this.numLines,
                  ),
                _this.loaded.resolve({
                  buffers: buffers,
                  texture: texture,
                  textureBold: bTexture,
                  textureItalic: iTexture,
                  height: _this.height,
                  numLines: _this.numLines,
                }));
            })());
        })());
    },
    (_) => {
      async function loadJSON(font) {
        return await get(
          (function getPathTo(font, ext) {
            let fontName = GLTextGeometry.fontMapping[font] || font,
              suffix = ext ? `.${ext}` : "";
            return Assets.getPath(`${getFontPath(font)}${fontName}${suffix}`);
          })(font, "json"),
        );
      }
      async function loadTexture(font) {
        let fontName = GLTextGeometry.fontMapping[font] || font;
        let base = `${getFontPath(font)}${fontName}`,
          path =
            [`${base}.ktx2`, Assets.supportsWebP() && `${base}.webp`]
              .filter(Boolean)
              .find((candidate) =>
                (window.ASSETS?.SW || []).includes(candidate),
              ) || `${base}.png`,
          texture = await Utils3D.getTexture(path);
        return (
          (texture.generateMipmaps = !1),
          (texture.minFilter = Texture.LINEAR),
          texture
        );
      }
      function getFontPath(font) {
        return GLTextGeometry.fontMapping[font] && GLTextGeometry.fontPath
          ? GLTextGeometry.fontPath
          : "assets/fonts/";
      }
      let _promises = {};
      ((GLTextGeometry.fontMapping = {}),
        (GLTextGeometry.chars = {}),
        (GLTextGeometry.loadFont = function (font) {
          if (!_promises[font]) {
            let promise = Promise.create();
            ((_promises[font] = promise),
              (async function () {
                let [json, texture] = await Promise.all([
                    loadJSON(font),
                    loadTexture(font),
                  ]),
                  glyphs = {};
                (json.chars.forEach((d) => (glyphs[d.char] = d)),
                  promise.resolve([json, texture, glyphs]),
                  (GLTextGeometry.chars[font] = json.chars));
              })());
          }
          return _promises[font];
        }));
    },
  ),
  Class(function GLTextThread() {
    function loadTextGeometry(
      {
        font: font,
        bold: bold,
        italic: italic,
        text: text,
        width: width,
        align: align,
        size: size,
        direction: direction,
        letterSpacing: letterSpacing,
        paragraphSpacing: paragraphSpacing,
        lineHeight: lineHeight,
        wordSpacing: wordSpacing,
        wordBreak: wordBreak,
        langBreak: langBreak,
        json: json,
        glyphs: glyphs,
        bJson: bJson,
        bGlyphs: bGlyphs,
        iJson: iJson,
        iGlyphs: iGlyphs,
        indent: indent,
        config: config,
      },
      pid,
    ) {
      const newline = /\n/,
        whitespace = /[^\S ]/,
        langbreak = !!langBreak && new RegExp(langBreak),
        dir = "rtl" === direction ? -1 : 1;
      (config || (config = {}),
        (config.boldBaseOffset = config.boldBaseOffset
          ? config.boldBaseOffset
          : 0),
        (config.italicBaseOffset = config.italicBaseOffset
          ? config.italicBaseOffset
          : 0));
      let buffers,
        scale = size / json.common.base,
        weights = [],
        weight = { 0: glyphs, 1: bGlyphs, 2: iGlyphs };
      function getKernPairOffset(id1, id2) {
        for (let i = 0; i < json.kernings.length; i++) {
          let k = json.kernings[i];
          if (!(k.first < id1) && !(k.second < id2))
            return k.first > id1 || (k.first === id1 && k.second > id2)
              ? 0
              : k.amount;
        }
        return 0;
      }
      (!(function setWeights() {
        let i = 0,
          w = 0;
        for (; i < text.length; ) {
          let code = text.substring(i, i + 3).toLowerCase(),
            endcode = text.substring(i, i + 4).toLowerCase();
          (("<b>" !== code && "<i>" !== code) ||
            ((w = "<b>" === code ? 1 : 2),
            (text = text.substring(0, i) + text.substring(i + 3))),
            ("</b>" !== endcode && "</i>" !== endcode) ||
              ((w = 0), (text = text.substring(0, i) + text.substring(i + 4))),
            weights.push(w),
            i++);
        }
      })(),
        (function createGeometry() {
          let numChars = text.replace(/[ \n]/g, "").length;
          buffers = {
            position: new Float32Array(4 * numChars * 3),
            uv: new Float32Array(4 * numChars * 2),
            local: new Float32Array(4 * numChars * 2),
            animation: new Float32Array(3 * numChars * 4),
            index: new Uint16Array(6 * numChars),
            weight: new Float32Array(4 * numChars),
          };
          for (let i = 0; i < numChars; i++)
            buffers.index.set(
              [4 * i, 4 * i + 2, 4 * i + 1, 4 * i + 1, 4 * i + 2, 4 * i + 3],
              6 * i,
            );
          !(function layout() {
            const lines = [];
            let cursor = 0,
              wordCursor = 0,
              wordWidth = 0,
              line = newLine();
            function newLine(br = !1) {
              const line = { width: 0, glyphs: [] };
              return (
                lines.last() && (lines.last().br = br),
                lines.push(line),
                (wordCursor = cursor),
                (wordWidth = 0),
                line
              );
            }
            for (; cursor < text.length; ) {
              let prev = text[cursor - 1],
                char = text[cursor];
              if (
                !line.glyphs.length &&
                whitespace.test(char) &&
                !(prev && newline.test(char) && newline.test(prev))
              ) {
                (cursor++, (wordCursor = cursor), (wordWidth = 0));
                continue;
              }
              if (newline.test(char)) {
                (cursor++, (line = newLine(!0)));
                continue;
              }
              !cursor && indent && (line.width += indent);
              let style = weight[weights[cursor]] || weight[0],
                glyph = style[char];
              if (
                (glyph ||
                  (console.warn(`font ${font} missing character '${char}'`),
                  (char = Object.keys(style)[0]),
                  (glyph = style[char])),
                (glyph.weight = weights[cursor]),
                line.glyphs.length)
              ) {
                const prevGlyph = line.glyphs[line.glyphs.length - 1][0];
                let kern = getKernPairOffset(glyph.id, prevGlyph.id) * scale;
                ((line.width += kern), (wordWidth += kern * dir));
              }
              let gl = { ...glyph };
              ((gl.weight = weights[cursor]),
                line.glyphs.push([gl, line.width]));
              let advance = 0;
              if (
                (whitespace.test(char)
                  ? ((gl.whitespace = !0),
                    (wordCursor = cursor),
                    (wordWidth = 0),
                    (advance += wordSpacing * size))
                  : (advance += letterSpacing * size),
                (advance += glyph.xadvance * scale),
                (line.width += advance),
                (wordWidth += advance),
                line.width > width)
              ) {
                if (
                  (wordBreak || (char && langBreak && !langbreak.test(char))) &&
                  line.glyphs.length > 1
                ) {
                  ((line.width -= advance),
                    line.glyphs.pop(),
                    (line = newLine()));
                  continue;
                }
                if (!wordBreak && wordWidth !== line.width) {
                  let numGlyphs = cursor - wordCursor + 1;
                  (line.glyphs.splice(-numGlyphs, numGlyphs),
                    (cursor = wordCursor),
                    (line.width -= wordWidth),
                    (line = newLine()));
                  continue;
                }
              }
              cursor++;
            }
            line.glyphs.length || lines.pop();
            if ("justify" === align) {
              let max = -1 / 0;
              (lines.forEach((l) => {
                ((l.whitespaces = 0),
                  max < l.width && (max = l.width),
                  l.glyphs.forEach((g) => {
                    g[0].whitespace && l.whitespaces++;
                  }));
              }),
                lines.forEach((l) => {
                  let totalToAdd = max - l.width,
                    addToWhitespace =
                      0 === l.whitespaces ? 0 : totalToAdd / l.whitespaces;
                  l.width = max;
                  let additionalOffset = 0;
                  l.glyphs.forEach((g) => {
                    ((g[1] += additionalOffset),
                      g[0].whitespace && (additionalOffset += addToWhitespace));
                  });
                }));
            }
            !(function populateBuffers(lines) {
              const texW = json.common.scaleW,
                texH = json.common.scaleH;
              let geom,
                y = (config.baseOffset ? config.baseOffset : 0.07) * size,
                j = 0,
                glyphIndex = 0,
                wordIndex = -1,
                lineId = -1;
              for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                let line = lines[lineIndex];
                (wordIndex++, lineId++);
                for (let i = 0; i < line.glyphs.length; i++) {
                  const glyph = line.glyphs[i][0];
                  let x = line.glyphs[i][1];
                  if (
                    (-1 === dir && (x = line.width - x),
                    "center" === align || "justify" === align
                      ? (x -= 0.5 * line.width)
                      : "right" === align && (x -= line.width * dir),
                    whitespace.test(glyph.char))
                  ) {
                    wordIndex++;
                    continue;
                  }
                  (1 === glyph.weight && (y += config.boldBaseOffset * scale),
                    2 === glyph.weight &&
                      (y += config.italicBaseOffset * scale),
                    (x += glyph.xoffset * scale * dir),
                    (y -= glyph.yoffset * scale),
                    buffers.weight.set(
                      [glyph.weight, glyph.weight, glyph.weight, glyph.weight],
                      4 * glyphIndex,
                    ));
                  let w = glyph.width * scale,
                    h = glyph.height * scale;
                  (-1 === dir
                    ? buffers.position.set(
                        [x - w, y - h, 0, x - w, y, 0, x, y - h, 0, x, y, 0],
                        4 * j * 3,
                      )
                    : buffers.position.set(
                        [x, y - h, 0, x, y, 0, x + w, y - h, 0, x + w, y, 0],
                        4 * j * 3,
                      ),
                    buffers.animation.set(
                      [
                        glyphIndex,
                        wordIndex,
                        lineId,
                        glyphIndex,
                        wordIndex,
                        lineId,
                        glyphIndex,
                        wordIndex,
                        lineId,
                        glyphIndex,
                        wordIndex,
                        lineId,
                      ],
                      3 * glyphIndex * 4,
                    ),
                    glyphIndex++);
                  let u = glyph.x / texW,
                    uw = glyph.width / texW,
                    v = 1 - glyph.y / texH,
                    vh = glyph.height / texH;
                  (buffers.uv.set(
                    [u, v - vh, u, v, u + uw, v - vh, u + uw, v],
                    4 * j * 2,
                  ),
                    buffers.local.set([0, 1, 0, 0, 1, 1, 1, 0], 4 * j * 2),
                    1 === glyph.weight && (y -= config.boldBaseOffset * scale),
                    2 === glyph.weight &&
                      (y -= config.italicBaseOffset * scale),
                    (y += glyph.yoffset * scale),
                    j++);
                }
                y -= size * lineHeight * (line.br ? paragraphSpacing : 1);
              }
              window.zUtils3D &&
                ((geom = new Geometry()),
                geom.addAttribute(
                  "position",
                  new GeometryAttribute(buffers.position, 3),
                ),
                geom.computeBoundingBox(),
                geom.computeBoundingSphere());
              let backing = [];
              for (let key in buffers) backing.push(buffers[key].buffer);
              ((buffers.lineLength = lines.length),
                geom &&
                  ((buffers.boundingBox = geom.boundingBox),
                  (buffers.boundingSphere = geom.boundingSphere)));
              ((buffers.letterCount = glyphIndex),
                (buffers.lineCount = lineId),
                (buffers.wordCount = wordIndex),
                resolve(buffers, pid, backing));
            })(lines);
          })();
        })());
    }
    (Thread.upload(loadTextGeometry),
      (this.generate = async function (obj) {
        return Thread.shared().loadTextGeometry(obj);
      }));
  }, "static"),
  Class(function GLUI() {
    Inherit(this, Component);
    const _this = this,
      hasMetal = !!window.Metal,
      hasAuraAR = !!window.AURA_AR;
    function loop() {
      hasMetal ||
        (hasAuraAR &&
          AURA_AR.active &&
          ((World.NUKE.postRender = null), (AURA_AR.postRender = loop)),
        _this.Scene && _this.Scene.render(),
        _this.Stage && _this.Stage.render());
    }
    ((window.$gl = window.glObject =
      function (width, height, map, customCompile) {
        return new GLUIObject(width, height, map, customCompile);
      }),
      (window.$glText = window.glText =
        function (text, fontName, fontSize, options, customCompile) {
          return new GLUIText(text, fontName, fontSize, options, customCompile);
        }),
      (this.init = async function (is2D, is3D) {
        _this.initialized ||
          (void 0 === is2D && ((is2D = !0), (is3D = !0)),
          await AssetLoader.waitForLib("zUtils3D"),
          is2D && (_this.Stage = new GLUIStage()),
          is3D &&
            ((_this.Scene = new GLUIStage3D()),
            (_this.Scene.interaction.input = Mouse)),
          _this.wait(World, "NUKE", (_) => {
            ((_this.initialized = !0),
              _this.Scene && (World.NUKE.onBeforeRender = _this.Scene.mark),
              (World.NUKE.postRender = loop));
          }));
      }),
      (this.clear = function () {
        (_this.Stage.clear(), _this.Scene.clear());
      }),
      (this.ready = function () {
        return _this.wait(_this, "initialized");
      }),
      (this.renderDirect = function (render) {
        (_this.Scene && _this.Scene.renderDirect(render),
          _this.Stage && _this.Stage.renderDirect(render));
      }));
  }, "static"),
  Class(function GLUIElement() {
    Inherit(this, Component);
    ((this.element = $gl()),
      (this.create = function (w, h, t) {
        return this.element.create(w, h, t);
      }));
  }),
  Class(function GLUIUtils() {
    const _this = this;
    ((_this.setRetinaMode = function ($obj, retinaMode, parent) {
      if (
        (RenderManager.type === RenderManager.WEBVR && (retinaMode = !1),
        parent ||
          (parent = ($obj.anchor && $obj.anchor._parent) || $obj.group._parent))
      )
        if (retinaMode) {
          let gluiToRTScene,
            p = parent;
          for (; p; ) (p.glSceneEnabled && (gluiToRTScene = p), (p = p.parent));
          (gluiToRTScene
            ? gluiToRTScene.glScene.add($obj)
            : GLUI.Scene.add($obj),
            parent.add($obj.anchor),
            ($obj.anchor.retinaAnchorFor = $obj),
            $obj.group.asyncPromise &&
              !$obj.anchor.asyncPromise &&
              ($obj.anchor.asyncPromise = $obj.group.asyncPromise),
            ($obj.anchor.position.equals($obj.group.position) &&
              $obj.anchor.scale.equals($obj.group.scale) &&
              $obj.anchor.quaternion.equals($obj.group.quaternion)) ||
              (($obj.isDirty = !0),
              $obj.mesh &&
                $obj.mesh.onBeforeRender &&
                $obj.mesh.onBeforeRender()));
        } else
          (_this.isRetinaMode($obj) &&
            (parent.remove($obj.anchor),
            GLUI.Scene.remove($obj),
            ($obj.anchor._parent = null),
            ($obj.group.visible = parent.determineVisible()),
            "boolean" == typeof $obj.isDirty &&
            $obj.mesh &&
            $obj.mesh.onBeforeRender
              ? (($obj.isDirty = !0), $obj.mesh.onBeforeRender())
              : ($obj.group.position.setScalar(0),
                $obj.group.quaternion.set(0, 0, 0, 1),
                $obj.group.scale.setScalar(1)),
            ($obj.deferred = !1),
            ($obj.parent = null)),
            parent.add($obj.group));
    }),
      (_this.isRetinaMode = function ($obj) {
        return (
          RenderManager.type !== RenderManager.WEBVR &&
          $obj.anchor &&
          $obj.anchor._parent &&
          $obj.parent === GLUI.Scene
        );
      }));
  }, "static"),
  Class(function GLUIBatch(
    globalUniforms = {},
    _useWorldCoords,
    cacheSuffix = "",
  ) {
    Inherit(this, Component);
    const _this = this;
    var _timer,
      _geometry,
      _shader,
      _objects = [];
    function loop() {
      if (!_geometry) return;
      let parent = _this.group._parent;
      for (; parent; ) {
        if (parent.isRenderingCheck && !parent.isRenderingCheck()) return;
        parent = parent._parent;
      }
      let len = _objects.length;
      for (let i = 0; i < len; i++) {
        let obj = _objects[i];
        if (obj._buffers) {
          (obj.mesh.onBeforeRender(),
            _useWorldCoords &&
              (obj.group.updateMatrixWorld(),
              obj.mesh.getWorldPosition(obj.worldPosition),
              obj.worldRotation.setFromQuaternion(
                obj.mesh.getWorldQuaternion(),
              ),
              obj.mesh.getWorldScale(obj.worldScale)));
          for (let j = obj._buffers.length - 1; j > -1; j--) {
            let buffer = obj._buffers[j],
              dirty = !1;
            if (
              ((dirty = !buffer.value.equals(buffer.lookup)),
              buffer.value.copy(buffer.lookup),
              dirty)
            ) {
              let attribute = _geometry.attributes[buffer.key],
                array = attribute.array;
              switch (buffer.key) {
                case "scale":
                  _useWorldCoords
                    ? ((array[2 * i + 0] = obj.worldScale.x),
                      (array[2 * i + 1] = obj.worldScale.y))
                    : ((array[2 * i + 0] =
                        obj.group.scale.x * obj.mesh.scale.x),
                      (array[2 * i + 1] =
                        obj.group.scale.y * obj.mesh.scale.y));
                  break;
                case "rotation":
                  array[i] = buffer.lookup.z;
                  break;
                default:
                  (_useWorldCoords
                    ? ((array[3 * i + 0] = obj.worldPosition.x),
                      (array[3 * i + 1] = obj.worldPosition.y))
                    : ((array[3 * i + 0] = obj.group.position.x),
                      (array[3 * i + 1] = obj.group.position.y)),
                    (array[3 * i + 2] = obj.mesh.renderOrder));
              }
              attribute.needsUpdate = !0;
            }
          }
          for (let j = obj._uniforms.length - 1; j > -1; j--) {
            let uniform = obj._uniforms[j],
              dirty = !1;
            if (
              ("f" == uniform.type
                ? ((dirty =
                    obj.mesh.shader.uniforms[uniform.key].value !=
                    uniform.value),
                  (uniform.value = obj.mesh.shader.uniforms[uniform.key].value))
                : ((dirty = !obj.mesh.shader.uniforms[uniform.key].value.equals(
                    uniform.value,
                  )),
                  uniform.value.copy(
                    obj.mesh.shader.uniforms[uniform.key].value,
                  )),
              dirty)
            ) {
              let attribute = _geometry.attributes["a_" + uniform.key],
                array = attribute.array;
              ("f" == uniform.type
                ? (array[i] = uniform.value)
                : uniform.value.toArray(array, i * uniform.components),
                (attribute.needsUpdate = !0));
            }
          }
        }
      }
    }
    function getTypeFromSize(size) {
      switch (size) {
        case 1:
          return "float";
        case 2:
          return "vec2";
        case 3:
          return "vec3";
        case 4:
          return "vec4";
      }
    }
    function createMesh() {
      let shader = _objects[0].mesh.shader;
      _geometry = new Geometry().instanceFrom(
        _objects[0].mesh.geometry.clone(),
      );
      let map = {},
        arrays = {};
      _objects.forEach((obj, i) => {
        obj.mesh.onBeforeRender();
        let buffers = [],
          uniforms = [];
        for (let key in shader.uniforms) {
          let uniform = shader.uniforms[key];
          uniform &&
            (uniform.value instanceof Color &&
              uniforms.push({ key: key, type: "c", components: 3 }),
            uniform.value instanceof Vector4 &&
              uniforms.push({ key: key, type: "v4", components: 4 }),
            uniform.value instanceof Vector3 &&
              uniforms.push({ key: key, type: "v3", components: 3 }),
            uniform.value instanceof Vector2 &&
              uniforms.push({ key: key, type: "v", components: 2 }),
            "number" == typeof uniform.value &&
              uniforms.push({ key: key, type: "f", components: 1 }));
        }
        (_useWorldCoords &&
          ((obj.worldScale = new Vector3()),
          (obj.worldRotation = new Euler()),
          (obj.worldPosition = new Vector3())),
          buffers.push({
            key: "scale",
            lookup: _useWorldCoords ? obj.worldScale : obj.group.scale,
            components: 2,
          }),
          buffers.push({
            key: "rotation",
            lookup: _useWorldCoords ? obj.worldRotation : obj.group.rotation,
            components: 1,
          }),
          buffers.push({
            key: "offset",
            lookup: _useWorldCoords ? obj.worldPosition : obj.group.position,
            components: 3,
          }),
          uniforms.forEach((uniform) => {
            (arrays["a_" + uniform.key] || (arrays["a_" + uniform.key] = []),
              map["a_" + uniform.key] || (map["a_" + uniform.key] = uniform));
            let value = shader.uniforms[uniform.key].value;
            "object" == typeof value
              ? ((uniform.value = value.clone()),
                uniform.value.toArray(
                  arrays["a_" + uniform.key],
                  i * uniform.components,
                ))
              : ((uniform.value = shader.uniforms[uniform.key].value),
                arrays["a_" + uniform.key].push(uniform.value));
          }),
          buffers.forEach((buffer) => {
            switch (
              (arrays[buffer.key] || (arrays[buffer.key] = []),
              map[buffer.key] || (map[buffer.key] = buffer),
              (buffer.value = buffer.lookup.clone()),
              buffer.key)
            ) {
              case "scale":
                arrays[buffer.key].push(
                  obj.group.scale.x * obj.mesh.scale.x,
                  obj.group.scale.y * obj.mesh.scale.y,
                );
                break;
              case "rotation":
                arrays[buffer.key].push(buffer.lookup.z);
                break;
              default:
                arrays[buffer.key].push(
                  buffer.lookup.x,
                  buffer.lookup.y,
                  obj.mesh.renderOrder,
                );
            }
          }),
          (obj._buffers = buffers),
          (obj._uniforms = uniforms),
          (obj.shader.neverRender = !0));
      });
      let attributes = [],
        defines = [];
      for (let key in map)
        key.includes("a_") &&
          (attributes.push(`% ${getTypeFromSize(map[key].components)} ${key};`),
          defines.push(`${key.replace("a_", "v_")} = ${key};`));
      ((attributes = attributes.join("\n")), (defines = defines.join("\n")));
      for (let key in arrays)
        _geometry.addAttribute(
          key,
          new GeometryAttribute(
            new Float32Array(arrays[key]),
            map[key].components,
            1,
          ),
        );
      let cacheKey = shader.fsName + cacheSuffix;
      if (GLUIBatch.cache[cacheKey]) _shader = GLUIBatch.cache[cacheKey];
      else {
        (_shader = _this.initClass(
          Shader,
          "GLUIBatch",
          shader.fsName,
          Object.assign(
            {},
            {
              transparent: !0,
              depthWrite: !1,
              depthTest: !1,
              customCompile: Utils.uuid(),
            },
            globalUniforms,
          ),
        )).vertexShader || _shader.resetProgram();
        let vsSplit = _shader.vertexShader.split("__ACTIVE_THEORY_LIGHTS__"),
          fsSplit = _shader.fragmentShader.split("__ACTIVE_THEORY_LIGHTS__"),
          definitions = [];
        (fsSplit[1].split("\n").forEach((line) => {
          if (line.includes("uniform")) {
            if (line.includes("sampler2D")) return;
            let data = line.split(" ");
            (definitions.push(`${data[2].replace(";", "")} = a_${data[2]}`),
              (vsSplit[1] =
                `\nattribute ${data[1]} a_${data[2]}\nvarying ${data[1]} ${data[2]}` +
                vsSplit[1]),
              (vsSplit[1] = vsSplit[1].replace(line, "")),
              (fsSplit[1] = fsSplit[1].replace(
                line,
                `varying ${data[1]} ${data[2]}`,
              )));
          }
        }),
          (vsSplit[1] = vsSplit[1].replace(
            "//vdefines",
            "\n" + definitions.join("\n"),
          )),
          (_shader.vertexShader = vsSplit.join("__ACTIVE_THEORY_LIGHTS__")),
          (_shader.fragmentShader = fsSplit.join("__ACTIVE_THEORY_LIGHTS__")),
          (GLUIBatch.cache[cacheKey] = _shader));
      }
      (shader.replicateUniformsTo(_shader),
        (_this.mesh = new Mesh(_geometry, _shader)),
        (_this.mesh.frustumCulled = !1),
        _this.group.add(_this.mesh));
    }
    ((this.group = new Group()),
      "boolean" == typeof globalUniforms &&
        ((_useWorldCoords = globalUniforms), (globalUniforms = {})),
      GLUIBatch.cache || (GLUIBatch.cache = {}),
      _this.startRender(loop),
      (this.add = function (obj) {
        if (
          (clearTimeout(_timer),
          (_timer = _this.delayedCall(createMesh, 50)),
          _useWorldCoords)
        ) {
          let getAlpha = obj.getAlpha;
          getAlpha &&
            (obj.getAlpha = () =>
              (_this.parent ? _this.parent.getAlpha() : 1) *
              getAlpha.call(obj));
        } else _this.parent?.add?.(obj);
        _objects.push(obj);
      }),
      (this.setZ = async function (z) {
        (await _this.wait("mesh"), (_this.mesh.renderOrder = z));
      }),
      (this.onDestroy = function () {
        _this.mesh && _this.mesh.destroy();
      }));
  }),
  Class(function GLUIBatchText(
    globalUniforms = {},
    _useWorldCoords,
    _shaderName,
  ) {
    Inherit(this, Component);
    const _this = this;
    var _geometry,
      _shader,
      _timer,
      _forceUpdate,
      _promises = [],
      _toSplice = [],
      _objects = [],
      _offset = 0;
    function loop() {
      if (!_geometry) return;
      let updated = !1;
      for (let key in _geometry.attributes) {
        let attrib = _geometry.attributes[key];
        attrib.updateRange.length && (attrib.updateRange.length = 0);
      }
      let len = _objects.length;
      for (let i = 0; i < len; i++) {
        let obj = _objects[i];
        (obj.mesh.onBeforeRender(),
          _useWorldCoords &&
            (obj.group.updateMatrixWorld(),
            obj.mesh.getWorldPosition(obj.worldPosition),
            obj.worldRotation.setFromQuaternion(obj.mesh.getWorldQuaternion()),
            obj.mesh.getWorldScale(obj.worldScale)));
        let offset = obj._offset,
          count = obj._count,
          end = offset + count;
        (obj._buffers.forEach((buffer) => {
          let dirty = !1;
          if (
            ((dirty = !buffer.value.equals(buffer.lookup)),
            buffer.value.copy(buffer.lookup),
            dirty)
          ) {
            let array = _geometry.attributes[buffer.key].array;
            for (let j = offset; j < end; j++)
              switch (buffer.components) {
                case 4:
                  ((array[4 * j + 0] = buffer.lookup.x),
                    (array[4 * j + 1] = buffer.lookup.y),
                    (array[4 * j + 2] = buffer.lookup.z),
                    (array[4 * j + 3] = buffer.lookup.w));
                  break;
                case 3:
                  ((array[3 * j + 0] = buffer.lookup.x),
                    (array[3 * j + 1] = buffer.lookup.y),
                    (array[3 * j + 2] = buffer.lookup.z));
                  break;
                case 2:
                  ((array[2 * j + 0] = buffer.lookup.x),
                    (array[2 * j + 1] = buffer.lookup.y));
                  break;
                case 1:
                  array[j] = buffer.lookup.z;
              }
            ((updated = !0),
              (buffer.updateRange.offset = offset * buffer.components),
              (buffer.updateRange.count = count * buffer.components),
              _geometry.attributes[buffer.key].updateRange.push(
                buffer.updateRange,
              ),
              (_geometry.attributes[buffer.key].needsUpdate = !0));
          }
        }),
          obj._uniforms.forEach((uniform) => {
            let dirty = !1;
            if (
              ("f" == uniform.type
                ? ((dirty =
                    obj.mesh.shader.uniforms[uniform.key].value !=
                    uniform.value),
                  (uniform.value = obj.mesh.shader.uniforms[uniform.key].value))
                : ((dirty = !obj.mesh.shader.uniforms[uniform.key].value.equals(
                    uniform.value,
                  )),
                  uniform.value.copy(
                    obj.mesh.shader.uniforms[uniform.key].value,
                  )),
              dirty || _forceUpdate)
            ) {
              let array = _geometry.attributes["a_" + uniform.key].array;
              for (let j = offset; j < end; j++)
                "f" == uniform.type
                  ? (array[j] = obj.mesh.shader.uniforms[uniform.key].value)
                  : obj.mesh.shader.uniforms[uniform.key].value.toArray(
                      array,
                      j * uniform.components,
                    );
              ((updated = !0),
                (uniform.updateRange.offset = offset * uniform.components),
                (uniform.updateRange.count = count * uniform.components),
                _geometry.attributes["a_" + uniform.key].updateRange.push(
                  uniform.updateRange,
                ),
                (_geometry.attributes["a_" + uniform.key].needsUpdate = !0));
            }
          }));
      }
      if (updated)
        for (let key in _geometry.attributes) {
          let bottom,
            attrib = _geometry.attributes[key];
          if (!attrib.updateRange.length) continue;
          let toSplice = _toSplice;
          toSplice.length = 0;
          for (let i = 0; i < attrib.updateRange.length; i++) {
            let current = attrib.updateRange[i],
              prev = attrib.updateRange[i - 1];
            prev
              ? prev.offset + prev.count == current.offset
                ? ((bottom.count += current.count), toSplice.push(i))
                : (bottom = current)
              : (bottom = current);
          }
          for (let i = toSplice.length - 1; i > -1; i--)
            attrib.updateRange.splice(toSplice[i], 1);
        }
      _forceUpdate = !1;
    }
    async function createMesh() {
      if (_this.flag("mesh")) return;
      (_this.flag("mesh", !0),
        await Promise.all(_promises),
        await _this.wait(100));
      let mesh = new Mesh(_geometry, _shader);
      ((_this.mesh = mesh), (mesh.frustumCulled = !1), _this.group.add(mesh));
    }
    ((this.group = new Group()),
      (this.enable3D = () => {}),
      "boolean" == typeof globalUniforms &&
        ((_useWorldCoords = globalUniforms), (globalUniforms = {})),
      _this.flag("canLoad", !0),
      _this.startRender(loop),
      (_this.add = async function (obj) {
        if ((await _this.flag("canLoad"), _this.destroy)) {
          if (
            (_this.flag("canLoad", !1),
            await obj.loaded(),
            (obj.mesh.shader.neverRender = !0),
            _promises.push(obj.loaded()),
            (function addAttributes(obj, mesh) {
              let { geometry: geometry, shader: shader } = mesh,
                count = geometry.attributes.uv.count;
              mesh.onBeforeRender();
              let buffers = [],
                uniforms = [];
              for (let key in shader.uniforms) {
                let uniform = shader.uniforms[key];
                (uniform.value instanceof Color &&
                  uniforms.push({ key: key, type: "c", components: 3 }),
                  uniform.value instanceof Vector3 &&
                    uniforms.push({ key: key, type: "v3", components: 3 }),
                  uniform.value instanceof Vector4 &&
                    uniforms.push({ key: key, type: "v4", components: 4 }),
                  uniform.value instanceof Vector2 &&
                    uniforms.push({ key: key, type: "v", components: 2 }),
                  "number" == typeof uniform.value &&
                    uniforms.push({ key: key, type: "f", components: 1 }));
              }
              (_useWorldCoords &&
                ((obj.worldScale = new Vector3()),
                (obj.worldRotation = new Euler()),
                (obj.worldPosition = new Vector3())),
                buffers.push({
                  key: "offset",
                  lookup: _useWorldCoords
                    ? obj.worldPosition
                    : obj.group.position,
                  components: 3,
                }),
                buffers.push({
                  key: "scale",
                  lookup: _useWorldCoords ? obj.worldScale : obj.group.scale,
                  components: 2,
                }),
                buffers.push({
                  key: "rotation",
                  lookup: _useWorldCoords
                    ? obj.worldRotation
                    : obj.group.rotation,
                  components: 1,
                }),
                uniforms.forEach((uniform) => {
                  ((uniform.updateRange = {}),
                    (uniform.value = shader.uniforms[uniform.key].value),
                    "object" == typeof uniform.value &&
                      (uniform.value = uniform.value.clone()),
                    (uniform.buffer = new Float32Array(
                      count * uniform.components,
                    )));
                }),
                buffers.forEach((buffer) => {
                  ((buffer.updateRange = {}),
                    (buffer.value = buffer.lookup.clone()),
                    (buffer.buffer = new Float32Array(
                      count * buffer.components,
                    )));
                }));
              for (let i = 0; i < count; i++)
                (buffers.forEach((buffer) => {
                  switch (buffer.components) {
                    case 4:
                      ((buffer.buffer[4 * i + 0] = buffer.lookup.x),
                        (buffer.buffer[4 * i + 1] = buffer.lookup.y),
                        (buffer.buffer[4 * i + 2] = buffer.lookup.z),
                        (buffer.buffer[4 * i + 3] = buffer.lookup.w));
                      break;
                    case 3:
                      ((buffer.buffer[3 * i + 0] = buffer.lookup.x),
                        (buffer.buffer[3 * i + 1] = buffer.lookup.y),
                        (buffer.buffer[3 * i + 2] = buffer.lookup.z));
                      break;
                    case 2:
                      ((buffer.buffer[2 * i + 0] = buffer.lookup.x),
                        (buffer.buffer[2 * i + 1] = buffer.lookup.y));
                      break;
                    case 1:
                      buffer.buffer[i] = buffer.lookup.z;
                  }
                }),
                  uniforms.forEach((uniform) => {
                    "f" == uniform.type
                      ? (uniform.buffer[i] = shader.uniforms[uniform.key].value)
                      : shader.uniforms[uniform.key].value.toArray(
                          uniform.buffer,
                          i * uniform.components,
                        );
                  }));
              (buffers.forEach((buffer) => {
                geometry.addAttribute(
                  buffer.key,
                  new GeometryAttribute(buffer.buffer, buffer.components),
                );
              }),
                uniforms.forEach((uniform) => {
                  geometry.addAttribute(
                    "a_" + uniform.key,
                    new GeometryAttribute(uniform.buffer, uniform.components),
                  );
                }),
                (obj._offset = _offset),
                (obj._count = count),
                (obj._uniforms = uniforms),
                (obj._buffers = buffers),
                _objects.push(obj),
                (_offset += count));
            })(obj, obj.mesh),
            _useWorldCoords)
          ) {
            let getAlpha = obj.getAlpha;
            getAlpha &&
              (obj.getAlpha = () =>
                (_this.parent ? _this.parent.getAlpha() : 1) *
                getAlpha.call(obj));
          } else _this.parent.add(obj);
          (_geometry
            ? _geometry.merge(obj.mesh.geometry)
            : (function initGeometry(mesh) {
                (_shader = _this.initClass(
                  Shader,
                  _shaderName || "GLUIBatchText",
                  _shaderName || mesh.shader.fsName,
                  Object.assign(
                    {},
                    {
                      transparent: !0,
                      depthWrite: !1,
                      customCompile: `${mesh.shader.vsName}|${mesh.shader.fsName}|instance`,
                    },
                    globalUniforms,
                  ),
                )).vertexShader || _shader.resetProgram();
                let vsSplit = _shader.vertexShader.split(
                    "__ACTIVE_THEORY_LIGHTS__",
                  ),
                  fsSplit = _shader.fragmentShader.split(
                    "__ACTIVE_THEORY_LIGHTS__",
                  ),
                  definitions = [],
                  definitionSplit = [];
                (fsSplit[1].split("\n").forEach((line) => {
                  if (line.includes("uniform")) {
                    if (line.includes("sampler2D")) return;
                    let data = line.split(" ");
                    (definitions.push(
                      `${data[2].replace(";", "")} = a_${data[2]}`,
                    ),
                      (vsSplit[1] =
                        `\nattribute ${data[1]} a_${data[2]}\nvarying ${data[1]} ${data[2]}` +
                        vsSplit[1]),
                      (vsSplit[1] = vsSplit[1].replace(line, "")),
                      (fsSplit[1] = fsSplit[1].replace(
                        line,
                        `varying ${data[1]} ${data[2]}`,
                      )));
                  }
                }),
                  definitions.forEach((def) =>
                    definitionSplit.push(def.split(" =")[0].trim()),
                  ));
                let baseVS = Shaders.getShader(mesh.shader.vsName + ".vs");
                if (baseVS.includes("//start batch main")) {
                  let main = baseVS
                    .split("//start batch main")[1]
                    .split("//end batch main")[0];
                  vsSplit[1] = vsSplit[1].replace("//custommain", main);
                  let beforeMain = baseVS.split("void main() {")[0];
                  ((beforeMain = beforeMain.replace(
                    "uniform sampler2D tMap;",
                    "",
                  )),
                    (beforeMain = beforeMain.replace("varying vec2 vUv;", "")),
                    beforeMain.split("\n").forEach((line) => {
                      definitionSplit.forEach((def) => {
                        line.includes(def) &&
                          line.includes(["uniform", "varying"]) &&
                          (beforeMain = beforeMain.replace(line, ""));
                      });
                    }),
                    (vsSplit[0] += beforeMain));
                }
                ((vsSplit[1] = vsSplit[1].replace(
                  "//vdefines",
                  "\n" + definitions.join("\n"),
                )),
                  (_shader.vertexShader = vsSplit.join(
                    "__ACTIVE_THEORY_LIGHTS__",
                  )),
                  (_shader.fragmentShader = fsSplit.join(
                    "__ACTIVE_THEORY_LIGHTS__",
                  )),
                  mesh.shader.copyUniformsTo(_shader),
                  (_geometry = mesh.geometry.clone()));
                for (let key in _geometry.attributes)
                  _geometry.attributes[key].updateRange = [];
              })(obj.mesh),
            _this.flag("canLoad", !0),
            clearTimeout(_timer),
            (_timer = _this.delayedCall(createMesh, 50)),
            (obj.isDirty = !0));
        }
      }),
      (_this.forceUpdate = function () {
        _forceUpdate = !0;
      }),
      (_this.onDestroy = function () {
        _this.mesh && _this.mesh.destroy();
      }));
  }),
  Class(function GLUIStageInteraction2D(_camera, _scene, _stage, _custom) {
    Inherit(this, Component);
    const _this = this;
    var _ray,
      _over,
      _click,
      _customTest,
      _disabled,
      _blocked,
      _test = [],
      _objects = (this.objects = []),
      _hold = new Vector2(),
      _lastTestedPoint = (new Vector2(), new Vector2()),
      _plane = new Plane();
    function cacheTopScene(obj) {
      let p = obj;
      for (; p; )
        (p instanceof Scene && (obj.interactionScene = p), (p = p._parent));
    }
    function testObjects() {
      let objects = GLUI.Stage.interaction.objects;
      _test.length = 0;
      for (let i = objects.length - 1; i > -1; i--) {
        let obj = objects[i];
        (obj.interactionScene || cacheTopScene(obj),
          (obj.forceGLUIInteraction ||
            (obj.determineVisible() && _scene == obj.interactionScene)) &&
            _test.push(obj));
      }
      return _test;
    }
    function externalStart() {
      _this._invisible || start(_lastTestedPoint);
    }
    function externalRelease() {
      _this._invisible || end(_lastTestedPoint);
    }
    function move(e) {
      if (GLUI.PREVENT_INTERACTION || _this._invisible || _disabled || _blocked)
        return;
      _ray || ((_ray = new Raycaster(_camera)).testVisibility = !1);
      let objects = testObjects();
      if (!objects.length)
        return void (
          _over &&
          (_over._onOver({ action: "out", object: _over }),
          (_over = null),
          Stage.cursor("auto"))
        );
      let hit = _ray.checkHit(objects, e, _stage);
      try {
        if (hit[0]) {
          _customTest || (GLUI.HIT = !0);
          let obj = hit[0].object.glui;
          (_over ||
            ((_over = obj)._onOver({ action: "over", object: obj }),
            Stage.cursor("pointer")),
            _over != obj &&
              (_over._onOver({ action: "out", object: _over }),
              (_over = obj)._onOver({ action: "over", object: obj }),
              Stage.cursor("pointer")));
        } else
          (_customTest || (GLUI.HIT = !1),
            _over &&
              (_over._onOver({ action: "out", object: _over }),
              (_over = null),
              Stage.cursor("auto")));
      } catch (e) {
        console.warn(e);
      }
    }
    function start(e) {
      let handlingEvent = !(e instanceof Vector2),
        checkDefault = GLUI.PREVENT_DEFAULT_INTERACTION && handlingEvent,
        checkPrevention =
          GLUI.PREVENT_INTERACTION || _this._invisible || _disabled || _blocked;
      checkDefault ||
        checkPrevention ||
        ((_custom && handlingEvent) ||
          (!Device.mobile && RenderManager.type != RenderManager.WEBVR) ||
          move(e),
        _over &&
          !_click &&
          ((_click = _over), _hold.copy(e), (_hold.time = Date.now())));
    }
    function end(e) {
      if (
        !(GLUI.PREVENT_INTERACTION || _this._invisible || _disabled || _blocked)
      ) {
        if (
          (_customTest &&
            Device.mobile &&
            _click &&
            null == _over &&
            (_over = _click),
          (GLUI.HIT = !1),
          _click)
        ) {
          if (Date.now() - _hold.time > 750) return (_click = null);
          if (_click == _over)
            try {
              ((_blocked = !0),
                _this.delayedCall((_) => {
                  _blocked = !1;
                }, _this.preventDoubleClickTime),
                _click._onClick({ action: "click", object: _click }),
                (Device.mobile || _custom) &&
                  _over &&
                  (_over._onOver({ action: "out", object: _over }),
                  (_over = null),
                  Stage.cursor("auto")));
            } catch (e) {
              console.warn(e);
            }
        }
        _click = null;
      }
    }
    function findCapture(object) {
      let capture = object.__slc;
      return void 0 === capture && window.UI3D
        ? (object.__slc = UI3D.findStageLayoutCapture(object) || null)
        : capture;
    }
    ((this.preventDoubleClickTime = 300),
      (function addListeners() {
        (_custom || _this.events.sub(Mouse.input, Interaction.MOVE, move),
          _this.events.sub(Mouse.input, Interaction.START, start),
          _this.events.sub(Mouse.input, Interaction.END, end),
          _this.events.sub(Interaction3D.EXTERNAL_PRESS, externalStart),
          _this.events.sub(Interaction3D.EXTERNAL_RELEASE, externalRelease));
      })(),
      _this.startRender((_) => {}),
      (this.add = function (obj) {
        obj && _objects.push(obj.mesh || obj);
      }),
      (this.remove = function (obj) {
        obj && _objects.remove(obj.mesh || obj);
      }),
      (this.testWith = function (point, id) {
        ((point.customTest = !0),
          _lastTestedPoint.copy(point),
          (_lastTestedPoint.customTest = !0),
          (_customTest = !0),
          move(point),
          Device.mobile &&
            RenderManager.type != RenderManager.WEBVR &&
            _over &&
            start(point));
      }),
      (this.testWithFinger = function (point, distance, minDistance) {
        (_ray || ((_ray = new Raycaster(_camera)).testVisibility = !1),
          (_customTest = !0));
        let objects = testObjects();
        if (objects.length)
          if (distance < 0.02) {
            let hit = _ray.checkHit(objects, point, _stage);
            try {
              if (hit[0]) {
                let obj = hit[0].object.glui;
                (!obj._preventClickTime ||
                  Render.TIME - obj._preventClickTime >
                    _this.preventDoubleClickTime) &&
                  (obj._requiresClear ||
                    ((_over = obj),
                    obj._onOver({ action: "over", object: obj }),
                    obj._onClick({ action: "click", object: obj }),
                    (obj._preventClickTime = Render.TIME),
                    (obj._requiresClear = !0)));
              } else
                _over &&
                  ((_over._requiresClear = !1),
                  _over._onOver({ action: "out", object: _over }),
                  (_over = null));
            } catch (e) {
              console.warn(e);
            }
          } else
            _over &&
              ((_over._requiresClear = !1),
              _over._onOver({ action: "out", object: _over }),
              (_over = null));
      }),
      (this.checkObjectHit = function (object, mouse) {
        let capture = findCapture(object);
        return capture
          ? capture.checkObjectHit(object.mesh || object, mouse)
          : (_ray || ((_ray = new Raycaster(_camera)).testVisibility = !1),
            _ray.checkHit(object.mesh || object, mouse, _stage)[0]);
      }),
      (this.checkObjectFromValues = function (object, origin, direction) {
        let capture = findCapture(object);
        return capture
          ? capture.checkObjectFromValues(
              object.mesh || object,
              origin,
              direction,
            )
          : (_ray || ((_ray = new Raycaster(_camera)).testVisibility = !1),
            _ray.checkFromValues(object.mesh || object, origin, direction)[0]);
      }),
      (this.getObjectHitLocalCoords = function (v, object, mouse) {
        let capture = findCapture(object);
        if (capture) return capture.getObjectHitLocalCoords(v, object, mouse);
        let hit = _this.checkObjectHit(object, mouse);
        if (hit) return (v.copy(hit.point), hit.object.worldToLocal(v));
        {
          let mesh = object.mesh || object;
          return (
            _plane.normal
              .set(0, 0, 1)
              .applyQuaternion(mesh.getWorldQuaternion()),
            (_plane.constant = -mesh.getWorldPosition().dot(_plane.normal)),
            _ray.ray.intersectPlane(_plane, v),
            mesh.worldToLocal(v)
          );
        }
      }),
      this.set("_disabled", (v) => {
        (_disabled = v) &&
          ((_click = null),
          _over &&
            (_over._onOver({ action: "out", object: _over }),
            (_over = null),
            Stage.cursor("auto")));
      }),
      (this.onInvisible = () => {
        ((_click = null),
          _over &&
            (_over._onOver({ action: "out", object: _over }),
            (_over = null),
            Stage.cursor("auto")));
      }));
  }),
  Class(function GLUIStageInteraction3D() {
    Inherit(this, Component);
    function onHover(e) {
      e.mesh.glui._onOver({ action: e.action, object: e.mesh.glui });
    }
    function onClick(e) {
      e.mesh.glui._onClick({ action: e.action, object: e.mesh.glui });
    }
    ((this.add = function (obj, camera = World.CAMERA) {
      Interaction3D.find(camera).add(obj.mesh || obj, onHover, onClick);
    }),
      (this.remove = function (obj, camera = World.CAMERA) {
        Interaction3D.find(camera).remove(obj.mesh || obj);
      }),
      (this.checkObjectHit = function (object, mouse, camera = World.CAMERA) {
        return Interaction3D.find(camera).checkObjectHit(object.mesh, mouse);
      }),
      (this.checkObjectFromValues = function (
        object,
        origin,
        direction,
        camera = World.CAMERA,
      ) {
        return Interaction3D.find(camera).checkObjectFromValues(
          object.mesh,
          origin,
          direction,
        );
      }),
      (this.getObjectHitLocalCoords = function (
        v,
        object,
        mouse,
        camera = World.CAMERA,
      ) {
        return Interaction3D.find(camera).getObjectHitLocalCoords(
          v,
          object.mesh,
          mouse,
        );
      }));
  }),
  Class(function GLUICornerPin($obj) {
    Inherit(this, Component);
    const _this = this;
    var _geom, _vertices, _last;
    function loop() {
      ((_vertices[0] = _this.tl.x),
        (_vertices[1] = -_this.tl.y),
        (_vertices[3] = _vertices[9] = _this.bl.x),
        (_vertices[4] = _vertices[10] = -_this.bl.y),
        (_vertices[6] = _vertices[15] = _this.tr.x),
        (_vertices[7] = _vertices[16] = -_this.tr.y),
        (_vertices[12] = _this.br.x),
        (_vertices[13] = -_this.br.y),
        (function dirty() {
          let a = _vertices,
            b = _last;
          for (let i = a.length - 1; i > -1; i--) if (a[i] != b[i]) return !0;
          return !1;
        })() && (_geom.attributes.position.needsUpdate = !0),
        _last.set(_vertices));
    }
    ((this.tl = new Vector2(0, 0)),
      (this.tr = new Vector2($obj.width, 0)),
      (this.bl = new Vector2(0, $obj.height)),
      (this.br = new Vector2($obj.width, $obj.height)),
      (function initGeometry() {
        ((_geom = $obj.mesh.geometry.toNonIndexed()),
          $obj.useGeometry(_geom),
          $obj.mesh.scale.set(1, 1, 1),
          (_vertices = _geom.attributes.position.array),
          (_last = new Float32Array(_vertices)));
      })(),
      _this.startRender(loop),
      (this.update = function () {
        (this.tl.set(0, 0),
          this.tr.set($obj.width, 0),
          this.bl.set(0, $obj.height),
          this.br.set($obj.width, $obj.height));
      }),
      (this.tween = function (type, val, time, ease, delay) {
        return (
          (val = val instanceof Vector2 ? val : new Vector2(val.x, val.y)),
          tween(_this[type], val, time, ease, delay)
        );
      }));
  }));
class GLUIObject {
  constructor(width, height, map, customCompile) {
    let shader = (this.textureShader = new Shader("GLUIObject", {
      tMap: { value: null },
      uAlpha: { type: "f", value: 1 },
      transparent: !0,
      depthTest: !1,
      customCompile: customCompile,
    }));
    ((shader.persists = !0),
      map || (shader.visible = !1),
      (this.usingMap = null != map && "empty" != map && "" != map),
      (this.tMap = shader.uniforms.tMap),
      (this.group = new Group()),
      (this.alpha = 1),
      (this._x = 0),
      (this._y = 0),
      (this._z = 0),
      (this._scaleX = 1),
      (this._scaleY = 1),
      (this._scale = 1),
      (this._rotation = 0),
      (this.multiTween = !0),
      (this.children = []),
      (this.dimensions = new Vector3(width, height, 1)),
      (this._shader = shader),
      (this.mesh = new Mesh(GLUIObject.getGeometry("2d"), shader)),
      (this.mesh.glui = this),
      this.group.add(this.mesh),
      (shader.mesh = this.mesh),
      window.GLSEO && GLSEO.objectNode(this),
      this.bg(
        "string" == typeof map
          ? map.includes(["#", "0x"])
            ? map
            : "empty" === map || "" === map
              ? null
              : Utils3D.getTexture(map, { premultiplyAlpha: !1 })
          : map,
      ));
    const _this = this;
    ((this.mesh.onBeforeRender = (_) => {
      if (!_this.mesh.determineVisible() && _this.firstRender) return;
      let alpha = _this.getAlpha();
      if (
        (_this.mesh.shader.uniforms.uAlpha &&
          (_this.mesh.shader.uniforms.uAlpha.value = alpha),
        _this.usingMap)
      )
        if (alpha < 0.001) {
          if (
            ((_this.mesh.neverRender = !0),
            (_this.mesh.shader.visible = !1),
            !_this.isDirty && _this.firstRender)
          )
            return;
        } else
          ((_this.mesh.neverRender = !1), (_this.mesh.shader.visible = !0));
      if (!_this.isDirty && _this.firstRender) return;
      (RenderStats.active &&
        RenderStats.update(
          "GLUIObject",
          1,
          _this.mesh.shader.vsName + "|" + _this.mesh.shader.fsName,
          _this.mesh,
        ),
        (_this.group.position.x = _this._x),
        (_this.group.position.y = _this._3d ? _this._y : -_this._y),
        (_this.group.position.z = _this._z),
        1 != _this.scale &&
          ((_this.group.position.x +=
            (_this.dimensions.x - _this.dimensions.x * _this.scale) / 2),
          (_this.group.position.y -=
            (_this.dimensions.y - _this.dimensions.y * _this.scale) / 2)));
      _this.mesh.shader;
      if (_this.calcMask) {
        let v = _this.isMasked;
        (v.copy(v.origin),
          _this.group.localToWorld(v),
          (v.z = v.width),
          (v.w = v.height));
      }
      (map
        ? _this.corners ||
          (_this.mesh.scale.set(1, 1, 1).multiply(_this.dimensions),
          (_this.group.scale.x = _this._scaleX * _this._scale),
          (_this.group.scale.y = _this._scaleY * _this._scale))
        : _this.group.scale.set(
            _this._scaleX * _this._scale,
            _this._scaleY * _this._scale,
            1,
          ),
        _this._3d
          ? _this.anchor && _this.anchor._parent
            ? (_this.anchor.position.copy(_this.group.position),
              _this.anchor.scale.copy(_this.group.scale),
              _this.anchor.quaternion.setFromEuler(_this._rotation),
              (_this.anchor.isDirty = !0))
            : (_this.group.quaternion.setFromEuler(_this._rotation),
              (_this.group.matrixDirty = !0))
          : (_this.group.rotation.z = Math.radians(_this._rotation)),
        _this.firstRender ||
          (_this.group.updateMatrixWorld(!0),
          (_this.firstRender = !0),
          _this.onMountedHook && _this.onMountedHook()),
        (_this.isDirty = !1));
    }),
      (_this.isDirty = !0));
  }
  get width() {
    return this.dimensions.x;
  }
  set width(w) {
    let dirty = Math.abs(this.dimensions.x - w) > Base3D.DIRTY_EPSILON;
    ((this.dimensions.x = w),
      dirty &&
        ((this.isDirty = !0), this.__internalDirty && this.__internalDirty()));
  }
  get height() {
    return this.dimensions.y;
  }
  set height(h) {
    let dirty = Math.abs(this.dimensions.y - h) > Base3D.DIRTY_EPSILON;
    ((this.dimensions.y = h),
      dirty &&
        ((this.isDirty = !0), this.__internalDirty && this.__internalDirty()));
  }
  get x() {
    return this._x;
  }
  set x(v) {
    let dirty = Math.abs(this._x - v) > Base3D.DIRTY_EPSILON;
    ((this._x = v),
      dirty &&
        ((this.isDirty = !0), this.__internalDirty && this.__internalDirty()));
  }
  get y() {
    return this._y;
  }
  set y(v) {
    let dirty = Math.abs(this._y - v) > Base3D.DIRTY_EPSILON;
    ((this._y = v),
      dirty &&
        ((this.isDirty = !0), this.__internalDirty && this.__internalDirty()));
  }
  get z() {
    return this._z;
  }
  set z(v) {
    let dirty = Math.abs(this._z - v) > Base3D.DIRTY_EPSILON;
    ((this._z = v),
      dirty &&
        ((this.isDirty = !0), this.__internalDirty && this.__internalDirty()));
  }
  get scale() {
    return this._scale;
  }
  set scale(v) {
    let dirty = Math.abs(this._scale - v) > Base3D.DIRTY_EPSILON;
    ((this._scale = v),
      dirty &&
        ((this.isDirty = !0), this.__internalDirty && this.__internalDirty()));
  }
  get scaleX() {
    return this._scaleX;
  }
  set scaleX(v) {
    let dirty = Math.abs(this._scaleX - v) > Base3D.DIRTY_EPSILON;
    ((this._scaleX = v),
      dirty &&
        ((this.isDirty = !0), this.__internalDirty && this.__internalDirty()));
  }
  get scaleY() {
    return this._scaleY;
  }
  set scaleY(v) {
    let dirty = Math.abs(this._scaleY - v) > Base3D.DIRTY_EPSILON;
    ((this._scaleY = v),
      dirty &&
        ((this.isDirty = !0), this.__internalDirty && this.__internalDirty()));
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(v) {
    let dirty = Math.abs(this._rotation - v) > Base3D.DIRTY_EPSILON;
    ((this._rotation = v),
      dirty &&
        ((this.isDirty = !0), this.__internalDirty && this.__internalDirty()));
  }
  style(props) {
    for (let prop in props) void 0 !== this[prop] && (this[prop] = props[prop]);
    return this;
  }
  size(w, h) {
    return (
      (this.width = w),
      (this.height = h),
      this.corners && this.corners.update(),
      this
    );
  }
  add($obj) {
    return (
      $obj?.parent?.children?.remove($obj),
      ($obj.parent = this),
      this.group.add($obj.group),
      this.children.push($obj),
      this.isMasked && $obj.mask(this.isMasked, this.maskShader),
      this._3d && !$obj._3d && $obj.enable3D(),
      this.deferred &&
        ($obj.deferRender(!0),
        $obj.anchor && this.anchor && this.anchor.add($obj.anchor)),
      this
    );
  }
  interact(over, click, camera = World.CAMERA, url, label, options) {
    "string" == typeof camera &&
      ((options = label),
      (label = url),
      (url = camera),
      (camera = World.CAMERA));
    const bubble = (e, fn) => {
      e.stopPropagation = function () {
        e._stopProp = !0;
      };
      let parent = this._parent;
      for (; parent; ) {
        if (e._stopProp) return;
        (parent[fn]?.(e), (parent = parent.parent));
      }
    };
    if (
      ((this._onOver = (e) => {
        (bubble(e, "_onChildHover"), over(e));
      }),
      (this._onClick = (e) => {
        (bubble(e, "_onChildClick"), click(e));
      }),
      (this._interactCamera = camera),
      over
        ? this.interaction.add(this, camera)
        : this.interaction.remove(this, camera),
      "string" == typeof url && "string" == typeof label)
    ) {
      const _this = this;
      defer((_) => {
        (!_this.seo && window.GLSEO && GLSEO.objectNode(_this),
          _this.seo && _this.seo.aLink && _this.seo.aLink(url, label, options));
      });
    }
    return this;
  }
  clearInteract() {
    return (
      this._onOver &&
        (this.interaction.remove(this, this._interactCamera),
        (this._onClick = GLUIObject.noop),
        (this._onOver = GLUIObject.noop)),
      this.seo && this.seo.unlink(),
      this
    );
  }
  remove(param) {
    (param &&
      console.warn(
        "GLUIObject.remove removes ITSELF from its parent. use removeChild instead",
      ),
      this.children.slice().forEach((child) => {
        child.remove ? child.remove() : child.destroy && child.destroy();
      }),
      this.clearInteract(),
      this.parent &&
        (this.parent.children
          ? this.parent.children?.remove(this)
          : GLUI.Stage.remove(this)),
      this.mesh._parent
        ? this.group._parent?.remove(this.group)
        : this._3d
          ? GLUI.Scene.remove(this)
          : GLUI.Stage.remove(this));
    let textureShader = this.textureShader;
    for (let key in textureShader.uniforms) {
      let uniform = textureShader.uniforms[key];
      uniform &&
        uniform.value &&
        uniform.value.destroy &&
        uniform.value.destroy();
    }
  }
  create(width, height, map, customCompile) {
    let $obj = $gl(width, height, map, customCompile);
    return (this.add($obj), this._3d && $obj.enable3D(), $obj);
  }
  removeChild(obj) {
    return (this.group.remove(obj.group), this);
  }
  tween(obj, time, ease, delay) {
    return tween(this, obj, time, ease, delay);
  }
  enable3D(style2d) {
    ((this._3d = !0),
      (this.mesh.geometry = GLUIObject.getGeometry(style2d ? "2d" : "3d")),
      (this.mesh.shader.depthTest = !0),
      (this._rotation = new Euler()),
      this.anchor || (this.anchor = new Group()),
      (this.anchor.onMatrixDirty = (_) => {
        _this.isDirty = !0;
      }));
    const _this = this;
    return (
      _this._rotation.onChange((_) => {
        _this.isDirty = !0;
      }),
      this
    );
  }
  loaded() {
    return !0;
  }
  setZ(z) {
    return ((this.mesh.renderOrder = z), this);
  }
  bg(path) {
    if (void 0 !== path)
      return (
        "string" == typeof path
          ? path.length <= 10 && (path.startsWith("0x") || path.startsWith("#"))
            ? (this.colorShader ||
                (this.colorShader = new Shader("GLUIColor", {
                  transparent: !0,
                  uAlpha: { type: "f", value: 1 },
                  uColor: { value: new Color(path) },
                })),
              this.colorShader.set("uColor", new Color(path)),
              this._shader.uniforms.uColor || this.useShader(this.colorShader))
            : ((this.textureShader.uniforms.tMap.value = Utils3D.getTexture(
                path,
                { premultiplyAlpha: !1 },
              )),
              this._shader.uniforms.tMap || this.useShader(this.textureShader))
          : (this._shader.uniforms.tMap || this.useShader(this.textureShader),
            (this._shader.uniforms.tMap.value = path)),
        this
      );
  }
  show() {
    return (
      (this.group.matrixDirty = !0),
      (this.mesh.matrixDirty = !0),
      (this.group.visible = !0),
      this.anchor && (this.anchor.visible = !0),
      this
    );
  }
  hide() {
    return (
      (this.group.visible = !1),
      this.anchor && (this.anchor.visible = !1),
      this
    );
  }
  useShader(shader) {
    return (
      shader &&
        (shader != this.textureShader &&
          shader != this.colorShader &&
          ((shader.uniforms.tMap = this.mesh.shader.uniforms.tMap),
          (shader.uniforms.uAlpha = this.mesh.shader.uniforms.uAlpha)),
        this._3d || (shader.depthTest = !1),
        (shader.transparent = !0)),
      (this._shader = shader),
      (this.mesh.shader = shader || this._shader),
      (shader.mesh = this.mesh),
      this
    );
  }
  depthTest(bool) {
    this.mesh.shader.depthTest = bool;
  }
  childInteract(hover, click) {
    ((this._onChildHover = hover), (this._onChildClick = click));
  }
  useGeometry(geom) {
    return ((this.mesh.geometry = geom), this);
  }
  updateMap(src) {
    this._shader.uniforms.tMap.value =
      "string" == typeof src ? Utils3D.getTexture(src) : src;
  }
  async mask(obj, shader) {
    await defer();
    let dimensions = {},
      p = this._parent;
    for (; p; )
      (p.stageLayoutCapture &&
        ((dimensions.width = p.stageLayoutCapture.width),
        (dimensions.height = p.stageLayoutCapture.height)),
        (p = p._parent));
    (dimensions.width ||
      ((dimensions.width = Stage.width), (dimensions.height = Stage.height)),
      obj.group.updateMatrixWorld(!0),
      obj.mesh.onBeforeRender());
    let box = new Box3().setFromObject(obj.mesh),
      minX = box.min.x / dimensions.width,
      minY = box.max.y / dimensions.height,
      maxX = box.max.x / dimensions.width,
      maxY = -box.min.y / dimensions.height;
    (this.shader &&
      (this.useShader(shader),
      this.shader.addUniforms({
        uMaskValues: { value: new Vector4(minX, minY, maxX, maxY) },
      })),
      obj.hide(),
      this.group.traverse((o) => {
        o.glui && o.glui != this && o.glui.mask(obj, shader);
      }));
  }
  deferRender(parent) {
    ((this.deferred = !0),
      parent || ((this.anchor = new Group()), GLUI.Scene.addDeferred(this)));
  }
  clearTween() {
    return (
      this._mathTweens &&
        this._mathTweens.forEach((t) => {
          t.tween.stop();
        }),
      this
    );
  }
  createCorners() {
    this.corners = new GLUICornerPin(this);
  }
  getAlpha() {
    if (this._gluiParent) {
      let alpha = this._gluiParent.getAlpha();
      return ((this.alpha = alpha), alpha);
    }
    let alpha = this.alpha,
      $parent = this.parent;
    for (; $parent; ) ((alpha *= $parent.alpha), ($parent = $parent.parent));
    return alpha;
  }
  get shader() {
    return this._shader;
  }
  _divFocus() {
    (this._onOver && this._onOver({ action: "over", object: this }),
      this.onDivFocus && this.onDivFocus());
  }
  _divBlur() {
    (this._onOver && this._onOver({ action: "out", object: this }),
      this.onDivBlur && this.onDivBlur());
  }
  _divSelect() {
    (this._onClick && this._onClick({ action: "click", object: this }),
      this.onDivSelect && this.onDivSelect());
  }
  get _parent() {
    return this.parent;
  }
  get interaction() {
    return (this._3d ? GLUI.Scene : GLUI.Stage).interaction;
  }
  forceUpdate() {
    ((this.firstRender = !1), this.mesh.onBeforeRender());
  }
}
!(function () {
  var _geom2d, _geom3d;
  ((GLUIObject.getGeometry = function (type) {
    return "2d" == type
      ? (_geom2d ||
          (_geom2d = new PlaneGeometry(1, 1)).applyMatrix(
            new Matrix4().makeTranslation(0.5, -0.5, 0),
          ),
        _geom2d)
      : (_geom3d || (_geom3d = World.PLANE), _geom3d);
  }),
    (GLUIObject.clear = function () {
      _geom2d = _geom3d = null;
    }),
    (GLUIObject.noop = (_) => {}));
})();
