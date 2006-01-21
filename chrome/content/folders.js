function setFlags(index) {
    var folder = getFolder(index);
    var flags = getFlagChoices(index);
    for (var flag in flags) {
        folder.setFlag(flag);
    }
}

function getFolder(index) {
    // layout XUL DOM
    var resource = RDF.getResource(resourceValue);
    var folder = resource.QueryInterface(Components.interfaces.nsIMsgFolder);
    return folder;    
}

function getFlagChoices(index) {
    return flags;
}

function getCurrentFlags(index) {

}
