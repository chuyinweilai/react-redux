
const appServer = require('./server')

// const peruri = server.peruri_local;
const peruri =  appServer.peruri;
let appData_local  = {
	_dataGet(afteruri, callback,Token){
		fetch(peruri+afteruri,{
			method: 'GET',
			headers: {
				'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control':'no-cache', "Authorization": "Bearer "+Token,
			},
		})
		.then(res => {
			if(res.status === 200){
				return res.json();
			} else if(res.status === 401){
				alert("会话已过期，请刷新界面")
				_reload()
			}
		}) //判断res.state == 200 并进行json转换 
		.then(data => {
			callback(data)
		})
		.catch( error => {
			console.log('get报错 :' + error)
		})
	},
	_dataPost(afteruri,data,callback,Token){
		fetch(peruri+afteruri,{
				method: 'post',
				headers: {
					'Accept': 'application/json', 'Content-Type': 'application/json', 'Cache-Control':'no-cache', "Authorization": "Bearer "+Token
				},
				body: JSON.stringify(data)
		})
		.then(res =>{ 
			if(res.status === 200) {
				return res.json()
			} else if(res.status === 401){
				console.log("会话已过期，请刷新界面");
				_reload()
			}
		}) //判断res.state == 200 并进行json转换 
		.then(data => {
				callback(data)
		})
		.catch( error => {
			console.log('post报错 :' + error)
		})
	},
	_Storage(type,id,data){
		if(type === 'set'){
			localStorage.setItem(id,JSON.stringify(data))
		}
		else if(type === 'get'){
			let mess = localStorage.getItem(id)
				let json = JSON.parse(mess)
				data(json)
		}
		if(type === 'del'){
			localStorage.removeItem(id)
		}
	},
	_Session(type,id,data){
		if(type === 'set'){
			sessionStorage.setItem(id,JSON.stringify(data))
		}
		else if(type === 'get'){
			let mess = sessionStorage.getItem(id)
				let json = JSON.parse(mess)
				data(json)
		}
		if(type === 'del'){
			sessionStorage.removeItem(id)
		}
		
	}
}

function _reload(){
	window.location.href = window.location.origin+"/";
}

module.exports = appData_local;