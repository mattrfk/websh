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


// this is the test-engine
function test(cmd, input, expected) {
	let result = fs[cmd](input)	
	this.total ? this.total = 0 : this.total++
	out(cmd+ '(\'' + input + '\'):')
	if(result === expected){
		out.green('pass')
	} else {
		this.failed ? this.failed = 0 : this.failed++
		out.red('fail')
		console.log('\texpected: ' + expected)
		console.log('\treceived: ' + result)
	}
}
test.total = 0;
test.failed = 0;

let fs = require('./fs.js')
fs.init()

test('ls', '', '.\t..')
test('ls', '', '.\t..')
test('ls', '.', '.\t..')
test('ls', '..', '.\t..')
test('ls', '.././.././../.././.', '.\t..')

test('mkdir', '.', 'mkdir: .: File exists')
test('mkdir', '..', 'mkdir: ..: File exists')
test('mkdir', 'a', '')
test('mkdir', 'a', 'mkdir: a: File exists')
test('mkdir', 'a/b', '')
test('mkdir', 'a/b/c', '')
test('mkdir', 'a/b/d', '')

test('ls', '..', '.\t..\ta/')
test('ls', 'a', '.\t..\tb/')
test('ls', 'a/b', '.\t..\tc/\td/')
test('ls', 'a/b/../b', '.\t..\tc/\td/')


console.log('----------------')
console.log(test.total + ' tests run')
if(test.failed > 0) {
	out.red(test.failed + " failed")
}
else {
	out.green("all passed")
}
