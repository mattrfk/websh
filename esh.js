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

const h = function(f, args) {
    let r = ''
    for(let i = 0; i < args.length; i++) {
      r += f(args[i])
      if(i < args.length-1) { r += '\n' }
    }
    return r
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
    return h(fs.ls, args)
	},

	pwd(args) {
    if(args.length === 0) { args = [''] }
    return h(fs.pwd, args)
	},

	touch(args) {
    return h(fs.touch, args)
	},

	rm(args) {
    return h(fs.rm, args)
	},

	mkdir(args) {
    return h(fs.mkdir, args)
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
