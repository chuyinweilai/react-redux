import React,{ Component } from 'react';
import {
  Row,
} from 'antd';

import './index.css';
import { Colors, appData } from './../../../assert/index';
// 引入 ECharts 主模块
const echarts = require('echarts');

class HistoryWarningNumber extends Component{
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
    let url = 'decision/v2_timing';
    let body = {
      "alert_type":"居民",
    }
    appData._dataPost(url, body, (res) => {
      if(!res.result){
        this._Charts(res)
      }
    })
  }

  _Charts(data){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.refs.HistoryWarningNumber);
    const arr = data.timing;
    let name = [];
    let series = [];
    arr.forEach(val => {
      name.push(val.name);
      series.push({
        name: val.name,
        type:'line',
        data: val.count,
      })
    });
    // 绘制图表
    myChart.setOption({
      color: [Colors.blue, Colors.red, Colors.green, Colors.yellow],
      title: {
        text: ''
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
        textStyle: {color: '#fff'},
        data: name,
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.dates,
          axisLabel:{color: "#fff"},
          axisLine:{lineStyle:{color: '#fff',width: '.1rem'}},
      },
      yAxis: {
          type: 'value',
          axisLabel:{color: "#fff"},
          axisLine:{lineStyle:{color: '#fff',width: '.1rem'}},
      },
      series: series
    });
  }

  render() {
    return (
      <Row className="Black-Box">
        <h3 className="Part-Title"><i className="fa fa-bar-chart"></i>历史预警数量</h3>
        <div ref="HistoryWarningNumber" style={{ width: '100%', height: '3.3rem' }}></div>
      </Row>
    );
  }
}

export default HistoryWarningNumber;