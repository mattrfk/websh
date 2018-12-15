;"use strict";

function l(s) { console.log(s) }

// optionally initialize the filesystem with an existing object
// the filesystem is represented in pure json
const FS = (f={}) => {

	const Interface = {
		ls: ls,
		pwd: pwd,
		rm: rm,
		touch: touch,
		mkdir: mkdir,
		rmdir: rmdir,
		cd: cd,
		cat: cat,
		log: logFS,
	}

	let root = f
	let current = root
	root.isDir = true
	root.name = ''
	root.path = []
	root.timestamp = new Date()
	root.children = { '.': null, '..': null }


	// clean and separate the path
	// takes a string, returns a Array
	function parsePath(path) {
		if(path === '') { return ['.'] }
		let p = path.split('/')
		if(p[0] === '') {
			p[0] = '/'
		}
		return p.filter(n => n !== '')
	}

	// return the parent dir or false if invalid
	function getParentDir(p) {
		if(p.length === 0) { return current }
		else { return exists(p.slice(0, p.length-1)) }
	}

	// join two paths
	function join(p1, p2) {
		if(isString(p2)) {
			p2 = [p2]
		}
		return p1.concat(p2)
	}

	function getChildren(path) {
		let f = exists(path)
		if(!f || !f.isDir) {
			return false
		}
		let c = f.children
		return Object.keys(c)
	}

	// return: the file if it was created, otherwise false
	function createFile(path, makeDir){
		if(exists(path)) { return false } // double-check

		let p = path.slice() // clone it
		let fname = p.pop()
		let dir = exists(p)
		if(fname == '' || !dir || !dir.isDir) {
			return false
		}

		let o = {
			isDir: makeDir,
			name:fname,
			path: path
		}

		if(makeDir){
			o.children = {'.': null, '..': null}
		}
		dir.children[fname] = o
		return o
	}

	// function clearFS() {
	// 	delete root
	// 	init()
	// }

	// accepts the path as a list (parsePath)
	// if it exists, return (a reference to) it
	// if it exists not, return false
	function exists(path) {
		if(!path) {
			return current
		}
		if(path.length === 0) {
			return root
		}

		let n = current
		let p = path.slice()
		if(path[0] === '/') {
			n = root;
			p.shift() // slice() to clone
		}

		for(let i = 0; i < p.length; i++) {
			if(!n || !p[i] || !n.isDir || !n.children) {
				return false
			}
			if(p[i] === '.') { continue }
			if(p[i] === '..') {
				if(n.path.length === 0) {
					// we are at the root; don't go anywhere
					continue
				} else {
					// we are not at the root; go up
					n = getParentDir(n.path)
				}
			} else {
				n = n.children[p[i]]
			}
			if(!n) { return false }
		}
		return n;
	}

	function getFile(path) {
		let p = parsePath(path)
		let f = exists(p)
		if(!f) {
			throw new E('No such file or directory')
		}
		return f
	}

	function ls(path) {
		let f = null
		if(path === '') {
			f = current
		}
		else {
			let p = parsePath(path)
			f = exists(p)
			if(!f.isDir) {
				return f.name
			}
		}

		let c = f.children
		let s =  Object.keys(c).map(function(f) {
			if( f !== '.' && f !== '..' && c[f].isDir) { return f + '/' }
			else { return f }
		}).join('\t')
		//TODO: format the data further up

		return s
	}

	function pwd() {
		return '/' + current.path
	}

	function touch(path) {
		let p = parsePath(path)
		let f = exists(p)
		if(f) {
			f.timestamp = new Date()
			return ''
		}

		let r = createFile(p, false)
		if(!r) {
			return 'touch: ' + path + ': No such file or directory'
		}
		return ''
	}

	// touch it, then make it a dir
	function mkdir(path) {
		let p = parsePath(path)
		l("mkdir at path:" + p)
		let f = exists(p)
		if(f) {
			return 'mkdir: '+ path + ': File exists'
		}

		let pa = getParentDir(p)
		if(!pa || !pa.isDir) {
			return 'mkdir: ' + pa.path + ': Not a directory'
		}

		let d = createFile(p, true)
		if(!d) {
			return 'mkdir: ' + path +': No such file or directory'
		}

		return ''
	}

	function rmdir(path) {
		// check if path exists
		let p = parsePath(path)
		let f = exists(p)
		if(!f) {
			return 'rmdir: ' + path + ': No such file or directory'
		}
		if(!f.isDir) {
			return 'rmdir: ' + path + ': Not a directory'
		}

		if(getChildren(p).length > 2) {
			return 'rmdir: ' + path + ': Directory not empty'
		}

		let c = getParentDir(p)
		delete c.children[f.name]
		return ''
	}

	function rm(path) {
		let p = parsePath(path)
		let f = exists(p)
		if(!f) {
			return 'rm: ' + path + ': No such file or directory'
		}
		if(f.isDir) {
			return 'rm: ' + path + ': is a directory'
		}

		let c = getParentDir(p)
		delete c.children[f.name]
		return ''
	}

	function cd(path) {
		let p = parsePath(path)
		let f = exists(p)
		if(!f) {
			return 'cd: ' + path + ': No such file or directory'
		}
		if(!f.isDir) {
			return 'cd: ' + path + ': Not a directory'
		}

		current = f
		return ''
	}

	function cat(path) {
		let p = parsePath(path)
		let f = exists(p)
		if(!f) {
			return 'cat: ' + path + ': No such file or directory'
		}
		if(f.isDir){
			return 'cat: ' + path + ': Is a directory'
		}
		if(!f.content) {
			return ''
		}
		return f.content
	}

	function appendToFile(path, content) {
		this.touch(path)
		let p = parsePath(path)
		let f = exists(p)
		if(!f || !content) {
			return ''
		}
		if(f.isDir) {
			return 'ish: ' + path + ': Is a directory'
		}

		if(!f.content) {
			f.content = ''
		} else {
			f.content += '\n'
		}
		f.content += content
		return ''
	}

	function logFS() {
		//return JSON.stringify(current)
		return current
	}

	return Interface
}

if(typeof module !== 'undefined' && module.exports) {
	module.exports = FS
}
