JGBVue = {
	module: {}
};

JGBVue.module.menuManagement = ()=> {
	const _this = {}
	,that = {};

	/**
	 * 约定的页面nav全部按钮标识
	 * @type {Array}
	 */
	const buttonList = ['per_add_btn', 'per_edit_btn', 'per_remove_btn', 'per_hide_btn'];
	/**
	 * 约定的页面列表列全部标识
	 * @type {Array}
	 */
	const columnList = ['per_number_col', 'per_opera_col', 'per_add_col', 'per_target_col', 'per_menu_col', 'per_unfold_col', 'per_public_col', 'per_menu_col', 'per_valid_col', 'per_describe_col', 'per_hide_col'];

	_this.init = (treeDataUrl, editDataUrl, deteleDataUrl, permissionBtnUrl, permissionColUrl, handleMenuUrl, handleUnfoldUrl, handlePubliUrl, handleValidUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data: {
				treeData: [],
				defaultProps: {
					label: 'name',
					children: 'children'
				},
				searchForm: {
					searchValue: ''
				},
				selectedRows: [],
				selectedAddStep2Rows: [],
				selectedAddStep3Rows: [],
				data: {
					table: []
				},
				currentModule: '功能信息',
				currentFunction: '未选择功能',
				currentNode: '',
				table: {
					menu: ''
				},
				permission: {
					buttonList: [],
					columnList: []
				},
				loading: false,
				addDialogVisiable: true,
				editDialogVisiable: false,
				addStep: 1,
				editStep: 0,
				/**
				 * 添加按钮三步数据
				 * @type {Object}
				 */
				addForm: {
					form1: {
						number: '',
						name: '',
						sort: '',
						parentLevel: '',
						target: '',
						checkboxes: [],
						textarea: ''
					},
					step2: [],
					step3: []
				},
				/**
				 * 添加步骤1暂存上级数据
				 * @type {String}
				 */
				addParentLevelLabel: '',
				/**
				 * 添加步骤2暂存table数据
				 * @type {Array}
				 */
				addStep2Table: [],
				editStep2Table: [],
				/**
				 * 添加步骤2新增模态窗口
				 * @type {Boolean}
				 */
				addStep2AddDialogVisiable: false,
				addStep2EditDialogVisiable: false,
				/**
				 * 添加-步骤2-添加模态框表单数据
				 * @type {Object}
				 */
				addStep2Form: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					address: ''
				},
				/**
				 * 添加-步骤2-已经添加的按钮数组
				 * @type {Array}
				 */
				addStep2AddedBtns: [],
				editForm: {
					form1: {
						number: '',
						name: '',
						sort: '',
						parentLevel: '',
						target: '',
						checkboxes: [],
						textarea: ''
					},
					step2: [],
					step3: []
				},
				editStep2Form: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					address: ''
				},
				formRules: {
					number: [
						{required: true, message: '请输入编号'}
					],
					name: [
						{required: true, message: '请输入名称'}
					],
					target: [
						{required: true, message: '请输入目标'}
					],
					sort: [
						{required: true, message: '请输入排序'}
					]
				},
				show: false,
				checkboxes: [
					{
						name: '菜单',
						value: 'menu'
					},
					{
						name: '展开',
						value: 'unfold'
					},
					{
						name: '公共',
						value: 'public'
					},
					{
						name: '有效',
						value: 'valid'
					}
				]
			},
			mounted() {
				const _self = this;
				/**
				 * 获取树数据
				 * @param  {[type]} treeDataUrl).then((res) [description]
				 * @return {[type]}                         [description]
				 */
				axios.get(treeDataUrl).then((res)=> {
					if(res.data.status) {
						let jdata = JSON.parse(res.data.data);
						this.treeData = jdata;
						jdata.forEach((item)=> {
							_self.data.table.push(item);
						});
					}
				}).catch((err)=> {
					console.log('err: ', err);
				});
				/**
				 * 获取按钮权限
				 * @param  {[type]} permissionBtnUrl).then((res [description]
				 * @return {[type]}                             [description]
				 */
				axios.get(permissionBtnUrl).then((res)=> {
					if(res.data.status) {
						res.data.data.forEach((item)=> {
							if(buttonList.indexOf(item) !== -1) {
								_self.permission.buttonList.push(item);
							}
						})
					}
				})
				/**
				 * 获取列表权限
				 * @param  {[type]} permissionColUrl).then((res [description]
				 * @return {[type]}                             [description]
				 */
				axios.get(permissionColUrl).then((res)=> {
					if(res.data.status) {
						res.data.data.forEach((item)=> {
							if(columnList.indexOf(item) !== -1) {
								_self.permission.columnList.push(item);
							}
						})
					}
				})
			},
			methods: {
				handleNodeClick(obj, node, self) {
					if(obj.children) {
						this.currentModule = obj.name;
						this.currentFunction = '';
					}else{
						this.currentFunction = obj.name;
					}
					if(this.currentNode === obj.id) {
						return;
					}
					let _self = this;
					if(obj.children === undefined) {
						return;
					}
					this.currentNode = obj.id;
					axios.post('/menuManagement/data_table_get', obj).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.data.table.splice(0, _self.data.table.length);
							jdata.forEach((item)=> {
								_self.data.table.push(item);
							});
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				search() {
					//
				},
				add() {
					//
				},
				edit() {
					axios.post('/menuManagement/data_edit_get', this.selectedRows).then((res)=> {
						if(res.data.status) {
							this.editForm = JSON.parse(res.data.data);
							this.editDialogVisiable = true;
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				remove() {
					let _self = this;
					this.$confirm('确定删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: function(action, instance, done) {
                            done(action);
                        }
                    }).then((action)=> {
                        if(action == 'confirm') {
                            axios.post(deteleDataUrl, this.selectedRows).then((res)=> {
                                if(res.data.status) {
                                    this.$message({
                                        type: 'success',
                                        message: res.data.message
                                    });
                                }
                            }).catch(function(err) {
                                _self.$message({
                                    type: 'error',
                                    message: res.data.message || err
                                });
                            })
                        }
                    }).catch(() => {
                       this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
				},
				rowClick(row, event, column) {
					let _self = this;
					this.$refs.mmTable.toggleRowSelection(row);
					if(_self.selectedRows.indexOf(row) == -1) {
						_self.selectedRows.push(row)
					}else{
						_self.selectedRows.splice(_self.selectedRows.indexOf(row), 1);
					}
				},
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
				selectItem(selection, row) {
					let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    for(let i = 0; i < selection.length; i++) {
                        _self.selectedRows.push(selection[i]);
                    }
				},
				handleEdit() {
					let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    this.$refs.mmTable.clearSelection();
                    this.edit();
				},
				handleDelete() {
					let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    this.$refs.mmTable.clearSelection();
                    this.remove();
				},
				handleMenu(index, row) {
					axios.post(handleMenuUrl, row).then((res)=> {
						this.loading = true;
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							})
							this.loading = false;
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				handleUnfold(index, row) {
					axios.post(handleUnfoldUrl, row).then((res)=> {
						this.loading = true;
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							})
							this.loading = false;
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				handlePublic(index, row) {
					axios.post(handlePubliUrl, row).then((res)=> {
						this.loading = true;
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							})
							this.loading = false;
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				handleValid(index, row) {
					axios.post(handleValidUrl, row).then((res)=> {
						this.loading = true;
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							})
							this.loading = false;
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				dropDownNodeClick(node) {
					this.parentLevel = node.id;
					this.parentLevelLabel = node.name;
					this.show = !this.show;
				},
				addNext() {
					if(this.addStep === 0) {
						this.$refs['addForm1'].validate((valid) => {
							if (valid) {
								this.addStep++;
							} else {
								return false;
							}
						});
					}
					this.addStep++;
				},
				addStep2AddForm() {
					this.addStep2AddDialogVisiable = true;
				},
				editStep2AddForm() {
					//
				},
				removeStep2AddForm() {
					//
				},
				saveAddStep2() {
					let _self = this;
					this.$refs['addStep2Form'].validate((valid) => {
						if (valid) {
							let arr = [];
							for(key in _self.addStep2Form) {
								arr[key] = _self.addStep2Form[key];
							}
							this.addStep2Table.push(arr);
							this.$refs['addStep2Form'].resetFields()
							this.addStep2AddDialogVisiable = false;
						} else {
							return false;
						}
					});
				},
				saveEditStep2() {
					//
				}
			}
		})
	}

	that.init = (treeDataUrl, editDataUrl, deteleDataUrl, permissionBtnUrl, permissionColUrl, handleMenuUrl, handleUnfoldUrl, handlePubliUrl, handleValidUrl)=> {
		_this.init(treeDataUrl, editDataUrl, deteleDataUrl, permissionBtnUrl, permissionColUrl, handleMenuUrl, handleUnfoldUrl, handlePubliUrl, handleValidUrl);
	}

	return that;
}