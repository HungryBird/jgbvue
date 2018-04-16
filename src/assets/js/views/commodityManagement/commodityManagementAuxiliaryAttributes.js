JGBVue = {
	module: {}
};

JGBVue.module.commodityManagementAuxiliaryAttributes = (initDataUrl, addClassifyUrl)=> {
	const _this = {}
	,that = {};

	_this.init = ()=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					data: []
				}
			},
			mounted() {
				this.getInitData();
			},
			methods: {
				getInitData() {
					axios.get(initDataUrl).then((res)=> {
						if(res.data.status) {
							this.data = JSON.parse(res.data.data).concat();
						}
					})
				},
				addClassify() {
					this.$prompt('名称', '新增分类', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value }) => {
						axios.post(addClassifyUrl, val).then((res)=> {
							if(res.data.status) {
								//this.data.push()
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});       
					});
				}
			}
		})
	}

	that.init = (initDataUrl, addClassifyUrl)=> {
		_this.init(initDataUrl, addClassifyUrl);
	}

	return that;
}