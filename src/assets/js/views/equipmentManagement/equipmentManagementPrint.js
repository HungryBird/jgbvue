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
				//this.getTableData();
				console.log('this.$getQuery(window.location.search): ', this.$getQuery(window.location.search));
			},
			method: {
				getUrl: function() {
					return this.$getQuery(window.location.search).url
				},
				getTableData() {
					this.loadingOrderInfo = true;
					axois.post(this.getUrl).then((res)=> {
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
			},
			watch: {
				//
			}
		})
	}

	that.init = ()=> {
		_this.init();
	}

	return that;
}