
import React, { Component } from 'react';
import { 
	Table, 
	Button, 
	Row,
	Col,
	Pagination,
	Card,
} from 'antd'
import {appData} from './../../../assert';
import { Link } from 'react-router-dom';

export default class IC_deal_detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			count: 1,
			total:0,
			pageNum:1,
		};

		this.columns = [
			{
				colSpan:1,
				title: 'ID',
				dataIndex: 'id',
			},
			{
				colSpan:1,
				title: '卡号',
				dataIndex: 'printed_id',
			},
			{
				colSpan: 1,
				title: '处理类型',
				dataIndex: 'action',
				render:(text, record)=>{
					if(text  === 2){
						return <text style={{color: '#1a85bd'}}>恢复卡</text>
					} else if(text === 1) {
						return <text style={{color: '#dc4937'}}>禁用卡</text>
					} else{
						return <text style={{color: '#e47833'}}>消息推送</text>
					}
				}
			},
			{
				colSpan: 1,
				title: '处理人',
				dataIndex: 'user_name',
			},
			{
				colSpan: 1,
				title: '处理时间',
				dataIndex: 'push_date'
			},
			{
				colSpan: 1,
				title: '推送手机号',
				dataIndex: 'push_to',
			},
			{
				colSpan: 1,
				title: '推送对象',
				dataIndex: 'push_to_type'
			},
		];
		this.mess = null;
		this.body = {};
	}

	componentWillMount(){
		this.mess = this.props.location.state;
		this.body = {
			"printed_id":this.mess.record.access_number,
		};
		this._getEvent(1)
	}
	
	//操作栏功能
	_action(type,mess){
		if(type === "back"){
			this.props.changePage("index", this.props.message)
		} 
	}

	//分页器activity/list?page=num
	_getEvent(pageNumber){
		let afteruri = 'sms_records/search?page=' + pageNumber;
		let body = this.body
		body["per_page"] = 10
		appData._dataPost(afteruri,body,(res) => {
			let data = res.data;
			let len = data.length;
			this.setState({
				total:res.total,
				dataSource: data,
				count:len,
				pageNum:pageNumber
			})
		})
	}

	render() {
		let columns = this.columns;
		return (
			<Card title="可疑卡号/处理详情"  style={{border: '1px solid #ccc'}} noHovering 
			 extra={
				<Link to={{
					pathname:'/contant/ResidentManage/IntradayWarning/Dubious',
					state: this.mess
				}}>
					<Button>返回</Button>
				</Link> }
			> 
				<Row type="flex">
					<Col span={24} style={{marginTop: 32}}>
						<Table size="big" bordered dataSource={this.state.dataSource} columns={columns} rowKey='id' pagination={false} style={{marginBottom: 20}}/> 
						<Row type="flex" justify="end" className="printHidden">
							<Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
						</Row>
					</Col>
				</Row>
			</Card>
		);
	}
}