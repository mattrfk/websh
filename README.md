_What?_
A terminal simulator.
_Why?_
For learning.

Testing: node tests.js

* terminal.js: the browser interface
* fs.js: the filesystem emulation
	* Interface
		* init(filesystem)
		* ls(path)
		* pwd()
		* touch(path)
		* mkdir(path)
		* rmdir(path)
		*	rm(path)
		* cd(path)
	* Internal
		* createFile(pathString, isDir?)
		* parsePath(pathString) ->
		* join(P1, P2) -> P1/P2
		* getParentDir(P)
		* exists(P)

TODO
	roll walk into exists
	'>>'
	cat
	pipe
	arrow keys, memory
