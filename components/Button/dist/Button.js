'use strict';

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

  console.log(getPath);

  setStyle("Button.css");
  setStyle("icon.css");

  var Button = Vue.extend({
    template: '\n                <button\n                    class="hong-button"\n                    @click="handleClick"\n                    :disabled="disabled"\n                    :autofocus="autofocus"\n                    :type="nativeType"\n                    :class="[\n                      type ? \'hong-button--\' + type : \'\',\n                      buttonSize ? \'hong-button--\' + buttonSize : \'\',\n                      {\n                        \'is-disabled\': disabled,\n                        \'is-loading\': loading,\n                        \'is-plain\': plain,\n                        \'is-round\': round\n                      }\n                    ]"\n                  >\n                    <i class="hong-icon-loading" v-if="loading" @click="handleInnerClick"></i>\n                    <i :class="icon" v-if="icon && !loading" @click="handleInnerClick"></i>\n                    <span v-if="$slots.default" @click="handleInnerClick"><slot></slot></span>\n                  </button>\n        ',
    inject: {
      elFormItem: {
        default: ''
      }
    },
    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      autofocus: Boolean,
      round: Boolean
    },
    computed: {
      _elFormItemSize: function _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      buttonSize: function buttonSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      }
    },
    methods: {
      handleClick: function handleClick(evt) {
        this.$emit('click', evt);
      },
      handleInnerClick: function handleInnerClick(evt) {
        if (this.disabled) {
          evt.stopPropagation();
        }
      }
    }
  });
  Vue.component('hong-button', Button);
})(window, Vue);
//# sourceMappingURL=Button.js.map
