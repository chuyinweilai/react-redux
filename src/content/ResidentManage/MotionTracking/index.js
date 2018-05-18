import React,{ Component } from 'react';
import {
  Row, 
  Col,
  Button,
  Input 
} from 'antd';
import { Link } from 'react-router-dom';
import { appData, appServer, } from './../../../assert';

import MotionCharts from './MotionCharts';
import './index.scss';

const { Search } = Input; 
export default class MotionTracking extends Component{
  constructor(props){
    super(props);
    this.state={
      timeData_1: [],
      timeData_2: [],

      info: null,
      day_ent: null,
      month_ent: null,
      cards: null
    };
    this.cards = 0;
  }

  componentDidMount(){
    let state = this.props.location.state;
    this._getEvent(1031858);
    if(state !== undefined){
      this.setState({cards: state.cards})
      this._getEvent(state.cards);
    }
  }

  _getEvent(number){
    let url = "ent_records/v2_getEnFromNum";
    let body = { number };
    appData._dataPost(url, body, (res)=>{
      this.cards = number;
      if(!res.result){
        let adata = res.data;
        this.setState({
          info: adata.info,
          day_ent: adata.day_ent,
          month_ent: adata.month_ent,
        })
      }
    })
  }

  _Search(e) {
    if(e.target.value.length === 7){
      this._getEvent(e.target.value);
    } else {
      this.setState({
        info: null,
        day_ent: null,
        month_ent: null,
      })
      this.cards = 0;
    }
  }

  _TimeLine(data = [], number = 0){
    let time = '00:00';
    if (number === 1) time = '00:00~06:00';
    else if (number === 2) time = '06:00~12:00';
    else if (number === 3) time = '12:00~18:00';
    else if (number === 4) time = '18:00~24:00';
    setTimeout(()=>{
      this._drawCan(number);
    }, 200)
    return (
      <li className="Time-Line-List">
        <ul className="Time-Line-Top" >
          {data.map((val, index)=>{
            if(index%2 === 0){
              return this._TimeLine_1(val, index)
            } else return null
          })}
        </ul>
        <canvas ref={`canvas-${number}`} className="canvas" width="200" height="20"></canvas>
        <div className={`Time-Line`}>{time}</div>
        <ul className="Time-Line-Bottom" >
          {data.map((val, index)=>{
            if(index%2 !== 0){
              return this._TimeLine_2(val, index)
            } else return null
          })}
        </ul>
      </li>
    )
  }

  _TimeLine_1(val, index){
    let date = val.created_at.split(' ')[1];
    return (
      <li key={index} className="Time-Box-Blue1" >
        <div className="Top-Line" >{val.loc_description}</div>
        <div className="Bottom-Line" >{date}</div>
      </li>
    )
  }

  _TimeLine_2(val, index){
    let date = val.created_at.split(' ')[1];
    return (
      <li key={index} className="Time-Box-Blue2" >
        <div className="Bottom-Line" >{date}</div>
        <div className="Top-Line" >{val.loc_description}</div>
      </li>
    ) 
  }

  // canvas绘图
  _drawCan(number){
    const canvas = this.refs[`canvas-${number}`];
    if (canvas){
      let wid = canvas.offsetWidth || 200;
      // ""
      // console.dir(wid);
      canvas.width = wid;
      let hei = 20;
      if (canvas.getContext){
        // 初始化cavnas
        const ctx = canvas.getContext('2d');
        // 开始绘图
        ctx.clearRect(0, 0, canvas.width,canvas.height);
        ctx.beginPath();
        // 设置起点，移动笔触位置
        ctx.moveTo(0, 0);
        ctx.lineTo(wid-20, 0);
        ctx.lineTo(wid, hei/2);
        ctx.lineTo(wid-20, hei);
        ctx.lineTo(0, hei);
        ctx.lineTo(15, hei/2);
        ctx.closePath()
        ctx.fillStyle = "rgba(28, 125, 250, 0.4)";
        ctx.fill()
      }
    }
  }

  render(){
    const { info, month_ent, day_ent } = this.state;
    return (
      <div className="Motion-Box" >
        <Row type="flex" style={{justifyContent:'flex-end',height: 32, marginBottom: '.2rem'}}>
          <Col span={8}>
            <Search
              ref="searchInput"
              placeholder = "请输入搜索"
              defaultValue={this.state.cards}
              style={{width: "100%"}}
              onChange={this._Search.bind(this)}
            />
          </Col>
        </Row>
        <Row type="flex">
          {
            info?
            <Col className="motion-messCard" lg={12} xs={24}>
              <img src={ appServer.imguri + info.attachment} alt=""/>
              <ul>
                <li>姓名: {info.name}</li>
                <li>地址: {info.name}</li>
                <li><span className="Mobile">{info.mobile}</span></li>
                <li><span className="Live-Status">{info.category === "Y"?"业主":"租户"}</span></li>
              </ul>
            </Col>:
            null
          }
          {
            month_ent?
            <Col className="motion-times" lg={12} xs={24}>
              <div className="motion-button">
                <Link to={{
                  pathname: '/contant/ResidentManage/MotionTracking/detail',
                  state: { cards: this.cards }
                }}>
                  <Button type='primary' style={{float: 'right'}}>查看详情</Button>
                </Link>
              </div>
              <MotionCharts month_ent={month_ent}/>
            </Col>:
            null
          }
          {
            day_ent?
            <Col span={24} className="Motion-Box-Bottom">
              <Row className="motion-list">
                <ul className="Time-Line-Box" >
                    {this._TimeLine(day_ent[0],1)}
                    {this._TimeLine(day_ent[6],2)}
                    {this._TimeLine(day_ent[12],3)}
                    {this._TimeLine(day_ent[18],4)}
                </ul>
              </Row>
            </Col>:
            null
          }
        </Row>
      </div>
    )
  }
}