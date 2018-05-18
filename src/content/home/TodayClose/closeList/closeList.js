
import React,{Component} from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Row,
  Col,
} from 'antd'
import "./closeList.css"
import { appData, Colors} from './../../../../assert';

class CloseList extends Component{
	constructor(props){
		super(props);
		this.state = {
			data:[],
		}
		this.reload = 0;
	}

	componentWillMount(){
		this._getEvent()
	}
	
	componentWillReceiveProps(nextProps){
    if(nextProps.reload !== undefined){
      this._getEvent()
    }
	}

	_getEvent(){
		let afteruri = 'comm_alerts/v2_search';
		let body = {
			"perpage": 5,
			filter: "(status = '关闭')"
		}
		appData._dataPost(afteruri,body,(res) =>{
			let adata = [];
			if(res.total > 5){
				adata = res.data.slice(0,5)
			} else {
				adata = res.data
			}
			this.setState({
				data: adata,
			})
		})
	}

	render(){
		return (
			<Row className="CloseList" >
				<h3 className="Part-Title" >任务完成情况</h3>
				<div className="CloseList-Box" >
				{
					this.state.data.map((val,index)=>{
						let time  = "";
						if(val.created_at){
							time = val.created_at.slice(-8,-3)
						} else {
							time = "（时间未知！）"
						}
						return (
							<Row key={index} type="flex" className="CloseList-list" >
								<Col span={2}>
									<div className="CloseList-Circle" style={{background: Colors.green}}></div>
								</Col>
								<Col span={22}>
									<span className="CloseList-Title">{val.agent_name}完成{val.unitAddress}{time}的{val.type.title}报警</span>
								</Col>
							</Row>
						)
					})
				}
				</div>
			</Row>
		)
	}
}


CloseList.propTypes = {
  reload: PropTypes.number.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1];
  return {
		reload: state.reload
  }
}

export default connect(mapStateToProps)(CloseList)

