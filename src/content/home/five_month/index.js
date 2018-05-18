import React,{ Component } from 'react';
import {
  Row,
  message
} from 'antd';
import './index.css';

import { Colors,appData } from './../../../assert';
// 引入 ECharts 主模块
const echarts = require('echarts');

export default class FiveMonth extends Component{
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
		let afteruri = 'comm_alerts/v2_timingAll';
		let body = {}
		appData._dataPost(afteruri,body,(res) => {
      if(res.result) this._Charts(res)
      else message.error(res.info)
		})
	}

  _Charts(data){
    // 基于准备好的dom，初始化echarts实例
    let dates = data.dates;
    let series = []
    data.timing.forEach(val => {
      let atim = val.timing;
      let response = [];
      let handle = [];
      let reObj = {};
      let haObj = {};
      for(let tim of atim){
        response.push(tim.response?tim.response: 0)
        handle.push(tim.handle?tim.handle: 0)
      }
      reObj = {
          name: `${val.alarm_type}平均响应速度`,
          type:'line',
          data: response,
      }
      haObj = {
          name: `${val.alarm_type}平均处理速度`,
          type:'line',
          data: handle,
      }
      series.push(reObj, haObj);
    });

    var myChart = echarts.init(this.refs.FiveMonth);
    // 绘制图表
    myChart.setOption({
      color: [Colors.HM, Colors.KL,Colors.KR,Colors.ML,Colors.M,Colors.K],
      title: {
        text: ''
      },
      tooltip: {
          trigger: 'axis'
      },
      legend: {
				textStyle: {color: '#fff'},
				data: ['居民平均响应速度', '居民平均处理速度','通道平均响应速度', '通道平均处理速度','设备平均响应速度', '设备平均处理速度']
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
				axisLabel:{color: "#fff"},
				axisLine:{lineStyle:{color: '#fff',width: '.1rem'}},
				data: dates
      },
      yAxis: {
				type: 'value',
				axisLabel:{color: "#fff"},
				axisLine:{lineStyle:{color: '#fff',width: '.1rem'}},
      },
      series:series
    });
  }

  render() {
    return (
			<Row className="FiveMonth">
				<h3 className="Part-Title">居民违规事件反应及处理速度</h3>
				<div ref="FiveMonth" style={{ width: '100%', height: '3.9rem' }}></div>
			</Row>
    );
  }
}