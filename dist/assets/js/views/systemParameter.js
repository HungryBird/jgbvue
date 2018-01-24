new Vue({
	el: '#app',
	data: {
		table: null
	},
	mounted: function() {
		const _self = this;
		axios.get('/systemParameter/data_get').then((req)=> {
			let data = JSON.parse(req.data.data);
			_self.table = data;
		}).catch((err)=> {
			console.log('err', err);
		})
	},
	methods: {
		save() {
			var _self = this;
			axios.post('/systemParameter/data_save', _self.table).then((req)=>{
				console.log(req)
				if(req.data.status) {
					_self.$message({
						type: 'success',
						message: req.data.message
					})
				}else{
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