d<template>
  <transition name="el-alert-fade">
     <div
       class="el-alert"
       :class="[typeClass, center ? 'is-center' : '']"
       v-show="visible"
       role="alert"
     >
       <i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
       <div class="el-alert__content">
         <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title">{{ title }}</span>
         <slot>
           <p class="el-alert__description" v-if="description">{{ description }}</p>
         </slot>
         <i class="el-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
       </div>
     </div>
   </transition>
</template>

<script>
const TYPE_CLASSES_MAP = {
   'success': 'el-icon-success',
   'warning': 'el-icon-warning',
   'error': 'el-icon-error'
 };
 export default {
   name: 'ElAlert',
   props: {
     title: {
       type: String,
       default: '',
       required: true
     },
     description: {
       type: String,
       default: ''
     },
     type: {
       type: String,
       default: 'info'
     },
     closable: {
       type: Boolean,
       default: true
     },
     closeText: {
       type: String,
       default: ''
     },
     showIcon: Boolean,
     center: Boolean
   },
   data() {
     return {
       visible: true
     };
   },
   methods: {
     close() {
       this.visible = false;
       this.$emit('close');
     }
   },
   computed: {
     typeClass() {
       return `el-alert--${ this.type }`;
     },
     iconClass() {
       return TYPE_CLASSES_MAP[this.type] || 'el-icon-info';
     },
     isBigIcon() {
       return this.description || this.$slots.default ? 'is-big' : '';
     },
     isBoldTitle() {
       return this.description || this.$slots.default ? 'is-bold' : '';
     }
   }
 };
</script>

<style lang="scss" scoped>
@import '~@scss/icon.scss';
@import '~@scss/mixin.scss';

.el-alert {
    width: 100%;
    padding: 8px 16px;
    margin: 0;
    box-sizing: border-box;
    border-radius: 4px;
    position: relative;
    background-color: #fff;
    overflow: hidden;
    opacity: 1;
    display: flex;
    align-items: center;
    transition: opacity .2s
}

.el-alert.is-center {
    justify-content: center
}

.el-alert--success {
    background-color: #f0f9eb;
    color: #67c23a
}

.el-alert--success .el-alert__description {
    color: #67c23a
}

.el-alert--info {
    background-color: #f4f4f5;
    color: #909399
}

.el-alert--info .el-alert__description {
    color: #909399
}

.el-alert--warning {
    background-color: #fdf6ec;
    color: #e6a23c
}

.el-alert--warning .el-alert__description {
    color: #e6a23c
}

.el-alert--error {
    background-color: #fef0f0;
    color: #f56c6c
}

.el-alert--error .el-alert__description {
    color: #f56c6c
}

.el-alert__content {
    display: table-cell;
    padding: 0 8px
}

.el-alert__icon {
    font-size: 16px;
    width: 16px
}

.el-alert__icon.is-big {
    font-size: 28px;
    width: 28px
}

.el-alert__title {
    font-size: 13px;
    line-height: 18px
}

.el-alert__title.is-bold {
    font-weight: 700
}

.el-alert .el-alert__description {
    font-size: 12px;
    margin: 5px 0 0
}

.el-alert__closebtn {
    font-size: 12px;
    color: #c0c4cc;
    opacity: 1;
    position: absolute;
    top: 12px;
    right: 15px;
    cursor: pointer
}

.el-alert__closebtn.is-customed {
    font-style: normal;
    font-size: 13px;
    top: 9px
}

.el-alert-fade-enter,
.el-alert-fade-leave-active {
    opacity: 0
}
</style>