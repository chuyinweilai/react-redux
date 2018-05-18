
import React, { Component } from 'react';
import { 
	Table, 
} from 'antd'
import appData from './../../../../assert/Ajax';
import './accumulate_exchange.css'

export default class accumulate_exchange extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			count: 1,
			total:0,
			listMess:{},
			pageSum:1,
			pageNum:1,
		};

		this.columns = [
			{
				colSpan:1,
				title: '名称',
				dataIndex: 'gift_name',
				render: (text)=>{
					return <text style={{color:  '#1e8fe6'}}>{text}</text>
				}
			}, 
			{
				colSpan:1,
				title: '总数量',
				dataIndex: 'change_limit',
			},
			{
				colSpan:1,
				title: '已兑换数量',
				dataIndex: 'change_cnt',
				render: (text)=>(
					<text style={{color: '#FF8C00'}}>{text}</text>
				)
			},
			{
				colSpan:1,
				title: '兑换积分',
				dataIndex: 'change_score',
				render: (text)=>(
					<text style={{color: '#ea7c6b'}}>{text}</text>
				)
			}, 
		];
		
		this.Router = null;
		this.mess = null;
	}

	componentWillMount(){
		this.Router = this.props.Router;
		this.mess = this.props.message;
		appData._Session('get',"userMess",(res) =>{
			this.userMess = res
			this._getEvent()
		})
	}

	_jump(nextPage,mess){
		this.Router(nextPage,mess,this.mess.nextPage)
	}

	//获取后台信息
	_getEvent(){
		let userMess = this.userMess;
		let afteruri = 'gift/list';
		let body = {
			 "comm_code": userMess.comm_code
		}
		appData._dataPost(afteruri,body,(res) => {
			let data = res.slice(0, 5);
			let len = data.length;
			this.setState({
				total:res.total,
				dataSource: data,
				count:len,
			})
		})
	}
	
	//操作栏功能
	_action(type,mess){
		if(type=== "sign"){
			this._jump('activity_sign', mess)
		} else if(type === "change"){
			this._jump('activity_add', mess)
		}else if(type === "refuse"){
			
		}
	}

	render() {
		let columns = this.columns;
		return (
		<div style={{ padding: 15, backgroundColor: '#fff', minHeight: 358}}>
			<text style={{fontSize: 20,paddingBottom: 5, }}>
				兑换热度表
			</text>
			<Table 
				style={{ height: 154}}
				bordered={true}
				dataSource={this.state.dataSource} 
				columns={columns} rowKey='key' pagination={false}/>  
		</div>
		);
	}
}