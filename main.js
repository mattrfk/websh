"use strict"
let main = {}

if(typeof module !== 'undefined' && module.exports) {
	console.log("node!")
}
else {
	console.log("browser!")
	window.onload = function() {
		term = BrowserTerm()
		term.init()
		main.stdin = function()
	}
}
