
import React,{Component} from 'react';
import { 
	Row,
	Col,
	Input,
	Select,
	Button,
	message
} from 'antd'
import { appData } from './../../../assert';
import './index.scss';

const Search = Input.Search;
const Option = Select.Option;

export default class CardChange extends Component{
	constructor(props){
		super(props);
		this.state={
			dataSource:[],
			chooseText: '全选',
			defaultValue: '居民'
		}
		this.choose = [];
		this.chooseAll = false;
		this.printed_id = 0;
	}
	
	_getEvent(number = 0){
		let url = "cardAuth/v2_showAuth";
		let body ={
			printed_id: number
		};
		if(number.length === 7){
			appData._dataPost(url, body, (res)=>{
				if(!res.result){
					this.printed_id = number;
					this.setState({
						dataSource: res.auths,
						defaultValue: res.owner_group
					})
				} else {
					message.error(res.info)
				}
			})
		} else {
			this.printed_id = 0;
			this.choose = [];
			this.setState({
				dataSource:　[],
				defaultValue: "居民"
			})
		}
	}

	// 权限列表
	_listview(val, index){
		if(val.crud){
			this.choose.push({
				"id": val.id,
				"loc_description": val.loc_description,
				"loc_type": val.loc_type
			});
			return <li className="list-block list-block-select" key={index} onClick={this._click.bind(this, val, index)}><span>{val.loc_description}</span></li>
		} else {
			return <li className="list-block" key={index} onClick={this._click.bind(this, val, index)}><span>{val.loc_description}</span></li>
		}
	}

	// 点选楼号
	_click( val, index){
		let listBlock = document.getElementsByClassName("list-block")[index];
		let classname = listBlock.className;
		if(classname.indexOf("list-block-select") + 1){
			listBlock.className =	"list-block";
			this.choose.forEach((select, index) =>{
				if(select.id === val.id){
					this.choose.splice(index, 1);
				}
			})
		} else {
			listBlock.className += " list-block-select";
			this.choose.push({
				"id": val.id,
				"loc_description": val.loc_description,
				"loc_type": val.loc_type
			});
		}
	}

	// 全选
	_clickAll(){
		let listBlock = document.getElementsByClassName("list-block");
		if(this.chooseAll){
			for(let i = 0; i < listBlock.length; i++){
				listBlock[i].className = " list-block";
			}
			this.choose = [];
			this.setState({chooseText: '全选'})
		} else {
			for(let i = 0; i < listBlock.length; i++){
				listBlock[i].className += " list-block-select";
			}
			this.choose = this.state.dataSource;
			this.setState({chooseText: '取消全选'})
		}
		this.chooseAll = !this.chooseAll;
	}

	// 变更权限组
	_setGroup(e){
		let url = "residents/v2_groupchange";
		let body = {
			"printed_id": this.printed_id,
			"owner_group": e
		}
		appData._dataPost(url, body, (res) => {
			if(!res.result){
				message.success('操作成功');
				this._getEvent(this.printed_id);
			} else {
				message.error(res.info);
			}
		})
	}

	// 提交
	_upData(){
		let carRoom = [];
		let liveRoom = [];
		if(this.choose.length){
			this.choose.forEach((val)=>{
				if(val.loc_type === 3){
					carRoom.push(val)
				} else {
					liveRoom.push(val)
				}
			})
			if(carRoom.length){
				this.props.history.push("/contant/Card/CardChange/setdate", {
					carRoom,
					liveRoom,
					printed_id: this.printed_id
				})
			} else {
				let url = 'cardAuth/v2_setAuth';
				let body = {
					"printed_id": this.printed_id,
					"auths": this.choose,
				}
				appData._dataPost(url, body, (res)=>{
					if(!res.result){
						message.success('提交成功');
					} else {
						message.warning(res.info);
					}
				})
			}
		} else {
			message.warning('请选择权限');
		}
	}

	render(){
		const { dataSource } = this.state;
		return (
			<div>
				<h2 className="card-change-title">卡片变更</h2>
				<Row className="card-change-top" type="flex">
					<Col lg={12} md={12} xs={24} className="card-change-search-box">
					<span	className="card-change-search-title">卡号：</span>
					<Search
						className="card-change-search"
						placeholder="输入卡号"
						onChange={e => this._getEvent(e.target.value)}
					/>
					</Col>
					<Col lg={12} md={12} xs={24}  className="card-change-search-box">
						<span	className="card-change-search-title">修改所属组：</span>
						<Select value={this.state.defaultValue} className="card-change-group" onChange={this._setGroup.bind(this)}>
							<Option value="居民" className="card-change-option">居民</Option>
							<Option value="物业" className="card-change-option">物业</Option>
						</Select>
					</Col>
				</Row>

				<Row className="card-change-content">
					<div className="card-change-list">
						<ul>
							{dataSource.map(this._listview.bind(this))}
						</ul>
					</div>
					<Col className="bottom">
						<Button type="primary" onClick={this._clickAll.bind(this)}>{this.state.chooseText}</Button>
						<Button type="primary" onClick={this._upData.bind(this)}>提交</Button>
					</Col>
				</Row>
			</div>
		)
	}
}