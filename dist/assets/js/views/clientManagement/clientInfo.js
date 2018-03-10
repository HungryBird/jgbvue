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
				]
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
				}

			}
		})
	}

	that.init = ()=> {
		_this.init();
	}

	return that;
}