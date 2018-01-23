'use strict';

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
	mounted: function mounted() {
		var _self = this;
		axios.post('/phoneInfo/data_get_data').then(function (req) {
			if (req.data.status) {
				var jdata = JSON.parse(req.data.message);
				_self.formData.messageNumber = jdata.messageNumber;
				_self.formData.address = jdata.address;
				_self.formData.account = jdata.account;
				_self.formData.passKey = jdata.passKey;
			}
		});
	},

	methods: {
		save: function save() {
			var _this = this;

			var _self = this;
			axios.post('/phoneInfo/data_save').then(function (req) {
				if (req.data.status) {
					_this.$message({
						type: 'success',
						message: req.data.message
					});
				} else {
					_this.$message({
						type: 'error',
						message: req.data.message
					});
				}
			}).catch(function (err) {
				_this.$message({
					type: 'error',
					message: err
				});
			});
		}
	}
});