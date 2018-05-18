
import React, { Component } from 'react';
import { 
	Table, 
	Button, 
	Row,
	Pagination,
} from 'antd';
import './index.scss';
import { Link } from 'react-router-dom';
import { appData }  from './../../../assert';

export default class User_Manager extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			total:0,
			pageNum:1,
		};

		this.columns = [
			{
				colSpan:1,
				title: 'ID',
				dataIndex:"id",
				render:(text,record,index) => {
					return(
						<text>{index+1}</text>
					)
				}
			},
			{
				colSpan:1,
				title: '用户名',
				dataIndex:"name",
			},
			{
				colSpan:1,
				title: '账号',
				dataIndex:"mobile",
			},
			{
				colSpan:1,
				title: '等级',
				dataIndex:"auth_lvl",
			},
		];
	}

	componentWillMount(){
		this.Router = this.props.Router;
		this.mess = this.props.message;
		appData._Session("get", "history",(res)=>{
			if(res){
				this._getEvent(res.pageNum);
				appData._Session("del", "history")
			} else {
				this._getEvent(1);
			}
		})
	}
	
	//操作栏功能
	_action(){
		appData._Session("set", "history",{ pageNum: this.state.pageNum})
	}

	//分页器activity/list?page=num
	_getEvent(pageNumber = 1){
		let afteruri = 'users/search?page=' + pageNumber;
		let body = {}
		appData._dataPost(afteruri,body,(res) => {
			let data = res.data;
			this.setState({
				total:res.total,
				dataSource: data,
				pageNum:pageNumber
			})
		})
	}

	render() {
		let columns = this.columns;
		return (
			<div>
				<Link to="/contant/System/User_Manager/add"><Button style={{backgroundColor: 'rgba(0,0,0,0)', marginBottom: '.4rem'}} onClick={()=>this._action()}>新建</Button></Link>	
				<Table dataSource={this.state.dataSource} columns={columns} rowKey='id' pagination={false} style={{marginBottom: 20}}/> 
				<Row type="flex" justify="end">
					<Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
				</Row>
			</div>
		);
	}
}