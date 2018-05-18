import React,{ Component } from 'react';
import {
  Row,
  Col,
  Tag,
  Button,
  Table,
  Modal
} from 'antd';
import { appData, appServer, Colors } from './../../../assert';
import './index.scss';
import { Link } from 'react-router-dom';
import IOFailedRecordDetail from './detail'



class IOFailedRecord extends Component{
  constructor(props){
    super(props);
    this.state={
      // dataSource: [],
      // dataSource_2: [],
      // dataSource_3: [],
      // pageNum: 1,
      // total: 0,
      visible: false,
    }
    // this.columns = [
    //   {
    //     colSpan: 1,
    //     title: '姓名',
    //     dataIndex: 'name',
    //   },
    //   {
    //     colSpan: 1,
    //     title: '卡片类型',
    //     dataIndex: 'category',
    //     render: (text)=> <span>{text === "Y"?"业主": "租户"}</span>
    //   },
    //   {
    //     colSpan: 1,
    //     title: '用户组',
    //     dataIndex: 'group',
    //   },
    //   {
    //     colSpan: 1,
    //     title: '门禁位置',
    //     dataIndex: 'loc_description',
    //   },
    //   {
    //     colSpan:1,
    //     title: '卡号',
    //     dataIndex: 'printed_id',
    //   },
    //   {
    //     colSpan: 1,
    //     title: '出入时间',
    //     dataIndex: 'created_at',
    //   },
    //   {
    //     colSpan: 1,
    //     title: '房间号',
    //     dataIndex: 'flatNo',
    //   },
    //   {
    //     colSpan: 1,
    //     title: '识别结果',
    //     dataIndex: 'mat_result',
    //     filters:[{
    //       value: 0,
    //       text: '待定'
    //     },{
    //       value: 1,
    //       text: '是'
    //     },{
    //       value: -1,
    //       text: '否'
    //     },],
    //     render:(text, record)=>{
    //       if(text > 0){
    //         return <Tag color='#64ea91' style={{
    //           background: Colors.greenAlpha, 
    //           border: `1px solid ${Colors.green}`
    //           }} >是</Tag>
    //       } else if(text === -1) {
    //         return <Tag color='#f69899' style={{
    //           background: Colors.redAlpha, 
    //           border: `1px solid ${Colors.red}`
    //           }}>否</Tag>
    //       } else {
    //         return <Tag color='#f8c82e' style={{
    //           background: Colors.yellowAlpha, 
    //           border: `1px solid ${Colors.yellow}`
    //           }}>待定</Tag>
    //       }
    //     }
    //   },
		// 	{
		// 		title:"操作",
		// 		key:"action",
		// 		colSpan: 2,
		// 		render:(text, record)=>(<Button type="primary" onClick={() =>this._action('detail',record)}>查看截图</Button>)
		// 	}
    // ];
    // this.body = {
    //   "owner_group":"居民",
    //   "per_page":5
    // }
  }

  componentDidMount(){
    // this._getEvent_1();
    // this._getEvent_2("door");
    // this._getEvent_2("building");
  }

	//操作栏功能
	// _action(type,mess){
  //   if(mess.attachment && mess.attachment!==undefined &&  mess.attachment !== ""){
  //     this.setState({
  //       attachment: appServer.imguri + mess.attachment,
  //     })
  //   }
  //   this.setState({
  //     mat_degree:mess.mat_degree,
  //     nid_index: mess.nid_index
  //   })
  //   if(mess.mat_degree >= 60 ){
  //     this.setState({mat_degree_color: '#1a85bd'})
  //   } else {
  //     this.setState({mat_degree_color: '#dc4937'})
  //   }
  //   this.setState({visible: true});
	// }

	//获取后台信息
  // _getEvent_1(pageNum = 1) {
  //   let afteruri = 'ent_records/v2_search_fail?page=' + pageNum;
  //   let body = this.body
  //   appData._dataPost(afteruri,body,(res) => {
  //     let data = res.data;
  //     this.setState({
	// 			total:res.total,
	// 			dataSource: data,
  //       pageNum,
	// 		})
	// 	})
  // }
  
  // //热点记录
  // _getEvent_2(type){
  //   let afteruri = 'entryrecords/v2_gates';
  //   let body = {}
  //   body = {
  //     "loc_type":2,
  //     "count":4,
  //   }
  //   if(type === "door") body["loc_type"] = 1;
  //   else if(type === "building") body["loc_type"] = 2;
  //   appData._dataPost(afteruri,body,(res) => {
  //     let data = res.data
  //     if(type === "door") this.setState({dataSource_2: data,});
  //     else if(type === "building")  this.setState({dataSource_3: data,});
	// 	})
  // }
  
  _leadingOut(){
  }

  // _topCards(val, index){
  //   return (
  //     <Col lg={6} md={12} xs={24} key={index} className="IOrecord-Door-List">
  //       <h1 className="IOrecord-Door-title">{val.name}</h1>
  //       <Row className="IOrecord-Door-Bottom">
  //         <Col span={9} className='card-list-title'>今日出入</Col>
  //         <Col span={7} className='card-num'>{val.today.entrys}</Col>
  //         <Col span={8} className='card-change-num'>
  //           <Tag  style={{
  //             background: val.today.flag === 1?Colors.greenAlpha : Colors.redAlpha, 
  //             border: val.today.flag === 1? `1px solid ${Colors.green}` :  `1px solid ${Colors.red}`
  //             }} className='card-tag'>{val.today.flag === 1?'+': '-'}{val.today.number}</Tag>
  //         </Col>

  //         <Col span={9} className='card-list-title'>七日出入</Col>
  //         <Col span={7} className='card-num'>{val.week.entrys}</Col>
  //         <Col span={8} className='card-change-num'>
  //           <Tag  style={{
  //             background: val.week.flag === 1?Colors.greenAlpha : Colors.redAlpha, 
  //             border: val.week.flag === 1? `1px solid ${Colors.green}` :  `1px solid ${Colors.red}`
  //             }} className='card-tag'>{val.week.flag === 1?'+': '-'}{val.week.number}</Tag>
  //         </Col>

  //         <Col span={9} className='card-list-title'>本月出入</Col>
  //         <Col span={7} className='card-num'>{val.month.entrys}</Col>
  //         <Col span={8} className='card-change-num'>
  //           <Tag style={{
  //             background: val.month.flag === 1?Colors.greenAlpha : Colors.redAlpha, 
  //             border: val.month.flag === 1? `1px solid ${Colors.green}` :  `1px solid ${Colors.red}`
  //             }} className='card-tag'>{val.month.flag === 1?'+': '-'}{val.month.number}</Tag>
  //         </Col>
  //       </Row>
  //     </Col>
  //   )
  // }

	// handleCancel() {
	// 	this.setState({visible: false,attachment: ""});
  // }
  
  // _sorter(pagination, filters, sorter){
  //   Object.assign(this.body, filters)
  //   this._getEvent_1(1)
  // }

  render(){
    return (
      <Row>
        <Col>
          {/* <div className="IOrecord-More">
            <Link to='/contant/ResidentManage/IOFailedRecord/detail'><Button type='primary'>点击查看更多</Button></Link>
          </div> */}
          {/* <Table dataSource={this.state.dataSource} onChange={this._sorter.bind(this)} columns={this.columns} rowKey='id' pagination={false} style={{marginBottom: 20}}/>  */}
          <IOFailedRecordDetail />
        </Col>
      </Row>
    )
  }
}

export default IOFailedRecord;