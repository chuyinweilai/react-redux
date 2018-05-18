import React,{Component} from 'react';
export default class cancel extends Component{
	constructor(props){
		super(props);
		this.Router="";
		this.mess="";
	}

	componentWillMount(){
		this.Router = this.props.Router;
		this.mess = this.props.message;
		this._cancel()
	}

	_cancel(){
		window.location.reload();
	}

	_jump(nextPage,mess){
		this.Router(nextPage,mess,this.mess.nextPage)
	}

	render(){
		return (
		<div style={{flex: 1, background: '#fff',padding: 24,margin: 0,minHeight: 80}}>
		</div>)
	}
}