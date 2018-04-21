/**
 * created by lanw 2018-4-15
 * 打印工单
 */
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
        oldHTML: "",
        newHTML: "",
      },
      computed: {
        c_orderId: function() {
          return this.$getQuery(window.location.search).order_id
        },
      },
			methods: {
        //打印
        btnPrint: function() {
          this.oldHTML = this.$refs.mainContent.innerHTML
          // console.log(this.oldHTML)
          this.newHTML = this.$refs.printContent.innerHTML
          // console.log(this.newHTML)
          this.$refs.mainContent.innerHTML = this.newHTML
          window.print()
          this.$refs.mainContent.innerHTML = this.oldHTML
        },
        //获取工单信息
        getOrderInfo: function() {
          this.loadingOrderInfo = true
          axios.post(orderInfoGetUrl, {
            order_id: this.c_orderId
          }).then(res=> {
            if(res.data.status) {
              // console.log(res.data.data)
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