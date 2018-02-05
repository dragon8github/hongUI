// 获取当前js文件所在的路径
var getPath = function(){var jsPath = document.currentScript ? document.currentScript.src : function(){var js = document.scripts ,last = js.length - 1 ,src; for(var i = last; i > 0; i--){if(js[i].readyState === 'interactive'){src = js[i].src; break; } } return src || js[last].src; }(); return jsPath.substring(0, jsPath.lastIndexOf('/') + 1); }();
// 加载样式文件
var setStyle = function (cssname) {var head = document.getElementsByTagName('head')[0]; linkTag = document.createElement('link'); linkTag.href = getPath + cssname; linkTag.setAttribute('rel','stylesheet'); linkTag.setAttribute('type','text/css'); head.appendChild(linkTag); }

;(function (win, Vue) {
    'use strict';

    setStyle("icon.css")
    setStyle("Message.css")


    const typeMap = {
       success: 'success',
       info: 'info',
       warning: 'warning',
       error: 'error'
     };

    var Message = Vue.extend({
        template: `
          <transition name="hong-message-fade">
              <div :class="[
                      'hong-message',
                      type && !iconClass ? 'hong-message--' + type : '',
                      center ? 'is-center' : '',
                      showClose ? 'is-closable' : '',
                      customClass
                  ]"
                  v-show="visible"
                  @mouseenter="clearTimer"
                  @mouseleave="startTimer"
                  role="alert"
              >
                <i :class="iconClass" v-if="iconClass"></i>
                <i :class="typeClass" v-else></i>
                <slot>
                    <p v-if="!dangerouslyUseHTMLString" class="hong-message__content">{{ message }}</p>
                    <p v-else v-html="message" class="hong-message__content"></p>
                </slot>
                <i v-if="showClose" class="hong-message__closeBtn hong-icon-close" @click="close"></i>
              </div>
            </transition>
        `,
        data() {
              return {
                visible: false,
                message: '',
                duration: 3000,
                type: 'info',
                iconClass: '',
                customClass: '',
                onClose: null,
                showClose: false,
                closed: false,
                timer: null,
                dangerouslyUseHTMLString: false,
                center: false
              };
        },
        computed: {
             iconWrapClass() {
               const classes = ['hong-message__icon'];
               if (this.type && !this.iconClass) {
                 classes.push(`hong-message__icon--${ this.type }`);
               }
               return classes;
             },
             typeClass() {
               return this.type && !this.iconClass
                 ? `hong-message__icon hong-icon-${ typeMap[this.type] }`
                 : '';
             }
         },
         watch: {
             closed(newVal) {
               if (newVal) {
                 this.visible = false;
                 this.$el.addEventListener('transitionend', this.destroyElement);
               }
             }
         },
         methods: {
             destroyElement() {
               this.$el.removeEventListener('transitionend', this.destroyElement);
               this.$destroy(true);
               this.$el.parentNode.removeChild(this.$el);
             },
             close() {
               this.closed = true;
               if (typeof this.onClose === 'function') {
                 this.onClose(this);
               }
             },
             clearTimer() {
               clearTimeout(this.timer);
             },
             startTimer() {
               if (this.duration > 0) {
                 this.timer = setTimeout(() => {
                   if (!this.closed) {
                     this.close();
                   }
                 }, this.duration);
               }
             },
             keydown(e) {
               if (e.keyCode === 27) { // esc关闭消息
                 if (!this.closed) {
                   this.close();
                 }
               }
             }
         },
         mounted() {
              this.startTimer();
              document.addEventListener('keydown', this.keydown);
         },
         beforeDestroy() {
              document.removeEventListener('keydown', this.keydown);
         }
    });

    let MessageConstructor = Vue.extend(Message);
    let instance;
    let instances = [];
    let seed = 1;
    let zIndex = 199307100337;
    const MyMessage = function(options) {
        if (Vue.prototype.$isServer) return;
        options = options || {};
        if (typeof options === 'string') {
          options = {
            message: options
          };
        }
        let userOnClose = options.onClose;
        let id = 'message_' + seed++;

        options.onClose = function() {
          MyMessage.close(id, userOnClose);
        };
        instance = new MessageConstructor({
          data: options
        });
        instance.id = id;
        instance.vm = instance.$mount();
        document.body.appendChild(instance.vm.$el);
        instance.vm.visible = true;
        instance.dom = instance.vm.$el;
        instance.dom.style.zIndex = ++zIndex;
        instances.push(instance);
        return instance.vm;
    };

    ['success', 'warning', 'info', 'error'].forEach(type => {
        MyMessage[type] = options => {
          if (typeof options === 'string') {
            options = {
              message: options
            };
          }
          options.type = type;
          return MyMessage(options);
        };
    });

    MyMessage.close = function(id, userOnClose) {
      for (let i = 0, len = instances.length; i < len; i++) {
        if (id === instances[i].id) {
          if (typeof userOnClose === 'function') {
            userOnClose(instances[i]);
          }
          instances.splice(i, 1);
          break;
        }
      }
    };

    MyMessage.closeAll = function() {
      for (let i = instances.length - 1; i >= 0; i--) {
        instances[i].close();
      }
    };

    window.Message = MyMessage;
    Vue.prototype.Message = MyMessage;

})(window, Vue);