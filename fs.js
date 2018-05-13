// - expose "API"
// - timestamps
// - validate filesystem?
//  
//
// Handy : JSON.stringify(FS.current)
//
// {"isDir":true,
// 	"name":"",
// 	"children": {
// 		".": null,
// 		"..":null,
// 		"c": {
// 			"isDir":true,
// 			"name":"c",
// 			"children":{
// 				".":null,
// 				"..":""}
// 		}}}

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
			this.root.path = []
			this.root.children = { ".": null, "..": null }
		}
	},

	// return file if it is created
	// return true if it already exists
	// return false if the path doesn't work 
	createFile(path, isDir){
		let p = this.parsePath(path)
		if(this.exists(p)) {
			return true
		} else {
			if(p && p.length > 0) {
				let fname = p.pop(); // splice(index, howmany)
				let dir = this.exists(p)
				if(fname !== "" && dir && dir.isDir) {
					let o = { 
						isDir: isDir, 
						name:fname, 
						path: this.join(p, fname)
					}
					dir.children[fname] = o
					return o
				} else {
					return false 
				}
			}
		}
		return true;
	},

	// -----------------------
	// commands
	ls(path) {
		// does this work. ls <file> ?
		let p = this.parsePath(path)
		let f = this.exists(p)
		if(!f) {
			return "ls: " + path + ": No such file or directory"
		}
		let c = f.children
		let s =  Object.keys(c).map(function(f) {
			if( f != "." && f != ".." && c[f].isDir) { return f + "/" }
			else { return f }
		}).join("\t")

		return s
	},

	pwd() {
		this.getCurrentPath()
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
			d.children = {".": null, "..": null}
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
			let c = this.getParentDir(p)
			delete c.children[f.name]
		}
	},

	cd() {},


	// ------------------------------
	// helpers
	
	// clean and separate the path
	// takes a string, returns a Array
	parsePath(path){
		if(path === '') { return ["."] }
		let p = path.split('/')
		if(p[0] === '') {
			p[0] = '/'	
		}
		return p.filter(n => n !== "")
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
		if(!this.exists(p)) { return false }
		if(p.length === 0) { return this.current }
		else { 
			return this.exists(p.slice(0, p.length-1)) 
		}
	},
	
	// return the specified directory
	// relative to the current directory
	// as indicated by the value 
	// of the next parameter
	walk(current, next) {
		if(!current || !next || !current.isDir || !current.children) { 
			return false 
		}
		if(next === ".") { return current }
		if(next === "..") {
			if(current.path === []) {
				// we are at the root
				return current
			}
			else{
				// we are not at the root; return this guy's parent
				return this.getParentDir(current.path)
			}
		}
		return current.children[next]
	},

	// take the path as a list
	// if it exists, return (a reference to) it
	// if it exists not, return false
	// a .. a
	exists(p) {
		let n = false
		if(!p || p.length === 0) { return this.current }
		if(p[0] === "/") { // the path started with a /
			n = this.root; 
			p.shift()
		}	
		else { n = this.current }

		for(let i = 0; i < p.length; i++) {
			n = this.walk(n, p[i])
			if(!n) { return false }
		}
		return n;
	},

	logFS() {
		return JSON.stringify(this.current)
	}
}

if(typeof module !== 'undefined' && module.exports) {
	module.exports = FileSystem
	// I've a feeling we're not in the browser anymore
}
