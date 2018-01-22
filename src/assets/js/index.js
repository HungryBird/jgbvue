new Vue({
	el: '#app',
	data: {
        user: {
          name: '赵某22',
          portrait: './assets/img/index/portrait.png',
          teamName: '我的团队001',
          navItems: [
            {
              id: 'nav_001',
              cls: 'fa fa-home'
            },
            {
              id: 'nav_002',
              cls: 'fa fa-list-ul',
              name: '系统设置',
              menuItems: [
                {
                  /*title: '',*/
                  items: [
                    {
                      id: 'systemParameter',
                      name: '系统参数'
                    },
                    {
                      id: 'phoneInfo',
                      name: '手机信息'
                    },
                    {
                      id: 'auditProcess',
                      name: '审核流程'
                    },
                    {
                      id: 'systemLog',
                      name: '系统日志'
                    },
                    {
                      id: 'customizingTemplate',
                      name: '套打模板'
                    },
                    {
                      id: 'recountCost',
                      name: '重算成本'
                    },
                    {
                      id: 'addedServer',
                      name: '增值服务'
                    }
                  ]
                },
                {
                  /*title: '采购报表',*/
                  items: [
                    {
                      id: 'messageInSite',
                      name: '站内信息'
                    },
                    {
                      id: 'emailMessage',
                      name: '邮件信息'
                    },
                    {
                      id: 'administrativeRegion',
                      name: '行政区域'
                    },
                    {
                      id: 'FBackup',
                      name: '备份与恢复'
                    },
                    {
                      id: 'settlementNAntiSettlement',
                      name: '结账/反结账'
                    },
                    {
                      id: 'reinitialize',
                      name: '重新初始化'
                    }
                  ]
                }
              ]
            },
            {
              id: 'nav_003',
              cls: 'fa fa-group',
              name: '销货',
              menuItems: [
                {
                  title: '销售单据',
                  items: [
                    {
                      id: 'xsdj001',
                      name: '销售订单'
                    },
                    {
                      id: 'xsdj002',
                      name: '销售报表'
                    },
                    {
                      id: 'xsdj003',
                      name: '销售退货单'
                    },
                    {
                      id: 'xsdj004',
                      name: '原始单据'
                    }
                  ]
                },
                {
                  title: '销售报表',
                  items: [
                    {
                      id: 'xsbb001',
                      name: '销售订单跟踪表'
                    },
                    {
                      id: 'xsbb002',
                      name: '销售明细表'
                    },
                    {
                      id: 'xsbb003',
                      name: '销售汇总表(按商品)'
                    },
                    {
                      id: 'xsbb004',
                      name: '销售汇总表(按客户)'
                    },
                    {
                      id: 'xsbb005',
                      name: '销售汇总表(按销售人员)'
                    }

                  ]
                }
              ]
            },
          ]
        },
        action1: [ 
          {
            id: 'ac10001',
            backgroundPosition: '0 -501px',
            activeBakgroundPosition: '0 -521px',
            label: '写日报'
          },
          {
            id: 'ac10002',
            backgroundPosition: '-20px -501px',
            activeBakgroundPosition: '-20px -521px',
            label: '安排任务'
          },
          {
            id: 'ac10003',
            backgroundPosition: '-140px -501px',
            activeBakgroundPosition: '-140px -521px',
            label: '安排日程'
          },
          {
            id: 'ac10004',
            backgroundPosition: '-60px -501px',
            activeBakgroundPosition: '-60px -521px',
            label: '上传文件'
          },
          {
            id: 'ac10005',
            backgroundPosition: '-100px -501px',
            activeBakgroundPosition: '-100px -521px',
            label: '提交申请'
          },
          {
            id: 'ac10006',
            backgroundPosition: '-40px -501px',
            activeBakgroundPosition: '-40px -521px',
            label: '添加项目'
          }
        ],
        action2: [
          {
            id: 'ac20001',
            backgroundPosition: '-80px -501px',
            activeBakgroundPosition: '-80px -521px',
            label: '新建客户'
          },
          {
            id: 'ac20002',
            backgroundPosition: '-120px -501px',
            activeBakgroundPosition: '-120px -521px',
            label: '新建联系人'
          },
          {
            id: 'ac20003',
            backgroundPosition: '-220px -501px',
            activeBakgroundPosition: '-220px -521px',
            label: '客户联系记录'
          }
        ],
        helps: [
          {
            id: 'h001',
            name: '官方QQ群',
            backgroundPosition: '0 -1099px'
          },
          {
            id: 'h002',
            name: '帮助中心',
            backgroundPosition: '-28px -1099px'
          },
          {
            id: 'h003',
            name: '意见反馈',
            backgroundPosition: '-56px -1099px'
          },
          {
            id: 'h004',
            name: '产品反馈',
            backgroundPosition: '-84px -1099px'
          },
          {
            id: 'h005',
            name: '系统更新动态',
            backgroundPosition: '-112px -1099px'
          },
        ],
        activeTab: 'emailInfo',
        tabs: [
          {
            name: 'home',
            label: '首页'
          },
          {
            name: 'emailInfo',
            label: '邮件信息',
            link: 'views/emailInfo.html'
          }
        ],
        locking: {
        	isHidden: true,
          diameter: 0,
          borderWidth: 0
        }
    },
    mounted: function() {
      var widthSquare = Math.pow(document.body.clientWidth, 2);
      var heightSquare = Math.pow(document.body.clientHeight, 2);
      var diameter = Math.ceil(Math.pow(widthSquare+heightSquare, 1/2));
      this.locking.diameter = diameter;
      var tabContent = document.getElementsByClassName('el-tabs__content')[0];
      tabContent.style.height = document.body.clientHeight - 116 + 'px';
    },
    methods: {
      selectTab: function(tabId, tabName) {
        var _self = this;
        for(var i = 0; i < _self.tabs.length; i++) {
          if(_self.tabs[i].name == 'tab' + tabId) {
            _self.activeTab = 'tab' + tabId;
            return;
          }
        }
        var obj = {};
        obj.name = 'tab' + tabId;
        obj.label = tabName;
        obj.link = './views/' + tabId + '.html';
        _self.tabs.push(obj);
        _self.activeTab = obj.name;
      },
      removeTab: function(tabName) {
        var _self = this;
        for(var i = 0; i < _self.tabs.length; i++) {
          if(_self.tabs[i].name == tabName) {
            _self.tabs.splice(i,1);
            _self.activeTab = _self.tabs[i-1].name;
            return;
          }
        }
      },
      lockScreen: function() {
        var _self = this;
      	this.locking.isHidden = false;
        setTimeout(function() {
          _self.locking.borderWidth = _self.locking.diameter/2;
          setTimeout(function() {
            window.location.href = './locking.html';
          }, 1014);
        },delay = 14)
      }
    }
})