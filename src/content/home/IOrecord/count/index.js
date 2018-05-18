import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
	Row,
} from 'antd';
import {appData, Colors} from './../../../../assert';
import './index.css';

const echarts = require('echarts');
// const rootIp = window.rootIp;
class Count extends Component{
	constructor(props){
		super(props);
		this.state={
			dataSource: {},
			_block1: 0,
			_block2: 0,
			percentage: 0,
			showData: false,
		}
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
		let afturi = "ent_records/v2_getEnteranceRecordType"
		let body ={}
		appData._dataPost(afturi, body, (res)=>{
			if(!res.result){
				this._Charts(res)
			}
		})
	}

  _Charts(data){
    // 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(this.refs.IOCount);
    // 绘制图表
    myChart.setOption({
      color: [Colors.green, Colors.blue, ],
			tooltip: {
				trigger: 'item',
				formatter: "{b}: {c} ({d}%)"
			},
			legend: {
				y: 'bottom',
				textStyle: {color: '#fff'},
				data: ['常驻人口', '暂住人口']
			},
			series: [
				{
					name:'',
					type:'pie',
					radius: ['50%', '60%'],
					avoidLabelOverlap: false,
					label:{
						normal: {
							formatter: '{per|{d}%}  ',
							rich:{
								per: {
									color: '#fff',
									padding: [2, 4],
									fontSize: 14
								}
							}
						}
					},
					data:[
						{
							name: "常驻人口",
							value: data.countD,
						},
						{
							name: "暂住人口",
							value: data.countF,
						},
					],
				}
			]
		});
  }

	render(){
		return(
			<Row className="count-box">
				<h3 className="H2-Title">今日出入人口类型比例</h3>
				<div ref="IOCount" style={{ width: '100%', height: '3.4rem' }}></div>
			</Row>
		)
	}
}

Count.propTypes = {
  reload: PropTypes.number.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1];
  return {
		reload: state.reload
  }
}

export default connect(mapStateToProps)(Count)