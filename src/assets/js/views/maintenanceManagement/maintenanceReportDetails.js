/**
 * created by lanw 2018-04-22
 * 维修报告详情
 */
JGBVue = {
  module: {}
}

JGBVue.module.maintenanceReportDetails = () => {
  let _this = {}, that = {}
  _this.init = (
    maintenanceReportDetailsGetUrl //获取维修报告数据
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          reportDetailsData: [], //维修报告详情
          loadingDetailsData: false, //正在加载维修报告详情
        }
      },
      computed: {
        c_reportId: function() {
          return this.$getQuery(window.location.search).report_id
        },
      },
      methods: {
        /**
         * 获取维修报告数据
         */
        getReportDetailsData: function() {
          this.loadingDetailsData = true
          axios.post(maintenanceReportDetailsGetUrl, {
            report_id: this.c_reportId
          }).then(res=> {
            if(res.data.status) {
              this.reportDetailsData = this.$deepCopy(JSON.parse(res.data.data).manage)
            }
            else {
              this.$message({
                type: 'error',
                message: res.data.message,
                center: true
              })
            };
            this.loadingDetailsData = false
          }).catch(err=> {
            console.error(err)
            this.$message({
              type: 'error',
              message: err,
              center: true
            })
            this.loadingDetailsData = false
          })
        },
      },
      created: function () {
        this.getReportDetailsData()
      }
    })
  }
  that.init = (
    maintenanceReportDetailsGetUrl
  ) => {
    _this.init(
      maintenanceReportDetailsGetUrl
    )
  }
  return that
}

