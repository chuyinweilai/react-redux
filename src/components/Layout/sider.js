
import React,{Component} from 'react';
import { connect } from 'react-redux'
import { 
	Menu, 
	Modal,
	message
} from 'antd';
import { appData, Colors } from './../../assert';
import { select_page } from './../../reducer/action';
import './index.css';

const { SubMenu } = Menu;


class siders extends Component{
	constructor(props){
		super(props);
		this.state={
			siderArr: [],
			visible_1: false,
		}
		this.userMess = '';
		this.select_page = {};
		this.selectedKeys = { "key":'T0', "openKeys": 'T0' };
	}
	
	componentWillMount(){

		appData._Session('get',"userMess",(userMess)=>{
			this.userMess  = userMess;
		})
		appData._Session('get',"userKey",(userKey)=>{
			if(userKey){
					let url = "user/v2_sideList";
					let body = userKey || {};
					appData._dataPost(url, body, (res)=>{
						if(!res.result){
							this.setState({
								siderArr: res.data
							})
						} else {
							message.error(res.info)
						}
					})
			} else{
				this.props.Router('/login');
			}
		})
	}

	_click(e){
		this.props.Router(e.item.props.to);
		this.selectedKeys = {
			"key":e.key,
			"openKeys": e.key.slice(0,2)
		}
		if(e.key === "CANCEL"){
			this.setState({
				visible_1: true,
			})
		} else {
			appData._Session('set',"selectKey", {
				"key":e.key,
				"openKeys": e.key.slice(0,2)
			})
			if(this.select_page.name !== e.key){
				this.props.dispatch(select_page(e.key));
			} 
		}
	}

	_set_sideList(val, index){
		if(val.children){
			return(
				<SubMenu key={val.key} className="Menu-Sub" title={<span className="Menu-Sub-Title"><i className="fa fa-dot-circle-o"></i><span>{val.title}</span></span>}>
					{val.children.map((childVal, ChildInd) =>{
						return <Menu.Item key={val.key+childVal.key} to={childVal.path}><i className="fa fa-circle-o"></i><span>{childVal.title}</span></Menu.Item>
					})}
				</SubMenu>
			)
		} else {
			return <Menu.Item key={val.key} to={val.path} className="Menu-Sub-Title Menu-Sub-oTitle" ><i className="fa fa-circle-o"></i>{val.title}</Menu.Item>
		}
	}

	_cancel(type){
		if(type){
			sessionStorage.clear();
			window.location.reload();
		} else {
			this.setState({
				visible_1: false
			})
		}
	}

	render(){
		appData._Session('get',"selectKey",(res)=>{
			this.selectedKeys =  res? res: { "key":'T0', "openKeys": 'T0' };
		})
		return (
			<Menu
				mode="inline"
				collapsible = 'true'
				className = "Sider-List"
				defaultOpenKeys={[this.selectedKeys.openKeys]}
				selectedKeys={[this.selectedKeys.key]}
				onSelect = {this._click.bind(this)}
			>
				{this.state.siderArr.map(this._set_sideList)}

				<Menu.Item className="Menu-Sub-Title Menu-Sub-oTitle" key="CANCEL">注销</Menu.Item> 
				<Modal
					visible={this.state.visible_1}
					onOk={()=>this._cancel(true)}
					onCancel={()=>this._cancel(false)}
				>
					<span style={{color: Colors.red, fontSize: '.24rem'}}>是否确认注销？</span>
				</Modal>
			</Menu>
		)
	}
}

export default connect((arr) => {
	let state = arr[arr.length-1]
	return {select_page: state.select_page}
})(siders)