'use strict';

var Logger = require('dw/system/Logger');
var objMan = require('dw/object');
var HashMap = require('dw/util/HashMap');
var XMLStreamConstants = require('dw/io/XMLStreamConstants');

function importCustomObjects() {
	var log = Logger.getLogger('Import_Custom_Objects');
	let json = {};
	var iterator:SeekableIterator;
	var customObj:CustomObject;
	var customAttr:CustomAttributes;
	
	var str = readData("/IMPEX/src/customization/Import/CustomObjects.json");
	
	if(validateJSON(str) == false) {
		log.error("ERROR: Not a valid JSON provided for import");
		return;
	}
	
	json = JSON.parse(str);
	
	log.info("Valid JSON... moving forward");
	
	try {
		for(var i = 0; i < json.length; i++) {
			dw.system.Transaction.begin();
			if((customObj = objMan.CustomObjectMgr.getCustomObject("Weather", json[i].IPAddress)) == null) {
				customObj = objMan.CustomObjectMgr.createCustomObject("Weather", json[i].IPAddress);
			}
				
			//add/update the custom attributes to the object instance
			if(customObj != null) {
				customAttr = customObj.getCustom();
				customAttr.Temperature=json[i].Temperature;
				customAttr.Type=json[i].Type;
			}
			log.info("Custom object:{}", customObj.toString());
			dw.system.Transaction.commit();
		}
		
	}catch(e){
		log.error(e.message);
		dw.system.Transaction.rollback();
	}
}

function readData(str) {
	
	var log = Logger.getLogger('Import_Custom_Objects');
	
	var reader, file, temp;
	var str = "";
	
	try{
		file = new dw.io.File(str);
		reader = new dw.io.FileReader(file);
		
		while((temp = reader.readLine()) != null) {
			str += temp;
		}
		
	} catch(e){
		log.error(e.errorMessage);
		var regError = e.causeMessage ? e.causeMessage : e.message;
	}finally{
		log.error(str);
	}
	
	return str;
}

function validateJSON(str) {
	var log = Logger.getLogger('Import_Custom_Objects');
	try{
		var o = JSON.parse(str);
		
		if( o && typeof o == "object") {
			return true;
		}
	}catch(e){
		log.error(e.errorMessage);
	}finally{
		log.info("String passed:{}", str);
		log.info("JSON string:{}", o);
	}
	
	return false;
}

function importCustomObjects_xml() {
	
	var log = Logger.getLogger('Import_Custom_Objects');
	
	var reader : dw.io.FileReader;
	var xmlStreamReader : dw.io.XMLStreamReader;
	var file: dw.io.File;
	var cattr = 0, cob = 0 ;
	var customObj = new HashMap();
	var customObjAttr = new HashMap();
	var localName:String;
	
	try{
		file = new dw.io.File("/IMPEX/src/customization/Import/CustomObjects.xml");
		reader = new dw.io.FileReader(file, "UTF-8");
		xmlStreamReader = new dw.io.XMLStreamReader(reader);
		
		while(xmlStreamReader.hasNext()) {
			
			var event = xmlStreamReader.next();
			
			switch (event) {
			
				case XMLStreamConstants.START_ELEMENT:
					localName = xmlStreamReader.getLocalName();
					if (localName == "custom-object") {
						var custom_object : XML = xmlStreamReader.getXMLObject();
						customObj.put(custom_object.attribute("type-id").toString(), custom_object.attribute("object-id").toString());
						var a = custom_object.children();
						for each(x in a) {
							var b = x.attribute("attribute-id").toString();
							if(b.length != 0) {
								customObj.put(b, x.text().toString());
							}
						}
						createOrUpdateCustomObjects(customObj);
						customObj = new HashMap();
					}
					break;
				default:
			}
			
		}
		
	}catch(e){
		var regError = e.causeMessage ? e.causeMessage : e.message;
		log.error(regError);
	}finally{
		xmlStreamReader.close();
		reader.close();
	}
}

function createOrUpdateCustomObjects(customObj) {
	
	var Obj:CustomObject, Attr:CustomAttributes;

	try {
		dw.system.Transaction.begin();
		var a = customObj.get("Weather");
		var b = customObj.get("Type");
		var c = customObj.get("Temperature");
		
		if ((Obj = objMan.CustomObjectMgr.getCustomObject("Weather", customObj.get("Weather"))) == null) {
			Obj = objMan.CustomObjectMgr.createCustomObject("Weather", customObj.get("Weather"));
		}
		
		//add/update the custom attributes to the object instance
		if(Obj != null) {
			Attr = Obj.getCustom();
			Attr.Temperature=parseFloat(customObj.get("Temperature"));
			Attr.Type=customObj.get("Type");
		}
		
		dw.system.Transaction.commit();
	}catch(e){
		dw.system.Transaction.rollback();
		throw e;
	}
	
	
}

function isEmpty(obj) {
	var len = Object.getOwnPropertyNames(obj).length;
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

module.exports = {
		importCustomObjects: importCustomObjects,
		importCustomObjects_xml: importCustomObjects_xml
}
