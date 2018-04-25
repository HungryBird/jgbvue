/**
 * created by lanw 2018-4-25
 * 打印客户回访列表
 */
JGBVue = {
	module: {}
};

JGBVue.module.printVisitList = ()=> {
	let _this = {}
	,that = {};

	_this.init = ()=> {
		new Vue({
			el: '#app',
			data: {
        loadingOrderInfo: false, //加载信息状态
        orderInfo: {}, //回访信息
      },
      computed: {
        //回访信息接口
        c_visitListGetUrl: function() {
          return this.$getQuery(window.location.search).url
        },
        c_orderId: function() {
          return this.$getQuery(window.location.search).order_id
        },
      },
			methods: {
        //打印 edit by lanw 2018-4-21
        btnPrint: function() {
          this.$refs.printHeader.style.display = 'none'
          window.print()
          this.$refs.printHeader.style.display = ''
        },
        //获取回访信息
        getOrderInfo: function() {
          this.loadingOrderInfo = true
          axios.post(this.c_visitListGetUrl, {
            order_id: this.c_orderId
          }).then(res=> {
            if(res.data.status) {
              this.orderInfo = JSON.parse(res.data.data)
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
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingOrderInfo = false
          })
        },
      },
      created: function() {
        this.getOrderInfo()
      },
		})
	}

	that.init = ()=> {
		_this.init();
	}

	return that;
}