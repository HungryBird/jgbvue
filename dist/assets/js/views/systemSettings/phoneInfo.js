/**
 * [JGBVue description]
 * @type {Object}
 */
JGBVue = {
	module: {}
};

JGBVue.module.phoneInfo = ()=> {
	let _this = {}
	,that = {};

	_this.init = (getDataUrl, saveDataUrl)=> {
		new Vue({
			el: '#app',
			data: {
				formData: {
					messageNumber: 0,
					address: '',
					account: '',
					passKey: ''
				}
			},
			mounted() {
				let _self = this;
				axios.post(getDataUrl).then((req)=> {
					if(req.data.status) {
						let jdata = JSON.parse(req.data.message)
						_self.formData.messageNumber = jdata.messageNumber;
						_self.formData.address = jdata.address;
						_self.formData.account = jdata.account;
						_self.formData.passKey = jdata.passKey;
					}
				})
			},
			methods: {
				save() {
					axios.post(saveDataUrl).then((req)=> {
						if(req.data.status) {
							this.$message({
								type: 'success',
								message: req.data.message
							})
						}else{
							this.$message({
								type: 'error',
								message: req.data.message
							})
						}
					}).catch((err)=> {
						this.$message({
							type: 'error',
							message: err
						})
					});
				}
			}
		});
	}

	that.init = (getDataUrl, saveDataUrl)=> {
		_this.init(getDataUrl, saveDataUrl);
	}

	return that;
}