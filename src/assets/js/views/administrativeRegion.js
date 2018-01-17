new Vue({
	el: '#app',
	data: {
		treeData: null,
		defaultProps: {
			children: 'children',
			label: 'label'
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
		var _self = this;
		/**
		 * 获取行政区域数据
		 * @param  {[type]} req) {			var      cities [行政区域]
		 * @return {[type]}      [description]
		 */
		axios.get('/administrativeRegion/data_get').then(function(req) {
			var cities = JSON.parse(req.data.cities);
			cities.forEach(function(item) {
				var obj = {};
				for(key in item) {
					if(key != 'children') {
						obj[key] = item[key];
					}
				}
				_self.tableData.push(obj);
			});
			_self.treeData = cities;
		}).catch(function (err) {
			console.log('err', err);
		});
	},
	methods: {
		handleNodeClick(data,node,cmp) {
			var _self = this;
			if(!data.children) {
				_self.addForm.addFormData.level = data.level;
				return;
			};
			this.tableData.splice(0, this.tableData.length);
			data.children.forEach(function(item) {
				var obj = {};
				for(key in item) {
					if(key != 'children') {
						obj[key] = item[key];
					}
				}
				_self.tableData.push(obj);
			});
			_self.addForm.addFormData.level = data.children[0].level;
		},
		rowClick(row, event, column) {
			var _self = this;
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
		addRegin() {
			this.addForm.visible = true;
		},
		onSubmitAdd(formName) {
			var _self = this;
			this.$refs[formName].validate((valid) => {
				console.log('valid', valid);
				if(valid) {
					axios.post('/administrativeRegion/data_write', _self.addForm.addFormData).then(function(req) {
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
			console.log('rows', _self.selectedRows[0]);
			_self.editForm.editFormData.name = _self.selectedRows[0].label;
			_self.editForm.editFormData.level = _self.selectedRows[0].level;
			_self.editForm.editFormData.number = _self.selectedRows[0].number;
			_self.editForm.editFormData.notes = _self.selectedRows[0].notes;
		},
		onSubmitEdit() {
			var _self = this;
			axios.post('/administrativeRegion/data_edit', _self.editForm.editFormData).then(function(req) {
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
			var _self = this;
			this.$confirm('确定删除行政区域?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				beforeClose: function(action, instance, done) {
					if(action == 'confirm') {
						axios.post('/administrativeRegion/data_delete', _self.selectedRows).then(function(req) {
							if(req.data.status) {
								//do something
								console.log('delete success');
								done()
							};
						}).catch(function(err) {
							console.log(err);
						})
					}else{
						done(false);
					}
				}
			}).then(() => {
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});          
			});
		}
	}
})