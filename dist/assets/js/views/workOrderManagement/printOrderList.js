/**
 * created by lanw 2018-4-16
 * 打印工单列表
 * 在window.location.search中包含2个参数 参数分隔符：&&
 * @param {String} filter 经过encodeURI()转码的 JSON字符串 工单列表的筛选条件
 * @param {String} url 获取工单列表的接口
 */
JGBVue = {
	module: {}
};

JGBVue.module.printOrderList = ()=> {
	let _this = {}
	,that = {};

	_this.init = ()=> {
		new Vue({
			el: '#app',
			data: {
        loadingOrderInfo: false, //加载工单信息状态
        orderHeader: {}, //表头
        orderInfo: {}, //工单信息
      },
      computed: {
        //工单筛选条件
        c_orderFilter: function() {
          let filter = this.$getQuery(window.location.search).filter
          return JSON.parse(filter)
        },
        //工单接口
        c_orderInfoGetUrl: function() {
          return this.$getQuery(window.location.search).url
        },
      },
			methods: {
        //打印
        btnPrint: function() {
          //
        },
        //获取工单信息
        getOrderInfo: function() {
          this.loadingOrderInfo = true
          axios.post(this.c_orderInfoGetUrl, {
            filter: this.c_orderFilter
          }).then(res=> {
            if(res.data.status) {
              // console.log(res.data.data)
              let _data = JSON.parse(res.data.data)
              this.orderHeader = _data.header
              this.orderInfo = _data.data
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
        c_orderFilter: function() {
          this.getOrderInfo()
        },
        c_orderInfoGetUrl: function() {
          this.getOrderInfo()
        },
      },
      created: function() {
        this.getOrderInfo()
        // console.log(window.location.search)
      },
		})
	}

	that.init = ()=> {
		_this.init();
	}

	return that;
}