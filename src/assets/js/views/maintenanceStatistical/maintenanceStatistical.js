/**
 * created by lanw 2018-04-26
 * 维修统计报表
 */
JGBVue = {
  module: {}
}

JGBVue.module.maintenanceStatistical = () => {
  let _this = {}, that = {}
  _this.init = (
    dataInfoGetUrl //获取汇总信息-数据 接口
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          selectForm: { //表单
            dateRange: [], //日期范围
            type: "brand", //汇总分类
          },
          formTimeRangeDefault: ['00:00:00', '23:59:59'], //表单 默认起止时间
          chartsType: "pie", //图像类型

          dataInfo: { //汇总信息-数据
            total_count:0,
            total_amount:0,
            list: [],
            page: {
              total_page: 1,
              now_page:0
            }
          },
          loadingInfo: false, //正在加载汇总信息数据表格
          showloadingInfoMore: true, //表格底部加载状态提示

          tableHeader: { //表头
            brand: {
              info: [
                {prop: 'brand', label: '品牌'},
                {prop: 'count', label: '数量'},
                {prop: 'percent', label: '数量占比'},
                {prop: 'amount', label: '金额(万元)'},
              ],
              details: [
                {prop: 'type', label: '设备型号'},
                {prop: 'count', label: '单数'},
                {prop: 'amount', label: '金额(万元)'},
                {prop: 'percent', label: '数量占比'},
              ]
            }
          }
        }
      },
      computed: {
        c_menuId: function() {
          return this.$getQuery(window.location.search).menu_id
        },
      },
      methods: {
        /**
         * 获取汇总信息 表格数据
         */
        getInfo: function() {
          let page = this.dataInfo.page
          page.total_page > page.now_page && axios.post(dataInfoGetUrl, {
            filter: this.selectForm,
            page: page.now_page+1
          }).then(res=> {
            this.loadingInfo = false
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.dataInfo.total_amount = _data.total_amount
              this.dataInfo.total_count = _data.total_count
              this.dataInfo.list = _data.page.now_page == 1 
                ? _data.list.concat() 
                : this.dataInfo.list.concat(_data.list)
              this.dataInfo.page = this.$deepCopy(_data.page)
              //最后一页 关闭加载中 显示
              this.showloadingInfoMore = _data.page.now_page != _data.page.total_page
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
      },
      watch: {
        selectForm: {
          handler: function() {
            this.dataInfo.page.now_page = 0
            this.getInfo()
          },
          deep: true
        },
      },
      filters: {
        summaryInfo: function(val) {
          if(!val) return '';
          switch(val) {
            case 'brand':
              return '品牌'
              break
            case 'type':
              return '类型'
              break
            case 'maintenance':
              return '维修人员'
              break
          }
        },
        dateChinese: function(val) {
          let arr = val.split('-')
          return `${arr[0]}年${Number(arr[1])}月${Number(arr[2])}日`
        },
      },
      created: function () {
        //设定初始汇总日期为当月1日至今
        let now = new Date()
        let firstDay = `${now.getFullYear()}-${now.getMonth()+1}-1`
        let today = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
        this.selectForm.dateRange = [firstDay, today]
        // this.getDetailsSelect()
      }
    })
  }
  that.init = (
    dataInfoGetUrl
  ) => {
    _this.init(
      dataInfoGetUrl
    )
  }
  return that
}

