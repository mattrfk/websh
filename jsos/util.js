;"use strict";

function isString(o) {
		return (Object.prototype.toString.call(o) === 
			'[object String]')
}


function E(message) {
	this.message = message
	this.stack = (new Error()).stack
}

E.prototype = new Error;
