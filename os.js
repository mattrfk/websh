// all the OS commands
// provide javascript API (list of callable functions)
//
// filesystem:
// pwd cd ls mv rm
//
// OS: 
// cat less
//
// programs: 
// vi curl/wget ssh
//
// terminal:
// clear
let OS = {
	FS: FileSystem,
	init: function(){
		console.log("initializing OS");
	}
}
