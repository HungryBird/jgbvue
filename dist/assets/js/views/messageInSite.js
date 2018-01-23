'use strict';

new Vue({
	el: '#app',
	data: {
		tableData: null,
		selectedRows: [],
		markAllow: true
	},
	mounted: function mounted() {
		var _this = this;

		axios.get('/messageInSite/data_get_all').then(function (data) {
			var jdata = JSON.parse(data.data.message);
			if (data.data.status) {
				_this.tableData = jdata;
			}
		}).catch(function (err) {
			console.log('err', err);
		});
	},

	methods: {
		all: function all() {
			var _this2 = this;

			axios.get('/messageInSite/data_get_all').then(function (data) {
				var jdata = JSON.parse(data.data.message);
				if (data.data.status) {
					_this2.tableData = jdata;
				}
			}).catch(function (err) {
				console.log('err', err);
			});
		},
		read: function read() {
			var _this3 = this;

			axios.get('/messageInSite/data_get_read').then(function (data) {
				var jdata = JSON.parse(data.data.message);
				if (data.data.status) {
					_this3.tableData = jdata;
				}
			}).catch(function (err) {
				console.log('err', err);
			});
		},
		unread: function unread() {
			var _this4 = this;

			axios.get('/messageInSite/data_get_unread').then(function (data) {
				var jdata = JSON.parse(data.data.message);
				if (data.data.status) {
					_this4.tableData = jdata;
				}
			}).catch(function (err) {
				console.log('err', err);
			});
		},
		makeItRead: function makeItRead() {
			var _this5 = this;

			axios.post('/messageInSite//data_red', this.selectedRows).then(function (data) {
				if (data.data.status) {
					_this5.$message({
						type: 'success',
						message: data.data.message
					});
				}
			}).catch(function (err) {
				console.log('err', err);
			});
		},
		remove: function remove() {
			var _this6 = this;

			var _self = this;
			this.$confirm('确定删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				beforeClose: function beforeClose(action, instance, done) {
					done(action);
				}
			}).then(function (action) {
				if (action == 'confirm') {
					axios.post('/messageInSite/data_delete', _self.selectedRows).then(function (req) {
						if (req.data.status) {
							//替换selectedRows的数据
							_self.$message({
								type: 'success',
								message: req.data.message
							});
						};
					}).catch(function (err) {
						console.log(err);
					});
				} else if (action == 'cancel') {
					_this6.$message({
						type: 'info',
						message: '已取消'
					});
				}
			}).catch(function (err) {
				_this6.$message({
					type: 'error',
					message: err
				});
			});
		},
		tableRowClassName: function tableRowClassName(_ref) {
			var row = _ref.row,
			    rowIndex = _ref.rowIndex;

			if (!row.status) {
				return 'info';
			}
		},
		rowClick: function rowClick(row) {
			var _self = this;
			this.$refs.msTable.toggleRowSelection(row);
			if (_self.selectedRows.indexOf(row) == -1) {
				_self.selectedRows.push(row);
			} else {
				_self.selectedRows.splice(_self.selectedRows.indexOf(row), 1);
			}
		},
		selectAll: function selectAll(selection) {
			var _self = this;
			if (selection.length == 0) {
				_self.selectedRows.splice(0, _self.selectedRows.length);
			} else {
				_self.selectedRows.splice(0, _self.selectedRows.length);
				selection.forEach(function (item) {
					_self.selectedRows.push(item);
				});
			}
		},
		handleSizeChange: function handleSizeChange(size) {
			//page size change
			console.log('size', size);
		},
		handleCurrentChange: function handleCurrentChange() {
			//current page change
		}
	},
	filters: {
		statusFilter: function statusFilter(val) {
			if (val) {
				return '已读';
			} else {
				return '未读';
			}
		}
	},
	watch: {
		selectedRows: function selectedRows(arr) {
			var _self = this;
			if (arr.length == 0) {
				_self.markAllow = true;
				return;
			}
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].status) {
					_self.markAllow = true;
					return false;
				}
			}
			_self.markAllow = false;
		}
	}
});