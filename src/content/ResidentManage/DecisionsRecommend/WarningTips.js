import React,{ Component } from 'react';

import {  appData } from './../../../assert/index';
import './index.css';


class WarningTips extends Component{
  constructor(props){
    super(props);
    this.state={
      dataSource: [],
    }
  }

  componentDidMount() {
    this._getEvent()
  }

  _getEvent(){
    let url = 'decision/v2_tips';
    let body = {
      "alert_type":"居民",
    }
    appData._dataPost(url, body, (res) => {
      if(!res.result){
        this.setState({
          dataSource: res.data,
        })
      }
    })
  }

  render() {
    return (
      <div className="Black-Box">
        <h2 className="Part-Title" > <i className="fa fa-coffee" ></i>预警小贴士</h2>
        <ul className="WarningTips-List">
          { this.state.dataSource.map((val, index) => <li key={index} className="WarningTips-Contant">{val}</li> )}
        </ul>
      </div>
    );
  }
}

export default WarningTips;