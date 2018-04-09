/**
 * created by lanw 2018-04-03
 * 角色管理
 */
JGBVue = {
  module: {}
}

JGBVue.module.workOrderManagement = () => {
  let _this = {}, that = {}
  _this.init = (
    businessDataGetUrl, //获取业务人员数据
    maintenanceDataGetUrl,//获取维修人员数据
    workOrderDataGetUrl//获取工单数据
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          selectForm: { //表单
            dateRange: [], //日期范围
            businessCurrent: '',//业务人员
            maintenanceCurrent: '', //维修人员
            keyword: '', //查询关键词
            checkedStatus: [], //工单状态
            sort: { //默认按工单日期排序
              prop: "date",
              order: "descending"
            },
          },
          formTimeRangeDefault: ['00:00:00', '23:59:59'], //表单 默认起止时间
          formBusinessList: [], //表单 业务人员组
          formMaintenanceList: [], //表单 维修人员组
          formOrderStatus: [ //工单状态 *value会关联html显示按钮组的判断条件,v-if需同步修改
            { label: '委派', value: 0 },
            { label: '待接', value: 1 },
            { label: '待诊断', value: 2 },
            { label: '诊断中', value: 3 },
            { label: '待报价', value: 4 },
            { label: '报价中', value: 5 },
            { label: '待维修', value: 6 },
            { label: '维修中', value: 7 },
            { label: '完成维修', value: 8 },
            { label: '待交付', value: 9 },
            { label: '交付中', value: 10 },
            { label: '已交付', value: 11 },
            { label: '作废', value: 12 },
            { label: '撤回/退回', value: 13 },
          ],
          formStatusCheckAll: true, //绑定工单状态全选

          orderList: [], //工单数据
          orderPage: { //工单分页
            page_current: 0,
            page_size: 10,
            page_total: 0,
          }, 
          tableHeader: [], //表头
        }
      },
      methods: {
        //查询
        search: function() {
          if(!this.selectForm.keyword.length) {
            this.$message({
              type:'error',
              message: '请输入查询关键词'
            })
            return;
          }
          this.getWorkOrderData()
        },
        //获取业务人员数据
        getBusinessData: function() {
          axios.post(businessDataGetUrl).then().catch()
        },
        //获取维修人员数据
        getMaintenanceData: function() {
          axios.post(maintenanceDataGetUrl).then().catch()
        },
        //获取工单数据
        getWorkOrderData: function() {
          axios.post(workOrderDataGetUrl, {
            filter: this.selectForm,
            page_current: this.orderPage.page_current+1
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.orderList = _data.data
              this.orderPage = this.$deepCopy(_data.page) //真实数据使用
              if(!this.tableHeader.length) {
                this.tableHeader = _data.header.concat()
              }
            }
            else {
              this.$alert(res.data.message, '提示')
            };
          }).catch(err=> {
            this.$alert(err, '提示')
          })
        },
        /**
         * 工单状态 全选
         * @param {Boolean} val 全选的状态
         */
        handleFormCheckAllChange: function(val) {
          this.selectForm.checkedStatus = val ? this.formOrderStatus.concat() : []
          this.getWorkOrderData()
        },
        /**
         * 工单状态 单选
         * @param {Array} value 选中的{label, value}
         */
        handleFormCheckStatusChange: function(value) { 
          let checkedCount = value.length;
          this.formStatusCheckAll = checkedCount === this.formOrderStatus.length;
          this.getWorkOrderData()
        },
        /**
         * 按工单日期排序
         * @param {Object} obj { column行属性, prop, order排序方式}
         */
        handleOrderSort: function(obj) {
          // console.log(obj.column, obj.prop, obj.order)
          this.selectForm.sort = {
            prop: obj.prop,
            order: obj.order
          }
          this.getWorkOrderData()
        },
        //工单 分页
        handleOrderCurrentChange: function(val) {
          this.getWorkOrderData()
        },
      },
      created: function () {
        //工单状态默认全选
        this.selectForm.checkedStatus = this.formOrderStatus.concat()
        //获取工单数据
        this.getWorkOrderData();
      }
    })
  }
  that.init = (
    businessDataGetUrl,
    maintenanceDataGetUrl,
    workOrderDataGetUrl
  ) => {
    _this.init(
      businessDataGetUrl,
      maintenanceDataGetUrl,
      workOrderDataGetUrl)
  }
  return that
}

