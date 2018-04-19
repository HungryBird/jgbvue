JGBVue = {
	module: {}
};

JGBVue.module.equipmentManagement = ()=> {
	const _this = {}
	,that = {};

	_this.init = (searchUrl, getQuickQueryUrl,startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, getImageUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, getClientUrl, getEquipmentNameOptionUrl, getEquipmentBrandOptionUrl, getEquipmentCategoryOptionUrl, getUnitMeasurementOptionUrl, getUniqueCodeUrl, getAuxiliaryAttributesClassifyUrl, printListUrl)=> {
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
						number: [
							{required: true, message: '请输入客户编号'}
						],
						name: [
							{required: true, message: '请输入客户名称'}
						],
						equipmentName: [
							{required: true, message: '请输入设备名称'}
						],
						equipmentSerialNumber: [
							{required: true, message: '请输入设备序列号'},
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
					tempTable: [],
					searchData: {
						input: '',
						select: ''
					},
					detailsInfo: {},
					isShowForbiddenEquipment: false,
					activeIndex: -1,
					queryType: [],
					companyList: [],
					detailInfo: [],
					selectedRows: [],
					pageSize: 20,
					currentPage: 1,
					isUnfold: false,
					examinCurRow: null,
					addVisible: false,
					editVisible: false,
					loadingSaveAdd: false,
					loadingDetailInfo: false,
					addForm: {
						uniqueCode: null,
						warningWarrantyMethod: [],
						addAuxiliaryAttributesClassify: [],
						addAuxiliaryAttributesClassifyOption: []
					},
					editForm: {
						uniqueCode: null,
						warningWarrantyMethod: [],
						addAuxiliaryAttributesClassify: [],
						addAuxiliaryAttributesClassifyOption: []
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
					auxiliaryAttributesClassify: []
				}
			},
			mounted() {
				this.search();
				this.getClientOption();
				this.getQuickQuery();
				this.getAuxiliaryAttributesClassify()
			},
			methods: {
				getAuxiliaryAttributesClassify() {
					let _self = this;
					axios.get(getAuxiliaryAttributesClassifyUrl).then((res)=> {
						if(res.data.status) {
							this.auxiliaryAttributesClassify = JSON.parse(res.data.data);
							this.auxiliaryAttributesClassify.forEach((item)=> {
								let obj = {};
								obj.value = '';
								_self.addForm.addAuxiliaryAttributesClassifyOption.push(obj);
								_self.editForm.addAuxiliaryAttributesClassifyOption.push(obj);
							})
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
							this.tempTable = jdata.data.concat();
							this.tempTable.forEach((item)=> {
								if(!_self.isShowForbiddenEquipment) {
									if(item.status) {
										_self.table.data.push(item);
									}
								}else{
									_self.table.push(item);
								}
							});
						}
					}).catch((err)=> {
						console.log('axios err: ', err);
					});
				},
				getClientOption() {
					axios.get(getQuickQueryUrl).then((res)=> {
						if(res.data.status) {
							this.queryType = JSON.parse(res.data.data).concat();
						}
					})
				},
				getQuickQuery() {
					axios.get(getQuickQueryUrl).then((res)=> {
						if(res.data.status) {
							this.queryType = JSON.parse(res.data.data).concat();
						}
					})
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
				handleDelete() {
					let _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    this.$refs.table.clearSelection();
                    this.remove();
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
                            axios.post(deleteUrl, this.selectedRows).then((res)=> {
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
				handleStatus(index, row) {
					axios.post(startUsingUrl, row).then((res)=> {
						this.loading = true;
						if(res.data.status) {
							this.$message({
								type: 'success',
								message: res.data.message
							})
							this.loading = false;
							this.forbidden();
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				forbidden() {
					let _self = this
					,arr = [];
					this.selectedRows.forEach((item, index)=> {
						for(let i = 0; i < _self.tempTable.length; i++ ) {
							if(item.uid === _self.tempTable[i].uid) {
								_self.tempTable[i].status = false;
							}
						}
					});
					this.table.data = [];
					this.tempTable.forEach((item)=> {
						if(!_self.isShowForbiddenEquipment) {
							if(item.status) {
								_self.table.data.push(item);
							}
						}else{
							_self.table.data.push(item);
						}
					})
					this.selectedRows = [];
				},
				startUsing() {
					let _self = this
					,arr = [];
					axios.post(startUsingUrl, this.selectedRows).then((res)=> {
						if(res.data.status) {
							this.selectedRows.forEach((item, index)=> {
								for(let i = 0; i < _self.tempTable.length; i++ ) {
									if(item.uid === _self.tempTable[i].uid) {
										_self.tempTable[i].status = true;
									}
								}
							});
						}
					})
				},
				toggleForbiddenEquipment() {
					let _self = this;
					this.table.data = [];
					this.selectedRows = [];
					this.tempTable.forEach((item)=> {
						if(this.isShowForbiddenEquipment) {
							_self.table.data.push(item);
						}else{
							if(item.status) {
								_self.table.data.push(item);
							}
						}
					})
				},
				rowStatusClassName({row, rowIndex}) {
					if(!row.status) {
						return 'forbidden-row';
					}
				},
				foucsAddProvince() {
					let _self = this;
					if(this.addAddress.provinces.length === 0) {
						axios.get(getProvincesUrl).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.addAddress.provinces.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				foucsAddCity() {
					let _self = this;
					if(this.addAddress.cities.length === 0) {
						axios.post(getCitiesUrl, this.addAddress.provinces).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.addAddress.cities.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				foucsAddDistrict() {
					let _self = this;
					if(this.addAddress.districts.length === 0) {
						axios.post(getDistrictsUrl, this.addAddress.cities).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.addAddress.districts.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				foucsAddBlock() {
					let _self = this;
					if(this.addAddress.blocks.length === 0) {
						axios.post(getBlocksUrl, this.addAddress.districts).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.addAddress.blocks.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				changeAddProvince(val) {
					if(this.addAddress.cities.length !== 0) {
						this.addAddress.cities.splice(0, this.addAddress.cities.length);
						this.addForm.city = '';
					}
					if(this.addAddress.districts.length !== 0) {
						this.addAddress.districts.splice(0, this.addAddress.districts.length);
						this.addForm.district = '';
					}
					if(this.addAddress.blocks.length !== 0) {
						this.addAddress.blocks.splice(0, this.addAddress.blocks.length);
						this.addForm.block = '';
					}
				},
				changeAddCities() {
					if(this.addAddress.districts.length !== 0) {
						this.addAddress.districts.splice(0, this.addAddress.districts.length);
						this.addForm.district = '';
					}
					if(this.addAddress.blocks.length !== 0) {
						this.addAddress.blocks.splice(0, this.addAddress.blocks.length);
						this.addForm.block = '';
					}
				},
				changeAddDistrict() {
					if(this.addAddress.blocks.length !== 0) {
						this.addAddress.blocks.splice(0, this.addAddress.blocks.length);
						this.addForm.block = '';
					}
				},
				saveAdd(formName) {
					console.log(formName)
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveAddUrl, this.addForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.addVisible = false;
									this.$message({
										type: 'success',
										message: res.data.message
									})
								}
							})
						}else{
							console.log(false)
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
				viewImage(item, row) {
					this.selectedRows = [];
					this.$refs['table'].clearSelection();
					this.openSlideshow(item);
				},
				openSlideshow(item) {
					let _self = this;
					axios.post(getImageUrl, item).then((res)=> {
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
					});
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
				handleRemove(file, fileList) {
					//
				},
				openAddClientOption() {
					this.$selectTab(
						'clientInfo', 
						'客户信息', 
						'./views/clientManagement/clientInfo.html', 
						`${'addVisible=true'}`
					)
				},
				openAddAuxiliaryAttributes() {
					this.$selectTab(
						'commodityManagementAuxiliaryAttributes', 
						'辅助属性', 
						'./views/equipmentManagement/equipmentManagementAuxiliaryAttributes.html',
					)
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
				preview() {
					this.$selectTab(
						'equipmentManagementPrint', 
						'打印设备管理', 
						'./views/equipmentManagement/equipmentManagementPrint.html', 
						`url=${printListUrl}`)
					}
					//console.log(printListUrl)
			},
			watch: {
				addCheckedSalesMember(newVal) {
					if(newVal.length > 1) {
						return this.addCheckedSalesMember.splice(0, 1);
					}
					this.$refs['setRoleMember_sale'].setUserListChecked();
				}
			}
		})
	}

	that.init = (searchUrl, getQuickQueryUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, getImageUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, getClientUrl, getEquipmentNameOptionUrl, getEquipmentBrandOptionUrl, getEquipmentCategoryOptionUrl, getUnitMeasurementOptionUrl, getUniqueCodeUrl, getAuxiliaryAttributesClassifyUrl, printListUrl)=> {
		_this.init(searchUrl, getQuickQueryUrl, startUsingUrl, deleteUrl, examineUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, getImageUrl, defaultColumnSettingUrl, columnSettingCompleteUrl, getClientUrl, getEquipmentNameOptionUrl, getEquipmentBrandOptionUrl, getEquipmentCategoryOptionUrl, getUnitMeasurementOptionUrl, getUniqueCodeUrl, getAuxiliaryAttributesClassifyUrl, printListUrl);
	}

	return that;
}