JGBVue = {
	module: {}
};

JGBVue.module.divisionalManagement = ()=> {
	let _this = {}
	,that = {};

	_this.init = (treeDataGetUrl)=> {
		new Vue({
			el: '#app',
			data: {
				treeData: []
			},
			mounted() {
				console.log('tree')
				let _self = this;
				axios.get(treeDataGetUrl).then((data)=> {
					if(data.data.status) {
						let jdata = JSON.parse(data.data.message);
						_self.treeData = jdata;
					}
				}).catch((err)=> {
					console.log('err', err);
				})
			},
			methods: {
				handleNodeClick() {
					//
				}
			}
		})
	}

	that.init = (treeDataGetUrl)=> {
		_this.init(treeDataGetUrl);
	}

	return that;
}