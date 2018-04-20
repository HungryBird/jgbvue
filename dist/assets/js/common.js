/**
 * 对象深拷贝
 * @param {*} obj
 * created by lanw 2018-4-2
 */
let deepCopy = function(obj) {
  if(typeof obj != 'object'){
    return obj;
  }
  //edit by lanw 2018-4-15 修复深拷贝数组会转换成对象的bug start---
  if(obj.length) { //数组
    let _obj = []
    for(let i = 0; i < obj.length; i++) {
      _obj.push(deepCopy(obj[i]))
    }
    return _obj
  }
  else { //对象
    let _obj = {}
    for(key in obj) { 
      // console.log(`obj: ${obj}, obj type: ${typeof obj}, length: ${obj.length}`)
      _obj[key] = deepCopy(obj[key])
    }
    return _obj
  };
  //edit by lanw 2018-4-15 修复深拷贝数组会转换成对象的bug end---
}
Vue.prototype.$deepCopy = deepCopy

/**
 * 时间戳转换
 * created by lanw 2018-4-10
 * @param {Number} stamp
 */
let timeStampFormat = function(stamp, format) {
  format = format || 'yyyy-mm-dd'
  let date = new Date(stamp*1000)
  let str = ''
  switch(format) {
    case 'yyyy-mm-dd hh:mm:ss':
      str = `${date.getFullYear()}-${date.getMonth() > 8 ? date.getMonth()+1: '0'+(date.getMonth()+1)}-${date.getDate() > 9 ? date.getDate(): '0'+date.getDate()} ${date.getHours()> 9 ? date.getHours(): '0'+date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0'+date.getMinutes()}:${date.getSeconds() > 9 ? date.getSeconds() : '0'+date.getSeconds()}`
      break
    case 'yyyy-mm-dd hh:mm':
      str = `${date.getFullYear()}-${date.getMonth() > 8 ? date.getMonth()+1: '0'+(date.getMonth()+1)}-${date.getDate() > 9 ? date.getDate(): '0'+date.getDate()} ${date.getHours()> 9 ? date.getHours(): '0'+date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0'+date.getMinutes()}`
      break
    case 'yyyy-mm-dd':
    default: 
      str = `${date.getFullYear()}-${date.getMonth() > 8 ? date.getMonth()+1: '0'+(date.getMonth()+1)}-${date.getDate() > 9 ? date.getDate(): '0'+date.getDate()}`
      break
  }
  return str
}
Vue.prototype.$timeStampFormat = timeStampFormat

/**
 *  数字保留两位小数
 *  created by 何俊洁 2018-4-20
 *  @param {Number, string} value
 */

let doubleDecimals = (value)=> {
  if(isNaN(value)) return;
  let val = Math.round(parseFloat(value)*100)/100;
  let xsd = val.toString().split(".");
  if(xsd.length == 1){
  val = val.toString() + ".00";
    return val;
  }
  if(xsd.length > 1){
    if(xsd[1].length < 2){
      val = val.toString() + "0";
    }
    return val;
  }
}
Vue.prototype.$doubleDecimals = doubleDecimals;

/**
 * 获取location.search
 * created by lanw 2018-4-17
 * search format ?key1=val1&&key2=val2
 * val将经过decodeURI解码
 * @param {String} search
 * @return {Object} {key, value}
 */
let getQueryFromLocation = function(search) {
  let str = search.split('?')[1] || ''
  let arr = str ? str.split('&&') : []
  let query = {}
  arr.forEach(item=> {
    query[item.split('=')[0]] = decodeURI(item.split('=')[1])
  })
  return query
}
Vue.prototype.$getQuery = getQueryFromLocation

/**
 * 手动触发打开选项卡
 * created by lanw 2018-4-12
 * edit by lanw 2018-4-18 重构功能菜单 第三个参数改为页面url
 * @param {string} tabId 选项卡ID
 * @param {string} tabName 选项卡名称
 * @param {string} tabUrl 选项卡url
 */
let selectTab = function(tabId, tabName, tabUrl) {
  /*edit by 何俊洁 2018-04-15*/
  //window.top.JGBVue.module.vParent.selectTab(tabId, tabName, parentFolder)
  //edit by 何俊洁  2018-4-14
  // indexFn.vm.selectTab(tabId, tabName, parentFolder);
  //edit by lanw 2018-4-15
  arguments[3] 
    ? window.top.indexFn.vm.selectTab(tabId, tabName, tabUrl, arguments[3])
    : window.top.indexFn.vm.selectTab(tabId, tabName, tabUrl)
}
Vue.prototype.$selectTab = selectTab

/**
 * 组件-表单footer 保存、关闭按钮 带loading阻止重复提交
 * created by lanw 2018-4-4
 * @param {Boolean} loading 按钮加载、 启用状态
 * @param {String} saveText 保存按钮文本
 * @param {String} closeText 关闭按钮文本
 */
let formFooter = Vue.extend({
  template: `<div>
              <el-button type="primary"
                :loading="loading"
                :disable="loading"
                v-on:click="btnSave">
                {{saveText}}
              </el-button>
              <el-button v-on:click="btnClose">{{closeText}}</el-button>
             </div>`,
  props: {
    loading: {//按钮加载状态 不可用状态
      type: Boolean,
      default: false
    },
    saveText: {
      type: String,
      default: '保存'
    },
    closeText: {
      type: String,
      default: '关闭'
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
 * 
 * edit by lanw 2018-4-16
 * 修改内容：dom .member-item 中加入el-tooltip 通过判断工号、部门、姓名的长度决定是否启用鼠标悬停提示完整信息
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
                      <el-tooltip class="item" effect="light" placement="bottom"
                        :disabled="String(member[userProps.userId]).length < 7"
                        :content="'工号：'+member[userProps.userId]" >	
                        <div class="info-item">工号：{{member[userProps.userId]}}</div>
                      </el-tooltip>
                      <el-tooltip class="item" effect="light" placement="bottom"
                        :disabled="member[userProps.userName].length < 4"
                        :content="'姓名：'+member[userProps.userName]" >	
                        <div class="info-item">姓名：{{member[userProps.userName]}}</div>
                      </el-tooltip>
                      <el-tooltip class="item" effect="light" placement="bottom"
                        :disabled="member[userProps.departmentName].length < 4"
                        :content="'部门：'+member[userProps.departmentName]" >	
                        <div class="info-item">部门：{{member[userProps.departmentName]}}</div>
                      </el-tooltip>
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
  template: `<div class="details-wrap" style="z-index:900;">
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

/**
 * 组件 图片缩略图
 * 图片自适应在正方形的预览窗内
 * created by lanw 2018-4-13
 * @param {String} src 图片地址
 * @param {String} alt 图片说明
 * 
 * @event img-click 点击图片时触发事件 返回当前图片地址
 */
let thumbnail = Vue.extend({
  template: `<div class="w-thumbnail-wrap" v-on:click="handle">
              <img :src="src" :alt="alt" :class="imgClass"/>
             </div>`,
  props: {
    src: String, 
    alt: String, 
  },
  data: function() {
    return {
      imgClass: 'cross',
    }
  },
  methods: {
    //点击组件触发事件
    handle: function() {
      this.$emit('img-click', this.src)
    },
    //获取图片宽高 适应容器
    setImageWidthHeight: function() {
      let img = new Image()
      img.src = this.src
      img.onload = ()=> {
        this.imgClass = img.width >= img.height ? 'cross' : 'vertical'
      }
    },
  },
  created:function() {
    this.setImageWidthHeight()
  },
})
Vue.component('jgb-thumbnail', thumbnail)

/**
 * 组件 列设置
 * 在组件内设置表头的展示
 * created by lanw 2018-4-16
 * @param {Array} value 绑定v-model
 * 
 * @event input 触发v-model双向绑定
 */
let columnSetting = Vue.extend({
  template: `<div class="w-column-setting">
              <el-table class="column-table" ref="columnTable"
                border highlight-current-row
                max-height="300"
                :data="columnList"
                row-key="prop"
                v-on:current-change="handleCurrentChange">
                <el-table-column align="center"
                  prop="label"
                  label="列名称">
                </el-table-column>
                <el-table-column align="center"
                  prop="label"
                  label="别名">
                </el-table-column>
                <el-table-column align="center"
                  prop="label"
                  label="是否显示">
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.enable">
                    </el-switch>
                  </template>
                </el-table-column>
              </el-table>
              <div class="action">
                <el-button size="mini" v-on:click="prev">前移</el-button>
                <el-button size="mini" v-on:click="next">后移</el-button>
              </div>
            </div>`,
  props: {
    value: Array,
  },
  computed: {
    columnList: function() {
      return this.value
    },
  },
  data: function() {
    return {
      selectedRow: '', //当前选中行
    }
  },
  methods: {
    //前移
    prev: function() {
      if(!this.selectedRow) return;
      let data = this.columnList.splice(this.selectedRow, 1)[0]
      this.columnList.splice(this.selectedRow-1, 0, data)
      this.selectedRow--
      //v-model改变没有触发视图刷新 暂时没想到好的方法
      this.columnList[this.selectedRow].enable = !this.columnList[this.selectedRow].enable
      this.$nextTick(function() {
        this.$refs.columnTable.setCurrentRow(data) //setCurrentRow生效的需要el-table设置row-key
        //v-model改变没有触发视图刷新 暂时没想到好的方法
        this.columnList[this.selectedRow].enable = !this.columnList[this.selectedRow].enable
      })
    },
    //后移
    next: function() {
      if(this.selectedRow == this.columnList.length-1) return;
      let data = this.columnList.splice(this.selectedRow, 1)[0]
      this.columnList.splice(this.selectedRow+1, 0, data)
      this.selectedRow++
      //v-model改变没有触发视图刷新 暂时没想到好的方法
      this.columnList[this.selectedRow].enable = !this.columnList[this.selectedRow].enable
      this.$nextTick(function() {
        this.$refs.columnTable.setCurrentRow(data) //setCurrentRow生效的需要el-table设置row-key
        //v-model改变没有触发视图刷新 暂时没想到好的方法
        this.columnList[this.selectedRow].enable = !this.columnList[this.selectedRow].enable
      })
    },
    /**
     * 点击行
     * @param {Object} currentRow 当前行数据
     * @param {Object} oldCurrentRow 旧行数据
     */
    handleCurrentChange: function(currentRow, oldCurrentRow) {
      // console.log(currentRow, oldCurrentRow)
      this.selectedRow = this.columnList.indexOf(currentRow)
    },
  },
  watch: {
    columnList: {
      handler: function() {
        this.$emit('input', this.columnList)
      },
      deep: true
    },
  }, 
})
Vue.component('jgb-column-setting', columnSetting)

/**
 * 组件 工单详情
 * created by lanw 2018-4-48
 * @param {Object} detailsData 工单详情
 * 
 * @event call-pictures 需要调用图片查看控件 data {Object| Array}: {图片数组, 序号| 图片数组}
 * @event call-download 调用下载 data {String} 下载地址
 */
let orderDetails = Vue.extend({
  template: `<div class="order-details">
              <div class="details-title">工单信息详情</div>
              <div class="details-container">
                <el-tabs v-model="detailsTabActive" type="border-card" v-on:tab-click="">
                  <el-tab-pane label="基本信息" name="baseInfo">
                    <table v-if="detailsData.base_info" class="details-table">
                      <tbody>
                        <tr>
                          <th>工单日期：</th>
                          <td>{{$timeStampFormat(detailsData.base_info.order_date)}}</td>
                          <th>工单编号：</th>
                          <td>{{detailsData.base_info.order_date}}</td>
                          <th>业务人员：</th>
                          <td>{{detailsData.base_info.business_name}}</td>
                        </tr>
                        <tr>
                          <th>客户名称：</th>
                          <td>{{detailsData.base_info.client_name}}</td>
                          <th>设备名称：</th>
                          <td>{{detailsData.base_info.equipment_name}}</td>
                          <th>设备类别：</th>
                          <td>{{detailsData.base_info.category}}</td>
                        </tr>
                        <tr>
                          <th>设备品牌：</th>
                          <td>{{detailsData.base_info.brand}}</td>
                          <th>设备来源：</th>
                          <td>{{detailsData.base_info.source}}</td>
                          <th>报修方式：</th>
                          <td>{{detailsData.base_info.repair_methods}}</td>
                        </tr>
                        <tr>
                          <th>紧急程度：</th>
                          <td>{{detailsData.base_info.level}}</td>
                          <th>委派维修：</th>
                          <td>{{detailsData.base_info.repair_entrust}}</td>
                          <th>委派人员：</th>
                          <td>{{detailsData.base_info.repair_peopel}}</td>
                        </tr>
                        <tr>
                          <th>设备图片：</th>
                          <td><i class="el-icon-picture table-img-icon" v-on:click="$emit('call-pictures', detailsData.base_info.image)"></i></td>
                          <th></th>
                          <td></td>
                          <th></th>
                          <td></td>
                        </tr>
                        <tr>
                          <th>问题描述：</th>
                          <td colspan="5" style="text-align:left;">{{detailsData.base_info.fault_info}}</td>
                        </tr>
                        <tr>
                          <th>备注：</th>
                          <td colspan="5" style="text-align:left;">{{detailsData.base_info.remark}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </el-tab-pane>
                  <el-tab-pane label="故障诊断" name="faultResult">
                    <table v-if="detailsData.diagnosis" class="details-table faultResult">
                      <tbody>
                        <tr>
                          <th>诊断时间：</th>
                          <td colspan="2" class="text-center">{{$timeStampFormat(detailsData.diagnosis.date)}}</td>
                          <th>诊断人员：</th>
                          <td colspan="2" class="text-center">{{detailsData.diagnosis.people}}</td>
                        </tr>
                        <tr>
                          <th>诊断结果：</th>
                          <td colspan="5">{{detailsData.diagnosis.result}}</td>
                        </tr>
                        <tr>
                          <th>维修措施：</th>
                          <td colspan="5">{{detailsData.diagnosis.measures}}</td>
                        </tr>
                        <tr>
                          <th rowspan="6" class="text-center">成本预估</th>
                          <th class="sub-head">人工维修费用：</th>
                          <td colspan="4">{{detailsData.diagnosis.price1}}</td>
                        </tr>
                        <tr>
                          <th class="sub-head">材料（配件）费用：</th>
                          <td colspan="4" style="padding:0;">
                            <div v-for="item in detailsData.diagnosis.price2" class="td-item">
                              {{item}}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th class="sub-head">差旅（配送）费用：</th>
                          <td colspan="4">{{detailsData.diagnosis.price3}}</td>
                        </tr>
                        <tr>
                          <th class="sub-head">安装费用：</th>
                          <td colspan="4">{{detailsData.diagnosis.price4}}</td>
                        </tr>
                        <tr>
                          <th class="sub-head">其他费用：</th>
                          <td colspan="4">{{detailsData.diagnosis.price5}}</td>
                        </tr>
                        <tr>
                          <th class="sub-head">合计：</th>
                          <td colspan="4">{{detailsData.diagnosis.total_price}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </el-tab-pane>
                  <el-tab-pane label="维修报价" name="repairPrice">
                    <div class="block-title">维修报价：</div>
                    <table v-if="detailsData.price"  class="details-table repair-column-4">
                      <tbody>
                        <tr>
                          <th>公司名称：</th>
                          <td colspan="3">{{detailsData.price.repair_quotation.company}}</td>
                        </tr>
                        <tr>
                          <th>标题：</th>
                          <td colspan="3">{{detailsData.price.repair_quotation.title}}</td>
                        </tr>
                        <tr>
                          <th>客户名称：</th>
                          <td>{{detailsData.price.repair_quotation.client_name}}</td>
                          <th>报价日期：</th>
                          <td>{{$timeStampFormat(detailsData.price.repair_quotation.date)}}</td>
                        </tr>
                        <tr>
                          <th>报价人：</th>
                          <td>{{detailsData.price.repair_quotation.offer_people}}</td>
                          <th>审核人：</th>
                          <td>{{detailsData.price.repair_quotation.audit_people}}</td>
                        </tr>
                        <tr>
                          <th>货币单位：</th>
                          <td>{{detailsData.price.repair_quotation.monetary_unit}}</td>
                          <th>报价是否含税：</th>
                          <td>{{detailsData.price.repair_quotation.is_tax ? '是' : '否'}}</td>
                        </tr>
                        <tr>
                          <th>选择报价表单模板：</th>
                          <td>{{detailsData.price.repair_quotation.template}}</td>
                          <th>税率：</th>
                          <td>{{detailsData.price.repair_quotation.tax}}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="block-title">设备基本信息：</div>
                    <table v-if="detailsData.price"  class="details-table equipment-info">
                      <tbody>
                        <tr>
                          <th>设备名称</th>
                          <th>规格型号</th>
                          <th>品牌</th>
                          <th>单位</th>
                          <th>数量</th>
                          <th>序列号</th>
                          <th>故障描述</th>
                        </tr>
                        <tr>
                          <td v-for="key in detailsData.price.equipment_info">{{key}}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="block-title">维修费用信息：</div>
                    <table v-if="detailsData.price"  class="details-table repair-column-6">
                      <tbody>
                        <tr>
                          <th>费用项</th>
                          <th>配件名称</th>
                          <th>规格型号</th>
                          <th>单位</th>
                          <th>数量</th>
                          <th>金额</th>
                        </tr>
                        <tr v-for="(item, index) in detailsData.price.repair_info.accessories">
                          <th>配件费{{Number(index)+1}}</th>
                          <td>{{item.name}}</td>
                          <td>{{item.model}}</td>
                          <td>{{item.unit}}</td>
                          <td>{{item.count}}</td>
                          <td>{{item.price}}</td>
                        </tr>
                        <tr>
                          <th>维修服务费</th>
                          <td colspan="4"></td>
                          <td>{{detailsData.price.repair_info.service_price}}</td>
                        </tr>
                        <tr>
                          <th>安装费</th>
                          <td colspan="4"></td>
                          <td>{{detailsData.price.repair_info.install_price}}</td>
                        </tr>
                        <tr>
                          <th>配送费</th>
                          <td colspan="4"></td>
                          <td>{{detailsData.price.repair_info.distribution_price}}</td>
                        </tr>
                        <tr>
                          <th>合计费用</th>
                          <td style="text-align: right;">大写：</td>
                          <td colspan="2">{{detailsData.price.repair_info.total_price_cn}}</td>
                          <td style="text-align: right;">小写：</td>
                          <td>{{detailsData.price.repair_info.total_price}}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="block-title">通讯联络信息：</div>
                    <table v-if="detailsData.price"  class="details-table repair-column-4">
                      <tbody>
                        <tr>
                          <th>客户方联系人：</th>
                          <td>{{detailsData.price.contact_info.clientInfo.name}}</td>
                          <th>我方联系人：</th>
                          <td>{{detailsData.price.contact_info.userInfo.name}}</td>
                        </tr>
                        <tr>
                          <th>手机号码：</th>
                          <td>{{detailsData.price.contact_info.clientInfo.phone}}</td>
                          <th>手机号码：</th>
                          <td>{{detailsData.price.contact_info.userInfo.phone}}</td>
                        </tr>
                        <tr>
                          <th>座机号码：</th>
                          <td>{{detailsData.price.contact_info.clientInfo.tel}}</td>
                          <th>座机号码：</th>
                          <td>{{detailsData.price.contact_info.userInfo.tel}}</td>
                        </tr>
                        <tr>
                          <th>联系地址：</th>
                          <td>{{detailsData.price.contact_info.clientInfo.address}}</td>
                          <th>联系地址：</th>
                          <td>{{detailsData.price.contact_info.userInfo.address}}</td>
                        </tr>
                        <tr>
                          <th>邮编：</th>
                          <td>{{detailsData.price.contact_info.clientInfo.code}}</td>
                          <th>邮编：</th>
                          <td>{{detailsData.price.contact_info.userInfo.code}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </el-tab-pane>
                  <el-tab-pane label="维修合同" name="repairContract">
                    <table v-if="detailsData.contract"  class="details-table repair-column-4">
                      <tbody>
                        <tr>
                          <th>合同标题：</th>
                          <td colspan="3">{{detailsData.contract.title}}</td>
                        </tr>
                        <tr>
                          <th>甲方名称：</th>
                          <td>{{detailsData.contract.jiafang.name}}</td>
                          <th>乙方名称：</th>
                          <td>{{detailsData.contract.yifang.name}}</td>
                        </tr>
                        <tr>
                          <th>联系地址：</th>
                          <td>{{detailsData.contract.jiafang.address}}</td>
                          <th>联系地址：</th>
                          <td>{{detailsData.contract.yifang.address}}</td>
                        </tr>
                        <tr>
                          <th>联系人：</th>
                          <td>{{detailsData.contract.jiafang.people}}</td>
                          <th>联系人：</th>
                          <td>{{detailsData.contract.yifang.people}}</td>
                        </tr>
                        <tr>
                          <th>联系电话：</th>
                          <td>{{detailsData.contract.jiafang.tel}}</td>
                          <th>联系电话：</th>
                          <td>{{detailsData.contract.yifang.tel}}</td>
                        </tr>
                        <tr>
                          <th>传真：</th>
                          <td>{{detailsData.contract.jiafang.fax}}</td>
                          <th>传真：</th>
                          <td>{{detailsData.contract.yifang.fax}}</td>
                        </tr>
                        <tr>
                          <td colspan="4" class="preview-pdf">
                            <img v-for="(img, index) in detailsData.contract.contract_pic"
                              :src="img" :alt="'合同图片'+index"
                              v-on:click="$emit('call-pictures', { pics: detailsData.contract.contract_pic, index: index})" />
                          </td>
                        </tr>
                        <tr>
                          <td>盖章合同文件：</td>
                          <td colspan="3" style="text-align:left;">
                            <i class="el-icon-document download-contract" v-on:click="$emit('call-download', detailsData.contract.contract_url)"></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-tab-pane>
                  <el-tab-pane label="维修管理" name="repairManagement">
                    <div class="block-title">维修报告:</div>
                    <table v-if="detailsData.manage"  class="details-table repair-column-4">
                      <tr>
                        <th>标题：</th>
                        <td colspan="3">{{detailsData.manage.report.title}}</td>
                      </tr>
                      <tr>
                        <th>工单编号：</th>
                        <td>{{detailsData.manage.report.id}}</td>
                        <th>编写日期：</th>
                        <td>{{$timeStampFormat(detailsData.manage.report.date)}}</td>
                      </tr>
                    </table>
                    <div class="block-title">基本信息:</div>
                    <table v-if="detailsData.manage"  class="details-table repair-column-6">
                      <tbody>
                        <tr>
                          <th>工单日期:</th>
                          <td>{{$timeStampFormat(detailsData.manage.base_info.date)}}</td>
                          <th>客户名称：</th>
                          <td>{{detailsData.manage.base_info.client_name}}</td>
                          <th>维修公司：</th>
                          <td>{{detailsData.manage.base_info.repair_company}}</td>
                        </tr>
                        <tr>
                          <th>设备名称:</th>
                          <td>{{detailsData.manage.base_info.equipment_name}}</td>
                          <th>设备类别：</th>
                          <td>{{detailsData.manage.base_info.equipment_category}}</td>
                          <th>设备品牌：</th>
                          <td>{{detailsData.manage.base_info.equipment_brand}}</td>
                        </tr>
                        <tr>
                          <th>设备来源:</th>
                          <td>{{detailsData.manage.base_info.equipment_source}}</td>
                          <th>报修方式：</th>
                          <td>{{detailsData.manage.base_info.repair_methods}}</td>
                          <th>紧急程度：</th>
                          <td>{{detailsData.manage.base_info.level}}</td>
                        </tr>
                        <tr>
                          <th>维修人员:</th>
                          <td>{{detailsData.manage.base_info.repair_peopel}}</td>
                          <th>联系方式：</th>
                          <td>{{detailsData.manage.base_info.contact}}</td>
                          <th>完成时间：</th>
                          <td>{{$timeStampFormat(detailsData.manage.base_info.fin)}}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="block-title">维修信息:</div>
                    <table v-if="detailsData.manage"  class="details-table repair-column-2">
                      <tbody>
                        <tr>
                          <th>故障描述：</th>
                          <td>{{detailsData.manage.repair_info.fault_info}}</td>
                        </tr>
                        <tr>
                          <th>故障原因：</th>
                          <td>{{detailsData.manage.repair_info.fault_reason}}</td>
                        </tr>
                        <tr>
                          <th>维修措施：</th>
                          <td>{{detailsData.manage.repair_info.fault_methods}}</td>
                        </tr>
                        <tr>
                          <th>完成情况：</th>
                          <td>{{detailsData.manage.repair_info.result}}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="block-title">维修成本:</div>
                    <table v-if="detailsData.manage"  class="details-table repair-column-6">
                      <tbody>
                        <tr>
                          <th>人工维修费用</th>
                          <th>配件费用</th>
                          <th>配送费用</th>
                          <th>安装费用</th>
                          <th>其他费用</th>
                          <th>合计（元）</th>
                        </tr>
                        <tr>
                          <td>{{detailsData.manage.repair_cost.price1}}</td>
                          <td>{{detailsData.manage.repair_cost.price2}}</td>
                          <td>{{detailsData.manage.repair_cost.price3}}</td>
                          <td>{{detailsData.manage.repair_cost.price4}}</td>
                          <td>{{detailsData.manage.repair_cost.price5}}</td>
                          <td>{{detailsData.manage.repair_cost.total}}</td>
                        </tr>
                        <tr>
                          <th>备注：</th>
                          <td colspan="5">{{detailsData.manage.repair_cost.remark}}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="block-title">维修日志：</div>
                    <div v-if="detailsData.manage" class="repair-log">
                      <p v-for="log in detailsData.manage.repair_log">{{log}}</p>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="交付与回访" name="deliveryVisit">
                    <div class="block-title">交付:</div>
                    <div class="table-wrap">
                      <table v-if="detailsData.delivery_visit"  class="details-table delivery">
                        <tbody>
                          <tr>
                            <th class="date">交付时间</th>
                            <th>交付内容</th>
                            <th class="person">接收方</th>
                            <th class="file">签字文件</th>
                          </tr>
                          <tr v-for="item in detailsData.delivery_visit.delivery">
                            <td>{{$timeStampFormat(item.date)}}</td>
                            <td>{{item.content}}</td>
                            <td>{{item.people}}</td>
                            <td>
                              <i class="el-icon-picture table-img-icon" 
                                v-on:click="$emit('call-pictures', [item.file])">
                              </i>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="block-title">快递单:</div>
                    <div class="table-wrap">
                      <table v-if="detailsData.delivery_visit"  class="details-table delivery">
                        <tbody>
                          <tr>
                            <th class="content">快递单号</th>
                            <th class="content">快递公司</th>
                            <th class="file">状态</th>
                          </tr>
                          <tr v-for="item in detailsData.delivery_visit.courier">
                            <td>{{item.id}}</td>
                            <td>{{item.company}}</td>
                            <td>{{item.status}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div class="block-title">回访记录:</div>
                    <div class="table-wrap">
                      <table v-if="detailsData.delivery_visit"  class="details-table delivery">
                        <tbody>
                          <tr>
                            <th class="date">回访时间</th>
                            <th class="person">回访员</th>
                            <th class="content">回访事由</th>
                            <th class="content">回访结果</th>
                          </tr>
                          <tr v-for="item in detailsData.delivery_visit.visit">
                            <td>{{$timeStampFormat(item.date)}}</td>
                            <td>{{item.people}}</td>
                            <td>{{item.content}}</td>
                            <td>{{item.result}}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>`,
  props: {
    detailsData: Object,
  },
  data: function() {
    return {
      detailsTabActive: 'baseInfo',  //标签页选中
    }
  },
})
Vue.component('jgb-order-details', orderDetails)