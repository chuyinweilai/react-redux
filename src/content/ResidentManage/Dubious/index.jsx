import React,{ Component } from 'react';

import {
	Row,
	Col,
	Input,
	Select,
	Table,
	Pagination,
	Modal,
	Tag,
	Button,
	AutoComplete,
	message
} from 'antd';  
import { Link } from 'react-router-dom';
import { appData, } from './../../../assert';

const Search = Input.Search;
const Option = Select.Option;

export default class Dubious extends Component {
  constructor(props){
		super(props);
		this.state = {
			dataSource: [],
			count: 1,
			total:0,
			pageNum:1,
			changePage: true,
			_visible: false,

			dateBtn: '7日内陌生人检测',
			sendBtn: false,
			sendMess: "",
			pageName: 'index',
			loading: false,

			defaultSea: "",
			defaultSel: "卡号",
			SearchType: 'access_number',
			SearchText: '请输入卡号',
			cardUser: false,
		};
		
		this.columns = [
			{
				colSpan:1,
				title: 'ID',
				dataIndex: 'id',
				render:(text,record,index) =>(
					<text>{index + 1}</text>
				)
			},
			{
				colSpan:1,
				title: '卡号',
				dataIndex: 'access_number',
			},
			{
				colSpan:1,
				title: '手机号',
				dataIndex: 'mobile',
			},
			{
				colSpan:1,
				title: '楼号房间号',
				dataIndex: 'owner_code',
			},
			{
				colSpan:1,
				title: '异常次数',
				dataIndex: 'cnt',
				sorter: true,
			},
			{
				colSpan:1,
				title: '待定次数',
				dataIndex: 'cnt_wait',
				sorter: true,
			},
			{
				colSpan:1,
				title: '正常次数',
				dataIndex: 'cnt_yes',
				sorter: true,
			},
			{
				colSpan:1,
				title: '处理次数',
				dataIndex: 'cnt_send',
				sorter: true,
				render:(text, record)=>{
					return (
						<Row type="flex" justify="space-between">
							<span>{text?text:0}</span>
							<Link to={{
								pathname:'/contant/ResidentManage/IntradayWarning/Dubious/DubiousDeal',
              	state: { record: record }
							}}>
								<Button>处理详情</Button>
							</Link> 
						</Row>
					)
				}
			},
			{
				colSpan:1,
				title: '卡片状态',
				dataIndex: 'card_status',
				render:(text, record)=>{
					return  text === 1 ?<Tag color='#f69899'>已禁用</Tag>: <Tag color='#64ea91'>未禁用</Tag>
				},
        filters: [{
          text: '已禁用',
          value: '已禁用',
        }, {
          text: '未禁用',
          value: '未禁用',
        }],
			},
			{
				colSpan: 3,
				title:"操作",
				key:"action",
				render:(text, record)=>{
					let actions = "禁用";
					let type = "danger";
					if(record.card_status){
						actions = "恢复";
						type = "primary";
					} else {
						actions = "禁用";
						type = "danger";
					}
					return (
						<Row type="flex" justify="space-between">
							<Button type={type} onClick={()=>this._forbidden(record)}>{actions}</Button>
							<Link to={{
								pathname:'/contant/ResidentManage/IntradayWarning/Dubious/DubiousUnusual',
								state: { record: record }
							}}>
								<Button>异常详情</Button>
							</Link> 
							<Button onClick={() =>this._action('sendcard',record)}>提醒持卡人</Button>
							<Button onClick={() =>this._action('message',record)}>通知管理员</Button>
						</Row>
					)
				}
			}
		];
		this.Router = {};
		this.userMess = {};
		this.filter = [1,2,3,4,5];
		this.dateType = false;
		this.pageNum = 1;
		this.sendPhone = '暂无手机号';
		this.mess = {};
		this.record = {};
		this.MobileList = [];
		this.MobileMess = {};
		this.body = {
			flag: 1,
		};
  }

  componentWillMount(){
		appData._Session('get',"userMess",(userMess) =>{
			this.userMess = userMess;
			this._getEvent()
		})
  }
	
	_getEvent(pageNumber = 1){
		let afteruri = 'entrance_records/statistics3?page=' + pageNumber;
		let body = this.body
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

  // table筛选相关
  _sorter(pagination, filters, sorter){
    let body = this.body
    if(Object.getOwnPropertyNames(sorter).length){
      body[sorter.field] = sorter.order;
    }
    this.body = body;
    this._getEvent(1, this.state.openList)
  }

	//操作栏功能
	_action(type,mess){
		if(type === "message"){
			this.setState({
				cardUser: false,
				_visible: true,
			})
			this.record = mess;
		}else if(type === "sendcard"){
			this.setState({
				cardUser: true,
				_visible: true,
			})
			this.record = mess;
			this.sendPhone = mess.mobile;
		} 
	}

	//禁用IC卡
	_forbidden(obj){
		this.record = obj;	
		this.setState({
			card_status: this.record.card_status,
			visible_1: true,
		})	
	}

	_forbiddenUpdata(){
		let obj = this.record;		
		this.setState({
			_loading: true,
		})
		let userMess = this.userMess;
		let afteruri = 'dist_devices/setstatus';
		let body = {};
		// card_status: 0 进行禁用，1进行恢复
		if(obj.card_status){
			body = {
				"owner_code": obj.owner_code,
				"printed_id": obj.access_number,
				"cmd":"enable",
				"user_name": userMess.name
			}
		} else {
			body = {
				"owner_code": obj.owner_code,
				"printed_id": obj.access_number,
				"cmd":"disable",
				"user_name": userMess.name
			}
		}
		appData._dataPost(afteruri,body,(res) => {
			this.setState({
				visible_1: false,
				_loading: false,			
			})
			message.error(res.info)
			this._getEvent()
		})
	}

	_handleChange(val){
		this.refs.searchInput.input.refs.input.value = ""
		if( val === "owner_code"){
			this.setState({
				SearchType: 'owner_code',
				SearchText: '请输入楼号房间号'
			})
		} else if( val === "mobile"){
			this.setState({
				SearchType: 'mobile',
				SearchText: '请输入手机号'
			})
		} else if(val === "access_number"){
			this.setState({
				SearchType: 'access_number',
				SearchText: '请输入卡号'
			})
		}
	}

	_MobileChange(val){
		let regexp = /^1\d{10}$/;
		if(regexp.test(val)){
			this.sendPhone = val;
			this.setState({
				sendMess: "",
				sendBtn: false,
			})
		} else {
			this.setState({
				sendMess: "*请输入正确的手机号格式",
				sendBtn: true,
			})
		}
	}

	_sendMess(){
		let body = {
			"printed_id": this.record.access_number,
			"push_to": this.sendPhone,
			"user_name":this.userMess.name,
			"push_to_type":this.state.cardUser?"持卡人":"管理员",
		}
		this.setState({
			loading: true,
		});
		appData._dataPost("sms_records/add",body,(res) => {
			if(res.result === 1 ){
				this.setState({
					sendMess: "发送成功",
					sendBtn: false,
					loading: false,
				})
				this.sendPhone = '暂无手机号';
				setTimeout(()=>{this.setState({_visible: false, sendMess: ""})}, 2000);
			} else {
				this.setState({
					sendMess: "发送失败",
					sendBtn: true,
					_visible: false,
					loading: false,
				})
				setTimeout(()=>{this.setState({_visible: false,sendMess: ""})}, 2000);
			}
		});
	}

	_goBack(){
		this.props.history.push('/contant/ResidentManage/IntradayWarning');
	}

	render(){
		return (
			<Row> 
				<Row>
					<Link to="/contant/ResidentManage/IntradayWarning/Stranger">
						<span>陌生人检测</span>
					</Link>	
					<span style={{fontSize: '18px', color: 'gray', margin:'0 5px'}}>|</span>
					<span style={{fontSize: '16px'}} >可疑卡号</span>
				</Row>
				<Button onClick={this._goBack.bind(this)}>返回</Button>
				<Row type="flex" style={{justifyContent: 'flex-end', marginBottom: '16px'}}>
					<Col lg={12} md={12} xs={24}>
						<Search
							ref="searchInput"
							className="printHidden"
							defaultValue={this.state.defaultSea}
							placeholder={this.state.SearchText}
							style={{ minWidth: 200, maxWidth: 300 }}
							// onChange={e => this._searchMob(e.target.value)}
						/>
						<Select
							defaultValue={this.state.defaultSel}
							style={{width: 100, marginLeft: 20}}
							// onChange={this._handleChange.bind(this)}
						>
							<Option key="printed_id">卡号</Option>
							<Option key="mobiled">手机号</Option>
							<Option key="owner_code">楼号房间号</Option>
						</Select>
					</Col>
				</Row>
				<Table dataSource={this.state.dataSource} columns={this.columns} rowKey='key' pagination={false} style={{marginBottom: 20}} onChange={this._sorter.bind(this)}/> 
				<Row type="flex" justify="end" className="printHidden">
					<Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
				</Row>

				<Modal
					title ={"推送报警"}
          destroyOnClose = {true}
					visible={this.state._visible}
					onCancel={() => {this.setState({_visible: false, sendBtn: true});this.sendPhone = '暂无手机号'}}
					footer={[
            <Button key="back" onClick={() => {this.setState({_visible: false, sendBtn: true});this.sendPhone = '暂无手机号'}}>取消</Button>,
            <Button key="submit" type="primary" onClick={() => {this._sendMess()}} loading={this.state.loading} disabled={!this.state.cardUser?this.state.sendBtn:false}>
              确认
            </Button>
					]}	
				>
					<div>
						向手机号：
						{
							this.state.cardUser?
							<span>{this.sendPhone}</span>:
							<AutoComplete
								dataSource={this.MobileList}
								onChange={e => this._MobileChange(e)}
								style={{ width: 200 , margin:'0 10px'}}
								filterOption={(inputValue, option) =>
									option.props.children.indexOf(inputValue) !== -1
								}
							/>
						}
					推送报警信息
					</div>
					<h4 style={{fontSize: '14px', color: this.state.sendBtn?"red":"green"}}>{this.state.sendMess}</h4>
				</Modal>
				<Modal
          destroyOnClose = {true}
					visible={this.state.visible_1}
					title="IC卡操作"
					footer={[
            <Row gutter={8} type="flex" justify="end" key="button">
              <Col>
                <Button size="large" onClick={()=> {this._forbiddenUpdata()}} loading={this.state._loading}>确认</Button>
                <Button size="large" onClick={()=> {this.setState({visible_1: false, _loading: false}); this.record = {}}}>取消</Button>
              </Col>
						</Row>
					]}
				>
					{this.state.card_status?`恢复IC卡:${this.record.access_number}`:`禁用IC卡:${this.record.access_number}`}
				</Modal>
			</Row>
		);
	}

}