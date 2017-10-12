// TODO: this doesn't seem like the right way to scope this
var t;
var lineleader = 'browser$ '

var fileSystem = {
	cwd: '/',
};

var commands = {

	echo: function(args) {
		var v = "something went very wrong";
		if(typeof(args) === 'string') { 
			v = args; 
		}
		else { 
			v = args.slice(1, args.length).reduce((s, a) => s + a + ' ', '');
			v = v.substring(0, v.length-1); // oh noooo
		}
		t.value += '\n';
		t.write(v)
	},

	pwd: function(args) {
		t.write('\nError: filesystem not implemented.');
	},
	ls: function(args) {
		t.write('\nError: filesystem not implemented.');
	},
	cd: function(args) {
		t.write('\nError: filesystem not implemented.');
	},
	cat: function(args) {
		t.write('\nError: filesystem not implemented.');
	},
	touch: function(args) {
		t.write('\nError: filesystem not implemented.');
	},

	clear: function(args) {
		t.value = '';
	},

	who: function(args) {
		t.value += '\nJust you for now.\n'
	},

	commands: function(args) {
		t.value += '\nThis system knows the following words:\n';
		names = Object.getOwnPropertyNames(commands); //introspective
		t.write(names);
	},

	hello: function(args) {
		t.write("\nhi there...")
	},

	how: function() {
		t.write('\nwhy');
	},
	why: function() {
		t.write('\nhow');
	},

	help: function(args) {
		t.write([
			"\nHello and welcome",
			"To the computer inside your browser\n",
			"This is just a simulation of a computer, actually.",
			"But that doesn't make it any less real.",
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

	// setup, no upset
	t = document.getElementById('shell');
	t.value = lineleader;
	t.setAttribute("spellcheck", "false");
	t.focus();

	// add a new line ready for user input
	t.newline = function() {
		t.value += lineleader;
	}

	t.write = function(lines) {
		if(typeof(lines) === 'string') {
			t.value += lines + '\n'; 
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
				t.value += '\n';
			}
			else if(typeof f === 'function'){
				f(args);	
			}
			else {
				commands.echo(args[0] + ": command not found.");
			}
			t.newline();
			
			console.log(t.scrollHeight);
			t.scrollTop = t.scrollHeight;

			return false;
		}
		else if (t.selectionEnd < t.value.length - t.currentLine.length) {
			t.selectionEnd = t.selectionStart = t.textLength;
		}
	}

	this.onkeydown = function(event) {
 		console.log("keyCode: " + event.keyCode);

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
}