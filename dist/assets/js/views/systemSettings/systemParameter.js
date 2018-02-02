JGBVue = {
	module: {}
};

JGBVue.module.systemParameter = ()=>{
	const _this = {}
	,that = {};

	_this.init = (getDataUrl, saveDataUrl)=> {
		new Vue({
			el: '#app',
			data: {
				table: [],
				loading: false
			},
			mounted: function() {
				const _self = this;
				axios.get(getDataUrl).then((req)=> {
					let jdata = JSON.parse(req.data.message);
					_self.table = jdata;
				}).catch((err)=> {
					console.log('err', err);
				})
			},
			methods: {
				save() {
					var _self = this;
					this.loading = true;
					axios.post(saveDataUrl, _self.table).then((req)=>{
						if(req.data.status) {
							this.loading = false;
							_self.$message({
								type: 'success',
								message: req.data.message
							})
						}else{
							this.loading = false;
							_self.$message({
								type: 'error',
								message: req.data.message
							})
						}
					}).catch((err)=>{
						console.log('err', err);
					})
				}
			}
		});
	}

	that.init = (getDataUrl, saveDataUrl)=> {
		_this.init(getDataUrl, saveDataUrl);
	}

	return that;
}