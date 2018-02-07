;window.hongAPI = (function () {

   var isLoadFinish = false;

   // seajs的解决方案
   var styleOnload = function (node, callback) {
       if (node.attachEvent) {  // for IE6-9 and Opera
           node.attachEvent('onload', callback);
       } else { 
           setTimeout(function() {
               poll(node, callback);
           }, 0); // for cache
       }
   };

   // polling for Firefox, Chrome, Safari
   var poll = function (node, callback) {
               var isLoaded = false;
               if (/webkit/i.test(navigator.userAgent)) { // webkit
                   if (node['sheet']) {
                       isLoaded = true;
                   }
               } else if (node['sheet']) {  // for Firefox
                   try {
                       if (node['sheet'].cssRules) {
                           isLoaded = true;
                       }
                   } catch (ex) {
                       if (ex.code === 1000) { // NS_ERROR_DOM_SECURITY_ERR
                           isLoaded = true;
                       }
                   }
               }
               if (isLoaded) {
                   setTimeout(function() {  // give time to render.
                       callback();
                   }, 1); 
               } else {
                   setTimeout(function() {
                       poll(node, callback);
                   }, 1);
               }
   };

   // 获取当前js的路径
   var getPath = function() {
       var jsPath = document.currentScript ? document.currentScript.src : function() {
           var js = document.scripts, last = js.length - 1, src;
           for (var i = last; i > 0; i--) { 
                if (js[i].readyState === 'interactive') { 
                    src = js[i].src; 
                    break; 
                } 
            }
           return src || js[last].src;
       }();
       return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
   }();

   // 插入css
   var linkStyle = function(v) {
       var head = document.getElementsByTagName('head')[0];
       linkTag = document.createElement('link');
       linkTag.href = getPath + v;
       linkTag.setAttribute('rel', 'stylesheet');
       linkTag.setAttribute('type', 'text/css');
       head.appendChild(linkTag);
       return linkTag;
   };

   // 加载样式文件
   var setStyle = function(cssname) {
      var args = Object.prototype.toString.call(cssname) === '[object Array]' ? cssname : arguments;
      return Array.prototype.map.call(args, function (v) {
         return linkStyle(v)
      })
   };

   // 如果css加载完毕，那么执行回调
   var linksOnload = function (links, cb) {
       if (!isLoadFinish) {
           (function (args) {
               var _arguments = arguments;
               var link = Array.prototype.shift.call( args );
               styleOnload(link, function () {
                   if (args.length === 0) {
                       if (typeof(cb) === 'function') {
                           isLoadFinish = true;
                           cb();
                       }
                   } else {
                       _arguments.callee(args)
                   }
               })
           })(Object.prototype.toString.call(links) === '[object Array]' ? links : arguments);
       } else {
            if (typeof(cb) === 'function') {
                cb();
            }
       }
   };

   return {
        setStyle: setStyle,
        linksOnload: linksOnload
   }
})();

;(function (win, Vue) {
    'use strict';

    const typeMap = {success: 'success', info: 'info', warning: 'warning', error: 'error'};
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
             // get~ 销毁组件
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
                // esc关闭消息
               if (e.keyCode === 27) {
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

    var MessageConstructor = Vue.extend(Message);
    var instance;
    var instances = [];
    var seed = 1;
    var zIndex = 199307100337;
    var LazyExecList = [];
    var links = hongAPI.setStyle("icon.css", "Message.css");

    // TODO:外部如何获取实例？
    // 知识点
    // 插入页面的$el dom 示例也会被引用关联。也就是说，哪怕插入了。我修改了$el。那么dom也会受到影响。
    // 虽然我知道。但还是很少用觉得很神奇。
    // 问题: 为何插入网页会造成这样？
    const MyMessage = function (options) {
        options = options || {};
        if (typeof options === 'string') { options = {message: options }; }
        var userOnClose = options.onClose;
        var id = 'message_' + seed++;
        options.onClose = function() { MyMessage.close(id, userOnClose); };
        instance = new MessageConstructor({ data: options });
        instance.id = id;
        // 知识点，手动挂载$mount()
        // 如果没有挂载的话，没有关联的 DOM 元素。是获取不到$el的。
        instance.vm = instance.$mount();
        instance.dom = instance.vm.$el;  
        instance.dom.style.zIndex = zIndex++;
        // 知识点：向网页插入元素并不会触发<transition name="hong-message-fade">
        // 官方说只有v-if和v-show才会触发。那就是说，真正的触发时机是instance.vm.visible = true;的时候
        // 我之所以会认为插入页面也会触发，是因为被路由误导了吧。事实上transition对路由也是特殊处理的
        // 总结一下，一共三个东西会触发transition， v-if、v-show、还有路由<router-view></router-view>
        document.body.appendChild(instance.vm.$el);
        instances.push(instance);
        hongAPI.linksOnload(links, function () {
            instance.vm.visible = true;
        })
        return instance.vm;
    };

    // 学到新知识，可以靠这种方式，快速开发出类似如下语句：
    // this.Message.error('错了哦，这是一条错误消息');
    // this.Message.info('警告哦，这是一条警告消息');
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

    MyMessage.close = function(id, cb) {
      for (var i = 0, len = instances.length; i < len; i++) {
        if (id === instances[i].id) {
          if (typeof cb === 'function') {
            cb(instances[i]);
          }
          instances.splice(i, 1);
          break;
        }
      }
    };

    MyMessage.closeAll = function() {
      for (var i = instances.length - 1; i >= 0; i--) {
        instances[i].close();
      }
    };

    window.Message = MyMessage;
    Vue.prototype.Message = MyMessage;

})(window, Vue);