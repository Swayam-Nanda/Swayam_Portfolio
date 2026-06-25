function RNG(seed) {
  ((this.m = 2147483648),
    (this.a = 1103515245),
    (this.c = 12345),
    (this.state = seed || Math.floor(Math.random() * (this.m - 1))));
}
("undefined" == typeof console &&
  ((window.console = {}),
  (console.log =
    console.error =
    console.info =
    console.debug =
    console.warn =
    console.trace =
      function () {})),
  (window.performance =
    window.performance && window.performance.now ? window.performance : Date),
  (Date.now =
    Date.now ||
    function () {
      return +new Date();
    }),
  window.requestAnimationFrame ||
    (window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      (function () {
        const start = Date.now();
        return function (callback) {
          window.setTimeout(() => callback(Date.now() - start), 1e3 / 60);
        };
      })()),
  (window.defer = window.requestAnimationFrame),
  (window.clearTimeout = (function () {
    const _clearTimeout = window.clearTimeout;
    return function (ref) {
      return (window.Timer && Timer.__clearTimeout(ref)) || _clearTimeout(ref);
    };
  })()),
  (window.requestIdleCallback = (function () {
    const _requestIdleCallback = window.requestIdleCallback;
    return function (callback, max) {
      return _requestIdleCallback
        ? _requestIdleCallback(callback, max ? { timeout: max } : null)
        : defer(() => {
            callback({ didTimeout: !1 });
          }, 0);
    };
  })()),
  (window.onIdle = window.requestIdleCallback),
  "undefined" == typeof Float32Array && (Float32Array = Array),
  (Math.sign = function (x) {
    return 0 === (x = +x) || isNaN(x) ? Number(x) : x > 0 ? 1 : -1;
  }),
  (Math._round = Math.round),
  (Math.round = function (value, precision = 0) {
    let p = Math.pow(10, precision);
    return Math._round(value * p) / p;
  }),
  (Math._random = Math.random),
  (Math.rand = Math.random =
    function (min = 0, max = 1, precision = 0) {
      return 0 === arguments.length
        ? Math._random()
        : min === max
          ? min
          : 0 == precision
            ? Math.floor(Math._random() * (max + 1 - min) + min)
            : Math.round(min + Math._random() * (max - min), precision);
    }),
  (RNG.prototype.nextFloat = function () {
    return (
      (this.state = (this.a * this.state + this.c) % this.m),
      this.state / (this.m - 1)
    );
  }),
  (Math._randomSeed = new RNG(1337)),
  (Math.randomSeed = function (min = 0, max = 1, precision = 0) {
    return 0 === arguments.length
      ? Math._randomSeed.nextFloat()
      : min === max
        ? min
        : 0 == precision
          ? Math.floor(Math._randomSeed.nextFloat() * (max + 1 - min) + min)
          : Math.round(
              min + Math._randomSeed.nextFloat() * (max - min),
              precision,
            );
  }),
  (Math.degrees = function (radians) {
    return radians * (180 / Math.PI);
  }),
  (Math.radians = function (degrees) {
    return degrees * (Math.PI / 180);
  }),
  (Math.clamp = function (value, min = 0, max = 1) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
  }),
  (Math.map = Math.range =
    function (value, oldMin = -1, oldMax = 1, newMin = 0, newMax = 1, isClamp) {
      const newValue =
        ((value - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
      return isClamp
        ? Math.clamp(
            newValue,
            Math.min(newMin, newMax),
            Math.max(newMin, newMax),
          )
        : newValue;
    }),
  (Math.mix = function (a, b, alpha) {
    return a * (1 - alpha) + b * alpha;
  }),
  (Math.step = function (edge, value) {
    return value < edge ? 0 : 1;
  }),
  (Math.smoothStep = function (min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }),
  (Math.fract = function (value) {
    return value - Math.floor(value);
  }),
  (Math.lerp = function (target, value, alpha, calcHz = !0) {
    return (
      value +
      (target - value) *
        (alpha = calcHz
          ? Math.framerateNormalizeLerpAlpha(alpha)
          : Math.clamp(alpha))
    );
  }));
{
  const mainThread = !!window.document;
  Math.framerateNormalizeLerpAlpha = function (t) {
    return (
      (t = Math.clamp(t)),
      mainThread
        ? 1 - Math.exp(Math.log(1 - t) * Render.FRAME_HZ_MULTIPLIER)
        : t
    );
  };
}
((Math.mod = function (value, n) {
  return ((value % n) + n) % n;
}),
  Object.defineProperty(Array.prototype, "shuffle", {
    writable: !0,
    value: function () {
      let randomIndex,
        currentIndex = this.length;
      for (; 0 != currentIndex; )
        ((randomIndex = Math.floor(Math.random() * currentIndex)),
          currentIndex--,
          ([this[currentIndex], this[randomIndex]] = [
            this[randomIndex],
            this[currentIndex],
          ]));
      return this;
    },
  }),
  (Array.storeRandom = function (arr) {
    arr.randomStore = [];
  }),
  Object.defineProperty(Array.prototype, "random", {
    writable: !0,
    value: function (range) {
      let value = Math.random(0, this.length - 1);
      if (
        (arguments.length && !this.randomStore && Array.storeRandom(this),
        !this.randomStore)
      )
        return this[value];
      if ((range > this.length - 1 && (range = this.length), range > 1)) {
        for (; ~this.randomStore.indexOf(value); )
          (value += 1) > this.length - 1 && (value = 0);
        (this.randomStore.push(value),
          this.randomStore.length >= range && this.randomStore.shift());
      }
      return this[value];
    },
  }),
  Object.defineProperty(Array.prototype, "remove", {
    writable: !0,
    value: function (element) {
      if (!this.indexOf) return;
      const index = this.indexOf(element);
      return ~index ? this.splice(index, 1) : void 0;
    },
  }),
  Object.defineProperty(Array.prototype, "last", {
    writable: !0,
    value: function () {
      return this[this.length - 1];
    },
  }),
  (window.Promise = window.Promise || {}),
  Array.prototype.flat ||
    Object.defineProperty(Array.prototype, "flat", {
      configurable: !0,
      value: function flat() {
        var depth = isNaN(arguments[0]) ? 1 : Number(arguments[0]);
        return depth
          ? Array.prototype.reduce.call(
              this,
              function (acc, cur) {
                return (
                  Array.isArray(cur)
                    ? acc.push.apply(acc, flat.call(cur, depth - 1))
                    : acc.push(cur),
                  acc
                );
              },
              [],
            )
          : Array.prototype.slice.call(this);
      },
      writable: !0,
    }),
  (Promise.create = function () {
    const promise = new Promise((resolve, reject) => {
      ((this.temp_resolve = resolve), (this.temp_reject = reject));
    });
    return (
      (promise.resolve = this.temp_resolve),
      (promise.reject = this.temp_reject),
      delete this.temp_resolve,
      delete this.temp_reject,
      promise
    );
  }),
  (Promise.catchAll = function (array) {
    return Promise.all(
      array.map((promise) =>
        promise && "function" == typeof promise.catch
          ? promise.catch((error) => {
              Promise.reject(error);
            })
          : promise,
      ),
    );
  }),
  (Promise.timeout = function (promise, timeout) {
    Array.isArray(promise) && (promise = Promise.all(promise));
    var timeoutPromise = Promise.create(),
      ref = Timer.create(timeoutPromise.resolve, timeout);
    return Promise.race([promise, timeoutPromise]).finally(function () {
      Timer.__clearTimeout(ref);
    });
  }),
  (function () {
    function notRegExp(it) {
      if (
        (function isRegExp(it) {
          if (!("object" == typeof it ? null !== it : "function" == typeof it))
            return !1;
          var match = it["undefined" != typeof Symbol ? Symbol.match : "match"];
          return void 0 !== match
            ? !!match
            : "RegExp" === Object.prototype.toString.call(it).slice(8, -1);
        })(it)
      )
        throw new Error(
          "First argument to String.prototype.includes must not be a regular expression",
        );
      return it;
    }
    Object.defineProperty(String.prototype, "includes", {
      writable: !0,
      value: function (str) {
        if (!Array.isArray(str)) return !!~this.indexOf(notRegExp(str));
        for (let i = str.length - 1; i >= 0; i--)
          if (~this.indexOf(notRegExp(str[i]))) return !0;
        return !1;
      },
    });
  })(),
  Object.defineProperty(String.prototype, "equals", {
    writable: !0,
    value: function (str) {
      let compare = String(this);
      if (!Array.isArray(str)) return str === compare;
      for (let i = str.length - 1; i >= 0; i--)
        if (str[i] === compare) return !0;
      return !1;
    },
  }),
  Object.defineProperty(String.prototype, "strpos", {
    writable: !0,
    value: function (str) {
      return (
        console.warn("strpos deprecated: use .includes()"),
        this.includes(str)
      );
    },
  }),
  Object.defineProperty(String.prototype, "clip", {
    writable: !0,
    value: function (num, end = "") {
      return this.length > num
        ? this.slice(0, Math.max(0, num - end.length)).trim() + end
        : this.slice();
    },
  }),
  Object.defineProperty(String.prototype, "capitalize", {
    writable: !0,
    value: function () {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
  }),
  Object.defineProperty(String.prototype, "replaceAll", {
    writable: !0,
    value: function (find, replace) {
      return this.split(find).join(replace);
    },
  }),
  Object.defineProperty(String.prototype, "replaceAt", {
    writable: !0,
    value: function (index, replacement) {
      return (
        this.substr(0, index) +
        replacement +
        this.substr(index + replacement.length)
      );
    },
  }),
  (!window.fetch || (!window.AURA && location.protocol.includes("file"))) &&
    (window.fetch = function (url, options) {
      options = options || {};
      const promise = Promise.create(),
        request = new XMLHttpRequest();
      (request.open(options.method || "get", url),
        url.includes(".ktx") && (request.responseType = "arraybuffer"));
      for (let i in options.headers)
        request.setRequestHeader(i, options.headers[i]);
      function response() {
        let header,
          keys = [],
          all = [],
          headers = {};
        return (
          request
            .getAllResponseHeaders()
            .replace(/^(.*?):\s*([\s\S]*?)$/gm, (m, key, value) => {
              (keys.push((key = key.toLowerCase())),
                all.push([key, value]),
                (header = headers[key]),
                (headers[key] = header ? `${header},${value}` : value));
            }),
          {
            ok: 1 == ((request.status / 200) | 0),
            status: request.status,
            statusText: request.statusText,
            url: request.responseURL,
            clone: response,
            text: () => Promise.resolve(request.responseText),
            json: () => Promise.resolve(request.responseText).then(JSON.parse),
            xml: () => Promise.resolve(request.responseXML),
            blob: () => Promise.resolve(new Blob([request.response])),
            arrayBuffer: () => Promise.resolve(request.response),
            headers: {
              keys: () => keys,
              entries: () => all,
              get: (n) => headers[n.toLowerCase()],
              has: (n) => n.toLowerCase() in headers,
            },
          }
        );
      }
      return (
        (request.onload = () => {
          promise.resolve(response());
        }),
        (request.onerror = promise.reject),
        request.send(options.body),
        promise
      );
    }),
  (window.get = function (url, options = { credentials: "same-origin" }) {
    let promise = Promise.create();
    return (
      (options.method = "GET"),
      fetch(url, options)
        .then(function handleResponse(e) {
          if (!e.ok) return promise.reject(e);
          e.text().then((text) => {
            if (text.charAt(0).includes(["[", "{"]))
              try {
                promise.resolve(JSON.parse(text));
              } catch (err) {
                promise.resolve(text);
              }
            else promise.resolve(text);
          });
        })
        .catch(promise.reject),
      promise
    );
  }),
  (window.post = function (url, body = {}, options = {}) {
    let promise = Promise.create();
    return (
      (options.method = "POST"),
      body &&
        (options.body =
          "object" == typeof body || Array.isArray(body)
            ? JSON.stringify(body)
            : body),
      options.headers ||
        (options.headers = { "content-type": "application/json" }),
      fetch(url, options)
        .then(function handleResponse(e) {
          if (!e.ok) return promise.reject(e);
          e.text().then((text) => {
            if (text.charAt(0).includes("[") || text.charAt(0).includes("{"))
              try {
                promise.resolve(JSON.parse(text));
              } catch (err) {
                promise.resolve(text);
              }
            else promise.resolve(text);
          });
        })
        .catch(promise.reject),
      promise
    );
  }),
  (window.put = function (url, body, options = {}) {
    let promise = Promise.create();
    return (
      (options.method = "PUT"),
      body &&
        (options.body =
          "object" == typeof body || Array.isArray(body)
            ? JSON.stringify(body)
            : body),
      fetch(url, options)
        .then(function handleResponse(e) {
          if (!e.ok) return promise.reject(e);
          e.text().then((text) => {
            if (text.charAt(0).includes(["[", "{"]))
              try {
                promise.resolve(JSON.parse(text));
              } catch (err) {
                promise.resolve(text);
              }
            else promise.resolve(text);
          });
        })
        .catch(promise.reject),
      promise
    );
  }),
  "undefined" == typeof WeakRef &&
    (function () {
      var targetProp =
        "undefined" != typeof Symbol
          ? Symbol("WeakRefTarget")
          : "@@WeakRefTarget";
      function WeakRef(target) {
        this[targetProp] = target;
      }
      ((WeakRef.prototype.deref = function () {
        return this[targetProp];
      }),
        (window.WeakRef = WeakRef));
    })(),
  (window.Class = function (_class, _type, _static) {
    const _this = this || window,
      _name = _class.name || _class.toString().match(/function ?([^\(]+)/)[1];
    ("function" == typeof _type && ((_static = _type), (_type = null)),
      (_type = (_type || "").toLowerCase())
        ? "static" == _type
          ? (_this[_name] = new _class())
          : "singleton" == _type &&
            ((_this[_name] = _class),
            (function () {
              let _instance;
              _this[_name].instance = function () {
                return (
                  _instance || (_instance = new _class(...arguments)),
                  _instance
                );
              };
            })(),
            _static && _static())
        : ((_this[_name] = _class), _static && _static()),
      this && this !== window && (this[_name]._namespace = this.__namespace));
  }),
  (window.Inherit = function (child, parent) {
    const args = [].slice.call(arguments, 2);
    parent.apply(child, args);
    const save = {};
    for (let method in child) save[method] = child[method];
    const addSuperMethods = () => {
      for (let method in save)
        if (child[method] && child[method] !== save[method]) {
          if ("destroy" == method && !child.__element)
            throw (
              "Do not override destroy directly, use onDestroy :: " +
              child.constructor.toString()
            );
          let name = method;
          do {
            name = `_${name}`;
          } while (child[name]);
          child[name] = save[method];
        }
    };
    child.__afterInitClass
      ? child.__afterInitClass.push(addSuperMethods)
      : defer(addSuperMethods);
  }),
  (window.Namespace = function (obj) {
    "string" == typeof obj
      ? window[obj] || (window[obj] = { Class: Class, __namespace: obj })
      : ((obj.Class = Class),
        (obj.__namespace =
          obj.constructor.name ||
          obj.constructor.toString().match(/function ([^\(]+)/)[1]));
  }),
  (window.Global = {}),
  (window.THREAD = !1),
  Class(function Hydra() {
    const _this = this,
      _readyPromise = Promise.create();
    var _base,
      _callbacks = [];
    function initLoad() {
      return document && window
        ? window._NODE_
          ? setTimeout(loaded, 1)
          : window._AURA_
            ? window.Main
              ? setTimeout(loaded, 1)
              : setTimeout(initLoad, 1)
            : void ("complete" === document.readyState
                ? setTimeout(loaded, 1)
                : window.addEventListener("load", loaded, !1))
        : setTimeout(initLoad, 1);
    }
    function loaded() {
      if (
        (window.removeEventListener("load", loaded, !1),
        window._HYDRA_BEFORE_READY)
      ) {
        let promise = window._HYDRA_BEFORE_READY;
        return (delete window._HYDRA_BEFORE_READY, promise.then(loaded));
      }
      ((_this.LOCAL =
        (!window._BUILT_ ||
          location.pathname.toLowerCase().includes("platform")) &&
        (location.hostname.indexOf("local") > -1 ||
          "10" == location.hostname.split(".")[0] ||
          "192" == location.hostname.split(".")[0] ||
          /atdev.online$/.test(location.hostname)) &&
        ("" == location.port || "3000" === location.port)),
        _callbacks.forEach((cb) => cb()),
        (_callbacks = null),
        _readyPromise.resolve(),
        window.Main &&
          _readyPromise.then(() => (Hydra.Main = new window.Main())));
    }
    ((this.HASH = window.location.hash.slice(1)),
      (this.LOCAL =
        !window._BUILT_ &&
        (location.hostname.indexOf("local") > -1 ||
          "10" == location.hostname.split(".")[0] ||
          "192" == location.hostname.split(".")[0] ||
          /atdev.online$/.test(location.hostname)) &&
        ("" == location.port || "3000" === location.port)),
      initLoad(),
      (this.__triggerReady = function () {
        _callbacks || loaded();
      }),
      (this.ready = function (callback) {
        if (!callback) return _readyPromise;
        _callbacks ? _callbacks.push(callback) : callback();
      }),
      (this.absolutePath = function (path) {
        if (window.AURA) return path;
        let base = window.HYDRA_BASE_PATH ?? _base;
        if (void 0 === base)
          try {
            if (document.getElementsByTagName("base").length > 0) {
              var a = document.createElement("a");
              ((a.href = document.getElementsByTagName("base")[0].href),
                (base = a.pathname),
                (_base = base));
            }
          } catch (e) {
            _base = null;
          }
        let pathname = base ?? location.pathname;
        pathname.includes("/index.html") &&
          (pathname = pathname.replace("/index.html", ""));
        let port = Number(location.port) > 1e3 ? `:${location.port}` : "";
        return path.includes("http")
          ? path
          : (location.protocol.length ? location.protocol + "//" : "") +
              (location.hostname + port + pathname + "/" + path).replace(
                "//",
                "/",
              );
      }));
  }, "Static"),
  Class(function Utils() {
    var _queries = {},
      _searchParams = new URLSearchParams(window.location.search);
    ((this.query = this.queryParams =
      function (key, value) {
        if (
          (void 0 !== value && (_queries[key] = value),
          void 0 !== _queries[key])
        )
          return _queries[key];
        if (_searchParams)
          "0" === (value = _searchParams.get(key))
            ? (value = 0)
            : "false" === value || null === value
              ? (value = !1)
              : "" === value && (value = !0);
        else {
          let escapedKey = encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&");
          "0" ==
          (value = decodeURIComponent(
            window.location.search.replace(
              new RegExp(`^(?:.*?[&?]${escapedKey}(?:=([^&]*)|[&$]))?.*$`, "i"),
              "$1",
            ),
          ))
            ? (value = 0)
            : "false" == value
              ? (value = !1)
              : value.length ||
                (value = new RegExp(`[&?]${escapedKey}(?:[&=]|$)`, "i").test(
                  window.location.search,
                ));
        }
        return ((_queries[key] = value), value);
      }),
      (this.addQuery = function (query, value) {
        if (_queries[query] === value) return _queries[query];
        let url = new URL(location.href);
        return (
          url.searchParams.set(query, value),
          (_searchParams = url.searchParams),
          window.history.replaceState({}, document.title, url.toString()),
          (_queries[query] = value)
        );
      }),
      (this.removeQuery = function (query) {
        let url = new URL(location.href);
        return (
          url.searchParams.delete(query),
          (_searchParams = url.searchParams),
          window.history.replaceState({}, document.title, url.toString()),
          delete _queries[query]
        );
      }),
      (this.addQueryToPath = function (path, hash) {
        return [
          [path, _searchParams.toString()].filter(Boolean).join("?"),
          hash,
        ]
          .filter(Boolean)
          .join("#");
      }),
      (this.addParam = function (url, param, value) {
        let index = url.indexOf("?"),
          prefix = url.substring(0, index + 1),
          suffix = url.substring(index + 1),
          searchParams = new URLSearchParams(suffix);
        return (
          searchParams.append(param, value),
          prefix + searchParams.toString()
        );
      }),
      (this.removeParam = function (url, param) {
        let index = url.indexOf("?"),
          prefix = url.substring(0, index + 1),
          suffix = url.substring(index + 1),
          searchParams = new URLSearchParams(suffix);
        return (searchParams.delete(param), prefix + searchParams.toString());
      }),
      (this.getConstructorName = function (obj) {
        return obj
          ? (obj.___constructorName ||
              (obj.___constructorName =
                "function" == typeof obj
                  ? obj.toString().match(/function ([^\(]+)/)?.[1]
                  : obj.constructor.name ||
                    obj.constructor.toString().match(/function ([^\(]+)/)?.[1]),
            obj.___constructorName)
          : obj;
      }),
      (this.nullObject = function (object) {
        if (object && (object.destroy || object.div))
          for (var key in object)
            ("boolean" == typeof object[key] && "deleted" === key) ||
              (void 0 !== object[key] && (object[key] = null));
        return null;
      }),
      (this.cloneObject = function (obj) {
        return JSON.parse(JSON.stringify(obj));
      }),
      (this.headsTails = function (n0, n1) {
        return Math.random(0, 1) ? n1 : n0;
      }),
      (this.mergeObject = function () {
        for (var obj = {}, i = 0; i < arguments.length; i++) {
          var o = arguments[i];
          for (var key in o) obj[key] = o[key];
        }
        return obj;
      }),
      (this.timestamp = this.uuid =
        function () {
          return (
            Date.now() +
            "xx-4xx-yxx-xxx".replace(/[xy]/g, function (c) {
              let r = (16 * Math.random()) | 0;
              return ("x" == c ? r : (3 & r) | 8).toString(16);
            })
          );
        }),
      (this.randomColor = function () {
        var color = "#" + Math.floor(16777215 * Math.random()).toString(16);
        return (color.length < 7 && (color = this.randomColor()), color);
      }),
      (this.numberWithCommas = function (num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }),
      (this.padInt = function (num, digits, isLimit) {
        isLimit && (num = Math.min(num, Math.pow(10, digits) - 1));
        let str = Math.floor(num).toString();
        return (
          Math.pow(10, Math.max(0, digits - str.length))
            .toString()
            .slice(1) + str
        );
      }),
      (this.copyToClipboard = function (string) {
        try {
          var el = document.createElement("textarea"),
            range = document.createRange();
          ((el.contentEditable = !0),
            (el.readOnly = !0),
            (el.value = string),
            document.body.appendChild(el),
            el.select(),
            range.selectNodeContents(el));
          var s = window.getSelection();
          return (
            s.removeAllRanges(),
            s.addRange(range),
            el.setSelectionRange(0, string.length),
            document.execCommand("copy"),
            document.body.removeChild(el),
            !0
          );
        } catch (e) {
          return !1;
        }
      }),
      (this.stringList = function (items = [], limit = 0, options = {}) {
        if (0 === items.length) return "";
        let output = "",
          printed = 0;
        ("object" == typeof limit && ((options = limit), (limit = 0)),
          (options.oxford = !0 === options.oxford),
          (options.more =
            !1 !== options.more && (options.more ? options.more : "more")),
          (options.and = options.and ? options.and : "&"),
          (options.comma = options.comma ? options.comma : ","),
          isNaN(options.limit) || (limit = options.limit),
          0 === limit && (limit = items.length));
        do {
          ((output = `${output}${items.shift()}${options.comma} `), printed++);
        } while (items.length > 1 && printed + 1 < limit);
        if (
          ((output = output.trim()),
          (output = output.slice(0, output.length - 1)),
          1 === items.length)
        )
          output = `${output}${options.oxford && printed > 1 ? options.comma : ""} ${options.and} ${items.shift()}`;
        else if (items.length > 1 && options.more) {
          let more = `${items.length} ${options.more}`;
          output = `${output}${options.oxford && printed > 1 ? options.comma : ""} ${options.and} ${more}`;
        }
        return output;
      }),
      (this.debounce = function (callback, time = 100, data) {
        (clearTimeout(callback.__interval),
          (callback.__interval = Timer.create((_) => callback(data), time)));
      }));
  }, "Static"),
  Class(function Render() {
    const _this = this,
      _render = [],
      _native = [],
      _drawFrame = [],
      _multipliers = [];
    let _renderIndex = null,
      _nativeIndex = null;
    var _last = performance.now(),
      _localTSL = 0,
      _elapsed = 0,
      _capLast = 0,
      _sampleRefreshRate = [],
      _firstSample = !1,
      _saveRefreshRate = 60,
      rAF = requestAnimationFrame,
      _refreshScale = 1,
      _canCap = 0,
      _screenHash = getScreenHash();
    function render(tsl) {
      if (_last >= tsl) return void (THREAD || _this.isPaused || rAF(render));
      if (_native.length) {
        let multiplier = 60 / _saveRefreshRate;
        for (
          _nativeIndex = _native.length - 1;
          _nativeIndex > -1;
          _nativeIndex--
        ) {
          let callback = _native[_nativeIndex];
          try {
            callback(multiplier);
          } catch (error) {
            handleRenderCallbackError(callback, error);
          }
        }
        _nativeIndex = null;
      }
      if (_this.capFPS > 0 && ++_canCap > 31) {
        let delta = tsl - _capLast;
        if (((_capLast = tsl), (_elapsed += delta) < 1e3 / _this.capFPS))
          return void (THREAD || _this.isPaused || rAF(render));
        ((_this.REFRESH_RATE = _this.capFPS),
          (_this.HZ_MULTIPLIER = (60 / _this.REFRESH_RATE) * _refreshScale),
          (_elapsed = 0));
      }
      if (((_this.timeScaleUniform.value = 1), _multipliers.length))
        for (let i = 0; i < _multipliers.length; i++) {
          let obj = _multipliers[i];
          _this.timeScaleUniform.value *= obj.value;
        }
      ((_this.DT = tsl - _last), (_last = tsl));
      let delta = _this.DT * _this.timeScaleUniform.value;
      if (
        ((delta = Math.min(200, delta)), _sampleRefreshRate && !_this.capFPS)
      ) {
        let fps = 1e3 / _this.DT;
        if ((_sampleRefreshRate.push(fps), _sampleRefreshRate.length > 30)) {
          _sampleRefreshRate.sort((a, b) => a - b);
          let rate =
            _sampleRefreshRate[Math.round(_sampleRefreshRate.length / 2)];
          ((rate = _this.REFRESH_TABLE.reduce((prev, curr) =>
            Math.abs(curr - rate) < Math.abs(prev - rate) ? curr : prev,
          )),
            (_this.REFRESH_RATE = _saveRefreshRate =
              _firstSample ? Math.max(_this.REFRESH_RATE, rate) : rate),
            (_this.HZ_MULTIPLIER = (60 / _this.REFRESH_RATE) * _refreshScale),
            (_sampleRefreshRate = null),
            (_firstSample = !0));
        }
      }
      for (
        _this.TIME = tsl,
          _this.DELTA = delta,
          _this.startFrame && _this.startFrame(tsl, delta),
          _localTSL += delta,
          _renderIndex = _render.length - 1;
        _renderIndex >= 0;
        _renderIndex--
      ) {
        var callback = _render[_renderIndex];
        if (callback)
          try {
            if (callback.fps) {
              if (tsl - callback.last < 1e3 / callback.fps) continue;
              (callback(++callback.frame), (callback.last = tsl));
              continue;
            }
            callback(tsl, delta);
          } catch (error) {
            handleRenderCallbackError(callback, error);
          }
        else _render.splice(_renderIndex, 1);
      }
      _renderIndex = null;
      for (let i = _drawFrame.length - 1; i > -1; i--)
        _drawFrame[i](tsl, delta);
      (_this.drawFrame && _this.drawFrame(tsl, delta),
        _this.endFrame && _this.endFrame(tsl, delta),
        THREAD || _this.isPaused || rAF(render));
    }
    function handleRenderCallbackError(callback, error) {
      if (Hydra.LOCAL) throw error;
      let evt = { callback: callback, error: error, preventStopRender: !1 };
      (Events.emitter._fireEvent(_this.RENDER_CALLBACK_ERROR, evt),
        evt.preventStopRender || _this.stop(callback));
    }
    function getScreenHash() {
      return window.screen
        ? `${window.screen.width}x${window.screen.height}.${window.screen.pixelDepth}`
        : "none";
    }
    function checkMoveScreen() {
      var newScreen = getScreenHash();
      _screenHash !== newScreen &&
        ((_screenHash = newScreen),
        (_sampleRefreshRate = null),
        (_firstSample = !1));
    }
    ((this.timeScaleUniform = { value: 1, type: "f", ignoreUIL: !0 }),
      (this.REFRESH_TABLE = [30, 60, 72, 90, 100, 120, 144, 240]),
      (this.REFRESH_RATE = 60),
      (this.HZ_MULTIPLIER = 1),
      (this.RENDER_CALLBACK_ERROR = "render_callback_error"),
      (this.capFPS = null),
      THREAD ||
        (rAF(render),
        setInterval((_) => (_sampleRefreshRate = []), 3e3),
        setInterval(checkMoveScreen, 5e3)),
      (this.now = function () {
        return _localTSL;
      }),
      (this.setRefreshScale = function (scale) {
        ((_refreshScale = scale), (_sampleRefreshRate = []));
      }),
      (this.start = function (callback, fps, native) {
        (fps &&
          ((callback.fps = fps),
          (callback.last = -1 / 0),
          (callback.frame = -1)),
          native
            ? ~_native.indexOf(callback) ||
              (_native.unshift(callback),
              null !== _nativeIndex && (_nativeIndex += 1))
            : ~_render.indexOf(callback) ||
              (_render.unshift(callback),
              null !== _renderIndex && (_renderIndex += 1)));
      }),
      (this.stop = function (callback) {
        let i = _render.indexOf(callback);
        (i >= 0 &&
          (_render.splice(i, 1),
          null !== _renderIndex && i < _renderIndex && (_renderIndex -= 1)),
          (i = _native.indexOf(callback)),
          i >= 0 &&
            (_native.splice(i, 1),
            null !== _nativeIndex && i < _nativeIndex && (_nativeIndex -= 1)));
      }),
      (this.tick = function () {
        THREAD && ((this.TIME = performance.now()), render(this.TIME));
      }),
      (this.forceRender = function (time) {
        ((this.TIME = time), render(this.TIME));
      }),
      (this.Worker = function (_callback, _budget = 4) {
        Inherit(this, Component);
        let _scope = this,
          _elapsed = 0;
        function loop() {
          if (!_scope.dead) {
            for (; _elapsed < _budget; ) {
              if (_scope.dead || _scope.paused) return;
              const start = performance.now();
              (_callback && _callback(),
                (_elapsed += performance.now() - start));
            }
            _elapsed = 0;
          }
        }
        (this.startRender(loop),
          (this.stop = function () {
            ((this.dead = !0), this.stopRender(loop));
          }),
          (this.pause = function () {
            ((this.paused = !0), this.stopRender(loop));
          }),
          (this.resume = function () {
            ((this.paused = !1), this.startRender(loop));
          }),
          (this.setCallback = function (cb) {
            _callback = cb;
          }));
      }),
      (this.pause = function () {
        _this.isPaused = !0;
      }),
      (this.resume = function () {
        _this.isPaused && ((_this.isPaused = !1), rAF(render));
      }),
      (this.useRAF = function (raf) {
        ((_firstSample = null),
          (_last = performance.now()),
          (rAF = raf)(render));
      }),
      (this.onDrawFrame = function (cb) {
        _drawFrame.push(cb);
      }),
      (this.setTimeScale = function (v) {
        _this.timeScaleUniform.value = v;
      }),
      (this.getTimeScale = function () {
        return _this.timeScaleUniform.value;
      }),
      (this.createTimeMultiplier = function () {
        let obj = { value: 1 };
        return (_multipliers.push(obj), obj);
      }),
      (this.destroyTimeMultiplier = function (obj) {
        _multipliers.remove(obj);
      }),
      (this.tweenTimeScale = function (value, time, ease, delay) {
        return tween(
          _this.timeScaleUniform,
          { value: value },
          time,
          ease,
          delay,
          null,
          null,
          !0,
        );
      }),
      Object.defineProperty(_this, "FRAME_HZ_MULTIPLIER", {
        get: () => (60 / (1e3 / _this.DELTA)) * _refreshScale,
        enumerable: !0,
      }));
  }, "Static"),
  Class(function Timer() {
    const _this = this,
      _callbacks = [],
      _discard = [],
      _deferA = [],
      _deferB = [];
    var _defer = _deferA,
      _deferNextTicks = [];
    function loop(t, delta) {
      for (let i = _discard.length - 1; i >= 0; i--) {
        let obj = _discard[i];
        ((obj.callback = null), _callbacks.remove(obj));
      }
      _discard.length && (_discard.length = 0);
      for (let i = _callbacks.length - 1; i >= 0; i--) {
        let obj = _callbacks[i];
        obj
          ? (obj.scaledTime
              ? (obj.current += delta)
              : (obj.current += Render.DT),
            obj.current >= obj.time &&
              (obj.callback && obj.callback(), _discard.push(obj)))
          : _callbacks.remove(obj);
      }
      for (let i = _defer.length - 1; i > -1; i--) _defer[i]();
      ((_defer.length = 0), (_defer = _defer == _deferA ? _deferB : _deferA));
    }
    function handleDeferNextTick(e) {
      if (
        null != e &&
        e.source === window &&
        "_hydraDeferNextTick" === e.data &&
        (e.stopPropagation(), _deferNextTicks.length > 0)
      ) {
        _deferNextTicks.shift()();
      }
    }
    (Render.start(loop),
      window.addEventListener("message", handleDeferNextTick, !0),
      (this.__clearTimeout = function (ref) {
        const obj = (function find(ref) {
          for (let i = _callbacks.length - 1; i > -1; i--)
            if (_callbacks[i].ref == ref) return _callbacks[i];
        })(ref);
        return !!obj && ((obj.callback = null), _callbacks.remove(obj), !0);
      }),
      (this.create = function (callback, time, scaledTime) {
        if (window._NODE_) return setTimeout(callback, time);
        const obj = {
          time: Math.max(1, time || 1),
          current: 0,
          ref: Utils.timestamp(),
          callback: callback,
          scaledTime: scaledTime,
        };
        return (_callbacks.unshift(obj), obj.ref);
      }),
      (this.delayedCall = function (time) {
        let promise = Promise.create();
        return (_this.create(promise.resolve, time), promise);
      }),
      (window.defer = this.defer =
        function (callback) {
          let promise;
          return (
            callback ||
              ((promise = Promise.create()), (callback = promise.resolve)),
            (_defer == _deferA ? _deferB : _deferA).unshift(callback),
            promise
          );
        }),
      (window.deferNextTick = this.deferNextTick =
        function (callback) {
          let promise;
          return (
            callback ||
              ((promise = Promise.create()), (callback = promise.resolve)),
            _deferNextTicks.push(callback),
            (callback.time = performance.now()),
            window.postMessage("_hydraDeferNextTick", "*"),
            promise
          );
        }));
  }, "static"),
  Class(
    function Events() {
      const _this = this;
      this.events = {};
      const _e = {},
        _linked = [];
      let _emitter;
      ((this.events.sub = function (obj, evt, callback) {
        if (
          ("object" != typeof obj &&
            ((callback = evt), (evt = obj), (obj = null)),
          !obj)
        )
          return (
            Events.emitter._addEvent(
              evt,
              callback.resolve ? callback.resolve : callback,
              this,
            ),
            callback
          );
        let emitter = obj.events.emitter();
        return (
          emitter._addEvent(
            evt,
            callback.resolve ? callback.resolve : callback,
            this,
          ),
          emitter._saveLink(this),
          _linked.push(emitter),
          callback
        );
      }),
        (this.events.wait = async function (obj, evt) {
          const promise = Promise.create(),
            args = [
              obj,
              evt,
              (e) => {
                (_this.events.unsub(...args), promise.resolve(e));
              },
            ];
          return (
            "object" != typeof obj && args.splice(1, 1),
            _this.events.sub(...args),
            promise
          );
        }),
        (this.events.unsub = function (obj, evt, callback) {
          if (
            ("object" != typeof obj &&
              ((callback = evt), (evt = obj), (obj = null)),
            !obj)
          )
            return Events.emitter._removeEvent(
              evt,
              callback.resolve ? callback.resolve : callback,
            );
          obj.events
            .emitter()
            ._removeEvent(evt, callback.resolve ? callback.resolve : callback);
        }),
        (this.events.fire = function (evt, obj, isLocalOnly) {
          (((obj = obj || _e).target = this),
            Events.emitter._check(evt),
            (_emitter && _emitter._fireEvent(evt, obj)) ||
              isLocalOnly ||
              Events.emitter._fireEvent(evt, obj));
        }),
        (this.events.bubble = function (obj, evt) {
          _this.events.sub(obj, evt, (e) => _this.events.fire(evt, e));
        }),
        (this.events.destroy = function () {
          return (
            Events.emitter._destroyEvents(this),
            _linked &&
              _linked.forEach((emitter) => emitter._destroyEvents(this)),
            _emitter &&
              _emitter.links &&
              _emitter.links.forEach(
                (obj) => obj.events && obj.events._unlink(_emitter),
              ),
            null
          );
        }),
        (this.events.emitter = function () {
          return (
            _emitter || (_emitter = Events.emitter.createLocalEmitter()),
            _emitter
          );
        }),
        (this.events._unlink = function (emitter) {
          _linked.remove(emitter);
        }));
    },
    () => {
      ((Events.emitter = new (function Emitter() {
        const prototype = Emitter.prototype;
        if (((this.events = []), void 0 !== prototype._check)) return;
        ((prototype._check = function (evt) {
          if (void 0 === evt) throw "Undefined event";
        }),
          (prototype._addEvent = function (evt, callback, object) {
            (this._check(evt),
              this.events.push({
                evt: evt,
                object: object,
                callback: callback,
              }));
          }),
          (prototype._removeEvent = function (eventString, callback) {
            this._check(eventString);
            for (let i = this.events.length - 1; i >= 0; i--)
              this.events[i].evt === eventString &&
                this.events[i].callback === callback &&
                this._markForDeletion(i);
          }),
          (prototype._sweepEvents = function () {
            for (let i = 0; i < this.events.length; i++)
              this.events[i].markedForDeletion &&
                (delete this.events[i].markedForDeletion,
                this.events.splice(i, 1),
                --i);
          }),
          (prototype._markForDeletion = function (i) {
            ((this.events[i].markedForDeletion = !0),
              this._sweepScheduled ||
                ((this._sweepScheduled = !0),
                defer(() => {
                  ((this._sweepScheduled = !1), this._sweepEvents());
                })));
          }),
          (prototype._fireEvent = function (eventString, obj) {
            (this._check && this._check(eventString), (obj = obj || _e));
            let called = !1;
            for (let i = 0; i < this.events.length; i++) {
              let evt = this.events[i];
              evt.evt != eventString ||
                evt.markedForDeletion ||
                (evt.callback(obj), (called = !0));
            }
            return called;
          }),
          (prototype._destroyEvents = function (object) {
            for (var i = this.events.length - 1; i >= 0; i--)
              this.events[i].object === object && this._markForDeletion(i);
          }),
          (prototype._saveLink = function (obj) {
            (this.links || (this.links = []),
              ~this.links.indexOf(obj) || this.links.push(obj));
          }),
          (prototype.createLocalEmitter = function () {
            return new Emitter();
          }));
      })()),
        (Events.broadcast = Events.emitter._fireEvent),
        (Events.VISIBILITY = "hydra_visibility"),
        (Events.HASH_UPDATE = "hydra_hash_update"),
        (Events.COMPLETE = "hydra_complete"),
        (Events.PROGRESS = "hydra_progress"),
        (Events.CONNECTIVITY = "hydra_connectivity"),
        (Events.UPDATE = "hydra_update"),
        (Events.LOADED = "hydra_loaded"),
        (Events.END = "hydra_end"),
        (Events.FAIL = "hydra_fail"),
        (Events.SELECT = "hydra_select"),
        (Events.ERROR = "hydra_error"),
        (Events.READY = "hydra_ready"),
        (Events.RESIZE = "hydra_resize"),
        (Events.CLICK = "hydra_click"),
        (Events.HOVER = "hydra_hover"),
        (Events.MESSAGE = "hydra_message"),
        (Events.ORIENTATION = "orientation"),
        (Events.BACKGROUND = "background"),
        (Events.BACK = "hydra_back"),
        (Events.PREVIOUS = "hydra_previous"),
        (Events.NEXT = "hydra_next"),
        (Events.RELOAD = "hydra_reload"),
        (Events.UNLOAD = "hydra_unload"),
        (Events.FULLSCREEN = "hydra_fullscreen"),
        (Events.WEBGL_CONTEXT_LOSS = "hydra_webgl_context_loss"));
      const _e = {};
      Hydra.ready(() => {
        let box;
        (!(function () {
          let _last,
            _lastTime = performance.now();
          function onfocus() {
            ((Render.blurTime = -1),
              "focus" != _last &&
                Events.emitter._fireEvent(Events.VISIBILITY, { type: "focus" }),
              (_last = "focus"));
          }
          function onblur() {
            ((Render.blurTime = Date.now()),
              "blur" != _last &&
                Events.emitter._fireEvent(Events.VISIBILITY, { type: "blur" }),
              (_last = "blur"));
          }
          (Timer.create(function addVisibilityHandler() {
            let hidden, eventName;
            if (
              ([
                ["msHidden", "msvisibilitychange"],
                ["webkitHidden", "webkitvisibilitychange"],
                ["hidden", "visibilitychange"],
              ].forEach((d) => {
                void 0 !== document[d[0]] &&
                  ((hidden = d[0]), (eventName = d[1]));
              }),
              !eventName)
            ) {
              const root = "ie" == Device.browser ? document : window;
              return ((root.onfocus = onfocus), void (root.onblur = onblur));
            }
            document.addEventListener(eventName, () => {
              const time = performance.now();
              (time - _lastTime > 10 &&
                (!1 === document[hidden] ? onfocus() : onblur()),
                (_lastTime = time));
            });
          }, 250),
            window.addEventListener("online", (_) =>
              Events.emitter._fireEvent(Events.CONNECTIVITY, { online: !0 }),
            ),
            window.addEventListener("offline", (_) =>
              Events.emitter._fireEvent(Events.CONNECTIVITY, { online: !1 }),
            ),
            (window.onbeforeunload = (_) => (
              Events.emitter._fireEvent(Events.UNLOAD),
              null
            )));
        })(),
          (window.Stage = window.Stage || {}),
          "social" == Device.system.browser &&
            "ios" == Device.system.os &&
            ((box = document.createElement("div")),
            (box.style.position = "fixed"),
            (box.style.top =
              box.style.left =
              box.style.right =
              box.style.bottom =
                "0px"),
            (box.style.zIndex = "-1"),
            (box.style.opacity = "0"),
            (box.style.pointerEvents = "none"),
            document.body.appendChild(box)),
          updateStage());
        let timer,
          iosResize = "ios" === Device.system.os,
          html = !!iosResize && document.querySelector("html"),
          delay = iosResize ? 500 : 16;
        function updateStage() {
          if (box) {
            let bbox = box.getBoundingClientRect();
            ((Stage.width =
              bbox.width ||
              window.innerWidth ||
              document.body.clientWidth ||
              document.documentElement.offsetWidth),
              (Stage.height =
                bbox.height ||
                window.innerHeight ||
                document.body.clientHeight ||
                document.documentElement.offsetHeight),
              (document.body.parentElement.scrollTop = document.body.scrollTop =
                0),
              (document.documentElement.style.width =
                document.body.style.width =
                  `${Stage.width}px`),
              (document.documentElement.style.height =
                document.body.style.height =
                  `${Stage.height}px`),
              Events.emitter._fireEvent(Events.RESIZE));
          } else
            ((Stage.width =
              window.innerWidth ||
              document.body.clientWidth ||
              document.documentElement.offsetWidth),
              (Stage.height =
                (Stage.isNormalMobileScroll && Stage.div.offsetHeight) ||
                window.innerHeight ||
                document.body.clientHeight ||
                document.documentElement.offsetHeight));
        }
        (window.addEventListener("resize", function handleResize() {
          (clearTimeout(timer),
            (timer = setTimeout((_) => {
              (updateStage(),
                html &&
                  Math.min(window.screen.width, window.screen.height) !==
                    Stage.height &&
                  !Mobile.isAllowNativeScroll &&
                  (html.scrollTop = -1),
                Events.emitter._fireEvent(Events.RESIZE));
            }, delay)));
        }),
          (window.onorientationchange = window.onresize),
          "social" == Device.system.browser &&
            (Stage.height >= screen.height || Stage.width >= screen.width) &&
            setTimeout(updateStage, 1e3),
          defer(window.onresize));
      });
    },
  ),
  Class(function Device() {
    var vid,
      _this = this;
    ((this.agent = navigator.userAgent.toLowerCase()),
      (this.detect = function (match) {
        return this.agent.includes(match);
      }),
      (this.touchCapable = !!navigator.maxTouchPoints),
      (this.pixelRatio = window.devicePixelRatio),
      (this.system = {}),
      (this.system.retina = window.devicePixelRatio > 1),
      (this.system.webworker = void 0 !== window.Worker),
      window._NODE_ ||
        (this.system.geolocation = void 0 !== navigator.geolocation),
      window._NODE_ ||
        (this.system.pushstate = void 0 !== window.history.pushState),
      (this.system.webcam = !!(
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.mediaDevices
      )),
      (this.system.language =
        window.navigator.userLanguage || window.navigator.language),
      (this.system.webaudio = void 0 !== window.AudioContext),
      (this.system.xr = {}),
      (this.system.detectXR = async function () {
        if (window.AURA)
          return ((_this.system.xr.vr = !0), void (_this.system.xr.ar = !0));
        if (!navigator.xr)
          return ((_this.system.xr.vr = !1), void (_this.system.xr.ar = !1));
        try {
          [_this.system.xr.vr, _this.system.xr.ar] = await Promise.all([
            navigator.xr.isSessionSupported("immersive-vr"),
            navigator.xr.isSessionSupported("immersive-ar"),
          ]);
        } catch (e) {}
        "android" == _this.system.os &&
          (_this.detect("oculus") || (_this.system.xr.vr = !1));
      }));
    try {
      this.system.localStorage = void 0 !== window.localStorage;
    } catch (e) {
      this.system.localStorage = !1;
    }
    ((this.system.fullscreen =
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled),
      (this.system.os =
        _this.detect(["ipad", "iphone", "ios"]) ||
        (function detectIpad() {
          let aspect =
            Math.max(screen.width, screen.height) /
            Math.min(screen.width, screen.height);
          return (
            _this.detect("mac") &&
            _this.touchCapable &&
            Math.abs(aspect - 4 / 3) < Math.abs(aspect - 1.6)
          );
        })()
          ? "ios"
          : _this.detect(["android", "kindle"])
            ? "android"
            : _this.detect(["blackberry"])
              ? "blackberry"
              : _this.detect(["mac os"])
                ? "mac"
                : _this.detect(["windows", "iemobile"])
                  ? "windows"
                  : _this.detect(["linux"])
                    ? "linux"
                    : "unknown"),
      (this.system.version = (function () {
        try {
          if ("ios" == _this.system.os) {
            if (_this.agent.includes("intel mac")) {
              let split = _this.agent
                .split("version/")[1]
                .split(" ")[0]
                .split(".");
              return Number(split[0] + "." + split[1]);
            }
            var num = _this.agent.split("os ")[1].split("_"),
              main = num[0],
              sub = num[1].split(" ")[0];
            return Number(main + "." + sub);
          }
          if ("android" == _this.system.os) {
            var version = _this.agent.split("android ")[1].split(";")[0];
            return (
              version.length > 3 && (version = version.slice(0, -2)),
              "." == version.charAt(version.length - 1) &&
                (version = version.slice(0, -1)),
              Number(version)
            );
          }
          if ("windows" == _this.system.os)
            return _this.agent.includes("rv:11")
              ? 11
              : Number(_this.agent.split("windows phone ")[1].split(";")[0]);
        } catch (e) {}
        return -1;
      })()),
      (this.system.browser =
        "ios" == _this.system.os
          ? _this.detect(["twitter", "fbios", "instagram"])
            ? "social"
            : _this.detect(["crios"])
              ? "chrome"
              : _this.detect(["fxios"])
                ? "firefox"
                : _this.detect(["safari"])
                  ? "safari"
                  : "unknown"
          : "android" == _this.system.os
            ? _this.detect(["twitter", "fb", "facebook", "instagram"])
              ? "social"
              : _this.detect(["chrome"])
                ? "chrome"
                : _this.detect(["firefox"])
                  ? "firefox"
                  : "browser"
            : _this.detect(["msie"]) ||
                (_this.detect(["trident"]) && _this.detect(["rv:"])) ||
                (_this.detect(["windows"]) && _this.detect(["edge"]))
              ? "ie"
              : _this.detect(["chrome"])
                ? "chrome"
                : _this.detect(["safari"])
                  ? "safari"
                  : _this.detect(["firefox"])
                    ? "firefox"
                    : "unknown"),
      (this.system.browserVersion = (function () {
        try {
          if ("chrome" == _this.system.browser)
            return _this.detect("crios")
              ? Number(_this.agent.split("crios/")[1].split(".")[0])
              : Number(_this.agent.split("chrome/")[1].split(".")[0]);
          if ("firefox" == _this.system.browser)
            return Number(_this.agent.split("firefox/")[1].split(".")[0]);
          if ("safari" == _this.system.browser)
            return Number(
              _this.agent.split("version/")[1].split(".")[0].split(".")[0],
            );
          if ("ie" == _this.system.browser)
            return _this.detect(["msie"])
              ? Number(_this.agent.split("msie ")[1].split(".")[0])
              : _this.detect(["rv:"])
                ? Number(_this.agent.split("rv:")[1].split(".")[0])
                : Number(_this.agent.split("edge/")[1].split(".")[0]);
        } catch (e) {
          return -1;
        }
      })()),
      (this.mobile =
        !(
          window._NODE_ ||
          (!("ontouchstart" in window) && !("onpointerdown" in window)) ||
          !_this.system.os.includes(["ios", "android", "magicleap"])
        ) && {}),
      _this.detect("oculusbrowser") && (this.mobile = !0),
      _this.detect("quest") && (this.mobile = !0),
      this.mobile &&
        this.detect(["windows"]) &&
        !this.detect(["touch"]) &&
        (this.mobile = !1),
      this.mobile &&
        ((this.mobile.tablet =
          Math.max(
            window.screen ? screen.width : window.innerWidth,
            window.screen ? screen.height : window.innerHeight,
          ) > 1e3),
        (this.mobile.phone = !this.mobile.tablet),
        (this.mobile.pwa =
          !(
            !window.matchMedia ||
            !window.matchMedia("(display-mode: standalone)").matches
          ) || !!window.navigator.standalone),
        Hydra.ready(() => {
          _this.mobile.native =
            !(!Mobile.NativeCore || !Mobile.NativeCore.active) ||
            !!window._AURA_;
        })),
      (this.media = {}),
      (this.media.audio =
        !!document.createElement("audio").canPlayType &&
        (_this.detect(["firefox", "opera"]) ? "ogg" : "mp3")),
      (this.media.video =
        ((vid = document.createElement("video")).setAttribute("muted", !0),
        vid.setAttribute("loop", !0),
        vid.setAttribute("autoplay", !0),
        vid.setAttribute("preload", !0),
        vid.setAttribute("playsinline", !0),
        vid.setAttribute("webkit-playsinline", !0),
        (vid.autoplay = !0),
        (vid.muted = !0),
        (vid.src =
          "data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAG1wNDJpc28yYXZjMW1wNDEAAANObW9vdgAAAGxtdmhkAAAAAOA5QnjgOUJ4AAAD6AAAAEMAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAmt0cmFrAAAAXHRraGQAAAAD4DlCeOA5QngAAAABAAAAAAAAAEMAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAACAAAAAgAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAABDAAAAAAABAAAAAAHjbWRpYQAAACBtZGhkAAAAAOA5QnjgOUJ4AAFfkAAAF3BVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABjm1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAU5zdGJsAAAAznN0c2QAAAAAAAAAAQAAAL5hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAACAAIABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAMWF2Y0MBTUAo/+EAGWdNQCjspLYC1BgYGQAAAwABAAK/IA8YMZYBAAVo6uEyyAAAABNjb2xybmNseAAGAAYABgAAAAAQcGFzcAAAAAEAAAABAAAAFGJ0cnQAAAAAAAF1IAABdSAAAAAYc3R0cwAAAAAAAAABAAAAAgAAC7gAAAAUc3RzcwAAAAAAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAAAgAAAAEAAAAcc3RzegAAAAAAAAAAAAAAAgAAAxAAAAAMAAAAFHN0Y28AAAAAAAAAAQAAA34AAABvdWR0YQAAAGdtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABtZGlyYXBwbAAAAAAAAAAAAAAAADppbHN0AAAAMql0b28AAAAqZGF0YQAAAAEAAAAASGFuZEJyYWtlIDEuNi4xIDIwMjMwMTIyMDAAAAAIZnJlZQAAAyRtZGF0AAAC9AYF///w3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NCByMzEwMCBlZDBmN2E2IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyMiAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTIgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9NiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTEga2V5aW50PTMwMCBrZXlpbnRfbWluPTMwIHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9MzAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMi4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCB2YnZfbWF4cmF0ZT0yMDAwMCB2YnZfYnVmc2l6ZT0yNTAwMCBjcmZfbWF4PTAuMCBuYWxfaHJkPW5vbmUgZmlsbGVyPTAgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAABRliIQAK//+9q78yyt0fpUs1YVPgQAAAAhBmiFsQn/+Vg=="),
        vid.play(),
        vid.addEventListener("canplaythrough", (_) => {
          (vid.paused && _this.mobile && (_this.mobile.lowPowerMode = !0),
            setTimeout((_) => vid.pause(), 500));
        }),
        !!vid.canPlayType &&
          (vid.canPlayType("video/webm;") ? "webm" : "mp4"))),
      (this.media.webrtc = !!(
        window.webkitRTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.msRTCPeerConnection ||
        window.oRTCPeerConnection ||
        window.RTCPeerConnection
      )),
      (this.graphics = {}),
      (this.graphics.webgl = (function () {
        let DISABLED = !1;
        Object.defineProperty(_this.graphics, "webgl", {
          get: () => {
            if (DISABLED) return !1;
            if (_this.graphics._webglContext)
              return _this.graphics._webglContext;
            try {
              const names = ["webgl2", "webgl", "experimental-webgl"],
                canvas = document.createElement("canvas");
              let gl;
              canvas.addEventListener(
                "webglcontextlost",
                () => Events.emitter._fireEvent(Events.WEBGL_CONTEXT_LOSS),
                !1,
              );
              for (
                let i = 0;
                i < names.length &&
                (("webgl2" === names[i] && Utils.query("compat")) ||
                  ((gl = canvas.getContext(names[i])), !gl));
                i++
              );
              if (gl.isContextLost())
                return (
                  (window.__WEBGL_CONTEXT_LOSS = !0),
                  (DISABLED = !0),
                  !1
                );
              let output = { gpu: "unknown" };
              if (
                ((output.renderer = gl.getParameter(gl.RENDERER).toLowerCase()),
                (output.version = gl.getParameter(gl.VERSION).toLowerCase()),
                (output.glsl = gl
                  .getParameter(gl.SHADING_LANGUAGE_VERSION)
                  .toLowerCase()),
                (output.extensions = gl.getSupportedExtensions()),
                (output.webgl2 = output.version.includes([
                  "webgl 2",
                  "webgl2",
                ])),
                (output.canvas = canvas),
                (output.context = gl),
                "firefox" === _this.system.browser &&
                  _this.system.browserVersion >= 92)
              )
                output.gpu = output.renderer;
              else {
                let info = gl.getExtension("WEBGL_debug_renderer_info");
                if (info) {
                  let gpu = info.UNMASKED_RENDERER_WEBGL;
                  output.gpu = gl.getParameter(gpu).toLowerCase();
                }
              }
              return (
                (output.detect = function (matches) {
                  if (output.gpu && output.gpu.toLowerCase().includes(matches))
                    return !0;
                  if (
                    output.version &&
                    output.version.toLowerCase().includes(matches)
                  )
                    return !0;
                  for (let i = 0; i < output.extensions.length; i++)
                    if (output.extensions[i].toLowerCase().includes(matches))
                      return !0;
                  return !1;
                }),
                output.webgl2 ||
                  output.detect("instance") ||
                  window.AURA ||
                  (DISABLED = !0),
                (_this.graphics._webglContext = output),
                output
              );
            } catch (e) {
              return !1;
            }
          },
          set: (v) => {
            !1 === v && (DISABLED = !0);
          },
        });
      })()),
      (this.graphics.metal = (function () {
        if (!window.Metal) return !1;
        let output = {};
        return (
          (output.gpu = Metal.device.getName().toLowerCase()),
          (output.detect = function (matches) {
            return output.gpu.includes(matches);
          }),
          output
        );
      })()),
      (this.graphics.gpu = (function () {
        if (!_this.graphics.webgl && !_this.graphics.metal) return !1;
        let output = {};
        return (
          ["metal", "webgl"].forEach((name) => {
            _this.graphics[name] &&
              !output.identifier &&
              ((output.detect = _this.graphics[name].detect),
              (output.identifier = _this.graphics[name].gpu));
          }),
          output
        );
      })()),
      (this.graphics.canvas = !!document.createElement("canvas").getContext));
    const checkForStyle = (function () {
      let _tagDiv;
      return function (prop) {
        _tagDiv = _tagDiv || document.createElement("div");
        const vendors = ["Khtml", "ms", "O", "Moz", "Webkit"];
        if (prop in _tagDiv.style) return !0;
        prop = prop.replace(/^[a-z]/, (val) => val.toUpperCase());
        for (let i = vendors.length - 1; i >= 0; i--)
          if (vendors[i] + prop in _tagDiv.style) return !0;
        return !1;
      };
    })();
    ((this.styles = {}),
      (this.styles.filter = checkForStyle("filter")),
      (this.styles.blendMode = checkForStyle("mix-blend-mode")),
      (this.tween = {}),
      (this.tween.transition = checkForStyle("transition")),
      (this.tween.css2d = checkForStyle("transform")),
      (this.tween.css3d = checkForStyle("perspective")),
      (this.social = _this.agent.includes("instagram")
        ? "instagram"
        : _this.agent.includes("fban") ||
            _this.agent.includes("fbav") ||
            _this.agent.includes("fbios")
          ? "facebook"
          : (_this.agent.includes("twitter") ||
              !(
                !document.referrer || !document.referrer.includes("//t.co/")
              )) &&
            "twitter"));
  }, "Static"),
  Class(
    function Component() {
      if (this.initClass) return;
      Inherit(this, Events);
      const _this = this,
        _setters = {},
        _flags = {},
        _timers = [],
        _loops = [];
      var _onDestroy, _appStateBindings;
      function defineSetter(_this, prop) {
        ((_setters[prop] = {}),
          Object.defineProperty(_this, prop, {
            set: function (v) {
              (_setters[prop] &&
                _setters[prop].s &&
                _setters[prop].s.call(_this, v),
                (v = null));
            },
            get: function () {
              if (_setters[prop] && _setters[prop].g)
                return _setters[prop].g.apply(_this);
            },
          }));
      }
      ((this.classes = {}),
        (this.findParent = function (type) {
          let p = _this.parent;
          for (; p; ) {
            if (
              (p._cachedName || (p._cachedName = Utils.getConstructorName(p)),
              p._cachedName == type)
            )
              return p;
            p = p.parent;
          }
        }),
        (this.set = function (prop, callback) {
          (_setters[prop] || defineSetter(this, prop),
            (_setters[prop].s = callback));
        }),
        (this.get = function (prop, callback) {
          (_setters[prop] || defineSetter(this, prop),
            (_setters[prop].g = callback));
        }),
        (this.isPlayground = function (name) {
          return (
            !("boolean" != typeof name || !Global.PLAYGROUND) ||
            (Global.PLAYGROUND &&
              Global.PLAYGROUND == (name || Utils.getConstructorName(_this)))
          );
        }),
        (this.initClass = function (clss) {
          if (!clss) throw (console.trace(), "unable to locate class");
          if (clss.instance) return clss.instance();
          const args = [].slice.call(arguments, 1),
            child = Object.create(clss.prototype);
          if (
            ((child.parent = this),
            (child.__afterInitClass = []),
            clss.apply(child, args),
            child.destroy)
          ) {
            const id = Utils.timestamp();
            ((this.classes[id] = child), (this.classes[id].__id = id));
          }
          if (child.element) {
            const last = arguments[arguments.length - 1];
            Array.isArray(last) &&
            1 == last.length &&
            last[0] instanceof child.element.constructor
              ? last[0].add(child.element)
              : this.element &&
                this.element.add &&
                null !== last &&
                this.element.add(child.element);
          }
          if (child.group) {
            const last = arguments[arguments.length - 1];
            this.group && null !== last && this.group.add(child.group);
          }
          if ("undefined" != typeof Hydra && Hydra.LOCAL) {
            let key = Utils.getConstructorName(child);
            key &&
              (Component.HMR.has(key) || Component.HMR.set(key, []),
              Component.HMR.get(key).push({ ref: child, args: args }));
          }
          return (
            child.__afterInitClass.forEach((callback) => {
              callback();
            }),
            delete child.__afterInitClass,
            child
          );
        }),
        (this.delayedCall = function (callback, time, scaledTime) {
          const timer = Timer.create(
            () => {
              _this && _this.destroy && callback && callback();
            },
            time,
            scaledTime,
          );
          return (
            _timers.push(timer),
            _timers.length > 50 && _timers.shift(),
            timer
          );
        }),
        (this.clearTimers = function () {
          for (let i = _timers.length - 1; i >= 0; i--)
            clearTimeout(_timers[i]);
          _timers.length = 0;
        }),
        (this.startRender = function (callback, fps, obj) {
          "number" != typeof fps && ((obj = fps), (fps = void 0));
          for (let i = 0; i < _loops.length; i++)
            if (_loops[i].callback == callback) return;
          let flagInvisible = (_) => {
              _this._invisible ||
                ((_this._invisible = !0),
                _this.onInvisible && _this.onInvisible());
            },
            loop = (a, b, c, d) => {
              if (!_this.startRender) return !1;
              let p = _this;
              for (; p; ) {
                if (!1 === p.visible) return flagInvisible();
                if (p.group && !1 === p.group.visible) return flagInvisible();
                p = p.parent;
              }
              !1 !== _this._invisible &&
                ((_this._invisible = !1), _this.onVisible && _this.onVisible());
              try {
                callback(a, b, c, d);
              } catch (error) {
                let evt = {
                  callback: callback,
                  error: error,
                  component: _this,
                  preventStopRender: !1,
                };
                (Events.emitter._fireEvent(Render.RENDER_CALLBACK_ERROR, evt),
                  evt.preventStopRender || _this.stopRender(callback, obj));
              }
              return !0;
            };
          (_loops.push({ callback: callback, loop: loop, obj: obj }),
            obj
              ? obj == RenderManager.NATIVE_FRAMERATE
                ? Render.start(loop, null, !0)
                : RenderManager.schedule(loop, obj)
              : Render.start(loop, fps));
        }),
        (this.onResize = function (callback, callInitial = !0) {
          (callInitial && callback(), this.events.sub(Events.RESIZE, callback));
        }),
        (this.stopRender = function (callback, obj) {
          for (let i = 0; i < _loops.length; i++)
            if (_loops[i].callback == callback) {
              let loop = _loops[i].loop;
              (obj && RenderManager.unschedule(loop, obj),
                Render.stop(loop),
                _loops.splice(i, 1));
            }
        }),
        (this.clearRenders = function () {
          for (let i = 0; i < _loops.length; i++) {
            let { loop: loop, obj: obj } = _loops[i];
            obj ? RenderManager.unschedule(loop, obj) : Render.stop(loop);
          }
          _loops.length = 0;
        }),
        (this.wait = function (object, key, callback) {
          const promise = Promise.create();
          let condition, appState;
          if (
            ("string" == typeof object &&
              ((callback = key), (key = object), (object = _this)),
            key?.includes?.("/") && (appState = AppState),
            object.isAppState && (appState = object),
            "number" == typeof object && 1 === arguments.length)
          )
            return (_this.delayedCall(promise.resolve, object), promise);
          if (
            ("function" == typeof object &&
              1 === arguments.length &&
              ((condition = object), (object = _this)),
            "function" == typeof object && "string" == typeof callback)
          ) {
            let _object = object;
            ((object = key), (key = callback), (callback = _object));
          }
          if (
            ((callback = callback || promise.resolve),
            condition ||
              (appState
                ? (condition = () => !!appState.get(key))
                : "!" === key?.charAt?.(0)
                  ? ((key = key.slice(1)),
                    (condition = () =>
                      !(
                        object[key] ||
                        ("function" == typeof object.flag && object.flag(key))
                      )))
                  : (condition = () =>
                      !!object[key] ||
                      !(
                        "function" != typeof object.flag || !object.flag(key)
                      ))),
            condition())
          )
            callback();
          else {
            Render.start(function test() {
              if (!object || !_this.flag || null === object.destroy)
                return Render.stop(test);
              condition() && (callback(), Render.stop(test));
            });
          }
          return promise;
        }),
        (this.bindState = function (appState, key, ...rest) {
          if (appState.then)
            return (async () =>
              _this.bindState(await appState, key, ...rest))();
          ("object" != typeof appState ||
            appState.constructor !== Object ||
            appState.isAppState ||
            (appState = AppState.createLocal(appState)),
            _appStateBindings || (_appStateBindings = []));
          let binding = (appState._bind || appState.bind).bind(appState)(
            key,
            ...rest,
          );
          return (
            _appStateBindings.push(binding),
            binding._bindOnDestroy(() => {
              _appStateBindings.remove(binding);
            }),
            binding
          );
        }),
        (this.flag = function (name, value, time) {
          if (void 0 === value) return _flags[name];
          ((_flags[name] = value),
            time &&
              (clearTimeout(_flags[name + "_timer"]),
              (_flags[name + "_timer"] = this.delayedCall(() => {
                _flags[name] = !_flags[name];
              }, time))));
        }),
        (this.destroy = function () {
          (this.removeDispatch && this.removeDispatch(),
            this.onDestroy && this.onDestroy(),
            this.fxDestroy && this.fxDestroy(),
            _onDestroy &&
              (_onDestroy.forEach((cb) => cb()), (_onDestroy = null)));
          for (let id in this.classes) {
            var clss = this.classes[id];
            clss && clss.destroy && clss.destroy();
          }
          if (((this.classes = null), Hydra.LOCAL)) {
            let key = Utils.getConstructorName(this),
              array = Component.HMR.get(key);
            array && array.remove(this);
          }
          if (
            (this.clearRenders && this.clearRenders(),
            this.clearTimers && this.clearTimers(),
            this.element &&
              window.GLUI &&
              this.element instanceof GLUIObject &&
              this.element.remove(),
            this.events && (this.events = this.events.destroy()),
            this.parent &&
              this.parent.__destroyChild &&
              this.parent.__destroyChild(this.__id),
            _appStateBindings)
          )
            for (; _appStateBindings.length > 0; )
              _appStateBindings[_appStateBindings.length - 1].destroy?.();
          return Utils.nullObject(this);
        }),
        (this._bindOnDestroy = function (cb) {
          (_onDestroy || (_onDestroy = []), _onDestroy.push(cb));
        }),
        (this.__destroyChild = function (name) {
          delete this.classes[name];
        }),
        (this.navigate = function (route) {
          let p = _this.parent;
          for (; p; ) (p.navigate && p.navigate(route), (p = p.parent));
        }));
    },
    (_) => {
      ((Component.HMR = new Map()),
        (Component.HMR_INSTANCE_RELOADED = "Component.HMR_INSTANCE_RELOADED"));
    },
  ),
  Class(function Model() {
    (Inherit(this, Component), Namespace(this));
    const _this = this,
      _storage = {},
      _requests = {};
    let _data = 0,
      _triggered = 0;
    ((this.push = function (name, val) {
      _storage[name] = val;
    }),
      (this.pull = function (name) {
        return _storage[name];
      }),
      (this.waitForData = this.promiseData =
        function (num = 1) {
          _data += num;
        }),
      (this.fulfillData = this.resolveData =
        function () {
          (_triggered++, _triggered == _data && (_this.dataReady = !0));
        }),
      (this.ready = function (callback) {
        let promise = Promise.create();
        return (
          callback && promise.then(callback),
          _this.wait(_this, "dataReady").then(promise.resolve),
          promise
        );
      }),
      (this.initWithData = function (data) {
        for (var key in ((_this.STATIC_DATA = data), _this)) {
          var model = _this[key],
            init = !1;
          for (var i in data)
            i.toLowerCase().replace(/-/g, "") == key.toLowerCase() &&
              ((init = !0), model.init && model.init(data[i]));
          !init && model.init && model.init();
        }
        _this.init && _this.init(data);
      }),
      (this.loadData = function (url, callback) {
        let promise = Promise.create();
        callback || (callback = promise.resolve);
        var _this = this;
        return (
          get(url + "?" + Utils.timestamp()).then((d) => {
            defer(() => {
              (_this.initWithData(d), callback(d));
            });
          }),
          promise
        );
      }),
      (this.handleRequest = function (type, callback) {
        _requests[type] = callback;
      }),
      (this.makeRequest = async function (type, data, mockData = {}) {
        if (
          ("function" == typeof type &&
            ((mockData = type), (data = null), (type = null)),
          "function" == typeof data && ((mockData = data), (data = null)),
          "function" == typeof mockData && (mockData = await mockData()),
          mockData?.reflow)
        )
          return mockData;
        if (!_requests[type])
          return (
            console.warn(
              `Missing data handler for ${type} with mockData`,
              mockData,
            ),
            "function" == typeof mockData && (mockData = mockData()),
            Array.isArray(mockData)
              ? new StateArray(mockData)
              : AppState.createLocal(mockData)
          );
        let result = await _requests[type](data, mockData);
        if (!(result instanceof StateArray || result.createLocal))
          throw `makeRequest ${type} must return either an AppState or StateArray`;
        return result;
      }),
      (this.request = async function (type, data, mockData) {
        if (
          ("function" == typeof type &&
            ((mockData = type), (data = null), (type = null)),
          "function" == typeof data && ((mockData = data), (data = null)),
          "function" == typeof mockData && (mockData = await mockData()),
          mockData?.reflow)
        )
          return mockData;
        if (!_requests[type])
          return Array.isArray(mockData)
            ? new StateArray(mockData)
            : AppState.createLocal(mockData);
        let result = await _requests[type](data, mockData);
        if (
          (Array.isArray(result)
            ? (result = new StateArray(result))
            : "object" == typeof result &&
              (result = AppState.createLocal(result)),
          !(result instanceof StateArray || result.createLocal))
        )
          throw `makeRequest ${type} must return either an AppState or StateArray`;
        return result;
      }));
  }),
  Class(function Data() {
    Inherit(this, Model);
  }, "static"),
  Class(function Modules() {
    const _modules = {},
      _constructors = {};
    function exec() {
      for (let m in _modules)
        for (let key in _modules[m]) {
          let module = _modules[m][key];
          module._ready || ((module._ready = !0), module.exec && module.exec());
        }
    }
    (defer(exec),
      (this.Module = function (module) {
        let m = new module(),
          name = module
            .toString()
            .slice(0, 100)
            .match(/function ([^\(]+)/);
        name
          ? ((m._ready = !0),
            (name = name[1]),
            (_modules[name] = { index: m }),
            (_constructors[name] = module))
          : (_modules[m.module] || (_modules[m.module] = {}),
            (_modules[m.module][m.path] = m));
      }),
      (this.require = function (path) {
        let root;
        return (
          path.includes("/")
            ? ((root = path.split("/")[0]),
              (path = path.replace(root + "/", "")))
            : ((root = path), (path = "index")),
          (function requireModule(root, path) {
            let module = _modules[root];
            if (!module) throw `Module ${root} not found`;
            return (
              (module = module[path]),
              module._ready ||
                ((module._ready = !0), module.exec && module.exec()),
              module
            );
          })(root, path).exports
        );
      }),
      (this.getConstructor = function (name) {
        return _constructors[name];
      }),
      (this.modulesReady = async function () {
        let modules = [...arguments].flat();
        await Promise.all(modules.map((name) => Modules.moduleReady(name)));
      }),
      (this.moduleReady = function (name) {
        let promise = Promise.create(),
          check = function () {
            _modules[name] && (Render.stop(check), promise.resolve());
          };
        return (Render.start(check), promise);
      }),
      (window.Module = this.Module),
      window._NODE_ ||
        ((window.requireNative = window.require),
        (window.require = this.require)));
  }, "Static"),
  Class(function StateWrapper(_array) {
    const _this = this;
    (Inherit(this, Component),
      (this.bind = this.listen =
        function (key, callback) {
          _array.forEach(async (obj) => {
            (await obj.wait("__ready"),
              _this.bindState(obj.state, key, (data) => {
                callback({ target: obj, data: data });
              }));
          });
        }));
  }),
  Class(function StateInitializer(Class, _ref, _params, _stateRef) {
    Inherit(this, Component);
    const _this = this;
    var _initTime = Render.TIME;
    function parseState(state) {
      return (
        state.includes("/") || (state = _this.parent.fragName + "/" + state),
        state
      );
    }
    function onInit(bool) {
      if (((_initTime = Render.TIME), bool)) {
        for (let key in _params)
          (_params[key].includes?.("#x#") &&
            (_params[key] = _params[key].replace(/#x#/g, "")),
            _params[key].includes?.("_this.") &&
              (_params[key] = _this.parent[_params[key].split("_this.")[1]]));
        _this.parent[_ref] = _this.parent.initClass(Class, _params);
      } else _this.parent[_ref] = _this.parent[_ref]?.destroy();
    }
    async function onInit3D() {
      (await _this.wait(Math.max(1e3 - (Render.TIME - _initTime), 0)),
        await _this.wait((_) => !!_this.parent[_ref]));
      let ref = _this.parent[_ref];
      ref.nuke && (await Initializer3D.uploadNuke(ref.nuke));
      const group = ref.layout || ref.scene || ref.group || ref.element?.group;
      group && (await Initializer3D.uploadAllAsync(group));
    }
    ((this.ref = _ref),
      (function () {
        if (!_stateRef.init) throw "StateInitializer required init parameter";
        (_stateRef.init.includes?.("#x#")
          ? eval(_stateRef.init.replace(/#x#/g, "")) && onInit(!0)
          : "true" == _stateRef.init || 1 == _stateRef.init
            ? onInit(!0)
            : _this.bindState(AppState, parseState(_stateRef.init), onInit),
          _stateRef.init3d &&
            _this.bindState(AppState, parseState(_stateRef.init3d), onInit3D));
      })(),
      (this.force = function () {
        AppState.set(parseState(_stateRef.init), !0);
      }));
  }),
  Class(function Initialization() {
    ((this.initSync = async function (obj) {
      await Initializer3D.uploadAll(obj);
    }),
      (this.initAsync = async function (obj) {
        await Initializer3D.uploadAllAsync(obj);
      }));
  }),
  Class(
    function FragUIHelper(_obj, _root) {
      Inherit(this, Component);
      const _this = this,
        invalidDomAttrs = [
          "refname",
          "refname",
          "_innertext",
          "_type",
          "_placeholder",
        ],
        _createdObjs = new Map();
      function isLowerCase(str) {
        return str.charAt(0) == str.charAt(0).toLowerCase();
      }
      function isCustomComponentType(type) {
        return (
          !isLowerCase(type) &&
          "UI" !== type &&
          "GLObject" !== type &&
          "glObject" !== type &&
          "glObj" !== type &&
          "GLText" !== type &&
          "glText" !== type &&
          "HydraObject" !== type
        );
      }
      function findStateObject(text) {
        return text.match(/\$(.*)\./)[1];
      }
      function getPropByString(obj, propString) {
        if (!propString) return obj;
        for (
          var props = propString.split("."), i = 0, iLen = props.length - 1;
          i < iLen;
          i++
        ) {
          var candidate = obj[props[i]];
          if (void 0 === candidate) break;
          obj = candidate;
        }
        return obj[props[i]];
      }
      function parseTextBindings(text) {
        let binds = [];
        for (; text.match(/\$(.*)\./); ) {
          let match = text.match(/\$(.*)\./),
            split = text.split(match[0]);
          ((split[0] = split[0] + "@["), (split[1] = split[1].split(" ")));
          let name = split[1][0];
          ((split[1][0] += "]"),
            (split[1] = split[1].join(" ")),
            (text = split.join("")),
            binds.push(name));
        }
        return [binds, text];
      }
      function parseTextGlobalBindings(text) {
        let binds = [];
        for (; text.match(/\$(\w*)\/(\w*)/); ) {
          let match = text.match(/\$(\w*)\/(\w*)/),
            split = text.split(match[0]);
          ((split[0] = split[0] + "@["), (split[1] = split[1].split(" ")));
          let name = match[0].slice(1).trim();
          ((split[1][0] = name),
            (split[1][0] += "]"),
            (split[1] = split[1].join(" ")),
            (text = split.join("")),
            binds.push(name));
        }
        return [binds, text];
      }
      function parseCSSTransformStr(obj) {
        let data = {};
        return (
          obj.split(",").forEach((param) => {
            let [a, b] = param.split(":");
            ((a = a.trim()),
              (b = b.trim()),
              isNaN(b) || (b = Number(b)),
              (data[a] = b));
          }),
          data
        );
      }
      function doConstructor(obj) {
        switch (obj._type) {
          case "UI":
            return _this.parent.element || _this.parent.getDOMElement?.();
          case "GLObject":
          case "glObject":
          case "glObj":
            return obj.width && obj.height && obj.bg
              ? $gl(Number(obj.width), Number(obj.height), obj.bg)
              : $gl();
          case "GLText":
          case "glText":
            if (obj._innerText.match?.(/\$(.*)\./)) {
              let {
                  font: font,
                  fontSize: fontSize,
                  fontColor: fontColor,
                  _innerText: _innerText,
                  ...options
                } = obj,
                $text = $glText(
                  obj._innerText,
                  obj.font,
                  Number(obj.fontSize),
                  { color: fontColor, ...options },
                ),
                state = findStateObject(obj._innerText),
                ref = state;
              const stateAsNumber = Number(ref);
              if (!isNaN(stateAsNumber))
                return (
                  $obj.html(obj._innerText),
                  $glText(obj._innerText, obj.font, Number(obj.fontSize), {
                    color: obj.fontColor,
                    width: obj.width,
                  })
                );
              if (ref.includes(".")) {
                let split = state.split(".");
                ((ref = split[0]), split.shift(), (state = split.join(".")));
              }
              return (
                _this.wait(_this.parent, ref).then((_) => {
                  let [binds, text] = parseTextBindings(obj._innerText);
                  ($text.setText(text),
                    _this.parent.bindState(
                      ref == state
                        ? _this.parent[ref]
                        : getPropByString(_this.parent[ref], state),
                      binds,
                      $text,
                    ));
                }),
                $text
              );
            }
            if (obj._innerText.match?.(/\$(\w*)\/(\w*)/)) {
              let [binds, text] = parseTextGlobalBindings(obj._innerText),
                {
                  font: font,
                  fontSize: fontSize,
                  fontColor: fontColor,
                  _innerText: _innerText,
                  ...options
                } = obj,
                $text = $glText(
                  obj._innerText,
                  obj.font,
                  Number(obj.fontSize),
                  { color: fontColor, ...options },
                );
              return (_this.parent.bindState(AppState, binds, $text), $text);
            }
            {
              let {
                font: font,
                fontSize: fontSize,
                fontColor: fontColor,
                _innerText: _innerText,
                ...options
              } = obj;
              return $glText(obj._innerText, obj.font, Number(obj.fontSize), {
                color: fontColor,
                ...options,
              });
            }
          default:
            let $obj = $(
              obj.className || obj.refName || "h",
              "HydraObject" != obj._type ? obj._type : "div",
            );
            if (
              (obj.width && obj.height && $obj.size(obj.width, obj.height),
              obj.font &&
                $obj.fontStyle(obj.font, Number(obj.fontSize), obj.fontColor),
              obj._innerText)
            )
              if (obj._innerText.match?.(/\$(.*)\./)) {
                let state = findStateObject(obj._innerText),
                  ref = state;
                const stateAsNumber = Number(ref);
                if (!isNaN(stateAsNumber))
                  return ($obj.html(obj._innerText), $obj);
                if (ref.includes(".")) {
                  let split = state.split(".");
                  ((ref = split[0]), split.shift(), (state = split.join(".")));
                }
                _this.wait(_this.parent, ref).then((_) => {
                  let [binds, text] = parseTextBindings(obj._innerText);
                  ($obj.html?.(text),
                    _this.parent?.bindState(
                      ref == state
                        ? _this.parent[ref]
                        : getPropByString(_this.parent[ref], state),
                      binds,
                      $obj,
                    ));
                });
              } else if (obj._innerText.match?.(/\$(\w*)\/(\w*)/)) {
                let [binds, text] = parseTextGlobalBindings(obj._innerText);
                ($obj.html(text),
                  _this.parent.bindState(AppState, binds, $obj));
              } else $obj.html(obj._innerText);
            return $obj;
        }
      }
      function applyValues(obj, $obj) {
        const callObjKeyVal = (key) =>
          new Promise((resolve) => {
            const applyValue = (val) => {
                if (
                  !($obj instanceof GLUIObject || $obj instanceof GLUIText) ||
                  ("width" !== key && "height" !== key)
                )
                  if ("function" == typeof $obj[key]) $obj[key](val);
                  else {
                    if (
                      $obj instanceof HydraObject &&
                      !invalidDomAttrs.includes(key.toLowerCase())
                    )
                      if ("className" === key) {
                        if (
                          "string" != typeof val ||
                          "string" != typeof $obj.div.className
                        )
                          return;
                        ($obj.classList().add(...val.split(/\s+/)),
                          $obj.div.className.includes("$") &&
                            $obj.div.classList.forEach((className) => {
                              className.startsWith("$") &&
                                $obj.div.classList.remove(className);
                            }));
                      } else
                        $obj.attr(FragUIHelper.SVG_ALIAS.get(key) || key, val);
                    $obj[key] = val;
                  }
              },
              callFn = async () => {
                let val = isNaN(obj[key]) ? obj[key] : Number(obj[key]);
                if ("string" == typeof val) {
                  if (val.match(/\$(.*)\./)) {
                    let stateStr = findStateObject(val),
                      state = _this.parent[stateStr];
                    (state ||
                      (await _this.wait(_this.parent, stateStr),
                      (state = _this.parent[stateStr])),
                      state.then && (state = await state));
                    let [binds] = parseTextBindings(val);
                    return _this.parent.bindState(state, binds, (dataVal) =>
                      applyValue(dataVal),
                    );
                  }
                  if (val.match(/\$(\w*)\/(\w*)/)) {
                    let [binds] = parseTextGlobalBindings(val);
                    return _this.parent.bindState(AppState, binds, (dataVal) =>
                      applyValue(dataVal),
                    );
                  }
                  if (val.startsWith("$") && "$element" != val)
                    return applyValue(_this.parent[val.slice(1)]);
                }
                applyValue(val);
              };
            if (_this.parent.__afterInitClass)
              return _this.parent.__afterInitClass.push(() =>
                resolve(callFn()),
              );
            resolve(callFn());
          });
        for (let key in obj)
          if (
            "_type" !== key &&
            "refName" !== key &&
            "children" !== key &&
            "display" !== key
          ) {
            if ("shader" == key) {
              let shader = _this.initClass(Shader, obj[key], {
                tMap: { value: null },
              });
              if (window[shader.vsName]) {
                let mesh = $obj.mesh || {};
                mesh.shaderClass = _this.parent.initClass(
                  window[shader.vsName],
                  mesh,
                  shader,
                );
              }
              $obj.useShader(shader);
            }
            if (
              (obj.width &&
                obj.height &&
                $obj.size &&
                $obj.size(
                  isNaN(obj.width) ? obj.width : Number(obj.width),
                  isNaN(obj.height) ? obj.height : Number(obj.height),
                ),
              "css" == key || "transform" == key)
            )
              $obj[key](parseCSSTransformStr(obj[key]));
            else if ("onClick" == key || "onHover" == key)
              $obj.useShader
                ? (_this
                    .wait((_) => !!_this.parent[obj[key].slice(1)])
                    .then((_) => {
                      const interactHandle = _this.parent[obj[key].slice(1)];
                      $obj["__interact" + key] = interactHandle;
                    }),
                  _this
                    .wait(
                      (_) =>
                        !!$obj.__interactonHover && !!$obj.__interactonClick,
                    )
                    .then((_) => {
                      $obj.__interactonHover &&
                        ($obj.interact(
                          $obj.__interactonHover,
                          $obj.__interactonClick,
                          obj.seoLink,
                          obj.seoText,
                        ),
                        delete $obj.__interactonClick,
                        delete $obj.__interactonHover);
                    }))
                : _this
                    .wait((_) => !!_this.parent[obj[key].slice(1)])
                    .then((_) => {
                      const interactHandle = _this.parent[obj[key].slice(1)];
                      let hoverFn = "onHover" === key ? interactHandle : null,
                        clickFn = "onClick" === key ? interactHandle : null;
                      $obj.interact(hoverFn, clickFn, obj.seoLink, obj.seoText);
                    });
            else if ("function" == typeof $obj[key]) {
              if ("size" == key) {
                let size = obj.size.split(",");
                (size.map((x) => Number(x)), $obj.size(size[0], size[1]));
                continue;
              }
              (1 === obj[key] && (obj[key] = void 0), callObjKeyVal(key));
            } else callObjKeyVal(key);
          }
      }
      function convertToUsableRef(str) {
        str.startsWith("$") && (str = str.slice(1));
        let ref = str,
          state = str;
        if (str.includes(".")) {
          let split = str.split(".");
          ((state = split[0]), split.shift(), (ref = split.join(".")));
        }
        return [state, ref];
      }
      function create(obj, parent, isDeferredPhase = !1) {
        if (isCustomComponentType(obj._type)) {
          if (propsRequireDefer(obj)) {
            if (!isDeferredPhase)
              return (
                (obj._placeholder = document.createElement("span")),
                void (parent.element || parent)?.add(obj._placeholder)
              );
          } else if (isDeferredPhase)
            return createChildren(obj, _createdObjs.get(obj), isDeferredPhase);
          let params = {},
            paramsState;
          for (let key in obj)
            if (
              "_type" !== key &&
              "refName" !== key &&
              "children" !== key &&
              "display" !== key &&
              "_placeholder" !== key &&
              "conditional" !== key
            )
              if (((params[key] = obj[key]), params[key].match?.(/\$(.*)\./))) {
                let [state, ref] = convertToUsableRef(params[key]);
                if (state == ref) params[key] = _this.parent[state];
                else if (
                  _this.parent[state]?.isAppState &&
                  ref.indexOf(".") < 0
                ) {
                  let [binds, text] = parseTextBindings(params[key]),
                    binding = (newValue) => {
                      paramsState
                        ? (paramsState[key] = newValue)
                        : (params[key] = newValue);
                    };
                  ((binding._string = text),
                    _this.parent.bindState(
                      _this.parent[state],
                      binds,
                      binding,
                    ));
                } else params[key] = getPropByString(_this.parent[state], ref);
              } else if (params[key].match?.(/\$(\w*)\/(\w*)/)) {
                let [binds, text] = parseTextGlobalBindings(params[key]),
                  binding = (newValue) => {
                    paramsState
                      ? (paramsState[key] = newValue)
                      : (params[key] = newValue);
                  };
                ((binding._string = text),
                  _this.parent.bindState(AppState, binds, binding));
              } else if (params[key].startsWith?.("$")) {
                let pk = params[key],
                  value = _this.parent[pk.slice(1)];
                null == value
                  ? ((params["wait_" + key] = _this
                      .wait(_this.parent, pk.slice(1))
                      .then((_) => _this.parent[pk.slice(1)])),
                    (params[key] = void 0))
                  : (params[key] = value);
              }
          "ViewState" == obj._type && (params.__parent = parent);
          let $obj = _this.parent.initClass(
            window[obj._type],
            (paramsState = AppState.createLocal(params, !0)),
            isDeferredPhase ? null : [parent.element || parent],
          );
          if (isDeferredPhase) {
            if ($obj.element) {
              obj._placeholder.replaceWith($obj.element.div);
              const $parent = parent.element || parent;
              ($parent &&
                ($parent._children.push($obj.element),
                ($obj.element._parent = $parent)),
                $obj.element.onMountedHook &&
                  defer((_) => {
                    ($obj.element.onMountedHook(),
                      delete $obj.element.onMountedHook);
                  }));
            } else obj._placeholder.parentNode.removeChild(obj._placeholder);
            delete obj._placeholder;
          }
          return (
            (_this.parent[obj.refName] = $obj),
            _createdObjs.set(obj, $obj),
            createChildren(obj, $obj, isDeferredPhase),
            void (
              params.css && $obj.element.css(parseCSSTransformStr(params.css))
            )
          );
        }
        if (isDeferredPhase)
          return createChildren(obj, _createdObjs.get(obj), isDeferredPhase);
        let $obj = doConstructor(obj);
        if (
          (void 0 !== obj.conditional &&
            _this.parent.state &&
            (_this.parent.state.get(obj.conditional)
              ? $obj.show?.()
              : $obj.hide?.(),
            _this.bindState(_this.parent.state, obj.conditional, (bool) => {
              bool ? $obj.show?.() : $obj.hide?.();
            })),
          obj.addTo)
        ) {
          let addTo =
            obj.addTo.includes(".") || "Stage" == obj.addTo
              ? eval(obj.addTo)
              : _this.parent.element;
          addTo.add($obj);
        } else parent && parent.add($obj);
        (applyValues(obj, $obj),
          $obj?.transform?.(),
          obj.refName && (_this.parent[obj.refName] = $obj),
          _createdObjs.set(obj, $obj),
          createChildren(obj, $obj, isDeferredPhase));
      }
      async function createChildren(obj, $obj, isDeferredPhase = !1) {
        (obj.children.forEach((o) => create(o, $obj, isDeferredPhase)),
          !isDeferredPhase &&
            obj === _obj &&
            anyChildrenRequireDefer(obj) &&
            (await defer(), obj.children.forEach((o) => create(o, $obj, !0))),
          obj === _obj && _createdObjs.clear());
      }
      function propsRequireDefer(obj) {
        if (isCustomComponentType(obj._type))
          for (let key in obj) {
            if (
              "_type" === key ||
              "refName" === key ||
              "children" === key ||
              "display" === key ||
              "_placeholder" === key
            )
              continue;
            let param = obj[key];
            if (param.startsWith?.("$")) return !0;
          }
        return !1;
      }
      function anyChildrenRequireDefer(obj) {
        return obj.children.some(
          (o) => !!propsRequireDefer(o) || anyChildrenRequireDefer(o),
        );
      }
      (_obj.addTo || "UI" == _obj._type || (_obj.addTo = "$element"),
        _root && applyValues(_root, _this.parent.element),
        create(_obj));
    },
    (_) => {
      FragUIHelper.SVG_ALIAS = new Map([
        ["acceptCharset", "accept-charset"],
        ["htmlFor", "for"],
        ["httpEquiv", "http-equiv"],
        ["crossOrigin", "crossorigin"],
        ["accentHeight", "accent-height"],
        ["alignmentBaseline", "alignment-baseline"],
        ["arabicForm", "arabic-form"],
        ["baselineShift", "baseline-shift"],
        ["capHeight", "cap-height"],
        ["clipPath", "clip-path"],
        ["clipRule", "clip-rule"],
        ["colorInterpolation", "color-interpolation"],
        ["colorInterpolationFilters", "color-interpolation-filters"],
        ["colorProfile", "color-profile"],
        ["colorRendering", "color-rendering"],
        ["dominantBaseline", "dominant-baseline"],
        ["enableBackground", "enable-background"],
        ["fillOpacity", "fill-opacity"],
        ["fillRule", "fill-rule"],
        ["floodColor", "flood-color"],
        ["floodOpacity", "flood-opacity"],
        ["fontFamily", "font-family"],
        ["fontSize", "font-size"],
        ["fontSizeAdjust", "font-size-adjust"],
        ["fontStretch", "font-stretch"],
        ["fontStyle", "font-style"],
        ["fontVariant", "font-variant"],
        ["fontWeight", "font-weight"],
        ["glyphName", "glyph-name"],
        ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
        ["glyphOrientationVertical", "glyph-orientation-vertical"],
        ["horizAdvX", "horiz-adv-x"],
        ["horizOriginX", "horiz-origin-x"],
        ["imageRendering", "image-rendering"],
        ["letterSpacing", "letter-spacing"],
        ["lightingColor", "lighting-color"],
        ["markerEnd", "marker-end"],
        ["markerMid", "marker-mid"],
        ["markerStart", "marker-start"],
        ["overlinePosition", "overline-position"],
        ["overlineThickness", "overline-thickness"],
        ["paintOrder", "paint-order"],
        ["panose-1", "panose-1"],
        ["pointerEvents", "pointer-events"],
        ["renderingIntent", "rendering-intent"],
        ["shapeRendering", "shape-rendering"],
        ["stopColor", "stop-color"],
        ["stopOpacity", "stop-opacity"],
        ["strikethroughPosition", "strikethrough-position"],
        ["strikethroughThickness", "strikethrough-thickness"],
        ["strokeDasharray", "stroke-dasharray"],
        ["strokeDashoffset", "stroke-dashoffset"],
        ["strokeLinecap", "stroke-linecap"],
        ["strokeLinejoin", "stroke-linejoin"],
        ["strokeMiterlimit", "stroke-miterlimit"],
        ["strokeOpacity", "stroke-opacity"],
        ["strokeWidth", "stroke-width"],
        ["textAnchor", "text-anchor"],
        ["textDecoration", "text-decoration"],
        ["textRendering", "text-rendering"],
        ["transformOrigin", "transform-origin"],
        ["underlinePosition", "underline-position"],
        ["underlineThickness", "underline-thickness"],
        ["unicodeBidi", "unicode-bidi"],
        ["unicodeRange", "unicode-range"],
        ["unitsPerEm", "units-per-em"],
        ["vAlphabetic", "v-alphabetic"],
        ["vHanging", "v-hanging"],
        ["vIdeographic", "v-ideographic"],
        ["vMathematical", "v-mathematical"],
        ["vectorEffect", "vector-effect"],
        ["vertAdvY", "vert-adv-y"],
        ["vertOriginX", "vert-origin-x"],
        ["vertOriginY", "vert-origin-y"],
        ["wordSpacing", "word-spacing"],
        ["writingMode", "writing-mode"],
        ["xmlnsXlink", "xmlns:xlink"],
        ["xHeight", "x-height"],
      ]);
    },
  ),
  Class(function XComponent() {
    const _this = this;
    var _state;
    function createState() {
      return (
        _state ||
        (((_state = AppState.createLocal())._bind = _state.bind),
        (_state.bind = function (key, callback) {
          _this.bindState(_state, key, callback);
        }),
        (_state.fire = function (key, value) {
          _state.set(key, value, !0);
        }),
        AppState.set(_this.fragName + "/state", _state),
        _state)
      );
    }
    ((_this.fragName = "overwritten in descendent"),
      (_this.contexts = "overwritten in descendent"),
      (_this.help = function () {
        (console.groupCollapsed(`Fragment ${_this.fragName} Overview`),
          console.log(`Your context(s) are: ${_this.contexts}`),
          console.log("You have access to the following $ methods:"));
        for (let key in _this)
          "_" != key.charAt(0) &&
            (key.includes([
              "flag",
              "initClass",
              "classes",
              "events",
              "parent",
              "findParent",
              "bindState",
            ]) ||
              console.log("$" + key));
        console.groupEnd();
      }),
      (_this.set = function (key, value) {
        (void 0 === value && (value = Utils.uuid()),
          key.includes("/") || (key = _this.fragName + "/" + key),
          AppState.set(key, value));
      }),
      (_this.fn = function (key, callback) {
        if (callback && "function" != typeof callback)
          throw "$fn requires callback to be a function";
        if (!callback) return _this.get(key);
        _this.set(key, callback);
      }),
      (_this.fire = function (key, value) {
        (void 0 === value && (value = Utils.uuid()),
          key.includes("/") || (key = _this.fragName + "/" + key),
          AppState.set(key, value, !0));
      }),
      (_this.bind = _this.listen =
        function (key, callback, ref) {
          if ("function" == typeof ref && "string" == typeof callback) {
            let rref = key;
            ((key = callback), (callback = ref), (ref = rref));
          }
          return ref
            ? (ref.state && ref.state.isAppState && (ref = ref.state),
              ref.isAppState
                ? _this.bindState(ref, key, callback)
                : _this.events.sub(ref, key, callback))
            : key.startsWith("hydra_")
              ? _this.events.sub(key, callback)
              : (key.includes("/") || (key = _this.fragName + "/" + key),
                _this.bindState(AppState, key, callback));
        }),
      (_this.get = function (key, noPromise) {
        key.includes("/") || (key = _this.fragName + "/" + key);
        let value = AppState.get(key);
        if (void 0 !== value || noPromise) return value;
        {
          let timer,
            promise = Promise.create();
          const cb = (_) => {
            ((value = AppState.get(key)),
              void 0 !== value &&
                (clearTimeout(timer), promise.resolve(value), Render.stop(cb)));
          };
          return (
            Render.start(cb, 24),
            Hydra.LOCAL &&
              (timer = _this.delayedCall((_) => {
                console.warn(`$get ${key} has timed out after 5 seconds`);
              }, 5e3)),
            promise
          );
        }
      }),
      _this.state ||
        Object.defineProperty(_this, "state", {
          set: function (v) {
            throw "Don't override state!";
          },
          get: function () {
            return createState();
          },
        }),
      (this.createUIL = function () {
        let input = InputUIL.create.apply(this, arguments),
          appState = AppState.createLocal();
        arguments[arguments.length - 1] == UIL.cms && (input.CMS = !0);
        let promise = Promise.create();
        return (
          (appState.ready = (_) => promise),
          (input.onUpdate = (key) => {
            let val = input.get(key);
            (isNaN(val) || (val = Number(val)),
              appState.set(key, val),
              promise &&
                defer((_) => {
                  (promise?.resolve(), (promise = null));
                }));
          }),
          [input, appState]
        );
      }),
      (this.requestData = Data.makeRequest),
      (this.fulfillDataRequest = Data.request),
      this._bindOnDestroy((_) => {
        (_state?.destroy?.(), AppState.clearKeysMatching(_this.fragName + "/"));
      }),
      (this.gl = window.$gl),
      (this.glText = window.$glText),
      (this.createState = createState),
      (this.createFragment = this.initClass),
      (_this.waitLayers = async (_) => {
        (_this.parent.layout?.getAllLayers &&
          (_this.layers = await _this.parent.layout.getAllLayers()),
          _this.parent?.getAllLayers &&
            (_this.layers = await _this.parent.getAllLayers()));
      }));
  }),
  Class(function DerivedState() {
    Inherit(this, Component);
    const _this = this;
    var _cb,
      _map = {};
    function update() {
      let truthy = !0;
      for (let key in _map) _map[key] || (truthy = !1);
      _cb(truthy);
    }
    ((this.bind = function (callback) {
      _cb = callback;
    }),
      (this.truthy = function (state, key, validator) {
        ("string" == typeof state &&
          ((validator = key), (key = state), (state = null)),
          key.includes("/") ||
            state ||
            (key = _this.parent.fragName + "/" + key),
          (state = state || AppState),
          _this.bindState(state, key, (bool) => {
            ((_map[key] = null != validator ? validator && !!bool : !!bool),
              update());
          }));
      }),
      (this.eq = function (state, key, statement) {
        ("string" == typeof state &&
          ((statement = key), (key = state), (state = null)),
          key.includes("/") ||
            state ||
            (key = _this.parent.fragName + "/" + key),
          (state = state || AppState),
          _this.bindState(state, key, (val) => {
            ((_map[key] = statement == val), update());
          }));
      }),
      (this.neq = function (state, key, statement) {
        ("string" == typeof state &&
          ((statement = key), (key = state), (state = null)),
          key.includes("/") ||
            state ||
            (key = _this.parent.fragName + "/" + key),
          (state = state || AppState),
          _this.bindState(state, key, (val) => {
            ((_map[key] = statement != val), update());
          }));
      }));
  }),
  Class(function LinkedList() {
    var prototype = LinkedList.prototype;
    ((this.length = 0),
      (this.first = null),
      (this.last = null),
      (this.current = null),
      (this.prev = null),
      "function" == typeof Symbol
        ? ((this.prevKey = Symbol("prev")), (this.nextKey = Symbol("next")))
        : ((this.prevKey = "__prev"), (this.nextKey = "__next")),
      void 0 === prototype.push &&
        ((prototype.push = function (obj) {
          (obj[this.nextKey] && this.remove(obj),
            this.first
              ? ((obj[this.nextKey] = this.first),
                (obj[this.prevKey] = this.last),
                (this.last[this.nextKey] = obj),
                (this.last = obj))
              : ((this.first = obj),
                (this.last = obj),
                (obj[this.prevKey] = obj),
                (obj[this.nextKey] = obj)),
            this.length++);
        }),
        (prototype.remove = function (obj) {
          obj &&
            obj[this.nextKey] &&
            (this.length <= 1
              ? this.empty()
              : (obj == this.first
                  ? ((this.first = obj[this.nextKey]),
                    (this.last[this.nextKey] = this.first),
                    (this.first[this.prevKey] = this.last))
                  : obj == this.last
                    ? ((this.last = obj[this.prevKey]),
                      (this.last[this.nextKey] = this.first),
                      (this.first[this.prevKey] = this.last))
                    : ((obj[this.prevKey][this.nextKey] = obj[this.nextKey]),
                      (obj[this.nextKey][this.prevKey] = obj[this.prevKey])),
                this.length--),
            (obj[this.prevKey] = null),
            (obj[this.nextKey] = null));
        }),
        (prototype.empty = function () {
          ((this.first = null),
            (this.last = null),
            (this.current = null),
            (this.prev = null),
            (this.length = 0));
        }),
        (prototype.start = function () {
          return (
            (this.current = this.first),
            (this.prev = this.current),
            this.current
          );
        }),
        (prototype.next = function () {
          if (
            this.current &&
            ((this.current = this.current[this.nextKey]),
            1 != this.length && this.prev[this.nextKey] != this.first)
          )
            return ((this.prev = this.current), this.current);
        }),
        (prototype.destroy = function () {
          return (Utils.nullObject(this), null);
        })));
  }),
  Class(function ObjectPool(_type, _number = 10) {
    var _pool = [];
    ((this.array = _pool),
      (function () {
        if (_type) for (var i = 0; i < _number; i++) _pool.push(new _type());
      })(),
      (this.get = function () {
        return _pool.shift() || (_type ? new _type() : null);
      }),
      (this.empty = function () {
        _pool.length = 0;
      }),
      (this.put = function (obj) {
        obj && !_pool.includes(obj) && _pool.push(obj);
      }),
      (this.insert = function (array) {
        void 0 === array.push && (array = [array]);
        for (var i = 0; i < array.length; i++) this.put(array[i]);
      }),
      (this.length = function () {
        return _pool.length;
      }),
      (this.randomize = function () {
        let array = _pool;
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }),
      (this.destroy = function () {
        for (let i = _pool.length - 1; i >= 0; i--)
          _pool[i].destroy && _pool[i].destroy();
        return (_pool = null);
      }));
  }),
  Class(function Gate() {
    var _list = [],
      _map = {};
    ((this.create = function (name) {
      let promise = Promise.create();
      name ? (_map[name] = promise) : _list.push(promise);
    }),
      (this.open = function (name) {
        name &&
          (_map[name] || (_map[name] = Promise.create()), _map[name].resolve());
        let promise = _list.shift();
        promise && promise.resolve();
      }),
      (this.wait = function (name) {
        return _list.length || name
          ? name
            ? (_map[name] || (_map[name] = Promise.create()), _map[name])
            : _list[_list.length - 1] || Promise.resolve()
          : Promise.resolve();
      }));
  }, "static"),
  Class(function Assets() {
    const _this = this;
    function AssetList(arr) {
      return ((arr.__proto__ = AssetList.prototype), arr);
    }
    ((this.__loaded = []),
      (this.FLIPY = !0),
      (this.CDN = window.HYDRA_ASSETS_CDN ?? ""),
      (this.CORS = "anonymous"),
      (this.IMAGES = {}),
      (this.VIDEOS = {}),
      (this.AUDIOS = {}),
      (this.SDF = {}),
      (this.JSON = {
        push: function (prop, value) {
          ((this[prop] = value),
            Object.defineProperty(this, prop, {
              get: () => JSON.parse(JSON.stringify(value)),
            }));
        },
      }),
      Object.defineProperty(this.JSON, "push", {
        enumerable: !1,
        writable: !0,
      }),
      (this.SVG = {}),
      (AssetList.prototype = new Array()),
      (AssetList.prototype.filter = function (items) {
        for (let i = this.length - 1; i >= 0; i--)
          this[i].includes(items) || this.splice(i, 1);
        return this;
      }),
      (AssetList.prototype.exclude = function (items) {
        for (let i = this.length - 1; i >= 0; i--)
          this[i].includes(items) && this.splice(i, 1);
        return this;
      }),
      (AssetList.prototype.prepend = function (prefix) {
        for (let i = this.length - 1; i >= 0; i--) this[i] = prefix + this[i];
        return this;
      }),
      (AssetList.prototype.append = function (suffix) {
        for (let i = this.length - 1; i >= 0; i--) this[i] = this[i] + suffix;
        return this;
      }),
      (this.list = function () {
        return (
          window.ASSETS || console.warn("ASSETS list not available"),
          new AssetList(window.ASSETS.slice(0) || [])
        );
      }),
      (this.BASE_PATH = window.HYDRA_ASSETS_BASE_PATH || ""),
      (this.getPath = function (path) {
        if (path.includes("~")) return _this.BASE_PATH + path.replace("~", "");
        if (path.includes("//")) return path;
        if (
          ((path = (function parseResolution(path) {
            if (!window.ASSETS || !ASSETS.RES) return path;
            var res = ASSETS.RES[path],
              ratio = Math.min(Device.pixelRatio, 3);
            if (!res) return path;
            if (!res["x" + ratio]) return path;
            var split = path.split("/"),
              file = split[split.length - 1];
            return (
              (split = file.split(".")),
              path.replace(file, split[0] + "-" + ratio + "x." + split[1])
            );
          })(path)),
          _this.replacementPaths)
        )
          for (let pathKey in _this.replacementPaths)
            if (path.startsWith(pathKey))
              return (path = path.replace(
                pathKey,
                _this.replacementPaths[pathKey],
              ));
        if (_this.dictionary)
          for (let pathKey in _this.dictionary)
            if (_this.dictionary[pathKey].includes(path.split("?")[0]))
              return pathKey + path;
        return (
          this.CDN && !~path.indexOf(this.CDN) && (path = this.CDN + path),
          path
        );
      }),
      (this.registerPathReplacement = function (path, replacedPath) {
        (_this.replacementPaths || (_this.replacementPaths = {}),
          (_this.replacementPaths[path] = replacedPath));
      }),
      (this.registerPath = function (path, assets) {
        (_this.dictionary || (_this.dictionary = {}),
          (_this.dictionary[path] = assets));
      }),
      (this.loadImage = function (path, isStore) {
        var img = new Image();
        return (
          (img.crossOrigin = this.CORS),
          (img.src = _this.getPath(path)),
          (img.loadPromise = function () {
            let promise = Promise.create();
            return ((img.onload = promise.resolve), promise);
          }),
          isStore && (this.IMAGES[path] = img),
          img
        );
      }),
      (this.decodeImage = function (path, params, promise) {
        promise || (promise = Promise.create());
        let img = _this.loadImage(path);
        return (
          (img.onload = () => promise.resolve(img)),
          (img.onerror = () =>
            _this.decodeImage(
              "assets/images/_scenelayout/uv.jpg",
              params,
              promise,
            )),
          promise
        );
      }));
    const _supportsWebP = (function () {
      try {
        return (
          0 ==
          document
            .createElement("canvas")
            .toDataURL("image/webp")
            .indexOf("data:image/webp")
        );
      } catch (e) {
        return !1;
      }
    })();
    ((this.supportsWebP = function () {
      return !!_supportsWebP;
    }),
      (this.perfImage = function (path) {
        let result = path;
        return (
          _this.supportsWebP() &&
            path.includes([".jpg", ".png"]) &&
            (result = `${path.substring(0, path.lastIndexOf("."))}.webp`),
          result
        );
      }));
  }, "static"),
  Class(
    function AssetLoader(_assets, _callback, ASSETS = Assets) {
      Inherit(this, Events);
      const _this = this;
      let _total = _assets.length,
        _loaded = 0,
        _lastFiredPercent = 0;
      function loadAsset() {
        let path = _assets.splice(_assets.length - 1, 1)[0];
        const name = path.split("assets/").last().split(".")[0],
          ext = path.split(".").last().split("?")[0].toLowerCase();
        let timeout = Timer.create(timedOut, AssetLoader.TIMEOUT, path);
        if (!Assets.preventCache && ~Assets.__loaded.indexOf(path))
          return loaded();
        if (ext.includes(["jpg", "jpeg", "png", "gif"])) {
          let image = ASSETS.loadImage(path);
          return image.complete
            ? loaded()
            : ((image.onload = loaded), void (image.onerror = loaded));
        }
        function loaded() {
          (timeout && clearTimeout(timeout),
            increment(),
            _assets.length && loadAsset());
        }
        ext.includes(["mp4", "webm"])
          ? fetch(path)
              .then(async (response) => {
                let blob = await response.blob();
                ((Assets.VIDEOS[name] = URL.createObjectURL(blob)), loaded());
              })
              .catch((e) => {
                (console.warn(e), loaded());
              })
          : ext.includes(["mp3"])
            ? fetch(path)
                .then(async (response) => {
                  let blob = await response.blob();
                  ((Assets.AUDIOS[name] = URL.createObjectURL(blob)), loaded());
                })
                .catch((e) => {
                  (console.warn(e), loaded());
                })
            : get(Assets.getPath(path), Assets.HEADERS)
                .then((data) => {
                  (Assets.__loaded.push(path),
                    "json" == ext && ASSETS.JSON.push(name, data),
                    "svg" == ext && (ASSETS.SVG[name] = data),
                    "fnt" == ext && (ASSETS.SDF[name.split("/")[1]] = data),
                    "js" == ext && window.eval(data),
                    ext.includes(["fs", "vs", "glsl"]) &&
                      window.Shaders &&
                      Shaders.parse(data, path),
                    loaded());
                })
                .catch((e) => {
                  (console.warn(e), loaded());
                });
      }
      function increment() {
        let percent = Math.max(
          _lastFiredPercent,
          Math.min(1, ++_loaded / _total),
        );
        (_this.events.fire(Events.PROGRESS, { percent: percent }),
          (_lastFiredPercent = percent),
          _loaded >= _total && defer(complete));
      }
      function complete() {
        _this.completed ||
          ((_this.completed = !0),
          defer(() => {
            (_callback && _callback(), _this.events.fire(Events.COMPLETE));
          }));
      }
      function timedOut(path) {
        console.warn("Asset timed out", path);
      }
      (!(function () {
        if (!Array.isArray(_assets))
          throw "AssetLoader requires array of assets to load";
        ((_assets = _assets.slice(0).reverse()),
          (function init() {
            if (!_assets.length) return complete();
            for (let i = 0; i < AssetLoader.SPLIT; i++)
              _assets.length && loadAsset();
          })());
      })(),
        (this.loadModules = function () {
          if (!window._BUILT_) return;
          this.add(1);
          let module = window._ES5_ ? "es5-modules" : "modules",
            src = window._CACHE_
              ? "assets/js/" + module + "." + window._CACHE_ + ".js"
              : "assets/js/" + module + ".js";
          src = Assets.getPath(src);
          let s = document.createElement("link");
          return (
            (s.href = src),
            (s.rel = "preload"),
            (s.as = "script"),
            document.head.appendChild(s),
            (s = document.createElement("script")),
            (s.src = src),
            (s.async = !0),
            document.head.appendChild(s),
            AssetLoader.waitForLib("_MODULES_").then((_) => _this.trigger(1))
          );
        }),
        (this.add = function (num) {
          _total += num || 1;
        }),
        (this.trigger = function (num) {
          for (let i = 0; i < (num || 1); i++) increment();
        }));
    },
    () => {
      ((AssetLoader.SPLIT = 2),
        (AssetLoader.TIMEOUT = 5e3),
        (AssetLoader.loadAllAssets = function (callback) {
          let promise = Promise.create();
          return (
            callback || (callback = promise.resolve),
            (promise.loader = new AssetLoader(Assets.list(), () => {
              (callback && callback(),
                promise.loader &&
                  promise.loader.destroy &&
                  (promise.loader = promise.loader.destroy()));
            })),
            promise
          );
        }),
        (AssetLoader.loadAssets = function (list, callback) {
          let promise = Promise.create();
          return (
            callback || (callback = promise.resolve),
            (promise.loader = new AssetLoader(list, () => {
              (callback && callback(),
                promise.loader &&
                  promise.loader.destroy &&
                  (promise.loader = promise.loader.destroy()));
            })),
            promise
          );
        }),
        (AssetLoader.waitForLib = function (name, callback) {
          let promise = Promise.create();
          return (
            callback || (callback = promise.resolve),
            Render.start(function check() {
              window[name] && (Render.stop(check), callback && callback());
            }),
            promise
          );
        }),
        (AssetLoader.waitForModules = function () {
          return AssetLoader.waitForLib(
            window._BUILT_ ? "_MODULES_" : "zUtils3D",
          );
        }));
    },
  ),
  (function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
      ? t(exports)
      : "function" == typeof define && define.amd
        ? define(["exports"], t)
        : t(((e = e || self).goober = {}));
  })(this, function (e) {
    let t = { data: "" },
      n = (e) =>
        "undefined" != typeof window
          ? (
              (e ? e.querySelector("#_goober") : window._goober) ||
              Object.assign(
                (e || document.head).appendChild(
                  document.createElement("style"),
                ),
                { innerHTML: " ", id: "_goober" },
              )
            ).firstChild
          : e || t,
      o = /(?:([A-Z0-9-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(})/gi,
      r = /\/\*[^]*?\*\/|\s\s+|\n/g,
      l = (e, t) => {
        let n,
          o = "",
          r = "",
          a = "";
        for (let s in e) {
          let c = e[s];
          "object" == typeof c
            ? ((n = t
                ? t.replace(/([^,])+/g, (e) =>
                    s.replace(/([^,])+/g, (t) =>
                      /&/.test(t) ? t.replace(/&/g, e) : e ? e + " " + t : t,
                    ),
                  )
                : s),
              (r +=
                "@" == s[0]
                  ? "f" == s[1]
                    ? l(c, s)
                    : s + "{" + l(c, "k" == s[1] ? "" : t) + "}"
                  : l(c, n)))
            : "@" == s[0] && "i" == s[1]
              ? (o = s + " " + c + ";")
              : ((s = s.replace(/[A-Z]/g, "-$&").toLowerCase()),
                (a += l.p ? l.p(s, c) : s + ":" + c + ";"));
        }
        return a[0] ? ((n = t ? t + "{" + a + "}" : a), o + n + r) : o + r;
      },
      a = {},
      s = (e) => {
        let t = "";
        for (let n in e) t += n + ("object" == typeof e[n] ? s(e[n]) : e[n]);
        return t;
      },
      c = (e, t, n, c, i) => {
        let f = "object" == typeof e ? s(e) : e,
          p =
            a[f] ||
            (a[f] = ((e) => {
              let t = 0,
                n = 11;
              for (; t < e.length; ) n = (101 * n + e.charCodeAt(t++)) >>> 0;
              return "go" + n;
            })(f));
        if (!a[p]) {
          let t =
            "object" == typeof e
              ? e
              : ((e) => {
                  let t,
                    n = [{}];
                  for (; (t = o.exec(e.replace(r, ""))); )
                    (t[4] && n.shift(),
                      t[3]
                        ? n.unshift((n[0][t[3]] = n[0][t[3]] || {}))
                        : t[4] || (n[0][t[1]] = t[2]));
                  return n[0];
                })(e);
          a[p] = l(i ? { ["@keyframes " + p]: t } : t, n ? "" : "." + p);
        }
        return (
          ((e, t, n) => {
            -1 == t.data.indexOf(e) && (t.data = n ? e + t.data : t.data + e);
          })(a[p], t, c),
          p
        );
      };
    function f(e) {
      let t = this || {},
        o = e.call ? e(t.p) : e;
      return c(
        o.unshift
          ? o.raw
            ? ((e, t, n) =>
                e.reduce((e, o, r) => {
                  let a = t[r];
                  if (a && a.call) {
                    let e = a(n),
                      t =
                        (e && e.props && e.props.className) ||
                        (/^go/.test(e) && e);
                    a = t
                      ? "." + t
                      : e && "object" == typeof e
                        ? e.props
                          ? ""
                          : l(e, "")
                        : e;
                  }
                  return e + o + (null == a ? "" : a);
                }, ""))(o, [].slice.call(arguments, 1), t.p)
            : o.reduce(
                (e, n) => (n ? Object.assign(e, n.call ? n(t.p) : n) : e),
                {},
              )
          : o,
        n(t.target),
        t.g,
        t.o,
        t.k,
      );
    }
    let p,
      d,
      u,
      g = f.bind({ g: 1 }),
      b = f.bind({ k: 1 });
    ((e.css = f),
      (e.extractCss = (e) => {
        let t = n(e),
          o = t.data;
        return ((t.data = ""), o);
      }),
      (e.glob = g),
      (e.keyframes = b),
      (e.setup = function (e, t, n, o) {
        ((l.p = t), (p = e), (d = n), (u = o));
      }),
      (e.styled = function (e, t) {
        let n = this || {};
        return function () {
          let o = arguments;
          function r(l, a) {
            let s = Object.assign({}, l),
              c = s.className || r.className;
            ((n.p = Object.assign({ theme: d && d() }, s)),
              (n.o = / *go\d+/.test(c)),
              (s.className = f.apply(n, o) + (c ? " " + c : "")),
              t && (s.ref = a));
            let i = s.as || e;
            return (u && i[0] && u(s), p(i, s));
          }
          return t ? t(r) : r;
        };
      }));
  }),
  (function (i, n) {
    "object" == typeof exports && "undefined" != typeof module
      ? n(exports)
      : "function" == typeof define && define.amd
        ? define(["exports"], n)
        : n(((i = i || self).gooberPrefixer = {}));
  })(this, function (i) {
    var n = new Map([
      ["align-self", "-ms-grid-row-align"],
      ["color-adjust", "-webkit-print-color-adjust"],
      ["column-gap", "grid-column-gap"],
      ["gap", "grid-gap"],
      ["grid-template-columns", "-ms-grid-columns"],
      ["grid-template-rows", "-ms-grid-rows"],
      ["justify-self", "-ms-grid-column-align"],
      ["margin-inline-end", "-webkit-margin-end"],
      ["margin-inline-start", "-webkit-margin-start"],
      ["overflow-wrap", "word-wrap"],
      ["padding-inline-end", "-webkit-padding-end"],
      ["padding-inline-start", "-webkit-padding-start"],
      ["row-gap", "grid-row-gap"],
      ["scroll-margin-bottom", "scroll-snap-margin-bottom"],
      ["scroll-margin-left", "scroll-snap-margin-left"],
      ["scroll-margin-right", "scroll-snap-margin-right"],
      ["scroll-margin-top", "scroll-snap-margin-top"],
      ["scroll-margin", "scroll-snap-margin"],
      ["text-combine-upright", "-ms-text-combine-horizontal"],
    ]);
    i.prefix = function (i, r) {
      let t = "";
      const e = n.get(i);
      e && (t += `${e}:${r};`);
      const o = (function (i) {
        var n =
          /^(?:(text-(?:decoration$|e|or|si)|back(?:ground-cl|d|f)|box-d|(?:mask(?:$|-[ispro]|-cl)))|(tab-|column(?!-s)|text-align-l)|(ap)|(u|hy))/i.exec(
            i,
          );
        return n ? (n[1] ? 1 : n[2] ? 2 : n[3] ? 3 : 5) : 0;
      })(i);
      (1 & o && (t += `-webkit-${i}:${r};`),
        2 & o && (t += `-moz-${i}:${r};`),
        4 & o && (t += `-ms-${i}:${r};`));
      const a = (function (i, n) {
        var r =
          /^(?:(pos)|(background-i)|((?:max-|min-)?(?:block-s|inl|he|widt))|(dis))/i.exec(
            i,
          );
        return r
          ? r[1]
            ? /^sti/i.test(n)
              ? 1
              : 0
            : r[2]
              ? /^image-/i.test(n)
                ? 1
                : 0
              : r[3]
                ? "-" === n[3]
                  ? 2
                  : 0
                : /^(inline-)?grid$/i.test(n)
                  ? 4
                  : 0
          : 0;
      })(i, r);
      return (
        1 & a
          ? (t += `${i}:-webkit-${r};`)
          : 2 & a
            ? (t += `${i}:-moz-${r};`)
            : 4 & a && (t += `${i}:-ms-${r};`),
        (t += `${i}:${r};`),
        t
      );
    };
  }),
  (function (e, o) {
    "object" == typeof exports && "undefined" != typeof module
      ? o(exports, require("goober"))
      : "function" == typeof define && define.amd
        ? define(["exports", "goober"], o)
        : o(((e = e || self).gooberGlobal = {}), e.goober);
  })(this, function (e, o) {
    let n = o.css.bind({ g: 1 });
    ((e.createGlobalStyles = function () {
      const e = o.styled.call({ g: 1 }, "div").apply(null, arguments);
      return function (o) {
        return (e(o), null);
      };
    }),
      (e.glob = n));
  }),
  Hydra.ready(function () {
    if (
      ((window.__window = $(window)),
      (window.__document = $(document)),
      (window.__body = $(document.getElementsByTagName("body")[0])),
      (window.Stage =
        window.Stage && window.Stage.style
          ? $(window.Stage)
          : __body.create("#Stage")),
      window.HYDRA_MOBILE_SCROLL && Device.mobile)
    ) {
      ((Stage.isNormalMobileScroll = !0), Stage.size("100%", "100vh"));
      const resizeObserver = new ResizeObserver((entries) => {
        let size = entries[0].contentRect || entries[0].contentBoxSize;
        ((Stage.width = size.width),
          (Stage.height = size.height),
          resizeObserver.unobserve(Stage.div));
      });
      resizeObserver.observe(Stage.div);
    } else Stage.size("100%");
    ((Stage.__useFragment = !0),
      (Stage.width =
        window.innerWidth ||
        document.body.clientWidth ||
        document.documentElement.offsetWidth),
      (Stage.height =
        (Stage.isNormalMobileScroll && Stage.div.offsetHeight) ||
        window.innerHeight ||
        document.body.clientHeight ||
        document.documentElement.offsetHeight));
  }),
  Class(function HydraCSS() {
    var _tag,
      _obj,
      _style,
      _needsUpdate,
      _this = this;
    function objToCSS(key) {
      var match = key.match(/[A-Z]/),
        camelIndex = match ? match.index : null;
      if (camelIndex) {
        var start = key.slice(0, camelIndex),
          end = key.slice(camelIndex);
        key = start + "-" + end.toLowerCase();
      }
      return key;
    }
    function setHTML() {
      ((_tag.innerHTML = _style), (_needsUpdate = !1));
    }
    (Hydra.ready(function () {
      ((_obj = {}),
        (_style = ""),
        ((_tag = document.createElement("style")).type = "text/css"),
        document.getElementsByTagName("head")[0].appendChild(_tag));
    }),
      (this._read = function () {
        return _style;
      }),
      (this._write = function (css) {
        ((_style = css), _needsUpdate || ((_needsUpdate = !0), defer(setHTML)));
      }),
      (this.style = function (selector, obj = {}) {
        (_obj[selector] || (_obj[selector] = {}),
          Object.assign(_obj[selector], obj),
          (function render() {
            var s = "";
            for (let selector in _obj) {
              let obj = _obj[selector];
              for (var key in ((s += `${selector} {`), obj)) {
                var prop = objToCSS(key),
                  val = obj[key];
                ("string" != typeof val && "opacity" != key && (val += "px"),
                  (s += prop + ":" + val + "!important;"));
              }
              s += "}";
            }
            _this._write(s);
          })());
      }),
      (this.get = function (selector, prop) {
        if (!_obj[selector]) return prop ? null : {};
        let obj = Object.assign({}, _obj[selector]);
        return prop ? obj[prop] : obj;
      }),
      (this.textSize = function ($obj) {
        var $clone = $obj.clone();
        ($clone.css({
          position: "relative",
          cssFloat: "left",
          styleFloat: "left",
          marginTop: -99999,
          width: "",
          height: "",
        }),
          __body.addChild($clone));
        var width = $clone.div.offsetWidth,
          height = $clone.div.offsetHeight;
        return ($clone.remove(), { width: width, height: height });
      }),
      (this.prefix = function (style) {
        return "" == _this.styles.vendor
          ? style.charAt(0).toLowerCase() + style.slice(1)
          : _this.styles.vendor + style;
      }),
      (this._toCSS = objToCSS));
  }, "Static"),
  Class(
    function HydraObject(_selector, _type, _exists, _useFragment) {
      ((this._children = new LinkedList()),
        this._onDestroy,
        (this.__useFragment = _useFragment),
        this._initSelector(_selector, _type, _exists));
    },
    () => {
      var prototype = HydraObject.prototype;
      const svgElements = [
        "svg",
        "path",
        "rect",
        "circle",
        "filter",
        "clippath",
        "clipPath",
        "ellipse",
        "image",
        "mask",
        "polygon",
        "g",
        "animate",
        "line",
        "linearGradient",
        "marker",
        "mpath",
        "polyline",
        "set",
        "stop",
        "text",
        "defs",
        "use",
      ];
      ((prototype._initSelector = function (_selector, _type, _exists) {
        if (_selector && "string" != typeof _selector) this.div = _selector;
        else {
          var first = _selector ? _selector.charAt(0) : null,
            name = _selector ? _selector.slice(1) : null;
          if (
            ("." != first &&
              "#" != first &&
              ((name = _selector), (first = ".")),
            _exists)
          ) {
            if ("#" != first) throw "Hydra Selectors Require #ID";
            this.div = document.getElementById(name);
          } else
            ((this._type = _type || "div"),
              svgElements.includes(this._type)
                ? ((this.div = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    this._type,
                  )),
                  "svg" === this._type &&
                    this.div.setAttributeNS(
                      "http://www.w3.org/2000/xmlns/",
                      "xmlns:xlink",
                      "http://www.w3.org/1999/xlink",
                    ))
                : (this.div = document.createElement(this._type)),
              first &&
                ("#" === first
                  ? (this.div.id = name)
                  : "unnamed" !== name &&
                    (this.div.className.baseVal
                      ? (this.div.className.baseVal = name)
                      : (this.div.className = name))));
        }
        this.div.hydraObject = this;
      }),
        (prototype.add = function (child, before = null) {
          this.div;
          var _this = this,
            doInsertChild = function (childDiv) {
              (before &&
                (before.element && before.element instanceof HydraObject
                  ? (before = before.element.div)
                  : before.div
                    ? (before = before.div)
                    : before.nodeName || (before = null)),
                before && before.parentNode !== _this.div && (before = null),
                _this.div.insertBefore(childDiv, before));
            },
            insertChild = function (childDiv) {
              _this.__useFragment
                ? (_this._fragment ||
                    ((_this._fragment = document.createDocumentFragment()),
                    defer(function () {
                      if (!_this._fragment || !_this.div)
                        return void delete _this._fragment;
                      const hydraObjectsWithMountedHooks = Array.prototype.map
                        .call(
                          _this._fragment.childNodes,
                          (childDiv) => childDiv.hydraObject,
                        )
                        .filter(($child) => $child?.onMountedHook);
                      if (
                        Array.prototype.every.call(
                          _this._fragment.childNodes,
                          (childDiv) => !childDiv._fragmentBefore,
                        )
                      )
                        _this.div.appendChild(_this._fragment);
                      else
                        for (; _this._fragment.childNodes.length; )
                          ((childDiv = _this._fragment.childNodes[0]),
                            (before = childDiv._fragmentBefore),
                            delete childDiv._fragmentBefore,
                            doInsertChild(childDiv));
                      (delete _this._fragment,
                        defer((_) => {
                          hydraObjectsWithMountedHooks.forEach(($child) => {
                            ($child.onMountedHook(),
                              delete $child.onMountedHook);
                          });
                        }));
                    })),
                  _this._fragment.appendChild(childDiv),
                  (childDiv._fragmentBefore = before))
                : (doInsertChild(childDiv),
                  childDiv.hydraObject?.onMountedHook &&
                    defer((_) => {
                      childDiv.hydraObject?.onMountedHook &&
                        (childDiv.hydraObject.onMountedHook(),
                        delete childDiv.hydraObject.onMountedHook);
                    }));
            };
          return (
            child.element && child.element instanceof HydraObject
              ? (insertChild(child.element.div),
                this._children.push(child.element),
                (child.element._parent = this),
                (child.element.div.parentNode = this.div))
              : child.div
                ? (insertChild(child.div),
                  this._children.push(child),
                  (child._parent = this),
                  (child.div.parentNode = this.div))
                : child.nodeName &&
                  (insertChild(child), (child.parentNode = this.div)),
            this
          );
        }),
        (prototype.clone = function () {
          return $(this.div.cloneNode(!0));
        }),
        (prototype.create = function (name, type) {
          var $obj = $(name, type);
          return (this.add($obj), $obj);
        }),
        (prototype.empty = function () {
          for (var child = this._children.start(); child; ) {
            var next = this._children.next();
            (child && child.remove && child.remove(), (child = next));
          }
          return ((this.div.innerHTML = ""), this);
        }),
        (prototype.parent = function () {
          return this._parent;
        }),
        (prototype.children = function (isHydraChildren = !1) {
          let children = this.div.children
            ? this.div.children
            : this.div.childNodes;
          if (isHydraChildren) {
            children = [];
            for (var child = this._children.start(); child; )
              child && (children.push(child), (child = this._children.next()));
          }
          return children;
        }),
        (prototype.removeChild = function (object, keep) {
          try {
            object.div.parentNode.removeChild(object.div);
          } catch (e) {}
          keep || this._children.remove(object);
        }),
        (prototype.remove = function (param) {
          (param &&
            console.warn(
              "HydraObject.remove removes ITSELF from its parent. use removeChild instead",
            ),
            this._onDestroy && this._onDestroy.forEach((cb) => cb()),
            (this.removed = !0),
            this.clearInteract(),
            this.clearBind());
          var parent = this._parent;
          parent &&
            !parent.removed &&
            parent.removeChild &&
            parent.removeChild(this, !0);
          for (var child = this._children.start(); child; ) {
            var next = this._children.next();
            (child && child.remove && child.remove(), (child = next));
          }
          (this._children.destroy(),
            (this.div.hydraObject = null),
            Utils.nullObject(this));
        }),
        (prototype.destroy = function () {
          this.remove();
        }),
        (prototype._bindOnDestroy = function (cb) {
          (this._onDestroy || (this._onDestroy = []), this._onDestroy.push(cb));
        }),
        (window.$ = function (selector, type, exists) {
          return new HydraObject(selector, type, exists);
        }),
        ($.fn = HydraObject.prototype));
    },
  ),
  (function () {
    const cursorLockIdProp =
      "function" == typeof Symbol ? Symbol("cursorLockId") : "_cursorLockId";
    (($.fn.text = function (text) {
      return void 0 !== text
        ? (this.__cacheText != text && (this.div.textContent = text),
          (this.__cacheText = text),
          this)
        : this.div.textContent;
    }),
      ($.fn.html = function (text, force) {
        return !text || text.includes("<") || force
          ? void 0 !== text
            ? ((this.div.innerHTML = text), this)
            : this.div.innerHTML
          : this.text(text);
      }),
      ($.fn.hide = function () {
        return ((this.div.style.display = "none"), this);
      }),
      ($.fn.show = function () {
        return ((this.div.style.display = ""), this);
      }),
      ($.fn.visible = function () {
        return ((this.div.style.visibility = "visible"), this);
      }),
      ($.fn.invisible = function () {
        return ((this.div.style.visibility = "hidden"), this);
      }),
      ($.fn.setZ = function (z) {
        return ((this.div.style.zIndex = z), this);
      }),
      ($.fn.clearAlpha = function () {
        return ((this.div.style.opacity = ""), this);
      }),
      ($.fn.size = function (w, h, noScale) {
        return (
          "string" == typeof w
            ? (void 0 === h
                ? (h = "100%")
                : "string" != typeof h && (h += "px"),
              (this.div.style.width = w),
              (this.div.style.height = h))
            : ((this.div.style.width = w + "px"),
              (this.div.style.height = h + "px"),
              noScale ||
                (this.div.style.backgroundSize = w + "px " + h + "px")),
          (this.width = w),
          (this.height = h),
          this
        );
      }),
      ($.fn.mouseEnabled = function (bool) {
        return ((this.div.style.pointerEvents = bool ? "auto" : "none"), this);
      }),
      ($.fn.fontStyle = function (family, size, color, style) {
        var font = {};
        return (
          family && (font.fontFamily = family),
          size && (font.fontSize = size),
          color && (font.color = color),
          style && (font.fontStyle = style),
          this.css(font),
          this
        );
      }),
      ($.fn.font = function (font) {
        return (this.css("font", font), this);
      }),
      ($.fn.bg = function (src, x, y, repeat) {
        return src
          ? (src.includes(".") && (src = Assets.getPath(src)),
            src.includes(".")
              ? (this.div.style.backgroundImage = "url(" + src + ")")
              : (this.div.style.backgroundColor = src),
            void 0 !== x &&
              ((x = "number" == typeof x ? x + "px" : x),
              (y = "number" == typeof y ? y + "px" : y),
              (this.div.style.backgroundPosition = x + " " + y)),
            repeat &&
              ((this.div.style.backgroundSize = ""),
              (this.div.style.backgroundRepeat = repeat)),
            ("cover" != x && "contain" != x) ||
              ((this.div.style.backgroundSize = x),
              (this.div.style.backgroundPosition =
                void 0 !== y ? y + " " + repeat : "center")),
            this)
          : this;
      }),
      ($.fn.svgMask = function (src) {
        return src
          ? (src.includes(".") && (src = Assets.getPath(src)),
            (this.div.style.maskImage = `url(${src})`),
            (this.div.style.webkitMaskImage = `url(${src})`),
            this)
          : this;
      }),
      ($.fn.center = function (x, y, noPos) {
        var css = {};
        return (
          void 0 === x
            ? ((css.left = "50%"),
              (css.top = "50%"),
              (css.marginLeft = -this.width / 2),
              (css.marginTop = -this.height / 2))
            : (x && ((css.left = "50%"), (css.marginLeft = -this.width / 2)),
              y && ((css.top = "50%"), (css.marginTop = -this.height / 2))),
          noPos && (delete css.left, delete css.top),
          this.css(css),
          this
        );
      }),
      ($.fn.max = function (width, height) {
        let w, h;
        return (
          void 0 !== width &&
            ((w = "number" == typeof width ? width + "px" : width),
            (this.div.style.maxWidth = w)),
          void 0 !== height
            ? ((h = "number" == typeof height ? height + "px" : height),
              (this.div.style.maxHeight = h))
            : ((h = w), (this.div.style.maxHeight = h)),
          this
        );
      }),
      ($.fn.min = function (width, height) {
        let w, h;
        return (
          void 0 !== width &&
            ((w = "number" == typeof width ? width + "px" : width),
            (this.div.style.minWidth = w)),
          void 0 !== height
            ? ((h = "number" == typeof height ? height + "px" : height),
              (this.div.style.minHeight = h))
            : ((h = w), (this.div.style.minHeight = h)),
          this
        );
      }),
      ($.fn.flex = function (inline) {
        return (
          (this.div.style.display = inline ? "inline-flex" : "flex"),
          (this.div.style.justifyContent = "center"),
          (this.div.style.alignItems = "center"),
          this.div.classList.add("relative-children"),
          this
        );
      }),
      ($.fn.order = function (opts = {}) {
        let s = this.div.style;
        return (
          "none" === opts.flexWrap && (opts.flexWrap = "nowrap"),
          opts.direction && (s.flexDirection = opts.direction),
          opts.wrap && (s.flexWrap = opts.wrap),
          opts.order && (s.order = opts.order),
          this
        );
      }),
      ($.fn.align = function (opts = {}) {
        let s = this.div.style;
        function flex(str, contentMode = !1) {
          return "start" === str
            ? "flex-start"
            : "end" === str
              ? "flex-end"
              : "between" === str
                ? contentMode
                  ? "space-between"
                  : "flex-between"
                : "around" === str
                  ? contentMode
                    ? "space-around"
                    : "flex-around"
                  : "none" === str
                    ? "nowrap"
                    : str;
        }
        return (
          opts.justify && (s.justifyContent = flex(opts.justify)),
          opts.items && (s.alignItems = flex(opts.items)),
          opts.self && (s.alignSelf = flex(opts.self)),
          opts.content && (s.alignContent = flex(opts.content, !0)),
          this
        );
      }),
      ($.fn.flexibility = function (opts = {}) {
        let s = this.div.style;
        return (
          "undefined" !== opts.grow && (s.flexGrow = opts.grow),
          "undefined" !== opts.shrink && (s.flexGrow = opts.shrink),
          void 0 !== opts.basis &&
            (s.flexBasis =
              "number" == typeof opts.basis ? opts.basis + "px" : opts.basis),
          this
        );
      }),
      ($.fn.mask = function (arg) {
        let maskPrefix =
          "Moz" === HydraCSS.styles.vendor ? "mask" : HydraCSS.prefix("Mask");
        return (
          (this.div.style[maskPrefix] =
            (arg.includes(".") ? "url(" + arg + ")" : arg) + " no-repeat"),
          (this.div.style[maskPrefix + "Size"] = "contain"),
          this
        );
      }),
      ($.fn.blendMode = function (mode, bg) {
        return (
          bg
            ? (this.div.style["background-blend-mode"] = mode)
            : (this.div.style["mix-blend-mode"] = mode),
          this
        );
      }));
    const DEFAULT_UNITS = {
      animationDelay: "ms",
      animationDuration: "ms",
      transitionDelay: "ms",
      transitionDuration: "ms",
      perspectiveOriginX: "%",
      perspectiveOriginY: "%",
      transformOrigin: "%",
      transformOriginX: "%",
      transformOriginY: "%",
      transformOriginZ: "%",
      rotate: "deg",
      animationIterationCount: !1,
      borderImageSlice: !1,
      borderImageWidth: !1,
      columnCount: !1,
      counterIncrement: !1,
      counterReset: !1,
      flex: !1,
      flexGrow: !1,
      flexShrink: !1,
      fontSizeAdjust: !1,
      fontWeight: !1,
      lineHeight: !1,
      navIndex: !1,
      opacity: !1,
      order: !1,
      orphans: !1,
      tabSize: !1,
      widows: !1,
      zIndex: !1,
      scale: !1,
    };
    function clsxToVal(mix) {
      var k,
        y,
        str = "";
      if ("string" == typeof mix || "number" == typeof mix) str += mix;
      else if ("object" == typeof mix)
        if (Array.isArray(mix)) {
          var len = mix.length;
          for (k = 0; k < len; k++)
            mix[k] && (y = toVal(mix[k])) && (str && (str += " "), (str += y));
        } else for (y in mix) mix[y] && (str && (str += " "), (str += y));
      return str;
    }
    (($.fn.css = function (obj, value) {
      if (
        ("boolean" == typeof value && (value = null), "object" != typeof obj)
      ) {
        if (value) return ((this.div.style[obj] = value), this);
        var style = this.div.style[obj];
        if ("number" != typeof style) {
          if (!style) return !1;
          (style.includes("px") && (style = Number(style.slice(0, -2))),
            "opacity" == obj &&
              (style = isNaN(Number(this.div.style.opacity))
                ? 1
                : Number(this.div.style.opacity)));
        }
        return (style || (style = 0), style);
      }
      TweenManager._clearCSSTween(this);
      for (let type in obj) {
        let val = obj[type];
        if ("string" == typeof val || "number" == typeof val) {
          if ("number" == typeof val) {
            let unit = DEFAULT_UNITS[type];
            !1 !== unit && (val += unit || "px");
          }
          ("position" == type &&
            "sticky" == val &&
            "safari" == Device.system.browser &&
            (val = "-webkit-sticky"),
            (this.div.style[type] = val));
        }
      }
      return this;
    }),
      ($.fn.transform = function (props) {
        if (
          (Hydra.LOCAL &&
            props &&
            !this.__warningShown &&
            !props._mathTween &&
            (this.__lastTransform &&
              performance.now() - this.__lastTransform < 20 &&
              ((this.__warningCount = ++this.__warningCount || 1),
              (props.__warningCount2 = ++props.__warningCount2 || 1),
              this.__warningCount > 10 &&
                props.__warningCount2 !== this.__warningCount &&
                (console.warn(
                  "Are you using .transform() in a loop? Avoid creating a new object {} every frame. Ex. assign .x = 1; and .transform();",
                ),
                console.log(this),
                (this.__warningShown = !0))),
            (this.__lastTransform = performance.now())),
          TweenManager._clearCSSTween(this),
          Device.tween.css2d)
        ) {
          if (props)
            for (var key in props)
              ("number" != typeof props[key] &&
                "string" != typeof props[key]) ||
                (this[key] = props[key]);
          else props = this;
          var transformString = TweenManager._parseTransform(props);
          this.__transformCache != transformString &&
            ((this.div.style[HydraCSS.styles.vendorTransform] =
              transformString),
            (this.__transformCache = transformString));
        }
        return this;
      }),
      ($.fn.willChange = function (props) {
        if ("boolean" == typeof props) this._willChangeLock = !0 === props;
        else if (this._willChangeLock) return;
        var string = "string" == typeof props;
        (this._willChange && !string) || "null" == typeof props
          ? ((this._willChange = !1), (this.div.style["will-change"] = ""))
          : ((this._willChange = !0),
            (this.div.style["will-change"] = string
              ? props
              : HydraCSS.transformProperty + ", opacity"));
      }),
      ($.fn.backfaceVisibility = function (visible) {
        this.div.style[HydraCSS.prefix("BackfaceVisibility")] = visible
          ? "visible"
          : "hidden";
      }),
      ($.fn.enable3D = function (perspective, x, y) {
        return Device.tween.css3d
          ? ((this.div.style[HydraCSS.prefix("TransformStyle")] =
              "preserve-3d"),
            perspective &&
              (this.div.style[HydraCSS.prefix("Perspective")] =
                perspective + "px"),
            void 0 !== x &&
              ((x = "number" == typeof x ? x + "px" : x),
              (y = "number" == typeof y ? y + "px" : y),
              (this.div.style[HydraCSS.prefix("PerspectiveOrigin")] =
                x + " " + y)),
            this)
          : this;
      }),
      ($.fn.disable3D = function () {
        return (
          (this.div.style[HydraCSS.prefix("TransformStyle")] = ""),
          (this.div.style[HydraCSS.prefix("Perspective")] = ""),
          this
        );
      }),
      ($.fn.transformPoint = function (x, y, z) {
        var origin = "";
        return (
          void 0 !== x &&
            (origin += "number" == typeof x ? x + "px " : x + " "),
          void 0 !== y &&
            (origin += "number" == typeof y ? y + "px " : y + " "),
          void 0 !== z && (origin += "number" == typeof z ? z + "px" : z),
          (this.div.style[HydraCSS.prefix("TransformOrigin")] = origin),
          this
        );
      }),
      ($.fn.tween = function (props, time, ease, delay, callback, manual) {
        ("boolean" == typeof delay
          ? ((manual = delay), (delay = 0), (callback = null))
          : "function" == typeof delay && ((callback = delay), (delay = 0)),
          "boolean" == typeof callback &&
            ((manual = callback), (callback = null)),
          delay || (delay = 0));
        var usePromise = null;
        callback &&
          callback instanceof Promise &&
          ((usePromise = callback), (callback = callback.resolve));
        var tween = TweenManager._detectTween(
          this,
          props,
          time,
          ease,
          delay,
          callback,
          manual,
        );
        return usePromise || tween;
      }),
      ($.fn.clearTransform = function () {
        return (
          "number" == typeof this.x && (this.x = 0),
          "number" == typeof this.y && (this.y = 0),
          "number" == typeof this.z && (this.z = 0),
          "number" == typeof this.scale && (this.scale = 1),
          "number" == typeof this.scaleX && (this.scaleX = 1),
          "number" == typeof this.scaleY && (this.scaleY = 1),
          "number" == typeof this.rotation && (this.rotation = 0),
          "number" == typeof this.rotationX && (this.rotationX = 0),
          "number" == typeof this.rotationY && (this.rotationY = 0),
          "number" == typeof this.rotationZ && (this.rotationZ = 0),
          "number" == typeof this.skewX && (this.skewX = 0),
          "number" == typeof this.skewY && (this.skewY = 0),
          (this.div.style[HydraCSS.styles.vendorTransform] = ""),
          (this.__transformCache = ""),
          this
        );
      }),
      ($.fn.clearTween = function () {
        return (
          this._cssTween && this._cssTween.stop(),
          this._mathTween && this._mathTween.stop(),
          this
        );
      }),
      ($.fn.stopTween = function () {
        return (
          console.warn(".stopTween deprecated. use .clearTween instead"),
          this.clearTween()
        );
      }),
      ($.fn.keypress = function (callback) {
        this.div.onkeypress = function (e) {
          (((e = e || window.event).code = e.keyCode ? e.keyCode : e.charCode),
            callback && callback(e));
        };
      }),
      ($.fn.keydown = function (callback) {
        this.div.onkeydown = function (e) {
          (((e = e || window.event).code = e.keyCode), callback && callback(e));
        };
      }),
      ($.fn.keyup = function (callback) {
        this.div.onkeyup = function (e) {
          (((e = e || window.event).code = e.keyCode), callback && callback(e));
        };
      }),
      ($.fn.attr = function (attr, value) {
        return "string" != typeof attr
          ? this
          : void 0 === value
            ? this.div.getAttribute(attr)
            : (!1 === value || null === value
                ? this.div.removeAttribute(attr)
                : this.div.setAttribute(attr, value),
              this);
      }),
      ($.fn.val = function (value) {
        return void 0 === value
          ? this.div.value
          : ((this.div.value = value), this);
      }),
      ($.fn.change = $.fn.onChange =
        function (callback) {
          var _this = this;
          this.div.onchange = this.div.onblur = function () {
            callback({ object: _this, value: _this.div.value || "" });
          };
        }),
      ($.fn.svgSymbol = function (id, width, height) {
        var config = SVG.getSymbolConfig(id),
          svgHTML =
            '<svg viewBox="0 0 ' +
            config.width +
            " " +
            config.height +
            '" width="' +
            width +
            '" height="' +
            height +
            '"><use xlink:href="#' +
            config.id +
            '" x="0" y="0" /></svg>';
        this.html(svgHTML, !0);
      }),
      ($.fn.svg = async function (url) {
        let promise = Promise.create();
        return (
          fetch(url).then(async (res) => {
            let svgHTML = await res.text();
            (this.html(svgHTML, !0), promise.resolve());
          }),
          promise
        );
      }),
      ($.fn.overflowScroll = function (dir) {
        var x = !!dir.x,
          y = !!dir.y,
          overflow = {};
        return (
          ((!x && !y) || (x && y)) && (overflow.overflow = "auto"),
          !x &&
            y &&
            ((overflow.overflowY = "auto"), (overflow.overflowX = "hidden")),
          x &&
            !y &&
            ((overflow.overflowX = "auto"), (overflow.overflowY = "hidden")),
          Device.mobile &&
            ((overflow["-webkit-overflow-scrolling"] = "touch"),
            Mobile._addOverflowScroll(this)),
          this.css(overflow)
        );
      }),
      ($.fn.removeOverflowScroll = function () {
        return (
          this.css({
            overflow: "hidden",
            overflowX: "",
            overflowY: "",
            "-webkit-overflow-scrolling": "",
          }),
          Device.mobile && Mobile._removeOverflowScroll(this),
          this
        );
      }),
      ($.fn.accessible = function (type = "label", tabIndex = -1) {
        switch ((tabIndex > -1 && this.attr("tabindex", tabIndex), type)) {
          case "label":
            this.attr("aria-label", this.div.textContent);
            break;
          case "hidden":
            this.attr("aria-hidden", !0);
        }
        return this;
      }),
      ($.fn.tabIndex = function (tabIndex) {
        return (this.attr("tabindex", tabIndex), this);
      }),
      ($.fn.createObserver = function (
        callback,
        { isViewport: isViewport = !1, ...options } = {},
      ) {
        isViewport && (options.root = this.div);
        const observer = (this._observer = new IntersectionObserver((array) => {
          (array.forEach((entry) => {
            entry.object = entry.target.hydraObject;
          }),
            callback(array));
        }, options));
        return (
          this._bindOnDestroy(() => {
            observer.disconnect();
          }),
          this
        );
      }),
      ($.fn.observe = function (obj = this) {
        return (this._observer?.observe(obj.div), this);
      }),
      ($.fn.unobserve = function (obj = this) {
        return (this._observer?.unobserve(obj.div), this);
      }),
      ($.fn.cursor = function (cursor, lock) {
        if (!Device.mobile) {
          if (lock) {
            lock[cursorLockIdProp] || (lock[cursorLockIdProp] = {});
            let id = lock[cursorLockIdProp];
            (this.cursorLock || (this.cursorLock = new Map()),
              "auto" == cursor
                ? this.cursorLock.delete(id)
                : this.cursorLock.set(id, cursor));
          }
          return (
            this.cursorLock &&
              "auto" == cursor &&
              this.cursorLock.forEach((v) => {
                cursor = v;
              }),
            this.css("cursor", cursor),
            this
          );
        }
      }),
      ($.fn.classList = function () {
        return this.div.classList;
      }),
      ($.fn.clsx = function (...args) {
        for (var tmp, x, i = 0, str = "", len = args.length; i < len; i++)
          (tmp = args[i]) &&
            (x = clsxToVal(tmp)) &&
            (str && (str += " "), (str += x));
        return (this.div.classList.add(...str.split(" ")), this);
      }),
      ($.fn.goob = function (styles) {
        let _styles;
        return (
          (_styles =
            "string" == typeof styles
              ? goober.css`${styles}`
              : goober.css(styles)),
          (this.goobClass = _styles),
          this.div.classList.add(_styles),
          this
        );
      }),
      ($.fn.glob = function (styles) {
        let key = styles.replace("\n", "").slice(0, 100);
        (goober.globbed || (goober.globbed = {}),
          goober.globbed[key] ||
            (goober.glob(styles), (goober.globbed[key] = 1)));
      }),
      ($.fn.href = function (str) {
        return (this.attr("href", str), this);
      }),
      ($.fn.target = function (str) {
        return (this.attr("target", str), this);
      }),
      ($.fn.ariaLabel = function (str) {
        return (this.attr("aria-label", str), this);
      }),
      ($.fn.alt = function (str) {
        return (this.attr("alt", str), this);
      }),
      ($.fn.src = function (str) {
        return (this.attr("src", str), this);
      }),
      ($.fn.display = function (bool) {
        bool ? $this.show() : $this.hide();
      }),
      ($.fn.type = function (str) {
        return (this.attr("type", str), this);
      }),
      ($.fn.id = function (str) {
        return (this.attr("id", str), this);
      }),
      ($.fn.htmlFor = function (str) {
        return (this.attr("for", str), this);
      }),
      ($.fn.ariaLabelledBy = function (str) {
        return (this.attr("aria-labelledby", str), this);
      }),
      ($.fn.checked = function (bool) {
        return (this.attr("checked", bool), this);
      }),
      ($.fn.min = function (num) {
        return (this.attr("min", num), this);
      }),
      ($.fn.max = function (num) {
        return (this.attr("max", num), this);
      }),
      ($.fn.step = function (num) {
        return (this.attr("step", num), this);
      }),
      ($.fn.value = function (any) {
        return (this.attr("value", any), this);
      }),
      ($.fn.title = function (str) {
        return (this.attr("title", str), this);
      }),
      ($.fn.minlength = function (num) {
        return (this.attr("minlength", num), this);
      }),
      ($.fn.maxlength = function (num) {
        return (this.attr("maxlength", num), this);
      }),
      ($.fn.rows = function (num) {
        return (this.attr("rows", num), this);
      }),
      ($.fn.readonly = function (bool) {
        return (this.attr("readonly", bool), this);
      }));
  })(),
  (function () {
    var windowsPointer = !!window.MSGesture,
      translateEvent = function (evt) {
        if (windowsPointer)
          switch (evt) {
            case "touchstart":
              return "pointerdown";
            case "touchmove":
              return "MSGestureChange";
            case "touchend":
              return "pointerup";
          }
        return evt;
      },
      convertTouchEvent = function (e) {
        var touchEvent = { x: 0, y: 0 };
        if (e.windowsPointer) return e;
        if (!e) return touchEvent;
        if (
          (e.touches || e.changedTouches
            ? e.touches.length
              ? ((touchEvent.x = e.touches[0].clientX),
                (touchEvent.y = e.touches[0].clientY))
              : ((touchEvent.x = e.changedTouches[0].clientX),
                (touchEvent.y = e.changedTouches[0].clientY))
            : ((touchEvent.x = e.clientX), (touchEvent.y = e.clientY)),
          Mobile.ScreenLock &&
            Mobile.ScreenLock.isActive &&
            Mobile.orientationSet &&
            Mobile.orientation !== Mobile.orientationSet)
        ) {
          if (90 == window.orientation || 0 === window.orientation) {
            var x = touchEvent.y;
            ((touchEvent.y = touchEvent.x), (touchEvent.x = Stage.width - x));
          }
          if (-90 == window.orientation || 180 === window.orientation) {
            var y = touchEvent.x;
            ((touchEvent.x = touchEvent.y), (touchEvent.y = Stage.height - y));
          }
        }
        return touchEvent;
      };
    function addSharedEventListener(_this, unique, evt, callback, fn, options) {
      _this._events = _this._events || {};
      let key = `${unique}_${evt}`;
      ((_this._events[key] = _this._events[key] || {
        options: options,
        destroy: addTrackedEventListener(_this, evt, fn, options),
        callbacks: [],
      }),
        _this._events[key].callbacks.push({
          callback: callback,
          target: _this.div,
        }));
    }
    function callSharedEventListenerCallbacks(_this, unique, evt, e) {
      let { callbacks: callbacks } = _this._events[`${unique}_${evt}`];
      for (let i = 0; i < callbacks.length; i++) {
        let { callback: callback, target: target } = callbacks[i];
        callback && target == e.currentTarget && callback(e);
      }
    }
    function addTrackedEventListener(_this, evt, callback, options) {
      ((evt = translateEvent(evt)),
        (_this._cleanups = _this._cleanups || new Set()));
      let cleanup = () => {
        (_this.div.removeEventListener(evt, callback, options),
          _this._cleanups.delete(cleanup));
      };
      return (
        _this._cleanups.add(cleanup),
        _this.div.addEventListener(evt, callback, options),
        cleanup
      );
    }
    (($.fn.click = function (callback) {
      var _this = this;
      return (
        addSharedEventListener(
          _this,
          "click",
          "click",
          callback,
          function click(e) {
            return (
              !!_this.div &&
              !Mouse._preventClicks &&
              ((e.object =
                "hit" == _this.div.className ? _this.parent() : _this),
              (e.action = "click"),
              callSharedEventListenerCallbacks(_this, "click", "click", e),
              void (Mouse.autoPreventClicks && Mouse.preventClicks()))
            );
          },
          !0,
        ),
        (this.div.style.cursor = "pointer"),
        this
      );
    }),
      ($.fn.hover = function (callback) {
        var _time,
          _this = this,
          _over = !1;
        function hover(e) {
          if (!_this.div) return !1;
          var time = performance.now(),
            original = e.toElement || e.relatedTarget;
          if (_time && time - _time < 5) return ((_time = time), !1);
          switch (
            ((_time = time),
            (e.object = "hit" == _this.div.className ? _this.parent() : _this),
            e.type)
          ) {
            case "mouseout":
            case "mouseleave":
              e.action = "out";
              break;
            default:
              e.action = "over";
          }
          if (_over) {
            if (Mouse._preventClicks) return !1;
            if ("over" == e.action) return !1;
            if ("out" == e.action && isAChild(_this.div, original)) return !1;
            _over = !1;
          } else {
            if ("out" == e.action) return !1;
            _over = !0;
          }
          callSharedEventListenerCallbacks(_this, "hover", "mouseover", e);
        }
        function isAChild(div, object) {
          for (var len = div.children.length - 1, i = len; i > -1; i--)
            if (object == div.children[i]) return !0;
          for (i = len; i > -1; i--)
            if (isAChild(div.children[i], object)) return !0;
        }
        return (
          addSharedEventListener(
            _this,
            "hover",
            "mouseover",
            callback,
            hover,
            !0,
          ),
          addSharedEventListener(
            _this,
            "hover",
            "mouseout",
            callback,
            hover,
            !0,
          ),
          this
        );
      }),
      ($.fn.press = function (callback) {
        var _this = this;
        function press(action, e) {
          if (!_this.div) return !1;
          ((e.object = "hit" == _this.div.className ? _this.parent() : _this),
            (e.action = action),
            callback && callback(e));
        }
        return (
          this.bind("touchstart", (e) => press("down", e), !0),
          this.bind("touchend", (e) => press("up", e), !0),
          this
        );
      }),
      ($.fn.bind = function (evt, callback) {
        var _this = this;
        if (windowsPointer && this == __window)
          return Stage.bind(evt, callback);
        "touchstart" == evt
          ? Device.mobile ||
            (Device.touchCapable
              ? this.bind("mousedown", callback)
              : (evt = "mousedown"))
          : "touchmove" == evt
            ? (Device.mobile ||
                (Device.touchCapable
                  ? this.bind("mousemove", callback)
                  : (evt = "mousemove")),
              windowsPointer &&
                !this.div.msGesture &&
                ((this.div.msGesture = new MSGesture()),
                (this.div.msGesture.target = this.div)))
            : "touchend" == evt &&
              (Device.mobile ||
                (Device.touchCapable
                  ? this.bind("mouseup", callback)
                  : (evt = "mouseup")));
        var target = this.div;
        return (
          addSharedEventListener(
            _this,
            "bind",
            evt,
            callback,
            function touchEvent(e) {
              (windowsPointer &&
                target.msGesture &&
                "touchstart" == evt &&
                target.msGesture.addPointer(e.pointerId),
                Device.mobile || "touchstart" != evt || e.preventDefault());
              var touch = convertTouchEvent(e);
              if (windowsPointer) {
                var windowsEvt = e;
                (((e = {}).preventDefault = () => windowsEvt.preventDefault()),
                  (e.stopPropagation = () => windowsEvt.stopPropagation()),
                  (e.x = Number(windowsEvt.clientX)),
                  (e.y = Number(windowsEvt.clientY)),
                  (e.target = windowsEvt.target),
                  (e.currentTarget = windowsEvt.currentTarget),
                  (e.path = []));
                for (var node = e.target; node; )
                  (e.path.push(node), (node = node.parentElement || null));
                e.windowsPointer = !0;
              } else ((e.x = touch.x), (e.y = touch.y));
              callSharedEventListenerCallbacks(_this, "bind", evt, e);
            },
            { capture: !0, passive: !1 },
          ),
          this
        );
      }),
      ($.fn.unbind = function (evt, callback) {
        return windowsPointer && this == __window
          ? Stage.unbind(evt, callback)
          : ("touchstart" == evt
              ? Device.mobile ||
                (Device.touchCapable
                  ? this.unbind("mousedown", callback)
                  : (evt = "mousedown"))
              : "touchmove" == evt
                ? Device.mobile ||
                  (Device.touchCapable
                    ? this.unbind("mousemove", callback)
                    : (evt = "mousemove"))
                : "touchend" == evt &&
                  (Device.mobile ||
                    (Device.touchCapable
                      ? this.unbind("mouseup", callback)
                      : (evt = "mouseup"))),
            (function removeSharedEventListener(_this, unique, evt, callback) {
              if (!_this._events) return;
              let key = `${unique}_${evt}`,
                binding = _this._events[key];
              if (binding) {
                let { callbacks: callbacks } = binding;
                for (let i = 0; i < callbacks.length; i++)
                  if (callbacks[i].callback === callback) {
                    callbacks.splice(i, 1);
                    break;
                  }
                callbacks.length ||
                  (binding.destroy(), (_this._events[key] = null));
              }
            })(this, "bind", evt, callback),
            this);
      }),
      ($.fn.interact = function (
        overCallback,
        clickCallback,
        seoLink,
        seoText,
        zIndex,
        options,
      ) {
        const position = getComputedStyle(this.div).position;
        if (
          ((position && "static" !== position) ||
            this.css({ position: "relative" }),
          !this.hit)
        ) {
          ("object" == typeof arguments[arguments.length - 1] &&
            ((options = arguments[arguments.length - 1]),
            ([overCallback, clickCallback, seoLink, seoText, zIndex] =
              Array.prototype.slice.call(arguments, 0, -1)),
            options.overCallback && (overCallback = options.overCallback),
            options.clickCallback && (clickCallback = options.clickCallback),
            options.seoLink && (seoLink = options.seoLink),
            options.seoText && (seoText = options.seoText),
            options.zIndex && (zIndex = options.zIndex)),
            options || (options = {}),
            (this.hit = $(".hit", seoLink ? "a" : void 0)),
            this.hit.css({
              width: "100%",
              height: "100%",
              zIndex: zIndex || 99999,
              top: 0,
              left: 0,
              position: "absolute",
            }),
            this.add(this.hit));
          var _this = this;
          (seoLink &&
            (this.hit.attr(
              "href",
              "#" === seoLink || seoLink.includes("mailto:")
                ? seoLink
                : Hydra.absolutePath(seoLink),
            ),
            this.hit.text(seoText || this.div.textContent),
            this.hit.css({ fontSize: 0 }),
            this.hit.accessible(),
            "function" == typeof overCallback &&
              ((this.hit.div.onfocus = (_) =>
                overCallback({ action: "over", object: this })),
              (this.hit.div.onblur = (_) =>
                overCallback({ action: "out", object: this }))),
            (this.hit.div.onclick = (e) => {
              (e.preventDefault(),
                (e.object = _this),
                (e.action = "click"),
                clicked(e));
            })),
            options.role &&
              (this.hit.attr("role", options.role),
              "button" === options.role &&
                (this.hit.div.onkeydown = (e) => {
                  switch (e.key) {
                    case " ":
                    case "Spacebar":
                      (e.preventDefault(),
                        e.stopPropagation(),
                        (e.object = _this),
                        (e.action = "click"),
                        clicked(e));
                  }
                })));
        }
        let time = Render.TIME;
        function clicked(e) {
          (clickCallback && Render.TIME - time > 250 && clickCallback(e),
            (time = Render.TIME));
        }
        Device.mobile
          ? this.hit.touchClick(overCallback, clicked)
          : this.hit.hover(overCallback).click(clicked);
      }),
      ($.fn.clearInteract = function () {
        this.hit && (this.hit = this.hit.destroy());
      }),
      ($.fn.disableInteract = function () {
        this.hit && this.hit.css({ pointerEvents: "none" });
      }),
      ($.fn.enableInteract = function () {
        this.hit && this.hit.css({ pointerEvents: "auto" });
      }),
      ($.fn.clearBind = function () {
        this._cleanups &&
          (this._cleanups.forEach((cleanup) => cleanup()),
          (this._cleanups = null),
          (this._events = null));
      }),
      ($.fn.touchSwipe = function (callback, distance) {
        if (!window.addEventListener) return this;
        var _startX,
          _startY,
          _removeTouchMove,
          _this = this,
          _distance = distance || 75,
          _moving = !1,
          _move = {};
        function touchMove(e) {
          if (!_this.div) return !1;
          if (_moving) {
            var touch = convertTouchEvent(e),
              dx = _startX - touch.x,
              dy = _startY - touch.y;
            ((_move.direction = null),
              (_move.moving = null),
              (_move.x = null),
              (_move.y = null),
              (_move.evt = e),
              Math.abs(dx) >= _distance
                ? (touchEnd(), (_move.direction = dx > 0 ? "left" : "right"))
                : Math.abs(dy) >= _distance
                  ? (touchEnd(), (_move.direction = dy > 0 ? "up" : "down"))
                  : ((_move.moving = !0), (_move.x = dx), (_move.y = dy)),
              callback && callback(_move, e));
          }
        }
        function touchEnd(e) {
          if (!_this.div) return !1;
          ((_startX = _startY = _moving = !1),
            _removeTouchMove &&
              (_removeTouchMove(), (_removeTouchMove = null)));
        }
        return (
          Device.mobile &&
            (addTrackedEventListener(
              _this,
              "touchstart",
              function touchStart(e) {
                var touch = convertTouchEvent(e);
                if (!_this.div) return !1;
                1 == e.touches.length &&
                  ((_startX = touch.x),
                  (_startY = touch.y),
                  (_moving = !0),
                  (_removeTouchMove = addTrackedEventListener(
                    _this,
                    "touchmove",
                    touchMove,
                    { passive: !0 },
                  )));
              },
              { passive: !0 },
            ),
            addTrackedEventListener(_this, "touchend", touchEnd, {
              passive: !0,
            }),
            addTrackedEventListener(_this, "touchcancel", touchEnd, {
              passive: !0,
            })),
          this
        );
      }),
      ($.fn.touchClick = function (hover, click) {
        if (!window.addEventListener) return this;
        var _time,
          _move,
          _this = this,
          _start = {},
          _touch = {};
        function setTouch(e) {
          var touch = convertTouchEvent(e);
          ((e.touchX = touch.x),
            (e.touchY = touch.y),
            (_start.x = e.touchX),
            (_start.y = e.touchY));
        }
        return (
          Device.mobile &&
            (addTrackedEventListener(
              _this,
              "touchstart",
              function touchStart(e) {
                if (!_this.div) return !1;
                ((_time = performance.now()),
                  (e.action = "over"),
                  (e.object =
                    "hit" == _this.div.className ? _this.parent() : _this),
                  setTouch(e),
                  hover && !_move && hover(e));
              },
              { passive: !0 },
            ),
            addTrackedEventListener(
              _this,
              "touchend",
              function touchEnd(e) {
                if (!_this.div) return !1;
                var time = performance.now();
                if (
                  ((_touch = convertTouchEvent(e)),
                  (_move =
                    (function findDistance(p1, p2) {
                      var dx = p2.x - p1.x,
                        dy = p2.y - p1.y;
                      return Math.sqrt(dx * dx + dy * dy);
                    })(_start, _touch) > 25),
                  (e.object =
                    "hit" == _this.div.className ? _this.parent() : _this),
                  setTouch(e),
                  _time && time - _time < 750)
                ) {
                  if (Mouse._preventClicks) return !1;
                  click &&
                    !_move &&
                    (!0,
                    (e.action = "click"),
                    click && !_move && click(e),
                    Mouse.autoPreventClicks && Mouse.preventClicks());
                }
                hover && ((e.action = "out"), Mouse._preventFire || hover(e));
                _move = !1;
              },
              { passive: !0 },
            )),
          this
        );
      }));
  })(),
  Class(function Element(type = "div") {
    Inherit(this, Component);
    var name = Utils.getConstructorName(this);
    ((this.__element = !0),
      (this.element = $("." + name, type)),
      (this.element.__useFragment = !0),
      (this.destroy = function () {
        (this.element &&
          this.element.remove &&
          (this.element = this.element.remove()),
          this._destroy && this._destroy());
      }),
      (this.querySelector = async function (selector) {
        if ((await defer(), Array.isArray(selector))) {
          let values = [];
          return (
            selector.forEach((s) => {
              values.push($(this.element.div.querySelector(s)));
            }),
            values
          );
        }
        return $(this.element.div.querySelector(selector));
      }),
      (this.querySelectorAll = async function (selector) {
        await defer();
        let list = this.element.div.querySelectorAll(selector),
          values = [];
        for (let i = 0; i < list.length; i++) values.push($(list[i]));
        return values;
      }));
  }),
  (() => {
    var ap = Object.create,
      Et = Object.defineProperty,
      sp = Object.defineProperties,
      pp = Object.getOwnPropertyDescriptor,
      lp = Object.getOwnPropertyDescriptors,
      up = Object.getOwnPropertyNames,
      ln = Object.getOwnPropertySymbols,
      fp = Object.getPrototypeOf,
      un = Object.prototype.hasOwnProperty,
      cp = Object.prototype.propertyIsEnumerable,
      lo = (e, t, r) =>
        t in e
          ? Et(e, t, {
              enumerable: !0,
              configurable: !0,
              writable: !0,
              value: r,
            })
          : (e[t] = r),
      _ = (e, t) => {
        for (var r in t || (t = {})) un.call(t, r) && lo(e, r, t[r]);
        if (ln) for (var r of ln(t)) cp.call(t, r) && lo(e, r, t[r]);
        return e;
      },
      V = (e, t) => sp(e, lp(t)),
      fn = (e) => Et(e, "__esModule", { value: !0 }),
      Kt = (e, t) => () => (
        t || e((t = { exports: {} }).exports, t),
        t.exports
      ),
      uo = (e, t) => {
        for (var r in (fn(e), t)) Et(e, r, { get: t[r], enumerable: !0 });
      },
      Gt = (e) =>
        ((e, t, r) => {
          if ((t && "object" == typeof t) || "function" == typeof t)
            for (let o of up(t))
              !un.call(e, o) &&
                "default" !== o &&
                Et(e, o, {
                  get: () => t[o],
                  enumerable: !(r = pp(t, o)) || r.enumerable,
                });
          return e;
        })(
          fn(
            Et(
              null != e ? ap(fp(e)) : {},
              "default",
              e && e.__esModule && "default" in e
                ? { get: () => e.default, enumerable: !0 }
                : { value: e, enumerable: !0 },
            ),
          ),
          e,
        ),
      d = (e, t, r) => (lo(e, "symbol" != typeof t ? t + "" : t, r), r),
      fi = Kt((Ej, ui) => {
        ui.exports = (function () {
          function e(t, r, o, n) {
            this.set(t, r, o, n);
          }
          return (
            (e.prototype.set = function (t, r, o, n) {
              ((this._cx = 3 * t),
                (this._bx = 3 * (o - t) - this._cx),
                (this._ax = 1 - this._cx - this._bx),
                (this._cy = 3 * r),
                (this._by = 3 * (n - r) - this._cy),
                (this._ay = 1 - this._cy - this._by));
            }),
            (e.epsilon = 1e-6),
            (e.prototype._sampleCurveX = function (t) {
              return ((this._ax * t + this._bx) * t + this._cx) * t;
            }),
            (e.prototype._sampleCurveY = function (t) {
              return ((this._ay * t + this._by) * t + this._cy) * t;
            }),
            (e.prototype._sampleCurveDerivativeX = function (t) {
              return (3 * this._ax * t + 2 * this._bx) * t + this._cx;
            }),
            (e.prototype._solveCurveX = function (t, r) {
              var o, n, i, a, s, l;
              for (
                i = void 0,
                  a = void 0,
                  s = void 0,
                  l = void 0,
                  o = void 0,
                  n = void 0,
                  s = t,
                  n = 0;
                n < 8;
              ) {
                if (((l = this._sampleCurveX(s) - t), Math.abs(l) < r))
                  return s;
                if (((o = this._sampleCurveDerivativeX(s)), Math.abs(o) < r))
                  break;
                ((s -= l / o), n++);
              }
              if ((s = t) < (i = 0)) return i;
              if (s > (a = 1)) return a;
              for (; i < a; ) {
                if (((l = this._sampleCurveX(s)), Math.abs(l - t) < r))
                  return s;
                (t > l ? (i = s) : (a = s), (s = 0.5 * (a - i) + i));
              }
              return s;
            }),
            (e.prototype.solve = function (t, r) {
              return this._sampleCurveY(this._solveCurveX(t, r));
            }),
            (e.prototype.solveSimple = function (t) {
              return this._sampleCurveY(this._solveCurveX(t, 1e-6));
            }),
            e
          );
        })();
      }),
      ks = Kt((eO, Cs) => {
        var Lr, No;
        ((Lr = []),
          (No = []),
          (Cs.exports = function Yh(e, t, r) {
            var o, n, i, a, s, l, p, u;
            if (e === t) return 0;
            if (((o = e.length), (n = t.length), 0 === o)) return n;
            if (0 === n) return o;
            for (
              r && ((e = e.toLowerCase()), (t = t.toLowerCase())), p = 0;
              p < o;
            )
              ((No[p] = e.charCodeAt(p)), (Lr[p] = ++p));
            for (u = 0; u < n; )
              for (i = t.charCodeAt(u), a = s = u++, p = -1; ++p < o; )
                ((l = i === No[p] ? s : s + 1),
                  (s = Lr[p]),
                  (Lr[p] = a =
                    s > a ? (l > a ? a + 1 : l) : l > s ? s + 1 : l));
            return a;
          }));
      }),
      Rs = Kt((tO, Es) => {
        var Ds = ks();
        Es.exports = function Xh() {
          var e,
            t,
            r,
            o,
            n,
            i = 0,
            a = arguments[0],
            s = arguments[1],
            l = s.length,
            p = arguments[2];
          (p && ((o = p.threshold), (n = p.ignoreCase)),
            void 0 === o && (o = 0));
          for (var u = 0; u < l; ++u)
            (e =
              (t = n ? Ds(a, s[u], !0) : Ds(a, s[u])) > a.length
                ? 1 - t / s[u].length
                : 1 - t / a.length) > i && ((i = e), (r = s[u]));
          return i >= o ? r : null;
        };
      }),
      qo = Kt((fw, zs) => {
        "use strict";
        zs.exports = function e(t, r) {
          if (t === r) return !0;
          if (t && r && "object" == typeof t && "object" == typeof r) {
            if (t.constructor !== r.constructor) return !1;
            var o, n, i;
            if (Array.isArray(t)) {
              if ((o = t.length) != r.length) return !1;
              for (n = o; 0 != n--; ) if (!e(t[n], r[n])) return !1;
              return !0;
            }
            if (t.constructor === RegExp)
              return t.source === r.source && t.flags === r.flags;
            if (t.valueOf !== Object.prototype.valueOf)
              return t.valueOf() === r.valueOf();
            if (t.toString !== Object.prototype.toString)
              return t.toString() === r.toString();
            if ((o = (i = Object.keys(t)).length) !== Object.keys(r).length)
              return !1;
            for (n = o; 0 != n--; )
              if (!Object.prototype.hasOwnProperty.call(r, i[n])) return !1;
            for (n = o; 0 != n--; ) {
              var a = i[n];
              if (!e(t[a], r[a])) return !1;
            }
            return !0;
          }
          return t != t && r != r;
        };
      }),
      pn = {};
    uo(pn, {
      createRafDriver: () => Ft,
      getProject: () => np,
      notify: () => pe,
      onChange: () => Rr,
      setCoreRafDriver: () => zr,
      types: () => Yr,
      val: () => ip,
    });
    var sn = {};
    uo(sn, {
      createRafDriver: () => Ft,
      getProject: () => np,
      notify: () => pe,
      onChange: () => Rr,
      setCoreRafDriver: () => zr,
      types: () => Yr,
      val: () => ip,
    });
    var $ = Array.isArray,
      Ht =
        "object" == typeof window &&
        window &&
        window.Object === Object &&
        window,
      gp = "object" == typeof self && self && self.Object === Object && self,
      N = Ht || gp || Function("return this")(),
      W = N.Symbol,
      cn = Object.prototype,
      Pp = cn.hasOwnProperty,
      jp = cn.toString,
      Rt = W ? W.toStringTag : void 0;
    var dn = function _p(e) {
        var t = Pp.call(e, Rt),
          r = e[Rt];
        try {
          e[Rt] = void 0;
          var o = !0;
        } catch (i) {}
        var n = jp.call(e);
        return (o && (t ? (e[Rt] = r) : delete e[Rt]), n);
      },
      Tp = Object.prototype.toString;
    var mn = function xp(e) {
        return Tp.call(e);
      },
      hn = W ? W.toStringTag : void 0;
    var X = function Ap(e) {
      return null == e
        ? void 0 === e
          ? "[object Undefined]"
          : "[object Null]"
        : hn && hn in Object(e)
          ? dn(e)
          : mn(e);
    };
    var B = function Op(e) {
      return null != e && "object" == typeof e;
    };
    var Te = function Cp(e) {
        return "symbol" == typeof e || (B(e) && "[object Symbol]" == X(e));
      },
      kp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      Dp = /^\w*$/;
    var et = function Ep(e, t) {
      if ($(e)) return !1;
      var r = typeof e;
      return (
        !(
          "number" != r &&
          "symbol" != r &&
          "boolean" != r &&
          null != e &&
          !Te(e)
        ) ||
        Dp.test(e) ||
        !kp.test(e) ||
        (null != t && e in Object(t))
      );
    };
    var M = function Rp(e) {
      var t = typeof e;
      return null != e && ("object" == t || "function" == t);
    };
    var e,
      Jt = function $p(e) {
        if (!M(e)) return !1;
        var t = X(e);
        return (
          "[object Function]" == t ||
          "[object GeneratorFunction]" == t ||
          "[object AsyncFunction]" == t ||
          "[object Proxy]" == t
        );
      },
      Yt = N["__core-js_shared__"],
      gn = (e = /[^.]+$/.exec((Yt && Yt.keys && Yt.keys.IE_PROTO) || ""))
        ? "Symbol(src)_1." + e
        : "";
    var yn = function Fp(e) {
        return !!gn && gn in e;
      },
      qp = Function.prototype.toString;
    var me = function zp(e) {
        if (null != e) {
          try {
            return qp.call(e);
          } catch (t) {}
          try {
            return e + "";
          } catch (t) {}
        }
        return "";
      },
      Kp = /^\[object .+?Constructor\]$/,
      Gp = Function.prototype,
      Hp = Object.prototype,
      Jp = Gp.toString,
      Yp = Hp.hasOwnProperty,
      Xp = RegExp(
        "^" +
          Jp.call(Yp)
            .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
            .replace(
              /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
              "$1.*?",
            ) +
          "$",
      );
    var bn = function Zp(e) {
      return !(!M(e) || yn(e)) && (Jt(e) ? Xp : Kp).test(me(e));
    };
    var Pn = function Qp(e, t) {
      return null == e ? void 0 : e[t];
    };
    var K = function el(e, t) {
        var r = Pn(e, t);
        return bn(r) ? r : void 0;
      },
      he = K(Object, "create");
    var jn = function rl() {
      ((this.__data__ = he ? he(null) : {}), (this.size = 0));
    };
    var _n = function ol(e) {
        var t = this.has(e) && delete this.__data__[e];
        return ((this.size -= t ? 1 : 0), t);
      },
      al = Object.prototype.hasOwnProperty;
    var vn = function sl(e) {
        var t = this.__data__;
        if (he) {
          var r = t[e];
          return "__lodash_hash_undefined__" === r ? void 0 : r;
        }
        return al.call(t, e) ? t[e] : void 0;
      },
      ll = Object.prototype.hasOwnProperty;
    var Tn = function ul(e) {
      var t = this.__data__;
      return he ? void 0 !== t[e] : ll.call(t, e);
    };
    var xn = function cl(e, t) {
      var r = this.__data__;
      return (
        (this.size += this.has(e) ? 0 : 1),
        (r[e] = he && void 0 === t ? "__lodash_hash_undefined__" : t),
        this
      );
    };
    function tt(e) {
      var t = -1,
        r = null == e ? 0 : e.length;
      for (this.clear(); ++t < r; ) {
        var o = e[t];
        this.set(o[0], o[1]);
      }
    }
    ((tt.prototype.clear = jn),
      (tt.prototype.delete = _n),
      (tt.prototype.get = vn),
      (tt.prototype.has = Tn),
      (tt.prototype.set = xn));
    var fo = tt;
    var Sn = function dl() {
      ((this.__data__ = []), (this.size = 0));
    };
    var rt = function ml(e, t) {
      return e === t || (e != e && t != t);
    };
    var xe = function hl(e, t) {
        for (var r = e.length; r--; ) if (rt(e[r][0], t)) return r;
        return -1;
      },
      yl = Array.prototype.splice;
    var In = function bl(e) {
      var t = this.__data__,
        r = xe(t, e);
      return (
        !(r < 0) &&
        (r == t.length - 1 ? t.pop() : yl.call(t, r, 1), --this.size, !0)
      );
    };
    var An = function Pl(e) {
      var t = this.__data__,
        r = xe(t, e);
      return r < 0 ? void 0 : t[r][1];
    };
    var On = function jl(e) {
      return xe(this.__data__, e) > -1;
    };
    var wn = function _l(e, t) {
      var r = this.__data__,
        o = xe(r, e);
      return (o < 0 ? (++this.size, r.push([e, t])) : (r[o][1] = t), this);
    };
    function ot(e) {
      var t = -1,
        r = null == e ? 0 : e.length;
      for (this.clear(); ++t < r; ) {
        var o = e[t];
        this.set(o[0], o[1]);
      }
    }
    ((ot.prototype.clear = Sn),
      (ot.prototype.delete = In),
      (ot.prototype.get = An),
      (ot.prototype.has = On),
      (ot.prototype.set = wn));
    var Se = ot,
      Ie = K(N, "Map");
    var Cn = function Tl() {
      ((this.size = 0),
        (this.__data__ = {
          hash: new fo(),
          map: new (Ie || Se)(),
          string: new fo(),
        }));
    };
    var kn = function xl(e) {
      var t = typeof e;
      return "string" == t || "number" == t || "symbol" == t || "boolean" == t
        ? "__proto__" !== e
        : null === e;
    };
    var Ae = function Sl(e, t) {
      var r = e.__data__;
      return kn(t) ? r["string" == typeof t ? "string" : "hash"] : r.map;
    };
    var Dn = function Il(e) {
      var t = Ae(this, e).delete(e);
      return ((this.size -= t ? 1 : 0), t);
    };
    var En = function Al(e) {
      return Ae(this, e).get(e);
    };
    var Rn = function Ol(e) {
      return Ae(this, e).has(e);
    };
    var Vn = function wl(e, t) {
      var r = Ae(this, e),
        o = r.size;
      return (r.set(e, t), (this.size += r.size == o ? 0 : 1), this);
    };
    function nt(e) {
      var t = -1,
        r = null == e ? 0 : e.length;
      for (this.clear(); ++t < r; ) {
        var o = e[t];
        this.set(o[0], o[1]);
      }
    }
    ((nt.prototype.clear = Cn),
      (nt.prototype.delete = Dn),
      (nt.prototype.get = En),
      (nt.prototype.has = Rn),
      (nt.prototype.set = Vn));
    var Be = nt;
    function co(e, t) {
      if ("function" != typeof e || (null != t && "function" != typeof t))
        throw new TypeError("Expected a function");
      var r = function () {
        var o = arguments,
          n = t ? t.apply(this, o) : o[0],
          i = r.cache;
        if (i.has(n)) return i.get(n);
        var a = e.apply(this, o);
        return ((r.cache = i.set(n, a) || i), a);
      };
      return ((r.cache = new (co.Cache || Be)()), r);
    }
    co.Cache = Be;
    var Nn = co;
    var Ln = function Dl(e) {
        var t = Nn(e, function (o) {
            return (500 === r.size && r.clear(), o);
          }),
          r = t.cache;
        return t;
      },
      El =
        /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
      Rl = /\\(\\)?/g,
      Vl = Ln(function (e) {
        var t = [];
        return (
          46 === e.charCodeAt(0) && t.push(""),
          e.replace(El, function (r, o, n, i) {
            t.push(n ? i.replace(Rl, "$1") : o || r);
          }),
          t
        );
      }),
      Mn = Vl;
    var $n = function Nl(e, t) {
        for (var r = -1, o = null == e ? 0 : e.length, n = Array(o); ++r < o; )
          n[r] = t(e[r], r, e);
        return n;
      },
      Bn = W ? W.prototype : void 0,
      Fn = Bn ? Bn.toString : void 0;
    var Xt = function Un(e) {
      if ("string" == typeof e) return e;
      if ($(e)) return $n(e, Un) + "";
      if (Te(e)) return Fn ? Fn.call(e) : "";
      var t = e + "";
      return "0" == t && 1 / e == -Infinity ? "-0" : t;
    };
    var Zt = function Ml(e) {
      return null == e ? "" : Xt(e);
    };
    var Oe = function $l(e, t) {
      return $(e) ? e : et(e, t) ? [e] : Mn(Zt(e));
    };
    var re = function Fl(e) {
      if ("string" == typeof e || Te(e)) return e;
      var t = e + "";
      return "0" == t && 1 / e == -Infinity ? "-0" : t;
    };
    var it = function Ul(e, t) {
      for (var r = 0, o = (t = Oe(t, e)).length; null != e && r < o; )
        e = e[re(t[r++])];
      return r && r == o ? e : void 0;
    };
    var at = function ql(e, t, r) {
      var o = null == e ? void 0 : it(e, t);
      return void 0 === o ? r : o;
    };
    var Qt = function zl(e, t) {
        return function (r) {
          return e(t(r));
        };
      },
      st = Qt(Object.getPrototypeOf, Object),
      Gl = Function.prototype,
      Hl = Object.prototype,
      qn = Gl.toString,
      Jl = Hl.hasOwnProperty,
      Yl = qn.call(Object);
    var Vt = function Xl(e) {
      if (!B(e) || "[object Object]" != X(e)) return !1;
      var t = st(e);
      if (null === t) return !0;
      var r = Jl.call(t, "constructor") && t.constructor;
      return "function" == typeof r && r instanceof r && qn.call(r) == Yl;
    };
    var er = function Zl(e) {
        var t = null == e ? 0 : e.length;
        return t ? e[t - 1] : void 0;
      },
      mo = new WeakMap(),
      zn = new WeakMap(),
      Wn = Symbol("pointerMeta"),
      Ql = {
        get(e, t) {
          if (t === Wn) return mo.get(e);
          let r = zn.get(e);
          r || ((r = new Map()), zn.set(e, r));
          let o = r.get(t);
          if (void 0 !== o) return o;
          let n = mo.get(e),
            i = Kn({ root: n.root, path: [...n.path, t] });
          return (r.set(t, i), i);
        },
      },
      pt = (e) => e[Wn],
      Z = (e) => {
        let { root: t, path: r } = pt(e);
        return { root: t, path: r };
      };
    function Kn(e) {
      var o;
      let t = { root: e.root, path: null != (o = e.path) ? o : [] },
        r = {};
      return (mo.set(r, t), new Proxy(r, Ql));
    }
    var ge = Kn,
      ae = (e) => e && !!pt(e);
    var tr = (e, t, r) => {
        if (0 === t.length) return r(e);
        if (Array.isArray(e)) {
          let [o, ...n] = t;
          ((o = parseInt(String(o), 10)), isNaN(o) && (o = 0));
          let i = e[o],
            a = tr(i, n, r);
          if (i === a) return e;
          let s = [...e];
          return (s.splice(o, 1, a), s);
        }
        if ("object" == typeof e && null !== e) {
          let [o, ...n] = t,
            i = e[o],
            a = tr(i, n, r);
          return i === a ? e : V(_({}, e), { [o]: a });
        }
        {
          let [o, ...n] = t;
          return { [o]: tr(void 0, n, r) };
        }
      },
      lt = class {
        constructor() {
          this._head = void 0;
        }
        peek() {
          return this._head && this._head.data;
        }
        pop() {
          let t = this._head;
          if (t) return ((this._head = t.next), t.data);
        }
        push(t) {
          let r = { next: this._head, data: t };
          this._head = r;
        }
      };
    function we(e) {
      return !(!e || !e.isPrism || !0 !== e.isPrism);
    }
    function Gn() {
      let t = new lt(),
        r = () => {};
      return {
        type: "Dataverse_discoveryMechanism",
        startIgnoringDependencies: () => {
          t.push(r);
        },
        stopIgnoringDependencies: () => {
          t.peek() !== r || t.pop();
        },
        reportResolutionStart: (p) => {
          let u = t.peek();
          (u && u(p), t.push(r));
        },
        reportResolutionEnd: (p) => {
          t.pop();
        },
        pushCollector: (p) => {
          t.push(p);
        },
        popCollector: (p) => {
          if (t.peek() !== p)
            throw new Error("Popped collector is not on top of the stack");
          t.pop();
        },
      };
    }
    var {
        startIgnoringDependencies: ut,
        stopIgnoringDependencies: ft,
        reportResolutionEnd: Hn,
        reportResolutionStart: Jn,
        pushCollector: Yn,
        popCollector: Xn,
      } = (function eu() {
        let e = "__dataverse_discoveryMechanism_sharedStack",
          t =
            "undefined" != typeof window || "undefined" != typeof window
              ? window
              : {};
        if (t) {
          let r = t[e];
          if (
            r &&
            "object" == typeof r &&
            "Dataverse_discoveryMechanism" === r.type
          )
            return r;
          {
            let o = Gn();
            return ((t[e] = o), o);
          }
        }
        return Gn();
      })(),
      Zn = () => {},
      Qn = class {
        constructor(t, r) {
          ((this._fn = t),
            (this._prismInstance = r),
            (this._didMarkDependentsAsStale = !1),
            (this._isFresh = !1),
            (this._cacheOfDendencyValues = new Map()),
            (this._dependents = new Set()),
            (this._dependencies = new Set()),
            (this._possiblyStaleDeps = new Set()),
            (this._scope = new rr(this)),
            (this._lastValue = void 0),
            (this._forciblySetToStale = !1),
            (this._reactToDependencyGoingStale = (t) => {
              (this._possiblyStaleDeps.add(t), this._markAsStale());
            }));
          for (let o of this._dependencies)
            o._addDependent(this._reactToDependencyGoingStale);
          (ut(), this.getValue(), ft());
        }
        get hasDependents() {
          return this._dependents.size > 0;
        }
        removeDependent(t) {
          this._dependents.delete(t);
        }
        addDependent(t) {
          this._dependents.add(t);
        }
        destroy() {
          for (let t of this._dependencies)
            t._removeDependent(this._reactToDependencyGoingStale);
          ti(this._scope);
        }
        getValue() {
          if (!this._isFresh) {
            let t = this._recalculate();
            ((this._lastValue = t),
              (this._isFresh = !0),
              (this._didMarkDependentsAsStale = !1),
              (this._forciblySetToStale = !1));
          }
          return this._lastValue;
        }
        _recalculate() {
          let t;
          if (!this._forciblySetToStale && this._possiblyStaleDeps.size > 0) {
            let n = !1;
            ut();
            for (let i of this._possiblyStaleDeps)
              if (this._cacheOfDendencyValues.get(i) !== i.getValue()) {
                n = !0;
                break;
              }
            if ((ft(), this._possiblyStaleDeps.clear(), !n))
              return this._lastValue;
          }
          let r = new Set();
          this._cacheOfDendencyValues.clear();
          let o = (n) => {
            (r.add(n), this._addDependency(n));
          };
          (Yn(o), G.push(this._scope));
          try {
            t = this._fn();
          } catch (n) {
            console.error(n);
          } finally {
            G.pop() !== this._scope &&
              console.warn("The Prism hook stack has slipped. This is a bug.");
          }
          Xn(o);
          for (let n of this._dependencies)
            r.has(n) || this._removeDependency(n);
          ((this._dependencies = r), ut());
          for (let n of r) this._cacheOfDendencyValues.set(n, n.getValue());
          return (ft(), t);
        }
        forceStale() {
          ((this._forciblySetToStale = !0), this._markAsStale());
        }
        _markAsStale() {
          if (!this._didMarkDependentsAsStale) {
            ((this._didMarkDependentsAsStale = !0), (this._isFresh = !1));
            for (let t of this._dependents) t(this._prismInstance);
          }
        }
        _addDependency(t) {
          this._dependencies.has(t) ||
            (this._dependencies.add(t),
            t._addDependent(this._reactToDependencyGoingStale));
        }
        _removeDependency(t) {
          !this._dependencies.has(t) ||
            (this._dependencies.delete(t),
            t._removeDependent(this._reactToDependencyGoingStale));
        }
      },
      tu = {},
      ei = class {
        constructor(t) {
          ((this._fn = t),
            (this.isPrism = !0),
            (this._state = { hot: !1, handle: void 0 }));
        }
        get isHot() {
          return this._state.hot;
        }
        onChange(t, r, o = !1) {
          let n = () => {
              t.onThisOrNextTick(a);
            },
            i = tu,
            a = () => {
              let l = this.getValue();
              l !== i && ((i = l), r(l));
            };
          return (
            this._addDependent(n),
            o && ((i = this.getValue()), r(i)),
            () => {
              (this._removeDependent(n),
                t.offThisOrNextTick(a),
                t.offNextTick(a));
            }
          );
        }
        onStale(t) {
          let o = () => t();
          return (
            this._addDependent(o),
            () => {
              this._removeDependent(o);
            }
          );
        }
        keepHot() {
          return this.onStale(() => {});
        }
        _addDependent(t) {
          (this._state.hot || this._goHot(),
            this._state.handle.addDependent(t));
        }
        _goHot() {
          let t = new Qn(this._fn, this);
          this._state = { hot: !0, handle: t };
        }
        _removeDependent(t) {
          let r = this._state;
          if (!r.hot) return;
          let o = r.handle;
          (o.removeDependent(t),
            o.hasDependents ||
              ((this._state = { hot: !1, handle: void 0 }), o.destroy()));
        }
        getValue() {
          Jn(this);
          let r,
            t = this._state;
          return (
            (r = t.hot
              ? t.handle.getValue()
              : (function uu(e) {
                  let r,
                    t = new nr();
                  G.push(t);
                  try {
                    r = e();
                  } catch (o) {
                    console.error(o);
                  } finally {
                    G.pop() !== t &&
                      console.warn(
                        "The Prism hook stack has slipped. This is a bug.",
                      );
                  }
                  return r;
                })(this._fn)),
            Hn(this),
            r
          );
        }
      },
      rr = class {
        constructor(t) {
          ((this._hotHandle = t),
            (this._refs = new Map()),
            (this.isPrismScope = !0),
            (this.subs = {}),
            (this.effects = new Map()),
            (this.memos = new Map()));
        }
        ref(t, r) {
          let o = this._refs.get(t);
          if (void 0 !== o) return o;
          {
            let n = { current: r };
            return (this._refs.set(t, n), n);
          }
        }
        effect(t, r, o) {
          let n = this.effects.get(t);
          (void 0 === n &&
            ((n = { cleanup: Zn, deps: void 0 }), this.effects.set(t, n)),
            ri(n.deps, o) &&
              (n.cleanup(),
              ut(),
              (n.cleanup = or(r, Zn).value),
              ft(),
              (n.deps = o)));
        }
        memo(t, r, o) {
          let n = this.memos.get(t);
          return (
            void 0 === n &&
              ((n = { cachedValue: null, deps: void 0 }), this.memos.set(t, n)),
            ri(n.deps, o) &&
              (ut(), (n.cachedValue = or(r, void 0).value), ft(), (n.deps = o)),
            n.cachedValue
          );
        }
        state(t, r) {
          let { value: o, setValue: n } = this.memo(
            "state/" + t,
            () => {
              let i = { current: r };
              return {
                value: i,
                setValue: (s) => {
                  ((i.current = s), this._hotHandle.forceStale());
                },
              };
            },
            [],
          );
          return [o.current, n];
        }
        sub(t) {
          return (
            this.subs[t] || (this.subs[t] = new rr(this._hotHandle)),
            this.subs[t]
          );
        }
        cleanupEffects() {
          for (let t of this.effects.values()) or(t.cleanup, void 0);
          this.effects.clear();
        }
        source(t, r) {
          return (
            this.effect(
              "$$source/blah",
              () =>
                t(() => {
                  this._hotHandle.forceStale();
                }),
              [t],
            ),
            r()
          );
        }
      };
    function ti(e) {
      for (let t of Object.values(e.subs)) ti(t);
      e.cleanupEffects();
    }
    function or(e, t) {
      try {
        return { value: e(), ok: !0 };
      } catch (r) {
        return (
          setTimeout(function () {
            throw r;
          }),
          { value: t, ok: !1 }
        );
      }
    }
    var G = new lt();
    function ri(e, t) {
      if (void 0 === e || void 0 === t) return !0;
      let r = e.length;
      if (r !== t.length) return !0;
      for (let o = 0; o < r; o++) if (e[o] !== t[o]) return !0;
      return !1;
    }
    function oi(e, t, r) {
      let o = G.peek();
      if (!o)
        throw new Error("prism.memo() is called outside of a prism() call.");
      return o.memo(e, t, r);
    }
    var se = (e) => new ei(e),
      nr = class {
        effect(t, r, o) {
          console.warn("prism.effect() does not run in cold prisms");
        }
        memo(t, r, o) {
          return r();
        }
        state(t, r) {
          return [r, () => {}];
        }
        ref(t, r) {
          return { current: r };
        }
        sub(t) {
          return new nr();
        }
        source(t, r) {
          return r();
        }
      };
    ((se.ref = function ru(e, t) {
      let r = G.peek();
      if (!r)
        throw new Error("prism.ref() is called outside of a prism() call.");
      return r.ref(e, t);
    }),
      (se.effect = function ou(e, t, r) {
        let o = G.peek();
        if (!o)
          throw new Error(
            "prism.effect() is called outside of a prism() call.",
          );
        return o.effect(e, t, r);
      }),
      (se.memo = oi),
      (se.ensurePrism = function iu() {
        if (!G.peek())
          throw new Error(
            "The parent function is called outside of a prism() call.",
          );
      }),
      (se.state = function nu(e, t) {
        let r = G.peek();
        if (!r)
          throw new Error("prism.state() is called outside of a prism() call.");
        return r.state(e, t);
      }),
      (se.scope = function au(e, t) {
        let r = G.peek();
        if (!r)
          throw new Error("prism.scope() is called outside of a prism() call.");
        let o = r.sub(e);
        G.push(o);
        let n = or(t, void 0).value;
        return (G.pop(), n);
      }),
      (se.sub = function su(e, t, r) {
        return oi(e, () => se(t), r).getValue();
      }),
      (se.inPrism = function pu() {
        return !!G.peek();
      }),
      (se.source = function lu(e, t) {
        let r = G.peek();
        if (!r)
          throw new Error(
            "prism.source() is called outside of a prism() call.",
          );
        return r.source(e, t);
      }));
    var Ce,
      o,
      g = se;
    (((o = Ce || (Ce = {}))[(o.Dict = 0)] = "Dict"),
      (o[(o.Array = 1)] = "Array"),
      (o[(o.Other = 2)] = "Other"));
    var go = (e) => (Array.isArray(e) ? 1 : Vt(e) ? 0 : 2),
      ni = (e, t, r = go(e)) =>
        (0 === r && "string" == typeof t) || (1 === r && fu(t)) ? e[t] : void 0,
      fu = (e) => {
        let t = "number" == typeof e ? e : parseInt(e, 10);
        return !isNaN(t) && t >= 0 && t < 1 / 0 && (0 | t) === t;
      },
      ir = class {
        constructor(t, r) {
          ((this._parent = t),
            (this._path = r),
            (this.children = new Map()),
            (this.identityChangeListeners = new Set()));
        }
        addIdentityChangeListener(t) {
          this.identityChangeListeners.add(t);
        }
        removeIdentityChangeListener(t) {
          (this.identityChangeListeners.delete(t), this._checkForGC());
        }
        removeChild(t) {
          (this.children.delete(t), this._checkForGC());
        }
        getChild(t) {
          return this.children.get(t);
        }
        getOrCreateChild(t) {
          let r = this.children.get(t);
          return (
            r ||
              ((r = r = new ir(this, this._path.concat([t]))),
              this.children.set(t, r)),
            r
          );
        }
        _checkForGC() {
          this.identityChangeListeners.size > 0 ||
            this.children.size > 0 ||
            (this._parent && this._parent.removeChild(er(this._path)));
        }
      },
      I = class {
        constructor(t) {
          ((this.$$isPointerToPrismProvider = !0),
            (this.pointer = ge({ root: this, path: [] })),
            (this.prism = this.pointerToPrism(this.pointer)),
            (this._onPointerValueChange = (t, r) => {
              let { path: o } = Z(t),
                n = this._getOrCreateScopeForPath(o);
              return (
                n.identityChangeListeners.add(r),
                () => {
                  n.identityChangeListeners.delete(r);
                }
              );
            }),
            (this._currentState = t),
            (this._rootScope = new ir(void 0, [])));
        }
        set(t) {
          let r = this._currentState;
          ((this._currentState = t), this._checkUpdates(this._rootScope, r, t));
        }
        get() {
          return this._currentState;
        }
        getByPointer(t) {
          let r = ae(t) ? t : t(this.pointer),
            o = Z(r).path;
          return this._getIn(o);
        }
        _getIn(t) {
          return 0 === t.length ? this.get() : at(this.get(), t);
        }
        reduce(t) {
          this.set(t(this.get()));
        }
        reduceByPointer(t, r) {
          let o = ae(t) ? t : t(this.pointer),
            n = Z(o).path,
            i = (function ho(e, t, r) {
              return 0 === t.length ? r(e) : tr(e, t, r);
            })(this.get(), n, r);
          this.set(i);
        }
        setByPointer(t, r) {
          this.reduceByPointer(t, () => r);
        }
        _checkUpdates(t, r, o) {
          if (r === o) return;
          for (let a of t.identityChangeListeners) a(o);
          if (0 === t.children.size) return;
          let n = go(r),
            i = go(o);
          if (2 !== n || n !== i)
            for (let [a, s] of t.children) {
              let l = ni(r, a, n),
                p = ni(o, a, i);
              this._checkUpdates(s, l, p);
            }
        }
        _getOrCreateScopeForPath(t) {
          let r = this._rootScope;
          for (let o of t) r = r.getOrCreateChild(o);
          return r;
        }
        pointerToPrism(t) {
          let { path: r } = Z(t),
            o = (i) => this._onPointerValueChange(t, i),
            n = () => this._getIn(r);
          return g(() => g.source(o, n));
        }
      },
      ii = new WeakMap();
    var ke = (e) => {
        let t = pt(e),
          r = ii.get(t);
        if (!r) {
          let o = t.root;
          if (
            !(function cu(e) {
              return (
                "object" == typeof e &&
                null !== e &&
                !0 === e.$$isPointerToPrismProvider
              );
            })(o)
          )
            throw new Error(
              "Cannot run pointerToPrism() on a pointer whose root is not an PointerToPrismProvider",
            );
          ((r = o.pointerToPrism(e)), ii.set(t, r));
        }
        return r;
      },
      j = (e) => (ae(e) ? ke(e).getValue() : we(e) ? e.getValue() : e),
      ct = class {
        constructor(t) {
          ((this._conf = t),
            (this._ticking = !1),
            (this._dormant = !0),
            (this._numberOfDormantTicks = 0),
            (this.__ticks = 0),
            (this._scheduledForThisOrNextTick = new Set()),
            (this._scheduledForNextTick = new Set()),
            (this._timeAtCurrentTick = 0));
        }
        get dormant() {
          return this._dormant;
        }
        onThisOrNextTick(t) {
          (this._scheduledForThisOrNextTick.add(t),
            this._dormant && this._goActive());
        }
        onNextTick(t) {
          (this._scheduledForNextTick.add(t),
            this._dormant && this._goActive());
        }
        offThisOrNextTick(t) {
          this._scheduledForThisOrNextTick.delete(t);
        }
        offNextTick(t) {
          this._scheduledForNextTick.delete(t);
        }
        get time() {
          return this._ticking ? this._timeAtCurrentTick : performance.now();
        }
        _goActive() {
          var t, r;
          !this._dormant ||
            ((this._dormant = !1),
            null == (r = null == (t = this._conf) ? void 0 : t.onActive) ||
              r.call(t));
        }
        _goDormant() {
          var t, r;
          this._dormant ||
            ((this._dormant = !0),
            (this._numberOfDormantTicks = 0),
            null == (r = null == (t = this._conf) ? void 0 : t.onDormant) ||
              r.call(t));
        }
        tick(t = performance.now()) {
          if (
            (this.__ticks++,
            !this._dormant &&
              0 === this._scheduledForNextTick.size &&
              0 === this._scheduledForThisOrNextTick.size &&
              (this._numberOfDormantTicks++, this._numberOfDormantTicks >= 180))
          )
            this._goDormant();
          else {
            ((this._ticking = !0), (this._timeAtCurrentTick = t));
            for (let r of this._scheduledForNextTick)
              this._scheduledForThisOrNextTick.add(r);
            (this._scheduledForNextTick.clear(),
              this._tick(0),
              (this._ticking = !1));
          }
        }
        _tick(t) {
          let r = this.time;
          if (
            (t > 10 && console.warn("_tick() recursing for 10 times"), t > 100)
          )
            throw new Error("Maximum recursion limit for _tick()");
          let o = this._scheduledForThisOrNextTick;
          this._scheduledForThisOrNextTick = new Set();
          for (let n of o) n(r);
          if (this._scheduledForThisOrNextTick.size > 0)
            return this._tick(t + 1);
        }
      },
      Fe = class {
        constructor(t) {
          ((this.$$isPointerToPrismProvider = !0),
            (this._currentPointerBox = new I(t)),
            (this.pointer = ge({ root: this, path: [] })));
        }
        setPointer(t) {
          this._currentPointerBox.set(t);
        }
        pointerToPrism(t) {
          let { path: r } = pt(t);
          return g(() => {
            let o = this._currentPointerBox.prism.getValue(),
              n = r.reduce((i, a) => i[a], o);
            return j(n);
          });
        }
      },
      mu = new (class {
        constructor() {
          d(this, "atom", new I({ projects: {} }));
        }
        add(t, r) {
          this.atom.setByPointer((o) => o.projects[t], r);
        }
        get(t) {
          return this.atom.get().projects[t];
        }
        has(t) {
          return !!this.get(t);
        }
        remove(t) {
          this.atom.setByPointer((r) => r.projects[t], void 0);
        }
      })(),
      Ue = mu,
      si = new WeakMap();
    function T(e) {
      return si.get(e);
    }
    function ue(e, t) {
      si.set(e, t);
    }
    var ar = [];
    function sr(e, t) {
      return 0 === t.length ? e : at(e, t);
    }
    var De = class {
        constructor() {
          d(this, "_values", {});
        }
        get(t, r) {
          if (this.has(t)) return this._values[t];
          {
            let o = r();
            return ((this._values[t] = o), o);
          }
        }
        has(t) {
          return this._values.hasOwnProperty(t);
        }
      },
      hu = (function () {
        try {
          var e = K(Object, "defineProperty");
          return (e({}, "", {}), e);
        } catch (t) {}
      })(),
      yo = hu;
    var dt = function gu(e, t, r) {
        "__proto__" == t && yo
          ? yo(e, t, {
              configurable: !0,
              enumerable: !0,
              value: r,
              writable: !0,
            })
          : (e[t] = r);
      },
      bu = Object.prototype.hasOwnProperty;
    var mt = function Pu(e, t, r) {
        var o = e[t];
        (!bu.call(e, t) || !rt(o, r) || (void 0 === r && !(t in e))) &&
          dt(e, t, r);
      },
      _u = /^(?:0|[1-9]\d*)$/;
    var ht = function vu(e, t) {
      var r = typeof e;
      return (
        !!(t = null == t ? 9007199254740991 : t) &&
        ("number" == r || ("symbol" != r && _u.test(e))) &&
        e > -1 &&
        e % 1 == 0 &&
        e < t
      );
    };
    var pi = function Tu(e, t, r, o) {
      if (!M(e)) return e;
      for (
        var n = -1, i = (t = Oe(t, e)).length, a = i - 1, s = e;
        null != s && ++n < i;
      ) {
        var l = re(t[n]),
          p = r;
        if ("__proto__" === l || "constructor" === l || "prototype" === l)
          return e;
        if (n != a) {
          var u = s[l];
          void 0 === (p = o ? o(u, l, s) : void 0) &&
            (p = M(u) ? u : ht(t[n + 1]) ? [] : {});
        }
        (mt(s, l, p), (s = s[l]));
      }
      return e;
    };
    var li = function xu(e, t, r) {
        return null == e ? e : pi(e, t, r);
      },
      bo = new WeakMap();
    function jo(e) {
      if (bo.has(e)) return bo.get(e);
      let t =
        "compound" === e.type
          ? (function Iu(e) {
              let t = {};
              for (let [r, o] of Object.entries(e.props)) t[r] = jo(o);
              return t;
            })(e)
          : "enum" === e.type
            ? (function Su(e) {
                let t = { $case: e.defaultCase };
                for (let [r, o] of Object.entries(e.cases)) t[r] = jo(o);
                return t;
              })(e)
            : e.default;
      return (bo.set(e, t), t);
    }
    var ci = Gt(fi());
    function _o(e, t, r) {
      return g(() => {
        let o = j(t);
        return g
          .memo(
            "driver",
            () =>
              o
                ? "BasicKeyframedTrack" === o.type
                  ? (function Ou(e, t, r) {
                      return g(() => {
                        let o = g.ref("state", { started: !1 }),
                          n = o.current,
                          i = r.getValue();
                        return (
                          (!n.started || i < n.validFrom || n.validTo <= i) &&
                            (o.current = n =
                              (function wu(e, t, r) {
                                let o = t.getValue();
                                if (0 === r.keyframes.length)
                                  return {
                                    started: !0,
                                    validFrom: -1 / 0,
                                    validTo: 1 / 0,
                                    der: di,
                                  };
                                let n = 0;
                                for (;;) {
                                  let i = r.keyframes[n];
                                  if (!i) return qe.error;
                                  let a = n === r.keyframes.length - 1;
                                  if (o < i.position)
                                    return 0 === n
                                      ? qe.beforeFirstKeyframe(i)
                                      : qe.error;
                                  if (i.position === o)
                                    return a
                                      ? qe.lastKeyframe(i)
                                      : qe.between(i, r.keyframes[n + 1], t);
                                  if (n === r.keyframes.length - 1)
                                    return qe.lastKeyframe(i);
                                  {
                                    let s = n + 1;
                                    if (r.keyframes[s].position <= o) {
                                      n = s;
                                      continue;
                                    }
                                    return qe.between(i, r.keyframes[n + 1], t);
                                  }
                                }
                              })(0, r, t)),
                          n.der.getValue()
                        );
                      });
                    })(0, o, r)
                  : (e.logger.error("Track type not yet supported."),
                    g(() => {}))
                : g(() => {}),
            [o],
          )
          .getValue();
      });
    }
    var di = g(() => {});
    var qe = {
      beforeFirstKeyframe: (e) => ({
        started: !0,
        validFrom: -1 / 0,
        validTo: e.position,
        der: g(() => ({ left: e.value, progression: 0 })),
      }),
      lastKeyframe: (e) => ({
        started: !0,
        validFrom: e.position,
        validTo: 1 / 0,
        der: g(() => ({ left: e.value, progression: 0 })),
      }),
      between(e, t, r) {
        if (!e.connectedRight)
          return {
            started: !0,
            validFrom: e.position,
            validTo: t.position,
            der: g(() => ({ left: e.value, progression: 0 })),
          };
        let o = (i) => (i - e.position) / (t.position - e.position);
        if (!e.type || "bezier" === e.type) {
          let i = new ci.default(
              e.handles[2],
              e.handles[3],
              t.handles[0],
              t.handles[1],
            ),
            a = g(() => {
              let s = o(r.getValue()),
                l = i.solveSimple(s);
              return { left: e.value, right: t.value, progression: l };
            });
          return {
            started: !0,
            validFrom: e.position,
            validTo: t.position,
            der: a,
          };
        }
        let n = g(() => {
          let i = o(r.getValue()),
            a = Math.floor(i);
          return { left: e.value, right: t.value, progression: a };
        });
        return {
          started: !0,
          validFrom: e.position,
          validTo: t.position,
          der: n,
        };
      },
      error: { started: !0, validFrom: -1 / 0, validTo: 1 / 0, der: di },
    };
    function gt(e, t, r) {
      let n = r.get(e);
      if (n && n.override === t) return n.merged;
      let i = _({}, e);
      for (let a of Object.keys(t)) {
        let s = t[a],
          l = e[a];
        i[a] =
          "object" == typeof s && "object" == typeof l
            ? gt(l, s, r)
            : void 0 === s
              ? l
              : s;
      }
      return (r.set(e, { override: t, merged: i }), i);
    }
    function ze(e, t) {
      let r = e;
      for (let o of t) r = r[o];
      return r;
    }
    var Cu = /\s/;
    var hi = function ku(e) {
        for (var t = e.length; t-- && Cu.test(e.charAt(t)); );
        return t;
      },
      Du = /^\s+/;
    var gi = function Eu(e) {
        return e && e.slice(0, hi(e) + 1).replace(Du, "");
      },
      Ru = /^[-+]0x[0-9a-f]+$/i,
      Vu = /^0b[01]+$/i,
      Nu = /^0o[0-7]+$/i,
      Lu = parseInt;
    var ye = function Mu(e) {
      if ("number" == typeof e) return e;
      if (Te(e)) return NaN;
      if (M(e)) {
        var t = "function" == typeof e.valueOf ? e.valueOf() : e;
        e = M(t) ? t + "" : t;
      }
      if ("string" != typeof e) return 0 === e ? e : +e;
      e = gi(e);
      var r = Vu.test(e);
      return r || Nu.test(e)
        ? Lu(e.slice(2), r ? 2 : 8)
        : Ru.test(e)
          ? NaN
          : +e;
    };
    var Pi = function Bu(e) {
      return e
        ? Infinity === (e = ye(e)) || -Infinity === e
          ? 17976931348623157e292 * (e < 0 ? -1 : 1)
          : e == e
            ? e
            : 0
        : 0 === e
          ? e
          : 0;
    };
    var pr = function Fu(e) {
      var t = Pi(e),
        r = t % 1;
      return t == t ? (r ? t - r : t) : 0;
    };
    var ji = function Uu(e) {
        return e;
      },
      lr = K(N, "WeakMap"),
      _i = Object.create,
      zu = (function () {
        function e() {}
        return function (t) {
          if (!M(t)) return {};
          if (_i) return _i(t);
          e.prototype = t;
          var r = new e();
          return ((e.prototype = void 0), r);
        };
      })(),
      vi = zu;
    var Ti = function Wu(e, t) {
      var r = -1,
        o = e.length;
      for (t || (t = Array(o)); ++r < o; ) t[r] = e[r];
      return t;
    };
    var xi = function Ku(e, t) {
      for (
        var r = -1, o = null == e ? 0 : e.length;
        ++r < o && !1 !== t(e[r], r, e);
      );
      return e;
    };
    var Ee = function Gu(e, t, r, o) {
      var n = !r;
      r || (r = {});
      for (var i = -1, a = t.length; ++i < a; ) {
        var s = t[i],
          l = o ? o(r[s], e[s], s, r, e) : void 0;
        (void 0 === l && (l = e[s]), n ? dt(r, s, l) : mt(r, s, l));
      }
      return r;
    };
    var yt = function Ju(e) {
      return (
        "number" == typeof e && e > -1 && e % 1 == 0 && e <= 9007199254740991
      );
    };
    var ur = function Yu(e) {
        return null != e && yt(e.length) && !Jt(e);
      },
      Xu = Object.prototype;
    var bt = function Zu(e) {
      var t = e && e.constructor;
      return e === (("function" == typeof t && t.prototype) || Xu);
    };
    var Si = function Qu(e, t) {
      for (var r = -1, o = Array(e); ++r < e; ) o[r] = t(r);
      return o;
    };
    var vo = function tf(e) {
        return B(e) && "[object Arguments]" == X(e);
      },
      Ii = Object.prototype,
      rf = Ii.hasOwnProperty,
      of = Ii.propertyIsEnumerable,
      nf = vo(
        (function () {
          return arguments;
        })(),
      )
        ? vo
        : function (e) {
            return B(e) && rf.call(e, "callee") && !of.call(e, "callee");
          },
      fr = nf;
    var Ai = function af() {
        return !1;
      },
      Oi =
        "object" == typeof exports && exports && !exports.nodeType && exports,
      wi =
        Oi && "object" == typeof module && module && !module.nodeType && module,
      Ci = wi && wi.exports === Oi ? N.Buffer : void 0,
      We = (Ci ? Ci.isBuffer : void 0) || Ai,
      E = {};
    ((E["[object Float32Array]"] =
      E["[object Float64Array]"] =
      E["[object Int8Array]"] =
      E["[object Int16Array]"] =
      E["[object Int32Array]"] =
      E["[object Uint8Array]"] =
      E["[object Uint8ClampedArray]"] =
      E["[object Uint16Array]"] =
      E["[object Uint32Array]"] =
        !0),
      (E["[object Arguments]"] =
        E["[object Array]"] =
        E["[object ArrayBuffer]"] =
        E["[object Boolean]"] =
        E["[object DataView]"] =
        E["[object Date]"] =
        E["[object Error]"] =
        E["[object Function]"] =
        E["[object Map]"] =
        E["[object Number]"] =
        E["[object Object]"] =
        E["[object RegExp]"] =
        E["[object Set]"] =
        E["[object String]"] =
        E["[object WeakMap]"] =
          !1));
    var ki = function Rf(e) {
      return B(e) && yt(e.length) && !!E[X(e)];
    };
    var Pt = function Vf(e) {
        return function (t) {
          return e(t);
        };
      },
      Di =
        "object" == typeof exports && exports && !exports.nodeType && exports,
      Nt =
        Di && "object" == typeof module && module && !module.nodeType && module,
      To = Nt && Nt.exports === Di && Ht.process,
      be = (function () {
        try {
          return (
            (Nt && Nt.require && Nt.require("util").types) ||
            (To && To.binding && To.binding("util"))
          );
        } catch (t) {}
      })(),
      Ei = be && be.isTypedArray,
      cr = Ei ? Pt(Ei) : ki,
      Bf = Object.prototype.hasOwnProperty;
    var dr = function Ff(e, t) {
        var r = $(e),
          o = !r && fr(e),
          n = !r && !o && We(e),
          i = !r && !o && !n && cr(e),
          a = r || o || n || i,
          s = a ? Si(e.length, String) : [],
          l = s.length;
        for (var p in e)
          (t || Bf.call(e, p)) &&
            (!a ||
              !(
                "length" == p ||
                (n && ("offset" == p || "parent" == p)) ||
                (i &&
                  ("buffer" == p || "byteLength" == p || "byteOffset" == p)) ||
                ht(p, l)
              )) &&
            s.push(p);
        return s;
      },
      Ri = Qt(Object.keys, Object),
      zf = Object.prototype.hasOwnProperty;
    var Vi = function Wf(e) {
      if (!bt(e)) return Ri(e);
      var t = [];
      for (var r in Object(e)) zf.call(e, r) && "constructor" != r && t.push(r);
      return t;
    };
    var fe = function Kf(e) {
      return ur(e) ? dr(e) : Vi(e);
    };
    var Ni = function Gf(e) {
        var t = [];
        if (null != e) for (var r in Object(e)) t.push(r);
        return t;
      },
      Jf = Object.prototype.hasOwnProperty;
    var Li = function Yf(e) {
      if (!M(e)) return Ni(e);
      var t = bt(e),
        r = [];
      for (var o in e)
        ("constructor" == o && (t || !Jf.call(e, o))) || r.push(o);
      return r;
    };
    var jt = function Xf(e) {
      return ur(e) ? dr(e, !0) : Li(e);
    };
    var mr = function Zf(e, t) {
      for (var r = -1, o = t.length, n = e.length; ++r < o; ) e[n + r] = t[r];
      return e;
    };
    var hr = function Qf(e, t, r) {
      var o = -1,
        n = e.length;
      (t < 0 && (t = -t > n ? 0 : n + t),
        (r = r > n ? n : r) < 0 && (r += n),
        (n = t > r ? 0 : (r - t) >>> 0),
        (t >>>= 0));
      for (var i = Array(n); ++o < n; ) i[o] = e[o + t];
      return i;
    };
    var Mi = function ec(e, t, r) {
        var o = e.length;
        return ((r = void 0 === r ? o : r), !t && r >= o ? e : hr(e, t, r));
      },
      pc = RegExp(
        "[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]",
      );
    var _t = function lc(e) {
      return pc.test(e);
    };
    var $i = function uc(e) {
        return e.split("");
      },
      Bi = "\\ud800-\\udfff",
      gc = "[" + Bi + "]",
      xo = "[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",
      So = "\\ud83c[\\udffb-\\udfff]",
      Fi = "[^" + Bi + "]",
      Ui = "(?:\\ud83c[\\udde6-\\uddff]){2}",
      qi = "[\\ud800-\\udbff][\\udc00-\\udfff]",
      zi = "(?:" + xo + "|" + So + ")" + "?",
      Wi = "[\\ufe0e\\ufe0f]?",
      jc =
        Wi +
        zi +
        ("(?:\\u200d(?:" + [Fi, Ui, qi].join("|") + ")" + Wi + zi + ")*"),
      _c = "(?:" + [Fi + xo + "?", xo, Ui, qi, gc].join("|") + ")",
      vc = RegExp(So + "(?=" + So + ")|" + _c + jc, "g");
    var Ki = function Tc(e) {
      return e.match(vc) || [];
    };
    var Gi = function xc(e) {
      return _t(e) ? Ki(e) : $i(e);
    };
    var Hi = function Sc(e, t, r) {
      return (
        e == e &&
          (void 0 !== r && (e = e <= r ? e : r),
          void 0 !== t && (e = e >= t ? e : t)),
        e
      );
    };
    var Lt = function Ic(e, t, r) {
      return (
        void 0 === r && ((r = t), (t = void 0)),
        void 0 !== r && (r = (r = ye(r)) == r ? r : 0),
        void 0 !== t && (t = (t = ye(t)) == t ? t : 0),
        Hi(ye(e), t, r)
      );
    };
    var Ji = function Ac() {
      ((this.__data__ = new Se()), (this.size = 0));
    };
    var Yi = function Oc(e) {
      var t = this.__data__,
        r = t.delete(e);
      return ((this.size = t.size), r);
    };
    var Xi = function wc(e) {
      return this.__data__.get(e);
    };
    var Zi = function Cc(e) {
      return this.__data__.has(e);
    };
    var Qi = function Dc(e, t) {
      var r = this.__data__;
      if (r instanceof Se) {
        var o = r.__data__;
        if (!Ie || o.length < 199)
          return (o.push([e, t]), (this.size = ++r.size), this);
        r = this.__data__ = new Be(o);
      }
      return (r.set(e, t), (this.size = r.size), this);
    };
    function vt(e) {
      var t = (this.__data__ = new Se(e));
      this.size = t.size;
    }
    ((vt.prototype.clear = Ji),
      (vt.prototype.delete = Yi),
      (vt.prototype.get = Xi),
      (vt.prototype.has = Zi),
      (vt.prototype.set = Qi));
    var Re = vt;
    var ea = function Ec(e, t) {
      return e && Ee(t, fe(t), e);
    };
    var ta = function Rc(e, t) {
        return e && Ee(t, jt(t), e);
      },
      ra =
        "object" == typeof exports && exports && !exports.nodeType && exports,
      oa =
        ra && "object" == typeof module && module && !module.nodeType && module,
      na = oa && oa.exports === ra ? N.Buffer : void 0,
      ia = na ? na.allocUnsafe : void 0;
    var aa = function Nc(e, t) {
      if (t) return e.slice();
      var r = e.length,
        o = ia ? ia(r) : new e.constructor(r);
      return (e.copy(o), o);
    };
    var sa = function Lc(e, t) {
      for (var r = -1, o = null == e ? 0 : e.length, n = 0, i = []; ++r < o; ) {
        var a = e[r];
        t(a, r, e) && (i[n++] = a);
      }
      return i;
    };
    var gr = function Mc() {
        return [];
      },
      Bc = Object.prototype.propertyIsEnumerable,
      pa = Object.getOwnPropertySymbols,
      Fc = pa
        ? function (e) {
            return null == e
              ? []
              : ((e = Object(e)),
                sa(pa(e), function (t) {
                  return Bc.call(e, t);
                }));
          }
        : gr,
      Tt = Fc;
    var la = function Uc(e, t) {
        return Ee(e, Tt(e), t);
      },
      zc = Object.getOwnPropertySymbols
        ? function (e) {
            for (var t = []; e; ) (mr(t, Tt(e)), (e = st(e)));
            return t;
          }
        : gr,
      yr = zc;
    var ua = function Wc(e, t) {
      return Ee(e, yr(e), t);
    };
    var br = function Kc(e, t, r) {
      var o = t(e);
      return $(e) ? o : mr(o, r(e));
    };
    var Mt = function Gc(e) {
      return br(e, fe, Tt);
    };
    var fa = function Hc(e) {
        return br(e, jt, yr);
      },
      Pr = K(N, "DataView"),
      jr = K(N, "Promise"),
      _r = K(N, "Set"),
      ca = "[object Map]",
      da = "[object Promise]",
      ma = "[object Set]",
      ha = "[object WeakMap]",
      ga = "[object DataView]",
      Qc = me(Pr),
      ed = me(Ie),
      td = me(jr),
      rd = me(_r),
      od = me(lr),
      Ke = X;
    ((Pr && Ke(new Pr(new ArrayBuffer(1))) != ga) ||
      (Ie && Ke(new Ie()) != ca) ||
      (jr && Ke(jr.resolve()) != da) ||
      (_r && Ke(new _r()) != ma) ||
      (lr && Ke(new lr()) != ha)) &&
      (Ke = function (e) {
        var t = X(e),
          r = "[object Object]" == t ? e.constructor : void 0,
          o = r ? me(r) : "";
        if (o)
          switch (o) {
            case Qc:
              return ga;
            case ed:
              return ca;
            case td:
              return da;
            case rd:
              return ma;
            case od:
              return ha;
          }
        return t;
      });
    var Pe = Ke,
      id = Object.prototype.hasOwnProperty;
    var ya = function ad(e) {
        var t = e.length,
          r = new e.constructor(t);
        return (
          t &&
            "string" == typeof e[0] &&
            id.call(e, "index") &&
            ((r.index = e.index), (r.input = e.input)),
          r
        );
      },
      xt = N.Uint8Array;
    var St = function pd(e) {
      var t = new e.constructor(e.byteLength);
      return (new xt(t).set(new xt(e)), t);
    };
    var ba = function ld(e, t) {
        var r = t ? St(e.buffer) : e.buffer;
        return new e.constructor(r, e.byteOffset, e.byteLength);
      },
      ud = /\w*$/;
    var Pa = function fd(e) {
        var t = new e.constructor(e.source, ud.exec(e));
        return ((t.lastIndex = e.lastIndex), t);
      },
      ja = W ? W.prototype : void 0,
      _a = ja ? ja.valueOf : void 0;
    var va = function cd(e) {
      return _a ? Object(_a.call(e)) : {};
    };
    var Ta = function dd(e, t) {
      var r = t ? St(e.buffer) : e.buffer;
      return new e.constructor(r, e.byteOffset, e.length);
    };
    var xa = function Ed(e, t, r) {
      var o = e.constructor;
      switch (t) {
        case "[object ArrayBuffer]":
          return St(e);
        case "[object Boolean]":
        case "[object Date]":
          return new o(+e);
        case "[object DataView]":
          return ba(e, r);
        case "[object Float32Array]":
        case "[object Float64Array]":
        case "[object Int8Array]":
        case "[object Int16Array]":
        case "[object Int32Array]":
        case "[object Uint8Array]":
        case "[object Uint8ClampedArray]":
        case "[object Uint16Array]":
        case "[object Uint32Array]":
          return Ta(e, r);
        case "[object Map]":
        case "[object Set]":
          return new o();
        case "[object Number]":
        case "[object String]":
          return new o(e);
        case "[object RegExp]":
          return Pa(e);
        case "[object Symbol]":
          return va(e);
      }
    };
    var Sa = function Rd(e) {
      return "function" != typeof e.constructor || bt(e) ? {} : vi(st(e));
    };
    var Ia = function Nd(e) {
        return B(e) && "[object Map]" == Pe(e);
      },
      Aa = be && be.isMap,
      Oa = Aa ? Pt(Aa) : Ia;
    var wa = function $d(e) {
        return B(e) && "[object Set]" == Pe(e);
      },
      Ca = be && be.isSet,
      ka = Ca ? Pt(Ca) : wa,
      Da = "[object Arguments]",
      Ea = "[object Function]",
      Ra = "[object Object]",
      C = {};
    ((C[Da] =
      C["[object Array]"] =
      C["[object ArrayBuffer]"] =
      C["[object DataView]"] =
      C["[object Boolean]"] =
      C["[object Date]"] =
      C["[object Float32Array]"] =
      C["[object Float64Array]"] =
      C["[object Int8Array]"] =
      C["[object Int16Array]"] =
      C["[object Int32Array]"] =
      C["[object Map]"] =
      C["[object Number]"] =
      C[Ra] =
      C["[object RegExp]"] =
      C["[object Set]"] =
      C["[object String]"] =
      C["[object Symbol]"] =
      C["[object Uint8Array]"] =
      C["[object Uint8ClampedArray]"] =
      C["[object Uint16Array]"] =
      C["[object Uint32Array]"] =
        !0),
      (C["[object Error]"] = C[Ea] = C["[object WeakMap]"] = !1));
    var Va = function vr(e, t, r, o, n, i) {
      var a,
        s = 1 & t,
        l = 2 & t,
        p = 4 & t;
      if ((r && (a = n ? r(e, o, n, i) : r(e)), void 0 !== a)) return a;
      if (!M(e)) return e;
      var u = $(e);
      if (u) {
        if (((a = ya(e)), !s)) return Ti(e, a);
      } else {
        var c = Pe(e),
          m = c == Ea || "[object GeneratorFunction]" == c;
        if (We(e)) return aa(e, s);
        if (c == Ra || c == Da || (m && !n)) {
          if (((a = l || m ? {} : Sa(e)), !s))
            return l ? ua(e, ta(a, e)) : la(e, ea(a, e));
        } else {
          if (!C[c]) return n ? e : {};
          a = xa(e, c, s);
        }
      }
      i || (i = new Re());
      var f = i.get(e);
      if (f) return f;
      (i.set(e, a),
        ka(e)
          ? e.forEach(function (b) {
              a.add(vr(b, t, r, b, e, i));
            })
          : Oa(e) &&
            e.forEach(function (b, P) {
              a.set(P, vr(b, t, r, P, e, i));
            }));
      var v = u ? void 0 : (p ? (l ? fa : Mt) : l ? jt : fe)(e);
      return (
        xi(v || e, function (b, P) {
          (v && (b = e[(P = b)]), mt(a, P, vr(b, t, r, P, e, i)));
        }),
        a
      );
    };
    var Io = function hm(e) {
      return Va(e, 5);
    };
    var Na = function ym(e) {
      return (this.__data__.set(e, "__lodash_hash_undefined__"), this);
    };
    var La = function bm(e) {
      return this.__data__.has(e);
    };
    function Tr(e) {
      var t = -1,
        r = null == e ? 0 : e.length;
      for (this.__data__ = new Be(); ++t < r; ) this.add(e[t]);
    }
    ((Tr.prototype.add = Tr.prototype.push = Na), (Tr.prototype.has = La));
    var Ma = Tr;
    var $a = function Pm(e, t) {
      for (var r = -1, o = null == e ? 0 : e.length; ++r < o; )
        if (t(e[r], r, e)) return !0;
      return !1;
    };
    var Ba = function jm(e, t) {
      return e.has(t);
    };
    var xr = function Tm(e, t, r, o, n, i) {
      var a = 1 & r,
        s = e.length,
        l = t.length;
      if (s != l && !(a && l > s)) return !1;
      var p = i.get(e),
        u = i.get(t);
      if (p && u) return p == t && u == e;
      var c = -1,
        m = !0,
        f = 2 & r ? new Ma() : void 0;
      for (i.set(e, t), i.set(t, e); ++c < s; ) {
        var y = e[c],
          v = t[c];
        if (o) var b = a ? o(v, y, c, t, e, i) : o(y, v, c, e, t, i);
        if (void 0 !== b) {
          if (b) continue;
          m = !1;
          break;
        }
        if (f) {
          if (
            !$a(t, function (P, x) {
              if (!Ba(f, x) && (y === P || n(y, P, r, o, i))) return f.push(x);
            })
          ) {
            m = !1;
            break;
          }
        } else if (y !== v && !n(y, v, r, o, i)) {
          m = !1;
          break;
        }
      }
      return (i.delete(e), i.delete(t), m);
    };
    var Fa = function xm(e) {
      var t = -1,
        r = Array(e.size);
      return (
        e.forEach(function (o, n) {
          r[++t] = [n, o];
        }),
        r
      );
    };
    var Ua = function Sm(e) {
        var t = -1,
          r = Array(e.size);
        return (
          e.forEach(function (o) {
            r[++t] = o;
          }),
          r
        );
      },
      qa = W ? W.prototype : void 0,
      Ao = qa ? qa.valueOf : void 0;
    var za = function $m(e, t, r, o, n, i, a) {
        switch (r) {
          case "[object DataView]":
            if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
              return !1;
            ((e = e.buffer), (t = t.buffer));
          case "[object ArrayBuffer]":
            return !(e.byteLength != t.byteLength || !i(new xt(e), new xt(t)));
          case "[object Boolean]":
          case "[object Date]":
          case "[object Number]":
            return rt(+e, +t);
          case "[object Error]":
            return e.name == t.name && e.message == t.message;
          case "[object RegExp]":
          case "[object String]":
            return e == t + "";
          case "[object Map]":
            var s = Fa;
          case "[object Set]":
            var l = 1 & o;
            if ((s || (s = Ua), e.size != t.size && !l)) return !1;
            var p = a.get(e);
            if (p) return p == t;
            ((o |= 2), a.set(e, t));
            var u = xr(s(e), s(t), o, n, i, a);
            return (a.delete(e), u);
          case "[object Symbol]":
            if (Ao) return Ao.call(e) == Ao.call(t);
        }
        return !1;
      },
      Um = Object.prototype.hasOwnProperty;
    var Wa = function qm(e, t, r, o, n, i) {
        var a = 1 & r,
          s = Mt(e),
          l = s.length;
        if (l != Mt(t).length && !a) return !1;
        for (var c = l; c--; ) {
          var m = s[c];
          if (!(a ? m in t : Um.call(t, m))) return !1;
        }
        var f = i.get(e),
          y = i.get(t);
        if (f && y) return f == t && y == e;
        var v = !0;
        (i.set(e, t), i.set(t, e));
        for (var b = a; ++c < l; ) {
          var P = e[(m = s[c])],
            x = t[m];
          if (o) var O = a ? o(x, P, m, t, e, i) : o(P, x, m, e, t, i);
          if (!(void 0 === O ? P === x || n(P, x, r, o, i) : O)) {
            v = !1;
            break;
          }
          b || (b = "constructor" == m);
        }
        if (v && !b) {
          var U = e.constructor,
            q = t.constructor;
          U != q &&
            "constructor" in e &&
            "constructor" in t &&
            !(
              "function" == typeof U &&
              U instanceof U &&
              "function" == typeof q &&
              q instanceof q
            ) &&
            (v = !1);
        }
        return (i.delete(e), i.delete(t), v);
      },
      Ka = "[object Arguments]",
      Ga = "[object Array]",
      Sr = "[object Object]",
      Ha = Object.prototype.hasOwnProperty;
    var Ja = function Km(e, t, r, o, n, i) {
      var a = $(e),
        s = $(t),
        l = a ? Ga : Pe(e),
        p = s ? Ga : Pe(t),
        u = (l = l == Ka ? Sr : l) == Sr,
        c = (p = p == Ka ? Sr : p) == Sr,
        m = l == p;
      if (m && We(e)) {
        if (!We(t)) return !1;
        ((a = !0), (u = !1));
      }
      if (m && !u)
        return (
          i || (i = new Re()),
          a || cr(e) ? xr(e, t, r, o, n, i) : za(e, t, l, r, o, n, i)
        );
      if (!(1 & r)) {
        var f = u && Ha.call(e, "__wrapped__"),
          y = c && Ha.call(t, "__wrapped__");
        if (f || y) {
          var v = f ? e.value() : e,
            b = y ? t.value() : t;
          return (i || (i = new Re()), n(v, b, r, o, i));
        }
      }
      return !!m && (i || (i = new Re()), Wa(e, t, r, o, n, i));
    };
    var Ir = function Ya(e, t, r, o, n) {
      return (
        e === t ||
        (null == e || null == t || (!B(e) && !B(t))
          ? e != e && t != t
          : Ja(e, t, r, o, Ya, n))
      );
    };
    var Xa = function Jm(e, t, r, o) {
      var n = r.length,
        i = n,
        a = !o;
      if (null == e) return !i;
      for (e = Object(e); n--; ) {
        var s = r[n];
        if (a && s[2] ? s[1] !== e[s[0]] : !(s[0] in e)) return !1;
      }
      for (; ++n < i; ) {
        var l = (s = r[n])[0],
          p = e[l],
          u = s[1];
        if (a && s[2]) {
          if (void 0 === p && !(l in e)) return !1;
        } else {
          var c = new Re();
          if (o) var m = o(p, u, l, e, t, c);
          if (!(void 0 === m ? Ir(u, p, 3, o, c) : m)) return !1;
        }
      }
      return !0;
    };
    var Ar = function Ym(e) {
      return e == e && !M(e);
    };
    var Za = function Xm(e) {
      for (var t = fe(e), r = t.length; r--; ) {
        var o = t[r],
          n = e[o];
        t[r] = [o, n, Ar(n)];
      }
      return t;
    };
    var Or = function Zm(e, t) {
      return function (r) {
        return null != r && r[e] === t && (void 0 !== t || e in Object(r));
      };
    };
    var Qa = function Qm(e) {
      var t = Za(e);
      return 1 == t.length && t[0][2]
        ? Or(t[0][0], t[0][1])
        : function (r) {
            return r === e || Xa(r, e, t);
          };
    };
    var es = function eh(e, t) {
      return null != e && t in Object(e);
    };
    var ts = function th(e, t, r) {
      for (var o = -1, n = (t = Oe(t, e)).length, i = !1; ++o < n; ) {
        var a = re(t[o]);
        if (!(i = null != e && r(e, a))) break;
        e = e[a];
      }
      return i || ++o != n
        ? i
        : !!(n = null == e ? 0 : e.length) &&
            yt(n) &&
            ht(a, n) &&
            ($(e) || fr(e));
    };
    var rs = function rh(e, t) {
      return null != e && ts(e, t, es);
    };
    var os = function ih(e, t) {
      return et(e) && Ar(t)
        ? Or(re(e), t)
        : function (r) {
            var o = at(r, e);
            return void 0 === o && o === t ? rs(r, e) : Ir(t, o, 3);
          };
    };
    var wr = function ah(e) {
      return function (t) {
        return null == t ? void 0 : t[e];
      };
    };
    var ns = function sh(e) {
      return function (t) {
        return it(t, e);
      };
    };
    var is = function ph(e) {
      return et(e) ? wr(re(e)) : ns(e);
    };
    var as = function lh(e) {
      return "function" == typeof e
        ? e
        : null == e
          ? ji
          : "object" == typeof e
            ? $(e)
              ? os(e[0], e[1])
              : Qa(e)
            : is(e);
    };
    var ss = function uh(e) {
        return function (t, r, o) {
          for (var n = -1, i = Object(t), a = o(t), s = a.length; s--; ) {
            var l = a[e ? s : ++n];
            if (!1 === r(i[l], l, i)) break;
          }
          return t;
        };
      },
      ps = ss();
    var ls = function ch(e, t) {
        return e && ps(e, t, fe);
      },
      Cr = function () {
        return N.Date.now();
      },
      hh = Math.max,
      gh = Math.min;
    var Oo = function yh(e, t, r) {
      var o,
        n,
        i,
        a,
        s,
        l,
        p = 0,
        u = !1,
        c = !1,
        m = !0;
      if ("function" != typeof e) throw new TypeError("Expected a function");
      function f(A) {
        var z = o,
          J = n;
        return ((o = n = void 0), (p = A), (a = e.apply(J, z)));
      }
      function b(A) {
        var z = A - l;
        return void 0 === l || z >= t || z < 0 || (c && A - p >= i);
      }
      function P() {
        var A = Cr();
        if (b(A)) return x(A);
        s = setTimeout(
          P,
          (function v(A) {
            var le = t - (A - l);
            return c ? gh(le, i - (A - p)) : le;
          })(A),
        );
      }
      function x(A) {
        return ((s = void 0), m && o ? f(A) : ((o = n = void 0), a));
      }
      function q() {
        var A = Cr(),
          z = b(A);
        if (((o = arguments), (n = this), (l = A), z)) {
          if (void 0 === s)
            return (function y(A) {
              return ((p = A), (s = setTimeout(P, t)), u ? f(A) : a);
            })(l);
          if (c) return (clearTimeout(s), (s = setTimeout(P, t)), f(l));
        }
        return (void 0 === s && (s = setTimeout(P, t)), a);
      }
      return (
        (t = ye(t) || 0),
        M(r) &&
          ((u = !!r.leading),
          (i = (c = "maxWait" in r) ? hh(ye(r.maxWait) || 0, t) : i),
          (m = "trailing" in r ? !!r.trailing : m)),
        (q.cancel = function O() {
          (void 0 !== s && clearTimeout(s), (p = 0), (o = l = n = s = void 0));
        }),
        (q.flush = function U() {
          return void 0 === s ? a : x(Cr());
        }),
        q
      );
    };
    var us = function bh(e, t) {
      return t.length < 2 ? e : it(e, hr(t, 0, -1));
    };
    var wo = function Ph(e) {
      return "number" == typeof e && e == pr(e);
    };
    var Co = function jh(e, t) {
      var r = {};
      return (
        (t = as(t, 3)),
        ls(e, function (o, n, i) {
          dt(r, n, t(o, n, i));
        }),
        r
      );
    };
    var fs = function _h(e, t) {
        return ((t = Oe(t, e)), null == (e = us(e, t)) || delete e[re(er(t))]);
      },
      Th = Math.floor;
    var ko = function xh(e, t) {
        var r = "";
        if (!e || t < 1 || t > 9007199254740991) return r;
        do {
          (t % 2 && (r += e), (t = Th(t / 2)) && (e += e));
        } while (t);
        return r;
      },
      cs = wr("length"),
      ds = "\\ud800-\\udfff",
      kh = "[" + ds + "]",
      Do = "[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",
      Eo = "\\ud83c[\\udffb-\\udfff]",
      ms = "[^" + ds + "]",
      hs = "(?:\\ud83c[\\udde6-\\uddff]){2}",
      gs = "[\\ud800-\\udbff][\\udc00-\\udfff]",
      ys = "(?:" + Do + "|" + Eo + ")" + "?",
      bs = "[\\ufe0e\\ufe0f]?",
      Vh =
        bs +
        ys +
        ("(?:\\u200d(?:" + [ms, hs, gs].join("|") + ")" + bs + ys + ")*"),
      Nh = "(?:" + [ms + Do + "?", Do, hs, gs, kh].join("|") + ")",
      Ps = RegExp(Eo + "(?=" + Eo + ")|" + Nh + Vh, "g");
    var js = function Lh(e) {
      for (var t = (Ps.lastIndex = 0); Ps.test(e); ) ++t;
      return t;
    };
    var kr = function Mh(e) {
        return _t(e) ? js(e) : cs(e);
      },
      $h = Math.ceil;
    var _s = function Bh(e, t) {
      var r = (t = void 0 === t ? " " : Xt(t)).length;
      if (r < 2) return r ? ko(t, e) : t;
      var o = ko(t, $h(e / kr(t)));
      return _t(t) ? Mi(Gi(o), 0, e).join("") : o.slice(0, e);
    };
    var Ge = function Fh(e, t, r) {
      e = Zt(e);
      var o = (t = pr(t)) ? kr(e) : 0;
      return t && o < t ? _s(t - o, r) + e : e;
    };
    var Dr = function Uh(e, t) {
        return null == e || fs(e, t);
      },
      Er = class {
        constructor(t) {
          (d(this, "_cache", new De()),
            d(this, "_keepHotUntapDebounce"),
            ue(this, t));
        }
        get type() {
          return "Theatre_SheetObject_PublicAPI";
        }
        get props() {
          return T(this).propsP;
        }
        get sheet() {
          return T(this).sheet.publicApi;
        }
        get project() {
          return T(this).sheet.project.publicApi;
        }
        get address() {
          return _({}, T(this).address);
        }
        _valuesPrism() {
          return this._cache.get("_valuesPrism", () => {
            let t = T(this);
            return g(() => j(t.getValues().getValue()));
          });
        }
        onValuesChange(t, r) {
          return Rr(this._valuesPrism(), t, r);
        }
        get value() {
          let t = this._valuesPrism();
          if (!t.isHot) {
            null != this._keepHotUntapDebounce &&
              this._keepHotUntapDebounce.flush();
            let r = t.keepHot();
            this._keepHotUntapDebounce = Oo(() => {
              (r(), (this._keepHotUntapDebounce = void 0));
            }, 5e3);
          }
          return (
            this._keepHotUntapDebounce && this._keepHotUntapDebounce(),
            t.getValue()
          );
        }
        set initialValue(t) {
          T(this).setInitialValue(t);
        }
      };
    function It(e) {
      return "compound" === e.type || "enum" === e.type;
    }
    function $t(e, t) {
      if (!e) return;
      let [r, ...o] = t;
      return void 0 === r
        ? e
        : It(e)
          ? $t("enum" === e.type ? e.cases[r] : e.props[r], o)
          : void 0;
    }
    function Ts(e) {
      return !It(e);
    }
    var F,
      R,
      S,
      n,
      h,
      f,
      qh = (function Ro(e) {
        let t = new WeakMap();
        return (r) => (t.has(r) || t.set(r, e(r)), t.get(r));
      })((e) => {
        if ("enum" === e.type) throw new Error("Not implemented yet for enums");
        for (let t in e.props) {
          let r = e.props[t];
          if (!It(r)) return !0;
          if (qh(r)) return !0;
        }
        return !1;
      }),
      Vr = class {
        constructor(t, r, o) {
          ((this.sheet = t),
            (this.template = r),
            (this.nativeObject = o),
            d(this, "$$isPointerToPrismProvider", !0),
            d(this, "address"),
            d(this, "publicApi"),
            d(this, "_initialValue", new I({})),
            d(this, "_cache", new De()),
            d(this, "_logger"),
            d(this, "_internalUtilCtx"),
            (this._logger = t._logger.named(
              "SheetObject",
              r.address.objectKey,
            )),
            this._logger._trace("creating object"),
            (this._internalUtilCtx = {
              logger: this._logger.utilFor.internal(),
            }),
            (this.address = V(_({}, r.address), {
              sheetInstanceId: t.address.sheetInstanceId,
            })),
            (this.publicApi = new Er(this)));
        }
        get type() {
          return "Theatre_SheetObject";
        }
        getValues() {
          return this._cache.get("getValues()", () =>
            g(() => {
              let p,
                n = gt(
                  j(this.template.getDefaultValues()),
                  j(this._initialValue.pointer),
                  g.memo("withInitialCache", () => new WeakMap(), []),
                ),
                l = gt(
                  n,
                  j(this.template.getStaticValues()),
                  g.memo("withStatics", () => new WeakMap(), []),
                );
              {
                let c = g.memo("seq", () => this.getSequencedValues(), []),
                  m = g.memo("withSeqsCache", () => new WeakMap(), []);
                ((p = j(j(c))), (l = gt(l, p, m)));
              }
              return ((e, t) => {
                let r = g.memo(e, () => new I(t), []);
                return (r.set(t), r);
              })("finalAtom", l).pointer;
            }),
          );
        }
        getValueByPointer(t) {
          let r = j(this.getValues()),
            { path: o } = Z(t);
          return j(ze(r, o));
        }
        pointerToPrism(t) {
          let { path: r } = Z(t);
          return g(() => {
            let o = j(this.getValues());
            return j(ze(o, r));
          });
        }
        getSequencedValues() {
          return g(() => {
            let t = g.memo(
                "tracksToProcess",
                () => this.template.getArrayOfValidSequenceTracks(),
                [],
              ),
              r = j(t),
              o = new I({}),
              n = j(this.template.configPointer);
            return (
              g.effect(
                "processTracks",
                () => {
                  let i = [];
                  for (let { trackId: a, pathToProp: s } of r) {
                    let l = this._trackIdToPrism(a),
                      p = $t(n, s),
                      u = p.deserializeAndSanitize,
                      c = p.interpolate,
                      m = () => {
                        let y = l.getValue();
                        if (!y) return o.setByPointer((O) => ze(O, s), void 0);
                        let v = u(y.left),
                          b = void 0 === v ? p.default : v;
                        if (void 0 === y.right)
                          return o.setByPointer((O) => ze(O, s), b);
                        let P = u(y.right),
                          x = void 0 === P ? p.default : P;
                        return o.setByPointer(
                          (O) => ze(O, s),
                          c(b, x, y.progression),
                        );
                      },
                      f = l.onStale(m);
                    (m(), i.push(f));
                  }
                  return () => {
                    for (let a of i) a();
                  };
                },
                [n, ...r],
              ),
              o.pointer
            );
          });
        }
        _trackIdToPrism(t) {
          let r =
              this.template.project.pointers.historic.sheetsById[
                this.address.sheetId
              ].sequence.tracksByObject[this.address.objectKey].trackData[t],
            o = this.sheet.getSequence().positionPrism;
          return _o(this._internalUtilCtx, r, o);
        }
        get propsP() {
          return this._cache.get("propsP", () => ge({ root: this, path: [] }));
        }
        validateValue(t, r) {}
        setInitialValue(t) {
          (this.validateValue(this.propsP, t), this._initialValue.set(t));
        }
      };
    function k(e) {
      return function (r, o) {
        return e(r, o());
      };
    }
    (!(function (o) {
      ((o[(o.GENERAL = 1)] = "GENERAL"),
        (o[(o.TODO = 2)] = "TODO"),
        (o[(o.TROUBLESHOOTING = 4)] = "TROUBLESHOOTING"));
    })(F || (F = {})),
      (function (o) {
        ((o[(o.INTERNAL = 8)] = "INTERNAL"),
          (o[(o.DEV = 16)] = "DEV"),
          (o[(o.PUBLIC = 32)] = "PUBLIC"));
      })(R || (R = {})),
      ((n = S || (S = {}))[(n.TRACE = 64)] = "TRACE"),
      (n[(n.DEBUG = 128)] = "DEBUG"),
      (n[(n.WARN = 256)] = "WARN"),
      (n[(n.ERROR = 512)] = "ERROR"),
      ((f = h || (h = {}))[(f.ERROR_PUBLIC = 545)] = "ERROR_PUBLIC"),
      (f[(f.ERROR_DEV = 529)] = "ERROR_DEV"),
      (f[(f._HMM = 524)] = "_HMM"),
      (f[(f._TODO = 522)] = "_TODO"),
      (f[(f._ERROR = 521)] = "_ERROR"),
      (f[(f.WARN_PUBLIC = 289)] = "WARN_PUBLIC"),
      (f[(f.WARN_DEV = 273)] = "WARN_DEV"),
      (f[(f._KAPOW = 268)] = "_KAPOW"),
      (f[(f._WARN = 265)] = "_WARN"),
      (f[(f.DEBUG_DEV = 145)] = "DEBUG_DEV"),
      (f[(f._DEBUG = 137)] = "_DEBUG"),
      (f[(f.TRACE_DEV = 81)] = "TRACE_DEV"),
      (f[(f._TRACE = 73)] = "_TRACE"));
    var Q = {
      _hmm: ee(524),
      _todo: ee(522),
      _error: ee(521),
      errorDev: ee(529),
      errorPublic: ee(545),
      _kapow: ee(268),
      _warn: ee(265),
      warnDev: ee(273),
      warnPublic: ee(289),
      _debug: ee(137),
      debugDev: ee(145),
      _trace: ee(73),
      traceDev: ee(81),
    };
    function ee(e) {
      return Object.freeze({
        audience: He(e, 8) ? "internal" : He(e, 16) ? "dev" : "public",
        category: He(e, 4) ? "troubleshooting" : He(e, 2) ? "todo" : "general",
        level: He(e, 512) ? 512 : He(e, 256) ? 256 : He(e, 128) ? 128 : 64,
      });
    }
    function He(e, t) {
      return (e & t) === t;
    }
    function D(e, t) {
      return (
        (32 == (32 & t) ||
          (16 == (16 & t) ? e.dev : 8 == (8 & t) && e.internal)) &&
        e.min <= t
      );
    }
    var je = {
      loggingConsoleStyle: !0,
      loggerConsoleStyle: !0,
      includes: Object.freeze({ internal: !1, dev: !1, min: 256 }),
      filtered: function () {},
      include: function () {
        return {};
      },
      create: null,
      creatExt: null,
      named(e, t, r) {
        return this.create({ names: [...e.names, { name: t, key: r }] });
      },
      style: {
        bold: void 0,
        italic: void 0,
        cssMemo: new Map([["", ""]]),
        collapseOnRE: /[a-z- ]+/g,
        color: void 0,
        collapsed(e) {
          if (e.length < 5) return e;
          let t = e.replace(this.collapseOnRE, "");
          return (this.cssMemo.has(t) || this.cssMemo.set(t, this.css(e)), t);
        },
        css(e) {
          var o, n, i, a;
          let t = this.cssMemo.get(e);
          if (t) return t;
          let r = `color:${null != (n = null == (o = this.color) ? void 0 : o.call(this, e)) ? n : `hsl(${(e.charCodeAt(0) + e.charCodeAt(e.length - 1)) % 360}, 100%, 60%)`}`;
          return (
            (null == (i = this.bold) ? void 0 : i.test(e)) &&
              (r += ";font-weight:600"),
            (null == (a = this.italic) ? void 0 : a.test(e)) &&
              (r += ";font-style:italic"),
            this.cssMemo.set(e, r),
            r
          );
        },
      },
    };
    function Bt(e = console, t = {}) {
      let r = V(_({}, je), { includes: _({}, je.includes) }),
        o = { styled: Kh.bind(r, e), noStyle: Hh.bind(r, e) },
        n = Wh.bind(r);
      function i() {
        return r.loggingConsoleStyle && r.loggerConsoleStyle
          ? o.styled
          : o.noStyle;
      }
      return (
        (r.create = i()),
        {
          configureLogger(a) {
            var s;
            "console" === a
              ? ((r.loggerConsoleStyle = je.loggerConsoleStyle),
                (r.create = i()))
              : "console" === a.type
                ? ((r.loggerConsoleStyle =
                    null != (s = a.style) ? s : je.loggerConsoleStyle),
                  (r.create = i()))
                : "keyed" === a.type
                  ? ((r.creatExt = (l) => a.keyed(l.names)), (r.create = n))
                  : "named" === a.type &&
                    ((r.creatExt = zh.bind(null, a.named)), (r.create = n));
          },
          configureLogging(a) {
            var s, l, p, u, c;
            ((r.includes.dev = null != (s = a.dev) ? s : je.includes.dev),
              (r.includes.internal =
                null != (l = a.internal) ? l : je.includes.internal),
              (r.includes.min = null != (p = a.min) ? p : je.includes.min),
              (r.include = null != (u = a.include) ? u : je.include),
              (r.loggingConsoleStyle =
                null != (c = a.consoleStyle) ? c : je.loggingConsoleStyle),
              (r.create = i()));
          },
          getLogger: () => r.create({ names: [] }),
        }
      );
    }
    function zh(e, t) {
      let r = [];
      for (let { name: o, key: n } of t.names)
        r.push(null == n ? o : `${o} (${n})`);
      return e(r);
    }
    function Wh(e) {
      let t = _(_({}, this.includes), this.include(e)),
        r = this.filtered,
        o = this.named.bind(this, e),
        n = this.creatExt(e),
        i = D(t, 524),
        a = D(t, 522),
        s = D(t, 521),
        l = D(t, 529),
        p = D(t, 545),
        u = D(t, 265),
        c = D(t, 268),
        m = D(t, 273),
        f = D(t, 289),
        y = D(t, 137),
        v = D(t, 145),
        b = D(t, 73),
        P = D(t, 81),
        x = i ? n.error.bind(n, Q._hmm) : r.bind(e, 524),
        O = a ? n.error.bind(n, Q._todo) : r.bind(e, 522),
        U = s ? n.error.bind(n, Q._error) : r.bind(e, 521),
        q = l ? n.error.bind(n, Q.errorDev) : r.bind(e, 529),
        A = p ? n.error.bind(n, Q.errorPublic) : r.bind(e, 545),
        z = c ? n.warn.bind(n, Q._kapow) : r.bind(e, 268),
        J = u ? n.warn.bind(n, Q._warn) : r.bind(e, 265),
        le = m ? n.warn.bind(n, Q.warnDev) : r.bind(e, 273),
        Ve = f ? n.warn.bind(n, Q.warnPublic) : r.bind(e, 273),
        Ne = y ? n.debug.bind(n, Q._debug) : r.bind(e, 137),
        Le = v ? n.debug.bind(n, Q.debugDev) : r.bind(e, 145),
        Me = b ? n.trace.bind(n, Q._trace) : r.bind(e, 73),
        $e = P ? n.trace.bind(n, Q.traceDev) : r.bind(e, 81),
        L = {
          _hmm: x,
          _todo: O,
          _error: U,
          errorDev: q,
          errorPublic: A,
          _kapow: z,
          _warn: J,
          warnDev: le,
          warnPublic: Ve,
          _debug: Ne,
          debugDev: Le,
          _trace: Me,
          traceDev: $e,
          lazy: {
            _hmm: i ? k(x) : x,
            _todo: a ? k(O) : O,
            _error: s ? k(U) : U,
            errorDev: l ? k(q) : q,
            errorPublic: p ? k(A) : A,
            _kapow: c ? k(z) : z,
            _warn: u ? k(J) : J,
            warnDev: m ? k(le) : le,
            warnPublic: f ? k(Ve) : Ve,
            _debug: y ? k(Ne) : Ne,
            debugDev: v ? k(Le) : Le,
            _trace: b ? k(Me) : Me,
            traceDev: P ? k($e) : $e,
          },
          named: o,
          utilFor: {
            internal: () => ({
              debug: L._debug,
              error: L._error,
              warn: L._warn,
              trace: L._trace,
              named: (Y, w) => L.named(Y, w).utilFor.internal(),
            }),
            dev: () => ({
              debug: L.debugDev,
              error: L.errorDev,
              warn: L.warnDev,
              trace: L.traceDev,
              named: (Y, w) => L.named(Y, w).utilFor.dev(),
            }),
            public: () => ({
              error: L.errorPublic,
              warn: L.warnPublic,
              debug(Y, w) {
                L._warn(`(public "debug" filtered out) ${Y}`, w);
              },
              trace(Y, w) {
                L._warn(`(public "trace" filtered out) ${Y}`, w);
              },
              named: (Y, w) => L.named(Y, w).utilFor.public(),
            }),
          },
        };
      return L;
    }
    function Kh(e, t) {
      let r = _(_({}, this.includes), this.include(t)),
        o = [],
        n = "";
      for (let l = 0; l < t.names.length; l++) {
        let { name: p, key: u } = t.names[l];
        if (((n += ` %c${p}`), o.push(this.style.css(p)), null != u)) {
          let c = `%c#${u}`;
          ((n += c), o.push(this.style.css(c)));
        }
      }
      let i = this.filtered,
        a = this.named.bind(this, t),
        s = [n, ...o];
      return xs(
        i,
        t,
        r,
        e,
        s,
        (function Gh(e) {
          let t = e.slice(0);
          for (let r = 1; r < t.length; r++)
            t[r] += ";background-color:#e0005a;padding:2px;color:white";
          return t;
        })(s),
        a,
      );
    }
    function Hh(e, t) {
      let r = _(_({}, this.includes), this.include(t)),
        o = "";
      for (let s = 0; s < t.names.length; s++) {
        let { name: l, key: p } = t.names[s];
        ((o += ` ${l}`), null != p && (o += `#${p}`));
      }
      let a = [o];
      return xs(this.filtered, t, r, e, a, a, this.named.bind(this, t));
    }
    function xs(e, t, r, o, n, i, a) {
      let s = D(r, 524),
        l = D(r, 522),
        p = D(r, 521),
        u = D(r, 529),
        c = D(r, 545),
        m = D(r, 265),
        f = D(r, 268),
        y = D(r, 273),
        v = D(r, 289),
        b = D(r, 137),
        P = D(r, 145),
        x = D(r, 73),
        O = D(r, 81),
        U = s ? o.error.bind(o, ...n) : e.bind(t, 524),
        q = l ? o.error.bind(o, ...n) : e.bind(t, 522),
        A = p ? o.error.bind(o, ...n) : e.bind(t, 521),
        z = u ? o.error.bind(o, ...n) : e.bind(t, 529),
        J = c ? o.error.bind(o, ...n) : e.bind(t, 545),
        le = f ? o.warn.bind(o, ...i) : e.bind(t, 268),
        Ve = m ? o.warn.bind(o, ...n) : e.bind(t, 265),
        Ne = y ? o.warn.bind(o, ...n) : e.bind(t, 273),
        Le = v ? o.warn.bind(o, ...n) : e.bind(t, 273),
        Me = b ? o.info.bind(o, ...n) : e.bind(t, 137),
        $e = P ? o.info.bind(o, ...n) : e.bind(t, 145),
        L = x ? o.debug.bind(o, ...n) : e.bind(t, 73),
        Y = O ? o.debug.bind(o, ...n) : e.bind(t, 81),
        w = {
          _hmm: U,
          _todo: q,
          _error: A,
          errorDev: z,
          errorPublic: J,
          _kapow: le,
          _warn: Ve,
          warnDev: Ne,
          warnPublic: Le,
          _debug: Me,
          debugDev: $e,
          _trace: L,
          traceDev: Y,
          lazy: {
            _hmm: s ? k(U) : U,
            _todo: l ? k(q) : q,
            _error: p ? k(A) : A,
            errorDev: u ? k(z) : z,
            errorPublic: c ? k(J) : J,
            _kapow: f ? k(le) : le,
            _warn: m ? k(Ve) : Ve,
            warnDev: y ? k(Ne) : Ne,
            warnPublic: v ? k(Le) : Le,
            _debug: b ? k(Me) : Me,
            debugDev: P ? k($e) : $e,
            _trace: x ? k(L) : L,
            traceDev: O ? k(Y) : Y,
          },
          named: a,
          utilFor: {
            internal: () => ({
              debug: w._debug,
              error: w._error,
              warn: w._warn,
              trace: w._trace,
              named: (ce, de) => w.named(ce, de).utilFor.internal(),
            }),
            dev: () => ({
              debug: w.debugDev,
              error: w.errorDev,
              warn: w.warnDev,
              trace: w.traceDev,
              named: (ce, de) => w.named(ce, de).utilFor.dev(),
            }),
            public: () => ({
              error: w.errorPublic,
              warn: w.warnPublic,
              debug(ce, de) {
                w._warn(`(public "debug" filtered out) ${ce}`, de);
              },
              trace(ce, de) {
                w._warn(`(public "trace" filtered out) ${ce}`, de);
              },
              named: (ce, de) => w.named(ce, de).utilFor.public(),
            }),
          },
        };
      return w;
    }
    var Ss = Bt(console, { _debug: function () {}, _error: function () {} });
    Ss.configureLogging({ dev: !0, min: S.TRACE });
    var At = Ss.getLogger().named("Theatre.js (default logger)").utilFor.dev(),
      Is = new WeakMap();
    function As(e, t, r) {
      for (let [o, n] of Object.entries(t.props))
        if (!It(n)) {
          let i = [...e, o];
          (r.set(JSON.stringify(i), r.size), Os(i, n, r));
        }
      for (let [o, n] of Object.entries(t.props))
        if (It(n)) {
          let i = [...e, o];
          (r.set(JSON.stringify(i), r.size), Os(i, n, r));
        }
    }
    function Os(e, t, r) {
      if ("compound" === t.type) As(e, t, r);
      else {
        if ("enum" === t.type) throw new Error("Enums aren't supported yet");
        r.set(JSON.stringify(e), r.size);
      }
    }
    function ws(e) {
      return "object" == typeof e && null !== e && 0 === Object.keys(e).length;
    }
    var Nr = class {
      constructor(t, r, o, n, i) {
        ((this.sheetTemplate = t),
          d(this, "address"),
          d(this, "type", "Theatre_SheetObjectTemplate"),
          d(this, "_config"),
          d(this, "_temp_actions_atom"),
          d(this, "_cache", new De()),
          d(this, "project"),
          d(this, "pointerToSheetState"),
          d(this, "pointerToStaticOverrides"),
          (this.address = V(_({}, t.address), { objectKey: r })),
          (this._config = new I(n)),
          (this._temp_actions_atom = new I(i)),
          (this.project = t.project),
          (this.pointerToSheetState =
            this.sheetTemplate.project.pointers.historic.sheetsById[
              this.address.sheetId
            ]),
          (this.pointerToStaticOverrides =
            this.pointerToSheetState.staticOverrides.byObject[
              this.address.objectKey
            ]));
      }
      get staticConfig() {
        return this._config.get();
      }
      get configPointer() {
        return this._config.pointer;
      }
      get _temp_actions() {
        return this._temp_actions_atom.get();
      }
      get _temp_actionsPointer() {
        return this._temp_actions_atom.pointer;
      }
      createInstance(t, r, o) {
        return (this._config.set(o), new Vr(t, this, r));
      }
      reconfigure(t) {
        this._config.set(t);
      }
      _temp_setActions(t) {
        this._temp_actions_atom.set(t);
      }
      getDefaultValues() {
        return this._cache.get("getDefaultValues()", () =>
          g(() =>
            (function Po(e) {
              return jo(e);
            })(j(this.configPointer)),
          ),
        );
      }
      getStaticValues() {
        return this._cache.get("getStaticValues", () =>
          g(() => {
            var n;
            let t = null != (n = j(this.pointerToStaticOverrides)) ? n : {};
            return j(this.configPointer).deserializeAndSanitize(t) || {};
          }),
        );
      }
      getArrayOfValidSequenceTracks() {
        return this._cache.get("getArrayOfValidSequenceTracks", () =>
          g(() => {
            let t =
                this.project.pointers.historic.sheetsById[this.address.sheetId],
              r = j(
                t.sequence.tracksByObject[this.address.objectKey]
                  .trackIdByPropPath,
              );
            if (!r) return ar;
            let o = [];
            if (!r) return ar;
            let n = j(this.configPointer),
              i = Object.entries(r);
            for (let [s, l] of i) {
              let p = Jh(s);
              if (!p) continue;
              let u = $t(n, p);
              !u || !Ts(u) || o.push({ pathToProp: p, trackId: l });
            }
            let a = (function Vo(e) {
              let t = Is.get(e);
              if (t) return t;
              let r = new Map();
              return (Is.set(e, r), As([], e, r), r);
            })(n);
            return (
              o.sort((s, l) => {
                let p = s.pathToProp,
                  u = l.pathToProp;
                return a.get(JSON.stringify(p)) > a.get(JSON.stringify(u))
                  ? 1
                  : -1;
              }),
              0 === o.length ? ar : o
            );
          }),
        );
      }
      getMapOfValidSequenceTracks_forStudio() {
        return this._cache.get("getMapOfValidSequenceTracks_forStudio", () =>
          g(() => {
            let t = j(this.getArrayOfValidSequenceTracks()),
              r = {};
            for (let { pathToProp: o, trackId: n } of t) li(r, o, n);
            return r;
          }),
        );
      }
      getStaticButNotSequencedOverrides() {
        return this._cache.get("getStaticButNotSequencedOverrides", () =>
          g(() => {
            let t = j(this.getStaticValues()),
              r = j(this.getArrayOfValidSequenceTracks()),
              o = Io(t);
            for (let { pathToProp: n } of r) {
              Dr(o, n);
              let i = n.slice(0, -1);
              for (; i.length > 0; ) {
                if (!ws(sr(o, i))) break;
                (Dr(o, i), (i = i.slice(0, -1)));
              }
            }
            if (!ws(o)) return o;
          }),
        );
      }
      getDefaultsAtPointer(t) {
        let { path: r } = Z(t);
        return sr(this.getDefaultValues().getValue(), r);
      }
    };
    function Jh(e) {
      try {
        return JSON.parse(e);
      } catch (t) {
        return void At.warn(
          `property ${JSON.stringify(e)} cannot be parsed. Skipping.`,
        );
      }
    }
    Gt(Rs());
    var Vs = class extends Error {},
      oe = class extends Vs {};
    function ne() {
      let e,
        t,
        r = new Promise((n, i) => {
          ((e = (a) => {
            (n(a), (o.status = "resolved"));
          }),
            (t = (a) => {
              (i(a), (o.status = "rejected"));
            }));
        }),
        o = { resolve: e, reject: t, promise: r, status: "pending" };
      return o;
    }
    var Ot = () => {},
      Mr = class {
        constructor() {
          (d(this, "_stopPlayCallback", Ot),
            d(this, "_state", new I({ position: 0, playing: !1 })),
            d(this, "statePointer"),
            (this.statePointer = this._state.pointer));
        }
        destroy() {}
        pause() {
          (this._stopPlayCallback(),
            (this.playing = !1),
            (this._stopPlayCallback = Ot));
        }
        gotoPosition(t) {
          this._updatePositionInState(t);
        }
        _updatePositionInState(t) {
          this._state.setByPointer((r) => r.position, t);
        }
        getCurrentPosition() {
          return this._state.get().position;
        }
        get playing() {
          return this._state.get().playing;
        }
        set playing(t) {
          this._state.setByPointer((r) => r.playing, t);
        }
        play(t, r, o, n, i) {
          (this.playing && this.pause(), (this.playing = !0));
          let a = r[1] - r[0];
          {
            let f = this.getCurrentPosition();
            f < r[0] || f > r[1]
              ? "normal" === n || "alternate" === n
                ? this._updatePositionInState(r[0])
                : ("reverse" === n || "alternateReverse" === n) &&
                  this._updatePositionInState(r[1])
              : "normal" === n || "alternate" === n
                ? f === r[1] && this._updatePositionInState(r[0])
                : f === r[0] && this._updatePositionInState(r[1]);
          }
          let s = ne(),
            l = i.time,
            p = a * t,
            u = this.getCurrentPosition() - r[0];
          ("reverse" === n || "alternateReverse" === n) &&
            (u = r[1] - this.getCurrentPosition());
          let c = (f) => {
            let v = Math.max(f - l, 0) / 1e3,
              b = Math.min(v * o + u, p);
            if (b !== p) {
              let P = Math.floor(b / a),
                x = ((b / a) % 1) * a;
              if ("normal" !== n)
                if ("reverse" === n) x = a - x;
                else {
                  let O = P % 2 == 0;
                  "alternate" === n ? O || (x = a - x) : O && (x = a - x);
                }
              (this._updatePositionInState(x + r[0]), m());
            } else {
              if ("normal" === n) this._updatePositionInState(r[1]);
              else if ("reverse" === n) this._updatePositionInState(r[0]);
              else {
                let P = (t - 1) % 2 == 0;
                "alternate" === n
                  ? P
                    ? this._updatePositionInState(r[1])
                    : this._updatePositionInState(r[0])
                  : P
                    ? this._updatePositionInState(r[0])
                    : this._updatePositionInState(r[1]);
              }
              ((this.playing = !1), s.resolve(!0));
            }
          };
          this._stopPlayCallback = () => {
            (i.offThisOrNextTick(c),
              i.offNextTick(c),
              this.playing && s.resolve(!1));
          };
          let m = () => i.onNextTick(c);
          return (i.onThisOrNextTick(c), s.promise);
        }
        playDynamicRange(t, r) {
          (this.playing && this.pause(), (this.playing = !0));
          let o = ne(),
            n = t.keepHot();
          o.promise.then(n, n);
          let i = r.time,
            a = (l) => {
              let p = Math.max(l - i, 0);
              i = l;
              let u = p / 1e3,
                c = this.getCurrentPosition(),
                m = t.getValue();
              if (c < m[0] || c > m[1]) this.gotoPosition(m[0]);
              else {
                let f = c + u;
                (f > m[1] && (f = m[0] + (f - m[1])), this.gotoPosition(f));
              }
              s();
            };
          this._stopPlayCallback = () => {
            (r.offThisOrNextTick(a), r.offNextTick(a), o.resolve(!1));
          };
          let s = () => r.onNextTick(a);
          return (r.onThisOrNextTick(a), o.promise);
        }
      },
      $r = "__TheatreJS_CoreBundle",
      Br =
        (e) =>
        (...t) => {
          var r;
          switch (e) {
            case "success":
            case "info":
              At.debug(t.slice(0, 2).join("\n"));
              break;
            case "warning":
              At.warn(t.slice(0, 2).join("\n"));
          }
          return "undefined" != typeof window
            ? null == (r = window.__TheatreJS_Notifications)
              ? void 0
              : r.notify[e](...t)
            : void 0;
        },
      pe = {
        warning: Br("warning"),
        success: Br("success"),
        info: Br("info"),
        error: Br("error"),
      };
    "undefined" != typeof window &&
      (window.addEventListener("error", (e) => {
        pe.error(
          "An error occurred",
          `<pre>${e.message}</pre>\n\nSee **console** for details.`,
        );
      }),
      window.addEventListener("unhandledrejection", (e) => {
        pe.error(
          "An error occurred",
          `<pre>${e.reason}</pre>\n\nSee **console** for details.`,
        );
      }));
    var Ur,
      Fr = class {
        constructor(t, r, o) {
          ((this._decodedBuffer = t),
            (this._audioContext = r),
            (this._nodeDestination = o),
            d(this, "_mainGain"),
            d(this, "_state", new I({ position: 0, playing: !1 })),
            d(this, "statePointer"),
            d(this, "_stopPlayCallback", Ot),
            (this.statePointer = this._state.pointer),
            (this._mainGain = this._audioContext.createGain()),
            this._mainGain.connect(this._nodeDestination));
        }
        playDynamicRange(t, r) {
          let o = ne();
          (this._playing && this.pause(), (this._playing = !0));
          let n,
            i = () => {
              (null == n || n(), (n = this._loopInRange(t.getValue(), r).stop));
            },
            a = t.onStale(i);
          return (
            i(),
            (this._stopPlayCallback = () => {
              (null == n || n(), a(), o.resolve(!1));
            }),
            o.promise
          );
        }
        _loopInRange(t, r) {
          let n = this.getCurrentPosition(),
            i = t[1] - t[0];
          ((n < t[0] || n > t[1] || n === t[1]) &&
            this._updatePositionInState(t[0]),
            (n = this.getCurrentPosition()));
          let a = this._audioContext.createBufferSource();
          ((a.buffer = this._decodedBuffer),
            a.connect(this._mainGain),
            (a.playbackRate.value = 1),
            (a.loop = !0),
            (a.loopStart = t[0]),
            (a.loopEnd = t[1]));
          let s = r.time,
            l = n - t[0];
          a.start(0, n);
          let p = (m) => {
              let b = ((((Math.max(m - s, 0) / 1e3) * 1 + l) / i) % 1) * i;
              (this._updatePositionInState(b + t[0]), u());
            },
            u = () => r.onNextTick(p);
          return (
            r.onThisOrNextTick(p),
            {
              stop: () => {
                (a.stop(),
                  a.disconnect(),
                  r.offThisOrNextTick(p),
                  r.offNextTick(p));
              },
            }
          );
        }
        get _playing() {
          return this._state.get().playing;
        }
        set _playing(t) {
          this._state.setByPointer((r) => r.playing, t);
        }
        destroy() {}
        pause() {
          (this._stopPlayCallback(),
            (this._playing = !1),
            (this._stopPlayCallback = Ot));
        }
        gotoPosition(t) {
          this._updatePositionInState(t);
        }
        _updatePositionInState(t) {
          this._state.reduce((r) => V(_({}, r), { position: t }));
        }
        getCurrentPosition() {
          return this._state.get().position;
        }
        play(t, r, o, n, i) {
          (this._playing && this.pause(), (this._playing = !0));
          let a = this.getCurrentPosition(),
            s = r[1] - r[0];
          if ("normal" !== n)
            throw new oe(
              `Audio-controlled sequences can only be played in the "normal" direction. '${n}' given.`,
            );
          ((a < r[0] || a > r[1] || a === r[1]) &&
            this._updatePositionInState(r[0]),
            (a = this.getCurrentPosition()));
          let l = ne(),
            p = this._audioContext.createBufferSource();
          ((p.buffer = this._decodedBuffer),
            p.connect(this._mainGain),
            (p.playbackRate.value = o),
            t > 1e3 &&
              (pe.warning(
                "Can't play sequences with audio more than 1000 times",
                `The sequence will still play, but only 1000 times. The \`iterationCount: ${t}\` provided to \`sequence.play()\`\nis too high for a sequence with audio.\n\nTo fix this, either set \`iterationCount\` to a lower value, or remove the audio from the sequence.`,
                [
                  {
                    url: "https://www.theatrejs.com/docs/latest/manual/audio",
                    title: "Using Audio",
                  },
                  {
                    url: "https://www.theatrejs.com/docs/latest/api/core#sequence.attachaudio",
                    title: "Audio API",
                  },
                ],
              ),
              (t = 1e3)),
            t > 1 && ((p.loop = !0), (p.loopStart = r[0]), (p.loopEnd = r[1])));
          let u = i.time,
            c = a - r[0],
            m = s * t;
          p.start(0, a, m - c);
          let f = (b) => {
              let x = Math.max(b - u, 0) / 1e3,
                O = Math.min(x * o + c, m);
              if (O !== m) {
                let U = ((O / s) % 1) * s;
                (this._updatePositionInState(U + r[0]), v());
              } else
                (this._updatePositionInState(r[1]),
                  (this._playing = !1),
                  y(),
                  l.resolve(!0));
            },
            y = () => {
              (p.stop(), p.disconnect());
            };
          this._stopPlayCallback = () => {
            (y(),
              i.offThisOrNextTick(f),
              i.offNextTick(f),
              this._playing && l.resolve(!1));
          };
          let v = () => i.onNextTick(f);
          return (i.onThisOrNextTick(f), l.promise);
        }
      },
      Ms = 0;
    function Ft(e) {
      var i;
      let r = new ct({
          onActive() {
            var a;
            null == (a = null == e ? void 0 : e.start) || a.call(e);
          },
          onDormant() {
            var a;
            null == (a = null == e ? void 0 : e.stop) || a.call(e);
          },
        }),
        o = {
          tick: (a) => {
            r.tick(a);
          },
          id: Ms++,
          name:
            null != (i = null == e ? void 0 : e.name)
              ? i
              : `CustomRafDriver-${Ms}`,
          type: "Theatre_RafDriver_PublicAPI",
        };
      return (
        ue(o, {
          type: "Theatre_RafDriver_PrivateAPI",
          publicApi: o,
          ticker: r,
          start: null == e ? void 0 : e.start,
          stop: null == e ? void 0 : e.stop,
        }),
        o
      );
    }
    function Lo() {
      return (
        Ur ||
          zr(
            (function eg() {
              let e = null,
                o = Ft({
                  name: "DefaultCoreRafDriver",
                  start: () => {
                    if ("undefined" != typeof window) {
                      let n = (i) => {
                        (o.tick(i), (e = window.requestAnimationFrame(n)));
                      };
                      e = window.requestAnimationFrame(n);
                    } else (o.tick(0), setTimeout(() => o.tick(1), 0));
                  },
                  stop: () => {
                    "undefined" != typeof window &&
                      null !== e &&
                      window.cancelAnimationFrame(e);
                  },
                });
              return o;
            })(),
          ),
        Ur
      );
    }
    function qr() {
      return Lo().ticker;
    }
    function zr(e) {
      if (Ur) throw new Error("`setCoreRafDriver()` is already called.");
      Ur = T(e);
    }
    var Wr = class {
      get type() {
        return "Theatre_Sequence_PublicAPI";
      }
      constructor(t) {
        ue(this, t);
      }
      play(t) {
        let r = T(this);
        if (r._project.isReady()) {
          let o = (null == t ? void 0 : t.rafDriver)
            ? T(t.rafDriver).ticker
            : qr();
          return r.play(null != t ? t : {}, o);
        }
        {
          let o = ne();
          return (o.resolve(!0), o.promise);
        }
      }
      pause() {
        T(this).pause();
      }
      get position() {
        return T(this).position;
      }
      set position(t) {
        T(this).position = t;
      }
      async attachAudio(t) {
        let {
            audioContext: r,
            destinationNode: o,
            decodedBuffer: n,
            gainNode: i,
          } = await (async function tg(e) {
            function t() {
              if (e.audioContext) return Promise.resolve(e.audioContext);
              let p = new AudioContext();
              return "running" === p.state || "undefined" == typeof window
                ? Promise.resolve(p)
                : new Promise((u) => {
                    let c = () => {
                        p.resume();
                      },
                      m = ["mousedown", "keydown", "touchstart"],
                      f = { capture: !0, passive: !1 };
                    (m.forEach((y) => {
                      window.addEventListener(y, c, f);
                    }),
                      p.addEventListener("statechange", () => {
                        "running" === p.state &&
                          (m.forEach((y) => {
                            window.removeEventListener(y, c, f);
                          }),
                          u(p));
                      }));
                  });
            }
            async function r() {
              if (e.source instanceof AudioBuffer) return e.source;
              let u,
                c,
                f,
                p = ne();
              if ("string" != typeof e.source)
                throw new Error(
                  "Error validating arguments to sequence.attachAudio(). args.source must either be a string or an instance of AudioBuffer.",
                );
              try {
                u = await fetch(e.source);
              } catch (y) {
                throw (
                  console.error(y),
                  new Error(
                    `Could not fetch '${e.source}'. Network error logged above.`,
                  )
                );
              }
              try {
                c = await u.arrayBuffer();
              } catch (y) {
                throw (
                  console.error(y),
                  new Error(`Could not read '${e.source}' as an arrayBuffer.`)
                );
              }
              (await o).decodeAudioData(c, p.resolve, p.reject);
              try {
                f = await p.promise;
              } catch (y) {
                throw (
                  console.error(y),
                  new Error(`Could not decode ${e.source} as an audio file.`)
                );
              }
              return f;
            }
            let o = t(),
              n = r(),
              [i, a] = await Promise.all([o, n]),
              s = e.destinationNode || i.destination,
              l = i.createGain();
            return (
              l.connect(s),
              {
                audioContext: i,
                decodedBuffer: a,
                gainNode: l,
                destinationNode: s,
              }
            );
          })(t),
          a = new Fr(n, r, i);
        return (
          T(this).replacePlaybackController(a),
          { audioContext: r, destinationNode: o, decodedBuffer: n, gainNode: i }
        );
      }
      get pointer() {
        return T(this).pointer;
      }
    };
    var Kr = class {
        constructor(t, r, o, n, i) {
          ((this._project = t),
            (this._sheet = r),
            (this._lengthD = o),
            (this._subUnitsPerUnitD = n),
            d(this, "address"),
            d(this, "publicApi"),
            d(this, "_playbackControllerBox"),
            d(this, "_prismOfStatePointer"),
            d(this, "_positionD"),
            d(this, "_positionFormatterD"),
            d(this, "_playableRangeD"),
            d(this, "pointer", ge({ root: this, path: [] })),
            d(this, "$$isPointerToPrismProvider", !0),
            d(this, "_logger"),
            d(this, "closestGridPosition", (t) => {
              let o = 1 / this.subUnitsPerUnit;
              return parseFloat((Math.round(t / o) * o).toFixed(3));
            }),
            (this._logger = t._logger
              .named("Sheet", r.address.sheetId)
              .named("Instance", r.address.sheetInstanceId)),
            (this.address = V(_({}, this._sheet.address), {
              sequenceName: "default",
            })),
            (this.publicApi = new Wr(this)),
            (this._playbackControllerBox = new I(null != i ? i : new Mr())),
            (this._prismOfStatePointer = g(
              () => this._playbackControllerBox.prism.getValue().statePointer,
            )),
            (this._positionD = g(() => {
              let a = this._prismOfStatePointer.getValue();
              return j(a.position);
            })),
            (this._positionFormatterD = g(() => {
              let a = j(this._subUnitsPerUnitD);
              return new $s(a);
            })));
        }
        pointerToPrism(t) {
          let { path: r } = Z(t);
          if (0 === r.length)
            return g(() => ({
              length: j(this.pointer.length),
              playing: j(this.pointer.playing),
              position: j(this.pointer.position),
            }));
          if (r.length > 1) return g(() => {});
          let [o] = r;
          return "length" === o
            ? this._lengthD
            : "position" === o
              ? this._positionD
              : g(
                  "playing" === o
                    ? () => j(this._prismOfStatePointer.getValue().playing)
                    : () => {},
                );
        }
        get positionFormatter() {
          return this._positionFormatterD.getValue();
        }
        get prismOfStatePointer() {
          return this._prismOfStatePointer;
        }
        get length() {
          return this._lengthD.getValue();
        }
        get positionPrism() {
          return this._positionD;
        }
        get position() {
          return this._playbackControllerBox.get().getCurrentPosition();
        }
        get subUnitsPerUnit() {
          return this._subUnitsPerUnitD.getValue();
        }
        get positionSnappedToGrid() {
          return this.closestGridPosition(this.position);
        }
        set position(t) {
          let r = t;
          (this.pause(), r > this.length && (r = this.length));
          let o = this.length;
          this._playbackControllerBox.get().gotoPosition(r > o ? o : r);
        }
        getDurationCold() {
          return this._lengthD.getValue();
        }
        get playing() {
          return j(this._playbackControllerBox.get().statePointer.playing);
        }
        _makeRangeFromSequenceTemplate() {
          return g(() => [0, j(this._lengthD)]);
        }
        playDynamicRange(t, r) {
          return this._playbackControllerBox.get().playDynamicRange(t, r);
        }
        async play(t, r) {
          let o = this.length,
            n = t && t.range ? t.range : [0, o],
            i = t && "number" == typeof t.iterationCount ? t.iterationCount : 1,
            a = t && void 0 !== t.rate ? t.rate : 1,
            s = t && t.direction ? t.direction : "normal";
          return await this._play(i, [n[0], n[1]], a, s, r);
        }
        _play(t, r, o, n, i) {
          return this._playbackControllerBox.get().play(t, r, o, n, i);
        }
        pause() {
          this._playbackControllerBox.get().pause();
        }
        replacePlaybackController(t) {
          this.pause();
          let r = this._playbackControllerBox.get();
          this._playbackControllerBox.set(t);
          let o = r.getCurrentPosition();
          (r.destroy(), t.gotoPosition(o));
        }
      },
      $s = class {
        constructor(t) {
          this._fps = t;
        }
        formatSubUnitForGrid(t) {
          let r = t % 1,
            o = 1 / this._fps;
          return Math.round(r / o) + "f";
        }
        formatFullUnitForGrid(t) {
          let r = t,
            o = "";
          (r >= wt && ((o += Math.floor(r / wt) + "h"), (r %= wt)),
            r >= Ye && ((o += Math.floor(r / Ye) + "m"), (r %= Ye)),
            r >= Je && ((o += Math.floor(r / Je) + "s"), (r %= Je)));
          let n = 1 / this._fps;
          return (
            r >= n && ((o += Math.floor(r / n) + "f"), (r %= n)),
            0 === o.length ? "0s" : o
          );
        }
        formatForPlayhead(t) {
          let r = t,
            o = "";
          if (r >= wt) {
            let i = Math.floor(r / wt);
            ((o += Ge(i.toString(), 2, "0") + "h"), (r %= wt));
          }
          if (r >= Ye) {
            let i = Math.floor(r / Ye);
            ((o += Ge(i.toString(), 2, "0") + "m"), (r %= Ye));
          } else o.length > 0 && (o += "00m");
          if (r >= Je) {
            let i = Math.floor(r / Je);
            ((o += Ge(i.toString(), 2, "0") + "s"), (r %= Je));
          } else o += "00s";
          let n = 1 / this._fps;
          if (r >= n) {
            let i = Math.round(r / n);
            ((o += Ge(i.toString(), 2, "0") + "f"), (r %= n));
          } else
            r / n > 0.98
              ? ((o += Ge((1).toString(), 2, "0") + "f"), (r %= n))
              : (o += "00f");
          return 0 === o.length ? "00s00f" : o;
        }
        formatBasic(t) {
          return t.toFixed(2) + "s";
        }
      },
      Je = 1,
      Ye = 60 * Je,
      wt = 60 * Ye,
      Yr = {};
    function Gr(e, t) {
      return e.length <= t ? e : e.substr(0, t - 3) + "...";
    }
    uo(Yr, {
      boolean: () => Fo,
      compound: () => Ut,
      image: () => sg,
      number: () => Bo,
      rgba: () => cg,
      string: () => Uo,
      stringLiteral: () => yg,
    });
    var Ct = (e) =>
      "string" == typeof e
        ? `string("${Gr(e, 10)}")`
        : "number" == typeof e
          ? `number(${Gr(String(e), 10)})`
          : null === e
            ? "null"
            : void 0 === e
              ? "undefined"
              : "boolean" == typeof e
                ? String(e)
                : Array.isArray(e)
                  ? "array"
                  : "object" == typeof e
                    ? "object"
                    : "unknown";
    function Hr(e) {
      return V(_({}, e), {
        toString() {
          return (function og(e, { removeAlphaIfOpaque: t = !1 } = {}) {
            let r = ((255 * e.a) | 256).toString(16).slice(1);
            return `#${((255 * e.r) | 256).toString(16).slice(1) + ((255 * e.g) | 256).toString(16).slice(1) + ((255 * e.b) | 256).toString(16).slice(1) + (t && "ff" === r ? "" : r)}`;
          })(this, { removeAlphaIfOpaque: !0 });
        },
      });
    }
    function Bs(e) {
      function t(r) {
        return r >= 0.0031308 ? 1.055 * r ** (1 / 2.4) - 0.055 : 12.92 * r;
      }
      return (function ng(e) {
        return Object.fromEntries(
          Object.entries(e).map(([t, r]) => [t, Lt(r, 0, 1)]),
        );
      })({ r: t(e.r), g: t(e.g), b: t(e.b), a: e.a });
    }
    function Mo(e) {
      function t(r) {
        return r >= 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
      }
      return { r: t(e.r), g: t(e.g), b: t(e.b), a: e.a };
    }
    function $o(e) {
      let t = 0.4122214708 * e.r + 0.5363325363 * e.g + 0.0514459929 * e.b,
        r = 0.2119034982 * e.r + 0.6806995451 * e.g + 0.1073969566 * e.b,
        o = 0.0883024619 * e.r + 0.2817188376 * e.g + 0.6299787005 * e.b,
        n = Math.cbrt(t),
        i = Math.cbrt(r),
        a = Math.cbrt(o);
      return {
        L: 0.2104542553 * n + 0.793617785 * i - 0.0040720468 * a,
        a: 1.9779984951 * n - 2.428592205 * i + 0.4505937099 * a,
        b: 0.0259040371 * n + 0.7827717662 * i - 0.808675766 * a,
        alpha: e.a,
      };
    }
    var _e = Symbol("TheatrePropType_Basic");
    function Us(e) {
      return "object" == typeof e && !!e && "TheatrePropType" === e[_e];
    }
    function ig(e) {
      if ("number" == typeof e) return Bo(e);
      if ("boolean" == typeof e) return Fo(e);
      if ("string" == typeof e) return Uo(e);
      if ("object" == typeof e && e) {
        if (Us(e)) return e;
        if (Vt(e)) return Ut(e);
        throw new oe(`This value is not a valid prop type: ${Ct(e)}`);
      }
      throw new oe(`This value is not a valid prop type: ${Ct(e)}`);
    }
    var Ut = (e, t = {}) => {
        let r = (function qs(e) {
            let t = {};
            for (let r of Object.keys(e)) {
              let o = e[r];
              Us(o) ? (t[r] = o) : (t[r] = ig(o));
            }
            return t;
          })(e),
          o = new WeakMap();
        return {
          type: "compound",
          props: r,
          valueType: null,
          [_e]: "TheatrePropType",
          label: t.label,
          default: Co(r, (i) => i.default),
          deserializeAndSanitize: (i) => {
            if ("object" != typeof i || !i) return;
            if (o.has(i)) return o.get(i);
            let a = {},
              s = !1;
            for (let [l, p] of Object.entries(r))
              if (Object.prototype.hasOwnProperty.call(i, l)) {
                let u = p.deserializeAndSanitize(i[l]);
                null != u && ((s = !0), (a[l] = u));
              }
            return (o.set(i, a), s ? a : void 0);
          },
        };
      },
      sg = (e, t = {}) => ({
        type: "image",
        default: { type: "image", id: e },
        valueType: null,
        [_e]: "TheatrePropType",
        label: t.label,
        interpolate: (o, n, i) => {
          var s;
          return {
            type: "image",
            id: (null != (s = t.interpolate) ? s : Jr)(o.id, n.id, i),
          };
        },
        deserializeAndSanitize: pg,
      }),
      pg = (e) => {
        if (!e) return;
        let t = !0;
        return (
          "string" != typeof e.id && ![null, void 0].includes(e.id) && (t = !1),
          "image" !== e.type && (t = !1),
          t ? e : void 0
        );
      },
      Bo = (e, t = {}) => {
        var r;
        return V(
          _(
            {
              type: "number",
              valueType: 0,
              default: e,
              [_e]: "TheatrePropType",
            },
            t || {},
          ),
          {
            label: t.label,
            nudgeFn: null != (r = t.nudgeFn) ? r : bg,
            nudgeMultiplier:
              "number" == typeof t.nudgeMultiplier ? t.nudgeMultiplier : void 0,
            interpolate: fg,
            deserializeAndSanitize: lg(t.range),
          },
        );
      },
      lg = (e) =>
        e
          ? (t) => {
              if ("number" == typeof t && isFinite(t)) return Lt(t, e[0], e[1]);
            }
          : ug,
      ug = (e) => ("number" == typeof e && isFinite(e) ? e : void 0),
      fg = (e, t, r) => e + r * (t - e),
      cg = (e = { r: 0, g: 0, b: 0, a: 1 }, t = {}) => {
        let r = {};
        for (let o of ["r", "g", "b", "a"])
          r[o] = Math.min(Math.max(e[o], 0), 1);
        return {
          type: "rgba",
          valueType: null,
          default: Hr(r),
          [_e]: "TheatrePropType",
          label: t.label,
          interpolate: mg,
          deserializeAndSanitize: dg,
        };
      },
      dg = (e) => {
        if (!e) return;
        let t = !0;
        for (let o of ["r", "g", "b", "a"])
          (!Object.prototype.hasOwnProperty.call(e, o) ||
            "number" != typeof e[o]) &&
            (t = !1);
        if (!t) return;
        let r = {};
        for (let o of ["r", "g", "b", "a"])
          r[o] = Math.min(Math.max(e[o], 0), 1);
        return Hr(r);
      },
      mg = (e, t, r) => {
        let o = $o(Mo(e)),
          n = $o(Mo(t)),
          a = Bs(
            (function Fs(e) {
              let t = e.L + 0.3963377774 * e.a + 0.2158037573 * e.b,
                r = e.L - 0.1055613458 * e.a - 0.0638541728 * e.b,
                o = e.L - 0.0894841775 * e.a - 1.291485548 * e.b,
                n = t * t * t,
                i = r * r * r,
                a = o * o * o;
              return {
                r: 4.0767416621 * n - 3.3077115913 * i + 0.2309699292 * a,
                g: -1.2684380046 * n + 2.6097574011 * i - 0.3413193965 * a,
                b: -0.0041960863 * n - 0.7034186147 * i + 1.707614701 * a,
                a: e.alpha,
              };
            })({
              L: (1 - r) * o.L + r * n.L,
              a: (1 - r) * o.a + r * n.a,
              b: (1 - r) * o.b + r * n.b,
              alpha: (1 - r) * o.alpha + r * n.alpha,
            }),
          );
        return Hr(a);
      },
      Fo = (e, t = {}) => {
        var r;
        return {
          type: "boolean",
          default: e,
          valueType: null,
          [_e]: "TheatrePropType",
          label: t.label,
          interpolate: null != (r = t.interpolate) ? r : Jr,
          deserializeAndSanitize: hg,
        };
      },
      hg = (e) => ("boolean" == typeof e ? e : void 0);
    function Jr(e) {
      return e;
    }
    var Uo = (e, t = {}) => {
      var r;
      return {
        type: "string",
        default: e,
        valueType: null,
        [_e]: "TheatrePropType",
        label: t.label,
        interpolate: null != (r = t.interpolate) ? r : Jr,
        deserializeAndSanitize: gg,
      };
    };
    function gg(e) {
      return "string" == typeof e ? e : void 0;
    }
    function yg(e, t, r = {}) {
      var o, n;
      return {
        type: "stringLiteral",
        default: e,
        valuesAndLabels: _({}, t),
        [_e]: "TheatrePropType",
        valueType: null,
        as: null != (o = r.as) ? o : "menu",
        label: r.label,
        interpolate: null != (n = r.interpolate) ? n : Jr,
        deserializeAndSanitize(i) {
          if (
            "string" == typeof i &&
            Object.prototype.hasOwnProperty.call(t, i)
          )
            return i;
        },
      };
    }
    var bg = ({ config: e, deltaX: t, deltaFraction: r, magnitude: o }) => {
      var i;
      let { range: n } = e;
      return e.nudgeMultiplier || !n || n.includes(1 / 0) || n.includes(-1 / 0)
        ? t * o * (null != (i = e.nudgeMultiplier) ? i : 1)
        : r * (n[1] - n[0]) * o;
    };
    function qt(e, t) {
      let r = ((e) =>
        e
          .replace(/^[\s\/]*/, "")
          .replace(/[\s\/]*$/, "")
          .replace(/\s*\/\s*/g, " / "))(e);
      return r;
    }
    (Gt(qo()), new WeakMap());
    var Xr = class {
        get type() {
          return "Theatre_Sheet_PublicAPI";
        }
        constructor(t) {
          ue(this, t);
        }
        object(t, r, o) {
          let n = T(this),
            i = qt(t),
            a = n.getObject(i),
            l =
              null == o
                ? void 0
                : o.__actions__THIS_API_IS_UNSTABLE_AND_WILL_CHANGE_IN_THE_NEXT_VERSION;
          if (a) return (l && a.template._temp_setActions(l), a.publicApi);
          {
            let p = Ut(r);
            return n.createObject(i, null, p, l).publicApi;
          }
        }
        get sequence() {
          return T(this).getSequence().publicApi;
        }
        get project() {
          return T(this).project.publicApi;
        }
        get address() {
          return _({}, T(this).address);
        }
        detachObject(t) {
          let r = T(this),
            o = qt(t);
          if (!r.getObject(o))
            return (
              pe.warning(
                `Couldn't delete object "${o}"`,
                `There is no object with key "${o}".\n\nTo fix this, make sure you are calling \`sheet.deleteObject("${o}")\` with the correct key.`,
              ),
              void console.warn(`Object key "${o}" does not exist.`)
            );
          r.deleteObject(o);
        }
      },
      Zr = class {
        constructor(t, r) {
          ((this.template = t),
            (this.instanceId = r),
            d(this, "_objects", new I({})),
            d(this, "_sequence"),
            d(this, "address"),
            d(this, "publicApi"),
            d(this, "project"),
            d(this, "objectsP", this._objects.pointer),
            d(this, "type", "Theatre_Sheet"),
            d(this, "_logger"),
            (this._logger = t.project._logger.named("Sheet", r)),
            this._logger._trace("creating sheet"),
            (this.project = t.project),
            (this.address = V(_({}, t.address), {
              sheetInstanceId: this.instanceId,
            })),
            (this.publicApi = new Xr(this)));
        }
        createObject(t, r, o, n = {}) {
          let a = this.template
            .getObjectTemplate(t, r, o, n)
            .createInstance(this, r, o);
          return (this._objects.setByPointer((s) => s[t], a), a);
        }
        getObject(t) {
          return this._objects.get()[t];
        }
        deleteObject(t) {
          this._objects.reduce((r) => {
            let o = _({}, r);
            return (delete o[t], o);
          });
        }
        getSequence() {
          if (!this._sequence) {
            let t = g(() => {
                let o = j(
                  this.project.pointers.historic.sheetsById[
                    this.address.sheetId
                  ].sequence.length,
                );
                return _g(o);
              }),
              r = g(() => {
                let o = j(
                  this.project.pointers.historic.sheetsById[
                    this.address.sheetId
                  ].sequence.subUnitsPerUnit,
                );
                return vg(o);
              });
            this._sequence = new Kr(this.template.project, this, t, r);
          }
          return this._sequence;
        }
      },
      _g = (e) => ("number" == typeof e && isFinite(e) && e > 0 ? e : 10),
      vg = (e) =>
        "number" == typeof e && wo(e) && e >= 1 && e <= 1e3 ? e : 30,
      Qr = class {
        constructor(t, r) {
          ((this.project = t),
            d(this, "type", "Theatre_SheetTemplate"),
            d(this, "address"),
            d(this, "_instances", new I({})),
            d(this, "instancesP", this._instances.pointer),
            d(this, "_objectTemplates", new I({})),
            d(this, "objectTemplatesP", this._objectTemplates.pointer),
            (this.address = V(_({}, t.address), { sheetId: r })));
        }
        getInstance(t) {
          let r = this._instances.get()[t];
          return (
            r ||
              ((r = new Zr(this, t)),
              this._instances.setByPointer((o) => o[t], r)),
            r
          );
        }
        getObjectTemplate(t, r, o, n) {
          let i = this._objectTemplates.get()[t];
          return (
            i ||
              ((i = new Nr(this, t, r, o, n)),
              this._objectTemplates.setByPointer((a) => a[t], i)),
            i
          );
        }
      },
      Ws = (e) => new Promise((t) => setTimeout(t, e));
    function ie(e) {
      for (
        var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), o = 1;
        o < t;
        o++
      )
        r[o - 1] = arguments[o];
      throw Error(
        "[Immer] minified error nr: " +
          e +
          (r.length
            ? " " +
              r
                .map(function (a) {
                  return "'" + a + "'";
                })
                .join(",")
            : "") +
          ". Find the full error at: https://bit.ly/3cXEKWf",
      );
    }
    function Xe(e) {
      return !!e && !!e[H];
    }
    function Ze(e) {
      return (
        !!e &&
        ((function (t) {
          if (!t || "object" != typeof t) return !1;
          var r = Object.getPrototypeOf(t);
          if (null === r) return !0;
          var o = Object.hasOwnProperty.call(r, "constructor") && r.constructor;
          return (
            o === Object ||
            ("function" == typeof o && Function.toString.call(o) === kg)
          );
        })(e) ||
          Array.isArray(e) ||
          !!e[rp] ||
          !!e.constructor[rp] ||
          Wo(e) ||
          Ko(e))
      );
    }
    function zt(e, t, r) {
      (void 0 === r && (r = !1),
        0 === kt(e)
          ? (r ? Object.keys : nn)(e).forEach(function (o) {
              (r && "symbol" == typeof o) || t(o, e[o], e);
            })
          : e.forEach(function (o, n) {
              return t(n, o, e);
            }));
    }
    function kt(e) {
      var t = e[H];
      return t
        ? t.i > 3
          ? t.i - 4
          : t.i
        : Array.isArray(e)
          ? 1
          : Wo(e)
            ? 2
            : Ko(e)
              ? 3
              : 0;
    }
    function zo(e, t) {
      return 2 === kt(e)
        ? e.has(t)
        : Object.prototype.hasOwnProperty.call(e, t);
    }
    function Gs(e, t, r) {
      var o = kt(e);
      2 === o ? e.set(t, r) : 3 === o ? (e.delete(t), e.add(r)) : (e[t] = r);
    }
    function Wo(e) {
      return wg && e instanceof Map;
    }
    function Ko(e) {
      return Cg && e instanceof Set;
    }
    function Qe(e) {
      return e.o || e.t;
    }
    function Go(e) {
      if (Array.isArray(e)) return Array.prototype.slice.call(e);
      var t = Dg(e);
      delete t[H];
      for (var r = nn(t), o = 0; o < r.length; o++) {
        var n = r[o],
          i = t[n];
        (!1 === i.writable && ((i.writable = !0), (i.configurable = !0)),
          (i.get || i.set) &&
            (t[n] = {
              configurable: !0,
              writable: !0,
              enumerable: i.enumerable,
              value: e[n],
            }));
      }
      return Object.create(Object.getPrototypeOf(e), t);
    }
    function Ho(e, t) {
      return (
        void 0 === t && (t = !1),
        Jo(e) ||
          Xe(e) ||
          !Ze(e) ||
          (kt(e) > 1 && (e.set = e.add = e.clear = e.delete = Ig),
          Object.freeze(e),
          t &&
            zt(
              e,
              function (r, o) {
                return Ho(o, !0);
              },
              !0,
            )),
        e
      );
    }
    function Ig() {
      ie(2);
    }
    function Jo(e) {
      return null == e || "object" != typeof e || Object.isFrozen(e);
    }
    function ve(e) {
      var t = Eg[e];
      return (t || ie(18, e), t);
    }
    function Hs() {
      return Wt;
    }
    function Yo(e, t) {
      t && (ve("Patches"), (e.u = []), (e.s = []), (e.v = t));
    }
    function eo(e) {
      (Xo(e), e.p.forEach(Ag), (e.p = null));
    }
    function Xo(e) {
      e === Wt && (Wt = e.l);
    }
    function Js(e) {
      return (Wt = { p: [], l: Wt, h: e, m: !0, _: 0 });
    }
    function Ag(e) {
      var t = e[H];
      0 === t.i || 1 === t.i ? t.j() : (t.O = !0);
    }
    function Zo(e, t) {
      t._ = t.p.length;
      var r = t.p[0],
        o = void 0 !== e && e !== r;
      return (
        t.h.g || ve("ES5").S(t, e, o),
        o
          ? (r[H].P && (eo(t), ie(4)),
            Ze(e) && ((e = to(t, e)), t.l || ro(t, e)),
            t.u && ve("Patches").M(r[H], e, t.u, t.s))
          : (e = to(t, r, [])),
        eo(t),
        t.u && t.v(t.u, t.s),
        e !== tp ? e : void 0
      );
    }
    function to(e, t, r) {
      if (Jo(t)) return t;
      var o = t[H];
      if (!o)
        return (
          zt(
            t,
            function (i, a) {
              return Ys(e, o, t, i, a, r);
            },
            !0,
          ),
          t
        );
      if (o.A !== e) return t;
      if (!o.P) return (ro(e, o.t, !0), o.t);
      if (!o.I) {
        ((o.I = !0), o.A._--);
        var n = 4 === o.i || 5 === o.i ? (o.o = Go(o.k)) : o.o;
        (zt(3 === o.i ? new Set(n) : n, function (i, a) {
          return Ys(e, o, n, i, a, r);
        }),
          ro(e, n, !1),
          r && e.u && ve("Patches").R(o, r, e.u, e.s));
      }
      return o.o;
    }
    function Ys(e, t, r, o, n, i) {
      if (Xe(n)) {
        var a = to(
          e,
          n,
          i && t && 3 !== t.i && !zo(t.D, o) ? i.concat(o) : void 0,
        );
        if ((Gs(r, o, a), !Xe(a))) return;
        e.m = !1;
      }
      if (Ze(n) && !Jo(n)) {
        if (!e.h.F && e._ < 1) return;
        (to(e, n), (t && t.A.l) || ro(e, n));
      }
    }
    function ro(e, t, r) {
      (void 0 === r && (r = !1), e.h.F && e.m && Ho(t, r));
    }
    function Qo(e, t) {
      var r = e[H];
      return (r ? Qe(r) : e)[t];
    }
    function Xs(e, t) {
      if (t in e)
        for (var r = Object.getPrototypeOf(e); r; ) {
          var o = Object.getOwnPropertyDescriptor(r, t);
          if (o) return o;
          r = Object.getPrototypeOf(r);
        }
    }
    function en(e) {
      e.P || ((e.P = !0), e.l && en(e.l));
    }
    function tn(e) {
      e.o || (e.o = Go(e.t));
    }
    function rn(e, t, r) {
      var o = Wo(t)
        ? ve("MapSet").N(t, r)
        : Ko(t)
          ? ve("MapSet").T(t, r)
          : e.g
            ? (function (n, i) {
                var a = Array.isArray(n),
                  s = {
                    i: a ? 1 : 0,
                    A: i ? i.A : Hs(),
                    P: !1,
                    I: !1,
                    D: {},
                    l: i,
                    t: n,
                    k: null,
                    o: null,
                    j: null,
                    C: !1,
                  },
                  l = s,
                  p = oo;
                a && ((l = [s]), (p = no));
                var u = Proxy.revocable(l, p),
                  c = u.revoke,
                  m = u.proxy;
                return ((s.k = m), (s.j = c), m);
              })(t, r)
            : ve("ES5").J(t, r);
      return ((r ? r.A : Hs()).p.push(o), o);
    }
    function Og(e) {
      return (
        Xe(e) || ie(22, e),
        (function t(r) {
          if (!Ze(r)) return r;
          var o,
            n = r[H],
            i = kt(r);
          if (n) {
            if (!n.P && (n.i < 4 || !ve("ES5").K(n))) return n.t;
            ((n.I = !0), (o = Zs(r, i)), (n.I = !1));
          } else o = Zs(r, i);
          return (
            zt(o, function (a, s) {
              (n &&
                (function xg(e, t) {
                  return 2 === kt(e) ? e.get(t) : e[t];
                })(n.t, a) === s) ||
                Gs(o, a, t(s));
            }),
            3 === i ? new Set(o) : o
          );
        })(e)
      );
    }
    function Zs(e, t) {
      switch (t) {
        case 2:
          return new Map(e);
        case 3:
          return Array.from(e);
      }
      return Go(e);
    }
    var Qs,
      Wt,
      on = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x"),
      wg = "undefined" != typeof Map,
      Cg = "undefined" != typeof Set,
      ep =
        "undefined" != typeof Proxy &&
        void 0 !== Proxy.revocable &&
        "undefined" != typeof Reflect,
      tp = on
        ? Symbol.for("immer-nothing")
        : (((Qs = {})["immer-nothing"] = !0), Qs),
      rp = on ? Symbol.for("immer-draftable") : "__$immer_draftable",
      H = on ? Symbol.for("immer-state") : "__$immer_state",
      kg =
        ("undefined" != typeof Symbol && Symbol.iterator,
        "" + Object.prototype.constructor),
      nn =
        "undefined" != typeof Reflect && Reflect.ownKeys
          ? Reflect.ownKeys
          : void 0 !== Object.getOwnPropertySymbols
            ? function (e) {
                return Object.getOwnPropertyNames(e).concat(
                  Object.getOwnPropertySymbols(e),
                );
              }
            : Object.getOwnPropertyNames,
      Dg =
        Object.getOwnPropertyDescriptors ||
        function (e) {
          var t = {};
          return (
            nn(e).forEach(function (r) {
              t[r] = Object.getOwnPropertyDescriptor(e, r);
            }),
            t
          );
        },
      Eg = {},
      oo = {
        get: function (e, t) {
          if (t === H) return e;
          var r = Qe(e);
          if (!zo(r, t))
            return (function (n, i, a) {
              var s,
                l = Xs(i, a);
              return l
                ? "value" in l
                  ? l.value
                  : null === (s = l.get) || void 0 === s
                    ? void 0
                    : s.call(n.k)
                : void 0;
            })(e, r, t);
          var o = r[t];
          return e.I || !Ze(o)
            ? o
            : o === Qo(e.t, t)
              ? (tn(e), (e.o[t] = rn(e.A.h, o, e)))
              : o;
        },
        has: function (e, t) {
          return t in Qe(e);
        },
        ownKeys: function (e) {
          return Reflect.ownKeys(Qe(e));
        },
        set: function (e, t, r) {
          var o = Xs(Qe(e), t);
          if (null == o ? void 0 : o.set) return (o.set.call(e.k, r), !0);
          if (!e.P) {
            var n = Qo(Qe(e), t),
              i = null == n ? void 0 : n[H];
            if (i && i.t === r) return ((e.o[t] = r), (e.D[t] = !1), !0);
            if (
              (function Sg(e, t) {
                return e === t ? 0 !== e || 1 / e == 1 / t : e != e && t != t;
              })(r, n) &&
              (void 0 !== r || zo(e.t, t))
            )
              return !0;
            (tn(e), en(e));
          }
          return (
            (e.o[t] === r &&
              "number" != typeof r &&
              (void 0 !== r || t in e.o)) ||
            ((e.o[t] = r), (e.D[t] = !0), !0)
          );
        },
        deleteProperty: function (e, t) {
          return (
            void 0 !== Qo(e.t, t) || t in e.t
              ? ((e.D[t] = !1), tn(e), en(e))
              : delete e.D[t],
            e.o && delete e.o[t],
            !0
          );
        },
        getOwnPropertyDescriptor: function (e, t) {
          var r = Qe(e),
            o = Reflect.getOwnPropertyDescriptor(r, t);
          return (
            o && {
              writable: !0,
              configurable: 1 !== e.i || "length" !== t,
              enumerable: o.enumerable,
              value: r[t],
            }
          );
        },
        defineProperty: function () {
          ie(11);
        },
        getPrototypeOf: function (e) {
          return Object.getPrototypeOf(e.t);
        },
        setPrototypeOf: function () {
          ie(12);
        },
      },
      no = {};
    (zt(oo, function (e, t) {
      no[e] = function () {
        return ((arguments[0] = arguments[0][0]), t.apply(this, arguments));
      };
    }),
      (no.deleteProperty = function (e, t) {
        return oo.deleteProperty.call(this, e[0], t);
      }),
      (no.set = function (e, t, r) {
        return oo.set.call(this, e[0], t, r, e[0]);
      }));
    var Rg = (function () {
        function e(r) {
          var o = this;
          ((this.g = ep),
            (this.F = !0),
            (this.produce = function (n, i, a) {
              if ("function" == typeof n && "function" != typeof i) {
                var s = i;
                i = n;
                var l = o;
                return function (f) {
                  var y = this;
                  void 0 === f && (f = s);
                  for (
                    var v = arguments.length,
                      b = Array(v > 1 ? v - 1 : 0),
                      P = 1;
                    P < v;
                    P++
                  )
                    b[P - 1] = arguments[P];
                  return l.produce(f, function (x) {
                    var O;
                    return (O = i).call.apply(O, [y, x].concat(b));
                  });
                };
              }
              var p;
              if (
                ("function" != typeof i && ie(6),
                void 0 !== a && "function" != typeof a && ie(7),
                Ze(n))
              ) {
                var u = Js(o),
                  c = rn(o, n, void 0),
                  m = !0;
                try {
                  ((p = i(c)), (m = !1));
                } finally {
                  m ? eo(u) : Xo(u);
                }
                return "undefined" != typeof Promise && p instanceof Promise
                  ? p.then(
                      function (f) {
                        return (Yo(u, a), Zo(f, u));
                      },
                      function (f) {
                        throw (eo(u), f);
                      },
                    )
                  : (Yo(u, a), Zo(p, u));
              }
              if (!n || "object" != typeof n)
                return (p = i(n)) === tp
                  ? void 0
                  : (void 0 === p && (p = n), o.F && Ho(p, !0), p);
              ie(21, n);
            }),
            (this.produceWithPatches = function (n, i) {
              return "function" == typeof n
                ? function (l) {
                    for (
                      var p = arguments.length,
                        u = Array(p > 1 ? p - 1 : 0),
                        c = 1;
                      c < p;
                      c++
                    )
                      u[c - 1] = arguments[c];
                    return o.produceWithPatches(l, function (m) {
                      return n.apply(void 0, [m].concat(u));
                    });
                  }
                : [
                    o.produce(n, i, function (l, p) {
                      ((a = l), (s = p));
                    }),
                    a,
                    s,
                  ];
              var a, s;
            }),
            "boolean" == typeof (null == r ? void 0 : r.useProxies) &&
              this.setUseProxies(r.useProxies),
            "boolean" == typeof (null == r ? void 0 : r.autoFreeze) &&
              this.setAutoFreeze(r.autoFreeze));
        }
        var t = e.prototype;
        return (
          (t.createDraft = function (r) {
            (Ze(r) || ie(8), Xe(r) && (r = Og(r)));
            var o = Js(this),
              n = rn(this, r, void 0);
            return ((n[H].C = !0), Xo(o), n);
          }),
          (t.finishDraft = function (r, o) {
            var i = (r && r[H]).A;
            return (Yo(i, o), Zo(void 0, i));
          }),
          (t.setAutoFreeze = function (r) {
            this.F = r;
          }),
          (t.setUseProxies = function (r) {
            (r && !ep && ie(20), (this.g = r));
          }),
          (t.applyPatches = function (r, o) {
            var n;
            for (n = o.length - 1; n >= 0; n--) {
              var i = o[n];
              if (0 === i.path.length && "replace" === i.op) {
                r = i.value;
                break;
              }
            }
            var a = ve("Patches").$;
            return Xe(r)
              ? a(r, o)
              : this.produce(r, function (s) {
                  return a(s, o.slice(n + 1));
                });
          }),
          e
        );
      })(),
      te = new Rg(),
      Dt =
        (te.produce,
        te.produceWithPatches.bind(te),
        te.setAutoFreeze.bind(te),
        te.setUseProxies.bind(te),
        te.applyPatches.bind(te),
        te.createDraft.bind(te),
        te.finishDraft.bind(te),
        { currentProjectStateDefinitionVersion: "0.4.0" });
    async function an(e, t, r) {
      (await Ws(0),
        e.transaction(({ drafts: o }) => {
          var u;
          let n = t.address.projectId;
          ((o.ephemeral.coreByProject[n] = {
            lastExportedObject: null,
            loadingState: { type: "loading" },
          }),
            (o.ahistoric.coreByProject[n] = { ahistoricStuff: "" }));
          let p =
            null ==
            (u = (function Ks(e) {
              return (Xe(e) || ie(23, e), e[H].t);
            })(o.historic))
              ? void 0
              : u.coreByProject[t.address.projectId];
          p
            ? r && -1 == p.revisionHistory.indexOf(r.revisionHistory[0])
              ? (function l(c) {
                  o.ephemeral.coreByProject[n].loadingState = {
                    type: "browserStateIsNotBasedOnDiskState",
                    onDiskState: c,
                  };
                })(r)
              : (function s() {
                  o.ephemeral.coreByProject[n].loadingState = {
                    type: "loaded",
                  };
                })()
            : r
              ? (function a(c) {
                  ((o.ephemeral.coreByProject[n].loadingState = {
                    type: "loaded",
                  }),
                    (o.historic.coreByProject[n] = c));
                })(r)
              : (function i() {
                  ((o.ephemeral.coreByProject[n].loadingState = {
                    type: "loaded",
                  }),
                    (o.historic.coreByProject[n] = {
                      sheetsById: {},
                      definitionVersion:
                        Dt.currentProjectStateDefinitionVersion,
                      revisionHistory: [],
                    }));
                })();
        }));
    }
    function op() {}
    function io(e) {
      var i, a;
      let t = (
          null == (i = null == e ? void 0 : e.logging) ? void 0 : i.internal
        )
          ? null != (a = e.logging.min)
            ? a
            : S.WARN
          : 1 / 0,
        r = t <= S.DEBUG,
        o = t <= S.ERROR,
        n = Bt(void 0, {
          _debug: r
            ? console.debug.bind(
                console,
                "_coreLogger(TheatreInternalLogger) debug",
              )
            : op,
          _error: o
            ? console.error.bind(
                console,
                "_coreLogger(TheatreInternalLogger) error",
              )
            : op,
        });
      if (e) {
        let { logger: s, logging: l } = e;
        (s && n.configureLogger(s),
          l ? n.configureLogging(l) : n.configureLogging({ dev: !1 }));
      }
      return n.getLogger().named("Theatre");
    }
    var ao = class {
        constructor(t, r = {}, o) {
          var i;
          ((this.config = r),
            (this.publicApi = o),
            d(this, "pointers"),
            d(this, "_pointerProxies"),
            d(this, "address"),
            d(this, "_studioReadyDeferred"),
            d(this, "_assetStorageReadyDeferred"),
            d(this, "_readyPromise"),
            d(this, "_sheetTemplates", new I({})),
            d(this, "sheetTemplatesP", this._sheetTemplates.pointer),
            d(this, "_studio"),
            d(this, "assetStorage"),
            d(this, "type", "Theatre_Project"),
            d(this, "_logger"),
            (this._logger = io({ logging: { dev: !0 } }).named("Project", t)),
            this._logger.traceDev("creating project"),
            (this.address = { projectId: t }));
          let n = new I({
            ahistoric: { ahistoricStuff: "" },
            historic:
              null != (i = r.state)
                ? i
                : {
                    sheetsById: {},
                    definitionVersion: Dt.currentProjectStateDefinitionVersion,
                    revisionHistory: [],
                  },
            ephemeral: {
              loadingState: { type: "loaded" },
              lastExportedObject: null,
            },
          });
          ((this._assetStorageReadyDeferred = ne()),
            (this.assetStorage = {
              getAssetUrl: (a) => {
                var s;
                return `${null == (s = r.assets) ? void 0 : s.baseUrl}/${a}`;
              },
              createAsset: () => {
                throw new Error("Please wait for Project.ready to use assets.");
              },
            }),
            (this._pointerProxies = {
              historic: new Fe(n.pointer.historic),
              ahistoric: new Fe(n.pointer.ahistoric),
              ephemeral: new Fe(n.pointer.ephemeral),
            }),
            (this.pointers = {
              historic: this._pointerProxies.historic.pointer,
              ahistoric: this._pointerProxies.ahistoric.pointer,
              ephemeral: this._pointerProxies.ephemeral.pointer,
            }),
            Ue.add(t, this),
            (this._studioReadyDeferred = ne()),
            (this._readyPromise = Promise.all([
              this._studioReadyDeferred.promise,
              this._assetStorageReadyDeferred.promise,
            ]).then(() => {})),
            r.state
              ? setTimeout(() => {
                  this._studio ||
                    (this._studioReadyDeferred.resolve(void 0),
                    this._assetStorageReadyDeferred.resolve(void 0),
                    this._logger._trace(
                      "ready deferred resolved with no state",
                    ));
                }, 0)
              : "undefined" == typeof window
                ? console.error(
                    `Argument config.state in Theatre.getProject("${t}", config) is empty. You can safely ignore this message if you're developing a Next.js/Remix project in development mode. But if you are shipping to your end-users, then you need to set config.state, otherwise your project's state will be empty and nothing will animate. Learn more at https://www.theatrejs.com/docs/latest/manual/projects#state`,
                  )
                : setTimeout(() => {
                    if (!this._studio)
                      throw new Error(
                        `Argument config.state in Theatre.getProject("${t}", config) is empty. This is fine while you are using @theatre/core along with @theatre/studio. But since @theatre/studio is not loaded, the state of project "${t}" will be empty.\n\nTo fix this, you need to add @theatre/studio into the bundle and export the project's state. Learn how to do that at https://www.theatrejs.com/docs/latest/manual/projects#state\n`,
                      );
                  }, 1e3));
        }
        attachToStudio(t) {
          if (this._studio) {
            if (this._studio !== t)
              throw new Error(
                `Project ${this.address.projectId} is already attached to studio ${this._studio.address.studioId}`,
              );
            console.warn(
              `Project ${this.address.projectId} is already attached to studio ${this._studio.address.studioId}`,
            );
          } else
            ((this._studio = t),
              t.initialized.then(async () => {
                var r;
                (await an(t, this, this.config.state),
                  this._pointerProxies.historic.setPointer(
                    t.atomP.historic.coreByProject[this.address.projectId],
                  ),
                  this._pointerProxies.ahistoric.setPointer(
                    t.atomP.ahistoric.coreByProject[this.address.projectId],
                  ),
                  this._pointerProxies.ephemeral.setPointer(
                    t.atomP.ephemeral.coreByProject[this.address.projectId],
                  ),
                  t
                    .createAssetStorage(
                      this,
                      null == (r = this.config.assets) ? void 0 : r.baseUrl,
                    )
                    .then((o) => {
                      ((this.assetStorage = o),
                        this._assetStorageReadyDeferred.resolve(void 0));
                    }),
                  this._studioReadyDeferred.resolve(void 0));
              }));
        }
        get isAttachedToStudio() {
          return !!this._studio;
        }
        get ready() {
          return this._readyPromise;
        }
        isReady() {
          return (
            "resolved" === this._studioReadyDeferred.status &&
            "resolved" === this._assetStorageReadyDeferred.status
          );
        }
        getOrCreateSheet(t, r = "default") {
          let o = this._sheetTemplates.get()[t];
          return (
            o ||
              ((o = new Qr(this, t)),
              this._sheetTemplates.reduce((n) => V(_({}, n), { [t]: o }))),
            o.getInstance(r)
          );
        }
        destroy() {
          this._studio
            ? console.warn(
                `Project ${this.address.projectId} is attached to studio ${this._studio.address.studioId} so will not be destroyed`,
              )
            : Ue.remove(this.address.projectId);
        }
      },
      so = class {
        get type() {
          return "Theatre_Project_PublicAPI";
        }
        constructor(t, r = {}) {
          ue(this, new ao(t, r, this));
        }
        get ready() {
          return T(this).ready;
        }
        get isReady() {
          return T(this).isReady();
        }
        get address() {
          return _({}, T(this).address);
        }
        getAssetUrl(t) {
          if (this.isReady)
            return t.id ? T(this).assetStorage.getAssetUrl(t.id) : void 0;
          console.error(
            "Calling `project.getAssetUrl()` before `project.ready` is resolved, will always return `undefined`. Either use `project.ready.then(() => project.getAssetUrl())` or `await project.ready` before calling `project.getAssetUrl()`.",
          );
        }
        sheet(t, r = "default") {
          let o = qt(t);
          return T(this).getOrCreateSheet(o, r).publicApi;
        }
        destroy() {
          T(this).destroy();
        }
      };
    Gt(qo());
    function np(e, t = {}) {
      let r = Ue.get(e);
      if (r) return r.publicApi;
      let n = io().named("Project", e);
      return (
        t.state
          ? (Lg(e, t.state), n._debug("deep validated config.state on disk"))
          : n._debug("no config.state"),
        new so(e, t)
      );
    }
    var Lg = (e, t) => {
      ((e, t) => {
        if (
          Array.isArray(t) ||
          null == t ||
          t.definitionVersion !== Dt.currentProjectStateDefinitionVersion
        )
          throw new oe(
            `Error validating conf.state in Theatre.getProject(${JSON.stringify(e)}, conf). The state seems to be formatted in a way that is unreadable to Theatre.js. Read more at https://www.theatrejs.com/docs/latest/manual/projects#state`,
          );
      })(e, t);
    };
    function Rr(e, t, r) {
      let o = r ? T(r).ticker : qr();
      if (ae(e)) return ke(e).onChange(o, t, !0);
      if (we(e)) return e.onChange(o, t, !0);
      throw new Error(
        "Called onChange(p) where p is neither a pointer nor a prism.",
      );
    }
    function ip(e) {
      if (ae(e)) return ke(e).getValue();
      throw new Error("Called val(p) where p is not a pointer.");
    }
    var po = class {
      constructor() {
        d(this, "_studio");
      }
      get type() {
        return "Theatre_CoreBundle";
      }
      get version() {
        return "0.6.1-dev.5";
      }
      getBitsForStudio(t, r) {
        if (this._studio)
          throw new Error(
            "@theatre/core is already attached to @theatre/studio",
          );
        ((this._studio = t),
          r({
            projectsP: Ue.atom.pointer.projects,
            privateAPI: T,
            coreExports: sn,
            getCoreRafDriver: Lo,
          }));
      }
    };
    (!(function Mg() {
      if ("undefined" == typeof window) return;
      let e = window[$r];
      if (void 0 !== e)
        throw "object" == typeof e && e && "string" == typeof e.version
          ? new Error(
              "It seems that the module '@theatre/core' is loaded more than once. This could have two possible causes:\n1. You might have two separate versions of Theatre.js in node_modules.\n2. Or this might be a bundling misconfiguration, in case you're using a bundler like Webpack/ESBuild/Rollup.\n\nNote that it **is okay** to import '@theatre/core' multiple times. But those imports should point to the same module.",
            )
          : new Error(
              `The variable window.${$r} seems to be already set by a module other than @theatre/core.`,
            );
      let t = new po();
      window[$r] = t;
      let r = window.__TheatreJS_StudioBundle;
      r &&
        null !== r &&
        "Theatre_StudioBundle" === r.type &&
        r.registerCoreBundle(t);
    })(),
      (window.Theatre = {
        core: pn,
        get studio() {
          alert(
            "Theatre.studio is only available in the core-and-studio.js bundle. You're using the core-only.min.js bundle.",
          );
        },
      }));
  })(),
  Hydra.ready(() => {
    ((TweenManager.Transforms = [
      "scale",
      "scaleX",
      "scaleY",
      "x",
      "y",
      "z",
      "rotation",
      "rotationX",
      "rotationY",
      "rotationZ",
      "skewX",
      "skewY",
      "perspective",
    ]),
      (TweenManager.CubicEases = [
        {
          name: "easeOutCubic",
          curve: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
        },
        {
          name: "easeOutQuad",
          curve: "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
        },
        {
          name: "easeOutQuart",
          curve: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
        },
        {
          name: "easeOutQuint",
          curve: "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
        },
        {
          name: "easeOutSine",
          curve: "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
        },
        {
          name: "easeOutExpo",
          curve: "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
        },
        {
          name: "easeOutCirc",
          curve: "cubic-bezier(0.075, 0.820, 0.165, 1.000)",
        },
        {
          name: "easeOutBack",
          curve: "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
        },
        {
          name: "easeInCubic",
          curve: "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
        },
        {
          name: "easeInQuad",
          curve: "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
        },
        {
          name: "easeInQuart",
          curve: "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
        },
        {
          name: "easeInQuint",
          curve: "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
        },
        {
          name: "easeInSine",
          curve: "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
        },
        {
          name: "easeInCirc",
          curve: "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
        },
        {
          name: "easeInBack",
          curve: "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
        },
        {
          name: "easeInOutCubic",
          curve: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
        },
        {
          name: "easeInOutQuad",
          curve: "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
        },
        {
          name: "easeInOutQuart",
          curve: "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
        },
        {
          name: "easeInOutQuint",
          curve: "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
        },
        {
          name: "easeInOutSine",
          curve: "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
        },
        {
          name: "easeInOutExpo",
          curve: "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
        },
        {
          name: "easeInOutCirc",
          curve: "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
        },
        {
          name: "easeInOutBack",
          curve: "cubic-bezier(0.680, -0.550, 0.265, 1.550)",
        },
        { name: "easeInOut", curve: "cubic-bezier(.42,0,.58,1)" },
        { name: "linear", curve: "linear" },
      ]),
      (TweenManager.useCSSTrans = function (props, ease, object) {
        return !(
          props.math ||
          ("string" == typeof ease && ease.includes(["Elastic", "Bounce"])) ||
          object.multiTween ||
          TweenManager._inspectEase(ease).path ||
          !Device.tween.transition
        );
      }),
      (TweenManager._detectTween = function (
        object,
        props,
        time,
        ease,
        delay,
        callback,
      ) {
        return TweenManager.useCSSTrans(props, ease, object)
          ? new CSSTransition(object, props, time, ease, delay, callback)
          : new FrameTween(object, props, time, ease, delay, callback);
      }),
      (TweenManager._parseTransform = function (props) {
        var unitRequiresCSSTween = ["%", "vw", "vh", "em"],
          transforms = "",
          translate = "";
        if (
          (props.perspective > 0 &&
            (transforms += "perspective(" + props.perspective + "px)"),
          void 0 !== props.x || void 0 !== props.y || void 0 !== props.z)
        ) {
          var x = props.x || 0,
            y = props.y || 0,
            z = props.z || 0;
          ((translate +=
            x +
            ("string" == typeof props.x &&
            props.x.includes(unitRequiresCSSTween)
              ? ""
              : "px") +
            ", "),
            (translate +=
              y +
              ("string" == typeof props.y &&
              props.y.includes(unitRequiresCSSTween)
                ? ""
                : "px")),
            Device.tween.css3d
              ? (transforms +=
                  "translate3d(" + (translate += ", " + z + "px") + ")")
              : (transforms += "translate(" + translate + ")"));
        }
        return (
          void 0 !== props.scale
            ? (transforms += "scale(" + props.scale + ")")
            : (void 0 !== props.scaleX &&
                (transforms += "scaleX(" + props.scaleX + ")"),
              void 0 !== props.scaleY &&
                (transforms += "scaleY(" + props.scaleY + ")")),
          void 0 !== props.rotation &&
            (transforms += "rotate(" + props.rotation + "deg)"),
          void 0 !== props.rotationX &&
            (transforms += "rotateX(" + props.rotationX + "deg)"),
          void 0 !== props.rotationY &&
            (transforms += "rotateY(" + props.rotationY + "deg)"),
          void 0 !== props.rotationZ &&
            (transforms += "rotateZ(" + props.rotationZ + "deg)"),
          void 0 !== props.skewX &&
            (transforms += "skewX(" + props.skewX + "deg)"),
          void 0 !== props.skewY &&
            (transforms += "skewY(" + props.skewY + "deg)"),
          transforms
        );
      }),
      (TweenManager._clearCSSTween = function (obj) {
        obj &&
          !obj._cssTween &&
          obj.div._transition &&
          !obj.persistTween &&
          ((obj.div.style[HydraCSS.styles.vendorTransition] = ""),
          (obj.div._transition = !1),
          (obj._cssTween = null));
      }),
      (TweenManager._isTransform = function (key) {
        return TweenManager.Transforms.indexOf(key) > -1;
      }),
      (TweenManager._getAllTransforms = function (object) {
        for (
          var obj = {}, i = TweenManager.Transforms.length - 1;
          i > -1;
          i--
        ) {
          var tf = TweenManager.Transforms[i],
            val = object[tf];
          0 === val ||
            ("number" != typeof val && "string" != typeof val) ||
            (obj[tf] = val);
        }
        return obj;
      }));
    const prefix = (function () {
      let pre = "",
        dom = "";
      try {
        var styles = window.getComputedStyle(document.documentElement, "");
        return (
          (pre = (Array.prototype.slice
            .call(styles)
            .join("")
            .match(/-(moz|webkit|ms)-/) ||
            ("" === styles.OLink && ["", "o"]))[1]),
          (dom = "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i"))[1]),
          {
            unprefixed:
              "ie" == Device.system.browser && !Device.detect("msie 9"),
            dom: dom,
            lowercase: pre,
            css: "-" + pre + "-",
            js:
              ("ie" == Device.system.browser ? pre[0] : pre[0].toUpperCase()) +
              pre.substr(1),
          }
        );
      } catch (e) {
        return { unprefixed: !0, dom: "", lowercase: "", css: "", js: "" };
      }
    })();
    ((HydraCSS.styles = {}),
      (HydraCSS.styles.vendor = prefix.unprefixed ? "" : prefix.js),
      (HydraCSS.styles.vendorTransition = HydraCSS.styles.vendor.length
        ? HydraCSS.styles.vendor + "Transition"
        : "transition"),
      (HydraCSS.styles.vendorTransform = HydraCSS.styles.vendor.length
        ? HydraCSS.styles.vendor + "Transform"
        : "transform"),
      (HydraCSS.vendor = prefix.css),
      (HydraCSS.transformProperty = (function () {
        switch (prefix.lowercase) {
          case "moz":
            return "-moz-transform";
          case "webkit":
            return "-webkit-transform";
          case "o":
            return "-o-transform";
          case "ms":
            return "-ms-transform";
          default:
            return "transform";
        }
      })()),
      (HydraCSS.tween = {}),
      (HydraCSS.tween.complete = prefix.unprefixed
        ? "transitionend"
        : prefix.lowercase + "TransitionEnd"));
  }),
  Class(
    function CSSTransition(_object, _props, _time, _ease, _delay, _callback) {
      const _this = this;
      let _transformProps, _transitionProps;
      function killed() {
        return !_this || _this.kill || !_object || !_object.div;
      }
      function clearCSSTween() {
        killed() ||
          ((_this.playing = !1),
          (_object._cssTween = null),
          _object.willChange(null),
          (_object = _props = null),
          Utils.nullObject(_this));
      }
      ((this.playing = !0),
        (function () {
          if ("number" != typeof _time)
            throw "CSSTween Requires object, props, time, ease";
          (!(function initProperties() {
            var transform = TweenManager._getAllTransforms(_object),
              properties = [];
            for (var key in _props)
              TweenManager._isTransform(key)
                ? ((transform.use = !0),
                  (transform[key] = _props[key]),
                  delete _props[key])
                : ("number" == typeof _props[key] ||
                    key.includes(["-", "color"])) &&
                  properties.push(key);
            transform.use &&
              (properties.push(HydraCSS.transformProperty),
              delete transform.use);
            (properties.map((prop, index) => {
              "strokeDashoffset" == prop &&
                (properties[index] = "stroke-dashoffset");
            }),
              (_transformProps = transform),
              (_transitionProps = properties));
          })(),
            (async function initCSSTween(values) {
              if (killed()) return;
              _object._cssTween && (_object._cssTween.kill = !0);
              ((_object._cssTween = _this), (_object.div._transition = !0));
              var strings = (function buildStrings(time, ease, delay) {
                for (
                  var props = "",
                    str = "",
                    len = _transitionProps.length,
                    i = 0;
                  i < len;
                  i++
                ) {
                  var transitionProp = _transitionProps[i];
                  ((props += (props.length ? ", " : "") + transitionProp),
                    (str +=
                      (str.length ? ", " : "") +
                      transitionProp +
                      " " +
                      time +
                      "ms " +
                      TweenManager._getEase(ease) +
                      " " +
                      delay +
                      "ms"));
                }
                return { props: props, transition: str };
              })(_time, _ease, _delay);
              _object.willChange(strings.props);
              var time = values ? values.time : _time,
                delay = values ? values.delay : _delay,
                props = values ? values.props : _props,
                transformProps = values ? values.transform : _transformProps,
                singleFrame = 1e3 / Render.REFRESH_RATE;
              if (
                ((_this.time = _time),
                (_this.delay = _delay),
                await Timer.delayedCall(3 * singleFrame),
                killed())
              )
                return;
              if (
                ((_object.div.style[HydraCSS.styles.vendorTransition] =
                  strings.transition),
                (_this.playing = !0),
                "safari" == Device.system.browser)
              ) {
                if (
                  (Device.system.browserVersion < 11 &&
                    (await Timer.delayedCall(singleFrame)),
                  killed())
                )
                  return;
                (_object.css(props), _object.transform(transformProps));
              } else (_object.css(props), _object.transform(transformProps));
              Timer.create(function () {
                killed() ||
                  (clearCSSTween(),
                  _callback && _callback(),
                  _this.completePromise && _this.completePromise.resolve());
              }, time + delay);
            })());
        })(),
        (this.stop = function () {
          this.playing &&
            ((this.kill = !0),
            (this.playing = !1),
            (_object.div.style[HydraCSS.styles.vendorTransition] = ""),
            (_object.div._transition = !1),
            _object.willChange(null),
            (_object._cssTween = null),
            Utils.nullObject(this));
        }),
        (this.onComplete = function (callback) {
          return ((_callback = callback), this);
        }),
        (this.promise = function () {
          return (
            _this.completePromise || (_this.completePromise = Promise.create()),
            _this.completePromise
          );
        }));
    },
  ),
  Class(
    function FrameTween(
      _object,
      _props,
      _time,
      _ease,
      _delay,
      _callback,
      _manual,
    ) {
      var _endValues,
        _transformEnd,
        _transformStart,
        _startValues,
        _isTransform,
        _isCSS,
        _transformProps,
        _cssTween,
        _transformTween,
        _update,
        _this = this;
      function copy(obj) {
        let newObj = {};
        for (let key in obj)
          "number" == typeof obj[key] && (newObj[key] = obj[key]);
        return newObj;
      }
      function clear() {
        (_object._cssTweens && _object._cssTweens.remove(_this),
          (_this.playing = !1),
          (_object._cssTween = null),
          (_object = _props = null));
      }
      function update() {
        if (
          !(function killed() {
            return _this.kill || !_object || !_object.div || !_object.css;
          })()
        ) {
          if ((_isCSS && _object.css(_props), _isTransform))
            if (_object.multiTween) {
              for (var key in _transformProps)
                "number" == typeof _transformProps[key] &&
                  (_object[key] = _transformProps[key]);
              _object.transform();
            } else _object.transform(_transformProps);
          _update && _update();
        }
      }
      function tweenComplete() {
        _this.playing &&
          (clear(),
          _callback && _callback(),
          _this.completePromise && _this.completePromise.resolve());
      }
      ((this.playing = !0),
        (_this.object = _object),
        (_this.props = _props),
        (_this.time = _time),
        (_this.ease = _ease),
        (_this.delay = _delay),
        defer(function () {
          if (_this.overrideValues) {
            let values = _this.overrideValues(
              _this,
              _object,
              _props,
              _time,
              _ease,
              _delay,
            );
            values &&
              ((_this.props = _props = values.props || _props),
              (_this.time = _time = values.time || _time),
              (_this.ease = _ease = values.ease || _ease),
              (_this.delay = _delay = values.delay || _delay));
          }
          if (
            ("object" == typeof _ease && (_ease = "easeOutCubic"),
            _object && _props)
          ) {
            if (((_this.object = _object), "number" != typeof _time))
              throw "FrameTween Requires object, props, time, ease";
            (!(function initValues() {
              _props.math && delete _props.math;
              Device.tween.transition &&
                _object.div &&
                _object.div._transition &&
                ((_object.div.style[HydraCSS.styles.vendorTransition] = ""),
                (_object.div._transition = !1));
              ((_this.time = _time),
                (_this.delay = _delay),
                (_endValues = {}),
                (_transformEnd = {}),
                (_transformStart = {}),
                (_startValues = {}),
                _object.multiTween ||
                  (void 0 === _props.x && (_props.x = _object.x),
                  void 0 === _props.y && (_props.y = _object.y),
                  void 0 === _props.z && (_props.z = _object.z)));
              for (var key in _props)
                if (key.includes(["damping", "spring"]))
                  ((_endValues[key] = _props[key]),
                    (_transformEnd[key] = _props[key]));
                else if (TweenManager._isTransform(key))
                  ((_isTransform = !0),
                    (_transformStart[key] =
                      _object[key] || ("scale" == key ? 1 : 0)),
                    (_transformEnd[key] = _props[key]));
                else {
                  _isCSS = !0;
                  var v = _props[key];
                  "string" == typeof v
                    ? (_object.div.style[key] = v)
                    : "number" == typeof v &&
                      ((_startValues[key] = _object.css
                        ? Number(_object.css(key))
                        : 0),
                      (_endValues[key] = v));
                }
            })(),
              (function startTween() {
                !_object._cssTween ||
                  _manual ||
                  _object.multiTween ||
                  (_object._cssTween.kill = !0);
                ((_this.time = _time),
                  (_this.delay = _delay),
                  _object.multiTween &&
                    (_object._cssTweens || (_object._cssTweens = []),
                    _object._cssTweens.push(_this)));
                ((_object._cssTween = _this),
                  (_this.playing = !0),
                  (_props = copy(_startValues)),
                  (_transformProps = copy(_transformStart)),
                  _isCSS &&
                    (_cssTween = tween(
                      _props,
                      _endValues,
                      _time,
                      _ease,
                      _delay,
                      null,
                      _manual,
                    )
                      .onUpdate(update)
                      .onComplete(tweenComplete)));
                _isTransform &&
                  (_transformTween = tween(
                    _transformProps,
                    _transformEnd,
                    _time,
                    _ease,
                    _delay,
                    null,
                    _manual,
                  )
                    .onComplete(_isCSS ? null : tweenComplete)
                    .onUpdate(_isCSS ? null : update));
              })());
          }
        }),
        (this.stop = function () {
          this.playing &&
            (_cssTween && _cssTween.stop && _cssTween.stop(),
            _transformTween && _transformTween.stop && _transformTween.stop(),
            clear());
        }),
        (this.interpolate = function (elapsed) {
          (_cssTween && _cssTween.interpolate(elapsed),
            _transformTween && _transformTween.interpolate(elapsed),
            update());
        }),
        (this.getValues = function () {
          return {
            start: _startValues,
            transformStart: _transformStart,
            end: _endValues,
            transformEnd: _transformEnd,
          };
        }),
        (this.setEase = function (ease) {
          (_cssTween && _cssTween.setEase(ease),
            _transformTween && _transformTween.setEase(ease));
        }),
        (this.onUpdate = function () {
          return this;
        }),
        (this.onComplete = function (callback) {
          return ((_callback = callback), this);
        }),
        (this.promise = function () {
          return (
            _this.completePromise || (_this.completePromise = Promise.create()),
            _this.completePromise
          );
        }));
    },
  ));
class DOMAttribute {
  constructor({
    name: name,
    value: value,
    belongsTo: belongsTo,
    bindingLookup: bindingLookup,
  }) {
    ((this.name = name),
      (this.value = value),
      (this.belongsTo = belongsTo),
      (this.bindingLookup = bindingLookup));
  }
}
class TemplateRoot {
  constructor(string, values) {
    ((this.string = string), (this.values = values));
  }
  consolidate() {
    let template = this.string;
    const consolidatedValues = {};
    for (const [marker, value] of Object.entries(this.values))
      if (value instanceof TemplateHTML) {
        const [innerTemplate, innerValues] = value.consolidate();
        ((template = template.replace(marker, innerTemplate)),
          Object.assign(consolidatedValues, innerValues));
      } else if (Array.isArray(value)) {
        let childTemplate = "";
        for (let k = 0; k < value.length; k++) {
          const [innerString, innerValue] = value[k].consolidate();
          ((childTemplate += innerString),
            Object.assign(consolidatedValues, innerValue));
        }
        template = template.replace(marker, childTemplate);
      } else consolidatedValues[marker] = value;
    return [template, consolidatedValues];
  }
  modifyMarkers(template, config, dataMarkers, bindings) {
    let count = 0;
    return template
      .replace(
        /@([a-z]+)="\{\{(hydra-[0-9]+)\}\}"/g,
        function (_, event, marker) {
          const dataMarker = "data-attach-event-" + count++;
          return (
            dataMarkers.push(dataMarker),
            `${dataMarker}="${event}|${marker}"`
          );
        },
      )
      .replace(/\{\{hydra-[0-9]+\}\}/g, function (marker) {
        if (config[marker] && config[marker].state)
          return (bindings.push({ lookup: marker.trim() }), marker);
        if (config[marker]["@style"]) {
          const styles = config[marker]["@style"];
          if (!styles || "object" != typeof styles)
            return void console.error("@style must contain an object");
          let styleString = "";
          return (
            Object.keys(styles).forEach((prop) => {
              const kebabProp = prop
                .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
                .toLowerCase();
              styleString += `${kebabProp}: ${styles[prop]};\n`;
            }),
            styleString
          );
        }
        return config[marker];
      });
  }
}
class TemplateHTML extends TemplateRoot {
  constructor(string, values) {
    super(string, values);
  }
  inflate(root, cssElement) {
    let [template, config] = this.consolidate(),
      dataMarkers = [],
      nestedComponents = [],
      bindings = new LinkedList(),
      scrollTop = root.firstChild?.scrollTop;
    const t = this.modifyMarkers(template, config, dataMarkers, bindings);
    for (; root.firstChild; ) root.removeChild(root.firstChild);
    (root.flatBindings && root.flatBindings.forEach((b) => b.destroy()),
      (root.flatBindings = []));
    let fragment = document.createDocumentFragment(),
      newNode = DOMTemplate.parser.parseFromString(t, "text/html"),
      els = newNode.body.firstChild.querySelectorAll("*"),
      length = els.length;
    (fragment.appendChild(newNode.body.firstChild),
      cssElement && fragment.appendChild(cssElement));
    for (let index = length - 1; index > -1; index--) {
      let el = els[index];
      ~el.tagName.indexOf("-") && nestedComponents.push(el);
      let innerText = el.innerText,
        innerHTML = el.innerHTML,
        attributes = [...el.attributes].map((a) => ({
          name: a.name,
          value: a.value,
        }));
      if (~innerHTML.indexOf("<")) continue;
      let binding = bindings.start();
      for (; binding; ) {
        let bindingLookup = binding.lookup;
        if (
          (attributes.forEach((attr) => {
            if (~attr?.value?.indexOf(bindingLookup)) {
              let obj = config[bindingLookup];
              const attrObject = new DOMAttribute({
                name: attr.name,
                value: el.getAttribute(attr.name),
                belongsTo: el,
                bindingLookup: bindingLookup,
              });
              root.flatBindings.push(obj.state.bind(obj.key, attrObject));
            }
          }),
          ~innerText.indexOf(bindingLookup))
        ) {
          let obj = config[bindingLookup];
          (~innerText.indexOf("@[") &&
            (el.innerText = innerText.replace(bindingLookup, obj.key)),
            root.flatBindings.push(obj.state.bind(obj.key, el)));
        }
        binding = bindings.next();
      }
    }
    (root.appendChild(fragment),
      dataMarkers.forEach((dataMarker) => {
        const element = root.querySelector(`[${dataMarker}]`),
          dataEvent = element.getAttribute(dataMarker),
          [event, marker] = dataEvent.split("|");
        (element.removeAttribute(dataMarker),
          element.addEventListener(`${event}`, config[`{{${marker}}}`]));
      }),
      defer(() => {
        nestedComponents.forEach((template) => {
          const className = template.tagName
            .toLowerCase()
            .replace(/(^\w|-\w)/g, (str) => str.replace(/-/, "").toUpperCase());
          $(`#${template.id}`, className, !0).add(new window[className]());
        });
      }),
      scrollTop && (root.firstChild.scrollTop = scrollTop));
  }
}
class TemplateCSS extends TemplateRoot {
  constructor(string, values) {
    super(string, values);
  }
  inflate(root) {
    let [template, config] = this.consolidate(),
      bindings = new LinkedList(),
      element = document.createElement("style");
    return (
      (element.innerHTML = this.modifyMarkers(template, config, [], bindings)),
      element
    );
  }
}
function styleMap(object) {
  return Object.keys(object)
    .map((key) => (object[key] ? key : ""))
    .join(" ");
}
(!(function () {
  let markerID = 0;
  function makeMarker() {
    return `{{hydra-${markerID++}}}`;
  }
  function html(strings, ...values) {
    const config = {};
    let string = "";
    for (let i = 0; i < strings.length - 1; i++) {
      const marker = makeMarker();
      ((string += strings[i]),
        (string += marker),
        (config[marker] = values[i]));
    }
    return (
      (string += strings[strings.length - 1]),
      new TemplateHTML(string, config)
    );
  }
  function css(strings, ...values) {
    const config = {};
    let string = "";
    for (let i = 0; i < strings.length - 1; i++) {
      const marker = makeMarker();
      ((string += strings[i]),
        (string += marker),
        (config[marker] = values[i]));
    }
    return (
      (string += strings[strings.length - 1]),
      new TemplateCSS(string, config)
    );
  }
  Class(
    function DOMTemplate() {
      Inherit(this, Element);
      const _this = this;
      if (((this.data = []), Hydra.LOCAL && window.UILSocket)) {
        let name = Utils.getConstructorName(_this);
        _this.events.sub(UILSocket.JS_FILE, (e) => {
          e.file.includes(name) &&
            (DOMTemplate.updateGlobalStyles(), _this.update());
        });
      }
      function update() {
        let cssContent;
        (_this.dynamicStyle &&
          (cssContent = _this.dynamicStyle(css).inflate(_this.element.div)),
          _this.render?.(html).inflate?.(_this.element.div, cssContent),
          _this.postRender?.());
      }
      ((this.update = function () {
        (DOMTemplate.clearScheduled(update), DOMTemplate.schedule(update));
      }),
        (this.render = function (html) {
          throw new Error("render() needs to be overwritten.");
        }),
        (this.setSourceData = function (data) {
          ((_this.data = data),
            this.update(),
            _this.events.sub(data, Events.UPDATE, this.update));
        }),
        _this.update());
    },
    (_) => {
      DOMTemplate.parser = new DOMParser();
      const queue = [],
        worker = new Render.Worker((_) => {
          let callback = queue.shift();
          callback ? callback() : worker.pause();
        }, 2);
      var _css;
      (worker.pause(),
        (DOMTemplate.schedule = function (callback) {
          (queue.push(callback), worker.resume());
        }),
        (DOMTemplate.clearScheduled = function (callback) {
          for (let i = 0; i < queue.length; i++) {
            if (queue[i] == callback) return queue.splice(i, 1);
          }
        }),
        (DOMTemplate.updateGlobalStyles = function () {
          Utils.debounce(async (_) => {
            let css = await get(Assets.getPath("assets/css/style-scss.css"));
            (_css ||
              (_css = $(document.head).create("DOMTemplate-hotload", "style")),
              (_css.div.innerHTML = css));
          }, 20);
        }));
    },
  );
})(),
  Class(
    function Interaction(_object) {
      Inherit(this, Events);
      const _this = this;
      var _touchId,
        _velocity = [],
        _moved = 0,
        _time = performance.now();
      function Vec2() {
        ((this.x = 0),
          (this.y = 0),
          (this.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
          }));
      }
      var _vec2Pool = new ObjectPool(Vec2, 10);
      let _distance, _timeDown, _timeMove;
      function loop() {
        _moved++ > 10 &&
          ((_this.velocity.x = _this.velocity.y = 0),
          (_this.delta.x = _this.delta.y = 0));
      }
      function down(e) {
        const hitCondition =
          !!_this.hitReturn &&
          "hit" == e.target.className &&
          e.target.hydraObject != _object;
        if (
          _this.isTouching &&
          !_this.multiTouch &&
          null !== _touchId &&
          e.touches
        ) {
          for (let i = 0; i < e.touches.length; ++i)
            if (e.touches[i].identifier === _touchId) return;
          ((_touchId = null), (_this.isTouching = !1));
        }
        if (
          (_this.isTouching && !_this.multiTouch) ||
          hitCondition ||
          Interaction.hitIsBound(e.target, _object)
        )
          return;
        _this.isTouching = !0;
        let x = e.x,
          y = e.y;
        (e.changedTouches &&
          !_touchId &&
          ((x = e.changedTouches[0].clientX),
          (y = e.changedTouches[0].clientY),
          (_touchId = e.changedTouches[0].identifier)),
          e.touches &&
            "number" == typeof e.touches[0].force &&
            (e.force = e.touches[0].force),
          (e.x = _this.x = x),
          (e.y = _this.y = y),
          (_this.hold.x = _this.last.x = x),
          (_this.hold.y = _this.last.y = y),
          (_this.delta.x = _this.move.x = _this.velocity.x = 0),
          (_this.delta.y = _this.move.y = _this.velocity.y = 0),
          (_distance = 0),
          _this.events.fire(Interaction.START, e, !0),
          (_timeDown = _timeMove = Render.TIME));
      }
      function move(e) {
        if (!_this.isTouching && !_this.unlocked) return;
        let now = performance.now();
        if (now - _time < 16) return;
        _time = now;
        let x = e.x,
          y = e.y;
        if (e.touches)
          for (let i = 0; i < e.touches.length; i++) {
            let touch = e.touches[i];
            touch.identifier == _touchId &&
              ((x = touch.clientX), (y = touch.clientY));
          }
        (_this.isTouching &&
          ((_this.move.x = x - _this.hold.x),
          (_this.move.y = y - _this.hold.y)),
          e.touches &&
            "number" == typeof e.touches[0].force &&
            (e.force = e.touches[0].force),
          (e.x = _this.x = x),
          (e.y = _this.y = y),
          (_this.delta.x = x - _this.last.x),
          (_this.delta.y = y - _this.last.y),
          (_this.last.x = x),
          (_this.last.y = y),
          (_moved = 0),
          (_distance += _this.delta.length()));
        let delta = Render.TIME - (_timeMove || Render.TIME);
        if (((_timeMove = Render.TIME), delta > 0.01)) {
          let velocity = _vec2Pool.get();
          ((velocity.x = Math.abs(_this.delta.x) / delta),
            (velocity.y = Math.abs(_this.delta.y) / delta),
            _velocity.push(velocity),
            _velocity.length > 5 && _vec2Pool.put(_velocity.shift()));
        }
        _this.velocity.x = _this.velocity.y = 0;
        for (let i = 0; i < _velocity.length; i++)
          ((_this.velocity.x += _velocity[i].x),
            (_this.velocity.y += _velocity[i].y));
        ((_this.velocity.x /= _velocity.length),
          (_this.velocity.y /= _velocity.length),
          (_this.velocity.x = _this.velocity.x || 0),
          (_this.velocity.y = _this.velocity.y || 0),
          _this.events.fire(Interaction.MOVE, e, !0),
          _this.isTouching && _this.events.fire(Interaction.DRAG, e, !0));
      }
      function up(e) {
        if (e && e.changedTouches && e.touches.length) {
          let someTouchIdentified = !1;
          for (let i = 0; i < e.changedTouches.length; i++)
            e.changedTouches[i].identifier === _touchId &&
              (someTouchIdentified = !0);
          if (!someTouchIdentified) return;
        }
        if (!_this.isTouching && !_this.unlocked) return;
        ((_this.isTouching = !1),
          (_this.move.x = 0),
          (_this.move.y = 0),
          Math.max(0.001, Render.TIME - (_timeMove || Render.TIME)) >= 40 &&
            ((_this.delta.x = 0), (_this.delta.y = 0)),
          _distance < 20 &&
            Render.TIME - _timeDown < 1e3 &&
            !e.isLeaveEvent &&
            _this.events.fire(Interaction.CLICK, e, !0),
          _this.events.fire(Interaction.END, e, !0),
          (_touchId = null),
          Device.mobile && (_this.velocity.x = _this.velocity.y = 0));
      }
      function leave() {
        _this.ignoreLeave ||
          ((_this.delta.x = 0), (_this.delta.y = 0), up({ isLeaveEvent: !0 }));
      }
      ((this.x = 0),
        (this.y = 0),
        (this.hold = new Vec2()),
        (this.last = new Vec2()),
        (this.delta = new Vec2()),
        (this.move = new Vec2()),
        (this.velocity = new Vec2()),
        (this.hitReturn = !0),
        (function () {
          if ((!_object) instanceof HydraObject)
            throw "Interaction.Input requires a HydraObject";
          (!(function addHandlers() {
            _object == Stage || _object == __window
              ? Interaction.bind("touchstart", down)
              : (_object.bind("touchstart", down),
                Interaction.bindObject(_object));
            (Interaction.bind("touchmove", move),
              Interaction.bind("touchend", up),
              Interaction.bind("leave", leave));
          })(),
            Render.start(loop));
        })(),
        (this.onDestroy = function () {
          (Interaction.unbind("touchstart", down),
            Interaction.unbind("touchmove", move),
            Interaction.unbind("touchend", up),
            Render.stop(loop),
            Interaction.unbindObject(_object),
            _object && _object.unbind && _object.unbind("touchstart", down));
        }));
    },
    () => {
      (Namespace(Interaction),
        (Interaction.CLICK = "interaction_click"),
        (Interaction.START = "interaction_start"),
        (Interaction.MOVE = "interaction_move"),
        (Interaction.DRAG = "interaction_drag"),
        (Interaction.END = "interaction_end"));
      const _objects = [],
        _events = { touchstart: [], touchmove: [], touchend: [], leave: [] };
      function touchMove(e) {
        _events.touchmove.forEach((c) => c(e));
      }
      function touchStart(e) {
        _events.touchstart.forEach((c) => c(e));
      }
      function touchEnd(e) {
        _events.touchend.forEach((c) => c(e));
      }
      function leave(e) {
        ((e.leave = !0), _events.leave.forEach((c) => c(e)));
      }
      (Hydra.ready(async () => {
        (await defer(),
          __window.bind("touchstart", touchStart),
          __window.bind("touchmove", touchMove),
          __window.bind("touchend", touchEnd),
          __window.bind("touchcancel", touchEnd),
          __window.bind("contextmenu", touchEnd),
          __window.bind("mouseleave", leave),
          __window.bind("mouseout", leave));
      }),
        (Interaction.bind = function (evt, callback) {
          _events[evt].push(callback);
        }),
        (Interaction.unbind = function (evt, callback) {
          _events[evt].remove(callback);
        }),
        (Interaction.bindObject = function (obj) {
          _objects.push(obj);
        }),
        (Interaction.unbindObject = function (obj) {
          _objects.remove(obj);
        }),
        (Interaction.hitIsBound = function (element, boundObj) {
          let obj = element.hydraObject;
          if (!obj) return !1;
          for (; obj; ) {
            if (obj != boundObj && _objects.includes(obj)) return !0;
            obj = obj._parent;
          }
          return !1;
        }));
    },
  ),
  Class(function Mouse() {
    Inherit(this, Events);
    const _this = this;
    ((this.x = 0),
      (this.y = 0),
      (this.normal = { x: 0, y: 0 }),
      (this.tilt = { x: 0, y: 0 }),
      (this.inverseNormal = { x: 0, y: 0 }),
      (this.resetOnRelease = !1));
    const _offset = { x: 0, y: 0 };
    function init() {
      ((_this.x = Stage.width / 2),
        (_this.y = Stage.height / 2),
        defer((_) => {
          _this.resetOnRelease &&
            Device.mobile &&
            ((_this.x = Stage.width / 2), (_this.y = Stage.height / 2));
        }),
        (_this.input = new Interaction(__window)),
        (_this.input.unlocked = !0),
        _this.events.sub(_this.input, Interaction.START, start),
        _this.events.sub(_this.input, Interaction.MOVE, update),
        _this.events.sub(_this.input, Interaction.END, end),
        (_this.hold = _this.input.hold),
        (_this.last = _this.input.last),
        (_this.delta = _this.input.delta),
        (_this.move = _this.input.move),
        (_this.velocity = _this.input.velocity),
        defer(() => {
          (_this.events.sub(Events.RESIZE, resize), resize());
        }));
    }
    function start(e) {
      ((_this.down = !0), update(e));
    }
    function update(e) {
      (_this.force && (e = _this.force),
        (_this.x = e.x),
        (_this.y = e.y),
        Stage.width &&
          Stage.height &&
          ((_this.normal.x = e.x / Stage.width - _offset.x),
          (_this.normal.y = e.y / Stage.height - _offset.y),
          (_this.tilt.x = 2 * _this.normal.x - 1),
          (_this.tilt.y = 1 - 2 * _this.normal.y),
          (_this.inverseNormal.x = _this.normal.x),
          (_this.inverseNormal.y = 1 - _this.normal.y)));
    }
    function end(e) {
      ((_this.down = !1),
        Device.mobile &&
          _this.resetOnRelease &&
          update({ x: Stage.width / 2, y: Stage.height / 2 }));
    }
    function resize() {
      (Stage.css("top") && (_offset.y = Stage.css("top") / Stage.height),
        Stage.css("left") && (_offset.x = Stage.css("left") / Stage.width));
    }
    (Hydra.ready(init), (_this.update = update));
  }, "Static"),
  Class(function Keyboard() {
    Inherit(this, Component);
    var _this = this;
    function addListeners() {
      (__window.keydown(keydown),
        __window.keyup(keyup),
        __window.keypress(keypress),
        window.addEventListener("focus", onFocus));
    }
    function keydown(e) {
      (_this.pressing.includes(e.key) || _this.pressing.push(e.key),
        _this.events.fire(_this.DOWN, e),
        2 == _this.pressing.length &&
          _this.pressing.includes("Meta") &&
          _this.pressing.includes("Shift") &&
          (_this.pressing.length = 0));
    }
    function keyup(e) {
      (_this.pressing.remove(e.key), _this.events.fire(_this.UP, e));
    }
    function keypress(e) {
      _this.events.fire(_this.PRESS, e);
    }
    function onFocus() {
      _this.pressing.length = 0;
    }
    ((this.pressing = []),
      (_this.DOWN = "keyboard_down"),
      (_this.PRESS = "keyboard_press"),
      (_this.UP = "keyboard_up"),
      Hydra.ready(addListeners));
  }, "static"),
  Class(function Mobile() {
    (Inherit(this, Component), Namespace(this));
    const _this = this;
    var $html,
      $featureDetects,
      _is100vh = !1;
    function preventNativeScroll(e) {
      if (_this.isAllowNativeScroll) return;
      let target = e.target;
      if (
        target.closest(
          "label, input, textarea, select, a, button, [contenteditable]",
        )
      )
        return;
      let prevent = target.hydraObject;
      for (; target.parentNode && prevent; )
        (target._scrollParent && (prevent = !1), (target = target.parentNode));
      prevent && e.preventDefault();
    }
    function resize() {
      (updateOrientation(),
        checkResizeRefresh(),
        updateMobileFullscreen(),
        _this.isAllowNativeScroll || (document.body.scrollTop = 0));
    }
    function updateOrientation() {
      ((_this.orientation =
        Stage.width > Stage.height ? "landscape" : "portrait"),
        _this.orientationSet &&
          (window.Fullscreen?.isOpen || Device.mobile?.pwa) &&
          window.screen &&
          window.screen.orientation &&
          window.screen.orientation.lock(_this.orientationSet));
    }
    Hydra.ready(() => {
      if (Device.mobile) {
        if (
          (Stage.isNormalMobileScroll &&
            ((_this.isAllowNativeScroll = !0),
            (_this.isPreventResizeReload = !1)),
          (function initFeatureDetects() {
            $featureDetects = __body.create("feature-detects");
          })(),
          (function addHandlers() {
            (_this.events.sub(Events.RESIZE, resize),
              Device.mobile.native ||
                Stage.isNormalMobileScroll ||
                window.addEventListener("touchstart", preventNativeScroll, {
                  passive: !1,
                }));
          })(),
          Device.mobile?.phone &&
            !Device.mobile.native &&
            !Stage.isNormalMobileScroll)
        ) {
          $html = $(document.documentElement);
          let ios = "safari" === Device.system.browser;
          (ios
            ? $html.div.classList.add("ios")
            : $html.div.classList.add("mob"),
            (_is100vh = !0),
            ios && (__body.css({ height: "100%" }).div.scrollTop = 0),
            updateMobileFullscreen());
        }
        Device.mobile.native && Stage.css({ width: "100vw", height: "100vh" });
      }
    });
    const checkResizeRefresh = (function () {
      let _lastWidth;
      return function () {
        _this.isPreventResizeReload ||
          (_lastWidth != Stage.width &&
            ((_lastWidth = Stage.width),
            ("ios" === Device.system.os ||
              ("android" == Device.system.os && Device.system.version >= 7)) &&
              (!Device.mobile.tablet ||
                Math.max(Stage.width, Stage.height) > 800 ||
                window.location.reload())));
      };
    })();
    function updateMobileFullscreen() {
      if (!Stage.isNormalMobileScroll && $html) {
        let vh100 = $featureDetects.div.offsetHeight;
        $html.div.offsetHeight !== Stage.height
          ? Stage.height === vh100
            ? ($html.css({ height: "" }),
              Stage.css({ height: "100%" }),
              (_is100vh = !0))
            : ($html.css({ height: Stage.height }),
              Stage.css({ height: Stage.height }),
              (_is100vh = !1))
          : _is100vh ||
            Stage.height !== vh100 ||
            ($html.css({ height: "" }),
            Stage.css({ height: "100%" }),
            (_is100vh = !0));
      }
    }
    ((this.vibrate = function (duration) {
      navigator.vibrate && navigator.vibrate(duration);
    }),
      (this.fullscreen = function () {
        if (
          Device.mobile &&
          !Device.mobile.native &&
          !Device.mobile.pwa &&
          !Dev.emulator
        ) {
          if (!window.Fullscreen)
            throw "Mobile.fullscreen requires Fullscreen module";
          "android" !== Device.system.os ||
            Device.detect("oculus") ||
            (__window.bind("touchend", () => {
              Fullscreen.open();
            }),
            _this.ScreenLock && _this.ScreenLock.isActive && window.onresize());
        }
      }),
      (this.setOrientation = function (orientation, isForce) {
        if (_this.System && _this.NativeCore.active)
          return (_this.System.orientation =
            _this.System[orientation.toUpperCase()]);
        if (
          ((_this.orientationSet = orientation), updateOrientation(), isForce)
        ) {
          if (!_this.ScreenLock)
            throw "Mobile.setOrientation isForce argument requires ScreenLock module";
          "any" === orientation
            ? _this.ScreenLock.unlock()
            : _this.ScreenLock.lock();
        }
      }),
      (this.isKeyboardOpen = function () {
        return (
          Device.mobile &&
          document.activeElement.tagName
            .toLowerCase()
            .includes(["textarea", "input"])
        );
      }),
      (this.allowNativeScroll = function (enabled = !0) {
        _this.isAllowNativeScroll = enabled;
        let action = enabled ? "unset" : "";
        [$(document.documentElement), __body, Stage].forEach(($el) =>
          $el.css({
            touchAction: action,
            MSContentZooming: action,
            MSTouchAction: action,
          }),
        );
      }),
      (this.preventResizeReload = function () {
        _this.isPreventResizeReload = !0;
      }),
      (this._addOverflowScroll = function ($obj) {
        (($obj.div._scrollParent = !0),
          Device.mobile.native ||
            (($obj.div._preventEvent = function (e) {
              e.stopPropagation();
            }),
            $obj.bind("touchmove", $obj.div._preventEvent)));
      }),
      (this._removeOverflowScroll = function ($obj) {
        $obj.unbind("touchmove", $obj.div._preventEvent);
      }),
      this.get("phone", () => {
        throw "Mobile.phone is removed. Use Device.mobile.phone";
      }),
      this.get("tablet", () => {
        throw "Mobile.tablet is removed. Use Device.mobile.tablet";
      }),
      this.get("os", () => {
        throw "Mobile.os is removed. Use Device.system.os";
      }),
      (function () {
        var _props = [
          "--safe-area-inset-top",
          "--safe-area-inset-right",
          "--safe-area-inset-bottom",
          "--safe-area-inset-left",
        ];
        function getSafeAreaInset(index) {
          if (!$featureDetects) return 0;
          let style = getComputedStyle($featureDetects.div);
          return parseInt(style.getPropertyValue(_props[index])) || 0;
        }
        ((_this.getSafeAreaInsets = () =>
          _props.map((_, i) => getSafeAreaInset(i))),
          (_this.getSafeAreaInsetTop = () => getSafeAreaInset(0)),
          (_this.getSafeAreaInsetRight = () => getSafeAreaInset(1)),
          (_this.getSafeAreaInsetBottom = () => getSafeAreaInset(2)),
          (_this.getSafeAreaInsetLeft = () => getSafeAreaInset(3)));
      })());
  }, "Static"),
  Class(
    function PushState(_isHash) {
      Inherit(this, Component);
      const _this = this;
      let _store,
        _useInternal,
        _root = "";
      function getState() {
        return _useInternal
          ? new String(_store)
          : _isHash
            ? String(window.location.hash.slice(3))
            : ("/" !== _root && "" !== _root
                ? location.pathname.split(_root)[1]
                : location.pathname.slice(1)) || "";
      }
      function handleStateChange(state, forced) {
        if (state === _store && !forced) return;
        if (_this.flag("isInitializingUseInternal")) return;
        if (_this.isLocked && !forced) {
          if (!_store) return;
          return void (
            _useInternal ||
            (_isHash
              ? (window.location.hash = "!/" + _store)
              : window.history.pushState(
                  null,
                  null,
                  Utils.addQueryToPath(_root + _store),
                ))
          );
        }
        let prevValue = _store;
        ((_store = state),
          _this.events.fire(Events.UPDATE, {
            prevValue: prevValue,
            value: state,
            split: state.split("/"),
          }),
          _this.onStateUpdate?.({
            prevValue: prevValue,
            value: state,
            split: state.split("/"),
          }));
      }
      ("boolean" != typeof _isHash &&
        (_isHash = Hydra.LOCAL || !Device.system.pushstate),
        (this.isLocked = !1),
        _this.flag("isNotBlocked", !0),
        (function addHandlers() {
          if (_isHash)
            return window.addEventListener(
              "hashchange",
              () => handleStateChange(getState()),
              !1,
            );
          window.onpopstate = history.onpushstate = () =>
            handleStateChange(getState());
        })(),
        (_store = getState()),
        _this.flag("isInitializing", !0),
        deferNextTick(() => {
          _this.flag("isInitializing", !1);
        }),
        (this.getState = this._getState =
          function () {
            return Device.mobile.native
              ? Storage.get("app_state") || ""
              : getState();
          }),
        (this.setRoot = function (root) {
          _root = "/" === root.charAt(0) ? root : "/" + root;
        }),
        (this.setState = this._setState =
          async function (state, forced) {
            if (
              ("/" == state.charAt(0) && (state = state.slice(1)),
              _this.events.fire(PushState.SET_STATE),
              await _this.wait("isNotBlocked"),
              Device.mobile.native && Storage.set("app_state", state),
              state !== _store || forced)
            )
              return (
                _useInternal
                  ? (_store = state)
                  : _isHash
                    ? (window.location.hash = "!/" + state)
                    : window.history.pushState(
                        null,
                        null,
                        Utils.addQueryToPath(_root + state),
                      ),
                _this.fireChangeWhenSet &&
                  handleStateChange(getState(), forced),
                (_store = state),
                !0
              );
          }),
        (this.enableBlocker = function () {
          _this.flag("isNotBlocked", !1);
        }),
        (this.disableBlocker = function () {
          _this.flag("isNotBlocked", !0);
        }),
        (this.replaceState = function (state) {
          state !== _store &&
            (_useInternal
              ? (_store = state)
              : _isHash
                ? (window.location.hash = "!/" + state)
                : window.history.replaceState(
                    null,
                    null,
                    Utils.addQueryToPath(_root + state),
                  ),
            _this.fireChangeWhenSet
              ? handleStateChange(getState(), !0)
              : (_store = state));
        }),
        (this.setTitle = function (title) {
          document.title = title;
        }),
        (this.lock = function () {
          ((this.isLocked = !0), _this.events.fire(PushState.LOCK));
        }),
        (this.unlock = function () {
          ((this.isLocked = !1), _this.events.fire(PushState.UNLOCK));
        }),
        (this.useHash = function () {
          _isHash = !0;
        }),
        (this.useInternal = function () {
          (_this.flag("isInitializing") &&
            "" !== _store &&
            (_this.flag("isInitializingUseInternal", !0),
            _this.replaceState(""),
            deferNextTick(() => {
              _this.flag("isInitializingUseInternal", !1);
            })),
            (_useInternal = !0));
        }));
    },
    (_) => {
      ((PushState.SET_STATE = "push_state_set_state"),
        (PushState.LOCK = "push_state_lock"),
        (PushState.UNLOCK = "push_state_unlock"));
    },
  ),
  Class(function Router(_isHash, _rootPath) {
    Inherit(this, PushState, _isHash);
    const _this = this;
    var _debounce,
      _prevView,
      _nextView,
      _404Route,
      _prevRoute,
      _callbacks = [],
      _routesFlattened = [];
    function matchRoute(path) {
      let params;
      const matchedRoute = _routesFlattened.find((route) => {
        const result = route.matcher.exec({ pathname: `/${path}` });
        return (
          !(!result || !result.pathname) &&
          ((params = result.pathname.groups), !0)
        );
      });
      return !!matchedRoute && { ...matchedRoute.route, params: params };
    }
    function handleState(e) {
      let value = e?.value,
        isInit = !1;
      if (
        (value || ((isInit = !0), (value = _this.getState())),
        _this.virtualRoutes)
      )
        return AppState.set("Router/state", String(value), isInit && !value);
      let route = null,
        cb = null;
      if (
        (_this.lock(),
        _callbacks.forEach((callback) => {
          route || ((route = matchRoute(value)), (cb = callback));
        }),
        route && route.redirect)
      ) {
        let redirectedRoute = matchRoute(route.redirect);
        if (redirectedRoute) {
          if (route.updateURL)
            return (_this.unlock(), void _this.setState(route.redirect));
          route = redirectedRoute;
        }
      }
      (route || ((value = "404"), (route = _404Route)),
        AppState.set("Router/state", String(value)),
        AppState.set("Router/route", route),
        (async function doRoute(route, path, callback) {
          if (((_nextView = route?.view), "$" == _nextView?.charAt?.(0))) {
            let ref = _nextView.slice(1);
            if (_this[ref]) _nextView = _this[ref];
            else
              for (let key in _this.classes) {
                let obj = _this.classes[key];
                (obj.ref == ref && obj.force(), (_nextView = _this[ref]));
              }
            _nextView && (_nextView.visible = !0);
          }
          let params = null;
          (await callback?.(_prevView, _nextView, path, route.params, route),
            await _nextView?.onRouteChange?.({
              params: params,
              path: path,
              name: route.name,
              children: route.children,
              meta: route.meta,
            }),
            (_prevView = _nextView),
            AppState.set("Router/previous", _prevRoute?.path),
            AppState.set("Router/previousRoute", _prevRoute),
            (_this.currentRoute = { ...route, params: params }),
            _this.unlock(),
            (_prevRoute = route));
        })(route, value, cb));
    }
    function handleInstanceReloaded({
      oldInstance: oldInstance,
      newInstance: newInstance,
    }) {
      _prevView === oldInstance && (_prevView = newInstance);
    }
    function addChildrenRoutes(element, parentPath) {
      element.children &&
        element.children.length &&
        element.children.forEach((child) => {
          const path = `${parentPath}/${child.path}`;
          (_routesFlattened.push({
            path: `${parentPath}/${child.path}`,
            route: child,
            matcher: new URLPattern({ pathname: path }),
          }),
            addChildrenRoutes(child, path));
        });
    }
    ((_this.currentRoute = null),
      (_this.fireChangeWhenSet = !0),
      (function setRootPath(val) {
        let rootPath;
        ((rootPath =
          "string" == typeof _rootPath ? _rootPath : Hydra.LOCAL ? "" : "/"),
          _this.setRoot(rootPath));
      })(),
      (function initEvents() {
        (_this.events.sub(_this, Events.UPDATE, handleState),
          _this.events.sub(
            Component.HMR_INSTANCE_RELOADED,
            handleInstanceReloaded,
          ));
      })(),
      (this._initFragRoutes = function (array) {
        (array.forEach((obj) => {
          (obj.view && (obj.view = _this[obj.view.slice(1)]),
            obj.lazyView && (obj.view = obj.lazyView));
        }),
          this.registerRoutes(_this.onRouteChange, array));
      }),
      (this.registerRoutes = function (callback, list) {
        if (
          (list.forEach((element) => {
            if (element.path.startsWith("/"))
              throw new Error("router paths should not start with /");
            if (element.redirect && element.redirect.startsWith("/"))
              throw new Error("redirect paths must not start with /");
            const path = `/${element.path}`;
            (_routesFlattened.push({
              path: path,
              route: element,
              matcher: new URLPattern({ pathname: path }),
            }),
              addChildrenRoutes(element, path),
              "404" === element.path && (_404Route = element));
          }),
          !_404Route)
        )
          throw new Error(
            'Error: no 404 route defined.  Please define a route whos path is "404" ',
          );
        (_callbacks.push(callback),
          clearTimeout(_debounce),
          (_debounce = _this.delayedCall(handleState, 1)));
      }),
      (this.navigate = function (path) {
        _this.isLocked ||
          (path.startsWith("/") && (path = path.substring(1)),
          Utils.debounce(() => {
            _this.setState(path);
          }, 10));
      }),
      (this.replace = function (path) {
        (path.startsWith("/") && (path = path.substring(1)),
          Utils.debounce(() => {
            _this.replaceState(path);
          }, 10));
      }));
  }),
  (() => {
    "use strict";
    var t = /[$_\p{ID_Start}]/u,
      e = /[$_\u200C\u200D\p{ID_Continue}]/u;
    function n(t, e) {
      return (e ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(t);
    }
    function s(s, r = !1) {
      const i = [];
      let a = 0;
      for (; a < s.length; ) {
        const o = s[a],
          h = function (t) {
            if (!r) throw new TypeError(t);
            i.push({ type: "INVALID_CHAR", index: a, value: s[a++] });
          };
        if ("*" !== o)
          if ("+" !== o && "?" !== o)
            if ("\\" !== o)
              if ("{" !== o)
                if ("}" !== o)
                  if (":" !== o)
                    if ("(" !== o)
                      i.push({ type: "CHAR", index: a, value: s[a++] });
                    else {
                      let t = 1,
                        e = "",
                        r = a + 1,
                        o = !1;
                      if ("?" === s[r]) {
                        h(`Pattern cannot start with "?" at ${r}`);
                        continue;
                      }
                      for (; r < s.length; ) {
                        if (!n(s[r], !1)) {
                          (h(`Invalid character '${s[r]}' at ${r}.`), (o = !0));
                          break;
                        }
                        if ("\\" !== s[r]) {
                          if (")" === s[r]) {
                            if ((t--, 0 === t)) {
                              r++;
                              break;
                            }
                          } else if ("(" === s[r] && (t++, "?" !== s[r + 1])) {
                            (h(`Capturing groups are not allowed at ${r}`),
                              (o = !0));
                            break;
                          }
                          e += s[r++];
                        } else e += s[r++] + s[r++];
                      }
                      if (o) continue;
                      if (t) {
                        h(`Unbalanced pattern at ${a}`);
                        continue;
                      }
                      if (!e) {
                        h(`Missing pattern at ${a}`);
                        continue;
                      }
                      (i.push({ type: "PATTERN", index: a, value: e }),
                        (a = r));
                    }
                  else {
                    let n = "",
                      r = a + 1;
                    for (; r < s.length; ) {
                      const i = s.substr(r, 1);
                      if (
                        !(
                          (r === a + 1 && t.test(i)) ||
                          (r !== a + 1 && e.test(i))
                        )
                      )
                        break;
                      n += s[r++];
                    }
                    if (!n) {
                      h(`Missing parameter name at ${a}`);
                      continue;
                    }
                    (i.push({ type: "NAME", index: a, value: n }), (a = r));
                  }
                else i.push({ type: "CLOSE", index: a, value: s[a++] });
              else i.push({ type: "OPEN", index: a, value: s[a++] });
            else i.push({ type: "ESCAPED_CHAR", index: a++, value: s[a++] });
          else i.push({ type: "MODIFIER", index: a, value: s[a++] });
        else i.push({ type: "ASTERISK", index: a, value: s[a++] });
      }
      return (i.push({ type: "END", index: a, value: "" }), i);
    }
    function r(t, e = {}) {
      const n = s(t),
        { prefixes: r = "./" } = e,
        a = `[^${i(e.delimiter || "/#?")}]+?`,
        o = [];
      let h = 0,
        p = 0,
        c = "",
        u = new Set();
      const f = (t) => {
          if (p < n.length && n[p].type === t) return n[p++].value;
        },
        l = () => f("MODIFIER") || f("ASTERISK"),
        m = (t) => {
          const e = f(t);
          if (void 0 !== e) return e;
          const { type: s, index: r } = n[p];
          throw new TypeError(`Unexpected ${s} at ${r}, expected ${t}`);
        },
        d = () => {
          let t,
            e = "";
          for (; (t = f("CHAR") || f("ESCAPED_CHAR")); ) e += t;
          return e;
        },
        g = e.encodePart || ((t) => t);
      for (; p < n.length; ) {
        const t = f("CHAR"),
          e = f("NAME");
        let n = f("PATTERN");
        if ((e || n || !f("ASTERISK") || (n = ".*"), e || n)) {
          let s = t || "";
          (-1 === r.indexOf(s) && ((c += s), (s = "")),
            c && (o.push(g(c)), (c = "")));
          const i = e || h++;
          if (u.has(i)) throw new TypeError(`Duplicate name '${i}'.`);
          (u.add(i),
            o.push({
              name: i,
              prefix: g(s),
              suffix: "",
              pattern: n || a,
              modifier: l() || "",
            }));
          continue;
        }
        const s = t || f("ESCAPED_CHAR");
        if (s) c += s;
        else if (f("OPEN")) {
          const t = d(),
            e = f("NAME") || "";
          let n = f("PATTERN") || "";
          e || n || !f("ASTERISK") || (n = ".*");
          const s = d();
          m("CLOSE");
          const r = l() || "";
          if (!e && !n && !r) {
            c += t;
            continue;
          }
          if (!e && !n && !t) continue;
          (c && (o.push(g(c)), (c = "")),
            o.push({
              name: e || (n ? h++ : ""),
              pattern: e && !n ? a : n,
              prefix: g(t),
              suffix: g(s),
              modifier: r,
            }));
        } else (c && (o.push(g(c)), (c = "")), m("END"));
      }
      return o;
    }
    function i(t) {
      return t.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1");
    }
    function a(t) {
      return t && t.sensitive ? "u" : "ui";
    }
    function o(t, e, n = {}) {
      const {
          strict: s = !1,
          start: r = !0,
          end: o = !0,
          encode: h = (t) => t,
        } = n,
        p = `[${i(n.endsWith || "")}]|$`,
        c = `[${i(n.delimiter || "/#?")}]`;
      let u = r ? "^" : "";
      for (const n of t)
        if ("string" == typeof n) u += i(h(n));
        else {
          const t = i(h(n.prefix)),
            s = i(h(n.suffix));
          if (n.pattern)
            if ((e && e.push(n), t || s))
              if ("+" === n.modifier || "*" === n.modifier) {
                const e = "*" === n.modifier ? "?" : "";
                u += `(?:${t}((?:${n.pattern})(?:${s}${t}(?:${n.pattern}))*)${s})${e}`;
              } else u += `(?:${t}(${n.pattern})${s})${n.modifier}`;
            else
              "+" === n.modifier || "*" === n.modifier
                ? (u += `((?:${n.pattern})${n.modifier})`)
                : (u += `(${n.pattern})${n.modifier}`);
          else u += `(?:${t}${s})${n.modifier}`;
        }
      if (o) (s || (u += `${c}?`), (u += n.endsWith ? `(?=${p})` : "$"));
      else {
        const e = t[t.length - 1],
          n =
            "string" == typeof e
              ? c.indexOf(e[e.length - 1]) > -1
              : void 0 === e;
        (s || (u += `(?:${c}(?=${p}))?`), n || (u += `(?=${c}|${p})`));
      }
      return new RegExp(u, a(n));
    }
    function h(t, e, n) {
      return t instanceof RegExp
        ? (function (t, e) {
            if (!e) return t;
            const n = /\((?:\?<(.*?)>)?(?!\?)/g;
            let s = 0,
              r = n.exec(t.source);
            for (; r; )
              (e.push({
                name: r[1] || s++,
                prefix: "",
                suffix: "",
                modifier: "",
                pattern: "",
              }),
                (r = n.exec(t.source)));
            return t;
          })(t, e)
        : Array.isArray(t)
          ? (function (t, e, n) {
              const s = t.map((t) => h(t, e, n).source);
              return new RegExp(`(?:${s.join("|")})`, a(n));
            })(t, e, n)
          : (function (t, e, n) {
              return o(r(t, n), e, n);
            })(t, e, n);
    }
    var p = { delimiter: "", prefixes: "", sensitive: !0, strict: !0 },
      c = { delimiter: ".", prefixes: "", sensitive: !0, strict: !0 },
      u = { delimiter: "/", prefixes: "/", sensitive: !0, strict: !0 };
    function f(t, e) {
      return t.startsWith(e) ? t.substring(e.length, t.length) : t;
    }
    function l(t) {
      return !(
        !t ||
        t.length < 2 ||
        ("[" !== t[0] && (("\\" !== t[0] && "{" !== t[0]) || "[" !== t[1]))
      );
    }
    var m = ["ftp", "file", "http", "https", "ws", "wss"];
    function d(t) {
      if (!t) return !0;
      for (const e of m) if (t.test(e)) return !0;
      return !1;
    }
    function g(t) {
      switch (t) {
        case "ws":
        case "http":
          return "80";
        case "wws":
        case "https":
          return "443";
        case "ftp":
          return "21";
        default:
          return "";
      }
    }
    function x(t) {
      if ("" === t) return t;
      if (/^[-+.A-Za-z0-9]*$/.test(t)) return t.toLowerCase();
      throw new TypeError(`Invalid protocol '${t}'.`);
    }
    function S(t) {
      if ("" === t) return t;
      const e = new URL("https://example.com");
      return ((e.username = t), e.username);
    }
    function w(t) {
      if ("" === t) return t;
      const e = new URL("https://example.com");
      return ((e.password = t), e.password);
    }
    function k(t) {
      if ("" === t) return t;
      if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(t))
        throw new TypeError(`Invalid hostname '${t}'`);
      const e = new URL("https://example.com");
      return ((e.hostname = t), e.hostname);
    }
    function y(t) {
      if ("" === t) return t;
      if (/[^0-9a-fA-F[\]:]/g.test(t))
        throw new TypeError(`Invalid IPv6 hostname '${t}'`);
      return t.toLowerCase();
    }
    function P(t) {
      if ("" === t) return t;
      if (/^[0-9]*$/.test(t) && parseInt(t) <= 65535) return t;
      throw new TypeError(`Invalid port '${t}'.`);
    }
    function R(t) {
      if ("" === t) return t;
      const e = new URL("https://example.com");
      return (
        (e.pathname = "/" !== t[0] ? "/-" + t : t),
        "/" !== t[0] ? e.pathname.substring(2, e.pathname.length) : e.pathname
      );
    }
    function b(t) {
      return "" === t ? t : new URL(`data:${t}`).pathname;
    }
    function $(t) {
      if ("" === t) return t;
      const e = new URL("https://example.com");
      return ((e.search = t), e.search.substring(1, e.search.length));
    }
    function I(t) {
      if ("" === t) return t;
      const e = new URL("https://example.com");
      return ((e.hash = t), e.hash.substring(1, e.hash.length));
    }
    var C = [
        "protocol",
        "username",
        "password",
        "hostname",
        "port",
        "pathname",
        "search",
        "hash",
      ],
      E = "*";
    function L(t, e) {
      if ("string" != typeof t)
        throw new TypeError("parameter 1 is not of type 'string'.");
      const n = new URL(t, e);
      return {
        protocol: n.protocol.substring(0, n.protocol.length - 1),
        username: n.username,
        password: n.password,
        hostname: n.hostname,
        port: n.port,
        pathname: n.pathname,
        search:
          "" != n.search ? n.search.substring(1, n.search.length) : void 0,
        hash: "" != n.hash ? n.hash.substring(1, n.hash.length) : void 0,
      };
    }
    function v(t, e, n) {
      let s;
      if ("string" == typeof e.baseURL)
        try {
          ((s = new URL(e.baseURL)),
            (t.protocol = s.protocol
              ? s.protocol.substring(0, s.protocol.length - 1)
              : ""),
            (t.username = s.username),
            (t.password = s.password),
            (t.hostname = s.hostname),
            (t.port = s.port),
            (t.pathname = s.pathname),
            (t.search = s.search ? s.search.substring(1, s.search.length) : ""),
            (t.hash = s.hash ? s.hash.substring(1, s.hash.length) : ""));
        } catch {
          throw new TypeError(`invalid baseURL '${e.baseURL}'.`);
        }
      if (
        ("string" == typeof e.protocol &&
          (t.protocol = (function (t, e) {
            var n;
            return (
              (t = (n = t).endsWith(":") ? n.substr(0, n.length - 1) : n),
              e || "" === t ? t : x(t)
            );
          })(e.protocol, n)),
        "string" == typeof e.username &&
          (t.username = (function (t, e) {
            if (e || "" === t) return t;
            const n = new URL("https://example.com");
            return ((n.username = t), n.username);
          })(e.username, n)),
        "string" == typeof e.password &&
          (t.password = (function (t, e) {
            if (e || "" === t) return t;
            const n = new URL("https://example.com");
            return ((n.password = t), n.password);
          })(e.password, n)),
        "string" == typeof e.hostname &&
          (t.hostname = (function (t, e) {
            return e || "" === t ? t : l(t) ? y(t) : k(t);
          })(e.hostname, n)),
        "string" == typeof e.port &&
          (t.port = (function (t, e, n) {
            return (g(e) === t && (t = ""), n || "" === t ? t : P(t));
          })(e.port, t.protocol, n)),
        "string" == typeof e.pathname)
      ) {
        if (
          ((t.pathname = e.pathname),
          s &&
            !(function (t, e) {
              return !(
                !t.length ||
                ("/" !== t[0] &&
                  (!e ||
                    t.length < 2 ||
                    ("\\" != t[0] && "{" != t[0]) ||
                    "/" != t[1]))
              );
            })(t.pathname, n))
        ) {
          const e = s.pathname.lastIndexOf("/");
          e >= 0 && (t.pathname = s.pathname.substring(0, e + 1) + t.pathname);
        }
        t.pathname = (function (t, e, n) {
          if (n || "" === t) return t;
          if (e && !m.includes(e)) return new URL(`${e}:${t}`).pathname;
          const s = "/" == t[0];
          return (
            (t = new URL(s ? t : "/-" + t, "https://example.com").pathname),
            s || (t = t.substring(2, t.length)),
            t
          );
        })(t.pathname, t.protocol, n);
      }
      return (
        "string" == typeof e.search &&
          (t.search = (function (t, e) {
            if (((t = f(t, "?")), e || "" === t)) return t;
            const n = new URL("https://example.com");
            return (
              (n.search = t),
              n.search ? n.search.substring(1, n.search.length) : ""
            );
          })(e.search, n)),
        "string" == typeof e.hash &&
          (t.hash = (function (t, e) {
            if (((t = f(t, "#")), e || "" === t)) return t;
            const n = new URL("https://example.com");
            return (
              (n.hash = t),
              n.hash ? n.hash.substring(1, n.hash.length) : ""
            );
          })(e.hash, n)),
        t
      );
    }
    function A(t) {
      return t.replace(/([+*?:{}()\\])/g, "\\$1");
    }
    function T(t, e) {
      const n = `[^${((s = e.delimiter || "/#?"), s.replace(/([.+*?^${}()[\]|/\\])/g, "\\$1"))}]+?`;
      var s;
      const r = /[$_\u200C\u200D\p{ID_Continue}]/u;
      let i = "";
      for (let s = 0; s < t.length; ++s) {
        const a = t[s],
          o = s > 0 ? t[s - 1] : null,
          h = s < t.length - 1 ? t[s + 1] : null;
        if ("string" == typeof a) {
          i += A(a);
          continue;
        }
        if ("" === a.pattern) {
          if ("" === a.modifier) {
            i += A(a.prefix);
            continue;
          }
          i += `{${A(a.prefix)}}${a.modifier}`;
          continue;
        }
        const p = "number" != typeof a.name,
          c = void 0 !== e.prefixes ? e.prefixes : "./";
        let u =
          "" !== a.suffix ||
          ("" !== a.prefix && (1 !== a.prefix.length || !c.includes(a.prefix)));
        if (
          !u &&
          p &&
          a.pattern === n &&
          "" === a.modifier &&
          h &&
          !h.prefix &&
          !h.suffix
        )
          if ("string" == typeof h) {
            const t = h.length > 0 ? h[0] : "";
            u = r.test(t);
          } else u = "number" == typeof h.name;
        if (
          !u &&
          "" === a.prefix &&
          o &&
          "string" == typeof o &&
          o.length > 0
        ) {
          const t = o[o.length - 1];
          u = c.includes(t);
        }
        (u && (i += "{"),
          (i += A(a.prefix)),
          p && (i += `:${a.name}`),
          ".*" === a.pattern
            ? p ||
              (o &&
                "string" != typeof o &&
                !o.modifier &&
                !u &&
                "" === a.prefix)
              ? (i += "(.*)")
              : (i += "*")
            : a.pattern === n
              ? p || (i += `(${n})`)
              : (i += `(${a.pattern})`),
          a.pattern === n &&
            p &&
            "" !== a.suffix &&
            r.test(a.suffix[0]) &&
            (i += "\\"),
          (i += A(a.suffix)),
          u && (i += "}"),
          (i += a.modifier));
      }
      return i;
    }
    var U = class {
      constructor(t = {}, e) {
        ((this.regexp = {}), (this.keys = {}), (this.component_pattern = {}));
        try {
          if ("string" == typeof t) {
            const n = new (class {
              constructor(t) {
                ((this.tokenList = []),
                  (this.internalResult = {}),
                  (this.tokenIndex = 0),
                  (this.tokenIncrement = 1),
                  (this.componentStart = 0),
                  (this.state = 0),
                  (this.groupDepth = 0),
                  (this.hostnameIPv6BracketDepth = 0),
                  (this.shouldTreatAsStandardURL = !1),
                  (this.input = t));
              }
              get result() {
                return this.internalResult;
              }
              parse() {
                for (
                  this.tokenList = s(this.input, !0);
                  this.tokenIndex < this.tokenList.length;
                  this.tokenIndex += this.tokenIncrement
                ) {
                  if (
                    ((this.tokenIncrement = 1),
                    "END" === this.tokenList[this.tokenIndex].type)
                  ) {
                    if (0 === this.state) {
                      (this.rewind(),
                        this.isHashPrefix()
                          ? this.changeState(9, 1)
                          : this.isSearchPrefix()
                            ? (this.changeState(8, 1),
                              (this.internalResult.hash = ""))
                            : (this.changeState(7, 0),
                              (this.internalResult.search = ""),
                              (this.internalResult.hash = "")));
                      continue;
                    }
                    if (2 === this.state) {
                      this.rewindAndSetState(5);
                      continue;
                    }
                    this.changeState(10, 0);
                    break;
                  }
                  if (this.groupDepth > 0) {
                    if (!this.isGroupClose()) continue;
                    this.groupDepth -= 1;
                  }
                  if (this.isGroupOpen()) this.groupDepth += 1;
                  else
                    switch (this.state) {
                      case 0:
                        this.isProtocolSuffix() &&
                          ((this.internalResult.username = ""),
                          (this.internalResult.password = ""),
                          (this.internalResult.hostname = ""),
                          (this.internalResult.port = ""),
                          (this.internalResult.pathname = ""),
                          (this.internalResult.search = ""),
                          (this.internalResult.hash = ""),
                          this.rewindAndSetState(1));
                        break;
                      case 1:
                        if (this.isProtocolSuffix()) {
                          this.computeShouldTreatAsStandardURL();
                          let t = 7,
                            e = 1;
                          (this.shouldTreatAsStandardURL &&
                            (this.internalResult.pathname = "/"),
                            this.nextIsAuthoritySlashes()
                              ? ((t = 2), (e = 3))
                              : this.shouldTreatAsStandardURL && (t = 2),
                            this.changeState(t, e));
                        }
                        break;
                      case 2:
                        this.isIdentityTerminator()
                          ? this.rewindAndSetState(3)
                          : (this.isPathnameStart() ||
                              this.isSearchPrefix() ||
                              this.isHashPrefix()) &&
                            this.rewindAndSetState(5);
                        break;
                      case 3:
                        this.isPasswordPrefix()
                          ? this.changeState(4, 1)
                          : this.isIdentityTerminator() &&
                            this.changeState(5, 1);
                        break;
                      case 4:
                        this.isIdentityTerminator() && this.changeState(5, 1);
                        break;
                      case 5:
                        (this.isIPv6Open()
                          ? (this.hostnameIPv6BracketDepth += 1)
                          : this.isIPv6Close() &&
                            (this.hostnameIPv6BracketDepth -= 1),
                          this.isPortPrefix() && !this.hostnameIPv6BracketDepth
                            ? this.changeState(6, 1)
                            : this.isPathnameStart()
                              ? this.changeState(7, 0)
                              : this.isSearchPrefix()
                                ? this.changeState(8, 1)
                                : this.isHashPrefix() &&
                                  this.changeState(9, 1));
                        break;
                      case 6:
                        this.isPathnameStart()
                          ? this.changeState(7, 0)
                          : this.isSearchPrefix()
                            ? this.changeState(8, 1)
                            : this.isHashPrefix() && this.changeState(9, 1);
                        break;
                      case 7:
                        this.isSearchPrefix()
                          ? this.changeState(8, 1)
                          : this.isHashPrefix() && this.changeState(9, 1);
                        break;
                      case 8:
                        this.isHashPrefix() && this.changeState(9, 1);
                    }
                }
              }
              changeState(t, e) {
                switch (this.state) {
                  case 0:
                  case 2:
                  case 10:
                    break;
                  case 1:
                    this.internalResult.protocol = this.makeComponentString();
                    break;
                  case 3:
                    this.internalResult.username = this.makeComponentString();
                    break;
                  case 4:
                    this.internalResult.password = this.makeComponentString();
                    break;
                  case 5:
                    this.internalResult.hostname = this.makeComponentString();
                    break;
                  case 6:
                    this.internalResult.port = this.makeComponentString();
                    break;
                  case 7:
                    this.internalResult.pathname = this.makeComponentString();
                    break;
                  case 8:
                    this.internalResult.search = this.makeComponentString();
                    break;
                  case 9:
                    this.internalResult.hash = this.makeComponentString();
                }
                this.changeStateWithoutSettingComponent(t, e);
              }
              changeStateWithoutSettingComponent(t, e) {
                ((this.state = t),
                  (this.componentStart = this.tokenIndex + e),
                  (this.tokenIndex += e),
                  (this.tokenIncrement = 0));
              }
              rewind() {
                ((this.tokenIndex = this.componentStart),
                  (this.tokenIncrement = 0));
              }
              rewindAndSetState(t) {
                (this.rewind(), (this.state = t));
              }
              safeToken(t) {
                return (
                  t < 0 && (t = this.tokenList.length - t),
                  t < this.tokenList.length
                    ? this.tokenList[t]
                    : this.tokenList[this.tokenList.length - 1]
                );
              }
              isNonSpecialPatternChar(t, e) {
                const n = this.safeToken(t);
                return (
                  n.value === e &&
                  ("CHAR" === n.type ||
                    "ESCAPED_CHAR" === n.type ||
                    "INVALID_CHAR" === n.type)
                );
              }
              isProtocolSuffix() {
                return this.isNonSpecialPatternChar(this.tokenIndex, ":");
              }
              nextIsAuthoritySlashes() {
                return (
                  this.isNonSpecialPatternChar(this.tokenIndex + 1, "/") &&
                  this.isNonSpecialPatternChar(this.tokenIndex + 2, "/")
                );
              }
              isIdentityTerminator() {
                return this.isNonSpecialPatternChar(this.tokenIndex, "@");
              }
              isPasswordPrefix() {
                return this.isNonSpecialPatternChar(this.tokenIndex, ":");
              }
              isPortPrefix() {
                return this.isNonSpecialPatternChar(this.tokenIndex, ":");
              }
              isPathnameStart() {
                return this.isNonSpecialPatternChar(this.tokenIndex, "/");
              }
              isSearchPrefix() {
                if (this.isNonSpecialPatternChar(this.tokenIndex, "?"))
                  return !0;
                if ("?" !== this.tokenList[this.tokenIndex].value) return !1;
                const t = this.safeToken(this.tokenIndex - 1);
                return (
                  "NAME" !== t.type &&
                  "PATTERN" !== t.type &&
                  "CLOSE" !== t.type &&
                  "ASTERISK" !== t.type
                );
              }
              isHashPrefix() {
                return this.isNonSpecialPatternChar(this.tokenIndex, "#");
              }
              isGroupOpen() {
                return "OPEN" == this.tokenList[this.tokenIndex].type;
              }
              isGroupClose() {
                return "CLOSE" == this.tokenList[this.tokenIndex].type;
              }
              isIPv6Open() {
                return this.isNonSpecialPatternChar(this.tokenIndex, "[");
              }
              isIPv6Close() {
                return this.isNonSpecialPatternChar(this.tokenIndex, "]");
              }
              makeComponentString() {
                const t = this.tokenList[this.tokenIndex],
                  e = this.safeToken(this.componentStart).index;
                return this.input.substring(e, t.index);
              }
              computeShouldTreatAsStandardURL() {
                const t = {};
                (Object.assign(t, p), (t.encodePart = x));
                const e = h(this.makeComponentString(), void 0, t);
                this.shouldTreatAsStandardURL = d(e);
              }
            })(t);
            if ((n.parse(), (t = n.result), e)) {
              if ("string" != typeof e)
                throw new TypeError(
                  "'baseURL' parameter is not of type 'string'.",
                );
              t.baseURL = e;
            } else if ("string" != typeof t.protocol)
              throw new TypeError(
                "A base URL must be provided for a relative constructor string.",
              );
          } else if (e)
            throw new TypeError("parameter 1 is not of type 'string'.");
          if (!t || "object" != typeof t)
            throw new TypeError(
              "parameter 1 is not of type 'string' and cannot convert to dictionary.",
            );
          const n = {
            pathname: E,
            protocol: E,
            username: E,
            password: E,
            hostname: E,
            port: E,
            search: E,
            hash: E,
          };
          let i;
          for (i of ((this.pattern = v(n, t, !0)),
          g(this.pattern.protocol) === this.pattern.port &&
            (this.pattern.port = ""),
          C)) {
            if (!(i in this.pattern)) continue;
            const t = {},
              e = this.pattern[i];
            switch (((this.keys[i] = []), i)) {
              case "protocol":
                (Object.assign(t, p), (t.encodePart = x));
                break;
              case "username":
                (Object.assign(t, p), (t.encodePart = S));
                break;
              case "password":
                (Object.assign(t, p), (t.encodePart = w));
                break;
              case "hostname":
                (Object.assign(t, c),
                  l(e) ? (t.encodePart = y) : (t.encodePart = k));
                break;
              case "port":
                (Object.assign(t, p), (t.encodePart = P));
                break;
              case "pathname":
                d(this.regexp.protocol)
                  ? (Object.assign(t, u), (t.encodePart = R))
                  : (Object.assign(t, p), (t.encodePart = b));
                break;
              case "search":
                (Object.assign(t, p), (t.encodePart = $));
                break;
              case "hash":
                (Object.assign(t, p), (t.encodePart = I));
            }
            try {
              const n = r(e, t);
              ((this.regexp[i] = o(n, this.keys[i], t)),
                (this.component_pattern[i] = T(n, t)));
            } catch {
              throw new TypeError(`invalid ${i} pattern '${this.pattern[i]}'.`);
            }
          }
        } catch (t) {
          throw new TypeError(`Failed to construct 'URLPattern': ${t.message}`);
        }
      }
      test(t = {}, e) {
        let n,
          s = {
            pathname: "",
            protocol: "",
            username: "",
            password: "",
            hostname: "",
            port: "",
            search: "",
            hash: "",
          };
        if ("string" != typeof t && e)
          throw new TypeError("parameter 1 is not of type 'string'.");
        if (void 0 === t) return !1;
        try {
          s = v(s, "object" == typeof t ? t : L(t, e), !1);
        } catch (t) {
          return !1;
        }
        for (n in this.pattern) if (!this.regexp[n].exec(s[n])) return !1;
        return !0;
      }
      exec(t = {}, e) {
        let n = {
          pathname: "",
          protocol: "",
          username: "",
          password: "",
          hostname: "",
          port: "",
          search: "",
          hash: "",
        };
        if ("string" != typeof t && e)
          throw new TypeError("parameter 1 is not of type 'string'.");
        if (void 0 === t) return;
        try {
          n = v(n, "object" == typeof t ? t : L(t, e), !1);
        } catch (t) {
          return null;
        }
        let s,
          r = {};
        for (s in ((r.inputs = e ? [t, e] : [t]), this.pattern)) {
          let t = this.regexp[s].exec(n[s]);
          if (!t) return null;
          let e = {};
          for (let [n, r] of this.keys[s].entries())
            if ("string" == typeof r.name || "number" == typeof r.name) {
              let s = t[n + 1];
              e[r.name] = s;
            }
          r[s] = { input: n[s] || "", groups: e };
        }
        return r;
      }
      get protocol() {
        return this.component_pattern.protocol;
      }
      get username() {
        return this.component_pattern.username;
      }
      get password() {
        return this.component_pattern.password;
      }
      get hostname() {
        return this.component_pattern.hostname;
      }
      get port() {
        return this.component_pattern.port;
      }
      get pathname() {
        return this.component_pattern.pathname;
      }
      get search() {
        return this.component_pattern.search;
      }
      get hash() {
        return this.component_pattern.hash;
      }
    };
    (globalThis.URLPattern || (globalThis.URLPattern = U),
      (window.URLPattern = U));
  })());
{
  var iGLUI;
  Class(function AppState(_default) {
    ((this.map = new Map()),
      (this.bindings = new Map()),
      _default && this.setAll(_default));
    const prototype = AppState.prototype;
    void 0 === prototype.set &&
      ((prototype.set = function (key, value, force) {
        if (this.readonly)
          return console.warn(
            "This AppState is locked and can not make changes",
          );
        (this.map.set(key, value), this.onUpdate && this.onUpdate(key, value));
        let array = this.bindings.get(key);
        if (array) {
          let len = array.length;
          for (let i = 0; i < len; i++) {
            let b = array[i];
            b && b.update
              ? b.update(key, value, force)
              : (array.splice(i, 1), (i -= 1), (len = array.length));
          }
        }
      }),
      (prototype.get = function (key) {
        return this.map.get(key);
      }),
      (prototype.getMap = function () {
        return this.map;
      }),
      (prototype.toJSON = function () {
        return Object.fromEntries(this.map);
      }),
      (prototype.bind = function (keys, ...rest) {
        const _this = this;
        if (!rest.length) return { state: _this, key: keys };
        Array.isArray(keys) || (keys = [keys]);
        const obj = 1 === rest.length ? rest[0] : rest;
        let binding = new StateBinding(keys, obj, this);
        return (
          keys.forEach((key) => {
            _this.bindings.has(key)
              ? _this.bindings.get(key).push(binding)
              : _this.bindings.set(key, [binding]);
            let value = _this.map.get(key);
            void 0 !== value && binding.update(key, value);
          }),
          binding
        );
      }),
      (prototype.createLocal = function (obj, fixProps) {
        if (fixProps)
          for (let key in obj) {
            let val = obj[key];
            ("true" === val && (obj[key] = !0),
              "false" === val && (obj[key] = !1),
              isNaN(val) || (obj[key] = Number(val)));
          }
        let appState = new AppState(obj);
        return new Proxy(appState, {
          set: (target, property = "", value) => (
            property.includes(["origin", "onUpdate"])
              ? (appState[property] = value)
              : appState.set(property, value),
            !0
          ),
          get: (target, property) =>
            target[property] ? target[property] : appState.get(property),
        });
      }),
      (prototype.setAll = function (obj) {
        const _this = this;
        for (let key in obj) _this.set(key, obj[key]);
      }),
      (prototype.lock = function () {
        this.readonly = !0;
      }),
      (prototype.unlock = function () {
        this.readonly = !1;
      }),
      (prototype.clearKeysMatching = function (str) {
        let keys = this.map.keys();
        for (let key of keys) key.startsWith(str) && this.map.delete(key);
      }),
      (prototype.isAppState = !0));
  }, "static");
  class StateBinding {
    constructor(_keys, _obj, _ref) {
      if (
        ((this._keys = _keys),
        (this._obj = _obj),
        (this._string = ""),
        (this._oldValue = ""),
        (this._type = ""),
        (this._bindingLookup = ""),
        this._onDestroy,
        (this._ref = _ref),
        void 0 === iGLUI && (iGLUI = !!window.GLUI),
        _obj instanceof HTMLElement)
      )
        ("INPUT" == _obj.nodeName
          ? (this._string = _obj.value)
          : (this._string = _obj.innerText),
          (this._type = "HTMLElement"));
      else if (_obj instanceof DOMAttribute)
        ((this._string = _obj.value),
          (this._name = _obj.name),
          (this._belongsTo = _obj.belongsTo),
          (this._bindingLookup = _obj.bindingLookup),
          (this._type = "DOMAttribute"));
      else if ("function" == typeof Sprite && _obj instanceof Sprite)
        ((this._string = _obj.id), (this._type = "Sprite"));
      else if (_obj instanceof HydraObject)
        ("input" == _obj._type
          ? (this._string = _obj.val())
          : (this._string = _obj.text()),
          (this._type = "HydraObject"));
      else if (iGLUI && _obj instanceof GLUIText)
        ((this._string = _obj.getTextString()), (this._type = "GLUIText"));
      else if (
        (_obj.createLocal && (this._type = "appState"),
        _obj.onStateChange && (this._type = "class"),
        "function" == typeof _obj && (this._type = "function"),
        Array.isArray(_obj) && _obj.every((el) => "function" == typeof el))
      ) {
        this._type = "piped";
        const lastFunctionInChain = this._obj.pop();
        ((this._operators = this._obj),
          (this._obj = lastFunctionInChain),
          (this._count = 0));
      }
    }
    parse(key, value) {
      if (!this._string || !this._string.includes("@[")) return value;
      const _this = this;
      let string = this._string;
      return (
        this._keys.forEach((key) => {
          string = string.replace(`@[${key}]`, _this._ref.get(key));
        }),
        string
      );
    }
    async operateOnValue(value) {
      return await this._operators.reduce(async (prev, fn) => {
        const prevResolved = await prev;
        return (await fn)(prevResolved, this._count++, this);
      }, value);
    }
    update(key, value, force) {
      let newValue = this.parse(key, value);
      if (!(newValue !== this._oldValue || (value && value.push) || force))
        return;
      let oldValue = this._oldValue;
      this._oldValue = newValue;
      try {
        switch (this._type) {
          case "HTMLElement":
            "input" == this._obj._type
              ? (this._obj.value = newValue)
              : (this._obj.innerText = newValue);
            break;
          case "DOMAttribute":
            this._obj.belongsTo.setAttribute(
              this._obj.name,
              this._obj.value.replace(this._obj.bindingLookup, newValue),
            );
            break;
          case "Sprite":
            this._obj.id = newValue;
            break;
          case "HydraObject":
            "input" == this._obj._type
              ? this._obj.val(newValue)
              : this._obj.text(newValue);
            break;
          case "GLUIText":
            this._obj.setText(newValue);
            break;
          case "function":
            this._obj(value, oldValue);
            break;
          case "piped":
            this.operateOnValue(value).then(
              (val) => this._obj(val),
              (reject) => null,
            );
            break;
          case "class":
            this._obj.onStateChange(value);
            break;
          case "appState":
            this._obj.set(key, value);
        }
      } catch (err) {
        throw (
          console.error(
            "AppState binding failed to execute. You should probably be using _this.bindState instead",
          ),
          console.error(err),
          err
        );
      }
      return !0;
    }
    _bindOnDestroy(cb) {
      (this._onDestroy || (this._onDestroy = []), this._onDestroy.push(cb));
    }
    destroy() {
      (this._onDestroy && this._onDestroy.forEach((cb) => cb()),
        this._keys.forEach((key) => {
          let array = this._ref.bindings.get(key);
          if (array)
            for (let i = 0; i < array.length; i++) {
              array[i] === this && (array.splice(i, 1), (i -= 1));
            }
        }),
        Utils.nullObject(this));
    }
  }
  window.StateBinding = StateBinding;
}
(Class(function AppStateOperators(_default) {
  (Inherit(this, Component),
    (this.map = (fn) => (value) => fn(value)),
    (this.tap = (fn) => (value) => (fn(value), value)),
    (this.filter = (fn) => (value, emittedCount) =>
      fn(value, emittedCount) ? value : Promise.reject()),
    (this.skip = (skipCount) =>
      this.filter((_, emittedCount) => skipCount <= emittedCount)),
    (this.untilDestroyed = (ctx) => {
      let checked = !1;
      return (value, _, binding) => (
        checked ||
          ((checked = !0),
          ctx._bindOnDestroy((_) => {
            (Hydra.LOCAL && console.log("binding destroyed "),
              binding.destroy?.());
          })),
        value
      );
    }));
}, "static"),
  Class(function AppStore() {
    const _this = this;
    this.state = AppState.createLocal();
    const _mutations = {},
      _actions = {};
    let _subscribers = [],
      _actionSubscribers = [];
    function registerMutation(type, handler) {
      (_mutations[type] || (_mutations[type] = [])).push(
        function wrappedMutationHandler(payload) {
          handler.call(_this, _this.state, payload);
        },
      );
    }
    function registerAction(type, handler) {
      (_actions[type] || (_actions[type] = [])).push(
        function wrappedActionHandler(payload) {
          let res = handler.call(
            _this,
            {
              dispatch: _this.dispatch,
              commit: _this.commit,
              state: _this.state,
              rootState: _this.state,
            },
            payload,
          );
          return (
            (function isPromise(val) {
              return val && "function" == typeof val.then;
            })(res) || (res = Promise.resolve(res)),
            res
          );
        },
      );
    }
    function genericSubscribe(fn, subscribers, options) {
      return (
        subscribers.indexOf(fn) < 0 &&
          (options && options.prepend
            ? subscribers.unshift(fn)
            : subscribers.push(fn)),
        () => {
          const i = subscribers.indexOf(fn);
          i > -1 && subscribers.splice(i, 1);
        }
      );
    }
    ((this.createAppStore = function (_params) {
      (!(function setInitState(_params) {
        const { state: state } = _params;
        for (let key in state) _this.state.set(key, state[key]);
      })(_params),
        (function mapMutations(_params) {
          const { mutations: mutations } = _params;
          for (let key in mutations) registerMutation(key, mutations[key]);
        })(_params),
        (function mapActions(_params) {
          const { actions: actions } = _params;
          for (let key in actions) registerAction(key, actions[key]);
        })(_params));
    }),
      (this.commit = function (type, payload) {
        const mutation = { type: type, payload: payload },
          entry = _mutations[type];
        entry
          ? (entry.forEach(function commitIterator(handler) {
              handler(payload);
            }),
            _subscribers.slice().forEach((sub) => sub(mutation, this.state)))
          : Hydra.LOCAL && console.error(`Error: no mutation for type ${type}`);
      }),
      (this.dispatch = function (type, payload) {
        const action = { type: type, payload: payload },
          entry = _actions[type];
        entry ||
          (Hydra.LOCAL && console.error(`Error: no action for type ${type}`));
        try {
          _actionSubscribers
            .slice()
            .filter((sub) => sub.before)
            .forEach((sub) => sub.before(action, _this.state));
        } catch (e) {
          Hydra.LOCAL &&
            (console.warn("Error in before action subscribers: "),
            console.error(e));
        }
        const result =
          entry.length > 1
            ? Promise.all(entry.map((handler) => handler(payload)))
            : entry[0](payload);
        return new Promise((resolve, reject) => {
          result.then(
            (res) => {
              try {
                _actionSubscribers
                  .filter((sub) => sub.after)
                  .forEach((sub) => sub.after(action, _this.state));
              } catch (e) {
                Hydra.LOCAL &&
                  (console.warn("Error in after action subscribers: "),
                  console.error(e));
              }
              resolve(res);
            },
            (error) => {
              try {
                _actionSubscribers
                  .filter((sub) => sub.error)
                  .forEach((sub) => sub.error(action, _this.state, error));
              } catch (e) {
                Hydra.LOCAL &&
                  (console.warn("Error in error action subscribers: "),
                  console.error(e));
              }
              reject(error);
            },
          );
        });
      }),
      (this.subscribeAction = function (key, fn, options) {
        let subs = {};
        return (
          "function" == typeof fn
            ? (subs.before = function subscriberEmptyBeforeWrapper(action) {
                action.type === key && fn(action);
              })
            : (fn.before &&
                (subs.before = function subscriberBeforeWrapper(action) {
                  action.type === key && fn.before(action);
                }),
              fn.after &&
                (subs.after = function subscriberAfterWrapper(action) {
                  action.type === key && fn.after(action);
                })),
          genericSubscribe(subs, _actionSubscribers, options)
        );
      }),
      (this.subscribe = function (key, fn, options) {
        return genericSubscribe(
          function subscriberWrapper(mutation) {
            mutation.type === key && fn(mutation);
          },
          _subscribers,
          options,
        );
      }),
      (this.bind = this.state.bind),
      (this.map = this.state.map),
      (this.bindings = this.state.bindings),
      (this.watch = this.state.bind),
      (this.get = this.state.get));
  }),
  Class(
    function StateArray(_src = [], _filterFn = null) {
      Inherit(this, Events);
      const _this = this;
      var _data = [];
      function wrap(obj) {
        if ("object" != typeof obj || Array.isArray(obj))
          throw "StateArray entries must be {objects}!";
        if ((obj._uid || (obj._uid = Utils.uuid()), obj.createLocal))
          return obj;
        let state = AppState.createLocal(obj);
        return ((state.origin = obj), state);
      }
      if (
        (Object.defineProperty(_this, "length", {
          get: function () {
            return _data.length;
          },
        }),
        (this.setFilter = function (fn, refresh = !0) {
          ((_filterFn = fn), refresh && this.refresh(_data.filter(fn)));
        }),
        (this.push = function (obj) {
          if (_filterFn && !_filterFn(obj)) return;
          let state = wrap(obj);
          return (
            _data.push(state),
            (function setInterfaceAtIndex(index) {
              void 0 === _this[index] &&
                Object.defineProperty(_this, index, {
                  set: function (v) {
                    for (let key in v) _data[index].set(key, v[key]);
                  },
                  get: function () {
                    return _data[index];
                  },
                });
            })(_data.length - 1),
            _this.events.fire(Events.UPDATE, { type: "add", state: state }),
            state
          );
        }),
        (this.remove = function (obj) {
          for (let i = 0; i < _data.length; i++) {
            let state = _data[i];
            (state.origin !== obj && state !== obj) ||
              (_data.splice(i, 1),
              _this.events.fire(
                Events.UPDATE,
                { type: "remove", state: state },
                !0,
              ));
          }
        }),
        (this.update = async function (obj) {
          var _found = !1;
          for (let i = 0; i < _data.length; i++) {
            var state = _data[i];
            if (state.origin._uid === obj._uid || state._uid === obj._uid)
              return (
                await state.setAll(obj),
                _this.events.fire(Events.UPDATE, {
                  type: "modify",
                  state: state,
                  index: i,
                }),
                (_found = !0)
              );
          }
          return _found;
        }),
        (this.forEach = function (cb) {
          _data.forEach(function (...args) {
            return cb.apply(this, args);
          });
        }),
        (this.find = function (cb) {
          return _data.find(function (...args) {
            return cb.apply(this, args);
          });
        }),
        (this.insertAtIdx = function (idx, obj) {
          if ((obj._uid || (obj = wrap(obj)), !_data[Math.abs(idx)]))
            throw "There is no item at index " + idx + " in this StateArray";
          _data.splice(idx, 0, obj);
          const newData = _data.filter(() => !0);
          this.refresh(newData);
        }),
        (this.map = function (cb) {
          let array = [];
          return (
            _data.forEach(function (...args) {
              return array.push(cb.apply(this, args));
            }),
            array
          );
        }),
        (this.find = function (cb) {
          return _data.find(function (...args) {
            return cb.apply(this, args);
          });
        }),
        (this.toJSON = function () {
          let array = [];
          return (
            _data.forEach((appState) => {
              array.push(appState.toJSON());
            }),
            array
          );
        }),
        (this.getMap = function () {
          let array = [];
          return (
            _data.forEach((appState) => {
              array.push(appState.getMap());
            }),
            array
          );
        }),
        (this.indexOf = function (obj) {
          for (let i = 0; i < _data.length; i++) {
            let state = _data[i];
            if (state.origin === obj || state === obj) return i;
          }
        }),
        (this.refresh = function (array) {
          (Array.isArray(array) ||
            array instanceof StateArray ||
            (array = [array]),
            _this.events.fire(StateArray.REFRESH, { type: "refresh" }, !0));
          let i = _data.length;
          for (; i--; ) {
            let state = _data.pop();
            _this.events.fire(
              Events.UPDATE,
              { type: "remove", state: state },
              !0,
            );
          }
          ((_data.length = 0), array.forEach(_this.push));
        }),
        (this.sort = function (cb) {
          let array = [];
          (_data.forEach((d) => array.push(d)),
            array.sort(cb),
            _this.refresh(array));
        }),
        (this.includes = function (obj) {
          return this.indexOf(obj) > -1;
        }),
        (this.reflow = function () {
          this.refresh(_data.map((d) => d.origin));
        }),
        !Array.isArray(_src))
      )
        throw "StateArray can only take an array as a parameter";
      _src.forEach(_this.push);
    },
    (_) => {
      StateArray.REFRESH = "state_array_refresh";
    },
  ),
  Class(
    function ViewState(ViewClass, ...rest) {
      Inherit(this, Component);
      const _this = this;
      var _stateArray,
        _params,
        _dynamicViewClass,
        _callbacks = {},
        _bindings = [],
        _removals = [];
      ("object" == typeof ViewClass &&
        ViewClass.view &&
        ((ViewClass = (_params = ViewClass).view),
        (rest = [_params]),
        delete _params.view,
        (_this.listen = function (key, callback) {
          (_bindings.push(key), (_callbacks[key] = callback));
        }),
        (_this.onAddView = _params.onAddView),
        (_this.onRemoveView = _params.onRemoveView)),
        "function" == typeof ViewClass &&
          _this.parent.contexts &&
          (_dynamicViewClass = !0),
        "string" == typeof ViewClass && (ViewClass = window[ViewClass]));
      var _instances = (this.views = []);
      function remove(data) {
        _this.animating = !0;
        for (let i = 0; i < _instances.length; i++) {
          let inst = _instances[i];
          if (data == inst.data) {
            let promise =
              _this.onRemoveView?.(inst, i) || inst.onRemoveView?.(i);
            (promise &&
              promise.then &&
              (_removals.push(promise),
              _this.disableAutoDestroy ||
                promise.then((_) => inst.destroy?.())),
              _instances.splice(i, 1),
              0 === _instances.length && _this.onEmpty?.(),
              (promise && promise.then) ||
                _this.disableAutoDestroy ||
                !inst.destroy ||
                inst.destroy());
            break;
          }
        }
        if ((ViewState.clearScheduled(data, _this), _removals.length)) {
          let removals = _removals.slice();
          Promise.all(removals).then((_) => {
            (removals.forEach((removal) => {
              _removals.remove(removal);
            }),
              0 === _removals.length && (_this.animating = !1));
          });
        }
      }
      async function dataUpdate(e) {
        switch (e.type) {
          case "add":
            for (; _removals.length; ) await Promise.all(_removals);
            _this.dataFilter(e.state) &&
              ViewState.schedule(
                _this,
                _dynamicViewClass ? ViewClass(e.state) : ViewClass,
                e.state,
                _stateArray.indexOf(e.state),
                rest,
              );
            break;
          case "remove":
            remove(e.state);
            break;
          case "modify":
            _this.dataFilter(e.state)
              ? (function update(data, index) {
                  var _exists = !1;
                  for (let i = 0; i < _instances.length; i++) {
                    let inst = _instances[i];
                    if (data._uid === inst.data._uid)
                      return (
                        _this.onUpdateView?.(_instances[i], i),
                        void (_exists = !0)
                      );
                  }
                  _exists ||
                    ViewState.schedule(
                      _this,
                      _dynamicViewClass ? ViewClass(data) : ViewClass,
                      data,
                      _stateArray.indexOf(data),
                    );
                })(e.state, e.index)
              : remove(e.state);
        }
      }
      ((this.hmr = function (view) {
        for (ViewClass = window[view]; _instances.length; )
          remove(_instances[0].data);
        this.setSourceData(_stateArray);
      }),
        (this.setSourceData = function (array) {
          if (
            (!Array.isArray(array) ||
              array instanceof StateArray ||
              (array = new StateArray(array)),
            !(array instanceof StateArray || Array.isArray(array)))
          )
            throw "ViewState::setSourceData must be instance of StateArray";
          ((_stateArray = _this.stateArray = array),
            _this.events.sub(array, Events.UPDATE, dataUpdate),
            array.forEach((state) => {
              _this.dataFilter(state) &&
                ViewState.schedule(
                  _this,
                  _dynamicViewClass ? ViewClass(state) : ViewClass,
                  state,
                  _stateArray.indexOf(state),
                  rest,
                );
            }));
        }),
        (this.dataFilter = function (data) {
          return !0;
        }),
        (this.onInitialize = function (instance) {
          let unfilteredIndex = _stateArray.indexOf(instance.data),
            filteredIndex = -1;
          for (let i = 0; i < _instances.length; ++i) {
            let data = _instances[i].data;
            if (_stateArray.indexOf(data) > unfilteredIndex) {
              filteredIndex = i;
              break;
            }
          }
          if (
            (filteredIndex < 0 && (filteredIndex = _instances.length),
            instance.element &&
              _this.parent.element &&
              _this.parent.element.add)
          ) {
            let before = null;
            (filteredIndex < _instances.length &&
              _instances[filteredIndex].element &&
              (before = _instances[filteredIndex]),
              _this.parent.element.add(instance.element, before));
          }
          (_instances.splice(filteredIndex, 0, instance),
            _this.listen &&
              instance.state &&
              _bindings.forEach((key) => {
                _this.bindState(instance.state, key, (data) => {
                  _callbacks[key]?.({ target: instance, data: data });
                });
              }),
            _params?.__parent && _params.__parent.add(instance),
            (instance.group || instance.mesh) &&
              _this.parent.group?.add(instance.group || instance.mesh),
            _this.onAddView?.(instance, filteredIndex));
        }),
        _params?.data && this.setSourceData(_params.data),
        _params?.wait_data &&
          _params.wait_data.then((data) => {
            ((_params.data = data), _this.setSourceData(data));
          }));
    },
    (_) => {
      const queue = [],
        worker = new Render.Worker((_) => {
          let obj = queue.shift();
          if (obj) {
            let {
              ref: ref,
              ViewClass: ViewClass,
              data: data,
              index: index,
              additionalArgs: additionalArgs,
            } = obj;
            if (!ref.initClass) return;
            let args = [];
            additionalArgs.forEach((arg) => {
              args.push(...arg);
            });
            let inst = ref.initClass(ViewClass, data, index, ...args, null);
            ((inst.data = data), ref.onInitialize(inst));
          } else worker.pause();
        }, 2);
      (worker.pause(),
        (ViewState.clearScheduled = function (data, ref) {
          for (let i = 0; i < queue.length; i++) {
            let obj = queue[i];
            if (obj.data === data && obj.ref == ref) return queue.splice(i, 1);
          }
        }),
        (ViewState.schedule = function (ref, ViewClass, data, index, ...rest) {
          ref.initClass &&
            (queue.push({
              ref: ref,
              ViewClass: ViewClass,
              data: data,
              index: index,
              additionalArgs: rest,
            }),
            worker.resume());
        }));
    },
  ),
  Class(function ViewStateElement() {
    this.viewStateElement = !0;
  }),
  Class(function StateComponent() {
    const _this = this;
    let _mutationsUnsubscribers = [],
      _actionsUnsubscribers = [];
    ((this.unsubscribeMutations = function () {
      _mutationsUnsubscribers.forEach((u) => u());
    }),
      (this.unsubscribeActions = function () {
        _actionsUnsubscribers.forEach((u) => u());
      }),
      (this.unsubscribeAll = function () {
        (_this.unsubscribeMutations(), _this.unsubscribeActions());
      }),
      (this.subscribeMutation = function (store, type, fn) {
        _mutationsUnsubscribers.push(store.subscribe(type, fn));
      }),
      (this.subscribeAction = function (store, type, fn) {
        _actionsUnsubscribers.push(store.subscribeAction(type, fn));
      }),
      (this.commit = function (store, type, payload) {
        store.commit(type, payload);
      }),
      (this.dispatch = async function (store, type, payload) {
        await store.dispatch(type, payload);
      }),
      (this.getState = function (store, key) {
        return store.get(key);
      }),
      (this.watch = function (store, key, fn, callInitial = !0) {
        let hasCalled = !1;
        const callback = (params) => {
          hasCalled || callInitial ? fn(params) : (hasCalled = !0);
        };
        return _this.bindState
          ? _this.bindState(store, key, callback)
          : store.watch(key, callback);
      }),
      (this.bind = this.watch),
      "function" == typeof this._bindOnDestroy &&
        this._bindOnDestroy(() => {
          _this.unsubscribeAll();
        }));
  }),
  Class(function Dev() {
    const _this = this;
    let _inter, _timerName;
    function handleRenderCallbackError(info) {
      if (window.RemoteLogger)
        return void Events.emitter._removeEvent(
          Render.RENDER_CALLBACK_ERROR,
          handleRenderCallbackError,
        );
      let { callback: callback, error: error } = info;
      console.error("Error in render callback", callback, error);
    }
    (Events.emitter._addEvent(
      Render.RENDER_CALLBACK_ERROR,
      handleRenderCallbackError,
    ),
      (this.emulator =
        Device.mobile &&
        navigator.platform &&
        navigator.platform.toLowerCase().includes(["mac", "windows"])),
      (this.expose = function (name, val, force) {
        (Hydra.LOCAL || force) && (window[name] = val);
      }),
      (this.unsupported = function (needsAlert) {
        needsAlert &&
          alert(
            "Hi! This build is not yet ready for this device, things may not work as expected. Refer to build schedule for when this device will be supported.",
          );
      }),
      (this.checkForLeaks = function (flag, array) {
        if (window.AURA) return;
        let exceptions = [
          "_ga",
          "_typeface_js",
          "_xdc_",
          "_babelPolyfill",
          "$jscomp",
          "_sentryDebugIds",
          "_injected",
        ];
        window.HYDRA_LEAKS_EXCEPTIONS &&
          (exceptions = exceptions.concat(window.HYDRA_LEAKS_EXCEPTIONS));
        var matchArray = function (prop) {
          if (!array) return !1;
          for (var i = 0; i < array.length; i++)
            if (prop.includes(array[i])) return !0;
          return !1;
        };
        (clearInterval(_inter),
          flag &&
            (_inter = setInterval(function () {
              for (var prop in window)
                if (!prop.includes("webkit")) {
                  var obj;
                  try {
                    obj = window[prop];
                  } catch (e) {}
                  if (obj && "function" != typeof obj && prop.length > 2) {
                    if (prop.includes(exceptions) || matchArray(prop)) continue;
                    var char1 = prop.charAt(0),
                      char2 = prop.charAt(1);
                    if (
                      ("_" == char1 || "$" == char1) &&
                      char2 !== char2.toUpperCase()
                    )
                      throw (
                        console.log(window[prop]),
                        "Hydra Warning:: " + prop + " leaking into global scope"
                      );
                  }
                }
            }, 1e3)));
      }),
      (this.startTimer = function (name) {
        ((_timerName = name || "Timer"),
          console.time && !window._NODE_
            ? console.time(_timerName)
            : (_timer = performance.now()));
      }),
      (this.stopTimer = function () {
        console.time && !window._NODE_
          ? console.timeEnd(_timerName)
          : console.log(
              "Render " + _timerName + ": " + (performance.now() - _timer),
            );
      }),
      (this.writeFile = function (file, data) {
        let promise = Promise.create(),
          protocol = location.protocol,
          port = "https:" === protocol ? ":8018" : ":8017",
          url =
            protocol +
            "//" +
            location.hostname +
            port +
            (_this.filesPath || location.pathname) +
            file;
        return (
          post(url, data, { headers: { "content-type": "text/plain" } }).then(
            (e) => {
              "OK" != e
                ? (console.warn(`Unable to write to ${file}`), promise.reject())
                : promise.resolve();
            },
          ),
          promise
        );
      }),
      (this.execUILScript = async function (name, data) {
        if (!Hydra.LOCAL) return;
        let url = `${location.protocol}//${location.hostname}:8017${_this.pathName || location.pathname}/uil/${name}`,
          response = await post(url, data, {
            headers: { "Content-Type": "text/plain" },
          });
        if ("ERROR" === response || !1 === response.success) throw response;
        return response;
      }),
      (this.auditCompressedTextures = function () {
        let compressedKeys = [],
          changes = 0;
        (UILStorage.getKeys().forEach((key) => {
          let element = UILStorage.get(key);
          if ("string" == typeof element) {
            let json;
            try {
              ((json = JSON.parse(element)),
                json.src &&
                  (!0 === json.compressed
                    ? console.warn(
                        `The texture ${json.src} is a ktx1 asset. Please convert it to ktx2.`,
                      )
                    : "ktx2" === json.compressed &&
                      compressedKeys.push({
                        key: key,
                        src: json.src.split("?")[0],
                      })));
            } catch (e) {}
          }
        }),
          UILStorage.getKeys().forEach((key) => {
            let element = UILStorage.get(key);
            if ("string" == typeof element) {
              let json;
              try {
                ((json = JSON.parse(element)),
                  json.src &&
                    compressedKeys.find(
                      (el) => json.src.split("?")[0] === el.src.split("?")[0],
                    ) &&
                    "ktx2" !== json.compressed &&
                    (changes++,
                    console.log(
                      `Changed ${json.src.split("?")[0]} in ${key} to use ktx2 compression.`,
                    ),
                    UILStorage.set(
                      key,
                      JSON.stringify({
                        ...json,
                        src: json.src.split("?")[0],
                        compressed: "ktx2",
                      }),
                    ),
                    _this.events.fire(UILControlImage.AUDIT)));
              } catch (e) {}
            }
          }),
          changes
            ? console.warn(
                "Changes to UIL from auditCompressedTextures will not be saved until saving UIL and refreshing. Use Cmd+S or Ctrl+S to save and refresh any open SceneLayouts.",
              )
            : console.log(
                "auditCompressedTextures did not find any textures that had instances using both uncompressed and compressed versions.",
              ));
      }),
      Hydra.LOCAL && _this.checkForLeaks(!0));
  }, "static"),
  Class(function Service() {
    Inherit(this, Component);
    var _sw,
      _this = this;
    function getSWAssets() {
      if (!window.ASSETS.SW || _this.cached) return [];
      var assets = window.ASSETS.SW;
      return (
        assets.forEach((asset, i) => {
          asset.includes(".js") &&
            (asset = assets[i].replace(".js", ".js?" + window._CACHE_));
        }),
        assets
      );
    }
    function handleRegistration(e) {}
    function handleReady(e) {
      ((_this.isReady = !0),
        _this.events.fire(Events.READY, e, !0),
        (_sw = navigator.serviceWorker.controller),
        (function checkCache() {
          Storage.get("service_cache") != window._CACHE_ &&
            _this.post("clearCache");
        })());
    }
    function handleError(e) {
      e && (_this.events.fire(Events.ERROR, e, !0), (_this.active = !1));
    }
    function handleMessage(e) {
      var data = e.data;
      data.evt && _this.events.fire(data.evt, data);
    }
    ((this.active = !1),
      (this.ready = !1),
      (this.cached = !1),
      (this.offline = !1),
      (this.disabled = !1),
      (this.ready = function () {
        return this.wait(this, "isReady");
      }),
      (this.init = function () {
        Hydra.ready(() => {
          !("serviceWorker" in navigator) ||
            (Hydra.LOCAL && "" == location.port) ||
            window.process ||
            _this.disabled ||
            (function initWorker() {
              ((_this.active = !0),
                navigator.serviceWorker
                  .register(`${window._SW_PATH_ ? window._SW_PATH_ : ""}sw.js`)
                  .then(handleRegistration)
                  .then(handleReady)
                  .then(handleError));
            })();
        });
      }),
      (this.cache = function (assets = []) {
        assets = Array.from(assets);
        _this.active &&
          _this.wait(_this, "ready", function () {
            (_this.post("upload", {
              assets: assets,
              cdn: Assets.CDN,
              hostname: location.hostname,
              sw: getSWAssets(),
              offline: _this.offline,
            }),
              Storage.set("service_cache", window._CACHE_),
              (_this.cached = !0));
          });
      }),
      (this.post = function (fn, data = {}) {
        if (!_this.active) return;
        _this.wait(_this, "ready", function () {
          let mc = new MessageChannel();
          ((mc.port1.onmessage = handleMessage),
            (data.fn = fn),
            _sw && _sw.postMessage(data, [mc.port2]));
        });
      }));
  }, "static"),
  Class(function Storage() {
    var _storage,
      _this = this,
      _sessionData = {};
    function cookie(key, value, expires) {
      var options;
      if (
        arguments.length > 1 &&
        (null === value || "object" != typeof value)
      ) {
        if (
          (((options = {}).path = "/"),
          (options.expires = expires || 1),
          null === value && (options.expires = -1),
          "number" == typeof options.expires)
        ) {
          var days = options.expires,
            t = (options.expires = new Date());
          t.setDate(t.getDate() + days);
        }
        return (document.cookie = [
          encodeURIComponent(key),
          "=",
          options.raw ? String(value) : encodeURIComponent(String(value)),
          options.expires ? "; expires=" + options.expires.toUTCString() : "",
          options.path ? "; path=" + options.path : "",
          options.domain ? "; domain=" + options.domain : "",
          options.secure ? "; secure" : "",
        ].join(""));
      }
      var result,
        decode = (options = value || {}).raw
          ? function (s) {
              return s;
            }
          : decodeURIComponent;
      return (result = new RegExp(
        "(?:^|; )" + encodeURIComponent(key) + "=([^;]*)",
      ).exec(document.cookie))
        ? decode(result[1])
        : null;
    }
    ((this.noTracking = !1),
      (function testStorage() {
        try {
          if (window.localStorage)
            try {
              ((window.localStorage.test = 1),
                window.localStorage.removeItem("test"),
                (_storage = !0));
            } catch (e) {
              _storage = !1;
            }
          else _storage = !1;
        } catch (e) {
          _storage = !1;
        }
      })(),
      (this.setCookie = function (key, value, expires) {
        cookie(key, value, expires);
      }),
      (this.getCookie = function (key) {
        return cookie(key);
      }),
      (this.set = function (key, value) {
        _this.noTracking
          ? (_sessionData[key] = value)
          : (null != value &&
              "object" == typeof value &&
              (value = JSON.stringify(value)),
            _storage
              ? null === value
                ? window.localStorage.removeItem(key)
                : (window.localStorage[key] = value)
              : cookie(key, value, 365));
      }),
      (this.get = function (key) {
        if (_this.noTracking) return _sessionData[key];
        var val, char0;
        (val = _storage ? window.localStorage[key] : cookie(key)) &&
          (val.charAt && (char0 = val.charAt(0)),
          ("{" != char0 && "[" != char0) || (val = JSON.parse(val)),
          ("true" != val && "false" != val) || (val = "true" == val));
        return val;
      }));
  }, "Static"),
  Class(
    function Thread(_class) {
      Inherit(this, Component);
      var _this = this,
        _worker,
        _callbacks,
        _path,
        _mvc,
        _msg = {};
      const IGNORE_START = "/*!hydra-thread-ignore*/",
        IGNORE_END = "/*!end-hydra-thread-ignore*/";
      function init() {
        let file = window._ES5_ ? "/hydra-thread-es5.js" : "/hydra-thread.js";
        ((_callbacks = {}), (_worker = new Worker(Thread.PATH + file)));
      }
      function importClasses() {
        (importClass(Utils),
          importClass(Component),
          importClass(Events),
          importClass(_class, !0),
          importES5());
      }
      function importClass(_class, scoped) {
        if (_class) {
          var code, namespace;
          if (scoped) {
            code = (code = _class.toString().replace("{", "!!!")).split(
              "!!!",
            )[1];
            let ignores = [];
            for (;;) {
              let startIndex = code.indexOf(IGNORE_START);
              if (startIndex < 0) break;
              let endIndex = code.indexOf(IGNORE_END);
              (endIndex < 0 && (endIndex = code.length),
                ignores.push(code.substring(startIndex, endIndex)),
                (code =
                  code.substring(0, startIndex) + code.substring(endIndex)));
            }
            for (; code.includes("this."); ) {
              var name = code
                .slice(code.indexOf("this."))
                .split("this.")[1]
                .split(/\s*=/)[0];
              ((code = code.replace("this", "self")), createMethod(name));
            }
            code = (code = code.slice(0, -1)).replace(/_self/g, "_this");
            let index = 0;
            ignores.forEach((ignored) => {
              let endIndex = code.indexOf(IGNORE_END, index);
              ((code =
                code.substring(0, endIndex) +
                ignored +
                code.substring(endIndex)),
                (index = endIndex + ignored.length + IGNORE_END.length));
            });
          } else if ("function" != typeof _class) {
            if ((code = _class.constructor.toString()).includes("[native"))
              return;
            ((namespace = _class._namespace ? _class._namespace + "." : ""),
              (code = namespace + "Class(" + code + ', "static");'));
          } else
            ((namespace = _class._namespace ? _class._namespace + "." : ""),
              (code = namespace + "Class(" + _class.toString() + ");"));
          (Hydra.LOCAL &&
            (code += `\n//# sourceURL=hydra-thread/${Utils.getConstructorName(_class)}.js`),
            _worker.postMessage({ code: code }));
        }
      }
      function createMethod(name) {
        _this[name] = function (message = {}, callback, buffer) {
          let promise;
          return (
            Array.isArray(callback) &&
              ((buffer = callback), (callback = void 0)),
            Array.isArray(buffer) &&
              ((message = { msg: message, transfer: !0 }).buffer = buffer),
            void 0 === callback &&
              ((promise = Promise.create()), (callback = promise.resolve)),
            _this.send(name, message, callback),
            promise
          );
        };
      }
      function importES5() {
        window._ES5_ &&
          (["_createSuper", "_isNativeReflectConstruct"].forEach((name) => {
            let code = window[name].toString();
            code.includes("[native") || _worker.postMessage({ code: code });
          }),
          _worker.postMessage({
            code: "function _getPrototypeOf(o){_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o);};return _getPrototypeOf(o);}",
          }));
      }
      function addListeners() {
        _worker.addEventListener("message", workerMessage);
      }
      function workerMessage(e) {
        if (e.data.console) console.log(e.data.message);
        else if (e.data.id) {
          ((callback = _callbacks[e.data.id]) && callback(e.data.message),
            delete _callbacks[e.data.id]);
        } else if (e.data.emit) {
          (callback = _callbacks[e.data.evt]) && callback(e.data.msg);
        } else {
          var callback;
          (callback = _callbacks.transfer) && callback(e.data);
        }
      }
      (init(),
        importClasses(),
        addListeners(),
        (this.on = function (evt, callback) {
          _callbacks[evt] = callback;
        }),
        (this.off = function (evt) {
          delete _callbacks[evt];
        }),
        (this.loadFunction = function () {
          let names = [];
          for (var i = 0; i < arguments.length; i++)
            ((split = void 0),
              (name = void 0),
              (split = (code = (code = (code =
                arguments[i]).toString()).replace("(", "!!!")).split("!!!")),
              (name = split[0].split(" ")[1]),
              (code = "self." + name + " = function(" + split[1]),
              Hydra.LOCAL &&
                (code += `\n//# sourceURL=hydra-thread/function/${name}.js`),
              _worker.postMessage({ code: code }),
              createMethod(name),
              names.push(name));
          var code, split, name;
          return names;
        }),
        (this.importScript = function (path) {
          _worker.postMessage({
            path: Thread.absolutePath(path),
            importScript: !0,
          });
        }),
        (this.importCode = function (code) {
          _worker.postMessage({ code: code });
        }),
        (this.importClass = function () {
          for (var i = 0; i < arguments.length; i++) {
            importClass(arguments[i]);
          }
        }),
        (this.importModules = this.importModule =
          function () {
            for (var i = 0; i < arguments.length; i++) {
              let code = Modules.getConstructor(arguments[i]).toString();
              _worker.postMessage({ code: `Module(${code})` });
            }
          }),
        (this.importES6Class = function (name) {
          if (window._ES5_) {
            let Class = window[name],
              base = Class.toString(),
              proto = [],
              sup,
              matches = /(_this\w+)\s*=\s*(_super\w+)\.call/g.exec(base);
            if (matches) {
              let superVar = matches[2],
                superConstructor = Object.getPrototypeOf(Class);
              if (!superConstructor.toString().includes("[native")) {
                let superName = Utils.getConstructorName(superConstructor);
                sup = `_inherits(${name}, ${superName}); var ${superVar} = _createSuper(${name});`;
              }
            }
            (Object.getOwnPropertyNames(Class.prototype).forEach((fn) => {
              "constructor" != fn &&
                Class.prototype[fn] &&
                proto.push({ key: fn, string: Class.prototype[fn].toString() });
            }),
              _worker.postMessage({
                es5: base,
                name: name,
                proto: proto,
                sup: sup,
              }));
          } else {
            let es6 = `(${eval(name)})`;
            (Hydra.LOCAL && (es6 += `\n//# sourceURL=hydra-thread/${name}.js`),
              _worker.postMessage({ es6: es6, name: name }));
          }
        }),
        (this.send = function (name, message, callback) {
          if ("string" == typeof name) {
            (message = message || {}).fn = name;
          } else ((callback = message), (message = name));
          Thread.UNIQUE_ID > 999999 && (Thread.UNIQUE_ID = 1);
          var id = Thread.UNIQUE_ID++;
          (callback && (_callbacks[id] = callback),
            message.transfer
              ? ((message.msg.id = id),
                (message.msg.fn = message.fn),
                (message.msg.transfer = !0),
                _worker.postMessage(message.msg, message.buffer))
              : ((_msg.message = message),
                (_msg.id = id),
                _worker.postMessage(_msg)));
        }),
        (this.onDestroy = function () {
          _worker.terminate && _worker.terminate();
        }));
    },
    () => {
      var _shared;
      ((Thread.PATH = window._THREAD_PATH_ || "assets/js/hydra"),
        (Thread.UNIQUE_ID = 1),
        (Thread.absolutePath = Hydra.absolutePath),
        (Thread.cluster = function () {
          return new (function () {
            let index = 0,
              array = [];
            ((this.push = function (thread) {
              array.push(thread);
            }),
              (this.get = function () {
                let thread = array[index];
                return (index++, index >= array.length && (index = 0), thread);
              }),
              (this.array = array));
          })();
        }),
        (Thread.upload = function (...args) {
          let name;
          Thread.shared();
          for (let i = 0; i < _shared.array.length; i++)
            name = _shared.array[i].loadFunction(...args);
          return name;
        }),
        (Thread.uploadClass = function (...args) {
          let name;
          Thread.shared();
          for (let i = 0; i < _shared.array.length; i++)
            name = _shared.array[i].importClass(...args);
          return name;
        }),
        (Thread.shared = function (list) {
          if (!_shared) {
            _shared = Thread.cluster();
            let hardware = navigator.hardwareConcurrency || 4,
              count = Math.max(Math.min(hardware, 8), 4);
            for (let i = 0; i < count; i++) _shared.push(new Thread());
          }
          return list ? _shared : _shared.get();
        }));
    },
  ),
  Class(function TweenManager() {
    Namespace(this);
    var _this = this,
      _tweens = [];
    function updateTweens(time, dt) {
      for (let i = _tweens.length - 1; i >= 0; i--) {
        let tween = _tweens[i];
        tween.update ? tween.update(dt) : _this._removeMathTween(tween);
      }
    }
    function findEase(name) {
      for (var eases = _this.CubicEases, i = eases.length - 1; i > -1; i--)
        if (eases[i].name == name) return eases[i];
      return !1;
    }
    ((this.CubicEases = []),
      Render.start(updateTweens),
      (this._addMathTween = function (tween) {
        _tweens.push(tween);
      }),
      (this._removeMathTween = function (tween) {
        _tweens.remove(tween);
      }),
      (this._getEase = function (name, values) {
        var ease = findEase(name);
        return (
          !!ease &&
          (values ? (ease.path ? ease.path.solve : ease.values) : ease.curve)
        );
      }),
      (this._inspectEase = function (name) {
        return findEase(name);
      }),
      (this.tween = function (
        object,
        props,
        time,
        ease,
        delay,
        complete,
        isManual,
        scaledTime,
      ) {
        "number" != typeof delay &&
          ((update = complete), (complete = delay), (delay = 0));
        const tween = new MathTween(
          object,
          props,
          time,
          ease,
          delay,
          complete,
          isManual,
          scaledTime,
        );
        let usePromise = null;
        return (
          complete &&
            complete instanceof Promise &&
            ((usePromise = complete), (complete = complete.resolve)),
          usePromise || tween
        );
      }),
      (this.clearTween = function (object) {
        if (
          (object._mathTween &&
            object._mathTween.stop &&
            object._mathTween.stop(),
          object._mathTweens)
        ) {
          for (var tweens = object._mathTweens, i = 0; i < tweens.length; i++) {
            var tw = tweens[i];
            tw && tw.stop && tw.stop();
          }
          object._mathTweens = null;
        }
      }),
      (this.addCustomEase = function (ease) {
        var add = !0;
        if ("object" != typeof ease || !ease.name || !ease.curve)
          throw "TweenManager :: addCustomEase requires {name, curve}";
        for (var i = _this.CubicEases.length - 1; i > -1; i--)
          ease.name == _this.CubicEases[i].name && (add = !1);
        if (add) {
          if ("m" == ease.curve.charAt(0).toLowerCase()) {
            if (!window.EasingPath)
              throw "Using custom eases requires easingpath module";
            ease.path = new EasingPath(ease.curve);
          } else
            ease.values = (function stringToValues(str) {
              for (
                var values = str.split("(")[1].slice(0, -1).split(","), i = 0;
                i < values.length;
                i++
              )
                values[i] = parseFloat(values[i]);
              return values;
            })(ease.curve);
          _this.CubicEases.push(ease);
        }
        return ease;
      }),
      (Math.interpolate = function (start, end, alpha, ease) {
        const fn = _this.Interpolation.convertEase(ease);
        return Math.mix(
          start,
          end,
          "function" == typeof fn
            ? fn(alpha)
            : _this.Interpolation.solve(fn, alpha),
        );
      }),
      (window.tween = this.tween),
      (window.clearTween = this.clearTween));
  }, "Static"),
  TweenManager.Class(function Interpolation() {
    const _this = this;
    function calculateBezier(aT, aA1, aA2) {
      return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }
    function A(aA1, aA2) {
      return 1 - 3 * aA2 + 3 * aA1;
    }
    function B(aA1, aA2) {
      return 3 * aA2 - 6 * aA1;
    }
    function C(aA1) {
      return 3 * aA1;
    }
    ((this.convertEase = function (ease) {
      var fn = (function () {
        switch (ease) {
          case "easeInQuad":
            return TweenManager.Interpolation.Quad.In;
          case "easeInCubic":
            return TweenManager.Interpolation.Cubic.In;
          case "easeInQuart":
            return TweenManager.Interpolation.Quart.In;
          case "easeInQuint":
            return TweenManager.Interpolation.Quint.In;
          case "easeInSine":
            return TweenManager.Interpolation.Sine.In;
          case "easeInExpo":
            return TweenManager.Interpolation.Expo.In;
          case "easeInCirc":
            return TweenManager.Interpolation.Circ.In;
          case "easeInElastic":
            return TweenManager.Interpolation.Elastic.In;
          case "easeInBack":
            return TweenManager.Interpolation.Back.In;
          case "easeInBounce":
            return TweenManager.Interpolation.Bounce.In;
          case "easeOutQuad":
            return TweenManager.Interpolation.Quad.Out;
          case "easeOutCubic":
            return TweenManager.Interpolation.Cubic.Out;
          case "easeOutQuart":
            return TweenManager.Interpolation.Quart.Out;
          case "easeOutQuint":
            return TweenManager.Interpolation.Quint.Out;
          case "easeOutSine":
            return TweenManager.Interpolation.Sine.Out;
          case "easeOutExpo":
            return TweenManager.Interpolation.Expo.Out;
          case "easeOutCirc":
            return TweenManager.Interpolation.Circ.Out;
          case "easeOutElastic":
            return TweenManager.Interpolation.Elastic.Out;
          case "easeOutBack":
            return TweenManager.Interpolation.Back.Out;
          case "easeOutBounce":
            return TweenManager.Interpolation.Bounce.Out;
          case "easeInOutQuad":
            return TweenManager.Interpolation.Quad.InOut;
          case "easeInOutCubic":
            return TweenManager.Interpolation.Cubic.InOut;
          case "easeInOutQuart":
            return TweenManager.Interpolation.Quart.InOut;
          case "easeInOutQuint":
            return TweenManager.Interpolation.Quint.InOut;
          case "easeInOutSine":
            return TweenManager.Interpolation.Sine.InOut;
          case "easeInOutExpo":
            return TweenManager.Interpolation.Expo.InOut;
          case "easeInOutCirc":
            return TweenManager.Interpolation.Circ.InOut;
          case "easeInOutElastic":
            return TweenManager.Interpolation.Elastic.InOut;
          case "easeInOutBack":
            return TweenManager.Interpolation.Back.InOut;
          case "easeInOutBounce":
            return TweenManager.Interpolation.Bounce.InOut;
          case "linear":
            return TweenManager.Interpolation.Linear.None;
        }
      })();
      if (!fn) {
        var curve = TweenManager._getEase(ease, !0);
        fn = curve || TweenManager.Interpolation.Cubic.Out;
      }
      return fn;
    }),
      (this.solve = function (values, elapsed) {
        return values[0] == values[1] && values[2] == values[3]
          ? elapsed
          : calculateBezier(
              (function getTForX(aX, mX1, mX2) {
                for (var aT, aA1, aA2, aGuessT = aX, i = 0; i < 4; i++) {
                  var currentSlope =
                    ((aT = aGuessT),
                    3 * A((aA1 = mX1), (aA2 = mX2)) * aT * aT +
                      2 * B(aA1, aA2) * aT +
                      C(aA1));
                  if (0 == currentSlope) return aGuessT;
                  aGuessT -=
                    (calculateBezier(aGuessT, mX1, mX2) - aX) / currentSlope;
                }
                return aGuessT;
              })(elapsed, values[0], values[2]),
              values[1],
              values[3],
            );
      }),
      (this.Linear = {
        None: function (k) {
          return k;
        },
      }),
      (this.Quad = {
        In: function (k) {
          return k * k;
        },
        Out: function (k) {
          return k * (2 - k);
        },
        InOut: function (k) {
          return (k *= 2) < 1 ? 0.5 * k * k : -0.5 * (--k * (k - 2) - 1);
        },
      }),
      (this.Cubic = {
        In: function (k) {
          return k * k * k;
        },
        Out: function (k) {
          return --k * k * k + 1;
        },
        InOut: function (k) {
          return (k *= 2) < 1 ? 0.5 * k * k * k : 0.5 * ((k -= 2) * k * k + 2);
        },
      }),
      (this.Quart = {
        In: function (k) {
          return k * k * k * k;
        },
        Out: function (k) {
          return 1 - --k * k * k * k;
        },
        InOut: function (k) {
          return (k *= 2) < 1
            ? 0.5 * k * k * k * k
            : -0.5 * ((k -= 2) * k * k * k - 2);
        },
      }),
      (this.Quint = {
        In: function (k) {
          return k * k * k * k * k;
        },
        Out: function (k) {
          return --k * k * k * k * k + 1;
        },
        InOut: function (k) {
          return (k *= 2) < 1
            ? 0.5 * k * k * k * k * k
            : 0.5 * ((k -= 2) * k * k * k * k + 2);
        },
      }),
      (this.Sine = {
        In: function (k) {
          return 1 - Math.cos((k * Math.PI) / 2);
        },
        Out: function (k) {
          return Math.sin((k * Math.PI) / 2);
        },
        InOut: function (k) {
          return 0.5 * (1 - Math.cos(Math.PI * k));
        },
      }),
      (this.Expo = {
        In: function (k) {
          return 0 === k ? 0 : Math.pow(1024, k - 1);
        },
        Out: function (k) {
          return 1 === k ? 1 : 1 - Math.pow(2, -10 * k);
        },
        InOut: function (k) {
          return 0 === k
            ? 0
            : 1 === k
              ? 1
              : (k *= 2) < 1
                ? 0.5 * Math.pow(1024, k - 1)
                : 0.5 * (2 - Math.pow(2, -10 * (k - 1)));
        },
      }),
      (this.Circ = {
        In: function (k) {
          return 1 - Math.sqrt(1 - k * k);
        },
        Out: function (k) {
          return Math.sqrt(1 - --k * k);
        },
        InOut: function (k) {
          return (k *= 2) < 1
            ? -0.5 * (Math.sqrt(1 - k * k) - 1)
            : 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
        },
      }),
      (this.Elastic = {
        In: function (k, a = 1, p = 0.4) {
          var s;
          return 0 === k
            ? 0
            : 1 === k
              ? 1
              : (!a || a < 1
                  ? ((a = 1), (s = p / 4))
                  : (s = (p * Math.asin(1 / a)) / (2 * Math.PI)),
                -a *
                  Math.pow(2, 10 * (k -= 1)) *
                  Math.sin(((k - s) * (2 * Math.PI)) / p));
        },
        Out: function (k, a = 1, p = 0.4) {
          var s;
          return 0 === k
            ? 0
            : 1 === k
              ? 1
              : (!a || a < 1
                  ? ((a = 1), (s = p / 4))
                  : (s = (p * Math.asin(1 / a)) / (2 * Math.PI)),
                a *
                  Math.pow(2, -10 * k) *
                  Math.sin(((k - s) * (2 * Math.PI)) / p) +
                  1);
        },
        InOut: function (k, a = 1, p = 0.4) {
          var s;
          return 0 === k
            ? 0
            : 1 === k
              ? 1
              : (!a || a < 1
                  ? ((a = 1), (s = p / 4))
                  : (s = (p * Math.asin(1 / a)) / (2 * Math.PI)),
                (k *= 2) < 1
                  ? a *
                    Math.pow(2, 10 * (k -= 1)) *
                    Math.sin(((k - s) * (2 * Math.PI)) / p) *
                    -0.5
                  : a *
                      Math.pow(2, -10 * (k -= 1)) *
                      Math.sin(((k - s) * (2 * Math.PI)) / p) *
                      0.5 +
                    1);
        },
      }),
      (this.Back = {
        In: function (k) {
          var s = 1.70158;
          return k * k * ((s + 1) * k - s);
        },
        Out: function (k) {
          var s = 1.70158;
          return --k * k * ((s + 1) * k + s) + 1;
        },
        InOut: function (k) {
          var s = 2.5949095;
          return (k *= 2) < 1
            ? k * k * ((s + 1) * k - s) * 0.5
            : 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
        },
      }),
      (this.Bounce = {
        In: function (k) {
          return 1 - _this.Bounce.Out(1 - k);
        },
        Out: function (k) {
          return k < 1 / 2.75
            ? 7.5625 * k * k
            : k < 2 / 2.75
              ? 7.5625 * (k -= 1.5 / 2.75) * k + 0.75
              : k < 2.5 / 2.75
                ? 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375
                : 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
        },
        InOut: function (k) {
          return k < 0.5
            ? 0.5 * _this.Bounce.In(2 * k)
            : 0.5 * _this.Bounce.Out(2 * k - 1) + 0.5;
        },
      }));
  }, "Static"),
  Class(
    function MathTween(
      _object,
      _props,
      _time,
      _ease,
      _delay,
      _callback,
      _manual,
      _scaledTime,
    ) {
      var _startTime,
        _startValues,
        _endValues,
        _easeFunction,
        _paused,
        _newEase,
        _spring,
        _damping,
        _update,
        _currentTime,
        _this = this,
        _elapsed = 0;
      function clear() {
        if (!_object && !_props) return !1;
        ((_object._mathTween = null),
          TweenManager._removeMathTween(_this),
          Utils.nullObject(_this),
          _object._mathTweens &&
            _object._mathTweens.remove(_this._tweenWrapper));
      }
      ((_this.object = _object),
        (_this.props = _props),
        (_this.time = _time),
        (_this.ease = _ease),
        (_this.delay = _delay),
        defer(function () {
          if (!_this.stopped) {
            if (_this.overrideValues) {
              let values = _this.overrideValues(
                _this,
                _object,
                _props,
                _time,
                _ease,
                _delay,
              );
              values &&
                ((_this.props = _props = values.props || _props),
                (_this.time = _time = values.time || _time),
                (_this.ease = _ease = values.ease || _ease),
                (_this.delay = _delay = values.delay || _delay));
            }
            if (_object && _props) {
              if (((_this.object = _object), "number" != typeof _time))
                throw "MathTween Requires object, props, time, ease";
              !(function start() {
                _object.multiTween ||
                  !_object._mathTween ||
                  _manual ||
                  TweenManager.clearTween(_object);
                _manual || TweenManager._addMathTween(_this);
                ((_this.time = _time), (_this.delay = _delay));
                let propString = (function getPropString() {
                  let string = "";
                  for (let key in _props)
                    "number" == typeof _props[key] && (string += key + " ");
                  return string;
                })();
                ((_object._mathTween = _this),
                  _object.multiTween &&
                    (_object._mathTweens || (_object._mathTweens = []),
                    _object._mathTweens.forEach((t) => {
                      t.props == propString && t.tween.stop();
                    }),
                    (_this._tweenWrapper = { props: propString, tween: _this }),
                    _object._mathTweens.push(_this._tweenWrapper)));
                _ease || (_ease = "linear");
                "string" == typeof _ease &&
                  ((_ease = TweenManager.Interpolation.convertEase(_ease)),
                  (_easeFunction = "function" == typeof _ease));
                ((_startTime = _scaledTime ? Render.now() : performance.now()),
                  (_currentTime = _startTime),
                  (_startTime += _delay),
                  (_endValues = _props),
                  (_startValues = {}),
                  _props.spring && (_spring = _props.spring));
                _props.damping && (_damping = _props.damping);
                for (var prop in ((_this.startValues = _startValues),
                _endValues))
                  "number" == typeof _object[prop] &&
                    (_startValues[prop] = _object[prop]);
              })();
            }
          }
        }),
        (this.update = function (dt) {
          if (_paused) return;
          if ((_currentTime += _scaledTime ? dt : Render.DT) < _startTime)
            return;
          _elapsed =
            (_elapsed = (_currentTime - _startTime) / _time) > 1 ? 1 : _elapsed;
          let delta = this.interpolate(_elapsed);
          (_update && _update(delta),
            1 == _elapsed &&
              (_callback && _callback(),
              _this.completePromise && _this.completePromise.resolve(),
              clear()));
        }),
        (this.pause = function () {
          _paused = !0;
        }),
        (this.resume = function () {
          _paused = !1;
        }),
        (this.stop = function () {
          return ((_this.stopped = !0), clear(), null);
        }),
        (this.setEase = function (ease) {
          _newEase != ease &&
            ((_newEase = ease),
            (_ease = TweenManager.Interpolation.convertEase(ease)),
            (_easeFunction = "function" == typeof _ease));
        }),
        (this.getValues = function () {
          return { start: _startValues, end: _endValues };
        }),
        (this.interpolate = function (elapsed) {
          var delta = _easeFunction
            ? _ease(elapsed, _spring, _damping)
            : TweenManager.Interpolation.solve(_ease, elapsed);
          for (var prop in _startValues)
            if (
              "number" == typeof _startValues[prop] &&
              "number" == typeof _endValues[prop]
            ) {
              var start = _startValues[prop],
                end = _endValues[prop];
              _object[prop] = start + (end - start) * delta;
            }
          return delta;
        }),
        (this.onUpdate = function (callback) {
          return ((_update = callback), this);
        }),
        (this.onComplete = function (callback) {
          return ((_callback = callback), this);
        }),
        (this.promise = function () {
          return (
            _this.completePromise || (_this.completePromise = Promise.create()),
            _this.completePromise
          );
        }),
        (this.setElapsed = function (elapsed) {
          ((_startTime = performance.now()),
            (_currentTime = _startTime + _time * elapsed));
        }));
    },
  ),
  Class(function TweenTimeline() {
    Inherit(this, Component);
    const _this = this;
    let _tween,
      _total = 0;
    const _tweens = [];
    function calculate() {
      _tweens.sort(function (a, b) {
        const ta = a.time + a.delay;
        return b.time + b.delay - ta;
      });
      const first = _tweens[0];
      _total = first.time + first.delay;
    }
    function loop() {
      let time = _this.elapsed * _total;
      for (let i = _tweens.length - 1; i > -1; i--) {
        let t = _tweens[i],
          relativeTime = time - t.delay,
          elapsed = Math.clamp(relativeTime / t.time, 0, 1);
        t.interpolate(elapsed);
      }
      _this.events.fire(Events.UPDATE, _this, !0);
    }
    ((this.elapsed = 0),
      this.get("timeRemaining", () => _total - _this.elapsed * _total),
      (this.add = function (object, props, time, ease, delay = 0) {
        let tween;
        return (
          (object instanceof MathTween || object instanceof FrameTween) &&
            ((props = object.props),
            (time = object.time),
            (ease = object.ease),
            (delay = object.delay),
            (object = object.object)),
          (tween =
            object instanceof HydraObject
              ? new FrameTween(object, props, time, ease, delay, null, !0)
              : new MathTween(object, props, time, ease, delay, null, !0)),
          _tweens.push(tween),
          defer(calculate),
          tween
        );
      }),
      (this.tween = function (to, time, ease, delay, callback) {
        return (
          _this.clearTween(),
          (_tween = tween(_this, { elapsed: to }, time, ease, delay)
            .onUpdate(loop)
            .onComplete(callback)),
          _tween
        );
      }),
      (this.clearTween = function () {
        _tween && _tween.stop && _tween.stop();
      }),
      (this.start = function () {
        _this.startRender(loop);
      }),
      (this.stop = function () {
        _this.stopRender(loop);
      }),
      (this.update = function () {
        loop();
      }),
      (this.seek = function (elapsed) {
        ((_this.elapsed = elapsed), loop());
      }),
      (this.onDestroy = function () {
        (_this.clearTween(), Render.stop(loop));
        for (var i = 0; i < _tweens.length; i++) _tweens[i].stop();
      }));
  }),
  Class(function CMSData() {
    Inherit(this, Model);
    const _this = this,
      _data = {},
      dataVersion = window.PROD ? "latest" : "dev";
    let _workPages = new StateArray(),
      _workData = [],
      _lastRoute = "";
    ((async () => {
      (await Hydra.ready(),
        await _this.createBigJson(),
        Data.handleRequest("workItems", (data, mockData) =>
          _workPages.length ? _workPages : new StateArray(mockData()),
        ),
        _this.flag("isReady", !0));
    })(),
      AppState.bind("Router/state", (val) => {
        if (val.includes("work/")) {
          let slug = val.replace("work/", ""),
            project = _workData.find((elem) => elem.perma === slug);
          project &&
            (_workPages.includes(project) ||
              (_workPages.remove(_workPages[_workPages.length - 1]),
              _workPages.insertAtIdx(0, project)));
        } else {
          "work" !== val ||
            _lastRoute ||
            _this.delayedCall((_) => _workPages.reflow(), 400);
          if (val === "work" && _currentFilterTag) {
            _this.delayedCall(() => {
              if (AppState.get("Router/state") === "work" && _currentFilterTag) {
                let start = _currentPage * 14;
                let slice = _shuffledFilterItems.slice(start, start + 14);
                let mismatch = false;
                if (_workPages.length !== slice.length) {
                  mismatch = true;
                } else {
                  for (let i = 0; i < slice.length; i++) {
                    if (_workPages[i] !== slice[i]) {
                      mismatch = true;
                      break;
                    }
                  }
                }
                if (mismatch) {
                  _workPages.refresh(slice);
                }
              }
            }, 1000);
          }
        }
        _lastRoute = val;
      }));
    let response = {};
    let _shuffledFilterItems = [], _currentFilterTag = "", _currentPage = 0;
    (AppState.bind("CMSData/slug", ({ slug: slug, message: message }) => {
      let project = _workData.find((elem) => elem.perma === slug);
      project &&
        ((response = { ...project, body: message, ai: !0 }),
        AppState.set("ViewController/navigate", `work/${slug}`));
    }),
      AppState.bind("CMSData/readyForResponse", (_) => {
        response.body &&
          (AppState.set("WorkDetailContent/updateText", response, !0),
          (response = {}));
      }),
      (_this.filter = function (tag, page = 0, forceReshuffle = false) {
        _currentPage = page;
        if (_currentFilterTag !== tag || forceReshuffle) {
          _currentFilterTag = tag;
          let filtered = _workData.filter((element) => element.tags.includes(tag));
          _shuffledFilterItems = filtered.shuffle();
        }
        let pageSize = 14;
        let totalPages = Math.ceil(_shuffledFilterItems.length / pageSize);
        let start = page * pageSize;
        let slice = _shuffledFilterItems.slice(start, start + pageSize);
        _workPages.refresh(slice);
        AppState.set("CMSData/pagination", {
          tag: tag,
          page: page,
          totalPages: totalPages,
          totalItems: _shuffledFilterItems.length
        }, !0);
      }),
      (_this.cleanup = function (data) {
        const {
          id: id,
          createdAt: createdAt,
          updatedAt: updatedAt,
          globalType: globalType,
          ...cleaned
        } = data;
        return cleaned;
      }),
      (_this.reshape = function (data, index) {
        let dateString = `${new Date(data.completionDate).getFullYear()}\n${data.clientName}\n${data.tags.toUpperCase()}`;
        return (
          !data.uiColor &&
            Hydra.LOCAL &&
            console.log("Color Missing", data.name),
          {
            seo: data.name,
            title: data.name,
            subhead: data.description,
            priority: data.priority,
            color: data.uiColor || "dddddd",
            date: dateString,
            projectLogo: data.projectLogo,
            clientName: data.clientName,
            body: data.description,
            perma: data.slug,
            caseStudyURL: data.caseStudyURL,
            projectURL: data.projectURL,
            videoURL: data.video.url,
            thumbnailURL: data.video.thumbnail,
            tags: data.tags.toLowerCase(),
            index: index,
          }
        );
      }),
      (_this.createBigJson = async function () {
        const pages = ["metadata", "contact", "projects"];
        window.CMS_DATA = window.CMS_DATA || {};
        for await (const key of pages) {
          if (window.CMS_DATA[key]) {
            _data[key] = window.CMS_DATA[key];
            continue;
          }
          const data = await get(
            `https://storage.googleapis.com/activetheory-v6.appspot.com/cms/${key}-${dataVersion}.json?v=CMS_DATA_${Date.now()}`,
          ).catch((e) => console.log(e));
          if (data)
            if ("projects" === key) {
              ((_workData = data
                .map((page, index) => _this.reshape(page, index))
                .sort((a, b) => b.priority - a.priority)),
                (window.CMS_DATA.projects = _workData),
                _workPages.refresh([..._workData.slice(0, 14).shuffle()]));
              const workids = Utils.query("workids");
              if (workids && Utils.query("roomqr")) {
                const ids = workids.split(","),
                  newList = [];
                (ids.forEach((id) => {
                  const match = _workData.find(
                    (item) => item.index === parseInt(id),
                  );
                  match && newList.push(match);
                }),
                  _workPages.refresh(newList));
              }
              _this.workPages = _workPages;
            } else
              ((window.CMS_DATA[key] = _this.cleanup(data)),
                (_data[key] = data));
        }
      }),
      (_this.ready = async function () {
        await _this.wait("isReady");
      }));
  }, "static"),
  (window.ASSETS = ["assets/shaders/compiled.vs?v=" + window._CACHE_]),
  (ASSETS.SW = ["assets/js/app.1746999829739.js"]),
  (window.UIL_ASSETS_GEOMETRIES = [
    {
      filename: "hexgrid/hexagon.bin",
      bytes: 617,
      lastChange: "2025-05-11T21:43:08.750Z",
    },
    {
      filename: "hexgrid/hexagon.json",
      bytes: 12997,
      lastChange: "2025-05-11T21:43:08.750Z",
    },
    {
      filename: "hexgrid/hexagon_bottomhalf.bin",
      bytes: 541,
      lastChange: "2025-05-11T21:43:08.750Z",
    },
    {
      filename: "hexgrid/hexagon_bottomhalf.json",
      bytes: 10080,
      lastChange: "2025-05-11T21:43:08.750Z",
    },
    {
      filename: "hexgrid/hexagon_full.bin",
      bytes: 623,
      lastChange: "2025-05-11T21:43:08.750Z",
    },
    {
      filename: "hexgrid/hexagon_full.json",
      bytes: 13125,
      lastChange: "2025-05-11T21:43:08.750Z",
    },
    {
      filename: "hexgrid/hexagon_gem.bin",
      bytes: 501,
      lastChange: "2025-05-11T21:43:08.750Z",
    },
    {
      filename: "hexgrid/hexagon_gem.json",
      bytes: 10116,
      lastChange: "2025-05-11T21:43:08.750Z",
    },
    {
      filename: "hexgrid/hexagon_lefthalf.bin",
      bytes: 514,
      lastChange: "2025-05-11T21:43:08.750Z",
    },
    {
      filename: "hexgrid/hexagon_lefthalf.json",
      bytes: 8106,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_nobevel_hard.bin",
      bytes: 409,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_nobevel_hard.json",
      bytes: 5472,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_nobevel_med.bin",
      bytes: 409,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_nobevel_med.json",
      bytes: 5671,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_nobevel_soft.bin",
      bytes: 415,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_nobevel_soft.json",
      bytes: 6643,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_righthalf.bin",
      bytes: 536,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_righthalf.json",
      bytes: 8118,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_tophalf.bin",
      bytes: 590,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "hexgrid/hexagon_tophalf.json",
      bytes: 10028,
      lastChange: "2025-05-11T21:43:08.751Z",
    },
    {
      filename: "home/jellyfish.bin",
      bytes: 24517,
      lastChange: "2025-05-11T21:43:08.752Z",
    },
    {
      filename: "home/jellyfish.json",
      bytes: 1774016,
      lastChange: "2025-05-11T21:43:08.758Z",
    },
    {
      filename: "home/logo.json",
      bytes: 147442,
      lastChange: "2025-05-11T21:43:08.758Z",
    },
    {
      filename: "jellyfish/bulb3.json",
      bytes: 7081,
      lastChange: "2025-05-11T21:43:08.758Z",
    },
    {
      filename: "logo/AT_logo.bin",
      bytes: 15200,
      lastChange: "2025-05-11T21:43:08.758Z",
    },
    {
      filename: "logo/AT_logo.json",
      bytes: 1669699,
      lastChange: "2025-05-11T21:43:08.761Z",
    },
    {
      filename: "logo/AT_logo2.bin",
      bytes: 11676,
      lastChange: "2025-05-11T21:43:08.761Z",
    },
    {
      filename: "logo_animation/A_logo_base.bin",
      bytes: 7579,
      lastChange: "2025-05-11T21:43:08.762Z",
    },
    {
      filename: "logo_animation/A_logo_base.json",
      bytes: 576458,
      lastChange: "2025-05-11T21:43:08.763Z",
    },
    {
      filename: "logo_animation/A_logoanimation_N.json",
      bytes: 3860753,
      lastChange: "2025-05-11T21:43:08.768Z",
    },
    {
      filename: "logo_animation/A_logoanimation_P.json",
      bytes: 3874374,
      lastChange: "2025-05-11T21:43:08.774Z",
    },
    {
      filename: "logo_animation/A_logorest.json",
      bytes: 181383,
      lastChange: "2025-05-11T21:43:08.774Z",
    },
    {
      filename: "logo_animation/ring_logo_base.bin",
      bytes: 6504,
      lastChange: "2025-05-11T21:43:08.774Z",
    },
    {
      filename: "logo_animation/ring_logo_base.json",
      bytes: 533092,
      lastChange: "2025-05-11T21:43:08.775Z",
    },
    {
      filename: "logo_animation/ring_logoanimation_N.json",
      bytes: 2851800,
      lastChange: "2025-05-11T21:43:08.779Z",
    },
    {
      filename: "logo_animation/ring_logoanimation_P.json",
      bytes: 2822277,
      lastChange: "2025-05-11T21:43:08.783Z",
    },
    {
      filename: "logo_animation/ring_logorest.json",
      bytes: 131395,
      lastChange: "2025-05-11T21:43:08.783Z",
    },
    {
      filename: "panels/2x1.bin",
      bytes: 500,
      lastChange: "2025-05-11T21:43:08.783Z",
    },
    {
      filename: "panels/2x1.json",
      bytes: 10344,
      lastChange: "2025-05-11T21:43:08.783Z",
    },
    {
      filename: "panels/2x2.bin",
      bytes: 470,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/2x2.json",
      bytes: 10529,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/2x3.bin",
      bytes: 484,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/2x3.json",
      bytes: 10517,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/2x4.bin",
      bytes: 481,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/2x4.json",
      bytes: 10290,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/3x1.bin",
      bytes: 493,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/3x1.json",
      bytes: 10319,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/3x4.bin",
      bytes: 481,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/3x4.json",
      bytes: 10632,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/5x2.bin",
      bytes: 485,
      lastChange: "2025-05-11T21:43:08.784Z",
    },
    {
      filename: "panels/5x2.json",
      bytes: 10587,
      lastChange: "2025-05-11T21:43:08.785Z",
    },
    {
      filename: "panels/5x3.bin",
      bytes: 485,
      lastChange: "2025-05-11T21:43:08.785Z",
    },
    {
      filename: "panels/5x3.json",
      bytes: 10325,
      lastChange: "2025-05-11T21:43:08.785Z",
    },
    {
      filename: "particles/at_logo.bin",
      bytes: 2609,
      lastChange: "2025-05-11T21:43:08.785Z",
    },
    {
      filename: "particles/flower_spine-1024.bin",
      bytes: 7319229,
      lastChange: "2025-05-11T21:43:08.795Z",
    },
    {
      filename: "particles/flower_spine-128.bin",
      bytes: 133260,
      lastChange: "2025-05-11T21:43:08.795Z",
    },
    {
      filename: "particles/flower_spine-256.bin",
      bytes: 488380,
      lastChange: "2025-05-11T21:43:08.796Z",
    },
    {
      filename: "particles/flower_spine-512.bin",
      bytes: 1873490,
      lastChange: "2025-05-11T21:43:08.799Z",
    },
    {
      filename: "particles/forest-1024.bin",
      bytes: 3083106,
      lastChange: "2025-05-11T21:43:08.804Z",
    },
    {
      filename: "particles/forest-128.bin",
      bytes: 117132,
      lastChange: "2025-05-11T21:43:08.804Z",
    },
    {
      filename: "particles/forest-256.bin",
      bytes: 401817,
      lastChange: "2025-05-11T21:43:08.805Z",
    },
    {
      filename: "particles/forest-512.bin",
      bytes: 876944,
      lastChange: "2025-05-11T21:43:08.806Z",
    },
    {
      filename: "particles/tree-128.bin",
      bytes: 820400,
      lastChange: "2025-05-11T21:43:08.808Z",
    },
    {
      filename: "particles/tree-256.bin",
      bytes: 1572720,
      lastChange: "2025-05-11T21:43:08.813Z",
    },
    {
      filename: "room/bush.bin",
      bytes: 32724,
      lastChange: "2025-05-11T21:43:08.813Z",
    },
    {
      filename: "room/bush.json",
      bytes: 1008539,
      lastChange: "2025-05-11T21:43:08.815Z",
    },
    {
      filename: "room/bush_instances.bin",
      bytes: 1038,
      lastChange: "2025-05-11T21:43:08.815Z",
    },
    {
      filename: "room/bush_instances.json",
      bytes: 4405,
      lastChange: "2025-05-11T21:43:08.815Z",
    },
    {
      filename: "room/caustic_plane.bin",
      bytes: 288,
      lastChange: "2025-05-11T21:43:08.815Z",
    },
    {
      filename: "room/caustic_plane.json",
      bytes: 733,
      lastChange: "2025-05-11T21:43:08.815Z",
    },
    {
      filename: "room/floor.bin",
      bytes: 353,
      lastChange: "2025-05-11T21:43:08.815Z",
    },
    {
      filename: "room/floor.json",
      bytes: 571,
      lastChange: "2025-05-11T21:43:08.816Z",
    },
    {
      filename: "room/glass.bin",
      bytes: 1214,
      lastChange: "2025-05-11T21:43:08.816Z",
    },
    {
      filename: "room/glass.json",
      bytes: 69091,
      lastChange: "2025-05-11T21:43:08.816Z",
    },
    {
      filename: "room/land.bin",
      bytes: 11931,
      lastChange: "2025-05-11T21:43:08.816Z",
    },
    {
      filename: "room/land.json",
      bytes: 858677,
      lastChange: "2025-05-11T21:43:08.819Z",
    },
    {
      filename: "room/light.bin",
      bytes: 343,
      lastChange: "2025-05-11T21:43:08.819Z",
    },
    {
      filename: "room/light.json",
      bytes: 2438,
      lastChange: "2025-05-11T21:43:08.819Z",
    },
    {
      filename: "room/prop.bin",
      bytes: 1584,
      lastChange: "2025-05-11T21:43:08.819Z",
    },
    {
      filename: "room/prop.json",
      bytes: 113864,
      lastChange: "2025-05-11T21:43:08.820Z",
    },
    {
      filename: "room/walls.bin",
      bytes: 437,
      lastChange: "2025-05-11T21:43:08.820Z",
    },
    {
      filename: "room/walls.json",
      bytes: 2827,
      lastChange: "2025-05-11T21:43:08.820Z",
    },
    {
      filename: "spine/spine.bin",
      bytes: 15117,
      lastChange: "2025-05-11T21:43:08.820Z",
    },
    {
      filename: "spine/spine.json",
      bytes: 1446457,
      lastChange: "2025-05-11T21:43:08.822Z",
    },
    {
      filename: "tree_room/cables.bin",
      bytes: 87527,
      lastChange: "2025-05-11T21:43:08.823Z",
    },
    {
      filename: "tree_room/cables.json",
      bytes: 5747844,
      lastChange: "2025-05-11T21:43:08.839Z",
    },
    {
      filename: "tree_room/mask.bin",
      bytes: 1663,
      lastChange: "2025-05-11T21:43:08.839Z",
    },
    {
      filename: "tree_room/mask.json",
      bytes: 76236,
      lastChange: "2025-05-11T21:43:08.839Z",
    },
    {
      filename: "tree_room/pillars.bin",
      bytes: 3278,
      lastChange: "2025-05-11T21:43:08.839Z",
    },
    {
      filename: "tree_room/pillars.json",
      bytes: 177901,
      lastChange: "2025-05-11T21:43:08.840Z",
    },
    {
      filename: "tree_room/rock_L.bin",
      bytes: 5004,
      lastChange: "2025-05-11T21:43:08.840Z",
    },
    {
      filename: "tree_room/rock_L.json",
      bytes: 277142,
      lastChange: "2025-05-11T21:43:08.841Z",
    },
    {
      filename: "tree_room/rock_R.bin",
      bytes: 12253,
      lastChange: "2025-05-11T21:43:08.841Z",
    },
    {
      filename: "tree_room/rock_R.json",
      bytes: 950266,
      lastChange: "2025-05-11T21:43:08.844Z",
    },
    {
      filename: "tree_room/rocky_soil.bin",
      bytes: 68637,
      lastChange: "2025-05-11T21:43:08.844Z",
    },
    {
      filename: "tree_room/rocky_soil.json",
      bytes: 6397432,
      lastChange: "2025-05-11T21:43:08.863Z",
    },
    {
      filename: "tree_room/sand.bin",
      bytes: 6714,
      lastChange: "2025-05-11T21:43:08.864Z",
    },
    {
      filename: "tree_room/sand.json",
      bytes: 531248,
      lastChange: "2025-05-11T21:43:08.865Z",
    },
    {
      filename: "tree_room/structure.bin",
      bytes: 145133,
      lastChange: "2025-05-11T21:43:08.866Z",
    },
    {
      filename: "tree_room/structure.json",
      bytes: 13120879,
      lastChange: "2025-05-11T21:43:08.905Z",
    },
    {
      filename: "tree_room/tree.bin",
      bytes: 555893,
      lastChange: "2025-05-11T21:43:08.907Z",
    },
    {
      filename: "tree_room/tree.json",
      bytes: 33329808,
      lastChange: "2025-05-11T21:43:09.010Z",
    },
    {
      filename: "tree_room/treePCv3-128.bin",
      bytes: 83020,
      lastChange: "2025-05-11T21:43:09.011Z",
    },
    {
      filename: "tree_room/treePCv3-128.json",
      bytes: 1226047,
      lastChange: "2025-05-11T21:43:09.016Z",
    },
    {
      filename: "tree_room/treePCv3-256.bin",
      bytes: 309738,
      lastChange: "2025-05-11T21:43:09.017Z",
    },
    {
      filename: "tree_room/treePCv3-256.json",
      bytes: 4900620,
      lastChange: "2025-05-11T21:43:09.035Z",
    },
    {
      filename: "tree_room/tree_leaves.bin",
      bytes: 119158,
      lastChange: "2025-05-11T21:43:09.035Z",
    },
    {
      filename: "tree_room/tree_leaves.json",
      bytes: 3188740,
      lastChange: "2025-05-11T21:43:09.047Z",
    },
    {
      filename: "tree_room/tree_trunk.bin",
      bytes: 240352,
      lastChange: "2025-05-11T21:43:09.048Z",
    },
    {
      filename: "tree_room/tree_trunk.json",
      bytes: 20659103,
      lastChange: "2025-05-11T21:43:09.109Z",
    },
    {
      filename: "tree_room/walls.bin",
      bytes: 7394,
      lastChange: "2025-05-11T21:43:09.110Z",
    },
    {
      filename: "tree_room/walls.json",
      bytes: 634977,
      lastChange: "2025-05-11T21:43:09.111Z",
    },
    {
      filename: "tree_room/water.bin",
      bytes: 279,
      lastChange: "2025-05-11T21:43:09.111Z",
    },
    {
      filename: "tree_room/water.json",
      bytes: 490,
      lastChange: "2025-05-11T21:43:09.112Z",
    },
    {
      filename: "work/chainlink.bin",
      bytes: 5774,
      lastChange: "2025-05-11T21:43:09.112Z",
    },
    {
      filename: "work/chainlink.json",
      bytes: 472723,
      lastChange: "2025-05-11T21:43:09.113Z",
    },
    {
      filename: "work/cube.bin",
      bytes: 2067,
      lastChange: "2025-05-11T21:43:09.113Z",
    },
    {
      filename: "work/cube.json",
      bytes: 130520,
      lastChange: "2025-05-11T21:43:09.114Z",
    },
    {
      filename: "work/spline_animation_test_v04-SPLINES.json",
      bytes: 223521,
      lastChange: "2025-05-11T21:43:09.115Z",
    },
    {
      filename: "work/splines_anim4-SPLINES.json",
      bytes: 41076,
      lastChange: "2025-05-11T21:43:09.115Z",
    },
    {
      filename: "work/splines_anim5-SPLINES.json",
      bytes: 41052,
      lastChange: "2025-05-11T21:43:09.115Z",
    },
    {
      filename: "work/swirlSplines-SPLINES.json",
      bytes: 54038,
      lastChange: "2025-05-11T21:43:09.116Z",
    },
    {
      filename: "work/swirl_12-SPLINES.json",
      bytes: 510918,
      lastChange: "2025-05-11T21:43:09.118Z",
    },
  ]),
  (window.UIL_ASSETS_TEXTURES = [
    {
      filename: "_lighting/arealights.json",
      bytes: 307348,
      lastChange: "2025-05-11T21:43:09.119Z",
    },
    {
      filename: "_lightvolume/light-mask.jpg",
      bytes: 5236,
      lastChange: "2025-05-11T21:43:09.120Z",
    },
    {
      filename: "_lightvolume/light.jpg",
      bytes: 17350,
      lastChange: "2025-05-11T21:43:09.120Z",
    },
    {
      filename: "_scenelayout/black.jpg",
      bytes: 1129,
      lastChange: "2025-05-11T21:43:09.120Z",
    },
    {
      filename: "_scenelayout/empty_mro.jpg",
      bytes: 1110,
      lastChange: "2025-05-11T21:43:09.120Z",
    },
    {
      filename: "_scenelayout/empty_mro.ktx2",
      bytes: 492,
      lastChange: "2025-05-11T21:43:09.120Z",
    },
    {
      filename: "_scenelayout/empty_normal.ktx2",
      bytes: 493,
      lastChange: "2025-05-11T21:43:09.120Z",
    },
    {
      filename: "_scenelayout/empty_normal.png",
      bytes: 95,
      lastChange: "2025-05-11T21:43:09.120Z",
    },
    {
      filename: "_scenelayout/invert.cube",
      bytes: 288,
      lastChange: "2025-05-11T21:43:09.120Z",
    },
    {
      filename: "_scenelayout/mask.jpg",
      bytes: 1129,
      lastChange: "2025-05-11T21:43:09.120Z",
    },
    {
      filename: "_scenelayout/uv.jpg",
      bytes: 17100,
      lastChange: "2025-05-11T21:43:09.121Z",
    },
    {
      filename: "_temp/Star 2.png",
      bytes: 442,
      lastChange: "2025-05-11T21:43:09.121Z",
    },
    {
      filename: "_temp/arrow.png",
      bytes: 697,
      lastChange: "2025-05-11T21:43:09.121Z",
    },
    {
      filename: "_temp/contact.jpg",
      bytes: 639238,
      lastChange: "2025-05-11T21:43:09.123Z",
    },
    {
      filename: "_temp/globe.png",
      bytes: 293996,
      lastChange: "2025-05-11T21:43:09.125Z",
    },
    {
      filename: "_temp/star.png",
      bytes: 790,
      lastChange: "2025-05-11T21:43:09.125Z",
    },
    {
      filename: "lab.jpg",
      bytes: 179503,
      lastChange: "2025-05-11T21:43:09.126Z",
    },
    {
      filename: "particle/matcap3.ktx2",
      bytes: 1951,
      lastChange: "2025-05-11T21:43:09.126Z",
    },
    {
      filename: "particle/matcap3.png",
      bytes: 6734,
      lastChange: "2025-05-11T21:43:09.126Z",
    },
    {
      filename: "pbr/alien_cracked_2_basecolor.ktx2",
      bytes: 55172,
      lastChange: "2025-05-11T21:43:09.127Z",
    },
    {
      filename: "pbr/alien_cracked_2_basecolor.png",
      bytes: 239528,
      lastChange: "2025-05-11T21:43:09.127Z",
    },
    {
      filename: "pbr/alien_cracked_2_mro.png",
      bytes: 223502,
      lastChange: "2025-05-11T21:43:09.128Z",
    },
    {
      filename: "pbr/alien_cracked_2_normal.png",
      bytes: 251872,
      lastChange: "2025-05-11T21:43:09.128Z",
    },
    {
      filename: "pbr/black.png",
      bytes: 82,
      lastChange: "2025-05-11T21:43:09.128Z",
    },
    {
      filename: "pbr/cargo_mro.png",
      bytes: 142067,
      lastChange: "2025-05-11T21:43:09.129Z",
    },
    {
      filename: "pbr/cargo_normal.png",
      bytes: 137308,
      lastChange: "2025-05-11T21:43:09.129Z",
    },
    {
      filename: "pbr/cliffs_BaseColor.png",
      bytes: 232168,
      lastChange: "2025-05-11T21:43:09.130Z",
    },
    {
      filename: "pbr/cliffs_MRO.ktx2",
      bytes: 40978,
      lastChange: "2025-05-11T21:43:09.130Z",
    },
    {
      filename: "pbr/cliffs_MRO.png",
      bytes: 186154,
      lastChange: "2025-05-11T21:43:09.131Z",
    },
    {
      filename: "pbr/cliffs_Normal.png",
      bytes: 208758,
      lastChange: "2025-05-11T21:43:09.131Z",
    },
    {
      filename: "pbr/clovers_BaseColor.png",
      bytes: 249856,
      lastChange: "2025-05-11T21:43:09.132Z",
    },
    {
      filename: "pbr/clovers_MRO.png",
      bytes: 202798,
      lastChange: "2025-05-11T21:43:09.132Z",
    },
    {
      filename: "pbr/clovers_Normal.png",
      bytes: 258195,
      lastChange: "2025-05-11T21:43:09.133Z",
    },
    {
      filename: "pbr/corsica_beach-diffuse-RGBM.png",
      bytes: 90672,
      lastChange: "2025-05-11T21:43:09.133Z",
    },
    {
      filename: "pbr/corsica_beach-specular-RGBM.png",
      bytes: 732570,
      lastChange: "2025-05-11T21:43:09.135Z",
    },
    {
      filename: "pbr/cracked_ice_basecolor.ktx2",
      bytes: 51750,
      lastChange: "2025-05-11T21:43:09.135Z",
    },
    {
      filename: "pbr/cracked_ice_basecolor.png",
      bytes: 223486,
      lastChange: "2025-05-11T21:43:09.136Z",
    },
    {
      filename: "pbr/cracked_ice_mro.png",
      bytes: 177606,
      lastChange: "2025-05-11T21:43:09.136Z",
    },
    {
      filename: "pbr/cracked_ice_normal.png",
      bytes: 175958,
      lastChange: "2025-05-11T21:43:09.136Z",
    },
    {
      filename: "pbr/damaged_road_basecolor.png",
      bytes: 203669,
      lastChange: "2025-05-11T21:43:09.137Z",
    },
    {
      filename: "pbr/damaged_road_mro.ktx2",
      bytes: 51105,
      lastChange: "2025-05-11T21:43:09.137Z",
    },
    {
      filename: "pbr/damaged_road_mro.png",
      bytes: 233703,
      lastChange: "2025-05-11T21:43:09.138Z",
    },
    {
      filename: "pbr/damaged_road_normal.ktx2",
      bytes: 44387,
      lastChange: "2025-05-11T21:43:09.138Z",
    },
    {
      filename: "pbr/damaged_road_normal.png",
      bytes: 2082201,
      lastChange: "2025-05-11T21:43:09.148Z",
    },
    {
      filename: "pbr/damaged_road_roughness.jpg",
      bytes: 76284,
      lastChange: "2025-05-11T21:43:09.148Z",
    },
    {
      filename: "pbr/desert_bedrock_basecolor.png",
      bytes: 238535,
      lastChange: "2025-05-11T21:43:09.149Z",
    },
    {
      filename: "pbr/desert_bedrock_mro.png",
      bytes: 232044,
      lastChange: "2025-05-11T21:43:09.149Z",
    },
    {
      filename: "pbr/desert_bedrock_normal.png",
      bytes: 229622,
      lastChange: "2025-05-11T21:43:09.150Z",
    },
    {
      filename: "pbr/dune_BaseColor.png",
      bytes: 240977,
      lastChange: "2025-05-11T21:43:09.150Z",
    },
    {
      filename: "pbr/dune_MRO.png",
      bytes: 179187,
      lastChange: "2025-05-11T21:43:09.151Z",
    },
    {
      filename: "pbr/dune_Normal.png",
      bytes: 218905,
      lastChange: "2025-05-11T21:43:09.151Z",
    },
    {
      filename: "pbr/gold_leaf_basecolor.png",
      bytes: 183040,
      lastChange: "2025-05-11T21:43:09.152Z",
    },
    {
      filename: "pbr/gold_leaf_mro.png",
      bytes: 8012,
      lastChange: "2025-05-11T21:43:09.152Z",
    },
    {
      filename: "pbr/gold_leaf_normal.png",
      bytes: 424192,
      lastChange: "2025-05-11T21:43:09.154Z",
    },
    {
      filename: "pbr/gold_leaf_normal.png.out",
      bytes: 0,
      lastChange: "2025-05-11T21:43:09.154Z",
    },
    {
      filename: "pbr/gold_ore_basecolor.png",
      bytes: 643561,
      lastChange: "2025-05-11T21:43:09.157Z",
    },
    {
      filename: "pbr/gold_ore_mro.png",
      bytes: 544875,
      lastChange: "2025-05-11T21:43:09.159Z",
    },
    {
      filename: "pbr/gold_ore_normal.png",
      bytes: 654667,
      lastChange: "2025-05-11T21:43:09.160Z",
    },
    {
      filename: "pbr/grey.png",
      bytes: 70,
      lastChange: "2025-05-11T21:43:09.160Z",
    },
    {
      filename: "pbr/heatshield_BaseColor.png",
      bytes: 422118,
      lastChange: "2025-05-11T21:43:09.163Z",
    },
    {
      filename: "pbr/heatshield_MRO.png",
      bytes: 256069,
      lastChange: "2025-05-11T21:43:09.164Z",
    },
    {
      filename: "pbr/heatshield_Normal.png",
      bytes: 205978,
      lastChange: "2025-05-11T21:43:09.165Z",
    },
    {
      filename: "pbr/jungle_soil_basecolor.png",
      bytes: 482615,
      lastChange: "2025-05-11T21:43:09.168Z",
    },
    {
      filename: "pbr/jungle_soil_mro.png",
      bytes: 567617,
      lastChange: "2025-05-11T21:43:09.170Z",
    },
    {
      filename: "pbr/jungle_soil_normal.ktx2",
      bytes: 54644,
      lastChange: "2025-05-11T21:43:09.170Z",
    },
    {
      filename: "pbr/jungle_soil_normal.png",
      bytes: 571380,
      lastChange: "2025-05-11T21:43:09.171Z",
    },
    {
      filename: "pbr/lut.png",
      bytes: 16623,
      lastChange: "2025-05-11T21:43:09.172Z",
    },
    {
      filename: "pbr/maple_parquet_basecolor.png",
      bytes: 455585,
      lastChange: "2025-05-11T21:43:09.174Z",
    },
    {
      filename: "pbr/maple_parquet_mro.png",
      bytes: 342840,
      lastChange: "2025-05-11T21:43:09.176Z",
    },
    {
      filename: "pbr/maple_parquet_normal.png",
      bytes: 307514,
      lastChange: "2025-05-11T21:43:09.178Z",
    },
    {
      filename: "pbr/mud_basecolor.png",
      bytes: 456327,
      lastChange: "2025-05-11T21:43:09.180Z",
    },
    {
      filename: "pbr/mud_mro.png",
      bytes: 304742,
      lastChange: "2025-05-11T21:43:09.182Z",
    },
    {
      filename: "pbr/mud_normal.png",
      bytes: 625607,
      lastChange: "2025-05-11T21:43:09.183Z",
    },
    {
      filename: "pbr/paddedfabric_BaseColor.png",
      bytes: 227230,
      lastChange: "2025-05-11T21:43:09.185Z",
    },
    {
      filename: "pbr/paddedfabric_MRO.png",
      bytes: 234588,
      lastChange: "2025-05-11T21:43:09.186Z",
    },
    {
      filename: "pbr/paddedfabric_Normal.png",
      bytes: 375760,
      lastChange: "2025-05-11T21:43:09.188Z",
    },
    {
      filename: "pbr/spacepanel_BaseColor.png",
      bytes: 414971,
      lastChange: "2025-05-11T21:43:09.191Z",
    },
    {
      filename: "pbr/spacepanel_MRO.png",
      bytes: 374776,
      lastChange: "2025-05-11T21:43:09.192Z",
    },
    {
      filename: "pbr/spacepanel_Normal.png",
      bytes: 188130,
      lastChange: "2025-05-11T21:43:09.193Z",
    },
    {
      filename: "pbr/spacetiles_BaseColor.png",
      bytes: 386128,
      lastChange: "2025-05-11T21:43:09.195Z",
    },
    {
      filename: "pbr/spacetiles_MRO.png",
      bytes: 293440,
      lastChange: "2025-05-11T21:43:09.197Z",
    },
    {
      filename: "pbr/spacetiles_Normal.png",
      bytes: 239662,
      lastChange: "2025-05-11T21:43:09.199Z",
    },
    {
      filename: "pbr/stylized_grass_BaseColor.png",
      bytes: 372121,
      lastChange: "2025-05-11T21:43:09.201Z",
    },
    {
      filename: "pbr/stylized_grass_MRO.png",
      bytes: 159043,
      lastChange: "2025-05-11T21:43:09.202Z",
    },
    {
      filename: "pbr/stylized_grass_Normal.png",
      bytes: 297734,
      lastChange: "2025-05-11T21:43:09.203Z",
    },
    {
      filename: "pbr/teracotta_basecolor.png",
      bytes: 415564,
      lastChange: "2025-05-11T21:43:09.206Z",
    },
    {
      filename: "pbr/teracotta_mro.png",
      bytes: 351049,
      lastChange: "2025-05-11T21:43:09.208Z",
    },
    {
      filename: "pbr/teracotta_normal.png",
      bytes: 406126,
      lastChange: "2025-05-11T21:43:09.210Z",
    },
    {
      filename: "pbr/tomoco_2-diffuse-sRGB.png",
      bytes: 1996,
      lastChange: "2025-05-11T21:43:09.210Z",
    },
    {
      filename: "pbr/tomoco_2-specular-sRGB.png",
      bytes: 67278,
      lastChange: "2025-05-11T21:43:09.210Z",
    },
    {
      filename: "pbr/tomoco_studio-diffuse-RGBM.png",
      bytes: 3613,
      lastChange: "2025-05-11T21:43:09.210Z",
    },
    {
      filename: "pbr/tomoco_studio-specular-RGBM.png",
      bytes: 93991,
      lastChange: "2025-05-11T21:43:09.211Z",
    },
    {
      filename: "pbr/wet_paint_basecolor.png",
      bytes: 90754,
      lastChange: "2025-05-11T21:43:09.212Z",
    },
    {
      filename: "pbr/wet_paint_mro.png",
      bytes: 174228,
      lastChange: "2025-05-11T21:43:09.213Z",
    },
    {
      filename: "pbr/wet_paint_normal.png",
      bytes: 366403,
      lastChange: "2025-05-11T21:43:09.215Z",
    },
    {
      filename: "pbr/wood_parquet_basecolor.png",
      bytes: 601896,
      lastChange: "2025-05-11T21:43:09.218Z",
    },
    {
      filename: "pbr/wood_parquet_mro.png",
      bytes: 200927,
      lastChange: "2025-05-11T21:43:09.219Z",
    },
    {
      filename: "pbr/wood_parquet_normal.png",
      bytes: 324009,
      lastChange: "2025-05-11T21:43:09.221Z",
    },
    {
      filename: "pbr/woodplanks_basecolor.png",
      bytes: 336445,
      lastChange: "2025-05-11T21:43:09.223Z",
    },
    {
      filename: "pbr/woodplanks_mro.png",
      bytes: 351315,
      lastChange: "2025-05-11T21:43:09.225Z",
    },
    {
      filename: "pbr/woodplanks_normal.ktx2",
      bytes: 39899,
      lastChange: "2025-05-11T21:43:09.225Z",
    },
    {
      filename: "pbr/woodplanks_normal.png",
      bytes: 316381,
      lastChange: "2025-05-11T21:43:09.226Z",
    },
    {
      filename: "room/1234.ktx2",
      bytes: 77280,
      lastChange: "2025-05-11T21:43:09.227Z",
    },
    {
      filename: "room/1234.png",
      bytes: 585845,
      lastChange: "2025-05-11T21:43:09.228Z",
    },
    {
      filename: "room/Landscape_default_Basecolor.jpg",
      bytes: 525754,
      lastChange: "2025-05-11T21:43:09.229Z",
    },
    {
      filename: "room/Landscape_default_Basecolor.ktx2",
      bytes: 168665,
      lastChange: "2025-05-11T21:43:09.230Z",
    },
    {
      filename: "room/Landscape_default_MRO.jpg",
      bytes: 254829,
      lastChange: "2025-05-11T21:43:09.230Z",
    },
    {
      filename: "room/Landscape_default_MRO.ktx2",
      bytes: 150616,
      lastChange: "2025-05-11T21:43:09.231Z",
    },
    {
      filename: "room/Landscape_default_Normal.jpg",
      bytes: 496544,
      lastChange: "2025-05-11T21:43:09.232Z",
    },
    {
      filename: "room/Landscape_default_Normal.ktx2",
      bytes: 169600,
      lastChange: "2025-05-11T21:43:09.233Z",
    },
    {
      filename: "room/caustic.jpg",
      bytes: 114975,
      lastChange: "2025-05-11T21:43:09.233Z",
    },
    {
      filename: "room/concrete-polished-normal.jpg",
      bytes: 14094,
      lastChange: "2025-05-11T21:43:09.233Z",
    },
    {
      filename: "room/concrete-polished-normal.ktx2",
      bytes: 3861,
      lastChange: "2025-05-11T21:43:09.233Z",
    },
    {
      filename: "room/concrete_light_mro.jpg",
      bytes: 147650,
      lastChange: "2025-05-11T21:43:09.233Z",
    },
    {
      filename: "room/concrete_light_mro.ktx2",
      bytes: 30851,
      lastChange: "2025-05-11T21:43:09.234Z",
    },
    {
      filename: "room/damaged_road_normal.jpg",
      bytes: 219612,
      lastChange: "2025-05-11T21:43:09.234Z",
    },
    {
      filename: "room/floor-lightbounce.jpg",
      bytes: 11996,
      lastChange: "2025-05-11T21:43:09.234Z",
    },
    {
      filename: "room/floor-lightbounce.ktx2",
      bytes: 13045,
      lastChange: "2025-05-11T21:43:09.235Z",
    },
    {
      filename: "room/floor_DefaultMaterial_MRO.png",
      bytes: 16903,
      lastChange: "2025-05-11T21:43:09.235Z",
    },
    {
      filename: "room/floor_DefaultMaterial_Normal.png",
      bytes: 1671655,
      lastChange: "2025-05-11T21:43:09.237Z",
    },
    {
      filename: "room/floor_diffuse.jpg",
      bytes: 189007,
      lastChange: "2025-05-11T21:43:09.238Z",
    },
    {
      filename: "room/floor_lightmap.jpg",
      bytes: 149858,
      lastChange: "2025-05-11T21:43:09.238Z",
    },
    {
      filename: "room/floor_lightmap_bw.jpg",
      bytes: 241016,
      lastChange: "2025-05-11T21:43:09.239Z",
    },
    {
      filename: "room/floor_lightmap_bw2.jpg",
      bytes: 157668,
      lastChange: "2025-05-11T21:43:09.240Z",
    },
    {
      filename: "room/land_lightmap_bw.jpg",
      bytes: 242943,
      lastChange: "2025-05-11T21:43:09.240Z",
    },
    {
      filename: "room/landscape_lightmap.jpg",
      bytes: 64051,
      lastChange: "2025-05-11T21:43:09.240Z",
    },
    {
      filename: "room/landscape_lightmap2.jpg",
      bytes: 225561,
      lastChange: "2025-05-11T21:43:09.241Z",
    },
    {
      filename: "room/matcap-test.jpg",
      bytes: 51288,
      lastChange: "2025-05-11T21:43:09.241Z",
    },
    {
      filename: "room/matcap-test.ktx2",
      bytes: 44610,
      lastChange: "2025-05-11T21:43:09.241Z",
    },
    {
      filename: "room/matcap.jpg",
      bytes: 6517,
      lastChange: "2025-05-11T21:43:09.241Z",
    },
    {
      filename: "room/pano-ATv6-1700435330543-diffuse-sRGB.ktx2",
      bytes: 1905,
      lastChange: "2025-05-11T21:43:09.241Z",
    },
    {
      filename: "room/pano-ATv6-1700435330543-diffuse-sRGB.png",
      bytes: 6782,
      lastChange: "2025-05-11T21:43:09.242Z",
    },
    {
      filename: "room/pano-ATv6-1700435330543-specular-sRGB.png",
      bytes: 77951,
      lastChange: "2025-05-11T21:43:09.242Z",
    },
    {
      filename: "room/pano-ATv6-1700435330543.jpg",
      bytes: 37436,
      lastChange: "2025-05-11T21:43:09.242Z",
    },
    {
      filename: "room/pano-ATv6-1700435330543.ktx2",
      bytes: 26680,
      lastChange: "2025-05-11T21:43:09.243Z",
    },
    {
      filename: "room/prop_lightmap.jpg",
      bytes: 73853,
      lastChange: "2025-05-11T21:43:09.243Z",
    },
    {
      filename: "room/prop_lightmap.ktx2",
      bytes: 32813,
      lastChange: "2025-05-11T21:43:09.243Z",
    },
    {
      filename: "room/room_AO.jpg",
      bytes: 138730,
      lastChange: "2025-05-11T21:43:09.243Z",
    },
    {
      filename: "room/room_combined.jpg",
      bytes: 241713,
      lastChange: "2025-05-11T21:43:09.245Z",
    },
    {
      filename: "room/room_combined.ktx2",
      bytes: 157955,
      lastChange: "2025-05-11T21:43:09.245Z",
    },
    {
      filename: "room/room_lightmap_bw.jpg",
      bytes: 258637,
      lastChange: "2025-05-11T21:43:09.246Z",
    },
    {
      filename: "room/tomoco_studio-diffuse-sRGB.ktx2",
      bytes: 5328,
      lastChange: "2025-05-11T21:43:09.246Z",
    },
    {
      filename: "room/tomoco_studio-diffuse-sRGB.png",
      bytes: 37012,
      lastChange: "2025-05-11T21:43:09.246Z",
    },
    {
      filename: "room/tomoco_studio-specular-RGBM.ktx2",
      bytes: 99008,
      lastChange: "2025-05-11T21:43:09.247Z",
    },
    {
      filename: "room/tomoco_studio-specular-RGBM.png",
      bytes: 811559,
      lastChange: "2025-05-11T21:43:09.248Z",
    },
    {
      filename: "room/wall-bouncelight.jpg",
      bytes: 12054,
      lastChange: "2025-05-11T21:43:09.248Z",
    },
    {
      filename: "room/wall-bouncelight.ktx2",
      bytes: 14297,
      lastChange: "2025-05-11T21:43:09.248Z",
    },
    {
      filename: "room/walls_default_MRO.png",
      bytes: 3351861,
      lastChange: "2025-05-11T21:43:09.253Z",
    },
    {
      filename: "room/walls_diffuse.jpg",
      bytes: 137675,
      lastChange: "2025-05-11T21:43:09.253Z",
    },
    {
      filename: "room/walls_lightmap.jpg",
      bytes: 324921,
      lastChange: "2025-05-11T21:43:09.254Z",
    },
    {
      filename: "tree_room/4141-normal.jpg",
      bytes: 170168,
      lastChange: "2025-05-11T21:43:09.255Z",
    },
    {
      filename: "tree_room/4141-normal.ktx2",
      bytes: 62662,
      lastChange: "2025-05-11T21:43:09.255Z",
    },
    {
      filename: "tree_room/CABLES___CyclesBake_COMBINED.jpg",
      bytes: 209206,
      lastChange: "2025-05-11T21:43:09.256Z",
    },
    {
      filename: "tree_room/CABLES___CyclesBake_COMBINED.ktx2",
      bytes: 100626,
      lastChange: "2025-05-11T21:43:09.256Z",
    },
    {
      filename: "tree_room/CABLES___PBR_AT_MRO.jpg",
      bytes: 78098,
      lastChange: "2025-05-11T21:43:09.257Z",
    },
    {
      filename: "tree_room/CABLES___PBR_AT_MRO.ktx2",
      bytes: 28218,
      lastChange: "2025-05-11T21:43:09.257Z",
    },
    {
      filename: "tree_room/CABLES___PBR_Normal.jpg",
      bytes: 465819,
      lastChange: "2025-05-11T21:43:09.259Z",
    },
    {
      filename: "tree_room/CABLES___PBR_Normal.ktx2",
      bytes: 131543,
      lastChange: "2025-05-11T21:43:09.259Z",
    },
    {
      filename: "tree_room/PILLARS___CyclesBake_COMBINED.jpg",
      bytes: 61535,
      lastChange: "2025-05-11T21:43:09.260Z",
    },
    {
      filename: "tree_room/PILLARS___CyclesBake_COMBINED.ktx2",
      bytes: 48879,
      lastChange: "2025-05-11T21:43:09.260Z",
    },
    {
      filename: "tree_room/PILLARS___PBR_AT_MRO.jpg",
      bytes: 178004,
      lastChange: "2025-05-11T21:43:09.261Z",
    },
    {
      filename: "tree_room/PILLARS___PBR_AT_MRO.ktx2",
      bytes: 67994,
      lastChange: "2025-05-11T21:43:09.261Z",
    },
    {
      filename: "tree_room/PILLARS___PBR_Normal.jpg",
      bytes: 257549,
      lastChange: "2025-05-11T21:43:09.263Z",
    },
    {
      filename: "tree_room/PILLARS___PBR_Normal.ktx2",
      bytes: 79488,
      lastChange: "2025-05-11T21:43:09.263Z",
    },
    {
      filename: "tree_room/ROCKY_SOIL___CyclesBake_COMBINED.jpg",
      bytes: 62986,
      lastChange: "2025-05-11T21:43:09.263Z",
    },
    {
      filename: "tree_room/ROCKY_SOIL___CyclesBake_COMBINED.ktx2",
      bytes: 38157,
      lastChange: "2025-05-11T21:43:09.264Z",
    },
    {
      filename: "tree_room/ROCKY_SOIL___PBR_AT_MRO.jpg",
      bytes: 216252,
      lastChange: "2025-05-11T21:43:09.265Z",
    },
    {
      filename: "tree_room/ROCKY_SOIL___PBR_AT_MRO.ktx2",
      bytes: 62877,
      lastChange: "2025-05-11T21:43:09.265Z",
    },
    {
      filename: "tree_room/ROCKY_SOIL___PBR_Normal.jpg",
      bytes: 1058996,
      lastChange: "2025-05-11T21:43:09.268Z",
    },
    {
      filename: "tree_room/ROCKY_SOIL___PBR_Normal.ktx2",
      bytes: 174547,
      lastChange: "2025-05-11T21:43:09.269Z",
    },
    {
      filename: "tree_room/ROCK_L___CyclesBake_COMBINED.jpg",
      bytes: 42346,
      lastChange: "2025-05-11T21:43:09.269Z",
    },
    {
      filename: "tree_room/ROCK_L___CyclesBake_COMBINED.ktx2",
      bytes: 27408,
      lastChange: "2025-05-11T21:43:09.269Z",
    },
    {
      filename: "tree_room/ROCK_L___PBR_AT_MRO.jpg",
      bytes: 135135,
      lastChange: "2025-05-11T21:43:09.270Z",
    },
    {
      filename: "tree_room/ROCK_L___PBR_AT_MRO.ktx2",
      bytes: 48823,
      lastChange: "2025-05-11T21:43:09.270Z",
    },
    {
      filename: "tree_room/ROCK_L___PBR_Normal.jpg",
      bytes: 613631,
      lastChange: "2025-05-11T21:43:09.273Z",
    },
    {
      filename: "tree_room/ROCK_L___PBR_Normal.ktx2",
      bytes: 138030,
      lastChange: "2025-05-11T21:43:09.273Z",
    },
    {
      filename: "tree_room/ROCK_R___CyclesBake_COMBINED.jpg",
      bytes: 85092,
      lastChange: "2025-05-11T21:43:09.274Z",
    },
    {
      filename: "tree_room/ROCK_R___CyclesBake_COMBINED.ktx2",
      bytes: 50354,
      lastChange: "2025-05-11T21:43:09.274Z",
    },
    {
      filename: "tree_room/ROCK_R___PBR_AT_MRO.jpg",
      bytes: 141576,
      lastChange: "2025-05-11T21:43:09.275Z",
    },
    {
      filename: "tree_room/ROCK_R___PBR_AT_MRO.ktx2",
      bytes: 44004,
      lastChange: "2025-05-11T21:43:09.275Z",
    },
    {
      filename: "tree_room/ROCK_R___PBR_Normal.jpg",
      bytes: 570241,
      lastChange: "2025-05-11T21:43:09.277Z",
    },
    {
      filename: "tree_room/ROCK_R___PBR_Normal.ktx2",
      bytes: 162237,
      lastChange: "2025-05-11T21:43:09.278Z",
    },
    {
      filename: "tree_room/SAND___CyclesBake_COMBINED.jpg",
      bytes: 68097,
      lastChange: "2025-05-11T21:43:09.278Z",
    },
    {
      filename: "tree_room/SAND___CyclesBake_COMBINED.ktx2",
      bytes: 48609,
      lastChange: "2025-05-11T21:43:09.278Z",
    },
    {
      filename: "tree_room/SAND___PBR_AT_MRO.jpg",
      bytes: 44115,
      lastChange: "2025-05-11T21:43:09.279Z",
    },
    {
      filename: "tree_room/SAND___PBR_AT_MRO.ktx2",
      bytes: 19974,
      lastChange: "2025-05-11T21:43:09.279Z",
    },
    {
      filename: "tree_room/SAND___PBR_Normal.jpg",
      bytes: 466738,
      lastChange: "2025-05-11T21:43:09.281Z",
    },
    {
      filename: "tree_room/SAND___PBR_Normal.ktx2",
      bytes: 126734,
      lastChange: "2025-05-11T21:43:09.281Z",
    },
    {
      filename: "tree_room/STRUCTURE___CyclesBake_COMBINED.jpg",
      bytes: 276219,
      lastChange: "2025-05-11T21:43:09.282Z",
    },
    {
      filename: "tree_room/STRUCTURE___CyclesBake_COMBINED.ktx2",
      bytes: 128224,
      lastChange: "2025-05-11T21:43:09.283Z",
    },
    {
      filename: "tree_room/STRUCTURE___PBR_AT_MRO.jpg",
      bytes: 370630,
      lastChange: "2025-05-11T21:43:09.285Z",
    },
    {
      filename: "tree_room/STRUCTURE___PBR_AT_MRO.ktx2",
      bytes: 106212,
      lastChange: "2025-05-11T21:43:09.285Z",
    },
    {
      filename: "tree_room/STRUCTURE___PBR_Normal.jpg",
      bytes: 95808,
      lastChange: "2025-05-11T21:43:09.286Z",
    },
    {
      filename: "tree_room/STRUCTURE___PBR_Normal.ktx2",
      bytes: 45357,
      lastChange: "2025-05-11T21:43:09.286Z",
    },
    {
      filename: "tree_room/TREE___CyclesBake_COMBINED.jpg",
      bytes: 13416,
      lastChange: "2025-05-11T21:43:09.286Z",
    },
    {
      filename: "tree_room/TREE___PBR_Normal.jpg",
      bytes: 14144,
      lastChange: "2025-05-11T21:43:09.287Z",
    },
    {
      filename: "tree_room/TREE_leaves___CyclesBake_COMBINED.jpg",
      bytes: 700192,
      lastChange: "2025-05-11T21:43:09.288Z",
    },
    {
      filename: "tree_room/TREE_leaves___PBR_AT_MRO.jpg",
      bytes: 1020148,
      lastChange: "2025-05-11T21:43:09.291Z",
    },
    {
      filename: "tree_room/TREE_leaves___PBR_Alpha.jpg",
      bytes: 785473,
      lastChange: "2025-05-11T21:43:09.294Z",
    },
    {
      filename: "tree_room/TREE_trunk_branches___CyclesBake_COMBINED.jpg",
      bytes: 366174,
      lastChange: "2025-05-11T21:43:09.296Z",
    },
    {
      filename: "tree_room/TREE_trunk_branches___PBR_AT_MRO.jpg",
      bytes: 1078760,
      lastChange: "2025-05-11T21:43:09.298Z",
    },
    {
      filename: "tree_room/WALLS_CEILING___CyclesBake_COMBINED.jpg",
      bytes: 95813,
      lastChange: "2025-05-11T21:43:09.298Z",
    },
    {
      filename: "tree_room/WALLS_CEILING___CyclesBake_COMBINED.ktx2",
      bytes: 57497,
      lastChange: "2025-05-11T21:43:09.298Z",
    },
    {
      filename: "tree_room/WALLS_CEILING___PBR_AT_MRO.jpg",
      bytes: 20199,
      lastChange: "2025-05-11T21:43:09.299Z",
    },
    {
      filename: "tree_room/WALLS_CEILING___PBR_AT_MRO.ktx2",
      bytes: 2578,
      lastChange: "2025-05-11T21:43:09.299Z",
    },
    {
      filename: "tree_room/WALLS_CEILING___PBR_Normal.jpg",
      bytes: 84456,
      lastChange: "2025-05-11T21:43:09.299Z",
    },
    {
      filename: "tree_room/WALLS_CEILING___PBR_Normal.ktx2",
      bytes: 32846,
      lastChange: "2025-05-11T21:43:09.299Z",
    },
    {
      filename: "tree_room/blck.jpg",
      bytes: 1131,
      lastChange: "2025-05-11T21:43:09.299Z",
    },
    {
      filename: "tree_room/matcap_tree_room.jpg",
      bytes: 90331,
      lastChange: "2025-05-11T21:43:09.300Z",
    },
    {
      filename: "tree_room/matcap_tree_room.png",
      bytes: 465123,
      lastChange: "2025-05-11T21:43:09.301Z",
    },
    {
      filename: "tree_room/waternormals.jpg",
      bytes: 26768,
      lastChange: "2025-05-11T21:43:09.301Z",
    },
    {
      filename: "ui/arrow.png",
      bytes: 697,
      lastChange: "2025-05-11T21:43:09.301Z",
    },
    {
      filename: "ui/at-labrds.jpg",
      bytes: 12913,
      lastChange: "2025-05-11T21:43:09.301Z",
    },
    {
      filename: "ui/close.svg",
      bytes: 766,
      lastChange: "2025-05-11T21:43:09.301Z",
    },
    {
      filename: "ui/fb.png",
      bytes: 330,
      lastChange: "2025-05-11T21:43:09.301Z",
    },
    {
      filename: "ui/globe.png",
      bytes: 128953,
      lastChange: "2025-05-11T21:43:09.302Z",
    },
    {
      filename: "ui/ig.png",
      bytes: 5024,
      lastChange: "2025-05-11T21:43:09.302Z",
    },
    {
      filename: "ui/in.png",
      bytes: 2886,
      lastChange: "2025-05-11T21:43:09.302Z",
    },
    {
      filename: "ui/star.png",
      bytes: 790,
      lastChange: "2025-05-11T21:43:09.302Z",
    },
    {
      filename: "ui/tw.png",
      bytes: 4965,
      lastChange: "2025-05-11T21:43:09.302Z",
    },
    {
      filename: "unsupported-bg.jpg",
      bytes: 196572,
      lastChange: "2025-05-11T21:43:09.303Z",
    },
    {
      filename: "work/env1.jpg",
      bytes: 21655,
      lastChange: "2025-05-11T21:43:09.303Z",
    },
    {
      filename: "work/env1.ktx2",
      bytes: 21416,
      lastChange: "2025-05-11T21:43:09.303Z",
    },
    {
      filename: "work/ewnv0.jpg",
      bytes: 33874,
      lastChange: "2025-05-11T21:43:09.304Z",
    },
    {
      filename: "work/frostednormal.jpg",
      bytes: 12487,
      lastChange: "2025-05-11T21:43:09.304Z",
    },
    {
      filename: "work/frostednormal.png",
      bytes: 1268607,
      lastChange: "2025-05-11T21:43:09.306Z",
    },
    {
      filename: "work/test.jpg",
      bytes: 48571,
      lastChange: "2025-05-11T21:43:09.306Z",
    },
    {
      filename: "work/test.ktx2",
      bytes: 22568,
      lastChange: "2025-05-11T21:43:09.306Z",
    },
  ]),
  Class(function Antimatter(
    _num,
    _config,
    _renderer = World.RENDERER,
    _pointData = null,
  ) {
    Inherit(this, AntimatterFBO);
    var _geometry,
      _this = this,
      _drawLimit = _num,
      _size = (function findSize() {
        return _config.pot
          ? Math.pow(2, Math.ceil(Math.log(Math.sqrt(_num)) / Math.log(2)))
          : Math.ceil(Math.sqrt(_num));
      })();
    async function createBuffer() {
      let {
        geometry: geometry,
        vertices: vertices,
        attribs: attribs,
        usedDepth: usedDepth,
      } = await AntimatterUtil.createBufferArray(
        _size,
        _num,
        _config,
        _pointData,
      );
      ((_this.vertices = _this.cloneVertices ? vertices.clone() : vertices),
        ((_geometry = geometry.clone(!0)).drawRange.end = _drawLimit),
        (_this.vertices.geometry = _geometry),
        (_this.attribs = _this.random = attribs),
        (_this.textureUsedDepth = usedDepth),
        _this.init(_geometry, _renderer, _size));
    }
    (defer(createBuffer),
      (this.createFloatArray = function (components = 3) {
        return new Float32Array(_size * _size * components);
      }),
      (this.createFloatArrayAsync = async function (components = 3, freshCopy) {
        let { array: array } = await AntimatterUtil.createFloatArray(
          _size * _size * components,
          freshCopy,
        );
        return array;
      }),
      (this.ready = function (callback) {
        return _this.wait(_this, "vertices");
      }),
      (this.useShader = function (vs, fs, params) {
        ("object" == typeof fs && ((params = fs), (fs = null)),
          (this.vertexShader = vs),
          (this.fragmentShader = fs || vs),
          (this.uniforms = params));
      }),
      (this.createMesh = this.getMesh =
        function () {
          let shader = _this.createShader(
            _this.fragmentShader || "AntimatterBasicFrag",
          );
          return (
            (_this.mesh = new Points(_geometry, shader)),
            (_this.mesh.frustumCulled = !1),
            (_this.shader = shader),
            (_this.geometry = _geometry),
            _this.mesh
          );
        }),
      (this.createShader = function (fs) {
        let uniforms = _this.uniforms || {};
        const nuke = (function findNuke() {
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
        })();
        _this._nuke = nuke;
        let obj = {
          tPos: { type: "t", value: _this.vertices.texture, ignoreUIL: !0 },
          tPrevPos: { type: "t", value: _this.vertices.texture, ignoreUIL: !0 },
          uDPR: { value: nuke?.dpr || 1, ignoreUIL: !0 },
        };
        for (let key in uniforms) obj[key] = uniforms[key];
        let shader = new Shader(
            _this.vertexShader || "AntimatterPosition",
            fs,
            obj,
          ),
          vs = shader.vertexShader;
        if (vs && !vs.includes("uniform sampler2D tPos")) {
          let split = vs.split("__ACTIVE_THEORY_LIGHTS__"),
            defined = "uniform sampler2D tPos;";
          shader.vertexShader =
            split[0] +
            "\n" +
            defined +
            "\n__ACTIVE_THEORY_LIGHTS__\n" +
            split[1];
        }
        return ((shader._parentnuke = nuke), shader);
      }),
      (this.getLookupArray = function () {
        return new Float32Array(
          _this.vertices.geometry.attributes.position.array,
        );
      }),
      (this.getRandomArray = function () {
        return _geometry.attributes.random.array;
      }),
      (this.overrideShader = function (original) {
        let shader = original.clone();
        ((shader._parentnuke = _this._nuke),
          original.copyUniformsTo(shader),
          (shader.uniforms.tPos = {
            type: "t",
            value: _this.vertices.texture,
            ignoreUIL: !0,
          }),
          (shader.uniforms.tPrevPos = {
            type: "t",
            value: _this.vertices.texture,
            ignoreUIL: !0,
          }),
          (shader.uniforms.uDPR = {
            value: shader?._parentnuke?.dpr || 1,
            ignoreUIL: !0,
          }),
          (_this.shader = shader),
          (_this.mesh.shader = shader));
      }),
      (this.upload = async function (needsMesh) {
        ((_this.preventRender = !0),
          (_geometry.distributeBufferData = !0),
          await _this.ready(),
          await _this.vertices.uploadAsync(),
          await defer(),
          await _this.random.uploadAsync(),
          await defer(),
          _this.mesh &&
            needsMesh &&
            (_this.mesh.upload(), await _geometry.uploadBuffersAsync()));
        for (let key in _this.shader.uniforms) {
          let uniform = _this.shader.uniforms[key];
          uniform.value &&
            (uniform.value.uploadAsync
              ? await uniform.value.uploadAsync()
              : uniform.value.upload &&
                (uniform.value.upload(), await defer()));
        }
        await _this.wait(100);
        for (let i = 0; i < _this.passes.length; i++)
          await _this.passes[i].upload();
        _this.preventRender = !1;
      }),
      (this.uploadSync = async function (needsMesh) {
        (await _this.ready(),
          _this.customClass &&
            _this.customClass.loaded &&
            (await _this.customClass.loaded()));
        for (let i = 0; i < 4; i++) _this.update();
      }),
      this.get("particleCount", (_) => _num),
      this.get("textureSize", (_) => _size),
      this.get("powerOf2", (_) =>
        Math.pow(2, Math.ceil(Math.log(Math.sqrt(_num)) / Math.log(2))),
      ));
  }),
  Class(function AntimatterAttribute(_data, _components) {
    Inherit(this, Component);
    var _this = this,
      _size = Math.sqrt(_data.length / (_components || 3));
    ((this.size = _size),
      (this.count = _size * _size),
      (this.buffer = _data),
      (this.texture = new DataTexture(
        _data,
        _size,
        _size,
        4 == _components ? Texture.RGBAFormat : Texture.RGBFormat,
        Texture.FLOAT,
      )),
      this.set("needsUpdate", function () {
        _this.texture && (_this.texture.needsUpdate = !0);
      }),
      (this.bufferData = function (data, components) {
        ((_this.buffer = data),
          components != _components
            ? (_this.texture.destroy(),
              (_this.texture = new DataTexture(
                data,
                _size,
                _size,
                4 == components ? Texture.RGBAFormat : Texture.RGBFormat,
                Texture.FLOAT,
              )))
            : ((_this.texture.data = data), (_this.texture.needsUpdate = !0)),
          (_components = components),
          (_data = data));
      }),
      (this.upload = function () {
        _this.texture.upload();
      }),
      (this.uploadAsync = function () {
        return (
          (_this.texture.distributeTextureData = !0),
          _this.texture.upload(),
          _this.texture.uploadAsync()
        );
      }),
      (this.clone = function () {
        return new AntimatterAttribute(_data, _components);
      }),
      (this.onDestroy = function () {
        _this.texture && _this.texture.destroy && _this.texture.destroy();
      }));
  }),
  Class(
    function AntimatterFBO() {
      var _this,
        _gpuGeom,
        _renderer,
        _size,
        _prevRT,
        _scene,
        _mesh,
        _camera,
        _copy,
        _geometry;
      Inherit(this, Component);
      var _output = { type: "t", value: null, ignoreUIL: !0 },
        _prevOutput = { type: "t", value: null, ignoreUIL: !0 };
      function copy(input, output) {
        World.RENDERER.blit(input, output) ||
          ((_copy.visible = !0),
          (_mesh.visible = !1),
          (_copy.shader.uniforms.tMap.value = input),
          _renderer.renderSingle(_copy, _camera, output),
          (_copy.visible = !1),
          (_mesh.visible = !0));
      }
      ((this.passes = []),
        (this.init = function (geometry, renderer, size) {
          ((_this = this),
            (_gpuGeom = geometry.attributes.position.array),
            (_renderer = renderer),
            (_size = size),
            (function initPasses() {
              ((_camera = World.CAMERA),
                (_geometry = World.QUAD),
                (_scene = new Scene()),
                ((_mesh = new Mesh(_geometry, null)).frustumCulled = !1),
                (_mesh.noMatrices = !0),
                (_mesh.transient = !0),
                _scene.add(_mesh));
              let copyShader = AntimatterFBO.getCopyShader();
              (((_copy = new Mesh(_geometry, copyShader)).noMatrices = !0),
                _scene.add(_copy),
                (_copy.visible = !1));
            })());
        }),
        (this.getGPUGeom = function () {
          return _gpuGeom;
        }),
        (this.addPass = function (pass, index) {
          ((_this = this),
            pass.init || pass.initialize(_size),
            "number" != typeof index
              ? _this.passes.push(pass)
              : _this.passes.splice(index, 0, pass));
        }),
        (this.findPass = function (name) {
          _this = this;
          for (var i = 0; i < _this.passes.length; i++) {
            var pass = _this.passes[i];
            if (pass.name == name) return pass;
          }
        }),
        (this.removePass = function (pass) {
          ((_this = this),
            "number" == typeof pass
              ? _this.passes.splice(pass)
              : _this.passes.remove(pass));
        }),
        (this.update = function () {
          if ((_this = this).mesh && !_this.preventRender) {
            var output = _output.value || _this.vertices.texture;
            _this.storeVelocity &&
              (_prevRT
                ? (copy(_output.value, _prevRT), (_prevOutput.value = _prevRT))
                : ((_prevOutput.value = output),
                  (_prevRT = _this.passes[0].getRT(0).clone()).upload()));
            for (var i = 0; i < _this.passes.length; i++) {
              var pass = _this.passes[i],
                needsInit = !pass.init,
                firstRender = !pass.first;
              (needsInit && pass.initialize(_size),
                (pass.first = !0),
                (_mesh.shader = pass.shader),
                (_mesh.shader.uniforms.tInput.value = firstRender
                  ? _this.vertices.texture
                  : pass.output),
                pass.ready ||
                  (_mesh.shader.uniforms.tInput.value =
                    _this.vertices.texture));
              var rt = firstRender ? pass.getRT(0) : pass.getWrite();
              output = pass.output;
              (_renderer.renderSingle(_scene.children[0], _camera, rt),
                copy(rt, output),
                pass.swap());
            }
            output &&
              ((_output.value = output),
              (_this.mesh.shader.uniforms.tPos.value = _output.value),
              (_this.mesh.shader.uniforms.tPrevPos.value = _prevOutput.value),
              (_this.mesh.shader.uniforms.uDPR.value =
                _this.mesh?.shader?._parentnuke?.dpr || 1));
          }
        }),
        (this.onDestroy = function () {
          (_this.vertices && _this.vertices.destroy && _this.vertices.destroy(),
            _this.attribs && _this.attribs.destroy && _this.attribs.destroy(),
            _this.passes.forEach(function (pass) {
              ((pass.first = !1),
                _this.persistPasses ||
                  (pass && pass.destroy && pass.destroy()));
            }),
            _this.mesh.destroy());
        }),
        (this.getOutput = function () {
          return _output;
        }),
        (this.getPrevOutput = function () {
          return _prevOutput;
        }));
    },
    function () {
      var _shader;
      AntimatterFBO.getCopyShader = function () {
        return (
          _shader ||
            ((_shader = new Shader("ScreenQuad")).addUniforms({
              tMap: { type: "t", value: null },
            }),
            (_shader._attachmentData = {
              format: Texture.RGBAFormat,
              type: Texture.FLOAT,
              attachments: 1,
            })),
          _shader
        );
      };
    },
  ),
  Class(function AntimatterPass(_shader, _uni, _clone) {
    var _this = this;
    this.UILPrefix = "am_" + _shader;
    const _uniforms = {
      tInput: { type: "t", value: null, ignoreUIL: !0 },
      fSize: { type: "f", value: 64, ignoreUIL: !0 },
    };
    var _rts = [],
      _read = 0,
      _write = 0;
    function prepareShader(code, type) {
      if ("vs" == type) return code;
      let header = [
          "uniform sampler2D tInput;",
          "uniform float fSize;",
          "varying vec2 vUv;",
          Shaders.getShader("antimatter.glsl"),
        ].join("\n"),
        mainAt = code.indexOf("void main()"),
        before = code.slice(0, mainAt),
        after = code.slice(mainAt);
      return (
        (code = before + header + after),
        _this.onCreateShader && (code = _this.onCreateShader(code)),
        code
      );
    }
    function initRT(size) {
      var type =
          "ios" == Device.system.os && Renderer.type == Render.WEBGL1
            ? Texture.HALF_FLOAT
            : Texture.FLOAT,
        parameters = {
          minFilter: Texture.NEAREST,
          magFilter: Texture.NEAREST,
          format: Texture.RGBAFormat,
          type: type,
        },
        rt = new RenderTarget(size, size, parameters);
      return ((rt.texture.generateMipmaps = !1), rt);
    }
    ((this.uniforms = _uniforms),
      (this.output = initRT(64)),
      (this.name = _shader),
      (this.id = Utils.timestamp()),
      (this.ready = !1),
      (function () {
        if (_uni)
          for (var key in (_uni.unique &&
            ((_this.UILPrefix += "_" + _uni.unique.replace("/", "_")),
            delete _uni.unique),
          _uni.customCompile &&
            ((_this.customCompile = _uni.customCompile || ""),
            delete _uni.customCompile),
          _uni))
            _uniforms[key] = _uni[key];
      })(),
      (this.addInput = function (name, attribute) {
        var uniform =
          "object" != typeof attribute ||
          attribute.height ||
          "string" != typeof attribute.type
            ? attribute instanceof AntimatterAttribute
              ? { type: "t", value: attribute.texture, ignoreUIL: !0 }
              : attribute instanceof AntimatterPass
                ? { type: "t", value: attribute.output, ignoreUIL: !0 }
                : { type: "t", value: attribute, ignoreUIL: !0 }
            : attribute;
        let lookup = UILStorage.parse(_this.UILPrefix + name);
        lookup && (uniform.value = lookup.value);
        let uniforms =
          _shader && _shader.uniforms ? _shader.uniforms : _uniforms;
        return (
          (uniforms[name] = uniform),
          (uniform.ignoreUIL = !0),
          uniforms[name]
        );
      }),
      (this.addUniforms = function (object) {
        let uniforms =
          _shader && _shader.uniforms ? _shader.uniforms : _uniforms;
        for (let key in object) {
          let uniform = object[key],
            lookup = UILStorage.parse(_this.UILPrefix + key);
          if (lookup) {
            if (Array.isArray(lookup.value))
              switch (lookup.value.length) {
                case 2:
                  lookup.value = new Vector2().fromArray(lookup.value);
                  break;
                case 3:
                  lookup.value = new Vector3().fromArray(lookup.value);
                  break;
                case 4:
                  lookup.value = new Vector4().fromArray(lookup.value);
              }
            uniform.value = lookup.value;
          }
          uniforms[key] = uniform;
        }
      }),
      (this.getRT = function (index) {
        return _rts[index];
      }),
      (this.getRead = function () {
        return _rts[_read];
      }),
      (this.getWrite = function () {
        return _rts[_write];
      }),
      (this.setRead = function (index) {
        _read = index;
      }),
      (this.setWrite = function (index) {
        _write = index;
      }),
      (this.swap = function () {
        (++_write > 2 && ((_write = 0), (_this.ready = !0)),
          ++_read > 2 &&
            (_this.onInit && (_this.onInit(), (_this.onInit = null)),
            (_read = 0)));
      }),
      (this.initialize = function (size) {
        if (!_this.init) {
          _this.init = !0;
          for (var i = 0; i < 3; i++) _rts.push(initRT(size));
          (_this.output.setSize(size, size),
            _shader instanceof Shader ||
              (((_shader = new Shader("AntimatterPass", _shader, {
                customCompile: _this.customCompile,
              }))._attachmentData = {
                format: Texture.RGBAFormat,
                type: Texture.FLOAT,
                attachments: 1,
              }),
              (_shader.preCompile = prepareShader),
              _shader.addUniforms(_uniforms),
              (_this.uniforms = _shader.uniforms),
              (_shader.UILPrefix = _this.UILPrefix),
              (_shader.id = Utils.timestamp())),
            (_this.shader = _shader),
            (_shader.uniforms.fSize.value = size));
        }
      }),
      (this.setUniform = function (key, value) {
        (_uniforms[key] || (_uniforms[key] = { value: value }),
          (_uniforms[key].value = value),
          _shader && _shader.uniforms && (_shader.uniforms[key].value = value));
      }),
      (this.getUniform = function (key) {
        return _shader && _shader.uniforms ? _shader.uniforms[key].value : null;
      }),
      (this.tween = function (key, value, time, ease, delay, callback, update) {
        return tween(
          _shader.uniforms[key],
          { value: value },
          time,
          ease,
          delay,
          callback,
          update,
        );
      }),
      (this.clone = function () {
        return new AntimatterPass(_shader, _uni);
      }),
      (this.destroy = function () {
        _rts.forEach(function (rt) {
          rt && rt.destroy && rt.destroy();
        });
      }),
      (this.upload = async function () {
        (_shader.upload(), await defer());
        for (let i = 0; i < _rts.length; i++) (_rts[i].upload(), await defer());
        for (let key in _shader.uniforms) {
          let uniform = _shader.uniforms[key];
          uniform.value &&
            (uniform.value.uploadAsync
              ? await uniform.value.uploadAsync()
              : uniform.value.upload &&
                (uniform.value.upload(), await defer()));
        }
      }));
  }),
  Class(function AntimatterSpawn(_proton, _group, _input) {
    Inherit(this, Component);
    const _this = this;
    var _life,
      _pass,
      _velocity,
      _color,
      _index = -1,
      _total = _proton.particleCount,
      _releasedA = [],
      _releasedB = [],
      _temp0 = [],
      _temp1 = [],
      _temp2 = [],
      _vec = new Vector3();
    function loop() {
      let count = _releasedA.length;
      for (let i = count - 1; i > -1; i--) {
        let index = _releasedA[i];
        _life.buffer[4 * index + 0] = 0;
      }
      ((_releasedA.length = 0), count && (_life.needsUpdate = !0));
      let hold = _releasedA;
      ((_releasedA = _releasedB), (_releasedB = hold));
    }
    (!(async function () {
      (await (async function initPass() {
        let [lifeBuffer, velocityBuffer] = await Promise.all([
          _proton.antimatter.createFloatArrayAsync(4, !0),
          _proton.antimatter.createFloatArrayAsync(3, !0),
        ]);
        ((_life = _this.initClass(AntimatterAttribute, lifeBuffer, 4)),
          (_velocity = _this.initClass(AntimatterAttribute, velocityBuffer, 3)),
          (_pass = _this.initClass(AntimatterPass, "AntimatterSpawn", {
            unique: _input.prefix,
            uMaxCount: _proton.behavior.uniforms.uMaxCount,
            tAttribs: _proton.behavior.uniforms.tAttribs,
            tLife: { value: _life, ignoreUIL: !0 },
            uSetup: { value: 1, ignoreUIL: !0 },
            decay: { value: 1 },
            HZ: { value: Render.HZ_MULTIPLIER, ignoreUIL: !0 },
            decayRandom: { value: new Vector2(1, 1) },
          })),
          ShaderUIL.add(_pass, _group).setLabel("Life Shader"),
          (_pass.onInit = (_) => {
            (_pass.setUniform("uSetup", 0), (_this.canEmit = !0));
          }),
          _proton.behavior.addInput("tSpawn", _pass),
          _proton.behavior.addInput("tVelocity", _velocity),
          _proton.shader.addUniforms({ tLife: { value: _pass.output } }),
          _proton.antimatter.addPass(_pass, 0),
          (_this.lifeOutput = _pass.output));
      })(),
        _this.startRender(loop));
    })(),
      (this.emit = function (position, velocity, color) {
        if (!_this.canEmit) return;
        if (velocity && position.length != velocity.length)
          throw "Position and velocity need to be the same length";
        if (color && position.length != color.length)
          throw "Position and color need to be the same length";
        let count = position.length / 3;
        for (let i = 0; i < count; i++) {
          let index = ++_index;
          (_index >= _total && (_index = -1),
            (_life.buffer[4 * index + 0] = 1),
            (_life.buffer[4 * index + 1] = position[3 * i + 0]),
            (_life.buffer[4 * index + 2] = position[3 * i + 1]),
            (_life.buffer[4 * index + 3] = position[3 * i + 2]),
            velocity &&
              ((_velocity.buffer[3 * index + 0] = velocity[3 * i + 0]),
              (_velocity.buffer[3 * index + 1] = velocity[3 * i + 1]),
              (_velocity.buffer[3 * index + 2] = velocity[3 * i + 2])),
            color &&
              _color &&
              ((_color.buffer[3 * index + 0] = color[3 * i + 0]),
              (_color.buffer[3 * index + 1] = color[3 * i + 1]),
              (_color.buffer[3 * index + 2] = color[3 * i + 2])),
            _releasedB.push(index));
        }
        ((_life.needsUpdate = !0),
          velocity && (_velocity.needsUpdate = !0),
          color && _color && (_color.needsUpdate = !0));
      }),
      (this.release = function (pos, count = 1, radius = 0, velocity, color) {
        if (!_this.canEmit) return;
        let positions = _temp0,
          velocities = velocity ? _temp1 : null,
          colors = color ? _temp2 : null,
          radX = Array.isArray(radius) ? radius[0] : radius,
          radY = Array.isArray(radius) ? radius[1] : radius,
          radZ = Array.isArray(radius) ? radius[2] : radius;
        for (let i = 0; i < count; i++)
          (pos.spherical
            ? (_vec
                .set(
                  Math.random(-1, 1, 4),
                  Math.random(-1, 1, 4),
                  Math.random(-1, 1, 4),
                )
                .normalize()
                .multiplyScalar(radX),
              (positions[3 * i + 0] = pos.x + _vec.x),
              (positions[3 * i + 1] = pos.y + _vec.y),
              (positions[3 * i + 2] = pos.z + _vec.z))
            : ((positions[3 * i + 0] = pos.x + Math.random(-1, 1, 4) * radX),
              (positions[3 * i + 1] = pos.y + Math.random(-1, 1, 4) * radY),
              (positions[3 * i + 2] = pos.z + Math.random(-1, 1, 4) * radZ)),
            velocities &&
              ((velocities[3 * i + 0] = velocity.x),
              (velocities[3 * i + 1] = velocity.y),
              (velocities[3 * i + 2] = velocity.z)),
            colors &&
              ((colors[3 * i + 0] = color.r),
              (colors[3 * i + 1] = color.g),
              (colors[3 * i + 2] = color.b)));
        (_this.emit(positions, velocities, colors),
          (_temp0.length = 0),
          (_temp1.length = 0),
          (_temp2.length = 0));
      }),
      (this.upload = async function () {
        (await _life?.uploadAsync(), await _velocity?.uploadAsync());
      }),
      (this.useColor = async function (shader) {
        let colorBuffer = await _proton.antimatter.createFloatArrayAsync(3, !0);
        ((_color = _this.initClass(AntimatterAttribute, colorBuffer, 3)),
          shader || (shader = _proton.shader),
          shader.addUniforms({ tColor: { value: _color } }),
          _proton.behavior.addInput("tColor", _color));
      }),
      (this.applyToShader = function (shader) {
        ((shader.uniforms.tLife = _proton.shader.uniforms.tLife),
          _velocity && (shader.uniforms.tVelocity = { value: _velocity }),
          _color && (shader.uniforms.tColor = { value: _color }));
      }),
      (this.ready = function () {
        return this.wait("canEmit");
      }),
      this.get("total", (_) => _total),
      this.get("index", (_) => _index),
      this.set("index", (i) => (_index = i)));
  }),
  Class(function AntimatterUtil() {
    Inherit(this, Component);
    var _thread,
      _this = this,
      _promises = {};
    function createBufferArrayAntimatter(e, id) {
      let size = e.size,
        num = e.num,
        position = new Float32Array(size * size * 3);
      if (window.NativeUtils) NativeUtils.fillBufferUV(position, num, size);
      else {
        let h = 0.5 / size;
        for (let i = 0; i < num; i++)
          ((position[3 * i + 0] = h + (i % size) / size),
            (position[3 * i + 1] = h + Math.floor(i / size) / size),
            (position[3 * i + 2] = i));
      }
      let { w: w, h: h, d: d } = e.dimensions,
        usedDepth = num / (size * size),
        grid = 0 == w[0] && 0 == w[1] && 0 == h[0] && 0 == h[1];
      var vertices = new Float32Array(size * size * 4);
      if (window.NativeUtils)
        grid
          ? NativeUtils.fillBufferGrid(vertices, num, size, usedDepth)
          : NativeUtils.fillBufferRange(
              vertices,
              num,
              w[0],
              w[1],
              h[0],
              h[1],
              d[0],
              d[1],
            );
      else
        for (let i = 0; i < num; i++)
          (null != e.pointData
            ? ((vertices[4 * i + 0] = e.pointData.positions[3 * i + 0]),
              (vertices[4 * i + 1] = e.pointData.positions[3 * i + 1]),
              (vertices[4 * i + 2] = e.pointData.positions[3 * i + 2]))
            : grid
              ? ((vertices[4 * i + 0] = Math.range(i % size, 0, size, -1, 1)),
                (vertices[4 * i + 1] = Math.range(
                  i / size,
                  size * usedDepth * usedDepth,
                  0,
                  -1,
                  1,
                )))
              : ((vertices[4 * i + 0] = Math.random(w[0], w[1], 10)),
                (vertices[4 * i + 1] = Math.random(h[0], h[1], 10)),
                (vertices[4 * i + 2] = Math.random(d[0], d[1], 10))),
            (vertices[4 * i + 3] = 1));
      var attribs = new Float32Array(size * size * 4);
      if (null != e.pointData && e.pointData.random)
        for (let i = 0; i < num; i++)
          ((attribs[4 * i + 0] = e.pointData.random[4 * i + 0]),
            (attribs[4 * i + 1] = e.pointData.random[4 * i + 1]),
            (attribs[4 * i + 2] = e.pointData.random[4 * i + 2]),
            (attribs[4 * i + 3] = e.pointData.random[4 * i + 3]));
      else if (window.NativeUtils)
        NativeUtils.fillBufferRandom(attribs, attribs.length);
      else
        for (let i = 0; i < num; i++)
          ((attribs[4 * i + 0] = Math.random(0, 1, 10)),
            (attribs[4 * i + 1] = Math.random(0, 1, 10)),
            (attribs[4 * i + 2] = Math.random(0, 1, 10)),
            (attribs[4 * i + 3] = Math.random(0, 1, 10)));
      resolve(
        {
          geometry: position,
          vertices: vertices,
          attribs: attribs,
          usedDepth: usedDepth,
        },
        id,
        [position.buffer, vertices.buffer, attribs.buffer],
      );
    }
    function createFloatArrayAntimatter({ size: size }, id) {
      let array = new Float32Array(size);
      resolve({ array: array }, id, [array.buffer]);
    }
    ((this.cache = !0),
      (this.createBufferArray = function (
        size,
        num,
        config = {},
        _pointData = null,
      ) {
        let key;
        if (
          (_thread ||
            (function initThread() {
              ((_thread = !0),
                Thread.upload(createBufferArrayAntimatter),
                Thread.upload(createFloatArrayAntimatter));
            })(),
          _this.cache &&
            ((key = `buffer_${JSON.stringify(config)}_${size}_${num}`),
            _promises[key]))
        )
          return _promises[key];
        let promise = Promise.create();
        key && (_promises[key] = promise);
        let buffers = [];
        return (
          _pointData?.positions.buffer &&
            buffers.push(_pointData?.positions.buffer),
          Thread.shared()
            .createBufferArrayAntimatter(
              {
                size: size,
                num: num,
                dimensions: config,
                pointData: _pointData,
              },
              buffers,
            )
            .then((data) => {
              ((data.attribs = new AntimatterAttribute(data.attribs, 4)),
                (data.vertices = new AntimatterAttribute(data.vertices, 4)));
              let geometry = data.geometry;
              ((data.geometry = new Geometry()),
                data.geometry.addAttribute(
                  "position",
                  new GeometryAttribute(geometry, 3),
                ),
                data.geometry.addAttribute(
                  "random",
                  new GeometryAttribute(data.attribs.buffer, 4),
                ),
                promise.resolve(data));
            }),
          promise
        );
      }),
      (this.createFloatArray = function (size, freshCopy) {
        if (freshCopy || !_this.cache)
          return Thread.shared().createFloatArrayAntimatter({ size: size });
        if (_promises[`float_size${size}`])
          return _promises[`float_size${size}`];
        return (_promises[`float_size${size}`] =
          Thread.shared().createFloatArrayAntimatter({ size: size }));
      }));
  }, "static"),
  Class(function Audio3D(_options) {
    Inherit(this, Component);
    const _this = this;
    var _bindingLabel;
    const _config = require("Audio3DConfig");
    function onVisibility(e) {
      if (!_this.context || !GlobalAudio3D.blurs) return;
      let hasFocus = "focus" === e.type;
      ((_this.context.visibilityMuted = !hasFocus),
        (_this.context.playing || _this.flag("wasPlaying")) &&
          (hasFocus
            ? (_this.flag("wasPlaying", !1), _this.context.play())
            : (_this.flag("wasPlaying", !0), _this.context.pause())));
    }
    (!(function initContext() {
      (_options || (_options = {}),
        GlobalAudio3D.native
          ? (window._al && (_this.context = _this.initClass(Audio3DALBuffer)),
            window.AVFSound &&
              (_this.context = _this.initClass(Audio3DNBuffer, "AVF")),
            window.MPAudio &&
              (_options.stream
                ? (_this.context = _this.initClass(Audio3DNBuffer, "MP"))
                : (_this.context = _this.initClass(Audio3DNBuffer, "GVR"))))
          : _options.fallback || GlobalAudio3D.fallback
            ? (_this.context = _this.initClass(Audio3DFallback))
            : _options.positional && GlobalAudio3D.resonanceAudio
              ? (_this.context = _this.initClass(Audio3DResonanceAudio))
              : _options.simpleBuffer && "ie" !== Device.system.browser
                ? (_this.context = _this.initClass(Audio3DWASimpleBuffer))
                : !0 !== _options.stream && "ie" !== Device.system.browser
                  ? (_this.context = _this.initClass(Audio3DWABuffer))
                  : (_this.context = _this.initClass(Audio3DWAStream)));
    })(),
      (function initInterface() {
        for (let command of _config.commands)
          _this[command] = _this.context[command];
        for (let setter of _config.setters)
          _this.set(setter, (e) => {
            _this.context && (_this.context[setter] = e);
          });
        for (let getter of _config.getters)
          _this.get(getter, (_) => {
            if (_this.context) return _this.context[getter];
          });
      })(),
      (function addHandlers() {
        (_this.events.sub(_this.context, Events.END, (e) =>
          _this.events.fire(Events.END, e),
        ),
          _this.events.sub(_this.context, Events.LOADED, (e) =>
            _this.events.fire(Events.LOADED, e),
          ),
          _this.events.sub(Events.VISIBILITY, onVisibility));
      })(),
      (function initOptions() {
        if (_options) {
          for (let option in _options)
            _config.setters.includes(option) &&
              (_this.context[option] = _options[option]);
          _options.label &&
            (_bindingLabel = GlobalAudio3D.getLabelState(_options.label).bind(
              "mute",
              async (bool) => {
                if (!_this.context) return _bindingLabel.destroy();
                _this.context.muted = bool;
              },
            ));
        }
      })(),
      (this.tween = function () {
        return tween(_this, ...arguments);
      }),
      (this.clone = function () {
        return new Audio3D(_options);
      }),
      (this.onDestroy = function () {
        (_this.context.unload(), _bindingLabel?.destroy?.());
      }));
  }),
  Class(function Audio3DLayer(...args) {
    Inherit(this, Component);
    const _this = this;
    var _group,
      _input,
      _mesh,
      _audio3D,
      _config,
      _key,
      _autoplay,
      _volume = { value: 0 },
      _captionsSetup = "undefined" != typeof CaptionsController;
    async function fadeIn() {
      _this.flag("init") || (await _this.wait("init"));
      let captionsPath = _config.get("captions");
      _captionsSetup &&
        captionsPath &&
        _config.get("enableCaptions") &&
        (await (async function loadCaptions(path) {
          await CaptionsController.instance().load(path);
        })(captionsPath));
      let delay = _config.getNumber("delay");
      if (
        (delay && (await _this.wait(delay)),
        _audio3D.play(),
        _captionsSetup &&
          captionsPath &&
          _config.get("enableCaptions") &&
          toggleCaptions(!0),
        0 != _config.getNumber("fadeInTime"))
      ) {
        ((_volume.value = 0), (_audio3D.volume = 0));
        let volumeTween = tween(
          _volume,
          { value: _config.getNumber("volume") },
          _config.getNumber("fadeInTime"),
          "easeOutExpo",
        );
        (volumeTween.onUpdate(() => {
          _audio3D.volume = _volume.value;
        }),
          await volumeTween.promise());
      }
    }
    async function fadeOut() {
      if (
        (_this.flag("init") || (await _this.wait("init")),
        _captionsSetup &&
          _config.get("captions") &&
          _config.get("enableCaptions") &&
          toggleCaptions(!1),
        0 != _config.getNumber("fadeOutTime"))
      ) {
        _volume.value = _config.getNumber("volume");
        let volumeTween = tween(
          _volume,
          { value: 0 },
          _config.getNumber("fadeOutTime"),
          "easeOutExpo",
          0,
        );
        (volumeTween.onUpdate(() => {
          _audio3D.volume = _volume.value;
        }),
          volumeTween.onComplete(() => {
            (_audio3D.context &&
              _audio3D.context.stream &&
              Audio3DWA.getActiveStreamCount(_audio3D.context.stream) > 1) ||
              _audio3D.pause();
          }),
          await volumeTween.promise());
      } else {
        if (
          _audio3D.context &&
          _audio3D.context.stream &&
          Audio3DWA.getActiveStreamCount(_audio3D.context.stream) > 1
        )
          return;
        _audio3D.pause();
      }
    }
    function toggleCaptions(bool = !1) {
      bool
        ? CaptionsController.instance().start()
        : CaptionsController.instance().stop();
    }
    (!(function parseArgs() {
      (args.forEach((arg) => {
        switch (Utils.getConstructorName(arg)) {
          case "InputUILConfig":
            _input = arg;
            break;
          case "UILFolder":
            _group = arg;
            break;
          case "Mesh":
            ((_mesh = arg),
              (_this.parent = _mesh),
              _mesh.audioCount ? _mesh.audioCount++ : (_mesh.audioCount = 1),
              _mesh.findSound ||
                ((_mesh.shader.visible = !1),
                (_mesh.findSound = async function (key) {
                  if (!Array.isArray(_mesh.scriptClass))
                    return _mesh.scriptClass;
                  for (let scriptClass of _mesh.scriptClass)
                    if ((await scriptClass.key) == key) return scriptClass;
                })));
        }
      }),
        (_this.visible = _input.get("visible")));
    })(),
      (function initConfig() {
        let config = InputUIL.create(
          _input.prefix + "audio3dLayer" + (_mesh ? _mesh.audioCount : ""),
          _group,
        );
        (config
          .add("path")
          .add("key")
          .add("label")
          .addToggle("autoplay", !1)
          .addToggle("loop", !1)
          .addToggle("stream", !1)
          .addToggle("positional", !1)
          .addNumber("volume", 1)
          .addNumber("rolloff", 1)
          .addNumber("fadeInTime", 0)
          .addNumber("fadeOutTime", 0)
          .addNumber("delay", 0)
          .addNumber("gain", 1)
          .setLabel("Audio"),
          config.addButton("preview", {
            label: "Preview",
            actions: [
              { title: "Play", callback: fadeIn },
              { title: "Stop", callback: fadeOut },
            ],
          }),
          _captionsSetup &&
            config.add("captions").addToggle("enableCaptions", !1),
          (config.onUpdate = (key) => {
            if (_audio3D)
              switch (key) {
                case "autoplay":
                case "loop":
                  _audio3D[key] = _config.get(key);
                  break;
                case "volume":
                case "rolloff":
                case "gain":
                  _audio3D[key] = _config.getNumber(key);
              }
          }),
          (_config = config));
      })(),
      (async function initAudio() {
        (GlobalAudio3D.initialized || (await GlobalAudio3D.interacted),
          (_key = _config.get("key")),
          (_autoplay = _config.get("autoplay")));
        let path = Assets.getPath(_config.get("path"));
        if (path) {
          _audio3D = _this.initClass(Audio3D, {
            src: path,
            autoplay: !1,
            volume: _config.getNumber("volume"),
            loop: _config.get("loop"),
            stream: _config.get("stream"),
            positional: _config.get("positional"),
            label: _config.get("label"),
            rolloff: _config.getNumber("rolloff"),
          });
          let gain = _config.get("gain");
          ("string" == typeof gain && (gain = Number(gain)),
            isFinite(gain) && (_audio3D.gain = gain),
            _mesh && _mesh.add(_audio3D.group),
            _this.flag("init", !0));
        }
      })(),
      _this.startRender(() => {}),
      this.get("audio", () => _audio3D),
      (this.play = async function () {
        await fadeIn();
      }),
      (this.stop = async function () {
        await fadeOut();
      }),
      this.get("key", async () => (await _this.wait("init"), _key)),
      _this.set("volume", (volume) => {
        _audio3D.volume = volume;
      }),
      _this.set("rolloff", (rolloff) => {
        _audio3D.rolloff = rolloff;
      }),
      (this.onVisible = async function () {
        (_this.flag("init") || (await _this.wait("init")),
          _audio3D && _autoplay && (await fadeIn()));
      }),
      (this.onInvisible = async function () {
        (_this.flag("init") || (await _this.wait("init")),
          _audio3D && (await fadeOut()));
      }),
      (this.onDestroy = function () {
        _audio3D && fadeOut();
      }));
  }),
  Class(function GlobalAudio3D() {
    Inherit(this, Component);
    const _this = this;
    var _volume = 1,
      _muted = !1,
      _blurs = !0,
      _playbackRate = 1,
      _poolSize = 1,
      _interacted = Promise.create(),
      _labelStates = {};
    function initInteraction(e) {
      _this.initialized ||
        (e && e.preventDefault && e.preventDefault(),
        document.removeEventListener(
          Device.mobile ? "touchend" : "mouseup",
          initInteraction,
          { passive: !1 },
        ),
        "undefined" != typeof XRDeviceManager &&
          _this.events.unsub(XRDeviceManager.SESSION_START, initInteraction),
        Audio3DWA.createPool(_poolSize),
        (_this.initialized = !0),
        _this.events.fire(Events.READY),
        _interacted.resolve());
    }
    ((this.native = !1),
      (this.TRANSPARENT = 0),
      (this.ACOUSTIC_CEILING_TILES = 1),
      (this.BRICK_BARE = 2),
      (this.BRICK_PAINTED = 3),
      (this.CONCRETE_BLOCK_COARSE = 4),
      (this.CONCRETE_BLOCK_PAINTED = 5),
      (this.CURTAIN_HEAVY = 6),
      (this.FIBER_GLASS_INSULATION = 7),
      (this.GLASS_THICK = 8),
      (this.GLASS_THIN = 9),
      (this.GRASS = 10),
      (this.LINOLEUM_ON_CONCRETE = 11),
      (this.MARBLE = 12),
      (this.METAL = 13),
      (this.PARQUET_ON_CONCRETE = 14),
      (this.PLASTER_ROUGH = 15),
      (this.PLASTER_SMOOTH = 16),
      (this.PLYWOOD_PANEL = 17),
      (this.POLISHED_CONCRETE_OR_TILE = 18),
      (this.SHEET_ROCK = 19),
      (this.WATER_OR_ICE_SURFACE = 20),
      (this.WOOD_CEILING = 21),
      (this.WOOD_PANEL = 22),
      (this.LOW = 0),
      (this.MED = 1),
      (this.HIGH = 2),
      (this.RESONANCE_AUDIO = "resonance_audio"),
      (this.quality = this.HIGH),
      (async function () {
        (await defer(),
          window.AURA &&
            (function initNative() {
              ((_this.native = !0), !window._al || Audio3DAL.init());
              ((_this.initialized = !0), _interacted.resolve());
            })(),
          (function initDebug() {
            Hydra.LOCAL &&
              Utils.query("audioDebug") &&
              (AudioNode.prototype.connect =
                ((func = AudioNode.prototype.connect),
                function () {
                  var target = arguments[0];
                  return (
                    (this.outputs || (this.outputs = [])).push(arguments[0]),
                    (target.inputs || (target.inputs = [])).push(this),
                    func.apply(this, arguments)
                  );
                }));
            var func;
          })());
      })(),
      this.set("volume", (v) => {
        ((_volume = v), _this.events.fire(Events.UPDATE, { volume: _volume }));
      }),
      this.get("volume", (_) => _volume),
      this.set("muted", (v) => {
        ((_muted = v), _this.events.fire(Events.UPDATE, { muted: _muted }));
      }),
      this.get("muted", (_) => _muted),
      this.set("blurs", (v) => {
        ((_blurs = v), _this.events.fire(Events.UPDATE, { blurs: _blurs }));
      }),
      this.get("blurs", (_) => _blurs),
      this.set("playbackRate", (v) => {
        ((_playbackRate = v),
          _this.events.fire(Events.UPDATE, { playbackRate: _playbackRate }));
      }),
      this.get("playbackRate", (_) => _playbackRate),
      this.get("pool", (_) => _poolSize),
      this.set("pool", (n) => {
        _poolSize = n;
      }),
      this.get("interacted", (_) => _interacted),
      this.get("fallback", (_) => !1),
      (this.setup = function (type = "default") {
        (Utils.query("muted") && Hydra.LOCAL && (_muted = !0),
          Device.mobile
            ? _this.events.sub(Mouse.input, Interaction.CLICK, initInteraction)
            : document.addEventListener(
                Device.mobile ? "touchend" : "mouseup",
                initInteraction,
                { passive: !1 },
              ),
          "undefined" != typeof XRDeviceManager &&
            _this.events.sub(XRDeviceManager.SESSION_START, initInteraction),
          "resonance_audio" != type ||
            _this.native ||
            _this.fallback ||
            ((_this.resonanceAudio = !0),
            AssetLoader.loadAssets([
              "assets/js/lib/_resonance/resonance-audio.min.js",
            ])));
      }),
      (this.ready = function () {
        return _this.wait(_this, "initialized");
      }),
      (this.enableRoom = function (bool) {
        window.GVRAudio && GVRAudio.enableRoom(bool);
      }),
      (this.setRoomProperties = function (x, y, z, wall, ceiling, floor) {
        window.GVRAudio &&
          GVRAudio.setRoomProperties(x, y, z, wall, ceiling, floor);
      }),
      (this.setRoomReverbAdjustments = function (gain, time, brightness) {
        window.GVRAudio &&
          GVRAudio.setRoomReverbAdjustments(gain, time, brightness);
      }),
      (this.muteLabel = function (label) {
        _this.getLabelState(label).set("mute", !0);
      }),
      (this.unmuteLabel = function (label) {
        _this.getLabelState(label).set("mute", !1);
      }),
      (this.getLabelState = function (label) {
        return (
          _labelStates[label] || (_labelStates[label] = AppState.createLocal()),
          _labelStates[label]
        );
      }));
  }, "static"),
  Class(
    function SFXController() {
      Inherit(this, Component);
      const _this = this,
        POOL_SIZE = 1;
      var _pool,
        _srcMap = {},
        _preloaded = {},
        _activeSounds = {};
      function init() {
        (!(function initPool() {
          _pool = _this.initClass(ObjectPool);
          let sfx = [];
          for (; sfx.length < POOL_SIZE; ) sfx.push(generate());
          _pool.insert(sfx);
        })(),
          defer(() => {
            let wasMuted = _this.muted;
            ((_this.initialized = !0),
              wasMuted !== _this.muted &&
                _this.events.fire(
                  _this.muted
                    ? SFXController.AUDIO_MUTED
                    : SFXController.AUDIO_UNMUTED,
                ));
          }));
      }
      function generate() {
        return _this.initClass(Audio3D, { simpleBuffer: !0 });
      }
      function handleToggle() {
        let nextMuted = !GlobalAudio3D.muted;
        (_this.initialized || (nextMuted = !1),
          nextMuted !== GlobalAudio3D.muted &&
            (GlobalAudio3D.muted = nextMuted),
          _this.initialized &&
            _this.events.fire(
              nextMuted
                ? SFXController.AUDIO_MUTED
                : SFXController.AUDIO_UNMUTED,
            ));
      }
      function handlePlayRequest({ name: name, ...options }) {
        _this.play(name, options);
      }
      function handleStopRequest({ name: name, ...options }) {
        _this.stop(name, options);
      }
      (!(async function () {
        let muted = !0 === Storage.get("muted");
        (muted !== GlobalAudio3D.muted && (GlobalAudio3D.muted = muted),
          GlobalAudio3D.initialized
            ? init()
            : _this.events.sub(GlobalAudio3D, Events.READY, init),
          (function addListeners() {
            (_this.events.sub(SFXController.TOGGLE_AUDIO, handleToggle),
              _this.events.sub(SFXController.PLAY_SFX, handlePlayRequest),
              _this.events.sub(SFXController.STOP_SFX, handleStopRequest));
          })());
      })(),
        (this.registerSounds = function (srcMap) {
          ((_srcMap = { ..._srcMap, ...srcMap }),
            Object.keys(_srcMap).forEach((name) => {
              _activeSounds[name] = [];
            }));
        }),
        (this.registerSound = function (name, src) {
          ((_srcMap[name] = src), (_activeSounds[name] = []));
        }),
        (this.preload = async function (name) {
          let src = _srcMap[name];
          if (!src) return console.warn(`missing sound '${name}'`);
          let sound = _preloaded[name];
          return (
            sound || (sound = _preloaded[name] = generate()),
            (sound.src = src),
            sound.load()
          );
        }),
        (this.play = async function (name, options = {}) {
          if (!_this.initialized)
            return void _this.delayedCall((_) => {
              _this.initialized = !0;
            }, 1e3);
          let sound,
            preloaded = _preloaded[name];
          if (
            (preloaded &&
              (_activeSounds[name].includes(preloaded)
                ? (preloaded = void 0)
                : (sound = preloaded)),
            !sound)
          ) {
            let src = _srcMap[name];
            if (!src) return console.warn(`missing sound '${name}'`);
            ((sound = _pool.get()),
              null === sound && (sound = generate()),
              (sound.src = src));
          }
          if (options.onBeforePlay) {
            if (!1 === (await options.onBeforePlay(sound)))
              return void (preloaded || _pool.put(sound));
          }
          _activeSounds[name].push(sound);
          let promise = Promise.create();
          return (
            _this.events.sub(sound, Events.END, function onSoundEnd() {
              (_this.events.unsub(sound, Events.END, onSoundEnd),
                preloaded || _pool.put(sound),
                _activeSounds[name].remove(sound),
                promise.resolve());
            }),
            sound.play(),
            promise
          );
        }),
        (_this.stop = function (name) {
          let sound = _activeSounds[name][0];
          sound && sound.stop();
        }),
        (_this.muted = !1),
        _this.get("preloaded", () => _preloaded),
        _this.get("activeSounds", () => _activeSounds));
    },
    "singleton",
    () => {
      ((SFXController.AUDIO_MUTED = "sfx_muted"),
        (SFXController.AUDIO_UNMUTED = "sfx_unmuted"),
        (SFXController.TOGGLE_AUDIO = "sfx_toggle_mute"),
        (SFXController.PLAY_SFX = "SFXAssetsController.PLAY_SFX"),
        (SFXController.STOP_SFX = "SFXAssetsController.STOP_SFX"));
    },
  ),
  Module(function Audio3DConfig() {
    this.exports = {
      getters: [
        "playbackRate",
        "loop",
        "autoplay",
        "volume",
        "rolloff",
        "preload",
        "visibilityMuted",
        "selfDestruct",
        "src",
        "frequency",
        "group",
        "duration",
        "currentTime",
        "activity",
        "playing",
        "filter",
        "panner",
        "delay",
        "progress",
        "reverb",
        "gain",
        "sourceWidth",
        "directivitySharpness",
        "directivityAlpha",
      ],
      setters: [
        "playbackRate",
        "loop",
        "autoplay",
        "volume",
        "rolloff",
        "preload",
        "visibilityMuted",
        "selfDestruct",
        "src",
        "gain",
        "sourceWidth",
        "directivitySharpness",
        "directivityAlpha",
      ],
      commands: ["play", "pause", "stop", "seek", "load", "unload", "convolve"],
    };
  }),
  Module(function Audio3DSilence() {
    this.exports =
      "data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAA5TEFNRTMuOThyAc0AAAAAAAAAABSAJAiqQgAAgAAABobxtI73AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAACFEII9ACZ/sJZwWEoEb8w/////N//////JcxjHjf+7/v/H2PzCCFAiDtGeyBCIx7bJJ1mmEEMy6g8mm2c8nrGABB4h2Mkmn//4z/73u773R5qHHu/j/w7Kxkzh5lWRWdsifCkNAnY9Zc1HvDAhjhSHdFkHFzLmabt/AQxSg2wwzLhHIJOBnAWwVY4zrhIYhhc2kvhYDfQ4hDi2Gmh5KyFn8EcGIrHAngNgIwVIEMf5bzbAiTRoAD///8z/KVhkkWEle6IX+d/z4fvH3BShK1e5kmjkCMoxVmXhd4ROlTKo3iipasvTilY21q19ta30/v/0/idPX1v8PNxJL6ramnOVsdvMv2akO0iSYIzdJFirtzWXCZicS9vHqvSKyqm5XJBdqBwPxyfJdykhWTZ0G0ZyTZGpLKxsNwwoRhsx3tZfhwmeOBVISm3impAC/IT/8hP/EKEM1KMdVdVKM2rHV4x7HVXZvbVVKN/qq8CiV9VL9jjH/6l6qf7MBCjZmOqsAibjcP+qqqv0oxqpa/NVW286hPo1nz2L/h8+jXt//uSxCmDU2IK/ECN98KKtE5IYzNoCfbw+u9i5r8PoadUMFPKqWL4LK3T/LCraMSHGkW4bpLXR/E6LlHOVQxmslKVJ8IULktMN06N0FKCpHCoYsjC4F+Z0NVqdNFoGSTjSiyjzLdnZ2fNqTi2eHKONONKLMPMKLONKLMPQRJGlFxZRoKcJFAYEeIFiRQkUWUeYfef//Ko04soswso40UJAgMw8wosososy0EalnZyjQUGBRQGIFggOWUacWUeYmuadrZziQKKEgQsQLAhQkUJAgMQDghltLO1onp0cpkNInSFMqlYeSEJ5AHsqFdOwy1DA2sRmRJKxdKRfLhfLw5BzUxBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjk4LjJVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7ksRRA8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";
  }),
  Class(function Audio3DBase() {
    Inherit(this, Object3D);
    const _this = this;
    var _quaternion,
      _euler,
      _position = new Vector3();
    ((this.audioPosition = function () {
      return (_position = _this.group._parent
        ? _this.group.getWorldPosition()
        : Audio3DWA.getCamera().getWorldPosition());
    }),
      (this.audioPositionInverse = function () {
        return (
          (_position = _this.audioPosition()),
          _this.group._parent &&
            _position.applyMatrix4(Audio3DWA.getCamera().matrixWorldInverse),
          _position
        );
      }),
      (this.audioOrientationInverse = function () {
        return (
          _quaternion ||
            ((_quaternion = new Quaternion()), (_euler = new Euler())),
          _this.group.parent
            ? (_this.group.getWorldQuaternion(_quaternion),
              _euler.setFromQuaternion(_quaternion))
            : _euler.set(0, 0, 0),
          _euler
        );
      }),
      (this.listenerPosition = function () {
        return (
          _this.group._parent &&
            (_position = Audio3DWA.getCamera().getWorldPosition()),
          _position
        );
      }));
  }),
  Class(function Audio3DFallback() {
    Inherit(this, Audio3DBase);
    const _this = this;
    var _stream,
      _options = {},
      _settings = { playing: !1, loaded: !1, loading: !1 },
      _currentTime = 0;
    function initOptions() {
      ((_options.loop = _options.loop || !1),
        (_options.autoplay = _options.autoplay || !1),
        (_options.volume = void 0 === _options.volume ? 1 : _options.volume),
        (_options.playbackRate = _options.playbackRate || 1),
        (_options.preload = _options.preload || !1),
        (_options.muted = _options.muted || !1),
        (_options.rolloff = _options.rolloff || 1),
        (_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate));
    }
    function update(e) {
      ((_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate),
        (_this.volume = _this.volume),
        (_this.playbackRate = _this.playbackRate));
    }
    function ready() {
      (initOptions(),
        (_settings.autoplay || _options.autoplay) && _this.play());
    }
    (initOptions(),
      (function addListeners() {
        (_this.events.sub(GlobalAudio3D, Events.UPDATE, update),
          _this.events.sub(GlobalAudio3D, Events.READY, ready));
      })(),
      this.set("src", (src) => {
        (_this.unload(),
          (function destroyStream() {
            _stream &&
              _stream.element &&
              (Audio3DWA.unloadStream(_settings.src), (_stream = null));
          })(),
          (_settings.src = src));
      }),
      this.get("src", (_) => _settings.src),
      this.set(
        "volume",
        (v) => (
          (v = Math.clamp(v, 0, 1)),
          (_options.volume = v),
          _stream &&
            _stream.element &&
            (_stream.element.volume =
              _options.muted || _options.globalMuted
                ? 0
                : v * Math.clamp(_options.globalVolume)),
          _options.volume
        ),
      ),
      this.get("volume", (_) => _options.volume),
      this.set(
        "loop",
        (l) => (
          (l = !!l),
          _stream && (_stream.element.loop = l),
          (_options.loop = l)
        ),
      ),
      this.get("loop", (_) => _options.loop),
      this.set("autoplay", (autoplay) => {
        _options.autoplay = autoplay;
      }),
      this.get("autoplay", (_) => _options.autoplay),
      this.set("preload", (preload) => {
        _options.preload = preload;
      }),
      this.get("preload", (_) => _options.preload),
      this.get("ready", (_) => _this.ready),
      this.get("frequency", (_) => 0),
      this.get("activity", (_) => 0),
      this.get("playing", (_) => _settings.playing),
      this.set("rolloff", (r) => {}),
      this.get("rolloff", (_) => 0),
      this.get("loaded", (_) => !0),
      this.get("duration", (_) => (_stream ? _stream.element.duration : 0)),
      this.get("currentTime", (_) =>
        _stream ? _stream.element.currentTime : 0,
      ),
      this.set("currentTime", (t) => {
        _this.seek(t);
      }),
      this.get("progress", (_) => _this.currentTime / _this.duration),
      this.set("playbackRate", (v) => {
        ((_options.playbackRate = v),
          _stream &&
            _stream.element &&
            (_stream.element.playbackRate = v * _options.globalPlaybackRate));
      }),
      this.get("playbackRate", (_) => _options.playbackRate),
      this.get("visibilityMuted", (_) => _options.muted),
      this.set("visibilityMuted", (muted) => {
        (!0 === muted
          ? (_options.muteState = _options.muted)
          : void 0 !== _options.muteState &&
            ((muted = _options.muteState), delete _options.muteState),
          _options.muted !== muted &&
            ((_options.muted = muted), (_this.volume = _this.volume)));
      }),
      this.get("muted", (_) => _options.muted),
      this.set("muted", (muted) => {
        ((_options.muted = muted), (_this.volume = _this.volume));
      }),
      (this.play = function () {
        if (
          ((_settings.autoplay = !0),
          _settings.src &&
            GlobalAudio3D.initialized &&
            ((function createStream() {
              _stream ||
                (((_stream = Audio3DWA.loadStream(
                  _settings.src,
                )).element.onended = (_) => {
                  (_this.unload(), _this.events.fire(Events.END));
                }),
                (_this.loop = _this.loop),
                (_this.volume = _this.volume),
                (_this.rolloff = _this.rolloff),
                (_this.muted = _this.muted),
                (_options.autoplay || _settings.autoplay) && _this.play());
            })(),
            !0 !== _settings.playing &&
              ((_settings.playing = !0),
              (_this.volume = _options.volume),
              _stream)))
        ) {
          ((_stream.element.playbackRate = _options.playbackRate),
            _stream.element.play());
          try {
            _stream.element.currentTime = _currentTime;
          } catch (e) {}
        }
      }),
      (this.pause = function () {
        if (
          ((_settings.autoplay = !1),
          _stream &&
            GlobalAudio3D.initialized &&
            _settings.src &&
            _settings.playing)
        ) {
          try {
            _currentTime = _stream.element.currentTime;
          } catch (e) {}
          (_stream.element.pause(), (_settings.playing = !1));
        }
      }),
      (this.stop = function () {
        if (
          ((_settings.autoplay = !1),
          _settings.src &&
            GlobalAudio3D.initialized &&
            ((_currentTime = 0),
            (_settings.playing = !1),
            _stream && _stream.element && _stream.element.stop))
        ) {
          _stream.element.stop();
          try {
            _stream.element.currentTime = 0;
          } catch (e) {}
        }
      }),
      (this.seek = function (time) {
        if (
          _settings.src &&
          ((_currentTime = time), _stream && _stream.element)
        )
          try {
            _stream.element.currentTime = time;
          } catch (e) {}
      }),
      (this.load = function () {
        return !0;
      }),
      (this.unload = function () {
        ((_settings.autoplay = !1), _stream && _settings.src && _this.stop());
      }),
      (this.convolve = function (src) {}));
  }),
  Class(function Audio3DN() {
    Inherit(this, Component);
    const _this = this;
    var _init;
    function loop() {
      window.GVRAudio &&
        (GVRAudio.setHeadPos(
          World.CAMERA.position.x,
          World.CAMERA.position.y,
          World.CAMERA.position.z,
        ),
        GVRAudio.setHeadRotation(
          World.CAMERA.quaternion.x,
          World.CAMERA.quaternion.y,
          World.CAMERA.quaternion.z,
          World.CAMERA.quaternion.w,
        ));
    }
    this.audioContext = function () {
      window.GVRAudio &&
        !_init &&
        (GVRAudio.initEngine(GlobalAudio3D.quality),
        (_init = !0),
        _this.startRender(loop));
    };
  }, "static"),
  Class(function Audio3DNBuffer(_backingType) {
    Inherit(this, Audio3DBase);
    const _this = this;
    var _backing,
      _options = {},
      _settings = { playing: !1, loaded: !1, loading: !1 },
      _currentTime = 0;
    function loop() {
      let pos, orientation;
      switch (_backingType) {
        case "AVF":
          ((pos = _this.audioPositionInverse()),
            (orientation = _this.audioOrientationInverse()));
          break;
        case "GVR":
          pos = _this.audioPosition();
      }
      pos &&
        _backing &&
        (_backing.setPos(pos.x, pos.y, pos.z),
        orientation &&
          _backing.setOrientation(
            orientation.x || 0,
            orientation.y || 0,
            orientation.z || 0,
            0,
            1,
            0,
          ));
    }
    function update(e) {
      ((_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate),
        (_this.volume = _this.volume),
        (_this.playbackRate = _this.playbackRate));
    }
    (Audio3DN.audioContext(),
      (function initOptions() {
        ((_options.loop = _options.loop || !1),
          (_options.autoplay = _options.autoplay || !1),
          (_options.volume = void 0 === _options.volume ? 1 : _options.volume),
          (_options.playbackRate = _options.playbackRate || 1),
          (_options.preload = _options.preload || !1),
          (_options.muted = _options.muted || !1),
          (_options.rolloff = _options.rolloff || 1),
          (_options.selfDestruct = _options.selfDestruct || !1),
          (_options.globalMuted = GlobalAudio3D.muted),
          (_options.globalVolume = GlobalAudio3D.volume),
          (_options.globalPlaybackRate = GlobalAudio3D.playbackRate));
      })(),
      (function addListeners() {
        _this.events.sub(GlobalAudio3D, Events.UPDATE, update);
      })(),
      this.set("src", (src) => {
        (_this.stop(),
          (_settings.src = src),
          defer((_) => {
            if (_options.autoplay) return _this.play();
            (_options.preload && _this.load(),
              (_this.volume = _options.volume));
          }));
      }),
      this.get("src", (_) => _settings.src),
      this.get("selfDestruct", (_) => _options.selfDestruct),
      this.set("selfDestruct", (d) => {
        _options.selfDestruct = d;
      }),
      this.set(
        "volume",
        (v) => (
          (_options.volume = v),
          _backing && _backing.volume(v),
          _options.volume
        ),
      ),
      this.get("volume", (_) => _options.volume),
      this.set(
        "loop",
        (l) => ((l = !!l), _backing && _backing.loop(l), (_options.loop = l)),
      ),
      this.get("loop", (_) => _options.loop),
      this.set("autoplay", (autoplay) => {
        _options.autoplay = autoplay;
      }),
      this.get("autoplay", (_) => _options.autoplay),
      this.set("preload", (preload) => {
        _options.preload = preload;
      }),
      this.get("preload", (_) => _options.preload),
      this.get("ready", (_) => _this.ready),
      this.get("frequency", (_) => []),
      this.get("activity", (_) => 0),
      this.get("playing", (_) => _settings.playing),
      this.set("rolloff", (r) => {
        _options.rolloff = r;
      }),
      this.get("rolloff", (_) => _options.rolloff),
      this.get("loaded", (_) => _settings.loaded),
      this.get("currentTime", (_) => _currentTime),
      this.set("currentTime", (t) => {
        _this.seek(t);
      }),
      this.get("duration", (_) => 0),
      this.get("progress", (_) => _this.currentTime / _this.duration),
      this.get("visibilityMuted", (_) => _options.muted),
      this.set("visibilityMuted", (muted) => {
        (!0 === muted
          ? (_options.muteState = _options.muted)
          : void 0 !== _options.muteState &&
            ((muted = _options.muteState), delete _options.muteState),
          _options.muted !== muted &&
            ((_options.muted = muted), (_this.volume = _this.volume)));
      }),
      this.get("muted", (_) => _options.muted),
      this.set("muted", (muted) => {
        ((_options.muted = muted), (_this.volume = _this.volume));
      }),
      this.set("playbackRate", (v) => {
        ((_options.playbackRate = v), _backing && _backing.setRate(v));
      }),
      this.get("playbackRate", (_) => _options.playbackRate),
      (this.play = async function () {
        ((_settings.autoplay = !0),
          _settings.src &&
            ((_settings.loadingPlay = !0),
            _settings.loading ||
              _settings.playing ||
              (_settings.loaded || (await _this.load()),
              (_settings.playing = !0),
              (_this.volume = _options.volume),
              (_this.playbackRate = _options.playbackRate),
              _this.startRender(loop),
              _backing.seek(_currentTime),
              _backing.play(_options.loop))));
      }),
      (this.pause = function () {
        ((_settings.autoplay = !1),
          _settings.src &&
            _settings.loaded &&
            _settings.playing &&
            ((_settings.loadingPlay = !1),
            (_settings.playing = !1),
            _backing && _backing.pause(),
            _this.stopRender(loop)));
      }),
      (this.stop = function () {
        ((_settings.autoplay = !1),
          _settings.loaded &&
            ((_currentTime = 0),
            _backing && _backing.stop(),
            (_settings.playing = !1),
            _this.stopRender(loop)));
      }),
      (this.seek = function (time) {
        if (_settings.src) {
          _settings.loadingPlay = !1;
          var wasPlaying = _settings.playing;
          ((_currentTime = time),
            _backing &&
              (_backing.seek(_currentTime), wasPlaying && _backing.play()));
        }
      }),
      (this.load = async function () {
        _settings.src &&
          (_settings.loading ||
            _settings.loaded ||
            ((_settings.loading = !0),
            (_this.ready = await (function createBuffer() {
              let promise = Promise.create(),
                url = _settings.src;
              switch (
                (url.includes("http") || (url = AURA.rootPath + url),
                _backingType)
              ) {
                case "AVF":
                  _backing = AVFSound.create(url);
                  break;
                case "MP":
                  _backing = new MPAudio(url);
                  break;
                case "GVR":
                  _backing = new GVRAudio(url);
              }
              return (
                (_backing.onComplete = (_) => {
                  (_this.events.fire(Events.END),
                    _options.selfDestruct && _this.parent.destroy());
                }),
                (_backing.onUpdate = (t) => {
                  _currentTime = t;
                }),
                (_backing.onReady = promise.resolve),
                promise
              );
            })()),
            _this.events.fire(Events.LOADED),
            (_settings.loadingPlay = !1),
            (_settings.loading = !1),
            (_settings.loaded = !0)));
      }),
      (this.unload = function () {
        _settings.src && _settings.loaded && (_this.stop(), _backing.destroy());
      }),
      (this.convolve = async function (src) {}));
  }),
  Class(function Audio3DResonance() {
    Inherit(this, Component);
    const _this = this;
    require("Audio3DSilence");
    var _context, _resonance, _orientation, _cam;
    function loop() {
      (_cam = Audio3DWA.getCamera()) &&
        _context &&
        _context.listener &&
        (_orientation.set(0, 0, -1).applyQuaternion(_cam.quaternion),
        _resonance.setListenerOrientation(
          _orientation.x,
          _orientation.y,
          _orientation.z,
          _cam.up.x,
          _cam.up.y,
          _cam.up.z,
        ),
        _resonance.setListenerPosition(
          _cam.position.x,
          _cam.position.y,
          _cam.position.z,
        ));
    }
    ((this.createAudioInput = async function (url) {
      _context || (await _this.resonance());
      let audioElementSource,
        stream = {};
      ((stream.element = Audio3DWA.getElement()),
        (stream.element.crossOrigin = "anonymous"),
        (stream.element.src = url),
        (audioElementSource = stream.element.mediaSrc
          ? stream.element.mediaSrc
          : _context.createMediaElementSource(stream.element)),
        (stream.element.mediaSrc = audioElementSource));
      let source = _resonance.createSource();
      return (
        audioElementSource.connect(source.input),
        (stream.source = source),
        stream
      );
    }),
      (this.unloadStream = function (stream) {
        (stream.element.mediaSrc.disconnect(stream.source.input),
          Audio3DWA.putElement(stream.element));
      }),
      (this.resonance = async function (refresh) {
        return (
          window.ResonanceAudio ||
            (await AssetLoader.waitForLib("ResonanceAudio")),
          await GlobalAudio3D.ready(),
          (_context && !refresh) ||
            (_context && (_context.close(), (_context = null)),
            (_orientation = new Vector3()),
            "running" !== (_context = Audio3DWA.audioContext()).state &&
              _context.resume(),
            (_resonance = new ResonanceAudio(_context)).output.connect(
              _context.destination,
            ),
            Render.start(loop)),
          _resonance
        );
      }),
      (this.setRoomProperties = function (dimensions, materials) {
        _resonance.setRoomProperties(dimensions, materials);
      }),
      this.get("initialized", () => !!_context));
  }, "static"),
  Class(function Audio3DResonanceAudio() {
    Inherit(this, Audio3DBase);
    const _this = this;
    var _stream,
      _options = {},
      _settings = { playing: !1, loaded: !1, loading: !1 },
      _orientation = new Vector3(),
      _currentTime = 0;
    function loop() {
      let pos;
      if (((pos = _this.audioPosition()), pos && _stream)) {
        _stream.source.setPosition(pos.x, pos.y, pos.z);
        let euler = _this.audioOrientationInverse();
        (_orientation.set(0, 0, -1).applyEuler(euler),
          _stream.source.setOrientation(
            _orientation.x || 0,
            _orientation.y || 0,
            _orientation.z || 0,
            _this.group.up.x || 0,
            _this.group.up.y || 0,
            _this.group.up.z || 0,
          ));
      }
    }
    function update(e) {
      ((_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate),
        (_this.volume = _this.volume),
        (_this.gain = _this.gain),
        (_this.playbackRate = _this.playbackRate));
    }
    function handleEnded() {
      (_this.unload(), _this.events.fire(Events.END));
    }
    (!(async function () {
      (Audio3DResonance.initialized || (await Audio3DResonance.resonance()),
        (function initOptions() {
          ((_options.loop = _options.loop || !1),
            (_options.autoplay = _options.autoplay || !1),
            (_options.volume =
              void 0 === _options.volume ? 1 : _options.volume),
            (_options.playbackRate = _options.playbackRate || 1),
            (_options.preload = _options.preload || !1),
            (_options.muted = _options.muted || !1),
            (_options.rolloff = _options.rolloff || 1),
            (_options.selfDestruct = _options.selfDestruct || !1),
            (_options.globalMuted = GlobalAudio3D.muted),
            (_options.globalVolume = GlobalAudio3D.volume),
            (_options.globalPlaybackRate = GlobalAudio3D.playbackRate),
            (_options.gain =
              "number" == typeof _options.gain
                ? _options.gain
                : ResonanceAudio.Utils.DEFAULT_SOURCE_GAIN),
            (_options.sourceWidth =
              "number" == typeof _options.sourceWidth
                ? _options.sourceWidth
                : ResonanceAudio.Utils.DEFAULT_SOURCE_WIDTH),
            (_options.directivitySharpness =
              "number" == typeof _options.directivitySharpness
                ? _options.directivitySharpness
                : ResonanceAudio.Utils.DEFAULT_DIRECTIVITY_SHARPNESS),
            (_options.directivityAlpha =
              "number" == typeof _options.directivityAlpha
                ? _options.directivityAlpha
                : ResonanceAudio.Utils.DEFAULT_DIRECTIVITY_ALPHA));
        })(),
        (function addListeners() {
          _this.events.sub(GlobalAudio3D, Events.UPDATE, update);
        })());
    })(),
      this.set("src", (src) => {
        (_this.stop(),
          (_settings.src = src),
          defer((_) => {
            if (_options.autoplay) return _this.play();
            (_options.preload && _this.load(),
              (_this.volume = _this.volume),
              (_this.gain = _this.gain));
          }));
      }),
      this.get("src", (_) => _settings.src),
      this.get("selfDestruct", (_) => _options.selfDestruct),
      this.set("selfDestruct", (d) => {
        _options.selfDestruct = d;
      }),
      this.set(
        "volume",
        (v) => (
          (_options.volume = v),
          _stream &&
            (_stream.element.volume =
              _options.muted || _options.globalMuted
                ? 0
                : v * Math.clamp(_options.globalVolume)),
          _options.volume
        ),
      ),
      this.get("volume", (_) => _options.volume),
      this.get("gain", () => _options.gain),
      this.set("gain", (v) => {
        ((_options.gain = v),
          _stream &&
            _stream.source.setGain(
              _options.gain * Math.max(1, _options.globalVolume),
            ));
      }),
      this.set(
        "loop",
        (l) => (
          (l = !!l),
          _stream && (_stream.element.loop = l),
          (_options.loop = l)
        ),
      ),
      this.get("loop", (_) => _options.loop),
      this.set("autoplay", (autoplay) => {
        _options.autoplay = autoplay;
      }),
      this.get("autoplay", (_) => _options.autoplay),
      this.set("preload", (preload) => {
        _options.preload = preload;
      }),
      this.get("preload", (_) => _options.preload),
      this.get("ready", (_) => _this.ready),
      this.get("frequency", (_) => []),
      this.get("activity", (_) => 0),
      this.get("playing", (_) => _settings.playing),
      this.set("rolloff", (r) => {
        _options.rolloff = r;
      }),
      this.get("rolloff", (_) => _options.rolloff),
      this.get("loaded", (_) => _settings.loaded),
      this.get("currentTime", (_) => _currentTime),
      this.set("currentTime", (t) => {
        _this.seek(t);
      }),
      this.get("duration", (_) => (_stream ? _stream.element.duration : 0)),
      this.get("progress", (_) => _this.currentTime / _this.duration),
      this.get("visibilityMuted", (_) => _options.muted),
      this.set("visibilityMuted", (muted) => {
        (!0 === muted
          ? (_options.muteState = _options.muted)
          : void 0 !== _options.muteState &&
            ((muted = _options.muteState), delete _options.muteState),
          _options.muted !== muted &&
            ((_options.muted = muted), (_this.volume = _this.volume)));
      }),
      this.get("muted", (_) => _options.muted),
      this.set("muted", (muted) => {
        ((_options.muted = muted), (_this.volume = _this.volume));
      }),
      this.set("playbackRate", (v) => {
        _options.playbackRate = v;
      }),
      this.get("playbackRate", (_) => _options.playbackRate),
      this.get("sourceWidth", () => _options.sourceWidth),
      this.set("sourceWidth", (v) => {
        ((_options.sourceWidth = v),
          _stream && _stream.source.setSourceWidth(_options.sourceWidth));
      }),
      this.get("directivitySharpness", () => _options.directivitySharpness),
      this.set("directivitySharpness", (v) => {
        ((_options.directivitySharpness = v),
          _stream &&
            _stream.source.setDirectivityPattern(
              _options.directivityAlpha,
              _options.directivitySharpness,
            ));
      }),
      this.get("directivityAlpha", () => _options.directivityAlpha),
      this.set("directivityAlpha", (v) => {
        ((_options.directivityAlpha = v),
          _stream &&
            _stream.source.setDirectivityPattern(
              _options.directivityAlpha,
              _options.directivitySharpness,
            ));
      }),
      (this.play = async function () {
        ((_settings.autoplay = !0),
          _settings.src &&
            ((_settings.loadingPlay = !0),
            _settings.loading ||
              _settings.playing ||
              (_settings.loaded || (await _this.load()),
              (_settings.playing = !0),
              (_this.volume = _options.volume),
              (_this.playbackRate = _options.playbackRate),
              _this.startRender(loop),
              (_stream.element.currentTime = _currentTime),
              _stream.element.play())));
      }),
      (this.pause = function () {
        ((_settings.autoplay = !1),
          _settings.src &&
            _settings.loaded &&
            _settings.playing &&
            ((_settings.loadingPlay = !1),
            (_settings.playing = !1),
            _stream && _stream.element.pause(),
            _this.stopRender(loop)));
      }),
      (this.stop = function () {
        ((_settings.autoplay = !1),
          _settings.loaded &&
            ((_currentTime = 0),
            _stream &&
              (_stream.element.pause(), (_stream.element.currentTime = 0)),
            (_settings.playing = !1),
            _this.stopRender(loop)));
      }),
      (this.seek = function (time) {
        if (_settings.src) {
          _settings.loadingPlay = !1;
          var wasPlaying = _settings.playing;
          ((_currentTime = time),
            _stream &&
              (_stream.element.seek(_currentTime),
              wasPlaying && _stream.element.play()));
        }
      }),
      (this.load = async function () {
        _settings.src &&
          (_settings.loading ||
            _settings.loaded ||
            ((_settings.loading = !0),
            (_this.ready = await (async function createBuffer() {
              let promise = Promise.create(),
                url = _settings.src;
              return (
                (_stream =
                  await Audio3DResonance.createAudioInput(
                    url,
                  )).element.addEventListener("ended", handleEnded),
                (_this.loop = _this.loop),
                (_this.volume = _this.volume),
                (_this.rolloff = _this.rolloff),
                (_this.muted = _this.muted),
                (_this.gain = _this.gain),
                (_this.sourceWidth = _this.sourceWidth),
                (_this.directivitySharpness = _this.directivitySharpness),
                (_this.directivityAlpha = _this.directivityAlpha),
                (_stream.element.currentTime = _currentTime),
                (_stream.element.volume = _this.volume),
                (_stream.element.onloadeddata = promise.resolve),
                _stream.element.load(),
                (_options.autoplay || _settings.autoplay) && _this.play(),
                promise
              );
            })()),
            _this.events.fire(Events.LOADED),
            (_settings.loadingPlay = !1),
            (_settings.loading = !1),
            (_settings.loaded = !0)));
      }),
      (this.unload = function () {
        _settings.src &&
          _settings.loaded &&
          (_this.stop(),
          (function destroyStream() {
            _stream &&
              ((_settings.loaded = !1),
              _stream.element.removeEventListener("ended", handleEnded),
              Audio3DResonance.unloadStream(_stream),
              (_stream = null));
          })());
      }));
  }),
  Class(function Audio3DWA() {
    Inherit(this, Component);
    const _this = this,
      _silence = require("Audio3DSilence");
    var _context,
      _orientation,
      _cam,
      _pool,
      _streams = {},
      _buffers = {};
    function loop() {
      (_cam = _this.getCamera()) &&
        _cam.getWorldQuaternion &&
        _context &&
        _context.listener &&
        (_orientation.set(0, 0, -1).applyQuaternion(_cam.getWorldQuaternion()),
        _context.listener.forwardX
          ? (_context.listener.forwardX.setValueAtTime(
              _orientation.x,
              _context.currentTime,
            ),
            _context.listener.forwardY.setValueAtTime(
              _orientation.y,
              _context.currentTime,
            ),
            _context.listener.forwardZ.setValueAtTime(
              _orientation.z,
              _context.currentTime,
            ),
            _context.listener.upX.setValueAtTime(
              _cam.up.x,
              _context.currentTime,
            ),
            _context.listener.upY.setValueAtTime(
              _cam.up.y,
              _context.currentTime,
            ),
            _context.listener.upZ.setValueAtTime(
              _cam.up.z,
              _context.currentTime,
            ))
          : (_context.listener.setOrientation &&
              _context.listener.setOrientation(
                _orientation.x || 0,
                _orientation.y || 0,
                _orientation.z || 0,
                _cam.up.x || 0,
                _cam.up.y || 0,
                _cam.up.z || 0,
              ),
            _context.listener.setPosition &&
              _context.listener.setPosition(
                _cam.position.x || 0,
                _cam.position.y || 0,
                _cam.position.z || 0,
              ),
            _context.listener.setVelocity &&
              _context.listener.setVelocity(0, 0, 0)));
    }
    function createAudioElement() {
      let audio;
      return (
        GlobalAudio3D.fallback
          ? ((audio = document.createElement("audio")),
            (audio.style.visibility = "hidden"),
            document.body.appendChild(audio),
            (audio.source = document.createElement("source")),
            audio.appendChild(audio.source),
            audio.setAttribute("controls", ""),
            audio.source.setAttribute("src", _silence),
            audio.source.setAttribute("type", "audio/mp3"),
            audio.play())
          : ((audio = new Audio()),
            (audio.src = _silence),
            audio.play().catch((e) => {})),
        audio
      );
    }
    function handleContextStateChange() {
      _this.suspended !== _this.flag("interactHandlerActive") &&
        (_this.suspended
          ? (Device.mobile
              ? _this.events.sub(Mouse.input, Interaction.CLICK, _this.resume)
              : document.addEventListener("mouseup", _this.resume, {
                  passive: !1,
                }),
            _this.flag("interactHandlerActive", !0))
          : (Device.mobile
              ? _this.events.unsub(Mouse.input, Interaction.CLICK, _this.resume)
              : document.removeEventListener("mouseup", _this.resume, {
                  passive: !1,
                }),
            _this.flag("interactHandlerActive", !1)));
    }
    ((this.createPool = function (n = 10) {
      ((_pool = _this.initClass(ObjectPool, createAudioElement, n)),
        _this.flag("init", !0));
    }),
      (this.audioContext = function (refresh) {
        let firstTime = !_context;
        return (
          (_context && !refresh) ||
            (_context &&
              (_context.close(),
              _context.removeEventListener(
                "statechange",
                handleContextStateChange,
              ),
              (_context = null)),
            (_orientation = new Vector3()),
            ((_context = new (window.AudioContext || window.webkitAudioContext)(
              { sampleRate: 48e3 },
            )).dest = _context.createMediaStreamDestination()),
            _context.addEventListener("statechange", handleContextStateChange),
            Render.start(loop),
            firstTime &&
              (GlobalAudio3D.initialized
                ? _this.suspended && handleContextStateChange()
                : GlobalAudio3D.interacted.then(_this.resume))),
          _context
        );
      }),
      (this.unloadBuffer = function (url) {
        _buffers[url] && delete _buffers[url];
      }),
      (this.loadBuffer = async function (url) {
        if (!_buffers[url]) {
          _buffers[url] = { loaded: Promise.create(), data: null };
          var response = await fetch(url),
            buffer = await response.arrayBuffer();
          _this.audioContext().decodeAudioData(buffer, (data) => {
            ((_buffers[url].data = data), _buffers[url].loaded.resolve());
          });
        }
        return (await _buffers[url].loaded, _buffers[url].data);
      }),
      (this.unloadStream = function (url) {
        _streams[url] &&
          ((_streams[url].stream.element.src = _silence),
          _streams[url].stream.element.load(),
          _streams[url].count--,
          _pool.put(_streams[url].stream.element),
          0 == _streams[url].count &&
            defer((_) => {
              delete _streams[url];
            }));
      }),
      (this.loadStream = function (url) {
        let isElement = "string" != typeof url && void 0 !== url,
          element = null;
        if (
          (isElement &&
            ((element = url),
            (url = element.src
              ? element.src
              : element.srcObject
                ? element.srcObject.id
                : "")),
          !_streams[url])
        ) {
          let stream = {};
          ((_streams[url] = { stream: null, count: 0 }),
            isElement
              ? ((stream.element = element),
                element.setAttribute("muted", !0),
                (element.muted = !0))
              : ((stream.element = _this.getElement()),
                (stream.element.crossOrigin = "anonymous"),
                (stream.element.src = url)),
            GlobalAudio3D.fallback
              ? stream.element.setAttribute("src", url)
              : (stream.element.mediaSrc
                  ? (stream.source = stream.element.mediaSrc)
                  : stream.element.srcObject
                    ? ((stream.source = _this
                        .audioContext()
                        .createMediaStreamSource(stream.element.srcObject)),
                      (new Audio().srcObject = element.srcObject))
                    : (stream.source = _this
                        .audioContext()
                        .createMediaElementSource(stream.element)),
                (stream.element.mediaSrc = stream.source)),
            isElement || stream.element.load(),
            (_streams[url].stream = stream));
        }
        return (_streams[url].count++, _streams[url].stream);
      }),
      (this.getActiveStreamCount = function (stream) {
        for (let key in _streams)
          if (_streams[key].stream == stream) return _streams[key].count;
        return -1;
      }),
      (this.purge = function () {
        for (let stream in _streams) _this.unloadStream(stream);
        for (let buffer in _buffers) _this.unloadBuffer(buffer);
      }),
      (this.getElement = function () {
        return (_pool || _this.createPool(), _pool.get());
      }),
      (this.putElement = function (audio) {
        ((audio.src = _silence), audio.load(), _pool.put(audio));
      }),
      (this.useCamera = function (camera) {
        _this.CAMERA = camera;
      }),
      (this.getCamera = function () {
        return (_this.CAMERA || (_this.CAMERA = World.CAMERA), _this.CAMERA);
      }),
      this.get(
        "suspended",
        () =>
          !_context ||
          "interrupted" === _context.state ||
          "suspended" === _context.state,
      ),
      (this.resume = async function () {
        (_context || _this.audioContext(),
          _this.suspended && (await _context.resume()));
      }));
  }, "static"),
  Class(function Audio3DWABuffer() {
    Inherit(this, Audio3DBase);
    const _this = this;
    var _context,
      _buffer,
      _stream,
      _gain,
      _panner,
      _analyser,
      _filter,
      _delay,
      _convolver,
      _position,
      _frequency,
      _convolution,
      _options = {},
      _settings = { playing: !1, loaded: !1, loading: !1 },
      _currentTime = 0,
      _startTime = 0;
    function loop() {
      _context &&
        ((_position = _context.listener.forwardX
          ? _this.audioPosition().sub(_this.listenerPosition())
          : _this.audioPosition()),
        _panner.setPosition(_position.x, _position.y, _position.z));
    }
    function initContext() {
      ((_context = Audio3DWA.audioContext()),
        (_gain = _context.createGain
          ? _context.createGain()
          : _context.createGainNode()),
        (_panner = _context.createPanner()),
        ((_filter = _context.createBiquadFilter()).type = "lowshelf"),
        (_filter.frequency.value = 0),
        (_filter.gain.value = 1),
        (_analyser = _context.createAnalyser()),
        ((_delay = _context.createDelay(10)).delayTime.value = 0),
        (_analyser.fftSize = 32),
        (_frequency = new Uint8Array(_analyser.frequencyBinCount)),
        _analyser.connect(_context.destination),
        _delay.connect(_analyser),
        _filter.connect(_delay),
        _convolver
          ? (_convolver.connect(_filter), _gain.connect(_convolver))
          : _gain.connect(_filter),
        _panner.connect(_gain));
    }
    function initOptions() {
      ((_options.loop = _options.loop || !1),
        (_options.autoplay = _options.autoplay || !1),
        (_options.volume = void 0 === _options.volume ? 1 : _options.volume),
        (_options.playbackRate = _options.playbackRate || 1),
        (_options.preload = _options.preload || !1),
        (_options.muted = _options.muted || !1),
        (_options.rolloff = _options.rolloff || 1),
        (_options.selfDestruct = _options.selfDestruct || !1),
        (_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate));
    }
    function destroyBuffer() {
      if (_buffer && _stream) {
        _settings.loaded = !1;
        try {
          (_stream.disconnect(_panner),
            _convolver
              ? (_convolver.disconnect(_filter), _gain.disconnect(_convolver))
              : _gain.disconnect(_filter),
            _analyser.disconnect(_context.destination),
            _buffer.stop(),
            (_buffer = null),
            Audio3DWA.unloadBuffer(_settings.src));
        } catch (e) {}
      }
    }
    async function createStream() {
      _stream ||
        (((_stream = _context.createBufferSource()).buffer = _buffer.buffer),
        (_stream.loop = _options.loop),
        (_stream.playbackRate = _options.playbackRate),
        (_stream.onended = (_) => {
          _this &&
            _this.stop &&
            (_this.stop(),
            _this.events.fire(Events.END),
            _options.selfDestruct && _this.parent.destroy());
        }),
        (_this.volume = _this.volume),
        (_this.rolloff = _this.rolloff),
        (_this.muted = _this.muted),
        _stream.connect(_panner),
        _settings.loadingPlay && (_startTime = _context.currentTime, _stream.start(0, _currentTime)));
    }
    function destroyStream() {
      if (_stream) {
        _stream.onended = null;
        try {
          (_stream.disconnect(_panner), _stream.stop());
        } catch (e) {}
        _stream = null;
      }
    }
    function update(e) {
      ((_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate),
        (_this.volume = _this.volume),
        (_this.playbackRate = _this.playbackRate));
    }
    function ready() {
      (destroyBuffer(),
        destroyStream(),
        (_context = null),
        (_gain = null),
        (_panner = null),
        (_analyser = null),
        (_delay = null),
        (_frequency = null),
        (_filter = null),
        initContext(),
        initOptions(),
        _convolution && _this.convolve(_convolution),
        (_options.autoplay || _settings.autoplay) && _this.play());
    }
    (!(async function () {
      (initContext(),
        initOptions(),
        (function addListeners() {
          (_this.events.sub(GlobalAudio3D, Events.UPDATE, update),
            _this.events.sub(GlobalAudio3D, Events.READY, ready));
        })());
    })(),
      this.set("src", (src) => {
        (_this.stop(),
          (_settings.src = src),
          defer((_) => {
            if (_options.autoplay) return _this.play();
            (_options.preload && _this.load(),
              (_this.volume = _options.volume));
          }));
      }),
      this.get("src", (_) => _settings.src),
      this.get("selfDestruct", (_) => _options.selfDestruct),
      this.set("selfDestruct", (d) => {
        _options.selfDestruct = d;
      }),
      this.set(
        "volume",
        (v) => (
          (_options.volume = v),
          _gain &&
            (_gain.gain.value =
              _options.muted || _options.globalMuted
                ? 0
                : v * _options.globalVolume),
          _options.volume
        ),
      ),
      this.get("volume", (_) => _options.volume),
      this.set(
        "loop",
        (l) => ((l = !!l), _stream && (_stream.loop = l), (_options.loop = l)),
      ),
      this.get("loop", (_) => _options.loop),
      this.set("autoplay", (autoplay) => {
        _options.autoplay = autoplay;
      }),
      this.get("autoplay", (_) => _options.autoplay),
      this.set("preload", (preload) => {
        _options.preload = preload;
      }),
      this.get("preload", (_) => _options.preload),
      this.get("ready", (_) => _this.ready),
      this.get("frequency", (_) =>
        _analyser
          ? (_analyser.getByteFrequencyData(_frequency), _frequency)
          : [],
      ),
      this.get("activity", (_) =>
        _analyser
          ? (_analyser.getByteFrequencyData(_frequency),
            Math.clamp(
              _frequency.slice(3, 13).reduce((n1, n2) => n1 + n2, 0) / 2560,
              0,
              1,
            ))
          : 0,
      ),
      this.get("playing", (_) => _settings.playing),
      this.set("rolloff", (r) => {
        ((_options.rolloff = r), _panner && (_panner.rolloffFactor = r));
      }),
      this.get("rolloff", (_) => _options.rolloff),
      this.get("loaded", (_) => _settings.loaded),
      this.get("currentTime", (_) => {
        if (_settings.playing && _context && _buffer) {
          return (_currentTime + (_context.currentTime - _startTime)) % _buffer.buffer.duration;
        }
        return _currentTime;
      }),
      this.set("currentTime", (t) => {
        _this.seek(t);
      }),
      this.get("visibilityMuted", (_) => _options.muted),
      this.set("visibilityMuted", (muted) => {
        (!0 === muted
          ? (_options.muteState = _options.muted)
          : void 0 !== _options.muteState &&
            ((muted = _options.muteState), delete _options.muteState),
          _options.muted !== muted &&
            ((_options.muted = muted), (_this.volume = _this.volume)));
      }),
      this.get("muted", (_) => _options.muted),
      this.set("muted", (muted) => {
        ((_options.muted = muted), (_this.volume = _this.volume));
      }),
      this.set("playbackRate", (v) => {
        ((_options.playbackRate = v),
          _stream &&
            (_stream.playbackRate.value = v * _options.globalPlaybackRate));
      }),
      this.get("playbackRate", (_) => _options.playbackRate),
      this.get("filter", (_) => _filter),
      this.get("delay", (_) => _delay),
      this.get("panner", (_) => _panner),
      this.get("duration", (_) => (_buffer ? _buffer.buffer.duration : 0)),
      this.get("progress", (_) => _this.currentTime / _this.duration),
      this.get("context", (_) => _context),
      this.get("stream", (_) => _stream),
      this.get("buffer", (_) => _buffer),
      (this.play = async function () {
        ((_settings.autoplay = !0),
          _settings.src &&
            GlobalAudio3D.initialized &&
            ((_settings.loadingPlay = !0),
            _stream ||
              _settings.loading ||
              _settings.playing ||
              (_settings.loaded || (await _this.load()),
              await createStream(),
              (_settings.playing = !0),
              (_this.volume = _options.volume),
              _this.startRender(loop))));
      }),
      (this.pause = function () {
        ((_settings.autoplay = !1),
          _stream &&
            GlobalAudio3D.initialized &&
            _settings.src &&
            _settings.loaded &&
            _settings.playing &&
            ((_currentTime = (_currentTime + (_context.currentTime - _startTime)) % _buffer.buffer.duration),
            destroyStream(),
            (_settings.loadingPlay = !1),
            (_settings.playing = !1),
            _this.stopRender(loop)));
      }),
      (this.stop = function () {
        ((_settings.autoplay = !1),
          _settings.src &&
            GlobalAudio3D.initialized &&
            _settings.loaded &&
            ((_currentTime = 0),
            (_startTime = 0),
            destroyStream(),
            (_settings.loading = !1),
            (_settings.loaded = !1),
            (_settings.loadingPlay = !1),
            (_settings.playing = !1),
            _this.stopRender(loop)));
      }),
      (this.seek = function (time) {
        if (_settings.src) {
          _settings.loadingPlay = !1;
          var wasPlaying = _settings.playing;
          (_this.stop(), (_currentTime = time), wasPlaying && _this.play());
        }
      }),
      (this.load = async function () {
        _settings.src &&
          (_settings.loading ||
            _settings.loaded ||
            ((_settings.loading = !0),
            (_this.ready = await (async function createBuffer() {
              (((_buffer = _context.createBufferSource()).buffer =
                await Audio3DWA.loadBuffer(_settings.src)),
                (_settings.loaded = !0));
            })()),
            await createStream(),
            _options.autoplay || _settings.loadingPlay || destroyStream(),
            _this.events.fire(Events.LOADED),
            (_settings.loadingPlay = !1),
            (_settings.loading = !1),
            (_settings.loaded = !0)));
      }),
      (this.unload = function () {
        _settings.src && _settings.loaded && (_this.stop(), destroyBuffer());
      }),
      (this.convolve = async function (src) {
        if (((_convolution = src), !1 === src))
          return void (
            _convolver &&
            (_convolver.disconnect(),
            _gain.disconnect(),
            _gain.connect(_filter),
            (_convolver = null))
          );
        let buffer = await Audio3DWA.loadBuffer(src);
        (_convolver ||
          ((_convolver = _context.createConvolver()),
          _gain.disconnect(),
          _convolver.connect(_filter),
          _gain.connect(_convolver)),
          (_convolver.buffer = buffer));
      }));
  }),
  Class(function Audio3DWASimpleBuffer() {
    Inherit(this, Audio3DBase);
    const _this = this;
    var _context,
      _buffer,
      _stream,
      _gain,
      _filter,
      _options = {},
      _settings = { playing: !1, loaded: !1, loading: !1 },
      _currentTime = 0,
      _startTime = 0;
    function initContext() {
      ((_context = Audio3DWA.audioContext()),
        ((_filter = _context.createBiquadFilter()).type = "lowpass"),
        (_filter.fValue = 16e3),
        (_filter.frequency.value = 16e3),
        _filter.connect(_context.destination),
        (_gain = _context.createGain
          ? _context.createGain()
          : _context.createGainNode()).connect(_filter));
    }
    function initOptions() {
      ((_options.loop = _options.loop || !1),
        (_options.autoplay = _options.autoplay || !1),
        (_options.volume = void 0 === _options.volume ? 1 : _options.volume),
        (_options.playbackRate = _options.playbackRate || 1),
        (_options.preload = _options.preload || !1),
        (_options.muted = _options.muted || !1),
        (_options.selfDestruct = _options.selfDestruct || !1),
        (_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate));
    }
    function destroyBuffer() {
      _buffer &&
        _stream &&
        ((_settings.loaded = !1),
        _stream.disconnect(_gain),
        _gain.disconnect(_filter),
        _filter.disconnect(_context.destination),
        _buffer.stop(),
        (_buffer = null),
        Audio3DWA.unloadBuffer(_settings.src));
    }
    async function createStream() {
      _stream ||
        (((_stream = _context.createBufferSource()).buffer = _buffer.buffer),
        (_stream.loop = _options.loop),
        (_stream.playbackRate = _options.playbackRate),
        (_stream.onended = (_) => {
          (_this.stop(), _options.selfDestruct && _this.parent.destroy());
        }),
        (_this.volume = _this.volume),
        (_this.rolloff = _this.rolloff),
        (_this.muted = _this.muted),
        _stream.connect(_gain),
        _settings.loadingPlay && (_startTime = _context.currentTime, _stream.start(0, _currentTime)));
    }
    function destroyStream(fromPause = !1) {
      if (_stream) {
        _stream.onended = null;
        _stream.disconnect(_gain);
        try {
          (_stream.stop(), fromPause || _this.events.fire(Events.END));
        } catch (e) {}
        _stream = null;
      }
    }
    function muffle({ isMuffled: isMuffled }) {
      const logLerp = (a, b, t) =>
        Math.exp((1 - t) * Math.log(a) + t * Math.log(b));
      let obj = { value: 0 };
      tween(obj, { value: 1 }, 500, "linear").onUpdate((_) => {
        ((_filter.fValue = logLerp(
          500,
          16e3,
          isMuffled ? 1 - obj.value : obj.value,
        )),
          (_filter.frequency.value = logLerp(
            500,
            16e3,
            isMuffled ? 1 - obj.value : obj.value,
          )));
      });
    }
    function update(e) {
      ((_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate),
        (_this.volume = _this.volume),
        (_this.playbackRate = _this.playbackRate));
    }
    function ready() {
      (destroyBuffer(),
        destroyStream(),
        (_context = null),
        (_gain = null),
        initContext(),
        initOptions(),
        (_options.autoplay || _settings.autoplay) && _this.play());
    }
    (initContext(),
      initOptions(),
      (function addListeners() {
        (_this.events.sub(GlobalAudio3D, Events.UPDATE, update),
          _this.events.sub(GlobalAudio3D, Events.READY, ready),
          _this.events.sub(GlobalAudio3D, Events.MESSAGE, muffle));
      })(),
      this.set("src", (src) => {
        (_this.stop(),
          (_settings.src = src),
          defer((_) => {
            if (_options.autoplay) return _this.play();
            (_options.preload && _this.load(),
              (_this.volume = _options.volume));
          }));
      }),
      this.get("src", (_) => _settings.src),
      this.get("selfDestruct", (_) => _options.selfDestruct),
      this.set("selfDestruct", (d) => {
        _options.selfDestruct = d;
      }),
      this.set(
        "volume",
        (v) => (
          (_options.volume = v),
          _gain &&
            (_gain.gain.value =
              _options.muted || _options.globalMuted
                ? 0
                : v * _options.globalVolume),
          _options.volume
        ),
      ),
      this.get("volume", (_) => _options.volume),
      this.set(
        "loop",
        (l) => ((l = !!l), _stream && (_stream.loop = l), (_options.loop = l)),
      ),
      this.get("loop", (_) => _options.loop),
      this.set("autoplay", (autoplay) => {
        _options.autoplay = autoplay;
      }),
      this.get("autoplay", (_) => _options.autoplay),
      this.set("preload", (preload) => {
        _options.preload = preload;
      }),
      this.get("preload", (_) => _options.preload),
      this.get("ready", (_) => _this.ready),
      this.get("playing", (_) => _settings.playing),
      this.get("loaded", (_) => _settings.loaded),
      this.get("currentTime", (_) => {
        if (_settings.playing && _context && _buffer) {
          return (_currentTime + (_context.currentTime - _startTime)) % _buffer.buffer.duration;
        }
        return _currentTime;
      }),
      this.set("currentTime", (t) => {
        _this.seek(t);
      }),
      this.get("visibilityMuted", (_) => _options.muted),
      this.set("visibilityMuted", (muted) => {
        (!0 === muted
          ? (_options.muteState = _options.muted)
          : void 0 !== _options.muteState &&
            ((muted = _options.muteState), delete _options.muteState),
          _options.muted !== muted &&
            ((_options.muted = muted), (_this.volume = _this.volume)));
      }),
      this.get("muted", (_) => _options.muted),
      this.set("muted", (muted) => {
        ((_options.muted = muted), (_this.volume = _this.volume));
      }),
      this.set("playbackRate", (v) => {
        ((_options.playbackRate = v),
          _stream &&
            (_stream.playbackRate.value = v * _options.globalPlaybackRate));
      }),
      this.get("playbackRate", (_) => _options.playbackRate),
      this.get("duration", (_) => (_buffer ? _buffer.buffer.duration : 0)),
      this.get("progress", (_) => _this.currentTime / _this.duration),
      this.get("context", (_) => _context),
      this.get("stream", (_) => _stream),
      this.get("buffer", (_) => _buffer),
      (this.play = async function () {
        ((_settings.autoplay = !0),
          _settings.src &&
            GlobalAudio3D.initialized &&
            ((_settings.loadingPlay = !0),
            _stream ||
              _settings.loading ||
              _settings.playing ||
              (_settings.loaded || (await _this.load()),
              await createStream(),
              (_settings.playing = !0),
              (_this.volume = _options.volume))));
      }),
      (this.pause = function () {
        ((_settings.autoplay = !1),
          _stream &&
            GlobalAudio3D.initialized &&
            _settings.src &&
            _settings.loaded &&
            _settings.playing &&
            ((_currentTime = (_currentTime + (_context.currentTime - _startTime)) % _buffer.buffer.duration),
            destroyStream(!0),
            (_settings.loadingPlay = !1),
            (_settings.playing = !1)));
      }),
      (this.stop = function () {
        ((_settings.autoplay = !1),
          _settings.src &&
            GlobalAudio3D.initialized &&
            _settings.loaded &&
            ((_currentTime = 0),
            (_startTime = 0),
            destroyStream(),
            (_settings.loading = !1),
            (_settings.loaded = !1),
            (_settings.loadingPlay = !1),
            (_settings.playing = !1)));
      }),
      (this.seek = function (time) {
        if (_settings.src) {
          _settings.loadingPlay = !1;
          var wasPlaying = _settings.playing;
          (_stream && (_stream.onended = null),
            _this.stop(),
            (_currentTime = time),
            wasPlaying && _this.play());
        }
      }),
      (this.load = async function () {
        _settings.src &&
          (_settings.loading ||
            _settings.loaded ||
            ((_settings.loading = !0),
            (_this.ready = await (async function createBuffer() {
              (((_buffer = _context.createBufferSource()).buffer =
                await Audio3DWA.loadBuffer(_settings.src)),
                (_settings.loaded = !0));
            })()),
            await createStream(),
            _options.autoplay ||
              _settings.loadingPlay ||
              ((_stream.onended = null), destroyStream()),
            _this.events.fire(Events.LOADED),
            (_settings.loadingPlay = !1),
            (_settings.loading = !1),
            (_settings.loaded = !0)));
      }),
      (this.unload = function () {
        _settings.src && _settings.loaded && (_this.stop(), destroyBuffer());
      }),
      (this.convolve = async function (src) {}));
  }),
  Class(function Audio3DWAStream() {
    Inherit(this, Audio3DBase);
    const _this = this;
    var _context,
      _stream,
      _gain,
      _panner,
      _analyser,
      _filter,
      _delay,
      _convolver,
      _position,
      _frequency,
      _convolution,
      _options = {},
      _settings = { playing: !1, loaded: !1, loading: !1 },
      _currentTime = 0;
    function loop() {
      _context &&
        ((_position = _context.listener.forwardX
          ? _this.audioPosition().sub(_this.listenerPosition())
          : _this.audioPosition()),
        _panner.setPosition(_position.x, _position.y, _position.z));
    }
    function initContext() {
      ((_context = Audio3DWA.audioContext()),
        (_gain = _context.createGain
          ? _context.createGain()
          : _context.createGainNode()),
        (_panner = _context.createPanner()),
        ((_analyser = _context.createAnalyser()).fftSize = 32),
        (_frequency = new Uint8Array(_analyser.frequencyBinCount)),
        ((_filter = _context.createBiquadFilter()).type = "lowshelf"),
        (_filter.frequency.value = 0),
        (_filter.gain.value = 1),
        ((_delay = _context.createDelay(10)).delayTime.value = 0));
    }
    function initOptions() {
      ((_options.loop = _options.loop || !1),
        (_options.autoplay = _options.autoplay || !1),
        (_options.volume = void 0 === _options.volume ? 1 : _options.volume),
        (_options.playbackRate = _options.playbackRate || 1),
        (_options.preload = _options.preload || !1),
        (_options.muted = _options.muted || !1),
        (_options.rolloff = _options.rolloff || 1),
        (_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate));
    }
    function createStream() {
      _stream ||
        ((_stream = Audio3DWA.loadStream(
          _settings.src,
        )).element.addEventListener("ended", handleEnded),
        (_this.loop = _this.loop),
        (_this.volume = _this.volume),
        (_this.rolloff = _this.rolloff),
        (_this.muted = _this.muted),
        _stream.source.connect(_panner),
        _panner.connect(_gain),
        _convolver
          ? (_gain.connect(_convolver), _convolver.connect(_filter))
          : _gain.connect(_filter),
        _filter.connect(_delay),
        _delay.connect(_analyser),
        _analyser.connect(_context.destination),
        (_stream.element.currentTime = _currentTime),
        (_options.autoplay || _settings.autoplay) && _this.play());
    }
    function destroyStream() {
      _stream &&
        (_stream.element.removeEventListener("ended", handleEnded),
        _stream.source.disconnect(_panner),
        (_stream = null));
    }
    function update(e) {
      ((_options.globalMuted = GlobalAudio3D.muted),
        (_options.globalVolume = GlobalAudio3D.volume),
        (_options.globalPlaybackRate = GlobalAudio3D.playbackRate),
        (_this.volume = _this.volume),
        (_this.playbackRate = _this.playbackRate));
    }
    function ready() {
      (destroyStream(),
        (_context = null),
        (_gain = null),
        (_panner = null),
        (_analyser = null),
        (_delay = null),
        (_filter = null),
        (_frequency = null),
        initContext(),
        initOptions(),
        _convolution && _this.convolve(_convolution),
        (_settings.autoplay || _options.autoplay) && _this.play());
    }
    function handleEnded() {
      (_this.unload(), _this.events.fire(Events.END));
    }
    (initOptions(),
      initContext(),
      (function addListeners() {
        (_this.events.sub(GlobalAudio3D, Events.UPDATE, update),
          _this.events.sub(GlobalAudio3D, Events.READY, ready));
      })(),
      this.set("src", (src) => {
        if ((destroyStream(), (_settings.src = src), _options.autoplay))
          return _this.play();
        _options.preload && _this.load();
      }),
      this.get("src", (_) => _settings.src),
      this.set(
        "volume",
        (v) => (
          (v = Math.clamp(v, 0, 1)),
          (_options.volume = v),
          _gain &&
            (_gain.gain.value =
              _options.muted || _options.globalMuted
                ? 0
                : v * _options.globalVolume),
          _options.volume
        ),
      ),
      this.get("volume", (_) => _options.volume),
      this.set(
        "loop",
        (l) => (
          (l = !!l),
          _stream && (_stream.element.loop = l),
          (_options.loop = l)
        ),
      ),
      this.get("loop", (_) => _options.loop),
      this.set("autoplay", (autoplay) => {
        _options.autoplay = autoplay;
      }),
      this.get("autoplay", (_) => _options.autoplay),
      this.set("preload", (preload) => {
        _options.preload = preload;
      }),
      this.get("preload", (_) => _options.preload),
      this.get("ready", (_) => !!_stream),
      this.get(
        "frequency",
        (_) => (
          _analyser && _analyser.getByteFrequencyData(_frequency),
          _frequency
        ),
      ),
      this.get("activity", (_) =>
        _analyser
          ? (_analyser.getByteFrequencyData(_frequency),
            Math.clamp(
              _frequency.slice(3, 13).reduce((n1, n2) => n1 + n2, 0) / 2560,
              0,
              1,
            ))
          : 0,
      ),
      this.get("playing", (_) => _settings.playing),
      this.set("rolloff", (r) => {
        ((_options.rolloff = r), _panner && (_panner.rolloffFactor = r));
      }),
      this.get("rolloff", (_) => _options.rolloff),
      this.get("loaded", (_) => !0),
      this.get("duration", (_) => (_stream ? _stream.element.duration : 0)),
      this.get("currentTime", (_) =>
        _stream ? _stream.element.currentTime : 0,
      ),
      this.set("currentTime", (t) => {
        _this.seek(t);
      }),
      this.get("progress", (_) => _this.currentTime / _this.duration),
      this.set("playbackRate", (v) => {
        ((_options.playbackRate = v),
          _stream &&
            _stream.element &&
            (_stream.element.playbackRate = v * _options.globalPlaybackRate));
      }),
      this.get("playbackRate", (_) => _options.playbackRate),
      this.get("visibilityMuted", (_) => _options.muted),
      this.set("visibilityMuted", (muted) => {
        (!0 === muted
          ? (_options.muteState = _options.muted)
          : void 0 !== _options.muteState &&
            ((muted = _options.muteState), delete _options.muteState),
          _options.muted !== muted &&
            ((_options.muted = muted), (_this.volume = _this.volume)));
      }),
      this.get("muted", (_) => _options.muted),
      this.set("muted", (muted) => {
        ((_options.muted = muted), (_this.volume = _this.volume));
      }),
      this.get("filter", (_) => _filter),
      this.get("delay", (_) => _delay),
      this.get("panner", (_) => _panner),
      (this.play = function () {
        ((_settings.autoplay = !0),
          _settings.src &&
            (createStream(),
            _stream &&
              !0 !== _settings.playing &&
              ((_settings.playing = !0),
              (_this.volume = _this.volume),
              _this.startRender(loop),
              (_stream.element.playbackRate = _options.playbackRate
                ? _options.playbackRate
                : 1),
              _stream.element.play().catch((e) => {}))));
      }),
      (this.pause = function () {
        ((_settings.autoplay = !1),
          _stream &&
            _settings.src &&
            _settings.playing &&
            ((_currentTime = _stream.element.currentTime),
            _stream.element.pause(),
            (_settings.playing = !1),
            _this.stopRender(loop)));
      }),
      (this.stop = function () {
        ((_settings.autoplay = !1),
          _settings.src &&
            ((_currentTime = 0),
            (_settings.playing = !1),
            _this.stopRender(loop),
            _stream &&
              _stream.element &&
              _stream.element.stop &&
              (_stream.element.stop(), (_stream.element.currentTime = 0))));
      }),
      (this.seek = function (time) {
        _settings.src &&
          ((_currentTime = time),
          _stream && (_stream.element.currentTime = time));
      }),
      (this.load = function () {
        _settings.src &&
          (_settings.playing || (createStream(), _stream.element.load()));
      }),
      (this.unload = function () {
        ((_settings.autoplay = !1),
          _settings.src &&
            (_this.stop && _this.stop(),
            destroyStream(),
            Audio3DWA.unloadStream(_settings.src)));
      }),
      (this.convolve = async function (src) {
        if (((_convolution = src), !1 === src))
          return void (
            _convolver &&
            (_convolver.disconnect(),
            _gain.disconnect(),
            _gain.connect(_analyser),
            (_convolver = null))
          );
        let buffer = await Audio3DWA.loadBuffer(src);
        (_convolver ||
          ((_convolver = _context.createConvolver()),
          _gain.disconnect(),
          _convolver.connect(_analyser),
          _gain.connect(_convolver)),
          (_convolver.buffer = buffer));
      }),
      this.get("stream", (_) => _stream));
  }),
  Module(function BufferToVertices() {
    const FACES = ["a", "b", "c"];
    this.exports = {
      toVertices: function toVertices(geom) {
        !(function buildFaces(geom) {
          let attributes = geom.attributes,
            positions = attributes.position.array,
            normals = attributes.normal.array,
            uvs = attributes.uv.array,
            tempNormals = [],
            tempUVs = [];
          ((geom.vertices = []),
            (geom.faceVertexUvs = [[]]),
            (geom.faces = []));
          let indices = geom.index;
          function Face3(a, b, c, normal) {
            ((this.a = a), (this.b = b), (this.c = c), (this.normal = normal));
          }
          for (let i = 0, j = 0; i < positions.length; i += 3, j += 2)
            (geom.vertices.push(
              new Vector3(positions[i], positions[i + 1], positions[i + 2]),
            ),
              tempNormals.push(
                new Vector3(normals[i], normals[i + 1], normals[i + 2]),
              ),
              tempUVs.push(new Vector2(uvs[j], uvs[j + 1])));
          function addFace(a, b, c, materialIndex) {
            let face = new Face3(a, b, c, [
              tempNormals[a].clone(),
              tempNormals[b].clone(),
              tempNormals[c].clone(),
            ]);
            (geom.faces.push(face),
              geom.faceVertexUvs[0].push([
                tempUVs[a].clone(),
                tempUVs[b].clone(),
                tempUVs[c].clone(),
              ]));
          }
          for (var i = 0; i < indices.length; i += 3)
            addFace(indices[i], indices[i + 1], indices[i + 2]);
          !(function mergeVertices(geom) {
            var v,
              key,
              i,
              il,
              face,
              indices,
              j,
              jl,
              verticesMap = {},
              unique = [],
              changes = [],
              precisionPoints = 4,
              precision = Math.pow(10, precisionPoints);
            for (i = 0, il = geom.vertices.length; i < il; i++)
              ((v = geom.vertices[i]),
                void 0 ===
                verticesMap[
                  (key =
                    Math.round(v.x * precision) +
                    "_" +
                    Math.round(v.y * precision) +
                    "_" +
                    Math.round(v.z * precision))
                ]
                  ? ((verticesMap[key] = i),
                    unique.push(geom.vertices[i]),
                    (changes[i] = unique.length - 1))
                  : (changes[i] = changes[verticesMap[key]]));
            var faceIndicesToRemove = [];
            for (i = 0, il = geom.faces.length; i < il; i++) {
              (((face = geom.faces[i]).a = changes[face.a]),
                (face.b = changes[face.b]),
                (face.c = changes[face.c]),
                (indices = [face.a, face.b, face.c]));
              for (var n = 0; n < 3; n++)
                if (indices[n] === indices[(n + 1) % 3]) {
                  faceIndicesToRemove.push(i);
                  break;
                }
            }
            for (i = faceIndicesToRemove.length - 1; i >= 0; i--) {
              var idx = faceIndicesToRemove[i];
              for (
                geom.faces.splice(idx, 1),
                  j = 0,
                  jl = geom.faceVertexUvs.length;
                j < jl;
                j++
              )
                geom.faceVertexUvs[j].splice(idx, 1);
            }
            var diff = geom.vertices.length - unique.length;
            return ((geom.vertices = unique), diff);
          })(geom);
        })(geom);
      },
      toBuffer: function toBuffer(geom) {
        let faces = geom.faces,
          array = geom.attributes.position.array;
        for (let i = 0; i < faces.length; i++) {
          let face = faces[i];
          for (let f = 0; f < FACES.length; f++) {
            let index = face[FACES[f]],
              vertex = geom.vertices[index];
            ((array[3 * index + 0] = vertex.x),
              (array[3 * index + 1] = vertex.y),
              (array[3 * index + 2] = vertex.z));
          }
        }
      },
    };
  }),
  Class(function CookieNotice() {
    Inherit(this, Model);
    const _this = this,
      DEBUG = Utils.query("debug"),
      EEA_COUNTRIES = [
        "AT",
        "BE",
        "BG",
        "HR",
        "CY",
        "CZ",
        "DK",
        "EE",
        "FI",
        "FR",
        "DE",
        "GR",
        "HU",
        "IE",
        "IT",
        "LV",
        "LT",
        "LU",
        "MT",
        "NL",
        "PL",
        "PT",
        "RO",
        "SK",
        "SI",
        "ES",
        "SE",
        "IS",
        "LI",
        "NO",
        "GB",
      ];
    let _isInEEA, _allowCookies;
    (!(async function () {
      await Hydra.ready();
      if (Storage.get("cookies_accepted"))
        return (
          DEBUG &&
            console.log("[CookieNotice] cookies were previously accepted"),
          (_allowCookies = !0),
          (_this.dataReady = !0)
        );
      if (Storage.get("cookies_declined"))
        return (
          DEBUG &&
            console.log("[CookieNotice] cookies were previously declined"),
          (_allowCookies = !1),
          (_this.dataReady = !0)
        );
      const geo = await get(
        "https://us-central1-at-services.cloudfunctions.net/geo",
      );
      ((_isInEEA = EEA_COUNTRIES.includes(geo.location?.countryCode)),
        DEBUG &&
          console.log(
            "[CookieNotice] geo lookup, country detected: ",
            geo.location?.countryCode,
          ),
        DEBUG && console.log("[CookieNotice] in user in EEA or UK? ", _isInEEA),
        _isInEEA &&
          (window.gtag &&
            gtag("consent", "update", {
              analytics_storage: "denied",
              ads_storage: "denied",
            }),
          DEBUG && console.log("[CookieNotice] gtag consent set to denied"),
          (_this.dataReady = !0),
          _this.flag("ready", !0)));
    })(),
      (_this.displayNotice = function () {
        return (
          _this.dataReady ||
            console.warn(
              "CookieNotice not ready. wait for `await CookieNotice.ready()` before calling.",
            ),
          !!Utils.query("cookies") ||
            (!1 !== _allowCookies && !0 !== _allowCookies && !!_isInEEA)
        );
      }),
      (_this.accept = function () {
        (window.gtag &&
          gtag("consent", "update", {
            analytics_storage: "granted",
            ads_storage: "granted",
          }),
          DEBUG && console.log("[CookieNotice] gtag consent set to granted"),
          Storage.set("cookies_allow", !0));
      }),
      (_this.decline = function () {
        (window.gtag &&
          gtag("consent", "update", {
            analytics_storage: "denied",
            ads_storage: "denied",
          }),
          DEBUG && console.log("[CookieNotice] gtag consent set to denied"),
          Storage.set("cookies_declined", !0));
      }),
      (_this.clear = function () {
        (DEBUG && console.log("[CookieNotice] cookie settings cleared"),
          Storage.set("cookies_allow", null),
          Storage.set("cookies_declined", null));
      }),
      (_this.ready = function () {
        return _this.wait(_this, "ready");
      }));
  }, "Static"),
  Class(function UICookiePrompt() {
    Inherit(this, Element);
    const _this = this,
      $this = _this.element;
    (!(async function () {})(),
      (_this.animateIn = () => {
        $this.tween({ opacity: 1 }, 300, "easeInOutCubic");
      }),
      (_this.animateOut = () => {
        $this.tween({ opacity: 0 }, 300, "easeOutCubic", () => {
          $this.hide();
        });
      }));
  }, "static"),
  Class(function CubemapToEquirectangular(_size, _cube) {
    Inherit(this, Component);
    const _this = this;
    var _quad,
      _scene = new Scene(),
      _camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1e4, 1e4),
      _output = Utils3D.createRT(_size, _size / 2);
    ((this.rt = _output),
      (function () {
        let width = _size,
          height = _size / 2,
          shader = _this.initClass(Shader, "Cube2Equi", {
            tCube: { value: _cube.rt || _cube },
            side: Shader.DOUBLE_SIDE,
          });
        (((_quad = new Mesh(World.QUAD, shader)).frustumCulled = !1),
          _scene.add(_quad),
          _quad.scale.set(width / 2, height / 2, 1),
          (_camera.left = width / -2),
          (_camera.right = width / 2),
          (_camera.top = height / 2),
          (_camera.bottom = height / -2),
          _camera.updateProjectionMatrix());
      })(),
      (this.render = function () {
        World.RENDERER.render(_scene, _camera, _output);
      }),
      (this.toBlob = function () {
        _this.render();
        let pixels = World.RENDERER.readPixels(_output, 0, 0, _size, _size / 2),
          imageData = new ImageData(
            new Uint8ClampedArray(pixels),
            _size,
            _size / 2,
          ),
          canvas = document.createElement("canvas");
        ((canvas.width = _size),
          (canvas.height = _size / 2),
          canvas.getContext("2d").putImageData(imageData, 0, 0),
          canvas.toBlob(function (blob) {
            var url = URL.createObjectURL(blob),
              fileName = "pano-" + document.title + "-" + Date.now() + ".png",
              anchor = document.createElement("a");
            ((anchor.href = url),
              anchor.setAttribute("download", fileName),
              (anchor.className = "download-js-link"),
              (anchor.innerHTML = "downloading..."),
              (anchor.style.display = "none"),
              document.body.appendChild(anchor),
              setTimeout(function () {
                (anchor.click(), document.body.removeChild(anchor));
              }, 1));
          }, "image/png"));
      }));
  }),
  Class(function ImageDecoder() {
    Inherit(this, Component);
    var _ktx1Settings,
      _this = this;
    ((this.scale = 1), (this.disableFallbackImage = !1));
    var _offscreen = {},
      doDecodeImage =
        "createImageBitmap" in window
          ? (path, params) =>
              Thread.shared().decodeImage({ path: path, params: params })
          : (path, params) => Assets.decodeImage(path, params);
    function decodeImage(data, id) {
      (async (_) => {
        try {
          let e = await fetch(data.path, { mode: "cors" });
          if (200 != e.status) throw `Image not found: ${data.path}`;
          let blob = await e.blob(),
            obj = { imageOrientation: "flipY", crossOrigin: "anonymous" };
          (data.params &&
            !1 === data.params.premultiplyAlpha &&
            (obj.premultiplyAlpha = "none"),
            (obj.imageOrientation =
              data.params && !1 === data.params.flipY ? void 0 : "flipY"));
          let bitmap = await createImageBitmap(blob, obj),
            message = { post: !0, id: id, message: bitmap };
          self.postMessage(message, [bitmap]);
        } catch (e) {
          resolve(
            { fail: `${data.path} could not be decoded: ${e.message || e}` },
            id,
          );
        }
      })();
    }
    function decodeCubeLUT(data, id) {
      (async (_) => {
        try {
          let cube = await get(data.path, { mode: "cors" });
          cube = cube
            .replace(/^#.*?(\n|\r)/gm, "")
            .replace(/^\s*?(\n|\r)/gm, "")
            .trim();
          let cubesize = findNumberAfterString(cube, "LUT_3D_SIZE", !0),
            domain_min = findNumberAfterString(cube, "DOMAIN_MIN"),
            domain_max = findNumberAfterString(cube, "DOMAIN_MAX");
          ((cube = removeCubeHeader(cube, "TITLE")),
            (cube = removeCubeHeader(cube, "LUT_3D_SIZE")),
            (cube = removeCubeHeader(cube, "DOMAIN_MIN")),
            (cube = removeCubeHeader(cube, "DOMAIN_MAX")));
          let rgba = [];
          if (
            (cube
              .split(/\s+/)
              .filter((substr) => substr.length > 0)
              .forEach((element, index) => {
                (rgba.push(+element),
                  (index + 1) % 3 == 0 &&
                    index !== 4 * Math.pow(cubesize, 3) - 1 &&
                    rgba.push(1));
              }),
            rgba.forEach((e, i) => {
              (domain_min &&
                domain_max &&
                (rgba[i] = Math.map(rgba[i], domain_min, domain_max, 0, 1)),
                (rgba[i] = Math.clamp(Math.round(255 * rgba[i]), 0, 255)));
            }),
            rgba.length !== cubesize ** 3 * 4)
          )
            throw `LUT .cube at ${data.path} has length mismatch: claims cube size of ${cubesize} but has ${rgba.length} elements.`;
          let imgBmp = new Uint8Array(rgba);
          resolve({ imgBmp: imgBmp, cubesize: cubesize }, id);
        } catch (e) {
          resolve(
            { fail: `${data.path} could not be decoded: ${e.message || e}` },
            id,
          );
        }
      })();
    }
    function decodeKtx1CompressedImage(data, id) {
      (async (_) => {
        let ext;
        data.settings.dxt
          ? (ext = "dxt")
          : data.settings.etc
            ? (ext = "astc")
            : data.settings.pvrtc
              ? (ext = "pvrtc")
              : data.settings.astc && (ext = "astc");
        let fileName = data.path.split("/");
        fileName = fileName[fileName.length - 1];
        let e = await fetch(`${data.path}/${fileName}-${ext}.ktx`);
        if (200 != e.status) throw `Image not found :: ${data.path}`;
        let arrayBuffer = await e.arrayBuffer(),
          header = new Int32Array(arrayBuffer, 12, 13),
          gliFormat = (header[1], header[2], header[3], header[4]),
          baseWidth = (header[5], header[6]),
          baseHeight = header[7],
          width = baseWidth,
          height = baseHeight,
          numberOfArrayElements = header[9],
          numberOfFaces = header[10],
          miplevels = header[11],
          buffers = [],
          compressedData = [],
          sizes = [],
          cube = 6 === numberOfFaces && 0 === numberOfArrayElements,
          dataOffset = 64 + header[12];
        for (let level = 0; level < miplevels; level++) {
          let imageSize = new Int32Array(arrayBuffer, dataOffset, 1)[0];
          ((dataOffset += 4), cube && (imageSize *= 6));
          let byteArray = new Uint8Array(arrayBuffer, dataOffset, imageSize);
          ((dataOffset += imageSize),
            (dataOffset += 3 - ((imageSize + 3) % 4)),
            sizes.push(width),
            (width = Math.max(1, 0.5 * width)),
            (height = Math.max(1, 0.5 * height)));
          let clone = new Uint8Array(byteArray);
          (compressedData.push(clone), buffers.push(clone.buffer));
        }
        resolve(
          {
            gliFormat: gliFormat,
            compressedData: compressedData,
            sizes: sizes,
            width: baseWidth,
            height: baseHeight,
            cube: cube,
          },
          id,
          buffers,
        );
      })().catch((e) => {
        (console.log(e.toString()),
          resolve(
            { fail: `${data.path} could not be decoded: ${e.message || e}` },
            id,
          ));
      });
    }
    function renderOnQuad(image, compressionExtensions) {
      let aspect = image.width / image.height,
        width = Math.round(aspect > 1 ? 128 : 128 * aspect),
        height = Math.round(aspect > 1 ? 128 / aspect : 128);
      const gl = new OffscreenCanvas(width, height).getContext("webgl");
      if (!gl) throw new Error("Unable to initialize offscreen WebGL canvas");
      function loadShader(gl, shaderSource, shaderType) {
        const shader = gl.createShader(shaderType);
        (gl.shaderSource(shader, shaderSource), gl.compileShader(shader));
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const lastError = gl.getShaderInfoLog(shader);
          throw (
            gl.deleteShader(shader),
            new Error("Shader compile error: " + lastError)
          );
        }
        return shader;
      }
      let vs = loadShader(
          gl,
          "\nattribute vec4 a_position;\nvarying vec2 v_texcoord;\n\nvoid main() {\n    gl_Position = a_position;\n    v_texcoord = a_position.xy * 0.5 + 0.5;\n}",
          gl.VERTEX_SHADER,
        ),
        fs = loadShader(
          gl,
          "\nprecision mediump float;\nvarying vec2 v_texcoord;\nuniform sampler2D u_texture;\n\nvoid main() {\n    gl_FragColor = texture2D(u_texture, v_texcoord);\n}",
          gl.FRAGMENT_SHADER,
        ),
        program = (function createProgram(gl, shaders) {
          const program = gl.createProgram();
          if (
            (shaders.forEach(function (shader) {
              gl.attachShader(program, shader);
            }),
            gl.linkProgram(program),
            !gl.getProgramParameter(program, gl.LINK_STATUS))
          ) {
            const lastError = gl.getProgramInfoLog(program);
            throw (
              gl.deleteProgram(program),
              shaders.forEach(function (shader) {
                gl.deleteShader(shader);
              }),
              new Error("Shader link error:" + lastError)
            );
          }
          return program;
        })(gl, [vs, fs]);
      var positionLocation = gl.getAttribLocation(program, "a_position"),
        positionBuffer = gl.createBuffer();
      (gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer),
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([-1, -1, 3, -1, -1, 3]),
          gl.STATIC_DRAW,
        ),
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height),
        gl.clear(gl.COLOR_BUFFER_BIT));
      const tex = gl.createTexture();
      (gl.bindTexture(gl.TEXTURE_2D, tex),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR),
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR),
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !0));
      let ext = {};
      compressionExtensions.forEach((str) => {
        switch (str) {
          case "astc":
            ext.astc = gl.getExtension("WEBGL_compressed_texture_astc");
            break;
          case "atc":
            ext.atc = gl.getExtension("WEBGL_compressed_texture_atc");
            break;
          case "etc":
            ext.etc = gl.getExtension("WEBGL_compressed_texture_etc");
            break;
          case "etc1":
            ext.etc1 = gl.getExtension("WEBGL_compressed_texture_etc1");
            break;
          case "pvrtc":
            ext.pvrtc =
              gl.getExtension("WEBGL_compressed_texture_pvrtc") ||
              gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
            break;
          case "s3tc":
            ext.s3tc =
              gl.getExtension("WEBGL_compressed_texture_s3tc") ||
              gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
            break;
          case "bptc":
            ext.bptc = gl.getExtension("EXT_texture_compression_bptc");
            break;
          case "s3tc_srgb":
            ext.s3tc_srgb = gl.getExtension(
              "WEBGL_compressed_texture_s3tc_srgb",
            );
        }
      });
      let index = image.sizes.findIndex(
        (e) => e.width <= 128 && e.height <= 128,
      );
      (gl.compressedTexImage2D(
        gl.TEXTURE_2D,
        0,
        image.gliFormat,
        image.sizes[index].width,
        image.sizes[index].height,
        0,
        image.compressedData[index],
      ),
        gl.useProgram(program),
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer),
        gl.enableVertexAttribArray(positionLocation),
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, !1, 0, 0),
        gl.drawArrays(gl.TRIANGLES, 0, 3),
        gl.useProgram(null));
      let data = new Uint8Array(65536);
      return (
        gl.readPixels(0, 0, 128, 128, gl.RGBA, gl.UNSIGNED_BYTE, data),
        data
      );
    }
    function findDominantColors(e, id) {
      function calculateCenterColor(colors) {
        let center = new ColorLAB();
        return (
          colors.forEach((color) => {
            ((center.l += color.l),
              (center.a += color.a),
              (center.b += color.b));
          }),
          colors.length &&
            ((center.l /= colors.length),
            (center.a /= colors.length),
            (center.b /= colors.length)),
          center
        );
      }
      try {
        let data;
        if (e.compressionExtensions)
          data = renderOnQuad(e.image, e.compressionExtensions);
        else if (e.image) {
          let aspect = e.image.width / e.image.height,
            max = 128,
            width = Math.round(aspect > 1 ? max : max * aspect),
            height = Math.round(aspect > 1 ? max / aspect : max),
            ctx = new OffscreenCanvas(width, height).getContext("2d");
          (ctx.drawImage(e.image, 0, 0, width, height),
            (data = ctx.getImageData(0, 0, width, height).data));
        } else data = e.data;
        let count = data.length / 4,
          colors = [],
          j = 0;
        for (let i = 0; i < count; ++i)
          (data[j + 3] > 25 &&
            colors.push(
              new ColorLAB().setRGB(
                data[j] / 255,
                data[j + 1] / 255,
                data[j + 2] / 255,
              ),
            ),
            (j += 4));
        let results = (function kmeans(colors, k, minDiff) {
          let clusters = (function getInitialClusters(colors, k) {
            const sums = colors.map((color) => [
              color.l + color.a + color.b,
              color,
            ]);
            sums.sort((a, b) => a[0] - b[0]);
            const centroids = [...Array(k)].map((_, i) => {
              const shardSize = Math.floor(sums.length / k);
              return calculateCenterColor(
                sums
                  .slice(
                    shardSize * i,
                    i === k - 1 ? sums.length : shardSize * (i + 1),
                  )
                  .map((sum) => sum[1]),
              );
            });
            for (let i = 0; i < centroids.length - 1; ++i) {
              const color = centroids[i],
                nextColor = centroids[i + 1];
              color.l === nextColor.l &&
                color.a === nextColor.a &&
                color.b === nextColor.b &&
                (centroids.splice(i + 1, 1), (i -= 1));
            }
            return centroids.map((color) => [color, []]);
          })(colors, k);
          k = clusters.length;
          for (let i = 1; ; i++) {
            let lists = [...Array(k)].map(() => []);
            for (let j = 0; j < colors.length; j++) {
              let c = colors[j],
                smallestDistance = 1 / 0,
                idx = 0;
              for (let i = 0; i < k; i++) {
                let distance = c.deltaECIE94(clusters[i][0]);
                distance < smallestDistance &&
                  ((smallestDistance = distance), (idx = i));
              }
              lists[idx].push(c);
            }
            let diff = 0;
            for (let i = 0; i < k; i++) {
              let old = clusters[i],
                center = calculateCenterColor(lists[i]),
                newCluster = [center, lists[i]],
                dist = old[0].deltaECIE94(center);
              ((clusters[i] = newCluster), (diff = diff > dist ? diff : dist));
            }
            if (diff < minDiff || 50 === i) break;
          }
          return clusters;
        })(
          colors,
          "number" == typeof e.numColors ? e.numColors : 4,
          1 / 255,
        ).filter((cluster) => cluster[1].length);
        (results.sort((a, b) => b[1].length - a[1].length),
          (results = results.map((result) => result[0].getRGB())),
          resolve({ colors: results }, id));
      } catch (e) {
        throw (resolve({ fail: e.message || e }, id), e);
      }
    }
    function findNumberAfterString(source, str, toInt = !1) {
      const regex = new RegExp(str + "\\D*([0-9]*\\.?[0-9]+)"),
        num = source.match(regex);
      return num && num[1]
        ? toInt
          ? parseInt(num[1])
          : parseFloat(num[1])
        : null;
    }
    function removeCubeHeader(source, str) {
      const regex = new RegExp(str + "[\\s\\S]*?(\\n+)"),
        match = source.match(regex);
      if (match) {
        const newlineIndex = match.index + match[0].length - 1;
        return source.slice(newlineIndex + 1);
      }
      return source;
    }
    function checkCapabilities() {
      if (
        (void 0 === _offscreen["2d"] &&
          (_offscreen["2d"] =
            "OffscreenCanvas" in window &&
            !!new OffscreenCanvas(1, 1).getContext("2d")),
        void 0 === _offscreen.webgl &&
          ((_offscreen.webgl =
            "OffscreenCanvas" in window &&
            !!new OffscreenCanvas(1, 1).getContext("webgl")),
          _offscreen.webgl))
      ) {
        let compressionExtensions = [
            "compressed_texture",
            "texture_compression",
          ],
          enabledExtensions = Device.graphics.webgl?.extensions || [],
          dedupe = {};
        _offscreen.compressionExtensions = enabledExtensions
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
          .filter((ext) => !(!ext || dedupe[ext]) && (dedupe[ext] = !0));
      }
    }
    (!(async function () {
      (await Hydra.ready(),
        Thread.upload(decodeImage),
        Thread.upload(decodeCubeLUT),
        Thread.upload(findNumberAfterString),
        Thread.upload(removeCubeHeader),
        Thread.upload(renderOnQuad),
        Thread.upload(findDominantColors),
        Thread.upload(decodeKtx1CompressedImage));
    })(),
      (this.decode = async function (path, params = {}) {
        let fallback = Thread.absolutePath(
          Assets.getPath("assets/images/_scenelayout/uv.jpg"),
        );
        if (
          ((path = Thread.absolutePath(Assets.getPath(path))),
          void 0 === _ktx1Settings)
        ) {
          _ktx1Settings = {
            dxt: !!Renderer.extensions.s3tc,
            etc: !!Renderer.extensions.etc1,
            pvrtc: !!Renderer.extensions.pvrtc,
            astc: !!Renderer.extensions.astc,
          };
          let found = !1;
          for (let key in _ktx1Settings)
            !0 === _ktx1Settings[key] && (found = !0);
          found || (_ktx1Settings = null);
        }
        let compressedIdentifier = /-compressedKtx2?/.exec(path)?.[0],
          compressed =
            !!compressedIdentifier &&
            (compressedIdentifier.endsWith("2") ? "ktx2" : "ktx1");
        if (
          ((Utils.query("noKtx") ||
            (!_ktx1Settings && "ktx1" === compressed)) &&
            ((path = path.replace(compressedIdentifier, "")),
            (compressed = !1)),
          /\.ktx2(?:\?|#|$)/.test(path) &&
            ((compressed = "ktx2"),
            Utils.query("noKtx") && (params.uncompressed = !0)),
          compressed &&
            params.hintUsingPixelData &&
            (checkCapabilities(),
            _offscreen.webgl ||
              ("ktx2" === compressed
                ? (params.uncompressed = !0)
                : ((path = path.replace(compressedIdentifier, "")),
                  (compressed = !1)))),
          compressed)
        ) {
          try {
            let bitmap;
            if (
              ((path = path.substring(0, path.lastIndexOf("."))),
              (bitmap =
                "ktx1" === compressed
                  ? await Thread.shared().decodeKtx1CompressedImage({
                      path: path,
                      params: params,
                      settings: _ktx1Settings,
                    })
                  : await Ktx2Transcoder.transcode({
                      path: `${path}.ktx2`,
                      params: params,
                    })),
              !bitmap.fail)
            )
              return bitmap;
          } catch (e) {}
          return _this.decode(fallback, params);
        }
        {
          let bitmap = await doDecodeImage(path, params);
          if (bitmap.fail && !this.disableFallbackImage) {
            const fallbackBitmap = await doDecodeImage(fallback, params);
            fallbackBitmap.fail || (bitmap = fallbackBitmap);
          }
          if (bitmap.fail) throw new Error(bitmap.fail);
          return (function process(bitmap, scale) {
            if (1 == scale * _this.scale) return bitmap;
            let pow2 = Math.isPowerOf2(bitmap.width, bitmap.height),
              canvas = document.createElement("canvas");
            return (
              (canvas.context = canvas.getContext("2d")),
              (canvas.width = Math.round(bitmap.width * _this.scale * scale)),
              (canvas.height = Math.round(bitmap.height * _this.scale * scale)),
              pow2 &&
                scale * _this.scale < 1 &&
                (canvas.width = canvas.height =
                  Math.floorPowerOf2(Math.max(canvas.width, canvas.height))),
              canvas.context.drawImage(
                bitmap,
                0,
                0,
                canvas.width,
                canvas.height,
              ),
              canvas
            );
          })(bitmap, params.scale || 1);
        }
      }),
      (this.decodeCubeLUT = async function (path, params) {
        let fallback = Thread.absolutePath(
          Assets.getPath("assets/images/_scenelayout/invert.cube"),
        );
        path = Thread.absolutePath(Assets.getPath(path));
        try {
          let bitmap = await Thread.shared().decodeCubeLUT({
            path: path,
            params: params,
          });
          if (
            bitmap.fail &&
            !this.disableFallbackImage &&
            ((bitmap = await Thread.shared().decodeCubeLUT({
              path: fallback,
              params: params,
            })),
            bitmap.fail)
          )
            throw "could not decode " + path;
          return { imgBmp: bitmap.imgBmp, cubesize: bitmap.cubesize };
        } catch (e) {
          throw "could not decode " + path;
        }
      }),
      (this.parseColors = async function (image, numColors = 4) {
        let result;
        if ((checkCapabilities(), image.sizes))
          if (_offscreen.webgl)
            result = await Thread.shared().findDominantColors({
              image: image,
              numColors: numColors,
              compressionExtensions: _offscreen.compressionExtensions,
            });
          else {
            let index = image.sizes.findIndex(
              (e) => e.width <= 128 && e.height <= 128,
            );
            index = Math.max(0, index);
            let data = (image = await _this.decode(
              image.path + "-compressedKtx2",
              { uncompressed: !0 },
            )).compressedData[index];
            result = await Thread.shared().findDominantColors(
              { data: data, numColors: numColors },
              [data.buffer],
            );
          }
        else if (_offscreen["2d"]) {
          let buffers = [];
          (image instanceof HTMLImageElement &&
            ((image = await createImageBitmap(image)), buffers.push(image)),
            (result = await Thread.shared().findDominantColors(
              { image: image, numColors: numColors },
              buffers,
            )));
        } else {
          let canvas = document.createElement("canvas");
          canvas.context = canvas.getContext("2d");
          let aspect = image.width / image.height,
            max = 128;
          ((canvas.width = Math.round(aspect > 1 ? max : max * aspect)),
            (canvas.height = Math.round(aspect > 1 ? max / aspect : max)),
            canvas.context.drawImage(image, 0, 0, canvas.width, canvas.height));
          let data = canvas.context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height,
          ).data;
          result = await Thread.shared().findDominantColors(
            { data: data, numColors: numColors },
            [data.buffer],
          );
        }
        if (result.fail) throw new Error(result.fail);
        return result.colors.map((color) => new Color().copy(color));
      }));
  }, "static"),
  Class(function Ktx2Transcoder() {
    Inherit(this, Component);
    const _this = this;
    var _transcoderReady,
      _basisAssets = [
        "~assets/js/lib/basis_transcoder.js",
        "~assets/js/lib/basis_transcoder.wasm",
      ]
        .map(Assets.getPath)
        .map(Thread.absolutePath);
    async function initBasisTranscoder() {
      if (_transcoderReady) await _transcoderReady;
      else {
        _transcoderReady = Promise.create();
        let [js, wasmBinary] = await Promise.all(
            _basisAssets.map(async (path, i) => {
              let response = await fetch(path);
              return 0 === i ? response.text() : response.arrayBuffer();
            }),
          ),
          formats = (function getSupportedFormats() {
            let supported = {
              astc: !!Renderer.extensions.astc,
              etc1: !!Renderer.extensions.etc1,
              etc2: !!Renderer.extensions.etc,
              dxt: !!Renderer.extensions.s3tc,
              bptc: !!Renderer.extensions.bptc,
              pvrtc: !!Renderer.extensions.pvrtc,
              uncompressed: !0,
            };
            Renderer.type === Renderer.WEBGL2 && (supported.etc1 = !1);
            let formats = {};
            return (
              Object.keys(supported)
                .filter((id) => supported[id])
                .forEach((id) => {
                  let format = { id: id, needsPowerOfTwo: !1 };
                  switch (((formats[id] = format), id)) {
                    case "astc":
                      format.gliFormat = [
                        Renderer.extensions.astc.COMPRESSED_RGBA_ASTC_4x4_KHR,
                        Renderer.extensions.astc.COMPRESSED_RGBA_ASTC_4x4_KHR,
                      ];
                      break;
                    case "bptc":
                      format.gliFormat = [
                        Renderer.extensions.bptc.COMPRESSED_RGBA_BPTC_UNORM_EXT,
                        Renderer.extensions.bptc.COMPRESSED_RGBA_BPTC_UNORM_EXT,
                      ];
                      break;
                    case "dxt":
                      format.gliFormat = [
                        Renderer.extensions.s3tc.COMPRESSED_RGB_S3TC_DXT1_EXT,
                        Renderer.extensions.s3tc.COMPRESSED_RGBA_S3TC_DXT5_EXT,
                      ];
                      break;
                    case "etc2":
                      format.gliFormat = [
                        Renderer.extensions.etc.COMPRESSED_RGB8_ETC2,
                        Renderer.extensions.etc.COMPRESSED_RGBA8_ETC2_EAC,
                      ];
                      break;
                    case "etc1":
                      format.gliFormat = [
                        Renderer.extensions.etc.COMPRESSED_RGB_ETC1_WEBGL,
                      ];
                      break;
                    case "pvrtc":
                      ((format.gliFormat = [
                        Renderer.extensions.pvrtc
                          .COMPRESSED_RGB_PVRTC_4BPPV1_IMG,
                        Renderer.extensions.pvrtc
                          .COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
                      ]),
                        (format.needsPowerOfTwo = !0));
                      break;
                    case "uncompressed":
                      format.gliFormat = [
                        Renderer.context.RGBA,
                        Renderer.context.RGBA,
                      ];
                  }
                }),
              formats
            );
          })(),
          threads = Thread.shared(!0).array;
        (await Promise.all(
          threads.map(async (thread) => {
            (thread.importCode(js),
              thread.loadFunction(initKtx2TranscoderThread),
              thread.loadFunction(function transcodeKtx2() {}),
              await thread.initKtx2TranscoderThread({
                wasmBinary: wasmBinary,
                formats: formats,
              }));
          }),
        ),
          _transcoderReady.resolve(),
          _this.flag("transcoderLoaded", !0));
      }
    }
    function initKtx2TranscoderThread(e, id) {
      var _formats;
      async function transcodeKtx2({ path: path, params: params }, id) {
        let ktx2File;
        try {
          let response = await fetch(path);
          if (200 !== response.status)
            throw new Error(`Image not found :: ${path}`);
          let arrayBuffer = await response.arrayBuffer();
          if (
            ((ktx2File = new BasisModule.KTX2File(new Uint8Array(arrayBuffer))),
            !ktx2File.isValid())
          )
            throw new Error("Invalid or unsupported .ktx2 file");
          let ktxheader = ktx2File.getHeader(),
            basisFormat = ktx2File.isUASTC() ? "uastc" : "etc1s",
            baseWidth = ktx2File.getWidth(),
            baseHeight = ktx2File.getHeight(),
            baseDepth = ktxheader.pixelDepth,
            layers = ktx2File.getLayers() || 1,
            levels = ktx2File.getLevels(),
            faceCount = ktx2File.getFaces(),
            hasAlpha = ktx2File.getHasAlpha(),
            premultiplyAlpha = !!(1 & ktx2File.getDFDFlags()),
            {
              transcoderFormat: transcoderFormat,
              gliFormat: gliFormat,
              uncompressed: uncompressed,
            } = (function getTranscoderFormat(
              basisFormat,
              width,
              height,
              hasAlpha,
              params,
            ) {
              let format;
              format = params.uncompressed
                ? _formats.uncompressed
                : _formats[basisFormat].find(
                    (format) =>
                      !(
                        (hasAlpha && format.transcoderFormat.length < 2) ||
                        (format.needsPowerOfTwo &&
                          !Math.isPowerOf2(width, height))
                      ),
                  );
              let uncompressed = "uncompressed" === format.id;
              uncompressed &&
                !params.uncompressed &&
                console.warn(
                  "No suitable compressed texture format found. Decoding to RGBA32.",
                );
              let which = hasAlpha ? 1 : 0;
              return {
                transcoderFormat: format.transcoderFormat[which],
                gliFormat: format.gliFormat[which],
                uncompressed: uncompressed,
              };
            })(basisFormat, baseWidth, baseHeight, hasAlpha, params);
          if (!baseWidth || !baseHeight || !levels)
            throw new Error("Invalid texture");
          if (layers > 1) throw new Error("Array textures not implemented");
          if (!ktx2File.startTranscoding())
            throw new Error("startTranscoding failed");
          let buffers = [],
            compressedData = [],
            sizes = [],
            cube = 6 === faceCount;
          if (params.isTexture3D && ktxheader.vkFormat && baseDepth) {
            const channelCount = 4;
            let data = new Uint8Array(
              arrayBuffer.slice(
                baseWidth *
                  baseHeight *
                  baseDepth *
                  ktxheader.typeSize *
                  channelCount *
                  -1,
              ),
            );
            (compressedData.push(data),
              buffers.push(data.buffer),
              sizes.push({
                baseWidth: baseWidth,
                baseHeight: baseHeight,
                baseDepth: baseDepth,
              }));
          } else
            for (let level = 0; level < levels; level++) {
              let width,
                height,
                data,
                faces = [];
              for (let faceIndex = 0; faceIndex < faceCount; ++faceIndex) {
                let levelInfo = ktx2File.getImageLevelInfo(level, 0, faceIndex);
                ((width = levelInfo.origWidth),
                  (height = levelInfo.origHeight));
                let data = new Uint8Array(
                  ktx2File.getImageTranscodedSizeInBytes(
                    level,
                    0,
                    faceIndex,
                    transcoderFormat,
                  ),
                );
                if (
                  !ktx2File.transcodeImage(
                    data,
                    level,
                    0,
                    faceIndex,
                    transcoderFormat,
                    0,
                    -1,
                    -1,
                  )
                )
                  throw new Error("transcodeImage failed");
                faces.push(data);
              }
              if (faces.length > 1) {
                let totalLength = 0;
                (faces.forEach((face) => {
                  totalLength += face.byteLength;
                }),
                  (data = new Uint8Array(totalLength)));
                let offset = 0;
                faces.forEach((face) => {
                  (data.set(face, offset), (offset += face.byteLength));
                });
              } else data = faces[0];
              (compressedData.push(data),
                buffers.push(data.buffer),
                sizes.push({ width: width, height: height }));
            }
          resolve(
            {
              path: path,
              gliFormat: gliFormat,
              compressedData: compressedData,
              sizes: sizes,
              width: baseWidth,
              height: baseHeight,
              depth: baseDepth,
              cube: cube,
              premultiplyAlpha: premultiplyAlpha,
              uncompressed: uncompressed,
            },
            id,
            buffers,
          );
        } catch (e) {
          (console.log(e.toString()),
            resolve(
              { fail: `${path} could not be decoded: ${e.message || e}` },
              id,
            ));
        } finally {
          ktx2File && (ktx2File.close(), ktx2File.delete());
        }
      }
      var BasisModule = {
        wasmBinary: e.wasmBinary,
        onRuntimeInitialized: function () {
          (BasisModule.initializeBasis(),
            (function initFormats(formats) {
              (Object.keys(formats).forEach((id) => {
                let format = formats[id];
                switch (id) {
                  case "astc":
                    format.transcoderFormat = [
                      BasisModule.transcoder_texture_format.cTFASTC_4x4_RGBA
                        .value,
                      BasisModule.transcoder_texture_format.cTFASTC_4x4_RGBA
                        .value,
                    ];
                    break;
                  case "bptc":
                    format.transcoderFormat = [
                      BasisModule.transcoder_texture_format.cTFBC7_RGBA.value,
                      BasisModule.transcoder_texture_format.cTFBC7_RGBA.value,
                    ];
                    break;
                  case "dxt":
                    format.transcoderFormat = [
                      BasisModule.transcoder_texture_format.cTFBC1_RGB.value,
                      BasisModule.transcoder_texture_format.cTFBC3_RGBA.value,
                    ];
                    break;
                  case "etc2":
                    format.transcoderFormat = [
                      BasisModule.transcoder_texture_format.cTFETC1_RGB.value,
                      BasisModule.transcoder_texture_format.cTFETC2_RGBA.value,
                    ];
                    break;
                  case "etc1":
                    format.transcoderFormat = [
                      BasisModule.transcoder_texture_format.cTFETC1_RGB.value,
                    ];
                    break;
                  case "pvrtc":
                    format.transcoderFormat = [
                      BasisModule.transcoder_texture_format.cTFPVRTC1_4_RGB
                        .value,
                      BasisModule.transcoder_texture_format.cTFPVRTC1_4_RGBA
                        .value,
                    ];
                    break;
                  case "uncompressed":
                    format.transcoderFormat = [
                      BasisModule.transcoder_texture_format.cTFRGBA32.value,
                      BasisModule.transcoder_texture_format.cTFRGBA32.value,
                    ];
                }
              }),
                (_formats = {
                  uastc: [
                    formats.astc,
                    formats.bptc,
                    formats.etc2,
                    formats.etc1,
                    formats.dxt,
                    formats.pvrtc,
                    formats.uncompressed,
                  ].filter(Boolean),
                  etc1s: [
                    formats.etc2,
                    formats.etc1,
                    formats.bptc,
                    formats.dxt,
                    formats.pvrtc,
                    formats.uncompressed,
                  ].filter(Boolean),
                  uncompressed: formats.uncompressed,
                }));
            })(e.formats),
            (self.transcodeKtx2 = transcodeKtx2),
            delete self.initKtx2TranscoderThread,
            resolve(id));
        },
      };
      BASIS(BasisModule);
    }
    _this.transcode = async function ({ path: path, params: params }) {
      _this.flag("transcoderLoaded") || (await initBasisTranscoder());
      let result = await Thread.shared().transcodeKtx2({
        path: path,
        params: params,
      });
      if (result.fail) throw new Error(result.fail);
      return result;
    };
  }, "static"),
  Class(function BaseCamera(_input, _group) {
    Inherit(this, Object3D);
    const _this = this;
    var _debugCamera,
      _type = "perspective";
    function resize() {
      if (_this.overrideResize)
        "function" == typeof _this.overrideResize && _this.overrideResize();
      else
        switch (_type) {
          case "perspective":
            ((_this.camera.aspect = Stage.width / Stage.height),
              _this.camera.updateProjectionMatrix());
            break;
          case "orthographic":
            if (_this.width || _this.height)
              _this.camera.setViewport(_this.width, _this.height);
            else {
              let m = 900 / Stage.height / 100;
              _this.camera.setViewport(Stage.width * m, Stage.height * m);
            }
        }
    }
    ((this.camera = new PerspectiveCamera(
      30,
      Stage.width / Stage.height,
      0.1,
      1e3,
    )),
      this.group.add(this.camera),
      (this.playgroundLock = function (camera = Camera.instance()) {
        if (!Global.PLAYGROUND) return;
        Utils.getConstructorName(_this.parent).includes(
          Global.PLAYGROUND.split("/")[0],
        ) &&
          RenderManager.type == RenderManager.NORMAL &&
          camera.lock(_this.camera);
      }),
      (this.lock = function (camera) {
        if ("orthographic" == _type && !camera.worldCamera.isOrthographicCamera)
          return console.error(
            "You can't lock an orthographic camera to the main camera. Use an FXScene .setCamera",
          );
        if (!camera) {
          let p = _this.parent;
          for (; p; ) {
            if (p.useCamera && p.nuke) return p.useCamera(_this);
            p = p.parent;
          }
        }
        ((camera = camera || Camera.instance()),
          RenderManager.type == RenderManager.NORMAL &&
            camera.lock(_this.camera));
      }),
      (this.transition = function (
        time,
        ease,
        delay,
        camera = Camera.instance(),
      ) {
        "object" == typeof delay && ((camera = delay), (delay = 0));
        let p = Promise.create();
        return (
          camera.transition(_this.camera, time, ease, delay || 0),
          _this.delayedCall((_) => p.resolve(), time + (delay || 0)),
          p
        );
      }),
      (this.manualTransition = function (camera = Camera.instance()) {
        return camera.manualTransition(_this.camera);
      }),
      (this.setFOV = function (fov) {
        "orthographic" !== _type &&
          fov != this.camera.fov &&
          ((this.camera.fov = fov), this.camera.updateProjectionMatrix());
      }),
      (this.getFOV = function () {
        return this.camera.fov;
      }),
      (this.useOrthographic = function (w, h) {
        "orthographic" !== _type &&
          (isNaN(w) || (this.width = w),
          isNaN(h) || (this.height = h),
          this.camera && this.group.remove(this.camera),
          (this.camera = new OrthographicCamera()),
          this.group.add(this.camera),
          (this.camera.position.z = 1),
          (_type = "orthographic"),
          resize());
      }),
      (this.usePerspective = function () {
        "perspective" !== _type &&
          (this.camera && this.group.remove(this.camera),
          (this.camera = new PerspectiveCamera()),
          this.group.add(this.camera),
          (_type = "perspective"),
          resize());
      }),
      (this.useCurve = function (curve) {
        return ((_this.camera.curve = curve), this);
      }),
      _this.get("zoom", () => _this.camera.zoom),
      _this.set("zoom", (zoom) => {
        ((_this.camera.zoom = zoom), _this.camera.updateProjectionMatrix());
      }),
      _this.get("near", () => _this.camera.near),
      _this.set("near", (near) => {
        ((_this.camera.near = near), _this.camera.updateProjectionMatrix());
      }),
      _this.get("far", () => _this.camera.far),
      _this.set("far", (far) => {
        ((_this.camera.far = far), _this.camera.updateProjectionMatrix());
      }),
      (_this.setProjectionProperties = function ({
        fov: fov,
        near: near,
        far: far,
        zoom: zoom,
      }) {
        let needsUpdate = !1;
        ("orthographic" !== _type &&
          void 0 !== fov &&
          fov !== this.camera.fov &&
          ((this.camera.fov = fov), (needsUpdate = !0)),
          void 0 !== near &&
            near !== this.camera.near &&
            ((this.camera.near = near), (needsUpdate = !0)),
          void 0 !== far &&
            far !== this.camera.far &&
            ((this.camera.far = far), (needsUpdate = !0)),
          void 0 !== zoom &&
            zoom !== this.camera.zoom &&
            ((this.camera.zoom = zoom), (needsUpdate = !0)),
          needsUpdate && _this.camera.updateProjectionMatrix());
      }),
      (function init() {
        if (
          (_this.startRender((_) => {
            if (
              (_this.group.updateMatrixWorld(!0),
              _debugCamera && _debugCamera.visible)
            ) {
              Utils3D.decompose(_this.camera, _debugCamera);
              let viewportHeight,
                active = AppState.get("playground_camera_active");
              ((viewportHeight = active.isOrthographicCamera
                ? (active.top - active.bottom) / active.zoom
                : Utils3D.getHeightFromCamera(
                    active,
                    _this.camera.position.distanceTo(active.position),
                  )),
                _debugCamera.scale.setScalar((0.025 * viewportHeight) / 0.1));
            }
          }),
          _this.onResize(resize),
          _input)
        ) {
          _this.prefix = _input.prefix;
          let cameraUIL = CameraUIL.add(_this, _group);
          (cameraUIL.setLabel("Camera"), (_this.group._cameraUIL = cameraUIL));
        }
        Global.PLAYGROUND &&
          AppState.bind("playground_camera_active", (active) => {
            _this.group._parent &&
              (active
                ? (_debugCamera ||
                    (((_debugCamera = new Mesh(
                      new BoxGeometry(0.1, 0.1, 0.2),
                      new Shader("DebugCamera", {
                        uColor: { value: new Color("#ffffff") },
                        transparent: !0,
                        depthTest: !1,
                      }),
                    )).renderOrder = 9999),
                    _this.delayedCall(
                      (_) => _this.group._parent.add(_debugCamera),
                      50,
                    )),
                  (_debugCamera.visible = !0))
                : _debugCamera && (_debugCamera.visible = !1));
          });
      })());
  }),
  Class(function Camera(_worldCamera) {
    Inherit(this, Component);
    const _this = this;
    var _debug,
      _prevCamera,
      _lockCamera,
      _curve,
      _manual,
      _scheduleSlot,
      _calc = new Vector3(),
      _target = new Group(),
      _anim = { weight: 0, weight2: 0 },
      _center = new Vector3(),
      _cameraTarget = new Group(),
      _cameraTarget2 = new Group();
    function loop() {
      _scheduleSlot || render();
    }
    function render() {
      if (
        (_debug && (_debug.visible = !_debug.position.equals(_center)),
        _manual && (_anim.weight2 = _manual.value),
        (_anim.weight += (_anim.weight2 - _anim.weight) * _this.lerp),
        _prevCamera)
      ) {
        if (
          (_prevCamera.updateMatrixWorld(),
          _lockCamera.updateMatrixWorld(),
          _curve)
        ) {
          (_curve.lerpPos ||
            (_curve.lerpPos = new Vector3().copy(
              _prevCamera.getWorldPosition(),
            )),
            _curve.lerpOffset ||
              (_curve.lerpOffset = new Vector3()
                .copy(_curve.getPointAt(1))
                .multiplyScalar(-2)
                .add(_lockCamera.getWorldPosition())));
          let pos = _calc
            .copy(_curve.getPointAt(_anim.weight))
            .add(_curve.lerpOffset)
            .add(_lockCamera.getWorldPosition());
          (_curve.lerpPos.lerp(pos, _curve.lerp || 1, !1),
            _target.position.copy(_curve.lerpPos),
            _anim.weight >= 1 &&
              ((_curve = _curve.lerpPos = _curve.lerpOffset = null),
              _this.onCurveComplete && _this.onCurveComplete()));
        } else
          _target.position
            .copy(_prevCamera.getWorldPosition())
            .lerp(_lockCamera.getWorldPosition(), _anim.weight, !1);
        _target.quaternion
          .copy(_prevCamera.getWorldQuaternion())
          .slerp(_lockCamera.getWorldQuaternion(), _anim.weight, !1);
        let needsUpdate = !1,
          zoom = Math.mix(_prevCamera.zoom, _lockCamera.zoom, _anim.weight);
        _worldCamera.zoom !== zoom &&
          ((_worldCamera.zoom = zoom), (needsUpdate = !0));
        let fov =
          !_worldCamera.isOrthographicCamera &&
          Math.mix(_prevCamera.fov, _lockCamera.fov, _anim.weight);
        fov &&
          _worldCamera.fov !== fov &&
          ((_worldCamera.fov = fov), (needsUpdate = !0));
        let near = Math.mix(_prevCamera.near, _lockCamera.near, _anim.weight);
        _worldCamera.near !== near &&
          ((_worldCamera.near = near), (needsUpdate = !0));
        let far = Math.mix(_prevCamera.far, _lockCamera.far, _anim.weight);
        (_worldCamera.far !== far &&
          ((_worldCamera.far = far), (needsUpdate = !0)),
          needsUpdate && _worldCamera.updateProjectionMatrix(),
          _cameraTarget.position.lerp(_target.position, _this.lerp2, !1),
          _cameraTarget.quaternion.slerp(_target.quaternion, _this.lerp2, !1));
      } else if (_lockCamera) {
        (_lockCamera.updateMatrixWorld(),
          Utils3D.decompose(_lockCamera, _cameraTarget));
        let needsUpdate = !1;
        (_lockCamera.zoom &&
          _worldCamera.zoom != _lockCamera.zoom &&
          ((_worldCamera.zoom = _lockCamera.zoom), (needsUpdate = !0)),
          _worldCamera.isOrthographicCamera ||
            _worldCamera.fov == _lockCamera.fov ||
            ((_worldCamera.fov = _lockCamera.fov), (needsUpdate = !0)),
          _worldCamera.near !== _lockCamera.near &&
            ((_worldCamera.near = _lockCamera.near), (needsUpdate = !0)),
          _worldCamera.far !== _lockCamera.far &&
            ((_worldCamera.far = _lockCamera.far), (needsUpdate = !0)),
          needsUpdate && _worldCamera.updateProjectionMatrix());
      }
      ((_prevCamera || _lockCamera) &&
        (_cameraTarget2.position.lerp(
          _cameraTarget.position,
          _this.finalLerp,
          !1,
        ),
        _cameraTarget2.quaternion.slerp(
          _cameraTarget.quaternion,
          _this.finalLerp,
          !1,
        ),
        _worldCamera.position.lerp(
          _cameraTarget2.position,
          _this.finalLerp,
          !1,
        ),
        _worldCamera.quaternion.slerp(
          _cameraTarget2.quaternion,
          _this.finalLerp,
          !1,
        )),
        _worldCamera.updateMatrixWorld(),
        _debug &&
          (_debug.position.copy(_worldCamera.position),
          _debug.quaternion.copy(_worldCamera.quaternion)),
        RenderManager.fire(_this));
    }
    ((this.lerp = 1),
      (this.lerp2 = 1),
      (this.worldCamera = _worldCamera),
      (this.finalLerp = 1),
      (this.multiTween = !0),
      (function () {
        if (RenderManager.type != RenderManager.NORMAL)
          return (
            (_worldCamera = void 0),
            void (_this.worldCamera = _worldCamera)
          );
        ((_worldCamera.controllingCamera = _this),
          _this.startRender(loop, RenderManager.AFTER_LOOPS));
      })(),
      (this.lock = function (camera, scheduleSlot) {
        (camera instanceof Camera
          ? ((scheduleSlot = camera), (camera = camera.worldCamera))
          : camera.controllingCamera &&
            (scheduleSlot = camera.controllingCamera),
          (_lockCamera = camera),
          (_prevCamera = null),
          _worldCamera &&
            (_scheduleSlot && _this.stopRender(render, _scheduleSlot),
            (_scheduleSlot = scheduleSlot) &&
              _this.startRender(render, _scheduleSlot),
            _lockCamera.zoom && (_worldCamera.zoom = _lockCamera.zoom),
            _worldCamera.isOrthographicCamera ||
              (_worldCamera.fov = _lockCamera.fov),
            _worldCamera.updateProjectionMatrix(),
            render()));
      }),
      (this.transition = function (
        camera,
        duration = 1e3,
        ease = "easeInOutCubic",
        scheduleSlotOrDelay,
      ) {
        let delay, scheduleSlot;
        return (
          "number" == typeof scheduleSlotOrDelay
            ? (delay = scheduleSlotOrDelay)
            : scheduleSlotOrDelay && (scheduleSlot = scheduleSlotOrDelay),
          camera instanceof Camera
            ? ((scheduleSlot = camera), (camera = camera.worldCamera))
            : camera.controllingCamera &&
              (scheduleSlot = camera.controllingCamera),
          _curve && (_curve = _curve.lerpPos = _curve.lerpOffset = null),
          camera.curve && ((_curve = camera.curve).lerpPos = camera.lerpPos),
          _prevCamera === camera
            ? ((duration *= 0.5 * Math.smoothStep(0.5, 1, _anim.weight) + 0.5),
              (_anim.weight = 1 - _anim.weight))
            : (_anim.weight = 0),
          (_manual = void 0),
          scheduleSlot &&
            _worldCamera &&
            (_scheduleSlot && _this.stopRender(render, _scheduleSlot),
            (_scheduleSlot = scheduleSlot),
            _this.startRender(render, _scheduleSlot)),
          (_anim.weight2 = _anim.weight),
          (_prevCamera = _lockCamera),
          (_lockCamera = camera),
          tween(_anim, { weight2: 1 }, duration, ease, delay)
        );
      }),
      (this.manualTransition = function (camera) {
        return (this.transition(camera).stop(), (_manual = { value: 0 }));
      }),
      (this.setPrevCamera = function (camera) {
        _prevCamera = camera.camera || camera;
      }),
      this.get("worldCamera", (_) => _worldCamera),
      this.get("lockCamera", (_) => _lockCamera),
      this.set("debugScale", (s) => {
        _debug && _debug.scale.setScalar(s);
      }),
      (this.createLocal = function (camera) {
        return (
          camera ||
            ((camera = World.CAMERA.clone()),
            _this.onResize((_) => {
              ((camera.aspect = Stage.width / Stage.height),
                camera.updateProjectionMatrix());
            })),
          new Camera(camera.camera || camera)
        );
      }));
  }, "singleton"),
  Class(function GazeCamera(_input, _group) {
    Inherit(this, BaseCamera);
    const _this = this;
    var _strength = { v: 1 },
      _cacheObj = {},
      _move = new Vector3(),
      _position = new Vector3(),
      _wobble = new Vector3(),
      _rotation = 0,
      _wobbleAngle = Math.radians(Math.rand(0, 360)),
      _innerGroup = new Group(),
      _viewportFocusOffset = new Vector3(),
      _hasViewportFocusOffset = !1,
      _manualRender = !1,
      _quaternion = new Quaternion(),
      _useCustomMove = !1,
      _prevMoveX = 0;
    const V3_ZERO = new Vector3(0);
    function loop() {
      _hasViewportFocusOffset &&
        _this.camera.position.sub(_viewportFocusOffset);
      let moveX = 0,
        moveY = 0;
      (_useCustomMove
        ? ((moveX = Math.clamp(_this.customMove.x, -1, 1)),
          (moveY = Math.clamp(_this.customMove.y, -1, 1)))
        : _this.useAccelerometer &&
            Mobile.Accelerometer &&
            Mobile.Accelerometer.connected
          ? ((moveX = Math.range(Mobile.Accelerometer.x, -2, 2, -1, 1, !0)),
            (moveY = 0))
          : ((moveX = Math.range(Mouse.x, 0, Stage.width, -1, 1, !0)),
            (moveY = Math.range(Mouse.y, 0, Stage.height, -1, 1, !0))),
        (_move.x =
          _this.position.x +
          moveX * _strength.v * _this.moveXY.x * _this.strength),
        (_move.y =
          _this.position.y +
          moveY * _strength.v * _this.moveXY.y * _this.strength));
      let deltaX = moveX - _prevMoveX;
      _prevMoveX = moveX;
      let rotateStrength = Math.range(
        Math.abs(deltaX) / Stage.width,
        0,
        0.02,
        0,
        1,
        !0,
      );
      if (
        ((_rotation = Math.lerp(
          Math.radians(_this.deltaRotate) * rotateStrength * Math.sign(deltaX),
          _rotation,
          0.02 * _this.deltaLerp * _strength.v,
        )),
        (_innerGroup.rotation.z = Math.lerp(
          _rotation,
          _innerGroup.rotation.z,
          0.07 * _this.deltaLerp,
        )),
        (_move.z = _this.position.z),
        _position.lerp(_move, _this.lerpSpeed2),
        (_position.z += _this.zoomOffset),
        _this.camera.position.lerp(_position, _this.lerpSpeed),
        _this.camera.lookAt(_this.lookAt),
        (Math.abs(_this.cameraRotation.x) > Base3D.DIRTY_EPSILON ||
          Math.abs(_this.cameraRotation.y) > Base3D.DIRTY_EPSILON ||
          Math.abs(_this.cameraRotation.z) > Base3D.DIRTY_EPSILON) &&
          (_quaternion.setFromEuler(_this.cameraRotation),
          _this.camera.quaternion.multiply(_quaternion)),
        (function focusViewport() {
          let nextHasViewportFocusOffset =
            Math.abs(_this.viewportFocus.x) > 1e-4 ||
            Math.abs(_this.viewportFocus.y) > 1e-4;
          nextHasViewportFocusOffset !== _hasViewportFocusOffset &&
            (nextHasViewportFocusOffset || _viewportFocusOffset.setScalar(0),
            (_hasViewportFocusOffset = nextHasViewportFocusOffset));
          if (!_hasViewportFocusOffset) return;
          let localCamera = _cacheObj,
            camera = _this.camera;
          camera.matrixDirty && camera.updateMatrix();
          ((localCamera.matrixWorld = camera.matrix),
            (localCamera.projectionMatrix = camera.projectionMatrix),
            _viewportFocusOffset.copy(_this.lookAt).project(localCamera),
            isFinite(_viewportFocusOffset.x) ||
              _viewportFocusOffset.set(0, 0, 0));
          ((_viewportFocusOffset.x -= _this.viewportFocus.x),
            (_viewportFocusOffset.y -= _this.viewportFocus.y),
            _viewportFocusOffset.unproject(localCamera),
            _viewportFocusOffset.sub(_this.lookAt),
            _this.camera.position.add(_viewportFocusOffset));
        })(),
        _this.wobbleStrength > 0)
      ) {
        let t = Render.TIME;
        ((_wobble.x =
          Math.cos(_wobbleAngle + t * (75e-5 * _this.wobbleSpeed)) *
          (_wobbleAngle + 200 * Math.sin(t * (95e-5 * _this.wobbleSpeed)))),
          (_wobble.y =
            Math.sin(
              Math.asin(
                Math.cos(_wobbleAngle + t * (85e-5 * _this.wobbleSpeed)),
              ),
            ) *
            (150 * Math.sin(_wobbleAngle + t * (75e-5 * _this.wobbleSpeed)))),
          (_wobble.x *=
            2 * Math.sin(_wobbleAngle + t * (75e-5 * _this.wobbleSpeed))),
          (_wobble.y *=
            1.75 * Math.cos(_wobbleAngle + t * (65e-5 * _this.wobbleSpeed))),
          (_wobble.x *=
            1.1 * Math.cos(_wobbleAngle + t * (75e-5 * _this.wobbleSpeed))),
          (_wobble.y *=
            1.15 * Math.sin(_wobbleAngle + t * (25e-5 * _this.wobbleSpeed))),
          (_wobble.z =
            Math.sin(_wobbleAngle + 0.0025 * _wobble.x) *
            (100 * _this.wobbleZ)),
          _wobble.multiplyScalar(0.001 * _this.wobbleStrength * _strength.v),
          _innerGroup.position.lerp(_wobble, 0.07),
          _this.flag("hasWobble", !0));
      } else
        _this.flag("hasWobble") &&
          (_innerGroup.position.lerp(V3_ZERO, 0.07),
          _innerGroup.position.length() < 0.001 &&
            (_innerGroup.position.set(0, 0, 0), _this.flag("hasWobble", !1)));
    }
    ((this.strength = 1),
      (this.moveXY = new Vector2(4, 4)),
      (this.position = new (function Position() {
        Inherit(this, Component);
        var _x = 0,
          _y = 0,
          _z = 0;
        (this.get("x", (_) => _x),
          this.get("y", (_) => _y),
          this.get("z", (_) => _z),
          this.set("x", (x) => {
            _x = x;
          }),
          this.set("y", (y) => {
            _y = y;
          }),
          this.set("z", (z) => {
            ((_z = z),
              (_move.z = _z),
              _this.camera.position.copy(_move),
              _position.copy(_move));
          }),
          (this.set = function (x, y, z, noCopy) {
            ((_x = x),
              (_y = y),
              (_z = z),
              (_move.z = z),
              noCopy || _this.camera.position.copy(_move),
              _position.copy(_move));
          }),
          (this.toArray = function () {
            return [_x, _y, _z];
          }),
          (this.fromArray = function (array) {
            ((_x = array[0]),
              (_y = array[1]),
              (_z = array[2]),
              _move.set(_x, _y, _z),
              _this.camera.position.copy(_move),
              _position.copy(_move));
          }),
          (this.copy = function (vec) {
            ((_x = vec.x),
              (_y = vec.y),
              (_z = vec.z),
              _move.set(_x, _y, _z),
              _this.camera.position.copy(_move),
              _position.copy(_move));
          }));
      })()),
      (this.lerpSpeed = 0.05),
      (this.lerpSpeed2 = 1),
      (this.lookAt = new Vector3(0, 0, 0)),
      (this.cameraRotation = new Euler()),
      (this.viewportFocus = new Vector2(0, 0)),
      (this.deltaRotate = 0),
      (this.deltaLerp = 1),
      (this.wobbleSpeed = 1),
      (this.wobbleStrength = 0),
      (this.wobbleZ = 1),
      (this.zoomOffset = 0),
      (function () {
        if (_input) {
          _this.prefix = _input.prefix;
          let cameraUIL = CameraUIL.add(_this, _group);
          (cameraUIL.setLabel("Camera"), (_this.group._cameraUIL = cameraUIL));
        }
        (_this.startRender(loop),
          _innerGroup.add(_this.camera),
          _this.group.add(_innerGroup));
      })(),
      (this.orbit = function (time = 1e3, ease = "easeInOutSine") {
        return tween(_strength, { v: 1 }, time, ease);
      }),
      (this.still = function (time = 300, ease = "easeInOutSine") {
        return tween(_strength, { v: 0 }, time, ease);
      }));
    var _v1 = new Vector3(),
      _v2 = new Vector3(),
      _v3 = new Vector3();
    ((this.move = function (vec) {
      let moveDiff = _v1.subVectors(_move, _this.position),
        positionDiff = _v2.subVectors(_move, _position),
        cameraPosDiff = _v3.subVectors(_this.camera.position, _position);
      (_this.position.set(vec.x, vec.y, vec.z, !0),
        _move.copy(vec).add(moveDiff),
        _position.copy(_move).add(positionDiff),
        _this.camera.position.copy(_position).add(cameraPosDiff));
    }),
      this.get("manualRender", () => _manualRender),
      this.set("manualRender", (value) => {
        (value = !!value) !== _manualRender &&
          ((_manualRender = value)
            ? _this.stopRender(loop)
            : _this.startRender(loop));
      }),
      this.get("useCustomMove", () => _useCustomMove),
      this.set("useCustomMove", (value) => {
        value
          ? ((_useCustomMove = !0),
            _this.customMove || (_this.customMove = new Vector2()))
          : (_useCustomMove = !1);
      }),
      (this.update = function () {
        (_manualRender ||
          !Hydra.LOCAL ||
          _this.flag("manualRenderWarned") ||
          (console.warn(
            "Set manualRender to true if using GazeCamera.update()",
          ),
          _this.flag("manualRenderWarned", !0)),
          loop());
      }));
  }));
class Base3D {
  constructor() {
    ((this.position = new Vector3D()),
      (this.rotation = new Euler()),
      (this.quaternion = new Quaternion()),
      (this.scale = new Vector3D(1, 1, 1)),
      (this._parent = null),
      (this.up = new Vector3(0, 1, 0)),
      (this.isObject3D = !0),
      (this.children = []),
      (this.childrenLength = 0),
      (this.modelViewMatrix = new Matrix4()),
      (this.normalMatrix = new Matrix3()),
      (this.matrix = new Matrix4()),
      (this.matrixWorld = new Matrix4()),
      (this.matrixAutoUpdate = !0),
      (this.matrixWorldNeedsUpdate = !1),
      (this.matrixDirty = !0),
      (this.decomposeDirty = !0),
      (this.visible = !0),
      (this.hidden = !1),
      (this.castShadow = !1),
      (this.frustumCulled = !0),
      (this.occlusionCulled = !1),
      (this._renderOrder = 0),
      (this.worldPos = new Vector3()),
      (this.worldQuat = new Quaternion()));
    const _this = this;
    (this.quaternion.onChange((_) => {
      ((_this.matrixDirty = !0),
        (_this.decomposeDirty = !0),
        _this.onMatrixDirty && _this.onMatrixDirty(),
        _this.rotation.setFromQuaternion(_this.quaternion, void 0, !1));
    }),
      this.rotation.onChange((_) => {
        ((_this.matrixDirty = !0),
          (_this.decomposeDirty = !0),
          _this.onMatrixDirty && _this.onMatrixDirty(),
          _this.quaternion.setFromEuler(_this.rotation, !1));
      }),
      this.scale.onChange((_) => {
        ((_this.matrixDirty = !0),
          (_this.decomposeDirty = !0),
          _this.onMatrixDirty && _this.onMatrixDirty());
      }),
      this.position.onChange((_) => {
        ((_this.matrixDirty = !0),
          (_this.decomposeDirty = !0),
          _this.onMatrixDirty && _this.onMatrixDirty());
      }));
  }
  get renderOrder() {
    return this._renderOrder;
  }
  set renderOrder(value) {
    this._renderOrder = value;
    let p = this._parent;
    for (; p; )
      (p instanceof Scene && (p.displayNeedsUpdate = !0), (p = p._parent));
    for (let i = 0; i < this.children.length; i++)
      this.children[i].renderOrder += value;
  }
  applyMatrix(matrix) {
    return (
      this.matrix.multiplyMatrices(matrix, this.matrix),
      this.matrix.decompose(this.position, this.quaternion, this.scale),
      this
    );
  }
  applyQuaternion(q) {
    return (this.quaternion.premultiply(q), this);
  }
  setRotationFromAxisAngle(axis, angle) {
    this.quaternion.setFromAxisAngle(axis, angle);
  }
  setRotationFromMatrix(m) {
    this.quaternion.setFromRotationMatrix(m);
  }
  setRotationFromQuaternion(q) {
    this.quaternion.copy(q);
  }
  localToWorld(v) {
    return v.applyMatrix4(this.matrixWorld);
  }
  worldToLocal(v) {
    let m1 = this.M1 || new Matrix4();
    return ((this.M1 = m1), v.applyMatrix4(m1.getInverse(this.matrixWorld)));
  }
  lookAt(x, y, z) {
    let m1 = this.M1 || new Matrix4();
    this.M1 = m1;
    let v = this.V1 || new Vector3();
    ((this.V1 = v),
      x.isVector3 ? v.copy(x) : v.set(x, y, z),
      this.isCamera
        ? m1.lookAt(this.position, v, this.up)
        : m1.lookAt(v, this.position, this.up),
      this.quaternion.setFromRotationMatrix(m1));
  }
  add(object) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) this.add(arguments[i]);
      return this;
    }
    if (object === this) return this;
    if (object && object.isScene) throw "You can't add a scene to a group";
    if (
      (object && object.isObject3D
        ? (null !== object._parent && object._parent.remove(object),
          (object._parent = this),
          this.children.push(object),
          (this.childrenLength = this.children.length))
        : console.error("Object is not instance of Object3D", object),
      this.isScene)
    )
      this.displayNeedsUpdate = !0;
    else {
      let p = this._parent;
      for (; p; )
        (p instanceof Scene && (p.displayNeedsUpdate = !0), (p = p._parent));
    }
    return this;
  }
  attach(object) {
    this.updateMatrixWorld(!0);
    let m1 = this.M1 || new Matrix4();
    this.M1 = m1;
    const worldInverse = this.M1.getInverse(this.matrixWorld);
    (null !== object._parent &&
      (object._parent.updateMatrixWorld(!0),
      worldInverse.multiply(object._parent.matrixWorld)),
      object.applyMatrix(worldInverse),
      this.add(object),
      object.updateMatrixWorld(!0));
  }
  remove(object) {
    if (arguments.length > 1) {
      for (let i = 0; i < arguments.length; i++) this.remove(arguments[i]);
      return this;
    }
    if (this.isScene) this.displayNeedsUpdate = !0;
    else {
      let p = this._parent;
      for (; p; )
        (p instanceof Scene && (p.displayNeedsUpdate = !0), (p = p._parent));
    }
    (this.children.remove(object),
      (this.childrenLength = this.children.length));
  }
  getWorldPosition(target, sleep) {
    let v = this.V1 || new Vector3();
    ((this.V1 = v), target || (target = v), sleep || this.updateMatrixWorld());
    let el = this.matrixWorld.elements;
    return (
      (target.x = el[12]),
      (target.y = el[13]),
      (target.z = el[14]),
      target
    );
  }
  getWorldScale(target) {
    let v = this.V1S || new Vector3();
    this.V1S = v;
    let v2 = this.V12 || new Vector3();
    this.V2 = v2;
    let q = this.Q1 || new Quaternion();
    return (
      (this.Q1 = q),
      target || (target = v2),
      this.updateMatrixWorld(),
      this.matrixWorld.decompose(v, q, target),
      target
    );
  }
  getWorldQuaternion(target) {
    let v = this.V1Q || new Vector3();
    this.V1Q = v;
    let q = this.Q1 || new Quaternion();
    return (
      (this.Q1 = q),
      target || (target = q),
      this.updateMatrixWorld(),
      this.matrixWorld.decompose(v, target, v),
      target
    );
  }
  traverse(callback) {
    callback(this);
    let children = this.children;
    for (let i = 0; i < children.length; i++) children[i].traverse(callback);
  }
  updateMatrix() {
    !1 !== this.matrixAutoUpdate &&
      (this.matrix.compose(this.position, this.quaternion, this.scale),
      (this.matrixWorldNeedsUpdate = !0));
  }
  updateMatrixWorld(force) {
    if (!1 === this.matrixAutoUpdate) return;
    if (!force && !this.determineVisible()) return;
    ((this.determineDirty() || force) &&
      !0 === this.matrixAutoUpdate &&
      this.updateMatrix(),
      (!0 !== this.matrixWorldNeedsUpdate && !0 !== force) ||
        (null === this._parent || this.determineNoTransform()
          ? this.matrixWorld.copy(this.matrix)
          : (this.matrixWorld.multiplyMatrices(
              this._parent.matrixWorld,
              this.matrix,
            ),
            RenderStats.active && RenderStats.update("updateMatrixWorld")),
        (this.decomposeDirty = !0),
        (this.matrixWorldNeedsUpdate = !1)));
    const children = this.children;
    for (let i = this.childrenLength - 1; i > -1; i--)
      children[i].updateMatrixWorld(force);
    this.matrixDirty = !1;
  }
  clone(recursive) {
    new this.constructor().copy(this, recursive);
  }
  copy(source, recursive) {
    if (
      ((this.name = source.name),
      this.up.copy(source.up),
      this.position.copy(source.position),
      this.quaternion.copy(source.quaternion),
      this.scale.copy(source.scale),
      this.matrix.copy(source.matrix),
      this.matrixWorld.copy(source.matrixWorld),
      (this.matrixAutoUpdate = source.matrixAutoUpdate),
      (this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate),
      (this.visible = source.visible),
      (this.castShadow = source.castShadow),
      (this.receiveShadow = source.receiveShadow),
      (this.frustumCulled = source.frustumCulled),
      (this.renderOrder = source.renderOrder),
      !0 === recursive)
    )
      for (let i = 0; i < source.children.length; i++) {
        let child = source.children[i];
        this.add(child.clone());
      }
    return this;
  }
  render() {}
  determineVisible() {
    if (!this.visible || this.hidden) return !1;
    let p = this._parent;
    for (; p; ) {
      if (!p.visible || p.hidden) return !1;
      p = p._parent;
    }
    return !0;
  }
  determineDirty() {
    let p = this._parent;
    for (; p; ) {
      if (p.matrixDirty) return !0;
      p = p._parent;
    }
    return this.matrixDirty;
  }
  determineNoTransform() {
    return this._parent
      ? this._parent.determineNoTransform() && this.matrix.isIdentity()
      : this.matrix.isIdentity();
  }
  translateX(distance) {
    (this.xAxis || (this.xAxis = new Vector3(1, 0, 0)),
      this.translateOnAxis(this.xAxis, distance));
  }
  translateY(distance) {
    (this.yAxis || (this.yAxis = new Vector3(0, 1, 0)),
      this.translateOnAxis(this.yAxis, distance));
  }
  translateZ(distance) {
    (this.zAxis || (this.zAxis = new Vector3(0, 0, 1)),
      this.translateOnAxis(this.zAxis, distance));
  }
  translateOnAxis(axis, distance) {
    let v = this.V1 || new Vector3();
    return (
      (this.V1 = v),
      v.copy(axis).applyQuaternion(this.quaternion),
      this.position.add(v.multiplyScalar(distance)),
      this
    );
  }
  upload() {
    (this.shader &&
      (this.shader.upload(this, this.geometry),
      this.shader.shadow && this.shader.shadow.upload(this, this.geometry)),
      this.geometry && this.geometry.upload(this, this.shader));
  }
  destroy() {
    (this.geometry && this.geometry.destroy && this.geometry.destroy(this),
      this.shader && this.shader.destroy && this.shader.destroy(this),
      this.hitDestroy && this.hitDestroy(),
      this._gl && this._gl.ubo && this._gl.ubo.destroy(),
      this._gl && this._gl.vao && this._gl.vao.destroy(),
      this._gl && (this._gl = null),
      this._parent && this._parent.remove(this),
      this.parent &&
        this.parent.__destroyChild &&
        this.parent.__destroyChild(this.__id));
  }
}
((Base3D.DIRTY_EPSILON = 1e-4),
  Class(
    function Renderer(_params = {}) {
      Inherit(this, Component);
      const _this = this;
      var _canvas,
        _gl,
        _width,
        _height,
        _anisotropy,
        _clearColor,
        _projScreenMatrix,
        _frustum,
        _ubo,
        _dpr = 1,
        _resolution = new Vector2(),
        _m0 = new Matrix4(),
        _m1 = new Matrix4(),
        _time = { value: 0 },
        _stencilActive = !1;
      function initCameraUBO(camera) {
        ((camera._ubo = new UBO(0, _gl)),
          camera._ubo.push({ value: camera.projectionMatrix }),
          camera._ubo.push({ value: camera.matrixWorldInverse }),
          camera._ubo.push({ value: camera.worldPos }),
          camera._ubo.push({ value: camera.worldQuat }),
          camera._ubo.push({ value: _resolution }),
          camera._ubo.push(_time),
          camera._ubo.push(Render.timeScaleUniform),
          camera._ubo.upload());
      }
      function sortFrontToBack(array, sortOrder, camera) {
        for (let i = array.length - 1; i > -1; i--) {
          let obj = array[i];
          (obj.__sortVec || (obj.__sortVec = new Vector3()),
            sortOrder == Scene.FRONT_TO_BACK_BOUNDING &&
            obj.geometry &&
            obj.geometry.boundingSphere
              ? obj.__sortVec.copy(obj.geometry.boundingSphere.center)
              : obj.__sortVec.setFromMatrixPosition(camera.modelViewMatrix));
        }
        array.sort((a, b) => b.__sortVec.z - a.__sortVec.z);
      }
      function projectObject(object, camera, scene) {
        if (
          (object.isOcclusionMesh &&
            scene.displayNeedsUpdate &&
            scene.toRender[0].push(object),
          object.doNotProject)
        )
          return;
        let isVisible = !1;
        if (void 0 !== object.shader) {
          let visible =
            object.determineVisible() &&
            object.shader.visible &&
            !object.shader.neverRender &&
            !object.hidden;
          (visible &&
            (object.modelViewMatrix.multiplyMatrices(
              camera.matrixWorldInverse,
              object.matrixWorld,
            ),
            object.normalMatrix.getNormalMatrix(object.modelViewMatrix),
            null !== object._occlusionMesh &&
              object.isMesh &&
              this.useOcclusionQuery &&
              (object.updateOcclusionMesh(),
              object._occlusionMesh.matrixWorld.copy(object.matrixWorld),
              object._occlusionMesh.normalMatrix.copy(object.normalMatrix),
              object._occlusionMesh.modelViewMatrix.copy(
                object.modelViewMatrix,
              ))),
            (isVisible = visible),
            (scene.displayNeedsUpdate ||
              (object.shader.transparent &&
                !scene.disableAutoSort &&
                visible)) &&
              object.getWorldPosition(object.worldPos),
            scene.displayNeedsUpdate &&
              scene.toRender[object.shader.transparent ? 1 : 0].push(object));
        } else isVisible = object.visible && !object.hidden;
        if (isVisible || scene.displayNeedsUpdate)
          for (let i = object.childrenLength - 1; i > -1; i--)
            projectObject(object.children[i], camera, scene);
      }
      function attachSceneUniforms(object, scene, camera) {
        if (
          (Shader.renderer.appendUniform(
            object.shader,
            "normalMatrix",
            object.normalMatrix,
          ),
          Shader.renderer.appendUniform(
            object.shader,
            "modelMatrix",
            object.matrixWorld,
          ),
          Shader.renderer.appendUniform(
            object.shader,
            "modelViewMatrix",
            object.modelViewMatrix,
          ),
          _ubo
            ? camera._ubo.bind(object.shader._gl.program, "global")
            : (Shader.renderer.appendUniform(
                object.shader,
                "projectionMatrix",
                camera.projectionMatrix,
              ),
              Shader.renderer.appendUniform(
                object.shader,
                "viewMatrix",
                camera.matrixWorldInverse,
              ),
              Shader.renderer.appendUniform(
                object.shader,
                "cameraPosition",
                camera.worldPos,
              ),
              Shader.renderer.appendUniform(
                object.shader,
                "cameraQuaternion",
                camera.worldQuat,
              ),
              Shader.renderer.appendUniform(
                object.shader,
                "resolution",
                _resolution,
              ),
              Shader.renderer.appendUniform(object.shader, "time", _time.value),
              Shader.renderer.appendUniform(
                object.shader,
                "timeScale",
                Render.timeScaleUniform.value,
              )),
          _this.shadows &&
            object.shader.receiveShadow &&
            !_this.overridePreventShadows)
        ) {
          let lights = Lighting.getShadowLights();
          (object._gl || (object._gl = {}),
            object._gl.shadowData ||
              (object._gl.shadowData = {
                combined: new Float32Array(16 * lights.length),
              }));
          for (let i = 0; i < lights.length; i++) {
            let light = lights[i];
            (_m1.multiplyMatrices(
              light.shadow.camera.matrixWorldInverse,
              object.matrixWorld,
            ),
              _m0.multiplyMatrices(light.shadow.camera.projectionMatrix, _m1),
              _m0.toArray(object._gl.shadowData.combined, 16 * i));
          }
          scene._shadowData &&
            scene._shadowData.count &&
            ((object.shader.uniforms.shadowMap.value =
              scene._shadowData[
                _this.overridePreventShadows ? "emptyMaps" : "maps"
              ]),
            Shader.renderer.appendUniform(
              object.shader,
              "shadowMatrix",
              object._gl.shadowData.combined,
              "matrix",
            ),
            Shader.renderer.appendUniform(
              object.shader,
              "shadowLightPos",
              scene._shadowData.pos,
              "vec3",
            ),
            Shader.renderer.appendUniform(
              object.shader,
              "shadowSize",
              scene._shadowData.size,
              "float",
            ));
        }
      }
      function attachShadowUniforms(object, scene, light) {
        (light._mvm || (light._mvm = new Matrix4()),
          light._nm || (light._nm = new Matrix3()),
          light._mvm.multiplyMatrices(
            light.shadow.camera.matrixWorldInverse,
            object.matrixWorld,
          ),
          light._nm.getNormalMatrix(object.modelViewMatrix),
          Shader.renderer.appendUniform(
            object.shader.shadow,
            "normalMatrix",
            light._nm,
          ),
          Shader.renderer.appendUniform(
            object.shader.shadow,
            "modelMatrix",
            object.matrixWorld,
          ),
          Shader.renderer.appendUniform(
            object.shader.shadow,
            "modelViewMatrix",
            light._mvm,
          ),
          _ubo
            ? light.shadow.camera._ubo.bind(object.shader._gl.program, "global")
            : (Shader.renderer.appendUniform(
                object.shader.shadow,
                "projectionMatrix",
                light.shadow.camera.projectionMatrix,
              ),
              Shader.renderer.appendUniform(
                object.shader.shadow,
                "viewMatrix",
                light.shadow.camera.matrixWorldInverse,
              )));
      }
      function loop(t, dt) {
        _time.value += 0.001 * dt;
      }
      function render(scene, camera, rt) {
        (rt && rt.width
          ? (_resolution.set(rt.width, rt.height),
            rt.multisample
              ? RenderTarget.renderer.bind(rt._rtMultisample)
              : RenderTarget.renderer.bind(rt))
          : (Renderer.overrideViewport ||
              (_gl.viewport(0, 0, _width * _dpr, _height * _dpr),
              _resolution.set(_canvas.width, _canvas.height)),
            _this.autoClear &&
              (_gl.clearColor(
                Renderer.CLEAR[0],
                Renderer.CLEAR[1],
                Renderer.CLEAR[2],
                Renderer.CLEAR[3],
              ),
              _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT))),
          camera.getWorldPosition(camera.worldPos),
          camera.getWorldQuaternion(camera.worldQuat),
          _frustum.setFromCamera(camera),
          _ubo && (camera._ubo ? camera._ubo.update() : initCameraUBO(camera)));
        for (let l = 0; l < 2; l++) {
          let len = scene.toRender[l].length;
          for (let i = 0; i < len; i++) {
            let object = scene.toRender[l][i];
            if (
              (object.onBeforeRender && object.onBeforeRender(),
              (object._drawing = !1),
              object.determineVisible() &&
                object.shader.visible &&
                !object.shader.neverRender &&
                !object.neverRender &&
                (_this.useOcclusionQuery &&
                  object._occlusionGroup &&
                  (object._occlusionGroup.updateOcclusionBoundingBox(),
                  object._occlusionGroup.updateOcclusionVisibility(
                    object?._gl?.occluded,
                  )),
                _this.useOcclusionQuery &&
                  object.isOcclusionMesh &&
                  _this.type == Renderer.WEBGL2 &&
                  object._queryMesh.occlusionCulled &&
                  (object.shader.draw(object, object.geometry),
                  attachSceneUniforms(object, scene, camera),
                  object.geometry.draw(object, object.shader, !0)),
                !1 === object.frustumCulled ||
                  !0 === _frustum.intersectsObject(object)))
            ) {
              if (
                ((object._drawing = !0),
                object.shader.nullRender ||
                  object?._gl?.occluded ||
                  object.isOcclusionMesh)
              )
                continue;
              let doubleSideTransparency =
                object.shader.side === Shader.DOUBLE_SIDE_TRANSPARENCY;
              (doubleSideTransparency &&
                (object.shader.side = Shader.BACK_SIDE),
                object.shader.draw(object, object.geometry),
                attachSceneUniforms(object, scene, camera),
                object.geometry.draw(object, object.shader),
                doubleSideTransparency &&
                  ((object.shader.side = Shader.FRONT_SIDE),
                  object.shader.draw(object, object.geometry),
                  attachSceneUniforms(object, scene, camera),
                  object.geometry.draw(object, object.shader),
                  (object.shader.side = Shader.DOUBLE_SIDE_TRANSPARENCY)));
            }
          }
        }
        rt &&
          rt.width &&
          (rt.texture.generateMipmaps &&
            (_gl.bindTexture(_gl.TEXTURE_2D, rt.texture._gl),
            _gl.generateMipmap(_gl.TEXTURE_2D),
            _gl.bindTexture(_gl.TEXTURE_2D, null)),
          rt.multisample
            ? (_this.blit(rt._rtMultisample, rt),
              RenderTarget.renderer.unbind(rt._rtMultisample))
            : RenderTarget.renderer.unbind(rt));
      }
      ((this.autoClear = !0),
        (this.shadows = Renderer.SHADOWS_MED),
        (this.useOcclusionQuery = !1),
        (Renderer.instance = _this),
        (Renderer.CLEAR = [0, 0, 0, 1]),
        (function initContext() {
          let contextAttributes = {
            antialias: void 0 !== _params.antialias && _params.antialias,
            powerPreference: _params.powerPreference,
            preserveDrawingBuffer: _params.preserveDrawingBuffer,
            xrCompatible: _params.xrCompatible,
            alpha: void 0 !== _params.alpha && _params.alpha,
            stencil: _params.stencil,
          };
          if (
            ((function iOSContextLoss() {
              return (
                "ios" === Device.system.os &&
                Device.system.browserVersion > 16.7 &&
                Device.system.browserVersion < 17.1
              );
            })() && delete contextAttributes.powerPreference,
            (_this.stencil = !!_params.stencil),
            (_canvas =
              _params.canvas ||
              document.createElement("canvas")).addEventListener(
              "webglcontextlost",
              () => Events.emitter._fireEvent(Events.WEBGL_CONTEXT_LOSS),
              !1,
            ),
            _params.gl
              ? ((_gl = _params.gl),
                (_this.type = Device.graphics.webgl.version.includes([
                  "webgl 2",
                  "webgl2",
                ])
                  ? Renderer.WEBGL2
                  : Renderer.WEBGL1))
              : Device.graphics.webgl
                ? ["webgl2", "webgl", "experimental-webgl"].forEach((name) => {
                    _gl ||
                      ("webgl2" == name && _params.forceWebGL1) ||
                      ((_gl = _canvas.getContext(name, contextAttributes)),
                      (_this.type =
                        _gl && "webgl2" == name
                          ? Renderer.WEBGL2
                          : Renderer.WEBGL1));
                  })
                : ((_gl = new NoGLPolyfill()), (_this.type = Renderer.WEBGL2)),
            !_gl)
          )
            throw "Error! Could not create WebGL context";
          ((_this.domElement = _canvas),
            (_canvas.style.background = "black"),
            (Renderer.type = _this.type),
            (Renderer.context = _this.context = _gl));
        })(),
        (function setExtensions() {
          ((_this.extensions = {}),
            _this.type != Renderer.WEBGL2
              ? ((_this.extensions.VAO = _gl.getExtension(
                  "OES_vertex_array_object",
                )),
                (_this.extensions.instancedArrays = _gl.getExtension(
                  "ANGLE_instanced_arrays",
                )),
                (_this.extensions.standardDerivatives = _gl.getExtension(
                  "OES_standard_derivatives",
                )),
                (_this.extensions.elementIndexUint = _gl.getExtension(
                  "OES_element_index_uint",
                )),
                (_this.extensions.depthTextures = _gl.getExtension(
                  "WEBGL_depth_texture",
                )),
                (_this.extensions.drawBuffers =
                  _gl.getExtension("WEBGL_draw_buffers")),
                (_this.extensions.halfFloat = _gl.getExtension(
                  "OES_texture_half_float",
                )),
                (_this.extensions.float =
                  _gl.getExtension("OES_texture_float")),
                (_this.extensions.colorBufferFloat = _gl.getExtension(
                  "WEBGL_color_buffer_float",
                )),
                (_this.extensions.lod = _gl.getExtension(
                  "EXT_shader_texture_lod",
                )),
                (_this.extensions.minMax =
                  _gl.getExtension("EXT_blend_minmax")))
              : ((_this.extensions.disjointTimerQuery = _gl.getExtension(
                  "EXT_disjoint_timer_query_webgl2",
                )),
                (_this.extensions.colorBufferFloat = _gl.getExtension(
                  "EXT_color_buffer_float",
                )),
                (_this.extensions.oculusMultiview =
                  _gl.getExtension("OCULUS_multiview")),
                (_this.extensions.oculusMultiview2 =
                  _gl.getExtension("OVR_multiview2"))),
            (_this.extensions.filterFloat = _gl.getExtension(
              "OES_texture_float_linear",
            )),
            (_this.extensions.anisotropy =
              _gl.getExtension("EXT_texture_filter_anisotropic") ||
              _gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")),
            (_this.extensions.astc = _gl.getExtension(
              "WEBGL_compressed_texture_astc",
            )),
            (_this.extensions.atc = _gl.getExtension(
              "WEBGL_compressed_texture_atc",
            )),
            (_this.extensions.etc = _gl.getExtension(
              "WEBGL_compressed_texture_etc",
            )),
            (_this.extensions.etc1 = _gl.getExtension(
              "WEBGL_compressed_texture_etc1",
            )),
            (_this.extensions.pvrtc =
              _gl.getExtension("WEBGL_compressed_texture_pvrtc") ||
              _gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc")),
            (_this.extensions.s3tc =
              _gl.getExtension("WEBGL_compressed_texture_s3tc") ||
              _gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc")),
            (_this.extensions.bptc = _gl.getExtension(
              "EXT_texture_compression_bptc",
            )),
            (_this.extensions.s3tc_srgb = _gl.getExtension(
              "WEBGL_compressed_texture_s3tc_srgb",
            )),
            (Renderer.extensions = _this.extensions));
        })(),
        (function initRenderers() {
          ((Geometry.renderer = new GeometryRendererWebGL(_gl)),
            (Texture.renderer = new TextureRendererWebGL(_gl)),
            (Shader.renderer = new ShaderRendererWebGL(_gl)),
            (RenderTarget.renderer = new FBORendererWebGL(_gl)));
        })(),
        (function initMath() {
          ((_projScreenMatrix = new Matrix4()),
            new Vector3(),
            (_frustum = new Frustum()));
        })(),
        (function initUBO() {
          (_this.type == Renderer.WEBGL2 && (_ubo = !0), (Renderer.UBO = _ubo));
        })(),
        _this.startRender(loop),
        (this.render = function (scene, camera, rt, forceToScreen) {
          _this.preventRender ||
            (scene.displayNeedsUpdate &&
              ((scene.toRender[0].length = 0), (scene.toRender[1].length = 0)),
            _this.modifyCameraBeforeRender &&
              (camera.renderCamera || (camera.renderCamera = camera.clone()),
              camera.renderCamera.copy(camera),
              (camera = camera.renderCamera),
              _this.modifyCameraBeforeRender(camera)),
            scene.updateMatrixWorld(),
            camera.parent || camera.updateMatrixWorld(),
            projectObject(scene, camera, scene),
            (scene.displayNeedsUpdate ||
              scene.opaqueSortOrder == Scene.FRONT_TO_BACK) &&
              (function sortOpaque(array, sortOrder, camera) {
                for (let i = array.length - 1; i > -1; i--) {
                  let obj = array[i];
                  obj.shader._gl || obj.shader.upload();
                }
                sortOrder == Scene.FRONT_TO_BACK
                  ? sortFrontToBack(array, sortOrder, camera)
                  : array.sort((a, b) => {
                      if (a.renderOrder !== b.renderOrder)
                        return a.renderOrder - b.renderOrder;
                      let aid = a.shader._gl._id,
                        bid = b.shader._gl._id;
                      return aid !== bid ? aid - bid : a.id - b.id;
                    });
              })(scene.toRender[0], scene.opaqueSortOrder, camera),
            (scene.displayNeedsUpdate ||
              (scene.toRender[1].length && !scene.disableAutoSort)) &&
              (function sortTransparent(array, sortOrder, camera) {
                (RenderStats.update("SortTransparent", array.length),
                  sortOrder == Scene.FRONT_TO_BACK ||
                  sortOrder == Scene.FRONT_TO_BACK_BOUNDING
                    ? sortFrontToBack(array, sortOrder, camera)
                    : array.sort((a, b) =>
                        a.renderOrder !== b.renderOrder
                          ? a.renderOrder - b.renderOrder
                          : a.worldPos.z !== b.worldPos.z
                            ? a.worldPos.z - b.worldPos.z
                            : a.id - b.id,
                      ));
              })(scene.toRender[1], scene.transparentSortOrder, camera),
            _this.shadows &&
              !_this.overridePreventShadows &&
              !_this.pauseShadowRendering &&
              scene.hasShadowLight &&
              (function renderShadows(scene, camera) {
                let render = (light, lightIndex) => {
                    (RenderTarget.renderer.bind(light.shadow.rt),
                      RenderStats.update("ShadowLights"),
                      light.shadow.camera.updateMatrixWorld(),
                      camera.getWorldPosition(camera.worldPos),
                      _frustum.setFromCamera(camera),
                      _ubo &&
                        (light.shadow.camera._ubo
                          ? light.shadow.camera._ubo.update()
                          : initCameraUBO(light.shadow.camera)));
                    for (let l = 0; l < 2; l++)
                      for (let i = 0; i < scene.toRender[l].length; i++) {
                        let object = scene.toRender[l][i];
                        (object.onBeforeRenderShadow &&
                          object.onBeforeRenderShadow(light, lightIndex)) ||
                          (!0 === object.castShadow &&
                            object.determineVisible() &&
                            object.shader.visible &&
                            !object.shader.neverRender &&
                            ((!1 !== object.frustumCulled &&
                              !0 !== _frustum.intersectsObject(object)) ||
                              (object.shader.shadow ||
                                Lighting.initShadowShader(object),
                              object.shader.shadow.draw(
                                object,
                                object.geometry,
                              ),
                              attachShadowUniforms(object, 0, light),
                              object.geometry.draw(
                                object,
                                object.shader.shadow,
                              ),
                              _ubo && light.shadow.camera._ubo.unbind(),
                              RenderStats.update("ShadowMesh"))));
                      }
                    RenderTarget.renderer.unbind(light.shadow.rt);
                  },
                  lights = Lighting.getShadowLights();
                (scene._shadowData ||
                  (scene._shadowData = {
                    maps: [],
                    emptyMaps: [],
                    size: new Float32Array(lights.length),
                    pos: new Float32Array(3 * lights.length),
                    count: lights.length,
                  }),
                  scene._shadowData.count != lights.length &&
                    ((scene._shadowData.size = new Float32Array(lights.length)),
                    (scene._shadowData.pos = new Float32Array(
                      3 * lights.length,
                    )),
                    (scene._shadowData.count = lights.length)));
                for (let i = 0; i < lights.length; i++) {
                  let light = lights[i];
                  (light.prepareRender(),
                    (scene._shadowData.maps[i] = light.shadow.rt.depth),
                    (scene._shadowData.emptyMaps[i] =
                      Utils3D.getEmptyTexture()),
                    (scene._shadowData.size[i] = light.shadow.size),
                    light.position.toArray(scene._shadowData.pos, 3 * i));
                }
                for (let i = 0; i < lights.length; i++) {
                  let light = lights[i];
                  !light.shadow.frozen &&
                    light.determineVisible() &&
                    render(light, i);
                }
              })(scene, camera),
            (rt && !rt.vrRT) || !_this.vrRenderingPath || forceToScreen
              ? rt || !_this.arRenderingPath || forceToScreen
                ? render(scene, camera, rt)
                : _this.arRenderingPath(render, scene, camera)
              : _this.vrRenderingPath(
                  scene,
                  camera,
                  _projScreenMatrix,
                  _frustum,
                  attachSceneUniforms,
                  rt,
                ),
            (scene.displayNeedsUpdate = !1),
            Shader.renderer.resetState());
        }),
        (this.renderSingle = function (object, camera, rt) {
          if (_this.preventRender) return;
          (rt
            ? (_resolution.set(rt.width, rt.height),
              rt.multisample
                ? RenderTarget.renderer.bind(rt._rtMultisample)
                : RenderTarget.renderer.bind(rt))
            : (Renderer.overrideViewport ||
                (_gl.viewport(0, 0, _width * _dpr, _height * _dpr),
                _resolution.set(_canvas.width, _canvas.height)),
              _this.autoClear &&
                (_gl.clearColor(
                  Renderer.CLEAR[0],
                  Renderer.CLEAR[1],
                  Renderer.CLEAR[2],
                  Renderer.CLEAR[3],
                ),
                _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT))),
            camera.getWorldPosition(camera.worldPos),
            camera.getWorldQuaternion(camera.worldQuat),
            object.modelViewMatrix.multiplyMatrices(
              camera.matrixWorldInverse,
              object.matrixWorld,
            ),
            object.normalMatrix.getNormalMatrix(object.modelViewMatrix),
            object.getWorldPosition(object.worldPos),
            _ubo &&
              (camera._ubo
                ? camera.pauseUBO || camera._ubo.update()
                : initCameraUBO(camera)));
          let doubleSideTransparency =
            object.shader.side === Shader.DOUBLE_SIDE_TRANSPARENCY;
          (doubleSideTransparency &&
            ((object.shader.side = Shader.BACK_SIDE),
            object.shader._renderFrontFirst &&
              (object.shader.side = Shader.FRONT_SIDE)),
            object.shader.draw(object, object.geometry),
            object.noMatrices ||
              (Shader.renderer.appendUniform(
                object.shader,
                "normalMatrix",
                object.normalMatrix,
              ),
              Shader.renderer.appendUniform(
                object.shader,
                "modelMatrix",
                object.matrixWorld,
              ),
              Shader.renderer.appendUniform(
                object.shader,
                "modelViewMatrix",
                object.modelViewMatrix,
              )),
            _ubo
              ? camera._ubo.bind(object.shader._gl.program, "global")
              : (Shader.renderer.appendUniform(
                  object.shader,
                  "projectionMatrix",
                  camera.projectionMatrix,
                ),
                Shader.renderer.appendUniform(
                  object.shader,
                  "viewMatrix",
                  camera.matrixWorldInverse,
                ),
                Shader.renderer.appendUniform(
                  object.shader,
                  "cameraPosition",
                  camera.worldPos,
                ),
                Shader.renderer.appendUniform(
                  object.shader,
                  "cameraQuaternion",
                  camera.worldQuat,
                ),
                Shader.renderer.appendUniform(
                  object.shader,
                  "resolution",
                  _resolution,
                ),
                Shader.renderer.appendUniform(
                  object.shader,
                  "time",
                  _time.value,
                ),
                Shader.renderer.appendUniform(
                  object.shader,
                  "timeScale",
                  Render.timeScaleUniform.value,
                )),
            object.geometry.draw(object, object.shader),
            doubleSideTransparency &&
              ((object.shader.side = Shader.FRONT_SIDE),
              object.shader._renderFrontFirst &&
                (object.shader.side = Shader.BACK_SIDE),
              object.shader.draw(object, object.geometry),
              object.geometry.draw(object, object.shader),
              (object.shader.side = Shader.DOUBLE_SIDE_TRANSPARENCY)),
            _ubo && camera._ubo.unbind(),
            rt &&
              (rt.texture.generateMipmaps &&
                (_gl.bindTexture(_gl.TEXTURE_2D, rt.texture._gl),
                _gl.generateMipmap(_gl.TEXTURE_2D),
                _gl.bindTexture(_gl.TEXTURE_2D, null)),
              rt.multisample
                ? (_this.blit(rt._rtMultisample, rt),
                  RenderTarget.renderer.unbind(rt._rtMultisample))
                : RenderTarget.renderer.unbind(rt)),
            Shader.renderer.resetState());
        }),
        (this.setClearColor = function (color, alpha = 1) {
          ((_clearColor = new Color(color)),
            (Renderer.CLEAR = [
              _clearColor.r,
              _clearColor.g,
              _clearColor.b,
              alpha,
            ]));
        }),
        (this.setClearAlpha = function (alpha) {
          Renderer.CLEAR[3] = alpha;
        }),
        (this.getClearColor = function () {
          return (
            _clearColor || (_clearColor = new Color(0, 0, 0)),
            _clearColor
          );
        }),
        (this.getClearAlpha = function () {
          return Renderer.CLEAR[3];
        }),
        (this.setPixelRatio = function (dpr) {
          ((_dpr = dpr), this.setSize(_width, _height));
        }),
        (this.setSize = function (width, height) {
          ((_width = width),
            (_height = height),
            (_canvas.width = width * _dpr),
            (_canvas.height = height * _dpr),
            (_canvas.style.width = `${width}px`),
            (_canvas.style.height = `${height}px`),
            _resolution.set(_canvas.width, _canvas.height));
        }),
        (this.getMaxAnisotropy = function () {
          return Device.graphics.webgl && _this.extensions.anisotropy
            ? (_anisotropy ||
                (_anisotropy = _gl.getParameter(
                  _this.extensions.anisotropy.MAX_TEXTURE_MAX_ANISOTROPY_EXT,
                )),
              _anisotropy)
            : 0;
        }),
        (this.readPixels = function (
          rt,
          x = 0,
          y = 0,
          width,
          height,
          array,
          type = _gl.UNSIGNED_BYTE,
        ) {
          (width || (width = rt ? rt.width : 1),
            height || (height = rt ? rt.height : 1),
            (width = Math.round(width)),
            (height = Math.round(height)),
            (type = type || _gl.UNSIGNED_BYTE));
          let w = Math.round(width - x),
            h = Math.round(height - y);
          return (
            array || (array = new Uint8Array(w * h * 4)),
            _gl.bindFramebuffer(_gl.FRAMEBUFFER, rt ? rt._gl : null),
            _gl.readPixels(x, y, width, height, _gl.RGBA, type, array),
            _gl.bindFramebuffer(_gl.FRAMEBUFFER, null),
            array
          );
        }),
        (this.blit = function (input, output, mask = _gl.COLOR_BUFFER_BIT) {
          if (_this.type != Renderer.WEBGL2) return !1;
          if (
            (input._gl || input.upload(),
            output._gl || output.upload(),
            _gl.bindFramebuffer(_gl.READ_FRAMEBUFFER, input._gl),
            _gl.bindFramebuffer(_gl.DRAW_FRAMEBUFFER, output._gl),
            input === output._rtMultisample &&
              (output.depth && (mask |= _gl.DEPTH_BUFFER_BIT),
              output.stencil && (mask |= _gl.STENCIL_BUFFER_BIT)),
            _gl.blitFramebuffer(
              0,
              0,
              input.width,
              input.height,
              0,
              0,
              output.width,
              output.height,
              mask,
              _gl.NEAREST,
            ),
            input === output._rtMultisample && output.multi)
          ) {
            let attachments = output.attachments;
            for (let i = 1; i < attachments.length; i++) {
              let texture = attachments[i];
              (_gl.readBuffer(_gl[`COLOR_ATTACHMENT${i}`]),
                _gl.bindFramebuffer(
                  _gl.DRAW_FRAMEBUFFER,
                  texture._blitFramebuffer,
                ),
                _gl.blitFramebuffer(
                  0,
                  0,
                  input.width,
                  input.height,
                  0,
                  0,
                  output.width,
                  output.height,
                  _gl.COLOR_BUFFER_BIT,
                  _gl.NEAREST,
                ));
            }
            _gl.readBuffer(_gl.COLOR_ATTACHMENT0);
          }
          return (
            _gl.bindFramebuffer(_gl.READ_FRAMEBUFFER, null),
            _gl.bindFramebuffer(_gl.DRAW_FRAMEBUFFER, null),
            !0
          );
        }),
        (this.setupStencilMask = function (ref = 1) {
          (_stencilActive ||
            (_gl.enable(_gl.STENCIL_TEST),
            _gl.clear(_gl.STENCIL_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT)),
            (_stencilActive = !0),
            _gl.stencilFunc(_gl.ALWAYS, ref, 255),
            _gl.stencilOp(_gl.KEEP, _gl.KEEP, _gl.REPLACE),
            _gl.stencilMask(255),
            _gl.colorMask(!1, !1, !1, !1),
            _gl.disable(_gl.DEPTH_TEST));
        }),
        (this.setupStencilDraw = function (mode, ref = 1) {
          (_gl.colorMask(!0, !0, !0, !0),
            _gl.enable(_gl.DEPTH_TEST),
            _gl.stencilFunc(
              "inside" == mode ? _gl.EQUAL : _gl.NOTEQUAL,
              ref,
              255,
            ),
            _gl.stencilOp(_gl.KEEP, _gl.KEEP, _gl.KEEP));
        }),
        (this.clearStencil = function () {
          (_gl.disable(_gl.STENCIL_TEST), (_stencilActive = !1));
        }),
        (this.clearDepth = function (rt) {
          (rt && !rt._gl && rt.upload(),
            rt && _gl.bindFramebuffer(_gl.FRAMEBUFFER, rt._gl),
            _gl.clear(_gl.DEPTH_BUFFER_BIT),
            rt && _gl.bindFramebuffer(_gl.FRAMEBUFFER, null));
        }),
        (this.clearColor = function (rt) {
          (rt && !rt._gl && rt.upload(),
            rt && _gl.bindFramebuffer(_gl.FRAMEBUFFER, rt._gl),
            _gl.clearColor(
              Renderer.CLEAR[0],
              Renderer.CLEAR[1],
              Renderer.CLEAR[2],
              Renderer.CLEAR[3],
            ),
            _gl.clear(_gl.COLOR_BUFFER_BIT),
            rt && _gl.bindFramebuffer(_gl.FRAMEBUFFER, null));
        }),
        this.get("resolution", (_) => _resolution),
        this.get("time", (_) => _time),
        this.get("canvas", (_) => _canvas));
    },
    (_) => {
      ((Renderer.WEBGL1 = "webgl1"),
        (Renderer.WEBGL2 = "webgl2"),
        (Renderer.STATIC_SHADOWS = "static_shadows"),
        (Renderer.SHADOWS_LOW = "shadows_low"),
        (Renderer.SHADOWS_MED = "shadows_med"),
        (Renderer.SHADOWS_HIGH = "shadows_high"),
        (Renderer.ID = 0));
    },
  ));
class CameraBase3D extends Base3D {
  constructor() {
    (super(),
      (this.matrixWorldInverse = new Matrix4()),
      (this.projectionMatrix = new Matrix4()),
      (this.isCamera = !0));
  }
  copy(source, recursive) {
    return (
      Base3D.prototype.copy.call(this, source, recursive),
      this.matrixWorldInverse.copy(source.matrixWorldInverse),
      this.projectionMatrix.copy(source.projectionMatrix),
      this
    );
  }
  updateMatrixWorld(force) {
    (Base3D.prototype.updateMatrixWorld.call(this, force),
      this.offsetMatrixWorld &&
        this.matrixWorld.multiply(this.offsetMatrixWorld),
      this.matrixWorldInverse.getInverse(this.matrixWorld));
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class CubeCamera extends Base3D {
  constructor(near = 0.1, far = 1e3, cubeResolution = 512) {
    super();
    ((this.px = new PerspectiveCamera(90, 1, near, far)),
      this.px.up.set(0, -1, 0),
      this.px.lookAt(new Vector3(1, 0, 0)),
      this.add(this.px),
      (this.nx = new PerspectiveCamera(90, 1, near, far)),
      this.nx.up.set(0, -1, 0),
      this.nx.lookAt(new Vector3(-1, 0, 0)),
      this.add(this.nx),
      (this.py = new PerspectiveCamera(90, 1, near, far)),
      this.py.up.set(0, 0, 1),
      this.py.lookAt(new Vector3(0, 1, 0)),
      this.add(this.py),
      (this.ny = new PerspectiveCamera(90, 1, near, far)),
      this.ny.up.set(0, 0, -1),
      this.ny.lookAt(new Vector3(0, -1, 0)),
      this.add(this.ny),
      (this.pz = new PerspectiveCamera(90, 1, near, far)),
      this.pz.up.set(0, -1, 0),
      this.pz.lookAt(new Vector3(0, 0, 1)),
      this.add(this.pz),
      (this.nz = new PerspectiveCamera(90, 1, near, far)),
      this.nz.up.set(0, -1, 0),
      this.nz.lookAt(new Vector3(0, 0, -1)),
      this.add(this.nz),
      (this.rt = new CubeRenderTarget(cubeResolution, cubeResolution)));
  }
  render(scene = World.SCENE, renderer = World.RENDERER) {
    let rt = this.rt;
    (this.updateMatrixWorld(!0),
      this.beforeRender && this.beforeRender(this.px),
      (rt.activeFace = 0),
      renderer.render(scene, this.px, rt),
      this.afterRender && this.afterRender(rt),
      this.beforeRender && this.beforeRender(this.nx),
      (rt.activeFace = 1),
      renderer.render(scene, this.nx, rt),
      this.afterRender && this.afterRender(rt),
      this.beforeRender && this.beforeRender(this.py),
      (rt.activeFace = 2),
      renderer.render(scene, this.py, rt),
      this.afterRender && this.afterRender(rt),
      this.beforeRender && this.beforeRender(this.ny),
      (rt.activeFace = 3),
      renderer.render(scene, this.ny, rt),
      this.afterRender && this.afterRender(rt),
      this.beforeRender && this.beforeRender(this.pz),
      (rt.activeFace = 4),
      renderer.render(scene, this.pz, rt),
      this.afterRender && this.afterRender(rt),
      this.beforeRender && this.beforeRender(this.nz),
      (rt.activeFace = 5),
      renderer.render(scene, this.nz, rt),
      this.afterRender && this.afterRender(rt));
  }
}
class OrthographicCamera extends CameraBase3D {
  constructor(left, right, top, bottom, near, far) {
    (super(),
      (this.isOrthographicCamera = !0),
      (this.zoom = 1),
      (this.left = left),
      (this.right = right),
      (this.top = top),
      (this.bottom = bottom),
      (this.near = void 0 !== near ? near : 0.1),
      (this.far = void 0 !== far ? far : 2e3),
      (this.position.z = 1),
      this.updateProjectionMatrix());
  }
  clone() {
    return new OrthographicCamera().copy(this);
  }
  copy(source, recursive) {
    return (
      CameraBase3D.prototype.copy.call(this, source, recursive),
      (this.left = source.left),
      (this.right = source.right),
      (this.top = source.top),
      (this.bottom = source.bottom),
      (this.near = source.near),
      (this.far = source.far),
      (this.zoom = source.zoom),
      (this.view =
        null === source.view ? null : Object.assign({}, source.view)),
      this
    );
  }
  updateProjectionMatrix() {
    let dx = (this.right - this.left) / (2 * this.zoom),
      dy = (this.top - this.bottom) / (2 * this.zoom),
      cx = (this.right + this.left) / 2,
      cy = (this.top + this.bottom) / 2,
      left = cx - dx,
      right = cx + dx,
      top = cy + dy,
      bottom = cy - dy;
    this.projectionMatrix.makeOrthographic(
      left,
      right,
      top,
      bottom,
      this.near,
      this.far,
    );
  }
  setViewport(width, height) {
    ((this.left = width / -2),
      (this.right = width / 2),
      (this.top = height / 2),
      (this.bottom = height / -2),
      this.updateProjectionMatrix());
  }
}
class PerspectiveCamera extends CameraBase3D {
  constructor(fov, aspect, near, far) {
    (super(),
      (this.type = "PerspectiveCamera"),
      (this.fov = fov || 50),
      (this.zoom = 1),
      (this.near = near || 0.1),
      (this.far = far || 2e3),
      (this.focus = 10),
      (this.aspect = aspect || 1),
      (this.filmGauge = 35),
      (this.filmOffset = 0),
      this.updateProjectionMatrix());
  }
  clone() {
    return new PerspectiveCamera().copy(this);
  }
  copy(source, recursive) {
    return (
      CameraBase3D.prototype.copy.call(this, source, recursive),
      (this.fov = source.fov),
      (this.zoom = source.zoom),
      (this.near = source.near),
      (this.far = source.far),
      (this.focus = source.focus),
      (this.aspect = source.aspect),
      (this.filmGauge = source.filmGauge),
      (this.filmOffset = source.filmOffset),
      this
    );
  }
  setFocalLength(focalLength) {
    let vExtentSlope = (0.5 * this.getFilmHeight()) / focalLength;
    ((this.fov = Math.degrees(2 * Math.atan(vExtentSlope))),
      this.updateProjectionMatrix());
  }
  getFocalLength() {
    let vExtentSlope = Math.tan(Math.radians(0.5 * this.fov));
    return (0.5 * this.getFilmHeight()) / vExtentSlope;
  }
  getEffectiveFOV() {
    return Math.degrees(
      2 * Math.atan(Math.tan(Math.radians(0.5 * this.fov)) / this.zoom),
    );
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  updateProjectionMatrix() {
    let near = this.near,
      top = (near * Math.tan(Math.radians(0.5 * this.fov))) / this.zoom,
      height = 2 * top,
      width = this.aspect * height,
      left = -0.5 * width,
      skew = (this.view, this.filmOffset);
    (0 !== skew && (left += (near * skew) / this.getFilmWidth()),
      this.projectionMatrix.makePerspective(
        left,
        left + width,
        top,
        top - height,
        near,
        this.far,
      ));
  }
}


