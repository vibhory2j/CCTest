'use strict';

var Logger = require('dw/system/Logger');
var arrayList = require('dw/util/ArrayList');
var File = require('dw/io/File');

function cleanupFiles() {
	
	var log = Logger.getLogger('Cleanup_Custom_Objects');
	var list = new arrayList();
	var file:File;
	var temp;
	
	list.push("/IMPEX/src/customization/Export/customattributes.json");
	list.push("/IMPEX/src/customization/Export/customattributes.xml");
	list.push("/IMPEX/src/customization/Import/CustomObjects.json");
	list.push("/IMPEX/src/customization/Import/CustomObjects.xml");
	
	while((temp = list.pop()) != null) {
		file = new dw.io.File(temp);
		file.remove();
	}
}

module.exports = {
		cleanupFiles: cleanupFiles
}
