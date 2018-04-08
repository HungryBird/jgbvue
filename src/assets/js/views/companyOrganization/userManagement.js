/**
 * created by lanw 2018-03-28
 * 用户管理
 */
JGBVue = {
  module: {}
}

JGBVue.module.userManagement = () => {
  let _this = {}, that = {}
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
    addAccessTimeUrl,
    delAccessTimeUrl,
    accessTimeGetUrl,
    getSystemModulesUrl,
    getSystemButtonViewUrl,
    getSystemOtherRightsUrl,
    updateSystemRightsUrl) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
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
          loadingSaveAdd: false, //是否在新增用户表单传输
          showEditUserDialog: false, //修改用户模态框
          loadingSaveEdit: false, //是否在新增用户表单传输
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
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
            ],
            name: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
            ],
            department: [
              { required: true, message: '请选择部门', trigger: 'blur' },
            ],
          },
          formDepartmentList: [],//当前公司对应部门列表
          formPositionList: [],//当前部门对应职位列表

          showTimeAccess: false, //时段访问模态框
          accessDialogActive: 'monday', //时段访问标签页
          currentAccessTime: [new Date(2017, 7, 7, 0, 0), new Date(2017, 7, 8, 23, 0)], //选择的禁止访问时段
          accessTimeList: [], //当前用户的禁止访问时段
          isAddingAccessTime: false, //是否正在添加时段

          showRightsManagement: false, //权限管理窗
          isUpdatingRight: false, //正在更新用户权限
          rightsStepActive: 0, //步骤进度
          systemModules: [], //系统功能列
          systemButtons: [], //系统按钮列
          systemViews: [], //系统视图列
          systemOthers: [], //其他权限
          systemModulesCheckedKeys: [], //系统功能选中组
          systemButtonsCheckedKeys: [], //系统按钮选中组
          systemViewsCheckedKeys: [], //系统视图选中组
          systemOthersChecked: [], //其他权限选中组
        }
      },
      methods: {
        //公司树形节点控制
        handleNodeClick(obj, node, self) {
          if (!obj.children) {
            this.currentCompany = obj.label;
            this.currentNode = obj.number
          }
        },
        //查询
        search: function () {
          this.getUserList()
        },
        //新增
        btnAdd: function () {
          this.showAddUserDialog = true
          this.formDepartmentList = this.currentDepartmentList.concat()
        },
        //删除
        btnRemove: function () {
          this.$confirm('是否删除选中用户?', '提示').then(() => {
            let list = []
            for (let i = 0; i < this.selectedRows.length; i++) {
              list.push(this.selectedRows[i].number)
            }
            axios.post(userDelete, list).then((res) => {
              // this.$alert(res.data.message, '提示')
              //更新用户列表
              this.getUserList()
            }).catch((err) => {
              this.$alert(err, '错误')
            })
          }).catch(() => {
            //to do
          });
        },
        /**
         * 禁用 启用
         * @param {*} type 启用/禁用标识
         */
        btnDisabled: function (type) {
          this.$confirm(`是否${type ? '启' : '禁'}用选中用户?`, '提示').then(() => {
            let list = []
            for (let i = 0; i < this.selectedRows.length; i++) {
              list.push(this.selectedRows[i].number)
            }
            axios.post(userStatus, {
              list: list,
              type: type
            }).then((res) => {
              // this.$alert(res.data.message, '提示')
              //更新用户列表
            }).catch((err) => {
              this.$alert(err, '错误')
            })
          }).catch(() => {
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
        btnExport: function () { },
        //重置密码
        btnReset: function () {
          this.$confirm('是否重置选中用户密码?', '提示').then(() => {
            //ajax
            this.$alert('账户密码重置到默认密码：123456', '提示')
          }).catch();
        },
        //权限管理
        btnRights: function () {
          axios.post(getSystemModulesUrl, {
            user: this.selectedRows[0].number
          }).then(req => {
            if (req.data.status) {
              let _data = JSON.parse(req.data.data)
              this.systemModules = _data.concat()
              //设置默认展开、选中
              this.systemModulesCheckedKeys = this.defaultChecked(this.systemModules)
              this.showRightsManagement = true;
              this.rightsStepActive = 0;
            }
          }).catch(err => { })
        },
        /**
         * 获取所有checked的数据 返回一个uid的数组
         */
        defaultChecked: function (_data) {
          let arr = []
          for (let i = 0; i < _data.length; i++) {
            let item = _data[i]
            if (typeof item.children == 'object') {
              let arr2 = this.defaultChecked(item.children)
              for (let j = 0; j < arr2.length; j++) {
                arr.push(arr2[j])
              }
            }
            else if (item.checked) { //else if 防止父级checked=true, 会覆盖children中有false的情况
              arr.push(item.uid)
            };
          }
          return arr
        },
        //页面-表格列点击选中
        rowClick: function (row) {
          this.$refs.userTable.toggleRowSelection(row);
          if (this.selectedRows.indexOf(row) == -1) {
            this.selectedRows.push(row)
          } else {
            this.selectedRows.splice(this.selectedRows.indexOf(row), 1);
          }
        },
        //页面-全选
        selectAll(selection) {
          let _self = this;
          if (selection.length == 0) {
            _self.selectedRows.splice(0, _self.selectedRows.length);
          } else {
            _self.selectedRows.splice(0, _self.selectedRows.length);
            selection.forEach((item) => {
              _self.selectedRows.push(item);
            })
          }
        },
        //页面-单选
        selectItem: function (selection, row) {
          let _self = this;
          this.selectedRows.splice(0, _self.selectedRows.length);
          for (let i = 0; i < selection.length; i++) {
            _self.selectedRows.push(selection[i]);
          }
        },
        //修改
        handleEdit: function (index, row) {
          this.formDepartmentList = this.currentDepartmentList.concat()
          this.editForm = this.$deepCopy(row)
          this.editForm.department = row.department.value
          this.editForm.birthday = new Date(row.birthday * 1000)//后端需要日期格式非时间戳再更改html, js
          this.handleFormDepartment(row.department.value)
          this.showEditUserDialog = true
        },
        //单个用户删除
        handleDelete: function (index, row) {
          console.log(index, row)
          let list = []
          list.push(row.number)
          this.$confirm('确认删除该用户?', '提示').then(() => {
            axios.post(userDelete, list).then((res) => {
              this.$alert(res.data.message, '提示')
            }).catch(err => {
              this.$alert(err, '错误')
            })
          }).catch()
        },
        //单个用户 启用/禁用
        handleStatus: function (index, row) {
          axios.post(userStatus, {
            number: row.number,
            status: row.status
          }).then((res) => {
            //操作失败
            if (!res.data.status) {
              this.$confirm(res.data.message, '提示')
            }
          }).catch(err => {
            this.$confirm(err, '错误')
          })
        },
        //表单选择部门 获取职位数据
        handleFormDepartment: function (d) {
          axios.post(positionListGetUrl, d).then(res => {
            if (res.data.status) {
              this.addForm.currentPositionList = JSON.parse(res.data.data).concat()
            }
          })
        },
        //访问过滤
        handleAccess: function () {
          switch (this.currentAccess) {
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
        handleAddAccessTime: function () {
          this.isAddingAccessTime = true
          axios.post(addAccessTimeUrl, {
            user: this.selectedRows[0].number,
            weekday: this.accessDialogActive,
            time: this.currentAccessTime
          }).then(res=> {
            if(res.data.status) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
            }
            else {
              this.$alert(res.data.message, '提示')
            };
            this.isAddingAccessTime = false
          }).catch(err=> {
            this.$alert(err, '提示')
            this.isAddingAccessTime = false
          })
        },
        //删除禁止访问时段
        handleDeleteTime: function (index, row) {
          // row { weekday, time }
          axios.post(delAccessTimeUrl).then().catch()
        },
        /**
         * 系统功能树形菜单
         * @param {*} obj 传递给 data 属性的数组中该节点所对应的对象
         * @param {boolean} checked 节点本身是否被选中
         * @param {boolean} children 节点的子树中是否有被选中的节点
         */
        handleSystemModulesCheckChange: function (obj, checked, children) {
          // console.log(this.$refs.systemModules.getCheckedKeys())
          //同步系统功能选中组
          this.systemModulesCheckedKeys = this.$refs.systemModules.getCheckedKeys().concat()
        },
        //系统按钮树形菜单
        handleSystemButtonsCheckChange: function (obj, checked, children) {
          this.systemButtonsCheckedKeys = this.$refs.systemButtons.getCheckedKeys().concat()
        },
        //系统视图树形菜单
        handleSystemViewsCheckChange: function (obj, checked, children) {
          this.systemViewsCheckedKeys = this.$refs.systemViews.getCheckedKeys().concat()
        },
        /**
         * 权限步骤控制 
         * 在进入下一步前获取相应数据
         * @param {String} type 上一步'prev', 下一步'next'
         */
        handleSystemStep: function (type) {
          switch (type) {
            case 'prev':
              this.rightsStepActive = this.rightsStepActive < 1 ? 0 : this.rightsStepActive - 1
              break;
            case 'next':
              if (this.rightsStepActive == 0) { //系统功能
                //获取按钮 视图 组
                axios.post(getSystemButtonViewUrl,
                  this.systemModulesCheckedKeys).then(req => {
                    if (req.data.status) {
                      let _data = JSON.parse(req.data.data)
                      this.systemButtons = _data.buttons.concat()
                      this.systemViews = _data.views.concat()
                      //设置默认展开、选中
                      this.systemButtonsCheckedKeys = this.defaultChecked(this.systemButtons)
                      this.systemViewsCheckedKeys = this.defaultChecked(this.systemViews)
                    }
                  }).catch(err => {
                    // 应该在此处处理返回的错误，并阻止rightsStepActive自增？
                  })
              }
              else if (this.rightsStepActive == 2) { //其他权限
                axios.post(getSystemOtherRightsUrl, {
                  user: this.selectedRows[0].number
                }).then(req => {
                  if (req.data.status) {
                    this.systemOthers = JSON.parse(req.data.data).concat()
                    //获取其他权限选中组 并配置表格选项
                    let checked = []
                    for (let i = 0; i < this.systemOthers.length; i++) {
                      let item = this.systemOthers[i]
                      if (item.checked) {
                        checked.push(item)
                        this.systemOthersChecked.push(item.uid)
                      }
                    }
                    //数据更新触发toggleSelection 否则不生效
                    this.$nextTick(function () {
                      this.toggleSelection(checked)
                    })

                  }
                }).catch(err => { })
              }
              this.rightsStepActive++
              break;
          }
        },
        //切换其他权限表格selected状态
        toggleSelection(rows) {
          if (rows) {
            rows.forEach(row => {
              this.$refs.systemOthers.toggleRowSelection(row, true)
            });
          } else {
            this.$refs.systemOthers.clearSelection()
          }
        },
        //权限-表格列点击选中
        rightsRowClick: function (row) {
          let uid = row.uid
          this.$refs.systemOthers.toggleRowSelection(uid);
          if (this.systemOthersChecked.indexOf(uid) == -1) {
            this.systemOthersChecked.push(uid)
            this.$refs.systemOthers.toggleRowSelection(row, true);
          } else {
            this.systemOthersChecked.splice(this.systemOthersChecked.indexOf(uid), 1);
            this.$refs.systemOthers.toggleRowSelection(row, false);
          }
        },
        //权限-全选
        rightsSelectAll(selection) {
          this.systemOthersChecked = []
          if (selection.length) {
            this.systemOthers.forEach(item => {
              console.log(item)
              this.systemOthersChecked.push(item.uid)
            })
          };
        },
        //权限-单选
        rightsSelectItem: function (selection, row) {
          if (this.systemOthersChecked.indexOf(row.uid) == -1) {
            this.systemOthersChecked.push(row.uid)
          }
          else {
            this.systemOthersChecked.splice(this.systemOthersChecked.indexOf(row.uid), 1)
          }
        },
        //更新权限设置
        completeRights: function () {
          this.isUpdatingRight = true
          axios.post(updateSystemRightsUrl, {
            modules: this.systemModulesCheckedKeys,
            buttons: this.systemButtonsCheckedKeys,
            views: this.systemViewsCheckedKeys,
            others: this.systemOthersChecked,
            user: this.selectedRows[0].number
          }).then(res => {
            if(res.data.status) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.showRightsManagement = false
            }
            else {
              this.$alert(res.data.message, '提示')
            };
            this.isUpdatingRight = false
          }).catch(err => {
            this.$alert(err, '提示')
            this.isUpdatingRight = false
          })
        },
        //获取用户列表
        getUserList: function () {
          axios.get(userListGetUrl, {
            currentCompany: this.currentCompany,
            currentDepartment: this.currentDepartment,
            keyword: this.keyword
          }).then((res) => {
            if (res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.userList = _data
              // console.log(this.userList)
            };
          }).catch((err) => {
            console.log('err', err);
          })
        },
        //保存新增表单
        saveAdd: function () {
          // console.log(this.addForm)
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              this.loadingSaveAdd = true
              axios.post(userAddUrl, this.addForm).then(res => {
                //添加成功
                if (res.data.status) {
                  this.$message({
                    message: res.data.message,
                    type: 'success'
                  });
                  this.addForm = this.addFormDefault
                }
                else {
                  this.$alert(res.data.message, '提示')
                };
                this.loadingSaveAdd = false
              }).catch(err => {
                this.$alert(err, '提示')
                this.loadingSaveAdd = false
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        //关闭新增表单
        closeAdd: function () {
          this.showAddUserDialog = false;
        },
        //保存修改表单
        saveEdit: function () {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.loadingSaveEdit = true
              axios.post(userEditUrl, this.editForm).then(res => {
                if (res.data.status) {
                  this.$message({
                    message: res.data.message,
                    type: 'success'
                  });
                }
                else {
                  this.$alert(res.data.message, '提示')
                };
                this.loadingSaveEdit = false
                this.showEditUserDialog = false
              }).catch(err => {
                this.$alert(err, '提示')
                this.loadingSaveEdit = false
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        //关闭修改表单
        closeEdit: function () {
          this.showEditUserDialog = false;
        },
      },
      watch: {
        currentCompany: function () {
          let data = {
            label: this.currentCompany,
            number: this.currentNode
          }
          axios.post(departmentGetUrl, data).then((res) => {
            if (res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.currentDepartmentList = _data.parentDepartmentOptions.concat()
            }
          }).catch((err) => {
            console.log('err: ', err)
          })
          this.currentDepartment = ''
          this.getUserList()
        },
        currentDepartment: function () {
          this.getUserList()
        },
      },
      created: function () {
        axios.get(treeDataGetUrl).then((res) => {
          if (res.data.status) {
            let _data = JSON.parse(res.data.data)
            this.treeData = _data
          };
          this.currentCompany = this.treeData[0].children[0].label
          this.currentNode = this.treeData[0].children[0].number
          this.defaultExpandedKeys.push(this.treeData[0].label)
        }).catch((err) => {
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
    addAccessTimeUrl,
    delAccessTimeUrl,
    accessTimeGetUrl,
    getSystemModulesUrl,
    getSystemButtonViewUrl,
    getSystemOtherRightsUrl,
    updateSystemRightsUrl) => {
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
      addAccessTimeUrl,
      delAccessTimeUrl,
      accessTimeGetUrl,
      getSystemModulesUrl,
      getSystemButtonViewUrl,
      getSystemOtherRightsUrl,
      updateSystemRightsUrl)
  }
  return that
}
