import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {Row,  } from 'antd';
import { appData, appServer} from './../../../../assert';
import './index.css';
class WarningCard1 extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource:[],
    }
    this.Route = null;
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

  _jump(nextPage, mess) {
    this.Router(nextPage, mess, this.mess.nextPage)
  }

  //获取后台信息
  _getEvent() {
    let afteruri = 'comm_alerts/v2_search';
    let body = {		
      per_page:2,
      "filter": "status='新建'"
    }
    appData._dataPost(afteruri, body, (res) => {
      let data = res.data;
      this.setState({
          dataSource:data
      })
    })
  }

  _listview(val,index){
    let imguri = appServer.imguri + val.attachment || "";
    let text = "";
    if(val.status === '新建'){
      text = "新建";
    } else if(val.status  === '分发'){
      text = "分发";
    } else if(val.status  === '处理中'){
      text = "处理中";
    } else if(val.status  === '关闭'){
      text = "关闭";  
    }
    return (
      <div className="WarningCard-List" key={index}>
        <div className="WarningCard-Li">
          <img className="WarningCard-Image" alt="" src={imguri} />
          <h3 className="WarningCard-Title">
          {val.type.title}({val.unitAddress})
          </h3>
        </div>
        <div className="WarningCard-Bottom-Tag">
          <span className="WarningCard-Status-Tag">{text}</span>
          {this._link(val)}
        </div>
      </div>
    )
  }

  _sideSelect(key, openKeys){
    
    appData._Session('set',"selectKey", {
      "key":key,
      "openKeys": openKeys
    })
  }

  _link(val){
    let id =  val.type.id || 0;
    if(id === 1) return <Link to="/contant/ResidentManage/IntradayWarning/Stranger" onClick={() => this._sideSelect("T1S1", "T1")}><span className="WarningCard-Link-Tag">查看详情</span></Link>
    else if(id <= 10)
      return <Link to={{
        pathname: "/contant/ResidentManage/IntradayWarning/detail",
        state: {alarm_type: id}
      }} onClick={() => this._sideSelect("T1S1", "T1")}><span className="WarningCard-Link-Tag">查看详情</span></Link>
    else if(10< id && id <= 20)
      return <Link to={{
        pathname: "/contant/ChannelManagement/RealtimeWarning/detail",
        state: {alarm_type: id}
      }} onClick={() => this._sideSelect("T2S1", "T2")}><span className="WarningCard-Link-Tag">查看详情</span></Link>
    else return <Link to="/contant/Devices" onClick={() => this._sideSelect("T3S1", "T3")}><span className="WarningCard-Link-Tag">查看详情</span></Link>
  }

  render() {
    return (
      <div className="WarningCard Part-bg">
        <h3 className="Part-Title">新增报警信息</h3>
        <Row type="flex" className="WarningCard-Box">
          {
            this.state.dataSource.map((val,index)=>{
            return this._listview(val,index)})
          }
        </Row>
      </div>      
    )
  }
}

WarningCard1.propTypes = {
  reload: PropTypes.number.isRequired,
}

//state的值来自于todoApp
function mapStateToProps(arr) {
	let state = arr[arr.length-1];
  return {
		reload: state.reload
  }
}
export default connect(mapStateToProps)(WarningCard1)