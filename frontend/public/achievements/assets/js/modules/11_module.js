((SkinAnimation.tempPos = new Vector3()),
  (SkinAnimation.tempRot = new Quaternion()),
  (SkinAnimation.tempScl = new Vector3()),
  (SkinAnimation.tempPos2 = new Vector3()),
  (SkinAnimation.tempRot2 = new Quaternion()),
  (SkinAnimation.tempScl2 = new Vector3()),
  Class(function SnapshotFrame(_texture, _options = {}) {
    Inherit(this, FXScene);
    const _this = this;
    var _mesh;
    if (_texture.isAppState) {
      let params = _texture;
      (((_options = params).nuke = _this.parent.nuke || params.nuke),
        ("string" == typeof (_texture = params.texture) || _texture instanceof String) &&
          (_texture = _this.parent[_texture.trim().split(".").slice(-1)]));
    } else
      (_options.nuke ||
        !_texture.nuke ||
        _texture instanceof FXLayer ||
        (_options.nuke = _texture.nuke),
        _options.nuke || (_options.nuke = World.NUKE));
    function loop() {
      World.RENDERER.renderSingle(_mesh, _this.nuke.camera, _this.rt);
    }
    !(function () {
      (_options.uniforms || (_options.uniforms = {}),
        _this.create(_options.nuke, _options),
        (_this.preventRender = !0));
      let shader = _this.initClass(Shader, _options?.shaderName || "SnapshotFrame", {
        tMap: { value: _texture },
        ..._options.uniforms,
        depthWrite: !1,
      });
      ((_this.shader = shader),
        ((_mesh = new Mesh(World.QUAD, shader)).frustumCulled = !1),
        _this.startRender(loop, _options.nuke));
    })();
  }),
  Class(function SnapshotFramePingPong(_fxScene) {
    Inherit(this, Component);
    const _this = this;
    let _rtClone;
    function loop() {
      (_this.rt || (_this.rt = _fxScene.rt),
        _this.rt && !_rtClone && (_rtClone = _this.rt.clone()),
        _this.rt &&
          _rtClone &&
          ((_this.rt.width === _rtClone.width && _this.rt.height === _rtClone.height) ||
            _rtClone.setSize(_this.rt.width, _this.rt.height),
          ([_rtClone, _this.rt] = [_this.rt, _rtClone]),
          _fxScene.useRT(_this.rt)));
    }
    ((_this.rt = _fxScene.rt),
      _this.rt && (_rtClone = _this.rt.clone()),
      _this.startRender(loop, _fxScene.nuke));
  }),
  Class(function SplineGen() {
    Inherit(this, Component);
    const _this = this;
    var _file,
      _subdivide = 100;
    async function exec() {
      if (_this.flag("building")) return;
      _this.flag("building", !0);
      let json = await get(_file),
        array = [],
        generator = _this.initClass(Generator, json),
        data = await generator.exec();
      array = [...array, ...data];
      let output = _file.split(".js").join("-SPLINES.js");
      (Dev.writeFile(output + "?compress", array),
        alert("Conversion complete!"),
        _this.flag("building", !1));
    }
    function Generator(_data) {
      Inherit(this, Component);
      var _animation;
      const COUNT = _subdivide;
      var _groups = [];
      function connect(hierarchy) {
        let array = [];
        for (let i = 0; i < hierarchy.length; i++) {
          let group = new Group();
          (array.push(group), i > 0 && _groups.push(group));
        }
        return array;
      }
      ((_animation = this.initClass(HierarchyAnimation, _data, connect)),
        (this.exec = async function () {
          await _animation.ready();
          let results = [];
          return (
            _groups.forEach((group, index) => {
              let array = [];
              for (let i = 0; i < COUNT; i++) {
                ((_animation.elapsed = (i + 1) / COUNT), _animation.update());
                let pos = group.position.toArray();
                array.push(
                  Number(pos[0].toFixed(2)),
                  Number(pos[1].toFixed(2)),
                  Number(pos[2].toFixed(2)),
                );
              }
              (results.push(array), console.log((index + 1) / _groups.length));
            }),
            results
          );
        }));
    }
    !(function () {
      let folder = new UILFolder("splinegen", {
        label: "Spline Gen",
        closed: !0,
      });
      UIL.global.add(folder);
      let number = new UILControlNumber("subdivide", { value: 100, step: 1 });
      (folder.add(number),
        number.onChange((v) => {
          ((_subdivide = v), console.log(_subdivide));
        }));
      let file = new UILControlFile("splinegen_file", { label: "File" });
      (file.onFinishChange((e) => {
        _file = e.src;
      }),
        folder.add(file));
      let button = new UILControlButton("button", {
        actions: [{ title: "Run", callback: exec }],
        hideLabel: !0,
      });
      folder.add(button);
    })();
  }),
  Class(function SplineLoader() {
    Inherit(this, Component);
    var _promises = {};
    function packSplineInTexture({ path: path }, id) {
      (async (_) => {
        let json = await get(path),
          splines = json.length,
          count = splines * json[0].length,
          textureSize = ((num) => {
            let values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
            for (let i = 0; i < values.length; i++) {
              var p2 = values[i];
              if (p2 * p2 >= num) return p2;
            }
          })(count),
          flat = json.flat(),
          perSpline = json[0].length / 3,
          array = new Float32Array(textureSize * textureSize * 3);
        for (let i = 0; i < count; i++) array[i] = flat[i];
        resolve(
          {
            array: array,
            splines: splines,
            perSpline: perSpline,
            textureSize: textureSize,
          },
          id,
          [array.buffer],
        );
      })();
    }
    function loadStaticSpline({ path: path, particleCount: particleCount }, id) {
      (async (_) => {
        let output = new Float32Array(
            4 *
              Math.pow(
                ((num) => {
                  let values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
                  for (let i = 0; i < values.length; i++) {
                    var p2 = values[i];
                    if (p2 * p2 >= num) return p2;
                  }
                })(particleCount),
                2,
              ),
          ),
          json = await get(path);
        json = json.curves;
        let v3 = new Vector3(),
          v30 = new Vector3(),
          v31 = new Vector3(),
          total = 0;
        for (let i = 0; i < json.length; i++) total += json[i].length / 3;
        let index = 0;
        for (let i = 0; i < json.length; i++) {
          let data = json[i],
            jsonCount = data.length / 3,
            weight = jsonCount / total,
            count = Math.round(weight * particleCount);
          for (let j = 0; j < count; j++) {
            let i0 = Math.random(0, jsonCount - 2),
              i1 = i0 + 1;
            (v30.set(data[3 * i0 + 0], data[3 * i0 + 1], data[3 * i0 + 2]),
              v31.set(data[3 * i1 + 0], data[3 * i1 + 1], data[3 * i1 + 2]),
              v3.copy(v30).lerp(v31, Math.random()),
              (output[4 * index + 0] = v3.x),
              (output[4 * index + 1] = v3.y),
              (output[4 * index + 2] = v3.z),
              index++);
          }
        }
        resolve({ array: output }, id, [output.buffer]);
      })();
    }
    (!(async function () {
      (await Hydra.ready(), Thread.upload(packSplineInTexture), Thread.upload(loadStaticSpline));
    })(),
      (this.load = function (path) {
        if (_promises[path]) return _promises[path];
        let promise = (_promises[path] = Promise.create());
        return (
          "/" == path.charAt(0) && (path = path.slice(1)),
          path.includes("assets/geometry") || (path = "assets/geometry/" + path),
          path.includes(".json") || (path += ".json"),
          (path = Hydra.absolutePath(Assets.getPath(path))),
          Thread.shared()
            .packSplineInTexture({ path: path })
            .then((data) => {
              ((data.texture = new DataTexture(
                data.array,
                data.textureSize,
                data.textureSize,
                Texture.RGBFormat,
                Texture.FLOAT,
              )),
                promise.resolve(data));
            }),
          promise
        );
      }),
      (this.loadStatic = function (path, particleCount) {
        if (_promises[path]) return _promises[path];
        let promise = (_promises[path] = Promise.create());
        return (
          "/" == path.charAt(0) && (path = path.slice(1)),
          path.includes("assets/geometry") || (path = "assets/geometry/" + path),
          path.includes(".json") || (path += ".json"),
          (path = Hydra.absolutePath(Assets.getPath(path))),
          Thread.shared()
            .loadStaticSpline({ path: path, particleCount: particleCount })
            .then((data) => {
              promise.resolve(data.array);
            }),
          promise
        );
      }));
  }, "static"),
  Class(
    function SplineParticles(_proton, _group, _input) {
      Inherit(this, Component);
      const _this = this;
      var _config, _life;
      async function initFile(file) {
        if (
          (file ||
            (file =
              _this.parent.data && _this.parent.data.splineFile
                ? _this.parent.data.splineFile
                : _config.get("json")),
          !file)
        )
          return (_proton.visible = _proton.group.visible = !1);
        let data = "string" == typeof file ? await SplineLoader.load(file) : file;
        (_proton.behavior.addUniforms({
          tSpline: { value: data.texture, ignoreUIL: !0 },
          uSplineTexSize: { value: data.textureSize, ignoreUIL: !0 },
          uPerSpline: { value: data.perSpline, ignoreUIL: !0 },
          uSplineCount: { value: data.splines, ignoreUIL: !0 },
          uSetup: { value: 1, ignoreUIL: !0 },
        }),
          await (async function initLifeBehavior() {
            let pass = _this.initClass(AntimatterPass, "SplineParticleLife", {
              unique: _input.prefix,
              uMaxCount: _proton.behavior.uniforms.uMaxCount,
              uSplineCount: _proton.behavior.uniforms.uSplineCount,
              uSetup: _proton.behavior.uniforms.uSetup,
              tAttribs: _proton.behavior.uniforms.tAttribs,
              tOrigin: _proton.behavior.uniforms.tOrigin,
              uDecayRate: { value: 0 },
              uDecayRange: { value: new Vector2(1, 1) },
              uFlowRange: { value: new Vector2(1, 1) },
              uSplineSpeed: { value: new Vector2(1, 1) },
              uTimeMultiplier: { value: 1 },
              uStartOffset: { value: 0 },
              uStartSpacing: { value: 0 },
              uDelayStart: { value: 0, ignoreUIL: !0 },
              uIHold: { value: 0, ignoreUIL: !0 },
              uMaxDelay: { value: 0 },
              uMaxSDelay: { value: 0 },
              uHoldBack: { value: 0 },
              uHoldBack2: { value: 0, ignoreUIL: !0 },
              uInfinite: {
                value: _config.get("infinite") ? 1 : 0,
                ignoreUIL: !0,
              },
              uRelease: { value: new Vector2(0, 1), ignoreUIL: !0 },
              uLifeSlow: { value: new Vector4(1, 1, 1, 1) },
              HZ: { value: Render.HZ_MULTIPLIER, ignoreUIL: !0 },
            });
            (ShaderUIL.add(pass, _group).setLabel("Life"),
              pass.addInput("tPos", _proton.behavior.output),
              _proton.antimatter.addPass(pass, 0),
              _proton.behavior.addInput("tLife", pass.output),
              (_this.life = _life = pass));
          })(),
          (_config.onUpdate = (key) => {
            "infinite" == key && _life.setUniform("uInfinite", _config.get("infinite") ? 1 : 0);
          }),
          _proton.behavior.setUniform("uSetup", 1),
          _life.setUniform("uSetup", 1),
          (_proton.behavior.onInit = (_) => {
            _this.delayedCall((_) => {
              (_proton.behavior.setUniform("uSetup", 0),
                _life.setUniform("uSetup", 0),
                _this.flag("setup", !0));
            }, 100);
          }),
          _proton.shader.addUniforms({
            uSplineCount: { value: data.splines, ignoreUIL: !0 },
            tLifeData: { value: _life.output, ignoreUIL: !0 },
            tSpline: { value: data.texture, ignoreUIL: !0 },
            uSplineTexSize: { value: data.textureSize, ignoreUIL: !0 },
            uPerSpline: { value: data.perSpline, ignoreUIL: !0 },
          }),
          _this.flag("setup", !0));
      }
      (!(function initConfig() {
        ((_config = InputUIL.create(_input.prefix + "SplineConfig", _group)).setLabel(
          "Spline Config",
        ),
          _config.add("json"),
          _config.addToggle("infinite"));
      })(),
        initFile(),
        (this.loadFile = initFile),
        (this.loadConfig = function (fromKey, toKey) {
          let copyConfig = InputUIL.create(fromKey.split("P_")[1] + "SplineConfig", null);
          _config.copyFrom(copyConfig, ["json", "infinite"]);
          let baseFromKey = `am_SplineParticleLife_${fromKey.split("P_")[1]}`,
            baseToKey = `am_SplineParticleLife_${toKey.split("P_")[1]}`;
          [
            "uDecayRate",
            "uDecayRange",
            "uFlowRange",
            "uSplineSpeed",
            "uTimeScale",
            "uStartOffset",
            "uMaxDelay",
            "uMaxSDelay",
            "uHoldBack",
          ].forEach((name) => {
            let val = UILStorage.get(baseFromKey + name);
            val && UILStorage.set(baseToKey + name, val);
          });
        }),
        (this.saveValues = function () {
          return _life.shader;
        }),
        (this.ready = function () {
          return _this.wait("setup");
        }),
        (this.release = async function () {
          await _this.wait("life");
          let v = _life.uniforms.uRelease.value;
          (++v.x >= v.y && (v.x = 0),
            _life.setUniform("uIHold", 0),
            _life.setUniform("uDelayStart", World.RENDERER.time.value));
        }),
        (this.hold = async function () {
          (await _this.wait("life"),
            _life.setUniform("uDelayStart", 9999999999),
            _life.setUniform("uIHold", 1));
        }),
        (this.loop = async function () {
          (await _this.wait("life"),
            _proton.behavior.setUniform("uInfinite", 1),
            _life.setUniform("uInfinite", 1));
        }),
        (this.reset = async function () {
          (await _this.wait("life"),
            _proton.behavior.setUniform("uSetup", 1),
            _life.setUniform("uSetup", 1),
            await _this.wait(100),
            _proton.behavior.setUniform("uSetup", 0),
            _life.setUniform("uSetup", 0));
        }),
        this.set("releaseSections", async (v) => {
          (await _this.wait("life"), (_life.uniforms.uRelease.value.y = v));
        }),
        this.set("holdBack", async (v) => {
          (await _this.wait("life"), (_life.uniforms.uHoldBack2.value = v));
        }),
        this.get("splineJSON", (_) => _config.get("json")));
    },
    (_) => {
      Shaders.ready().then((_) => {
        ProtonPresets.register("Spline", (input) => {
          let shader = Shaders.getShader("SplineParticlePreset.fs");
          shader = shader.split("void main() {")[1].slice(0, -1);
          let code = "#require(curl.glsl)\n#require(splineparticles.fs)\n" + shader;
          (input.setValue(
            "uniforms",
            "\n            uSplineThickness: 1\n            uThicknessStep: [1, 1]\n            uThicknessSpeed: 0\n            uRangeThickness: 0\n            uRangeScale: 1\n            uDistribution: 1\n            uDistributionRange: [1, 1]\n            uExtrudeRandom: 1\n            uSCurlNoiseScale: 1\n            uSCurlTimeScale: 0\n            uSCurlNoiseSpeed: 0\n            ",
          ),
            input.get("code") || input.setValue("code", code));
        });
      });
    },
  ),
  Class(
    function SplineParticlesStatic(_proton, _group, _input) {
      Inherit(this, Component);
      const _this = this;
      var _config;
      (!(function initConfig() {
        ((_proton.antimatter.preventRender = !0),
          (_config = InputUIL.create(_input.prefix + "SplineConfig", _group)).setLabel(
            "Spline Config",
          ),
          _config.add("json"));
      })(),
        (async function initFile() {
          let file = _config.get("json");
          if (!file) return;
          let data = await SplineLoader.loadStatic(file, _proton.particleCount);
          (_proton.antimatter.vertices.bufferData(data, 4),
            (_proton.antimatter.preventRender = !1),
            _this.flag("initialized", !0));
        })(),
        (this.loaded = function () {
          return _this.wait("initialized");
        }));
    },
    (_) => {
      Hydra.ready().then((_) => {
        Proton.forceCloneVertices.push("SplineParticlesStatic");
      });
    },
  ),
  Class(
    function Text3D(_input, _group) {
      Inherit(this, Object3D);
      const _this = this;
      var _config, _fontObject, $text;
      ((this.translate = new Vector3()), (this.rotate = new Vector3()));
      var _mouse = new Vector2();
      function initUIL() {
        ((_config = InputUIL.create(_input.prefix + "_text3d", _group)).setLabel("Text3D"),
          _config.addTextarea("text").addTextarea("fontStyle"),
          _config.addToggle("anchor2D", !1),
          _config.addToggle("renderRetina", !1),
          _config.add("data", "hidden"),
          UIL.sidebar &&
            (_config.onUpdate = (key) => {
              if ("data" != key) {
                let text = parseData(_config.get("text")),
                  obj = getFontObject();
                (_config.setValue("data", JSON.stringify(obj)),
                  $text && ($text.setText(text, obj), obj.color && $text.setColor(obj.color)),
                  _this.onUpdate && _this.onUpdate());
              }
            }));
      }
      function parseData(text) {
        if (!text || !text.includes("$DATA")) return text;
        for (; text.includes("$DATA"); ) {
          let code = text.split("$DATA")[1].split(" ")[0].split("\n")[0],
            line = "$DATA" + code;
          text = text.replace(line, eval(line.replace("$DATA", "_this.parent.data")));
        }
        return text;
      }
      function getFontObject() {
        let font = _config.get("fontStyle") || "",
          obj = {};
        return (
          (font = font.split("\n")),
          font.forEach((line) => {
            let key = (line = line.split(":"))[0],
              val = line[1];
            (val && (val = val.replace(/ /g, "")),
              key.length &&
                ((obj[key] = isNaN(Number(val)) ? val : Number(val)),
                "false" === val && (obj[key] = !1),
                "true" === val && (obj[key] = !0)));
          }),
          obj
        );
      }
      function initText() {
        if (!(_fontObject = JSON.parse(_config.get("data") || "{}")).size) return;
        (Text3D.FONT_CONFIG && (_fontObject.config = Text3D.FONT_CONFIG),
          Text3D.LANG_BREAK && (_fontObject.langBreak = Text3D.LANG_BREAK),
          _fontObject.shader || (_fontObject.shader = "Text3D"));
        let text = parseData(_config.get("text"));
        text && createText(text, _fontObject);
      }
      async function overrideLocalize(text, fontObject, cb) {
        if (!text) return;
        ((_this.localized = !0),
          (fontObject.text = text),
          _this.text && _this.text.destroy && _this.text.destroy(),
          (_this.text = new Text3D.FallbackText()),
          _this.text.setColor(_fontObject.color),
          (_this.text.onSetText = (text) => _this.setText(text)));
        Text3D.createFallbackTexture(text, fontObject).then((texture) => {
          _this.text.setColor(fontObject.color);
          let geom = new PlaneGeometry(texture.width, texture.height);
          for (
            geom.computeBoundingBox(),
              "center" != fontObject.align &&
                geom.applyMatrix(new Matrix4().makeTranslation(texture.width / 2, 0, 0));
            _this.group.children.length;
          )
            _this.group.remove(_this.group.children[0]);
          return (_this.text.createMesh(geom, texture), _this.add(_this.text.group), _this.text);
        });
      }
      function createText(text, fontObject) {
        if ((fontObject.localize || _input.forceLocalize) && Text3D.missingChars(text, fontObject))
          return overrideLocalize(text, fontObject);
        (($text = $glText(text, null, null, fontObject)).enable3D(_config.get("anchor2D")),
          GLUIUtils.setRetinaMode($text, _config.get("renderRetina"), _this),
          ($text.text.onCreateShader = (shader) => {
            let shaderName = _input.get("shader");
            (shaderName &&
              (shader.fragmentShader?.length &&
                (shader.fragmentShader =
                  shader.fragmentShader.split("void main")[0] +
                  "\n" +
                  Shaders.getShader(shaderName + ".fs")),
              (shader.customCompile = shaderName)),
              ($text.text3d = _this),
              window[shaderName] &&
                ((_this.shaderClass = _this.parent.initClass(
                  window[shaderName],
                  $text,
                  shader,
                  _group,
                  _input,
                )),
                ShaderUIL.add(shader, _group).setLabel("Shader")));
          }),
          (_this.text = $text));
        let setText = $text.setText.bind($text);
        (($text.setText = function (text, obj) {
          if (obj) for (let key in obj) _fontObject[key] = obj[key];
          ((_fontObject.text = text),
            setText(text, _fontObject),
            _this.events.fire(Events.UPDATE),
            defer(setUniforms));
        }),
          $text.loaded().then((_) => {
            if (!$text) return;
            ((_this.shader = $text.mesh.shader),
              _this.shader.addUniforms({
                uTransition: { value: 1, ignoreUIL: !0 },
                uOpacity: { value: 1, ignoreUIL: !0 },
                uTranslate: { value: _this.translate },
                uRotate: { value: _this.rotate },
                uWordCount: { value: 0, ignoreUIL: !0 },
                uLetterCount: { value: 0, ignoreUIL: !0 },
                uLineCount: { value: 0, ignoreUIL: !0 },
                uByWord: { value: 0, ignoreUIL: !0 },
                uByLine: { value: 0, ignoreUIL: !0 },
                uMouse: { value: _mouse, ignoreUIL: !0 },
                uPadding: { value: 0.3, ignoreUIL: !0 },
                uScrollDelta: { value: 0, ignoreUIL: !0 },
                uBoundingMin: {
                  value: new Vector3().copy($text.dimensions.min),
                  ignoreUIL: !0,
                },
                uBoundingMax: {
                  value: new Vector3().copy($text.dimensions.max),
                  ignoreUIL: !0,
                },
              }),
              MouseFluid.instance().applyTo(_this.shader));
            let scroll = Scroll.createUnlimited();
            (_this.startRender((_) => {
              _this.shader.uniforms.uScrollDelta.value = Math.lerp(
                0.1 * scroll.delta.y,
                _this.shader.uniforms.uScrollDelta.value,
                0.05,
              );
            }),
              Text3D.onCreateShader && Text3D.onCreateShader(_this.shader));
          }),
          setUniforms());
      }
      async function setUniforms() {
        if ((await _this.wait(_this, "shader"), await $text.loaded(), _input && _input.get)) {
          let depthWrite = _input.get("depthWrite"),
            depthTest = _input.get("depthTest");
          ("boolean" == typeof depthWrite && ($text.mesh.shader.depthWrite = depthWrite),
            "boolean" == typeof depthTest && ($text.mesh.shader.depthTest = depthTest));
          let blending = _input.get("blending");
          blending && ($text.mesh.shader.blending = blending);
        }
        (_this.shader.set("uWordCount", $text.mesh.geometry.wordCount),
          _this.shader.set("uLetterCount", $text.mesh.geometry.letterCount),
          _this.shader.set("uLineCount", $text.mesh.geometry.lineCount),
          _this.shader.set("uBoundingMin", new Vector3().copy($text.dimensions.min)),
          _this.shader.set("uBoundingMax", new Vector3().copy($text.dimensions.max)));
      }
      ((_this.wildcard = _input.get("wildcard")),
        (async function () {
          ((_this.group.text = _this),
            initUIL(),
            initText(),
            Text3D.onCreate && Text3D.onCreate(_this),
            _this.startRender((_) => {
              _mouse.lerp(Mouse.normal, 0.2);
            }));
        })(),
        this.get("fontObject", (_) => _fontObject),
        (this.setProperties = function (obj) {
          return (
            (obj = { ..._fontObject, ...obj }),
            $text ? ($text.setText(obj.text, obj), setUniforms()) : createText(obj.text, obj),
            _this.text.loaded()
          );
        }),
        (this.setPropertiesCheck = function (obj, force) {
          let applyProperties = !1;
          for (const key in obj)
            _fontObject[key] !== obj[key] &&
              ((applyProperties = !0), (_fontObject[key] = obj[key]));
          return applyProperties || force ? _this.setProperties() : Promise.resolve();
        }),
        (this.setText = function (text) {
          if (((_fontObject.text = text), $text)) {
            if (_fontObject.localize && Text3D.missingChars(text, _fontObject))
              return (
                _this.group.remove($text.group),
                (_this.shader = void 0),
                ($text = null),
                void createText(text, _fontObject)
              );
            ($text.setText(text),
              setUniforms(),
              $text.mesh && ($text.mesh.onBeforeRender(), $text.mesh.updateMatrixWorld(!0)));
          } else createText(text, _fontObject);
        }),
        (this.setColor = function (color) {
          ((_fontObject.color = color), _this.text && _this.text.setColor(color));
        }),
        this.set("animateByWord", async (bool) => {
          _this.localized ||
            (await _this.wait(_this, "shader"), _this.shader.set("uByWord", bool ? 1 : 0));
        }),
        this.set("animateByLine", async (bool) => {
          _this.localized ||
            (await _this.wait(_this, "shader"), _this.shader.set("uByLine", bool ? 1 : 0));
        }),
        this.set("animationPadding", async (p) => {
          _this.localized || (await _this.wait(_this, "shader"), _this.shader.set("uPadding", p));
        }),
        this.set("transition", async (v) => {
          if (_this.localized) return (_this.text.alpha = v);
          (await _this.wait(_this, "shader"), _this.shader.set("uTransition", v));
        }),
        (this.tween = async function (val, time, ease, delay) {
          return _this.localized
            ? _this.text.tween(val, time, ease, delay)
            : (await _this.wait(_this, "shader"),
              _this.shader.tween("uTransition", val, time, ease, delay));
        }),
        (this.upload = function () {
          $text && $text.upload();
        }),
        (this.ready = function () {
          return _this.wait(_this, "shader");
        }),
        this.set("renderOrder", (v) => {
          $text && ($text.setZ(v), ($text.seoSortOrder = v));
        }),
        (this.getDimensions = async (_) => (
          await $text.loaded(),
          await $text.text.ready(),
          $text.dimensions
        )));
    },
    (_) => {
      var _projection;
      ((Text3D.missingChars = function () {
        return !1;
      }),
        (Text3D.measureScreen = async function ($text, camera = World.CAMERA, z = 0) {
          (_projection || (_projection = new ScreenProjection(World.CAMERA)),
            $text instanceof Text3D && ($text = $text.text),
            await $text.loaded(),
            $text.mesh.onBeforeRender(),
            $text.mesh.updateMatrixWorld(!0),
            await defer(),
            (_projection.camera = camera));
          let bb = new Box3();
          (bb.setFromObject($text.mesh), (bb.min.z = bb.max.z = z));
          let min = _projection.project(bb.min).clone(),
            max = _projection.project(bb.max).clone();
          return {
            width: Math.abs(min.x - max.x),
            height: Math.abs(min.y - max.y),
          };
        }));
    },
  ),
  Class(
    function UI3D(_name = "") {
      Inherit(this, Component);
      const _this = this,
        _rtSize = new Vector2(),
        _captureUnitSize = new Vector2();
      if (
        ((this.create = function (width = 512, height = 512, dpr, data) {
          (_rtSize.set(width, height),
            _captureUnitSize.set(
              width > height ? 1 : width / height,
              width > height ? height / width : 1,
            ),
            "number" != typeof dpr && ((data = dpr), (dpr = void 0)),
            data
              ? ((_this.layout = _this.initClass(
                  StageLayout,
                  Utils.getConstructorName(_this) + _name,
                  { glui: !0, data: data, noGraph: !_this.isPlayground() },
                )),
                (_this.root = _this.layout.element),
                (_this.capture = _this.initClass(
                  StageLayoutCapture,
                  _this.layout,
                  width,
                  height,
                  UI3D.getRTPool(width, height, dpr),
                )))
              : ((_this.capture = _this.initClass(
                  GLUITexture,
                  width,
                  height,
                  UI3D.getRTPool(width, height, dpr),
                )),
                (_this.root = _this.capture.root)),
            (_this.root.capture = _this.capture),
            (_this.$gluiObject = $gl(_captureUnitSize.x, _captureUnitSize.y, _this.capture)),
            (_this.capture.object3d = _this.$gluiObject));
        }),
        (this.setSize = function (size) {
          const fillRatio = new Vector2().copy(size).divide(_rtSize);
          (fillRatio.divideScalar(Math.max(fillRatio.x, fillRatio.y, 1)),
            _captureUnitSize.set(
              size.x > size.y ? 1 : size.x / size.y,
              size.x > size.y ? size.y / size.x : 1,
            ),
            _captureUnitSize.multiplyScalar(Math.max(fillRatio.x, fillRatio.y)),
            _this.capture.setSize(size.x, size.y),
            _this.$gluiObject.size(_captureUnitSize.x, _captureUnitSize.y));
        }),
        (this.useShader = function (shader) {
          _this.$gluiObject.useShader(shader);
        }),
        (this.ready = function () {
          return _this.wait(_this, "isReady");
        }),
        (this.hide = function () {
          ((_this.capture.visible = !1),
            (_this.capture.enabled = !1),
            (_this.capture.scene.visible = !1),
            _this.$gluiObject.hide(),
            (_this.capture.mouseEnabled = !1));
        }),
        (this.show = function () {
          ((_this.capture.visible = !0),
            (_this.capture.enabled = !0),
            (_this.capture.scene.visible = !0),
            _this.$gluiObject.show(),
            (_this.capture.mouseEnabled = !0));
        }),
        (this.linkMesh = function (mesh, test) {
          (_this.hide(),
            _this.startRender((_) => {
              let drawing = mesh._drawing;
              (drawing && test && (drawing = test()),
                drawing
                  ? _this.flag("drawing") || (_this.flag("drawing", !0), _this.show())
                  : _this.flag("drawing") && (_this.flag("drawing", !1), _this.hide()));
            }, 24));
        }),
        "object" == typeof _name && _name.isAppState)
      ) {
        let props = _name;
        ((_name = props.name),
          null == props.dpr && (props.dpr = 1),
          props.width &&
            props.height &&
            this.create(props.width, props.height, props.dpr, props.data));
      }
    },
    (_) => {
      var _pools = {};
      ((UI3D.getRTPool = function (width, height, dpr = World.DPR) {
        let key = width + " " + height;
        return (
          _pools[key] ||
            ((_pools[key] = RTPool.instance().clone(Texture.UNSIGNED_BYTE, 3, Texture.RGBAFormat)),
            _pools[key].setSize(width * dpr, height * dpr)),
          _pools[key]
        );
      }),
        (UI3D.findStageLayoutCapture = function (p) {
          for (; p; ) {
            if (p.capture) return p.capture;
            p = p.parent;
          }
        }));
    },
  ),
  Class(function UI3DLayer(_input, _group, _id) {
    Inherit(this, Object3D);
    const _this = this;
    var _config, _obj;
    function completeShader(shader) {
      let transparent = _input.get("transparent"),
        depthWrite = _input.get("depthWrite"),
        depthTest = _input.get("depthTest"),
        blending = _input.get("blending"),
        castShadow = _input.get("castShadow"),
        side = _input.get("side"),
        receiveShadow = _input.get("receiveShadow"),
        renderOrder = _input.getNumber("renderOrder");
      ("boolean" == typeof depthWrite && (shader.depthWrite = shader.mesh.depthWrite = depthWrite),
        "boolean" == typeof depthTest && (shader.depthTest = shader.mesh.depthTest = depthTest),
        "boolean" == typeof transparent && (shader.transparent = transparent),
        "boolean" == typeof castShadow && (shader.mesh.castShadow = castShadow),
        "boolean" == typeof receiveShadow && (shader.receiveShadow = receiveShadow),
        "number" == typeof renderOrder && (shader.mesh.renderOrder = renderOrder),
        blending && (shader.blending = blending),
        side && (shader.side = side));
    }
    ((function () {
      ((_config = InputUIL.create(_input.prefix + "ui3d", _group)),
        _config.add("class"),
        _config.add("visibilityTest"),
        _config.addToggle("retina"),
        _config.setLabel("Config"));
      let testString = _config.get("visibilityTest");
      if (testString && testString.length && !eval(testString)) return;
      let className = _config.get("class");
      if (!className || 0 == _input.get("visible")) return;
      let wildcard = _input.get("wildcard");
      if (!window[className]) throw `UI3DLayer :: ${className} doesn't exist!`;
      let obj = _this.initClass(window[className], {
        data: wildcard,
        uil: { input: _input, group: _group, id: _id },
      });
      if (!obj.$gluiObject)
        throw `UI3DLayer :: ${className} not instance of UI3D (or create() hasn't been called)`;
      (completeShader(obj.$gluiObject.shader),
        GLUIUtils.setRetinaMode(
          obj.$gluiObject,
          _config.get("retina") || UI3DLayer.overrideRetina,
          _this,
        ),
        GLUIUtils.isRetinaMode(obj.$gluiObject)
          ? _this.flag("retina", !0)
          : obj.$gluiObject.enable3D(),
        (_obj = obj));
    })(),
      (_this.getObject = function () {
        return _obj;
      }),
      (this.onDestroy = function () {
        _this.flag("retina") && GLUI.Scene.remove(_obj.$gluiObject);
      }),
      _this.get("renderOrder", () => _obj?.$gluiObject.shader.mesh.renderOrder),
      _this.set("renderOrder", (renderOrder) => {
        _obj && (_obj.$gluiObject.shader.mesh.renderOrder = renderOrder);
      }));
  }),
  Class(function UIL() {
    Inherit(this, Component);
    const _this = this;
    let _style,
      $el,
      _ui = {};
    (Hydra.ready(async (_) => {
      if (
        (await UILStorage.ready(),
        !Utils.query("editMode") &&
          !(
            Hydra.LOCAL &&
            window.Platform &&
            window.Platform.isDreamPlatform &&
            Utils.query("uil")
          ) &&
          (!Hydra.LOCAL ||
            Device.mobile ||
            window._BUILT_ ||
            (!Utils.query("uil") && !Device.detect("hydra"))))
      )
        return (function doNotLoad() {
          Hydra.LOCAL &&
            UILSocket.remoteUIL &&
            (_this.sidebar = _this.global = new UILPanel({ title: "null" }));
        })();
      (!(async function init() {
        ((function initContainer() {
          (($el = $("UIL")),
            $el
              .css({ position: "fixed", contain: "strict", top: 0 })
              .size("100%", "100%")
              .mouseEnabled(!1),
            document.body.insertAdjacentElement("beforeend", $el.div),
            $el.setZ(1e5));
        })(),
          (function initStyle() {
            let initial =
                '\n.UIL {\n  /********** Range Input Styles **********/\n  /*Range Reset*/\n  /* Removes default focus */\n  /***** Chrome, Safari, Opera and Edge Chromium styles *****/\n  /* slider track */\n  /* slider thumb */\n  /******** Firefox styles ********/\n  /* slider track */\n  /* slider thumb */\n}\n.UIL {\n  --color-black: #000000;\n  --color-white: #ffffff;\n  --color-neutral-0: var(--color-black);\n  --color-neutral-10: #161616;\n  --color-neutral-20: #272727;\n  --color-neutral-30: #303030;\n  --color-neutral-40: #363636;\n  --color-neutral-70: #737373;\n  --color-neutral-80: #8b8c8a;\n  --color-neutral-90: #cccccc;\n  --color-neutral-100: var(--color-white);\n  --color-accent-50: #FFD700;\n  --color-accent-60: #DC143C;\n  --color-accent-80: #FF4500;\n  --color-error-60: #e64040;\n  --color-error: var(--color-error-60);\n  --color-highlight: var(--color-accent-50);\n  --color-hightlight-light: var(--color-accent-60);\n  --color-highlight-transparent: rgba(255, 215, 0, 0.24);\n  --font-color-base: var(--color-white);\n  --font-color-highlight: var(--color-accent-80);\n  --color-action: var(--color-highlight);\n  --color-action--alt: var(--color-hightlight-light);\n  --color-action--contrast: var(--color-white);\n  --color-action--disabled: var(--color-neutral-70);\n  --color-icon-default: var(--color-neutral-70);\n  --color-divider-main: var(--color-neutral-40);\n  --panel-background-color: var(--color-neutral-10);\n  --font-primary: "Aquatico", Helvetica Neue, Helvetica, sans-serif;\n  --font-secondary: var(--font-primary);\n  --font-tertiary: Courier New, Courier, Lucida Sans Typewriter,\n    Lucida Typewriter, monospace;\n  --font-size-base: 12px;\n  --font-family: var(--font-primary);\n  --label1: normal 400 10px/120% var(--font-primary);\n  --label2: normal 400 11px/130% var(--font-primary);\n  --label3: normal 400 12px/130% var(--font-primary);\n  --label3-semi: normal 600 11px/130% var(--font-primary);\n  --label3-bold: normal 700 11px/130% var(--font-primary);\n  --label4-medium: 500 12px/15px var(--font-primary);\n  --line-height: 1.3;\n  --border-radius: 8px;\n  --spacing: 10px;\n  --spacing-small: 8px;\n  --border-width: 1px;\n  --border: var(--border-width) solid var(--color-neutral-40);\n  --focus-outline-width: 1px;\n  --focus-outline-offset: 0;\n  --focus-outline: var(--focus-outline-width) solid var(--color-action);\n  --duration: 300ms;\n  --timing: ease-out;\n}\n.UIL *,\n.UIL :after,\n.UIL :before {\n  background-repeat: no-repeat;\n  box-sizing: inherit;\n}\n.UIL :after,\n.UIL :before {\n  text-decoration: inherit;\n  vertical-align: inherit;\n}\n.UIL hr {\n  color: inherit;\n  height: 0;\n  overflow: visible;\n}\n.UIL details,\n.UIL main {\n  display: block;\n}\n.UIL summary {\n  display: list-item;\n}\n.UIL small {\n  font-size: 80%;\n}\n.UIL ul,\n.UIL ol {\n  list-style: none;\n  padding-left: 0;\n}\n.UIL [hidden] {\n  display: none;\n}\n.UIL abbr[title] {\n  border-bottom: none;\n  text-decoration: underline;\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n.UIL a {\n  background-color: transparent;\n}\n.UIL a:active,\n.UIL a:hover {\n  outline-width: 0;\n}\n.UIL code,\n.UIL kbd,\n.UIL pre,\n.UIL samp {\n  font-family: monospace, monospace;\n}\n.UIL pre {\n  font-size: 1em;\n}\n.UIL b,\n.UIL strong {\n  font-weight: bolder;\n}\n.UIL sub,\n.UIL sup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n.UIL sub {\n  bottom: -0.25em;\n}\n.UIL sup {\n  top: -0.5em;\n}\n.UIL table {\n  border-color: inherit;\n  text-indent: 0;\n}\n.UIL iframe {\n  border-style: none;\n}\n.UIL [type=number]::-webkit-inner-spin-button,\n.UIL [type=number]::-webkit-outer-spin-button {\n  height: var(--spacing);\n  position: absolute;\n  right: 0;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n}\n.UIL [type=search] {\n  -webkit-appearance: textfield;\n  outline-offset: -2px;\n}\n.UIL [type=search]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n.UIL textarea {\n  overflow: auto;\n  resize: vertical;\n}\n.UIL optgroup {\n  font-weight: 700;\n}\n.UIL button {\n  overflow: visible;\n}\n.UIL button,\n.UIL select {\n  text-transform: none;\n}\n.UIL [role=button],\n.UIL [type=button],\n.UIL [type=reset],\n.UIL [type=submit],\n.UIL button {\n  cursor: pointer;\n}\n.UIL [type=button]::-moz-focus-inner,\n.UIL [type=reset]::-moz-focus-inner,\n.UIL [type=submit]::-moz-focus-inner,\n.UIL button::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n.UIL [type=button]::-moz-focus-inner,\n.UIL [type=reset]::-moz-focus-inner,\n.UIL [type=submit]::-moz-focus-inner,\n.UIL button:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n.UIL [type=reset],\n.UIL [type=submit],\n.UIL button,\n.UIL html [type=button] {\n  -webkit-appearance: button;\n}\n.UIL a:focus,\n.UIL button:focus,\n.UIL input:focus,\n.UIL select:focus,\n.UIL textarea:focus {\n  outline-width: 0;\n}\n.UIL select {\n  -moz-appearance: none;\n  -webkit-appearance: none;\n}\n.UIL select::-ms-expand {\n  display: none;\n}\n.UIL select::-ms-value {\n  color: currentColor;\n}\n.UIL legend {\n  border: 0;\n  color: inherit;\n  display: table;\n  max-width: 100%;\n  white-space: normal;\n}\n.UIL ::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  color: inherit;\n  font: inherit;\n}\n.UIL [disabled] {\n  cursor: default;\n}\n.UIL img {\n  border-style: none;\n}\n.UIL progress {\n  vertical-align: baseline;\n}\n.UIL [aria-busy=true] {\n  cursor: progress;\n}\n.UIL [aria-controls] {\n  cursor: pointer;\n}\n.UIL [aria-disabled=true] {\n  cursor: default;\n}\n.UIL button,\n.UIL [type=button],\n.UIL [type=reset],\n.UIL [type=submit] {\n  -webkit-appearance: none;\n          appearance: none;\n  background-color: transparent;\n  border: var(--border);\n  border-color: var(--color-white);\n  border-radius: calc(var(--border-radius) * 1.5);\n  color: var(--color-action) --contrast;\n  cursor: pointer;\n  display: inline-block;\n  font: var(--label4-medium);\n  padding: calc(var(--spacing-small) * 1.5) calc(var(--spacing) * 2);\n  text-align: center;\n  text-decoration: none;\n  transition: background-color var(--duration) var(--timing);\n  -webkit-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n}\n.UIL button:hover,\n.UIL [type=button]:hover,\n.UIL [type=reset]:hover,\n.UIL [type=submit]:hover {\n  background-color: var(--color-action);\n  border-color: var(--color-action);\n}\n.UIL button:focus,\n.UIL [type=button]:focus,\n.UIL [type=reset]:focus,\n.UIL [type=submit]:focus {\n  outline: var(--focus-outline);\n  outline-offset: var(--focus-outline-offset);\n}\n.UIL button:disabled,\n.UIL [type=button]:disabled,\n.UIL [type=reset]:disabled,\n.UIL [type=submit]:disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n.UIL button.solid,\n.UIL [type=button].solid,\n.UIL [type=reset].solid,\n.UIL [type=submit].solid {\n  background-color: var(--color-action);\n  border-color: var(--color-action);\n}\n.UIL button.solid:hover,\n.UIL [type=button].solid:hover,\n.UIL [type=reset].solid:hover,\n.UIL [type=submit].solid:hover {\n  background-color: transparent;\n  border-color: var(--color-white);\n}\n.UIL button.small,\n.UIL [type=button].small,\n.UIL [type=reset].small,\n.UIL [type=submit].small {\n  border-radius: var(--border-radius);\n  font: var(--label1);\n  padding: calc(var(--spacing) / 2) var(--spacing);\n}\n.UIL {\n  --form-box-shadow: inset 0 --border-width 0.1875rem rgba(#000, 0.06);\n  --form-box-shadow-focus: var(--form-box-shadow),\n    0 0 0.3125rem var(--color-action);\n  --form-group-width: 256px;\n  --form-content-max-width: 180px;\n}\n.UIL fieldset {\n  background-color: transparent;\n  border: 0;\n  margin: 0;\n  padding: 0;\n}\n.UIL legend {\n  font-weight: 600;\n  margin-bottom: var(--spacing-small);\n  padding: 0;\n}\n.UIL .form-group {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--spacing-small);\n  width: 100%;\n}\n.UIL .form-group > label,\n.UIL .form-group > .label {\n  word-wrap: break-word;\n  -webkit-hyphens: auto;\n      -ms-hyphens: auto;\n          hyphens: auto;\n  white-space: normal;\n  padding-left: 5px;\n  max-width: calc( (var(--form-group-width) - var(--form-content-max-width) - var(--spacing-small)) * 1.5 );\n}\n.UIL .form-group > *:last-child {\n  width: 100%;\n  max-width: var(--form-content-max-width);\n}\n.UIL .label,\n.UIL label {\n  display: block;\n  font: var(--label2);\n  margin-bottom: 0;\n}\n.UIL input,\n.UIL select,\n.UIL textarea {\n  display: block;\n  font-family: var(--font-family);\n}\n.UIL select {\n  background-color: transparent;\n  border: none;\n  padding-right: calc(var(--spacing) * 2);\n  margin: 0;\n}\n.UIL .select-wrapper {\n  width: 100%;\n}\n.UIL select,\n.UIL [type=color],\n.UIL [type=date],\n.UIL [type=datetime],\n.UIL [type=datetime-local],\n.UIL [type=email],\n.UIL [type=month],\n.UIL [type=number],\n.UIL [type=password],\n.UIL [type=search],\n.UIL [type=tel],\n.UIL [type=text]:not(.no-style),\n.UIL [type=time],\n.UIL [type=url],\n.UIL [type=week],\n.UIL input:not([type]),\n.UIL textarea {\n  -webkit-appearance: none;\n          appearance: none;\n  background-color: var(--color-black);\n  border: var(--border);\n  border-radius: var(--border-radius);\n  box-shadow: var(--form-box-shadow);\n  box-sizing: border-box;\n  color: var(--font-color-highlight);\n  font: var(--label2);\n  margin-bottom: 0;\n  padding: var(--spacing-small);\n  transition: border-color var(--duration) var(--timing);\n  width: 100%;\n  position: relative;\n}\n.UIL select:focus,\n.UIL [type=color]:focus,\n.UIL [type=date]:focus,\n.UIL [type=datetime]:focus,\n.UIL [type=datetime-local]:focus,\n.UIL [type=email]:focus,\n.UIL [type=month]:focus,\n.UIL [type=number]:focus,\n.UIL [type=password]:focus,\n.UIL [type=search]:focus,\n.UIL [type=tel]:focus,\n.UIL [type=text]:focus:not(.no-style),\n.UIL [type=time]:focus,\n.UIL [type=url]:focus,\n.UIL [type=week]:focus,\n.UIL input:not([type]):focus,\n.UIL textarea:focus {\n  box-shadow: var(--form-box-shadow-focus);\n}\n.UIL select:disabled,\n.UIL [type=color]:disabled,\n.UIL [type=date]:disabled,\n.UIL [type=datetime]:disabled,\n.UIL [type=datetime-local]:disabled,\n.UIL [type=email]:disabled,\n.UIL [type=month]:disabled,\n.UIL [type=number]:disabled,\n.UIL [type=password]:disabled,\n.UIL [type=search]:disabled,\n.UIL [type=tel]:disabled,\n.UIL [type=text]:disabled,\n.UIL [type=time]:disabled,\n.UIL [type=url]:disabled,\n.UIL [type=week]:disabled,\n.UIL input:not([type]):disabled,\n.UIL textarea:disabled {\n  cursor: not-allowed;\n}\n.UIL select:disabled:hover,\n.UIL [type=color]:disabled:hover,\n.UIL [type=date]:disabled:hover,\n.UIL [type=datetime]:disabled:hover,\n.UIL [type=datetime-local]:disabled:hover,\n.UIL [type=email]:disabled:hover,\n.UIL [type=month]:disabled:hover,\n.UIL [type=number]:disabled:hover,\n.UIL [type=password]:disabled:hover,\n.UIL [type=search]:disabled:hover,\n.UIL [type=tel]:disabled:hover,\n.UIL [type=text]:disabled:hover,\n.UIL [type=time]:disabled:hover,\n.UIL [type=url]:disabled:hover,\n.UIL [type=week]:disabled:hover,\n.UIL input:not([type]):disabled:hover,\n.UIL textarea:disabled:hover {\n  border: var(--border);\n}\n.UIL select::-webkit-input-placeholder, .UIL [type=color]::-webkit-input-placeholder, .UIL [type=date]::-webkit-input-placeholder, .UIL [type=datetime]::-webkit-input-placeholder, .UIL [type=datetime-local]::-webkit-input-placeholder, .UIL [type=email]::-webkit-input-placeholder, .UIL [type=month]::-webkit-input-placeholder, .UIL [type=number]::-webkit-input-placeholder, .UIL [type=password]::-webkit-input-placeholder, .UIL [type=search]::-webkit-input-placeholder, .UIL [type=tel]::-webkit-input-placeholder, .UIL [type=text]::-webkit-input-placeholder, .UIL [type=time]::-webkit-input-placeholder, .UIL [type=url]::-webkit-input-placeholder, .UIL [type=week]::-webkit-input-placeholder, .UIL input:not([type])::-webkit-input-placeholder, .UIL textarea::-webkit-input-placeholder {\n  color: var(--font-color-base);\n  opacity: 0.25;\n}\n.UIL select:-ms-input-placeholder, .UIL [type=color]:-ms-input-placeholder, .UIL [type=date]:-ms-input-placeholder, .UIL [type=datetime]:-ms-input-placeholder, .UIL [type=datetime-local]:-ms-input-placeholder, .UIL [type=email]:-ms-input-placeholder, .UIL [type=month]:-ms-input-placeholder, .UIL [type=number]:-ms-input-placeholder, .UIL [type=password]:-ms-input-placeholder, .UIL [type=search]:-ms-input-placeholder, .UIL [type=tel]:-ms-input-placeholder, .UIL [type=text]:-ms-input-placeholder, .UIL [type=time]:-ms-input-placeholder, .UIL [type=url]:-ms-input-placeholder, .UIL [type=week]:-ms-input-placeholder, .UIL input:not([type]):-ms-input-placeholder, .UIL textarea:-ms-input-placeholder {\n  color: var(--font-color-base);\n  opacity: 0.25;\n}\n.UIL select::-ms-input-placeholder, .UIL [type=color]::-ms-input-placeholder, .UIL [type=date]::-ms-input-placeholder, .UIL [type=datetime]::-ms-input-placeholder, .UIL [type=datetime-local]::-ms-input-placeholder, .UIL [type=email]::-ms-input-placeholder, .UIL [type=month]::-ms-input-placeholder, .UIL [type=number]::-ms-input-placeholder, .UIL [type=password]::-ms-input-placeholder, .UIL [type=search]::-ms-input-placeholder, .UIL [type=tel]::-ms-input-placeholder, .UIL [type=text]::-ms-input-placeholder, .UIL [type=time]::-ms-input-placeholder, .UIL [type=url]::-ms-input-placeholder, .UIL [type=week]::-ms-input-placeholder, .UIL input:not([type])::-ms-input-placeholder, .UIL textarea::-ms-input-placeholder {\n  color: var(--font-color-base);\n  opacity: 0.25;\n}\n.UIL select::placeholder,\n.UIL [type=color]::placeholder,\n.UIL [type=date]::placeholder,\n.UIL [type=datetime]::placeholder,\n.UIL [type=datetime-local]::placeholder,\n.UIL [type=email]::placeholder,\n.UIL [type=month]::placeholder,\n.UIL [type=number]::placeholder,\n.UIL [type=password]::placeholder,\n.UIL [type=search]::placeholder,\n.UIL [type=tel]::placeholder,\n.UIL [type=text]::placeholder,\n.UIL [type=time]::placeholder,\n.UIL [type=url]::placeholder,\n.UIL [type=week]::placeholder,\n.UIL input:not([type])::placeholder,\n.UIL textarea::placeholder {\n  color: var(--font-color-base);\n  opacity: 0.25;\n}\n.UIL [type=search] {\n  -webkit-appearance: textfield;\n}\n.UIL textarea {\n  resize: vertical;\n}\n.UIL [type=file] {\n  width: 100%;\n}\n.UIL select {\n  width: 100%;\n}\n.UIL input:focus-visible:not(.no-style),\n.UIL textarea:focus-visible,\n.UIL select:focus-visible {\n  outline: var(--focus-outline);\n  outline-offset: var(--focus-outline-offset);\n}\n.UIL input[type=checkbox]:not(.regular-checkbox),\n.UIL input[type=radio] {\n  height: 0;\n  width: 0;\n  visibility: visible;\n  margin: 0;\n}\n.UIL input[type=checkbox]:not(.regular-checkbox) + label,\n.UIL input[type=radio] + label {\n  cursor: pointer;\n  border: var(--border);\n  text-indent: -9999px;\n  width: 44px;\n  height: 28px;\n  background: var(--color-black);\n  display: block;\n  border-radius: 28px;\n  position: relative;\n}\n.UIL input[type=checkbox]:not(.regular-checkbox) + label:after,\n.UIL input[type=radio] + label:after {\n  content: "";\n  position: absolute;\n  top: 8px;\n  left: 8px;\n  width: 12px;\n  height: 12px;\n  background-color: var(--color-action--disabled);\n  border-radius: 12px;\n  transition: 0.3s;\n}\n.UIL input[type=checkbox]:not(.regular-checkbox):checked + label,\n.UIL input[type=radio]:checked + label {\n  background: var(--color-action);\n}\n.UIL input[type=checkbox]:not(.regular-checkbox):checked + label:after,\n.UIL input[type=radio]:checked + label:after {\n  background-color: var(--color-white);\n}\n.UIL input[type=checkbox]:not(.regular-checkbox):checked + label:after,\n.UIL input[type=radio]:checked + label:after {\n  left: calc(100% - 8px);\n  -webkit-transform: translateX(-100%);\n          transform: translateX(-100%);\n}\n.UIL input[type=checkbox]:not(.regular-checkbox) + label:active:after,\n.UIL input[type=radio] + label:active:after {\n  width: 16px;\n}\n.UIL input[type=checkbox]:not(.regular-checkbox):focus-visible,\n.UIL input[type=radio]:focus-visible {\n  outline: none;\n  border: none;\n}\n.UIL input[type=checkbox]:not(.regular-checkbox):focus-visible + label,\n.UIL input[type=checkbox]:not(.regular-checkbox):focus-visible + .label,\n.UIL input[type=radio]:focus-visible + label,\n.UIL input[type=radio]:focus-visible + .label {\n  border: var(--border);\n  border-color: var(--color-action);\n}\n.UIL input[type=checkbox]:not(.regular-checkbox):focus-visible:checked + label,\n.UIL input[type=checkbox]:not(.regular-checkbox):focus-visible:checked + .label,\n.UIL input[type=radio]:focus-visible:checked + label,\n.UIL input[type=radio]:focus-visible:checked + .label {\n  border: var(--border);\n  border-color: var(--color-white);\n}\n.UIL .checkbox-control {\n  display: flex;\n  gap: calc(var(--spacing-small) / 2);\n  align-items: center;\n  line-height: 1;\n}\n.UIL .regular-checkbox {\n  -webkit-appearance: none;\n          appearance: none;\n  background-color: var(--color-black);\n  margin: 0;\n  width: 20px;\n  height: 20px;\n  max-width: 20px;\n  min-width: 20px;\n  color: currentColor;\n  border: var(--border);\n  border-radius: calc(var(--border-radius) / 2);\n  -webkit-transform: translateY(-0.075em);\n          transform: translateY(-0.075em);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.UIL .regular-checkbox:before {\n  border-radius: calc(var(--border-radius) / 4);\n  content: "";\n  width: calc(20px / 2);\n  height: calc(20px / 2);\n  -webkit-transform: scale(0);\n          transform: scale(0);\n  transition: 120ms -webkit-transform ease-in-out;\n  transition: 120ms transform ease-in-out;\n  transition: 120ms transform ease-in-out, 120ms -webkit-transform ease-in-out;\n  box-shadow: inset 1em 1em var(--color-action);\n}\n.UIL .regular-checkbox:checked::before {\n  -webkit-transform: scale(1);\n          transform: scale(1);\n}\n.UIL {\n  box-sizing: border-box;\n  scroll-behavior: smooth;\n}\n.UIL *,\n.UIL *::before,\n.UIL *::after {\n  box-sizing: inherit;\n}\n.UIL figure {\n  margin: 0;\n}\n.UIL img,\n.UIL picture {\n  display: block;\n  margin: 0;\n  max-width: 100%;\n}\n.UIL {\n  color: var(--font-color-base);\n  font-family: var(--font-family);\n  font-size: var(--font-size-base);\n  line-height: var(--line-height);\n  letter-spacing: 0.01em;\n}\n.UIL ::selection {\n  background-color: var(--color-action);\n  color: var(--color-action--contrast);\n}\n.UIL p {\n  margin: 0 0 var(--spacing-small);\n  overflow-wrap: break-word;\n  -webkit-hyphens: auto;\n      -ms-hyphens: auto;\n          hyphens: auto;\n}\n.UIL a {\n  -webkit-text-decoration-skip: ink;\n          text-decoration-skip-ink: auto;\n  transition: color var(--duration) var(--timing);\n}\n.UIL a:focus {\n  outline: var(--focus-outline);\n  outline-offset: var(--focus-outline-offset);\n}\n.UIL hr {\n  border-bottom: var(--border);\n  border-left: 0;\n  border-right: 0;\n  border-top: 0;\n  margin: var(--spacing) 0;\n}\n.UIL .color-selector {\n  background-color: var(--color-black);\n  border: var(--border);\n  border-radius: var(--border-radius);\n  box-shadow: var(--form-box-shadow);\n  color: var(--font-color-highlight);\n  font: var(--label2);\n  margin-bottom: 0;\n  padding: var(--spacing-small);\n  transition: border-color var(--duration) var(--timing);\n  width: 100%;\n  position: relative;\n  display: flex;\n  gap: var(--spacing-small);\n  align-items: center;\n}\n.UIL .color-selector:has(input:focus-visible) {\n  outline: var(--focus-outline);\n  outline-offset: var(--focus-outline-offset);\n}\n.UIL .color-selector .color-chip {\n  width: 20px;\n  height: 16px;\n  border-radius: calc(var(--border-radius) / 2);\n  border: var(--border);\n}\n.UIL .color-selector .color-text {\n  text-transform: uppercase;\n}\n.UIL .color-selector .hidden {\n  position: absolute;\n  left: 0;\n  opacity: 0;\n}\n.UIL {\n  --thumb-size: var(--spacing-small);\n  --thumb-radius: calc(var(--thumb-size) / 2);\n  --color-track: var(--color-black);\n  --track-height: calc(var(--thumb-size) / 2);\n}\n.UIL input[type=range] {\n  -webkit-appearance: none;\n  appearance: none;\n  background: transparent;\n  cursor: pointer;\n  width: 100%;\n}\n.UIL input[type=range]:focus {\n  outline: none;\n}\n.UIL input[type=range]::-webkit-slider-runnable-track {\n  background-color: var(--color-track);\n  border-radius: calc(var(--track-height) / 2);\n  height: var(--track-height);\n  border: var(--border);\n}\n.UIL input[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  /* Override default look */\n  appearance: none;\n  margin-top: -4px;\n  /* Centers thumb on the track */\n  /*custom styles*/\n  background-color: var(--color-action);\n  height: var(--thumb-size);\n  width: var(--thumb-size);\n  border-radius: var(--thumb-radius);\n}\n.UIL input[type=range]:focus::-webkit-slider-thumb {\n  border: var(--border);\n  outline: 1px solid var(--color-hightlight-light);\n  outline-offset: 0.125rem;\n}\n.UIL input[type=range]::-moz-range-track {\n  background-color: var(--color-track);\n  border-radius: calc(var(--track-height) / 2);\n  height: var(--track-height);\n  border: var(--border);\n}\n.UIL input[type=range]::-moz-range-thumb {\n  border: none;\n  /*Removes extra border that FF applies*/\n  border-radius: var(--thumb-radius);\n  /*Removes default border-radius that FF applies*/\n  /*custom styles*/\n  background-color: var(--color-action);\n  height: var(--thumb-size);\n  width: var(--thumb-size);\n}\n.UIL input[type=range]:focus::-moz-range-thumb {\n  border: var(--border);\n  outline: 1px solid var(--color-hightlight-light);\n  outline-offset: 0.125rem;\n}\n.UIL ::-webkit-scrollbar {\n  width: 2px;\n  height: 2px;\n}\n.UIL ::-webkit-scrollbar-track {\n  background: var(--color-neutral-10);\n}\n.UIL ::-webkit-scrollbar-thumb {\n  background: var(--color-highlight);\n}\n.UIL .sr-only,\n.UIL .visibility-hidden {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n',
              style = document.head.appendChild(document.createElement("style"));
            (((style.type = "text/css"), (style.id = "uil-style")),
              style.appendChild(
                document.createTextNode(
                  (() => {
                    let css = initial;
                    if (window.ACTIVE_THEME_COLORS) {
                      const colors = window.ACTIVE_THEME_COLORS;
                      const hexToRgb = (hex) => {
                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return result
                          ? parseInt(result[1], 16) +
                              ", " +
                              parseInt(result[2], 16) +
                              ", " +
                              parseInt(result[3], 16)
                          : "255, 215, 0";
                      };
                      css = css
                        .replace(/#FFD700/gi, colors.primary)
                        .replace(/#DC143C/gi, colors.dark)
                        .replace(/#FF4500/gi, colors.highlight)
                        .replace(
                          /rgba\(255,\s*215,\s*0,\s*0\.24\)/g,
                          `rgba(${hexToRgb(colors.primary)}, 0.24)`,
                        );
                    }
                    return css;
                  })(),
                ),
              ),
              (_style = style));
          })(),
          (function initSidebar() {
            (_this.add(new UILPanel({ title: "sidebar" })),
              _this.add(
                new UILPanel({
                  title: "global",
                  options: { side: "left", hideToolbar: !0 },
                }),
              ),
              (_this.globalTabs = _this.initClass(
                UILTabs,
                [
                  {
                    id: "playground",
                    label: "Graph",
                    content: null,
                    active: !0,
                    disabled: !1,
                    hidden: !1,
                    draggable: !1,
                    hideToobar: !0,
                  },
                  {
                    id: "global",
                    label: "Global",
                    content: null,
                    active: !1,
                    disabled: !1,
                    hidden: !1,
                    draggable: !1,
                  },
                  {
                    id: "performance",
                    label: "Performance",
                    content: UILPerformance,
                    active: !1,
                    disabled: !1,
                    hidden: !1,
                    draggable: !1,
                  },
                  {
                    id: "memory",
                    label: "Memory",
                    content: UILMemory,
                    active: !1,
                    disabled: !1,
                    hidden: !1,
                    draggable: !1,
                  },
                ],
                [_this.global.element],
              )));
          })(),
          (function initGraph() {
            if (!_this.sidebar) return;
            _this.globalTabs.addGraph(UILGraph.instance().element.div);
          })());
      })(),
        (_this.loaded = !0));
    }),
      (this.ready = function () {
        return _this.wait(_this, "loaded");
      }),
      (this.add = function (panel) {
        return ((_ui[panel.id] = panel), (_this[panel.id] = panel), $el.add(panel), _this);
      }),
      (this.remove = function (id) {
        let $panel = _ui[id];
        return (
          $panel.eliminate && $panel.eliminate(),
          $panel.destroy(),
          delete _ui[id],
          delete _this[id],
          _this
        );
      }),
      (this.find = function (id) {
        return Object.values(_ui).reduce((acc, el) => acc.concat(el.find(id)), []);
      }),
      (this.enableSorting = function (id, enable) {
        let el = _this.find(id)[0];
        return (el && el.enableSorting && el.enableSorting(enable), _this);
      }),
      (this.addCSS = function (control, style) {
        if (control.styled) return;
        let node = document.createTextNode(style);
        return (_style && _style.appendChild(node), (control.styled = !0), _this);
      }),
      (this.REORDER = "uil_reorder"));
  }, "static"),
  Class(function CameraUIL() {
    ((this.UPDATE = "camera_uil_update"),
      (this.add = function (light, group) {
        return new CameraUILConfig(light, null === group ? null : group || UIL.global);
      }));
  }, "static"),
  Class(function CameraUILConfig(_camera, _uil) {
    const _this = this;
    if (!_camera.prefix) throw "camera.prefix required when using MeshUIL";
    var prefix = "CAMERA_" + _camera.prefix,
      _group = _uil ? createFolder() : null,
      _dynamicFOVCallback = null;
    function createFolder() {
      if (!UIL.sidebar) return null;
      let folder = new UILFolder(prefix, { label: _camera.prefix, closed: !0 });
      return (_uil.add(folder), folder);
    }
    function initFOV(key) {
      let initValue = UILStorage.get(`${prefix}${key}`) || _camera.camera.fov || 9999;
      if (_group) {
        let number = new UILControlNumber(`${prefix}${key}`, {
          label: key,
          value: initValue,
          step: 0.05,
        });
        (number.onFinishChange((e) => {
          (_group && _this["tweenUIL_" + key]?.(e),
            _camera.setFOV(e),
            UILStorage.set(`${prefix}${key}`, e));
        }),
          _group.add(number));
      }
      defer((_) => {
        _camera.setFOV(initValue);
      });
    }
    function initVec(key) {
      let initValue = UILStorage.get(`${prefix}${key}`) || _camera[key]?.toArray();
      if (initValue) {
        if (_group) {
          UILStorage.state.bind(`${prefix}${key}`, (val) => _camera[key].fromArray(val));
          let vector = new UILControlVector(`${prefix}${key}`, {
            label: key,
            value: initValue,
            step: 0.05,
          });
          (vector.onChange((e) => {
            (_group && _this["tweenUIL_" + key]?.(e), _camera[key].fromArray(e));
          }),
            vector.onFinishChange((e) => UILStorage.set(`${prefix}${key}`, e)),
            _group.add(vector),
            (_this["forceUpdate" + key.toUpperCase()] = (_) => {
              let val = _camera[key].toArray();
              _this["tweenUIL_" + key]
                ? _this["tweenUIL_" + key](val)
                : vector.force(_camera[key].toArray(), !0);
            }));
        }
        _camera[key].fromArray(initValue);
      }
    }
    function initNumber(key) {
      let initValue =
        UILStorage.get(`${prefix}${key}`) || (void 0 === _camera[key] ? 9999 : _camera[key]);
      if (_group) {
        UILStorage.state.bind(`${prefix}${key}`, (val) => (_camera[key] = val));
        let number = new UILControlNumber(`${prefix}${key}`, {
          label: key,
          value: initValue,
          step: 0.05,
        });
        (number.onChange((e) => {
          ((_camera[key] = e), _group && _this["tweenUIL_" + key]?.(e));
        }),
          number.onFinishChange((e) => UILStorage.set(`${prefix}${key}`, e)),
          _group.add(number));
      }
      _camera[key] = initValue;
    }
    function initRotation(key, applyValue) {
      let toRadians = (array) =>
          array ? ((array.length = 3), array.map((x) => Math.radians(x))) : [0, 0, 0],
        initValue = toRadians(UILStorage.get(`${prefix}${key}`));
      if (_group) {
        UILStorage.state.bind(`${prefix}${key}`, (val) => {
          (_camera[key] || _camera.group[key]).fromArray(toRadians(val));
        });
        let vector = new UILControlVector(`${prefix}${key}`, {
          label: key,
          value:
            ((array = initValue),
            array ? ((array.length = 3), array.map((x) => Math.degrees(x))) : [0, 0, 0]),
        });
        (vector.onChange((e) => {
          (_group && _this["tweenUIL_" + key]?.(toRadians(e)), applyValue(toRadians(e), key));
        }),
          vector.onFinishChange((e) => UILStorage.set(`${prefix}${key}`, e)),
          _group.add(vector));
      }
      var array;
      applyValue(initValue, key);
    }
    function initDynamicFOV(key) {
      let defaultCode = "",
        code = UILStorage.get(`${prefix}${key}Code`) || defaultCode,
        evalCode = (value) => {
          let method = value.includes("return")
            ? `(function(){ return function getFOV() { ${value}}})()`
            : `(function(){ return function getFOV() { return ${value}}})()`;
          _camera._getDynamicFOV = eval(method);
        },
        editCode = (_) => {
          let editor = new UILExternalEditor(`${prefix}${key}`, 400, 900);
          (editor.setCode(code, "c"),
            (editor.onSave = (value) => {
              (UILStorage.set(`${prefix}${key}Code`, value),
                evalCode(value),
                (code = value),
                _camera.dynamicFOV());
            }));
        },
        btn = new UILControlButton("btn", {
          actions: [{ title: "Dynamic FOV", callback: editCode }],
          hideLabel: !0,
        });
      (_group && _group.add(btn),
        defer((_) => {
          (evalCode(code),
            (_camera.dynamicFOV = (_) => {
              if (_camera.camera.isOrthographicCamera) return;
              let fov = _camera._getDynamicFOV?.() || _camera.camera.fov;
              if (isNaN(fov)) return console.warn(`${prefix} Dynamic FOV requires a float value`);
              _camera.setFOV(fov);
            }),
            _camera.onResize((_) => _camera.dynamicFOV()));
        }));
    }
    function initType() {
      let initValue = UILStorage.get(`${prefix}type`) || "perspective";
      if (_group) {
        let control = new UILControlSelect(`${prefix}type`, {
          label: "Type",
          value: initValue,
          options: [
            { label: "Perspective", value: "perspective" },
            { label: "Orthographic", value: "orthographic" },
          ],
        });
        (UILStorage.state.bind(`${prefix}type`, (val) => control.onChange(val)),
          control.onChange((e) => {
            "orthographic" === e ? _camera.useOrthographic() : _camera.usePerspective();
          }),
          control.onFinishChange((e) => UILStorage.set(`${prefix}type`, e)),
          _group.add(control));
      }
      "orthographic" === initValue && _camera.useOrthographic();
    }
    function addListeners() {
      Events.emitter._addEvent(CameraUIL.UPDATE, update, _this);
    }
    function update(e) {
      e.prefix == prefix &&
        e.group != _this &&
        (e.fov && _camera.setFOV(e.val),
        e.number && (_camera[e.key] = e.val),
        e.rotation && _camera.group[e.key].fromArray(e.val),
        e.vec && _camera[e.key].fromArray(e.val));
    }
    (initType(),
      _camera.position && initVec("position"),
      _camera.group &&
        ((_camera.groupPos = _camera.group.position),
        initVec("groupPos"),
        initRotation("rotation", (value, key) => {
          _camera.group[key].fromArray(value);
        })),
      initFOV("fov"),
      initNumber("zoom"),
      initNumber("near"),
      initNumber("far"),
      _camera.moveXY &&
        (initVec("moveXY"),
        initVec("lookAt"),
        initRotation("cameraRotation", (value, key) => {
          _camera[key].fromArray(value);
        }),
        initVec("viewportFocus"),
        initNumber("lerpSpeed"),
        initNumber("lerpSpeed2"),
        initNumber("deltaRotate"),
        initNumber("deltaLerp"),
        initNumber("wobbleSpeed"),
        initNumber("wobbleStrength"),
        initNumber("wobbleZ")),
      initDynamicFOV("dynamicFOV"),
      _group && addListeners(),
      (this.setLabel = function (name) {
        _group && _group.setLabel(name);
      }));
  }),
  Class(function InputUIL() {
    ((this.UPDATE = "inputUil_Update"),
      (this.create = function (name, group, decoupled) {
        return new InputUILConfig(name, null === group ? null : group || UIL.global, decoupled);
      }));
  }, "static"),
  Class(function InputUILConfig(_name, _uil, _decoupled, _slim) {
    var _cache,
      _this = this;
    const prefix = "INPUT_" + _name;
    var _group = _uil
        ? (function createFolder() {
            if (!UIL.sidebar) return null;
            let folder = new UILFolder(_name, { closed: !0 });
            _decoupled || (_uil.add(folder), _uil == UIL.sidebar && folder.hide());
            return folder;
          })()
        : null,
      _fields = _uil ? {} : null;
    function externalUpdate(e) {
      e.prefix == prefix &&
        e.group != _this &&
        (UILStorage.set(`${prefix}_${e.key}`, e.value), _this.onUpdate && _this.onUpdate(e.key));
    }
    ((_this.group = _group),
      (_this.keys = []),
      _uil &&
        (function addListeners() {
          Events.emitter._addEvent(InputUIL.UPDATE, externalUpdate, _this);
        })(),
      (this.state = AppState.createLocal()),
      (this.get = function (key) {
        if (_cache && void 0 !== _cache[key]) return _cache[key];
        let val = UILStorage.get(`${prefix}_${key}`);
        return "boolean" == typeof val
          ? val
          : val && "" != val
            ? "true" === val ||
              ("false" !== val &&
                (val.charAt && "[" == val.charAt(0)
                  ? JSON.parse(val)
                  : (UIL.global || (_cache || (_cache = {}), _cache[key] || (_cache[key] = val)),
                    val)))
            : void 0;
      }),
      (this.getFilePath = function (key) {
        let data = this.get(key);
        return "{" === data?.charAt?.(0)
          ? ((data = JSON.parse(data)), data.relative.includes(".") ? data.relative : data.src)
          : "object" == typeof data
            ? data.relative.includes(".")
              ? data.relative
              : data.src
            : data;
      }),
      (this.getNumber = function (key) {
        let number = Number(this.get(key));
        return (isNaN(number) && (number = 0), number);
      }),
      _slim ||
        ((this.add = function (key, initValue, uil = window.UILControlText, options, params = {}) {
          if ((_this.keys.push(key), !_group || "hidden" == initValue || !UIL.sidebar)) return this;
          let fallback;
          "string" == typeof uil && ((fallback = uil), (uil = window.UILControlText));
          let value = UILStorage.get(`${prefix}_${key}`);
          if (
            (void 0 === value && fallback && (value = UILStorage.get(`${prefix}_${fallback}`)),
            "true" === value && (value = !0),
            "false" === value && (value = !1),
            uil == UILControlVector && "string" == typeof value && (value = JSON.parse(value)),
            void 0 === value && (value = initValue),
            "string" == typeof value && (uil == UILControlImage || uil == UILControlFile))
          )
            try {
              value = JSON.parse(value);
            } catch (e) {}
          let change = (val, fromInit) => {
            ((val = "string" == typeof val ? val : JSON.stringify(val)),
              UILStorage.set(`${prefix}_${key}`, val),
              _this.onUpdate && _this.onUpdate(key, val),
              fromInit ||
                Events.emitter._fireEvent(InputUIL.UPDATE, {
                  prefix: prefix,
                  key: key,
                  value: val,
                  group: _this,
                }));
          };
          ("string" != typeof initValue &&
            "number" != typeof initValue &&
            uil != UILControlVector) ||
            UILStorage.get(`${prefix}_${key}`) ||
            change(initValue, !0);
          let opts = Utils.mergeObject(params, {
            label: key,
            value: value,
            options: options,
          });
          uil == window.UILControlButton && (opts = options);
          let config = new uil(`${prefix}_${key}`, opts);
          return (
            config.onFinishChange(change),
            UILStorage.state.bind(`${prefix}_${key}`, (val) => _this.state.set(key, val)),
            (uil != UILControlVector && uil != UILControlRange) || config.onChange(change),
            _group.add(config),
            (_fields[key] = config),
            this
          );
        }),
        (this.addToggle = function (key, initValue) {
          return UIL.sidebar ? this.add(key, initValue, UILControlCheckbox) : this;
        }),
        (this.addSelect = function (key, options) {
          return UIL.sidebar ? this.add(key, null, UILControlSelect, options) : this;
        }),
        (this.addImage = function (key, options) {
          return UIL.sidebar ? this.add(key, null, UILControlImage, null, options) : this;
        }),
        (this.addFile = function (key, options) {
          if (!UIL.sidebar) return this;
          this.get(key);
          return this.add(key, null, UILControlFile, null, options);
        }),
        (this.addRange = function (key, initValue, options) {
          return UIL.sidebar ? this.add(key, initValue, UILControlRange, null, options) : this;
        }),
        (this.addNumber = function (key, initValue, step) {
          return UIL.sidebar
            ? this.add(key, initValue, UILControlNumber, null, { step: step })
            : this;
        }),
        (this.addColor = function (key, initValue = new Color()) {
          return UIL.sidebar ? this.add(key, initValue.getHexString(), UILControlColor) : this;
        }),
        (this.addTextarea = function (key, initValue) {
          return UIL.sidebar
            ? this.add(key, initValue, UILControlTextarea, null, {
                monospace: !0,
                rows: 4,
              })
            : this;
        }),
        (this.addButton = function (key, options) {
          if (!UIL.sidebar) return this;
          if ("function" == typeof options) {
            let cb = options;
            options = {
              actions: [{ title: key, callback: (_) => cb(key) }],
              hideLabel: !0,
            };
          }
          return this.add(key, null, UILControlButton, options);
        }),
        (this.addVector = function (key, initValue, options) {
          return UIL.sidebar
            ? (options || (options = { step: 0.05 }),
              this.add(key, initValue, UILControlVector, null, options))
            : this;
        }),
        (this.getImage = function (key) {
          let data = this.get(key);
          if (data) return JSON.parse(data).src;
        }),
        (this.setValue = function (key, value) {
          if (
            (UILStorage.set(`${prefix}_${key}`, value),
            _this.onUpdate && _this.onUpdate(key),
            _this.state.set(key, value),
            _fields)
          ) {
            let field = _fields[key];
            field && ((field.value = value), field.update && field.update());
          }
          return this;
        }),
        (this.copyFrom = function (input, fields) {
          fields.forEach((key) => {
            let val = input.get(key);
            void 0 !== val &&
              ("string" != typeof val && (val = JSON.stringify(val)), _this.setValue(key, val));
          });
        }),
        (this.setLabel = function (name) {
          _group && _group.setLabel(name);
        }),
        (this.getField = function (key) {
          if (_fields) return _fields[key];
        }),
        (this.setDescription = function (key, desc) {
          _this.getField(key)?.setDescription(desc);
        })));
  }),
  Class(function ListUIL() {
    Inherit(this, Component);
    const _this = this;
    var _panel,
      _created = {};
    function removePanel() {
      _panel &&
        _panel.destroy &&
        (_this.events.unsub(_panel, Events.COMPLETE, removePanel), (_panel = _panel.destroy()));
    }
    ((this.create = function (id, version = 1, group) {
      ("number" != typeof version && ((group = version), (version = 1)),
        (group = null === group ? null : group || UIL.global));
      let config = new ListUILConfig(id, version, UIL.global && !_created[id]);
      return (
        UIL.global &&
          (_created[id] ||
            ((_created[id] = config), null != group && config.appendUILGroup(group || UIL.global))),
        config
      );
    }),
      (this.openPanel = function (id, name, template) {
        return (
          removePanel(),
          (_panel = new ListUILEditor(id, name, template)),
          _this.events.sub(_panel, Events.COMPLETE, removePanel),
          _panel
        );
      }),
      (this.set = function () {}),
      (this.get = function () {}),
      (this.getPanel = function () {
        return _panel;
      }));
  }, "static"),
  Class(
    function ListUILConfig(_id, _version = 1, _store) {
      Inherit(this, Component);
      const _this = this;
      var _items,
        _folder,
        _config,
        _template = {
          onSort: (_) => {},
          onAdd: (_) => {},
          onRemove: (_) => {},
        },
        _name = "";
      function updateConfig() {
        _config.version = _version;
      }
      function edit() {
        let panel = ListUIL.openPanel(_id, _name, _this.template);
        (_this.events.bubble(panel, Events.UPDATE), _this.events.fire(ListUIL.OPEN));
      }
      (_store && (_items = []),
        (function initConfig() {
          (_config = UILStorage.get(
            (function name() {
              return `LIST_${_id}_config`;
            })(),
          ))
            ? _config.version != _version && updateConfig()
            : ((_config = {}), updateConfig());
        })(),
        (this.add = function (item) {
          return (_items && _items.push(item), item);
        }),
        (this.template = function (config) {
          return ("function" == typeof config && (_template = config), _template);
        }),
        (this.appendUILGroup = function (uil) {
          let folder = new UILFolder("LIST_" + _id, { closed: !0 }),
            button = new UILControlButton("button", {
              actions: [{ title: "Edit List", callback: edit }],
              hideLabel: !0,
            });
          (folder.add(button), uil.add(folder), (_folder = folder));
        }),
        (this.setLabel = function (name) {
          (_folder && _folder.setLabel(name), (_name = name));
        }),
        (this.onAdd = function (cb) {
          _template.onAdd = cb;
        }),
        (this.onRemove = function (cb) {
          _template.onRemove = cb;
        }),
        (this.onSort = function (cb) {
          _template.onSort = cb;
        }),
        (this.internalAddItems = function (count) {
          if (!count) return;
          let array = [];
          for (let i = 0; i < count; i++) {
            let id = `${_id}_${Utils.timestamp()}`;
            array.push(id);
          }
          UILStorage.set(`${_id}_list_items`, JSON.stringify(array));
        }));
    },
    (_) => {
      ListUIL.OPEN = "list_uil_open";
    },
  ),
  Class(function ListUILEditor(_id, _name, _template) {
    Inherit(this, Component);
    const _this = this,
      PANEL_CONFIG = {
        label: _name || "List",
        width: "400px",
        height: "auto",
        drag: !0,
      };
    var _gui,
      _list,
      _add,
      _items,
      _tabs = [],
      _index = 0;
    function initList() {
      (!(function read() {
        let data = UILStorage.get(`${_id}_list_items`);
        void 0 === data && (data = "[]");
        _items = JSON.parse(data);
      })(),
        (_list = new UILFolder(`${_id}_list`, { hideTitle: !0 })).enableSorting(_id),
        _gui.add(_list));
      for (let id of _items) {
        let view = new ListUILItem(id, _list, _template, _index++);
        (_this.events.sub(view, Events.UPDATE, reorder),
          _this.events.sub(view, Events.END, remove),
          _tabs.push(view));
      }
    }
    function initAdd() {
      !(function initButton(title, callback) {
        ((_add = new UILControlButton("button", {
          actions: [{ title: title, callback: callback }],
          hideLabel: !0,
        })),
          _gui.add(_add));
      })("Add Item", add);
    }
    function add() {
      let id = `${_id}_${Utils.timestamp()}`,
        view = new ListUILItem(id, _list, _template, _index++);
      (_this.events.sub(view, Events.UPDATE, reorder),
        _this.events.sub(view, Events.END, remove),
        _tabs.push(view),
        _items.push(id),
        write());
    }
    function reorder(e) {
      let order = [];
      for (let item of e.order) order.push(item.split("_folder")[0]);
      ((_items = order),
        _template().onSort(_items),
        write(),
        _this.events.fire(Events.UPDATE, { order: order }));
    }
    function close() {
      _this.events.fire(Events.COMPLETE);
    }
    function remove(e) {
      (_items.remove(e.id), write(), refresh());
    }
    function write() {
      let data = JSON.stringify(_items);
      UILStorage.set(`${_id}_list_items`, data);
    }
    function refresh() {
      ((_index = 0),
        _list && _list.destroy && (_list = _list.destroy()),
        _add && _add.destroy && (_add = _add.destroy()),
        initList(),
        initAdd());
    }
    (!(function initPanel() {
      ((_this.gui = _gui = new UILWindow(_id, PANEL_CONFIG)),
        (_this.gui.onClose = close),
        UIL.add(_gui));
    })(),
      refresh(),
      (this.onDestroy = function () {
        _gui.destroy();
      }),
      (this.add = function () {
        add();
      }));
  }),
  Class(function ListUILItem(_id, _parent, _template, _index) {
    Inherit(this, Component);
    const _this = this;
    var _folder;
    function onDelete() {
      if (!confirm("You sure you want to delete this?")) return;
      let id = _id;
      (_template().onRemove(id), _this.events.fire(Events.END, { id: id }));
    }
    function onReorder(e) {
      _this.events.fire(Events.UPDATE, e);
    }
    (!(async function initFolder() {
      ((_folder = InputUIL.create(`${_id}_folder`, _parent)).setLabel("Item"),
        _folder.group.draggable(!0),
        _this.events.sub(_folder.group, UIL.REORDER, onReorder),
        (_folder.listUILItem = _this));
    })(),
      (function initTemplate() {
        let id = _id;
        (0, _template().onAdd)(id, _folder, _index);
      })(),
      (function initUI() {
        let actions = [{ title: "Delete", callback: onDelete }],
          hideLabel = !0;
        _folder.addButton("delete", { actions: actions, hideLabel: hideLabel });
      })(),
      (this.setLabel = function (label) {
        _folder.setLabel(label);
      }),
      (this.forceSort = function (index) {
        _folder.group.forceSort(index);
      }),
      (this.open = function () {
        (_folder.group.open(), _folder.group.openChildren());
      }),
      (this.close = function () {
        _folder.group.close();
      }));
  }),
  Class(function MeshUIL() {
    Inherit(this, Component);
    ((this.exists = {}),
      (this.UPDATE = "mesh_uil_update"),
      (this.add = function (mesh, group) {
        return (
          (group = null === group ? null : group) && (mesh.__uilGroup = group),
          new MeshUILConfig(mesh, group || UIL.global)
        );
      }));
  }, "static"),
  Class(function MeshUILConfig(_mesh, _uil) {
    const _this = this;
    if (!_mesh.prefix) throw "mesh.prefix required when using MeshUIL";
    var prefix = "MESH_" + _mesh.prefix,
      _group =
        _uil && !MeshUIL.exists[prefix]
          ? (function createFolder() {
              if (!UIL.sidebar) return null;
              let folder = new UILFolder(prefix, {
                label: _mesh.prefix,
                closed: !0,
              });
              return (_uil.add(folder), folder);
            })()
          : null,
      _controls = _group ? {} : null;
    function initVec(key) {
      let initValue = UILStorage.get(`${prefix}${key}`) || _mesh[key].toArray();
      if (_group) {
        UILStorage.state.bind(`${prefix}${key}`, (val) => _mesh[key].fromArray(val));
        let vector = new UILControlVector(`${prefix}${key}`, {
          label: key,
          value: initValue,
          step: 0.05,
        });
        (vector.onChange((e) => {
          (_mesh[key].fromArray(e), _group && _this["tweenUIL_" + key]?.(e));
        }),
          vector.onFinishChange(save),
          _group.add(vector),
          (_this["forceUpdate" + key.toUpperCase()] = (_) => {
            let val = _mesh[key].toArray();
            _this["tweenUIL_" + key]
              ? _this["tweenUIL_" + key](val)
              : vector.force(_mesh[key].toArray(), !0);
          }),
          (_controls[key] = vector));
      }
      _mesh[key].fromArray(initValue);
    }
    function save() {
      for (let key in _controls) {
        let value = _controls[key].value;
        UILStorage.set(`${prefix}${key}`, value);
      }
    }
    function update(e) {
      e.prefix == prefix && e.group != _this && _mesh[e.key].fromArray(e.val);
    }
    ((this.group = _group),
      initVec("position"),
      initVec("scale"),
      (function initRotation() {
        let key = "rotation",
          toRadians = (array) =>
            array ? ((array.length = 3), array.map((x) => Math.radians(x))) : [0, 0, 0],
          toDegrees = (array) =>
            array ? ((array.length = 3), array.map((x) => Math.degrees(x))) : [0, 0, 0],
          initValue = toRadians(UILStorage.get(`${prefix}${key}`));
        if (_group) {
          UILStorage.state.bind(`${prefix}${key}`, (val) => _mesh[key].fromArray(toRadians(val)));
          let vector = new UILControlVector(`${prefix}${key}`, {
            label: key,
            value: toDegrees(initValue),
          });
          (vector.onChange((e) => {
            (_mesh[key].fromArray(toRadians(e)), _group && _this["tweenUIL_" + key]?.(e));
          }),
            vector.onFinishChange(save),
            _group.add(vector),
            (_controls[key] = vector));
        }
        _mesh[key].fromArray(initValue);
        let rotationEuler = new Euler().fromArray(initValue);
        _mesh.customRotation = new Quaternion().setFromEuler(rotationEuler);
      })(),
      _group &&
        (function addListeners() {
          Events.emitter._addEvent(MeshUIL.UPDATE, update, _this);
        })(),
      (this.setLabel = function (name) {
        _group && _group.setLabel(name);
      }),
      (this.forceUpdate = function (key, val) {
        (_mesh[key].fromArray(val), _this["forceUpdate" + key.toUpperCase()]?.());
      }));
  }),
  Class(function ShaderUIL() {
    ((this.exists = {}),
      (this.UPDATE = "shader_update"),
      (this.TEXTURE_UPDATE = "shader_texture_update"),
      (this.SHADER_UPDATE = "shader_shader_update"),
      (this.add = function (shader, group) {
        return new ShaderUILConfig(
          shader.shader || shader,
          null === group ? null : group || UIL.global,
        );
      }),
      (this.createOverride = function (prefix, obj, group, shaderOnly, newClone) {
        let uniforms = {};
        Array.isArray(obj)
          ? obj.forEach((o) => {
              o = o.uniforms || o;
              for (let key in o) o[key].ignoreUIL || (uniforms[key] = o[key]);
            })
          : (uniforms = obj.uniforms || obj);
        let shader = Utils3D.getTestShader();
        if (((shader.vertexShader = shader.fragmentShader = ""), newClone))
          for (let key in uniforms) {
            let value = uniforms[key].value;
            (value?.clone && (value = value.clone()),
              (shader.uniforms[key] = {
                value: value,
                type: uniforms[key].type,
              }));
          }
        else for (let key in uniforms) shader.uniforms[key] = uniforms[key];
        return (
          (shader.UILPrefix = prefix),
          null === shaderOnly ? shader : this.add(shader, group)
        );
      }),
      (this.createDecorator = function (shader, prefix, obj, group) {
        let uniforms = {};
        for (let key in obj) uniforms[key] = shader.uniforms[key];
        let nShader = Utils3D.getTestShader();
        return (
          (nShader.vertexShader = shader.fragmentShader = ""),
          (nShader.uniforms = uniforms),
          (nShader.UILPrefix = prefix),
          this.add(nShader, group)
        );
      }),
      (this.createClone = function (prefix, obj) {
        let uniforms = obj.uniforms || obj,
          shader = Utils3D.getTestShader();
        for (let key in uniforms) {
          let value = uniforms[key].value,
            ignoreUIL = uniforms[key].ignoreUIL || null === value;
          (!ignoreUIL && value.clone && (value = value.clone()),
            (shader.uniforms[key] = { value: value, ignoreUIL: ignoreUIL }));
        }
        return ((shader.UILPrefix = prefix), shader);
      }),
      (this.lerpShader = function (from, to, alpha, hz, uniformsFilter) {
        ((from = from.uniforms || from), (to = to.uniforms || to));
        for (let key in from) {
          let f = from[key],
            t = to[key];
          f &&
            t &&
            ((uniformsFilter && -1 === uniformsFilter.indexOf(key)) ||
              ("number" == typeof t.value
                ? (f.value = Math.lerp(t.value, f.value, alpha, hz))
                : "c" === f.type
                  ? ((f.value.r = Math.lerp(t.value.r, f.value.r, alpha, hz)),
                    (f.value.g = Math.lerp(t.value.g, f.value.g, alpha, hz)),
                    (f.value.b = Math.lerp(t.value.b, f.value.b, alpha, hz)))
                  : "v3" === f.type
                    ? ((f.value.x = Math.lerp(t.value.x, f.value.x, alpha, hz)),
                      (f.value.y = Math.lerp(t.value.y, f.value.y, alpha, hz)),
                      (f.value.z = Math.lerp(t.value.z, f.value.z, alpha, hz)))
                    : "v2" === f.type
                      ? ((f.value.x = Math.lerp(t.value.x, f.value.x, alpha, hz)),
                        (f.value.y = Math.lerp(t.value.y, f.value.y, alpha, hz)))
                      : f.value && f.value.lerp && f.value.lerp(t.value, alpha, hz)));
        }
      }));
  }, "static"),
  Class(function ShaderUILConfig(_shader, _uil) {
    var _textures,
      _this = this;
    const prefix = _shader.UILPrefix;
    var _group =
      _uil && !ShaderUIL.exists[prefix]
        ? (function createFolder() {
            if (!UIL.sidebar) return null;
            let label = (function getName() {
              let split = _shader.UILPrefix.split("/");
              return split.length > 2 ? split[0] + "_" + split[2] : split[0];
            })();
            "_" == label.charAt(label.length - 1) && (label = label.slice(0, -1));
            let folder = new UILFolder(prefix + label, {
              label: label,
              closed: !0,
            });
            return (_uil.add(folder), folder);
          })()
        : null;
    function createVector(obj, key) {
      let initValue = UILStorage.get(`${prefix}${key}`) || obj.value.toArray();
      if (_group) {
        let vector = new UILControlVector(`${prefix}${key}`, {
          label: key,
          value: initValue,
          step: 0.05,
          description: obj.description,
        });
        (vector.onChange((val) => {
          (obj.value.fromArray(val), _shader.ubo && (_shader.ubo.needsUpdate = !0));
        }),
          (_this["forceUpdate" + key.toUpperCase()] = (_) => {
            let val = _shader.get(key).toArray();
            vector.force(val, !0);
          }),
          vector.onFinishChange((e) => UILStorage.set(`${prefix}${key}`, e)),
          UILStorage.state.bind(`${prefix}${key}`, (val) => vector.setValue(val)),
          _group.add(vector));
      }
      obj.value.fromArray(initValue);
    }
    function createTexture(obj, key) {
      let getTexture;
      (_group && !_textures && (_textures = {}),
        (getTexture = obj.cube
          ? obj.getTexture || ShaderUIL.getCubeTexture || Utils3D.getCubeTexture
          : obj.getTexture || ShaderUIL.getTexture || Utils3D.getTexture));
      const set =
        _shader.parent && _shader.parent.setOverride
          ? _shader.parent.setOverride
          : _shader.set || _shader.setUniform;
      _shader.get || _shader.getUniform;
      let prefix = _shader.UILPrefix + "_tx",
        data = UILStorage.get(`${prefix}_${key}`);
      "string" == typeof data && (data = JSON.parse(data));
      let value = data ? data.src : null,
        change = (data) => {
          if (("string" == typeof data && (data = JSON.parse(data)), !data)) return;
          let val = data.src,
            cleanPath = val.includes("?") && !data.hotreload ? val.split("?")[0] : val;
          (data.compressed &&
            ((val += "-compressedKtx"), "ktx2" === data.compressed && (val += "2")),
            _textures && (_textures[cleanPath] = change),
            (data.src = cleanPath),
            UILStorage.set(`${prefix}_${key}`, data),
            set(
              key,
              getTexture(val, {
                premultiplyAlpha: obj.premultiplyAlpha,
                scale: obj.scale,
              }),
              _shader,
            ));
        };
      if ((value && value.length && change(data), _group)) {
        let compressOptions = {};
        obj.cube && (compressOptions.cube = !0);
        let img = new UILControlImage(prefix + key, {
          label: key,
          value: data,
          description: obj.description,
          compressOptions: compressOptions,
        });
        (img.onFinishChange(change),
          _group.add(img),
          UILStorage.state.bind(`${prefix}_${key}`, (val) => change(val)),
          (_this["forceUpdate" + key.toUpperCase()] = (_) => {
            img.force(_shader.get(key), !0);
          }));
      }
    }
    function createNumber(obj, key) {
      let initValue = UILStorage.get(`${prefix}${key}`);
      if ((void 0 === initValue && (initValue = obj.value), _group)) {
        let number = new UILControlNumber(`${prefix}${key}`, {
          label: key,
          value: initValue,
          step: 0.05,
          description: obj.description,
        });
        (number.onChange((val) => {
          (_shader.ubo && (_shader.ubo.needsUpdate = !0), (obj.value = Number(val)));
        }),
          number.onFinishChange((e) => UILStorage.set(`${prefix}${key}`, e)),
          _group.add(number),
          (_this["forceUpdate" + key.toUpperCase()] = (_) => {
            number.forceUpdate(Number(_shader.get(key)), !0);
          }),
          UILStorage.state.bind(`${prefix}${key}`, (val) => number.setValue(val)));
      }
      obj.value = initValue;
    }
    function createColor(obj, key) {
      let initValue = UILStorage.get(`${prefix}${key}`) || obj.value.getHexString();
      if (_group) {
        let color = new UILControlColor(`${prefix}${key}`, {
          label: key,
          value: initValue,
          description: obj.description,
        });
        (UILStorage.state.bind(`${prefix}${key}`, (val) => color.setValue(val)),
          color.onChange((val) => {
            (obj.value.set(val), _shader.ubo && (_shader.ubo.needsUpdate = !0));
          }),
          color.onFinishChange((e) => UILStorage.set(`${prefix}${key}`, e)),
          _group.add(color),
          (_this["forceUpdate" + key.toUpperCase()] = (_) => {
            color.force(_shader.get(key).getHexString(), !0);
          }));
      }
      initValue && obj.value.set(initValue);
    }
    function createSelect(obj, key) {
      let initValue = UILStorage.get(`${prefix}${key}`);
      if (_group) {
        UILStorage.state.bind(`${prefix}${key}`, (val) => (obj.val = val));
        let { options: options, description: description } = obj,
          select = new UILControlSelect(`${prefix}${key}`, {
            label: key,
            value: initValue,
            options: options,
            description: description,
          });
        (select.onChange((val) => {
          (_group &&
            Events.emitter._fireEvent(ShaderUIL.UPDATE, {
              prefix: prefix,
              key: key,
              val: val,
              group: _this,
            }),
            (obj.value = val),
            UILStorage.set(`${prefix}${key}`, val));
        }),
          _group.add(select));
      }
      initValue && (obj.value = initValue);
    }
    function textureUpdate(e) {
      if (!_textures) return;
      let cleanPath = e.file.split("?")[0];
      for (let key in _textures) {
        cleanPath == (key.includes("?") ? key.split("?")[0] : key) &&
          _textures[key]({ src: e.file, hotreload: !0 });
      }
    }
    function update(e) {
      if (e.prefix == _shader.UILPrefix && e.group != _this)
        if (e.color) {
          let val = e.val,
            obj = _shader.uniforms[e.key];
          Array.isArray(val) ? obj.value.setRGB(val[0], val[1], val[2]) : obj.value.set(val);
        } else
          e.texture
            ? "remote" != e.texture && _shader.set(e.key, e.texture)
            : e.vector
              ? _shader.uniforms[e.key].value.fromArray(e.val)
              : (_shader.uniforms[e.key].value = e.val);
    }
    ((this.group = _group),
      (this.shader = _shader),
      _group && (_shader.shaderUIL = _this),
      (function initItems() {
        for (var key in _shader.uniforms) {
          let obj = _shader.uniforms[key];
          obj &&
            !obj.ignoreUIL &&
            (obj.options && Array.isArray(obj.options)
              ? createSelect(obj, key)
              : ("number" == typeof obj.value && createNumber(obj, key),
                obj.value instanceof Color && createColor(obj, key),
                (null === obj.value || obj.value instanceof Texture) && createTexture(obj, key),
                obj.value instanceof Vector2 && createVector(obj, key),
                obj.value instanceof Vector3 && createVector(obj, key),
                obj.value instanceof Vector4 && createVector(obj, key)));
        }
      })(),
      _group &&
        (function addListeners() {
          (Events.emitter._addEvent(ShaderUIL.UPDATE, update, _this),
            Events.emitter._addEvent(ShaderUIL.TEXTURE_UPDATE, textureUpdate, _this));
        })(),
      (this.setLabel = function (name) {
        _group && _group.setLabel(name);
      }),
      (this.forceUpdate = function (e) {
        ((e.prefix = _shader.UILPrefix), update(e), _this["forceUpdate" + e.key.toUpperCase()]?.());
      }),
      (this.copyTexture = function (key, shader) {
        let newPrefix = shader.UILPrefix + "_tx",
          prefix = _shader.UILPrefix + "_tx",
          data = UILStorage.get(`${prefix}_${key}`);
        data && UILStorage.set(`${newPrefix}_${key}`, data);
      }));
  }),
  Class(function ShadowUIL() {
    this.add = function (light, group) {
      return new ShadowUILConfig(light, null === group ? null : group || UIL.global);
    };
  }, "static"),
  Class(function ShadowUILConfig(_light, _uil) {
    if (!_light.prefix) throw "light.prefix required when using MeshUIL";
    var prefix = "SHADOW_" + _light.prefix,
      _group = _uil
        ? (function createFolder() {
            if (!UIL.sidebar) return null;
            let folder = new UILFolder(prefix, {
              label: _light.prefix,
              closed: !0,
            });
            return (_uil.add(folder), folder);
          })()
        : null;
    function initNumber(key) {
      let initValue = UILStorage.get(`${prefix}${key}`) || _light.shadow[key];
      if (_group) {
        UILStorage.state.bind(`${prefix}${key}`, (val) => (_light.shadow[key] = val));
        let number = new UILControlNumber(`${prefix}${key}`, {
          label: key,
          value: initValue,
          step: 0.05,
        });
        (number.onFinishChange((e) => {
          ((_light.shadow[key] = e), UILStorage.set(`${prefix}${key}`, e));
        }),
          _group.add(number));
      }
      _light.shadow[key] = initValue;
    }
    function initVec(key) {
      let initValue = UILStorage.get(`${prefix}${key}`) || _light[key].toArray();
      if (_group) {
        UILStorage.state.bind(`${prefix}_${key}`, (val) => _light[key].fromArray(val));
        let vector = new UILControlVector(`${prefix}${key}`, {
          label: key,
          value: initValue,
          step: 0.05,
        });
        (vector.onChange((e) => {
          (_light[key].fromArray(e), "target" == key && _light.shadow.camera.lookAt(_light.target));
        }),
          vector.onFinishChange((e) => {
            (_light[key].fromArray(e),
              "target" == key && _light.shadow.camera.lookAt(_light.target),
              UILStorage.set(`${prefix}${key}`, e));
          }),
          _group.add(vector));
      }
      _light[key].fromArray(initValue);
    }
    ((_light.target = _light.shadow.target),
      initVec("position"),
      initVec("target"),
      initNumber("fov"),
      initNumber("size"),
      initNumber("area"),
      initNumber("near"),
      initNumber("far"),
      (function initTick(key) {
        let initValue = UILStorage.get(`${prefix}${key}`);
        if (_group) {
          UILStorage.state.bind(`${prefix}_${key}`, (val) => (_light[key] = val));
          let tick = new UILControlCheckbox(`${prefix}${key}`, {
            label: key,
            value: initValue,
          });
          (tick.onFinishChange((e) => {
            ((_light[key] = e), UILStorage.set(`${prefix}${key}`, e));
          }),
            _group.add(tick));
        }
        _light[key] = initValue;
      })("static"),
      (this.setLabel = function (name) {
        _group && _group.setLabel(name);
      }));
  }),
  Class(function TimelineUIL() {
    Inherit(this, Component);
    const _this = this;
    var _panel,
      _created = {};
    function removePanel() {
      _panel &&
        _panel.destroy &&
        (_this.events.unsub(_panel, Events.COMPLETE, removePanel), (_panel = _panel.destroy()));
    }
    ((this.create = function (id, version = 1, group) {
      ("number" != typeof version && ((group = version), (version = 1)),
        (group = null === group ? null : group || UIL.global));
      let config = new TimelineUILConfig(id, version, UIL.global && !_created[id]);
      return (
        UIL.global &&
          (_created[id] ||
            ((_created[id] = config), null != group && config.appendUILGroup(group || UIL.global))),
        config
      );
    }),
      (this.openPanel = function (id, name, template) {
        return (
          removePanel(),
          (_panel = new TimelineUILEditor(id, name, template)),
          _this.events.sub(_panel, Events.COMPLETE, removePanel),
          _panel
        );
      }),
      (this.set = function () {}),
      (this.get = function () {}));
  }, "static"),
  Class(
    function TimelineUILConfig(_id, _version = 1, _store) {
      Inherit(this, Component);
      const _this = this;
      var _items,
        _folder,
        _config,
        _template = {
          onSort: (_) => {},
          onAdd: (_) => {},
          onRemove: (_) => {},
        },
        _name = "";
      function name() {
        return `TL_${_id}_config`;
      }
      function updateConfig() {
        _config.version = _version;
      }
      function edit() {
        let panel = TimelineUIL.openPanel(name(), _name, _this.template);
        (_this.events.bubble(panel, Events.UPDATE), _this.events.fire(TimelineUIL.OPEN));
      }
      ((this.model = new TimelineUILModel(name())),
        _store && (_items = []),
        (function initConfig() {
          (_config = UILStorage.get(name()))
            ? _config.version != _version && updateConfig()
            : ((_config = {}), updateConfig());
        })(),
        (this.add = function (item) {
          return (_items && _items.push(item), item);
        }),
        (this.template = function (config) {
          return ("function" == typeof config && (_template = config), _template);
        }),
        (this.appendUILGroup = function (uil) {
          let folder = new UILFolder("TL_" + _id, { closed: !0 }),
            button = new UILControlButton("button", {
              actions: [{ title: "Edit Timeline", callback: edit }],
              hideLabel: !0,
            });
          (folder.add(button), uil.add(folder), (_folder = folder));
        }),
        (this.setLabel = function (name) {
          (_folder && _folder.setLabel(name), (_name = name));
        }),
        (this.onAdd = function (cb) {
          _template.onAdd = cb;
        }),
        (this.onRemove = function (cb) {
          _template.onRemove = cb;
        }),
        (this.onSort = function (cb) {
          _template.onSort = cb;
        }),
        (this.internalAddItems = function (count) {
          if (!count) return;
          let array = [];
          for (let i = 0; i < count; i++) {
            let id = `${_id}_${Utils.timestamp()}`;
            array.push(id);
          }
          UILStorage.set(`${_id}_list_items`, JSON.stringify(array));
        }));
    },
    (_) => {
      TimelineUIL.OPEN = "list_uil_open";
    },
  ),
  Class(function TimelineUILEditor(_id, _name, _template) {
    Inherit(this, Component);
    const _this = this,
      PANEL_CONFIG = {
        label: "Timeline Editor",
        width: "800px",
        height: "auto",
        drag: !0,
      };
    var _gui,
      _list,
      _add,
      _config,
      _items,
      _tabs = [],
      _index = 0;
    function initList() {
      (!(function read() {
        let data = UILStorage.get(`${_id}_list_items`);
        void 0 === data && (data = "[]");
        _items = JSON.parse(data);
      })(),
        (_list = new UILFolder(`${_id}_list`, { hideTitle: !0 })),
        _gui.add(_list));
      for (let id of _items) {
        let view = _this.initClass(TimelineUILItem, id, _list, _template, _index++);
        (_this.events.sub(view, Events.UPDATE, reorder),
          _this.events.sub(view, Events.END, remove),
          _tabs.push(view));
      }
      _config.rails &&
        (function attachRails() {
          _tabs.forEach((t, i) => {
            t.onUpdate = (v) => {
              _tabs.forEach((t2, j) => {
                t2 != t &&
                  (j < i && t.getValue() < t2.getValue() && t2.setValue(t.getValue()),
                  j > i && t.getValue() > t2.getValue() && t2.setValue(t.getValue()));
              });
            };
          });
        })();
    }
    function initButton(title, callback) {
      let btn = new UILControlButton("button", {
        actions: [{ title: title, callback: callback }],
        hideLabel: !0,
      });
      return (_gui.add(btn), btn);
    }
    function spaceEvenly() {
      _tabs.forEach((t, i) => {
        let perc = Math.range(i, 0, _tabs.length - 1, 0, 1);
        t.setValue(perc);
      });
    }
    function add() {
      let id = `${_id}_${Utils.timestamp()}`,
        view = new TimelineUILItem(id, _list, _template, _index++);
      (_this.events.sub(view, Events.UPDATE, reorder),
        _this.events.sub(view, Events.END, remove),
        _tabs.push(view),
        _items.push(id),
        write());
    }
    function reorder(e) {
      let order = [];
      for (let item of e.order) order.push(item.split("_folder")[0]);
      ((_items = order),
        _template().onSort(_items),
        write(),
        _this.events.fire(Events.UPDATE, { order: order }));
    }
    function remove(e) {
      (_items.remove(e.id), write(), refresh());
    }
    function write() {
      let data = JSON.stringify(_items);
      UILStorage.set(`${_id}_list_items`, data);
    }
    function refresh() {
      ((_index = 0),
        _list && _list.destroy && (_list = _list.destroy()),
        _add && _add.destroy && (_add = _add.destroy()),
        initList(),
        (function initAdd() {
          (_config.lock || (_add = initButton("Add Item", add)).element.css({ width: "20%" }),
            initButton("Space Evenly", spaceEvenly).element.css({
              width: "20%",
            }));
        })());
    }
    ((_this.config = _config = JSON.parse(UILStorage.get(`${_id}_config`) || "{}")),
      (function initPanel() {
        ((_this.gui = _gui = new UILWindow(_id, PANEL_CONFIG)), UIL.add(_gui));
      })(),
      refresh(),
      (this.onDestroy = function () {
        _gui.destroy();
      }));
  }),
  Class(function TimelineUILItem(_id, _parent, _template, _index) {
    Inherit(this, Component);
    const _this = this;
    var _folder;
    function onDelete() {
      if (!confirm("You sure you want to delete this?")) return;
      let id = _id;
      (_template().onRemove(id), _this.events.fire(Events.END, { id: id }));
    }
    function onReorder(e) {
      _this.events.fire(Events.UPDATE, e);
    }
    (!(async function initFolder() {
      ((_folder = InputUIL.create(`${_id}_folder`, _parent)).setLabel("Item"),
        (_this.parent && _this.parent.config.lock) || _folder.group.draggable(!0),
        _this.events.sub(_folder.group, UIL.REORDER, onReorder),
        _folder.group.open());
    })(),
      (function initTemplate() {
        let id = _id;
        (0, _template().onAdd)(id, _folder, _index);
      })(),
      (function initUI() {
        (_folder.add("label", _this.parent && _this.parent.config.lock ? "hidden" : void 0),
          _folder.addRange("keyframe"),
          _folder.add("percent", "hidden"),
          _folder.getField("keyframe").force(Math.round(100 * _folder.getNumber("percent")) || 0),
          (_folder.onUpdate = (key) => {
            if ("keyframe" == key) {
              let val = _folder.getNumber(key) / 100;
              (_folder.setValue("percent", val), _this.onUpdate && _this.onUpdate(val));
            }
          }));
        let label = _folder.get("label");
        if ((label && _folder.setLabel(label), !_this.parent || !_this.parent.config.lock)) {
          let actions = [{ title: "Delete", callback: onDelete }],
            hideLabel = !0,
            btn =
              (_folder.addButton("delete", {
                actions: actions,
                hideLabel: hideLabel,
              }),
              _folder.getField("delete"));
          btn && btn.$content.css({ width: "20%" });
        }
      })(),
      (this.setLabel = function (label) {
        _folder.setLabel(label);
      }),
      (this.getValue = function (value) {
        return _folder.getNumber("percent");
      }),
      (this.setValue = function (value) {
        (_folder.setValue("percent", value),
          _folder.getField("keyframe").force(Math.round(100 * value) || 0));
      }));
  }),
  Class(function TimelineUILModel(_id) {
    var _items,
      _config,
      _data = [],
      _map = {};
    (!(function initItems() {
      ((_config = JSON.parse(UILStorage.get(`${_id}_config`) || "{}")),
        (_items = JSON.parse(UILStorage.get(`${_id}_list_items`) || "[]")));
    })(),
      (function initData() {
        _items.forEach((item, i) => {
          let input = InputUIL.create(`${item}_folder`, null, null, !!UIL.global),
            data = {};
          ((data.label = input.get("label") || "Item"),
            (data.value = input.getNumber("percent") || 0),
            (data.arbitrary = input.get("arbitrary")),
            _data.push(data),
            (_map[data.label] = data),
            UIL.global &&
              Render.start((_) => {
                ((data.label = input.get("label") || "Item"),
                  (data.value = input.getNumber("percent") || 0));
              }, 10));
        });
      })(),
      (this.setState = function (array) {
        for (let i = 0; i < array.length; i++)
          _items[i] || _items.push(`${_id}_${Utils.timestamp()}`);
        (_items.length > array.length && (_items = _items.slice(0, array.length)),
          _items.forEach((item, i) => {
            let data = array[i],
              input = InputUIL.create(`${item}_folder`, null);
            (input.setValue("label", data.label),
              data.percent && input.setValue("percent", data.percent),
              data.arbitrary && input.setValue("percent", data.arbitrary));
          }),
          UILStorage.set(`${_id}_list_items`, JSON.stringify(_items)));
      }),
      (this.lock = function () {
        return (
          _config.lock ||
            ((_config.lock = !0),
            UIL.global && UILStorage.set(`${_id}_config`, JSON.stringify(_config))),
          this
        );
      }),
      (this.rails = function () {
        return (
          _config.rails ||
            ((_config.rails = !0),
            UIL.global && UILStorage.set(`${_id}_config`, JSON.stringify(_config))),
          this
        );
      }),
      (this.getData = function () {
        return _data;
      }),
      (this.get = function (key) {
        return _map[key];
      }));
  }),
  Class(function CameraLookAtHelper() {
    Inherit(this, Component);
    const _this = this;
    let _camera,
      _object,
      _defaultLookAt,
      _tweener = { alpha: 0 },
      _lookAt = new Vector3();
    function update() {
      (_lookAt.copy(_defaultLookAt),
        _tweener.alpha > 0 && _lookAt.lerp(_object.position, _tweener.alpha, !1));
    }
    (_this.get("tweener", () => _tweener),
      (_this.create = async function (camera, object, tween) {
        ((_camera = camera),
          (_object = object),
          (_defaultLookAt = _camera.lookAt),
          await tween.loaded(),
          (_camera.lookAt = _lookAt),
          _this.events.sub(tween, TweenUIL.UPDATED, update));
      }));
  }),
  Class(function TweenUIL() {
    Inherit(this, Component);
    const _this = this;
    var _getServerTime,
      _folders = {},
      _activeFolder = "Tweens",
      _cache = {},
      _counters = {},
      _synchronizedTweens = [];
    function synchronizedPlaybackLoop() {
      let i = _synchronizedTweens.length - 1;
      if (i < 0) return;
      let serverTime = _getServerTime();
      for (; i >= 0; ) {
        let tween = _synchronizedTweens[i];
        if (tween.seekImmediate) {
          let duration = 1e3 * tween.duration,
            progress = (serverTime % duration) / duration;
          (tween.seekImmediate(progress), (i -= 1));
        } else if ((_synchronizedTweens.splice(i, 1), 0 === _synchronizedTweens.length)) {
          _this.stopRender(synchronizedPlaybackLoop);
          break;
        }
      }
    }
    ((_this.jsons = {}),
      (this.TOGGLE = "tweenuil_toggle"),
      Theatre.core.setCoreRafDriver(Theatre.core.createRafDriver({ name: "no-op driver" })),
      _this.startRender(synchronizedPlaybackLoop),
      (this.create = function (name, config, group) {
        "boolean" == typeof group && (group = void 0);
        let noCache = !1;
        "nocache" == group &&
          ((_counters[name] = (_counters[name] || 0) + 1), (noCache = !0), (group = void 0));
        let folderName = _activeFolder;
        if (
          ("string" == typeof group && ((folderName = group), (group = null)),
          _folders[folderName] ||
            (function initFolder() {
              if (UIL.global) {
                let folder = new UILFolder(_activeFolder, {
                  label: _activeFolder,
                  closed: !0,
                });
                ((_folders[_activeFolder] = folder), UIL.global.add(folder));
              }
            })(),
          !_cache[name] || noCache)
        ) {
          let tween = new TweenUILConfig(
            name,
            config,
            group || _folders[folderName],
            _counters[name],
          );
          (tween._bindOnDestroy((_) => {
            delete _cache[name];
          }),
            (_cache[name] = tween));
        }
        return _cache[name];
      }),
      (this.setFolder = function (name) {
        _activeFolder = name;
      }),
      (this.setServerTimeGetter = function (getServerTime) {
        _getServerTime = getServerTime;
      }),
      (this.playSynchronized = async function (tween) {
        _getServerTime
          ? (await tween.preload(),
            tween.progress,
            (tween.manualRender = !0),
            _synchronizedTweens.unshift(tween))
          : console.error(
              "Need to call TweenUIL.setServerTimeGetter(() => time) before using TweenUIL.playSynchronized()",
            );
      }),
      (this.stopSynchronized = function (tween) {
        _synchronizedTweens.remove(tween);
      }));
  }, "static"),
  Class(function TweenUILAnchor() {
    Inherit(this, Object3D);
    this.isTweenAnchor = !0;
  }),
  Class(
    function TweenUILConfig(_name, _config, _group, _noCache) {
      Inherit(this, Component);
      const _this = this;
      var _input,
        _editor,
        _promise,
        _project,
        _meshes,
        _keyframes,
        _pathVisualization,
        _projectInstanceId,
        _objectsWithTracks,
        _savedState,
        _rafDriver,
        _layersWithWarnings = {},
        _flatMap = {},
        _sheets = {},
        _duration = 0,
        _manualRender = !1,
        _changedKeys = {},
        _cameras = [],
        _audioFile = !1;
      function loop() {
        (_this.events.fire(TweenUIL.BEFORE_UPDATE),
          Object.keys(_flatMap).forEach((key) => (_changedKeys[key] = !1)),
          _rafDriver.tick(Render.TIME),
          _this.events.fire(TweenUIL.UPDATED, { changed: _changedKeys }),
          _cameras.forEach((camera) => camera.update()));
      }
      function initObjectsWithTracks(state) {
        (_objectsWithTracks || (_objectsWithTracks = {}),
          [state.staticOverrides?.byObject, state.sequence?.tracksByObject]
            .filter(Boolean)
            .forEach((table) => {
              Object.keys(table).forEach((key) => {
                let parts = key.split(" » "),
                  name = parts.length > 1 ? parts.last() : key,
                  matches = /(.*)_(shader|behavior)$/.exec(name);
                (matches && (name = matches[1]), (_objectsWithTracks[name] = !0));
              });
            }));
      }
      function ignoreObject(name, layoutName) {
        return !!_objectsWithTracks && !_objectsWithTracks[name];
      }
      function findTrueDuration(sequence) {
        let duration = 0,
          tracks = sequence.tracksByObject;
        for (let k1 in tracks) {
          let obj = tracks[k1];
          "tween_anchor" == k1 && findAnchorKeyframes(obj);
          for (let k2 in obj.trackData) {
            let trackData = obj.trackData[k2];
            for (let k3 in trackData.keyframes) {
              let keyframe = trackData.keyframes[k3];
              keyframe.position && (duration = Math.max(duration, keyframe.position));
            }
          }
        }
        return duration;
      }
      function checkDuration() {
        if (0 === _duration)
          for (let key in _sheets) _duration = Math.max(_duration, _sheets[key].length);
      }
      function findAnchorKeyframes(obj) {
        for (let k1 in obj)
          for (let k2 in obj[k1]) {
            let keyframes = obj[k1][k2].keyframes;
            keyframes && (_keyframes = keyframes);
          }
      }
      async function play(options = {}) {
        (_config.sheets || (await prepareConfig(), linkLocally()), checkDuration());
        for (let key in _sheets)
          (options.disableAutoPosition ||
            (_sheets[key].sequence.position = "reverse" === options?.direction ? _duration : 0),
            _sheets[key].sequence.play({ ...options, rafDriver: _rafDriver }));
        return (_promise = _this.wait(1e3 * _duration));
      }
      function linkLocally() {
        makeSendable().sheets.forEach((obj) => {
          const sheet = _sheets[_config.mergedSheetName];
          if (sheet)
            for (let key in obj) {
              for (let key2 in obj[key]) {
                let finalObj = obj[key][key2];
                "number" == typeof finalObj.r &&
                  "number" == typeof finalObj.g &&
                  "number" == typeof finalObj.b &&
                  Object.assign(finalObj, Theatre.core.types.rgba(finalObj));
              }
              sheet.object(getTrackNameFromKey(key), obj[key]).onValuesChange((newValue) => {
                ((_changedKeys[key] = !0), completeDataLink(newValue, _flatMap[key]));
              }, _rafDriver);
            }
        });
      }
      function getTrackNameFromKey(key, disambiguate = !1) {
        let name = key.split("&"),
          prefix = name[0];
        return (
          name.shift(),
          (name = name.join("_")),
          disambiguate && (name = `${prefix} » ${name}`),
          name
        );
      }
      async function prepareConfig() {
        let array = Array.isArray(_config) ? _config : [_config];
        ((_config = {}),
          _audioFile && (_config.audioFile = _audioFile),
          (_config.nudgeMultiplier = 0.05));
        let sheet = {};
        _config.sheets = [sheet];
        for (let i = 0; i < array.length; i++) {
          let layoutName,
            objects = array[i],
            options = {};
          if (objects instanceof SceneLayout)
            ((layoutName = objects.name),
              (options.isSceneLayout = !0),
              (objects = await getObjectsFromLayout(objects)));
          else {
            if ("object" != typeof objects) throw "TweenUIL :: Type not supported";
            if (0 === i) {
              let obj0 = objects[Object.keys(objects)[0]];
              obj0 instanceof Mesh
                ? (layoutName = "Scene")
                : obj0.uniforms
                  ? (layoutName = "Shader")
                  : isElement(obj0) && (layoutName = "Elements");
            }
          }
          (layoutName || (layoutName = `Scene${i + 1}`),
            mergeSheets(sheet, createSheetFromObjects(objects, layoutName, options)),
            0 === i && (_config.mergedSheetName = layoutName));
        }
        _this.flag("isLoaded", !0);
      }
      function mergeSheets(sheet1, sheet2) {
        let usedNames = {};
        return (
          Object.keys(sheet1).forEach((key) => {
            usedNames[getTrackNameFromKey(key)] = !0;
          }),
          Object.keys(sheet2).forEach((key) => {
            let name = getTrackNameFromKey(key),
              newKey = key;
            (usedNames[name] &&
              ((name = getTrackNameFromKey(key, !0)),
              (newKey = `${key.split("&")[0]}&${name}`),
              (_flatMap[newKey] = _flatMap[key]),
              delete _flatMap[key]),
              (usedNames[name] = !0),
              (sheet1[newKey] = sheet2[key]));
          }),
          sheet1
        );
      }
      function makeEulerLink(layer, key) {
        return {
          copy: (obj) => {
            layer[key].set(Math.radians(obj.x), Math.radians(obj.y), Math.radians(obj.z));
          },
          get x() {
            return Math.degrees(layer[key].x);
          },
          get y() {
            return Math.degrees(layer[key].y);
          },
          get z() {
            return Math.degrees(layer[key].z);
          },
        };
      }
      function getMeshObject(layer, parent, layerName) {
        if (parent?.isTweenAnchor) {
          let obj = {};
          return ((obj.anchor = { anchor: 0, link: { copy() {} } }), obj);
        }
        layer.rotationLink = makeEulerLink(layer, "rotation");
        let obj = {
          position: {
            x: layer.position.x,
            y: layer.position.y,
            z: layer.position.z,
            link: layer.position,
          },
          scale: {
            x: layer.scale.x,
            y: layer.scale.y,
            z: layer.scale.z,
            link: layer.scale,
          },
          rotation: {
            x: Math.degrees(layer.rotation.x),
            y: Math.degrees(layer.rotation.y),
            z: Math.degrees(layer.rotation.z),
            link: layer.rotationLink,
          },
        };
        if (layer._cameraUIL) {
          ((obj.cameraPos = {
            x: parent.position.x,
            y: parent.position.y,
            z: parent.position.z,
            link: {
              copy(from) {
                parent.move(from);
              },
            },
          }),
            (obj.projection = {
              zoom: parent.zoom,
              fov: parent.getFOV(),
              near: parent.near,
              far: parent.far,
              link: {
                copy(from) {
                  parent.setProjectionProperties(from);
                },
              },
            }),
            (obj.lookAt = {
              x: parent.lookAt.x,
              y: parent.lookAt.y,
              z: parent.lookAt.z,
              link: parent.lookAt,
            }),
            (obj.moveXY = {
              x: parent.moveXY.x,
              y: parent.moveXY.y,
              link: parent.moveXY,
            }),
            (obj.cameraRotation = {
              x: Math.degrees(parent.cameraRotation.x),
              y: Math.degrees(parent.cameraRotation.y),
              z: Math.degrees(parent.cameraRotation.z),
              link: makeEulerLink(parent, "cameraRotation"),
            }),
            (obj.viewportFocus = {
              x: parent.viewportFocus.x,
              y: parent.viewportFocus.y,
              link: parent.viewportFocus,
            }));
          let camera = layer.classRef;
          ((camera.manualRender = !0), _cameras.push(camera));
        }
        return (
          UIL.global &&
            (_meshes || (_meshes = []), (layer._uilLayerName = layerName), _meshes.push(layer)),
          parent?.tweenToggle &&
            (obj.toggle = {
              on: 0,
              link: {
                copy: (e) => {
                  0 == e.on && parent.flag("tweenToggle")
                    ? (parent.flag("tweenToggle", !1),
                      parent.events.fire(TweenUIL.TOGGLE, { on: !1 }))
                    : 1 != e.on ||
                      parent.flag("tweenToggle") ||
                      (parent.events.fire(TweenUIL.TOGGLE, { on: !0 }),
                      parent.flag("tweenToggle", !0));
                },
              },
            }),
          obj
        );
      }
      function getShaderObject(shader) {
        let obj = {};
        for (let key in shader.uniforms) {
          let uniform = shader.uniforms[key],
            value = uniform.value;
          void 0 === value ||
            (uniform.ignoreUIL && !uniform.enableTweenUIL) ||
            "HZ" == key ||
            ("number" == typeof value
              ? (obj[key] = { value: value, link: uniform })
              : value instanceof Vector2
                ? (obj[key] = { x: value.x, y: value.y, link: value })
                : value instanceof Vector3
                  ? (obj[key] = {
                      x: value.x,
                      y: value.y,
                      z: value.z,
                      link: value,
                    })
                  : value instanceof Vector4
                    ? (obj[key] = {
                        x: value.x,
                        y: value.y,
                        z: value.z,
                        w: value.w,
                        link: value,
                      })
                    : value instanceof Color &&
                      (obj[key] = {
                        r: value.r,
                        g: value.g,
                        b: value.b,
                        a: 1,
                        link: value,
                      }));
        }
        return obj;
      }
      function isElement(object) {
        return (
          !!object?.div?.hydraObject ||
          (void 0 !== GLUIObject && (object instanceof GLUIObject || object instanceof GLUIText))
        );
      }
      function getElementObject($element) {
        let obj = { _config: { nudgeMultiplier: 1 } };
        return (
          void 0 !== $element.x && (obj.x = { value: $element.x, link: $element }),
          void 0 !== $element.y && (obj.y = { value: $element.y, link: $element }),
          void 0 !== $element.z && (obj.z = { value: $element.z, link: $element }),
          void 0 !== $element.scale && (obj.scale = { value: $element.scale, link: $element }),
          void 0 !== $element.scaleX && (obj.scaleX = { value: $element.scaleX, link: $element }),
          void 0 !== $element.scaleY && (obj.scaleY = { value: $element.scaleY, link: $element }),
          void 0 !== $element.rotation &&
            (obj.rotation = { value: $element.rotation, link: $element }),
          void 0 !== $element.rotationX &&
            (obj.rotationX = { value: $element.rotationX, link: $element }),
          void 0 !== $element.rotationY &&
            (obj.rotationY = { value: $element.rotationY, link: $element }),
          void 0 !== $element.rotationZ &&
            (obj.rotationZ = { value: $element.rotationZ, link: $element }),
          void 0 !== $element.alpha && (obj.alpha = { value: $element.alpha, link: $element }),
          obj
        );
      }
      function getPlainObject(object) {
        let obj = {};
        for (let key in object) {
          let value = object[key];
          "number" == typeof value
            ? (obj[key] = { value: value, link: object })
            : value instanceof Vector2
              ? (obj[key] = { x: value.x, y: value.y, link: value })
              : value instanceof Vector3
                ? (obj[key] = {
                    x: value.x,
                    y: value.y,
                    z: value.z,
                    link: value,
                  })
                : value instanceof Vector4
                  ? (obj[key] = {
                      x: value.x,
                      y: value.y,
                      z: value.z,
                      w: value.w,
                      link: value,
                    })
                  : value instanceof Color &&
                    (obj[key] = {
                      r: value.r,
                      g: value.g,
                      b: value.b,
                      a: 1,
                      link: value,
                    });
        }
        if (Object.keys(obj).length) return obj;
      }
      async function getObjectsFromLayout(layout) {
        let layers = await layout.getAllLayers(),
          objects = {};
        for (let key in layers) {
          let layer = layers[key];
          ignoreObject(key, layout.name) ||
            (!1 !== layer.animates &&
              (layer.ready && !layer.disabled && (await layer.ready()), (objects[key] = layer)));
        }
        return objects;
      }
      function createSheetFromObjects(objects, layoutName, { isSceneLayout: isSceneLayout }) {
        let sheet = {};
        for (let name in objects) {
          let object = objects[name],
            key = `${layoutName}&${name}`;
          if (ignoreObject(name)) continue;
          let matched = !1;
          if (object.uniforms) _flatMap[key] = sheet[key] = getShaderObject(object);
          else if (isElement(object)) _flatMap[key] = sheet[key] = getElementObject(object);
          else if (
            ((object instanceof Mesh || object instanceof Group) &&
              ((_flatMap[key] = sheet[key] = getMeshObject(object, null, key)), (matched = !0)),
            object.shader &&
              ((_flatMap[`${key}&shader`] = sheet[`${key}&shader`] =
                getShaderObject(object.shader)),
              (matched = !0)),
            object.behavior &&
              ((_flatMap[`${key}&behavior`] = sheet[`${key}&behavior`] =
                getShaderObject(object.behavior)),
              (matched = !0)),
            object.group &&
              ((_flatMap[key] = sheet[key] = getMeshObject(object.group, object, key)),
              (matched = !0)),
            !matched && !isSceneLayout)
          ) {
            let obj = getPlainObject(object);
            obj
              ? (_flatMap[key] = sheet[key] = obj)
              : console.warn(`Unclear how to animate object ${key}`, object);
          }
        }
        return sheet;
      }
      function makeSendable() {
        const cleanObject = (obj) => {
          let newObj = {};
          for (let key in obj) "link" != key && (newObj[key] = obj[key]);
          return newObj;
        };
        let obj = { sheets: [], nudgeMultiplier: _config.nudgeMultiplier };
        return (
          _audioFile && (obj.audioFile = _audioFile),
          (obj.filePath = Assets.getPath(`assets/data/timeline-${_name}.json`)),
          obj.filePath.includes("http") || (obj.filePath = Hydra.absolutePath(obj.filePath)),
          _config.sheets.forEach((sheet) => {
            let newSheet = {};
            for (let key in sheet) {
              let top = sheet[key];
              newSheet[key] = {};
              for (let key2 in top) newSheet[key][key2] = cleanObject(top[key2]);
            }
            obj.sheets.push(newSheet);
          }),
          obj
        );
      }
      function completeDataLink(dataObj, realObj) {
        let transform;
        for (let key2 in realObj) {
          if ("_config" === key2) continue;
          let valueObj = dataObj[key2],
            link = realObj[key2].link;
          void 0 !== valueObj.value
            ? (!Object.prototype.hasOwnProperty.call(link, key2) &&
              Object.prototype.hasOwnProperty.call(link, "value")
                ? (link.value = valueObj.value)
                : (link[key2] = valueObj.value),
              (transform = link.transform),
              transform && "alpha" == key2 && link.css("opacity", valueObj.value))
            : link.copy(valueObj);
        }
        transform && transform();
      }
      function linkData(data) {
        for (let key in data) {
          let dataObj = data[key],
            realObj = _flatMap[key];
          ((_changedKeys[key] = !0), completeDataLink(dataObj, realObj));
        }
      }
      async function openEditor() {
        (_config.sheets || (await prepareConfig()),
          _editor && _editor.close(),
          ((_editor = new UILExternalTimeline(_name, 800, 1200, makeSendable())).onMessage =
            linkData),
          (_editor.onVisualizePath = handleVisualizePath),
          (_editor.onPositionChange = onPositionChange),
          (_this.state.editorOpen = !0),
          (_editor.onDestroy = (_) => {
            ((_editor = null),
              (_this.state.editorOpen = !1),
              handleVisualizePath({}),
              _meshes?.forEach((mesh) => {
                (mesh._cameraUIL &&
                  ((mesh._cameraUIL.tweenUIL_groupPos = null),
                  (mesh._cameraUIL.tweenUIL_scale = null),
                  (mesh._cameraUIL.tweenUIL_rotation = null),
                  (mesh._cameraUIL.tweenUIL_position = null),
                  (mesh._cameraUIL.tweenUIL_zoom = null),
                  (mesh._cameraUIL.tweenUIL_fov = null),
                  (mesh._cameraUIL.tweenUIL_near = null),
                  (mesh._cameraUIL.tweenUIL_far = null),
                  (mesh._cameraUIL.tweenUIL_lookAt = null),
                  (mesh._cameraUIL.tweenUIL_cameraRotation = null),
                  (mesh._cameraUIL.tweenUIL_viewportFocus = null)),
                  mesh._meshUIL &&
                    ((mesh._meshUIL.tweenUIL_scale = null),
                    (mesh._meshUIL.tweenUIL_position = null),
                    (mesh._meshUIL.tweenUIL_rotation = null)));
              }));
          }),
          _meshes?.forEach((mesh) => {
            mesh._cameraUIL
              ? ((mesh._cameraUIL.tweenUIL_groupPos = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "position")),
                (mesh._cameraUIL.tweenUIL_scale = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "scale")),
                (mesh._cameraUIL.tweenUIL_rotation = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "rotation")),
                (mesh._cameraUIL.tweenUIL_position = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "cameraPos")),
                (mesh._cameraUIL.tweenUIL_zoom = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, { zoom: value }, "projection")),
                (mesh._cameraUIL.tweenUIL_fov = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, { fov: value }, "projection")),
                (mesh._cameraUIL.tweenUIL_near = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, { near: value }, "projection")),
                (mesh._cameraUIL.tweenUIL_far = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, { far: value }, "projection")),
                (mesh._cameraUIL.tweenUIL_lookAt = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "lookAt")),
                (mesh._cameraUIL.tweenUIL_cameraRotation = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "cameraRotation")),
                (mesh._cameraUIL.tweenUIL_viewportFocus = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "viewportFocus")))
              : mesh._meshUIL &&
                ((mesh._meshUIL.tweenUIL_position = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "position")),
                (mesh._meshUIL.tweenUIL_scale = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "scale")),
                (mesh._meshUIL.tweenUIL_rotation = (value) =>
                  _editor.sendUpdate(mesh._uilLayerName, value, "rotation")));
          }));
      }
      function updateKeyframeData() {
        for (let key in _sheets)
          _this.keyframeTotalProgress = _keyframes.positionObject.position / _sheets[key].length;
        ((_this.keyframeIndex = _keyframes.current),
          (_this.keyframeLocalProgress = Math.fract(_keyframes.positionObject.position)));
      }
      function updateKeyframeLoop(hz) {
        _keyframes.positionObject.position = Math.lerp(
          _keyframes.positionObject.target,
          _keyframes.positionObject.position,
          0.07 * hz,
          !1,
        );
        for (let key in _sheets)
          _sheets[key].sequence.position = _keyframes.positionObject.position;
        updateKeyframeData();
      }
      function onPositionChange(position) {
        _this.state.editorPosition = position;
      }
      function handleVisualizePath(data) {
        if (!_pathVisualization && !data.position) return;
        let object;
        if (
          (_pathVisualization || (_pathVisualization = _this.initClass(TweenUILPathVisualization)),
          data.sheetId)
        ) {
          let parts = data.objectKey.split(" » "),
            prefix = parts.length > 1 ? parts[0] : data.sheetId,
            objectKey = parts.length > 1 ? parts.last() : data.objectKey,
            key = `${prefix}&${objectKey}`;
          ((object = _meshes.find(({ _uilLayerName: _uilLayerName }) => _uilLayerName === key)),
            !object &&
              parts.length <= 1 &&
              (object = _meshes.find(
                ({ _uilLayerName: _uilLayerName }) => _uilLayerName?.split("&")?.[1] === objectKey,
              )),
            object ||
              _layersWithWarnings[key] ||
              (console.warn(`Couldn’t find mesh for object “${key}”.`),
              (_layersWithWarnings[key] = !0)));
        }
        ((_pathVisualization.object = object), _pathVisualization.update(data));
      }
      (!(async function () {
        ((_this.state = AppState.createLocal({
          editorOpen: !1,
          editorPosition: 0,
        })),
          (function initRafDriver() {
            ((_rafDriver = Theatre.core.createRafDriver({
              name: ["TweenUIL", _name, _noCache].filter(Boolean).join("_"),
            })),
              _this.startRender(loop));
          })(),
          (_input = InputUIL.create(_name + "_tween", _group)).setLabel(_name),
          _input.addButton("edit", {
            label: "Edit",
            actions: [{ title: "Editor", callback: openEditor }],
          }));
        try {
          if (
            ((_savedState = TweenUIL.jsons[_name]),
            _savedState?.then && (_savedState = await _savedState),
            !_savedState)
          ) {
            let promise = get(Assets.getPath(`assets/data/timeline-${_name}.json`));
            if (
              (_noCache && (TweenUIL.jsons[_name] = promise),
              "string" == typeof (_savedState = await promise))
            )
              throw new Error("Malformed TweenUIL timeline");
          }
          _noCache &&
            ((_projectInstanceId = `instance_${_noCache}`), (TweenUIL.jsons[_name] = _savedState));
        } catch {
          (Hydra.LOCAL &&
            console.warn(
              `No saved TweenUIL timeline “timeline-${_name}.json”, create one with the Editor`,
            ),
            (_savedState = {
              sheetsById: {},
              definitionVersion: "0.4.0",
              revisionHistory: [],
            }));
        }
        ((_project = Theatre.core.getProject(_name, { state: _savedState })),
          _this._bindOnDestroy((_) => {
            _project.destroy();
          }),
          await _project.ready);
        for (let key in _savedState.sheetsById) {
          _sheets[key] = _project.sheet(key, {
            instanceId: _projectInstanceId,
          });
          let state = _savedState.sheetsById[key];
          (_group || initObjectsWithTracks(state),
            (_sheets[key].length = findTrueDuration(state.sequence)));
        }
        (_input.addButton("play", {
          label: "Play",
          actions: [{ title: "Play", callback: play }],
        }),
          _input.addRange("Scrub", 0, { min: 0, max: 1, step: 5e-4 }),
          (_input.onUpdate = async (key) => {
            if ("Scrub" == key) {
              _config.sheets || (await play());
              let value = _input.getNumber("Scrub");
              _this.seek(value);
            }
          }),
          _this.flag("ready", !0));
      })(),
        (this.play = async function (options) {
          return (await _this.wait("ready"), play(options));
        }),
        (this.seek = function (value) {
          if (_this.flag("ready")) {
            checkDuration();
            for (let key in _sheets)
              _sheets[key].sequence.position = Math.min(_sheets[key].length, _duration * value);
          }
        }),
        (this.seekImmediate = function (value) {
          (_this.seek(value), loop());
        }),
        (this.promise = async function () {
          return (await _this.wait("ready"), _promise);
        }),
        (this.setLabel = function (label) {
          _input && _input.setLabel(label);
        }),
        (this.preload = async function () {
          if ((await _this.wait("ready"), _config.sheets)) {
            if (!_this.flag("isLoaded")) return _this.wait("isLoaded");
          } else (await prepareConfig(), linkLocally());
          _this.seek(0);
        }),
        (this.loaded = async function () {
          if (!_this.flag("isLoaded") && _config.sheets) return _this.wait("isLoaded");
          await _this.preload();
        }),
        (this.seekToKeyframe = async function (index) {
          if ((_this.flag("isLoaded") || (await _this.preload()), !_keyframes))
            return console.warn("TweenUILConfig :: Missing keyframes! Add tween_anchor layer");
          ((_keyframes.current = index),
            (_keyframes.positionObject = {
              position: _keyframes[index].position,
              target: _keyframes[index].position,
            }),
            _this.seek(_keyframes[index].position),
            updateKeyframeData(),
            _this.startRender(updateKeyframeLoop, RenderManager.NATIVE_FRAMERATE));
        }),
        (this.playToKeyframe = async function (index, time, ease = "linear", delay) {
          (await _this.wait("ready"), _keyframes.positionObject || (await _this.seekToKeyframe(0)));
          let nextKeyframe = _keyframes[index],
            currentKeyframe = _keyframes[_keyframes.current];
          if (!nextKeyframe) return;
          let position = nextKeyframe.position;
          return (
            time || (time = 1e3 * Math.abs(nextKeyframe.position - currentKeyframe.position)),
            _keyframes.tween && (_keyframes.tween = clearTween(_keyframes.tween)),
            (_keyframes.current = index),
            _this.flag("playingToKeyframe", !0, time + 50),
            (_keyframes.tween = tween(
              _keyframes.positionObject,
              { target: position },
              time,
              ease,
              delay,
            )),
            _keyframes.tween.promise()
          );
        }),
        (this.peekInKeyframeDirection = function (dir, percent) {
          if (!_keyframes || _this.flag("playingToKeyframe")) return;
          let currentKeyframe = _keyframes[_keyframes.current],
            nextKeyframe = _keyframes[_keyframes.current + dir];
          nextKeyframe &&
            (_keyframes.positionObject.target = Math.mix(
              currentKeyframe.position,
              nextKeyframe.position,
              percent,
            ));
        }),
        (this.playToNextKeyframe = async function (time, ease, delay) {
          return this.playToKeyframe(_keyframes.current + 1, time, ease, delay);
        }),
        (this.playToPrevKeyframe = async function (time, ease, delay) {
          return this.playToKeyframe(_keyframes.current - 1, time, ease, delay);
        }),
        (this.playToDirKeyframe = async function (dir, time, ease, delay) {
          return this.playToKeyframe(_keyframes.current + dir, time, ease, delay);
        }),
        this.get("position", (_) => {
          let position = 0;
          for (let key in _sheets)
            position = Math.max(position, _sheets[key]?.sequence?.position || 0);
          return (_this.state.editorOpen && (position = _this.state.editorPosition), position);
        }),
        this.get("progress", (_) => (checkDuration(), _this.position / _duration)),
        _this.get("duration", () => _duration),
        this.get("totalKeyframes", (_) => (_keyframes ? _keyframes.length : 0)),
        this.get("currentKeyframe", (_) => (_keyframes ? _keyframes.current : 0)),
        this.get("keyframeValue", (_) => {
          if (!_keyframes) return 0;
          let position = _this.position;
          for (let i = 0; i < _keyframes.length; ++i) {
            let keyframe = _keyframes[i];
            if (position >= keyframe.position) {
              let nextKeyframe = _keyframes[i + 1];
              if (!nextKeyframe) return keyframe.value;
              if (position < nextKeyframe.position)
                return Math.range(
                  position,
                  keyframe.position,
                  nextKeyframe.position,
                  keyframe.value,
                  nextKeyframe.value,
                  !0,
                );
            }
          }
          return _keyframes[0]?.value || 0;
        }),
        _this.get("keyframeSection", (_) => Math.fract(_this.keyframeValue)),
        (_this.getPositionAtKeyframeValue = (keyframeValue) => {
          let index = Math.floor(keyframeValue),
            position = _keyframes[index]?.position || 0,
            progress = Math.fract(keyframeValue);
          if (progress) {
            let nextPosition = _keyframes[index + 1]?.position;
            nextPosition && (position = Math.mix(position, nextPosition, progress));
          }
          return position;
        }),
        (_this.getProgressAtKeyframeValue = (keyframeValue) => (
          checkDuration(),
          _this.getPositionAtKeyframeValue(keyframeValue) / _duration
        )),
        (_this.getTrackData = function (objectName) {
          for (let key in _savedState.sheetsById) {
            let tracks = _savedState.sheetsById[key].sequence.tracksByObject;
            if (tracks[objectName]) return tracks[objectName];
          }
        }),
        this.get("manualRender", () => _manualRender),
        this.set("manualRender", (value) => {
          (value = !!value) !== _manualRender &&
            ((_manualRender = value) ? _this.stopRender(loop) : _this.startRender(loop));
        }),
        this.get("sheets", () => _sheets),
        (_this.update = () => {
          (_manualRender ||
            !Hydra.LOCAL ||
            _this.flag("manualRenderWarned") ||
            (console.warn("Set manualRender to true if using TweenUIL.update()"),
            _this.flag("manualRenderWarned", !0)),
            loop());
        }),
        (_this.setAudio = async function (path) {
          await _this.loaded();
          let source = Assets.getPath(path);
          for (let sheet in _this.sheets)
            _this.sheets[sheet].sequence.attachAudio({ source: source });
          ((_audioFile = source), _config && (_config.audioFile = source));
        }));
    },
    () => {
      ((TweenUIL.BEFORE_UPDATE = "TweenUIL.BEFORE_UPDATE"),
        (TweenUIL.UPDATED = "TweenUIL.UPDATED"));
    },
  ),
  Class(function UILFile(_offline, _path) {
    Inherit(this, Component);
    ((this.load = async function () {
      let path = window.UIL_STATIC_PATH || "assets/data/uil.json";
      try {
        let data = await get(path + "?v=" + (window._CACHE_ || Date.now()));
        if ("string" == typeof data) return Hydra.LOCAL ? null : {};
        if (data && window.ACTIVE_THEME_COLORS) {
          const colors = window.ACTIVE_THEME_COLORS;

          const isColorKey = (key) => {
            const k = key.toLowerCase();
            return k.endsWith('/utint') || 
                   k.endsWith('/ucolor') || 
                   k.endsWith('/ucolor0') || 
                   k.endsWith('/uphongcolor') || 
                   k.endsWith('/ufresnelcolor') || 
                   k.endsWith('/ubasecolor') ||
                   k.endsWith('/ufogcolor') ||
                   k.endsWith('color') || 
                   k.endsWith('fogcolor') || 
                   k.endsWith('streakcolor') || 
                   k.endsWith('halocolor') || 
                   k.endsWith('bloomtintcolor');
          };

          const prefixes = new Set();
          for (let k in data) {
            if (k.startsWith("TreeFBR/TreeFBR/") || 
                k.startsWith("RoomPBR/RoomPBR/") || 
                k.startsWith("PBR/PBR/") ||
                k.startsWith("FloorShader/FloorShader/") ||
                k.startsWith("WallShader/WallShader/") ||
                k.startsWith("PhysicalShader/PhysicalShader/") ||
                k.startsWith("HomeFloorShader/HomeFloorShader/") ||
                k.startsWith("HomeAlleyShader/HomeAlleyShader/") ||
                k.startsWith("HomeScreenLight/HomeScreenLight/") ||
                k.startsWith("BulbShader/BulbShader/") ||
                k.startsWith("ChainShader/ChainShader/") ||
                k.startsWith("SpineShader/SpineShader/") ||
                k.startsWith("TentacleShader/TentacleShader/") ||
                k.startsWith("WaterCeilingShader/WaterCeilingShader/") ||
                k.startsWith("WaterParticles/WaterParticles/")) {
              const lastSlash = k.lastIndexOf("/");
              if (lastSlash !== -1) {
                prefixes.add(k.substring(0, lastSlash + 1));
              }
            }
          }

          prefixes.forEach(prefix => {
            if (prefix.startsWith("TreeFBR/TreeFBR/")) {
              if (!data[prefix + "uColor"]) {
                data[prefix + "uColor"] = colors.dark; 
              }
              if (!data[prefix + "uFogColor"]) {
                data[prefix + "uFogColor"] = colors.dark;
              }
            } else if (prefix.startsWith("RoomPBR/RoomPBR/") || prefix.startsWith("PBR/PBR/")) {
              if (!data[prefix + "uTint"]) {
                data[prefix + "uTint"] = colors.dark;
              }
              if (!data[prefix + "uFogColor"]) {
                data[prefix + "uFogColor"] = colors.dark;
              }
            } else if (prefix.startsWith("PhysicalShader/PhysicalShader/")) {
              if (!data[prefix + "uTint"]) {
                data[prefix + "uTint"] = colors.dark;
              }
              if (!data[prefix + "uFogColor"]) {
                data[prefix + "uFogColor"] = colors.dark;
              }
            } else if (prefix.startsWith("WaterCeilingShader/WaterCeilingShader/")) {
              if (!data[prefix + "uColor"]) {
                data[prefix + "uColor"] = colors.primary;
              }
            } else if (prefix.startsWith("WaterParticles/WaterParticles/")) {
              if (!data[prefix + "uColor"]) {
                data[prefix + "uColor"] = colors.highlight;
              }
            } else {
              if (!data[prefix + "uColor"]) data[prefix + "uColor"] = colors.dark;
              if (!data[prefix + "uTint"]) data[prefix + "uTint"] = colors.dark;
              if (!data[prefix + "uFogColor"]) data[prefix + "uFogColor"] = colors.dark;
            }
          });

          const patchColorValue = (val, key) => {
            if (typeof val === "string") {
              const hex = val.toLowerCase();
              if (hex === "#ffd700") return colors.primary;
              if (hex === "#dc143c") return colors.dark;
              if (hex === "#ff4500") return colors.highlight;
              if (hex === "#7687a2") return colors.dark;
              if (hex === "#595959") return colors.dark;
              if (hex === "#454545") return colors.dark;
              if (hex === "#4f4f4f") return colors.dark;
              if (hex === "#6b6b6b") return colors.dark;
              if (hex === "#cceeff" || hex === "#c2dcff") return colors.highlight;
              if (isColorKey(key) && hex === "#ffffff") {
                if (key.includes("bloomTintColor") || key.includes("uLight") || key.includes("L_Element_9")) {
                  return colors.light;
                }
                return colors.primary;
              }
            } else if (Array.isArray(val)) {
              if (isColorKey(key) && val.length >= 3) {
                const r = val[0], g = val[1], b = val[2];
                if (b > r && b > 0.5) {
                  const hexToRgbNormalized = (hex) => {
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? [
                      parseInt(result[1], 16) / 255,
                      parseInt(result[2], 16) / 255,
                      parseInt(result[3], 16) / 255
                    ] : [1, 1, 1];
                  };
                  const rgb = hexToRgbNormalized(colors.highlight);
                  val[0] = rgb[0];
                  val[1] = rgb[1];
                  val[2] = rgb[2];
                }
              }
            }
            return val;
          };

          for (let k in data) {
            data[k] = patchColorValue(data[k], k);
          }
          console.log("UIL Patched in memory with active theme:", colors);
        }
        return data;
      } catch (e) {
        return {};
      }
    }),
      (this.save = async function (sessionData, data) {
        if ((Dev.writeFile(window.UIL_STATIC_PATH || "assets/data/uil.json", data), _offline)) {
          let partial = {};
          try {
            partial = await get("assets/data/uil-partial.json", data);
            for (let key in sessionData) partial[key] = sessionData[key];
          } catch (e) {
            partial = sessionData;
          }
          (Dev.writeFile("assets/data/uil-partial.json", partial),
            Storage.set("uil_update_partial", !0));
        }
      }));
  }),
  Class(function UILStorage() {
    Inherit(this, Component);
    const _this = this;
    var _storage,
      _platform,
      _fs,
      _keys,
      _storeIds = [],
      _data = {},
      _dataSession = {},
      _id = window.UIL_ID || "default",
      _remote = window.UIL_REMOTE || !1;
    ((window.UIL_ID = _id = _id.replaceAll(/[^a-zA-Z0-9 _-]/g, "")),
      (this.SAVE = "uil_save"),
      (this.state = AppState.createLocal()));
    const OFFLINE_FIREBASE = Utils.query("offlineFB");
    function clearOfflineData() {
      (Storage.set("uil_update_partial", !1), Dev.writeFile("assets/data/uil-partial.json", {}));
    }
    async function init() {
      (_fs && _fs.destroy(),
        (_fs = _this.initClass(uilFile() ? UILFile : UILRemote, OFFLINE_FIREBASE)));
      let data = await _fs.load();
      if (null === data) {
        let remoteFs = _this.initClass(UILRemote),
          remoteData = await remoteFs.load();
        confirm(
          "Looks like the local uil.json has merge conflicts, do you want to sync from Firebase and resolve it?",
        )
          ? ((_data[_id] = remoteData), await write(), window.location.reload())
          : (data = {});
      }
      for (let key in data) _this.state.set(key, data[key]);
      if (
        ((_data[_id] = data),
        (_this.loaded = !0),
        !OFFLINE_FIREBASE && Storage.get("uil_update_partial") && !uilFile())
      ) {
        if (
          !confirm(
            "Looks like you have UIL data captured offline, do you want to sync it to Firebase?",
          )
        )
          return clearOfflineData();
        let data = await get("assets/data/uil-partial.json");
        for (let key in data) _this.set(key, data[key]);
        (write(!0, !0), clearOfflineData());
      }
    }
    async function write(direct, silent) {
      let prevent = !1,
        e = { prevent: (_) => (prevent = !0) };
      (_this.events.fire(_this.SAVE, e),
        (!direct && (e.wait && (await e.wait()), prevent)) ||
          (_fs.save(_dataSession, _data[_id]),
          (_dataSession = {}),
          silent ||
            (__body.css({ display: "none" }),
            _this.delayedCall(() => {
              __body.css({ display: "block" });
            }, 100))));
    }
    function uilFile() {
      return (
        !Utils.query("editMode") &&
        (!Hydra.LOCAL ||
          (!(window.Config && Config.PLATFORM_CONFIG && Utils.query("uil")) &&
            (!!Device.mobile ||
              !!OFFLINE_FIREBASE ||
              !(!window._BUILT_ || Hydra.LOCAL) ||
              !!window.AURA ||
              !!window._UIL_FILE_ ||
              (!window._FIREBASE_UIL_ && !window.UIL_ID) ||
              (!Device.detect("hydra") && !Utils.query("uil")))))
      );
    }
    (Hydra.ready(async (_) => {
      (window.Platform && Platform.isDreamPlatform && Config.PLATFORM_CONFIG
        ? (async function initLocalCached() {
            ((_fs = _this.initClass(UILFile)),
              (_data[_id] = await _fs.load()),
              (_this.loaded = !0));
          })()
        : (Hydra.LOCAL && window.Platform && window.Platform.isPlatform) || init(),
        (Utils.query("editMode") ||
          (Hydra.LOCAL &&
            window.Platform &&
            window.Platform.isDreamPlatform &&
            Utils.query("uil")) ||
          (Hydra.LOCAL &&
            !Device.mobile &&
            !window._BUILT_ &&
            (Utils.query("uil") || Device.detect("hydra")))) &&
          __window.bind("keydown", (e) => {
            (e.ctrlKey || e.metaKey) && 83 == e.keyCode && (e.preventDefault(), write());
          }));
    }),
      (this.reload = function (id, path, persist) {
        ((_this.loaded = !1),
          _platform || (_platform = _id),
          persist && _storeIds.push(id),
          (_id = id),
          (window.UIL_ID = id),
          (window.UIL_STATIC_PATH = path),
          init());
      }),
      (this.set = function (key, value) {
        if (void 0 === value)
          return console.warn(`Trying to set UILStorage with an undefined value for ${key}`);
        (_this.state.set(key, value),
          null === value
            ? (delete _data[_id][key], (_dataSession[key] = value))
            : ((_data[_id][key] = value), (_dataSession[key] = value)));
      }),
      (this.setWrite = function (key, value) {
        (this.set(key, value), write(!0));
      }),
      (this.clearMatch = function (string) {
        for (let key in _data[_id]) key.includes(string) && delete _data[_id][key];
        write(!0);
      }),
      (this.write = function (silent) {
        write(!0, silent);
      }),
      (this.get = function (key) {
        let val = _data[_id] && _data[_id][key];
        if (
          (void 0 === val && _platform && (val = _data[_platform][key]),
          void 0 === val && _storeIds)
        )
          for (let i = 0; i < _storeIds.length; i++)
            try {
              val = _data[_storeIds[i]][key];
            } catch (e) {
              val = void 0;
            }
        return val;
      }),
      (this.ready = function () {
        return _this.wait(_this, "loaded");
      }),
      (this.getKeys = function () {
        return (_keys || (_keys = Object.keys(_data[_id])), _keys);
      }),
      (this.hasData = function () {
        return !!_data[_id];
      }),
      (_this.uploadFileToRemoteBucket = async function ({ file: file, progress: progress }) {
        if (!_remote) return;
        _storage || (await Services.ready(), (_storage = Services.app().storage()));
        let filename = file.name.replace(/ /g, "_");
        const ref = _storage.ref(`_tmp/${filename}`),
          path =
            `https://storage.googleapis.com/${ref.bucket}/uploads/${_id}/${filename}`.toLowerCase(),
          metadata = {
            customMetadata: { id: _id, path: path, contentType: file.type },
          },
          result = ref.put(file, metadata);
        let exists;
        for (
          progress &&
          result.on(
            "state_changed",
            (snapshot) => {
              let _progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 95;
              progress.css({ width: _progress + "%" });
            },
            (error) => {
              (err && console.log(error), progress.css({ width: 0 }));
            },
            () => {
              progress.css({ width: 0 });
            },
          );
          !exists;
        )
          try {
            (await fetch(path).then((r) => r.ok)) && (exists = !0);
          } catch (err) {
            exists = !1;
          }
        return metadata;
      }),
      (this.parse = function (key, hint) {
        let data = _data[_id][key];
        if (void 0 === data) return null;
        if (Array.isArray(data)) {
          if (hint instanceof Vector2) return { value: new Vector2().fromArray(data) };
          if (hint instanceof Vector3) return { value: new Vector3().fromArray(data) };
          if (hint instanceof Vector4) return { value: new Vector4().fromArray(data) };
        } else if ("string" == typeof data) {
          if ("#" === data.charAt(0)) return { value: new Color(data) };
          if (!isNaN(data)) return { value: Number(data) };
        }
        return { value: data };
      }));
  }, "static"),
  Class(function UILClipboard() {
    Inherit(this, Component);
    var _store = {};
    ((this.copy = function (folders) {
      _store = {};
      for (let key in folders) {
        let folder = folders[key];
        _store[folder.label] = folder.value;
      }
    }),
      (this.paste = function (folders) {
        for (let key in folders) {
          let folder = folders[key];
          folder &&
            null != _store[folder.label] &&
            (key.includes("name") ||
              key.includes("shader") ||
              (folder.force(_store[folder.label], !0), folder.finish()));
        }
      }),
      this.get("store", (_) => _store));
  }, "static"),
  Class(function UILWindow(_title, _opts = { hide: !1, drag: !0, resize: !0 }) {
    Inherit(this, Element);
    const _this = this;
    let $this,
      $header,
      $container,
      $toggle,
      $title,
      _folder,
      _hidden,
      _initialX,
      _initialY,
      _open = !_opts.closed,
      _x = _opts.left || 350,
      _y = _opts.top || 50,
      _xOffset = _x,
      _yOffset = _y,
      _dragging = !1;
    function hide() {
      ($this && $this.invisible(), (_hidden = !0), _this.onClose && _this.onClose());
    }
    function show() {
      ($this && $this.visible(), (_hidden = !1));
    }
    function onKeydown(e) {
      if (e.ctrlKey || e.metaKey) {
        if (72 == e.keyCode && e.shiftKey) {
          if (`${document.activeElement.type}`.includes(["textarea", "input", "number"])) return;
          (e.preventDefault(), _hidden ? show() : hide());
        }
        (67 == e.which &&
          e.shiftKey &&
          (e.preventDefault(), _folder.forEachFolder((f) => f.close())),
          79 == e.which &&
            e.shiftKey &&
            (e.preventDefault(), _folder.forEachFolder((f) => f.open())));
      }
    }
    function onMouseDown(e) {
      (e.preventDefault(),
        $header.css({ cursor: "move" }),
        (_initialX = e.clientX - _xOffset),
        (_initialY = e.clientY - _yOffset),
        (_dragging = !0),
        document.addEventListener("mousemove", onMouseMove, !1),
        document.addEventListener("mouseup", onMouseUp, !1));
    }
    function onMouseMove(e) {
      (e.preventDefault(),
        (_x = e.clientX - _initialX),
        (_y = e.clientY - _initialY),
        (_xOffset = _x),
        (_yOffset = _y),
        ($this.x = _x),
        ($this.y = _y),
        $this.transform());
    }
    function onMouseUp() {
      ($header.css({ cursor: "" }),
        (_initialX = _x),
        (_initialY = _y),
        (_dragging = !1),
        document.removeEventListener("mousemove", onMouseMove, !1),
        document.removeEventListener("mouseup", onMouseUp, !1));
    }
    function onToggle(e) {
      ("click" !== e.type && 13 !== e.which) ||
        (_open
          ? (function close() {
              ((_open = !1), $container.css({ display: "none" }), $toggle.text("▶"));
            })()
          : (function open() {
              ((_open = !0), $container.css({ display: "block" }), $toggle.text("▼"));
            })());
    }
    function undim() {
      _dragging || $this.css({ opacity: 1 });
    }
    function dim() {
      _dragging || $this.css({ opacity: 0.3 });
    }
    ((_this.id = _title),
      (function initHTML() {
        (($this = _this.element),
          $this.bg("#161616").transform({ x: _x, y: _y }).mouseEnabled(!0),
          $this.css({
            position: "absolute",
            userSelect: "none",
            overflowY: "auto",
            borderRadius: 4,
            maxHeight: _opts.maxHeight || "100%",
            border: "1px solid #2e2e2e",
          }));
      })(),
      (function initHeader() {
        (($header = $this.create("header")),
          $header.size("100%", "auto").bg("#272727"),
          $header.css({
            display: "block",
            color: "#B1B1B1",
            padding: "4px 4px",
            boxSizing: "border-box",
            fontFamily: "sans-serif",
            fontSize: 11,
            fontWeight: "bold",
            userSelect: "none",
            minWidth: 200,
          }),
          ($toggle = $header.create("toggle")),
          $toggle.text(_open ? "▼" : "▶").css({
            fontSize: 8,
            paddingLeft: 4,
            display: "inline-block",
            verticalAlign: "middle",
          }),
          $toggle.click(onToggle),
          ($title = $header.create("title")),
          $title.text(_opts.label || _title).css({ display: "inline-block", marginLeft: 4 }),
          $title.click(onToggle));
        let $close = $header.create("close");
        ($close.text("✕").css({
          position: "absolute",
          right: 7,
          top: 5,
          display: "inline-block",
        }),
          $close.click(hide));
      })(),
      (function initContainer() {
        (($container = $this.create("container")),
          $container.size(_opts.width || "auto", _opts.height || "auto"),
          $container.css({
            position: "realtive",
            overflowY: "auto",
            padding: 4,
            boxSizing: "border-box",
            minWidth: _opts.minWidth || 0,
          }),
          _opts.resize && $container.css({ resize: "both", minWidth: 200, minHeight: 60 }),
          _open || $container.css({ display: "none" }));
      })(),
      (function initGroup() {
        ((_folder = _this.initClass(
          UILFolder,
          _title,
          { hideTitle: !0, background: "#161616" },
          null,
        )),
          (_this.folder = _folder),
          $container.add(_folder));
      })(),
      (function addHandlers() {
        (document.addEventListener("keydown", onKeydown, !1),
          _opts.drag && $header.div.addEventListener("mousedown", onMouseDown, !1),
          _opts.hide &&
            ($this.div.addEventListener("mouseover", undim, !1),
            $this.div.addEventListener("mouseleave", dim, !1)));
      })(),
      (this.add = function (child) {
        return (_folder.add(child), _this);
      }),
      (this.remove = function (x) {
        return (_folder.remove(id), _this);
      }),
      (this.get = function (id) {
        return _folder.get(id);
      }),
      (this.find = function (id) {
        return _folder.find(id);
      }),
      (this.filter = function (str) {
        return _folder.filter(str);
      }),
      (this.show = function () {
        return (show(), _this);
      }),
      (this.hide = function () {
        return (hide(), _this);
      }),
      (this.isVisible = function () {
        return !_hidden;
      }),
      (this.enableSorting = function (key) {
        return (_folder.enableSorting && _folder.enableSorting(key), _this);
      }),
      (this.eliminate = function () {
        (_opts.drag && $header.div.removeEventListener("mousedown", onMouseDown, !1),
          _opts.hide &&
            ($this.div.removeEventListener("mouseover", undim, !1),
            $this.div.removeEventListener("mouseleave", dim, !1)),
          document.removeEventListener("keydown", onKeydown, !1));
      }));
  }),
  Class(function UILExternalColor(_title, _value) {
    Inherit(this, Component);
    const _this = this;
    var _window;
    function onReload() {
      _this.onDestroy();
    }
    (((_window = window.open(
      location.protocol + "//localhost/hydra/editor/color/index.html",
      `hydra_color_${_title}`,
      "width=480,height=220,left=200,top=100,location=no",
    )).window.onload = (_) => {
      _window.window.initPicker(_title, _value, _this);
    }),
      window.addEventListener("beforeunload", onReload),
      (this.update = function (value) {
        _this.events.fire(Events.UPDATE, { value: value });
      }),
      (this.onDestroy = function () {
        (window.removeEventListener("beforeunload", onReload),
          _window && _window.window && _window.window.close());
      }));
  }),
  Class(function UILExternalEditor(_title, _height = 500, _width = 700) {
    Inherit(this, Component);
    const _this = this;
    var _window, _code, _language;
    ((_window = window.open(
      location.protocol + "//localhost/hydra/editor/code/index.html",
      "_blank",
      `width=${_width},height=${_height},left=200,top=100`,
    )),
      _this.events.sub(Events.UNLOAD, (_) => _window.close()),
      (_window.window.onload = (_) => {
        _window.window.initEditor(_title, _code, _language, _this);
      }),
      (this.setCode = function (code, language) {
        ((_code = code), (_language = language));
      }),
      (this.saved = async function (code) {
        (_this.onSave && _this.onSave(code), await defer(), UILStorage.write());
      }));
  }),
  Class(function UILExternalFilePicker(callback, type = "textures") {
    Inherit(this, Component);
    const _this = this;
    var _window;
    async function init() {
      const assets = await get(Assets.getPath("assets/js/app/config/UILAssetsConfig.js"));
      let basePath, list;
      (eval(assets),
        "textures" === type &&
          ((basePath = `${document.location.pathname}/assets/images`),
          (list = window.UIL_ASSETS_TEXTURES)),
        "geometries" === type &&
          ((basePath = `${document.location.pathname}/assets/geometry`),
          (list = window.UIL_ASSETS_GEOMETRIES)),
        (_window = window.open(
          `${location.protocol}//localhost/hydra/editor/filepicker/index.html`,
          "pick file",
          "width=800,height=700",
        )),
        _this.events.sub(Events.UNLOAD, (_) => _window.close()),
        (_window.window.onload = (_) => {
          _window.window.initPicker(_this, basePath, list);
        }),
        window.addEventListener("beforeunload", onReload));
    }
    function onReload() {
      _this.onDestroy();
    }
    (!(async function () {
      (await Dev.execUILScript("assetsconfig"), await init());
    })(),
      (this.refresh = function () {
        (_window && _window.window && _window.window.close(), init());
      }),
      (this.update = function (value) {
        callback && callback(value);
      }),
      (this.onDestroy = function () {
        (window.removeEventListener("beforeunload", onReload),
          _window && _window.window && _window.window.close());
      }));
  }),
  Class(function UILExternalTimeline(_title, _height = 500, _width = 700, _config) {
    Inherit(this, Component);
    const _this = this;
    var _window;
    ((_window = window.open(
      location.protocol + "//localhost/hydra/editor/timeline/index.html",
      "_blank",
      `width=${_width},height=${_height},left=200,top=100`,
    )),
      _this.events.sub(Events.UNLOAD, (_) => _window.close()),
      (_window.window.onload = (_) => {
        _window.window.initEditor(_title, _config);
      }),
      _window.window.addEventListener("message", (e) => {
        if ((e.data.bundle && _this.onMessage && _this.onMessage(e.data.bundle), e.data.save)) {
          let path;
          (_this.onSave && _this.onSave(),
            window.UIL_STATIC_PATH
              ? ((path = window.UIL_STATIC_PATH), (path = path.substring(0, path.lastIndexOf("/"))))
              : (path = "assets/data"),
            Dev.writeFile(`${path}/timeline-${_title}.json?compress`, e.data.save));
        }
        (e.data.visualizePath && _this.onVisualizePath?.(e.data.visualizePath),
          void 0 !== e.data.position &&
            _this.onPositionChange &&
            _this.onPositionChange(e.data.position));
      }),
      _this.startRender((_) => {
        _window.closed && _this.destroy();
      }, 10),
      (this.saved = async function (code) {
        (_this.onSave && _this.onSave(code), await defer(), UILStorage.write());
      }),
      (this.sendUpdate = function (layerName, value, key) {
        _window.window.sendUpdate(layerName, value, key);
      }));
  }),
  Namespace("FX"),
  FX.Class(
    function UnrealBloom(_nuke, options, _unique) {
      Inherit(this, Component);
      var _triangleGeometry,
        _luminosityShader,
        _compositeShader,
        _mesh,
        _inputTexture,
        _this = this;
      if ("object" == typeof _nuke && _nuke.isAppState) {
        let params = _nuke;
        ((_nuke = _this.parent.nuke || params.nuke || World.NUKE),
          (_unique = params.unique),
          (options = params));
      }
      "string" == typeof options
        ? ((_unique = _params), (options = {}), (_nuke = World.NUKE))
        : "string" == typeof _nuke
          ? ((_unique = _nuke), (options = {}), (_nuke = World.NUKE))
          : !_nuke || _nuke instanceof Nuke
            ? ((_nuke = _nuke || World.NUKE), (options = options || {}), (_unique = _unique || ""))
            : ((options = _nuke), (_nuke = World.NUKE));
      var _oldClearColor = new Color(),
        _oldClearAlpha = 1,
        _renderTargetsHorizontal = [],
        _renderTargetsVertical = [],
        _separableBlurShaders = [],
        _nMips = options.nMips || 3,
        _DPR = options.dpr || _nuke.dpr,
        _blurDirectionX = new Vector2(_DPR, 0),
        _blurDirectionY = new Vector2(0, _DPR),
        _kernelSizeArray = options.kernelSizeArray || [3, 5, 7, 9, 11],
        _bloomFactors = options.bloomFactors || [1, 0.8, 0.6, 0.4, 0.2],
        _useRTPool = !1 !== options.useRTPool;
      function render() {
        if (!_this.enabled || !1 === _this.visible) return;
        let renderer = _nuke.renderer;
        (_oldClearColor.copy(renderer.getClearColor()),
          (_oldClearAlpha = renderer.getClearAlpha()));
        let oldAutoClear = renderer.autoClear;
        ((renderer.autoClear = !0), renderer.setClearColor(_this.clearColor, 0));
        let inputRenderTarget = _inputTexture || _nuke.rttBuffer.texture;
        _luminosityShader.uniforms.luminosityThreshold.value > 0.01 &&
          ((_luminosityShader.uniforms.tDiffuse.value = inputRenderTarget),
          (_mesh.shader = _luminosityShader),
          renderer.renderSingle(_mesh, _nuke.camera, _this.renderTargetBright),
          (inputRenderTarget = _this.renderTargetBright));
        for (let i = 0; i < _nMips; i++)
          ((_mesh.shader = _separableBlurShaders[i]),
            (_separableBlurShaders[i].uniforms.colorTexture.value = inputRenderTarget),
            (_separableBlurShaders[i].uniforms.direction.value = _blurDirectionX),
            renderer.renderSingle(_mesh, _nuke.camera, _renderTargetsHorizontal[i]),
            (_separableBlurShaders[i].uniforms.colorTexture.value =
              _renderTargetsHorizontal[i].texture),
            (_separableBlurShaders[i].uniforms.direction.value = _blurDirectionY),
            renderer.renderSingle(_mesh, _nuke.camera, _renderTargetsVertical[i]),
            (inputRenderTarget = _renderTargetsVertical[i]));
        ((_mesh.shader = _compositeShader),
          renderer.renderSingle(_mesh, _nuke.camera, _renderTargetsHorizontal[0]),
          renderer.setClearColor(_oldClearColor, _oldClearAlpha),
          (renderer.autoClear = oldAutoClear));
      }
      function resizeHandler() {
        (_this.resolution.set(_nuke.stage.width, _nuke.stage.height).multiplyScalar(_DPR),
          (_blurDirectionX.x = _DPR),
          (_blurDirectionY.y = _DPR));
        let resx = Math.round(_this.resolution.x / 2),
          resy = Math.round(_this.resolution.y / 2);
        _this.renderTargetBright && _this.renderTargetBright.setSize(resx, resy);
        for (var i = 0; i < _renderTargetsHorizontal.length; i++) {
          (_renderTargetsHorizontal[i].setSize(resx, resy),
            _renderTargetsVertical[i].setSize(resx, resy));
          let shader = _separableBlurShaders[i];
          (shader && (shader.uniforms.texSize.value = new Vector2(resx, resy)),
            (resx = Math.round(resx / 2)),
            (resy = Math.round(resy / 2)));
        }
      }
      ((this.uniforms = {
        tUnrealBloom: { value: null, ignoreUIL: !0 },
        unique: _unique,
      }),
        (this.resolution = new Vector2(_nuke.stage.width * _DPR, _nuke.stage.height * _DPR)),
        (this.clearColor = new Color(0, 0, 0)),
        (this.enabled = void 0 === options.enabled || options.enabled),
        (this.outputTexture = null),
        (function initRTs() {
          if (FX.UnrealBloom.hasRTs) return;
          let pars = {
              minFilter: Texture.LINEAR,
              magFilter: Texture.LINEAR,
              format: Texture.RGBAFormat,
            },
            resx = Math.round(_this.resolution.x / 2),
            resy = Math.round(_this.resolution.y / 2);
          ((_this.renderTargetBright = new RenderTarget(resx, resy, pars)),
            (_this.renderTargetBright.texture.generateMipmaps = !1),
            FX.UnrealBloom.putRT("renderTargetBright", _this.renderTargetBright));
          for (let i = 0; i < _nMips; i++) {
            let renderTargetHorizonal = new RenderTarget(resx, resy, pars);
            ((renderTargetHorizonal.texture.generateMipmaps = !1),
              _renderTargetsHorizontal.push(renderTargetHorizonal),
              FX.UnrealBloom.putRT("mipHorizontal" + i, renderTargetHorizonal));
            let renderTargetVertical = new RenderTarget(resx, resy, pars);
            ((renderTargetVertical.texture.generateMipmaps = !1),
              _renderTargetsVertical.push(renderTargetVertical),
              FX.UnrealBloom.putRT("mipVertical" + i, renderTargetVertical),
              (resx = Math.round(resx / 2)),
              (resy = Math.round(resy / 2)));
          }
          ((_this.outputTexture = _renderTargetsHorizontal[0].texture),
            (_this.uniforms.tUnrealBloom.value = _renderTargetsHorizontal[0].texture));
        })(),
        (function initScene() {
          ((_triangleGeometry = World.QUAD),
            (_luminosityShader = _this.initClass(Shader, "UnrealBloomLuminosity", {
              tDiffuse: { value: null, ignoreUIL: !0 },
              luminosityThreshold: { value: 1 },
              smoothWidth: { value: 0.01, ignoreUIL: !0 },
              defaultColor: { value: new Color(0), ignoreUIL: !0 },
              defaultOpacity: { value: 0, ignoreUIL: !0 },
              unique: _unique,
            })),
            ((_mesh = new Mesh(_triangleGeometry, _luminosityShader)).frustumCulled = !1));
        })(),
        (function initBlurShaders() {
          let resx = Math.round(_this.resolution.x / 2),
            resy = Math.round(_this.resolution.y / 2);
          for (let i = 0; i < _nMips; i++) {
            let shader = _this.initClass(
              Shader,
              "UnrealBloomGaussian",
              {
                unique: _unique,
                colorTexture: { value: null },
                texSize: { value: new Vector2(resx, resy) },
                direction: { value: new Vector2(0.5, 0.5) },
              },
              null,
              (glsl) =>
                `\n#define KERNEL_RADIUS ${_kernelSizeArray[i]}\n#define SIGMA ${_kernelSizeArray[i]}\n${glsl}`,
              `gaussian${i}`,
            );
            (_separableBlurShaders.push(shader),
              (resx = Math.round(resx / 2)),
              (resy = Math.round(resy / 2)));
          }
        })(),
        (function initCompositeShader() {
          let uniforms = {
            bloomStrength: { value: 1 },
            bloomTintColor: { value: new Color("#ffffff") },
            bloomRadius: { value: 0 },
            unique: _unique,
          };
          for (let i = 0; i < _nMips; i++)
            uniforms[`blurTexture${i + 1}`] = {
              value: _useRTPool ? null : _renderTargetsVertical[i].texture,
              ignoreUIL: !0,
            };
          (_compositeShader = _this.initClass(
            Shader,
            "UnrealBloomComposite",
            uniforms,
            null,
            (glsl, type) => {
              if ("vs" === type) return glsl;
              let compositeUniforms = "",
                compositeMain = "";
              for (let i = 0; i < _nMips; i++)
                ((compositeUniforms += `uniform sampler2D blurTexture${i + 1};\n`),
                  (compositeMain += `lerpBloomFactor(${_bloomFactors[i].toFixed(4)}) * vec4(bloomTintColor, 1.0) * texture2D(blurTexture${i + 1}, vUv) ${i < _nMips - 1 ? "+ " : ""}`));
              return (glsl = glsl.replace(
                "uniform sampler2D blurTexture1;",
                compositeUniforms,
              )).replace(
                "lerpBloomFactor(1.0) * vec4(bloomTintColor, 1.0) * texture2D(blurTexture1, vUv)",
                compositeMain,
              );
            },
          )).needsUpdate = !0;
        })(),
        (function initPass() {
          _this.pass = _this.initClass(NukePass, "UnrealBloomPass", _this.uniforms);
        })(),
        (function addListeners() {
          (_this.events.sub(Events.RESIZE, resizeHandler),
            _this.events.sub(_nuke, Nuke.BEFORE_PASSES, render),
            _this.startRender(() => {}));
        })(),
        options.noUIL ||
          _this.delayedCall((_) => {
            (ShaderUIL.add(_luminosityShader).setLabel("UnrealBloom Luminosity"),
              ShaderUIL.add(_compositeShader).setLabel("UnrealBloom Composite"));
          }, 2e3),
        this.set("texture", (texture) => {
          _inputTexture = texture;
        }),
        this.get("luminosityShader", (_) => _luminosityShader),
        this.get("compositeShader", (_) => _compositeShader),
        this.set("dpr", (dpr) => {
          ((_DPR = dpr), resizeHandler());
        }),
        (this.renderBloom = render),
        (this.renderMesh = _mesh),
        (this.onDestroy = function () {
          (_renderTargetsHorizontal.forEach((r) => r.destroy()),
            _renderTargetsVertical.forEach((r) => r.destroy()),
            _this.renderTargetBright && _this.renderTargetBright.destroy());
        }),
        (this.getRTs = function () {
          const rt = FX.UnrealBloom.getRT;
          ((_this.renderTargetBright = rt("renderTargetBright")),
            (_renderTargetsHorizontal = []),
            (_renderTargetsVertical = []));
          for (let i = 0; i < _nMips; i++)
            (_renderTargetsHorizontal.push(rt("mipHorizontal" + i)),
              _renderTargetsVertical.push(rt("mipVertical" + i)),
              (_compositeShader.uniforms[`blurTexture${i + 1}`].value =
                _renderTargetsVertical[i].texture));
          ((_this.outputTexture = _renderTargetsHorizontal[0].texture),
            (_this.uniforms.tUnrealBloom.value = _renderTargetsHorizontal[0].texture),
            resizeHandler());
        }),
        (this.putRTs = function () {
          ((_this.renderTargetBright = null),
            (_renderTargetsHorizontal = []),
            (_renderTargetsVertical = []));
        }),
        (this.onInvisible = function () {
          (_this.putRTs(), (_this.visible = !1));
        }),
        (this.onVisible = function () {
          (_this.getRTs(), (_this.visible = !0));
        }));
    },
    (_) => {
      var _pool = {};
      ((FX.UnrealBloom.putRT = function (key, rt) {
        ((FX.UnrealBloom.hasRTs = !0), (_pool[key] = rt));
      }),
        (FX.UnrealBloom.getRT = function (key) {
          return _pool[key];
        }));
    },
  ),
  Class(function UnsupportedRedirect() {
    Inherit(this, Component);
    var _this = this,
      _tests = [];
    ((this.BOTS = [
      "google",
      "apis-google",
      "mediapartners-google",
      "adsbot-google",
      "googlebot",
      "feedfetcher-google",
      "google-read-aloud",
      "storebot-google",
      "bingbot",
      "facebot",
      "facebookexternalhit",
      "slurp",
      "duckduckbot",
      "baiduspider",
      "yandexbot",
      "sogou",
      "exabot",
    ]),
      (this.chrome = 55),
      (this.firefox = 51),
      (this.safari = 8),
      (this.ie = 13),
      (this.requiresWebGL = !0),
      (this.url = "./fallback"),
      (this.test = function () {
        _this.unsupported() &&
          (function redirect() {
            window.location = _this.url;
          })();
      }),
      (this.unsupported = function () {
        return (
          !_this.BOTS.find((bot) => Device.detect(bot)) &&
          (!!_tests.find((test) => test()) ||
            !(!_this.requiresWebGL || (Device.graphics.webgl && !GPU.BLOCKLIST)) ||
            ("chrome" === Device.system.browser && Device.system.browserVersion < _this.chrome) ||
            ("firefox" === Device.system.browser && Device.system.browserVersion < _this.firefox) ||
            ("safari" === Device.system.browser && Device.system.browserVersion < _this.safari) ||
            ("ie" === Device.system.browser && Device.system.browserVersion < _this.ie) ||
            !!Utils.query("unsupported"))
        );
      }),
      (this.custom = function (...tests) {
        _tests.push(...tests);
      }));
  }, "static"),
  Class(function AbstractUserInput() {
    Inherit(this, Component);
    const _this = this;
    var _downTime;
    ((this.position = new Vector3()),
      (this.quaternion = new Quaternion()),
      (this.plane2D = new Vector2()),
      (this.isDown = !1),
      (this.directionVec = new Vector3()),
      (this.velocity = new VelocityTracker(_this.position)),
      this.velocity.start(),
      (this.down = function () {
        ((_this.isDown = !0), _this.events.fire(UserInput.DOWN), (_downTime = Render.TIME));
      }),
      (this.up = function () {
        ((_this.isDown = !1),
          Render.TIME - _downTime < 500 && _this.click(),
          _this.events.fire(UserInput.UP));
      }),
      (this.click = function () {
        _this.events.fire(UserInput.CLICK);
      }));
  }),
  Class(function UserInput() {
    Inherit(this, Component);
    const _this = this;
    var _vr, _gazeSelector, _manager;
    function updateState() {
      for (let i = 0; i < _this.inputs.length; i++)
        _this.inputs[i].updateVRState && _this.inputs[i].updateVRState(_this.inputs);
    }
    ((this.inputs = []),
      (this.DOWN = "user_input_down"),
      (this.UP = "user_input_up"),
      (this.CLICK = "user_input_click"),
      (this.pointerDistanceFromCamera = 1),
      (this.camera = null),
      (async function () {
        (await Hydra.ready(),
          await Hydra.ready(),
          await RenderManager.initialized,
          (_this.camera = World.CAMERA),
          (_manager = _this.initClass(UserInputPositionManager)),
          window.UserInputBody && (_this.body = _this.initClass(UserInputBody)),
          RenderManager.type != RenderManager.VR
            ? (_this.inputs.push(_this.initClass(UserInputMouseTouch)),
              _this.flag("loaded", !0),
              _manager.initPointer())
            : ((_vr = !0),
              _manager.initVR(),
              VRInput.ready().then((_) => {
                (VRInput.controllers.forEach((controller) => {
                  _this.inputs.push(
                    _this.initClass(UserInputVRController, controller, "controller"),
                  );
                }),
                  _this.inputs.forEach((inp) => (inp.active = !inp.handedness)),
                  _this.flag("loaded", !0),
                  updateState(),
                  _manager.update("controller"));
              }),
              VRInput.handsReady().then((_) => {
                (_this.inputs.push(
                  _this.initClass(UserInputVRController, VRInput.getHand("left"), "hand"),
                ),
                  _this.inputs.push(
                    _this.initClass(UserInputVRController, VRInput.getHand("right"), "hand"),
                  ),
                  _this.flag("loaded", !0),
                  updateState(),
                  _manager.update("hand"),
                  _this.inputs.forEach((inp) => (inp.active = inp.handedness)),
                  _this.events.sub(VRInput.CHANGE, (type) => {
                    _manager.update("controllers" == type ? "controller" : "hand");
                    let left = VRInput.getHand("left");
                    for (let i = 0; i < _this.inputs.length; i++)
                      if (_this.inputs[i].controller == left) return;
                    (_this.inputs.push(
                      _this.initClass(UserInputVRController, VRInput.getHand("left"), "hand"),
                    ),
                      _this.inputs.push(
                        _this.initClass(UserInputVRController, VRInput.getHand("right"), "hand"),
                      ),
                      updateState(),
                      _this.inputs.forEach(
                        (inp) => (inp.active = "hands" == type ? inp.handedness : !inp.handedness),
                      ));
                  }));
              })));
      })(),
      (this.bindClick = async function (obj, hover, click) {
        (await _this.ready(), _this.inputs.forEach((inp) => inp.bindClick(obj, hover, click)));
      }),
      (this.unbindClick = async function (obj) {
        (await _this.ready(), _this.inputs.forEach((inp) => inp.unbindClick(obj)));
      }),
      (this.bindGaze = async function (obj, hover, click) {
        _vr
          ? (_gazeSelector || (_gazeSelector = UserInputGazeSelector.instance()),
            _gazeSelector.bind(obj, hover, click))
          : _this.bindClick(obj, hover, click);
      }),
      (this.unbindGaze = function (obj) {
        _gazeSelector && _gazeSelector.unbind(obj);
      }),
      (this.getGaze = function () {
        return (_gazeSelector || (_gazeSelector = UserInputGazeSelector.instance()), _gazeSelector);
      }),
      (this.bindProximity = async function (obj, hover, click) {
        (await _this.ready(), _this.inputs.forEach((inp) => inp.bindProximity(obj, hover, click)));
      }),
      (this.unbindProximity = async function (obj) {
        (await _this.ready(), _this.inputs.forEach((inp) => inp.unbindProximity(obj)));
      }),
      (this.alignToPlane = async function (mesh) {
        (await _this.ready(), _this.inputs.forEach((inp) => inp.alignToPlane(mesh)));
      }),
      (this.ready = function () {
        return _this.wait("loaded");
      }),
      (this.getGazeMesh = function () {
        return (
          _gazeSelector || (_gazeSelector = UserInputGazeSelector.instance()),
          _gazeSelector.mesh
        );
      }),
      (this.resetGaze = function (animateIn = !1) {
        _gazeSelector &&
          (_gazeSelector.reset(),
          animateIn && !_gazeSelector.isVisible && _gazeSelector.animateIn());
      }));
  }, "static"),
  Class(
    function UserInputGazeSelector() {
      Inherit(this, Component);
      const _this = this;
      var _over,
        _mesh,
        _shader,
        _wrapper,
        _objects = [],
        _test = [],
        _v3 = new Vector3(),
        _raycaster = Raycaster.find(World.CAMERA),
        _mouse = new Vector2(),
        lastDistance = 2;
      ((this.prevent = !1), (this.snapToPosition = !1), (this.trackingTime = 1500));
      const renderSlot =
        RenderManager.type === RenderManager.NORMAL ? Camera.instance() : RenderManager.EYE_RENDER;
      function startTracking() {
        _this.tracking ||
          _shader.uniforms.uVisible.value < 0.5 ||
          ((_this.tracking = !0),
          (_this.finishedTracking = !1),
          _over && (_over.__hasTracked = !0),
          _this.events.fire(UserInputGazeSelector.TRACKING_STARTED, {
            object: _over,
          }),
          _this.startRender(track, renderSlot),
          _shader.tween("uAlpha", 0.9, _this.trackingTime / 3, "easeOutSine"),
          _shader.tween("uAlpha2", 0.25, _this.trackingTime / 3, "easeOutSine"),
          _shader.set("uTime", 0),
          _shader.tween("uTime", 1, _this.trackingTime, "easeInOutSine"),
          (_this.timeout = _this.delayedCall((_) => {
            ((_this.finishedTracking = !0),
              stopTracking(),
              _this.animateOut(),
              _over && _over.__gazeClick && _over.__gazeClick({ action: "click", mesh: _over }));
          }, _this.trackingTime)));
      }
      function stopTracking() {
        _this.tracking &&
          ((_this.tracking = !1),
          _this.events.fire(UserInputGazeSelector.TRACKING_STOPPED, {
            object: _over,
            finished: _this.finishedTracking,
          }),
          _this.stopRender(track, renderSlot),
          _this.timeout && clearTimeout(_this.timeout),
          _shader.tween("uAlpha", 0.2, 500, "linear"),
          _shader.tween("uAlpha2", 0.8, 500, "linear"),
          _this.finishedTracking || _shader.tween("uTime", 0, 1e3, "easeOutSine"));
      }
      function positionSelector() {
        Utils3D.positionInFrontOfCamera(_wrapper, lastDistance);
      }
      function track() {
        if (!_over) return;
        _v3.set(0, 0, -1).applyQuaternion(World.CAMERA.quaternion);
        let [hit] = _raycaster.checkFromValues(_over, World.CAMERA.position, _v3);
        hit &&
          RenderManager.type == RenderManager.VR &&
          _this.snapToPosition &&
          (_wrapper.position.copy(hit.point),
          (lastDistance = hit.point.distanceTo(World.CAMERA.position)),
          _wrapper.lookAt(World.CAMERA.position));
      }
      function loop() {
        if ((_mouse.lerp(Mouse.tilt, 0.1), positionSelector(), !_objects.length || _this.prevent))
          return;
        _test.length = 0;
        for (let i = _objects.length - 1; i > -1; i--) {
          let obj = _objects[i];
          obj.determineVisible() && _test.push(obj);
        }
        _v3.set(0, 0, -1).applyQuaternion(World.CAMERA.quaternion);
        let [hit] = _raycaster.checkFromValues(_test, World.CAMERA.position, _v3);
        if (hit)
          if (_over)
            !_over ||
              _over.__hasTracked ||
              _over.__preventTrack ||
              (_over.__gazeHover && _over.__gazeHover({ action: "over", mesh: hit.object }),
              startTracking());
          else {
            if ((((_over = hit.object).__hasTracked = !1), _over.__preventTrack)) return;
            (_over.__gazeHover && _over.__gazeHover({ action: "over", mesh: hit.object }),
              startTracking());
          }
        else
          _over &&
            (_over.__gazeHover && _over.__gazeHover({ action: "out" }),
            (_over.__hasTracked = !1),
            (_over = null),
            stopTracking());
      }
      (!(function initMesh() {
        ((_wrapper = new Group()),
          World.SCENE.add(_wrapper),
          (_shader = _this.initClass(Shader, "GazeSelector", {
            uColor: { value: new Color(Colors.grey[0]) },
            uTime: { value: 0 },
            uAlpha: { value: 0 },
            uAlpha2: { value: 0.8 },
            uVisible: { value: 0 },
            transparent: !0,
            depthWrite: !1,
            depthTest: !1,
            blending: Shader.ADDITIVE_BLENDING,
          })),
          (_this.mesh = _mesh = new Mesh(World.PLANE, _shader)),
          _mesh.scale.setScalar(Device.mobile.phone ? 1.25 : 0.9),
          _wrapper.add(_mesh),
          (_wrapper.renderOrder = 9999),
          positionSelector());
      })(),
        (this.bind = function (obj, hover, click) {
          _objects.some((el) => el.id === obj.id) ||
            ((obj.__gazeHover = hover),
            (obj.__gazeClick = click),
            _objects.push(obj),
            _this.animateIn());
        }),
        (this.unbind = function (obj) {
          if (!obj) return;
          let lengthBefore = _objects.length;
          ((_objects = _objects.filter((el) => el.id !== obj.id)),
            _over &&
              _over.id === obj.id &&
              (_over.__gazeHover && _over.__gazeHover({ action: "out" }),
              (_over.__hasTracked = !1),
              (_over = null),
              stopTracking()),
            lengthBefore && 0 === _objects.length && _this.isVisible && _this.animateOut());
        }),
        (_this.reset = function () {
          (_shader.set("uTime", 0),
            _shader.tween("uAlpha", 0.2, 2e3, "easeInOutSine"),
            _shader.tween("uAlpha2", 0.8, 2e3, "easeInOutSine"),
            (lastDistance = 2));
        }),
        (_this.animateIn = function () {
          return (
            (_this.isVisible = !0),
            _this.startRender(loop, renderSlot),
            (_this.finishedTracking = !1),
            _shader.tween("uVisible", 1, 2e3, "easeInOutSine"),
            (_wrapper.scale.x = _wrapper.scale.y = 1.2),
            tween(_wrapper.scale, { x: 1, y: 1 }, 2e3, "easeInOutCubic").promise()
          );
        }),
        (_this.animateOut = async function () {
          ((_this.isVisible = !1),
            _shader.tween("uTime", 0, 10, "easeOutSine"),
            await _shader.tween("uVisible", 0, 1e3, "easeOutSine").promise(),
            _this.stopRender(loop, renderSlot),
            _over &&
              (_over.__gazeHover && _over.__gazeHover({ action: "out" }),
              (_over.__hasTracked = !1),
              (_over = null)),
            stopTracking());
        }),
        (this.getMesh = function () {
          return _mesh;
        }),
        Dev.expose("gazeObjects", () => _objects));
    },
    "singleton",
    () => {
      ((UserInputGazeSelector.TRACKING_STARTED = "gaze_selector_tracking_started"),
        (UserInputGazeSelector.TRACKING_STOPPED = "gaze_selector_tracking_stopped"));
    },
  ),
  Class(function UserInputMouseTouch() {
    Inherit(this, AbstractUserInput);
    const _this = this;
    var _plane,
      _hoverMeshes = [],
      _activeHover = null;
    function loop() {
      if (
        World.CAMERA &&
        (_this.position.copy(
          ScreenProjection.find(_this.parent.camera).unproject(
            Mouse,
            _this.parent.pointerDistanceFromCamera,
          ),
        ),
        (_this.position.velocity = _this.velocity.value),
        _hoverMeshes.length &&
          (function performHoverCheck() {
            let [newHover] = Raycaster.find(World.CAMERA).checkHit(_hoverMeshes);
            newHover
              ? _activeHover
                ? newHover.object !== _activeHover.object &&
                  (_activeHover.object.__uiHover({
                    action: "out",
                    hit: _activeHover,
                    mesh: _activeHover.object,
                  }),
                  newHover.object.__uiHover({
                    action: "over",
                    newHover: newHover,
                    mesh: newHover.object,
                  }),
                  (_activeHover = newHover))
                : (newHover.object.__uiHover({
                    action: "over",
                    newHover: newHover,
                    mesh: newHover.object,
                  }),
                  (_activeHover = newHover))
              : _activeHover &&
                (_activeHover.object.__uiHover({
                  action: "out",
                  hit: _activeHover,
                  mesh: _activeHover.object,
                }),
                (_activeHover = null));
          })(),
        _plane)
      ) {
        let [hit] = Raycaster.find(World.CAMERA).checkHit(_plane, Mouse);
        hit
          ? ((_this.plane2D.x = Math.range(hit.uv.x, 0, 1, -1, 1)),
            (_this.plane2D.y = Math.range(hit.uv.y, 0, 1, -1, 1)))
          : ((_this.plane2D.x = -10), (_this.plane2D.y = -10));
      }
    }
    function touchStart(e) {
      _this.down();
    }
    function touchMove(e) {}
    function touchEnd(e) {
      _this.up();
    }
    ((this.activeInput = !0),
      _this.startRender(loop, 24),
      (function addListeners() {
        (_this.events.sub(Mouse.input, Interaction.START, touchStart),
          _this.events.sub(Mouse.input, Interaction.MOVE, touchMove),
          _this.events.sub(Mouse.input, Interaction.END, touchEnd));
      })(),
      (this.bindClick = function (obj, hover, click) {
        (hover && ((obj.__uiHover = hover), _hoverMeshes.push(obj)),
          click && Interaction3D.find(World.CAMERA).add(obj, null, click),
          (obj.hitDestroy = () => this.unbindClick(obj)));
      }),
      (this.unbindClick = function (obj) {
        (_hoverMeshes.remove(obj), Interaction3D.find(World.CAMERA).remove(obj));
      }),
      (this.bindProximity = function (obj, hover, click) {
        this.bindClick(obj, hover, click);
      }),
      (this.unbindProximity = function (obj) {
        this.unbindClick(obj);
      }),
      (this.alignToPlane = function (mesh) {
        _plane = mesh;
      }));
  }),
  Class(function UserInputPositionManager() {
    Inherit(this, Component);
    const _this = this;
    var _type;
    const pointer = new Vector3(99999, 99999, 99999),
      leftHand = new Vector3(99999, 99999, 99999),
      rightHand = new Vector3(-99999, -99999, -99999),
      _inputs = _this.parent.inputs;
    function switchToBody() {
      (_this.stopRender(handlePointer),
        _this.stopRender(handleVR),
        AppState.set("UserInput/hand0", AppState.get("UserInputBody/leftHand3D")),
        AppState.set("UserInput/hand1", AppState.get("UserInputBody/rightHand3D")));
    }
    function handleVR() {
      (leftHand.set(99999, 99999, 99999),
        rightHand.set(-99999, -99999, -99999),
        _inputs.length <= 2
          ? (_inputs[0] && leftHand.copy(_inputs[0].position),
            _inputs[1] && rightHand.copy(_inputs[1].position))
          : _inputs.forEach((input, i) => {
              input.type == _type &&
                (i % 2 == 0 ? leftHand.copy(input.position) : rightHand.copy(input.position));
            }));
    }
    function handlePointer() {
      pointer.lerp(_inputs[0].position, 0.5);
    }
    (AppState.set("UserInput/hand0", leftHand),
      AppState.set("UserInput/hand1", rightHand),
      AppState.set("UserInput/pointer", pointer),
      AppState.bind("UserInputBody/detected", switchToBody),
      (this.update = function (type) {
        ((_type = type),
          _inputs.forEach((input) => {
            "controller" != input.type ||
              input.addedEvents ||
              ((input.addedEvents = !0),
              _this.events.sub(input.controller, VRInput.BUTTON, (e) =>
                AppState.set("UserInput/VRButton", e, !0),
              ),
              _this.events.sub(input.controller, VRInput.JOYSTICK, (e) =>
                AppState.set("UserInput/VRJoystick", e, !0),
              ));
          }));
      }),
      (this.initVR = function () {
        _this.startRender(handleVR);
      }),
      (this.initPointer = function () {
        _this.startRender(handlePointer);
      }));
  }),
  Class(function UserInputVRController(_controller, _type) {
    Inherit(this, AbstractUserInput);
    const _this = this;
    var _plane,
      _hoverMeshes = [],
      _activeHover = null,
      _proximity = [],
      _v3 = new Vector3();
    const ZERO = new Vector3();
    function initProximitySphere(obj) {
      let box = new Box3().setFromObject(obj);
      obj.__proximitySphere = box.getBoundingSphere();
    }
    function intersects(objA, objB) {
      return (
        objA.__proximitySphere || initProximitySphere(objA),
        objB.__proximitySphere || initProximitySphere(objB),
        objA.__proximitySphere.center.copy(objA.getWorldPosition()),
        objB.__proximitySphere.center.copy(objB.getWorldPosition()),
        objA.__proximitySphere.intersectsSphere(objB.__proximitySphere)
      );
    }
    function loop() {
      if (
        _controller.body &&
        _controller.body.getWorldPosition &&
        World.CAMERA &&
        !_controller.body.getWorldPosition().equals(ZERO) &&
        _controller.group.visible
      ) {
        if (
          (_v3.copy(_controller.pointer),
          _this.position.copy(_controller.group.position),
          _this.quaternion.copy(_controller.group.quaternion),
          _controller.isAbstractHand && _this.position.copy(_controller.body.position),
          _hoverMeshes.length &&
            (function performHoverCheck() {
              let [newHover] = Raycaster.checkFromValues(
                _hoverMeshes,
                World.CAMERA.position,
                _this.directionVec,
              );
              newHover
                ? _activeHover
                  ? newHover.object !== _activeHover.object &&
                    (_activeHover.object.__uiHover({
                      action: "out",
                      hit: _activeHover,
                      mesh: _activeHover.object,
                    }),
                    newHover.object.__uiHover({
                      action: "over",
                      newHover: newHover,
                      mesh: newHover.object,
                    }),
                    (_activeHover = newHover))
                  : (newHover.object.__uiHover({
                      action: "over",
                      newHover: newHover,
                      mesh: newHover.object,
                    }),
                    (_activeHover = newHover))
                : _activeHover &&
                  (_activeHover.object.__uiHover({
                    action: "out",
                    hit: _activeHover,
                    mesh: _activeHover.object,
                  }),
                  (_activeHover = null));
            })(),
          _proximity.length)
        )
          for (let i = _proximity.length - 1; i > -1; i--) {
            let mesh = _proximity[i];
            mesh.visible &&
              (_controller.isAbstractHand &&
                _controller.tips.forEach((t) => {
                  t.body && intersects(t.body, mesh) && fireProximity(mesh, t.body);
                }),
              intersects(_controller.body, mesh) && fireProximity(mesh, _controller.body));
          }
        if (_plane) {
          let [hit] = Raycaster.find(World.CAMERA).checkFromValues(
            _plane,
            _controller.group.position,
            _v3,
          );
          hit
            ? ((_this.plane2D.x = Math.range(hit.uv.x, 0, 1, -1, 1)),
              (_this.plane2D.y = Math.range(hit.uv.y, 0, 1, -1, 1)))
            : ((_this.plane2D.x = -10), (_this.plane2D.y = -10));
        }
      }
    }
    function fireProximity(mesh, body) {
      Render.TIME - mesh.__uiFireTime < 500 ||
        ((mesh.__uiFireTime = Render.TIME),
        mesh.__uiClick &&
          mesh.__uiClick({
            action: "click",
            mesh: mesh,
            handedness: _controller.handedness,
            controller: _controller,
            hitBody: body,
          }));
    }
    function button(e) {
      World.CAMERA &&
        !_controller.body.getWorldPosition().equals(ZERO) &&
        _controller.group.visible &&
        "trigger" === e.label &&
        (e.pressed
          ? (_this.down(),
            _controller.isAbstractHand || Interaction3D.useInput(_controller),
            UserInput.inputs.forEach((inp) => (inp.activeInput = !1)),
            (_this.activeInput = !0))
          : (_this.up(),
            _activeHover &&
              _activeHover.object.__uiClick({
                action: "click",
                mesh: _activeHover.object,
                hit: _activeHover.hit,
              })));
    }
    ((this.controller = _controller),
      (this.type = _type),
      (function addListeners() {
        _this.events.sub(_controller, VRInput.BUTTON, button);
      })(),
      _this.startRender(loop, 24, World.NUKE),
      "right" !== _controller.handedness ||
        _controller.isAbstractHand ||
        (Interaction3D.useInput(_controller), (_this.activeInput = !0)),
      (_this.position.velocity = _this.velocity.value),
      (this.bindClick = function (obj, over, click) {
        ((obj.__uiHover = over),
          (obj.__uiClick = click),
          _hoverMeshes.push(obj),
          (obj.hitDestroy = (_) => _hoverMeshes.remove(obj)));
      }),
      (this.unbindClick = function (obj) {
        _hoverMeshes.remove(obj);
      }),
      (this.bindProximity = function (obj, over, click) {
        ((obj.__uiHover = over),
          (obj.__uiClick = click),
          _proximity.push(obj),
          (obj.hitDestroy = (_) => _proximity.remove(obj)));
      }),
      (this.unbindProximity = function (obj) {
        _proximity.remove(obj);
      }),
      (this.alignToPlane = function (plane) {
        _plane = plane;
      }),
      (this.setState = function (hoverMeshes, proximity) {
        ((_hoverMeshes = [...hoverMeshes]), (_proximity = [...proximity]));
      }),
      (this.updateVRState = function (array) {
        array.forEach((obj) => {
          obj.setState && obj != _this && obj.setState(_hoverMeshes, _proximity);
        });
      }),
      (this.getPosRelativeTo = function (head) {
        return (_v3.set(head.x, 0, head.z), _v3.add(_this.position), _v3);
      }),
      (this.triggerHaptics = function (strength, time) {
        _controller.triggerHaptics && _controller.triggerHaptics(strength, time);
      }));
  }),
  Class(function AbstractUserInput() {
    Inherit(this, Component);
    const _this = this;
    var _downTime;
    ((this.position = new Vector3()),
      (this.quaternion = new Quaternion()),
      (this.plane2D = new Vector2()),
      (this.isDown = !1),
      (this.directionVec = new Vector3()),
      (this.velocity = new VelocityTracker(_this.position)),
      this.velocity.start(),
      (this.down = function () {
        ((_this.isDown = !0), _this.events.fire(UserInput.DOWN), (_downTime = Render.TIME));
      }),
      (this.up = function () {
        ((_this.isDown = !1),
          Render.TIME - _downTime < 500 && _this.click(),
          _this.events.fire(UserInput.UP));
      }),
      (this.click = function () {
        _this.events.fire(UserInput.CLICK);
      }));
  }),
  Class(function VelocityTracker(_vector) {
    Inherit(this, Component);
    var _this = this,
      Vector = "number" == typeof _vector.z ? Vector3 : Vector2,
      _vec = new Vector(),
      _velocity = new Vector(),
      _last = new Vector();
    function loop(time, delta) {
      (_vec.subVectors(_vector, _last).divideScalar(Render.DELTA / (1e3 / Render.REFRESH_RATE)),
        _last.copy(_vector),
        _vec.length() > 0 && _velocity.copy(_vec));
    }
    ((this.value = _velocity),
      (this.start = function () {
        _this.startRender(loop);
      }),
      (this.onDestroy = this.stop =
        function () {
          _this.stopRender(loop);
        }),
      (this.copy = function () {
        _last.copy(_vector);
      }),
      (this.update = loop));
  }),
  Class(
    function Video(_params) {
      Inherit(this, Component);
      const _this = this;
      let $video,
        _video,
        _loadingState,
        _handlers,
        _sharedVideo = !1,
        _ready = Promise.create(),
        _loaded = Promise.create(),
        _initialPlay = !0,
        _buffering = !0;
      function startPreload() {
        return ((_loadingState = !0), _video.load(), _ready);
      }
      async function startPlayback() {
        if (
          !_this.playing &&
          ((_loadingState = !1),
          _video.readyState < 2 && (_video.load(), await _ready),
          !_this.playing)
        ) {
          (_initialPlay &&
            ((_initialPlay = !1),
            _params.currentTime && (_video.currentTime = _params.currentTime)),
            (_this.playing = !0));
          try {
            return await _video.play();
          } catch (error) {
            throw ((_this.playing = !1), error);
          }
        }
      }
      function getSource(src = "") {
        return (
          src &&
            !src.includes(["webm", "mp4", "ogv", "blob", "?"]) &&
            (src += "." + Device.media.video),
          src
        );
      }
      function progress(e) {
        _this.events.fire(Video.PROGRESS, e);
      }
      function timeupdate(e) {
        _this.events.fire(Video.UPDATE, e);
      }
      function play(e) {
        if (_loadingState) return (_loadingState = !1);
        _this.events.fire(Video.PLAY, e);
      }
      function pause(e) {
        _this.events.fire(Video.PAUSE, e);
      }
      function playing(e) {
        _this.events.fire(Video.PLAYING, e);
      }
      function buffering(state) {
        _this.events.fire(Video.BUFFERING, { isBuffering: state });
      }
      function ended(e) {
        _this.events.fire(Video.ENDED, e);
      }
      function waiting(e) {
        _this.events.fire(Video.WAITING, e);
      }
      function canplay(e) {
        (loadeddata(), _this.events.fire(Video.CANPLAY, e));
      }
      function loadedmetadata(e) {
        ((_this.dimensions.width = _video.videoWidth),
          (_this.dimensions.height = _video.videoHeight),
          _this.events.fire(Video.LOADEDMETADATA, e));
      }
      function loadeddata(e) {
        (_video.readyState >= 2 && _ready.resolve(), _video.readyState >= 4 && _loaded.resolve());
      }
      function error() {
        (_this.playing && (_this.playing = !1), _this.events.fire(Video.ERROR, _video.error));
      }
      (_params.toJSON &&
        (((_params = _params.toJSON()).autoplay = _params.autoPlay),
        "string" == typeof _params.events && (_params.events = _params.events.split(","))),
        (function initParam() {
          let defaults = {
            muted: !0,
            loop: !1,
            autoplay: !1,
            inline: !0,
            controls: !1,
            currentTime: 0,
            playback: 1,
            preload: !1,
            width: 640,
            height: 360,
            events: [],
            disableRemotePlayback: !0,
          };
          _params = Object.assign(defaults, _params);
        })(),
        (function init() {
          return (
            _params.src instanceof HTMLVideoElement
              ? ((_video = _params.src), (_sharedVideo = !0))
              : ((_video = document.createElement("video")),
                _params.src && (_video.src = getSource(_params.src)),
                _video.setAttribute("crossorigin", "anonymous"),
                (_video.disableRemotePlayback = _params.disableRemotePlayback),
                (_video.autoplay = _params.autoplay),
                (_video.loop = _params.loop),
                (_video.controls = _params.controls),
                (_video.height = _params.height),
                (_video.width = _params.width),
                (_video.defaultMuted = _params.muted),
                (_video.defaultPlaybackRate = _params.playback),
                (_video.preload =
                  "string" == typeof _params.preload
                    ? _params.preload
                    : _params.preload
                      ? "auto"
                      : "none"),
                (_video.muted = _params.autoplay || _params.muted),
                _video.setAttribute("webkit-playsinline", _params.inline),
                _video.setAttribute("playsinline", _params.inline),
                _video.autoplay && _video.setAttribute("autoplay", _params.autoplay),
                _video.setAttribute("muted", _params.muted),
                _params.loop && _video.setAttribute("loop", _params.loop)),
            (_this.dimensions = {
              width: _params.width,
              height: _params.height,
            }),
            (_this.div = _video),
            ($video = $(_video)),
            _params.autoplay ? startPlayback() : _params.preload ? startPreload() : void 0
          );
        })(),
        (function addHandlers() {
          (["loadedmetadata", "loadeddata", "error"].forEach((ev) => {
            _params.events.includes(ev) || _params.events.push(ev);
          }),
            (_handlers = {
              play: play,
              pause: pause,
              ended: ended,
              playing: playing,
              progress: progress,
              waiting: waiting,
              timeupdate: timeupdate,
              loadedmetadata: loadedmetadata,
              loadeddata: loadeddata,
              canplay: canplay,
              error: error,
            }),
            _params.events.forEach((ev) => _video.addEventListener(ev, _handlers[ev], !0)),
            (_video.onwaiting = (e) => {
              ((_buffering = !0), buffering(_buffering));
            }),
            (_video.onplaying = (e) => {
              ((_buffering = !1), buffering(_buffering));
            }));
        })(),
        (function initSharedVideo() {
          _sharedVideo &&
            (_video.readyState >= 1 &&
              ((_this.dimensions.width = _video.videoWidth),
              (_this.dimensions.height = _video.videoHeight)),
            _video.readyState >= 2 && _ready.resolve(),
            _video.readyState >= 4 && _loaded.resolve());
        })(),
        this.set("loop", (bool) => (_video.loop = bool)),
        this.get("loop", () => _video.loop),
        this.set("src", (src) => {
          (src = getSource(src)) !== _video.src &&
            ((_ready = Promise.create()),
            (_loaded = Promise.create()),
            (_video.src = src),
            _this.playing
              ? ((_this.playing = !1), startPlayback())
              : _params.preload && startPreload());
        }),
        this.get("src", () => _video.currentSrc),
        this.set("volume", (v) => {
          (v < 0.001 && (_video.muted = !0), (_video.volume = v));
        }),
        this.get("volume", () => _video.volume),
        this.set("muted", (bool) => (_video.muted = bool)),
        this.get("muted", () => _video.muted),
        this.set("controls", (bool) => (_video.controls = bool)),
        this.get("controls", () => _video.controls),
        this.get("duration", () => _video.duration),
        this.get("ended", () => _video.ended),
        this.get("playback", () => _video.playbackRate),
        this.get("time", () => _video.currentTime),
        this.get("error", () => _video.error),
        this.get("canRender", () => _video.readyState >= 2),
        this.get("canPlayThrough", () => _video.readyState >= 4),
        this.get("paused", () => _video.paused),
        this.get("buffering", () => _buffering),
        this.get("element", () => $video),
        this.get("object", () => $video),
        this.get("video", () => _video),
        this.get("bufferedSeconds", (_) =>
          _video.readyState < 2 ? 0 : _video.buffered.end(0) - _video.buffered.start(0),
        ),
        (this.load = async function () {
          return startPreload();
        }),
        (this.play = async function () {
          return startPlayback();
        }),
        (this.pause = function () {
          ((_this.playing = !1), _video.pause());
        }),
        (this.stop = function () {
          ((_this.playing = !1), _video.pause(), _this.seek(0));
        }),
        (this.seek = function (t) {
          if (_video.fastSeek) return _video.fastSeek(t);
          _video.currentTime = t;
        }),
        (this.seekExact = function (t) {
          _video.currentTime = t;
        }),
        (this.ready = function () {
          return _ready;
        }),
        (this.loaded = function () {
          return _loaded;
        }),
        (this.onDestroy = function () {
          (_this.stop(),
            _sharedVideo || (_video.src = ""),
            (function removeListeners() {
              (_params.events.forEach((ev) => _video.removeEventListener(ev, _handlers[ev], !0)),
                (_video.onwaiting = () => {}),
                (_video.onplaying = () => {}));
            })(),
            (_video = null));
        }),
        (this.setSize = function (width, height) {
          ((_video.width = width),
            (_video.height = height),
            (_this.dimensions.width = width),
            (_this.dimensions.height = height));
        }));
    },
    () => {
      ((Video.PLAY = "hydra_video_play"),
        (Video.CANPLAY = "hydra_video_can_play"),
        (Video.LOADEDMETADATA = "hydra_video_loaded_metadata"),
        (Video.PAUSE = "hydra_video_pause"),
        (Video.PROGRESS = "hydra_video_progress"),
        (Video.UPDATE = "hydra_video_update"),
        (Video.PLAYING = "hydra_video_playing"),
        (Video.BUFFERING = "hydra_video_buffering"),
        (Video.ENDED = "hydra_video_ended"),
        (Video.WAITING = "hydra_video_waiting"),
        (Video.ERROR = "hydra_video_error"));
    },
  ),
  Class(
    function VideoTexture(_path, _props = {}) {
      Inherit(this, Component);
      const _this = this;
      let _video,
        _requestId,
        _hasRequestCallback = !1,
        _sharedVideo = !1;
      if (
        ((_this.canUpdate = !0), "object" == typeof _path && !(_path instanceof HTMLVideoElement))
      ) {
        let path = _path.path;
        ((_props = _path), (_path = path), delete _props.path);
      }
      let {
        loop: loop,
        preload: preload,
        autoplay: autoplay,
        muted: muted,
        firstFrame: firstFrame,
        parseColor: parseColor,
        fps: fps,
        events: events = [],
      } = _props;
      function update() {
        if (((_requestId = null), !_this.destroy || !_video.destroy)) return;
        let updateTex = _video.canRender && _this.canUpdate;
        (firstFrame && updateTex && (updateTex = _video.time > 0),
          updateTex &&
            _this.texture &&
            (_this.videoTexture &&
              (_this.texture.destroy(),
              (_this.texture = _this.videoTexture),
              delete _this.videoTexture),
            _this.texture &&
              (_this.texture.image ||
                ((_this.texture.image = _video.video), _this.texture.upload())),
            _this.colorParser && _this.colorParser.update(_video.time),
            _this.texture && (_this.texture.loaded = _this.texture.needsUpdate = !0),
            (_this.uniform.value = _this.texture)),
          _hasRequestCallback &&
            (_requestId = _video.element.div.requestVideoFrameCallback(update)));
      }
      function noop() {}
      function handleSharedVideoPlaying() {
        start();
      }
      function handleSharedVideoPause() {
        stop();
      }
      function start() {
        ((_this.active = !0),
          _requestId &&
            (_video.element.div.cancelVideoFrameCallback(_requestId), (_requestId = null)),
          _hasRequestCallback
            ? _this.startRender(noop)
            : _this.startRender(update, fps, RenderManager.BEFORE_RENDER),
          update());
      }
      function stop() {
        ((_this.active = !1),
          _hasRequestCallback
            ? _requestId && _video.element.div.cancelVideoFrameCallback(_requestId)
            : _this.stopRender(update));
      }
      (void 0 === loop && (loop = !0),
        void 0 === preload && (preload = !0),
        void 0 === autoplay && (autoplay = !0),
        void 0 === muted && (muted = !0),
        void 0 === firstFrame && (firstFrame = !1),
        void 0 === parseColor && (parseColor = !1),
        void 0 === events && (events = []),
        void 0 === fps && (fps = 30),
        (_this.uniform = { value: null }),
        (function () {
          let src;
          if (
            (_props.start && defer((_) => _this.start()),
            _path instanceof HTMLVideoElement
              ? ((_sharedVideo = !0),
                (src = _path),
                (autoplay = !1),
                (preload = !1),
                (events = [...events, "pause"]))
              : (src = _path.includes("blob") ? _path : Assets.getPath(_path)),
            !_sharedVideo && _path.includes(["jpg", "png"]))
          ) {
            let noop = (_) => {};
            ((_this.texture = Utils3D.getTexture(src)),
              (_this.video = { play: noop, pause: noop }),
              parseColor &&
                (_this.colorParser = _this.initClass(VideoTextureColorParser, src, !0)));
          } else {
            let videoEvents = ["timeupdate", "playing", "ended"];
            if (
              (events.forEach((ev) => {
                videoEvents.includes(ev) || videoEvents.push(ev);
              }),
              (_video = _this.initClass(Video, {
                src: src,
                loop: loop,
                preload: preload,
                autoplay: autoplay,
                muted: muted,
                events: videoEvents,
              })),
              (_this.texture = new Texture()),
              (_this.texture.format = Texture.RGBFormat),
              (_this.texture.minFilter = _this.texture.magFilter = Texture.LINEAR),
              (_this.texture.generateMipmaps = !1),
              (_this.texture.loaded = !1),
              (_this.video = _video),
              (_this.dimensions = _video.dimensions),
              (_this.texture.dimensions = _this.dimensions),
              _this.events.bubble(_video, Video.PLAYING),
              parseColor && (_this.colorParser = _this.initClass(VideoTextureColorParser, src, !1)),
              firstFrame)
            ) {
              ((_this.videoTexture = _this.texture),
                (_this.texture = Utils3D.getTexture(firstFrame)));
              const update = (_) => {
                ((_this.texture = _this.videoTexture),
                  _this.events.unsub(_video, Video.PLAYING, update));
              };
              _this.events.sub(_video, Video.PLAYING, update);
            }
          }
          ((_this.uniform.value = _this.texture),
            (_hasRequestCallback = "requestVideoFrameCallback" in HTMLVideoElement.prototype),
            "safari" === Device.system.browser && (_hasRequestCallback = !1),
            _sharedVideo &&
              (function initSharedVideo() {
                (_this.events.sub(_video, Video.PLAYING, handleSharedVideoPlaying),
                  _this.events.sub(_video, Video.PAUSE, handleSharedVideoPause),
                  !_video.paused && _video.video.readyState >= 2 && handleSharedVideoPlaying());
              })());
        })(),
        this.set("loop", (loop) => (_video.loop = loop)),
        this.set("muted", (muted) => (_video.muted = muted)),
        this.set("src", (src) => {
          (_requestId &&
            (_video.element.div.cancelVideoFrameCallback(_requestId), (_requestId = null)),
            (_video.src = src.includes("blob") ? src : Assets.getPath(src)),
            _hasRequestCallback &&
              (_requestId = _video.element.div.requestVideoFrameCallback(update)));
        }),
        (this.start = async function () {
          _sharedVideo || (_video && (start(), await _video.play()));
        }),
        (this.stop = function () {
          _sharedVideo || (_video && (stop(), _video.pause()));
        }),
        (this.seek = function (time) {
          _sharedVideo || (_video && _video.seek(time));
        }),
        (this.onInvisible = function () {
          _sharedVideo ||
            (_this.active && _video.pause(),
            VideoTexture.element().removeChild(_this.video.object, !0));
        }),
        (this.onVisible = function () {
          _sharedVideo ||
            (_this.active && _video.play(), VideoTexture.element().add(_this.video.object));
        }),
        (this.onDestroy = function () {
          (_this.texture.destroy(),
            _sharedVideo || VideoTexture.element().removeChild(_this.video.object, !0));
        }));
    },
    (_) => {
      var $element;
      VideoTexture.element = function () {
        return (
          $element ||
            (($element = Stage.create("VideoTextures")).css({
              position: "absolute",
              pointerEvents: "none",
              left: 0,
              top: 0,
              overflow: "hidden",
            }),
            $element.size(0, 0).setZ(-10),
            Stage.add($element)),
          $element
        );
      };
    },
  ),
  Class(function VideoTextureColorParser(_path, _static) {
    Inherit(this, Component);
    const _this = this;
    var _colorData,
      _color = new Color();
    ((this.color = new Color()),
      (this.lerp = 1),
      (async function () {
        let path = _path.split(".")[0] + ".json";
        _colorData = await get(path);
      })(),
      (this.update = function (time) {
        if (_colorData)
          for (let key in _colorData)
            if (time <= key) {
              (_color.set("#" + _colorData[key]), _this.color.lerp(_color, _this.lerp));
              break;
            }
      }));
  }),
  Namespace("FX"),
  FX.Class(function VolumetricLight(_nuke = World.NUKE, _unique, _options = {}) {
    Inherit(this, Component);
    const _this = this;
    var _scene, _layer, _volume, _light, _invisible;
    if ("object" == typeof _nuke && _nuke.isAppState) {
      let params = _nuke;
      ((_nuke = params.nuke || _this.parent.nuke || World.NUKE),
        (_unique = params.unique),
        (_options = params));
    }
    var _obj = {},
      _blurs = [],
      _projection = new ScreenProjection(_nuke.camera),
      _lightPos = new Vector3();
    function render({ stage: stage, camera: camera }) {
      if (!_light || !_this.enabled || _invisible) return;
      (_scene.nuke.setSize(stage.width, stage.height),
        (_scene.nuke.stage = stage),
        (_scene.nuke.camera = camera),
        (_projection.camera = camera),
        _lightPos.setFromMatrixPosition(_light.matrixWorld));
      let screen = _projection.project(_lightPos, stage);
      ((screen.x /= stage.width),
        (screen.y /= stage.height),
        _volume.uniforms.lightPos.value.set(screen.x, 1 - screen.y),
        _scene.render());
    }
    (!(function polymorph() {
      ("object" == typeof _unique && ((_options = _unique), (_unique = void 0)),
        (_this.enabled = void 0 === _options.enabled || _options.enabled));
    })(),
      _this.enabled &&
        ((function initLayer() {
          (((_layer = _this.initClass(
            _options.useFXScene ? FXScene : FXLayer,
            _nuke,
            _options,
          )).name = (_unique ? _unique.capitalize() : "") + "VolumetricLight"),
            _this.startRender((_) => _layer.render()),
            _layer.setDPR(1),
            (_this.fxLayer = _layer));
        })(),
        (function initScene() {
          ((_scene = _this.initClass(FXScene, _nuke)).setDPR(_options.dpr || 1),
            (_this.rt = _scene.rt));
          let shader = _this.initClass(Shader, _options.screenQuadShader || "ScreenQuad", {
              customCompile: "volumetricLight",
              tMap: { value: _layer },
              depthWrite: !1,
            }),
            mesh = new Mesh(World.QUAD, shader);
          ((mesh.frustumCulled = !1),
            _scene.scene.add(mesh),
            (_this.screenQuadMesh = mesh),
            (_this.fxScene = _scene));
        })(),
        (function initPasses() {
          ([new Vector2(1.5 * _scene.nuke.dpr, 0), new Vector2(0, 1.5 * _scene.nuke.dpr)].forEach(
            (dir) => {
              let pass = new NukePass("LightBlur", { uDir: { value: dir } });
              (_blurs.push(pass), _scene.nuke.add(pass));
            },
          ),
            (_volume = new NukePass("VolumetricLight", {
              unique: _unique,
              lightPos: { value: new Vector2(), ignoreUIL: !0 },
              fExposure: { type: "f", value: 0.2 },
              fDecay: { type: "f", value: 0.93 },
              fDensity: { type: "f", value: 0.96 },
              fWeight: { type: "f", value: 0.4 },
              fClamp: { type: "f", value: 1 },
            })),
            _scene.nuke.add(_volume),
            ShaderUIL.add(_volume).setLabel("Volumetric Light"),
            (_this.volumeShader = _volume),
            (_this.uniforms = { tVolumetricBlur: { value: _scene } }));
        })(),
        (function addListeners() {
          _this.events.sub(_nuke, Nuke.RENDER, render);
        })()),
      (this.addOccluder = function (mesh) {
        _this.enabled && _layer.add(mesh);
      }),
      (this.addLight = function (mesh) {
        _this.enabled && (_light = mesh);
      }),
      this.set("resolution", (v) => {
        _this.enabled && (_layer.setResolution(v), _scene.setResolution(v));
      }),
      this.set("dpr", (v) => {
        _this.enabled && (_layer.setDPR(v), _scene.setDPR(v));
      }),
      (this.onInvisible = function () {
        _invisible = !0;
      }),
      (this.onVisible = function () {
        _invisible = !1;
      }),
      (this.upload = async function () {
        _scene && _scene.nuke && (await Initializer3D.uploadNukeAsync(_scene.nuke));
      }),
      (this.setComposite = function (texture) {
        _this.enabled && _this.screenQuadMesh.shader.set("tMap", texture);
      }),
      (this.render = function (stage, camera) {
        _this.enabled &&
          (_this.events.unsub(_nuke, Nuke.RENDER, render),
          (_obj.stage = stage),
          (_obj.camera = camera),
          render(_obj));
      }));
  }),
  Class(function XRConfig(_params) {
    (void 0 !== _params.mixedReality && (XRDeviceManager.mixedReality = _params.mixedReality),
      void 0 !== _params.multiview && (XRDeviceManager.multiview = _params.multiview),
      void 0 !== _params.hands &&
        (XRDeviceManager.features.push("hand-tracking"), (VRInput.useControllerHands = !0)),
      void 0 !== _params.foveation &&
        (XRDeviceManager.foveationLevel = (function () {
          switch (_params.foveation) {
            case "none":
              return null;
            case "low":
              return XRDeviceManager.FOVEATION_LEVEL_LOW;
            case "medium":
              return XRDeviceManager.FOVEATION_LEVEL_MEDIUM;
            case "high":
              return XRDeviceManager.FOVEATION_LEVEL_HIGH;
          }
        })()),
      void 0 !== _params.scaleFactor && (XRDeviceManager.scaleFactor = _params.scaleFactor),
      void 0 !== _params.framerate && (XRDeviceManager.targetFramerate = _params.framerate),
      void 0 !== _params.antialias && (XRDeviceManager.antialias = _params.antialias));
  }),
  Class(function XRDeviceManager() {
    Inherit(this, Component);
    const _this = this;
    var _session, _promise;
    function getFoveationFeatureName() {
      switch (_this.foveationLevel) {
        case _this.FOVEATION_LEVEL_LOW:
          return "low-fixed-foveation-level";
        case _this.FOVEATION_LEVEL_MEDIUM:
          return "medium-fixed-foveation-level";
        case _this.FOVEATION_LEVEL_HIGH:
        case _this.FOVEATION_LEVEL_HIGH_TOP:
          return "high-fixed-foveation-level";
        default:
          return "no-fixed-foveation";
      }
    }
    ((this.SESSION_START = "xr_start"),
      (this.SESSION_END = "xr_end"),
      (this.CONTROLS_START = "controls_start"),
      (this.HEADSET_IDLE = "headset_idle"),
      (this.HEADSET_RESUME = "headset_resume"),
      (this.FOVEATION_LEVEL_NONE = 0),
      (this.FOVEATION_LEVEL_LOW = 1),
      (this.FOVEATION_LEVEL_MEDIUM = 2),
      (this.FOVEATION_LEVEL_HIGH = 3),
      (this.FOVEATION_LEVEL_HIGH_TOP = 4),
      (this.multiview = !0),
      (this.scaleFactor = 1),
      (this.preallocatedScaleFactors = []),
      (this.features = ["bounded-floor"]),
      (this.reloadWhenSessionEnds = !0),
      (this.mixedReality = !1),
      (this.getVRSession = async function () {
        if (_session) return _session;
        if (_this.flag("disable3D")) return (_this.flag("needNewSession", !0), null);
        let requiredFeatures = ["local-floor"];
        if (_this.multiview) {
          World.RENDERER.extensions.oculusMultiview &&
            (requiredFeatures.push("layers"), (_this.MULTIVIEW = !0));
        }
        let optionalFeatures = [..._this.features, getFoveationFeatureName()],
          sessionType = "immersive-" + (_this.mixedReality && Device.system.xr.ar ? "ar" : "vr");
        return (
          "immersive-vr" == sessionType && _this.mixedReality && (_this.mixedReality = !1),
          (_session = await navigator.xr.requestSession(sessionType, {
            requiredFeatures: requiredFeatures,
            optionalFeatures: optionalFeatures,
          })).addEventListener("end", (_) => {
            ((_session = null),
              _this.flag("needNewSession", !0),
              _this.events.fire(_this.SESSION_END));
          }),
          _session.addEventListener("visibilitychange", (e) => {
            switch (e.session.visibilityState) {
              case "visible":
                _this.events.fire(_this.HEADSET_RESUME);
                break;
              case "visible-blurred":
              case "hidden":
                _this.events.fire(_this.HEADSET_IDLE);
            }
          }),
          _session
        );
      }),
      (this.waitForVRSession = async function () {
        let promise = Promise.create(),
          inter = setInterval((_) => {
            _session && (clearInterval(inter), promise.resolve(_session));
          }, 20);
        return promise;
      }),
      (this.getARSession = async function () {
        return (
          _session ||
          ((_session = await navigator.xr.requestSession("immersive-ar")).addEventListener(
            "end",
            (_) => {
              ((_session = null),
                _this.flag("needNewSession", !0),
                _this.events.fire(_this.SESSION_END));
            },
          ),
          _session.addEventListener("visibilitychange", (e) => {
            switch (e.session.visibilityState) {
              case "visible":
                _this.events.fire(_this.HEADSET_RESUME);
                break;
              case "visible-blurred":
              case "hidden":
                _this.events.fire(_this.HEADSET_IDLE);
            }
          }),
          _session)
        );
      }),
      (this.startSession = function () {
        return (
          _this.isDisabled() && _this.enable3D(),
          _this.flag("needNewSession") &&
            (_this.flag("needNewSession", !1),
            RenderManager.camera.reset?.(),
            RenderManager.renderer.reset?.(),
            (_promise = null)),
          _this.getVRSession(),
          _promise ||
            ((_promise = Promise.create()),
            _this.events.sub(_this.SESSION_START, _promise.resolve),
            _promise)
        );
      }),
      (this.endSession = function () {
        (_this.flag("needNewSession", !0), _this.events.fire(_this.SESSION_END));
        let promise = _session?.end();
        return ((_session = null), promise);
      }),
      (this.waitForEnd = function () {
        let promise = Promise.create();
        return (_this.events.sub(_this.SESSION_END, promise.resolve), promise);
      }),
      (this.disable3D = function () {
        _this.flag("disable3D", !0);
      }),
      (this.enable3D = function () {
        _this.flag("disable3D", !1);
      }),
      (this.isDisabled = function () {
        return _this.flag("disable3D");
      }),
      this.set("targetFramerate", async (value) => {
        (await _promise, _session?.updateTargetFrameRate?.(value));
      }));
  }, "static"),
  Class(function ARCamera() {
    Inherit(this, Component);
    const _this = this;
    var _session;
    ((this.worldCamera = new PerspectiveCamera(30, Stage.width / Stage.height, 0.1, 1e3)),
      (this.getFrameOfReference = async function () {
        return (
          (_session = await XRDeviceManager.getARSession()),
          await _session.requestReferenceSpace("local")
        );
      }),
      (this.getRenderCamera = function (view, pose) {
        if (pose)
          return (
            _this.worldCamera.position.copy(view.transform.position),
            _this.worldCamera.quaternion.copy(view.transform.orientation),
            _this.worldCamera.updateMatrixWorld(!0),
            _this.worldCamera.projectionMatrix.fromArray(view.projectionMatrix),
            _this.worldCamera
          );
      }));
  }),
  Class(function ARRenderer(_renderer, _nuke) {
    Inherit(this, Component);
    const _this = this;
    var _session, _arCamera, _callback, _frame, _frameOfRef, _gl, _view;
    async function setup() {
      (((_session = await XRDeviceManager.getARSession()).baseLayer = new XRWebGLLayer(
        _session,
        _renderer.context,
        {
          framebufferScaleFactor: RenderManager.DPR / Device.pixelRatio,
          stencil: _renderer.stencil,
        },
      )),
        _session.updateRenderState({ baseLayer: _session.baseLayer }),
        (_gl = _renderer.context),
        (_arCamera = RenderManager.camera),
        (_frameOfRef = await _arCamera.getFrameOfReference()),
        (ARUtils.frameOfReference = _frameOfRef),
        _session.requestAnimationFrame(rAF),
        (Renderer.overrideViewport = !0),
        (_renderer.arRenderingPath = renderAR),
        Render.useRAF(rAFOverride),
        _this.events.fire(XRDeviceManager.SESSION_START));
    }
    function renderAR(render, scene, camera) {
      _gl.bindFramebuffer(_gl.FRAMEBUFFER, _session.baseLayer.framebuffer);
      let viewport = _session.baseLayer.getViewport(_view);
      (_gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height),
        _renderer.resolution.set(viewport.width, viewport.height),
        (_renderer.autoClear = !1),
        render(scene, camera),
        _gl.bindFramebuffer(_gl.FRAMEBUFFER, null),
        (_renderer.autoClear = !0),
        _nuke.postRender && _nuke.postRender());
    }
    function rAFOverride(callback) {
      _callback = callback;
    }
    function rAF(t, frame) {
      _session.requestAnimationFrame(rAF);
      let pose = frame.getViewerPose(_frameOfRef);
      pose &&
        ((ARUtils.pose = pose),
        (_view = pose.views[0]),
        window.AURA &&
          (ARUtils.setFramebuffer(_session.baseLayer, _view),
          (_nuke.rtt = ARUtils.getFramebuffer())),
        _arCamera.getRenderCamera(_view, pose),
        (_frame = frame),
        _callback && _callback(t));
    }
    (defer(setup),
      (this.render = function (scene, camera) {
        _frame &&
          (_nuke.passes.length && window.AURA ? _nuke.render() : _renderer.render(scene, camera));
      }),
      (this.setSize = function (width, height) {
        (_renderer.setPixelRatio(RenderManager.DPR), _renderer.setSize(width, height));
      }),
      (this.getCameraTexture = function (texture) {
        texture._gl = _session.getCameraTexture();
      }));
  }),
  Class(function ARUtils() {
    Inherit(this, Component);
    const _this = this;
    var _origin,
      _direction,
      _matrix,
      _session,
      _env,
      _framebuffer,
      _originArray,
      _directionArray,
      _cameraTexture,
      _envShaders = [],
      _tracking = !1;
    function checkStatus() {
      _session.trackingStatus
        ? _tracking ||
          ((_tracking = !0), _this.events.fire(_this.TRACKING_CHANGE, { tracking: !0 }))
        : _tracking &&
          ((_tracking = !1), _this.events.fire(_this.TRACKING_CHANGE, { tracking: !1 }));
    }
    async function handleEnvTexture({ texture: texture }) {
      let t = new Texture();
      ((t.cube = !0), (t.needsReupload = t.needsUpdate = !1), (t._metal = t._gl = texture));
      let size = "ios" == Device.system.os ? 256 : 16,
        hdr = "android" == Device.system.os,
        lastEnv = _env;
      ((_env = _this.initClass(DynamicEnvGenerator, t, size, 30, hdr)),
        await _env.ready(),
        _envShaders.forEach((shader) => {
          (shader.set("tEnvSpecular", _env.specular.texture),
            shader.set("tEnvDiffuse", _env.diffuse.texture));
        }),
        lastEnv && lastEnv.destroy());
    }
    ((this.lightIntensity = { type: "f", value: 0 }),
      (this.FIRST_TRANSFORM = "arutils_first_transform"),
      (this.TRACKING_CHANGE = "arutils_tracking_change"),
      (this.TRACKING_STARTED = "arutils_tracking_started"),
      (this.CLOUD_ANCHOR = "cloud_anchor"),
      (async function () {
        (await Hydra.ready(),
          _this.events.sub(XRDeviceManager.SESSION_START, async (_) => {
            RenderManager.type == RenderManager.WEBAR &&
              (((_session = await XRDeviceManager.getARSession()).onCreated = (_) =>
                _this.events.fire(_this.TRACKING_STARTED)),
              _this.startRender(checkStatus, 10),
              _session.addEventListener("envTexture", handleEnvTexture));
          }));
      })(),
      (this.getTrackingStatus = async function () {
        return (
          _session || (_session = await XRDeviceManager.getARSession()),
          _session.trackingStatus
        );
      }),
      (this.resetOrigin = function () {}),
      (this.findSurface = async function (obj = Mouse) {
        if (
          (_session || (_session = await XRDeviceManager.getARSession()), !_this.frameOfReference)
        )
          return;
        (_origin ||
          ((_origin = new Vector3()),
          (_direction = new Vector3()),
          (_matrix = new Matrix4()),
          (_originArray = new Float32Array(3)),
          (_directionArray = new Float32Array(3))),
          _matrix.copy(World.CAMERA.matrixWorld),
          _origin.set(0, 0, 0),
          _origin.applyMatrix4(_matrix),
          _direction.set(0, 0, -1),
          _direction.applyMatrix4(_matrix),
          _direction.sub(_origin).normalize(),
          _origin.toArray(_originArray),
          _direction.toArray(_directionArray));
        let output = [];
        return (
          (
            await _session.requestHitTest(_originArray, _directionArray, _this.frameOfReference)
          ).forEach((hit) => {
            let array = hit.hitMatrix,
              group = new Group();
            (group.matrixWorld.fromArray(array),
              group.matrix.fromArray(array),
              group.matrixWorld.decompose(group.position, group.rotation, group.scale),
              (group.hit = hit),
              output.push(group));
          }),
          output
        );
      }),
      (this.addAnchor = async function (hit, type = "normal") {
        return (
          _session || (_session = await XRDeviceManager.getARSession()),
          (hit = hit.hit || hit),
          window.AURA ? (hit.type = type) : (type = void 0),
          _session.addAnchor(hit, type)
        );
      }),
      (this.removeAnchor = async function (hit) {
        ((hit = hit.hit || hit),
          _session || (_session = await XRDeviceManager.getARSession()),
          _session.removeAnchor(hit, hit.type));
      }),
      (this.getCameraTexture = async function () {
        return (
          _session || (_session = await XRDeviceManager.getARSession()),
          _cameraTexture ||
            ((_cameraTexture = new Texture()),
            await RenderManager.renderer.getCameraTexture(_cameraTexture),
            (_cameraTexture.needsUpdate = !1)),
          _cameraTexture
        );
      }),
      (this.getCameraQuad = async function (shader) {
        let texture = await _this.getCameraTexture();
        shader
          ? shader.set("tMap", texture)
          : (shader = _this.initClass(Shader, "ARCameraQuad", {
              tMap: { value: texture },
              depthWrite: !1,
              depthTest: !1,
            }));
        let mesh = new Mesh(World.QUAD, shader);
        return ((mesh.renderOrder = -999), mesh);
      }),
      (this.applyEnvLighting = async function (shader) {
        (_env && (await _env.ready(), shader.set("tEnvDiffuse", _env.diffuse.texture)),
          _envShaders.push(shader));
      }),
      (this.setFramebuffer = function (baseLayer, view) {
        if (!_this.framebuffer) {
          let viewport = baseLayer.getViewport(view);
          (_framebuffer = new RenderTarget(viewport.width, viewport.height))._gl =
            baseLayer.framebuffer;
        }
      }),
      (this.getFramebuffer = function () {
        return _framebuffer;
      }));
  }, "static"),
  Class(function VRInput() {
    Inherit(this, Component);
    const _this = this;
    var _sources,
      _session,
      _frame,
      _reference,
      _controller,
      _matrix,
      _identity,
      _controllers = [],
      _handColors = {},
      _hands = {},
      _fakeHands = {};
    function onXRFrame(t, frame) {
      ((_session = (_frame = frame).session),
        _frame.getViewerPose(_reference),
        (function updateControllers() {
          _sources = _session.inputSources;
          for (let index = 0; index < _sources.length; ++index) {
            let source = _sources[index];
            if (source.hand) {
              if (
                (_hands[source.handedness] ||
                  (_hands[source.handedness] = _this.initClass(VRInputHand, source.handedness)),
                _handColors[source.handedness] &&
                  _hands[source.handedness].setColor(_handColors[source.handedness]),
                _hands[source.handedness].update(_frame, source.hand, _reference),
                !_this.flag("handsActive"))
              ) {
                (_this.flag("handsActive", !0),
                  _controllers.forEach((c) => (c.group.visible = !1)));
                for (let key in _fakeHands) _fakeHands[key].group.visible = !1;
                for (let key in _hands) _hands[key].group.visible = !0;
                _this.isSetupFakeHands = !1;
              }
            } else {
              let pose = _frame.getPose(source.targetRaySpace, _reference);
              if (!pose) continue;
              if ((_matrix.fromArray(pose.transform.matrix), _matrix.equals(_identity))) continue;
              let handedness = source.handedness,
                controller = _controllers.find((c) => c.handedness === handedness);
              if (!controller) {
                controller = _this.initClass(VRInputController, handedness, _controller);
                let insertIndex = Math.min(index, _controllers.length);
                _controllers.splice(insertIndex, 0, controller);
              }
              if (
                ((controller.inputSource = source),
                source.gamepad && controller.processGamepad(source.gamepad),
                pose && pose.transform && (controller.grip = pose.transform.matrix),
                _this.useControllerHands &&
                  (_fakeHands[handedness] ||
                    (_fakeHands[handedness] = _this.initClass(
                      VRInputControllerHand,
                      handedness,
                      controller,
                    )),
                  _handColors[source.handedness] &&
                    _fakeHands[handedness].setColor(_handColors[source.handedness]),
                  (_fakeHands[handedness].handedness = handedness),
                  _fakeHands[handedness].update(pose.transform.matrix),
                  _controllers.forEach((c) => (c.group.visible = !1))),
                _this.isSetupHands && _this.flag("handsActive"))
              ) {
                if ((_this.flag("handsActive", !1), _this.useControllerHands))
                  for (let key in _fakeHands) _fakeHands[key].group.visible = !0;
                else _controllers.forEach((c) => (c.group.visible = !0));
                for (let key in _hands) _hands[key].group.visible = !1;
                _this.isSetupHands = !1;
              }
            }
          }
          !_this.isSetup && _controllers[0] && (_this.isSetup = !0);
          !_this.isSetupHands &&
            _hands.left &&
            _this.flag("handsActive") &&
            ((_this.isSetupHands = !0),
            Promise.all([_hands.left.ready(), _hands.right.ready()]).then((_) => {
              Interaction3D.useInput([..._hands.left.tips, ..._hands.right.tips]);
            }),
            _this.events.fire(_this.CHANGE, { type: "hands" }));
          _this.isSetupFakeHands ||
            !_fakeHands.left ||
            _this.flag("handsActive") ||
            ((_this.isSetupFakeHands = !0),
            Promise.all([_fakeHands.left.ready(), _fakeHands.right.ready()]).then((_) => {
              Interaction3D.useInput([..._fakeHands.left.tips, ..._fakeHands.right.tips]);
            }),
            _this.events.fire(_this.CHANGE, { type: "controllers" }));
        })());
    }
    async function setup() {
      if (RenderManager.type == RenderManager.WEBVR) {
        var session = await XRDeviceManager.getVRSession();
        session &&
          ((_matrix = new Matrix4()),
          new Matrix4(),
          (_identity = new Matrix4()),
          (_reference = await RenderManager.camera.getFrameOfReference()),
          session.addEventListener("selectstart", onSelectStart),
          session.addEventListener("selectend", onSelectEnd),
          session.addEventListener("native", nativeEvent),
          await _this.wait(100),
          (RenderManager.renderer.onFrame = onXRFrame),
          await _this.wait(_this, "isSetup"),
          _this.events.fire(XRDeviceManager.CONTROLS_START));
      }
    }
    function nativeEvent(e) {
      if (_this.enabled)
        for (let controller of _controllers)
          controller.inputSource == e.inputSource &&
            ((e.controller = controller), controller.events.fire(_this.NATIVE, e));
    }
    function onSelectStart(e) {
      if (_this.enabled)
        for (let controller of _controllers)
          controller.inputSource == e.inputSource &&
            ((e.controller = controller), controller.events.fire(_this.SELECT_START, e));
    }
    function onSelectEnd(e) {
      if (_this.enabled)
        for (let controller of _controllers)
          controller.inputSource == e.inputSource &&
            ((e.controller = controller), controller.events.fire(_this.SELECT_END, e));
    }
    ((this.SELECT_START = "select_start"),
      (this.SELECT_END = "select_end"),
      (this.NATIVE = "native"),
      (this.BUTTON = "vr_button"),
      (this.JOYSTICK = "vr_joystick"),
      (this.CHANGE = "vr_input_change"),
      (async function () {
        (await Hydra.ready(),
          (function addHandlers() {
            _this.events.sub(XRDeviceManager.SESSION_START, setup);
          })(),
          (_this.enabled = !0));
      })(),
      this.get("controllers", (_) => _controllers),
      (this.setControllerConfig = function (config) {
        _controller = config;
        for (let controller of _controllers) controller.applyControllerConfig(config);
      }),
      (this.ready = function () {
        return _this.wait("isSetup");
      }),
      (this.getHandType = function () {
        return _this.isSetupHands ? "real" : "fake";
      }),
      (this.handsReady = function () {
        return Promise.race([_this.wait("isSetupHands"), _this.wait("isSetupFakeHands")]);
      }),
      (this.getHand = function (type) {
        return _this.isSetupHands ? _hands[type] : _fakeHands[type];
      }),
      (this.setHandColor = function (handedness, color) {
        ((_handColors[handedness] = color),
          _this.isSetupHands
            ? _hands[handedness].setColor(color)
            : _fakeHands[handedness].setColor(color));
      }),
      (this.setBeamColor = async function (color) {
        await _this.ready();
        for (let controller of _controllers) controller.setBeamColor(color);
      }),
      (this.setControllerObject = function (Class) {
        _this.setControllerConfig({ body: Class });
      }));
  }, "static"),
  Class(function VRInputController(_type, _config) {
    Inherit(this, Object3D);
    const _this = this;
    var _body,
      _beam,
      _point,
      _hitPositionRequested,
      _beamRequested,
      _grip = new Matrix4(),
      _target = new Matrix4(),
      _q = new Quaternion(),
      _v3 = new Vector3(),
      _haptics = {},
      _buttons = {},
      _joystick = { x: 0, y: 0 };
    ((this.isVrController = !0), (this.pointer = new Vector3()));
    const PHYSICAL_SYNC = !!window.PhysicalSync;
    function initBody() {
      _body = _this.initClass(_config.body, { controller: _this, type: _type });
    }
    function loop() {
      (_grip.decompose(_this.group.position, _this.group.quaternion, _this.group.scale),
        _this.group.updateMatrixWorld(!0),
        _this.group.getWorldPosition(_this.group.worldPos),
        _this.group.getWorldQuaternion(_this.group.worldQuat),
        _this.pointer.set(0, 0, -1).applyQuaternion(_this.group.worldQuat),
        PHYSICAL_SYNC && PhysicalSync.realignObject(_this.group));
    }
    function beforeRender() {
      (_config.enableHitHaptics &&
        _hitPositionRequested &&
        !_point.group.visible &&
        _this.triggerHaptics(0.4, 30),
        _beam && (_beam.group.visible = _beamRequested),
        _point && (_point.group.visible = _hitPositionRequested),
        (_beamRequested = !1),
        (_hitPositionRequested = !1));
    }
    function getButtonLabel(i) {
      let label;
      switch (i) {
        case 0:
          label = "trigger";
          break;
        case 1:
          label = "side_trigger";
          break;
        case 2:
          label = "touch_pad";
          break;
        case 3:
          label = "joy_click";
          break;
        case 4:
          label = "a";
          break;
        case 5:
          label = "b";
      }
      return label;
    }
    (!(function () {
      (!(function initConfig() {
        _config || (_config = {});
        _config.body || (_config.body = VRInputControllerBody);
        _config.beam || (_config.beam = VRInputControllerBeam);
        _config.point || (_config.point = VRInputControllerPoint);
      })(),
        initBody(),
        (function initBeam() {
          (_beam = _this.initClass(_config.beam)).group.visible = !1;
        })());
      let velocity = new VelocityTracker(_this.group.position);
      (velocity.start(),
        (_this.velocity = velocity.value),
        Interaction3D.useInput(_this),
        RenderManager.camera.wrapper.add(_this.group),
        _this.startRender(loop),
        _this.startRender(beforeRender, RenderManager.BEFORE_RENDER));
    })(),
      this.get("target", (_) => _target),
      this.set("target", (m) => _target.fromArray(m)),
      this.get("grip", (_) => _grip),
      this.set("grip", (m) => _grip.fromArray(m)),
      this.get("color", (_) => _beam.color),
      this.set("color", (c) => {
        _beam.color = c;
      }),
      this.get("body", (_) => _body.mesh),
      this.get("handedness", (_) => _this.inputSource.handedness),
      (this.setHitPosition = function (hit) {
        _point &&
          _point.group &&
          hit &&
          hit.point &&
          (_point.group.position.copy(hit.point),
          _v3.copy(hit.face.normal),
          hit.object.getWorldQuaternion(_q),
          _v3.applyQuaternion(_q),
          _v3.add(hit.point),
          _point.group.lookAt(_v3),
          (_hitPositionRequested = !0));
      }),
      (this.applyControllerConfig = function (config) {
        ((_config = config),
          _body && (_this.group.remove(_body.group), _body.destroy(), (_body = null)),
          initBody());
      }),
      (this.processGamepad = function (gamepad) {
        gamepad.buttons.forEach((b, i) => {
          b.pressed
            ? _buttons[i] ||
              ((_buttons[i] = !0),
              _this.events.fire(VRInput.BUTTON, {
                pressed: !0,
                label: getButtonLabel(i),
                controller: _this,
              }))
            : _buttons[i] &&
              ((_buttons[i] = !1),
              _this.events.fire(VRInput.BUTTON, {
                pressed: !1,
                label: getButtonLabel(i),
                controller: _this,
              }));
        });
        let joyX = gamepad.axes[2],
          joyY = gamepad.axes[3];
        ((joyX == _joystick.x && joyY == _joystick.y) ||
          ((_joystick.x = joyX),
          (_joystick.y = joyY),
          (_joystick.controller = _this),
          _this.events.fire(VRInput.JOYSTICK, _joystick)),
          1 == _haptics.needsUpdate &&
            gamepad.hapticActuators &&
            gamepad.hapticActuators.length &&
            ((_haptics.needsUpdate = !1),
            gamepad.hapticActuators[0].pulse(_haptics.strength, _haptics.time)));
      }),
      (this.onDestroy = function () {
        (RenderManager.camera.wrapper.remove(_this.group), World.SCENE.remove(_point.group));
      }),
      (this.setBeamColor = function (color) {
        _beam && (_beam.color = color);
      }),
      (this.showBeam = function () {
        _beam && (_beamRequested = !0);
      }),
      (this.hideBeam = function () {}),
      (this.triggerHaptics = function (strength, time) {
        if ("number" != typeof strength || "number" != typeof time)
          throw "triggerHaptics requires (strength, time)";
        ((_haptics.strength = strength), (_haptics.time = time), (_haptics.needsUpdate = !0));
      }));
  }),
  Class(
    function VRInputControllerBeam() {
      Inherit(this, Object3D);
      const _this = this;
      var _geom, _shader, _mesh, _color;
      (!(function initGeom() {
        _geom = new CylinderGeometry(0.005, 0, 2);
      })(),
        (function initShader() {
          ((_color = VRInputControllerBeam.getColor()),
            (_shader = _this.initClass(Shader, "VRInputControllerBeam", {
              uColor: { value: new Color(_color) },
              transparent: !0,
            })));
        })(),
        (function initMesh() {
          (_mesh = new Mesh(_geom, _shader)).renderOrder = 9999;
        })(),
        (function position() {
          ((_this.group.rotation.x = 0.5 * Math.PI),
            (_this.group.position.z = -1),
            _this.group.add(_mesh));
        })(),
        this.set("color", function (color) {
          (VRInputControllerBeam.setColor(color),
            _shader.set("uColor", new Color(color)),
            (_color = color));
        }),
        this.get("color", function () {
          return _color;
        }));
    },
    (_) => {
      var _color = "#ffffff";
      ((VRInputControllerBeam.setColor = function (color) {
        return (_color = color);
      }),
        (VRInputControllerBeam.getColor = function () {
          return _color;
        }));
    },
  ),
  Class(function VRInputControllerBody() {
    Inherit(this, Object3D);
    const _this = this;
    !(async function () {
      let geom = await GeomThread.loadGeometry(Assets.getPath("~assets/geometry/hand_indexed.bin")),
        shader = _this.initClass(Shader, "VRInputControllerDefault", {
          uAlpha: { value: 0.5 },
          transparent: !0,
          depthWrite: !1,
          side: Shader.DOUBLE_SIDE,
        }),
        mesh = new Mesh(geom, shader);
      (_this.group.add(mesh), (_this.mesh = mesh), (mesh.renderOrder = 9999));
    })();
  }),
  Class(
    function VRInputControllerPoint() {
      Inherit(this, Object3D);
      const _this = this;
      var _geom, _shader, _mesh, _color, _borderColor;
      (!(function initGeom() {
        ((_color = VRInputControllerPoint.getColor()),
          (_borderColor = VRInputControllerPoint.getBorderColor()),
          (_geom = World.PLANE));
      })(),
        (function initShader() {
          _shader = _this.initClass(Shader, "VRInputControllerPoint", {
            uColor: { value: new Color(_color) },
            uBorderColor: { value: new Color(_borderColor) },
            uAlpha: { value: 1 },
            depthTest: !1,
            transparent: !0,
          });
        })(),
        (function initMesh() {
          ((_mesh = new Mesh(_geom, _shader)).scale.setScalar(0.02),
            (_mesh.renderOrder = 1e4),
            (_this.group.visible = !1),
            _this.group.add(_mesh));
        })(),
        this.set("color", function (color) {
          (VRInputControllerPoint.setColor(color),
            _shader.set("uColor", new Color(color)),
            (_color = color));
        }),
        this.get("color", function () {
          return _color;
        }),
        this.set("borderColor", function (color) {
          (VRInputControllerPoint.setBorderColor(color),
            _shader.set("uBorderColor", new Color(color)),
            (_borderColor = color));
        }),
        this.get("borderColor", function () {
          return _borderColor;
        }));
    },
    (_) => {
      var _color = "#ffffff",
        _borderColor = "#000000";
      ((VRInputControllerPoint.setColor = function (color) {
        return (_color = color);
      }),
        (VRInputControllerPoint.getColor = function () {
          return _color;
        }),
        (VRInputControllerPoint.setBorderColor = function (color) {
          return (_borderColor = color);
        }),
        (VRInputControllerPoint.getBorderColor = function () {
          return _borderColor;
        }));
    },
  ),
  Class(
    function VRAbstractHand() {
      Inherit(this, Object3D);
      const _this = this;
      ((this.pointer = new Vector3()), (this.isAbstractHand = !0));
      var _targetColor = new Color();
      const PHYSICAL_SYNC = !!window.PhysicalSync;
      function loop() {
        if ((PHYSICAL_SYNC && PhysicalSync.realignObject(_this.group), _this.thumb)) {
          for (let i = _this.tips.length - 1; i > -1; i--) _this.tips[i].update();
          _this.pointer.set(0, 0, -1).applyQuaternion(_this.index.quaternion);
          let distance = _this.thumb.position.distanceTo(_this.index.position);
          _this.flag("pinching") && distance > 0.025
            ? (_this.flag("pinching", !1),
              _this.events.fire(VRInputHand.PINCH, {
                action: "end",
                hand: _this,
              }))
            : !_this.flag("pinching") &&
              distance <= 0.015 &&
              (_this.flag("pinching", !0),
              _this.events.fire(VRInputHand.PINCH, {
                action: "start",
                hand: _this,
              }));
        }
        _this.index && _this.pointer.set(0, 0, -1).applyQuaternion(_this.index.quaternion);
      }
      (!(function createBody() {
        ((_this.body = Utils3D.createDebug(0.07)), (_this.body.shader.neverRender = !0));
        let velocity = new VelocityTracker(_this.body.position);
        (velocity.start(), (_this.velocity = velocity.value));
      })(),
        (function initShader() {
          ((_this.shader = VRAbstractHand.shader
            ? VRAbstractHand.shader.clone()
            : _this.initClass(Shader, "VRHand", {
                transparent: !0,
                uColor: { value: new Color("#ffffff") },
                uStatic: { value: 0 },
              })),
            (_this.shader.uniforms.uColor = { value: new Color() }));
        })(),
        _this.startRender(loop),
        (_this.setColor = function (colorHex) {
          (_targetColor.set(colorHex), _this.shader.uniforms.uColor.value.lerp(_targetColor, 0.07));
        }),
        (_this.setShader = function (shader) {
          _this.shader = shader;
        }));
    },
    (_) => {
      VRAbstractHand.useShader = function (shader) {
        VRAbstractHand.shader = shader;
      };
    },
  ),
  Class(function VRHandFingerTip(_bone, _prev) {
    const _this = this;
    ((this.position = new Vector3()), (this.quaternion = new Quaternion()));
    var _null = new Group(),
      _velocity = new VelocityTracker(this.position);
    ((this.velocity = _velocity.value),
      (this.direction = new Vector3()),
      (this.body = new Mesh(World.SPHERE, Utils3D.getTestShader())),
      (this.body.visible = !1),
      this.body.scale.setScalar(0.01),
      (this.update = function () {
        (_bone.getWorldPosition(_this.position),
          _prev.getWorldPosition(_null.position),
          _this.position.divideScalar(100),
          _null.position.divideScalar(100),
          _this.direction.copy(_bone.position).sub(_prev.position).normalize(),
          (_null.isCamera = !0),
          _null.lookAt(_this.position),
          _this.quaternion.copy(_null.quaternion),
          _this.position.applyMatrix4(RenderManager.camera.wrapper.matrixWorld),
          (_this.body.position.x = _this.position.x),
          (_this.body.position.y = _this.position.y),
          (_this.body.position.z = _this.position.z),
          (_this.body.matrix.elements[12] = _this.body.matrixWorld.elements[12] = _this.position.x),
          (_this.body.matrix.elements[13] = _this.body.matrixWorld.elements[13] = _this.position.y),
          (_this.body.matrix.elements[14] = _this.body.matrixWorld.elements[14] = _this.position.z),
          _velocity.update());
      }),
      (this.updateStatic = function (position, quaternion) {
        (_this.position.copy(position),
          _this.quaternion.copy(quaternion),
          _this.direction.set(0, 0, -1).applyQuaternion(quaternion),
          _this.body.position.copy(_this.position),
          (_this.body.matrix.elements[12] = _this.body.matrixWorld.elements[12] = _this.position.x),
          (_this.body.matrix.elements[13] = _this.body.matrixWorld.elements[13] = _this.position.y),
          (_this.body.matrix.elements[14] = _this.body.matrixWorld.elements[14] =
            _this.position.z));
      }));
  }),
  Class(function VRInputControllerHand(_type, _controller) {
    Inherit(this, VRAbstractHand);
    const _this = this;
    var _geom,
      _mesh,
      _tip,
      _grip = new Matrix4();
    ((this.tips = []),
      (async function () {
        ((_geom = await GeomThread.loadGeometry("vrhands/pointy_hand_" + _type)),
          _this.flag("loaded", !0),
          (_this.shader.uniforms.uStatic.value = 1),
          (_mesh = new Mesh(_geom, _this.shader)).scale.multiplyScalar(0.01),
          _this.add(_mesh),
          (_mesh.frustumCulled = !1),
          _mesh.rotation.set(Math.radians(-90), 0, Math.radians(-90)),
          (_mesh.position.x = 0.03 * ("left" == _type ? -1 : 1)),
          (_tip = Utils3D.createDebug(0.02)).position.set(
            0.014 * ("left" == _type ? -1 : 1),
            0.02,
            -0.125,
          ),
          (_tip.shader.neverRender = !0),
          _this.add(_tip),
          (_this.tips[0] = _this.initClass(VRHandFingerTip, _tip)),
          RenderManager.camera.wrapper.add(_this.group),
          _this.group.add(_this.body));
      })(),
      (this.update = function (matrix) {
        16 == matrix.length &&
          (_grip.fromArray(matrix),
          _grip.decompose(_this.group.position, _this.group.quaternion, _this.group.scale),
          _this.tips[0] &&
            _this.tips[0].updateStatic(_tip.getWorldPosition(), _this.group.quaternion),
          window.PhysicalSync && PhysicalSync.realignObject(_this.group),
          _this.group.updateMatrixWorld(!0));
      }),
      (this.ready = function () {
        return _this.wait("loaded");
      }),
      this.get("index", (_) => _this.tips[0]));
  }),
  Class(
    function VRInputHand(_type) {
      Inherit(this, VRAbstractHand);
      const _this = this;
      var _geom, _mesh, _center;
      ((this.hand = this.handedness = _type), (this.tips = []));
      var _bones = [];
      const joints = [
        "wrist",
        "thumb-metacarpal",
        "thumb-phalanx-proximal",
        "thumb-phalanx-distal",
        "thumb-tip",
        "index-finger-metacarpal",
        "index-finger-phalanx-proximal",
        "index-finger-phalanx-intermediate",
        "index-finger-phalanx-distal",
        "index-finger-tip",
        "middle-finger-metacarpal",
        "middle-finger-phalanx-proximal",
        "middle-finger-phalanx-intermediate",
        "middle-finger-phalanx-distal",
        "middle-finger-tip",
        "ring-finger-metacarpal",
        "ring-finger-phalanx-proximal",
        "ring-finger-phalanx-intermediate",
        "ring-finger-phalanx-distal",
        "ring-finger-tip",
        "pinky-finger-metacarpal",
        "pinky-finger-phalanx-proximal",
        "pinky-finger-phalanx-intermediate",
        "pinky-finger-phalanx-distal",
        "pinky-finger-tip",
      ];
      (!(async function () {
        (await (async function initMesh() {
          ((_geom = await GeomThread.loadSkinnedGeometry("vrhands/hand_" + _type)),
            _this.flag("loaded", !0),
            ((_mesh = new Skin(_geom, _this.shader, _geom.bones)).root.rotation.x = Math.PI / 2),
            _mesh.scale.setScalar(0.01),
            _this.add(_mesh),
            (_mesh.frustumCulled = !1),
            RenderManager.camera.wrapper.add(_this.group));
        })(),
          (function mapBones() {
            let findBone = (name) => {
              for (let i = 0; i < _mesh.bones.length; i++)
                if (_mesh.bones[i].name == name) return _mesh.bones[i];
            };
            [
              "b_%_wrist",
              "b_%_thumb1",
              "b_%_thumb2",
              "b_%_thumb3",
              "b_%_thumb_null",
              "b_%_index0",
              "b_%_index1",
              "b_%_index2",
              "b_%_index3",
              "b_%_index_null",
              "b_%_middle0",
              "b_%_middle1",
              "b_%_middle2",
              "b_%_middle3",
              "b_%_middle_null",
              "b_%_ring0",
              "b_%_ring1",
              "b_%_ring2",
              "b_%_ring3",
              "b_%_ring_null",
              "b_%_pinky0",
              "b_%_pinky1",
              "b_%_pinky2",
              "b_%_pinky3",
              "b_%_pinky_null",
            ].forEach((boneName) => {
              if (boneName) {
                boneName = boneName.replace("%", "right" === _type ? "r" : "l");
                const bone = findBone(boneName);
                (boneName.includes("null") &&
                  _this.tips.push(
                    _this.initClass(
                      VRHandFingerTip,
                      bone,
                      findBone(boneName.replace("_null", "3")),
                    ),
                  ),
                  boneName.includes("middle1") &&
                    (_center = _this.initClass(
                      VRHandFingerTip,
                      bone,
                      findBone(boneName.replace("_middle1", "_middle0")),
                    )),
                  _bones.push(bone));
              } else _bones.push(null);
            });
          })());
      })(),
        (this.update = function (frame, hand, ref) {
          if (_mesh) {
            for (let i = 0; i < joints.length; i++) {
              let jointSpace = hand.get(joints[i]);
              if (jointSpace) {
                let jointPose = frame.getJointPose(jointSpace, ref);
                _bones[i] &&
                  jointPose &&
                  (_bones[i].position.copy(jointPose.transform.position).multiplyScalar(100),
                  _bones[i].quaternion.copy(jointPose.transform.orientation));
              }
            }
            (_center.update(),
              (_this.body.position.x = _center.position.x),
              (_this.body.position.y = _center.position.y),
              (_this.body.position.z = _center.position.z),
              (_this.body.matrix.elements[12] = _this.body.matrixWorld.elements[12] =
                _center.position.x),
              (_this.body.matrix.elements[13] = _this.body.matrixWorld.elements[13] =
                _center.position.y),
              (_this.body.matrix.elements[14] = _this.body.matrixWorld.elements[14] =
                _center.position.z),
              _this.group.updateMatrixWorld(!0));
          }
        }),
        (this.useShader = function (shader) {
          _mesh.shader = shader;
        }),
        (this.ready = function () {
          return _this.wait("loaded");
        }),
        this.get("thumb", (_) => _this.tips[0]),
        this.get("index", (_) => _this.tips[1]),
        this.get("middle", (_) => _this.tips[2]),
        this.get("ring", (_) => _this.tips[3]),
        this.get("pinky", (_) => _this.tips[4]));
    },
    (_) => {
      VRInputHand.PINCH = "vr_hand_pinch";
    },
  ),
  Class(function VRInputHandAura(_type) {
    Inherit(this, VRAbstractHand);
    const _this = this;
    var _boneMapping, _mesh, _center;
    const _data = { rootPose: { position: [], orientation: [] } };
    var _quaternion = new Quaternion(),
      _vector = new Vector3();
    function loop() {
      if ("number" != typeof _data.hand) return;
      _boneMapping.forEach((entry) => {
        let orientation = _data[entry.name],
          bone = _mesh.bones[entry.skinIndex];
        (_quaternion.fromArray(orientation), bone.quaternion.slerp(_quaternion, 0.5));
      });
      let position = _data.rootPose.position,
        orientation = _data.rootPose.orientation;
      (_vector.fromArray(position),
        _quaternion.fromArray(orientation),
        _mesh.bones[0].position.lerp(_vector, 0.5),
        _mesh.bones[0].quaternion.slerp(_quaternion, 1));
    }
    ((this.hand = this.handedness = _type),
      (this.tips = []),
      (async function () {
        (await (async function initMesh() {
          ((_geom = await GeomThread.loadSkinnedGeometry("vrhands/aura_" + _type)),
            _this.flag("loaded", !0),
            (_mesh = new Skin(_geom, _this.shader, _geom.bones)),
            _this.add(_mesh),
            (_mesh.frustumCulled = !1),
            World.SCENE.add(_this.group));
        })(),
          (function initBoneMapping() {
            _boneMapping = [
              { name: "ovrHandBone_WristRoot", skinIndex: 0, skeletonIndex: 0 },
              {
                name: "ovrHandBone_ForearmStub",
                skinIndex: 23,
                skeletonIndex: 1,
              },
              { name: "ovrHandBone_Thumb0", skinIndex: 1, skeletonIndex: 2 },
              { name: "ovrHandBone_Thumb1", skinIndex: 2, skeletonIndex: 3 },
              { name: "ovrHandBone_Thumb2", skinIndex: 3, skeletonIndex: 4 },
              { name: "ovrHandBone_Thumb3", skinIndex: 4, skeletonIndex: 5 },
              { name: "ovrHandBone_Index1", skinIndex: 6, skeletonIndex: 6 },
              { name: "ovrHandBone_Index2", skinIndex: 7, skeletonIndex: 7 },
              { name: "ovrHandBone_Index3", skinIndex: 8, skeletonIndex: 8 },
              { name: "ovrHandBone_Middle1", skinIndex: 10, skeletonIndex: 9 },
              { name: "ovrHandBone_Middle2", skinIndex: 11, skeletonIndex: 10 },
              { name: "ovrHandBone_Middle3", skinIndex: 12, skeletonIndex: 11 },
              { name: "ovrHandBone_Ring1", skinIndex: 14, skeletonIndex: 12 },
              { name: "ovrHandBone_Ring2", skinIndex: 15, skeletonIndex: 13 },
              { name: "ovrHandBone_Ring3", skinIndex: 16, skeletonIndex: 14 },
              { name: "ovrHandBone_Pinky0", skinIndex: 18, skeletonIndex: 15 },
              { name: "ovrHandBone_Pinky1", skinIndex: 19, skeletonIndex: 16 },
              { name: "ovrHandBone_Pinky2", skinIndex: 20, skeletonIndex: 17 },
              { name: "ovrHandBone_Pinky3", skinIndex: 21, skeletonIndex: 18 },
            ];
          })(),
          (function initFingerTips() {
            const getBone = (key) => {
              for (let i = 0; i < _boneMapping.length; i++) {
                let entry = _boneMapping[i];
                if (entry.name == key) return _mesh.bones[entry.skinIndex];
              }
            };
            ([
              "ovrHandBone_Thumb3",
              "ovrHandBone_Index3",
              "ovrHandBone_Middle3",
              "ovrHandBone_Ring3",
              "ovrHandBone_Pinky3",
            ].forEach((key) => {
              _this.tips.push(
                _this.initClass(VRHandFingerTip, getBone(key), getBone(key.replace("3", "2"))),
              );
            }),
              (_center = _this.initClass(
                VRHandFingerTip,
                getBone("ovrHandBone_Middle1"),
                getBone("ovrHandBone_Middle3"),
              )));
          })(),
          _this.startRender(loop));
      })(),
      (this.update = function (frame, data) {
        _mesh &&
          ((_data.hand = data.hand),
          (_data.rootPose.position[0] = data.rootPose.position[0]),
          (_data.rootPose.position[1] = data.rootPose.position[1]),
          (_data.rootPose.position[2] = data.rootPose.position[2]),
          (_data.rootPose.orientation[0] = data.rootPose.orientation[0]),
          (_data.rootPose.orientation[1] = data.rootPose.orientation[1]),
          (_data.rootPose.orientation[2] = data.rootPose.orientation[2]),
          (_data.rootPose.orientation[3] = data.rootPose.orientation[3]),
          _boneMapping.forEach((entry) => {
            (_data[entry.name] || (_data[entry.name] = []),
              (_data[entry.name][0] = data[entry.name][0]),
              (_data[entry.name][1] = data[entry.name][1]),
              (_data[entry.name][2] = data[entry.name][2]),
              (_data[entry.name][3] = data[entry.name][3]));
          }),
          (_this.group.visible = data.confidence > 3),
          _center.update(),
          _this.body.position.copy(_center.position),
          _this.body.updateMatrixWorld(!0));
      }),
      (this.ready = function () {
        return _this.wait("loaded");
      }),
      this.get("thumb", (_) => _this.tips[0]),
      this.get("index", (_) => _this.tips[1]),
      this.get("middle", (_) => _this.tips[2]),
      this.get("ring", (_) => _this.tips[3]),
      this.get("pinky", (_) => _this.tips[4]));
  }),
  Class(function VRCamera(_gl, _nuke) {
    Inherit(this, Component);
    const _this = this;
    var _session,
      _frame,
      _added,
      _map = new Map(),
      _tempCameras = new Map(),
      _wrapper0 = new Group(),
      _wrapper1 = new Group();
    function applyCamera(camera) {
      (_this.worldCamera.projectionMatrix.copy(camera.projectionMatrix),
        (function applyDepthClipPlanes() {
          let { near: depthNear, far: depthFar } = _this.worldCamera;
          (Math.abs(_session.renderState.depthNear - depthNear) < 0.001 &&
            Math.abs(_session.renderState.depthFar - depthFar) < 1) ||
            _session.updateRenderState({
              depthNear: depthNear,
              depthFar: depthFar,
            });
        })(),
        _this.worldCamera.position.copy(camera.position),
        _this.worldCamera.quaternion.copy(camera.quaternion),
        _this.worldCamera.matrixWorld.copy(camera.matrixWorld),
        _this.worldCamera.matrix.copy(camera.matrix));
    }
    ((this.worldCamera = new PerspectiveCamera(30, Stage.width / Stage.height, 0.1, 1e3)),
      (this.offset = _wrapper0.position),
      (this.inset = _wrapper1.position),
      (this.wrapper = _wrapper0),
      (this.absoluteCameraPos = new Vector3()),
      _wrapper0.add(_wrapper1),
      (this.getFrameOfReference = async function () {
        if (_frame) return _frame;
        _session = await XRDeviceManager.getVRSession();
        try {
          _frame = await _session.requestReferenceSpace("bounded-floor");
        } catch (e) {
          _frame = await _session.requestReferenceSpace("local-floor");
        }
        return _frame;
      }),
      (this.newFrame = function () {
        _map.clear();
      }),
      (this.getRenderCamera = function (view, pose) {
        if (!pose) return;
        if (_map.has(view.eye)) return (applyCamera(_map.get(view.eye)), _this.worldCamera);
        _tempCameras.has(view.eye) ||
          _tempCameras.set(
            view.eye,
            new PerspectiveCamera(30, Stage.width / Stage.height, 0.1, 1e3),
          );
        let camera = _tempCameras.get(view.eye);
        return (
          _added || (World.SCENE.add(_wrapper0), (_added = !0)),
          _this.absoluteCameraPos.copy(view.transform.position),
          _wrapper1.position.copy(view.transform.position),
          _wrapper1.quaternion.copy(view.transform.orientation),
          _wrapper0.updateMatrixWorld(!0),
          camera.projectionMatrix.fromArray(view.projectionMatrix),
          Utils3D.decompose(_wrapper1, camera),
          camera.updateMatrixWorld(!0),
          _map.set(view.eye, camera),
          applyCamera(camera),
          _this.worldCamera
        );
      }),
      (this.forceUpdate = function () {
        (_wrapper0.updateMatrixWorld(!0),
          Utils3D.decompose(_wrapper1, _this.worldCamera),
          _this.worldCamera.updateMatrixWorld(!0));
      }),
      (this.reset = function () {
        _frame = null;
      }));
  }),
  Class(function VRRenderer(_renderer, _nuke) {
    Inherit(this, Component);
    const _this = this;
    var _session,
      _gl,
      _callback,
      _frame,
      _scaleFactor,
      _nativeScaleFactor,
      _currentUnparsedScaleFactor,
      _frameOfRef,
      _vrCamera,
      _frameBound,
      _firedEyeRender,
      _xrFramebuffer,
      _xrGLBinding,
      _mvExt,
      _depthStencilTex,
      _multiviewLayer,
      _frustums = [],
      _renderEvt = {},
      _objRenderEvt = {},
      _cameras = {},
      _viewCameras = new WeakMap();
    const USE_UBO = Renderer.UBO;
    function updateShaderMultiView(shader) {
      let vs = shader.vertexShader,
        obj = shader.mesh;
      if (obj && _renderer.extensions.oculusMultiview && XRDeviceManager.multiview) {
        let topLevelScene = !1,
          parent = obj._parent;
        for (; parent; ) (parent == World.SCENE && (topLevelScene = !0), (parent = parent._parent));
        if (topLevelScene) {
          let newHeader = "#version 300 es\n";
          ((newHeader += "#extension GL_OVR_multiview : require\n"),
            (newHeader += "layout(num_views=2) in;\n"));
          let uniforms = "uniform mat4 leftProjectionMat;\n";
          ((uniforms += "uniform mat4 leftModelViewMat;\n"),
            (uniforms += "uniform mat4 rightProjectionMat;\n"),
            (uniforms += "uniform mat4 rightModelViewMat;\n"),
            (uniforms += "#define MULTIVIEW 1\n"),
            (vs = vs.replace("#version 300 es\n", newHeader)),
            (vs = vs.replace(
              /modelViewMatrix[ *]/g,
              "(gl_ViewID_OVR == 0u ? leftModelViewMat : rightModelViewMat)",
            )),
            (vs = vs.replace(
              /projectionMatrix[ *]/g,
              "(gl_ViewID_OVR == 0u ? leftProjectionMat : rightProjectionMat)",
            )),
            (vs = vs.split("__ACTIVE_THEORY_LIGHTS__")),
            (vs[0] += uniforms),
            (vs = vs.join("__ACTIVE_THEORY_LIGHTS__")),
            (shader.vertexShader = vs));
        }
      }
    }
    function parseScaleFactor(value) {
      return "number" == typeof value ? value : "native" === value ? _nativeScaleFactor : 1;
    }
    function parseFixedFoveation(foveationLevel) {
      return Math.range(
        foveationLevel || 0,
        XRDeviceManager.FOVEATION_LEVEL_NONE,
        XRDeviceManager.FOVEATION_LEVEL_HIGH_TOP,
        0,
        1,
        !0,
      );
    }
    async function setup() {
      (_session = await XRDeviceManager.waitForVRSession()) &&
        ((_nativeScaleFactor = XRWebGLLayer.getNativeFramebufferScaleFactor(_session)),
        (_currentUnparsedScaleFactor = XRDeviceManager.scaleFactor),
        (_scaleFactor = parseScaleFactor(_currentUnparsedScaleFactor)),
        (function initBaseLayers() {
          let scaleFactors = [
              _scaleFactor,
              ...XRDeviceManager.preallocatedScaleFactors.map(parseScaleFactor),
            ],
            baseLayers = {};
          (scaleFactors.forEach((scaleFactor) => {
            baseLayers[scaleFactor] ||
              (baseLayers[scaleFactor] = new XRWebGLLayer(_session, _renderer.context, {
                stencil: _renderer.stencil,
                framebufferScaleFactor: scaleFactor,
              }));
          }),
            (_session.baseLayer = baseLayers[_scaleFactor]),
            XRDeviceManager.preallocatedScaleFactors.length && (_baseLayers = baseLayers));
        })(),
        Render.useRAF(rAFOverride),
        (_vrCamera = RenderManager.camera),
        (_frameOfRef = await _vrCamera.getFrameOfReference()),
        (_renderer.vrRenderingPath = render),
        (_gl = _renderer.context),
        XRDeviceManager.MULTIVIEW
          ? (console.log("SET UP MULTIVIEW"),
            (_xrFramebuffer = _gl.createFramebuffer()),
            (_xrGLBinding = new XRWebGLBinding(_session, _gl)),
            ((_multiviewLayer = _xrGLBinding.createProjectionLayer({
              scaleFactor: _scaleFactor,
              textureType: "texture-array",
              depthFormat: _gl.DEPTH_COMPONENT24,
            })).fixedFoveation = parseFixedFoveation(XRDeviceManager.foveationLevel)),
            _session.updateRenderState({ layers: [_multiviewLayer] }),
            (_mvExt = _renderer.extensions.oculusMultiview))
          : _session.updateRenderState({ baseLayer: _session.baseLayer }),
        _this.events.fire(XRDeviceManager.SESSION_START),
        setTimeout((_) => {
          ((World.RENDERER.preventRender = !1),
            _session.requestAnimationFrame(rAF),
            setTimeout((_) => {
              AppState.set("Global/immersive", Utils.uuid());
            }, 20));
        }));
    }
    function getCamera(eye, camera) {
      return (_cameras[eye] || (_cameras[eye] = camera.clone()), _cameras[eye]);
    }
    function initCameraUBO(camera) {
      ((camera._ubo = new UBO(0, _gl)),
        camera._ubo.push({ value: camera.projectionMatrix }),
        camera._ubo.push({ value: camera.matrixWorldInverse }),
        camera._ubo.push({ value: camera.worldPos }),
        camera._ubo.push({ value: camera.worldQuat }),
        camera._ubo.push({ value: _renderer.resolution }),
        camera._ubo.push(_renderer.time),
        camera._ubo.push(Render.timeScaleUniform),
        camera._ubo.upload());
    }
    function rAF(t, frame) {
      (_vrCamera.newFrame(),
        (_frame = frame),
        (_frameBound = !1),
        (_firedEyeRender = !1),
        _callback && _callback(t),
        _this.onFrame && _this.onFrame(t, frame),
        _session.requestAnimationFrame(rAF));
    }
    function render(scene, camera, projScreenMatrix, frustum, attachSceneUniforms, rt) {
      if (!_frame) return;
      let pose;
      (camera.getWorldPosition(camera.worldPos),
        camera.getWorldQuaternion(camera.worldQuat),
        USE_UBO && (camera._ubo ? camera._ubo.update() : initCameraUBO(camera)));
      try {
        if (((pose = _frame.getViewerPose(_frameOfRef)), !pose)) return;
      } catch (e) {
        return;
      }
      if (rt) {
        let width = _session.baseLayer.framebufferWidth,
          height = _session.baseLayer.framebufferHeight;
        ((rt.width == width && rt.height == height) ||
          rt.setSize(Math.round(width * rt.vrRT), Math.round(height * rt.vrRT), !0),
          rt._gl || rt.upload());
      }
      let multiViewport,
        fixedFoveation = parseFixedFoveation(XRDeviceManager.foveationLevel);
      (_session.baseLayer &&
        fixedFoveation !== _session.baseLayer.fixedFoveation &&
        (_session.baseLayer.fixedFoveation = fixedFoveation),
        _multiviewLayer &&
          fixedFoveation !== _multiviewLayer.fixedFoveation &&
          (_multiviewLayer.fixedFoveation = fixedFoveation));
      let fireEyeRender = !_firedEyeRender;
      _firedEyeRender = !0;
      for (let i = 0; i < pose.views.length; i++) {
        let view = pose.views[i],
          renderCamera = _vrCamera.getRenderCamera(view, pose);
        if (!renderCamera) continue;
        let viewCamera = getCamera(view.eye, renderCamera);
        (_viewCameras.set(view, viewCamera),
          viewCamera.projectionMatrix.copy(renderCamera.projectionMatrix),
          viewCamera.matrix.copy(renderCamera.matrix),
          viewCamera.matrixWorld.copy(renderCamera.matrixWorld),
          viewCamera.matrixWorldInverse.getInverse(viewCamera.matrixWorld),
          viewCamera.worldPos.copy(renderCamera.worldPos),
          viewCamera.worldQuat.copy(renderCamera.worldQuat),
          viewCamera.position.copy(renderCamera.position),
          viewCamera.quaternion.copy(renderCamera.quaternion));
        let viewport = _session.baseLayer.getViewport(view);
        if (
          (USE_UBO && (viewCamera._ubo ? viewCamera._ubo.update() : initCameraUBO(viewCamera)),
          fireEyeRender &&
            ((_renderEvt.stage = viewport),
            (_renderEvt.camera = viewCamera),
            (_renderEvt.view = i),
            (_renderEvt.eye = view.eye),
            RenderManager.fire(RenderManager.EYE_RENDER, _renderEvt)),
          _frustums[i] || (_frustums[i] = new Frustum()),
          _frustums[i].setFromCamera(viewCamera),
          XRDeviceManager.MULTIVIEW && scene == World.SCENE)
        ) {
          let glLayer = _xrGLBinding.getViewSubImage(_session.renderState.layers[0], view),
            viewport = glLayer.viewport;
          ((glLayer.framebuffer = _xrFramebuffer),
            _gl.bindFramebuffer(_gl.FRAMEBUFFER, _xrFramebuffer),
            (multiViewport = viewport),
            0 == i &&
              (_mvExt.framebufferTextureMultiviewOVR(
                _gl.DRAW_FRAMEBUFFER,
                _gl.COLOR_ATTACHMENT0,
                glLayer.colorTexture,
                0,
                0,
                2,
              ),
              null == glLayer.depthStencilTexture
                ? _depthStencilTex ||
                  ((_depthStencilTex = _gl.createTexture()),
                  _gl.bindTexture(_gl.TEXTURE_2D_ARRAY, _depthStencilTex),
                  _gl.texStorage3D(
                    _gl.TEXTURE_2D_ARRAY,
                    1,
                    _gl.DEPTH_COMPONENT24,
                    viewport.width,
                    viewport.height,
                    2,
                  ))
                : (_depthStencilTex = glLayer.depthStencilTexture),
              _mvExt.framebufferTextureMultiviewOVR(
                _gl.DRAW_FRAMEBUFFER,
                _gl.DEPTH_ATTACHMENT,
                _depthStencilTex,
                0,
                0,
                2,
              )));
        }
      }
      let forceClear = !1;
      if (
        (_frameBound ||
          ((_frameBound = !rt),
          multiViewport ||
            _gl.bindFramebuffer(_gl.FRAMEBUFFER, rt ? rt._gl : _session.baseLayer.framebuffer),
          XRDeviceManager.autoClearFrameBuffer && (forceClear = !0)),
        _gl.clearColor(
          Renderer.CLEAR[0],
          Renderer.CLEAR[1],
          Renderer.CLEAR[2],
          XRDeviceManager.mixedReality ? 0 : Renderer.CLEAR[3],
        ),
        (forceClear || rt || (_renderer.autoClear && _this.autoClear)) &&
          _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT),
        XRDeviceManager.MULTIVIEW && scene == World.SCENE)
      )
        for (let l = 0; l < 2; l++)
          for (let i = 0; i < scene.toRender[l].length; i++) {
            let object = scene.toRender[l][i];
            if (
              (object.onBeforeRender && object.onBeforeRender(),
              (object._drawing = !1),
              !object.determineVisible() ||
                !object.shader.visible ||
                object.shader.neverRender ||
                object.neverRender)
            )
              continue;
            let inFrustum = !1;
            for (let f = 0; f < pose.views.length; f++)
              inFrustum || (inFrustum = _frustums[f].intersectsObject(object));
            if (!object.frustumCulled || inFrustum) {
              ((object._drawing = !0), object.shader.draw(object, object.geometry));
              let views = pose.views;
              ((_objRenderEvt.object = object),
                (_objRenderEvt.view = 0),
                (_objRenderEvt.eye = views[0].eye),
                RenderManager.fire(RenderManager.BEFORE_OBJECT_EYE_RENDER, _objRenderEvt),
                (_objRenderEvt.object = null));
              let leftCamera = _viewCameras.get(views[0]),
                rightCamera = _viewCameras.get(views[1]),
                viewport = multiViewport;
              (_renderer.resolution.set(2 * viewport.width, viewport.height),
                USE_UBO && (leftCamera._ubo ? leftCamera._ubo.update() : initCameraUBO(leftCamera)),
                object.leftModelViewMatrix ||
                  ((object.leftModelViewMatrix = new Matrix4()),
                  (object.rightModelViewMatrix = new Matrix4())),
                object.leftModelViewMatrix.multiplyMatrices(
                  leftCamera.matrixWorldInverse,
                  object.matrixWorld,
                ),
                object.rightModelViewMatrix.multiplyMatrices(
                  rightCamera.matrixWorldInverse,
                  object.matrixWorld,
                ),
                object.normalMatrix.getNormalMatrix(object.modelViewMatrix),
                _gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height),
                attachSceneUniforms(object, scene, leftCamera),
                Shader.renderer.appendUniform(
                  object.shader,
                  "leftProjectionMat",
                  leftCamera.projectionMatrix,
                  "mat4",
                ),
                Shader.renderer.appendUniform(
                  object.shader,
                  "rightProjectionMat",
                  rightCamera.projectionMatrix,
                  "mat4",
                ),
                Shader.renderer.appendUniform(
                  object.shader,
                  "leftModelViewMat",
                  object.leftModelViewMatrix,
                  "mat4",
                ),
                Shader.renderer.appendUniform(
                  object.shader,
                  "rightModelViewMat",
                  object.rightModelViewMatrix,
                  "mat4",
                ),
                object.geometry.draw(object, object.shader),
                USE_UBO && leftCamera._ubo.unbind());
            }
          }
      else
        for (let l = 0; l < 2; l++)
          for (let i = 0; i < scene.toRender[l].length; i++) {
            let object = scene.toRender[l][i];
            if (
              (object.onBeforeRender && object.onBeforeRender(),
              (object._drawing = !1),
              !object.determineVisible() ||
                !object.shader.visible ||
                object.shader.neverRender ||
                object.neverRender)
            )
              continue;
            let inFrustum = !1;
            for (let f = 0; f < pose.views.length; f++)
              inFrustum || (inFrustum = _frustums[f].intersectsObject(object));
            if (!object.frustumCulled || inFrustum) {
              ((object._drawing = !0), object.shader.draw(object, object.geometry));
              for (let j = 0; j < pose.views.length; j++) {
                let view = pose.views[j];
                ((_objRenderEvt.object = object),
                  (_objRenderEvt.view = j),
                  (_objRenderEvt.eye = view.eye),
                  RenderManager.fire(RenderManager.BEFORE_OBJECT_EYE_RENDER, _objRenderEvt),
                  (_objRenderEvt.object = null));
                let viewCamera = _viewCameras.get(view),
                  viewport = _session.baseLayer.getViewport(view);
                (rt
                  ? _renderer.resolution.set(rt.width, rt.height)
                  : _renderer.resolution.set(2 * viewport.width, viewport.height),
                  USE_UBO &&
                    (viewCamera._ubo ? viewCamera._ubo.update() : initCameraUBO(viewCamera)),
                  object.modelViewMatrix.multiplyMatrices(
                    viewCamera.matrixWorldInverse,
                    object.matrixWorld,
                  ),
                  object.normalMatrix.getNormalMatrix(object.modelViewMatrix),
                  rt
                    ? _gl.viewport((j * rt.width) / 2, 0, rt.width / 2, rt.height)
                    : _gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height),
                  attachSceneUniforms(object, scene, viewCamera),
                  object.geometry.draw(object, object.shader),
                  USE_UBO && viewCamera._ubo.unbind());
              }
            }
          }
      Shader.renderer.resetState();
    }
    function rAFOverride(callback) {
      _callback = callback;
    }
    ((this.autoClear = !0),
      (Shader.renderer.multiViewOverride = updateShaderMultiView),
      setup(),
      (this.render = function (scene, camera) {
        _frame && _renderer.render(scene, camera);
      }),
      (this.setSize = function (width, height) {
        _renderer.setSize(width, height);
      }),
      (this.reset = function () {
        setup();
      }),
      (this.getBaseLayer = function () {
        return _session.baseLayer;
      }));
  }),
  Class(
    function SocketConnection(_server, _channel) {
      Inherit(this, Component);
      var _socket,
        _pingPong,
        _this = this,
        _fail = 0,
        _binary = {},
        _time = Render.TIME;
      const PING = "ping",
        PONG = "pong";
      function connect() {
        ((_this.pending = !1),
          ((_socket = new WebSocket(_server, ["permessage-deflate"])).binaryType = "arraybuffer"),
          (_socket.onopen = open),
          (_socket.onmessage = message),
          (_socket.onclose = close),
          (_socket.onerror = close));
      }
      function sendPing() {
        _socket && _socket.readyState == WebSocket.OPEN && _socket.send(PING);
      }
      function checkIfConnected() {
        _this.blocked ||
          _this.connected ||
          ((_this.blocked = !0), _this.events.fire(SocketConnection.BLOCKED));
      }
      function open(e) {
        ((_fail = 0),
          (_this.connected = !0),
          _this.events.fire(SocketConnection.OPEN, { socket: _this }, !0),
          _channel && _this.send("register", { channel: _channel }),
          (_pingPong = setInterval(sendPing, 5e3)));
      }
      function message(e) {
        if (e.data != PONG && e.data != PING)
          if ("string" == typeof e.data)
            try {
              let data = JSON.parse(e.data),
                evt = data._evt;
              evt
                ? (delete data._evt, _this.events.fire(evt, data, !0))
                : ((_binary.data = data), _this.events.fire(SocketConnection.BINARY, _binary));
            } catch (er) {}
          else ((_binary.data = e.data), _this.events.fire(SocketConnection.BINARY, _binary));
      }
      function close(e) {
        if (Render.TIME - _time < 50 && !_this.blocked)
          return ((_this.blocked = !0), _this.events.fire(SocketConnection.BLOCKED));
        _this.pending ||
          _fail++ > 250 ||
          ((_this.connected = !1),
          (_this.pending = !0),
          _this.events.fire(SocketConnection.CLOSE, { socket: _this }, !0),
          (_this.timer = _this.delayedCall(connect, 250)),
          clearTimeout(_pingPong));
      }
      ((this.connected = !1),
        (async function () {
          try {
            connect();
          } catch (e) {
            (await defer(),
              _this.events.fire(SocketConnection.ERROR, { socket: _this }),
              (_this.timer = _this.delayedCall(connect, 250)),
              _this.delayedCall(checkIfConnected, 2e4));
          }
        })(),
        (this.send = function (evt, data = {}) {
          if (!_this.connected) return _this.delayedCall((_) => _this.send(evt, data), 100);
          ((data._evt = evt),
            _socket &&
              _socket.readyState == WebSocket.OPEN &&
              _socket.send(null != data.length ? data : JSON.stringify(data)));
        }),
        (this.sendBinary = function (data) {
          _socket &&
            _socket.readyState == WebSocket.OPEN &&
            _socket.bufferedAmount < 1024 &&
            _socket.send("binary:" + (null != data.length ? data : JSON.stringify(data)));
        }),
        (this.close = function () {
          ((_socket.onclose = null),
            (_socket.onerror = null),
            clearTimeout(_this.timer),
            _socket.close());
        }));
    },
    (_) => {
      ((SocketConnection.OPEN = "socket_connection_open"),
        (SocketConnection.CLOSE = "socket_connection_close"),
        (SocketConnection.ERROR = "socket_connection_error"),
        (SocketConnection.BINARY = "socket_connection_binary"),
        (SocketConnection.BLOCKED = "socket_connection_blocked"));
    },
  ),
  Class(
    function SocketConnection2(_server, _channel) {
      Inherit(this, Component);
      var _socket,
        _pingPong,
        _this = this,
        _fail = 0,
        _binary = {},
        _time = Render.TIME;
      const PING = "ping",
        PONG = "pong";
      function connect() {
        ((_this.pending = !1),
          ((_socket = new WebSocket(_server, ["permessage-deflate"])).binaryType = "arraybuffer"),
          (_socket.onopen = open),
          (_socket.onmessage = message),
          (_socket.onclose = close),
          (_socket.onerror = close));
      }
      function sendPing() {
        _socket && _socket.readyState == WebSocket.OPEN && _socket.send(PING);
      }
      function checkIfConnected() {
        _this.blocked ||
          _this.connected ||
          ((_this.blocked = !0), _this.events.fire(SocketConnection2.BLOCKED));
      }
      function open(e) {
        ((_fail = 0),
          (_this.connected = !0),
          _this.events.fire(SocketConnection2.OPEN, { socket: _this }, !0),
          _channel && _this.send("register", { channel: _channel }),
          (_pingPong = setInterval(sendPing, 5e3)));
      }
      function message(e) {
        if (e.data != PONG && e.data != PING)
          if ("string" == typeof e.data)
            try {
              let data = JSON.parse(e.data),
                evt = data._evt;
              evt
                ? (delete data._evt, _this.events.fire(evt, data, !0))
                : ((_binary.data = data), _this.events.fire(SocketConnection2.BINARY, _binary));
            } catch (er) {}
          else ((_binary.data = e.data), _this.events.fire(SocketConnection2.BINARY, _binary));
      }
      function close(e) {
        if (Render.TIME - _time < 50 && !_this.blocked)
          return ((_this.blocked = !0), _this.events.fire(SocketConnection2.BLOCKED));
        _this.pending ||
          _fail++ > 250 ||
          ((_this.connected = !1),
          (_this.pending = !0),
          _this.events.fire(SocketConnection2.CLOSE, { socket: _this }, !0),
          (_this.timer = _this.delayedCall(connect, 250)),
          clearTimeout(_pingPong));
      }
      ((this.connected = !1),
        (async function () {
          try {
            connect();
          } catch (e) {
            (await defer(),
              _this.events.fire(SocketConnection2.ERROR, { socket: _this }),
              (_this.timer = _this.delayedCall(connect, 250)),
              _this.delayedCall(checkIfConnected, 2e4));
          }
        })(),
        (this.send = function (evt, data = {}) {
          if (!_this.connected) return _this.delayedCall((_) => _this.send(evt, data), 100);
          ((data._evt = evt),
            _socket &&
              _socket.readyState == WebSocket.OPEN &&
              _socket.send(null != data.length ? data : JSON.stringify(data)));
        }),
        (this.sendBinary = function (data) {
          _socket &&
            _socket.readyState == WebSocket.OPEN &&
            _socket.bufferedAmount < 1024 &&
            _socket.send("binary:" + (null != data.length ? data : JSON.stringify(data)));
        }),
        (this.close = function () {
          ((_socket.onclose = null),
            (_socket.onerror = null),
            clearTimeout(_this.timer),
            _socket.close());
        }));
    },
    (_) => {
      ((SocketConnection2.OPEN = "socket2_connection_open"),
        (SocketConnection2.CLOSE = "socket2_connection_close"),
        (SocketConnection2.ERROR = "socket2_connection_error"),
        (SocketConnection2.BINARY = "socket2_connection_binary"),
        (SocketConnection2.BLOCKED = "socket2_connection_blocked"));
    },
  ),
  Class(function Container() {
    Inherit(this, Element);
    const _this = this,
      $this = this.element,
      USING_XR = !1;
    var _app = _this.initClass(App);
    !(async function () {
      (AppState.set("Global/playground", !1),
        (function initHTML() {
          (Stage.add($this), $this.css({ position: "static" }));
        })(),
        (async function loadView() {
          let loader = _this.initClass(
            AssetLoader,
            Assets.list().filter(_app.loaderData.assets.split(",").map((f) => f.trim())),
          );
          _this.initClass(window[_app.loaderData.fragment], { loader: loader });
          (loader.loadModules(),
            await Initializer3D.createWorld(),
            await CMSData.ready(),
            AppState.set("Global/loadComplete", !0),
            (async function loadComplete() {
              USING_XR
                ? (_app.xrLandingData && Stage.add(_this.initClass(window[_app.xrLandingData])),
                  (async function waitForInteraction() {
                    await World.instance().initXR(RenderManager.WEBVR);
                    let ref = _this.initClass(window[_app.entryPointData]);
                    ref.group && World.SCENE.add(ref.group);
                    let click = async (e) => {
                      (e && e.isLeaveEvent) ||
                        (await XRDeviceManager.startSession(), Stage.unbind("touchend", click));
                    };
                    window.AURA ? click() : Stage.bind("touchend", click);
                  })())
                : (await World.instance().init(),
                  _this.initClass(window[_app.entryPointData]),
                  $this.add(World.ELEMENT));
            })());
        })());
    })();
  }, "singleton"),
  Class(function Playground() {
    Inherit(this, Component);
    const _this = this;
    let _view, _isRT;
    const USING_XR = Device.system.xr.vr;
    async function initXR() {
      let app = App.toString();
      (app.includes("_this.initClass(XRConfig") &&
        ((app = app.split("_this.initClass(XRConfig,")[1].split(");")[0]),
        _this.initClass(XRConfig, eval(app))),
        USING_XR
          ? waitForInteraction()
          : (await World.instance().init(),
            initView(),
            Stage.add(World.ELEMENT),
            initDoubleClick()));
    }
    async function waitForInteraction() {
      World.instance().initXR(RenderManager.WEBVR).then(initView);
      let click = async (e) => {
        (e && e.isLeaveEvent) ||
          (_this.events.unsub(Mouse.input, Interaction.END, click),
          await XRDeviceManager.startSession());
      };
      window.AURA ? click() : _this.events.sub(Mouse.input, Interaction.END, click);
    }
    function initDoubleClick() {
      _this.lastClick = performance.now();
      Stage.bind("click", function () {
        (performance.now() - _this.lastClick < 180 && onDoubleClick(),
          (_this.lastClick = performance.now()));
      });
    }
    function onDoubleClick() {
      let camera = _isRT ? _view.nuke.camera : World.NUKE.camera,
        scene = _isRT ? _view.scene : World.SCENE,
        raycaster = Raycaster.find(camera),
        objs = [];
      scene.traverse((obj) => {
        objs.push(obj);
      });
      let intersects = raycaster.checkHit(objs, Mouse),
        found = !1;
      intersects.forEach((element) => {
        if (found) return;
        const uilGraph = element?.object?.uilGraph;
        uilGraph && ((found = !0), uilGraph?.find?.(element?.object?.uilName)?.focus?.());
      });
    }
    async function addUIToWorldScene(uiGroup) {
      USING_XR ? await RenderManager.scheduleOne(RenderManager.EYE_RENDER) : await defer();
      let group = new Group(),
        v3 = new Vector3(),
        distance = USING_XR ? 1.5 : 2;
      return (
        v3.set(0, 0, -distance).applyQuaternion(World.CAMERA.quaternion),
        group.position.copy(World.CAMERA.position).add(v3),
        group.lookAt(World.CAMERA.position),
        group.add(uiGroup),
        World.SCENE.add(group),
        group
      );
    }
    async function initGLUIView(element) {
      if (USING_XR) {
        (await addUIToWorldScene(element.group)).scale.setScalar(1 / 1024);
      } else GLUI.Stage.add(element);
    }
    async function initUI3DView(ui3d) {
      USING_XR
        ? (await addUIToWorldScene(ui3d.$gluiObject.group), (ui3d.$gluiObject.depthTest = !1))
        : Device.mobile
          ? initGLUIView(ui3d.root)
          : (GLUI.Scene.add(ui3d.$gluiObject), await addUIToWorldScene(ui3d.$gluiObject.anchor));
    }
    async function initView() {
      let request = Global.PLAYGROUND.split("/")[0],
        view = window["Playground" + request] || window[request] || null;
      if (!view) throw `No Playground class ${request} found.`;
      if (
        ((_view = view.instance ? view.instance() : _this.initClass(view)),
        _view.element
          ? _view.element.mesh
            ? await initGLUIView(_view.element)
            : Stage.add(_view.element)
          : _view.root && _view.$gluiObject && (await initUI3DView(_view)),
        _view.rt && _view.scene && _view.nuke && !_view.isVrWorldMode && !_view.isVrSceneMode)
      )
        if (request.includes("Figma")) {
          let dimensions = _view.dimensions,
            $obj = $gl(dimensions[0], dimensions[1], _view.rt.texture);
          (($obj.x = 40),
            ($obj.y = 40),
            "portrait" === Utils.query("orientation") && (($obj.scale = 0.5), ($obj.y = -300)),
            GLUI.Stage.add($obj));
        } else {
          let shader = _this.initClass(Shader, "ScreenQuad", {
              tMap: { value: _view },
            }),
            mesh = new Mesh(World.QUAD, shader);
          ((mesh.frustumCulled = !1), World.SCENE.add(mesh), (_isRT = !0));
        }
      else World.SCENE.add(_view.group || _view.mesh || _view.object3D || new Group());
      (initCameraHelper(_view.nuke || World.NUKE), Dev.expose("view", _view));
    }
    function initCameraHelper(nuke) {
      let orbitCamera = new PerspectiveCamera(30, Stage.width / Stage.height, 0.1, 1e3);
      orbitCamera.position.z = 6;
      let lastCamera,
        timer0,
        timer1,
        timer2,
        wasdCamera = orbitCamera.clone();
      _this.onResize((_) => {
        ((orbitCamera.aspect = wasdCamera.aspect = Stage.width / Stage.height),
          orbitCamera.updateProjectionMatrix(),
          wasdCamera.updateProjectionMatrix());
      });
      let orbit = new DebugControls(orbitCamera, World.ELEMENT.div),
        wasd = new WASDControls(wasdCamera, World.ELEMENT.div);
      ((orbit.enabled = !1),
        (wasd.enabled = !1),
        _this.startRender((_) => {
          (orbit.update(), wasd.update());
        }),
        (_this.orbitControls = orbit),
        (_this.wasdControls = wasd));
      const clearTimers = (_) => {
          (clearTimeout(timer0), clearTimeout(timer1), clearTimeout(timer2));
        },
        goToOrbit = (_) => {
          ((orbit.enabled = !0),
            (wasd.enabled = !1),
            nuke.camera != wasdCamera && nuke.camera != orbitCamera && (lastCamera = nuke.camera),
            (nuke.camera = orbitCamera),
            AppState.set("playground_camera_active", nuke.camera),
            (_this.activeControls = orbit),
            clearTimers());
        };
      (Utils.query("orbit") &&
        (goToOrbit(),
        (timer0 = _this.delayedCall(goToOrbit, 500)),
        (timer1 = _this.delayedCall(goToOrbit, 1e3)),
        (timer2 = _this.delayedCall(goToOrbit, 3e3))),
        _this.events.sub(Keyboard.DOWN, (_) => {
          document.activeElement.tagName.toLowerCase().includes(["textarea", "input"]) ||
            (Keyboard.pressing.includes("!") &&
              ((orbit.enabled = !1),
              (wasd.enabled = !1),
              lastCamera && (nuke.camera = lastCamera),
              AppState.set("playground_camera_active", !1),
              clearTimers()),
            Keyboard.pressing.includes("@") && goToOrbit(),
            Keyboard.pressing.includes("#") &&
              ((wasd.enabled = !0),
              (orbit.enabled = !1),
              nuke.camera != wasdCamera && nuke.camera != orbitCamera && (lastCamera = nuke.camera),
              (nuke.camera = wasdCamera),
              AppState.set("playground_camera_active", nuke.camera),
              (_this.activeControls = wasd),
              clearTimers()));
        }));
    }
    !(async function () {
      (await UILStorage.ready(),
        (Global.PLAYGROUND = Utils.query("p")),
        AppState.set("Global/playground", Global.PLAYGROUND),
        initXR());
    })();
  }, "singleton"),
  Class(
    function World() {
      Inherit(this, Component);
      const _this = this;
      var _renderer, _scene, _camera, _nuke, _controls;
      World.DPR = Tests.getDPR();
      var _type = RenderManager.NORMAL;
      async function init() {
        World.PLANE ||
          (await (async function initWorld() {
            ((World.PLANE = new PlaneGeometry(1, 1)),
              (World.PLANEHI = new PlaneGeometry(1, 1, 100, 50)),
              (World.QUAD = Utils3D.getQuad()),
              (World.BOX = new BoxGeometry(1, 1, 1)),
              (World.BOXHI = new BoxGeometry(1, 1, 1, 10, 10, 10)),
              (World.SPHERE = new SphereGeometry(1, 16, 16)),
              (World.TUBE = new CylinderGeometry(0.1, 0.1, 20, 10, 100)));
            let options = { powerPreference: "high-performance" };
            Tests.enableWorldNukeMSAA() &&
              ((options.samplesAmount = Tests.msaaSamples() || void 0),
              (options.multisample = !!options.samplesAmount));
            (RenderManager.initialize(_type, options),
              (_renderer = RenderManager.gl),
              (_scene = RenderManager.scene),
              (_camera = RenderManager.camera.worldCamera),
              (_nuke = RenderManager.nuke),
              (_renderer.shadows = !1),
              (Nuke.recyclePingPong = !0),
              Tests.renderFXAA() && _nuke.add(new FXAA()));
            ((World.SCENE = _scene),
              (World.RENDERER = _renderer),
              (World.ELEMENT = $(_renderer.domElement)),
              (World.CAMERA = _camera),
              (World.NUKE = _nuke));
          })(),
          _renderer &&
            (RenderManager.type == RenderManager.NORMAL &&
              (Camera.instance(_camera), (Render.capFPS = Tests.capFPS())),
            (function initControls() {
              if (!window.DebugControls) return;
              const renderTypeNormal = RenderManager.type === RenderManager.NORMAL;
              if (!Utils.query("orbit")) {
                let camera = new BaseCamera();
                return (camera.group.position.set(0, 0, 6), void camera.lock());
              }
              const Controls = Utils.query("wasd") ? WASDControls : DebugControls;
              ((_controls = new Controls(_camera, World.ELEMENT.div)),
                renderTypeNormal
                  ? (_controls.target = new Vector3(0, 0, 0))
                  : (_controls.enabled = !1));
              ((World.CONTROLS = _controls), (World.CAMERA.position.z = 6));
            })(),
            (function addHandlers() {
              _this.events.sub(Events.RESIZE, resize);
            })(),
            Utils.query("uilOnly") || Render.onDrawFrame(loop)));
      }
      function resize() {
        (_renderer.setSize(Stage.width, Stage.height),
          (_camera.aspect = Stage.width / Stage.height),
          _camera.updateProjectionMatrix());
      }
      function loop(t, delta) {
        (_controls && _controls.enabled && _controls.update(), RenderManager.render());
      }
      ((this.initXR = async function (type, startImmersive = !0) {
        ((_type = type), await init());
      }),
        (this.init = function () {
          return init();
        }),
        (this.ready = function () {
          return _this.wait((_) => !!World.NUKE);
        }));
    },
    function () {
      var _instance;
      World.instance = function () {
        return (_instance || (_instance = new World()), _instance);
      };
    },
  ),
  Class(function About(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "About"),
      Inherit(_this, XComponent),
      (_this.fragName = "About"),
      (_this.contexts = 'FragFXScene, "About"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this._initFXScene(World.NUKE, null, {
          format: void 0,
          type: void 0,
          minFilter: void 0,
          magFilter: void 0,
          multiRenderTarget: void 0,
          mipmaps: void 0,
          screenQuad: void 0,
          vrMode: void 0,
          multisample: void 0,
          samplesAmount: void 0,
        }),
        (_this.refractionLayer = _this.initClass(
          FXLayer,
          AppState.createLocal({ name: "Refraction" }, !0),
        )),
        _this.refractionLayer.isFragment &&
          _promises.push(_this.wait(_this.refractionLayer, "__ready")),
        (_this.refraction = _this.initClass(
          SnapshotFrame,
          AppState.createLocal({ texture: _this.refractionLayer }, !0),
        )),
        _this.refraction.isFragment && _promises.push(_this.wait(_this.refraction, "__ready")),
        ((_this.nuke || World.NUKE).paused = !0),
        (_this.ref_NukePass783 = _this.initClass(
          NukePass,
          AppState.createLocal({ shader: "AboutComposite" }, !0),
        )),
        _this.ref_NukePass783.isFragment &&
          _promises.push(_this.wait(_this.ref_NukePass783, "__ready")),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (scrollDelta = 0),
        _this.layers.logo.shader.addUniforms({ uScrollDelta: { value: 0 } }));
      let rotation = 0,
        delta = new Vector2(),
        zero = new Vector2();
      _this.startRender((_) => {
        if (null == _this.scrollProgress) return;
        (delta.lerp(Mouse.down ? Mouse.delta : zero, 0.07),
          (rotation += delta.x * (Device.mobile ? 0.0075 : 0.0025) * 0.5),
          (_this.layers.logo.position.y = Math.range(_this.scrollProgress, -1, 1, 6, -2)),
          (_this.layers.logo.rotation.y =
            -Math.radians(200) * (-0.5 + _this.scrollProgress) + Math.radians(60) + 2 * rotation));
        let dif = scrollDelta - _this.scrollProgress;
        ((scrollDelta = _this.scrollProgress),
          (_this.layers.logo.shader.uniforms.uScrollDelta.value = Math.lerp(
            100 * dif,
            _this.layers.logo.shader.uniforms.uScrollDelta.value,
            0.1,
          )));
      });
      const getText = (text3d) => text3d.text.text.string;
      (GLA11y.registerPage(_this.scene, "AboutPage"),
        GLA11y.textNode(_this.layers.text.group, getText(_this.layers.text)),
        GLA11y.textNode(_this.layers.copy.group, getText(_this.layers.copy)));
      getText(_this.layers.copy);
      (_this.layers.camera.lock(),
        _this.layers.logo.shader.set("tRefraction", _this.refraction),
        (_this.onInit = async (_) => {
          let video = await _this.get("ViewController/video");
          _this.layers.logo.shader.uniforms.tVideo = video.uniform;
        }),
        (_this.layers.text.originTransform = Utils3D.cloneTransform(_this.layers.text)),
        (_this.layers.copy.originTransform = Utils3D.cloneTransform(_this.layers.copy)),
        _this.onResize(function updateLayout() {
          Device.mobile && Stage.height > Stage.width
            ? (_this.layers.text.group.scale.set(0.65, 0.65, 1),
              _this.layers.text.group.position.set(-1.2, 0.6, -5),
              _this.layers.copy.group.scale.set(1.1, 1.1, 1),
              _this.layers.copy.group.position.set(-1.2, -1, -5),
              _this.layers.logo.scale.set(2.1, 2.1, 2.1))
            : (_this.layers.text.group.scale.copy(_this.layers.text.originTransform.scale),
              _this.layers.text.group.position.copy(_this.layers.text.originTransform.position),
              _this.layers.copy.group.position.copy(_this.layers.copy.originTransform.position));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        _this.nuke && (_this.ref_NukePass783.texture = _this.nuke.rttBuffer),
        (_this.ref_NukePass783.upload || _this.ref_NukePass783.pass) &&
          ((_this.nuke || World.NUKE).add(
            _this.ref_NukePass783.pass instanceof NukePass
              ? _this.ref_NukePass783.pass
              : _this.ref_NukePass783,
          ),
          ShaderUIL.add(
            _this.ref_NukePass783.pass instanceof NukePass
              ? _this.ref_NukePass783.pass
              : _this.ref_NukePass783,
          )),
        ((_this.nuke || World.NUKE).paused = !1),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function AboutLogoShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "AboutLogoShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          tMap: {
            value: Utils3D.getTexture("assets/images/room/matcap-test.jpg"),
            getTexture: Utils3D.getRepeatTexture,
          },
          tRefraction: { value: null, getTexture: Utils3D.getRepeatTexture },
          tVideo: { value: null, getTexture: Utils3D.getRepeatTexture },
          tNormal: { value: null, getTexture: Utils3D.getRepeatTexture },
          uVisible: { value: 0 },
          uAlpha: { value: 1 },
          uScrollDelta: { value: 0 },
          uNormalScale: { value: 1 },
          transparent: !0,
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function App() {
    const _this = this;
    (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "App"),
      (_this.contexts = "Component"),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.ref_XRConfig141 = _this.initClass(
          XRConfig,
          AppState.createLocal({ multiview: "false" }, !0),
        )),
        _this.ref_XRConfig141.isFragment &&
          _promises.push(_this.wait(_this.ref_XRConfig141, "__ready")),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.loaderData = { fragment: "LoaderView", assets: "shaders, uil" }),
        (_this.entryPointData = "ViewController"),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ChainInstancer(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, Object3D),
      Inherit(_this, XComponent),
      (_this.fragName = "ChainInstancer"),
      (_this.contexts = "Component,Object3D"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      if (
        (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        Tests.hideChain())
      )
        return void (_this.mesh.visible = !1);
      let meshes = [],
        batch = _this.createFragment(MeshBatch);
      for (let i = 0; i < 80; i++) {
        let mesh = _this.mesh.clone();
        ((mesh.position.y = -0.22 * i),
          (mesh.rotation.y = Math.radians(90) * i),
          mesh.scale.setScalar(2.6),
          (mesh.scale.y *= 0.8),
          batch.add(mesh),
          meshes.push(mesh));
      }
      _this.mesh.visible = !1;
      let root = _this.findParent("Work");
      _this.startRender((_) => {
        root &&
          null != root.scrollProgress &&
          (_this.group.position.copy(_this.mesh.position),
          meshes.forEach((mesh, i) => {
            ((mesh.shader.uniforms.uScroll.value = root.scrollProgress),
              (mesh.rotation.y =
                Math.radians(90) * i - root.scrollProgress * Math.radians(360) * 4));
          }));
      });
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ChainShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "ChainShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          tRefraction: { value: null },
          uScroll: { value: 0 },
          uReflection: { value: new Vector2(1, 1) },
        }),
        (_this.onInit = async (_) => {
          let refraction = await _this.get("Work/refraction");
          _this.shader.set("tRefraction", refraction);
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ChatDOM(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "ChatDOM"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function replaceRandomLetters(str, numReplacements) {
        if (str.length < 2) return str;
        let result = str.split("");
        for (let i = 0; i < numReplacements; i++) {
          const randomPos = Math.floor(Math.random() * str.length),
            randomChar = "0123456789".charAt(Math.floor(10 * Math.random()));
          result[randomPos].includes([" ", "/", "?", ",", ".", "\n"]) ||
            (result[randomPos] = randomChar);
        }
        return result.join("");
      }
      let paginationContainer = null;
      function renderPagination(tag, page, totalPages, totalItems) {
        if (paginationContainer) {
          if (paginationContainer.parentNode) {
            paginationContainer.parentNode.removeChild(paginationContainer);
          }
          paginationContainer = null;
        }
        if (totalPages < 1) return;
        paginationContainer = document.createElement("div");
        paginationContainer.style.display = "flex";
        paginationContainer.style.alignItems = "center";
        paginationContainer.style.gap = "20px";
        paginationContainer.style.marginTop = "15px";
        paginationContainer.style.marginBottom = "5px";
        paginationContainer.style.marginLeft = "10px";
        paginationContainer.style.pointerEvents = "auto";
        paginationContainer.style.userSelect = "none";

        let prevArrow = document.createElement("a");
        prevArrow.textContent = "<";
        prevArrow.style.margin = "0";
        prevArrow.style.fontSize = "16px";
        prevArrow.style.fontWeight = "900";
        prevArrow.style.cursor = "pointer";
        prevArrow.style.display = "inline-block";
        if (page > 0) {
          prevArrow.style.color = "#ffffff";
          prevArrow.style.opacity = "1";
          prevArrow.onclick = async (e) => {
            e.preventDefault();
            if (!_this.get("disableFiltering")) {
              _this.set("disableFiltering", !0);
              _this.delayedCall(() => _this.set("disableFiltering", !1), 1000);
              _this.set("Work/project", null);
              _this.fire("ViewController/topOfWork");
              CMSData.filter(tag, page - 1);
            }
          };
        } else {
          prevArrow.style.color = "#444444";
          prevArrow.style.opacity = "0.3";
          prevArrow.style.pointerEvents = "none";
        }
        paginationContainer.appendChild(prevArrow);

        let pageNum = document.createElement("span");
        pageNum.textContent = `${page + 1} / ${totalPages}`;
        pageNum.style.fontFamily = '"Aquatico", sans-serif';
        pageNum.style.fontSize = "13px";
        pageNum.style.fontWeight = "400";
        pageNum.style.color = "#888888";
        paginationContainer.appendChild(pageNum);

        let nextArrow = document.createElement("a");
        nextArrow.textContent = ">";
        nextArrow.style.margin = "0";
        nextArrow.style.fontSize = "16px";
        nextArrow.style.fontWeight = "900";
        nextArrow.style.cursor = "pointer";
        nextArrow.style.display = "inline-block";
        if (page < totalPages - 1) {
          nextArrow.style.color = "#ffffff";
          nextArrow.style.opacity = "1";
          nextArrow.onclick = async (e) => {
            e.preventDefault();
            if (!_this.get("disableFiltering")) {
              _this.set("disableFiltering", !0);
              _this.delayedCall(() => _this.set("disableFiltering", !1), 1000);
              _this.set("Work/project", null);
              _this.fire("ViewController/topOfWork");
              CMSData.filter(tag, page + 1);
            }
          };
        } else {
          nextArrow.style.color = "#444444";
          nextArrow.style.opacity = "0.3";
          nextArrow.style.pointerEvents = "none";
        }
        paginationContainer.appendChild(nextArrow);

        _this.messages.div.prepend(paginationContainer);
      }
      AppState.bind("CMSData/pagination", ({ tag, page, totalPages, totalItems }) => {
        renderPagination(tag, page, totalPages, totalItems);
      });
      _this.listen("clickFilter", (_) => {
        if (paginationContainer) {
          if (paginationContainer.parentNode) {
            paginationContainer.parentNode.removeChild(paginationContainer);
          }
          paginationContainer = null;
        }
      });
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          addTo: "Stage",
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "div",
              refName: "wrapper",
              children: [
                { _type: "div", refName: "messages", children: [] },
                {
                  maxLength: 100,
                  rows: 1,
                  placeholder: "Ask me anything...",
                  _type: "textarea",
                  refName: "input",
                  children: [],
                },
                { _type: "div", refName: "flashing", children: [] },
              ],
            },
          ],
        }),
        (_this.assistant = _this.initClass(InteractAI.Assistant)),
        _this.assistant.isFragment && _promises.push(_this.wait(_this.assistant, "__ready")),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.wrapper.css({ opacity: 0 }),
        _this.wrapper.hide(),
        _this.flashing.css({ opacity: 0 }),
        (_this.wrapper.progress = 0),
        _this.set("showDisclaimer", !1),
        _this.set("isFocused", !1),
        _this.set("lastClick", 0),
        _this.input.bind("focus", (_) => {
          (_this.set("isFocused", !0), _this.set("showDisclaimer", !0));
        }),
        _this.input.bind("blur", (_) => _this.set("isFocused", !1)),
        _this.input.bind("input", (_) => {
          let text = _this.input.val();
          _this.input.classList().toggle("extended", !!text);
        }),
        _this.input.bind("keydown", async (e) => {
          if (
            (_this.input.val(_this.input.val().replace(/\n/g, " ")), 13 === e.which && !e.shiftKey)
          ) {
            if ((e.preventDefault(), !e.repeat)) {
              if (_this.get("InteractAIAssistant/isThinking")) return;
              let formText = _this.input.val();
              if ((_this.input.val(""), _this.input.classList().toggle("extended", !1), formText)) {
                let blinker = await _this.addMessage(formText, "#00ffff");
                (blinker.classList.add("blink"),
                  e.preventDefault(),
                  (_this.input.progress = 1),
                  (_this.flashing.progress = 0),
                  tween(_this.input, { progress: 0 }, 400, "easeOutSine")
                    .onUpdate((_) => {
                      _this.input.css({ opacity: _this.input.progress });
                    })
                    .onComplete((_) => (_this.input.div.disabled = !0)),
                  tween(_this.flashing, { progress: 1 }, 600, "easeOutSine", 800).onUpdate((_) => {
                    _this.flashing.css({ opacity: _this.flashing.progress });
                  }));
                let response = await _this.assistant.once(formText);
                (response.length > 400 && (response = response.substring(0, 400) + "..."),
                  _this.addMessage(response, "#ffffff", !0),
                  blinker.classList.remove("blink"),
                  (_this.input.div.disabled = !1),
                  (_this.input.progress = 0),
                  tween(_this.input, { progress: 1 }, 400, "easeInSine").onUpdate((_) => {
                    (_this.input.css({ opacity: _this.input.progress }),
                      _this.flashing.css({
                        opacity: 1 - _this.input.progress,
                      }));
                  }));
              }
            }
            e.preventDefault();
          }
        }),
        (_this.onInit = function () {
          (_this.addMessage("What are you looking for?", "#f4f4f4", !0),
            _this.addFilter("-> ACADEMIC EXCELLENCE", "Academic Excellence", !0, 100),
            _this.addFilter("-> TECHNICAL & INNOVATION", "Technical & Innovation", !0, 200),
            _this.addFilter("-> LEADERSHIP & CAMPUS IMPACT", "Leadership & Campus Impact", !0, 300),
            _this.addFilter("-> COMMUNICATION & PERSONALITY", "Communication & Personality", !0, 400),
            _this.addFilter("-> CERTIFICATIONS & PROFESSIONAL DEVELOPMENT", "Certifications & Professional Development", !0, 500));
        }),
        (_this.addMessage = async (str, color, animated = !1, delay = 0) => {
          let elem = document.createElement("p"),
            text = document.createTextNode(str);
          if (
            (elem.appendChild(text),
            color && (elem.style.color = color),
            _this.messages.div.prepend(elem),
            animated)
          ) {
            ((text.textContent = ""), await _this.wait(delay), (text.progress = 0.95));
            let duration = Math.clamp(2 * str.length + 50, 500, 1500),
              setNodeText = (_) => {
                let substr = str.slice(0, str.length * (1 - text.progress));
                text.textContent =
                  substr.slice(0, substr.length * text.progress * text.progress) +
                  replaceRandomLetters(
                    substr.slice(substr.length * text.progress * text.progress),
                    substr.length * text.progress * 0.5,
                  );
              };
            (_this.startRender(setNodeText, 15),
              tween(text, { progress: 0 }, duration, "linear").onComplete((_) => {
                (_this.stopRender(setNodeText), (text.textContent = str));
              }));
          }
          return elem;
        }),
        (_this.addLink = async (title, href, animated = !1, delay = 0) => {
          let link = document.createElement("a");
          if (
            ((link.text = title),
            link.setAttribute("title", title),
            link.setAttribute("href", href),
            link.setAttribute("target", "_blank"),
            _this.messages.div.prepend(link),
            animated)
          ) {
            ((link.textContent = ""), await _this.wait(delay), (link.progress = 0.95));
            let setNodeText = (_) => {
              let substr = title.slice(0, title.length * (1 - link.progress));
              link.textContent =
                substr.slice(0, substr.length * link.progress * link.progress) +
                replaceRandomLetters(
                  substr.slice(substr.length * link.progress * link.progress),
                  substr.length * link.progress * 0.5,
                );
            };
            (_this.startRender(setNodeText, 15),
              tween(link, { progress: 0 }, 600, "linear").onComplete((_) => {
                (_this.stopRender(setNodeText), (link.textContent = title));
              }));
          }
          return link;
        }),
        (_this.addFilter = async (title, tag, animated = !1, delay = 0) => {
          let link = document.createElement("a");
          if (
            ((link.text = title),
            link.setAttribute("title", title),
            tag && link.classList.add("home"),
            (link.onclick = async (_) => {
              _this.get("disableFiltering", !0) ||
                (_this.set("disableFiltering", !0),
                _this.delayedCall(() => {
                  _this.set("disableFiltering", !1);
                }, 1e3),
                _this.fire("clickFilter"),
                tag && defer((_) => link.classList.add("active")),
                (_this.active = link.text),
                _this.set("Work/project", null),
                _this.set("lastClick", Date.now()),
                _this.fire("ViewController/topOfWork"),
                tag && (await defer(), CMSData.filter(tag.toLowerCase(), 0, true)));
            }),
            _this.messages.div.prepend(link),
            _this.listen("clickFilter", (_) => link.classList.remove("active")),
            animated)
          ) {
            ((link.textContent = ""), await _this.wait(delay), (link.progress = 0.95));
            let setNodeText = (_) => {
              let substr = title.slice(0, title.length * (1 - link.progress));
              link.textContent =
                substr.slice(0, substr.length * link.progress * link.progress) +
                replaceRandomLetters(
                  substr.slice(substr.length * link.progress * link.progress),
                  substr.length * link.progress * 0.5,
                );
            };
            (_this.startRender(setNodeText, 15),
              tween(link, { progress: 0 }, 600, "linear").onComplete((_) => {
                (_this.stopRender(setNodeText), (link.textContent = title));
              }));
          }
          return (
            defer((_) => {
              _this.active && title == _this.active && tag && link.classList.add("active");
            }),
            link
          );
        }),
        _this.bind(
          "updateText",
          ({ text: text, color: color = "#ffffff", animated: animated = !1, delay: delay = 0 }) =>
            _this.addMessage(text, color, animated, delay),
        ),
        _this.bind(
          "updateLink",
          ({ title: title, href: href, animated: animated = !1, delay: delay = 0 }) =>
            _this.addLink(title, href, animated, delay),
        ),
        _this.bind(
          "updateFilter",
          ({ title: title, tag: tag, animated: animated = !1, delay: delay = 0 }) =>
            _this.addFilter(title, tag, animated, delay),
        ),
        _this.listen("clearText", (_) => _this.clearChat()),
        _this.listen("resetOptions", (_) => _this.onInit()),
        _this.bind("showDisclaimer", (show) => {
          if (!show) return;
          let disclaimer = "Sessions may be recorded. By using chat, you acknowledge our ",
            elem = document.createElement("p"),
            text = document.createTextNode(disclaimer);
          (elem.appendChild(text),
            (elem.style.color = "#cccccc"),
            _this.messages.div.prepend(elem));
          let link = document.createElement("a");
          ((link.text = "Privacy Policy."),
            link.setAttribute("title", "Privacy Policy."),
            link.setAttribute(
              "href",
              "https://activetheory.notion.site/Active-Theory-Privacy-Notice-dc343e6976e24c5e866be0ee64bf99eb",
            ),
            link.setAttribute("target", "_blank"),
            (link.style.marginLeft = "0"),
            elem.appendChild(link),
            (text.textContent = ""),
            (text.progress = 0.95));
          let duration = Math.clamp(172, 500, 1500),
            setNodeText = (_) => {
              let substr = disclaimer.slice(0, 61 * (1 - text.progress));
              text.textContent =
                substr.slice(0, substr.length * text.progress * text.progress) +
                replaceRandomLetters(
                  substr.slice(substr.length * text.progress * text.progress),
                  substr.length * text.progress * 0.5,
                );
            };
          (_this.startRender(setNodeText, 15),
            tween(text, { progress: 0 }, duration, "linear").onComplete((_) => {
              (_this.stopRender(setNodeText), (text.textContent = disclaimer));
            }));
        }),
        _this.listen("Global/loadFinished", (_) => {
          _this.wrapper.tween({ opacity: 1 }, 2e3, "easeInOutSine", 3300);
          let showingContact = !1,
            routeIsNotWork = !0;
          const checkVisibility = (_) => {
            showingContact || routeIsNotWork ? _this.hideChat() : _this.showChat();
          };
          (_this.bind("ViewController/contact", (active) => {
            ((showingContact = !!active), checkVisibility());
          }),
            _this.bind("Work/scrollProgress", (val) => {
              let prev = routeIsNotWork,
                min = Device.mobile.phone ? 0.1 : 0.05,
                max = Device.mobile.phone ? 0.88 : 0.95;
              ((routeIsNotWork = !(val > min && val < max)),
                prev != routeIsNotWork && checkVisibility());
            }));
        }),
        (_this.hideChat = async (_) => {
          if (_this.hidden) return;
          _this.wrapper.tween({ opacity: 0 }, 200, "easeInSine");
          let uniforms = await _this.get("ViewController/uniforms");
          tween(_this.wrapper, { progress: 0 }, 3e3, "easeInOutSine")
            .onUpdate((_) => {
              uniforms.uChatOpen.value = _this.wrapper.progress;
            })
            .onComplete((_) => _this.wrapper.hide());
        }),
        (_this.showChat = async (_) => {
          (_this.wrapper.show(),
            _this.wrapper.css({ opacity: 0 }).tween({ opacity: 1 }, 1e3, "easeOutSine"));
          let uniforms = await _this.get("ViewController/uniforms");
          tween(_this.wrapper, { progress: 1 }, 1e3, "easeOutSine").onUpdate((_) => {
            uniforms.uChatOpen.value = _this.wrapper.progress;
          });
        }),
        (_this.clearChat = (_) => {
          for (; _this.messages.div.firstChild; )
            _this.messages.div.removeChild(_this.messages.div.firstChild);
        }),
        _this.element.goob(
          '\n    .wrapper {\n        display: flex;\n        flex-direction: column;\n        justify-content: flex-end;\n        padding: 3rem 3rem;\n        mix-blend-mode: color-dodge;\n\n        @media (max-width: 768px) {\n            padding: 2rem 2rem;\n            mix-blend-mode: normal;\n        }\n\n        pointer-events: none;\n        \n        position: fixed;\n        bottom: 0;\n        left: 0;\n        z-index: 3;\n\n        width: min(450px, 100%);\n        height: calc(100% - 100px);\n        background-color: transparent;\n    }\n\n    .messages {\n        display: flex;\n        flex-direction: column-reverse;\n        justify-content: flex-start;\n        overflow: hidden;\n\n        margin-bottom: 1rem;\n        height: 100%;\n        -webkit-mask-image: linear-gradient(to top, white 0%, white 75%, transparent 90%);\n\n        p, a {\n            font-family: "Aquatico", sans-serif;\n            font-size: 14px;\n            font-weight: 400;\n            line-height: 1.5;\n            margin: 6px 0;\n            margin-left: 10px;\n            white-space: pre-wrap;\n\n            @media (max-width: 768px) {\n                font-size: 13px;\n                margin: 4px 0;\n            }\n\n            @keyframes cursor-blink {\n                0% { background: transparent; }\n                25% { background: transparent; }\n                50% { background: #00ffff; }\n                75% { background: #00ffff; }\n                100% { background: transparent; }\n            }\n\n            &.blink::after {\n                content: "";\n                position: absolute;\n                width: 8px;\n                height: 12px;\n                margin-top: 4px;\n                margin-left: 10px;\n    \n                border: none;\n                background-color: #00ffff;\n                display: inline-block;\n                animation: cursor-blink 1.5s infinite;\n            }\n        }\n\n    }\n\n\n    a {\n        color: #c6c6c6;\n        pointer-events: auto;\n        cursor: pointer;\n\n        font-weight: 700;\n        width: fit-content;\n        transition: all 0.4s cubic-bezier(.17,.4,.02,.99);\n        transform: translateX(0px);\n\n        @media (max-width: 768px) {\n            color: #eeeeee;\n            &.home {\n                color: #9ca5ff;\n            }\n        }\n        \n\n        &.active {\n            color: #ffffff;\n            text-shadow: #ffffff 1px 0px 5px;\n            transform: translateX(10px);\n        }\n\n        @media (hover: hover) {\n            &:hover {\n                color: #ffffff;\n                font-weight: 400;\n            }\n        }\n    }\n\n    textarea {\n        background: rgba(0,0,0,0.2);\n        color: rgba(255,255,255,0.7);\n        font-family: "Aquatico", sans-serif;\n        font-weight: 400;\n        font-size: 14px;\n        outline: none;\n\n        border: 2px solid rgba(255,255,255,0.3);\n        border-radius: 50px;\n        padding: 14px 25px 4px;\n\n        transition: all 0.8s cubic-bezier(.17,.4,.02,.99);\n        width: 200px;\n        white-space: nowrap;\n        min-height: 40px;\n        resize: none;\n        pointer-events: auto;\n        overflow: hidden;\n\n        @media (max-width: 768px) {\n            font-size: 13px;\n        }\n\n        &:hover {\n            border: 2px solid rgba(255,255,255,0.5);\n        }\n\n        &:focus {\n            color: #eeeeee;\n            background: rgba(0,0,0,0.5);\n            border: 2px solid rgba(255,255,255,0.8);\n        }\n\n        &.extended {\n            background: rgba(0,0,0,0.5);\n            border: 2px solid rgba(255,255,255,0.9);\n            width: 330px;\n        }\n\n        &::placeholder, * {\n            color: rgba(255,255,255,0.4);\n        }\n    }\n\n    .flashing {\n        position: relative;\n        left: 37px;\n        bottom: 32px;\n\n        width: 12px;\n        height: 12px;\n        border-radius: 6px;\n        background-color: #00ffff;\n        color: #00ffff;\n        opacity: 0.3;\n        animation: dot-flashing 1.5s infinite linear alternate;\n        animation-delay: 0.75s;\n\n        &::before, &::after {\n            content: "";\n            display: inline-block;\n            position: absolute;\n            top: 0;\n            width: 12px;\n            height: 12px;\n            border-radius: 6px;\n            color: #00ffff;\n            opacity: 1;\n            background-color: #00ffff;\n            animation: dot-flashing 1.5s infinite alternate;\n        }\n\n        &::before {\n            left: -25px;\n            animation-delay: 0s;\n        }\n\n        &::after {\n            left: 25px;\n            animation-delay: 1.5s;\n        }\n    }\n\n    @keyframes dot-flashing {\n        0% { background-color: #00ffff; box-shadow: 0 1px 6px #00ffff; }\n        50%, 100% { background-color: rgba(200,255,255,0.2); }\n    }\n',
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ChatUI(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, XComponent),
      (_this.fragName = "ChatUI"),
      (_this.contexts = "GLUIElement"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "ui",
          children: [
            { _type: "ChatUIInput", refName: "input", children: [] },
            { _type: "ChatUIResponse", refName: "response", children: [] },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.bind("ViewController/contact", (active) => {
          active
            ? _this.ui.tween({ alpha: 0 }, 500, "easeOutSine")
            : _this.ui.tween({ alpha: 1 }, 500, "easeOutSine");
        }),
        _this.onResize(function updateLayout() {
          let y = Stage.height - 300;
          ((_this.input.element.x = 0),
            (_this.input.element.y = y),
            (_this.response.element.x = 80),
            (_this.response.element.y = y + 140));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ChatUIInput(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, XComponent),
      (_this.fragName = "ChatUIInput"),
      (_this.contexts = "GLUIElement"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "wrapper",
          children: [
            {
              font: "Aquatico",
              fontSize: 12,
              fontColor: "#E0E0E0",
              _type: "glText",
              _innerText: "_",
              refName: "text",
              children: [],
            },
            {
              font: "Aquatico",
              fontSize: 12,
              fontColor: "#E0E0E0",
              _type: "glText",
              _innerText: "_",
              refName: "suggestion",
              children: [],
            },
            {
              width: 400,
              height: 400,
              bg: "#080808",
              _type: "glObject",
              refName: "bg",
              children: [],
            },
            {
              bg: window.ACTIVE_THEME_COLORS ? window.ACTIVE_THEME_COLORS.primary : "#FFD700",
              width: 8,
              height: 12,
              _type: "glObj",
              refName: "cursor",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let bgShader = new Shader("ChatBGShader", {
        uColor: { value: new Color("#080808") },
        uBottom: { value: 1 },
        uScroll: { value: 0 },
        uHeight: { value: 0.12 },
        uDisabled: { value: 0 },
        uActive: { value: 0 },
        uScrollDelta: { value: 0 },
      });
      _this.bg.useShader(bgShader);
      let color1 = new Color("#00ffff"),
        color2 = new Color("#ffffff"),
        text = "";
      (_this.bind("ChatUIInput/reset", async (_) => {
        ((_this.bg.disabled = !1),
          bgShader.tween("uDisabled", 0, 800, "easeInOutSine"),
          (text = ""),
          _this.text.setText(text + "_"),
          _this.text.setColor(color2));
      }),
        _this.bind("ChatUIResponse/submit", async (t) => {
          (_this.text.setText(t),
            _this.text.setColor(color1),
            bgShader.tween("uDisabled", 1, 500, "easeOutSine"),
            (_this.bg.disabled = !0));
        }),
        _this.events.sub(Keyboard.DOWN, async (e) => {
          if (!_this.bg.disabled) {
            if (
              e &&
              e.key &&
              !e.metaKey &&
              !e.shiftKey &&
              !e.ctrlKey &&
              !e.altKey &&
              "Tab" !== e.key
            )
              switch (e.key) {
                case "Enter":
                  text.length > 0
                    ? _this.set("ChatUIResponse/submit", text.toLowerCase())
                    : _this.set("ChatUIResponse/submit", "PROMETHEUS".toLowerCase());
                  break;
                case "Backspace":
                  ((text = text.slice(0, -1)), _this.text.setText(text + "_"));
                  break;
                case "Delete":
                case "Escape":
                  ((text = ""), _this.text.setText(text + "_"));
                  break;
                case "Shift":
                case "Dead":
                case "Alt":
                case "Control":
                case "ArrowRight":
                case "ArrowLeft":
                case "ArrowUp":
                case "ArrowDown":
                  break;
                default:
                  let letters = "0123456789abcdefghijklmnopqrstuvwxyz ".split("");
                  (text.length < 32 && e.key.toLowerCase().includes(letters) && (text += e.key),
                    _this.text.setText(text + "_"));
              }
            ((_this.text.alpha = 1), loop());
          }
        }));
      let scroll = Scroll.createUnlimited(),
        scrolled = 0;
      function loop() {
        ((scrolled += 0.002 * scroll.delta.y),
          (bgShader.uniforms.uScroll.value = Math.lerp(
            scrolled,
            bgShader.uniforms.uScroll.value,
            0.1,
          )));
        let delta = 0.3 * -Math.clamp(scroll.delta.y, -20, 20);
        bgShader.uniforms.uScrollDelta.value = Math.lerp(
          delta,
          bgShader.uniforms.uScrollDelta.value,
          0.1,
        );
        let active = "" !== text ? 1 : 0;
        ((bgShader.uniforms.uActive.value = Math.lerp(
          active,
          bgShader.uniforms.uActive.value,
          0.1,
        )),
          (_this.text.x = 0.22 * _this.bg.width),
          (_this.text.y = _this.bg.height / 2 - 7 + 5 * bgShader.uniforms.uScrollDelta.value),
          (_this.suggestion.x = _this.text.x),
          (_this.suggestion.y = _this.text.y),
          (_this.cursor.x = _this.text.x - 20),
          (_this.cursor.y = _this.text.y),
          (_this.suggestion.alpha = text.length > 0 ? 0 : 0.2),
          _this.set("ChatUIInput/y", 5 * bgShader.uniforms.uScrollDelta.value));
      }
      (_this.startRender(loop),
        _this.startRender((_) => {
          (_this.suggestion.setText("PROMETHEUS"),
            (_this.cursor.visible = !_this.cursor.visible),
            (_this.cursor.alpha = _this.cursor.visible ? 1 : 0),
            _this.bg.disabled || (_this.cursor.alpha = 0),
            (_this.text.alpha = _this.cursor.visible ? 1 : 0),
            ("" !== text || _this.bg.disabled) && (_this.text.alpha = 1));
        }, 3));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ChatUIResponse(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, XComponent),
      (_this.fragName = "ChatUIResponse"),
      (_this.contexts = "GLUIElement"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "wrapper",
          children: [
            {
              font: "Aquatico",
              align: "center",
              fontSize: 10.5,
              lineHeight: 1.5,
              fontColor: "#ffffff",
              width: 350,
              _type: "glText",
              _innerText: "Response",
              refName: "response",
              children: [],
            },
          ],
        }),
        (_this.assistant = _this.initClass(InteractAI.Assistant)),
        _this.assistant.isFragment && _promises.push(_this.wait(_this.assistant, "__ready")),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let options = { lineHeight: 2 },
        base = "What are you looking for?\nIm trained on 41 achievements",
        response = base;
      ((_this.response.type = 1),
        _this.bind("ChatUIResponse/submit", async (text) => {
          switch (text) {
            case null:
              response = base;
              break;
            case "contact":
              ((response = base), _this.set("ViewController/contact", !0));
              break;
            default:
              ((_this.response.erasing = !0),
                _this.response.tween({ alpha: 0 }, 3e3, "easeOutCubic"),
                (response = await _this.assistant.once(text)),
                response.length > 400 && (response = response.substring(0, 400) + "..."));
          }
          (_this.set("ChatUIInput/reset", response), _this.set("ChatUIResponse/update", response));
        }),
        _this.bind("ChatUIResponse/update", async (text) => {
          ((_this.response.erasing = !0),
            await _this.response.tween({ alpha: 0 }, 400, "easeInSine").promise(),
            (response = text || base),
            (_this.response.erasing = !1),
            _this.response.tween({ alpha: 1 }, 1500, "easeOutCubic"));
        }),
        _this.startRender((_) => {
          let trim = response.substring(0, 400 * _this.response.alpha);
          ((trim = (function replaceRandomLetters(str, numReplacements) {
            if (str.length < 2) return str;
            let result = str.split("");
            const replacementChars = "0123456789";
            for (let i = 0; i < numReplacements; i++) {
              const randomPos = Math.floor(Math.random() * str.length),
                randomChar = replacementChars.charAt(
                  Math.floor(Math.random() * replacementChars.length),
                );
              result[randomPos].includes([" ", "/", "?", ",", ".", "\n"]) ||
                (result[randomPos] = randomChar);
            }
            return result.join("");
          })(trim, response.length * Math.smoothStep(0.8, 0, _this.response.alpha))),
            trim.length < response.length && (trim += "_"),
            _this.response.setText(trim, options));
        }, 20),
        _this.startRender((_) => {
          let y = _this.get("ChatUIInput/y");
          ((_this.response.height = _this.response.dimensions.height),
            (_this.response.x = 0),
            (_this.response.y = -_this.response.height + y));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function CleanRoom(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "CleanRoom"),
      Inherit(_this, XComponent),
      (_this.fragName = "CleanRoom"),
      (_this.contexts = 'FragFXScene, "CleanRoom"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this._initFXScene(World.NUKE, null, {
          format: void 0,
          type: void 0,
          minFilter: void 0,
          magFilter: void 0,
          multiRenderTarget: void 0,
          mipmaps: void 0,
          screenQuad: void 0,
          vrMode: void 0,
          multisample: void 0,
          samplesAmount: void 0,
        }),
        ((_this.nuke || World.NUKE).paused = !0),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.uniforms = {
          uRGBStrength: { value: 1 },
          uVolumetricStrength: { value: 1 },
          uContrast: { value: new Vector2(1, 1) },
        }),
        _this.layout.group.scale.setScalar(2),
        _this.layers.camera.lock());
      (GLA11y.registerPage(_this.scene, "CleanRoomPage"),
        GLA11y.textNode(_this.layers.text.group, _this.layers.text.text.text.string));
      let url = "https://atlab.io";
      async function updateLayout() {
        Device.mobile && Stage.height > Stage.width
          ? ((_this.layers.text.group.position.x = 0.2),
            (_this.layers.text.group.position.y = 0.9),
            (_this.layers.text2.group.position.x = -0.2),
            (_this.layers.text2.group.position.y = 0.4 - 0.5),
            (_this.layers.camera.position.z = 3))
          : ((_this.layers.camera.position.z = 5),
            _this.layers.text.group.position.copy(_this.layers.text.group.oPos),
            _this.layers.text2.group.position.copy(_this.layers.text2.group.oPos));
      }
      (_this.layers.hit.shader.set("uAlpha", 0),
        (_this.layers.text.text.alpha = 0.7),
        (_this.layers.text2.text.alpha = 0.7),
        _this.layers.atlogo.shader.set("uAlpha", _this.layers.hit.visible ? 0.6 : 0.7),
        Interaction3D.find(_this.layers.camera).add(
          _this.layers.hit,
          function onHover(e) {
            switch (((Global.LOGO_HOVERED = "over" == e.action ? 1 : 0), e.action)) {
              case "over":
                (_this.layers.text.text.tween({ alpha: 1 }, 500, "easeOutCubic"),
                  _this.layers.text2.text.tween({ alpha: 1 }, 500, "easeOutCubic"),
                  _this.layers.atlogo.shader.tween("uAlpha", 1, 500, "easeOutCubic"),
                  tween(_this.layers.camera.group.position, { z: -0.25 }, 500, "easeOutCubic"));
                break;
              case "out":
                (_this.layers.text.text.tween({ alpha: 0.7 }, 800, "easeOutCubic"),
                  _this.layers.text2.text.tween({ alpha: 0.7 }, 800, "easeOutCubic"),
                  _this.layers.atlogo.shader.tween("uAlpha", 0.6, 800, "easeOutCubic"),
                  tween(_this.layers.camera.group.position, { z: 0 }, 800, "easeOutCubic"));
            }
          },
          function onClick(e) {
            open(url, "_self");
          },
          { url: url },
        ),
        (_this.layers.text.group.oPos = new Vector3().copy(_this.layers.text.group.position)),
        (_this.layers.text2.group.oPos = new Vector3().copy(_this.layers.text2.group.position)),
        updateLayout(),
        _this.onResize(updateLayout),
        _this.startRender((_) => {
          if (null == _this.scrollProgress) return;
          let base = (Device.mobile && (Stage.height, Stage.width), 0.5),
            spin =
              Device.mobile && Stage.height > Stage.width ? Math.radians(-8) : Math.radians(-15);
          _this.layers.room.rotation.y = spin * (-base + _this.scrollProgress);
        }),
        (_this.onInit = async (_) => {
          _this.volumetricLight.addLight(_this.layers.white);
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.composite = _this.initClass(
          NukePass,
          AppState.createLocal({ shader: "CleanRoomComposite", uniforms: _this.uniforms }, !0),
        )),
        _this.composite.isFragment && _promises.push(_this.wait(_this.composite, "__ready")),
        _this.nuke && (_this.composite.texture = _this.nuke.rttBuffer),
        (_this.volumetricLight = _this.initClass(
          FX.VolumetricLight,
          AppState.createLocal(
            {
              unique: "cleanroom",
              nuke: _this.nuke,
              dpr: 0.4,
              enabled: Tests.volumetricLight(),
            },
            !0,
          ),
        )),
        _this.volumetricLight.isFragment &&
          _promises.push(_this.wait(_this.volumetricLight, "__ready")),
        _this.volumetricLight.uniforms &&
          _this.composite.addUniforms(_this.volumetricLight.uniforms),
        (_this.composite.upload || _this.composite.pass) &&
          ((_this.nuke || World.NUKE).add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          ),
          ShaderUIL.add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          )),
        ((_this.nuke || World.NUKE).paused = !1),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function CleanRoomGlass(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "CleanRoomGlass"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.shader.addUniforms({
          tRefraction: { value: null },
          tEnv: { value: null },
          uDistortStrength: { value: 1 },
          uFresnelPow: { value: 1 },
          uRefractionRatio: { value: 1 },
        }),
        await _this.waitLayers());
      let inner = _this.createFragment(FXScene, _this.findParent("CleanRoom").nuke);
      ((inner.add(_this.layers.glass).shader = _this.createFragment(Shader, "GlassInner", {
        side: Shader.BACK_SIDE,
      })),
        _this.shader.set("tInner", inner));
      let rt = await _this.get("CleanRoom/refraction");
      _this.shader.set("tRefraction", rt);
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function CleanRoomRefractionScene(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "CleanRoomRefractionScene"),
      Inherit(_this, XComponent),
      (_this.fragName = "CleanRoomRefractionScene"),
      (_this.contexts = 'FragFXScene, "CleanRoomRefractionScene"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this._initFXScene(World.NUKE, null, {
          format: void 0,
          type: void 0,
          minFilter: void 0,
          magFilter: void 0,
          multiRenderTarget: void 0,
          mipmaps: void 0,
          screenQuad: void 0,
          vrMode: void 0,
          multisample: void 0,
          samplesAmount: void 0,
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function Contact(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "Contact"),
      Inherit(_this, XComponent),
      (_this.fragName = "Contact"),
      (_this.contexts = 'FragFXScene, "Contact"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        ((_this.nuke || World.NUKE).paused = !0),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.uniforms = {
          uRGBStrength: { value: 1 },
          uVolumetricStrength: { value: 1 },
          uContrast: { value: new Vector2(1, 1) },
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.composite = _this.initClass(
          NukePass,
          AppState.createLocal({ shader: "HomeComposite", uniforms: _this.uniforms }, !0),
        )),
        _this.composite.isFragment && _promises.push(_this.wait(_this.composite, "__ready")),
        _this.nuke && (_this.composite.texture = _this.nuke.rttBuffer),
        (_this.composite.upload || _this.composite.pass) &&
          ((_this.nuke || World.NUKE).add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          ),
          ShaderUIL.add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          )),
        ((_this.nuke || World.NUKE).paused = !1),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ContactUI(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, Initialization),
      Inherit(_this, XComponent),
      (_this.fragName = "ContactUI"),
      (_this.contexts = "GLUIElement,Initialization"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function hover(e) {
        switch (e.action) {
          case "over":
            (e.object.tween({ alpha: 0.6 }, 300, "easeOutQuart"),
              e.object.line && e.object.line.tween({ scaleX: 0, alpha: 0.6 }, 300, "easeOutQuart"));
            break;
          case "out":
            (e.object.tween({ alpha: 1 }, 500, "easeOutQuart"),
              e.object.line && e.object.line.tween({ scaleX: 1, alpha: 1 }, 500, "easeOutQuart"));
        }
      }
      async function updateLayout() {
        if (Device.mobile && Stage.height > Stage.width) {
          let width = 400,
            height = 800,
            scaleX = Math.range(Stage.width, 0, width, 0, 1),
            scaleY = Math.range(Stage.height, 0, height, 0, 1);
          ((_this.ui.scale = Math.min(scaleX, scaleY)),
            (_this.ui.x = Stage.width / 2 - _this.ui.scale * width * 0.5),
            (_this.ui.y = Stage.height / 2 - _this.ui.scale * height * 0.5 + 40),
            (_this.globe.x = 0.5 * width - _this.globe.width / 2),
            (_this.globe.y = 0.39 * height - _this.globe.height / 2),
            (_this.globe.scale = 0.5),
            (_this.globe.alpha = 1),
            (_this.arrow1.x = 0.5 * width),
            (_this.arrow1.y = 0.25 * height),
            (_this.arrow1.rotation = -90),
            (_this.arrow1.scale = 0.5),
            (_this.arrow2.x = _this.arrow1.x),
            (_this.arrow2.y = 0.45 * height),
            (_this.arrow2.rotation = _this.arrow1.rotation),
            (_this.arrow2.scale = _this.arrow1.scale),
            (_this.star1.x = 0.5 * width - Math.max(0.1 * width, 85) - _this.star1.width / 2 - 10),
            (_this.star1.y = 0.45 * height - _this.star1.height / 2 - 238),
            (_this.star2.x = 0.5 * width + Math.max(0.1 * width, 85) - _this.star2.width / 2 + 10),
            (_this.star2.y = 0.45 * height - _this.star2.height / 2 - 238),
            (_this.contact.x = 0.5 * width),
            (_this.contact.y = 0.45 * height - 245),
            (_this.nyc.x = 0.5 * width + 5),
            (_this.nyc.y = 0.4 * height - 58),
            (_this.nyc.scale = 0.85),
            (_this.nyc.alpha = 0.9),
            (_this.lax.x = 0.5 * width + 5),
            (_this.lax.y = 0.27 * height - 58),
            (_this.lax.scale = 0.85),
            (_this.lax.alpha = 0.9),
            (_this.ams.x = 0.5 * width + 5),
            (_this.ams.y = 0.53 * height - 58),
            (_this.ams.scale = 0.85),
            (_this.ams.alpha = 0.9),
            await _this.wait((_) => _this.email.dimensions.width),
            await _this.wait((_) => _this.subscribe.dimensions.width),
            await _this.wait((_) => _this.privacy.dimensions.width),
            (_this.email.x = 0.5 * width + 2),
            (_this.email.y = 0.5 * height + 100),
            (_this.subscribe.x = 0.5 * width - 0.5 * _this.subscribe.dimensions.width + 2),
            (_this.subscribe.y = _this.email.y + 60),
            (_this.privacy.x = 0.5 * width - 0.5 * _this.privacy.dimensions.width + 2),
            (_this.privacy.y = _this.subscribe.y + 25),
            (_this.line1.width = _this.email.dimensions.width),
            (_this.line2.width = 0),
            (_this.line3.width = 0),
            (_this.line1.x = 0.5 * width - 0.5 * _this.line1.width),
            (_this.line1.y = _this.email.y + 20),
            (_this.line2.x = 0.5 * width - 0.5 * _this.line2.width),
            (_this.line2.y = _this.subscribe.y + 17),
            (_this.line3.x = 0.5 * width - 0.5 * _this.line3.width),
            (_this.line3.y = _this.privacy.y + 17),
            (_this.in.x = 0.5 * width - 0.5 * _this.in.width),
            (_this.in.y = _this.line3.y + 35),
            (_this.tw.x = 0.5 * width - 0.5 * _this.tw.width + 50),
            (_this.tw.y = _this.line3.y + 35),
            (_this.ig.x = 0.5 * width - 0.5 * _this.ig.width - 50),
            (_this.ig.y = _this.line3.y + 35),
            (_this.sync.alpha = 0));
        } else {
          let width = 1300,
            height = 500,
            scaleX = Math.range(Stage.width, 0, width, 0, 1),
            scaleY = Math.range(Stage.height, 0, height, 0, 1);
          ((_this.ui.scale = Math.min(scaleX, scaleY)),
            (_this.ui.scale = Math.min(1.15, _this.ui.scale)),
            (_this.ui.x = Stage.width / 2 - 0.5 * _this.ui.scale * width),
            (_this.ui.y = Stage.height / 2 - 0.5 * _this.ui.scale * height),
            (_this.globe.x = 0.5 * width - _this.globe.width / 2),
            (_this.globe.y = 0.5 * height - _this.globe.height / 2),
            (_this.globe.scale = 0.91),
            (_this.globe.alpha = 0.5),
            (_this.arrow1.x = 0.325 * width - _this.arrow1.width / 2),
            (_this.arrow1.y = 0.5 * height - _this.arrow1.height / 2),
            (_this.arrow2.x = 0.675 * width - _this.arrow2.width / 2),
            (_this.arrow2.y = 0.5 * height - _this.arrow2.height / 2),
            (_this.star1.x = 0.44 * width - _this.star1.width / 2),
            (_this.star1.y = 0.5 * height - _this.star1.height / 2 - 203),
            (_this.star2.x = 0.56 * width - _this.star2.width / 2),
            (_this.star2.y = 0.5 * height - _this.star2.height / 2 - 203),
            (_this.contact.x = 0.5 * width),
            (_this.contact.y = height / 2 - 210),
            (_this.lax.x = 0.15 * width + 5),
            (_this.lax.y = height / 2 - 58),
            (_this.nyc.x = 0.5 * width + 5),
            (_this.nyc.y = height / 2 - 58),
            (_this.ams.x = 0.85 * width + 5),
            (_this.ams.y = height / 2 - 58),
            await _this.wait((_) => _this.ams.dimensions.width),
            await _this.wait((_) => _this.lax.dimensions.width),
            await _this.wait((_) => _this.email.dimensions.width),
            await _this.wait((_) => _this.subscribe.dimensions.width),
            await _this.wait((_) => _this.privacy.dimensions.width),
            (_this.email.x = width / 2),
            (_this.email.y = height / 2 + 200),
            (_this.ig.x = _this.lax.x - 125),
            (_this.ig.y = _this.email.y - 40),
            (_this.in.x = _this.ig.x + 50),
            (_this.in.y = _this.ig.y + 1),
            (_this.tw.x = _this.in.x + 50),
            (_this.tw.y = _this.ig.y + 1),
            (_this.privacy.x = _this.lax.x - 0.5 * _this.lax.dimensions.width),
            (_this.privacy.y = _this.ig.y + 65),
            (_this.subscribe.x = _this.privacy.x),
            (_this.subscribe.y = _this.privacy.y + 30),
            (_this.line1.width = _this.email.dimensions.width + 2),
            (_this.line1.x = _this.email.x - 0.5 * _this.line1.width - 1),
            (_this.line1.y = _this.email.y + 20),
            (_this.line2.width = _this.privacy.dimensions.width),
            (_this.line2.x = _this.privacy.x),
            (_this.line2.y = _this.privacy.y + 15),
            (_this.line3.width = _this.subscribe.dimensions.width),
            (_this.line3.x = _this.subscribe.x),
            (_this.line3.y = _this.subscribe.y + 15),
            _this.qrcode &&
              _this.qrcode.glui &&
              ((_this.qrcode.glui.x = _this.ams.x + 10),
              (_this.qrcode.glui.y = _this.ig.y - 5),
              (_this.qrcode.glui.alpha = 1),
              (_this.sync.y = _this.qrcode.glui.y + 108),
              (_this.sync.x = _this.qrcode.glui.x + 55)),
            (_this.sync.alpha = 0.6));
        }
      }
      function replaceRandomLetters(str, numReplacements) {
        let result = str.split("");
        for (let i = 0; i < numReplacements; i++) {
          const randomPos = Math.floor(Math.random() * str.length),
            randomChar = "01234567890".charAt(Math.floor(11 * Math.random()));
          result[randomPos].includes([" ", "/", "?", ",", "."]) || (result[randomPos] = randomChar);
        }
        return result.join("");
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          addTo: "GLUI.Stage",
          _type: "UI",
          refName: "ui",
          children: [
            {
              width: 1e3,
              height: 700,
              bg: "assets/images/ui/globe.png",
              _type: "glObject",
              refName: "globe",
              children: [],
            },
            {
              width: 80,
              height: 80,
              bg: "assets/images/ui/arrow.png",
              _type: "glObject",
              refName: "arrow1",
              children: [],
            },
            {
              width: 80,
              height: 80,
              bg: "assets/images/ui/arrow.png",
              _type: "glObject",
              refName: "arrow2",
              children: [],
            },
            {
              width: 16,
              height: 16,
              bg: "assets/images/ui/star.png",
              _type: "glObject",
              refName: "star1",
              children: [],
            },
            {
              width: 16,
              height: 16,
              bg: "assets/images/ui/star.png",
              _type: "glObject",
              refName: "star2",
              children: [],
            },
            {
              font: "Aquatico",
              fontSize: 14,
              align: "center",
              letterSpacing: 0.1,
              fontColor: "#ffffff",
              _type: "glText",
              _innerText: "CONTACT US",
              refName: "contact",
              children: [],
            },
            {
              font: "Aquatico",
              fontSize: 110,
              align: "center",
              letterSpacing: 0.1,
              fontColor: "#ffffff",
              _type: "glText",
              _innerText: "LAX",
              refName: "lax",
              children: [],
            },
            {
              font: "Aquatico",
              fontSize: 110,
              align: "center",
              letterSpacing: 0.1,
              fontColor: "#ffffff",
              _type: "glText",
              _innerText: "SYD",
              refName: "nyc",
              children: [],
            },
            {
              font: "Aquatico",
              fontSize: 110,
              align: "center",
              letterSpacing: 0.1,
              fontColor: "#ffffff",
              _type: "glText",
              _innerText: "AMS",
              refName: "ams",
              children: [],
            },
            {
              font: "Aquire",
              fontSize: 11,
              align: "left",
              letterSpacing: 0.1,
              fontColor: "#ffffff",
              _type: "glText",
              _innerText: "Privacy Notice",
              refName: "privacy",
              children: [],
            },
            {
              font: "Aquire",
              fontSize: 11,
              align: "left",
              letterSpacing: 0.1,
              fontColor: "#ffffff",
              _type: "glText",
              _innerText: "Newsletter Signup",
              refName: "subscribe",
              children: [],
            },
            {
              font: "Aquire",
              fontSize: 15,
              align: "center",
              letterSpacing: 0.1,
              fontColor: "#ffffff",
              _type: "glText",
              _innerText: "HELLO@ACTIVETHEORY.NET",
              refName: "email",
              children: [],
            },
            {
              font: "Aquire",
              fontSize: 9,
              align: "center",
              letterSpacing: 0.02,
              fontColor: "#ffffff",
              _type: "glText",
              _innerText: "[ MOBILE SYNC ]",
              refName: "sync",
              children: [],
            },
            {
              width: 34,
              height: 34,
              bg: "assets/images/ui/ig.png",
              _type: "glObject",
              refName: "ig",
              children: [],
            },
            {
              width: 30,
              height: 30,
              bg: "assets/images/ui/in.png",
              _type: "glObject",
              refName: "in",
              children: [],
            },
            {
              width: 30,
              height: 30,
              bg: "assets/images/ui/tw.png",
              _type: "glObject",
              refName: "tw",
              children: [],
            },
            {
              width: 276,
              height: 2,
              bg: "#ffffff",
              _type: "glObject",
              refName: "line1",
              children: [],
            },
            {
              width: 189,
              height: 1,
              bg: "#ffffff",
              _type: "glObject",
              refName: "line2",
              children: [],
            },
            {
              width: 160,
              height: 1,
              bg: "#ffffff",
              _type: "glObject",
              refName: "line3",
              children: [],
            },
          ],
        }),
        (_this.ref_MobileSync192 = _this.initClass(MobileSync)),
        _this.ref_MobileSync192.isFragment &&
          _promises.push(_this.wait(_this.ref_MobileSync192, "__ready")),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.qrcode = _this.get("MobileSync/qrcode", !0)),
        _this.qrcode &&
          _this.qrcode.glui &&
          ((_this.qrcode.glui.shader.blending = Shader.ADDITIVE_BLENDING),
          _this.ui.add(_this.qrcode.glui)),
        (_this.onInit = async function () {
          (await _this.initSync(_this.ui.group),
            await _this.initSync(_this.ui),
            _this.set("ready", !0));
        }),
        (_this.ui.alpha = 0),
        _this.ui.hide(),
        (_this.privacy.line = _this.line2),
        (_this.subscribe.line = _this.line3),
        (_this.email.line = _this.line1),
        (_this.arrow1.alpha = Device.mobile && Stage.height > Stage.width ? 0 : 1),
        (_this.arrow2.alpha = Device.mobile && Stage.height > Stage.width ? 0 : 1),
        GLA11y.registerPage(_this.ui.group, "ContactPage"),
        GLA11y.textNode(_this.contact.group, "Contact Us"),
        GLA11y.textNode(_this.lax.group, "Los Angeles"),
        GLA11y.textNode(_this.nyc.group, "New York City"),
        GLA11y.textNode(_this.ams.group, "Amsterdam"),
        GLA11y.textNode(_this.privacy.group, "Privacy Notice"),
        GLA11y.textNode(_this.subscribe.group, "Newsletter Signup"),
        GLA11y.textNode(_this.email.group, "Email us at hello@activetheory.net"),
        GLA11y.objectNode(_this.email, _this.ui.group),
        GLA11y.objectNode(_this.subscribe, _this.ui.group),
        GLA11y.objectNode(_this.privacy, _this.ui.group),
        GLA11y.objectNode(_this.in, _this.ui.group),
        GLA11y.objectNode(_this.tw, _this.ui.group),
        GLA11y.objectNode(_this.ig, _this.ui.group),
        _this.email.interact(hover, (_) => window.open("mailto:hello@activetheory.net"), "#"),
        _this.subscribe.interact(
          hover,
          (_) => window.open("https://mailchi.mp/activetheory/newsletter", "_blank"),
          "#",
        ),
        _this.privacy.interact(
          hover,
          (_) =>
            window.open(
              "https://www.notion.so/Active-Theory-Privacy-Notice-dc343e6976e24c5e866be0ee64bf99eb",
              "_blank",
            ),
          "#",
        ),
        _this.ig.interact(
          hover,
          (_) => window.open("https://www.instagram.com/activetheory", "_blank"),
          "#",
          "Instagram",
        ),
        _this.in.interact(
          hover,
          (_) => window.open("https://www.linkedin.com/company/active-theory/", "_blank"),
          "#",
          "Linked in",
        ),
        _this.tw.interact(
          hover,
          (_) => window.open("https://twitter.com/active_theory", "_blank"),
          "#",
          "Twitter",
        ),
        _this.bind("ViewController/contact", (active) => {
          (updateLayout(),
            active
              ? (_this.ui.show(),
                (_this.ui.shader.blending = Shader.ADDITIVE_BLENDING),
                _this.ui.tween({ alpha: 1 }, 2e3, "easeInOutSine"))
              : _this.ui
                  .tween({ alpha: 0 }, 1e3, "easeOutSine")
                  .onComplete((_) => _this.ui.hide()));
        }),
        _this.onResize(updateLayout),
        _this.startRender((_) => {
          let glitch = Math.smoothStep(0.7, 0.1, _this.ui.alpha);
          (_this.nyc.setText(replaceRandomLetters("NYC", 1 * glitch)),
            _this.lax.setText(replaceRandomLetters("LAX", 1 * glitch)),
            _this.ams.setText(replaceRandomLetters("AMS", 1 * glitch)),
            _this.email.setText(replaceRandomLetters("HELLO@ACTIVETHEORY.NET", 10 * glitch)),
            _this.subscribe.setText(replaceRandomLetters("Newsletter Signup", 10 * glitch)),
            _this.privacy.setText(replaceRandomLetters("Privacy Notice", 10 * glitch)),
            _this.contact.setText(replaceRandomLetters("CONTACT US", 10 * glitch)));
        }, 12));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function CookieBanner(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "CookieBanner"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          addTo: "Stage",
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "div",
              refName: "wrapper",
              children: [
                { _type: "p", refName: "text", children: [] },
                {
                  _type: "div",
                  refName: "buttons",
                  children: [
                    {
                      "aria-label": "Accept Cookies",
                      click: "$cookiesAccept",
                      _type: "button",
                      refName: "accept",
                      children: [
                        {
                          _type: "p",
                          _innerText: "Accept Cookies",
                          refName: "textAccept",
                          children: [],
                        },
                      ],
                    },
                    {
                      "aria-label": "Reject Cookies",
                      click: "$cookiesReject",
                      _type: "button",
                      refName: "reject",
                      children: [
                        {
                          _type: "p",
                          _innerText: "Reject Cookies",
                          refName: "textReject",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (function initText() {
          let title = "Privacy Notice.",
            text = document.createTextNode(
              "Our site uses essential cookies and, with your consent, analytics cookies. Details in ",
            ),
            link = document.createElement("a");
          ((link.text = title),
            link.setAttribute("title", title),
            link.setAttribute("ariaLabel", title),
            link.setAttribute(
              "href",
              "https://activetheory.notion.site/Active-Theory-Privacy-Notice-dc343e6976e24c5e866be0ee64bf99eb#f5782d13e1ac43cc96dfa95e33521fe0",
            ),
            link.setAttribute("target", "_blank"),
            _this.text.div.appendChild(text),
            _this.text.div.appendChild(link));
        })(),
        (_this.cookiesAccept = (_) => {
          (CookieNotice.accept(), _this.set("showCookies", !1));
        }),
        (_this.cookiesReject = (_) => {
          (CookieNotice.decline(), _this.set("showCookies", !1));
        }),
        _this.listen("Global/loadFinished", async (_) => {
          (_this.bind("showCookies", (show) => {
            show
              ? (_this.element.show(),
                _this.wrapper.css({ opacity: 0 }).tween({ opacity: 1 }, 800, "easeOutSine", 200))
              : _this.wrapper
                  .css({ opacity: 1 })
                  .tween({ opacity: 0 }, 400, "easeOutSine")
                  .onComplete((_) => {
                    _this.element.hide();
                  });
          }),
            await CookieNotice.ready(),
            _this.set("showCookies", CookieNotice.displayNotice()));
        }),
        Dev.expose("resetCookies", (_) => CookieNotice.clear()),
        _this.element.hide(),
        _this.element.goob(
          '\n    width: 100%;\n    height: 100%;\n\n    .wrapper {\n        position: fixed;\n        bottom: 40px;\n        right: 32px;\n        z-index: 999999;\n        cursor: default;\n\n        width: 370px;\n        height: 180px;\n        padding: 16px 28px 32px;\n\n        background-color: rgba(0,0,0,0.5);\n        -webkit-backdrop-filter: blur(4px);\n        backdrop-filter: blur(4px);\n        border: 2px solid rgba(255,255,255,0.3);\n        border-radius: 12px;\n\n        @media (max-width: 768px) {\n            bottom: 0;\n            left: 0;\n            right: 0;\n            width: 100%;\n            border-radius: 12px 12px 0 0;\n        }\n\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        align-items: center;\n        gap: 16px;\n    }\n\n    .buttons {\n        width: 100%;\n        display: flex;\n        flex-direction: row;\n        justify-content: center;\n        align-items: center;\n        gap: 12px;\n    }\n\n    p, a {\n        font-family: "Aquatico", sans-serif;\n        font-size: 14px;\n        font-weight: 400;\n        line-height: 1.5;\n        margin: 6px 0;\n        white-space: pre-wrap;\n\n        @media (max-width: 768px) {\n            font-size: 14px;\n        }\n    }\n\n    p {\n        color: white;\n    }\n\n    a {\n        color: #c6c6c6;\n        pointer-events: auto;\n        cursor: pointer;\n        font-weight: 700;\n    }\n\n    button {\n        p {\n            font-size: 12px;\n            color: white;\n        }\n        cursor: pointer;\n        padding: 4px 18px;\n        border-radius: 500px;\n        border: 2px solid rgba(255,255,255,0.5);\n        transition: all 0.2s ease-out;\n\n        &:first-of-type {\n            background: #9ca5ff55;\n        }\n\n        &:last-of-type {\n            background: #00000055;\n        }\n\n        @media (hover: hover) {\n            &:hover {\n                box-shadow: 0 1px 6px #ffffff55;\n                p {\n                    font-weight: 700;\n                    text-shadow: #ffffff99 0px 0px 5px;\n                }\n\n                &:first-of-type { background: #9ca5ff22; }\n                &:last-of-type { background: #00000011; }\n            }\n        }\n    }\n    \n',
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function DragAndDrop(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "DragAndDrop"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.element.attr("draggable", "true"),
        (_this.dragEl = _this.element));
      let _dragId,
        initialized = !1;
      function setDragging() {
        _this.set("UIL/Graph/dragging", _this.dragId);
      }
      function removeDragListeners() {
        (_this.set("UIL/Graph/dragging", !1),
          _this.dragEl.div.removeEventListener("mousedown", setDragging, !1),
          window.removeEventListener("mouseup", _this.removeDragListeners, !1),
          _this.dropTarget.classList?.().remove("hover"),
          _this.dragEl.div.removeEventListener("dragstart", _this.dragStart, !1),
          _this.dragEl.div.removeEventListener("dragend", _this.dragEnd, !1),
          _this.dropTarget.div.removeEventListener("dragenter", _this.dragEnter),
          _this.dropTarget.div.removeEventListener("dragleave", _this.dragLeave),
          _this.dropTarget.div.removeEventListener("dragover", _this.dragOver),
          _this.dropTarget.div.removeEventListener("drop", _this.drop),
          _this.dragEl?.div?.removeEventListener("mousedown", _this.addDragListeners, !1));
      }
      ((_this.setDragEnabled = function (val) {
        (_this.dragEl.attr("draggable", val), !1 === val && removeDragListeners());
      }),
        (_this.setDragElement = function (el) {
          (_this.element.div.removeEventListener("mousedown", setDragging, !1),
            _this.element.attr("draggable", !1),
            (_this.dragEl = el),
            _this.dragEl.attr("draggable", !0));
        }),
        (_this.onInit = function () {
          _this.dropTarget &&
            !initialized &&
            (!(function addDragListeners() {
              if (
                (_this.dragEl.div.addEventListener("mousedown", setDragging, !1),
                window.addEventListener("mouseup", _this.removeDragListeners, !1),
                !_this.element || !_this.dropTarget)
              )
                return;
              (_this.dragEl.div.addEventListener("dragstart", _this.dragStart, !1),
                _this.dragEl.div.addEventListener("dragend", _this.dragEnd, !1),
                _this.dropTarget.div.addEventListener("dragenter", _this.dragEnter),
                _this.dropTarget.div.addEventListener("dragleave", _this.dragLeave),
                _this.dropTarget.div.addEventListener("dragover", _this.dragOver),
                _this.dropTarget.div.addEventListener("drop", _this.drop));
            })(),
            (_dragId = _this.data ? _this.data.id : !!_this.id && _this.id),
            (initialized = !0));
        }),
        (_this.onRemoveView = function () {
          removeDragListeners();
        }),
        _this.bind("UIL/Graph/dragging", (isDragging) => {}),
        (_this.dragStart = function (event) {
          (event.stopPropagation(),
            _dragId ||
              console.warn(
                "No Drag Id is set on Drag and Drop. Set either _this.data.id or _this.id on the class inheriting from DragAndDrop",
                _this,
              ),
            event.dataTransfer.setData("text/plain", _dragId),
            (event.dataTransfer.effectAllowed = "move"),
            (event.dropEffect = "move"),
            _this.element.css({ opacity: 0.4 }),
            _this.onDragStart?.(event));
        }),
        (_this.dragEnd = function (event) {
          (event.stopPropagation(), _this.onDragEnd?.(event), _this.element?.css({ opacity: 1 }));
        }),
        (_this.dragEnter = function (event) {
          (_this.dropTarget.classList().add("hover"), _this.onDragEnter?.(event));
        }),
        (_this.dragLeave = function (event) {
          (_this.dropTarget.classList().remove("hover"), _this.onDragLeave?.(event));
        }),
        (_this.dragOver = function (event) {
          (event.preventDefault(),
            event.stopPropagation(),
            (event.dataTransfer.dropEffect = "move"),
            _this.onDragOver?.(event));
        }),
        (_this.drop = function (event) {
          return (
            event.stopPropagation(),
            _this.dropTarget.classList().remove("hover"),
            _this.onDrop?.(event.dataTransfer.getData("text")),
            !1
          );
        }),
        _this.element.goob(
          "\n    cursor: pointer;\n    .highlight {\n        pointer-events: none;\n    }\n",
        ),
        "UILGraphGroupChildren" === Utils.getConstructorName(_this) &&
          _this.element.goob(
            "\n        .highlight {\n            background: #1aeade !important;\n        }\n    ",
          ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function FloorShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "FloorShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      function updateGlassShader(obj) {
        obj.shader = _this.createFragment(Shader, "GlassReflection", {
          transparent: !0,
        });
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          uDistortStrength: { value: 1 },
          uMirrorStrength: { value: 1 },
          uRUVOffset: { value: new Vector2() },
          uRUVScale: { value: 1 },
        }),
        (_this.normal = new Vector3(0, 1, 0)),
        (_this.onInit = async (_) => {
          await _this.waitLayers();
          for (let key in _this.layers)
            if (
              "floor" != key &&
              "arealight" != key &&
              "camera" != key &&
              "floaters" != key &&
              _this.layers[key].clone
            ) {
              let obj = await _this.mirror.add(_this.layers[key]);
              "glass" == key && updateGlassShader(obj);
            }
          _this.mirror.start();
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.mirror = _this.initClass(
          FX.Mirror,
          AppState.createLocal({ mesh: _this.mesh, normal: _this.normal, size: 1280 }, !0),
        )),
        _this.mirror.isFragment && _promises.push(_this.wait(_this.mirror, "__ready")),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function Footer(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "Footer"),
      Inherit(_this, XComponent),
      (_this.fragName = "Footer"),
      (_this.contexts = 'FragFXScene, "Footer"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this._initFXScene(World.NUKE, null, {
          format: void 0,
          type: void 0,
          minFilter: void 0,
          magFilter: void 0,
          multiRenderTarget: void 0,
          mipmaps: void 0,
          screenQuad: void 0,
          vrMode: void 0,
          multisample: void 0,
          samplesAmount: void 0,
        }),
        (_this.refractionLayer = _this.initClass(
          FXLayer,
          AppState.createLocal({ name: "FooterRefraction" }, !0),
        )),
        _this.refractionLayer.isFragment &&
          _promises.push(_this.wait(_this.refractionLayer, "__ready")),
        (_this.refraction = _this.initClass(
          SnapshotFrame,
          AppState.createLocal({ texture: _this.refractionLayer }, !0),
        )),
        _this.refraction.isFragment && _promises.push(_this.wait(_this.refraction, "__ready")),
        ((_this.nuke || World.NUKE).paused = !0),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.camera = _this.layers.camera),
        (_this.uniforms = {
          uRGBStrength: { value: 1 },
          uVolumetricStrength: { value: 1 },
          uContrast: { value: new Vector2(1, 1) },
        }),
        _this.set("pane", _this.layers.pane),
        _this.set("camera", _this.layers.camera),
        _this.layers.camera.lock());
      let tweenTimeline = _this.createFragment(TweenTimeline),
        rotation = 0,
        baseRotation = Math.radians(130),
        delta = new Vector2(),
        zero = new Vector2();
      (_this.startRender((_) => {
        if (null == _this.scrollProgress) return;
        let progress = 1 - _this.scrollProgress;
        if (
          ((tweenTimeline.elapsed = _this.scrollProgress),
          tweenTimeline.update(),
          (_this.layers.camera.group.position.y = Math.range(_this.scrollProgress, 0, 1, 26, -20)),
          (_this.layers.camera.group.position.z = Device.mobile.phone ? 10 : 0),
          (_this.layers.camera.group.position.z -= 5 * _this.scrollProgress),
          !_this.layers.particles.layers)
        )
          return;
        (delta.lerp(Mouse.down ? Mouse.delta : zero, 0.07),
          (rotation += delta.x * (Device.mobile ? 0.0075 : 0.0025)));
        let scrollTarget = Math.radians(180) + Math.radians(180 * progress);
        ((_this.layers.particles.layers.particles.group.rotation.y =
          baseRotation + -(rotation + scrollTarget)),
          (_this.layers.particles.layers.particles.shader.uniforms.uScroll.value = progress),
          (_this.layers.particles.layers.logo.position.y =
            Math.range(progress, 0, 1, 32, -12) + 10),
          (_this.layers.particles.layers.logo.rotation.y =
            Math.radians(90) + 2 * (rotation + scrollTarget)),
          (_this.layers.particles.layers.logo.rotation.x = Math.radians(180)),
          _this.layers.particles.layers.particles.shader.uniforms.uLogoPos.value.copy(
            _this.layers.particles.layers.logo.position,
          ),
          (_this.layers.particles.layers.particles.shader.uniforms.uLogoPos.value.y *= -1),
          (_this.layers.particles.layers.particles.shader.uniforms.uLogoPos.value.y += 22),
          (_this.layers.particles.layers.column.position.y =
            _this.layers.particles.layers.logo.position.y - 10),
          (_this.layers.particles.layers.column.rotation.y =
            1 * _this.layers.particles.layers.logo.rotation.y),
          (_this.layers.particles.layers.column2.position.y =
            _this.layers.particles.layers.logo.position.y - 10),
          (_this.layers.particles.layers.column2.rotation.y =
            1 * _this.layers.particles.layers.logo.rotation.y),
          (_this.layers.particles.layers.logo.shader.uniforms.tRefraction.value = _this.refraction),
          (_this.layers.particles.layers.logo.shader.uniforms.uFooter.value = 1),
          (_this.layers.particles.layers.column.shader.uniforms.tRefraction.value =
            _this.refraction),
          (_this.layers.particles.layers.column2.shader.uniforms.tRefraction.value =
            _this.refraction),
          _this.set("rotationV", _this.layers.particles.layers.particles.group.rotation.y));
      }),
        (_this.onInit = async (_) => {
          (await _this.layers.particles.layout.getAllLayers(),
            (_this.layers.particles.layers.video.rotation.z = Math.radians(180)),
            (_this.layers.particles.layers.video.position.y += 1),
            (_this.layers.particles.layers.video.shader.uniforms.uAlpha.value = 0.5),
            (_this.layers.particles.layers.column.shader.uniforms.uAlpha.value = 0.6),
            (_this.layers.particles.layers.column2.shader.uniforms.uAlpha.value = 0.6),
            _this.volumetricLight.addLight(_this.layers.particles.layers.logo));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.composite = _this.initClass(
          NukePass,
          AppState.createLocal({ shader: "HomeComposite", uniforms: _this.uniforms }, !0),
        )),
        _this.composite.isFragment && _promises.push(_this.wait(_this.composite, "__ready")),
        _this.nuke && (_this.composite.texture = _this.nuke.rttBuffer),
        (_this.volumetricLight = _this.initClass(
          FX.VolumetricLight,
          AppState.createLocal(
            {
              unique: "home",
              nuke: _this.nuke,
              resolution: 0.1,
              enabled: Tests.volumetricLight(),
            },
            !0,
          ),
        )),
        _this.volumetricLight.isFragment &&
          _promises.push(_this.wait(_this.volumetricLight, "__ready")),
        _this.volumetricLight.uniforms &&
          _this.composite.addUniforms(_this.volumetricLight.uniforms),
        (_this.composite.upload || _this.composite.pass) &&
          ((_this.nuke || World.NUKE).add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          ),
          ShaderUIL.add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          )),
        ((_this.nuke || World.NUKE).paused = !1),
        _this.initClass(
          StateInitializer,
          TubesInteraction,
          "tubes",
          {
            scene: "#x#_this.scene#x#",
            camera: "_this.camera",
            refraction: "_this.refraction",
          },
          { init: "#x#Tests.interactiveTubes()#x#" },
        ),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function HexagonGrid(_input, _group) {
    const _this = this;
    (Inherit(_this, Object3D),
      Inherit(_this, XComponent),
      (_this.fragName = "HexagonGrid"),
      (_this.contexts = "Object3D"),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mouseFluid = _this.initClass(MouseFluid)),
        _this.mouseFluid.isFragment && _promises.push(_this.wait(_this.mouseFluid, "__ready")),
        (_this.batch = _this.initClass(MeshBatch)),
        _this.batch.isFragment && _promises.push(_this.wait(_this.batch, "__ready")),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      const WIDTH = Math.floor((16 / 9) * 25);
      var _hold = { value: 0, v1: 0, v2: 0 },
        _time = { value: 0, v: 0 };
      ((_this.shaderUniforms = {
        tBaseColor: {
          value: Utils3D.getRepeatTexture("assets/images/pbr/damaged_road_basecolor.png"),
          getTexture: Utils3D.getRepeatTexture,
        },
        tMRO: {
          value: Utils3D.getRepeatTexture("assets/images/pbr/damaged_road_mro.png"),
          getTexture: Utils3D.getRepeatTexture,
        },
        tNormal: {
          value: Utils3D.getRepeatTexture("assets/images/pbr/damaged_road_normal.png"),
          getTexture: Utils3D.getRepeatTexture,
        },
        tEnvDiffuse: {
          value: Utils3D.getRepeatTexture("assets/images/pbr/corsica_beach-diffuse-RGBM.png"),
          premultiplyAlpha: !1,
        },
        tEnvSpecular: {
          value: Utils3D.getRepeatTexture("assets/images/pbr/corsica_beach-specular-RGBM.png"),
          premultiplyAlpha: !1,
        },
        tLightmap: { value: null, premultiplyAlpha: !1 },
        tLUT: {
          value: Utils3D.getLookupTexture("assets/images/pbr/lut.png"),
          ignoreUIL: !0,
        },
        tVideo: { value: Utils3D.getTexture("assets/images/lab.gif") },
        uTint: { value: new Color("#FFFFFF") },
        uTiling: { value: new Vector2(1, 1) },
        uOffset: { value: new Vector2(0, 0) },
        uMRON: { value: new Vector4(1, 0.4, 0.5, 0.04) },
        uEnv: { value: new Vector2(1, 0) },
        uEnvRotation: { value: 0 },
        uScroll: { value: 0 },
        uVisible: { value: 1 },
        uHold: _hold,
        uTime: _time,
        uRotation: { value: 0 },
        uUVScale: { value: new Vector2(1, 1) },
        uParams: { value: new Vector4(1, 1, 1, 1) },
        uFogColor: { value: new Color() },
        uUseLightmap: { value: 0 },
        uHDR: { value: 1 },
        uUseTonemapping: { value: 1, ignoreUIL: !0 },
        uUseLinearOutput: { value: 0, ignoreUIL: !0 },
      }),
        _this.group.add(_this.batch.group),
        (async function initGrid() {
          (await _this.wait((_) => !!_this.shader), ShaderUIL.add(_this.shader, _this.uilFolder));
          const hexagonWidth = 0.08 * Math.sqrt(3);
          await _this.mouseFluid.applyTo(_this.shader);
          let geometry = await GeomThread.loadGeometry("assets/geometry/hexgrid/hexagon_gem.bin");
          for (let i = 0; i < 25; i++)
            for (let j = 0; j < WIDTH; j++) {
              let side = 0;
              (0 == i
                ? (side = 1)
                : 24 == i
                  ? (side = 3)
                  : 0 == j && i % 2 == 0
                    ? (side = 4)
                    : j == WIDTH - 1 && i % 2 != 0 && (side = 2),
                ((0 == i && 0 == j) || (24 == i && 0 == j)) && (side = 5));
              let mesh = new Mesh(geometry, _this.shader);
              ((mesh.attributes = { side: side }),
                (mesh.position.x = hexagonWidth * j - hexagonWidth * WIDTH * 0.5),
                (mesh.position.x += 0.5 * hexagonWidth * (i % 2)),
                (mesh.position.y = 0.12 * i - 1.5 + 0.06),
                mesh.scale.setScalar(0.08),
                _this.batch.add(mesh));
            }
        })());
      Scroll.createUnlimited();
      var _hoverV = 0,
        _timeV = 0;
      let root = _this.findParent("CleanRoom");
      _this.startRender((_) => {
        ((_hold.v1 = Mouse.down ? 1 : 0),
          (_hold.v2 = Math.lerp(_hold.v1, _hold.v2, 0.03)),
          (_hold.value = Math.lerp(_hold.v2, _hold.value, 0.03)));
        Math.abs(_hold.v1 - _hold.value);
        ((_this.group.rotation.z = Stage.width > Stage.height ? 0 : Math.radians(90)),
          root.scrollProgress && (_this.shader.uniforms.uScroll.value = root.scrollProgress),
          _this.shader.set("uRotation", _this.group.rotation.z),
          (_this.shader.uniforms.uUVScale.value.x = Stage.width > Stage.height ? 1 : 2),
          (_this.group.scale.x = Stage.width > Stage.height ? 0.75 : 0.32),
          (_this.group.scale.y = Stage.width > Stage.height ? 0.6 : 0.4),
          (_timeV += 0.025 * Render.HZ_MULTIPLIER),
          (_hoverV = Math.lerp(Global.LOGO_HOVERED ? 1 : 0, _hoverV, 0.025)),
          (_time.value = 2 * _hoverV + _timeV));
      });
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.shader = _this.initClass(
          Shader,
          AppState.createLocal({ name: "PhysicalShader", uniforms: _this.shaderUniforms }, !0),
        )),
        _this.shader.isFragment && _promises.push(_this.wait(_this.shader, "__ready")),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function Home(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "Home"),
      Inherit(_this, XComponent),
      (_this.fragName = "Home"),
      (_this.contexts = 'FragFXScene, "Home"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this._initFXScene(World.NUKE, null, {
          format: void 0,
          type: void 0,
          minFilter: void 0,
          magFilter: void 0,
          multiRenderTarget: void 0,
          mipmaps: void 0,
          screenQuad: void 0,
          vrMode: void 0,
          multisample: void 0,
          samplesAmount: void 0,
        }),
        (_this.refractionLayer = _this.initClass(
          FXLayer,
          AppState.createLocal({ name: "HomeRefraction" }, !0),
        )),
        _this.refractionLayer.isFragment &&
          _promises.push(_this.wait(_this.refractionLayer, "__ready")),
        (_this.refraction = _this.initClass(
          SnapshotFrame,
          AppState.createLocal({ texture: _this.refractionLayer }, !0),
        )),
        _this.refraction.isFragment && _promises.push(_this.wait(_this.refraction, "__ready")),
        ((_this.nuke || World.NUKE).paused = !0),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.camera = _this.layers.camera),
        (_this.uniforms = {
          uRGBStrength: { value: 1 },
          uVolumetricStrength: { value: 1 },
          uContrast: { value: new Vector2(1, 1) },
        }),
        _this.set("pane", _this.layers.pane),
        _this.set("camera", _this.layers.camera),
        _this.set("refraction", _this.refraction),
        _this.layers.camera.lock());
      let tweenTimeline = _this.createFragment(TweenTimeline),
        rotation = 0,
        baseRotation = Math.radians(-20),
        delta = new Vector2(),
        zero = new Vector2();
      ((_this.layers.scroll.text.alpha = 0),
        _this.listen("Global/loadFinished", async (_) => {
          _this.layers.scroll.out ||
            tween(_this.layers.scroll.text, { alpha: 0.6 }, 5e3, "easeInOutSine", 5e3);
        }),
        _this.startRender((_) => {
          if (null == _this.scrollProgress) return;
          let visibleV = _this.get("ViewController/visibleV");
          if (
            ((tweenTimeline.elapsed = _this.scrollProgress),
            tweenTimeline.update(),
            (_this.layers.camera.group.position.y = Math.range(
              _this.scrollProgress,
              0,
              1,
              40,
              Device.mobile.phone ? -11 : -7,
            )),
            (_this.layers.camera.group.position.z = Math.range(visibleV, 0, 1, -30, 5)),
            (_this.layers.camera.group.position.z -= 15 * (1 - _this.scrollProgress)),
            Device.mobile.phone && (_this.layers.camera.group.position.z += 5),
            (_this.layers.camera.position.y = Math.range(
              _this.scrollProgress,
              0,
              1,
              4.5,
              Device.mobile.phone ? 1 : 2.5,
            )),
            _this.scrollProgress > 0.2 &&
              (function animateOutScrollText() {
                _this.layers.scroll.out ||
                  ((_this.layers.scroll.out = !0),
                  tween(_this.layers.scroll.text, { alpha: 0 }, 500, "easeOutSine"));
              })(),
            !_this.layers.particles.layers)
          )
            return;
          let scrollTarget = Math.radians(90) - Math.radians(190 * _this.scrollProgress);
          (delta.lerp(Mouse.down ? Mouse.delta : zero, 0.07),
            (rotation += delta.x * (Device.mobile ? 0.0075 : 0.0025)),
            (_this.layers.particles.layers.particles.group.rotation.y =
              baseRotation + rotation + scrollTarget),
            (_this.layers.particles.layers.particles.shader.uniforms.uScroll.value =
              _this.scrollProgress),
            (_this.layers.particles.layers.particles.shader.uniforms.uVisible.value =
              Math.smoothStep(0, 0.92, visibleV)),
            Mouse.down &&
              (_this.layers.particles.layers.particles.shader.uniforms.uPulse.value = 0),
            (_this.layers.particles.layers.particles.shader.uniforms.uPulse.value += 0.001),
            (_this.layers.particles.layers.logo.position.y =
              _this.layers.camera.group.position.y + 4.5 - 0.6 * (1 - visibleV)),
            (_this.layers.particles.layers.logo.rotation.y =
              Math.radians(270) +
              2 * (rotation + scrollTarget) +
              Math.radians(210) * Math.pow(1 - visibleV, 1.2)),
            (_this.layers.particles.layers.logo.shader.uniforms.uVisible.value = Math.smoothStep(
              0.5,
              1,
              visibleV,
            )),
            _this.layers.particles.layers.particles.shader.uniforms.uLogoPos.value.copy(
              _this.layers.particles.layers.logo.position,
            ),
            (_this.layers.particles.layers.particles.shader.uniforms.uLogoPos.value.x += 1),
            (_this.layers.particles.layers.particles.shader.uniforms.uLogoPos.value.z += 2),
            (_this.layers.particles.layers.column.position.y =
              _this.layers.particles.layers.logo.position.y - 10),
            (_this.layers.particles.layers.column.rotation.y =
              1 * _this.layers.particles.layers.logo.rotation.y),
            (_this.layers.particles.layers.column.shader.uniforms.uVisible.value = Math.smoothStep(
              0.5,
              1,
              visibleV,
            )),
            (_this.layers.particles.layers.column2.position.y =
              _this.layers.particles.layers.logo.position.y - 10),
            (_this.layers.particles.layers.column2.rotation.y =
              1 * _this.layers.particles.layers.logo.rotation.y),
            (_this.layers.particles.layers.column2.shader.uniforms.uVisible.value = Math.smoothStep(
              0.5,
              1,
              visibleV,
            )),
            (_this.layers.particles.layers.logo.shader.uniforms.tRefraction.value =
              _this.refraction),
            (_this.layers.particles.layers.column.shader.uniforms.tRefraction.value =
              _this.refraction),
            (_this.layers.particles.layers.column2.shader.uniforms.tRefraction.value =
              _this.refraction),
            _this.set("rotationV", _this.layers.particles.layers.particles.group.rotation.y));
        }),
        (_this.onInit = async (_) => {
          (await _this.layers.particles.layout.getAllLayers(),
            _this.volumetricLight.addLight(_this.layers.particles.layers.logo));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.composite = _this.initClass(
          NukePass,
          AppState.createLocal({ shader: "HomeComposite", uniforms: _this.uniforms }, !0),
        )),
        _this.composite.isFragment && _promises.push(_this.wait(_this.composite, "__ready")),
        _this.nuke && (_this.composite.texture = _this.nuke.rttBuffer),
        (_this.volumetricLight = _this.initClass(
          FX.VolumetricLight,
          AppState.createLocal(
            {
              unique: "home",
              nuke: _this.nuke,
              dpr: 0.2,
              enabled: Tests.volumetricLight(),
            },
            !0,
          ),
        )),
        _this.volumetricLight.isFragment &&
          _promises.push(_this.wait(_this.volumetricLight, "__ready")),
        _this.volumetricLight.uniforms &&
          _this.composite.addUniforms(_this.volumetricLight.uniforms),
        (_this.composite.upload || _this.composite.pass) &&
          ((_this.nuke || World.NUKE).add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          ),
          ShaderUIL.add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          )),
        ((_this.nuke || World.NUKE).paused = !1),
        _this.initClass(
          StateInitializer,
          TubesInteraction,
          "tubes",
          {
            scene: "#x#_this.scene#x#",
            camera: "_this.camera",
            refraction: "_this.refraction",
          },
          { init: "#x#Tests.interactiveTubes()#x#" },
        ),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function HomeColumnShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "HomeColumnShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          tMap: {
            value: Utils3D.getTexture("assets/images/room/matcap-test.jpg"),
            getTexture: Utils3D.getRepeatTexture,
          },
          tRefraction: { value: null, getTexture: Utils3D.getRepeatTexture },
          tVideo: { value: null, getTexture: Utils3D.getRepeatTexture },
          uVisible: { value: 1 },
          uOffset: { value: 0 },
          uDirection: { value: 1 },
          uAlpha: { value: 1 },
          transparent: !0,
        }),
        (_this.onInit = async (_) => {
          let video = await _this.get("ViewController/video");
          _this.shader.uniforms.tVideo = video.uniform;
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function HomeLogoShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "HomeLogoShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          tMap: {
            value: Utils3D.getTexture("assets/images/room/matcap-test.jpg"),
            getTexture: Utils3D.getRepeatTexture,
          },
          tRefraction: { value: null, getTexture: Utils3D.getRepeatTexture },
          tVideo: { value: null, getTexture: Utils3D.getRepeatTexture },
          tNormal: { value: null, getTexture: Utils3D.getRepeatTexture },
          uVisible: { value: 0 },
          uFooter: { value: 0 },
          uAlpha: { value: 1 },
          uPhone: { value: Device.mobile.phone ? 1 : 0 },
          uScrollDelta: { value: 0 },
          uNormalScale: { value: 1 },
          transparent: !0,
        }),
        (_this.onInit = async (_) => {
          let video = await _this.get("ViewController/video");
          _this.shader.uniforms.tVideo = video.uniform;
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function JellyInstancer(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, Object3D),
      Inherit(_this, XComponent),
      (_this.fragName = "JellyInstancer"),
      (_this.contexts = "Component,Object3D"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      if (
        (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        Tests.hideChain())
      )
        return void (_this.mesh.visible = !1);
      let meshes = [],
        batch = _this.createFragment(MeshBatch);
      for (let i = 0; i < 4; i++) {
        let mesh = _this.mesh.clone();
        (reset(mesh),
          (mesh.position.y += Math.range(i, 0, 4, 30, -30)),
          (mesh.frustumCulled = !1),
          batch.add(mesh),
          meshes.push(mesh));
      }
      function reset(mesh) {
        ((mesh.position.x = Utils.headsTails(-1, 1) * Math.random(4, 12)),
          (mesh.position.z = Utils.headsTails(-1, 1) * Math.random(4, 12)),
          (mesh.position.y = Math.random(-10, -12)),
          mesh.scale.setScalar(Math.random(1.5, 3, 3)),
          (mesh.scale.y *= 1.5));
      }
      ((batch.frustumCulled = !1), (_this.mesh.visible = !1));
      let root1 = _this.findParent("Home"),
        root2 = _this.findParent("Footer");
      _this.startRender((_) => {
        _this.group.position.copy(_this.mesh.position);
        let root = root1 || root2;
        root &&
          null != root.scrollProgress &&
          ((batch.group.rotation.y =
            -root.scrollProgress * Math.radians(360) * 0.6 - 3e-5 * Render.TIME),
          meshes.forEach((mesh, i) => {
            ((mesh.shader.uniforms.uScroll.value = root.scrollProgress),
              root2 && (mesh.shader.uniforms.uDirection.value = 0),
              (mesh.position.y += 0.01),
              mesh.position.y > 60 && reset(mesh),
              (mesh.rotation.y =
                Math.radians(90) * i -
                root.scrollProgress * Math.radians(360) * 2 -
                5e-4 * Render.TIME));
          }));
      });
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function JellyShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "JellyShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          tRefraction: { value: null },
          tVideo: { value: null },
          uScroll: { value: 0 },
          uDirection: { value: 1 },
          uMouse: { value: new Vector2() },
          uReflection: { value: new Vector2(1, 1) },
        }),
        (_this.onInit = async (_) => {
          let refraction = await _this.get("Home/refraction");
          _this.shader.set("tRefraction", refraction);
          let video = await _this.get("ViewController/video");
          _this.shader.uniforms.tVideo = video.uniform;
        }),
        _this.startRender((_) => {
          _this.shader.uniforms.uMouse.value.lerp(Mouse.tilt, 0.1);
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function LoaderGLUI(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, XComponent),
      (_this.fragName = "LoaderGLUI"),
      (_this.contexts = "GLUIElement"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          addTo: "GLUI.Stage",
          _type: "UI",
          refName: "ui",
          children: [
            {
              width: 1e3,
              height: 1e3,
              bg: "#080808",
              _type: "glObject",
              refName: "visual",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let bgShader = _this.createFragment(Shader, "LoaderBGShader", {
        uColor: { value: new Color("#080808") },
        uBottom: { value: 0 },
        uProgress: { value: 0 },
        uBars: { value: Device.mobile.phone ? 24 : 20 },
        uVisible: { value: 1 },
        uMobile: { value: Device.mobile.phone ? 1 : 0 },
        uHeight: { value: 0.14 },
        uScrollDelta: { value: 0 },
        uAlpha: { value: 0 },
        transparent: !0,
      });
      (_this.visual.useShader(bgShader),
        _this.startRender((_) => {
          ((_this.visual.width = Stage.width),
            (_this.visual.height = Stage.height),
            (_this.visual.x = Stage.width / 2 - _this.visual.width / 2),
            (_this.visual.y = Stage.height / 2 - _this.visual.height / 2),
            (bgShader.uniforms.uProgress.value = Math.lerp(
              _this.progress,
              bgShader.uniforms.uProgress.value,
              0.02,
            )));
        }),
        (_this.visual.scale = Device.mobile ? 2 : 1),
        (_this.ui.alpha = 0),
        (_this.onInit = async (_) => {
          _this.flag("isReady", !0);
        }));
      ((_this.ready = async function () {
        (await _this.wait("isReady"),
          (_this.ui.alpha = 0),
          await _this.ui.tween({ alpha: 1 }, 500, "easeOutSine", 100).promise());
      }),
        (_this.animateOut = async function () {
          (bgShader.tween("uVisible", 0, 500, "easeInCubic"),
            await _this.ui.tween({ alpha: 0 }, 500, "easeInCubic").promise());
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function LoaderView(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "LoaderView"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          css: "position: absolute",
          size: "100%",
          setZ: 1e4,
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              font: "Space Grotesk",
              fontSize: 13,
              css: "textAlign: center, lineHeight: 1, letterSpacing: 0.1em, z-index: 100, position: absolute",
              fontColor: window.ACTIVE_THEME_COLORS
                ? window.ACTIVE_THEME_COLORS.primary
                : "#FFD700",
              _type: "div",
              _innerText: "000000000000000000000000000000000000",
              refName: "behind",
              children: [],
            },
            {
              font: "Space Grotesk",
              fontSize: 16,
              css: "textAlign: center, lineHeight: 1, letterSpacing: 0.1em, z-index: 100, position: absolute",
              fontColor: "#E0E0E0",
              _type: "div",
              _innerText: "0",
              refName: "text",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.text.size(220, 14).center().css({ textAlign: "center", opacity: 1 }),
        _this.behind.size(220, 220).center().css({ textAlign: "left", opacity: 0.4 }),
        _this.behind.css({
          maskImage: "radial-gradient(black 49%, transparent 50%)",
        }),
        (_this.text.percent = 0),
        _this.params.loader.add(2),
        _this.bind("FXScroll/firstScene", (_) => {
          _this.params.loader.trigger(1);
        }),
        _this.params.loader.add(1),
        _this.bind("ContactUI/ready", (_) => {
          _this.params.loader.trigger(1);
        }),
        _this.params.loader.add(1),
        _this.bind("NavUI/ready", (_) => {
          _this.params.loader.trigger(1);
        }),
        (_this.onInit = async (_) => {
          (await GPU.ready(),
            await World.instance().ready(),
            (_this.gluiLoader = _this.createFragment(LoaderGLUI)),
            await _this.gluiLoader.ready(),
            _this.params.loader.trigger(1));
        }));
      let tick = 0;
      _this.startRender((_) => {
        let text = "";
        for (var i = 0; i < 16; i++) {
          for (var j = 0; j < 30; j++) text += "/";
          text += "\n";
        }
        (tick++,
          (text = text.slice(0, Math.round(_this.text.percent * text.length))),
          text.length > 0
            ? _this.behind.html(
                (function replaceRandomLetters(str, numReplacements) {
                  let result = str.split("");
                  const replacementChars = Math.round(100 * _this.text.percent).toString();
                  for (let i = 0; i < numReplacements; i++) {
                    const randomPos = Math.floor(Math.random() * str.length),
                      randomChar = replacementChars.charAt(
                        Math.floor(Math.random() * replacementChars.length),
                      );
                    result[randomPos].includes([" ", " ", "\n", "?", ","]) ||
                      (result[randomPos] = randomChar);
                  }
                  return result.join("");
                })(text, tick % 2 == 0 ? 30 : 0),
              )
            : _this.behind.html(text));
      }, 12);
      let colors = window.ACTIVE_THEME_COLORS
        ? [window.ACTIVE_THEME_COLORS.primary, window.ACTIVE_THEME_COLORS.primary, "#E0E0E0"]
        : ["#FFD700", "#FFD700", "#E0E0E0"];
      (_this.startRender((_) => {
        _this.text.div.style.color = colors.random();
        let percent = Math.round(100 * _this.text.percent);
        (percent < 10 && (percent = "//" + percent),
          percent < 100 && (percent = "/" + percent),
          100 == percent && (percent = ">>>"),
          _this.text.text(`${percent}`));
      }, 24),
        _this.startRender((_) => {
          _this.gluiLoader && (_this.gluiLoader.progress = _this.text.percent);
        }),
        _this.bind(_this.params.loader, Events.PROGRESS, ({ percent: percent }) => {
          tween(_this.text, { percent: 0.9 * percent }, 500, "linear");
        }),
        _this.bind(_this.params.loader, Events.COMPLETE, async (_) => {
          (_this.behind.tween({ opacity: 0 }, 2e3, "easeOutSine"),
            _this.text.tween({ opacity: 0 }, 2e3, "easeInOutSine"),
            await tween(_this.text, { percent: 1 }, 300, "easeOutSine").promise(),
            await _this.gluiLoader.animateOut(),
            _this.fire("Global/loadFinished"),
            (function animateInScrollbar() {
              let obj = { opacity: 0 },
                root = document.documentElement;
              tween(obj, { opacity: 0.9 }, 2e3, "easeOutSine", 500).onUpdate(() => {
                root.style.setProperty("--baropacity", obj.opacity);
              });
            })(),
            _this.destroy());
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function LogoParticle(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Frag3D, "LogoParticle"),
      Inherit(_this, XComponent),
      (_this.fragName = "LogoParticle"),
      (_this.contexts = 'Frag3D, "LogoParticle"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.onInit = async (_) => {
          let video = await _this.get("ViewController/video");
          (await _this.layers.logo.ready(),
            (_this.layers.logo.shader.uniforms.tVideo = video.uniform),
            (_this.layers.logo.isReady = !0));
        }));
      let root = _this.findParent("TreeScene");
      _this.startRender((_) => {
        root &&
          root.scrollProgress &&
          _this.layers.logo &&
          _this.layers.logo.isReady &&
          (_this.layers.logo.shader.uniforms.uScroll.value = root.scrollProgress);
      });
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function MobileSync(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Component),
      Inherit(_this, MultiplayerEnvironment),
      Inherit(_this, XComponent),
      (_this.fragName = "MobileSync"),
      (_this.contexts = "Component,MultiplayerEnvironment"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.key = `atv6qr${Utils.uuid()}`));
      let isDesktop = !Device.mobile;
      function isDominant() {
        const otherplayer = _this.get("otherplayer", !0);
        if (!otherplayer) return;
        return !((otherplayer.state.lastaction || 0) > _this.get("lastaction", !0));
      }
      function onLastAction(e) {
        if (_this.fromSync) return;
        const now = +Date.now();
        (_this.set("lastaction", now), PlayerModel.set("lastaction", now));
      }
      (Utils.query("roomqr") && ((_this.key = Utils.query("roomqr")), (isDesktop = !1)),
        isDesktop &&
          (_this.qrcode = _this.createFragment(QRCode, {
            size: 110,
            key: _this.key,
          })),
        _this.set("qrcode", _this.qrcode),
        _this.set("otherplayer", !1),
        _this.set("lastaction", +Date.now()),
        (_this.otherx = 0),
        (_this.othery = 0),
        (_this.scroll = 0),
        _this.bind("otherplayer", (player) => {
          _this.qrcode && player && _this.set("ViewController/contact", !1);
        }),
        (_this.onConnection = (player) => {
          const { gcPlayer: gcPlayer } = player,
            { parent: parent } = gcPlayer;
          if (Multiplayer.room.id === parent.id) {
            if ((_this.set("otherplayer", player), isDesktop)) {
              let sm = _this.get("ViewController/scroll", !0);
              sm?.scrollTo?.(0, 0);
            } else onLastAction();
            (_this.set("ViewController/contact", !1),
              _this.bind("ViewController/contact", (open) => {
                (console.log("send contact"), _this.sendEvent("set_contact", open));
              }),
              _this.bindEvent("set_contact", (d) => {
                isDominant() ||
                  (console.log("set contact"), _this.set("ViewController/contact", d));
              }),
              _this.bind("Work/project", (open) => {
                (console.log("send work", open?.index),
                  _this.sendEvent("set_work", { index: open?.index }));
              }),
              _this.bindEvent("set_work", (work) => {
                if (isDominant()) return;
                const index = work?.index,
                  item = _this
                    .get("WorkItems/items", !0)
                    .toJSON()
                    .find((t) => t.index === index);
                (console.log("open item", index),
                  item
                    ? (_this.set("Work/project", item),
                      _this.set("WorkItems/videoURL", item.videoURL))
                    : _this.set("Work/project", null));
              }));
          }
        }),
        (_this.onDisconnection = (_) => {
          _this.set("otherplayer", !1);
        }),
        (_this.sendEvent = (key, data) => {
          Multiplayer.room && Multiplayer.room.broadcast({ data: data, type: key });
        }),
        (_this.bindEvent = (key, callback) => {
          Multiplayer.room &&
            Multiplayer.room.events.sub(
              Multiplayer.room.socket,
              SocketConnection.BINARY,
              ({ data: data }) => {
                try {
                  if ((data = data[0]).from === GameCenter.GCID) return;
                  data.type === key && callback(data.data);
                } catch (e) {
                  console.error(e);
                }
              },
            );
        }),
        (_this.wasDominant = !1),
        _this.startRender((_) => {
          let sm = _this.get("ViewController/scroll", !0);
          if (!sm) return;
          const scroll = sm.renderManager.controller.scroll,
            total = sm.renderManager.controller.totalHeight,
            scrollIndex = scroll / total,
            otherplayer = _this.get("otherplayer", !0);
          if (
            (PlayerModel.set("scroll", scrollIndex),
            PlayerModel.set("mousex", Mouse.x / Stage.width),
            PlayerModel.set("mousey", Mouse.y / Stage.height),
            PlayerModel.set("mousedown", Mouse.down ? 1 : 0),
            !otherplayer)
          )
            return;
          if (isDominant()) return void (_this.wasDominant = !0);
          _this.fromSync = !0;
          const otherscroll = otherplayer.state.scroll;
          ((_this.scroll = otherscroll), sm.scrollTo(_this.scroll * total, 0));
          const x = otherplayer.state.mousex * Stage.width,
            y = otherplayer.state.mousey * Stage.height;
          ((_this.otherx = Math.lerp(x, _this.otherx, 0.1)),
            (_this.othery = Math.lerp(y, _this.othery, 0.1)));
          let uniforms = _this.get("ViewController/uniforms"),
            moved = Math.abs(_this.otherx - x) + Math.abs(_this.othery - y);
          ((uniforms.uSyncTouch.value = Math.lerp(
            Math.min(2, moved),
            uniforms.uSyncTouch.value,
            0.1,
          )),
            (function simulateMouseEvent(type, x, y) {
              const element = window,
                mouseEvent = new MouseEvent(type, {
                  screenX: 0,
                  screenY: 0,
                  clientX: parseInt(x) || 0,
                  clientY: parseInt(y) || 0,
                  view: window,
                  cancelable: !0,
                  bubbles: !0,
                });
              element.dispatchEvent(mouseEvent);
            })("mousemove", _this.otherx, _this.othery),
            (function simulateTouchEvent(type, touches) {
              const touchEvents = [],
                element = window;
              (touches.forEach((touch) => {
                touchEvents.push(
                  new Touch({
                    clientX: parseInt(touch.x) || 0,
                    clientY: parseInt(touch.y) || 0,
                    identifier: touch.id,
                    target: element,
                  }),
                );
              }),
                element.dispatchEvent(
                  new TouchEvent(type, {
                    touches: touchEvents,
                    view: window,
                    cancelable: !0,
                    bubbles: !0,
                  }),
                ));
            })("touchmove", [{ x: _this.otherx, y: _this.othery, id: 0 }]),
            (_this.fromSync = !1));
        }),
        (_this.onInit = function () {
          ((_this.input = new Interaction(__window)),
            (_this.input.unlocked = !0),
            _this.events.sub(_this.input, Interaction.START, onLastAction),
            _this.events.sub(_this.input, Interaction.MOVE, onLastAction),
            _this.events.sub(Keyboard.DOWN, onLastAction),
            __window.bind("wheel", onLastAction));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.ref_MultiplayerConfig895 = _this.initClass(
          MultiplayerConfig,
          AppState.createLocal(
            {
              server: "wss://s.dreamwave.network/ws",
              roomKey: _this.key,
              playerClass: "ScrollPlayer",
              maxInRoom: 2,
            },
            !0,
          ),
        )),
        _this.ref_MultiplayerConfig895.isFragment &&
          _promises.push(_this.wait(_this.ref_MultiplayerConfig895, "__ready")),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function MusicPlayerDOM(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "MusicPlayerDOM"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          addTo: "Stage",
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "div",
              refName: "wrapper",
              children: [
                {
                  "aria-label": "Previous Song",
                  click: "$goPrev",
                  _type: "button",
                  refName: "arrowL",
                  children: [
                    {
                      _type: "p",
                      _innerText: "<<",
                      refName: "textL",
                      children: [],
                    },
                  ],
                },
                {
                  _type: "div",
                  refName: "ticker",
                  children: [
                    {
                      _type: "div",
                      _innerText: "Song--Artist",
                      refName: "tickerItem0",
                      children: [],
                    },
                    {
                      _type: "div",
                      _innerText: "Song--Artist",
                      refName: "tickerItem1",
                      children: [],
                    },
                  ],
                },
                {
                  "aria-label": "Next Song",
                  click: "$goNext",
                  _type: "button",
                  refName: "arrowR",
                  children: [
                    {
                      _type: "p",
                      _innerText: ">>",
                      refName: "textR",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        GlobalAudio3D.setup(),
        (_this.sfx = SFXController.instance()));
      let SONGS = [
        {
          title: "ACIDO III (Super Slowed)",
          src: "assets/music/ACIDO III (Super Slowed).mp3",
        },
        {
          title: "As Tequileiras do Funk - Bass Da Da Da (Sentadão)",
          src: "assets/music/As Tequileiras do Funk - Bass Da Da Da (Sentadão).mp3",
        },
        {
          title: "BIA - WE ON GO",
          src: "assets/music/BIA - WE ON GO.mp3",
        },
        {
          title: "Dracula (JENNIE Remix)",
          src: "assets/music/Dracula (JENNIE Remix).mp3",
        },
        {
          title: "Majboor",
          src: "assets/music/Majboor.mp3",
        },
        {
          title: "Sua amiga eu vou pegar",
          src: "assets/music/Sua amiga eu vou pegar.mp3",
        },
        {
          title: "Trinidad Cardona - Love Me Back",
          src: "assets/music/Trinidad Cardona - Love Me Back.mp3",
        },
        {
          title: "X-COOL!",
          src: "assets/music/X-COOL!.mp3",
        },
      ];
      ((SONGS = SONGS.shuffle()),
        (_this.goPrev = (_) =>
          _this.set("songIndex", (_this.get("songIndex") - 1 + SONGS.length) % SONGS.length)),
        (_this.goNext = (_) => _this.set("songIndex", (_this.get("songIndex") + 1) % SONGS.length)),
        (function setup() {
          SONGS.forEach((song) => _this.sfx.registerSound(song.title, Assets.getPath(song.src)));
        })(),
        _this.set("readyToShow", 0),
        _this.listen(GlobalAudio3D, Events.READY, () => {
          (_this.bind("songIndex", (index) => {
            (_this.ticker.tween({ opacity: 0 }, 100, "easeInSine").onComplete((_) => {
              (_this.tickerItem0.text(index + 1 + ". " + SONGS[index].title),
                _this.tickerItem1.text(index + 1 + ". " + SONGS[index].title),
                _this.ticker.tween({ opacity: 0.5 }, 1e3, "easeOutSine", 200));
            }),
              SONGS.forEach((song) => _this.sfx.stop(song.title)),
              _this.sfx.play(SONGS[index].title));
          }),
            Storage.get("muted") ? (_this.sfx.muted = !0) : (_this.sfx.muted = !1),
            (GlobalAudio3D.volume = 0.5),
            _this.set("Global/audioEnabled", _this.sfx.muted ? 0 : 1),
            (GlobalAudio3D.muted = _this.sfx.muted),
            _this.set("readyToShow", _this.get("readyToShow") + 1));
        }),
        window.addEventListener(
          "mousedown",
          () => {
            if (window.Audio3DWA && Audio3DWA.audioContext) {
              let ctx = Audio3DWA.audioContext();
              if (ctx && ctx.state === "suspended") ctx.resume();
            }
            if (window.GlobalAudio3D) {
              GlobalAudio3D.muted = false;
              GlobalAudio3D.volume = 0.5;
            }
          },
          { once: true },
        ),
        _this.set("songIndex", Math.random(0, SONGS.length - 1)),
        _this.bind("Global/audioEnabled", (enabled) => {
          _this.visible &&
            (Storage.set("muted", !enabled),
            tween(GlobalAudio3D, { volume: enabled ? 0.15 : 0 }, 500, "easeOutSine"),
            2 !== enabled && _this.events.fire(SFXController.TOGGLE_AUDIO),
            _this.wrapper.tween({ opacity: enabled ? 0.8 : 0 }, 500, "easeOutSine"));
        }),
        (_this.wrapper.div.style.opacity = 0),
        _this.listen("Global/loadFinished", (_) =>
          _this.set("readyToShow", _this.get("readyToShow") + 1),
        ),
        _this.bind("readyToShow", (ready) => {
          2 === ready &&
            ((_this.visible = !0),
            _this.wrapper.css({ opacity: 0 }).transform({ y: -100 }),
            _this.wrapper.tween(
              { opacity: _this.sfx.muted ? 0 : 0.8, y: 0 },
              2e3,
              "easeOutCubic",
              1500,
            ));
        }),
        _this.bind("Work/project", (data, prevData) => {
          data
            ? GlobalAudio3D.events.fire(Events.MESSAGE, { isMuffled: !0 })
            : prevData && GlobalAudio3D.events.fire(Events.MESSAGE, { isMuffled: !1 });
        }),
        _this.startRender((_) => {
          for (const title in _this.sfx.activeSounds)
            if (_this.sfx.activeSounds[title].length) return;
          _this.goNext();
        }, 5),
        _this.element.goob(
          '\n    .wrapper {\n        display: flex;\n        flex-direction: row;\n        justify-content: space-between;\n        align-items: center;\n        mix-blend-mode: plus-lighter;\n\n        position: fixed;\n        top: 70px;\n        right: 32px;\n        margin: 2.6rem 2.6rem;\n        @media (max-width: 768px) {\n            top: 55px;\n            margin: 2rem 2rem;\n        }\n        z-index: 3;\n        padding: 10px 4px;\n        pointer-events: none;\n        border: 1px solid rgba(255,255,255,0.1);\n        background-color: rgba(255,255,255,0.1);\n\n        width: 170px;\n        height: 42px;\n        background-color: transparent;\n        border-radius: 7px;\n        opacity: 0;\n\n        transition: all 0.4s ease-out;\n        &:hover {\n            opacity: 1;\n        }\n    }\n\n    button {\n        width: 36px;\n        height: 32px;\n        pointer-events: auto;\n        cursor: pointer;\n        background-color: rgba(255,255,255,0.1);\n        border-radius: 5px;\n        border: 1px solid rgba(255,255,255,0.6);\n        mix-blend-mode: color-dodge;\n\n        font-family: "Aquatico", sans-serif;\n        font-size: 14px;\n        font-weight: 700;\n        color: white;\n\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        opacity: 0.3;\n        transition: all 0.4s ease-out;\n        &:hover {\n            opacity: 1;\n        }\n    }\n\n    @keyframes ticker {\n        0% {\n            -webkit-transform: translate3d(0, 0, 0);\n            transform: translate3d(0, 0, 0);\n            visibility: visible;\n        }\n      \n        100% {\n            -webkit-transform: translate3d(-100%, 0, 0);\n            transform: translate3d(-100%, 0, 0);\n        }\n    }\n    .ticker {\n        display: inline-block;\n        height: 30px;\n        line-height: 30px;\n        width: 80px;\n        overflow: hidden;\n        background-color: transparent;\n        white-space: nowrap;\n        opacity: 0.4;\n        box-sizing: content-box;\n        mix-blend-mode: color-dodge;\n\n        > * {\n            display: inline-block;\n            height: 30px;\n            margin: 0;\n\n            animation-iteration-count: infinite;\n            animation-timing-function: linear;\n            animation-name: ticker;\n            animation-duration: 9s;\n\n            padding: 0 0.8rem;\n            font-family: "Aquatico", sans-serif;\n            font-size: 10px;\n            font-weight: 400;\n            color: white;\n        }\n    }\n    \n',
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function NavUI(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, Initialization),
      Inherit(_this, XComponent),
      (_this.fragName = "NavUI"),
      (_this.contexts = "GLUIElement,Initialization"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          addTo: "GLUI.Stage",
          _type: "UI",
          refName: "ui",
          children: [
            {
              font: "Aquire",
              fontSize: 12,
              fontColor: "#E0E0E0",
              _type: "glText",
              _innerText: "Achievements",
              refName: "title",
              children: [],
            },
            {
              width: 120,
              height: 40,
              bg: "#ff0000",
              alpha: 0.001,
              _type: "glObject",
              refName: "titleHit",
              children: [],
            },
            {
              width: 60,
              height: 40,
              bg: "#ffffff",
              alpha: 1,
              _type: "glObject",
              refName: "audio",
              children: [],
            },
            {
              width: 320,
              height: 320,
              bg: "#080808",
              _type: "glObject",
              refName: "bg",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.onInit = async function () {
          (await _this.initSync(_this.ui.group),
            await _this.initSync(_this.ui),
            _this.set("ready", !0));
        }));
      let bgShader = _this.createFragment(Shader, "NavBGShader", {
        uColor: { value: new Color("#080808") },
        uBottom: { value: 0 },
        uDisabled: { value: 0 },
        uScroll: { value: 0 },
        uHeight: { value: 0.14 },
        uScrollDelta: { value: 0 },
        uUIColor: { value: new Color() },
        uUIBlend: { value: 0 },
      });
      _this.bg.useShader(bgShader);
      let audioShader = _this.createFragment(Shader, "NavAudioShader", {
        uColor: { value: new Color("#ffffff") },
        uScroll: { value: 0 },
        uAmplitude: { value: 0 },
        uAlpha: { value: 0 },
        uHover: { value: 0 },
      });
      (_this.audio.useShader(audioShader),
        GLA11y.registerPage(_this.ui.group, "NavigationUI"),
        GLA11y.objectNode(_this.audio, _this.ui.group),
        _this.audio.interact(
          function hover(e) {
            switch (e.action) {
              case "over":
                audioShader.tween("uHover", 1, 300, "easeOutSine");
                break;
              case "out":
                audioShader.tween("uHover", 0, 500, "easeOutSine");
            }
          },
          function click() {
            let toggle = !_this.get("Global/audioEnabled");
            _this.set("Global/audioEnabled", toggle);
          },
          "#",
          "Toggle Audio",
        ),
        _this.titleHit.interact(
          function hover(e) {
            switch (e.action) {
              case "over":
                _this.title.tween({ alpha: 0.7 }, 200, "easeOutSine");
                break;
              case "out":
                _this.title.tween({ alpha: 1 }, 400, "easeOutSine");
            }
          },
          function click() {
            _this.set("ViewController/contact", !1);
            _this.fire("navigate", "work");
            _this.fire("ViewController/goToWork");
            _this.set("Work/project", null);
          },
          "#",
          "Achievements",
        ),
        _this.set("Global/audioEnabled", !1),
        (_this.ui.alpha = 0.001),
        _this.listen("Global/loadFinished", (_) => {
          (_this.ui.tween({ alpha: 1 }, 2e3, "easeInOutSine", 1e3),
            audioShader.tween("uAlpha", 1, 2e3, "easeInOutSine"));
        }),
        _this.bind("Global/audioEnabled", (enabled) => {
          audioShader.tween("uAmplitude", !Tests.noMusic() && enabled ? 1 : 0, 500, "easeOutCubic");
        }),
        _this.startRender(async (_) => {
          let scrolled = await _this.get("ViewController/scrollV", !0),
            delta = await _this.get("ViewController/scrollDeltaV", !0);
          ((bgShader.uniforms.uScroll.value = scrolled),
            (bgShader.uniforms.uScrollDelta.value = delta),
            (audioShader.uniforms.uScroll.value = scrolled),
            (_this.title.x = _this.bg.x + 70),
            (_this.title.y =
              _this.bg.y + 0.475 * _this.bg.height + 4.5 * bgShader.uniforms.uScrollDelta.value),
            (_this.titleHit.x = _this.title.x),
            (_this.titleHit.y = _this.title.y),
            (_this.audio.x = _this.bg.x + 0.5 * _this.bg.width - _this.audio.width / 2 + 70),
            (_this.audio.y =
              _this.bg.y +
              0.475 * _this.bg.height +
              4.5 * bgShader.uniforms.uScrollDelta.value -
              12),
            Tests.noMusic() &&
              ((_this.title.x -= 8),
              (_this.audio.width = 30),
              (_this.audio.alpha = 0.6),
              (_this.audio.x -= 2)));
        }),
        _this.onResize(function updateLayout() {
          ((_this.bg.width = Tests.noMusic() ? 300 : 340),
            Device.mobile
              ? ((_this.bg.x = Stage.width - _this.bg.width - 0 + 20),
                (_this.bg.y = 0.3 * -_this.bg.height - 10))
              : ((_this.bg.x = Stage.width - _this.bg.width - 0 + 10),
                (_this.bg.y = 0.25 * -_this.bg.height - 15)));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function NavUILeft(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, Initialization),
      Inherit(_this, XComponent),
      (_this.fragName = "NavUILeft"),
      (_this.contexts = "GLUIElement,Initialization"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          addTo: "GLUI.Stage",
          _type: "UI",
          refName: "ui",
          children: [
            {
              font: "Aquire",
              fontSize: 12,
              fontColor: "#E0E0E0",
              _type: "glText",
              _innerText: "Back",
              refName: "title",
              children: [],
            },
            {
              width: 120,
              height: 40,
              bg: "#ff0000",
              alpha: 0.001,
              _type: "glObject",
              refName: "titleHit",
              children: [],
            },
            {
              width: 400,
              height: 320,
              bg: "#080808",
              _type: "glObject",
              refName: "bg",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.onInit = async function () {
          (await _this.initSync(_this.ui.group),
            await _this.initSync(_this.ui),
            _this.set("ready", !0));
        }));
      let bgShader = _this.createFragment(Shader, "NavBGShader", {
        uColor: { value: new Color("#080808") },
        uBottom: { value: 0 },
        uDisabled: { value: 0 },
        uScroll: { value: 0 },
        uHeight: { value: 0.14 },
        uScrollDelta: { value: 0 },
        uUIColor: { value: new Color() },
        uUIBlend: { value: 0 },
      });
      _this.bg.useShader(bgShader);
      let audioShader = _this.createFragment(Shader, "NavAudioShader", {
        uColor: { value: new Color("#ffffff") },
        uScroll: { value: 0 },
        uAmplitude: { value: 0 },
        uAlpha: { value: 0 },
        uHover: { value: 0 },
      });

      (GLA11y.registerPage(_this.ui.group, "NavigationUILeft"),
        _this.titleHit.interact(
          function hover(e) {
            switch (e.action) {
              case "over":
                _this.title.tween({ alpha: 0.7 }, 200, "easeOutSine");
                break;
              case "out":
                _this.title.tween({ alpha: 1 }, 400, "easeOutSine");
            }
          },
          function click() {
            window.location.href = "/";
          },
          "#",
          "Back to Portfolio",
        ),
        (_this.ui.alpha = 0.001),
        _this.listen("Global/loadFinished", (_) => {
          (_this.ui.tween({ alpha: 1 }, 2e3, "easeInOutSine", 1e3),
            audioShader.tween("uAlpha", 1, 2e3, "easeInOutSine"));
        }),
        _this.startRender(async (_) => {
          let scrolled = await _this.get("ViewController/scrollV", !0),
            delta = await _this.get("ViewController/scrollDeltaV", !0);
          ((bgShader.uniforms.uScroll.value = scrolled),
            (bgShader.uniforms.uScrollDelta.value = delta),
            (audioShader.uniforms.uScroll.value = scrolled),
            (_this.title.x = _this.bg.x + 70),
            (_this.title.y =
              _this.bg.y + 0.475 * _this.bg.height + 4.5 * bgShader.uniforms.uScrollDelta.value),
            (_this.titleHit.x = _this.title.x),
            (_this.titleHit.y = _this.title.y));
        }),
        _this.onResize(function updateLayout() {
          ((_this.bg.width = 250),
            Device.mobile
              ? ((_this.bg.x = -20), (_this.bg.y = 0.3 * -_this.bg.height - 10))
              : ((_this.bg.x = -10), (_this.bg.y = 0.25 * -_this.bg.height - 15)));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function NavUIItem(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, XComponent),
      (_this.fragName = "NavUIItem"),
      (_this.contexts = "GLUIElement"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "wrapper",
          children: [
            {
              width: 60,
              height: 30,
              bg: "#ff0000",
              _type: "glObject",
              refName: "hit",
              children: [],
            },
            {
              font: "Aquatico",
              fontSize: 12,
              fontColor: "#E0E0E0",
              _type: "glText",
              _innerText: "_",
              refName: "text",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.hit.alpha = 0),
        (_this.hit.y = -10),
        (_this.hit.x = -10),
        await _this.wait((_) => _this.parent.ui.group.seo),
        GLA11y.objectNode(_this.hit, _this.parent.ui.group),
        _this.hit.interact(
          function hover(e) {
            switch (e.action) {
              case "over":
                _this.text.tween({ alpha: 0.7 }, 200, "easeOutSine");
                break;
              case "out":
                _this.text.tween({ alpha: 1 }, 400, "easeOutSine");
            }
          },
          click,
          "#",
          _this.params.text,
        ));
      let link = _this.params.text.toLowerCase();
      "contact" == link &&
        (_this.events.sub(Keyboard.DOWN, async (e) => {
          e && e.key && e.key.toLowerCase().includes(["x", "escape"]) && active && click();
        }),
        _this.bind("ViewController/contact", (a) => {
          active = a;
        }));
      let active = !1;
      function click() {
        "contact" == link
          ? active
            ? _this.set("ViewController/contact", !1)
            : _this.set("ViewController/contact", !0)
          : (_this.set("ViewController/contact", !1),
            _this.fire("navigate", "work"),
            _this.fire("ViewController/goToWork"),
            _this.set("Work/project", null));
      }
      _this.startRender((_) => {
        let delta = _this.get("ViewController/scrollDeltaV");
        _this.text.setText(
          (function replaceRandomLetters(str, numReplacements) {
            let result = str.split("");
            for (let i = 0; i < numReplacements; i++) {
              const randomPos = Math.floor(Math.random() * str.length),
                randomChar = "1234567890".charAt(Math.floor(10 * Math.random()));
              result[randomPos].includes([" ", "/", "?", ",", "."]) ||
                (result[randomPos] = randomChar);
            }
            return result.join("");
          })(
            active ? "CLOSE-X" : _this.params.text,
            Math.floor(0.2 * delta) + 0.1 * Math.smoothStep(1, 0.7, _this.text.alpha),
          ),
        );
      }, 12);
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function PBRCapture(_input, _group) {
    const _this = this;
    (Inherit(_this, Object3D),
      Inherit(_this, XComponent),
      (_this.fragName = "PBRCapture"),
      (_this.contexts = "Object3D"),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let [input, appState] = _this.createUIL(
        "pbrcapture_" + _this.uilInput.prefix,
        _this.uilFolder,
      );
      ((_this.input = input),
        _this.input.setLabel("PBR Capture"),
        _this.input.addButton("save", {
          label: "Save",
          actions: [
            {
              title: "Save",
              callback: function save() {
                let scene = World.SCENE,
                  p = _this.group._parent;
                for (; p; ) (p instanceof Scene && (scene = p), (p = p._parent));
                (cube.render(scene), equi.render(), equi.toBlob());
              },
            },
          ],
        }));
      let cube = new CubeCamera(0.1, 100, 2048);
      _this.add(cube);
      let equi = new CubemapToEquirectangular(2048, cube);
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ParticleTest(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Frag3D, "ParticleTest"),
      Inherit(_this, XComponent),
      (_this.fragName = "ParticleTest"),
      (_this.contexts = 'Frag3D, "ParticleTest"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.onInit = async (_) => {
          let video = await _this.get("ViewController/video");
          ((_this.layers.video.shader.uniforms.tMap = video.uniform),
            (_this.layers.bg.shader.uniforms.tMap = video.uniform),
            (_this.layers.logo.shader.uniforms.tVideo = video.uniform),
            await _this.layers.particles.ready(),
            (_this.layers.particles.shader.uniforms.tVideo = video.uniform));
          let attenuation = 1;
          (Tests.particleCount() <= 16384
            ? (attenuation = 1.6)
            : Tests.particleCount() <= 65536
              ? (attenuation = 1.4)
              : Tests.particleCount() <= 262144 && (attenuation = 1.2),
            Device.mobile.phone && (attenuation *= 0.9),
            _this.layers.particles.shader.addUniforms({
              uSizeBias: { value: attenuation },
            }));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ScrollPlayer(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, PlayerView),
      Inherit(_this, XComponent),
      (_this.fragName = "ScrollPlayer"),
      (_this.contexts = "PlayerView"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function SpineInstancer(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, Object3D),
      Inherit(_this, XComponent),
      (_this.fragName = "SpineInstancer"),
      (_this.contexts = "Component,Object3D"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let batch = _this.createFragment(MeshBatch),
        meshes = [];
      for (let i = 0; i < 40; i++) {
        let mesh = _this.mesh.clone();
        (mesh.position.set(0, 0, 0),
          (mesh.position.y = -0.65 * i + 4),
          (mesh.rotation.y = 0.4 * i),
          batch.add(mesh),
          meshes.push(mesh));
      }
      ((_this.mesh.visible = !1),
        _this.startRender((_) => {
          _this.group.position.copy(_this.mesh.position);
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function SpineShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "SpineShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          tRefraction: { value: null },
          uReflection: { value: new Vector2(1, 1) },
        }));
      let refraction = await _this.get("Work/refraction");
      _this.shader.set("tRefraction", refraction);
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function Tests() {
    const _this = this;
    (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "Tests"),
      (_this.contexts = "Component"),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.getDPR = (_) =>
          GPU.OVERSIZED
            ? 0.8
            : GPU.lt(0)
              ? 0.9
              : GPU.lt(1) || GPU.lt(2)
                ? Math.min(Device.pixelRatio, 1)
                : GPU.lt(3)
                  ? Math.min(Device.pixelRatio, 1.25)
                  : GPU.lt(4)
                    ? Math.max(1.5, Math.min(Device.pixelRatio, 1.5))
                    : GPU.lt(5)
                      ? Math.max(1.5, Math.max(Device.pixelRatio, 2))
                      : GPU.mobileLT(0)
                        ? 1
                        : GPU.mobileLT(1) || GPU.mobileLT(2)
                          ? Math.min(Device.pixelRatio, 1)
                          : GPU.mobileLT(3)
                            ? Math.min(Device.pixelRatio, 1.25)
                            : GPU.mobileLT(4)
                              ? Math.min(Device.pixelRatio, 1.5)
                              : GPU.mobileLT(5)
                                ? Math.min(Device.pixelRatio, 1.75)
                                : 1),
        (_this.capFPS = (_) =>
          GPU.lt(2) || GPU.mobileLT(2)
            ? 30.001
            : GPU.lt(3)
              ? Render.REFRESH_RATE > 60
                ? 60.001
                : null
              : Device.mobile && GPU.mobileLT(3) && Render.REFRESH_RATE > 100
                ? 100.001
                : null),
        (_this.renderFXAA = (_) => (
          !1 !== _this.msaaSamples() || GPU.lt(1) || GPU.mobileLT(2),
          !1
        )),
        (_this.noMusic = (_) => !!Device.mobile),
        (_this.enableWorldNukeMSAA = (_) => !1),
        (_this.videoVFX = (_) => !0),
        (_this.msaaSamples = (_) => 4),
        (_this.particleCount = (_) =>
          GPU.mobileLT(2)
            ? 16384
            : GPU.mobileLT(4)
              ? 65536
              : GPU.mobileLT(5)
                ? 262144
                : GPU.lt(2)
                  ? 16384
                  : GPU.lt(3)
                    ? 65536
                    : GPU.lt(4)
                      ? 524288
                      : 1048576),
        (_this.flowerParticleCount = (_) =>
          GPU.mobileLT(3)
            ? 16384
            : GPU.mobileLT(4)
              ? 65536
              : GPU.mobileLT(5)
                ? 262144
                : GPU.lt(2)
                  ? 16384
                  : GPU.lt(3)
                    ? 65536
                    : GPU.lt(4)
                      ? 262144
                      : 524288),
        (_this.detailParticleCount = (_) =>
          GPU.mobileLT(2)
            ? 16384
            : GPU.mobileLT(4)
              ? 65536
              : GPU.lt(2)
                ? 16384
                : GPU.lt(3)
                  ? 65536
                  : 262144),
        (_this.logoParticleCount = (_) => (GPU.mobileLT(3) || GPU.lt(2) ? 16384 : 65536)),
        (_this.hideChain = (_) => !!GPU.mobileLT(4) || !!GPU.lt(2)),
        (_this.lensStreak = (_) => !GPU.lt(3) && !GPU.mobileLT(3)),
        (_this.pingPongRender = (_) =>
          _this.capFPS() < 40 ? GPU.lt(0) || GPU.mobileLT(1) : !!GPU.lt(3) || !!GPU.mobileLT(3)),
        (_this.bloom = (_) => !GPU.lt(3) && !GPU.mobileLT(3)),
        (_this.volumetricLight = (_) =>
          !!Device.graphics.webgl.webgl2 && !GPU.lt(2) && !GPU.mobileLT(2)),
        (_this.interactiveTubes = (_) => !!_this.volumetricLight()));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }, "static"),
  Class(function TreeFBR(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "TreeFBR"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({ uScroll: { value: 1 } }),
        (_this.onInit = async (_) => {
          if (!Global.PLAYGROUND) {
            let video = await _this.get("ViewController/video");
            _this.shader.uniforms.tVideo = video.uniform;
          }
        }));
      let root = _this.findParent("TreeScene");
      (_this.startRender((_) => {
        root &&
          null != root.scrollProgress &&
          (_this.shader.uniforms.uScroll.value = root.scrollProgress);
      }),
        _this.layers.camera && _this.layers.camera.lock());
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function TreeMirror(_input, _group) {
    const _this = this;
    (Inherit(_this, Object3D),
      Inherit(_this, XComponent),
      (_this.fragName = "TreeMirror"),
      (_this.contexts = "Object3D"),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        await _this.waitLayers());
      let mirror = _this.createFragment(FX.Mirror, _this.layers.water.mesh, {
        size: 1024,
      });
      mirror.start();
      for (let key in _this.layers)
        _this.layers[key].shader && (console.log(key), mirror.add(_this.layers[key]));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function TreeScene(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "TreeScene"),
      Inherit(_this, XComponent),
      (_this.fragName = "TreeScene"),
      (_this.contexts = 'FragFXScene, "TreeScene"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this._initFXScene(World.NUKE, null, {
          format: void 0,
          type: void 0,
          minFilter: void 0,
          magFilter: void 0,
          multiRenderTarget: void 0,
          mipmaps: void 0,
          screenQuad: void 0,
          vrMode: void 0,
          multisample: void 0,
          samplesAmount: void 0,
        }),
        ((_this.nuke || World.NUKE).paused = !0),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.uniforms = {
          uRGBStrength: { value: 1 },
          uContrast: { value: new Vector2(1, 1) },
        }),
        _this.startRender((_) => {
          null != _this.scrollProgress &&
            ((_this.layers.wrapper.rotation.y =
              Math.radians(180) + Math.radians(-60) * (-0.5 + _this.scrollProgress)),
            (_this.layers.camera.position.z =
              (Device.mobile ? 40 : 35) - 15 * _this.scrollProgress),
            (_this.layers.cables.shader.uniforms.uLight.value.x = -0.5 + _this.scrollProgress));
        }),
        (_this.onInit = async (_) => {}));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.composite = _this.initClass(
          NukePass,
          AppState.createLocal({ shader: "TreeSceneComposite", uniforms: _this.uniforms }, !0),
        )),
        _this.composite.isFragment && _promises.push(_this.wait(_this.composite, "__ready")),
        _this.nuke && (_this.composite.texture = _this.nuke.rttBuffer),
        (_this.composite.upload || _this.composite.pass) &&
          ((_this.nuke || World.NUKE).add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          ),
          ShaderUIL.add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          )),
        ((_this.nuke || World.NUKE).paused = !1),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function TreeWaterShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "TreeWaterShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          tWaterNormal: { value: null, getTexture: Utils3D.getRepeatTexture },
          uSpeed: { value: 1 },
          uScale: { value: 1 },
          uWaterUVStrength: { value: 1 },
          uBrightness: { value: 1 },
        }));
      let mirror = _this.createFragment(FX.Mirror, _this.mesh, { size: 1024 });
      (mirror.start(),
        (_this.onInit = async (_) => {
          let video = await _this.get("ViewController/video");
          ((_this.shader.uniforms.tVideo = video.uniform), await _this.waitLayers());
          for (let key in _this.layers) {
            if ("water" == key) continue;
            let layer = _this.layers[key];
            ("logo_particle" == key &&
              ((layer = layer.layers.logo), await layer.ready(), (layer = layer.mesh)),
              layer.shader && layer.clone && mirror.add(layer));
          }
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function TriangleInstance(_proton, _group, _input) {
    const _this = this;
    (Inherit(_this, Component),
      Inherit(_this, Object3D),
      Inherit(_this, XComponent),
      (_this.fragName = "TriangleInstance"),
      (_this.contexts = "Component,Object3D"),
      (_this.proton = _proton),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.proton = _proton),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let geom = (function createEquilateralTriangleGeometry(sideLength) {
        const height = (sideLength * Math.sqrt(3)) / 2,
          vertices = new Float32Array([0, height, 0, -sideLength / 2, 0, 0, sideLength / 2, 0, 0]),
          geometry = new Geometry();
        return (
          geometry.addAttribute("position", new GeometryAttribute(vertices, 3)),
          geometry.computeVertexNormals(),
          geometry
        );
      })(0.5);
      _this.proton.applyToInstancedGeometry(geom);
      let shader = _this.createFragment(Shader, "TriangleParticleShader", {}),
        mesh = new Mesh(geom, shader);
      _this.add(mesh);
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function TubeController(_proton, _group, _input) {
    const _this = this;
    (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "TubeController"),
      (_this.contexts = "Component"),
      (_this.proton = _proton),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.proton = _proton),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.proton.tubes.useColor());
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function TubePlayer(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, PlayerView2),
      Inherit(_this, XComponent),
      (_this.fragName = "TubePlayer"),
      (_this.contexts = "PlayerView2"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      const move = new Group(),
        pos = move.position,
        camera = _this.params.camera,
        tubes = _this.params.proton.tubes,
        velocity = _this.createFragment(VelocityTracker, pos),
        velVec = new Vector3();
      _this.params.local &&
        _this.setPlayerData(
          "color",
          (function getColor() {
            let hue = Math.random(0, 1, 4),
              color = new Color(),
              hsl = new ColorHSL(hue, 0.5, 0.6);
            return (color.setHSL(hsl), color.getHexString());
          })(),
        );
      let color = new Color();
      (_this.bind(_this.state, "color", (value) => {
        color.set(value);
      }),
        _this.bindLink && _this.bindLink(move, "move"));
      let pos2 = new Vector3(),
        dist = new Vector3();
      (_this.startRender((_) => {
        if (_this.params.local) {
          let z = 40;
          pos.copy(ScreenProjection.find(camera).unproject(Mouse, Stage, z));
        }
        velocity.update();
      }),
        _this.startRender((_) => {
          (_this.get("ViewController/visibleV") < 0.99 && 0 == Mouse.delta.length()) ||
            (dist.subVectors(pos, pos2),
            dist.length() < 0.5 ||
              (velVec.copy(velocity.value).normalize().multiplyScalar(0.4),
              tubes.release(pos, 1, 0.3, velVec, color),
              pos2.copy(pos)));
        }, 60));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function TubeShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "TubeShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          tRefraction: { value: null },
          transparent: !0,
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function TubesInteraction(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Frag3D, "TubesInteraction"),
      Inherit(_this, MultiplayerEnvironment2),
      Inherit(_this, XComponent),
      (_this.fragName = "TubesInteraction"),
      (_this.contexts = 'Frag3D, "TubesInteraction",MultiplayerEnvironment2'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        await _this.layers.particles.ready(),
        await _this.layers.particles.tubes.ready(),
        _this.layers.particles.tubes.shader.set("tRefraction", _this.params.refraction),
        _this.params.scene.add(_this.group),
        (_this.layers.particles.tubes.mesh.visible = !0));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.ref_MultiplayerConfig2765 = _this.initClass(
          MultiplayerConfig2,
          AppState.createLocal(
            {
              server: "wss://s.dreamwave.network/ws",
              roomKey: "atv6",
              playerClass: "TubePlayer",
              maxInRoom: 3,
              data: {
                camera: _this.params.camera,
                proton: _this.layers.particles,
                alwaysOn: !1,
              },
            },
            !0,
          ),
        )),
        _this.ref_MultiplayerConfig2765.isFragment &&
          _promises.push(_this.wait(_this.ref_MultiplayerConfig2765, "__ready")),
        (_this.ref_TubePlayer134 = _this.initClass(
          TubePlayer,
          AppState.createLocal(
            {
              local: 1,
              camera: _this.params.camera,
              proton: _this.layers.particles,
            },
            !0,
          ),
        )),
        _this.ref_TubePlayer134.isFragment &&
          _promises.push(_this.wait(_this.ref_TubePlayer134, "__ready")),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(
    function UILControl(_params, ...restArgs) {
      const _this = this;
      (Inherit(_this, Element),
        Inherit(_this, XComponent),
        (_this.fragName = "UILControl"),
        (_this.contexts = "Element"),
        (_this.params = _params),
        (_this.args = arguments),
        (this.isFragment = !0));
      var _promises = [];
      !(async function () {
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
          (_this.params = _params),
          (_this.args = arguments),
          _this.parent?.layers && (_this.layers = _this.parent.layers),
          _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
        var _onChange = () => {};
        (_this.element.attr("data-type", "UILControl"), (_this.element.div._this = _this));
        let _onFinishChange = () => {};
        function isEqual(a, b) {
          return Array.isArray(a) || Array.isArray(b)
            ? a + "" == b + ""
            : "object" == typeof a || "object" == typeof b
              ? JSON.stringify(a) === JSON.stringify(b)
              : a === b;
        }
        function clone(value) {
          return Array.isArray(value)
            ? [...value]
            : null === value
              ? ""
              : "object" == typeof value
                ? Object.assign({}, value)
                : value;
        }
        (_this.element.goob(
          "\n    & {\n        padding: calc(var(--spacing) / 2) var(--spacing);\n        width: 100%;\n    }\n",
        ),
          (_this.init = (id, opts = {}) => {
            ((_this.id = id),
              (_this.opts = opts),
              _this.setValue(clone(opts.value)),
              (_this.previous = clone(_this.value)),
              _this.value && _this.set("value", _this.value),
              _this.setLabel(opts.label || id),
              _this.element.attr("data-id", id));
          }),
          (_this.finish = (history = !0) => {
            (_onFinishChange(_this.value),
              isEqual(_this.value, _this.previous) ||
                (history && UILHistory.set(_this, _this.previous),
                UILLocalStorage.set(_this.id, _this.value),
                UILStorage.set(_this.id, _this.value),
                (_this.previous = clone(_this.value))));
          }),
          (_this.force = (value) => {
            (_this.setValue(clone(value)), _this.finish(!1));
          }),
          (_this.debounce = (callback, time = 250) => {
            let interval;
            return (...args) => {
              (clearTimeout(interval),
                (interval = setTimeout(() => {
                  ((interval = null), callback(...args));
                }, time)));
            };
          }),
          (_this.onChange = (cb) => ((_onChange = cb), _this)),
          (_this.onFinishChange = (cb) => ((_onFinishChange = cb), _this)),
          (_this.getValue = function () {
            return _this.value;
          }),
          (_this.setValue = (value) => {
            isEqual(value, _this.value) ||
              ((_this.value = clone(value)),
              _this.update && _this.update(_this.value),
              "function" == typeof _onChange && _onChange(_this.value));
          }),
          (_this.getView = function () {
            return _this.view;
          }),
          (_this.setView = (view) => {
            (_this.view && _this.view.destroy(),
              (_this.view = view),
              _this.content.add(_this.view));
          }),
          (_this.hide = function () {
            return ((_this.visible = !1), _this.element.css({ display: "none" }), _this);
          }),
          (_this.show = function () {
            return ((_this.visible = !0), _this.element.css({ display: "inline-block" }), _this);
          }),
          (_this.isVisible = function () {
            return _this.visible;
          }),
          (_this.setLabel = (label) => {
            ((_this.label = label), _this.state.set("label", label));
          }),
          (_this.setDescription = function (desc) {
            (console.log("description: " + desc), _this.label.attr("title", desc));
          }));
        for (let key in _this)
          if (_this[key]?.then) {
            let store = _this[key];
            (store.then((val) => (_this[key] = val)), _promises.push(store));
          }
        (_promises.length && (await Promise.all(_promises)),
          (_promises = null),
          _this.flag?.("__ready", !0),
          _this.onInit?.());
      })();
    },
    (_) => {
      UILControl.infoIcon =
        '<span><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 016 1c0 2-3 3-3 3M12 17h0"/></svg></span>';
    },
  ),
  Class(function UILControlButton(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlButton"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  htmlFor: "$state.groupId",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "componentLabel",
                  children: [],
                },
                {
                  id: "$state.groupId",
                  className: "content",
                  _type: "div",
                  refName: "unnamed",
                  children: [
                    {
                      view: "UILInputButton",
                      data: "$data",
                      _type: "ViewState",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        _this.state.set("groupId", `${_this.params.id}-group`),
        (_this.data = new StateArray(_this.params.options.actions)),
        _this.init(_this.params.id, _this.params.options),
        _this.params.options.hideLabel &&
          (_this.element.classList().add("hide-label"),
          _this.componentLabel.classList().add("visibility-hidden")),
        (_this.setTitle = (title) => {
          _this.data.forEach((button) => {
            button.title = title;
          });
        }),
        _this.element.goob(
          "\n    .button {\n        width: 100%;\n    }\n\n    &.hide-label {\n        .form-group,\n        .content {\n            width: 100%;\n            max-width: 100% !important;\n        }\n\n    }\n    \n    .UILInputButton + .UILInputButton {\n        margin-top: 2px;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlCheckbox(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlCheckbox"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function handleChecked(isChecked) {
        ((_this.checkboxInput.div.checked = isChecked),
          isChecked
            ? _this.checkboxInput.div.setAttribute("checked", _this.value)
            : _this.checkboxInput.div.removeAttribute("checked"));
      }
      function handleClick() {
        ((_this.value = !_this.value), _this.state.set("isChecked", _this.value), _this.finish());
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  id: "$state.labelId",
                  className: "label",
                  _type: "div",
                  _innerText: "$state.label",
                  refName: "unnamed",
                  children: [],
                },
                {
                  className: "checkbox",
                  _type: "div",
                  refName: "unnamed",
                  children: [
                    {
                      type: "checkbox",
                      id: "$state.id",
                      ariaLabelledBy: "$state.labelId",
                      checked: "$state.isChecked",
                      _type: "input",
                      refName: "checkboxInput",
                      children: [],
                    },
                    {
                      htmlFor: "$state.id",
                      _type: "label",
                      _innerText: "$state.label",
                      refName: "checkboxLabel",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        _this.init(_this.params.id, _this.params.options),
        (function initListeners() {
          _this.checkboxInput.click(handleClick);
        })(),
        (_this.onInit = () => {
          (_this.state.set("labelId", `${_this.id}-label`),
            _this.state.set("isChecked", _this.params.options?.value),
            _this.state.bind("isChecked", handleChecked));
        }),
        _this.element.goob(
          "\n    & {\n        width: 50%;\n        \n        > .label, .content {\n            display: none;\n        }\n    }\n\n    .form-group > *:last-child {\n        width: auto;\n    }\n\n    .UILControlCheckbox:nth-of-type(even) {\n        padding-left: calc(var(--spacing-small) / 2);\n    }\n\n    .UILControlCheckbox:nth-of-type(odd) {\n        padding-right: calc(var(--spacing-small) / 2);\n    }\n\n\n",
        ),
        (_this.update = () => {
          _this.state.set("isChecked", _this.value);
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlColor(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlColor"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function onColorInput() {
        (_this.state.set("value", _this.colorInput.div.value), Utils.debounce(_this.finish, 200));
      }
      function onTextInput() {
        (_this.state.set("value", _this.textInput.div.value), Utils.debounce(_this.finish, 200));
      }
      function onTextClick() {
        (_this.textInput.div.focus(), _this.textInput.div.select());
      }
      function finishChange() {
        _this.finish();
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group UIL",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "unnamed",
                  children: [],
                },
                {
                  className: "color-input",
                  _type: "div",
                  refName: "unnamed",
                  children: [
                    {
                      className: "color-selector",
                      _type: "div",
                      refName: "unnamed",
                      children: [
                        {
                          _type: "label",
                          refName: "unnamed",
                          children: [
                            {
                              className: "color-chip",
                              _type: "div",
                              refName: "colorChip",
                              children: [],
                            },
                          ],
                        },
                        {
                          className: "color-text no-style",
                          type: "text",
                          _type: "input",
                          refName: "textInput",
                          children: [],
                        },
                        {
                          id: "color",
                          name: "color",
                          type: "color",
                          className: "color-box hidden",
                          _type: "input",
                          refName: "colorInput",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        _this.state.set("value", _this.params.options.value),
        _this.state.bind("value", _this.textInput),
        _this.bindState(_this.state, "value", function handleColorState(color) {
          (_this.setValue(_this.state.value),
            (function updateUI() {
              ((_this.colorChip.div.style.backgroundColor = _this.state.get("value")),
                (_this.colorInput.div.value = _this.state.get("value")));
            })());
        }),
        (_this.colorInput.div.value = _this.params.options.value),
        _this.init(_this.params.id, _this.params.options),
        (function initListeners() {
          (_this.colorInput.div.addEventListener("input", onColorInput, !1),
            _this.colorInput.div.addEventListener("blur", finishChange, !1),
            _this.textInput.div.addEventListener("input", onTextInput, !1),
            _this.textInput.div.addEventListener("click", onTextClick, !1),
            _this.textInput.div.addEventListener("blur", finishChange, !1));
        })(),
        (_this.update = function () {
          _this.state.set("value", _this.value);
        }),
        (_this.onDestroy = function () {
          (_this.colorInput.div.removeEventListener("input", onInput, !1),
            _this.colorInput.div.removeEventListener("blur", finishChange, !1));
        }),
        _this.element.goob(
          "\n    & {}\n\n    #color {\n        cursor: pointer;\n    }\n\n    .color-box {\n        max-width: 35px;\n    }\n\n    .color-text {\n        -webkit-appearance: none;\n                appearance: none;\n        margin: 0;\n        border: 0;\n        outline: 0;\n        font: var(--label2);\n        color: var(--font-color-highlight);\n        background: transparent;\n        position: absolute;\n        width: 100%;\n        height: 100%;\n        top: 0;\n        left: 0;\n        padding: 0 0 0 37px;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlFile(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlFile"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  id: "$state.id",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "unnamed",
                  children: [],
                },
                {
                  className: "content",
                  _type: "div",
                  refName: "unnamed",
                  children: [
                    {
                      title: "$state.fileUrl",
                      _type: "div",
                      refName: "previewImage",
                      children: [],
                    },
                    {
                      type: "text",
                      id: "geometry-text-input",
                      ariaLabelledBy: "$state.id",
                      placeholder: "$state.placeholder",
                      _type: "input",
                      refName: "inputText",
                      children: [],
                    },
                    {
                      type: "file",
                      id: "$state.inputFileId",
                      ariaLabelledBy: "$state.id",
                      _type: "input",
                      refName: "inputFile",
                      children: [],
                    },
                    {
                      _type: "button",
                      _innerText: "Select File",
                      refName: "inputButton",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        _this.state.set("inputFileId", _this.params.id + "-inputFile"),
        _this.state.set("inputTextId", _this.params.id + "-inputText"),
        _this.state.set("placeholder", _this.params.options.relative));
      const ogValues = {
        src: _this.params.options.src || "",
        relative: _this.params.options.relative || "",
        prefix: _this.params.options.prefix || "",
        filename: _this.params.options.filename || "",
      };
      function togglePreviewImage() {
        _this.state.hasFile ? _this.previewImage.show() : _this.previewImage.hide();
      }
      function setPreviewImage() {
        _this.element.div.style.setProperty(
          "--preview-background",
          `url(${_this.state.get("fileUrl")})`,
        );
      }
      async function inputFileChange(event) {
        let file = event.target.files[0];
        (_this.state.set("hasFile", !0),
          (_this.value.filename = file.name),
          (_this.value.relative = (function getRelative() {
            return _this.inputText.div.value.includes(_this.value.prefix)
              ? _this.inputText.div.value.replace(_this.value.prefix, "")
              : _this.inputText.div.value;
          })()),
          (_this.value.src = (function getSrc() {
            return _this.value.filename && _this.value.filename.includes("http")
              ? _this.value.filename
              : `${_this.value.prefix ? _this.value.prefix + "/" : ""}${_this.value.relative ? _this.value.relative + "/" : ""}${_this.value.filename}`;
          })()),
          _this.finish());
      }
      async function inputTextChange(event) {
        event.target.value &&
          (_this.inputText.val().includes(["World", "SceneLayout"]),
          (_this.value = {
            src: "",
            relative: _this.inputText.val(),
            prefix: "",
            filename: "",
          }),
          _this.finish());
      }
      ((_this.value = Object.assign({}, ogValues)),
        _this.inputFile.classList().add("sr-only"),
        _this.inputButton.classList().add("small"),
        _this.init(_this.params.id, _this.params.options),
        togglePreviewImage(),
        (function toggleTextInput() {
          _this.inputText.show();
        })(),
        (function initListeners() {
          (_this.inputButton.click(() => _this.inputFile.div.click()),
            _this.inputFile.bind("change", inputFileChange),
            _this.inputText.bind("change", inputTextChange),
            _this.bindState(_this.state, "fileUrl", setPreviewImage),
            _this.bindState(_this.state, "hasFile", togglePreviewImage));
        })(),
        (_this.onInit = () => {
          _this.value &&
            _this.value.src &&
            (_this.state.set("hasFile", !0),
            _this.state.set("fileUrl", _this.value.src),
            (_this.inputText.div.value = _this.value.filename));
        }),
        (_this.force = function (value, isClipboard) {}),
        (_this.onDestroy = function () {}),
        _this.element.goob(
          "\n    & {}\n\n    .path {\n        margin-bottom: var(--spacing-small);\n    }\n\n    .content {\n        display: flex;\n        flex-direction: column;\n        gap: var(--spacing-small);\n    }\n\n    .previewImage {\n        background-image: var(--preview-background);\n        background-size: cover;\n        background-position: center;\n        background-repeat: no-repeat;\n        width: 100%;\n        aspect-ratio: 16 / 9;\n        display: none;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlImage(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlImage"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function openFilePicker() {
        new UILExternalFilePicker(filePickerSelected, "textures");
      }
      function filePickerSelected(value) {
        (console.log("file selected: " + value),
          window.UIL_REMOTE && console.warn("UIL_REMOTE is not supported when using file picker!"));
        const v = {
          compressed: !1,
          filename: value.split("/").last(),
          prefix: "assets/images",
          relative: "assets/images",
          src: `assets/images/${value}`,
        };
        (_this.force(v, !0), _this.finish());
      }
      async function supportsKtx2() {
        if (void 0 === Dev.supportsKtx2)
          try {
            (await Dev.execUILScript("compressktx2", {
              options: ["--help"],
              output: "",
              src: [],
            }),
              (Dev.supportsKtx2 = !0));
          } catch (e) {
            (console.log(
              "%cKTX2 support not found in this project%c. 💁‍️ See https://www.notion.so/a91bbc09b19d4475bfc5bcb8d6048d70 for upgrade instructions",
              "background-color: #ffde7b",
              "background-color: unset",
            ),
              (Dev.supportsKtx2 = !1));
          }
        return Dev.supportsKtx2;
      }
      async function compressKtx2() {
        let result,
          path = _this.value.src.split("?")[0];
        if (_this.params.options.compressOptions?.cube) {
          _this.compress.bg("#fdb460").html("Cubemap");
          let [output, src] = (function parseCubePaths(path) {
            let info = Utils3D.splitCubemapPath(path),
              src = Utils3D.getCubemapFacePaths(info);
            return [`${info.prefix}.ktx2`, src];
          })(path);
          result = await Dev.execUILScript("compressktx2", {
            options: ["--genmipmap", "--encode", "etc1s", "--cubemap"],
            output: output,
            src: src,
          });
        } else {
          let noext = (function removeImageExtension(filename) {
              const lastDotIndex = filename.lastIndexOf(".");
              return -1 !== lastDotIndex ? filename.substring(0, lastDotIndex) : filename;
            })(path.split("/").last()),
            folder = (function getFolderPath(url) {
              return ((url = url.split("/")).last().includes(".") && url.pop(), url.join("/"));
            })(path);
          result = await Dev.execUILScript("compressktx2", {
            options: ["--genmipmap", "--encode", "etc1s"],
            output: `${folder}/${noext}.ktx2`,
            src: [path],
          });
        }
        return "Error" !== result;
      }
      async function compressClick() {
        if (!_this.value.src || _this.flag("compressPending")) return;
        (_this.flag("compressPending", !0), _this.compress.bg("#f4ee42").text("---"));
        let success = !1;
        try {
          if (await supportsKtx2()) success = await compressKtx2();
          else {
            "Error" !==
              (await Dev.execUILScript("compressktx", {
                src: _this.value.src.split("?")[0],
              })) && (success = !0);
          }
        } catch (e) {
          console.error(e);
        }
        (success
          ? _this.compress.bg("#46f441").html("Success")
          : _this.compress.bg("#f44141").html("Failed"),
          _this.flag("compressPending", !1),
          _this.finish());
      }
      async function checkChange() {
        let compressed = !!_this.check.div.checked;
        (compressed && (await supportsKtx2()) && (compressed = "ktx2"),
          (_this.value.compressed = compressed),
          (_this.value.useCompressed = !!compressed),
          _this.finish());
      }
      async function change() {
        let file = _this.picker.div.files[0];
        if (!file) return;
        let name = file.name;
        if (window.UIL_REMOTE) {
          const { customMetadata: customMetadata } = await UILStorage.uploadFileToRemoteBucket({
            file: file,
            progress: _this.progress,
          });
          name = customMetadata.path;
        }
        ((_this.value.filename = name),
          (_this.value.relative = (function getRelative() {
            return _this.value.filename.includes("http")
              ? ""
              : _this.value.relative.includes(_this.value.prefix)
                ? _this.value.relative.replace(`${_this.value.prefix}`, "")
                : _this.value.relative;
          })()),
          (_this.value.src = (function getSrc() {
            return _this.value.filename.includes("http")
              ? _this.value.filename
              : `${_this.value.prefix ? _this.value.prefix + "/" : ""}${_this.value.relative ? _this.value.relative + "/" : ""}${_this.value.filename}`;
          })()),
          (_this.value.compressed = !!_this.check.div.checked),
          (_this.value.useCompressed = _this.value.compressed));
        let compressed = !!_this.check.div.checked;
        (compressed && (await supportsKtx2()) && (compressed = "ktx2"),
          (_this.value.compressed = compressed),
          (_this.value.useCompressed = !!compressed),
          (await (function imageExists(url) {
            return (
              !!url.includes("http") ||
              ((url = Assets.getPath(url)),
              fetch(url)
                .then((e) => 404 != e.status)
                .catch((e) => console.warn("UILControlImage image url validation failed", e)))
            );
          })(_this.value.src))
            ? ((_this.value = Object.assign({}, _this.value)),
              (_this.picker.div.value = ""),
              _this.picker.attr("title", _this.value.src),
              _this.img.css({
                backgroundImage: `url(${Assets.getPath(_this.value.src)})`,
              }),
              _this.delete.show(),
              _this.finish())
            : ((_this.picker.div.value = ""),
              console.warn("UIL: Could not find image", _this.value),
              alert(`"${_this.value.src}" not found!\nMake sure "relative path" is correct.`)));
      }
      function deleteImage() {
        ((_this.value = {
          src: "",
          relative: "",
          prefix: "assets/images",
          filename: "",
          useCompressed: !1,
        }),
          (_this.input.div.value = ""),
          (_this.picker.div.value = ""),
          _this.picker.attr("title", null),
          _this.img.css({ backgroundImage: "" }),
          _this.delete.hide(),
          (_this.value = Object.assign({}, _this.value)),
          _this.finish());
      }
      function inputChange() {
        _this.value.relative = _this.input.div.value;
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  htmlFor: "image",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "unnamed",
                  children: [],
                },
                {
                  type: "text",
                  className: "path",
                  _type: "input",
                  refName: "input",
                  children: [],
                },
              ],
            },
            {
              className: "wrapper",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  className: "preview",
                  _type: "div",
                  refName: "unnamed",
                  children: [
                    { _type: "div", refName: "img", children: [] },
                    {
                      className: "picker",
                      type: "file",
                      id: "imageFile",
                      accept: "image/*",
                      _type: "input",
                      refName: "picker",
                      children: [],
                    },
                    {
                      className: "progress",
                      _type: "div",
                      refName: "unnamed",
                      children: [],
                    },
                    {
                      _type: "button",
                      refName: "delete",
                      children: [
                        {
                          width: 10,
                          height: 10,
                          viewBox: "0 0 10 10",
                          fill: "none",
                          stroke: "currentColor",
                          xmlns: "http://www.w3.org/2000/svg",
                          _type: "svg",
                          refName: "unnamed",
                          children: [
                            {
                              strokeWidth: 2,
                              strokeLinecap: "round",
                              d: "M2 2l6 6M2 8l6-6",
                              _type: "path",
                              refName: "unnamed",
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      className: "copy",
                      _type: "div",
                      _innerText: "Drag and drop your file here",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
                {
                  className: "preview-controls",
                  _type: "div",
                  refName: "unnamed",
                  children: [
                    {
                      className: "control-button small",
                      _type: "button",
                      _innerText: "Browse Assets",
                      refName: "browseButton",
                      children: [],
                    },
                    {
                      className: "control-button small",
                      _type: "button",
                      _innerText: "Compress",
                      refName: "compress",
                      children: [],
                    },
                    {
                      className: "checkbox-control",
                      htmlFor: "$state.compressedInput",
                      _type: "label",
                      refName: "unnamed",
                      children: [
                        {
                          className: "regular-checkbox",
                          type: "checkbox",
                          name: "$state.compressedInput",
                          id: "$state.compressedInput",
                          _type: "input",
                          refName: "check",
                          children: [],
                        },
                        {
                          _type: "span",
                          _innerText: "Use Compressed",
                          refName: "unnamed",
                          children: [],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        _this.state.set("compressedInput", `${_this.params.id}-compressed`),
        (_this.params.options.value = Object.assign(
          {
            src: "",
            relative: _this.params.options.relative || "",
            prefix: _this.params.options.prefix,
            filename: "",
            useCompressed: !1,
          },
          _this.params.options.value,
        )),
        (_this.value = Object.assign({}, _this.params.options.value)),
        _this.init(_this.params.id, _this.params.options),
        (_this.check.div.checked = _this.params.options.value.useCompressed),
        _this.value.relative
          ? (_this.input.div.value = _this.value.relative)
          : _this.input.attr("placeholder", "Relative Path"),
        _this.delete.hide(),
        _this.value.src &&
          _this.img.css({
            backgroundImage: `url('${Assets.getPath(_this.value.src)}')`,
          }),
        (function initListeners() {
          (_this.picker.div.addEventListener("change", change, !1),
            _this.input.div.addEventListener("change", inputChange, !1),
            _this.browseButton.click(openFilePicker),
            (_this.delete.div.onclick = deleteImage),
            (_this.compress.div.onclick = compressClick),
            (_this.check.div.onchange = checkChange));
        })(),
        (_this.force = async function (value, isClipboard) {
          ((_this.value = Object.assign({}, value)),
            (_this.input.div.value = _this.value.relative),
            (_this.picker.div.value = ""),
            _this.picker.attr("title", _this.value.src),
            console.log(value),
            _this.img.css({
              backgroundImage: `url('${Assets.getPath(_this.value.src)}')`,
            }),
            (_this.check.div.checked = _this.value.compressed));
          let compressed = !!_this.check.div.checked;
          (compressed && (await supportsKtx2()) && (compressed = "ktx2"),
            (_this.value.compressed = compressed),
            (_this.value.useCompressed = !!compressed));
        }),
        (_this.onDestroy = function () {
          (_this.picker.div.removeEventListener("change", change, !1),
            _this.input.div.removeEventListener("change", inputChange, !1));
        }),
        _this.element.goob(
          "\n    & {}\n\n    .form-group {\n        margin-bottom: var(--spacing-small);\n    }\n\n    .picker {\n        &:focus {\n            .img {\n                border-color: var(--color-accent-80);\n            }\n        }\n    }\n\n    .wrapper {\n        display: flex;\n        gap: var(--spacing-small);\n    }\n\n    .preview {\n        width: 160px;\n        height: 128px;\n        box-sizing: border-box;\n        position: relative;\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        overflow: hidden;\n        flex-shrink: 0;\n    }\n\n    .img {\n        width: 100%;\n        height: 100%;\n        position: absolute;\n        inset: 0px;\n        background-size: cover;\n        background-repeat: no-repeat;\n        background-position: center center;\n        border: 1px dotted var(--color-neutral-40);\n        text-align: center;\n    }\n\n    .picker {\n        position: absolute;\n        opacity: 0;\n        inset: 0px;\n    }\n\n    .progress {\n        position: absolute;\n        bottom: 0px;\n        height: 10px;\n        left: 0px;\n        background: rgb(155, 156, 155);\n    }\n\n    .copy {\n        color: var(--color-neutral-80);\n        font: var(--label2);\n        padding: var(--spacing-small);\n        text-align: center;\n    }\n\n    .control-button {\n        margin-bottom: calc(var(--spacing-small) / 2);\n        width: 100%;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlNumber(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlNumber"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  id: "$state.labelId",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "unnamed",
                  children: [],
                },
                {
                  view: "UILInputNumber",
                  data: "$data",
                  _type: "ViewState",
                  refName: "unnamed",
                  children: [],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        _this.state.set("labelId", `${_this.params.id}-label`),
        (_this.data = Data.request(`vectorInputData-${_this.params.id}`, () => [
          {
            id: _this.params.id,
            value: _this.params.options.value || 0,
            labelledBy: _this.state.labelId,
            min: _this.params.options.min || -1 / 0,
            max: _this.params.options.max || 1 / 0,
            step: _this.params.options.step || 1,
            precision: _this.params.options.precision || 3,
            onInputCB: (value) =>
              (function onInput(value) {
                (_this.setValue(Number(value)), (_this.data[value] = value));
              })(value),
            onFinishCB: () =>
              (function onFinish() {
                _this.finish();
              })(),
          },
        ])),
        _this.init(_this.params.id, _this.params.options),
        (_this.update = function () {
          _this.data.forEach((input) => {
            input.value = _this.value;
          });
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlRange(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlRange"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function change() {
        _this.finish();
      }
      function input() {
        _this.value = Number(_this.slider.div.value);
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  htmlFor: "$state.id",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "unnamed",
                  children: [],
                },
                {
                  type: "range",
                  id: "$state.id",
                  min: "$props.min",
                  max: "$props.max",
                  step: "$props.step",
                  _type: "input",
                  refName: "slider",
                  children: [],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.props = { min: 0, max: 100, step: 1 }),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        Object.assign(_this.props, _this.params.options),
        _this.init(_this.params.id, _this.params.options),
        (_this.slider.div.value = _this.params.options.value || ""),
        (function initListeners() {
          (_this.slider.div.addEventListener("change", change, !1),
            _this.slider.div.addEventListener("input", input, !1));
        })(),
        (_this.force = function (value) {
          ((_this.value = value), (_this.slider.div.value = value), _this.finish(!1));
        }),
        (_this.onDestroy = function () {
          (_this.slider.div.removeEventListener("change", change, !1),
            _this.slider.div.removeEventListener("input", input, !1));
        }),
        _this.element.goob("\n    & {}\n"));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlSelect(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlSelect"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  htmlFor: "$state.id",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "selectLabel",
                  children: [],
                },
                {
                  className: "select-wrapper",
                  _type: "div",
                  refName: "unnamed",
                  children: [
                    {
                      id: "$state.id",
                      _type: "select",
                      refName: "select",
                      children: [],
                    },
                    {
                      className: "arrow",
                      _type: "div",
                      _innerText: " ▼ ",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        !_this.params.options.options)
      )
        throw "UILControlSelect is missing select options";
      function change() {
        _this.finish();
      }
      function input() {
        let i = _this.select.div.selectedIndex;
        _this.value = _this.selectOptions[i].value;
      }
      ((_this.params.options.value =
        _this.params.options.value || _this.params.options.options[0].value),
        (function initOptions() {
          _this.selectOptions = _this.params.options.options.map(
            ({ value: value, label: label }) => {
              const el = document.createElement("option");
              return (
                el.setAttribute("value", value),
                _this.value === value && el.setAttribute("selected", !0),
                (el.text = label || value),
                (el.value = value),
                _this.select.add(el),
                el
              );
            },
          );
        })(),
        (function initListeners() {
          (_this.select.div.addEventListener("change", change, !1),
            _this.select.div.addEventListener("input", input, !1));
        })(),
        _this.init(_this.params.id, _this.params.options),
        (_this.select.div.value = _this.params.options.value),
        (_this.force = function (value) {
          ((_this.select.div.value = value), (_this.value = value));
        }),
        (_this.onDestroy = function () {
          (_this.select.div.removeEventListener("change", change, !1),
            _this.select.div.removeEventListener("input", input, !1));
        }),
        _this.element.goob(
          "\n    .select-wrapper {\n        position: relative;\n    }\n\n    .arrow {\n        color: var(--color-neutral-70);\n        font-size: 7px;\n        position: absolute;\n        right: var(--spacing-small);\n        top: 15px;\n        pointer-events: none;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlText(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlText"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function onChange() {
        (clearTimeout(_this.timeout),
          (_this.timeout = setTimeout(onFinishChange, 400)),
          (_this.value = _this.textInput.div.value));
      }
      function onFinishChange() {
        null !== _this.timeout &&
          (clearTimeout(_this.timeout), (_this.timeout = null), _this.finish());
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  htmlFor: "$state.id",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "textInputLabel",
                  children: [],
                },
                {
                  type: "text",
                  id: "$state.id",
                  _type: "input",
                  refName: "textInput",
                  children: [],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        (function initListeners() {
          (_this.textInput.div.addEventListener("input", onChange, !1),
            _this.textInput.div.addEventListener("change", onFinishChange, !1));
        })(),
        _this.init(_this.params.id, _this.params.options),
        (_this.textInput.div.value = _this.params.options.value || ""),
        (_this.update = function () {
          _this.textInput.div.value = _this.value || "";
        }),
        (_this.onDestroy = function () {
          (_this.textInput.div.removeEventListener("input", onChange, !1),
            _this.textInput.div.removeEventListener("change", onBlur, !1));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlTextarea(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlTextarea"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      let _timeout;
      function onChange() {
        (clearTimeout(_timeout),
          (_timeout = setTimeout(onFinishChange, 400)),
          (_this.value = _this.textareaInput.div.value));
      }
      function onFinishChange() {
        null !== _timeout && (clearTimeout(_timeout), (_timeout = null), _this.finish());
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  htmlFor: "$state.id",
                  title: "$state.label",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "unnamed",
                  children: [],
                },
                {
                  type: "text",
                  id: "$state.id",
                  maxLength: "$props.max",
                  minLength: "$props.min",
                  rows: "$props.rows",
                  readOnly: "$props.readonly",
                  _type: "textarea",
                  refName: "textareaInput",
                  children: [],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.props = { max: 1 / 0, min: -1 / 0, rows: 2, readonly: !1 }),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        Object.assign(_this.props, _this.params.options),
        _this.init(_this.params.id, _this.params.options),
        (_this.textareaInput.div.value = _this.params.options.value || ""),
        (function initListeners() {
          (_this.textareaInput.div.addEventListener("input", onChange, !1),
            _this.textareaInput.div.addEventListener("change", onFinishChange, !1));
        })(),
        (_this.update = function () {
          _this.textareaInput.div.value = _this.value || "";
        }),
        (_this.onDestroy = function () {
          (_this.textareaInput.div.removeEventListener("input", onChange, !1),
            _this.textareaInput.div.removeEventListener("change", onFinishChange, !1));
        }),
        _this.element.goob(
          "\n    .textareaInput {\n        font-family: Consolas, monaco, monospace;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILControlVector(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILControl),
      Inherit(_this, XComponent),
      (_this.fragName = "UILControlVector"),
      (_this.contexts = "UILControl"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "form-group",
              _type: "div",
              refName: "unnamed",
              children: [
                {
                  id: "$state.labelId",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "unnamed",
                  children: [],
                },
                {
                  className: "number-inputs",
                  _type: "div",
                  refName: "unnamed",
                  children: [
                    {
                      view: "UILInputNumber",
                      data: "$inputData",
                      _type: "ViewState",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })),
        _this.state.set("id", _this.params.id),
        _this.state.set("labelId", `${_this.params.id}-label`),
        (_this.inputData = await Data.request(`vectorInputData-${_this.params.id}`, () =>
          _this.params.options.value.map((value, index) => ({
            value: value || 0,
            labelledBy: _this.state.labelId,
            min: _this.params.options.min || -1 / 0,
            max: _this.params.options.max || 1 / 0,
            step: _this.params.options.step || 1,
            precision: _this.params.options.precision || 3,
            onInputCB: (v, m) =>
              (function onInput(value, index, master) {
                master
                  ? (_this.vector = _this.vector.map((v) => value))
                  : (_this.vector[index] = value);
                (_this.setValue([..._this.vector]),
                  _this.inputData.forEach((input, idx) => {
                    input.value = _this.vector[idx];
                  }));
              })(v, index, m),
            onFinishCB: () =>
              (function onFinish() {
                _this.finish();
              })(),
            index: index,
          })),
        )),
        (_this.vector = []),
        _this.params.options.value)
      )
        _this.length = _this.vector.length;
      else {
        if (!_this.params.options.components)
          throw 'UILControlVector: Cannot detect vector type. Define "options.components" count or init with a initial value';
        _this.params.options.value = new Array(_this.params.options.components).fill(0);
      }
      ((_this.length = _this.params.options.value.length),
        _this.init(_this.params.id, _this.params.options),
        (_this.vector = [..._this.value]),
        (_this.update = function () {
          _this.inputData.forEach((input, index) => {
            input.value = _this.value[index];
          });
        }),
        _this.element.goob(
          "\n    .number-inputs {\n        display: flex;\n        gap: calc(var(--spacing-small) / 2);\n    }\n",
        ),
        (_this.force = function (value, history = !1) {
          ((_this.vector = [...value]),
            _this.setValue([..._this.vector]),
            _this.inputData.forEach((input, index) => (input.value = _this.value[index])),
            _this.finish(history));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILFolder(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILFolder"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "a",
              refName: "header",
              children: [
                {
                  htmlFor: "$state.label",
                  _type: "label",
                  _innerText: "$state.label",
                  refName: "unnamed",
                  children: [],
                },
                {
                  _type: "div",
                  _innerText: "☰",
                  refName: "drag",
                  children: [],
                },
              ],
            },
            { _type: "div", refName: "container", children: [] },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.params.options ||
          (_this.params = Object.assign({}, { id: _this.params }, { options: restArgs[0] })));
      let _children = {},
        _open = !_this.params.options.closed,
        _visible = !0,
        _order = [],
        _draggable = !1,
        _sortableChildren = !1,
        _headerDrag = !1,
        _hasClipboard = !1;
      _this.params.id;
      function removeDragHandlers() {
        (_this.element.div.removeEventListener("dragstart", dragStart, !1),
          _this.element.div.removeEventListener("dragover", dragOver, !1),
          _this.element.div.removeEventListener("drop", drop, !1));
      }
      function onToggle(event) {
        (_this.state.open ? _this.close() : _this.open(),
          _this.state.open ? _this.header.div.focus() : _this.header.div.blur());
      }
      function onMouseDown(event) {
        ((_headerDrag = !0), _this.header.div.addEventListener("mouseup", onMouseUp));
      }
      function onMouseUp(event) {
        ((_headerDrag = !1), _this.header.div.removeEventListener("mouseup", onMouseUp));
      }
      function onKeydown(event) {
        (event.preventDefault(), 13 === event.which && (_open ? close() : open()));
      }
      function onKeyup(event) {
        (event.preventDefault(),
          _hasClipboard &&
            ("c" == event.key && event.metaKey
              ? (function onCopy() {
                  UILClipboard.copy(_children);
                })()
              : "v" == event.key &&
                event.metaKey &&
                (function onPaste() {
                  UILClipboard.paste(_children);
                })()));
      }
      function onFocus() {
        (_this.element.div.classList.add("active"), (_hasClipboard = !0));
      }
      function onBlur() {
        (_this.element.div.classList.remove("active"), (_hasClipboard = !1));
      }
      function matchItem(str, item) {
        return (
          UILFuzzySearch.search(str, item.id.toLowerCase()) ||
          UILFuzzySearch.search(str, item.label.toLowerCase())
        );
      }
      function dragStart(e) {
        if (!UILFolder.DragLock) {
          if (!_headerDrag) return (e.preventDefault(), void e.stopPropagation());
          ((UILFolder.DragLock = _this.state.id),
            e.dataTransfer.setData("text/plain", _this.state.id),
            (e.dataTransfer.effectAllowed = "move"),
            _this.element.css({ opacity: 0.5 }));
        }
      }
      function dragOver(e) {
        (e.preventDefault(), (e.dataTransfer.dropEffect = "move"));
      }
      function drop(e) {
        if (!UILFolder.DragLock) return;
        if (e.dataTransfer.items)
          for (var i = 0; i < e.dataTransfer.items.length; i++)
            if ("file" === e.dataTransfer.items[i].kind) return;
        (e.preventDefault(), (_headerDrag = !1));
        let target = e.currentTarget._this,
          dragging = _this.parent.getChildById(UILFolder.DragLock);
        ((UILFolder.DragLock = null),
          target &&
            target.parent &&
            dragging &&
            (dragging.element.css({ opacity: 1 }),
            dragging.parent.getChildById(target.id) &&
              (e.stopPropagation(),
              target.parent.container.div.insertBefore(dragging.element.div, target.element.div),
              (_order = [...target.parent.container.div.childNodes].map((el) => el._this.id)),
              _this.events.fire(UIL.REORDER, { order: [..._order] }),
              (function saveSort() {
                UILStorage.set(
                  `UIL_${UIL.sortKey}_${_this.parent.id}_order`,
                  JSON.stringify(_order),
                );
              })())));
      }
      function getUrlID() {
        return `${Global.PLAYGROUND || "Global"}_folder_${_this.state.id}`;
      }
      function saveFolderState() {
        sessionStorage.setItem(getUrlID(), JSON.stringify({ open: _this.state.open }));
      }
      ((_this.id = _this.params.id),
        (_this.label = _this.params.options.label || _this.params.id),
        (_this.level = -1),
        _this.createState(),
        _this.state.set("id", _this.params.id),
        _this.state.set("label", _this.params.options.label || _this.params.id),
        _this.state.set("open", !_this.params.options.closed),
        _this.params.options.hideTitle && _this.header.classList().add("hide-title"),
        _this.element.css({
          maxHeight: _this.params.options.maxHeight || "none",
        }),
        _this.element.attr("data-id", _this.params.id),
        _this.element.attr("data-type", "UILFolder"),
        (_this.element.div._this = _this),
        (_this.onInit = () => {
          !(function restoreFolderState() {
            let json = JSON.parse(sessionStorage.getItem(getUrlID()));
            json ? (json.open ? _this.open() : _this.close()) : _this.open();
          })();
        }),
        (_this.onMounted = () => {
          _this.flag("isReady", !0);
        }),
        (_this.ready = (_) => _this.wait("isReady")),
        (function initListeners() {
          (_this.header.div.addEventListener("keydown", onKeydown, !1),
            _this.header.div.addEventListener("click", onToggle, !1),
            _this.header.div.addEventListener("mousedown", onMouseDown),
            _this.header.div.addEventListener("focus", onFocus, !1),
            _this.header.div.addEventListener("blur", onBlur, !1),
            _this.header.div.addEventListener("keydown", onKeyup, !1));
        })(),
        (_this.add = async function (child) {
          return (
            await _this.wait(() => _this.ready),
            await defer(),
            child.draggable && child.draggable(_sortableChildren),
            (child.parent = _this),
            (_children[child.id] = child),
            _this.container.add(child),
            _this
          );
        }),
        (_this.remove = function (x) {}),
        (_this.getChildById = function (id) {
          return _children[id];
        }),
        (_this.getAll = function () {}),
        (_this.getVisible = function () {
          return Object.values(_children).filter((x) => x.isVisible());
        }),
        (_this.find = function (id) {
          return id === _this.id
            ? _this
            : Object.values(_children).reduce(
                (acc, item) =>
                  item.id === id
                    ? acc.concat(item)
                    : item instanceof UILFolder
                      ? acc.concat(item.find(id))
                      : acc,
                [],
              );
        }),
        (_this.filter = function filter(str, match = !1) {
          str = str.toLowerCase();
          let result = [],
            haystack = Object.values(_children);
          for (let el of haystack)
            if (el instanceof UILFolder) {
              let matches = el.filter(str, !0);
              matches.length
                ? (result.concat(matches), el.show(), el.open())
                : matchItem(str, el)
                  ? (result.push(el), el.show(), el.showChildren(), el.close())
                  : el.getVisible().length
                    ? el.show()
                    : el.hide();
            } else matchItem(str, el) ? (result.push(el), el.show()) : el.hide();
          return result;
        }),
        (_this.filterSingle = function filterSingle(str) {
          str = str.toLowerCase();
          let haystack = Object.values(_children);
          for (let el of haystack)
            el instanceof UILFolder
              ? (el.filterSingle(str),
                str == el.state.label.toString().toLowerCase() ||
                str == el.state.id.toString().toLowerCase()
                  ? (el.show(), el.showChildren(), el.open(!0))
                  : el.getVisible().length
                    ? el.show()
                    : el.hide())
              : matchItem(str, el)
                ? (el.show(), el.state.open && el.open(!0))
                : el.hide();
          return [];
        }),
        (_this.open = function (keepClosed = !1) {
          if (_this.element)
            return (
              _this.state.set("open", !0),
              _this.element.classList().add("open"),
              (_open = !0),
              1 != keepClosed && _this.forEachFolder((f) => f.close()),
              saveFolderState(),
              _this.onOpen && _this.onOpen(),
              _this
            );
        }),
        (_this.close = function () {
          (_this.state.set("open", !1),
            _this.element.classList().remove("open"),
            (_open = !1),
            saveFolderState());
        }),
        (_this.setLabel = function (label) {
          _this.state.set("label", label);
        }),
        (_this.hide = function () {
          if (_this.element)
            return ((_visible = !1), _this.element.css({ display: "none" }), _this);
        }),
        (_this.show = function () {
          if (_this.element)
            return ((_visible = !0), _this.element.css({ display: "block" }), _this);
        }),
        (_this.showChildren = function () {
          return (
            Object.values(_children).forEach((el) =>
              el instanceof UILFolder ? el.showChildren() : el.show(),
            ),
            _this.show(),
            _this
          );
        }),
        (_this.isOpen = function () {
          return _open;
        }),
        (_this.isVisible = function () {
          return _visible;
        }),
        (_this.forEachFolder = function (cb) {
          return (
            Object.values(_children).forEach((el) => {
              el instanceof UILFolder && (cb(el), el.forEachFolder(cb));
            }),
            _this
          );
        }),
        (_this.forEachControl = function (cb) {
          return (
            Object.values(_children).forEach((el) => {
              el instanceof UILFolder ? el.forEachControl(cb) : cb(el);
            }),
            _this
          );
        }),
        (_this.enableSorting = function (key) {
          ((_sortableChildren = !0),
            (UIL.sortKey = key),
            Object.values(_children).forEach((el) => {
              el instanceof UILFolder && el.draggable(!0);
            }));
          let order = (function getSort() {
            let sort = UILStorage.get(`UIL_${UIL.sortKey}_${_this.id}_order`);
            if (sort) return JSON.parse(sort);
          })();
          return (
            order &&
              ((_order = order),
              (function restoreSort() {
                _order.forEach((id) => {
                  _children[id] && _this.container.add(_children[id]);
                });
              })()),
            _this
          );
        }),
        (_this.draggable = function (enable) {
          ((_draggable = enable),
            _this.element.attr("draggable", enable),
            enable
              ? (!(function addDragHandlers() {
                  (_this.element.div.addEventListener("dragstart", dragStart, !1),
                    _this.element.div.addEventListener("dragover", dragOver, !1),
                    _this.element.div.addEventListener("drop", drop, !1));
                })(),
                _this.drag && _this.drag.show())
              : (removeDragHandlers(), _this.drag && _this.drag.hide()));
        }),
        (_this.toClipboard = function () {
          UILClipboard.copy(_children);
        }),
        (_this.fromClipboard = function () {
          UILClipboard.paste(_children);
        }),
        (_this.eliminate = function () {
          (_this.params.options.hideTitle ||
            (_this.header.div.removeEventListener("keydown", onToggle, !1),
            _this.header.div.removeEventListener("click", onToggle, !1),
            _this.header.div.removeEventListener("mousedown", onMouseDown),
            _this.header.div.removeEventListener("focus", onFocus, !1),
            _this.header.div.removeEventListener("blur", onBlur, !1)),
            _draggable && removeDragHandlers());
        }),
        (_this.forceSort = function (index) {
          (_this.parent.container.div.insertBefore(
            _this.element.div,
            _this.parent.container.div.children[index],
          ),
            (_order = [..._this.parent.container.div.childNodes].map((el) => el._this.state.id)),
            _this.events.fire(UIL.REORDER, { order: [..._order] }));
        }),
        (_this.openChildren = function () {
          Object.values(_children).forEach((el) => (el instanceof UILFolder ? el.open() : null));
        }),
        (_this.onToggle = onToggle),
        UIL.addCSS(
          UILFolder,
          "\n    .UILFolder .UILFolder .UILFolder .header { \n        padding-left: calc(var(--left-padding) + var(--spacing-small)); \n    }\n    .UILFolder .UILFolder .UILFolder .header:before {\n        left: calc(var(--spacing-small) * 2);\n    }\n\n    .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .header {\n        padding-left: calc(var(--left-padding) + var(--spacing-small) * 3); \n    }\n    .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .header:before {\n        left: calc(var(--spacing-small) * 3);\n    }\n\n    .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .header {\n        padding-left: calc(var(--left-padding) + var(--spacing-small) * 4); \n    }\n    .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .header:before {\n        left: calc(var(--spacing-small) * 4);\n    }\n\n    .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .header {\n        padding-left: calc(var(--left-padding) + var(--spacing-small) * 5); \n    }\n    .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .header:before {\n        left: calc(var(--spacing-small) * 5);\n    }\n\n    .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .header {\n        padding-left: calc(var(--left-padding) + var(--spacing-small) * 6); \n    }\n    .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .UILFolder .header:before {\n        left: calc(var(--spacing-small) * 6);\n    }\n\n",
        ),
        _this.element.goob(
          "\n    & {\n        --left-padding: calc(var(--spacing) * 1.75);\n\n        background-color: var(--panel-background-color);\n        width: 100%;\n\n        &:has(> .header:focus) {\n            border: 1px solid var(--color-action--alt);\n        }\n        \n        &.open {\n            > .header:before {\n                transform: rotate(90deg);\n            }\n    \n            > .container {\n                display: block;\n            }\n        }\n    }\n\n    .header {\n        border-bottom: 1px solid var(--color-divider-main);\n        color: var(--color-white);\n        display: flex;\n        font: var(--label4);\n        padding: var(--spacing); \n        padding-left: var(--left-padding);\n        position: relative;\n        align-items: center;\n        text-decoration: none;\n        line-height: 1;\n        user-select: none;\n\n        &:hover {\n            outline: 1px solid var(--color-action--alt);\n        }\n\n        &:before {\n            content: '';\n            display: block;\n            width: 0;\n            height: 0;\n            border-color: transparent transparent transparent var(--color-icon-default);\n            border-style: solid;\n            border-width: 3px 0 3px 4px;\n            position: absolute;\n            left: var(--spacing-small);\n            transition: transform .3s ease-out;\n        }\n\n        &.hide-title {\n            display: none;\n        }\n    }\n\n    .container {\n        display: none;\n    }\n\n    .drag {\n        position: absolute;\n        right: 7px;\n        top: 8px;\n        display: inline-block;\n        pointerEvents: none;\n    }\n",
        ),
        _this.listen("UILGraphLayout/destroy", (label) => {
          let name = label.split("-")[0];
          _this.label.includes(name) && _this.element.hide();
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILGate(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILGate"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            { _type: "UILGateLogin", refName: "login", children: [] },
            { _type: "UILGateError", refName: "error", children: [] },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.views = { login: _this.login, error: _this.error }),
        _this.createState(),
        _this.bindState(_this.state, "updateView", async function updateView(newView) {
          _this.state.currentView && (await _this.views[_this.state.currentView].animateOut());
          (_this.views[newView].animateIn(), _this.state.set("currentView", newView));
        }),
        _this.state.set("updateView", "login"),
        (_this.animateIn = function () {
          _this.element.tween({ opacity: 1 }, 500, "easeOutCubic");
        }),
        (_this.animateOut = function () {
          _this.element
            .tween({ opacity: 0 }, 500, "easeOutCubic")
            .onComplete(() => _this.destroy());
        }),
        _this.element.goob(
          "\n    & {\n        background-color: var(--color-black);\n        position: absolute;\n        inset: 0;\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        pointer-events: all;\n        opacity: 0;\n        z-index: 100001;\n    }\n\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILGateError(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILGateView),
      Inherit(_this, XComponent),
      (_this.fragName = "UILGateError"),
      (_this.contexts = "UILGateView"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function goBack() {
        _this.parent.state.set("updateView", "login");
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "gate",
              _type: "article",
              refName: "unnamed",
              children: [
                {
                  className: "gate-header",
                  _type: "header",
                  refName: "unnamed",
                  children: [
                    { _type: "div", refName: "logo", children: [] },
                    {
                      className: "version",
                      _type: "h1",
                      _innerText: "UIL v2.3",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
                {
                  className: "gate-main",
                  _type: "div",
                  refName: "unnamed",
                  children: [
                    {
                      className: "error",
                      _type: "h2",
                      _innerText: "Error",
                      refName: "unnamed",
                      children: [],
                    },
                    {
                      _type: "p",
                      _innerText: "You do not have access to this page",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
                {
                  className: "gate-footer",
                  _type: "footer",
                  refName: "unnamed",
                  children: [
                    {
                      _type: "button",
                      _innerText: "Go Back",
                      refName: "backButton",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (function initListeners() {
          _this.backButton.click(goBack);
        })(),
        _this.logo.html(UILGate.logo),
        _this.element.goob(
          "\n    & {\n        --logo-size: 25px;\n\n        opacity: 0;\n    }\n\n    .gate-header {\n        gap: var(--spacing);\n        justify-self: start;\n    }\n\n    .logo {\n        width: var(--logo-size);\n        height: var(--logo-size);\n    }\n\n    .error {\n        font-size: 64px;\n        font-weight: 300;\n        line-height: 1;\n        letter-spacing: 0.2rem;\n        margin: calc(var(--spacing) * 3) 0;\n    }\n\n    .gate-main {\n        font-size: 14px;\n        margin-bottom: calc(var(--spacing) * 3);\n    }\n\n    .gate-footer {\n        justify-self: start;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILGateLogin(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, UILGateView),
      Inherit(_this, XComponent),
      (_this.fragName = "UILGateLogin"),
      (_this.contexts = "UILGateView"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      async function openLoginModal() {
        ((_this.loginButton.div.disabled = !0),
          (_this.user = await UILRemote.auth.login()),
          _this.user.success
            ? (async function handleLogin() {
                (await _this.animateOut(), _this.parent.animateOut(), window.location.reload());
              })()
            : (async function handleError() {
                (_this.parent.state.set("updateView", "error"),
                  await _this.wait(500),
                  (_this.loginButton.div.disabled = !1));
              })());
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "gate",
              _type: "article",
              refName: "unnamed",
              children: [
                {
                  className: "gate-header",
                  _type: "header",
                  refName: "unnamed",
                  children: [
                    {
                      className: "version",
                      _type: "h1",
                      _innerText: "UIL v2.3",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
                {
                  className: "gate-main",
                  _type: "div",
                  refName: "logoContainer",
                  children: [],
                },
                {
                  className: "gate-footer",
                  _type: "footer",
                  refName: "unnamed",
                  children: [
                    {
                      _type: "button",
                      _innerText: "Log in with Google",
                      refName: "loginButton",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (function initListeners() {
          _this.loginButton.click(openLoginModal);
        })(),
        _this.logoContainer.html(UILGate.logo),
        _this.element.goob(
          "\n    & {\n        --max-spacing: 240px;\n        --logo-size: 145px;\n        --dot-size: 4px;\n    }\n\n    .gate-header {\n        justify-content: space-between;\n        width: 100%;\n    }\n    \n    .version {\n        margin-bottom: 0;\n        position: relative;\n        width: 100%;\n\n        &:after {\n            background-color: var(--color-white);\n            content: '';\n            display: block;\n            width: var(--dot-size);\n            height: var(--dot-size);\n            border-radius: 50%;\n            position: absolute;\n            right: 0;\n            top: 3px;\n        }\n    }\n\n    .gate-main {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        width: var(--logo-size);\n    }\n\n    .loginButton:disabled {\n        cursor: not-allowed !important;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(
    function UILGateView(_params, ...restArgs) {
      const _this = this;
      (Inherit(_this, Element),
        Inherit(_this, XComponent),
        (_this.fragName = "UILGateView"),
        (_this.contexts = "Element"),
        (_this.params = _params),
        (_this.args = arguments),
        (this.isFragment = !0));
      var _promises = [];
      !(async function () {
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
          (_this.params = _params),
          (_this.args = arguments),
          _this.parent?.layers && (_this.layers = _this.parent.layers),
          _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
          _this.element.hide(),
          (_this.animateIn = function () {
            _this.element.css({ opacity: 0 }).show().tween({ opacity: 1 }, 500, "easeOutCubic");
          }),
          (_this.animateOut = function () {
            return _this.element
              .tween({ opacity: 0 }, 500, "easeOutCubic")
              .onComplete(() => {
                _this.element.hide();
              })
              .promise();
          }),
          _this.element.goob(
            "\n    & {\n        opacity: 0;\n    }\n\n    .gate {\n        display: grid;\n        justify-items: center;\n        grid-template-rows: 1fr minmax(calc(var(--logo-size) + var(--spacing) * 2), calc(var(--logo-size) + var(--max-spacing))) 1fr;\n        max-height: 100%;\n    }\n\n    .gate-header {\n        display: flex;\n        align-items: center;\n    }\n\n    .version {\n        font: var(--label3);\n    }\n",
          ));
        for (let key in _this)
          if (_this[key]?.then) {
            let store = _this[key];
            (store.then((val) => (_this[key] = val)), _promises.push(store));
          }
        (_promises.length && (await Promise.all(_promises)),
          (_promises = null),
          _this.flag?.("__ready", !0),
          _this.onInit?.());
      })();
    },
    (_) => {
      UILGate.logo =
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 145 146">\n        <g fill="#F7F7F7" clip-path="url(#a)">\n            <path\n                d="M72.5.703C32.46.703 0 33.162 0 73.203c0 40.04 32.46 72.5 72.5 72.5 40.041 0 72.5-32.46 72.5-72.5 0-40.041-32.459-72.5-72.5-72.5Zm0 135.146c-34.6 0-62.646-28.047-62.646-62.646 0-34.6 28.047-62.647 62.646-62.647 34.6 0 62.646 28.047 62.646 62.647 0 34.599-28.046 62.646-62.646 62.646Z" />\n            <path\n                d="m89.002 42.766-26.976-.006-13.573 12.644s-4.06 4.033-7.464 7.523c-3.403 3.49-5.636 8.807-5.636 14.158 0 5.683 2.428 10.62 6.237 14.83a781.937 781.937 0 0 0 10.757 10.713c5.172 5.039 9.355 6.219 15.242 6.199 7.424-.025 11.03-3.311 13.602-5.638.911-.824 8.037-8.033 8.037-8.033l.01 13.651 12.903-12.551V55.903c0-8.16-5.208-13.333-13.14-13.141l.001.004Zm-.006 35.544S75.63 91.828 74.014 93.405c-2.029 1.979-3.812 2.507-6.22 2.507-2.406 0-3.64-.076-6.218-2.507-2.264-2.135-10.09-10.078-10.557-10.616-1.404-1.604-2.107-3.444-2.107-5.516 0-2.472.904-4.581 2.708-6.319l15.034-15.04L89 55.91l-.005 22.403.001-.002Z" />\n        </g>\n        <defs>\n            <clipPath id="a">\n                <path fill="#fff" d="M0 .703h145v145H0z" />\n            </clipPath>\n        </defs>\n    </svg>';
    },
  ),
  Class(
    function UILGraph(_params, ...restArgs) {
      const _this = this;
      (Inherit(_this, Element),
        Inherit(_this, XComponent),
        (_this.fragName = "UILGraph"),
        (_this.contexts = "Element"),
        (_this.params = _params),
        (_this.args = arguments),
        (this.isFragment = !0));
      var _promises = [];
      !(async function () {
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
          _this.initClass(FragUIHelper, {
            _type: "UI",
            refName: "unnamed",
            children: [
              {
                _type: "div",
                refName: "wrapper",
                children: [
                  {
                    addTo: "$body",
                    _type: "UILGraphContextMenu",
                    refName: "contextMenu",
                    children: [],
                  },
                ],
              },
            ],
          }),
          (_this.params = _params),
          (_this.args = arguments),
          _this.parent?.layers && (_this.layers = _this.parent.layers),
          _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
          (_this.body = __body));
        let _uniq = 0;
        var _layouts = {};
        (UIL.sidebar && UIL.sidebar.toolbar && UIL.sidebar.toolbar.element.hide(),
          (_this.onMounted = async function () {
            await _this.wait(1e3);
            const { x: x, y: y } = _this.element.div.getBoundingClientRect();
            _this.contextMenu.setOffset({ x: x, y: y });
          }),
          (_this.add = function (_layout) {
            _layouts[_layout.id] || ((_layouts[_layout.id] = _layout), _this.element.add(_layout));
          }),
          (_this.getGraph = function (name, layoutInstance, isGL = !0) {
            if (!UIL.sidebar) return;
            let _graph = new UILGraphLayout({
              name: name,
              layoutInstance: layoutInstance,
              isGL: isGL,
              uniq: _uniq++,
            });
            return (_this.add(_graph), _graph);
          }),
          _this.element.goob(
            "\n    position:relative;\n    width: 100%;\n    height: auto;\n    user-select: none;\n    margin-bottom: 4px;\n    border-radius: 4px;\n    background-color: #161616;\n\n",
          ));
        for (let key in _this)
          if (_this[key]?.then) {
            let store = _this[key];
            (store.then((val) => (_this[key] = val)), _promises.push(store));
          }
        (_promises.length && (await Promise.all(_promises)),
          (_promises = null),
          _this.flag?.("__ready", !0),
          _this.onInit?.());
      })();
    },
    "singleton",
    () => {
      ((UILGraph.FOCUSED = "uilgraph_focused"),
        (UILGraph.BLURRED = "uilgraph_blurred"),
        (UILGraph.GROUP_TYPE = "uilgraph_group_type"),
        (UILGraph.LAYER_TYPE = "uilgraph_layer_type"),
        (UILGraph.SPECIAL_TYPE = "uilgraph_special_type"),
        (UILGraph.LAYOUT_TYPE = "uilgraph_layout_type"),
        (UILGraph.OPEN_CONTEXT_MENU = "uilgraph_open_context_menu"),
        (UILGraph.CLOSE_CONTEXT_MENU = "uilgraph_close_context_menu"),
        (UILGraph.ACTION_DELETE = "uilgraph_action_delete"),
        (UILGraph.ACTION_LAYER = "uilgraph_action_layer"),
        (UILGraph.ACTION_GROUP = "uilgraph_action_group"),
        (UILGraph.TREE_LAST =
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAVAQMAAABFfO2wAAAABlBMVEUAAAC0tLQrlfMqAAAAAXRSTlMAQObYZgAAABFJREFUCNdjaGDAh/4fYMALACnuBsCqBlYuAAAAAElFTkSuQmCC')"),
        (UILGraph.TREE_GROUP =
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAVAQMAAABFfO2wAAAABlBMVEUAAAC0tLQrlfMqAAAAAXRSTlMAQObYZgAAABFJREFUCNdjaGDAh/4fwK8AAHduC8BoO2AxAAAAAElFTkSuQmCC')"),
        (UILGraph.TREE_LAYER =
          "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAVAQMAAABFfO2wAAAABlBMVEUAAAC0tLQrlfMqAAAAAXRSTlMAQObYZgAAAA1JREFUCNdjaGCgBAEAUE4KgSOykIMAAAAASUVORK5CYII=')"),
        (UILGraph.EYE_ICON =
          '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'),
        (UILGraph.CONFIG_ICON =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 219.9 261.5"><path d="M85.6,226.6c-1.7,1-9.2,1.2-28.7,0.9l-26.4-0.3l-6.7-3.2c-12.3-5.8-20.4-16-22.7-28.7C-0.3,187.7-0.4,41.8,1,33.4\n    c1.4-8.5,5-15.6,11-21.7C17.8,6,25.3,2,32.8,0.7C35.4,0.2,56.2-0.1,79,0c41.3,0.2,41.5,0.2,46,2.5c5.6,2.9,54.2,51,57.3,56.7\n    c2.1,3.8,2.2,5.3,2.5,36.2c0.3,31.3,0.2,32.3-1.7,34.2c-2.7,2.7-7.5,2.7-10.1,0.1c-1.9-1.9-2-3.4-2-29.3c0-14.9-0.5-29-1-31.1\n    c-0.7-3.3-4.6-7.7-24.7-27.8c-13.1-13.2-25-24.6-26.5-25.4c-2.2-1.1-9.9-1.4-42.6-1.4c-45.2,0-46.1,0.1-53.5,7.4\n    c-8,7.8-7.7,3.9-7.7,91.1c0,84.9-0.1,83.3,6.2,90.9c1.7,2.1,5.4,4.9,8.2,6.2c4.9,2.3,6,2.4,29.3,2.4c16,0,25.1,0.4,26.7,1.1\n    C90.3,216.1,90.5,224,85.6,226.6z M78,85.5c27.7-0.3,29.9-0.4,31.9-2.2c2.9-2.6,2.9-8.6,0-11.2c-2-1.8-4.2-1.9-32.3-2.1\n    c-24.3-0.2-30.7,0-33.3,1.1c-6,2.7-5.7,10.7,0.3,13.2C47.6,85.6,53.4,85.8,78,85.5z M43.8,131.2h47.5c45.3,0,47.6-0.1,49.6-1.9\n    c2.7-2.5,2.8-7.9,0.1-10.6c-1.9-1.9-3.3-2-49.3-2H44.3l-2.1,2.3c-2.7,2.9-2.8,6.7-0.3,9.8L43.8,131.2z M219.8,209.8\n    c-0.5,8.9-1.4,10.4-7.6,13c-2.7,1.2-4.2,2.4-3.8,3.2c1.9,4.6,2.8,8.9,2.3,10.9c-0.8,3.1-12.4,14.7-15.5,15.5\n    c-2,0.5-6.4-0.4-10.9-2.3c-0.6-0.3-2,1.3-3.1,3.8c-1,2.4-2.6,4.9-3.5,5.6c-2.2,1.9-15.3,2.7-20.5,1.3c-3.6-1-4.6-1.9-6.8-6.2\n    c-2-4-2.9-4.9-4.2-4.4c-5.7,2.4-7.1,2.7-9.5,2.1c-3.4-0.8-14.1-10.8-15.7-14.6c-1.1-2.5-1-3.7,0.4-7.3c0.9-2.3,1.6-4.6,1.6-4.9\n    c0-0.4-2-1.6-4.4-2.7c-6-2.6-7-4.9-7-15.8c-0.1-8.3,0.2-9.4,2.3-11.7c1.3-1.4,3.9-3,5.7-3.6c3.9-1.3,3.9-1.5,1.9-6.3\n    c-0.8-2-1.5-4.5-1.5-5.6c0-2.6,7.8-12,12.9-15.5c4.3-3,5.7-3,13.6,0.1c0.9,0.3,2.3-1.4,3.9-4.6c1.7-3.3,3.4-5.2,4.9-5.5\n    c1.2-0.3,3.1-0.7,4.2-1c2.4-0.6,14.7,0.2,17,1c0.9,0.4,2.7,2.8,4.1,5.5c1.3,2.7,2.8,4.9,3.3,4.9s2.5-0.7,4.4-1.5c6-2.5,7.3-2,15.2,6\n    c8.2,8.1,8.7,9.5,5.9,16.5c-0.9,2.3-1.5,4.2-1.3,4.3c0.2,0.1,2.5,1.2,5.1,2.4C219.1,195.2,220.4,198.8,219.8,209.8z M205,207.7\n    c0-2.1-0.9-3-4.5-4.8c-4.7-2.3-8.5-7.1-8.5-10.8c0-1.2,0.7-4.1,1.5-6.4c1.4-3.9,1.4-4.5-0.1-6.1c-1.4-1.6-1.9-1.6-6-0.2\n    c-8.4,2.9-14.1,0.5-17.6-7.5c-2.6-5.7-5.8-5.8-8.3-0.3c-3.6,8.1-10.2,10.9-18,7.7c-3.7-1.6-4-1.6-5.7,0.2c-1.8,1.7-1.8,2-0.2,5.7\n    c3.2,7.8,0.4,14.4-7.7,18c-5.7,2.6-5.4,5.8,0.7,8.7c7.7,3.5,10.2,10.2,6.9,18.1c-1.3,3.2-1.3,3.6,0.5,5.2s2.2,1.7,6.2,0\n    c7.4-2.9,13.8-0.2,17.3,7.4c2.7,6,5.5,5.6,9.2-1.2c2.3-4.3,3.5-5.5,7-6.7c3.8-1.3,4.7-1.2,9.4,0.4c4.7,1.7,5.2,1.7,6.7,0.2\n    c1.5-1.4,1.5-2-0.2-6.6c-1.1-3.1-1.5-6-1.1-7.9c0.8-3.7,4.7-7.7,9.1-9.3C204.3,210.6,205,209.7,205,207.7z M175.7,228.3\n    c-12.3,5.7-25.7,1-31.3-11c-4.5-9.7-2.4-19.7,5.7-27c2.7-2.4,6.6-4.8,8.6-5.4c5.4-1.4,7.3-1.4,12.9,0.3\n    C192.2,191.3,194.9,219.3,175.7,228.3z M171.1,201.6c-3.6-3.6-7-3.7-11-0.3c-2.4,2-3.1,3.4-3.1,6c0,7.7,9.4,11.3,14.5,5.8\n    C174.9,209.4,174.8,205.3,171.1,201.6z M110,164.7c-1.9-1.9-3.3-2-34-2s-32.1,0.1-34,2c-3,3-2.7,8.3,0.6,10.9\n    c2.6,2,3.8,2.1,33.5,2.1c30.5,0,30.8,0,33.3-2.3C113,172.2,113.3,168,110,164.7z"/></svg>'),
        (UILGraph.TIMELINE_ICON =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 248.6 232"><path d="M245.3,145.4c-6.8,26.1-24.7,51.4-46.9,66.4c-20.7,13.9-41.2,20.2-66.2,20.2c-28.7-0.1-53.1-9.2-75.7-28.5\n    c-8-6.9-21.3-22.9-20.3-24.5c0.5-0.8,16.7-12.4,20.1-14.4c0.7-0.4,3.2,2,6,5.9c12.3,16.8,33.4,29.6,55,33.4c11.5,2,31,0.9,41.4-2.5\n    c36.7-11.8,61.1-42.8,62.7-79.7c1.3-27-6.6-48.3-24.6-67.2C163,19.2,108,17.7,72.3,51c-16.1,15.1-26.2,34.7-28.2,55.1l-0.7,7.1\n    l9.7-0.5c5.3-0.2,9.6-0.2,9.6,0s-7.3,9.5-16.1,20.8l-16.1,20.4l-15.2-20.2L0,113.4l8.2-0.3l8.2-0.3l0.7-7.9\n    C20.2,67.1,45.3,30.3,80,12.8c9.7-4.9,23-9.4,33.3-11.3c9.4-1.7,26.3-2,35.4-0.6c46.2,7,83.7,40,95.9,84.1\n    C249.7,103.8,250,127.2,245.3,145.4z M141.9,83.7L141.7,59l-2.7-2c-3.7-3-9.7-2.8-12.8,0.4l-2.5,2.4v31.1V122l2.5,2.4l2.4,2.5h30.5\n    c29.9,0,30.6,0,32.5-2.1c2.9-3.1,3.5-7.1,1.7-11.3c-0.8-2-1.6-3.7-1.8-3.8c-0.2-0.1-11.3-0.5-24.8-0.8l-24.5-0.5L141.9,83.7z\n     M87.1,66.9l-3.4,3.5l-3.4,3.5l6.9,7l7,7l3.5-3.5l3.5-3.5l-7-7L87.1,66.9z M171.7,88.4l7-7l7-7.1l-3.8-3.7l-3.8-3.7l-6.9,7l-7,7\n    l3.8,3.7L171.7,88.4z M67.7,110.9v5v5h10h10v-5v-5h-10H67.7z M90.2,152.9l-7,7l3.5,3.5l3.5,3.5l7-7l7-7l-3.5-3.5l-3.5-3.5\n    L90.2,152.9z M164.7,149.4l-3.4,3.5l6.9,7l6.9,7l3.8-3.7l3.8-3.7l-6.7-6.8c-3.7-3.7-7-6.8-7.3-6.8S166.6,147.5,164.7,149.4z\n     M127.7,170.4v9.5h5h5v-9.5v-9.5h-5h-5V170.4z"/></svg>'));
    },
  ),
  Class(
    function UILGraphContextMenu(_params, ...restArgs) {
      const _this = this;
      (Inherit(_this, Element),
        Inherit(_this, XComponent),
        (_this.fragName = "UILGraphContextMenu"),
        (_this.contexts = "Element"),
        (_this.params = _params),
        (_this.args = arguments),
        (this.isFragment = !0));
      var _promises = [];
      !(async function () {
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
          _this.initClass(FragUIHelper, {
            _type: "UI",
            refName: "unnamed",
            children: [
              {
                _type: "div",
                refName: "wrapper",
                children: [
                  {
                    _type: "div",
                    refName: "buttons",
                    children: [
                      {
                        view: "UILGraphContextMenuButton",
                        data: "$buttonsData",
                        _type: "ViewState",
                        refName: "unnamed",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          }),
          (_this.params = _params),
          (_this.args = arguments),
          _this.parent?.layers && (_this.layers = _this.parent.layers),
          _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
        const {
            LAYOUT_TYPE: LAYOUT_TYPE,
            STAGE_LAYOUT_TYPE: STAGE_LAYOUT_TYPE,
            GROUP_TYPE: GROUP_TYPE,
            LAYER_TYPE: LAYER_TYPE,
            SPECIAL_TYPE: SPECIAL_TYPE,
          } = UILGraph,
          {
            ACTION: ACTION,
            DELETE: DELETE,
            COPY_LAYOUT: COPY_LAYOUT,
            PASTE_LAYOUT: PASTE_LAYOUT,
            ADD_LAYER: ADD_LAYER,
            COPY_LAYER: COPY_LAYER,
            PASTE_LAYER: PASTE_LAYER,
            DUPLICATE_LAYER: DUPLICATE_LAYER,
            CINEMA: CINEMA,
            FIGMA: FIGMA,
            ADD_GROUP: ADD_GROUP,
            DUPLICATE_GROUP: DUPLICATE_GROUP,
          } = UILGraphContextMenu,
          _sourceButtonsData = [
            {
              label: "Add Layer",
              uilContexts: [GROUP_TYPE, STAGE_LAYOUT_TYPE, LAYOUT_TYPE],
              action: ADD_LAYER,
            },
            {
              label: "Copy Layer",
              uilContexts: [LAYER_TYPE],
              action: COPY_LAYER,
            },
            {
              label: "Paste Layer",
              uilContexts: [LAYOUT_TYPE, GROUP_TYPE, LAYER_TYPE],
              action: PASTE_LAYER,
            },
            {
              label: "Duplicate Layer",
              uilContexts: [STAGE_LAYOUT_TYPE, LAYER_TYPE],
              action: DUPLICATE_LAYER,
            },
            {
              label: "Add Group",
              uilContexts: [LAYOUT_TYPE, GROUP_TYPE],
              action: ADD_GROUP,
            },
            {
              label: "Duplicate Group",
              uilContexts: [GROUP_TYPE, STAGE_LAYOUT_TYPE],
              action: DUPLICATE_GROUP,
            },
            {
              label: "Copy Layout",
              uilContexts: [LAYOUT_TYPE],
              action: COPY_LAYOUT,
            },
            {
              label: "Paste Layout",
              uilContexts: [LAYOUT_TYPE],
              action: PASTE_LAYOUT,
            },
            { label: "Apply Figma Config", uilContexts: [], action: FIGMA },
            {
              label: "Delete",
              uilContexts: [GROUP_TYPE, STAGE_LAYOUT_TYPE, LAYER_TYPE],
              action: DELETE,
            },
          ],
          specialCases = {};
        ((specialCases[CINEMA] = [() => "Config" == _this.get("UIL/ContextMenu").targetId]),
          (specialCases[FIGMA] = [() => _this.get("UIL/ContextMenu").targetId.endsWith("Root")]),
          (_this.buttonsData = new StateArray([])),
          (_this.offset = {}),
          _this.element.hide(),
          window.addEventListener("click", () => _this.set("UIL/ContextMenu", null)),
          _this.bind("UIL/ContextMenu", (openContext) => {
            if (!openContext)
              return (function hideContextMenu() {
                return (_this.element.mouseEnabled(!1), _this.element.hide());
              })();
            (!(function filterButtons(context) {
              if (!context) return;
              _this.buttonsData.refresh(
                JSON.parse(JSON.stringify(_sourceButtonsData)).filter(
                  (b) =>
                    b.uilContexts.includes(context.type) ||
                    (specialCases[b.action] &&
                      specialCases[b.action].map((fn) => fn()).reduce((a, b) => a() || b())),
                ),
              );
            })(openContext),
              (function positionAndShowContextMenu() {
                const margin = 7;
                let x = Mouse.x + margin - _this.offset.x;
                x > Stage.width - 160 && (x = Mouse.x - 160 - margin - _this.offset.x);
                let y = Mouse.y + margin - _this.offset.y;
                y > Stage.height - 75 && (y = Mouse.y - 75 - margin - _this.offset.y);
                ((y += UIL.global.element.div.querySelector(".UILTabsContentItem").scrollTop),
                  _this.element.transform({ x: x, y: y }),
                  _this.element.show());
              })(),
              _this.element.mouseEnabled(!0));
          }),
          (_this.setOffset = ({ x: x, y: y }) => (_this.offset = { x: x, y: y })),
          _this.element.goob(
            "\n    position: absolute;\n    width: auto;\n    height: auto;\n    padding-top: 10px;\n    padding-bottom: 10px;\n    color: black;\n    background-color: #303030;\n    border-radius: 12px;\n    line-height: 2px;\n    overflow: hidden;\n    user-select: none;\n    z-index: 999999;\n",
          ));
        for (let key in _this)
          if (_this[key]?.then) {
            let store = _this[key];
            (store.then((val) => (_this[key] = val)), _promises.push(store));
          }
        (_promises.length && (await Promise.all(_promises)),
          (_promises = null),
          _this.flag?.("__ready", !0),
          _this.onInit?.());
      })();
    },
    "",
    () => {
      ((UILGraphContextMenu.ACTION = "uilgraph_action"),
        (UILGraphContextMenu.DELETE = "uilgraph_delete"),
        (UILGraphContextMenu.COPY_LAYOUT = "uilgraph_copy_layout"),
        (UILGraphContextMenu.PASTE_LAYOUT = "uilgraph_paste_layout"),
        (UILGraphContextMenu.ADD_LAYER = "uilgraph_add_layer"),
        (UILGraphContextMenu.COPY_LAYER = "uilgraph_copy_layer"),
        (UILGraphContextMenu.PASTE_LAYER = "uilgraph_paste_layer"),
        (UILGraphContextMenu.DUPLICATE_LAYER = "uilgraph_duplicate_layer"),
        (UILGraphContextMenu.CINEMA = "uilgraph_cinema"),
        (UILGraphContextMenu.FIGMA = "uilgraph_figma"),
        (UILGraphContextMenu.ADD_GROUP = "uilgraph_add_group"),
        (UILGraphContextMenu.DUPLICATE_GROUP = "uilgraph_duplicate_group"));
    },
  ),
  Class(function UILGraphContextMenuButton(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, ViewStateElement),
      Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILGraphContextMenuButton"),
      (_this.contexts = "ViewStateElement,Element"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          click: "$onClick",
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "div",
              _innerText: "$data.label",
              refName: "button",
              children: [],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.bind("UILGraphContextMenu/open", (openContext) => {
          if (
            (openContext || _this.element.hide(),
            _this.data.targetNodeCases.reduce((a, b) => a() || b()))
          )
            return _this.element.show();
          const action = _this.data.uilContexts.includes(openContext.type) ? "show" : "hide";
          _this.element[action]();
        }),
        (_this.onClick = function () {
          _this.fire("GraphContextMenu/action", _this.data.action);
        }),
        _this.element.goob(
          "\n    position: relative;\n    width: 100%;\n    height: 27px;\n    display: flex;\n    flex-direction: row;\n    align-items: center;\n    cursor: default;\n    box-sizing: border-box;\n    padding: 0 18px;\n    user-select: none;\n    transition: background-color 300ms ease-in-out, color 300ms ease-in-out;\n    background-color: transparent;\n    color: white;\n    font-family: sans-serif;\n    font-size: 11px;\n\n    &:hover {\n        color: #fff;\n        background-color: #525252;\n    }\n\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILGraphGroup(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, ViewStateElement),
      Inherit(_this, Element),
      Inherit(_this, DragAndDrop),
      Inherit(_this, XComponent),
      (_this.fragName = "UILGraphGroup"),
      (_this.contexts = "ViewStateElement,Element,DragAndDrop"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "div",
              refName: "wrapper",
              children: [
                {
                  _type: "div",
                  refName: "dropTarget",
                  children: [{ _type: "div", refName: "highlight", children: [] }],
                },
                {
                  click: "$onClick",
                  _type: "div",
                  refName: "header",
                  children: [
                    {
                      click: "$toggleClick",
                      _type: "div",
                      refName: "toggleButton",
                      children: [],
                    },
                    { _type: "div", refName: "typeIcon", children: [] },
                    {
                      tabIndex: 1,
                      _type: "div",
                      refName: "title",
                      children: [
                        {
                          _type: "div",
                          _innerText: "$data.name",
                          refName: "titleText",
                          children: [],
                        },
                        {
                          value: "$data.name",
                          _type: "input",
                          refName: "titleField",
                          children: [],
                        },
                      ],
                    },
                    {
                      type: "group",
                      data: "$data",
                      layoutId: "$params.layoutId",
                      _type: "UILGraphNodeMenu",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
                {
                  data: "$data",
                  layoutId: "$params.layoutId",
                  _type: "UILGraphGroupChildren",
                  refName: "unnamed",
                  children: [],
                },
              ],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      function handleNodeFocused(val) {
        if (!_this.data) return;
        let focusedNode;
        (_this.data.children?.forEach((node) => {
          ((node.focused = val == node.id), node.focused && (focusedNode = node));
        }),
          focusedNode &&
            (UIL.sidebar.toolbar.filterSingle(val),
            Storage.set(`UIL:${_this.params.layoutId}/Graph/focused`, val),
            _this.events.fire(UILGraphNode.FOCUSED, {
              name: focusedNode.name,
              layoutInstance: _this.params.layoutInstance,
            })));
      }
      function handleMoveNode(e) {
        if (!_this.data || !_this.data.children) return;
        const find = (id) => {
          let found;
          return (
            _this.data.children.forEach((node) => {
              node.id == id && (found = node);
            }),
            found
          );
        };
        let moveNode = find(e.moveId),
          targetNode = find(e.targetId);
        try {
          if (!moveNode.parent || moveNode.parent != targetNode?.parent) return;
        } catch (e) {
          return;
        }
        if (
          (1 == _this.data.children.length && (moveNode.sortIndex = 0), "end-of-list" == e.type)
        ) {
          let oldIndex = moveNode.sortIndex;
          (_this.data.children.forEach((node) => {
            node.parent || (node.sortIndex > oldIndex && (node.sortIndex -= 1));
          }),
            (moveNode.sortIndex = _this.data.children.length - 1),
            _this.data.children.sort((a, b) => a.sortIndex - b.sortIndex));
        } else {
          let oldIndex = moveNode.sortIndex;
          if (
            (_this.data.children.forEach((node) => {
              node.sortIndex > oldIndex && (node.sortIndex -= 1);
            }),
            "before" == e.type)
          ) {
            let newIndex = targetNode.sortIndex;
            (_this.data.children.forEach((node) => {
              node.sortIndex >= newIndex && (node.sortIndex += 1);
            }),
              (moveNode.sortIndex = newIndex));
          }
          (_this.data.children.sort((a, b) => a.sortIndex - b.sortIndex), healSort());
        }
      }
      function healSort() {
        let lastIndex = -1;
        _this.data.children.forEach((node) => {
          let delta = node.sortIndex - lastIndex;
          (delta > 1 && (node.sortIndex -= delta - 1), (lastIndex = node.sortIndex));
        });
      }
      async function handleContextMenuAction(event) {
        if (!_this.get) return;
        const context = _this.get("UIL/ContextMenu");
        if (
          context &&
          context.layoutId == _this.params.layoutId &&
          event === UILGraphContextMenu.DELETE
        ) {
          let foundNode;
          if (
            (_this.data.children.forEach((node) => {
              node.id == context.targetId && (foundNode = node);
            }),
            foundNode)
          ) {
            _this.params.bridge.deleteNode(foundNode) &&
              (_this.data.children.forEach((node) => {
                node.sortIndex > foundNode.sortIndex && (node.sortIndex -= 1);
              }),
              _this.data.children.remove(foundNode));
          }
          healSort();
        }
      }
      function onKey(event) {
        return "enter" == event.key.toLowerCase()
          ? (function onTitleValidate(event) {
              ((function rename(name) {
                let previousName = _this.data.nameLabel;
                (_this.data.set("nameLabel", name),
                  _this.title.text(_this.data.nameLabel),
                  _this.titleField.val(_this.data.nameLabel),
                  _this.events.fire(UILGraphNode.RENAMED, {
                    layoutId: _this.data.layoutId,
                    id: _this.data.id,
                    name: previousName,
                    value: _this.data.nameLabel,
                  }),
                  _this.data.set("name", name),
                  (_this.name = name));
              })(_this.titleField.val()),
                hideTitleEditor());
            })()
          : "escape" == event.key.toLowerCase()
            ? hideTitleEditor()
            : void 0;
      }
      function showTitleEditor() {
        (_this.titleField.show(), _this.titleField.div.focus(), _this.titleField.div.select());
      }
      function hideTitleEditor() {
        _this.titleField.hide();
      }
      function openContextMenu(e) {
        (e.preventDefault(),
          _this.set("UIL/ContextMenu", {
            layoutId: _this.params.layoutId,
            targetId: _this.data.id,
            parentId: _this.data.parentId?.split(`${_this.data.scene}_`)[1],
            name: _this.data.name,
            type: UILGraph.GROUP_TYPE,
            isStageLayout: _this.data.isStageLayout,
          }));
      }
      ((_this.id = _this.data.id),
        (_this.name = _this.data.name),
        (_this.nameLabel = _this.data.name),
        (_this.isGraphGroup = !0),
        (_this.sortOrder = _this.params.order),
        _this.typeIcon.html(UILGraphLayout.GROUP_ICON),
        _this.toggleButton.html(UILGraphLayout.ARROW_ICON),
        _this.toggleButton.classList()[_this.data.open ? "remove" : "add"]("closed"),
        _this.titleField.hide(),
        (_this.onClick = function (e) {
          e.target.getAttribute("class")?.indexOf("toggleButton") > -1 ||
            e.target.getAttribute("class")?.indexOf("arrow") > -1 ||
            _this.fire(`UIL/${_this.params.layoutId}/UILGraph/node/focused`, _this.data.id);
        }),
        _this.data.set("open", !0),
        (_this.toggleClick = (_) => {
          (_this.data.set("open", !_this.data.open),
            _this.fire("UILGraphGroup/open", {
              open: _this.data.open,
              id: _this.data.id,
              layoutId: _this.data.layoutId,
            }));
        }),
        _this.bind(_this.data, "open", (val) =>
          _this.toggleButton?.classList?.()[val ? "remove" : "add"]("closed"),
        ),
        _this.bind(_this.data, "locked", (value) => {
          (_this.wrapper.css({ pointerEvents: value ? "none" : "auto" }),
            _this.setDragEnabled(!value));
        }),
        (function addHandlers() {
          (_this.header.div.addEventListener("contextmenu", openContextMenu),
            _this.element.div.addEventListener("mousedown", _this.addDragListeners, !1),
            window.addEventListener("mouseup", _this.removeDragListeners, !1),
            _this.header.div.addEventListener("dblclick", showTitleEditor, !1),
            _this.titleField.div.addEventListener("keyup", onKey, !1),
            _this.titleField.div.addEventListener("blur", hideTitleEditor, !1),
            _this.bind(`UIL/${_this.params.layoutId}/UILGraph/node/focused`, handleNodeFocused),
            _this.listen("UILGraph/MoveNode", handleMoveNode),
            _this.listen("GraphContextMenu/action", handleContextMenuAction));
        })(),
        _this.header.classList()[_this.data.selected ? "add" : "remove"]("focused"),
        _this.bind(_this.data, "focused", (val) => {
          if (!_this.header) return;
          const focusedAction = val ? "add" : "remove";
          _this.header.classList()[focusedAction]("focused");
        }),
        (_this.onMounted = function () {
          (_this.element.div.classList.add("UILGraphNode"),
            _this.header.css({ paddingLeft: 32 * _this.data.depth + "px" }),
            _this.setDragElement(_this.header),
            _this.data.locked &&
              (_this.wrapper.css({ pointerEvents: "none" }),
              _this.data.special || _this.setDragEnabled(!1)));
        }),
        (_this.onDrop = function (dropId) {
          _this.fire("UILGraph/MoveNode", {
            moveId: dropId,
            targetId: _this.data.id,
            type: "before",
          });
        }),
        _this.element.goob(
          `\n    position: relative;\n    width: 300px;\n    height: auto;\n    font-family: sans-serif;\n    font-size: 11px;\n    width: 100%;\n    cursor: grab;\n\n    & > .wrapper > .header {\n        width: 100%;\n        height: auto;\n        outline: none;\n        display: flex;\n        flex-direction: row;\n        align-items: center;\n        padding: 9px;\n        padding-left: 32px;\n        box-sizing: border-box;\n        user-select: none;\n        border: 1px solid rgba(26, 109, 234, 0);\n    }\n\n    & > .wrapper > .header {\n        transition: border-color 200ms, background-color 200ms;\n    }\n\n    & > .wrapper > .header:hover {\n        border: 1px solid rgba(26, 109, 234, 1);\n    }\n\n\n    & > .wrapper > .header.focused {\n        background-color: rgba(26, 109, 234, 1);\n    }\n\n    & > .wrapper > .header.focused:hover {\n        border: 1px solid rgba(26, 109, 234, 0);\n    }\n\n    .toggleButton {\n        position: absolute;\n        width: 32px;\n        height: auto;\n        box-sizing: border-box;\n        text-align: center;\n        padding: 9px;\n        margin-left: -32px;\n        transform: rotate(180deg);\n        opacity: 0.6;\n        transition: opacity 200ms;\n    }\n\n    .toggleButton:hover {\n        opacity: 1;\n    }\n\n    .toggleButton.closed {\n        transform: rotate(0deg);\n    }\n\n    .toggleButton path {\n        fill: var(--color-white);\n    }\n\n    .typeIcon {\n        margin-right: 9px;\n        margin-left: -4px;\n    }\n\n    .typeIcon path {\n        fill: var(--color-white);\n    }\n\n    .typeIcon rect {\n        stroke: var(--color-white);\n    }\n\n    .title {\n        display: block;\n        verticalAlign: middle;\n    }\n\n    .titleField {\n        background-color: #b1b1b1;\n        position: absolute !important;\n        display: inline-block;\n        margin-left: ${30 * (_this.data.depth - 1)}px;\n        top: 4px;\n        left: 32px;\n        width: auto !important;\n        padding: 9px !important;\n        verticalAlign: middle;\n        fontWeight: bold;\n        border: 0;\n        outline: none;\n        z-index: 1;\n    }\n\n    .UILGraphNodeMenu {\n        position: absolute;\n        right: 0;\n    }\n\n    .visibilityButton {\n    }\n\n    .UILGraphGroupChildren {\n        overflow: hidden;\n        margin-top: -4px;\n    }\n\n`,
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILGraphGroupChildren(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, DragAndDrop),
      Inherit(_this, XComponent),
      (_this.fragName = "UILGraphGroupChildren"),
      (_this.contexts = "Element,DragAndDrop"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "div",
              refName: "wrapper",
              children: [
                {
                  _type: "div",
                  refName: "items",
                  children: [
                    {
                      view: "UILGraphLayer",
                      data: "$params.data.children",
                      layoutId: "$params.layoutId",
                      _type: "ViewState",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
                {
                  _type: "div",
                  refName: "dropTarget",
                  children: [{ _type: "div", refName: "highlight", children: [] }],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.setDragEnabled(!1),
        _this.items.classList()[_this.params.data.open ? "remove" : "add"]("hidden"),
        _this.bind(_this.params.data, "open", (val) =>
          _this.items?.classList?.()[val ? "remove" : "add"]("hidden"),
        ),
        (_this.onDrop = function (dropId) {
          _this.fire("UILGraph/MoveNode", {
            moveId: dropId,
            targetId: _this.params.data.id,
            type: "end-of-list",
          });
        }),
        _this.element.goob(
          `\n    & > .wrapper > .items.hidden {\n        display: none;\n    }\n\n    & > .wrapper > .dropTarget {\n        margin-bottom: 0;\n        margin-left: ${32 * _this.params.data.depth}px;\n        height: 6px;\n    }\n`,
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILGraphLayer(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, ViewStateElement),
      Inherit(_this, Element),
      Inherit(_this, DragAndDrop),
      Inherit(_this, XComponent),
      (_this.fragName = "UILGraphLayer"),
      (_this.contexts = "ViewStateElement,Element,DragAndDrop"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              click: "$onClick",
              _type: "div",
              refName: "wrapper",
              children: [
                { _type: "div", refName: "line", children: [] },
                {
                  _type: "div",
                  refName: "dropTarget",
                  children: [{ _type: "div", refName: "highlight", children: [] }],
                },
                {
                  tabIndex: 1,
                  _type: "a",
                  refName: "header",
                  children: [
                    { _type: "div", refName: "typeIcon", children: [] },
                    {
                      tabIndex: 1,
                      _type: "div",
                      refName: "title",
                      children: [
                        {
                          _type: "div",
                          _innerText: "$data.titleString",
                          refName: "titleInner",
                          children: [],
                        },
                        {
                          value: "$data.name",
                          _type: "input",
                          refName: "titleField",
                          children: [],
                        },
                      ],
                    },
                    {
                      type: "layer",
                      data: "$data",
                      _type: "UILGraphNodeMenu",
                      refName: "nodemenu",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      function onKey(event) {
        return "enter" == event.key.toLowerCase()
          ? (function onTitleValidate(event) {
              ((function rename(name) {
                let previousName = _this.data.name;
                (_this.data.set("nameLabel", name),
                  _this.title.text(_this.data.nameLabel),
                  _this.titleField.val(_this.data.nameLabel),
                  _this.events.fire(UILGraphNode.RENAMED, {
                    layoutId: _this.data.layoutId,
                    id: _this.data.id,
                    name: previousName,
                    value: _this.data.nameLabel,
                  }),
                  _this.data.set("name", name),
                  (_this.name = name));
              })(_this.titleField.val()),
                hideTitleEditor());
            })()
          : "escape" == event.key.toLowerCase()
            ? hideTitleEditor()
            : void 0;
      }
      function showTitleEditor() {
        _this.data.special ||
          (_this.titleField.show(), _this.titleField.div.focus(), _this.titleField.div.select());
      }
      function hideTitleEditor() {
        _this.titleField.hide();
      }
      function openContextMenu(e) {
        (e.preventDefault(),
          _this.set("UIL/ContextMenu", {
            layoutId: _this.params.layoutId,
            targetId: _this.data.id,
            parentId: _this.data.parentId?.split(`sl_${_this.data.scene}_`)[1],
            name: _this.data.name,
            type: _this.data.special ? UILGraph.SPECIAL_TYPE : UILGraph.LAYER_TYPE,
            isStageLayout: _this.data.isStageLayout,
          }));
      }
      ((_this.data.titleString = _this.data.label || _this.data.name),
        _this.titleField.hide(),
        _this.data.special &&
          (_this.typeIcon.hide(), _this.dropTarget.hide(), _this.setDragEnabled(!1)),
        _this.data.locked &&
          (_this.wrapper.css({ pointerEvents: "none" }),
          _this.data.special || _this.setDragEnabled(!1)),
        (function addHandlers() {
          (_this.header.div.addEventListener("contextmenu", openContextMenu),
            _this.header.div.addEventListener("dblclick", showTitleEditor, !1),
            _this.titleField.div.addEventListener("keyup", onKey, !1),
            _this.titleField.div.addEventListener("blur", hideTitleEditor, !1));
        })(),
        _this.bind(_this.data, "locked", (value) => {
          (_this.wrapper.css({ pointerEvents: value ? "none" : "auto" }),
            _this.data.special || _this.setDragEnabled(!value));
        }),
        (_this.onDrop = function (dropId) {
          _this.fire("UILGraph/MoveNode", {
            moveId: dropId,
            targetId: _this.data.id,
            type: "before",
          });
        }),
        _this.wrapper.classList()[_this.data.focused ? "add" : "remove"]("focused"),
        _this.bind(_this.data, "focused", (val) => {
          _this.wrapper?.classList()[val ? "add" : "remove"]("focused");
        }),
        "UILGraphLayout" == _this.parent.parent.fragName
          ? _this.line.hide()
          : _this.line
              .size(25, 25)
              .html(UILGraphLayout.LINE_ELBOW)
              .css({ left: 12, top: 2, position: "absolute" }),
        (_this.onMounted = function () {
          (_this.element.div.classList.add("UILGraphNode"),
            _this.header.css({ paddingLeft: 32 * _this.data.depth + "px" }));
        }),
        (_this.onClick = function () {
          _this.fire(`UIL/${_this.params.layoutId}/UILGraph/node/focused`, _this.data.id);
        }),
        _this.element.goob(
          `\n    position: relative;\n    height: auto;\n    width: 100%;\n    cursor: grab;\n\n    & > .wrapper {\n        width: 100%;\n        border: 1px solid transparent;\n        transition: border-color 200ms, background-color 200ms;\n\n    }\n\n    & > .wrapper:hover {\n        border: 1px solid #1A6DEA;\n    }\n\n    & > .wrapper:active {\n        cursor: grabbing !important;\n    }\n\n    & > .wrapper.focused {\n        background-color: #1A6DEA;\n    }\n\n    & > .wrapper.focused:hover {\n        border: 1px solid transparent;\n    }\n\n    & > .wrapper.dragging {\n        background-color: transparent;\n    }\n\n    & > .wrapper.dragging:hover {\n        border: 1px solid #1A6DEA;\n    }\n\n\n    & > .wrapper.focused.dragging {\n        background-color: transparent;\n    }\n\n    & > .wrapper.focused.dragging:hover {\n        border: 1px solid #1A6DEA;\n    }\n\n    .header {\n        color: var(--color-white);\n        display: flex;\n        flex-direction: row;\n        align-items: center;\n        width: 100%;\n        height: auto;\n        outline: none;\n        padding: 9px;\n        padding-left: 0;\n        box-sizing: border-box;\n        user-select: none;\n        padding-left: 32px;\n    }\n\n    .typeIcon {\n        height: 8px;\n        width: 8px;\n        border: 1px solid #737373;\n        margin-left: 0 !important;\n        margin-right: 9px;\n    }\n\n    .UILGraphNodeMenu {\n        position: absolute;\n        right: 0;\n    }\n\n    .title {\n        display: block;\n        verticalAlign: middle;\n    }\n\n    .titleField {\n        background-color: #b1b1b1;\n        position: absolute !important;\n        display: inline-block;\n        margin-left: ${28 * (_this.data.depth - 1)}px;\n        top: 2px;\n        left: 36px;\n        width: auto !important;\n        padding: 8px !important;\n        verticalAlign: middle;\n        fontWeight: bold;\n        border: 0;\n        outline: none;\n        z-index: 1;\n    }\n\n    & > .wrapper > .dropTarget {\n        margin-left: ${32 * (_this.data.depth - 1)}px;\n    }\n\n`,
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(
    function UILGraphLayout(_params, ...restArgs) {
      const _this = this;
      (Inherit(_this, Element),
        Inherit(_this, DragAndDrop),
        Inherit(_this, XComponent),
        (_this.fragName = "UILGraphLayout"),
        (_this.contexts = "Element,DragAndDrop"),
        (_this.params = _params),
        (_this.args = arguments),
        (this.isFragment = !0));
      var _promises = [];
      (async function () {
        function createStateArray(array) {
          return new StateArray(array || []);
        }
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
          _this.initClass(FragUIHelper, {
            _type: "UI",
            refName: "unnamed",
            children: [
              {
                _type: "div",
                refName: "wrapper",
                children: [
                  {
                    tabIndex: 1,
                    _type: "div",
                    refName: "header",
                    children: [
                      { _type: "div", refName: "toggle", children: [] },
                      {
                        _type: "div",
                        _innerText: "$params.name",
                        refName: "title",
                        children: [],
                      },
                    ],
                  },
                  {
                    _type: "div",
                    refName: "children",
                    children: [
                      {
                        _type: "div",
                        refName: "viewstate",
                        children: [
                          {
                            view: "$determineView",
                            data: "$nodes",
                            layoutId: "$id",
                            bridge: "$groupBridge",
                            layoutInstance: "$layoutInstance",
                            _type: "ViewState",
                            refName: "layers",
                            children: [],
                          },
                        ],
                      },
                      {
                        _type: "div",
                        refName: "dropTarget",
                        children: [{ _type: "div", refName: "highlight", children: [] }],
                      },
                    ],
                  },
                ],
              },
            ],
          }),
          (_this.params = _params),
          (_this.args = arguments),
          _this.parent?.layers && (_this.layers = _this.parent.layers),
          _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
        var _isOpen = !1,
          _isFocused = !1,
          _saveEnabled = !1,
          _isGL = !0 === _this.params.isGL,
          _layoutInstance = _this.params.layoutInstance,
          _isStageLayout = _layoutInstance.isStageLayout;
        function handleParentBinding(node) {
          _this.bind(node, "parent", (val, prevValue) => {
            val
              ? _this.groupBridge.groups.forEach((n) => {
                  n.id.includes(val) &&
                    !n.children.includes(node) &&
                    (n.children.push(node),
                    _this.nodes.remove(node),
                    1 == n.children.length && (node.sortIndex = 0));
                })
              : prevValue &&
                _this.groupBridge.groups.forEach((n) => {
                  n.id.includes(prevValue) &&
                    (n.children.remove(node),
                    _this.nodes.push(node),
                    (node.sortIndex = _this.nodes.length));
                });
          });
        }
        function addHandlers() {
          (_this.header.div.addEventListener("contextmenu", openContextMenu),
            _this.bind(`UIL/${_this.id}/UILGraph/node/focused`, handleNodeFocused),
            _this.listen("GraphContextMenu/action", handleContextMenuAction),
            _this.listen("UILGraph/MoveNode", handleMoveNode),
            _this.events.sub(UILSocket.EDITOR_BRIDGE, onEditorBridgeMessage));
        }
        function handleMoveNode(e) {
          const find = (id) => {
            let found;
            return (
              _this.groupBridge.all.forEach((node) => {
                node.id == id && (found = node);
              }),
              found
            );
          };
          let moveNode = find(e.moveId),
            targetNode = find(e.targetId);
          if (
            moveNode &&
            !(
              (moveNode.parent && moveNode.parent == targetNode?.parent) ||
              moveNode == targetNode ||
              (targetNode?.parent && moveNode.id.includes(targetNode.parent)) ||
              (targetNode?.children && moveNode.children)
            )
          ) {
            if ("end-of-list" == e.type)
              if (targetNode) moveNode.parent = targetNode.id;
              else {
                let oldIndex = moveNode.sortIndex;
                (_this.nodes.forEach((node) => {
                  node.sortIndex > oldIndex && (node.sortIndex -= 1);
                }),
                  (moveNode.sortIndex = _this.nodes.length - 1),
                  (moveNode.parent = null),
                  _this.nodes.sort((a, b) => a.sortIndex - b.sortIndex));
              }
            else {
              if ("group" == moveNode.type && "group" == targetNode?.type) return;
              if (targetNode?.parent)
                return (
                  (moveNode.parent = targetNode.parent),
                  _this.fire("UILGraph/MoveNode", e),
                  void healSort()
                );
              moveNode.parent = null;
              let oldIndex = moveNode.sortIndex;
              if (
                (_this.nodes.forEach((node) => {
                  node.sortIndex > oldIndex && (node.sortIndex -= 1);
                }),
                "before" == e.type)
              ) {
                let newIndex = targetNode.sortIndex;
                (_this.nodes.forEach((node) => {
                  node.sortIndex >= newIndex && (node.sortIndex += 1);
                }),
                  (moveNode.sortIndex = newIndex));
              }
              _this.nodes.sort((a, b) => a.sortIndex - b.sortIndex);
            }
            (healSort(), _this.set(`UIL/${_this.id}/UILGraph/node/focused`, e.moveId));
          }
        }
        function healSort() {
          let lastIndex = -1;
          _this.nodes.forEach((node) => {
            let delta = node.sortIndex - lastIndex;
            (delta > 1 && (node.sortIndex -= delta - 1), (lastIndex = node.sortIndex));
          });
        }
        async function onEditorBridgeMessage(e) {
          if (e.layout && e.layout === _this.name) {
            if ("create" == e.action) {
              let layer = await _layoutInstance._createLayer(null);
              (await _this.wait(100),
                _this.events.fire(UILGraphLayout.BRIDGE_CREATE, {
                  layoutName: _layoutInstance.name,
                  layerName: layer._sceneLayout.name,
                  newName: e.layerName,
                }));
            }
            if ("delete" == e.action) {
              let node = find(e.layerName);
              _layoutInstance._deleteLayer(node.id, e.layerName, !0) && _this.remove(node, !0);
            }
            if ("eval" == e.action) {
              let layer = await _layoutInstance.getLayer(e.layerName);
              eval("layer._sceneLayout." + e.code);
            }
          }
        }
        function openContextMenu(e) {
          (e.preventDefault(),
            _this.set("UIL/ContextMenu", {
              layoutId: _this.id,
              targetId: _this.id,
              type: _isStageLayout ? UILGraph.STAGE_LAYOUT_TYPE : UILGraph.LAYOUT_TYPE,
              isStageLayout: _isStageLayout,
            }));
        }
        async function handleContextMenuAction(event) {
          const context = _this.get("UIL/ContextMenu");
          if (context && context.layoutId == _this.id)
            switch (event) {
              case UILGraphContextMenu.DELETE:
                let foundNode;
                if (
                  (_this.nodes.forEach((node) => {
                    node.id == context.targetId && (foundNode = node);
                  }),
                  foundNode && !foundNode.parent)
                ) {
                  _this.groupBridge.deleteNode(foundNode) &&
                    (_this.nodes.remove(foundNode),
                    _this.nodes.forEach((node) => {
                      node.sortIndex > foundNode.sortIndex && (node.sortIndex -= 1);
                    }),
                    _this.nodes.length &&
                      _this.set(`UIL/${_this.id}/UILGraph/node/focused`, _this.nodes[0].id));
                }
                healSort();
                break;
              case UILGraphContextMenu.ADD_LAYER:
                {
                  _this.groupBridge.createLayer();
                  let newNode = _this.groupBridge.layers[_this.groupBridge.layers.length - 1];
                  (handleParentBinding(newNode),
                    _this.nodes.push(newNode),
                    context.targetId &&
                      context.targetId != _this.id &&
                      (newNode.parent = "group" + context.targetId.split("_group")[1]),
                    healSort());
                }
                break;
              case UILGraphContextMenu.ADD_GROUP:
                {
                  _this.groupBridge.createGroup();
                  let newNode = _this.groupBridge.groups[_this.groupBridge.groups.length - 1];
                  (handleParentBinding(newNode), _this.nodes.push(newNode), healSort());
                }
                break;
              case UILGraphContextMenu.COPY_LAYER:
                var dataToCopy = {
                  UIL_ID: window.UIL_ID,
                  layout: context.layoutId,
                  layer: _this.params.id || `${_this.params.name}-${_this.params.uniq}`,
                  location: window.location.pathname.split("/").filter(Boolean)[0],
                };
                if (window.Platform && Router) {
                  const world = await Platform.getRoute(Router.getStateString());
                  dataToCopy.world = world;
                }
                navigator.clipboard.writeText(JSON.stringify(dataToCopy));
                break;
              case UILGraphContextMenu.COPY_LAYOUT:
                dataToCopy = {
                  UIL_ID: window.UIL_ID,
                  layout: context.layoutId,
                  location: window.location.pathname.split("/").filter(Boolean)[0],
                };
                if (window.Platform && Router) {
                  const world = await Platform.getRoute(Router.getStateString());
                  dataToCopy.world = world;
                }
                navigator.clipboard.writeText(JSON.stringify(dataToCopy));
                break;
              case UILGraphContextMenu.DUPLICATE_LAYER:
              case UILGraphContextMenu.DUPLICATE_GROUP:
                break;
              case UILGraphContextMenu.CINEMA:
                applyCinemaConfig();
                break;
              case UILGraphContextMenu.FIGMA:
                applyFigmaConfig();
                break;
              case UILGraphContextMenu.PASTE_LAYER:
                return alert("The Paste Layer feature is not yet implemented.");
              case UILGraphContextMenu.PASTE_LAYOUT:
                return alert("The Paste Layout feature is not yet implemented.");
            }
        }
        function handleNodeFocused(val) {
          let focusedNode;
          (_this.nodes.forEach((node) => {
            ((node.focused = val == node.id), node.focused && (focusedNode = node));
          }),
            focusedNode &&
              (UIL.sidebar.toolbar.filterSingle(val),
              Storage.set(`UIL:${_this.id}/Graph/focused`, val),
              Storage.set("UILGraphLayoutFocused", _this.id),
              _this.set("UILGraphLayoutFocused", _this.id),
              _this.events.fire(UILGraphNode.FOCUSED, {
                name: focusedNode.name,
                layoutInstance: _layoutInstance,
              })));
        }
        ((_this.id = _this.params.id || `${_this.params.name.toLowerCase()}-${_this.params.uniq}`),
          (_this.layoutInstance = _layoutInstance),
          (_this.attachmentId = `${_this.params.name}-${_this.params.uniq}`),
          (_this.addSpecial =
            _this.addLayer =
            _this.addGroup =
            _this.syncVisibility =
            _this.syncGroupNames =
            _this.open =
              (_) => {}),
          (_this.groupBridge = await UILGroupBridge.createSceneLayout(_layoutInstance.name)),
          (_this.determineView = (data) => ("group" == data.type ? UILGraphGroup : UILGraphLayer)),
          _this.setDragEnabled(!1),
          (_this.nodes = createStateArray()),
          _this.groupBridge.all.forEach((node) => {
            (handleParentBinding(node), node.parent || _this.nodes.push(node));
          }),
          addHandlers(),
          _this.delayedCall((_) => {
            Storage.get("UILGraphLayoutFocused") == _this.id &&
              _this.set(
                `UIL/${_this.id}/UILGraph/node/focused`,
                Storage.get(`UIL:${_this.id}/Graph/focused`),
              );
          }, 500),
          (_this.onDrop = function (dropId) {
            _this.fire("UILGraph/MoveNode", {
              moveId: dropId,
              targetId: null,
              type: "end-of-list",
            });
          }),
          _this.bind("UILGraphLayoutFocused", (id) => {
            id != _this.id &&
              _this.groupBridge.all.forEach((node) => {
                node.focused = !1;
              });
          }),
          _this.element.goob(
            "\n    position: relative;\n    width: 100%;\n    height: auto;\n    font-family: sans-serif;\n    font-size: 11px;\n\n    & > .wrapper {\n        background-color: #161616;\n    }\n\n    .header {\n        width: 100%;\n        height: auto;\n        outline: none;\n        display: block;\n        padding: 4px;\n        box-sizing: border-box;\n        user-select: none;\n    }\n\n    .toggle {\n        position: relative;\n        width: 2px;\n        height: 2px;\n        fontSize: 9ps;\n        text-align: center;\n        display: inline-block;\n        vertical-align: middle;\n        border: 1px solid #b1b1b1;\n        border-radius: 50%;\n        margin-left: 2px;\n    }\n\n    .title {\n        display: inline-block;\n        vertical-align: middle;\n        marginLeft: 6px;\n    }\n\n    .children {\n        overflow: hidden;\n        transition: filter 0.1s linear;\n        filter: brightness(0.8);\n    }\n    .children:hover {\n        filter: brightness(1.0);\n    }\n\n    .lastPseudoLayer {\n        height: 8px;\n    }\n\n    .dropTarget {\n        position: relative;\n        height: 15px;\n        width: 100%;\n        margin-bottom: -15px;\n    }\n\n    .dropTarget .highlight {\n        width: 100%;\n        height: 6px;\n        background: #1A6DEA;\n        opacity: 0;\n        transition: opacity 200ms;\n    }\n\n    .dropTarget.hover .highlight{\n        opacity: 1;\n    }\n\n    & > .wrapper > .children > .dropTarget {\n        margin-bottom: 0;\n    }\n\n    .iconButton {\n        width: 16px;\n        height: 16px;\n        cursor: pointer;\n        transition: opacity 200ms;\n        stroke: var(--color-white);\n        fill: var(--color-white);\n        opacity: 0.6;\n        margin: 2px;\n    }\n    \n    .iconButton rect {\n        fill: var(--color-white);\n    }\n    \n    .iconButton:hover {\n        opacity: 1;\n    }\n",
          ),
          (_this.onDestroy = (_) => {
            _this.fire("UILGraphLayout/destroy", _this.attachmentId);
          }));
        for (let key in _this)
          if (_this[key]?.then) {
            let store = _this[key];
            (store.then((val) => (_this[key] = val)), _promises.push(store));
          }
        (_promises.length && (await Promise.all(_promises)),
          (_promises = null),
          _this.flag?.("__ready", !0),
          _this.onInit?.());
      })();
    },
    "",
    () => {
      ((UILGraphLayout.VISIBILE_ICON =
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M8 10C9.1046 10 10 9.1046 10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10Z" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>\n    <path d="M14 8C12.7409 9.4955 10.4789 11 8 11C5.52113 11 3.25904 9.4955 2 8C3.53237 6.57913 5.32775 5 8 5C10.6723 5 12.4677 6.5791 14 8Z" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round"/>\n    </svg>'),
        (UILGraphLayout.INVISIBLE_ICON =
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M3 3L13 13" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>\n    <path d="M7.09535 7.32587C7.03396 7.47036 7 7.62933 7 7.79621C7 8.461 7.53893 8.99998 8.20377 8.99998C8.40481 8.99998 8.59434 8.9507 8.76095 8.86354" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>\n    <path d="M5.27945 6C4.40054 6.56451 3.66836 7.36877 3 8.12613C3.98694 9.55876 5.76015 11 7.70328 11C8.51324 11 9.29372 10.7496 10 10.3538" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>\n    <path d="M8 5C10.2269 5 11.7231 6.68437 13 8.2C12.8231 8.46896 12.6224 8.73824 12.4011 9" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>\n    </svg>'),
        (UILGraphLayout.LOCKED_ICON =
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M10.6667 8H11.6C11.8209 8 12 8.16788 12 8.375V12.625C12 12.8321 11.8209 13 11.6 13H4.4C4.17909 13 4 12.8321 4 12.625V8.375C4 8.16788 4.17909 8 4.4 8H5.33333M10.6667 8V5.5C10.6667 4.66667 10.1333 3 8 3C5.86667 3 5.33333 4.66667 5.33333 5.5V8M10.6667 8H5.33333" stroke-width="0.937501" stroke-linecap="round" stroke-linejoin="round"/>\n    <rect x="4" y="8" width="8" height="5" />\n    </svg>\n    '),
        (UILGraphLayout.UNLOCKED_ICON =
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M10.6667 8H11.6C11.8209 8 12 8.16787 12 8.375V12.625C12 12.8321 11.8209 13 11.6 13H4.4C4.17909 13 4 12.8321 4 12.625V8.375C4 8.16787 4.17909 8 4.4 8H5.33333H10.6667ZM10.6667 8V5.5C10.6667 4.66667 10.1333 3 8 3C7.04247 3 6.40727 3.33577 5.99796 3.78125" stroke-width="0.750001" stroke-linecap="round" stroke-linejoin="round"/>\n    </svg>\n    \n    '),
        (UILGraphLayout.SCENE_ICON =
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M13.0009 8.00124C13.0009 8.59111 12.8984 9.1589 12.7107 9.6841C12.3622 10.6588 11.7218 11.4931 10.8938 12.0814C10.0768 12.6618 9.07846 13.0025 8.00125 13.0025C6.92403 13.0025 5.92567 12.6618 5.10869 12.0814C4.28067 11.4931 3.63876 10.6588 3.29178 9.6841C3.1041 9.1589 3.00158 8.59111 3.00158 8.00124C3.00158 7.32936 3.13406 6.68745 3.37537 6.10232C3.77598 5.12446 4.47782 4.30275 5.36577 3.75074C6.12913 3.27443 7.03286 3 8.00125 3C8.96964 3 9.87178 3.27443 10.6367 3.75074C11.5247 4.30275 12.2265 5.12446 12.6271 6.10232C12.8684 6.68745 13.0009 7.32936 13.0009 8.00124Z" stroke-width="0.75" stroke-miterlimit="10"/>\n    <path d="M8.00129 3C8.96968 3 9.87183 3.27443 10.6368 3.75074C10.3339 3.82644 10.0217 3.88795 9.69992 3.93685C9.15421 4.02044 8.58485 4.0646 7.99972 4.0646C7.41458 4.0646 6.84522 4.02044 6.29951 3.93685C5.97935 3.88795 5.66706 3.82487 5.36267 3.75074C6.12918 3.27443 7.0329 3 8.00129 3Z" stroke-width="0.75" stroke-miterlimit="10"/>\n    <path d="M12.6271 6.10232C12.0419 6.25373 11.4221 6.37675 10.777 6.46822C9.89537 6.59282 8.96484 6.66064 8.00118 6.66064C7.03752 6.66064 6.10698 6.59282 5.22534 6.46822C4.58027 6.37675 3.96044 6.25373 3.37531 6.10232C3.77591 5.12446 4.47776 4.30275 5.36571 3.75074C6.12906 3.27443 7.03279 3 8.00118 3C8.96957 3 9.87172 3.27443 10.6366 3.75074C11.5246 4.30275 12.2264 5.12446 12.6271 6.10232Z" stroke-width="0.75" stroke-miterlimit="10"/>\n    <path d="M8.00116 13.0009C6.92394 13.0009 5.92559 12.6603 5.10861 12.0799C5.44139 11.9868 5.78522 11.9111 6.14166 11.8512C6.73626 11.7518 7.35925 11.6982 8.00116 11.6982C8.64307 11.6982 9.26764 11.7518 9.86066 11.8512C10.2155 11.9111 10.5609 11.9868 10.8937 12.0799C10.0767 12.6603 9.07837 13.0009 8.00116 13.0009V13.0009Z" stroke-width="0.75" stroke-miterlimit="10"/>\n    <path d="M12.7107 9.6841C12.3621 10.6588 11.7218 11.4931 10.8938 12.0814C10.0768 12.6618 9.07844 13.0025 8.00122 13.0025C6.92401 13.0025 5.92565 12.6618 5.10867 12.0814C4.28065 11.4931 3.63874 10.6588 3.29176 9.6841C3.88951 9.52638 4.52353 9.39863 5.18595 9.30242C6.08021 9.17309 7.02337 9.1037 8.00122 9.1037C8.97907 9.1037 9.92381 9.17309 10.8165 9.30242C11.4789 9.39705 12.1129 9.52638 12.7107 9.6841V9.6841Z" stroke-width="0.75" stroke-miterlimit="10"/>\n    <path d="M7.99971 13.0025C9.61028 13.0025 10.9159 10.7634 10.9159 8.00124C10.9159 5.23913 9.61028 3 7.99971 3C6.38913 3 5.0835 5.23913 5.0835 8.00124C5.0835 10.7634 6.38913 13.0025 7.99971 13.0025Z" stroke-width="0.75" stroke-miterlimit="10"/>\n    <path d="M7.99967 3V13.0009" stroke-width="0.75" stroke-miterlimit="10"/></svg>'),
        (UILGraphLayout.GROUP_ICON =
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <rect x="2.5" y="2.5" width="7" height="7" />\n    <path d="M14 14V6H11V11H6V14H14Z" />\n    </svg>'),
        (UILGraphLayout.ARROW_ICON =
          '<svg width="6" class="arrow" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path d="M6 0L3 4L0 -2.62268e-07L6 0Z" />\n    </svg>'),
        (UILGraphLayout.LINE_ELBOW =
          '<svg fill="#aaaaaa" width="20px" height="22px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">\n    <path d="M210.82825,178.82861h-.00013l-48,48a3.99992,3.99992,0,0,1-5.65625-5.65722L198.34277,180H64a4.0002,4.0002,0,0,1-4-4V32a4,4,0,0,1,8,0V172H198.34277l-41.1709-41.17139a3.99992,3.99992,0,0,1,5.65625-5.65722l48,48h.00013a4.02834,4.02834,0,0,1,.49841.61035c.06543.09814.11047.20434.1665.30664a3.97146,3.97146,0,0,1,.20093.38183,3.91958,3.91958,0,0,1,.126.406c.03345.11377.07751.22266.10083.34033a4.01026,4.01026,0,0,1,0,1.5669c-.02332.11767-.06738.22656-.10083.34033a3.90157,3.90157,0,0,1-.126.406,3.94471,3.94471,0,0,1-.20093.38183c-.0559.1023-.10095.2085-.1665.30664A4.02834,4.02834,0,0,1,210.82825,178.82861Z"/>\n    </svg>'));
    },
  ),
  Class(
    function UILGraphNode(_params, ...restArgs) {
      const _this = this;
      (Inherit(_this, Element),
        Inherit(_this, XComponent),
        (_this.fragName = "UILGraphNode"),
        (_this.contexts = "Element"),
        (_this.params = _params),
        (_this.args = arguments),
        (this.isFragment = !0));
      var _promises = [];
      !(async function () {
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
          (_this.params = _params),
          (_this.args = arguments),
          _this.parent?.layers && (_this.layers = _this.parent.layers),
          _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
        for (let key in _this)
          if (_this[key]?.then) {
            let store = _this[key];
            (store.then((val) => (_this[key] = val)), _promises.push(store));
          }
        (_promises.length && (await Promise.all(_promises)),
          (_promises = null),
          _this.flag?.("__ready", !0),
          _this.onInit?.());
      })();
    },
    "",
    () => {
      ((UILGraphNode.FOCUSED = "uilgraphnode_focused"),
        (UILGraphNode.BLURRED = "uilgraphnode_blurred"),
        (UILGraphNode.RENAMED = "uilgraphnode_renamed"),
        (UILGraphNode.TOGGLE_VISIBILITY = "uilgraphnode_toggle_visibility"));
    },
  ),
  Class(function UILGraphNodeMenu(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILGraphNodeMenu"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "div",
              refName: "wrapper",
              children: [
                {
                  className: "iconButton",
                  click: "$onSceneClick",
                  _type: "div",
                  refName: "sceneButton",
                  children: [],
                },
                {
                  className: "iconButton",
                  click: "$onLockClick",
                  _type: "div",
                  refName: "lockButton",
                  children: [],
                },
                {
                  className: "iconButton",
                  click: "$onVisibilityClick",
                  _type: "div",
                  refName: "visibilityButton",
                  children: [],
                },
              ],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.sceneButton.html(UILGraphLayout.SCENE_ICON),
        _this.sceneButton.classList()[_this.params.data.scenelayout ? "remove" : "add"]("hidden"),
        _this.lockButton.html(
          _this.params.data.locked ? UILGraphLayout.LOCKED_ICON : UILGraphLayout.UNLOCKED_ICON,
        ),
        _this.visibilityButton.html(
          _this.params.data.visible ? UILGraphLayout.VISIBILE_ICON : UILGraphLayout.INVISIBLE_ICON,
        ),
        _this.params.data.special && _this.visibilityButton.classList().add("hidden"),
        (_this.onLockClick = (_) => _this.params.data.set("locked", !_this.params.data.locked)),
        (_this.onVisibilityClick = (_) =>
          _this.params.data.set("visible", !_this.params.data.visible)),
        (_this.onSceneClick = (_) =>
          (window.location.search = `?p=${_this.params.data.scenelayout}&uil`)),
        (_this.onInit = function () {
          (_this.lockButton.css({ pointerEvents: "all" }),
            _this.bind(_this.params.data, "locked", (value) => {
              (_this.lockButton.html(
                value ? UILGraphLayout.LOCKED_ICON : UILGraphLayout.UNLOCKED_ICON,
              ),
                _this.fire("UILGraph/LockNode", {
                  id: _this.params.data.id,
                  layoutId: _this.params.layoutId,
                  value: value,
                }),
                value && _this.set(`UIL/${_this.params.layoutId}/UILGraph/node/focused`, null));
            }),
            _this.bind(_this.params.data, "visible", (val) => {
              (_this.visibilityButton?.html(
                val ? UILGraphLayout.VISIBILE_ICON : UILGraphLayout.INVISIBLE_ICON,
              ),
                _this.events.fire(UILGraphNode.TOGGLE_VISIBILITY, {
                  ..._this.params.data.toJSON(),
                  visible: val,
                }));
            }));
        }),
        _this.element.goob(
          "\n    .wrapper {\n        display: flex;\n        margin-right: 5px;\n        color: var(--color-icon-default);\n        align-items: right;\n    }\n\n    .iconButton.hidden {\n        display: none;\n    }\n\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(
    function UILHistoryDay(_data, _index, _params) {
      const _this = this;
      (Inherit(_this, Element),
        Inherit(_this, ViewStateElement),
        Inherit(_this, XComponent),
        (_this.fragName = "UILHistoryDay"),
        (_this.contexts = "Element,ViewStateElement"),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        (this.isFragment = !0));
      var _promises = [];
      !(async function () {
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
          _this.initClass(FragUIHelper, {
            _type: "UI",
            refName: "unnamed",
            children: [
              {
                click: "$onClick",
                _type: "div",
                refName: "day",
                children: [
                  {
                    className: "day__info",
                    _type: "div",
                    refName: "unnamed",
                    children: [
                      {
                        _type: "span",
                        _innerText: "$data.date",
                        refName: "unnamed",
                        children: [],
                      },
                      {
                        _type: "span",
                        _innerText: "$data.amount",
                        refName: "unnamed",
                        children: [],
                      },
                    ],
                  },
                  {
                    className: "day__icon",
                    _type: "div",
                    refName: "icon",
                    children: [],
                  },
                ],
              },
            ],
          }),
          (_this.data = _data),
          (_this.index = _index),
          (_this.params = _params),
          _this.createState(),
          _this.parent?.layers && (_this.layers = _this.parent.layers),
          _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
          (_this.onInit = function () {
            !(function initHTML() {
              _this.icon.html(UILHistoryDay.arrowRightIcon);
            })();
          }),
          (_this.onClick = function () {
            _this.parent.parent.onSelectDay(_this.data.date);
          }),
          _this.element.goob(
            "\n    .day {\n        display: flex;\n        font: var(--label4-medium);\n        font-size: 12px;\n        justify-content: center;\n        align-items: center;\n        width: 100%;\n        padding: 1rem;\n\n        border: 1px solid transparent;\n        border-bottom-color: var(--color-neutral-40);\n\n        &:hover {\n            border-color: var(--color-accent-50);\n\n            .day__icon > svg {\n                stroke: var(--font-color-base);\n            }\n        }\n\n        &__info {\n            flex-grow: 1;\n\n            > span {\n                display: inline-block;\n\n                &:last-child {\n                    margin-left: 0.2rem;\n                }\n            }\n        }\n\n        &__icon {\n            > svg {\n                display: block;\n\n                stroke: var(--color-neutral-70);\n\n                transition: stroke 0.17s ease-in-out;\n            }\n        }\n    }\n",
          ));
        for (let key in _this)
          if (_this[key]?.then) {
            let store = _this[key];
            (store.then((val) => (_this[key] = val)), _promises.push(store));
          }
        (_promises.length && (await Promise.all(_promises)),
          (_promises = null),
          _this.flag?.("__ready", !0),
          _this.onInit?.());
      })();
    },
    (_) => {
      UILHistoryDay.arrowRightIcon =
        '\n        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M6 4L10 8L6 12" stroke-linecap="round" stroke-linejoin="round"/>\n        </svg>\n    ';
    },
  ),
  Class(function UILHistoryPaginationButton(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, ViewStateElement),
      Inherit(_this, XComponent),
      (_this.fragName = "UILHistoryPaginationButton"),
      (_this.contexts = "Element,ViewStateElement"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function calculateDisplay() {
        let {
          pageCount: pageCount,
          maxButtonCount: maxButtonCount,
          index: index,
        } = _this.data.toJSON();
        if (((pageCount -= 1), !(pageCount <= 0 || pageCount <= maxButtonCount - 1))) {
          if (
            ((_this.visibleButtonIndexes = [0, pageCount]),
            (0 === _this.currentPageIndex && _this.currentPageIndex === pageCount) ||
              _this.visibleButtonIndexes.push(_this.currentPageIndex),
            pageCount > maxButtonCount &&
              (1 === index && _this.currentPageIndex > 1 ? setEllipsis("start") : removeEllipsis(),
              index === pageCount - 1 && _this.currentPageIndex <= pageCount - 2
                ? setEllipsis("end")
                : removeEllipsis()),
            (_this.visibleButtonIndexes = [...new Set(_this.visibleButtonIndexes)]),
            _this.visibleButtonIndexes.length < maxButtonCount)
          ) {
            let fillButtonCount = maxButtonCount - _this.visibleButtonIndexes.length;
            if (_this.currentPageIndex <= Math.ceil(pageCount / 2))
              for (let i = 0; i < fillButtonCount; i++)
                (_this.visibleButtonIndexes.push(_this.currentPageIndex + (i + 1)),
                  fillButtonCount--);
            else if (_this.currentPageIndex >= Math.floor(pageCount / 2))
              for (let i = 0; i < fillButtonCount; i++)
                (_this.visibleButtonIndexes.push(_this.currentPageIndex - (i + 1)),
                  fillButtonCount--);
          }
          _this.hidden = !_this.visibleButtonIndexes.includes(index);
        }
      }
      function setEllipsis(position) {
        const indexes = { start: 1, end: _this.data.pageCount - 2 };
        ((_this.data.label = "..."),
          _this.btn.classList().add("disabled"),
          _this.visibleButtonIndexes.push(indexes[position]));
      }
      function removeEllipsis() {
        _this.btn.classList().remove("disabled");
      }
      function setActive(value) {
        value ? _this.btn.classList().add("active") : _this.btn.classList().remove("active");
      }
      function setDisplay() {
        _this.hidden
          ? _this.element.classList().add("hidden")
          : _this.element.classList().remove("hidden");
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              href: "#",
              click: "$handleClick",
              _type: "a",
              _innerText: "$data.label",
              refName: "btn",
              children: [],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.currentPageIndex = _this.data.currentPageIndex),
        (_this.visibleButtonIndexes = []),
        (_this.hidden = !1),
        calculateDisplay(),
        setDisplay(),
        setActive(_this.data.active),
        (_this.onInit = () => {
          !(function initListeners() {
            _this.listen("UILHistoryTab/updatePaginationIndex", (value) => {
              (console.log("value: ", value),
                (_this.currentPageIndex = value),
                calculateDisplay(),
                setDisplay());
            });
          })();
        }),
        _this.data.bind("active", (value) => {
          setActive(value);
        }),
        (_this.handleClick = () => {
          _this.data.callback(_this.data.index);
        }),
        _this.element.goob(
          "\n    & {\n        display: inline-block;\n        \n        &.hidden {\n            display: none;\n        }\n    }\n\n    .btn {\n        display: flex;\n        align-items: center;\n        justify-content: center;\n        min-width: 26px;\n\n        &.disabled {\n            pointer-events: none;\n        }\n    }\n\n    .has-first-ellipsis {\n        &:after {\n            content: '...';\n        }\n    }\n\n    .has-last-ellipsis {\n        &:before {\n            content: '...';\n        }\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILHistoryPaginationControls(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, ViewStateElement),
      Inherit(_this, XComponent),
      (_this.fragName = "UILHistoryPaginationControls"),
      (_this.contexts = "Element,ViewStateElement"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "pagination",
              _type: "nav",
              refName: "unnamed",
              children: [
                {
                  href: "#",
                  click: "$handlePreviousClick",
                  _type: "a",
                  _innerText: "$state.previousLabel",
                  refName: "btn",
                  children: [],
                },
                {
                  _type: "div",
                  refName: "paginationBtnWrapper",
                  children: [
                    {
                      data: "$parent.paginatedData",
                      view: "UILHistoryPaginationButton",
                      _type: "ViewState",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
                {
                  href: "#",
                  click: "$handleNextClick",
                  _type: "a",
                  _innerText: "$state.nextLabel",
                  refName: "btn",
                  children: [],
                },
              ],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.createState(),
        _this.state.set("previousLabel", "<"),
        _this.state.set("nextLabel", ">"),
        (_this.handlePreviousClick = () => {
          _this.parent.updatePaginationIndex(_this.parent.state.currentPageIndex - 1);
        }),
        (_this.handleNextClick = () => {
          _this.parent.updatePaginationIndex(_this.parent.state.currentPageIndex + 1);
        }),
        _this.element.goob(
          "\n    & {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n    }\n\n    .pagination,\n    .paginationBtnWrapper {\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        gap: calc(var(--spacing-small) / 2);\n    }\n\n    .pagination {\n        background-color: var(--color-neutral-20);\n        justify-content: space-between;\n        padding: var(--spacing-small);\n        width: 100%;\n        overflow-x: auto;\n    }\n\n    .btn {\n        background-color: transparent;\n        color: var(--color-white);\n        border-radius: 4px;\n        display: block;\n        font: var(--label3-simi);\n        line-height: 1;\n        text-decoration: none;\n        padding: calc(var(--spacing-small) / 4) calc(var(--spacing-small) / 2);\n\n        &.active {\n            background-color: var(--color-action);\n        }\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILHistoryRecord(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, ViewStateElement),
      Inherit(_this, XComponent),
      (_this.fragName = "UILHistoryRecord"),
      (_this.contexts = "Element,ViewStateElement"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            { _type: "span", refName: "metadata", children: [] },
            {
              _type: "span",
              _innerText: "$data.message",
              refName: "message",
              children: [],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.onInit = function () {
          !(function initHTML() {
            _this.metadata.text(`${_this.data.actorName} - ${_this.data.timeFormatted}`);
          })();
        }),
        _this.element.goob(
          "\n    & {\n        border-bottom: 1px solid var(--color-neutral-40);\n        padding: 0.75rem 1rem;\n        word-wrap: break-word;\n        overflow-wrap: break-word;\n        word-break: break-all;\n        hyphens: auto;\n    }\n\n    .metadata,\n    .message {\n        display: flex;\n        justify-content: flex-start;\n        align-items: flex-start;\n        line-height: 14.3px;\n    }\n    \n    .metadata {\n        margin-bottom: 0.24rem;     \n        font-weight: 600;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(
    function UILHistoryTab(_params, ...restArgs) {
      const _this = this;
      (Inherit(_this, Element),
        Inherit(_this, XComponent),
        (_this.fragName = "UILHistoryTab"),
        (_this.contexts = "Element"),
        (_this.params = _params),
        (_this.args = arguments),
        (this.isFragment = !0));
      var _promises = [];
      !(async function () {
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
          _this.initClass(FragUIHelper, {
            _type: "UI",
            refName: "unnamed",
            children: [
              {
                className: "history__panel days__body",
                _type: "div",
                refName: "dayPanel",
                children: [
                  {
                    data: "$dayData",
                    view: "UILHistoryDay",
                    _type: "ViewState",
                    refName: "unnamed",
                    children: [],
                  },
                ],
              },
              {
                className: "history__panel records",
                _type: "div",
                refName: "recordsPanel",
                children: [
                  {
                    className: "records__header",
                    _type: "header",
                    refName: "unnamed",
                    children: [
                      {
                        className: "records__back",
                        _type: "div",
                        refName: "recordsBack",
                        children: [],
                      },
                      {
                        className: "records__date",
                        _type: "h3",
                        _innerText: "Date",
                        refName: "recordsDateLabel",
                        children: [],
                      },
                    ],
                  },
                  {
                    className: "records__body",
                    _type: "div",
                    refName: "unnamed",
                    children: [
                      {
                        data: "$activePageData",
                        view: "UILHistoryRecord",
                        _type: "ViewState",
                        refName: "unnamed",
                        children: [],
                      },
                    ],
                  },
                  {
                    _type: "footer",
                    refName: "footer",
                    children: [
                      {
                        data: "$paginatedData",
                        _type: "UILHistoryPaginationControls",
                        refName: "unnamed",
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          }),
          (_this.params = _params),
          (_this.args = arguments),
          _this.parent?.layers && (_this.layers = _this.parent.layers),
          _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
        const dayDataId = _this.params?.actorId ? `${_this.params.actorId}-days` : "days",
          recordsDataId = _this.params?.actorId ? `${_this.params.actorId}-records` : "records";
        function paginateRecords(data, recordsPerPage = 20, maxButtonCount = 7) {
          const result = [],
            pageCount = Math.ceil(data.length / recordsPerPage);
          pageCount <= 1
            ? _this.footer.classList().add("hidden")
            : _this.footer.classList().remove("hidden");
          for (let i = 0; i < pageCount; i++) {
            const start = i * recordsPerPage,
              end = start + recordsPerPage,
              pageItems = data.slice(start, end);
            result.push({
              currentPageIndex: _this.state.currentPageIndex,
              pageCount: pageCount,
              maxButtonCount: maxButtonCount,
              active: i === _this.state.currentPageIndex,
              index: i,
              label: `${i + 1}`,
              items: pageItems,
              callback: (activeIndex) => updatePaginationIndex(activeIndex),
            });
          }
          return result;
        }
        function updatePaginationIndex(activeIndex) {
          activeIndex < 0 ||
            activeIndex >= _this.paginatedData.length ||
            (_this.state.set("currentPageIndex", activeIndex),
            _this.paginatedData.forEach((page, index) => {
              page.active = index === activeIndex;
            }),
            updateActivePageData());
        }
        function updateActivePageData() {
          (_this.paginatedData.refresh(paginateRecords(_this.recordsData.toJSON())),
            _this.activePageData.refresh(_this.paginatedData[_this.state.currentPageIndex].items));
        }
        function getTime(unixTimestamp) {
          const date = new Date(1e3 * unixTimestamp),
            hours = date.getHours(),
            minutes = date.getMinutes();
          return `${hours % 12 || 12}:${minutes < 10 ? "0" : ""}${minutes} ${hours >= 12 ? "PM" : "AM"}`;
        }
        ((_this.history = (function getData() {
          const cleanHistory = UILStorage.getHistory(_this.params?.actorId).map((item) => ({
            actorName: "",
            timeFormatted: getTime(item.change.time),
            ...item.change,
          }));
          return (function groupByDay(list) {
            let result = {};
            return (
              list.forEach((item) => {
                let date = (function formatDate(time) {
                  const date = new Date(time),
                    monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                    monthIndex = date.getMonth(),
                    day = date.getDate();
                  return `${monthNames[monthIndex]} ${day}`;
                })(1e3 * item.time);
                (result[date] || (result[date] = []), result[date].push(item));
              }),
              result
            );
          })(cleanHistory);
        })()),
          (_this.dayData = Data.request(dayDataId, () =>
            Object.entries(_this.history)
              .map(([k, v]) => ({ date: k, amount: `(${v.length})` }))
              .reverse(),
          )),
          (_this.recordsData = await Data.request(
            recordsDataId,
            () => _this.history[Object.keys(_this.history)[0]],
          )),
          _this.createState(),
          _this.state.set("currentPageIndex", 0),
          (_this.paginatedData = new StateArray(paginateRecords(_this.recordsData.toJSON()))),
          (_this.activePageData = new StateArray(
            _this.paginatedData[_this.state.currentPageIndex].items,
          )),
          (_this.onMounted = () => {
            !(function initListeners() {
              _this.recordsBack.click(_this.showDaysPanel);
            })();
          }),
          (_this.onInit = async function () {
            (!(async function setActorsName() {
              const actors = await UILStorage.getUsers();
              for (let key in _this.history)
                _this.history[key] = _this.history[key].map((record) => {
                  const actor = actors.find((a) => a.actorId === record.actor);
                  return ((record.actorName = actor?.name || ""), record);
                });
            })(),
              (function initHTML() {
                _this.recordsBack.html(UILHistoryTab.arrowLeftIcon);
              })());
          }),
          (_this.onSelectDay = (day) => {
            (!(function updateRecordsData(day) {
              ((_this.state.currentPageIndex = 0),
                _this.recordsDateLabel.text(day),
                _this.recordsData.refresh([..._this.history[day]].reverse()),
                updateActivePageData());
            })(day),
              (function showRecordsPanel() {
                (_this.dayPanel.tween({ x: "-100%" }, 500, "easeOutCubic"),
                  _this.recordsPanel.tween({ x: "-100%" }, 500, "easeOutCubic"));
              })());
          }),
          (_this.updatePaginationIndex = updatePaginationIndex),
          (_this.showDaysPanel = function () {
            (_this.dayPanel.tween({ x: 0 }, 500, "easeOutCubic"),
              _this.recordsPanel.tween({ x: 0 }, 500, "easeOutCubic"));
          }),
          _this.element.goob(
            "\n    & {\n        display: flex;\n        width: 100%;\n        height: 100%;\n        pointer-events: auto;\n        overflow: hidden;\n        padding-bottom: 40px;\n    }\n\n    .history {\n        &__panel {\n            width: 100%;\n            height: 100%;\n            flex-shrink: 0;\n            padding-bottom: 40px;\n        }\n    }\n\n    .days {\n        &__body {\n            height: 100%;\n            overflow: auto;\n        }\n    }\n\n    .records {\n        display: flex;\n        flex-direction: column;\n\n        &__header {\n            display: flex;\n            align-items: center;\n\n            border-bottom: 1px solid var(--color-neutral-40);\n        }\n\n        &__body {\n            flex-grow: 1;\n            overflow: auto;\n        }\n\n        &__back {\n            padding: 0.8125rem 1rem;\n\n            &:hover {\n                > svg { stroke: var(--font-color-base); }\n            }\n\n            > svg {\n                display: block;\n\n                stroke: var(--color-neutral-70);\n\n                transition: stroke 0.17s ease-in-out;\n            }\n        }\n\n        &__date {\n            flex-grow: 1;\n            margin: 0;\n            padding: 0.8125rem 1rem 0.8125rem 0;\n        }\n\n    }\n    \n    .footer {\n        position: absolute;\n        bottom: -1px;\n        width: 100%;\n\n        &.hidden {\n            display: none;\n        }\n    }\n",
          ));
        for (let key in _this)
          if (_this[key]?.then) {
            let store = _this[key];
            (store.then((val) => (_this[key] = val)), _promises.push(store));
          }
        (_promises.length && (await Promise.all(_promises)),
          (_promises = null),
          _this.flag?.("__ready", !0),
          _this.onInit?.());
      })();
    },
    (_) => {
      UILHistoryTab.arrowLeftIcon =
        '\n        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n            <path d="M10 4L6 8L10 12" stroke-linecap="round" stroke-linejoin="round"/>\n        </svg>\n    ';
    },
  ),
  Class(function UILInputButton(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, ViewStateElement),
      Inherit(_this, XComponent),
      (_this.fragName = "UILInputButton"),
      (_this.contexts = "Element,ViewStateElement"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              className: "button small",
              click: "$data.callback",
              _type: "button",
              _innerText: "$data.title",
              refName: "button",
              children: [],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILInputNumber(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, ViewStateElement),
      Inherit(_this, XComponent),
      (_this.fragName = "UILInputNumber"),
      (_this.contexts = "Element,ViewStateElement"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      let _timeout;
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              ariaLabelledBy: "$data.labelledBy",
              min: "$data.min",
              max: "$data.max",
              step: "$data.step",
              _type: "input",
              refName: "input",
              children: [],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let _distance,
        _onMouseDownValue,
        _editing = !1,
        _pointer = [0, 0],
        _prevPointer = [0, 0],
        _step = 0.05,
        _onInputCB = () => {},
        _onFinishCB = () => {};
      function setValue(value) {
        if (
          ((value = parseFloat(value).toFixed(_this.data.precision) || 0) < _this.data.min &&
            (value = _this.data.min),
          value > _this.data.max && (value = _this.data.max),
          isNaN(Number(value)))
        )
          return (_this.value = 0);
        ((_this.value = Number(value)), _this.data.onInputCB(_this.value, _this.master));
      }
      function updateValueAndInput(value, showDecimals = !1) {
        setValue(value);
        let displayValue = showDecimals
          ? parseFloat(_this.value).toFixed(_this.data.precision)
          : _this.value;
        _editing || (_this.input.div.value = displayValue);
      }
      function onBlur() {
        (updateValueAndInput(_this.input.div.value, !0), onFinishChange(!0));
      }
      function onKeyUp(e) {
        13 === e.keyCode &&
          (e.altKey
            ? ((_this.master = !0), onInput(), _this.data.onFinishCB(_this.value, _this.master))
            : (setValue(_this.value), _this.data.onFinishCB(_this.value, _this.master)));
      }
      function onInput() {
        ((_timeout = setTimeout(finishInput, 400)),
          (_editing = !0),
          (_this.value = _this.input.div.value));
      }
      function finishInput() {
        isNaN(_this.input.div.value) || (setValue(_this.input.div.value), onFinishChange());
      }
      function onFinishChange(force = !1) {
        (_editing || force) &&
          ((_editing = !1),
          clearTimeout(_timeout),
          _this.data.onFinishCB(_this.value, _this.master),
          (_this.master = !1));
      }
      function onMouseDown(e) {
        (1 === e.button || (0 === e.button && e.metaKey) || e.ctrlKey) &&
          (e.preventDefault(),
          _this.input.css({ cursor: "col-resize" }),
          (_distance = 0),
          (_onMouseDownValue = _this.value),
          (_prevPointer = [e.screenX, e.screenY]),
          document.addEventListener("mousemove", onMouseMove, !1),
          document.addEventListener("mouseup", onMouseUp, !1));
      }
      function onMouseMove(e) {
        (clearTimeout(_timeout), (_editing = !0));
        let currentValue = _this.value;
        ((_pointer = [e.screenX, e.screenY]),
          (_distance += _pointer[0] - _prevPointer[0] - (_pointer[1] - _prevPointer[1])));
        let value = Number(_onMouseDownValue) + Number(_distance / (e.shiftKey ? 5 : 50)) * _step;
        ((value = Math.min(_this.data.max, Math.max(_this.data.min, value))),
          (_this.master = e.altKey),
          currentValue !== value &&
            (function setValueDrag(value) {
              (void 0 === value && value === _this.input.div.value) ||
                (setValue(value),
                (_this.input.div.value = _this.value.toFixed(_this.data.precision)),
                clearTimeout(_this.dragCallback),
                (_this.dragCallback = Timer.create(
                  (_) => _this.data.onFinishCB(_this.value, _this.master),
                  100,
                )));
            })(value),
          (_prevPointer = [e.screenX, e.screenY]));
      }
      function onMouseUp(e) {
        (onFinishChange(),
          _this.input.css({ cursor: "" }),
          document.removeEventListener("mousemove", onMouseMove, !1),
          document.removeEventListener("mouseup", onMouseUp, !1));
      }
      (_this.master,
        _this.dragCallback,
        (_this.onMounted = () => {
          updateValueAndInput(_this.data.value, !0);
        }),
        (function initListeners() {
          (_this.input.div.addEventListener("mousedown", onMouseDown, !1),
            _this.input.div.addEventListener("keyup", onKeyUp, !1),
            _this.input.div.addEventListener("change", onFinishChange, !1),
            _this.input.div.addEventListener("blur", onBlur, !1),
            _this.input.div.addEventListener("input", onInput, !1));
        })(),
        _this.data.bind("value", (value) => {
          updateValueAndInput(value);
        }),
        (_this.getValue = () => _this.value),
        (_this.publicSetValue = (value) => {
          _editing ? setValue(value) : updateValueAndInput(value);
        }),
        (_this.onInput = (cb) => cb),
        (_this.onFinish = (cb) => cb),
        (_this.forceUpdate = function (value) {
          updateValueAndInput(value);
        }),
        (_this.onDestroy = function () {
          (_this.input.div.removeEventListener("mousedown", onMouseDown, !1),
            _this.input.div.removeEventListener("change", onFinishChange, !1),
            _this.input.div.removeEventListener("blur", onBlur, !1),
            _this.input.div.removeEventListener("input", onInput, !1));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILMemory(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILMemory"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              data: "$statsData",
              view: "UILPerformanceItem",
              _type: "ViewState",
              refName: "unnamed",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.statsData = new StateArray(
          Object.entries(RenderCount.map).map(([key, value]) => ({
            key: key,
            value: value,
          })),
        )),
        _this.startRender(function updateStats() {
          if (!_this.params.active) return;
          (Object.entries(RenderCount.map).forEach(([key, value]) => {
            let isKeyMapped = !1;
            (_this.statsData.forEach((d) => d.get("key") === key && (isKeyMapped = !0)),
              isKeyMapped || _this.statsData.push({ key: key, value: value }));
          }),
            _this.statsData.forEach((d) => d.set("value", RenderCount.map[d.get("key")])));
        }, 10),
        (RenderCount.active = !0),
        _this.element.goob(
          "\n    & {\n        width: 100%;\n        padding: var(--spacing-small);\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILPanel(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILPanel"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            { _type: "UILPanelToolbar", refName: "toolbar", children: [] },
            {
              id: "$params.title",
              options: "$folderOptions",
              _type: "UILFolder",
              refName: "folder",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.createState(),
        _this.state.set("historyIsOpen", !1),
        (_this.ready = !1),
        (_this.id = _this.params.title),
        (_this.folderOptions = { hideTitle: !0, drag: !1 }));
      let _hidden = !1;
      function toggleHistory() {
        (_this.state.set("historyIsOpen", !_this.state.historyIsOpen),
          _this.state.historyIsOpen
            ? _this.element.classList().add("open")
            : _this.element.classList().remove("open"),
          _this.fire("historyPanelToggle", _this.state.historyIsOpen));
      }
      function onKeydown(e) {
        if (e.ctrlKey || e.metaKey) {
          if (72 == e.keyCode && e.shiftKey) {
            if (`${document.activeElement.type}`.includes(["textarea", "input", "number"])) return;
            (e.preventDefault(),
              _hidden
                ? (function show() {
                    (_this.element.visible(), (_hidden = !1));
                  })()
                : (function hide() {
                    (_this.element.invisible(), (_hidden = !0));
                  })());
          }
          (37 == e.keyCode &&
            e.shiftKey &&
            (e.preventDefault(), _this.element.css({ left: 0, right: "auto" })),
            39 == e.keyCode &&
              e.shiftKey &&
              (e.preventDefault(), _this.element.css({ left: "auto", right: 0 })),
            67 == e.which &&
              e.shiftKey &&
              (e.preventDefault(), _this.folder.forEachFolder((f) => f.close())),
            79 == e.which &&
              e.shiftKey &&
              (e.preventDefault(), _this.folder.forEachFolder((f) => f.open())));
        }
      }
      ((_this.onMounted = () => {
        (_this.element.mouseEnabled(!0),
          (_this.ready = !0),
          _this.params?.options?.hideToolbar &&
            _this.wait("toolbar").then(() => {
              _this.toolbar.element.hide();
            }),
          (function initListeners() {
            (document.addEventListener("keydown", onKeydown, !1),
              "history" === _this.id &&
                (_this.element.show(), _this.bind("UILTabs/toggle-history-panel", toggleHistory)));
          })());
      }),
        _this.element.classList().add("prevent_interaction3d"),
        _this.element.classList().add(_this.params.title),
        "offscreen" === _this.params?.options?.side && _this.element.classList().add("offscreen"),
        (_this.add = async function (child) {
          return (
            await _this.wait(() => _this.ready),
            await defer(),
            _this.element.show(),
            child instanceof UILTabs
              ? (_this.element.div.prepend(child.element.div), _this)
              : "global" === _this.id && child instanceof UILFolder
                ? (UIL.globalTabs.addGlobalFolder(child), _this)
                : (_this.folder.add(child), _this)
          );
        }),
        (_this.remove = function (x) {
          return (_this.folder.remove(x.id), _this);
        }),
        (_this.get = function (id) {
          return _this.folder.getChildById(id);
        }),
        (_this.find = function (id) {
          return _this.folder.find(id);
        }),
        (_this.filter = function (str) {
          return _this.folder.filter(str);
        }),
        (_this.enableSorting = function (key) {
          return (_this.folder.enableSorting && _this.folder.enableSorting(key), _this);
        }),
        (_this.eliminate = function () {
          (_this.toolbar.eliminate(), document.removeEventListener("keydown", onKeydown, !1));
        }),
        (_this.element.div.style.cssText = `\n    --panel-width: ${_this.params?.options?.width || "300px"};\n    --panel-height: ${_this.params?.options?.height || "100vh"};\n    --panel-max-height: ${_this.params?.options?.maxHeight || "100vh"};\n    --timing: ${TweenManager._getEase("easeOutCubic")};\n`),
        _this.element.goob(
          `\n    & {\n        background-color: var(--panel-background-color);\n        width: var(--panel-width);\n        height: var(--panel-height);\n        max-height: var(--panel-max-height);\n        overflow-y: auto;\n        user-select: none;\n        position: absolute;\n        top: 0;\n        left: ${"left" === _this.params?.options?.side ? "0" : "auto"};\n        right: ${"left" !== _this.params?.options?.side ? "0" : "auto"};\n        opacity: 0.6;\n        transition: opacity 0.2s var(--timing);\n        pointer-events: all;\n        border-radius: 20px;\n        margin-left: 10px;\n        margin-right: 10px;\n\n        &:hover {\n            opacity: 1;\n        }\n    }\n\n    &.history {\n        opacity: 1;\n        right: calc(var(--panel-width) * -1);\n        transition: right 0.5s ease-out;\n\n        &.open {\n            right: 0;\n        }\n    }\n`,
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILPanelToolbar(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILPanelToolbar"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [{ _type: "input", refName: "filterInput", children: [] }],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let _state = new Map();
      function restoreFolderState() {
        (_this.parent.folder.forEachFolder((folder) => {
          _state.get(folder) ? folder.open() : folder.close();
        }),
          _state.clear());
      }
      function onInput(e) {
        if (!_this.filterInput.div.value.length)
          return (restoreFolderState(), _this.parent.folder.showChildren());
        _this.parent.folder.filter(_this.filterInput.div.value);
      }
      function onFocus() {
        (!(function saveFolderState() {
          _this.parent.folder.forEachFolder((folder) => {
            _state.set(folder, folder.isOpen());
          });
        })(),
          _this.filterInput.css({ border: "1px solid #37a1ef" }));
      }
      function onBlur() {
        _this.filterInput.css({ border: "1px solid #2e2e2e" });
      }
      function onKeyPressed(e) {
        if (27 === e.keyCode)
          return (
            (_this.filterInput.div.value = ""),
            restoreFolderState(),
            _this.parent.folder.showChildren()
          );
      }
      ((_this.ready = !1),
        (function initListeners() {
          (_this.filterInput.div.addEventListener("input", onInput, !1),
            _this.filterInput.div.addEventListener("keydown", onKeyPressed, !1),
            _this.filterInput.div.addEventListener("focus", onFocus, !1),
            _this.filterInput.div.addEventListener("blur", onBlur, !1));
        })(),
        (_this.onMounted = () => {
          _this.ready = !0;
        }),
        (_this.eliminate = function () {
          (_this.filterInput.div.removeEventListener("input", onInput, !1),
            _this.filterInput.div.removeEventListener("keydown", onKeyPressed, !1),
            _this.filterInput.div.removeEventListener("focus", onFocus, !1),
            _this.filterInput.div.removeEventListener("blur", onBlur, !1));
        }),
        (_this.filter = function (text) {
          ((_this.filterInput.div.value = text), onInput());
        }),
        (_this.filterSingle = async function (text) {
          ((_this.filterInput.div.value = text),
            _this?.parent?.folder?.filterSingle(_this.filterInput.div.value));
        }),
        (_this.hideAll = function () {
          _this.flag("init") || (_this.flag("init", !0), this.filterSingle("xxxxxx"));
        }),
        _this.element.goob(
          "\n    & {\n        background-color: var(--panel-background-color);\n        padding: calc(var(--spacing-small) / 2);\n        padding-bottom: 0;\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILPerformance(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILPerformance"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              data: "$statsData",
              view: "UILPerformanceItem",
              _type: "ViewState",
              refName: "unnamed",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.statsData = new StateArray(
          Object.entries(RenderStats.stats).map(([key, value]) => ({
            key: key,
            value: value,
          })),
        )),
        _this.startRender(function updateStats() {
          if (((RenderStats.active = _this.params.active), !_this.params.active)) return;
          (Object.entries(RenderStats.stats).forEach(([key, value]) => {
            let isKeyMapped = !1;
            (_this.statsData.forEach((d) => d.get("key") === key && (isKeyMapped = !0)),
              isKeyMapped || _this.statsData.push({ key: key, value: value }));
          }),
            _this.statsData.forEach((d) => d.set("value", RenderStats.stats[d.get("key")])));
        }, 10),
        _this.element.goob(
          "\n    & {\n        width: 100%;\n        padding: var(--spacing-small);\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILPerformanceItem(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, ViewStateElement),
      Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILPerformanceItem"),
      (_this.contexts = "ViewStateElement,Element"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "span",
              _innerText: "$data.key",
              refName: "unnamed",
              children: [],
            },
            {
              _type: "span",
              _innerText: "$data.value",
              refName: "unnamed",
              children: [],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.element.goob(
          "\n    & {\n        display: flex;\n        font: var(--label3);\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: calc(var(--spacing-small) / 2);\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILTabs(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, XComponent),
      (_this.fragName = "UILTabs"),
      (_this.contexts = "Element"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "header",
              refName: "tabsHeader",
              children: [
                {
                  _type: "nav",
                  refName: "nav",
                  children: [
                    {
                      view: "UILTabsNavItem",
                      data: "$state.tabsData",
                      _type: "ViewState",
                      refName: "unnamed",
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              _type: "section",
              refName: "tabsContent",
              children: [
                {
                  view: "UILTabsContentItem",
                  data: "$state.tabsData",
                  _type: "ViewState",
                  refName: "unnamed",
                  children: [],
                },
              ],
            },
            {
              click: "$handleHistoryClick",
              _type: "button",
              refName: "historyButton",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.ready = !1),
        _this.createState(),
        _this.state.set("tabsData", new StateArray(_this.params)),
        _this.state.set("activeIndex", 0),
        _this.state.set("historyLabel", "History"),
        _this.state.bind("historyLabel", _this.historyButton),
        (_this.onMounted = async () => {
          (_this.historyButton.hide(),
            (function initListeners() {
              (_this.bindState(_this.state, "activeIndex", (value) => {
                !(function updateActiveTab() {
                  (_this.state.tabsData.forEach((tab, index) => {
                    tab.active = _this.state.activeIndex === index;
                  }),
                    _this.tabsContent.tween(
                      {
                        x: -_this.element.div.offsetWidth * _this.state.activeIndex,
                      },
                      200,
                      "easeOutCubic",
                    ));
                })();
              }),
                _this.bind("UILPanel/historyPanelToggle", (value) => {
                  value
                    ? _this.state.set("historyLabel", "Hide History")
                    : _this.state.set("historyLabel", "History");
                }));
            })(),
            _this.element.attr(
              "style",
              `\n        --tab-content-width: 300px;\n        --tab-count: ${_this.state.tabsData.length};\n    `,
            ),
            (_this.ready = !0));
        }),
        _this.listen("UILTabsNavItem/click", (event) => {
          _this.state.tabsData.forEach((tab, index) => {
            tab.id === event.id && _this.state.set("activeIndex", index);
          });
        }),
        (_this.handleHistoryClick = () => {
          _this.fire("toggle-history-panel");
        }),
        (_this.setActiveTab = (index) => {
          _this.state.set("activeIndex", index);
        }),
        (_this.addTab = (tabData) => {}),
        (_this.removeTab = (tabId) => {}),
        (_this.setDisabledTab = (tabId) => {}),
        (_this.setHiddenTab = (tabId) => {}),
        (_this.addGraph = (graph) => {
          _this.state.tabsData.find((tab) => "playground" === tab.id).content = graph;
        }),
        (_this.addGlobalFolder = (folder) => {
          _this.state.tabsData.find((tab) => "global" === tab.id).content = folder;
        }),
        (_this.showHistoryButton = async () => {
          (await _this.wait(() => _this.ready), await defer());
        }),
        _this.element.goob(
          "\n    & {\n        box-sizing: border-box;\n        color: #fff;\n        width: 100%;\n        height: 100%;\n        overflow: hidden;\n        position: relative;\n    }\n\n    .tabsHeader {\n        background-color: var(--panel-background-color);\n        border-bottom: var(--border);\n        font: var(--label3-semi);\n    }\n    \n    .nav {\n        display: flex;\n        width: 100%;\n    }\n\n    .tabsContent {\n        display: flex;\n        width: calc(var(--tab-content-width) * var(--tab-count));\n        height: 100%;\n\n        .UILPanel.global & {\n            height: calc(100% - 39px);\n        }\n    }\n\n    .UILTabsContentItem {\n        width: var(--tab-content-width);\n    }\n\n    .historyButton {\n        background-color: var(--color-neutral-20);\n        border: none;\n        color: var(--color-neutral-70);\n        border-radius: 0;\n        width: 100%;\n        text-align-last: left;\n        position: absolute;\n        bottom: 0;\n        left: 0;\n        padding: var(--spacing-small);\n\n        &:hover {\n            color: var(--color-white);\n        }\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILTabsContentItem(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, ViewStateElement),
      Inherit(_this, XComponent),
      (_this.fragName = "UILTabsContentItem"),
      (_this.contexts = "Element,ViewStateElement"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      function destroyToolbar() {
        _this.toolbar.destroy();
      }
      function destroyFolder() {
        _this.folder.destroy();
      }
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              _type: "article",
              refName: "contentContainer",
              children: [
                { _type: "UILPanelToolbar", refName: "toolbar", children: [] },
                {
                  id: "$data.label",
                  options: "$folderOptions",
                  _type: "UILFolder",
                  refName: "folder",
                  children: [],
                },
              ],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.ready = !1),
        (_this.folderOptions = { hideTitle: !0, drag: !1 }),
        (_this.onMounted = () => {
          ((_this.ready = !0), _this.set("container", _this.contentContainer));
        }),
        _this.data.bind("content", async (value) => {
          value &&
            (await _this.wait(() => _this.ready),
            await defer(),
            "function" == typeof value
              ? (destroyToolbar(),
                destroyFolder(),
                (function addHydraObject(hydraObject) {
                  _this.initClass(hydraObject, _this.data, [_this.contentContainer]);
                })(value))
              : value instanceof UILFolder
                ? (function addFolder(folder) {
                    _this.folder.add(folder);
                  })(value)
                : "object" == typeof value &&
                  (destroyToolbar(),
                  destroyFolder(),
                  (function addHTML(markup) {
                    _this.contentContainer.add(markup);
                  })(value)));
        }),
        _this.element.goob(
          "\n    & {\n        height: 100%;\n        max-height: 100vh;\n        overflow-y: auto;\n        \n        .UILPanel.global & {\n            max-height: calc(100vh - 40px);\n            padding-bottom: 40px;\n        }\n    }\n\n    .UILPanel.history & {\n        .contentContainer {\n            height: 100%;\n        }\n    }\n    \n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function UILTabsNavItem(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, Element),
      Inherit(_this, ViewStateElement),
      Inherit(_this, XComponent),
      (_this.fragName = "UILTabsNavItem"),
      (_this.contexts = "Element,ViewStateElement"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              click: "$onClick",
              href: "$state.anchor",
              _type: "a",
              _innerText: "$data.label",
              refName: "tab",
              children: [],
            },
          ],
        }),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.createState(),
        _this.state.set("anchor", `#${_this.data.id}`),
        (_this.onClick = (event) => {
          (event.preventDefault(), _this.fire("click", { id: _this.data.id }));
        }),
        _this.data.bind("active", (value) => {
          const action = value ? "add" : "remove";
          _this.tab.classList()[action]("active");
        }),
        _this.element.goob(
          "\n    & {\n        &:last-of-type {\n            .tab:after {\n                display: none;\n            }\n        }\n    }\n\n    .tab {\n        color: var(--color-action--disabled);\n        display: block;\n        font: var(--label3-semi);\n        padding: var(--spacing-small);\n        text-decoration: none;\n        position: relative;\n\n        &:after {\n            content: '';\n            display: block;\n            width: 1px;\n            height: 66%;\n            background-color: var(--color-neutral-40);\n            position: absolute;\n            right: 0;\n            top: 16.666%;\n        }\n        \n        &.active {\n            color: var(--font-color-base);\n        }\n    }\n",
        ));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function ViewController(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Frag3D, "ViewController"),
      Inherit(_this, Router, null, ""),
      Inherit(_this, XComponent),
      (_this.fragName = "ViewController"),
      (_this.contexts = 'Frag3D, "ViewController",Router, null, ""'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      let video;
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        ((_this.nuke || World.NUKE).paused = !0),
        (_this.ref_ShaderVariants986 = _this.initClass(ShaderVariants)),
        _this.ref_ShaderVariants986.isFragment &&
          _promises.push(_this.wait(_this.ref_ShaderVariants986, "__ready")),
        (_this.ref_Home905 = _this.initClass(Home)),
        _this.ref_Home905.isFragment && _promises.push(_this.wait(_this.ref_Home905, "__ready")),
        (_this.ref_About181 = _this.initClass(About)),
        _this.ref_About181.isFragment && _promises.push(_this.wait(_this.ref_About181, "__ready")),
        (_this.work = _this.initClass(Work)),
        _this.work.isFragment && _promises.push(_this.wait(_this.work, "__ready")),
        (_this.ref_TreeScene264 = _this.initClass(TreeScene)),
        _this.ref_TreeScene264.isFragment &&
          _promises.push(_this.wait(_this.ref_TreeScene264, "__ready")),
        (_this.ref_CleanRoom870 = _this.initClass(CleanRoom)),
        _this.ref_CleanRoom870.isFragment &&
          _promises.push(_this.wait(_this.ref_CleanRoom870, "__ready")),
        (_this.ref_Footer111 = _this.initClass(Footer)),
        _this.ref_Footer111.isFragment &&
          _promises.push(_this.wait(_this.ref_Footer111, "__ready")),
        (_this.scroll = _this.initClass(
          FXScroll,
          AppState.createLocal(
            {
              angle: 0.7,
              pingPong: Tests.pingPongRender(),
              keyboard: "false",
              virtualScroll: "false",
              pageScalar: Device.mobile.phone ? 0.5 : 1,
            },
            !0,
          ),
        )),
        _this.scroll.isFragment && _promises.push(_this.wait(_this.scroll, "__ready")),
        (_this.ref_NavUI333 = _this.initClass(NavUI)),
        _this.ref_NavUI333.isFragment && _promises.push(_this.wait(_this.ref_NavUI333, "__ready")),
        (_this.ref_NavUILeft = _this.initClass(NavUILeft)),
        _this.ref_NavUILeft.isFragment &&
          _promises.push(_this.wait(_this.ref_NavUILeft, "__ready")),
        (_this.ref_ContactUI570 = _this.initClass(ContactUI)),
        _this.ref_ContactUI570.isFragment &&
          _promises.push(_this.wait(_this.ref_ContactUI570, "__ready")),
        (_this.ref_CookieBanner690 = _this.initClass(CookieBanner)),
        _this.ref_CookieBanner690.isFragment &&
          _promises.push(_this.wait(_this.ref_CookieBanner690, "__ready")),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.set("hasMusic", !Tests.noMusic()),
        _this.set("scroll", _this.scroll),
        (_this.uniforms = {
          uRGBStrength: { value: 1 },
          uContrast: { value: new Vector2(1, 1) },
          uScrollDelta: { value: 0 },
          uScroll: { value: 0 },
          tNormal: {
            value: Utils3D.getTexture("assets/images/pbr/damaged_road_normal.jpg"),
            getTexture: Utils3D.getRepeatTexture,
          },
          uMouse: { value: new Vector2() },
          uNormalScale: { value: 1 },
          uFrostCorner: { value: new Vector3(0.8, 0.9, 0.1) },
          uGradient: { value: new Vector2(0, 1) },
          uContact: { value: 0 },
          uVisible: { value: 0 },
          uChatOpen: { value: 0 },
          uUIColor: { value: new Color("#ff0000") },
          uSyncTouch: { value: 0 },
          uUIBlend: { value: 0 },
        }),
        _this.set("uniforms", _this.uniforms),
        Device.mobile && _this.uniforms.uFrostCorner.value.set(0.75, 1.4, 0.35),
        _this.bind("ViewController/contact", (active) => {
          active
            ? _this.composite?.tween?.("uContact", 1, 1500, "workInOut")
            : _this.composite?.tween?.("uContact", 0, 1500, "workInOut");
        }),
        _this.bind("Work/project", (data, prevData) => {
          data
            ? (_this.composite?.set?.("uUIColor", new Color("#" + data.color)),
              _this.composite?.tween?.("uUIBlend", 1, 1500, "workInOut"))
            : prevData && _this.composite?.tween?.("uUIBlend", 0, 1500, "workInOut");
        }),
        (_this.onInit = (_) => {
          (MouseFluid.instance().applyTo(_this.composite.pass),
            ["home", "about", "work", "tree", "contact", "footer"].forEach((key) => {
              _this.createShaderVariant(key, _this.bloom.compositeShader);
            }),
            _this.bind("Router/state", (val) => {
              val &&
                ["home", "about", "work", "tree", "contact", "footer"].some((route) =>
                  val.startsWith(route),
                ) &&
                _this.setShaderVariant(val.split("/")[0]);
            }),
            _this.listen("Global/loadFinished", (_) => {
              (_this.composite.set("uVisible", 0),
                _this.composite.tween("uVisible", 1, 5e3, "workInOut"));
            }));
        }),
        Tests.videoVFX()
          ? ((video = _this.createFragment(VideoTexture, "assets/video/reel.mp4", {
              firstFrame: "assets/video/reel-frame.jpg",
            })),
            video.start())
          : (video = Utils3D.getTexture("assets/images/room/matcap-test.jpg")),
        _this.set("video", video),
        _this.bind("FXScroll/initialized", (_) => _this.set("scroll", _this.scroll)));
      let scrolled = 0,
        delta = 0;
      (_this.startRender((_) => {
        if (_this.scroll && _this.scroll.progress) {
          let dif = scrolled - _this.scroll.progress;
          ((delta = Math.clamp(1500 * dif, -3, 3)), (scrolled = _this.scroll.progress));
        }
        let lerp = Device.mobile ? 0.15 : 0.1;
        ((_this.uniforms.uScrollDelta.value = Math.lerp(
          delta,
          _this.uniforms.uScrollDelta.value,
          lerp,
        )),
          (_this.uniforms.uScroll.value = Math.lerp(
            20 * scrolled,
            _this.uniforms.uScroll.value,
            lerp,
          )),
          (_this.uniforms.uMouse.value = Math.lerp(
            Mouse.normal,
            _this.uniforms.uMouse.value,
            lerp,
          )),
          (_this.uniforms.uGradient.value.x =
            Device.mobile && Stage.width < Stage.height ? 0.05 : 0.02),
          (_this.uniforms.uGradient.value.y =
            Device.mobile && Stage.width < Stage.height ? 2 : 0.9),
          _this.set("visibleV", _this.uniforms.uVisible.value),
          _this.set("scrollV", _this.uniforms.uScroll.value),
          _this.set("scrollDeltaV", _this.uniforms.uScrollDelta.value));
      }),
        World.SCENE.add(_this.group),
        _this.listen("resetWork", (_) => {
          "work" === _this.get("Router/state") && _this.scroll.scrollTo(_this.work, 1e3);
        }),
        _this.listen("topOfWork", (_) => {
          _this.scroll.scrollTo(_this.work);
        }),
        _this.listen("bottomOfWork", (_) => {
          _this.scroll.scrollTo(_this.work.end - Stage.height);
        }),
        _this.listen("goToWork", (_) => {
          _this.scroll.scrollTo(_this.work, 1e3);
        }),
        _this.bind("navigate", (path) => _this.navigate(path)),
        (document.title = "Swayam · Achievements"),
        _this.bind("Work/project", (data) => {
          document.title = data ? `${data.title} · Swayam` : "Swayam · Achievements";
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.composite = _this.initClass(
          NukePass,
          AppState.createLocal({ shader: "GlobalComposite", uniforms: _this.uniforms }, !0),
        )),
        _this.composite.isFragment && _promises.push(_this.wait(_this.composite, "__ready")),
        _this.nuke && (_this.composite.texture = _this.nuke.rttBuffer),
        (_this.bloom = _this.initClass(
          FX.UnrealBloom,
          AppState.createLocal(
            {
              unique: "globalbloom",
              nuke: _this.nuke,
              dpr: 0.3,
              enabled: Tests.bloom(),
            },
            !0,
          ),
        )),
        _this.bloom.isFragment && _promises.push(_this.wait(_this.bloom, "__ready")),
        _this.bloom.uniforms && _this.composite.addUniforms(_this.bloom.uniforms),
        (_this.ref_FXHydraLensStreak624 = _this.initClass(
          FX.HydraLensStreak,
          AppState.createLocal({ nuke: _this.nuke, enabled: Tests.lensStreak() }, !0),
        )),
        _this.ref_FXHydraLensStreak624.isFragment &&
          _promises.push(_this.wait(_this.ref_FXHydraLensStreak624, "__ready")),
        _this.ref_FXHydraLensStreak624.uniforms &&
          _this.composite.addUniforms(_this.ref_FXHydraLensStreak624.uniforms),
        (_this.composite.upload || _this.composite.pass) &&
          ((_this.nuke || World.NUKE).add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          ),
          ShaderUIL.add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          )),
        ((_this.nuke || World.NUKE).paused = !1),
        _this._initFXScroll([
          {
            vh: "4",
            cameraMove: "20",
            privateRoute: "home",
            view: "$ref_Home905",
          },
          {
            vh: "1",
            cameraMove: "2",
            cameraLayer: "camera",
            privateRoute: "about",
            view: "$ref_About181",
          },
          { vh: "10", route: "work", view: "$work" },
          {
            vh: "2",
            cameraMove: "6",
            cameraLayer: "camera",
            privateRoute: "tree",
            view: "$ref_TreeScene264",
          },
          {
            vh: "1.2",
            cameraMove: "4",
            cameraLayer: "camera",
            privateRoute: "contact",
            view: "$ref_CleanRoom870",
          },
          {
            vh: "4",
            cameraMove: "20",
            privateRoute: "footer",
            view: "$ref_Footer111",
          },
        ]),
        _this.initClass(StateInitializer, MusicPlayerDOM, "music", void 0, {
          init: "hasMusic",
        }),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WallShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "WallShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          uRUVOffset: { value: new Vector2() },
          uRUVScale: { value: 1 },
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WaterCeilingShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "WaterCeilingShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        fbr(_this.shader),
        _this.shader.addUniforms({
          tMap: { value: null, getTexture: Utils3D.getRepeatTexture },
          tVideo: { value: null },
        }),
        (_this.onInit = async (_) => {
          let video = await _this.get("ViewController/video");
          _this.shader.uniforms.tVideo = video.uniform;
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function Work(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "Work"),
      Inherit(_this, XComponent),
      (_this.fragName = "Work"),
      (_this.contexts = 'FragFXScene, "Work"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.detail = _this.initClass(WorkDetail)),
        _this.detail.isFragment && _promises.push(_this.wait(_this.detail, "__ready")),
        _this._initFXScene(World.NUKE, null, {
          format: void 0,
          type: void 0,
          minFilter: void 0,
          magFilter: void 0,
          multiRenderTarget: void 0,
          mipmaps: void 0,
          screenQuad: void 0,
          vrMode: void 0,
          multisample: void 0,
          samplesAmount: void 0,
        }),
        (_this.refractionLayer = _this.initClass(
          FXLayer,
          AppState.createLocal({ name: "WorkRefraction" }, !0),
        )),
        _this.refractionLayer.isFragment &&
          _promises.push(_this.wait(_this.refractionLayer, "__ready")),
        (_this.refraction = _this.initClass(
          SnapshotFrame,
          AppState.createLocal({ texture: _this.refractionLayer }, !0),
        )),
        _this.refraction.isFragment && _promises.push(_this.wait(_this.refraction, "__ready")),
        ((_this.nuke || World.NUKE).paused = !0),
        (_this.chat = _this.initClass(ChatDOM)),
        _this.chat.isFragment && _promises.push(_this.wait(_this.chat, "__ready")),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.uniforms = {
          uRGBStrength: { value: 1 },
          uContrast: { value: new Vector2(1, 1) },
          uTransition: { value: 0 },
          tDetail: { value: _this.detail },
        }),
        _this.detail && (_this.detail.visible = !1),
        _this.set("refraction", _this.refraction),
        _this.set("pane", _this.layers.pane),
        _this.set("pane_ui", _this.layers.pane_ui),
        _this.set("camera", _this.layers.camera),
        _this.set("scene", _this.scene),
        _this.layers.camera.lock(),
        (Device.mobile?.phone || 0.9 * Stage.width < Stage.height) &&
          (_this.layers.camera.setFOV(55), (_this.layers.flower.group.scale.y *= 1.2)),
        GLA11y.registerPage(_this.scene, "WorkPage"));
      let video = _this.createFragment(
        VideoTexture,
        "https://storage.googleapis.com/activetheory-v6.appspot.com/media/prometheus (720p).mp4",
        { preload: !1 },
      );
      let videoTimeout;
      (_this.set("video", video),
        _this.bind("WorkItems/videoURL", (src) => {
          clearTimeout(videoTimeout);
          if (!src) {
            ((video.src = ""), _this.fire("updatedVideo", ""));
            return;
          }
          videoTimeout = setTimeout(async () => {
            if (src === _this.get("WorkItems/videoURL")) {
              ((video.src = src), await video.start(), _this.fire("updatedVideo", src));
            }
          }, 200);
        }));
      let flowerRotation = 0;
      _this.startRender(async (_) => {
        (await _this.layers.flower.ready(),
          null != _this.scrollProgress &&
            ((_this.layers.flower.shader.uniforms.uRotate.value = Math.lerp(
              flowerRotation,
              _this.layers.flower.shader.uniforms.uRotate.value,
              0.05,
            )),
            (_this.layers.flower.group.rotation.y = Math.radians(100)),
            (_this.layers.flower.shader.uniforms.uScroll.value = _this.scrollProgress),
            (_this.layers.flower.shader.uniforms.uSparkle.value += 0.005),
            _this.set("scrollProgress", _this.scrollProgress)));
      });
      var _scroll = Scroll.getUnlimited();
      function checkScrollOut() {
        Math.abs(_scroll.delta.y) > (Device.mobile ? 20 : 10) && _this.set("Work/project", null);
      }
      (_this.events.sub(Keyboard.DOWN, async (e) => {
        e && e.key && e.key.toLowerCase().includes(["escape"]) && _this.set("Work/project", null);
      }),
        TweenManager.addCustomEase({
          name: "workInOut",
          curve: "cubic-bezier(.29,.05,.06,.92)",
        }),
        _this.bind("ViewController/resetWork", (_) => {
          null != _this.scrollProgress &&
            ((flowerRotation += 2 * Math.radians(360 * _this.scrollProgress)),
            (_this.layers.flower.shader.uniforms.uSparkle.value = 0));
        }),
        _this.bind("Work/project", (data, prevData) => {
          data
            ? (_this.scrollProgress < 0.07
                ? _this.fire("ViewController/topOfWork")
                : _this.scrollProgress > 0.93 && _this.fire("ViewController/bottomOfWork"),
              _this.findParent("ViewController").lockScroll(),
              _this.startRender(checkScrollOut),
              _this.detail && (_this.detail.visible = !0),
              _this.composite.tween("uTransition", 1, 1500, "workInOut").onComplete((_) => {}))
            : prevData &&
              (_this.fire("ChatDOM/clearText"),
              _this.fire("ChatDOM/resetOptions"),
              _this.navigate("work"),
              _this.findParent("ViewController").unlockScroll(),
              _this.stopRender(checkScrollOut),
              _this.composite.tween("uTransition", 0, 800, "workInOut").onComplete((_) => {
                _this.detail.visible = !1;
              }));
        }),
        _this.bind("FXScroll/initialized", (_) => {
          Initializer3D.uploadAllAsync(_this.detail.layout);
        }),
        (_this.onInit = async (_) => {
          await _this.layers.flower.ready();
          let attenuation = 1;
          (Tests.particleCount() <= 16384
            ? (attenuation = 1.6)
            : Tests.particleCount() <= 65536
              ? (attenuation = 1.4)
              : Tests.particleCount() <= 262144 && (attenuation = 1.2),
            Device.mobile.phone && (attenuation *= 0.6),
            _this.layers.flower.shader.addUniforms({
              uSizeBias: { value: attenuation },
            }));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.composite = _this.initClass(
          NukePass,
          AppState.createLocal({ shader: "WorkComposite", uniforms: _this.uniforms }, !0),
        )),
        _this.composite.isFragment && _promises.push(_this.wait(_this.composite, "__ready")),
        _this.nuke && (_this.composite.texture = _this.nuke.rttBuffer),
        (_this.composite.upload || _this.composite.pass) &&
          ((_this.nuke || World.NUKE).add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          ),
          ShaderUIL.add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          )),
        ((_this.nuke || World.NUKE).paused = !1),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkDetail(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "WorkDetail"),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkDetail"),
      (_this.contexts = 'FragFXScene, "WorkDetail"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this._initFXScene(World.NUKE, null, {
          format: void 0,
          type: void 0,
          minFilter: void 0,
          magFilter: void 0,
          multiRenderTarget: void 0,
          mipmaps: void 0,
          screenQuad: void 0,
          vrMode: void 0,
          multisample: void 0,
          samplesAmount: void 0,
        }),
        (_this.particles = _this.initClass(WorkDetailParticles)),
        _this.particles.isFragment && _promises.push(_this.wait(_this.particles, "__ready")),
        (_this.content = _this.initClass(WorkDetailContent)),
        _this.content.isFragment && _promises.push(_this.wait(_this.content, "__ready")),
        ((_this.nuke || World.NUKE).paused = !0),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.scene.add(_this.content.group),
        (_this.uniforms = { uRGBStrength: { value: 1 } }));
      var _targetZ = 0;
      let cube = _this.layers.cube,
        camera = _this.layers.camera;
      (_this.set("camera", camera),
        camera.lock(),
        cube.shader.set("tRefraction", _this.particles),
        Device.mobile && camera.still(),
        MouseFluid.instance().applyTo(cube.shader),
        GLA11y.registerPage(_this.scene, "WorkDetailPage"),
        _this.onResize((_) => {
          let width = (Stage.width / Stage.height) * 5;
          (cube.scale.set(width, 5, 5).multiplyScalar(1), (cube.position.z = 0.35 * cube.scale.z));
          const distance = 2.5 / Math.tan(Math.radians(camera.camera.fov / 2));
          ((camera.group.position.z = distance), (_targetZ = distance));
        }),
        (_this.onInit = async (_) => {
          (await _this.wait((_) => !!_this.nuke),
            await _this.wait(_this.nuke, "finalTexture"),
            cube.shader.set("tPrevFrame", _this.nuke.finalTexture));
        }),
        _this.bind("Work/project", (data) => {
          data
            ? (_this.fire("WorkDetailContent/updateText", data),
              (_this.particles.layers.camera.group.position.z = 25),
              (camera.group.position.z = _targetZ + 5),
              tween(camera.group.position, { z: _targetZ }, 1500, "workInOut"),
              tween(_this.particles.layers.camera.group.position, { z: 0 }, 1500, "workInOut"))
            : tween(camera.group.position, { z: _targetZ + 5 }, 1500, "workInOut");
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.composite = _this.initClass(
          NukePass,
          AppState.createLocal({ shader: "WorkDetailComposite", uniforms: _this.uniforms }, !0),
        )),
        _this.composite.isFragment && _promises.push(_this.wait(_this.composite, "__ready")),
        _this.nuke && (_this.composite.texture = _this.nuke.rttBuffer),
        (_this.composite.upload || _this.composite.pass) &&
          ((_this.nuke || World.NUKE).add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          ),
          ShaderUIL.add(
            _this.composite.pass instanceof NukePass ? _this.composite.pass : _this.composite,
          )),
        ((_this.nuke || World.NUKE).paused = !1),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkDetailContent(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Frag3D, "WorkDetailContent"),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkDetailContent"),
      (_this.contexts = 'Frag3D, "WorkDetailContent"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        MouseFluid.instance().applyTo(_this.layers.video.shader));
      let video = await _this.get("Work/video");
      (_this.layers.video.shader.set("tMap", video),
        _this.modal ||
          (function createModal() {
            if (_this.modal) return;
            ((_this.modal = Stage.create("VideoModal")),
              _this.modal.css({ display: "none" }),
              _this.modal.goob(
                "\n        position: absolute;\n        align-items: center;\n        justify-content: center;\n        display: flex;\n\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        z-index: 2;\n        padding: 25px;\n\n        background-color: #000000cc;\n    ",
              ),
              (_this.video = document.createElement("video")),
              (_this.video.src = Assets.getPath("assets/video/reel.mp4")),
              (_this.video.controls = !0),
              (_this.video.style.width = "100%"),
              (_this.video.style.height = "auto"),
              (_this.closeButton = _this.modal.create("closeButton")),
              _this.closeButton.interact(null, (_) => closeModal(), "#", "Close Video", {
                role: "button",
              }),
              _this.closeButton.goob(
                `\n        position: absolute !important;\n        top: 22px;\n        right: 22px;\n        z-index: 3;\n\n        width: 18px;\n        height: 18px;\n\n        border: none;\n        background: transparent url(${Assets.getPath("assets/images/ui/close.svg")});\n        background-size: cover;\n        background-position: center;\n        background-repeat: no-repeat;\n\n        @media (hover:hover) {\n            &:hover {\n                transition: 0.1s all ease;\n                transform: scale(1.1);\n            }\n        }\n    `,
              ),
              _this.modal.div.appendChild(_this.video),
              Stage.add(_this.modal));
          })(),
        (_this.onFullscreenHover = (e) => {
          tween(
            e.mesh.scale,
            "over" == e.action ? { x: 0.55, y: 0.55 } : { x: 0.5, y: 0.5 },
            300,
            "easeOutCubic",
          );
        }),
        (_this.onFullscreenClick = (_) => {
          (_this.modal.css({ display: "flex", zIndex: "9999" }), _this.video.play());
        }));
      let camera = await _this.get("WorkDetail/camera");
      (Interaction3D.find(camera).add(
        _this.layers.button,
        _this.onFullscreenHover,
        _this.onFullscreenClick,
        { url: "#", label: "Open fullscreen video" },
      ),
        _this.bind("Router/state", (val) => {
          val.includes("work/") || closeModal();
        }));
      const getText = (text3d) => text3d.text.text.string;
      (GLA11y.textNode(_this.layers.title.group, getText(_this.layers.title)),
        GLA11y.textNode(_this.layers.date.group, getText(_this.layers.date)));
      let count = 0;
      function closeModal() {
        (_this.video.pause(), (_this.video.currentTime = 0), _this.modal.css({ display: "none" }));
      }
      (_this.bind(
        "updateText",
        ({
          title: title,
          date: date,
          body: body,
          tags: tags,
          caseStudyURL: caseStudyURL,
          projectURL: projectURL,
          ai: ai,
          color: color,
        }) => {
          (_this.layers.title.setText(title),
            _this.layers.date.setText(date),
            count++,
            count > 1 && (_this.layers.body.visible = !1),
            (_this.layers.body.text.alpha = 0),
            _this.layers.body.text.tween({ alpha: 1 }, 2e3, "easeInOutSine", 1500));
          let text = date.replace(/\n/g, " / ");
          text = text.split(",")[0];
          let col = new Color(Stage.width < 768 ? "#" + color : "#ffffff"),
            hsl = col.getHSL();
          tags.split(", ")[0];
          (_this.fire("ChatDOM/clearText"),
            col.setHSL(hsl.h, hsl.s, 0.6 + 0.3 * hsl.l),
            _this.set("ChatDOM/updateText", {
              text: `${title}`,
              color: col.getHexString(),
              animated: !0,
            }),
            col.setHSL(hsl.h, hsl.s, 0.45 + 0.3 * hsl.l),
            _this.set("ChatDOM/updateText", {
              text: `${text}`,
              color: col.getHexString(),
              animated: !0,
              delay: 300,
            }),
            col.setHSL(hsl.h, hsl.s, 0.6 + 0.3 * hsl.l),
            _this.set("ChatDOM/updateText", {
              text: body,
              color: col.getHexString(),
              animated: !0,
              delay: 600,
            }),
            caseStudyURL &&
              _this.set("ChatDOM/updateLink", {
                title: "Medium Case Study",
                href: caseStudyURL,
                animated: !0,
                delay: 800,
              }),
            projectURL &&
              _this.set("ChatDOM/updateLink", {
                title: "Project Link",
                href: projectURL,
                animated: !0,
                delay: 900,
              }),
            _this.set("ChatDOM/updateFilter", {
              title: "<- Close",
              tag: null,
              animated: !0,
              delay: 1400,
            }),
            GLA11y.textNode(_this.layers.title.group, title),
            GLA11y.textNode(_this.layers.date.group, date),
            ai || _this.fire("CMSData/readyForResponse"));
        },
      ),
        (_this.layers.title.originTransform = Utils3D.cloneTransform(_this.layers.title)),
        (_this.layers.date.originTransform = Utils3D.cloneTransform(_this.layers.date)),
        (_this.layers.video.originTransform = Utils3D.cloneTransform(_this.layers.video)),
        _this.onResize((_) => {
          if (Stage.width < 500) {
            _this.layers.title.group.scale.set(0.5, 0.5, 1);
            let vscale = Math.map(Stage.width, 350, 800, 0.45, 1, !0);
            (_this.layers.video.scale.copy(_this.layers.video.originTransform.scale),
              (_this.layers.video.scale.x *= vscale),
              (_this.layers.video.scale.y *= vscale),
              (_this.layers.video.position.y = 0.5),
              _this.layers.title.group.position.set(0, 0.05, 2),
              _this.layers.date.group.position.set(1, 1.2, 1.5));
          } else
            (_this.layers.title.group.scale.copy(_this.layers.title.originTransform.scale),
              _this.layers.video.scale.copy(_this.layers.video.originTransform.scale),
              _this.layers.title.group.position.copy(_this.layers.title.originTransform.position),
              _this.layers.date.group.position.copy(_this.layers.date.originTransform.position));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkDetailParticles(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, FragFXScene, "WorkDetailParticles"),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkDetailParticles"),
      (_this.contexts = 'FragFXScene, "WorkDetailParticles"'),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this._initFXScene(World.NUKE, null, {
          format: void 0,
          type: void 0,
          minFilter: void 0,
          magFilter: void 0,
          multiRenderTarget: void 0,
          mipmaps: void 0,
          screenQuad: void 0,
          vrMode: void 0,
          multisample: void 0,
          samplesAmount: void 0,
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.layers.camera.lock(),
        Device.mobile && _this.layers.camera.still());
      let video = await _this.get("Work/video");
      await _this.layers.particles.ready();
      let attenuation = 1;
      (Tests.particleCount() <= 16384
        ? (attenuation = 1.4)
        : Tests.particleCount() <= 65536
          ? (attenuation = 1.2)
          : Tests.particleCount() <= 262144 && (attenuation = 1.1),
        _this.layers.particles.shader.addUniforms({
          tVideo: { value: video },
          uSizeBias: { value: attenuation },
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkItem(_data, _index, _params) {
    const _this = this;
    (Inherit(_this, Object3D),
      Inherit(_this, ViewStateElement),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkItem"),
      (_this.contexts = "Object3D,ViewStateElement"),
      (_this.data = _data),
      (_this.index = _index),
      (_this.params = _params),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.data = _data),
        (_this.index = _index),
        (_this.params = _params),
        _this.createState(),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let stillTexture = Utils3D.getTexture(_this.data.thumbnailURL),
        mesh = (await _this.get("Work/pane")).clone(),
        mesh_shader = mesh.shader.clone();
      (_this.add(mesh), (mesh.shader = mesh_shader), (mesh.visible = !0), mesh.shader.upload());
      let ui = (await _this.get("Work/pane_ui")).clone(),
        ui_shader = ui.shader.clone();
      async function updateLayout() {
        Device.mobile && Stage.height > Stage.width
          ? ((mesh.scale.x = 2.9),
            (mesh.scale.y = 2.7),
            (mesh.shader.uniforms.uScale.value.x = 1.6),
            (mesh.shader.uniforms.uScale.value.y = 0.9))
          : ((mesh.shader.uniforms.uScale.value.x = 1),
            (mesh.shader.uniforms.uScale.value.y = 1),
            mesh.scale.copy(mesh.oScale));
      }
      (_this.add(ui),
        (ui.shader = ui_shader),
        (ui.shader.depthWrite = !1),
        (ui.visible = !0),
        (ui.frustumCulled = !1),
        (ui.position.z = 0),
        ui.shader.upload(),
        (mesh.oScale = new Vector3().copy(mesh.scale)),
        updateLayout(),
        _this.onResize(updateLayout),
        (_this.onInit = async (_) => {
          let video = await _this.get("Work/video");
          (video && (mesh.shader.uniforms.tVideo.value = video),
            ui.shader.set("tMap", _this.paneRT.bitmap.capture),
            ui.shader.set("uColor", new Color("#" + _this.data.color)),
            (mesh.shader.uniforms.uColor.value = new Color("#" + _this.data.color)),
            mesh.shader.set("tMap", stillTexture),
            _this.bind("Work/updatedVideo", (src) => {
              src === _this.data.videoURL
                ? ((mesh.shader.uniforms.tVideo.value = video),
                  mesh.shader.tween("uVideoBlend", 1, 500, "easeOutSine", 300))
                : mesh.shader.set("uVideoBlend", 0);
            }));
        }),
        (_this.setRenderOrder = (i) => {
          ((mesh.renderOrder = i), (ui.renderOrder = i + 1));
        }));
      let mouse = new Vector2();
      _this.startRender((_) => {
        (mouse.lerp(Mouse.normal, 0.08),
          (mesh.shader.uniforms.uMouse.value = mouse),
          (mesh.shader.uniforms.uHover.value = Math.lerp(
            _this.hovered ? 1 : 0,
            mesh.shader.uniforms.uHover.value,
            0.08,
          )),
          (ui.shader.uniforms.uHover.value = mesh.shader.uniforms.uHover.value),
          (ui.shader.uniforms.uCamDistance.value = _this.paneRT.camdistance));
      });
      let camera = await _this.get("Work/camera");
      Interaction3D.find(camera).add(
        mesh,
        function onHover(e) {
          if (contact && "over" === e.action) return;
          if (e.seo && "over" === e.action) {
            if (!_this.parent || !_this.parent.views) return;
            let t = invSmooth(_this.data.index / _this.parent.views.length),
              scroll = Math.range(t, 0, 1, root.start, root.start + root.height, !0);
            _this.get("ViewController/scroll").scrollTo(scroll);
          }
          _this.hovered = "over" == e.action;
        },
        function onClick(e) {
          if (contact) return;
          if (_this.__distToCamera > 30) return;
          defer((_) => {
            !_this.get("ChatDOM/isFocused", !0) &&
              Date.now() - _this.get("ChatDOM/lastClick") > 50 &&
              _this.findParent("Work").scrollProgress < 0.96 &&
              !_this.get("ViewController/contact", !0) &&
              _this.navigate(`work/${_this.data.perma}`);
          });
        },
        { url: `work/${_this.data.perma}`, label: _this.data.seo },
      );
      let contact = !1;
      _this.bind("ViewController/contact", (active) => {
        contact = active;
      });
      let root = _this.findParent("Work");
      const invSmooth = (x) => x + (x - x * x * (3 - 2 * x));
      _this.bind("Router/state", (val) => {
        (val == `work/${_this.data.perma}` &&
          (_this.set("Work/project", _this.data),
          _this.set("WorkItems/videoURL", _this.data.videoURL)),
          val.includes("/"));
      });
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.paneRT = _this.initClass(
          WorkPaneUI,
          AppState.createLocal(
            {
              title: _this.data.title,
              copy: _this.data.subhead,
              projectLogo: _this.data.projectLogo,
              clientName: _this.data.clientName,
              mesh: mesh,
            },
            !0,
          ),
        )),
        _this.paneRT.isFragment && _promises.push(_this.wait(_this.paneRT, "__ready")),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkItemShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkItemShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      let mouse = new Vector2();
      (_this.shader.addUniforms({
        tMap: { value: null },
        tVideo: { value: null },
        uVideoBlend: { value: 0 },
        tRefraction: { value: null },
        tEnv: { value: null },
        tNormal: { value: null, getTexture: Utils3D.getRepeatTexture },
        uDistortStrength: { value: 1 },
        uFresnelPow: { value: 1 },
        uRefractionRatio: { value: 1 },
        uScale: { value: new Vector2(1, 1) },
        uColor: { value: new Color(Utils.randomColor()), batchUnique: !0 },
        uHover: { value: 0 },
        uMouse: { value: mouse },
        uPhone: { value: Device.mobile && Stage.height > Stage.width ? 1 : 0 },
      }),
        _this.startRender(async (_) => {
          let refraction = await _this.get("Work/refraction");
          (_this.shader.set("tRefraction", refraction),
            _this.shader.set("uPhone", Device.mobile && Stage.height > Stage.width ? 1 : 0));
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkItemUIShader(_mesh, _shader, _input, _group) {
    const _this = this;
    if (
      (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkItemUIShader"),
      (_this.contexts = "Component"),
      (_this.mesh = _mesh),
      (_this.shader = _shader),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      _this.uilFolder?.addButton)
    ) {
      let a = _this.uilFolder;
      ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
    }
    this.isFragment = !0;
    var _promises = [];
    !(async function () {
      if (
        (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.mesh = _mesh),
        (_this.shader = _shader),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.uilFolder?.addButton)
      ) {
        let a = _this.uilFolder;
        ((_this.uilFolder = _this.uilInput), (_this.uilInput = a));
      }
      (_this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        _this.shader.addUniforms({
          tMap: { value: null },
          uColor: { value: new Color(Utils.randomColor()), batchUnique: !0 },
          uCamDistance: { value: 0 },
          uAlpha: { value: 1 },
          uHover: { value: 0 },
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkItems(_input, _group) {
    const _this = this;
    (Inherit(_this, Object3D),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkItems"),
      (_this.contexts = "Object3D"),
      (_this.uilInput = _input),
      (_this.uilFolder = _group),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.uilInput = _input),
        (_this.uilFolder = _group),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.data = await _this.requestData("workItems", {}, (_) => {
          let data = [];
          for (let i = 0; i < 15; i++)
            data.push({
              seo: "Test SEO text for item " + i,
              title: i % 2 ? "Museum of Weed" : "Paper Planes",
              subhead:
                i % 2
                  ? "A small write-up of the project to give context to what it was, and the techniques used to create it."
                  : "At Google I/O 2016, users in 15 countries used a mobile device to fold, stamp and throw planes into the 50-ft screen on stage. So far, 4.5 million planes have been created.",
              date: "2017\nVICE\nINSTALLATION",
              body: "We worked with VICE  to build Exhibit 7 in the Museum of Weed, a temporary exhibition in Hollywood, California showcasing the social and legal evolution of cannabis.\n\nExhibit 7, Legalization, consisted of a 30 foot interactive timeline, powered by a Kinect, and a map visualization - both of which combine to tell the story of cannabis over time.",
              perma: "test" + i,
              index: i,
            });
          return data;
        })),
        _this.set("items", _this.data));
      var _views = [],
        _cameraTargets = [];
      function positionViews() {
        let mobile = Device.mobile && Stage.height > Stage.width;
        ((_cameraTargets.length = 0), (_views = [..._this.viewState.views]));
        let views = _this.viewState.views,
          angle = 0,
          total = Math.min(7, views.length),
          step = mobile ? Math.radians(35) : Math.radians(50),
          y = mobile ? 4 : 0,
          yStep = mobile ? 0.16 * total : 0.12 * total;
        views.forEach((view, i) => {
          ((view.group.position.x = 3.8 * Math.cos(angle)),
            (view.group.position.z = 3.8 * Math.sin(angle)),
            (view.group.position.y = 0));
          let pos = view.group.position.clone();
          (pos.multiplyScalar(2),
            view.group.lookAt(pos),
            (angle -= step),
            (view.group.position.y = y - yStep * i),
            (pos.y = y - yStep * i));
          let target = new Group();
          (target.position.copy(pos),
            Device.mobile && Stage.width < Stage.height && (target.position.y -= 0.7),
            target.quaternion.copy(view.group.quaternion),
            _cameraTargets.push(target),
            tween(view.group.scale, { x: 1, y: 1, z: 1 }, 1200, "easeOutQuint", 200 * i + 200));
        });
      }
      ((_this.onAddView = (view) => {
        (view.group.scale.setScalar(0), Utils.debounce(positionViews, 500));
      }),
        (_this.onRemoveView = (inst, index) => (
          _this.flag("removing") ||
            (_this.flag("removing", !0, 200), _this.fire("ViewController/resetWork")),
          tween(inst.group.scale, { x: 0, y: 0, z: 0 }, 400, "easeInQuart").promise()
        )),
        _this.set("videoURL", ""));
      let target = new Group(),
        scrollValue = (new Group(), 0),
        camera = (Scroll.getUnlimited(), await _this.get("Work/camera")),
        root = _this.findParent("Work");
      ((_this.handleCameraScroll = (_) => {
        if (_this.flag("locked")) return;
        if (!_cameraTargets[0] || null == root.scrollProgress) return;
        let offset = Device.mobile ? 0.1 : 0.06;
        scrollValue = Math.smoothStep(offset, 1 - offset, root.scrollProgress);
        let numPlanes = _cameraTargets.length,
          segmentPosition = scrollValue * (numPlanes - 1),
          planeIndex1 = Math.floor(segmentPosition),
          planeIndex2 = Math.min(planeIndex1 + 1, numPlanes - 1),
          segmentFraction = segmentPosition - planeIndex1,
          t0 = _cameraTargets[planeIndex1],
          t1 = _cameraTargets[planeIndex2];
        (target.position.copy(t0.position).lerp(t1.position, segmentFraction, !1),
          target.quaternion.copy(t0.quaternion).slerp(t1.quaternion, segmentFraction, !1),
          (target.position.y += -1 * Math.smoothStep(0, 0.15, root.scrollProgress)),
          (target.position.y += 1 * Math.smoothStep(1, 0.85, root.scrollProgress)),
          _this.flag("firstframe")
            ? (camera.group.position.lerp(target.position, 0.2),
              camera.group.quaternion.slerp(target.quaternion, 0.2))
            : (_this.flag("firstframe", !0),
              camera.group.position.copy(target.position),
              camera.group.quaternion.copy(target.quaternion)),
          _this.viewState.views.length &&
            _views[0].group &&
            (_views.sort((a, b) =>
              a.group && b.group
                ? ((a.__distToCamera = a.group.position.distanceToSquared(camera.group.position)),
                  (b.__distToCamera = b.group.position.distanceToSquared(camera.group.position)),
                  b.__distToCamera - a.__distToCamera)
                : 0,
            ),
            _views.forEach((view, i) => view.setRenderOrder?.(i)),
            "work" === _this.get("Router/state") &&
              _views[_views.length - 1].data &&
              _this.set("videoURL", _views[_views.length - 1].data.videoURL)));
      }),
        _this.startRender(_this.handleCameraScroll),
        _this.bind("Work/project", (data) => {
          if (data) {
            let view = (function findView(perma) {
              for (let i = 0; i < _views.length; i++) {
                if (!_views[i].data) return;
                if (_views[i].data.perma == perma) return _views[i];
              }
            })(data.perma);
            view &&
              (_this.flag("locked", !0),
              tween(camera.group.position, view.group.position, 700, "easeOutCubic"));
          } else _this.flag("locked", !1);
        }));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_this.viewState = _this.initClass(
          ViewState,
          AppState.createLocal(
            {
              view: "WorkItem",
              data: _this.data,
              onAddView: _this.onAddView,
              onRemoveView: _this.onRemoveView,
            },
            !0,
          ),
        )),
        _this.viewState.isFragment && _promises.push(_this.wait(_this.viewState, "__ready")),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkLabelPlayground(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, Component),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkLabelPlayground"),
      (_this.contexts = "Component"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.ref_WorkPaneUI479 = _this.initClass(
          WorkPaneUI,
          AppState.createLocal(
            {
              title: "Museum of Weed",
              copy: "A small write-up of the project to give context to what it was, and the techniques used to create it.",
            },
            !0,
          ),
        )),
        _this.ref_WorkPaneUI479.isFragment &&
          _promises.push(_this.wait(_this.ref_WorkPaneUI479, "__ready")),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkPaneUI(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, Initialization),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkPaneUI"),
      (_this.contexts = "GLUIElement,Initialization"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        (_this.bitmap = _this.initClass(
          UI3D,
          AppState.createLocal({ width: 1024, height: 1024 }, !0),
        )),
        _this.bitmap.isFragment && _promises.push(_this.wait(_this.bitmap, "__ready")),
        _this.initClass(FragUIHelper, {
          _type: "UI",
          refName: "unnamed",
          children: [
            {
              font: "Aquatico",
              fontSize: 18,
              fontColor: "#ffffff",
              x: 512,
              y: 600,
              z: 0,
              _type: "glText",
              _innerText: "client",
              refName: "client",
              children: [],
            },
            {
              font: "Aquatico",
              fontSize: 100,
              align: "center",
              fontColor: "#ffffff",
              x: 512,
              y: 280,
              z: 0,
              _type: "glText",
              _innerText: "Museum of Weed",
              refName: "title",
              children: [],
            },
            {
              font: "Aquatico",
              fontSize: 18,
              lineHeight: 1.6,
              fontColor: "#ffffff",
              x: 512,
              y: 600,
              z: 0,
              _type: "glText",
              _innerText: "X",
              refName: "copy",
              children: [],
            },
            {
              width: 400,
              height: 200,
              bg: "assets/images/_scenelayout/black.jpg",
              _type: "glObject",
              refName: "logo",
              children: [],
            },
            {
              width: 924,
              height: 224,
              bg: "#060606",
              _type: "glObject",
              refName: "block",
              children: [],
            },
            {
              width: 924,
              height: 2,
              bg: "#ffffff",
              _type: "glObject",
              refName: "underline",
              children: [],
            },
          ],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()));
      const logoShader = _this.createFragment(Shader, "LogoShader", {
        tMap: { value: null },
        uAlpha: { value: 1 },
      });
      (_this.logo.useShader(logoShader),
        (_this.onInit = async function () {
          (_this.bitmap.capture.rt.upload(),
            await _this.initSync(_this.element.group),
            await _this.initSync(_this.element),
            _this.set("ready", !0));
        }),
        (_this.copy.alpha = 0),
        (_this.camera = await _this.get("Work/camera")),
        (_this.camdistance = 0),
        _this.bitmap.linkMesh(
          _this.params.mesh,
          (_) => (
            (_this.camdistance = _this.params.mesh
              .getWorldPosition()
              .distanceTo(_this.camera.group.position)),
            _this.camdistance < 6
          ),
        ),
        _this.bitmap.root.add(_this.element));
      _this.gl(1024, 1024, _this.bitmap.capture);
      if (_this.params.title && _this.params.copy && _this.params.clientName) {
        _this.client.setText(_this.params.clientName.replace(/,/g, " /"), {
          size: 24,
          align: "center",
          letterSpacing: 0.1,
          lineHeight: 1.8,
        });
        let size = 0.9 * Math.range(_this.params.title.length, 5, 20, 130, 100, !0);
        (_this.title.setText(_this.params.title, {
          size: size,
          align: "center",
          letterSpacing: 0.01,
          lineHeight: 1.1,
          width: 700,
        }),
          _this.params.projectLogo &&
            (_this.logo.bg(_this.params.projectLogo.url), (_this.client.alpha = 0)),
          await _this.client.text.ready(),
          await _this.title.text.ready(),
          _this.copy && (await _this.copy.text.ready()),
          resize(),
          await _this.wait(500),
          resize(),
          (_this.bitmap.capture.needsRender = 100));
      }
      function resize() {
        ((_this.title.height = _this.title.dimensions.height),
          _this.copy && (_this.copy.height = _this.copy.dimensions.height),
          (_this.client.height = _this.client.dimensions.height),
          (_this.client.width = _this.client.dimensions.width));
        let y =
          470 - 0.5 * _this.title.height - 0.5 * _this.copy.height - 0.5 * _this.client.height;
        isNaN(y) ||
          ((_this.client.y = y),
          (y += _this.client.height + 20),
          (_this.title.y = y + 20),
          (y += _this.title.height + 80),
          _this.copy && (_this.copy.y = y),
          (_this.logo.y = _this.client.y - 105),
          (_this.logo.scale = 0.65),
          (_this.logo.x = 512 - _this.logo.width / 2),
          (_this.block.width = 1e3),
          (_this.block.height = 0.7 * _this.title.height),
          (_this.block.x = 512 - 0.5 * _this.block.width),
          (_this.block.y = _this.title.y + 0.8 * (_this.title.height - _this.block.height)));
      }
      _this.onResize((_) => {
        (resize(), (_this.bitmap.capture.needsRender = 100));
      });
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function WorkUI(_params, ...restArgs) {
    const _this = this;
    (Inherit(_this, GLUIElement),
      Inherit(_this, FXScrollUI),
      Inherit(_this, XComponent),
      (_this.fragName = "WorkUI"),
      (_this.contexts = "GLUIElement,FXScrollUI"),
      (_this.params = _params),
      (_this.args = arguments),
      (this.isFragment = !0));
    var _promises = [];
    !(async function () {
      (_this.element && (_this.element.onMountedHook = (_) => _this.onMounted?.()),
        _this.initClass(FragUIHelper, {
          addTo: "GLUI.Stage",
          stickyY: 0,
          releaseY: 11.6,
          _type: "UI",
          refName: "ui",
          children: [{ _type: "ChatUI", refName: "unnamed", children: [] }],
        }),
        (_this.params = _params),
        (_this.args = arguments),
        _this.parent?.layers && (_this.layers = _this.parent.layers),
        _this.layout?.getAllLayers && (_this.layers = await _this.layout.getAllLayers()),
        (_this.ui.alpha = 0));
      Scroll.createUnlimited();
      (_this.startRender((_) => {
        let scrollProgress = _this.get("Work/scrollProgress");
        0 == (scrollProgress > 0.05 && scrollProgress < 0.92 ? 1 : 0)
          ? _this.ui.showing &&
            ((_this.ui.showing = !1), _this.ui.tween({ alpha: 0 }, 500, "easeOutSine"))
          : _this.ui.showing ||
            ((_this.ui.showing = !0), _this.ui.tween({ alpha: 1 }, 500, "easeOutSine"));
      }),
        (_this.onHover = (e) => console.log(e.action)),
        (_this.onClick = (_) => console.log("click")),
        _this.onResize(function updateLayout() {}));
      for (let key in _this)
        if (_this[key]?.then) {
          let store = _this[key];
          (store.then((val) => (_this[key] = val)), _promises.push(store));
        }
      (_promises.length && (await Promise.all(_promises)),
        (_promises = null),
        _this.flag?.("__ready", !0),
        _this.onInit?.());
    })();
  }),
  Class(function Main() {
    !(async function () {
      if ((await Device.system.detectXR(), Utils.query("performance")))
        return Performance.displayResults();
      !(function init() {
        window._PROJECT_NAME_ &&
          ((Dev.pathName = `/${window._PROJECT_NAME_}/HTML/`), (Dev.filesPath = Dev.pathName));
        if (((UnsupportedRedirect.requiresWebGL = !0), UnsupportedRedirect.unsupported()))
          return void window.location.replace(window._UNSUPPORTED_PAGE_);
        if ((GLUI.init(), window.location.search.includes("p=")))
          return AssetLoader.loadAssets(Assets.list().filter(["uil", "shaders"])).then(
            Playground.instance,
          );
        Container.instance();
      })();
    })();
  }));
window._MINIFIED_ = true;
window._BUILT_ = true;
