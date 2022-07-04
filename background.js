async function main() {
  let folderPropsJsUrl = await browser.runtime.getURL("chrome/content/folderProps.js");
  let browserInfo = await browser.runtime.getBrowserInfo();
  let majorVersionNumber = parseInt(browserInfo.version);

  if (majorVersionNumber > 72) {
    // For Thunderbird 78.0 and later
    browser.WindowListener.registerWindow(
      "chrome://messenger/content/folderProps.xhtml",
      folderPropsJsUrl
    );
  } else {
    // For Thunderbird 68
    browser.WindowListener.registerWindow(
      "chrome://messenger/content/folderProps.xul",
      folderPropsJsUrl
    );
  }

  browser.WindowListener.startListening();
}

main();
