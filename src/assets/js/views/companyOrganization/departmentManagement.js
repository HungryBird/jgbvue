JGBVue = {
	module: {}
};

JGBVue.module.departmentManagement = ()=> {
	let _this = {}
	,that = {};

	_this.init = (treeDataGetUrl)=> {
		new Vue({
			el: '#app',
			data: {
				treeData: [],
				table: [],
				defaultProps: {
					label: 'label',
					children: 'children'
				},
				searchForm: {
					searchValue: ''
				}
			},
			mounted() {
				let _self = this;
				axios.get(treeDataGetUrl).then((res)=> {
					if(res.data.status) {
						let jdata = JSON.parse(res.data.data);
						_self.treeData = jdata;
					}
				}).catch((err)=> {
					console.log('err', err);
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
				handleNodeClick() {
					//
				},
				rowClick() {

				},
				selectAll() {
					//
				},
				selectItem() {
					//
				},
				departmentTable() {
					//
				},
				search() {
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