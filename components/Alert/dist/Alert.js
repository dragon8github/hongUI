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

  setStyle("Alert.css");
  setStyle("icon.css");

  var TYPE_CLASSES_MAP = {
    'success': 'hong-icon-success',
    'warning': 'hong-icon-warning',
    'error': 'hong-icon-error'
  };

  var Alert = Vue.extend({
    template: '\n            <transition name="hong-alert-fade">\n                  <div class="hong-alert"\n                       :class="[typeClass, center ? \'is-center\' : \'\']"\n                       v-show="visible"\n                       role="alert"\n                  >\n                    <i class="hong-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>\n                    <div class="hong-alert__content">\n                         <span class="hong-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>\n                         <slot><p class="hong-alert__description" v-if="description">{{ description }}</p></slot>\n                         <i class="hong-alert__closebtn" :class="{ \'is-customed\': closeText !== \'\', \'hong-icon-close\': closeText === \'\' }" v-show="closable" @click="close()">{{closeText}}</i>\n                    </div>\n                  </div>\n            </transition>\n        ',
    data: function data() {
      return {
        visible: true
      };
    },

    props: {
      title: { type: String, default: '', required: true },
      description: { type: String, default: '' },
      type: { type: String, default: 'info' },
      closable: { type: Boolean, default: true },
      closeText: { type: String, default: '' },
      showIcon: Boolean,
      center: Boolean
    },
    methods: {
      close: function close() {
        this.visible = false;
        this.$emit('close');
      }
    },
    computed: {
      typeClass: function typeClass() {
        return 'hong-alert--' + this.type;
      },
      iconClass: function iconClass() {
        return TYPE_CLASSES_MAP[this.type] || 'hong-icon-info';
      },
      isBigIcon: function isBigIcon() {
        return this.description || this.$slots.default ? 'is-big' : '';
      },
      isBoldTitle: function isBoldTitle() {
        return this.description || this.$slots.default ? 'is-bold' : '';
      }
    }
  });

  Vue.component('hong-alert', Alert);
})(window, Vue);
//# sourceMappingURL=Alert.js.map
