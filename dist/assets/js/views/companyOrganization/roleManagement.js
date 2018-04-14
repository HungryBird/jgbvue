/**
 * created by lanw 2018-04-03
 * 角色管理
 */
JGBVue = {
  module: {}
}

JGBVue.module.roleManagement = () => {
  let _this = {}, that = {}
  _this.init = (
    treeDataGetUrl,//获取公司数据
    departmentGetUrl,//获取部门信息
    roleListGetUrl,//获取角色列表
    roleStatus,//禁用/启用用户状态
    roleDelete,//删除用户
    roleAddUrl,//新增角色
    roleEditUrl,//修改角色
    addAccessTimeUrl,//增加访问时段
    delAccessTimeUrl,//删除访问时段
    accessTimeGetUrl,//获取访问时段
    getSystemModulesUrl,//权限设置-获取系统功能
    getSystemButtonViewUrl,//权限设置-获取系统按钮、系统视图
    getSystemOtherRightsUrl,//权限设置-获取其他权限
    updateSystemRightsUrl,//-更新权限设置
    roleMemberListUrl,//获取角色成员组
    departmentMemberGetUrl, //获取部门成员组
    setRoleMemberUrl//更新角色成员
    ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          keyword: '', //搜索
          defaultProps: {
            label: 'label',
            children: 'children'
          },

          roleList: [],
          selectedRows: [], //选中行
          showAddRoleDialog: false, //新增角色模态框
          addForm: { //新增角色表单
            uid: '', //角色编号
            name: '', //角色名称
            info: '' //角色描述
          },
          isAddingForm: false, //新增表单提交状态
          addFormDefault: {//新增角色表单默认
            uid: '', //角色编号
            name: '', //角色名称
            info: '' //角色描述
          },
          showEditRoleDialog: false, //修改用户模态框
          editForm: { //修改用户表单
            uid: '',
            name: '',
            info: '',
          },
          isEditingForm: false, //修改表单提交状态
          formRules: { //验证规则
            uid: [
              { required: true, message: '请输入角色编号', trigger: 'blur' },
            ],
            name: [
              { required: true, message: '请输入角色名称', trigger: 'blur' },
            ]
          },
          formDepartmentList: [],//当前公司对应部门列表
          formPositionList: [],//当前部门对应职位列表

          showTimeAccess: false, //时段访问模态框
          accessDialogActive: 'monday', //时段访问标签页
          currentAccessTime: [new Date(2017, 7, 7, 0, 0), new Date(2017, 7, 8, 23, 0)], //选择的禁止访问时段
          accessTimeList: [], //当前用户的禁止访问时段
          isAddingAccessTime: false, //是否添加时段中

          showRightsManagement: false, //权限管理窗
          isUpdatingRight: false, //更新数据中
          rightsStepActive: 0, //步骤进度
          systemModules: [], //系统功能列
          systemButtons: [], //系统按钮列
          systemViews: [], //系统视图列
          systemOthers: [], //其他权限
          systemModulesCheckedKeys: [], //系统功能选中组
          systemButtonsCheckedKeys: [], //系统按钮选中组
          systemViewsCheckedKeys: [], //系统视图选中组
          systemOthersChecked: [], //其他权限选中组

          showRoleMember: false, //查看角色成员组 窗
          isLoadingRoleMember: false, //正在获取成员组
          roleMemberList: [], //角色成员组

          showSetRoleMember: false, //设置成员 窗
          checkedRoleMember: [], //选中成员
          loadingSetRoleMember: false, //正在成员更新数据
          companyList: [], //公司列表
          departmentList: [], //部门列表
          userList: [], //用户列表
          defaultCompanyProps: { label: "label", value: "number" }, //插件内公司配置key名
          defaultDepartmentProps: { label: "label", value: "value" }, //插件内部门配置key名
          defaultUserProps: { //插件内部用户 选中人员配置key名
            userName: "name", 
            userId: "uid", 
            userPic: "src", 
            departmentName: "department", 
            companyName: "companyName"
          },
        }
      },
      methods: {
        //查询
        search: function () {
          if(!this.keyword) {
            this.$message({
              type:'error',
              message: '请输入查询关键词'
            })
            return;
          }
          this.getRoleList()
        },
        //新增
        btnAdd: function () {
          this.showAddRoleDialog = true
        },
        //保存新增表单
        saveAdd: function () {
          // console.log(this.addForm)
          this.$refs.addForm.validate((valid) => {
            if (valid) {
              this.isAddingForm = true
              axios.post(roleAddUrl, this.addForm).then(res => {
                //添加成功
                if (res.data.status) {
                  this.$message({
                    message: res.data.message,
                    type: 'success'
                  });
                  this.addForm = this.$deepCopy(this.addFormDefault)
                }
                else {
                  this.$alert(res.data.message, '提示')
                }
                this.isAddingForm = false
              }).catch(err => {
                this.$alert(err, '提示')
                this.isAddingForm = false
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        //关闭新增表单
        closeAdd: function () {
          this.showAddRoleDialog = false;
        },
        //删除
        btnRemove: function () { 
          this.$confirm('是否删除选中用户?', '提示').then(() => {
            let list = []
            for (let i = 0; i < this.selectedRows.length; i++) {
              list.push(this.selectedRows[i].uid)
            }
            axios.post(roleDelete, list).then((res) => {
              if (res.data.status) {
                //更新用户列表
                this.getRoleList()
                this.$message({
                  message: res.data.message,
                  type: 'success'
                })
              }
              else {
                this.$alert(res.data.message, '提示')
              }
            }).catch((err) => {
              this.$alert(err, '错误')
            })
          }).catch(() => {
            //to do
          });
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
        //查看成员
        btnGetMember: function() {
          this.getRoleMemberList('isLoadingRoleMember', 'showRoleMember')
        },
        //设置成员
        btnSetMember: function () {
          this.getCompanyList()
          this.getRoleMemberList('isLoadingRoleMember', 'showSetRoleMember')
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
          this.$refs.roleTable.toggleRowSelection(row);
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
          this.editForm = {
            uid: row.uid,
            name: row.name,
            info: row.info
          }
          this.showEditRoleDialog = true
        },
        //保存修改表单
        saveEdit: function () {
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.isEditingForm = true;
              axios.post(roleEditUrl, this.editForm).then(res => {
                this.isEditingForm = false;
                if (res.data.status) {
                  this.$message({
                    message: res.data.message,
                    type: 'success'
                  })
                  this.showEditRoleDialog = false
                }
                else {
                  this.$alert(res.data.message, '提示')
                }
              }).catch(err => {
                this.$alert(err, '提示')
                this.isEditingForm = false;
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        //关闭修改表单
        closeEdit: function () {
          this.showEditRoleDialog = false;
        },
        //保存设置角色成员
        saveSetRoleMember: function() {
          let arr = []
          this.checkedRoleMember.forEach(item=> {
            arr.push(item.uid)
          })
          this.loadingSetRoleMember = true
          axios.post(setRoleMemberUrl, {
            role: this.selectedRows[0].uid,
            member: arr
          }).then(res=> {
            if(res.data.status) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.showSetRoleMember = false
            }
            else {
              this.$alert(res.data.message, '提示')
            }
            this.loadingSetRoleMember = false
          }).catch(err=> {
            this.$alert(err, '提示')
            this.loadingSetRoleMember = false
          })
        },
        //关闭设置角色成员
        closeSetRoleMember: function () {
          this.showSetRoleMember = false
          this.checkedRoleMember = []
        },
        //单个用户删除
        handleDelete: function (index, row) {
          let list = []
          list.push(row.uid)
          this.$confirm('确认删除该用户?', '提示').then(() => {
            axios.post(roleDelete, list).then((res) => {
              if (res.data.status) {
                //更新用户列表
                this.getRoleList()
                this.$message({
                  message: res.data.message,
                  type: 'success'
                })
              }
              else {
                this.$alert(res.data.message, '提示')
              }
            }).catch(err => {
              this.$alert(err, '错误')
            })
          }).catch()
        },
        //单个用户 启用/禁用
        handleStatus: function (index, row) {
          axios.post(roleStatus, {
            number: row.uid,
            status: row.status
          }).then((res) => {
            if(res.data.status) {
              this.$message({
                message: res.data.message,
                type: 'success'
              })
            }
            else {
              this.$alert(res.data.message, '提示')
            }
          }).catch(err => {
            this.$alert(err, '错误')
          })
        },
        //访问过滤
        handleAccess: function (type) {
          switch (type) {
            case 'time':
              this.isAddingAccessTime = false
              axios.post(accessTimeGetUrl, this.selectedRows[0].uid).then(res=> {
                if(res.data.status) {
                  this.accessTimeList = JSON.parse(res.data.data).concat()
                  this.showTimeAccess = true
                }
                else {
                  this.$alert(res.data.message, '提示')
                }
              }).catch(err => {
                this.$alert(err, '提示')
              })
              break
            case 'ip':
              break
          }
        },
        //添加禁止访问时段
        handleAddAccessTime: function () {
          this.isAddingAccessTime = true
          axios.post(addAccessTimeUrl, {
            role: this.selectedRows[0].uid,
            weekday: this.accessDialogActive,
            time: this.currentAccessTime
          }).then(res=> {
            if(res.data.status) {
              this.$message({
                message: res.data.message, 
                type: 'success'
              })
              //更新访问时段列表
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
          axios.post(delAccessTimeUrl, {
            //send data
          }).then(res=> {
            if(res.data.status) {
              this.$message({
                message: res.data.message,
                type: 'success'
              })
            }
            else {
              this.$alert(res.data.message, '提示')
            };
          }).catch(err=> {
            this.$alert(err, '提示')
          })
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
            this.isUpdatingRight = false
            if(res.data.status) {
              this.$message({
                message: res.data.message,
                type: 'success'
              })
              this.showRightsManagement = false
            }
            else {
              this.$alert(res.data.message, '提示')
            };
          }).catch(err => {
            this.$alert(err, '提示')
            this.isUpdatingRight = false
          })
        },
        //获取用户列表
        getRoleList: function () {
          axios.post(roleListGetUrl, {
            keyword: this.keyword
          }).then((res) => {
            if (res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.roleList = _data
              this.selectedRows = []
              // console.log(this.roleList)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch((err) => {
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        /**
         * 获取角色成员组
         * edit by lanw 2018-4-12 增加参数 适用设置角色成员
         * @param loadingControl 控制加载状态变量名称
         * @param showControl 控制对话框显示变量名称
         */
        getRoleMemberList: function(loadingControl, showControl) { 
          this[loadingControl] = true
          this.roleMemberList = []
          axios.post(roleMemberListUrl, {
            uid: this.selectedRows[0].uid
          }).then(res=> {
            if(res.data.status) {
              this.roleMemberList = JSON.parse(res.data.data).concat()
              this[showControl] = true
              if(showControl == 'showSetRoleMember') {
                this.checkedRoleMember = this.roleMemberList.concat()
              }
            }
            else {
              this.$alert(res.data.message, '提示')
            }
            this[loadingControl] = false
          }).catch(err=> {
            this.$alert(err, '提示')
            this[loadingControl] = false
          })
        },
        //获取公司列表
        getCompanyList: function() {
          axios.post(treeDataGetUrl).then(res=> {
            if(res.data.status) {
              this.companyList = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        //获取部门列表
        getDepartmentList: function(obj) {
          axios.post(departmentGetUrl, obj).then(res=> {
            if(res.data.status) {
              this.departmentList = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        //获取用户列表
        getUserList: function(obj) {
          axios.post(departmentMemberGetUrl, obj).then(res=> {
            if(res.data.status) {
              this.userList = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        //设置成员 触发事件 department-change, search
        setMemberGetUser: function(data) {
          this.getUserList(data)
        },
        //设置成员 触发事件 company-change
        setMemberCompanyChange: function(data) {
          this.getDepartmentList(data)
        },
        
      },
      created: function () {
        this.getRoleList()
      },
    })
  }
  that.init = (
    treeDataGetUrl,
    departmentGetUrl,
    roleListGetUrl,
    roleStatus,
    roleDelete,
    roleAddUrl,
    roleEditUrl,
    addAccessTimeUrl,
    delAccessTimeUrl,
    accessTimeGetUrl,
    getSystemModulesUrl,
    getSystemButtonViewUrl,
    getSystemOtherRightsUrl,
    updateSystemRightsUrl,
    roleMemberListUrl,
    departmentMemberGetUrl,
    setRoleMemberUrl) => {
    _this.init(
      treeDataGetUrl,
      departmentGetUrl,
      roleListGetUrl,
      roleStatus,
      roleDelete,
      roleAddUrl,
      roleEditUrl,
      addAccessTimeUrl,
      delAccessTimeUrl,
      accessTimeGetUrl,
      getSystemModulesUrl,
      getSystemButtonViewUrl,
      getSystemOtherRightsUrl,
      updateSystemRightsUrl,
      roleMemberListUrl,
      departmentMemberGetUrl,
      setRoleMemberUrl)
  }
  return that
}
