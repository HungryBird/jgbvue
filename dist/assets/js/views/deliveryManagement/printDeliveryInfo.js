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
        settingForm: {}, //打印设置
        showPrintSetting: false, //打印设置 窗
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
          this.settingForm.company = this.deliveryInfo.delivery
          this.showPrintSetting = true
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
        /**
         * 修改打印公司信息 - 确定
         * edit by lanw 2018-5-3
         */
        savePrintSetting: function() {
          this.deliveryInfo.delivery = this.settingForm.company
          this.showPrintSetting = false
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