var FolderFlagsOverlay = {};

FolderFlagsOverlay.MsgFolderFlags = function() {
    var flagsBundle = document.getElementById("bundle_folderflags");
    var folders = GetSelectedMsgFolders();
    var msgFolder = folders.length == 1 ? folders[0] : null;
    if (!msgFolder) return;
    var preselectedURI = msgFolder.URI;
    var serverType = msgFolder.server.type;
    var name = msgFolder.prettyName;
    var windowTitle = flagsBundle.getString("folderFlagsFolderContextPane");
    var dialog = window.openDialog(
          "chrome://folderflags/content/folderflags.xul",
          "",
          "chrome,centerscreen,titlebar,modal",
          {preselectedURI:preselectedURI, serverType:serverType,
          msgWindow:msgWindow, title:windowTitle,
          tabID:"", tabIndex:0, name:name});
}

FolderFlagsOverlay.load = function() {
    var menu = document.getElementById("folderPaneContext");
    if (menu)
        menu.addEventListener("popupshowing", FolderFlagsOverlay.contextPopupShowing, false);

    menu = document.getElementById("menu_EditPopup") || document.getElementById("menu_Edit_Popup");
    if (menu)
        menu.addEventListener("popupshowing", FolderFlagsOverlay.editPopupShowing, false);
}

FolderFlagsOverlay.contextPopupShowing = function(aEvent) {
    var hide = false;
    var menuitem = document.getElementById("folderFlags-folderPaneContext-flags");
    var msgFolder;
    if (window.gFolderTreeView) {
        msgFolder =  gFolderTreeView.getFolderAtCoords(aEvent.clientX, aEvent.clientY);
    } else {
        msgFolder = GetMsgFolderFromUri(GetSelectedFolderURI(), true);
    }
    if (msgFolder != null) {
        if (menuitem) {
            // if a server is selected, do not show
            if (msgFolder.isServer) {
                hide = true;
            }

            // don't show vitual folder flags either... I guess?
            if (msgFolder.flags & Components.interfaces.nsMsgFolderFlags.Virtual) { 
                hide = true;
            }
        } else {
            hide = false;
        }
        menuitem.hidden = hide;
    }
}

FolderFlagsOverlay.editPopupShowing = function(aEvent) {
    var hide = false;
    var menuitem = document.getElementById("folderFlags-menu_Edit-flags") || document.getElementById("folderFlags-menu_Edit-flags-seamonkey");
    var preselectedURI = gFolderDisplay.displayedFolder.URI;
    var msgFolder = GetMsgFolderFromUri(preselectedURI, true);

    if (menuitem) {
        // if a server is selected, do not show
        if (msgFolder.isServer) {
            hide = true;
        }

        // don't show vitual folder flags either... I guess?
        if (msgFolder.flags & Components.interfaces.nsMsgFolderFlags.Virtual) {
            hide = true;
        }

        menuitem.hidden = hide;
    }
}

FolderFlagsOverlay.unload = function() {
    window.removeEventListener("load", FolderFlagsOverlay.load, false);
    window.removeEventListener("unload", FolderFlagsOverlay.unload, false);
}

window.addEventListener("load", FolderFlagsOverlay.load, false);
window.addEventListener("unload", FolderFlagsOverlay.unload, false);
