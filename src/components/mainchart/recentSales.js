import {Row, Col, Table, Tag, Badge } from 'antd'
import React, {Component} from 'react';
import './recentSales.less'
import { appData, Colors} from './../../assert';


export default class RecentSales extends Component {
    constructor(props){
        super(props);
        this.state = {
            data:[],
        }
        
        this.reload = 0;
        this.columns = [
            {
                title: '区域',
                dataIndex: 'area_code',
            }, {
                title: '等级',
                dataIndex: 'alert_lvl',
                render: text => {
                    let color = '#000000'
                    if(text === '低'){
                        color =  '#64ea91'
                    } else if(text === '中'){
                        color='#f8c82e'
                    }  else if(text === '高'){
                        color= '#f69899'
                    }  
                    return (<Tag color = {color}>{text}</Tag>)
                }
            }, {
                title: '报警时间',
                dataIndex: 'created_at',
                // render: text => new Date(text).format('yyyy-MM-dd'),
            }, {
                title: '状态',
                dataIndex: 'status',
                render: text => {
                    let color = '#000000'
                    if(text === '新建'){
                        color =  '#64ea91'
                    } else if(text === '分发'){
                        color='#f8c82e'
                    }  else if(text === '处理中'){
                        color= '#f69899'
                    }  
                    return (<Tag color={color}>{text}</Tag>)
                }
            }
        ];
    }

    componentWillMount() {
      this.Router = this.props.Router;
      this.mess = this.props.message;
      this.setState.flag = 0
      this._reload()
      this._getEvent('tableCivil')
      this._getEvent('tableInfra')
      this._getEventNum()
    }
    
    componentWillReceiveProps(nextProps){
        this.reload = nextProps.reload;
    //do something
    }

    //刷新
    _reload(){
      if(this.reload){
          this.reload = this.reload-1;
            this._getEvent('tableCivil')
            this._getEvent('tableInfra')
            this._getEventNum()
      }
      // if(this.props.reload !== this.reload){
      //   this.reload = this.props.reload;
      // } 
      // else{
      //   this.reload = !this.props.reload;
      // }
    }

    _jump(nextPage, mess) {
        this.Router(nextPage, mess, this.mess.nextPage)
    }

    _getEventNum(){
      let afteruri = 'comm_alerts/statistics';
      let body = {
        "scope":{"status":"新建"},
        "status_column":"open",
        "group":["alert_type"]
      }
      appData._dataPost(afteruri, body, (res) => {
        let data = res.statistics
        data.forEach((val)=>{
          if(val.alert_type === '文明' ){
            this.setState({
              infraNumber: val.count,
            })
          } else if(val.alert_type === '五违'){
            this.setState({
                civilNumber: val.count,
            })
          }
        })
      })
    }

    _getEvent(type){
        let alert_type = '';
        let body = {};
        if(type === 'tableCivil' ){
            alert_type="文明"
            body = {
                filter:'(alert_type = "文明" and status = "新建")'
            }
        } else if(type === 'tableInfra'){
            alert_type="五违"
            body = {
                filter:'(alert_type = "五违" and status = "新建")'
            }
        }
        let afteruri = 'comm_alerts/v2_search';
        appData._dataPost(afteruri, body, (res) => {
            let countdata = res.data
            let data = [];
            countdata.forEach((val,index)=>{
                if (val.alert_type === alert_type && val.status === '新建'){
                    if(data.length <5){
                        data.push(val)
                    }
                }
            })
            if(type === 'tableCivil' ){
                this.setState({
                    data_1: data,
                })
            } else if(type === 'tableInfra'){
                this.setState({
                    data_2: data,
                })
            }
        })
    }

    render(){
        return (
            <Row>
                <Row>
                    <Col span={12} style={{height:"10rem"}}>
                        <Badge count={this.state.infraNumber} style={{position:'absoluted',left:"-10px",top: 12}}/>
                        <h2 style={{textAlign: 'center', width: '100%', height:'6.7rem', lineHeight:'6.7rem', background: Colors.blue}}>待处理爱心监护报警</h2>
                    </Col>
                    <Col span={12} style={{height:"10rem"}}>
                        <Badge count={this.state.civilNumber} style={{position:'absoluted',left:"-10px",top: 12}}/>
                        <h2 style={{textAlign: 'center', width: '100%', height:'6.7rem', lineHeight:'6.7rem', background: Colors.yellow}}>待处理行为监控规范</h2>
                    </Col>
                </Row>
                <Row type="flex" align="center">
                    <Col span={12} style={{paddingTop: '10px', display: 'flex', justifyContent: 'center'}}>
                        <Table style={{width: "97%"}} border pagination={false} columns={this.columns} key={(record, key) => key}
                                dataSource={this.state.data_1}/> 
                    </Col>
                    <Col span={12} style={{paddingTop: '10px', display: 'flex', justifyContent: 'center'}}>
                        <Table style={{width: "97%"}} className="recentSales-Table-civil" pagination={false} columns={this.columns} rowKey={(record, key) => key} dataSource={this.state.data_2}/> 
                    </Col> 
                </Row>
            </Row>
        )
    }
}
