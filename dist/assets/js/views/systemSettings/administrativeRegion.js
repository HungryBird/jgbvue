JGBVue = {
	module: {}
};

JGBVue.module.administrativeRegion = ()=> {
	let _this = {}
	,that = {};

	_this.init = (getDataInitUrl, lazyUrl, addUrl, editUrl, deteleUrl)=> {
		new Vue({
			el: '#app',
			data: {
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'label',
					isLeaf: 'leaf'
				},
				searchInputVal: '',
				tableData: [],
				selectedRows: [],
				/**
				 * 提交表单
				 * [规定addForm.addFormData.number为001时正确，002已存在, 其他格式错误]
				 * @type {Object}
				 */
				addForm: {
					visible: false,
					checked: true,
					addFormData: {
						number: '',
						name: '',
						level: 1,
						notes: ''
					},
					rules: {
						number: [
							{
								required: true,
								message: '请输入编号'
							}
						],
						label: [
							{
								required: true,
								message: '请输入名称'
							}
						],
						level: [
							{
								required: true,
								message: '请输入级别'
							}
						],
						notes: [
							{}
						]
					}
				},
				editForm: {
					visible: false,
					checked: true,
					editFormData: {
						number: '',
						name: '',
						level: 1,
						notes: ''
					},
					rules: {
						number: [
							{
								required: true,
								message: '请输入编号'
							}
						],
						name: [
							{
								required: true,
								message: '请输入名称'
							}
						],
						level: [
							{
								required: true,
								message: '请输入级别'
							}
						],
						notes: [
							{}
						]
					}
				},
			},
			mounted() {
				//pass
			},
			methods: {
				getInit() {
					window.location.reload();
				},
				loadNode(node, resolve) {
					let _self = this;
					/**
					 * 加载页面时自动获取level为0的数据
					 * @param  {[type]} node.level [description]
					 * @return {[type]}            [description]
					 */
					if(node.level === 0) {
						axios.get(getDataInitUrl).then((req)=> {
							let jdata = JSON.parse(req.data.data);
							jdata.forEach((item)=> {
								let obj = {};
								for(key in item) {
									obj[key] = item[key];
								}
								_self.tableData.push(obj);
							});
							_self.treeData = jdata;
							return resolve(jdata);
						})
					};
					/**
					 * 规定最大level === 4 || node.isLeaf
					 * @param  {[type]} node.level >             3 [description]
					 * @return {[type]}            [description]
					 */
					if(node.level > 3 || node.isLeaf) {
						return resolve([]);
					};
					/**
					 * 每次点击请求数据
					 */
					if(node.level <= 3 && !node.isLeaf) {
						this.tableData.splice(0, this.tableData.length);
						axios.post(lazyUrl, node.data).then((req)=> {
							let jdata = JSON.parse(req.data.data);
							jdata.forEach((item)=> {
								let obj = {};
								for(key in item) {
									obj[key] = item[key];
								}
							});
							return resolve(jdata);
						});
					}
				},
				handleNodeClick(data,node,cmp) {
					let _self = this;
					if(node.isLeaf) return;
					this.tableData.splice(0, this.tableData.length);
					axios.post(lazyUrl, node.data).then((req)=> {
						let jdata = JSON.parse(req.data.data);
						jdata.forEach((item)=> {
							let obj = {};
							for(key in item) {
								obj[key] = item[key];
							}
							_self.tableData.push(obj);
						});
					});
				},
				rowClick(row, event, column) {
					let _self = this;
					this.$refs.multipleTable.toggleRowSelection(row);
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
				addRegin() {
					this.addForm.visible = true;
				},
				onSubmitAdd(formName) {
					let _self = this;
					this.$refs[formName].validate((valid) => {
						console.log('valid', valid);
						if(valid) {
							axios.post(addUrl, _self.addForm.addFormData).then(function(req) {
								if(req.data.status) {
									if(_self.addForm.checked) {
										_self.addForm.visible = false;
									}
									_self.$message({
										message: req.data.message,
										type: 'success'
									});
								}else{
									_self.$message({
										message: req.data.message,
										type: 'error'
									});
								}
							}).catch(function(err) {
								_self.$message({
									message: req.data.message,
									type: 'error'
								});
							})
						}else{
							return false;
						}
					})
				},
				editRegin() {
					_self = this;
					_self.editForm.visible = true;
					_self.editForm.editFormData.label = _self.selectedRows[0].label;
					_self.editForm.editFormData.level = _self.selectedRows[0].level;
					_self.editForm.editFormData.number = _self.selectedRows[0].number;
					_self.editForm.editFormData.notes = _self.selectedRows[0].notes;
				},
				onSubmitEdit() {
					let _self = this;
					axios.post(editUrl, _self.editForm.editFormData).then(function(req) {
						if(req.data.status) {
							if(_self.editForm.checked) _self.editForm.visible = false;
							_self.$message({
								type: 'success',
								message: req.data.message
							})
						}else{
							_self.$message({
								type: 'error',
								message: req.data.message
							})
						}
					})
				},
				deleteRegin() {
					let _self = this;
					this.$confirm('确定删除行政区域?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
						beforeClose: function(action, instance, done) {
							done(action);
						}
					}).then((action) => {
						let _self = this;
						if(action == 'confirm') {
							axios.post(deteleUrl, _self.selectedRows).then(function(req) {
								if(req.data.status) {
									//替换selectedRows的数据
									_self.$message({
										type: 'success',
										message: req.data.message
									});
								};
							}).catch(function(err) {
								console.log(err);
							})
						}else if(action == 'cancel'){
							this.$message({
								type: 'info',
								message: '已取消'
							});
						}
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				},
				changeValid(val) {
					axios.post('/administrativeRegion/changeValid', val).then((res)=> {
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							})
						}
					})
				}
			}
		});
	}

	that.init = (getDataInitUrl, lazyUrl, addUrl, editUrl, deteleUrl)=> {
		_this.init(getDataInitUrl, lazyUrl, addUrl, editUrl, deteleUrl);
	}

	return that;
}