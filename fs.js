// >>
// cat
// eraseFilesystem (interactive)


"use strict";
let FileSystem = {
	root: {}, // this describes the fs
	current: undefined,

	init(f=null) {
		if(f !== null) { // load an existing filesystem
			this.root = f
		}
		else {
			this.current = this.root
			this.root.isDir = true
			this.root.name = ''
			this.root.path = []
			this.timestamp = new Date()
			this.root.children = { '.': null, '..': null }
		}
	},

	// -----------------------
	// commands
	ls(path) {
		let p = this.parsePath(path)
		let f = this.exists(p)
		if(!f) {
			return 'ls: ' + path + ': No such file or directory'
		}
		if(!f.isDir) {
			return f.name
		}
		let c = f.children
		let s =  Object.keys(c).map(function(f) {
			if( f != '.' && f != '..' && c[f].isDir) { return f + '/' }
			else { return f }
		}).join('\t')

		return s
	},

	pwd() {
		return '/' + this.current.path
	},

	touch(path) {
		let p = this.parsePath(path)
		let f = this.exists(p)
		if(f) {
			f.timestamp = new Date()
			return true
		}

		let r = this.createFile(p, false)
		if(!r) {
			return 'touch: ' + path + ': No such file or directory'
		}
		return true
	},

	// touch it, then make it a dir
	mkdir(path) {
		let p = this.parsePath(path)
		if(this.exists(p)) {
			return 'mkdir: '+ path + ': File exists'
		}

		let pa = this.getParentDir(p)
		if(!pa || !pa.isDir) {
			return 'mkdir: ' + pa.path + ': Not a directory'
		}

		let d = this.createFile(p, true)
		if(!d) {
			return 'mkdir: ' + path +': No such file or directory'
		}

		return true
	},

	rmdir(path) {
		// check if path exists
		let p = this.parsePath(path)
		let f = this.exists(p)
		if(!f) {
			return 'rmdir: ' + path + ': No such file or directory'
		}
		if(!f.isDir) {
			return 'rmdir: ' + path + ': Not a directory'
		}

		if(this.getChildren(p).length > 2) {
			return 'rmdir: ' + path + ': Directory not empty'
		}

		let c = this.getParentDir(p)
		delete c.children[f.name]
		return true
	},

	rm(path) {
		let p = this.parsePath(path)
		let f = this.exists(p)
		if(!f) {
			return 'rm: ' + path + ': No such file or directory'
		}
		if(f.isDir) {
			return 'rm: ' + path + ': is a directory'
		}

		let c = this.getParentDir(p)
		delete c.children[f.name]
		return true
	},

	cd(path) {
		let p = this.parsePath(path)
		let f = this.exists(p)
		if(!f) {
			return 'cd: ' + path + ': No such file or directory'
		}
		if(!f.isDir) {
			return 'cd: ' + path + ': Not a directory'
		}

		this.current = f
		return true
	},

	// TODO: these don't really belong in the FS
	cat(path) {
		let p = this.parsePath(path)
		let f = this.exists(p)
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
	},

	appendToFile(path, content) {
		this.touch(path)
		let p = this.parsePath(path)
		let f = this.exists(p)
		if(!f) {
			return false
		}
		if(f.isDir) {
			return 'ish: ' + path + ': Is a directory'
		}

		if(!f.content) {
			f.content = ''
		}
		f.content += content
		return true
	},


	// ------------------------------
	// helpers

	// clean and separate the path
	// takes a string, returns a Array
	parsePath(path){
		if(path === '') { return ['.'] }
		let p = path.split('/')
		if(p[0] === '') {
			p[0] = '/'
		}
		return p.filter(n => n !== '')
	},

	// join two paths
	join(p1, p2) {
		if(Object.prototype.toString.call(p2) === '[object String]') { // srsly
			p2 = [p2]
		}
		return p1.concat(p2)
	},

	// return the parent dir or false if invalid
	getParentDir(p) {
		if(p.length === 0) { return this.current }
		else { return this.exists(p.slice(0, p.length-1)) }
	},

	getChildren(path) {
		let f = this.exists(path)
		if(!f || !f.isDir) {
			return false
		}
		let c = f.children
		return Object.keys(c)
	},

	// return: the file if it was created, otherwise false
	createFile(path, makeDir){
		if(this.exists(path)) { return false } // double-check

		let p = path.slice() // clone it
		let fname = p.pop()
		let dir = this.exists(p)
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
	},

	// accepts the path as a list (parsePath)
	// if it exists, return (a reference to) it
	// if it exists not, return false
	exists(path) {
		if(!path) {
			return this.current
		}
		if(path.length === 0) {
			return this.root
		}

		let n = this.current
		let p = path.slice()
		if(path[0] === '/') {
			n = this.root;
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
					n = this.getParentDir(n.path)
				}
			} else {
				n = n.children[p[i]]
			}
			if(!n) { return false }
		}
		return n;
	},

	logFS() {
		return JSON.stringify(this.current)
	},

	clearFS() {
		delete this.root
		this.init()
	},
}

if(typeof module !== 'undefined' && module.exports) {
	module.exports = FileSystem
	// I've a feeling we're not in the browser anymore
}
