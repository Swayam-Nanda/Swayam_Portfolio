class Color {
  constructor(r, g, b) {
    return null == r && null == g && null == b
      ? this.setRGB(1, 1, 1)
      : void 0 === g && void 0 === b
        ? this.set(r)
        : void this.setRGB(r, g, b);
  }
  set(value) {
    return (
      value && value instanceof Color
        ? this.copy(value)
        : "number" == typeof value
          ? this.setHex(value)
          : "string" == typeof value && this.setStyle(value),
      this
    );
  }
  setScalar(scalar) {
    return ((this.r = scalar), (this.g = scalar), (this.b = scalar), this);
  }
  setHex(hex) {
    return (
      (hex = Math.floor(hex)),
      (this.r = ((hex >> 16) & 255) / 255),
      (this.g = ((hex >> 8) & 255) / 255),
      (this.b = (255 & hex) / 255),
      this
    );
  }
  setStyle(string) {
    return this.setHex(Number(string.replace("#", "0x")));
  }
  setRGB(r, g, b) {
    return ((this.r = r), (this.g = g), (this.b = b), this);
  }
  setHSL(h, s, l) {
    return h instanceof ColorHSL
      ? h.getRGB(this)
      : this.target
        ? void this.target.setHSL(h, s, l).getRGB(this)
        : (this.target = new ColorHSL(h, s, l));
  }
  clone() {
    return new Color(this.r, this.g, this.b);
  }
  copy(color) {
    return ((this.r = color.r), (this.g = color.g), (this.b = color.b), this);
  }
  copyGammaToLinear(color, gammaFactor) {
    return (
      void 0 === gammaFactor && (gammaFactor = 2),
      (this.r = Math.pow(color.r, gammaFactor)),
      (this.g = Math.pow(color.g, gammaFactor)),
      (this.b = Math.pow(color.b, gammaFactor)),
      this
    );
  }
  copyLinearToGamma(color, gammaFactor) {
    void 0 === gammaFactor && (gammaFactor = 2);
    let safeInverse = gammaFactor > 0 ? 1 / gammaFactor : 1;
    return (
      (this.r = Math.pow(color.r, safeInverse)),
      (this.g = Math.pow(color.g, safeInverse)),
      (this.b = Math.pow(color.b, safeInverse)),
      this
    );
  }
  convertGammaToLinear(gammaFactor) {
    return (this.copyGammaToLinear(this, gammaFactor), this);
  }
  convertLinearToGamma(gammaFactor) {
    return (this.copyLinearToGamma(this, gammaFactor), this);
  }
  getHex() {
    return (
      ((255 * this.r) << 16) ^ ((255 * this.g) << 8) ^ ((255 * this.b) << 0)
    );
  }
  getHexString() {
    return "#" + ("000000" + this.getHex().toString(16)).slice(-6);
  }
  getHSL() {
    return this.target
      ? this.target.setRGB(this.r, this.g, this.b)
      : (this.target = new ColorHSL(this));
  }
  tween(color, time, ease, delay) {
    const _this = this;
    (_this.tweenObj || (_this.tweenObj = { v: 0 }), (_this.tweenObj.v = 0));
    let clone = this.clone();
    return TweenManager.tween(
      _this.tweenObj,
      { v: 1 },
      time,
      ease,
      delay,
    ).onUpdate((_) => {
      _this.copy(clone).lerp(color, _this.tweenObj.v);
    });
  }
  offsetHSL(h, s, l) {
    return (
      this.target
        ? this.target.setRGB(this.r, this.g, this.b)
        : (this.target = new ColorHSL(this)),
      (this.target.h += h),
      (this.target.s += s),
      (this.target.l += l),
      this.target.getRGB(this)
    );
  }
  add(color) {
    return (
      (this.r += color.r),
      (this.g += color.g),
      (this.b += color.b),
      this
    );
  }
  addColors(color1, color2) {
    return (
      (this.r = color1.r + color2.r),
      (this.g = color1.g + color2.g),
      (this.b = color1.b + color2.b),
      this
    );
  }
  addScalar(s) {
    return ((this.r += s), (this.g += s), (this.b += s), this);
  }
  sub(color) {
    return (
      (this.r = Math.max(0, this.r - color.r)),
      (this.g = Math.max(0, this.g - color.g)),
      (this.b = Math.max(0, this.b - color.b)),
      this
    );
  }
  multiply(color) {
    return (
      (this.r *= color.r),
      (this.g *= color.g),
      (this.b *= color.b),
      this
    );
  }
  multiplyScalar(s) {
    return ((this.r *= s), (this.g *= s), (this.b *= s), this);
  }
  invert() {
    return (
      (this.r = 1 - this.r),
      (this.g = 1 - this.g),
      (this.b = 1 - this.b),
      this
    );
  }
  lerp(color, alpha, hz) {
    return (
      (this.r = Math.lerp(color.r, this.r, alpha, hz)),
      (this.g = Math.lerp(color.g, this.g, alpha, hz)),
      (this.b = Math.lerp(color.b, this.b, alpha, hz)),
      this
    );
  }
  equals(c) {
    return c.r === this.r && c.g === this.g && c.b === this.b;
  }
  fromArray(array, offset) {
    return (
      void 0 === offset && (offset = 0),
      (this.r = array[offset]),
      (this.g = array[offset + 1]),
      (this.b = array[offset + 2]),
      this
    );
  }
  toArray(array, offset) {
    return (
      void 0 === array && (array = []),
      void 0 === offset && (offset = 0),
      (array[offset] = this.r),
      (array[offset + 1] = this.g),
      (array[offset + 2] = this.b),
      array
    );
  }
  toRGBA(alpha = 1) {
    return `rgba(${Math.floor(255 * this.r)}, ${Math.floor(255 * this.g)}, ${Math.floor(255 * this.b)}, ${alpha})`;
  }
}
class ColorHSL {
  constructor(h, s, l) {
    return void 0 === h && void 0 === s && void 0 === l
      ? this.setHSL(0, 0, 1)
      : void 0 === s && void 0 === l
        ? this.set(h)
        : void this.setHSL(h, s, l);
  }
  copy(colorHSL) {
    return (
      (this.h = colorHSL.h),
      (this.s = colorHSL.s),
      (this.l = colorHSL.l),
      this
    );
  }
  getRGB(target = new Color()) {
    function hue2rgb(p, q, t) {
      return (
        t < 0 && (t += 1),
        t > 1 && (t -= 1),
        t < 1 / 6
          ? p + 6 * (q - p) * t
          : t < 0.5
            ? q
            : t < 2 / 3
              ? p + 6 * (q - p) * (2 / 3 - t)
              : p
      );
    }
    let h = Math.euclideanModulo(this.h, 1),
      s = Math.clamp(this.s, 0, 1),
      l = Math.clamp(this.l, 0, 1);
    if (0 === s) target.r = target.g = target.b = l;
    else {
      let p = l <= 0.5 ? l * (1 + s) : l + s - l * s,
        q = 2 * l - p;
      ((target.r = hue2rgb(q, p, h + 1 / 3)),
        (target.g = hue2rgb(q, p, h)),
        (target.b = hue2rgb(q, p, h - 1 / 3)));
    }
    return target;
  }
  set(value) {
    return (
      value && value instanceof ColorHSL
        ? this.copy(value)
        : value && value instanceof Color
          ? this.setRGB(value.r, value.g, value.b)
          : "number" == typeof value
            ? this.setHex(value)
            : "string" == typeof value && this.setStyle(value),
      this
    );
  }
  setHex(hex) {
    const r = (((hex = Math.floor(hex)) >> 16) & 255) / 255,
      g = ((hex >> 8) & 255) / 255,
      b = (255 & hex) / 255;
    return this.setRGB(r, g, b);
  }
  setStyle(string) {
    return this.setHex(Number(string.replace("#", "0x")));
  }
  setRGB(r, g, b) {
    let hue,
      saturation,
      max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      lightness = (min + max) / 2;
    if (min === max) ((hue = 0), (saturation = 0));
    else {
      let delta = max - min;
      switch (
        ((saturation =
          lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min)),
        max)
      ) {
        case r:
          hue = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          hue = (b - r) / delta + 2;
          break;
        case b:
          hue = (r - g) / delta + 4;
      }
      hue /= 6;
    }
    return ((this.h = hue), (this.s = saturation), (this.l = lightness), this);
  }
  setHSL(h, s, l) {
    return ((this.h = h), (this.s = s), (this.l = l), this);
  }
}
class ColorLAB {
  constructor(l, a, b) {
    return void 0 === l && void 0 === a && void 0 === b
      ? this.setLAB(100, 0, 0)
      : void 0 === a && void 0 === b
        ? this.set(l)
        : void this.setLAB(l, a, b);
  }
  copy(colorLAB) {
    return (
      (this.l = colorLAB.l),
      (this.a = colorLAB.a),
      (this.b = colorLAB.b),
      this
    );
  }
  deltaECIE94(colorLAB) {
    var deltaL = this.l - colorLAB.l,
      deltaA = this.a - colorLAB.a,
      deltaB = this.b - colorLAB.b,
      c1 = Math.sqrt(this.a * this.a + this.b * this.b),
      deltaC =
        c1 - Math.sqrt(colorLAB.a * colorLAB.a + colorLAB.b * colorLAB.b),
      deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC,
      deltaLKlsl = deltaL / 1,
      deltaCkcsc = deltaC / (1 + 0.045 * c1),
      deltaHkhsh =
        (deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH)) / (1 + 0.015 * c1),
      i =
        deltaLKlsl * deltaLKlsl +
        deltaCkcsc * deltaCkcsc +
        deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
  }
  getRGB(target = new Color()) {
    let y = (this.l + 16) / 116,
      x = this.a / 500 + y,
      z = y - this.b / 200;
    return (
      (x =
        0.95047 * (x * x * x > 0.008856 ? x * x * x : (x - 16 / 116) / 7.787)),
      (y = y * y * y > 0.008856 ? y * y * y : (y - 16 / 116) / 7.787),
      (z =
        1.08883 * (z * z * z > 0.008856 ? z * z * z : (z - 16 / 116) / 7.787)),
      (target.r = 3.2406 * x + -1.5372 * y + -0.4986 * z),
      (target.g = -0.9689 * x + 1.8758 * y + 0.0415 * z),
      (target.b = 0.0557 * x + -0.204 * y + 1.057 * z),
      (target.r = Math.clamp(
        target.r > 0.0031308
          ? 1.055 * Math.pow(target.r, 1 / 2.4) - 0.055
          : 12.92 * target.r,
      )),
      (target.g = Math.clamp(
        target.g > 0.0031308
          ? 1.055 * Math.pow(target.g, 1 / 2.4) - 0.055
          : 12.92 * target.g,
      )),
      (target.b = Math.clamp(
        target.b > 0.0031308
          ? 1.055 * Math.pow(target.b, 1 / 2.4) - 0.055
          : 12.92 * target.b,
      )),
      target
    );
  }
  set(value) {
    return (
      value && value instanceof ColorLAB
        ? this.copy(value)
        : value && value instanceof Color
          ? this.setRGB(value.r, value.g, value.b)
          : "number" == typeof value
            ? this.setHex(value)
            : "string" == typeof value && this.setStyle(value),
      this
    );
  }
  setHex(hex) {
    const r = (((hex = Math.floor(hex)) >> 16) & 255) / 255,
      g = ((hex >> 8) & 255) / 255,
      b = (255 & hex) / 255;
    return this.setRGB(r, g, b);
  }
  setStyle(string) {
    return this.setHex(Number(string.replace("#", "0x")));
  }
  setRGB(r, g, b) {
    let x, y, z;
    return (
      (x =
        (0.4124 *
          (r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92) +
          0.3576 *
            (g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92) +
          0.1805 *
            (b =
              b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92)) /
        0.95047),
      (y = 0.2126 * r + 0.7152 * g + 0.0722 * b),
      (z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883),
      (x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116),
      (y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116),
      (z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116),
      (this.l = 116 * y - 16),
      (this.a = 500 * (x - y)),
      (this.b = 200 * (y - z)),
      this
    );
  }
  setLAB(l, a, b) {
    return ((this.l = l), (this.a = a), (this.b = b), this);
  }
}
class Cylindrical {
  constructor(radius = 1, theta = 0, y = 0) {
    ((this.radius = radius), (this.theta = theta), (this.y = y));
  }
  set(radius, theta, y) {
    return ((this.radius = radius), (this.theta = theta), (this.y = y), this);
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(other) {
    return (
      (this.radius = other.radius),
      (this.theta = other.theta),
      (this.y = other.y),
      this
    );
  }
  setFromVector3(vec3) {
    return (
      (this.radius = Math.sqrt(vec3.x * vec3.x + vec3.z * vec3.z)),
      (this.theta = Math.atan2(vec3.x, vec3.z)),
      (this.y = vec3.y),
      this
    );
  }
}
class Euler {
  constructor(x, y, z, order) {
    ((this._x = x || 0),
      (this._y = y || 0),
      (this._z = z || 0),
      (this._order = order || "XYZ"),
      (this.isEuler = !0));
  }
  get x() {
    return this._x;
  }
  set x(v) {
    if (zUtils3D.LOCAL && isNaN(v)) return console.trace("Euler::NaN");
    let dirty = Math.abs(this._x - v) > Base3D.DIRTY_EPSILON;
    ((this._x = v), dirty && this.onChangeCallback());
  }
  get y() {
    return this._y;
  }
  set y(v) {
    if (zUtils3D.LOCAL && isNaN(v)) return console.trace("Euler::NaN");
    let dirty = Math.abs(this._y - v) > Base3D.DIRTY_EPSILON;
    ((this._y = v), dirty && this.onChangeCallback());
  }
  get z() {
    return this._z;
  }
  set z(v) {
    if (zUtils3D.LOCAL && isNaN(v)) return console.trace("Euler::NaN");
    let dirty = Math.abs(this._z - v) > Base3D.DIRTY_EPSILON;
    ((this._z = v), dirty && this.onChangeCallback());
  }
  set order(value) {
    ((this._order = value), this.onChangeCallback());
  }
  get order() {
    return this._order;
  }
  set(x, y, z, order) {
    return (
      (this._x = x),
      (this._y = y),
      (this._z = z),
      (this._order = order || this._order),
      this.onChangeCallback(),
      this
    );
  }
  clone() {
    return new Euler(this._x, this._y, this._z, this._order);
  }
  copy(euler) {
    return (
      (this._x = euler.x),
      (this._y = euler.y),
      (this._z = euler.z),
      euler._order && (this._order = euler._order),
      this.onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(m, order, update) {
    let clamp = Math.clamp,
      te = m.elements,
      m11 = te[0],
      m12 = te[4],
      m13 = te[8],
      m21 = te[1],
      m22 = te[5],
      m23 = te[9],
      m31 = te[2],
      m32 = te[6],
      m33 = te[10];
    return (
      "XYZ" === (order = order || this._order)
        ? ((this._y = Math.asin(clamp(m13, -1, 1))),
          Math.abs(m13) < 1 - Base3D.DIRTY_EPSILON
            ? ((this._x = Math.atan2(-m23, m33)),
              (this._z = Math.atan2(-m12, m11)))
            : ((this._x = Math.atan2(m32, m22)), (this._z = 0)))
        : "YXZ" === order
          ? ((this._x = Math.asin(-clamp(m23, -1, 1))),
            Math.abs(m23) < 1 - Base3D.DIRTY_EPSILON
              ? ((this._y = Math.atan2(m13, m33)),
                (this._z = Math.atan2(m21, m22)))
              : ((this._y = Math.atan2(-m31, m11)), (this._z = 0)))
          : "ZXY" === order
            ? ((this._x = Math.asin(clamp(m32, -1, 1))),
              Math.abs(m32) < 1 - Base3D.DIRTY_EPSILON
                ? ((this._y = Math.atan2(-m31, m33)),
                  (this._z = Math.atan2(-m12, m22)))
                : ((this._y = 0), (this._z = Math.atan2(m21, m11))))
            : "ZYX" === order
              ? ((this._y = Math.asin(-clamp(m31, -1, 1))),
                Math.abs(m31) < 1 - Base3D.DIRTY_EPSILON
                  ? ((this._x = Math.atan2(m32, m33)),
                    (this._z = Math.atan2(m21, m11)))
                  : ((this._x = 0), (this._z = Math.atan2(-m12, m22))))
              : "YZX" === order
                ? ((this._z = Math.asin(clamp(m21, -1, 1))),
                  Math.abs(m21) < 1 - Base3D.DIRTY_EPSILON
                    ? ((this._x = Math.atan2(-m23, m22)),
                      (this._y = Math.atan2(-m31, m11)))
                    : ((this._x = 0), (this._y = Math.atan2(m13, m33))))
                : "XZY" === order &&
                  ((this._z = Math.asin(-clamp(m12, -1, 1))),
                  Math.abs(m12) < 1 - Base3D.DIRTY_EPSILON
                    ? ((this._x = Math.atan2(m32, m22)),
                      (this._y = Math.atan2(m13, m11)))
                    : ((this._x = Math.atan2(-m23, m33)), (this._y = 0))),
      (this._order = order),
      !1 !== update && this.onChangeCallback(),
      this
    );
  }
  setFromQuaternion(q, order, update) {
    let matrix = this.M1 || new Matrix4();
    return (
      (this.M1 = matrix),
      matrix.makeRotationFromQuaternion(q),
      this.setFromRotationMatrix(matrix, order, update)
    );
  }
  setFromVector3(v, order) {
    return this.set(v.x, v.y, v.z, order || this._order);
  }
  reorder(newOrder) {
    let q = this.Q1 || new Quaternion();
    return (
      (this.Q1 = q),
      q.setFromEuler(this),
      this.setFromQuaternion(q, newOrder)
    );
  }
  lerp(euler, alpha) {
    ((this._x += (euler._x - this._x) * alpha),
      (this._y += (euler._y - this._y) * alpha),
      (this._z += (euler._z - this._z) * alpha),
      this.onChangeCallback());
  }
  equals(euler) {
    return (
      euler._x === this._x &&
      euler._y === this._y &&
      euler._z === this._z &&
      euler._order === this._order
    );
  }
  fromArray(array) {
    return (
      (this._x = array[0]),
      (this._y = array[1]),
      (this._z = array[2]),
      void 0 !== array[3] && (this._order = array[3]),
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
      (array[offset + 3] = this._order),
      array
    );
  }
  toVector3(optionalResult) {
    return optionalResult
      ? optionalResult.set(this._x, this._y, this._z)
      : new Vector3(this._x, this._y, this._z);
  }
  onChange(callback) {
    this.onChangeCallback = callback;
  }
  onChangeCallback() {}
}
((Euler.DefaultOrder = "XYZ"),
  (Euler.RotationOrders = ["XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX"]));
