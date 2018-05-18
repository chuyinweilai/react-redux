

import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    Row,
    Form,
    Alert,
    Button,
} from 'antd';
import './login.css'
import {appData} from './../../assert';
const FormItem = Form.Item;

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      loginType: 'server',
      error:false,
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if((/^1(3|4|5|7|8)\d{9}$/.test(values.userName))){ 
        if (!err) {
          let afteruri = 'auth/login';
          let body = {
            "mobile":values.userName,
            "password":values.password,
            "client_id": this.props.ws_json
          }
          appData._dataPost(afteruri, body, (res) => {
            if(res === undefined || !res.token.length  || res.user.token >= 7){
              this.setState({
                error: true
              })
            } else {
              res.user["comm_code"] = res.comm.comm_code;
              res.user["comm_name"] = res.comm.comm_name;
              appData._Session('set',"Token",res.token);
              appData._Session('set',"userMess",res.user);
              appData._Session('set',"userKey", body);
              appData._Session('set',"selectKey", null);
              this.props.history.push('/contant/home1');
            }
          })
        }
      } else {
        this.setState({
          error: true
        })
      }
    })
  }

    //账号不存在返回提示
  _errorInfo(){
    if(this.state.error){
      return (
        <Alert description="账号或密码错误" type="error" closable onClose={()=>{this.setState({error: false})}}/>
      )
    } else {
      return null
    }
  }

  _handleChange(key){
    this.setState({
      loginType: key
    })
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
        <Row  type="flex" align="middle" justify="center" className="login-box">
          <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
            <div className="login-Input-Box">
              <div className="login-user"> 
                <i className="fa fa-mobile"></i>
                <FormItem>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入用户名！' }],
                    initialValue: "",
                  })(
                    <input className="login-form-input" placeholder="用户名" />
                  )}
                </FormItem>
              </div>
              <div className="login-password"> 
                <i className="fa fa-lock"></i>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码！' }],
                    initialValue: "",
                  })( 
                    <input className="login-form-input" type="password" placeholder="密码" />
                  )}
                </FormItem>
              </div>
            </div>
            <FormItem>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </FormItem>
            {this._errorInfo()}
          </Form>
        </Row>
    );
  }
}

Login.propTypes = {
  ws_json: PropTypes.string.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1];
  return {
		ws_json: state.ws_json
  }
}

const WrappedLogin = Form.create()(Login);
export default connect(mapStateToProps)(WrappedLogin);
