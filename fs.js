let File = {
	name: undefined,
	parentDir: undefined,
	isDir: undefined,
	content: undefined,
	init: function(name, isDir, parentDir){
		this.name = name;
		this.isDir = isDir;
		this.parentDir = parentDir;
		//this.content = "";
	},
	getPath: function() {	
		let p = "", n = this.parentDir;
		do {
			p += "/" + this.parentDir.name;
			n = n.parentDir;
		} while(n != this)
		return p;
	},
	getContent: function() {
		return this.content;
	},
	putContent: function(c) {
		this.content = c;
	},
}

// a directory is a special file
let Dir = Object.create(File);
Dir.children = []
Dir.addChild = function(o) {	
	this.children.push(o);
}

Dir.contains = function(name){
	return (this.children.length > 0 &&
		!this.children.every(c => c.name !== name))
}

let FileSystem = {
	current: null,
	root: null,
	init: function(){
		this.current = Object.create(Dir);
		this.root = this.current;
		this.current.init("", true, this.current);
	},

	// return array
	ls: function() {
		return [".", ".."].concat(
			this.current.children.map( function(d){ 
				if(d.isDir) { return d.name + "/"}
				else { return d.name } 
		}));
	},

	parsePath: function(path) {
		return path.split('/');
	},

	exists: function(path) {
		//TODO: handle .. and .
		p = this.parsePath(path);
		if(p && p.length > 0) {
			if(p[0] === ""){ n = this.root }
			else { n = this.current }
			for(let i = 0; i < p.length; i++){
				if(n.contains(p[i]) && n.children[p[i]].isDir) {
					n = n.children[p[i]]
				} else { return false }
			}
		} else {
			return false;
		}
		return true;
	},

	createFile: function(path) {		
		if(this.exists(path)) {
			console.log("File already exists");
		}
		else {
			o = Object.create(File);
			o.init(path, false, this.current);
			this.current.addChild(o);
			console.log("here");
		}
	}
}
