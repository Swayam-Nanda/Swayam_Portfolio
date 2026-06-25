class Frustum {
  constructor(p0, p1, p2, p3, p4, p5) {
    this.planes = [
      void 0 !== p0 ? p0 : new Plane(),
      void 0 !== p1 ? p1 : new Plane(),
      void 0 !== p2 ? p2 : new Plane(),
      void 0 !== p3 ? p3 : new Plane(),
      void 0 !== p4 ? p4 : new Plane(),
      void 0 !== p5 ? p5 : new Plane(),
    ];
  }
  set(p0, p1, p2, p3, p4, p5) {
    let planes = this.planes;
    return (
      planes[0].copy(p0),
      planes[1].copy(p1),
      planes[2].copy(p2),
      planes[3].copy(p3),
      planes[4].copy(p4),
      planes[5].copy(p5),
      this
    );
  }
  clone() {
    return new Frustum().copy(this);
  }
  copy(frustum) {
    let planes = this.planes;
    for (let i = 0; i < 6; i++) planes[i].copy(frustum.planes[i]);
    return this;
  }
  setFromMatrix(m) {
    let planes = this.planes,
      me = m.elements,
      me0 = me[0],
      me1 = me[1],
      me2 = me[2],
      me3 = me[3],
      me4 = me[4],
      me5 = me[5],
      me6 = me[6],
      me7 = me[7],
      me8 = me[8],
      me9 = me[9],
      me10 = me[10],
      me11 = me[11],
      me12 = me[12],
      me13 = me[13],
      me14 = me[14],
      me15 = me[15];
    return (
      planes[0]
        .setComponents(me3 - me0, me7 - me4, me11 - me8, me15 - me12)
        .normalize(),
      planes[1]
        .setComponents(me3 + me0, me7 + me4, me11 + me8, me15 + me12)
        .normalize(),
      planes[2]
        .setComponents(me3 + me1, me7 + me5, me11 + me9, me15 + me13)
        .normalize(),
      planes[3]
        .setComponents(me3 - me1, me7 - me5, me11 - me9, me15 - me13)
        .normalize(),
      planes[4]
        .setComponents(me3 - me2, me7 - me6, me11 - me10, me15 - me14)
        .normalize(),
      planes[5]
        .setComponents(me3 + me2, me7 + me6, me11 + me10, me15 + me14)
        .normalize(),
      this
    );
  }
  setFromCamera(camera) {
    let matrix = this.M1 || new Matrix4();
    return (
      (this.M1 = matrix),
      matrix.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
      ),
      this.setFromMatrix(matrix)
    );
  }
  intersectsObject(object, setAsBoolean = !0) {
    let sphere = this.S1 || new Sphere();
    this.S1 = sphere;
    let geometry = object.geometry;
    return (
      !!geometry &&
      (null === geometry.boundingSphere && geometry.computeBoundingSphere(),
      sphere.copy(geometry.boundingSphere).applyMatrix4(object.matrixWorld),
      this.intersectsSphere(sphere, setAsBoolean))
    );
  }
  intersectsSphere(sphere, setAsBoolean = !0) {
    let planes = this.planes,
      center = sphere.center,
      negRadius = -sphere.radius,
      insides = 0;
    for (let i = 0; i < 6; i++) {
      let distance = planes[i].distanceToPoint(center);
      if (distance < negRadius) return !setAsBoolean && -1;
      !setAsBoolean && distance >= 0 && insides++;
    }
    return !!setAsBoolean || (6 === insides ? 1 : 0);
  }
  intersectsBox(box) {
    let p1 = this.V1 || new Vector3(),
      p2 = this.V2 || new Vector3();
    ((this.V1 = p1), (this.V2 = p2));
    let planes = this.planes;
    for (let i = 0; i < 6; i++) {
      let plane = planes[i];
      ((p1.x = plane.normal.x > 0 ? box.min.x : box.max.x),
        (p2.x = plane.normal.x > 0 ? box.max.x : box.min.x),
        (p1.y = plane.normal.y > 0 ? box.min.y : box.max.y),
        (p2.y = plane.normal.y > 0 ? box.max.y : box.min.y),
        (p1.z = plane.normal.z > 0 ? box.min.z : box.max.z),
        (p2.z = plane.normal.z > 0 ? box.max.z : box.min.z));
      let d1 = plane.distanceToPoint(p1),
        d2 = plane.distanceToPoint(p2);
      if (d1 < 0 && d2 < 0) return !1;
    }
    return !0;
  }
  containsPoint(point) {
    let planes = this.planes;
    for (let i = 0; i < 6; i++)
      if (planes[i].distanceToPoint(point) < 0) return !1;
    return !0;
  }
}
class Line3 {
  constructor(start = new Vector3(), end = new Vector3()) {
    ((this.start = start), (this.end = end));
  }
  set(start, end) {
    return (this.start.copy(start), this.end.copy(end), this);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(line) {
    return (this.start.copy(line.start), this.end.copy(line.end), this);
  }
  getCenter(target = new Vector3()) {
    return target.addVectors(this.start, this.end).multiplyScalar(0.5);
  }
  delta(target = new Vector3()) {
    return target.subVectors(this.end, this.start);
  }
  distanceSq() {
    return this.start.distanceToSquared(this.end);
  }
  distance() {
    return this.start.distanceTo(this.end);
  }
  at(t, target = new Vector3()) {
    return this.delta(target).multiplyScalar(t).add(this.start);
  }
  closestPointToPointParameter(point, clampToLine) {
    let startP = this.V1 || new Vector3(),
      startEnd = this.V2 || new Vector3();
    ((this.V1 = startP),
      (this.V2 = startEnd),
      startP.subVectors(point, this.start),
      startEnd.subVectors(this.end, this.start));
    let startEnd2 = startEnd.dot(startEnd),
      t = startEnd.dot(startP) / startEnd2;
    return (clampToLine && (t = Math.clamp(t, 0, 1)), t);
  }
  closestPointToPoint(point, clampToLine, target = new Vector3()) {
    let t = this.closestPointToPointParameter(point, clampToLine);
    return this.delta(target).multiplyScalar(t).add(this.start);
  }
  applyMatrix4(matrix) {
    return (
      this.start.applyMatrix4(matrix),
      this.end.applyMatrix4(matrix),
      this
    );
  }
  equals(line) {
    return line.start.equals(this.start) && line.end.equals(this.end);
  }
}
class Matrix3 {
  constructor() {
    this.elements = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  }
  set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
    let te = this.elements;
    return (
      (te[0] = n11),
      (te[1] = n21),
      (te[2] = n31),
      (te[3] = n12),
      (te[4] = n22),
      (te[5] = n32),
      (te[6] = n13),
      (te[7] = n23),
      (te[8] = n33),
      this
    );
  }
  identity() {
    return (this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this);
  }
  clone() {
    return new Matrix3().fromArray(this.elements);
  }
  copy(m) {
    let te = this.elements,
      me = m.elements;
    return (
      (te[0] = me[0]),
      (te[1] = me[1]),
      (te[2] = me[2]),
      (te[3] = me[3]),
      (te[4] = me[4]),
      (te[5] = me[5]),
      (te[6] = me[6]),
      (te[7] = me[7]),
      (te[8] = me[8]),
      this
    );
  }
  setFromMatrix4(m) {
    let me = m.elements;
    return (
      this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]),
      this
    );
  }
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }
  premultiply(m) {
    return this.multiplyMatrices(m, this);
  }
  multiplyMatrices(a, b) {
    let ae = a.elements,
      be = b.elements,
      te = this.elements,
      a11 = ae[0],
      a12 = ae[3],
      a13 = ae[6],
      a21 = ae[1],
      a22 = ae[4],
      a23 = ae[7],
      a31 = ae[2],
      a32 = ae[5],
      a33 = ae[8],
      b11 = be[0],
      b12 = be[3],
      b13 = be[6],
      b21 = be[1],
      b22 = be[4],
      b23 = be[7],
      b31 = be[2],
      b32 = be[5],
      b33 = be[8];
    return (
      (te[0] = a11 * b11 + a12 * b21 + a13 * b31),
      (te[3] = a11 * b12 + a12 * b22 + a13 * b32),
      (te[6] = a11 * b13 + a12 * b23 + a13 * b33),
      (te[1] = a21 * b11 + a22 * b21 + a23 * b31),
      (te[4] = a21 * b12 + a22 * b22 + a23 * b32),
      (te[7] = a21 * b13 + a22 * b23 + a23 * b33),
      (te[2] = a31 * b11 + a32 * b21 + a33 * b31),
      (te[5] = a31 * b12 + a32 * b22 + a33 * b32),
      (te[8] = a31 * b13 + a32 * b23 + a33 * b33),
      this
    );
  }
  multiplyScalar(s) {
    let te = this.elements;
    return (
      (te[0] *= s),
      (te[3] *= s),
      (te[6] *= s),
      (te[1] *= s),
      (te[4] *= s),
      (te[7] *= s),
      (te[2] *= s),
      (te[5] *= s),
      (te[8] *= s),
      this
    );
  }
  determinant() {
    let te = this.elements,
      a = te[0],
      b = te[1],
      c = te[2],
      d = te[3],
      e = te[4],
      f = te[5],
      g = te[6],
      h = te[7],
      i = te[8];
    return (
      a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g
    );
  }
  getInverse(matrix, throwOnDegenerate) {
    let me = matrix.elements,
      te = this.elements,
      n11 = me[0],
      n21 = me[1],
      n31 = me[2],
      n12 = me[3],
      n22 = me[4],
      n32 = me[5],
      n13 = me[6],
      n23 = me[7],
      n33 = me[8],
      t11 = n33 * n22 - n32 * n23,
      t12 = n32 * n13 - n33 * n12,
      t13 = n23 * n12 - n22 * n13,
      det = n11 * t11 + n21 * t12 + n31 * t13;
    if (0 === det) {
      if (!0 === throwOnDegenerate)
        throw new Error(".getInverse() can't invert matrix, determinant is 0");
      return this.identity();
    }
    let detInv = 1 / det;
    return (
      (te[0] = t11 * detInv),
      (te[1] = (n31 * n23 - n33 * n21) * detInv),
      (te[2] = (n32 * n21 - n31 * n22) * detInv),
      (te[3] = t12 * detInv),
      (te[4] = (n33 * n11 - n31 * n13) * detInv),
      (te[5] = (n31 * n12 - n32 * n11) * detInv),
      (te[6] = t13 * detInv),
      (te[7] = (n21 * n13 - n23 * n11) * detInv),
      (te[8] = (n22 * n11 - n21 * n12) * detInv),
      this
    );
  }
  transpose() {
    let tmp,
      m = this.elements;
    return (
      (tmp = m[1]),
      (m[1] = m[3]),
      (m[3] = tmp),
      (tmp = m[2]),
      (m[2] = m[6]),
      (m[6] = tmp),
      (tmp = m[5]),
      (m[5] = m[7]),
      (m[7] = tmp),
      this
    );
  }
  getNormalMatrix(matrix4) {
    return this.setFromMatrix4(matrix4).getInverse(this).transpose();
  }
  setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {
    let c = Math.cos(rotation),
      s = Math.sin(rotation);
    this.set(
      sx * c,
      sx * s,
      -sx * (c * cx + s * cy) + cx + tx,
      -sy * s,
      sy * c,
      -sy * (-s * cx + c * cy) + cy + ty,
      0,
      0,
      1,
    );
  }
  scale(sx, sy) {
    let te = this.elements;
    return (
      (te[0] *= sx),
      (te[3] *= sx),
      (te[6] *= sx),
      (te[1] *= sy),
      (te[4] *= sy),
      (te[7] *= sy),
      this
    );
  }
  rotate(theta) {
    let c = Math.cos(theta),
      s = Math.sin(theta),
      te = this.elements,
      a11 = te[0],
      a12 = te[3],
      a13 = te[6],
      a21 = te[1],
      a22 = te[4],
      a23 = te[7];
    return (
      (te[0] = c * a11 + s * a21),
      (te[3] = c * a12 + s * a22),
      (te[6] = c * a13 + s * a23),
      (te[1] = -s * a11 + c * a21),
      (te[4] = -s * a12 + c * a22),
      (te[7] = -s * a13 + c * a23),
      this
    );
  }
  translate(tx, ty) {
    let te = this.elements;
    return (
      (te[0] += tx * te[2]),
      (te[3] += tx * te[5]),
      (te[6] += tx * te[8]),
      (te[1] += ty * te[2]),
      (te[4] += ty * te[5]),
      (te[7] += ty * te[8]),
      this
    );
  }
  equals(matrix) {
    let te = this.elements,
      me = matrix.elements;
    for (let i = 0; i < 9; i++) if (te[i] !== me[i]) return !1;
    return !0;
  }
  fromArray(array, offset) {
    void 0 === offset && (offset = 0);
    for (let i = 0; i < 9; i++) this.elements[i] = array[i + offset];
    return this;
  }
  toArray(array, offset) {
    (void 0 === array && (array = []), void 0 === offset && (offset = 0));
    let te = this.elements;
    return (
      (array[offset] = te[0]),
      (array[offset + 1] = te[1]),
      (array[offset + 2] = te[2]),
      (array[offset + 3] = te[3]),
      (array[offset + 4] = te[4]),
      (array[offset + 5] = te[5]),
      (array[offset + 6] = te[6]),
      (array[offset + 7] = te[7]),
      (array[offset + 8] = te[8]),
      array
    );
  }
  applyToBufferAttribute(attribute) {
    let v1 = this.V1 || new Vector3();
    this.V1 = v1;
    for (let i = 0, l = attribute.count; i < l; i++)
      ((v1.x = attribute.array[3 * i + 0]),
        (v1.y = attribute.array[3 * i + 1]),
        (v1.z = attribute.array[3 * i + 2]),
        v1.applyMatrix3(this),
        (attribute.array[3 * i + 0] = v1.x),
        (attribute.array[3 * i + 1] = v1.y),
        (attribute.array[3 * i + 2] = v1.z));
    return attribute;
  }
}
class Matrix4 {
  constructor() {
    Matrix4.allocate
      ? Matrix4.allocate(this)
      : (this.elements = new Float32Array([
          1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
        ]));
  }
  set(
    n11,
    n12,
    n13,
    n14,
    n21,
    n22,
    n23,
    n24,
    n31,
    n32,
    n33,
    n34,
    n41,
    n42,
    n43,
    n44,
  ) {
    let te = this.elements;
    return (
      (te[0] = n11),
      (te[4] = n12),
      (te[8] = n13),
      (te[12] = n14),
      (te[1] = n21),
      (te[5] = n22),
      (te[9] = n23),
      (te[13] = n24),
      (te[2] = n31),
      (te[6] = n32),
      (te[10] = n33),
      (te[14] = n34),
      (te[3] = n41),
      (te[7] = n42),
      (te[11] = n43),
      (te[15] = n44),
      this
    );
  }
  identity() {
    return (this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this);
  }
  clone() {
    return new Matrix4().fromArray(this.elements);
  }
  copy(m) {
    let te = this.elements,
      me = m.elements;
    return (
      (te[0] = me[0]),
      (te[1] = me[1]),
      (te[2] = me[2]),
      (te[3] = me[3]),
      (te[4] = me[4]),
      (te[5] = me[5]),
      (te[6] = me[6]),
      (te[7] = me[7]),
      (te[8] = me[8]),
      (te[9] = me[9]),
      (te[10] = me[10]),
      (te[11] = me[11]),
      (te[12] = me[12]),
      (te[13] = me[13]),
      (te[14] = me[14]),
      (te[15] = me[15]),
      this
    );
  }
  copyPosition(m) {
    let te = this.elements,
      me = m.elements;
    return ((te[12] = me[12]), (te[13] = me[13]), (te[14] = me[14]), this);
  }
  extractBasis(xAxis, yAxis, zAxis) {
    return (
      xAxis.setFromMatrixColumn(this, 0),
      yAxis.setFromMatrixColumn(this, 1),
      zAxis.setFromMatrixColumn(this, 2),
      this
    );
  }
  makeBasis(xAxis, yAxis, zAxis) {
    return (
      this.set(
        xAxis.x,
        yAxis.x,
        zAxis.x,
        0,
        xAxis.y,
        yAxis.y,
        zAxis.y,
        0,
        xAxis.z,
        yAxis.z,
        zAxis.z,
        0,
        0,
        0,
        0,
        1,
      ),
      this
    );
  }
  extractRotation(m) {
    let v1 = this.V1 || new Vector3();
    this.V1 = v1;
    let te = this.elements,
      me = m.elements,
      scaleX = 1 / v1.setFromMatrixColumn(m, 0).length(),
      scaleY = 1 / v1.setFromMatrixColumn(m, 1).length(),
      scaleZ = 1 / v1.setFromMatrixColumn(m, 2).length();
    return (
      (te[0] = me[0] * scaleX),
      (te[1] = me[1] * scaleX),
      (te[2] = me[2] * scaleX),
      (te[4] = me[4] * scaleY),
      (te[5] = me[5] * scaleY),
      (te[6] = me[6] * scaleY),
      (te[8] = me[8] * scaleZ),
      (te[9] = me[9] * scaleZ),
      (te[10] = me[10] * scaleZ),
      this
    );
  }
  makeRotationFromEuler(euler) {
    let te = this.elements,
      x = euler.x,
      y = euler.y,
      z = euler.z,
      a = Math.cos(x),
      b = Math.sin(x),
      c = Math.cos(y),
      d = Math.sin(y),
      e = Math.cos(z),
      f = Math.sin(z);
    if ("XYZ" === euler.order) {
      let ae = a * e,
        af = a * f,
        be = b * e,
        bf = b * f;
      ((te[0] = c * e),
        (te[4] = -c * f),
        (te[8] = d),
        (te[1] = af + be * d),
        (te[5] = ae - bf * d),
        (te[9] = -b * c),
        (te[2] = bf - ae * d),
        (te[6] = be + af * d),
        (te[10] = a * c));
    } else if ("YXZ" === euler.order) {
      let ce = c * e,
        cf = c * f,
        de = d * e,
        df = d * f;
      ((te[0] = ce + df * b),
        (te[4] = de * b - cf),
        (te[8] = a * d),
        (te[1] = a * f),
        (te[5] = a * e),
        (te[9] = -b),
        (te[2] = cf * b - de),
        (te[6] = df + ce * b),
        (te[10] = a * c));
    } else if ("ZXY" === euler.order) {
      let ce = c * e,
        cf = c * f,
        de = d * e,
        df = d * f;
      ((te[0] = ce - df * b),
        (te[4] = -a * f),
        (te[8] = de + cf * b),
        (te[1] = cf + de * b),
        (te[5] = a * e),
        (te[9] = df - ce * b),
        (te[2] = -a * d),
        (te[6] = b),
        (te[10] = a * c));
    } else if ("ZYX" === euler.order) {
      let ae = a * e,
        af = a * f,
        be = b * e,
        bf = b * f;
      ((te[0] = c * e),
        (te[4] = be * d - af),
        (te[8] = ae * d + bf),
        (te[1] = c * f),
        (te[5] = bf * d + ae),
        (te[9] = af * d - be),
        (te[2] = -d),
        (te[6] = b * c),
        (te[10] = a * c));
    } else if ("YZX" === euler.order) {
      let ac = a * c,
        ad = a * d,
        bc = b * c,
        bd = b * d;
      ((te[0] = c * e),
        (te[4] = bd - ac * f),
        (te[8] = bc * f + ad),
        (te[1] = f),
        (te[5] = a * e),
        (te[9] = -b * e),
        (te[2] = -d * e),
        (te[6] = ad * f + bc),
        (te[10] = ac - bd * f));
    } else if ("XZY" === euler.order) {
      let ac = a * c,
        ad = a * d,
        bc = b * c,
        bd = b * d;
      ((te[0] = c * e),
        (te[4] = -f),
        (te[8] = d * e),
        (te[1] = ac * f + bd),
        (te[5] = a * e),
        (te[9] = ad * f - bc),
        (te[2] = bc * f - ad),
        (te[6] = b * e),
        (te[10] = bd * f + ac));
    }
    return (
      (te[3] = 0),
      (te[7] = 0),
      (te[11] = 0),
      (te[12] = 0),
      (te[13] = 0),
      (te[14] = 0),
      (te[15] = 1),
      this
    );
  }
  makeRotationFromQuaternion(q) {
    let te = this.elements,
      x = q._x,
      y = q._y,
      z = q._z,
      w = q._w,
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,
      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2;
    return (
      (te[0] = 1 - (yy + zz)),
      (te[4] = xy - wz),
      (te[8] = xz + wy),
      (te[1] = xy + wz),
      (te[5] = 1 - (xx + zz)),
      (te[9] = yz - wx),
      (te[2] = xz - wy),
      (te[6] = yz + wx),
      (te[10] = 1 - (xx + yy)),
      (te[3] = 0),
      (te[7] = 0),
      (te[11] = 0),
      (te[12] = 0),
      (te[13] = 0),
      (te[14] = 0),
      (te[15] = 1),
      this
    );
  }
  lookAt(eye, target, up) {
    let x = this.V1 || new Vector3(),
      y = this.V2 || new Vector3(),
      z = this.V3 || new Vector3();
    ((this.V1 = x), (this.V2 = y), (this.V3 = z));
    let te = this.elements;
    return (
      z.subVectors(eye, target),
      0 === z.lengthSq() && (z.z = 1),
      z.normalize(),
      x.crossVectors(up, z),
      0 === x.lengthSq() &&
        (1 === Math.abs(up.z) ? (z.x += 1e-4) : (z.z += 1e-4),
        z.normalize(),
        x.crossVectors(up, z)),
      x.normalize(),
      y.crossVectors(z, x),
      (te[0] = x.x),
      (te[4] = y.x),
      (te[8] = z.x),
      (te[1] = x.y),
      (te[5] = y.y),
      (te[9] = z.y),
      (te[2] = x.z),
      (te[6] = y.z),
      (te[10] = z.z),
      this
    );
  }
  multiply(m) {
    return this.multiplyMatrices(this, m);
  }
  premultiply(m) {
    return this.multiplyMatrices(m, this);
  }
  multiplyMatrices(ae, be) {
    if (MatrixWasm.multiply) return (MatrixWasm.multiply(ae, be, this), this);
    let a = ae.elements,
      b = be.elements,
      out = this.elements,
      a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3],
      a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7],
      a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11],
      a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15],
      b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
    return (
      (out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30),
      (out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31),
      (out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32),
      (out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33),
      (b0 = b[4]),
      (b1 = b[5]),
      (b2 = b[6]),
      (b3 = b[7]),
      (out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30),
      (out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31),
      (out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32),
      (out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33),
      (b0 = b[8]),
      (b1 = b[9]),
      (b2 = b[10]),
      (b3 = b[11]),
      (out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30),
      (out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31),
      (out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32),
      (out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33),
      (b0 = b[12]),
      (b1 = b[13]),
      (b2 = b[14]),
      (b3 = b[15]),
      (out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30),
      (out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31),
      (out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32),
      (out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33),
      this
    );
  }
  multiplyScalar(s) {
    let te = this.elements;
    return (
      (te[0] *= s),
      (te[4] *= s),
      (te[8] *= s),
      (te[12] *= s),
      (te[1] *= s),
      (te[5] *= s),
      (te[9] *= s),
      (te[13] *= s),
      (te[2] *= s),
      (te[6] *= s),
      (te[10] *= s),
      (te[14] *= s),
      (te[3] *= s),
      (te[7] *= s),
      (te[11] *= s),
      (te[15] *= s),
      this
    );
  }
  determinant() {
    let te = this.elements,
      n11 = te[0],
      n12 = te[4],
      n13 = te[8],
      n14 = te[12],
      n21 = te[1],
      n22 = te[5],
      n23 = te[9],
      n24 = te[13],
      n31 = te[2],
      n32 = te[6],
      n33 = te[10],
      n34 = te[14];
    return (
      te[3] *
        (+n14 * n23 * n32 -
          n13 * n24 * n32 -
          n14 * n22 * n33 +
          n12 * n24 * n33 +
          n13 * n22 * n34 -
          n12 * n23 * n34) +
      te[7] *
        (+n11 * n23 * n34 -
          n11 * n24 * n33 +
          n14 * n21 * n33 -
          n13 * n21 * n34 +
          n13 * n24 * n31 -
          n14 * n23 * n31) +
      te[11] *
        (+n11 * n24 * n32 -
          n11 * n22 * n34 -
          n14 * n21 * n32 +
          n12 * n21 * n34 +
          n14 * n22 * n31 -
          n12 * n24 * n31) +
      te[15] *
        (-n13 * n22 * n31 -
          n11 * n23 * n32 +
          n11 * n22 * n33 +
          n13 * n21 * n32 -
          n12 * n21 * n33 +
          n12 * n23 * n31)
    );
  }
  transpose() {
    let tmp,
      te = this.elements;
    return (
      (tmp = te[1]),
      (te[1] = te[4]),
      (te[4] = tmp),
      (tmp = te[2]),
      (te[2] = te[8]),
      (te[8] = tmp),
      (tmp = te[6]),
      (te[6] = te[9]),
      (te[9] = tmp),
      (tmp = te[3]),
      (te[3] = te[12]),
      (te[12] = tmp),
      (tmp = te[7]),
      (te[7] = te[13]),
      (te[13] = tmp),
      (tmp = te[11]),
      (te[11] = te[14]),
      (te[14] = tmp),
      this
    );
  }
  setPosition(v) {
    let te = this.elements;
    return ((te[12] = v.x), (te[13] = v.y), (te[14] = v.z), this);
  }
  getInverse(m, throwOnDegenerate) {
    if (MatrixWasm.getInverse) return (MatrixWasm.getInverse(this, m), this);
    let te = this.elements,
      me = m.elements,
      n11 = me[0],
      n21 = me[1],
      n31 = me[2],
      n41 = me[3],
      n12 = me[4],
      n22 = me[5],
      n32 = me[6],
      n42 = me[7],
      n13 = me[8],
      n23 = me[9],
      n33 = me[10],
      n43 = me[11],
      n14 = me[12],
      n24 = me[13],
      n34 = me[14],
      n44 = me[15],
      t11 =
        n23 * n34 * n42 -
        n24 * n33 * n42 +
        n24 * n32 * n43 -
        n22 * n34 * n43 -
        n23 * n32 * n44 +
        n22 * n33 * n44,
      t12 =
        n14 * n33 * n42 -
        n13 * n34 * n42 -
        n14 * n32 * n43 +
        n12 * n34 * n43 +
        n13 * n32 * n44 -
        n12 * n33 * n44,
      t13 =
        n13 * n24 * n42 -
        n14 * n23 * n42 +
        n14 * n22 * n43 -
        n12 * n24 * n43 -
        n13 * n22 * n44 +
        n12 * n23 * n44,
      t14 =
        n14 * n23 * n32 -
        n13 * n24 * n32 -
        n14 * n22 * n33 +
        n12 * n24 * n33 +
        n13 * n22 * n34 -
        n12 * n23 * n34,
      det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    if (0 === det)
      return (
        (te[0] = te[5] = te[10] = te[15] = 1),
        (te[1] =
          te[2] =
          te[3] =
          te[4] =
          te[6] =
          te[7] =
          te[8] =
          te[9] =
          te[11] =
          te[12] =
          te[13] =
          te[14] =
            0),
        this
      );
    let detInv = 1 / det;
    return (
      (te[0] = t11 * detInv),
      (te[1] =
        (n24 * n33 * n41 -
          n23 * n34 * n41 -
          n24 * n31 * n43 +
          n21 * n34 * n43 +
          n23 * n31 * n44 -
          n21 * n33 * n44) *
        detInv),
      (te[2] =
        (n22 * n34 * n41 -
          n24 * n32 * n41 +
          n24 * n31 * n42 -
          n21 * n34 * n42 -
          n22 * n31 * n44 +
          n21 * n32 * n44) *
        detInv),
      (te[3] =
        (n23 * n32 * n41 -
          n22 * n33 * n41 -
          n23 * n31 * n42 +
          n21 * n33 * n42 +
          n22 * n31 * n43 -
          n21 * n32 * n43) *
        detInv),
      (te[4] = t12 * detInv),
      (te[5] =
        (n13 * n34 * n41 -
          n14 * n33 * n41 +
          n14 * n31 * n43 -
          n11 * n34 * n43 -
          n13 * n31 * n44 +
          n11 * n33 * n44) *
        detInv),
      (te[6] =
        (n14 * n32 * n41 -
          n12 * n34 * n41 -
          n14 * n31 * n42 +
          n11 * n34 * n42 +
          n12 * n31 * n44 -
          n11 * n32 * n44) *
        detInv),
      (te[7] =
        (n12 * n33 * n41 -
          n13 * n32 * n41 +
          n13 * n31 * n42 -
          n11 * n33 * n42 -
          n12 * n31 * n43 +
          n11 * n32 * n43) *
        detInv),
      (te[8] = t13 * detInv),
      (te[9] =
        (n14 * n23 * n41 -
          n13 * n24 * n41 -
          n14 * n21 * n43 +
          n11 * n24 * n43 +
          n13 * n21 * n44 -
          n11 * n23 * n44) *
        detInv),
      (te[10] =
        (n12 * n24 * n41 -
          n14 * n22 * n41 +
          n14 * n21 * n42 -
          n11 * n24 * n42 -
          n12 * n21 * n44 +
          n11 * n22 * n44) *
        detInv),
      (te[11] =
        (n13 * n22 * n41 -
          n12 * n23 * n41 -
          n13 * n21 * n42 +
          n11 * n23 * n42 +
          n12 * n21 * n43 -
          n11 * n22 * n43) *
        detInv),
      (te[12] = t14 * detInv),
      (te[13] =
        (n13 * n24 * n31 -
          n14 * n23 * n31 +
          n14 * n21 * n33 -
          n11 * n24 * n33 -
          n13 * n21 * n34 +
          n11 * n23 * n34) *
        detInv),
      (te[14] =
        (n14 * n22 * n31 -
          n12 * n24 * n31 -
          n14 * n21 * n32 +
          n11 * n24 * n32 +
          n12 * n21 * n34 -
          n11 * n22 * n34) *
        detInv),
      (te[15] =
        (n12 * n23 * n31 -
          n13 * n22 * n31 +
          n13 * n21 * n32 -
          n11 * n23 * n32 -
          n12 * n21 * n33 +
          n11 * n22 * n33) *
        detInv),
      this
    );
  }
  invert() {
    const te = this.elements,
      n11 = te[0],
      n21 = te[1],
      n31 = te[2],
      n41 = te[3],
      n12 = te[4],
      n22 = te[5],
      n32 = te[6],
      n42 = te[7],
      n13 = te[8],
      n23 = te[9],
      n33 = te[10],
      n43 = te[11],
      n14 = te[12],
      n24 = te[13],
      n34 = te[14],
      n44 = te[15],
      t11 =
        n23 * n34 * n42 -
        n24 * n33 * n42 +
        n24 * n32 * n43 -
        n22 * n34 * n43 -
        n23 * n32 * n44 +
        n22 * n33 * n44,
      t12 =
        n14 * n33 * n42 -
        n13 * n34 * n42 -
        n14 * n32 * n43 +
        n12 * n34 * n43 +
        n13 * n32 * n44 -
        n12 * n33 * n44,
      t13 =
        n13 * n24 * n42 -
        n14 * n23 * n42 +
        n14 * n22 * n43 -
        n12 * n24 * n43 -
        n13 * n22 * n44 +
        n12 * n23 * n44,
      t14 =
        n14 * n23 * n32 -
        n13 * n24 * n32 -
        n14 * n22 * n33 +
        n12 * n24 * n33 +
        n13 * n22 * n34 -
        n12 * n23 * n34,
      det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    if (0 === det)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const detInv = 1 / det;
    return (
      (te[0] = t11 * detInv),
      (te[1] =
        (n24 * n33 * n41 -
          n23 * n34 * n41 -
          n24 * n31 * n43 +
          n21 * n34 * n43 +
          n23 * n31 * n44 -
          n21 * n33 * n44) *
        detInv),
      (te[2] =
        (n22 * n34 * n41 -
          n24 * n32 * n41 +
          n24 * n31 * n42 -
          n21 * n34 * n42 -
          n22 * n31 * n44 +
          n21 * n32 * n44) *
        detInv),
      (te[3] =
        (n23 * n32 * n41 -
          n22 * n33 * n41 -
          n23 * n31 * n42 +
          n21 * n33 * n42 +
          n22 * n31 * n43 -
          n21 * n32 * n43) *
        detInv),
      (te[4] = t12 * detInv),
      (te[5] =
        (n13 * n34 * n41 -
          n14 * n33 * n41 +
          n14 * n31 * n43 -
          n11 * n34 * n43 -
          n13 * n31 * n44 +
          n11 * n33 * n44) *
        detInv),
      (te[6] =
        (n14 * n32 * n41 -
          n12 * n34 * n41 -
          n14 * n31 * n42 +
          n11 * n34 * n42 +
          n12 * n31 * n44 -
          n11 * n32 * n44) *
        detInv),
      (te[7] =
        (n12 * n33 * n41 -
          n13 * n32 * n41 +
          n13 * n31 * n42 -
          n11 * n33 * n42 -
          n12 * n31 * n43 +
          n11 * n32 * n43) *
        detInv),
      (te[8] = t13 * detInv),
      (te[9] =
        (n14 * n23 * n41 -
          n13 * n24 * n41 -
          n14 * n21 * n43 +
          n11 * n24 * n43 +
          n13 * n21 * n44 -
          n11 * n23 * n44) *
        detInv),
      (te[10] =
        (n12 * n24 * n41 -
          n14 * n22 * n41 +
          n14 * n21 * n42 -
          n11 * n24 * n42 -
          n12 * n21 * n44 +
          n11 * n22 * n44) *
        detInv),
      (te[11] =
        (n13 * n22 * n41 -
          n12 * n23 * n41 -
          n13 * n21 * n42 +
          n11 * n23 * n42 +
          n12 * n21 * n43 -
          n11 * n22 * n43) *
        detInv),
      (te[12] = t14 * detInv),
      (te[13] =
        (n13 * n24 * n31 -
          n14 * n23 * n31 +
          n14 * n21 * n33 -
          n11 * n24 * n33 -
          n13 * n21 * n34 +
          n11 * n23 * n34) *
        detInv),
      (te[14] =
        (n14 * n22 * n31 -
          n12 * n24 * n31 -
          n14 * n21 * n32 +
          n11 * n24 * n32 +
          n12 * n21 * n34 -
          n11 * n22 * n34) *
        detInv),
      (te[15] =
        (n12 * n23 * n31 -
          n13 * n22 * n31 +
          n13 * n21 * n32 -
          n11 * n23 * n32 -
          n12 * n21 * n33 +
          n11 * n22 * n33) *
        detInv),
      this
    );
  }
  scale(v) {
    let te = this.elements,
      x = v.x,
      y = v.y,
      z = v.z;
    return (
      (te[0] *= x),
      (te[4] *= y),
      (te[8] *= z),
      (te[1] *= x),
      (te[5] *= y),
      (te[9] *= z),
      (te[2] *= x),
      (te[6] *= y),
      (te[10] *= z),
      (te[3] *= x),
      (te[7] *= y),
      (te[11] *= z),
      this
    );
  }
  getMaxScaleOnAxis() {
    let te = this.elements,
      scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2],
      scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6],
      scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  }
  makeTranslation(x, y, z) {
    return (this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1), this);
  }
  makeRotationX(theta) {
    let c = Math.cos(theta),
      s = Math.sin(theta);
    return (this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1), this);
  }
  makeRotationY(theta) {
    let c = Math.cos(theta),
      s = Math.sin(theta);
    return (this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1), this);
  }
  makeRotationZ(theta) {
    let c = Math.cos(theta),
      s = Math.sin(theta);
    return (this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this);
  }
  makeRotationAxis(axis, angle) {
    let c = Math.cos(angle),
      s = Math.sin(angle),
      t = 1 - c,
      x = axis.x,
      y = axis.y,
      z = axis.z,
      tx = t * x,
      ty = t * y;
    return (
      this.set(
        tx * x + c,
        tx * y - s * z,
        tx * z + s * y,
        0,
        tx * y + s * z,
        ty * y + c,
        ty * z - s * x,
        0,
        tx * z - s * y,
        ty * z + s * x,
        t * z * z + c,
        0,
        0,
        0,
        0,
        1,
      ),
      this
    );
  }
  makeScale(x, y, z) {
    return (this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1), this);
  }
  makeShear(x, y, z) {
    return (this.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1), this);
  }
  compose(position, quaternion, scale) {
    return (
      this.makeRotationFromQuaternion(quaternion),
      this.scale(scale),
      this.setPosition(position),
      this
    );
  }
  decompose(position, quaternion, scale) {
    let vector = this.V1 || new Vector3();
    this.V1 = vector;
    let matrix = this.M1 || new Matrix4();
    this.M1 = matrix;
    let te = this.elements,
      sx = vector.set(te[0], te[1], te[2]).length(),
      sy = vector.set(te[4], te[5], te[6]).length(),
      sz = vector.set(te[8], te[9], te[10]).length();
    (this.determinant() < 0 && (sx = -sx),
      (position.x = te[12]),
      (position.y = te[13]),
      (position.z = te[14]),
      matrix.copy(this));
    let invSX = 1 / sx,
      invSY = 1 / sy,
      invSZ = 1 / sz;
    return (
      (matrix.elements[0] *= invSX),
      (matrix.elements[1] *= invSX),
      (matrix.elements[2] *= invSX),
      (matrix.elements[4] *= invSY),
      (matrix.elements[5] *= invSY),
      (matrix.elements[6] *= invSY),
      (matrix.elements[8] *= invSZ),
      (matrix.elements[9] *= invSZ),
      (matrix.elements[10] *= invSZ),
      quaternion.setFromRotationMatrix(matrix),
      (scale.x = sx),
      (scale.y = sy),
      (scale.z = sz),
      this
    );
  }
  makePerspective(left, right, top, bottom, near, far) {
    let te = this.elements,
      x = (2 * near) / (right - left),
      y = (2 * near) / (top - bottom),
      a = (right + left) / (right - left),
      b = (top + bottom) / (top - bottom),
      c = -(far + near) / (far - near),
      d = (-2 * far * near) / (far - near);
    return (
      (te[0] = x),
      (te[4] = 0),
      (te[8] = a),
      (te[12] = 0),
      (te[1] = 0),
      (te[5] = y),
      (te[9] = b),
      (te[13] = 0),
      (te[2] = 0),
      (te[6] = 0),
      (te[10] = c),
      (te[14] = d),
      (te[3] = 0),
      (te[7] = 0),
      (te[11] = -1),
      (te[15] = 0),
      this
    );
  }
  makeOrthographic(left, right, top, bottom, near, far) {
    let te = this.elements,
      w = 1 / (right - left),
      h = 1 / (top - bottom),
      p = 1 / (far - near),
      x = (right + left) * w,
      y = (top + bottom) * h,
      z = (far + near) * p;
    return (
      (te[0] = 2 * w),
      (te[4] = 0),
      (te[8] = 0),
      (te[12] = -x),
      (te[1] = 0),
      (te[5] = 2 * h),
      (te[9] = 0),
      (te[13] = -y),
      (te[2] = 0),
      (te[6] = 0),
      (te[10] = -2 * p),
      (te[14] = -z),
      (te[3] = 0),
      (te[7] = 0),
      (te[11] = 0),
      (te[15] = 1),
      this
    );
  }
  equals(matrix) {
    let te = this.elements,
      me = matrix.elements;
    return (
      te[0] == me[0] &&
      te[1] == me[1] &&
      te[2] == me[2] &&
      te[3] == me[3] &&
      te[4] == me[4] &&
      te[5] == me[5] &&
      te[6] == me[6] &&
      te[7] == me[7] &&
      te[8] == me[8] &&
      te[9] == me[9] &&
      te[10] == me[10] &&
      te[11] == me[11] &&
      te[12] == me[12] &&
      te[13] == me[13] &&
      te[14] == me[14] &&
      te[15] == me[15]
    );
  }
  fromArray(array, offset = 0) {
    let te = this.elements;
    return (
      (te[0] = array[0 + offset]),
      (te[1] = array[1 + offset]),
      (te[2] = array[2 + offset]),
      (te[3] = array[3 + offset]),
      (te[4] = array[4 + offset]),
      (te[5] = array[5 + offset]),
      (te[6] = array[6 + offset]),
      (te[7] = array[7 + offset]),
      (te[8] = array[8 + offset]),
      (te[9] = array[9 + offset]),
      (te[10] = array[10 + offset]),
      (te[11] = array[11 + offset]),
      (te[12] = array[12 + offset]),
      (te[13] = array[13 + offset]),
      (te[14] = array[14 + offset]),
      (te[15] = array[15 + offset]),
      this
    );
  }
  toArray(array, offset) {
    (void 0 === array && (array = []), void 0 === offset && (offset = 0));
    let te = this.elements;
    return (
      (array[offset] = te[0]),
      (array[offset + 1] = te[1]),
      (array[offset + 2] = te[2]),
      (array[offset + 3] = te[3]),
      (array[offset + 4] = te[4]),
      (array[offset + 5] = te[5]),
      (array[offset + 6] = te[6]),
      (array[offset + 7] = te[7]),
      (array[offset + 8] = te[8]),
      (array[offset + 9] = te[9]),
      (array[offset + 10] = te[10]),
      (array[offset + 11] = te[11]),
      (array[offset + 12] = te[12]),
      (array[offset + 13] = te[13]),
      (array[offset + 14] = te[14]),
      (array[offset + 15] = te[15]),
      array
    );
  }
  applyToBufferAttribute(attribute) {
    let v1 = this.V1 || new Vector3();
    this.V1 = v1;
    for (let i = 0, l = attribute.count; i < l; i++)
      ((v1.x = attribute.array[3 * i + 0]),
        (v1.y = attribute.array[3 * i + 1]),
        (v1.z = attribute.array[3 * i + 2]),
        v1.applyMatrix4(this),
        (attribute.array[3 * i + 0] = v1.x),
        (attribute.array[3 * i + 1] = v1.y),
        (attribute.array[3 * i + 2] = v1.z));
    return attribute;
  }
  isIdentity() {
    let te = this.elements;
    return (
      1 == te[0] &&
      0 == te[1] &&
      0 == te[2] &&
      0 == te[3] &&
      0 == te[4] &&
      1 == te[5] &&
      0 == te[6] &&
      0 == te[7] &&
      0 == te[8] &&
      0 == te[9] &&
      1 == te[10] &&
      0 == te[11] &&
      0 == te[12] &&
      0 == te[13] &&
      0 == te[14] &&
      1 == te[15]
    );
  }
}
Matrix4.allocate = (ref) => {
  MatrixWasm.allocate(ref);
};
