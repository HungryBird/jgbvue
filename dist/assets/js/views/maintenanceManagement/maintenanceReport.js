/**
 * created by lanw 2018-04-22
 * 维修报告信息
 */
JGBVue = {
  module: {}
}

JGBVue.module.maintenanceReport = () => {
  let _this = {}, that = {}
  _this.init = (
    maintenanceReportGetUrl //获取维修报告数据
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          orderList: [], //维修报告列表
          selectedRows: "", //选中行

          showReport: false, //查看维修报告 窗
          reportDetailsUrl:"", //查看维修报告页面的路径

          showReportAddForm: true, //新增
          reportAddForm: {}, //新增维修报告表单数据
          defaultReportAddForm: { //新增维修报告默认空数据
            title: "",
            order_id: "",
            date: "",
            base_info: {
              order_date: "",
              client_name: "",
              maintenance_company: "",
              equipment_name: "",
              equipment_category: "",
              equipment_brand: "",
              equipment_source: "",
              
            },
          }, 
          loadingTempStorage: false, //正在写入数据
        }
      },
      computed: {
        c_menuId: function() {
          return this.$getQuery(window.location.search).menu_id
        },
        c_orderId: function() {
          return this.$getQuery(window.location.search).order_id
        },
      },
      methods: {
        /**
         * 新增
         */
        btnAdd: function() {
          this.reportAddForm = this.$deepCopy(this.defaultReportAddForm)
          this.showReportAddForm = true
        },
        /**
         * 查看
         * @param {Object} row 行数据
         * @param {Number} index 行
         */
        btnView: function(row, index) {
          this.showReport = true
          this.reportDetailsUrl = `./maintenanceReportDetails.html?menu_id=maintenanceReportDetails&&report_id=${row.report_id}`
        },
        /**
         * 打印
         */
        btnPrint: function() {
          //调用父级框架打开标签页
          this.$selectTab(
            'printMaintenanceReport', 
            '打印维修报告', 
            './views/maintenanceManagement/printMaintenanceReport.html', 
            `order_id=${this.selectedRows[0].order_id}&&report_id=${this.selectedRows[0].report_id}`)
        },
        /**
         * 新增维修报告 - 暂存、确认
         * @param {String} type temp暂存 submit确认
         */
        btnTempStorage: function(type) {},
        /**
         * 获取维修报告数据
         */
        getReportData: function() {
          axios.post(maintenanceReportGetUrl, {
            order_id: this.c_orderId
          }).then(res=> {
            if(res.data.status) {
              this.orderList = JSON.parse(res.data.data)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
          })
        },
        //工单 选择项发生变化时触发  val 选中的row数据
        handleOrderSelectionChange: function(val) {
          this.selectedRows = val.concat()
        },
      },
      created: function () {
        this.getReportData()
      }
    })
  }
  that.init = (
    maintenanceReportGetUrl
  ) => {
    _this.init(
      maintenanceReportGetUrl
    )
  }
  return that
}

