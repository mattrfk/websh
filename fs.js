let FileSystem = {
	name: "my filesystem",
	currentDir: null,
	createDir: function(name, parentDir){
		let o = Object.create(File);
		o.isDir = true;
		o.name = name;
		o.parentDir = parentDir;
		return o;
	},
	addDir: function(name, path){
		let o = this.createDir(name, this.currentDir);
		this.currentDir.children.push(name);
	},
	changeCurrentDir: function(path) {
		// split path
		
	},
	ls: function() {
		return this.currentDir.children.join('\n');
	},
	init: function(fs=null){
		if(fs === null) {
			this.currentDir = this.createDir('/', null);
		} else {
		// load an existing filesystem
		}
	},
}

// template for a file:
let File = {
	name: null,
	parentDir: null,
	isDir: false,
	children: [],
}
