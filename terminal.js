// Browser terminal for ESOS (JSOS)
// it is the code that makes possible
// all of our modern wonders
// we are dancing for nothing
// if we forget the words
//
// TODO arrow keys for command memory
var t;
var lineleader = 'browser$ '

//var commands = Object.create(OS.commands);
let FS = FileSystem;
FS.init();

var commands = {
	echo(args) {
		var v = "something went very wrong";
		console.log(args);
		v = help.cleanArgs(args).reduce((s, a) => s + a + ' ', '');
		v = v.substring(0, v.length-1); // oh noooo
		t.value += '\n';
		t.write(v)
	},

	ls(args) {
		t.write("\n" + FS.ls().join("\t"));
	},

	pwd(args) {
		t.write('\n' + FS.current.getPath());
	},

	touch(args) {
		args = help.cleanArgs(args);
		console.log(args);
		args.forEach(a => FS.touch(a));
	},

	rm(args) {
		args = help.cleanArgs(args);
		console.log(args);
		args.forEach(a => FS.rm(a));
	},

	mkdir(args) {
	},

	cd(args) {
		t.write('\nError: filesystem not implemented.');
	},
	cat(args) {
		t.write('\nError: filesystem not implemented.');
	},


	clear(args) {
		t.value = '';
		event.stopPropagation();
	},

	who(args) {
		t.value += '\nJust you for now.\n'
	},

	commands(args) {
		t.value += '\nThis system knows the following words:\n';
		names = Object.getOwnPropertyNames(commands).filter(f => commands[f].prototype.constructor.length != 0); //introspective
		t.writeln(names);
	},

	hello() {
		t.write("\nhi there...")
	},

	how() {
		t.write('\nmore like why');
	},
	why() {
		t.write('\nmore like how');
	},
	what() {
		t.write('\nmore like who');
	},
	ow() {
		t.write('\nsorry');
	},

	help(args) {
		t.writeln([
			"\n****************************************",
			"Hello and welcome",
			"To the computer inside your browser\n",
			"This is not real computer.",
			"It is just a simulation.",
			"Actually it is an emulation, not a simulation.",
			"But maybe it is also a simulation.",
			"Maybe everything is a simulation.",
			"How do you know that you're not a simulation?",
			"Or an emulation, for that matter?",
			"Do you know what you feel, or do you feel what you know?\n",
			"****************************************",
			"For a list of commands, type 'commands'",
			"Don't type the quotes, just the word inside the quotes. commands"]);
	},

	man(args) {
		t.write('\nwoman');
	},
	woman(args) {
		t.write('\njust a computer');
	},
}

window.onload = function() {
	t = document.getElementById('shell');
	initTerminal(t)

	window.onkeypress = processKeyPress
	window.onkeydown = processKeyDown
	t.newline();
}

let initTerminal = function(t) {
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
}

let processKeyPress = function(event) {
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

let processKeyDown = function(event) {
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

var help = {
	cleanArgs: function(args) {
		if(!args) return false;
		return args.slice(1, args.length).filter(a => a != "");
	}
}
