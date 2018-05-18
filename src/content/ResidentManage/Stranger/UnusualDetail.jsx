
import React, { Component } from 'react';
import { 
	Table, 
	Button, 
	Row,
	Col,
	Pagination,
	Carousel, 
} from 'antd'
import {appData, appServer} from './../../../assert';
import { Link } from 'react-router-dom';

export default class IC_dobious extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
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
				dataIndex: 'printed_id',
			},
			{
				colSpan: 1,
				title: '最近一次进入时间',
				dataIndex: 'created_at',
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
				title: '归属业主房间号',
				dataIndex: 'unitNo',
			},
			{
				colSpan: 1,
				title: '归属业主房间号',
				dataIndex: 'flatNo',
			},
			{
				title:"操作",
				key:"action",
				colSpan: 2,
				render:(text, record)=>(<Button type="primary" onClick={() =>this._action(record)}>查看截图</Button>)
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
	}

	//操作栏功能
	_action(mess){
		this.setState({
			id: mess.id,
			imguri: mess.attachment,
			imgList: mess.faces
		})
	}
	
	//分页器activity/list?page=num
	_getEvent(pageNumber = 1){
		let afteruri = 'ent_records/v2_search?page=' + pageNumber;
		let body = this.body
		body["per_page"] = 3
		appData._dataPost(afteruri,body,(res) => {
			let data = res.data;
			this.setState({
				imguri: data[0].attachment,
				imgList: data[0].faces,
				total:res.total,
				dataSource: data,
				pageNum:pageNumber
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
								<img src={appServer.imguri + val} key={index} alt='无该家庭照片' style={{height: '350px', width: '500px', display: 'inline-block', border: '1px solid #eee'}}/>
							)
						})
					}
				</Carousel>
			return htmls;
		} else return null
	}

  next(){
		this.sliderWay.slick.innerSlider.slickNext()
  }
  previous() {
		this.sliderWay.slick.innerSlider.slickPrev()
	}

	render() {
		let columns = this.columns;
		return (
			<div>
				<Row className="card-unusual-title">
					<Col span={12}><h2>陌生人检测/异常详情</h2></Col>
					<Col span={12}>
						<Link to={{
							pathname:'/contant/ResidentManage/IntradayWarning/Stranger',
							state: this.mess
						}}>
							<Button>返回</Button>
						</Link>
					</Col>
				</Row>
				{/* 1920*1080 -- 16:9 */}
				<Row type="flex" align="center">
					<Col lg={12} md={24} className="card-user-image" >
						<img src={ appServer.imguri + this.state.imguri} alt="该记录无截图"/>
							<h4>
								{this.state.id}号记录照片
							</h4>
					</Col>
					{/* 320*240 -- 4:3*/}
					<Col lg={12} md={24} className="card-home-image">
						<div className="card-image-box">
							{this._imgList()}
						</div>
						<div className="carousel-ctrl">
							<h4>家庭人员照片</h4>
							<span>
								<Button onClick={this.previous}>上一张</Button>
								<Button onClick={this.next}>下一张</Button>
							</span>
						</div>
					</Col>
					<Col span={24} style={{marginTop: 32}}>
						<Col span={24} style={{textAlign:'right', marginBottom: "32px"}}>
						</Col>
						<Table dataSource={this.state.dataSource} columns={columns}  rowKey='id' pagination={false} style={{marginBottom: 20}}/> 
						<Row type="flex" justify="end" className="printHidden">
							<Pagination showQuickJumper pageSize={3} defaultCurrent={1} current={this.state.pageNum} total={this.state.total} onChange={this._getEvent.bind(this)} />
						</Row>
					</Col>
				</Row>
			</div>
		);
	}
}