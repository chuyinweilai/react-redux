import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, } from 'react-router-dom';
import { connect } from 'react-redux';
import { select_page, noti_switch } from './../reducer/action';

import {
	Row,
	Col,
	Layout, 
	Switch,
} from 'antd';

import {
	appData,
} from './../assert';
import './Router.css';

import { Headers, Siders } from './../components/Layout';

import Home_1 from './../content/home/home'
import Home_2 from './../content/home/home2'
import Cancel from './../content/cancel'

//居民管理
import { 
	IntradayWarning, 
	IntradayWarningDetail,
	DecisionsRecommend, 
	IOrecord, 
	IOrecordDetail, 
	IOFailedRecord, 
	IOFailedRecordDetail, 
	MotionTracking, 
	MotionDetail, 
	ResidentMessage, 
	ResidentDetail,

	Stranger,
  	DealDetail,
	UnusualDetail,
	
	Dubious,
	DubiousDeal,
	DubiousUnusual,
} from './../content/ResidentManage';

import { 
	RealtimeWarning, 
	Analysis, 
	RealtimeDetail 
} from './../content/ChannelManagement';

// 卡片管理
import {
  CardRoot,
	CardChange,
	DateLimit
} from './../content/Card';

// 系统设置
import {
	User_Add,
	User_Manager
} from './../content/System';

import {
  DevicesList,
	DevicesWarning
} from './../content/Devices';
import Ruler from './../content/Ruler';

const { Content, Sider } = Layout;

const routes = [
	{
		path:'/home1',
		component: Home_1
	},
	{
		path:'/home2',
		component: Home_2
	},
	// 居民管理
	{
		path:'/ResidentManage',
		Children:[
			{
				path:'/ResidentManage/IntradayWarning',
				component: IntradayWarning
			},
			{
				path:'/ResidentManage/IntradayWarning/detail',
				component: IntradayWarningDetail
			},
			{
				path:'/ResidentManage/IntradayWarning/Stranger',
				component: Stranger
			},
			{
				path:'/ResidentManage/IntradayWarning/Stranger/DealDetail',
				component: DealDetail
			},
			{
				path:'/ResidentManage/IntradayWarning/Stranger/UnusualDetail',
				component: UnusualDetail
			},
			{
				path:'/ResidentManage/IntradayWarning/Dubious',
				component: Dubious
			},
			{
				path:'/ResidentManage/IntradayWarning/Dubious/DubiousDeal',
				component: DubiousDeal
			},
			{
				path:'/ResidentManage/IntradayWarning/Dubious/DubiousUnusual',
				component: DubiousUnusual
			},
			{
				path:'/ResidentManage/DecisionsRecommend',
				component: DecisionsRecommend
			},
			{
				path:'/ResidentManage/IOrecord',
				component: IOrecord,
			},
			{
				path:'/ResidentManage/IOrecord/detail',
				component: IOrecordDetail
			},
			{
				path:'/ResidentManage/IOFailedRecord',
				component: IOFailedRecord,
			},
			{
				path:'/ResidentManage/IOFailedRecord/detail',
				component: IOFailedRecordDetail
			},
			{
				path:'/ResidentManage/MotionTracking',
				component: MotionTracking
			},
			{
				path:'/ResidentManage/MotionTracking/detail',
				component: MotionDetail
			},
			{
				path:'/ResidentManage/ResidentMessage',
				component: ResidentMessage
			},
			{
				path:'/ResidentManage/ResidentMessage/detail',
				component: ResidentDetail
			}
			
		]
	},
	// 通道管理
	{
		path:'/ChannelManagement',
		Children:[
			{
				path:'/ChannelManagement/RealtimeWarning',
				component: RealtimeWarning
			},
			{
				path:'/ChannelManagement/RealtimeWarning/detail',
				component: RealtimeDetail
			},
			{
				path:'/ChannelManagement/Analysis',
				component: Analysis
			},
		]
	},
	// 设备管理
	{
		path:'/Devices',
		Children:[
			{
				path:'/Devices/Warning',
				component: DevicesWarning
			},
			{
				path:'/Devices/List',
				component: DevicesList
			}
		]
	},
	// 卡片管理
	{
		path:'/Card',
		Children:[
			{
				path:'/Card/CardChange',
				component: CardChange
			},
			{
				path:'/Card/CardChange/setdate',
				component: DateLimit
			},
			{
				path:'/Card/CardRoot',
				component: CardRoot
			},
		]
	},
	// 系统设置
	{
		path:'/System',
		Children:[
			{
				path:'/System/User_Manager',
				component: User_Manager
			},
			{
				path:'/System/User_Manager/add',
				component: User_Add
			},
		]
	},
	// 报警规则
	{
		path:'/Ruler',
		component: Ruler
	},
	{
		path:'/cancel',
		component: Cancel
	},
]

class Contants extends Component{
	constructor(props){
		super(props);		
		this.state={
			ws: null,
			message:{
				nextPage: 'login',
				historyPage: '',
				mess:'',
			},
			ws_json : "",
			logohead:true,
			mainPagePost: 230,
			collapsed: false, 

			alert_lvl: -1,
    }
		this.test = 0;
		this.reScoket = 0;
		this.noti_router = "";
	}

	componentWillReceiveProps(receiveProps){
		let { noti_router } = receiveProps;
		if(noti_router !== this.noti_router){
			this.noti_router = noti_router;
			if(noti_router === "居民"){
				this.props.history.push("/contant/ResidentManage/IntradayWarning");
				this.props.dispatch(select_page("T1S1"));
				appData._Session('set',"selectKey", {
					"key":'T1S1',
					"openKeys": 'T1'
				})
			}else {
				this.props.history.push("/contant/ChannelManagement/RealtimeWarning")
				this.props.dispatch(select_page("T2S1"));
					appData._Session('set',"selectKey", {
						"key": "T2S1",
						"openKeys": "T2"
					})
			}
			setTimeout(()=>{
				window.location.reload();
			},200)
		}
	}

	// 侧边栏弹窗按钮
	_siderSwitch(){
		return (
			<Row className="siderSwitch">
				<Col span={this.state.collapsed? 24: 8}>弹窗</Col> 
				<Col span={this.state.collapsed? 24: 8}><Switch onChange={this._switch.bind(this)} checkedChildren="开" unCheckedChildren="关" defaultChecked/></Col> 
			</Row>
		)
	}

	_switch(bol){
		this.props.dispatch(noti_switch(bol))
	}

	// 侧边栏折叠
	onCollapse(collapsed) {
		this.setState({ collapsed, logohead: !collapsed });
	}

	_Router(val,index, e){
		const { match } = this.props;
		if(val.Children){
			return val.Children.map(this._Router.bind(this))
		} else {
			return <Route exact key={index} path={`${match.url}${val.path}`} component = {val.component} />
		}
	}
	
  render() {
    return (
			<Layout className="MainPage">
				<Headers></Headers>
        <Layout className="Main-Content">
					<Sider 
						className="Main-Sider"
						width={250}
						collapsible
						collapsedWidth={64}
						collapsed={this.state.collapsed}
						onCollapse={this.onCollapse.bind(this)}
					>
						<Siders Router={(nextPage) => this.props.history.push(nextPage)}/>
						{this._siderSwitch()}
					</Sider>
	 				<Content style={{boxSizing:'border-box',padding: 12}}>
	 					{routes.map(this._Router.bind(this))}
	 				</Content>
        </Layout>
      </Layout>
    );
  }
}

Contants.propTypes = {
	noti_router: PropTypes.string.isRequired,
}

//state的值来自于todoApp
function select(arr) {
	let state = arr[arr.length-1];
	return {
		noti_router: state.noti_router,
	}
}

export default connect(select)(Contants)