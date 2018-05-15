// Browser terminal for ESOS (JSOS)
let t
let lineleader = 'websh$ '

//var commands = Object.create(OS.commands)
let FS = FileSystem
FS.init()

let commands = {
	echo(args) {
		let v
		if (typeof args === 'string' || args instanceof String){
			v = args
		} else {
			v = args.reduce((s, a) => s + a + ' ', '')
			v = v.substring(0, v.length-1) // oh noooo
		}
		t.write(v)
	},

	'>>': function(args) {
	},

	ls(args) {
		if(args.length === 0) { args = [""] }
		args.forEach(a => t.write(FS.ls(a)))
	},

	pwd(args) {
		t.write(FS.pwd())
	},

	touch(args) {
		args.forEach(a => t.write(FS.touch(a)))
	},

	rm(args) {
		args.forEach(a => t.write(FS.rm(a)))
	},

	mkdir(args) {
		args.forEach(a => t.write(FS.mkdir(a)))
	},

	rmdir(args) {
		args.forEach(a => t.write(FS.rmdir(a)))
	},

	cd(args) {
		t.write('')
	},
	cat(args) {
		t.write('meow')
	},

	clear(args) {
		t.value = ''
		event.stopPropagation()
	},

	who(args) {
		t.write('Just you for now.')
	},

	commands(args) {
		t.value += '\nThis system knows the following words:\n'
		names = Object.getOwnPropertyNames(commands)
		t.write(names, end='\n')
	},

	hello() {
		t.write("hi there...")
	},

	what() {
		t.write('more like who')
	},

	help(args) {
		t.write([
			"\n****************************************\n",
			"Hello, and welcome to the computer inside your browser!\n",
			"Well, I'm not actually a real computer, just a simulation.",
			"Actually I'm not really a simulation either.",
			"More of an emulation.\n",
			"Hey, you seem more like simulation though!\n",
			"Can you prove that you aren't?",
			"Do you know what you feel?",
			"Or do you feel what you know?\n",
			"****************************************\n",
			"For a list of commands, type 'commands'",
			"Don't type the quotes, just the word inside the quotes.\n",
			"commands\n",
			"Like that. Go ahead."
		], end='\n')
	},

	man(args) {
		t.write('woman')
	},
	woman(args) {
		t.write('no, just a computer')
	},
} // end commands

window.onload = function() {
	t = document.getElementById('shell')
	initTerminal(t)

	window.onkeypress = processKeyPress
	window.onkeydown = processKeyDown
	t.newline()
}

let initTerminal = function(t) {
	t.setAttribute("spellcheck", "false")
	t.focus()

	// add a new line ready for user input
	t.newline = function(lead='\n') {
		t.value += lead + lineleader
	}

	t.write = function(lines, lead='\n') {
		if(!lines) {return}
		if(typeof(lines) === 'string') {
			t.value += lead + lines
		}
		else if (typeof lines[Symbol.iterator] === 'function'){
			lines.map(l => t.value += lead + l)
		}
	}

	Object.defineProperty(t, 'currentLine', {
		get: function() {
			var lines = t.value.split('\n')
			var line = lines[lines.length - 1]
			return line.substring(lineleader.length, line.length)
		},
		set: function(l) {
			t.value = t.value.substring(0, l.length) // remove old
			t.value += l // add new
		}
	})
}

let processKeyPress = function(event) {
	// ENTER: try to run the command
	if(event.keyCode == 13) {

		args = t.currentLine.split(' ')
		f = commands[args[0]]

		if(args.length == 1 && args[0] == "") {
			// do nothing...
		}
		else if(typeof f === 'function'){
			f(help.cleanArgs(args))
		}
		else {
			commands.echo(args[0] + ": command not found.")
		}
		t.newline()
		t.scrollTop = t.scrollHeight
		return false
	}
	else if (t.selectionEnd < t.value.length - t.currentLine.length) {
		t.selectionEnd = t.selectionStart = t.textLength
	}
}

let processKeyDown = function(event) {
	// delete
	if(event.keyCode == 46) {
		if(t.selectionEnd < t.textLength - t.currentLine.length) {
			return false
		}
	}

	// backspace
	if(event.keyCode == 8) {
		if(t.selectionEnd <= t.textLength - t.currentLine.length) {
			return false
		}
	}

	// delete or backspace
	if(event.keyCode == 46 || event.keyCode == 8) {
		if(t.currentLine == lineleader) { return false }
		if(t.selectionStart != t.selectionEnd &&
		t.selectionStart < t.textLength - t.currentLine.length) {
			return false
		}
	}
}

var help = {
	cleanArgs: function(args) {
		if(!args) return false
		return args.slice(1, args.length).filter(a => a != "")
	}
}
