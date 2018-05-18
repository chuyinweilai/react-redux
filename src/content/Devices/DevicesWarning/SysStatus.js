import React,{ Component } from 'react';
import {
  Row,
  Col,
} from 'antd';

import './index.css';

class SysStatus extends Component{

  componentDidMount() {
  }

  render(){
    return (
      <div className="SysStatus-Box">
        <h3 className="Part-Title">系统状态</h3>
        <Row className="SysStatus">
          <Col span={12} className="SysStatus-TopIcon"><i className="fa fa-cloud"></i></Col>
          
          <Col span={12} className="SysStatus-TopText">
            <h1>系统状态</h1>
            <span style={{color: '#66ff00'}}>正常</span>
          </Col>
          <Col span={24}>
            <Row type="flex" className="SysStatus-Bottom">
              <Col span={12} className="SysStatus-list"><i className="fa fa-check-circle-o" style={{color: 'rgb(100, 234, 145)'}}></i>双机热备</Col>
              <Col span={12} className="SysStatus-list"><i className="fa fa-check-circle-o" style={{color: 'rgb(100, 234, 145)'}}></i>主机防护</Col>
              <Col span={12} className="SysStatus-list"><i className="fa fa-check-circle-o" style={{color: 'rgb(100, 234, 145)'}}></i>防火墙</Col>
              <Col span={12} className="SysStatus-list"><i className="fa fa-check-circle-o" style={{color: 'rgb(100, 234, 145)'}}></i>安全体检</Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SysStatus;