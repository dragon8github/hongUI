// 获取当前js文件所在的路径
var getPath = function(){var jsPath = document.currentScript ? document.currentScript.src : function(){var js = document.scripts ,last = js.length - 1 ,src; for(var i = last; i > 0; i--){if(js[i].readyState === 'interactive'){src = js[i].src; break; } } return src || js[last].src; }(); return jsPath.substring(0, jsPath.lastIndexOf('/') + 1); }();
// 加载样式文件
var setStyle = function (cssname) {var head = document.getElementsByTagName('head')[0]; linkTag = document.createElement('link'); linkTag.href = getPath + cssname; linkTag.setAttribute('rel','stylesheet'); linkTag.setAttribute('type','text/css'); head.appendChild(linkTag); }

;(function (win, Vue) {
    'use strict';

    setStyle("Loader.css")

    var Spinner = Vue.extend({
        template: `
          <div class="hong-spinner-snake" :style="{
                'border-top-color': spinnerColor,
                'border-left-color': spinnerColor,
                'border-bottom-color': spinnerColor,
                'height': spinnerSize,
                'width': spinnerSize
          }">
          </div>
        `,
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
          spinnerColor() {
            return this.color || this.$parent.color || '#ccc';
          },
          spinnerSize() {
            return (this.size || this.$parent.size || 28) + 'px'; 
          },
          spinnerBoderWidth () {
            return (this.borderWidth || this.$parent.borderWidth || 4) + 'px' 
          }
        }
    })

    var Loader = Vue.extend({
       template: `
           <transition name="hong-loader">
               <div class="hong-loader" v-show="visible">
                 <div class="hong-loader-wrapper">
                   <spinner :show="true"></spinner>
                   <span class="hong-loader-text" v-show="text">{{ text }}</span>
                 </div>
                 <div class="hong-loader-mask" @touchmove.stop.prevent></div>
               </div>
           </transition>
       `,
       data: function () {
           return {
               visible: false,
               text: ''
           }
       },
       components: {
         Spinner
       }
   });

   var myLoader = {};
   var instance;
   var idlader_arr = [];
   myLoader.show = function(options = {}, id = '') {
      // 我自己添加的模式，如果存在id，那么也需要id才可以关闭
      if (id) {
          // 新建一个属于自己的Loader
          let myinstance;

          // 从缓存中遍历看看有没有和id一样的Loader，如果有的话直接从缓存取即可
          for (let [index,ele] of idlader_arr.entries()) {
              if (Object.keys(ele)[0] + '' == id) {
                  myinstance = Object.values(ele)[0]
                  break;
              }
          }

          // 如果缓存没有则新建一个
          myinstance = myinstance || new Loader({ el: document.createElement('div') });

          // 加入到缓存中
          idlader_arr.push( { [id]: myinstance})

          // 设置文本
          myinstance.text = typeof options === 'string' ? options : options.text || '';
          
          // 设置形状，默认为snake（其实已经写死为snake了）
          myinstance.spinnerType = options.spinnerType || 'snake';

          // 插入body中
          document.body.appendChild(myinstance.$el);

          // 等待加载完成就显示出来
          Vue.nextTick(() => {
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
        Vue.nextTick(() => {
            instance.visible = true;
        });
      }
   };

   myLoader.hide = function(id = '') {
      // 自己添加的逻辑
      if (id && idlader_arr.length) {
        // 新建一个属于自己的Loader
        let myinstance

        // 从缓存中遍历看看有没有和id一样的Loader
        for (let [index,ele] of idlader_arr.entries()) {
            if (Object.keys(ele)[0] + '' == id) {
                myinstance = Object.values(ele)[0];
                break;
            }
        }
        // 如果缓存列表中存在该id，则隐藏指定的Loader
        if (myinstance) myinstance.visible = false

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

       for (let [index,ele] of idlader_arr.entries()) {
           Object.values(ele)[0].visible = false
       }
   };

   Vue.prototype.Loader = myLoader;
   window.Loader = myLoader;

})(window, Vue);