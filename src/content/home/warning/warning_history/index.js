import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {Row, Table,  } from 'antd';
import { appData, Colors} from './../../../../assert';
import './index.css';
class warningHistory extends Component {
	constructor(props){
		super(props);
		this.state = {
			data:[]
		}
		this.columns = [
			{
				title:'区域',
				colSpan: 1,
				dataIndex:'unitAddress',
			},
			{
				title:'报警发生时间',
				colSpan: 1,
				dataIndex:'created_at',
			},
			{
				title:'报警内容',
				colSpan: 1,
				dataIndex:'alarm_info',
			},
			{
				title:'状态',
				colSpan: 1,
				dataIndex:'status',
				render:(text,record)=>{
					if(record.status === "新建"){
						return <span style={{color: Colors.green}}>{text}</span>
					} else if(record.status === "分发"){
						return <span style={{color: "#8fc9fb"}}>{text}</span>
					} else if(record.status === "处理中"){
						return <span style={{color: "rgb(246, 152, 153)"}}>{text}</span>
					} else {
						return <span style={{color: "#aaa"}}>{text}</span>
					}
				}
			},
			{
				title:'处理人',
				colSpan: 1,
				dataIndex:'agent_name',
			}
		]
	}

	componentWillMount(){
		this.Router = this.props.Router;
		this.mess = this.props.message;
		this.setState.flag = 0
		this._getEvent()
	}
	
	componentWillReceiveProps(nextProps){
    if(nextProps.reload !== undefined){
      this._getEvent()
    }
	}
	
	_getEvent(){
		let afteruri = 'comm_alerts/v2_search';
		let body={
			per_page:4
		}
		appData._dataPost(afteruri, body, (res) => {
			this.setState({
				data: res.data
			})
		})
	}
	
	render() {
		return (
			<Row className="WarningHistory">
				<h3 className="Part-Title">报警历史记录</h3>
				<Table className="WarningHistory-Table" pagination={false} showHeader={true} columns={this.columns} rowKey='id' dataSource={this.state.data} />
			</Row>
			)
	}
}

warningHistory.propTypes = {
  reload: PropTypes.number.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1];
  return {
		reload: state.reload
  }
}

export default connect(mapStateToProps)(warningHistory)
