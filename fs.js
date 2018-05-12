//TODO sub-object for "API"
//TODO timestamp
// Handy : JSON.stringify(FS.current)

"use strict";
let FileSystem = {
	// attributes of a file
	// isDir: boolean
	// content: object (or string?)
	root: {}, // this describes the fs
	current: undefined,

	init(f=null){	
		if(f !== null) { // load an existing filesystem
			this.root = f
		}
		else {
			this.current = this.root
			this.root.isDir = true
			this.root.name = ""
			this.root.children = { ".": null, "..": null }
		}
	},

	// -----------------------
	// commands
	ls(path) {
		// does this work. ls <file> ?
		let p = this.parsePath(path)
		let f = this.exists(p)
		if(!f) {
			return "ls: " + path +": No such file or directory"
		}
		let c = f.children
		let s =  Object.keys(c).map(function(f) {
			if( f != "." && f != ".." && c[f].isDir) { return f + "/" }
			else { return f }
		}).join("\t")

		return s
	},

	pwd() {
		let p = "", n = this.current
		/// parent is .. - but what is the real name???
		do {
		} while(n !== this.root)
		return p
	},

	touch(path) {
		let r = this.createFile(path, false)
		if(!r) {
			return "\ntouch: " + path +": No such file or directory"
		}
		if(r === true) {
			console.log("file already exists")
			//TODO: touch it
		}
		return "";
	},

	// touch it, then make it a dir
	mkdir(path) {
		let d = this.createFile(path, true)
		if(!d) {
			return "mkdir: " + path +": No such file or directory"
		}
		if(d === true) {
			return "mkdir: "+ path + ": File exists"
			console.log("file already exists")
		}
		else {
			d.children = {".": null, "..": this.getParentDir(path).name}
		}
		return "";
	},

	rm(path) {
		let p = this.parsePath(path)
		let f = this.exists(p)
		if(f) {
			if(f.isDir) {
				return "\nrm: " + path + ": is a directory"
			}
			let c = this.getParentDir(path)
			delete c.children[f.name]
		}
	},

	cd() {},

	// ------------------------------
	// helpers

	// return file if it is created
	// return true if it already exists
	// return false if the path doesn't work 
	createFile(path, isDir){
		let p = this.parsePath(path)
		let y = this.exists(p)
		if(y) {
			return true
		} else {
			if(p && p.length > 0) {
				let fname = p[p.length-1]
				p.pop(); // splice(index, howmany)
				let dir = this.exists(p)
				if(fname !== "" && dir && dir.isDir) {
					let o = { isDir: isDir, name:fname }
					dir.children[fname] = o
					return o
				} else {
					return false 
				}
			}
		}
		return true;
	},

	// return the parent dir or false if invalid
	getParentDir(path) {
		let p = this.parsePath(path)
		if(!this.exists(p)) { return false }
		if(p.length === 0) { return this.current }
		else { 
			p.pop()
			return this.exists(p) 
		}
	},
	
	// return the directory up or down from the current directory
	// as indicated by the value of the next parameter
	// TODO: English
	walk(current, next) {
		if(!current || !next || !current.isDir || !current.children) { 
			return false 
		}
		if(next === ".") { return current }
		if(next === ".." && current.children[next] === null) { 
			return current
		}
		return current.children[next]
	},

	// if it exists, return (a reference to) it
	// if it exists not, return false
	exists(p) {
		let n = false
		if(!p || p.length === 0) { return this.current }
		if(p[0] === "") {
			while(p[0] === ""){ // "////////path"
				p.shift();
			}
			n = this.root; 
		}	else { n = this.current }

		for(let i = 0; i < p.length; i++) {
			n = this.walk(n, p[i])
			if(!n) { return false }
		}

		return n;
	},

	parsePath(path) {
		return path.split('/');
	},

	logFS() {
		console.log(JSON.stringify(this.current))
	}
}

if(typeof module !== 'undefined' && module.exports) {
	module.exports = FileSystem
	// I've a feeling we're not in the browser anymore
}
