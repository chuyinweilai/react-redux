import React,{ Component } from 'react';
import {
  Row,
  Col
} from 'antd';
// 引入 ECharts 主模块
import WarningProportion from './WarningProportion';
import WarningTips from './WarningTips';
import HistoryWarningNumber from './HistoryWarningNumber';

import HotDoor from './HotDoor';
import HotMan from './HotMan';
import HotCards from './HotCards';

class DecisionsRecommend extends Component{
  render() {
    return (
      <Row gutter={24}>
        {/* 预警事件比例 */}
        <Col lg={8} md={12} xs={24}><WarningProportion /></Col>
        {/* 预警小贴士 */}
        <Col lg={16} md={12} xs={24}><WarningTips /></Col>
        {/* 历史预警数量 */}
        <Col span={24} style={{margin: '0.3rem 0 '}}><HistoryWarningNumber /></Col>
        {/* 热点门禁 */}
        <Col lg={8} xs={24}><HotDoor /></Col>
        {/* 热点住户 */}
        <Col lg={8} xs={24}><HotMan /></Col>
        {/* 热点卡号 */}
        <Col lg={8} xs={24}><HotCards /></Col>
      </Row>
    );
  }
}

export default DecisionsRecommend;