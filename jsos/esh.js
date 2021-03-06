;"use strict";

let fs = FS()


const Esh = () => {
	const Interface = {
		receive: receiveInput,
	}


	function receiveInput(input) {
		if(input === '') { 
			return [] 
		}
		let cmd = parse(input.trim().split(' '))
		return processCommand(cmd);
	}

  function processCommand(cmd) {
		console.log("process command:", cmd)
    let out = ''
    let f = commands[cmd.command]
    if(typeof f === 'function') {
      out = f(cmd.args)
    }
    else {
      return cmd.command + ': command not found.'
    }

    if(cmd.next) {
      if(out !== '') { cmd.next.args.push(out) }
      return processCommand(cmd.next)
    }
    else {
      return out
    }
  }

	// take a string from user input
	// separate out each command-argument component
	// return a tree-structure 
	function parse(input) {
		let args = []
		let next = false
		let command = ''
		if(input.length > 0) {
			command = input[0]
		}

		for(let i = 1; i < input.length; i++ ) {
			if(input[i] === '>>') {
				next = parse(input.slice(i, input.length))
				break
			}
			args.push(input[i])
		}

		return {
			command: command,
			args: args,
			next: next
		}
	}

	return Interface
}

// apply args to f
function h(f, args) {
		return f(args)
}

let commands = {
  echo(args) {
  	let v
  	if (typeof args === 'string' || args instanceof String){
  		v = args
  	} else {
  		v = args.reduce((s, a) => s + a + ' ', '')
  		v = v.substring(0, v.length-1) // oh noooo
  	}
  	return v
  },

	ls(args) {
		console.log(args)
		let path = ''
		if(args.length > 0) {
			path = args[0]
		}

    return h(fs.ls, path)
	},

	pwd(args) {
    return h(fs.pwd, args)
	},

	touch(args) {
    return h(fs.touch, args)
	},

	rm(args) {
    return h(fs.rm, args)
	},

	mkdir(args) {
		let path = ''
		if(args.length > 0) {
			path = args[0]
		}
    return h(fs.mkdir, path)
	},

	rmdir(args) {
    return h(fs.rmdir, args)
	},

	cd(args) {
    return h(fs.cd, args)
	},

	cat(args) {
    return h(fs.cat, args)
	},

	'>>': function(args) {
    if(args.length !== 2) {
      return "improper number of argumentssss"
    }
		return fs.appendToFile(args[0], args[1])
	},

	clear(args) {
		t.value = ''
		//event.stopPropagation()
    return ''
	},

	who(args) {
		return 'Just you for now.'
	},

	commands(args) {
		t.value += '\nThis system knows the following words:\n'
		return Object.getOwnPropertyNames(commands).map(a => a + '\n')
	},

	hello() {
		return 'hi there...'
	},

	what() {
		return 'more like who'
	},

	help(args) {
		t.write([
			"Hello.\n",
			"I am a computer.\n",
		], '\n')
	},

	man(args) {
		t.write('woman')
	},
	woman(args) {
		t.write('no, just a computer')
	},
} // end commands
