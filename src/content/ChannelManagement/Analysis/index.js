import React,{ Component } from 'react';
import {
  Row,
  Col
} from 'antd';
// 引入 ECharts 主模块
import AnalysisProportion from './AnalysisProportion';
import AnalysisTips from './AnalysisTips';
import AnalysisHistory from './AnalysisHistory';

import AnalysisDoor from './AnalysisDoor';
import AnalysisRoad from './AnalysisRoad';
import AnalysisThrough from './AnalysisThrough';

export default class Analysis extends Component{
  render() {
      return (
        <Row gutter={24}>
          {/* 预警事件比例 */}
          <Col lg={8} md={12} xs={24}><AnalysisProportion /></Col>
          {/* 预警小贴士 */}
          <Col lg={16} md={12} xs={24}><AnalysisTips /></Col>
          {/* 历史预警数量 */}
          <Col span={24} style={{margin: '0.3rem 0 '}}><AnalysisHistory /></Col>
          {/* 热点位置(门未关) */}
          <Col lg={8} xs={24}><AnalysisDoor /></Col>
          {/* 热点位置(主干道占用) */}
          <Col lg={8} xs={24}><AnalysisRoad /></Col>
          {/* 热点位置(高空抛物) */}
          <Col lg={8} xs={24}><AnalysisThrough /></Col>
        </Row>
      );
  }
}