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
				addDialogVisiable: true,
				addForm: {
					
				},
				formRules: [
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
					//
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