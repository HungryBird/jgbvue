JGBVue = {
	module: {}
};

JGBVue.module.menuManagement = ()=> {
	const _this = {}
	,that = {};

	_this.init = (treeDataUrl)=> {
		that.vm = new Vue({
			el: '#app',
			data: {
				treeData: [],
				defaultProps: {
					label: 'name',
					children: 'menuItems'
				},
				searchForm: {
					searchValue: ''
				},
				selectedRows: [],
				data: {
					table: []
				}
			},
			mounted() {
				axios.get(treeDataUrl).then((res)=> {
					if(res.data.status) {
						let jdata = JSON.parse(res.data.data);
						this.treeData = jdata;
					}
				}).catch((err)=> {
					console.log('err: ', err);
				})
			},
			methods: {
				handleNodeClick() {
					//
				},
				add() {
					//
				}
			}
		})
	}

	that.init = (treeDataUrl)=> {
		_this.init(treeDataUrl);
	}

	return that;
}