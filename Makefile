all: folderflags.xpi

folderflags.xpi:
	make -f Makefile.chrome -C chrome folderflags.jar
	rm -f $@
	zip $@ chrome/folderflags.jar install.rdf license.txt chrome.manifest

clean:
	rm -f chrome/folderflags.jar folderflags.xpi
