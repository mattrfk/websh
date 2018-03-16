import {pwd} from './fs.js'

// TODO: this doesn't seem like the right way to scope this
var t;
var lineleader = 'browser$ '


// language extension courtesy of D. Crockford
if (typeof Object.create !== 'function') {
     Object.create = function (o) {
         var F = function () {};
         F.prototype = o;
         return new F();
     };
}

// define a constructor
var file = {
	name: '/',
	children: {},
	timeStamp: '?',
};

var fs = {
	currentNode: Object.create(file),

	touch: function(name) {
		
		if (fs.fileExists(name)) {
			
		}
		else {
			fs.log("FS: creating new file:" + name);
			fs.currentNode.children[name] = Object.create(file);
			fs.currentNode.children[name].name = name;	
		}
		fs.currentNode.children[name].timeStamp += 1;
		
	},

	fileExists: function(file) {
		if(Object.getOwnPropertyDescriptor(fs.currentNode.children, file)) {
			return true;
		}
		return false;
	},

	initDir(name) {
		fs.currentNode.children[name].children['.'] = fs.currentNode.children[name];
		fs.currentNode.children[name].children['..'] = fs.currentNode;
	},

	mkDir: function(name) {
		if(fs.fileExists(name)) {
			fs.log("mkdir fail, " + name + " already exists");
			return;
		}
		fs.touch(name)

		// set up as directory
		fs.initDir(name);
	},

	isDir: function(name) {
		if(fs.fileExists(name) && fs.currentNode.children[name].children != {} ) {
			return true;
		}
		return false;
	},

	log: function(msg) {
		console.log(msg);
	},
};

var help = {
	cleanArgs: function(args) {
		return args.slice(1, args.length).filter(a => a != "");
	}
}

var commands = {
	echo: function(args) {
		var v = "something went very wrong";
		console.log(args);
		v = help.cleanArgs(args).reduce((s, a) => s + a + ' ', '');
		v = v.substring(0, v.length-1); // oh noooo
		t.value += '\n';
		t.write(v)
	},

	pwd: function(args) {
		t.write('\n' + fs.currentNode.name);
	},
	touch: function(args) {
		args = help.cleanArgs(args);
		console.log(args);
		args.forEach(a => fs.touch(a));
	},
	mkdir: function(args) {
		args = help.cleanArgs(args);
		args.forEach(function(a){
			if(fs.fileExists(a)) {
				t.writeln(a + " already exists");
			}
			else {
				fs.mkDir(a);
			}
		});
	},
	ls: function(args) {
		Object.getOwnPropertyNames(fs.currentNode.children).forEach(n => t.write('\n' + n));
	},
	rm: function(args) {
		t.write('\nError: filesystem not implemented.');
	},
	cd: function(args) {
		t.write('\nError: filesystem not implemented.');
	},
	cat: function(args) {
		t.write('\nError: filesystem not implemented.');
	},


	clear: function(args) {
		t.value = '';
		event.stopPropagation();
	},

	who: function(args) {
		t.value += '\nJust you for now.\n'
	},

	commands: function(args) {
		t.value += '\nThis system knows the following words:\n';
		names = Object.getOwnPropertyNames(commands).filter(f => commands[f].prototype.constructor.length != 0); //introspective
		t.writeln(names);
	},

	hello: function() {
		t.write("\nhi there...")
	},

	how: function() {
		t.write('\nmore like why');
	},
	why: function() {
		t.write('\nmore like how');
	},
	what: function() {
		t.write('\nmore like who');
	},
	ow: function() {
		t.write('\nsorry');
	},

	help: function(args) {
		t.writeln([
			"\nHello and welcome",
			"To the computer inside your browser\n",
			"This is just a simulation.",
			"But really what isn't?",
			"What is a simulation anyway?",
			"What is 'real'?",
			"Are we dreaming right now?\n",
			"Anyway,",
			"For a list of commands, type 'commands'",
			"Don't type the quotes, just the word inside the quotes."]);
	},

	man: function(args) {
		t.write('\nhaha nope');
	}
}

window.onload = function() {
	t = document.getElementById('shell');
	t.setAttribute("spellcheck", "false");
	t.focus();

	// add a new line ready for user input
	t.newline = function(lead='\n') {
		t.value += lead + lineleader;
	}

	t.write = function(lines) {
		if(typeof(lines) === 'string') {
			t.value += lines; 
		}
		else {
			lines.map(l => t.value += l + ' ')
		}
	}

	t.writeln = function(lines) {
		if(typeof(lines) === 'string') {
			t.value += '\n' + lines; 
		}
		else {
			lines.map(l => t.value += l + '\n')
		}
	}

	Object.defineProperty(t, 'currentLine', {
		get: function() { 
			var lines = t.value.split('\n');
			var line = lines[lines.length - 1];
			return line.substring(lineleader.length, line.length); 
		},
		set: function(l) {
			t.value = t.value.substring(0, l.length); // remove old
			t.value += l; // add new
		}
	});

	this.onkeypress = function(event) {
		// ENTER: try to run the command
		if(event.keyCode == 13) {
			
			args = t.currentLine.split(' ');
			f = commands[args[0]];

			if(args.length == 1 && args[0] == "") {
				// do nothing...
			}
			else if(typeof f === 'function'){
				f(args);	
			}
			else {
				commands.echo(args[0] + ": command not found.");
			}
			t.newline();

			t.scrollTop = t.scrollHeight;

			return false;
		}
		else if (t.selectionEnd < t.value.length - t.currentLine.length) {
			t.selectionEnd = t.selectionStart = t.textLength;
		}
	}

	this.onkeydown = function(event) {
 		//console.log("keyCode: " + event.keyCode);

		// delete
		if(event.keyCode == 46) {
			if(t.selectionEnd < t.textLength - t.currentLine.length) {
				return false; 
			}
		}

		// backspace
		if(event.keyCode == 8) {
			if(t.selectionEnd <= t.textLength - t.currentLine.length) {
				return false; 
			}
		}

		// delete or backspace
		if(event.keyCode == 46 || event.keyCode == 8) {
			if(t.currentLine == lineleader) { return false; }
			if(t.selectionStart != t.selectionEnd && 
			t.selectionStart < t.textLength - t.currentLine.length) { 
				return false;
			}
		}
	}

	t.writeln("setting up system...");
	t.writeln("loading filesystem");
	fs.children
	t.writeln("ready...")
	t.writeln("set")
	t.writeln("go!")
	t.newline();
}
