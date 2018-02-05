// 获取当前js文件所在的路径
var getPath = function(){var jsPath = document.currentScript ? document.currentScript.src : function(){var js = document.scripts ,last = js.length - 1 ,src; for(var i = last; i > 0; i--){if(js[i].readyState === 'interactive'){src = js[i].src; break; } } return src || js[last].src; }(); return jsPath.substring(0, jsPath.lastIndexOf('/') + 1); }();
// 加载样式文件
var setStyle = function (cssname) {var head = document.getElementsByTagName('head')[0]; linkTag = document.createElement('link'); linkTag.href = getPath + cssname; linkTag.setAttribute('rel','stylesheet'); linkTag.setAttribute('type','text/css'); head.appendChild(linkTag); }

;(function (win, Vue) {
    'use strict';

    setStyle("Loader.css")

    var Loader = Vue.extend({
       template: `
           <div>
                
           </div>
       `,
       props: {
           data: {
             
           }
       },
       data: function () {
           return {
             
           }
       },
       methods: {
            
       },
       beforeMount: function () {
          this.resetData()
       }
   });
   
   Vue.component('loader', Loader);

})(window, Vue);