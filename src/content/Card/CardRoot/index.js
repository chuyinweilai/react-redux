
import React,{Component} from 'react';
import { Row, Col, Input, Table, Pagination, message } from 'antd'
import { appData } from './../../../assert';
import './index.scss';
const Search = Input.Search;
export default class CardRoot extends Component{
	constructor(props){
		super(props);
		this.state={
			dataSource: [],
			pageNum: 1,
			total: 0,
		}
		this.columns = [
			{
				title: '区域',
				dataIndex: 'loc_description',
			},{
				title: '更新状态',
				dataIndex: 'flag',
				render: (text)=>{
					let value = "失败"
					if(text === 1) value = "已更新"
					else if(text === 2) value = "失败"
					else if(text === 0) value = "待更新"
					return <span>{value}</span>
				}
			},{
				title: '有效时间',
				dataIndex: 'exp_at',
			}
		]
	}

	_getEvent(num = 0){
		if(num.length === 7){
			let url = "cardAuth/v2_show";
			let body = {
				"printed_id": num
			}
			appData._dataPost(url, body, (res) => {
				if(!res.result){
					this.setState({
						dataSource: res.data,
					})
				} else {
					message.error(res.info)
				}
			})
		}
	}

	render(){
		return (
			<div>
				<h2 className="card-root-title">卡片权限</h2>
				<Row type="flex">
					<Col span={12}></Col>
					<Col span={12}>
						<Search
							className="card-root-search"
							placeholder="输入卡号"
							onChange={e => this._getEvent(e.target.value)}
						/>
					</Col>
				</Row>
				<Table dataSource={this.state.dataSource} columns={this.columns} rowKey='device_id' pagination={false} className="card-root-table"/> 
				<Row type="flex" justify="end">
					<Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
				</Row>
			</div>
		)
	}
}