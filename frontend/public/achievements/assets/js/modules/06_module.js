class Plane {
  constructor(normal, constant) {
    ((this.normal = void 0 !== normal ? normal : new Vector3(1, 0, 0)),
      (this.constant = void 0 !== constant ? constant : 0));
  }
  set(normal, constant) {
    return (this.normal.copy(normal), (this.constant = constant), this);
  }
  setComponents(x, y, z, w) {
    return (this.normal.set(x, y, z), (this.constant = w), this);
  }
  setFromNormalAndCoplanarPoint(normal, point) {
    return (
      this.normal.copy(normal),
      (this.constant = -point.dot(this.normal)),
      this
    );
  }
  setFromCoplanarPoints(a, b, c) {
    let v1 = this.V1 || new Vector3(),
      v2 = this.V2 || new Vector3();
    ((this.V1 = v1), (this.V2 = v2));
    var normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize();
    return (this.setFromNormalAndCoplanarPoint(normal, a), this);
  }
  clone() {
    return new Plane().copy(this);
  }
  copy(plane) {
    return (
      this.normal.copy(plane.normal),
      (this.constant = plane.constant),
      this
    );
  }
  normalize() {
    var inverseNormalLength = 1 / this.normal.length();
    return (
      this.normal.multiplyScalar(inverseNormalLength),
      (this.constant *= inverseNormalLength),
      this
    );
  }
  negate() {
    return ((this.constant *= -1), this.normal.negate(), this);
  }
  distanceToPoint(point) {
    return this.normal.dot(point) + this.constant;
  }
  distanceToSphere(sphere) {
    return this.distanceToPoint(sphere.center) - sphere.radius;
  }
  projectPoint(point, target) {
    return target
      .copy(this.normal)
      .multiplyScalar(-this.distanceToPoint(point))
      .add(point);
  }
  intersectLine(line, target) {
    let v1 = this.V1 || new Vector3();
    this.V1 = v1;
    var direction = line.delta(v1),
      denominator = this.normal.dot(direction);
    if (0 === denominator)
      return 0 === this.distanceToPoint(line.start)
        ? target.copy(line.start)
        : void 0;
    var t = -(line.start.dot(this.normal) + this.constant) / denominator;
    return t < 0 || t > 1
      ? void 0
      : target.copy(direction).multiplyScalar(t).add(line.start);
  }
  intersectsLine(line) {
    var startSign = this.distanceToPoint(line.start),
      endSign = this.distanceToPoint(line.end);
    return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
  }
  intersectsBox(box) {
    return box.intersectsPlane(this);
  }
  intersectsSphere(sphere) {
    return sphere.intersectsPlane(this);
  }
  coplanarPoint(target) {
    return target.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(matrix, optionalNormalMatrix) {
    let v1 = this.V1 || new Vector3();
    this.V1 = v1;
    let m1 = this.M1 || new Matrix3();
    this.M1 = m1;
    var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix),
      referencePoint = this.coplanarPoint(v1).applyMatrix4(matrix),
      normal = this.normal.applyMatrix3(normalMatrix).normalize();
    return ((this.constant = -referencePoint.dot(normal)), this);
  }
  translate(offset) {
    return ((this.constant -= offset.dot(this.normal)), this);
  }
  equals(plane) {
    return plane.normal.equals(this.normal) && plane.constant === this.constant;
  }
}
class Quaternion {
  constructor(x, y, z, w) {
    ((this._x = x || 0),
      (this._y = y || 0),
      (this._z = z || 0),
      (this._w = void 0 !== w ? w : 1),
      (this.isQuaternion = !0));
  }
  get x() {
    return this._x;
  }
  set x(v) {
    if (zUtils3D.LOCAL && isNaN(v)) return console.trace("Quaternion::NaN");
    let dirty = Math.abs(this._x - v) > Base3D.DIRTY_EPSILON;
    ((this._x = v), dirty && this.onChangeCallback());
  }
  get y() {
    return this._y;
  }
  set y(v) {
    if (zUtils3D.LOCAL && isNaN(v)) return console.trace("Quaternion::NaN");
    let dirty = Math.abs(this._y - v) > Base3D.DIRTY_EPSILON;
    ((this._y = v), dirty && this.onChangeCallback());
  }
  get z() {
    return this._z;
  }
  set z(v) {
    if (zUtils3D.LOCAL && isNaN(v)) return console.trace("Quaternion::NaN");
    let dirty = Math.abs(this._z - v) > Base3D.DIRTY_EPSILON;
    ((this._z = v), dirty && this.onChangeCallback());
  }
  get w() {
    return this._w;
  }
  set w(v) {
    if (zUtils3D.LOCAL && isNaN(v)) return console.trace("Quaternion::NaN");
    let dirty = Math.abs(this._w - v) > Base3D.DIRTY_EPSILON;
    ((this._w = v), dirty && this.onChangeCallback());
  }
  clone() {
    return new Quaternion(this._x, this._y, this._z, this._w);
  }
  copy(quaternion) {
    const abs = Math.abs;
    let dirty =
      abs(this._x - quaternion.x) > Base3D.DIRTY_EPSILON ||
      abs(this._y - quaternion.y) > Base3D.DIRTY_EPSILON ||
      abs(this._z - quaternion.z) > Base3D.DIRTY_EPSILON ||
      abs(this._w - quaternion.w) > Base3D.DIRTY_EPSILON;
    return (
      (this._x = quaternion.x),
      (this._y = quaternion.y),
      (this._z = quaternion.z),
      (this._w = quaternion.w),
      dirty && this.onChangeCallback(),
      this
    );
  }
  set(x, y, z, w) {
    const abs = Math.abs;
    let dirty =
      abs(this._x - x) > Base3D.DIRTY_EPSILON ||
      abs(this._y - y) > Base3D.DIRTY_EPSILON ||
      abs(this._z - z) > Base3D.DIRTY_EPSILON ||
      abs(this._w - w) > Base3D.DIRTY_EPSILON;
    ((this._x = x),
      (this._y = y),
      (this._z = z),
      (this._w = w),
      dirty && this.onChangeCallback());
  }
  setFromEuler(euler, update) {
    let x = euler._x,
      y = euler._y,
      z = euler._z,
      order = euler.order,
      cos = Math.cos,
      sin = Math.sin,
      c1 = cos(x / 2),
      c2 = cos(y / 2),
      c3 = cos(z / 2),
      s1 = sin(x / 2),
      s2 = sin(y / 2),
      s3 = sin(z / 2);
    return (
      "XYZ" === order
        ? ((this._x = s1 * c2 * c3 + c1 * s2 * s3),
          (this._y = c1 * s2 * c3 - s1 * c2 * s3),
          (this._z = c1 * c2 * s3 + s1 * s2 * c3),
          (this._w = c1 * c2 * c3 - s1 * s2 * s3))
        : "YXZ" === order
          ? ((this._x = s1 * c2 * c3 + c1 * s2 * s3),
            (this._y = c1 * s2 * c3 - s1 * c2 * s3),
            (this._z = c1 * c2 * s3 - s1 * s2 * c3),
            (this._w = c1 * c2 * c3 + s1 * s2 * s3))
          : "ZXY" === order
            ? ((this._x = s1 * c2 * c3 - c1 * s2 * s3),
              (this._y = c1 * s2 * c3 + s1 * c2 * s3),
              (this._z = c1 * c2 * s3 + s1 * s2 * c3),
              (this._w = c1 * c2 * c3 - s1 * s2 * s3))
            : "ZYX" === order
              ? ((this._x = s1 * c2 * c3 - c1 * s2 * s3),
                (this._y = c1 * s2 * c3 + s1 * c2 * s3),
                (this._z = c1 * c2 * s3 - s1 * s2 * c3),
                (this._w = c1 * c2 * c3 + s1 * s2 * s3))
              : "YZX" === order
                ? ((this._x = s1 * c2 * c3 + c1 * s2 * s3),
                  (this._y = c1 * s2 * c3 + s1 * c2 * s3),
                  (this._z = c1 * c2 * s3 - s1 * s2 * c3),
                  (this._w = c1 * c2 * c3 - s1 * s2 * s3))
                : "XZY" === order &&
                  ((this._x = s1 * c2 * c3 - c1 * s2 * s3),
                  (this._y = c1 * s2 * c3 - s1 * c2 * s3),
                  (this._z = c1 * c2 * s3 + s1 * s2 * c3),
                  (this._w = c1 * c2 * c3 + s1 * s2 * s3)),
      !1 !== update && this.onChangeCallback(),
      this
    );
  }
  setFromAxisAngle(axis, angle) {
    let halfAngle = angle / 2,
      s = Math.sin(halfAngle);
    return (
      (this._x = axis.x * s),
      (this._y = axis.y * s),
      (this._z = axis.z * s),
      (this._w = Math.cos(halfAngle)),
      this.onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(m) {
    let s,
      te = m.elements,
      m11 = te[0],
      m12 = te[4],
      m13 = te[8],
      m21 = te[1],
      m22 = te[5],
      m23 = te[9],
      m31 = te[2],
      m32 = te[6],
      m33 = te[10],
      trace = m11 + m22 + m33;
    return (
      trace > 0
        ? ((s = 0.5 / Math.sqrt(trace + 1)),
          (this._w = 0.25 / s),
          (this._x = (m32 - m23) * s),
          (this._y = (m13 - m31) * s),
          (this._z = (m21 - m12) * s))
        : m11 > m22 && m11 > m33
          ? ((s = 2 * Math.sqrt(1 + m11 - m22 - m33)),
            (this._w = (m32 - m23) / s),
            (this._x = 0.25 * s),
            (this._y = (m12 + m21) / s),
            (this._z = (m13 + m31) / s))
          : m22 > m33
            ? ((s = 2 * Math.sqrt(1 + m22 - m11 - m33)),
              (this._w = (m13 - m31) / s),
              (this._x = (m12 + m21) / s),
              (this._y = 0.25 * s),
              (this._z = (m23 + m32) / s))
            : ((s = 2 * Math.sqrt(1 + m33 - m11 - m22)),
              (this._w = (m21 - m12) / s),
              (this._x = (m13 + m31) / s),
              (this._y = (m23 + m32) / s),
              (this._z = 0.25 * s)),
      this.onChangeCallback(),
      this
    );
  }
  setFromUnitVectors(vFrom, vTo) {
    let v1 = this.V1 || new Vector3();
    this.V1 = v1;
    let r = vFrom.dot(vTo) + 1;
    return (
      r < 1e-6
        ? ((r = 0),
          Math.abs(vFrom.x) > Math.abs(vFrom.z)
            ? v1.set(-vFrom.y, vFrom.x, 0)
            : v1.set(0, -vFrom.z, vFrom.y))
        : v1.crossVectors(vFrom, vTo),
      (this._x = v1.x),
      (this._y = v1.y),
      (this._z = v1.z),
      (this._w = r),
      this.normalize()
    );
  }
  inverse() {
    return this.conjugate();
  }
  conjugate() {
    return (
      (this._x *= -1),
      (this._y *= -1),
      (this._z *= -1),
      this.onChangeCallback(),
      this
    );
  }
  dot(v) {
    const w = void 0 === v._w ? 1 : v._w;
    return this._x * v._x + this._y * v._y + this._z * v._z + this._w * w;
  }
  lengthSq() {
    return (
      this._x * this._x +
      this._y * this._y +
      this._z * this._z +
      this._w * this._w
    );
  }
  length() {
    return Math.sqrt(
      this._x * this._x +
        this._y * this._y +
        this._z * this._z +
        this._w * this._w,
    );
  }
  normalize() {
    let l = this.length();
    return (
      0 === l
        ? ((this._x = 0), (this._y = 0), (this._z = 0), (this._w = 1))
        : ((l = 1 / l),
          (this._x = this._x * l),
          (this._y = this._y * l),
          (this._z = this._z * l),
          (this._w = this._w * l)),
      this.onChangeCallback(),
      this
    );
  }
  multiply(q) {
    return this.multiplyQuaternions(this, q);
  }
  premultiply(q) {
    return this.multiplyQuaternions(q, this);
  }
  multiplyQuaternions(a, b) {
    let qax = a._x,
      qay = a._y,
      qaz = a._z,
      qaw = a._w,
      qbx = b._x,
      qby = b._y,
      qbz = b._z,
      qbw = b._w;
    return (
      (this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby),
      (this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz),
      (this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx),
      (this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz),
      this.onChangeCallback(),
      this
    );
  }
  slerp(qb, t, hz = !0) {
    if (0 === (t = hz ? Math.framerateNormalizeLerpAlpha(t) : Math.clamp(t)))
      return this;
    if (1 === t) return this.copy(qb);
    let x = this._x,
      y = this._y,
      z = this._z,
      w = this._w,
      cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
    if (
      (cosHalfTheta < 0
        ? ((this._w = -qb._w),
          (this._x = -qb._x),
          (this._y = -qb._y),
          (this._z = -qb._z),
          (cosHalfTheta = -cosHalfTheta))
        : this.copy(qb),
      cosHalfTheta >= 1)
    )
      return ((this._w = w), (this._x = x), (this._y = y), (this._z = z), this);
    let sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
    if (Math.abs(sinHalfTheta) < 0.001)
      return (
        (this._w = 0.5 * (w + this._w)),
        (this._x = 0.5 * (x + this._x)),
        (this._y = 0.5 * (y + this._y)),
        (this._z = 0.5 * (z + this._z)),
        this
      );
    let halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta),
      ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
      ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
    return (
      (this._w = w * ratioA + this._w * ratioB),
      (this._x = x * ratioA + this._x * ratioB),
      (this._y = y * ratioA + this._y * ratioB),
      (this._z = z * ratioA + this._z * ratioB),
      this.onChangeCallback(),
      this
    );
  }
  equals(quaternion) {
    return (
      quaternion._x === this._x &&
      quaternion._y === this._y &&
      quaternion._z === this._z &&
      quaternion._w === this._w
    );
  }
  fromArray(array, offset) {
    return (
      void 0 === offset && (offset = 0),
      (this._x = array[offset]),
      (this._y = array[offset + 1]),
      (this._z = array[offset + 2]),
      (this._w = array[offset + 3]),
      this.onChangeCallback(),
      this
    );
  }
  toArray(array, offset) {
    return (
      void 0 === array && (array = []),
      void 0 === offset && (offset = 0),
      (array[offset] = this._x),
      (array[offset + 1] = this._y),
      (array[offset + 2] = this._z),
      (array[offset + 3] = this._w),
      array
    );
  }
  onChange(callback) {
    this.onChangeCallback = callback;
  }
  onChangeCallback() {}
}
class RayManager {
  constructor(origin, direction, near = 0, far = 1 / 0) {
    ((this.ray = new Ray(origin, direction)),
      (this.near = near),
      (this.far = far),
      (this.params = { Mesh: {}, Points: { threshold: 1 } }));
  }
  set(origin, direction) {
    return (this.ray.set(origin, direction), this);
  }
  setFromCamera(coords, camera) {
    camera.isPerspective
      ? (this.ray.origin.setFromMatrixPosition(camera.matrixWorld),
        this.ray.direction
          .set(coords.x, coords.y, 0.5)
          .unproject(camera)
          .sub(this.ray.origin)
          .normalize())
      : (this.ray.origin
          .set(
            coords.x,
            coords.y,
            (camera.near + camera.far) / (camera.near - camera.far),
          )
          .unproject(camera),
        this.ray.direction
          .set(0, 0, -1)
          .transformDirection(camera.matrixWorld));
  }
  _ascSort(a, b) {
    return a.distance - b.distance;
  }
  _intersectObject(object, raycaster, intersects, recursive, forceAllVisible) {
    if (
      (!1 !== object.visible || forceAllVisible) &&
      (object.raycast && object.raycast(raycaster, intersects),
      !0 === recursive)
    ) {
      let children = object.children;
      for (let i = 0, l = children.length; i < l; i++)
        this._intersectObject(children[i], raycaster, intersects, !0);
    }
  }
  intersectObject(object, recursive, optionalTarget, forceAllVisible) {
    let intersects = optionalTarget || [];
    return (
      this._intersectObject(
        object,
        this,
        intersects,
        recursive,
        forceAllVisible,
      ),
      intersects.sort(this._ascSort),
      intersects
    );
  }
  intersectObjects(objects, recursive, optionalTarget) {
    let intersects = optionalTarget || [];
    for (let i = 0, l = objects.length; i < l; i++)
      this._intersectObject(objects[i], this, intersects, recursive);
    return (intersects.sort(this._ascSort), intersects);
  }
}
class Ray {
  constructor(origin = new Vector3(), direction = new Vector3()) {
    ((this.origin = origin), (this.direction = direction));
  }
  set(origin, direction) {
    return (this.origin.copy(origin), this.direction.copy(direction), this);
  }
  clone() {
    return new Ray().copy(this);
  }
  copy(ray) {
    return (
      this.origin.copy(ray.origin),
      this.direction.copy(ray.direction),
      this
    );
  }
  at(t, target = new Vector3()) {
    return target.copy(this.direction).multiplyScalar(t).add(this.origin);
  }
  lookAt(v) {
    return (this.direction.copy(v).sub(this.origin).normalize(), this);
  }
  recast(t) {
    let v1 = this.V1 || new Vector3();
    ((this.V1 = v1), this.origin.copy(this.at(t, v1)));
  }
  closestPointToPoint(point, target = new Vector3()) {
    target.subVectors(point, this.origin);
    let directionDistance = target.dot(this.direction);
    return directionDistance < 0
      ? target.copy(this.origin)
      : target
          .copy(this.direction)
          .multiplyScalar(directionDistance)
          .add(this.origin);
  }
  distanceToPoint(point) {
    return Math.sqrt(this.distanceSqToPoint(point));
  }
  distanceSqToPoint(point) {
    let v1 = this.V1 || new Vector3();
    this.V1 = v1;
    let directionDistance = v1
      .subVectors(point, this.origin)
      .dot(this.direction);
    return directionDistance < 0
      ? this.origin.distanceToSquared(point)
      : (v1
          .copy(this.direction)
          .multiplyScalar(directionDistance)
          .add(this.origin),
        v1.distanceToSquared(point));
  }
  distanceSqToSegment(v0, v1, optionalPointOnRay, optionalPointOnSegment) {
    let segCenter = this.V1 || new Vector3(),
      segDir = this.V2 || new Vector3(),
      diff = this.V3 || new Vector3();
    ((this.V1 = segCenter),
      (this.V2 = segDir),
      (this.V3 = diff),
      segCenter.copy(v0).add(v1).multiplyScalar(0.5),
      segDir.copy(v1).sub(v0).normalize(),
      diff.copy(this.origin).sub(segCenter));
    let s0,
      s1,
      sqrDist,
      extDet,
      segExtent = 0.5 * v0.distanceTo(v1),
      a01 = -this.direction.dot(segDir),
      b0 = diff.dot(this.direction),
      b1 = -diff.dot(segDir),
      c = diff.lengthSq(),
      det = Math.abs(1 - a01 * a01);
    if (det > 0)
      if (
        ((s0 = a01 * b1 - b0),
        (s1 = a01 * b0 - b1),
        (extDet = segExtent * det),
        s0 >= 0)
      )
        if (s1 >= -extDet)
          if (s1 <= extDet) {
            let invDet = 1 / det;
            ((s0 *= invDet),
              (s1 *= invDet),
              (sqrDist =
                s0 * (s0 + a01 * s1 + 2 * b0) +
                s1 * (a01 * s0 + s1 + 2 * b1) +
                c));
          } else
            ((s1 = segExtent),
              (s0 = Math.max(0, -(a01 * s1 + b0))),
              (sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c));
        else
          ((s1 = -segExtent),
            (s0 = Math.max(0, -(a01 * s1 + b0))),
            (sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c));
      else
        s1 <= -extDet
          ? ((s0 = Math.max(0, -(-a01 * segExtent + b0))),
            (s1 =
              s0 > 0
                ? -segExtent
                : Math.min(Math.max(-segExtent, -b1), segExtent)),
            (sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c))
          : s1 <= extDet
            ? ((s0 = 0),
              (s1 = Math.min(Math.max(-segExtent, -b1), segExtent)),
              (sqrDist = s1 * (s1 + 2 * b1) + c))
            : ((s0 = Math.max(0, -(a01 * segExtent + b0))),
              (s1 =
                s0 > 0
                  ? segExtent
                  : Math.min(Math.max(-segExtent, -b1), segExtent)),
              (sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c));
    else
      ((s1 = a01 > 0 ? -segExtent : segExtent),
        (s0 = Math.max(0, -(a01 * s1 + b0))),
        (sqrDist = -s0 * s0 + s1 * (s1 + 2 * b1) + c));
    return (
      optionalPointOnRay &&
        optionalPointOnRay
          .copy(this.direction)
          .multiplyScalar(s0)
          .add(this.origin),
      optionalPointOnSegment &&
        optionalPointOnSegment.copy(segDir).multiplyScalar(s1).add(segCenter),
      sqrDist
    );
  }
  intersectSphere(sphere, target) {
    let v1 = this.V1 || new Vector3();
    ((this.V1 = v1), v1.subVectors(sphere.center, this.origin));
    let tca = v1.dot(this.direction),
      d2 = v1.dot(v1) - tca * tca,
      radius2 = sphere.radius * sphere.radius;
    if (d2 > radius2) return null;
    let thc = Math.sqrt(radius2 - d2),
      t0 = tca - thc,
      t1 = tca + thc;
    return t0 < 0 && t1 < 0
      ? null
      : t0 < 0
        ? this.at(t1, target)
        : this.at(t0, target);
  }
  intersectsSphere(sphere) {
    return (
      this.distanceSqToPoint(sphere.center) <= sphere.radius * sphere.radius
    );
  }
  distanceToPlane(plane) {
    let denominator = plane.normal.dot(this.direction);
    if (0 === denominator)
      return 0 === plane.distanceToPoint(this.origin) ? 0 : null;
    let t = -(this.origin.dot(plane.normal) + plane.constant) / denominator;
    return t >= 0 ? t : null;
  }
  intersectPlane(plane, target) {
    let t = this.distanceToPlane(plane);
    return null === t ? null : this.at(t, target);
  }
  intersectsPlane(plane) {
    let distToPoint = plane.distanceToPoint(this.origin);
    return (
      0 === distToPoint || plane.normal.dot(this.direction) * distToPoint < 0
    );
  }
  intersectBox(box, target) {
    let tmin,
      tmax,
      tymin,
      tymax,
      tzmin,
      tzmax,
      invdirx = 1 / this.direction.x,
      invdiry = 1 / this.direction.y,
      invdirz = 1 / this.direction.z,
      origin = this.origin;
    return (
      invdirx >= 0
        ? ((tmin = (box.min.x - origin.x) * invdirx),
          (tmax = (box.max.x - origin.x) * invdirx))
        : ((tmin = (box.max.x - origin.x) * invdirx),
          (tmax = (box.min.x - origin.x) * invdirx)),
      invdiry >= 0
        ? ((tymin = (box.min.y - origin.y) * invdiry),
          (tymax = (box.max.y - origin.y) * invdiry))
        : ((tymin = (box.max.y - origin.y) * invdiry),
          (tymax = (box.min.y - origin.y) * invdiry)),
      tmin > tymax || tymin > tmax
        ? null
        : ((tymin > tmin || tmin != tmin) && (tmin = tymin),
          (tymax < tmax || tmax != tmax) && (tmax = tymax),
          invdirz >= 0
            ? ((tzmin = (box.min.z - origin.z) * invdirz),
              (tzmax = (box.max.z - origin.z) * invdirz))
            : ((tzmin = (box.max.z - origin.z) * invdirz),
              (tzmax = (box.min.z - origin.z) * invdirz)),
          tmin > tzmax || tzmin > tmax
            ? null
            : ((tzmin > tmin || tmin != tmin) && (tmin = tzmin),
              (tzmax < tmax || tmax != tmax) && (tmax = tzmax),
              tmax < 0 ? null : this.at(tmin >= 0 ? tmin : tmax, target)))
    );
  }
  intersectsBox(box) {
    let v = this.V1 || new Vector3();
    return ((this.V1 = v), null !== this.intersectBox(box, v));
  }
  intersectsTriangle(a, b, c, backfaceCulling, target) {
    let diff = this.V1 || new Vector3(),
      edge1 = this.V2 || new Vector3(),
      edge2 = this.V3 || new Vector3(),
      normal = this.V4 || new Vector3();
    ((this.V1 = diff),
      (this.V2 = edge1),
      (this.V3 = edge2),
      (this.V4 = normal),
      edge1.subVectors(b, a),
      edge2.subVectors(c, a),
      normal.crossVectors(edge1, edge2));
    let sign,
      DdN = this.direction.dot(normal);
    if (DdN > 0) {
      if (backfaceCulling) return null;
      sign = 1;
    } else {
      if (!(DdN < 0)) return null;
      ((sign = -1), (DdN = -DdN));
    }
    diff.subVectors(this.origin, a);
    let DdQxE2 = sign * this.direction.dot(edge2.crossVectors(diff, edge2));
    if (DdQxE2 < 0) return null;
    let DdE1xQ = sign * this.direction.dot(edge1.cross(diff));
    if (DdE1xQ < 0) return null;
    if (DdQxE2 + DdE1xQ > DdN) return null;
    let QdN = -sign * diff.dot(normal);
    return QdN < 0 ? null : this.at(QdN / DdN, target);
  }
  applyMatrix4(matrix4) {
    return (
      this.origin.applyMatrix4(matrix4),
      this.direction.transformDirection(matrix4),
      this
    );
  }
  equals(ray) {
    return (
      ray.origin.equals(this.origin) && ray.direction.equals(this.direction)
    );
  }
}
