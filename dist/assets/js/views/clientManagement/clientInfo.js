JGBVue = {
	module: {}
};

JGBVue.module.clientInfo = ()=> {
	const _this = {}
	,that = {};

	_this.init = ()=> {
		that.vm = new Vue({
			el: '#app',
			data: {
				table: [],
				search: {
					input: '',
					showForbiddenClients: ''
				},
				queryType: [
					{
						label: "重点客户",
						value: "mvp"
					},
					{
						label: "普通客户",
						value: "normal"
					}
				],
				pageSize: 20,
				currentPage: 1
			},
			mounted() {
				//
			},
			methods: {
				rowClick() {
					//
				},
				selectAll() {
					//
				},
				selectItem() {
					//
				},
				changeQueryType(item) {
					//
				},
				handleSizeChange() {
					//当前页面size改变时
				},
				handleCurrentChange() {
					//翻页时
				}
			}
		})
	}

	that.init = ()=> {
		_this.init();
	}

	return that;
}