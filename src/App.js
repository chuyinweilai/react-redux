import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { redux_status, noti_router, set_pointer } from './reducer/action';
import { appServer } from './assert';
import { Spin, notification,} from 'antd';
import {
    Route,
    Switch as Switchs,
    Redirect,
    BrowserRouter
} from 'react-router-dom';
import Login from './content/login/login';
import Contants from './Routers/Routers';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ws: null,
			loading: false,
		}
	}

	componentWillMount() {
		this.ws_setting()
	}

	//进行ws先关设置
	ws_setting() {
		const ws = new WebSocket(appServer.websocket_uri);
		const { dispatch } = this.props;
		this.setState({ws: ws});
		ws.onmessage = (evt) => { 
			if (evt.data !== "") {
				let json = JSON.parse(evt.data);
				if (json.type === "alarm") {
					dispatch(set_pointer(json.x,json.y));
					if(this.props.noti_switch) {
						this.openNotification(json)
					}
				} else if (json.type === "init") {
					dispatch(redux_status(json.client_id));
					ws.send('{"type":"login","mac_addr":"web","group":"alarm"} ')
				}
			}
		}

		ws.onclose = (evt) => {
			console.log("WebSocketClosed!");
		};

		ws.onerror = (evt) => {
			console.log("WebSocketError!");
			setTimeout(() => {
				this.setState({
					loading: true,
				})
				this.reScoket++;
				this.ws_setting();
				if (this.reScoket === 10) {
					window.location.href = ""
				}
			}, 5000);
		};
	}

	openNotification(json) {
		let clickhandler = (num) => {
			this.props.dispatch(noti_router(json.alarm_type));
			notification.close(num)
		};
		let color = ""
		let list_num = this.test
		// if (json.level === "高") {
			color = "rgba(238, 44, 44,0.8)"
		// } else if (json.level === "中") {
		// 	color = "rgba(255, 165, 79, 0.8)"
		// }

		notification.open({
			key: 'notification_warning' + this.test,
			message: React.createElement('span', {
				className: "notification_text",
				onClick: () => clickhandler('notification_warning' + list_num)
			}, json.content + "(ID:" + json.alert_id + ")"),
			style: {
				backgroundColor: color,
				height: "3rem",
				padding: '.3rem',
				color: '#fff'
			},
			placement: 'bottomRight',
			duration: 300
		});
		this.test++;
	};

	render() {
		return ( 
			<BrowserRouter>
				<Switchs>
					<Redirect exact from = '/' to = '/login' />
					<Route exact path = '/login' component = { Login } />
					<Spin tip="服务断开，正在重连..." delay={500} spinning={this.state.loading} style={{position: 'fixed', top: 0, height: window.innerHeight, maxHeight: window.innerHeight}}>
						<Route path='/contant' component = { Contants }/>
					</Spin>
				</Switchs> 
			</BrowserRouter>
		)
	}
}

App.propTypes = {
		ws_json: PropTypes.string.isRequired,
		reload: PropTypes.number.isRequired,
		noti_switch: PropTypes.bool.isRequired,
}

//state的值来自于todoApp
function select(arr) {
	let state = arr[arr.length-1];
	return {
		ws_json: state.ws_json,
		reload: state.reload,
		noti_switch: state.noti_switch,
	}
}

export default connect(select)(App)