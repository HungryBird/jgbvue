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
				rules:{
					/*quantityDigits: [
						{min: 0, message: '不能小于0', trigger: 'blur'}
					],
					priceDigits: [
						{min: 0, message: '不能小于0', trigger: 'blur'}
					]*/
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
					},
					{
						label: '先进先出',
						value: 'firstInFirstOut'
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
			},
			watch: {
				'form.quantityDigits'(val) {
					if(Number(val) <= 0 || isNaN(Number(val))) {
						this.form.quantityDigits = 0;
						return;
					}
					this.form.quantityDigits = Number(val);
				},
				'form.priceDigits'(val) {
					if(Number(val) <= 0 || isNaN(Number(val))) {
						this.form.priceDigits = 0;
						return;
					}
					this.form.quantityDigits = Number(val);
				}
			}
		});
	}

	that.init = (getDataUrl, saveDataUrl)=> {
		_this.init(getDataUrl, saveDataUrl);
	}

	return that;
}