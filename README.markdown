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
that are used in the `manifest.json` and addons.mozilla.org and consequently
sit outside the normal flow of translation.

Mechanism
---------

FolderFlags overlays `chrome://messenger/content/folderProps.xul` and so
adds a new tab, which reads and writes Thunderbird's settings for the
selected folder.

Contributors
------------

Many thanks to [Itagaki Fumihiko](https://github.com/itagagaki) for contributing the work to bring this add-on up to date with the fundamental shift in Thunderbird add-on architecture, from me and from the users who were waiting on this effort.

Also thanks to [John Bieling](https://github.com/jobisoft) for contributing internationalization updates.

Translators
-----------

With the change from `install.rdf` to `manifest.json`, I'm no longer able to credit translators directly in the extension metadata, so this list will have to suffice for now.  Many thanks for the translation work freely given by:

* Edgard Dias Magalhaes
* Martin Esfeld
* Günter Gersdorf
* Archaeopteryx (BabelZilla)
* Carlos Simão
* ДакСРБИЈА
* Luana Di Muzio - BabelZilla
* elf (Babelzilla)
* Mikael Hiort af Ornäs
* yfdyh000 (yfdyh000@gmail.com)
* Scooter (Babelzilla)

[1]: https://addons.mozilla.org/thunderbird/addon/folderflags/
[2]: http://www.babelzilla.org/
