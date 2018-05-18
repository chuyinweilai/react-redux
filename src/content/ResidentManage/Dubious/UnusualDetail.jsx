
import React, { Component } from 'react';
import { 
	Table, 
	Button, 
	Row,
	Col,
	Pagination,
	Card,
	Carousel, 
} from 'antd'
import {appData, appServer} from './../../../assert';
import { Link } from 'react-router-dom';

export default class IC_dobious extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			count: 1,
			total:0,
			pageNum:1,
			_visible:false,
			imguri: '',
			id: 0,

			imgList:[],
			carouselHTML: "",
		};

		this.columns = [
			{
				colSpan:1,
				title: 'ID',
				dataIndex: 'record_id',
			},
			{
				colSpan:1,
				title: '门禁ID',
				dataIndex: 'id',
			},
			{
				colSpan: 1,
				title: '门禁位置',
				dataIndex: 'loc_description',
			},
			{
				colSpan:1,
				title: '卡号',
				dataIndex: 'access_number',
			},
			{
				colSpan: 1,
				title: '最近一次进入时间',
				dataIndex: 'attempted_at',
			},
			{
				colSpan: 1,
				title: '识别结果',
				dataIndex: 'mat_degree',
				render:(text, record)=>{
					let num = record.mat_degree;
					if(num > 0){
						return <text style={{color: '#1a85bd'}}>是</text>
					} else if(num === -1) {
						return <text style={{color: '#dc4937'}}>否</text>
					} else {
						return <text style={{color: '#e47833'}}>待定</text>
					}
				}
			},
			{
				colSpan: 1,
				title: '归属业主楼号',
				render:(text, record)=>{
					let str_number = record.owner_code.split('-')[0]
						return (
							<text>{str_number}</text>
						)
				}
			},
			{
				colSpan: 1,
				title: '归属业主楼号房间号',
				dataIndex: 'owner_code',
			}, 
			{
				colSpan: 1,
				title: '卡号类型',
				dataIndex: 'access_type',
				render:(text)=>{
					if(text === "D"){
						return <text>常住</text>
					} else if(text === "E"){
						return <text>暂住</text>
					} else if(text === "F"){
						return <text>临时</text>
					} else if(text === "G"){
						return <text>幼儿园</text>
					} else if(text === "K"){
						return <text>电子钥匙</text>
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
		this.Router = null;
		this.mess = null;
		this.filter = [1,2,3,4,5];
		this.body = {};

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
	}

	componentWillMount(){
		this.mess = this.props.location.state;
		this.body = {
			"printed_id":this.mess.record.access_number,
			"access_number":this.mess.record.access_number,
			"owner_group":"居民",
			"score":0
		};
		this._getEvent();
		this._familyImg();
	}

	//操作栏功能
	_action(type,mess){
		if(type === "detail"){
			this.setState({
				id: mess.record_id,
				imguri: mess.attachment
			})
		} else if(type === "back"){
			this.props.changePage("index", this.props.message)
		} 
	}
	
	//分页器activity/list?page=num
	_getEvent(pageNumber = 1){
		let afteruri = 'entrance_records/search?page=' + pageNumber;
		let body = this.body
		body["per_page"] = 3
		appData._dataPost(afteruri,body,(res) => {
			let data = res.data;
			let len = data.length;
			this.setState({
				imguri: data[0].attachment,
				total:res.total,
				dataSource: data,
				count:len,
				pageNum:pageNumber
			})
		})
	}

	_familyImg(){
		let property_id = this.mess.record.access_number;
		let afteruri = 'residents/getnid';
		let body = {
				"property_id": property_id
		}
		appData._dataPost(afteruri,body,(res) => {
			let arr = [];
			res.forEach((val, index)=>{
				arr.push(appServer.imguri + "faceID/" + val.nid + ".jpg")
			})
			this.setState({
				imgList: arr,
			})
		})
	}

	_imgList(){
		if(this.state.imgList.length !== 0){
			let htmls = 
				<Carousel ref={e => this.sliderWay = e}>
					{
						this.state.imgList.map((val,index)=>{
							return (
								<img src={val} key={index} alt='无该家庭照片' style={{height: '350px', width: '500px', display: 'inline-block', border: '1px solid #eee'}}/>
							)
						})
					}
				</Carousel>
			return htmls;
		} else return null
	}

  next(){
		this.sliderWay.refs.slick.innerSlider.slickNext()
  }
  previous() {
		this.sliderWay.refs.slick.innerSlider.slickPrev()
	}

	render() {
		let columns = this.columns;
		return (
			<Card title="可疑卡号/异常详情"  style={{border: '1px solid #ccc'}} noHovering 
				extra={
				<Link to={{
					pathname:'/contant/ResidentManage/IntradayWarning/Dubious',
					state: this.mess
				}}>
					<Button>返回</Button>
				</Link> }
			> 
				<Row type="flex">
					<Col lg={12} md={24} style={{display: 'flex', alignItems:"center",border: '1px solid #eee', padding: "10px", flexDirection:'column'}}>
						<img src={ appServer.imguri + this.state.imguri} alt="该记录无截图" style={{height: "350px", width: "500px", display: 'inline-block',textAlign:'center', fontSize: '16px', border: "1px solid #eee"}}/>
						<div style={{margin:'15px 0', display: 'flex', justifyContent:'center'}}>
							<h4 style={{fontSize: '16px'}}>
							{this.state.id}号记录照片</h4>
						</div>
					</Col>
					<Col lg={12} md={24} style={{border: '1px solid #eee', padding: "10px"}}>
						{this._imgList()}
						<div style={{margin:'15px 0', display: 'flex', alignItems:'center', flexDirection:'column'}}>
							<h4 style={{fontSize: '16px'}}>家庭人员照片</h4>
							<span>
								<Button onClick={this.previous}>上一张</Button>
								<Button onClick={this.next}>下一张</Button>
							</span>
						</div>
					</Col>
					<Col span={24} style={{marginTop: 32}}>
						<Col span={24} style={{textAlign:'right', marginBottom: "32px"}}>
						</Col>
						<Table size="small" bordered dataSource={this.state.dataSource} columns={columns} rowKey='record_id' pagination={false} style={{marginBottom: 20}}/> 
						<Row type="flex" justify="end" className="printHidden">
							<Pagination showQuickJumper pageSize={3} defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
						</Row>
					</Col>
				</Row>
			</Card>
		);
	}
}