// TODO: this doesn't seem like the right way to scope this
var t;
var lineleader = 'weee $ '

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
		t.value += v;
		t.newline;
	},

	clear: function(args) {
		t.value = '';
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
		t.value += '\n' + lineleader;
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