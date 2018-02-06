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
				loading: false,
				form: {
					usingAudit: false,
					usingTaxes: false,
					defaultTaxRate: 0,
					taxRate1: 0,
					taxRate2: 0,
					hasTax: false,
					usingSupport: false,
					usingSerialNumber: false,
					usingManagement: false,
					usingEarliest: false,
					autoFill: false,
					usingBranchWarehouseCheck: false,
					money: '',
					quantityDigits: 0,
					priceDigits: 0,
					valuationMethod: '',
					usingCheckNegativeOnHand: false
				},
				money: [
					{
						label: 'RMB',
						value: 'RMB'
					}
				],
				valuationMethod: [
					{
						label: '移动平均',
						value: 'move'
					}
				]
			},
			mounted: function() {
				const _self = this;
				axios.get(getDataUrl).then((req)=> {
					let jdata = JSON.parse(req.data.message);
					_self.form = jdata;
				}).catch((err)=> {
					console.log('err', err);
				})
			},
			methods: {
				save() {
					var _self = this;
					this.loading = true;
					axios.post(saveDataUrl, _self.form).then((req)=>{
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