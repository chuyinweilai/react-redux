import React,{ Component } from 'react';
import {
  Row,
} from 'antd';
import { appData, Colors } from './../../../assert';
import './index.css';

// 引入 ECharts 主模块
const echarts = require('echarts');

class AnalysisDoor extends Component{
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
    let url = 'decision/v2_hotgates';
    let body = {
      "alarm_type":"通道",
      "alarm_info":"门未关",
      "count":7,
    }
    appData._dataPost(url, body, (res) => {
      if(!res.result){
        this._resultDeal(res.data)
      }
    })
  }

  _resultDeal(data){
    let xValue = [];
    let yValue = [];
    data.forEach(val => {
      xValue.push(val.loc_description);
      yValue.push(val.count);
    });
    this._Charts(xValue, yValue)
  }

  _Charts(xValue, yValue){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.refs.AnalysisDoor);
    // 绘制图表
    myChart.setOption({
      color: [Colors.blue, Colors.red, Colors.green],
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      grid: {
        top: "3%",
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis : {
        type : 'category',
        data : xValue,
        axisLabel:{color: "#fff"},
        axisLine:{lineStyle:{color: '#fff',width: '.1rem'}},
      },
      yAxis : {
        type : 'value',
        axisLabel:{color: "#fff"},
        axisLine:{lineStyle:{color: '#fff',width: '.1rem'}},
      },
      series: [
        {
          type:'bar',
          barMaxWidth: '30px',
          data: yValue
        },
      ]
    });
  }

  render() {
    return (
      <Row>
        <h3 className="Part-Title" >热点位置(门未关)</h3>
        <div ref="AnalysisDoor" style={{ width: '100%', height: '2.8rem' }}></div>
      </Row>
    );
  }
}

export default AnalysisDoor;