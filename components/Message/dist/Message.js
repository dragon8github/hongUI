'use strict';

;window.hongAPI = function () {

    var isLoadFinish = false;

    // seajs的解决方案
    var styleOnload = function styleOnload(node, callback) {
        if (node.attachEvent) {
            // for IE6-9 and Opera
            node.attachEvent('onload', callback);
        } else {
            setTimeout(function () {
                poll(node, callback);
            }, 0); // for cache
        }
    };

    // polling for Firefox, Chrome, Safari
    var poll = function poll(node, callback) {
        var isLoaded = false;
        if (/webkit/i.test(navigator.userAgent)) {
            // webkit
            if (node['sheet']) {
                isLoaded = true;
            }
        } else if (node['sheet']) {
            // for Firefox
            try {
                if (node['sheet'].cssRules) {
                    isLoaded = true;
                }
            } catch (ex) {
                if (ex.code === 1000) {
                    // NS_ERROR_DOM_SECURITY_ERR
                    isLoaded = true;
                }
            }
        }
        if (isLoaded) {
            setTimeout(function () {
                // give time to render.
                callback();
            }, 1);
        } else {
            setTimeout(function () {
                poll(node, callback);
            }, 1);
        }
    };

    // 获取当前js的路径
    var getPath = function () {
        var jsPath = document.currentScript ? document.currentScript.src : function () {
            var js = document.scripts,
                last = js.length - 1,
                src;
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
    var linkStyle = function linkStyle(v) {
        var head = document.getElementsByTagName('head')[0];
        var linkTag = document.createElement('link');
        linkTag.href = getPath + v;
        linkTag.setAttribute('rel', 'stylesheet');
        linkTag.setAttribute('type', 'text/css');
        head.appendChild(linkTag);
        return linkTag;
    };

    // 加载样式文件
    var setStyle = function setStyle(cssname) {
        var args = Object.prototype.toString.call(cssname) === '[object Array]' ? cssname : arguments;
        return Array.prototype.map.call(args, function (v) {
            return linkStyle(v);
        });
    };

    // 如果css加载完毕，那么执行回调
    var linksOnload = function linksOnload(links, cb) {
        if (!isLoadFinish) {
            (function (args) {
                var _arguments = arguments;
                var link = Array.prototype.shift.call(args);
                styleOnload(link, function () {
                    if (args.length === 0) {
                        if (typeof cb === 'function') {
                            isLoadFinish = true;
                            cb();
                        }
                    } else {
                        _arguments.callee(args);
                    }
                });
            })(Object.prototype.toString.call(links) === '[object Array]' ? links : arguments);

            var waitloadcss = function (args) {
                var link = Array.prototype.shift.call(args);
                styleOnload(link, function () {
                    if (args.length === 0) {
                        if (typeof cb === 'function') {
                            isLoadFinish = true;
                            cb();
                        }
                    } else {
                        waitloadcss.call(this, args);
                    }
                });
            }(Object.prototype.toString.call(links) === '[object Array]' ? links : arguments);
        } else {
            if (typeof cb === 'function') {
                cb();
            }
        }
    };

    return {
        setStyle: setStyle,
        linksOnload: linksOnload
    };
}();

;(function (win, Vue) {
    'use strict';

    var typeMap = { success: 'success', info: 'info', warning: 'warning', error: 'error' };
    var Message = Vue.extend({
        template: '\n          <transition name="hong-message-fade">\n              <div :class="[\n                      \'hong-message\',\n                      type && !iconClass ? \'hong-message--\' + type : \'\',\n                      center ? \'is-center\' : \'\',\n                      showClose ? \'is-closable\' : \'\',\n                      customClass\n                  ]"\n                  v-show="visible"\n                  @mouseenter="clearTimer"\n                  @mouseleave="startTimer"\n                  role="alert"\n              >\n                <i :class="iconClass" v-if="iconClass"></i>\n                <i :class="typeClass" v-else></i>\n                <slot>\n                    <p v-if="!dangerouslyUseHTMLString" class="hong-message__content">{{ message }}</p>\n                    <p v-else v-html="message" class="hong-message__content"></p>\n                </slot>\n                <i v-if="showClose" class="hong-message__closeBtn hong-icon-close" @click="close"></i>\n              </div>\n            </transition>\n        ',
        data: function data() {
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
            iconWrapClass: function iconWrapClass() {
                var classes = ['hong-message__icon'];
                if (this.type && !this.iconClass) {
                    classes.push('hong-message__icon--' + this.type);
                }
                return classes;
            },
            typeClass: function typeClass() {
                return this.type && !this.iconClass ? 'hong-message__icon hong-icon-' + typeMap[this.type] : '';
            }
        },
        watch: {
            closed: function closed(newVal) {
                if (newVal) {
                    this.visible = false;
                    this.$el.addEventListener('transitionend', this.destroyElement);
                }
            }
        },
        methods: {
            // get~ 销毁组件
            destroyElement: function destroyElement() {
                this.$el.removeEventListener('transitionend', this.destroyElement);
                this.$destroy(true);
                this.$el.parentNode.removeChild(this.$el);
            },
            close: function close() {
                this.closed = true;
                if (typeof this.onClose === 'function') {
                    this.onClose(this);
                }
            },
            clearTimer: function clearTimer() {
                clearTimeout(this.timer);
            },
            startTimer: function startTimer() {
                var _this = this;

                if (this.duration > 0) {
                    this.timer = setTimeout(function () {
                        if (!_this.closed) {
                            _this.close();
                        }
                    }, this.duration);
                }
            },
            keydown: function keydown(e) {
                // esc关闭消息
                if (e.keyCode === 27) {
                    if (!this.closed) {
                        this.close();
                    }
                }
            }
        },
        mounted: function mounted() {
            this.startTimer();
            document.addEventListener('keydown', this.keydown);
        },
        beforeDestroy: function beforeDestroy() {
            document.removeEventListener('keydown', this.keydown);
        }
    });

    var MessageConstructor = Vue.extend(Message);
    var instance;
    var instances = [];
    var seed = 1;
    var zIndex = 199307100337;
    var links = hongAPI.setStyle("icon.css", "Message.css");

    // TODO:外部如何获取实例？
    // 知识点
    // 插入页面的$el dom 示例也会被引用关联。也就是说，哪怕插入了。我修改了$el。那么dom也会受到影响。
    // 虽然我知道。但还是很少用觉得很神奇。
    // 问题: 为何插入网页会造成这样？
    var MyMessage = function MyMessage(options) {
        options = options || {};
        if (typeof options === 'string') {
            options = { message: options };
        }
        var userOnClose = options.onClose;
        var id = 'message_' + seed++;
        options.onClose = function () {
            MyMessage.close(id, userOnClose);
        };
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
            console.log(1);
            instance.vm.visible = true;
        });
        return instance.vm;
    };

    // 学到新知识，可以靠这种方式，快速开发出类似如下语句：
    // this.Message.error('错了哦，这是一条错误消息');
    // this.Message.info('警告哦，这是一条警告消息');
    ['success', 'warning', 'info', 'error'].forEach(function (type) {
        MyMessage[type] = function (options) {
            if (typeof options === 'string') {
                options = {
                    message: options
                };
            }
            options.type = type;
            return MyMessage(options);
        };
    });

    MyMessage.close = function (id, cb) {
        hongAPI.linksOnload(links, function () {
            for (var i = 0, len = instances.length; i < len; i++) {
                if (id === instances[i].id) {
                    console.log(2);
                    instances[i].closed = true;
                    if (typeof cb === 'function') {
                        cb(instances[i]);
                    }
                    instances.splice(i, 1);
                    break;
                }
            }
        });
    };

    MyMessage.closeAll = function () {
        for (var i = instances.length - 1; i >= 0; i--) {
            instances[i].close();
        }
    };

    window.Message = MyMessage;
    Vue.prototype.Message = MyMessage;
})(window, Vue);
//# sourceMappingURL=Message.js.map
