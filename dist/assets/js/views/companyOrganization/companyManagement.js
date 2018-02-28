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
					address: []
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
					axios.get('/companyManagement/address').then((req)=> {
						if(req.data.status) {
							let jdata = JSON.parse(req.data.data);
							jdata.forEach((item)=> {
								_self.addForm.address.push(item);
							})
							this.addDialogVisiable = true;
						}
					}).catch((err)=> {
						console.log('err: ', err);
					})
				},
				edit() {
					//
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
					/*if() {

					}*/
				}
			}
		})
	}

	that.init = (dataGetUrl)=> {
		_this.init(dataGetUrl);
	}

	return that;
}