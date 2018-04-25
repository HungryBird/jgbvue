/**
 * created by lanw 2018-4-22
 * 打印维修报告
 */
JGBVue = {
	module: {}
};

JGBVue.module.printOrder = ()=> {
	let _this = {}
	,that = {};

	_this.init = (
    reportInfoGetUrl //获取维修报告
  )=> {
		new Vue({
			el: '#app',
			data: {
        loadingOrderInfo: false, //加载工单信息状态
        reportInfo: {}, //工单信息
        oldHTML: "",
        newHTML: "",
      },
      computed: {
        c_orderId: function() {
          return this.$getQuery(window.location.search).order_id
        },
        c_reportId: function() {
          return this.$getQuery(window.location.search).report_id
        },
      },
			methods: {
        //打印  edit by lanw 2018-4-21
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
          axios.post(reportInfoGetUrl, {
            report_id: this.c_reportId
          }).then(res=> {
            if(res.data.status) {
              // console.log(res.data.data)
              let _data = JSON.parse(res.data.data)
              this.reportInfo = JSON.parse(_data.data)
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
        c_ordertId: function() {
          this.getOrderInfo()
        },
        c_reportId: function() {
          this.getOrderInfo()
        },
      },
      created: function() {
        this.getOrderInfo()
      },
		})
	}

	that.init = (
    reportInfoGetUrl
  )=> {
		_this.init(
      reportInfoGetUrl
    );
	}

	return that;
}