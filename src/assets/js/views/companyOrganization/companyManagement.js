JGBVue = {
	module: {}
};

JGBVue.module.companyManagement = ()=> {
	let _this = {}
	,that = {};


	_this.init = ()=> {
		that.vm = new Vue({
			el: '#app',
			data: {
				selectedRows: []
			},
			mounted() {
				//
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
					this.$refs.BFtable.toggleRowSelection(row);
					if(_self.selectedRows.indexOf(row) == -1) {
						_self.selectedRows.push(row)
					}else{
						_self.selectedRows.splice(_self.selectedRows.indexOf(row), 1);
					}
				}
			}
		})
	}

	that.init = ()=> {
		_this.init();
	}

	return that;
}