import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Row, Col, Tag } from 'antd'
import styles from './browser.css'
import { appData, Colors } from './../../assert';

class browser extends Component {
	constructor(props){
		super(props);
		this.state = {
			data:[]
		}
		this.columns = [
			{
			title: '报警位置',
			dataIndex: 'area_code',
			render: (text) =>{
					return(
						<p className={styles.content}>{text}区</p>
					)
				}
			},{
				title: '行为监控报警数量',
				dataIndex: 'count',
				render:(text,it) => {
					let test = '#8fc9fb'
					if(text > 10 ) {
						test = '#f69899'
					}else if((text >=5 ) &&( text < 10)){
						test = '#f8c82e'
					}
					return <Tag color={test}>{text}</Tag>
				}
			},{
				title: '爱心监护报警数量',
				dataIndex: 'civcount',
				render:(text,it) => {
					let test = '#8fc9fb'
					if(text > 10 ) {
						test = '#f69899'
					}else if((text >=5 ) &&( text < 10)){
						test = '#f8c82e'
					}
					return <Tag color={test}>{text}</Tag>
				}
			}
		];
		this.reload = 0;
	}

	componentWillMount(){
    this._getEvent()
  }
	
	componentWillReceiveProps(nextProps){
    if(nextProps.reload !== undefined){
      this._getEvent()
    }
  }
  
	_getEvent(){
    let afteruri = 'comm_alerts/v2_dashboard';
    let body = {
      "duration":"month",
    }
    appData._dataPost(afteruri, body, (res) => {
      if(res.result){
      this.setState({
          data: res.data
        })
      }  
    })
	}

	render() {
		return (
			<Row className="Browser">
        <h3 className="Part-Title">待处理事件汇总</h3>
        {this.state.data.map((val, index) =>{
          return (
            <Row className="Browser-Charts" key={index}>
              <Col span={8} key={index} className="browser-list">
                <h3 className="browser-area" style={{border: `1px solid ${Colors.red}`, background: Colors.redAlpha}}>{val.alarm_type}</h3>
              </Col>
              <Col span={16}>
                <div className="browser-circle">
                  <span className="browser-circle-left" style={{border: `1px solid ${Colors.green}`, background: Colors.greenAlpha}}>{val.countC}</span>
                  <span className="browser-circle-right" style={{border: `1px solid ${Colors.blue}`, background: Colors.blueAlpha}}>{val.countX}</span>
                </div>
              </Col>
            </Row>
          )
        })}
        <div className="Browser-Text">
          <span className="browser-square" style={{border: `1px solid ${Colors.green}`, background: Colors.greenAlpha}}/>
          <span className="browser-tips">待处理</span>
          <span className="browser-square" style={{border: `1px solid ${Colors.blue}`, background: Colors.blueAlpha}}/>
          <span className="browser-tips">新建</span>
        </div>
			</Row>
			)
	}
}

browser.propTypes = {
  reload: PropTypes.number.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1]
  return {
		reload: state.reload
  }
}

export default connect(mapStateToProps)(browser)
