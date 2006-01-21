/* overlay.js
 * Script for use in main app window overlay.
 *
 * Part of FolderFlags by Ryan Lee <ryan@ryanlee.org>
 * Copyright (c) 2005-2006 by Ryan Lee.
 * See the license.txt included in this package for licensing information.
 */

var FolderFlagsOverlay = {
    MsgFolderFlags : function() {
        var flagsBundle = document.getElementById("bundle_folderflags");
        var preselectedURI = GetSelectedFolderURI();
        var msgFolder = GetMsgFolderFromUri(preselectedURI, true);
        var serverType = msgFolder.server.type;
        var folderTree = GetFolderTree();
        var name = GetFolderNameFromUri(preselectedURI, folderTree);
        var windowTitle = flagsBundle.getString("folderFlagsFolderContextPane");
        var dialog = window.openDialog(
              "chrome://folderflags/content/folderflags.xul",
              "",
              "chrome,centerscreen,titlebar,modal",
              {preselectedURI:preselectedURI, serverType:serverType,
              msgWindow:msgWindow, title:windowTitle,
              okCallback:FolderProperties, 
              tabID:"", tabIndex:0, name:name});
    },

    initOverlay : function() {
        // this part evaluates whether to show the folder pane context menu
        //var menu = document.getElementById("folderPaneContext");
        //menu.addEventListener("popupshowing", function() { FolderFlagsOverlay.contextPopupShowing(); }, false);
    },

    contextPopupShowing : function() {
        var hide = false;
        var menuitem = document.getElementById("folderFlags-folderPaneContext-flags");
        var preselectedURI = GetSelectedFolderURI();
        var msgFolder = GetMsgFolderFromUri(preselectedURI, true);

        if (menuitem) {
            // if a server is selected, do not show
            if (msgFolder.isServer) {
                hide = true;
            }

            // don't show vitual folder flags either... I guess?
            if (msgFolder.flags & MSG_FOLDER_FLAG_VIRTUAL) { 
                hide = true;
            }

            menuitem.hidden = hide;
        }
    },

    editPopupShowing : function() {
        var hide = false;
        var menuitem = document.getElementById("folderFlags-menu_Edit-flags");
        var preselectedURI = GetSelectedFolderURI();
        var msgFolder = GetMsgFolderFromUri(preselectedURI, true);

        if (menuitem) {
            // if a server is selected, do not show
            if (msgFolder.isServer) {
                hide = true;
            }

            // don't show vitual folder flags either... I guess?
            if (msgFolder.flags & MSG_FOLDER_FLAG_VIRTUAL) { 
                hide = true;
            }

            menuitem.hidden = hide;
        }
    }
}

window.addEventListener("load", function() { FolderFlagsOverlay.initOverlay(); }, false);
