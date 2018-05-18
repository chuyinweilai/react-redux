import React,{ Component } from 'react';
import {
  Row,
  Col,
} from 'antd';
import { Colors, appData } from './../../../assert';
import './index.css';

// 引入 ECharts 主模块
const echarts = require('echarts');
const colors = [Colors.blue, Colors.red, Colors.green, Colors.yellow, Colors.purple, Colors.HM ]
class DeviceStatus extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: []
    };

  }

  componentDidMount() {
    this._getEvent()
  }

  _getEvent(){
    let url = "device/v2_device_state";
    let body = {};
    appData._dataPost(url, body, (res) =>{
      this.setState({
        dataSource: res,
      })
      this._Charts(res.detail)
    })
  }

  _Charts(data){
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.refs.DeviceStatus);
    let arr_data = []
    let sum = 0;
    data.forEach((val, index) =>{
      let obj = {
        name: val.title,
        value: val.normal
      };
      sum += val.normal;
      arr_data.push(obj);
    })
    // 绘制图表
    myChart.setOption({
      color: colors,
      title: {
        text: sum,
        subtext: '总设备数',
        x: 'center',
        y: 'center',
        textStyle : {
          color : 'rgba(30,144,255,0.8)',
          fontFamily : '微软雅黑',
          fontSize : 24,
          fontWeight : 'bolder'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        show: false,
        orient: 'vertical',
        x: 'left',
      },
      series: [
        {
          // name:'访问来源',
          type:'pie',
          radius: ['70%', '90%'],
          avoidLabelOverlap: false,
          label: {
              normal: {
                  show: false,
                  position: 'center'
              },
          },
          labelLine: {
              normal: {
                show: false
              }
          },
          data:arr_data
        }
      ]
    })
  }

  render(){
    const dataSource = this.state.dataSource;
    return  dataSource.result === 0?
      <Row style={{height: '5rem'}}>
        <Col lg={10} md={24} xs={24} className="DeviceStatus-Charts">
          <div ref="DeviceStatus" style={{ width: '100%', height: '3rem' }}></div>
        </Col>
        <Col lg={14} md={24} xs={24} className="DeviceStatus-Tips">
          <div className="Devicestatus-Top">
            <div className="Devicestatus-Tips">
              <div className="Devicestatus-Tips-Top">{dataSource.total}</div>
              <h2 className="Devicestatus-Tips-Bottom">在线数量</h2>
            </div>
            <div className="Devicestatus-Tips">
              <div className="Devicestatus-Tips-Top">{dataSource.time}</div>
              <h2 className="Devicestatus-Tips-Bottom">运行时间(小时)</h2>
            </div>
          </div>
          <div className="Devicestatus-Bottom">
            <ul className="DevicesTatus-Lengend">
              {dataSource.detail.map((val,index) => {
                return (
                  <li className="DevicesTatus-Lengend-list" key={index}>
                    <span className="block" style={{background: colors[index]}}></span><span className="type">{val.title}</span><span className="number">({val.normal})</span>
                  </li>
                )
              })}
            </ul>
            <div className="DevicesTatus-Abnormal">
              <ul className="DevicesTatus-Abnormal">
                {dataSource.detail.map((val,index) => {
                  return (
                    <li key={index} className="DevicesTatus-Abnormal-list">{val.exception}异常</li>
                  )
                })}
              </ul>
            </div>
          </div>
        </Col>
      </Row>:
      <Row></Row>
        
  }
}

export default DeviceStatus;