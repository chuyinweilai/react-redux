import React,{Component} from "react"
import {
	Row,
  Col,
  Table,
} from 'antd';
import { appData } from './../../assert';
export default class Ruler extends Component{
	constructor(props){
		super();
		this.state = {
      data:[]
    }
		this.columns = [
			{
				colSpan:1,
				title: '编号',
				dataIndex: 'id',
			},
			{
        colSpan: 1,
				title: '报警内容',
        dataIndex: 'title',
        render:(text) =>{
          return <text style={{fontWeight: 600, fontSize: '14px'}}>{text}</text>
        }
			},
			{
        colSpan: 1,
				title: '报警条件',
				dataIndex: 'alarm_condition',
			},
      {
        colSpan:1,
        title: '停止报警条件',
        dataIndex: 'stop_condition',
      },
      {
        colSpan:1,
        title: '最高报警次数',
        dataIndex: 'high_alarm_count',
      },
      {
        colSpan:1,
        title: '报警地点',
        dataIndex: 'alarm_loca',
      },
      {
        colSpan:1,
        title: '检查时间',
        dataIndex: 'check_time',
      },
      {
        colSpan:1,
        title: '备注',
        dataIndex: 'note',
      },
		];
  }

  componentWillMount(){
    this._getEvent()
  }

  _getEvent(){
    let url = "comm_alerts/v2_showRule";
    let body = {};
    appData._dataPost(url, body, (res)=>{
        this.setState({
          data: res.data || []
        })
    })
  }

	render(){
		return (
      <div>
        <Row>
          <Col span={24} style={{fontSize:'14px', color: 'red', textAlign: 'left'}}>
            *监控室	声光报警<br/>*网格站	灯光报警
          </Col>
        </Row>
        <Table dataSource={this.state.data} columns={this.columns} rowKey='id' pagination={false} style={{marginBottom: 20}}/> 
      </div>
		)
	}
}
