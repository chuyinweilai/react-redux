
import React,{Component} from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import "./record.css"
import appData from './../../../../assert/Ajax'
import { LineChart, Line,XAxis,YAxis, CartesianGrid,Tooltip, Legend, ResponsiveContainer } from 'recharts';

class record extends Component{
	constructor(props){
		super(props);
		this.state = {
			tabCtrl:true,
			color:{
				first:'#000',
				second:'#aaa',	
			},
			data:[],
		}
		this.userMess = {};
	}

	componentWillMount(){
		appData._Session('get',"userMess",(res) =>{
			this.userMess = {};
			this._getEvent(res)
		})
	}
	
	componentWillReceiveProps(nextProps){
    if(nextProps.reload !== undefined){
      // this._getEvent()
    }
	}

	_getEvent(mess){
		let afteruri = 'func/tongji'
		let body_1 = {
			'comm_code': "M0001",
			'alert_type': "0",
		}
		let body_2 = {
			'comm_code': "M0002",
			'alert_type': "0",
		}
		let body_3 = {
			'comm_code': "M0003",
			'alert_type': "0",
		}
		appData._dataPost(afteruri,body_1,(res_1) =>{
			appData._dataPost(afteruri,body_2,(res_2) =>{
				appData._dataPost(afteruri,body_3,(res_3) =>{
					let obj = {};
					let arr = []
					res_1.forEach((val,index)=>{
						obj={
							name: val.rec_date,
							wm_1:res_1[index].number_all,
							wm_2:res_2[index].number_all,
							wm_3:res_3[index].number_all,
						}
						arr.unshift(obj)
					})
					this.setState({
						data: arr
					})
				})
			})
		})
	}

	render(){
		return (
			<div id="record-box">	
				<text style={{paddingBottom: 5 , fontSize: 24, color:  this.state.color['first']}}>
						出入记录
				</text>
				<div>
					<ResponsiveContainer height={340}>
						<LineChart data={this.state.data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
							<XAxis dataKey="name" />
							<YAxis/>
							<CartesianGrid strokeDasharray="3 3" />
							<Tooltip wrapperStyle={{height: 60}}/>
							<Legend verticalAlign="top" height={36}/>
							<Line  name="景城平雅苑已处理" type="monotone" dataKey="wm_1" stroke="#1e8fe6" />
							<Line  name="飞碟苑已处理" type="monotone" dataKey="wm_2" stroke="#46BFBD"/>
							<Line  name="西街已处理" type="monotone" dataKey="wm_3" stroke="#ea7c6b"/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		)
	}
}

record.propTypes = {
  reload: PropTypes.number.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1];
  return {
		reload: state.reload
  }
}

export default connect(mapStateToProps)(record)
