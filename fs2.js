//TODO sub-object for "API"
//TODO timestamp
"use strict";
let FileSystem = {
	// attributes of a file
	// isDir: boolean
	// content: object (or string?)
	root: {}, // this describes the fs
	current: undefined,

	createFile(){
		return { isDir: false }
	},

	init(f=null){	
		if(f !== null) { // load an existing filesystem
			this.root = f;
		}
		else {
			this.current = this.root;
			this.root.isDir = true;
			this.root.children = { ".": null, "..": null };
		}
	},

	// -----------------------
	// commands
	ls() {
		let c = this.current.children
		return Object.keys(c).map(function(f) {
			if( f != "." && f != ".." && c[f].isDir) { return f + "/" }
			else { return f }
		});
	},

	pwd() {
		let p = "", n = this.current;	
		/// parent is .. - but what is the real name???
		do {
		} while(n !== this.root)
		return p;
	},

	// if the path is invalid, exit
	// if the file does not exist, create it
	// if the file exists, touch it softly
	// if there is a new file, return true
	touch(path) {
		let p = this.parsePath(path)
		if(this.exists(p)) {
			console.log("the file already exists")
			//TODO: touch it
		} else {
			if(p && p.length > 0) {
				let fname = p[p.length-1];
				p.splice(-1,1); // splice(index, howmany)
				let dir = this.exists(p)
				if(fname !== "" && dir) {
					dir.children[fname] = this.createFile();
				}
			}
		}
	},

	rm(path) {
		let f = this.exists(path)
		if(f) {
			delete this.current[f];
			// kill it		
		}
	},

	// touch it, then make it a dir
	mkdir() {},

	cd() {},

	// ------------------------------
	// helpers
	
	// if it exists, return (a reference to) it
	// if it exists not, return false
	exists(p) {
		let n;
		if(!p || p.length === 0) { return this.current }
		if(p && p.length > 0) {
			if(p[0] === "") {
				while(p[0] === ""){ // "////////path"
					p.shift();
				}
				n = this.root; 
			}	else { n = this.current }

			for(let i = 0; i < p.length; i++) {
				if(n === null) { continue }
				if(n.isDir && n.children.hasOwnProperty(p[i])){
					n = n.children[p[i]]; // down the hole we go
				} else {
					return false;
				}
			}
		} else { return false }
		return n;
	},

	parsePath(path) {
		return path.split('/');
	},
}
