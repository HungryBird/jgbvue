/**
 * created by lanw 2018-04-26
 * 打印维修统计报表
 */
JGBVue = {
  module: {}
}

JGBVue.module.printData = () => {
  let _this = {}, that = {}
  _this.init = (
    dataInfoGetUrl, //获取汇总信息-数据 接口
    dataDetailsGetUrl, //获取详细汇总信息-数据 接口
    chartInfoGetUrl, //获取汇总信息-图表 接口
    chartDetailsGetUrl //获取详细汇总信息-图表 接口
  ) => {
    that.vm = new Vue({
      el: '#app',
      data: function () {
        return {
          dataInfo: { //汇总信息-数据
            total_count:0,
            total_amount:0,
            list: [],
          },

          dataDetails: { //详细汇总信息-数据
            total_count:0,
            total_amount:0,
            list: [],
          },

          tableHeader: { //表头 
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

          chartDetails: {}, //汇总信息 -图表
          chartDetails_chart: {}, //echarts实例
          chartDetails_option: {}, //配置数据

          barColor: [ //图表颜色
            '#c23531','#2f4554', '#61a0a8', 
            '#d48265', '#91c7ae','#749f83',  
            '#ca8622', '#bda29a','#6e7074', 
            '#546570', '#c4ccd3'
          ],

        }
      },
      computed: {
        c_menuId: function() {
          return this.$getQuery(window.location.search).menu_id
        },
        c_filter: function() {
          return JSON.parse(this.$getQuery(window.location.search).filter)
        },
        c_print: function() {
          return this.$getQuery(window.location.search).print
        },
        c_select: function() {
          return JSON.parse(this.$getQuery(window.location.search).select)
        },
        c_chart: function() {
          return this.$getQuery(window.location.search).chart
        },
      },
      methods: {
        /**
         * 打印
         */
        btnPrint: function() {
          this.$refs.btnPrint.style.display = 'none'
          document.getElementById('app').style.paddingTop = 0
          window.print()
          this.$refs.btnPrint.style.display = 'flex'
          document.getElementById('app').style.paddingTop = '50px'
        },
        /**
         * 获取详细汇总信息 表格数据
         */
        getDetails: function() {
          axios.post(dataDetailsGetUrl, {
            filter: this.c_filter,
            type: this.c_select,
            all: true //不分页
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.dataDetails = _data
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
         * 获取详细汇总信息 图表
         */
        getDetailsChart: function() {
          axios.post(chartDetailsGetUrl, {
            filter: this.c_filter,
            type: this.c_select,
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.chartDetails = _data
              this.chartDetails_chart.setOption(this.getOption(this.c_chart, _data), true)
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
          axios.post(dataInfoGetUrl, {
            filter: this.c_filter,
            all: true  //不分页 全部
          }).then(res=> {
            if(res.data.status) {
              let _data = JSON.parse(res.data.data)
              this.dataInfo = _data
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
              this.chartInfo_chart.setOption(this.getOption(this.c_chart, _data), true)
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
                series: [{
                  data: [],
                  type: 'bar',
                }]
              }
              data.forEach((item, index)=> {
                option.xAxis.data.push(item.name)
                item.tooltip = { 
                  formatter: `${item.name}单数：${item.value}，占比${item.percent}，金额${item.amount}元` 
                }
                item.itemStyle = {
                  color : this.barColor[index]
                }
                option.series[0].data.push(item)     
              })
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
                }]
              }
              for(let i = data.length-1; i >= 0; i--) {
                let item = data[i]
                option.yAxis.data.push(data[i].name)
                item.tooltip = { 
                  formatter: `${item.name}单数：${item.value}，占比${item.percent}，金额${item.amount}元` 
                }
                item.itemStyle = {
                  color : this.barColor[i]
                }
                option.series[0].data.push(item)
              }
              break
          }
          return option
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
        if(this.c_print == 'all' || this.c_print == 'info') {
          this.getInfo()
          this.getInfoChart()
        }
        if(this.c_print == 'all' || this.c_print == 'details') {
          this.getDetails()
          this.getDetailsChart()
        }
      },
      mounted: function() {
        if(this.c_print == 'all' || this.c_print == 'info') {
          this.chartInfo_chart = echarts.init(this.$refs.infoChart)
        }
        if(this.c_print == 'all' || this.c_print == 'details') {
          this.chartDetails_chart = echarts.init(this.$refs.detailsChart)
        }
      },
    })
  }
  that.init = (
    dataInfoGetUrl,
    dataDetailsGetUrl,
    chartInfoGetUrl,
    chartDetailsGetUrl
  ) => {
    _this.init(
      dataInfoGetUrl,
      dataDetailsGetUrl,
      chartInfoGetUrl,
      chartDetailsGetUrl
    )
  }
  return that
}

