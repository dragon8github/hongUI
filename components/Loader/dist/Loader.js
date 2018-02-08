'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 获取当前js文件所在的路径
var getPath = function () {
  var jsPath = document.currentScript ? document.currentScript.src : function () {
    var js = document.scripts,
        last = js.length - 1,
        src;for (var i = last; i > 0; i--) {
      if (js[i].readyState === 'interactive') {
        src = js[i].src;break;
      }
    }return src || js[last].src;
  }();return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
}();
// 加载样式文件
var setStyle = function setStyle(cssname) {
  var head = document.getElementsByTagName('head')[0];var linkTag = document.createElement('link');linkTag.href = getPath + cssname;linkTag.setAttribute('rel', 'stylesheet');linkTag.setAttribute('type', 'text/css');head.appendChild(linkTag);
};(function (win, Vue) {
  'use strict';

  setStyle("Loader.css");

  var Spinner = Vue.extend({
    template: '\n          <div class="hong-spinner-snake" :style="{\n                \'border-top-color\': spinnerColor,\n                \'border-left-color\': spinnerColor,\n                \'border-bottom-color\': spinnerColor,\n                \'height\': spinnerSize,\n                \'width\': spinnerSize\n          }">\n          </div>',
    props: {
      size: {
        type: Number,
        default: 40
      },
      color: {
        type: String,
        default: '#ccc'
      },
      borderWidth: {
        type: Number,
        default: 7
      }
    },
    computed: {
      spinnerColor: function spinnerColor() {
        return this.color || this.$parent.color || '#ccc';
      },
      spinnerSize: function spinnerSize() {
        return (this.size || this.$parent.size || 28) + 'px';
      },
      spinnerBoderWidth: function spinnerBoderWidth() {
        return (this.borderWidth || this.$parent.borderWidth || 4) + 'px';
      }
    }
  });

  var Loader = Vue.extend({
    template: '\n           <transition name="hong-loader">\n               <div class="hong-loader" v-show="visible">\n                 <div class="hong-loader-wrapper">\n                   <spinner :show="true"></spinner>\n                   <span class="hong-loader-text" v-show="text">{{ text }}</span>\n                 </div>\n                 <div class="hong-loader-mask" @touchmove.stop.prevent></div>\n               </div>\n           </transition>\n       ',
    data: function data() {
      return {
        visible: false,
        text: ''
      };
    },
    components: {
      Spinner: Spinner
    }
  });

  var myLoader = {};
  var instance;
  var idlader_arr = [];
  myLoader.show = function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    // 我自己添加的模式，如果存在id，那么也需要id才可以关闭
    if (id) {
      // 新建一个属于自己的Loader
      var myinstance = void 0;

      // 从缓存中遍历看看有没有和id一样的Loader，如果有的话直接从缓存取即可
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = idlader_arr.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref = _step.value;

          var _ref2 = _slicedToArray(_ref, 2);

          var index = _ref2[0];
          var ele = _ref2[1];

          if (Object.keys(ele)[0] + '' == id) {
            myinstance = Object.values(ele)[0];
            break;
          }
        }

        // 如果缓存没有则新建一个
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      myinstance = myinstance || new Loader({ el: document.createElement('div') });

      // 加入到缓存中
      idlader_arr.push(_defineProperty({}, id, myinstance));

      // 设置文本
      myinstance.text = typeof options === 'string' ? options : options.text || '';

      // 设置形状，默认为snake（其实已经写死为snake了）
      myinstance.spinnerType = options.spinnerType || 'snake';

      // 插入body中
      document.body.appendChild(myinstance.$el);

      // 等待加载完成就显示出来
      Vue.nextTick(function () {
        myinstance.visible = true;
      });
    } else {

      // 单例模式
      if (!instance) {
        instance = new Loader({
          el: document.createElement('div')
        });
      }

      // 如果已经在显示中，那么返回
      if (instance.visible) return;

      // 设置文本
      instance.text = typeof options === 'string' ? options : options.text || '';

      // 设置形状，默认为snake（其实已经写死为snake了）
      instance.spinnerType = options.spinnerType || 'snake';

      // 插入body中
      document.body.appendChild(instance.$el);

      // 等待加载完成就显示出来
      Vue.nextTick(function () {
        instance.visible = true;
      });
    }
  };

  myLoader.hide = function () {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    // 自己添加的逻辑
    if (id && idlader_arr.length) {
      // 新建一个属于自己的Loader
      var myinstance = void 0;

      // 从缓存中遍历看看有没有和id一样的Loader
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = idlader_arr.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref3 = _step2.value;

          var _ref4 = _slicedToArray(_ref3, 2);

          var index = _ref4[0];
          var ele = _ref4[1];

          if (Object.keys(ele)[0] + '' == id) {
            myinstance = Object.values(ele)[0];
            break;
          }
        }
        // 如果缓存列表中存在该id，则隐藏指定的Loader
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (myinstance) myinstance.visible = false;

      // 官方本来的逻辑
    } else {
      if (instance) {
        instance.visible = false;
      }
    }
  };

  myLoader.hideAll = function () {
    if (instance) {
      instance.visible = false;
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = idlader_arr.entries()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var _ref5 = _step3.value;

        var _ref6 = _slicedToArray(_ref5, 2);

        var index = _ref6[0];
        var ele = _ref6[1];

        Object.values(ele)[0].visible = false;
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }
  };

  Vue.prototype.Loader = myLoader;
  window.Loader = myLoader;
})(window, Vue);
//# sourceMappingURL=Loader.js.map
