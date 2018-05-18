import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { appData, Colors } from './../../../../assert';
import { Row, message } from 'antd';

// 引入 ECharts 主模块
import './index.css';
const echarts = require('echarts');
class IOrecent extends Component{
	constructor(props){
		super(props);
		this.state={
			tableInfre: [],
		}
		this.reload = 0;
	}

	componentDidMount(){
		this._getEvent()
	}
	
	componentWillReceiveProps(nextProps){
    if(nextProps.reload !== undefined){
      this._getEvent()
    }
	}

	_getEvent(){
		let afteruri = 'ent_records/v2_getEntranceLine';
		let body = {}
		appData._dataPost(afteruri,body,(res) => {
			if(!res.result){
				this._Charts(res.detail)
			} else {
				message.error(res.info)
			}
		})
	}

  _Charts(datas){
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(this.refs.AnalysisHistory);
		// 绘制图表
		let date = [];
		//暂住
		let countF = [];
		//常驻
		let countD = [];
		datas.forEach(val => {
			date.push(val.date)
			countF.push(val.countF)
			countD.push(val.countD)
		})
    myChart.setOption({
			color: [Colors.purple, Colors.blue],
			tooltip: {
					trigger: 'axis',
					axisPointer: {
							type: 'shadow'
					}
			},
			legend: {
					textStyle: {color: '#fff'},
					data: ['暂住人口', '常住人口'],
			},
			calculable: true,
			xAxis: [
					{
						type: 'category',
						axisTick: {show: false},
						axisLabel:{color: "#fff"},
						axisLine:{lineStyle:{color: '#fff',width: '.1rem'}},
						data: date,
					}
			],
			yAxis: [
					{
							type: 'value',
							axisLabel:{color: "#fff"},
							axisLine:{lineStyle:{color: '#fff'}},
					}
			],
			series: [
        {
					name: '暂住人口',
					type: 'bar',
					barGap: 0,
					data: countF,
        },
        {
            name: '常住人口',
            type: 'bar',
            data: countD,
        }
			]
		})
	}
	
	render (){
		return(
			// 近期出入统计
			<Row className="IOrecent">
				<h3 className="Part-Title">近期出入统计</h3>
				<div className="IOrecent-Charts" ref="AnalysisHistory" style={{ width: '100%', height: '3.4rem' }}></div>
			</Row>
		)
	}
}

IOrecent.propTypes = {
  reload: PropTypes.number.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1];
  return {
		reload: state.reload
  }
}

export default connect(mapStateToProps)(IOrecent)
