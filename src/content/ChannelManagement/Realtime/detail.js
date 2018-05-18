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
  DatePicker
} from 'antd';
import { appData, appServer, Colors} from './../../../assert';
import './index.scss';
const RadioGroup = Radio.Group
const { TextArea, Search } = Input;

class RealtimeDetail extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: [],
      pageNum: 1,
      total: 0,
      //日期搜索
      startValue: null,
      endValue: null,
      endOpen: false,
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
    };
    //筛选报警     
    this.userMess = '';
    
    this.body = {};
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
        dataIndex: 'type',
        render:(text) => {
          return <span>{text.title}</span>
        }
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
    this.report = '';
    this.type = 0;
  }

	componentWillMount(){
    appData._Session('get',"userMess",(userMess) =>{
      this.userMess = userMess;
      let alarm_type = this.props.location.state? this.props.location.state.alarm_type: this.props.history.goBack();
      this.title = alarm_type.text;
      this.body  = {
        "alarm_type": "通道",
        "alarm_info": [alarm_type.value],
      }
      this._getEvent(1);
    })
	}
  
	//获取后台信息
  _getEvent(pageNum = 1) {
    let afteruri = 'comm_alerts/v2_search?page=' + pageNum;
    appData._dataPost(afteruri,this.body,(res) => {
      let data = res.data
			let len = data.length;
			this.setState({
				total:res.total,
				dataSource: data,
        count:len,
        pageNum,
			})
		})
  }
  
  //搜索框 
  _Search(e){
    this.body['search'] = e.target.value;
    this._getEvent(1);
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
    } else {
      body = Object.assign(body, filters)
    }
    this.body = body;
    this._getEvent(1, this.state.openList)
  }
  
  // 选择开始日期
  disabledStartDate(startValue){
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() >= endValue.valueOf();
  }

  // 选择结束日期
  disabledEndDate(endValue) {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  
  // 日期确认操作
  onChange(field, value){
    this.setState({
      [field]: value,
    });
  }

  handleStartOpenChange(open){
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange(open){
    this.setState({ endOpen: open });
  }

  _timeOk(e){
    let startValue = this.state.startValue;
    let endValue = this.state.endValue;
		let startDate = startValue.format('YYYY-MM-DD HH:mm:ss');
    let endDate = endValue.format('YYYY-MM-DD HH:mm:ss');
    if(this.type === 2){
      this.body['alarm_info'] = "异常出入";
      this.body['start_date'] = startDate;
      this.body['end_date'] = endDate;
    } else if(this.type === 3){
      this.body['alarm_info'] = "独居老人";
      this.body['start_date'] = startDate;
      this.body['end_date'] = endDate;
    }
    this._getEvent(1);
  }


  //推送报警
  _pushTo(e){
    this.report = e.key;
    this.setState({
      visible_3: true,
    })
  }

  //快速处理
  _fastdeal( id = 0, closure_code = "等待处理", comments = ""){
    let userMess = this.userMess;
    let url = "";
    let body = {
      "id": id,
      "agent_id": userMess.id,
      "closure_code": closure_code,
      "comments": comments,
    }
    if(closure_code === "等待处理"){
      url = "comm_alerts/v2_take";
    } else{
      url = "comm_alerts/v2_close";
    }
    appData._dataPost(url, body, (res) => {
      if(res.result){
        this.setState({visible_1: false})
        message.success("处理成功")
        this._getEvent()
      } else {
        message.error(res.info)
      }
    })
  }

  //查看详情弹窗
  _Modal1(record){
    this.setState({
      choose: record,
      visible_1: true,
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

  render(){
    const choose = this.state.choose;
    return (
      <Row>
        <Button type='primary' onClick={()=>this.props.history.goBack()}>返回</Button>
        <Row type="flex" className="Realtime-detail-search">
          <Col span={8}>
            <Search
              ref="searchInput"
              placeholder = "请输入搜索"
              className="printHidden"
              style={{width: "100%"}}
              onChange={this._Search.bind(this)}
            />
          </Col>
        </Row>
        
        <Row type="flex" className="Realtime-detail-datepicker" gutter={24}>
          <Col lg={6} md={8} xs={12}>
            <DatePicker
              disabledDate={this.disabledStartDate.bind(this)}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={this.state.startValue}
              placeholder="开始时间"
              onChange={(value) => this.onChange('startValue', value)}
              onOpenChange={this.handleStartOpenChange.bind(this)}
              style={{width: "100%"}}
            />
          </Col>
          <Col lg={6} md={8} xs={12}>
            <DatePicker
              disabledDate={this.disabledEndDate.bind(this)}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              value={this.state.endValue}
              placeholder="截止时间"
              onChange={(value) => this.onChange('endValue', value)}
              open={this.state.endOpen}
              onOpenChange={this.handleEndOpenChange.bind(this)}
              onOk={this._timeOk.bind(this)}
              style={{width: "100%"}}
            />
          </Col>
        </Row>
        <Table dataSource={this.state.dataSource} columns={this.columns} rowKey='id' pagination={false} style={{marginBottom: 20}} onChange={this._sorter.bind(this)}/> 
        <Row type="flex" justify="end">
          <Pagination showQuickJumper defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
        </Row>

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
          destroyOnClose = {true}
          visible={this.state.visible_2}
          title="视频播放"
          width= '760'
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
export default RealtimeDetail;