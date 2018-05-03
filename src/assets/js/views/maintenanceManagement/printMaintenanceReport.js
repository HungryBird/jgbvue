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
        settingForm: {}, //打印设置
        showPrintSetting: false, //打印设置 窗
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
        //edit by lanw 2018-5-3 通过媒体查询隐藏打印按钮 js不做操作
        btnPrint: function() { 


          window.print()

          // this.oldHTML = this.$refs.mainContent.innerHTML
          // this.newHTML = this.$refs.printContent.innerHTML
          // this.$refs.mainContent.innerHTML = this.newHTML
          // window.print()
          // this.$refs.mainContent.innerHTML = this.oldHTML
        },
        /**
         * 修改打印公司信息 
         * edit by lanw 2018-5-3
         * 可修改打印预览的公司
         */
        btnPrintSetting: function() {
          this.settingForm.company = this.reportInfo.maintenance_company
          this.showPrintSetting = true
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
        /**
         * 修改打印公司信息 - 确定
         * edit by lanw 2018-5-3
         */
        savePrintSetting: function() {
          this.reportInfo.maintenance_company = this.settingForm.company
          this.showPrintSetting = false
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