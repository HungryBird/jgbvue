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
					trade: ''
				},
				formRules: {
					name: [
						{required: true, message: '请输入公司名称'}
					],
					trade: [
						{required: true, message: '请选择一个行业'}
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
				})
			},
			methods: {
				add() {
					this.addDialogVisiable = true;
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
				}
			}
		})
	}

	that.init = (dataGetUrl)=> {
		_this.init(dataGetUrl);
	}

	return that;
}