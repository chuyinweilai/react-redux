
import React, { Component } from 'react';
import { 
	Table, 
	Input, 
	Tag,
	Button, 
	Row,
	Col,
	Pagination,
	Modal,
	message
} from 'antd';
import { appData, Colors } from './../../../assert';
import { Link } from 'react-router-dom';
const Search = Input.Search;

export default class ResidentMessage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			total:0,
			listMess:{},
			pageSum:1,
			pageNum:1,
			comm_name:'',
			SearchType: 'apt_code',
			SearchText:'输入楼层号+房间号查询',
			record: null,

			defaultValue: "",
			_loading: false,
			visible_3: false,
			visible_5: false,
		};
		this.record = {};
		this.addBtn = false;
		this.UserMess = '';
		this.body = {day: "",};
		this.pageNum = 1;
		this.columns = [
			{
				colSpan:1,
				title: 'ID',
				dataIndex: "id" 
			},
			{
				colSpan: 1,
				title: '业主姓名',
				dataIndex: 'name',
			},
			{
				colSpan:1,
				title: '卡号',
				dataIndex: 'printed_id',
			},
			{
				colSpan:1,
				title: '卡片类型',
				dataIndex: 'category',
				render: (text)=><span>{text === "Y"? "业主": "租户" }</span>
			},
			{
				colSpan:1,
				title: '手机',
				dataIndex: 'mobile',
			},
			{
				colSpan:1,
				title: '身份证',
				dataIndex: 'nid',
			},
			{
				colSpan:1,
				title: '性别',
				dataIndex: 'gender',
			},
			{
				colSpan: 1,
				title: '楼号',
				dataIndex: 'unitNo',
			}, 
			{
				colSpan: 1,
				title: '房间号',
				dataIndex: 'flatNo',
			},
			{
				colSpan:1,
				title: '卡片状态',
				dataIndex: 'card_status',
				render: (text)=>{
          if(text){
            return <Tag color='#f69899' style={{
              background: Colors.redAlpha, 
              border: `1px solid ${Colors.red}`
              }}>禁用</Tag>
          } else {
            return <Tag color='#64ea91' style={{
              background: Colors.greenAlpha, 
              border: `1px solid ${Colors.green}`
              }} >正常</Tag>
          }
				}
			},
			{
				title:"操作",
				key:"action",
				colSpan: 1,
				render:(text, record)=>{
					let actions = "禁用";
					let type = "danger";
					// 0:正常,1:已禁用
					if(record.card_status){
						actions = "恢复";
						type = "primary";
					} else {
						actions = "禁用";
						type = "danger";
					}
					return (
						<Row type="flex" justify="space-between">
							<Link to={{
								pathname: '/contant/ResidentManage/ResidentMessage/detail',
								state: { 
									body: this.body,
									record: record , 
									pageNum:this.state.pageNum,
									addBtn: this.addBtn,
								}
							}}><Button type="primary">信息详情</Button></Link>
							<Button type={type} onClick={()=>this._forbidden(record)}>{actions}</Button>
						</Row>
					)
				}
			}
		];
	}

	componentWillMount(){
		appData._Session('get',"userMess",(userMess) =>{
				this.UserMess = userMess;
				let location = this.props.location;
				if(location.state){
					let state = location.state;
					this.setState({
						defaultValue: state.body.search || "",
					})
					this.addBtn = state.addBtn
					this.body = state.body;
					this.addBtn?
					this._dateOver(state.pageNum):
					this._getEvent(state.pageNum);
				} else {
					this._getEvent(1);
				}
		})
	}

	//获取后台信息
	_getEvent(pageNum = 1){
		this.pageNum = pageNum;
		let afteruri = 'residents/v2_show?page=' + pageNum;
		let body = this.body;
		appData._dataPost(afteruri,body,(res) => {
			let data = res.data;
			this.setState({
				total:res.total,
				dataSource: data,
				pageNum:pageNum
			})
		})
	}

	//即将到期用户
	_dateOver(pageNum = 1){
		this.pageNum = pageNum;
		let afteruri = 'residents/v2_expireResi?page=' + pageNum;
		let body = this.body;
		appData._dataPost(afteruri,body,(res) => {
			let data = res.data
			this.setState({
				total:res.total,
				dataSource: data,
				pageNum:pageNum
			})
		})
	}

	// 搜索框
	_searchMob(val){
		let body = {
			"search": val,
		}
		this.body = body;
		this.addBtn?
		this._dateOver():
		this._getEvent(1);
	}

	_handleChange(val){
		this.refs.searchInput.input.refs.input.value = ""
		this.setState({
			defaultSea: ''
		})
		this.body = {day: "",};
		if(val === 'name'){
			this.setState({
				SearchType: 'name',
				SearchText: '请输入用户名'
			})
		} else if(val === 'mobile'){
			this.setState({
				SearchType: 'mobile',
				SearchText: '请输入手机号'
			})
		} else if(val === 'apt_code'){
			this.setState({
				SearchType: 'apt_code',
				SearchText:'输入楼层号+房间号查询'
			})
		}
		this._getEvent(1)
	}

	_action(type,mess){
		if(mess === undefined){
			mess = {}
		}
		mess["history"] = {
			body: this.body,
			pageNum: this.pageNum
		}
		if(type === "change"){
		} else if(type === "detail"){
		}else if(type === "limit"){
			this.addBtn= !this.addBtn;
			if(this.addBtn){
				this.body = {};
				this._dateOver();
			} else {
				this.body = {};
				this._getEvent()
			}
		} 
	}
	
	//禁用IC卡
	_forbidden(obj){
		this.record = obj;		
		this.setState({
			card_status: this.record.card_status,
			visible_5: true,
		})	
	}

	_forbiddenUpdata(){
		let obj = this.record;
		this.setState({
			_loading: true,
		})
		let afteruri = 'residents/v2_setstatus';
		let body = {};
		if(obj.card_status){
			body = {
				"printed_id": obj.printed_id,
				"cmd":"enable"
			}
		} else {
			body = {
				"printed_id": obj.printed_id,
				"cmd":"disable"
			}
		}
		appData._dataPost(afteruri,body,(res) => {
			this.setState({
				visible_5: false,
				_loading: false,			
			});
			if(!res.result){
				message.success("操作成功");
			} else {
				message.error(res.info);
			}
			this._getEvent();
		})
	}

	_sendMess(){
		let afteruri = 'users/smsexp';
		let userMess = this.UserMess;
		let body ={
			"user_name": userMess.name,
			"days":30
		}
		appData._dataPost(afteruri,body,(res) => {
			if(!res.result){
				message.success("发送成功")
			} else {
				message.error(res.info)
			}
			this.setState({
				visible_3: false,
			})
		})
	}

	render() {
		return (
			<Row>
				<Row style={{marginBottom: ".4rem"}}>
					<Col span={16}>
						<Button type={this.addBtn?"danger":"normal"} style={{marginRight: 10}} onClick={()=>this._action("limit")}>即将到期租户</Button>
						<Button style={{visibility:this.addBtn? "visible": "hidden"}} onClick={()=>this.setState({visible_3: true})}>短信提醒</Button>
					</Col>
					<Col span={8}>
						<Search
							className="Part-Search"
							ref="searchInput"
              placeholder = "请输入搜索"
							defaultValue={this.state.defaultValue}
							onChange={e => this._searchMob(e.target.value)}
						/>
					</Col>
				</Row>
				<Table dataSource={this.state.dataSource} columns={this.columns} Key pagination={false} style={{marginBottom: 20}}/> 
				<Row type="flex" justify="end">
					<Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
				</Row>
				<Modal
					className="send-modal"
					visible={this.state.visible_3}
					title="发送短信"
          destroyOnClose = {true}
					onCancel={() => this.setState({visible_3: false})}
					onOk={() => this._sendMess()}
				>
					<h3>即将到期用户{this.state.total}人，是否发送短信</h3>
				</Modal>
				
				<Modal
					visible={this.state.visible_5}
					title="IC卡操作"
          destroyOnClose = {true}
					footer={[
            <Row gutter={8} type="flex" justify="end" key="button">
              <Col>
                <Button size="large" onClick={()=> {this._forbiddenUpdata()}} loading={this.state._loading}>确认</Button>
                <Button size="large" onClick={()=> {this.setState({visible_5: false, _loading: false}); this.record = {}}}>取消</Button>
              </Col>
						</Row>
					]}
				>
					{this.state.card_status?`恢复IC卡:${this.record.printed_id}`:`禁用IC卡:${this.record.printed_id}`}
				</Modal>
			</Row>
		)
	}
}