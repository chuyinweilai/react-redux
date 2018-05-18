import React,{ Component } from 'react';
import {
  Table,
  Input,
  Button,
  Row,
  Col,
  Radio,
  Pagination,
  Tag,
  Menu,
  message,
  Modal,
  Card,
  Dropdown,
} from 'antd';
import { Link } from 'react-router-dom';
import { Colors, appData, appServer} from './../../../assert';
import './index.scss';
const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class Realtime extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: [],
      pageNum: 1,
      total: 0,
      //列表展开      
      openList: false,

      //弹窗开关
      visible_1: false,
      visible_2: false,
      visible_3: false,
      //加载中
      loading: false,
      //选中项
      choose: {},
      //处理方式Key
      radioKey: 0,
      //其他输入内容
      otherInput: '',
      //备注
      remarks: '',

      warnings: [],
    };
    this.userMess = '';
    this.report = '';
    this.record = {};
    this.body={};
    this.alarm_type = [];
    this.columns = [
      {
        colSpan:1,
        title: 'ID',
        dataIndex: 'id',
      },
      {
        colSpan:1,
        title: '发生时间',
        dataIndex: 'created_at',
        sorter: true
      },
      {
        colSpan: 1,
        title: '报警内容',
        dataIndex: 'type.title',
      },
      {
        colSpan: 1,
        title: '状态',
        dataIndex: 'status',
        filters: [
          {
            text: '新建',
            value: '新建',
          }, {
            text: '处理中',
            value: '处理中',
          }, {
            text: '关闭',
            value: '关闭',
          }
        ],
        render: (text, it) => {
          const status = {
            新建: {border: `1px solid ${Colors.green}`, background: Colors.greenAlpha, color: 'white'} ,        
            处理中: {border: `1px solid ${Colors.red}`, background: Colors.redAlpha, color: 'white'},        
            关闭: {border: `1px solid ${Colors.yellow}`, background: Colors.yellowAlpha, color: 'white'},        
          }
          return <Tag style={status[it.status]}>{`${text}${it.closure_code? "-" + it.closure_code : ""}`}</Tag>
        },
      },
      {
        colSpan: 1,
        title: '所属楼宇',
        dataIndex: 'loc_description',
      },
      {
        colSpan: 1,
        title: '处理人',
        dataIndex: 'agent_name',
      },
      {
        colSpan: 1,
        title: '处理日期',
        dataIndex: 'updated_at',
        sorter: true
      },
      {
        title:"操作",
        key:"action",
        colSpan: 3,
        render:(text, record)=>{
          return (
            <Row type="flex" justify="space-between">
              <Button type="primary" onClick={() => this._Modal1(record)}>查看</Button>

              <Dropdown overlay={
                <Menu onClick={e => this._pushTo(record, e)}>
                  <Menu.Item key="1">推送到1号机</Menu.Item>
                  <Menu.Item key="2">推送到2号机</Menu.Item>
                  <Menu.Item key="3">推送到3号机</Menu.Item>
                </Menu>}>
                <a >报警推送</a>
              </Dropdown>

              <Dropdown overlay={
                <Menu onClick={(e) => this._fastdeal(record.id,e.key)}>
                  { record.dealType.map((val,index) => <Menu.Item key={val}>{val}</Menu.Item>) }
                </Menu>}>
                <a >快速处理</a>
              </Dropdown>
            </Row>
          )
        }
      }
    ];
  }

	componentWillMount(){
    appData._Session('get',"userMess",(userMess) =>{
      this.userMess = userMess;
      this.body = {
        "alarm_type": "通道",
        "duration": "month",
      }
      this._getFilter();
      this._getNumber();
    })
  }
  
  // 获取筛选列表
  _getFilter(){
    let url = "comm_alerts/v2_type";
    let body = {
      "alarm_type":"通道",
    }
    appData._dataPost(url, body, (res) =>{
      this.alarm_type = res;
      this.columns[2]["filters"] = res;
      this._getEvent(1);
    })
  }

  // 获取数量统计
  _getNumber() {
    let afteruri = 'decision/v2_warning';
    let body = {}
    body = {
      "alarm_type":"通道",
	    "duration":"day",
    }
    appData._dataPost(afteruri,body,(res) => {
      if(!res.result){
        this.setState({
          warnings: res.data
        })
      }
    })
	}

	//获取后台信息
  _getEvent(pageNum = 1, openList = false) {
    openList?this.body["per_page"] = 10: this.body["per_page"] = 5;
    let afteruri = 'comm_alerts/v2_search?page=' + pageNum;
    appData._dataPost(afteruri,this.body,(res) => {
      let data = res.data
			this.setState({
        openList: openList,
				total:res.total,
				dataSource: data,
        pageNum,
			})
		})
	}
  
  // 顶部选项卡
  _topCards(val,index){
    const acolor = [Colors.red, Colors.blue, Colors.green, Colors.yellow];
    return (
      <Col lg={8} md={12} xs={24} key={index} className="IntradayWarning-topCard">
        <h1 className="IntradayWarning-topCard-title" style={{color: acolor[index]}}><i className="fa fa-bell-o" />{val.name}</h1>
        <Row className="IntradayWarning-topCard-Bottom">
          <Col className="IntradayWarning-topCard-Bottom-1" style={{color: acolor[index]}}>{val.count}<span>件</span></Col>
          <Col className="IntradayWarning-topCard-Bottom-2">
            <Link to={{
              pathname: "/contant/ChannelManagement/RealtimeWarning/detail",
              state: {alarm_type: this.alarm_type[index]}
            }}><span style={{color: 'rgba(252, 252, 253, 0.5)'}}>点击查看更多>></span></Link>
          </Col>
        </Row>
      </Col>
    )
  }

  // table筛选相关
  _sorter(pagination, filters, sorter){
    let body = {
      "alarm_type": "通道",
    }
    if(Object.getOwnPropertyNames(sorter).length){
      body[sorter.field] = sorter.order;
    }
    if(filters["type.title"] && filters["type.title"].length){
      body = Object.assign(body, {"alarm_info": filters["type.title"]})
    }
    if(filters.status){
      body = Object.assign(body, filters)
    }
    this.body = body;
    this._getEvent(1, this.state.openList)
  }

  // 列表收放 
  _leadingOut(){
    let openList = this.state.openList;
    this._getEvent(1, !openList);
  }

  //查看详情弹窗
  _Modal1(record){
    this.setState({
      choose: record,
      visible_1: true,
    })
  }

  //推送报警
  _pushTo(record, e){
    this.report = e.key;
    this.record = record;
    this.setState({
      visible_3: true,
    })
  }

  //快速处理
  _fastdeal( id = 0, closure_code = "等待处理", comments = ""){
    let userMess = this.userMess;
    let url = "comm_alerts/v2_close";
    let body = {
      "id": id,
      "agent_id": userMess.id,
      "closure_code": closure_code,
      "comments": comments,
    }
    appData._dataPost(url, body, (res) => {
      if(!res.result){
        this.setState({visible_1: false})
        message.success("处理成功")
        this._getEvent()
      } else {
        message.error(res.info)
      }
    })
  }

  //弹出框下半部操作
  _onModal_1(type,e){
    //操作选择
    if(type === "radio") this.setState({ radioKey: e.target.value })
    //备注内容
    else if(type === "remarks") this.setState({ remarks: e.target.value })
  }

  //视频弹窗
  _movieAlert(){
    (this.state.choose.videosrc.indexOf('.mp4v')+1)?
    (window.open(this.state.choose.videosrc,'_blank')):
    this.setState({visible_2: true})
  }

  //弹窗确认取消相关
  _Modal1_Ok(){
    this._fastdeal(this.state.choose.id, this.state.radioKey, this.state.remarks)
  }

  _Modal3_Ok(){
    let url = "comm_alerts/v2_push";
    let body = {
      "alert_id": this.record.id,
      "to_id": this.report,
    }
    appData._dataPost(url, body, (res)=>{
      if(!res.result){
        message.success('推送成功');
        this.setState({visible_3: false})
      } else {
        message.error(res.info)
      }
    })
  }

  // 搜索功能
  _search(e){
    let value = e.target.value;
    this.body = {
      "search": value,
      "alarm_type":"居民",
    }
    this._getEvent(1, true)
  }

  render(){
    const choose = this.state.choose;
    return (
      <Row>
        <Col>
          <Row type="flex" className="IntradayWarning-Top-List">
            {this.state.warnings.map(this._topCards.bind(this))}
          </Row>
        </Col>
        <Col className="IntradayWarning-Bottom">
          <Row type="flex">
            <Col span={12}>
              <h3 className="Title">最新报警记录</h3>
            </Col>
            <Col span={12} className="Button">
              <input onChange={this._search.bind(this)} style={{display:this.state.openList? "inline-block": "none"}} placeholder="请输入搜索"/>
              <Button type='primary' onClick={()=>this._leadingOut()}>{this.state.openList?'收起列表':'展开列表'}</Button>
            </Col>
          </Row>
          <Table className="Table" onChange={this._sorter.bind(this)} dataSource={this.state.dataSource} columns={this.columns} rowKey='id' pagination={false} style={{marginBottom: 20}}/> 
          <Row type="flex" justify="end" style={{display: this.state.openList?'flex': 'none'}}>
            <Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
          </Row>
        </Col>

        {/* 查看详情 */}
        <Modal
          width= '6.66rem'
          closable={false}
          destroyOnClose = {true}
          className="ModalDetail-Modal"
          visible={this.state.visible_1}
          onOk={this._Modal1_Ok.bind(this)}
          onCancel={()=>this.setState({visible_1: false})}
        >
          <Card title={choose.type? choose.type.title:""} className="ModalDetail">
            <Row className="ModalDetail-Top" gutter={24}>
              <Col lg={16} md={14} xs={24}>
                <div className="Image">
                  <img src={appServer.imguri +  choose.attachment} alt=""/>
                </div>
                <ul>
                  <li><i style={{color: "#337ab7"}} className="fa fa-building"></i>{`地址:` + choose.loc_description}</li>
                </ul>
              </Col>
              <Col lg={8} md={10} xs={24} className="Warning-Reason-Box">
                <Card title={<h3><i className="fa fa-bell"></i> 报警原因</h3>}  className="Warning-Reason">
                  {choose.type? choose.type.alarm_condition : "" }
                </Card>
                {
                  choose.source_id?
                  <Button type="primary" className="Video-Button" onClick={()=>this.setState({visible_2: true})}> 
                    <i className="fa fa-play-circle-o" aria-hidden="true"></i>
                    视频确认
                  </Button>:
                  null
                }
              </Col>
            </Row>
            <Row className="ModalDetail-Bottom" gutter={24}>
              <Col span={6}>
                <RadioGroup name="radiogroup" defaultValue={choose.closure_code} onChange={this._onModal_1.bind(this, 'radio')} >
                { choose.dealType? choose.dealType.map((val,index) => <Radio key={index} value={val} className="Radio">{val}</Radio>): null }
                </RadioGroup>
              </Col>
              <Col span={18}>
                <TextArea placeholder="备注..." defaultValue={choose.comments} rows={8} className="TextArea" onChange={this._onModal_1.bind(this, 'remarks')}/>
              </Col>
            </Row>
          </Card>
        </Modal>

        {/* 视频窗口 */}
        <Modal
          visible={this.state.visible_2}
          title="视频播放"
          width= '760'
          destroyOnClose = {true}
          onCancel={()=> this.setState({visible_2: false})}
          footer={[
            <Row gutter={8} type="flex" justify="end">
              <Col>
                <Button key="back" type="primary" size="large" onClick={()=> this.setState({visible_2: false})}>取消</Button>
              </Col>
            </Row>
          ]} 
        >
          {this.state.videoWindow?
            <video src={this.state.choose.videosrc} autoPlay width={'720'} height={'540'}></video>:
            <object  type='application/x-vlc-plugin' id='vlc' events='True' width="720" height="540" pluginspage="http://www.videolan.org" codebase="http://downloads.videolan.org/pub/videolan/vlc-webplugins/2.0.6/npapi-vlc-2.0.6.tar.xz">  
              <param name='mrl' value= {'rtsp://admin:admin@' + this.state.vlc_id + ':554/cam/realmonitor?channel=1&subtype=1'} />    
              <param name='volume' value='50' />  
              <param name='autoplay' value='true' />  
              <param name='loop' value='false' />  
              <param name='fullscreen' value='false' />  
              <param name='controls' value='false' />  
            </object>
          }
        </Modal>

        {/* 报警推送 */}
        <Modal
          destroyOnClose = {true}
          visible={this.state.visible_3}
          onOk={this._Modal3_Ok.bind(this)}
          onCancel={()=>this.setState({visible_3: false})}
        >
          <span className="PushTo">即将推送报警到{this.report}号机</span>
        </Modal>
      </Row>
    )
  }
}