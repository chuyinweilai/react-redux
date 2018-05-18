import React, { Component } from 'react';

import {
	Row,
	Col,
	Input,
	Table,
	Pagination,
	Modal,
	Tag,
	Menu,
	Button,
	message,
	AutoComplete,
	Dropdown,
} from 'antd';
import { Link } from 'react-router-dom';
import { Colors, appData } from './../../../assert';
import './index.scss';
const Search = Input.Search;

export default class Stranger extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			total: 0,
			pageNum: 1,
			changePage: true,
			_visible: false,

			dateBtn: '7日内陌生人检测',
			sendBtn: false,
			sendMess: "",
			pageName: 'index',
			loading: false,

			defaultSea: "",
			defaultSel: "卡号",
			SearchText: '请输入卡号',
			cardUser: false,
		};

		this.columns = [
			{
				colSpan: 1,
				title: 'ID',
				dataIndex: 'id'
			},
			{
				colSpan: 1,
				title: '卡号',
				dataIndex: 'resident.printed_id',
			},
			{
				colSpan: 1,
				title: '姓名',
				dataIndex: 'resident.name',
			},
			{
				colSpan: 1,
				title: '楼号房间号',
				dataIndex: 'flatNo',
				render: (text, record) => <span>{record.unitN0o || 0}-{text}</span>
			},
			{
				colSpan: 1,
				title: '异常次数',
				dataIndex: 'alarm_detail',
				render: (text, record) => {
					return (
						<Row type="flex" justify="space-between">
							<span>{text ? text : 0}</span>

						</Row>
					)
				}
			},
			{
				colSpan: 1,
				title: '状态',
				dataIndex: 'status',
				filters: [
					{
						text: '新建',
						value: '新建',
					}, {
						text: '处理中',
						value: '处理中',
					}, {
						text: '关闭',
						value: '关闭',
					}
				],
				render: (text, it) => {
					const status = {
						新建: { border: `1px solid ${Colors.green}`, background: Colors.greenAlpha, color: 'white' },
						处理中: { border: `1px solid ${Colors.red}`, background: Colors.redAlpha, color: 'white' },
						关闭: { border: `1px solid ${Colors.yellow}`, background: Colors.yellowAlpha, color: 'white' },
					}
					return <Tag style={status[it.status]}>{`${text}`}</Tag>
				},
			},
			{
				colSpan: 1,
				title: '卡片状态',
				dataIndex: 'resident.card_status',
				render: (text, record) => {
					return text === 1 ? <Tag color='#f69899'>已禁用</Tag> : <Tag color='#64ea91'>未禁用</Tag>
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
				title: "操作",
				key: "action",
				render: (text, record) => {
					let actions = "禁用";
					let type = "danger";
					if (record.resident.card_status) {
						actions = "恢复";
						type = "primary";
					} else {
						actions = "禁用";
						type = "danger";
					}
					return (
						<Row type="flex" justify="space-between">
							<Button type={type} onClick={() => this._forbidden(record)}>{actions}</Button>
							<Link to={{
								pathname: '/contant/ResidentManage/IntradayWarning/Stranger/UnusualDetail',
								state: { record: record }
							}}>
								<Button>异常详情</Button>
							</Link>
							<Link to={{
								pathname: '/contant/ResidentManage/IntradayWarning/Stranger/DealDetail',
								state: { record: record }
							}}>
								<Button>处理详情</Button>
							</Link>
							<Dropdown overlay={
								<Menu onClick={(e) => this._action(e.key, record)}>
									<Menu.Item key={'sendcard'}>提醒持卡人</Menu.Item>
									<Menu.Item key={'message'}>通知管理员</Menu.Item>
								</Menu>}>
								<a >推送短信</a>
							</Dropdown>

							<Dropdown overlay={
								<Menu onClick={(e) => this._fastdeal(record.id, e.key)}>
									{record.dealType.map((val, index) => <Menu.Item key={val}>{val}</Menu.Item>)}
								</Menu>}>
								<a >快速处理</a>
							</Dropdown>
						</Row>
					)
				}
			}
		];
		this.Router = {};
		this.userMess = {};
		this.filter = [1, 2, 3, 4, 5];
		this.dateType = false;
		this.pageNum = 1;
		this.sendPhone = '暂无手机号';
		this.record = {};
		this.MobileList = [];
		this.MobileMess = {};
		this.body = {
			flag: 0,
		};
	}

	componentWillMount() {
		appData._Session('get', "userMess", (userMess) => {
			this.userMess = userMess;
			this._getEvent()
		})
	}

	_getEvent(pageNumber = 1) {
		let afteruri = 'residents/v2_search?page=' + pageNumber;
		appData._dataPost(afteruri, this.body, (res) => {
			let data = res.data;
			this.setState({
				total: res.total,
				dataSource: data,
				pageNum: pageNumber
			})
		})
	}

	//快速处理
	_fastdeal(id = 0, closure_code = "等待处理", comments = "") {
		let userMess = this.userMess;
		let url = "comm_alerts/v2_close";
		let body = {
			"id": id,
			"agent_id": userMess.id,
			"closure_code": closure_code,
			"comments": comments,
		}
		appData._dataPost(url, body, (res) => {
			if (!res.result) {
				this.setState({ visible_1: false })
				message.success("处理成功")
				this._getEvent()
			} else {
				message.error(res.info)
			}
		})
	}

	// table筛选相关
	_sorter(pagination, filters, sorter) {
		let body = this.body
		if (Object.getOwnPropertyNames(sorter).length) {
			body[sorter.field] = sorter.order;
		}
		body["card_status"] = filters["resident.card_status"]
		this.body = body;
		this._getEvent(1)
	}

	//操作栏功能
	_action(type, mess) {
		if (type === "message") {
			this.setState({
				cardUser: false,
				_visible: true,
			})
			this.record = mess;
		} else if (type === "sendcard") {
			this.setState({
				cardUser: true,
				_visible: true,
			})
			this.record = mess;
			this.sendPhone = mess.resident.mobile;
		}
	}

	//禁用IC卡弹出窗
	_forbidden(obj) {
		this.record = obj;
		this.setState({
			card_status: this.record.resident.card_status,
			visible_1: true,
		})
	}

	// 禁用卡交互
	_forbiddenUpdata() {
		let obj = this.record;
		this.setState({
			_loading: true,
		})
		let afteruri = 'residents/v2_setstatus';
		let body = {};
		// card_status: 0 进行禁用，1进行恢复
		if (obj.resident.card_status) {
			body = {
				"printed_id": obj.resident.printed_id,
				"cmd": "enable",
			}
		} else {
			body = {
				"printed_id": obj.resident.printed_id,
				"cmd": "disable",
			}
		}
		appData._dataPost(afteruri, body, (res) => {
			if (!res.result) {
				this.setState({
					visible_1: false,
					_loading: false,
				})
				message.success(res.info);
				this._getEvent()
			} else {
				message.error(res.info);
			}
		})
	}

	// 搜索框
	_searchMob(val) {
		this.body = {
			flag: 0,
			"search": val,
		};
		this._getEvent(1)
	}

	// 输入手机号
	_MobileChange(val) {
		let regexp = /^1\d{10}$/;
		if (regexp.test(val)) {
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

	// 发送短信
	_sendMess() {
		let body = {
			"printed_id": this.record.resident.printed_id,
			"push_to": this.sendPhone,
			"user_id": this.userMess.id,
			"push_to_type": this.state.cardUser ? "持卡人" : "管理员",
		}
		this.setState({
			loading: true,
		});
		appData._dataPost("sms_card/v2_add", body, (res) => {
			if (!res.result) {
				this.setState({
					sendBtn: false,
					loading: false,
					_visible: false,
					sendMess: ""
				})
				this.sendPhone = '';
				message.success(res.info)
			} else {
				this.setState({
					sendBtn: true,
					loading: false,
					_visible: false,
					sendMess: ""
				})
				message.error(res.info)
			}
		});
	}

	_goBack() {
		this.props.history.push('/contant/ResidentManage/IntradayWarning');
	}

	render() {
		return (
			<Row>
				<Row type="flex" className="Stranger-title">
					<Col lg={12} md={12} xs={24}>
						<Button onClick={this._goBack.bind(this)}>返回</Button>
					</Col>
					<Col lg={12} md={12} xs={24}>
						<Search
							ref="searchInput"
							className="printHidden"
							defaultValue={this.state.defaultSea}
							placeholder={this.state.SearchText}
							onChange={e => this._searchMob(e.target.value)}
						/>
					</Col>
				</Row>
				<Table dataSource={this.state.dataSource} columns={this.columns} rowKey='id' pagination={false} style={{ marginBottom: 20 }} onChange={this._sorter.bind(this)} />
				<Row type="flex" justify="end" className="printHidden">
					<Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
				</Row>

				<Modal
					title={"推送报警"}
					destroyOnClose={true}
					visible={this.state._visible}
					onCancel={() => { this.setState({ _visible: false, sendBtn: true }); this.sendPhone = '暂无手机号' }}
					footer={[
						<Button key="back" onClick={() => { this.setState({ _visible: false, sendBtn: true, sendMess: "", }); this.sendPhone = '暂无手机号' }}>取消</Button>,
						<Button key="submit" type="primary" onClick={() => { this._sendMess() }} loading={this.state.loading} disabled={!this.state.cardUser ? this.state.sendBtn : false}>
							确认
            </Button>
					]}
				>
					<div>
						向手机号：
						{
							this.state.cardUser ?
								<span>{this.sendPhone}</span> :
								<AutoComplete
									dataSource={this.MobileList}
									onChange={e => this._MobileChange(e)}
									style={{ width: 200, margin: '0 10px' }}
									filterOption={(inputValue, option) =>
										option.props.children.indexOf(inputValue) !== -1
									}
								/>
						}
						推送报警信息
					</div>
					<h4 style={{ fontSize: '14px', color: this.state.sendBtn ? "red" : "green" }}>{this.state.sendMess}</h4>
				</Modal>

				<Modal
					destroyOnClose={true}
					visible={this.state.visible_1}
					title="IC卡操作"
					footer={[
						<Row gutter={8} type="flex" justify="end" key="button">
							<Col>
								<Button size="large" onClick={() => { this._forbiddenUpdata() }} loading={this.state._loading}>确认</Button>
								<Button size="large" onClick={() => { this.setState({ visible_1: false, _loading: false }); this.record = {} }}>取消</Button>
							</Col>
						</Row>
					]}
				>
					{this.state.card_status ? `恢复IC卡:${this.record.resident ? this.record.resident.printed_id : ""}` : `禁用IC卡:${this.record.resident ? this.record.resident.printed_id : ""}`}
				</Modal>
			</Row>
		);
	}

}