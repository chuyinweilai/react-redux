
import React, { Component } from 'react';
import { 
	Table, 
	Input, 
	Button, 
	Row,
	Col,
	Modal,
	message,
	Pagination,
} from 'antd';
import { appData } from './../../../assert';
import './index.scss';

const Search = Input.Search;

export default class ResidentMessage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			total:0,
			pageNum:1,
			visible_1: false,
		};
		this.UserMess = '';
		this.body = {};
		this.pageNum = 1;
		this.device_type = {};
		this.columns = [
			{
				colSpan:1,
				title: 'ID',
				dataIndex: "id" 
			},
			{
				colSpan: 1,
				title: '类别',
				dataIndex: 'device_type',
			},
			{
				colSpan:1,
				title: 'SN',
				dataIndex: 'sn',
			},
			{
				colSpan:1,
				title: 'IP',
				dataIndex: 'ip_addr',
			},
			{
				colSpan:1,
				title: '在线状态',
				dataIndex: 'online',
				filters:[{
					value: 1,
					text: '在线'
				}, {
					value: 0,
					text: '离线'
				}],
				render: (text) => <span>{text?"在线":"离线"}</span>
			},
			{
				colSpan:1,
				title: '设备状态',
				dataIndex: 'healthy',
				filters:[{
					value: 1,
					text: '正常'
				}, {
					value: 0,
					text: '故障'
				}],
				render: (text) => <span>{text?"正常":"故障"}</span>
			},
			{
				colSpan:1,
				title: '所属位置',
				dataIndex: 'location.loc_description',
			},
			{
				title:"操作",
				key:"action",
				colSpan: 1,
				render:(text, record)=> <Button onClick={()=>this._selfChecking(record)}>自检</Button>
			}
		];
	}

	async componentWillMount(){
		appData._Session('get',"userMess",(userMess) =>{
      this.UserMess = userMess;
		})
		await this._getDevice();
		await this._getEvent(1);
	}

	//获取设备列表
	_getDevice(){
		return new Promise((resolve,reject)=>{
			let afteruri = 'device/v2_device_type';
			let body = this.body;
			appData._dataPost(afteruri,body,(res) => {
				if(!res.result){
					let data = res.data;
					let arr = {
						filters: data
					};
					let len =  data.length;
					for(let i = 0; i < len; i++){
						let val = data[i];
						arr[val.value] = val.text;
					}
					this.columns[1] = {
						colSpan: 1,
						title: '类别',
						dataIndex: 'device_type',
						filters: arr.filters,
						render: (text) => <span>{arr[text]}</span>
					};
					this.device_type = arr;
					resolve("success")
				} else {
					this.device_type = {};
					message.error(res.info)
					resolve("fail")
				}
			})
		})
	}

	//获取后台信息
	_getEvent(pageNum = 1){
		return new Promise((resolve,reject)=>{
			this.pageNum = pageNum;
			let afteruri = 'device/v2_device_show?page=' + pageNum;
			let body = this.body;
			appData._dataPost(afteruri,body,(res) => {
				if(!res.result){
					let data = res.data.data;
					this.setState({
						total:res.data.total,
						dataSource: data,
						pageNum:pageNum
					})
					resolve("success")
				} else {
					message.error(res.info)
					resolve("fail")
				}
			})
		})
	}

	// 搜索框
	_searchMob(val){
		let body = {
			"search": val,
		}
		this.body = body;
		this._getEvent(1);
  }
  
  // 自检
  _selfChecking(record){
		let afteruri = 'device/v2_device_deal';
		let body = {
			"device_id":record.id,
		};
		appData._dataPost(afteruri,body,(res) => {
			if(!res.result){
				if(!res.isSuccess) {
					Modal.success({
						className: 'self_check_Modal',
						title: '自检结果',
						content: res.info,
						okText: '确认',
					});
				}
				else Modal.error({
					className: 'self_check_Modal',
					title: '自检结果',
					content: res.info,
					okText: '确认',
				})
			} else {
				Modal.error({
					className: 'self_check_Modal',
					title: '自检结果',
					content: res.info,
					okText: '确认',
				})
			}
		})
  }

	_sorter(pagination, filters, sorter){
		Object.assign(this.body, filters);
		this._getEvent();
	}

	render() {
		return (
			<Row>
				<Row style={{marginBottom: ".4rem"}}>
					<Col span={16}>
					</Col>
					<Col span={8}>
						<Search
							className="Part-Search"
							ref="searchInput"
              placeholder = "请输入搜索"
							onChange={e => this._searchMob(e.target.value)}
						/>
					</Col>
				</Row>
				<Table dataSource={this.state.dataSource} columns={this.columns} Key pagination={false} style={{marginBottom: 20}} onChange={this._sorter.bind(this)}/> 
				<Row type="flex" justify="end">
					<Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
				</Row>
				<Modal
					visible_1 = {this.state.visible_1}
					onOk={()=>this.setState({visible_1: false})}
					onCancle = {null}
				>

				</Modal>
			</Row>
		)
	}
}