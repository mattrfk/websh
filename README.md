_What?_

A terminal simulator (emulator?).

_Why?_

For learning.

TODO:
- repeated code in esh.js
- modularize tests
- arrow key history
- pipes

BUGS:
- cat f f, where f is empty file produces 2 extraneous newlines
- mkdir a; cd a; touch f: f is created in ../a

NOTES:
Debugging node with chrome inspector:
node --inspect --inspect-brk server.js
in chrome, go to chrome://inspect/#devices
