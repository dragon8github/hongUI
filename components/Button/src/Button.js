// 获取当前js文件所在的路径
var getPath = function(){var jsPath = document.currentScript ? document.currentScript.src : function(){var js = document.scripts ,last = js.length - 1 ,src; for(var i = last; i > 0; i--){if(js[i].readyState === 'interactive'){src = js[i].src; break; } } return src || js[last].src; }(); return jsPath.substring(0, jsPath.lastIndexOf('/') + 1); }();
// 加载样式文件
var setStyle = function setStyle(cssname) {var head = document.getElementsByTagName('head')[0]; const linkTag = document.createElement('link');linkTag.href = getPath + cssname;linkTag.setAttribute('rel', 'stylesheet');linkTag.setAttribute('type', 'text/css');head.appendChild(linkTag); }

;(function (win, Vue) {
    'use strict';

    console.log(getPath);

    setStyle("Button.css")
    setStyle("icon.css")

    var Button = Vue.extend({
        template: `
                <button
                    class="hong-button"
                    @click="handleClick"
                    :disabled="disabled"
                    :autofocus="autofocus"
                    :type="nativeType"
                    :class="[
                      type ? 'hong-button--' + type : '',
                      buttonSize ? 'hong-button--' + buttonSize : '',
                      {
                        'is-disabled': disabled,
                        'is-loading': loading,
                        'is-plain': plain,
                        'is-round': round
                      }
                    ]"
                  >
                    <i class="hong-icon-loading" v-if="loading" @click="handleInnerClick"></i>
                    <i :class="icon" v-if="icon && !loading" @click="handleInnerClick"></i>
                    <span v-if="$slots.default" @click="handleInnerClick"><slot></slot></span>
                  </button>
        `,
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
          _elFormItemSize() {
            return (this.elFormItem || {}).elFormItemSize;
          },
          buttonSize() {
            return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
          }
        },
        methods: {
          handleClick(evt) {
            this.$emit('click', evt);
          },
          handleInnerClick(evt) {
            if (this.disabled) {
              evt.stopPropagation();
            }
          }
        }
    })    
    Vue.component('hong-button', Button);
})(window, Vue);