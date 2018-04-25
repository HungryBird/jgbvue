JGBVue = {
	module: {}
};

JGBVue.module.maintenanceOffer = ()=> {
	let _this = {}
	,that = {};

	_this.init = (searchUrl, getOptionUrl, getEquipmentBrandOptionUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					order_id: '',
					selectedRows: [],
					currentPage: 1,
					pageSize: 20,
					table: [],
					formRules: {
						title: [
							{required: true, message: '请输入标题'}
						],
						clientName: [
							{required: true, message: '请输入客户名称'}
						],
						equipmentName: [
							{required: true, message: '请输入设备名称'}
						],
						offerer: [
							{required: true, message: '请输入报价人'}
						]
					},
					loadingDetailInfo: false,
					addContractDialogVisible: true,
					addForm: {
						uniqueCode: null,
						warningWarrantyMethod: [],
						addAuxiliaryAttributesClassify: [],
						addAuxiliaryAttributesClassifyOption: [],
						table: [
							{
								editFlag: false,
								costItem: '配件',
								accessoriesValue: 0,
								prop: 'accessoriesFee',
								unit: '',
								quantity: 0,
								money: 0
							},
							{
								editFlag: false,
								costItem: '配件',
								accessoriesValue: 0,
								prop: 'accessoriesFee',
								unit: '',
								quantity: 0,
								money: 0
							}
						],
						tempTable: [
							{
								costItem: '人工服务维修费',
								unit: '',
								quantity: 0,
								money: 0
							},
							{
								costItem: '安装费',
								unit: '',
								quantity: 0,
								money: 0
							},
							{
								costItem: '配送费',
								unit: '',
								quantity: 0,
								money: 0
							},
							{
								costItem: '其他费用',
								unit: '',
								quantity: 0,
								money: 0
							}
						]
					},
					loading: false,
					clientOption: [{}],
					linkmanOption: [],
					equipmentNameOption: [],
					equipmentBrandOption: [],
					equipmentCategoryOption: [],
					unitMeasurementOption: [],
					accessoriesOption: [],
				}
			},
			mounted() {
				let info = JSON.parse(this.$getQuery(window.location.search).info);
				this.order_id = info.order_id;
				this.search();
				this.getOption();
			},
			methods: {
				search() {
					axios.post(searchUrl, this.order_id).then((res)=> {
						if(res.data.status) {
							this.table = JSON.parse(res.data.data);
						}
					})
				},
				getOption() {
					axios.get(getOptionUrl).then((res)=> {
						if(res.data.status) {
							this.accessoriesOption = JSON.parse(res.data.data).concat();
							this.clientOption = JSON.parse(res.data.data).concat();
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
                            axios.post(deleteUrl, this.selectedRows).then((res)=> {
                                if(res.data.status) {
                                	this.selectedRows.forEach((item)=> {
                                		for (let i = _self.table.data.length - 1; i >= 0; i--) {
                                			if(_self.table.data[i] === item) {
                                				_self.table.data[i].status = -1;
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
				handleSizeChange() {
					//
				},
				handleCurrentChange() {
					//
				},
				rowClick(row, event, column) {
					/*let _self = this;
					this.$refs['table'].toggleRowSelection(row);
					if(_self.selectedRows.indexOf(row) == -1) {
						_self.selectedRows.push(row)
					}else{
						_self.selectedRows.splice(_self.selectedRows.indexOf(row), 1);
					}*/
					this.$rowClick('table', row, this);
				},
				selectAll(selection) {
					/*let _self = this;
                    if(selection.length == 0) {
                        _self.selectedRows.splice(0, _self.selectedRows.length);
                    }else{
                        _self.selectedRows.splice(0, _self.selectedRows.length);
                        selection.forEach((item)=> {
                            _self.selectedRows.push(item);
                        })
                    }*/
                    this.$selectAll(selection, this);
				},
				selectItem(selection, row) {
					/*let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    for(let i = 0; i < selection.length; i++) {
                        _self.selectedRows.push(selection[i]);
                    }*/
                    this.$selectItem(selection, row, this);
				},
				remoteClient(val) {
					this.loading = true;
					axios.post(getOptionUrl).then((res)=> {
						if(res.data.status) {
							this.clientOption = [];
							this.clientOption = JSON.parse(res.data.data);
							this.loading = false;
						}
					})
				},
				saveAddOffer(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveAddUrl, this.addForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.addContractDialogVisible = false;
									for (var i = this.table.data.length - 1; i >= 0; i--) {
										if(this.table.data[i] === this.selectedRows[0]) {
											this.table.data[i].status = 1;
										}
									}
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
				zanCunOffer(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveAddUrl, this.addForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.addContractDialogVisible = false;
									for (var i = this.table.data.length - 1; i >= 0; i--) {
										if(this.table.data[i] === this.selectedRows[0]) {
											this.table.data[i].status = 1;
										}
									}
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
				focusEquipmentBrandSelect() {
					axios.get(getEquipmentBrandOptionUrl).then((res)=> {
						if(res.data.status) {
							this.equipmentBrandOption = JSON.parse(res.data.data);
						}
					})
				},
				generateSerialNumber() {
					if(!this.addForm.equipmentSerialNumber) return;
					axios.post(getUniqueCodeUrl, {serialNumber:this.addForm.equipmentSerialNumber}).then((res)=> {
						if(res.data.status) {
							this.addForm.uniqueCode = res.data.data;
						}else{
							this.equipmentSerialNumberError = res.data.message;
							this.equipmentSerialNumberValid = false;
						}
					})
				},
				focusUnitMeasurementSelect() {
					axios.get(getUnitMeasurementOptionUrl).then((res)=> {
						if(res.data.status) {
							this.unitMeasurementOption = JSON.parse(res.data.data);
						}
					})
				},
				addFormTableRowClick(row) {
					this.$toggleRowEditable(this.addForm.table, row)
				},
			},
			watch: {
				//
			},
			computed: {
				countTotal() {
					let _self = this;
					let total = 0;
					this.addForm.tempTable.forEach((item)=> {
			            total += Number(item.money)
			        })
			        return Number(total);
				},
				countTotalUpper() {
					let _self = this;
					let total = 0;
					this.addForm.tempTable.forEach((item)=> {
			            total += Number(item.money)
			        })
			        return this.$convertCurrency(total);
				}
			},
			filters: {
				statusFilter(val) {
					if(val === 0) {
						return '待报价'
					}else if(val !== 0&&val !== -1) {
						return '报价中'
					}else if(val === -1){
						return '作废'
					}
				}
			}
		})
	}

	that.init = (searchUrl, getOptionUrl, getEquipmentBrandOptionUrl)=> {
		_this.init(searchUrl, getOptionUrl, getEquipmentBrandOptionUrl)
	}

	return that;
}