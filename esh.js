"use strict"

// take a string and turn it into something I can use
const Command = (input) => {
  let args = []
  let flags = []
  let command = ''
  let next = false
  if(input.length > 0) {
    command = input[0]
  }

  for(let i = 1; i < input.length; i++ ) {
    if(input[i] === '>>') {
      next = Command(input.slice(i, input.length))
      break
    }
    args.push(input[i])
  }

  return {
    command: command,
    flags: flags,
    args: args,
    next: next
  }
}

const Esh = () => {
  function processCommand(cmd) {
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

  return {
    receive_input(input) {
      if(input === '') { return input }
      let cmd = Command(input.trim().split(' '))
      return processCommand(cmd);
    }
  }
}

let fs = FS()
let commands = {
	// echo(args) {
	// 	let v
	// 	if (typeof args === 'string' || args instanceof String){
	// 		v = args
	// 	} else {
	// 		v = args.reduce((s, a) => s + a + ' ', '')
	// 		v = v.substring(0, v.length-1) // oh noooo
	// 	}
	// 	t.write(v)
	// },

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
		if(args.length === 0) { args = [''] }
    let r = ''
    for(let i = 0; i < args.length; i++) {
      r += fs.ls(args[i])
      if(i < args.length-1) { r += '\n' }
    }
    return r
	},

	pwd(args) {
    if(args.length === 0) { args = [''] }
    let r = ''
    for(let i = 0; i < args.length; i++) {
      r += fs.pwd(args[i])
      if(i < args.length-1) { r += '\n' }
    }
    return r
	},

	touch(args) {
    let r = ''
    for(let i = 0; i < args.length; i++) {
      r += fs.touch(args[i])
      if(i < args.length-1) { r += '\n' }
    }
    return r
	},

	rm(args) {
    let r = ''
    for(let i = 0; i < args.length; i++) {
      r += fs.rm(args[i])
      if(i < args.length-1) { r += '\n' }
    }
    return r
	},

	mkdir(args) {
    let r = ''
    for(let i = 0; i < args.length; i++) {
      r += fs.mkdir(args[i])
      if(i < args.length-1) { r += '\n' }
    }
    return r
	},

	rmdir(args) {
    let r = ''
    for(let i = 0; i < args.length; i++) {
      r += fs.rmdir(args[i])
      if(i < args.length-1) { r += '\n' }
    }
    return r
	},

	cd(args) {
    let r = ''
    for(let i = 0; i < args.length; i++) {
      r += fs.cd(args[i])
      if(i < args.length-1) { r += '\n' }
    }
    return r
	},

	cat(args) {
    let r = ''
    for(let i = 0; i < args.length; i++) {
      r += fs.cat(args[i])
      if(i < args.length-1) { r += '\n' }
    }
    return r
	},

	'>>': function(args) {
    if(args.length !== 2) {
      return "improper number of argumentssss"
    }
		return fs.appendToFile(args[0], args[1])
	},

	clear(args) {
		t.value = ''
		event.stopPropagation()
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
			"\n****************************************\n",
			"Hello, and welcome to the computer inside your browser!\n",
			"Well, I'm actually not a computer, not a real computer.",
			"I'm really just a simulation.",
			"Actually, I'm not really a simulation either.",
			"More of an emulation...\n",
			"anyway",
			"For a list of commands, type 'commands'",
			"****************************************\n",
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
