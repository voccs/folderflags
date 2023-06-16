var gFolderTreeView;
var gMsgFolder;

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

    var flags = document.getElementById("folderflags-flaglist");

    var folderNameLabel = document.getElementById("folderflags-folderName");
    folderNameLabel.value = window.arguments[0].name;
    const FI = gMsgFolder.QueryInterface(Ci.nsIMsgFolder);
    

    // Fill out a grid of viable flags
    const fragment = document.createDocumentFragment();
    for (var flag in FolderFlags.flagList) {
        var checkbox = document.createXULElement("checkbox");
        var labelKey = flag + "FolderName";
        var label = labelKey; // msgrBundle.getString(labelKey);
        try {
            label = FI.getStringWithFolderNameFromBundle(labelKey);
        }
        catch(ex) {
            console.log(ex);
        }
        checkbox.setAttribute("class", "indent");
        checkbox.setAttribute("id", "checkbox_" + flag);
        checkbox.setAttribute("label", label);
        if (gMsgFolder.flags & FolderFlags.flagList[flag])
            checkbox.setAttribute("checked", "true");
        fragment.appendChild(checkbox);
    }
    flags.appendChild(fragment);
};

FolderFlags.onUnload = function() {
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

    // Refresh folder tree pane
    //window.opener.document.getElementById('folderTree').builder.rebuild();
    gFolderTreeView.mode = gFolderTreeView.mode;
};

function onLoad(activatedWhileWindowOpen) {
    if (window.arguments[0].folder) {
        gMsgFolder = window.arguments[0].folder;
        gFolderTreeView = window.arguments[0].treeView;
    }

    WL.injectElements(`
        <tab insertafter="QuotaTab" id="FlagsTab" hidefor="rss,nntp" label="__MSG_folderflags.tab.label__"/>
        <vbox insertafter="quotaPanel" id="folderflags-tabPanel" align="start">
            <hbox align="center" valign="middle">
                <label>__MSG_folder__</label><label id="folderflags-folderName" />
            </hbox>
            <vbox id="folderflags-flaglist">
            </vbox>
        </vbox>
    `);

  FolderFlags.onLoad();
}

function onUnload(deactivatedWhileWindowOpen) {
  FolderFlags.onUnload();
}

window.addEventListener("dialogaccept", FolderFlags.save, false);
