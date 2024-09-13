/* eslint-disable object-shorthand */

"use strict";

// Using a closure to not leak anything but the API to the outside world.
(function (exports) {

  const { ExtensionSupport } = ChromeUtils.importESModule(
    "resource:///modules/ExtensionSupport.sys.mjs"
  );
  const { FolderUtils } = ChromeUtils.importESModule(
    "resource:///modules/FolderUtils.sys.mjs"
  );

  const flagList = {
    'trash': 0x0100,
    'sent': 0x0200,
    'drafts': 0x0400,
    'outbox': 0x0800,
    'inbox': 0x1000,
    'archives': 0x4000,
    'templates': 0x400000,
    'junk': 0x40000000
  }

  // Helper function to inject a legacy XUL string into the DOM of Thunderbird.
  // All injected elements will get the data attribute "data-extension-injected"
  // set to the extension id, for easy removal.
  const injectElements = function (extension, window, xulString, debug = false) {
    function checkElements(stringOfIDs) {
      let arrayOfIDs = stringOfIDs.split(",").map((e) => e.trim());
      for (let id of arrayOfIDs) {
        let element = window.document.getElementById(id);
        if (element) {
          return element;
        }
      }
      return null;
    }

    function localize(entity) {
      let msg = entity.slice("__MSG_".length, -2);
      return extension.localeData.localizeMessage(msg);
    }

    function injectChildren(elements, container) {
      if (debug) console.log(elements);

      for (let i = 0; i < elements.length; i++) {
        if (
          elements[i].hasAttribute("insertafter") &&
          checkElements(elements[i].getAttribute("insertafter"))
        ) {
          let insertAfterElement = checkElements(
            elements[i].getAttribute("insertafter")
          );

          if (debug)
            console.log(
              elements[i].tagName +
              "#" +
              elements[i].id +
              ": insertafter " +
              insertAfterElement.id
            );
          if (
            debug &&
            elements[i].id &&
            window.document.getElementById(elements[i].id)
          ) {
            console.error(
              "The id <" +
              elements[i].id +
              "> of the injected element already exists in the document!"
            );
          }
          elements[i].setAttribute("data-extension-injected", extension.id);
          insertAfterElement.parentNode.insertBefore(
            elements[i],
            insertAfterElement.nextSibling
          );
        } else if (
          elements[i].hasAttribute("insertbefore") &&
          checkElements(elements[i].getAttribute("insertbefore"))
        ) {
          let insertBeforeElement = checkElements(
            elements[i].getAttribute("insertbefore")
          );

          if (debug)
            console.log(
              elements[i].tagName +
              "#" +
              elements[i].id +
              ": insertbefore " +
              insertBeforeElement.id
            );
          if (
            debug &&
            elements[i].id &&
            window.document.getElementById(elements[i].id)
          ) {
            console.error(
              "The id <" +
              elements[i].id +
              "> of the injected element already exists in the document!"
            );
          }
          elements[i].setAttribute("data-extension-injected", extension.id);
          insertBeforeElement.parentNode.insertBefore(
            elements[i],
            insertBeforeElement
          );
        } else if (
          elements[i].id &&
          window.document.getElementById(elements[i].id)
        ) {
          // existing container match, dive into recursively
          if (debug)
            console.log(
              elements[i].tagName +
              "#" +
              elements[i].id +
              " is an existing container, injecting into " +
              elements[i].id
            );
          injectChildren(
            Array.from(elements[i].children),
            window.document.getElementById(elements[i].id)
          );
        } else {
          // append element to the current container
          if (debug)
            console.log(
              elements[i].tagName +
              "#" +
              elements[i].id +
              ": append to " +
              container.id
            );
          elements[i].setAttribute("data-extension-injected", extension.id);
          container.appendChild(elements[i]);
        }
      }
    }

    if (debug) console.log("Injecting into root document:");
    let localizedXulString = xulString.replace(
      /__MSG_(.*?)__/g,
      localize
    );
    injectChildren(
      Array.from(
        window.MozXULElement.parseXULToFragment(localizedXulString, []).children
      ),
      window.document.documentElement
    );
  };

  const onLoad = function (window, extension) {
    const gMsgFolder = window.arguments[0].folder;
    if (!gMsgFolder) {
      return
    }

    injectElements(extension, window, `
      <tab insertafter="QuotaTab" id="FlagsTab" hidefor="rss,nntp" label="__MSG_folderflags.tab.label__"/>
      <vbox insertafter="quotaPanel" id="folderflags-tabPanel" align="start">
          <hbox align="center" valign="middle">
              <label>__MSG_folder__</label><label id="folderflags-folderName" />
          </hbox>
          <vbox id="folderflags-flaglist">
          </vbox>
      </vbox>
    `);

    var flags = window.document.getElementById("folderflags-flaglist");
    var folderNameLabel = window.document.getElementById("folderflags-folderName");
    folderNameLabel.value = window.arguments[0].name;
    const FI = gMsgFolder.QueryInterface(Ci.nsIMsgFolder);

    // Fill out a grid of viable flags
    const fragment = window.document.createDocumentFragment();
    for (var flag in flagList) {
      var checkbox = window.document.createXULElement("checkbox");
      var labelKey = flag + "FolderName";
      var label = labelKey;
      try {
        label = FI.getStringWithFolderNameFromBundle(labelKey);
      }
      catch (ex) {
        console.log(ex);
      }
      checkbox.setAttribute("class", "indent");
      checkbox.setAttribute("id", "checkbox_" + flag);
      checkbox.setAttribute("label", label);
      if (gMsgFolder.flags & flagList[flag])
        checkbox.setAttribute("checked", "true");
      fragment.appendChild(checkbox);
    }
    flags.appendChild(fragment);

    window.addEventListener("dialogaccept", save, false);
  };

  const onUnload = function (window, extension) {
    // Remove all injected objects.
    let elements = Array.from(
      window.document.querySelectorAll(
        '[data-extension-injected="' + extension.id + '"]'
      )
    );
    for (let element of elements) {
      element.remove();
    }
    window.removeEventListener("dialogaccept", save, false);
  };

  const save = function (event) {
    const document = event.target.ownerDocument;
    const window = document.defaultView;
    const gMsgFolder = window.arguments[0].folder;

    if (!gMsgFolder) {
      return
    }

    for (var flag in flagList) {
      var check = document.getElementById("checkbox_" + flag);

      if (check.checked) {
        // store setting and set flag
        gMsgFolder.setFlag(flagList[flag]);
      } else {
        // remove setting and clear flag
        gMsgFolder.clearFlag(flagList[flag]);
      }
    }
    // Thunderbird is correctly changing the icon if a flag was set, but not
    // if all flags got removed.
    // https://searchfox.org/comm-central/rev/631f32633fbc3268d158ee91d1c92dfd2d4b10d6/mail/base/content/widgets/folder-tree-row.mjs#388
    if (FolderUtils.getSpecialFolderString(gMsgFolder) == "none") {
      let opener = window.arguments[0].msgWindow.domWindow;
      let row = [...opener.gTabmail.currentAbout3Pane.folderTree.querySelectorAll("li")].find(r => r.uri == gMsgFolder.URI);
      delete row.dataset.folderType;
    }
  };

  class FolderFlags extends ExtensionCommon.ExtensionAPI {
    getAPI(context) {
      return {
        FolderFlags: {},
      };
    }

    onStartup() {
      const { extension } = this;
      ExtensionSupport.registerWindowListener(extension.id, {
        chromeURLs: [
          "chrome://messenger/content/folderProps.xhtml",
        ],
        onLoadWindow: function (window) {
          onLoad(window, extension);
        },
      });
    }

    onShutdown(isAppShutdown) {
      if (isAppShutdown) {
        return;
      }

      const { extension } = this;
      for (let window of ExtensionSupport.openWindows) {
        if ([
          "chrome://messenger/content/folderProps.xhtml",
        ].includes(window.location.href)) {
          onUnload(window, extension)
        }
      }

      ExtensionSupport.unregisterWindowListener(extension.id);

      // Flush all caches.
      Services.obs.notifyObservers(null, "startupcache-invalidate");
    }
  };

  // Export the api by assigning in to the exports parameter of the anonymous
  // closure function, which is the global this.
  exports.FolderFlags = FolderFlags;

})(this)
