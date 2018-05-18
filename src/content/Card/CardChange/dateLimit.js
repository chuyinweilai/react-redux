
import React,{Component} from 'react';
import { 
	Button,
	message
} from 'antd'
import { appData } from './../../../assert';
import './index.scss';

export default class CardChange extends Component{
	constructor(props){
		super(props);
		this.state={
			carRoom: [],
			liveRoom: [],
			printed_id: 0,
		}
	}

	componentWillMount(){
		let carRoom = this.props.location.state.carRoom || [];
		let liveRoom = this.props.location.state.liveRoom || [];
		let printed_id = this.props.location.state.printed_id || 0;
		this.setState({
			carRoom,
			liveRoom,
			printed_id
		})
	}

	_select(type,e){
		let dataset = e.target.dataset;
		let value = e.target.value;
		let carRoom = this.state.carRoom;
		if(type === "start"){
			if(carRoom[dataset.key].vld_end){
				let result = (new Date(value.replace(/-/g,"/"))) <= (new Date(carRoom[dataset.key].vld_end.replace(/-/g,"/")));
				if(result){
					carRoom[dataset.key].vld_start = value
				} else {
					e.target.value = (carRoom[dataset.key].vld_end)
					carRoom[dataset.key].vld_start = carRoom[dataset.key].vld_end
				}
			} else {
				carRoom[dataset.key].vld_start = value
			}
		} else {
			if(carRoom[dataset.key].vld_start){
				let result = (new Date(carRoom[dataset.key].vld_start.replace(/-/g,"/"))) <= (new Date(value.replace(/-/g,"/")));
				if(result){
					carRoom[dataset.key].vld_end = value;
				} else {
					e.target.value = (carRoom[dataset.key].vld_start);
					carRoom[dataset.key].vld_end = carRoom[dataset.key].vld_start;
				}
			} else {
				carRoom[dataset.key].vld_end = value
			}
		}
	}
	
	_listView(val, index){
		const { carRoom } = this.state;
		const vld_start = carRoom[index].vld_start;
		return (
			<tr key={index}>
				<td>{val.loc_description}</td>
				<td>
					<input type="date" data-key={index} onChange={this._select.bind(this,"start")}/>
					至
					<input type="date"  data-key={index} onChange={this._select.bind(this,"end")}  min={vld_start?vld_start: null}/>
				</td>
			</tr>
		)
	}

	_updata(){
		const { carRoom, liveRoom, printed_id } = this.state;
		let arr = carRoom.concat(liveRoom) || [];
		let url = 'cardAuth/v2_setAuth';
		let body = {
			"printed_id": printed_id,
			"auths": arr,
		}
		appData._dataPost(url, body, (res)=>{
			if(!res.result){
				message.success('提交成功');
				this.props.history.goBack();
			} else {
				message.warning('提交失败，请稍后重试');
			}
		})
	}

	render(){
		const { carRoom } = this.state;
		return (
			<div>
				<h2 className="card-change-title">车库权限有效期设置</h2>
				<table className="card-change-Table">
  				<thead className="Table-header">
						<tr>
							<th>车库列表</th>
							<th>有效期</th>
						</tr>
					</thead>

					<tbody className="Table-body">
						{
							carRoom.map(this._listView.bind(this))
						}
					</tbody>

					<tfoot className="Table-foot">
						<tr>
							<td><Button onClick={()=>{this.props.history.goBack()}}>取消</Button></td>
							<td><Button onClick={()=>{this._updata()}}>确认</Button></td>
						</tr>
					</tfoot>
				</table>
			</div>
		)
	}
}