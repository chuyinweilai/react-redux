
import React,{Component} from 'react';
import{
  Row,
  Col,
  Tag,
  Table,
  Button,
  Pagination,
  Modal
} from 'antd';
import { appData, appServer, Colors} from './../../../assert';
import Link from 'react-router-dom/Link';

export default class MotionDetail extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: [],
      pageNum: 1,
      total: 0,
      attachment: '',
      visible_1: false,
    }
    this.cards = 0;
    this.columns = [
      {
        colSpan: 1,
        title: 'id',
        dataIndex: 'id',
      },
      {
        colSpan:1,
        title: '姓名',
        dataIndex: 'name',
      },
      {
        colSpan: 1,
        title: '位置',
        dataIndex: 'loc_description',
      },
      {
        colSpan: 1,
        title: '进入时间',
        dataIndex: 'created_at',
      },
      {
        colSpan: 1,
        title: '识别结果',
        dataIndex: 'mat_degree',
        render:(text, record)=>{
          let num = record.mat_degree;
          if(num > 0){
            return <Tag color='#64ea91' style={{borderColor: Colors.green, background: Colors.greenAlpha}}>是</Tag>
          } else if(num === -1) {
            return <Tag color='#f69899' style={{borderColor: Colors.red, background: Colors.redAlpha}}>否</Tag>
          } else {
            return <Tag color='#f8c82e' style={{borderColor: Colors.yellow, background: Colors.yellowAlpha}}>待定</Tag>
          }
        }
      },
      {
        colSpan: 1,
        title: '查看截图',
        dataIndex: 'active',
        render:(text, record) => {
          return <Button onClick={() => this._openModal(record)}>详情</Button>
        }
      }
    ];
  }

  componentWillMount(){
    this.cards = this.props.location.state.cards;
    this._getEvent(1)
  }

	//get data
  _getEvent(pageNum = 1) {
    let afteruri = 'ent_records/v2_getEnListFromNum?page=' + pageNum;
    let body = {}
    body = {
      "number": this.cards,
    }
    appData._dataPost(afteruri,body,(res) => {
      let data = res.data
			this.setState({
				total:res.total,
				dataSource: data,
        pageNum,
			})
		})
  }

  // open modal
  _openModal(record){
    this.setState({
      visible_1: true,
      attachment: record.attachment,
    })
  }

  // close modal
  _closeModal(){
    this.setState({
      visible_1: false,
      attachment: "",
    })
  }

  render(){
    return (
      <Row>
        <Col style={{marginBottom:'0.4rem'}}>
          <Link to={{pathname:'/contant/ResidentManage/MotionTracking', state: { cards: this.cards }}}> <Button type='primary'>返回</Button></Link>
        </Col>
        <Table dataSource={this.state.dataSource} columns={this.columns} rowKey='id' pagination={false} style={{marginBottom: 20}}/> 
        <Row type="flex" justify="end">
          <Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
        </Row>
        <Modal
          visible={this.state.visible_1}
          onCancel={this._closeModal.bind(this)}
          className="motionTracking-modal"
          destroyOnClose = {true}
          closable={false}
          footer={
            <Button onClick={this._closeModal.bind(this)}>关闭</Button>
          }
        >
          {/* 1280*720 16 9*/}
          <img src={appServer.imguri + this.state.attachment} alt="暂无截图"/>
        </Modal>
      </Row>
    )
  }
}