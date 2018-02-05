// 获取当前js文件所在的路径
var getPath = function(){
  var jsPath = document.currentScript ? document.currentScript.src : function(){
    var js = document.scripts
    ,last = js.length - 1
    ,src;
    for(var i = last; i > 0; i--){
      if(js[i].readyState === 'interactive'){
        src = js[i].src;
        break;
      }
    }
    return src || js[last].src;
  }();
  return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
}();

// 加载样式文件
var setStyle = function (cssname) {
    var head = document.getElementsByTagName('head')[0];
    linkTag = document.createElement('link');
    linkTag.href = getPath + cssname;
    linkTag.setAttribute('rel','stylesheet');
    linkTag.setAttribute('type','text/css');
    head.appendChild(linkTag);
}

;(function (win, Vue) {
    'use strict';

    setStyle("ProcessLine.css")

    var ProcessLineItem = Vue.extend({
        template: `
            <div class="ivu-steps-item" :class='getClass(status)' :style="{width: width + 'px'}">
                <div class="ivu-steps-tail"><i></i></div>
                <div class="ivu-steps-head">
                    <div class="ivu-steps-head-inner"><span>{{ index }}</span></div>
                </div>
                <div class="ivu-steps-main">
                    <div class="ivu-steps-title">{{ content || '&nbsp' }}</div>
                    <div class="ivu-steps-content">{{ title || '&nbsp' }}</div>
                </div>
            </div>
        `,
        props: {
            status: {
                type: String,
                default: 'wait'
            },
            title: {
                type: String,
                default: '职位名称'
            },
            content: {
                type: String,
                default: '这里是该步骤的描述信息'
            },
            index: {
                type: Number,
                default: 0
            },
            width: {
                type: Number,
                default: 190
            }
        },
        methods: {
            getClass: function (status) {
                switch (status) {
                    case 'finish':
                      return 'ivu-steps-status-finish';
                    case 'process':
                      return 'ivu-steps-status-process';
                    case 'wait':
                      return 'ivu-steps-status-wait';
                    default:
                      return 'ivu-steps-status-wait';
                }
            }
        }
    })
    var ProcessLine = Vue.extend({
       template: `
           <div class="ivu-steps-warp" v-show='data.length > 0'>
                   <div class="ivu-steps ivu-steps-horizontal">
                       <div class='cd-timeline-navigation'>
                           <a href="javascript:;" @click='prev' class="prev cd-timeline-navigation" :class="{inactive: currentPage == 1}">Prev</a>
                           <a href="javascript:;" @click='next' class="next cd-timeline-navigation" :class="{inactive: currentPage == this.PageCount}">Next</a>
                       </div>
                       <div class="events-warp">
                           <div class="events" :style="{ width: this.data.length * width + 'px', transform: 'translateX(' + X + 'px)' }">
                                <processlineitem v-for='(d, i) in data'
                                                 :width='width'
                                                 :status='d.status' 
                                                 :title='d.title' 
                                                 :content='d.content' 
                                                 :index='i + 1'>
                                </processlineitem>
                           </div>
                       </div>
                   </div>
               </div>
       `,
       props: {
           data: {
               type: Array,
               default: []
           }
       },
       data: function () {
           return {
              currentPage: 1,
              X: 0,
              PageCount: 1,
              count: 5,
              width: 190
           }
       },
       components: {
          'processlineitem': ProcessLineItem
       },
       methods: {
            prev: function () {
                if (this.currentPage > 1) {
                    this.currentPage--;
                }
            },
            next: function () {
                // 必须大于this.count个 并且 不是最后一页
                if (this.data.length > this.count && this.currentPage < this.PageCount) {
                  this.currentPage++;
                }
            },
            resetData: function () {
              // 设置总页数
              this.PageCount = parseInt(this.data.length % this.count === 0 ? this.data.length / this.count : this.data.length / this.count + 1)

              // 设置状态
              // inActive左边的都是'finish'，右边的全是'wait'。而自己是'process'
              for (var i = 0, status = 'finish'; i < this.data.length; i++) {
                  if (this.data[i].inActive) {
                    this.data[i].status = 'process'
                    status = 'wait'
                    // 如果"当前"状态是在第二页以上的，也需要翻过去才对。
                    var index = i + 1;
                    this.currentPage = parseInt(index % this.count === 0 ? index / this.count : index / this.count + 1)
                  } else {
                    this.data[i].status = status
                  }
              }
            }
       },
       watch: {
          currentPage: function(newVal, oldVal) { 
              // 下一页 
              if (newVal > oldVal) {
                  this.X = this.X - this.count * this.width * (newVal - oldVal)
              } else {
              // 上一页
                  this.X = this.X + this.count * this.width * (oldVal - newVal)
              }
          },
          // 监听属性：data
          data: function (newVal, oldVal) {
              this.resetData()
          }
       },
       beforeMount: function () {
          this.resetData()
       }
   });
   
   Vue.component('processline', ProcessLine);

})(window, Vue);