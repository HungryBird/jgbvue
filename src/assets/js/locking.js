new Vue({
	el: '#app',
	data: {
		pic: './assets/img/locking/pic.jpg',
		unlockingPassword: '',  //'1234'
		isHide: true,
		startAnimation: false,
		endAnimation: false,
		isShowInput: false,
		isStartMove: false,
		isMoving: false
	},
	mounted: function() {
		_self = this;
		setTimeout(function() {
			_self.start();
		}, 100);
	},
	methods: {
		start: function() {
			var _self = this;
			this.isHide = false;
			setTimeout(function() {
				_self.startAnimation = true;
			}, 14)
		},
		unlocking: function() {
			if(this.unlockingPassword != '1234') {
				this.$message.error('密码是1234！');
			}else{
				window.location.href = './index.html';
			}
		},
		showInput: function() {
			var _self = this;
			this.isShowInput = true;
			setTimeout(function() {
				_self.isStartMove = true;
				setTimeout(function() {
					_self.isMoving = true;
				},delay = 14);
			}, 500)
		}
	},
	watch: {
		startAnimation: function(val) {
			if(val) {
				this.endAnimation = true;
			}
		}
	}
})