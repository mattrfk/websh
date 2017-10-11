// TODO: this doesn't seem like the right way to scope this
var t;
var lineleader = 'hello$ '

window.onload = function() {

	// set stuff up
	t = document.getElementById('shell')
	t.value = lineleader
	t.focus()

	Object.defineProperty(t, 'currentLine', {
		get: function() { 
			lines = t.value.split('\n');
			return lines[lines.length - 1]; },
		set: function(l) {
			t.value = t.value.substring(0, l.length); // remove old
			t.value += l; // add new
		},
	});

	this.onkeypress = function(event) {
		// on ENTER, make the newline with lineleader
		if(event.keyCode == 13) {
			t.value += '\n' + lineleader;
			return false;
		}
	}

	this.onkeydown = function(event) {
		console.log("keyCode: " + event.keyCode);

		// delete
		if(event.keyCode == 46) {
			if(t.selectionEnd < t.textLength - (t.currentLine.length - lineleader.length)) {
				return false; 
			}
		}

		// backspace
		if(event.keyCode == 8) {
			if(t.selectionEnd <= t.textLength - (t.currentLine.length - lineleader.length)) {
				return false; 
			}
		}

		// delete or backspace
		if(event.keyCode == 46 || event.keyCode == 8) {
			if(t.currentLine == lineleader) { return false; }
			if(t.selectionStart != t.selectionEnd && 
			t.selectionStart < t.textLength - (t.currentLine.length - lineleader.length)) { return false;}

		}  
	}
}