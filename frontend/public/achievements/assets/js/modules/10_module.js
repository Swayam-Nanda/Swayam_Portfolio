class GLUIText {
  constructor(text, fontName, fontSize, options = {}, customCompile) {
    ((options.font = fontName || options.font),
      (options.text = text),
      (options.seoText = options.seoText ?? text),
      (options.width = options.width),
      (options.align = options.align || "left"),
      (options.size = fontSize || options.size),
      (options.lineHeight = options.lineHeight),
      (options.letterSpacing = options.letterSpacing),
      (options.wordSpacing = options.wordSpacing),
      (options.wordBreak = options.wordBreak),
      (options.langBreak = options.langBreak),
      (options.indent = options.indent),
      (options.color = new Color(options.color)),
      (options.customCompile = customCompile),
      (this.text = new GLText(options)),
      (this.group = new Group()),
      (this.group.asyncPromise = this.text.text.fontLoaded),
      (this.alpha = 1),
      (this._x = 0),
      (this._y = 0),
      (this._z = 0),
      (this._scaleX = 1),
      (this._scaleY = 1),
      (this._scale = 1),
      (this._rotation = 0),
      (this.multiTween = !0));
    const _this = this;
    (text &&
      defer((_) => {
        !_this.seo &&
          options.seoText &&
          _this.seoText(
            options.seoText,
            this._seoSortOrder ?? options.seoSortOrder,
          );
      }),
      this.text.ready().then((_) => {
        let mesh = _this.text.mesh;
        ((mesh.glui = _this),
          (mesh.shader.visible = !1),
          (_this.mesh = mesh),
          _this.group.add(mesh),
          _this._3d && !_this._style2d && _this.text.centerY(),
          _this._3d || (_this.text.mesh.shader.depthTest = !1),
          (mesh.shader.mesh = mesh),
          (mesh.onBeforeRender = (_) => {
            if (!mesh.determineVisible() && _this.firstRender) return;
            let alpha = _this.getAlpha();
            if (
              (mesh.shader.uniforms.uAlpha &&
                (mesh.shader.uniforms.uAlpha.value = alpha),
              alpha < 0.001)
            ) {
              if (
                ((mesh.shader.visible = !1),
                (mesh.neverRender = !0),
                !_this.isDirty && _this.firstRender)
              )
                return;
            } else ((mesh.neverRender = !1), (mesh.shader.visible = !0));
            (!_this.isDirty && _this.firstRender) ||
              (RenderStats.active &&
                RenderStats.update(
                  "GLUIText",
                  1,
                  mesh.shader.vsName + "|" + mesh.shader.fsName,
                  mesh,
                ),
              (_this.group.position.x = _this._x),
              (_this.group.position.y = _this._3d ? _this._y : -_this._y),
              (_this.group.position.z = _this._z),
              _this.group.scale.set(
                _this._scaleX * _this._scale,
                _this._scaleY * _this._scale,
                1,
              ),
              _this._3d
                ? _this.anchor && _this.anchor._parent
                  ? (_this.anchor.position.copy(_this.group.position),
                    _this.anchor.scale.copy(_this.group.scale),
                    _this.anchor.quaternion.setFromEuler(_this._rotation))
                  : _this.group.quaternion.setFromEuler(_this._rotation)
                : (_this.group.rotation.z = Math.radians(_this._rotation)),
              _this.firstRender ||
                (_this.group.updateMatrixWorld(!0),
                (_this.firstRender = !0),
                (mesh.shader.visible = !0)),
              _this.onInternalUpdate && _this.onInternalUpdate(),
              (_this.isDirty = !1));
          }));
      }));
  }
  get x() {
    return this._x;
  }
  set x(v) {
    (Math.abs(this._x - v) > Base3D.DIRTY_EPSILON && (this.isDirty = !0),
      (this._x = v));
  }
  get y() {
    return this._y;
  }
  set y(v) {
    (Math.abs(this._y - v) > Base3D.DIRTY_EPSILON && (this.isDirty = !0),
      (this._y = v));
  }
  get z() {
    return this._z;
  }
  set z(v) {
    (Math.abs(this._z - v) > Base3D.DIRTY_EPSILON && (this.isDirty = !0),
      (this._z = v));
  }
  get scale() {
    return this._scale;
  }
  set scale(v) {
    (Math.abs(this._scale - v) > Base3D.DIRTY_EPSILON && (this.isDirty = !0),
      (this._scale = v));
  }
  get scaleX() {
    return this._scaleX;
  }
  set scaleX(v) {
    (Math.abs(this._scaleX - v) > Base3D.DIRTY_EPSILON && (this.isDirty = !0),
      (this._scaleX = v));
  }
  get scaleY() {
    return this._scaleY;
  }
  set scaleY(v) {
    (Math.abs(this._scaleY - v) > Base3D.DIRTY_EPSILON && (this.isDirty = !0),
      (this._scaleY = v));
  }
  get rotation() {
    return this._rotation;
  }
  set rotation(v) {
    (Math.abs(this._rotation - v) > Base3D.DIRTY_EPSILON && (this.isDirty = !0),
      (this._rotation = v));
  }
  get dimensions() {
    return (
      this._dimensions || (this._dimensions = {}),
      this.text &&
        this.text.geometry &&
        !this._dimensions.max &&
        ((this._dimensions = this.text.geometry.boundingBox),
        (this._dimensions.width = Math.abs(
          this._dimensions.min.x - this._dimensions.max.x,
        )),
        (this._dimensions.height = Math.abs(
          this._dimensions.min.y - this._dimensions.max.y,
        ))),
      this._dimensions
    );
  }
  interact(over, click, camera = World.CAMERA, seoLink, options) {
    ("string" == typeof camera &&
      ((options = seoLink), (seoLink = camera), (camera = World.CAMERA)),
      (this._onOver = over),
      (this._onClick = click),
      (this._interactCamera = camera));
    let stage = this._3d ? GLUI.Scene : GLUI.Stage;
    const _this = this;
    return (
      _this.text.ready().then((_) => {
        if (over) {
          if (
            (_this.text.geometry.boundingBox ||
              _this.text.geometry.computeBoundingBox(),
            !_this.hitArea)
          ) {
            let bb = _this.text.geometry.boundingBox,
              shader = Utils3D.getTestShader();
            if (
              ((shader.visible = !1),
              (_this.hitArea = new Mesh(World.PLANE, shader)),
              (_this.hitArea.glui = _this),
              _this.hitArea.scale.set(
                Math.abs(bb.min.x) + Math.abs(bb.max.x),
                Math.abs(bb.min.y) + Math.abs(bb.max.y),
                1,
              ),
              (_this._3d && !_this._style2d) ||
                (_this.hitArea.position.x = (bb.max.x - bb.min.x) / 2),
              (_this.hitArea.position.y = (bb.min.y - bb.max.y) / 2),
              _this._3d)
            )
              switch (_this.text.getData().align) {
                case "center":
                  _this.hitArea.position.x = 0;
                  break;
                case "right":
                  _this.hitArea.position.x = (bb.min.x - bb.max.x) / 2;
              }
            else
              switch (_this.text.getData().align) {
                case "center":
                  _this.hitArea.position.x = 0;
                  break;
                case "right":
                  _this.hitArea.position.x = -(bb.max.x - bb.min.x) / 2;
              }
            _this.text.mesh.add(_this.hitArea);
          }
          stage.interaction.add(_this.hitArea, camera);
        } else stage.interaction.remove(_this.hitArea, camera);
      }),
      defer((_) => {
        seoLink &&
          _this.seo &&
          _this.seo.aLink &&
          _this.seo.aLink(seoLink, options);
      }),
      this
    );
  }
  clearInteract() {
    if (this._onOver) {
      ((this._3d ? GLUI.Scene : GLUI.Stage).interaction.remove(
        this.hitArea,
        this._interactCamera,
      ),
        (this._onClick = GLUIObject.noop),
        (this._onOver = GLUIObject.noop));
    }
    return this;
  }
  remove(param) {
    param &&
      console.warn(
        "GLUIObject.remove removes ITSELF from its parent. use removeChild instead",
      );
    let stage = this._3d ? GLUI.Scene : GLUI.Stage;
    (this.mesh && this.mesh.parent
      ? this.group.parent.remove(this.group)
      : stage.remove(this),
      this.hitArea &&
        stage.interaction.remove(this.hitArea, this._interactCamera),
      this.text && this.text.destroy && this.text.destroy(),
      Utils.nullObject(this.mesh),
      Utils.nullObject(this));
  }
  tween(obj, time, ease, delay) {
    return tween(this, obj, time, ease, delay);
  }
  enable3D(style2d) {
    ((this._3d = !0),
      (this._style2d = style2d),
      (this._rotation = new Euler()));
    const _this = this;
    return (
      _this._rotation.onChange((_) => {
        _this.isDirty = !0;
      }),
      _this.text.ready().then((_) => {
        _this.text.mesh.shader.depthTest = !0;
      }),
      this.anchor || (this.anchor = new Group()),
      (this.anchor.onMatrixDirty = (_) => {
        _this.isDirty = !0;
      }),
      (_this.isDirty = !0),
      this
    );
  }
  depthTest(bool) {
    const _this = this;
    return (
      _this.text.ready().then((_) => {
        _this.text.mesh.shader.depthTest = bool;
      }),
      this
    );
  }
  setZ(z) {
    const _this = this;
    return (
      _this.text.ready().then((_) => {
        _this.text.mesh.renderOrder = z;
      }),
      this
    );
  }
  height() {
    return this.mesh ? this.text.height : 0;
  }
  async setText(text, options) {
    if (text && ((text = text.toString()), !1 !== options?.seoText)) {
      let seoText = options?.seoText;
      ((seoText =
        seoText && "boolean" != typeof seoText ? seoText.toString() : text),
        this.seoText(seoText, options?.seoSortOrder));
    }
    return (
      await this.text.ready(),
      await this.text.setText(text, options),
      (this._dimensions = null),
      this
    );
  }
  seoText(text, sortOrder = this._seoSortOrder) {
    window.GLSEO &&
      (GLSEO.textNode(this, text, sortOrder), delete this._seoSortOrder);
  }
  get seoSortOrder() {
    return this.seo ? this.seo.sortOrder : this._seoSortOrder;
  }
  set seoSortOrder(sortOrder) {
    this.seo
      ? GLSEO.textNode(this, this.seo.text(), sortOrder)
      : (this._seoSortOrder = sortOrder);
  }
  getTextString() {
    return this.text.string;
  }
  setColor(color) {
    const _this = this;
    return (_this.text.ready().then((_) => _this.text.setColor(color)), this);
  }
  tweenColor(color, time, ease, delay) {
    const _this = this;
    return (
      _this.text
        .ready()
        .then((_) => _this.text.tweenColor(color, time, ease, delay)),
      this
    );
  }
  async resize(options) {
    (await this.text.ready(),
      await this.text.resize(options),
      (this._dimensions = null));
  }
  show() {
    return (
      this.text.ready().then((_) => {
        ((this.text.mesh.visible = !0), this.text.mesh.updateMatrixWorld(!0));
      }),
      this
    );
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
  hide() {
    const _this = this;
    return (
      _this.text.ready().then((_) => (_this.text.mesh.visible = !1)),
      this
    );
  }
  loaded() {
    return this.text.ready();
  }
  length() {
    return this.text.charLength;
  }
  deferRender(parent) {
    ((this.deferred = !0),
      parent ||
        (this.anchor || (this.anchor = new Group()),
        GLUI.Scene.addDeferred(this)));
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
  size() {}
  upload() {
    const _this = this;
    return (_this.text.ready().then((_) => _this.text.mesh.upload()), this);
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
      this.onDivBlurSelect && this.onDivSelect());
  }
  get _parent() {
    return this.parent;
  }
  async useShader(shader) {
    (await this.text.ready(),
      (shader.uniforms.tMap = this.text.shader.uniforms.tMap),
      (shader.uniforms.uAlpha = this.text.shader.uniforms.uAlpha),
      (shader.uniforms.uColor = this.text.shader.uniforms.uColor),
      (shader.transparent = !0),
      (!this._3d || this._3d || this.parent) && (shader.depthTest = !1),
      (this.text.mesh.shader = shader || this.text.shader),
      (this.text.shader = shader),
      (this.text.mesh.shader.mesh = this.text.mesh));
  }
}
(Class(function GLUIStage() {
  Inherit(this, Component);
  const _this = this;
  var _scene = new Scene(),
    _camera = new OrthographicCamera(1, 1, 1, 1, 0.1, 1);
  function resizeHandler() {
    ((_camera.left = Stage.width / -2),
      (_camera.right = Stage.width / 2),
      (_camera.top = Stage.height / 2),
      (_camera.bottom = Stage.height / -2),
      (_camera.near = 0.01),
      (_camera.far = 1e3),
      _camera.updateProjectionMatrix(),
      (_camera.position.x = Stage.width / 2),
      (_camera.position.y = -Stage.height / 2));
  }
  ((this.interaction = new GLUIStageInteraction2D(_camera, _scene, Stage)),
    (this.alpha = 1),
    (this.scene = _scene),
    (_scene.disableAutoSort = !0),
    (_camera.position.z = 1),
    (function addListeners() {
      _this.events.sub(Events.RESIZE, resizeHandler);
    })(),
    resizeHandler(),
    (this.add = function ($obj) {
      (($obj.parent = _this), _scene.add($obj.group || $obj.mesh));
    }),
    (this.remove = function ($obj) {
      (($obj.parent = null), _scene.remove($obj.group));
    }),
    (this.clear = function () {
      (_scene.traverse((obj) => {
        obj.geometry && obj.shader && obj.destroy();
      }),
        (_scene.children.length = _scene.childrenLength = 0));
    }),
    (this.renderToRT = function (scene, rt) {
      let clearAlpha;
      rt &&
        rt.fxscene &&
        rt.fxscene.clearAlpha > -1 &&
        ((clearAlpha = World.RENDERER.getClearAlpha()),
        World.RENDERER.setClearAlpha(0));
      let autoClear = World.RENDERER.autoClear;
      ((World.RENDERER.autoClear = !1),
        World.RENDERER.render(scene, _camera, rt),
        (World.RENDERER.autoClear = autoClear),
        clearAlpha && World.RENDERER.setClearAlpha(clearAlpha));
    }),
    this.get("camera", () => _camera),
    (this.resize = resizeHandler),
    (this.render = function loop() {
      if (!_scene.children.length) return;
      let clear = World.RENDERER.autoClear;
      ((World.RENDERER.autoClear = !1),
        World.RENDERER.render(_scene, _camera, null, !0),
        (World.RENDERER.autoClear = clear));
    }),
    (this.renderDirect = (callback) => {
      _scene.children.length &&
        (_scene.traverse((obj) => {
          obj.shader && (obj.shader.depthTest = !1);
        }),
        callback(_scene, _camera));
    }));
}),
  Class(function GLUIStage3D() {
    Inherit(this, Object3D);
    const _this = this;
    var _camera,
      _externalRenders = [],
      _scene = new Scene(),
      _list = new LinkedList();
    ((this.alpha = 1),
      (this.interaction = new GLUIStageInteraction3D()),
      (this.add = function (obj, parent) {
        ((obj.parent = _this),
          (obj._gluiParent = parent),
          obj.anchor && (obj.anchor._gluiParent = parent),
          obj._3d || obj.enable3D(),
          obj.deferRender());
      }),
      (this.clear = function () {
        (_scene.traverse((obj) => {
          obj.geometry && obj.shader && obj.destroy();
        }),
          (_scene.children.length = _scene.childrenLength = 0));
      }),
      (this.addDeferred = function (obj) {
        (_list.push(obj), _scene.add(obj.group || obj.mesh));
      }),
      (this.remove = function (obj) {
        (_scene.remove(obj.group || obj.mesh), _list.remove(obj));
      }),
      (this.disableAutoSort = function () {
        _scene.disableAutoSort = !0;
      }),
      (this.renderToRT = function (scene, camera) {
        ((camera = camera.camera || camera),
          scene.traverse((mesh) => {
            let obj = mesh.glui || mesh;
            obj &&
              obj.anchor &&
              obj.anchor.determineVisible() &&
              Utils3D.decompose(obj.anchor, obj.group || obj);
          }),
          (scene._textRenderCamera = camera),
          _externalRenders.push(scene));
      }),
      (this.renderToRT2 = function (scene, rt, camera) {
        let clearAlpha;
        rt.fxscene &&
          rt.fxscene.clearAlpha > -1 &&
          ((clearAlpha = World.RENDERER.getClearAlpha()),
          World.RENDERER.setClearAlpha(0));
        let autoClear = World.RENDERER.autoClear;
        ((World.RENDERER.autoClear = !1),
          World.RENDERER.render(scene, camera, rt),
          (World.RENDERER.autoClear = autoClear),
          clearAlpha && World.RENDERER.setClearAlpha(clearAlpha));
      }),
      (this.render = function loop() {
        if (!window.Metal) {
          if (_list.length) {
            let obj = _list.start();
            for (; obj; )
              (obj._marked &&
                ((obj._marked = !1), Utils3D.decompose(obj.anchor, obj.group)),
                (obj = _list.next()));
            let clear = World.RENDERER.autoClear;
            (Renderer.context.clear(Renderer.context.DEPTH_BUFFER_BIT),
              (World.RENDERER.autoClear = !1),
              World.RENDERER.render(_scene, _camera || World.CAMERA),
              (World.RENDERER.autoClear = clear));
          }
          if (_externalRenders.length)
            for (; _externalRenders.length; ) {
              let scene = _externalRenders.shift(),
                camera = scene._textRenderCamera,
                clear = World.RENDERER.autoClear;
              (Renderer.context.clear(Renderer.context.DEPTH_BUFFER_BIT),
                (World.RENDERER.autoClear = !1),
                World.RENDERER.render(scene, camera),
                (World.RENDERER.autoClear = clear));
            }
        }
      }),
      (this.mark = function mark() {
        let obj = _list.start();
        for (; obj; )
          (obj.anchor._parent &&
            (obj.group.visible = obj.anchor.determineVisible()),
            obj.mesh &&
              obj.mesh.determineVisible() &&
              obj.anchor._parent &&
              (obj._marked = !0),
            (obj = _list.next()));
      }),
      (this.renderDirect = function (callback) {
        if (_list.length) {
          let obj = _list.start();
          for (; obj; )
            (obj._marked &&
              ((obj._marked = !1), Utils3D.decompose(obj.anchor, obj.group)),
              (obj = _list.next()));
          (_scene.traverse((obj) => {
            obj.shader && (obj.shader.depthTest = !1);
          }),
            callback(_scene, _camera || World.CAMERA));
        }
      }),
      this.set("camera", (c) => {
        _camera = c.camera || c;
      }));
  }),
  Class(
    function GLUITexture(_layout, _w, _h, _rtPool, _strict) {
      Inherit(this, Component);
      const _this = this;
      var _rt,
        _camera,
        _hitCamera,
        _interaction,
        _ray,
        _needsRender,
        _rendered,
        _hitEvt,
        _usingFingers,
        $glObj,
        _needsRenderCount = 0,
        _needsRenderTimerCount = 0,
        _scene = new Scene(),
        _mouse = new Vector2(),
        _stage = new Vector2(),
        _v3 = new Vector3(),
        _enabled = !0,
        _width = _w,
        _height = _h,
        _cacheHits = [];
      function loop() {
        _enabled &&
          ((_this.manualRender && !_needsRender && 0 == _needsRenderCount) ||
            render());
      }
      function render() {
        let clearAlpha = World.RENDERER.getClearAlpha(),
          autoClear = World.RENDERER.autoClear;
        _this.disableClear && (World.RENDERER.autoClear = !1);
        let clearColor = World.RENDERER.getClearColor().getHex();
        (clearColor > 0
          ? World.RENDERER.setClearColor(0, 0)
          : World.RENDERER.setClearAlpha(0),
          World.RENDERER.render(_scene, _camera, _rt),
          clearColor > 0
            ? World.RENDERER.setClearColor(clearColor, clearAlpha)
            : World.RENDERER.setClearAlpha(clearAlpha),
          _this.disableClear && (World.RENDERER.autoClear = autoClear),
          _needsRenderCount > 0 && (_needsRenderCount -= 1),
          (_rendered = !0));
      }
      function noop() {}
      function hitUpdate(hit) {
        let x = hit.uv.x * _width,
          y = (1 - hit.uv.y) * _height;
        ((_usingFingers = hit.usingFinger),
          (_this.isHitting = !0),
          _mouse.set(x, y),
          _enabled &&
            _interaction &&
            (hit.usingFinger
              ? _interaction.testWithFinger(_mouse, hit.distance)
              : _interaction.testWith(_mouse)));
      }
      function missUpdate() {
        ((_this.isHitting = !1),
          _mouse.set(9999, 9999),
          _interaction &&
            (_usingFingers
              ? _interaction.testWithFinger(_mouse, 9999)
              : _interaction.testWith(_mouse)));
      }
      function raycastMove(e) {
        _ray || (_ray = _this.initClass(Raycaster, _hitCamera));
        let hit,
          input = Interaction3D.find(_hitCamera).input;
        if (Array.isArray(input.obj)) {
          _cacheHits.length = 0;
          for (let i = 0; i < input.obj.length; i++) {
            let obj = input.obj[i];
            _v3.set(0, 0, -1).applyQuaternion(obj.quaternion);
            let hit = _ray.checkFromValues($glObj.mesh, obj.position, _v3)[0];
            hit && _cacheHits.push(hit);
          }
          (_cacheHits.sort((a, b) => a.distance - b.distance),
            (hit = _cacheHits[0]));
        } else
          "2d" == input.type
            ? (hit = _ray.checkHit(
                $glObj.mesh,
                input.position,
                input.rect || Stage,
              )[0])
            : (_v3.set(0, 0, -1).applyQuaternion(input.quaternion),
              (hit = _ray.checkFromValues(
                $glObj.mesh,
                input.position,
                _v3,
              )[0]));
        (_hitEvt ||
          (_hitEvt = {
            normal: new Vector2(),
            tilt: new Vector2(),
            pos: new Vector2(),
          }),
          hit
            ? (_hitEvt.normal.set(hit.uv.x, 1 - hit.uv.y),
              _hitEvt.tilt.set(
                Math.range(_hitEvt.normal.x, 0, 1, -1, 1),
                Math.range(_hitEvt.normal.y, 0, 1, -1, 1),
              ),
              _hitEvt.pos.set(
                _hitEvt.normal.x * _width,
                _hitEvt.normal.y * _height,
              ),
              (_hitEvt.hit = hit),
              _this.onDragMove && _this.onDragMove(_hitEvt))
            : _this.onDragMove && _this.onDragMove(null));
      }
      function flipNeedsRender() {
        if (!(--_needsRenderTimerCount > 0))
          return _needsRender && !_rendered
            ? scheduleFlipNeedsRender()
            : void (_needsRender = !1);
      }
      function scheduleFlipNeedsRender(time = 1) {
        ((_needsRenderTimerCount += 1), Timer.create(flipNeedsRender, time));
      }
      function doCheckObjectHit(object, callback) {
        if (_this._invisible) return;
        let hit = callback(Interaction3D.find(_hitCamera));
        if (hit) {
          let x = hit.uv.x * _width,
            y = (1 - hit.uv.y) * _height;
          return _interaction.checkObjectHit(object, { x: x, y: y });
        }
      }
      ((this.disableClear = !1),
        (function () {
          ("number" == typeof _layout &&
            ((_strict = _rtPool),
            (_rtPool = _h),
            (_h = _w),
            (_w = _layout),
            (_layout = { element: $gl() })),
            (_width = _w),
            (_height = _h),
            "boolean" == typeof _rtPool &&
              ((_strict = _rtPool), (_rtPool = null)));
          let dpr = _strict ? 1 : RenderManager.DPR;
          (_rtPool
            ? (_this.rt = _rtPool.nullRT)
            : ((_rt = Utils3D.createRT(
                _width * dpr,
                _height * dpr,
                null,
                Texture.RGBAFormat,
              )),
              (_this.rt = _rt)),
            (_this.root = _layout.element),
            (_this.root.stageLayoutCapture = _this),
            _scene.add(_layout.element.group),
            (_camera = new OrthographicCamera()).setViewport(_width, _height),
            (_camera.position.z = 1),
            (_camera.position.x = _width / 2),
            (_camera.position.y = -_height / 2),
            (_scene.disableAutoSort = !0),
            _stage.set(_width, _height),
            (function findHitCamera() {
              let p = _this.parent;
              for (; p; ) {
                if (((_hitCamera = p.nuke?.camera), _hitCamera)) return;
                p = p.parent;
              }
              _hitCamera = World.CAMERA;
            })(),
            (_interaction = _this.initClass(
              GLUIStageInteraction2D,
              _camera,
              _scene,
              _stage,
              !0,
            )),
            _this.startRender(loop, RenderManager.AFTER_LOOPS));
        })(),
        (this.onVisible = function () {
          _rtPool && (_rt = _this.rt = _rtPool.getRT());
        }),
        (this.onInvisible = function () {
          _rtPool && _rtPool.putRT(_rt);
        }),
        (this.setSize = function (width, height) {
          ((_width = width),
            (_height = height),
            _camera.setViewport(_width, _height),
            (_camera.position.z = 1),
            (_camera.position.x = _width / 2),
            (_camera.position.y = -_height / 2),
            _stage.set(width, height));
        }),
        (this.render = function () {
          render();
        }),
        this.get("object3d", () => $glObj),
        this.set("object3d", (gl) => {
          (gl.mesh || (gl = { mesh: gl }),
            (($glObj = gl).mesh.onHitUpdate = hitUpdate),
            ($glObj.mesh.onMissUpdate = missUpdate),
            _hitCamera &&
              Interaction3D.find(_hitCamera).add($glObj.mesh, noop, noop));
        }),
        this.get("camera", () => _camera),
        this.set("hitCamera", (camera) => {
          camera != _hitCamera &&
            ($glObj && Interaction3D.find(_hitCamera).remove($glObj.mesh),
            (_hitCamera = camera),
            $glObj &&
              Interaction3D.find(_hitCamera).add($glObj.mesh, noop, noop),
            _ray && (_ray.camera = _hitCamera));
        }),
        this.set("enabled", (v) => {
          ((_interaction._disabled = !v), (_enabled = v));
        }),
        this.get("enabled", (_) => _enabled),
        this.set("mouseEnabled", (v) => {
          v
            ? ((_interaction._disabled = !1),
              ($glObj.mesh.onHitUpdate = hitUpdate),
              ($glObj.mesh.onMissUpdate = missUpdate),
              _hitCamera &&
                Interaction3D.find(_hitCamera).add($glObj.mesh, noop, noop))
            : ((_interaction._disabled = !0),
              $glObj &&
                (_hitCamera &&
                  Interaction3D.find(_hitCamera).remove($glObj.mesh),
                delete $glObj.mesh.onHitUpdate,
                delete $glObj.mesh.onMissUpdate));
        }),
        this.set("layout", (layout) => {
          (_layout && _scene.remove(_layout.element.group),
            _scene.add(layout.element.group),
            (_layout = layout));
        }),
        this.get("layout", (_) => _layout),
        this.get("scene", (_) => _scene),
        this.get("width", (_) => _width),
        this.get("height", (_) => _height),
        (this.onVisible = function () {
          (_rtPool && (_rt = _this.rt = _rtPool.getRT()),
            (_this.needsRenderCount = 10));
        }),
        (this.onInvisible = function () {
          _rtPool &&
            _this.rt != _rtPool.nullRT &&
            (_rtPool.putRT(_this.rt), (_rt = _this.rt = _rtPool.nullRT));
        }),
        (this.onDestroy = function () {
          (_rtPool ? _this.onInvisible() : _this.rt.destroy(),
            $glObj &&
              (Interaction3D.find(_hitCamera).remove($glObj.mesh),
              delete $glObj.mesh.onHitUpdate,
              delete $glObj.mesh.onMissUpdate));
        }),
        (this.bindMove = function () {
          _this.startRender(raycastMove);
        }),
        (this.unbindMove = function () {
          _this.stopRender(raycastMove);
        }),
        this.get("needsRender", () => _needsRender),
        this.set("needsRender", (value) => {
          ((_needsRender = !0),
            (_rendered = !1),
            scheduleFlipNeedsRender("number" == typeof value ? value : 1e3));
        }),
        this.get("needsRenderCount", () => _needsRenderCount),
        this.set("needsRenderCount", (value) => {
          _needsRenderCount = Math.max(_needsRenderCount, value);
        }),
        (_this.checkObjectHit = function (object, mouse) {
          return doCheckObjectHit(object, (interaction) =>
            interaction.checkObjectHit($glObj.mesh, mouse),
          );
        }),
        (_this.checkObjectFromValues = function (object, origin, direction) {
          return doCheckObjectHit(object, (interaction) =>
            interaction.checkObjectFromValues($glObj.mesh, origin, direction),
          );
        }),
        (_this.getObjectHitLocalCoords = function (v, object, mouse) {
          return (
            Interaction3D.find(_hitCamera).getObjectHitLocalCoords(
              v,
              $glObj.mesh,
              mouse,
            ),
            (mouse = { x: (0.5 + v.x) * _width, y: (0.5 - v.y) * _height }),
            _interaction.getObjectHitLocalCoords(v, object.mesh, mouse)
          );
        }));
    },
    (_) => {
      GLUITexture.createRTPool = function (width, height, strict) {
        let pool = RTPool.instance().clone({ format: Texture.RGBAFormat }),
          dpr = strict ? 1 : RenderManager.DPR;
        return (pool.setSize(width * dpr, height * dpr), pool);
      };
    },
  ),
  Class(function GLUITextureDragHelper(_capture, $obj) {
    Inherit(this, Component);
    const _this = this;
    function dragMove(e) {
      (_this.flag("persist") ||
        (e || _capture.unbindMove(),
        e &&
          _this.flag("handMode") &&
          e.hit.distance > _this.distanceThreshold &&
          _capture.unbindMove()),
        !_this.onDragMove ||
          (_this.flag("persist") && !e) ||
          _this.onDragMove(e));
    }
    function vrButton(e) {
      _this.flag("persist") ||
        ("trigger" == e.label &&
          (e.pressed
            ? _this.flag("hover") && _capture.bindMove()
            : _capture.unbindMove()));
    }
    function mouseDown(e) {
      _this.flag("persist") ||
        (_this.flag("mouse_down", !0),
        _this.flag("hover") && _capture.bindMove());
    }
    function mouseUp(e) {
      _this.flag("persist") ||
        (_this.flag("mouse_down", !1), _capture.unbindMove());
    }
    function hover(e) {
      _this.flag("persist") ||
        (_this.flag("hover", "over" == e.action),
        window.VRInput &&
          (VRInput.isSetupFakeHands || VRInput.isSetupHands) &&
          (_this.flag("handMode", !0), _capture.bindMove()));
    }
    ((this.distanceThreshold = 0.2),
      $obj && $obj.interact(hover, (_) => {}),
      (function addListeners() {
        (_this.events.sub(Mouse.input, Interaction.START, mouseDown),
          _this.events.sub(Mouse.input, Interaction.END, mouseUp),
          window.VRInput &&
            VRInput.ready().then((_) => {
              VRInput.controllers.forEach((c) => {
                _this.events.sub(VRInput.BUTTON, vrButton);
              });
            }));
      })(),
      (_capture.onDragMove = dragMove),
      (this.persistMove = function () {
        (_capture.bindMove(), _this.flag("persist", !0));
      }));
  }),
  Module(function FirefoxGPUFixer() {
    this.exports = function () {
      GPU.detect("radeon r9 200") &&
        ("mac" == Device.system.os || Device.pixelRatio > 1) &&
        (Device.graphics.webgl.gpu = "radeon pro 455");
    };
  }),
  Class(function GPU() {
    Inherit(this, Component);
    var _this = this,
      _split = {};
    (Hydra.ready(async () => {
      for (var key in ((_this.detect = function (match) {
        if (Device.graphics.gpu) return Device.graphics.gpu.detect(match);
      }),
      (_this.detectAll = function () {
        if (Device.graphics.gpu) {
          for (var match = !0, i = 0; i < arguments.length; i++)
            Device.graphics.gpu.detect(arguments[i]) || (match = !1);
          return match;
        }
      }),
      (_this.matchGPU = function (str, min, max = 99999) {
        let num = (function splitGPU(string) {
          if (_split[string]) return _split[string];
          if (!_this.detect(string)) return -1;
          try {
            var num = Number(
              _this.gpu
                .split(string)[1]
                .split(" ")[0]
                .replace(/[^a-zA-Z0-9]/g, "")
                .trim(),
            );
            return ((_split[string] = num), num);
          } catch (e) {
            return -1;
          }
        })(str);
        return num >= min && num < max;
      }),
      (_this.gpu = Device.graphics.gpu ? Device.graphics.gpu.identifier : ""),
      "apple gpu" == _this.gpu &&
        (Device.mobile
          ? await require("iOSGPUTest")()
          : require("MacOSPerformanceTest")()),
      "firefox" === Device.system.browser && require("FirefoxGPUFixer")(),
      (_this.BLOCKLIST = require("GPUBlocklist").match()),
      (_this.T0 = !(
        Device.mobile ||
        (!_this.BLOCKLIST &&
          !_this.detect("radeon(tm) r5") &&
          !_this.detect("radeon r9 200") &&
          !_this.detect("hd graphics family") &&
          !_this.detect("intel(r) uhd graphics direct") &&
          !_this.matchGPU("hd graphics ", 1e3, 5001) &&
          !(_this.matchGPU("hd graphics ", 0, 618) && Device.pixelRatio > 1) &&
          !(
            _this.detect(["hd graphics", "iris"]) &&
            Math.max(Stage.width, Stage.height) > 1800
          ) &&
          !_this.detect(["intel iris opengl engine"]) &&
          !_this.matchGPU("iris(tm) graphics ", 1e3))
      )),
      (_this.T1 = !(
        _this.BLOCKLIST ||
        Device.mobile ||
        _this.T0 ||
        (!_this.matchGPU("iris(tm) graphics ", 540, 1e3) &&
          !_this.matchGPU("hd graphics ", 514, 1e3) &&
          !_this.matchGPU("intel(r) uhd graphics ", 600, 1e3) &&
          _this.detect(["nvidia", "amd", "radeon", "geforce"]) &&
          !_this.detect(["vega 8"]))
      )),
      (_this.T2 =
        !_this.BLOCKLIST &&
        !Device.mobile &&
        !(
          !_this.detect(["nvidia", "amd", "radeon", "geforce"]) ||
          _this.T1 ||
          _this.T0
        )),
      (_this.T3 = !(
        _this.BLOCKLIST ||
        Device.mobile ||
        (!_this.detect(["titan", "amd radeon pro", "quadro"]) &&
          !_this.matchGPU("gtx ", 940) &&
          !_this.matchGPU("radeon (tm) rx ", 400) &&
          !_this.detect("amd radeon(tm) graphics direct3d11 vs_5_0") &&
          !_this.matchGPU("radeon rx ", 400) &&
          !_this.matchGPU("radeon pro ", 420))
      )),
      (_this.T4 = !(
        _this.BLOCKLIST ||
        Device.mobile ||
        (!_this.detect(["titan", "quadro", "radeon vii", "apple m"]) &&
          !_this.matchGPU("gtx ", 1060) &&
          !_this.matchGPU("rtx") &&
          !_this.matchGPU("radeon rx ", 500) &&
          !_this.matchGPU("vega ", 50) &&
          !_this.detect([
            "radeon pro 5300m",
            "radeon pro 5500m",
            "radeon pro 5600m",
            "amd radeon unknown prototype",
          ]))
      )),
      (_this.T5 = !(
        _this.BLOCKLIST ||
        Device.mobile ||
        (!_this.detect(["titan", "radeon vii"]) &&
          !_this.matchGPU("gtx ", 1080) &&
          !_this.matchGPU("rtx ", 2060) &&
          !_this.matchGPU("radeon rx ", 5500) &&
          (!_this.detect("apple m") || !_this.detect("max")))
      )),
      (_this.MT0 =
        !!Device.mobile &&
        (!!_this.BLOCKLIST ||
          !("ios" != Device.system.os || !_this.detect("a7")) ||
          !("android" != Device.system.os || !_this.detect("sgx")) ||
          (_this.detect("adreno")
            ? _this.matchGPU("adreno (tm) ", 0, 415)
            : _this.detect("mali")
              ? _this.matchGPU("mali-t", 0, 628)
              : !("ios" != Device.system.os || !_this.detect(["a8", "a9"])) ||
                !!_this.detect("mali-g") ||
                !!_this.matchGPU("adreno (tm) ", 420)))),
      (_this.MT1 = (function () {
        if (!Device.mobile) return !1;
        if (_this.BLOCKLIST) return !1;
        if ("ios" == Device.system.os && _this.detect("a10")) return !0;
        if ("android" == Device.system.os && !_this.MT0) return !0;
        if (_this.detect("nvidia tegra") && Device.detect("pixel c")) return !0;
        if (_this.detect("mali-g")) return _this.matchGPU("mali-g", 73);
        if (_this.detect("adreno")) {
          if (_this.matchGPU("adreno (tm) ", 600, 616)) return !0;
          if (_this.matchGPU("adreno (tm) ", 530, 600)) return !0;
        }
        return !1;
      })()),
      (_this.MT2 =
        !!Device.mobile &&
        !_this.BLOCKLIST &&
        (!("ios" != Device.system.os || !_this.detect(["a11", "a12"])) ||
          (_this.detect("adreno")
            ? _this.matchGPU("adreno (tm) ", 630)
            : _this.detect("mali-g")
              ? _this.matchGPU("mali-g", 74)
              : !(
                  !navigator.platform
                    .toLowerCase()
                    .includes(["mac", "windows"]) ||
                  "chrome" != Device.system.browser
                )))),
      (_this.MT3 =
        !!Device.mobile &&
        !_this.BLOCKLIST &&
        (!(
          "ios" != Device.system.os ||
          !_this.detect(["a12", "a13", "a14", "a15", "a16", "a17", "a18"])
        ) ||
          (_this.detect("adreno")
            ? _this.matchGPU("adreno (tm) ", 640)
            : _this.detect("mali-g")
              ? _this.matchGPU("mali-g", 76)
              : !(
                  !navigator.platform
                    .toLowerCase()
                    .includes(["mac", "windows"]) ||
                  "chrome" != Device.system.browser
                )))),
      (_this.MT4 =
        !!Device.mobile &&
        !_this.BLOCKLIST &&
        (!(
          "ios" != Device.system.os ||
          !_this.detect([
            "a14",
            "a15",
            "a16",
            "a17",
            "a18",
            "a19",
            "a20",
            "apple m",
          ])
        ) ||
          (_this.detect("adreno")
            ? _this.matchGPU("adreno (tm) ", 650)
            : _this.detect("mali-g")
              ? _this.detect("mali-g710") || _this.matchGPU("mali-g", 78)
              : !(
                  !navigator.platform
                    .toLowerCase()
                    .includes(["mac", "windows"]) ||
                  "chrome" != Device.system.browser
                )))),
      (_this.MT5 =
        !!Device.mobile &&
        !_this.BLOCKLIST &&
        (!(
          "ios" != Device.system.os ||
          !_this.detect([
            "a16",
            "a17",
            "a18",
            "a19",
            "a20",
            "a21",
            "a22",
            "a23",
            "a24",
            "a25",
            "apple m",
          ])
        ) ||
          (_this.detect("adreno")
            ? _this.matchGPU("adreno (tm) ", 740)
            : !(
                !navigator.platform
                  .toLowerCase()
                  .includes(["mac", "windows"]) ||
                "chrome" != Device.system.browser
              )))),
      (_this.lt = function (num) {
        return _this.TIER > -1 && _this.TIER <= num;
      }),
      (_this.gt = function (num) {
        return _this.TIER > -1 && _this.TIER >= num;
      }),
      (_this.eq = function (num) {
        return _this.TIER > -1 && _this.TIER == num;
      }),
      (_this.mobileEq = function (num) {
        return _this.M_TIER > -1 && _this.M_TIER == num;
      }),
      (_this.mobileLT = function (num) {
        return _this.M_TIER > -1 && _this.M_TIER <= num;
      }),
      (_this.mobileGT = function (num) {
        return _this.M_TIER > -1 && _this.M_TIER >= num;
      }),
      _this))
        ("T" == key.charAt(0) &&
          !0 === _this[key] &&
          (_this.TIER = Number(key.charAt(1))),
          "MT" == key.slice(0, 2) &&
            !0 === _this[key] &&
            (_this.M_TIER = Number(key.charAt(2))));
      (!1 !== Utils.query("gpu") &&
        (Device.mobile || Utils.query("gpu").toString().includes("m")
          ? ((_this.TIER = -1),
            (_this.M_TIER = Number(Utils.query("gpu").slice(1))))
          : (_this.TIER = Number(Utils.query("gpu")))),
        "ios" == Device.system.os &&
          Render.REFRESH_RATE < 40 &&
          (_this.M_TIER -= 1),
        (_this.OVERSIZED =
          (!Device.mobile &&
            _this.TIER <= 0 &&
            Math.max(window.innerWidth, window.innerHeight) > 1400) ||
          (!Device.mobile &&
            _this.TIER <= 1 &&
            Device.pixelRatio < 2 &&
            Math.max(window.innerWidth, window.innerHeight) > 1600)),
        "ie" == Device.system.browser && (_this.OVERSIZED = !0),
        (_this.initialized = !0));
    }),
      (this.ready = function () {
        return this.wait("initialized");
      }));
  }, "static"),
  Module(function GPUCalculations() {
    this.exports = {
      hash: function hash() {
        var imageHash = 0,
          canvas = document.createElement("canvas");
        if (null != canvas) {
          var imageData = (function drawImage(canvas) {
            ((canvas.width = 67), (canvas.height = 67));
            var ctx = canvas.getContext("2d", { alpha: !0 });
            if (null != ctx)
              return (
                (ctx.imageSmoothingQuality = "low"),
                (ctx.imageSmoothingEnabled = !0),
                (ctx.globalCompositeOperation = "source-over"),
                (ctx.globalAlpha = 1),
                (ctx.miterLimit = 1 / 0),
                (ctx.filter = "none"),
                (ctx.lineCap = "butt"),
                (ctx.lineDashOffset = 0),
                (ctx.lineJoin = "miter"),
                (ctx.font = "10pt Arial"),
                (ctx.lineWidth = 2),
                void 0 !== ctx.setLineDash && ctx.setLineDash([10, 20]),
                (ctx.shadowColor = "black"),
                (ctx.shadowOffsetX = -3),
                (ctx.shadowOffsetY = -5),
                ctx.translate(canvas.width / 2, canvas.height / 2),
                ctx.rotate(0.8901179),
                (ctx.fillStyle = "green"),
                (ctx.textAlign = "center"),
                (ctx.textBaseline = "middle"),
                ctx.fillText("*51Degrees*", 0, 0),
                ctx.beginPath(),
                (ctx.shadowColor = "yellow"),
                (ctx.shadowBlur = 1),
                (ctx.shadowOffsetX = 1),
                (ctx.shadowOffsetY = 1),
                (ctx.strokeStyle = "red"),
                (ctx.fillStyle = "rgba(0, 0, 255, 0.6)"),
                void 0 === ctx.ellipse
                  ? ctx.arc(0, 0, 25, 0, 2 * Math.PI)
                  : ctx.ellipse(0, 0, 25, 15, Math.PI / 4, 0, 2 * Math.PI),
                ctx.fill(),
                ctx.stroke(),
                canvas.toDataURL()
              );
          })(canvas);
          imageData &&
            (imageHash = (function fnvHash(str) {
              for (var h = 2166136261, i = 0; i < str.length; ++i)
                ((h ^= str.charCodeAt(i)),
                  (h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)));
              return h >>> 0;
            })(imageData));
        }
        return imageHash;
      },
      primeTest: function primeTest() {
        let results = [];
        function getPrime() {
          return (function largest_prime_factor(n) {
            return factors(n).filter(primep).pop();
          })(1e12);
        }
        function factors(n) {
          var i,
            out = [],
            sqrt_n = Math.sqrt(n);
          for (i = 2; i <= sqrt_n; i++) n % i == 0 && out.push(i);
          return out;
        }
        function primep(n) {
          return 0 === factors(n).length;
        }
        for (let i = 0; i < 3; i++) {
          let time = performance.now();
          (getPrime(), results.push(10 * (performance.now() - time)));
        }
        return (results.sort((a, b) => a - b), results[0]);
      },
    };
  }),
  Module(function MacOSPerformanceTest() {
    const { hash: hash, primeTest: primeTest } = require("GPUCalculations");
    this.exports = function () {
      let hashValue = hash().toString();
      switch (((Global.MACOSHASHVALUE = hashValue), hashValue)) {
        case "154539004":
        case "2370358002":
          return (Device.graphics.webgl.gpu = "intel iris opengl engine");
        case "174373703":
          return (Device.graphics.webgl.gpu = "apple m1");
        case "245727699":
          return (Device.graphics.webgl.gpu = "apple m1 pro");
        case "2650655516":
          return (Device.graphics.webgl.gpu = "apple m1 max");
        case "1031999577":
        case "604831120":
        case "1085686600":
        case "1589747348":
          return (Device.graphics.webgl.gpu = "amd radeon pro 5500m");
        case "2267488256":
          return (Device.graphics.webgl.gpu = "apple m2");
        case "640654249":
          return (Device.graphics.webgl.gpu = "apple m4 max");
      }
      let result = primeTest();
      if (result < 100) return (Device.graphics.webgl.gpu = "apple m1 max");
      screen.width <= 1440 && screen.height <= 900
        ? (Device.graphics.webgl.gpu =
            result > 540 ? "intel iris opengl engine" : "safari tier 1")
        : (Device.graphics.webgl.gpu =
            result > 475
              ? result > 540
                ? "intel iris opengl engine"
                : "safari tier 1"
              : result < 375
                ? "amd radeon pro 455 opengl engine"
                : "nvidia geforce 750m opengl engine");
    };
  }),
  Module(function iOSGPUTest() {
    function hash3d() {
      var gl,
        program,
        canvas,
        mat4 = {
          create: function () {
            for (var result = new Array(16), i = 0; i < 16; i++)
              result[i] = i % 5 == 0 ? 1 : 0;
            return result;
          },
          perspective: function (out, fovy, aspect, near, far) {
            var nf,
              f = 1 / Math.tan(fovy / 2);
            return (
              (out[0] = f / aspect),
              (out[1] = 0),
              (out[2] = 0),
              (out[3] = 0),
              (out[4] = 0),
              (out[5] = f),
              (out[6] = 0),
              (out[7] = 0),
              (out[8] = 0),
              (out[9] = 0),
              (out[11] = -1),
              (out[12] = 0),
              (out[13] = 0),
              (out[15] = 0),
              null != far && far !== 1 / 0
                ? ((nf = 1 / (near - far)),
                  (out[10] = (far + near) * nf),
                  (out[14] = 2 * far * near * nf))
                : ((out[10] = -1), (out[14] = -2 * near)),
              out
            );
          },
          lookAt: function (out, eye, center, up) {
            var x0,
              x1,
              x2,
              y0,
              y1,
              y2,
              z0,
              z1,
              z2,
              len,
              eyex = eye[0],
              eyey = eye[1],
              eyez = eye[2],
              upx = up[0],
              upy = up[1],
              upz = up[2],
              centerx = center[0],
              centery = center[1],
              centerz = center[2];
            return Math.abs(eyex - centerx) < 1e-6 &&
              Math.abs(eyey - centery) < 1e-6 &&
              Math.abs(eyez - centerz) < 1e-6
              ? mat4.identity(out)
              : ((z0 = eyex - centerx),
                (z1 = eyey - centery),
                (z2 = eyez - centerz),
                (x0 =
                  upy * (z2 *= len = 1 / Math.hypot(z0, z1, z2)) -
                  upz * (z1 *= len)),
                (x1 = upz * (z0 *= len) - upx * z2),
                (x2 = upx * z1 - upy * z0),
                (len = Math.hypot(x0, x1, x2))
                  ? ((x0 *= len = 1 / len), (x1 *= len), (x2 *= len))
                  : ((x0 = 0), (x1 = 0), (x2 = 0)),
                (y0 = z1 * x2 - z2 * x1),
                (y1 = z2 * x0 - z0 * x2),
                (y2 = z0 * x1 - z1 * x0),
                (len = Math.hypot(y0, y1, y2))
                  ? ((y0 *= len = 1 / len), (y1 *= len), (y2 *= len))
                  : ((y0 = 0), (y1 = 0), (y2 = 0)),
                (out[0] = x0),
                (out[1] = y0),
                (out[2] = z0),
                (out[3] = 0),
                (out[4] = x1),
                (out[5] = y1),
                (out[6] = z1),
                (out[7] = 0),
                (out[8] = x2),
                (out[9] = y2),
                (out[10] = z2),
                (out[11] = 0),
                (out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez)),
                (out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez)),
                (out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez)),
                (out[15] = 1),
                out);
          },
          multiply: function (out, a, b) {
            var a00 = a[0],
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
              out
            );
          },
          identity: function (out) {
            return (
              (out[0] = 1),
              (out[1] = 0),
              (out[2] = 0),
              (out[3] = 0),
              (out[4] = 0),
              (out[5] = 1),
              (out[6] = 0),
              (out[7] = 0),
              (out[8] = 0),
              (out[9] = 0),
              (out[10] = 1),
              (out[11] = 0),
              (out[12] = 0),
              (out[13] = 0),
              (out[14] = 0),
              (out[15] = 1),
              out
            );
          },
        };
      var imageHash = 0;
      if (null != (canvas = document.createElement("canvas"))) {
        var imageData = (function generate() {
          if (
            (gl = (function getRenderingContext() {
              ((canvas.width = 67), (canvas.height = 67));
              var gl =
                canvas.getContext("webgl") ||
                canvas.getContext("experimental-webgl");
              return (
                gl &&
                  (gl.viewport(0, 0, 67, 67),
                  gl.clearColor(0, 0, 0, 1),
                  gl.clear(gl.COLOR_BUFFER_BIT)),
                gl
              );
            })())
          ) {
            var vertexShader = gl.createShader(gl.VERTEX_SHADER);
            (gl.shaderSource(
              vertexShader,
              "attribute vec3 c,d; uniform vec4 e; uniform vec3 f,g;uniform mat4 h,i;varying vec3 j;void main(){vec3 a=normalize(d);vec4 b=h*vec4(c,1.);vec3 k=normalize(vec3(e-b));j=g*f*max(dot(k,a),0.),gl_Position=i*vec4(c,1.);}",
            ),
              gl.compileShader(vertexShader));
            var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            (gl.shaderSource(
              fragmentShader,
              "#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec3 j;void main(){gl_FragColor = vec4(j, 1.0);}",
            ),
              gl.compileShader(fragmentShader),
              (program = gl.createProgram()),
              gl.attachShader(program, vertexShader),
              gl.attachShader(program, fragmentShader),
              gl.linkProgram(program),
              gl.detachShader(program, vertexShader),
              gl.detachShader(program, fragmentShader),
              gl.deleteShader(vertexShader),
              gl.deleteShader(fragmentShader),
              gl.useProgram(program));
            var n = (function initVertexBuffers(gl) {
              var latNumber,
                longNumber,
                vertexPositionData = [],
                normalData = [],
                textureCoordData = [],
                indexData = [];
              for (latNumber = 0; latNumber <= 50; ++latNumber) {
                var theta = (latNumber * Math.PI) / 50,
                  sinTheta = Math.sin(theta),
                  cosTheta = Math.cos(theta);
                for (longNumber = 0; longNumber <= 50; ++longNumber) {
                  var phi = (2 * longNumber * Math.PI) / 50,
                    sinPhi = Math.sin(phi),
                    x = Math.cos(phi) * sinTheta,
                    y = cosTheta,
                    z = sinPhi * sinTheta,
                    u = 1 - longNumber / 50,
                    v = 1 - latNumber / 50;
                  (vertexPositionData.push(2 * x),
                    vertexPositionData.push(2 * y),
                    vertexPositionData.push(2 * z),
                    normalData.push(x),
                    normalData.push(y),
                    normalData.push(z),
                    textureCoordData.push(u),
                    textureCoordData.push(v));
                }
              }
              for (latNumber = 0; latNumber < 50; ++latNumber)
                for (longNumber = 0; longNumber < 50; ++longNumber) {
                  var first = 51 * latNumber + longNumber,
                    second = first + 50 + 1;
                  (indexData.push(first),
                    indexData.push(second),
                    indexData.push(first + 1),
                    indexData.push(second),
                    indexData.push(second + 1),
                    indexData.push(first + 1));
                }
              ((vertexPositionData = new Float32Array(vertexPositionData)),
                (normalData = new Float32Array(normalData)),
                (textureCoordData = new Float32Array(textureCoordData)),
                (indexData = new Uint16Array(indexData)));
              var vertexPositionBuffer = gl.createBuffer(),
                vertexNormalBuffer = gl.createBuffer(),
                indexBuffer = gl.createBuffer();
              (gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer),
                gl.bufferData(
                  gl.ARRAY_BUFFER,
                  vertexPositionData,
                  gl.STATIC_DRAW,
                ));
              var VertexPosition = gl.getAttribLocation(program, "c");
              (gl.vertexAttribPointer(VertexPosition, 3, gl.FLOAT, !1, 0, 0),
                gl.enableVertexAttribArray(VertexPosition),
                gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer),
                gl.bufferData(gl.ARRAY_BUFFER, normalData, gl.STATIC_DRAW));
              var VertexNormal = gl.getAttribLocation(program, "d");
              return (
                gl.vertexAttribPointer(VertexNormal, 3, gl.FLOAT, !1, 0, 0),
                gl.enableVertexAttribArray(VertexNormal),
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer),
                gl.bufferData(
                  gl.ELEMENT_ARRAY_BUFFER,
                  indexData,
                  gl.STATIC_DRAW,
                ),
                indexData.length
              );
            })(gl);
            (gl.clearColor(0, 0, 0, 1), gl.enable(gl.DEPTH_TEST));
            var projection = mat4.create();
            mat4.perspective(projection, Math.PI / 6, 1, 0.1, 100);
            var modelView = mat4.create();
            mat4.lookAt(modelView, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
            var mvpMatrix = mat4.create();
            mat4.multiply(mvpMatrix, projection, modelView);
            var ModelViewMatrix = gl.getUniformLocation(program, "h");
            gl.uniformMatrix4fv(ModelViewMatrix, !1, modelView);
            var MVP = gl.getUniformLocation(program, "i");
            gl.uniformMatrix4fv(MVP, !1, mvpMatrix);
            var LightPosition = gl.getUniformLocation(program, "e");
            gl.uniform4fv(LightPosition, [10, 10, 10, 1]);
            var Kd = gl.getUniformLocation(program, "f");
            gl.uniform3fv(Kd, [0.9, 0.5, 0.3]);
            var Ld = gl.getUniformLocation(program, "g");
            return (
              gl.uniform3fv(Ld, [1, 1, 1]),
              gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT),
              gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0),
              (function cleanup() {
                (gl.useProgram(null), program && gl.deleteProgram(program));
              })(),
              canvas.toDataURL()
            );
          }
        })();
        imageData &&
          (imageHash = (function fnvHash(str) {
            for (var h = 2166136261, i = 0; i < str.length; ++i)
              ((h ^= str.charCodeAt(i)),
                (h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)));
            return h >>> 0;
          })(imageData));
      }
      return imageHash;
    }
    const { hash: hash, primeTest: primeTest } = require("GPUCalculations");
    function getRenderer(complete) {
      /*! VERSION = 1.657942 */
      var decisionTree = {
        Version: "1.657942",
        PublishDate: "2023-10-05T13:31:50.4807708Z",
        Data: [
          {
            x: "Unknown",
            m: function (n) {
              return (function family() {
                var segments = /iPhone|iPad|Macintosh/.exec(
                  navigator.userAgent,
                );
                if (segments && segments.length > 0) return segments[0];
                return "";
              })();
            },
            n: [108, 3, 2, 1],
          },
          {
            x: "Apple A9X GPU|Apple A10X GPU|Apple A9 GPU|Apple A10 GPU|Apple A11 GPU|Apple A12X GPU|Apple A12 GPU|Apple A8 GPU|Apple A8X GPU|Apple A13 GPU|Apple A14 GPU|Apple M1 GPU|Apple A12Z GPU|Apple A15 GPU|Apple A7 GPU|Apple A16 GPU|Apple M2 GPU|Apple A17 Pro GPU",
            m: function (n) {
              return height();
            },
            n: [
              109, 63, 60, 61, 62, 47, 45, 46, 33, 36, 32, 34, 35, 23, 18, 19,
              11, 6, 7, 5,
            ],
            v: ["Macintosh"],
          },
          {
            x: "Apple A7 GPU|Apple A8 GPU|Apple A9 GPU|Apple A10 GPU|Apple A11 GPU|Apple A12 GPU|Apple A13 GPU|Apple A14 GPU|Apple A15 GPU|Apple A16 GPU|Apple A17 Pro GPU",
            m: function (n) {
              return height();
            },
            n: [60, 61, 62, 44, 45, 46, 30, 31, 23, 17, 12, 6, 7],
            v: ["iPhone"],
          },
          {
            x: "Apple A7 GPU|Apple A8 GPU|Apple A9X GPU|Apple A10X GPU|Apple A9 GPU|Apple A12X GPU|Apple A10 GPU|Apple A12 GPU|Apple A8X GPU|Apple M1 GPU|Apple A14 GPU|Apple A12Z GPU|Apple A15 GPU|Apple A13 GPU|Apple M2 GPU",
            m: function (n) {
              return height();
            },
            n: [109, 110, 63, 47, 33, 32, 18, 4],
            v: ["iPad"],
          },
          {
            x: "Apple A7 GPU|Apple A8 GPU|Apple A9X GPU|Apple A10X GPU|Apple A9 GPU|Apple A12X GPU|Apple A10 GPU|Apple A12 GPU|Apple A8X GPU|Apple M1 GPU|Apple A12Z GPU|Apple M2 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [16, 13],
            v: [2048],
          },
          {
            x: "Apple A9X GPU|Apple A10X GPU|Apple A9 GPU|Apple A12X GPU|Apple A10 GPU|Apple A12 GPU|Apple A8 GPU|Apple A8X GPU|Apple M1 GPU|Apple A12Z GPU|Apple A7 GPU|Apple M2 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [16, 14],
            v: [2048],
          },
          {
            x: "Apple A11 GPU|Apple A12 GPU|Apple A13 GPU|Apple A14 GPU|Apple A15 GPU|Apple A16 GPU|Apple A17 Pro GPU",
            m: function (n) {
              return hash3d();
            },
            n: [114, 73, 74, 72, 75, 21, 26, 20, 8],
            v: [2436],
          },
          {
            x: "Apple A11 GPU|Apple A12 GPU|Apple A14 GPU|Apple A13 GPU|Apple A15 GPU|Apple A16 GPU|Apple A17 Pro GPU",
            m: function (n) {
              return hash3d();
            },
            n: [121, 120, 115, 50, 27, 28, 21, 9],
            v: [2079],
          },
          {
            x: "Apple A16 GPU|Apple A17 Pro GPU|Apple A14 GPU|Apple A15 GPU|Apple A12 GPU|Apple A13 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [43, 15],
            v: [3711606621],
          },
          {
            x: "Apple A17 Pro GPU|Apple A16 GPU|Apple A15 GPU|Apple A14 GPU|Apple A13 GPU|Apple A12 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [103, 10],
            v: [3711606621],
          },
          {
            x: "Apple A17 Pro GPU|Apple A16 GPU|Apple A15 GPU|Apple A14 GPU",
            v: [235283973],
          },
          {
            x: "Apple A9 GPU|Apple A10 GPU|Apple A11 GPU|Apple A13 GPU|Apple A15 GPU|Apple A7 GPU|Apple A8 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [38, 25],
            v: [1136],
          },
          {
            x: "Apple A7 GPU|Apple A9 GPU|Apple A10 GPU|Apple A11 GPU|Apple A8 GPU|Apple A13 GPU|Apple A15 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [37, 38],
            v: [1136],
          },
          {
            x: "Apple A7 GPU|Apple A8 GPU|Apple A9X GPU|Apple A9 GPU|Apple A10 GPU|Apple A8X GPU",
            m: function (n) {
              return hash(n);
            },
            n: [149, 148, 89, 90, 91, 92, 55, 56, 58, 54, 57],
            v: ["srgb"],
          },
          {
            x: "Apple A9X GPU|Apple A9 GPU|Apple A10 GPU|Apple A8 GPU|Apple A8X GPU|Apple A7 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [149, 153, 97, 98, 92, 55, 56, 58, 54],
            v: ["srgb"],
          },
          {
            x: "Apple A16 GPU|Apple A17 Pro GPU|Apple A14 GPU|Apple A15 GPU",
            v: [235283973],
          },
          {
            x: "Apple A10X GPU|Apple A9X GPU|Apple A12X GPU|Apple A12 GPU|Apple M1 GPU|Apple A12Z GPU|Apple M2 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [150, 126, 127, 94, 93, 95, 79],
            v: ["p3"],
          },
          {
            x: "Apple A8 GPU|Apple A9 GPU|Apple A10 GPU|Apple A11 GPU|Apple A13 GPU|Apple A15 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [68, 39],
            v: [1334],
          },
          {
            x: "Apple A9X GPU|Apple A10X GPU|Apple A12X GPU|Apple M1 GPU|Apple A12Z GPU|Apple M2 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [111, 24],
            v: [2732],
          },
          {
            x: "Apple A9 GPU|Apple A10 GPU|Apple A11 GPU|Apple A13 GPU|Apple A15 GPU|Apple A8 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [70, 39],
            v: [1334],
          },
          {
            x: "Apple A14 GPU|Apple A16 GPU|Apple A15 GPU|Apple A13 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [157, 100, 42],
            v: [3403189785],
          },
          {
            x: "Apple A14 GPU|Apple A15 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [22],
            v: [2364051618],
          },
          { x: "Apple A15 GPU|Apple A14 GPU", v: [2775654583] },
          {
            x: "Apple A14 GPU|Apple A15 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [74, 51, 40, 21, 29],
            v: [2532],
          },
          {
            x: "Apple A10X GPU|Apple A12X GPU|Apple M1 GPU|Apple A12Z GPU|Apple M2 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [152, 151, 150, 126, 127, 41],
            v: ["p3"],
          },
          {
            x: "Apple A9 GPU|Apple A10 GPU|Apple A7 GPU|Apple A8 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [155, 156, 99],
            v: ["srgb"],
          },
          { x: "Apple A14 GPU|Apple A16 GPU|Apple A15 GPU", v: [46273595] },
          {
            x: "Apple A14 GPU|Apple A15 GPU|Apple A16 GPU|Apple A13 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [157, 101, 102],
            v: [3403189785],
          },
          { x: "Apple A15 GPU|Apple A16 GPU|Apple A14 GPU", v: [46273595] },
          { x: "Apple A15 GPU|Apple A14 GPU", v: [3711606621] },
          {
            x: "Apple A8 GPU|Apple A10 GPU|Apple A11 GPU|Apple A9 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [64, 65],
            v: [2001],
          },
          {
            x: "Apple A8 GPU|Apple A9 GPU|Apple A10 GPU|Apple A11 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [66, 67],
            v: [2208],
          },
          {
            x: "Apple A12X GPU|Apple M1 GPU|Apple A12Z GPU|Apple M2 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [126, 127, 79, 78],
            v: [2388],
          },
          {
            x: "Apple A14 GPU|Apple M1 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [112, 48],
            v: [2360],
          },
          {
            x: "Apple A9 GPU|Apple A10 GPU|Apple A11 GPU|Apple A8 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [69, 67],
            v: [2208],
          },
          {
            x: "Apple A10 GPU|Apple A11 GPU|Apple A9 GPU|Apple A8 GPU",
            m: function (n) {
              return mediacolorgamut();
            },
            n: [71, 65],
            v: [2001],
          },
          {
            x: "Apple A14 GPU|Apple A15 GPU|Apple M2 GPU",
            m: function (n) {
              return (function ratio() {
                return window.devicePixelRatio;
              })();
            },
            n: [113, 49],
            v: [2778],
          },
          {
            x: "Apple A7 GPU|Apple A9 GPU|Apple A8 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [130, 131, 82, 83, 84],
            v: ["srgb"],
          },
          {
            x: "Apple A10 GPU|Apple A11 GPU|Apple A13 GPU|Apple A15 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [132, 133, 118, 134, 85, 86],
            v: ["p3"],
          },
          {
            x: "Apple A10 GPU|Apple A11 GPU|Apple A13 GPU|Apple A15 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [144, 145, 147, 146, 87, 88],
            v: ["p3"],
          },
          {
            x: "Apple A14 GPU|Apple A15 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [100, 104],
            v: [3403189785],
          },
          {
            x: "Apple M1 GPU|Apple A10X GPU|Apple A12Z GPU|Apple M2 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [174, 107, 159, 106],
            v: [3403189785],
          },
          { x: "Apple A14 GPU|Apple A16 GPU|Apple A15 GPU", v: [2775654583] },
          { x: "Apple A12 GPU|Apple A13 GPU", v: [3565683531] },
          {
            x: "Apple A14 GPU|Apple A15 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [74, 122, 77, 52, 29],
            v: [2778],
          },
          {
            x: "Apple A16 GPU|Apple A17 Pro GPU",
            m: function (n) {
              return hash3d();
            },
            n: [123],
            v: [2796],
          },
          {
            x: "Apple A16 GPU|Apple A17 Pro GPU",
            m: function (n) {
              return hash3d();
            },
            n: [123, 53],
            v: [2556],
          },
          {
            x: "Apple A10 GPU|Apple A12 GPU|Apple A13 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [128, 129, 80, 81],
            v: [2160],
          },
          {
            x: "Apple A14 GPU|Apple M1 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [74, 96, 59],
            v: ["p3"],
          },
          {
            x: "Apple A14 GPU|Apple A15 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [74, 122, 77, 52, 29],
            v: [3],
          },
          { x: "Apple A14 GPU", v: [105985484, 679860869] },
          { x: "Apple A15 GPU", v: [46273595, 679860869] },
          {
            x: "Apple A14 GPU|Apple A15 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [22],
            v: [3403189785],
          },
          { x: "Apple A17 Pro GPU|Apple A16 GPU", v: [3711606621] },
          { x: "Apple A7 GPU", v: [1915583345] },
          {
            x: "Apple A9X GPU|Apple A9 GPU|Apple A10 GPU",
            v: [3129316290, 3249312110],
          },
          {
            x: "Apple A9 GPU|Apple A9X GPU|Apple A10 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [168, 105],
            v: [2114570256],
          },
          { x: "Apple A7 GPU", v: [857422828] },
          {
            x: "Apple A9X GPU|Apple A9 GPU|Apple A10 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [171],
            v: [63583436],
          },
          {
            x: "Apple A14 GPU|Apple M1 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [175, 107],
            v: [3403189785],
          },
          {
            x: "Apple A12 GPU|Apple A13 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [116, 115, 76],
            v: [2688],
          },
          {
            x: "Apple A12 GPU|Apple A13 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [118, 117, 76],
            v: [1624],
          },
          {
            x: "Apple A12 GPU|Apple A13 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [118, 119, 76],
            v: [1792],
          },
          {
            x: "Apple A10X GPU|Apple A12 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [125, 124],
            v: [2224],
          },
          {
            x: "Apple A8 GPU|Apple A9 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [135, 136],
            v: ["srgb"],
          },
          {
            x: "Apple A10 GPU|Apple A11 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [137, 138],
            v: ["p3"],
          },
          {
            x: "Apple A8 GPU|Apple A9 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [139, 140],
            v: ["srgb"],
          },
          {
            x: "Apple A10 GPU|Apple A11 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [137, 141],
            v: ["p3"],
          },
          {
            x: "Apple A8 GPU|Apple A9 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [142, 143],
            v: ["srgb"],
          },
          {
            x: "Apple A9 GPU|Apple A8 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [154, 140],
            v: ["srgb"],
          },
          {
            x: "Apple A9 GPU|Apple A8 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [154, 143],
            v: ["srgb"],
          },
          {
            x: "Apple A9 GPU|Apple A8 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [154, 136],
            v: ["srgb"],
          },
          { x: "Apple A12 GPU", v: [958581112, 4085158452] },
          { x: "Apple A13 GPU", v: [1278953537, 3335845976, 4193218782] },
          { x: "Apple A14 GPU", v: [105985484] },
          { x: "Apple A12 GPU", v: [2301174800] },
          { x: "Apple A13 GPU|Apple A12 GPU", v: [3711606621] },
          {
            x: "Apple A14 GPU|Apple A15 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [104],
            v: [2364051618],
          },
          { x: "Apple A12X GPU|Apple A12Z GPU", v: [4085158452] },
          {
            x: "Apple M1 GPU|Apple M2 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [158, 159],
            v: [3403189785],
          },
          {
            x: "Apple A12 GPU|Apple A13 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [160, 75],
            v: [2206992415],
          },
          {
            x: "Apple A13 GPU|Apple A12 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [160, 75],
            v: [2866949877],
          },
          { x: "Apple A9 GPU", v: [46663968, 3129316290] },
          { x: "Apple A9 GPU", v: [2114570256] },
          { x: "Apple A9 GPU", v: [63583436] },
          {
            x: "Apple A13 GPU|Apple A15 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [161, 162],
            v: [3403189785],
          },
          {
            x: "Apple A13 GPU|Apple A15 GPU",
            m: function (n) {
              return hash(n);
            },
            n: [163, 164],
            v: [3711606621],
          },
          {
            x: "Apple A11 GPU|Apple A13 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [165, 166],
            v: [1349146759],
          },
          {
            x: "Apple A13 GPU|Apple A11 GPU",
            m: function (n) {
              return hash3d();
            },
            n: [167, 160],
            v: [2206992415],
          },
          {
            x: "Apple A8 GPU|Apple A8X GPU",
            v: [1361285941, 3816812018, 4125234388],
          },
          {
            x: "Apple A8 GPU|Apple A8X GPU",
            m: function (n) {
              return hash3d();
            },
            n: [169, 170],
            v: [4005673483],
          },
          {
            x: "Apple A8 GPU|Apple A8X GPU",
            m: function (n) {
              return hash3d();
            },
            n: [169],
            v: [1350183384],
          },
          {
            x: "Apple A8 GPU|Apple A8X GPU",
            m: function (n) {
              return hash3d();
            },
            n: [173, 172],
            v: [2870741841],
          },
          { x: "Apple A10X GPU|Apple A9X GPU", v: [583354101, 3458129248] },
          { x: "Apple A12X GPU|Apple A12 GPU", v: [4085158452] },
          { x: "Apple A10X GPU|Apple A9X GPU", v: [3928876783] },
          { x: "Apple M1 GPU", v: [2364051618] },
          {
            x: "Apple A8 GPU|Apple A8X GPU",
            m: function (n) {
              return hash3d();
            },
            n: [176, 170],
            v: [4005673483],
          },
          { x: "Apple A8 GPU|Apple A8X GPU", v: [1361285941] },
          {
            x: "Apple A9 GPU",
            v: [583354101, 3403189785, 3458129248, 3928876783],
          },
          { x: "Apple A14 GPU", v: [1349146759, 1444462398] },
          { x: "Apple A14 GPU", v: [1444462398] },
          { x: "Apple A15 GPU|Apple A16 GPU", v: [2775654583] },
          { x: "Apple A13 GPU|Apple A12 GPU", v: [3565683531] },
          { x: "Apple A15 GPU", v: [2775654583] },
          { x: "Apple A9X GPU|Apple A10 GPU", v: [3458129248] },
          { x: "Apple M1 GPU|Apple A12Z GPU", v: [1349146759] },
          { x: "Apple M1 GPU", v: [1444462398] },
          { x: "Apple A10 GPU", v: ["iPod Touch"] },
          { x: "Apple A15 GPU", v: [2266] },
          { x: "Apple M2 GPU", v: [2778] },
          { x: "Apple A9X GPU", v: ["srgb"] },
          { x: "Apple A14 GPU", v: ["srgb"] },
          { x: "Apple M2 GPU", v: [2] },
          { x: "Apple A11 GPU", v: [367695777, 411650080, 1220644697] },
          { x: "Apple A12 GPU", v: [958581112, 2301174800, 4085158452] },
          {
            x: "Apple A13 GPU",
            v: [352823931, 1278953537, 3335845976, 4193218782],
          },
          {
            x: "Apple A12 GPU",
            v: [0, 958581112, 2301174800, 3403189785, 4085158452],
          },
          { x: "Apple A13 GPU", v: [352823931, 3335845976, 4193218782] },
          {
            x: "Apple A12 GPU",
            v: [958581112, 2301174800, 3403189785, 4085158452],
          },
          { x: "Apple A11 GPU", v: [367695777, 411650080] },
          { x: "Apple A13 GPU", v: [352823931, 1278953537, 3335845976] },
          { x: "Apple A15 GPU", v: [1407135659] },
          { x: "Apple A16 GPU", v: [46273595, 3403189785] },
          {
            x: "Apple A10X GPU",
            v: [63583436, 2114570256, 3129316290, 3249312110],
          },
          { x: "Apple A12 GPU", v: [1349146759, 2917249763] },
          { x: "Apple M1 GPU", v: [105985484, 2364051618] },
          { x: "Apple M2 GPU", v: [46273595] },
          { x: "Apple A10 GPU", v: [2114570256] },
          { x: "Apple A12 GPU", v: [1349146759] },
          { x: "Apple A7 GPU", v: [857422828, 1915583345] },
          { x: "Apple A8 GPU", v: [839732043, 3816812018, 4125234388] },
          { x: "Apple A10 GPU", v: [583354101, 3458129248, 3928876783] },
          {
            x: "Apple A11 GPU",
            v: [367695777, 411650080, 1220644697, 1804407534],
          },
          { x: "Apple A15 GPU", v: [2364051618] },
          { x: "Apple A8 GPU", v: [1411440593, 1924197914, 4125234388] },
          { x: "Apple A9 GPU", v: [2114570256, 3129316290] },
          { x: "Apple A10 GPU", v: [63583436, 2114570256, 3129316290] },
          {
            x: "Apple A11 GPU",
            v: [1349146759, 2206992415, 2917249763, 2946940121],
          },
          {
            x: "Apple A8 GPU",
            v: [1411440593, 1913250432, 3074367344, 4125234388],
          },
          { x: "Apple A9 GPU", v: [46663968, 2114570256, 3129316290] },
          {
            x: "Apple A11 GPU",
            v: [2206992415, 2917249763, 2946940121, 3237505312],
          },
          { x: "Apple A8 GPU", v: [3128296539, 3816812018, 4125234388] },
          {
            x: "Apple A9 GPU",
            v: [46663968, 63583436, 2114570256, 3129316290],
          },
          {
            x: "Apple A10 GPU",
            v: [46663968, 63583436, 2114570256, 3129316290],
          },
          { x: "Apple A11 GPU", v: [2917249763, 2946940121, 3237505312] },
          { x: "Apple A15 GPU", v: [235283973, 1444462398, 2775654583] },
          { x: "Apple A13 GPU", v: [2866949877, 3565683531] },
          { x: "Apple A8 GPU", v: [2656686317, 3710391565] },
          { x: "Apple A10 GPU", v: [46663968] },
          { x: "Apple A12Z GPU", v: [958581112, 2301174800, 2487400911] },
          { x: "Apple A12X GPU", v: [4085158452] },
          { x: "Apple A10X GPU", v: [583354101, 3458129248, 3928876783] },
          { x: "Apple A8X GPU", v: [1350183384, 3816812018, 4125234388] },
          { x: "Apple A8 GPU", v: [4125234388] },
          { x: "Apple A7 GPU", v: [1966062736] },
          { x: "Apple A8 GPU", v: [2998196247] },
          { x: "Apple A13 GPU", v: [2866949877] },
          { x: "Apple M1 GPU", v: [1349146759, 1444462398] },
          { x: "Apple M2 GPU", v: [2775654583] },
          { x: "Apple A13 GPU", v: [3335845976] },
          { x: "Apple A13 GPU", v: [1349146759] },
          { x: "Apple A15 GPU", v: [1444462398] },
          { x: "Apple A13 GPU", v: [3565683531] },
          { x: "Apple A15 GPU", v: [235283973] },
          { x: "Apple A11 GPU", v: [411650080, 1220644697] },
          { x: "Apple A13 GPU", v: [352823931, 3403189785, 4193218782] },
          { x: "Apple A11 GPU", v: [367695777] },
          { x: "Apple A10 GPU", v: [3403189785] },
          { x: "Apple A8X GPU", v: [1783160115] },
          { x: "Apple A8 GPU", v: [3928382683] },
          { x: "Apple A10 GPU", v: [1058363647, 2015944978] },
          { x: "Apple A8 GPU", v: [3312905059, 3928382683] },
          { x: "Apple A8X GPU", v: [1480368425, 1783160115, 3403189785] },
          { x: "Apple A10X GPU", v: [2114570256] },
          { x: "Apple A14 GPU", v: [1349146759] },
          { x: "Apple A8X GPU", v: [1783160115, 3403189785] },
        ],
      };
      function height() {
        return window.screen.height * window.devicePixelRatio;
      }
      function mediacolorgamut() {
        return (function getMediaSingleValue(name, possibleValues) {
          for (var i = 0; i < possibleValues.length; i++)
            if (
              ((query = "(" + name + ": " + possibleValues[i] + ")"),
              window.matchMedia(query).matches)
            )
              return possibleValues[i];
          var query;
          return "n/a";
        })("color-gamut", ["p3", "srgb"]);
      }
      function evaluateNode(node, iterations) {
        if (node.m) {
          var result = node.m(node);
          result || "" === result
            ? result.then ||
              (function resolveNode(node, value, iterations) {
                for (var i = 0; i < node.n.length; i++) {
                  var child = decisionTree.Data[node.n[i]];
                  if (child.r)
                    for (var c = 0; c < child.r.length; c++) {
                      var range = child.r[c];
                      if (
                        (null === range.a || value >= range.a) &&
                        (null === range.b || value <= range.b)
                      )
                        return void evaluateNode(child, 0);
                    }
                  else if (child.v && -1 != child.v.indexOf(value))
                    return void evaluateNode(child, 0);
                }
                node.n.length > 0 && iterations < 3
                  ? setTimeout(function () {
                      evaluateNode(node, iterations + 1);
                    }, 10)
                  : complete(node.x);
              })(node, result, iterations)
            : node.x && complete(node.x);
        } else (complete(node.x), complete("done"));
      }
      evaluateNode(decisionTree.Data[0], 0);
    }
    function fallbackTest() {
      let res =
          Math.min(screen.width, screen.height) +
          "x" +
          Math.max(screen.width, screen.height),
        time = primeTest();
      if (((Global.iOSGPUFALLBACKTEST = time), time < 100))
        return (Device.graphics.webgl.gpu = "apple a18");
      switch (res) {
        case "320x480":
          Device.graphics.webgl.gpu = "legacy";
          break;
        case "320x568":
          Device.graphics.webgl.gpu =
            time <= 400 ? "apple a8" : time <= 500 ? "apple a7" : "legacy";
          break;
        case "375x812":
        case "414x896":
          Device.graphics.webgl.gpu =
            time <= 150 ? "apple a13" : time <= 180 ? "apple a12" : "apple a11";
          break;
        case "414x736":
        case "375x667":
          Device.graphics.webgl.gpu =
            time <= 220
              ? "apple a11"
              : time <= 250
                ? "apple a10"
                : time <= 360
                  ? "apple a9"
                  : time <= 400
                    ? "apple a8"
                    : time <= 600
                      ? "apple a7"
                      : "legacy";
          break;
        default:
        case "768x1024":
          Device.graphics.webgl.gpu =
            time <= 140
              ? "apple a14"
              : time <= 160
                ? "apple a13"
                : time <= 180
                  ? "apple a12"
                  : time <= 220
                    ? "apple a11"
                    : time <= 250
                      ? "apple a10"
                      : time <= 360
                        ? "apple a9"
                        : time <= 400
                          ? "apple a8"
                          : time <= 600
                            ? "apple a7"
                            : "legacy";
          break;
        case "834x1112":
          Device.graphics.webgl.gpu =
            time <= 160
              ? "apple a13"
              : time <= 180
                ? "apple a12"
                : time <= 220
                  ? "apple a11"
                  : "apple a10";
          break;
        case "834x1194":
          time <= 140
            ? (Device.graphics.webgl.gpu = "apple m1 gpu")
            : time <= 160
              ? (Device.graphics.webgl.gpu = "apple a13")
              : time <= 180 && (Device.graphics.webgl.gpu = "apple a12");
          break;
        case "810x1080":
          time <= 160
            ? (Device.graphics.webgl.gpu = "apple a13")
            : time <= 220
              ? (Device.graphics.webgl.gpu = "apple a11")
              : time <= 250 && (Device.graphics.webgl.gpu = "apple a10");
          break;
        case "820x1180":
          Device.graphics.webgl.gpu = "apple a14";
          break;
        case "428x926":
        case "390x844":
          Device.graphics.webgl.gpu = "apple a15";
          break;
        case "1024x1366":
          Device.graphics.webgl.gpu =
            time <= 140
              ? "apple m1 gpu"
              : time <= 160
                ? "apple a13"
                : time <= 180
                  ? "apple a12"
                  : time <= 220
                    ? "apple a11"
                    : time <= 250
                      ? "apple a10"
                      : "apple a9";
      }
    }
    this.exports = function () {
      if (
        (function knownHash() {
          let value = hash();
          switch (((Global.iOSGPUHASH3D = value), value)) {
            case 3938463741:
            case 3607454639:
            case 1476734041:
              return (Device.graphics.webgl.gpu = "apple a18");
            case 2370695082:
              return (Device.graphics.webgl.gpu = "apple a16");
            case 1444462398:
              return (Device.graphics.webgl.gpu = "apple a15");
            case 2652724963:
              return (Device.graphics.webgl.gpu = "apple m4");
            case 2775654583:
              return (Device.graphics.webgl.gpu = "apple m2");
            case 2370695082:
              return (Device.graphics.webgl.gpu = "apple m1");
          }
        })()
      )
        return Promise.resolve();
      let _value,
        _timer,
        promise = Promise.create();
      const cb = (value) => {
        if ((clearTimeout(_timer), "done" == value)) {
          if (((Global.iOSGPUHASHVAL = _value), !_value))
            return (fallbackTest(), promise.resolve());
          if (_value.includes("|"))
            try {
              let split = _value.split("|");
              if (1 == split.length && split[0].includes("Apple M"))
                Device.graphics.webgl.gpu = "apple m1 gpu";
              else {
                let output = split
                  .filter((v) => !v.includes("Apple M"))
                  .map((v) =>
                    Number(
                      v
                        .replace("Apple", "")
                        .replace("X", "")
                        .replace("Z", "")
                        .split("A")[1]
                        .split(" ")[0],
                    ),
                  );
                if (
                  (output.sort((a, b) => a - b),
                  output[output.length - 1] - output[0] >= 2
                    ? fallbackTest()
                    : (Device.graphics.webgl.gpu = split[0].toLowerCase()),
                  "apple a14 gpu" == Device.graphics.webgl.gpu)
                ) {
                  let res =
                    Math.min(screen.width, screen.height) +
                    "x" +
                    Math.max(screen.width, screen.height);
                  ("428x926" != res && "390x844" != res) ||
                    (Device.graphics.webgl.gpu = "apple a15 gpu");
                }
              }
            } catch (e) {
              fallbackTest();
            }
          else Device.graphics.webgl.gpu = _value.toLowerCase();
          promise.resolve();
        } else ((_value = value), (_timer = setTimeout((_) => cb("done"), 20)));
      };
      return (getRenderer(cb), promise);
    };
  }),
  Module(function GPUBlocklist() {
    this.exports = {
      match: function () {
        return (
          !Device.graphics.gpu ||
          Device.graphics.gpu.detect([
            "radeon hd 6970m",
            "radeon hd 6770m",
            "radeon hd 6490m",
            "radeon hd 6630m",
            "radeon hd 6750m",
            "radeon hd 5750",
            "radeon hd 5670",
            "radeon hd 4850",
            "radeon hd 4870",
            "radeon hd 4670",
            "geforce 9400m",
            "geforce 320m",
            "geforce 330m",
            "geforce gt 130",
            "geforce gt 120",
            "geforce gtx 285",
            "geforce 8600",
            "geforce 9600m",
            "geforce 9400m",
            "geforce 8800 gs",
            "geforce 8800 gt",
            "quadro fx 5",
            "quadro fx 4",
            "radeon hd 2600",
            "radeon hd 2400",
            "radeon hd 2600",
            "mali-4",
            "mali-3",
            "mali-2",
            "swiftshader",
            "basic render driver",
            "generic renderer",
            "sgx543",
            "legacy",
            "sgx 543",
          ])
        );
      },
    };
  }),
  Class(function HierarchyAnimation(_data, createObjects, _isLayout) {
    Inherit(this, Object3D);
    const _this = this;
    var _objects,
      _lastElapsed = -1;
    ((this.elapsed = 0),
      (this.weight = 1),
      (this.scale = 1),
      (this.duration = 0),
      (this.loop = !1));
    const prevPos = new Vector3(),
      prevRot = new Quaternion(),
      prevScl = new Vector3(),
      nextPos = new Vector3(),
      nextRot = new Quaternion(),
      nextScl = new Vector3(),
      DEFAULT_QUAT = new Quaternion(0, 0, 0, 1),
      DEFAULT_POS = new Vector3(0, 0, 0),
      DEFAULT_SCALE = new Vector3(1, 1, 1);
    function loop() {
      _this.update();
    }
    (!(async function () {
      if ("function" != typeof createObjects)
        throw "HierarchyAnimation :: Second parameter requires callback function to create objects";
      if (
        ("string" == typeof _data &&
          (_data = await get(Assets.getPath(`assets/geometry/${_data}.json`))),
        (_objects = await createObjects(_data.hierarchy)),
        !Array.isArray(_objects))
      )
        throw "HierarchyAnimation :: Object creation function requires an array to be returned";
      (!(function nestObjects() {
        try {
          if (_data.hierarchy.length != _objects.length)
            throw "HierarchyAnimation :: Number of objects in hierarchy does not match number of objects created.";
          _data.hierarchy.forEach((d, i) => {
            if (d.parent > -1) {
              "null" != _data.hierarchy[Number(d.parent)].name &&
                _objects[d.parent].add(_objects[i]);
            } else "null" != d.name && _this.add(_objects[i]);
          });
        } catch (e) {
          throw (
            console.error(
              "HierarchyAnimation :: Could not successfully nest objects -- check your names!",
            ),
            e
          );
        }
      })(),
        (_this.duration = _data.frames.length),
        (_this.fps = _data.fps));
    })(),
      (this.update = function (totalWeight = 1, isSet) {
        if (!_objects) return;
        const weight = isSet ? 1 : _this.weight / totalWeight,
          elapsed = Math.clamp(_this.elapsed, 0, 0.99) * _this.duration;
        if (Math.abs(elapsed - _lastElapsed) < 0.001) return;
        _lastElapsed = elapsed;
        const floorFrame = Math.floor(elapsed),
          blend = elapsed - floorFrame,
          prevKey = _data.frames[floorFrame],
          nextKey =
            _data.frames[
              _this.loop ? (floorFrame + 1) % _this.duration : floorFrame + 1
            ];
        prevKey &&
          nextKey &&
          _objects.forEach((object, i) => {
            (prevPos
              .fromArray(prevKey.position, 3 * i)
              .multiplyScalar(_this.scale),
              prevRot.fromArray(prevKey.quaternion, 4 * i),
              prevScl.fromArray(prevKey.scale, 3 * i),
              nextPos
                .fromArray(nextKey.position, 3 * i)
                .multiplyScalar(_this.scale),
              nextRot.fromArray(nextKey.quaternion, 4 * i),
              nextScl.fromArray(nextKey.scale, 3 * i),
              prevPos.lerp(nextPos, blend, !1),
              prevRot.slerp(nextRot, blend, !1),
              prevScl.lerp(nextScl, blend, !1),
              _isLayout
                ? (prevPos.equals(DEFAULT_POS) ||
                    object.position.lerp(prevPos, weight, !1),
                  prevRot.equals(DEFAULT_QUAT) ||
                    object.quaternion.slerp(prevRot, weight, !1),
                  prevScl.equals(DEFAULT_SCALE) ||
                    object.scale.lerp(prevScl, weight, !1))
                : (object.position.lerp(prevPos, weight, !1),
                  object.quaternion.slerp(prevRot, weight, !1),
                  object.scale.lerp(prevScl, weight, !1)));
          });
      }),
      (this.start = function () {
        _this.startRender(loop);
      }),
      (this.stop = function () {
        _this.stopRender(loop);
      }),
      (this.ready = function () {
        return _this.wait(_this, "duration");
      }),
      this.set("data", (data) => {
        ((_data = data),
          (_this.duration = _data.frames.length),
          (_this.fps = _data.fps),
          (_this.elapsed = 0));
      }));
  }),
  Class(function HierarchyLayout(_data, createObjects) {
    Inherit(this, Component);
    const _this = this;
    var _animation;
    (!(async function () {
      ((_animation = new HierarchyAnimation(_data, createObjects, !0)),
        (_this.group = _animation.group),
        (_animation.loop = !0),
        await _animation.ready(),
        _animation.update());
    })(),
      (this.ready = function () {
        return _animation.ready();
      }),
      this.set("scale", (s) => (_animation.scale = s)));
  }),
  Class(function LayerAnimation(_mesh, _shader, _group, _input) {
    Inherit(this, Component);
    const _this = this;
    var _config,
      _active,
      _hierarchy,
      _map = {};
    (!(async function () {
      ((_mesh.animation = _this),
        (function initConfig() {
          ((_config = InputUIL.create(_input.prefix + "anim", _group)).setLabel(
            "Animation Files",
          ),
            _config.add("path"),
            _config.addTextarea("jsonFiles"));
        })(),
        await (async function initFiles() {
          let path = `assets/geometry/${_config.get("path")}/`,
            files = _config.get("jsonFiles").split("\n"),
            load = files
              .map((f) => path + f + ".json")
              .map((path) => get(path)),
            data = await Promise.all(load);
          for (let i = 0; i < files.length; i++) _map[files[i]] = data[i];
          _active = files[0];
        })(),
        (async function initHierarchy() {
          ((_hierarchy = _this.initClass(
            HierarchyAnimation,
            _map[_active],
            (data) => {
              let array = [];
              for (let i = 0; i < data.length; i++) {
                data[i].name == _input.get("name")
                  ? array.push(_mesh)
                  : array.push(new Group());
              }
              return array;
            },
          )),
            await _hierarchy.ready(),
            _hierarchy.update(),
            _this.flag("initialized", !0));
        })());
    })(),
      (this.play = async function (name, time, ease, delay) {
        if ((await _this.wait("initialized"), !_map[name]))
          throw "No animation file found for " + name;
        (ease || (ease = "linear"),
          time || (time = (_map[name].frames.length / _map[name].fps) * 1e3),
          (_hierarchy.data = _map[name]),
          (_active = name),
          _hierarchy.start(),
          await tween(_hierarchy, { elapsed: 1 }, time, ease, delay).promise(),
          _hierarchy.stop());
      }));
  }),
  Class(function HydraBloom(
    _nuke,
    {
      nMips: nMips = 6,
      enabled: enabled = !0,
      useMask: useMask = !1,
      useHdr: useHdr = !0,
      useRTPool: useRTPool = !1,
    } = {},
    _unique,
  ) {
    Inherit(this, Component);
    const _this = this;
    "string" == typeof options
      ? ((_unique = _params), (_nuke = World.NUKE))
      : "string" == typeof _nuke
        ? ((_unique = _nuke), (_nuke = World.NUKE))
        : !_nuke || _nuke instanceof Nuke
          ? ((_nuke = _nuke || World.NUKE), (_unique = _unique || ""))
          : (_nuke = World.NUKE);
    let _DPR = 0.5 * _nuke.dpr;
    const PASS_COUNT = nMips,
      FORMAT = !1 !== useHdr ? Texture.HALF_FLOAT : Texture.RGBAFormat;
    let _blitProgram,
      _lumaProgram,
      _downSampleProgram,
      _upSampleProgram,
      _inputTexture,
      _brightnessTexture,
      textureParams = {
        minFilter: Texture.LINEAR,
        magFilter: Texture.LINEAR,
        format: FORMAT,
        generateMipmaps: !1,
      };
    _this.blitResolution = new Vector2(
      Math.round(_nuke.stage.width * _DPR),
      Math.round(_nuke.stage.height * _DPR),
    );
    let _downSamplePasses = [],
      _upSamplePasses = [];
    _this.enabled = enabled || !0;
    let _inputUIL = null;
    function createRT(width, height, opts) {
      return new RenderTarget(width, height, opts);
    }
    function loop() {
      if (!_this.enabled || !1 === _this.visible) return;
      let inputTarget = _inputTexture || _nuke.rttBuffer.texture;
      _lumaProgram.shader.uniforms.luminosityThreshold.value > 0.001 && !useMask
        ? (_lumaProgram.shader.set("tDiffuse", inputTarget),
          World.RENDERER.renderSingle(
            _lumaProgram,
            World.CAMERA,
            _downSamplePasses[0].buffer,
          ),
          (inputTarget = _brightnessTexture.texture))
        : (_blitProgram.shader.set("tMap", inputTarget),
          World.RENDERER.renderSingle(
            _blitProgram,
            World.CAMERA,
            _downSamplePasses[0].buffer,
          ));
      for (let i = 0; i < PASS_COUNT - 1; i++)
        (_downSampleProgram.shader.set(
          "uResolution",
          _downSamplePasses[i].resolution,
        ),
          _downSampleProgram.shader.set(
            "tMap",
            _downSamplePasses[i].buffer.texture,
          ),
          World.RENDERER.renderSingle(
            _downSampleProgram,
            World.CAMERA,
            _downSamplePasses[i + 1].buffer,
          ));
      const count = PASS_COUNT - 2;
      for (let i = count; i >= 0; i--)
        (_upSampleProgram.shader.set(
          "uResolution",
          _upSamplePasses[i + 1].resolution,
        ),
          _upSampleProgram.shader.set(
            "tMap",
            i === count
              ? _downSamplePasses[i + 1].buffer.texture
              : _upSamplePasses[i + 1].buffer.texture,
          ),
          _upSampleProgram.shader.set(
            "tNext",
            _downSamplePasses[i].buffer.texture,
          ),
          World.RENDERER.renderSingle(
            _upSampleProgram,
            World.CAMERA,
            _upSamplePasses[i].buffer,
          ));
    }
    function handleResize() {
      _this.blitResolution = new Vector2(
        Math.round(_nuke.stage.width * _DPR),
        Math.round(_nuke.stage.height * _DPR),
      );
      let resX = _this.blitResolution.x,
        resY = _this.blitResolution.y;
      for (let i = 0; i < PASS_COUNT; i++)
        (_downSamplePasses[i].buffer.setSize(resX, resY),
          _upSamplePasses[i].buffer.setSize(resX, resY),
          (resX = Math.round(0.5 * resX)),
          (resY = Math.round(0.5 * resY)));
    }
    (!(function initPasses() {
      _brightnessTexture = createRT(
        _nuke.stage.width,
        _nuke.stage.height,
        textureParams,
      );
      let resX = _this.blitResolution.x,
        resY = _this.blitResolution.y;
      for (let i = 0; i < PASS_COUNT; i++)
        (_downSamplePasses.push({
          buffer: createRT(resX, resY, textureParams),
          resolution: new Vector2(resX, resY),
        }),
          _upSamplePasses.push({
            buffer: createRT(resX, resY, textureParams),
            resolution: new Vector2(resX, resY),
          }),
          (resX = Math.round(0.5 * resX)),
          (resY = Math.round(0.5 * resY)));
    })(),
      (function initPrograms() {
        const geo = World.QUAD,
          blitShader = _this.initClass(Shader, "Blit", {
            tMap: { value: null },
            depthTest: !1,
            depthWrite: !1,
          });
        if (((_blitProgram = new Mesh(geo, blitShader)), !useMask)) {
          const luminosityShader = _this.initClass(
            Shader,
            "BloomLuminosityPass",
            {
              tDiffuse: { value: null, ignoreUIL: !0 },
              luminosityThreshold: { value: 0 },
              smoothWidth: { value: 0.01, ignoreUIL: !0 },
              defaultColor: { value: new Color(0), ignoreUIL: !0 },
              defaultOpacity: { value: 0, ignoreUIL: !0 },
              unique: _unique,
            },
          );
          (ShaderUIL.add(luminosityShader).setLabel(
            "Hydra Bloom Luminosity Params",
          ),
            (_lumaProgram = new Mesh(geo, luminosityShader)));
        }
        const downSampleShader = _this.initClass(Shader, "DownSample", {
          tMap: { value: null },
          uResolution: { value: new Vector2(2, 2) },
          uSeed: { value: 0 },
          uRadius: { value: 1 },
          depthTest: !1,
          depthWrite: !1,
          unique: _unique,
        });
        _downSampleProgram = new Mesh(geo, downSampleShader);
        const upSampleShader = _this.initClass(Shader, "UpSample", {
          tMap: { value: null },
          tNext: { value: null },
          uResolution: { value: new Vector2(2, 2) },
          uSeed: { value: 0 },
          uRadius: { value: 1 },
          uIntensity: { value: 1 },
          uTint: { value: new Color() },
          depthTest: !1,
          depthWrite: !1,
          unique: _unique,
        });
        _upSampleProgram = new Mesh(geo, upSampleShader);
      })(),
      (function initPass() {
        _this.pass = _this.initClass(NukePass, "HydraBloomPass", {
          tHydraBloom: { value: _upSamplePasses[0].buffer.texture },
        });
      })(),
      (function initInputUIL() {
        ((_inputUIL = InputUIL.create(`HydraBloom${_unique || ""}`)),
          _inputUIL.setLabel(`Hydra Bloom ${_unique || ""}`),
          _inputUIL.addNumber("Bloom_Radius", 1, 0.1),
          _inputUIL.addNumber("Bloom_Intensity", 1, 0.1),
          _inputUIL.addColor("Bloom_Tint", new Color()),
          (_inputUIL.onUpdate = (key, value) => {
            (_upSampleProgram.shader.set(
              "uRadius",
              _inputUIL.getNumber("Bloom_Radius"),
            ),
              _upSampleProgram.shader.set(
                "uIntensity",
                _inputUIL.getNumber("Bloom_Intensity"),
              ),
              _upSampleProgram.shader.set(
                "uTint",
                new Color(_inputUIL.get("Bloom_Tint")),
              ),
              console.log(value));
          }));
      })(),
      (function addHandlers() {
        _this.onResize(handleResize);
      })(),
      _this.startRender(loop),
      this.set("texture", (texture) => {
        _inputTexture = texture;
      }),
      this.get("output", (_) => _upSamplePasses[0].buffer.texture),
      (this.onInvisible = function () {}),
      (this.onVisible = function () {}),
      (_this.onDestroy = function () {
        (_downSamplePasses.forEach((pass) => pass.buffer.destroy()),
          _upSamplePasses.forEach((pass) => pass.buffer.destroy()),
          (_downSamplePasses = []),
          (_upSamplePasses = []));
      }));
  }),
  Namespace("FX"),
  FX.Class(function HydraLensStreak(
    _nuke,
    {
      nMips: nMips = 8,
      dpr: dpr = 1,
      enabled: enabled = !0,
      manualRender: manualRender = !1,
    } = {},
    _unique,
  ) {
    Inherit(this, Component);
    const _this = this;
    if ("object" == typeof _nuke && _nuke.isAppState) {
      let options = _nuke;
      ((_unique = _nuke.unique),
        (_nuke = _nuke.nuke || _this.parent.nuke),
        (nMips = options.nMips || 8),
        (dpr = options.dpr || 1),
        (enabled = void 0 === options.enabled || options.enabled),
        (manualRender =
          void 0 !== options.manualRender && options.manualRender));
    }
    let _blitMesh, _downsampleShader, _upsampleShader;
    ("string" == typeof options
      ? ((_unique = _params), (_nuke = World.NUKE))
      : "string" == typeof _nuke
        ? ((_unique = _nuke), (_nuke = World.NUKE))
        : !_nuke || _nuke instanceof Nuke
          ? ((_nuke = _nuke || World.NUKE), (_unique = _unique || ""))
          : (_nuke = World.NUKE),
      (this.uniforms = {
        tLightStreak: { value: null, ignoreUIL: !0 },
        unique: _unique,
      }));
    let _prefiltered,
      _prefilterShader,
      _lastUpsampleFBO,
      _compositeFBO,
      _compositeShader,
      _uil,
      _inputTexture,
      _upSamplePasses = [],
      _downSamplePasses = [];
    function render() {
      if (!_this.enabled || !1 === _this.visible) return;
      let inputTarget = _inputTexture || _nuke.rttBuffer.texture;
      (_inputTexture ||
        ((_blitMesh.shader = _prefilterShader),
        _blitMesh.shader.set("tMap", inputTarget),
        World.RENDERER.renderSingle(_blitMesh, World.CAMERA, _prefiltered)),
        (_blitMesh.shader = _downsampleShader),
        _blitMesh.shader.set("tMap", _inputTexture || _prefiltered.texture),
        _blitMesh.shader.set("uResolution", _downSamplePasses[0].resolution),
        World.RENDERER.renderSingle(
          _blitMesh,
          World.CAMERA,
          _downSamplePasses[0].fbo,
        ));
      for (let i = 1; i < nMips; i++)
        (_blitMesh.shader.set("tMap", _downSamplePasses[i - 1].fbo.texture),
          _blitMesh.shader.set(
            "uResolution",
            _downSamplePasses[i - 1].resolution,
          ),
          World.RENDERER.renderSingle(
            _blitMesh,
            World.CAMERA,
            _downSamplePasses[i].fbo,
          ),
          (_lastUpsampleFBO = _downSamplePasses[i].fbo));
      ((_blitMesh.shader = _upsampleShader),
        _blitMesh.shader.set(
          "tHigh",
          _downSamplePasses[_downSamplePasses.length - 1].fbo.texture,
        ),
        _blitMesh.shader.set("tScene", _lastUpsampleFBO.texture),
        _blitMesh.shader.set("uResolution", _upSamplePasses[0].resolution),
        World.RENDERER.renderSingle(
          _blitMesh,
          World.CAMERA,
          _upSamplePasses[0].fbo,
        ));
      for (let i = 1; i < nMips - 2; i++)
        (_blitMesh.shader.set("tHigh", _downSamplePasses[i - 1].fbo.texture),
          _blitMesh.shader.set("tScene", _lastUpsampleFBO.texture),
          _blitMesh.shader.set("uResolution", _upSamplePasses[i].resolution),
          World.RENDERER.renderSingle(
            _blitMesh,
            World.CAMERA,
            _upSamplePasses[i].fbo,
          ),
          (_lastUpsampleFBO = _upSamplePasses[i].fbo));
      ((_blitMesh.shader = _compositeShader),
        World.RENDERER.renderSingle(_blitMesh, World.CAMERA, _compositeFBO),
        (_this.uniforms.tLightStreak.value = _compositeFBO));
    }
    function handleResize() {
      const resolution = new Vector2();
      resolution.set(_nuke.stage.width * dpr, (_nuke.stage.height * dpr) / 2);
      for (let i = 0; i < nMips; i++)
        (_downSamplePasses[i].fbo.setSize(resolution.x, resolution.y),
          (resolution.x /= 2));
      for (let i = 0; i < nMips - 2; i++) {
        const width = _downSamplePasses[i].fbo.width,
          height = _downSamplePasses[i].fbo.height;
        _upSamplePasses[i].fbo.setSize(width, height);
      }
    }
    ((_this.enabled = void 0 === enabled || enabled),
      (function initPrograms() {
        ((_prefilterShader = _this.initClass(Shader, "LensFlarePrefilter", {
          tMap: { value: null, ignoreUIL: !0 },
          uThreshold: { value: 0.6 },
          uRotate: { value: 0 },
          uResolution: { value: new Vector2() },
          unique: _unique,
        })),
          (_downsampleShader = _this.initClass(Shader, "LensFlareDown", {
            tMap: { value: null, ignoreUIL: !0 },
            uResolution: { value: new Vector2() },
            uStretch: { value: 1 },
            unique: _unique,
          })),
          (_upsampleShader = _this.initClass(Shader, "LensFlareUp", {
            tHigh: { value: null, ignoreUIL: !0 },
            tScene: { value: null, ignoreUIL: !0 },
            uStretch: { value: 1 },
            uResolution: { value: new Vector2() },
            uSoftenEdge: { value: 1 },
            unique: _unique,
          })));
      })(),
      (function initPasses() {
        const options = {
          minFilter: Texture.LINEAR,
          magFilter: Texture.LINEAR,
          wrapS: Texture.CLAMP_TO_EDGE,
          wrapT: Texture.CLAMP_TO_EDGE,
          format: Texture.RGBAFormat,
          generateMipmaps: !0,
        };
        _lastUpsampleFBO = _prefiltered;
        const resolution = new Vector2();
        (resolution.set(_nuke.stage.width * dpr, _nuke.stage.height * dpr),
          (_prefiltered = new RenderTarget(
            resolution.x,
            resolution.y,
            options,
          )),
          (_prefiltered.id = "prefiltered"));
        for (let i = 0; i < nMips; i++) {
          const downSampleFBO = new RenderTarget(
            resolution.x,
            resolution.y,
            options,
          );
          ((downSampleFBO.id = "downSampleFBO" + i),
            _downSamplePasses.push({
              fbo: downSampleFBO,
              resolution: new Vector2(resolution.x, resolution.y),
            }),
            Utils.query("debugFBO") &&
              FBOHelper.instance().attach(_downSamplePasses[i].fbo, {
                name: "downSampleFBO" + i,
              }),
            resolution.x >= 32 && ((resolution.x /= 2), (resolution.y /= 2)));
        }
        for (let i = 0; i < nMips - 2; i++) {
          const width = _downSamplePasses[i].fbo.width,
            height = _downSamplePasses[i].fbo.height,
            upsampleFBO = new RenderTarget(width, height, options);
          ((upsampleFBO.id = "upsampleFBO" + i),
            _upSamplePasses.push({
              fbo: upsampleFBO,
              resolution: new Vector2(width, height),
            }),
            Utils.query("debugFBO") &&
              FBOHelper.instance().attach(_upSamplePasses[i].fbo, {
                name: "upsampleFBO" + i,
              }));
        }
        _blitMesh = new Mesh(World.QUAD, _downsampleShader);
      })(),
      (function initCompositePass() {
        ((_compositeFBO = new RenderTarget(
          _nuke.stage.width * dpr,
          _nuke.stage.height * dpr,
          {
            minFilter: Texture.LINEAR,
            magFilter: Texture.LINEAR,
            wrapS: Texture.CLAMP_TO_EDGE,
            wrapT: Texture.CLAMP_TO_EDGE,
            format: Texture.RGBAFormat,
            generateMipmaps: !1,
          },
        )),
          (_compositeShader = _this.initClass(Shader, "CompositeStreak", {
            tHigh: {
              value: _upSamplePasses[_upSamplePasses.length - 1].fbo.texture,
              ignoreUIL: !0,
            },
            tDown: {
              value:
                _downSamplePasses[_downSamplePasses.length - 2].fbo.texture,
              ignoreUIL: !0,
            },
            tPrefiltered: {
              value:
                _downSamplePasses[_downSamplePasses.length / 2].fbo.texture,
              ignoreUIL: !0,
            },
            uStreakColor: { value: new Color(1, 1, 1) },
            uStreakIntensity: { value: 6 },
            uGlowIntensity: { value: 1 },
            uFlareIntensity: { value: 0 },
            uAspectCorrection: { value: 1 },
            uHaloChroma: { value: 0.0025 },
            uHaloScale: { value: 0.8 },
            uHaloRotateSrc: { value: 0 },
            uHaloSoftness: { value: 1 },
            uHaloColor: { value: new Color(1, 1, 1) },
            uHaloRing: { value: new Vector4(1.1, 0.5, 0.48, 0.05) },
            uHaloConstant: { value: 0.04 },
            uDebugHalo: { value: !1 },
            uColor: { value: new Color() },
            uRotateStreak: { value: 0 },
            unique: _unique,
          })));
      })(),
      (function initInputUIL() {
        function update() {
          (_compositeShader.set(
            "uStreakColor",
            new Color(_uil.get("uStreakColor")),
          ),
            _compositeShader.set(
              "uStreakIntensity",
              _uil.getNumber("uStreakIntensity"),
            ),
            _compositeShader.set(
              "uGlowIntensity",
              _uil.getNumber("uGlowIntensity"),
            ),
            _compositeShader.set(
              "uFlareIntensity",
              _uil.getNumber("uFlareIntensity"),
            ),
            _compositeShader.set(
              "uAspectCorrection",
              _uil.getNumber("uAspectCorrection"),
            ),
            _compositeShader.set("uHaloChroma", _uil.getNumber("uHaloChroma")),
            _compositeShader.set("uHaloScale", _uil.getNumber("uHaloScale")),
            _compositeShader.set(
              "uHaloSoftness",
              _uil.getNumber("uHaloSoftness"),
            ),
            _compositeShader.set(
              "uHaloColor",
              new Color(_uil.get("uHaloColor")),
            ),
            _compositeShader.set(
              "uHaloRotateSrc",
              _uil.getNumber("uHaloRotateSrc"),
            ),
            _compositeShader.set(
              "uHaloConstant",
              _uil.getNumber("uHaloConstant"),
            ),
            _compositeShader.set("uDebugHalo", _uil.get("uDebugHalo")));
          const haloRing = _uil.get("uHaloRing");
          haloRing &&
            (_compositeShader.set(
              "uHaloRing",
              new Vector4(haloRing[0], haloRing[1], haloRing[2], haloRing[3]),
            ),
            _compositeShader.set(
              "uRotateStreak",
              _uil.getNumber("uRotateStreak"),
            ),
            _prefilterShader.set("uThreshold", _uil.getNumber("uThreshold")),
            _prefilterShader.set("uRotate", _uil.getNumber("uRotateStreak")),
            _upsampleShader.set("uSoftenEdge", _uil.getNumber("uSoftenEdge")),
            _downsampleShader.set("uStretch", _uil.getNumber("uStretch")));
        }
        ((_uil = InputUIL.create(`HydraLensStreak${_unique || ""}`)),
          _uil.setLabel(`Hydra Lens streak ${_unique || ""}`),
          _uil.addColor("uStreakColor", new Color(1, 1, 1)),
          _uil.addNumber("uThreshold", 0),
          _uil.addNumber("uStreakIntensity", 2),
          _uil.addNumber("uGlowIntensity", 0),
          _uil.addNumber("uRotateStreak", 0),
          _uil.addNumber("uFlareIntensity", 1),
          _uil.addNumber("uAspectCorrection", 0),
          _uil.addNumber("uHaloChroma", 0.0025),
          _uil.addNumber("uHaloScale", 0.8),
          _uil.addNumber("uHaloSoftness", 1),
          _uil.addColor("uHaloColor", new Color(1, 1, 1)),
          _uil.addVector("uHaloRing", [1.1, 0.5, 0.48, 0.05]),
          _uil.addNumber("uHaloRotateSrc", 0),
          _uil.addNumber("uStretch", 1),
          _uil.addNumber("uHaloConstant", 0.04),
          _uil.addNumber("uSoftenEdge", 1),
          _uil.addToggle("uDebugHalo"),
          update(),
          (_uil.onUpdate = (key, value) => {
            update();
          }));
      })(),
      (function addEventHandlers() {
        _this.onResize(handleResize);
      })(),
      !manualRender && _this.startRender(render, RenderManager.AFTER_LOOPS),
      this.set("texture", (texture) => {
        _inputTexture = texture;
      }),
      this.get("output", (_) => _compositeFBO.texture),
      (_this.onDestroy = function () {
        (_downSamplePasses.forEach((pass) => pass.buffer.destroy()),
          _upSamplePasses.forEach((pass) => pass.buffer.destroy()),
          (_downSamplePasses = []),
          (_upSamplePasses = []));
      }));
  }),
  Class(function Initializer3D() {
    Inherit(this, Component);
    const _this = this;
    let _loader,
      _working,
      _promises = [],
      _queue = [];
    async function resolve() {
      (await Promise.all(_promises),
        clearTimeout(_this.fire),
        (_this.fire = _this.delayedCall((_) => {
          (_this.events.fire(_this.READY),
            (_this.resolved = !0),
            (Utils3D.onTextureCreated = null),
            _loader && _loader.trigger(50));
        }, 100)));
    }
    async function workQueue() {
      (clearTimeout(_this.warningTimer), (_working = !0));
      let promise = _queue.shift();
      if (!promise) return (_working = !1);
      (promise.resolve(workQueue),
        Hydra.LOCAL &&
          (_this.warningTimer = _this.delayedCall((_) => {
            console.warn("Long running queue has taken more than 5 seconds.");
          }, 5e3)));
    }
    function incCompleted() {
      _loader && _loader.trigger(1);
    }
    ((this.READY = "initializer_ready"),
      (this.bundle = function () {
        return new (function PromiseBundler() {
          const promises = [],
            ready = Promise.create();
          let timer;
          function run() {
            (clearTimeout(timer),
              (timer = _this.delayedCall((_) => {
                Promise.all(promises).then((_) => ready.resolve());
              }, 100)));
          }
          ((this.capture = function (promise) {
            (promises.push(promise), run());
          }),
            (this.ready = function () {
              return (run(), ready);
            }));
        })();
      }),
      (this.promise = this.capture =
        function (promise) {
          return (
            _loader && _loader.add(1),
            promise.then(incCompleted),
            _promises.push(promise),
            clearTimeout(_this.timer),
            (_this.timer = _this.delayedCall(resolve, 100)),
            promise
          );
        }),
      (this.ready = this.loaded =
        function () {
          return _this.wait(_this, "resolved");
        }),
      (this.createWorld = async function () {
        (await Promise.all([
          AssetLoader.waitForLib("zUtils3D"),
          Shaders.ready(),
          GPU.ready(),
          UILStorage.ready(),
        ]),
          await MatrixWasm.ready(),
          World.instance());
      }),
      (this.linkSceneLayout = function (loader) {
        (_this.captureTextures(),
          (SceneLayout.initializer = _this.capture),
          (_loader = loader));
      }),
      (this.queue = function (immediate) {
        if (immediate) return Promise.resolve((_) => {});
        let promise = Promise.create();
        return (_queue.push(promise), _working || workQueue(), promise);
      }),
      (this.captureTextures = function () {
        Utils3D.onTextureCreated = (texture) => {
          _this.promise(texture.promise);
        };
      }),
      (this.uploadAll = async function (group) {
        if (!group) throw "Undefined passed to uploadAll";
        let sceneLayout;
        if (
          group instanceof SceneLayout ||
          (window.StageLayout && group instanceof StageLayout)
        ) {
          if (((sceneLayout = group), sceneLayout.uploaded)) return;
          ((sceneLayout.uploaded = !0),
            await sceneLayout.loadedAllLayers(),
            (group = group.group));
        }
        let promises = [],
          layouts = [],
          textures = [];
        if (sceneLayout) {
          sceneLayout.textures = textures;
          for (let key in sceneLayout.layers) {
            let layer = sceneLayout.layers[key];
            layer.uploadSync && layer.uploadSync();
          }
        }
        (group?.traverse?.((obj) => {
          if (
            (obj.sceneLayout && obj != group && layouts.push(obj.sceneLayout),
            obj.stageLayout && obj != group && layouts.push(obj.stageLayout),
            !obj.uploadIgnore && 0 != obj.visible)
          ) {
            if (obj.shader)
              for (let key in obj.shader.uniforms) {
                let uniform = obj.shader.uniforms[key];
                uniform &&
                  uniform.value &&
                  uniform.value.promise &&
                  (textures.push(uniform.value),
                  promises.push(
                    uniform.value.promise
                      .then(uniform.value.upload.bind(uniform.value))
                      .catch((e) => {}),
                  ));
              }
            (obj?.glui && obj?.glui?.mesh?.upload?.(),
              obj.shader && obj.shader.shadow && obj.shader.shadow.upload(),
              obj.classRef && obj.classRef.upload && obj.classRef.upload(),
              obj.asyncPromise
                ? promises.push(obj.asyncPromise.then(obj.upload.bind(obj)))
                : obj.upload && obj.upload());
          }
        }),
          group.children &&
            group.children.forEach((child) => {
              child.upload?.();
            }),
          await Promise.catchAll(promises),
          textures.forEach((t) => t.upload()));
        for (let i = 0; i < layouts.length; i++)
          await _this.uploadAll(layouts[i]);
        (sceneLayout &&
          sceneLayout._completeInitialization &&
          sceneLayout._completeInitialization(!0),
          sceneLayout && delete sceneLayout.textures);
      }),
      (this.uploadAllDistributed = this.uploadAllAsync =
        async function (group, releaseQueue) {
          if (!group) throw "Undefined passed to uploadAllDistributed";
          let sceneLayout;
          if (
            (releaseQueue ||
              "boolean" == typeof releaseQueue ||
              (releaseQueue = await _this.queue()),
            group instanceof SceneLayout ||
              (window.StageLayout && group instanceof StageLayout))
          ) {
            if (((sceneLayout = group), sceneLayout.uploaded))
              return "function" == typeof releaseQueue
                ? releaseQueue()
                : void 0;
            ((sceneLayout.uploaded = !0),
              await sceneLayout.loadedAllLayers(),
              (group = group.group));
          }
          let uploads = [],
            _async = [],
            promises = [],
            layouts = [],
            textures = [];
          if (sceneLayout) {
            sceneLayout.textures = textures;
            for (let key in sceneLayout.layers) {
              let layer = sceneLayout.layers[key];
              layer.upload && !layer.uploadIgnore && layer.upload();
            }
          }
          if (sceneLayout.parent) {
            for (let key in sceneLayout.parent.classes) {
              let clss = sceneLayout.parent.classes[key];
              clss.upload && uploads.push(clss.upload.bind(clss));
            }
            sceneLayout.parent.nuke &&
              _this.uploadNukeAsync(sceneLayout.parent.nuke);
          }
          group.traverse((obj) => {
            if (
              (obj.sceneLayout && obj != group && layouts.push(obj.sceneLayout),
              obj.stageLayout && obj != group && layouts.push(obj.stageLayout),
              !obj.uploadIgnore && 0 != obj.visible)
            ) {
              if (obj.shader)
                for (let key in obj.shader.uniforms) {
                  let uniform = obj.shader.uniforms[key];
                  uniform &&
                    uniform.value &&
                    uniform.value.promise &&
                    (textures.push(uniform.value),
                    promises.push(
                      uniform.value.promise
                        .then((_) =>
                          uploads.push(
                            uniform.value.upload.bind(uniform.value),
                          ),
                        )
                        .catch((e) => {}),
                    ));
                }
              if (obj.asyncPromise)
                promises.push(
                  obj.asyncPromise.then((_) => {
                    (obj.geometry && (obj.geometry.distributeBufferData = !0),
                      uploads.push(obj.upload.bind(obj)),
                      obj.geometry &&
                        _async.push(
                          obj.geometry.uploadBuffersAsync.bind(obj.geometry),
                        ));
                  }),
                );
              else if (obj.upload) {
                if (obj.geometry) {
                  if (obj.geometry.uploaded) return;
                  obj.geometry.distributeBufferData = !0;
                }
                (uploads.push(obj.upload.bind(obj)),
                  obj.geometry &&
                    _async.push(
                      obj.geometry.uploadBuffersAsync.bind(obj.geometry),
                    ));
              }
              (obj.shader &&
                obj.shader.shadow &&
                uploads.push(obj.shader.shadow.upload.bind(obj.shader.shadow)),
                obj.classRef &&
                  obj.classRef.upload &&
                  uploads.push(obj.classRef.upload.bind(obj.classRef)));
            }
          });
          let canFinish = !1,
            promise = Promise.create(),
            worker = new Render.Worker((_) => {
              let upload = uploads.shift();
              upload
                ? upload()
                : canFinish
                  ? ((async (_) => {
                      for (let i = 0; i < _async.length; i++) await _async[i]();
                      for (let i = 0; i < layouts.length; i++)
                        await _this.uploadAllAsync(layouts[i], !!releaseQueue);
                      ("function" == typeof releaseQueue && releaseQueue(),
                        promise.resolve());
                    })(),
                    worker.stop())
                  : worker.pause();
            }, 1);
          return (
            Promise.catchAll(promises).then((_) => {
              (worker.resume(), (canFinish = !0));
            }),
            sceneLayout &&
              sceneLayout._completeInitialization &&
              sceneLayout._completeInitialization(!1),
            sceneLayout &&
              promise.then((_) => {
                delete sceneLayout.textures;
              }),
            promise
          );
        }),
      (this.detectUploadAll = function (group, sync, releaseQueue) {
        return sync
          ? _this.uploadAll(group)
          : _this.uploadAllDistributed(group, releaseQueue);
      }),
      (this.detectUploadNuke = function (nuke, sync) {
        return sync ? _this.uploadNukeAsync(nuke) : _this.uploadNuke(nuke);
      }),
      (this.uploadNuke = async function (nuke) {
        if (nuke && nuke.enabled) {
          for (let i = 0; i < nuke.passes.length; i++) {
            let pass = nuke.passes[i],
              uniforms = pass.uniforms;
            for (let key in uniforms)
              (uniforms[key].value &&
                uniforms[key].value.promise &&
                (await uniforms[key].value.promise),
                uniforms[key].value &&
                  uniforms[key].value.upload &&
                  uniforms[key].value.upload());
            pass.upload();
          }
          (Nuke.defaultPass.uploaded || Nuke.defaultPass.upload(),
            nuke.render());
        }
      }),
      (this.uploadNukeAsync = async function (nuke) {
        let queue = await _this.queue(),
          calls = [];
        for (let i = 0; i < nuke.passes.length; i++) {
          let pass = nuke.passes[i],
            uniforms = pass.uniforms;
          for (let key in uniforms)
            (uniforms[key].value &&
              uniforms[key].value.promise &&
              (await uniforms[key].value.promise),
              uniforms[key].value &&
                uniforms[key].value.upload &&
                calls.push(
                  uniforms[key].value.upload.bind(uniforms[key].value),
                ));
          calls.push(pass.upload.bind(pass));
        }
        (Nuke.defaultPass.uploaded ||
          calls.push(Nuke.defaultPass.upload.bind(Nuke.defaultPass)),
          calls.push(nuke.render.bind(nuke)));
        let promise = Promise.create(),
          worker = new Render.Worker(function uploadBuffersAsync() {
            let cb = calls.shift();
            cb ? cb() : (promise.resolve(), worker.stop());
          });
        (await promise, queue());
      }),
      (this.destroyAll = function (scene) {
        scene.traverse((obj) => {
          if (obj.geometry && obj.shader) {
            for (let key in obj.shader.uniforms) {
              let uniform = obj.shader.uniforms[key];
              uniform &&
                uniform.value instanceof Texture &&
                uniform.value.destroy();
            }
            obj.destroy();
          }
        });
      }),
      this.set("loader", (loader) => {
        _loader = loader;
      }));
  }, "static"),
  Class(function InteractAI() {
    Inherit(this, Model);
    ((this.SPEECH_RECOGNITION = "interactai_speech_recognition"),
      (this.GPT_RESPONSE = "interactai_gpt_response"));
  }, "static"),
  InteractAI.Class(function Assistant(_props) {
    Inherit(this, Component);
    const _this = this,
      BACKEND_URL =
        "https://backend-dot-activetheory-v6.uc.r.appspot.com/api/assistant";
    var _thread_id = "",
      _slug = "",
      _project = "";
    async function getThread() {
      await (async function createThread() {
        let response = await post(`${BACKEND_URL}/createThread`),
          { id: id } = await response;
        _thread_id = id;
      })();
    }
    async function sendMessage(message) {
      (await _this.wait((_) => !AppState.get("InteractAIAssistant/isThinking")),
        AppState.set("InteractAIAssistant/isThinking", !0),
        _project && (message = `I'm looking at ${_project}. ` + message),
        await (async function createMessage(content) {
          _thread_id || (await getThread());
          let response = await post(
              `${BACKEND_URL}/createMessage`,
              { threadId: _thread_id, content: content },
              { headers: { "Content-Type": "application/json" } },
            ),
            { message: message } = await response;
          return message;
        })(message),
        await (async function createRun() {
          _thread_id || (await getThread());
          let response = await post(
              `${BACKEND_URL}/createRun`,
              { threadId: _thread_id },
              { headers: { "Content-Type": "application/json" } },
            ),
            { slug: slug } = await response;
          _slug = slug;
        })());
      let text = await (async function listMessage() {
        _thread_id || (await getThread());
        let response = await post(
            `${BACKEND_URL}/listMessage`,
            { threadId: _thread_id },
            { headers: { "Content-Type": "application/json" } },
          ),
          { text: text } = await response;
        return text;
      })();
      return (
        AppState.set("InteractAIAssistant/isThinking", !1),
        _slug &&
          (AppState.set("CMSData/slug", { slug: _slug, message: text }, !0),
          (_slug = "")),
        text
      );
    }
    (AppState.set("InteractAIAssistant/isThinking", !1),
      (async function () {
        !(function addListeners() {
          AppState.bind("Work/project", (data) => {
            _project = data ? data.perma : "";
          });
        })();
      })(),
      (this.once = sendMessage),
      Dev.expose("sendMessage", sendMessage));
  }),
  InteractAI.Class(function GPT(_props) {
    Inherit(this, Component);
    const _this = this;
    var _messages = [];
    async function get() {
      AppState.set("InteractAIGPT/thinking", !0);
      let req = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization:
              "Bearer sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: _messages,
            max_tokens: 100,
          }),
        }),
        json = await req.json();
      _messages.push(json.choices[json.choices.length - 1].message);
      _props.waitFor && !_this.flag("first")
        ? (_this.flag("first", !0),
          _this.bindState(AppState, _props.waitFor, (_) => {
            (_this.events.fire(InteractAI.GPT_RESPONSE, {
              content: json.choices[json.choices.length - 1].message.content,
            }),
              AppState.set(
                "InteractAIGPT/response",
                json.choices[json.choices.length - 1].message.content,
              ));
          }))
        : (_this.events.fire(InteractAI.GPT_RESPONSE, {
            content: json.choices[json.choices.length - 1].message.content,
          }),
          AppState.set(
            "InteractAIGPT/response",
            json.choices[json.choices.length - 1].message.content,
          ));
    }
    function handleRecognition(transcript) {
      _this.input(transcript);
    }
    (!(async function () {
      AppState.bind("SpeechRecognition/ready", (_) => {
        (_messages.push({ role: "system", content: _props.prompt }),
          get(),
          (function addListeners() {
            _this.bindState(
              AppState,
              "InteractAIRecognition/transcript",
              handleRecognition,
            );
          })());
      });
    })(),
      (this.input = function (content) {
        (_messages.push({ role: "user", content: content }), get());
      }),
      (this.once = async function (message) {
        let messages = [{ role: "system", content: message }],
          req = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization:
                "Bearer sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: messages,
              max_tokens: 500,
            }),
          }),
          json = await req.json();
        return json.choices[json.choices.length - 1].message.content;
      }));
  }),
  InteractAI.Class(function Speech(_props) {
    Inherit(this, Component);
    const _this = this;
    async function handleIncomingResponse(content) {
      (await _this.wait("touched"),
        (async function speak(text) {
          let voice = _props.voice || "XB0fDUnXU5powFXDhCwa",
            req = await fetch(
              `https://api.elevenlabs.io/v1/text-to-speech/${voice}?optimize_streaming_latency=${_props.latency}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "xi-api-key": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
                },
                body: JSON.stringify({
                  text: text,
                  model_id: "eleven_monolingual_v1",
                  voice_settings: {
                    stability: 0,
                    similarity_boost: 1,
                    style: 0.2,
                    use_speaker_boost: !0,
                  },
                }),
              },
            ),
            blob = await req.blob(),
            audioURL = URL.createObjectURL(blob),
            audio = new Audio(audioURL);
          (AppState.set("InteractAISpeech/playing", !0),
            AppState.set("InteractAIGPT/thinking", !1),
            audio.play(),
            audio.addEventListener("ended", (_) => {
              AppState.set("InteractAISpeech/playing", !1);
            }));
        })(content));
    }
    function start() {
      ((_this.touched = !0),
        _this.events.unsub(Mouse.input, Interaction.START, start));
    }
    !(function addListeners() {
      (_this.bindState(
        AppState,
        "InteractAIGPT/response",
        handleIncomingResponse,
      ),
        _this.events.sub(Mouse.input, Interaction.START, start));
    })();
  }),
  InteractAI.Class(function SpeechRecognition() {
    Inherit(this, Component);
    const _this = this;
    var _recognition, _refresh;
    function initSR() {
      _recognition && _recognition.stop();
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      (((_recognition = new SpeechRecognition()).onstart = onStart),
        (_recognition.onresult = handleResult),
        (_recognition.onerror = handleError),
        (_recognition.continuous = !0),
        _recognition.start(),
        clearTimeout(_refresh),
        (_refresh = _this.delayedCall(initSR, 5e3)));
    }
    async function handleAudioPlaying(playing) {
      (1 == playing && _this.flag("ignore", !0),
        0 == playing &&
          _this.delayedCall((_) => {
            _this.flag("ignore", !1);
          }, 1e3));
    }
    function onStart() {}
    function handleResult(e) {
      if (
        (clearTimeout(_refresh),
        (_refresh = _this.delayedCall(initSR, 5e3)),
        AppState.get("InteractAIGPT/thinking"))
      )
        return;
      if (AppState.get("InteractAISpeech/playing")) return;
      let transcript = e.results[e.results.length - 1][0].transcript;
      AppState.set("InteractAIRecognition/transcript", transcript);
    }
    async function handleError(e) {}
    (!(function () {
      if (
        (_this.bindState(
          AppState,
          "InteractAISpeech/playing",
          handleAudioPlaying,
        ),
        !("SpeechRecognition" in window) &&
          !("webkitSpeechRecognition" in window))
      )
        return (async function initVosk() {
          const sampleRate = 16e3,
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: !1,
              audio: {
                echoCancellation: !0,
                noiseSuppression: !0,
                channelCount: 1,
                sampleRate: sampleRate,
              },
            });
          await AssetLoader.loadAssets([
            "https://cdn.jsdelivr.net/npm/vosk-browser@0.0.5/dist/vosk.js",
          ]);
          const channel = new MessageChannel(),
            model = await Vosk.createModel(
              "https://storage.googleapis.com/active-theory.appspot.com/ai/vosk-model-small-en-us-0.15.tar.gz",
            );
          model.registerPort(channel.port1);
          const recognizer = new model.KaldiRecognizer(sampleRate);
          (recognizer.setWords(!0),
            recognizer.on("result", (message) => {
              if (AppState.get("InteractAIGPT/thinking")) return;
              if (AppState.get("InteractAISpeech/playing")) return;
              const result = message.result;
              result.text.length &&
                AppState.set("InteractAIRecognition/transcript", result.text);
            }),
            recognizer.on("partialresult", (message) => {
              message.result.partial;
            }));
          const audioContext = new AudioContext();
          await audioContext.audioWorklet.addModule(
            "https://storage.googleapis.com/active-theory.appspot.com/ai/recognizer-processor.js",
          );
          const recognizerProcessor = new AudioWorkletNode(
            audioContext,
            "recognizer-processor",
            { channelCount: 1, numberOfInputs: 1, numberOfOutputs: 1 },
          );
          (recognizerProcessor.port.postMessage(
            { action: "init", recognizerId: recognizer.id },
            [channel.port2],
          ),
            recognizerProcessor.connect(audioContext.destination));
          (audioContext
            .createMediaStreamSource(mediaStream)
            .connect(recognizerProcessor),
            AppState.set("SpeechRecognition/ready", !0));
        })();
      (initSR(), AppState.set("SpeechRecognition/ready", !0));
    })(),
      (this.onDestroy = function () {
        _recognition.stop();
      }));
  }),
  Class(function AreaLightUtil() {
    Inherit(this, Component);
    var _init,
      _loaded = Promise.create(),
      _textures = [];
    this.append = async function (shader) {
      Lighting.fallbackAreaToPoint ||
        (_init ||
          (async function load() {
            _init = !0;
            let data = await fetch(
                Assets.getPath("assets/images/_lighting/arealights.json"),
              ),
              json = await data.json();
            ((_textures[0] = new DataTexture(
              new Float32Array(json.LTC1),
              64,
              64,
              Texture.RGBAFormat,
              Texture.FLOAT,
            )),
              (_textures[1] = new DataTexture(
                new Float32Array(json.LTC2),
                64,
                64,
                Texture.RGBAFormat,
                Texture.FLOAT,
              )),
              _loaded.resolve());
          })(),
        (shader.uniforms.tLTC1 = { type: "t", value: null, ignoreUIL: !0 }),
        (shader.uniforms.tLTC2 = { type: "t", value: null, ignoreUIL: !0 }),
        await _loaded,
        shader.set("tLTC1", _textures[0]),
        shader.set("tLTC2", _textures[1]));
    };
  }, "static"),
  Class(
    function Light(_input, _group) {
      Inherit(this, Object3D);
      const _this = this;
      var _config,
        _folder,
        _debug,
        prefix = `L_${_input.prefix}`,
        _light = (this.light = new BaseLight());
      function loop() {
        (_light.position.copy(_this.group.position),
          _light.rotation.copy(_this.group.rotation));
      }
      function initNumber(key) {
        let initValue = UILStorage.get(`${prefix}${key}`) || _light[key];
        if (_folder) {
          let number = new UILControlNumber(`${prefix}${key}`, {
            label: key,
            value: initValue,
            step: 0.05,
          });
          (number.onChange((e) => {
            ((_light[key] = e),
              _this.events.fire(Light.UPDATE, {
                prefix: prefix,
                key: key,
                val: e,
                group: _this,
              }));
          }),
            number.onFinishChange((e) => UILStorage.set(`${prefix}${key}`, e)),
            _folder.add(number));
        }
        _light[key] = initValue;
      }
      function update(e) {
        e.prefix == prefix &&
          e.group != _this &&
          (e.color ? _light[e.key].set(e.val) : (_light[e.key] = e.val));
      }
      (!(function () {
        (!(async function initConfig() {
          ((_config = InputUIL.create(prefix + "_config", _group)).setLabel(
            "Config",
          ),
            _config.addSelect("type", [
              { label: "Null", value: "-1" },
              { label: "Directional", value: "0" },
              { label: "Point", value: "1" },
              { label: "Spot", value: "2" },
              { label: "Area", value: "3" },
            ]),
            await defer());
          let setup = (_) => {
            ((_light.properties.w = _config.getNumber("type") + 1),
              _group &&
                Utils.query("debugLight") &&
                (_debug && _debug.destroy(),
                (_debug = _this.initClass(
                  LightDebug,
                  _config.getNumber("type"),
                  _light,
                  _folder,
                ))));
          };
          (setup(),
            (function initSpecificUIL(type) {
              switch (type) {
                case 0:
                  break;
                case 2:
                  ((_light.radius = 1),
                    (_light.feather = 0),
                    _light.rotation.set(0, Math.radians(90), 0),
                    initNumber("radius"),
                    initNumber("feather"),
                    _light.data.set(
                      _light.rotation.z,
                      _light.rotation.y,
                      _light.rotation.x,
                      _light.radius,
                    ),
                    (_light.data2.x = _light.feather),
                    _group &&
                      _this.startRender((_) => {
                        ((_light.data2.x = _light.feather),
                          _light.data.set(
                            _light.rotation.z,
                            _light.rotation.y,
                            _light.rotation.x,
                            _light.radius,
                          ));
                      }));
                  break;
                case 3:
                  ((_light._overridePos = new Vector3()),
                    (_light.width = 1),
                    (_light.height = 1),
                    (_light.roughness = 0.5),
                    (_light.isAreaLight = !0),
                    initNumber("width"),
                    initNumber("height"),
                    initNumber("roughness"));
                  let pos = new Vector3(),
                    matrix4 = new Matrix4(),
                    matrix42 = new Matrix4(),
                    halfWidth = new Vector3(),
                    halfHeight = new Vector3(),
                    camera = World.CAMERA,
                    p = _this.group._parent;
                  for (; p; )
                    (p instanceof Scene && p.nuke && (camera = p.nuke.camera),
                      (p = p._parent));
                  let updateProperties = (_) => {
                    (_light.updateMatrixWorld(!0),
                      pos.setFromMatrixPosition(_light.matrixWorld),
                      pos.applyMatrix4(camera.matrixWorldInverse),
                      (_light.data.x = pos.x),
                      (_light.data.y = pos.y),
                      (_light.data.z = pos.z),
                      (_light.data.w = _light.roughness),
                      matrix42.identity(),
                      matrix4.copy(_light.matrixWorld),
                      matrix4.premultiply(camera.matrixWorldInverse),
                      matrix42.extractRotation(matrix4),
                      halfWidth.set(0.5 * _light.width, 0, 0),
                      halfHeight.set(0, 0.5 * _light.height, 0),
                      halfWidth.applyMatrix4(matrix42),
                      halfHeight.applyMatrix4(matrix42),
                      (_light.data2.x = halfWidth.x),
                      (_light.data2.y = halfWidth.y),
                      (_light.data2.z = halfWidth.z),
                      (_light.data3.x = halfHeight.x),
                      (_light.data3.y = halfHeight.y),
                      (_light.data3.z = halfHeight.z));
                  };
                  RenderManager.type == RenderManager.WEBVR
                    ? _this.startRender((e) => {
                        ((camera = e.camera), updateProperties());
                      }, RenderManager.EYE_RENDER)
                    : _this.startRender(updateProperties);
              }
            })(_config.getNumber("type")),
            (_config.onUpdate = setup));
        })(),
          _group &&
            ((_folder = (function createFolder() {
              if (!UIL.sidebar) return null;
              let folder = new UILFolder(prefix, {
                label: "Params",
                closed: !0,
              });
              return (_group.add(folder), folder);
            })()),
            (function addListeners() {
              _this.events.sub(Light.UPDATE, update);
            })()),
          initNumber("intensity"),
          initNumber("distance"),
          initNumber("bounce"),
          (function initColor(key) {
            let initValue = UILStorage.get(`${prefix}${key}`);
            if (_folder) {
              let color = new UILControlColor(`${prefix}${key}`, {
                label: key,
                value: initValue,
              });
              (color.onChange((e) => {
                (_light[key].set(e),
                  _this.events.fire(Light.UPDATE, {
                    prefix: prefix,
                    key: key,
                    val: e,
                    color: !0,
                    group: _this,
                  }));
              }),
                color.onFinishChange((e) =>
                  UILStorage.set(`${prefix}${key}`, e),
                ),
                _folder.add(color));
            }
            initValue && _light[key].set(initValue);
          })("color"));
        let p = _this.parent.group._parent;
        for (; p; )
          (p instanceof Scene &&
            p._lightingData &&
            (_light._lightingData = p._lightingData),
            (p = p._parent));
        (Lighting.add(_light), _this.startRender(loop));
      })(),
        (this.onDestroy = function () {
          _light.destroy();
        }),
        (this.setColor = function (color) {
          _light.color.copy(color);
        }));
    },
    (_) => {
      Light.UPDATE = "light_update";
    },
  ),
  Class(function LightDebug(_type, _light, _folder) {
    Inherit(this, Object3D);
    const _this = this;
    function createLight() {
      let geom = World.SPHERE,
        shader = Utils3D.getTestShader(_light.color);
      (shader.set("color", _light.color),
        (shader.depthTest = !1),
        (shader.transparent = !0));
      let mesh = new Mesh(geom, shader);
      (mesh.scale.setScalar(0.5), _this.add(mesh));
    }
    (!(function () {
      switch (_type) {
        case -1:
        case 1:
        case 0:
          !(function initPoint() {
            createLight();
            let geom = new IcosahedronGeometry(1, 1),
              shader = Utils3D.getTestShader(_light.color);
            (shader.set("color", _light.color),
              (shader.wireframe = !0),
              (shader.transparent = !0),
              shader.set("alpha", 0.2));
            let mesh = new Mesh(geom, shader);
            (mesh.scale.setScalar(_light.distance),
              _this.add(mesh),
              _this.startRender((_) => mesh.scale.setScalar(_light.distance)));
          })();
          break;
        case 2:
          !(function initSpot() {
            createLight();
          })();
          break;
        case 3:
          !(function initArea() {
            let geom = World.PLANE,
              shader = Utils3D.getTestShader(_light.color);
            (shader.set("color", _light.color),
              (shader.transparent = !0),
              (shader.side = Shader.DOUBLE_SIDE));
            let mesh = new Mesh(geom, shader);
            (_this.add(mesh),
              _this.startRender((_) =>
                mesh.scale.set(_light.width, _light.height, 1),
              ));
          })();
      }
    })(),
      (this.onDestroy = function () {
        _this.parent.group.remove(_this.group);
      }));
  }),
  Class(function LitMaterial(_mesh, _shader, _group, _input) {
    ((_shader.receiveLight = !0),
      (_shader.receiveShadow = !0),
      _shader.addUniforms({
        tMap: {
          value: Utils3D.getTexture("assets/images/_scenelayout/black.jpg"),
        },
      }));
  }),
  Class(function ShadowLight(_input, _group) {
    Inherit(this, Object3D);
    const _this = this;
    var _light, _timer;
    (!(async function () {
      (((_light = new BaseLight()).prefix = _input.prefix),
        _this.add(_light),
        (_light.silentShadow = ShadowLight.LOCKED),
        (_this.light = _light));
      let scene,
        p = _this.parent.group._parent;
      for (; p; )
        (p instanceof Scene &&
          p._lightingData &&
          (_light._lightingData = p._lightingData),
          (p = p._parent));
      ((_light.castShadow = !0),
        ShadowUIL.add(_light, _group).setLabel("Shadows"),
        ShadowLight.LOCKED ||
          (_this.startRender((_) => {}),
          _this.flag("waitStarted", Render.TIME),
          await _this.wait(
            () => (
              (scene = (function findScene() {
                let p = _this.group._parent;
                for (; p; ) {
                  if (p instanceof Scene) return p;
                  p = p._parent;
                }
              })()),
              !scene &&
                !_this.flag("warned") &&
                Render.TIME - _this.flag("waitStarted") > 2e3 &&
                (console.warn("ShadowLight has no parent scene after 2000ms"),
                _this.flag("warned", !0)),
              scene &&
                _this.flag("warned") &&
                console.log(
                  `False alarm, ShadowLight got parent scene after ${Render.TIME - _this.flag("waitStarted")}ms`,
                ),
              scene
            ),
          ),
          (scene.hasShadowLight = !0),
          scene.bindSceneChange((_) => {
            _light.static &&
              ((_light.shadow.frozen = !1),
              clearTimeout(_timer),
              (_timer = _this.delayedCall(
                (_) => (_light.shadow.frozen = !0),
                250,
              )));
          })));
    })(),
      (this.onVisible = async function () {
        (await defer(),
          _light.static &&
            ((_light.shadow.frozen = !1),
            clearTimeout(_timer),
            (_timer = _this.delayedCall(
              (_) => (_light.shadow.frozen = !0),
              250,
            ))));
      }),
      (this.onDestroy = function () {
        _light.destroy();
      }));
  }),
  Class(
    function LightVolume(_input, _group) {
      Inherit(this, Object3D);
      const _this = this;
      var _data;
      (!(function initInput() {
        ((_data = InputUIL.create(`Light_${_input.prefix}`, _group)).setLabel(
          "Light Config",
        ),
          _data.add("layers", 5),
          _data.addToggle("sphere"));
      })(),
        (function initGeometry() {
          let sphere = _data.get("sphere"),
            layers = _data.getNumber("layers"),
            geom = sphere
              ? LightVolume.getSphereGeometry(layers)
              : LightVolume.getGeometry(layers),
            billboard = _input.get("billboard"),
            shader = _this.initClass(Shader, "LightVolume", {
              unique: _input.prefix,
              tMap: {
                value: Utils3D.getTexture(
                  "assets/images/_lightvolume/light.jpg",
                ),
              },
              tMask: {
                value: Utils3D.getRepeatTexture(
                  "assets/images/_lightvolume/light-mask.jpg",
                ),
              },
              uScale: { value: 1 },
              uSeparation: { value: 0.1 },
              uAlpha: { value: 1 },
              uMaskScale: { value: 1 },
              uRotateSpeed: { value: 1 },
              uRotateTexture: { value: 0 },
              uNoiseScale: { value: 0 },
              uNoiseSpeed: { value: 0 },
              uNoiseRange: { value: 0 },
              uOffset: { value: 0 },
              uScrollX: { value: 1 },
              uScrollY: { value: 1 },
              uHueShift: { value: 0 },
              uDPR: { value: World.DPR },
              uNoiseMin: { value: 1 },
              uColor: { value: new Color() },
              transparent: !0,
              depthWrite: !1,
              blending: Shader.ADDITIVE_BLENDING,
              side: _input.get("side"),
            });
          ShaderUIL.add(shader, _group).setLabel("Shader");
          let mesh = new Mesh(geom, shader);
          ((mesh.frustumCulled = !1),
            _this.add(mesh),
            (_this.shader = shader),
            (_this.mesh = mesh));
          let renderOrder = _input.getNumber("renderOrder");
          ("number" != typeof renderOrder ||
            isNaN(renderOrder) ||
            (mesh.renderOrder = _this.parent.baseRenderOrder + renderOrder),
            !1 === _input.get("depthTest") && (shader.depthTest = !1),
            billboard &&
              JSON.parse(billboard) &&
              _this.startRender((_) => Utils3D.billboard(mesh)));
        })(),
        this.set("dpr", (v) => {
          _this.shader.set("uDPR", v);
        }),
        this.set("noise", (v) => {
          _this.shader.set("uNoiseMin", v);
        }),
        this.set("needsUpdate", (v) => {
          _this.shader.ubo && (_this.shader.ubo.needsUpdate = !0);
        }));
    },
    (_) => {
      var _quad,
        _sphere,
        _geom = {};
      ((LightVolume.getGeometry = function (layers) {
        if (
          (_quad || (_quad = new PlaneGeometry(1, 1).toNonIndexed()),
          !_geom[layers])
        ) {
          let geom = new Geometry();
          for (let key in _quad.attributes)
            geom.addAttribute(key, _quad.attributes[key]);
          let offset = new Float32Array(3 * layers),
            attribs = new Float32Array(4 * layers);
          for (let i = 0; i < layers; i++)
            ((offset[3 * i + 2] = i),
              (attribs[4 * i + 0] = Math.random(0, 1, 5)),
              (attribs[4 * i + 1] = Math.random(0, 1, 5)),
              (attribs[4 * i + 2] = Math.random(0, 1, 5)),
              (attribs[4 * i + 3] = Math.random(0, 1, 5)));
          (geom.addAttribute("offset", new GeometryAttribute(offset, 3, 1)),
            geom.addAttribute("attribs", new GeometryAttribute(attribs, 4, 1)),
            (_geom[layers] = geom));
        }
        return _geom[layers];
      }),
        (LightVolume.getSphereGeometry = function (layers) {
          if (
            (_sphere ||
              (_sphere = new SphereGeometry(1, 32, 32).toNonIndexed()),
            !_geom[`sphere_${layers}`])
          ) {
            let geom = new Geometry();
            for (let key in _sphere.attributes)
              geom.addAttribute(key, _sphere.attributes[key]);
            let offset = new Float32Array(3 * layers),
              attribs = new Float32Array(4 * layers);
            for (let i = 0; i < layers; i++)
              ((offset[3 * i + 2] = i),
                (attribs[4 * i + 0] = Math.random(0, 1, 5)),
                (attribs[4 * i + 1] = Math.random(0, 1, 5)),
                (attribs[4 * i + 2] = Math.random(0, 1, 5)),
                (attribs[4 * i + 3] = Math.random(0, 1, 5)));
            (geom.addAttribute("offset", new GeometryAttribute(offset, 3, 1)),
              geom.addAttribute(
                "attribs",
                new GeometryAttribute(attribs, 4, 1),
              ),
              (_geom[`sphere_${layers}`] = geom));
          }
          return _geom[`sphere_${layers}`];
        }));
    },
  ),
  Class(function Webcam(_width, _height, _audio) {
    Inherit(this, Component);
    var _this = this;
    let _stream,
      _imageData,
      _cameras = {},
      _config = {},
      _back = !1,
      _attempts = 0;
    if ("object" == typeof _width && _width.isAppState) {
      let config = _width;
      ((_width = config.width),
        (_height = config.height),
        (_audio = config.audio));
    }
    function establishWebcam() {
      if (_attempts >= 2 || !navigator.mediaDevices) return error();
      ((function lookupDevices() {
        let promise = Promise.create();
        return (
          navigator.mediaDevices.enumerateDevices().then((devices) => {
            (devices.forEach((device) => {
              (device.label.includes("front") &&
                (_cameras.front = { deviceId: { exact: device.deviceId } }),
                device.label.includes("back") &&
                  ((_cameras.back = { deviceId: { exact: device.deviceId } }),
                  (_back = !0)));
            }),
              _cameras.front || (_cameras.front = { facingMode: "user" }),
              _cameras.back ||
                ((_cameras.back = { facingMode: "environment" }), (_back = !1)),
              promise.resolve());
          }),
          promise
        );
      })().then(() => {
        (_stream && _config.back && _stream.getTracks()[0].stop(),
          Device.mobile.phone &&
            (_cameras &&
              _cameras.back &&
              (_cameras.back.frameRate = { ideal: 60 }),
            _cameras &&
              _cameras.front &&
              (_cameras.front.frameRate = { ideal: 60 })),
          _width && (_cameras.front.width = { ideal: _width }),
          _height && (_cameras.front.height = { ideal: _height }),
          navigator.mediaDevices
            .getUserMedia({
              video: _config.back ? _cameras.back : _cameras.front || !0,
              audio: _audio,
            })
            .then(success)
            .catch(error));
      }),
        (_attempts += 1));
    }
    function success(stream) {
      ((_this.denied = !1), (_stream = stream));
      let settings = _stream.getTracks()[0].getSettings();
      ((_width = settings.width),
        (_height = settings.height),
        _config.back && !_back
          ? establishWebcam()
          : ((_this.div.width = _width),
            (_this.div.height = _height),
            (_this.div.srcObject = stream),
            _this.events.fire(Events.READY, null, !0)));
    }
    function error() {
      ((_this.denied = !0), _this.events.fire(Events.ERROR, null, !0));
    }
    function update() {
      (_this.events.fire(Events.UPDATE),
        _this.div.requestVideoFrameCallback?.(update),
        (_imageData = null));
    }
    ((_this.facing = "back"),
      (function createVideo() {
        ((_this.div = document.createElement("video")),
          (_this.div.width = _width || 320),
          (_this.div.height = _height || 180),
          (_this.div.autoplay = !0),
          (_this.div.playsinline = !0),
          _this.div.setAttribute("playsinline", !0),
          (_this.div.style.zIndex = -1),
          (_this.div.style.position = "absolute"),
          Stage.add(_this.div),
          (_this.element = $(_this.div)));
      })(),
      (function initNavigator() {
        navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
      })(),
      (this.createStream = function (config = {}) {
        ((_attempts = 0),
          (_config = config),
          Device.mobile || (delete _config.back, delete _config.front),
          establishWebcam(),
          _this.div.requestVideoFrameCallback
            ? _this.div.requestVideoFrameCallback(update)
            : _this.startRender(update, 24));
      }),
      (this.flip = function () {
        if (!_back) return;
        let direction;
        ("front" === _this.facing
          ? ((_this.facing = "back"), (direction = _cameras.back))
          : ((_this.facing = "front"), (direction = _cameras.front)),
          _stream.getTracks()[0].stop(),
          navigator.getUserMedia(
            { video: direction || !0, audio: _audio },
            success,
            error,
          ));
      }),
      this.get("width", function () {
        return _width;
      }),
      this.get("height", function () {
        return _height;
      }),
      (this.size = function (w, h) {
        ((_this.div.width = _width = w),
          (_this.div.height = _height = h),
          _this.element.size(w, h));
      }),
      (this.getPixels = function (width = _width, height = _height) {
        return (
          _this.canvas ||
            ((_this.canvas = document.createElement("canvas")),
            (_this.canvas.width = width),
            (_this.canvas.height = height),
            (_this.canvas.context = _this.canvas.getContext("2d", {
              willReadFrequently: !0,
            }))),
          _imageData ||
            _this.canvas.context.drawImage(_this.div, 0, 0, width, height),
          (_imageData = !0),
          _this.canvas.context.getImageData(0, 0, width, height)
        );
      }),
      (this.getCanvas = function () {
        return (
          _this.canvas ||
            ((_this.canvas = document.createElement("canvas")),
            (_this.canvas.width = _width),
            (_this.canvas.height = _height),
            (_this.canvas.context = _this.canvas.getContext("2d"))),
          _this.canvas.context.drawImage(_this.div, 0, 0, _width, _height),
          _this.canvas
        );
      }),
      (this.ready = function () {
        return _this.wait((_) => _this.div.readyState > 0);
      }),
      (this.end = function () {
        ((_this.active = !1),
          _this.div.pause(),
          _stream && (_stream.getTracks()[0].enabled = !1));
      }),
      (this.restart = function () {
        (_this.div.play(),
          _stream && (_stream.getTracks()[0].enabled = !0),
          (_this.active = !0));
      }),
      (this.deviceCount = async function (kind) {
        if (!navigator.mediaDevices) return 0;
        let devices = await navigator.mediaDevices.enumerateDevices(),
          count = 0;
        return (
          devices.forEach((d) => {
            d.kind.includes(kind) && count++;
          }),
          count
        );
      }),
      this.get("frameRate", () => {
        if (_stream) return _stream.getTracks()[0].getSettings().frameRate;
      }),
      this.get("aspectRatio", () => {
        if (_stream) return _stream.getTracks()[0].getSettings().aspectRatio;
      }));
  }),
  Namespace("FX"),
  FX.Class(
    function Mirror(_mesh, _params = {}) {
      Inherit(this, FXScene);
      const _this = this;
      var _renderer, _renderer2;
      if (_mesh.isAppState) {
        let props = _mesh;
        ((_mesh = props.mesh), (_params = props));
      }
      var _renderTarget,
        _frustum = new Frustum();
      function loop({ stage: stage, camera: camera, view: view, eye: eye }) {
        if (!_this.visible || !_this.enabled || !_mesh) return;
        let renderer = "right" === eye ? _renderer2 : _renderer;
        if (
          (stage
            ? ((renderer.camera = camera),
              (_this.nuke.camera = camera),
              (_this.nuke.stage = stage))
            : (_params.nuke &&
                _params.nuke.camera != _this.nuke.camera &&
                (_this.nuke.camera = _params.nuke.camera),
              _this.nuke.camera != _renderer.camera &&
                (_renderer.camera = _this.nuke.camera)),
          _this.frustumCulled &&
            (_frustum.setFromCamera(_this.nuke.camera),
            !_frustum.intersectsObject(_mesh)))
        )
          return;
        (_this.draw(),
          _mesh.matrixWorld.decompose(
            renderer.position,
            renderer.quaternion,
            renderer.scale,
          ));
        let clearColor = null;
        (_this.clearColor &&
          ((clearColor = World.RENDERER.getClearColor().getHex()),
          World.RENDERER.setClearColor(_this.clearColor)),
          (World.RENDERER.overridePreventShadows = !0),
          (_renderTarget.customViewport = renderer.customViewport),
          (renderer.autoClear = !view),
          renderer.render(_this.scene),
          (World.RENDERER.overridePreventShadows = !1),
          _this.clearColor && World.RENDERER.setClearColor(clearColor),
          _this.postRender && _this.postRender());
      }
      function decorateShader(shader) {
        ((shader.uniforms.tMirrorReflection = {
          value: _renderer.renderTarget.texture,
          ignoreUIL: !0,
        }),
          (shader.uniforms.uMirrorMatrix = {
            value: _renderer.textureMatrix,
            ignoreUIL: !0,
          }),
          (shader.uniforms.uIsMirror = FX.Mirror.isMirrorUniform),
          _this.usingVR &&
            RenderManager.schedule(({ object: object, eye: eye }) => {
              object.shader === shader &&
                Shader.renderer.appendUniform(
                  object.shader,
                  "uMirrorMatrix",
                  "left" === eye
                    ? _renderer.textureMatrix
                    : _renderer2.textureMatrix,
                );
            }, RenderManager.BEFORE_OBJECT_EYE_RENDER));
      }
      ((this.visible = !0),
        (this.enabled = "boolean" != typeof _params.enabled || _params.enabled),
        (this.frustumCulled = !0),
        (this.manualRender = !0),
        _mesh &&
          _mesh.isGroup &&
          _mesh.traverse((obj) => {
            obj.shader && "TestMaterial" !== obj.shader.fsName && (_mesh = obj);
          }),
        _mesh && !_params.shader && (_params.shader = _mesh.shader),
        (_params.nuke =
          _params.nuke ||
          (function findNuke() {
            let p = _this.parent;
            for (; p; ) {
              if (p.nuke) return p.nuke;
              p = p.parent;
            }
            for (p = _this.parent; p; ) {
              if (p.nuke) return p.nuke;
              p = p.group ? p.group._parent : p.parent || p._parent;
            }
            return World.NUKE;
          })()),
        _this.create(_params.nuke),
        (_this.preventRTDraw = !0),
        (_this.usingVR = RenderManager.type === RenderManager.VR),
        (function initMirror() {
          let width = _params.width || 512,
            height = _params.height || 512;
          (_params.size && (width = height = _params.size),
            _this.usingVR && (width *= 2));
          let filter = _params.mipmaps ? Texture.LINEAR_MIPMAP : Texture.LINEAR;
          ((_renderTarget = new RenderTarget(width, height, {
            minFilter: filter,
            magFilter: filter,
            format: _params.format || Texture.RGBFormat,
            generateMipmaps: _params.mipmaps || !1,
          })),
            (_renderer = new MirrorRenderer(_params.nuke.camera, {
              renderTarget: _renderTarget,
              clipBias: _params.clipBias || 0.01,
              sx: _this.usingVR ? 0.25 : 0.5,
            })),
            _this.usingVR &&
              ((_renderer2 = new MirrorRenderer(_params.nuke.camera, {
                renderTarget: _renderTarget,
                clipBias: _params.clipBias || 0.01,
                sx: 0.25,
                tx: 0.5,
              })),
              (_renderer.customViewport = new Vector4(0, 0, width / 2, height)),
              (_renderer2.customViewport = new Vector4(
                width / 2,
                0,
                width / 2,
                height,
              ))),
            _params.normal &&
              ((_renderer.normalDir = _params.normal),
              _this.usingVR && (_renderer2.normalDir = _params.normal)));
        })(),
        decorateShader(_params.shader),
        (this.onDestroy = function () {
          (_renderer.destroy(), _renderer2 && _renderer2.destroy());
        }),
        (this.applyTo = decorateShader),
        (this.start = function (nuke = _params.nuke) {
          _this.startRender(
            loop,
            _this.usingVR ? RenderManager.EYE_RENDER : nuke,
          );
        }),
        (this.stop = function (nuke = _params.nuke) {
          _this.stopRender(
            loop,
            _this.usingVR ? RenderManager.EYE_RENDER : nuke,
          );
        }),
        (this.decorate = decorateShader),
        (this.useMesh = function (mesh) {
          ((_mesh = mesh),
            _params.shader || (_params.shader = _mesh.shader),
            decorateShader(_params.shader));
        }),
        (this.useCamera = function (camera) {
          ((camera = camera.camera || camera),
            (_renderer.camera = camera),
            (_this.nuke.camera = camera),
            _renderer2 && (_renderer2.camera = camera));
        }),
        (this.add = async function (obj) {
          return _params.nuke.attachments > 1
            ? (await obj.shader.onBeforePrecompilePromise, _this.addObject(obj))
            : _this.addObject(obj);
        }),
        (this.render = loop),
        this.set("clipBias", (v) => (_renderer.clipBias = v)));
    },
    () => {
      FX.Mirror.isMirrorUniform = { value: 0, type: "f", ignoreUIL: !0 };
    },
  ));
class MirrorRenderer extends Base3D {
  constructor(camera, options = {}) {
    (super(),
      (this._camera = camera),
      (this.autoClear = options.autoClear ?? !0),
      (this.width = options.width || 512),
      (this.height = options.height || 512),
      (this.clipBias = options.clipBias || 0),
      (this.sx = options.sx || 0.5),
      (this.tx = options.tx || 0),
      (this.renderer = World.RENDERER),
      (this.mirrorPlane = new Plane()),
      (this.normalDir = new Vector3(0, 0, 1)),
      (this.normal = new Vector3(0, 0, 1)),
      (this.mirrorWorldPosition = new Vector3()),
      (this.cameraWorldPosition = new Vector3()),
      (this.rotationMatrix = new Matrix4()),
      (this.lookAtPosition = new Vector3(0, 0, -1)),
      (this.clipPlane = new Vector4()),
      (this.textureMatrix = new Matrix4()),
      (this.mirrorCamera = this._camera.clone()));
    let filter = options.mipmaps ? Texture.LINEAR_MIPMAP : Texture.LINEAR;
    ((this.renderTarget =
      options.renderTarget ||
      new RenderTarget(this.width, this.height, {
        minFilter: filter,
        magFilter: filter,
        format: options.format || Texture.RGBFormat,
        generateMipmaps: options.mipmaps || !1,
      })),
      (this.viewVec = new Vector3()),
      (this.targetVec = new Vector3()),
      (this.q = new Quaternion()),
      this.updateTextureMatrix());
  }
  updateTextureMatrix() {
    (this.updateMatrixWorld(),
      this._camera.updateMatrixWorld(),
      this.mirrorWorldPosition.setFromMatrixPosition(this.matrixWorld),
      this.cameraWorldPosition.setFromMatrixPosition(this._camera.matrixWorld),
      this.rotationMatrix.extractRotation(this.matrixWorld),
      this.normal.copy(this.normalDir),
      this.normal.applyMatrix4(this.rotationMatrix),
      this.viewVec.copy(this.mirrorWorldPosition).sub(this.cameraWorldPosition),
      this.viewVec.reflect(this.normal).negate(),
      this.viewVec.add(this.mirrorWorldPosition),
      this.rotationMatrix.extractRotation(this._camera.matrixWorld),
      this.lookAtPosition.set(0, 0, -1),
      this.lookAtPosition.applyMatrix4(this.rotationMatrix),
      this.lookAtPosition.add(this.cameraWorldPosition),
      this.targetVec.copy(this.mirrorWorldPosition).sub(this.lookAtPosition),
      this.targetVec.reflect(this.normal).negate(),
      this.targetVec.add(this.mirrorWorldPosition),
      this.up.set(0, -1, 0),
      this.up.applyMatrix4(this.rotationMatrix),
      this.up.reflect(this.normal).negate(),
      this.mirrorCamera.position.copy(this.viewVec),
      (this.mirrorCamera.up = this.up),
      this.mirrorCamera.lookAt(this.targetVec),
      this.mirrorCamera.updateMatrixWorld(),
      this.mirrorCamera.projectionMatrix.copy(this._camera.projectionMatrix),
      this.textureMatrix.set(
        this.sx,
        0,
        0,
        this.sx + this.tx,
        0,
        0.5,
        0,
        0.5,
        0,
        0,
        0.5,
        0.5,
        0,
        0,
        0,
        1,
      ),
      this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix),
      this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse),
      this.mirrorPlane.setFromNormalAndCoplanarPoint(
        this.normal,
        this.mirrorWorldPosition,
      ),
      this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse),
      this.clipPlane.set(
        this.mirrorPlane.normal.x,
        this.mirrorPlane.normal.y,
        this.mirrorPlane.normal.z,
        this.mirrorPlane.constant,
      ));
    let projectionMatrix = this.mirrorCamera.projectionMatrix,
      q = this.q;
    ((q.x =
      (Math.sign(this.clipPlane.x) + projectionMatrix.elements[8]) /
      projectionMatrix.elements[0]),
      (q.y =
        (Math.sign(this.clipPlane.y) + projectionMatrix.elements[9]) /
        projectionMatrix.elements[5]),
      (q.z = -1),
      (q.w =
        (1 + projectionMatrix.elements[10]) / projectionMatrix.elements[14]));
    let c = this.clipPlane.multiplyScalar(2 / this.clipPlane.dot(q));
    ((projectionMatrix.elements[2] = c.x),
      (projectionMatrix.elements[6] = c.y),
      (projectionMatrix.elements[10] = c.z + 1 - this.clipBias),
      (projectionMatrix.elements[14] = c.w));
  }
  render(scene) {
    (this.updateTextureMatrix(), (FX.Mirror.isMirrorUniform.value = 1));
    let autoClear = this.renderer.autoClear;
    ((this.renderer.autoClear = this.autoClear),
      this.renderer.render(scene, this.mirrorCamera, this.renderTarget),
      (this.renderer.autoClear = autoClear),
      (FX.Mirror.isMirrorUniform.value = 0));
  }
  destroy() {
    this.renderTarget.destroy();
  }
  set camera(c) {
    ((this._camera = c), (this.mirrorCamera = c.clone()));
  }
  get camera() {
    return this._camera;
  }
}
(Class(function MouseFluid(_params = { active: !0 }) {
  Inherit(this, Object3D);
  const _this = this;
  var _config, _fluid, _custom;
  this.scale = 1;
  var _scale = 1,
    _last = new Vector2(),
    _mouse = new Vector2(),
    _white = new Color("#ffffff");
  function loop() {
    ((_scale +=
      (_this.scale - _scale) * Math.framerateNormalizeLerpAlpha(0.05)),
      _custom || _mouse.copy(Mouse));
    let len = _mouse.distanceTo(_last),
      size = _this.scaleBasedOnVelocity ? Math.range(len, 0, 5, 0, 60, !0) : 25;
    size *= 0.6;
    let delta = Math.range(len, 0, 15, 0, 10, !0);
    (len > 0.01 &&
      _fluid.drawInput(
        _mouse.x,
        _mouse.y,
        (_mouse.x - _last.x) * delta,
        (_mouse.y - _last.y) * delta,
        _white,
        size * _scale,
      ),
      _last.copy(_mouse));
  }
  ((this.scaleBasedOnVelocity = !0),
    (async function () {
      let layout = _this.initClass(SceneLayout, "mousefluid");
      ((_fluid = await layout.getLayer("fluid")),
        (function initConfig() {
          ((_config = InputUIL.create(
            _fluid.uilInput.prefix + "mousefluid",
            _fluid.uilGroup,
          )).setLabel("MouseFluid Config"),
            _config.add("scale", 1),
            (_config.onUpdate = (key) => {
              if ("scale" === key) _this.scale = _config.getNumber("scale");
            }),
            _config.onUpdate());
        })(),
        _this.isPlayground() && _fluid.initMesh(),
        (_this.fluid = _fluid),
        _params.active
          ? _this.startRender(loop, RenderManager.AFTER_LOOPS)
          : (_fluid.visible = !1));
    })(),
    (this.applyTo = async function (shader) {
      (await _this.wait("fluid"),
        (shader.uniforms.tFluid = _fluid.fbos.velocity.uniform),
        (shader.uniforms.tFluidMask = { value: _fluid }));
    }),
    (this.useCustomMouse = function () {
      _custom = !0;
    }),
    (this.getFluid = async function () {
      return (await _this.wait("fluid"), _this.fluid);
    }),
    this.get("mouse", (_) => _mouse));
}, "singleton"),
  Class(function Multiplayer() {
    Inherit(this, Component);
    const _this = this;
    let _room, _focusPromise, _leavingPromise, _joiningPromise;
    async function leave() {
      (await _joiningPromise, (_leavingPromise = Promise.create()));
      let fallback = _this.delayedCall((_) => {
        ((_this.leaving = !1), _leavingPromise.resolve());
      }, 5e3);
      ((_this.leaving = !0),
        PhysicalSync.useRoom(null),
        _room && _room.leave && (_room = _room.leave()),
        PlayerModel.useRoom(null),
        window.GameCenterMedia && (await GameCenterMedia.useRoom(null)),
        (_this.leaving = !1),
        _leavingPromise.resolve(),
        clearTimeout(fallback));
    }
    function onVisibility(e) {
      "focus" == e.type
        ? _focusPromise && _focusPromise.resolve()
        : (_focusPromise = null);
    }
    function handlePin(e) {
      _this.events.fire(_this.PIN, e);
    }
    function handleUnpin(e) {
      _this.events.fire(_this.UNPIN, e);
    }
    function gameCenterBlocked() {
      _this.events.fire(_this.UNREACHABLE);
    }
    ((this.ROOM = "multiplayer_room"),
      (this.PIN = "multiplayer_pin"),
      (this.UNPIN = "multiplayer_unpin"),
      (this.UNREACHABLE = "multiplayer_unreachable"),
      (function addListeners() {
        _this.events.sub(Events.VISIBILITY, onVisibility);
      })(),
      (this.connect = function (server) {
        (GameCenter.connect(server),
          _this.events.sub(GameCenter.BLOCKED_ERROR, gameCenterBlocked));
      }),
      (this.establish = async function (obj) {
        (_room && leave(),
          await _leavingPromise,
          await _this.wait(50),
          (_joiningPromise = Promise.create()));
        try {
          if (obj.roomId) {
            let fn = obj.watcher ? GameCenter.watchRoom : GameCenter.joinRoom;
            _room = await fn(
              `${obj.community ? "community_" : ""}${obj.roomKey + "/" + obj.roomId}`,
              obj,
            );
          } else
            _room = await GameCenter.findRoom(
              `${obj.community ? "community_" : ""}${obj.roomKey}`,
              obj,
            );
        } catch (e) {
          if (!obj.roomId || !obj.community) throw e;
          try {
            _room = await GameCenter.watchRoom(
              "community_" + (obj.roomKey + "/" + obj.roomId),
              !0,
            );
          } catch (e) {
            throw e;
          }
        }
        return (
          PhysicalSync.useRoom(_room),
          PlayerModel.useRoom(_room),
          window.GameCenterMedia && (await GameCenterMedia.useRoom(_room)),
          Dev.expose("room", _room),
          _this.events.sub(_room, GameCenterRoom.PIN, handlePin),
          _this.events.sub(_room, GameCenterRoom.UNPIN, handleUnpin),
          _this.events.fire(_this.ROOM, { room: _room }),
          _joiningPromise.resolve(),
          _room
        );
      }),
      (this.leave = function (room) {
        _room == room && leave();
      }),
      (this.pin = function (data, timeInSeconds) {
        _room && _room.pin(data, timeInSeconds);
      }),
      (this.unpin = function (data) {
        _room && _room.unpin(data);
      }),
      (this.waitForFocus = function () {
        return (
          _focusPromise || (_focusPromise = Promise.create()),
          _focusPromise
        );
      }),
      this.get("room", (_) => _room));
  }, "static"),
  Class(function Multiplayer2() {
    Inherit(this, Component);
    const _this = this;
    let _room, _focusPromise, _leavingPromise, _joiningPromise;
    async function leave() {
      (await _joiningPromise, (_leavingPromise = Promise.create()));
      let fallback = _this.delayedCall((_) => {
        ((_this.leaving = !1), _leavingPromise.resolve());
      }, 5e3);
      ((_this.leaving = !0),
        PhysicalSync2.useRoom(null),
        _room && _room.leave && (_room = _room.leave()),
        PlayerModel2.useRoom(null),
        window.GameCenterMedia2 && (await GameCenterMedia2.useRoom(null)),
        (_this.leaving = !1),
        _leavingPromise.resolve(),
        clearTimeout(fallback));
    }
    function onVisibility(e) {
      "focus" == e.type
        ? _focusPromise && _focusPromise.resolve()
        : (_focusPromise = null);
    }
    function handlePin(e) {
      _this.events.fire(_this.PIN, e);
    }
    function handleUnpin(e) {
      _this.events.fire(_this.UNPIN, e);
    }
    function gameCenterBlocked() {
      _this.events.fire(_this.UNREACHABLE);
    }
    ((this.ROOM = "multiplayer2_room"),
      (this.PIN = "multiplayer2_pin"),
      (this.UNPIN = "multiplayer2_unpin"),
      (this.UNREACHABLE = "multiplayer2_unreachable"),
      (function addListeners() {
        _this.events.sub(Events.VISIBILITY, onVisibility);
      })(),
      (this.connect = function (server) {
        (GameCenter2.connect(server),
          _this.events.sub(GameCenter2.BLOCKED_ERROR, gameCenterBlocked));
      }),
      (this.establish = async function (obj) {
        (_room && leave(),
          await _leavingPromise,
          await _this.wait(50),
          (_joiningPromise = Promise.create()));
        try {
          if (obj.roomId) {
            let fn = obj.watcher ? GameCenter2.watchRoom : GameCenter2.joinRoom;
            _room = await fn(
              `${obj.community ? "community_" : ""}${obj.roomKey + "/" + obj.roomId}`,
              obj,
            );
          } else
            _room = await GameCenter2.findRoom(
              `${obj.community ? "community_" : ""}${obj.roomKey}`,
              obj,
            );
        } catch (e) {
          if (!obj.roomId || !obj.community) throw e;
          try {
            _room = await GameCenter2.watchRoom(
              "community_" + (obj.roomKey + "/" + obj.roomId),
              !0,
            );
          } catch (e) {
            throw e;
          }
        }
        return (
          PhysicalSync2.useRoom(_room),
          PlayerModel2.useRoom(_room),
          window.GameCenterMedia2 && (await GameCenterMedia2.useRoom(_room)),
          Dev.expose("room", _room),
          _this.events.sub(_room, GameCenterRoom2.PIN, handlePin),
          _this.events.sub(_room, GameCenterRoom2.UNPIN, handleUnpin),
          _this.events.fire(_this.ROOM, { room: _room }),
          _joiningPromise.resolve(),
          _room
        );
      }),
      (this.leave = function (room) {
        _room == room && leave();
      }),
      (this.pin = function (data, timeInSeconds) {
        _room && _room.pin(data, timeInSeconds);
      }),
      (this.unpin = function (data) {
        _room && _room.unpin(data);
      }),
      (this.waitForFocus = function () {
        return (
          _focusPromise || (_focusPromise = Promise.create()),
          _focusPromise
        );
      }),
      this.get("room", (_) => _room));
  }, "static"),
  Class(function MultiplayerConfig(_params) {
    (_params.server &&
      MultiplayerConfig.connectedServer !== _params.server &&
      ((MultiplayerConfig.connectedServer = _params.server),
      Multiplayer.connect(_params.server)),
      this.parent.configure({
        roomKey: _params.roomKey,
        roomId: _params.roomId,
        playerClass: window[_params.playerClass],
        maxInRoom: _params.maxInRoom || 50,
        playerData: _params.data,
        watcher: _params?.data?.watcher || !1,
        alwaysOn: _params?.data?.alwaysOn || !1,
      }));
  }),
  Class(function MultiplayerConfig2(_params) {
    (_params.server &&
      MultiplayerConfig2.connectedServer !== _params.server &&
      ((MultiplayerConfig2.connectedServer = _params.server),
      Multiplayer2.connect(_params.server)),
      this.parent.configure({
        roomKey: _params.roomKey,
        roomId: _params.roomId,
        playerClass: window[_params.playerClass],
        maxInRoom: _params.maxInRoom || 50,
        playerData: _params.data,
        watcher: _params?.data?.watcher || !1,
        alwaysOn: _params?.data?.alwaysOn || !1,
      }));
  }),
  Class(function MultiplayerEnvironment() {
    const _this = this;
    var _config,
      _room,
      _active,
      _synced,
      _players = {},
      _playersState = new StateArray([]);
    function onConnection(e) {
      let player = _this.initClass(
        Player,
        _config.playerClass,
        e.id,
        e.player,
        _config.playerData,
      );
      (_this.onConnection && _this.onConnection(player),
        (_players[e.id] = player),
        getStatePlayerById(e.id) ||
          _playersState.push({ id: e.id, player: player }));
    }
    function getStatePlayerById(id) {
      let returnedPlayer = null;
      return (
        _playersState.forEach((state) => {
          state.get("id") === id && (returnedPlayer = state);
        }),
        returnedPlayer
      );
    }
    async function onDisconnection(e) {
      let statePlayer = getStatePlayerById(e.id);
      (statePlayer && _playersState.remove(statePlayer), delete _players[e.id]);
    }
    async function onError() {
      (await Multiplayer.waitForFocus(),
        _active &&
          ((_room = await Multiplayer.establish(_config)),
          _this.events.sub(_room, GameCenterRoom.ERROR, onError)));
    }
    function onPromoted() {
      _this.player.enable();
    }
    async function onLostConnection(e) {
      (await e.reconnected(), _active && _this.onVisible());
    }
    async function createConnection() {
      if (!_config) return _this.delayedCall((_) => _this.onVisible?.(), 100);
      if (!_this._invisible) {
        if (
          (_this.events.sub(PhysicalSync.CONNECTION, onConnection),
          _this.events.sub(PhysicalSync.DISCONNECTION, onDisconnection),
          _this.events.sub(GameCenter.LOST_CONNECTION, onLostConnection),
          (_active = !0),
          _config.maxInRoom > 0)
        )
          try {
            if (
              !(_room = await Multiplayer.establish(_config)) ||
              !_room.events
            )
              return;
            (_this.events.sub(_room, GameCenterRoom.ERROR, onError),
              _this.events.sub(_room, GameCenterRoom.PROMOTED, onPromoted));
          } catch (e) {
            _this.delayedCall((_) => _this.onVisible(), 100);
          }
        if (!_this.player || null == _this.player.enable) {
          if (!Multiplayer.room) return;
          _this.player = _this.initClass(
            Player,
            _config.playerClass,
            null,
            Multiplayer.room.me,
            _config.playerData,
          );
        }
        _room.watcher && _this.player && _this.player.disable();
      }
    }
    (!(function () {
      if (!_this.events)
        throw "MultiplayerEnvironment must be inherited alongside Object3D, FXScene, or Component";
      _this.startRender((_) => {});
    })(),
      (this.configure = async function (obj) {
        if (Utils.query("mlt") && !Multiplayer.usedMLTConfig)
          try {
            let data = JSON.parse(atob(Utils.query("mlt")));
            (data.roomId && (obj.roomId = data.roomId),
              data.roomKey && (obj.roomKey = data.roomKey),
              (Multiplayer.usedMLTConfig = !0));
          } catch (e) {}
        if (obj) {
          if (
            _config &&
            _config.roomKey == obj.roomKey &&
            _config.roomId == obj.roomId
          )
            return;
          if (!obj.roomKey) throw "configure must define roomKey";
          if (!obj.playerClass) throw "configure must define playerClass";
          if (void 0 === obj.maxInRoom) throw "configure must define maxInRoom";
          (!0 !== obj.p2p && (obj.community = !0), (_config = obj));
        }
        return (
          _config.maxInRoom > 0 &&
            (_active
              ? ((_room = await Multiplayer.establish(_config)).watcher &&
                  _this.player &&
                  _this.player.disable(),
                _this.events.sub(_room, GameCenterRoom.ERROR, onError),
                _this.events.sub(_room, GameCenterRoom.PROMOTED, onPromoted))
              : !1 === _this._invisible &&
                (_this.onVisible(),
                _this.delayedCall((_) => {
                  !1 !== _this._invisible ||
                    Multiplayer.room ||
                    _this.onVisible();
                }, 1e3))),
          _room
        );
      }),
      (this.getShareConfig = async function () {
        return (
          await _this.wait((_) => !!_config),
          { roomId: _config.roomId, roomKey: _config.roomKey }
        );
      }),
      (this.onVisible = async function () {
        (_this.fxVisible && _this.fxVisible(),
          Utils.debounce(createConnection, 100));
      }),
      (this.clearMultiplayer = function () {
        if (!_this._invisible) {
          if ("boolean" != typeof _this._invisible)
            return _this.delayedCall(_this.onVisible, 100);
          (_this.player && (_this.player.visible = !1),
            this.onInvisible(),
            (_config = null));
        }
      }),
      (this.onInvisible = this.onDestroy =
        function () {
          _config?.alwaysOn ||
            (_this.flag("setVisible", !1),
            _this.fxInvisible && _this.fxInvisible(),
            _config &&
              (_this.events.unsub(PhysicalSync.CONNECTION, onConnection),
              _this.events.unsub(PhysicalSync.DISCONNECTION, onDisconnection),
              _this.events.unsub(GameCenter.LOST_CONNECTION, onLostConnection),
              Multiplayer.leave(_room),
              (_room = _active = !1),
              _this.player && _this.player.onDisconnect?.()));
        }),
      (this.onConnection = this.onDisconnection = function () {}),
      (this.synchronizedObjects = function (key) {
        return (
          _synced || (_synced = _this.initClass(SynchronizedObjects, key)),
          _synced
        );
      }),
      (this.getPlayers = function (includeSelf = !1) {
        return includeSelf ? { ..._players, me: _this.player } : _players;
      }),
      (this.hasPlayer = function () {
        return _this.wait("player");
      }),
      (this.playersState = _playersState));
  }),
  Class(function MultiplayerEnvironment2() {
    const _this = this;
    var _config,
      _room,
      _active,
      _synced,
      _players = {},
      _playersState = new StateArray([]);
    function onConnection(e) {
      let player = _this.initClass(
        Player2,
        _config.playerClass,
        e.id,
        e.player,
        _config.playerData,
      );
      (_this.onConnection && _this.onConnection(player),
        (_players[e.id] = player),
        getStatePlayerById(e.id) ||
          _playersState.push({ id: e.id, player: player }));
    }
    function getStatePlayerById(id) {
      let returnedPlayer = null;
      return (
        _playersState.forEach((state) => {
          state.get("id") === id && (returnedPlayer = state);
        }),
        returnedPlayer
      );
    }
    async function onDisconnection(e) {
      let statePlayer = getStatePlayerById(e.id);
      (statePlayer && _playersState.remove(statePlayer), delete _players[e.id]);
    }
    async function onError() {
      (await Multiplayer2.waitForFocus(),
        _active &&
          ((_room = await Multiplayer2.establish(_config)),
          _this.events.sub(_room, GameCenterRoom2.ERROR, onError)));
    }
    function onPromoted() {
      _this.player.enable();
    }
    async function onLostConnection(e) {
      (await e.reconnected(), _active && _this.onVisible());
    }
    async function createConnection() {
      if (!_config) return _this.delayedCall((_) => _this.onVisible?.(), 100);
      if (!_this._invisible) {
        if (
          (_this.events.sub(PhysicalSync2.CONNECTION, onConnection),
          _this.events.sub(PhysicalSync2.DISCONNECTION, onDisconnection),
          _this.events.sub(GameCenter2.LOST_CONNECTION, onLostConnection),
          (_active = !0),
          _config.maxInRoom > 0)
        )
          try {
            if (
              !(_room = await Multiplayer2.establish(_config)) ||
              !_room.events
            )
              return;
            (_this.events.sub(_room, GameCenterRoom2.ERROR, onError),
              _this.events.sub(_room, GameCenterRoom2.PROMOTED, onPromoted));
          } catch (e) {
            _this.delayedCall((_) => _this.onVisible(), 100);
          }
        if (!_this.player || null == _this.player.enable) {
          if (!Multiplayer2.room) return;
          _this.player = _this.initClass(
            Player2,
            _config.playerClass,
            null,
            Multiplayer2.room.me,
            _config.playerData,
          );
        }
        _room.watcher && _this.player && _this.player.disable();
      }
    }
    (!(function () {
      if (!_this.events)
        throw "MultiplayerEnvironment2 must be inherited alongside Object3D, FXScene, or Component";
      _this.startRender((_) => {});
    })(),
      (this.configure = async function (obj) {
        if (Utils.query("mlt") && !Multiplayer2.usedMLTConfig)
          try {
            let data = JSON.parse(atob(Utils.query("mlt")));
            (data.roomId && (obj.roomId = data.roomId),
              data.roomKey && (obj.roomKey = data.roomKey),
              (Multiplayer2.usedMLTConfig = !0));
          } catch (e) {}
        if (obj) {
          if (
            _config &&
            _config.roomKey == obj.roomKey &&
            _config.roomId == obj.roomId
          )
            return;
          if (!obj.roomKey) throw "configure must define roomKey";
          if (!obj.playerClass) throw "configure must define playerClass";
          if (void 0 === obj.maxInRoom) throw "configure must define maxInRoom";
          (!0 !== obj.p2p && (obj.community = !0), (_config = obj));
        }
        return (
          _config.maxInRoom > 0 &&
            (_active
              ? ((_room = await Multiplayer2.establish(_config)).watcher &&
                  _this.player &&
                  _this.player.disable(),
                _this.events.sub(_room, GameCenterRoom2.ERROR, onError),
                _this.events.sub(_room, GameCenterRoom2.PROMOTED, onPromoted))
              : !1 === _this._invisible &&
                (_this.onVisible(),
                _this.delayedCall((_) => {
                  !1 !== _this._invisible ||
                    Multiplayer.room ||
                    _this.onVisible();
                }, 1e3))),
          _room
        );
      }),
      (this.getShareConfig = async function () {
        return (
          await _this.wait((_) => !!_config),
          { roomId: _config.roomId, roomKey: _config.roomKey }
        );
      }),
      (this.onVisible = async function () {
        (_this.fxVisible && _this.fxVisible(),
          Utils.debounce(createConnection, 100));
      }),
      (this.clearMultiplayer = function () {
        if (!_this._invisible) {
          if ("boolean" != typeof _this._invisible)
            return _this.delayedCall(_this.onVisible, 100);
          (_this.player && (_this.player.visible = !1),
            this.onInvisible(),
            (_config = null));
        }
      }),
      (this.onInvisible = this.onDestroy =
        function () {
          _config?.alwaysOn ||
            (_this.flag("setVisible", !1),
            _this.fxInvisible && _this.fxInvisible(),
            _config &&
              (_this.events.unsub(PhysicalSync2.CONNECTION, onConnection),
              _this.events.unsub(PhysicalSync2.DISCONNECTION, onDisconnection),
              _this.events.unsub(GameCenter2.LOST_CONNECTION, onLostConnection),
              Multiplayer2.leave(_room),
              (_room = _active = !1),
              _this.player && _this.player.onDisconnect?.()));
        }),
      (this.onConnection = this.onDisconnection = function () {}),
      (this.synchronizedObjects = function (key) {
        return (
          _synced || (_synced = _this.initClass(SynchronizedObjects2, key)),
          _synced
        );
      }),
      (this.getPlayers = function (includeSelf = !1) {
        return includeSelf ? { ..._players, me: _this.player } : _players;
      }),
      (this.hasPlayer = function () {
        return _this.wait("player");
      }),
      (this.playersState = _playersState));
  }),
  Class(
    function Player(PlayerClass, _id, _player, _playerData = {}) {
      (Inherit(this, Object3D), Inherit(this, PhysicalLink, _id));
      const _this = this;
      var _view,
        _playerId = _player.id;
      function updateState(data) {
        for (let key in data) _this.state.set(key, data[key]);
      }
      ((this.gcPlayer = _player),
        (this.state = AppState.createLocal()),
        (this.data = _player.data),
        _player.data && _player.data.data && (this.data = _player.data.data),
        (function () {
          let playerData = {};
          for (let key in _playerData) playerData[key] = _playerData[key];
          if (
            ((playerData.local = !_id),
            (_this.view = _view = _this.initClass(PlayerClass, playerData)),
            !_view.setUserData)
          )
            throw "Player :: View must inherit PlayerView";
          (_this.bindLink(_this.group, "player"),
            _id
              ? (function initRemote() {
                  let data = _player.data;
                  data.data && (data = data.data);
                  (updateState(data),
                    _view.setUserData(data, _player),
                    _this.events.sub(
                      _player,
                      GameCenterPlayer.UPDATE_DATA,
                      ({ data: data }) => {
                        (data.data && (data = data.data),
                          _view.setUserData(data, _player),
                          updateState(data));
                      },
                    ));
                })()
              : (async function initLocal() {
                  (_view.setUserData(PlayerModel.data),
                    updateState(PlayerModel.data),
                    _this.events.sub(PlayerModel, PlayerModel.UPDATE, (_) => {
                      (_view?.setUserData?.(PlayerModel.data),
                        updateState(PlayerModel.data));
                    }));
                })(),
            _this.events.fire(Player.JOIN, { player: _this }));
        })(),
        (this.onDisconnect = async function () {
          (_this.parent.onDisconnection && _this.parent.onDisconnection(_this),
            await _view?.onDisconnect?.(),
            _this.parent &&
              (_this.events.fire(Player.LEAVE, {
                id: _playerId,
                player: _this,
                playerData: _this.data,
              }),
              tween(
                _this.group.scale,
                { x: 0, y: 0, z: 0 },
                300,
                "easeOutCubic",
              ).onComplete((_) => {
                (_this.parent &&
                  _this.parent.group &&
                  _this.parent.group.remove(_this.group),
                  _this.destroy && _this.destroy());
              })));
        }),
        (this.disable = function () {
          _this.group.visible = !1;
        }),
        (this.enable = function () {
          _this.group.visible = !0;
        }));
    },
    (_) => {
      ((Player.JOIN = "player_join"), (Player.LEAVE = "player_leave"));
    },
  ),
  Class(
    function Player2(PlayerClass, _id, _player, _playerData = {}) {
      (Inherit(this, Object3D), Inherit(this, PhysicalLink2, _id));
      const _this = this;
      var _view,
        _playerId = _player.id;
      function updateState(data) {
        for (let key in data) _this.state.set(key, data[key]);
      }
      ((this.gcPlayer = _player),
        (this.state = AppState.createLocal()),
        (this.data = _player.data),
        _player.data && _player.data.data && (this.data = _player.data.data),
        (function () {
          let playerData = {};
          for (let key in _playerData) playerData[key] = _playerData[key];
          if (
            ((playerData.local = !_id),
            (_this.view = _view = _this.initClass(PlayerClass, playerData)),
            !_view.setUserData)
          )
            throw "Player2 :: View must inherit PlayerView2";
          (_this.bindLink(_this.group, "player"),
            _id
              ? (function initRemote() {
                  let data = _player.data;
                  data.data && (data = data.data);
                  (updateState(data),
                    _view.setUserData(data, _player),
                    _this.events.sub(
                      _player,
                      GameCenterPlayer2.UPDATE_DATA,
                      ({ data: data }) => {
                        (data.data && (data = data.data),
                          _view.setUserData(data, _player),
                          updateState(data));
                      },
                    ));
                })()
              : (async function initLocal() {
                  (_view.setUserData(PlayerModel2.data),
                    updateState(PlayerModel2.data),
                    _this.events.sub(PlayerModel2, PlayerModel2.UPDATE, (_) => {
                      (_view?.setUserData?.(PlayerModel2.data),
                        updateState(PlayerModel2.data));
                    }));
                })(),
            _this.events.fire(Player2.JOIN, { player: _this }));
        })(),
        (this.onDisconnect = async function () {
          (_this.parent.onDisconnection && _this.parent.onDisconnection(_this),
            await _view?.onDisconnect?.(),
            _this.parent &&
              (_this.events.fire(Player2.LEAVE, {
                id: _playerId,
                player: _this,
                playerData: _this.data,
              }),
              tween(
                _this.group.scale,
                { x: 0, y: 0, z: 0 },
                300,
                "easeOutCubic",
              ).onComplete((_) => {
                (_this.parent &&
                  _this.parent.group &&
                  _this.parent.group.remove(_this.group),
                  _this.destroy && _this.destroy());
              })));
        }),
        (this.disable = function () {
          _this.group.visible = !1;
        }),
        (this.enable = function () {
          _this.group.visible = !0;
        }));
    },
    (_) => {
      ((Player2.JOIN = "player2_join"), (Player2.LEAVE = "player2_leave"));
    },
  ),
  Class(function PlayerModel() {
    Inherit(this, Model);
    const _this = this;
    var _room;
    ((this.UPDATE = "player_model_update"),
      (this.state = AppState.createLocal()),
      (this.state._set = this.state.set),
      (this.state.set = this.set),
      (function () {
        ((_this.data = Storage.get("playerModel") || {}),
          (GameCenter.userData = _this.data));
        for (let key in _this.data) _this.state._set(key, _this.data[key]);
        _this.dataReady = !0;
      })(),
      (this.set = function (key, value) {
        _this.data[key] !== value &&
          ((_this.data[key] = value),
          Storage.set("playerModel", _this.data),
          _room && _room.updateUserData(_this.data),
          _this.events.fire(_this.UPDATE),
          _this.state._set(key, value));
      }),
      (this.get = function (key) {
        return _this.data[key];
      }),
      (this.useRoom = function (room) {
        _room = room;
      }));
  }, "static"),
  Class(function PlayerModel2() {
    Inherit(this, Model);
    const _this = this;
    var _room;
    ((this.UPDATE = "player2_model_update"),
      (this.state = AppState.createLocal()),
      (this.state._set = this.state.set),
      (this.state.set = this.set),
      (function () {
        ((_this.data = Storage.get("playerModel") || {}),
          (GameCenter2.userData = _this.data));
        for (let key in _this.data) _this.state._set(key, _this.data[key]);
        _this.dataReady = !0;
      })(),
      (this.set = function (key, value) {
        _this.data[key] !== value &&
          ((_this.data[key] = value),
          Storage.set("playerModel", _this.data),
          _room && _room.updateUserData(_this.data),
          _this.events.fire(_this.UPDATE),
          _this.state._set(key, value));
      }),
      (this.get = function (key) {
        return _this.data[key];
      }),
      (this.useRoom = function (room) {
        _room = room;
      }));
  }, "static"),
  Class(function PlayerView() {
    Inherit(this, Object3D);
    const _this = this;
    ((this.state = this.parent.state),
      (this.bindLink = this.parent.bindLink),
      (this.bindEvent = this.parent.bindEvent),
      (this.bindGlobal = this.parent.bindGlobal),
      (this.bindGlobalEvent = this.parent.bindGlobalEvent),
      (this.fireEvent = this.parent.fireEvent),
      (this.setPlayerData = PlayerModel.set),
      (this.setUserData = function () {}),
      (this.onDisconnect = function () {}),
      (this.getIndex = function () {
        let gcPlayer = _this.parent.gcPlayer;
        return Multiplayer.room.players.indexOf(gcPlayer);
      }));
  }),
  Class(function PlayerView2() {
    Inherit(this, Object3D);
    const _this = this;
    ((this.state = this.parent.state),
      (this.bindLink = this.parent.bindLink),
      (this.bindEvent = this.parent.bindEvent),
      (this.bindGlobal = this.parent.bindGlobal),
      (this.bindGlobalEvent = this.parent.bindGlobalEvent),
      (this.fireEvent = this.parent.fireEvent),
      (this.setPlayerData = PlayerModel2.set),
      (this.setUserData = function () {}),
      (this.onDisconnect = function () {}),
      (this.getIndex = function () {
        let gcPlayer = _this.parent.gcPlayer;
        return Multiplayer2.room.players.indexOf(gcPlayer);
      }));
  }),
  Class(function QRCode(_params = { size: 512, key: "qrkey" }) {
    (Inherit(this, Component), Inherit(this, XComponent));
    const _this = this;
    var _context;
    !(async function () {
      ((_this.canvas = document.createElement("canvas")),
        (_this.canvas.width = _this.canvas.height = _params.size),
        (_context = _this.canvas.getContext("2d")),
        (_this.glui = $gl(
          _params.size,
          _params.size,
          new Texture(_this.canvas),
        )));
      let url = location.href;
      ((url = url.split("#")[0]),
        (url += url.includes("?") ? "&" : "?"),
        (url += `roomqr=${encodeURIComponent(_params.key)}`));
      const items = await _this.get("WorkItems/items"),
        ids = [];
      (items.toJSON().forEach((item) => ids.push(item.index)),
        (url += `&workids=${encodeURIComponent(ids.join(","))}`),
        console.log("url ", url));
      let qrCode = await QRGen.create(url, _params.size);
      ((_context.filter = "invert(1)"), _context.drawImage(qrCode, 0, 0));
    })();
  }),
  Class(function QRGen() {
    Inherit(this, Component);
    const _this = this;
    this.create = async function (url, size, config = {}) {
      (_this.flag("loadLib") ||
        (function loadLib() {
          (_this.flag("loadLib", !0),
            AssetLoader.loadAssets(["assets/js/lib/qrious.js"]));
        })(),
        await AssetLoader.waitForLib("QRious"));
      let canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      new QRious(
        Utils.mergeObject(config, { element: canvas, value: url, size: size }),
      );
      return canvas;
    };
  }, "static"),
  Class(function SynchronizedObjects(_key = "") {
    Inherit(this, Component);
    const _this = this;
    var _data = [],
      _active = [],
      _objects = {},
      _v3 = new Vector3(),
      _q = new Quaternion(),
      _name = _key + Utils.getConstructorName(_this.parent);
    function loop() {
      let stage = _this.parent.player.stage || Stage;
      _data.length = 0;
      for (let i = _active.length - 1; i > -1; i--) {
        let obj = _active[i];
        (obj.position
          ? (obj.position.toArray(obj.syncObj.p),
            obj.quaternion.toArray(obj.syncObj.q))
          : ((obj.syncObj.p[0] = obj.x / stage.width),
            (obj.syncObj.p[1] = obj.y / stage.height)),
          _data.push(obj.syncObj));
      }
      let players = _this.parent.getPlayers();
      for (let key in players) {
        let player = players[key];
        if (player.me) continue;
        let data = player.group.extraData;
        data &&
          data.forEach((d) => {
            let obj = _objects[d.key];
            if (obj) {
              if (obj.syncObj)
                for (let key in d)
                  "p" != key &&
                    "q" != key &&
                    "key" != key &&
                    (obj.syncObj[key] = d[key]);
              2 == d.p.length
                ? ((obj.x = Math.lerp(d.p[0] * stage.width, obj.x, _this.lerp)),
                  (obj.y = Math.lerp(d.p[1] * stage.height, obj.y, _this.lerp)))
                : (_v3.fromArray(d.p),
                  _q.fromArray(d.q),
                  obj.position.lerp(_v3, _this.lerp),
                  obj.quaternion.slerp(_q, _this.lerp));
            }
          });
      }
    }
    function syncStart({ key: key }) {
      let object = _objects[key];
      object &&
        !object.isActive &&
        ((object.isActive = !0), object.onActivate && object.onActivate());
    }
    function syncEnd({ key: key, syncObj: syncObj }) {
      let object = _objects[key];
      object &&
        object.isActive &&
        ((object.isActive = !1),
        object.onDeactivate && object.onDeactivate(syncObj));
    }
    ((this.lerp = 0.3),
      (async function () {
        (await _this.parent.wait("player"),
          _this.parent.player.bindGlobalEvent(_name + "sync_start", syncStart),
          _this.parent.player.bindGlobalEvent(_name + "sync_end", syncEnd),
          (_this.parent.player.group.extraData = _data),
          _this.startRender(loop));
      })(),
      (this.add = function (obj, key) {
        ((obj.syncObj = { p: [], q: [], key: key }),
          (_objects[key] = obj),
          (obj.startSync = (_) => {
            ((obj.syncedKey = key),
              _active.push(obj),
              _this.parent.player.fireEvent(_name + "sync_start", {
                key: key,
              }));
          }),
          (obj.endSync = (_) => {
            (_active.remove(obj),
              _this.parent.player.fireEvent(_name + "sync_end", {
                key: key,
                syncObj: obj.syncObj,
              }));
          }));
      }),
      (this.removeByKey = function (key) {
        void 0 !== _objects[key] &&
          (_active.remove(_objects[key]), delete _objects[key]);
      }));
  }),
  Class(function SynchronizedObjects2(_key = "") {
    Inherit(this, Component);
    const _this = this;
    var _data = [],
      _active = [],
      _objects = {},
      _v3 = new Vector3(),
      _q = new Quaternion(),
      _name = _key + Utils.getConstructorName(_this.parent);
    function loop() {
      let stage = _this.parent.player.stage || Stage;
      _data.length = 0;
      for (let i = _active.length - 1; i > -1; i--) {
        let obj = _active[i];
        (obj.position
          ? (obj.position.toArray(obj.syncObj.p),
            obj.quaternion.toArray(obj.syncObj.q))
          : ((obj.syncObj.p[0] = obj.x / stage.width),
            (obj.syncObj.p[1] = obj.y / stage.height)),
          _data.push(obj.syncObj));
      }
      let players = _this.parent.getPlayers();
      for (let key in players) {
        let player = players[key];
        if (player.me) continue;
        let data = player.group.extraData;
        data &&
          data.forEach((d) => {
            let obj = _objects[d.key];
            if (obj) {
              if (obj.syncObj)
                for (let key in d)
                  "p" != key &&
                    "q" != key &&
                    "key" != key &&
                    (obj.syncObj[key] = d[key]);
              2 == d.p.length
                ? ((obj.x = Math.lerp(d.p[0] * stage.width, obj.x, _this.lerp)),
                  (obj.y = Math.lerp(d.p[1] * stage.height, obj.y, _this.lerp)))
                : (_v3.fromArray(d.p),
                  _q.fromArray(d.q),
                  obj.position.lerp(_v3, _this.lerp),
                  obj.quaternion.slerp(_q, _this.lerp));
            }
          });
      }
    }
    function syncStart({ key: key }) {
      let object = _objects[key];
      object &&
        !object.isActive &&
        ((object.isActive = !0), object.onActivate && object.onActivate());
    }
    function syncEnd({ key: key, syncObj: syncObj }) {
      let object = _objects[key];
      object &&
        object.isActive &&
        ((object.isActive = !1),
        object.onDeactivate && object.onDeactivate(syncObj));
    }
    ((this.lerp = 0.3),
      (async function () {
        (await _this.parent.wait("player"),
          _this.parent.player.bindGlobalEvent(_name + "sync_start", syncStart),
          _this.parent.player.bindGlobalEvent(_name + "sync_end", syncEnd),
          (_this.parent.player.group.extraData = _data),
          _this.startRender(loop));
      })(),
      (this.add = function (obj, key) {
        ((obj.syncObj = { p: [], q: [], key: key }),
          (_objects[key] = obj),
          (obj.startSync = (_) => {
            ((obj.syncedKey = key),
              _active.push(obj),
              _this.parent.player.fireEvent(_name + "sync_start", {
                key: key,
              }));
          }),
          (obj.endSync = (_) => {
            (_active.remove(obj),
              _this.parent.player.fireEvent(_name + "sync_end", {
                key: key,
                syncObj: obj.syncObj,
              }));
          }));
      }),
      (this.removeByKey = function (key) {
        void 0 !== _objects[key] &&
          (_active.remove(_objects[key]), delete _objects[key]);
      }));
  }),
  Class(function ParticleDistributor() {
    Inherit(this, Component);
    const _this = this;
    function init() {
      _this.flag("initGenerate") ||
        (_this.flag("initGenerate", !0),
        Thread.upload(distributeParticles),
        Thread.upload(generatePointCloud),
        Thread.upload(generatePointGrid));
    }
    function distributeParticles(e, id) {
      let {
          position: position,
          count: count,
          normal: normal,
          uv: uv,
          skinIndex: skinIndex,
          skinWeight: skinWeight,
          offset: offset,
          scale: scale,
          orientation: orientation,
        } = e,
        vertices = position.length / 3,
        v3 = new Vector3(),
        v32 = new Vector3(),
        v33 = new Vector3(),
        q = new Quaternion(),
        outputPosition = new Float32Array(3 * count),
        outputNormal = normal ? new Float32Array(3 * count) : null,
        outputUV = uv ? new Float32Array(3 * count) : null,
        outputSkinIndex = skinIndex ? new Float32Array(4 * count) : null,
        outputSkinWeight = skinWeight ? new Float32Array(4 * count) : null;
      for (let i = 0; i < count; i++) {
        let j = 3 * Math.random(0, vertices / 3);
        v3.set(Math.random(0, 100), Math.random(0, 100), Math.random(0, 100));
        let m = 1 / (v3.x + v3.y + v3.z);
        if (
          (v3.set(v3.x * m, v3.y * m, v3.z * m),
          (outputPosition[3 * i + 0] =
            position[3 * j + 0] * v3.x +
            position[3 * j + 3] * v3.y +
            position[3 * j + 6] * v3.z),
          (outputPosition[3 * i + 1] =
            position[3 * j + 1] * v3.x +
            position[3 * j + 4] * v3.y +
            position[3 * j + 7] * v3.z),
          (outputPosition[3 * i + 2] =
            position[3 * j + 2] * v3.x +
            position[3 * j + 5] * v3.y +
            position[3 * j + 8] * v3.z),
          offset)
        ) {
          let randomInstance = Math.random(0, offset.length / 3 - 1);
          (v32.fromArray(outputPosition, 3 * i),
            v33.fromArray(scale, 3 * randomInstance),
            v32.multiplyScalar(v33),
            q.fromArray(orientation, 4 * randomInstance),
            v32.applyQuaternion(q),
            v33.fromArray(offset, 3 * randomInstance),
            v32.add(v33),
            v32.toArray(outputPosition, 3 * i));
        }
        if (
          (outputNormal &&
            ((outputNormal[3 * i + 0] =
              normal[3 * j + 0] * v3.x +
              normal[3 * j + 3] * v3.y +
              normal[3 * j + 6] * v3.z),
            (outputNormal[3 * i + 1] =
              normal[3 * j + 1] * v3.x +
              normal[3 * j + 4] * v3.y +
              normal[3 * j + 7] * v3.z),
            (outputNormal[3 * i + 2] =
              normal[3 * j + 2] * v3.x +
              normal[3 * j + 5] * v3.y +
              normal[3 * j + 8] * v3.z)),
          outputUV &&
            ((outputUV[3 * i + 0] =
              uv[2 * j + 0] * v3.x +
              uv[2 * j + 2] * v3.y +
              uv[2 * j + 4] * v3.z),
            (outputUV[3 * i + 1] =
              uv[2 * j + 1] * v3.x +
              uv[2 * j + 3] * v3.y +
              uv[2 * j + 5] * v3.z)),
          outputSkinIndex)
        ) {
          let skinCluster1 = {};
          ((skinCluster1[skinIndex[4 * j + 0]] = skinWeight[4 * j + 0]),
            (skinCluster1[skinIndex[4 * j + 1]] = skinWeight[4 * j + 1]),
            (skinCluster1[skinIndex[4 * j + 2]] = skinWeight[4 * j + 2]),
            (skinCluster1[skinIndex[4 * j + 3]] = skinWeight[4 * j + 3]));
          let skinCluster2 = {};
          ((skinCluster2[skinIndex[4 * j + 4]] = skinWeight[4 * j + 4]),
            (skinCluster2[skinIndex[4 * j + 5]] = skinWeight[4 * j + 5]),
            (skinCluster2[skinIndex[4 * j + 6]] = skinWeight[4 * j + 6]),
            (skinCluster2[skinIndex[4 * j + 7]] = skinWeight[4 * j + 7]));
          let skinCluster3 = {};
          ((skinCluster3[skinIndex[4 * j + 8]] = skinWeight[4 * j + 8]),
            (skinCluster3[skinIndex[4 * j + 9]] = skinWeight[4 * j + 9]),
            (skinCluster3[skinIndex[4 * j + 10]] = skinWeight[4 * j + 10]),
            (skinCluster3[skinIndex[4 * j + 11]] = skinWeight[4 * j + 11]));
          let indices = [];
          for (let k = 0; k < 12; k++) {
            let index = skinIndex[4 * j + k];
            -1 === indices.indexOf(index) && indices.push(index);
          }
          let clusters = [];
          for (let k = 0; k < indices.length; k++) {
            let index = indices[k];
            clusters.push([
              index,
              (skinCluster1[index] || 0) * v3.x +
                (skinCluster2[index] || 0) * v3.y +
                (skinCluster3[index] || 0) * v3.z,
            ]);
          }
          clusters.sort(function (a, b) {
            return b[1] - a[1];
          });
          for (let l = clusters.length - 1; l < 4; l++) clusters.push([0, 0]);
          let sum =
            clusters[0][1] + clusters[1][1] + clusters[2][1] + clusters[3][1];
          ((outputSkinIndex[4 * i + 0] = clusters[0][0]),
            (outputSkinIndex[4 * i + 1] = clusters[1][0]),
            (outputSkinIndex[4 * i + 2] = clusters[2][0]),
            (outputSkinIndex[4 * i + 3] = clusters[3][0]),
            (outputSkinWeight[4 * i + 0] = clusters[0][1] * (1 / sum)),
            (outputSkinWeight[4 * i + 1] = clusters[1][1] * (1 / sum)),
            (outputSkinWeight[4 * i + 2] = clusters[2][1] * (1 / sum)),
            (outputSkinWeight[4 * i + 3] = clusters[3][1] * (1 / sum)));
        }
      }
      let output = {},
        buffer = [];
      ((output.position = outputPosition),
        buffer.push(outputPosition.buffer),
        outputNormal &&
          ((output.normal = outputNormal), buffer.push(outputNormal.buffer)),
        outputUV && ((output.uv = outputUV), buffer.push(outputUV.buffer)),
        outputSkinIndex &&
          ((output.skinIndex = outputSkinIndex),
          (output.skinWeight = outputSkinWeight),
          buffer.push(outputSkinIndex.buffer),
          buffer.push(outputSkinWeight.buffer)),
        resolve(output, id, buffer));
    }
    function generatePointCloud({ path: path, textureSize: textureSize }, id) {
      !(async function () {
        try {
          let data = await get(path),
            totalParticles = textureSize * textureSize,
            positions = new Float32Array(3 * totalParticles),
            colors = new Float32Array(3 * totalParticles);
          for (let i = 0; i < totalParticles; i++)
            ((positions[3 * i + 0] =
              data.data.attributes.positions.array[3 * i + 0]),
              (positions[3 * i + 1] =
                data.data.attributes.positions.array[3 * i + 1]),
              (positions[3 * i + 2] =
                data.data.attributes.positions.array[3 * i + 2]),
              (colors[3 * i + 0] =
                data.data.attributes.colors.array[3 * i + 0]),
              (colors[3 * i + 1] =
                data.data.attributes.colors.array[3 * i + 1]),
              (colors[3 * i + 2] =
                data.data.attributes.colors.array[3 * i + 2]));
          ((data.positions = positions),
            (data.colors = colors),
            resolve(data, id, [data.positions.buffer, data.colors.buffer]));
        } catch (e) {
          throw (console.log(e), `Could not load Point Cloud for ${path}`);
        }
      })();
    }
    function generatePointGrid(
      { path: path, particleCount: particleCount },
      id,
    ) {
      let split = path.split("generateGrid-")[1].split("-"),
        dir = split[0],
        scale = Number(split[1]),
        textureSize =
          (Number(split[2]), Number(split[split.length - 1].split(".")[0])),
        totalParticles = particleCount,
        positions = new Float32Array(3 * totalParticles),
        colors = new Float32Array(3 * totalParticles);
      for (let i = 0; i < totalParticles; i++) {
        let p0 = i / textureSize,
          y = Math.floor(p0),
          x = p0 - y;
        ((y /= textureSize),
          (x = Math.range(x, 0, 1, -scale / 2, scale / 2)),
          (y = Math.range(y, 0, 1, -scale / 2, scale / 2)),
          "xz" == dir
            ? ((positions[3 * i + 0] = x),
              (positions[3 * i + 1] = 0),
              (positions[3 * i + 2] = y))
            : ((positions[3 * i + 0] = x),
              (positions[3 * i + 1] = y),
              (positions[3 * i + 2] = 0)),
          (colors[3 * i + 0] = 1),
          (colors[3 * i + 1] = 1),
          (colors[3 * i + 2] = 1));
      }
      resolve({ colors: colors, positions: positions }, id, [
        colors.buffer,
        positions.buffer,
      ]);
    }
    ((this.generate = async function (geom, count) {
      init();
      let position = new Float32Array(geom.attributes.position.array);
      return (
        await Thread.shared().distributeParticles(
          { position: position, count: count },
          [position.buffer],
        )
      ).position;
    }),
      (this.generateInstanced = async function (geom, count) {
        init();
        let position = new Float32Array(geom.attributes.position.array),
          offset = new Float32Array(geom.attributes.offset.array),
          scale = new Float32Array(geom.attributes.scale.array),
          orientation = new Float32Array(geom.attributes.orientation.array);
        return (
          await Thread.shared().distributeParticles(
            {
              position: position,
              offset: offset,
              scale: scale,
              orientation: orientation,
              count: count,
            },
            [position.buffer, offset.buffer, scale.buffer, orientation.buffer],
          )
        ).position;
      }),
      (this.generateAll = async function (geom, count) {
        init();
        let position = new Float32Array(geom.attributes.position.array),
          normal = new Float32Array(geom.attributes.normal.array),
          uv = new Float32Array(geom.attributes.uv.array);
        return await Thread.shared().distributeParticles(
          { position: position, normal: normal, uv: uv, count: count },
          [position.buffer, normal.buffer, uv.buffer],
        );
      }),
      (this.generateSkinned = async function (geom, count) {
        init();
        let position = new Float32Array(geom.attributes.position.array),
          normal = new Float32Array(geom.attributes.normal.array),
          uv = new Float32Array(geom.attributes.uv.array),
          skinIndex = new Float32Array(geom.attributes.skinIndex.array),
          skinWeight = new Float32Array(geom.attributes.skinWeight.array);
        return await Thread.shared().distributeParticles(
          {
            position: position,
            normal: normal,
            uv: uv,
            skinIndex: skinIndex,
            skinWeight: skinWeight,
            count: count,
          },
          [
            position.buffer,
            normal.buffer,
            uv.buffer,
            skinIndex.buffer,
            skinWeight.buffer,
          ],
        );
      }),
      (this.generatePointCloud = async function (path, textureSize) {
        (path.includes("assets/geometry") || (path = "assets/geometry/" + path),
          path.includes(".json") || path.includes(".bin") || (path += ".bin"));
        let data,
          isBinary = path.includes(".bin");
        if (((path = Assets.getPath(path)), init(), isBinary))
          (await GeomThread.loadDracoLib(),
            (data = await Thread.shared().loadDraco({
              type: "decode",
              path: Thread.absolutePath(path),
            })));
        else {
          let fn = path.includes("generateGrid")
            ? Thread.shared().generatePointGrid
            : Thread.shared().generatePointCloud;
          data = await fn({
            path: Thread.absolutePath(path),
            textureSize: textureSize,
          });
        }
        return {
          positions: new AntimatterAttribute(data.positions, 3),
          colors: new AntimatterAttribute(data.colors, 3),
        };
      }));
  }, "static"),
  Class(
    function PBRShader(_vertexShader, _fragmentShader, _params) {
      const _this = this;
      function defineSetter(prop) {
        Object.defineProperty(_this, prop, {
          set: function (v) {
            _this.shader[prop] = v;
          },
          get: function () {
            return _this.shader[prop];
          },
        });
      }
      ("object" == typeof _vertexShader &&
        ((_params = _vertexShader), (_vertexShader = _fragmentShader = "PBR")),
        "string" != typeof _fragmentShader &&
          ((_params = _fragmentShader), (_fragmentShader = _vertexShader)),
        _vertexShader || (_vertexShader = _fragmentShader = "PBR"),
        (function initShader() {
          let lookup = Utils3D.getLookupTexture("~assets/images/pbr/lut.png");
          ((lookup.forcePersist = !0),
            (_this.shader = new Shader(
              _vertexShader,
              _fragmentShader,
              Utils.mergeObject(_params || {}, {
                tBaseColor: {
                  value: null,
                  getTexture: Utils3D.getRepeatTexture,
                },
                tMRO: { value: null, getTexture: Utils3D.getRepeatTexture },
                tNormal: { value: null, getTexture: Utils3D.getRepeatTexture },
                tEnvDiffuse: { value: null, premultiplyAlpha: !1 },
                tEnvSpecular: { value: null, premultiplyAlpha: !1 },
                uEnvOffset: { value: new Vector2(0, 0) },
                tLightmap: { value: null, premultiplyAlpha: !1 },
                tLUT: { value: lookup, ignoreUIL: !0 },
                uTint: { value: new Color("#FFFFFF") },
                uTiling: { value: new Vector2(1, 1) },
                uOffset: { value: new Vector2(0, 0) },
                uMRON: { value: new Vector4(1, 1, 1, 1) },
                uEnv: { value: new Vector3(1, 1, 0) },
                uUseLightmap: { value: 0 },
                uHDR: { value: 0, ignoreUIL: !0 },
                uUseTonemapping: { value: 1, ignoreUIL: !0 },
                uUseLinearOutput: { value: 0 },
                uLightmapIntensity: { value: 1 },
                receiveLight: !0,
              }),
            )),
            (_this.shader.parent = _this),
            (_this.lights = _this.shader.lights),
            (_this.uniforms = _this.shader.uniforms),
            [
              "side",
              "blending",
              "polygonOffset",
              "polygonOffsetFactor",
              "polygonOffsetUnits",
              "receiveShadow",
              "vertexShader",
              "fragmentShader",
              "depthTest",
              "depthWrite",
              "wireframe",
              "transparent",
              "visible",
              "persists",
              "material",
              "customShadowShader",
            ].forEach(defineSetter));
        })());
    },
    (_) => {
      const prototype = PBRShader.prototype;
      ((PBRShader.webgl1 = function () {
        return World.RENDERER.type == Renderer.WEBGL1;
      }),
        (prototype.set = function (key, value) {
          return (
            void 0 !== value && (this.shader.uniforms[key].value = value),
            this.shader.uniforms[key].value
          );
        }),
        (prototype.get = function (key) {
          return this.shader.uniforms[key].value;
        }),
        (prototype.tween = function (
          key,
          value,
          time,
          ease,
          delay,
          callback,
          update,
        ) {
          return tween(
            this.shader.uniforms[key],
            { value: value },
            time,
            ease,
            delay,
            callback,
            update,
          );
        }),
        (prototype.setPBR = prototype.setOverride =
          function (key, value, ref = this) {
            switch (
              (ref.parent instanceof PBRShader && (ref = ref.parent),
              ref.set(key, value),
              key)
            ) {
              case "tEnvDiffuse":
              case "tEnvSpecular":
              case "tLUT":
                ((value.generateMipmaps = !1),
                  (value.minFilter = Texture.LINEAR));
            }
            let src = value.src;
            src &&
              src.toLowerCase().includes("rgbm") &&
              (ref.shader.set("uHDR", 1),
              ref.shader.set("uEnv", new Vector3(1, 1, 0)));
          }),
        (prototype.destroy = function () {
          this.shader.destroy();
        }),
        (prototype.copyUniformsTo = function (shader, linked, ignore) {
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
        }));
    },
  ),
  Class(function Performance() {
    Inherit(this, Component);
    const _this = this;
    var _overrides = Storage.get("performance_override") || {};
    const PLATFORM_ALLOWED_KEYS = [
        "desktopVRAvailable",
        "enableWorldNukeMSAA",
        "msaaSamples",
        "forceWebGL1",
        "blurFX",
      ],
      IGNORED_FUNCTIONS = (() => {
        let obj = { __afterInitClass: [] };
        return (
          Inherit(obj, Component),
          "function" == typeof XComponent && Inherit(obj, XComponent),
          obj.__afterInitClass.forEach((cb) => cb()),
          Object.values(obj)
            .filter((val) => "function" == typeof val)
            .map((fn) => fn.toString())
        );
      })();
    function save(obj, key, value) {
      ((_overrides[key] = { obj: Utils.getConstructorName(obj), value: value }),
        Storage.set("performance_override", _overrides));
    }
    function convert(tier) {
      if (GPU.BLOCKLIST) return "F";
      switch (tier) {
        case 5:
          return "A++";
        case 4:
          return "A+";
        case 3:
          return "A";
        case 2:
          return "B";
        case 1:
          return "C";
        case 0:
          return "D";
      }
    }
    (!(async function () {
      if (
        (Utils.query("performance") && Utils.query("edit")) ||
        Utils.query("custom")
      ) {
        await Hydra.ready();
        for (let key in _overrides) {
          let obj,
            value,
            override = _overrides[key];
          (override?.obj
            ? ({ obj: obj, value: value } = override)
            : ((obj = "Tests"), (value = override)),
            window[obj] && (window[obj][key] = (_) => value));
        }
      }
    })(),
      (this.displayResults = async function () {
        let editing = Utils.query("edit");
        (await GPU.ready(),
          $(document.documentElement).bg("#000"),
          __body.bg("#000"),
          Stage.bg("#000"),
          Stage.hide());
        let $results = __body.create("PerformanceResults");
        (__body.css({ overflowY: "scroll", background: "#000" }),
          $results
            .fontStyle("Arial", 16, "#fff")
            .css({ marginLeft: 50, marginRight: 50, "user-select": "auto" }),
          Mobile.allowNativeScroll(),
          HydraCSS.style(".PerformanceResults *", {
            position: "relative",
            "user-select": "auto",
          }));
        Tests.constructor.toString();
        let tests = "",
          keys = [],
          addTest = (obj, key) => {
            let result,
              val = obj[key];
            if (
              "function" == typeof val &&
              !IGNORED_FUNCTIONS.includes(val.toString())
            ) {
              try {
                result = obj[key]();
              } catch (e) {
                return;
              }
              ((tests += `<p><b>${key}:</b> `),
                (tests += editing
                  ? "number" == typeof result
                    ? `<input class="${key}" value="${result.toString()}" /></p>`
                    : "boolean" == typeof result
                      ? `<input class="${key}" type="checkbox" ${result ? "checked" : ""}/></p>`
                      : `<input class="${key}" value="${result}" type="text"></p>`
                  : result + "</p>"),
                keys.push({ obj: obj, key: key }));
            }
          };
        for (let key in Tests) addTest(Tests, key);
        if (window.Platform)
          for (let key in Platform)
            (key.startsWith("use") ||
              key.startsWith("using") ||
              PLATFORM_ALLOWED_KEYS.includes(key)) &&
              addTest(Platform, key);
        let compressionExtensions = [
            "compressed_texture",
            "texture_compression",
          ],
          enabledExtensions = Device.graphics.webgl?.extensions || [],
          otherExtensions = enabledExtensions
            .filter(
              (ext) => !compressionExtensions.find((n) => ext.includes(n)),
            )
            .join(", "),
          dedupe = {};
        compressionExtensions = enabledExtensions
          .map((ext) =>
            compressionExtensions
              .map((name) => {
                let index = ext.indexOf(name);
                if (!(index < 0))
                  return (
                    (index += name.length),
                    "_" === ext.charAt(index) && (index += 1),
                    ext.substring(index)
                  );
              })
              .find(Boolean),
          )
          .filter((ext) => !(!ext || dedupe[ext]) && (dedupe[ext] = !0))
          .join(", ");
        let html = `<h1>Performance Results</h1>\n                    <button id="copy">Copy to clipboard</button>\n                    <p><b>Time:</b> ${new Date()}</p>\n                    <p><b>GPU:</b> ${Device.graphics.webgl ? Device.graphics.webgl.gpu : "WEBGL UNAVAILABLE"}</p>\n                    <p><b>WebGL Version:</b> ${Device.graphics.webgl ? Device.graphics.webgl.version : "WEBGL UNAVAILABLE"}</p>\n                    ${
          "ios" == Device.system.os
            ? (function getiOSGPUStats() {
                return `<p><b>iOS GPU UNMASK:</b>${Global.iOSGPUHASHVAL || "X"} | ${Global.iOSGPUFALLBACKTEST || "X"} | ${Global.iOSGPUHASH3D || "X"}</p>`;
              })()
            : ""
        }\n                    ${"safari" == Device.system.browser ? "<b>SAFARI GPU UNMASK:</b> " + Global.MACOSHASHVALUE : ""}\n                    <p><b>GPU Tier:</b> ${Device.mobile ? convert(GPU.M_TIER) : convert(GPU.TIER)} [${Device.mobile ? GPU.M_TIER : GPU.TIER}]</p>\n                    <p><b>Mobile:</b> ${Device.mobile ? Object.keys(Device.mobile).filter((key) => Device.mobile[key]) : "false"} </p>\n                    <p><b>User Agent:</b> ${Device.agent}</p>\n                    <p><b>OS:</b> ${Device.system.os}</p>${-1 !== Device.system.version ? `\n                    <p><b>OS Version:</b> ${Device.system.version}` : ""}\n                    <p><b>DPR:</b> ${Device.pixelRatio}</p>\n                    <p><b>Screen Size:</b> ${screen.width} x ${screen.height}</p>\n                    <p><b>HZ Multiplier:</b> ${Render.HZ_MULTIPLIER}</p>\n                    <p><b>Stage Size:</b> ${Stage.width} x ${Stage.height}</p>\n                    <p><b>Browser:</b> ${Device.system.browser}</p>\n                    <p><b>Browser Version:</b> ${Device.system.browserVersion}</p>\n                    <p><b>Compressed textures:</b> ${compressionExtensions}</p>\n                    <p><b>WebGL extensions:</b> ${otherExtensions}</p>\n                    <p><b>Media Devices w/ Permissions Granted:</b>${await navigator?.mediaDevices?.enumerateDevices?.().then((devices) => devices?.filter?.((device) => "" !== device.label)?.map((device) => ` ${device.label}`))}</p>\n                    \n                    <h2>Project-Specific Tests</h2>\n                    ${editing ? '<button class="resetBtn">Reset All</button>' : ""}\n                    ${tests}\n        `;
        $results.html(html);
        let copy = $(document.getElementById("copy"));
        if (
          (copy.bind("click", (_) => {
            let text = `${$results.div.innerText.split("\n").slice(2).join("\n").trim()}`;
            (Utils.copyToClipboard(text),
              copy.text("Results copied!"),
              clearTimeout(_this.copyTimer),
              (_this.copyTimer = _this.delayedCall((_) => {
                copy.text("Copy to clipboard");
              }, 3e3)));
          }),
          editing)
        ) {
          (await defer(),
            (document.querySelector(".resetBtn").onclick = (_) => {
              (Storage.set("performance_override", null), location.reload());
            }));
          for (let { obj: obj, key: key } of keys) {
            let div = document.querySelector(`.${key}`);
            div &&
              (div.onchange = (_) => {
                let value = div.value;
                ((value = isNaN(value) ? div.checked : Number(value)),
                  save(obj, key, value));
              });
          }
        }
      }));
  }, "static"),
  Class(function PhysicalLink(_id) {
    const _this = this;
    var _events = {},
      _globalEvents = {},
      _globalLinks = [];
    ((this.initLink = function (id) {
      ((_id = id), PhysicalSync.createInstanceLink(_this, id));
    }),
      (this.bindLink = function (obj, id) {
        if (obj instanceof GLUIObject) {
          let gluiObject = obj;
          ((obj = new Group()),
            _this.startRender((_) => {
              let stage = _this.stage || Stage;
              _id
                ? ((gluiObject.x = obj.position.x * stage.width),
                  (gluiObject.y = obj.position.y * stage.height))
                : ((obj.position.x = gluiObject.x / stage.width),
                  (obj.position.y = gluiObject.y / stage.height));
            }));
        }
        _id
          ? PhysicalSync.createRemoteLink(obj, _id, id)
          : PhysicalSync.createLocalLink(obj, id);
      }),
      (this.bindEvent = function (name, callback) {
        ((_events[name] = callback),
          PhysicalSync.createRemoteEvent(name, _id, callback));
      }),
      (this.bindGlobal = function (obj, id) {
        (PhysicalSync.createGlobalLink(obj, id), _globalLinks.push(id));
      }),
      (this.bindGlobalEvent = function (name, callback) {
        (PhysicalSync.createGlobalEvent(name, callback),
          (_globalEvents[name] = callback));
      }),
      (this.fireEvent = function (name, data = {}) {
        (PhysicalSync.fireLocalEvent(name, data),
          _events[name] && _events[name](data),
          _globalEvents[name] && _globalEvents[name](data));
      }),
      (this.destroyLink = function () {
        (PhysicalSync.deleteInstanceLink(_id),
          _globalLinks.forEach((id) => PhysicalSync.deleteGlobalLink(id)));
        for (let key in _globalEvents) PhysicalSync.deleteGlobalEvent(key);
      }),
      defer((_) => {
        _this &&
          _this._bindOnDestroy &&
          _this._bindOnDestroy((_) => {
            _this.destroyLink();
          });
      }),
      _id && _this.initLink(_id));
  }),
  Class(function PhysicalLink2(_id) {
    const _this = this;
    var _events = {},
      _globalEvents = {},
      _globalLinks = [];
    ((this.initLink = function (id) {
      ((_id = id), PhysicalSync2.createInstanceLink(_this, id));
    }),
      (this.bindLink = function (obj, id) {
        if (obj instanceof GLUIObject) {
          let gluiObject = obj;
          ((obj = new Group()),
            _this.startRender((_) => {
              let stage = _this.stage || Stage;
              _id
                ? ((gluiObject.x = obj.position.x * stage.width),
                  (gluiObject.y = obj.position.y * stage.height))
                : ((obj.position.x = gluiObject.x / stage.width),
                  (obj.position.y = gluiObject.y / stage.height));
            }));
        }
        _id
          ? PhysicalSync2.createRemoteLink(obj, _id, id)
          : PhysicalSync2.createLocalLink(obj, id);
      }),
      (this.bindEvent = function (name, callback) {
        ((_events[name] = callback),
          PhysicalSync2.createRemoteEvent(name, _id, callback));
      }),
      (this.bindGlobal = function (obj, id) {
        (PhysicalSync2.createGlobalLink(obj, id), _globalLinks.push(id));
      }),
      (this.bindGlobalEvent = function (name, callback) {
        (PhysicalSync2.createGlobalEvent(name, callback),
          (_globalEvents[name] = callback));
      }),
      (this.fireEvent = function (name, data = {}) {
        (PhysicalSync2.fireLocalEvent(name, data),
          _events[name] && _events[name](data),
          _globalEvents[name] && _globalEvents[name](data));
      }),
      (this.destroyLink = function () {
        (PhysicalSync2.deleteInstanceLink(_id),
          _globalLinks.forEach((id) => PhysicalSync2.deleteGlobalLink(id)));
        for (let key in _globalEvents) PhysicalSync2.deleteGlobalEvent(key);
      }),
      defer((_) => {
        _this &&
          _this._bindOnDestroy &&
          _this._bindOnDestroy((_) => {
            _this.destroyLink();
          });
      }),
      _id && _this.initLink(_id));
  }),
  Class(function PhysicalSync() {
    Inherit(this, Component);
    const _this = this;
    var _room,
      _playerQueue,
      _visibilityTimer,
      _matrix = new Matrix4(),
      _instances = {},
      _instanceBackup = {},
      _objects = {},
      _global = {},
      _globalEvents = {},
      _eventMap = {},
      _events = [],
      _transmit = {},
      _globalTransmit = {},
      _handledEvents = {},
      _receivedGlobals = [],
      _evt = { pS: "d", events: [] },
      _transmitTime = Render.TIME;
    ((this.CONNECTION = "physical_sync_connection"),
      (this.DISCONNECTION = "physical_sync_disconnection"),
      (this.ROOM_TIMEOUT = "physical_sync_room_timeout"),
      (this.baseLerp = 0.15),
      (this.transmitFPS = 30),
      (this.compensateLag = !0),
      (this.throttle = !1));
    const ZERO_POS = new Vector3(0, 0, 0),
      ZERO_QUAT = new Quaternion(0, 0, 0, 1);
    function startSync() {
      _room.host &&
        _room.broadcast({
          pS: "perform_sync",
          pos: World.CAMERA.position.toArray(),
          quaternion: World.CAMERA.quaternion.toArray(),
        });
    }
    function optimize(obj) {
      for (let i = 0; i < 3; i++) obj.p[i] = Number(obj.p[i].toFixed(3));
      if (obj.q)
        for (let i = 0; i < 4; i++) obj.q[i] = Number(obj.q[i].toFixed(3));
    }
    function shouldHandle(event) {
      return (
        !_handledEvents[event.id] &&
        ((_handledEvents[event.id] = !0),
        _this.delayedCall((_) => {
          delete _handledEvents[event.id];
        }, 1e3),
        !0)
      );
    }
    function isZero(obj) {
      return obj.position.equals(ZERO_POS) && obj.quaternion.equals(ZERO_QUAT);
    }
    function transmit() {
      if (
        !(
          _this.throttle &&
          !_this.flag("blurred") &&
          Render.TIME - _transmitTime < 1e3
        ) &&
        _objects.local &&
        _room
      ) {
        _transmitTime = Render.TIME;
        for (let key in _objects.local) {
          let obj = _objects.local[key];
          obj.preventSync || (!obj.eD && isZero(obj))
            ? _transmit[key] && delete _transmit[key]
            : (_transmit[key] ||
                ((_transmit[key] = { p: [] }),
                obj.noPSQuaternion || (_transmit[key].q = [])),
              obj.position.toArray(_transmit[key].p),
              obj.noPSQuaternion || obj.quaternion.toArray(_transmit[key].q),
              optimize(_transmit[key]),
              obj.eD && (_transmit[key].eD = obj.eD));
        }
        for (let key in _global) {
          let obj = _global[key];
          obj.broadcastSync || obj.forceBroadcastSync
            ? (_globalTransmit[key] ||
                (_globalTransmit[key] = {
                  p: [],
                  q: [],
                  f: obj.forceBroadcastSync,
                }),
              obj.position.toArray(_globalTransmit[key].p),
              obj.quaternion.toArray(_globalTransmit[key].q),
              optimize(_globalTransmit[key]))
            : _globalTransmit[key] && delete _globalTransmit[key];
        }
        _evt.events.length = 0;
        for (let i = 0; i < _events.length; i++) {
          let event = _events[i];
          Render.TIME - event.time < 250
            ? _evt.events.push(event.evt)
            : _events.splice(i, 1);
        }
        ((_evt.objects = _transmit),
          (_evt.global = _globalTransmit),
          _room &&
            _room.broadcast &&
            (_evt.events.length ||
              Object.keys(_evt.global).length ||
              Object.keys(_evt.objects).length) &&
            _room.broadcast(_evt));
      }
    }
    function loop() {
      for (let player in _objects) {
        if ("local" == player) continue;
        let playerObj = _objects[player];
        for (let key in playerObj) {
          let obj = playerObj[key],
            lerp = _this.baseLerp * obj.lerpMult;
          obj.positionTarget &&
            !obj.preventSync &&
            (obj.position.lerp(obj.positionTarget, lerp),
            obj.quaternion.slerp(obj.quaternionTarget, lerp));
        }
      }
      if (_receivedGlobals.length) {
        for (let i = 0; i < _receivedGlobals.length; i++) {
          let key = _receivedGlobals[i],
            obj = _global[key];
          if (obj.positionTarget && !obj.preventSync) {
            let lerp = obj.forced ? 1 : _this.baseLerp * obj.lerpMult;
            (obj.position.lerp(obj.positionTarget, lerp),
              obj.quaternion.slerp(obj.quaternionTarget, lerp));
          }
        }
        _receivedGlobals.length = 0;
      }
      if (_playerQueue.length) {
        for (let i = 0; i < 10; i++) {
          let obj = _playerQueue.shift();
          obj && _this.events.fire(_this.CONNECTION, obj);
        }
      }
    }
    function handleEvent({ evtData: evtData, evtName: evtName, from: from }) {
      let callbacks = _eventMap[from];
      if (callbacks) {
        let callback = callbacks[evtName];
        callback && callback(evtData);
      }
      let callback = _globalEvents[evtName];
      callback && callback(evtData);
    }
    function playerJoin(e) {
      if (
        (_room.isCommunity
          ? _playerQueue.push({
              id: e.player.id,
              userData: e.player.data,
              player: e.player,
            })
          : _this.events.fire(_this.CONNECTION, {
              id: e.player.id,
              userData: e.player.data,
              player: e.player,
            }),
        _room.host && !_room.isCommunity)
      ) {
        for (let key in _global) _global[key].forceBroadcastSync = e.player.id;
        _this.delayedCall((_) => {
          for (let key in _global) _global[key].forceBroadcastSync = !1;
        }, 500);
      }
    }
    function playerDisconnect(e) {
      let obj = _instances[e.player.id] || _instanceBackup[e.player.id];
      (obj &&
        (_this.events.fire(_this.DISCONNECTION, {
          id: e.player.id,
          userData: e.player.data,
        }),
        obj.onDisconnect ? obj.onDisconnect() : obj.destroy && obj.destroy()),
        delete _instances[e.player.id],
        delete _instanceBackup[e.player.id],
        delete _eventMap[e.player.id]);
      for (let i = 0; i < _playerQueue.length; i++)
        _playerQueue[i].player == e.player &&
          (_playerQueue.splice(i, 1), (i -= 1));
    }
    function roomError() {
      (_this.events.fire(_this.ROOM_TIMEOUT),
        _room &&
          _room.players &&
          _room.players.forEach((player) => {
            playerDisconnect({ player: player });
          }));
    }
    function data({ data: data, player: player }) {
      if (data.pS)
        switch (data.pS) {
          case "start_sync":
            startSync();
            break;
          case "perform_sync":
            !(function performSync({ pos: pos, quaternion: quaternion }) {
              let remotePos = new Vector3().fromArray(pos),
                cameraQuat = World.CAMERA.quaternion,
                cameraPos = World.CAMERA.position,
                localQuaternion = World.SCENE.quaternion,
                localScene = World.SCENE.position,
                orientedRemotePos =
                  (new Quaternion().fromArray(quaternion),
                  new Vector3().copy(remotePos).applyQuaternion(cameraQuat)),
                localOrigin = new Vector3().copy(cameraPos),
                remoteOrigin = new Vector3()
                  .copy(orientedRemotePos)
                  .multiplyScalar(-1);
              (localScene.copy(localOrigin).add(remoteOrigin),
                localQuaternion.copy(cameraQuat));
            })(data);
            break;
          case "d":
            !(function transmitData(
              { objects: objects, from: from, global: global, events: events },
              player,
            ) {
              let lerpMultiplier = _this.compensateLag
                ? Math.range(player.ping, 50, 200, 1, 0.25, !0)
                : 1;
              for (let key in global) {
                let obj = _global[key];
                obj &&
                  ((obj.lerpMult = lerpMultiplier),
                  obj.positionTarget ||
                    ((obj.positionTarget = new Vector3()),
                    (obj.quaternionTarget = new Quaternion())),
                  global[key].p &&
                    (_receivedGlobals.push(key),
                    global[key].f == GameCenter.GCID &&
                      (obj.physics &&
                        (void 0 === obj.physics.stashKinematic &&
                          ((obj.physics.stashKinematic = obj.physics.kinematic),
                          (obj.physics.kinematic = !0)),
                        clearTimeout(obj.physics.timer),
                        (obj.physics.timer = _this.delayedCall((_) => {
                          obj.physics.kinematic = obj.physics.stashKinematic;
                        }, 100))),
                      (obj.forced = !0)),
                    obj.positionTarget.fromArray(global[key].p),
                    global[key].q &&
                      obj.quaternionTarget.fromArray(global[key].q)));
              }
              if (_objects[from])
                for (let key in objects) {
                  let obj = _objects[from][key];
                  obj &&
                    ((obj.lerpMult = lerpMultiplier),
                    obj.positionTarget ||
                      ((obj.positionTarget = new Vector3()),
                      (obj.quaternionTarget = new Quaternion())),
                    objects[key].p &&
                      (obj.positionTarget.fromArray(objects[key].p),
                      objects[key].q &&
                        obj.quaternionTarget.fromArray(objects[key].q)),
                    objects[key].eD && (obj.eD = objects[key].eD));
                }
              if (events)
                for (let i = events.length - 1; i > -1; i--) {
                  let event = events[i];
                  shouldHandle(event) &&
                    ((event.from = from), handleEvent(event));
                }
            })(data, player);
            break;
          case "event":
            handleEvent(data);
        }
    }
    function handleVisibility(e) {
      "blur" == e.type
        ? (_this.flag("blurred", !0),
          (_visibilityTimer = setInterval(transmit, 250)))
        : (_this.flag("blurred", !1), clearInterval(_visibilityTimer));
    }
    (_this.events.sub(GameCenter.LOST_CONNECTION, (_) => _this.useRoom(null)),
      _this.events.sub(Events.VISIBILITY, handleVisibility),
      (this.connect = async function (server) {
        ((GameCenter.ports = this.ports || 1),
          (GameCenter.userData = this.userData || {}),
          GameCenter.connect(server));
        try {
          ((_room = await GameCenter.findRoom()),
            _this.events.sub(_room, GameCenterRoom.PLAYER_JOIN, playerJoin),
            _this.events.sub(
              _room,
              GameCenterRoom.PLAYER_DISCONNECT,
              playerDisconnect,
            ),
            _this.events.sub(_room, GameCenter.DATA, data));
        } catch (e) {
          console.error(e);
        }
        _room.players.forEach((player) => {
          player.me ||
            _this.events.fire(_this.CONNECTION, {
              id: player.id,
              userData: player.data,
              player: player,
            });
        });
      }),
      (this.useRoom = function (room) {
        if (
          (null == room &&
            _room &&
            (_room.players &&
              _room.players.forEach((player) => {
                player.me || playerDisconnect({ player: player });
              }),
            _this.events.unsub(_room, GameCenterRoom.PLAYER_JOIN, playerJoin),
            _this.events.unsub(
              _room,
              GameCenterRoom.PLAYER_DISCONNECT,
              playerDisconnect,
            ),
            _this.events.unsub(_room, GameCenterRoom.ERROR, roomError),
            _this.events.unsub(_room, GameCenter.DATA, data)),
          (_room = room),
          (_playerQueue = []),
          _this.startRender(loop),
          _room)
        ) {
          try {
            (_this.events.sub(_room, GameCenterRoom.PLAYER_JOIN, playerJoin),
              _this.events.sub(
                _room,
                GameCenterRoom.PLAYER_DISCONNECT,
                playerDisconnect,
              ),
              _this.events.sub(_room, GameCenterRoom.ERROR, roomError),
              _this.events.sub(_room, GameCenter.DATA, data));
          } catch (e) {
            console.error(e);
          }
          _room.players.forEach((player) => {
            player.me ||
              (_room.isCommunity
                ? _playerQueue.push({
                    id: player.id,
                    userData: player.data,
                    player: player,
                  })
                : _this.events.fire(_this.CONNECTION, {
                    id: player.id,
                    userData: player.data,
                    player: player,
                  }));
          });
        }
      }),
      (this.sync = function () {
        _room.host ? startSync() : _room.broadcast({ pS: "start_sync" });
      }),
      (this.createInstanceLink = function (obj, id) {
        ((_instances[id] = obj), (_instanceBackup[id] = obj));
      }),
      (this.deleteInstanceLink = function (id) {
        id &&
          (delete _instances[id], delete _objects[id], delete _eventMap[id]);
      }),
      (this.createLocalLink = function (obj, id) {
        (_objects.local || (_objects.local = {}),
          (_objects.local[id] = obj),
          _this.startRender(transmit, _this.transmitFPS));
      }),
      (this.deleteLocalLink = function (id) {
        delete _objects.local[id];
      }),
      (this.createRemoteEvent = function (name, id, callback) {
        (_eventMap[id] || (_eventMap[id] = {}),
          (_eventMap[id][name] = callback));
      }),
      (this.createGlobalEvent = function (id, callback) {
        _globalEvents[id] = callback;
      }),
      (this.deleteGlobalEvent = function (id) {
        delete _globalEvents[id];
      }),
      (this.fireLocalEvent = function (name, data = {}) {
        _events.push({
          evt: { evtData: data, evtName: name, id: Utils.uuid() },
          time: Render.TIME,
        });
      }),
      (this.createGlobalLink = function (obj, id) {
        _global[id] = obj;
      }),
      (this.deleteGlobalLink = function (id) {
        delete _global[id];
      }),
      (this.createRemoteLink = function (obj, playerId, id) {
        (_objects[playerId] || (_objects[playerId] = {}),
          (_objects[playerId][id] = obj),
          _this.startRender(loop));
      }),
      (this.alignLocally = function (yOffset = 0) {
        (World.SCENE.quaternion.copy(World.CAMERA.quaternion),
          (World.SCENE.rotation.z = 0),
          (World.SCENE.rotation.x = 0),
          World.SCENE.position.copy(World.CAMERA.position),
          (World.SCENE.position.y += yOffset),
          World.SCENE.updateMatrixWorld(!0),
          _matrix.getInverse(World.SCENE.matrix),
          _this.flag("aligned", !0));
      }),
      (this.realignObject = function (obj) {
        _this.flag("aligned") && obj.applyMatrix(_matrix);
      }));
  }, "static"),
  Class(function PhysicalSync2() {
    Inherit(this, Component);
    const _this = this;
    var _room,
      _playerQueue,
      _visibilityTimer,
      _matrix = new Matrix4(),
      _instances = {},
      _instanceBackup = {},
      _objects = {},
      _global = {},
      _globalEvents = {},
      _eventMap = {},
      _events = [],
      _transmit = {},
      _globalTransmit = {},
      _handledEvents = {},
      _receivedGlobals = [],
      _evt = { pS: "d", events: [] },
      _transmitTime = Render.TIME;
    ((this.CONNECTION = "physical_sync2_connection"),
      (this.DISCONNECTION = "physical_sync2_disconnection"),
      (this.ROOM_TIMEOUT = "physical_sync2_room_timeout"),
      (this.baseLerp = 0.15),
      (this.transmitFPS = 30),
      (this.compensateLag = !0),
      (this.throttle = !1));
    const ZERO_POS = new Vector3(0, 0, 0),
      ZERO_QUAT = new Quaternion(0, 0, 0, 1);
    function startSync() {
      _room.host &&
        _room.broadcast({
          pS: "perform_sync",
          pos: World.CAMERA.position.toArray(),
          quaternion: World.CAMERA.quaternion.toArray(),
        });
    }
    function optimize(obj) {
      for (let i = 0; i < 3; i++) obj.p[i] = Number(obj.p[i].toFixed(3));
      if (obj.q)
        for (let i = 0; i < 4; i++) obj.q[i] = Number(obj.q[i].toFixed(3));
    }
    function shouldHandle(event) {
      return (
        !_handledEvents[event.id] &&
        ((_handledEvents[event.id] = !0),
        _this.delayedCall((_) => {
          delete _handledEvents[event.id];
        }, 1e3),
        !0)
      );
    }
    function isZero(obj) {
      return obj.position.equals(ZERO_POS) && obj.quaternion.equals(ZERO_QUAT);
    }
    function transmit() {
      if (
        !(
          _this.throttle &&
          !_this.flag("blurred") &&
          Render.TIME - _transmitTime < 1e3
        ) &&
        _objects.local &&
        _room
      ) {
        _transmitTime = Render.TIME;
        for (let key in _objects.local) {
          let obj = _objects.local[key];
          obj.preventSync || (!obj.eD && isZero(obj))
            ? _transmit[key] && delete _transmit[key]
            : (_transmit[key] ||
                ((_transmit[key] = { p: [] }),
                obj.noPSQuaternion || (_transmit[key].q = [])),
              obj.position.toArray(_transmit[key].p),
              obj.noPSQuaternion || obj.quaternion.toArray(_transmit[key].q),
              optimize(_transmit[key]),
              obj.eD && (_transmit[key].eD = obj.eD));
        }
        for (let key in _global) {
          let obj = _global[key];
          obj.broadcastSync || obj.forceBroadcastSync
            ? (_globalTransmit[key] ||
                (_globalTransmit[key] = {
                  p: [],
                  q: [],
                  f: obj.forceBroadcastSync,
                }),
              obj.position.toArray(_globalTransmit[key].p),
              obj.quaternion.toArray(_globalTransmit[key].q),
              optimize(_globalTransmit[key]))
            : _globalTransmit[key] && delete _globalTransmit[key];
        }
        _evt.events.length = 0;
        for (let i = 0; i < _events.length; i++) {
          let event = _events[i];
          Render.TIME - event.time < 250
            ? _evt.events.push(event.evt)
            : _events.splice(i, 1);
        }
        ((_evt.objects = _transmit),
          (_evt.global = _globalTransmit),
          _room &&
            _room.broadcast &&
            (_evt.events.length ||
              Object.keys(_evt.global).length ||
              Object.keys(_evt.objects).length) &&
            _room.broadcast(_evt));
      }
    }
    function loop() {
      for (let player in _objects) {
        if ("local" == player) continue;
        let playerObj = _objects[player];
        for (let key in playerObj) {
          let obj = playerObj[key],
            lerp = _this.baseLerp * obj.lerpMult;
          obj.positionTarget &&
            !obj.preventSync &&
            (obj.position.lerp(obj.positionTarget, lerp),
            obj.quaternion.slerp(obj.quaternionTarget, lerp));
        }
      }
      if (_receivedGlobals.length) {
        for (let i = 0; i < _receivedGlobals.length; i++) {
          let key = _receivedGlobals[i],
            obj = _global[key];
          if (obj.positionTarget && !obj.preventSync) {
            let lerp = obj.forced ? 1 : _this.baseLerp * obj.lerpMult;
            (obj.position.lerp(obj.positionTarget, lerp),
              obj.quaternion.slerp(obj.quaternionTarget, lerp));
          }
        }
        _receivedGlobals.length = 0;
      }
      if (_playerQueue.length) {
        for (let i = 0; i < 10; i++) {
          let obj = _playerQueue.shift();
          obj && _this.events.fire(_this.CONNECTION, obj);
        }
      }
    }
    function handleEvent({ evtData: evtData, evtName: evtName, from: from }) {
      let callbacks = _eventMap[from];
      if (callbacks) {
        let callback = callbacks[evtName];
        callback && callback(evtData);
      }
      let callback = _globalEvents[evtName];
      callback && callback(evtData);
    }
    function playerJoin(e) {
      if (
        (_room.isCommunity
          ? _playerQueue.push({
              id: e.player.id,
              userData: e.player.data,
              player: e.player,
            })
          : _this.events.fire(_this.CONNECTION, {
              id: e.player.id,
              userData: e.player.data,
              player: e.player,
            }),
        _room.host && !_room.isCommunity)
      ) {
        for (let key in _global) _global[key].forceBroadcastSync = e.player.id;
        _this.delayedCall((_) => {
          for (let key in _global) _global[key].forceBroadcastSync = !1;
        }, 500);
      }
    }
    function playerDisconnect(e) {
      let obj = _instances[e.player.id] || _instanceBackup[e.player.id];
      (obj &&
        (_this.events.fire(_this.DISCONNECTION, {
          id: e.player.id,
          userData: e.player.data,
        }),
        obj.onDisconnect ? obj.onDisconnect() : obj.destroy && obj.destroy()),
        delete _instances[e.player.id],
        delete _instanceBackup[e.player.id],
        delete _eventMap[e.player.id]);
      for (let i = 0; i < _playerQueue.length; i++)
        _playerQueue[i].player == e.player &&
          (_playerQueue.splice(i, 1), (i -= 1));
    }
    function roomError() {
      (_this.events.fire(_this.ROOM_TIMEOUT),
        _room &&
          _room.players &&
          _room.players.forEach((player) => {
            playerDisconnect({ player: player });
          }));
    }
    function data({ data: data, player: player }) {
      if (data.pS)
        switch (data.pS) {
          case "start_sync":
            startSync();
            break;
          case "perform_sync":
            !(function performSync({ pos: pos, quaternion: quaternion }) {
              let remotePos = new Vector3().fromArray(pos),
                cameraQuat = World.CAMERA.quaternion,
                cameraPos = World.CAMERA.position,
                localQuaternion = World.SCENE.quaternion,
                localScene = World.SCENE.position,
                orientedRemotePos =
                  (new Quaternion().fromArray(quaternion),
                  new Vector3().copy(remotePos).applyQuaternion(cameraQuat)),
                localOrigin = new Vector3().copy(cameraPos),
                remoteOrigin = new Vector3()
                  .copy(orientedRemotePos)
                  .multiplyScalar(-1);
              (localScene.copy(localOrigin).add(remoteOrigin),
                localQuaternion.copy(cameraQuat));
            })(data);
            break;
          case "d":
            !(function transmitData(
              { objects: objects, from: from, global: global, events: events },
              player,
            ) {
              let lerpMultiplier = _this.compensateLag
                ? Math.range(player.ping, 50, 200, 1, 0.25, !0)
                : 1;
              for (let key in global) {
                let obj = _global[key];
                obj &&
                  ((obj.lerpMult = lerpMultiplier),
                  obj.positionTarget ||
                    ((obj.positionTarget = new Vector3()),
                    (obj.quaternionTarget = new Quaternion())),
                  global[key].p &&
                    (_receivedGlobals.push(key),
                    global[key].f == GameCenter2.GCID &&
                      (obj.physics &&
                        (void 0 === obj.physics.stashKinematic &&
                          ((obj.physics.stashKinematic = obj.physics.kinematic),
                          (obj.physics.kinematic = !0)),
                        clearTimeout(obj.physics.timer),
                        (obj.physics.timer = _this.delayedCall((_) => {
                          obj.physics.kinematic = obj.physics.stashKinematic;
                        }, 100))),
                      (obj.forced = !0)),
                    obj.positionTarget.fromArray(global[key].p),
                    global[key].q &&
                      obj.quaternionTarget.fromArray(global[key].q)));
              }
              if (_objects[from])
                for (let key in objects) {
                  let obj = _objects[from][key];
                  obj &&
                    ((obj.lerpMult = lerpMultiplier),
                    obj.positionTarget ||
                      ((obj.positionTarget = new Vector3()),
                      (obj.quaternionTarget = new Quaternion())),
                    objects[key].p &&
                      (obj.positionTarget.fromArray(objects[key].p),
                      objects[key].q &&
                        obj.quaternionTarget.fromArray(objects[key].q)),
                    objects[key].eD && (obj.eD = objects[key].eD));
                }
              if (events)
                for (let i = events.length - 1; i > -1; i--) {
                  let event = events[i];
                  shouldHandle(event) &&
                    ((event.from = from), handleEvent(event));
                }
            })(data, player);
            break;
          case "event":
            handleEvent(data);
        }
    }
    function handleVisibility(e) {
      "blur" == e.type
        ? (_this.flag("blurred", !0),
          (_visibilityTimer = setInterval(transmit, 250)))
        : (_this.flag("blurred", !1), clearInterval(_visibilityTimer));
    }
    (_this.events.sub(GameCenter2.LOST_CONNECTION, (_) => _this.useRoom(null)),
      _this.events.sub(Events.VISIBILITY, handleVisibility),
      (this.connect = async function (server) {
        ((GameCenter2.ports = this.ports || 1),
          (GameCenter2.userData = this.userData || {}),
          GameCenter2.connect(server));
        try {
          ((_room = await GameCenter2.findRoom()),
            _this.events.sub(_room, GameCenterRoom2.PLAYER_JOIN, playerJoin),
            _this.events.sub(
              _room,
              GameCenterRoom2.PLAYER_DISCONNECT,
              playerDisconnect,
            ),
            _this.events.sub(_room, GameCenter2.DATA, data));
        } catch (e) {
          console.error(e);
        }
        _room.players.forEach((player) => {
          player.me ||
            _this.events.fire(_this.CONNECTION, {
              id: player.id,
              userData: player.data,
              player: player,
            });
        });
      }),
      (this.useRoom = function (room) {
        if (
          (null == room &&
            _room &&
            (_room.players &&
              _room.players.forEach((player) => {
                player.me || playerDisconnect({ player: player });
              }),
            _this.events.unsub(_room, GameCenterRoom2.PLAYER_JOIN, playerJoin),
            _this.events.unsub(
              _room,
              GameCenterRoom2.PLAYER_DISCONNECT,
              playerDisconnect,
            ),
            _this.events.unsub(_room, GameCenterRoom2.ERROR, roomError),
            _this.events.unsub(_room, GameCenter2.DATA, data)),
          (_room = room),
          (_playerQueue = []),
          _this.startRender(loop),
          _room)
        ) {
          try {
            (_this.events.sub(_room, GameCenterRoom2.PLAYER_JOIN, playerJoin),
              _this.events.sub(
                _room,
                GameCenterRoom2.PLAYER_DISCONNECT,
                playerDisconnect,
              ),
              _this.events.sub(_room, GameCenterRoom2.ERROR, roomError),
              _this.events.sub(_room, GameCenter2.DATA, data));
          } catch (e) {
            console.error(e);
          }
          _room.players.forEach((player) => {
            player.me ||
              (_room.isCommunity
                ? _playerQueue.push({
                    id: player.id,
                    userData: player.data,
                    player: player,
                  })
                : _this.events.fire(_this.CONNECTION, {
                    id: player.id,
                    userData: player.data,
                    player: player,
                  }));
          });
        }
      }),
      (this.sync = function () {
        _room.host ? startSync() : _room.broadcast({ pS: "start_sync" });
      }),
      (this.createInstanceLink = function (obj, id) {
        ((_instances[id] = obj), (_instanceBackup[id] = obj));
      }),
      (this.deleteInstanceLink = function (id) {
        id &&
          (delete _instances[id], delete _objects[id], delete _eventMap[id]);
      }),
      (this.createLocalLink = function (obj, id) {
        (_objects.local || (_objects.local = {}),
          (_objects.local[id] = obj),
          _this.startRender(transmit, _this.transmitFPS));
      }),
      (this.deleteLocalLink = function (id) {
        delete _objects.local[id];
      }),
      (this.createRemoteEvent = function (name, id, callback) {
        (_eventMap[id] || (_eventMap[id] = {}),
          (_eventMap[id][name] = callback));
      }),
      (this.createGlobalEvent = function (id, callback) {
        _globalEvents[id] = callback;
      }),
      (this.deleteGlobalEvent = function (id) {
        delete _globalEvents[id];
      }),
      (this.fireLocalEvent = function (name, data = {}) {
        _events.push({
          evt: { evtData: data, evtName: name, id: Utils.uuid() },
          time: Render.TIME,
        });
      }),
      (this.createGlobalLink = function (obj, id) {
        _global[id] = obj;
      }),
      (this.deleteGlobalLink = function (id) {
        delete _global[id];
      }),
      (this.createRemoteLink = function (obj, playerId, id) {
        (_objects[playerId] || (_objects[playerId] = {}),
          (_objects[playerId][id] = obj),
          _this.startRender(loop));
      }),
      (this.alignLocally = function (yOffset = 0) {
        (World.SCENE.quaternion.copy(World.CAMERA.quaternion),
          (World.SCENE.rotation.z = 0),
          (World.SCENE.rotation.x = 0),
          World.SCENE.position.copy(World.CAMERA.position),
          (World.SCENE.position.y += yOffset),
          World.SCENE.updateMatrixWorld(!0),
          _matrix.getInverse(World.SCENE.matrix),
          _this.flag("aligned", !0));
      }),
      (this.realignObject = function (obj) {
        _this.flag("aligned") && obj.applyMatrix(_matrix);
      }));
  }, "static"),
  Class(
    function Proton(_input, _group) {
      Inherit(this, Object3D);
      const _this = this;
      var _config, _size, _antimatter, _behaviorInput, _batches;
      const prefix = (this.prefix = `P_${_input.prefix}`);
      async function initConfig() {
        ((_config = _this.uilConfig =
          InputUIL.create(prefix + "_config", _group)).setLabel("Config"),
          _config
            .addButton("load-values", {
              label: "Values",
              actions: [
                { title: "Load", callback: loadValues },
                { title: "Save", callback: saveValues },
              ],
            })
            .addButton("save", {
              label: "Configuration",
              actions: [
                { title: "Load", callback: loadConfig },
                { title: "Save", callback: saveConfig },
              ],
            })
            .addButton("load-shader", {
              label: "Shader",
              actions: [{ title: "Load", callback: () => loadShader() }],
            })
            .addButton("load-behavior", {
              label: "Behavior",
              actions: [{ title: "Load", callback: () => loadBehavior() }],
            }));
        (_config.addSelect("type", [
          { label: "Permanent", value: "permanent" },
          { label: "Lifecycle", value: "lifecycle" },
        ]),
          window.ProtonCulling && _config.addToggle("FrustumCulling", !1),
          _config.addToggle("staticParticles", !1),
          (_this.preventUpdate = _config.get("staticParticles")),
          _config.addFile("initialPositions", { relative: "assets/geometry" }),
          window.ProtonPhysics && _config.addToggle("enablePhysics", !1),
          _config.add("particleCount", 1e3),
          window.ProtonVolumeShadows && _config.addToggle("volumeShadows", !1));
        let output = [
          { label: "Particles", value: "particles" },
          { label: "Custom", value: "custom" },
        ];
        (window.ProtonTubes && output.push({ label: "Tubes", value: "tubes" }),
          window.ProtonMarchingCubes &&
            output.push({ label: "IsoSurface", value: "isosurface" }),
          _config.addSelect("output", output),
          _config.add("shader"),
          _config.get("shader") && _config.addTextarea("uniforms"),
          _config.add("class"));
        _config.get("type");
        try {
          if (!1 === _input.get("visible")) throw "Layer set to invisible";
          if (
            ((_this.particleCount = _size = getSize()),
            0 == _size || isNaN(_size))
          )
            throw "Size is falsy or 0";
          initAntimatter();
        } catch (e) {
          (Hydra.LOCAL && console.warn("Proton skipped", e),
            (_this.disabled = !0));
        }
      }
      function loadValues() {
        const name = prompt("Name of values to be loaded");
        if (null === name) return;
        let data = UILStorage.get(`proton_values_${name}`);
        (data || alert(`No values ${name} found`), (data = JSON.parse(data)));
        let apply = (shader, obj) => {
          for (let key in obj) UILStorage.set(shader.UILPrefix + key, obj[key]);
        };
        (apply(_this.behavior, data.behavior),
          apply(_this.shader, data.shader),
          _this.customClass &&
            _this.customClass.saveValues &&
            apply(_this.customClass.saveValues(), data.custom),
          alert("Values imported. Save and refresh."));
      }
      function saveValues() {
        const name = prompt("Name of values to be saved");
        if (null === name) return;
        let store = (shader, to) => {
            for (let key in shader.uniforms) {
              if (shader.uniforms[key].ignoreUIL) continue;
              let uilValue = UILStorage.get(shader.UILPrefix + key);
              void 0 !== uilValue && (to[key] = uilValue);
            }
          },
          output = { behavior: {}, shader: {} };
        (store(_this.behavior, output.behavior),
          store(_this.shader, output.shader),
          _this.customClass &&
            _this.customClass.saveValues &&
            ((output.custom = {}),
            store(_this.customClass.saveValues(), output.custom)),
          UILStorage.setWrite(`proton_values_${name}`, JSON.stringify(output)));
      }
      function loadConfig() {
        const name = prompt("Name of configuration to be loaded");
        if (null === name) return;
        let toLoad = UILStorage.get(`proton_config_${name}`);
        (loadBehavior(toLoad),
          loadShader(toLoad),
          alert("Loaded. Save and refresh"));
      }
      function saveConfig() {
        let name = prompt("Name of configuration to be saved");
        null !== name && UILStorage.setWrite(`proton_config_${name}`, prefix);
      }
      function loadShader(toLoad) {
        let shouldNotify = !toLoad;
        if (!toLoad) {
          const name = prompt("Name of shader to be loaded");
          if (null === name) return;
          toLoad = UILStorage.get(`proton_config_${name}`);
        }
        let copyConfig = InputUIL.create(toLoad + "_config", null);
        (_config.copyFrom(copyConfig, ["shader", "uniforms"]),
          (_config.get("uniforms") || "").split("\n").forEach((line) => {
            if (!line.includes(":")) return;
            let name = (line = line.replace(/ /g, "")).split(":")[0],
              shaderName = copyConfig.get("shader"),
              store = `${shaderName}/${shaderName}/${prefix}/`,
              lookup = `${shaderName}/${shaderName}/${toLoad}/`,
              val = UILStorage.get(lookup + name);
            val
              ? UILStorage.set(store + name, val)
              : ((val = UILStorage.get(lookup + "_tx_" + name)),
                val && UILStorage.set(store + "_tx_" + name, val));
          }),
          shouldNotify && alert("Loaded. Save and refresh"));
      }
      function loadBehavior(toLoad) {
        let shouldNotify = !toLoad;
        if (!toLoad) {
          const name = prompt("Name of behavior to be loaded");
          if (null === name) return;
          toLoad = UILStorage.get(`proton_config_${name}`);
        }
        let copyConfig = InputUIL.create(toLoad + "_config", null);
        _config.copyFrom(copyConfig, [
          "type",
          "particleCount",
          "output",
          "class",
        ]);
        let copyBehavior = InputUIL.create(toLoad + "_behavior", null);
        InputUIL.create(prefix + "_behavior", null).copyFrom(copyBehavior, [
          "uniforms",
          "data",
          "codeCount",
        ]);
        let data = copyBehavior.get("data") || [],
          buniformString = copyBehavior.get("uniforms") + "\n";
        (ListUIL.create(prefix + "_code", null).internalAddItems(data.length),
          data.forEach((postfix) => {
            let toCode = InputUIL.create(prefix + postfix, null),
              fromCode = InputUIL.create(toLoad + postfix, null);
            (toCode.copyFrom(fromCode, ["name", "code", "uniforms", "preset"]),
              (buniformString += fromCode.get("uniforms") + "\n"));
          }),
          buniformString.split("\n").forEach((line) => {
            if (!line.includes(":")) return;
            let name = (line = line.replace(/ /g, "")).split(":")[0],
              lookup = "am_ProtonAntimatter_" + toLoad,
              store = "am_ProtonAntimatter_" + prefix,
              val = UILStorage.get(lookup + name);
            val && UILStorage.set(store + name, val);
          }));
        let className = copyConfig.get("class");
        (className &&
          ((_this.customClass = _this.parent.initClass(
            window[className],
            _this,
            _group,
            _input,
          )),
          _this.customClass.loadConfig &&
            _this.customClass.loadConfig(toLoad, prefix)),
          shouldNotify && alert("Loaded. Save and refresh"));
      }
      function getSize() {
        if (_this.parent.data && _this.parent.data.particleCount)
          return "string" == typeof _this.parent.data.particleCount
            ? eval(_this.parent.data.particleCount)
            : _this.parent.data.particleCount;
        let size = _config.getNumber("particleCount");
        if (isNaN(size) || 0 === size)
          try {
            size = eval(_config.get("particleCount"));
          } catch (e) {
            throw "Proton particleCount is not a number or valid test function";
          }
        if (isNaN(size)) throw "Proton particleCount is falsy!";
        return ((_this.particleCount = size), size);
      }
      async function initCustomClass() {
        _this.shader.addUniforms({ DPR: { value: World.DPR, ignoreUIL: !0 } });
        let className = _config.get("class");
        className &&
          (_this.customClass = _this.parent.initClass(
            window[className],
            _this,
            _group,
            _input,
          ));
      }
      function parseUniforms(text, predefined) {
        if (!text) return {};
        let split = text.split("\n"),
          output = {};
        return (
          split.forEach((line) => {
            if (!(line = line.replace(/ /g, "")).length || !line.includes(":"))
              return;
            let split = line.split(":"),
              name = split[0],
              val = split[1];
            if (val.includes("[")) {
              let array = JSON.parse(val);
              switch (array.length) {
                case 2:
                  output[name] = { value: new Vector2().fromArray(array) };
                  break;
                case 3:
                  output[name] = { value: new Vector3().fromArray(array) };
                  break;
                case 4:
                  output[name] = { value: new Vector4().fromArray(array) };
                  break;
                default:
                  throw `Unknown uniform type ${line}`;
              }
            } else
              "C" == val.charAt(0)
                ? (predefined[name] = val.slice(1))
                : "T" === val
                  ? (output[name] = { value: null })
                  : "T3D" === val
                    ? (output[name] = { value: null, isTexture3D: !0 })
                    : "OEST" === val
                      ? (output[name] = { value: null, oes: !0 })
                      : val.includes(["0x", "#"])
                        ? (output[name] = { value: new Color(val) })
                        : (output[name] = { value: Number(val) });
          }),
          output
        );
      }
      function getUniformGLSLType(obj) {
        return "number" == typeof obj.value
          ? "float"
          : obj.oes
            ? "samplerExternalOES"
            : null === obj.value
              ? obj.isTexture3D
                ? "sampler3D"
                : "sampler2D"
              : obj.value instanceof Texture
                ? obj.value.isTexture3D
                  ? "sampler3D"
                  : "sampler2D"
                : obj.value instanceof Vector2
                  ? "vec2"
                  : obj.value instanceof Vector3 ||
                      obj.value instanceof Vector3D
                    ? "vec3"
                    : obj.value instanceof Vector4
                      ? "vec4"
                      : obj.value instanceof Color
                        ? "vec3"
                        : void 0;
      }
      async function initBehavior(behavior) {
        let glsl = [],
          predefinedUniforms = { HZ: "float" },
          input;
        _behaviorInput
          ? (input = _behaviorInput)
          : ((input = InputUIL.create(prefix + "_behavior", _group)),
            input.setLabel("Behavior Uniforms"),
            input.addTextarea("uniforms"),
            input.add("data", "hidden"),
            input.add("codeCount", "hidden"),
            (_behaviorInput = input));
        let map = {},
          list = [],
          count = input.getNumber("codeCount") || 0,
          data = input.get("data") || [],
          panel = ListUIL.create(prefix + "_code", _group);
        (panel.setLabel("Behavior Code"),
          panel.onAdd((name, input, index) => {
            (list[index] || addCode(),
              input.group.add(list[index].group),
              (list[index].mapId = name),
              (map[name] = list[index]),
              input.setLabel(map[name].get("name") || "Code"));
          }),
          panel.onRemove((name) => {
            let postfix = map[name].postfix;
            (list.remove(map[name]),
              data.remove(postfix),
              input.setValue("data", JSON.stringify(data)));
          }),
          panel.onSort((array) => {
            let arr = [];
            (array.forEach((name) => {
              arr.push(map[name].postfix);
            }),
              (data = arr),
              input.setValue("data", JSON.stringify(data)));
          }));
        let uniforms = parseUniforms(input.get("uniforms")),
          createCode = (postfix) => {
            let input = InputUIL.create(prefix + postfix, _group, !0);
            if (
              ((input.prefix = prefix + postfix),
              (input.postfix = postfix),
              input.setLabel("Editor"),
              input.add("name", "hidden"),
              Proton.ignorePresets &&
                Proton.ignorePresets.includes(input.get("name")))
            )
              return;
            (ProtonPresets.bind(input),
              input.customPresetCallback && input.customPresetCallback(_this));
            let code = input.get("code") || "";
            if (!input.disabled && code.length) {
              for (
                uniforms = Utils.mergeObject(
                  uniforms,
                  parseUniforms(input.get("uniforms"), predefinedUniforms),
                );
                code.includes("#test ");
              )
                try {
                  let test = code.split("#test ")[1],
                    name = test.split("\n")[0],
                    glsl = code
                      .split("#test " + name + "\n")[1]
                      .split("#endtest")[0];
                  (eval(name) || (code = code.replace(glsl, "")),
                    (code = code.replace("#test " + name + "\n", "")),
                    (code = code.replace("#endtest", "")));
                } catch (e) {
                  throw "Error parsing test :: " + e;
                }
              glsl.push(code);
            }
            list.push(input);
          };
        data.forEach(createCode);
        let addCode = (_) => {
          (count++,
            data.push(`code_${count}`),
            input.setValue("data", JSON.stringify(data)),
            input.setValue("codeCount", count),
            createCode(`code_${count}`));
        };
        behavior instanceof AntimatterPass &&
          (behavior.addInput("tOrigin", _antimatter.vertices),
          behavior.addInput("tAttribs", _antimatter.attribs),
          behavior.addUniforms(uniforms));
        let filledRequire = [],
          insertUniform = (code, line) =>
            code.split("//uniforms").join(line + "\n//uniforms"),
          insertCode = (code, line) =>
            code.split("//code").join(line + "\n//code"),
          insertRequire = (code, line) => {
            let name = line.split("require(")[1].split(")")[0];
            return filledRequire.includes(name)
              ? code
              : (filledRequire.push(name),
                code
                  .split("//require")
                  .join(Shaders.getShader(name) + "\n//require"));
          },
          insertGLSL = (code, line) => {
            if (line.includes("#require")) {
              let split = line.split("\n");
              for (let l of split)
                code = l.includes("#require")
                  ? insertRequire(code, l)
                  : insertCode(code, l);
              return code;
            }
            return insertCode(code, line);
          };
        ((behavior.onCreateShader = (code) => {
          for (let name in uniforms)
            code = insertUniform(
              code,
              `uniform ${getUniformGLSLType(uniforms[name])} ${name};`,
            );
          for (let name in predefinedUniforms)
            code = insertUniform(
              code,
              `uniform ${predefinedUniforms[name]} ${name};`,
            );
          for (let str of glsl) code = insertGLSL(code, str);
          return (
            _this.tubes && (code = _this.tubes.overrideShader(code)),
            Renderer.type == Renderer.WEBGL2 &&
              (code = code.replace(/gl_FragColor/g, "FragColor")),
            code.includes("samplerExternalOES") &&
              window.AURA &&
              "android" == Device.system.os &&
              (code =
                "#version 300 es\n#extension GL_OES_EGL_image_external_essl3 : require\n" +
                code.replace("#version 300 es", "")),
            code
          );
        }),
          (behavior.uniforms.uMaxCount = {
            value: _this.particleCount,
            ignoreUIL: !0,
          }),
          ShaderUIL.add(behavior, _group).setLabel("Behavior Shader"),
          (behavior.uniforms.HZ = { value: 1 }),
          _config.get("FrustumCulling") &&
            _batches.setupPositionTexture(behavior.output.texture),
          _this.startRender((_) => {
            behavior.uniforms.HZ.value = Render.HZ_MULTIPLIER;
          }, 10),
          (ProtonPresets.onCodeEdit = rebuildShader));
      }
      async function rebuildShader() {
        let lifecycle = "lifecycle" == _config.get("type"),
          behavior = _this.initClass(
            AntimatterPass,
            "ProtonAntimatter" + (lifecycle ? "Lifecycle" : ""),
            { unique: prefix, customCompile: prefix + Utils.uuid() },
          );
        (await initBehavior(behavior),
          behavior.initialize(64),
          behavior.upload(),
          _this.behavior.shader._gl &&
            (_this.behavior.shader._gl = behavior.shader._gl),
          _this.behavior.shader._metal &&
            (_this.behavior.shader._metal = behavior.shader._metal),
          _this.behavior.shader._gpu &&
            (_this.behavior.shader._gpu = behavior.shader._gpu));
      }
      function completeShader(shader) {
        let transparent = _input.get("transparent"),
          depthWrite = _input.get("depthWrite"),
          depthTest = _input.get("depthTest"),
          blending = _input.get("blending"),
          castShadow = _input.get("castShadow"),
          receiveShadow = _input.get("receiveShadow");
        ("boolean" == typeof depthWrite && (shader.depthWrite = depthWrite),
          "boolean" == typeof depthTest && (shader.depthTest = depthTest),
          "boolean" == typeof transparent && (shader.transparent = transparent),
          "boolean" == typeof castShadow &&
            (_this.mesh.castShadow = castShadow),
          "boolean" == typeof receiveShadow &&
            (shader.receiveShadow = receiveShadow),
          blending && (shader.blending = blending),
          (shader.uniforms.tRandom = { value: _antimatter.attribs }));
      }
      function update() {
        _this.preventUpdate || _antimatter.update();
      }
      async function initInitialPositions() {
        let file = _config.getFilePath("initialPositions");
        if (!file) return;
        let isBinary = file.includes(".bin");
        (file.includes("assets/geometry") || (file = `assets/geometry/${file}`),
          isBinary || file.includes(".json") || (file += ".json"));
        let url = Thread.absolutePath(Assets.getPath(file)),
          pointData = {};
        if (isBinary) {
          await GeomThread.loadDracoLib();
          let data = await Thread.shared().loadDraco({
            type: "decode",
            path: url,
          });
          data._type
            ? ((pointData.positions = data.offset),
              (pointData.random = data.random))
            : ((pointData.positions = data.offset.buffer),
              (pointData.random = data.random.buffer));
        } else {
          pointData = await Thread.shared().parseInstancePositions({
            url: url,
          });
        }
        return (
          pointData.positions &&
            (_this.particleCount = _size = pointData.positions.length / 3),
          pointData
        );
      }
      async function initAntimatter() {
        let lifecycle = "lifecycle" == _config.get("type");
        _config.get("enablePhysics")
          ? (_config.addVector("width", [0, 128]),
            _config.addVector("height", [0, 128]),
            _config.addVector("depth", [0, 128]))
          : (_config.addVector("width", [-1, 1]),
            _config.addVector("height", [-1, 1]),
            _config.addVector("depth", [-1, 1]));
        let dimensions = {
            w: _config.get("width") || [-1, 1],
            h: _config.get("height") || [-1, 1],
            d: _config.get("depth") || [-1, 1],
            pot:
              "tubes" === _config.get("output") ||
              !0 === _config.get("volumeShadows") ||
              "isosurface" === _config.get("output"),
          },
          pointData = null;
        if (_config.get("FrustumCulling")) {
          let file = _config.getFilePath("initialPositions");
          if (((file = Assets.getPath(file)), !file)) return;
          ((_batches = _this.initClass(ProtonCulling, _input, _group, file)),
            await _batches.ready,
            (pointData = {}),
            (pointData.positions = new Float32Array(_batches.pointData)),
            (_this.particleCount = _size = _batches.pointData.length / 3));
        } else pointData = await initInitialPositions();
        ((_antimatter = _this.initClass(
          Antimatter,
          _size,
          dimensions,
          World.RENDERER,
          pointData,
        )),
          Proton.forceCloneVertices.includes(_config.get("class")) &&
            (_antimatter.cloneVertices = !0),
          (_this.antimatter = _antimatter),
          await _antimatter.ready());
        let output = _config.get("output");
        ("tubes" == output &&
          (_this.tubes = _this.initClass(ProtonTubes, _this)),
          "isosurface" == output &&
            (_this.surface = _this.initClass(ProtonMarchingCubes, _this)));
        let overrideShader,
          wildcard = _input.get("wildcard");
        if (wildcard && wildcard.includes(".behavior")) {
          let layer = await _this.parent.getLayer(wildcard.split(".")[0]);
          (await _this.wait(layer, "behavior"),
            (_this.behavior = layer.behavior));
        } else {
          let behavior = _this.initClass(
            AntimatterPass,
            "ProtonAntimatter" + (lifecycle ? "Lifecycle" : ""),
            { unique: prefix, customCompile: prefix },
          );
          ((_this.behavior = behavior), initBehavior(behavior));
        }
        let shaderName = _config.get("shader");
        if (shaderName)
          if (shaderName.includes(".shader")) {
            let layer = await _this.parent.getLayer(shaderName.split(".")[0]);
            (await _this.wait(layer, "shader"),
              (overrideShader = layer.shader));
          } else {
            let uniforms = parseUniforms(_config.get("uniforms"));
            ((uniforms.unique =
              prefix +
              (_this.onGenerateUniqueShader
                ? _this.onGenerateUniqueShader()
                : "")),
              _antimatter.useShader(shaderName, uniforms));
          }
        (_antimatter.addPass(_this.behavior),
          (_this.mesh = _antimatter.getMesh()),
          _this.onCreateMesh && _this.onCreateMesh(_this.mesh),
          (output && "particles" != output) ||
            _this.delayedCall((_) => {
              _config.get("FrustumCulling") || _this.add(_antimatter.mesh);
            }, 480),
          Utils.query("uilOnly") ||
            _this.startRender(update, RenderManager.AFTER_LOOPS),
          shaderName &&
            !shaderName.includes(".shader") &&
            (ShaderUIL.add(_antimatter.shader, _group).setLabel("Shader"),
            completeShader(_antimatter.shader)),
          overrideShader && _antimatter.overrideShader(overrideShader),
          (_this.shader = _antimatter.shader),
          (_this.initialized = !0),
          lifecycle &&
            (_this.spawn = _this.initClass(
              AntimatterSpawn,
              _this,
              _group,
              _input,
            )),
          initCustomClass(),
          _config.get("volumeShadows") &&
            _this.initClass(ProtonVolumeShadows, _this, _group, _input),
          _config.get("enablePhysics") &&
            _this.initClass(ProtonPhysics, _this, _group, _input));
      }
      async function upload(sync = !0) {
        if (_this.disabled) return;
        await _this.ready();
        let output = _config.get("output"),
          uploadFuncName = sync ? "uploadSync" : "upload";
        (await _antimatter[uploadFuncName](!output || "particles" === output),
          _this.spawn && (await _this.spawn.upload()),
          _this.tubes && (await _this.tubes[uploadFuncName]()));
      }
      ((this.uilInput = _input),
        (this.uilGroup = _group),
        (this.prefix = prefix),
        (this.preventUpdate = !1),
        initConfig(),
        (this.parseUniforms = parseUniforms),
        (this.ready = function () {
          return this.wait(this, "initialized");
        }),
        (this.applyToInstancedGeometry = function (geometry) {
          (geometry.addAttribute(
            "lookup",
            new GeometryAttribute(_antimatter.getLookupArray(), 3, 1),
          ),
            geometry.addAttribute(
              "random",
              new GeometryAttribute(_antimatter.getRandomArray(), 4, 1),
            ),
            (geometry.maxInstancedCount = _size));
        }),
        (this.applyToShader = function (shader) {
          shader.addUniforms({
            tPos: _antimatter.getOutput(),
            tPrevPos: _antimatter.getPrevOutput(),
          });
        }),
        (this.upload = (function () {
          let visible,
            count = 0;
          return async function () {
            (0 === count &&
              ((visible = _this.group.visible),
              (_this.group.visible = !1),
              (count += 1)),
              await upload(!1),
              (count -= 1),
              0 === count && (_this.group.visible = visible));
          };
        })()),
        (this.uploadSync = async function () {
          await upload(!0);
        }),
        (this.stopUpdating = function () {
          _this.stopRender(update, RenderManager.AFTER_LOOPS);
        }),
        (this.update = update),
        this.set("renderOrder", async (v) => {
          (await _this.ready(),
            await _antimatter.ready(),
            (_antimatter.mesh.renderOrder = v));
        }),
        this.get("renderOrder", (v) => _antimatter.mesh.renderOrder));
    },
    (_) => {
      ((Proton.forceCloneVertices = []),
        (Proton.ignore = function (name) {
          (Proton.ignorePresets || (Proton.ignorePresets = []),
            Proton.ignorePresets.push(name));
        }),
        Thread.upload(function parseInstancePositions({ url: url }, id) {
          get(url).then((data) => {
            let result = {},
              buffers = [];
            if (data?.positions)
              ((result.positions = new Float32Array(data.positions)),
                buffers.push(result.positions.buffer));
            else if (data) {
              let bufferName = "buffer",
                attributes = data;
              (data.data &&
                data.metadata?.type &&
                ((bufferName = "array"), (attributes = data.data.attributes)),
                (result.positions = new Float32Array(
                  attributes.offset[bufferName],
                )),
                buffers.push(result.positions.buffer));
            }
            if (data?.random)
              ((result.random = new Float32Array(data.random)),
                buffers.push(result.random.buffer));
            else if (data) {
              let bufferName = "buffer",
                attributes = data;
              (data.data &&
                data.metadata?.type &&
                ((bufferName = "array"), (attributes = data.data.attributes)),
                attributes.random &&
                  ((result.random = new Float32Array(
                    attributes.random[bufferName],
                  )),
                  buffers.push(result.random.buffer)));
            }
            resolve(result, id, buffers);
          });
        }));
    },
  ),
  Class(function ProtonPresets() {
    const _this = this,
      LIST = [
        { label: "Custom Code", value: "custom" },
        { label: "Curl Noise", value: "curl" },
        { label: "Sine Move", value: "sine" },
        { label: "Plane Shape", value: "planeshape" },
        { label: "3D Shape", value: "3dshape" },
        { label: "Point Cloud", value: "pointcloud" },
        { label: "Force", value: "force" },
        { label: "Follow", value: "follow" },
        { label: "Mouse Fluid", value: "fluid" },
      ],
      CALLBACKS = {
        custom: function customCode(input) {
          (input.setValue("name", "Custom Code"),
            input.setLabel("Custom Code"));
        },
        curl: function curlNoise(input) {
          (input.setValue("name", "Curl Noise"), input.setLabel("Curl Noise"));
          (input.setValue(
            "uniforms",
            "\n        uCurlNoiseScale: 1\n        uCurlTimeScale: 0\n        uCurlNoiseSpeed: 0\n        ",
          ),
            setPresetCodeIfRequired(
              input,
              "#require(curl.glsl)\n\nvec3 curl = curlNoise(pos * uCurlNoiseScale*0.1 + (time * uCurlTimeScale * 0.1));\npos += curl * uCurlNoiseSpeed * 0.01 * HZ;",
              "uCurlNoise",
            ));
        },
        sine: function sineMove(input) {
          (input.setValue("name", "Sine Move"), input.setLabel("Sine Move"));
          (input.setValue(
            "uniforms",
            "\n        uSinSpeed: 1\n        uSinMovement: 0\n        ",
          ),
            setPresetCodeIfRequired(
              input,
              "pos = origin;\npos.x += sin(time*uSinSpeed + radians(360.0 * random.x)) * 0.03 * random.z * uSinMovement * HZ;\npos.y += sin(time*uSinSpeed + radians(360.0 * random.y)) * 0.03 * random.w * uSinMovement * HZ;\npos.z += sin(time*uSinSpeed + radians(360.0 * random.w)) * 0.03 * random.x * uSinMovement * HZ;",
              "uSinSpeed",
            ));
        },
        planeshape: function planeShape(input) {
          (input.setValue("name", "Plane Shape"),
            input.setLabel("Plane Shape"));
          (input.setValue(
            "uniforms",
            "\n        uTakePlaneShape: 1\n        uPlaneScale: 1\n        tPlaneTexture: Csampler2D\n        ",
          ),
            setPresetCodeIfRequired(
              input,
              "vec2 planeLookup = texture2D(tPlaneTexture, uv).xy;\nvec3 plane;\nplane.x = uPlaneScale * 0.5 * range(planeLookup.x, 0.0, 1.0, -1.0, 1.0);\nplane.y = uPlaneScale * 0.5 * -range(planeLookup.y, 0.0, 1.0, -1.0, 1.0);\nif (uTakePlaneShape > 0.5) pos = plane;",
              "uPlaneScale",
            ),
            (input.customPresetCallback = (proton) => {
              proton.behavior.addUniforms({ tPlaneTexture: { value: null } });
            }));
        },
        "3dshape": function shape3D(input) {
          (input.setValue("name", "3D Shape"),
            input.setLabel("3D Shape"),
            input.add("geometry"));
          let geometry = input.get("geometry");
          (input.setValue(
            "uniforms",
            "\n        tShape3D: Csampler2D\n        ",
          ),
            setPresetCodeIfRequired(
              input,
              "vec3 shape3d = texture2D(tShape3D, uv).xyz;",
              "tShape3D",
            ),
            (input.customPresetCallback = (proton) => {
              let create = async (g) => {
                let geom = await GeomThread.loadGeometry(g),
                  distribution = await ParticleDistributor.generate(
                    geom,
                    proton.antimatter.particleCount,
                  ),
                  attribute = new AntimatterAttribute(distribution, 3);
                proton.behavior.addInput("tShape3D", attribute);
              };
              (geometry && create(geometry), (proton.set3DShape = create));
            }));
        },
        pointcloud: function pointCloud(input) {
          (input.setValue("name", "Point Cloud"),
            input.setLabel("Point Cloud"),
            input.add("file"));
          let file = input.get("file");
          (input.setValue(
            "uniforms",
            "\n        tPointCloud: Csampler2D\n        ",
          ),
            setPresetCodeIfRequired(
              input,
              "vec3 pointShape = texture2D(tPointCloud, uv).xyz;",
              "tPointCloud",
            ),
            (input.customPresetCallback = (proton) => {
              let create = async (filePath) => {
                let data;
                ("string" == typeof filePath
                  ? ((filePath += "-" + proton.antimatter.powerOf2),
                    (_this.cachePointCloud = _this.cachePointCloud || {}),
                    _this.cachePointCloud[filePath] ||
                      (_this.cachePointCloud[filePath] =
                        ParticleDistributor.generatePointCloud(
                          filePath,
                          proton.antimatter.textureSize,
                        )),
                    (data = await _this.cachePointCloud[filePath]))
                  : (data = filePath),
                  proton.behavior.shader.uniforms.tPointCloud &&
                    (proton.behavior.shader.uniforms.tPointCloud.value.destroy(),
                    proton.shader.uniforms.tPointColor.value.destroy()),
                  proton.behavior.addInput("tPointCloud", data.positions),
                  proton.shader.addUniforms({
                    tPointColor: { value: data.colors },
                  }));
              };
              (file ||
                (file = proton.parent.data
                  ? proton.parent.data.pointCloudFile
                  : void 0),
                file && create(file),
                (proton.setPointCloud = create));
            }));
        },
        force: function force(input) {
          (input.setValue("name", "Force"), input.setLabel("Force"));
          (input.setValue(
            "uniforms",
            "\n        uForceDir: [0, 1, 0]\n        uForceScale: 1\n        ",
          ),
            setPresetCodeIfRequired(
              input,
              "vec3 force = normalize(uForceDir) * uForceScale * 0.1;\npos += force * HZ;",
              "uForceDir",
            ));
        },
        follow: function follow(input) {
          (input.setValue("name", "Follow"), input.setLabel("Follow"));
          (input.setValue(
            "uniforms",
            "\n        uFollowPos: [0, 0, 0]\n        uFollowRadius: 2\n        uFollowLerp: 0.7\n        ",
          ),
            setPresetCodeIfRequired(
              input,
              "float speed = range(random.x, 0.0, 1.0, 0.5, 1.5);\nvec3 followPos = uFollowPos;\nfollowPos.x += range(random.y, 0.0, 1.0, -1.0, 1.0) * uFollowRadius;\nfollowPos.y += range(random.z, 0.0, 1.0, -1.0, 1.0) * uFollowRadius;\nfollowPos.z += range(random.w, 0.0, 1.0, -1.0, 1.0) * uFollowRadius;\npos += (followPos - pos) * (uFollowLerp*0.1*speed*HZ);",
              "followPos",
            ));
        },
        fluid: function fluid(input) {
          (input.setValue("name", "Mouse Fluid"),
            input.setLabel("Mouse Fluid"));
          (input.setValue(
            "uniforms",
            "\n        uProjMatrix: Cmat4\n        uProjNormalMatrix: Cmat4\n        uModelMatrix: Cmat4\n        tFluidMask: Csampler2D\n        tFluid: Csampler2D\n        uMouseStrength: 1\n        ",
          ),
            setPresetCodeIfRequired(
              input,
              "#require(glscreenprojection.glsl)\n\nvec3 mpos = vec3(uModelMatrix * vec4(pos, 1.0));\nvec2 screenUV = getProjection(mpos, uProjMatrix);\nvec3 flow = vec3(texture2D(tFluid, screenUV).xy, 0.0);\napplyNormal(flow, uProjNormalMatrix);\npos += flow * 0.0001 * HZ * uMouseStrength * texture2D(tFluidMask, screenUV).r;",
              "glscreenprojection",
            ));
          let findCamera = (proton) => {
            let camera = World.CAMERA,
              p = proton.group._parent;
            for (; p; )
              (p instanceof Scene && p.nuke && (camera = p.nuke.camera),
                (p = p._parent));
            return camera;
          };
          input.customPresetCallback = async (proton) => {
            if (!("MouseFluid" in window))
              return void alert(
                "'mousefluid' module not found. To use Mouse Fluid preset, import module, load the MouseFluid class, and add a layer named 'fluid' with customCLass FluidLayer.",
              );
            let camera = findCamera(proton),
              projection = proton.initClass(GLScreenProjection, camera);
            (projection.start(),
              (proton.projection = projection),
              Render.start(function camLoop() {
                if (!proton.group) return void Render.stop(camLoop);
                let newCamera = findCamera(proton);
                newCamera != camera &&
                  ((camera = newCamera), (projection.camera = camera));
              }, 10),
              proton.wait("behavior").then((_) => {
                (proton.behavior.addUniforms({
                  uProjMatrix: projection.uniforms.projMatrix,
                  uModelMatrix: projection.uniforms.modelMatrix,
                  uProjNormalMatrix: projection.uniforms.normalMatrix,
                }),
                  MouseFluid.instance().applyTo(proton.behavior));
              }));
          };
        },
      };
    function setPresetCodeIfRequired(
      input,
      presetCode,
      keyShaderComponentString,
    ) {
      const editorCode = input.get("code");
      (editorCode && editorCode.includes(keyShaderComponentString)) ||
        input.setValue("code", presetCode);
    }
    ((this.register = function (name, callback) {
      let key = name.replace(/ /g, "").toLowerCase();
      (LIST.push({ label: name, value: key }), (CALLBACKS[key] = callback));
    }),
      (this.bind = function (input) {
        input.add("code", "hidden");
        (input.add("uniforms", "hidden"), input.addSelect("preset", LIST));
        let callback = CALLBACKS[input.get("preset")];
        (callback && callback(input),
          input.addButton("btn", {
            actions: [
              {
                title: "Edit Code",
                callback: (_) => {
                  let editor = new UILExternalEditor(
                    input.get("name") || "Code",
                    300,
                  );
                  (editor.setCode(input.get("code"), "c"),
                    (editor.onSave = (value) => {
                      (input.setValue("code", value), _this.onCodeEdit?.());
                    }),
                    UIL.add(editor));
                },
              },
            ],
            hideLabel: !0,
          }));
      }));
  }, "static"),
  Class(function ProtonTubes(_proton) {
    Inherit(this, Object3D);
    const _this = this;
    var _config, _segments, _textureSize, _count, _shader, _geom;
    ((this.padding = 1e3),
      (async function () {
        (!(function initConfig() {
          ((_config = InputUIL.create(
            "tubes_" + _proton.prefix,
            _proton.uilGroup,
          )).setLabel("Tubes"),
            _config.add("segments", 5),
            _config.add("sides", 4),
            _config.add("lerp", 0.2),
            _config.add("resetDelta", 10),
            (_config.onUpdate = (key) => {
              ("lerp" == key &&
                _proton.behavior.setUniform("uLerp", _config.getNumber("lerp")),
                "resetDelta" == key &&
                  _proton.behavior.setUniform(
                    "uResetDelta",
                    _config.getNumber("resetDelta"),
                  ));
            }));
        })(),
          await (async function initBuffers() {
            let segments =
              _this.parent.parent.data && _this.parent.parent.data.tubeSegments
                ? _this.parent.parent.data.tubeSegments
                : _config.getNumber("segments");
            _this.padding = 2 * _segments;
            let indexBuffer = await _proton.antimatter.createFloatArrayAsync(
                4,
                !0,
              ),
              count = indexBuffer.length / 4;
            for (let i = 0; i < count; i++)
              ((indexBuffer[4 * i + 0] = i % segments),
                (indexBuffer[4 * i + 1] = Math.floor(i / segments)),
                (indexBuffer[4 * i + 2] = i % segments == 0 ? 1 : 0),
                (indexBuffer[4 * i + 3] = 1));
            ((_textureSize = _proton.antimatter.textureSize),
              (_segments = segments),
              (_count = count / segments));
            let indices = _this.initClass(AntimatterAttribute, indexBuffer, 4);
            (_proton.behavior.addInput("tIndices", indices),
              _proton.behavior.addUniforms({
                uLerp: { value: _config.getNumber("lerp"), ignoreUIL: !0 },
                uResetDelta: {
                  value: _config.getNumber("resetDelta"),
                  ignoreUIL: !0,
                },
                textureSize: { value: _textureSize, ignoreUIL: !0 },
                lineSegments: { value: segments, ignoreUIL: !0 },
              }));
          })(),
          await _this.wait(_proton.spawn, "lifeOutput"),
          (function initGeometry() {
            let shape = require("GenerateTube")(
                _config.getNumber("sides"),
                _segments - 1,
                !1,
              ),
              geom = new Geometry();
            geom.addAttribute(
              "cNumber",
              new GeometryAttribute(new Float32Array(_count), 1, 1),
            );
            for (let key in shape.attributes)
              geom.addAttribute(key, shape.attributes[key]);
            for (let i = 0; i < _count; i++)
              geom.attributes.cNumber.array[i] = i;
            _geom = geom;
          })(),
          (function initShader() {
            let shaderName = _proton.uilConfig.get("shader") || "",
              modifyShader = !0;
            const attr = {
              noAttributes: !0,
              unique: shaderName,
              thickness: { type: "f", value: 1 },
              textureSize: { type: "f", value: _textureSize, ignoreUIL: !0 },
              lineSegments: { type: "f", value: _segments, ignoreUIL: !0 },
              radialSegments: {
                type: "f",
                value: _config.getNumber("sides"),
                ignoreUIL: !0,
              },
              taper: { type: "f", value: 0 },
              tLife: {
                type: "t",
                value: _proton.spawn.lifeOutput,
                ignoreUIL: !0,
              },
              tRandom: {
                type: "t",
                value: _proton.antimatter.random,
                ignoreUIL: !0,
              },
            };
            shaderName.includes("ProtonCustom")
              ? ((_shader = _this.initClass(Shader, shaderName, attr)),
                (modifyShader = !1))
              : (_shader = _this.initClass(
                  shaderName && shaderName.includes("PBR") ? PBRShader : Shader,
                  "ProtonTube",
                  shaderName || "ProtonTube",
                  attr,
                ));
            if (
              (_this.wait(_proton.shader.uniforms, "tLifeData").then((_) => {
                _shader.addUniforms({
                  tLifeData: _proton.shader.uniforms.tLifeData,
                  tRandom: _proton.shader.uniforms.tRandom,
                });
              }),
              _shader.addUniforms(
                _proton.parseUniforms(_proton.uilConfig.get("uniforms")),
              ),
              shaderName && modifyShader)
            ) {
              let vs = Shaders.getShader(shaderName + ".vs");
              if (vs && _shader.vertexShader) {
                if (
                  ((vs = vs.split("void main() {")),
                  vs[0].includes("extrudeTube"))
                ) {
                  let extrude = vs[0]
                    .split("void extrudeTube() {")[1]
                    .split("}")[0];
                  ((vs[0] = vs[0].replace(
                    "void extrudeTube() {" + extrude + "}",
                    "",
                  )),
                    (_shader.vertexShader = _shader.vertexShader.replace(
                      "//neutrinovs",
                      extrude,
                    )));
                }
                let params = vs[0].split("\n"),
                  main = vs[1].slice(0, vs[1].lastIndexOf("}")),
                  paramOutput = [];
                for (let line of params)
                  (_shader.vertexShader.includes(line) && "}" != line.trim()) ||
                    paramOutput.push(line);
                ((_shader.vertexShader = _shader.vertexShader.replace(
                  "//neutrinoparams",
                  paramOutput.join("\n"),
                )),
                  (_shader.vertexShader = _shader.vertexShader.replace(
                    "//neutrinovspost",
                    main,
                  )));
              }
              window[shaderName] &&
                _this.initClass(window[shaderName], _shader, _shader);
            }
            (ShaderUIL.add(_shader, _proton.uilGroup).setLabel("Tube Shader"),
              _proton.applyToShader(_shader),
              (_this.shader = _shader),
              (function completeShader(shader) {
                let transparent = _proton.uilInput.get("transparent"),
                  depthWrite = _proton.uilInput.get("depthWrite"),
                  depthTest = _proton.uilInput.get("depthTest"),
                  blending = _proton.uilInput.get("blending"),
                  castShadow = _proton.uilInput.get("castShadow"),
                  receiveShadow = _proton.uilInput.get("receiveShadow");
                "boolean" == typeof depthWrite &&
                  (shader.depthWrite = depthWrite);
                "boolean" == typeof depthTest && (shader.depthTest = depthTest);
                "boolean" == typeof transparent &&
                  (shader.transparent = transparent);
                "boolean" == typeof castShadow &&
                  defer((_) => (_this.mesh.castShadow = castShadow));
                "boolean" == typeof receiveShadow &&
                  (shader.receiveShadow = receiveShadow);
                blending && (shader.blending = blending);
              })(_shader));
          })(),
          (function initMesh() {
            let mesh = new Mesh(_geom, _shader);
            ((mesh.frustumCulled = !1),
              _this.add(mesh),
              (_this.mesh = mesh),
              (mesh.visible = !1));
          })(),
          (_this.canEmit = !0));
      })(),
      (this.overrideShader = function (code) {
        let uniforms = Shaders.getShader("ProtonTubesUniforms.fs"),
          main = Shaders.getShader("ProtonTubesMain.fs"),
          movement = (code = code.replace("//uniforms", uniforms))
            .split("//abovespawn")[1]
            .split("//code")[0];
        return (
          (main = main.replace("//main", movement)),
          (main = main.split("main() {")[1].slice(0, -1)),
          (code = code.replace(movement, main))
        );
      }),
      (this.release = function (pos, count = 1, radius = 0, velocity, color) {
        if (!_this.canEmit) return;
        let positions = [],
          velocities = velocity ? [] : null,
          colors = color ? [] : null;
        _proton.spawn.index > _proton.spawn.total - _this.padding &&
          (_proton.spawn.index = -1);
        for (let i = 0; i < count; i++) {
          let x = pos.x + Math.random(-1, 1, 4) * radius,
            y = pos.y + Math.random(-1, 1, 4) * radius,
            z = pos.z + Math.random(-1, 1, 4) * radius;
          for (let j = 0; j < _segments; j++)
            (positions.push(x, y, z),
              velocities && velocities.push(velocity.x, velocity.y, velocity.z),
              colors && colors.push(color.r, color.g, color.b));
        }
        _proton.spawn.emit(positions, velocities, colors);
      }),
      (this.useColor = async function () {
        (await this.ready(),
          await _proton.spawn.useColor(),
          _proton.spawn.applyToShader(_shader));
      }),
      (this.ready = async function () {
        return (await _proton.spawn.ready(), _this.wait("canEmit"));
      }),
      (this.upload = async function () {
        (await _this.wait("mesh"),
          await _this.mesh.geometry.uploadBuffersAsync());
      }),
      (this.uploadSync = async function () {
        (await _this.wait("mesh"), await _this.mesh.upload());
      }));
  }),
  Class(function RenderManager() {
    Inherit(this, Component);
    const _this = this;
    var _hasGLUI,
      _hasMetal,
      _firingEvt,
      _dpr = null,
      _stringSchedules = new Map(),
      _objectSchedules = new WeakMap();
    function getSchedulesMap(evt) {
      return "string" == typeof evt ? _stringSchedules : _objectSchedules;
    }
    function getSchedule(evt) {
      return getSchedulesMap(evt).get(evt);
    }
    function fire(evt, data) {
      let array = getSchedule(evt);
      if (array) {
        let len = array.length;
        for (let i = 0; i < len; i++) {
          let cb = array[i];
          if (!array.markedForDeletion.has(cb)) {
            _firingEvt = evt;
            try {
              data ? cb(data) : cb(Render.TIME, Render.DELTA);
            } catch (error) {
              let errorEvt = {
                callback: cb,
                error: error,
                preventStopRender: !1,
              };
              (Events.emitter._fireEvent(
                Render.RENDER_CALLBACK_ERROR,
                errorEvt,
              ),
                evt.preventStopRender || _this.unschedule(cb, evt));
            }
          }
        }
        ((_firingEvt = void 0),
          array.markedForDeletion.size &&
            (array.markedForDeletion.forEach((_, cb) => {
              array.remove(cb);
            }),
            array.markedForDeletion.clear()));
      }
    }
    function startFrame() {
      fire(_this.FRAME_BEGIN);
    }
    function resizeHandler() {
      _this.renderer && _this.renderer.setSize(Stage.width, Stage.height);
    }
    function getDPR() {
      return window.AURA
        ? Device.pixelRatio
        : GPU.OVERSIZED
          ? 1
          : GPU.lt(0)
            ? Math.min(1.3, Device.pixelRatio)
            : GPU.lt(1)
              ? Math.min(1.8, Device.pixelRatio)
              : GPU.mobileLT(2)
                ? Math.min(2, Device.pixelRatio)
                : GPU.gt(4)
                  ? Math.max(1.5, Device.pixelRatio)
                  : Math.max(1.25, Device.pixelRatio);
    }
    function directRenderCallback(render) {
      _hasGLUI && _hasMetal && GLUI.renderDirect(render);
    }
    ((this.NORMAL = "normal"),
      (this.MAGIC_WINDOW = "magic_window"),
      (this.VR = this.WEBVR = "webvr"),
      (this.AR = this.WEBAR = "webar"),
      (this.RENDER = "RenderManager_render"),
      (this.BEFORE_RENDER = "RenderManager_before_render"),
      (this.POST_RENDER = this.FRAME_END = "RenderManager_post_render"),
      (this.EYE_RENDER = "RenderManager_eye_render"),
      (this.BEFORE_OBJECT_EYE_RENDER =
        "RenderManager_before_object_eye_render"),
      (this.FRAME_BEGIN = "RenderManager_frame_begin"),
      (this.AFTER_LOOPS = "RenderManager_after_loops"),
      (this.NATIVE_FRAMERATE = "RenderManager_native_framerate"),
      (this.READY = "render_gl_ready"),
      (this.initialized = Promise.create()),
      _this.events.sub(Events.RESIZE, resizeHandler),
      (Render.startFrame = startFrame),
      Hydra.ready((_) => {
        ((_hasGLUI = !!window.GLUI), (_hasMetal = !!window.Metal));
      }),
      this.get("DPR", (v) => getDPR()),
      (this.initialize = function (type, params = {}) {
        if (
          (_this.camera && _this.camera.destroy(),
          _this.renderer && _this.renderer.destroy(),
          (type != _this.WEBVR && type != _this.WEBAR) ||
            ((params.xrCompatible = !0),
            (params.alpha = !1),
            window.Ares && (params.alpha = !0),
            window.XRDeviceManager &&
              XRDeviceManager.antialias &&
              (params.antialias = !0)),
          !_this.gl)
        ) {
          let camera = new PerspectiveCamera(
            45,
            Stage.width / Stage.height,
            0.01,
            200,
          );
          ((_this.gl = (function () {
            ("safari" == Device.system.browser &&
              Device.system.browserVersion < 13 &&
              delete params.powerPreference,
              Utils.query("compat") && (params.forceWebGL1 = !0));
            let renderer = new Renderer(params);
            return (
              renderer.setSize(Stage.width, Stage.height),
              renderer.setPixelRatio(getDPR()),
              renderer
            );
          })()),
            (_this.scene = new Scene()),
            (_this.nuke = _this.initClass(
              Nuke,
              Stage,
              Object.assign(
                {
                  renderer: _this.gl,
                  scene: _this.scene,
                  camera: camera,
                  dpr: World.DPR,
                },
                params,
              ),
            )));
        }
        switch (((_dpr = _dpr || World.DPR || 1), type)) {
          case _this.WEBVR:
            ((_this.renderer = _this.initClass(
              VRRenderer,
              _this.gl,
              _this.nuke,
            )),
              (_this.camera = _this.initClass(VRCamera)));
            break;
          case _this.WEBAR:
            ((_this.renderer = _this.initClass(
              ARRenderer,
              _this.gl,
              _this.nuke,
            )),
              (_this.camera = _this.initClass(ARCamera)),
              window.Ares &&
                (document.body.appendChild(_this.gl.domElement),
                (_this.gl.domElement.style.backgroundColor = "transparent"),
                (document.body.style.backgroundColor = "transparent")));
            break;
          case _this.MAGIC_WINDOW:
            ((_this.renderer = _this.initClass(
              MagicWindowRenderer,
              _this.gl,
              _this.nuke,
            )),
              (_this.camera = _this.initClass(VRCamera)));
            break;
          case _this.NORMAL:
            ((_this.renderer = _this.initClass(
              RenderManagerRenderer,
              _this.gl,
              _this.nuke,
            )),
              (_this.camera = _this.initClass(RenderManagerCamera)));
        }
        ((_this.type = type),
          (_this.nuke.camera = _this.camera.worldCamera),
          _this.initialized.resolve());
      }),
      (this.render = function (scene, camera, renderTarget, forceClear) {
        (fire(_this.AFTER_LOOPS),
          _this.type == _this.VR && fire(World.NUKE),
          fire(_this.BEFORE_RENDER),
          _this.renderer.render(
            scene || _this.scene,
            _this.nuke.camera,
            renderTarget,
            forceClear,
            directRenderCallback,
          ),
          _this.events.fire(_this.POST_RENDER),
          fire(_this.POST_RENDER));
      }),
      (this.schedule = function (callback, slot) {
        let schedules = getSchedulesMap(slot),
          array = schedules.get(slot);
        (array ||
          ((array = []),
          (array.markedForDeletion = new Map()),
          schedules.set(slot, array)),
          array.indexOf(callback) >= 0
            ? array.markedForDeletion.delete(callback)
            : array.push(callback));
      }),
      (this.scheduleOne = function (callback, slot) {
        let result;
        "function" != typeof callback &&
          ((slot = callback),
          (result = Promise.create()),
          (callback = result.resolve));
        let array = getSchedule(slot);
        if (array) {
          if (array.find((h) => h.scheduleOneCallback === callback)) return;
        }
        let handler = function () {
          return (
            _this.unschedule(handler, slot),
            callback.apply(this, arguments)
          );
        };
        return (
          (handler.scheduleOneCallback = callback),
          _this.schedule(handler, slot),
          result
        );
      }),
      (this.unschedule = function (callback, slot) {
        const array = getSchedule(slot);
        if (!array) return;
        const index = array.indexOf(callback);
        index < 0 ||
          (_firingEvt
            ? array.markedForDeletion.set(callback, !0)
            : array.splice(index, 1));
      }),
      (this.setSize = function (width, height) {
        (_this.events.unsub(Events.RESIZE, resizeHandler),
          _this.renderer.setSize(width, height));
      }),
      (this.fire = fire));
  }, "static"),
  Class(function RenderManagerCamera() {
    Inherit(this, Component);
    const _this = this;
    ((this.worldCamera = window.THREE
      ? new THREE.PerspectiveCamera(30, Stage.width / Stage.height, 0.1, 1e3)
      : new PerspectiveCamera(30, Stage.width / Stage.height, 0.1, 1e3)),
      _this.events.sub(Events.RESIZE, () => {
        ((_this.worldCamera.aspect = Stage.width / Stage.height),
          _this.worldCamera.updateProjectionMatrix());
      }));
  }),
  Class(function RenderManagerRenderer(_renderer, _nuke) {
    Inherit(this, Component);
    const _this = this;
    var _evt = {};
    ((_nuke.onBeforeProcess = (_) => {
      ((_evt.stage = Stage),
        (_evt.camera = _nuke.camera),
        _this.events.fire(RenderManager.RENDER, _evt));
    }),
      (this.render = function (scene, camera, _1, _2, directRender) {
        ((_nuke.camera = camera),
          _nuke
            ? _nuke.render(directRender)
            : _renderer.render(scene, camera, null, null, directRender));
      }),
      (this.setSize = function (width, height) {
        _renderer.setSize(width, height);
      }));
  }),
  Class(function Frag3D(_name) {
    Inherit(this, Object3D);
    ((this.layout = this.initClass(SceneLayout, _name)),
      (this.uploadSync = function () {}));
  }),
  Class(function FragFXScene(_name) {
    Inherit(this, FXScene);
    const _this = this;
    ((this.layout = this.initClass(SceneLayout, _name)),
      this.scene.add(this.layout.group),
      (this.group = new Group()),
      (this._initFXScene = function (nuke, rtPool, options) {
        for (let key in options) options[key] || delete options[key];
        if (RenderManager.type == RenderManager.WEBVR && !options.vrMode)
          return (
            (_this.onFXSceneVisibility = (bool) => {
              if (bool) {
                _this.group.visible = !0;
                let recurse = (obj) => {
                  if (obj.classRef?.layers)
                    for (let key in obj.classRef.layers) {
                      let layer = obj.classRef.layers[key];
                      !0 === layer.visible &&
                        ((layer.visible = !1), (layer.visible = !0));
                    }
                  obj.children.forEach(recurse);
                };
                _this.group.children.forEach(recurse);
              }
            }),
            void _this.vrWorldMode()
          );
        (options.screenQuad &&
          defer((_) => {
            let shader = _this.initClass(Shader, "ScreenQuad", {
                customCompile: Utils.uuid(),
                depthWrite: !1,
                tMap: { value: _this.rt },
              }),
              mesh = new Mesh(World.QUAD, shader);
            ((mesh.frustumCulled = !1),
              (mesh.renderOrder = -1),
              _this.group.add(mesh));
          }),
          rtPool
            ? _this.create(nuke, rtPool(), options)
            : _this.create(nuke, options));
      }),
      (this.uploadSync = function () {
        return Initializer3D.uploadAll(_this.layout);
      }));
  }),
  Class(
    function SceneLayout(_name, _options = {}) {
      Inherit(this, Object3D);
      const _this = this;
      var _dataStore, _data, _timeline, _breakpoint, _stateData, _gizmo;
      const ZERO = new Vector3();
      var _initializers = [],
        _promises = [],
        _breakpoints = [],
        _folders = {},
        _groups = {},
        _custom = {},
        _meshes = {},
        _exists = {},
        _layers = {},
        _uil = UIL.sidebar,
        _graph,
        _config,
        _groupIndex = 0,
        _groupsSynced = Promise.create();
      function initialize(promise) {
        _promises.push(promise);
      }
      function initGizmo() {
        _options.noGizmo ||
          Utils.query("nogizmo") ||
          RenderManager.type != RenderManager.NORMAL ||
          (_gizmo = _this.initClass(SceneLayoutGizmo));
      }
      function createFolder(name) {
        let folder = new UILFolder(`sl_${_name}_${name}`, {
          label: name,
          closed: !0,
        });
        return (
          folder.hide(),
          (_folders[`sl_${_name}_${name}`] = folder),
          folder
        );
      }
      async function initConfig() {
        let input = InputUIL.create(`CONFIG_sl_${_name}`, _uil);
        (input.add("Animation"),
          input.add("Layout"),
          input.add("Cinema Config"),
          _graph && _graph.addSpecial("Config", `Config (${_name})`, "Config"),
          input.setLabel("Config"));
        let animation = input.get("Animation"),
          layout = input.get("Layout");
        (animation &&
          (await ready(),
          _groupsSynced.then(async () => {
            if (
              ((animation = animation.replace(/^\//g, "")),
              (_this.animation = _this.initClass(
                HierarchyAnimation,
                animation,
                linkObjects,
              )),
              _timeline)
            )
              _this.startRender((_) => {
                ((_this.animation.elapsed = _timeline.elapsed),
                  _this.animation.update());
              });
            else if (_uil) {
              let range = new UILControlRange("Animation", {
                min: 0,
                max: 1,
                step: 0.001,
              });
              (range.onChange((val) => {
                ((_this.animation.elapsed = val), _this.animation.update());
              }),
                _uil.add(range));
            }
            (await _this.animation.ready(), _this.animation.update());
          })),
          layout &&
            (await ready(),
            (_this.layout = _this.initClass(
              HierarchyLayout,
              layout,
              linkObjects,
            )),
            await _this.layout.ready()),
          (_config = input),
          await defer(),
          (_this.configured = !0));
      }
      async function linkObjects(data) {
        let array = [];
        for (let i = 0; i < data.length; i++) {
          let name = data[i].name,
            exists = _this.exists(name);
          exists ||
            "null" == name.toLowerCase() ||
            console.warn(`linkAnimation :: ${name} does not exist`);
          let group = new Group(),
            mesh = exists ? await _this.getLayer(name) : null;
          (mesh &&
            (_this.layout && mesh instanceof Mesh
              ? (mesh._parent.add(group), group.add(mesh))
              : (group = mesh.group || mesh)),
            (group.name = name),
            array.push(group));
        }
        return array;
      }
      async function initGraph() {
        if (_options.noGraph || !window.UILGraph || SceneLayout.noGraph)
          return ((_uil = null), void _groupsSynced.resolve());
        (_graph = UILGraph.instance().getGraph(_name, _this))
          ? (UIL.sidebar.element.show(),
            await _this.ready(),
            _graph.syncVisibility(_layers),
            _graph.syncGroupNames(_groups, _folders),
            _groupsSynced.resolve(),
            Global.PLAYGROUND &&
              Utils.getConstructorName(_this.parent) == Global.PLAYGROUND &&
              _graph.open())
          : _groupsSynced.resolve();
      }
      function ssReflectionsEnabled() {
        if (void 0 !== _this.cachedSSReflections)
          return _this.cachedSSReflections;
        let p = _this,
          has = !1;
        for (; p; ) (p.ssgiEnabled && (has = !0), (p = p.parent));
        return ((_this.cachedSSReflections = has), has);
      }
      function generateScreenSpaceReflectionsPanel(shader) {
        let texturePath = "assets/images/_scenelayout/mask.jpg";
        shader.addUniforms({
          tReflectivity: { value: Utils3D.getTexture(texturePath) },
          tRoughness: { value: Utils3D.getTexture(texturePath) },
          ssReflectivity: { value: 1 },
          ssIORrefl: { value: 1 },
          ssRougness: { value: 0 },
          ssgiIntensity: { value: 1 },
        });
      }
      function initParams() {
        if (
          (_options.rootPath
            ? "/" != _options.rootPath.charAt(_options.rootPath.length - 1) &&
              (_options.rootPath += "/")
            : (_options.rootPath = ""),
          (_this.timeline = _timeline = _options.timeline),
          _timeline && (_timeline.add({ v: 0 }, { v: 1 }, 100, "linear"), _uil))
        ) {
          let range = new UILControlRange("Timeline", {
            min: 0,
            max: 1,
            step: 0.001,
          });
          (range.onChange((val) => {
            ((_timeline.elapsed = val), _timeline.update());
          }),
            _uil.add(range),
            range.hide(),
            _graph && _graph.addSpecial("Timeline", "Timeline"));
        }
        ((_this.baseRenderOrder = _options.baseRenderOrder || 0),
          (_this.data = _options.data),
          (_breakpoint = _options.breakpoint || SceneLayout.breakpoint),
          _options.breakpoint && (_this.localBreakpoint = !0),
          _options.uil && (_uil = _options.uil));
      }
      async function initData() {
        if (
          (await UILStorage.ready(),
          (_dataStore = InputUIL.create(`scenelayout_${_name}`, null)),
          void 0 ===
            (_data = JSON.parse(_dataStore.get("data") || "{}")).layers &&
            (_data.layers = -1),
          (_stateData = await UILGroupBridge.createSceneLayout(_name, _this)),
          _options.perFrame)
        )
          _data.layers > 0 ? createLayers() : (_this.loaded = !0);
        else {
          for (let i = 0, c = _data.layers + 1; i < c; i++)
            initialize(createLayer(i));
          _this.loaded = !0;
        }
      }
      function createShader(shaderName, input, params = {}) {
        let shader;
        try {
          shader = _this.initClass(Shader, shaderName, {
            unique: `Element_${input.id}_${_name}`,
            ...params,
          });
        } catch (e) {
          if ("SceneLayout" === shaderName) throw e;
          return (
            console.error(e, ", replacing with default UV tile."),
            createShader("SceneLayout", input, params)
          );
        }
        if ("SceneLayout" === shaderName || !window[shaderName]) {
          let texturePath = input.getImage("texture");
          (texturePath
            ? texturePath.includes("assets/images") ||
              (texturePath = _options.rootPath + texturePath)
            : (texturePath = "assets/images/_scenelayout/uv.jpg"),
            shader.addUniforms({
              tMap: { value: Utils3D.getTexture(texturePath) },
              uAlpha: { value: 1 },
            }));
        }
        return shader;
      }
      function createLayers() {
        let index = 0,
          renderWorker = new Render.Worker(function () {
            (initialize(createLayer(index)),
              index++ == _data.layers &&
                (renderWorker.stop(), (_this.loaded = !0)));
          }, _options.perFrame);
      }
      function getGroup(name, index) {
        if (!name) return _this.group;
        if (name == _name) return _this.group;
        if (!_groups[name]) {
          let uilGroup = _uil ? createFolder(name) : null;
          uilGroup &&
            (uilGroup.setLabel(`${name} (Group)`),
            _uil.add(uilGroup),
            _graph && _graph.addGroup(uilGroup.id, name));
          let config = InputUIL.create(`GROUP_${_name}_${name}`, uilGroup);
          (config.setLabel("Parameters"),
            config.addToggle("occlusionCulling"),
            _timeline && config.add("tween"),
            config.addToggle("billboard"),
            config.add("breakpoints"),
            config.add("name", "hidden"));
          let breakpoints = config.get("breakpoints");
          breakpoints &&
            (breakpoints = breakpoints.replace(/ /g, "").split(","));
          let breakpoint = breakpoints && _breakpoint ? "-" + _breakpoint : "";
          "-" == breakpoint.charAt(breakpoint.length - 1) && (breakpoint = "");
          let group = new Group();
          ((group.name = name),
            (_groups[name] = group),
            (_layers[name] = group),
            (_exists[name] = "group"),
            (group.prefix = `${name}_${_name}${breakpoint}`));
          let meshUIL = MeshUIL.add(group, uilGroup);
          (meshUIL.setLabel("Mesh"),
            _this.add(group),
            UIL.global && (group._meshUIL = meshUIL),
            uilGroup && (uilGroup.params = config),
            breakpoints && _breakpoints.push(group),
            config.get("billboard") && updateBillboard(!0, mesh));
          let occlusionCulling = config.get("occlusionCulling");
          "boolean" == typeof occlusionCulling &&
            occlusionCulling &&
            _groups[name].generateOcclusionMesh();
          let appState = _stateData.getGroup(index || _groupIndex);
          (appState ||
            ((appState = _stateData.syncGroup(index || _groupIndex, name)),
            _this.flag("needsGroupFixing", !0)),
            _this.flag("needsGroupFixing") &&
              (group.fixStateBinding = appState.id),
            (appState.scene = _name),
            _this.bindState(appState, "name", (name) => {
              ((_groups[name] = group),
                (_layers[name] = group),
                (_exists[name] = "group"));
              for (let key in _layers)
                key != name &&
                  _layers[key] == _layers[name] &&
                  (delete _layers[key],
                  delete _exists[key],
                  delete _groups[key]);
            }),
            _this.bindState(appState, "visible", (bool) => {
              group.visible = bool;
            }),
            _this.bindState(appState, "deleted", (bool) => {
              bool &&
                (delete _groups[name],
                delete _layers[name],
                delete _exists[name],
                group._parent.remove(group));
            }),
            (appState.slGroup = group));
        }
        return (
          void 0 === index &&
            ((_data.groups = _groupIndex),
            _groupIndex++,
            _dataStore.setValue("data", JSON.stringify(_data))),
          _this.flag("needsGroupFixing") && Utils.debounce(healGroups, 100),
          _groups[name]
        );
      }
      function healGroups() {
        _stateData.healGroups(_groupIndex);
      }
      async function createLayer(index, groupName, returnName) {
        let created = !1,
          input,
          id = "number" == typeof index ? index : ++_data.layers,
          graphGroupName = groupName;
        if (graphGroupName) {
          let nameLabel = UILStorage.get(
            `INPUT_GROUP_${_name}_${groupName}_name`,
          );
          nameLabel && (groupName = nameLabel);
        }
        let appState = _stateData.layers[id];
        if (appState?.deleted) return;
        if (
          _this.preventLayerCreation &&
          _this.preventLayerCreation(
            UILStorage.get(`INPUT_Config_${id}_${_name}_name`),
          )
        )
          return;
        let group = _uil ? createFolder(id) : null,
          shader,
          mesh;
        (appState &&
          (_this.bindState(appState, "visible", (bool) => {
            mesh && (mesh.visible = bool);
          }),
          _this.bindState(appState, "parent", async (parentName) => {
            let parent;
            if (
              (await _this.wait((_) => !!mesh),
              parentName?.includes?.("group") &&
                (parent = Number(parentName.split("group_")[1])),
              null == parentName)
            )
              return (
                _this.group.add(mesh),
                (mesh.position.y += 1),
                void (mesh.position.y -= 1)
              );
            if (parentName.includes("_env_")) {
              let groupName = parentName.split("_env_")[1];
              return (
                _groups[groupName].add(mesh),
                (mesh.position.y += 1),
                void (mesh.position.y -= 1)
              );
            }
            if (parentName.startsWith("sl_")) {
              let groupName = parentName.split("_").pop();
              if (isNaN(groupName)) {
                return (
                  _groups[groupName].add(mesh),
                  (mesh.position.y += 1),
                  void (mesh.position.y -= 1)
                );
              }
            }
            if (parent > -1) {
              let obj = _stateData.getGroup(parent);
              (obj?.slGroup && obj.slGroup.add(mesh),
                (mesh.position.y += 1),
                (mesh.position.y -= 1));
            } else _this.group.add(mesh);
          })),
          Hydra.LOCAL &&
            _this.delayedCall((_) => {
              created ||
                console.error(
                  `SceneLayout :: 5 second timer expired creating ${_name} ${input.get("name")}`,
                );
            }, 5e3),
          (input = InputUIL.create(`Config_${id}_${_name}`, group)),
          input.setLabel("Parameters"),
          input
            .add("name", "hidden")
            .add("sortIndex", "hidden")
            .addFile("geometry", { relative: "assets/geometry" })
            .addToggle("visible", !0)
            .addToggle("transparent")
            .addToggle("depthWrite", !0)
            .addToggle("depthTest", !0)
            .addToggle("occlusionCulling", !1)
            .addToggle("castShadow")
            .addToggle("receiveShadow")
            .addToggle("receiveLight")
            .addToggle("billboard")
            .addToggle("animates", !0)
            .add("shader")
            .add("custom", null, "customClass")
            .add("script", null, "scriptClass")
            .add("wildcard")
            .add("renderOrder", "hidden")
            .add("group", "hidden")
            .add("breakpoints")
            .addSelect("side", [
              { label: "Front Side", value: "shader_front_side" },
              { label: "Back Side", value: "shader_back_side" },
              { label: "Double Side", value: "shader_double_side" },
              {
                label: "Double Side Transparent",
                value: "shader_double_side_trasparency",
              },
            ])
            .addSelect("blending", [
              { label: "Normal", value: "shader_normal_blending" },
              { label: "Additive", value: "shader_additive_blending" },
              {
                label: "Premultiplied Alpha",
                value: "shader_premultiplied_alpha_blending",
              },
            ]),
          window.FX.ScreenSpaceRaytracer && input.addToggle("ssgi"),
          (input.name = _name),
          (input.prefix = `Element_${id}_${_name}`),
          (input.id = id),
          group && (group.params = input),
          _timeline && input.addToggle("tween"),
          _options.physics &&
            (input.addToggle("physics"),
            input.add("physicsCode"),
            input.addFile("physicsBounds", { relative: "assets/geometry" })));
        let name = input.get("name") || id,
          shaderName = input.get("shader") || "SceneLayout",
          geomPath = input.getFilePath("geometry"),
          visible = input.get("visible"),
          transparent = input.get("transparent"),
          depthWrite = input.get("depthWrite"),
          depthTest = input.get("depthTest"),
          occlusionCulling = input.get("occlusionCulling"),
          billboard = input.get("billboard"),
          animates = input.get("animates"),
          doTween = input.get("tween"),
          renderOrder = input.getNumber("renderOrder"),
          blending = input.get("blending"),
          side = input.get("side"),
          physics = input.get("physics"),
          castShadow = input.get("castShadow"),
          receiveShadow = input.get("receiveShadow"),
          receiveLight = input.get("receiveLight"),
          ssReflections = input.get("ssgi");
        (ssReflections && !ssReflectionsEnabled() && (ssReflections = !1),
          appState &&
            ((appState.scene = _name),
            _this.bindState(appState, "sortIndex", async (index) => {
              if ((mesh || (await _this.wait((_) => mesh)), appState.parent)) {
                let [fraction, groupSortIndex] =
                    await _stateData.calculateRenderFraction(id),
                  renderOrder =
                    _this.baseRenderOrder + groupSortIndex + fraction;
                (input.setValue(
                  "renderOrder",
                  renderOrder - _this.baseRenderOrder,
                ),
                  (mesh.renderOrder = renderOrder),
                  mesh.classRef?.setRenderOrder &&
                    mesh.classRef.setRenderOrder(renderOrder));
              } else {
                let renderOrder = _this.baseRenderOrder + index;
                (input.setValue(
                  "renderOrder",
                  renderOrder - _this.baseRenderOrder,
                ),
                  input.setValue("sortIndex", index),
                  (mesh.renderOrder = renderOrder),
                  mesh.classRef?.setRenderOrder &&
                    mesh.classRef.setRenderOrder(renderOrder));
              }
            })));
        let breakpoints = input.get("breakpoints");
        breakpoints && (breakpoints = breakpoints.replace(/ /g, "").split(","));
        let breakpoint = breakpoints && _breakpoint ? "-" + _breakpoint : "";
        ("-" == breakpoint.charAt(breakpoint.length - 1) && (breakpoint = ""),
          name && group && group.setLabel(name),
          groupName && input.setValue("group", groupName));
        let groupParent = getGroup(input.get("group"));
        if (group) {
          let groupName = input.get("group"),
            groupId = groupName
              ? `sl_${_name}_${graphGroupName || groupName}`
              : void 0;
          _graph && _graph.addLayer(group.id, name || id + "", groupId);
        }
        if ((_uil && _uil.add(group), "ignore" == name)) return (created = !0);
        let customClass = input.get("custom") || input.get("customClass"),
          scriptClass = input.get("script") || input.get("scriptClass"),
          customCompile;
        if (
          (shaderName.includes("|") &&
            ([shaderName, customCompile] = shaderName.split("|")),
          (_exists[name] = customClass ? "custom" : "mesh"),
          customClass)
        ) {
          if (customClass === _this.parent.constructor.name)
            return console.warn(
              `Tried to recursively initialize ${customClass}`,
            );
          if (!window[customClass])
            return console.warn(
              `Tried to initialize ${customClass} but it doesn't  exist!`,
            );
          let obj = _this.initClass(
            window[customClass],
            input,
            group,
            id,
            null,
          );
          if (
            ((mesh = obj.group),
            (obj.wildcard = input.get("wildcard")),
            (obj.animates = input.get("animates")),
            "boolean" == typeof visible && mesh && (mesh.visible = visible),
            (_custom[name] = obj),
            (_layers[name] = obj),
            appState &&
              _this.bindState(appState, "name", (name) => {
                ((_layers[name] = obj), (_exists[name] = "custom"));
                for (let key in _layers)
                  key != name &&
                    _layers[key] == _layers[name] &&
                    (delete _layers[key], delete _exists[key]);
              }),
            _this.onCreateLayer)
          ) {
            let capture = (cb) => (
              _this.delayedCall((_) => cb(obj, name), 32),
              !0
            );
            if (!0 === _this.onCreateLayer(name, group, capture)) return;
          }
          if (
            (obj.group &&
              (groupParent.add(obj.group),
              groupParent &&
                groupParent.fixStateBinding &&
                (appState.parent = groupParent.fixStateBinding)),
            (obj.renderOrder = _this.baseRenderOrder + renderOrder),
            mesh)
          ) {
            let meshUIL;
            (obj.camera ||
              ((mesh.prefix = `Element_${id}_${_name}${breakpoint}`),
              (meshUIL = MeshUIL.add(mesh, group)),
              meshUIL.setLabel("Mesh"),
              UIL.global && (mesh._meshUIL = meshUIL)),
              breakpoints && _breakpoints.push(mesh),
              scriptClass &&
                !1 !== visible &&
                (scriptClass.includes(",")
                  ? ((scriptClass = scriptClass.replace(/ /g, "").split(",")),
                    scriptClass.forEach((script) => {
                      window[script]
                        ? ((mesh.scriptClass = mesh.scriptClass || []),
                          mesh.scriptClass.push(
                            _this.initClass(
                              window[script],
                              mesh,
                              shader,
                              group,
                              input,
                            ),
                          ))
                        : console.warn(`scriptClass ${script} not found`);
                    }))
                  : window[scriptClass]
                    ? (mesh.scriptClass = _this.initClass(
                        window[scriptClass],
                        mesh,
                        shader,
                        group,
                        input,
                      ))
                    : console.warn(`scriptClass ${scriptClass} not found`)),
              UIL.global &&
                (mesh._sceneLayout = input._sceneLayout =
                  {
                    meshUIL: meshUIL,
                    mesh: mesh,
                    shader: shader,
                    name: name,
                    input: input,
                  }));
          }
          return ((created = !0), input);
        }
        if (_this.onCreateLayer) {
          let capture = (cb) => {
            let mesh = new Group();
            return (
              (mesh.prefix = `Element_${id}_${_name}${breakpoint}`),
              MeshUIL.add(mesh, group),
              (_meshes[name] = mesh),
              (_layers[name] = mesh),
              _this.delayedCall((_) => cb(mesh, name), 32),
              (created = !0),
              !0
            );
          };
          if (!0 === _this.onCreateLayer(name, group, capture))
            return (created = !0);
        }
        let geom = World.PLANE;
        (geomPath &&
          geomPath.includes(["World", "SceneLayout"]) &&
          ((geom = eval(geomPath)), (geomPath = null)),
          shaderName.includes(".shader") &&
            ((shader = await resolveShaderRef(shaderName, name)),
            shader || (shaderName = "SceneLayout")),
          shader ||
            (shaderName.includes("PBR")
              ? (shader = _this.initClass(PBRShader, shaderName, {
                  unique: `Element_${id}_${_name}`,
                }))
              : ((shader = createShader(shaderName, input, {
                  customCompile: customCompile,
                  ssReflections: ssReflections,
                })),
                defer((_) => {
                  for (let key in shader.uniforms) {
                    let uniform = shader.uniforms[key];
                    uniform &&
                      uniform.value instanceof Texture &&
                      initialize(uniform.value.promise);
                  }
                }))),
          "boolean" == typeof depthWrite && (shader.depthWrite = depthWrite),
          "boolean" == typeof depthTest && (shader.depthTest = depthTest),
          "boolean" == typeof transparent && (shader.transparent = transparent),
          ssReflections && generateScreenSpaceReflectionsPanel(shader),
          _this.onCreateGeometry &&
            (geomPath = _this.onCreateGeometry(
              geomPath,
              input.get("wildcard"),
            )));
        let gltfNodes = null;
        if (geomPath)
          if (
            String(geomPath).indexOf(".glb") > 0 ||
            String(geomPath).indexOf(".gltf") > 0
          ) {
            let loader = new GLTFLoader();
            ((gltfNodes = await loader.parse(geomPath, _this, name)),
              (geom = new PlaneGeometry(0, 0)));
          } else geom = await GeomThread.loadGeometry(geomPath);
        if (
          ((mesh = new Mesh(geom, shader)),
          "boolean" == typeof occlusionCulling &&
            (mesh.occlusionCulled = occlusionCulling),
          gltfNodes)
        )
          for (let i = 0; i < gltfNodes.length; i++) mesh.add(gltfNodes[i]);
        ("boolean" == typeof _options.frustumCulled &&
          (mesh.frustumCulled = _options.frustumCulled),
          "boolean" == typeof visible && (mesh.visible = visible),
          groupParent.add(mesh),
          groupParent.fixStateBinding &&
            (appState.parent = groupParent.fixStateBinding),
          (mesh.prefix = `Element_${id}_${_name}${breakpoint}`),
          (mesh.uilName = name),
          (mesh.uilGroup = group),
          (mesh.uilGraph = _graph),
          (mesh.wildcard = input.get("wildcard")),
          (mesh.animates = input.get("animates")));
        let meshUIL = MeshUIL.add(mesh, group);
        if (
          (meshUIL.setLabel("Mesh"),
          UIL.global && (mesh._meshUIL = meshUIL),
          physics)
        ) {
          let path = input.getFilePath("physicsBounds"),
            obj;
          if (path) {
            const shapes = await PhysicsBounds.parsePhysicsBoundsShapes(
              Assets.getPath(path),
            );
            shapes &&
              (obj = Physics.instance().createFromShapes(shapes, {}, mesh));
          }
          (obj || (obj = Physics.instance().create(mesh)),
            (obj.prefix = `Physics_${id}_${_name}`),
            PhysicsUIL.add(obj, group).setLabel("Physics"));
          let physicsCodeClassName = input.get("physicsCode"),
            physicsCodeClass;
          (physicsCodeClassName &&
            ((physicsCodeClass = window[physicsCodeClassName]),
            physicsCodeClass ||
              console.warn(
                `physicsCode class ${physicsCodeClassName} not found`,
              )),
            physicsCodeClass &&
              _this.initClass(physicsCodeClass, obj, mesh, group, input));
        }
        if (
          ((_meshes[name] = mesh),
          (_layers[name] = mesh),
          appState &&
            _this.bindState(appState, "name", (name) => {
              ((_layers[name] = mesh),
                (_exists[name] = customClass ? "custom" : mesh));
              for (let key in _layers)
                key != name &&
                  _layers[key] == _layers[name] &&
                  (delete _layers[key], delete _exists[key]);
            }),
          breakpoints && _breakpoints.push(mesh),
          (mesh.renderOrder = _this.baseRenderOrder + (renderOrder || 0)),
          billboard && updateBillboard(!0, mesh),
          "SceneLayout" != shaderName &&
            window[shaderName] &&
            (mesh.shaderClass = _this.initClass(
              window[shaderName],
              mesh,
              shader,
              group,
              input,
            )),
          shader._copied ||
            (shader !== mesh.shader && !shaderName.includes("PBR")) ||
            ShaderUIL.add(shader, group).setLabel("Shader"),
          shader._copied &&
            shader._copied.shaderClass &&
            shader._copied.shaderClass.applyClone &&
            shader._copied.shaderClass.applyClone(mesh),
          "number" != typeof index &&
            _dataStore.setValue("data", JSON.stringify(_data)),
          blending && (shader.blending = blending),
          side && (shader.side = side),
          castShadow && (mesh.castShadow = castShadow),
          (receiveShadow = receiveShadow || Shader.shouldReceiveShadow(shader)),
          receiveShadow && (shader.receiveShadow = receiveShadow),
          receiveLight && (shader.receiveLight = receiveLight),
          scriptClass &&
            (scriptClass.includes(",")
              ? ((scriptClass = scriptClass.replace(/ /g, "").split(",")),
                scriptClass.forEach((script) => {
                  window[script]
                    ? ((mesh.scriptClass = mesh.scriptClass || []),
                      mesh.scriptClass.push(
                        _this.initClass(
                          window[script],
                          mesh,
                          shader,
                          group,
                          input,
                        ),
                      ))
                    : console.warn(`scriptClass ${script} not found`);
                }))
              : window[scriptClass]
                ? (mesh.scriptClass = _this.initClass(
                    window[scriptClass],
                    mesh,
                    shader,
                    group,
                    input,
                  ))
                : console.warn(`scriptClass ${scriptClass} not found`)),
          (input.onUpdate = (key) => {
            switch (key) {
              case "name":
                break;
              case "visible":
                mesh.visible = input.get(key);
                break;
              case "renderOrder":
                mesh.renderOrder = _this.baseRenderOrder + input.getNumber(key);
                break;
              case "transparent":
                shader.transparent = input.get(key);
                break;
              case "depthWrite":
                shader.depthWrite = input.get(key);
                break;
              case "depthTest":
                shader.depthTest = input.get(key);
                break;
              case "side":
                shader.side = input.get(key);
                break;
              case "blending":
                shader.blending = input.get(key);
                break;
              case "geometry":
                updateGeometry(input.getFilePath(key), mesh);
                break;
              case "shader":
                updateShader(input.get(key), mesh, group, input);
                break;
              case "scriptClass":
                updateScriptClass(input.get(key), mesh, group, input);
                break;
              case "receiveShadow":
                updateShadow(input.get(key), mesh);
                break;
              case "receiveLight":
                updateLighting(input.get(key), mesh);
                break;
              case "billboard":
                updateBillboard(input.get(key), mesh);
            }
            UIL.global &&
              ((World.SCENE.displayNeedsUpdate = !0),
              window?.view?.scene && (view.scene.displayNeedsUpdate = !0));
          }),
          Hydra.LOCAL && Global.PLAYGROUND)
        ) {
          _this.events.sub(SceneLayout.HOTLOAD_GEOMETRY, ({ file: file }) => {
            mesh.geometry?._src?.includes(file) && updateGeometry(file, mesh);
          });
          const scriptClassNeedsUpdate = (inst, file) => (
            inst.__cacheName ||
              (inst.__cacheName = Utils.getConstructorName(inst)),
            !!file.includes(inst.__cacheName) && inst.__cacheName
          );
          _this.events.sub(SceneLayout.HOTLOAD_SCRIPT, ({ file: file }) => {
            if (
              (file.includes(mesh.shader?.vsName) &&
                ((shader.hotReloading = !0),
                "SceneLayout" !== shaderName &&
                  window[shaderName] &&
                  (mesh.shaderClass = _this.initClass(
                    window[shaderName],
                    mesh,
                    shader,
                    group,
                    input,
                  )),
                group.remove(shader.UILPrefix),
                delete ShaderUIL.exists[shader.UILPrefix],
                ShaderUIL.add(shader, group).setLabel("Shader"),
                (shader.hotReloading = !1)),
              mesh.scriptClass)
            )
              if (Array.isArray(mesh.scriptClass))
                mesh.scriptClass.every((inst, index) => {
                  let name = scriptClassNeedsUpdate(inst, file);
                  return (
                    !name ||
                    (mesh.scriptClass.remove(inst),
                    updateScriptClass(name, mesh, group, input),
                    !1)
                  );
                });
              else {
                let name = scriptClassNeedsUpdate(mesh.scriptClass, file);
                name && updateScriptClass(name, mesh, group, input);
              }
          });
        }
        return (
          UIL.global &&
            (mesh._sceneLayout = input._sceneLayout =
              {
                meshUIL: meshUIL,
                mesh: mesh,
                input: input,
                name: name,
                get shaderUIL() {
                  return this.mesh.shader.shaderUIL;
                },
              }),
          (created = !0),
          returnName ? name : input
        );
      }
      async function updateGeometry(geomPath, mesh) {
        let geom = World.PLANE;
        (geomPath && geomPath.includes(["World", "SceneLayout"])
          ? ((geom = eval(geomPath)), (geomPath = null))
          : geomPath &&
            (geom = await GeomThread.loadGeometry(
              geomPath + "?" + Utils.timestamp(),
            )),
          (mesh.geometry = geom));
      }
      async function resolveShaderRef(shaderName, layerName) {
        let shaderLayer = shaderName.split(".shader")[0],
          promise = _this.getLayer(shaderLayer);
        Hydra.LOCAL &&
          (promise = Promise.race([
            promise,
            (async () => {
              await _this.loadedAllLayers();
            })(),
          ]));
        let layer = await promise;
        if (layer) {
          let shader = layer.shader;
          return ((shader._copied = layer), shader);
        }
        Hydra.LOCAL &&
          console.error(
            `Couldn’t find shader “${shaderName}” for layer “${layerName}” in SceneLayout “${_name}”, because layer “${shaderLayer}” doesn't exist`,
          );
      }
      async function updateShader(shaderName = "", mesh, group, input) {
        let shader;
        (shaderName.includes(".shader") &&
          ((shader = await resolveShaderRef(shaderName, mesh.uilName)),
          shader || (shaderName = "SceneLayout")),
          shader ||
            (shader = shaderName.includes("PBR")
              ? _this.initClass(PBRShader, shaderName, {
                  unique: `Element_${input.id}_${_name}`,
                })
              : createShader(shaderName, input)),
          group.remove(mesh.shader.UILPrefix));
        for (let key in mesh.shader.uniforms) {
          if ("t" === mesh.shader.uniforms[key].type)
            try {
              mesh.shader.shaderUIL.copyTexture(key, shader);
            } catch (e) {
              console.error(e);
            }
        }
        ((mesh.shader = shader),
          "SceneLayout" !== shaderName &&
            window[shaderName] &&
            (mesh.shaderClass = _this.initClass(
              window[shaderName],
              mesh,
              shader,
              group,
              input,
            )),
          ShaderUIL.add(shader, group).setLabel("Shader"));
      }
      function updateLighting(bool, mesh) {
        ((mesh.shader.customCompile = Utils.uuid()),
          (mesh.shader.receiveLight = bool),
          mesh.shader.resetProgram(),
          mesh.shader.upload());
      }
      function updateShadow(bool, mesh) {
        ((mesh.shader.customCompile = Utils.uuid()),
          (mesh.shader.receiveShadow = bool),
          mesh.shader.resetProgram(),
          mesh.shader.upload());
      }
      function updateBillboard(bool, mesh) {
        bool
          ? ((mesh._billboardLoop = (_) => Utils3D.billboard(mesh)),
            _this.startRender(mesh._billboardLoop))
          : (mesh.rotation.set(0, 0, 0), _this.stopRender(mesh._billboardLoop));
      }
      function updateScriptClass(scriptClass, mesh, group, input) {
        scriptClass &&
          (scriptClass.includes(",")
            ? (scriptClass = scriptClass.replace(/ /g, "").split(",")).forEach(
                (script) => {
                  window[script]
                    ? ((mesh.scriptClass = mesh.scriptClass || []),
                      mesh.scriptClass.push(
                        _this.initClass(
                          window[script],
                          mesh,
                          mesh.shader,
                          group,
                          input,
                        ),
                      ))
                    : console.warn(`scriptClass ${script} not found`);
                },
              )
            : window[scriptClass]
              ? (mesh.scriptClass = _this.initClass(
                  window[scriptClass],
                  mesh,
                  mesh.shader,
                  group,
                  input,
                ))
              : console.warn(`scriptClass ${scriptClass} not found`));
      }
      function addListeners() {
        _this.events.sub(SceneLayout.BREAKPOINT, (e) =>
          _this.localBreakpoint ? null : setBreakpoint(e),
        );
      }
      function setBreakpoint({ value: value }) {
        value != _breakpoint &&
          ((_breakpoint = value),
          _breakpoints.forEach((mesh) => {
            if (!mesh.prefix) return;
            ((mesh.prefix = mesh.prefix.split("-")[0] + "-" + _breakpoint),
              "-" == mesh.prefix.charAt(mesh.prefix.length - 1) &&
                (mesh.prefix = mesh.prefix.slice(0, -1)));
            let meshUIL = new MeshUILConfig(mesh);
            UIL.global && (mesh._meshUIL = meshUIL);
          }));
      }
      async function ready() {
        (await _this.wait(_this, "loaded"),
          UIL.sidebar && UIL.sidebar.toolbar.hideAll());
      }
      function copyFolderProps(from, to) {
        let mesh, params, shader;
        to.forEachFolder((child) => {
          switch (child.label) {
            case "Parameters":
              params = child;
              break;
            case "Mesh":
              mesh = child;
              break;
            case "Shader":
              shader = child;
          }
        });
        let allowed = ["Parameters", "Mesh", "Shader"];
        from.forEachFolder((child) => {
          if (!(allowed.indexOf(child.label) < 0))
            switch ((child.toClipboard(), child.label)) {
              case "Parameters":
                params.fromClipboard();
                break;
              case "Mesh":
                mesh.fromClipboard();
                break;
              case "Shader":
                shader.fromClipboard();
            }
        });
      }
      ((this.isSceneLayout = !0),
        (this.name = _name),
        (async function () {
          (window.Physics && (_options.physics = !0),
            (_this.group.sceneLayout = _this),
            await initialize(defer()),
            SceneLayout.getTexture ||
              (SceneLayout.getTexture = Utils3D.getTexture),
            initGraph(),
            initParams(),
            initialize(initConfig()),
            initData(),
            addListeners(),
            ready(),
            UIL.global && initGizmo());
        })(),
        (this.ready = async function (early) {
          if (
            (await _this.wait(_this, "loaded"),
            await _this.wait(_this, "configured"),
            early)
          )
            return !0;
          (await defer(), await defer());
        }),
        (this.getLayer = async function (name) {
          let timer;
          return (
            Hydra.LOCAL &&
              (timer = _this.delayedCall((_) => {
                _exists[name] ||
                  console.warn(`${name} doesn't exist in SceneLayout ${_name}`);
              }, 1e3)),
            await _this.wait(_layers, name),
            timer && clearTimeout(timer),
            _layers[name]
          );
        }),
        (this.getLayers = async function () {
          let array = [];
          for (let i = 0; i < arguments.length; i++)
            array.push(_this.getLayer(arguments[i]));
          return Promise.all(array);
        }),
        (this.getAllLayers = async function () {
          return (await this.ready(), await this.loadedAllLayers(), _layers);
        }),
        (this.getAllMatching = async function (label) {
          let layers = await _this.getAllLayers(),
            array = [];
          for (let key in layers)
            key.includes(label) &&
              ((layers[key].layerName = key), array.push(layers[key]));
          return array;
        }),
        (this.exists = function (name) {
          return _exists[name];
        }),
        (this._createLayer = function (parentId, returnName = !1) {
          return createLayer(null, parentId, returnName);
        }),
        (this._createGroup = function () {
          return (getGroup(`group_${_groupIndex}`), _groupIndex);
        }),
        (this._deleteGroup = function () {}),
        (this._getGroup = function (name, index) {
          return getGroup(name, index);
        }),
        (this._rename = function (id, name, value) {
          let folder = _folders[id] || _folders[`sl_${_name}_${id}`];
          folder &&
            (folder.setLabel(value),
            folder.params && folder.params.setValue("name", value),
            [_groups, _custom, _meshes, _exists, _layers].forEach(
              function (store) {
                store[name] &&
                  ((store[value] = store[name]),
                  (store[name] = null),
                  delete store[name]);
              },
            ));
        }),
        (this._deleteLayer = function (id, name, coded) {
          id.includes("_") && (id = (id = id.split("_"))[id.length - 1]);
          let folder = _folders[id] || _folders[`sl_${_name}_${id}`],
            layer = _layers[id] || _layers[name];
          return layer && layer.isGroup && layer.length > 1
            ? (alert("Can't delete a group that has nested layers."), !1)
            : !(
                !coded &&
                !confirm("Are you sure you want to delete this layer?")
              ) &&
                (layer &&
                  layer._parent &&
                  (layer._parent.remove(layer), (layer._parent = null)),
                folder && folder.parent && folder.parent.remove(folder),
                UILStorage.set(`sl_${_name}_${id}_deleted`, !0),
                !0);
        }),
        (this._changeParent = function (
          childId,
          childName,
          parentId,
          parentName,
        ) {
          let child = _layers[childId] || _layers[childName],
            parent = _layers[parentId] || _layers[parentName] || _this;
          if (!child) return;
          let folder =
            _folders[childId] || _folders[`sl_${_name}_${childName}`];
          folder &&
            folder.params &&
            folder.params.setValue("group", parentName || null);
          let parentObject = parent.group || parent,
            childObject = child.group || child;
          (parentObject.isObject3D &&
            childObject.isObject3D &&
            parentObject.add(childObject),
            child.updateMatrix && child.updateMatrix());
        }),
        (this._visible = function (name, visible) {
          let mesh = _layers[name];
          mesh && (mesh.group && (mesh = mesh.group), (mesh.visible = visible));
        }),
        (this._focus = function (name) {
          UIL.sidebar.toolbar.filterSingle(name);
        }),
        (this._blur = function (name) {
          let folder = _folders[name] || _folders[`sl_${_name}_${name}`];
          folder &&
            folder.forEachFolder &&
            (folder.forEachFolder((f) => f.close()), folder.close());
        }),
        (this._sort = function (order) {
          order.forEach((label, index) => {
            label.children &&
              label.children.forEach(function (child, j, all) {
                let folder = _folders[child];
                if (!folder || !folder.params) return;
                let renderOrder =
                  _this.baseRenderOrder + index + (j + 1) / (all.length + 1);
                folder.params.setValue(
                  "renderOrder",
                  renderOrder - _this.baseRenderOrder,
                );
                let mesh = _layers[child] || _layers[folder.label];
                mesh && (mesh.renderOrder = renderOrder);
              });
            let folder = _folders[label];
            if (!folder || !folder.params) return;
            let renderOrder = _this.baseRenderOrder + index;
            folder.params.setValue(
              "renderOrder",
              renderOrder - _this.baseRenderOrder,
            );
            let mesh = _layers[label] || _layers[folder.label];
            mesh && (mesh.renderOrder = renderOrder);
          });
        }),
        (this._duplicateLayer = function (id, parentId) {
          let folder = _folders[id] || _folders[`sl_${_name}_${id}`];
          if (!folder) return;
          createLayer(null, parentId);
          let copyShader,
            copy = Object.values(_folders).last();
          (folder.forEachControl((input) => {
            "shader" === input.label && (copyShader = input.value);
          }),
            copyShader &&
              (console.log(copyShader),
              copy.forEachControl((input) => {
                "shader" === input.label && input.force(copyShader);
              })),
            copyFolderProps(folder, copy));
        }),
        (this._duplicateGroup = function (id, children) {
          let folder = _folders[id] || _folders[`sl_${_name}_${id}`];
          if (!folder) return;
          let copyId = `group_${_groupIndex + 1}`;
          (getGroup(copyId),
            copyFolderProps(folder, Object.values(_folders).last()),
            children.forEach((childId) => {
              _this._duplicateLayer(childId, copyId);
            }));
        }),
        (this._getCinemaConfig = async function () {
          let _cinemaConfig = _config.get("Cinema Config").replace(".json", "");
          return await get(
            Assets.getPath(`assets/geometry/${_cinemaConfig}.json`),
          );
        }),
        (this._applyCinemaConfig = function (id, params) {
          let folder = _folders[id] || _folders[`sl_${_name}_${id}`];
          if (!folder) return;
          let mesh = folder.getAll().filter((sub) => "Mesh" == sub.label)[0];
          if (
            (params.geometry &&
              folder.params.setValue(
                "geometry",
                params.geometry.replace("assets/geometry/", ""),
              ),
            ["position", "quaternion", "scale"].forEach((transform) => {
              if (params[transform]) {
                let value = JSON.parse(params[transform]);
                if ("quaternion" == transform) {
                  let quat = new Quaternion().fromArray(value);
                  ((value = new Euler()
                    .setFromQuaternion(quat)
                    .toArray()
                    .slice(0, 3)
                    .map((angle) => (180 * angle) / Math.PI)),
                    (transform = "rotation"));
                }
                mesh
                  .getAll()
                  .filter((control) => control.label == transform)[0]
                  .force(value);
              }
            }),
            params.visible &&
              "false" === params.visible &&
              !params.geometry &&
              (folder.params.setValue("geometry", "World.PLANE"),
              folder.params.setValue("side", "shader_double_side"),
              !Global.PLAYGROUND))
          ) {
            _meshes[folder.params.get("name")].shader.neverRender = !0;
          }
          params.shader && folder.params.setValue("shader", params.shader);
        }),
        (this.loadedAllLayers = async function () {
          return (await _this.ready(), Promise.catchAll(_promises));
        }),
        this.set("breakpoint", (value) => {
          ((_this.localBreakpoint = !0), setBreakpoint({ value: value }));
        }),
        this.get("breakpoint", (_) => _breakpoint),
        this.get("layers", (_) => _layers),
        this.get("layerCount", (_) => _data.layers),
        (this.onDestroy = function () {
          (_graph?.destroy?.(),
            _this.textures &&
              !_options.persistTextures &&
              _this.textures.forEach((t) => {
                t.destroy && t.destroy();
              }));
        }),
        (this.addInitializer = function (callback) {
          _initializers.push(callback);
        }),
        (this._completeInitialization = async function (sync) {
          if (!_initializers.length) return !0;
          for (let i = 0; i < _initializers.length; i++)
            await _initializers[i](sync);
          _initializers.length = 0;
        }));
    },
    (_) => {
      ((SceneLayout.BREAKPOINT = "sl_breakpoint"),
        (SceneLayout.HOTLOAD_GEOMETRY = "sl_hotload_geom"),
        (SceneLayout.HOTLOAD_SCRIPT = "sl_hotload_script"),
        (SceneLayout.setBreakpoint = function (value) {
          SceneLayout.breakpoint !== value &&
            ((SceneLayout.breakpoint = value),
            Events.emitter._fireEvent(SceneLayout.BREAKPOINT, {
              value: value,
            }));
        }));
    },
  ),
  Class(function SceneLayoutGizmo() {
    Inherit(this, Object3D);
    const _this = this;
    var _controls, _update, _attached, _lastVal;
    function findCamera() {
      let camera = World.CAMERA,
        p = _this.group._parent;
      for (; p; )
        (p instanceof Scene && p.nuke && (camera = p.nuke.camera),
          (p = p._parent));
      return camera;
    }
    function update() {
      let uil = _attached._cameraUIL || _attached._meshUIL,
        key = "translate" == _controls.getMode() ? "position" : "scale",
        value = _attached[key].toArray();
      (function same(a, b) {
        return !(
          !a ||
          !b ||
          Math.abs(a[0] - b[0]) > Base3D.DIRTY_EPSILON ||
          Math.abs(a[1] - b[1]) > Base3D.DIRTY_EPSILON ||
          Math.abs(a[2] - b[2]) > Base3D.DIRTY_EPSILON
        );
      })(value, _lastVal) ||
        ((_lastVal = value),
        _attached._cameraUIL && "position" == key && (key = "groupPos"),
        uil?.[`forceUpdate${key.toUpperCase()}`]?.(value));
    }
    function startMoving() {
      _update = setInterval(update, 250);
    }
    function stopMoving() {
      (clearInterval(_update), update());
    }
    function keyDown(e) {
      document.activeElement.tagName
        .toLowerCase()
        .includes(["textarea", "input"]) ||
        ("." == e.key && _controls.setMode("translate"),
        "/" == e.key && _controls.setMode("scale"),
        ("=" != e.key && "+" != e.key) ||
          (_controls.visible = !_controls.visible));
    }
    function playgroundEvent(camera) {
      (camera || ((_controls.visible = !1), (camera = findCamera())),
        (_controls.camera = camera));
    }
    async function nodeFocused(e) {
      if (
        ((_controls.visible = !1),
        "Config" != e.name && e.layoutInstance == _this.parent)
      ) {
        let layer = await _this.parent.getLayer(e.name),
          group = layer.group || layer;
        if (!group || !group.updateMatrixWorld) return;
        (_controls.attach(group),
          (_attached = group),
          (_controls.visible = !0));
      }
    }
    ((this.isGizmo = !0),
      ((_controls = new TransformControls(
        findCamera(),
        World.ELEMENT.div,
      )).onChange =
        _controls.onMouseDown =
        _controls.onMouseUp =
        _controls.onObjectChange =
          (e) => {}),
      (_controls.onMouseDown = startMoving),
      (_controls.onMouseUp = stopMoving),
      (_controls.draggingChanged = (e) => {
        let activeControls = Playground.instance().activeControls;
        activeControls && (activeControls.enabled = !e.value);
      }),
      SceneLayoutGizmo.initialized
        ? (_controls.visible = !1)
        : (SceneLayoutGizmo.initialized = !0),
      _this.group.add(_controls),
      AppState.bind("playground_camera_active", playgroundEvent),
      (function addListeners() {
        (_this.events.sub(Keyboard.DOWN, keyDown),
          _this.events.sub(UILGraphNode.FOCUSED, nodeFocused));
      })(),
      _this.delayedCall((_) => {
        _controls.camera = findCamera();
      }, 500),
      _this.group.traverse((obj) => {
        obj.isGizmo = !0;
      }),
      (_this.group.visible = !1));
  }),
  Class(function SceneLayoutPreloader(_name) {
    Inherit(this, Component);
    function findMatch(src, arr) {
      return (
        !(!src || src.startsWith(".")) &&
        ((src = src.trim()).startsWith("/") && (src = src.slice(1)),
        arr.find(({ filename: filename }) => filename.includes(src)))
      );
    }
    this.load = function (name) {
      let promise = Promise.create(),
        array = [],
        keys = UILStorage.getKeys(),
        i = 0,
        worker = new Render.Worker((_) => {
          let key = keys[i];
          if (!key)
            return (
              worker.stop(),
              void Promise.all(array).then(promise.resolve)
            );
          if (key.includes(name)) {
            let val = UILStorage.get(key);
            if (!val || !val.includes) return i++;
            if (
              (key.includes("geometry") &&
                ("{" == val.charAt(0) && (val = JSON.parse(val).src),
                val.includes(".json") ||
                  val.includes(".bin") ||
                  (val += ".json"),
                val.includes("assets/") || (val = "assets/geometry/" + val),
                findMatch(
                  val.split("assets/geometry/")[1],
                  UIL_ASSETS_GEOMETRIES,
                ) &&
                  array.push(
                    GeomThread.loadGeometry(Assets.getPath(val), null, !0),
                  )),
              val.includes(".json") || val.includes(".bin"))
            )
              (val.includes("assets/") || (val = "assets/geometry/" + val),
                findMatch(
                  val.split("assets/geometry/")[1],
                  UIL_ASSETS_GEOMETRIES,
                ) && array.push(fetch(Assets.getPath(val)).catch((e) => {})));
            else if (val.includes("src")) {
              let obj = JSON.parse(val),
                src = obj.src;
              if (obj.compressed)
                if ("ktx2" === obj.compressed) {
                  let src0 = src.split(".")[0];
                  src = src0 + ".ktx2";
                } else {
                  let ext,
                    src0 = src.split(".")[0],
                    src1 = src0.split("/");
                  ((ext = Renderer.extensions.etc1
                    ? "astc"
                    : Renderer.extensions.pvrtc
                      ? "pvrtc"
                      : Renderer.extensions.astc
                        ? "astc"
                        : "dxt"),
                    (src =
                      src0 + "/" + src1[src1.length - 1] + "-" + ext + ".ktx"));
                }
              findMatch(src.split("assets/images/")[1], UIL_ASSETS_TEXTURES) &&
                array.push(fetch(Assets.getPath(src)).catch((e) => {}));
            }
          }
          i++;
        }, 1);
      return promise;
    };
  }, "static"),
  Class(function UILGroupBridge() {
    Inherit(this, Component);
    const _this = this;
    var _map = {};
    function Bridge(name) {
      let store = InputUIL.create(`scenelayout_${name}`, null),
        data = JSON.parse(store.get("data") || "{}");
      (void 0 === data.layers && (data.layers = -1),
        void 0 === data.groups && (data.groups = -1));
      var _healedGroups,
        _healedMap,
        _name = name;
      ((this.all = new StateArray()),
        (this.layers = new StateArray()),
        (this.groups = new StateArray()));
      const $this = this;
      async function bindChanges(obj, key) {
        (await _this.wait($this, "sceneLayout"),
          $this.sceneLayout.bindState(obj, "name", (name) => {
            UILStorage.set(`${key}_name`, name);
          }),
          $this.sceneLayout.bindState(obj, "sortIndex", (index) => {
            UILStorage.set(`${key}_sortIndex`, index);
          }),
          $this.sceneLayout.bindState(obj, "parent", (parent) => {
            UILStorage.set(`${key}_parent`, parent);
          }));
      }
      function run() {
        data.groups = Math.max(
          data.groups,
          Number(UILStorage.get(`groupBridge_${name}_groups`)) - 1 || -1,
        );
        let healedGroups = (_healedGroups = Number(
          UILStorage.get(`groupBridge_${name}healGroups`),
        ));
        healedGroups > 0 && (_healedMap = {});
        for (let i = 0, c = data.layers + 1; i < c; i++) {
          let obj = AppState.createLocal(),
            key = `INPUT_Config_${i}_${name}`;
          ((obj.deleted = UILStorage.get(`sl_${name}_${i}_deleted`)),
            (obj.visible = !0),
            (obj.parent = UILStorage.get(`${key}_parent`)),
            (obj.name = UILStorage.get(`${key}_name`) || "layer_" + i),
            (obj.id = `sl_${name}_${i}`),
            (obj.sortIndex = Number(UILStorage.get(`${key}_sortIndex`))),
            isNaN(obj.sortIndex) && (obj.sortIndex = $this.all.length),
            $this.layers.push(obj),
            obj.deleted || $this.all.push(obj),
            (obj.type = "layer"),
            bindChanges(obj, key));
        }
        this.groups = new StateArray();
        for (let i = 0, c = data.groups + 1; i < c; i++) {
          if (healedGroups > 0 && i < healedGroups) continue;
          let obj = AppState.createLocal(),
            key = `GROUP_${name}_group_${i}`;
          ((obj.visible = !0),
            (obj.children = new StateArray()),
            (obj.id = `sl_${name}_group_${i}`),
            (obj.deleted = UILStorage.get(`groupBridge_${obj.id}_deleted`)),
            (obj.name = UILStorage.get(`${key}_name`) || "group_" + i),
            (obj.sortIndex = Number(UILStorage.get(`${key}_sortIndex`))),
            isNaN(obj.sortIndex) && (obj.sortIndex = $this.all.length),
            $this.groups.push(obj),
            (obj.type = "group"),
            _this.wait($this, "sceneLayout").then((_) => {
              $this.sceneLayout._getGroup(
                "group_" + i,
                healedGroups > 0 ? i : void 0,
              );
            }),
            _healedMap && (_healedMap[i] = obj),
            obj.deleted || $this.all.push(obj),
            bindChanges(obj, key));
        }
        $this.all.sort((a, b) => a.sortIndex - b.sortIndex);
      }
      (run(),
        (this.createGroup = async function () {
          let obj = AppState.createLocal();
          ((obj.deleted = !1),
            (obj.visible = !0),
            (obj.type = "group"),
            (obj.children = new StateArray()),
            (obj.sortIndex = this.all.length),
            this.groups.push(obj),
            this.all.push(obj));
          let prevCount =
            Number(UILStorage.get(`groupBridge_${name}_groups`)) || 0;
          (UILStorage.set(`groupBridge_${name}_groups`, prevCount + 1),
            _healedGroups > 0
              ? ((prevCount += _healedGroups),
                this.sceneLayout._getGroup("group_" + prevCount, prevCount),
                (_healedMap[prevCount] = obj))
              : this.sceneLayout._createGroup(),
            (obj.name = "group_" + prevCount),
            (obj.id = `sl_${name}_group_${prevCount}`));
        }),
        (this.syncGroup = function (index, name) {
          let obj = AppState.createLocal();
          return (
            (obj.deleted = !1),
            (obj.visible = !0),
            (obj.type = "group"),
            (obj.children = new StateArray()),
            (obj.sortIndex = this.all.length),
            this.groups.push(obj),
            this.all.push(obj),
            (obj.name = name),
            (obj.id = `sl_${_name}_${name}`),
            obj
          );
        }),
        (this.getGroup = function (index) {
          return _healedMap ? _healedMap[index] : this.groups[index];
        }),
        (this.healGroups = function (index) {
          Number(UILStorage.get(`groupBridge_${name}healGroups`)) > 0 ||
            UILStorage.set(`groupBridge_${name}healGroups`, index);
        }),
        (this.createLayer = async function (parent) {
          let obj = AppState.createLocal(),
            key = `INPUT_Config_${this.layers.length}_${name}`;
          ((obj.deleted = !1),
            (obj.visible = !0),
            (obj.parent = parent),
            (obj.name = "layer_" + this.layers.length),
            (obj.type = "layer"),
            (obj.id = `sl_${name}_${this.layers.length}`),
            (obj.sortIndex = this.all.length),
            this.layers.push(obj),
            this.all.push(obj));
          let layer = await this.sceneLayout._createLayer();
          ((obj.name = layer.get("name") || obj.name), bindChanges(obj, key));
        }),
        (this.sync = function () {
          (this.all.refresh([]),
            this.layers.refresh([]),
            this.groups.refresh([]),
            run());
        }),
        (this.deleteNode = function (obj) {
          return obj.children?.length
            ? alert("You can't delete a group with children")
            : confirm("Are you sure you want to delete this layer?")
              ? ((obj.deleted = !0),
                this.all.remove(obj),
                "layer" == obj.type &&
                  this.sceneLayout._deleteLayer(obj.id, obj.name, !0),
                "group" == obj.type &&
                  (this.sceneLayout._deleteGroup(obj.id, obj.name, !0),
                  UILStorage.set(`groupBridge_${obj.id}_deleted`, !0)),
                !0)
              : void 0;
        }),
        (this.calculateRenderFraction = async function (index) {
          let parent,
            obj = this.layers[index];
          if (
            (this.groups.forEach((node) => {
              node.id.includes(obj.parent) && (parent = node);
            }),
            !parent)
          )
            return [0, 0];
          let fraction =
            (parent.children.indexOf(obj) / (parent.children.length - 1)) *
            0.99;
          return isNaN(fraction)
            ? (await _this.wait(50), this.calculateRenderFraction(index))
            : [fraction, parent.sortIndex];
        }));
    }
    this.createSceneLayout = this.create = async function (name, layout) {
      return (
        layout || (await _this.wait(_map, name)),
        _map[name] || (_map[name] = new Bridge(name)),
        layout && (_map[name].sceneLayout = layout),
        _map[name]
      );
    };
  }, "static"),
  Class(
    function Scroll(_object, _params) {
      Inherit(this, Component);
      const _this = this,
        PROHIBITED_ELEMENTS = ["prevent_interactionScroll"];
      ((this.x = 0),
        (this.y = 0),
        (this.max = { x: 0, y: 0 }),
        (this.delta = { x: 0, y: 0 }),
        (this.enabled = !0),
        (_this.bounds = null));
      const _scrollTarget = { x: 0, y: 0 },
        _scrollInertia = { x: 0, y: 0 };
      let _axes = ["x", "y"];
      var _lastDelta,
        _deltaChange = 0;
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
      function loop() {
        (_this.object &&
          ((Math.round(_this.object.div.scrollLeft) === Math.round(_this.x) &&
            Math.round(_this.object.div.scrollTop) === Math.round(_this.y)) ||
            ((_this.x = _scrollTarget.x = _this.object.div.scrollLeft),
            (_this.y = _scrollTarget.y = _this.object.div.scrollTop),
            stopInertia())),
          _axes.forEach((axis) => {
            _this.isInertia &&
              ((_scrollInertia[axis] *= 0.9),
              (_scrollTarget[axis] += _scrollInertia[axis]));
            let scale = _this.scale;
            (Device.mobile && (scale = _this.touchScale),
              _this.limit &&
                (_scrollTarget[axis] = Math.max(_scrollTarget[axis], 0)),
              _this.limit &&
                (_scrollTarget[axis] = Math.min(
                  _scrollTarget[axis],
                  _this.max[axis] / scale,
                )),
              (_this.delta[axis] = _this.flag("block")
                ? 0
                : 0.5 * (_scrollTarget[axis] * scale - _this[axis])),
              (_this[axis] += _this.delta[axis]),
              Math.abs(_this.delta[axis]) < 0.01 && (_this.delta[axis] = 0),
              Math.abs(_this[axis]) < 0.001 && (_this[axis] = 0),
              _this.flag("block") &&
                ((_scrollTarget[axis] = 0),
                (_this.delta[axis] = 0),
                (_this[axis] = 0)),
              _this.object &&
                ("x" == axis &&
                  (_this.object.div.scrollLeft = Math.round(_this.x)),
                "y" == axis &&
                  (_this.object.div.scrollTop = Math.round(_this.y))));
          }));
      }
      function stopInertia() {
        ((_this.isInertia = !1), clearTween(_scrollTarget));
      }
      function edgeScroll(e) {
        let element = document.elementFromPoint(
          Math.clamp(Mouse.x, 0, Stage.width),
          Math.clamp(Mouse.y, 0, Stage.height),
        );
        (element && checkIfProhibited(element)) ||
          (_params.lockMouseX && Mouse.x > Stage.width) ||
          ("touch" === e.pointerType &&
            _this.enabled &&
            (e.preventDefault && e.preventDefault(),
            _axes.forEach((axis) => {
              let dir = axis.toUpperCase(),
                delta = `offset${dir}`,
                diff = (_this[`ieDelta${dir}`] || e[delta]) - e[delta];
              ((_scrollTarget[axis] += diff),
                (_scrollInertia[axis] = diff),
                (_this.isInertia = !0),
                (_this[`ieDelta${dir}`] = e[delta]));
            }),
            _this.onUpdate && _this.onUpdate(),
            _this.events.fire(Events.UPDATE, _scrollInertia)));
      }
      function edgeScrollEnd() {
        ((_this.ieDeltaX = !1), (_this.ieDeltaY = !1));
      }
      function scroll(e) {
        let element = document.elementFromPoint(
          Math.clamp(Mouse.x, 0, Stage.width),
          Math.clamp(Mouse.y, 0, Stage.height),
        );
        if (element && checkIfProhibited(element)) return;
        if (_params.lockMouseX && Mouse.x > Stage.width) return;
        if (!_this.enabled) return;
        if (!checkBounds(e)) return;
        if (
          (_this.object &&
            _this.limit &&
            e.preventDefault &&
            e.preventDefault(),
          !_this.mouseWheel)
        )
          return;
        stopInertia();
        let newDelta = 0;
        (_axes.forEach((axis) => {
          let delta = "delta" + axis.toUpperCase();
          if ("mac" == Device.system.os) {
            if ("firefox" == Device.system.browser)
              return 1 === e.deltaMode
                ? ((_scrollTarget[axis] += 4 * e[delta]),
                  (_scrollInertia[axis] = 4 * e[delta]),
                  (_this.isInertia = !0),
                  void (newDelta = _scrollInertia[axis]))
                : void (_scrollTarget[axis] += e[delta]);
            if (Device.system.browser.includes(["chrome", "safari"]))
              return (
                (_scrollTarget[axis] += 0.33 * e[delta]),
                (_scrollInertia[axis] = 0.33 * e[delta]),
                (_this.isInertia = !0),
                void (newDelta = _scrollInertia[axis])
              );
          }
          if ("windows" == Device.system.os) {
            if ("firefox" == Device.system.browser && 1 === e.deltaMode)
              return (
                (_scrollTarget[axis] += 10 * e[delta]),
                (_scrollInertia[axis] = 10 * e[delta]),
                (_this.isInertia = !0),
                void (newDelta = _scrollInertia[axis])
              );
            if (Device.system.browser.includes(["chrome"])) {
              let s = 0.25;
              return (
                (_scrollTarget[axis] += e[delta] * s),
                (_scrollInertia[axis] = e[delta] * s),
                (_this.isInertia = !0),
                void (newDelta = _scrollInertia[axis])
              );
            }
            if ("ie" == Device.system.browser)
              return (
                (_scrollTarget[axis] += e[delta]),
                (_scrollInertia[axis] = e[delta]),
                (_this.isInertia = !0),
                void (newDelta = _scrollInertia[axis])
              );
          }
          ((_scrollTarget[axis] += e[delta]),
            (newDelta = _scrollInertia[axis]));
        }),
          (newDelta = Math.abs(newDelta)),
          newDelta != _lastDelta && _deltaChange++,
          _this.flag("hardBlock") ||
            (_deltaChange > 3
              ? newDelta > _lastDelta && _this.flag("block", !1)
              : newDelta >= _lastDelta && _this.flag("block", !1)),
          (_lastDelta = newDelta),
          _this.onUpdate && _this.onUpdate(),
          _this.events.fire(Events.UPDATE, _scrollInertia),
          _this.events.fire(Scroll.EVENT, e));
      }
      function down(e) {
        if (!_this.enabled) return;
        if (!checkBounds(e)) return;
        let element = document.elementFromPoint(
          Math.clamp(e.x || 0, 0, Stage.width),
          Math.clamp(e.y || 0, 0, Stage.height),
        );
        (element && checkIfProhibited(element)) ||
          (stopInertia(), (_this.isDragging = !0));
      }
      function drag(e) {
        if (!_this.enabled) return;
        if (!checkBounds(e)) return;
        let element = document.elementFromPoint(
          Math.clamp(e.x || 0, 0, Stage.width),
          Math.clamp(e.y || 0, 0, Stage.height),
        );
        (element && checkIfProhibited(element)) ||
          (_axes.forEach((axis) => {
            let newDelta = Math.abs(Mouse.delta[axis]);
            (_this.flag("hardBlock") ||
              (newDelta > _lastDelta && _this.flag("block", !1)),
              (_lastDelta = newDelta),
              (_scrollTarget[axis] -= Mouse.delta[axis]));
          }),
          _this.events.fire(Events.UPDATE));
      }
      function up(e) {
        if (!_this.enabled || _this.preventInertia) return;
        if (!checkBounds(e)) return;
        let element = document.elementFromPoint(
          Math.clamp(e.x || 0, 0, Stage.width),
          Math.clamp(e.y || 0, 0, Stage.height),
        );
        if (element && checkIfProhibited(element)) return;
        const m = "android" == Device.system.os ? 35 : 25,
          obj = {};
        (_axes.forEach((axis) => {
          obj[axis] = _scrollTarget[axis] - Mouse.delta[axis] * m;
        }),
          tween(_scrollTarget, obj, 2500, "easeOutQuint"),
          (_this.isDragging = !1));
      }
      function onKeyDown({ key: key, shiftKey: shiftKey }) {
        let dst = null;
        switch (key) {
          case "Up":
          case "ArrowUp":
            dst = _scrollTarget.y - 150;
            break;
          case "Down":
          case "ArrowDown":
            dst = _scrollTarget.y + 150;
            break;
          case "Home":
            dst = 0;
            break;
          case "End":
            dst = _this.max.y;
            break;
          case "PageUp":
            dst = _scrollTarget.y - Stage.height;
            break;
          case "PageDown":
            dst = _scrollTarget.y + Stage.height;
            break;
          case " ":
          case "Spacebar":
            onKeyDown(shiftKey ? { key: "PageUp" } : { key: "PageDown" });
        }
        null !== dst && _this.scrollTo(dst, "y", 400, "easeOutCubic");
      }
      function resize() {
        if (!_this.enabled) return;
        if ((stopInertia(), !_this.object)) return;
        const p = {};
        (Device.mobile &&
          _axes.forEach(
            (axis) =>
              (p[axis] = _this.max[axis]
                ? _scrollTarget[axis] / _this.max[axis]
                : 0),
          ),
          void 0 === _params.height &&
            (_this.max.y =
              _this.object.div.scrollHeight - _this.object.div.clientHeight),
          void 0 === _params.width &&
            (_this.max.x =
              _this.object.div.scrollWidth - _this.object.div.clientWidth),
          Device.mobile &&
            _axes.forEach(
              (axis) =>
                (_this[axis] = _scrollTarget[axis] = p[axis] * _this.max[axis]),
            ));
      }
      function checkBounds(e) {
        return (
          !_this.bounds ||
          !(
            e.x / Stage.width > _this.bounds.x.y ||
            e.x / Stage.width < _this.bounds.x.x ||
            e.y / Stage.height > _this.bounds.y.y ||
            e.y / Stage.height < _this.bounds.y.x
          )
        );
      }
      (!(function initParams() {
        ((_object && _object.div) || ((_params = _object), (_object = null)),
          _params || (_params = {}),
          (_this.object = _object),
          (_this.hitObject = _params.hitObject || _this.object),
          (_this.max.y = _params.height || 0),
          (_this.max.x = _params.width || 0),
          (_this.scale = _params.scale || 1),
          (_this.touchScale = _params.touchScale || 1),
          (_this.isDragging = !1),
          (_this.drag =
            void 0 !== _params.drag ? _params.drag : !!Device.mobile),
          (_this.mouseWheel = !1 !== _params.mouseWheel),
          (_this.limit = "boolean" == typeof _params.limit && _params.limit),
          (_this.bounds = _params.bounds || null),
          (_this.keyboard = _params.keyboard || !1),
          Array.isArray(_params.axes) && (_axes = _params.axes));
      })(),
        _this.object &&
          (function style() {
            _this.object.css({ overflow: "auto" });
          })(),
        (function addHandlers() {
          if (
            (Device.mobile ||
              ("ie" === Device.system.browser &&
                Device.system.browserVersion >= 17 &&
                (document.body.addEventListener("pointermove", edgeScroll, !0),
                document.body.addEventListener("pointerup", edgeScrollEnd, !0)),
              "ie" == Device.system.browser
                ? document.body.addEventListener("wheel", scroll, !0)
                : __window.bind("wheel", scroll),
              _this.keyboard && _this.events.sub(Keyboard.DOWN, onKeyDown)),
            _this.drag)
          ) {
            _this.hitObject &&
              _this.hitObject.bind("touchstart", (e) => {
                let element = document.elementFromPoint(
                  Math.clamp(e.x || 0, 0, Stage.width),
                  Math.clamp(e.y || 0, 0, Stage.height),
                );
                (element && checkIfProhibited(element)) || e.preventDefault();
              });
            let input = _this.hitObject
              ? _this.initClass(Interaction, _this.hitObject)
              : Mouse.input;
            (_this.events.sub(input, Interaction.START, down),
              _this.events.sub(input, Interaction.DRAG, drag),
              _this.events.sub(input, Interaction.END, up));
          }
          _this.events.sub(Events.RESIZE, resize);
        })(),
        resize(),
        _this.startRender(loop),
        (this.reset = function () {
          return (
            _this.object &&
              _this.object.div &&
              ((_this.object.div.scrollLeft = _this.x = 0),
              (_this.object.div.scrollTop = _this.y = 0)),
            (_scrollTarget.x = _scrollTarget.y = 0),
            (_scrollInertia.x = _scrollInertia.y = 0),
            stopInertia(),
            this
          );
        }),
        (this.onDestroy = function () {
          (__window.unbind("wheel", scroll),
            _this.events.unsub(Keyboard.DOWN, onKeyDown));
        }),
        (this.resize = resize),
        (this.scrollTo = function (
          value,
          axis = "y",
          time = 800,
          ease = "easeInOutCubic",
        ) {
          let values = {};
          ((values[axis] = value), tween(_scrollTarget, values, time, ease));
        }),
        (this.setTarget = function (value, axis = "y") {
          _scrollTarget[axis] = value;
        }),
        (this.blockUntilNewScroll = function () {
          return (
            _this.reset(),
            _this.flag("block", !0),
            _this.flag("hardBlock", !0, 200),
            this
          );
        }),
        (this.stopInertia = stopInertia));
    },
    (_) => {
      var _scroll;
      ((Scroll.EVENT = "scroll_event"),
        (Scroll.createUnlimited = Scroll.getUnlimited =
          function (options) {
            return (
              _scroll ||
                (_scroll = new Scroll({ limit: !1, drag: Device.mobile })),
              _scroll
            );
          }));
    },
  ),
  Class(function Shaders() {
    Inherit(this, Component);
    var _this = this,
      _dependencies;
    function parseSingleShader(code, fileName) {
      let uniforms = code.split("#!UNIFORMS")[1].split("#!")[0],
        varyings = code.split("#!VARYINGS")[1].split("#!")[0],
        attributes = code.split("#!ATTRIBUTES")[1].split("#!")[0];
      for (; code.includes("#!SHADER"); ) {
        let split = (code = code.slice(code.indexOf("#!SHADER"))).split(
            "#!SHADER",
          )[1],
          br = split.indexOf("\n"),
          name = split.slice(0, br).split(": ")[1];
        (name.slice(0, 6).includes("Vertex") &&
          (name = fileName.split(".")[0] + ".vs"),
          name.slice(0, 8).includes("Fragment") &&
            (name = fileName.split(".")[0] + ".fs"));
        let glsl = split.slice(br);
        glsl = name.includes(".vs")
          ? attributes + uniforms + varyings + glsl
          : uniforms + varyings + glsl;
        let splitName = name.split(".");
        ((_this[splitName[0] + (splitName[1].includes("vs") ? ".vs" : ".fs")] =
          glsl),
          (code = code.replace("#!SHADER", "$")));
      }
    }
    function parseCompiled(shaders) {
      var split = shaders.split("{@}");
      split.shift();
      for (var i = 0; i < split.length; i += 2) {
        var name = split[i],
          text = split[i + 1];
        text.includes("#!UNIFORMS")
          ? parseSingleShader(text, name)
          : (_this[name] = text);
      }
    }
    function parseRequirements() {
      for (var key in _this) {
        var obj = _this[key];
        "string" == typeof obj && (_this[key] = require(obj, key));
      }
    }
    function require(shader, key) {
      if (!shader.includes("require")) return shader;
      for (
        shader = shader.replace(/# require/g, "#require");
        shader.includes("#require");
      ) {
        var name = shader.split("#require(")[1].split(")")[0];
        if (((name = name.replace(/ /g, "")), !_this[name]))
          throw (
            "Shader required " +
            name +
            ", but not found in compiled shaders.\n" +
            shader
          );
        (_dependencies &&
          (_dependencies[name] || (_dependencies[name] = []),
          _dependencies[name].includes(key) || _dependencies[name].push(key)),
          (shader = shader.replace("#require(" + name + ")", _this[name])));
      }
      return shader;
    }
    (Hydra.LOCAL && (_dependencies = {}),
      this.get("dependencies", (_) => _dependencies),
      (this.parse = function (code, file) {
        (code.includes("{@}")
          ? (parseCompiled(code), parseRequirements())
          : ((file = (file = file.split("/"))[file.length - 1]),
            (_this[file] = code)),
          (_this.shadersParsed = !0));
      }),
      (this.parseSingle = parseSingleShader),
      (this.onReady = this.ready =
        function (callback) {
          let promise = Promise.create();
          return (
            callback && promise.then(callback),
            _this.wait(() => promise.resolve(), _this, "shadersParsed"),
            promise
          );
        }),
      (this.getShader = function (string) {
        _this.FALLBACKS &&
          _this.FALLBACKS[string] &&
          (string = _this.FALLBACKS[string]);
        var code = _this[string];
        if (!code) throw `No shader ${string} found`;
        for (; code.includes("#test "); )
          try {
            var test = code.split("#test ")[1],
              name = test.split("\n")[0],
              glsl = code.split("#test " + name + "\n")[1].split("#endtest")[0];
            (eval(name) || (code = code.replace(glsl, "")),
              (code = code.replace("#test " + name + "\n", "")),
              (code = code.replace("#endtest", "")));
          } catch (e) {
            throw "Error parsing test :: " + string;
          }
        return code;
      }));
  }, "static"),
  Class(function ShadowInspector(_shadow) {
    Inherit(this, Component);
    var _this = this;
    ((_shadow = _shadow.classRef || _shadow),
      (function () {
        let rt = _shadow.light.shadow.rt,
          $obj = $gl(rt.width / 4, rt.height / 4, rt.texture);
        GLUI.Stage.add($obj);
        let shader = _this.initClass(Shader, "ShadowInspector", {
          tMap: { value: rt.texture },
        });
        $obj.useShader(shader);
      })());
  }));
class Skin extends Mesh {
  constructor(geometry, shader, bones = geometry.bones) {
    (super(geometry, shader),
      (this.isSkin = !0),
      this.createBones(bones),
      this.createBoneTexture(),
      (this.animations = []),
      (this.pingPong = -1),
      Object.assign(this.shader.uniforms, {
        boneTexture: { value: this.boneTextureA },
        boneTextureSize: { value: this.boneTextureSize },
      }));
  }
  createBones(bonesData) {
    ((this.root = new Base3D()),
      (this.bones = []),
      bonesData.forEach((data) => {
        const bone = new Base3D();
        ((bone.name = data.name),
          bone.position.set(...data.pos),
          bone.quaternion.set(...data.rot),
          bone.quaternion.normalize(),
          bone.scale.set(...data.scl),
          this.bones.push(bone));
      }),
      bonesData.forEach((data, i) => {
        if (-1 === data.parent) return this.root.add(this.bones[i]);
        this.bones[data.parent].add(this.bones[i]);
      }),
      this.root.updateMatrixWorld(!0),
      this.bones.forEach((bone) => {
        ((bone.bindInverse = new Matrix4().copy(bone.matrixWorld)),
          (bone.bindInverse = bone.bindInverse.getInverse(bone.bindInverse)));
      }));
  }
  createBoneTexture() {
    const size = Math.max(
      4,
      Math.pow(
        2,
        Math.ceil(Math.log(Math.sqrt(4 * this.bones.length)) / Math.LN2),
      ),
    );
    ((this.boneMatrices = new Float32Array(size * size * 4)),
      (this.boneTextureSize = size),
      (this.boneTextureA = new DataTexture(this.boneMatrices, size, size)),
      (this.boneTextureB = new DataTexture(this.boneMatrices, size, size)),
      (this.boneTextureC = new DataTexture(this.boneMatrices, size, size)));
  }
  addAnimation(data) {
    const animation = new SkinAnimation(this, data);
    return (this.animations.push(animation), animation);
  }
  async loadAnimation(path) {
    (path.includes("assets/geometry/") || (path = "assets/geometry/" + path),
      path.includes(".") || (path += ".json"),
      (path = Thread.absolutePath(Assets.getPath(path))));
    const data = await get(path);
    return this.addAnimation(data);
  }
  update() {
    let total = 0;
    (this.animations.forEach((animation) => (total += animation.weight)),
      this.animations.forEach((animation, i) => {
        animation.update(total || 1, 0 === i);
      }));
  }
  updateMatrixWorld(force) {
    switch (
      (super.updateMatrixWorld(force),
      this.root.updateMatrixWorld(!0),
      this.bones.forEach((bone, i) => {
        (Skin.tempMat4.multiplyMatrices(bone.matrixWorld, bone.bindInverse),
          this.boneMatrices.set(Skin.tempMat4.elements, 16 * i));
      }),
      this.pingPong++,
      this.pingPong > 2 && (this.pingPong = 0),
      this.pingPong)
    ) {
      case 0:
        ((this.shader.uniforms.boneTexture.value = this.boneTextureA),
          Texture.renderer.manualUpdateDynamic(this.boneTextureB));
        break;
      case 1:
        ((this.shader.uniforms.boneTexture.value = this.boneTextureB),
          Texture.renderer.manualUpdateDynamic(this.boneTextureC));
        break;
      case 2:
        ((this.shader.uniforms.boneTexture.value = this.boneTextureC),
          Texture.renderer.manualUpdateDynamic(this.boneTextureA));
    }
  }
}
Skin.tempMat4 = new Matrix4();
class SkinAnimation {
  constructor(skin, data) {
    ((this.skin = skin),
      (this.data = data),
      (this.elapsed = 0),
      (this.weight = 1),
      (this.duration = data.duration),
      this.data.skeleton.forEach((d) => {
        for (let j = 0; j < d.keys.length; j++)
          (SkinAnimation.tempRot.set(...d.keys[j].rot),
            SkinAnimation.tempRot.normalize(),
            (d.keys[j].rot = SkinAnimation.tempRot.toArray()));
      }));
  }
  update(totalWeight, isSet) {
    const animationWeight = isSet ? 1 : this.weight / totalWeight,
      numberKeys = this.duration + 1,
      elapsed = this.elapsed % numberKeys;
    let prevKey, nextKey;
    this.data.skeleton.forEach((d, i) => {
      const prev = Math.floor(elapsed),
        next = Math.floor(elapsed + 1) % numberKeys,
        weight = elapsed - prev;
      ((prevKey = d.keys[prev]),
        (nextKey = d.keys[next]),
        SkinAnimation.tempPos.set(...prevKey.pos),
        SkinAnimation.tempRot.set(...prevKey.rot),
        SkinAnimation.tempScl.set(...prevKey.scl),
        SkinAnimation.tempPos2.set(...nextKey.pos),
        SkinAnimation.tempRot2.set(...nextKey.rot),
        SkinAnimation.tempScl2.set(...nextKey.scl),
        SkinAnimation.tempPos.lerp(SkinAnimation.tempPos2, weight, !1),
        SkinAnimation.tempRot.slerp(SkinAnimation.tempRot2, weight, !1),
        SkinAnimation.tempScl.lerp(SkinAnimation.tempScl2, weight, !1),
        this.skin.bones[i].position.lerp(
          SkinAnimation.tempPos,
          animationWeight,
          !1,
        ),
        this.skin.bones[i].quaternion.slerp(
          SkinAnimation.tempRot,
          animationWeight,
          !1,
        ),
        this.skin.bones[i].scale.lerp(
          SkinAnimation.tempScl,
          animationWeight,
          !1,
        ));
    });
  }
}
