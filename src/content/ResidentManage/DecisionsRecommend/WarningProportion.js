import React,{ Component } from 'react';
import {
  Row,
} from 'antd';

import './index.css';
import { Colors, appData } from './../../../assert/index';
// 引入 ECharts 主模块
const echarts = require('echarts');

class WarningProportion extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: [],
    }
  }

  componentDidMount() {
    this._getEvent()
  }

  _getEvent(){
    let url = 'decision/v2_warning';
    let body = {
      "alert_type":"居民",
      "duration":"month",
    }
    appData._dataPost(url, body, (res) => {
      if(!res.result){
        this._resultDeal(res.data)
      }
    })
  }

  _resultDeal(data){
    let arr = [];
    let name = [];
    const color1 = [Colors.blue, Colors.red, Colors.green, Colors.yellow];
    const color2 = [Colors.blueAlpha, Colors.redAlpha, Colors.greenAlpha, Colors.yellowAlpha];
    data.forEach((val, index) => {
      let obj = {
        value: val.count,
        name: val.name,
        itemStyle:{
          normal : {
            color: color1[index],
            label: {show:false},
            labelLine: {show:false}
          }
        },
        emphasis : {
          color: color2[index],
        }
      };
      name.push(val.name);
      arr.push(obj);
    });
    this._Charts(arr, name)
  }

  _Charts(arr, name){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.refs.warningCharts);
    const pro = this.refs.warningCharts.offsetHeight/500
    
    // 绘制图表
    myChart.setOption({
      title: {
        text: '云社区',
        subtext: 'Developed by \n Shanghai Famesmart',
        x: 'center',
        y: 'center',
        textStyle : {
          color : '#fff',
          fontFamily : '微软雅黑',
          fontSize : 24,
          fontWeight : 'bolder'
        }
      },
      tooltip : {
        show: true,
        formatter: "{b} : {d}%"
      },
      legend: {
        y: 'bottom',
        textStyle: {color: '#fff'},
        data: name
      },
      toolbox: {
          show : false,
          feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              restore : {show: true},
              saveAsImage : {show: true}
          }
      },
      series : {
        name: "",
        type:'pie',
        radius : [135*pro, 150*pro],
        itemStyle : {
          normal: {
            label: {show:false},
            labelLine: {show:false}
          }
        },
        data: arr
      }
    });
  }

  render() {
      return (
        <div>
          <h2 className="H2-Title">预警事件比例</h2>
          <Row>
            <div ref="warningCharts" style={{width: '100%', height: '3rem'}}></div>
          </Row>
        </div>
      );
  }
}

export default WarningProportion;