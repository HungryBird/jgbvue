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
 * 时间戳转换
 * created by lanw 2018-4-10
 * @param {Number} stamp
 */
let timeStampFormat = function(stamp) {
  let date = new Date(stamp*1000)
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}
Vue.prototype.$timeStampFormat = timeStampFormat

/**
 * 手动触发打开选项卡
 * created by lanw 2018-4-12
 * @param {string} tabId 选项卡ID
 * @param {string} tabName 选项卡名称
 * @param {string} parentFolder 父级目录
 */
let selectTab = function(tabId, tabName, parentFolder) {
  window.top.JGBVue.module.vParent.selectTab(tabId, tabName, parentFolder)
}
Vue.prototype.$selectTab = selectTab

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

/**
 * 组件 设置成员
 * created by lanw 2018-4-8
 * @param {Array} value 绑定选中的用户数组
 * @param {Array, Object} companyList 规则-Array:公司列表 规则-Object {label, value}:公司名,公司编号
 * @param {Array} departmentList 部门数据
 * @param {Array} userList 用户数据
 * @param {Array} checkedList 选中人员数据
 * @param {Object} companyProps 公司传入对象的key属性 e.g. { label: "label", value: "number"}
 * @param {Object} departmentProps 部门 传入对象的key属性 e.g. { label: "label", value: "value"}
 * @param {Object} userProps 用户、选中人员 同上 {userName: "name", userId: "uid", userPic: "src", departmentName: "department", companyName: "companyName"}
 * 
 * @return {Array} 绑定选中的用户数组
 * 
 * @event company-change
 * @event department-change
 * @event search 
 */
let setMember = Vue.extend({
  template: `<el-container class="set-member-wrap">
              <el-header class="set-member-header">
                <div v-if="!companyList.length" class="set-member-company single">
                  {{companyName}}
                </div>
                <el-select v-else class="set-member-company"
                  placeholder="请选择公司" v-model="companyId">
                  <el-option
                    v-for="item in companyList"
                    :key="item[companyProps.value]"
                    :label="item[companyProps.label]"
                    :value="item[companyProps.value]">
                  </el-option>
                </el-select>
                <el-input class="set-member-search" placeholder="请输入关键词" v-model="keyword">
                  <template slot="append">
                    <el-button v-on:click="search">搜索</el-button>
                  </template>
                </el-input>
                <el-button class="btn-check-list"
                  :class="showCheckedList && 'show'"
                  v-on:click="showCheckedList = !showCheckedList">
                  已选人员
                  <i :class="showCheckedList? 'el-icon-caret-right': 'el-icon-caret-left'"></i>
                </el-button>
              </el-header>
              <el-container v-if="companyId && departmentList.length">
                <el-aside class="set-member-aside">
                  <ul class="ul-list">
                    <li v-for="(item, index) in departmentList"
                      :class="departmentId == item[departmentProps.value] ? 'active' : ''"
                      v-on:click="departmentId = item[departmentProps.value]">
                      {{item[departmentProps.label]}}
                    </li>
                  </ul>
                </el-aside>
                <el-main>
                  <div class="w-member-list" v-if="userList.length">
                    <div v-for="(member, index) in userList" class="member-item"
                      :class="member.checked ? 'checked': ''"
                      v-on:click="toggleMemberChecked(member, index)">
                      <img class="member-pic" :src="member[userProps.userPic]" :alt="member[userProps.userName]"/>
                      <div class="member-info">
                        <div class="info-item">工号：{{member[userProps.userId]}}</div>
                        <div class="info-item">姓名：{{member[userProps.userName]}}</div>
                        <div class="info-item">部门：{{member[userProps.departmentName]}}</div>
                      </div>
                      <i v-if="member.checked" class="el-icon-check checked-tag"></i>
                    </div>
                  </div>
                  <transition name="slide-from-right">
                    <ul v-show="showCheckedList" class="w-checked-list">
                      <li v-for="(item, index) in checkedList" class="checked-item">
                        <span>{{item[userProps.companyName]}}</span>
                        <span>{{item[userProps.departmentName]}}【{{item[userProps.userName]}}】</span>
                        <i class="el-icon-circle-close checked-close"
                          v-on:click="removeChecked(item, index)">
                        </i>
                      </li>
                    </ul>
                  </transition>
                </el-main>
              </el-container>
            </el-container>`,
  props: {
    value: Array,
    companyList: [Array, Object],
    departmentList: Array,
    userList: Array,
    // checkedList: Array,
    companyProps: Object,
    departmentProps: Object,
    userProps: Object,
  },
  computed: {
    /**
     * @returns {Boolean} false:this.company=公司列表 true: this.company=公司信息 {label, uid}
     */
    isCompany: function() {
      return typeof this.company == 'object' ? true : false
    },
  },
  data: function() {
    return {
      companyName: '', //公司名称 *选中id时 没写获取name
      companyId: '', //公司id
      departmentId: '', //部门id
      departmentName: '', //部门名称 *选中id时 没写获取name
      checkedList: [], //选中列表
      keyword: '', //搜索关键字

      showCheckedList: false, //是否显示选中成员
    }
  },
  methods: {
    //遍历选中人员数据 设置当前展示人员的选中状态
    setUserListChecked: function() {
      let checked = []
      //提取选中人员的userId
      this.checkedList.forEach(user=> {
        checked.push(user[this.userProps.userId])
      })
      //遍历当前人员列表 设置选中/未选中状态
      this.userList.forEach(user=> {
        let uid = user[this.userProps.userId]
        user.checked = checked.indexOf(uid) == -1 ? false : true
      })
    },
    //切换成员选中状态并更新选中列表
    toggleMemberChecked: function(member, index) {
      this.userList[index].checked = !member.checked
      let checked = []
      //提取选中人员的userId
      this.checkedList.length && this.checkedList.forEach(user => {
        checked.push(user[this.userProps.userId])
      })
      //更改该人员在列表中的选中状态
      if(checked.indexOf(member[this.userProps.userId]) == -1) {
        this.checkedList.push(member)
      }
      else {
        this.checkedList.splice(checked.indexOf(member[this.userProps.userId]), 1)
      }
    },
    //从选中人员中删除
    removeChecked: function(item, index) {
      this.checkedList.splice(index, 1);
      //检查展示中的成员列表userList是否存在该成员并更改checked状态
      this.userList.forEach(user=> {
        if(user[this.userProps.userId] == item[this.userProps.userId]) {
          user.checked = false
        }
      })
    },
    //搜索触发search
    search: function() {
      if(!this.companyId) {
        this.$message({
          type: 'error',
          message: '请选择公司'
        })
        return;
      }
      if (!this.keyword) {
        this.$message({
          type: 'error',
          message: '请输入搜索关键词'
        })
        return;
      }
      this.$emit('search', {
        companyId: this.companyId,
        companyName: this.companyName,
        departmentId: this.departmentId,
        departmentName: this.departmentName,
        keyword: this.keyword
      })
    },
  },
  watch: {
    //公司id改变触发company-change
    companyId: function() {
      this.$emit('company-change', {
        companyName: this.companyName,
        companyId: this.companyId
      })
    },
    //部门id改变触发department-change
    departmentId: function () {
      this.$emit('department-change', {
        companyId: this.companyId,
        companyName: this.companyName,
        departmentId: this.departmentId,
        departmentName: this.departmentName,
      })
    },
    //更新绑定数据
    checkedList: function() {
      this.$emit('input', this.checkedList)
    },
    //用户列表更改 重写checked状态
    userList: function() {
      this.setUserListChecked()
    },
  },
  created: function () {
    this.checkedList = this.value.concat()
    if (!this.companyList.length) {
      this.companyName = this.companyList[this.companyProps.label]
      this.companyId = this.companyList[this.companyProps.value]
    };
    this.setUserListChecked()
  },
})
Vue.component('jgb-set-member', setMember)

/**
 * 组件 详情页右侧滑动窗
 * created by lanw 2018-4-10
 * 1.配合transition name="slide-fade"
 * 2.详情页内容通过slot插入
 * @param {Boolean} loading 数据加载状态
 * @event close 关闭窗体事件
 */
let rightSlideDetails = Vue.extend({
  template: `<div class="details-wrap">
              <div class="details-inner" v-loading="loading">
                <slot></slot>
              </div>
              <div class="toggle-button-wrap" v-on:click="closeDetails">
                <span class="jgbvue_arrow_icon" style="background: transparent url(../../assets/img/common/ats-icon_5.png) no-repeat scroll -9px -85px;position: absolute;top: 50%;right: 0;transform: translateY(-50%);"></span>
                <span class="jgbvue_arrow_line" style="background: transparent url(../../assets/img/common/ats-icon_5.png) no-repeat scroll -123px -2px;margin-left: 16px;"></span>
              </div>
            </div>`,
  props: {
    loading: Boolean,
    title: String,
  },
  methods: {
    closeDetails: function() {
      this.$emit('close', true)
    },
  }
})
Vue.component('jgb-slide-details', rightSlideDetails)