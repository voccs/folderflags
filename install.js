const APP_DISPLAY_NAME = "Folder Flags";
const APP_NAME = "folderflags";
const APP_PACKAGE = "folderflags";
const APP_VERSION = "0.3";

const APP_JAR_FILE = APP_NAME+".jar";
initInstall(APP_NAME, APP_PACKAGE, APP_VERSION);

var chromef = getFolder("Profile", "chrome");
err = addFile(APP_PACKAGE, APP_VERSION, 'chrome/'+APP_JAR_FILE, chromef, null);

if(err == SUCCESS) {
	var jar = getFolder(chromef, APP_JAR_FILE);
	registerChrome(CONTENT | PROFILE_CHROME, jar, 'content/');
	registerChrome(LOCALE | PROFILE_CHROME, jar, 'locale/en-US/');
	registerChrome(SKIN | PROFILE_CHROME, jar, 'skin/classic/folderflags/');

	err = performInstall();
	if(err == SUCCESS || err == 999) {
		alert(APP_NAME + " " + APP_VERSION + " has been succesfully installed.\n"
			+"Please restart your browser before continuing.");
	} else {
		alert("Install failed. Error code:" + err);
		cancelInstall(err);
	}
} else {
	alert("Failed to create " +APP_JAR_FILE +"\n"
		+"You probably don't have appropriate permissions \n"
		+"(write access to mozilla/chrome directory). \n"
		+"_____________________________\nError code:" + err);
	cancelInstall(err);
}
