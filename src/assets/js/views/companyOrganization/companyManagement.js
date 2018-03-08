JGBVue = {
	module: {}
};

JGBVue.module.companyManagement = ()=> {
	let _this = {}
	,that = {};


	_this.init = (dataGetUrl, getProvincesUrl, getCitiesUrl, getDistrictsUrl, getBlocksUrl, getEditDataUrl, saveAddUrl, saveEditUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data: {
				cyTable: [],
				selectedRows: [],
				currentPage: 1,
				pageSize: 20,
				addDialogVisiable: false,
				addForm: {
					name: '',
					trade: '',
					linkman: '',
					telephone: '',
					phoneNumber: '',
					email: '',
					fax: '',
					province: '',
					city: '',
					district: '',
					block: '',
					moreInfo: '',
					date: '',
					remark: ''
				},
				editDialogVisiable: false,
				editForm: {
					name: '',
					trade: '',
					linkman: '',
					telephone: '',
					phoneNumber: '',
					email: '',
					fax: '',
					province: '',
					city: '',
					district: '',
					block: '',
					moreInfo: '',
					date: '',
					remark: ''
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
				addressProps: {
					value: 'uid',
					children: 'children'
				},
				formRules: {
					name: [
						{required: true, message: '请输入公司名称'}
					],
					trade: [
						{required: true, message: '请选择一个行业'}
					],
					linkman: [
						{required: true, message: '请输入联系人'}
					],
					phoneNumber: [
						{required: true, message: '请输入手机号码'}
					],
					province: [
						{
							required: true, message: '请选择公司地址'
						}
					],
					moreInfo: [
						{
							required: true, message: '请输入详细地址'
						}
					]
				},
				tradeOptions: [
					{
						"value": "opt1",
						"label": "行业1"
					},
					{
						"value": "opt2",
						"label": "行业2"
					},
					{
						"value": "opt3",
						"label": "行业3"
					}
				]
			},
			mounted() {
				axios.get(dataGetUrl).then((req)=> {
					if(!req.data.status) {
						console.log('err: ', req.data.message);
						return;
					}
					let jdata = JSON.parse(req.data.data);
					this.cyTable = jdata;
				}).catch((err)=> {
					console.log('err: ', err);
				});
			},
			methods: {
				add() {
					let _self = this;
					this.addDialogVisiable = true;
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
				edit() {
					let _self = this;
					axios.post(getEditDataUrl, this.selectedRows).then((req)=> {
						if(req.data.status) {
							let jprovinces = JSON.parse(req.data.data.provinces)
							,jcities = JSON.parse(req.data.data.cities)
							,jdistricts = JSON.parse(req.data.data.districts)
							,jblocks = JSON.parse(req.data.data.blocks)
							,jdata = JSON.parse(req.data.data.editData);
							this.editAddress.provinces.splice(0, this.editAddress.provinces.length);
							this.editAddress.cities.splice(0, this.editAddress.cities.length);
							this.editAddress.districts.splice(0, this.editAddress.districts.length);
							this.editAddress.blocks.splice(0, this.editAddress.blocks.length);
							this.editForm = jdata;
							jprovinces.forEach((item)=> {
								_self.editAddress.provinces.push(item);
							});
							jcities.forEach((item)=> {
								_self.editAddress.cities.push(item);
							});
							jdistricts.forEach((item)=> {
								_self.editAddress.districts.push(item);
							});
							jblocks.forEach((item)=> {
								_self.editAddress.blocks.push(item);
							});
							this.editDialogVisiable = true;
						}
					}).catch((err)=> {
						console.log('err: ', err);
					});
				},
				foucsEditProvince() {
					let _self = this;
					if(this.editAddress.provinces.length === 0) {
						axios.get(getProvincesUrl).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.editAddress.provinces.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				foucsEditCity() {
					let _self = this;
					if(this.editAddress.cities.length === 0) {
						axios.post(getCitiesUrl, this.editAddress.provinces).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.editAddress.cities.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				foucsEditDistrict() {
					let _self = this;
					if(this.editAddress.districts.length === 0) {
						axios.post(getDistrictsUrl, this.editAddress.cities).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.editAddress.districts.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				foucsEditBlock() {
					let _self = this;
					if(this.editAddress.blocks.length === 0) {
						axios.post(getBlocksUrl, this.editAddress.districts).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.editAddress.blocks.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				changeEditProvince(val) {
					if(this.editAddress.cities.length !== 0) {
						this.editAddress.cities.splice(0, this.editAddress.cities.length);
						this.addForm.city = '';
					}
					if(this.editAddress.districts.length !== 0) {
						this.editAddress.districts.splice(0, this.editAddress.districts.length);
						this.addForm.district = '';
					}
					if(this.editAddress.blocks.length !== 0) {
						this.editAddress.blocks.splice(0, this.editAddress.blocks.length);
						this.addForm.block = '';
					}
				},
				changeEditCities() {
					if(this.editAddress.districts.length !== 0) {
						this.editAddress.districts.splice(0, this.editAddress.districts.length);
						this.addForm.district = '';
					}
					if(this.editAddress.blocks.length !== 0) {
						this.editAddress.blocks.splice(0, this.editAddress.blocks.length);
						this.addForm.block = '';
					}
				},
				changeEditDistrict() {
					if(this.editAddress.blocks.length !== 0) {
						this.editAddress.blocks.splice(0, this.editAddress.blocks.length);
						this.addForm.block = '';
					}
				},
				remove() {
					//
				},
				rowClick(row) {
					let _self = this;
					this.$refs.companyTable.toggleRowSelection(row);
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
                    let = _self = this;
                    this.selectedRows.splice(0, _self.selectedRows.length);
                    for(let i = 0; i < selection.length; i++) {
                        _self.selectedRows.push(selection[i]);
                    }
                },
				handleSizeChange() {
					//
				},
				handleCurrentChange() {
					//
				},
				handleChange() {
					//
				},
				/*handleItemChange(val) {
					axios.post('/companyManagement/address', val).then((req)=> {
						let jdata = JSON.parse(req.data.data);
						console.log(this.addForm.address)
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},*/
				saveAdd(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveAddUrl, this.addForm).then((data)=> {
								if(data.data.status) {
									this.$refs[formName].resetFields();
									this.addDialogVisiable = false;
									this.$message({
										type: 'success',
										message: data.data.data
									})
								}
							})
						}else{
							return false;
						}
					})
				},
				closeAdd() {
					this.addDialogVisiable = false;
				},
				saveEdit(formName) {
					this.$refs[formName].validate((valid)=> {
						if(valid) {
							axios.post(saveEditUrl, this.editForm).then((data)=> {
								if(data.data.status) {
									this.$refs[formName].resetFields();
									this.addDialogVisiable = false;
									this.$message({
										type: 'success',
										message: data.data.data
									})
									this.editDialogVisiable = false;
								}
							})
						}else{
							return false;
						}
					})
				},
				closeEdit() {
					this.editDialogVisiable = false;
				}
			}
		})
	}

	that.init = (dataGetUrl, getProvincesUrl, getCitiesUrl, getDistrictsUrl, getBlocksUrl, getEditDataUrl, saveAddUrl, saveEditUrl)=> {
		_this.init(dataGetUrl, getProvincesUrl, getCitiesUrl, getDistrictsUrl, getBlocksUrl, getEditDataUrl, saveAddUrl, saveEditUrl);
	}

	return that;
}