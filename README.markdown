FolderFlags
===========

This is a Thunderbird add-on for manipulating internal folder type flags.
Mostly it helps mark folders containing server-filtered spam as the Junk
type so those messages aren't run through Thunderbird's junk filtering.
Flags affect both appearance and behavior.

You should acquire it from [addons.mozilla.org][1].  Thanks to the hard
work and commitment of folks at [BabelZilla][2], the add-on is available
in a wide variety of localizations.

Development
-----------

This is a Make based project.  There are two main targets, one builds the
XPI appropriate for deployment (`all`), the other builds an XPI for
translation for upload to BabelZilla (`babelzilla`), which includes strings
that are used in the `install.rdf` and addons.mozilla.org and consequently
sit outside the normal flow of translation.

Mechanism
---------

FolderFlags overlays `chrome://messenger/content/folderProps.xul` and so
adds a new tab, which reads and writes Thunderbird's settings for the
selected folder.

[1]: https://addons.mozilla.org/thunderbird/addon/folderflags/
[2]: http://www.babelzilla.org/
