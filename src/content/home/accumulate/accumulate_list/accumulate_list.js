
import React, { Component } from 'react';
import { 
	Table, 
} from 'antd'
import appData from './../../../../assert/Ajax';

export default class accumulate_list extends Component {
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
				title: '姓名',
				dataIndex: 'name',
				render: (text)=>{
					return <text style={{color: '#1e8fe6'}}>{text}</text>
				}
			}, 
			{
				colSpan:1,
				title: '手机',
				dataIndex: 'mobile',
			}, 
			{
				colSpan:1,
				title: '性别',
				dataIndex: 'gender',
			},
			{
				colSpan:1,
				title: '当前积分',
				dataIndex: 'score',
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
		let afteruri = 'wxuser/topscore';
		let body = {
			 "comm_code": userMess.comm_code
		}
		appData._dataPost(afteruri,body,(res) => {
			let data = res.data.slice(0, 5);
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
			<text style={{fontSize: 20,paddingBottom: 5,}}>
				积分排名
			</text>
			<Table 
				bordered={true}				
				style={{ height: 154}}
				dataSource={this.state.dataSource} 
				columns={columns} rowKey='key' pagination={false}/>  
		</div>
		);
	}
}