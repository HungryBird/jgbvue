/**
 * created by lanw 2018-05-04
 * 采购计划单
 */
JGBVue = {
  module: {}
}

JGBVue.module.purchasePlanList = () => {
  let _this = {}, that = {}
  _this.init = (
    columnSettingUrl, //获取表头 列设置
    defaultColumnSettingUrl, //获取表头 列设置默认数据
    workOrderDataGetUrl,//获取工单数据
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          selectForm: { //表单
            dateRange: [], //日期范围
            keyword: '', //查询关键词
            checkedOrderStatus: [], //采购计划单选中状态
            checkedPutInStatus: [], //入库选中状态
            sort: { //默认按工单日期排序
              prop: "date",
              order: "descending"
            },
          },
          formOrderStatusCheckAll: true, //绑定采购计划单全选
          formPutInStatusCheckAll: true, //入库全选
          formOrderStatus: [ //采购计划单状态 *value会关联html显示按钮组的判断条件,v-if需同步修改
            { label: '待审核', value: 1 },
            { label: '审核通过', value: 2 },
            { label: '审核不通过', value: 3 },
            { label: '暂存', value: 4 },
            { label: '关闭', value: 5 },
            { label: '作废', value: 6 },
          ],
          formPutInStatus: [ //入库状态 
            { label: '未入库', value: 1 },
            { label: '部分入库', value: 2 },
            { label: '全部入库', value: 3 },
          ],
          tableHeader: [], //表头
          orderList: [], //工单数据
          orderPage: { //工单分页
            page_current: 0,
            page_size: 10,
            page_total: 0,
          }, 
          selectedRows: [], //表格选中行
        }
      },
      computed: {
        c_menuId: function() {
          return this.$getQuery(window.location.search).menu_id
        },
      },
      methods: {
        //获取工单数据
        getWorkOrderData: function() {
          axios.post(workOrderDataGetUrl, {
            filter: this.selectForm,
            page_current: this.orderPage.page_current+1
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.selectedRows = [] //清空选中行
              this.orderList = _data.data
              this.orderPage = this.$deepCopy(_data.page)
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
        //获取表头数据
        getTableHeader: function() {
          axios.post(columnSettingUrl, {
            menu_id: this.c_menuId
          }).then(res=> {
            if(res.data.status) {
              this.tableHeader = JSON.parse(res.data.data)[this.c_menuId]
            }
            else {
              this.$message({
                type: 'error', 
                message: res.data.message,
                center: true
              })
            }
          }).catch(err=> {
            this.$message({
              type: 'error', 
              message: err,
              center: true
            })
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
         * 工单排序
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
        /**
         * 搜索
         */
        search: function() {
          this.getWorkOrderData()
        },
      },
      created: function () {
        //状态默认全选
        this.selectForm.checkedOrderStatus = this.formOrderStatus.concat()
        this.selectForm.checkedPutInStatus = this.formPutInStatus.concat()
        //获取工单数据
        this.getTableHeader()
        this.getWorkOrderData()
      }
    })
  }
  that.init = (
    columnSettingUrl, //获取表头 列设置
    defaultColumnSettingUrl, //获取表头 列设置默认数据
    workOrderDataGetUrl,//获取工单数据
  ) => {
    _this.init(
      columnSettingUrl, //获取表头 列设置
      defaultColumnSettingUrl, //获取表头 列设置默认数据
      workOrderDataGetUrl,//获取工单数据
    )
  }
  return that
}

