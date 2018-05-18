import React,{ Component } from 'react';
import './index.scss';
import { Colors } from './../../../assert';
// 引入 ECharts 主模块
const echarts = require('echarts');

export default class MotionCharts extends Component{

  componentDidMount() {
    this._Charts(this.props.month_ent)
  }

  _Charts(month_ent){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.refs.MotionCharts);
    // 绘制图表
    myChart.setOption({
      color: [Colors.blue, Colors.red, Colors.green],
      title:{
        text: '当月出入频次',
        textStyle: {
          color: "#fff",
          textAlign: "center",
        },
        x: 'center'
      },
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              data : month_ent.date,
              axisTick: {
                  alignWithLabel: true
              },
              axisLabel:{color: "#fff"},
              axisLine:{lineStyle:{color: '#fff',width: '.1rem'}},
          }
      ],
      yAxis : [
          {
              type : 'value',
              axisLabel:{color: "#fff"},
              axisLine:{lineStyle:{color: '#fff',width: '.1rem'}},
          }
      ],
      series: [
        {
          type:'bar',
          barWidth: '60%',
          data: month_ent.count,
        },
      ]
    });
  }

  render() {
    return <div ref="MotionCharts" style={{ width: '100%', height: '4rem' }}></div>
  }
}