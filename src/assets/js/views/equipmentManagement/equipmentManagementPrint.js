JGBVue = {
	module: {}
}

JGBVue.module.equipmentManagementPrint = ()=> {
	let _this = {}
	, that = {};

	_this.init = ()=> {
		that.vm = new Vue({
			el: '#app',
			data() {
				return {
					loadingOrderInfo: false,
					tableHeader: [],
					tableData: []
				}
			},
			mounted() {
				/*this.$nextTick(() => {
					this.getTableData();
				})*/
				this.getTableData();
			},
			methods: {
				getUrl() {
					return this.$getQuery(window.location.search).url
				},
				getTableData() {
					this.loadingOrderInfo = true;
					axios.post(this.getUrl()).then((res)=> {
						console.log('res: ', res);
						if(res.data.status) {
							let _jdata = JSON.parse(res.data.data);
							this.tableHeader = jdata.header;
							this.tableData = jdata.data;
						} else {
							this.$message({
								type: 'error',
								message: res.data.message,
								center: true
							})
						};
						this.loadingOrderInfo = false
					}).catch((err)=> {
						console.log(err)
						this.$message({
							type: 'error',
							message: err,
							center: true
						})
						this.loadingOrderInfo = false
					})
				},
				btnPrint() {

				}
			}
		})
	}

	that.init = ()=> {
		_this.init();
	}

	return that;
}