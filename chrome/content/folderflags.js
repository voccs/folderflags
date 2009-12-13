var FolderFlags = {};

// flags; watch chrome://messenger/locale/messenger.properties for labels
var gFlagList = { 'trash' : 0x0100,
                  'sent' : 0x0200,
                  'drafts' : 0x0400,
                  'outbox' : 0x0800,
                  'inbox' : 0x1000,
                  'archives' : 0x4000,
                  'templates' : 0x400000,
                  'junk' : 0x40000000 };

FolderFlags.onLoad = function() {
    var preselectedFolderURI;
    var folderResource;
    var serverFolderType;
    var folderName;
    var folder;
    var flagsBundle = document.getElementById("bundle_folderflags");
    var msgrBundle = document.getElementById("bundle_messenger");

    var RDF = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);

    if (window.arguments[0].preselectedURI) {
        try {
            preselectedFolderURI = window.arguments[0].preselectedURI;
        } catch (ex) { }
    } else {
        dump("no preselected URI\n");
    }

    if (window.arguments[0].name) {
        folderName = window.arguments[0].name;
    }

    if (window.arguments[0].serverType) {
        serverFolderType = window.arguments[0].serverType;
    }

    folderResource = RDF.GetResource(preselectedFolderURI);

    if (folderResource)
        folder = folderResource.QueryInterface(Components.interfaces.nsIMsgFolder);

    var flags = document.getElementById("folderflags-flaglist");

    // set folder name
    var folderNameLabel = document.getElementById("folderName");
    folderNameLabel.value = folderName;

    for (var flag in gFlagList) {
        var checkbox = document.createElement("checkbox");
        var labelKey = flag + "FolderName";
        var label = msgrBundle.getString(labelKey);
        checkbox.setAttribute("class", "indent");
        checkbox.setAttribute("id", "checkbox_" + flag);
        checkbox.setAttribute("label", label);
        if (folder.flags & gFlagList[flag])
            checkbox.setAttribute("checked", "true");
        flags.appendChild(checkbox);
    }
}

FolderFlags.save = function() {
    var preselectedFolderURI;
    var folderResource;
    var folder;
    var RDF = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);

    if (window.arguments[0].preselectedURI) {
        try {
            preselectedFolderURI = window.arguments[0].preselectedURI;
        } catch (ex) { }
    } else {
        dump("no preselected URI\n");
    }

    folderResource = RDF.GetResource(preselectedFolderURI);

    if (folderResource)
        folder = folderResource.QueryInterface(Components.interfaces.nsIMsgFolder);

    for (var flag in gFlagList) {
        var check = document.getElementById("checkbox_" + flag);

        if (check.checked) {
            // store setting and set flag
            folder.setFlag(gFlagList[flag]);
        } else {
            // remove setting and clear flag
            folder.clearFlag(gFlagList[flag]);
        }
    }

    window.close();
    window.opener.document.getElementById('folderTree').builder.rebuild();
}
