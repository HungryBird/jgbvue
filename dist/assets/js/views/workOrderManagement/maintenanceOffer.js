JGBVue = {
	module: {}
};

JGBVue.module.maintenanceOffer = ()=> {
	let _this = {}
	,that = {};

	_this.init = (searchUrl, getTemplateUrl, getOptionUrl, getEquipmentBrandOptionUrl, getAccessoriesOptionUrl, saveAddUrl, examineUrl, giveOutUrl, getExportFormUrl, deleteUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					order_id: '',
					selectedRows: [],
					selectTempleRows: [],
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
						personnel: [
							{required: true, message: '请输入报价人'}
						]
					},
					loadingDetailInfo: false,
					addContractDialogVisible: false,
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
					infoForm: {},
					loading: false,
					clientOption: [{}],
					linkmanOption: [],
					equipmentNameOption: [],
					equipmentBrandOption: [],
					equipmentCategoryOption: [],
					unitMeasurementOption: [],
					accessoriesOption: [],
					examinCurRow: null,
					isUnfold: false,
					exportVisible: false,
					exportForm: [],
					templateVisible: false,
					templateTable: []
				}
			},
			mounted() {
				let info = JSON.parse(this.$getQuery(window.location.search).info);
				this.order_id = info.order_id;
				this.search();
				this.getOption();
				this.getAccessoriesOption();
				this.getTemplate();
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
							this.clientOption = JSON.parse(res.data.data).concat();
						}
					})
				},
				getTemplate() {
					axios.get(getTemplateUrl).then((res)=> {
						if(res.data.status) {
							this.templateTable = JSON.parse(res.data.data).concat();
						}
					})
				},
				getAccessoriesOption() {
					axios.get(getAccessoriesOptionUrl).then((res)=> {
						if(res.data.status) {
							this.accessoriesOption = JSON.parse(res.data.data).concat();
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
				rowStatusClassName({row, rowIndex}) {
					if(row.status === -1) {
						return 'scrap-row';
					}
				},
				handleSizeChange() {
					//
				},
				handleCurrentChange() {
					//
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
									this.addContractDialogVisible = false;
									/**
									 * 清空table之后再插入数据
									 * @type {String}
									 */
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.$refs[formName].resetFields();
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
									this.addContractDialogVisible = false;
									/**
									 * 清空table之后再插入数据
									 * @type {String}
									 */
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.$refs[formName].resetFields();
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
				addFormTableRowClick(row, data) {
					this.$toggleRowEditable(this.addForm.table, row)
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
				toggleInfo() {
					this.$refs['table'].clearSelection();
					this.selectedRows = [];
					this.isUnfold = false;
				},
				rowClickTemplateTable(row) {
					this.$rowClick('templateTable', row, this.selectTempleRows, this);
				},
				selectAllTemplateTable(selection) {
                    this.selectedRows = this.$selectAll(selection, this.selectTempleRows);
				},
				selectItemTemplateTable(selection, row) {
                    this.selectedRows = this.$selectItem(selection, row, this.selectTempleRows);
				},
				handleDelete() {
					let _self = this;
                    this.selectTempleRows = [];
                    this.$refs.templateTable.clearSelection();
                    this.$remove(deleteUrl, this.selectTempleRows, this);
				},
				changeTemplateTableStatus(val, row) {
					//axios.post(switchStatusUrl, val)
					console.log('row: ', row);
				},
				handleEditTemplate() {
					
				},
				handleDeleteTemplate() {
					//
				}
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
			        this.addForm.countTotal = Number(total);
			        return this.addForm.countTotal;
				},
				countTotalUpper() {
					let _self = this;
					let total = 0;
					this.addForm.tempTable.forEach((item)=> {
			            total += Number(item.money)
			        })
			        this.addForm.countTotalUpper = this.$convertCurrency(total);
			        return this.addForm.countTotalUpper;
				},
				infoFormCountTotal() {
					let _self = this;
					let total = 0;
					console.log('this.infoForm: ', this.infoForm)
					this.infoForm.tempTable.forEach((item)=> {
			            total += Number(item.money)
			        })
			        return Number(total).toFixed(2);
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

	that.init = (searchUrl, getTemplateUrl, getOptionUrl, getEquipmentBrandOptionUrl, getAccessoriesOptionUrl, saveAddUrl, examineUrl, giveOutUrl, getExportFormUrl, deleteUrl)=> {
		_this.init(searchUrl, getTemplateUrl, getOptionUrl, getEquipmentBrandOptionUrl, getAccessoriesOptionUrl, saveAddUrl, examineUrl, giveOutUrl, getExportFormUrl, deleteUrl)
	}

	return that;
}