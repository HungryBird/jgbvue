JGBVue = {
	module: {}
};

JGBVue.module.maintenanceContract = ()=> {
	let _this = {}
	,that = {}
	,E
	,addEditor;

	_this.createEditor = ()=> {
		E = window.wangEditor;
		addEditor = new E('#addEditor');
		addEditor.create();
	}
	_this.init = (searchUrl, giveOutUrl, getExportFormUrl, btnUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					table: [],
					addDialogVisible: true,
					order_id: '',
					exportVisible: false,
					selectedRows: [],
					loadingDetailInfo: false,
					currentPage: 1,
					pageSize: 20,
					exportForm: [],
					examinCurRow: null,
					templateVisible: false,
					addForm: {},
					formRules: {
						name: [
							{required: true, message: '请输入名称'}
						],
						title: [
							{required: true, message: '请输入标题'}
						],
						clientName: [
							{required: true, message: '请输入客户名称'}
						],
						equipmentName: [
							{required: true, message: '请输入设备名称'}
						],
						personnel: [
							{required: true, message: '请输入报价人'}
						]
					},
				}
			},
			mounted() {
				let info = JSON.parse(this.$getQuery(window.location.search).info);
				this.order_id = info.order_id;
				this.search();
			},
			methods: {
				search() {
					axios.post(searchUrl, this.order_id).then((res)=> {
						if(res.data.status) {
							this.table = JSON.parse(res.data.data);
						}
					})
				},
				exportCilck() {
					if(this.exportForm.length === 0) {
						axios.get(getExportFormUrl).then((res)=> {
							if(res.data.status) {
								this.exportForm = JSON.parse(res.data.data);
							}
						})
					}
					this.exportVisible = true;
				},
				giveOut() {
					let _self = this;
					this.$confirm('确定作废?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        beforeClose: function(action, instance, done) {
                            done(action);
                        }
                    }).then((action)=> {
                        if(action == 'confirm') {
                            axios.post(giveOutUrl, this.selectedRows).then((res)=> {
                                if(res.data.status) {
                                	this.selectedRows.forEach((item)=> {
                                		for (let i = _self.table.length - 1; i >= 0; i--) {
                                			if(_self.table[i] === item) {
                                				_self.table[i].status = -1;
                                			}
                                		}
                                	})
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
					this.$rowClick('table', row, this.selectedRows, this)
				},
				selectAll(selection) {
                    this.selectedRows = this.$selectAll(selection, this.selectedRows)
				},
				selectItem(selection, row) {
                    this.selectedRows = this.$selectItem(selection, row, this.selectedRows);
				},
				handleSizeChange() {
					//
				},
				handleCurrentChange() {
					//
				},
				rowStatusClassName({row, rowIndex}) {
					if(row.status === -1) {
						return 'scrap-row';
					}
				},
				handleExamine(index, row) {
					let _self = this;
					if(this.examinCurRow === row) {
						if(this.isUnfold) {
							this.isUnfold = false;
						}else{
							this.toggleInfo();
							this.isUnfold = true;
						}
						return;
					}
					this.examinCurRow = row;
					this.$refs['table'].clearSelection();
					this.loadingDetailInfo = true;
					axios.post(examineUrl, row).then((res)=> {
						if(res.data.status) {
							this.infoForm = res.data.data;
							this.isUnfold = true;
							this.loadingDetailInfo = false;

						}
					}).catch((err)=> {
						console.log(err)
					});
				},
				btnPass(row) {
					this.$refs.table.clearSelection();
					this.selectedRows = [];
					this.loadingDetailInfo = true;
					axios.post(btnUrl, row).then((res)=> {
						if(res.data.status) {
							for(let i = 0; i < this.table.length; i++ ) {
								if(row === this.table[i]) {
									this.table[i].status = 1
								}
							}
							this.loadingDetailInfo = false;
							this.$message({
								type: 'success',
								message: res.data.message
							})
						}
					})
				},
				btnRefuse(row) {
					let _self = this;
					this.$refs.table.clearSelection();
					this.selectedRows = [];
					_self.$prompt('不通过原因?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value })=> {
						axios.post(btnUrl, { row: row, value: value }).then((res)=> {
							if(res.data.status) {
								for(let i = 0; i < this.table.length; i++ ) {
									if(row === this.table[i]) {
										this.table[i].status = 2
									}
								}
								_self.$message({
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
					}).catch(() => {
						_self.$message({
							type: 'info',
							message: '已取消'
						});
					});
				}
			},
			watch: {
				//
			},
			computed: {
				//
			},
			filters: {
				statusFilter(val) {
					if(val === 0) {
						return '待审核'
					}else if(val === 1) {
						return '审核通过'
					}else if(val === 2){
						return '审核不通过'
					}else{
						return '作废'
					}
				}
			}
		})
	}

	that.init = (searchUrl, giveOutUrl, getExportFormUrl, btnUrl)=> {
		_this.init(searchUrl, giveOutUrl, getExportFormUrl, btnUrl);
		setTimeout(function() {
			_this.createEditor();
		}, 0);
	}

	return that;
}