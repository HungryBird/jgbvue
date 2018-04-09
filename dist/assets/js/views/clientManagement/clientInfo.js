JGBVue = {
	module: {}
};

JGBVue.module.clientInfo = ()=> {
	const _this = {}
	,that = {};

	_this.init = (initDataUrl, startUsingUrl, deleteUrl, examineUrl, getProvincesUrl, getCitiesUrl, getDistrictsUrl, getBlocksUrl, getCompanyUrl, getDepartmentUrl, getUserUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					table: [],
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
					addVisible: true,
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
						sale: '',
						assistants: '',
						table: []
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
						sale: '',
						assistants: [],
						table: []
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
					setMemberVisible: false,
					getCompanyUrl: getCompanyUrl,
					getDepartmentUrl: getDepartmentUrl,
					getUserUrl: getUserUrl
				}
			},
			mounted() {
				let _self = this;
				axios.get(initDataUrl).then((res)=> {
					if(res.data.status) {
						let jdata = JSON.parse(res.data.data);
						this.category = jdata.category;
						this.level = jdata.level;
						this.sale = jdata.sale;
						this.companyList = jdata.companyList;
						this.tempTable = jdata.table;
						this.tempTable.forEach((item)=> {
							if(!_self.isShowForbiddenClients) {
								if(item.status) {
									_self.table.push(item);
								}
							}else{
								_self.table.push(item);
							}
						});
					}
				}).catch((err)=> {
					console.log('axios err: ', err);
				})
			},
			methods: {
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
				handleEdit() {
					//
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
				renderHeader(createElement, { _self }) {
					return createElement(
						'div',
						{'class': 'renderTableHead'},[
								createElement('div', {
									attrs: { type: 'text' },
									class: 'required'
								}, ['联系人'])
						]
					)
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
					//
				},
				closeTag(tag) {
					//
				}
			}
		})
	}

	that.init = (initDataUrl, startUsingUrl, deleteUrl, examineUrl, getProvincesUrl, getCitiesUrl, getDistrictsUrl, getBlocksUrl, getCompanyUrl, getDepartmentUrl, getUserUrl)=> {
		_this.init(initDataUrl, startUsingUrl, deleteUrl, examineUrl, getProvincesUrl, getCitiesUrl, getDistrictsUrl, getBlocksUrl, getCompanyUrl, getDepartmentUrl, getUserUrl);
	}

	return that;
}