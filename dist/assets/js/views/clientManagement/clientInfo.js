JGBVue = {
	module: {}
};

JGBVue.module.clientInfo = ()=> {
	const _this = {}
	,that = {};

	_this.init = (searchUrl, startUsingUrl, deleteUrl, examineUrl, getProvincesUrl, getCitiesUrl, getDistrictsUrl, getBlocksUrl, getCompanyUrl, getDepartmentUrl, departmentMemberGetUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, defaultColumnSettingUrl, columnSettingCompleteUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					table: {
						header: [],
						data: []
					},
					showColumnSetting: false,
					tempTable: [],
					search: {
						input: ''
					},
					detailsInfo: {},
					isShowForbiddenClients: false,
					activeIndex: -1,
					queryType: [
						{
							label: "客户类别",
							value: "clientCategory"
						},
						{
							label: "重点客户",
							value: "mvp"
						},
						{
							label: "普通客户",
							value: "normal"
						}
					],
					category:[],
					level: [],
					sale: [],
					companyList: [],
					clientInfo: {
						info: [],
						update: []
					},
					selectedRows: [],
					pageSize: 20,
					currentPage: 1,
					isUnfold: false,
					examinCurRow: null,
					addVisible: false,
					editVisible: false,
					loadingSaveAdd: false,
					loadingDetailInfo: false,
					formRules: {
						number: [
							{required: true, message: '请输入客户编号'}
						],
						name: [
							{required: true, message: '请输入客户名称'}
						]
					},
					addForm: {
						number: '',
						name: '',
						category: '',
						level: null,
						identifyNumber: '',
						bankName: '',
						bankAccount: '',
						companyTel: '',
						companyAddress: '',
						sales: [],
						assistants: [],
						table: [
							{
								index: 1,
								editFlag: false,
								linkman: '',
								job: '',
								tel: '',
								phone: '',
								QQOrWechat: '',
								linkAddress: '',
								primaryContact: ''
							},
							{
								index: 2,
								editFlag: false,
								linkman: '',
								job: '',
								tel: '',
								phone: '',
								QQOrWechat: '',
								linkAddress: '',
								primaryContact: ''
							}
						]
					},
					editForm: {
						number: '',
						name: '',
						category: '',
						level: null,
						identifyNumber: '',
						bankName: '',
						bankAccount: '',
						companyTel: '',
						companyAddress: '',
						sales: [],
						assistants: [],
						table: []
					},
					addCheckedAssistantsMember: [],
					editCheckedAssistantsMember: [],
					addCheckedSalesMember: [],
					editCheckedSalesMember: [],
					defaultCompanyProps: { label: "label", value: "number" },
					defaultDepartmentProps: { label: "label", value: "value" },
					defaultUserProps: {
						userName: "name", 
						userId: "uid", 
						userPic: "src", 
						departmentName: "department", 
						companyName: "companyName"
					},
					addAddress: {
						provinces: [],
						cities: [],
						districts: [],
						blocks: []
					},
					editAddress: {
						provinces: [],
						cities: [],
						districts: [],
						blocks: []
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
					tempAssistantsGroup: [],
					assistants: {
	                    company: '',
	                    companyName: '',
	                    departmentName: '',
	                    searchValue: '',
	                    companyList: [],
	                    departmentList: [],
	                    curCompanyVal: '',
	                    auditorList: [],
	                    activeIndex: -1,
	                    activeDepartment: '',
	                    selectedAuditors: []
	                },
	                showSelectedAuditors: true,
	                companyList: [],
	                departmentList: [],
	                userList: [],
	                btnLoading: false
				}
			},
			mounted() {
				let _self = this;
				this.searchVal();
				this.getCompanyList();
				let addVisibleValue = this.$getQuery(window.location.search).addVisible ? true : false;
				this.addVisible = addVisibleValue;
			},
			methods: {
				searchVal(val) {
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
									_self.table.data.push(item);
								}
							});
						}
					}).catch((err)=> {
						console.log('axios err: ', err);
					});
				},
				getCompanyList() {
					axios.get(getCompanyUrl).then((res)=> {
						this.companyList = JSON.parse(res.data.data);
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
							this.clientInfo = jdata;
							this.isUnfold = true;
							this.loadingDetailInfo = false;
						}
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
					axios.get(initDataUrl, item.value).then((res)=> {
						if(res.data.status) {
							let jdata = JSON.parse(res.data.data);
							this.table.splice(0, _self.table.length);
							this.tempTable.splice(0, _self.tempTable.length);
							jdata.table.forEach((item)=> {
								_self.tempTable.push(item);
							});
							this.tempTable.forEach((item)=> {
								if(!_self.isShowForbiddenClients) {
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
							if(item.clientNumber === _self.tempTable[i].clientNumber) {
								_self.tempTable[i].status = false;
							}
						}
					});
					this.table.splice(0, _self.table.length);
					this.tempTable.forEach((item)=> {
						if(!_self.isShowForbiddenClients) {
							if(item.status) {
								_self.table.push(item);
							}
						}else{
							_self.table.push(item);
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
									if(item.clientNumber === _self.tempTable[i].clientNumber) {
										_self.tempTable[i].status = true;
									}
								}
							});
						}
					})
				},
				toggleForbiddenClients() {
					let _self = this;
					this.table.splice(0, _self.table.length);
					this.selectedRows = [];
					this.tempTable.forEach((item)=> {
						if(this.isShowForbiddenClients) {
							_self.table.push(item);
						}else{
							if(item.status) {
								_self.table.push(item);
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
				renderHeader(createElement, { column }) {
					return createElement(
						'span'
						,{'class': 'required'}
						,[column.label]
					);
				},
				addRowClick(row, event, column) {
					this.addForm.table.forEach((item)=> {
						item.editFlag = false;
					})
					for(let i = 0; i < this.addForm.table.length; i++ ) {
						if(row === this.addForm.table[i]) {
							this.addForm.table[i].editFlag = true;
						}
					}
				},
				editRowClick(row, event, column) {
					this.editForm.table.forEach((item)=> {
						item.editFlag = false;
					})
					for(let i = 0; i < this.editForm.table.length; i++ ) {
						if(row === this.editForm.table[i]) {
							this.editForm.table[i].editFlag = true;
						}
					}
				},
				addFormTableAdd() {
					let index = this.addForm.table[this.addForm.table.length - 1].index + 1;
					let initFormRow = {
						index: 0,
						editFlag: false,
						linkman: '',
						job: '',
						tel: '',
						phone: '',
						QQOrWechat: '',
						linkAddress: '',
						primaryContact: ''
					}
					initFormRow.index = index;
					this.addForm.table.push(initFormRow)
				},
				editFormTableAdd() {
					let index = this.editForm.table[this.editForm.table.length - 1].index + 1;
					let initFormRow = {
						index: 0,
						editFlag: false,
						linkman: '',
						job: '',
						tel: '',
						phone: '',
						QQOrWechat: '',
						linkAddress: '',
						primaryContact: ''
					}
					initFormRow.index = index;
					this.editForm.table.push(initFormRow)
				},
				addFormTableDelete(row) {
					for(let i = 0; i < this.addForm.table.length; i++ ) {
						if(row === this.addForm.table[i]) {
							this.addForm.table.splice(i, 1);
						}
					}
				},
				editFormTableDelete(row) {
					for(let i = 0; i < this.editForm.table.length; i++ ) {
						if(row === this.editForm.table[i]) {
							this.editForm.table.splice(this.editForm.table[i], 1);
						}
					}
				},
				saveSetRoleMember() {
					let arr = []
					,_self = this;
					this.checkedRoleMember.forEach(item=> {
						arr.push(item.uid)
					});
					this.addForm.assistants = [];
					arr.forEach((item)=> {
						_self.addForm.assistants.push(item);
					});
					console.log(arr);
				},
				saveAdd(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveAddUrl, this.addForm).then((res)=> {
								if(res.data.status) {
									this.$refs[formName].resetFields();
									this.$message({
										type: 'success',
										message: res.data.message
									})
									this.addCheckedAssistantsMember = [];
									this.addVisible = false;
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
									this.editCheckedAssistantsMember = [];
									this.editVisible = false;
								}
							})
						}else{
							return false;
						}
					})
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
									this.addVisible = false;
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
				addCloseSalesTag(tag) {
					let _self = this;
					this.addForm.sales.splice(_self.addForm.sales.indexOf(tag), 1);
					this.addCheckedSalesMember = [];
					this.addForm.sales.forEach((item)=> {
						_self.addCheckedSalesMember.push(item)
					})
				},
				editCloseTag(tag) {
					let _self = this;
					this.editForm.assistants.splice(_self.editForm.assistants.indexOf(tag), 1);
					this.editCheckedAssistantsMember = [];
					this.editForm.assistants.forEach((item)=> {
						_self.editCheckedAssistantsMember.push(item)
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
				}
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

	that.init = (searchUrl, startUsingUrl, deleteUrl, examineUrl, getProvincesUrl, getCitiesUrl, getDistrictsUrl, getBlocksUrl, getCompanyUrl, getDepartmentUrl, departmentMemberGetUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, defaultColumnSettingUrl, columnSettingCompleteUrl)=> {
		_this.init(searchUrl, startUsingUrl, deleteUrl, examineUrl, getProvincesUrl, getCitiesUrl, getDistrictsUrl, getBlocksUrl, getCompanyUrl, getDepartmentUrl, departmentMemberGetUrl, saveAddUrl, getEditUrl, saveEditUrl, uploadUrl, getExportFormUrl, defaultColumnSettingUrl, columnSettingCompleteUrl);
	}

	return that;
}