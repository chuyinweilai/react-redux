// 权限二

import {Row, Col, Card, Layout} from 'antd'
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import "./home2.css"
import RecentSales from '../../components/mainchart/recentSales'
import Browser from '../../components/browser/browser'
import WarningCard1 from './warning/warning_card'
import {Count} from './IOrecord/index.js'
import IOrecord from './IOrecord/IOrecent/IOrecent';
import {appData, appServer} from './../../assert';
const {Content} = Layout

class home2 extends Component {
  constructor(props) {
      super(props);
      this.state = {
          comm_name: '',
          infraNumber: 0,
          civilizationClose: [],

          opacity: 0.7,
          warning_bg:["transparent","transparent","transparent"],
          warning_fdy: "url(" + appServer.baseuri +"icon/fdy.jpg)",
          warning_1:{},
          warning_2:{},
          warning_3:{},

          pixelX: 116.404,
          pixelY: 39.915,
      }
      this.Router = "";
      this.mess = null;
      this.setTime = {
          interval:{},
          num:0,
      }

  }

  componentWillMount() {
    this.Router = this.props.Router;
    this.mess = this.props.message;
    this.setState.flag = 0
    this._getEvent()
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.reload !== undefined){
      this._getEvent()
    }
  }

  //获取后台信息
  _getEvent() {
    // this._opacity()
    let afteruri = 'comm_alerts/v2_search';
    let body = {}
    appData._dataPost(afteruri, body, (res) => {
      let data = res.data;
      let bol_1= true;
      data.forEach((val, index)=>{
        if(bol_1){
          if(val.status === "新建"){
            bol_1 = false;
            
            this.setState({
              warning_fdy: "url(" + appServer.baseuri +"icon/" + val.area_code + "区" + val.alert_lvl + "级报警.png)",
            })
            // this._Aopacity()
          }
        }
      })
    })
  }

  _jump(nextPage, mess) {
    this.Router(nextPage, mess, this.mess.nextPage)
  }

  _Aopacity(){
    this.refs.mapDiv.style.opacity = 0.5
    setTimeout(()=>{
      this.refs.mapDiv.style.opacity=1
    },500)
  }

  render() {
    return (
      <Row style={{padding: "0 0px", flex: 1,}}>
        <Content>
          <Row type="flex" gutter={24}>
              <Col lg={16} xs={24} style={{boxSizing:'border-box'}}>
                  <Card title="报警区域图示" style={{border: '1px solid #ccc'}} bodyStyle={{height: "6.8rem"}} noHovering>
                    <Row ref="mapDiv" className="home2_localarea" type="flex" gutter={24} style={{backgroundImage: this.state.warning_fdy,
                    backgroundSize: "100% 100%"}}/>
                    <Col style={{fontSize: 14, background:"#fff"}}>透明：无报警，黄色：有中级报警，红色：有高级报警</Col>
                  </Card>
              </Col>
              <Col lg={8} xs={24} style={{boxSizing:'border-box'}}>
                  <Card title="新增报警信息" style={{border: '1px solid #ccc'}} bodyStyle={{height: "6.8rem"}} noHovering>
                    <WarningCard1 message={this.mess} Router={this.Router} />
                  </Card>
              </Col>
          </Row>
          <Row gutter={24}>
            <Col lg={8} xs={24}>
              <Card title="近期出入统计" style={{border: '1px solid #ccc', marginTop: 20}} bodyStyle={{height: "2.3rem"}} noHovering>
                <IOrecord message={this.mess} Router={this.Router} />
              </Card>
            </Col>
            <Col lg={8} xs={24}>
              <Card title="待处理事件汇总" style={{border: '1px solid #ccc', marginTop: 20}} bodyStyle={{height: "2.3rem"}} noHovering>
                <Browser message={this.mess} Router={this.Router} />
              </Card>
            </Col>
            <Col lg={8} xs={24}>
              <Card title="今日出入" style={{border: '1px solid #ccc', marginTop: 20}} bodyStyle={{height: "2.3rem"}} noHovering>
                <Count message={this.mess} Router={this.Router} />
              </Card>
            </Col>
          </Row>
          <Card title="待处理报警" style={{border: '1px solid #ccc', marginTop: 20}} noHovering>
              <RecentSales message={this.mess} Router={this.Router} />  
          </Card>
        </Content>
      </Row>
    )
  }
}

home2.propTypes = {
  reload: PropTypes.number.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1];
  return {
		reload: state.reload
  }
}
export default connect(mapStateToProps)(home2)
