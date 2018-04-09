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

	_this.init = (treeDataUrl, dataTableUrl, editDataUrl, deteleDataUrl, permissionBtnUrl, permissionColUrl, handleMenuUrl, handleUnfoldUrl, handlePubliUrl, handleValidUrl, addStep2Delete, addStep3Delete, editStep2Delete, editStep3Delete, saveAddUrl, saveEditUrl)=> {
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
				addDialogVisiable: false,
				editDialogVisiable: false,
				addStep: 0,
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
						url: '',
						checkboxes: [],
						describe: ''
					},
					step2: [],
					step3: []
				},
				editForm: {
					form1: {
						number: '',
						name: '',
						sort: '',
						parentLevel: '',
						target: '',
						url: '',
						checkboxes: [],
						describe: ''
					},
					step2: [],
					step3: []
				},
				/**
				 * 添加步骤1暂存上级数据
				 * @type {String}
				 */
				addParentLevelLabel: '',
				editParentLevelLabel: '',
				/**
				 * 添加步骤2暂存table数据
				 * @type {Array}
				 */
				addStep2Table: [],
				addStep3Table: [],
				editStep2Table: [],
				editStep3Table: [],
				/**
				 * 添加步骤2新增模态窗口
				 * @type {Boolean}
				 */
				addStep2AddDialogVisiable: false,
				addStep2EditDialogVisiable: false,
				addStep3AddDialogVisiable: false,
				addStep3EditDialogVisiable: false,
				editStep2AddDialogVisiable: false,
				editStep2EditDialogVisiable: false,
				editStep3AddDialogVisiable: false,
				editStep3EditDialogVisiable: false,
				/**
				 * 添加-步骤2-添加模态框表单数据
				 * @type {Object}
				 */
				addStep2AddForm: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					address: ''
				},
				addStep3AddForm: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					describe: ''
				},
				editStep2AddForm: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					address: ''
				},
				editStep3AddForm: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					describe: ''
				},
				/**
				 * 添加-步骤2-已经添加的按钮数组
				 * @type {Array}
				 */
				addStep2AddedBtns: [],
				addStep3AddedBtns: [],
				editForm: {
					form1: {
						number: '',
						name: '',
						sort: '',
						parentLevel: '',
						target: '',
						checkboxes: [],
						describe: ''
					},
					step2: [],
					step3: []
				},
				/**
				 * 添加-步骤2-table-选中的行
				 * @type {String}
				 */
				addStep2TableCurrent: null,
				addStep3TableCurrent: null,
				editStep2TableCurrent: null,
				editStep3TableCurrent: null,
				/**
				 * 添加-步骤2-table-编辑-表单
				 * @type {Object}
				 */
				addStep2EditForm: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					address: ''
				},
				addStep3EditForm: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					describe: ''
				},
				editStep2EditForm: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					address: ''
				},
				editStep3EditForm: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					describe: ''
				},
				/**
				 * 添加-步骤2-table-编辑-表单-缓存
				 * @type {Object}
				 */
				addStep2EditFormCache: {},
				addStep3EditFormCache: {},
				editStep2EditFormCache: {},
				editStep3EditFormCache: {},
				editStep2Form: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					address: ''
				},
				editStep3Form: {
					parentLevel: '',
					name: '',
					number: '',
					sort: '',
					describe: ''
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
				addShow: false,
				editShow: false,
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
					axios.post(dataTableUrl, obj).then((res)=> {
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
				edit() {
					let _self = this;
					axios.post(editDataUrl, this.selectedRows).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.editForm = jdata;
							this.editStep2Table.splice(0, _self.editStep2Table.length);
							jdata.step2.forEach((item)=> {
								_self.editStep2Table.push(item);
							})
							this.editStep3Table.splice(0, _self.editStep3Table.length);
							jdata.step3.forEach((item)=> {
								_self.editStep3Table.push(item);
							})
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
				addDropDownNodeClick(node) {
					this.addForm.form1.ParentLevel = node.id;
					this.addParentLevelLabel = node.name;
					this.addShow = !this.addShow;
				},
				editDropDownNodeClick(node) {
					this.editForm.form1.ParentLevel = node.id;
					this.editParentLevelLabel = node.name;
					this.editShow = !this.editShow;
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
					}else{
						this.addStep++;
					}
				},
				editNext() {
					if(this.editStep === 0) {
						this.$refs['editForm1'].validate((valid) => {
							if (valid) {
								this.editStep++;
							} else {
								return false;
							}
						});
					}else{
						this.editStep++;
					}
				},
				addStep2AddFormClick() {
					this.addStep2AddDialogVisiable = true;
				},
				editStep2AddFormClick() {
					this.editStep2AddDialogVisiable = true;
				},
				addStep3AddFormClick() {
					this.addStep3AddDialogVisiable = true;
				},
				editStep3AddFormClick() {
					this.editStep3AddDialogVisiable = true;
				},
				addStep2EditFormClick() {
					let _self = this;
					for(let key in _self.addStep2TableCurrent) {
						_self.addStep2EditFormCache[key] = _self.addStep2TableCurrent[key];
					}
					this.addStep2EditForm = this.addStep2TableCurrent;
					this.addStep2EditDialogVisiable = true;
				},
				addStep3EditFormClick() {
					let _self = this;
					for(key in _self.addStep3TableCurrent) {
						_self.addStep3EditFormCache[key] = _self.addStep3TableCurrent[key];
					}
					this.addStep3EditForm = this.addStep3TableCurrent;
					this.addStep3EditDialogVisiable = true;
				},
				editStep2EditFormClick() {
					let _self = this;
					console.log('editStep2TableCurrent: ', this.editStep2TableCurrent);
					for(let key in _self.editStep2TableCurrent) {
						_self.editStep2EditFormCache[key] = _self.editStep2TableCurrent[key];
					}
					this.editStep2EditForm = this.editStep2TableCurrent;
					this.editStep2EditDialogVisiable = true;
				},
				editStep3EditFormClick() {
					let _self = this;
					for(key in _self.editStep3TableCurrent) {
						_self.editStep3EditFormCache[key] = _self.editStep3TableCurrent[key];
					}
					this.editStep3EditForm = this.editStep3TableCurrent;
					this.editStep3EditDialogVisiable = true;
				},
				addRemoveStep2AddForm() {
					let _self = this;
					this.addStep2Table.splice(_self.addStep2Table.indexOf(_self.addStep2TableCurrent), 1);
				},
				editRemoveStep2AddForm() {
					let _self = this;
					this.editStep2Table.splice(_self.editStep2Table.indexOf(_self.editStep2TableCurrent), 1);
				},
				addRemoveStep3AddForm() {
					let _self = this;
					this.addStep3Table.splice(_self.addStep3Table.indexOf(_self.addStep3TableCurrent), 1);
				},
				editRemoveStep3AddForm() {
					let _self = this;
					this.editStep3Table.splice(_self.editStep3Table.indexOf(_self.editStep3TableCurrent), 1);
				},
				addSaveAddStep2() {
					let _self = this;
					this.$refs['addStep2AddFormRef'].validate((valid) => {
						if (valid) {
							let obj = {};
							for(key in _self.addStep2AddForm) {
								obj[key] = _self.addStep2AddForm[key]
							}
							this.addStep2Table.push(obj);
							this.$refs['addStep2AddFormRef'].resetFields()
							this.addStep2AddDialogVisiable = false;
						} else {
							return false;
						}
					});
				},
				editSaveAddStep2() {
					let _self = this;
					this.$refs['editStep2AddFormRef'].validate((valid) => {
						if (valid) {
							let obj = {};
							for(key in _self.editStep2AddForm) {
								obj[key] = _self.editStep2AddForm[key]
							}
							this.editStep2Table.push(obj);
							this.$refs['editStep2AddFormRef'].resetFields()
							this.editStep2AddDialogVisiable = false;
						} else {
							return false;
						}
					});
				},
				addSaveAddStep3() {
					let _self = this;
					this.$refs['addStep3AddFormRef'].validate((valid) => {
						if (valid) {
							let obj = {};
							for(key in _self.addStep3AddForm) {
								obj[key] = _self.addStep3AddForm[key]
							}
							this.addStep3Table.push(obj);
							this.$refs['addStep3AddFormRef'].resetFields()
							this.addStep3AddDialogVisiable = false;
						} else {
							return false;
						}
					});
				},
				editSaveAddStep3() {
					let _self = this;
					this.$refs['editStep3AddFormRef'].validate((valid) => {
						if (valid) {
							let obj = {};
							for(key in _self.editStep3AddForm) {
								obj[key] = _self.editStep3AddForm[key]
							}
							this.editStep3Table.push(obj);
							this.$refs['editStep3AddFormRef'].resetFields()
							this.editStep3AddDialogVisiable = false;
						} else {
							return false;
						}
					});
				},
				addStep2EditFormCancel() {
					let _self = this;
					let index = this.addStep2Table.indexOf(_self.addStep2TableCurrent);
					this.addStep2Table.splice(index, 1, _self.addStep2EditFormCache);
					this.addStep2EditDialogVisiable = false;
				},
				editStep2EditFormCancel() {
					let _self = this;
					let index = this.editStep2Table.indexOf(_self.editStep2TableCurrent);
					this.editStep2Table.splice(index, 1, _self.editStep2EditFormCache);
					this.editStep2EditDialogVisiable = false;
				},
				addStep3EditFormCancel() {
					let _self = this;
					let index = this.addStep3Table.indexOf(_self.addStep3TableCurrent);
					this.addStep3Table.splice(index, 1, _self.addStep3EditFormCache);
					this.addStep3EditDialogVisiable = false;
				},
				editStep3EditFormCancel() {
					let _self = this;
					let index = this.editStep3Table.indexOf(_self.editStep3TableCurrent);
					this.editStep3Table.splice(index, 1, _self.editStep3EditFormCache);
					this.editStep3EditDialogVisiable = false;
				},
				addStep2TableSetCurrent(row) {
					this.addStep2TableCurrent = row;
				},
				editStep2TableSetCurrent(row) {
					this.editStep2TableCurrent = row;
				},
				addStep3TableSetCurrent(row) {
					this.addStep3TableCurrent = row;
				},
				editStep3TableSetCurrent(row) {
					this.editStep3TableCurrent = row;
				},
				saveAdd() {
					let _self = this;
					this.addStep2Table.forEach((item)=> {
						_self.addForm.step2.push(item);
					});
					this.addStep3Table.forEach((item)=> {
						_self.addForm.step3.push(item);
					});
					this.$refs['addForm1'].validate((valid) => {
						if (valid) {
							axios.post(saveAddUrl, this.addForm).then((res)=> {
								if(res.data.status) {
									this.$message({
										type: 'success',
										message: res.data.message
									});
									this.addDialogVisiable = false;
									this.addStep = 0;
									/**
									 * 清空addForm
									 */
									this.$refs['addForm1'].resetFields();
									this.addForm.step2 = [];
									this.addForm.step3 = [];
									/**
									 * 清空dialog的table
									 */
									this.addStep2Table.splice(0, _self.addStep2Table.length);
									this.addStep3Table.splice(0, _self.addStep3Table.length);

									console.log(this.addForm)
								}
							}).catch((err)=> {
								console.log('err: ', err);
							})
						} else {
							return false;
						}
					});
				},
				saveEdit() {
					let _self = this;
					this.editStep2Table.forEach((item)=> {
						_self.editForm.step2.push(item);
					});
					this.editStep3Table.forEach((item)=> {
						_self.editForm.step3.push(item);
					});
					this.$refs['editForm1'].validate((valid) => {
						if(valid) {
							axios.post(saveEditUrl, this.editForm).then((res)=> {
								if(res.data.status) {
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.editDialogVisiable = false;
									this.editStep = 0;
									this.$refs['editForm1'].resetFields();
									this.editForm.step2 = [];
									this.editForm.step3 = [];
									/**
									 * 清空dialog的table
									 */
									this.editStep2Table.splice(0, _self.editStep2Table.length);
									this.editStep3Table.splice(0, _self.editStep3Table.length);
									this.editStep2TableCurrent = null;
									this.editStep3TableCurrent = null;
								}
								this.editDialogVisiable = false;
							}).catch((err)=> {
								console.log('err: ', err);
							})
						}else{
							return false;
						}
					})
				}
			},
			watch: {
				editDialogVisiable(visiable) {
					if(!visiable) {
						this.editStep2TableCurrent = null;
						this.editStep2TableCurrent = null;
						this.editStep3TableCurrent = null;
						this.editStep3TableCurrent = null;
					}
				}
			}
		})
	}

	that.init = (treeDataUrl, dataTableUrl, editDataUrl, deteleDataUrl, permissionBtnUrl, permissionColUrl, handleMenuUrl, handleUnfoldUrl, handlePubliUrl, handleValidUrl, addStep2Delete, addStep3Delete, editStep2Delete, editStep3Delete, saveAddUrl, saveEditUrl)=> {
		_this.init(treeDataUrl, dataTableUrl, editDataUrl, deteleDataUrl, permissionBtnUrl, permissionColUrl, handleMenuUrl, handleUnfoldUrl, handlePubliUrl, handleValidUrl, addStep2Delete, addStep3Delete,  editStep2Delete, editStep3Delete, saveAddUrl, saveEditUrl);
	}

	return that;
}