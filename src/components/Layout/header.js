import React,{Component} from 'react';
import { Row, Col, Layout } from 'antd';
import {appData, } from './../../assert/';

const { Header } = Layout;
export default class headers extends Component{
	constructor(props){
		super(props);
		this.state={
			comm_name:'',
			userNmae:'',
		}
	}
	componentWillMount(){
		appData._Session('get',"userMess",(res) =>{
			if(res){
				this.setState({
					comm_name: res.comm_name,
					user_id: res.name
				})
			}
		})
	}

	render(){
		return (
		<Header style={{padding: 0}} className="header">
			<Row type="flex">
				<Col span={12} className="logo" >
					<h3 className="logo-Phorai" >PHOR<i>AI</i></h3> 
					<h3 className="logo-Text" >智慧社区管理平台</h3> 
				</Col>
				<Col span={12}>
					<span style={{float:'right'}}>
						<span className="Header-Title">所在社区：</span>
						<span className="Header-Content">{this.state.comm_name}</span>
						<span className="Header-Title">操作员：</span>
						<span className="Header-Content">{this.state.user_id}</span>
					</span>
				</Col>
			</Row>
		</Header>
		)
	}
}