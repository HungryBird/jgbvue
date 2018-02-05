JGBVue = {
	module: {}
};

JGBVue.module.guidance = ()=> {
	let _this = {}
	,that = {};

	_this.init = ()=> {
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
					axios.post('/guidance/keeping_show', this.form).then((data)=> {
						//
					}).catch((err)=> {
						console.log('err', err);
					})
				}
			}
		})
	}

	that.init = ()=> {
		_this.init();
	}

	return that;
}