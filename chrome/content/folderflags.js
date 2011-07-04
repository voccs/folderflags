var FolderFlags = {
    // flags; watch chrome://messenger/locale/messenger.properties for labels
    'flagList': {
        'trash' : 0x0100,
        'sent' : 0x0200,
        'drafts' : 0x0400,
        'outbox' : 0x0800,
        'inbox' : 0x1000,
        'archives' : 0x4000,
        'templates' : 0x400000,
        'junk' : 0x40000000
    }
};

FolderFlags._checkEnv = function() {
    // gMsgFolder should exist or all is forfeit
    if (typeof gMsgFolder === "undefined") {
        dump("gMsgFolder doesn't exist, this is an insurmountable problem!");
        return false;
    } else {
        return true;
    }
};

FolderFlags.onLoad = function() {
    if (!FolderFlags._checkEnv())
        return;

    var msgrBundle = document.getElementById("bundle_messenger");
    var flags = document.getElementById("folderflags-flaglist");

    var folderNameLabel = document.getElementById("folderflags-folderName");
    folderNameLabel.value = window.arguments[0].name

    // Fill out a grid of viable flags
    for (var flag in FolderFlags.flagList) {
        var checkbox = document.createElement("checkbox");
        var labelKey = flag + "FolderName";
        var label = msgrBundle.getString(labelKey);
        checkbox.setAttribute("class", "indent");
        checkbox.setAttribute("id", "checkbox_" + flag);
        checkbox.setAttribute("label", label);
        if (gMsgFolder.flags & FolderFlags.flagList[flag])
            checkbox.setAttribute("checked", "true");
        flags.appendChild(checkbox);
    }
};

FolderFlags.onUnload = function() {
    window.removeEventListener("load", FolderFlags.onLoad, false);
    window.removeEventListener("unload", FolderFlags.onUnload, false);
    window.removeEventListener("dialogaccept", FolderFlags.save, false);
};

FolderFlags.save = function() {
    if (!FolderFlags._checkEnv())
        return;

    for (var flag in FolderFlags.flagList) {
        var check = document.getElementById("checkbox_" + flag);

        if (check.checked) {
            // store setting and set flag
            gMsgFolder.setFlag(FolderFlags.flagList[flag]);
        } else {
            // remove setting and clear flag
            gMsgFolder.clearFlag(FolderFlags.flagList[flag]);
        }
    }

    window.opener.document.getElementById('folderTree').builder.rebuild();
};

window.addEventListener("load", FolderFlags.onLoad, false);
window.addEventListener("unload", FolderFlags.onUnload, false);
window.addEventListener("dialogaccept", FolderFlags.save, false);
