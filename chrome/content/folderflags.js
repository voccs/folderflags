var FolderFlags = {}

// flags; watch nsMsgFolderFlags.h
var gFlagList = { 'MSG_FOLDER_FLAG_VIRTUAL' : 0x0020,
                  'MSG_FOLDER_FLAG_TRASH' : 0x0100,
                  'MSG_FOLDER_FLAG_SENTMAIL' : 0x0200,
                  'MSG_FOLDER_FLAG_DRAFTS' : 0x0400,
                  'MSG_FOLDER_FLAG_QUEUE' : 0x0800,
                  'MSG_FOLDER_FLAG_INBOX' : 0x1000,
                  'MSG_FOLDER_FLAG_TEMPLATES' : 0x400000,
                  'MSG_FOLDER_FLAG_JUNK' : 0x40000000 };

FolderFlags.onLoad = function() {
    var preselectedFolderURI;
    var folderResource;
    var serverTypeFolder;
    var folderName;
    var folder;
    var flagsBundle = document.getElementById("bundle_folderflags");

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
        checkbox.setAttribute("class", "indent");
        checkbox.setAttribute("id", "checkbox_" + flag);
        checkbox.setAttribute("label", flagsBundle.getString(flag + ".label"));
        if (folder.flags & gFlagList[flag])
            checkbox.setAttribute("checked", "true");
        flags.appendChild(checkbox);
    }
}

FolderFlags.onUnload = function() {
    // do nothing
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

    //var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
    //var desiredWindow = windowManager.getMostRecentWindow("mail:3pane");
    //desiredWindow.refresh();
}
