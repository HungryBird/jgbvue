JGBVue = {
	module: {}
};

JGBVue.module.departmentManagement = ()=> {
	let _this = {}
	,that = {};

	_this.init = (treeDataGetUrl, tableDataUrl, deteleDataUrl, saveAddUrl, saveEditUrl)=> {
		new Vue({
			el: '#app',
			data: {
				treeData: [],
				currentNodeNumber: '',
				searchForm: {
					searchValue: ''
				},
				data: {
					characterOptions: [],
					parentDepartmentOptions: [],
					table: []
				},
				defaultProps: {
					label: 'label',
					children: 'children'
				},
				selectedRows: [],
				addDialogVisiable: false,
				currentCompany: '',
				currentDepartment: '',
				addForm: {
					name: '',
					number: '',
					shortNmae: '',
					character: '',
					parentDepartment: '',
					principal: '',
					phoneNumber: '',
					telephone: '',
					email: '',
					fax: '',
					remark: ''
				},
				editDialogVisiable: false,
				editForm: {
					name: '',
					number: '',
					shortNmae: '',
					character: '',
					parentDepartment: '',
					principal: '',
					phoneNumber: '',
					telephone: '',
					email: '',
					fax: '',
					remark: ''
				},
				formRules: {
					name: [
						{required: true, message: '请输入部门名称'}
					],
					number: [
						{required: true, message: '请选择部门编号'}
					],
					character: [
						{required: true, message: '请选择部门性质'}
					]
				},
				tradeOptions: [
					{
						"value": "opt1",
						"label": "行业1"
					},
					{
						"value": "opt2",
						"label": "行业2"
					},
					{
						"value": "opt3",
						"label": "行业3"
					}
				],
			},
			mounted() {
				let _self = this;
				axios.get(treeDataGetUrl).then((res)=> {
					if(res.data.status) {
						let jdata = JSON.parse(res.data.data);
						this.treeData = jdata;
					};
					this.currentCompany = this.treeData[0].label;
				}).catch((err)=> {
					console.log('err', err);
				})
			},
			methods: {
				add() {
					let _self = this;
					this.addDialogVisiable = true;
				},
				edit() {
					axios.post('/departmentManagement/data_edit_get', this.selectedRows).then((res)=> {
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
				search() {
					//
				},
				handleNodeClick(obj, node, self) {
					if(obj.children) {
						this.currentCompany = obj.label;
						this.currentDepartment = '';
					}else{
						this.currentDepartment = obj.label;
					}
					if(this.currentNode === obj.number) {
						return;
					}
					let _self = this;
					if(obj.children === undefined) {
						this.currentNode = obj.number;
						axios.post('/departmentManagement/data_table_get', obj).then((res)=> {
							if(res.data.status) {
								let jdata = JSON.parse(res.data.data);
								this.data.table.splice(0, _self.data.table.length);
								this.data.characterOptions.splice(0, _self.data.characterOptions.length);
								this.data.parentDepartmentOptions.splice(0, _self.data.parentDepartmentOptions.length);
								jdata.table.forEach((item)=> {
									_self.data.table.push(item);
								});
								jdata.characterOptions.forEach((item)=> {
									_self.data.characterOptions.push(item);
								});
								jdata.parentDepartmentOptions.forEach((item)=> {
									_self.data.parentDepartmentOptions.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				rowClick(row) {
					let _self = this;
					this.$refs.departmentTable.toggleRowSelection(row);
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
                handleEdit(index, row) {
                    let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    this.$refs.departmentTable.clearSelection();
                    this.edit();
                },
                handleDelete(index, row) {
                    let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    this.$refs.departmentTable.clearSelection();
                    this.remove();
                },
				departmentTable() {
					//
				},
				saveAdd(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveAddUrl, this.addForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.addDialogVisiable = false;
									this.$message({
										type: 'success',
										message: res.data.message
									})
								}
							})
						}else{
							return false;
						}
					})
				},
				closeAdd() {

				},
				saveEdit(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveEditUrl, this.editForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.addDialogVisiable = false;
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.editDialogVisiable = false;
								}
							})
						}else{
							return false;
						}
					})
				},
				closeEdit() {
					this.editDialogVisiable = false;
				}
			}
		})
	}

	that.init = (treeDataGetUrl, tableDataUrl, deteleDataUrl, saveAddUrl, saveEditUrl)=> {
		_this.init(treeDataGetUrl, tableDataUrl, deteleDataUrl, saveAddUrl, saveEditUrl);
	}

	return that;
}