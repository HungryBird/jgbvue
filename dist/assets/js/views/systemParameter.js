'use strict';

new Vue({
	el: '#app',
	data: {
		table: null
	},
	mounted: function mounted() {
		var _self = this;
		axios.get('/systemParameter/data_get').then(function (req) {
			var data = JSON.parse(req.data.data);
			_self.table = data;
		}).catch(function (err) {
			console.log('err', err);
		});
	},
	methods: {
		save: function save() {
			var _self = this;
			axios.post('/systemParameter/data_save', _self.table).then(function (req) {
				console.log(req);
				if (req.data.status) {
					_self.$message({
						type: 'success',
						message: req.data.message
					});
				} else {
					_self.$message({
						type: 'error',
						message: req.data.message
					});
				}
			}).catch(function (err) {
				console.log('err', err);
			});
		}
	}
});