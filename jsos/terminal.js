;"use strict";
// Browser terminal for ESOS (JSOS)
let t
let lineleader = 'esh$ '

let esh = Esh()

window.onload = function() {
	t = document.getElementById('shell')
	initTerminal(t)

	window.onkeypress = processKeyPress
	window.onkeydown = processKeyDown
	t.printLeader()
}

let initTerminal = function(t) {
	t.setAttribute('spellcheck', 'false')
	t.focus()

	// add a new line ready for user input
	t.printLeader = function(lead='\n') {
		t.value += lead + lineleader
	}

	t.write = function(lines, lead='\n') {
		if(!lines) {return}
		t.value += lead + lines
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
		let output = esh.receive(t.currentLine)
		t.write(String(output))
		t.printLeader()
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
