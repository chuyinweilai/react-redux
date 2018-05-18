
import React, { Component } from 'react';
import { 
	Icon, 
} from 'antd'
import appData from './../../../assert/Ajax';
import './active.css'

export default class active extends Component {
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
		this.Router = "";
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
		let afteruri = 'activity/soon';
		let body = {
			 "comm_code": userMess.comm_code
		}
		appData._dataPost(afteruri,body,(arr) => {
			if(arr.length){
				let res = arr[0]
				this.activeMess = res;
				let obj = this._listView(res);
				this.setState({
					dataSource: obj,
				})
			}
		})
	}
	
	_listView(data){
		let peruri = 'http://cloudapi.famesmart.com/storage/'
		let ss = data.pic_path;
		let arr = ss.split(",");
		let typeText = ''
		if(data.type === 1 ){
			typeText = '社区服务'
		} else if(data.type === 2){
			typeText = '公益活动'
		} else if(data.type === 3){
			typeText = '其他'
		}
		return (
			<li className="box">
				<div className="imagebox" >
					<img className="image" alt="" src={peruri+ arr[0]}/>  
				</div>
				<div>
					<span style={{fontSize: 16,fontWeight: 'bold', marginRight: 20}}>{data.title}</span>
					<span style={{color: "#fdac41", fontSize: 16,}}>#{typeText}#</span>
				</div>
				<div>
					<span style={{fontSize: 14,fontWeight: 'bold', marginRight: 20}}>
						<Icon type="user" style={{ fontSize: 16}} />
						报名{data.join_cnt}
					</span>
					<span style={{fontSize: 14,fontWeight: 'bold', marginRight: 20}}>
						<Icon type="heart-o" style={{ fontSize: 16}} />
						签到{data.sign_cnt}
					</span>
				</div>
			</li>
		)
	}

	render() {
		return (
		<div style={{ padding: 15, backgroundColor: '#fff', minHeight: 358}}>
			<div>
			<text style={{fontSize: 20,paddingBottom: 5,}}>
					即将开始
				</text>
			</div>
			<ul style={{float:'left'}}>
				{this.state.dataSource}
			</ul>
		</div>
		);
	}
}