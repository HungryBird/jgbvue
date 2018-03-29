/**
 * created by lanw 2018-03-28
 * 用户管理
 */
JGBVue = {
  module: {}
}

JGBVue.module.userManagement = ()=>{
  let _this = {},that = {}
  _this.init = (treeDataGetUrl, departmentGetUrl, userListGetUrl)=> {
    that.vm = new Vue({
      el: '#app',
      data: function() {
        return {
          treeData: [], //el-tree 公司列
          defaultProps: {
            label: 'label',
            children: 'children'
          },
          currentCompany: '',//当前公司
          currentNode: '', //当前公司
          currentDepartmentList: [], //当前公司部门列表
          currentDepartment: '', //当前部门
          currentAccess: '',//当前访问过滤类型
          defaultExpandedKeys: [], //默认展开公司
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
            position: {
              label: '',
              value: ''
            },
            department: {
              label: '',
              value: ''
            },
            status: '',
            birthday: '',
            email: '',
            QQ: '',
            wx: '',
            remark: ''
          },
          formRules: {},
          currentPositionList: [],//当前部门对应职位列表
        }
      },
      methods: {
        /**
         * 树形节点控制
         * @param {*} obj 
         * @param {*} node 
         * @param {*} self 
         */
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
          this.showAddUserDialog = true;
        },
        //删除
        btnRemove: function() {
          this.$confirm('是否删除选中用户?', '提示').then(()=> {
            //ajax
          }).catch(()=>{
            //ajax
          });
        },
        //禁用
        btnDisabled: function() {
          this.$confirm('是否禁用选中用户?', '提示').then(()=> {
            //ajax
          }).catch(()=>{
            //ajax
          });
        },
        //启用
        btnEnable: function() {
          this.$confirm('是否启用选中用户?', '提示').then(()=> {
            //ajax
          }).catch(()=>{
            //ajax
          });
        },
        //导出
        btnExport: function() {},
        //重置密码
        btnReset: function() {
          this.$confirm('是否重置选中用户密码?', '提示').then(()=> {
            //ajax
            this.$alert('账户密码重置到默认密码：123456', '提示')
          }).catch(()=>{
            //ajax
          });
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
        selectItem: function(selection, row) {
          let _self = this;
          this.selectedRows.splice(0, _self.selectedRows.length);
          for(let i = 0; i < selection.length; i++) {
            _self.selectedRows.push(selection[i]);
          }
        },
        handleEdit: function(index, row) {},
        handleDelete: function(index, row) {},
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
              console.log(this.userList)
            };
          }).catch((err)=> {
            console.log('err', err);
          })
        },
        //用户状态切换
        editUserStatus: function(row, status) {
          this.userList[row].status = !status
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
  that.init = (treeDataGetUrl, 
    departmentGetUrl, 
    userListGetUrl)=> {
    _this.init(treeDataGetUrl, 
      departmentGetUrl, 
      userListGetUrl)
  }
  return that
}
