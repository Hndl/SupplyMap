'use explicit'
'use strict'
const 	Base				= require('./Base');
var 	html 				= require('./Html');

module.exports = class Grid extends Base{

	constructor( x, y ){
		super();
		this._x = x;
		this._y = y;
	}
	_isParam_X_and_Y ( x , y)				{return ( typeof(x) === 'number' && typeof(y) === 'number'); }
	_isParam_Point_Obj (xy )				{return ( typeof(xy) === 'object' && typeof(xy.x) === 'number' && typeof(xy.y) === 'number'); }
	getX ()									{return ( this._x) }
	getY () 								{return ( this._y) }
	point(x,y)								{return ( {'x':x,'y':y}); }
	_nfromM(n,m)							{return ( n>m? n-m : m-n); }
	
	distanceBetween2Points( xy, xy1){
		if ( !this._isParam_Point_Obj (xy) || !this._isParam_Point_Obj(xy1)){
			return (-1);
		}
		//let x2 = this._nfromM(xy1.x, xy.x);
		//let y2 = this._nfromM(xy1.y, xy.y);
		//let distance = x2 + y2;
		return( (this._nfromM(xy1.x, xy.x)) + (this._nfromM(xy1.y, xy.y)) );
	}

	toHTML( ){
		let html=html.tableOpen;
		for (let y = 0 ; y<this._y; y++){
			html+=html.tableColOpen;
			for (let x = 0 ; x<this._x; x++){
				html+=html.tableRowOpen;
				html+= `${html.paraOpen}${JSON.stringify(this.point(x,y))}${paraClose}${html.br}`; 
				html+=html.tableRowClose;
			}
			html+=html.tableColClose;
		}
		return ( `${html}${html.tableClose}`);
	}
}