/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!******************!*\
  !*** ./index.ts ***!
  \******************/


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var StyleSwitcher = /*#__PURE__*/function () {
  function StyleSwitcher() {
    _classCallCheck(this, StyleSwitcher);
    this.styles = {
      st1: {
        name: "style1.css",
        path: "./styles/index1.css"
      },
      st2: {
        name: "style2.css",
        path: "./styles/index2.css"
      },
      st3: {
        name: "style3.css",
        path: "./styles/index3.css"
      }
    };
    this.currentStyle = "style1.css";
    this.init();
  }
  return _createClass(StyleSwitcher, [{
    key: "init",
    value: function init() {
      this.createSwitcherButtons();
    }
  }, {
    key: "switchStyle",
    value: function switchStyle(styleKey) {
      var styleElement = document.getElementById("page-style");
      if (this.styles[styleKey]) {
        styleElement.href = this.styles[styleKey].path;
        this.currentStyle = styleKey;
      } else {
        console.error("Style \"".concat(styleKey, "\" not found."));
      }
    }
  }, {
    key: "createSwitcherButtons",
    value: function createSwitcherButtons() {
      var _this = this;
      var container = document.querySelector(".switcher");
      if (!container) {
        return;
      }
      container.innerHTML = "";
      var _loop = function _loop(key) {
        var button = document.createElement("button");
        button.textContent = "style ".concat(_this.styles[key].name);
        button.classList.add("switch-button");
        button.addEventListener("click", function () {
          return _this.switchStyle(key);
        });
        container.appendChild(button);
      };
      for (var key in this.styles) {
        _loop(key);
      }
    }
  }]);
}();
document.addEventListener("DOMContentLoaded", function () {
  new StyleSwitcher();
});
/******/ })()
;