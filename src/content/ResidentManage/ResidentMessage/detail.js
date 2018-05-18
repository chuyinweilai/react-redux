
import React, { Component } from 'react';
import { 
	Col, 
	Row, 
	Input, 
	Button,
} from 'antd';
import { appServer} from './../../../assert';
import './index.css'
import Link from 'react-router-dom/Link';

export default class ResidentMessageDetail extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
		this.mess = null;
	}

	componentWillMount(){
		this.mess = this.props.location.state.record;
	}

	render() {
		return (
			<Row type="flex" className="Resident-Detail">
				<Col span={12}>
					<h2 className="Part-Title">社区居民管理/社区用户详情</h2>
				</Col>
				<Col span={12} style={{textAlign:'right'}}>
					<Link to={{
						pathname: '/contant/ResidentManage/ResidentMessage',
						state: this.props.location.state
					}}><Button>返回</Button></Link>
				</Col>
				<Col xs={24} md={10} lg={10} className="ResidentDetail-Photo">
						<img src={ appServer.imguri + this.mess.attachment} alt="暂无照片"  className="ResidentDetail-Image" style={{ }}/>
						<h4 style={{margin:'10px 0', fontSize: "18px", textAlign:'center'}}>Face ID</h4>
				</Col>
				<Col xs={24} md={14} lg={14} className="ResidentDetail-Form">
					<ul>
						<li><span className="ResidentDetail-list-title">姓名:</span><Input value={this.mess.name} disabled/></li>
						<li><span className="ResidentDetail-list-title">手机:</span><Input value={this.mess.mobile} disabled/></li>
						<li><span className="ResidentDetail-list-title">身份证号:</span><Input value={this.mess.nid} disabled/></li>
						<li><span className="ResidentDetail-list-title">居住证号:</span><Input value={this.mess.mobile} disabled/></li>
						<li><span className="ResidentDetail-list-title">楼号:</span><Input value={this.mess.nuitNo} disabled/></li>
						<li><span className="ResidentDetail-list-title">房间号:</span><Input value={this.mess.flatNo} disabled/></li>
						<li><span className="ResidentDetail-list-title">居住类型:</span><Input value={this.mess.type_name === 'Y'? '业主': '租户'} disabled/></li>
						<li><span className="ResidentDetail-list-title">独居老人:</span><Input value={this.mess.need_care?'是': '否'} disabled/></li>
						<li><span className="ResidentDetail-list-title">备注:</span>{this.state.notes}</li>
					</ul>
				</Col>
			</Row>
		);
	}
}