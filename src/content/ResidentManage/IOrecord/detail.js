
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

export default class IORecordDetail extends Component{
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
        colSpan: 1,
        title: '姓名',
        dataIndex: 'name',
      },
      {
        colSpan: 1,
        title: '卡片类型',
        dataIndex: 'category',
        render: (text)=> <span>{text === "Y"?"业主": "租户"}</span>
      },
      {
        colSpan: 1,
        title: '用户组',
        dataIndex: 'group',
      },
      {
        colSpan: 1,
        title: '门禁位置',
        dataIndex: 'loc_description',
      },
      {
        colSpan:1,
        title: '卡号',
        dataIndex: 'printed_id',
      },
      {
        colSpan: 1,
        title: '出入时间',
        dataIndex: 'created_at',
      },
      {
        colSpan: 1,
        title: '房间号',
        dataIndex: 'flatNo',
      },
      {
        colSpan: 1,
        title: '识别结果',
        dataIndex: 'mat_result',
        filters:[{
          value: 0,
          text: '待定'
        },{
          value: 1,
          text: '是'
        },{
          value: -1,
          text: '否'
        },],
        render:(text, record)=>{
          if(text > 0){
            return <Tag color='#64ea91' style={{
              background: Colors.greenAlpha, 
              border: `1px solid ${Colors.green}`
              }} >是</Tag>
          } else if(text === -1) {
            return <Tag color='#f69899' style={{
              background: Colors.redAlpha, 
              border: `1px solid ${Colors.red}`
              }}>否</Tag>
          } else {
            return <Tag color='#f8c82e' style={{
              background: Colors.yellowAlpha, 
              border: `1px solid ${Colors.yellow}`
              }}>待定</Tag>
          }
        }
      },
			{
				title:"操作",
				key:"action",
				colSpan: 2,
				render:(text, record)=>(<Button type="primary" onClick={() =>this._action('detail',record)}>查看截图</Button>)
			}
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
    let afteruri = 'ent_records/v2_search?page=' + pageNum;
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
				<Modal
					visible={this.state.visible}
					title= "实时截图"
          destroyOnClose = {true}
          onCancel={this.handleCancel.bind(this)}
          className="IOrecord-modal"
					footer={[
						<Button key="back" type="primary" size="large" onClick={this.handleCancel.bind(this)}>取消</Button>
					]}>
						<Row type="flex">
							<Col span={24}>
								<img src={this.state.attachment} style={{height: "100%", width: '100%'}} alt="暂无截图"/>
							</Col>
							<Col style={{padding: '5px 10px', marginTop: "10px", background:this.state.mat_degree_color, fontSize: '16px', color: "white", fontWeight: '600', borderRadius:'3px', marginRight: '10px'}}>
								相似度：{this.state.mat_degree}
							</Col>
						</Row>
				  </Modal>
      </div>
    )
  }
}