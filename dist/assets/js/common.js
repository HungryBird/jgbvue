/**
 * 对象深拷贝
 * @param {*} obj 
 * created by lanw 2018-4-2
 */
let deepCopy = function(obj) {
  if(typeof obj != 'object'){
    return obj;
  }
  let _obj = {}
  for(key in obj) {
    _obj[key] = deepCopy(obj[key])
  }
  return _obj
}
Vue.prototype.$deepCopy = deepCopy


/**
 * 组件-表单footer 保存、关闭按钮 带loading阻止重复提交
 * created by lanw 2018-4-4
 */
let formFooter = Vue.extend({
  template: `<div>
              <el-button type="primary" 
                :loading="loading"
                :disable="loading"
                v-on:click="btnSave">
                保存
              </el-button>
              <el-button v-on:click="btnClose">关闭</el-button>
             </div>`,
  props: {
    loading: {//按钮加载状态 不可用状态
      type: Boolean,
      default: false
    },
  },
  methods: {
    btnSave: function () {
      this.$emit('save', true)
    },
    btnClose: function () {
      this.$emit('close', true)
    },
  },
})
Vue.component('jgb-form-footer', formFooter)