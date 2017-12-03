'use explicit'
'use strict'

const __util 								= require("util");
const __fs 									= require("fs");
const __readline							= require("readline");
const __path								= require("path");
const __express								= require("express");
const __bodyParser 							= require("body-parser");

const SupplyGrid							= require("./lib/SupplyGrid");


const HTTP_OK				= 200;
const HTTP_ERR 				= 404;
const HTTP_DEF_PORT			= 8080;
const HTTP_DEF_MSG			= 'meh!';
const HTTP_DEF_ERROR_MSG	= 'today is not your day...Tomorrow doesnt look good either!';
const HTTP_DIR 				= 'public';
const CURRENT_DIR			= '.';


var webApp = __express();

function auth( req, res, next){ next(); }  //allow access to site for the good the bad and the ...

function milliseconds (){
	return ( new Date().getTime());
}

function getRandomArbitraryColor() {
  return (Math.floor(Math.random() * (255 - 1) + 1));
}

function renderSupplyGrid( req, res, x, y , supplyLocations) {
	console.log(`x:${x}-${typeof(x)} : y:${y}-${typeof(y)} ${supplyLocations}-${typeof(supplyLocations)}`);
	let supplyMap = new SupplyGrid(x,y);	
	for (let i = 0 ; i < supplyLocations.length ; i++){
		let x = ian(supplyLocations[i].split(':')[0]);
		let y = ian(supplyLocations[i].split(':')[1]);
		supplyMap.addSupplyDrop(x,y,getRandomArbitraryColor(),255,getRandomArbitraryColor());
	}
	res.status(HTTP_OK).send(supplyMap.toHTML());
}

function renderSupplyArray( req, res, x, y , supplyLocations) {
	console.log(`x:${x}-${typeof(x)} : y:${y}-${typeof(y)} ${supplyLocations}-${typeof(supplyLocations)}`);
	let supplyMap = new SupplyGrid(x,y);	
	for (let i = 0 ; i < supplyLocations.length ; i++){
		let x = ian(supplyLocations[i].split(':')[0]);
		let y = ian(supplyLocations[i].split(':')[1]);
		supplyMap.addSupplyDrop(x,y,getRandomArbitraryColor(),255,getRandomArbitraryColor());
	}
	res.status(HTTP_OK).send(supplyMap.toString());
}
//is a number
function ian(n){
	try{
		return (parseInt(n,10));
	} catch ( err ){
		return (-1);
	}
}
function iaa(a,c){
	try{
		return ( a.split(c));
	}catch ( err){
		return ([]);
	}
}
function hndlRequest( req, res ){
	const func = 'hndlRequest';
	let stTime = milliseconds();
	
	__util.log(`[INFO][${stTime}] /map-api/:targetCmd route:${req.method} request for '${req.url}'`);
	
	try{
		switch (req.params.targetCmd.trim().toLowerCase()){	
			case 'tohtml':
				renderSupplyGrid ( req, res, ian(req.query.x), ian(req.query.y), iaa(req.query.supplies,',') );
				break;
			case 'tostring':
				renderSupplyArray ( req, res, ian(req.query.x), ian(req.query.y), iaa(req.query.supplies,',') );
				break;
			default:
				res.status(HTTP_ERR).send(HTTP_DEF_MSG);
				break;
		}
	} catch (err){
		__util.log(`[EXCEPTION]-[${func}]::${err}`);
		res.status(HTTP_ERR).send(HTTP_DEF_ERROR_MSG);
	}
	let enTime = milliseconds();
	__util.log(`[INFO][${enTime}] /map-api/:targetCmd route:${req.method} request for '${req.url}' - response sent. perf[${enTime-stTime} ms]`);

}

webApp.use(auth,__bodyParser.json());

webApp.use(auth,__bodyParser.urlencoded({ extended: false }));

//webApp.use(auth,__express.static(__path.join(CURRENT_DIR,HTTP_DIR)));

webApp.post("/map-api/:targetCmd",auth, function (req, res){
	__util.log(`[DEBUG] /map-api/:targetCmd route:${req.method} request for '${req.url}'`);
	hndlRequest(req,res);	
});

webApp.get("/map-api/:targetCmd",auth,function (req, res){
	__util.log(`[DEBUG] /map-api/:targetCmd route:${req.method} request for '${req.url}'`);
	hndlRequest(req,res);	
});

webApp.listen(HTTP_DEF_PORT);
__util.log(`[INFO] Webapp@8080`);