all: dist

dist:
	rm -f folderflags.xpi
	zip folderflags.xpi --exclude=chrome/Makefile.chrome -r manifest.json license.txt api icon32x32.png _locales

babelzilla:
	make -f Makefile.chrome -C chrome babelzilla
	rm -rf folderflags.xpi
	zip folderflags.xpi chrome/folderflags.jar manifest.json license.txt chrome.manifest _locales/**/*

localize:
	rm -rf chrome/locale/*
	wget http://www.babelzilla.org/wts/download/locale/all/replaced/5239 -O chrome/locale/locales.tar.gz
	cd chrome/locale/; tar xzf locales.tar.gz
	rm -rf chrome/locale/locales.tar.gz

clean:
	rm -f chrome/folderflags.jar folderflags.xpi
