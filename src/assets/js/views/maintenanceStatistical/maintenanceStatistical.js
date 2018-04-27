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
    dataInfoGetUrl, //获取汇总信息-数据 接口
    detailsSelectGetUrl, //获取详细汇总信息 下拉菜单项
    dataDetailsGetUrl, //获取详细汇总信息-数据 接口
    chartInfoGetUrl, //获取汇总信息-图表 接口
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        let now = new Date()
        let firstDay = `${now.getFullYear()}-${now.getMonth()+1}-1`
        let today = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`
        return {
          selectForm: { //表单
            dateRange: [firstDay, today], //日期范围 *默认当月1日至今
            type: "brand", //汇总分类
          },
          chartsType: "histogram", //图像类型

          dataInfo: { //汇总信息-数据
            total_count:0,
            total_amount:0,
            list: [],
            page: {
              total_page: 1,
              now_page:0
            }
          },
          infoSort: { //汇总表格默认排序
            prop: 'count', 
            order: 'descending'
          },
          loadingInfo: false, //正在加载汇总信息数据表格
          showloadingInfoMore: true, //表格底部加载状态提示

          detailsSelectOptions: [], //详细汇总下拉选择项
          detailsSelectCurrent: '', // 当前下拉项

          dataDetails: { //详细汇总信息-数据
            total_count:0,
            total_amount:0,
            list: [],
            page: {
              total_page: 1,
              now_page:0
            }
          },
          detailsSort: { //详情汇总表格默认排序
            prop: 'count', 
            order: 'descending'
          },
          showloadingDetailsMore: true, //表格底部加载状态提示

          tableHeader: { //表头 *与selectForm.type关联 修改tableHeader[key]请同步
            brand: { //品牌
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
                {prop: 'percent', label: '占比(此型号单数/此品牌总单数)'},
              ]
            },
            type: { //类型
              info: [
                {prop: 'type', label: '类型'},
                {prop: 'count', label: '数量'},
                {prop: 'percent', label: '数量占比'},
                {prop: 'amount', label: '金额(万元)'},
              ],
              details: [
                {prop: 'brand', label: '品牌'},
                {prop: 'count', label: '单数'},
                {prop: 'amount', label: '金额(万元)'},
                {prop: 'percent', label: '占比(此品牌单数/此类型总单数)'},
              ]
            },
            maintenance: { //维修人员
              info: [
                {prop: 'name', label: '姓名'},
                {prop: 'count', label: '工单数量'},
                {prop: 'percent', label: '数量占比'},
                {prop: 'amount', label: '总金额(单位：万元)'},
              ],
              details: [
                {prop: 'brand', label: '品牌'},
                {prop: 'count', label: '单数'},
                {prop: 'amount', label: '金额(万元)'},
                {prop: 'percent', label: '占比(此品牌单数/维修人员总单数)'},
              ]
            },
          },

          chartInfo: {}, //汇总信息 -图表
          chartInfo_chart: {}, //echarts实例
          chartInfo_option: {}, //配置数据
        }
      },
      computed: {
        c_menuId: function() {
          return this.$getQuery(window.location.search).menu_id
        },
      },
      methods: {
        /**
         * 获取详细汇总信息 表格数据
         */
        getDetails: function() {
          let page = this.dataDetails.page
          page.total_page > page.now_page && axios.post(dataDetailsGetUrl, {
            filter: this.selectForm,
            type: this.detailsSelectCurrent,
            sort: this.detailsSort,
            page: page.now_page+1
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.dataDetails.total_amount = _data.total_amount
              this.dataDetails.total_count = _data.total_count
              this.dataDetails.list = _data.page.now_page == 1 
                ? _data.list.concat() 
                : this.dataDetails.list.concat(_data.list)
              this.dataDetails.page = this.$deepCopy(_data.page)
              //最后一页 关闭加载中 显示
              this.showloadingDetailsMore = _data.page.now_page < _data.page.total_page
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
        /**
         * 获取详细汇总信息 下拉菜单项
         * @param {String} query 输入框远程搜索查询
         * @param {Boolean} autoPickUp 获取数据后自动选中第一项
         */
        getDetailsSelect: function(query, autoPickUp) {
          if(arguments.length == 1 && typeof arguments[0] == 'boolean') {
            autoPickUp = query
            query = ''
          }
          axios.post(detailsSelectGetUrl, {
            keyword: query || ''
          }).then(res=> {
            if(res.data.status) {
              this.detailsSelectOptions = JSON.parse(res.data.data)
              if(autoPickUp) {
                this.detailsSelectCurrent = this.detailsSelectOptions[0]
              }
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
        /**
         * 获取汇总信息 表格数据
         */
        getInfo: function() {
          let page = this.dataInfo.page
          page.total_page > page.now_page && axios.post(dataInfoGetUrl, {
            filter: this.selectForm,
            sort: this.infoSort,
            page: page.now_page+1
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.dataInfo.total_amount = _data.total_amount
              this.dataInfo.total_count = _data.total_count
              this.dataInfo.list = _data.page.now_page == 1 
                ? _data.list.concat() 
                : this.dataInfo.list.concat(_data.list)
              this.dataInfo.page = this.$deepCopy(_data.page)
              //最后一页 关闭加载中 显示
              this.showloadingInfoMore = _data.page.now_page < _data.page.total_page
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
        /**
         * 获取汇总信息 图表
         */
        getInfoChart: function() {
          axios.post(chartInfoGetUrl, this.selectForm).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.chartInfo = _data
              this.chartInfo_chart.setOption(this.getOption(this.chartsType, _data), true)
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
        /**
         * 获取图表配置
         * @param {String} type 图表类型
         * @param {Array} data 图表数据
         */
        getOption: function(type, data) {
          if(!data.length) return;
          let option = {}
          switch(type) {
            default:
            case 'pie':
              option = {
                tooltip : {
                  trigger: 'item',
                },
                legend: {
                  orient: 'vertical',
                  left: 'left',
                  data: [] //图例数组
                },
                series : [
                  {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[],
                    itemStyle: {
                      emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }
              data.forEach(item=> {
                option.legend.data.push(item.name)
                item.tooltip = { 
                  formatter: `${item.name}单数：${item.value}，占比${item.percent}，金额${item.amount}元` 
                }
                option.series[0].data.push(item)
              })
              return option
              break
            case 'histogram':
              option = {
                legend: {
                  data: [] //图例数组
                },
                tooltip : {
                  trigger: 'item',
                },
                xAxis: {
                  type: 'category',
                  axisLabel:{
                    interval:0,
                    rotate: 45
                  },
                  axisTick: {
                    interval:0
                  },
                  data: []
                },
                yAxis: {
                  name: '数量',
                  type: 'value'
                },
                // series: [{
                //   data: [],
                //   type: 'bar',
                //   // itemStyle: {
                //   //   normal: {
                //   //     color: new echarts.graphic.LinearGradient(
                //   //       0, 0, 0, 1,
                //   //       [
                //   //         {offset: 0, color: '#83bff6'},
                //   //         {offset: 0.5, color: '#188df0'},
                //   //         {offset: 1, color: '#188df0'}
                //   //       ]
                //   //     )
                //   //   },
                //   // }
                // }]
                series: []
              }
              data.forEach((item, index)=> {
                option.xAxis.data.push(item.name)
                option.legend.data.push(item.name)
                // item.tooltip = { 
                //   formatter: `${item.name}单数：${item.value}，占比${item.percent}，金额${item.amount}元` 
                // }
                // option.series[0].data.push(item)
                let opt = {}
                opt.type = 'bar'
                opt.data = item.value
                opt.name = item.name
                opt.tooltip = { 
                  formatter: `${item.name}单数：${item.value}，占比${item.percent}，金额${item.amount}元` 
                }
                opt.barWidth = '100%'
                // opt.barGap = `${index*10}%`
                option.series.push(opt)          
              })
              return option
              break
            case 'bar':
              option = {
                tooltip : {
                  trigger: 'item',
                },
                xAxis: {
                  name: '数量',
                  type: 'value'
                },
                yAxis: {
                  type: 'category',
                  axisLabel:{
                    interval:0,
                  },
                  axisTick: {
                    interval:0
                  },
                  data: []
                },
                series: [{
                  data: [],
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          {offset: 0, color: '#83bff6'},
                          {offset: 0.5, color: '#188df0'},
                          {offset: 1, color: '#188df0'}
                        ]
                      )
                    },
                  }
                }]
              }
              data.forEach(item=> {
                option.yAxis.data.push(item.name)
                item.tooltip = { 
                  formatter: `${item.name}单数：${item.value}，占比${item.percent}，金额${item.amount}元` 
                }
                option.series[0].data.push(item)
              })
              return option
              break
          }
        },
        /**
         * 汇总信息 表格排序变化
         * @param {Object} obj {column列数据, prop排序字段, order排序方式}
         */
        handleInfoSortChange: function(obj) {
          this.infoSort.prop = obj.prop
          this.infoSort.order =  obj.order
          this.dataInfo.page.now_page = 0
          this.getInfo()
        },
        /**
         * 汇总信息 表格排序变化
         * @param {Object} obj {column列数据, prop排序字段, order排序方式}
         */
        handleDetailsSortChange: function(obj) {
          this.detailsSort.prop = obj.prop
          this.detailsSort.order =  obj.order
          this.dataDetails.page.now_page = 0
          this.detailsSelectCurrent
            ? this.getDetails()
            : this.getDetailsSelect(true)
        },
      },
      watch: {
        selectForm: {
          handler: function() {
            this.dataInfo.page.now_page = 0
            this.getInfo()
            this.getDetailsSelect(true)
            this.getInfoChart()
          },
          deep: true
        },
        detailsSelectCurrent: function() {
          this.dataDetails.page.now_page = 0
          this.getDetails()
        },
        chartsType: function(n, o) {
          this.chartInfo_chart.setOption(this.getOption(n, this.chartInfo), true)
        }
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
            default:
              return val
              break
          }
        },
        dateChinese: function(val) {
          let arr = val.split('-')
          return `${arr[0]}年${Number(arr[1])}月${Number(arr[2])}日`
        },
      },
      created: function () {
        //to do
        this.getInfoChart()
      },
      mounted: function() {
        this.chartInfo_chart = echarts.init(this.$refs.infoChart)
      },
    })
  }
  that.init = (
    dataInfoGetUrl,
    detailsSelectGetUrl,
    dataDetailsGetUrl,
    chartInfoGetUrl
  ) => {
    _this.init(
      dataInfoGetUrl,
      detailsSelectGetUrl,
      dataDetailsGetUrl,
      chartInfoGetUrl
    )
  }
  return that
}

