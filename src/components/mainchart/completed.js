import React, { PropTypes, Component } from 'react'
import styles from './completed.less'
import classnames from 'classnames'
import { AreaChart ,Area, XAxis,YAxis, CartesianGrid,Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {appData, appServer, Colors} from './../../assert';

export default class completed extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:[]
        }
        this.reload = 0;
    }
    componentWillMount(){
        this._getEvent();
    }
    
    componentWillReceiveProps(nextProps){
        this.reload = nextProps.reload;
    //do something
    }
    

    //刷新
    _reload(){
        if(this.reload){
            this.reload = this.reload-1;
            this._getEvent()
        }
    }

    _getEvent(){
		let afteruri = 'comm_alerts/statistics'
        let body={
            "duration":"all",
            "unit":"month"
        }
        appData._dataPost(afteruri,body,(res) =>{
            let arr = []
            res.statistics.forEach((val)=>{
                let obj = {
                    name:val["date(`created_at`)"],
                    count: val.count
                }
                arr.push(obj)
            })
            this.setState({
                data: arr
            })
        })
    }

    render(){
        return (
            <div className={styles.sales}>
                <h2>近期的报警事件总数</h2>
                <ResponsiveContainer minHeight={360}>
                    <AreaChart data={this.state.data}>
                        <XAxis dataKey="name" axisLine={{ stroke: color.borderBase, strokeWidth: 1 }} tickLine={false} />
                        <YAxis />
                        <CartesianGrid vertical={false} stroke={color.borderBase} strokeDasharray="3 3" />
                        <Tooltip/>
                        <Area name="报警数" type="monotone" dataKey="count" stroke={color.sky} fill={color.sky} strokeWidth={2} dot={{ fill: '#fff' }} activeDot={{ r: 5, fill: '#fff', stroke: Colors.blue }} />
                    </AreaChart>
                </ResponsiveContainer>				
                {this._reload()}
            </div>
            
        )
    }
}
