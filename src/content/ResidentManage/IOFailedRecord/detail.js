
import React,{Component} from 'react';
import{
  Row,
  Col,
  Tag,
  Table,
  Button,
  Modal,
  Input,
  Pagination
} from 'antd';
import { appData, appServer, Colors } from './../../../assert';
const { Search } = Input

export default class IOrecordFailedDetail extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: [],
      pageNum: 1,
      total: 0,
      visible: false,
    }
    this.mess = '';
    this.columns = [
      {
        colSpan:1,
        title: '姓名',
        dataIndex: 'name',
      },
      {
        colSpan:1,
        title: '卡号',
        dataIndex: 'printed_id',
      },
      {
        colSpan: 1,
        title: '门禁位置',
        dataIndex: 'loc_description',
      },
      {
        colSpan: 1,
        title: '刷卡时间',
        dataIndex: 'created_at',
      },
      {
        colSpan: 1,
        title: '失败原因',
        dataIndex: 'reason',
      },
      {
        colSpan: 1,
        title: '详情',
        dataIndex: 'memo',
      },

    ];
    this.body = {
      "owner_group":"居民",
      "per_page":this.props.per_page
    }
  }

  static defaultProps = {  
    showDetail:true, 
    per_page:10
  } 

  componentWillMount(){
    console.log(this.body);
    this.mess = this.props.message;
    this._getEvent(1)
  }

	//操作栏功能
	_action(type,mess){
    if(mess.attachment && mess.attachment!==undefined &&  mess.attachment !== ""){
      this.setState({
        attachment: appServer.imguri + mess.attachment,
      })
    }
    this.setState({
      mat_degree:mess.mat_degree,
      nid_index: mess.nid_index
    })
    if(mess.mat_degree >= 60 ){
      this.setState({mat_degree_color: '#1a85bd'})
    } else {
      this.setState({mat_degree_color: '#dc4937'})
    }
    this.setState({visible: true});
	}

	//获取后台信息
  _getEvent(pageNum = 1) {
    let afteruri = 'ent_records/v2_search_fail?page=' + pageNum;
    let body = this.body;

    appData._dataPost(afteruri,body,(res) => {
      let data = res.data
			this.setState({
				total:res.total,
				dataSource: data,
        pageNum,
			})
    })
  }

  _back(){
    this.props.history.goBack();
  }

	handleCancel() {
		this.setState({visible: false,attachment: ""});
  }
  
  //搜索框 
  _Search(e){
    this.body['search'] = e.target.value;
    this._getEvent(1);
  }
  
  _sorter(pagination, filters, sorter){
    Object.assign(this.body, filters)
    this._getEvent(1)
  }

  render(){
    return (
      <div>
        <Row type="flex" className="intraday-detail-search">
          <Col span={16} style={{display:this.props.showDetail? "block": "none"}}>
            <Button  type='primary' className="IOrecord-detail-button" onClick={()=>this._back()}>返回</Button>
          </Col>
          <Col span={8} style={{display:this.props.showDetail? "block": "none"}}>
            <Search 
              ref="searchInput"
              placeholder = "请输入搜索"
              className="printHidden"
              style={{width: "100%"}}
              onChange={this._Search.bind(this)}
            />
          </Col>
        </Row>
        <Table dataSource={this.state.dataSource} onChange={this._sorter.bind(this)} columns={this.columns} rowKey='id' pagination={false} style={{marginBottom: 20}}/> 
        <Row type="flex" justify="end">
          <Pagination style={{display:this.props.showDetail? "block": "none"}} showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
        </Row>
				
      </div>
    )
  }
}