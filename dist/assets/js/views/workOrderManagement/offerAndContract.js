JGBVue = {
	module: {}
};

JGBVue.module.offerAndContract = ()=> {
	const _this = {}
	,that = {};

	_this.init = (searchUrl, getOptionUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, getImageUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, getClientUrl, getEquipmentNameOptionUrl, getEquipmentBrandOptionUrl, getEquipmentCategoryOptionUrl, getUnitMeasurementOptionUrl, getUniqueCodeUrl, getAuxiliaryAttributesClassifyUrl, printListUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				/*var checkNumber = (rule, value, callback)=> {
					if(!Number.isInteger(Number(value))) {
						callback(new Error('请输入数字值'));
					}
				};
				var equipmentSerialNumber = (rule, value, callback)=> {
					if(!this.equipmentSerialNumberValid) {
						console.log(1111)
						callback(new Error(this.equipmentSerialNumberError));
					}
				}*/
				return {
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
							{required: true, message: '请输入报价人'},
							/*{validator: equipmentSerialNumber}*/
						],
						/*costEquipment: [
							{validator: checkNumber}
						],
						warning_warranty_time: [
							{validator: checkNumber}
						]*/
					},
					table: {
						header: [],
						data: []
					},
					searchData: {
						input: '',
						businessPersonnel: '',
						serviceman: '',
						date: ''
					},
					businessPersonnelQuickOption: [],
					servicemanQuickOption: [],
					statusForm: [],
					formStatusCheckAll: false,
					formOrderStatus: [
						{ label: '报价中', value: 0 },
            			{ label: '待接待', value: 1 },
					],
					detailsInfo: {},
					isShowForbiddenEquipment: false,
					companyList: [],
					detailInfo: [],
					selectedRows: [],
					pageSize: 20,
					currentPage: 1,
					isUnfold: false,
					examinCurRow: null,
					addContractDialogVisible: false,
					editVisible: false,
					loadingSaveAdd: false,
					loadingDetailInfo: false,
					accessoriesOption: [],
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
					addSetMemberVisible: false,
					addSetSalesVisible: false,
					editSetMemberVisible: false,
					editSetSalesVisible: false,
					loadingSetRoleMember: false,
					checkedRoleMember: [],
					importVisible: false,
					exportVisible: false,
					uploadUrl: uploadUrl,
					getFileInfo: null,
					uploadInfo: {
						newNumber: 0,
						updateNumber: 0,
						errNumber: 0,
						errRecord: []
					},
					exportForm: [],
	                btnLoading: false,
	                showSlideshow: false,
	                slideshowArr: [],
					currentImgWidth: 0,
					currentImgHeight: 0,
					currentImgIndex: 0,
					currentImgSrc: '',
					showColumnSetting: false,
					clientOption: [{}],
					linkmanOption: [],
					equipmentNameOption: [],
					equipmentBrandOption: [],
					equipmentCategoryOption: [],
					unitMeasurementOption: [],
					equipmentSerialNumberValid: true,
					equipmentSerialNumberError: '',
					auxiliaryAttributesClassify: [],
					loading: false
				}
			},
			mounted() {
				this.search();
				this.getOption();
			},
			methods: {
				getOption() {
					axios.get(getOptionUrl).then((res)=> {
						if(res.data.status) {
							this.accessoriesOption = JSON.parse(res.data.data).concat();
							this.clientOption = JSON.parse(res.data.data).concat();
						}
					})
				},
				search(val) {
					let _self = this;
					axios.get(searchUrl, val).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.table.header = [];
							this.table.data = [];
							this.table.header = jdata.header.concat();
							this.table.data = jdata.data.concat();
						}
					}).catch((err)=> {
						console.log('axios err: ', err);
					});
				},
				handleFormCheckStatusChange(value) { 
					let checkedCount = value.length;
					/*this.formStatusCheckAll = checkedCount === this.formOrderStatus.length;
					this.getWorkOrderData()*/
				},
				handleFormCheckAllChange(value) {
					let _self = this;
					if(value) {
						this.statusForm = [];
						this.formOrderStatus.forEach((item)=> {
							_self.statusForm.push(item.value)
						})
					}else{
						this.statusForm = [];
					}
				},
				rowClick(row, event, column) {
					let _self = this;
					this.$refs['table'].toggleRowSelection(row);
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
							let jdata = JSON.parse(res.data.data);
							this.detailInfo = jdata;
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
				rowStatusClassName({row, rowIndex}) {
					if(row.status === -1) {
						return 'scrap-row';
					}
				},
				handleEdit(index, row) {
					this.$refs['table'].clearSelection();
					this.selectedRows = [];
					axios.post(getEditUrl, row).then((res)=> {
						if(res.data.status) {
							this.editForm = JSON.parse(res.data.data);
							this.editVisible = true;
						}
					})
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
				changeQueryType(item, index) {
					if(this.activeIndex === index) return;
					let _self = this;
					this.activeIndex = index;
					axios.get(searchUrl, item.value).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.table.data.splice(0, _self.table.length);
							this.tempTable.splice(0, _self.tempTable.length);
							jdata.table.forEach((item)=> {
								_self.tempTable.push(item);
							});
							this.tempTable.forEach((item)=> {
								if(!_self.isShowForbiddenEquipment) {
									if(item.status) {
										_self.table.push(item);
									}
								}else{
									_self.table.push(item);
								}
							});
							this.$message({
								type: 'success',
								message: 'success'
							})
						}
					})
				},
				handleSizeChange() {
					//当前页面size改变时
				},
				handleCurrentChange() {
					//翻页时
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
				saveAdd(formName) {
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
				saveEdit(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveEditUrl, this.editForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.editDialogVisiable = false;
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.editVisible = false;
								}
							})
						}else{
							return false;
						}
					})
				},
				closeAdd() {
					//
				},
				closeEdit() {
					//
				},
				addCloseTag(tag) {
					let _self = this;
					this.addForm.assistants.splice(_self.addForm.assistants.indexOf(tag), 1);
					this.addCheckedAssistantsMember = [];
					this.addForm.assistants.forEach((item)=> {
						_self.addCheckedAssistantsMember.push(item)
					})
				},
				getFile($event) {
					this.getFileInfo = $event.target.files[0];
				},
				uploadFild() {
					axios.post(uploadUrl, this.getFileInfo).then((res)=> {
						if(res.data.status) {
							this.uploadInfo = JSON.parse(res.data.data);
						}
					}).catch((err)=> {
						console.log(err);
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
                getUserList: function(obj) {
					axios.post(departmentMemberGetUrl, obj).then(res=> {
						if(res.data.status) {
							this.userList = JSON.parse(res.data.data)
						}
						else {
							this.$message({
								type: 'error',
								message: res.data.message,
								center: true
							})
						};
					}).catch(err=> {
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
					})
				},
                setMemberGetUser: function(data) {
					this.getUserList(data)
				},
				setMemberCompanyChange: function(data) {
					this.getDepartmentList(data)
				},
				getDepartmentList: function(obj) {
					axios.post(getDepartmentUrl, obj).then((res)=> {
						if(res.data.status) {
							this.departmentList = JSON.parse(res.data.data)
						}
						else {
							this.$message({
								type: 'error',
								message: res.data.message,
								center: true
							})
						};
					}).catch(err=> {
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
					})
				},
				editSetMember() {
					let _self = this;
					this.editCheckedAssistantsMember = [];
					this.editForm.assistants.forEach((item)=> {
						_self.editCheckedAssistantsMember.push(item);
					})
					this.editSetMemberVisible = true;
				},
				saveEditSetMember() {
					let _self = this;
					this.editForm.assistants = [];
					this.editCheckedAssistantsMember.forEach((item)=> {
						_self.editForm.assistants.push(item);
					})
					this.editSetMemberVisible = false;
				},
				saveAddSetMember() {
					let _self = this;
					this.addForm.assistants = [];
					this.addCheckedAssistantsMember.forEach((item)=> {
						_self.addForm.assistants.push(item);
					})
					this.addSetMemberVisible = false;
				},
				saveAddSetSales() {
					let _self = this;
					this.addForm.sales = [];
					this.addCheckedSalesMember.forEach((item)=> {
						_self.addForm.sales.push(item);
					})
					this.addSetSalesVisible = false;
				},
				viewImage(row) {
					this.selectedRows = [];
					this.$refs['table'].clearSelection();
					this.openSlideshow(row);
				},
				openSlideshow(row) {
					let _self = this;
					/*axios.post(getImageUrl, item).then((res)=> {
						if(res.data.status) {
							this.slideshowArr = [];
							this.currentImgIndex = 0;
							res.data.data.forEach((item)=> {
								_self.slideshowArr.push(item);
							});
							this.currentImgSrc = this.slideshowArr[0].src;
							this.currentImgWidth = this.slideshowArr[0].width;
							this.currentImgHeight = this.slideshowArr[0].height;
							this.showSlideshow = true;
						}
					});*/
					this.slideshowArr = [];
					this.currentImgIndex = 0;
					row.image.forEach((item)=> {
						_self.slideshowArr.push(item);
					});
					this.currentImgSrc = this.slideshowArr[0].src;
					this.currentImgWidth = this.slideshowArr[0].width;
					this.currentImgHeight = this.slideshowArr[0].height;
					this.showSlideshow = true;
				},
				nextImg() {
					if(this.currentImgIndex === this.slideshowArr.length - 1) {
						this.currentImgIndex = 0;
					}else{
						this.currentImgIndex++;
					}
					this.currentImgSrc = this.slideshowArr[this.currentImgIndex].src;
					this.currentImgWidth = this.slideshowArr[this.currentImgIndex].width;
					this.currentImgHeight = this.slideshowArr[this.currentImgIndex].height;
				},
				prevImg() {
					if(this.currentImgIndex === 0) {
						this.currentImgIndex = this.slideshowArr.length - 1;
					}else{
						this.currentImgIndex--;
					}
					this.currentImgSrc = this.slideshowArr[this.currentImgIndex].src;
					this.currentImgWidth = this.slideshowArr[this.currentImgIndex].width;
					this.currentImgHeight = this.slideshowArr[this.currentImgIndex].height;
				},
				btnColumnSettingReset() {
					axios.post(defaultColumnSettingUrl).then(res=> {
						if(res.data.status) {
							this.table.header= [];
							this.table.header = JSON.parse(res.data.data)
							this.$message({
								type: 'success',
								message: res.data.message
							})
							this.showColumnSetting = false;
						} else {
							this.$message({
								type: 'error',
								message: res.data.status,
								center: true
							})
						};
					}).catch((err)=> {
						console.log(err)
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
					})
				},
				btnColumnSettingComplete() {
					axios.post(columnSettingCompleteUrl, this.table.header).then(res=> {
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							});
							this.showColumnSetting = false;
						} else {
							this.$message({
								type: 'error',
								message: res.data.status,
								center: true
							})
						};
					}).catch((err)=> {
						console.log(err)
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
					})
				},
				focusClientSelect(e) {
					axios.get(getClientUrl).then((res)=> {
						if(res.data.status) {
							this.clientOption = JSON.parse(res.data.data);
						}
					})
				},
				changeClientOption(uid) {
					for(let i = 0; i < this.clientOption.length;i++ ) {
						if(this.clientOption[i].uid === uid) {
							this.linkmanOption = this.clientOption[i].linkman;
						}
					}
				},
				changeLinkmanOption(uid) {
					for(let i = 0; i < this.clientOption.length;i++ ) {
						if(this.linkmanOption[i].uid === uid) {
							this.addForm.phone = this.linkmanOption[i].phone;
							this.addForm.otherContact = this.linkmanOption[i].other_contact;
						}
					}
				},
				focusEquipmentNameSelect() {
					axios.get(getEquipmentNameOptionUrl).then((res)=> {
						if(res.data.status) {
							this.equipmentNameOption = JSON.parse(res.data.data);
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
				focusEquipmentCategorySelect() {
					axios.get(getEquipmentCategoryOptionUrl).then((res)=> {
						if(res.data.status) {
							this.equipmentCategoryOption = JSON.parse(res.data.data);
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
				generateSerialNumber(e) {
					if(!this.addForm.equipmentSerialNumber) return;
					axios.post(getUniqueCodeUrl, {serialNumber:this.addForm.equipmentSerialNumber}).then((res)=> {
						if(res.data.status) {
							this.addForm.uniqueCode = res.data.data;
						}else{
							this.equipmentSerialNumberError = res.data.message;
							this.equipmentSerialNumberValid = false;
							console.log(this.equipmentSerialNumberValid)
						}
					})
				},
				addFormTableRowClick(row) {
					this.$toggleRowEditable(this.addForm.table, row)
				},
				btnPrintList() {
					let filter = this.$deepCopy(Object.assign(this.searchData, this.statusForm));
					this.$selectTab(
			            'printOfferAndContract', 
			            '打印报价与合同', 
			            './views/workOrderManagement/printOfferAndContract.html', 
			            `filter=${encodeURI(JSON.stringify(filter))}&&url=${printListUrl}&&mid=${this.c_menuId}&&hurl=${defaultColumnSettingUrl}`
		            )
				}
			},
			watch: {
				addCheckedSalesMember(newVal) {
					if(newVal.length > 1) {
						return this.addCheckedSalesMember.splice(0, 1);
					}
					this.$refs['setRoleMember_sale'].setUserListChecked();
				},
				statusForm(newVal) {
					if(newVal.length !== this.formOrderStatus.length) {
						this.formStatusCheckAll = false;
					}else{
						this.formStatusCheckAll = true;
					}

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
			}
		})
	}

	that.init = (searchUrl, getOptionUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, getImageUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, getClientUrl, getEquipmentNameOptionUrl, getEquipmentBrandOptionUrl, getEquipmentCategoryOptionUrl, getUnitMeasurementOptionUrl, getUniqueCodeUrl, getAuxiliaryAttributesClassifyUrl, printListUrl)=> {
		_this.init(searchUrl, getOptionUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, getImageUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, getClientUrl, getEquipmentNameOptionUrl, getEquipmentBrandOptionUrl, getEquipmentCategoryOptionUrl, getUnitMeasurementOptionUrl, getUniqueCodeUrl, getAuxiliaryAttributesClassifyUrl, printListUrl);
	}

	return that;
}