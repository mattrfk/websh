#!/usr/bin/env node

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
		if(String(result) === expected){
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

let FS = require('./fs.js')
fs = FS()

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

t('touch', 'f', '')
t('mkdir', 'f/a', 'mkdir: f: Not a directory')

t('ls', '..', '.\t..\ta/\tf')
t('ls', 'a', '.\t..\tb/')
t('ls', 'a/../a', '.\t..\tb/')
t('ls', 'a/b', '.\t..\tc/\td/')
t('ls', 'a/b/../b', '.\t..\tc/\td/')
t('ls', 'a/b/../b/../b/../b', '.\t..\tc/\td/')
t('ls', 'a/b/../../a/b', '.\t..\tc/\td/')

t('rmdir', 'foo', 'rmdir: foo: No such file or directory')
t('rmdir', 'foo/bar', 'rmdir: foo/bar: No such file or directory')
t('rmdir', 'a', 'rmdir: a: Directory not empty')

t('cd', 'a', '')
t('ls', '', '.\t..\tb/')
t('ls', '..', '.\t..\ta/\tf')
t('pwd', '', '/a')

t('cd', '..', '')
t('pwd', '', '/')

t('cat', 'a', 'cat: a: Is a directory')
t('cat', 'f', '')
t('appendToFile', 'f', '')
fs.appendToFile('f', 'Stately, plump Buck Mulligan')
t('cat', 'f', 'Stately, plump Buck Mulligan')



console.log('----------------')
console.log(T.total + ' tests run')
if(T.failed > 0) {
	out.red(T.failed + " failed")
}
else {
	out.green("all passed")
}
