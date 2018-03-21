//TODO sub-object for "API"
//TODO timestamp
let FileSystem = {
	root: {}, // this describes the fs
	current: undefined,
	content: undefined,

	init: function(f=null){	
		if(f !== null) { // load an existing filesystem
			this.root = f;
		}
		else {
			this.current = this.root;
			this.root.isDir = true;
			this.root.content = { ".": this.root, "..": this.root };
		}
	},

	// -----------------------
	// commands
	ls: function() {
		let c = this.current.content
		return Object.keys(c).map(function(f) {
			if( f != "." && f != ".." && c[f].isDir) { return f + "/" }
			else { return f }
		});
	},

	pwd: function() {
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
	touch: function(path) {
		let p = this.parsePath(path);
		if(p && p.length > 0) {
			fname = p[length-1];
			p.splice(-1,1); // splice(index, howmany)
			if(this.exists(path)) {
				console.log("the path works: "+ p);
			}
		}
	},

	// touch it, then make it a dir
	mkdir: function() {},

	cd: function() {},

	// ------------------------------
	// helpers
	
	// if it exists, return (a reference to) it
	// if it exists not, return false
	exists: function(path) {
		let n, p = this.parsePath(path);
		if(p && p.length > 0) {
			if(p[0] === "") {
				n = this.root; 
				p.shift();
			}	else { n = this.current }

			for(let i = 0; i < p.length; i++) {
				if(n.isDir && n.content.hasOwnProperty(p[i])){
					n = n.content[p[i]]; // down the hole we go
				} else {
					return false;
				}
			}
		} else { return false }
		return n;
	},

	parsePath: function(path) {
		return path.split('/');
	},
}
