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

let T = {
	total: 0,
	failed: 0,

	test(cmd, input, expected) {
		let result = fs[cmd](input)	
		this.total++
		out(cmd+ '(\'' + input + '\'):')
		if(result === expected){
			out.green('pass')
		} else {
			this.failed++
			out.red('fail')
			console.log('\texpected: ' + expected)
			console.log('\treceived: ' + result)
		}
	},
}

//just a wrapper to save on pixels
function t(cmd, input, expected) {
	T.test(cmd, input, expected)
}

let fs = require('./fs.js')
fs.init()

t('ls', '', '.\t..')
t('ls', '.', '.\t..')
t('ls', '..', '.\t..')
t('ls', '.././.././../.././.', '.\t..')
t('ls', '//////../', '.\t..')
t('ls', '/.', '.\t..')
t('ls', '/.//////../.', '.\t..')
t('ls', '////////', '.\t..')
t('ls', './////..', '.\t..')

t('mkdir', '.', 'mkdir: .: File exists')
t('mkdir', '..', 'mkdir: ..: File exists')
t('mkdir', 'a', '')
t('mkdir', 'a', 'mkdir: a: File exists')
t('mkdir', 'a/b', '')
t('mkdir', 'a/b/c', '')
t('mkdir', 'a/b/d', '')

t('ls', '..', '.\t..\ta/')
t('ls', 'a', '.\t..\tb/')
t('ls', 'a/../a', '.\t..\tb/')
t('ls', 'a/b', '.\t..\tc/\td/')
t('ls', 'a/b/../b', '.\t..\tc/\td/')
t('ls', 'a/b/../b/../b/../b', '.\t..\tc/\td/')
t('ls', 'a/b/../../a/b', '.\t..\tc/\td/')


console.log('----------------')
console.log(T.total + ' tests run')
if(T.failed > 0) {
	out.red(test.failed + " failed")
}
else {
	out.green("all passed")
}
