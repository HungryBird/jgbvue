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
        //工单菜单id
        c_mid: function() {
          return this.$getQuery(window.location.search).mid
        },
        //获取表头的接口地址
        c_headerUrl: function() {
          return this.$getQuery(window.location.search).hurl
        },
      },
			methods: {
        //打印 edit by lanw 2018-4-21
        btnPrint: function() {
          this.$refs.printHeader.style.display = 'none'
          window.print()
          this.$refs.printHeader.style.display = ''
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
              // console.log(this.orderInfo)
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
        //获取工单表头
        getOrderHeader: function() {
          axios.post(this.c_headerUrl, {
            menu_id: this.c_mid
          }).then(res=> {
            if(res.data.status) {
              this.orderHeader = JSON.parse(res.data.data)[this.c_mid]
              //正常接口请使用下句
              // this.orderHeader = JSON.parse(res.data.data)
              // console.log(this.orderHeader)
            }
            else {
              this.$message({
                type: 'error', 
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            console.log(err)
            this.$message({
              type: 'error', 
              message: err,
              center: true
            })
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
        this.getOrderHeader()
        // console.log(window.location.search)
      },
		})
	}

	that.init = ()=> {
		_this.init();
	}

	return that;
}