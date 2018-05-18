// 权限一
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {Row, Col} from 'antd';
import {
  appData,
  appServer
} from './../../assert';

import HomeMaps from './Maps'
import WarningCard1 from './warning/warning_card'
import WarningHistory from './warning/warning_history'
import FiveMonth from './five_month';
import { CloseList } from './TodayClose';
import IOrecord from './IOrecord/IOrecent/IOrecent';
import Browser from '../../components/browser/browser';
import {Count} from './IOrecord/index.js';

import './home.css';
class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comm_name: '',
      infraNumber: 0,
      area:[],
      flag:0,
      tableInfra:[],
      tableCivil:[],
      warning_fdy: "url(" + appServer.baseuri +"icon/fdy.jpg)",
      opacity: 0.4,
    }
    this.Router = null;
    this.mess = null;
  }

  componentWillMount() {
    this.Router = this.props.Router;
    this.mess = this.props.message;
    this.setState.flag =0
    this._getEvent();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.reload !== undefined){
      this._getEvent()
    }
  }

  //获取后台信息
  _getEvent() {
    let afteruri = 'comm_alerts/v2_search';
    let body = {}
    appData._dataPost(afteruri, body, (res) => {
      let data = res.data;
      let bol_1 = true;
      data.forEach((val, index)=>{
        if(bol_1){
          if(val.status === "新建"){
            bol_1 = false;
            this.setState({
              warning_fdy: "url(" + appServer.baseuri +"icon/" + val.area_code + "区" + val.alert_lvl + "级报警.png)",
            })
          }
        }
      })
    })
  }

  _jump(nextPage,mess){
    this.Router(nextPage,mess,this.mess.nextPage)
  }

  render() {
    return (
      <div className="Home">
        <Row type="flex" gutter={12}>
          {/* 地图 */}
          <Col lg={17} md={17} xs={24}>
            <HomeMaps></HomeMaps>
          </Col>
          <Col lg={7} md={7} xs={24}>
            {/* 实时报警 */}
            <WarningCard1 message={this.mess} Router={this.Router}/>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col lg={11} xs={24}>
            {/* 近期出入统计 */}
            <IOrecord message={this.mess} Router={this.Router}/>
          </Col>
          <Col lg={6} xs={24}>
            {/* 待处理事件汇总 */}
            <Browser message={this.mess} Router={this.Router}/>
          </Col>
          <Col lg={7} xs={24}>
            {/* 今日出入 */}
            <Count message={this.mess} Router={this.Router}/>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={16}>
            {/* 报警历史记录 */}
            <WarningHistory message={this.mess} Router={this.Router} />
          </Col>
          <Col span={8}>
            {/* 任务完成情况 */}
            <CloseList message={this.mess} Router={this.Router}/>
          </Col>
        </Row>
        <Row>
          {/* 居民管理 */}
          <Col>
            <FiveMonth message={this.mess} Router={this.Router} />
          </Col>
        </Row>
      </div>
    )
  }
}

home.propTypes = {
  reload: PropTypes.number.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1]
  return {
		reload: state.reload
  }
}

export default connect(mapStateToProps)(home)
