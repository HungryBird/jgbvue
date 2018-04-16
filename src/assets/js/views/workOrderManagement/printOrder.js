JGBVue = {
	module: {}
};

JGBVue.module.printOrder = ()=> {
	let _this = {}
	,that = {};

	_this.init = (
    orderInfoGetUrl //获取工单信息
  )=> {
		new Vue({
			el: '#app',
			data: {
        loadingOrderInfo: false, //加载工单信息状态
        orderInfo: {}, //工单信息
      },
      computed: {
        c_orderId: function() {
          let search = window.location.search
          return search.split('=')[1]
        },
      },
			methods: {
        //打印
        btnPrint: function() {
          //
        },
        //获取工单信息
        getOrderInfo: function() {
          console.log(orderInfoGetUrl)
          this.loadingOrderInfo = true
          axios.post(orderInfoGetUrl, {
            order_id: this.c_orderId
          }).then(res=> {
            if(res.data.status) {
              console.log(res.data.data)
              this.orderInfo = JSON.parse(res.data.data).order_data
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingOrderInfo = false
          }).catch(err=> {
            console.log(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingOrderInfo = false
          })
        },
      },
      watch: {
        c_orderId: function() {
          this.getOrderInfo()
        },
      },
      created: function() {
        this.getOrderInfo()
      },
		})
	}

	that.init = (
    orderInfoGetUrl
  )=> {
		_this.init(
      orderInfoGetUrl
    );
	}

	return that;
}