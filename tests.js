let fs = require('./fs2.js')

function runTests(){
	fs.init()

	for(let test in testCases) {
		out('----------------------------------------\n')
		Object.entries(testCases[test]).forEach(function([input, expected]) {
			let result = fs[test](input)
			out(test + '(\'' + input + '\'):')
			if(result === expected){
				//out.green('\t\t\tpass')
				out.green('pass')
			} else {
				out.red('fail - expected: ' + expected)
				out.red('instead got: ' +  result)
			}
		})
		out('\n')
	}
}


/// this is unordered...
let testCases = {
	createFile: {
		"": true
	},
	ls: {
		'': 		'.\t..',
		'.':		'.\t..',
		'..':		'.\t..',
		'.././.././../.././.': '.\t..',
	},

}

// important stuff
function out(msg) {
	process.stdout.write(msg)
}
out.green = function(msg) {
		console.log("\x1b[32m%s\x1b[0m", msg)
}
out.red= function(msg) {
		console.log("\x1b[31m%s\x1b[0m", msg)
}


runTests()
// Colors!
//Reset = "\x1b[0m"
//Bright = "\x1b[1m"
//Dim = "\x1b[2m"
//Underscore = "\x1b[4m"
//Blink = "\x1b[5m"
//Reverse = "\x1b[7m"
//Hidden = "\x1b[8m"
//
//FgBlack = "\x1b[30m"
//FgRed = "\x1b[31m"
//FgGreen = "\x1b[32m"
//FgYellow = "\x1b[33m"
//FgBlue = "\x1b[34m"
//FgMagenta = "\x1b[35m"
//FgCyan = "\x1b[36m"
//FgWhite = "\x1b[37m"
//
//BgBlack = "\x1b[40m"
//BgRed = "\x1b[41m"
//BgGreen = "\x1b[42m"
//BgYellow = "\x1b[43m"
//BgBlue = "\x1b[44m"
//BgMagenta = "\x1b[45m"
//BgCyan = "\x1b[46m"
//BgWhite = "\x1b[47m"
