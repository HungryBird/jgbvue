JGBVue = {
	module: {}
};

JGBVue.module.guidance = ()=> {
	let _this = {}
	,that = {};

	_this.init = (keepingShowUrl)=> {
		new Vue({
			el: '#app',
			data: {
				form: {
					neverShow: false
				}
			},
			mounted() {
				//
			},
			methods: {
				keepingShow() {
					this.neverShow = !this.neverShow;
					axios.post(keepingShowUrl, this.form).then((data)=> {
						//
					}).catch((err)=> {
						console.log('err', err);
					})
				}
			}
		})
	}

	that.init = (keepingShowUrl)=> {
		_this.init(keepingShowUrl);
	}

	return that;
}