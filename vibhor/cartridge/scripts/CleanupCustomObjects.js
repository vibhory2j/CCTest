'use strict';

var Logger = require('dw/system/Logger');
var objMan = require('dw/object');
var util = require('dw/util');
var customObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');

function cleanCustomObjects() {
	var log = Logger.getLogger('Cleanup_Custom_Objects');
	var iterator:util.SeekableIterator;
	var customObj:objMan.CustomObject;
		
	try{
		
	iterator = customObjectMgr.getAllCustomObjects("Weather");
	
	if(iterator.count > 0) {
		while(iterator.hasNext()) {
			customObj = iterator.next();
			//Delete the object
			Transaction.begin();
			customObjectMgr.remove(customObj); //Isn't there a removeall method?
			Transaction.commit();
			
		}
	}
	}catch(e){
		Transaction.rollback();
		var regError = e.causeMessage ? e.causeMessage : e.message;
		log.error(regError);
        res.json({
            error: [regError],
            success: false,
        });
	}finally {
		iterator.close();
	}
}
module.exports = {
		cleanCustomObjects: cleanCustomObjects
}