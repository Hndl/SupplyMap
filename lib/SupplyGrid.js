'use explicit'
'use strict'

const 	Grid				= require("./grid");
var 	html 				= require('./Html');


module.exports = class SupplyGrid  extends Grid{

	constructor ( x, y ){
		super(x,y);
		this.supplyies = {"SupplyLocations":[]};
	}

	/**
	 * addSupplyDrop (xy, y)
	 * param: xy/y  the co-ords of the supply drop.
	 * param: r|g|b color stores the color of the supply drop. (bit of hack!)
	 *
	 */
	addSupplyDrop ( xy , y , rcolor, gcolor, bcolor){ /* Hndl - poor version of overloading the function.  either we have a point/coord obj containing x & y or a simple x and y numbers.*/
		let func = `addSupplyDrop ( ${xy} , ${y} , ${rcolor}, ${gcolor}, ${bcolor})`;
		//super.logTraceStart(func);
		let bRet = false;
		if ( this._isParam_X_and_Y (xy,y) ){
			bRet = this.addSupplyDrop ( super.point(xy,y), null,rcolor,gcolor,bcolor);	
		} else if ( this._isParam_Point_Obj (xy) )  {
			xy.red=rcolor; //hack add color
			xy.green=gcolor;
			xy.blue=bcolor;
			this.supplyies.SupplyLocations.push ( xy );
			bRet = true		
		} else {
			super.logWarning( func, 'illegal params', 'not object and not numbers' );
		}
		
		//super.logTraceEnd(func);
		return (bRet);
	}

	/**
	 * isSupplyLocation (xy, y)
	 * param: xy location is checked against the supply drops, if a match is found the cell is a SupplyLocation.
	 *
	 */
	isSupplyLocation( xy, y){ /* Hndl - poor version of overloading the function. */
		let oRet = null;
		if ( this._isParam_X_and_Y (xy,y) ){
			oRet = isSupplyLocation ( super.point( xy, y));
		} else if ( this._isParam_Point_Obj (xy) ){
			// PERF - access the supply locations at random. even dist: status: not implemented.
			for ( let i = 0 ; i < this.supplyies.SupplyLocations.length ; i++){ //use for instead of forEach because we want to break if found. 
				if ( xy.x === this.supplyies.SupplyLocations[i].x && xy.y === this.supplyies.SupplyLocations[i].y ){
					oRet = this.supplyies.SupplyLocations[i];
					break; // found a match. No need to keep searching.
				}
			}
		}
		return (oRet);
	}

	/**
	 * nearestSupplyDrop
	 * param xy - take the current grid location, and check which is the nearest supply drop.
 	 *
		 * Performance notes: 
		 *	test data: 30 x 30 grid, with 8 supply drops. 
		 *
		 *	v1. - initial exec 10mill, then avg 3mill.
		 *  v1.1- PERF_OPT_001 - if distance is 0 or 1. Dont check for other supplydrops.initial exec 9mill, then avg 2mill.
	 *
	 */
	nearestSupplyDrop ( xy, y ) { /* Hndl - poor version of overloading the function. */
		let oRetNearest = {'distance':-1,'supplyLocation':-1};
		if ( this._isParam_X_and_Y (xy,y) ){
			oRetNearest = nearestSupplyDrop ( super.point( xy, y));
		} else if ( this._isParam_Point_Obj (xy) ){
			for ( let i = 0 ; i < this.supplyies.SupplyLocations.length ; i++){
				//check the location from current to each supply location
				let d = this.distanceBetween2Points(xy, this.supplyies.SupplyLocations[i]);
				//if the distance calc for this cell, is less that the current shortest, then set this as being the nearest
				if ( ( oRetNearest.distance === -1 || d < oRetNearest.distance ) ) {
					oRetNearest.distance = d;
					oRetNearest.supplyLocation = this.supplyies.SupplyLocations[i];
					//PERF_OPT_001 : we cant get a closer distance, dont bother looking at other locations.
					if ( d === 0 || d === 1){
						break; 
					}
				}
				
			}
		}
		return (oRetNearest);
	}
	


	/* ----------------------------------------------
	 *
	 *
	 * functions for render are below this line .
	 *
	 *
	 * ----------------------------------------------
	 */

	toHTMLDropPoints(){
		let s="supplyLocations";
		this.supplyies.SupplyLocations.forEach ( function ( l ){
			s+=`[${l.x}:${l.y}]`;
		})
		return (s);
	}

	_fade( c, offset ) { // TODO not working!!
		return ( ( c + offset > 255 ? ( c - offset ) : c + offset ));
	}

	toString() {
		let func = `toString()`;
		let stTime = super._perf_get_milliseconds();
		let s = ''; //no proud, but a string it will be to start with.
		for (let y = 0 ; y<this._y; y++){
			s+='[';
			for (let x = 0 ; x<this._x; x++){
				let c = super.point(x, y);
				let n = this.nearestSupplyDrop(c);
				//DEF:20171203-0938
				s+=`${n.distance>=0?n.distance:null}${x===(this._x-1)?']':','}`;
			}
			(y===(this._y-1)?null:s+=',');
		}
		super.logPerf( func, 'perf', stTime );
		return (s);
	}
	toHTML ( ){
		
		let func = `toHTML()`;
		let stTime = super._perf_get_milliseconds();
		let htmltable=html.tableOpen;
		for (let y = 0 ; y<this._y; y++){
			htmltable+=html.tableRowOpen;
			for (let x = 0 ; x<this._x; x++){
				let cell = super.point(x, y);
				let nsd = this.nearestSupplyDrop(cell);
				let supplyCell = this.isSupplyLocation( cell) ;
				
				if ( typeof (supplyCell) === 'object' && supplyCell != null) {
					//we have a supplycell. I want to color the supply cell and then render the serving cells with a gradient of this color for visual.  Having trouble
					//fading the colors on the table.  Will come back to this later!
					htmltable+=`<td style="background-color:rgb(${supplyCell.red},${supplyCell.green},${supplyCell.blue});color:black;">Supplies`;
				} else {
					htmltable+=`<td style="background-color:rgb(${this._fade(nsd.supplyLocation.red,nsd.distance)},${this._fade(nsd.supplyLocation.green,nsd.distance)},${this._fade(nsd.supplyLocation.blue,nsd.distance)});color:black;">`;
				}
				htmltable+= `${html.paraOpen}${JSON.stringify( cell )}${html.paraClose}`; 
				htmltable+= `${html.paraOpen}Nearest supplies ${nsd.distance} away @ ${nsd.supplyLocation.x}:${nsd.supplyLocation.y} ${html.paraClose}`;
				
				htmltable+=html.tableColClose;
			}
			htmltable+=html.tableRowClose;
		}
		super.logPerf( func, 'perf', stTime );
		return ( `${htmltable}${html.tableClose}`);
	}
}
