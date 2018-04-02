/**
 * created by lanw 2018-03-28
 * 用户管理
 */
JGBVue = {
  module: {}
}

JGBVue.module.userManagement = ()=>{
  let _this = {},that = {}
  _this.init = (
    treeDataGetUrl, 
    departmentGetUrl, 
    positionListGetUrl,
    userListGetUrl,
    userStatus,
    userDelete,
    userPasswordReset,
    userAddUrl,
    userEditUrl,
    addAccountTimeUrl,
    delAccountTimeUrl,
    accessTimeGetUrl)=> {
    that.vm = new Vue({
      el: '#app',
      data: function() {
        return {
          treeData: [], //公司列
          defaultProps: {
            label: 'label',
            children: 'children'
          },
          defaultExpandedKeys: [], //默认展开公司

          currentCompany: '',//当前公司
          currentNode: '', //当前公司
          currentDepartmentList: [], //当前公司部门列表
          currentDepartment: '', //当前部门
          currentAccess: '',//当前访问过滤类型
          keyword: '', //搜索

          userList: [],
          selectedRows: [], //选中行
          showAddUserDialog: false, //新增用户模态框
          addForm: { //新增用户表单
            number: '',
            account: '',
            password: '',
            name: '',
            sex: '',
            phone: '',
            tel: '',
            position: '',
            department: '',
            status: '',
            birthday: '',
            email: '',
            QQ: '',
            wx: '',
            remark: ''
          },
          addFormDefault: {},//新增用户表单默认
          showEditUserDialog: false, //修改用户模态框
          editForm: { //修改用户表单
            number: '',
            account: '',
            password: '',
            name: '',
            sex: '',
            phone: '',
            tel: '',
            position: '',
            department: '',
            status: '',
            birthday: '',
            email: '',
            QQ: '',
            wx: '',
            remark: ''
          },
          formRules: { //验证规则
            account: [
              { required: true, message: '请输入帐号', trigger: 'blur' },
            ],
            password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
            ],
            name:[
              { required: true, message: '请输入姓名', trigger: 'blur' },
            ],
            department:[
              { required: true, message: '请选择部门', trigger: 'blur' },
            ],
          },
          formDepartmentList: [],//当前公司对应部门列表
          formPositionList: [],//当前部门对应职位列表

          showTimeAccess: false, //时段访问模态框
          accessDialogActive: 'monday', //时段访问标签页
          currentAccessTime: [new Date(2017, 7, 7, 0, 0), new Date(2017, 7, 8, 23, 0)], //选择的禁止访问时段
          accessTimeList: [], //当前用户的禁止访问时段
        }
      },
      methods: {
        demo: function(msg) {console.log(msg)},
        //树形节点控制
				handleNodeClick(obj, node, self) {
					if(!obj.children) {
            this.currentCompany = obj.label;
            this.currentNode = obj.number
					}
        },
        //查询
        search: function() {
          this.getUserList()
        },
        //新增
        btnAdd: function() {
          this.showAddUserDialog = true
          this.formDepartmentList = this.currentDepartmentList.concat()
        },
        //删除
        btnRemove: function() {
          this.$confirm('是否删除选中用户?', '提示').then(()=> {
            let list = []
            for(let i = 0; i < this.selectedRows.length; i++) {
              list.push(this.selectedRows[i].number)
            }
            axios.post(userDelete, list).then((res)=> {
              // this.$alert(res.data.message, '提示')
              //更新用户列表
              this.getUserList()
            }).catch((err)=> {
              this.$alert(err, '错误')
            })
          }).catch(()=>{
            //to do
          });
        },
        //禁用 启用
        btnDisabled: function(type) {
          this.$confirm(`是否${type? '启': '禁'}用选中用户?`, '提示').then(()=> {
            let list = []
            for(let i = 0; i < this.selectedRows.length; i++) {
              list.push(this.selectedRows[i].number)
            }
            axios.post(userStatus, {
              list: list,
              type: type
            }).then((res)=> {
                // this.$alert(res.data.message, '提示')
                //更新用户列表
            }).catch((err)=> {
              this.$alert(err, '错误')
            })
          }).catch(()=>{
            //todo
          });
        },
        //启用
        /*btnEnable: function() {
          this.$confirm('是否启用选中用户?', '提示').then(()=> {
            //ajax
          }).catch(()=>{
            //ajax
          });
        },*/
        //导出
        btnExport: function() {},
        //重置密码
        btnReset: function() {
          this.$confirm('是否重置选中用户密码?', '提示').then(()=> {
            //ajax
            this.$alert('账户密码重置到默认密码：123456', '提示')
          }).catch();
        },
        //表格列点击选中
        rowClick: function(row) {
					this.$refs.userTable.toggleRowSelection(row);
					if(this.selectedRows.indexOf(row) == -1) {
						this.selectedRows.push(row)
					}else{
						this.selectedRows.splice(this.selectedRows.indexOf(row), 1);
					}
        },
        //全选
				selectAll(selection) {
					let _self = this;
          if(selection.length == 0) {
            _self.selectedRows.splice(0, _self.selectedRows.length);
          }else{
            _self.selectedRows.splice(0, _self.selectedRows.length);
            selection.forEach((item)=> {
                _self.selectedRows.push(item);
            })
          }
        },
        //单选
        selectItem: function(selection, row) {
          let _self = this;
          this.selectedRows.splice(0, _self.selectedRows.length);
          for(let i = 0; i < selection.length; i++) {
            _self.selectedRows.push(selection[i]);
          }
        },
        //修改
        handleEdit: function(index, row) {
          this.formDepartmentList = this.currentDepartmentList.concat()
          this.editForm = row
          this.editForm.department = row.department.value
          this.editForm.birthday = new Date(row.birthday*1000)//后端需要日期格式非时间戳再更改html, js
          this.handleFormDepartment(row.department.value)
          this.showEditUserDialog = true
        },
        //单个用户删除
        handleDelete: function(index, row) {
          console.log(index, row)
          let list = []
          list.push(row.number)
          this.$confirm('确认删除该用户?', '提示').then(()=> {
            axios.post(userDelete, list).then((res)=> {
              this.$alert(res.data.message, '提示')
            }).catch(err => {
              this.$alert(err, '错误')
            })
          }).catch()
        },
        //单个用户 启用/禁用
        handleStatus: function(index, row) {
          axios.post(userStatus, {
            number: row.number,
            status: row.status
          }).then((res)=> {
            //操作失败
            if(!res.data.status) {
              this.$confirm(res.data.message, '提示')
            }
          }).catch(err => {
            this.$confirm(err, '错误')
          })
        },
        //表单选择部门 获取职位数据
        handleFormDepartment: function(d) {
          axios.post(positionListGetUrl, d).then(res=> {
            if(res.data.status) {
              this.addForm.currentPositionList = JSON.parse(res.data.data).concat()
            }
          })
        },
        //访问过滤
        handleAccess: function() {
          switch(this.currentAccess) {
            case 'time': 
              //test data
              this.accessTimeList = [{
                'weekday': '星期一',
                'time': '上午10:00--下午15:00'
              }, {
                'weekday': '星期二',
                'time': '上午10:00--下午15:00'
              }, {
                'weekday': '星期三',
                'time': '上午10:00--下午15:00'
              }, {
                'weekday': '星期四',
                'time': '上午10:00--下午15:00'
              }]
              // axios.get(accountTimeGet, selectedRows[0].number).then(res=> {
              //   this.accessTimeList = JSOn.parse(res.data.data)
              // }).catch()
              this.showTimeAccess = true
              break
            case 'ip': 
              break
          }
        },
        //添加禁止访问时段
        handleAddAccessTime: function() {
          axios.post(addAccountTimeUrl, {
            user: this.selectedRows[0].number,
            weekday: this.accessDialogActive,
            time: this.currentAccessTime
          }).then().catch()
        },
        //删除禁止访问时段
        handleDeleteTime: function(index, row) {
          // row { weekday, time }
          axios.post(delAccountTimeUrl).then().catch()
        },
        //获取用户列表
        getUserList: function() {
          axios.get(userListGetUrl, {
            currentCompany: this.currentCompany,
            currentDepartment: this.currentDepartment,
            keyword: this.keyword
          }).then((res)=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.userList = _data
              // console.log(this.userList)
            };
          }).catch((err)=> {
            console.log('err', err);
          })
        },
        //保存新增表单
        saveAdd: function() {
          // console.log(this.addForm)
          axios.post(userAddUrl, this.addForm).then(res=> {
            //添加成功
            if(res.data.status) {
              this.$alert(res.data.message, '提示')
              this.addForm = this.addFormDefault
            }
            else {
              this.$alert(res.data.message, '提示')
            }
          }).catch()
        },
        //关闭新增表单
        closeAdd: function() {
          this.showAddUserDialog = false;
        },
        //保存修改表单
        saveEdit: function() {
          axios.post(userEditUrl, this.editForm).then(res=> {
            this.$alert(res.data.message, '提示')
          }).catch(err => {
            this.$alert(err, '提示')
          })
        },
        //关闭修改表单
        closeEdit: function() {
          this.showEditUserDialog = false;
        },
      },
      watch: {
        currentCompany: function() {
          let data = {
            label: this.currentCompany,
            number: this.currentNode
          }
          axios.post(departmentGetUrl, data).then((res)=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.currentDepartmentList = _data.parentDepartmentOptions.concat()
            }
          }).catch((err)=> {
            console.log('err: ', err)
          })
          this.currentDepartment = ''
          this.getUserList()
        },
        currentDepartment: function() {
          this.getUserList()
        },
      },
      created: function() {
				axios.get(treeDataGetUrl).then((res)=> {
					if(res.data.status) {
						let _data = JSON.parse(res.data.data)
            this.treeData = _data
					};
          this.currentCompany = this.treeData[0].children[0].label
          this.currentNode = this.treeData[0].children[0].number
          this.defaultExpandedKeys.push(this.treeData[0].label)
				}).catch((err)=> {
					console.log('err', err);
				})
      },
    })
  }
  that.init = (
    treeDataGetUrl, 
    departmentGetUrl, 
    positionListGetUrl,
    userListGetUrl,
    userStatus,
    userDelete,
    userPasswordReset,
    userAddUrl,
    userEditUrl,
    addAccountTimeUrl,
    delAccountTimeUrl,
    accessTimeGetUrl)=> {
    _this.init(
      treeDataGetUrl, 
      departmentGetUrl, 
      positionListGetUrl,
      userListGetUrl,
      userStatus,
      userDelete,
      userPasswordReset,
      userAddUrl,
      userEditUrl,
      addAccountTimeUrl,
      delAccountTimeUrl,
      accessTimeGetUrl)
  }
  return that
}
