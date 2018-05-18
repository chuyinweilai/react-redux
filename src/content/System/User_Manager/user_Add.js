
import React, { Component } from 'react';
import { 
	Col, 
	Row, 
	Form, 
	Input, 
	Button, 
} from 'antd';
import { appData }  from './../../../assert';
import './index.scss'
const FormItem = Form.Item;

class regist_user_edit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name:'',
			mobile:'',
			password:'',
			helpStatus: "",
			helpText: '',
			result: '',
			success: false,
		};
	}

	//提交创建新活动
	_onSubmit(e){
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
      if (!err) {
				let	afteruri  = 'users/add';
				let body = {
					name: this.state.name,
					mobile: this.state.mobile,
					password: this.state.password,
				}
				appData._dataPost(afteruri, body, (res) =>{
					if(res.result){
						this.setState({
							result:'账号新建成功',
							success: true
						})
						this._jump()
					} else {
						this.setState({
							result:'账号新建失败，请更换手机号再次尝试',
							success: false
						})
					}
				})
      }
    });
	}

	//文本
	_input(name,e){
		this.setState({
			result:'',
		})
		if(name === 'name'){
			this.setState({
				name: e.target.value
			})
		} else if(name === 'mobile'){
			if(!(/^1(3|4|5|7|8)\d{9}$/.test(e.target.value))){ 
				this.setState({
					helpStatus:"error",
					helpText:"请输入正确的手机号",
				})
			} else {
				this.setState({
					helpStatus: "",
					helpText: "",
					mobile: e.target.value,
				})
			}
		} else if(name === 'password'){
			this.setState({
				password: e.target.value
			})
		}
	}

	//返回 
	_back(){
		this.props.history.goBack();
	}

	render() {
		const { getFieldDecorator, } = this.props.form;
		const formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		};
		return (
			<div>
				<Row type="flex" justify="space-between" gutter={12} style={{marginTop: 60,marginLeft:60}}>
					<span style={{fontSize: 12, color: '#aaa'}}>权限等级：
						1、 凡米管理员;
						2、 社区管理员;
						3、 监控室管理员;
						4、 发卡拍照人员;
						5、 网格站管理员;
						6、 居委管理员;
					</span>
				</Row>
				<Form className="User-Add-Form" style={{paddingTop: '50px'}} onSubmit={this._onSubmit.bind(this)} >
					<FormItem
						{...formItemLayout}
						label="用户名">
						{getFieldDecorator('name',{
            rules: [{
              required: true,
              message: '请输入用户名',
            }],
							initialValue: this.state.name
						})(
							<Input onChange={this._input.bind(this,"name")}/>
						)}
					</FormItem>

					<FormItem
						{...formItemLayout}
						validateStatus= {this.state.helpStatus}
						help= {this.state.helpText}
						label="账号(手机号)">
						{getFieldDecorator('mobile',{
							rules:[{
								required: true,
								message: '请输入手机号',
							}],
							initialValue: this.state.mobile
						})(
							<Input onChange={this._input.bind(this,"mobile")}/>
						)}
					</FormItem>

					<FormItem
						{...formItemLayout}
						label="密码">
						{getFieldDecorator('password',{
							rules:[{required:true, message:'请输入密码'}],
							initialValue: this.state.password
						})(
							<Input onChange={this._input.bind(this,'password')}/>
						)}
					</FormItem>

					<FormItem>
						<Row type="flex">
							<Col offset={4} span={4}>
								<Button type="primary" htmlType="submit" >确认</Button>
							</Col>
							<Col span={4}>
								<Button onClick={this._back.bind(this)}>取消</Button>
							</Col>
						</Row>
					</FormItem>
				</Form> 
				<h2 style={{color: this.state.success?'lightblue':'red', textAlign:"center"}}>{this.state.result}</h2>
			</div>
		);
	}
}

const WrappedpointTable = Form.create()(regist_user_edit);
export default WrappedpointTable;