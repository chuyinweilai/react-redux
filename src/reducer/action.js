export const REDUX_STATUS = 'REDUX_STATUS';
export const RELOAD_STATUS = 'RELOAD_STATUS';
export const SELECT_PAGE = 'SELECT_PAGE';
export const NOTI_SWITCH = 'NOTI_SWITCH';
export const NOTI_ROUTER = 'NOTI_ROUTER';
export const SET_POINTER = 'SET_POINTER';
//更改状态后，返回新的对象，以供插入数组
export const redux_status = text =>{
	return {
		type: REDUX_STATUS,
		text
	}
}

export const reload_status = text =>{
	return {
		type: RELOAD_STATUS,
		text
	}
}

export const select_page = (name, path) =>{
	return {
		type: SELECT_PAGE,
		name,
		path
	}
}

// 弹窗控制
export const noti_switch = (bool) =>{
	return {
		type: NOTI_SWITCH,
		bool,
	}
}

// 弹窗控制
export const noti_router = (text) =>{
	return {
		type: NOTI_ROUTER,
		text,
	}
}

// 弹窗控制
export const set_pointer = (x, y) =>{
	return {
		type: SET_POINTER,
		x,
		y
	}
}
// Notification
/*
 * 其它的常量
 */

export const VisibilityFilters = {
	WS_JSON: 'WS_JSON',
	RELOAD: 'RELOAD',
	AJAX:'AJAX'
}