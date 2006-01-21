all: folderflags.xpi

folderflags.xpi:
	make -f Makefile.chrome -C chrome folderflags.jar
	rm -f $@
	zip $@ chrome/folderflags.jar install.js install.rdf license.txt chrome.manifest defaults/preferences/folderflags-prefs.js 

clean:
	rm -f chrome/folderflags.jar folderflags.xpi
