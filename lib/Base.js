'use explicit'
'use strict'

const __util 								= require("util");

module.exports = class Base {

	_perf_get_milliseconds () {
		return ( new Date().getTime());
	}

	_perf_report_timeTaken ( startTime){
		return ( this._perf_get_milliseconds() - startTime);
	}

	logPerf( func, title, startTime ){
		this._log('PERF',func, title, ` time taken ${this._perf_report_timeTaken(startTime)} milliseconds`);
	}

	logTraceStart( func){
		this._log('TRC',func, '', 'BEGIN');
	}
	logTraceEnd( func ){
		this._log('TRC',func, '', 'END');
	}

	logError( func, title, msg ){
		this._log('ERR',func, title, msg);
	}
	logWarning( func, title, msg ){
		this._log('WRN',func, title, msg);
	}
	logInfo( func, title, msg ){
		this._log('INF',func, title, msg);
	}

	logDebug( func, title, msg ){
		this._log('DBG',func, title, msg);
	}

	_log ( level, func, title, msg){
		__util.log(`[${level}][${func}]::${title} - ${msg}`);
	}

}

