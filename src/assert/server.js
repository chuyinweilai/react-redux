const ip = window.rootIp;
let appServer = {
	baseuri:"http://"+ ip +"/pc/",
	peruri : "http://"+ ip +"/api/",
	imguri : "http://"+ ip,
	websocket_uri : "ws://"+ ip +":30100",
	// baseuri:"http://"+ ip+"/pc/",
	// peruri : "http://cloudapi.famesmart.com/api/",
	// peruri_local : "http://"+ ip+"/api/",
	// imguri : "http://"+ ip+"/storage/",
	// websocket_uri : "ws://"+ ip+":30100",
}

module.exports = appServer;