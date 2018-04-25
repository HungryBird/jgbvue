/**
 * created by lanw 2018-4-24
 * 打印交付单
 */
JGBVue = {
	module: {}
};

JGBVue.module.printDeliveryInfo = ()=> {
	let _this = {}
	,that = {};

	_this.init = (
    deliveryInfoGetUrl //获取维修报告
  )=> {
		new Vue({
			el: '#app',
			data: {
        loadingDeliveryInfo: false, //加载工单信息状态
        deliveryInfo: {}, //工单信息
        oldHTML: "",
        newHTML: "",
      },
      computed: {
        c_orderId: function() {
          return this.$getQuery(window.location.search).order_id
        },
        c_deliveryId: function() {
          return this.$getQuery(window.location.search).delivery_id
        },
        c_showPrintButton: function() {
          return this.$getQuery(window.location.search).show_print_button
        },
      },
			methods: {
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
        getDeliveryInfo: function() {
          this.loadingDeliveryInfo = true
          axios.post(deliveryInfoGetUrl, {
            delivery_id: this.c_deliveryId
          }).then(res=> {
            if(res.data.status) {
              console.log(res.data.data)
              this.deliveryInfo = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingDeliveryInfo = false
          }).catch(err=> {
            console.log(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingDeliveryInfo = false
          })
        },
      },
      watch: {
        c_ordertId: function() {
          this.getDeliveryInfo()
        },
        c_deliveryId: function() {
          this.getDeliveryInfo()
        },
      },
      created: function() {
        this.getDeliveryInfo()
      },
		})
	}

	that.init = (
    deliveryInfoGetUrl
  )=> {
		_this.init(
      deliveryInfoGetUrl
    );
	}

	return that;
}