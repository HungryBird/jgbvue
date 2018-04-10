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

/**
 * 组件 设置成员
 * created by lanw 2018-4-8
 * @param {Array} value 绑定选中的用户数组
 * @param {String, Object} company 规则-String:获取公司的接口地址 规则-Object {label, uid}:公司名,公司编号
 * @param {String} departmentUrl 获取部门的接口地址
 * @param {String} userUrl 获取用户的接口地址
 * @return {Array} 绑定选中的用户数组
 */
let setMember = Vue.extend({
  template: `<el-container class="set-member-wrap">
              <el-header class="set-member-header">
                <div v-if="isCompany" class="set-member-company single">
                  {{companyName}}
                </div>
                <el-select v-else class="set-member-company"
                  placeholder="请选择公司" v-model="companyId">
                  <el-option
                    v-for="item in companyList"
                    :key="item.number"
                    :label="item.label"
                    :value="item.number">
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
              <el-container v-if="departmentList.length">
                <el-aside class="set-member-aside">
                  <ul class="ul-list">
                    <li v-for="(item, index) in departmentList"
                      :class="departmentId == item.value ? 'active' : ''"
                      v-on:click="departmentId = item.value">
                      {{item.label}}
                    </li>
                  </ul>
                </el-aside>
                <el-main>
                  <div class="w-member-list" v-if="userList.length">
                    <div v-for="(member, index) in userList" class="member-item"
                      :class="member.checked ? 'checked': ''"
                      v-on:click="toggleMemberChecked(member, index)">
                      <img class="member-pic" :src="member.pic_url" :alt="member.name"/>
                      <div class="member-info">
                        <div class="info-item">工号：{{member.uid}}</div>
                        <div class="info-item">姓名：{{member.name}}</div>
                        <div class="info-item">部门：{{member.department}}</div>
                      </div>
                      <i v-if="member.checked" class="el-icon-check checked-tag"></i>
                    </div>
                  </div>
                  <transition name="slide-from-right">
                    <ul v-show="showCheckedList" class="w-checked-list">
                      <li v-for="(item, index) in userCheckedList" class="checked-item">
                        <span>{{item.companyName}}</span>
                        <span>{{item.department}}【{{item.name}}】</span>
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
    company: [String, Object],
    departmentUrl: String,
    userUrl: String,
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
      companyName: '', //公司名称
      companyId: '', //公司id
      companyList: [], //公司列表 *仅在传入公司接口地址使用
      departmentList: [], //部门列表
      departmentId: '', //部门id
      keyword: '', //搜索关键字
      userList: [], //部门对应职员
      userCheckedList: [], //选中成员

      showCheckedList: false, //是否显示选中成员
    }
  },
  methods: {
    //获取公司列表 *最终写入companyList的全部为子公司
    getCompanyList: function() {
      if(this.isCompany) return;
      axios.get(this.company).then(res=> {
        if(res.data.status) {
          let _data = JSON.parse(res.data.data)
          this.companyList = this.getAllChildrenCompany(_data).concat()
          // console.log(this.companyList)
        }
        else {
          this.$alert(res.data.message, '提示')
        }
      }).catch(err=> {
        this.$alert(err, '提示')
      })
    },
    //获取公司列表中所有子公司
    getAllChildrenCompany: function(_data) {
      let arr = []
      for (let i = 0; i < _data.length; i++) {
        if (_data[i].children) {
          arr.push({
            label: _data[i].label,
            number: _data[i].number
          })
          arr = arr.concat(this.getAllChildrenCompany(_data[i].children))
        }
        else {
          arr.push(_data[i])
        }
      }
      return arr
    },
    //获取部门中选中的成员 与userCheckedList去重{uid}
    getUserCheckedList: function(_data) {
      let target = []
      let checked = []
      this.userCheckedList.length && this.userCheckedList.forEach(user=> {
        checked.push(user.uid)
      })
      _data.forEach(member => {
        if (member.checked && checked.indexOf(member.uid) == -1) {
          target.push(member)
        }
      })
      return target
    },
    //根据部门， 关键字 获取数据
    getUserList: function() {
      axios.post(this.userUrl, {
        deparment: this.departmentId,
        keyword: this.keyword
      }).then(res => {
        if (res.data.status) {
          this.userList = JSON.parse(res.data.data)
          this.userCheckedList = this.userCheckedList.concat(this.getUserCheckedList(this.userList))
        }
        else {
          this.$alert(res.data.message, '提示')
        }
      }).catch(err => {
        this.$alert(err, '提示')
      })
    },
    //切换成员选中状态并更新选中列表
    toggleMemberChecked: function(member, index) {
      this.userList[index].checked = !member.checked
      //更新选中列表
      let checked = []
      this.userCheckedList.length && this.userCheckedList.forEach(user => {
        checked.push(user.uid)
      })
      if(checked.indexOf(member.uid) == -1) {
        this.userCheckedList.push(member)
      }
      else {
        this.userCheckedList.splice(checked.indexOf(member.uid), 1)
      }
    },
    //从选中人员中删除
    removeChecked: function(item, index) {
      this.userCheckedList.splice(index, 1);
      //检查展示中的成员列表userList是否存在该成员并更改checked状态
      this.userList.forEach(user=> {
        if(user.uid == item.uid) {
          user.checked = false
        }
      })
    },
    //搜索
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
      this.getUserList()
    },
  },
  watch: {
    //公司id改变获取对应部门数据
    companyId: function() {
      axios.post(this.departmentUrl, {
        company: this.companyId
      }).then(res=> {
        if(res.data.status) {
          this.departmentList = JSON.parse(res.data.data).concat()
          //默认选中第一个部门
          this.departmentId = this.departmentList[0].value
        }
        else {
          this.$alert(res.data.message, '提示')
        }
      }).catch(err => {
        this.$alert(err, '提示')
      })
    },
    //部门id改变获取对应成员数据
    departmentId: function () {
      this.getUserList()
    },
    //更新绑定数据
    userCheckedList: function() {
      this.$emit('input', this.userCheckedList)
    },
  },
  created: function () {
    this.companyName = this.isCompany ? this.company.label : ''
    if (this.isCompany) {
      this.companyName = this.company.label
      this.companyId = this.company.uid
    }
    else {
      this.getCompanyList()
    };
  },
})
Vue.component('jgb-set-member', setMember)