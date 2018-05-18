import React,{ Component } from 'react';
import {
  Row
} from 'antd';
import {  appData } from './../../../assert/index';
import './index.css';


class AnalysisTips extends Component{
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
      "alert_type":"通道",
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
      <Row className="Black-Box">
        <h2 className="Part-Title" > <i className="fa fa-coffee" ></i>预警小贴士</h2>
        <ul className="WarningTips-List">
          { this.state.dataSource.map((val, index) => <li key={index} className="WarningTips-Contant">{val}</li> )}
        </ul>
      </Row>
    );
  }
}

export default AnalysisTips;