'use strict';

importPackage( dw.object );
importPackage( dw.util );

//json
function exportCustomobjects() {
	
	var iterator:SeekableIterator;
	let obj = {};
	var customObj:CustomObject;
	var str:String;
	
	iterator = CustomObjectMgr.getAllCustomObjects("Weather");
	var list = new Array();
	
	try{
	
	if(iterator.count > 0) {
		while(iterator.hasNext()) {
			customObj = iterator.next();
			obj = copy(customObj);
			list.push(obj.custom);
		}
		
		str = JSON.stringify(list);
	}
	}catch(e){
		var regError = e.causeMessage ? e.causeMessage : e.message;
        res.json({
            error: [regError],
            success: false,
        });
	}finally {
		iterator.close();
		list = null;
	}
	
	writeData(str);
	
	return str;
}

function copy(mainObj) {
	let objCopy = {};
	let key;
	
	for (key in mainObj) {
		if(mainObj[key] instanceof CustomAttributes) {
			objCopy[key] = copy(mainObj[key]);
			continue;
		}
		objCopy[key] = mainObj[key];
	}
	
	return objCopy;
}

//json
function writeData(str:String) {
	
	var writer, file;
	
	try{
		file = new dw.io.File("/IMPEX/src/customization/Export/customattributes.json");
		if(!file.exists) {
			file.createNewFile();
			writer = new dw.io.FileWriter(file, false);	
		}else {
			writer = new dw.io.FileWriter(file, true);
		}
	
		writer.write(str);
		writer.flush();
		writer.close();
	} catch(e){
		var regError = e.causeMessage ? e.causeMessage : e.message;
	}
}

//xml format
function writeData_xml(obj:Array) {
	
	var file = new dw.io.File("/IMPEX/src/customization/Export/customattributes.xml");
	var fileWriter = new dw.io.FileWriter(file, "UTF-8");
	var xsw = new dw.io.XMLStreamWriter(fileWriter);
	
	try{
		xsw.writeStartDocument("UTF-8", "1.0");
			xsw.writeStartElement("custom-objects");
			xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/customobject/2006-10-31");
			for (var i = 0; i < obj.length; i++){
				xsw.writeStartElement("custom-object");
				xsw.writeAttribute("type-id", "Weather");
				xsw.writeAttribute("object-id", obj[i].IPAddress);
					xsw.writeStartElement("object-attribute");
					xsw.writeAttribute("attribute-id", "Temperature");
					xsw.writeCharacters(obj[i].Temperature);
					xsw.writeEndElement();
					
					xsw.writeStartElement("object-attribute");
					xsw.writeAttribute("attribute-id", "Type");
					xsw.writeCharacters(obj[i].Type);
					xsw.writeEndElement();
				xsw.writeEndElement();
			}
			xsw.writeEndElement();
		xsw.writeEndDocument();
	
		writer.write(str);
		writer.flush();
		writer.close();
	} catch(e){
		var regError = e.causeMessage ? e.causeMessage : e.message;
	}finally{
		xsw.close();
		fileWriter.close();
	}
}

function exportCustomObjects_xml() {
	
	var iterator:SeekableIterator;
	let obj = {};
	var customObj:CustomObject;
	
	iterator = CustomObjectMgr.getAllCustomObjects("Weather");
	var list = new Array();
	
	try{
	
	if(iterator.count > 0) {
		while(iterator.hasNext()) {
			customObj = iterator.next();
			obj = copy(customObj);
			list.push(obj.custom);
		}
		
		iterator.close();
	}
	}catch(e){
		var regError = e.causeMessage ? e.causeMessage : e.message;
	    res.json({
	        error: [regError],
	        success: false,
	    });
}

writeData_xml(list);
	
}

module.exports = {
	exportCustomobjects: exportCustomobjects,
	exportCustomObjects_xml: exportCustomObjects_xml
};
