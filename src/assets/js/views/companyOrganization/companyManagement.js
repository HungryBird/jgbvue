JGBVue = {
	module: {}
};

JGBVue.module.companyManagement = ()=> {
	let _this = {}
	,that = {};


	_this.init = (dataGetUrl)=> {
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
				foucsProvince() {
					let _self = this;
					if(this.address.provinces.length === 0) {
						axios.get('/companyManagement/get_provinces').then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.address.provinces.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				foucsCity() {
					let _self = this;
					if(this.address.cities.length === 0) {
						axios.post('/companyManagement/get_cities', this.address.provinces).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.address.cities.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				foucsDistrict() {
					let _self = this;
					if(this.address.districts.length === 0) {
						axios.post('/companyManagement/get_district', this.address.cities).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.address.districts.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				foucsBlock() {
					let _self = this;
					if(this.address.blocks.length === 0) {
						axios.post('/companyManagement/get_block', this.address.districts).then((req)=> {
							if(req.data.status) {
								let jdata = JSON.parse(req.data.data);
								jdata.forEach((item)=> {
									_self.address.blocks.push(item);
								});
							}
						}).catch((err)=> {
							console.log('err: ', err);
						})
					}
				},
				changeProvince(val) {
					if(this.address.cities.length !== 0) {
						this.address.cities.splice(0, this.address.cities.length);
						this.addForm.city = '';
					}
					if(this.address.districts.length !== 0) {
						this.address.districts.splice(0, this.address.districts.length);
						this.addForm.district = '';
					}
					if(this.address.blocks.length !== 0) {
						this.address.blocks.splice(0, this.address.blocks.length);
						this.addForm.block = '';
					}
				},
				changeCities() {
					if(this.address.districts.length !== 0) {
						this.address.districts.splice(0, this.address.districts.length);
						this.addForm.district = '';
					}
					if(this.address.blocks.length !== 0) {
						this.address.blocks.splice(0, this.address.blocks.length);
						this.addForm.block = '';
					}
				},
				changeDistrict() {
					if(this.address.blocks.length !== 0) {
						this.address.blocks.splice(0, this.address.blocks.length);
						this.addForm.block = '';
					}
				},
				edit() {
					let _self = this;
					axios.post('/companyManagement/edit_get', this.selectedRows).then((req)=> {
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
				handleItemChange(val) {
					console.log('val', val);
					axios.post('/companyManagement/address', val).then((req)=> {
						let jdata = JSON.parse(req.data.data);
						console.log(this.addForm.address)
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				saveAdd(formName) {
					axios.post('/companyManagement/add_save', this.addForm).then((data)=> {
						if(data.data.status) {
							this.$refs[formName].resetFields();
							this.addDialogVisiable = false;
							this.$message({
								type: 'success',
								message: data.data.data
							})
						}
					})
				},
				closeAdd() {
					this.addDialogVisiable = false;
				}
			}
		})
	}

	that.init = (dataGetUrl)=> {
		_this.init(dataGetUrl);
	}

	return that;
}