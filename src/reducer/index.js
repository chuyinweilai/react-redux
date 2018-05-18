
import { 
	REDUX_STATUS, 
	RELOAD_STATUS,
	SELECT_PAGE,
	NOTI_SWITCH,
	NOTI_ROUTER,
	SET_POINTER
} from './action';

const initialState = [{
	"ws_json":"", 
	"reload": 0,
	"select_page": {
		"name": 'T0',
		"path": '/contant/home',
	},
	"noti_switch": true,
	"noti_router": '',
	"pointer":{x: 0, y: 0}
}]

export default function todoApp (state = initialState, action) {
	switch(action.type){
		//在state后插入新的comm_key
		case REDUX_STATUS:
			return [...state, Object.assign(...state, {"ws_json":action.text})]
		case RELOAD_STATUS:
			return [...state, Object.assign(...state, {"reload": Number(action.text) + 1})]
		case SELECT_PAGE:
			return [...state, Object.assign(...state, {"select_page": { "name": action.name, "path": action.path,} })]
		case NOTI_SWITCH:
			return [...state, Object.assign(...state, {"noti_switch": action.bool})]
		case NOTI_ROUTER: 
			return [...state, Object.assign(...state, {"noti_router": action.text})]
		case SET_POINTER:
			return [...state, Object.assign(...state,{"pointer": {"x": action.x ,"y": action.y}})]
		default: return state
	}
}