import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import './common.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import todoApp from './reducer';
/* antd 国际化操作 */
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
let store = createStore(todoApp)
ReactDOM.render(
	<LocaleProvider locale={zh_CN}>
		<Provider store={store}>
			<App />
		</Provider> 
	</LocaleProvider>
, document.getElementById('root'));
